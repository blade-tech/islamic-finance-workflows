"""
TASKS API
=========
REST API endpoints for task assignment and management.

Endpoints:
- POST /api/contracts/{id}/tasks - Create task
- GET /api/contracts/{id}/tasks - List contract tasks
- GET /api/users/{email}/tasks - List user tasks
- GET /api/tasks/{id} - Get single task
- PUT /api/tasks/{id}/status - Update task status
- DELETE /api/tasks/{id} - Delete task
- GET /api/tasks/overdue - Get overdue tasks
"""

from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional, List
import logging

from app.models import (
    CreateTaskRequest,
    CreateTaskResponse,
    ListTasksResponse,
    UpdateTaskStatusRequest,
    UpdateTaskStatusResponse,
    Task
)
from app.services import task_service


logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================================================
# TASK CRUD
# ============================================================================

@router.post(
    "/contracts/{contract_id}/tasks",
    response_model=CreateTaskResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["tasks"]
)
async def create_task(
    contract_id: str,
    request: CreateTaskRequest,
    assigner_email: str = "current_user@example.com",  # TODO: Get from auth
    assigner_name: str = "Current User"
) -> CreateTaskResponse:
    """
    Create a new task assignment.

    **Parameters:**
    - assignee_email: Email of user to assign task to
    - assignee_name: Name of assignee
    - assignee_role: Role of assignee
    - title: Task title
    - description: Task description
    - priority: low | medium | high | critical (default: medium)
    - due_date: Optional due date (ISO-8601 format)
    - step_number: Optional step number (omit for contract-level task)

    **Features:**
    - Automatic notification to assignee
    - Priority-based sorting
    - Due date tracking
    """
    task = task_service.create_task(
        contract_id=contract_id,
        assignee_email=request.assignee_email,
        assignee_name=request.assignee_name,
        assignee_role=request.assignee_role,
        assigner_email=assigner_email,
        assigner_name=assigner_name,
        title=request.title,
        description=request.description,
        priority=request.priority,
        due_date=request.due_date,
        step_number=request.step_number
    )

    logger.info(
        f"Created task {task.task_id} on contract {contract_id} "
        f"assigned to {request.assignee_email}"
    )

    # TODO: Send notification to assignee
    # from app.services.notification_service import notify_task_assigned
    # notify_task_assigned(...)

    return CreateTaskResponse(task=task)


@router.get(
    "/contracts/{contract_id}/tasks",
    response_model=ListTasksResponse,
    tags=["tasks"]
)
async def list_contract_tasks(
    contract_id: str,
    status: Optional[str] = Query(None, description="Filter by status: pending | in_progress | completed | cancelled"),
    priority: Optional[str] = Query(None, description="Filter by priority: low | medium | high | critical"),
    overdue_only: bool = Query(False, description="Only show overdue tasks")
) -> ListTasksResponse:
    """
    List all tasks for a contract with optional filtering.

    **Filters:**
    - status: Task status
    - priority: Task priority
    - overdue_only: Show only overdue tasks

    **Returns:** Tasks sorted by priority then due_date
    """
    tasks = task_service.list_tasks(
        contract_id=contract_id,
        status=status,
        priority=priority,
        overdue_only=overdue_only
    )

    return ListTasksResponse(
        tasks=tasks,
        total=len(tasks)
    )


@router.get(
    "/users/{user_email}/tasks",
    response_model=ListTasksResponse,
    tags=["tasks"]
)
async def list_user_tasks(
    user_email: str,
    status: Optional[str] = Query(None, description="Filter by status"),
    overdue_only: bool = Query(False, description="Only show overdue tasks")
) -> ListTasksResponse:
    """
    Get all tasks assigned to a user.

    **Filters:**
    - status: Task status
    - overdue_only: Show only overdue tasks

    **Returns:** Tasks sorted by priority then due_date
    """
    tasks = task_service.get_user_tasks(
        user_email=user_email,
        status=status,
        overdue_only=overdue_only
    )

    return ListTasksResponse(
        tasks=tasks,
        total=len(tasks)
    )


@router.get(
    "/tasks/{task_id}",
    response_model=Task,
    tags=["tasks"]
)
async def get_task(task_id: str) -> Task:
    """
    Get a single task by ID.
    """
    task = task_service.get_task(task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )

    return task


