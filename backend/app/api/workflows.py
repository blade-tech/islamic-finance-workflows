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

from app.services import get_workflow_engine, get_template_service

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
