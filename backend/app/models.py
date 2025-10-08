"""
PYDANTIC MODELS
===============
Backend data models matching frontend TypeScript types.

WHY PYDANTIC:
- Automatic validation
- Type safety
- JSON serialization
- OpenAPI documentation
- Matches frontend types exactly
"""

from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


# ============================================================================
# WORKFLOW STEP
# ============================================================================

class WorkflowStep(BaseModel):
    """Individual step within a workflow template"""
    id: str
    name: str
    type: Literal['query', 'generate', 'validate', 'transform']
    instruction: str  # Open code: what this step does
    axial_params: Dict[str, Any] = Field(default_factory=dict)  # Structured execution parameters
    sources: List[str] = Field(default_factory=list)  # Graphiti group IDs needed
    expected_output: str


# ============================================================================
# REFINEMENT
# ============================================================================

class Refinement(BaseModel):
    """A learning improvement applied to a template"""
    id: str
    execution_id: str
    type: Literal['instruction_added', 'source_added', 'parameter_changed']
    description: str
    impact: str
    approved_by: str
    applied_at: datetime


# ============================================================================
# WORKFLOW TEMPLATE
# ============================================================================

class AxialCode(BaseModel):
    """Structured execution steps"""
    steps: List[WorkflowStep]
    required_sources: List[str] = Field(default_factory=list)
    output_format: Literal['markdown'] = 'markdown'
    estimated_duration: int  # Minutes
    complexity: Literal['simple', 'moderate', 'complex']


class WorkflowTemplate(BaseModel):
    """Reusable Islamic finance workflow"""
    id: str
    name: str
    description: str
    icon: str
    category: Literal['debt', 'equity', 'lease', 'partnership', 'agency']

    # Open code: Natural language template
    open_code_template: str

    # Axial code: Structured execution steps
    axial_code: AxialCode

    # Metadata & Learning
    version: str
    created_at: datetime
    updated_at: datetime
    execution_count: int = 0
    success_rate: float = 0.0
    average_rating: float = 0.0
    refinements: List[Refinement] = Field(default_factory=list)


# ============================================================================
# UPLOADED DOCUMENT
# ============================================================================

class UploadedDocument(BaseModel):
    """Document uploaded by user"""
    id: str
    filename: str
    filesize: int
    mime_type: str
    uploaded_at: datetime
    episode_id: Optional[str] = None  # Graphiti episode ID
    parsed: bool = False
    content_preview: str = ""


# ============================================================================
# LOG ENTRY
# ============================================================================

class LogEntryMetadata(BaseModel):
    """Optional metadata for log entries"""
    tokens_used: Optional[int] = None
    sources: Optional[List[str]] = None
    confidence: Optional[float] = None


class LogEntry(BaseModel):
    """Single entry in the execution log"""
    id: str
    timestamp: datetime
    step_index: int
    step_name: str
    type: Literal['info', 'query', 'response', 'error', 'interrupt']
    content: str  # Markdown content
    metadata: Optional[LogEntryMetadata] = None


# ============================================================================
# INTERRUPT MESSAGE
# ============================================================================

class InterruptMessage(BaseModel):
    """User interruption during execution"""
    id: str
    timestamp: datetime
    step_index: int
    user_message: str
    system_response: Optional[str] = None


# ============================================================================
# CITATION
# ============================================================================

class Citation(BaseModel):
    """Source reference used during generation"""
    id: str
    source: Literal['AAOIFI', 'UserUpload', 'Graphiti', 'Claude']
    document_title: str
    document_ref: str
    excerpt: str  # Max 500 chars
    used_in_section: str
    confidence: float  # 0.0 - 1.0
    episode_id: Optional[str] = None
    approved: bool = False
    rejected: bool = False
    rejection_reason: Optional[str] = None
    timestamp: datetime


# ============================================================================
# GENERATED FILE
# ============================================================================

class GeneratedFile(BaseModel):
    """Output file (PDF, DOCX, MD)"""
    id: str
    format: Literal['pdf', 'docx', 'markdown']
    filename: str
    filesize: int
    download_url: str
    generated_at: datetime


# ============================================================================
# LEARNING
# ============================================================================

