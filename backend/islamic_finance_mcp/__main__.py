"""
Entry point for running the Islamic Finance MCP Server.

Usage:
    python -m mcp.server
    OR
    uvx mcp-islamic-finance  (when published)
"""

from .server import main
import asyncio

if __name__ == "__main__":
    asyncio.run(main())
