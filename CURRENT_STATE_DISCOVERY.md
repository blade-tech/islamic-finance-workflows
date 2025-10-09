# Current State Discovery Report
**Date**: 2025-10-09
**Purpose**: Understand existing backend infrastructure to build pluggable architecture
**Repositories Analyzed**:
- https://github.com/Blade-Labs/graphiti-server
- https://github.com/Blade-Labs/blade-ai-server

---

## Executive Summary

The Blade-Labs organization currently has **TWO separate backend servers** that provide complementary functionality:

1. **graphiti-server** (Python/FastAPI) - Graphiti knowledge graph service with REST API + MCP server
2. **blade-ai-server** (NestJS/TypeScript) - Multi-agent AI orchestration with LangGraph + MCP tools

**Key Finding**: We have most of the required backend infrastructure already built, but it's distributed across two separate services. The main work will be **integrating and exposing these services through a unified gateway** that the frontend can discover and connect to.

---

## 1. Graphiti-Server Analysis

### Technology Stack
- **Framework**: FastAPI (Python 3.12+)
- **MCP Integration**: FastMCP with HTTP transport
- **Database**: Neo4j (via Graphiti)
- **Port**: 8000 (default)
- **Deployment**: Docker, docker-compose

### Architecture
```
graphiti-server/
├── app/
│   ├── main.py              # Unified entry point (REST + MCP)
│   ├── api/main.py          # REST route definitions
│   ├── mcp/main.py          # MCP tool definitions
│   ├── services/            # Graphiti service layer (singleton)
│   ├── models/              # Pydantic models
│   └── utils/               # Formatters, helpers
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

### REST API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Root endpoint info |
| `/health` | GET | Health check + Neo4j connection status |
| `/search` | POST | Search knowledge graph with filters |
| `/add-episode` | POST | Add single episode to graph |
| `/add-episodes-bulk` | POST | Bulk add multiple episodes |
| `/delete-episode` | POST | Delete episode by UUID |
| `/get-edge` | POST | Get edge by UUID |
| `/debug/nodes` | POST | View recent nodes for debugging |
| `/build-indices` | POST | Build Neo4j indices (one-time setup) |

### MCP Tools (at `/mcp` endpoint)

| Tool | Purpose |
|------|---------|
| `search` | Hybrid semantic search (embeddings + keywords + graph) |
| `add_episode` | Add single episode with full control |
| `add_episodes_bulk` | Batch add episodes efficiently |
| `delete_episode` | Remove episode by UUID |
| `get_recent_nodes` | Debug/explore recent nodes |

### Key Features
✅ **Enhanced Search**: Supports group_ids, center_node_uuid, search_filter, num_results
✅ **Temporal Filtering**: Filter by created_at, valid_at, expired_at
✅ **Node Type Filtering**: Filter by node_labels, edge_types
✅ **Bulk Operations**: Efficient batch processing
✅ **MCP + REST**: Dual interface (both run in same process)
✅ **Auto-chunking**: Support for different episode types (text, message, json)

### Environment Variables
```bash
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PSWD=password
OPENAI_API_KEY=sk-...
SEMAPHORE_LIMIT=5  # Controls concurrent LLM operations
```

---

## 2. Blade-AI-Server Analysis

### Technology Stack
- **Framework**: NestJS (Node.js/TypeScript)
- **AI Orchestration**: LangGraph + LangChain
- **Agents**: 9 specialized AI agents (CEO, CTO, COO, CMO, CLO, CCO, PE, PM, SCO)
- **MCP Integration**: @modelcontextprotocol/sdk
- **Observability**: LangFuse integration
- **Port**: 3000 (default)
- **Additional**: Slack integration, Google Drive sync

### Architecture
```
blade-ai-server/
├── src/
│   ├── main.ts                    # NestJS bootstrap
│   ├── app.module.ts              # Root module
│   ├── agent/                     # Multi-agent system
│   │   ├── base.agent.ts          # Base agent class
│   │   ├── ceo/, cto/, coo/...    # Specialized agents
│   │   ├── flows/                 # LangGraph workflows
│   │   └── workflows/             # Agent orchestration
│   ├── graphiti/                  # Graphiti client
│   │   ├── graphiti-api.service.ts
│   │   └── graphiti-ingest.service.ts
│   ├── mcp-server/                # MCP server module
│   │   ├── mcp-server.service.ts
│   │   └── tools/                 # MCP tool implementations
│   ├── integration/               # External integrations
│   ├── knowledge-base/            # Pinecone vector DB
│   └── thread-memory/             # Conversation memory
├── langgraph.json                 # LangGraph config
├── package.json
└── Dockerfile
```

### Multi-Agent System

**9 Specialized Agents**:
1. **CEO** - Strategic leadership guidance
2. **CTO** - Technology strategy and architecture
3. **COO** - Operational excellence
4. **CMO** - Marketing strategy
5. **CLO** - Legal strategy and compliance
6. **CCO** - Compliance and governance
7. **PE** - Prompt Engineering (uses Langfuse data)
8. **PM** - Project management
9. **SCO** - Shariah Compliance Officer (Islamic finance)

### Graphiti Integration

**GraphitiApiService** calls graphiti-server REST API:
- `search(query, groupIds)` → `/search`
- `addEpisode(request)` → `/add-episode`
- `deleteEpisode(request)` → `/delete-episode`
- `getEntityEdge(request)` → `/get-entity-edge`
- `checkHealth()` → `/health`

**Features**:
- Axios client with retry logic (3 retries)
- 3-minute timeout for long operations
- Automatic retry on 5xx errors
- Health check on module initialization

### MCP Server Module

**Location**: `src/mcp-server/`
- MCP HTTP endpoint at `/mcp`
- Auth guard for MCP requests
- Tool registry system
- Custom MCP tool implementations

### LangGraph Integration

**Configuration** (langgraph.json):
```json
{
  "node_version": "20",
  "graphs": {
    "co-ceo": "./src/agent/agents/base.agent.test.ts:getTestGraph"
  },
  "env": "./.env"
}
```

**Start Command**: `npm run start:langgraph` → Runs LangGraph Studio local server

### LangFuse Observability

**Files**: `src/langfuse.ts`
- Automatic tracing of AI conversations
- Performance metrics
- Token usage tracking
- Prompt version tracking (for PE agent)

### Environment Variables
```bash
# Core
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
NEO4J_URI=
NEO4J_USER=
NEO4J_PSWD=

