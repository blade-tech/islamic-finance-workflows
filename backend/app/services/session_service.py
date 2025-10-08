"""
SESSION SERVICE
===============
Server-side session management for multi-turn Claude conversations.

WHY SESSION STORAGE:
- Avoid sending large message arrays on every request
- Maintain conversation context across multiple API calls
- Enable interrupts and collaborative editing
- Follow Anthropic Agent SDK patterns

ARCHITECTURE:
- In-memory storage (dict) for MVP (easy to upgrade to Redis)
- Session contains: system_prompt, messages[], metadata
- Messages follow Anthropic format: {"role": "user|assistant", "content": "..."}
- Stateful sessions but stateless Claude API (send full history each time)

FLOW:
1. Create session → Get session_id
2. Stream session → Claude processes full message history
3. Interrupt session → Append user message, ready for next stream
4. Resume session → Continue with updated history
"""

import logging
import uuid
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class MessageRole(str, Enum):
    """Message roles following Anthropic's official format"""
    USER = "user"
    ASSISTANT = "assistant"


class Message(BaseModel):
    """
    Single message in a conversation.

    Follows Anthropic's official message format:
    - role: "user" or "assistant" (must alternate)
    - content: message text
    - timestamp: when message was created (for debugging)
    """
    role: MessageRole
    content: str
    timestamp: str = None

    def __init__(self, **data):
        if 'timestamp' not in data:
            data['timestamp'] = datetime.now().isoformat()
        super().__init__(**data)


class SessionStatus(str, Enum):
    """Session lifecycle status"""
    ACTIVE = "active"           # Session created, ready to stream
    STREAMING = "streaming"     # Currently streaming Claude response
    INTERRUPTED = "interrupted" # User interrupted, waiting for input
    COMPLETED = "completed"     # Conversation complete
    FAILED = "failed"          # Error occurred


class SessionState(BaseModel):
    """
    Server-side conversation session state.

    FOLLOWS ANTHROPIC AGENT SDK PATTERNS:
    - system_prompt: Separate from messages (Anthropic requirement)
    - messages: Full conversation history [user, assistant, user, ...]
    - Must alternate user/assistant roles
    - Stateless API: send full history to Claude each time

    SESSION METADATA:
    - session_id: Unique identifier for this conversation
    - template_id: Which workflow template is running
    - status: Current lifecycle status
    - created_at: Session creation timestamp
    - last_updated: Last activity timestamp
    """
    session_id: str
    template_id: str
    system_prompt: str
    messages: List[Message] = []
    status: SessionStatus = SessionStatus.ACTIVE
    created_at: str
    last_updated: str

    # Optional context (from workflow engine)
    context_text: Optional[str] = None
    context_document_ids: List[str] = []
    user_notes: Dict[str, str] = {}

    # Execution tracking
    execution_id: Optional[str] = None  # Link to WorkflowEngine execution
    error_message: Optional[str] = None


