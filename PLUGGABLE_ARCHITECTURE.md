# Pluggable Frontend Architecture
## Universal Testing UI for Backend Infrastructure

**Date**: 2025-10-08
**Purpose**: Enable non-developers to Vibe-code frontends that plug into production backend infrastructure
**Approach**: Modular, configuration-driven testing UI framework

---

## Executive Summary

### **The Real Problem**

As non-developers start Vibe-coding frontends/prototypes, the team faces challenges:
- ❌ **Deployment**: Can't easily deploy Vibe-coded UIs
- ❌ **Sharing**: Hard to collaborate on prototypes
- ❌ **Testing**: Can't connect to actual backend to validate use cases
- ❌ **Separation of Concerns**: Frontend/backend teams move independently

**Example Pain Points**:
- Using Graphiti out-of-the-box → Doesn't work well → Misha-Dev built enhancements
- Can't test enhanced Graphiti without custom backend integration
- Non-developers iterate on UI → Developers iterate on backend → No easy connection

### **The Solution**

**Build a pluggable backend that ANY Vibe-coded frontend can connect to.**

**Frontend = Testing UI for Backend Infrastructure**
- Not production software
- Purpose: Validate backend components (LangFuse, LangGraph, Graphiti enhancements, Neo4j, MCPs)
- Separation of concerns: Frontend team iterates on UI, backend team iterates on infrastructure
- Easy sharing: Update frontend → Backend team tests with latest UI

