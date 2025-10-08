"""
SESSION API ENDPOINTS
=====================
RESTful API for managing multi-turn Claude conversation sessions.

FOLLOWS ANTHROPIC AGENT SDK PATTERNS:
- Create session → Get session_id
- Stream with full message history
- Interrupt → Append user message
- Resume → Continue conversation

ENDPOINTS:
- POST   /api/sessions/create           - Create new session
- GET    /api/sessions/{id}/stream      - Stream Claude response
- POST   /api/sessions/{id}/interrupt   - Add user message (interrupt)
- GET    /api/sessions/{id}             - Get session state
- DELETE /api/sessions/{id}             - Delete session

MIGRATION FROM OLD API:
- Old: POST /api/workflows/execute → GET /api/workflows/{id}/stream
- New: POST /api/sessions/create → GET /api/sessions/{id}/stream
- Benefit: Multi-turn conversations, interrupts, collaborative UX
"""

import logging
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.session_service import (
    get_session_service,
    SessionStatus,
    MessageRole
)
from app.services.claude_service import get_claude_service
from app.services.graphiti_mcp_service import get_graphiti_mcp_service

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class CreateSessionRequest(BaseModel):
    """Request to create a new conversation session"""
    template_id: str
    system_prompt: str
    initial_message: Optional[str] = None
    context_text: Optional[str] = None
    context_document_ids: List[str] = []
    user_notes: Dict[str, str] = {}
    execution_id: Optional[str] = None  # Link to legacy WorkflowEngine execution


class CreateSessionResponse(BaseModel):
    """Response after creating session"""
    session_id: str
    stream_url: str
    status: str


class InterruptSessionRequest(BaseModel):
    """Request to interrupt session with user message"""
    message: str


class InterruptSessionResponse(BaseModel):
    """Response after interrupt"""
    status: str
    message_count: int
    ready_to_resume: bool


class SessionStateResponse(BaseModel):
    """Session state for client"""
    session_id: str
    template_id: str
    status: str
    message_count: int
    created_at: str
    last_updated: str


# ============================================================================
# SESSION LIFECYCLE ENDPOINTS
# ============================================================================

@router.post("/create", response_model=CreateSessionResponse)
async def create_session(request: CreateSessionRequest):
    """
    Create a new conversation session.

    This is the entry point for starting a new Claude conversation.
    Returns a session_id and stream_url for streaming responses.

    FLOW:
    1. Create session with system prompt + initial message
    2. Return session_id
    3. Client connects to /stream endpoint
    4. Client can /interrupt at any time
    5. Client reconnects to /stream to continue

    Args:
        request: Session configuration

    Returns:
        session_id and stream_url for SSE connection
    """
    try:
        session_service = get_session_service()

        # Create session with initial message
        session = session_service.create_session(
            template_id=request.template_id,
            system_prompt=request.system_prompt,
            initial_message=request.initial_message,
            context_text=request.context_text,
            context_document_ids=request.context_document_ids,
            user_notes=request.user_notes,
            execution_id=request.execution_id
        )

        logger.info(f"✅ Created session: {session.session_id}")

        return CreateSessionResponse(
            session_id=session.session_id,
            stream_url=f"/api/sessions/{session.session_id}/stream",
            status=session.status.value
        )

    except Exception as e:
        logger.error(f"❌ Failed to create session: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{session_id}/stream")
