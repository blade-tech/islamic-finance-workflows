"""
TEMPLATE API ENDPOINTS
======================
Endpoints for Islamic Finance workflow template management.
"""

from typing import List
from fastapi import APIRouter, HTTPException
from loguru import logger

from app.services.template_service import get_template_service, WorkflowTemplate

router = APIRouter()


@router.get("/templates")
async def list_templates() -> List[dict]:
    """
    Get all available workflow templates.

    Returns:
        List of all templates with full details
    """
    try:
        service = get_template_service()
        templates = service.list_templates()
        logger.info(f"Returning {len(templates)} templates")

        # Convert to dict for JSON response
        return [template.model_dump() for template in templates]
    except Exception as e:
        logger.error(f"Error listing templates: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates/{template_id}")
async def get_template(template_id: str) -> dict:
    """
    Get a specific template by ID.

    Args:
        template_id: Template identifier (e.g., 'murabaha_structuring')

    Returns:
        Complete template details

    Raises:
        404: Template not found
    """
    try:
        service = get_template_service()
        template = service.get_template(template_id)
        logger.info(f"Returning template: {template_id}")
        return template.model_dump()
    except ValueError as e:
        logger.warning(f"Template not found: {template_id}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting template {template_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates/category/{category}")
async def get_templates_by_category(category: str) -> List[dict]:
    """
    Get templates filtered by category.

    Args:
        category: Category name (structuring, compliance, screening, documentation, reconciliation)

    Returns:
        List of templates in the specified category
    """
    try:
        service = get_template_service()
        templates = service.get_templates_by_category(category)
        logger.info(f"Returning {len(templates)} templates for category '{category}'")
        return [template.model_dump() for template in templates]
    except Exception as e:
        logger.error(f"Error getting templates by category {category}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