**Benefits**:
- ✅ Test enhanced Graphiti (Misha's improvements, not out-of-the-box)
- ✅ Test custom LangGraph orchestration
- ✅ Test all MCPs independently
- ✅ Validate use cases with real infrastructure
- ✅ Easy deployment and collaboration
- ✅ Frontend/backend teams move in parallel, not blocked on each other

---

## Architecture Overview

### **Team Workflow**

```
┌─────────────────────────────────────────────────────────────────┐
│                 NON-DEVELOPER (Vibe-coding)                      │
│                                                                  │
│  1. Builds frontend prototype in Vibe                           │
│  2. Adds .env config to point to backend                        │
│  3. Shares with backend team                                    │
│  4. Iterates on UI based on testing results                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ Shares frontend
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND TEAM (Misha-Dev + Team)                    │
│                                                                  │
│  1. Receives frontend update                                    │
│  2. Runs frontend against production backend                    │
│  3. Tests use case with real infrastructure                     │
│  4. Validates backend enhancements work                         │
│  5. Provides feedback on what needs fixing                      │
└─────────────────────────────────────────────────────────────────┘
```

### **Technical Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│           VIBE-CODED FRONTEND (Testing UI)                      │
│           - Can be Islamic Finance workflow demo                │
│           - Can be any use case prototype                       │
│           - Configuration-driven (.env)                         │
│           - Easy to share/deploy                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │        Pluggable API Client                            │    │
│  │  - Auto-discovers backend services                     │    │
│  │  - Works with any backend that follows contract        │    │
│  │  - Graceful degradation if service unavailable         │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ HTTP/SSE/WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND API CONTRACT                             │
│                 (Standard endpoints ANY frontend can use)        │
│                                                                  │
│  /mcp/*           → MCP tool calls                              │
│  /orchestrator/*  → LangGraph execution                         │
│  /graphiti/*      → Knowledge graph (enhanced)                  │
│  /observability/* → LangFuse traces                             │
│  /documents/*     → Document operations                         │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ Backend Team Implements
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              PRODUCTION BACKEND INFRASTRUCTURE                   │
│              (What Misha-Dev + team are building)                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Enhanced     │  │ Custom       │  │ LangFuse     │         │
│  │ Graphiti     │  │ LangGraph    │  │ Observability│         │
│  │ (Misha's     │  │ Orchestrator │  │              │         │
│  │  version)    │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ MCP Servers  │  │ Neo4j AuraDB │  │ Custom       │         │
│  │ - Graphiti   │  │ - Business   │  │ Document     │         │
│  │ - Copilots   │  │   Models     │  │ Processing   │         │
│  │ - Exa        │  │ - GDS Proj.  │  │              │         │
│  │ - Hedera     │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### **Key Insight: Testing UI, Not Production App**

This is **NOT** a production application. It's a **testing framework** where:
- Frontend = Rapid prototyping of use cases
- Backend = Production infrastructure being validated
- Goal = Make it easy to test if backend enhancements work for real use cases

---

## Solving the Vibe-Code Deployment Problem

### **Current Pain Points**

When non-developers Vibe-code frontends:

1. **Can't Deploy Easily**
   - Vibe generates local code
   - No clear deployment path
   - Hard to share with team

2. **Can't Collaborate**
   - Frontend in one person's Vibe environment
   - Backend team can't access to test
   - Iterations happen in silos

3. **Can't Test with Real Backend**
   - Frontend uses mock data or hardcoded values
   - Can't validate if use case actually works
   - Backend enhancements go untested

### **The Solution: Pluggable Backend Contract**

**Define a standard API contract that:**
1. ANY Vibe-coded frontend can connect to
2. Backend team implements once
3. Works for ALL future prototypes

**Benefits**:
```
Vibe-Code Frontend → Add .env config → Works with backend → Share with team
                        ↓
                   5 minutes setup
```

### **How It Works**

#### **Step 1: Non-Developer Vibe-Codes Frontend**
```
1. Build UI in Vibe (e.g., workflow builder)
2. Copy pluggable API client from template
3. Add .env with backend URL
4. Test locally
```

#### **Step 2: Deploy to Share**
```bash
# Simple deployment (Vercel/Netlify)
vercel deploy

# Or Docker
docker build -t frontend-prototype .
docker run -p 3000:3000 frontend-prototype

# Or zip and share
zip -r frontend.zip . && send to team
```

#### **Step 3: Backend Team Tests**
```bash
# Backend team receives frontend
git clone frontend-repo

# Add their backend URL
echo "NEXT_PUBLIC_API_URL=https://backend.company.com" > .env.local

# Run and test
npm run dev

# Frontend now uses PRODUCTION backend infrastructure
# Tests enhanced Graphiti, custom LangGraph, etc.
```

#### **Step 4: Iterate Based on Feedback**
```
Backend team: "Graphiti search works, but results are too broad"
  ↓
Non-dev updates UI to add filters
  ↓
Backend team retests with enhanced UI
  ↓
Cycle continues until use case validated
```

---

## Standard Backend API Contract

This is what backend team implements **once**, then ALL frontends can use:

### **Required Endpoints**

```
GET  /health
     → Returns: {status: "ok", services: ["mcp", "orchestrator", "graphiti"]}

GET  /api/config
     → Returns: Available services and their capabilities
     → Example: {mcp_servers: ["graphiti", "copilots"], features: ["langgraph", "langfuse"]}
```

### **MCP Tools** (`/mcp/*`)
```
GET  /mcp/servers
     → List available MCP servers

GET  /mcp/{server}/tools
     → List tools for a specific server

POST /mcp/{server}/tools/{tool_name}
     → Call a tool
     Body: {arguments: {...}}
```

### **LangGraph Orchestrator** (`/orchestrator/*`)
```
POST /orchestrator/sessions
     → Create new session
     Body: {initial_message: "..."}
     Returns: {session_id: "..."}

GET  /orchestrator/sessions/{session_id}/stream
     → Stream execution (SSE)
     Events: planning, execution, thinking, complete

POST /orchestrator/sessions/{session_id}/interrupt
     → Interrupt with new message
     Body: {message: "..."}

GET  /orchestrator/sessions/{session_id}/state
     → Get current state
```

### **Graphiti/Neo4j** (`/graphiti/*`)
```
POST /graphiti/search
     → Enhanced search with filters
     Body: {query: "...", filters: {...}}

GET  /graphiti/business-outcomes
     → Get business outcomes (Pydantic models)

POST /graphiti/query
     → Run custom Cypher
     Body: {cypher: "...", params: {...}}

POST /graphiti/documents/ingest
     → Ingest with chunking
     Body: {content: "...", filename: "...", chunk_size: 1000}
```

### **LangFuse Observability** (`/observability/*`)
```
GET  /observability/traces/{session_id}
     → Get traces for a session

GET  /observability/metrics
     → Get overall metrics
```

### **Documents** (`/documents/*`)
```
POST /documents/read
     → Read any document format
     Body: {file_path: "..."}

POST /documents/write
     → Write any format
     Body: {content: "...", format: "pdf|docx|markdown"}
```

---

## Frontend Template for Vibe-Coders

### **Pluggable API Client**

Drop this into ANY Vibe-coded frontend:

```typescript
// lib/backend-client.ts

class BackendClient {
  private baseUrl: string
  private availableServices: Set<string>

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    this.availableServices = new Set()
  }

  async init() {
    // Auto-discover available services
    try {
      const config = await this.fetch('/api/config')
      config.services.forEach(s => this.availableServices.add(s))
      console.log('✅ Connected to backend:', config)
    } catch (error) {
      console.warn('⚠️ Backend not available, using mock mode')
    }
  }

  // MCP Tools
  async callMCP(server: string, tool: string, args: any) {
    if (!this.availableServices.has('mcp')) {
      return this.mockResponse('mcp', {server, tool, args})
    }
    return this.fetch(`/mcp/${server}/tools/${tool}`, {
      method: 'POST',
      body: JSON.stringify(args)
    })
  }

  // LangGraph Orchestrator
  streamSession(sessionId: string, onEvent: (event: any) => void): () => void {
    if (!this.availableServices.has('orchestrator')) {
      return this.mockStream(onEvent)
    }
    const eventSource = new EventSource(`${this.baseUrl}/orchestrator/sessions/${sessionId}/stream`)
    eventSource.onmessage = (e) => onEvent(JSON.parse(e.data))
    return () => eventSource.close()
  }

  // Graphiti/Neo4j
  async searchGraphiti(query: string, filters?: any) {
    if (!this.availableServices.has('graphiti')) {
      return this.mockResponse('graphiti-search', {query, filters})
    }
    return this.fetch('/graphiti/search', {
      method: 'POST',
      body: JSON.stringify({query, filters})
    })
  }

  // Helper methods
  private async fetch(path: string, options?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })
    return response.json()
  }

  private mockResponse(feature: string, data: any) {
    console.log(`🔧 Mock response for ${feature}:`, data)
    return {status: 'mock', data}
  }

  private mockStream(onEvent: (event: any) => void): () => void {
    console.log('🔧 Using mock streaming')
    const interval = setInterval(() => {
      onEvent({type: 'mock', data: 'Mock stream event'})
    }, 1000)
    return () => clearInterval(interval)
  }
}

export const backend = new BackendClient()
```

### **Usage in Components**

```typescript
// components/WorkflowBuilder.tsx

import { backend } from '@/lib/backend-client'
import { useEffect, useState } from 'react'

export default function WorkflowBuilder() {
  const [results, setResults] = useState([])

  useEffect(() => {
    backend.init()  // Auto-discovers backend services
  }, [])

  const handleSearch = async (query: string) => {
    // Works whether backend is available or not
    const results = await backend.searchGraphiti(query, {
      min_score: 0.7,
      limit: 10
    })
    setResults(results)
  }

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {results.map(r => <div key={r.id}>{r.content}</div>)}
    </div>
  )
}
```

### **Configuration (.env.local)**

```bash
# Point to backend (can switch between local/staging/production)
NEXT_PUBLIC_API_URL=http://localhost:8000          # Local development
# NEXT_PUBLIC_API_URL=https://backend.company.com  # Production backend

# Feature flags (optional)
NEXT_PUBLIC_ENABLE_MOCK_MODE=false  # Fallback to mocks if backend unavailable
```

---

## Real-World Workflow Example

### **Scenario**: Testing Enhanced Graphiti Search

**Non-Developer (You)**:
```
1. Vibe-code a search UI
2. Add backend-client.ts (copy from template)
3. Create search component:
   - Input box for query
   - Filter controls (min_score, limit)
   - Results display

4. Test locally with mock data
5. Share with Misha-Dev: "Ready to test with real Graphiti"
```

**Misha-Dev (Backend Team)**:
```
1. Receives frontend code
2. Adds backend URL: NEXT_PUBLIC_API_URL=https://our-backend.com
3. Runs npm run dev
4. Tests search with REAL enhanced Graphiti
5. Provides feedback: "Search works! But we need better relevance scoring"
```

**Iteration**:
```
Non-Dev: Adds "min_score" slider to UI
  ↓
Shares update
  ↓
Misha tests with slider
  ↓
Confirms: "Perfect! Now users can control relevance threshold"
```

**Result**: Enhanced Graphiti validated with real use case, UI improved based on real testing.

---

## Component 1: MCP Proxy Service

**Purpose**: Frontend can call any MCP server without client-side complexity

### Implementation

```python
# backend-gateway/services/mcp_proxy.py

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import json
from typing import Dict, Any

class MCPProxy:
    """
    Proxy service that forwards frontend requests to MCP servers.
    Solves the Claude Agent SDK problem by using direct MCP client.
    """

    def __init__(self):
        self.servers = {
            "graphiti": {
                "command": "uv",
                "args": ["run", "graphiti_mcp_server.py"],
                "cwd": "/path/to/graphiti/mcp_server",
                "env": {
                    "NEO4J_URI": "...",
                    "NEO4J_USER": "...",
                    "NEO4J_PASSWORD": "...",
                    "OPENAI_API_KEY": "..."
                }
            },
            "copilots": {
                "command": "npx",
                "args": ["-y", "@blade-tech/copilots-mcp"],
                "env": {
                    "ANTHROPIC_API_KEY": "...",
                    "LANGFUSE_SECRET_KEY": "...",
                    "LANGFUSE_PUBLIC_KEY": "...",
                    "LANGFUSE_HOST": "..."
                }
            },
            "exa": {
                "command": "npx",
                "args": ["-y", "@exa/mcp-server"],
                "env": {
                    "EXA_API_KEY": "..."
                }
            },
            "hedera": {
                "command": "npx",
                "args": ["-y", "@hashgraph/hedera-mcp-server"],
                "env": {
                    "HEDERA_ACCOUNT_ID": "...",
                    "HEDERA_PRIVATE_KEY": "..."
                }
            }
        }
        self.active_sessions = {}

    async def connect(self, server_name: str) -> ClientSession:
        """Connect to MCP server if not already connected"""
        if server_name in self.active_sessions:
            return self.active_sessions[server_name]

        config = self.servers[server_name]
        server_params = StdioServerParameters(
            command=config["command"],
            args=config["args"],
            env=config.get("env", {})
        )

        # This is the working direct MCP client approach
        client_session = await stdio_client(server_params).__aenter__()
        self.active_sessions[server_name] = client_session
        return client_session

    async def call_tool(
        self,
        server_name: str,
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Call a specific tool on an MCP server.

        Frontend can call this via:
        POST /mcp/{server_name}/tools/{tool_name}
        Body: {arguments}
        """
        session = await self.connect(server_name)
        result = await session.call_tool(tool_name, arguments)
        return result.model_dump()

    async def list_tools(self, server_name: str) -> list:
        """Get available tools from a server"""
        session = await self.connect(server_name)
        tools = await session.list_tools()
        return [tool.model_dump() for tool in tools.tools]

    async def disconnect(self, server_name: str):
        """Clean up connection"""
        if server_name in self.active_sessions:
            await self.active_sessions[server_name].__aexit__(None, None, None)
            del self.active_sessions[server_name]

# FastAPI endpoints
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/mcp", tags=["mcp"])
proxy = MCPProxy()

@router.get("/{server_name}/tools")
async def list_tools(server_name: str):
    """List available tools for a server"""
    try:
        return await proxy.list_tools(server_name)
    except Exception as e:
        raise HTTPException(500, f"Failed to list tools: {str(e)}")

@router.post("/{server_name}/tools/{tool_name}")
async def call_tool(server_name: str, tool_name: str, arguments: dict):
    """Call a specific MCP tool"""
    try:
        return await proxy.call_tool(server_name, tool_name, arguments)
    except Exception as e:
        raise HTTPException(500, f"Tool call failed: {str(e)}")

@router.post("/{server_name}/disconnect")
async def disconnect(server_name: str):
    """Disconnect from MCP server"""
    await proxy.disconnect(server_name)
    return {"status": "disconnected"}
```

### Frontend Usage

```typescript
// src/lib/mcp-client.ts

export class MCPClient {
  constructor(private baseUrl: string = process.env.NEXT_PUBLIC_API_URL!) {}

  async listTools(serverName: 'graphiti' | 'copilots' | 'exa' | 'hedera') {
    const response = await fetch(`${this.baseUrl}/mcp/${serverName}/tools`)
    return response.json()
  }

  async callTool(
    serverName: string,
    toolName: string,
    arguments: Record<string, any>
  ) {
    const response = await fetch(
      `${this.baseUrl}/mcp/${serverName}/tools/${toolName}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arguments)
      }
    )
    return response.json()
  }

  // Specific tool helpers
  async searchGraphiti(query: string, groupIds?: string[]) {
    return this.callTool('graphiti', 'mcp__blade-graphiti__search', {
      query,
      group_ids: groupIds
    })
  }

  async askCopilot(copilot: 'ceo' | 'cto' | 'coo' | 'sco', query: string) {
    return this.callTool('copilots', `ask-${copilot}`, { query })
  }

  async searchWeb(query: string, numResults: number = 5) {
    return this.callTool('exa', 'web_search_exa', { query, numResults })
  }
}

// Usage in components
const mcp = new MCPClient()

// Search Graphiti
const results = await mcp.searchGraphiti('Murabaha profit sharing', ['aaoifi-documents'])

// Ask SCO copilot
const advice = await mcp.askCopilot('sco', 'Is this structure Sharia compliant?')

// Web search
const research = await mcp.searchWeb('AAOIFI FAS 2 latest updates')
```

---

## Component 2: LangGraph Orchestrator

**Purpose**: Replace Claude Agent SDK with your own LangGraph orchestrator

### Implementation

```python
# backend-gateway/services/langgraph_orchestrator.py

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
import operator

class OrchestratorState(TypedDict):
    """State for LangGraph orchestrator"""
    messages: Annotated[Sequence[BaseMessage], operator.add]
    session_id: str
    current_plan: list[dict]
    completed_tasks: list[str]
    pending_tasks: list[str]
    context: dict  # Graphiti context, uploaded docs, etc.
    interrupt_requested: bool

class LangGraphOrchestrator:
    """
    Multi-turn conversation orchestrator with planning and interrupts.
    Replaces Claude Agent SDK.
    """

    def __init__(self, mcp_proxy: MCPProxy):
        self.mcp_proxy = mcp_proxy
        self.memory = MemorySaver()
        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        """Build LangGraph workflow"""
        workflow = StateGraph(OrchestratorState)

        # Nodes
        workflow.add_node("planner", self._plan_node)
        workflow.add_node("executor", self._execute_node)
        workflow.add_node("validator", self._validate_node)
        workflow.add_node("learner", self._learn_node)

        # Edges
        workflow.set_entry_point("planner")
        workflow.add_edge("planner", "executor")
        workflow.add_conditional_edges(
            "executor",
            self._should_validate,
            {
                "validate": "validator",
                "continue": "executor",
                "complete": END
            }
        )
        workflow.add_edge("validator", "learner")
        workflow.add_edge("learner", END)

        return workflow.compile(checkpointer=self.memory)

    async def _plan_node(self, state: OrchestratorState) -> dict:
        """
        Planning node - breaks down user request into tasks.
        Uses Claude + Graphiti search for context.
        """
        # Get context from Graphiti
        context_results = await self.mcp_proxy.call_tool(
            "graphiti",
            "mcp__blade-graphiti__search",
            {"query": state["messages"][-1].content}
        )

        # Create plan using Claude
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic()

        response = await client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4000,
            messages=[
                {
                    "role": "user",
                    "content": f"""Create a plan for this request:

                    User request: {state["messages"][-1].content}

                    Available context from knowledge graph:
                    {context_results}

                    Break this down into executable tasks.
                    Format: JSON array of {{"task": "...", "type": "search|generate|validate"}}
                    """
                }
            ]
        )

        # Parse plan
        import json
        plan = json.loads(response.content[0].text)

        return {
            "current_plan": plan,
            "pending_tasks": [task["task"] for task in plan],
            "context": {"graphiti_results": context_results}
        }

    async def _execute_node(self, state: OrchestratorState) -> dict:
        """
        Execution node - executes tasks one by one.
        Can be interrupted by user.
        """
        if state.get("interrupt_requested"):
            # User interrupted - pause and wait for new message
            return {"interrupt_requested": False}

        if not state["pending_tasks"]:
            return {}  # No more tasks

        # Execute next task
        task = state["pending_tasks"][0]

        # Use appropriate MCP tool based on task type
        # (Graphiti search, Copilot consultation, etc.)

        result = await self._execute_task(task, state)

        return {
            "completed_tasks": [task],
            "pending_tasks": state["pending_tasks"][1:],
            "messages": [AIMessage(content=result)]
        }

    async def _execute_task(self, task: str, state: OrchestratorState) -> str:
        """Execute a single task using MCP tools"""
        # Determine which MCP tool to use
        # Call tool via proxy
        # Return result
        pass

    async def _validate_node(self, state: OrchestratorState) -> dict:
        """Validation node - checks if output meets requirements"""
        # Validate against AAOIFI standards
        # Use Graphiti to verify citations
        pass

    async def _learn_node(self, state: OrchestratorState) -> dict:
        """Learning node - extracts patterns for future workflows"""
        # Analyze conversation
        # Extract learnings
        # Ingest back to Graphiti
        pass

    def _should_validate(self, state: OrchestratorState) -> str:
        """Decide next step after execution"""
        if state.get("interrupt_requested"):
            return "continue"
        if not state["pending_tasks"]:
            return "complete"
        return "validate"

    async def stream_conversation(
        self,
        session_id: str,
        user_message: str
    ) -> AsyncIterator[dict]:
        """
        Stream conversation with interrupts.

        Frontend calls this endpoint to start/continue conversation.
        """
        config = {"configurable": {"thread_id": session_id}}

        # Add user message
        input_state = {
            "messages": [HumanMessage(content=user_message)],
            "session_id": session_id
        }

        # Stream execution
        async for event in self.graph.astream(input_state, config):
            yield {
                "type": "state_update",
                "data": event
            }

    async def interrupt(self, session_id: str, user_message: str):
        """
        Handle user interrupt mid-execution.

        Frontend calls this to interrupt and add new guidance.
        """
        # Get current state
        config = {"configurable": {"thread_id": session_id}}
        current_state = await self.graph.aget_state(config)

        # Update state with interrupt
        await self.graph.aupdate_state(
            config,
            {
                "interrupt_requested": True,
                "messages": [HumanMessage(content=user_message)]
            }
        )

# FastAPI endpoints
router = APIRouter(prefix="/orchestrator", tags=["orchestrator"])
orchestrator = LangGraphOrchestrator(proxy)

@router.post("/sessions/{session_id}/stream")
async def stream_conversation(session_id: str, message: str):
    """Stream conversation with LangGraph orchestrator"""
    async def event_generator():
        async for event in orchestrator.stream_conversation(session_id, message):
            yield f"data: {json.dumps(event)}\n\n"

    return EventSourceResponse(event_generator())

@router.post("/sessions/{session_id}/interrupt")
async def interrupt(session_id: str, message: str):
    """Interrupt current execution with new message"""
    await orchestrator.interrupt(session_id, message)
    return {"status": "interrupted"}
```

### Frontend Usage

```typescript
// src/lib/orchestrator-client.ts

export class OrchestratorClient {
  constructor(private baseUrl: string = process.env.NEXT_PUBLIC_API_URL!) {}

  streamConversation(
    sessionId: string,
    message: string,
    onEvent: (event: any) => void
  ): () => void {
    const eventSource = new EventSource(
      `${this.baseUrl}/orchestrator/sessions/${sessionId}/stream?message=${encodeURIComponent(message)}`
    )

    eventSource.addEventListener('state_update', (e) => {
      const event = JSON.parse(e.data)
      onEvent(event)
    })

    // Return cleanup function
    return () => eventSource.close()
  }

  async interrupt(sessionId: string, message: string) {
    await fetch(`${this.baseUrl}/orchestrator/sessions/${sessionId}/interrupt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
  }
}

// Usage in components
const orchestrator = new OrchestratorClient()

// Start conversation
const cleanup = orchestrator.streamConversation(
  sessionId,
  'Help me structure a Murabaha Sukuk',
  (event) => {
    if (event.type === 'state_update') {
      setMessages(prev => [...prev, event.data.messages])
    }
  }
)

// Interrupt
await orchestrator.interrupt(sessionId, 'Wait, focus on profit-sharing')
```

---

## Component 3: Neo4j/Graphiti Direct Access

**Purpose**: Read/write to Neo4j directly for advanced queries

### Implementation

```python
# backend-gateway/services/neo4j_service.py

from neo4j import AsyncGraphDatabase
from typing import List, Dict, Any

class Neo4jService:
    """
    Direct Neo4j access for:
    - Advanced Cypher queries
    - GDS projections
    - Batch operations
    - Custom analytics
    """

    def __init__(self):
        self.driver = AsyncGraphDatabase.driver(
            uri=os.getenv("NEO4J_URI"),
            auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
        )

    async def run_query(self, cypher: str, params: dict = None) -> List[Dict]:
        """Execute raw Cypher query"""
        async with self.driver.session() as session:
            result = await session.run(cypher, params or {})
            return [record.data() async for record in result]

    async def get_business_outcomes(self, filters: dict = None) -> List[Dict]:
        """
        Get business outcomes using Pydantic model structure.
        Solves problem #4 from your list.
        """
        cypher = """
        MATCH (bo:BusinessOutcome)
        OPTIONAL MATCH (bo)-[:HAS_TASK]->(bt:BusinessTask)
        OPTIONAL MATCH (bo)-[:HAS_DECISION]->(bd:BusinessDecision)
        RETURN bo, collect(DISTINCT bt) as tasks, collect(DISTINCT bd) as decisions
        """
        return await self.run_query(cypher, filters)

    async def create_gds_projection(
        self,
        projection_name: str,
        node_labels: List[str],
        relationship_types: List[str]
    ):
        """
        Create GDS projection for use-case specific graphs.
        Solves problem #4 from your list.
        """
        cypher = f"""
        CALL gds.graph.project(
            '{projection_name}',
            {node_labels},
            {relationship_types}
        )
        YIELD graphName, nodeCount, relationshipCount
        RETURN graphName, nodeCount, relationshipCount
        """
        return await self.run_query(cypher)

    async def search_with_filters(
        self,
        query: str,
        filters: Dict[str, Any]
    ) -> List[Dict]:
        """
        Better Graphiti search with filters.
        Solves problem #5 from your list.
        """
        # Use both semantic search AND Cypher filters
        cypher = """
        CALL db.index.fulltext.queryNodes('episodeContent', $query)
        YIELD node, score
        WHERE
            ($groupId IS NULL OR node.group_id = $groupId)
            AND ($minScore IS NULL OR score >= $minScore)
        RETURN node, score
        ORDER BY score DESC
        LIMIT $limit
        """

        return await self.run_query(cypher, {
            "query": query,
            "groupId": filters.get("group_id"),
            "minScore": filters.get("min_score", 0.5),
            "limit": filters.get("limit", 10)
        })

    async def chunk_and_ingest_document(
        self,
        content: str,
        filename: str,
        group_id: str,
        chunk_size: int = 1000
    ) -> List[str]:
        """
        Chunk large documents before ingestion.
        Solves problem #6 from your list.
        """
        # Simple chunking by paragraphs or character count
        chunks = self._chunk_text(content, chunk_size)

        episode_ids = []
        for i, chunk in enumerate(chunks):
            # Create episode for each chunk
            cypher = """
            CREATE (e:Episodic {
                uuid: randomUUID(),
                name: $name,
                content: $content,
                group_id: $group_id,
                chunk_index: $chunk_index,
                created_at: datetime()
            })
            RETURN e.uuid as episode_id
            """

            result = await self.run_query(cypher, {
                "name": f"{filename} - Chunk {i+1}/{len(chunks)}",
                "content": chunk,
                "group_id": group_id,
                "chunk_index": i
            })

            episode_ids.append(result[0]["episode_id"])

        return episode_ids

    def _chunk_text(self, text: str, chunk_size: int) -> List[str]:
        """Smart text chunking preserving paragraphs"""
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            if len(current_chunk) + len(para) > chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = para
            else:
                current_chunk += "\n\n" + para if current_chunk else para

        if current_chunk:
            chunks.append(current_chunk)

        return chunks

# FastAPI endpoints
router = APIRouter(prefix="/graphiti", tags=["graphiti"])
neo4j = Neo4jService()

@router.post("/query")
async def run_query(cypher: str, params: dict = None):
    """Execute custom Cypher query"""
    return await neo4j.run_query(cypher, params)

@router.get("/business-outcomes")
async def get_business_outcomes(filters: dict = None):
    """Get business outcomes with tasks and decisions"""
    return await neo4j.get_business_outcomes(filters)

@router.post("/projections")
async def create_projection(
    name: str,
    node_labels: List[str],
    relationship_types: List[str]
):
    """Create GDS projection"""
    return await neo4j.create_gds_projection(name, node_labels, relationship_types)

@router.post("/search")
async def search(query: str, filters: dict = None):
    """Enhanced search with filters"""
    return await neo4j.search_with_filters(query, filters or {})

@router.post("/documents/ingest")
async def ingest_document(
    content: str,
    filename: str,
    group_id: str,
    chunk_size: int = 1000
):
    """Ingest document with automatic chunking"""
    episode_ids = await neo4j.chunk_and_ingest_document(
        content, filename, group_id, chunk_size
    )
    return {"episode_ids": episode_ids, "chunk_count": len(episode_ids)}
```

---

## Component 4: Document Service

**Purpose**: Universal document read/write capabilities

### Implementation

```python
# backend-gateway/services/document_service.py

from pathlib import Path
import PyPDF2
from docx import Document
import subprocess

class DocumentService:
    """
    Universal document service for:
    - Reading any document format
    - Writing to any format
    - Converting between formats
    """

    async def read_document(self, file_path: str) -> str:
        """Read any document format"""
        path = Path(file_path)

        if path.suffix == '.pdf':
            return self._read_pdf(path)
        elif path.suffix in ['.docx', '.doc']:
            return self._read_docx(path)
        elif path.suffix in ['.txt', '.md']:
            return path.read_text()
        else:
            raise ValueError(f"Unsupported format: {path.suffix}")

    def _read_pdf(self, path: Path) -> str:
        """Extract text from PDF"""
        with open(path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            return "\n\n".join(
                page.extract_text()
                for page in reader.pages
            )

    def _read_docx(self, path: Path) -> str:
        """Extract text from DOCX"""
        doc = Document(path)
        return "\n\n".join(para.text for para in doc.paragraphs)

    async def write_document(
        self,
        content: str,
        output_path: str,
        format: str = 'markdown'
    ):
        """Write content to any format"""
        if format == 'markdown':
            Path(output_path).write_text(content)
        else:
            # Use Pandoc for conversion
            self._convert_with_pandoc(content, output_path, format)

    def _convert_with_pandoc(
        self,
        content: str,
        output_path: str,
        format: str
    ):
        """Convert markdown to any format using Pandoc"""
        import tempfile

        # Write temp markdown
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(content)
            temp_md = f.name

        # Convert
        subprocess.run([
            'pandoc',
            temp_md,
            '-o', output_path,
            '--standalone'
        ], check=True)

        # Cleanup
        Path(temp_md).unlink()

# FastAPI endpoints
router = APIRouter(prefix="/documents", tags=["documents"])
docs = DocumentService()

@router.post("/read")
async def read_document(file_path: str):
    """Read any document format"""
    content = await docs.read_document(file_path)
    return {"content": content}

@router.post("/write")
async def write_document(
    content: str,
    output_path: str,
    format: str = 'markdown'
):
    """Write content to any format"""
    await docs.write_document(content, output_path, format)
    return {"output_path": output_path}
```

---

## Configuration-Driven Frontend

**Purpose**: Frontend can switch between backend services via config

### Environment Configuration

```bash
# .env.local

# API Gateway
NEXT_PUBLIC_API_URL=http://localhost:8000

# Service-specific endpoints (optional overrides)
NEXT_PUBLIC_MCP_PROXY_URL=http://localhost:8001
NEXT_PUBLIC_ORCHESTRATOR_URL=http://localhost:8002
NEXT_PUBLIC_NEO4J_SERVICE_URL=http://localhost:8003
NEXT_PUBLIC_DOCUMENT_SERVICE_URL=http://localhost:8004

# Feature flags
NEXT_PUBLIC_USE_LANGGRAPH=true
NEXT_PUBLIC_USE_CLAUDE_AGENT_SDK=false
NEXT_PUBLIC_ENABLE_DIRECT_NEO4J=true
```

### Service Registry

```typescript
// src/lib/service-registry.ts

export const services = {
  mcp: {
    baseUrl: process.env.NEXT_PUBLIC_MCP_PROXY_URL ||
             `${process.env.NEXT_PUBLIC_API_URL}/mcp`,
    servers: ['graphiti', 'copilots', 'exa', 'hedera']
  },

  orchestrator: {
    baseUrl: process.env.NEXT_PUBLIC_ORCHESTRATOR_URL ||
             `${process.env.NEXT_PUBLIC_API_URL}/orchestrator`,
    enabled: process.env.NEXT_PUBLIC_USE_LANGGRAPH === 'true'
  },

  neo4j: {
    baseUrl: process.env.NEXT_PUBLIC_NEO4J_SERVICE_URL ||
             `${process.env.NEXT_PUBLIC_API_URL}/graphiti`,
    directAccess: process.env.NEXT_PUBLIC_ENABLE_DIRECT_NEO4J === 'true'
  },

  documents: {
    baseUrl: process.env.NEXT_PUBLIC_DOCUMENT_SERVICE_URL ||
             `${process.env.NEXT_PUBLIC_API_URL}/documents`
  }
}
```

---

## Testing Individual Components

### Test MCP Servers

```typescript
// src/__tests__/mcp-integration.test.ts

import { MCPClient } from '@/lib/mcp-client'

describe('MCP Server Integration', () => {
  const mcp = new MCPClient()

  test('can list Graphiti tools', async () => {
    const tools = await mcp.listTools('graphiti')
    expect(tools).toContainEqual(
      expect.objectContaining({ name: 'mcp__blade-graphiti__search' })
    )
  })

  test('can search Graphiti', async () => {
    const results = await mcp.searchGraphiti('Murabaha', ['aaoifi-documents'])
    expect(results.status).toBe('success')
    expect(results.facts).toBeDefined()
  })

  test('can ask SCO copilot', async () => {
    const advice = await mcp.askCopilot('sco', 'Is profit-sharing compliant?')
    expect(advice).toHaveProperty('response')
  })
})
```

### Test Neo4j Direct Access

```typescript
// src/__tests__/neo4j-integration.test.ts

import { Neo4jClient } from '@/lib/neo4j-client'

describe('Neo4j Direct Access', () => {
  const neo4j = new Neo4jClient()

  test('can run custom Cypher query', async () => {
    const result = await neo4j.runQuery(
      'MATCH (n:BusinessOutcome) RETURN count(n) as count'
    )
    expect(result[0].count).toBeGreaterThan(0)
  })

  test('can create GDS projection', async () => {
    const projection = await neo4j.createProjection(
      'test-projection',
      ['BusinessOutcome', 'BusinessTask'],
      ['HAS_TASK']
    )
    expect(projection.graphName).toBe('test-projection')
  })

  test('can chunk and ingest document', async () => {
    const result = await neo4j.ingestDocument(
      'Large AAOIFI document content...',
      'aaoifi-fas-2.pdf',
      'aaoifi-documents',
      1000  // chunk size
    )
    expect(result.chunk_count).toBeGreaterThan(1)
  })
})
```

---

## Deployment Strategy

### API Gateway (Single Service)

```yaml
# docker-compose.yml

version: '3.8'

services:
  api-gateway:
    build: ./backend-gateway
    ports:
      - "8000:8000"
    environment:
      # MCP Server paths (your existing infrastructure)
      GRAPHITI_MCP_PATH: /path/to/graphiti/mcp_server
      COPILOTS_MCP_PATH: /path/to/copilots-mcp

      # Neo4j (your existing AuraDB)
      NEO4J_URI: ${NEO4J_URI}
      NEO4J_USER: ${NEO4J_USER}
      NEO4J_PASSWORD: ${NEO4J_PASSWORD}

      # APIs
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      LANGFUSE_SECRET_KEY: ${LANGFUSE_SECRET_KEY}
    volumes:
      - ./backend-gateway:/app
      - /path/to/your/mcp/servers:/mcp-servers  # Mount existing MCP servers

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://api-gateway:8000
    depends_on:
      - api-gateway
```

---

## Migration Path

### Phase 1: Set Up API Gateway (1 day)

```bash
# Create minimal gateway
mkdir backend-gateway
cd backend-gateway

# Install dependencies
cat > requirements.txt <<EOF
fastapi
uvicorn
mcp
anthropic
neo4j
PyPDF2
python-docx
python-multipart
EOF

pip install -r requirements.txt

# Create main.py
cat > main.py <<EOF
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Islamic Finance API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers (from code above)
from services.mcp_proxy import router as mcp_router
from services.langgraph_orchestrator import router as orchestrator_router
from services.neo4j_service import router as neo4j_router
from services.document_service import router as document_router

app.include_router(mcp_router)
app.include_router(orchestrator_router)
app.include_router(neo4j_router)
app.include_router(document_router)

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# Run gateway
python main.py
```

### Phase 2: Update Frontend Config (30 minutes)

```bash
# Update .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" >> .env.local

# Test connection
curl http://localhost:8000/health
curl http://localhost:8000/mcp/graphiti/tools
```

### Phase 3: Test Individual Components (2 hours)

```bash
# Test MCP Proxy
curl -X POST http://localhost:8000/mcp/graphiti/tools/mcp__blade-graphiti__search \
  -H "Content-Type: application/json" \
  -d '{"query": "Murabaha", "group_ids": ["aaoifi-documents"]}'

# Test Neo4j Direct
curl -X POST http://localhost:8000/graphiti/query \
  -H "Content-Type: application/json" \
  -d '{"cypher": "MATCH (n:BusinessOutcome) RETURN count(n)"}'

# Test Document Service
curl -X POST http://localhost:8000/documents/read \
  -H "Content-Type: application/json" \
  -d '{"file_path": "/path/to/aaoifi.pdf"}'
```

### Phase 4: Integrate Frontend (4 hours)

Update frontend components to use new service clients.

---

## Benefits of This Approach

✅ **No More Debug Cycles**: Use your existing, working infrastructure
✅ **Component Isolation**: Test each service independently
✅ **No Claude Agent SDK**: Use direct MCP client (works) or LangGraph
✅ **Reuse Existing Solutions**: Leverage what you've already built
✅ **Easy Swapping**: Change backend services via config
✅ **Better Graphiti Search**: Direct Neo4j queries + filters
✅ **Proper Document Chunking**: Automatic chunking before ingestion
✅ **GDS Projections**: Use Neo4j Graph Data Science
✅ **Universal Documents**: Read/write any format

---

## Next Steps

1. **Copy service implementations** from this document
2. **Create API gateway** (minimal FastAPI app)
3. **Configure environment** (point to your existing infrastructure)
4. **Test endpoints individually** (curl/Postman)
5. **Update frontend** (use new service clients)
6. **Deploy** (Docker Compose or Railway)

Your developers can now **plug your Vibe-coded frontend into existing backend components** without rebuilding what already works.
