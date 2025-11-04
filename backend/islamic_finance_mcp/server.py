"""
Islamic Finance MCP Server

This MCP server exposes the Islamic Finance platform's data and operations
to AI assistants and other MCP clients. It follows the Model Context Protocol
specification to provide tools, resources, and prompts for contract lifecycle
management, Shariah compliance workflows, and multi-stakeholder collaboration.

Inspired by Vanta's MCP implementation patterns.

Author: Blade Labs
Version: 1.0.0
"""

import os
import sys
import asyncio
import logging
from typing import Any, Dict, List, Optional, Literal
from datetime import datetime
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import (
        Tool,
        TextContent,
        ImageContent,
        EmbeddedResource,
        Resource,
        ResourceTemplate,
        PromptMessage,
        GetPromptResult,
    )
except ImportError:
    print("ERROR: mcp library not installed. Install with: pip install mcp", file=sys.stderr)
    sys.exit(1)

# Import backend services
try:
    from app.services.collaboration_service import CollaborationService
    from app.services.workflow_engine import WorkflowEngine
    from app.services.document_service import DocumentService
    from app.services.session_service import SessionService
    from app.models import StakeholderRole
except ImportError as e:
    print(f"ERROR: Could not import backend services: {e}", file=sys.stderr)
    print("Make sure you're running from the backend directory", file=sys.stderr)
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("islamic-finance-mcp")

# Initialize MCP server
server = Server("islamic-finance")

# Initialize backend services
collaboration_service = CollaborationService()
workflow_engine = WorkflowEngine()
document_service = DocumentService()
session_service = SessionService()


# ============================================================================
# TOOLS: Functions that AI models can call
# ============================================================================

