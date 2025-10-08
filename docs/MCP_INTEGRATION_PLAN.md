# MCP Integration Plan for Islamic Finance Workflows

## Overview
Replace direct API calls with Model Context Protocol (MCP) integration using Claude Agent SDK.

## Current Architecture
- **Frontend**: Next.js 14 + TypeScript
- **Backend**: FastAPI + Python 3.10
- **Knowledge Graph**: Blade Labs Graphiti (currently via direct HTTP API calls)
- **LLM**: Anthropic Claude via direct API

## MCP Integration Strategy

### ✅ Confirmed Capabilities
- Claude Agent SDK supports full MCP integration
- Available in both TypeScript and Python
- Documentation: https://docs.claude.com/en/api/agent-sdk/overview

### Installation

#### TypeScript/JavaScript
```bash
npm install @anthropic-ai/claude-agent-sdk
```

#### Python (Recommended for our backend)
```bash
pip install claude-agent-sdk
```

**Prerequisites:**
- Python 3.10+ ✅ (our backend uses this)
- Node.js ✅ (for frontend)
- Claude Code 2.0.0+

## Python SDK Integration (Backend)

### Key Features
1. **In-process MCP servers** - Run MCP servers directly in Python application
2. **No subprocess overhead** - Better performance than external MCP servers
3. **Custom tools as Python functions** - Define tools directly in FastAPI
4. **Async/streaming support** - Compatible with FastAPI async patterns

### Usage Example
```python
import anyio
from claude_agent_sdk import query

async def main():
    async for message in query(
        prompt="What is 2 + 2?",
        options={
            "mcpServers": {
                "graphiti": {
                    "command": "python",
                    "args": ["-m", "mcp_server_graphiti"],
                    "env": {
                        "GRAPHITI_API_KEY": "..."
                    }
                }
            },
            "allowedTools": ["mcp__graphiti__search"]
        }
    ):
        print(message)

anyio.run(main)
```

### In-Process MCP Server (Recommended)
```python
from claude_agent_sdk import query
from mcp.server import Server

# Define custom MCP server in-process
server = Server("graphiti")

@server.list_tools()
async def list_tools():
    return [{"name": "search_graphiti", "description": "..."}]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "search_graphiti":
        # Call Graphiti API directly
        return await graphiti_client.search(...)

# Use in query
async for message in query(
    prompt="Search for AAOIFI standards",
    options={"mcpServers": {"graphiti": server}}
):
    print(message)
```

## MCP Configuration

### TypeScript Configuration (.mcp.json)
```json
{
  "mcpServers": {
    "graphiti": {
      "command": "python",
      "args": ["-m", "mcp_server_graphiti"],
      "env": {
        "GRAPHITI_API_URL": "http://localhost:8001",
        "GRAPHITI_API_KEY": "${GRAPHITI_API_KEY}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_PATHS": "./uploads"
      }
    }
  }
}
```

### Python Configuration (programmatic)
```python
mcp_config = {
    "mcpServers": {
        "graphiti": {
            "command": "python",
            "args": ["-m", "mcp_server_graphiti"],
            "env": {
                "GRAPHITI_API_URL": os.getenv("GRAPHITI_API_URL"),
                "GRAPHITI_API_KEY": os.getenv("GRAPHITI_API_KEY")
            }
        }
    },
    "allowedTools": [
        "mcp__graphiti__search",
        "mcp__graphiti__add_episode",
        "mcp__blade-graphiti__search"  # Our current MCP
    ]
}
```

## Migration Path

### Phase 1: Backend MCP Integration
1. Install `claude-agent-sdk` in backend
2. Replace direct Graphiti HTTP calls with MCP calls
3. Implement in-process MCP server for Graphiti
4. Test search and episode ingestion

### Phase 2: Claude Execution via MCP
1. Replace direct Claude API calls with Agent SDK queries
2. Configure MCP servers (Graphiti, filesystem)
3. Stream responses via SSE from Agent SDK
4. Test workflow execution end-to-end

### Phase 3: Frontend MCP Integration (Optional)
1. Install TypeScript Agent SDK
2. Configure client-side MCP for browser-based tools
3. Direct browser → MCP communication (bypass backend for some operations)

## Benefits of MCP Integration

### Current Issues (Direct API)
- Manual context management
- No standardized tool interface
- Tight coupling to Graphiti API
- Limited extensibility

### Benefits with MCP
- ✅ **Standardized protocol** - MCP is the standard for Claude integrations
- ✅ **Better context management** - Agent SDK handles automatic compaction
- ✅ **Tool ecosystem** - Access to all MCP servers (filesystem, databases, etc.)
- ✅ **In-process servers** - Better performance than subprocess
- ✅ **Future-proof** - Aligned with Anthropic's agent architecture
- ✅ **Unified interface** - Single SDK for all Claude operations

## Implementation Timeline

### Immediate (Post-Debugging)
- [ ] Install `claude-agent-sdk` in backend
- [ ] Document current Graphiti API calls
- [ ] Create in-process MCP server wrapper for Graphiti

### Week 1
- [ ] Replace Graphiti search endpoint with MCP calls
- [ ] Test knowledge graph search via MCP
- [ ] Verify AAOIFI document ingestion

### Week 2
- [ ] Replace Claude execution with Agent SDK
- [ ] Configure MCP servers for workflow templates
- [ ] Test streaming execution via SSE

### Week 3
- [ ] Add filesystem MCP for document uploads
- [ ] Test citation verification with MCP context
- [ ] End-to-end testing

## Current MCP Usage

### Blade Labs Graphiti MCP (via Claude Code)
We currently use the Blade Labs Graphiti MCP through Claude Code CLI:
- Tool prefix: `mcp__blade-graphiti__*`
- Functions: `search`, `add_episode`, `add_episodes_bulk`, `delete_episode`, etc.

### Migration Strategy
Replace Claude Code CLI MCP calls with:
1. **Python Agent SDK** in backend
2. **In-process MCP server** for Graphiti
3. **Direct Python functions** exposed as MCP tools

## References

- Claude Agent SDK Overview: https://docs.claude.com/en/api/agent-sdk/overview
- MCP Configuration: https://docs.claude.com/en/api/agent-sdk/mcp
- TypeScript SDK: https://github.com/anthropics/claude-agent-sdk-typescript
- Python SDK: https://github.com/anthropics/claude-agent-sdk-python
- Model Context Protocol: https://modelcontextprotocol.io/

## Notes

- Python SDK requires Claude Code 2.0.0+ as a dependency
- In-process MCP servers eliminate subprocess overhead
- Agent SDK handles automatic context management and compaction
- MCP provides standardized tool interface across all integrations

---

**Status**: Documented - Implementation pending post-debugging
**Last Updated**: 2025-10-08
**Author**: Claude Code
