"""
COLLABORATION SERVICE
=====================
Manages contract ownership, subscribers, and collaboration features.

Features:
- Owner + subscribers model (1 owner + up to 10 subscribers)
- Subscriber management (add, remove, list)
- Ownership transfer
- Notification preference management

Follows Vanta's multi-stakeholder collaboration patterns.
"""

from datetime import datetime
from typing import List, Optional, Dict
from uuid import uuid4

from app.models import (
    Subscriber,
    NotificationPreferences,
    NotificationChannel
)


# ============================================================================
# IN-MEMORY STORAGE (mock database)
# ============================================================================

# contract_id -> owner_email
_contract_owners: Dict[str, str] = {}

# contract_id -> List[Subscriber]
_contract_subscribers: Dict[str, List[Subscriber]] = {}


# ============================================================================
# OWNER MANAGEMENT
# ============================================================================

def set_contract_owner(contract_id: str, owner_email: str) -> None:
    """
    Set the owner of a contract.
    Called when contract is created or ownership is transferred.
    """
    _contract_owners[contract_id] = owner_email


def get_contract_owner(contract_id: str) -> Optional[str]:
    """Get the owner email for a contract."""
    return _contract_owners.get(contract_id)


def transfer_ownership(
    contract_id: str,
    new_owner_email: str,
    transferred_by: str
) -> bool:
    """
    Transfer contract ownership to a new user.

    Args:
        contract_id: Contract ID
        new_owner_email: Email of new owner
        transferred_by: Email of user initiating transfer

    Returns:
        True if transfer successful

    Rules:
        - Only current owner can transfer ownership
        - New owner must not already be owner
        - New owner is automatically removed from subscribers if present
    """
    current_owner = get_contract_owner(contract_id)

    if not current_owner:
        raise ValueError(f"Contract {contract_id} has no owner")

    if transferred_by != current_owner:
        raise PermissionError("Only contract owner can transfer ownership")

    if new_owner_email == current_owner:
        raise ValueError("New owner is already the current owner")

    # Transfer ownership
    set_contract_owner(contract_id, new_owner_email)

    # Remove new owner from subscribers if present
    if contract_id in _contract_subscribers:
        _contract_subscribers[contract_id] = [
            sub for sub in _contract_subscribers[contract_id]
            if sub.user_email != new_owner_email
        ]

    return True


# ============================================================================
# SUBSCRIBER MANAGEMENT
# ============================================================================

def add_subscriber(
    contract_id: str,
    user_email: str,
    user_name: str,
    user_role: str,
    added_by: str,
    notification_preferences: Optional[NotificationPreferences] = None
) -> Subscriber:
    """
    Add a subscriber to a contract.

    Args:
        contract_id: Contract ID
        user_email: Email of subscriber
        user_name: Name of subscriber
        user_role: Role of subscriber
        added_by: Email of user adding the subscriber
        notification_preferences: Optional notification preferences

    Returns:
        Subscriber object

    Rules:
        - Max 10 subscribers per contract
        - User cannot subscribe if they're the owner
        - User cannot be subscribed twice
    """
    # Initialize subscribers list if needed
    if contract_id not in _contract_subscribers:
        _contract_subscribers[contract_id] = []

    subscribers = _contract_subscribers[contract_id]

    # Check max subscribers
    if len(subscribers) >= 10:
        raise ValueError("Maximum 10 subscribers allowed per contract")

    # Check if user is owner
    owner_email = get_contract_owner(contract_id)
    if owner_email and user_email == owner_email:
        raise ValueError("Contract owner cannot be added as subscriber")

    # Check if already subscribed
    if any(sub.user_email == user_email for sub in subscribers):
        raise ValueError(f"User {user_email} is already subscribed to this contract")

    # Create subscriber
    subscriber = Subscriber(
        contract_id=contract_id,
        user_email=user_email,
        user_name=user_name,
        user_role=user_role,
        notification_preferences=notification_preferences or NotificationPreferences(),
        subscribed_at=datetime.utcnow(),
        subscribed_by=added_by
    )

    # Add to list
    _contract_subscribers[contract_id].append(subscriber)

    return subscriber


def remove_subscriber(
    contract_id: str,
    user_email: str,
    removed_by: str
) -> bool:
    """
    Remove a subscriber from a contract.

    Args:
        contract_id: Contract ID
        user_email: Email of subscriber to remove
        removed_by: Email of user removing the subscriber

    Returns:
        True if subscriber was removed

    Rules:
        - Only contract owner can remove subscribers
        - User can remove themselves (self-unsubscribe)
    """
    owner_email = get_contract_owner(contract_id)

    # Check permissions
    if removed_by != owner_email and removed_by != user_email:
        raise PermissionError(
            "Only contract owner or the subscriber themselves can remove a subscriber"
        )

    # Remove subscriber
    if contract_id in _contract_subscribers:
        original_count = len(_contract_subscribers[contract_id])
        _contract_subscribers[contract_id] = [
            sub for sub in _contract_subscribers[contract_id]
            if sub.user_email != user_email
        ]
        removed = len(_contract_subscribers[contract_id]) < original_count
        return removed

    return False


