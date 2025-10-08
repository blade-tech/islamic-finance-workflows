# Islamic Finance Workflows - Complete Technical Specification

**Version:** 1.0
**Last Updated:** 2025-01-07
**Project Type:** Production Learning Application

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Data Models](#data-models)
6. [Workflow Steps Specification](#workflow-steps-specification)
7. [API Endpoints](#api-endpoints)
8. [Frontend Components](#frontend-components)
9. [Backend Services](#backend-services)
10. [Execution Engine](#execution-engine)
11. [Learning System](#learning-system)
12. [Document Generation](#document-generation)
13. [Error Handling & Logging](#error-handling--logging)
14. [Setup & Configuration](#setup--configuration)
15. [Testing Strategy](#testing-strategy)
16. [Deployment](#deployment)

---

## Project Overview

### Purpose

Build a **production-ready Islamic Finance document generation system** that enables users to:
1. Create Sharia-compliant financial documents using AI-powered workflows
2. Guide and interrupt Claude Code during execution
3. Verify sources from AAOIFI standards
4. Learn from each execution to improve future runs

This is **NOT a demo**. This is a working application with:
- Real Claude API integration (streaming, interrupts)
- Real Graphiti MCP integration (knowledge graph, episode ingestion)
- Real document generation (Pandoc PDF/DOCX output)
- Real learning system (open code → axial code conversion)

### Target Audience

**Primary:** Developers learning how to build AI-powered workflow applications with Claude Code SDK and Graphiti MCP

**Secondary:** Islamic finance professionals needing to generate compliant documents

### Learning Center Philosophy

This app is designed to teach developers through:
- **Transparent UI**: Every page shows what's happening internally
- **Extensive comments**: Code explains the "why", not just the "what"
- **Educational error messages**: Errors teach, not just report
- **Live logs**: Show Claude's thinking in real-time
- **Clear data flow**: State transitions are visible and logged

### Core Capabilities

1. **Source Integration**: Connect to Graphiti MCP and ingest AAOIFI documents
2. **Workflow Templates**: 5 pre-built Islamic finance workflows + custom creation
3. **Context Enrichment**: Upload documents and add text context
4. **Workflow Configuration**: Write natural language guidance (open code)
5. **Live Execution**: Watch Claude work with ability to interrupt
6. **Source Verification**: Approve/reject citations from AAOIFI
7. **Document Generation**: Download professional PDF/DOCX via Pandoc
8. **Learning Loop**: Extract patterns to improve workflows

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Step 1   │→ │ Step 2   │→ │ Step 3   │→ │ Step 4   │→ ...      │
│  │ Connect  │  │ Select   │  │ Context  │  │ Configure│           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Zustand Store (Workflow State)                          │       │
│  │ - Current step, execution state, documents, logs        │       │
│  └─────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓ HTTP/SSE
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│  │ Claude Service  │  │ Graphiti Service│  │ Document Service │   │
│  │ (Streaming)     │  │ (MCP Client)    │  │ (Pandoc)         │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│  │ Workflow Engine │  │ Learning Service│  │ Citation Tracker │   │
│  │ (Execution)     │  │ (Pattern Extract)│  │ (Source Verify) │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓ MCP Protocol
┌─────────────────────────────────────────────────────────────────────┐
│                    GRAPHITI MCP (blade-graphiti)                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│  │ Episode Ingest  │  │ Search/Query    │  │ Knowledge Graph  │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          NEO4J DATABASE                              │
│  - AAOIFI Documents (Episodic nodes)                                │
│  - Workflow Executions (Episode history)                            │
│  - Entity Relationships (Knowledge graph)                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → Frontend State → Backend API → Claude SDK (with MCP tools)
                                                ↓
                                    Graphiti MCP (search AAOIFI)
                                                ↓
                                    Generate Document
                                                ↓
                                    Citation Tracking
                                                ↓
                                    Pandoc PDF/DOCX
                                                ↓
                                    Learning Extraction
                                                ↓
                                    Graphiti Episode Ingest
```

### Principles

1. **Keep it Simple**: Use Claude SDK and MCP directly, minimize abstractions
2. **Make it Visible**: Every step should show what's happening internally
3. **Make it Real**: No mocks, no simulations - real API calls, real documents
4. **Make it Educational**: Code should teach through comments and structure
5. **Make it Maintainable**: Clear separation of concerns, typed interfaces

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Shadcn/UI | Latest | Component library |
| Zustand | 4.x | State management |
| React Markdown | Latest | Markdown rendering |
| React Diff Viewer | Latest | Diff visualization |
| EventSource (native) | - | SSE streaming |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Language |
| FastAPI | 0.104+ | API framework |
| Uvicorn | Latest | ASGI server |
| Anthropic SDK | Latest | Claude API |
| Pydantic | 2.x | Data validation |
| python-docx | Latest | DOCX parsing |
| PyPDF2 | Latest | PDF parsing |
| Pandoc (system) | 3.x | Document conversion |

### Infrastructure

| Technology | Version | Purpose |
|-----------|---------|---------|
| Neo4j | 5.x | Graph database |
| Graphiti MCP | Latest | Knowledge graph (blade-graphiti) |
| Redis (optional) | 7.x | Interrupt flags (can use in-memory initially) |

### Development Tools

- **Package Manager**: npm (frontend), pip/poetry (backend)
- **Linting**: ESLint, Ruff
- **Formatting**: Prettier, Black
- **Type Checking**: TypeScript, mypy

---

## Project Structure

```
islamic-finance-workflows/
├── README.md                          # Project overview and setup
├── SPEC.md                            # This document
├── .env.example                       # Environment variables template
├── docker-compose.yml                 # Local development setup
│
├── frontend/                          # Next.js application
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   │
│   ├── src/
│   │   ├── app/                       # App router pages
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── page.tsx               # Home/dashboard
│   │   │   └── workflow/
│   │   │       └── page.tsx           # Main workflow page (8 steps)
│   │   │
│   │   ├── components/                # React components
│   │   │   ├── ui/                    # Shadcn components
│   │   │   ├── workflow/              # Workflow-specific components
│   │   │   │   ├── Step1Connect.tsx
│   │   │   │   ├── Step2Select.tsx
│   │   │   │   ├── Step3Context.tsx
│   │   │   │   ├── Step4Configure.tsx
│   │   │   │   ├── Step5Execute.tsx
│   │   │   │   ├── Step6Verify.tsx
│   │   │   │   ├── Step7Outcome.tsx
│   │   │   │   └── Step8Learn.tsx
│   │   │   ├── ClaudeLog.tsx          # Live log display
│   │   │   ├── CitationCard.tsx       # Source verification
│   │   │   └── DiffViewer.tsx         # Learning diff
│   │   │
│   │   ├── lib/                       # Utilities and helpers
│   │   │   ├── api-client.ts          # API calls to backend
│   │   │   ├── workflow-store.ts      # Zustand store
│   │   │   └── types.ts               # TypeScript types
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   └── public/
│       └── workflows/                 # Workflow template icons
│
├── backend/                           # FastAPI application
│   ├── pyproject.toml                 # Python dependencies
│   ├── pytest.ini
│   │
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry
│   │   ├── config.py                  # Configuration settings
│   │   │
│   │   ├── api/                       # API routes
│   │   │   ├── __init__.py
│   │   │   ├── sources.py             # Step 1: Source connection
│   │   │   ├── workflows.py           # Step 2: Workflow templates
│   │   │   ├── context.py             # Step 3: Context upload
│   │   │   ├── execution.py           # Step 5: Workflow execution
│   │   │   ├── citations.py           # Step 6: Citation management
│   │   │   ├── documents.py           # Step 7: Document generation
│   │   │   └── learning.py            # Step 8: Learning extraction
│   │   │
│   │   ├── services/                  # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── claude_service.py      # Claude SDK wrapper
│   │   │   ├── graphiti_service.py    # Graphiti MCP client
│   │   │   ├── document_service.py    # Document parsing/generation
│   │   │   ├── workflow_engine.py     # Execution engine
│   │   │   ├── citation_tracker.py    # Citation tracking
│   │   │   └── learning_extractor.py  # Pattern extraction
│   │   │
│   │   ├── models/                    # Pydantic models
│   │   │   ├── __init__.py
│   │   │   ├── workflow.py            # Workflow templates
│   │   │   ├── execution.py           # Execution state
│   │   │   ├── citation.py            # Citation models
│   │   │   └── learning.py            # Learning models
│   │   │
│   │   └── templates/                 # Workflow templates (JSON)
│   │       ├── sukuk_issuance.json
│   │       ├── murabaha.json
│   │       ├── ijarah.json
│   │       ├── musharaka.json
│   │       └── wakalah.json
│   │
│   └── tests/
│       ├── test_claude_service.py
│       ├── test_workflow_engine.py
│       └── test_end_to_end.py
│
├── docs/                              # Documentation
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── WORKFLOW_GUIDE.md
│   └── LEARNING_SYSTEM.md
│
└── scripts/                           # Utility scripts
    ├── setup_neo4j.sh
    ├── ingest_aaoifi_samples.py
    └── test_workflow.py
```

---

## Data Models

### Workflow Template

```typescript
// frontend/src/lib/types.ts

interface WorkflowTemplate {
  id: string                           // e.g., "sukuk_issuance"
  name: string                         // e.g., "Sukuk Issuance Document"
  description: string                  // Human-readable description
  icon: string                         // Icon name from lucide-react
  category: 'debt' | 'equity' | 'lease' | 'partnership' | 'agency'

  // OPEN CODE: Natural language template
  openCodeTemplate: string             // Starting point for user customization

  // AXIAL CODE: Structured execution steps
  axialCode: {
    steps: WorkflowStep[]              // Ordered execution steps
    requiredSources: string[]          // e.g., ["AAOIFI FAS 3", "AAOIFI GS 8"]
    outputFormat: 'markdown'           // Always markdown, converted via Pandoc
    estimatedDuration: number          // Minutes
    complexity: 'simple' | 'moderate' | 'complex'
  }

  // Metadata
  version: string                      // Template version (for learning evolution)
  createdAt: string                    // ISO timestamp
  updatedAt: string                    // ISO timestamp
  executionCount: number               // How many times executed
  successRate: number                  // 0.0 - 1.0
  averageRating: number                // User ratings 1-5

  // Learning history
  refinements: Refinement[]            // Past user refinements
}

interface WorkflowStep {
  id: string                           // Unique step ID
  name: string                         // Display name
  type: 'query' | 'generate' | 'validate' | 'transform'

  // Open code: What this step does (natural language)
  instruction: string                  // e.g., "Retrieve AAOIFI FAS 3 standards"

  // Axial code: How to execute this step
  axialParams: {
    queryType?: 'graphiti_search' | 'graphiti_episode'
    groupIds?: string[]                // Graphiti group filters
    generateSection?: string           // Document section to generate
    validationRules?: string[]         // Rules to validate against
    requiredFields?: string[]          // Must include these fields
  }

  // Sources required for this step
  sources: string[]                    // Group IDs in Graphiti

  // Expected output
  expectedOutput: string               // Description of what step produces
}

interface Refinement {
  id: string
  executionId: string                  // Which execution led to this
  type: 'instruction_added' | 'source_added' | 'parameter_changed'
  description: string                  // What changed
  impact: string                       // How it improved workflow
  approvedBy: string                   // User ID
  appliedAt: string                    // ISO timestamp
}
```

```python
# backend/app/models/workflow.py

from pydantic import BaseModel, Field
from typing import Literal, List, Dict, Any
from datetime import datetime

class WorkflowStep(BaseModel):
    id: str
    name: str
    type: Literal['query', 'generate', 'validate', 'transform']
    instruction: str
    axial_params: Dict[str, Any] = Field(default_factory=dict)
    sources: List[str] = Field(default_factory=list)
    expected_output: str

class AxialCode(BaseModel):
    steps: List[WorkflowStep]
    required_sources: List[str]
    output_format: Literal['markdown'] = 'markdown'
    estimated_duration: int  # minutes
    complexity: Literal['simple', 'moderate', 'complex']

class WorkflowTemplate(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    category: Literal['debt', 'equity', 'lease', 'partnership', 'agency']
    open_code_template: str
    axial_code: AxialCode
    version: str
    created_at: datetime
    updated_at: datetime
    execution_count: int = 0
    success_rate: float = 0.0
    average_rating: float = 0.0
```

### Execution State

```typescript
// frontend/src/lib/types.ts

interface WorkflowExecution {
  id: string                           // Unique execution ID
  workflowTemplateId: string           // Which template was used
  userId: string                       // Who ran it
  status: 'not_started' | 'running' | 'interrupted' | 'completed' | 'failed'
  currentStepIndex: number             // Which step (0-based)

  // Step 1: Sources
  graphitiConnected: boolean
  aaaoifiDocuments: UploadedDocument[]

  // Step 2: Selection
  selectedTemplate: WorkflowTemplate | null
  customTemplate: WorkflowTemplate | null

  // Step 3: Context
  contextDocuments: UploadedDocument[]
  contextText: string
  contextEpisodeIds: string[]          // Graphiti episode IDs

  // Step 4: Configuration
  userNotes: Record<string, string>    // stepId → user's open code notes
  workflowIterations: number           // How many times iterated with Claude

  // Step 5: Execution
  executionLog: LogEntry[]             // Live log entries
  completedSteps: number[]             // Step indices completed
  interruptCount: number
  interruptMessages: InterruptMessage[]

  // Step 6: Citations
  citations: Citation[]
  approvedCitations: string[]          // Citation IDs
  rejectedCitations: string[]          // Citation IDs

  // Step 7: Outcome
  finalDocument: string                // Markdown content
  generatedFiles: GeneratedFile[]      // PDF, DOCX outputs

  // Step 8: Learning
  extractedLearnings: Learning[]
  appliedLearnings: string[]           // Learning IDs applied to template
  userFeedback: string

  // Metadata
  startedAt: string                    // ISO timestamp
  completedAt: string | null           // ISO timestamp
  durationSeconds: number
  tokensUsed: number                   // Claude tokens
}

interface UploadedDocument {
  id: string
  filename: string
  filesize: number
  mimeType: string
  uploadedAt: string
  episodeId?: string                   // Graphiti episode ID if ingested
  parsed: boolean
  contentPreview: string               // First 200 chars
}

interface LogEntry {
  id: string
  timestamp: string                    // ISO timestamp
  stepIndex: number
  stepName: string
  type: 'info' | 'query' | 'response' | 'error' | 'interrupt'
  content: string                      // Markdown content
  metadata?: {
    tokensUsed?: number
    sources?: string[]
    confidence?: number
  }
}

interface InterruptMessage {
  id: string
  timestamp: string
  stepIndex: number
  userMessage: string
  systemResponse?: string
}

interface Citation {
  id: string
  source: 'AAOIFI' | 'UserUpload' | 'Graphiti' | 'Claude'
  documentTitle: string
  documentRef: string                  // Episode ID or URL
  excerpt: string                      // Quoted text (max 500 chars)
  usedInSection: string                // Which part of output document
  confidence: number                   // 0.0 - 1.0
  episodeId?: string                   // Graphiti episode if applicable
  approved: boolean
  rejected: boolean
  rejectionReason?: string
  timestamp: string
}

interface GeneratedFile {
  id: string
  format: 'pdf' | 'docx' | 'markdown'
  filename: string
  filesize: number
  downloadUrl: string
  generatedAt: string
}

interface Learning {
  id: string
  title: string
  description: string
  category: 'instruction_improvement' | 'source_addition' | 'parameter_tuning'
  confidence: number                   // 0.0 - 1.0 (how confident we are this helps)

  // What changed
  openCodeChange: string               // Natural language description
  axialCodeChange: Dict<string, any>   // Structured change to workflow

  // Evidence
  fromExecutionId: string
  userBehavior: string                 // What user did that led to this
  impact: string                       // Predicted improvement

  approved: boolean
  appliedToTemplate: boolean
}
```

```python
# backend/app/models/execution.py

from pydantic import BaseModel, Field
from typing import Literal, List, Dict, Any, Optional
from datetime import datetime

class LogEntry(BaseModel):
    id: str
    timestamp: datetime
    step_index: int
    step_name: str
    type: Literal['info', 'query', 'response', 'error', 'interrupt']
    content: str
    metadata: Optional[Dict[str, Any]] = None

class Citation(BaseModel):
    id: str
    source: Literal['AAOIFI', 'UserUpload', 'Graphiti', 'Claude']
    document_title: str
    document_ref: str
    excerpt: str
    used_in_section: str
    confidence: float = Field(ge=0.0, le=1.0)
    episode_id: Optional[str] = None
    approved: bool = False
    rejected: bool = False
    rejection_reason: Optional[str] = None
    timestamp: datetime

class WorkflowExecution(BaseModel):
    id: str
    workflow_template_id: str
    user_id: str
    status: Literal['not_started', 'running', 'interrupted', 'completed', 'failed']
    current_step_index: int = 0

    # State from each step
    graphiti_connected: bool = False
    aaoifi_documents: List[Dict[str, Any]] = Field(default_factory=list)
    context_documents: List[Dict[str, Any]] = Field(default_factory=list)
    context_text: str = ""
    context_episode_ids: List[str] = Field(default_factory=list)
    user_notes: Dict[str, str] = Field(default_factory=dict)

    # Execution tracking
    execution_log: List[LogEntry] = Field(default_factory=list)
    completed_steps: List[int] = Field(default_factory=list)
    interrupt_count: int = 0
    interrupt_messages: List[Dict[str, Any]] = Field(default_factory=list)

    # Citations
    citations: List[Citation] = Field(default_factory=list)

    # Output
    final_document: str = ""
    generated_files: List[Dict[str, Any]] = Field(default_factory=list)

    # Learning
    extracted_learnings: List[Dict[str, Any]] = Field(default_factory=list)
    user_feedback: str = ""

    # Metadata
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: int = 0
    tokens_used: int = 0
```

---

## Workflow Steps Specification

### Step 1: Connect to Sources

**Purpose**: Establish Graphiti MCP connection and ingest AAOIFI documents

**UI Components** (`Step1Connect.tsx`):
- Connection status indicator (connected/disconnected)
- File upload zone (drag-and-drop, accepts PDF/DOCX/TXT)
- Upload progress bar
- List of uploaded documents with parsing status
- Graphiti stats (total episodes, nodes, edges)
- "Test Connection" button
- "Continue to Workflows" button (disabled until connected)

**Learning Center Elements**:
```typescript
{/* What's Happening? section */}
<Alert>
  <Info className="w-4 h-4" />
  <AlertTitle>What's Happening?</AlertTitle>
  <AlertDescription>
    <p>This step connects to the Graphiti knowledge graph (via MCP) and ingests
    AAOIFI standards as Episodes. Each document becomes searchable by Claude during
    workflow execution.</p>

    <p className="mt-2"><strong>Why this matters:</strong> Claude needs access to
    Islamic finance standards to generate compliant documents. We store these in a
    knowledge graph so Claude can query them during execution.</p>
  </AlertDescription>
</Alert>

{/* Live logs */}
<Card>
  <CardHeader>
    <h3>Connection Log</h3>
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-[200px]">
      {connectionLog.map(entry => (
        <div key={entry.id} className="text-xs font-mono">
          [{entry.timestamp}] {entry.message}
        </div>
      ))}
    </ScrollArea>
  </CardContent>
</Card>
```

**Backend Endpoint** (`POST /api/sources/ingest-aaoifi`):
```python
@router.post("/ingest-aaoifi")
async def ingest_aaoifi_document(
    file: UploadFile,
    execution_id: str
):
    """
    Ingest AAOIFI document into Graphiti.

    Steps:
    1. Parse uploaded file (PDF/DOCX → text)
    2. Chunk by sections/pages
    3. Ingest each chunk as Graphiti Episode
    4. Return episode IDs for later retrieval

    Learning Notes:
    - We use EpisodeType.text for documents
    - group_id = 'aaoifi_standards' for filtering
    - Each section is a separate episode for granular search
    """
    try:
        # Parse document
        content = await document_service.extract_text(file)
        logger.info(f"Extracted {len(content)} characters from {file.filename}")

        # Chunk by section (look for headers like "FAS 3", "Section 2.5")
        sections = document_service.chunk_by_section(content)
        logger.info(f"Found {len(sections)} sections in document")

        # Ingest each section to Graphiti
        episode_ids = []
        for section in sections:
            episode_id = await graphiti_service.add_episode(
                name=f"AAOIFI: {file.filename} - {section.title}",
                episode_body=section.content,
                episode_type="text",
                group_id="aaoifi_standards"
            )
            episode_ids.append(episode_id)
            logger.info(f"Ingested section '{section.title}' as episode {episode_id}")

        # Track in execution state
        await update_execution(
            execution_id,
            {
                "aaoifi_documents": {
                    "filename": file.filename,
                    "episode_ids": episode_ids,
                    "sections": len(sections)
                }
            }
        )

        return {
            "success": True,
            "filename": file.filename,
            "episode_ids": episode_ids,
            "sections_count": len(sections)
        }

    except Exception as e:
        logger.error(f"Failed to ingest {file.filename}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Ingestion failed: {str(e)}"
        )
```

**Error Handling**:
- PDF parsing errors → Show helpful message "Unable to parse PDF. Try converting to text first."
- MCP connection failure → Show "Graphiti MCP not connected. Check your MCP server is running."
- Duplicate uploads → Warn "This document was already uploaded. Re-upload will create new episodes."

**Logging**:
```python
# Every significant action should log
logger.info(f"Starting AAOIFI ingestion: {file.filename}")
logger.debug(f"File size: {file.size} bytes, type: {file.content_type}")
logger.info(f"Extracted {len(content)} characters")
logger.info(f"Chunked into {len(sections)} sections")
logger.info(f"Ingested section 1/{len(sections)}: {section.title}")
# ... etc
```

---

### Step 2: Select Workflow

**Purpose**: Choose from 5 pre-built workflows or create custom with Claude

**UI Components** (`Step2Select.tsx`):
- Grid of workflow cards (5 templates)
- Each card shows: icon, name, description, complexity, avg duration
- "Create Custom" card with Claude chat option
- Modal for custom workflow creation with ClaudeChat component
- Selected workflow preview (shows steps, sources required)

**Workflow Templates** (JSON files in `backend/app/templates/`):

Example: `sukuk_issuance.json`
```json
{
  "id": "sukuk_issuance",
  "name": "Sukuk Issuance Document",
  "description": "Generate a Sharia-compliant bond (Sukuk) prospectus following AAOIFI FAS 3 standards",
  "icon": "FileText",
  "category": "debt",
  "openCodeTemplate": "Create a Sukuk issuance document that:\n1. Describes the structure (Issuer, SPV, Trustee, Investors)\n2. Identifies the underlying asset\n3. Explains profit distribution mechanism\n4. Provides Sharia compliance certification\n5. Includes risk disclosures",
  "axialCode": {
    "steps": [
      {
        "id": "query_aaoifi_fas3",
        "name": "Query AAOIFI FAS 3",
        "type": "query",
        "instruction": "Retrieve AAOIFI FAS 3 standard sections on Sukuk structure and classification",
        "axialParams": {
          "queryType": "graphiti_search",
          "groupIds": ["aaoifi_standards"],
          "searchQuery": "Sukuk structure FAS 3 classification"
        },
        "sources": ["aaoifi_standards"],
        "expectedOutput": "AAOIFI FAS 3 relevant sections"
      },
      {
        "id": "generate_structure",
        "name": "Generate Structure Overview",
        "type": "generate",
        "instruction": "Write the structure overview section describing the Sukuk parties and flow",
        "axialParams": {
          "generateSection": "structure_overview",
          "requiredFields": ["issuer", "spv", "trustee", "investors", "flow_diagram"]
        },
        "sources": ["aaoifi_standards", "context"],
        "expectedOutput": "Markdown section: Structure Overview"
      },
      {
        "id": "generate_asset",
        "name": "Describe Underlying Asset",
        "type": "generate",
        "instruction": "Describe the underlying asset, its valuation, and ownership transfer",
        "axialParams": {
          "generateSection": "underlying_asset",
          "requiredFields": ["asset_type", "valuation", "ownership_mechanism"]
        },
        "sources": ["aaoifi_standards", "context"],
        "expectedOutput": "Markdown section: Underlying Asset"
      },
      {
        "id": "generate_profit",
        "name": "Explain Profit Distribution",
        "type": "generate",
        "instruction": "Explain how profits are calculated and distributed to Sukuk holders",
        "axialParams": {
          "generateSection": "profit_distribution",
          "requiredFields": ["calculation_method", "distribution_schedule", "waterfall"]
        },
        "sources": ["aaoifi_standards"],
        "expectedOutput": "Markdown section: Profit Distribution"
      },
      {
        "id": "validate_compliance",
        "name": "Validate Sharia Compliance",
        "type": "validate",
        "instruction": "Ensure document meets Sharia compliance requirements per AAOIFI",
        "axialParams": {
          "validationRules": [
            "No interest-based returns (riba)",
            "Asset ownership transfer documented",
            "Profit-sharing mechanism described",
            "Sharia board certification included"
          ]
        },
        "sources": ["aaoifi_standards"],
        "expectedOutput": "Validation report"
      },
      {
        "id": "generate_risks",
        "name": "Add Risk Disclosures",
        "type": "generate",
        "instruction": "Add risk disclosure section covering market, credit, and liquidity risks",
        "axialParams": {
          "generateSection": "risk_disclosures",
          "requiredFields": ["market_risk", "credit_risk", "liquidity_risk", "sharia_risk"]
        },
        "sources": [],
        "expectedOutput": "Markdown section: Risk Disclosures"
      }
    ],
    "requiredSources": ["AAOIFI FAS 3"],
    "outputFormat": "markdown",
    "estimatedDuration": 15,
    "complexity": "moderate"
  },
  "version": "1.0.0",
  "createdAt": "2025-01-07T00:00:00Z",
  "updatedAt": "2025-01-07T00:00:00Z",
  "executionCount": 0,
  "successRate": 0.0,
  "averageRating": 0.0
}
```

**Custom Workflow Creation**:
```typescript
// ClaudeChat component for custom workflow
const ClaudeChatForWorkflow = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I'll help you create a custom Islamic finance workflow.

What type of document do you need to generate? (e.g., "Mudaraba investment agreement", "Takaful insurance policy")

I'll then help you define:
1. The structure and sections
2. Required AAOIFI standards
3. Validation rules
4. Expected outputs`
    }
  ])

  // User chats with Claude to design workflow
  // Claude generates a WorkflowTemplate JSON
  // User approves and it gets saved
}
```

**Backend Endpoint** (`GET /api/workflows/templates`):
```python
@router.get("/templates")
async def list_workflow_templates():
    """
    Return all available workflow templates.

    Reads from backend/app/templates/*.json
    """
    templates = []
    templates_dir = Path(__file__).parent.parent / "templates"

    for template_file in templates_dir.glob("*.json"):
        with open(template_file) as f:
            template_data = json.load(f)
            templates.append(WorkflowTemplate(**template_data))

    logger.info(f"Loaded {len(templates)} workflow templates")
    return templates
```

---

### Step 3: Add Context

**Purpose**: Upload domain-specific documents and add text notes

**UI Components** (`Step3Context.tsx`):
- Tabbed interface: Upload | Text | Preview
- **Upload tab**: Drag-drop zone for PDF/DOCX/TXT/MD, file list with parsing status
- **Text tab**: Large textarea for free-form context (client details, specific requirements)
- **Preview tab**: Shows all context that will be available to Claude (uploaded docs + text)
- Total context size indicator
- "Ingest to Graphiti" button

**Learning Center Elements**:
```typescript
<Alert>
  <AlertTitle>Why Context Matters</AlertTitle>
  <AlertDescription>
    Claude will use this context when generating your document. For example:
    <ul className="mt-2 list-disc list-inside">
      <li><strong>Client documents</strong>: Previous agreements, asset descriptions</li>
      <li><strong>Text notes</strong>: Special requirements, tone preferences, client background</li>
      <li><strong>Data files</strong>: Financial projections, asset valuations</li>
    </ul>

    <p className="mt-2">All context is ingested as Graphiti Episodes so Claude can search
    and reference specific sections during execution.</p>
  </AlertDescription>
</Alert>
```

**Backend Endpoint** (`POST /api/context/upload`):
```python
@router.post("/upload")
async def upload_context(
    file: UploadFile,
    execution_id: str
):
    """
    Upload context document and ingest to Graphiti.

    Similar to AAOIFI ingestion but with different group_id:
    group_id = f"execution_{execution_id}_context"

    This allows Claude to search context specific to this execution.
    """
    content = await document_service.extract_text(file)

    # Ingest as single episode (context docs are usually shorter)
    episode_id = await graphiti_service.add_episode(
        name=f"Context: {file.filename}",
        episode_body=content,
        episode_type="text",
        group_id=f"execution_{execution_id}_context"
    )

    logger.info(f"Ingested context document {file.filename} as episode {episode_id}")

    return {
        "filename": file.filename,
        "episode_id": episode_id,
        "character_count": len(content)
    }

@router.post("/text")
async def add_text_context(
    text: str,
    execution_id: str
):
    """Add free-form text context."""
    if not text.strip():
        raise HTTPException(400, "Text context cannot be empty")

    episode_id = await graphiti_service.add_episode(
        name=f"Text Context: {execution_id}",
        episode_body=text,
        episode_type="text",
        group_id=f"execution_{execution_id}_context"
    )

    return {
        "episode_id": episode_id,
        "character_count": len(text)
    }
```

---

### Step 4: Configure Workflow (Open Code)

**Purpose**: Let user add natural language guidance to each workflow step

**UI Components** (`Step4Configure.tsx`):
- Two-column layout:
  - **Left**: Accordion of workflow steps (from selected template)
  - **Right**: Claude chat for iterating on workflow design
- Each accordion item has:
  - Step name and instruction
  - Textarea for "Open Code Notes" (user's guidance)
  - Collapsible "View Axial Code" (shows structured params)
  - Badge showing if user added notes
- "Iterate with Claude" button opens chat to refine workflow
- "Lock Configuration" button to finalize and proceed

**Learning Center Elements**:
```typescript
<Alert>
  <AlertTitle>Open Code vs Axial Code</AlertTitle>
  <AlertDescription>
    <p><strong>Open Code</strong> = Natural language guidance you write</p>
    <p>Example: "Emphasize the Sharia compliance certification. Use conservative
    language for risk disclosures. Include specific asset details from uploaded docs."</p>

    <p className="mt-2"><strong>Axial Code</strong> = Structured execution parameters</p>
    <p>Example: <code>{`{generateSection: "compliance", requiredFields: [...]}`}</code></p>

    <p className="mt-2">Claude executes the Axial Code but is guided by your Open Code.
    At the end, we convert your Open Code patterns into Axial Code improvements.</p>
  </AlertDescription>
</Alert>
```

**User Notes Storage**:
```typescript
// Store in execution state
const [userNotes, setUserNotes] = useState<Record<string, string>>({})

const updateStepNote = (stepId: string, note: string) => {
  setUserNotes(prev => ({
    ...prev,
    [stepId]: note
  }))

  // Save to backend
  api.updateExecution(executionId, { user_notes: userNotes })
}
```

**Claude Iteration** (optional, but powerful):
```typescript
// User can chat with Claude to refine the workflow
const iterateWithClaude = async (userMessage: string) => {
  const response = await api.chatWithClaude({
    context: {
      workflowTemplate: selectedWorkflow,
      userNotes: userNotes,
      executionState: execution
    },
    message: userMessage
  })

  // Claude can suggest:
  // - Additional steps
  // - Modified instructions
  // - New sources to include
  // - Validation rules
}
```

**Backend Endpoint** (`POST /api/execution/{id}/notes`):
```python
@router.post("/{execution_id}/notes")
async def update_user_notes(
    execution_id: str,
    notes: Dict[str, str]
):
    """
    Update open code notes for workflow steps.

    These notes will be injected into Claude prompts during execution.
    """
    execution = await get_execution(execution_id)
    execution.user_notes.update(notes)
    await save_execution(execution)

    logger.info(f"Updated notes for {len(notes)} steps in execution {execution_id}")
    return {"success": True, "notes_count": len(execution.user_notes)}
```

---

### Step 5: Live Execution with Claude Log

**Purpose**: Execute workflow with real-time streaming and interrupt capability

**UI Components** (`Step5Execute.tsx`):
- Three-column layout:
  - **Left (20%)**: Execution progress
    - Progress bar
    - Step list with status indicators (pending/running/complete/error)
  - **Middle (60%)**: Live Claude log
    - Streaming markdown content
    - Timestamped entries
    - Color-coded by type (info/query/response/error)
    - Auto-scroll to bottom
  - **Right (20%)**: Controls
    - "Interrupt" button (only enabled during execution)
    - Interrupt form (textarea + resume/cancel)
    - Execution stats (duration, tokens used)

**Learning Center Elements**:
```typescript
<Alert>
  <AlertTitle>What You're Seeing</AlertTitle>
  <AlertDescription>
    <p>This is Claude executing your workflow step-by-step:</p>
    <ul className="list-disc list-inside mt-2">
      <li><strong className="text-blue-600">Blue</strong>: Claude querying Graphiti for sources</li>
      <li><strong className="text-green-600">Green</strong>: Claude generating document sections</li>
      <li><strong className="text-yellow-600">Yellow</strong>: Validation checks</li>
      <li><strong className="text-red-600">Red</strong>: Errors or interruptions</li>
    </ul>

    <p className="mt-2">You can interrupt anytime to add guidance or correct course.</p>
  </AlertDescription>
</Alert>
```

**SSE Streaming Setup** (Frontend):
```typescript
const executeWorkflow = async () => {
  const eventSource = new EventSource(
    `/api/execution/${executionId}/execute`
  )

  eventSource.addEventListener('log', (event) => {
    const log = JSON.parse(event.data)
    setClaudeLog(prev => [...prev, log])
  })

  eventSource.addEventListener('step_complete', (event) => {
    const { step_index } = JSON.parse(event.data)
    setCompletedSteps(prev => [...prev, step_index])
  })

  eventSource.addEventListener('interrupted', (event) => {
    setIsInterrupted(true)
    setIsExecuting(false)
  })

  eventSource.addEventListener('complete', (event) => {
    const { final_document } = JSON.parse(event.data)
    setFinalDocument(final_document)
    setIsExecuting(false)
    eventSource.close()
  })

  eventSource.addEventListener('error', (event) => {
    console.error('SSE error:', event)
    setError('Execution failed. Check logs.')
    setIsExecuting(false)
    eventSource.close()
  })
}
```

**Execution Engine** (Backend):
```python
@router.get("/{execution_id}/execute")
async def execute_workflow(execution_id: str):
    """
    Execute workflow with SSE streaming.

    Returns: Server-Sent Events stream of execution log
    """
    async def event_generator():
        try:
            execution = await get_execution(execution_id)
            workflow = await get_workflow_template(execution.workflow_template_id)

            # Initialize
            yield {
                "event": "log",
                "data": json.dumps({
                    "timestamp": datetime.now().isoformat(),
                    "step_index": -1,
                    "type": "info",
                    "content": f"Starting workflow: {workflow.name}"
                })
            }

            # Execute each step
            for step_index, step in enumerate(workflow.axial_code.steps):
                # Check interrupt flag
                if await check_interrupt(execution_id):
                    yield {
                        "event": "interrupted",
                        "data": json.dumps({"step_index": step_index})
                    }
                    await wait_for_resume(execution_id)

                # Log step start
                yield {
                    "event": "log",
                    "data": json.dumps({
                        "timestamp": datetime.now().isoformat(),
                        "step_index": step_index,
                        "step_name": step.name,
                        "type": "info",
                        "content": f"**Step {step_index + 1}: {step.name}**\n\n{step.instruction}"
                    })
                }

                # Build prompt
                prompt = await workflow_engine.build_step_prompt(
                    step=step,
                    user_notes=execution.user_notes.get(step.id),
                    graphiti_context=await query_graphiti_for_step(step, execution),
                    previous_outputs=execution.execution_log
                )

                # Execute with Claude (streaming)
                step_output = ""
                async for chunk in claude_service.stream_completion(prompt):
                    step_output += chunk
                    yield {
                        "event": "log",
                        "data": json.dumps({
                            "timestamp": datetime.now().isoformat(),
                            "step_index": step_index,
                            "type": "response",
                            "content": chunk
                        })
                    }

                # Log step complete
                yield {
                    "event": "step_complete",
                    "data": json.dumps({
                        "step_index": step_index,
                        "output_length": len(step_output)
                    })
                }

            # Assemble final document
            final_document = await workflow_engine.assemble_document(
                execution.execution_log
            )

            # Save to execution
            execution.final_document = final_document
            execution.status = "completed"
            execution.completed_at = datetime.now()
            await save_execution(execution)

            # Complete
            yield {
                "event": "complete",
                "data": json.dumps({
                    "final_document": final_document,
                    "execution_id": execution_id
                })
            }

        except Exception as e:
            logger.error(f"Execution failed: {e}", exc_info=True)
            yield {
                "event": "error",
                "data": json.dumps({
                    "message": str(e),
                    "type": type(e).__name__
                })
            }

    return EventSourceResponse(event_generator())
```

**Interrupt/Resume**:
```python
# In-memory interrupt flags (can use Redis for production)
interrupt_flags: Dict[str, bool] = {}
resume_events: Dict[str, asyncio.Event] = {}

async def check_interrupt(execution_id: str) -> bool:
    return interrupt_flags.get(execution_id, False)

async def wait_for_resume(execution_id: str):
    """Block until resume signal received."""
    event = resume_events.get(execution_id)
    if not event:
        event = asyncio.Event()
        resume_events[execution_id] = event
    await event.wait()
    event.clear()
    interrupt_flags[execution_id] = False

@router.post("/{execution_id}/interrupt")
async def interrupt_execution(execution_id: str):
    """Set interrupt flag."""
    interrupt_flags[execution_id] = True
    logger.info(f"Interrupt requested for execution {execution_id}")
    return {"status": "interrupted"}

@router.post("/{execution_id}/resume")
async def resume_execution(
    execution_id: str,
    user_message: str
):
    """Resume with user guidance."""
    # Inject user message into execution log
    execution = await get_execution(execution_id)
    execution.interrupt_messages.append({
        "timestamp": datetime.now().isoformat(),
        "step_index": execution.current_step_index,
        "user_message": user_message
    })
    await save_execution(execution)

    # Signal resume
    event = resume_events.get(execution_id)
    if event:
        event.set()

    logger.info(f"Resumed execution {execution_id} with user message")
    return {"status": "resumed"}
```

---

### Step 6: Verify Sources

**Purpose**: Review all citations, approve or reject

**UI Components** (`Step6Verify.tsx`):
- List of citation cards
- Each card shows:
  - Source badge (AAOIFI/UserUpload/Graphiti/Claude)
  - Document title
  - Excerpt (max 500 chars)
  - Where used (section name)
  - Confidence score (colored bar)
  - Approve/Reject buttons
  - "View in Graph" link (opens Graphiti episode)
- Filters: All | Approved | Rejected | Pending
- "Add Manual Source" button
- Summary stats: Total sources, approval rate, confidence avg

**Citation Tracking**:
```python
# backend/app/services/citation_tracker.py

class CitationTracker:
    """Tracks all sources used during workflow execution."""

    def __init__(self):
        self.citations: Dict[str, Citation] = {}

    async def track_graphiti_query(
        self,
        execution_id: str,
        query: str,
        results: List[Dict],
        used_in_section: str
    ):
        """
        Track when Claude queries Graphiti.

        Each search result becomes a citation.
        """
        for result in results:
            citation = Citation(
                id=str(uuid4()),
                source="Graphiti",
                document_title=result.get("title", "Unknown"),
                document_ref=result.get("episode_id", ""),
                excerpt=result.get("content", "")[:500],
                used_in_section=used_in_section,
                confidence=result.get("score", 0.5),
                episode_id=result.get("episode_id"),
                timestamp=datetime.now()
            )

            self.citations[citation.id] = citation
            logger.info(f"Tracked citation from Graphiti: {citation.document_title}")

    async def track_claude_generation(
        self,
        execution_id: str,
        generated_content: str,
        used_in_section: str
    ):
        """Track when Claude generates content without sources."""
        citation = Citation(
            id=str(uuid4()),
            source="Claude",
            document_title="Claude-generated content",
            document_ref="",
            excerpt=generated_content[:500],
            used_in_section=used_in_section,
            confidence=0.8,  # Claude's own knowledge
            timestamp=datetime.now()
        )

        self.citations[citation.id] = citation

    def get_citations(self, execution_id: str) -> List[Citation]:
        return list(self.citations.values())
```

**Backend Endpoints** (`/api/citations`):
```python
@router.get("/{execution_id}")
async def get_citations(execution_id: str):
    """Get all citations for an execution."""
    execution = await get_execution(execution_id)
    return execution.citations

@router.post("/{citation_id}/approve")
async def approve_citation(citation_id: str, execution_id: str):
    """Approve a citation."""
    execution = await get_execution(execution_id)
    for citation in execution.citations:
        if citation.id == citation_id:
            citation.approved = True
            citation.rejected = False
            break
    await save_execution(execution)
    return {"success": True}

@router.post("/{citation_id}/reject")
async def reject_citation(
    citation_id: str,
    execution_id: str,
    reason: str
):
    """Reject a citation with reason."""
    execution = await get_execution(execution_id)
    for citation in execution.citations:
        if citation.id == citation_id:
            citation.approved = False
            citation.rejected = True
            citation.rejection_reason = reason
            break
    await save_execution(execution)
    return {"success": True}
```

---

### Step 7: Outcome & Download

**Purpose**: Display final document and enable downloads

**UI Components** (`Step7Outcome.tsx`):
- Two-column layout:
  - **Left (70%)**: Document preview
    - Tabs: Preview (rendered markdown) | Markdown (raw)
    - Scrollable with table of contents
  - **Right (30%)**: Download options
    - PDF button
    - DOCX button
    - Markdown button
    - Document metadata (workflow name, date, sources, confidence)
- "Edit Document" button (opens markdown editor)
- "Regenerate Section" dropdown (re-run specific steps)

**Document Assembly**:
```python
# backend/app/services/workflow_engine.py

async def assemble_document(execution_log: List[LogEntry]) -> str:
    """
    Assemble final document from execution log.

    Extracts all 'response' type entries from steps that generated content.
    """
    document_parts = []

    # Add header
    document_parts.append("# Islamic Finance Document\n\n")
    document_parts.append("*Generated with AI-powered workflow*\n\n")
    document_parts.append("---\n\n")

    # Extract content from each generation step
    for entry in execution_log:
        if entry.type == "response" and entry.metadata.get("is_section"):
            document_parts.append(entry.content)
            document_parts.append("\n\n")

    # Add footer with metadata
    document_parts.append("\n\n---\n\n")
    document_parts.append("## Document Metadata\n\n")
    document_parts.append(f"- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    document_parts.append(f"- Workflow: {execution.workflow_template_id}\n")
    document_parts.append(f"- Sources: {len(execution.citations)} references\n")

    return "".join(document_parts)
```

**Pandoc Integration**:
```python
# backend/app/services/document_service.py

import subprocess
from pathlib import Path

class DocumentService:
    def __init__(self):
        self.temp_dir = Path("/tmp/documents")
        self.temp_dir.mkdir(exist_ok=True)

    async def convert_to_pdf(
        self,
        markdown_content: str,
        metadata: Dict[str, str]
    ) -> Path:
        """
        Convert markdown to PDF using Pandoc.

        Learning Note:
        - We use the 'eisvogel' template for professional output
        - XeLaTeX engine for better Unicode support (Arabic text)
        - Metadata in YAML frontmatter
        """
        # Create temp markdown file with frontmatter
        doc_id = str(uuid4())
        md_file = self.temp_dir / f"{doc_id}.md"

        frontmatter = f"""---
title: {metadata.get('title', 'Islamic Finance Document')}
author: {metadata.get('author', 'AI Workflow System')}
date: {metadata.get('date', datetime.now().strftime('%Y-%m-%d'))}
---

"""

        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(frontmatter)
            f.write(markdown_content)

        # Run Pandoc
        pdf_file = self.temp_dir / f"{doc_id}.pdf"

        cmd = [
            "pandoc",
            str(md_file),
            "-o", str(pdf_file),
            "--pdf-engine=xelatex",
            "--template=eisvogel",  # Must be installed
            "--listings",  # For code blocks
            "--number-sections",
            "-V", "geometry:margin=1in"
        ]

        logger.info(f"Running Pandoc: {' '.join(cmd)}")

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            logger.error(f"Pandoc failed: {result.stderr}")
            raise Exception(f"PDF generation failed: {result.stderr}")

        logger.info(f"Generated PDF: {pdf_file}")
        return pdf_file

    async def convert_to_docx(
        self,
        markdown_content: str,
        metadata: Dict[str, str]
    ) -> Path:
        """Convert markdown to DOCX."""
        doc_id = str(uuid4())
        md_file = self.temp_dir / f"{doc_id}.md"

        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

        docx_file = self.temp_dir / f"{doc_id}.docx"

        cmd = [
            "pandoc",
            str(md_file),
            "-o", str(docx_file),
            "--reference-doc=template.docx"  # Optional: custom template
        ]

        result = subprocess.run(cmd, capture_output=True)

        if result.returncode != 0:
            raise Exception(f"DOCX generation failed: {result.stderr.decode()}")

        return docx_file
```

**Backend Endpoints** (`/api/documents`):
```python
@router.post("/convert")
async def convert_document(
    execution_id: str,
    format: Literal["pdf", "docx", "markdown"]
):
    """
    Convert final document to requested format.

    Returns: FileResponse for download
    """
    execution = await get_execution(execution_id)

    if not execution.final_document:
        raise HTTPException(400, "No document to convert")

    metadata = {
        "title": f"{execution.workflow_template_id.replace('_', ' ').title()}",
        "author": "Islamic Finance Workflow System",
        "date": datetime.now().strftime("%Y-%m-%d")
    }

    if format == "pdf":
        file_path = await document_service.convert_to_pdf(
            execution.final_document,
            metadata
        )
        media_type = "application/pdf"
    elif format == "docx":
        file_path = await document_service.convert_to_docx(
            execution.final_document,
            metadata
        )
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:  # markdown
        file_path = Path(f"/tmp/{execution_id}.md")
        with open(file_path, 'w') as f:
            f.write(execution.final_document)
        media_type = "text/markdown"

    filename = f"{execution.workflow_template_id}_{datetime.now().strftime('%Y%m%d')}.{format}"

    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=filename
    )
```

---

### Step 8: Learning Capture

**Purpose**: Extract patterns to improve workflow for next time

**UI Components** (`Step8Learn.tsx`):
- **Diff Viewer**: Side-by-side comparison
  - Left: Original workflow template
  - Right: Executed workflow (with user notes, interrupt messages)
  - Highlights: Added instructions, changed parameters
- **Open Code Changes**: List of user's natural language guidance
- **Extracted Learnings**: Auto-generated improvements
  - Each learning: Title, description, confidence score, checkbox
  - "View Code Change" collapsible (shows axial code diff)
- **Approve Learnings**: Checkboxes to select which to apply
- **Save to Template** button
- **Graphiti Ingestion**: "Save Execution to Knowledge Graph" button

**Learning Extraction Algorithm**:
```python
# backend/app/services/learning_extractor.py

class LearningExtractor:
    """
    Extract improvement patterns from workflow execution.

    Analyzes:
    1. User's open code notes
    2. Interrupt messages
    3. Citation approvals/rejections
    4. Execution success/failure
    """

    async def extract_learnings(
        self,
        execution: WorkflowExecution,
        template: WorkflowTemplate
    ) -> List[Learning]:
        """
        Main extraction method.

        Returns list of potential improvements.
        """
        learnings = []

        # Pattern 1: User consistently added same type of note
        note_patterns = await self._analyze_note_patterns(execution.user_notes)
        learnings.extend(note_patterns)

        # Pattern 2: User interrupted to add context
        interrupt_patterns = await self._analyze_interrupts(execution.interrupt_messages)
        learnings.extend(interrupt_patterns)

        # Pattern 3: Certain citations were rejected
        citation_patterns = await self._analyze_citation_rejections(execution.citations)
        learnings.extend(citation_patterns)

        # Pattern 4: Execution took longer than expected
        if execution.duration_seconds > template.axial_code.estimated_duration * 60 * 1.5:
            learnings.append(await self._suggest_optimization(execution, template))

        return learnings

    async def _analyze_note_patterns(
        self,
        user_notes: Dict[str, str]
    ) -> List[Learning]:
        """
        Analyze user notes for recurring patterns.

        Example:
        If user wrote "Emphasize Sharia compliance" for multiple steps,
        suggest adding this to template instruction.
        """
        learnings = []

        # Use Claude to analyze notes
        prompt = f"""Analyze these user notes from a workflow execution:

{json.dumps(user_notes, indent=2)}

Identify recurring themes or patterns. For each pattern:
1. What did the user consistently emphasize?
2. Should this be added to the template?
3. How would you phrase it as an instruction?

Respond in JSON:
{{
  "patterns": [
    {{
      "theme": "...",
      "instruction": "...",
      "confidence": 0.0-1.0
    }}
  ]
}}
"""

        response = await claude_service.analyze(prompt)
        patterns_data = json.loads(response)

        for pattern in patterns_data["patterns"]:
            if pattern["confidence"] > 0.6:
                learning = Learning(
                    id=str(uuid4()),
                    title=f"Add guidance: {pattern['theme']}",
                    description=f"User consistently mentioned: {pattern['theme']}",
                    category="instruction_improvement",
                    confidence=pattern["confidence"],
                    open_code_change=pattern["instruction"],
                    axial_code_change={
                        "type": "add_instruction",
                        "instruction": pattern["instruction"]
                    },
                    from_execution_id=execution.id,
                    user_behavior="Added notes to multiple steps",
                    impact="Will guide future executions automatically",
                    approved=False
                )
                learnings.append(learning)

        return learnings

    async def _analyze_interrupts(
        self,
        interrupt_messages: List[Dict]
    ) -> List[Learning]:
        """
        Analyze why user interrupted.

        If user added context during interrupt, suggest pre-fetching
        that context in the template.
        """
        learnings = []

        for interrupt in interrupt_messages:
            message = interrupt["user_message"]

            # If user added clarification, suggest adding query step
            if "clarify" in message.lower() or "need to" in message.lower():
                learning = Learning(
                    id=str(uuid4()),
                    title="Add context query step",
                    description=f"User interrupted to clarify: {message[:100]}...",
                    category="source_addition",
                    confidence=0.7,
                    open_code_change=f"Query for: {message}",
                    axial_code_change={
                        "type": "add_query_step",
                        "step_id": f"query_{uuid4().hex[:8]}",
                        "query": message
                    },
                    from_execution_id=execution.id,
                    user_behavior="Interrupted execution",
                    impact="Prevent future interrupts by proactively fetching",
                    approved=False
                )
                learnings.append(learning)

        return learnings

    async def _analyze_citation_rejections(
        self,
        citations: List[Citation]
    ) -> List[Learning]:
        """
        If user rejected citations from certain sources, suggest filtering.
        """
        rejected = [c for c in citations if c.rejected]

        if len(rejected) > 2:  # Pattern: multiple rejections
            learning = Learning(
                id=str(uuid4()),
                title="Filter unreliable sources",
                description=f"User rejected {len(rejected)} citations",
                category="parameter_tuning",
                confidence=0.8,
                open_code_change="Exclude low-confidence sources",
                axial_code_change={
                    "type": "add_source_filter",
                    "min_confidence": 0.7,
                    "exclude_documents": [c.document_title for c in rejected]
                },
                from_execution_id=execution.id,
                user_behavior="Rejected multiple citations",
                impact="Improve citation quality",
                approved=False
            )
            return [learning]

        return []
```

**Apply Learnings to Template**:
```python
async def apply_learning(
    learning: Learning,
    template: WorkflowTemplate
) -> WorkflowTemplate:
    """
    Apply approved learning to workflow template.

    Modifies template's axial code based on learning.
    """
    updated_template = template.copy(deep=True)

    change_type = learning.axial_code_change["type"]

    if change_type == "add_instruction":
        # Add instruction to relevant steps
        instruction = learning.axial_code_change["instruction"]
        for step in updated_template.axial_code.steps:
            if should_apply_to_step(step, learning):
                step.instruction += f"\n\nNote: {instruction}"

    elif change_type == "add_query_step":
        # Insert new query step
        new_step = WorkflowStep(
            id=learning.axial_code_change["step_id"],
            name="Context Query",
            type="query",
            instruction=learning.axial_code_change["query"],
            axial_params={"queryType": "graphiti_search"},
            sources=[]
        )
        updated_template.axial_code.steps.insert(0, new_step)

    elif change_type == "add_source_filter":
        # Add filtering to all query steps
        min_conf = learning.axial_code_change["min_confidence"]
        for step in updated_template.axial_code.steps:
            if step.type == "query":
                step.axial_params["min_confidence"] = min_conf

    # Update metadata
    updated_template.version = increment_version(template.version)
    updated_template.updated_at = datetime.now()
    updated_template.refinements.append({
        "id": learning.id,
        "description": learning.description,
        "applied_at": datetime.now().isoformat()
    })

    return updated_template
```

**Graphiti Ingestion of Execution**:
```python
@router.post("/{execution_id}/ingest")
async def ingest_execution_to_graphiti(execution_id: str):
    """
    Ingest entire execution as Graphiti Episode.

    This allows future workflows to learn from past executions.
    """
    execution = await get_execution(execution_id)
    template = await get_workflow_template(execution.workflow_template_id)

    # Build episode body
    episode_body = {
        "workflow_id": template.id,
        "workflow_name": template.name,
        "execution_id": execution.id,
        "user_id": execution.user_id,
        "success": execution.status == "completed",
        "duration_seconds": execution.duration_seconds,

        # User guidance
        "user_notes": execution.user_notes,
        "interrupt_messages": [
            {"timestamp": im["timestamp"], "message": im["user_message"]}
            for im in execution.interrupt_messages
        ],

        # Outputs
        "final_document_preview": execution.final_document[:1000],
        "document_length": len(execution.final_document),

        # Citations
        "citation_count": len(execution.citations),
        "approved_citations": len([c for c in execution.citations if c.approved]),
        "rejected_citations": len([c for c in execution.citations if c.rejected]),

        # Learnings
        "learnings_extracted": len(execution.extracted_learnings),
        "learnings_applied": len([l for l in execution.extracted_learnings if l["appliedToTemplate"]]),

        # Feedback
        "user_feedback": execution.user_feedback
    }

    # Ingest
    episode_id = await graphiti_service.add_episode(
        name=f"Execution: {template.name} - {execution.started_at}",
        episode_body=json.dumps(episode_body),
        episode_type="json",
        group_id=f"workflow_{template.id}_executions",
        reference_time=execution.started_at
    )

    logger.info(f"Ingested execution {execution_id} as episode {episode_id}")

    return {
        "episode_id": episode_id,
        "success": True
    }
```

---

## API Endpoints

### Complete API Reference

```
# Sources (Step 1)
POST   /api/sources/test-connection          Test Graphiti MCP connection
POST   /api/sources/ingest-aaoifi            Upload & ingest AAOIFI doc
GET    /api/sources/status                   Get connection status
GET    /api/sources/stats                    Get Graphiti stats

# Workflows (Step 2)
GET    /api/workflows/templates              List all workflow templates
GET    /api/workflows/templates/{id}         Get specific template
POST   /api/workflows/custom                 Create custom workflow with Claude
PUT    /api/workflows/templates/{id}         Update template (after learning)

# Context (Step 3)
POST   /api/context/upload                   Upload context document
POST   /api/context/text                     Add text context
GET    /api/context/{execution_id}           Get all context for execution

# Execution (Steps 4-5)
POST   /api/execution                        Create new execution
GET    /api/execution/{id}                   Get execution state
PUT    /api/execution/{id}/notes             Update user notes (Step 4)
GET    /api/execution/{id}/execute           Execute workflow (SSE stream) (Step 5)
POST   /api/execution/{id}/interrupt         Interrupt execution
POST   /api/execution/{id}/resume            Resume with guidance

# Citations (Step 6)
GET    /api/citations/{execution_id}         Get all citations
POST   /api/citations/{id}/approve           Approve citation
POST   /api/citations/{id}/reject            Reject citation

# Documents (Step 7)
GET    /api/documents/{execution_id}         Get final document (markdown)
POST   /api/documents/convert                Convert to PDF/DOCX/MD
GET    /api/documents/download/{file_id}     Download generated file

# Learning (Step 8)
GET    /api/learning/{execution_id}          Get extracted learnings
POST   /api/learning/approve                 Approve learnings
POST   /api/learning/apply                   Apply learnings to template
POST   /api/learning/ingest                  Ingest execution to Graphiti

# Utility
GET    /api/health                           Health check
GET    /api/logs/{execution_id}              Get execution logs
```

---

## Error Handling & Logging

### Error Handling Strategy

**Frontend**:
```typescript
// Every API call should have error handling
try {
  const result = await api.executeWorkflow(executionId)
} catch (error) {
  if (error.status === 400) {
    // User error - show helpful message
    toast.error("Please complete all required fields before executing")
  } else if (error.status === 500) {
    // Server error - show technical details
    toast.error(`Execution failed: ${error.message}. Check logs for details.`)
  } else {
    // Network error
    toast.error("Network error. Please check your connection.")
  }

  // Log for debugging
  console.error("Execution error:", error)
}
```

**Backend**:
```python
# Use custom exception classes
class WorkflowExecutionError(Exception):
    """Raised when workflow execution fails."""
    pass

class GraphitiConnectionError(Exception):
    """Raised when Graphiti MCP is unavailable."""
    pass

# Every endpoint should handle errors
@router.post("/execute")
async def execute_workflow(execution_id: str):
    try:
        # ... execution logic
        pass
    except GraphitiConnectionError as e:
        logger.error(f"Graphiti connection failed: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Graphiti MCP unavailable",
                "message": str(e),
                "suggestion": "Check that Graphiti MCP server is running"
            }
        )
    except WorkflowExecutionError as e:
        logger.error(f"Workflow execution failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Workflow execution failed",
                "message": str(e),
                "execution_id": execution_id
            }
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "message": str(e)
            }
        )
```

### Logging Strategy

**Log Levels**:
- `DEBUG`: Detailed internal state (only in development)
- `INFO`: High-level operations (workflow started, step completed)
- `WARNING`: Recoverable issues (low confidence citation, timeout)
- `ERROR`: Failures (execution error, API call failed)

**What to Log**:
```python
# Always log:
# 1. Start/end of major operations
logger.info(f"Starting workflow execution {execution_id}")
logger.info(f"Completed step {step_index}: {step.name}")

# 2. API calls to external services
logger.info(f"Calling Claude API with {len(prompt)} character prompt")
logger.debug(f"Claude response: {response[:100]}...")

# 3. Graphiti operations
logger.info(f"Searching Graphiti: {query}")
logger.info(f"Found {len(results)} results")

# 4. User actions
logger.info(f"User interrupted execution at step {step_index}")
logger.info(f"User approved {len(approved)} citations")

# 5. Errors with context
logger.error(
    f"Failed to generate PDF",
    exc_info=True,
    extra={"execution_id": execution_id, "file_size": len(markdown)}
)

# Don't log:
# - Sensitive data (API keys, user content)
# - Full documents (just length or preview)
# - Redundant info (log once, not in loop)
```

**Learning Center: Expose Logs to UI**:
```typescript
// Show logs in UI for transparency
const LogViewer = ({ executionId }) => {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    // Fetch logs from backend
    api.getLogs(executionId).then(setLogs)
  }, [executionId])

  return (
    <Card>
      <CardHeader>
        <h3>System Logs</h3>
        <p className="text-sm text-muted-foreground">
          Internal operations for debugging and learning
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {logs.map(log => (
            <div key={log.id} className="font-mono text-xs">
              <Badge className={getBadgeColor(log.level)}>
                {log.level}
              </Badge>
              <span className="text-muted-foreground">{log.timestamp}</span>
              <span>{log.message}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
```

---

## Setup & Configuration

### Environment Variables

```bash
# .env

# === Claude API ===
ANTHROPIC_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=16384
CLAUDE_TEMPERATURE=0.7

# === Graphiti MCP ===
# Graphiti is accessed via MCP - no API key needed if running locally
# If using remote Graphiti:
GRAPHITI_MCP_URL=http://localhost:8080
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# === FastAPI ===
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000

# === Development ===
LOG_LEVEL=INFO
DEBUG=true
```

### Installation Steps

```bash
# 1. Clone/create project
mkdir islamic-finance-workflows
cd islamic-finance-workflows

# 2. Frontend setup
cd frontend
npm install
npm run dev

# 3. Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 4. Neo4j & Graphiti
docker run -p 7687:7687 -p 7474:7474 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:5-community

# Start Graphiti MCP server
# (Follow blade-graphiti MCP documentation)

# 5. Install Pandoc (system dependency)
# macOS: brew install pandoc
# Ubuntu: apt-get install pandoc texlive-xetex
# Windows: Download from https://pandoc.org/installing.html

# 6. Install Eisvogel template (optional, for better PDFs)
wget https://github.com/Wandmalfarbe/pandoc-latex-template/releases/download/v2.4.2/Eisvogel-2.4.2.tar.gz
tar xzf Eisvogel-2.4.2.tar.gz
mkdir -p ~/.pandoc/templates
cp eisvogel.latex ~/.pandoc/templates/
```

### Dependencies

**Frontend** (`frontend/package.json`):
```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zustand": "4.5.2",
    "react-markdown": "9.0.1",
    "react-diff-viewer-continued": "3.4.0",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "lucide-react": "^0.487.0",
    "tailwindcss": "3.4.1"
  }
}
```

**Backend** (`backend/pyproject.toml`):
```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.104.0"
uvicorn = {extras = ["standard"], version = "^0.24.0"}
anthropic = "^0.25.0"
pydantic = "^2.5.0"
python-multipart = "^0.0.6"
PyPDF2 = "^3.0.1"
python-docx = "^1.1.0"
```

---

## Testing Strategy

### Unit Tests

```python
# backend/tests/test_learning_extractor.py

def test_extract_note_patterns():
    """Test that recurring note themes are detected."""
    extractor = LearningExtractor()

    user_notes = {
        "step1": "Emphasize Sharia compliance",
        "step2": "Make sure Sharia compliance is clear",
        "step3": "Add more detail on Sharia compliance"
    }

    learnings = await extractor._analyze_note_patterns(user_notes)

    assert len(learnings) > 0
    assert "Sharia compliance" in learnings[0].description
    assert learnings[0].confidence > 0.6
```

### Integration Tests

```python
# backend/tests/test_end_to_end.py

async def test_full_sukuk_workflow():
    """Test complete workflow from start to finish."""

    # Step 1: Ingest AAOIFI
    aaoifi_response = await client.post(
        "/api/sources/ingest-aaoifi",
        files={"file": open("tests/fixtures/aaoifi_fas3.pdf", "rb")}
    )
    assert aaoifi_response.status_code == 200

    # Step 2: Select workflow
    templates_response = await client.get("/api/workflows/templates")
    sukuk_template = [t for t in templates_response.json() if t["id"] == "sukuk_issuance"][0]

    # Step 3: Create execution
    execution_response = await client.post(
        "/api/execution",
        json={"workflow_template_id": sukuk_template["id"]}
    )
    execution_id = execution_response.json()["id"]

    # Step 4: Add context
    context_response = await client.post(
        "/api/context/text",
        json={
            "execution_id": execution_id,
            "text": "Client: ABC Bank. Asset: Commercial real estate."
        }
    )
    assert context_response.status_code == 200

    # Step 5: Execute (simplified - normally would test SSE)
    # ... execution logic

    # Step 6: Verify document generated
    doc_response = await client.get(f"/api/documents/{execution_id}")
    document = doc_response.json()["final_document"]
    assert len(document) > 1000
    assert "Sukuk" in document
    assert "Sharia" in document
```

---

## Deployment

### Docker Setup

```dockerfile
# Dockerfile (Backend)

FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pandoc \
    texlive-xetex \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# Dockerfile (Frontend)

FROM node:20-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml

version: '3.8'

services:
  neo4j:
    image: neo4j:5-community
    ports:
      - "7687:7687"
      - "7474:7474"
    environment:
      NEO4J_AUTH: neo4j/password
    volumes:
      - neo4j_data:/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - NEO4J_URI=bolt://neo4j:7687
      - NEO4J_PASSWORD=password
    depends_on:
      - neo4j
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend

volumes:
  neo4j_data:
```

---

## Summary

This specification provides a complete blueprint for building the Islamic Finance Workflows application. Key design principles:

1. **Production-Ready**: Real APIs, real workflows, real documents
2. **Educational**: Every component teaches through comments and transparency
3. **Simple**: Uses Claude SDK and MCP directly, no overengineering
4. **Maintainable**: Clear separation of concerns, typed interfaces
5. **Learning-Oriented**: Continuously improves workflows through user feedback

Next steps:
1. Set up project structure
2. Implement Step 1 (Source Connection)
3. Build iteratively through all 8 steps
4. Test with real AAOIFI documents
5. Refine based on user feedback
