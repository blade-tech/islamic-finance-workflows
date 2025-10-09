# For Developers: Pluggable Backend Strategy

**From**: Project Lead
**To**: Misha-Dev + Backend Team
**Purpose**: Enable easy integration of Vibe-coded frontends with our production backend

---

## 🎯 The Problem We're Solving

As we have more non-developers Vibe-coding frontends/prototypes, we're facing:

1. **Deployment Issues**: No clear path to deploy Vibe-generated code
2. **Collaboration Blockers**: Hard to share prototypes between frontend/backend teams
3. **Testing Gaps**: Can't connect frontends to our actual backend infrastructure
4. **Wasted Effort**: Non-developers trying to build backends → endless debug cycles

**Example**:
- Using Graphiti out-of-the-box → Doesn't work well
- You (Misha) already built enhancements → Works better
- But prototypes can't test your enhancements → Can't validate improvements

---

## 💡 The Solution

**Build a pluggable backend that ANY Vibe-coded frontend can connect to.**

### **Key Concept**

```
Vibe-Coded Frontend  →  Standard API Contract  →  Your Production Backend
    (Testing UI)            (You implement)           (Graphiti, LangGraph, etc.)
```

**Benefits**:
- ✅ Non-developers test use cases with REAL infrastructure
- ✅ You validate enhancements with REAL use case UIs
- ✅ Easy deployment/sharing/collaboration
- ✅ Separation of concerns (they build UI, you build infrastructure)

---

## 🏗️ What You Need to Build

### **Simple API Gateway (FastAPI)**

One service that routes to your existing infrastructure:

```python
# backend-gateway/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Backend Infrastructure API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health & Discovery
@app.get("/health")
async def health():
    return {"status": "ok", "services": ["mcp", "orchestrator", "graphiti"]}

@app.get("/api/config")
async def config():
    return {
        "services": ["mcp", "orchestrator", "graphiti", "observability"],
        "mcp_servers": ["graphiti", "copilots", "exa", "hedera"]
    }

# Service Routers
from services.mcp_proxy import router as mcp_router
from services.langgraph_orchestrator import router as orchestrator_router
from services.neo4j_service import router as neo4j_router
from services.document_service import router as document_router
from services.langfuse_service import router as langfuse_router

app.include_router(mcp_router)
app.include_router(orchestrator_router)
app.include_router(neo4j_router)
app.include_router(document_router)
app.include_router(langfuse_router)
```

### **Required Service Routers (4-5 routers)**

#### **1. MCP Proxy** (`/mcp/*`)
Routes to your existing MCP servers (graphiti, copilots, exa, hedera).

**Why**: Frontends can call MCP tools without client-side complexity.

**Endpoints**:
- `GET /mcp/servers` → List available MCP servers
- `GET /mcp/{server}/tools` → List tools for server
- `POST /mcp/{server}/tools/{tool_name}` → Call tool

**Example**:
```python
@router.post("/mcp/graphiti/tools/search")
async def search(query: str, filters: dict = None):
    # Connect to YOUR enhanced Graphiti
    # Return results
    pass
```

#### **2. LangGraph Orchestrator** (`/orchestrator/*`)
Wraps your existing LangGraph infrastructure.

**Why**: Frontends can stream multi-turn conversations with human interrupts.

**Endpoints**:
- `POST /orchestrator/sessions` → Create session
- `GET /orchestrator/sessions/{id}/stream` → Stream execution (SSE)
- `POST /orchestrator/sessions/{id}/interrupt` → Human interrupt

#### **3. Graphiti/Neo4j Service** (`/graphiti/*`)
Direct access to your Neo4j/Graphiti infrastructure.

**Why**: Better search, GDS projections, test Pydantic models, proper chunking.

**Endpoints**:
- `POST /graphiti/search` → Enhanced search with filters
- `GET /graphiti/business-outcomes` → Query using Pydantic models
- `POST /graphiti/query` → Run custom Cypher
- `POST /graphiti/documents/ingest` → Chunk & ingest documents

**Solves Your Problems**:
- ❌ Poor search results → ✅ Add `min_score` filter
- ❌ Single episode dump → ✅ Auto-chunking before ingestion
- ❌ Can't test Pydantic models → ✅ Direct endpoints for them

#### **4. LangFuse Observability** (`/observability/*`)
Expose LangFuse traces for debugging.

**Why**: Frontends can show execution traces/metrics.

**Endpoints**:
- `GET /observability/traces/{session_id}` → Get traces
- `GET /observability/metrics` → Overall metrics

#### **5. Document Service** (`/documents/*`)
Read/write any document format.

**Endpoints**:
- `POST /documents/read` → Read PDF/DOCX/TXT
- `POST /documents/write` → Write any format

---

## 📋 Full API Contract

See `PLUGGABLE_ARCHITECTURE.md` lines 221-304 for complete endpoint specifications.

---

## 🔄 How This Works in Practice

### **Scenario: Testing Enhanced Graphiti**

**Non-Developer (Project Lead)**:
1. Vibe-codes search UI
2. Adds standard backend client
3. Configures: `NEXT_PUBLIC_API_URL=https://your-backend.com`
4. Shares frontend with you

**You (Backend Team)**:
1. Receive frontend code
2. Run `npm run dev`
3. Frontend now uses YOUR enhanced Graphiti
4. Test search quality with real UI
5. Provide feedback: "Works! But results too broad"

**Non-Developer**:
1. Adds `min_score` filter slider to UI
2. Shares update

**You**:
1. Test with slider
2. Confirm: "Perfect! Users can control relevance now"

