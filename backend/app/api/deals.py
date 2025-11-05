"""
DEALS API
=========
REST API endpoints for Islamic Finance deal lifecycle management.

ENDPOINTS:
- POST /api/deals - Create new deal from workflow completion
- GET /api/deals - List all deals (with optional filtering)
- GET /api/deals/{deal_id} - Get specific deal details
- PUT /api/deals/{deal_id} - Update deal
- DELETE /api/deals/{deal_id} - Delete deal

INTEGRATION:
- Called by Step 10 (Live Execution) after Guardian deployment
- Provides data for Step 11 (Monitor & Collaborate)
- Feeds the compliance dashboard

USAGE:
    # Create deal after workflow completion
    POST /api/deals
    {
        "deal_name": "QIIB Oryx Sustainability Sukuk",
        "shariah_structure": "wakala",
        "jurisdiction": "qatar_qfc",
        "accounting_standard": "aaoifi",
        "impact_framework": "qfc_sustainable"
    }

    # List all active deals
    GET /api/deals?status=active

    # Get specific deal
    GET /api/deals/deal-550e8400-e29b-41d4-a716-446655440000
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.models import Deal, DealCreate
from app.services.deal_storage import DealStorage

# Create router with /api/deals prefix
router = APIRouter(
    prefix="/api/deals",
    tags=["deals"],
    responses={
        404: {"description": "Deal not found"},
        500: {"description": "Internal server error"}
    }
)


@router.post("", response_model=Deal, status_code=201)
async def create_deal(deal_data: DealCreate):
    """
    Create a new deal from workflow completion.

    This endpoint is called by Step 10 (Live Execution) after the workflow
    completes and the Guardian policy is deployed.

    **Request Body:**
    - `deal_name`: Human-readable name for the deal
    - `shariah_structure`: Selected Shariah structure ID (e.g., 'wakala', 'murabaha')
    - `jurisdiction`: Selected jurisdiction ID (e.g., 'qatar_qfc', 'uae_difc')
    - `accounting_standard`: Selected accounting standard (e.g., 'aaoifi', 'ifrs')
    - `impact_framework`: Optional impact framework (e.g., 'qfc_sustainable')
    - `deal_amount`: Optional deal amount
    - `currency`: Optional currency code
    - `originator`: Optional originating institution
    - `guardian_policy_id`: Optional Guardian policy ID
    - `guardian_transaction_id`: Optional Hedera transaction ID

    **Returns:**
    - `201 Created`: Deal successfully created with generated ID and timestamps
    - `500 Internal Server Error`: Deal creation failed

    **Example:**
    ```bash
    curl -X POST http://localhost:8000/api/deals \\
      -H "Content-Type: application/json" \\
      -d '{
        "deal_name": "QIIB Oryx Sustainability Sukuk",
        "shariah_structure": "wakala",
        "jurisdiction": "qatar_qfc",
        "accounting_standard": "aaoifi",
        "impact_framework": "qfc_sustainable"
      }'
    ```
    """
    try:
        deal = DealStorage.create_deal(deal_data)
        return deal
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create deal: {str(e)}"
        )


@router.get("", response_model=List[Deal])
async def list_deals(
    status: Optional[str] = Query(
        None,
        description="Filter by status: draft, active, completed, archived"
    ),
    limit: Optional[int] = Query(
        None,
        description="Maximum number of deals to return",
        ge=1,
        le=100
    )
):
    """
    List all deals with optional filtering.

    **Query Parameters:**
    - `status` (optional): Filter by deal status (draft, active, completed, archived)
    - `limit` (optional): Maximum number of deals to return (1-100)

    **Returns:**
    - `200 OK`: List of deals sorted by created_at descending (newest first)

    **Example:**
    ```bash
    # Get all deals
    curl http://localhost:8000/api/deals

    # Get active deals only
    curl http://localhost:8000/api/deals?status=active

    # Get latest 10 deals
    curl http://localhost:8000/api/deals?limit=10
    ```
    """
    try:
        deals = DealStorage.get_all_deals(status=status)

        # Apply limit if specified
        if limit:
            deals = deals[:limit]

        return deals
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve deals: {str(e)}"
        )


@router.get("/{deal_id}", response_model=Deal)
async def get_deal(deal_id: str):
    """
    Get a specific deal by ID.

    **Path Parameters:**
    - `deal_id`: Unique deal identifier (e.g., 'deal-550e8400-e29b-41d4-a716-446655440000')

    **Returns:**
    - `200 OK`: Deal details
    - `404 Not Found`: Deal with specified ID does not exist

    **Example:**
    ```bash
    curl http://localhost:8000/api/deals/deal-550e8400-e29b-41d4-a716-446655440000
    ```
    """
    deal = DealStorage.get_deal(deal_id)

    if not deal:
        raise HTTPException(
            status_code=404,
            detail=f"Deal not found: {deal_id}"
        )

    return deal


@router.put("/{deal_id}", response_model=Deal)
async def update_deal(deal_id: str, updates: dict):
    """
    Update a deal's fields.

    **Path Parameters:**
    - `deal_id`: Deal to update

    **Request Body:**
    - Dictionary of fields to update (e.g., {"status": "completed", "overall_completion": 100.0})

    **Returns:**
    - `200 OK`: Updated deal
    - `404 Not Found`: Deal with specified ID does not exist

    **Example:**
    ```bash
    curl -X PUT http://localhost:8000/api/deals/deal-550e8400-e29b-41d4-a716-446655440000 \\
      -H "Content-Type: application/json" \\
      -d '{"status": "completed", "overall_completion": 100.0}'
    ```
    """
    deal = DealStorage.update_deal(deal_id, updates)

    if not deal:
        raise HTTPException(
            status_code=404,
            detail=f"Deal not found: {deal_id}"
        )

    return deal


@router.delete("/{deal_id}", status_code=204)
async def delete_deal(deal_id: str):
    """
    Delete a deal.

    **Path Parameters:**
    - `deal_id`: Deal to delete

    **Returns:**
    - `204 No Content`: Deal deleted successfully
    - `404 Not Found`: Deal with specified ID does not exist

    **Example:**
    ```bash
    curl -X DELETE http://localhost:8000/api/deals/deal-550e8400-e29b-41d4-a716-446655440000
    ```
    """
    deleted = DealStorage.delete_deal(deal_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail=f"Deal not found: {deal_id}"
        )

    return JSONResponse(status_code=204, content=None)


@router.get("/stats/summary")
async def get_deal_stats():
    """
    Get statistics about all deals.

    **Returns:**
    - `200 OK`: Storage statistics including:
      - total_deals
      - active_deals
      - completed_deals
      - draft_deals
      - archived_deals
      - average_completion

    **Example:**
    ```bash
    curl http://localhost:8000/api/deals/stats/summary
    ```
    """
    try:
        stats = DealStorage.get_storage_stats()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve stats: {str(e)}"
        )