@server.list_tools()
async def list_tools() -> List[Tool]:
    """
    List all available tools in the Islamic Finance MCP server.

    Organized by domain:
    - Contracts: Create, read, update contract data
    - Workflows: Execute and monitor workflow steps
    - Approvals: Submit and track approval decisions
    - Documents: Upload, retrieve, and verify documents
    - Stakeholders: Manage team assignments and ownership
    - Dashboards: Retrieve role-based metrics
    """
    return [
        # ========== CONTRACT TOOLS ==========
        Tool(
            name="list_contracts",
            description=(
                "List all contracts in the system with optional filtering. "
                "Returns contract IDs, types (Murabaha, Ijara, etc.), status, "
                "stakeholders, and progress metrics. Supports pagination and filtering "
                "by status, contract type, owner, or impact methodology."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["draft", "in_progress", "pending_approval", "approved", "rejected", "executed"],
                        "description": "Filter by contract status"
                    },
                    "contract_type": {
                        "type": "string",
                        "enum": ["mudaraba", "murabaha", "musharaka", "ijara", "sukuk", "istisna"],
                        "description": "Filter by Islamic contract type"
                    },
                    "owner_email": {
                        "type": "string",
                        "description": "Filter by owner email address"
                    },
                    "impact_methodology": {
                        "type": "string",
                        "enum": ["esg", "vbi_malaysia", "sdg", "vera", "gift_ib"],
                        "description": "Filter by impact methodology"
                    },
                    "page_cursor": {
                        "type": "string",
                        "description": "Pagination cursor from previous response"
                    },
                    "page_size": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 100,
                        "default": 20,
                        "description": "Number of results per page (1-100)"
                    }
                }
            }
        ),

        Tool(
            name="get_contract",
            description=(
                "Get detailed information about a specific contract. "
                "Returns full contract data including workflow phases, current step, "
                "stakeholder assignments, approval status, documents, and audit trail."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Unique contract identifier"
                    }
                },
                "required": ["contract_id"]
            }
        ),

        Tool(
            name="create_contract",
            description=(
                "Create a new Islamic finance contract. Initializes workflow based on "
                "contract type with appropriate Shariah compliance steps. "
                "Returns contract ID and initial workflow configuration."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_type": {
                        "type": "string",
                        "enum": ["mudaraba", "murabaha", "musharaka", "ijara", "sukuk", "istisna"],
                        "description": "Type of Islamic contract"
                    },
                    "impact_methodologies": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["esg", "vbi_malaysia", "sdg", "vera", "gift_ib"]
                        },
                        "description": "Impact assessment methodologies to apply (can select multiple)"
                    },
                    "parties": {
                        "type": "object",
                        "description": "Contract parties information",
                        "properties": {
                            "investor_email": {"type": "string"},
                            "entrepreneur_email": {"type": "string"},
                            "business_team_owner": {"type": "string"}
                        },
                        "required": ["business_team_owner"]
                    },
                    "metadata": {
                        "type": "object",
                        "description": "Additional contract metadata (capital amount, duration, etc.)"
                    }
                },
                "required": ["contract_type", "parties"]
            }
        ),

        # ========== WORKFLOW TOOLS ==========
        Tool(
            name="get_workflow_status",
            description=(
                "Get current workflow execution status for a contract. "
                "Returns current phase, step, owner assignments, pending approvals, "
                "and recent activity log. Use this to monitor workflow progress."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Contract ID to get workflow status for"
                    }
                },
                "required": ["contract_id"]
            }
        ),

        Tool(
            name="advance_workflow_step",
            description=(
                "Advance workflow to the next step after completing current step. "
                "Validates step completion, updates ownership, and triggers notifications. "
                "Only the current step owner can advance the workflow."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Contract ID"
                    },
                    "step_id": {
                        "type": "string",
                        "description": "Current step ID to complete"
                    },
                    "completion_notes": {
                        "type": "string",
                        "description": "Notes about step completion"
                    },
                    "executor_email": {
                        "type": "string",
                        "description": "Email of person completing the step"
                    }
                },
                "required": ["contract_id", "step_id", "executor_email"]
            }
        ),

        # ========== APPROVAL TOOLS ==========
        Tool(
            name="submit_approval",
            description=(
                "Submit an approval decision for a contract workflow step. "
                "Shariah advisors and other approvers use this to approve, reject, "
                "or request changes. Automatically advances workflow if all approvals received."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Contract ID"
                    },
                    "step_number": {
                        "type": "integer",
                        "description": "Approval step number (1-based)"
                    },
                    "approver_email": {
                        "type": "string",
                        "description": "Email of approver"
                    },
                    "decision": {
                        "type": "string",
                        "enum": ["approved", "rejected", "changes_requested"],
                        "description": "Approval decision"
                    },
                    "comments": {
                        "type": "string",
                        "description": "Optional comments explaining decision"
                    }
                },
                "required": ["contract_id", "step_number", "approver_email", "decision"]
            }
        ),

        Tool(
            name="get_pending_approvals",
            description=(
                "Get list of contracts pending approval for a specific approver. "
                "Returns contracts awaiting Shariah review, legal review, or executive approval. "
                "Use for personalized task lists and dashboards."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "approver_email": {
                        "type": "string",
                        "description": "Email of approver to get pending items for"
                    },
                    "approval_type": {
                        "type": "string",
                        "enum": ["shariah_review", "legal_review", "executive_approval", "all"],
                        "default": "all",
                        "description": "Filter by approval type"
                    }
                },
                "required": ["approver_email"]
            }
        ),

        # ========== DOCUMENT TOOLS ==========
        Tool(
            name="list_contract_documents",
            description=(
                "List all documents associated with a contract. "
                "Returns document metadata including type, upload status, owner, "
                "and evidence linkage to workflow steps."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Contract ID to list documents for"
                    },
                    "document_type": {
                        "type": "string",
                        "enum": ["kyc", "asset_proof", "shariah_certificate", "legal_contract", "other"],
                        "description": "Filter by document type"
                    },
                    "status": {
                        "type": "string",
                        "enum": ["needs_document", "uploaded", "verified", "rejected"],
                        "description": "Filter by document status"
                    }
                },
                "required": ["contract_id"]
            }
        ),

        Tool(
            name="verify_document",
            description=(
                "Verify a document has been reviewed and meets requirements. "
                "Used by Shariah advisors and compliance managers to mark documents "
                "as verified or request resubmission."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "document_id": {
                        "type": "string",
                        "description": "Document ID to verify"
                    },
                    "verifier_email": {
                        "type": "string",
                        "description": "Email of person verifying document"
                    },
                    "verification_status": {
                        "type": "string",
                        "enum": ["verified", "rejected"],
                        "description": "Verification outcome"
                    },
                    "comments": {
                        "type": "string",
                        "description": "Verification comments or rejection reasons"
                    }
                },
                "required": ["document_id", "verifier_email", "verification_status"]
            }
        ),

        # ========== STAKEHOLDER TOOLS ==========
        Tool(
            name="assign_step_owner",
            description=(
                "Assign ownership of a workflow step to a team member. "
                "Sets primary owner and optional subscribers (up to 10). "
                "Triggers assignment notifications and updates dashboards."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Contract ID"
                    },
                    "step_id": {
                        "type": "string",
                        "description": "Workflow step ID"
                    },
                    "owner_email": {
                        "type": "string",
                        "description": "Email of new step owner"
                    },
                    "owner_role": {
                        "type": "string",
                        "enum": ["business_team", "shariah_advisor", "legal_counsel", "compliance_manager", "finance_team"],
                        "description": "Role of step owner"
                    },
                    "subscribers": {
                        "type": "array",
                        "items": {"type": "string"},
                        "maxItems": 10,
                        "description": "Email addresses of subscribers (max 10)"
                    },
                    "due_date": {
                        "type": "string",
                        "format": "date-time",
                        "description": "Optional due date (ISO-8601)"
                    }
                },
                "required": ["contract_id", "step_id", "owner_email", "owner_role"]
            }
        ),

        Tool(
            name="get_stakeholder_contracts",
            description=(
                "Get all contracts assigned to a specific stakeholder. "
                "Returns contracts where they are owner or subscriber. "
                "Use for personalized dashboards and workload management."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "stakeholder_email": {
                        "type": "string",
                        "description": "Email of stakeholder"
                    },
                    "role": {
                        "type": "string",
                        "enum": ["owner", "subscriber", "all"],
                        "default": "all",
                        "description": "Filter by ownership role"
                    },
                    "status_filter": {
                        "type": "string",
                        "enum": ["active", "pending", "overdue", "all"],
                        "default": "active",
                        "description": "Filter by contract status"
                    }
                },
                "required": ["stakeholder_email"]
            }
        ),

        # ========== DASHBOARD TOOLS ==========
        Tool(
            name="get_dashboard",
            description=(
                "Get personalized dashboard data for a stakeholder based on their role. "
                "Returns metrics, pending tasks, overdue items, and activity feed. "
                "Dashboard content varies by role (business team, Shariah advisor, compliance manager)."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "stakeholder_email": {
                        "type": "string",
                        "description": "Email of stakeholder"
                    },
                    "role": {
                        "type": "string",
                        "enum": ["business_team", "shariah_advisor", "legal_counsel", "compliance_manager", "finance_team"],
                        "description": "Stakeholder role for dashboard customization"
                    }
                },
                "required": ["stakeholder_email", "role"]
            }
        ),

        Tool(
            name="get_portfolio_metrics",
            description=(
                "Get aggregate metrics across all contracts in the portfolio. "
                "Returns contract counts by status, average completion time, "
                "approval rates, overdue counts, and impact methodology distribution. "
                "Used by compliance managers and executives for oversight."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "time_period": {
                        "type": "string",
                        "enum": ["last_7_days", "last_30_days", "last_90_days", "this_year", "all_time"],
                        "default": "last_30_days",
                        "description": "Time period for metrics"
                    },
                    "group_by": {
                        "type": "string",
                        "enum": ["contract_type", "impact_methodology", "status", "owner"],
                        "description": "How to group metrics"
                    }
                }
            }
        ),

        # ========== COMMENT/COLLABORATION TOOLS ==========
        Tool(
            name="add_comment",
            description=(
                "Add a comment to a contract or workflow step. "
                "Supports threaded discussions and @mentions. "
                "Triggers notifications to mentioned users."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Contract ID"
                    },
                    "step_id": {
                        "type": "string",
                        "description": "Optional workflow step ID for step-specific comments"
                    },
                    "author_email": {
                        "type": "string",
                        "description": "Email of comment author"
                    },
                    "content": {
                        "type": "string",
                        "description": "Comment text (supports @mentions)"
                    },
                    "in_reply_to": {
                        "type": "string",
                        "description": "Optional comment ID for threaded replies"
                    }
                },
                "required": ["contract_id", "author_email", "content"]
            }
        ),

        Tool(
            name="get_comments",
            description=(
                "Get all comments for a contract or workflow step. "
                "Returns threaded comment structure with author information and timestamps."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "contract_id": {
                        "type": "string",
                        "description": "Contract ID"
                    },
                    "step_id": {
                        "type": "string",
                        "description": "Optional workflow step ID to filter comments"
                    }
                },
                "required": ["contract_id"]
            }
        ),
    ]


