# Backend Service Connectors - Implementation Plan

**Date**: 2025-10-09
**Purpose**: Add visible backend service connectors to frontend UI
**Goal**: Show backend developers what services are needed and their connection status

---

## Overview

Add a **visual service status panel** to the frontend that shows backend developers:
- What services the frontend expects
- Real-time connection status (connected/disconnected/mock)
- What each service does
- What needs to be implemented

This makes the backend "pluggable" - the frontend can work with any backend that implements the standard API contract.

---

## Backend Services Required (from Architecture Docs)

Based on the pluggable architecture documents, the frontend needs these 5 backend services:

### 1. **MCP Proxy Service** (`/mcp/*`)
**Purpose**: Route calls to MCP servers (Graphiti, Copilots, Exa, Hedera)

**Endpoints**:
- `GET /mcp/servers` - List available MCP servers
- `GET /mcp/{server}/tools` - List tools for server
- `POST /mcp/{server}/tools/{tool_name}` - Call MCP tool

**Used by**: Step 1 (Source Connection), Step 5 (Live Execution)

---

### 2. **LangGraph Orchestrator** (`/orchestrator/*`)
**Purpose**: Multi-turn conversations with Claude AI orchestration

**Endpoints**:
- `POST /orchestrator/sessions` - Create session
- `GET /orchestrator/sessions/{id}/stream` - Stream execution (SSE)
- `POST /orchestrator/sessions/{id}/interrupt` - Human interrupt

**Used by**: Step 5 (Live Execution)

---

### 3. **Graphiti/Neo4j Service** (`/graphiti/*`)
**Purpose**: Direct Neo4j access for enhanced search, GDS projections, Pydantic models

**Endpoints**:
- `POST /graphiti/search` - Enhanced search with filters
- `GET /graphiti/business-outcomes` - Query business outcomes
- `POST /graphiti/query` - Custom Cypher queries
- `POST /graphiti/documents/ingest` - Chunk & ingest documents

**Used by**: Step 1 (Source Connection), Step 5 (Live Execution)

---

### 4. **Document Service** (`/documents/*`)
**Purpose**: Read/write any document format (PDF, DOCX, Markdown)

**Endpoints**:
- `POST /documents/read` - Read document
- `POST /documents/write` - Write document

**Used by**: Step 3 (Context Upload), Step 6 (Outcome & Download)

---

### 5. **LangFuse Observability** (`/observability/*`)
**Purpose**: Execution traces and metrics

**Endpoints**:
- `GET /observability/traces/{session_id}` - Get traces
- `GET /observability/metrics` - Overall metrics

**Used by**: Step 5 (Live Execution), Step 8 (Learning Capture)

---

## UI Component: Backend Service Monitor

### Visual Design

```
┌─────────────────────────────────────────────────────────┐
│  Backend Services Status                          [?]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🟢 MCP Proxy                              Connected    │
│     ├── Graphiti MCP          ✓ Available              │
│     ├── Copilots MCP          ⚠️ Not configured         │
│     ├── Exa MCP               ⚠️ Not configured         │
│     └── Hedera MCP            ⚠️ Not configured         │
│                                                          │
│  🟢 LangGraph Orchestrator                Connected    │
│     Multi-turn AI conversations                         │
│                                                          │
│  🟡 Graphiti/Neo4j            Mock Mode                │
│     Enhanced search, GDS projections                    │
│                                                          │
│  🔴 Document Service          Disconnected             │
│     PDF/DOCX read/write                                 │
│                                                          │
│  🔴 LangFuse Observability    Disconnected             │
│     Execution traces & metrics                          │
│                                                          │
│  Backend URL: http://localhost:8000      [Configure]   │
└─────────────────────────────────────────────────────────┘
```

### Status Indicators

- 🟢 **Green** - Service connected and working
- 🟡 **Yellow** - Service in mock mode or partially available
- 🔴 **Red** - Service disconnected
- ⚪ **Gray** - Service not configured (optional service)

---

## Implementation Files

### New Files to Create

