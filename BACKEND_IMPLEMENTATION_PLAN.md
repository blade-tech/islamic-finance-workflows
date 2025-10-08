# Backend Implementation Plan
## Islamic Finance Workflows - Railway Deployment

**Version**: 1.0
**Target Platform**: Railway (Monorepo with 2 services)
**Purpose**: Complete backend implementation for demo/reference application

---

## Executive Summary

This plan implements the missing backend services to complete the Islamic Finance Workflows mini app. The backend supports an 8-step workflow system with Claude AI execution, document processing, citation tracking, and learning extraction.

**Current State**:
- ✅ Graphiti integration working (graphiti_service.py - 245 lines)
- ✅ All Pydantic models defined (models.py)
- ✅ Neo4j AuraDB connected (987 nodes, 6,583 edges)
- ✅ Environment configured (.env with all credentials)
- ⚠️ Only 6/15 endpoints implemented (9 placeholders)
- ⚠️ Only 1/6 services implemented
- ⚠️ No workflow templates exist
- ⚠️ No execution engine

**Target State**:
- All 15 API endpoints functional
- 6 services fully implemented
- 5 workflow templates created
- Claude SSE streaming working
- Document generation (PDF/DOCX/Markdown)
- Citation tracking operational
- Learning extraction functional
- Railway deployment ready

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Railway Project                          │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │  Frontend Service│         │   Backend Service        │  │
│  │  (Next.js 14)   │────────▶│   (FastAPI + Pandoc)     │  │
│  │  Port: 3000     │         │   Port: 8000             │  │
│  └──────────────────┘         └──────────────────────────┘  │
│                                         │                     │
│                                         ▼                     │
│                               ┌──────────────────┐           │
│                               │  Neo4j AuraDB    │           │
│                               │  (External SaaS) │           │
│                               └──────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

**Service Dependencies**:
- Frontend → Backend API (all 15 endpoints)
- Backend → Neo4j AuraDB (Graphiti knowledge graph)
- Backend → Anthropic API (Claude Sonnet 4.5)
- Backend → OpenAI API (embeddings for Graphiti)
- Backend → Pandoc binary (PDF/DOCX generation)

---

## Phase 1: Foundation Services (Days 1-2)

### 1.1 Document Service (`backend/app/services/document_service.py`)

**Purpose**: Handle document ingestion and generation

**Key Responsibilities**:
- Parse uploaded PDF/DOCX files to text
- Ingest parsed content into Graphiti as episodes
- Generate output documents (PDF/DOCX/Markdown) using Pandoc
- Track document metadata

**Implementation Details**:

```python
class DocumentService:
    def __init__(self):
        self.graphiti_service = get_graphiti_service()
        self.pandoc_available = self._check_pandoc()

    async def ingest_document(
        self,
        file: UploadFile,
        doc_type: Literal['aaoifi', 'context']
    ) -> UploadedDocument:
        """Parse and ingest document into Graphiti"""
        # 1. Extract text based on file type
        if file.filename.endswith('.pdf'):
            text = self._parse_pdf(file)
        elif file.filename.endswith('.docx'):
            text = self._parse_docx(file)
        elif file.filename.endswith('.txt'):
            text = await file.read()
        else:
            raise ValueError(f"Unsupported file type: {file.filename}")

        # 2. Ingest into Graphiti with group_id = doc_type
        episode_uuid = await self.graphiti_service.ingest_document(
            content=text,
            doc_id=str(uuid4()),
            filename=file.filename,
            doc_type=doc_type  # 'aaoifi' or 'context'
        )

        # 3. Return metadata
        return UploadedDocument(
            id=episode_uuid,
            filename=file.filename,
            type=doc_type,
            size=file.size,
            uploaded_at=datetime.now()
        )

    def _parse_pdf(self, file: UploadFile) -> str:
        """Extract text from PDF using PyPDF2"""
        import PyPDF2
        reader = PyPDF2.PdfReader(file.file)
        return "\n\n".join(page.extract_text() for page in reader.pages)

    def _parse_docx(self, file: UploadFile) -> str:
        """Extract text from DOCX using python-docx"""
        from docx import Document
        doc = Document(file.file)
        return "\n\n".join(para.text for para in doc.paragraphs)

    async def generate_document(
        self,
        content: str,
        format: Literal['pdf', 'docx', 'markdown'],
        metadata: dict
    ) -> bytes:
        """Generate document using Pandoc"""
        if format == 'markdown':
            return content.encode('utf-8')

        if not self.pandoc_available:
            raise RuntimeError("Pandoc not available")

        # Write content to temp markdown file
        import tempfile
        import subprocess

        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(content)
            input_file = f.name

        # Generate output using Pandoc
        output_file = f"{input_file}.{format}"

        subprocess.run([
            'pandoc',
            input_file,
            '-o', output_file,
            '--metadata', f'title={metadata.get("title", "Document")}',
            '--metadata', f'author={metadata.get("author", "Islamic Finance Workflows")}',
            '--pdf-engine=xelatex' if format == 'pdf' else ''
        ], check=True)

        # Read and return
        with open(output_file, 'rb') as f:
            return f.read()

    def _check_pandoc(self) -> bool:
        """Check if Pandoc is available"""
        import shutil
        return shutil.which('pandoc') is not None
```

