"""
COLLABORATION API
=================
REST API endpoints for contract collaboration and subscriber management.

Endpoints:
- POST /api/contracts/{id}/subscribers - Add subscriber
- GET /api/contracts/{id}/subscribers - List subscribers
- DELETE /api/contracts/{id}/subscribers/{email} - Remove subscriber
- PUT /api/contracts/{id}/owner - Transfer ownership
- GET /api/users/{email}/contracts - Get user's contracts
"""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import logging

from app.models import (
    AddSubscriberRequest,
    AddSubscriberResponse,
    ListSubscribersResponse,
    TransferOwnershipRequest,
    TransferOwnershipResponse
)
from app.services import collaboration_service


logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================================================
# SUBSCRIBER MANAGEMENT
# ============================================================================

@router.post(
    "/contracts/{contract_id}/subscribers",
    response_model=AddSubscriberResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["collaboration"]
)
async def add_subscriber(
    contract_id: str,
    request: AddSubscriberRequest,
    added_by: str = "current_user@example.com"  # TODO: Get from auth
) -> AddSubscriberResponse:
    """
    Add a subscriber to a contract.

    **Rules:**
    - Maximum 10 subscribers per contract
    - Contract owner cannot be added as subscriber
    - User cannot be subscribed twice

    **Permissions:** Contract owner or admin
    """
    try:
        subscriber = collaboration_service.add_subscriber(
            contract_id=contract_id,
            user_email=request.user_email,
            user_name=request.user_name,
            user_role=request.user_role,
            added_by=added_by,
            notification_preferences=request.notification_preferences
        )

        logger.info(f"Added subscriber {request.user_email} to contract {contract_id}")

        return AddSubscriberResponse(subscriber=subscriber)

    except ValueError as e:
        logger.error(f"Invalid subscriber addition: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except PermissionError as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.get(
    "/contracts/{contract_id}/subscribers",
    response_model=ListSubscribersResponse,
    tags=["collaboration"]
)
async def list_subscribers(contract_id: str) -> ListSubscribersResponse:
    """
    List all subscribers for a contract.

    **Returns:** List of subscribers with their notification preferences
    """
    subscribers = collaboration_service.list_subscribers(contract_id)
    owner_email = collaboration_service.get_contract_owner(contract_id)

    return ListSubscribersResponse(
        subscribers=subscribers,
        owner_email=owner_email or "unknown"
    )


@router.delete(
    "/contracts/{contract_id}/subscribers/{user_email}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["collaboration"]
)
async def remove_subscriber(
    contract_id: str,
    user_email: str,
    removed_by: str = "current_user@example.com"  # TODO: Get from auth
) -> None:
    """
    Remove a subscriber from a contract.

    **Rules:**
    - Contract owner can remove any subscriber
    - Users can remove themselves (self-unsubscribe)

    **Permissions:** Contract owner or the subscriber themselves
    """
    try:
        removed = collaboration_service.remove_subscriber(
            contract_id=contract_id,
            user_email=user_email,
            removed_by=removed_by
        )

        if not removed:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Subscriber {user_email} not found for contract {contract_id}"
            )

        logger.info(f"Removed subscriber {user_email} from contract {contract_id}")

    except PermissionError as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


# ============================================================================
# OWNERSHIP MANAGEMENT
# ============================================================================

@router.put(
    "/contracts/{contract_id}/owner",
    response_model=TransferOwnershipResponse,
    tags=["collaboration"]
)
async def transfer_ownership(
    contract_id: str,
    request: TransferOwnershipRequest,
    transferred_by: str = "current_user@example.com"  # TODO: Get from auth
) -> TransferOwnershipResponse:
    """
    Transfer contract ownership to a new user.

    **Rules:**
    - Only current owner can transfer ownership
    - New owner cannot already be the owner
    - New owner is automatically removed from subscribers if present

    **Permissions:** Contract owner only
    """
    try:
        success = collaboration_service.transfer_ownership(
            contract_id=contract_id,
            new_owner_email=request.new_owner_email,
            transferred_by=transferred_by
        )

        logger.info(
            f"Transferred ownership of contract {contract_id} "
            f"from {transferred_by} to {request.new_owner_email}"
        )

        return TransferOwnershipResponse(
            success=success,
            new_owner_email=request.new_owner_email
        )

    except ValueError as e:
        logger.error(f"Invalid ownership transfer: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except PermissionError as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


# ============================================================================
# USER QUERIES
# ============================================================================

@router.get(
    "/users/{user_email}/contracts",
    response_model=Dict[str, Any],
    tags=["collaboration"]
)
async def get_user_contracts(user_email: str) -> Dict[str, Any]:
    """
    Get all contracts where user is a stakeholder (owner or subscriber).

    **Returns:**
    - owned: List of contract IDs where user is owner
    - subscribed: List of contract IDs where user is subscriber
    - total: Total count
    """
    contracts = collaboration_service.get_contracts_for_user(user_email)
    return contracts


@router.get(
    "/contracts/{contract_id}/stakeholders",
    response_model=Dict[str, Any],
    tags=["collaboration"]
)
async def get_all_stakeholders(contract_id: str) -> Dict[str, Any]:
    """
    Get all stakeholders (owner + subscribers) for a contract.

    **Returns:**
    - owner_email: Contract owner
    - subscriber_count: Number of subscribers
    - subscribers: List of Subscriber objects
    """
    stakeholders = collaboration_service.get_all_stakeholders(contract_id)
    return stakeholders


# ============================================================================
# PERMISSIONS CHECKS (utility endpoints)
# ============================================================================

@router.get(
    "/contracts/{contract_id}/permissions/{user_email}",
    response_model=Dict[str, bool],
    tags=["collaboration"]
)
async def check_user_permissions(contract_id: str, user_email: str) -> Dict[str, bool]:
    """
    Check what permissions a user has on a contract.

    **Returns:**
    - can_view: Can view contract
    - can_modify: Can modify contract
    - is_owner: Is contract owner
    - is_subscriber: Is subscriber
    """
    return {
        "can_view": collaboration_service.can_user_view_contract(contract_id, user_email),
        "can_modify": collaboration_service.can_user_modify_contract(contract_id, user_email),
        "is_owner": collaboration_service.get_contract_owner(contract_id) == user_email,
        "is_subscriber": collaboration_service.is_stakeholder(contract_id, user_email)
    }
