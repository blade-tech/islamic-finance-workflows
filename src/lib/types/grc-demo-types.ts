/**
 * GRC DEMO TYPES
 * ==============
 * TypeScript type definitions for the Islamic GRC Demo
 *
 * This file defines all data models for the composable workflow system:
 * - Configuration (Phase 1: User selections)
 * - Workflow Modules (Composable building blocks)
 * - Workflows (Assembled from modules)
 * - Tasks (Phase 3: Execution)
 */

// ============================================================================
// CONFIGURATION (Phase 1)
// ============================================================================

export type Jurisdiction = 'qatar' | 'uae' | 'saudi' | 'malaysia'

export type ProductType =
  | 'ijarah'
  | 'murabaha'
  | 'mudaraba'
  | 'sukuk'
  | 'funds'
  | 'takaful'
  | 'musharaka'

export type AccountingStandard = 'aaoifi' | 'ifrs' | 'ifrs-islamic'

export type SustainabilityFramework =
  | 'green-sukuk'
  | 'un-sdgs'
  | 'vbi'
  | 'none'

export interface UploadedDocument {
  id: string
  name: string
  type: 'policy' | 'fatwa' | 'contract-template' | 'other'
  url: string
  uploadedAt: string
}

export interface SustainabilityConfig {
  framework: SustainabilityFramework
  targetSDGs?: string[]
}

export type DealConfigStatus =
  | 'draft'
  | 'workflows-generated'
  | 'workflows-customized'
  | 'deployed'

export interface DealConfiguration {
  id: string
  createdAt: string

  // Step 1: Jurisdiction
  jurisdiction: Jurisdiction

  // Step 2: Product Structure
  productType: ProductType
  productSubtype?: string // e.g., "Ijarah Muntahia Bittamleek (IMB)"

  // Step 3: Accounting & Reporting
  accountingStandard: AccountingStandard

  // Step 4: Sustainability & Impact (Optional)
  sustainability?: SustainabilityConfig

  // Step 5: Additional Documents (Optional)
  uploadedDocuments: UploadedDocument[]

  // Generated metadata
  status: DealConfigStatus
  generatedWorkflows?: Workflow[]
}

// ============================================================================
// WORKFLOW MODULES (Composable)
// ============================================================================

export type ModuleCategory =
  | 'shariah-governance'
  | 'contract-gates'
  | 'risk-management'
  | 'reporting'
  | 'sustainability'

export interface PolicyConstraint {
  source: string // e.g., "AAOIFI SS-9 §3/1"
  constraint: string // Human-readable description
  cannotModify: boolean
}

export interface RequiredEvidence {
  type: string
  description: string
  isRequired: boolean
}

export interface WorkflowStep {
  id: string
  order: number
  title: string
  description: string

  // Assignments
  assignedRole: string // e.g., "Shariah Compliance Officer"
  assignedTo?: string // Specific person (optional)

  // Timing
  durationDays: number
  startAfter?: string[] // Step IDs that must complete first

  // Evidence requirements
  requiredEvidence: RequiredEvidence[]

  // Policy constraints
  policyConstraints: PolicyConstraint[]

  // Approval gates
  requiresApproval: boolean
  approvalRole?: string

  // Customization metadata
  isHardGate: boolean // If true, cannot be skipped/removed
  isOptional: boolean
  allowDurationChange: boolean
  allowRoleChange: boolean
}

export interface WorkflowModule {
  id: string
  name: string
  category: ModuleCategory

  // Policy constraints
  policySource: string // e.g., "AAOIFI SS-9 §4/4"
  isRequired: boolean
  isEditable: boolean // Can users customize this module?

  steps: WorkflowStep[]
}

// ============================================================================
// ASSEMBLED WORKFLOWS
// ============================================================================

export interface CustomizationLogEntry {
  stepId: string
  field: string
  oldValue: any
  newValue: any
  changedBy: string
  changedAt: string
}

export interface Workflow {
  id: string
  dealConfigId: string
  name: string
  description: string

  // Composed from modules
  modules: WorkflowModule[]

  // Flattened steps for execution
  steps: WorkflowStep[]

  // Metadata
  totalDurationDays: number
  criticalPath: string[] // Step IDs on critical path