**Dependencies to Add**:
```txt
PyPDF2==3.0.1
python-docx==1.1.0
python-multipart==0.0.6  # For file uploads
```

**API Endpoint** (`backend/app/api/documents.py`):
```python
@router.post("/documents/ingest", response_model=UploadedDocument)
async def ingest_document(
    file: UploadFile = File(...),
    type: Literal['aaoifi', 'context'] = Form(...)
):
    service = get_document_service()
    return await service.ingest_document(file, type)

@router.post("/documents/generate")
async def generate_document(
    execution_id: str,
    format: Literal['pdf', 'docx', 'markdown']
):
    service = get_document_service()
    # Fetch execution outcome from store
    # Generate document
    # Return as download
```

### 1.2 Claude Service (`backend/app/services/claude_service.py`)

**Purpose**: Manage Claude API interactions with SSE streaming

**Key Responsibilities**:
- Stream Claude responses via SSE
- Handle tool use (Graphiti search during execution)
- Manage conversation context
- Support interrupt/resume

**Implementation Details**:

```python
from anthropic import AsyncAnthropic
import asyncio
from typing import AsyncIterator

class ClaudeService:
    def __init__(self):
        self.client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-5-20250929")
        self.graphiti_service = get_graphiti_service()

    async def stream_execution(
        self,
        system_prompt: str,
        user_prompt: str,
        execution_id: str
    ) -> AsyncIterator[str]:
        """
        Stream Claude response with SSE

        Yields JSON strings in format:
        {"type": "content", "data": "text chunk"}
        {"type": "tool_use", "data": {"tool": "search", "query": "..."}}
        {"type": "thinking", "data": "reasoning..."}
        {"type": "done"}
        """

        messages = [{"role": "user", "content": user_prompt}]

        async with self.client.messages.stream(
            model=self.model,
            max_tokens=8000,
            system=system_prompt,
            messages=messages,
            tools=[self._get_search_tool()]
        ) as stream:
            async for event in stream:
                # Handle different event types
                if event.type == "content_block_delta":
                    if hasattr(event.delta, 'text'):
                        yield json.dumps({
                            "type": "content",
                            "data": event.delta.text
                        })

                elif event.type == "content_block_start":
                    if hasattr(event.content_block, 'type'):
                        if event.content_block.type == "tool_use":
                            # Tool use started
                            yield json.dumps({
                                "type": "tool_use_start",
                                "data": {
                                    "tool": event.content_block.name,
                                    "id": event.content_block.id
                                }
                            })

                # Handle tool results
                if hasattr(event, 'tool_use'):
                    tool_result = await self._handle_tool_use(event.tool_use)
                    yield json.dumps({
                        "type": "tool_result",
                        "data": tool_result
                    })

        yield json.dumps({"type": "done"})

    def _get_search_tool(self) -> dict:
        """Define Graphiti search tool for Claude"""
        return {
            "name": "search_graphiti",
            "description": "Search the knowledge graph for AAOIFI standards and context documents",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    },
                    "group_ids": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Filter by document type: ['aaoifi'] or ['context']"
                    }
                },
                "required": ["query"]
            }
        }

    async def _handle_tool_use(self, tool_use) -> dict:
        """Execute tool and return results"""
        if tool_use.name == "search_graphiti":
            results = await self.graphiti_service.search(
                query=tool_use.input.get("query"),
                group_ids=tool_use.input.get("group_ids"),
                num_results=10
            )
            return {
                "tool_use_id": tool_use.id,
                "results": results
            }
```

