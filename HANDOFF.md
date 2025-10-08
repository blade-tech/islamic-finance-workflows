# Islamic Finance Workflows - MCP Integration Handoff

## Project Status: BLOCKED - Critical Integration Issues

**Date**: 2025-10-08
**Handoff From**: Claude AI (via claude-code)
**Handoff To**: Developer Team
**Priority**: HIGH - Phase 1 Blocked

---

## Executive Summary

This project aims to integrate Model Context Protocol (MCP) services into the Islamic Finance Workflows application. **Phase 1 (Graphiti Knowledge Graph Integration) is currently BLOCKED** due to critical issues with the `claude-agent-sdk` v0.1.1 package.

### What Works ✅
- ✅ Graphiti MCP server runs successfully in Claude Code environment
- ✅ Graphiti MCP server runs successfully when invoked manually via command line
- ✅ Direct MCP client implementation (using `mcp` SDK) - **WORKING ALTERNATIVE**
- ✅ Backend API endpoints structure is ready
- ✅ Frontend is running on port 3000
- ✅ Backend FastAPI is running on port 8003
- ✅ Neo4j AuraDB is connected and has AAOIFI data

### What's Broken ❌
- ❌ `claude-agent-sdk` v0.1.1 cannot spawn MCP servers via `ClaudeAgentOptions.mcp_servers`
- ❌ Claude AI orchestration approach is not working
- ❌ MCP server status shows "failed" when launched by SDK subprocess

---

## Critical Blocker: claude-agent-sdk MCP Server Spawning

### The Problem
The `claude-agent-sdk` v0.1.1 is designed to spawn MCP servers as subprocesses and orchestrate them through Claude AI. However, the MCP server consistently fails to start with the error:

```
'mcp_servers': [{'name': 'blade-graphiti', 'status': 'failed'}]
```

### What We Tried

#### Attempt 1: Using published package name
```python
"command": "uvx",
"args": ["mcp-server-graphiti"]
```
**Result**: Package doesn't exist ❌

#### Attempt 2: Full path to local server
```python
graphiti_mcp_path = r"D:\projects\graphiti\mcp_server\graphiti_mcp_server.py"
"command": "uv",
"args": ["run", graphiti_mcp_path, "--transport", "stdio"]
```
**Result**: Server fails to start ❌

#### Attempt 3: Setting working directory
```python
"command": "uv",
"args": ["run", "graphiti_mcp_server.py", "--transport", "stdio"],
"cwd": r"D:\projects\graphiti\mcp_server"
```
**Result**: Server fails to start ❌

#### Attempt 4: Minimal environment variables
```python
"env": {
    "NEO4J_URI": "...",
    "NEO4J_USER": "...",
    "NEO4J_PASSWORD": "...",
    "OPENAI_API_KEY": "...",
    "PATH": "...",
    "PYTHONPATH": "..."
}
```
**Result**: Server fails to start ❌

#### Attempt 5: All environment variables
```python
"env": {**os.environ, ...}
```
**Result**: Command line too long error ❌

### Evidence
The same server configuration works perfectly:
1. ✅ In Claude Code MCP integration (I can call `mcp__blade-graphiti__get_recent_nodes`)
2. ✅ When run manually: `cd D:\projects\graphiti\mcp_server && uv run graphiti_mcp_server.py --transport stdio`
3. ❌ When spawned by `claude-agent-sdk`

### Test Files
- `backend/test_mcp_sdk.py` - Demonstrates the failing SDK approach
- `backend/app/services/graphiti_mcp_service.py` - Claude orchestration service (NOT WORKING)
- `backend/app/services/graphiti_mcp_client.py` - Direct MCP client (WORKING)

---

## Architecture Overview