**Result**: Enhanced Graphiti validated, UI improved, both teams move forward.

---

## 🎯 What You Get From This

### **Testing Infrastructure**
- ✅ Real UIs to test your enhancements
- ✅ Validate Graphiti improvements work for real use cases
- ✅ See if LangGraph orchestration makes sense to users
- ✅ Test MCP integrations end-to-end

### **Faster Iteration**
- ✅ Non-developers build UIs → You test backend
- ✅ Quick feedback loops
- ✅ No time wasted on UI development
- ✅ Focus on infrastructure, not frontends

### **Better Collaboration**
- ✅ Clear separation: They build UI, you build backend
- ✅ Easy sharing/deployment
- ✅ Both teams move in parallel
- ✅ Shared understanding of requirements

---

## 🚀 Implementation Plan

### **Phase 1: Basic Gateway** (1 day)
- Create FastAPI app with CORS
- Add `/health` and `/api/config` endpoints
- Test with curl

### **Phase 2: MCP Proxy** (1 day)
- Implement MCP proxy router
- Connect to your existing MCP servers
- Test with frontend calling Graphiti search

### **Phase 3: LangGraph Wrapper** (2 days)
- Wrap your existing LangGraph in REST/SSE endpoints
- Add session management
- Test streaming + interrupts

### **Phase 4: Enhanced Graphiti** (1 day)
- Add search with filters (solves "irrelevant results")
- Add document chunking (solves "single episode dump")
- Add Pydantic model queries
- Test GDS projections

### **Phase 5: Observability** (1 day)
- Expose LangFuse traces
- Add metrics endpoints

**Total**: ~6 days to have a fully pluggable backend

---

## 📦 Deployment

### **Development**
```bash
uvicorn main:app --reload --port 8000
```

### **Production**
```bash
# Docker
docker build -t backend-gateway .
docker run -p 8000:8000 backend-gateway

# Or Railway/Render
railway up
```

### **Give Frontend Team This URL**
```
https://backend.yourcompany.com

They add to .env.local:
NEXT_PUBLIC_API_URL=https://backend.yourcompany.com
```

---

## 🔧 Technical Details

### **Using Your Existing Infrastructure**

**Enhanced Graphiti**:
```python
# Don't use out-of-the-box Graphiti
# Use YOUR enhanced version

from your_custom_graphiti import EnhancedGraphiti

graphiti = EnhancedGraphiti()  # Your improvements
```

**Custom LangGraph**:
```python
# Use YOUR LangGraph orchestrator

from your_langgraph import CustomOrchestrator

orchestrator = CustomOrchestrator()  # Your setup
```

**MCP Servers**:
```python
# Connect to YOUR running MCP servers
# (blade-graphiti, copilots-mcp, etc.)

mcp_config = {
    "graphiti": {
        "command": "uv",
        "args": ["run", "your_graphiti_mcp.py"],
        # YOUR configuration
    }
}
```

---

## 💡 Key Insights

### **This is NOT Production Software**
- Frontend = Testing UI for validating use cases
- Backend = Your production infrastructure being tested
- Goal = Make it easy to validate your enhancements work

### **Separation of Concerns**
- **Non-developers**: Build intuitive UIs for testing
- **You**: Build robust infrastructure (Graphiti, LangGraph, MCPs)
- **Together**: Validate use cases end-to-end

### **Reusable for All Future Prototypes**
- Build backend contract once
- ANY future Vibe-coded frontend can plug in
- No custom integration work per prototype

---

## 📚 Resources

**Full Documentation**:
- `PLUGGABLE_ARCHITECTURE.md` → Complete technical specs
- `QUICK_START.md` → Step-by-step guide for both teams
- `FOR_DEVELOPERS.md` → This document

**Implementation Code**:
- MCP Proxy: Architecture doc, lines 485+
- LangGraph Orchestrator: Lines 730+
- Neo4j Service: Lines 1100+
- All endpoints fully specified

---

## 🤝 Next Steps

### **For You**
1. Review `PLUGGABLE_ARCHITECTURE.md` (full technical specs)
2. Decide: Build gateway yourself or assign to team member?
3. Choose: Start with MCP proxy or LangGraph wrapper first?
4. Timeline: When can this be ready?

### **For Non-Developers**
1. Copy backend client template into Vibe projects
2. Configure backend URL (once you provide it)
3. Share frontends for testing

### **Timeline Suggestion**
- Week 1: Basic gateway + MCP proxy
- Week 2: LangGraph wrapper + Enhanced Graphiti
- Week 3: LangFuse observability + Document service
- Week 4: Production deployment + documentation

---

## ❓ Questions to Consider

1. **Where should this run?**
   - Same server as your current backend?
   - Separate service?
   - Railway/Render/other?

2. **Authentication?**
   - Do frontends need auth?
   - Or internal-only access?

3. **Rate limiting?**
   - Needed for testing environment?
   - Or unlimited for now?

4. **Monitoring?**
   - Track API usage?
   - Alert on errors?

---

## 🎯 Success Criteria

**You'll know this works when:**

✅ Non-developer shares frontend → You run it → It uses YOUR backend
✅ Can test enhanced Graphiti without building UI
✅ Can validate LangGraph orchestration with real use case
✅ Frontend/backend teams iterate independently
✅ New prototypes connect in < 5 minutes

---

**Ready to discuss implementation?**

Let's align on:
1. Timeline
2. Who implements what
3. Deployment strategy
4. Any concerns/questions

**All implementation code is ready in `PLUGGABLE_ARCHITECTURE.md` - just need to configure paths to your infrastructure.**