  // Customization tracking
  isCustomized: boolean
  customizationLog: CustomizationLogEntry[]
}

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export interface DependencyChain {
  before: string // Module ID or Step ID
  after: string | string[] // Module ID(s) or Step ID(s) that must come after
}

export interface AssemblyRules {
  hardGates: string[] // Module/Step IDs that cannot be removed
  dependencyChains: DependencyChain[]
}

export interface WorkflowTemplate {
  productType: ProductType
  jurisdiction: Jurisdiction
  modules: string[] // Module IDs to compose
  assemblyRules: AssemblyRules
}

// ============================================================================
// TASKS (Phase 3: Execution)
// ============================================================================

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export type TaskStatus =
  | 'not-started'
  | 'in-progress'
  | 'waiting-approval'
  | 'completed'
  | 'blocked'

export type TaskRecurrence = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface TaskEvidence {
  type: string
  description: string
  isRequired: boolean
  uploadedFiles?: string[]
}

export interface Task {
  id: string
  workflowId: string
  stepId: string

  // Task details
  title: string
  description: string
  priority: TaskPriority

  // Assignment
  assignedRole: string
  assignedTo?: string

  // Timing
  createdAt: string
  dueDate: string
  scheduledFor?: string // For recurring tasks
  recurrence?: TaskRecurrence

  // Status
  status: TaskStatus
  completedAt?: string
  completedBy?: string

  // Evidence
  requiredEvidence: TaskEvidence[]

  // Approval
  requiresApproval: boolean
  approvalStatus?: ApprovalStatus
  approver?: string

  // Policy context
  policyReference: string // e.g., "AAOIFI SS-9 §4/4"

  // Calendar export
  calendarExported: boolean
  calendarUrl?: string // .ics file URL
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface JurisdictionInfo {
  id: Jurisdiction
  name: string
  flag: string // Emoji flag
  status: 'active' | 'coming-soon'
  comingDate?: string // e.g., "Q2 2025"
}

export interface ProductInfo {
  id: ProductType
  name: string
  nameArabic?: string
  description: string
  standards: string[] // e.g., ["AAOIFI SS-9", "QCB", "QFCRA IBANK 1.3.12"]
  status: 'active' | 'coming-soon'
  category: 'financing' | 'investment' | 'insurance' | 'capital-markets'
}

// ============================================================================
// MODULE LIBRARY TYPES
// ============================================================================

export interface ModuleMetadata {
  id: string
  name: string
  nameArabic?: string
  category: ModuleCategory
  description: string
  requiredFor: ProductType[] // Which products require this module
  optionalFor: ProductType[] // Which products can optionally use this module
  policySource: string
  jurisdiction: Jurisdiction
  isHardGate: boolean
  estimatedDurationDays: number
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
  policySource?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

// ============================================================================
// CALENDAR EXPORT TYPES
// ============================================================================

export type CalendarProvider =
  | 'ics' // Universal .ics file
  | 'google'
  | 'outlook'
  | 'apple'

export interface CalendarExportOptions {
  provider: CalendarProvider
  includeRecurring: boolean
  includeEvidence: boolean
  includeDescription: boolean
  filterByRole?: string
}

// ============================================================================
// ZUSTAND STORE STATE
// ============================================================================

export interface GRCDemoState {
  // Configuration state
  currentConfig: DealConfiguration | null
  isConfiguring: boolean

  // Workflow state
  currentWorkflows: Workflow[]
  isCustomizingWorkflows: boolean

  // Task state
  tasks: Task[]
  activeTaskId: string | null

  // UI state
  currentPhase: 'configuration' | 'workflow-review' | 'dashboard'
  selectedJurisdiction: Jurisdiction | null
  selectedProduct: ProductType | null

  // Actions
  setConfiguration: (config: DealConfiguration) => void
  updateConfiguration: (updates: Partial<DealConfiguration>) => void
  generateWorkflows: () => Promise<void>
  customizeWorkflow: (workflowId: string, updates: Partial<Workflow>) => void
  deployWorkflows: () => Promise<void>

  // Task actions
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  completeTask: (taskId: string, completedBy: string) => void
  exportToCalendar: (options: CalendarExportOptions) => Promise<string>

  // Navigation
  goToPhase: (phase: GRCDemoState['currentPhase']) => void
  reset: () => void
}
