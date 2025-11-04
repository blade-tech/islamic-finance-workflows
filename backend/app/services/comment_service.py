"""
COMMENT SERVICE
===============
Manages comment threads on contracts and workflow steps.

Features:
- Contract-level comments
- Step-level comments
- @mention support
- Edit/delete comments
- Search and filter
- Threaded discussions

Follows Vanta's comment system patterns.
"""

from datetime import datetime
from typing import List, Optional, Dict
from uuid import uuid4
import re

from app.models import Comment


# ============================================================================
# IN-MEMORY STORAGE (mock database)
# ============================================================================

# comment_id -> Comment
_comments: Dict[str, Comment] = {}

# contract_id -> List[comment_id]
_contract_comments: Dict[str, List[str]] = {}


# ============================================================================
# COMMENT CRUD OPERATIONS
# ============================================================================

def create_comment(
    contract_id: str,
    author_email: str,
    author_name: str,
    author_role: str,
    content: str,
    step_number: Optional[int] = None,
    mentions: Optional[List[str]] = None
) -> Comment:
    """
    Create a new comment on a contract or step.

    Args:
        contract_id: Contract ID
        author_email: Email of comment author
        author_name: Name of comment author
        author_role: Role of comment author
        content: Comment content (markdown supported)
        step_number: Optional step number (None = contract-level)
        mentions: Optional list of @mentioned emails

    Returns:
        Comment object
    """
    # Extract @mentions from content if not provided
    if mentions is None:
        mentions = extract_mentions(content)

    # Create comment
    comment = Comment(
        comment_id=f"comment-{uuid4().hex[:8]}",
        contract_id=contract_id,
        step_number=step_number,
        author_email=author_email,
        author_name=author_name,
        author_role=author_role,
        content=content,
        mentions=mentions,
        created_at=datetime.utcnow(),
        updated_at=None,
        edited=False
    )

    # Store comment
    _comments[comment.comment_id] = comment

    # Add to contract's comment list
    if contract_id not in _contract_comments:
        _contract_comments[contract_id] = []
    _contract_comments[contract_id].append(comment.comment_id)

    return comment


def get_comment(comment_id: str) -> Optional[Comment]:
    """
    Get a comment by ID.

    Args:
        comment_id: Comment ID

    Returns:
        Comment object or None if not found
    """
    return _comments.get(comment_id)


def update_comment(
    comment_id: str,
    author_email: str,
    new_content: str
) -> Comment:
    """
    Update a comment's content.

    Args:
        comment_id: Comment ID
        author_email: Email of user updating the comment
        new_content: New comment content

    Returns:
        Updated Comment object

    Rules:
        - Only comment author can edit their own comments
        - Mentions are re-extracted from new content
    """
    comment = get_comment(comment_id)

    if not comment:
        raise ValueError(f"Comment {comment_id} not found")

    # Check authorship
    if comment.author_email != author_email:
        raise PermissionError("Only comment author can edit their comment")

    # Update content
    comment.content = new_content
    comment.mentions = extract_mentions(new_content)
    comment.updated_at = datetime.utcnow()
    comment.edited = True

    return comment


def delete_comment(
    comment_id: str,
    user_email: str,
    is_owner: bool = False
) -> bool:
    """
    Delete a comment.

    Args:
        comment_id: Comment ID
        user_email: Email of user deleting the comment
        is_owner: Whether user is contract owner

    Returns:
        True if comment was deleted

    Rules:
        - Comment author can delete their own comment
        - Contract owner can delete any comment
    """
    comment = get_comment(comment_id)

    if not comment:
        return False

    # Check permissions
    if comment.author_email != user_email and not is_owner:
        raise PermissionError(
            "Only comment author or contract owner can delete a comment"
        )

    # Remove from storage
    del _comments[comment_id]

    # Remove from contract's comment list
    if comment.contract_id in _contract_comments:
        _contract_comments[comment.contract_id] = [
            cid for cid in _contract_comments[comment.contract_id]
            if cid != comment_id
        ]

    return True


# ============================================================================
# COMMENT QUERIES
# ============================================================================

def list_comments(
    contract_id: str,
    step_number: Optional[int] = None,
    author_email: Optional[str] = None,
    mentioned_email: Optional[str] = None
) -> List[Comment]:
    """
    List comments for a contract or step with optional filtering.

    Args:
        contract_id: Contract ID
        step_number: Optional step number filter (None = all comments)
        author_email: Optional filter by author
        mentioned_email: Optional filter by mentioned user

    Returns:
        List of Comment objects, sorted by created_at descending (newest first)
    """
    if contract_id not in _contract_comments:
        return []

    # Get all comments for contract
    comment_ids = _contract_comments[contract_id]
    comments = [_comments[cid] for cid in comment_ids if cid in _comments]

    # Apply filters
    if step_number is not None:
        comments = [c for c in comments if c.step_number == step_number]

    if author_email:
        comments = [c for c in comments if c.author_email == author_email]

    if mentioned_email:
        comments = [c for c in comments if mentioned_email in c.mentions]

    # Sort by created_at descending (newest first)
    comments.sort(key=lambda c: c.created_at, reverse=True)

    return comments


def get_contract_level_comments(contract_id: str) -> List[Comment]:
    """
    Get all contract-level comments (not attached to a step).

    Args:
        contract_id: Contract ID

    Returns:
        List of Comment objects
    """
    return list_comments(contract_id, step_number=None)