# LangFuse
LANGFUSE_SECRET_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_BASEURL=

# Graphiti
GRAPHITI_API_URL=http://localhost:8000

# MCP Server
MCP_SERVER_NAME=copilots
MCP_SERVER_AUTH_TOKEN=

# Slack
SLACK_CEO_APP_ID=
SLACK_CEO_CLIENT_ID=
SLACK_CEO_SIGNING_SECRET=

# Vector DBs
PINECONE_API_KEY=
PINECONE_ORG_KB_INDEX=
PINECONE_GENERAL_KB_INDEX=
```

---

## 3. Service Mapping to Required Architecture

Comparing current state to the 5 required backend services from `BACKEND_SERVICE_CONNECTORS_PLAN.md`:

### ✅ Service 1: MCP Proxy (`/mcp/*`)

**Status**: **PARTIALLY IMPLEMENTED** across both servers

**What Exists**:
- **graphiti-server**: MCP server at `/mcp` with 5 tools (search, add_episode, etc.)
- **blade-ai-server**: MCP server module at `/mcp` with custom tools

**What's Missing**:
- ❌ Unified MCP proxy that routes to multiple MCP servers
- ❌ `/mcp/servers` endpoint to list available servers
- ❌ `/mcp/{server}/tools` endpoint to list tools per server
- ❌ `/mcp/{server}/tools/{tool_name}` endpoint to call specific tools
- ❌ Integration with Copilots MCP, Exa MCP, Hedera MCP

**Gap**: Need a **gateway layer** that:
- Exposes unified MCP proxy endpoints
- Routes to graphiti-server MCP and blade-ai-server MCP
- Can connect to additional MCP servers (Copilots, Exa, Hedera)

---

### ✅ Service 2: LangGraph Orchestrator (`/orchestrator/*`)

**Status**: **IMPLEMENTED** in blade-ai-server

**What Exists**:
- ✅ LangGraph integration with 9 specialized agents
- ✅ Multi-turn conversation orchestration
- ✅ Agent workflows and flows
- ✅ LangGraph Studio support (`npm run start:langgraph`)

**What's Missing**:
- ❌ REST endpoints for session management:
  - `POST /orchestrator/sessions` - Create session
  - `GET /orchestrator/sessions/{id}/stream` - Stream execution (SSE)
  - `POST /orchestrator/sessions/{id}/interrupt` - Human interrupt
  - `GET /orchestrator/sessions/{id}/state` - Get state

**Gap**: Need to **wrap existing LangGraph implementation** in REST endpoints with SSE streaming.

---

### ✅ Service 3: Graphiti/Neo4j Service (`/graphiti/*`)

**Status**: **FULLY IMPLEMENTED** in graphiti-server

**What Exists**:
- ✅ `/search` - Enhanced search with filters ✅
- ✅ `/add-episode` - Add episodes ✅
- ✅ `/add-episodes-bulk` - Bulk operations ✅
- ✅ `/delete-episode` - Episode management ✅
- ✅ `/get-edge` - Entity edge retrieval ✅
- ✅ `/debug/nodes` - Node exploration ✅
- ✅ Group ID support for namespacing ✅
- ✅ Temporal filtering ✅
- ✅ Node/edge type filtering ✅

**What's Missing**:
- ⚠️ `/graphiti/business-outcomes` - Query business outcomes (Pydantic models)
- ⚠️ `/graphiti/query` - Run custom Cypher queries
- ⚠️ `/graphiti/documents/ingest` - Document chunking & ingestion

**Gap**: Minor - need to add **3 additional endpoints** for custom Cypher, Pydantic models, and document ingestion.

---

### ❌ Service 4: Document Service (`/documents/*`)

**Status**: **NOT IMPLEMENTED**

**What Exists**:
- ❌ No document read/write service

**What's Missing**:
- ❌ `POST /documents/read` - Read PDF/DOCX/Markdown
- ❌ `POST /documents/write` - Write any format

**Gap**: Need to **build document service** from scratch (can use libraries like mammoth, pdf-parse mentioned in blade-ai-server dependencies).

---

### ✅ Service 5: LangFuse Observability (`/observability/*`)

**Status**: **IMPLEMENTED** in blade-ai-server

**What Exists**:
- ✅ LangFuse integration (`src/langfuse.ts`)
- ✅ Automatic tracing
- ✅ Metrics collection
- ✅ PE agent uses Langfuse data

**What's Missing**:
- ❌ REST endpoints to expose traces:
  - `GET /observability/traces/{session_id}` - Get traces
  - `GET /observability/metrics` - Overall metrics

**Gap**: Need to **expose existing LangFuse data** via REST endpoints.

---

## 4. Gap Analysis Summary

### Services Ready to Use (70%)
✅ **Graphiti/Neo4j** - 90% complete (just need 3 more endpoints)
✅ **LangGraph Orchestration** - 80% complete (just need REST wrapper)
✅ **MCP Integration** - 60% complete (have MCP servers, need proxy)
✅ **LangFuse Observability** - 70% complete (have integration, need endpoints)

### Services to Build (30%)
❌ **Document Service** - 0% complete (need to build)
❌ **Unified MCP Proxy** - 0% complete (need gateway layer)
❌ **REST wrappers** - Need for LangGraph and LangFuse

### Overall Status: **70% COMPLETE**

---

## 5. Architecture Recommendations

### Option A: Unified Gateway (Recommended)

Create a **new API gateway** that sits in front of both servers:

```
┌─────────────────────────────────────────────┐
│  Frontend (Islamic Finance Workflows)       │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────▼────────┐
         │  API Gateway    │  ← NEW (FastAPI or NestJS)
         │  Port: 8080     │
         └────────┬────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────┐        ┌──────▼──────┐
│ graphiti-  │        │ blade-ai-   │
│ server     │        │ server      │
│ :8000      │        │ :3000       │
└────────────┘        └─────────────┘
```

**Gateway Responsibilities**:
- `/health` - Aggregate health from both services
- `/api/config` - Service discovery
- `/mcp/*` - Unified MCP proxy (route to both servers + external MCPs)
- `/orchestrator/*` - Proxy to blade-ai-server LangGraph endpoints
- `/graphiti/*` - Proxy to graphiti-server
- `/documents/*` - New document service
- `/observability/*` - Proxy to blade-ai-server LangFuse endpoints

**Benefits**:
✅ Single URL for frontend
✅ Clean separation of concerns
✅ Easy to add new services
✅ Can implement in either Python (FastAPI) or TypeScript (NestJS)

**Timeline**: 3-5 days to build gateway + missing endpoints

---

### Option B: Extend One Server

Extend **blade-ai-server** (NestJS) to include all routes and proxy to graphiti-server.

**Changes**:
- Add all `/graphiti/*` routes (proxy to graphiti-server)
- Add `/mcp/*` unified proxy
- Add `/documents/*` service
- Add `/observability/*` endpoints
- Rename to `blade-backend-gateway`

**Benefits**:
✅ Single codebase
✅ Familiar tech stack (NestJS)
✅ Can leverage existing modules

**Drawbacks**:
❌ Tight coupling
❌ Harder to scale services independently
❌ More complex to maintain

**Timeline**: 4-6 days

---

## 6. Implementation Roadmap

### Week 1: Gateway + MCP Proxy
**Days 1-2**: Create API gateway (FastAPI)
- Health endpoint
- Config/discovery endpoint
- CORS configuration

**Days 3-4**: Implement MCP Proxy
- `/mcp/servers` - List available servers
- `/mcp/{server}/tools` - List tools
- `/mcp/{server}/tools/{tool}` - Call tool
- Connect to graphiti-server MCP
- Connect to blade-ai-server MCP

**Day 5**: Add Graphiti proxy routes
- Route `/graphiti/*` to graphiti-server
- Test all endpoints

### Week 2: LangGraph + Observability
**Days 1-3**: LangGraph REST wrapper (in blade-ai-server)
- `POST /orchestrator/sessions`
- `GET /orchestrator/sessions/{id}/stream` (SSE)
- `POST /orchestrator/sessions/{id}/interrupt`
- `GET /orchestrator/sessions/{id}/state`

**Days 4-5**: LangFuse endpoints (in blade-ai-server)
- `GET /observability/traces/{session_id}`
- `GET /observability/metrics`
- Gateway proxy to blade-ai-server

### Week 3: Document Service + Missing Features
**Days 1-2**: Document service
- `POST /documents/read` (PDF, DOCX, Markdown)
- `POST /documents/write`
- Use existing dependencies (mammoth, pdf-parse)

**Days 3-4**: Graphiti enhancements
- `GET /graphiti/business-outcomes`
- `POST /graphiti/query` (custom Cypher)
- `POST /graphiti/documents/ingest`

**Day 5**: Integration testing
- Test all 5 services through gateway
- Mock mode testing
- Service discovery testing

### Week 4: Frontend Integration
**Days 1-3**: Implement frontend connectors (from `BACKEND_SERVICE_CONNECTORS_PLAN.md`)
- `src/lib/backend-client.ts`
- `src/lib/service-types.ts`
- `BackendServiceMonitor.tsx`
- `ServiceStatusButton.tsx`

**Days 4-5**: Polish and testing
- Full stack testing
- Mock mode validation
- Documentation

**Total**: 4 weeks

---

## 7. Quick Wins

### Can Be Done Immediately (< 1 day each)

1. **Add 3 Graphiti Endpoints** (graphiti-server)
   - Business outcomes query
   - Custom Cypher execution
   - Document ingestion

2. **Health Check Aggregation** (new gateway)
   - Call both servers' /health
   - Return combined status

3. **Service Discovery Endpoint** (new gateway)
   - Return list of available services
   - Return MCP servers list
   - Return features list

4. **LangFuse Read Endpoints** (blade-ai-server)
   - Expose traces via REST
   - Expose metrics via REST

---

## 8. Deployment Considerations

### Current Deployment State
- **graphiti-server**: Dockerized, has docker-compose
- **blade-ai-server**: Dockerized, has docker-compose

### Recommended Deployment

**Option 1: Docker Compose (Development)**
```yaml
version: '3.8'
services:
  gateway:
    build: ./gateway
    ports:
      - "8080:8080"
    depends_on:
      - graphiti-server
      - blade-ai-server
    environment:
      - GRAPHITI_URL=http://graphiti-server:8000
      - BLADE_AI_URL=http://blade-ai-server:3000

  graphiti-server:
    build: ./graphiti-server
    ports:
      - "8000:8000"
    environment:
      - NEO4J_URI=${NEO4J_URI}
      - OPENAI_API_KEY=${OPENAI_API_KEY}

  blade-ai-server:
    build: ./blade-ai-server
    ports:
      - "3000:3000"
    environment:
      - GRAPHITI_API_URL=http://graphiti-server:8000
      - LANGFUSE_BASEURL=${LANGFUSE_BASEURL}
```

**Option 2: Kubernetes (Production)**
- 3 separate deployments (gateway, graphiti, blade-ai)
- Services for internal communication
- Ingress for external access on gateway only

---

## 9. Next Steps

### Immediate Actions (This Week)

1. **Decision**: Choose Gateway architecture (Option A recommended)
2. **Setup**: Create gateway repository or folder
3. **Start**: Implement health check + config endpoints
4. **Document**: Update BACKEND_SERVICE_CONNECTORS_PLAN.md with findings

### Questions to Answer

1. **Which tech stack for gateway?**
   - FastAPI (Python) - Matches graphiti-server
   - NestJS (TypeScript) - Matches blade-ai-server
   - Recommendation: **FastAPI** (faster for simple routing)

2. **How to handle MCP server spawning?**
   - Use direct MCP clients (like `graphiti_mcp_client.py`)
   - Avoid claude-agent-sdk until v0.2+ fixes spawning

3. **Authentication strategy?**
   - Internal services: No auth (trusted network)
   - Gateway external: Add auth layer if needed
   - MCP endpoints: Token-based (already in blade-ai-server)

4. **Observability strategy?**
   - Use LangFuse for AI tracing
   - Add Sentry (already in blade-ai-server)
   - Add gateway logging (structured)

---

## 10. Success Metrics

### Week 1
✅ Gateway running with health check
✅ MCP proxy routing to graphiti-server
✅ Frontend can discover services

### Week 2
✅ LangGraph sessions API working
✅ SSE streaming functional
✅ LangFuse traces exposed

### Week 3
✅ Document read/write working
✅ All 5 services accessible through gateway
✅ Mock mode fallback tested

### Week 4
✅ Frontend service monitor showing status
✅ All services green in UI
✅ Full end-to-end workflow functional

---

## Conclusion

**Current State**: We have **70% of required backend infrastructure** already built across two servers.

**Main Work**: Create a **unified API gateway** that:
- Exposes standard API contract
- Routes to existing services
- Adds missing endpoints (documents, some orchestrator routes)
- Enables service discovery

**Timeline**: 3-4 weeks to complete pluggable architecture

**Biggest Win**: Can reuse existing robust implementations (Graphiti, LangGraph, LangFuse) instead of building from scratch.