class Learning(BaseModel):
    """Extracted improvement pattern"""
    id: str
    title: str
    description: str
    category: Literal['instruction_improvement', 'source_addition', 'parameter_tuning']
    confidence: float

    # What changed
    open_code_change: str
    axial_code_change: Dict[str, Any]

    # Evidence
    from_execution_id: str
    user_behavior: str
    impact: str

    approved: bool = False
    applied_to_template: bool = False


# ============================================================================
# WORKFLOW EXECUTION
# ============================================================================

class WorkflowExecution(BaseModel):
    """State of a single workflow run"""
    id: str
    workflow_template_id: str
    user_id: str
    status: Literal['not_started', 'running', 'interrupted', 'completed', 'failed']
    current_step_index: int = 0

    # Step 1: Sources
    graphiti_connected: bool = False
    aaoifi_documents: List[UploadedDocument] = Field(default_factory=list)

    # Step 2: Selection
    selected_template: Optional[WorkflowTemplate] = None
    custom_template: Optional[WorkflowTemplate] = None

    # Step 3: Context
    context_documents: List[UploadedDocument] = Field(default_factory=list)
    context_text: str = ""
    context_episode_ids: List[str] = Field(default_factory=list)

    # Step 4: Configuration
    user_notes: Dict[str, str] = Field(default_factory=dict)  # stepId → notes
    workflow_iterations: int = 0

    # Step 5: Execution
    execution_log: List[LogEntry] = Field(default_factory=list)
    completed_steps: List[int] = Field(default_factory=list)
    interrupt_count: int = 0
    interrupt_messages: List[InterruptMessage] = Field(default_factory=list)

    # Step 6: Citations
    citations: List[Citation] = Field(default_factory=list)
    approved_citations: List[str] = Field(default_factory=list)
    rejected_citations: List[str] = Field(default_factory=list)

    # Step 7: Outcome
    final_document: str = ""
    generated_files: List[GeneratedFile] = Field(default_factory=list)

    # Step 8: Learning
    extracted_learnings: List[Learning] = Field(default_factory=list)
    applied_learnings: List[str] = Field(default_factory=list)
    user_feedback: str = ""

    # Metadata
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: int = 0
    tokens_used: int = 0


# ============================================================================
# GRAPHITI STATS
# ============================================================================

class GraphitiStats(BaseModel):
    """Statistics from the knowledge graph"""
    connected: bool
    total_episodes: int = 0
    total_nodes: int = 0
    total_edges: int = 0
    aaoifi_documents_count: int = 0
    context_documents_count: int = 0


# ============================================================================
# API REQUEST/RESPONSE MODELS
# ============================================================================

class TestConnectionResponse(BaseModel):
    """Response from Graphiti connection test"""
    stats: GraphitiStats


class IngestDocumentRequest(BaseModel):
    """Request to ingest a document"""
    file_path: str
    type: Literal['aaoifi', 'context']


class IngestDocumentResponse(BaseModel):
    """Response from document ingestion"""
    document: UploadedDocument


class ExecuteWorkflowRequest(BaseModel):
    """Request to execute a workflow"""
    template_id: str
    context_text: Optional[str] = None
    context_document_ids: List[str] = Field(default_factory=list)
    user_notes: Dict[str, str] = Field(default_factory=dict)


class ExecuteWorkflowResponse(BaseModel):
    """Response from workflow execution start"""
    execution_id: str


class InterruptWorkflowRequest(BaseModel):
    """Request to interrupt workflow"""
    message: str


class InterruptWorkflowResponse(BaseModel):
    """Response from workflow interrupt"""
    acknowledged: bool


class UpdateCitationApprovalRequest(BaseModel):
    """Request to update citation approval"""
    approved: bool
    rejection_reason: Optional[str] = None


class UpdateCitationApprovalResponse(BaseModel):
    """Response from citation update"""
    updated: bool


class GenerateDocumentRequest(BaseModel):
    """Request to generate document"""
    execution_id: str
    format: Literal['pdf', 'docx', 'markdown']


class GenerateDocumentResponse(BaseModel):
    """Response from document generation"""
    file: GeneratedFile


class CreateCustomTemplateRequest(BaseModel):
    """Request to create custom workflow"""
    open_code_prompt: str


class ApplyLearningResponse(BaseModel):
    """Response from applying learning"""
    applied: bool
    template_id: str
