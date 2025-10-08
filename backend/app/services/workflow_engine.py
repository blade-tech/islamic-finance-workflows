"""
WORKFLOW ENGINE
===============
Manages workflow execution state and Claude interactions.

WHY IN-MEMORY:
- Simple prototype approach
- No Redis dependency
- Easy to understand and debug
- Suitable for single-server deployment

FEATURES:
- Execution state management
- Claude interaction orchestration
- Graphiti context retrieval
- User interrupts and guidance
- Progress tracking
"""

import logging
import uuid
from typing import Optional, Dict, Any, List, AsyncGenerator
from datetime import datetime
from enum import Enum
from pydantic import BaseModel

from app.services.claude_service import get_claude_service
from app.services.graphiti_mcp_service import get_graphiti_mcp_service  # NEW: Using MCP

logger = logging.getLogger(__name__)


class ExecutionStatus(str, Enum):
    """Workflow execution status"""
    PENDING = "pending"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    INTERRUPTED = "interrupted"


class ExecutionState(BaseModel):
    """Execution state model"""
    id: str
    template_id: str
    status: ExecutionStatus
    started_at: str
    completed_at: Optional[str] = None
    context_text: Optional[str] = None
    context_document_ids: List[str] = []
    user_notes: Dict[str, str] = {}
    current_response: str = ""
    error: Optional[str] = None
    interrupt_message: Optional[str] = None