1. **`src/lib/backend-client.ts`** (350+ lines)
   - Singleton backend client class
   - Service discovery on init
   - Health checking for each service
   - Mock mode fallback
   - TypeScript types for all services
   - Event emitters for status changes

2. **`src/lib/service-types.ts`** (150+ lines)
   - Service status types
   - Service configuration types
   - Connection state enums
   - Mock data structures
   - API response types

3. **`src/components/workflow/BackendServiceMonitor.tsx`** (400+ lines)
   - Main service status panel
   - Expandable service sections
   - Real-time status updates
   - Configuration UI
   - Help tooltips

4. **`src/components/workflow/ServiceStatusButton.tsx`** (150+ lines)
   - Floating status button (bottom-right)
   - Aggregated status badge
   - Opens BackendServiceMonitor on click

### Files to Modify

1. **`src/lib/store.ts`** (+100 lines)
   - Add `serviceStatus` state
   - Add `initializeServices()` action
   - Add `updateServiceStatus()` action
   - Add auto-refresh logic

2. **`src/lib/api.ts`** (+50 lines, refactor existing)
   - Import and use `backendClient`
   - Route existing calls through backend client
   - Maintain backward compatibility

3. **`src/app/layout.tsx`** (+10 lines)
   - Import `ServiceStatusButton`
   - Render as fixed floating element
   - Initialize services on mount

4. **`src/components/workflow/steps/Step1SourceConnection.tsx`** (+50 lines)
   - Add inline service status for this step
   - Show "Services required" section
   - Link to open full monitor

---

## Backend Client API

```typescript
// src/lib/backend-client.ts

class BackendClient {
  // Initialization
  async init(): Promise<void>

  // Service health
  async checkHealth(): Promise<HealthStatus>
  getServiceStatus(serviceName: string): ServiceStatus

  // MCP Proxy
  async listMCPServers(): Promise<string[]>
  async listMCPTools(server: string): Promise<Tool[]>
  async callMCPTool(server: string, tool: string, args: any): Promise<any>

  // Graphiti search helpers
  async searchGraphiti(query: string, filters?: SearchFilters): Promise<SearchResults>

  // LangGraph Orchestrator
  async createSession(message: string): Promise<SessionId>
  streamSession(sessionId: string, callbacks: StreamCallbacks): Cleanup
  async interruptSession(sessionId: string, message: string): Promise<void>

  // Neo4j Direct
  async runCypher(query: string, params?: any): Promise<any>
  async getBusinessOutcomes(filters?: any): Promise<BusinessOutcome[]>
  async ingestDocument(content: string, filename: string, groupId: string): Promise<EpisodeIds>

  // Documents
  async readDocument(path: string): Promise<string>
  async writeDocument(content: string, format: string): Promise<string>

  // LangFuse
  async getTraces(sessionId: string): Promise<Trace[]>
  async getMetrics(): Promise<Metrics>

  // Events
  on(event: 'status-change', callback: (status: ServiceStatus) => void): void
  off(event: 'status-change', callback: Function): void
}

export const backendClient = new BackendClient()
```

---

## Service Discovery Flow

### On App Initialization

```typescript
// 1. Frontend starts
const backendClient = new BackendClient()

// 2. Auto-discover services
await backendClient.init()

// 3. Check /health endpoint
const health = await fetch('/health')
// Returns: { services: ['mcp', 'orchestrator', 'graphiti'] }

// 4. Check /api/config endpoint
const config = await fetch('/api/config')
// Returns: {
//   services: ['mcp', 'orchestrator', 'graphiti'],
//   mcp_servers: ['graphiti', 'copilots'],
//   features: ['langgraph', 'langfuse']
// }

// 5. Test each service endpoint
// - Try GET /mcp/servers
// - Try POST /orchestrator/sessions (with test message)
// - Try POST /graphiti/search (with test query)
// - etc.

// 6. Update UI with results
// - Green if endpoint responds correctly
// - Yellow if responds but with errors
// - Red if doesn't respond
```

### During Usage

```typescript
// Before calling a service
if (backendClient.getServiceStatus('mcp') === 'connected') {
  // Use real service
  const results = await backendClient.searchGraphiti(query)
} else {
  // Use mock data
  const results = getMockSearchResults(query)
  showToast('Using mock data - Graphiti service not available')
}
```

