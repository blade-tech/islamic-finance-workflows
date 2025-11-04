"""
NOTIFICATION SERVICE
====================
Manages multi-channel notifications for contract collaboration.

Features:
- Multi-channel delivery (email, in-app, webhook)
- Notification preferences management
- Read/unread tracking
- Notification types (contract updates, task assignments, mentions, etc.)
- Reminder scheduling
- Notification history

Follows Vanta's notification patterns.
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict
from uuid import uuid4

from app.models import Notification, NotificationPreferences


# ============================================================================
# IN-MEMORY STORAGE (mock database)
# ============================================================================

# notification_id -> Notification
_notifications: Dict[str, Notification] = {}

# user_email -> List[notification_id]
_user_notifications: Dict[str, List[str]] = {}

# user_email -> NotificationPreferences
_user_preferences: Dict[str, NotificationPreferences] = {}


# ============================================================================
# NOTIFICATION CREATION
# ============================================================================

def create_notification(
    recipient_email: str,
    notification_type: str,
    title: str,
    message: str,
    source_contract_id: str,
    source_task_id: Optional[str] = None,
    source_comment_id: Optional[str] = None,
    source_user_email: Optional[str] = None,
    action_url: Optional[str] = None,
    action_label: Optional[str] = None
) -> Notification:
    """
    Create a new notification.

    Args:
        recipient_email: Email of notification recipient
        notification_type: Type of notification
        title: Notification title
        message: Notification message
        source_contract_id: Contract ID that triggered notification
        source_task_id: Optional task ID (if task-related)
        source_comment_id: Optional comment ID (if comment-related)
        source_user_email: Optional user who triggered notification
        action_url: Optional URL to navigate to
        action_label: Optional label for action button

    Returns:
        Notification object

    Note:
        This function creates the notification object. Actual delivery
        (email, webhook) should be handled by separate delivery functions.
    """
    # Check user preferences
    preferences = get_user_preferences(recipient_email)

    # If notifications disabled, don't create
    if not preferences.enabled:
        return None

    # Create notification
    notification = Notification(
        notification_id=f"notif-{uuid4().hex[:8]}",
        recipient_email=recipient_email,
        type=notification_type,
        title=title,
        message=message,
        source_contract_id=source_contract_id,
        source_task_id=source_task_id,
        source_comment_id=source_comment_id,
        source_user_email=source_user_email,
        read=False,
        read_at=None,
        action_url=action_url,
        action_label=action_label,
        created_at=datetime.utcnow()
    )

    # Store notification
    _notifications[notification.notification_id] = notification

    # Add to user's notification list
    if recipient_email not in _user_notifications:
        _user_notifications[recipient_email] = []
    _user_notifications[recipient_email].append(notification.notification_id)

    # Trigger delivery based on preferences
    _deliver_notification(notification, preferences)

    return notification


def _deliver_notification(
    notification: Notification,
    preferences: NotificationPreferences
) -> None:
    """
    Deliver notification via enabled channels.

    Args:
        notification: Notification object
        preferences: User's notification preferences

    Note:
        This is a mock implementation. In production, this would:
        - Send email via SendGrid/AWS SES
        - Send webhook POST request
        - Store in-app notification (already done)
    """
    # Check if this notification type is enabled
    type_enabled = True

    if notification.type in ['contract_created', 'contract_updated'] and not preferences.contract_updates:
        type_enabled = False
    elif notification.type in ['approval_requested', 'approval_granted', 'approval_rejected'] and not preferences.approval_requests:
        type_enabled = False
    elif notification.type in ['task_assigned', 'task_completed', 'task_overdue'] and not preferences.task_assignments:
        type_enabled = False
    elif notification.type in ['comment_added', 'mention_in_comment'] and not preferences.comments_mentions:
        type_enabled = False
    elif notification.type in ['workflow_completed', 'workflow_failed'] and not preferences.workflow_completion:
        type_enabled = False

    if not type_enabled:
        return

    # Deliver via enabled channels
    if preferences.channels.email:
        _send_email_notification(notification)

    if preferences.channels.webhook:
        _send_webhook_notification(notification, preferences.channels.webhook)

    # In-app notification is already stored in _notifications


def _send_email_notification(notification: Notification) -> None:
    """
    Send notification via email.

    Args:
        notification: Notification object

    Note:
        Mock implementation. In production, use SendGrid/AWS SES.
    """
    # TODO: Integrate with email service
    # Example:
    # import sendgrid
    # sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
    # ...
    pass


def _send_webhook_notification(notification: Notification, webhook_url: str) -> None:
    """
    Send notification via webhook.

    Args:
        notification: Notification object
        webhook_url: Webhook URL

    Note:
        Mock implementation. In production, use requests library.
    """
    # TODO: Integrate with HTTP client
    # Example:
    # import requests
    # requests.post(webhook_url, json=notification.dict())
    pass


# ============================================================================
# NOTIFICATION PREFERENCES
# ============================================================================

def get_user_preferences(user_email: str) -> NotificationPreferences:
    """
    Get notification preferences for a user.

    Args:
        user_email: User email

    Returns:
        NotificationPreferences object (defaults if not set)
    """
    return _user_preferences.get(user_email, NotificationPreferences())


def update_user_preferences(
    user_email: str,
    preferences: NotificationPreferences
) -> NotificationPreferences:
    """
    Update notification preferences for a user.

    Args:
        user_email: User email
        preferences: New notification preferences

    Returns:
        Updated NotificationPreferences object
    """
    _user_preferences[user_email] = preferences
    return preferences


# ============================================================================
# NOTIFICATION QUERIES
# ============================================================================

def get_notification(notification_id: str) -> Optional[Notification]:
    """
    Get a notification by ID.

    Args:
        notification_id: Notification ID

    Returns:
        Notification object or None if not found
    """
    return _notifications.get(notification_id)


def list_user_notifications(
    user_email: str,
    unread_only: bool = False,
    limit: int = 50
) -> List[Notification]:
    """
    List notifications for a user.

    Args:
        user_email: User email
        unread_only: Only return unread notifications
        limit: Maximum notifications to return

    Returns:
        List of Notification objects, sorted by created_at descending
    """
    if user_email not in _user_notifications:
        return []

    # Get user's notifications
    notification_ids = _user_notifications[user_email]
    notifications = [
        _notifications[nid] for nid in notification_ids
        if nid in _notifications
    ]

    # Filter unread if requested
    if unread_only:
        notifications = [n for n in notifications if not n.read]

    # Sort by created_at descending (newest first)
    notifications.sort(key=lambda n: n.created_at, reverse=True)

    # Apply limit
    return notifications[:limit]


def get_unread_count(user_email: str) -> int:
    """
    Get count of unread notifications for a user.

    Args:
        user_email: User email

    Returns:
        Count of unread notifications
    """
    notifications = list_user_notifications(user_email, unread_only=True)
    return len(notifications)


# ============================================================================
# NOTIFICATION ACTIONS
# ============================================================================

def mark_as_read(
    notification_id: str,
    user_email: str
) -> Notification:
    """
    Mark a notification as read.

    Args:
        notification_id: Notification ID
        user_email: User email (for permission check)

    Returns:
        Updated Notification object

    Rules:
        - Only notification recipient can mark as read
    """
    notification = get_notification(notification_id)

    if not notification:
        raise ValueError(f"Notification {notification_id} not found")

    # Check permissions
    if notification.recipient_email != user_email:
        raise PermissionError("Only notification recipient can mark it as read")

    # Mark as read
    notification.read = True
    notification.read_at = datetime.utcnow()

    return notification


def mark_as_unread(
    notification_id: str,
    user_email: str
) -> Notification:
    """
    Mark a notification as unread.

    Args:
        notification_id: Notification ID
        user_email: User email (for permission check)

    Returns:
        Updated Notification object
    """
    notification = get_notification(notification_id)

    if not notification:
        raise ValueError(f"Notification {notification_id} not found")

    # Check permissions
    if notification.recipient_email != user_email:
        raise PermissionError("Only notification recipient can mark it as unread")

    # Mark as unread
    notification.read = False
    notification.read_at = None

    return notification


def mark_all_as_read(user_email: str) -> int:
    """
    Mark all notifications as read for a user.

    Args:
        user_email: User email

    Returns:
        Count of notifications marked as read
    """
    notifications = list_user_notifications(user_email, unread_only=True)
    now = datetime.utcnow()

    for notification in notifications:
        notification.read = True
        notification.read_at = now

    return len(notifications)


def delete_notification(
    notification_id: str,
    user_email: str
) -> bool:
    """
    Delete a notification.

    Args:
        notification_id: Notification ID
        user_email: User email (for permission check)

    Returns:
        True if notification was deleted

    Rules:
        - Only notification recipient can delete
    """
    notification = get_notification(notification_id)

    if not notification:
        return False

    # Check permissions
    if notification.recipient_email != user_email:
        raise PermissionError("Only notification recipient can delete it")

    # Remove from storage
    del _notifications[notification_id]

    # Remove from user's notification list
    if user_email in _user_notifications:
        _user_notifications[user_email] = [
            nid for nid in _user_notifications[user_email]
            if nid != notification_id
        ]

    return True


# ============================================================================
# NOTIFICATION GENERATION (Helper Functions)
# ============================================================================

def notify_contract_created(
    contract_id: str,
    owner_email: str,
    subscribers: List[str]
) -> None:
    """Notify stakeholders that a contract was created."""
    for email in subscribers:
        if email != owner_email:  # Don't notify creator
            create_notification(
                recipient_email=email,
                notification_type='contract_created',
                title="New Contract Created",
                message=f"A new contract has been created. You've been added as a subscriber.",
                source_contract_id=contract_id,
                source_user_email=owner_email,
                action_url=f"/contracts/{contract_id}",
                action_label="View Contract"
            )


def notify_task_assigned(
    contract_id: str,
    task_id: str,
    assignee_email: str,
    assigner_name: str,
    task_title: str
) -> None:
    """Notify user that a task was assigned to them."""
    create_notification(
        recipient_email=assignee_email,
        notification_type='task_assigned',
        title="Task Assigned",
        message=f"{assigner_name} assigned you a task: {task_title}",
        source_contract_id=contract_id,
        source_task_id=task_id,
        action_url=f"/contracts/{contract_id}/tasks/{task_id}",
        action_label="View Task"
    )


def notify_comment_mention(
    contract_id: str,
    comment_id: str,
    mentioned_email: str,
    author_name: str,
    comment_excerpt: str
) -> None:
    """Notify user that they were @mentioned in a comment."""
    create_notification(
        recipient_email=mentioned_email,
        notification_type='mention_in_comment',
        title="Mentioned in Comment",
        message=f"{author_name} mentioned you: {comment_excerpt[:100]}...",
        source_contract_id=contract_id,
        source_comment_id=comment_id,
        action_url=f"/contracts/{contract_id}/comments/{comment_id}",
        action_label="View Comment"
    )


def notify_approval_requested(
    contract_id: str,
    approver_email: str,
    requester_name: str,
    step_number: int
) -> None:
    """Notify user that their approval is requested."""
    create_notification(
        recipient_email=approver_email,
        notification_type='approval_requested',
        title="Approval Requested",
        message=f"{requester_name} requests your approval for Step {step_number}",
        source_contract_id=contract_id,
        action_url=f"/contracts/{contract_id}/step/{step_number}",
        action_label="Review & Approve"
    )


def notify_workflow_completed(
    contract_id: str,
    stakeholders: List[str]
) -> None:
    """Notify all stakeholders that workflow completed."""
    for email in stakeholders:
        create_notification(
            recipient_email=email,
            notification_type='workflow_completed',
            title="Workflow Completed",
            message="The contract workflow has been completed successfully.",
            source_contract_id=contract_id,
            action_url=f"/contracts/{contract_id}",
            action_label="View Results"
        )


# ============================================================================
# REMINDER SCHEDULING (Future Enhancement)
# ============================================================================

def schedule_task_reminder(
    task_id: str,
    assignee_email: str,
    due_date: datetime,
    hours_before: int = 24
) -> None:
    """
    Schedule a reminder notification for a task.

    Args:
        task_id: Task ID
        assignee_email: Email of assignee
        due_date: Task due date
        hours_before: Hours before due date to send reminder

    Note:
        Mock implementation. In production, use a task queue
        (Celery, AWS SQS, etc.) or scheduled job.
    """
    # TODO: Integrate with task queue
    # Example:
    # reminder_time = due_date - timedelta(hours=hours_before)
    # celery_app.send_task('send_task_reminder', args=[task_id], eta=reminder_time)
    pass


# ============================================================================
# MOCK DATA INITIALIZATION (for testing)
# ============================================================================

def initialize_mock_data():
    """Initialize mock notification data for testing."""
    # Create mock notifications
    now = datetime.utcnow()

    mock_notifications = [
        {
            "recipient_email": "shariah@example.com",
            "type": "task_assigned",
            "title": "Task Assigned",
            "message": "John Smith assigned you a task: Review profit-sharing structure",
            "source_contract_id": "contract-001",
            "source_task_id": "task-12345",
            "action_url": "/contracts/contract-001/tasks/task-12345",
            "action_label": "View Task"
        },
        {
            "recipient_email": "business@example.com",
            "type": "mention_in_comment",
            "title": "Mentioned in Comment",
            "message": "Dr. Ahmad Al-Sharif mentioned you: Please provide details about profit-sharing...",
            "source_contract_id": "contract-001",
            "source_comment_id": "comment-67890",
            "source_user_email": "shariah@example.com",
            "action_url": "/contracts/contract-001/comments/comment-67890",
            "action_label": "View Comment"
        },
        {
            "recipient_email": "legal@example.com",
            "type": "approval_requested",
            "title": "Approval Requested",
            "message": "John Smith requests your approval for Step 3",
            "source_contract_id": "contract-001",
            "action_url": "/contracts/contract-001/step/3",
            "action_label": "Review & Approve"
        }
    ]

    try:
        for mock in mock_notifications:
            create_notification(
                recipient_email=mock["recipient_email"],
                notification_type=mock["type"],
                title=mock["title"],
                message=mock["message"],
                source_contract_id=mock["source_contract_id"],
                source_task_id=mock.get("source_task_id"),
                source_comment_id=mock.get("source_comment_id"),
                source_user_email=mock.get("source_user_email"),
                action_url=mock["action_url"],
                action_label=mock["action_label"]
            )
    except (ValueError, PermissionError):
        # Ignore errors if already initialized
        pass


# Initialize mock data on module load
initialize_mock_data()
