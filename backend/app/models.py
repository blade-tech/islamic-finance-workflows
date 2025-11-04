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

from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


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
    selected_methodologies: List['Methodology'] = Field(default_factory=list)  # NEW: Multi-select methodologies (Phase 3)
    selected_template: Optional['WorkflowTemplate'] = None  # Generated from methodologies or legacy template
    custom_template: Optional['WorkflowTemplate'] = None

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


# ============================================================================
# METHODOLOGY (Guardian-inspired, mock data for now)
# ============================================================================

class Methodology(BaseModel):
    """
    Digitized methodology for Islamic finance workflows.
    Based on Hedera Guardian framework, but using mock data initially.
    """
    id: str
    name: str
    description: str

    # Classification
    type: Literal['islamic-finance', 'environmental', 'social', 'custom']
    category: Optional[str] = None  # e.g., 'mudarabah', 'sukuk', 'murabaha'
    standard: Optional[str] = None  # e.g., 'IIFM', 'AAOIFI', 'Verra'

    # Status
    status: Literal['draft', 'active', 'archived'] = 'active'

    # Guardian-style components (simplified for mock)
    schema_count: int = Field(default=0, serialization_alias='schemaCount')  # Number of data schemas
    policy_steps: int = Field(default=0, serialization_alias='policySteps')  # Number of workflow steps
    required_roles: List[str] = Field(default_factory=list, serialization_alias='requiredRoles')  # e.g., ['Auditor', 'Issuer']

    # Source
    source_type: Literal['guardian', 'iifm', 'custom', 'uploaded'] = Field(default='custom', serialization_alias='sourceType')
    source_url: Optional[str] = Field(default=None, serialization_alias='sourceUrl')

    # Metadata
    version: str = "1.0.0"
    created_at: datetime = Field(serialization_alias='createdAt')
    updated_at: datetime = Field(serialization_alias='updatedAt')

    # Statistics (for learning/improvement)
    application_count: int = Field(default=0, serialization_alias='applicationCount')
    success_rate: float = Field(default=0.0, serialization_alias='successRate')
    average_validation_time: int = Field(default=0, serialization_alias='averageValidationTime')  # seconds

    model_config = ConfigDict(
        populate_by_name=True,
        ser_json_bytes='utf8',
    )


# ============================================================================
# METHODOLOGY API MODELS
# ============================================================================

class MethodologyListFilters(BaseModel):
    """Filters for methodology list endpoint"""
    type: Optional[Literal['islamic-finance', 'environmental', 'social', 'custom']] = None
    category: Optional[str] = None
    standard: Optional[str] = None
    status: Optional[Literal['draft', 'active', 'archived']] = None
    search: Optional[str] = None


class MethodologyListResponse(BaseModel):
    """Response with list of methodologies"""
    methodologies: List[Methodology]
    total: int
    filters_applied: MethodologyListFilters = Field(serialization_alias="filtersApplied")


class MethodologyDetailResponse(BaseModel):
    """Response with methodology details"""
    methodology: Methodology


class GenerateTemplateFromMethodologiesRequest(BaseModel):
    """Request to generate workflow template from methodologies"""
    methodology_ids: List[str] = Field(min_length=1)


class GenerateTemplateFromMethodologiesResponse(BaseModel):
    """Response with generated template"""
    template: WorkflowTemplate


# ============================================================================
# COLLABORATION & MULTI-STAKEHOLDER MODELS (Vanta-inspired)
# ============================================================================

class NotificationChannel(BaseModel):
    """Notification delivery channel preferences"""
    email: bool = True
    in_app: bool = True
    webhook: Optional[str] = None


class NotificationPreferences(BaseModel):
    """User preferences for notifications"""
    enabled: bool = True
    channels: NotificationChannel = Field(default_factory=NotificationChannel)
    frequency: Literal['real_time', 'daily_digest', 'weekly_digest'] = 'real_time'

    # Event types to receive notifications for
    contract_updates: bool = True
    approval_requests: bool = True
    task_assignments: bool = True
    comments_mentions: bool = True
    workflow_completion: bool = True


class Subscriber(BaseModel):
    """Contract subscriber for collaboration and notifications"""
    contract_id: str
    user_email: str
    user_name: str
    user_role: Literal['business_team', 'shariah_advisor', 'legal_counsel', 'compliance_manager', 'finance_team']
    notification_preferences: NotificationPreferences = Field(default_factory=NotificationPreferences)
    subscribed_at: datetime
    subscribed_by: str  # Email of user who added this subscriber


