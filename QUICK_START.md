# Quick Start Guide
## Pluggable Frontend ↔ Backend Integration

**For**: Non-developers Vibe-coding frontends + Backend developers building infrastructure

---

## 🎯 What This Solves

**Problem**: Non-developers build frontends in Vibe, but can't easily:
- Deploy them
- Share with backend team
- Test with real backend infrastructure
- Collaborate on iterations

**Solution**: Standard backend API contract that ANY Vibe-coded frontend can plug into.

---

## 👤 For Non-Developers (Vibe-Coding Frontends)

### **Step 1: Copy the Backend Client**

Create `lib/backend-client.ts` in your project and copy from `PLUGGABLE_ARCHITECTURE.md` (lines 315-395).

### **Step 2: Configure Backend URL**

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Or ask backend team for their URL
```

### **Step 3: Use in Components**

```typescript
import { backend } from '@/lib/backend-client'
import { useEffect } from 'react'

export default function MyComponent() {
  useEffect(() => {
    backend.init()  // Auto-connects to backend
  }, [])

  const handleAction = async () => {
    // Call backend services
    const results = await backend.searchGraphiti('my query')
    console.log(results)
  }

  return <button onClick={handleAction}>Search</button>
}
```

### **Step 4: Share with Backend Team**

```bash
# Zip and send
zip -r my-frontend.zip .

# Or push to GitHub
git push

# Or deploy to Vercel
vercel deploy

# Tell backend team:
# "Frontend ready to test! Just set NEXT_PUBLIC_API_URL to your backend"
```

---

## 👨‍💻 For Backend Developers (Building Infrastructure)

### **What You Need to Build**

A **simple FastAPI gateway** that exposes these endpoints:

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health():
    return {"status": "ok", "services": ["mcp", "orchestrator", "graphiti"]}

# Service discovery
@app.get("/api/config")
async def config():
    return {
        "services": ["mcp", "orchestrator", "graphiti"],
        "mcp_servers": ["graphiti", "copilots", "exa", "hedera"],
        "features": ["langgraph", "langfuse"]
    }

# Import service routers (implement based on your infrastructure)
# See PLUGGABLE_ARCHITECTURE.md for full implementations
```

### **Required Service Routers**

1. **MCP Proxy** → Routes to your MCP servers
2. **LangGraph Orchestrator** → Wraps your LangGraph
3. **Graphiti/Neo4j** → Direct database access
4. **Documents** → Read/write capabilities

Full implementations in `PLUGGABLE_ARCHITECTURE.md`.

### **Testing Frontend Updates**

```bash
# Receive frontend from non-dev
git clone frontend-repo

# Configure to use YOUR backend
echo "NEXT_PUBLIC_API_URL=https://your-backend.com" > .env.local

# Run and test
npm run dev

# Now frontend uses YOUR production infrastructure
# Test enhanced Graphiti, custom LangGraph, etc.

# Provide feedback to non-dev
# "Search works! But add a min_score filter"
```

---

## 🔄 Iteration Workflow

### **Cycle 1: Initial Prototype**
```
Non-Dev → Vibe-codes search UI → Shares with backend team
Backend → Tests with real Graphiti → "Search works, but results too broad"
```

### **Cycle 2: Add Filters**
```
Non-Dev → Adds min_score slider to UI → Updates shared frontend
Backend → Tests with slider → "Perfect! Relevance control works"
```

### **Cycle 3: Production Ready**
```
Both → Validated use case → Enhanced Graphiti proven to work
Non-Dev → Moves to next prototype
Backend → Continues infrastructure improvements
```

---

## 📋 API Contract (What Backend Must Implement)

### **Core Endpoints**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/config` | GET | Service discovery |
| `/mcp/{server}/tools/{tool}` | POST | Call MCP tools |
| `/orchestrator/sessions/{id}/stream` | GET | LangGraph streaming |
| `/graphiti/search` | POST | Enhanced search |
| `/graphiti/business-outcomes` | GET | Pydantic models |
| `/observability/traces/{id}` | GET | LangFuse traces |

Full contract in `PLUGGABLE_ARCHITECTURE.md` (lines 221-304).

---

## 🚀 Deployment Options

### **Frontend (Non-Developer)**

**Option 1: Vercel** (Easiest)
```bash
npm install -g vercel
vercel deploy
# Share URL with backend team
```

**Option 2: Docker**
```bash
docker build -t my-frontend .
docker run -p 3000:3000 my-frontend
```

**Option 3: Zip & Share**
```bash
zip -r frontend.zip .
# Send to backend team via email/Slack
```

### **Backend (Backend Team)**

**Option 1: Run Locally**
```bash
cd backend-gateway
uvicorn main:app --reload --port 8000
```

**Option 2: Docker**
```bash
docker build -t backend-gateway .
docker run -p 8000:8000 backend-gateway
```

**Option 3: Deploy to Cloud**
```bash
# Railway, Render, or your preferred platform
railway up
```

---

## 🎁 What You Get

### **Non-Developers Get**
✅ Easy deployment of Vibe-coded frontends
✅ Ability to test with real backend
✅ Fast iteration cycles
✅ No backend debugging

### **Backend Developers Get**
✅ Real use case testing for infrastructure
✅ UI to validate enhancements (Graphiti, LangGraph, etc.)
✅ Feedback loop for improvements
✅ Separation of concerns (frontend/backend move independently)

### **Team Gets**
✅ Faster validation of use cases
✅ Better collaboration
✅ Reusable backend for ALL future prototypes
✅ Clear separation of responsibilities

---

## 📚 Resources

- **Full Architecture**: See `PLUGGABLE_ARCHITECTURE.md`
- **Backend Client Template**: Lines 315-395 in architecture doc
- **Service Implementations**: Lines 485+ in architecture doc
- **API Contract**: Lines 221-304 in architecture doc

---

## 💡 Key Insight

This is **NOT** about building a production app.

This is about:
- **Frontend = Testing UI** for validating use cases
- **Backend = Production infrastructure** being tested
- **Goal = Easy way** for non-developers to help test backend enhancements

**Result**: Enhanced Graphiti, custom LangGraph, etc. get validated with real use cases without backend team building their own UI.

---

## 🤝 Separation of Concerns

### **Non-Developer Responsibilities**
- Build intuitive UIs for testing use cases
- Iterate based on backend team feedback
- Share updates frequently
- Focus on user experience

### **Backend Team Responsibilities**
- Implement standard API contract
- Build/enhance infrastructure (Graphiti, LangGraph, MCPs)
- Test with frontends non-developers provide
- Provide feedback on what works/doesn't

### **Shared Responsibility**
- Validate use cases work end-to-end
- Iterate until infrastructure meets real needs
- Document learnings for future projects

---

## 🆘 Troubleshooting

### **Frontend can't connect to backend**
```
1. Check NEXT_PUBLIC_API_URL in .env.local
2. Verify backend is running (curl http://backend-url/health)
3. Check CORS settings in backend
```

### **Backend can't run frontend**
```
1. Run npm install
2. Check Node version (should be 18+)
3. Ensure .env.local has NEXT_PUBLIC_API_URL
```

### **Service not available**
```
Frontend will use mock mode automatically
Check backend logs to see which services started
```

---

**Ready to start?**

1. **Non-developers**: Copy `backend-client.ts` into your Vibe project
2. **Backend team**: Implement API contract from architecture doc
3. **Both**: Share frequently and iterate

Questions? See full documentation in `PLUGGABLE_ARCHITECTURE.md`.
