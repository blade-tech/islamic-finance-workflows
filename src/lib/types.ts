// ============================================================================
// Type Definitions for Islamic Finance Workflows
// ============================================================================
// These types define the entire workflow state and data structures.
// They match the backend Pydantic models for type safety across the stack.

/**
 * WORKFLOW TEMPLATE
 * Defines a reusable Islamic finance workflow (e.g., Sukuk, Murabaha)
 */
export interface WorkflowTemplate {
  id: string                           // e.g., "sukuk_issuance"
  name: string                         // e.g., "Sukuk Issuance Document"
  description: string                  // Human-readable description
  icon: string                         // Icon name from lucide-react
  category: 'debt' | 'equity' | 'lease' | 'partnership' | 'agency'

  // OPEN CODE: Natural language template users can customize
  openCodeTemplate: string

  // AXIAL CODE: Structured execution steps (what the engine executes)
  axialCode: {
    steps: WorkflowStep[]
    requiredSources: string[]          // e.g., ["AAOIFI FAS 3"]
    outputFormat: 'markdown'
    estimatedDuration: number          // Minutes
    complexity: 'simple' | 'moderate' | 'complex'
  }

  // Required Backend Services
  requiredServices?: string[]          // e.g., ["Documents", "Graphiti", "MCP", "Orchestrator"]

  // Special Tags (e.g., "R&D Phase", "Unknown")
  tags?: string[]

  // Metadata & Learning
  version: string
  createdAt: string
  updatedAt: string
  executionCount: number
  successRate: number                  // 0.0 - 1.0
  averageRating: number                // 1-5
  refinements: Refinement[]
}

/**
 * WORKFLOW STEP
 * Individual step within a workflow template
 */
export interface WorkflowStep {
  id: string
  name: string
  type: 'query' | 'generate' | 'validate' | 'transform'
  instruction: string                  // Open code: what this step does
  axialParams: Record<string, any>     // Structured execution parameters
  sources: string[]                    // Graphiti group IDs needed
  expectedOutput: string
}

/**
 * REFINEMENT
 * A learning improvement applied to a template
 */
export interface Refinement {
  id: string
  executionId: string
  type: 'instruction_added' | 'source_added' | 'parameter_changed'
  description: string
  impact: string
  approvedBy: string
  appliedAt: string
}

/**
 * WORKFLOW PARTICIPANT
 * A person who will participate in the Guardian workflow
 */
export interface WorkflowParticipant {
  id: string
  role: string                         // e.g., "Issuer", "Shariah Advisor", "Auditor"
  name: string                         // Full name or organization name
  email: string                        // Email address for Guardian invite
  did?: string                         // W3C DID (assigned after Guardian deployment)
  status: 'invited' | 'onboarded' | 'active'
}

/**
 * WORKFLOW EXECUTION
 * State of a single workflow run
 */
export interface WorkflowExecution {
  id: string
  workflowTemplateId: string
  userId: string
  status: 'not_started' | 'running' | 'interrupted' | 'completed' | 'failed'
  currentStepIndex: number

  // Step 1: Sources
  graphitiConnected: boolean
  aaaoifiDocuments: UploadedDocument[]

  // Step 2-6: 4-Component Selection (Modular Architecture)
  selectedShariahStructure: ShariahStructure | null
  isSecuritized: boolean                           // Whether to securitize as Sukuk (true) or use direct financing (false)
  selectedJurisdiction: Jurisdiction | null
  selectedAccounting: AccountingFramework | null
  selectedImpacts: ImpactMetrics[]                 // MULTI-SELECT: Can combine frameworks (e.g., ESG + SDG, QFC + VBI)
  selectedTakaful: TakafulOverlay
  dealConfiguration: DealConfiguration | null  // Composed from 4 components

  // Step 3: Context
  contextDocuments: UploadedDocument[]
  contextText: string
  contextEpisodeIds: string[]

