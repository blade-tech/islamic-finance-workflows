"""
GRAPHITI MCP SERVICE
====================
Replaces direct Graphiti client with MCP tool calls via Claude Agent SDK.

WHY MCP:
- Standardized protocol for Claude integrations
- Better context management via Agent SDK
- Eliminates direct Neo4j dependency
- Future-proof architecture
- Access to full MCP ecosystem

REPLACED SERVICES:
- graphiti_service.py (direct Graphiti client)
- Direct Neo4j connection for schema queries

MCP TOOLS USED:
- mcp__blade-graphiti__search - Knowledge graph search
- mcp__blade-graphiti__add_episode - Add single episode
- mcp__blade-graphiti__add_episodes_bulk - Bulk episode ingestion
- mcp__blade-graphiti__get_recent_nodes - Get recent nodes
- mcp__blade-graphiti__delete_episode - Delete episode
"""

import os
import json
import logging
from typing import List, Dict, Optional, Any, AsyncGenerator
from datetime import datetime

# Claude Agent SDK for MCP integration
from claude_agent_sdk import query
from claude_agent_sdk.types import ClaudeAgentOptions

logger = logging.getLogger(__name__)


class GraphitiMCPService:
    """
    MCP-based Graphiti service using blade-graphiti MCP server.

    Replaces direct Graphiti client with MCP tool calls orchestrated
    by Claude Agent SDK.
    """

    def __init__(
        self,
        neo4j_uri: Optional[str] = None,
        neo4j_user: Optional[str] = None,
        neo4j_password: Optional[str] = None
    ):
        """
        Initialize Graphiti MCP service.

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

        # Create MCP configuration using ClaudeAgentOptions
        self.agent_options = ClaudeAgentOptions(
            mcp_servers={
                "blade-graphiti": {
                    "command": "uvx",
                    "args": ["mcp-server-graphiti"],
                    "env": {
                        "NEO4J_URI": self.neo4j_uri,
                        "NEO4J_USER": self.neo4j_user,
                        "NEO4J_PASSWORD": self.neo4j_password
                    }
                }
            },
            allowed_tools=[
                "mcp__blade-graphiti__search",
                "mcp__blade-graphiti__add_episode",
                "mcp__blade-graphiti__add_episodes_bulk",
                "mcp__blade-graphiti__get_recent_nodes",
                "mcp__blade-graphiti__delete_episode"
            ]
        )

        logger.info(f"✅ Graphiti MCP service initialized: {self.neo4j_uri}")

    async def search(
        self,
        query_text: str,
        group_ids: Optional[List[str]] = None,
        num_results: int = 20
    ) -> Dict[str, Any]:
        """
        Search knowledge graph via MCP.

        Replaces: graphiti_service.search()

        Args:
            query_text: Natural language search query
            group_ids: Optional namespace filtering
            num_results: Maximum results to return

        Returns:
            {
                "status": "success" | "no_results" | "error",
                "query": str,
                "answer": str,  # natural language summary
                "facts": [
                    {
                        "fact": str,
                        "relevance": float,
                        "type": str,
                        "temporal": {...}
                    }
                ],
                "context": {
                    "total_facts": int,
                    "confidence": "low" | "medium" | "high"
                }
            }
        """
        try:
            # Build MCP tool call prompt for Claude
            tool_params = {
                "query": query_text,
                "num_results": num_results
            }
            if group_ids:
                tool_params["group_ids"] = group_ids

            # Create prompt that instructs Claude to use the MCP tool
            prompt = f"""
Use the mcp__blade-graphiti__search tool to search the knowledge graph.

Search Query: "{query_text}"
Number of Results: {num_results}
{f"Group IDs (namespaces): {group_ids}" if group_ids else ""}

