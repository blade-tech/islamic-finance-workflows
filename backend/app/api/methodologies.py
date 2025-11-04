"""
METHODOLOGIES API ENDPOINTS
============================
REST API for managing digitized methodologies.

Endpoints:
- GET /methodologies - List all methodologies with filtering
- GET /methodologies/{id} - Get specific methodology details
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from app.models import (
    MethodologyListResponse,
    MethodologyDetailResponse,
    MethodologyListFilters,
)
from app.services.methodology_service import methodology_service

router = APIRouter(
    prefix="/methodologies",
    tags=["Methodologies"],
)

# Configure router to use field aliases in responses
from fastapi.routing import APIRouter as BaseRouter


@router.get("", response_model=MethodologyListResponse, response_model_by_alias=True)
async def list_methodologies(
    type: Optional[str] = Query(None, description="Filter by methodology type"),
    category: Optional[str] = Query(None, description="Filter by category (e.g., mudarabah, sukuk)"),
    standard: Optional[str] = Query(None, description="Filter by standard (e.g., IIFM, AAOIFI)"),
    status: Optional[str] = Query(None, description="Filter by status (active, draft, archived)"),
    search: Optional[str] = Query(None, description="Search in name and description"),
) -> MethodologyListResponse:
    """
    List all available methodologies with optional filtering.

    Returns methodologies sorted by application count (most used first).

    Query Parameters:
    - type: islamic-finance | environmental | social | custom
    - category: mudarabah | sukuk | murabaha | ijara | etc.
    - standard: IIFM | AAOIFI | Verra | etc.
    - status: active | draft | archived
    - search: Free text search
    """
    filters = MethodologyListFilters(
        type=type,
        category=category,
        standard=standard,
        status=status,
        search=search,
    )

    response = methodology_service.list_methodologies(filters)
    # Use model_dump_json with by_alias=True to get camelCase fields
    return JSONResponse(
        content=response.model_dump(mode='json', by_alias=True),
        media_type="application/json"
    )


@router.get("/{methodology_id}", response_model=MethodologyDetailResponse, response_model_by_alias=True)
async def get_methodology(methodology_id: str) -> MethodologyDetailResponse:
    """
    Get detailed information about a specific methodology.

    Path Parameters:
    - methodology_id: The unique identifier of the methodology

    Returns:
    - Methodology details including schemas, policy steps, and statistics

    Raises:
    - 404: Methodology not found
    """
    detail = methodology_service.get_methodology_detail(methodology_id)

    if not detail:
        raise HTTPException(
            status_code=404, detail=f"Methodology '{methodology_id}' not found"
        )

    # Use model_dump with by_alias=True to get camelCase fields
    return JSONResponse(
        content=detail.model_dump(mode='json', by_alias=True),
        media_type="application/json"
    )