**API Endpoint** (`backend/app/api/workflows.py`):
```python
from sse_starlette.sse import EventSourceResponse

@router.get("/workflows/{execution_id}/stream")
async def stream_claude(execution_id: str):
    """SSE endpoint for Claude streaming"""

    service = get_claude_service()
    engine = get_workflow_engine()

    # Get execution context
    execution = engine.get_execution(execution_id)

    async def event_generator():
        async for chunk in service.stream_execution(
            system_prompt=execution.system_prompt,
            user_prompt=execution.user_prompt,
            execution_id=execution_id
        ):
            yield {
                "event": "message",
                "data": chunk
            }

    return EventSourceResponse(event_generator())
```

**Dependencies to Add**:
```txt
anthropic==0.39.0
sse-starlette==2.1.3
```

### 1.3 Workflow Templates (`backend/app/templates/`)

**Purpose**: Define the 5 Islamic finance workflow configurations

**Template Structure**:
```json
{
  "id": "workflow_id",
  "title": "Workflow Title",
  "description": "Brief description",
  "category": "structuring|screening|documentation|reconciliation|reporting",
  "system_prompt": "System instructions for Claude...",
  "user_prompt_template": "Template with {{variables}}",
  "required_documents": ["aaoifi", "context"],
  "expected_outcome": "Description of expected result",
  "citation_requirements": {
    "min_aaoifi_citations": 3,
    "require_specific_standards": ["FAS 1", "FAS 2"]
  }
}
```

**Templates to Create**:

1. **`murabaha_structuring.json`** - Murabaha transaction structuring
2. **`sukuk_compliance_review.json`** - Sukuk compliance analysis
3. **`shariah_screening.json`** - Investment screening
4. **`contract_documentation.json`** - Contract template generation
5. **`portfolio_reconciliation.json`** - Portfolio compliance check

**Example Template** (`murabaha_structuring.json`):
```json
{
  "id": "murabaha_structuring",
  "title": "Murabaha Transaction Structuring",
  "description": "Structure a Murabaha transaction with AAOIFI compliance",
  "category": "structuring",
  "system_prompt": "You are an Islamic finance expert specializing in Murabaha transactions. Your task is to structure a compliant Murabaha transaction based on AAOIFI Financial Accounting Standard (FAS) 2.\n\nYou MUST:\n1. Search the knowledge graph for AAOIFI FAS 2 requirements\n2. Cite specific standard sections for each requirement\n3. Ensure proper sequence: commodity purchase, ownership, sale to customer\n4. Calculate profit margins and payment terms\n5. Identify potential Shariah concerns\n\nUse the search_graphiti tool to find relevant AAOIFI standards and context.",
  "user_prompt_template": "Structure a Murabaha transaction with the following details:\n\nTransaction Amount: {{amount}}\nCustomer: {{customer}}\nCommodity: {{commodity}}\nPayment Terms: {{payment_terms}}\n\nAdditional Context:\n{{additional_context}}\n\nProvide a complete transaction structure with:\n1. Step-by-step process flow\n2. AAOIFI compliance points with citations\n3. Documentation requirements\n4. Risk considerations",
  "required_documents": ["aaoifi"],
  "optional_documents": ["context"],
  "expected_outcome": "Structured Murabaha transaction with compliance verification",
  "citation_requirements": {
    "min_aaoifi_citations": 5,
    "require_specific_standards": ["FAS 2"],
    "citation_format": "AAOIFI [Standard] Section [X]"
  },
  "learning_patterns": [
    "Common Shariah concerns",
    "Documentation gaps",
    "Compliance best practices"
  ]
}
```

**Template Loader** (`backend/app/services/template_service.py`):
```python
class TemplateService:
    def __init__(self):
        self.templates_dir = Path(__file__).parent.parent / "templates"
        self._templates = {}
        self._load_templates()

    def _load_templates(self):
        """Load all JSON templates on initialization"""
        for file in self.templates_dir.glob("*.json"):
            with open(file) as f:
                template = json.load(f)
                self._templates[template["id"]] = template

    def get_template(self, workflow_id: str) -> WorkflowTemplate:
        """Get template by ID"""
        if workflow_id not in self._templates:
            raise ValueError(f"Template not found: {workflow_id}")

        data = self._templates[workflow_id]
        return WorkflowTemplate(**data)

    def list_templates(self) -> List[WorkflowTemplate]:
        """Get all templates"""
        return [WorkflowTemplate(**t) for t in self._templates.values()]

    def render_user_prompt(self, workflow_id: str, variables: dict) -> str:
        """Render template with variables"""
        template = self._templates[workflow_id]
        prompt = template["user_prompt_template"]

        # Simple variable substitution
        for key, value in variables.items():
            prompt = prompt.replace(f"{{{{{key}}}}}", str(value))

        return prompt
```

