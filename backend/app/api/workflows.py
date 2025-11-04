"""
WORKFLOW API ENDPOINTS
======================
Endpoints for workflow execution and management.

FEATURES:
- Create workflow executions
- SSE streaming for real-time Claude responses
- Interrupt handling for user guidance
- Execution status tracking
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime

from app.services import get_workflow_engine, get_template_service
from app.services.methodology_service import methodology_service
from app.models import (
    GenerateTemplateFromMethodologiesRequest,
    GenerateTemplateFromMethodologiesResponse,
    WorkflowTemplate,
    WorkflowStep,
    AxialCode,
)

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class ExecuteWorkflowRequest(BaseModel):
    """Request to execute a workflow"""
    template_id: str
    context_text: Optional[str] = None
    context_document_ids: list[str] = []
    user_notes: dict[str, str] = {}


class ExecuteWorkflowResponse(BaseModel):
    """Response after workflow execution starts"""
    execution_id: str
    status: str
    stream_url: str


class InterruptRequest(BaseModel):
    """Request to interrupt execution with guidance"""
    message: str


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/workflows/execute", response_model=ExecuteWorkflowResponse)
async def execute_workflow(request: ExecuteWorkflowRequest):
    """
    Create a new workflow execution.

    Args:
        request: Workflow execution parameters

    Returns:
        Execution ID and stream URL
    """
    try:
        # Get workflow engine and template service
        engine = get_workflow_engine()
        template_service = get_template_service()

        # Validate template exists
        template = template_service.get_template(request.template_id)
        if not template:
            raise HTTPException(
                status_code=404,
                detail=f"Template not found: {request.template_id}"
            )

        # Create execution
        execution_id = engine.create_execution(
            template_id=request.template_id,
            context_text=request.context_text,
            context_document_ids=request.context_document_ids,
            user_notes=request.user_notes
        )

        logger.info(f"✅ Created workflow execution: {execution_id}")

        return ExecuteWorkflowResponse(
            execution_id=execution_id,
            status="pending",
            stream_url=f"/api/workflows/{execution_id}/stream"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to create execution: {e}")
        raise HTTPException(status_code=500, detail=f"Execution creation failed: {str(e)}")


@router.get("/workflows/{execution_id}/stream")
async def stream_claude(execution_id: str):
    """
    Stream Claude execution using Server-Sent Events (SSE).

    Args:
        execution_id: Workflow execution ID

    Returns:
        SSE stream of Claude responses
    """
    try:
        # Get workflow engine and template service
        engine = get_workflow_engine()
        template_service = get_template_service()

        # Get execution
        execution = engine.get_execution(execution_id)
        if not execution:
            raise HTTPException(
                status_code=404,
                detail=f"Execution not found: {execution_id}"
            )

        # Get template
        template = template_service.get_template(execution.template_id)
        if not template:
            raise HTTPException(
                status_code=404,
                detail=f"Template not found: {execution.template_id}"
            )

        # Define SSE generator
        async def event_generator():
            """Generate SSE events from Claude stream"""
            try:
                # Send initial status
                yield f"event: status\ndata: {{\"status\": \"starting\"}}\n\n"

                # Stream Claude response with required standards from template
                async for chunk in engine.execute_workflow(
                    execution_id=execution_id,
                    system_prompt=template.system_prompt,
                    required_standards=template.required_standards  # Pass AAOIFI standards
                ):
                    # Send chunk as SSE event
                    # Escape newlines and quotes for JSON
                    chunk_escaped = chunk.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
                    yield f"event: chunk\ndata: {{\"text\": \"{chunk_escaped}\"}}\n\n"

                # Send completion status
                final_execution = engine.get_execution(execution_id)
                yield f"event: status\ndata: {{\"status\": \"{final_execution.status}\"}}\n\n"
                yield f"event: done\ndata: {{\"execution_id\": \"{execution_id}\"}}\n\n"

            except Exception as e:
                logger.error(f"❌ Stream error: {e}")
                error_msg = str(e).replace('"', '\\"')
                yield f"event: error\ndata: {{\"error\": \"{error_msg}\"}}\n\n"

        # Return SSE response
        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"  # Disable nginx buffering
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to start stream: {e}")
        raise HTTPException(status_code=500, detail=f"Stream failed: {str(e)}")


@router.post("/workflows/{execution_id}/interrupt")
async def interrupt_execution(execution_id: str, request: InterruptRequest):
    """
    Interrupt execution with user guidance.

    Args:
        execution_id: Workflow execution ID
        request: Interrupt message

    Returns:
        Success confirmation
    """
    try:
        engine = get_workflow_engine()

        # Get execution
        execution = engine.get_execution(execution_id)
        if not execution:
            raise HTTPException(
                status_code=404,
                detail=f"Execution not found: {execution_id}"
            )

        # Add interrupt
        engine.add_interrupt(execution_id, request.message)

        logger.info(f"⏸️ Execution {execution_id} interrupted")

        return {"status": "interrupted", "message": "Execution paused for guidance"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to interrupt: {e}")
        raise HTTPException(status_code=500, detail=f"Interrupt failed: {str(e)}")


@router.get("/workflows/{execution_id}/status")
async def get_execution_status(execution_id: str):
    """
    Get execution status.

    Args:
        execution_id: Workflow execution ID

    Returns:
        Execution state
    """
    try:
        engine = get_workflow_engine()

        execution = engine.get_execution(execution_id)
        if not execution:
            raise HTTPException(
                status_code=404,
                detail=f"Execution not found: {execution_id}"
            )

        return execution.model_dump()

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to get status: {e}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")


@router.post("/workflows/generate-from-methodologies", response_model=GenerateTemplateFromMethodologiesResponse)
async def generate_template_from_methodologies(request: GenerateTemplateFromMethodologiesRequest):
    """
    Generate a WorkflowTemplate from selected methodologies.

    This endpoint combines multiple Guardian-style methodologies into a single
    executable workflow template. The generated template:
    - Combines all schemas, policy steps, and required roles
    - Creates natural language open code describing the combined workflow
    - Generates structured axial code for execution

    Args:
        request: List of methodology IDs to combine

    Returns:
        Generated WorkflowTemplate ready for execution
    """
    try:
        # Fetch all selected methodologies
        methodologies = []
        for method_id in request.methodology_ids:
            methodology = methodology_service.get_methodology(method_id)
            if not methodology:
                raise HTTPException(
                    status_code=404,
                    detail=f"Methodology not found: {method_id}"
                )
            methodologies.append(methodology)

        logger.info(f"📚 Combining {len(methodologies)} methodologies into template")

        # Generate combined statistics
        total_schemas = sum(m.schema_count for m in methodologies)
        total_policy_steps = sum(m.policy_steps for m in methodologies)

        # Deduplicate and combine roles
        all_roles = []
        for m in methodologies:
            all_roles.extend(m.required_roles)
        unique_roles = list(set(all_roles))

        # Generate template ID and name
        if len(methodologies) == 1:
            template_id = f"tmpl-{methodologies[0].id}"
            template_name = methodologies[0].name
            template_description = methodologies[0].description
        else:
            template_id = f"tmpl-combined-{'-'.join(m.id.split('-')[-1] for m in methodologies[:3])}"
            template_name = f"Combined: {', '.join(m.name for m in methodologies)}"
            template_description = f"Composite workflow combining {len(methodologies)} methodologies: " + \
                                  ", ".join(m.name for m in methodologies)

        # Determine category (use first methodology's category as primary)
        # Map methodology categories to template categories
        category_map = {
            'mudarabah': 'partnership',
            'musharakah': 'partnership',
            'murabaha': 'debt',
            'sukuk': 'debt',
            'ijara': 'lease',
            'wakala': 'agency',
            'takaful': 'partnership',
        }
        primary_category = methodologies[0].category or 'partnership'
        template_category = category_map.get(primary_category, 'partnership')

        # Generate open code template (natural language description)
        open_code_parts = []
        open_code_parts.append("# Islamic Finance Workflow - Generated from Methodologies\n")
        open_code_parts.append(f"\n## Overview\n")
        open_code_parts.append(f"This workflow combines {len(methodologies)} digitized methodologies:\n")
        for i, m in enumerate(methodologies, 1):
            open_code_parts.append(f"{i}. **{m.name}** ({m.standard or 'Custom'})\n")
            open_code_parts.append(f"   - {m.description}\n")

        open_code_parts.append(f"\n## Combined Components\n")
        open_code_parts.append(f"- **Total Data Schemas**: {total_schemas}\n")
        open_code_parts.append(f"- **Total Policy Steps**: {total_policy_steps}\n")
        open_code_parts.append(f"- **Required Roles**: {', '.join(unique_roles)}\n")

        open_code_parts.append(f"\n## Workflow Execution\n")
        open_code_parts.append("This workflow will execute the following high-level steps:\n")
        open_code_parts.append("1. Validate compliance with AAOIFI and IIFM standards\n")
        open_code_parts.append("2. Verify all required role assignments\n")
        open_code_parts.append("3. Execute methodology-specific policy steps\n")
        open_code_parts.append("4. Generate Shariah-compliant documentation\n")
        open_code_parts.append("5. Perform final validation and certification\n")

        open_code_template = "".join(open_code_parts)

        # Generate axial code (structured execution steps)
        steps = []

        # Step 1: Validation
        steps.append(WorkflowStep(
            id="step-1-validation",
            name="Standards Validation",
            type="validate",
            instruction=f"Validate compliance with {', '.join(set(m.standard or 'Custom' for m in methodologies))} standards",
            axial_params={
                "standards": list(set(m.standard or 'Custom' for m in methodologies)),
                "required_schemas": total_schemas,
            },
            sources=["AAOIFI"],
            expected_output="Validation report confirming compliance with all standards"
        ))

        # Step 2: Role verification
        steps.append(WorkflowStep(
            id="step-2-roles",
            name="Role Assignment Verification",
            type="validate",
            instruction=f"Verify assignment of required roles: {', '.join(unique_roles)}",
            axial_params={
                "required_roles": unique_roles,
            },
            sources=["Graphiti"],
            expected_output="Confirmation of all required role assignments"
        ))

        # Step 3: Policy execution (one step per methodology)
        for i, m in enumerate(methodologies, 1):
            steps.append(WorkflowStep(
                id=f"step-3-{i}-policy-{m.id}",
                name=f"Execute {m.name} Policies",
                type="generate",
                instruction=f"Execute {m.policy_steps} policy steps from {m.name}",
                axial_params={
                    "methodology_id": m.id,
                    "policy_steps": m.policy_steps,
                    "schemas": m.schema_count,
                },
                sources=["AAOIFI", "Graphiti"],
                expected_output=f"Completed {m.name} policy execution with all steps validated"
            ))

        # Step 4: Document generation
        steps.append(WorkflowStep(
            id="step-4-documentation",
            name="Generate Shariah-Compliant Documentation",
            type="generate",
            instruction="Generate complete Shariah-compliant documentation based on all executed policies",
            axial_params={
                "methodologies": [m.id for m in methodologies],
                "output_format": "markdown",
            },
            sources=["AAOIFI", "Graphiti", "Claude"],
            expected_output="Complete Shariah-compliant documentation package"
        ))

        # Step 5: Final validation
        steps.append(WorkflowStep(
            id="step-5-certification",
            name="Final Validation and Certification",
            type="validate",
            instruction="Perform final validation and generate certification report",
            axial_params={
                "certification_required": True,
            },
            sources=["AAOIFI", "Graphiti"],
            expected_output="Certification report confirming Shariah compliance"
        ))

        axial_code = AxialCode(
            steps=steps,
            required_sources=["AAOIFI", "Graphiti"],
            output_format="markdown",
            estimated_duration=15 * len(methodologies),  # 15 min per methodology
            complexity="complex" if len(methodologies) > 1 else "moderate"
        )

        # Create the template
        now = datetime.now()
        template = WorkflowTemplate(
            id=template_id,
            name=template_name,
            description=template_description,
            icon="FileCheck",  # Default icon for methodology-based templates
            category=template_category,
            open_code_template=open_code_template,
            axial_code=axial_code,
            version="1.0.0",
            created_at=now,
            updated_at=now,
            execution_count=0,
            success_rate=0.0,
            average_rating=0.0,
            refinements=[]
        )

        logger.info(f"✅ Generated template: {template.id} with {len(steps)} steps")

        return GenerateTemplateFromMethodologiesResponse(template=template)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to generate template: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Template generation failed: {str(e)}"
        )