  // Step 4: Configuration
  userNotes: Record<string, string>    // stepId → notes
  workflowIterations: number

  // Step 7: Workflow Participants (for Guardian deployment)
  participants: WorkflowParticipant[]

  // Step 5: Execution
  executionLog: LogEntry[]
  completedSteps: number[]
  interruptCount: number
  interruptMessages: InterruptMessage[]

  // Step 6: Citations
  citations: Citation[]
  approvedCitations: string[]
  rejectedCitations: string[]

  // Step 7: Outcome
  finalDocument: string
  generatedFiles: GeneratedFile[]

  // Step 8: Learning
  extractedLearnings: Learning[]
  appliedLearnings: string[]
  userFeedback: string

  // Step 10: Live Execution (Guardian Deployment)
  dealId?: string                     // Deal ID created after Guardian deployment (for Step 11)

  // Metadata
  startedAt: string
  completedAt: string | null
  durationSeconds: number
  tokensUsed: number
}

/**
 * UPLOADED DOCUMENT
 * Document uploaded by user (AAOIFI or context)
 */
export interface UploadedDocument {
  id: string
  filename: string
  filesize: number
  mime_type: string
  uploaded_at: string
  parsed: boolean
  episode_id?: string                  // Graphiti episode ID
  content_preview?: string             // Text preview
}

/**
 * LOG ENTRY
 * Single entry in the execution log
 */
export interface LogEntry {
  id: string
  timestamp: string
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

/**
 * INTERRUPT MESSAGE
 * User interruption during execution
 */
export interface InterruptMessage {
  id: string
  timestamp: string
  stepIndex: number
  userMessage: string
  systemResponse?: string
}

/**
 * CITATION
 * Source reference used during generation
 */
export interface Citation {
  id: string
  source: 'AAOIFI' | 'UserUpload' | 'Graphiti' | 'Claude'
  documentTitle: string
  documentRef: string
  excerpt: string                      // Max 500 chars
  usedInSection: string
  confidence: number                   // 0.0 - 1.0
  episodeId?: string
  approved: boolean
  rejected: boolean
  rejectionReason?: string
  timestamp: string
}

/**
 * GENERATED FILE
 * Output file (PDF, DOCX, MD)
 */
export interface GeneratedFile {
  id: string
  format: 'pdf' | 'docx' | 'markdown'
  filename: string
  filesize: number
  downloadUrl: string
  generatedAt: string
}

/**
 * LEARNING
 * Extracted improvement pattern
 */
export interface Learning {
  id: string
  title: string
  description: string
  category: 'instruction_improvement' | 'source_addition' | 'parameter_tuning'
  confidence: number

  // What changed
  openCodeChange: string
  axialCodeChange: Record<string, any>

  // Evidence
  fromExecutionId: string
  userBehavior: string
  impact: string

  approved: boolean
  appliedToTemplate: boolean
}

/**
 * ERROR STATE
 * Visible error information for UI display
 */
export interface ErrorState {
  id: string
  timestamp: string
  severity: 'error' | 'warning' | 'info'
  title: string
  message: string
  technicalDetails?: string
  suggestion?: string
  context?: Record<string, any>
  dismissible: boolean
}

/**
 * GRAPHITI STATS
 * Statistics from the knowledge graph
 */
export interface GraphitiStats {
  connected: boolean
  totalEpisodes: number
  totalNodes: number
  totalEdges: number
  aaaoifiDocumentsCount: number
  contextDocumentsCount: number
}

/**
 * METHODOLOGY
 * Digitized methodology for Islamic finance workflows
 * Based on Hedera Guardian framework
 */
export interface Methodology {
  id: string
  name: string
  description: string

  // Classification
  type: 'islamic-finance' | 'environmental' | 'social' | 'custom'
  category?: string                    // e.g., 'mudarabah', 'sukuk', 'murabaha'
  standard?: string                    // e.g., 'IIFM', 'AAOIFI', 'Verra'

