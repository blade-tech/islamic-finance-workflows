"""
DASHBOARD API ROUTER
====================
Compliance dashboard endpoints for 4-component modular architecture.

Provides:
- Dashboard overview with all 4 component compliances
- Component-level compliance details
- Deal configurations and compliance
- Monitoring card details
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.models import (
    DashboardMetrics,
    ComponentCompliance,
    DealConfiguration,
    ComponentType
)
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardMetrics)
async def get_dashboard_overview():
    """
    Get complete dashboard overview with all 4 component compliances.

    Returns:
        DashboardMetrics: Complete dashboard with component compliances,
                         monitoring cards, and active deals

    Example Response:
        {
            "shariah_compliance": {...},
            "jurisdiction_compliance": {...},
            "accounting_compliance": {...},
            "impact_compliance": {...},
            "contracts_card": {...},
            "shariah_reviews_card": {...},
            "impact_validations_card": {...},
            "documents_card": {...},
            "active_deals": [...],
            "total_deals": 5,
            "compliant_deals": 3,
            "deals_needing_attention": 1,
            "overall_platform_compliance": 75.5
        }
    """
    try:
        return await DashboardService.get_dashboard_overview()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dashboard: {str(e)}")


@router.get("/components/{component_type}", response_model=ComponentCompliance)
async def get_component_compliance(component_type: ComponentType):
    """
    Get detailed compliance for a specific component type.

    Args:
        component_type: One of: shariah_structure, jurisdiction, accounting, impact

    Returns:
        ComponentCompliance: Aggregated compliance metrics for the component type

    Example:
        GET /api/dashboard/components/shariah_structure

        Returns compliance aggregated across all Shariah structures in use
    """
    try:
        return await DashboardService.get_component_compliance(component_type)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load {component_type} compliance: {str(e)}"
        )


@router.get("/deals", response_model=List[DealConfiguration])
async def get_all_deals(
    component_type: Optional[ComponentType] = Query(None, description="Filter by component type"),
    component_id: Optional[str] = Query(None, description="Filter by specific component ID")
):
    """
    Get all deals, optionally filtered by component.

    Args:
        component_type: Optional filter by component type
        component_id: Optional filter by specific component ID

    Returns:
        List[DealConfiguration]: List of deals with full compliance details

    Examples:
        GET /api/dashboard/deals
        - Returns all deals

        GET /api/dashboard/deals?component_type=jurisdiction&component_id=uae_dfsa
        - Returns only deals using UAE DFSA jurisdiction

        GET /api/dashboard/deals?component_type=shariah_structure&component_id=sukuk_ijara
        - Returns only Sukuk Ijara deals
    """
    try:
        return await DashboardService.get_deals(component_type, component_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load deals: {str(e)}")


@router.get("/deals/{deal_id}", response_model=DealConfiguration)
async def get_deal_compliance(deal_id: str):
    """
    Get full compliance breakdown for a specific deal.

    Args:
        deal_id: The deal ID (workflow execution ID)

    Returns:
        DealConfiguration: Complete deal configuration with component compliances

    Example:
        GET /api/dashboard/deals/exec-123

        Returns full compliance for deal exec-123 including:
        - Selected components (Shariah, Jurisdiction, Accounting, Impact)
        - Compliance metrics for each component
        - Overall deal completion percentage
    """
    try:
        deal = await DashboardService.get_deal_compliance(deal_id)
        if not deal:
            raise HTTPException(status_code=404, detail=f"Deal {deal_id} not found")
        return deal
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load deal {deal_id}: {str(e)}"
        )


@router.get("/monitoring/{card_type}")
async def get_monitoring_card_details(card_type: str):
    """
    Get detailed breakdown for a monitoring card.

    Args:
        card_type: One of: contracts, shariah_reviews, impact_validations, documents

    Returns:
        dict: Detailed breakdown of the monitoring card by component

    Example:
        GET /api/dashboard/monitoring/contracts

        Returns:
        {
            "total_count": 15,
            "needs_attention_count": 3,
            "breakdown": {
                "sukuk_ijara": 8,
                "sukuk_murabaha": 5,
                "murabaha": 2
            },
            "details": [...]
        }
    """
    valid_card_types = ['contracts', 'shariah_reviews', 'impact_validations', 'documents']
    if card_type not in valid_card_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid card_type. Must be one of: {', '.join(valid_card_types)}"
        )

    try:
        return await DashboardService.get_monitoring_card_details(card_type)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load monitoring card {card_type}: {str(e)}"
        )