---

## Mock Mode Strategy

When a service is unavailable, the frontend gracefully falls back to mock mode:

### Mock Data Providers

```typescript
// src/lib/mock-data.ts

export const mockServices = {
  graphitiSearch: (query: string) => ({
    status: 'success',
    isMock: true,
    facts: [
      { fact: 'Murabaha is a cost-plus financing structure...', relevance: 0.9 },
      { fact: 'AAOIFI FAS 2 governs Murabaha accounting...', relevance: 0.85 }
    ]
  }),

  orchestratorStream: (onChunk: Function) => {
    // Simulate streaming
    const text = "Based on AAOIFI standards, Murabaha requires..."
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        onChunk({ text: text[i], isMock: true })
        i++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }
}
```

### Visual Indicators

- **Banner**: "⚠️ Running in mock mode - some services unavailable"
- **Badge on results**: "🔧 Mock Data"
- **Tooltip**: "This is simulated data because the Graphiti service is not connected"

---

## Configuration

### Environment Variables

```bash
# .env.local

# Backend API Gateway URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Enable mock mode fallback (default: true)
NEXT_PUBLIC_ENABLE_MOCK_MODE=true

# Service timeout (ms)
NEXT_PUBLIC_SERVICE_TIMEOUT=5000

# Auto-refresh service status interval (ms)
NEXT_PUBLIC_SERVICE_REFRESH_INTERVAL=30000

# Show service monitor by default
NEXT_PUBLIC_SHOW_SERVICE_MONITOR=true
```

### Runtime Configuration

Users can change the backend URL via UI:

```typescript
// Click "Configure" button in Service Monitor
// Opens dialog:
//
// ┌─────────────────────────────────┐
// │ Configure Backend Services      │
// ├─────────────────────────────────┤
// │                                 │
// │ Backend URL:                    │
// │ [http://localhost:8000     ]    │
// │                                 │
// │ Presets:                        │
// │ • Local Development (port 8000) │
// │ • Staging (staging.backend.com) │
// │ • Production (api.backend.com)  │
// │                                 │
// │       [Cancel]  [Save & Test]   │
// └─────────────────────────────────┘
```

---

## Benefits for Backend Developers

### ✅ **Clear Requirements**
- See exactly what services frontend needs
- Understand what each service does
- Know which endpoints are required vs. optional

### ✅ **Real-Time Feedback**
- Implement a service → UI updates from red to green
- See immediately if endpoint is working
- Debug connection issues visually

### ✅ **Incremental Development**
- Don't need to implement all services at once
- Frontend works with partial backend (mock mode)
- Can test each service independently

### ✅ **Living Documentation**
- Service monitor acts as interactive docs
- "What does this service do?"
- "What endpoints does it have?"
- "Is it working right now?"

### ✅ **Easy Testing**
- Test frontend with no backend (all mock)
- Test with partial backend (some services)
- Test with full backend (all services)

---

## Backend Implementation Checklist

Backend developers can track progress using the UI:

### Core Services (Required)

- [ ] **MCP Proxy**
  - [ ] Health endpoint: `GET /health`
  - [ ] Config endpoint: `GET /api/config`
  - [ ] List servers: `GET /mcp/servers`
  - [ ] List tools: `GET /mcp/{server}/tools`
  - [ ] Call tool: `POST /mcp/{server}/tools/{tool_name}`
  - [ ] Connect to Graphiti MCP server
  - [ ] (Optional) Connect to Copilots MCP
  - [ ] (Optional) Connect to Exa MCP
  - [ ] (Optional) Connect to Hedera MCP

- [ ] **LangGraph Orchestrator**
  - [ ] Create session: `POST /orchestrator/sessions`
  - [ ] Stream session: `GET /orchestrator/sessions/{id}/stream` (SSE)
  - [ ] Interrupt: `POST /orchestrator/sessions/{id}/interrupt`
  - [ ] State management: `GET /orchestrator/sessions/{id}/state`