  // Status
  status: 'draft' | 'active' | 'archived'

  // Guardian-style components (simplified for mock)
  schemaCount: number                  // Number of data schemas
  policySteps: number                  // Number of workflow steps
  requiredRoles: string[]              // e.g., ['Auditor', 'Issuer']

  // Source
  sourceType: 'guardian' | 'iifm' | 'custom' | 'uploaded'
  sourceUrl?: string

  // Metadata
  version: string
  createdAt: string
  updatedAt: string

  // Statistics (for learning/improvement)
  applicationCount: number
  successRate: number
  averageValidationTime: number       // seconds
}

/**
 * METHODOLOGY LIST FILTERS
 * Filters for methodology list endpoint
 */
export interface MethodologyListFilters {
  type?: 'islamic-finance' | 'environmental' | 'social' | 'custom'
  category?: string
  standard?: string
  status?: 'draft' | 'active' | 'archived'
  search?: string
}

/**
 * METHODOLOGY LIST RESPONSE
 * Response with list of methodologies
 */
export interface MethodologyListResponse {
  methodologies: Methodology[]
  total: number
  filtersApplied: MethodologyListFilters
}

/**
 * METHODOLOGY DETAIL RESPONSE
 * Response with methodology details
 */
export interface MethodologyDetailResponse {
  methodology: Methodology
}

// ============================================================================
// 4-COMPONENT MODULAR ARCHITECTURE TYPES
// ============================================================================
// These types support the new modular architecture where Islamic finance deals
// are composed from 4 independent components:
// 1. Shariah Structure (the Islamic finance mechanism)
// 2. Legal Jurisdiction (regulatory framework and location)
// 3. Accounting Framework (standards and reporting)
// 4. Impact Metrics (ESG, sustainability, social impact)
// + Optional Takaful Overlay (Islamic insurance)

/**
 * FORM FIELD
 * Individual form field definition for dynamic forms
 */
export interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'select' | 'date'
  placeholder?: string
  options?: string[]
  aiSuggestion: string
  required: boolean
  defaultValue?: string
}

/**
 * SHARIAH STRUCTURE
 * Islamic finance contract mechanism (Component 1)
 * These are contract TYPES that can be used for Sukuk, financing, leasing, partnerships, etc.
 */
export interface ShariahStructure {
  id: string                           // e.g., 'ijara', 'murabaha', 'mudaraba'
  name: string                         // e.g., 'Ijara', 'Murabaha', 'Mudaraba'
  category: 'lease' | 'sale' | 'partnership' | 'agency' | 'hybrid'  // Contract classification
  subCategory?: string                 // e.g., 'operating-lease', 'cost-plus-sale'
  description: string                  // Detailed explanation
  useCases: string[]                   // Common use cases (Sukuk, financing, trade, etc.)
  marketShare?: number                 // % of global Islamic finance market

  // Compliance & Roles
  requiredRoles: string[]              // e.g., ['Shariah Board', 'SPO Provider', 'Trustee']
  aaoifiStandards: string[]            // e.g., ['AAOIFI Shariah Standard 62']
  iifmStandards?: string[]             // Optional IIFM standards

  // Dynamic Form Configuration
  baseFields: FormField[]              // Structure-specific form fields

  // Compatibility
  compatibleJurisdictions?: string[]   // Optional jurisdiction restrictions
  compatibleAccounting?: string[]      // Optional accounting restrictions

  // Metadata
  icon?: string                        // Lucide icon name
  version: string
  createdAt: string
  updatedAt: string
}

/**
 * JURISDICTION
 * Legal/regulatory jurisdiction (Component 2)
 */
export interface Jurisdiction {
  id: string                           // e.g., 'uae_dfsa', 'saudi_cma'
  name: string                         // e.g., 'UAE DFSA (Dubai)'
  regulator: string                    // e.g., 'Dubai Financial Services Authority'
  country: string                      // ISO country code (e.g., 'AE', 'SA')
  region?: string                      // e.g., 'GCC', 'Southeast Asia'
  description: string

