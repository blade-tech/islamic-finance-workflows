"""
TASK SERVICE
============
Manages task assignment and tracking for contract workflows.

Features:
- Task creation and assignment
- Task status management (pending, in_progress, completed, cancelled)
- Due date tracking
- Overdue task detection
- Task filtering and search
- User task lists

Follows Vanta's task management patterns.
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict
from uuid import uuid4

from app.models import Task, TaskStatus


# ============================================================================
# IN-MEMORY STORAGE (mock database)
# ============================================================================

# task_id -> Task
_tasks: Dict[str, Task] = {}

# contract_id -> List[task_id]
_contract_tasks: Dict[str, List[str]] = {}

# user_email -> List[task_id]
_user_tasks: Dict[str, List[str]] = {}


# ============================================================================
# TASK CRUD OPERATIONS
# ============================================================================

def create_task(
    contract_id: str,
    assignee_email: str,
    assignee_name: str,
    assignee_role: str,
    assigner_email: str,
    assigner_name: str,
    title: str,
    description: str,
    priority: str = 'medium',
    due_date: Optional[datetime] = None,
    step_number: Optional[int] = None
) -> Task:
    """
    Create a new task assignment.

    Args:
        contract_id: Contract ID
        assignee_email: Email of user assigned to task
        assignee_name: Name of assignee
        assignee_role: Role of assignee
        assigner_email: Email of user creating the task
        assigner_name: Name of assigner
        title: Task title
        description: Task description
        priority: Task priority (low, medium, high, critical)
        due_date: Optional due date
        step_number: Optional step number (None = contract-level)

    Returns:
        Task object
    """
    now = datetime.utcnow()

    # Create task
    task = Task(
        task_id=f"task-{uuid4().hex[:8]}",
        contract_id=contract_id,
        step_number=step_number,
        assignee_email=assignee_email,
        assignee_name=assignee_name,
        assignee_role=assignee_role,
        assigner_email=assigner_email,
        assigner_name=assigner_name,
        title=title,
        description=description,
        priority=priority,
        due_date=due_date,
        status=TaskStatus(status='pending'),
        created_at=now,
        updated_at=now
    )

    # Store task
    _tasks[task.task_id] = task

    # Add to contract's task list
    if contract_id not in _contract_tasks:
        _contract_tasks[contract_id] = []
    _contract_tasks[contract_id].append(task.task_id)

    # Add to user's task list
    if assignee_email not in _user_tasks:
        _user_tasks[assignee_email] = []
    _user_tasks[assignee_email].append(task.task_id)

    return task


def get_task(task_id: str) -> Optional[Task]:
    """
    Get a task by ID.

    Args:
        task_id: Task ID

    Returns:
        Task object or None if not found
    """
    return _tasks.get(task_id)


def update_task_status(
    task_id: str,
    user_email: str,
    new_status: str,
    cancellation_reason: Optional[str] = None
) -> Task:
    """
    Update a task's status.

    Args:
        task_id: Task ID
        user_email: Email of user updating the task
        new_status: New status (pending, in_progress, completed, cancelled)
        cancellation_reason: Reason for cancellation (if status = cancelled)

    Returns:
        Updated Task object

    Rules:
        - Only assignee can update task status
        - Completed tasks set completed_at timestamp
        - Cancelled tasks set cancelled_at timestamp and reason
    """
    task = get_task(task_id)

    if not task:
        raise ValueError(f"Task {task_id} not found")

    # Check permissions
    if task.assignee_email != user_email:
        raise PermissionError("Only task assignee can update task status")

    now = datetime.utcnow()

    # Update status
    task.status.status = new_status
    task.updated_at = now

    # Handle completed status
    if new_status == 'completed':
        task.status.completed_at = now

    # Handle cancelled status
    if new_status == 'cancelled':
        task.status.cancelled_at = now
        task.status.cancellation_reason = cancellation_reason or "No reason provided"

    return task


def delete_task(
    task_id: str,
    user_email: str,
    is_owner: bool = False
) -> bool:
    """
    Delete a task.

    Args:
        task_id: Task ID
        user_email: Email of user deleting the task
        is_owner: Whether user is contract owner

    Returns:
        True if task was deleted

    Rules:
        - Task assigner can delete the task
        - Contract owner can delete any task
        - Assignee cannot delete (can only cancel)
    """
    task = get_task(task_id)

    if not task:
        return False

    # Check permissions
    if task.assigner_email != user_email and not is_owner:
        raise PermissionError(
            "Only task assigner or contract owner can delete a task"
        )

    # Remove from storage
    del _tasks[task_id]

    # Remove from contract's task list
    if task.contract_id in _contract_tasks:
        _contract_tasks[task.contract_id] = [
            tid for tid in _contract_tasks[task.contract_id]
            if tid != task_id
        ]

    # Remove from user's task list
    if task.assignee_email in _user_tasks:
        _user_tasks[task.assignee_email] = [
            tid for tid in _user_tasks[task.assignee_email]
            if tid != task_id
        ]

    return True


# ============================================================================
# TASK QUERIES
# ============================================================================

def list_tasks(
    contract_id: Optional[str] = None,
    assignee_email: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    overdue_only: bool = False
) -> List[Task]:
    """
    List tasks with optional filtering.

    Args:
        contract_id: Optional filter by contract
        assignee_email: Optional filter by assignee
        status: Optional filter by status
        priority: Optional filter by priority
        overdue_only: Only show overdue tasks

    Returns:
        List of Task objects, sorted by priority then due_date
    """
    # Determine which tasks to consider
    if contract_id:
        task_ids = _contract_tasks.get(contract_id, [])
        tasks = [_tasks[tid] for tid in task_ids if tid in _tasks]
    elif assignee_email:
        task_ids = _user_tasks.get(assignee_email, [])
        tasks = [_tasks[tid] for tid in task_ids if tid in _tasks]
    else:
        tasks = list(_tasks.values())

    # Apply filters
    if status:
        tasks = [t for t in tasks if t.status.status == status]

    if priority:
        tasks = [t for t in tasks if t.priority == priority]

    if overdue_only:
        now = datetime.utcnow()
        tasks = [
            t for t in tasks
            if t.due_date and t.due_date < now and t.status.status != 'completed'
        ]

    # Sort by priority (critical -> high -> medium -> low) then due_date
    priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}

    def sort_key(task: Task):
        # Priority first
        priority_rank = priority_order.get(task.priority, 4)
        # Then due date (None = far future)
        due_date_rank = task.due_date if task.due_date else datetime.max
        return (priority_rank, due_date_rank)

    tasks.sort(key=sort_key)

    return tasks


def get_user_tasks(
    user_email: str,
    status: Optional[str] = None,
    overdue_only: bool = False
) -> List[Task]:
    """
    Get all tasks assigned to a user.

    Args:
        user_email: User email
        status: Optional status filter
        overdue_only: Only show overdue tasks

    Returns:
        List of Task objects
    """
    return list_tasks(
        assignee_email=user_email,
        status=status,
        overdue_only=overdue_only
    )


def get_contract_tasks(
    contract_id: str,
    status: Optional[str] = None
) -> List[Task]:
    """
    Get all tasks for a contract.

    Args:
        contract_id: Contract ID
        status: Optional status filter

    Returns:
        List of Task objects
    """
    return list_tasks(contract_id=contract_id, status=status)


def get_step_tasks(contract_id: str, step_number: int) -> List[Task]:
    """
    Get all tasks for a specific step.

    Args:
        contract_id: Contract ID
        step_number: Step number

    Returns:
        List of Task objects
    """
    tasks = get_contract_tasks(contract_id)
    return [t for t in tasks if t.step_number == step_number]


# ============================================================================
# TASK STATISTICS
# ============================================================================

def get_user_task_stats(user_email: str) -> Dict[str, any]:
    """
    Get task statistics for a user.

    Args:
        user_email: User email

    Returns:
        Dictionary with task stats
    """
    tasks = get_user_tasks(user_email)
    now = datetime.utcnow()

    stats = {
        "total": len(tasks),
        "pending": 0,
        "in_progress": 0,
        "completed": 0,
        "cancelled": 0,
        "overdue": 0,
        "due_today": 0,
        "due_this_week": 0
    }

    for task in tasks:
        # Count by status
        stats[task.status.status] += 1

        # Count overdue
        if task.due_date and task.due_date < now and task.status.status != 'completed':
            stats["overdue"] += 1

        # Count due today
        if task.due_date and task.due_date.date() == now.date():
            stats["due_today"] += 1

        # Count due this week
        if task.due_date:
            days_until_due = (task.due_date - now).days
            if 0 <= days_until_due <= 7:
                stats["due_this_week"] += 1

    return stats


def get_contract_task_stats(contract_id: str) -> Dict[str, any]:
    """
    Get task statistics for a contract.

    Args:
        contract_id: Contract ID

    Returns:
        Dictionary with task stats
    """
    tasks = get_contract_tasks(contract_id)

    if not tasks:
        return {
            "total": 0,
            "completed": 0,
            "pending": 0,
            "completion_rate": 0.0
        }

    completed = len([t for t in tasks if t.status.status == 'completed'])
    pending = len([t for t in tasks if t.status.status in ['pending', 'in_progress']])

    return {
        "total": len(tasks),
        "completed": completed,
        "pending": pending,
        "completion_rate": (completed / len(tasks)) * 100 if tasks else 0.0
    }


# ============================================================================
# OVERDUE TASK DETECTION
# ============================================================================

def get_overdue_tasks(user_email: Optional[str] = None) -> List[Task]:
    """
    Get all overdue tasks.

    Args:
        user_email: Optional filter by user

    Returns:
        List of overdue Task objects
    """
    if user_email:
        tasks = get_user_tasks(user_email)
    else:
        tasks = list(_tasks.values())

    now = datetime.utcnow()

    overdue = [
        t for t in tasks
        if t.due_date
        and t.due_date < now
        and t.status.status not in ['completed', 'cancelled']
    ]

    return overdue


def is_task_overdue(task_id: str) -> bool:
    """
    Check if a task is overdue.

    Args:
        task_id: Task ID

    Returns:
        True if task is overdue
    """
    task = get_task(task_id)

    if not task:
        return False

    if task.status.status in ['completed', 'cancelled']:
        return False

    if not task.due_date:
        return False

    return task.due_date < datetime.utcnow()


def get_tasks_due_soon(
    user_email: Optional[str] = None,
    hours: int = 24
) -> List[Task]:
    """
    Get tasks due within specified hours.

    Args:
        user_email: Optional filter by user
        hours: Hours threshold (default: 24)

    Returns:
        List of Task objects due soon
    """
    if user_email:
        tasks = get_user_tasks(user_email)
    else:
        tasks = list(_tasks.values())

    now = datetime.utcnow()
    threshold = now + timedelta(hours=hours)

    due_soon = [
        t for t in tasks
        if t.due_date
        and now <= t.due_date <= threshold
        and t.status.status not in ['completed', 'cancelled']
    ]

    return due_soon


# ============================================================================
# MOCK DATA INITIALIZATION (for testing)
# ============================================================================

def initialize_mock_data():
    """Initialize mock task data for testing."""
    # Create mock tasks
    now = datetime.utcnow()

    mock_tasks = [
        {
            "contract_id": "contract-001",
            "assignee_email": "shariah@example.com",
            "assignee_name": "Dr. Ahmad Al-Sharif",
            "assignee_role": "shariah_advisor",
            "assigner_email": "business@example.com",
            "assigner_name": "John Smith",
            "title": "Review profit-sharing structure",
            "description": "Ensure compliance with AAOIFI FAS 33",
            "priority": "high",
            "due_date": now + timedelta(days=2),
            "step_number": 2
        },
        {
            "contract_id": "contract-001",
            "assignee_email": "legal@example.com",
            "assignee_name": "Sarah Johnson",
            "assignee_role": "legal_counsel",
            "assigner_email": "business@example.com",
            "assigner_name": "John Smith",
            "title": "Draft partnership agreement",
            "description": "Include Shariah-compliant clauses",
            "priority": "medium",
            "due_date": now + timedelta(days=5),
            "step_number": 3
        },
        {
            "contract_id": "contract-002",
            "assignee_email": "compliance@example.com",
            "assignee_name": "Mohammed Ali",
            "assignee_role": "compliance_manager",
            "assigner_email": "finance@example.com",
            "assigner_name": "Jane Doe",
            "title": "Complete KYC verification",
            "description": "Verify all parties meet requirements",
            "priority": "critical",
            "due_date": now - timedelta(days=1),  # Overdue
            "step_number": 1
        }
    ]

    try:
        for mock in mock_tasks:
            create_task(
                contract_id=mock["contract_id"],
                assignee_email=mock["assignee_email"],
                assignee_name=mock["assignee_name"],
                assignee_role=mock["assignee_role"],
                assigner_email=mock["assigner_email"],
                assigner_name=mock["assigner_name"],
                title=mock["title"],
                description=mock["description"],
                priority=mock["priority"],
                due_date=mock["due_date"],
                step_number=mock.get("step_number")
            )
    except (ValueError, PermissionError):
        # Ignore errors if already initialized
        pass


# Initialize mock data on module load
initialize_mock_data()