# ========== TOOL IMPLEMENTATIONS ==========

@server.call_tool()
async def call_tool(name: str, arguments: Any) -> List[TextContent]:
    """
    Handle tool calls from MCP clients.
    Routes to appropriate handler based on tool name.
    """
    try:
        logger.info(f"Tool called: {name} with arguments: {arguments}")

        # Route to appropriate handler
        if name == "list_contracts":
            result = await handle_list_contracts(arguments)
        elif name == "get_contract":
            result = await handle_get_contract(arguments)
        elif name == "create_contract":
            result = await handle_create_contract(arguments)
        elif name == "get_workflow_status":
            result = await handle_get_workflow_status(arguments)
        elif name == "advance_workflow_step":
            result = await handle_advance_workflow_step(arguments)
        elif name == "submit_approval":
            result = await handle_submit_approval(arguments)
        elif name == "get_pending_approvals":
            result = await handle_get_pending_approvals(arguments)
        elif name == "list_contract_documents":
            result = await handle_list_contract_documents(arguments)
        elif name == "verify_document":
            result = await handle_verify_document(arguments)
        elif name == "assign_step_owner":
            result = await handle_assign_step_owner(arguments)
        elif name == "get_stakeholder_contracts":
            result = await handle_get_stakeholder_contracts(arguments)
        elif name == "get_dashboard":
            result = await handle_get_dashboard(arguments)
        elif name == "get_portfolio_metrics":
            result = await handle_get_portfolio_metrics(arguments)
        elif name == "add_comment":
            result = await handle_add_comment(arguments)
        elif name == "get_comments":
            result = await handle_get_comments(arguments)
        else:
            raise ValueError(f"Unknown tool: {name}")

        # Format response
        import json
        return [TextContent(
            type="text",
            text=json.dumps(result, indent=2, default=str)
        )]

    except Exception as e:
        logger.error(f"Error executing tool {name}: {e}", exc_info=True)
        return [TextContent(
            type="text",
            text=json.dumps({
                "error": str(e),
                "tool": name,
                "arguments": arguments
            }, indent=2)
        )]