### Current Stack
- **Frontend**: React + TypeScript (Port 3000)
- **Backend**: FastAPI + Python 3.12 (Port 8003)
- **Database**: Neo4j AuraDB (neo4j+ssc://135166f5.databases.neo4j.io)
- **Knowledge Graph**: Graphiti (getzep/graphiti)
- **AI**: Anthropic Claude (via `claude-agent-sdk`)

### MCP Integration Plan (4 Phases)

#### Phase 1: Graphiti Knowledge Graph ⚠️ BLOCKED
**Goal**: Enable Claude AI to orchestrate Graphiti knowledge graph operations
**Status**: BLOCKED by claude-agent-sdk issues

**What Needs to Work**:
- Backend calls Claude AI via `claude-agent-sdk.query()`
- Claude AI orchestrates MCP tool calls to Graphiti server
- Results returned to backend for API responses

**Current Files**:
- `backend/app/api/graphiti.py` - API endpoints
- `backend/app/services/graphiti_mcp_service.py` - Claude orchestration (broken)
- `backend/app/services/graphiti_mcp_client.py` - Direct MCP client (working)

#### Phase 2: Copilots MCP (Pending)
**Goal**: Custom workflow creation with expert AI consultation
**MCP Server**: blade-tech/copilots-mcp

#### Phase 3: Exa MCP (Pending)
**Goal**: Web research integration in workflow Step 3
**MCP Server**: exa.ai

#### Phase 4: Hedera MCP (Pending)
**Goal**: Blockchain chat interface
**MCP Server**: hedera-mcp

---

## File Structure

```
Islamic Finance Workflows/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── graphiti.py           # API endpoints (calls get_graphiti_mcp_service)
│   │   ├── services/
│   │   │   ├── __init__.py           # Exports get_graphiti_mcp_client
│   │   │   ├── graphiti_mcp_client.py    # ✅ WORKING - Direct MCP client
│   │   │   └── graphiti_mcp_service.py   # ❌ BROKEN - Claude orchestration
│   │   └── main.py
│   ├── test_mcp_sdk.py              # Demonstrates claude-agent-sdk failure
│   ├── .env                         # Environment variables
│   └── requirements.txt
├── frontend/
│   └── (React app)
└── HANDOFF.md                       # This file
```

---

## Environment Variables

Required in `backend/.env`:

```bash
# Neo4j Database
NEO4J_URI=neo4j+ssc://135166f5.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=<password>

# OpenAI (for Graphiti embeddings)
OPENAI_API_KEY=<key>

# Anthropic Claude
ANTHROPIC_API_KEY=<key>
```

---

## Running the Application

### Backend (Port 8003)
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8003 --log-level info
```

### Frontend (Port 3000)
```bash
npm run dev
```

### Test Graphiti MCP Server Manually
```bash
cd D:\projects\graphiti\mcp_server
uv run graphiti_mcp_server.py --transport stdio --help
```

### Test claude-agent-sdk (Will Fail)
```bash
cd backend
python test_mcp_sdk.py
```

---

## Critical Issues & Questions for Developer

### Issue 1: claude-agent-sdk MCP Server Spawning
**Problem**: SDK cannot spawn MCP servers despite correct configuration
**Evidence**: See test_mcp_sdk.py output showing `'status': 'failed'`

**Questions**:
1. Is there a known bug in `claude-agent-sdk` v0.1.1 with MCP server spawning?
2. Is there a newer version of the SDK that fixes this?
3. Should we abandon Claude orchestration and use direct MCP client instead?

### Issue 2: Architecture Decision Required
**Current Confusion**: We have TWO implementations:
- `graphiti_mcp_service.py` - Claude AI orchestrates (user requested, but broken)
- `graphiti_mcp_client.py` - Direct MCP calls (working, but user said "no direct calls")

**Decision Needed**:
- Option A: Fix claude-agent-sdk and use Claude orchestration ⭐ (User's preference)
- Option B: Use direct MCP client and remove Claude orchestration
- Option C: Hybrid approach - use direct client until SDK is fixed

### Issue 3: Integration Point
**Problem**: API endpoint calls `get_graphiti_mcp_service()` which uses broken SDK

**Current Code** (graphiti.py:48):
```python
mcp_service = get_graphiti_mcp_service()  # Uses claude-agent-sdk (broken)
```

**Working Alternative**:
```python
mcp_client = get_graphiti_mcp_client()  # Uses mcp SDK directly (works)
```

**Question**: Which should we use for the API?

---

## Recommended Next Steps

### Immediate (Developer Action Required)

1. **Decision: Choose Integration Approach**
   - If sticking with Claude orchestration: Debug/fix claude-agent-sdk
   - If switching to direct MCP: Update API to use `graphiti_mcp_client.py`

2. **Update API Endpoints**
   - Change import in `graphiti.py` from `get_graphiti_mcp_service` to `get_graphiti_mcp_client`
   - Update `__init__.py` if using client approach

3. **Test End-to-End**
   - Test `/graphiti/test` endpoint
   - Test `/graphiti/search` endpoint
   - Verify knowledge graph queries work

4. **Clean Up**
   - Delete `graphiti_mcp_service.py` if not using Claude orchestration
   - Delete `test_mcp_sdk.py` if abandoning SDK approach
   - Update documentation

### Short Term

5. **Phase 1 Completion**
   - Complete Graphiti integration
   - Document working approach
   - Update frontend to use knowledge graph

6. **Phase 2-4 Planning**
   - Apply lessons learned from Phase 1
   - Choose: Claude orchestration vs direct MCP client
   - Test MCP servers before integration

---

## Dependencies

### Python (backend/requirements.txt)
```
fastapi
uvicorn
python-dotenv
anthropic
claude-agent-sdk==0.1.1  # ⚠️ PROBLEMATIC
mcp                       # ✅ Direct MCP client (works)
neo4j
openai
```

### Graphiti MCP Server
Located at: `D:\projects\graphiti\mcp_server\graphiti_mcp_server.py`

**Run Command**:
```bash
cd D:\projects\graphiti\mcp_server
uv run graphiti_mcp_server.py --transport stdio
```

**Required Environment**:
- NEO4J_URI
- NEO4J_USER
- NEO4J_PASSWORD
- OPENAI_API_KEY

---

## Testing Evidence

### ✅ Working: Direct MCP Client
The `graphiti_mcp_client.py` successfully:
- Connects to blade-graphiti MCP server via stdio
- Calls `mcp__blade-graphiti__search`
- Calls `mcp__blade-graphiti__get_recent_nodes`
- Returns structured JSON responses

### ❌ Failing: claude-agent-sdk
The `test_mcp_sdk.py` consistently shows:
```python
SystemMessage(
    mcp_servers=[{'name': 'blade-graphiti', 'status': 'failed'}]
)
```

Despite trying:
- Different commands (uvx, uv run, python)
- Different paths (relative, absolute)
- Different working directories
- Different environment variable configurations

---

## Knowledge Base

### Neo4j Database Content
- AAOIFI standards documents (group_id: "aaoifi-documents")
- Context documents (group_id: "context-documents")
- ~50 Episodic nodes with financial standards content
- Entity nodes extracted from documents

### Graphiti MCP Tools Available
- `mcp__blade-graphiti__search` - Semantic knowledge graph search
- `mcp__blade-graphiti__add_episode` - Add document to graph
- `mcp__blade-graphiti__add_episodes_bulk` - Bulk document ingestion
- `mcp__blade-graphiti__get_recent_nodes` - Get recently created nodes
- `mcp__blade-graphiti__delete_episode` - Remove document from graph

---

## Contact & Handoff

**Previous Work By**: Claude AI via claude-code
**Handoff Date**: 2025-10-08
**Status**: Phase 1 blocked, requires developer intervention

**Key Decision Maker**: User wants "Claude AI orchestration only, no direct MCP tool calls"
**Reality**: Claude orchestration via claude-agent-sdk is not working
**Developer Task**: Resolve this conflict and choose working approach

---

## Additional Notes

1. The Graphiti MCP server is from the official getzep/graphiti repository
2. It works perfectly in Claude Code (I can use the tools in this environment)
3. The issue is specific to `claude-agent-sdk` subprocess spawning
4. This may be a bug in claude-agent-sdk v0.1.1 or a Windows-specific issue
5. Consider filing a bug report with Anthropic if this is a SDK issue

---

## Quick Reference

### Start Development
```bash
# Terminal 1 - Backend
cd "D:\projects\Islamic Finance AI Demo\Islamic Finance Workflows\backend"
python -m uvicorn app.main:app --reload --port 8003

# Terminal 2 - Frontend
cd "D:\projects\Islamic Finance AI Demo\Islamic Finance Workflows"
npm run dev
```

### Test MCP Connection
```bash
# Manual test (works)
cd D:\projects\graphiti\mcp_server
uv run graphiti_mcp_server.py --help

# SDK test (fails)
cd "D:\projects\Islamic Finance AI Demo\Islamic Finance Workflows\backend"
python test_mcp_sdk.py
```

### API Endpoints
- GET `http://localhost:8003/graphiti/test` - Test knowledge graph connection
- POST `http://localhost:8003/graphiti/search` - Search knowledge graph

---

**END OF HANDOFF DOCUMENT**
