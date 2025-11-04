"""
COMMENTS API
============
REST API endpoints for comment threads on contracts and workflow steps.

Endpoints:
- POST /api/contracts/{id}/comments - Add comment
- GET /api/contracts/{id}/comments - List comments
- GET /api/contracts/{id}/steps/{step}/comments - List step comments
- GET /api/comments/{id} - Get single comment
- PUT /api/comments/{id} - Update comment
- DELETE /api/comments/{id} - Delete comment
- GET /api/users/{email}/mentions - Get user mentions
- GET /api/contracts/{id}/comments/search - Search comments
"""

from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional
import logging

from app.models import (
    AddCommentRequest,
    AddCommentResponse,
    ListCommentsResponse,
    UpdateCommentRequest,
    UpdateCommentResponse,
    Comment
)
from app.services import comment_service


logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================================================
# COMMENT CRUD
# ============================================================================

@router.post(
    "/contracts/{contract_id}/comments",
    response_model=AddCommentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["comments"]
)
async def add_comment(
    contract_id: str,
    request: AddCommentRequest,
    author_email: str = "current_user@example.com",  # TODO: Get from auth
    author_name: str = "Current User",
    author_role: str = "business_team"
) -> AddCommentResponse:
    """
    Add a comment to a contract or workflow step.

    **Parameters:**
    - content: Comment content (markdown supported)
    - step_number: Optional step number (omit for contract-level comment)
    - mentions: Optional list of @mentioned emails (auto-extracted if omitted)

    **Features:**
    - Automatic @mention extraction from content
    - Markdown support
    - Contract-level or step-level comments
    """
    comment = comment_service.create_comment(
        contract_id=contract_id,
        author_email=author_email,
        author_name=author_name,
        author_role=author_role,
        content=request.content,
        step_number=request.step_number,
        mentions=request.mentions
    )

    logger.info(
        f"Created comment {comment.comment_id} on contract {contract_id} "
        f"by {author_email}"
    )

    # TODO: Send notifications to @mentioned users
    # from app.services.notification_service import notify_comment_mention
    # for mentioned_email in comment.mentions:
    #     notify_comment_mention(...)

    return AddCommentResponse(comment=comment)


@router.get(
    "/contracts/{contract_id}/comments",
    response_model=ListCommentsResponse,
    tags=["comments"]
)
async def list_comments(
    contract_id: str,
    step_number: Optional[int] = Query(None, description="Filter by step number"),
    author_email: Optional[str] = Query(None, description="Filter by author"),
    mentioned_email: Optional[str] = Query(None, description="Filter by mentioned user")
) -> ListCommentsResponse:
    """
    List comments for a contract with optional filtering.

    **Filters:**
    - step_number: Get comments for specific step (omit for all comments)
    - author_email: Get comments by specific author
    - mentioned_email: Get comments where user was @mentioned

    **Returns:** Comments sorted by created_at descending (newest first)
    """
    comments = comment_service.list_comments(
        contract_id=contract_id,
        step_number=step_number,
        author_email=author_email,
        mentioned_email=mentioned_email
    )

    return ListCommentsResponse(
        comments=comments,
        total=len(comments)
    )


@router.get(
    "/contracts/{contract_id}/steps/{step_number}/comments",
    response_model=ListCommentsResponse,
    tags=["comments"]
)
async def list_step_comments(
    contract_id: str,
    step_number: int
) -> ListCommentsResponse:
    """
    Get all comments for a specific workflow step.

    **Convenience endpoint:** Same as GET /contracts/{id}/comments?step_number={step}
    """
    comments = comment_service.get_step_comments(contract_id, step_number)

    return ListCommentsResponse(
        comments=comments,
        total=len(comments)
    )


@router.get(
    "/comments/{comment_id}",
    response_model=Comment,
    tags=["comments"]
)
async def get_comment(comment_id: str) -> Comment:
    """
    Get a single comment by ID.
    """
    comment = comment_service.get_comment(comment_id)

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment {comment_id} not found"
        )

    return comment


@router.put(
    "/comments/{comment_id}",
    response_model=UpdateCommentResponse,
    tags=["comments"]
)
async def update_comment(
    comment_id: str,
    request: UpdateCommentRequest,
    user_email: str = "current_user@example.com"  # TODO: Get from auth
) -> UpdateCommentResponse:
    """
    Update a comment's content.

    **Rules:**
    - Only comment author can edit their own comments
    - @mentions are re-extracted from new content
    - edited flag is set to true

    **Permissions:** Comment author only
    """
    try:
        comment = comment_service.update_comment(
            comment_id=comment_id,
            author_email=user_email,
            new_content=request.content
        )

        logger.info(f"Updated comment {comment_id} by {user_email}")

        return UpdateCommentResponse(comment=comment)

    except ValueError as e:
        logger.error(f"Invalid comment update: {e}")
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
    "/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["comments"]
)
async def delete_comment(
    comment_id: str,
    user_email: str = "current_user@example.com",  # TODO: Get from auth
    is_owner: bool = False  # TODO: Get from auth/permissions
) -> None:
    """
    Delete a comment.

    **Rules:**
    - Comment author can delete their own comment
    - Contract owner can delete any comment

    **Permissions:** Comment author or contract owner
    """
    try:
        deleted = comment_service.delete_comment(
            comment_id=comment_id,
            user_email=user_email,
            is_owner=is_owner
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment {comment_id} not found"
            )

        logger.info(f"Deleted comment {comment_id} by {user_email}")

    except PermissionError as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


# ============================================================================
# COMMENT QUERIES
# ============================================================================

@router.get(
    "/contracts/{contract_id}/comments/search",
    response_model=ListCommentsResponse,
    tags=["comments"]
)
async def search_comments(
    contract_id: str,
    q: str = Query(..., description="Search query (searches content and author name)")
) -> ListCommentsResponse:
    """
    Search comments by content or author name.

    **Query:** Case-insensitive search in comment content and author names
    """
    comments = comment_service.search_comments(contract_id, q)

    return ListCommentsResponse(
        comments=comments,
        total=len(comments)
    )


@router.get(
    "/users/{user_email}/mentions",
    response_model=ListCommentsResponse,
    tags=["comments"]
)
async def get_user_mentions(user_email: str) -> ListCommentsResponse:
    """
    Get all comments where user was @mentioned.

    **Returns:** Comments sorted by created_at descending (newest first)
    """
    comments = comment_service.get_user_mentions(user_email)

    return ListCommentsResponse(
        comments=comments,
        total=len(comments)
    )


# ============================================================================
# COMMENT STATISTICS
# ============================================================================

@router.get(
    "/contracts/{contract_id}/comments/stats",
    tags=["comments"]
)
async def get_comment_stats(contract_id: str):
    """
    Get comment activity statistics for a contract.

    **Returns:**
    - total_comments: Total comment count
    - unique_commenters: Number of unique commenters
    - contract_level_comments: Comments not attached to a step
    - step_comments: Comments attached to workflow steps
    - last_comment_at: Timestamp of most recent comment
    """
    activity = comment_service.get_comment_activity(contract_id)
    return activity
