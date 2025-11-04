# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Islamic Finance Workflows is a Next.js + FastAPI application demonstrating AI-powered workflows for Islamic finance compliance and document processing. The application uses Claude AI with Model Context Protocol (MCP) integrations for knowledge graph management via Graphiti and Neo4j.

## Key Architecture Principles

### Pluggable Backend Strategy
The backend serves as a **testing infrastructure** for frontend prototypes, not production software. The architecture enables non-developers to Vibe-code frontends that connect to production backend services via a standard API contract.

**Core Pattern**: Frontend discovers available backend services on initialization and gracefully degrades to mock mode if services are unavailable. This allows independent iteration of UI and backend components.

### MCP-First Integration
- All knowledge graph operations go through the `blade-graphiti` MCP server using Claude Agent SDK
- Direct Neo4j connections are avoided in favor of MCP tool calls
- MCP servers are configured via Claude Agent SDK's `ClaudeAgentOptions`
- The backend acts as an MCP proxy for frontend clients

### State Management
- **Frontend**: Zustand store (`src/lib/store.ts`) is the single source of truth for workflow execution state
- **Backend**: FastAPI with async/await patterns and lifespan context managers
- Sessions are managed via the `/api/sessions` endpoints with SSE streaming for real-time updates

## Common Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server (runs on port 3030)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Backend Development
```bash
cd backend

# Create/activate virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests (when configured)
pytest

# Lint Python code
python -m flake8 .
```

### Quick Restart (Development)
Use the PowerShell script for full restart:
```powershell
.\restart.ps1
```

## Project Structure

### Frontend (`src/`)
- `app/` - Next.js App Router pages and layouts
- `components/ui/` - Reusable Radix UI components (accordions, dialogs, buttons, etc.)
- `components/workflow/` - Workflow-specific components
- `lib/` - Core utilities and services
  - `backend-client.ts` - Singleton client for backend service discovery and API calls
  - `store.ts` - Zustand global state management
  - `api.ts` - Type-safe API client functions
  - `service-types.ts` - TypeScript types for backend services
  - `sse-parser.ts` - Server-Sent Events parsing for streaming responses
  - `types.ts` - Domain types (WorkflowExecution, Document, Citation, etc.)

### Backend (`backend/app/`)
- `main.py` - FastAPI application entry point with CORS and lifespan management
- `models.py` - Pydantic models for request/response validation
- `api/` - FastAPI routers organized by domain
  - `graphiti.py` - Knowledge graph search endpoints
  - `documents.py` - Document upload and processing
  - `workflows.py` - Workflow execution endpoints
  - `sessions.py` - Session management with SSE streaming
  - `templates.py` - Workflow template management
  - `citations.py` - Citation verification
  - `learnings.py` - Learning extraction from execution feedback
- `services/` - Business logic and external integrations
  - `graphiti_mcp_service.py` - MCP-based Graphiti integration using Claude Agent SDK
  - `graphiti_mcp_client.py` - Direct MCP client wrapper
  - `claude_service.py` - Claude API interactions
  - `workflow_engine.py` - Workflow orchestration logic
  - `document_service.py` - Document processing (PDF, DOCX, TXT)
  - `session_service.py` - Session state management
  - `template_service.py` - Template CRUD operations

## Critical Workflows

### Backend MCP Integration Pattern
The backend uses Claude Agent SDK to call MCP tools. **Always** use this pattern:

```python
from claude_agent_sdk import query
from claude_agent_sdk.types import ClaudeAgentOptions

# Configure MCP server
agent_options = ClaudeAgentOptions(
    mcp_servers={
        "blade-graphiti": {
            "command": "uvx",
            "args": ["mcp-server-graphiti"],
            "env": {
                "NEO4J_URI": os.getenv("NEO4J_URI"),
                "NEO4J_USER": os.getenv("NEO4J_USER"),
                "NEO4J_PASSWORD": os.getenv("NEO4J_PASSWORD")
            }
        }
    },
    allowed_tools=["mcp__blade-graphiti__search", ...]
)

# Make queries
result = await query(
    prompt="Search for information about Murabaha",
    agent_options=agent_options
)
```

### Frontend Service Discovery Pattern
The frontend automatically discovers available backend services. **Always** initialize the backend client:

```typescript
import { backendClient } from '@/lib/backend-client'

// In component or page initialization
useEffect(() => {
  backendClient.init()  // Auto-discovers services
}, [])

// Use services (with automatic mock fallback)
const results = await backendClient.searchGraphiti(query, filters)
```

