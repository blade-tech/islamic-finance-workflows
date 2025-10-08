"""
CLAUDE SERVICE WITH LANGFUSE TRACING
=====================================
Service for Claude AI interactions with full Langfuse observability.

WHY LANGFUSE:
- Complete LLM call tracing and monitoring
- Token usage tracking
- Performance metrics
- Conversation replay
- Cost analysis

FEATURES:
- Streaming and non-streaming Claude responses
- Automatic Langfuse trace creation
- Token usage tracking
- Error handling and logging
"""

import os
import logging
from typing import AsyncGenerator, Optional, Dict, Any, List
from datetime import datetime
import anthropic

# Initialize logger FIRST
logger = logging.getLogger(__name__)

# Try to import Langfuse - EXPLICIT failure handling, NO SILENT FALLBACKS
# NOTE: Langfuse v3 removed langfuse_context - using Langfuse client directly
try:
    from langfuse import Langfuse, observe
    LANGFUSE_AVAILABLE = True
    logger.info("✅ Langfuse v3 module loaded successfully")
except ImportError as e:
    logger.warning(f"⚠️ LANGFUSE NOT AVAILABLE: {e}")
    logger.warning("⚠️ Claude Service will run WITHOUT observability tracing")
    logger.warning("⚠️ To enable Langfuse: pip install langfuse")
    LANGFUSE_AVAILABLE = False

    # Mock Langfuse class when unavailable
    class Langfuse:
        """Mock Langfuse client when unavailable"""
        def __init__(self, *args, **kwargs):
            pass

    # Mock observe decorator when unavailable - must support both @observe and @observe()
    def observe(*args, **kwargs):
        """Mock observe decorator that supports both @observe and @observe() syntax"""
        def decorator(func):
            return func
        # If called with function directly (@observe without parentheses)
        if len(args) == 1 and callable(args[0]) and not kwargs:
            return args[0]
        # If called with arguments (@observe() with parentheses)
        return decorator