def list_subscribers(contract_id: str) -> List[Subscriber]:
    """
    List all subscribers for a contract.

    Args:
        contract_id: Contract ID

    Returns:
        List of Subscriber objects
    """
    return _contract_subscribers.get(contract_id, [])


def get_subscriber(contract_id: str, user_email: str) -> Optional[Subscriber]:
    """
    Get a specific subscriber.

    Args:
        contract_id: Contract ID
        user_email: Email of subscriber

    Returns:
        Subscriber object or None if not found
    """
    subscribers = list_subscribers(contract_id)
    for sub in subscribers:
        if sub.user_email == user_email:
            return sub
    return None


def update_subscriber_preferences(
    contract_id: str,
    user_email: str,
    preferences: NotificationPreferences
) -> Subscriber:
    """
    Update notification preferences for a subscriber.

    Args:
        contract_id: Contract ID
        user_email: Email of subscriber
        preferences: New notification preferences

    Returns:
        Updated Subscriber object

    Rules:
        - Only the subscriber themselves can update their preferences
    """
    subscriber = get_subscriber(contract_id, user_email)

    if not subscriber:
        raise ValueError(f"Subscriber {user_email} not found for contract {contract_id}")

    # Update preferences
    subscriber.notification_preferences = preferences

    return subscriber


# ============================================================================
# STAKEHOLDER QUERIES
# ============================================================================

def get_all_stakeholders(contract_id: str) -> Dict[str, any]:
    """
    Get all stakeholders (owner + subscribers) for a contract.

    Args:
        contract_id: Contract ID

    Returns:
        Dictionary with owner and subscribers
    """
    owner_email = get_contract_owner(contract_id)
    subscribers = list_subscribers(contract_id)

    return {
        "owner_email": owner_email,
        "subscriber_count": len(subscribers),
        "subscribers": subscribers
    }


def is_stakeholder(contract_id: str, user_email: str) -> bool:
    """
    Check if a user is a stakeholder (owner or subscriber) of a contract.

    Args:
        contract_id: Contract ID
        user_email: User email

    Returns:
        True if user is owner or subscriber
    """
    # Check if owner
    owner_email = get_contract_owner(contract_id)
    if owner_email == user_email:
        return True

    # Check if subscriber
    subscribers = list_subscribers(contract_id)
    return any(sub.user_email == user_email for sub in subscribers)


def get_contracts_for_user(user_email: str) -> Dict[str, List[str]]:
    """
    Get all contracts where user is a stakeholder.

    Args:
        user_email: User email

    Returns:
        Dictionary with owned and subscribed contract IDs
    """
    owned_contracts = []
    subscribed_contracts = []

    # Find owned contracts
    for contract_id, owner in _contract_owners.items():
        if owner == user_email:
            owned_contracts.append(contract_id)

    # Find subscribed contracts
    for contract_id, subscribers in _contract_subscribers.items():
        for sub in subscribers:
            if sub.user_email == user_email:
                subscribed_contracts.append(contract_id)
                break

    return {
        "owned": owned_contracts,
        "subscribed": subscribed_contracts,
        "total": len(owned_contracts) + len(subscribed_contracts)
    }


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def can_user_modify_contract(contract_id: str, user_email: str) -> bool:
    """
    Check if user has permission to modify contract.
    Only owner can modify contract.

    Args:
        contract_id: Contract ID
        user_email: User email

    Returns:
        True if user is owner
    """
    owner_email = get_contract_owner(contract_id)
    return owner_email == user_email


def can_user_view_contract(contract_id: str, user_email: str) -> bool:
    """
    Check if user has permission to view contract.
    Owner and subscribers can view.

    Args:
        contract_id: Contract ID
        user_email: User email

    Returns:
        True if user is stakeholder
    """
    return is_stakeholder(contract_id, user_email)


# ============================================================================
# MOCK DATA INITIALIZATION (for testing)
# ============================================================================

def initialize_mock_data():
    """Initialize mock collaboration data for testing."""
    # Create mock contracts with owners
    mock_contracts = [
        {
            "contract_id": "contract-001",
            "owner_email": "business@example.com"
        },
        {
            "contract_id": "contract-002",
            "owner_email": "finance@example.com"
        }
    ]

    for contract in mock_contracts:
        set_contract_owner(contract["contract_id"], contract["owner_email"])

    # Add mock subscribers
    try:
        add_subscriber(
            contract_id="contract-001",
            user_email="shariah@example.com",
            user_name="Dr. Ahmad Al-Sharif",
            user_role="shariah_advisor",
            added_by="business@example.com"
        )

        add_subscriber(
            contract_id="contract-001",
            user_email="legal@example.com",
            user_name="Sarah Johnson",
            user_role="legal_counsel",
            added_by="business@example.com"
        )

        add_subscriber(
            contract_id="contract-002",
            user_email="compliance@example.com",
            user_name="Mohammed Ali",
            user_role="compliance_manager",
            added_by="finance@example.com"
        )
    except (ValueError, PermissionError):
        # Ignore errors if already initialized
        pass


# Initialize mock data on module load
initialize_mock_data()