---

## Phase 2: Execution Engine (Days 3-4)

### 2.1 Workflow Engine (`backend/app/services/workflow_engine.py`)

**Purpose**: Orchestrate workflow execution lifecycle

**Key Responsibilities**:
- Manage execution state (in-memory store or Redis)
- Coordinate Claude streaming
- Handle interrupts and resumption
- Track citations in real-time
- Store logs

**Implementation Details**:

```python
from datetime import datetime
from typing import Dict, Optional
import asyncio

class WorkflowEngine:
    def __init__(self):
        self.executions: Dict[str, WorkflowExecution] = {}
        self.claude_service = get_claude_service()
        self.template_service = get_template_service()
        self.citation_tracker = CitationTracker()

    async def start_execution(
        self,
        workflow_id: str,
        user_variables: dict,
        uploaded_documents: List[str]
    ) -> str:
        """Initialize and start workflow execution"""

        # 1. Get template
        template = self.template_service.get_template(workflow_id)

        # 2. Render prompts
        user_prompt = self.template_service.render_user_prompt(
            workflow_id,
            user_variables
        )

        # 3. Create execution record
        execution_id = f"exec_{uuid4().hex[:12]}"
        execution = WorkflowExecution(
            id=execution_id,
            workflow_id=workflow_id,
            status="running",
            started_at=datetime.now(),
            system_prompt=template.system_prompt,
            user_prompt=user_prompt,
            uploaded_documents=uploaded_documents,
            logs=[],
            citations=[],
            outcome=None
        )

        self.executions[execution_id] = execution

        # 4. Log start
        self._add_log(execution_id, "info", "Workflow execution started")

        return execution_id

    def get_execution(self, execution_id: str) -> WorkflowExecution:
        """Get execution state"""
        if execution_id not in self.executions:
            raise ValueError(f"Execution not found: {execution_id}")
        return self.executions[execution_id]

    async def interrupt_execution(
        self,
        execution_id: str,
        user_message: str
    ):
        """Handle user interrupt during execution"""
        execution = self.get_execution(execution_id)

        # Update status
        execution.status = "interrupted"
        execution.interrupted_at = datetime.now()

        # Add interrupt message to conversation history
        self._add_log(execution_id, "interrupt", user_message)

        # Store interrupt for resume
        execution.interrupt_message = user_message

    async def resume_execution(self, execution_id: str):
        """Resume interrupted execution"""
        execution = self.get_execution(execution_id)

        if execution.status != "interrupted":
            raise ValueError("Execution is not interrupted")

        execution.status = "running"
        self._add_log(execution_id, "info", "Execution resumed")

        # Continue streaming with updated context
        # (handled by stream endpoint)

    def complete_execution(
        self,
        execution_id: str,
        outcome: str
    ):
        """Mark execution as complete"""
        execution = self.get_execution(execution_id)

        execution.status = "completed"
        execution.completed_at = datetime.now()
        execution.outcome = outcome

        self._add_log(execution_id, "success", "Workflow completed")

    def _add_log(
        self,
        execution_id: str,
        level: str,
        message: str
    ):
        """Add log entry"""
        execution = self.executions[execution_id]
        execution.logs.append(LogEntry(
            timestamp=datetime.now(),
            level=level,
            message=message
        ))

    def track_citation(
        self,
        execution_id: str,
        citation: Citation
    ):
        """Track citation during execution"""
        execution = self.executions[execution_id]
        execution.citations.append(citation)
```

### 2.2 Citation Tracking System

**Purpose**: Extract and verify citations from Claude output

**Implementation** (within `workflow_engine.py`):

```python
class CitationTracker:
    def __init__(self):
        self.graphiti_service = get_graphiti_service()

    async def extract_citations(
        self,
        text: str,
        execution_id: str
    ) -> List[Citation]:
        """
        Extract citations from Claude output

        Expected format: "According to AAOIFI FAS 2 Section 5.1..."
        """
        import re

        citations = []

        # Pattern: AAOIFI [Standard] Section [X]
        pattern = r'AAOIFI\s+([A-Z]+\s*\d+)\s+Section\s+([\d.]+)'

        matches = re.finditer(pattern, text, re.IGNORECASE)

        for match in matches:
            standard = match.group(1)
            section = match.group(2)
            context = text[max(0, match.start()-100):match.end()+100]

            # Verify citation exists in knowledge graph
            verified = await self._verify_citation(standard, section)

            citations.append(Citation(
                source=f"AAOIFI {standard}",
                section=section,
                text=match.group(0),
                context=context,
                verified=verified,
                page_number=None  # Could extract if available
            ))

        return citations

    async def _verify_citation(
        self,
        standard: str,
        section: str
    ) -> bool:
        """Verify citation exists in Graphiti"""
        results = await self.graphiti_service.search(
            query=f"{standard} Section {section}",
            group_ids=["aaoifi"],
            num_results=5
        )

        # Check if any result matches
        return len(results) > 0
```