class SessionService:
    """
    In-memory session storage and management.

    PRODUCTION UPGRADE PATH:
    - Replace self.sessions dict with Redis
    - Use Redis TTL for automatic cleanup
    - Enable multi-server deployment
    - Persist sessions across restarts

    For MVP, in-memory is sufficient:
    - Simple to understand and debug
    - No Redis dependency
    - Fast access
    - Easy to test
    """

    def __init__(self):
        """Initialize session storage"""
        self.sessions: Dict[str, SessionState] = {}
        logger.info("🔧 Session service initialized (in-memory storage)")

    def create_session(
        self,
        template_id: str,
        system_prompt: str,
        initial_message: Optional[str] = None,
        context_text: Optional[str] = None,
        context_document_ids: List[str] = None,
        user_notes: Dict[str, str] = None,
        execution_id: Optional[str] = None
    ) -> SessionState:
        """
        Create a new conversation session.

        Args:
            template_id: Workflow template ID
            system_prompt: System prompt (separate from messages)
            initial_message: Optional first user message
            context_text: Optional context for Graphiti retrieval
            context_document_ids: Optional document IDs for context
            user_notes: Optional user guidance notes
            execution_id: Optional link to WorkflowEngine execution

        Returns:
            SessionState with unique session_id
        """
        session_id = str(uuid.uuid4())
        now = datetime.now().isoformat()

        # Create initial messages array
        messages = []
        if initial_message:
            messages.append(Message(
                role=MessageRole.USER,
                content=initial_message,
                timestamp=now
            ))

        session = SessionState(
            session_id=session_id,
            template_id=template_id,
            system_prompt=system_prompt,
            messages=messages,
            status=SessionStatus.ACTIVE,
            created_at=now,
            last_updated=now,
            context_text=context_text,
            context_document_ids=context_document_ids or [],
            user_notes=user_notes or {},
            execution_id=execution_id
        )

        self.sessions[session_id] = session

        logger.info(
            f"✅ Created session: {session_id} "
            f"(template={template_id}, messages={len(messages)})"
        )

        return session

    def get_session(self, session_id: str) -> Optional[SessionState]:
        """
        Get session by ID.

        Args:
            session_id: Session identifier

        Returns:
            SessionState or None if not found
        """
        session = self.sessions.get(session_id)
        if session:
            logger.debug(f"📖 Retrieved session: {session_id}")
        else:
            logger.warning(f"⚠️ Session not found: {session_id}")
        return session

    def append_message(
        self,
        session_id: str,
        role: MessageRole,
        content: str
    ) -> bool:
        """
        Append a message to the conversation.

        VALIDATES ANTHROPIC REQUIREMENTS:
        - Messages must alternate user/assistant
        - No consecutive messages with same role

        Args:
            session_id: Session identifier
            role: Message role (user or assistant)
            content: Message text

        Returns:
            True if message appended, False if session not found
        """
        session = self.get_session(session_id)
        if not session:
            return False

        # Validate alternating roles
        if session.messages:
            last_role = session.messages[-1].role
            if last_role == role:
                logger.warning(
                    f"⚠️ Role validation: Cannot append {role} after {last_role}. "
                    "Messages must alternate user/assistant."
                )
                # For assistant responses, this is expected (streaming accumulation)
                # For user messages, this indicates a bug
                if role == MessageRole.USER:
                    raise ValueError(
                        f"Invalid message sequence: cannot have consecutive {role} messages"
                    )

        # Append message
        message = Message(
            role=role,
            content=content,
            timestamp=datetime.now().isoformat()
        )
        session.messages.append(message)
        session.last_updated = datetime.now().isoformat()

        logger.info(
            f"➕ Appended {role} message to session {session_id} "
            f"({len(content)} chars, total messages: {len(session.messages)})"
        )

        return True

    def update_status(
        self,
        session_id: str,
        status: SessionStatus,
        error_message: Optional[str] = None
    ) -> bool:
        """
        Update session status.

        Args:
            session_id: Session identifier
            status: New status
            error_message: Optional error message (if status=FAILED)

        Returns:
            True if updated, False if session not found
        """
        session = self.get_session(session_id)
        if not session:
            return False

        session.status = status
        session.last_updated = datetime.now().isoformat()

        if error_message:
            session.error_message = error_message

        logger.info(f"📊 Session {session_id} status → {status}")

        return True

    def get_messages_for_claude(
        self,
        session_id: str
    ) -> Optional[List[Dict[str, str]]]:
        """
        Get messages in Anthropic API format.

        Returns messages as list of dicts for Claude API:
        [
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": "..."},
            ...
        ]

        Args:
            session_id: Session identifier

        Returns:
            List of message dicts or None if session not found
        """
        session = self.get_session(session_id)
        if not session:
            return None

        # Convert Pydantic models to dicts (Claude API format)
        return [
            {"role": msg.role.value, "content": msg.content}
            for msg in session.messages
        ]

    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session (cleanup).

        Args:
            session_id: Session identifier

        Returns:
            True if deleted, False if not found
        """
        if session_id in self.sessions:
            del self.sessions[session_id]
            logger.info(f"🗑️ Deleted session: {session_id}")
            return True
        return False

    def get_session_count(self) -> int:
        """Get total number of active sessions"""
        return len(self.sessions)

    def list_sessions(self) -> List[str]:
        """Get list of all session IDs"""
        return list(self.sessions.keys())


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_session_service: Optional[SessionService] = None


def get_session_service() -> SessionService:
    """Get or create session service singleton"""
    global _session_service
    if _session_service is None:
        _session_service = SessionService()
    return _session_service