### SSE Streaming for Real-time Updates
Session execution uses Server-Sent Events for streaming. **Always** handle SSE properly:

```typescript
// Frontend
import { SSEParser } from '@/lib/sse-parser'

const parser = new SSEParser()
const eventSource = new EventSource(`/api/sessions/${sessionId}/stream`)

eventSource.onmessage = (event) => {
  const parsed = parser.parse(event.data)
  // Handle parsed event
}
```

```python
# Backend
from sse_starlette.sse import EventSourceResponse

async def stream_execution():
    async def event_generator():
        yield {
            "event": "message",
            "data": json.dumps({"type": "thinking", "content": "..."})
        }
    return EventSourceResponse(event_generator())
```

## Environment Configuration

### Frontend `.env.local`
```env
# Backend API URL (defaults to http://localhost:8000)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Port for Next.js dev server
PORT=3030
```

### Backend `backend/.env`
```env
# Neo4j Connection (required for Graphiti MCP)
NEO4J_URI=neo4j+ssc://xxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxx

# AI API Keys
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
LLAMAPARSE_API_KEY=llx-xxx

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3030,http://localhost:3000

# Claude Configuration
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_MAX_TOKENS=16384
CLAUDE_TEMPERATURE=0.7

# Upload/Output Directories
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs

# Optional
DEBUG=true
LOG_LEVEL=INFO
```

## TypeScript Path Aliases

The project uses `@/*` for imports:
```typescript
import { useWorkflowStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
```

Configuration in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Important Implementation Notes

### When Adding Backend Endpoints
1. Create route handler in `backend/app/api/`
2. Add Pydantic models in `backend/app/models.py` if needed
3. Implement business logic in `backend/app/services/`
4. Register router in `backend/app/main.py`
5. Update TypeScript types in `src/lib/service-types.ts`
6. Add API client method in `src/lib/backend-client.ts`

### When Adding Frontend Components
1. Place reusable UI components in `src/components/ui/`
2. Place workflow-specific components in `src/components/workflow/`
3. Use Zustand store for global state (avoid prop drilling)
4. Follow Radix UI patterns for accessible components
5. Use TypeScript for all components with proper prop types

### When Working with MCP
- **Never** bypass the MCP integration to call Neo4j directly
- **Always** use `graphiti_mcp_service.py` for knowledge graph operations
- MCP tools available: `search`, `add_episode`, `add_episodes_bulk`, `get_recent_nodes`, `delete_episode`
- Check `backend/app/services/graphiti_mcp_service.py` for available methods

### Session Management
- Sessions are created via `POST /api/sessions`
- Session state is managed server-side in `session_service.py`
- Streaming execution via `GET /api/sessions/{id}/stream`
- Interrupts via `POST /api/sessions/{id}/interrupt`
- Session data includes full execution log, citations, learnings, and generated files

## Testing Strategy

### Frontend
- Component testing with React Testing Library (when configured)
- Type safety via TypeScript compiler
- Manual testing via dev server

### Backend
- Unit tests for services with pytest (when configured)
- API endpoint testing
- Mock external dependencies (MCP, Claude API)

## Known Constraints

### Port Configuration
- Frontend runs on port **3030** (not 3000) to avoid conflicts
- Backend runs on port **8000**
- Ensure CORS_ORIGINS includes both ports if testing multiple configurations

### MCP Server Requirements
- Requires `uvx` (uv package runner) installed for MCP server execution
- Neo4j credentials must be valid for MCP server initialization
- MCP servers are spawned as child processes by Claude Agent SDK

### Document Upload
- PDF parsing uses LlamaParse API (requires API key)
- Uploads stored in `backend/uploads/` directory
- Large documents should be chunked before ingestion to Graphiti

## Commit Message Convention

Follow Conventional Commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add Sukuk validation workflow
fix: resolve SSE streaming timeout
docs: update MCP integration guide
refactor: improve session state management
```

## Deployment Considerations

### Frontend (Vercel/Netlify)
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Ensure build succeeds with `npm run build`
- Next.js 14 App Router requires Node.js 20+

### Backend (Railway/Render)
- Install Python 3.11+
- Install dependencies from `requirements.txt`
- Set all environment variables
- Run with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Ensure Neo4j Aura instance is accessible from deployment platform

## Additional Resources

- `PLUGGABLE_ARCHITECTURE.md` - Complete technical architecture details
- `FOR_DEVELOPERS.md` - Backend team integration guide
- `QUICK_START.md` - Step-by-step setup guide
- `CONTRIBUTING.md` - Contribution guidelines
- `README.md` - Main project documentation
