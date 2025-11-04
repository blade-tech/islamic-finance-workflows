# Islamic Finance MCP Server

Model Context Protocol (MCP) server for the Islamic Finance Workflows platform. This server exposes contract lifecycle management, Shariah compliance workflows, and multi-stakeholder collaboration features to AI assistants and other MCP clients.

## Overview

The Islamic Finance MCP server provides:

- **14 Tools** for contract management, workflow execution, approvals, documents, and collaboration
- **URI-based Resources** for accessing contracts, workflows, documents, and stakeholder data
- **Prompt Templates** for common Islamic finance workflows (Mudaraba creation, Shariah review)
- **Role-based Access** with stakeholder authentication and authorization

## Architecture

```
Backend Services (FastAPI)
    ↓
MCP Server (stdio transport)
    ↓
MCP Clients (Claude Desktop, Cursor, Custom)
```

The MCP server acts as a bridge between AI assistants and the Islamic Finance platform backend. It translates MCP tool calls into backend service operations and returns structured results.

## Installation

1. Install dependencies:
```bash
cd backend
pip install mcp  # Model Context Protocol SDK
```

2. Set environment variables (same as main backend):
```bash
# See backend/.env for required variables
NEO4J_URI=...
ANTHROPIC_API_KEY=...
# etc.
```

3. Test the server:
```bash
python -m mcp.server
```

## Tools Available

### Contract Tools
- `list_contracts` - List all contracts with filtering and pagination
- `get_contract` - Get detailed contract information
- `create_contract` - Create new Islamic finance contract

### Workflow Tools
- `get_workflow_status` - Get current workflow execution status
- `advance_workflow_step` - Complete current step and advance workflow

### Approval Tools
- `submit_approval` - Submit approval decision (approve/reject/request changes)
- `get_pending_approvals` - Get list of pending approvals for approver

### Document Tools
- `list_contract_documents` - List all documents for a contract
- `verify_document` - Verify document meets requirements

### Stakeholder Tools
- `assign_step_owner` - Assign workflow step ownership
- `get_stakeholder_contracts` - Get all contracts for a stakeholder

### Dashboard Tools
- `get_dashboard` - Get personalized role-based dashboard
- `get_portfolio_metrics` - Get aggregate portfolio metrics

### Collaboration Tools
- `add_comment` - Add comment to contract or step
- `get_comments` - Get all comments for contract/step

## Resources

Resources use URI-based identification:

```
islamic-finance://contracts               → List all contracts
islamic-finance://contracts/contract-001  → Get specific contract
islamic-finance://workflows/contract-001  → Get workflow status
islamic-finance://documents/contract-001  → List contract documents
islamic-finance://stakeholders/user@example.com → Get stakeholder info
```

## Prompts

Predefined prompt templates for common tasks:

- `create_mudaraba` - Guide for creating Mudaraba (profit-sharing) contract
- `shariah_review_checklist` - Comprehensive Shariah compliance checklist

## Configuration for Claude Desktop

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "islamic-finance": {
      "command": "python",
      "args": ["-m", "mcp.server"],
      "cwd": "/path/to/backend",
      "env": {
        "NEO4J_URI": "your-uri",
        "ANTHROPIC_API_KEY": "your-key"
      }
    }
  }
}
```

## Usage Examples

### Example 1: Creating a Contract

```python
# MCP client calls:
result = await client.call_tool("create_contract", {
    "contract_type": "mudaraba",
    "impact_methodologies": ["esg", "sdg"],
    "parties": {
        "investor_email": "investor@example.com",
        "entrepreneur_email": "entrepreneur@example.com",
        "business_team_owner": "business@example.com"
    }
})
# Returns: {"contract_id": "contract-123", "status": "draft", ...}
```

### Example 2: Submitting Approval

```python
result = await client.call_tool("submit_approval", {
    "contract_id": "contract-001",
    "step_number": 1,
    "approver_email": "shariah@example.com",
    "decision": "approved",
    "comments": "Complies with Shariah requirements"
})
# Returns: {"success": true, "workflow_advanced": true, ...}
```

### Example 3: Getting Dashboard

```python
result = await client.call_tool("get_dashboard", {
    "stakeholder_email": "shariah@example.com",
    "role": "shariah_advisor"
})
# Returns: {
#   "metrics": {"pending_reviews": 3, ...},
#   "pending_tasks": [...],
#   "recent_activity": [...]
# }
```

## Development

### Adding New Tools

1. Define tool schema in `list_tools()`:
```python
Tool(
    name="my_new_tool",
    description="What this tool does",
    inputSchema={
        "type": "object",
        "properties": {...},
        "required": [...]
    }
)
```

2. Add handler in `call_tool()`:
```python
elif name == "my_new_tool":
    result = await handle_my_new_tool(arguments)
```

3. Implement handler function:
```python
async def handle_my_new_tool(args: Dict[str, Any]) -> Dict[str, Any]:
    # Integrate with backend service
    return {...}
```

### Connecting to Backend Services

Replace mock implementations in tool handlers with actual backend service calls:

```python
async def handle_get_contract(args: Dict[str, Any]) -> Dict[str, Any]:
    contract_id = args["contract_id"]

    # Replace mock with actual service call
    contract = await session_service.get_contract(contract_id)

    return {
        "contract_id": contract.id,
        "contract_type": contract.type,
        "status": contract.status,
        # ... map contract object to response format
    }
```

## Security Considerations

- **Authentication**: All tool calls should validate user identity
- **Authorization**: Check user permissions before allowing operations
- **Input Validation**: Strictly validate all tool arguments
- **Rate Limiting**: Implement rate limits for sensitive operations
- **Audit Logging**: Log all tool calls for compliance

See `auth.py` (TODO) for authentication implementation.

## Testing

Test the MCP server with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector python -m mcp.server
```

Or use the MCP Python client:

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="python",
    args=["-m", "mcp.server"],
    env=None
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()

        # List available tools
        tools = await session.list_tools()
        print(tools)

        # Call a tool
        result = await session.call_tool("list_contracts", {})
        print(result)
```

## Roadmap

- [ ] Connect all tool handlers to real backend services
- [ ] Implement authentication and authorization
- [ ] Add SSE (Server-Sent Events) transport support
- [ ] Implement resource templates for dynamic resource discovery
- [ ] Add more prompt templates for common workflows
- [ ] Create comprehensive test suite
- [ ] Add metrics and observability
- [ ] Publish to PyPI as `mcp-islamic-finance`

## References

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Desktop MCP Integration](https://docs.anthropic.com/claude/docs/mcp)
- [Vanta MCP Implementation](https://www.vanta.com/) (inspiration for patterns)

## License

Copyright 2025 Blade Labs. All rights reserved.