### 2.3 Learning Extraction System

**Purpose**: Extract reusable insights from workflow outcomes

**Implementation** (`backend/app/services/learning_service.py`):

```python
class LearningService:
    def __init__(self):
        self.graphiti_service = get_graphiti_service()
        self.claude_service = get_claude_service()

    async def extract_learnings(
        self,
        execution: WorkflowExecution
    ) -> List[Learning]:
        """
        Extract learnings from completed workflow

        Uses Claude to analyze the workflow outcome and extract patterns
        """

        if not execution.outcome:
            return []

        # Use Claude to extract insights
        extraction_prompt = f"""
        Analyze this Islamic finance workflow execution and extract reusable learnings.

        Workflow: {execution.workflow_id}
        Outcome: {execution.outcome}
        Citations: {len(execution.citations)} found

        Extract:
        1. Common Shariah concerns identified
        2. Documentation patterns that worked well
        3. Compliance best practices demonstrated
        4. Edge cases or special considerations

        Format each learning as:
        - Pattern: [description]
        - Context: [when this applies]
        - Example: [from this workflow]
        """

        # Get extraction from Claude
        learnings_text = await self._get_claude_extraction(extraction_prompt)

        # Parse and structure
        learnings = self._parse_learnings(learnings_text, execution)

        # Store in Graphiti for future use
        await self._store_learnings(learnings)

        return learnings

    async def _get_claude_extraction(self, prompt: str) -> str:
        """Use Claude to extract learnings"""
        # Simple non-streaming call for extraction
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic()

        response = await client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )

        return response.content[0].text

    def _parse_learnings(
        self,
        text: str,
        execution: WorkflowExecution
    ) -> List[Learning]:
        """Parse Claude response into Learning objects"""
        # Simple parsing logic
        learnings = []

        lines = text.split('\n')
        current_learning = {}

        for line in lines:
            if line.startswith('- Pattern:'):
                if current_learning:
                    learnings.append(Learning(**current_learning))
                current_learning = {
                    "pattern": line.replace('- Pattern:', '').strip(),
                    "context": "",
                    "example": "",
                    "workflow_id": execution.workflow_id,
                    "extracted_at": datetime.now()
                }
            elif line.startswith('- Context:'):
                current_learning["context"] = line.replace('- Context:', '').strip()
            elif line.startswith('- Example:'):
                current_learning["example"] = line.replace('- Example:', '').strip()

        if current_learning:
            learnings.append(Learning(**current_learning))

        return learnings

    async def _store_learnings(self, learnings: List[Learning]):
        """Store learnings in Graphiti for future retrieval"""
        for learning in learnings:
            episode_content = f"""
            Learning Pattern: {learning.pattern}
            Context: {learning.context}
            Example: {learning.example}
            Workflow: {learning.workflow_id}
            """

            await self.graphiti_service.client.add_episode(
                name=f"Learning: {learning.pattern[:50]}",
                episode_body=episode_content,
                source=EpisodeType.text,
                group_id="learnings"
            )
```

---

## Phase 3: API Completion (Days 5-6)

### 3.1 Complete All API Endpoints

**Endpoints to Implement**:

#### **Documents API** (`backend/app/api/documents.py`)
```python
@router.post("/documents/ingest")
async def ingest_document(file: UploadFile, type: str)
    # Already covered in Phase 1.1

@router.post("/documents/generate")
async def generate_document(execution_id: str, format: str)
    # Already covered in Phase 1.1
```