- [ ] **Graphiti/Neo4j Service**
  - [ ] Enhanced search: `POST /graphiti/search`
  - [ ] Custom Cypher: `POST /graphiti/query`
  - [ ] Business outcomes: `GET /graphiti/business-outcomes`
  - [ ] Document ingestion: `POST /graphiti/documents/ingest`
  - [ ] Auto-chunking support

### Optional Services

- [ ] **Document Service**
  - [ ] Read documents: `POST /documents/read`
  - [ ] Write documents: `POST /documents/write`
  - [ ] PDF support
  - [ ] DOCX support
  - [ ] Markdown support

- [ ] **LangFuse Observability**
  - [ ] Get traces: `GET /observability/traces/{session_id}`
  - [ ] Get metrics: `GET /observability/metrics`

---

## Testing Strategy

### Manual Testing Scenarios

1. **No Backend Running**
   - Start only frontend
   - All services show "Disconnected" (red)
   - Mock mode activated
   - UI still fully functional with mock data

2. **Partial Backend**
   - Start frontend + MCP proxy only
   - MCP shows "Connected" (green)
   - Others show "Disconnected" (red)
   - MCP features work, others use mock data

3. **Full Backend**
   - Start frontend + all services
   - All services show "Connected" (green)
   - No mock data used
   - Full functionality

4. **Service Interruption**
   - Disconnect one service mid-session
   - UI updates status to "Disconnected"
   - Gracefully falls back to mock mode
   - Shows toast notification

### Automated Tests

```typescript
// __tests__/backend-client.test.ts

describe('Backend Service Discovery', () => {
  test('detects available services on init', async () => {
    const client = new BackendClient()
    await client.init()
    expect(client.getServiceStatus('mcp')).toBe('connected')
  })

  test('falls back to mock mode when unavailable', async () => {
    const client = new BackendClient()
    const result = await client.searchGraphiti('test')
    expect(result.isMock).toBe(true)
  })

  test('emits status change events', async () => {
    const client = new BackendClient()
    const callback = jest.fn()
    client.on('status-change', callback)
    await client.checkHealth()
    expect(callback).toHaveBeenCalled()
  })
})
```

---

## Implementation Timeline

### Week 1: Core Infrastructure
- **Day 1**: Create `backend-client.ts` with service discovery
- **Day 2**: Create `service-types.ts` and mock data providers
- **Day 3**: Add service status to Zustand store
- **Day 4**: Test service discovery logic
- **Day 5**: Review and refine

### Week 2: UI Components
- **Day 1**: Build `BackendServiceMonitor.tsx` component
- **Day 2**: Build `ServiceStatusButton.tsx` floating button
- **Day 3**: Integrate with app layout
- **Day 4**: Add service indicators to Step 1
- **Day 5**: Polish and test UI

### Week 3: Integration & Testing
- **Day 1**: Update `api.ts` to use backend client
- **Day 2**: Test with no backend (mock mode)
- **Day 3**: Test with partial backend
- **Day 4**: Test with full backend
- **Day 5**: Final polish and documentation

**Total**: 3 weeks frontend work

---

## Success Metrics

### For Backend Developers
✅ Can see what services are needed
✅ Can track implementation progress visually
✅ Can test each service independently
✅ Get immediate feedback when service is working

### For Frontend
✅ Works in any state (no backend, partial, full)
✅ Clear visual indicators of service status
✅ Graceful degradation to mock mode
✅ Easy to switch between backends

### For Team
✅ Frontend and backend can develop in parallel
✅ Easy collaboration and testing
✅ Clear separation of concerns
✅ Reusable for future projects

---

## Next Steps

1. **Document current backend state** (explore Blade repos)
2. **Identify what's already implemented**
3. **Create gap analysis** (what needs to be built)
4. **Prioritize services** (which ones first?)
5. **Start implementation** (begin with backend-client.ts)

---

## Questions to Explore

- What services are already implemented in blade-ai-server?
- What services are in graphiti-server?
- What's the current API structure?
- What can we reuse vs. what needs to be built?
- What's the deployment strategy?

**Next**: Explore Blade repos using GitHub MCP to understand current state.