class ClaudeService:
    """
    Service for Claude AI interactions with Langfuse tracing.

    Provides both streaming and non-streaming Claude responses,
    automatically traced in Langfuse for observability.
    """

    def __init__(
        self,
        anthropic_api_key: Optional[str] = None,
        langfuse_public_key: Optional[str] = None,
        langfuse_secret_key: Optional[str] = None,
        langfuse_host: Optional[str] = None,
        model: str = "claude-sonnet-4-5-20250929",
        max_tokens: int = 16384,
        temperature: float = 0.7
    ):
        """
        Initialize Claude service with Langfuse tracing.

        Args:
            anthropic_api_key: Anthropic API key
            langfuse_public_key: Langfuse public key
            langfuse_secret_key: Langfuse secret key
            langfuse_host: Langfuse host URL
            model: Claude model to use
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
        """
        # Initialize Anthropic client (ASYNC)
        self.anthropic_api_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.anthropic_api_key:
            raise ValueError("Anthropic API key not configured")

        self.client = anthropic.AsyncAnthropic(api_key=self.anthropic_api_key)

        # Initialize Langfuse - EXPLICIT failure handling
        if not LANGFUSE_AVAILABLE:
            logger.warning("⚠️ LANGFUSE MODULE NOT AVAILABLE - Tracing permanently disabled")
            self.langfuse = None
        else:
            self.langfuse_public_key = langfuse_public_key or os.getenv("LANGFUSE_PUBLIC_KEY")
            self.langfuse_secret_key = langfuse_secret_key or os.getenv("LANGFUSE_SECRET_KEY")
            self.langfuse_host = langfuse_host or os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")

            if not all([self.langfuse_public_key, self.langfuse_secret_key]):
                logger.warning("⚠️ Langfuse credentials not configured - tracing disabled")
                logger.warning("⚠️ Set LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY env vars to enable")
                self.langfuse = None
            else:
                self.langfuse = Langfuse(
                    public_key=self.langfuse_public_key,
                    secret_key=self.langfuse_secret_key,
                    host=self.langfuse_host
                )
                logger.info(f"✅ Langfuse tracing enabled: {self.langfuse_host}")

        # Claude configuration
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature

        logger.info(f"🤖 Claude service initialized: {self.model}")

    @observe()
    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        context: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate non-streaming Claude response with Langfuse tracing.

        Args:
            system_prompt: System prompt (template instructions)
            user_message: User message
            context: Optional context from Graphiti
            metadata: Optional metadata for tracing

        Returns:
            Response dict with text and usage stats
        """
        try:
            # Build messages with structured context injection
            messages = []

            # Add context if provided - structured for clarity
            if context and context.strip():
                context_message = self._format_context_message(context)
                messages.append({
                    "role": "user",
                    "content": context_message
                })

            # Add user message
            messages.append({
                "role": "user",
                "content": user_message
            })

            # DISABLED: Langfuse v3 removed langfuse_context API
            # Manual tracing temporarily disabled - needs v3 API update
            pass

            # Call Claude (ASYNC)
            logger.info(f"🤖 Calling Claude: {self.model}")
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt,
                messages=messages
            )

            # Extract response
            response_text = response.content[0].text

            # DISABLED: Langfuse v3 removed langfuse_context API
            pass

            logger.info(
                f"✅ Claude response: {len(response_text)} chars, "
                f"{response.usage.input_tokens} in, {response.usage.output_tokens} out"
            )

            return {
                "text": response_text,
                "model": self.model,
                "usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens,
                    "total_tokens": response.usage.input_tokens + response.usage.output_tokens
                },
                "stop_reason": response.stop_reason
            }

        except Exception as e:
            logger.error(f"❌ Claude generation failed: {e}")
            # DISABLED: Langfuse v3 removed langfuse_context API
            raise

    @observe()
    async def stream_generate(
        self,
        system_prompt: str,
        user_message: str,
        context: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming Claude response with Langfuse tracing.

        Args:
            system_prompt: System prompt (template instructions)
            user_message: User message
            context: Optional context from Graphiti
            metadata: Optional metadata for tracing

        Yields:
            Response chunks as they arrive
        """
        try:
            # Build messages with structured context injection
            messages = []

            # Add context if provided - structured for clarity
            if context and context.strip():
                context_message = self._format_context_message(context)
                messages.append({
                    "role": "user",
                    "content": context_message
                })

            # Add user message
            messages.append({
                "role": "user",
                "content": user_message
            })

            # DISABLED: Langfuse v3 removed langfuse_context API
            pass

            # Call Claude with streaming
            logger.info(f"🤖 Streaming Claude: {self.model}")

            full_response = ""
            input_tokens = 0
            output_tokens = 0

            async with self.client.messages.stream(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt,
                messages=messages
            ) as stream:
                async for text in stream.text_stream:
                    full_response += text
                    yield text

                # Get final message with usage
                final_message = await stream.get_final_message()
                input_tokens = final_message.usage.input_tokens
                output_tokens = final_message.usage.output_tokens

            # Update Langfuse with complete output and usage
            # DISABLED: Langfuse v3 removed langfuse_context API
            pass

            logger.info(
                f"✅ Claude stream complete: {len(full_response)} chars, "
                f"{input_tokens} in, {output_tokens} out"
            )

        except Exception as e:
            logger.error(f"❌ Claude streaming failed: {e}")
            # DISABLED: Langfuse v3 removed langfuse_context API
            pass
            raise

    @observe()
    async def stream_with_messages(
        self,
        system_prompt: str,
        messages: List[Dict[str, str]],
        metadata: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming Claude response with full message history.

        FOLLOWS ANTHROPIC OFFICIAL PATTERNS:
        - system_prompt is separate from messages
        - messages must be array of {"role": "user|assistant", "content": "..."}
        - messages must alternate user/assistant roles
        - send full conversation history each time (stateless API)

        This is the NEW API for multi-turn conversations following
        Anthropic Agent SDK patterns.

        Args:
            system_prompt: System prompt (separate from messages)
            messages: Full conversation history [{"role": "user", "content": "...}, ...]
            metadata: Optional metadata for tracing

        Yields:
            Response chunks as they arrive
        """
        try:
            # Validate messages format
            if not messages:
                raise ValueError("Messages array cannot be empty")

            # Validate alternating roles (Anthropic requirement)
            for i, msg in enumerate(messages):
                if "role" not in msg or "content" not in msg:
                    raise ValueError(f"Message {i} missing 'role' or 'content' field")

                expected_role = "user" if i % 2 == 0 else "assistant"
                if msg["role"] != expected_role and i < len(messages) - 1:
                    logger.warning(
                        f"⚠️ Message {i} has role '{msg['role']}' but expected '{expected_role}'. "
                        "Messages should alternate user/assistant."
                    )

            # Last message must be from user (starting a new turn)
            if messages[-1]["role"] != "user":
                raise ValueError("Last message must be from user")

            logger.info(
                f"🤖 Streaming Claude with {len(messages)} messages "
                f"(last: {len(messages[-1]['content'])} chars)"
            )

            full_response = ""
            input_tokens = 0
            output_tokens = 0

            async with self.client.messages.stream(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt,
                messages=messages  # ✅ Full conversation history
            ) as stream:
                async for text in stream.text_stream:
                    full_response += text
                    yield text

                # Get final message with usage
                final_message = await stream.get_final_message()
                input_tokens = final_message.usage.input_tokens
                output_tokens = final_message.usage.output_tokens

            logger.info(
                f"✅ Claude stream complete: {len(full_response)} chars, "
                f"{input_tokens} in, {output_tokens} out, "
                f"{len(messages)} message turns"
            )

        except Exception as e:
            logger.error(f"❌ Claude streaming (messages API) failed: {e}")
            raise

    def _format_context_message(self, context: str) -> str:
        """
        Format context from Graphiti into a well-structured message for Claude.

        Args:
            context: Raw context string from Graphiti

        Returns:
            Formatted context message with clear structure
        """
        # Already formatted by workflow engine with sections
        # Just add a clear header and instructions

        formatted_parts = [
            "# KNOWLEDGE GRAPH CONTEXT",
            "",
            "The following information has been retrieved from the AAOIFI standards knowledge graph",
            "to assist you in completing this task. Please reference these facts and standards as needed.",
            "",
            "---",
            "",
            context,
            "",
            "---",
            "",
            "**Instructions:**",
            "- Reference the above standards and facts in your response",
            "- Cite specific AAOIFI sections when making compliance assertions",
            "- Use the relevance scores to prioritize which facts to emphasize",
            ""
        ]

        return "\n".join(formatted_parts)

    def close(self):
        """Close Langfuse connection"""
        if self.langfuse:
            self.langfuse.flush()
            logger.info("🔌 Closed Langfuse connection")


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_claude_service: Optional[ClaudeService] = None


def get_claude_service() -> ClaudeService:
    """Get or create Claude service singleton"""
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService(
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
            langfuse_public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
            langfuse_secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
            langfuse_host=os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com"),
            model=os.getenv("CLAUDE_MODEL", "claude-sonnet-4-5-20250929"),
            max_tokens=int(os.getenv("CLAUDE_MAX_TOKENS", "16384")),
            temperature=float(os.getenv("CLAUDE_TEMPERATURE", "0.7"))
        )
    return _claude_service