class Comment(BaseModel):
    """Comment on a contract or workflow step"""
    comment_id: str
    contract_id: str
    step_number: Optional[int] = None  # None = contract-level comment

    # Author
    author_email: str
    author_name: str
    author_role: Literal['business_team', 'shariah_advisor', 'legal_counsel', 'compliance_manager', 'finance_team']

    # Content
    content: str  # Markdown supported
    mentions: List[str] = Field(default_factory=list)  # List of @mentioned emails

    # Metadata
    created_at: datetime
    updated_at: Optional[datetime] = None
    edited: bool = False

    # Reactions (future enhancement)
    reactions: Dict[str, int] = Field(default_factory=dict)  # emoji -> count


class TaskStatus(BaseModel):
    """Status of a task"""
    status: Literal['pending', 'in_progress', 'completed', 'cancelled']
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    cancellation_reason: Optional[str] = None


class Task(BaseModel):
    """Task assigned to a stakeholder"""
    task_id: str
    contract_id: str
    step_number: Optional[int] = None  # None = contract-level task

    # Assignment
    assignee_email: str
    assignee_name: str
    assignee_role: Literal['business_team', 'shariah_advisor', 'legal_counsel', 'compliance_manager', 'finance_team']
    assigner_email: str
    assigner_name: str

    # Task details
    title: str
    description: str
    priority: Literal['low', 'medium', 'high', 'critical'] = 'medium'
    due_date: Optional[datetime] = None

    # Status
    status: TaskStatus = Field(default_factory=lambda: TaskStatus(status='pending'))

    # Metadata
    created_at: datetime
    updated_at: datetime


class NotificationType(BaseModel):
    """Type of notification"""
    type: Literal[
        'contract_created',
        'contract_updated',
        'approval_requested',
        'approval_granted',
        'approval_rejected',
        'task_assigned',
        'task_completed',
        'task_overdue',
        'comment_added',
        'mention_in_comment',
        'workflow_completed',
        'workflow_failed',
        'subscriber_added',
        'subscriber_removed',
        'ownership_transferred'
    ]


class Notification(BaseModel):
    """Notification for a user"""
    notification_id: str
    recipient_email: str

    # Notification details
    type: Literal[
        'contract_created',
        'contract_updated',
        'approval_requested',
        'approval_granted',
        'approval_rejected',
        'task_assigned',
        'task_completed',
        'task_overdue',
        'comment_added',
        'mention_in_comment',
        'workflow_completed',
        'workflow_failed',
        'subscriber_added',
        'subscriber_removed',
        'ownership_transferred'
    ]
    title: str
    message: str

    # Source references
    source_contract_id: str
    source_task_id: Optional[str] = None
    source_comment_id: Optional[str] = None
    source_user_email: Optional[str] = None  # User who triggered notification

    # Status
    read: bool = False
    read_at: Optional[datetime] = None

    # Actions
    action_url: Optional[str] = None  # URL to navigate to (e.g., contract page, task page)
    action_label: Optional[str] = None  # Label for action button (e.g., "View Contract", "Review Task")

    # Metadata
    created_at: datetime


# ============================================================================
# COLLABORATION API REQUEST/RESPONSE MODELS
# ============================================================================

class AddSubscriberRequest(BaseModel):
    """Request to add subscriber to contract"""
    user_email: str
    user_name: str
    user_role: Literal['business_team', 'shariah_advisor', 'legal_counsel', 'compliance_manager', 'finance_team']
    notification_preferences: Optional[NotificationPreferences] = None


class AddSubscriberResponse(BaseModel):
    """Response from adding subscriber"""
    subscriber: Subscriber


class ListSubscribersResponse(BaseModel):
    """Response with list of subscribers"""
    subscribers: List[Subscriber]
    owner_email: str


class TransferOwnershipRequest(BaseModel):
    """Request to transfer contract ownership"""
    new_owner_email: str
    new_owner_name: str


class TransferOwnershipResponse(BaseModel):
    """Response from ownership transfer"""
    success: bool
    new_owner_email: str


class AddCommentRequest(BaseModel):
    """Request to add comment"""
    content: str
    step_number: Optional[int] = None
    mentions: List[str] = Field(default_factory=list)


class AddCommentResponse(BaseModel):
    """Response from adding comment"""
    comment: Comment


class ListCommentsResponse(BaseModel):
    """Response with list of comments"""
    comments: List[Comment]
    total: int


class UpdateCommentRequest(BaseModel):
    """Request to update comment"""
    content: str


class UpdateCommentResponse(BaseModel):
    """Response from updating comment"""
    comment: Comment