#### **Workflows API** (`backend/app/api/workflows.py`)
```python
@router.get("/workflows/templates")
async def list_templates() -> List[WorkflowTemplate]:
    """Get all available workflow templates"""
    service = get_template_service()
    return service.list_templates()

@router.post("/workflows/execute")
async def execute_workflow(request: ExecuteWorkflowRequest) -> ExecuteWorkflowResponse:
    """Start workflow execution"""
    engine = get_workflow_engine()
    execution_id = await engine.start_execution(
        workflow_id=request.workflow_id,
        user_variables=request.variables,
        uploaded_documents=request.uploaded_documents
    )
    return ExecuteWorkflowResponse(execution_id=execution_id)

@router.get("/workflows/{execution_id}/stream")
async def stream_claude(execution_id: str):
    """SSE streaming endpoint"""
    # Already covered in Phase 2.1

@router.post("/workflows/{execution_id}/interrupt")
async def interrupt_workflow(execution_id: str, request: InterruptRequest):
    """Handle user interrupt"""
    engine = get_workflow_engine()
    await engine.interrupt_execution(execution_id, request.message)
    return {"status": "interrupted"}

@router.post("/workflows/{execution_id}/resume")
async def resume_workflow(execution_id: str):
    """Resume interrupted workflow"""
    engine = get_workflow_engine()
    await engine.resume_execution(execution_id)
    return {"status": "resumed"}

@router.get("/workflows/{execution_id}/status")
async def get_workflow_status(execution_id: str) -> WorkflowExecution:
    """Get current execution state"""
    engine = get_workflow_engine()
    return engine.get_execution(execution_id)
```

#### **Citations API** (`backend/app/api/citations.py`)
```python
@router.get("/citations/{execution_id}")
async def get_citations(execution_id: str) -> List[Citation]:
    """Get all citations for execution"""
    engine = get_workflow_engine()
    execution = engine.get_execution(execution_id)
    return execution.citations

@router.post("/citations/{execution_id}/verify")
async def verify_citations(execution_id: str):
    """Re-verify all citations"""
    engine = get_workflow_engine()
    tracker = CitationTracker()
    execution = engine.get_execution(execution_id)

    for citation in execution.citations:
        citation.verified = await tracker._verify_citation(
            citation.source,
            citation.section
        )

    return execution.citations
```

#### **Learning API** (`backend/app/api/learning.py`)
```python
@router.get("/learning/{execution_id}")
async def extract_learnings(execution_id: str) -> List[Learning]:
    """Extract learnings from completed workflow"""
    engine = get_workflow_engine()
    service = get_learning_service()

    execution = engine.get_execution(execution_id)

    if execution.status != "completed":
        raise HTTPException(400, "Workflow not completed")

    learnings = await service.extract_learnings(execution)
    return learnings

@router.get("/learning/search")
async def search_learnings(query: str) -> List[dict]:
    """Search historical learnings"""
    graphiti_service = get_graphiti_service()
    results = await graphiti_service.search(
        query=query,
        group_ids=["learnings"],
        num_results=20
    )
    return results
```

### 3.2 Service Dependency Injection

**Update** `backend/app/services/__init__.py`:

```python
from functools import lru_cache
from .graphiti_service import GraphitiService
from .document_service import DocumentService
from .claude_service import ClaudeService
from .template_service import TemplateService
from .workflow_engine import WorkflowEngine
from .learning_service import LearningService

# Singleton instances
_graphiti_service = None
_document_service = None
_claude_service = None
_template_service = None
_workflow_engine = None
_learning_service = None

def get_graphiti_service() -> GraphitiService:
    global _graphiti_service
    if _graphiti_service is None:
        _graphiti_service = GraphitiService()
    return _graphiti_service

def get_document_service() -> DocumentService:
    global _document_service
    if _document_service is None:
        _document_service = DocumentService()
    return _document_service

def get_claude_service() -> ClaudeService:
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService()
    return _claude_service

def get_template_service() -> TemplateService:
    global _template_service
    if _template_service is None:
        _template_service = TemplateService()
    return _template_service

def get_workflow_engine() -> WorkflowEngine:
    global _workflow_engine
    if _workflow_engine is None:
        _workflow_engine = WorkflowEngine()
    return _workflow_engine

def get_learning_service() -> LearningService:
    global _learning_service
    if _learning_service is None:
        _learning_service = LearningService()
    return _learning_service
```

---

## Phase 4: Railway Deployment Configuration (Day 7)

### 4.1 Backend Dockerfile with Pandoc

**Create** `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies including Pandoc and LaTeX
RUN apt-get update && apt-get install -y \
    pandoc \
    texlive-xetex \
    texlive-fonts-recommended \
    texlive-plain-generic \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 4.2 Backend Requirements

**Update** `backend/requirements.txt`:

```txt
# Existing
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0
graphiti-core==0.3.21