@router.put(
    "/tasks/{task_id}/status",
    response_model=UpdateTaskStatusResponse,
    tags=["tasks"]
)
async def update_task_status(
    task_id: str,
    request: UpdateTaskStatusRequest,
    user_email: str = "current_user@example.com"  # TODO: Get from auth
) -> UpdateTaskStatusResponse:
    """
    Update a task's status.

    **Status Options:**
    - pending: Not started
    - in_progress: Currently working on
    - completed: Finished successfully
    - cancelled: Cancelled (provide cancellation_reason)

    **Rules:**
    - Only assignee can update task status
    - Completed tasks set completed_at timestamp
    - Cancelled tasks require cancellation_reason

    **Permissions:** Task assignee only
    """
    try:
        task = task_service.update_task_status(
            task_id=task_id,
            user_email=user_email,
            new_status=request.status,
            cancellation_reason=request.cancellation_reason
        )

        logger.info(f"Updated task {task_id} status to {request.status} by {user_email}")

        # TODO: Send notification on task completion
        # if request.status == 'completed':
        #     from app.services.notification_service import notify_task_completed
        #     notify_task_completed(...)

        return UpdateTaskStatusResponse(task=task)

    except ValueError as e:
        logger.error(f"Invalid task update: {e}")
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


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["tasks"]
)
async def delete_task(
    task_id: str,
    user_email: str = "current_user@example.com",  # TODO: Get from auth
    is_owner: bool = False  # TODO: Get from auth/permissions
) -> None:
    """
    Delete a task.

    **Rules:**
    - Task assigner can delete the task
    - Contract owner can delete any task
    - Assignee cannot delete (should cancel instead)

    **Permissions:** Task assigner or contract owner
    """
    try:
        deleted = task_service.delete_task(
            task_id=task_id,
            user_email=user_email,
            is_owner=is_owner
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task {task_id} not found"
            )

        logger.info(f"Deleted task {task_id} by {user_email}")

    except PermissionError as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


# ============================================================================
# TASK QUERIES
# ============================================================================

@router.get(
    "/tasks/overdue",
    response_model=ListTasksResponse,
    tags=["tasks"]
)
async def get_overdue_tasks(
    user_email: Optional[str] = Query(None, description="Filter by user (omit for all overdue tasks)")
) -> ListTasksResponse:
    """
    Get all overdue tasks.

    **Optional Filter:**
    - user_email: Get overdue tasks for specific user

    **Returns:** Overdue tasks (status != completed/cancelled and due_date < now)
    """
    tasks = task_service.get_overdue_tasks(user_email=user_email)

    return ListTasksResponse(
        tasks=tasks,
        total=len(tasks)
    )


@router.get(
    "/contracts/{contract_id}/steps/{step_number}/tasks",
    response_model=ListTasksResponse,
    tags=["tasks"]
)
async def list_step_tasks(
    contract_id: str,
    step_number: int
) -> ListTasksResponse:
    """
    Get all tasks for a specific workflow step.

    **Convenience endpoint:** Filtered version of GET /contracts/{id}/tasks
    """
    tasks = task_service.get_step_tasks(contract_id, step_number)

    return ListTasksResponse(
        tasks=tasks,
        total=len(tasks)
    )


# ============================================================================
# TASK STATISTICS
# ============================================================================

@router.get(
    "/users/{user_email}/tasks/stats",
    tags=["tasks"]
)
async def get_user_task_stats(user_email: str):
    """
    Get task statistics for a user.

    **Returns:**
    - total: Total task count
    - pending: Pending tasks
    - in_progress: In-progress tasks
    - completed: Completed tasks
    - cancelled: Cancelled tasks
    - overdue: Overdue tasks
    - due_today: Tasks due today
    - due_this_week: Tasks due within 7 days
    """
    stats = task_service.get_user_task_stats(user_email)
    return stats


@router.get(
    "/contracts/{contract_id}/tasks/stats",
    tags=["tasks"]
)
async def get_contract_task_stats(contract_id: str):
    """
    Get task statistics for a contract.

    **Returns:**
    - total: Total task count
    - completed: Completed tasks
    - pending: Pending/in-progress tasks
    - completion_rate: Percentage complete
    """
    stats = task_service.get_contract_task_stats(contract_id)
    return stats