  // Legal Requirements
  requiredLanguages: string[]          // e.g., ['English', 'Arabic']
  currencies: string[]                 // e.g., ['USD', 'AED', 'SAR']
  taxRate: number | null               // % tax rate (null if no tax)
  listingRequirements?: string[]       // For Sukuk listing requirements

  // Compliance
  mandatoryAccounting?: string[]       // Accounting frameworks required
  forbiddenAccounting?: string[]       // Accounting frameworks not allowed
  additionalFields: FormField[]        // Jurisdiction-specific form fields

  // Compatibility (reverse of mandatoryAccounting)
  compatibleAccounting: string[]       // IDs of compatible accounting frameworks

  // Metadata
  icon?: string                        // Flag or regulator logo
  version: string
  createdAt: string
  updatedAt: string
}

/**
 * ACCOUNTING FRAMEWORK
 * Accounting and reporting standards (Component 3)
 */
export interface AccountingFramework {
  id: string                           // e.g., 'aaoifi', 'ifrs_islamic'
  name: string                         // e.g., 'AAOIFI Standards'
  description: string
  organization: string                 // e.g., 'Accounting and Auditing Organization for Islamic Financial Institutions'

  // Standards
  applicableStandards: string[]        // e.g., ['FAS 1', 'FAS 33']
  reportingRequirements: string[]      // e.g., ['Annual audited financials', 'Quarterly reports']

  // Form Fields
  additionalFields: FormField[]        // Accounting-specific form fields

  // Compatibility
  compatibleJurisdictions: string[]    // IDs of compatible jurisdictions
  compatibleStructures?: string[]      // Optional structure restrictions

  // Metadata
  icon?: string                        // Organization logo
  websiteUrl?: string
  version: string
  createdAt: string
  updatedAt: string
}

/**
 * IMPACT METRICS
 * ESG/sustainability/social impact framework (Component 4)
 */
export interface ImpactMetrics {
  id: string                           // e.g., 'green_sukuk', 'sdg', 'none'
  name: string                         // e.g., 'Green Sukuk (ICMA GBP)'
  category: 'environmental' | 'social' | 'governance' | 'none'
  description: string
  framework?: string                   // e.g., 'ICMA Green Bond Principles'

  // Requirements
  reportingRequirements: string[]      // e.g., ['Annual impact report', 'Third-party verification']
  certificationRequired: boolean       // Whether external certification needed
  certifiers?: string[]                // e.g., ['Second-party opinion provider']

  // Form Fields
  additionalFields: FormField[]        // Impact-specific form fields

  // Examples & Guidance
  examples?: string[]                  // Real-world examples
  useCases?: string[]                  // Common use cases

  // Metadata
  icon?: string                        // Framework logo
  websiteUrl?: string
  version: string
  createdAt: string
  updatedAt: string
}

/**
 * TAKAFUL OVERLAY
 * Optional Islamic insurance overlay (can be added to any combination)
 */
export interface TakafulOverlay {
  enabled: boolean                     // Whether Takaful is included
  model?: 'mudaraba' | 'wakalah' | 'hybrid'  // Takaful model
  coverageType?: 'credit' | 'asset' | 'performance' | 'commodity'  // What's insured
  provider?: string                    // Takaful provider name
  description?: string                 // Coverage description

  // Form Fields
  additionalFields?: FormField[]       // Takaful-specific form fields

  // Metadata
  version?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * DEAL CONFIGURATION
 * Complete Islamic finance deal composed from 4 components + optional Takaful
 */
export interface DealConfiguration {
  // 4 Core Components
  shariahStructure: ShariahStructure
  jurisdiction: Jurisdiction
  accounting: AccountingFramework
  impacts: ImpactMetrics[]             // MULTI-SELECT: Can combine frameworks (e.g., ESG + SDG, QFC + VBI)