class WorkflowEngine:
    """
    In-memory workflow execution engine.

    Manages execution state and orchestrates Claude interactions
    with Graphiti context.
    """

    def __init__(self):
        """Initialize workflow engine"""
        self.executions: Dict[str, ExecutionState] = {}
        logger.info("🔧 Workflow engine initialized (in-memory)")

    def create_execution(
        self,
        template_id: str,
        context_text: Optional[str] = None,
        context_document_ids: List[str] = None,
        user_notes: Dict[str, str] = None
    ) -> str:
        """
        Create a new workflow execution.

        Args:
            template_id: ID of the template to execute
            context_text: Optional context text
            context_document_ids: Optional context document IDs
            user_notes: Optional user notes/guidance

        Returns:
            Execution ID
        """
        execution_id = str(uuid.uuid4())

        execution = ExecutionState(
            id=execution_id,
            template_id=template_id,
            status=ExecutionStatus.PENDING,
            started_at=datetime.now().isoformat(),
            context_text=context_text,
            context_document_ids=context_document_ids or [],
            user_notes=user_notes or {}
        )

        self.executions[execution_id] = execution
        logger.info(f"✅ Created execution: {execution_id}")

        return execution_id

    def get_execution(self, execution_id: str) -> Optional[ExecutionState]:
        """Get execution state by ID"""
        return self.executions.get(execution_id)

    def update_status(self, execution_id: str, status: ExecutionStatus):
        """Update execution status"""
        if execution_id in self.executions:
            self.executions[execution_id].status = status
            if status in [ExecutionStatus.COMPLETED, ExecutionStatus.FAILED]:
                self.executions[execution_id].completed_at = datetime.now().isoformat()
            logger.info(f"📊 Execution {execution_id} status: {status}")

    def add_interrupt(self, execution_id: str, message: str):
        """Add user interrupt/guidance message"""
        if execution_id in self.executions:
            self.executions[execution_id].interrupt_message = message
            self.executions[execution_id].status = ExecutionStatus.INTERRUPTED
            logger.info(f"⏸️ Execution {execution_id} interrupted with message")

    def clear_interrupt(self, execution_id: str):
        """Clear interrupt and resume execution"""
        if execution_id in self.executions:
            self.executions[execution_id].interrupt_message = None
            self.executions[execution_id].status = ExecutionStatus.RUNNING
            logger.info(f"▶️ Execution {execution_id} resumed")

    async def execute_workflow(
        self,
        execution_id: str,
        system_prompt: str,
        required_standards: List[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Execute workflow with Claude streaming.

        Args:
            execution_id: Execution ID
            system_prompt: Template system prompt
            required_standards: Optional list of required AAOIFI standards for context retrieval

        Yields:
            Response chunks from Claude
        """
        execution = self.get_execution(execution_id)
        if not execution:
            raise ValueError(f"Execution not found: {execution_id}")

        try:
            # Update status to running
            self.update_status(execution_id, ExecutionStatus.RUNNING)

            # Build user message
            user_message = self._build_user_message(execution)

            # Get Graphiti context if documents are provided OR if required standards specified
            context = None
            if execution.context_document_ids or execution.context_text or required_standards:
                context = await self._get_graphiti_context(
                    execution=execution,
                    required_standards=required_standards
                )

            # Get Claude service and stream response
            claude_service = get_claude_service()

            async for chunk in claude_service.stream_generate(
                system_prompt=system_prompt,
                user_message=user_message,
                context=context,
                metadata={
                    "execution_id": execution_id,
                    "template_id": execution.template_id
                }
            ):
                # Check for interrupts
                current_execution = self.get_execution(execution_id)
                if current_execution.status == ExecutionStatus.INTERRUPTED:
                    logger.info(f"⏸️ Execution paused due to interrupt")
                    yield f"\n\n**[INTERRUPTED]**\n"
                    yield f"User guidance: {current_execution.interrupt_message}\n\n"

                    # Resume with guidance
                    self.clear_interrupt(execution_id)
                    continue

                # Accumulate response
                execution.current_response += chunk
                yield chunk

            # Mark as completed
            self.update_status(execution_id, ExecutionStatus.COMPLETED)
            logger.info(f"✅ Execution {execution_id} completed successfully")

        except Exception as e:
            logger.error(f"❌ Execution {execution_id} failed: {e}")
            execution.error = str(e)
            self.update_status(execution_id, ExecutionStatus.FAILED)
            raise

    def _build_user_message(self, execution: ExecutionState) -> str:
        """Build user message from execution context"""
        parts = []

        # Add user notes if provided
        if execution.user_notes:
            parts.append("**User Guidance:**")
            for key, value in execution.user_notes.items():
                parts.append(f"- {key}: {value}")
            parts.append("")

        # Add context text if provided
        if execution.context_text:
            parts.append("**Additional Context:**")
            parts.append(execution.context_text)
            parts.append("")

        # Add instruction
        parts.append("Please proceed with the task according to the template instructions.")

        return "\n".join(parts)

    async def _get_graphiti_context(
        self,
        execution: ExecutionState,
        required_standards: List[str] = None
    ) -> str:
        """
        Retrieve relevant context from Graphiti knowledge graph.

        Uses enhanced search to get facts, entities, and episodes.

        Args:
            execution: Execution state containing context and user notes
            required_standards: List of required AAOIFI standards (e.g., ['FAS 2', 'SS 17/45'])

        Returns:
            Formatted context string with facts, entities, and standards
        """
        try:
            # Use MCP service instead of direct Graphiti client
            graphiti_mcp_service = get_graphiti_mcp_service()

            # Build search query from context text and notes
            search_parts = []
            if execution.context_text:
                search_parts.append(execution.context_text[:300])  # Increased from 200
            if execution.user_notes:
                search_parts.extend(execution.user_notes.values())

            search_query = " ".join(search_parts)

            if not search_query.strip():
                search_query = "Islamic finance compliance requirements"

            logger.info(f"🔍 Searching Graphiti via MCP for context: '{search_query[:100]}...'")

            # Use MCP search (blade-graphiti)
            results = await graphiti_mcp_service.search(
                query_text=search_query,
                group_ids=["aaoifi-documents", "context-documents"],  # Match MCP group_id naming
                num_results=10
            )

            # Build rich context from search results
            context_parts = []

            # Section 1: Key Facts (from enhanced search)
            if results.get('facts'):
                context_parts.append("## AAOIFI Standards and Compliance Requirements\n")

                # Group facts by relevance
                high_relevance = [f for f in results['facts'] if f.get('relevance', 0) >= 0.7]

                if high_relevance:
                    for i, fact_data in enumerate(high_relevance[:5], 1):
                        fact_text = fact_data.get('fact', '')
                        relevance = fact_data.get('relevance', 0)
                        context_parts.append(
                            f"{i}. [{relevance*100:.0f}% relevant] {fact_text}"
                        )
                    context_parts.append("")  # Blank line

            # Section 2: Required Standards (if specified by template)
            if required_standards:
                context_parts.append("## Required Standards for This Workflow\n")
                context_parts.append(f"You must reference and apply: {', '.join(required_standards)}")
                context_parts.append("")

            # Section 3: Related Entities (if available)
            if results.get('entities') and len(results['entities']) > 0:
                context_parts.append("## Related Entities\n")
                for entity in results['entities'][:3]:  # Top 3 entities
                    entity_name = entity.get('name', '')
                    entity_summary = entity.get('summary', '')
                    if entity_name:
                        context_parts.append(f"- **{entity_name}**: {entity_summary}")
                context_parts.append("")

            # Section 4: Context Quality Indicator
            confidence = results.get('confidence', 'low')
            fact_count = len(results.get('facts', []))

            context_parts.append(f"---")
            context_parts.append(
                f"*Context quality: {confidence} ({fact_count} facts retrieved)*\n"
            )

            formatted_context = "\n".join(context_parts)

            logger.info(
                f"✅ Retrieved Graphiti context: {fact_count} facts, "
                f"{len(results.get('entities', []))} entities, confidence={confidence}"
            )

            return formatted_context

        except Exception as e:
            logger.error(f"❌ Failed to retrieve Graphiti context: {e}")
            # Return empty string on error - don't break the workflow
            return ""


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_workflow_engine: Optional[WorkflowEngine] = None


def get_workflow_engine() -> WorkflowEngine:
    """Get or create workflow engine singleton"""
    global _workflow_engine
    if _workflow_engine is None:
        _workflow_engine = WorkflowEngine()
    return _workflow_engine