Call the tool and return the complete JSON response from the search.
"""

            logger.info(f"🔍 MCP Search: {query_text}")

            # Call Claude Agent SDK with MCP configuration
            full_response = ""
            async for message in query(
                prompt=prompt,
                options=self.agent_options
            ):
                full_response += str(message)

            logger.info(f"✅ MCP Search complete: {len(full_response)} chars")

            # Parse the response to extract structured results
            # The MCP tool returns structured JSON
            try:
                result = json.loads(full_response)
                return result
            except json.JSONDecodeError:
                # If response is not JSON, wrap it
                return {
                    "status": "success",
                    "query": query_text,
                    "answer": full_response,
                    "facts": [],
                    "context": {
                        "total_facts": 0,
                        "confidence": "low"
                    }
                }

        except Exception as e:
            logger.error(f"❌ MCP Search failed: {e}")
            return {
                "status": "error",
                "query": query_text,
                "answer": f"Search failed: {str(e)}",
                "facts": [],
                "context": {
                    "total_facts": 0,
                    "confidence": "low"
                }
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

        Replaces: graphiti_service.add_episode()

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
                "uuid": str  # for deletion or linking
            }
        """
        try:
            # Build MCP tool call prompt
            tool_params = {
                "name": name,
                "episode_body": episode_body,
                "episode_type": episode_type,
                "source_description": source_description
            }
            if group_id:
                tool_params["group_id"] = group_id
            if reference_time:
                tool_params["reference_time"] = reference_time

            prompt = f"""
Use the mcp__blade-graphiti__add_episode tool to add an episode to the knowledge graph.

Episode Name: "{name}"
Episode Type: {episode_type}
Source: {source_description}
{f"Group ID: {group_id}" if group_id else ""}
{f"Reference Time: {reference_time}" if reference_time else ""}

Episode Content:
---
{episode_body}
---

Call the tool and return the complete JSON response.
"""

            logger.info(f"📝 MCP Add Episode: {name}")

            # Call Claude Agent SDK
            full_response = ""
            async for message in query(
                prompt=prompt,
                options=self.agent_options
            ):
                full_response += str(message)

            logger.info(f"✅ MCP Episode added: {name}")

            # Parse response
            try:
                result = json.loads(full_response)
                return result
            except json.JSONDecodeError:
                return {
                    "status": "success",
                    "message": full_response,
                    "episode_name": name,
                    "uuid": None
                }

        except Exception as e:
            logger.error(f"❌ MCP Add Episode failed: {e}")
            return {
                "status": "error",
                "message": str(e),
                "episode_name": name,
                "uuid": None
            }

    async def add_episodes_bulk(
        self,
        episodes: List[Dict[str, Any]],
        group_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Add multiple episodes in bulk via MCP.

        Replaces: graphiti_service.add_episodes_bulk()

        Args:
            episodes: List of episode dicts with name, episode_body, etc.
            group_id: Optional namespace for all episodes

        Returns:
            {
                "success": bool,
                "message": str,
                "processed_count": int,
                "group_id": str
            }
        """
        try:
            # Convert episodes list to JSON string (required by MCP tool)
            episodes_json = json.dumps(episodes)

            prompt = f"""
Use the mcp__blade-graphiti__add_episodes_bulk tool to add multiple episodes.

Number of Episodes: {len(episodes)}
{f"Group ID: {group_id}" if group_id else ""}

Episodes JSON:
{episodes_json}

Call the tool and return the complete JSON response.
"""

            logger.info(f"📚 MCP Bulk Ingest: {len(episodes)} episodes")

            # Call Claude Agent SDK
            full_response = ""
            async for message in query(
                prompt=prompt,
                options=self.agent_options
            ):
                full_response += str(message)

            logger.info(f"✅ MCP Bulk ingest complete")

            # Parse response
            try:
                result = json.loads(full_response)
                return result
            except json.JSONDecodeError:
                return {
                    "success": True,
                    "message": full_response,
                    "processed_count": len(episodes),
                    "group_id": group_id
                }

        except Exception as e:
            logger.error(f"❌ MCP Bulk ingest failed: {e}")
            return {
                "success": False,
                "message": str(e),
                "processed_count": 0,
                "group_id": group_id
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
                "nodes": [
                    {
                        "labels": List[str],
                        "properties": {...}
                    }
                ]
            }
        """
        try:
            tool_params = {"limit": limit}
            if node_labels:
                tool_params["node_labels"] = node_labels
            if group_id:
                tool_params["group_id"] = group_id

            prompt = f"""
Use the mcp__blade-graphiti__get_recent_nodes tool to get recent nodes.

Limit: {limit}
{f"Node Labels: {node_labels}" if node_labels else ""}
{f"Group ID: {group_id}" if group_id else ""}

Call the tool and return the complete JSON response.
"""

            logger.info(f"📊 MCP Get Recent Nodes: limit={limit}")

            full_response = ""
            async for message in query(
                prompt=prompt,
                options=self.agent_options
            ):
                full_response += str(message)

            logger.info(f"✅ MCP Recent nodes retrieved")

            try:
                result = json.loads(full_response)
                return result
            except json.JSONDecodeError:
                return {
                    "count": 0,
                    "nodes": []
                }

        except Exception as e:
            logger.error(f"❌ MCP Get recent nodes failed: {e}", exc_info=True)
            return {
                "count": 0,
                "nodes": []
            }

    async def ingest_document(
        self,
        content: str,
        document_name: str,
        document_type: str = "aaoifi",
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Ingest document into knowledge graph via MCP.

        This method wraps add_episode for document ingestion compatibility.

        Args:
            content: Document text content
            document_name: Name of the document
            document_type: Type of document (aaoifi, context, etc.)
            metadata: Optional metadata dict

        Returns:
            Episode UUID/ID for the ingested document
        """
        try:
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

        except Exception as e:
            logger.error(f"❌ MCP Document ingestion failed: {e}")
            raise


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_graphiti_mcp_service: Optional[GraphitiMCPService] = None


def get_graphiti_mcp_service() -> GraphitiMCPService:
    """Get or create Graphiti MCP service singleton"""
    global _graphiti_mcp_service
    if _graphiti_mcp_service is None:
        _graphiti_mcp_service = GraphitiMCPService(
            neo4j_uri=os.getenv("NEO4J_URI"),
            neo4j_user=os.getenv("NEO4J_USER"),
            neo4j_password=os.getenv("NEO4J_PASSWORD")
        )
    return _graphiti_mcp_service
