"""
GRAPHITI API ENDPOINTS
======================
Endpoints for Graphiti knowledge graph operations via MCP.

FULLY MIGRATED TO MCP: All operations use blade-graphiti MCP server via mcp SDK
DIRECT MCP CLIENT: Uses mcp SDK stdio_client for direct server communication
DELETED: graphiti_service.py, graphiti_mcp_service.py (claude-agent-sdk approach)
"""

import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.graphiti_mcp_client import get_graphiti_mcp_client

logger = logging.getLogger(__name__)

router = APIRouter()


class SearchRequest(BaseModel):
    """Search request model - simplified for MCP"""
    query: str
    group_ids: Optional[List[str]] = None
    num_results: int = 10


class SearchResponse(BaseModel):
    """Search response model"""
    query: str
    results: List[dict]
    total_results: int


@router.get("/graphiti/test")
async def test_graphiti_connection():
    """
    Test connection to knowledge graph via MCP.

    Uses blade-graphiti MCP's get_recent_nodes to verify connectivity
    and return basic statistics.

    Returns:
        Connection status and node counts from MCP
    """
    try:
        mcp_service = get_graphiti_mcp_service()

        # Use MCP to get recent nodes as connection test
        result = await mcp_service.get_recent_nodes(
            limit=50,
            node_labels=["Episodic"]  # Get recent episodes
        )

        total_nodes = result.get("count", 0)
        nodes = result.get("nodes", [])

        # Count by group_id to differentiate AAOIFI vs context docs
        aaoifi_count = sum(1 for n in nodes if n.get("properties", {}).get("group_id") == "aaoifi-documents")
        context_count = sum(1 for n in nodes if n.get("properties", {}).get("group_id") == "context-documents")

        logger.info(f"✅ MCP connection test: {total_nodes} nodes found")

        return {
            "connected": True,
            "total_episodes": total_nodes,
            "total_nodes": total_nodes,
            "total_edges": 0,  # MCP doesn't provide edge count in get_recent_nodes
            "aaoifi_documents_count": aaoifi_count,
            "context_documents_count": context_count,
            "via_mcp": True,
            "message": f"Connected via blade-graphiti MCP - {total_nodes} episodes found"
        }

    except Exception as e:
        logger.error(f"❌ MCP connection test failed: {e}")
        return {
            "connected": False,
            "total_episodes": 0,
            "total_nodes": 0,
            "total_edges": 0,
            "aaoifi_documents_count": 0,
            "context_documents_count": 0,
            "via_mcp": True,
            "message": f"Connection failed: {str(e)}"
        }


@router.post("/graphiti/search")
async def search_graphiti(request: SearchRequest):
    """
    Search the Graphiti knowledge graph via MCP.

    NOW USING: GraphitiMCPService (blade-graphiti MCP)
    REPLACED: Direct graphiti-core client

    Args:
        request: SearchRequest with query and optional filters

    Returns:
        Search results with facts and context from MCP
    """
    try:
        # Use MCP service instead of direct client
        mcp_service = get_graphiti_mcp_service()
        result = await mcp_service.search(
            query_text=request.query,
            group_ids=request.group_ids,
            num_results=request.num_results
        )

        # MCP returns structured dict with status, answer, facts, context
        # Extract facts for backward compatibility
        facts = result.get("facts", [])

        return {
            "query": request.query,
            "results": facts,  # Return facts as results
            "total_results": len(facts),
            "answer": result.get("answer", ""),  # Include LLM summary
            "status": result.get("status", "success"),
            "context": result.get("context", {})
        }

    except Exception as e:
        logger.error(f"Error searching Graphiti via MCP: {e}")
        raise HTTPException(status_code=500, detail=str(e))