# New for implementation
anthropic==0.39.0
sse-starlette==2.1.3
PyPDF2==3.0.1
python-docx==1.1.0
python-multipart==0.0.6
```

### 4.3 Railway Configuration

**Create** `railway.toml`:

```toml
[build]
builder = "dockerfile"
dockerfilePath = "backend/Dockerfile"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on-failure"
```

### 4.4 Environment Variables Setup

**Railway Environment Variables** (set in Railway dashboard):

```env
# Backend Service
ANTHROPIC_API_KEY=sk-ant-api03-sYX6gM_...
OPENAI_API_KEY=sk-proj-Wz72lI90x...
NEO4J_URI=neo4j+ssc://135166f5.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=0xdZtTfgo4tjys0G5zWb2Ip4SSkxLW_FC6V46FRehto
CLAUDE_MODEL=claude-sonnet-4-5-20250929

# Frontend Service
NEXT_PUBLIC_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

**Railway Service Configuration**:

```yaml
# Railway Project Structure
project_name: islamic-finance-workflows

services:
  backend:
    source: ./backend
    builder: dockerfile
    dockerfile: Dockerfile
    port: 8000
    env:
      - ANTHROPIC_API_KEY
      - OPENAI_API_KEY
      - NEO4J_URI
      - NEO4J_USER
      - NEO4J_PASSWORD
      - CLAUDE_MODEL

  frontend:
    source: ./
    builder: nixpacks
    port: 3000
    env:
      - NEXT_PUBLIC_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

### 4.5 Railway Deployment Guide

**Create** `RAILWAY_DEPLOYMENT.md`:

```markdown
# Railway Deployment Guide

## Prerequisites
- Railway account (free tier includes $5 credit)
- GitHub repository with code

## Setup Steps

### 1. Create Railway Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Configure Services

Create two services in Railway dashboard:

**Backend Service**:
- Name: `islamic-finance-backend`
- Source: Root directory
- Builder: Dockerfile
- Dockerfile Path: `backend/Dockerfile`
- Port: 8000

**Frontend Service**:
- Name: `islamic-finance-frontend`
- Source: Root directory
- Builder: Nixpacks (auto-detected Next.js)
- Port: 3000

### 3. Set Environment Variables

**Backend Service**:
- Copy all values from `backend/.env`
- No changes needed

**Frontend Service**:
- `NEXT_PUBLIC_API_URL`: Use Railway variable reference
  - Value: `https://${{backend.RAILWAY_STATIC_URL}}`
  - Railway auto-populates this with backend URL

### 4. Deploy

```bash
# Deploy backend
railway up -s islamic-finance-backend

# Deploy frontend
railway up -s islamic-finance-frontend
```

### 5. Verify Deployment

- Backend health: `https://your-backend.railway.app/health`
- Frontend: `https://your-frontend.railway.app`
- Test Graphiti connection in UI

## Costs

**Development** (during active coding):
- Backend: ~$5-8/month (minimal traffic)
- Frontend: ~$5/month
- Total: ~$10-13/month (within free credit)

**Production** (daily usage):
- Backend: ~$15-20/month
- Frontend: ~$5-10/month
- Total: ~$20-30/month

**Note**: Free $5 credit covers ~2 weeks of development.

## Monitoring

Railway provides built-in:
- Deployment logs
- Resource usage metrics
- Custom domain support
- Automatic SSL certificates

## Troubleshooting

**SSE Not Working**:
- Check Railway doesn't timeout (Railway has unlimited SSE)
- Verify CORS headers in FastAPI

**Pandoc Errors**:
- Check Docker build logs
- Verify texlive-xetex installed correctly

**Graphiti Connection Failed**:
- Verify NEO4J_URI uses `neo4j+ssc://` (SSL)
- Check Neo4j AuraDB firewall (allow all IPs for Railway)
```

---

## Phase 5: Testing & Integration (Day 8)

### 5.1 Integration Testing Plan

**Create** `backend/tests/test_integration.py`:

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_complete_workflow():
    """Test full workflow execution end-to-end"""

    async with AsyncClient(app=app, base_url="http://test") as client:
        # 1. Test Graphiti connection
        response = await client.get("/api/graphiti/test")
        assert response.status_code == 200

        # 2. Get templates
        response = await client.get("/api/workflows/templates")
        assert response.status_code == 200
        templates = response.json()
        assert len(templates) == 5

        # 3. Start execution
        response = await client.post("/api/workflows/execute", json={
            "workflow_id": "murabaha_structuring",
            "variables": {
                "amount": "1000000",
                "customer": "ABC Corp",
                "commodity": "Steel",
                "payment_terms": "12 months"
            },
            "uploaded_documents": []
        })
        assert response.status_code == 200
        execution_id = response.json()["execution_id"]

        # 4. Check status
        response = await client.get(f"/api/workflows/{execution_id}/status")
        assert response.status_code == 200
        assert response.json()["status"] == "running"

@pytest.mark.asyncio
async def test_document_ingestion():
    """Test document upload and ingestion"""

    async with AsyncClient(app=app, base_url="http://test") as client:
        # Upload test PDF
        files = {"file": ("test.pdf", b"PDF content", "application/pdf")}
        data = {"type": "aaoifi"}

        response = await client.post(
            "/api/documents/ingest",
            files=files,
            data=data
        )

        assert response.status_code == 200
        doc = response.json()
        assert doc["type"] == "aaoifi"
```

