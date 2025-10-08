"""
GRAPHITI MCP CLIENT
===================
Direct MCP client for blade-graphiti MCP server using mcp SDK.

REPLACES: claude-agent-sdk approach (which was for Claude AI orchestration, not direct MCP)
USES: mcp SDK stdio_client for direct server communication

MCP ARCHITECTURE:
- Backend FastAPI service (this file)
  ↓ stdio (command + JSON-RPC)
- blade-graphiti MCP server (uvx mcp-server-graphiti)
  ↓ Neo4j driver
- Neo4j AuraDB database
"""

import os
import json
import logging
from typing import List, Dict, Optional, Any, AsyncContextManager
from contextlib import AsyncExitStack

# MCP SDK for direct stdio communication
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

logger = logging.getLogger(__name__)


class GraphitiMCPClient:
    """
    Direct MCP client for blade-graphiti server.

    Uses mcp SDK stdio_client to communicate directly with the MCP server
    via subprocess and JSON-RPC protocol.
    """

    def __init__(
        self,
        neo4j_uri: Optional[str] = None,
        neo4j_user: Optional[str] = None,
        neo4j_password: Optional[str] = None
    ):
        """
        Initialize Graphiti MCP client.

        Args:
            neo4j_uri: Neo4j database URI
            neo4j_user: Neo4j username
            neo4j_password: Neo4j password
        """
        # Get Neo4j credentials from env if not provided
        self.neo4j_uri = neo4j_uri or os.getenv("NEO4J_URI")
        self.neo4j_user = neo4j_user or os.getenv("NEO4J_USER")
        self.neo4j_password = neo4j_password or os.getenv("NEO4J_PASSWORD")

        if not all([self.neo4j_uri, self.neo4j_user, self.neo4j_password]):
            raise ValueError("Neo4j credentials not configured")

        # MCP session management
        self.exit_stack = AsyncExitStack()
        self.session: Optional[ClientSession] = None

        logger.info(f"✅ Graphiti MCP client initialized: {self.neo4j_uri}")

    async def connect(self):
        """Connect to blade-graphiti MCP server via stdio"""
        if self.session:
            logger.warning("Already connected to MCP server")
            return

        try:
            # Create server parameters
            server_params = StdioServerParameters(
                command="uvx",
                args=["mcp-server-graphiti"],
                env={
                    "NEO4J_URI": self.neo4j_uri,
                    "NEO4J_USER": self.neo4j_user,
                    "NEO4J_PASSWORD": self.neo4j_password
                }
            )

            # Connect via stdio
            logger.info("🔌 Connecting to blade-graphiti MCP server...")
            stdio_transport = await self.exit_stack.enter_async_context(
                stdio_client(server_params)
            )

            stdio, write = stdio_transport

            # Create client session
            self.session = await self.exit_stack.enter_async_context(
                ClientSession(stdio, write)
            )

            # Initialize session
            await self.session.initialize()

            # List available tools
            response = await self.session.list_tools()
            tool_names = [tool.name for tool in response.tools]

            logger.info(f"✅ Connected to blade-graphiti MCP server")
            logger.info(f"📦 Available tools: {', '.join(tool_names)}")

        except Exception as e:
            logger.error(f"❌ Failed to connect to MCP server: {e}", exc_info=True)
            raise

    async def disconnect(self):
        """Disconnect from MCP server"""
        if self.session:
            await self.exit_stack.aclose()
            self.session = None
            logger.info("👋 Disconnected from blade-graphiti MCP server")

    async def search(
        self,
        query_text: str,
        group_ids: Optional[List[str]] = None,
        num_results: int = 20
    ) -> Dict[str, Any]:
        """
        Search knowledge graph via MCP.

        Args:
            query_text: Natural language search query
            group_ids: Optional namespace filtering
            num_results: Maximum results to return

        Returns:
            {
                "status": "success" | "no_results" | "error",
                "query": str,
                "answer": str,
                "facts": [...],
                "context": {...}
            }
        """
        if not self.session:
            await self.connect()

        try:
            # Build tool arguments
            arguments = {
                "query": query_text,
                "num_results": num_results
            }
            if group_ids:
                arguments["group_ids"] = group_ids

            logger.info(f"🔍 MCP Search: {query_text}")

            # Call MCP tool
            result = await self.session.call_tool(
                "mcp__blade-graphiti__search",
                arguments=arguments
            )

            # Parse response
            if hasattr(result, 'content') and len(result.content) > 0:
                content_item = result.content[0]
                if hasattr(content_item, 'text'):
                    response_data = json.loads(content_item.text)
                    logger.info(f"✅ MCP Search complete: {response_data.get('status', 'unknown')}")
                    return response_data

            # Fallback
            return {
                "status": "error",
                "query": query_text,
                "answer": "No valid response from MCP server",
                "facts": [],
                "context": {"total_facts": 0, "confidence": "low"}
            }

        except Exception as e:
            logger.error(f"❌ MCP Search failed: {e}", exc_info=True)
            return {
                "status": "error",
                "query": query_text,
                "answer": f"Search failed: {str(e)}",
                "facts": [],
                "context": {"total_facts": 0, "confidence": "low"}
            }

    async def add_episode(
        self,
        name: str,
        episode_body: str,
        episode_type: str = "text",
        source_description: str = "AAOIFI Document",
        group_id: Optional[str] = None,
        reference_time: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Add episode to knowledge graph via MCP.

        Args:
            name: Episode title
            episode_body: Content to process
            episode_type: "text", "message", or "json"
            source_description: Data source
            group_id: Optional namespace
            reference_time: Optional ISO-8601 timestamp

        Returns:
            {
                "status": "success" | "error",
                "message": str,
                "episode_name": str,
                "uuid": str
            }
        """
        if not self.session:
            await self.connect()

        try:
            # Build tool arguments
            arguments = {
                "name": name,
                "episode_body": episode_body,
                "episode_type": episode_type,
                "source_description": source_description
            }
            if group_id:
                arguments["group_id"] = group_id
            if reference_time:
                arguments["reference_time"] = reference_time

            logger.info(f"📝 MCP Add Episode: {name}")

            # Call MCP tool
            result = await self.session.call_tool(
                "mcp__blade-graphiti__add_episode",
                arguments=arguments
            )

            # Parse response
            if hasattr(result, 'content') and len(result.content) > 0:
                content_item = result.content[0]
                if hasattr(content_item, 'text'):
                    response_data = json.loads(content_item.text)
                    logger.info(f"✅ MCP Episode added: {name}")
                    return response_data

            # Fallback
            return {
                "status": "success",
                "message": "Episode added (no UUID returned)",
                "episode_name": name,
                "uuid": None
            }

        except Exception as e:
            logger.error(f"❌ MCP Add Episode failed: {e}", exc_info=True)
            return {
                "status": "error",
                "message": str(e),
                "episode_name": name,
                "uuid": None
            }

    async def get_recent_nodes(
        self,
        limit: int = 10,
        node_labels: Optional[List[str]] = None,
        group_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get recently created nodes via MCP.

        Args:
            limit: Maximum nodes to return
            node_labels: Optional filter by node types
            group_id: Optional namespace filter

        Returns:
            {
                "count": int,
                "nodes": [...]
            }
        """
        if not self.session:
            await self.connect()

        try:
            # Build tool arguments
            arguments = {"limit": limit}
            if node_labels:
                arguments["node_labels"] = node_labels
            if group_id:
                arguments["group_id"] = group_id

            logger.info(f"📊 MCP Get Recent Nodes: limit={limit}")

            # Call MCP tool
            result = await self.session.call_tool(
                "mcp__blade-graphiti__get_recent_nodes",
                arguments=arguments
            )

            # Parse response
            if hasattr(result, 'content') and len(result.content) > 0:
                content_item = result.content[0]
                if hasattr(content_item, 'text'):
                    response_data = json.loads(content_item.text)
                    logger.info(f"✅ MCP Recent nodes retrieved: {response_data.get('count', 0)}")
                    return response_data

            # Fallback
            return {"count": 0, "nodes": []}

        except Exception as e:
            logger.error(f"❌ MCP Get recent nodes failed: {e}", exc_info=True)
            return {"count": 0, "nodes": []}

    async def ingest_document(
        self,
        content: str,
        document_name: str,
        document_type: str = "aaoifi",
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Ingest document into knowledge graph via MCP.

        Args:
            content: Document text content
            document_name: Name of the document
            document_type: Type of document (aaoifi, context, etc.)
            metadata: Optional metadata dict

        Returns:
            Episode UUID/ID for the ingested document
        """
        # Determine group_id based on document type
        group_id = f"{document_type}-documents"

        # Add episode for document
        result = await self.add_episode(
            name=f"{document_type.upper()}: {document_name}",
            episode_body=content,
            episode_type="text",
            source_description=f"{document_type} Document Upload",
            group_id=group_id
        )

        # Extract UUID from result
        episode_id = result.get("uuid", result.get("episode_name", document_name))

        logger.info(f"✅ MCP Document ingested: {document_name} → {episode_id}")

        return episode_id


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_graphiti_mcp_client: Optional[GraphitiMCPClient] = None


def get_graphiti_mcp_client() -> GraphitiMCPClient:
    """Get or create Graphiti MCP client singleton"""
    global _graphiti_mcp_client
    if _graphiti_mcp_client is None:
        _graphiti_mcp_client = GraphitiMCPClient(
            neo4j_uri=os.getenv("NEO4J_URI"),
            neo4j_user=os.getenv("NEO4J_USER"),
            neo4j_password=os.getenv("NEO4J_PASSWORD")
        )
    return _graphiti_mcp_client