async def stream_session(session_id: str):
    """
    Stream Claude response for the current conversation state.

    STATEFUL STREAMING:
    - Retrieves full message history from session
    - Sends complete history to Claude API (stateless API)
    - Streams response chunks via SSE
    - Appends assistant response to session after completion

    SSE EVENTS:
    - event: status, data: {"status": "starting"}
    - event: chunk, data: {"text": "..."}
    - event: status, data: {"status": "completed"}
    - event: done, data: {"session_id": "..."}

    CLIENT BEHAVIOR:
    - Can abort stream at any time (AbortController)
    - After interrupt, call /interrupt endpoint
    - Then reconnect to /stream to resume

    Args:
        session_id: Session identifier

    Returns:
        Server-Sent Events stream
    """
    session_service = get_session_service()
    session = session_service.get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")

    if session.status == SessionStatus.FAILED:
        raise HTTPException(status_code=400, detail=f"Session in failed state: {session.error_message}")

    try:
        # Update status to streaming
        session_service.update_status(session_id, SessionStatus.STREAMING)

        # Get Claude service
        claude_service = get_claude_service()

        # Get Graphiti context if needed (from initial setup)
        context = None
        if session.context_document_ids or session.context_text:
            context = await _get_graphiti_context(session)

        # Build messages for Claude (from session history)
        messages = session_service.get_messages_for_claude(session_id)

        if not messages:
            raise HTTPException(
                status_code=400,
                detail="Session has no messages. Call /interrupt to add a message first."
            )

        # Add context to first user message if this is the first turn
        if context and len(messages) == 1:
            messages[0]["content"] = f"{context}\n\n---\n\n{messages[0]['content']}"

        # SSE generator function
        async def event_generator():
            try:
                # Send start status
                yield f"event: status\ndata: {{\"status\": \"starting\"}}\n\n"

                # Stream Claude response
                full_response = ""

                async for chunk in claude_service.stream_with_messages(
                    system_prompt=session.system_prompt,
                    messages=messages,
                    metadata={"session_id": session_id, "template_id": session.template_id}
                ):
                    # Escape special characters for JSON
                    chunk_escaped = chunk.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
                    yield f"event: chunk\ndata: {{\"text\": \"{chunk_escaped}\"}}\n\n"
                    full_response += chunk

                # Append assistant response to session
                session_service.append_message(
                    session_id=session_id,
                    role=MessageRole.ASSISTANT,
                    content=full_response
                )

                # Update status to active (ready for next turn)
                session_service.update_status(session_id, SessionStatus.ACTIVE)

                # Send completion status
                yield f"event: status\ndata: {{\"status\": \"completed\"}}\n\n"
                yield f"event: done\ndata: {{\"session_id\": \"{session_id}\"}}\n\n"

                logger.info(f"✅ Session {session_id} stream completed ({len(full_response)} chars)")

            except Exception as e:
                logger.error(f"❌ Session {session_id} stream error: {e}")
                session_service.update_status(
                    session_id,
                    SessionStatus.FAILED,
                    error_message=str(e)
                )
                error_msg = str(e).replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
                yield f"event: error\ndata: {{\"error\": \"{error_msg}\"}}\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",  # Disable nginx buffering
            }
        )

    except Exception as e:
        logger.error(f"❌ Failed to stream session {session_id}: {e}")
        session_service.update_status(session_id, SessionStatus.FAILED, error_message=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{session_id}/interrupt", response_model=InterruptSessionResponse)
async def interrupt_session(session_id: str, request: InterruptSessionRequest):
    """
    Interrupt the current conversation with a user message.

    INTERRUPT FLOW:
    1. Client aborts current stream (AbortController)
    2. Client calls this endpoint with new user message
    3. Backend appends user message to session
    4. Client reconnects to /stream to get response

    This enables collaborative, interactive conversations like Claude CLI:
    - User can add context mid-stream
    - User can correct course during generation
    - User can ask follow-up questions
    - Always maintains full conversation history

    Args:
        session_id: Session identifier
        request: User message to append

    Returns:
        Status and message count
    """
    session_service = get_session_service()
    session = session_service.get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")

    try:
        # Append user message to session
        success = session_service.append_message(
            session_id=session_id,
            role=MessageRole.USER,
            content=request.message
        )

        if not success:
            raise HTTPException(status_code=500, detail="Failed to append message")

        # Update status to interrupted (ready for next stream)
        session_service.update_status(session_id, SessionStatus.INTERRUPTED)

        logger.info(
            f"⏸️ Session {session_id} interrupted "
            f"(message: {len(request.message)} chars, "
            f"total messages: {len(session.messages)})"
        )

        return InterruptSessionResponse(
            status="interrupted",
            message_count=len(session.messages),
            ready_to_resume=True
        )

    except Exception as e:
        logger.error(f"❌ Failed to interrupt session {session_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{session_id}", response_model=SessionStateResponse)
async def get_session(session_id: str):
    """
    Get session state (for debugging and UI updates).

    Returns high-level session info without full message history.
    Use this to check session status, message count, etc.

    Args:
        session_id: Session identifier

    Returns:
        Session state
    """
    session_service = get_session_service()
    session = session_service.get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")

    return SessionStateResponse(
        session_id=session.session_id,
        template_id=session.template_id,
        status=session.status.value,
        message_count=len(session.messages),
        created_at=session.created_at,
        last_updated=session.last_updated
    )


@router.delete("/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a session (cleanup).

    Call this when user closes conversation or on timeout.
    Frees up server memory.

    Args:
        session_id: Session identifier

    Returns:
        Success status
    """
    session_service = get_session_service()
    success = session_service.delete_session(session_id)

    if not success:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")

    logger.info(f"🗑️ Deleted session: {session_id}")

    return {"deleted": True, "session_id": session_id}


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

async def _get_graphiti_context(session) -> str:
    """
    Retrieve Graphiti context for session.

    Uses the context_text and context_document_ids from session
    to search the knowledge graph.

    Args:
        session: SessionState

    Returns:
        Formatted context string
    """
    try:
        graphiti_mcp_service = get_graphiti_mcp_service()

        # Build search query from context
        search_parts = []
        if session.context_text:
            search_parts.append(session.context_text[:300])
        if session.user_notes:
            search_parts.extend(session.user_notes.values())

        search_query = " ".join(search_parts)

        if not search_query.strip():
            search_query = "Islamic finance compliance requirements"

        logger.info(f"🔍 Searching Graphiti for session context: '{search_query[:100]}...'")

        # Search using MCP
        results = await graphiti_mcp_service.search(
            query_text=search_query,
            group_ids=["aaoifi-documents", "context-documents"],
            num_results=10
        )

        # Build context from results
        context_parts = []

        if results.get('facts'):
            context_parts.append("## AAOIFI Standards and Compliance Requirements\n")

            high_relevance = [f for f in results['facts'] if f.get('relevance', 0) >= 0.7]

            if high_relevance:
                for i, fact_data in enumerate(high_relevance[:5], 1):
                    fact_text = fact_data.get('fact', '')
                    relevance = fact_data.get('relevance', 0)
                    context_parts.append(
                        f"{i}. [{relevance*100:.0f}% relevant] {fact_text}"
                    )
                context_parts.append("")

        # Context quality indicator
        confidence = results.get('confidence', 'low')
        fact_count = len(results.get('facts', []))

        context_parts.append(f"---")
        context_parts.append(
            f"*Context quality: {confidence} ({fact_count} facts retrieved)*\n"
        )

        formatted_context = "\n".join(context_parts)

        logger.info(
            f"✅ Retrieved Graphiti context: {fact_count} facts, confidence={confidence}"
        )

        return formatted_context

    except Exception as e:
        logger.error(f"❌ Failed to retrieve Graphiti context: {e}")
        return ""