### 5.2 Manual Testing Checklist

**Step 1 - Source Connection**:
- [ ] Graphiti test connection works
- [ ] Node/edge counts display correctly
- [ ] "Next" button enables

**Step 2 - Workflow Selection**:
- [ ] All 5 templates load
- [ ] Template descriptions display
- [ ] Selection persists

**Step 3 - Context Upload**:
- [ ] PDF upload works
- [ ] DOCX upload works
- [ ] File appears in uploaded list
- [ ] Graphiti ingestion confirms

**Step 4 - Configuration**:
- [ ] Open Code text area accepts input
- [ ] Axial Code parameters update
- [ ] Variable validation works

**Step 5 - Live Execution**:
- [ ] Execute button starts streaming
- [ ] SSE events display in real-time
- [ ] Citations appear during execution
- [ ] Interrupt works mid-execution
- [ ] Resume continues from interrupt point

**Step 6 - Citation Verification**:
- [ ] All citations extracted
- [ ] Verification status shows
- [ ] Source links work (if applicable)

**Step 7 - Outcome**:
- [ ] Full outcome displays
- [ ] PDF generation works
- [ ] DOCX generation works
- [ ] Markdown download works

**Step 8 - Learning**:
- [ ] Learnings extract from outcome
- [ ] Patterns make sense
- [ ] Learnings stored in Graphiti
- [ ] Search finds learnings later

---

## Success Criteria

### Phase 1 (Foundation) ✅
- [ ] DocumentService handles PDF/DOCX parsing
- [ ] ClaudeService streams responses via SSE
- [ ] All 5 workflow templates created
- [ ] Template loader works

### Phase 2 (Execution) ✅
- [ ] WorkflowEngine manages execution lifecycle
- [ ] Citations extract and verify
- [ ] Learnings extract and store
- [ ] Interrupt/resume works

### Phase 3 (API) ✅
- [ ] All 15 endpoints implemented
- [ ] All endpoints return real data (no placeholders)
- [ ] Frontend API client works without modification

### Phase 4 (Deployment) ✅
- [ ] Dockerfile builds with Pandoc
- [ ] Railway services deploy successfully
- [ ] Environment variables configured
- [ ] Frontend connects to backend

### Phase 5 (Testing) ✅
- [ ] Integration tests pass
- [ ] Manual testing checklist complete
- [ ] No blocking bugs
- [ ] Ready for demo

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | 2 days | Document, Claude, Template services |
| Phase 2 | 2 days | Workflow engine, citations, learnings |
| Phase 3 | 2 days | All API endpoints complete |
| Phase 4 | 1 day | Railway deployment configured |
| Phase 5 | 1 day | Testing complete |
| **Total** | **8 days** | **Fully functional demo app** |

---

## Risk Mitigation

### Risk: SSE streaming doesn't work on Railway
**Mitigation**: Railway supports unlimited SSE duration (verified in research). Test early in Phase 2.

### Risk: Pandoc installation fails in Docker
**Mitigation**: Dockerfile uses official Debian packages. Test build in Phase 4.

### Risk: Graphiti search returns no results
**Mitigation**: Already proven working in previous session. Verify group_id filtering.

### Risk: Claude API rate limits
**Mitigation**: Use claude-sonnet-4-5 tier 2 (higher limits). Add error handling for rate limits.

### Risk: Frontend/backend version mismatch
**Mitigation**: Frontend API client already defined. No changes needed if we match exactly.

---

## Next Steps

1. **Start Phase 1**: Implement DocumentService
2. **Create first template**: murabaha_structuring.json
3. **Test SSE streaming**: Verify Claude streaming works locally
4. **Iterate quickly**: This is a demo app - prioritize working over perfect

---

**Document Version**: 1.0
**Last Updated**: 2025-10-08
**Status**: Ready for Implementation