  // Optional Overlay
  takaful: TakafulOverlay

  // Composed Metadata
  configurationName?: string           // e.g., "Saudi Ijara with Green + SDG Impact"
  isValid?: boolean                    // Validation result
  validationErrors?: string[]          // Compatibility errors
  validationWarnings?: string[]        // Non-blocking warnings

  // Timestamps
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// DASHBOARD COMPLIANCE TYPES
// ============================================================================
// Types for the compliance dashboard aligned with 4-component modular architecture
// These track compliance metrics for components and deals

/**
 * COMPONENT TYPE
 * The 4 modular components in Islamic Finance workflows
 */
export type ComponentType =
  | 'shariah_structure'
  | 'jurisdiction'
  | 'accounting'
  | 'impact'

/**
 * COMPLIANCE STATUS
 * Compliance status for components and deals
 */
export type ComplianceStatus =
  | 'compliant'        // ≥90% completion, <5 issues
  | 'needs_attention'  // >5 issues needing action
  | 'in_progress'      // Default state
  | 'not_applicable'   // Not applicable to this deal

/**
 * COMPONENT COMPLIANCE
 * Compliance tracking for a single component
 */
export interface ComponentCompliance {
  component_type: ComponentType
  component_id: string              // e.g., 'sukuk_ijara', 'uae_dfsa'
  component_name: string            // e.g., 'Sukuk Ijara', 'UAE DFSA'

  // Progress metrics
  total_requirements: number        // Total standards/rules for this component
  completed_requirements: number    // Completed standards
  evidence_count: number            // Documents uploaded
  required_evidence_count: number   // Documents needed

  // Calculated percentages
  control_completion: number        // % of requirements met
  evidence_completion: number       // % of evidence provided
  overall_completion: number        // (control × 0.6) + (evidence × 0.4)

  // Status
  status: ComplianceStatus
  needs_attention_count: number     // Issues requiring action
  last_updated: string              // ISO timestamp
}

/**
 * DEAL CONFIGURATION (Dashboard Version)
 * A specific deal's component combination with compliance metrics
 */
export interface DealConfigurationDashboard {
  deal_id: string
  deal_name: string

  // Selected components
  shariah_structure: string         // e.g., 'sukuk_ijara'
  jurisdiction: string              // e.g., 'uae_dfsa'
  accounting: string                // e.g., 'aaoifi'
  impact: string                    // e.g., 'green_sukuk' or 'none'
  takaful_enabled: boolean

  // Compliance for each component
  shariah_compliance: ComponentCompliance
  jurisdiction_compliance: ComponentCompliance
  accounting_compliance: ComponentCompliance
  impact_compliance?: ComponentCompliance  // Optional if impact = 'none'

  // Overall deal compliance
  overall_completion: number
  status: ComplianceStatus
  created_at: string
}

/**
 * MONITORING CARD
 * Monitoring dashboard cards
 */
export interface MonitoringCard {
  title: string                     // "Contracts", "Shariah Reviews", "Impact Validations", "Documents"
  total_count: number
  needs_attention_count: number
  status: ComplianceStatus
  breakdown_by_component: Record<string, number>  // Component breakdown
  last_updated: string
}

/**
 * DASHBOARD METRICS
 * Top-level dashboard metrics
 */
export interface DashboardMetrics {
  // Component-level compliance (4 main components)
  shariah_compliance: ComponentCompliance
  jurisdiction_compliance: ComponentCompliance
  accounting_compliance: ComponentCompliance
  impact_compliance: ComponentCompliance

  // Monitoring cards
  contracts_card: MonitoringCard
  shariah_reviews_card: MonitoringCard
  impact_validations_card: MonitoringCard
  documents_card: MonitoringCard

  // Active deals
  active_deals: DealConfigurationDashboard[]

  // Summary metrics
  total_deals: number
  compliant_deals: number
  deals_needing_attention: number
  overall_platform_compliance: number  // Average across all 4 components
}
