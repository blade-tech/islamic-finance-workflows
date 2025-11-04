"""
NOTIFICATIONS API
=================
REST API endpoints for notification management and preferences.

Endpoints:
- GET /api/notifications - List user notifications
- GET /api/notifications/{id} - Get single notification
- PUT /api/notifications/{id}/read - Mark notification as read/unread
- DELETE /api/notifications/{id} - Delete notification
- POST /api/notifications/mark-all-read - Mark all notifications as read
- GET /api/notifications/preferences - Get notification preferences
- PUT /api/notifications/preferences - Update notification preferences
"""

from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional
import logging

from app.models import (
    ListNotificationsResponse,
    Notification,
    MarkNotificationReadRequest,
    MarkNotificationReadResponse,
    UpdateNotificationPreferencesRequest,
    UpdateNotificationPreferencesResponse
)
from app.services import notification_service


logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================================================
# NOTIFICATION QUERIES
# ============================================================================

@router.get(
    "/notifications",
    response_model=ListNotificationsResponse,
    tags=["notifications"]
)
async def list_notifications(
    user_email: str = "current_user@example.com",  # TODO: Get from auth
    unread_only: bool = Query(False, description="Only show unread notifications"),
    limit: int = Query(50, ge=1, le=100, description="Maximum notifications to return")
) -> ListNotificationsResponse:
    """
    List notifications for the current user.

    **Parameters:**
    - unread_only: Filter to unread notifications only
    - limit: Maximum number of notifications to return (1-100, default 50)

    **Returns:**
    - notifications: List of Notification objects (sorted newest first)
    - unread_count: Count of unread notifications
    - total: Total notification count
    """
    notifications = notification_service.list_user_notifications(
        user_email=user_email,
        unread_only=unread_only,
        limit=limit
    )

    unread_count = notification_service.get_unread_count(user_email)

    return ListNotificationsResponse(
        notifications=notifications,
        unread_count=unread_count,
        total=len(notifications)
    )


@router.get(
    "/notifications/{notification_id}",
    response_model=Notification,
    tags=["notifications"]
)
async def get_notification(notification_id: str) -> Notification:
    """
    Get a single notification by ID.
    """
    notification = notification_service.get_notification(notification_id)

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification {notification_id} not found"
        )

    return notification


@router.get(
    "/notifications/count/unread",
    tags=["notifications"]
)
async def get_unread_count(
    user_email: str = "current_user@example.com"  # TODO: Get from auth
):
    """
    Get count of unread notifications for current user.

    **Returns:** { "count": number }
    """
    count = notification_service.get_unread_count(user_email)
    return {"count": count}


# ============================================================================
# NOTIFICATION ACTIONS
# ============================================================================

@router.put(
    "/notifications/{notification_id}/read",
    response_model=MarkNotificationReadResponse,
    tags=["notifications"]
)
async def mark_notification_read(
    notification_id: str,
    request: MarkNotificationReadRequest,
    user_email: str = "current_user@example.com"  # TODO: Get from auth
) -> MarkNotificationReadResponse:
    """
    Mark a notification as read or unread.

    **Parameters:**
    - read: true (mark as read) or false (mark as unread)

    **Rules:**
    - Only notification recipient can mark as read/unread

    **Permissions:** Notification recipient only
    """
    try:
        if request.read:
            notification = notification_service.mark_as_read(
                notification_id=notification_id,
                user_email=user_email
            )
        else:
            notification = notification_service.mark_as_unread(
                notification_id=notification_id,
                user_email=user_email
            )

        logger.info(
            f"Marked notification {notification_id} as "
            f"{'read' if request.read else 'unread'} by {user_email}"
        )

        return MarkNotificationReadResponse(notification=notification)

    except ValueError as e:
        logger.error(f"Invalid notification action: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except PermissionError as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.post(
    "/notifications/mark-all-read",
    tags=["notifications"]
)
async def mark_all_notifications_read(
    user_email: str = "current_user@example.com"  # TODO: Get from auth
):
    """
    Mark all notifications as read for current user.

    **Returns:** Count of notifications marked as read
    """
    count = notification_service.mark_all_as_read(user_email)

    logger.info(f"Marked {count} notifications as read for {user_email}")

    return {"marked_read": count}


@router.delete(
    "/notifications/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["notifications"]
)
async def delete_notification(
    notification_id: str,
    user_email: str = "current_user@example.com"  # TODO: Get from auth
) -> None:
    """
    Delete a notification.

    **Rules:**
    - Only notification recipient can delete

    **Permissions:** Notification recipient only
    """
    try:
        deleted = notification_service.delete_notification(
            notification_id=notification_id,
            user_email=user_email
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notification {notification_id} not found"
            )

        logger.info(f"Deleted notification {notification_id} by {user_email}")

    except PermissionError as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


# ============================================================================
# NOTIFICATION PREFERENCES
# ============================================================================

@router.get(
    "/notifications/preferences",
    response_model=UpdateNotificationPreferencesResponse,
    tags=["notifications"]
)
async def get_notification_preferences(
    user_email: str = "current_user@example.com"  # TODO: Get from auth
) -> UpdateNotificationPreferencesResponse:
    """
    Get notification preferences for current user.

    **Returns:**
    - enabled: Whether notifications are enabled
    - channels: Delivery channels (email, in_app, webhook)
    - frequency: real_time | daily_digest | weekly_digest
    - Event type preferences (contract_updates, approval_requests, etc.)
    """
    preferences = notification_service.get_user_preferences(user_email)

    return UpdateNotificationPreferencesResponse(preferences=preferences)


@router.put(
    "/notifications/preferences",
    response_model=UpdateNotificationPreferencesResponse,
    tags=["notifications"]
)
async def update_notification_preferences(
    request: UpdateNotificationPreferencesRequest,
    user_email: str = "current_user@example.com"  # TODO: Get from auth
) -> UpdateNotificationPreferencesResponse:
    """
    Update notification preferences for current user.

    **Configurable Options:**
    - enabled: Enable/disable all notifications
    - channels.email: Enable email notifications
    - channels.in_app: Enable in-app notifications
    - channels.webhook: Webhook URL (optional)
    - frequency: real_time, daily_digest, or weekly_digest
    - Event type toggles:
      - contract_updates
      - approval_requests
      - task_assignments
      - comments_mentions
      - workflow_completion
    """
    preferences = notification_service.update_user_preferences(
        user_email=user_email,
        preferences=request.preferences
    )

    logger.info(f"Updated notification preferences for {user_email}")

    return UpdateNotificationPreferencesResponse(preferences=preferences)


# ============================================================================
# TESTING/DEBUGGING ENDPOINTS (Optional - Remove in production)
# ============================================================================

@router.post(
    "/notifications/test",
    tags=["notifications"],
    include_in_schema=False  # Hide from API docs
)
async def create_test_notification(
    user_email: str = "current_user@example.com"  # TODO: Get from auth
):
    """
    Create a test notification for debugging.

    **Note:** This endpoint should be removed in production.
    """
    notification = notification_service.create_notification(
        recipient_email=user_email,
        notification_type='contract_updated',
        title="Test Notification",
        message="This is a test notification created via the API.",
        source_contract_id="test-contract-001",
        action_url="/contracts/test-contract-001",
        action_label="View Contract"
    )

    if notification:
        return {
            "status": "success",
            "notification_id": notification.notification_id
        }
    else:
        return {
            "status": "skipped",
            "reason": "User has notifications disabled"
        }