def get_step_comments(contract_id: str, step_number: int) -> List[Comment]:
    """
    Get all comments for a specific step.

    Args:
        contract_id: Contract ID
        step_number: Step number

    Returns:
        List of Comment objects
    """
    return list_comments(contract_id, step_number=step_number)


def get_user_mentions(user_email: str) -> List[Comment]:
    """
    Get all comments where user was @mentioned.

    Args:
        user_email: User email

    Returns:
        List of Comment objects, sorted by created_at descending
    """
    mentioned_comments = [
        comment for comment in _comments.values()
        if user_email in comment.mentions
    ]

    mentioned_comments.sort(key=lambda c: c.created_at, reverse=True)
    return mentioned_comments


def search_comments(
    contract_id: str,
    search_query: str
) -> List[Comment]:
    """
    Search comments by content.

    Args:
        contract_id: Contract ID
        search_query: Search string (case-insensitive)

    Returns:
        List of Comment objects matching search
    """
    comments = list_comments(contract_id)

    search_lower = search_query.lower()
    matching_comments = [
        c for c in comments
        if search_lower in c.content.lower()
        or search_lower in c.author_name.lower()
    ]

    return matching_comments


# ============================================================================
# COMMENT STATISTICS
# ============================================================================

def get_comment_count(contract_id: str, step_number: Optional[int] = None) -> int:
    """
    Get count of comments for a contract or step.

    Args:
        contract_id: Contract ID
        step_number: Optional step number

    Returns:
        Comment count
    """
    comments = list_comments(contract_id, step_number=step_number)
    return len(comments)


def get_user_comment_count(contract_id: str, user_email: str) -> int:
    """
    Get count of comments by a user on a contract.

    Args:
        contract_id: Contract ID
        user_email: User email

    Returns:
        Comment count
    """
    comments = list_comments(contract_id, author_email=user_email)
    return len(comments)


def get_comment_activity(contract_id: str) -> Dict[str, any]:
    """
    Get comment activity statistics for a contract.

    Args:
        contract_id: Contract ID

    Returns:
        Dictionary with activity stats
    """
    comments = list_comments(contract_id)

    if not comments:
        return {
            "total_comments": 0,
            "unique_commenters": 0,
            "contract_level_comments": 0,
            "step_comments": 0,
            "last_comment_at": None
        }

    # Calculate stats
    unique_commenters = set(c.author_email for c in comments)
    contract_level = [c for c in comments if c.step_number is None]
    step_comments = [c for c in comments if c.step_number is not None]
    last_comment = max(comments, key=lambda c: c.created_at)

    return {
        "total_comments": len(comments),
        "unique_commenters": len(unique_commenters),
        "contract_level_comments": len(contract_level),
        "step_comments": len(step_comments),
        "last_comment_at": last_comment.created_at
    }


# ============================================================================
# MENTION UTILITIES
# ============================================================================

def extract_mentions(content: str) -> List[str]:
    """
    Extract @mentioned email addresses from comment content.

    Args:
        content: Comment content

    Returns:
        List of email addresses

    Examples:
        "@shariah@example.com please review" -> ["shariah@example.com"]
        "cc @user1@test.com @user2@test.com" -> ["user1@test.com", "user2@test.com"]
    """
    # Match @email pattern
    # Pattern: @[email address]
    pattern = r'@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})'
    matches = re.findall(pattern, content)

    # Return unique emails
    return list(set(matches))


def get_mentionable_users(contract_id: str) -> List[Dict[str, str]]:
    """
    Get list of users that can be @mentioned in a contract.
    (All stakeholders: owner + subscribers)

    Args:
        contract_id: Contract ID

    Returns:
        List of dictionaries with email and name

    Note:
        This requires integration with collaboration_service.
        For now, returns empty list (mock).
    """
    # TODO: Integrate with collaboration_service to get stakeholders
    # from app.services.collaboration_service import get_all_stakeholders
    # stakeholders = get_all_stakeholders(contract_id)
    # ...

    return []


# ============================================================================
# MOCK DATA INITIALIZATION (for testing)
# ============================================================================

def initialize_mock_data():
    """Initialize mock comment data for testing."""
    # Create mock comments
    mock_comments = [
        {
            "contract_id": "contract-001",
            "author_email": "shariah@example.com",
            "author_name": "Dr. Ahmad Al-Sharif",
            "author_role": "shariah_advisor",
            "content": "The profit-sharing ratio needs to be clarified. @business@example.com please provide details.",
            "step_number": 2
        },
        {
            "contract_id": "contract-001",
            "author_email": "business@example.com",
            "author_name": "John Smith",
            "author_role": "business_team",
            "content": "Confirmed: 60/40 split in favor of investor. @shariah@example.com does this comply?",
            "step_number": 2
        },
        {
            "contract_id": "contract-001",
            "author_email": "legal@example.com",
            "author_name": "Sarah Johnson",
            "author_role": "legal_counsel",
            "content": "Contract structure looks good from legal perspective. Ready for execution.",
            "step_number": None  # Contract-level comment
        }
    ]

    try:
        for mock in mock_comments:
            create_comment(
                contract_id=mock["contract_id"],
                author_email=mock["author_email"],
                author_name=mock["author_name"],
                author_role=mock["author_role"],
                content=mock["content"],
                step_number=mock.get("step_number")
            )
    except (ValueError, PermissionError):
        # Ignore errors if already initialized
        pass


# Initialize mock data on module load
initialize_mock_data()