# ========== TOOL HANDLERS ==========

async def handle_list_contracts(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle list_contracts tool call"""
    # TODO: Integrate with actual backend service
    # For now, return mock data structure
    return {
        "contracts": [
            {
                "contract_id": "contract-001",
                "contract_type": "mudaraba",
                "status": "in_progress",
                "owner": "business@example.com",
                "impact_methodologies": ["esg", "sdg"],
                "current_phase": "shariah_review",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
        ],
        "pagination": {
            "total_count": 1,
            "page_size": args.get("page_size", 20),
            "has_more": False,
            "next_cursor": None
        }
    }


async def handle_get_contract(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle get_contract tool call"""
    contract_id = args["contract_id"]

    # TODO: Integrate with actual backend service
    return {
        "contract_id": contract_id,
        "contract_type": "mudaraba",
        "status": "in_progress",
        "owner": "business@example.com",
        "impact_methodologies": ["esg", "sdg"],
        "parties": {
            "investor_email": "investor@example.com",
            "entrepreneur_email": "entrepreneur@example.com"
        },
        "workflow": {
            "current_phase": "shariah_review",
            "current_step": "assess_shariah_compliance",
            "phases": [
                {
                    "phase_name": "Contract Setup",
                    "status": "completed",
                    "owner": "business@example.com"
                },
                {
                    "phase_name": "Shariah Review",
                    "status": "in_progress",
                    "owner": "shariah@example.com"
                }
            ]
        },
        "documents": [],
        "comments": [],
        "audit_trail": []
    }


async def handle_create_contract(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle create_contract tool call"""
    # TODO: Integrate with actual backend service
    contract_id = f"contract-{datetime.utcnow().timestamp()}"

    return {
        "contract_id": contract_id,
        "contract_type": args["contract_type"],
        "status": "draft",
        "impact_methodologies": args.get("impact_methodologies", []),
        "workflow_initialized": True,
        "created_at": datetime.utcnow().isoformat()
    }


async def handle_get_workflow_status(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle get_workflow_status tool call"""
    contract_id = args["contract_id"]

    # TODO: Integrate with WorkflowEngine service
    return {
        "contract_id": contract_id,
        "current_phase": "shariah_review",
        "current_step": "assess_shariah_compliance",
        "step_owner": "shariah@example.com",
        "step_subscribers": ["business@example.com", "compliance@example.com"],
        "pending_approvals": 1,
        "recent_activity": []
    }


async def handle_advance_workflow_step(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle advance_workflow_step tool call"""
    # TODO: Integrate with WorkflowEngine service
    return {
        "success": True,
        "contract_id": args["contract_id"],
        "previous_step": args["step_id"],
        "current_step": "next_step_id",
        "new_owner": "next_owner@example.com",
        "notifications_sent": 2
    }


async def handle_submit_approval(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle submit_approval tool call"""
    # TODO: Integrate with CollaborationService
    return {
        "success": True,
        "contract_id": args["contract_id"],
        "step_number": args["step_number"],
        "decision": args["decision"],
        "approver": args["approver_email"],
        "timestamp": datetime.utcnow().isoformat(),
        "workflow_advanced": args["decision"] == "approved"
    }


async def handle_get_pending_approvals(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle get_pending_approvals tool call"""
    # TODO: Integrate with CollaborationService
    return {
        "approver_email": args["approver_email"],
        "pending_approvals": [
            {
                "contract_id": "contract-001",
                "contract_type": "mudaraba",
                "step_name": "Shariah Compliance Review",
                "step_number": 1,
                "assigned_at": datetime.utcnow().isoformat(),
                "due_date": None,
                "priority": "high"
            }
        ],
        "total_count": 1
    }


async def handle_list_contract_documents(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle list_contract_documents tool call"""
    # TODO: Integrate with DocumentService
    return {
        "contract_id": args["contract_id"],
        "documents": [
            {
                "document_id": "doc-001",
                "type": "kyc",
                "status": "uploaded",
                "owner": "business@example.com",
                "uploaded_at": datetime.utcnow().isoformat(),
                "verified": False
            }
        ],
        "total_count": 1
    }


async def handle_verify_document(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle verify_document tool call"""
    # TODO: Integrate with DocumentService
    return {
        "success": True,
        "document_id": args["document_id"],
        "verification_status": args["verification_status"],
        "verifier": args["verifier_email"],
        "timestamp": datetime.utcnow().isoformat()
    }


async def handle_assign_step_owner(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle assign_step_owner tool call"""
    # TODO: Integrate with CollaborationService
    return {
        "success": True,
        "contract_id": args["contract_id"],
        "step_id": args["step_id"],
        "owner": args["owner_email"],
        "role": args["owner_role"],
        "subscribers": args.get("subscribers", []),
        "notifications_sent": 1 + len(args.get("subscribers", []))
    }


async def handle_get_stakeholder_contracts(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle get_stakeholder_contracts tool call"""
    # TODO: Integrate with CollaborationService
    return {
        "stakeholder_email": args["stakeholder_email"],
        "contracts": [
            {
                "contract_id": "contract-001",
                "contract_type": "mudaraba",
                "status": "in_progress",
                "role": "owner",
                "current_step": "assess_shariah_compliance",
                "due_date": None,
                "is_overdue": False
            }
        ],
        "total_count": 1
    }


async def handle_get_dashboard(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle get_dashboard tool call"""
    # TODO: Integrate with CollaborationService
    role = args["role"]

    if role == "shariah_advisor":
        return {
            "stakeholder_email": args["stakeholder_email"],
            "role": role,
            "metrics": {
                "pending_reviews": 3,
                "completed_this_month": 12,
                "average_review_time_days": 2.5
            },
            "pending_tasks": [
                {
                    "contract_id": "contract-001",
                    "task": "Shariah Compliance Review",
                    "due_date": None,
                    "priority": "high"
                }
            ],
            "recent_activity": []
        }
    else:
        return {
            "stakeholder_email": args["stakeholder_email"],
            "role": role,
            "metrics": {},
            "pending_tasks": [],
            "recent_activity": []
        }


async def handle_get_portfolio_metrics(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle get_portfolio_metrics tool call"""
    # TODO: Integrate with analytics service
    return {
        "time_period": args.get("time_period", "last_30_days"),
        "metrics": {
            "total_contracts": 15,
            "by_status": {
                "draft": 2,
                "in_progress": 8,
                "pending_approval": 3,
                "approved": 1,
                "executed": 1
            },
            "by_contract_type": {
                "mudaraba": 5,
                "murabaha": 4,
                "musharaka": 3,
                "ijara": 2,
                "sukuk": 1
            },
            "average_completion_days": 14.5,
            "approval_rate": 0.93
        }
    }


async def handle_add_comment(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle add_comment tool call"""
    # TODO: Integrate with CollaborationService
    return {
        "success": True,
        "comment_id": f"comment-{datetime.utcnow().timestamp()}",
        "contract_id": args["contract_id"],
        "author": args["author_email"],
        "timestamp": datetime.utcnow().isoformat(),
        "mentions_notified": 0
    }


async def handle_get_comments(args: Dict[str, Any]) -> Dict[str, Any]:
    """Handle get_comments tool call"""
    # TODO: Integrate with CollaborationService
    return {
        "contract_id": args["contract_id"],
        "step_id": args.get("step_id"),
        "comments": [],
        "total_count": 0
    }


# ============================================================================
# RESOURCES: Data that AI models can request
# ============================================================================

@server.list_resources()
async def list_resources() -> List[Resource]:
    """
    List available resources in the Islamic Finance platform.

    Resources use URI-based identification following this scheme:
    islamic-finance://[resource_type]/[id]

    Examples:
    - islamic-finance://contracts/contract-001
    - islamic-finance://workflows/contract-001/workflow
    - islamic-finance://documents/doc-001
    - islamic-finance://stakeholders/user@example.com
    """
    # TODO: Dynamically generate resource list from database
    return [
        Resource(
            uri="islamic-finance://contracts",
            name="Contracts",
            description="All Islamic finance contracts in the system",
            mimeType="application/json"
        ),
        Resource(
            uri="islamic-finance://workflows",
            name="Workflows",
            description="Workflow execution data for all contracts",
            mimeType="application/json"
        ),
        Resource(
            uri="islamic-finance://stakeholders",
            name="Stakeholders",
            description="Team members and their assignments",
            mimeType="application/json"
        ),
    ]


@server.read_resource()
async def read_resource(uri: str) -> str:
    """
    Read a specific resource by URI.

    Supports:
    - islamic-finance://contracts -> List all contracts
    - islamic-finance://contracts/[id] -> Get specific contract
    - islamic-finance://workflows/[contract_id] -> Get workflow status
    - islamic-finance://documents/[contract_id] -> List contract documents
    - islamic-finance://stakeholders/[email] -> Get stakeholder info
    """
    logger.info(f"Resource requested: {uri}")

    # Parse URI
    if not uri.startswith("islamic-finance://"):
        raise ValueError(f"Invalid URI scheme. Expected islamic-finance://, got: {uri}")

    path = uri.replace("islamic-finance://", "")
    parts = path.split("/")

    # Route to appropriate handler
    if parts[0] == "contracts":
        if len(parts) == 1:
            # List all contracts
            result = await handle_list_contracts({})
        else:
            # Get specific contract
            result = await handle_get_contract({"contract_id": parts[1]})

    elif parts[0] == "workflows":
        if len(parts) < 2:
            raise ValueError("Workflow URI requires contract ID")
        result = await handle_get_workflow_status({"contract_id": parts[1]})

    elif parts[0] == "documents":
        if len(parts) < 2:
            raise ValueError("Documents URI requires contract ID")
        result = await handle_list_contract_documents({"contract_id": parts[1]})

    elif parts[0] == "stakeholders":
        if len(parts) < 2:
            raise ValueError("Stakeholder URI requires email")
        result = await handle_get_stakeholder_contracts({"stakeholder_email": parts[1]})

    else:
        raise ValueError(f"Unknown resource type: {parts[0]}")

    import json
    return json.dumps(result, indent=2, default=str)


# ============================================================================
# PROMPTS: Templated interactions for common tasks
# ============================================================================

@server.list_prompts()
async def list_prompts() -> List[Any]:
    """
    List available prompt templates for common Islamic Finance tasks.

    Prompts guide AI assistants through standard workflows like:
    - Creating a new Mudaraba contract
    - Reviewing Shariah compliance
    - Approving contract execution
    """
    return [
        {
            "name": "create_mudaraba",
            "description": "Guide for creating a new Mudaraba (profit-sharing) contract",
            "arguments": [
                {
                    "name": "investor_email",
                    "description": "Email of the investor (Rabb-ul-Maal)",
                    "required": True
                },
                {
                    "name": "entrepreneur_email",
                    "description": "Email of the entrepreneur (Mudarib)",
                    "required": True
                },
                {
                    "name": "capital_amount",
                    "description": "Capital contribution amount",
                    "required": True
                }
            ]
        },
        {
            "name": "shariah_review_checklist",
            "description": "Comprehensive checklist for Shariah compliance review",
            "arguments": [
                {
                    "name": "contract_id",
                    "description": "Contract ID to review",
                    "required": True
                }
            ]
        },
    ]


@server.get_prompt()
async def get_prompt(name: str, arguments: Dict[str, str] | None) -> GetPromptResult:
    """
    Get a specific prompt template with substituted arguments.
    """
    if name == "create_mudaraba":
        return GetPromptResult(
            messages=[
                PromptMessage(
                    role="user",
                    content=TextContent(
                        type="text",
                        text=f"""I need to create a new Mudaraba contract with the following details:

Investor (Rabb-ul-Maal): {arguments.get('investor_email', '[EMAIL]')}
Entrepreneur (Mudarib): {arguments.get('entrepreneur_email', '[EMAIL]')}
Capital Amount: {arguments.get('capital_amount', '[AMOUNT]')}

Please guide me through the contract creation process, ensuring all Shariah compliance requirements are met."""
                    )
                )
            ]
        )

    elif name == "shariah_review_checklist":
        contract_id = arguments.get('contract_id', '[CONTRACT_ID]')
        return GetPromptResult(
            messages=[
                PromptMessage(
                    role="user",
                    content=TextContent(
                        type="text",
                        text=f"""Please review contract {contract_id} for Shariah compliance using this checklist:

1. Verify parties are eligible under Islamic law
2. Confirm asset tangibility and lawful ownership
3. Validate absence of Riba (interest)
4. Check profit-sharing ratios are clearly defined
5. Ensure business activities are halal
6. Verify contract contains necessary Islamic clauses
7. Confirm transparency in all financial disclosures

Provide detailed findings for each point."""
                    )
                )
            ]
        )

    else:
        raise ValueError(f"Unknown prompt: {name}")


# ============================================================================
# SERVER INITIALIZATION
# ============================================================================

async def main():
    """
    Main entry point for the MCP server.
    Runs server in stdio mode for communication with MCP clients.
    """
    logger.info("Starting Islamic Finance MCP Server...")
    logger.info("Server name: islamic-finance")
    logger.info("Version: 1.0.0")
    logger.info("Transport: stdio")

    # Initialize services
    # (Already initialized at module level)

    # Run server
    async with stdio_server() as (read_stream, write_stream):
        logger.info("Server started successfully")
        logger.info("Waiting for client connections...")
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server crashed: {e}", exc_info=True)
        sys.exit(1)
