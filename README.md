# ZeroH - Islamic Finance Governance Platform

**Sustainable Islamic Finance governance, monitoring and risk management system**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.18-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Guardian-purple)](https://www.hedera.com/guardian)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)

---

## 📖 Overview

ZeroH is a **comprehensive platform for structuring, monitoring, and managing Shariah-compliant Islamic finance transactions** with blockchain-based verification and digital asset management.

### What Makes ZeroH Different

- **Modular Component Architecture**: Mix and match Shariah structures, jurisdictions, accounting standards, and impact metrics
- **AI-Powered Automation**: Claude AI orchestrates document processing, compliance checking, and policy generation
- **Blockchain Verification**: Hedera Guardian integration for immutable compliance certificates
- **Digital Asset Management**: Cross-deal tracking of Guardian certificates and ATS tokens
- **Deal Lifecycle Management**: From structure to execution to ongoing monitoring

### 11-Step Comprehensive Workflow

1. **Connect Sources** - Backend services and AI knowledge base initialization
2. **Select Shariah Structure** - Choose from 7 structures (Wakala, Murabaha, Ijarah, etc.) OR upload methodology documents for AI digitization
3. **Select Jurisdiction** - Choose from 5 regulatory frameworks (Qatar QFC, UAE DIFC, Saudi CMA, etc.)
4. **Select Accounting** - Choose standards (AAOIFI, IFRS, IFRS+Islamic)
5. **Select Impact Metrics** - Choose ESG frameworks (QFC Sustainable, UN SDGs, Green Sukuk, etc.)
6. **Review Configuration** - Validate component compatibility
7. **Configure Details** - Fill deal parameters and upload documents
8. **Review Policy Structure** - View Guardian policy and BPMN workflow
9. **Test Workflow** - Run sandbox simulation
10. **Live Execution** - Deploy to Hedera Guardian blockchain
11. **Monitor & Collaborate** - Track compliance, manage documents, and collaborate with stakeholders

---

## ✨ Key Features

### Phase 1: Core Workflow (Completed)
- ✅ **10-step modular workflow** with component-based configuration
- ✅ **QIIB Oryx Sustainability Sukuk** pre-configured demo
- ✅ **Guardian policy generation** with BPMN visualization
- ✅ **Mock blockchain deployment** with realistic Hedera transaction IDs

### Phase 2: Methodology Digitization (Completed)
- ✅ **7-step AI-powered digitization pipeline** - Upload documents → Parse → Analyze → Generate Schemas → Generate Policies → Calculate → Validate
- ✅ **LlamaParse integration** for advanced PDF parsing
- ✅ **Claude AI analysis** extracting Shariah requirements
- ✅ **Guardian schema generation** from natural language

### Phase 3: Digital Assets & Lifecycle (Completed)
- ✅ **Digital Assets Management** - Cross-deal view of Guardian certificates and ATS tokens
- ✅ **Deal Lifecycle Tracking** - Monitor deals from creation through completion
- ✅ **6 Mock Deals Auto-seeded** - Realistic Islamic finance transactions on startup:
  - QIIB Oryx Green Sukuk (Wakala + Certificate + Token)
  - Dubai Islamic Bank Murabaha Facility (Murabaha + Certificate + Token)
  - Abu Dhabi Sovereign Wakala Infrastructure (Wakala + Certificate + Token)
  - Saudi Aramco Green Sukuk Istisna (Istisna + Certificate only)
  - Malaysia Sustainable Sukuk Musharaka (Musharaka + Certificate + Token)
  - Kuwait Finance House Hybrid Sukuk (Pending)
- ✅ **Comprehensive Navigation** - Sidebar navigation across Dashboard, Workflow, Deals, Digital Assets, Collaboration
- ✅ **Mock Guardian API** - 8 endpoints simulating Guardian integration for rapid prototyping

### Phase 4: Knowledge Base & UI (Completed)
- ✅ **23 Authoritative Sources** across 4 categories:
  - 7 Shariah Structures (AAOIFI FAS standards)
  - 5 Jurisdictions (DFSA, QFC, SC Malaysia, CMA, CSSF)
  - 3 Accounting Standards (AAOIFI, IFRS, IFRS+Islamic)
  - 8 Impact Metrics (UN SDGs, Green Sukuk, Value-Based Intermediation, etc.)
- ✅ **Step 1 UI Redesign** - Impressive backend architecture showcase (13 services)
- ✅ **ZeroH Branding** - Complete platform rebranding

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (frontend)
- **Python** 3.11+ (backend)
- **Neo4j Aura** account (optional, for MCP Graphiti integration)
- **Anthropic API Key** (optional, for Claude AI)

### 1. Clone the Repository
```bash
git clone https://github.com/Blade-Labs/islamic-finance-workflows.git
cd islamic-finance-workflows
```

### 2. Environment Setup

#### Backend Environment Variables

Create `backend/.env` file:

```env
# Neo4j Connection (optional - platform works without it)
NEO4J_URI=neo4j+ssc://xxxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# AI API Keys (optional - platform works in mock mode without them)
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx  # Optional, for embeddings
LLAMAPARSE_API_KEY=llx-xxxxx  # Optional, for advanced PDF parsing

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3040,http://localhost:3000

# Claude Configuration
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_MAX_TOKENS=16384
CLAUDE_TEMPERATURE=0.7

# Directories
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs

# Optional
DEBUG=true
LOG_LEVEL=INFO
```

#### Frontend Environment Variables

Create `.env.local` file in root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Port for Next.js dev server
PORT=3040
```

**💡 Note**: Without Neo4j and Anthropic API keys, the platform runs in **mock mode** with simulated data - perfect for exploring the UI without external dependencies!

### 3. Installation

#### Option A: One-Command Demo Launch (Recommended)

**Windows**:
```bash
start-demo.bat
```

**Mac/Linux**:
```bash
chmod +x start-demo.sh
./start-demo.sh
```

This automatically:
- ✅ Installs all dependencies (first run only)
- ✅ Starts backend API on port 8000
- ✅ Auto-seeds 6 realistic Islamic finance deals
- ✅ Starts frontend dev server on port 3040
- ✅ Opens browser to http://localhost:3040

#### Option B: Manual Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
cd ..
```

### 4. Start Servers Manually (if not using demo scripts)

**Terminal 1 - Backend**:
```bash
cd backend
# Activate venv if not already active
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

The application will be available at **http://localhost:3040**

---

## 🎮 Using the Platform

### Quick Demo Path (15 minutes)

1. **Visit** http://localhost:3040
2. **Click "Load QIIB Oryx Demo"** - Pre-configures Wakala + QFC + AAOIFI + Sustainability
3. **Navigate through 10 steps** - See component selection, configuration, policy generation
4. **View Guardian Policy** - Generated BPMN workflow and policy structure
5. **Mock Deployment** - Simulated blockchain with realistic transaction IDs
6. **Step 11: Monitor & Collaborate** - Navigate to Dashboard and Digital Assets
7. **Explore Digital Assets** - See 6 auto-seeded deals with Guardian certificates and ATS tokens
8. **View Deal Details** - Individual deal compliance tracking and monitoring

### Exploring Digital Assets

**URL**: http://localhost:3040/digital-assets

View **cross-deal digital assets** including:
- **Summary Metrics**: Total deals, Guardian certificates, tokenized assets, total supply, token holders
- **Filtering Tabs**: All Assets | Certificates Only | Tokens Only | Complete Set
- **Deal Cards**: Each showing:
  - Guardian certificate ID and status
  - ATS token symbol, supply, and holder count
  - Navigation to individual deal digital assets

### Exploring Deals

**URL**: http://localhost:3040/deals

Browse all Islamic finance deals with:
- Deal name, Shariah structure, jurisdiction
- Status tracking (active, pending, completed)
- Guardian certificate and token badges
- Quick navigation to deal details and digital assets

### Methodology Upload (Alternative to Component Selection)

In **Step 2**, instead of selecting from 7 pre-defined Shariah structures, you can:

1. **Upload Policy Intent Document** (PDF/DOCX)
2. **Watch 7-Step Digitization Pipeline**:
   - Upload → Parse (LlamaParse) → Analyze (Claude)
   - Generate Schemas → Generate Policies → Generate Calculations
   - Validate (Guardian)
3. **Extract Shariah Structure** automatically from your document

---

## 🏗️ Project Structure

```
islamic-finance-workflows/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── dashboard/                # ✅ Platform overview dashboard
│   │   ├── deals/                    # ✅ Deal listing and detail pages
│   │   │   └── [id]/
│   │   │       └── digital-assets/   # ✅ Individual deal digital assets
│   │   ├── digital-assets/           # ✅ Cross-deal digital assets
│   │   ├── collaboration/            # ✅ Collaboration features
│   │   ├── contracts/                # Contracts management (coming soon)
│   │   ├── welcome/                  # Welcome screen
│   │   └── layout.tsx                # ✅ Global layout with navigation
│   ├── components/
│   │   ├── ui/                       # shadcn/ui reusable components
│   │   ├── workflow/                 # 11-step workflow components
│   │   ├── guardian/                 # ✅ TrustChain visualization (D3.js)
│   │   └── layout/                   # ✅ Navigation, Breadcrumbs
│   ├── lib/
│   │   ├── store.ts                  # Zustand state management
│   │   ├── backend-client.ts         # ✅ Singleton API client
│   │   ├── mockData/                 # ✅ Guardian mock data generators
│   │   └── utils.ts                  # Utility functions
│   └── data/                         # Component configurations (Shariah, Jurisdictions, etc.)
├── backend/
│   └── app/
│       ├── main.py                   # ✅ FastAPI app (auto-seeds mock data)
│       ├── models.py                 # ✅ Pydantic models with digital asset fields
│       ├── api/                      # API routers
│       │   ├── deals.py              # ✅ Deal CRUD operations
│       │   ├── mock_guardian.py      # ✅ 8 Guardian mock endpoints
│       │   ├── workflows.py          # Workflow execution
│       │   ├── sessions.py           # Session management (SSE)
│       │   ├── documents.py          # Document upload/processing
│       │   └── graphiti.py           # Knowledge graph search
│       └── services/
│           ├── deal_storage.py       # ✅ In-memory deal persistence
│           ├── guardian_policy.py    # Policy generation
│           ├── graphiti_mcp_service.py # MCP integration
│           └── claude_service.py     # Claude AI orchestration
├── public/                           # Static assets
├── start-demo.bat                    # Windows one-command launcher
├── start-demo.sh                     # Mac/Linux one-command launcher
├── PROGRESS_TRACKER_NOV5.md          # ✅ Today's session log
├── KNOWLEDGE_BASE_AUTHORITATIVE_SOURCES.md # ✅ 23 authoritative sources
├── STEP1_UI_REDESIGN_PROPOSAL.md     # ✅ Step 1 architecture showcase
├── UX_IMPLEMENTATION_PLAN.md         # ✅ 15-day UX roadmap
└── PROJECT_OVERVIEW.md               # Comprehensive documentation
```

---

## 🛠️ Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server on port 3040
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

#### Backend
- `uvicorn app.main:app --reload` - Start FastAPI with auto-reload (from backend/ directory)
- `pytest` - Run tests (when implemented)

### Tech Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18 + TypeScript 5
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- D3.js (TrustChain visualization)
- Recharts (analytics charts)
- bpmn-js (BPMN workflow visualization)

**Backend**:
- FastAPI (Python 3.11+)
- Pydantic v2 (data validation)
- Uvicorn (ASGI server)
- Neo4j (Graphiti knowledge graph)
- Claude AI (Anthropic)
- LlamaParse (PDF processing)

**Blockchain Integration (In Development)**:
- Hedera Guardian (compliance policies)
- Hedera Consensus Service (HCS) - audit trail
- Hedera Token Service (HTS) - NFT certificates
- Alternative Token System (ATS) - asset tokenization
- IPFS (decentralized storage)

---

## 📊 Mock Data Showcase

### 6 Auto-Seeded Islamic Finance Deals

The platform automatically seeds 6 realistic deals on startup to demonstrate full capabilities:

1. **QIIB Oryx Green Sukuk** ✅ Complete
   - Structure: Wakala (Agency)
   - Jurisdiction: Qatar QFC
   - Certificate: GC-2024-001-QIIB-ORYX
   - Token: QIIB-ORYX (50M supply, 127 holders)

2. **Dubai Islamic Bank Murabaha** ✅ Complete
   - Structure: Murabaha (Cost-plus financing)
   - Jurisdiction: UAE DIFC
   - Certificate: GC-2024-002-DIB-MURABAHA
   - Token: DIB-MRB (25M supply, 89 holders)

3. **Abu Dhabi Sovereign Wakala** ✅ Complete
   - Structure: Wakala (Agency)
   - Jurisdiction: UAE ADGM
   - Certificate: GC-2024-003-ADGOV-WAKALA
   - Token: ADGOV-WKL (100M supply, 342 holders)

4. **Saudi Aramco Green Sukuk Istisna** 🟡 Certificate Only
   - Structure: Istisna (Construction financing)
   - Jurisdiction: Saudi CMA
   - Certificate: GC-2024-004-ARAMCO-ISTISNA
   - Token: Not yet tokenized

5. **Malaysia Sustainable Sukuk Musharaka** ✅ Complete
   - Structure: Musharaka (Partnership)
   - Jurisdiction: Malaysia SC
   - Certificate: GC-2024-005-MYS-MUSHARAKA
   - Token: MYS-MSH (75M supply, 215 holders)

6. **Kuwait Finance House Hybrid Sukuk** 🔴 Pending
   - Structure: Hybrid
   - Jurisdiction: Kuwait CMA
   - Status: In progress (no certificate or token yet)

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

If port 3040 or 8000 is already in use:

```bash
# Windows
netstat -ano | findstr ":3040"
taskkill /F /PID <process_id>

# Mac/Linux
lsof -i :3040
kill <process_id>
```

#### Backend Connection Errors

- Verify backend is running on http://localhost:8000
- Check backend logs for errors
- Ensure Python virtual environment is activated
- Verify `.env` file exists in `backend/` directory

#### Frontend Not Loading

- Clear browser cache and refresh
- Check browser console for errors
- Verify both frontend and backend servers are running
- Check `.env.local` file has correct `NEXT_PUBLIC_API_URL`

#### Mock Data Not Appearing

- Backend auto-seeds data on startup
- If data is missing, restart the backend server
- Check backend logs for "✅ Seeded mock deals with digital assets"

---

## 📖 Documentation

### Core Documentation

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Complete Phase 1 documentation with demo details
- **[PROGRESS_TRACKER_NOV5.md](./PROGRESS_TRACKER_NOV5.md)** - Today's session achievements
- **[KNOWLEDGE_BASE_AUTHORITATIVE_SOURCES.md](./KNOWLEDGE_BASE_AUTHORITATIVE_SOURCES.md)** - 23 authoritative sources across 4 categories
- **[STEP1_UI_REDESIGN_PROPOSAL.md](./STEP1_UI_REDESIGN_PROPOSAL.md)** - Backend architecture showcase design
- **[UX_IMPLEMENTATION_PLAN.md](./UX_IMPLEMENTATION_PLAN.md)** - 15-day UX implementation roadmap

### Research & Planning

- **[HEDERA_GUARDIAN_ATS_RESEARCH.md](./HEDERA_GUARDIAN_ATS_RESEARCH.md)** - Deep dive into Guardian + ATS integration
- **[HEDERA_TOKENIZATION_PLAN.md](./HEDERA_TOKENIZATION_PLAN.md)** - Asset Tokenization Studio research
- **[HEDERA_AUDIT_TRAIL_DOCUMENT_GENERATION.md](./HEDERA_AUDIT_TRAIL_DOCUMENT_GENERATION.md)** - Audit trail architecture
- **[DEMO_ENHANCEMENT_PLAN.md](./DEMO_ENHANCEMENT_PLAN.md)** - 7-week Hedera integration strategy
- **[GUARDIAN_INTEGRATION_MAPPING.md](./GUARDIAN_INTEGRATION_MAPPING.md)** - 11-step workflow with Guardian touchpoints
- **[LIFECYCLE_INTEGRATION_PLAN.md](./LIFECYCLE_INTEGRATION_PLAN.md)** - Complete lifecycle integration
- **[VISUAL_WORKFLOW_EXPLANATION.md](./VISUAL_WORKFLOW_EXPLANATION.md)** - End-to-end workflow diagram

### Developer Resources

- **[CLAUDE.md](./CLAUDE.md)** - Project-specific guidance for Claude Code
- **[FOR_DEVELOPERS.md](./FOR_DEVELOPERS.md)** - Backend team integration guide
- **[PLUGGABLE_ARCHITECTURE.md](./PLUGGABLE_ARCHITECTURE.md)** - System architecture
- **[KNOWN_GAPS.md](./KNOWN_GAPS.md)** - Current limitations and future work

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Use TypeScript for all frontend code
- Follow PEP 8 for Python backend code
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🎯 Roadmap

### Phase 1: Core Workflow ✅ COMPLETE
- Modular component-based configuration
- 10-step workflow with Guardian policy generation
- QIIB Oryx pre-configured demo
- Mock blockchain deployment

### Phase 2: Methodology Digitization ✅ COMPLETE
- 7-step AI-powered digitization pipeline
- LlamaParse + Claude AI integration
- Guardian schema generation from documents
- Step 2 alternative path (upload vs select)

### Phase 3: Digital Assets & Lifecycle ✅ COMPLETE
- Digital Assets management page
- Deal lifecycle tracking
- 6 auto-seeded mock deals
- Mock Guardian API (8 endpoints)
- Cross-deal certificate and token management

### Phase 4: Knowledge Base & UI ✅ COMPLETE
- 23 authoritative sources research
- Step 1 backend architecture showcase
- ZeroH rebranding
- Comprehensive navigation

### Phase 5: Real Guardian Integration 🔄 IN PROGRESS
- Live Hedera Guardian connection
- Real policy deployment to testnet
- NFT certificate minting (HTS)
- Consensus service audit trail (HCS)
- IPFS document storage

### Phase 6: Asset Tokenization Studio 📋 PLANNED
- Alternative Token System (ATS) integration
- Fractional ownership tokenization
- Secondary market connectivity
- Investor portal

### Phase 7: Advanced Features 📋 PLANNED
- Multi-party collaboration workflows
- Real-time compliance monitoring
- Advanced analytics dashboard
- Mobile app (iOS/Android)

---

## 📄 License

[Add your license information here]

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [FastAPI](https://fastapi.tiangolo.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI orchestration by [Claude](https://www.anthropic.com/claude) (Anthropic)
- BPMN visualization with [bpmn-js](https://bpmn.io/)
- Blockchain framework: [Hedera Guardian](https://www.hedera.com/guardian)
- Knowledge graph: [Graphiti](https://github.com/getzep/graphiti) + [Neo4j](https://neo4j.com/)

**Powered by** [Blade Labs](https://blade.build)

---

## 📞 Support

For issues and questions:

- Create an issue in the [GitHub repository](https://github.com/Blade-Labs/islamic-finance-workflows/issues)
- Check [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for comprehensive documentation
- Review [troubleshooting section](#-troubleshooting)
- Explore the 14+ documentation files for detailed guidance

---

**Current Phase**: Phase 3 Complete - Digital Assets & Deal Lifecycle Management
**Last Updated**: November 5, 2025
**Version**: 1.3.0
**Demo Status**: Fully functional with 6 auto-seeded Islamic finance deals