class CreateTaskRequest(BaseModel):
    """Request to create task"""
    assignee_email: str
    assignee_name: str
    assignee_role: Literal['business_team', 'shariah_advisor', 'legal_counsel', 'compliance_manager', 'finance_team']
    title: str
    description: str
    priority: Literal['low', 'medium', 'high', 'critical'] = 'medium'
    due_date: Optional[datetime] = None
    step_number: Optional[int] = None


class CreateTaskResponse(BaseModel):
    """Response from creating task"""
    task: Task


class ListTasksResponse(BaseModel):
    """Response with list of tasks"""
    tasks: List[Task]
    total: int


class UpdateTaskStatusRequest(BaseModel):
    """Request to update task status"""
    status: Literal['pending', 'in_progress', 'completed', 'cancelled']
    cancellation_reason: Optional[str] = None


class UpdateTaskStatusResponse(BaseModel):
    """Response from updating task status"""
    task: Task


class ListNotificationsResponse(BaseModel):
    """Response with list of notifications"""
    notifications: List[Notification]
    unread_count: int
    total: int


class MarkNotificationReadRequest(BaseModel):
    """Request to mark notification as read"""
    read: bool = True


class MarkNotificationReadResponse(BaseModel):
    """Response from marking notification read"""
    notification: Notification


class UpdateNotificationPreferencesRequest(BaseModel):
    """Request to update notification preferences"""
    preferences: NotificationPreferences


class UpdateNotificationPreferencesResponse(BaseModel):
    """Response from updating preferences"""
    preferences: NotificationPreferences


# ============================================================================
# DASHBOARD & COMPLIANCE MODELS (Vanta-inspired, 4-Component Architecture)
# ============================================================================

class ComponentType(str, Enum):
    """The 4 modular components in Islamic Finance workflows"""
    SHARIAH_STRUCTURE = "shariah_structure"
    JURISDICTION = "jurisdiction"
    ACCOUNTING = "accounting"
    IMPACT = "impact"


class ComplianceStatus(str, Enum):
    """Compliance status for components and deals"""
    COMPLIANT = "compliant"
    NEEDS_ATTENTION = "needs_attention"
    IN_PROGRESS = "in_progress"
    NOT_APPLICABLE = "not_applicable"


class ComponentCompliance(BaseModel):
    """Compliance tracking for a single component"""
    component_type: ComponentType
    component_id: str  # e.g., 'sukuk_ijara', 'uae_dfsa'
    component_name: str  # e.g., 'Sukuk Ijara', 'UAE DFSA'

    # Progress metrics
    total_requirements: int  # Total standards/rules for this component
    completed_requirements: int  # Completed standards
    evidence_count: int  # Documents uploaded
    required_evidence_count: int  # Documents needed

    # Calculated percentages
    control_completion: float  # % of requirements met
    evidence_completion: float  # % of evidence provided
    overall_completion: float  # (control × 0.6) + (evidence × 0.4)

    # Status
    status: ComplianceStatus
    needs_attention_count: int  # Issues requiring action
    last_updated: str  # ISO timestamp


class DealConfiguration(BaseModel):
    """A specific deal's component combination"""
    deal_id: str
    deal_name: str

    # Selected components
    shariah_structure: str  # e.g., 'sukuk_ijara'
    jurisdiction: str  # e.g., 'uae_dfsa'
    accounting: str  # e.g., 'aaoifi'
    impact: str  # e.g., 'green_sukuk' or 'none'
    takaful_enabled: bool

    # Compliance for each component
    shariah_compliance: ComponentCompliance
    jurisdiction_compliance: ComponentCompliance
    accounting_compliance: ComponentCompliance
    impact_compliance: Optional[ComponentCompliance] = None

    # Overall deal compliance
    overall_completion: float
    status: ComplianceStatus
    created_at: str


class MonitoringCard(BaseModel):
    """Monitoring dashboard cards"""
    title: str  # "Contracts", "Shariah Reviews", "Impact Validations", "Documents"
    total_count: int
    needs_attention_count: int
    status: ComplianceStatus
    breakdown_by_component: Dict[str, int]  # Component breakdown
    last_updated: str


class DashboardMetrics(BaseModel):
    """Top-level dashboard metrics"""

    # Component-level compliance (4 main components)
    shariah_compliance: ComponentCompliance
    jurisdiction_compliance: ComponentCompliance
    accounting_compliance: ComponentCompliance
    impact_compliance: ComponentCompliance

    # Monitoring cards
    contracts_card: MonitoringCard
    shariah_reviews_card: MonitoringCard
    impact_validations_card: MonitoringCard
    documents_card: MonitoringCard

    # Active deals
    active_deals: List[DealConfiguration]

    # Summary metrics
    total_deals: int
    compliant_deals: int
    deals_needing_attention: int
    overall_platform_compliance: float  # Average across all 4 components
