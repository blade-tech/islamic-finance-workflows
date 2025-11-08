/**
 * GRC TYPES
 * =========
 * TypeScript types for Qatar GRC compliance infrastructure.
 * Based on comprehensive Qatar dual-regulatory research.
 *
 * Research Sources:
 * - QATAR_UNIFIED_OBLIGATIONS_REGISTER.md
 * - QATAR_CONTROL_ACTIVATION_RULES.md
 * - QCB_SSB_GOVERNANCE_MODEL.md
 * - QCB_OBLIGATIONS_CATALOG.md
 * - QFCRA_OBLIGATIONS_CATALOG.md
 */

// ============================================================================
// REGULATORS & COMPLIANCE
// ============================================================================

export type QatarRegulator = 'QCB' | 'QFCRA'

export type ComplianceStatus =
  | 'COMPLIANT'           // Fully compliant
  | 'NEEDS_ATTENTION'     // Non-compliant, action required
  | 'IN_PROGRESS'         // Working toward compliance
  | 'NOT_APPLICABLE'      // N/A for current scope

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// ============================================================================
// OBLIGATIONS
// ============================================================================

export type ObligationCategory =
  | 'SSB_GOVERNANCE'          // Shariah Supervisory Board governance
  | 'SNCR_MANAGEMENT'         // Shariah Non-Compliance Risk management
  | 'PRODUCT_APPROVAL'        // Islamic product approval process
  | 'RISK_MANAGEMENT'         // Risk management framework
  | 'CAPITAL_ADEQUACY'        // Capital adequacy requirements
  | 'LIQUIDITY_MANAGEMENT'    // Liquidity management
  | 'REPORTING'               // Regulatory reporting
  | 'AUDIT'                   // Internal/external audit
  | 'DISCLOSURE'              // Public disclosure requirements
  | 'CUSTOMER_PROTECTION'     // Customer protection
  | 'AML_CFT'                 // Anti-Money Laundering / Counter-Terrorist Financing
  | 'IT_SECURITY'             // IT and cybersecurity
  | 'OUTSOURCING'             // Outsourcing governance
  | 'BRANCH_OPERATIONS'       // Branch operations
  | 'INTERNAL_CONTROLS'       // Internal control framework

export type Frequency =
  | 'ONGOING'     // Continuous compliance
  | 'MONTHLY'     // Monthly reporting/review
  | 'QUARTERLY'   // Quarterly reporting/review
  | 'ANNUAL'      // Annual reporting/review
  | 'AD_HOC'      // Event-driven

export interface ObligationSource {
  regulator: QatarRegulator
  document: string        // e.g., "QCB Regulation No. 2/2019"
  section: string         // e.g., "Article 5.2"
  url?: string           // Link to source document
}

export interface Obligation {
  id: string              // e.g., "UNIFIED-OBL-001"
  title: string
  requirement: string     // Full text of requirement
  applicability: QatarRegulator[]  // ['QCB'], ['QFCRA'], or both
  category: ObligationCategory
  frequency: Frequency
  evidence_required: string[]      // Types of evidence needed
  related_controls: string[]       // Control IDs that satisfy this obligation
  compliance_status: ComplianceStatus
  priority: Priority
  source: ObligationSource
  effective_date: string  // ISO date
  notes?: string         // Implementation notes
}

// ============================================================================
// CONTROLS
// ============================================================================

export type ControlBucket =
  | 'governance'   // Governance controls
  | 'operational'  // Operational controls
  | 'technical'    // Technical/IT controls
  | 'shariah'      // Shariah-specific controls

export type TestResult = 'PASS' | 'FAIL' | 'NOT_TESTED'

export interface Control {
  id: string              // e.g., "CTRL-001"
  name: string
  description: string
  bucket: ControlBucket

  // Regulatory activation
  qcb_required: boolean       // Required when QCB selected
  qfcra_required: boolean     // Required when QFCRA selected

  // Testing
  test_procedure: string      // How to execute this control
  evidence_types: string[]    // What evidence to collect
  kri_tracked: string[]       // Key Risk Indicators this control affects

  // History
  last_test_date?: string     // ISO date
  last_test_result?: TestResult
  next_test_due?: string      // ISO date

  // Traceability
  related_obligations: string[]  // Obligation IDs this control satisfies
  source_document?: string       // Research document where this came from
}

// ============================================================================
// CONTROL TESTS (Execution History)
// ============================================================================

export interface ControlTest {
  id: string
  control_id: string
  executed_by: string     // User who executed test
  execution_date: string  // ISO date
  result: TestResult
  evidence_collected: string[]  // File IDs or document references
  notes: string
  findings?: string       // Issues found during test
  remediation?: string    // Remediation actions if failed
}

// ============================================================================
// SSB (SHARIAH SUPERVISORY BOARD)
// ============================================================================

export type SSBMemberStatus = 'ACTIVE' | 'INACTIVE' | 'COOLING_OFF'

export interface SSBMember {
  id: string
  name: string
  qualifications: string      // e.g., "PhD Islamic Finance, AAOIFI CSAA"
  appointment_date: string    // ISO date
  term_expiry?: string        // ISO date (if applicable)
  current_positions_count: number  // QCB limit: max 3 positions per scholar
  status: SSBMemberStatus
  biography?: string
  specializations: string[]   // e.g., ["Sukuk", "Takaful", "Islamic Banking"]
}

export type SSBDecisionType =
  | 'PRODUCT_APPROVAL'    // New product approval
  | 'FATWA'               // Shariah ruling
  | 'POLICY_REVIEW'       // Policy compliance review
  | 'INCIDENT_RULING'     // SNCR incident ruling

export interface SSBDecision {
  id: string
  decision_date: string   // ISO date
  decision_type: SSBDecisionType
  description: string
  ruling: string          // The actual Shariah ruling
  unanimous: boolean      // Whether decision was unanimous
  dissenting_opinions?: string  // If not unanimous
  related_products: string[]    // Product IDs affected
  related_incidents?: string[]  // SNCR incident IDs (if applicable)
  effective_date: string        // When ruling takes effect
  documents: string[]           // Supporting document IDs
}

// ============================================================================
// SNCR (SHARIAH NON-COMPLIANCE RISK)
// ============================================================================

export type SNCRSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type SNCRStatus =
  | 'REPORTED'       // Incident reported
  | 'UNDER_REVIEW'   // SSB reviewing
  | 'RESOLVED'       // Resolved
  | 'ESCALATED'      // Escalated to regulator

export type PurificationStatus =
  | 'PENDING'       // Awaiting purification
  | 'DISTRIBUTED'   // Purified to charity
  | 'N/A'           // No purification needed

export interface SNCRIncident {
  id: string
  incident_date: string       // ISO date when incident occurred
  detected_by: string         // Who detected (e.g., "Internal Audit", "SSB Review")
  description: string
  severity: SNCRSeverity
  status: SNCRStatus

  // Purification (Taharah)
  purification_amount?: number      // Amount to be purified (if applicable)
  purification_status?: PurificationStatus
  purification_date?: string        // ISO date when purified
  purification_recipient?: string   // Charity recipient

  // SSB involvement
  ssb_decision_id?: string    // Related SSB decision
  ssb_ruling?: string         // SSB's ruling on incident

  // Remediation
  remediation_plan?: string
  remediation_completed?: boolean
  remediation_date?: string   // ISO date

  // Evidence
  evidence_documents: string[]

  // Follow-up
  reported_to_regulator: boolean
  regulator_reference?: string
}

export interface PurificationJournalEntry {
  id: string
  incident_id: string
  amount: number
  currency: string           // e.g., "QAR", "USD"
  purification_date: string  // ISO date
  recipient: string          // Charity name
  receipt_reference: string  // Receipt/proof of distribution
  notes?: string
}

// ============================================================================
// REPORTS
// ============================================================================

export type ReportFrequency = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'AD_HOC'

export type ReportStatus = 'DRAFT' | 'PENDING_REVIEW' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED'

export interface Report {
  id: string
  report_type: string        // e.g., "SSB Annual Report", "SNCR Monthly Report"
  regulator: QatarRegulator
  frequency: ReportFrequency
  reporting_period_start: string  // ISO date
  reporting_period_end: string    // ISO date
  due_date: string                // ISO date
  submission_date?: string        // ISO date (when submitted)
  status: ReportStatus

  // Content
  template_id?: string      // Template used
  generated_file?: string   // Generated file ID

  // Validation
  validated_by?: string     // User who validated
  validation_date?: string  // ISO date
  validation_notes?: string
}

// ============================================================================
// COMPLIANCE METRICS (Calculated)
// ============================================================================

export interface ComplianceMetrics {
  overall_compliance: number           // 0-100 percentage
  obligations_completion: number       // 0-100 percentage
  controls_completion: number          // 0-100 percentage

  total_obligations: number
  compliant_obligations: number
  needs_attention_obligations: number

  total_controls: number
  passed_controls: number
  failed_controls: number
  untested_controls: number

  // SSB metrics
  total_ssb_members: number
  active_ssb_members: number

  // SNCR metrics
  total_sncr_incidents: number
  open_sncr_incidents: number
  resolved_sncr_incidents: number
  total_purification_pending: number   // Amount awaiting purification

  // Reporting metrics
  overdue_reports: number
  pending_reports: number
  submitted_reports: number
}

// ============================================================================
// RESEARCH DOCUMENTATION (For Transparency)
// ============================================================================

export interface ResearchDocument {
  filename: string
  title: string
  description: string
  category: 'obligations' | 'controls' | 'ssb' | 'evidence' | 'reporting' | 'process'
  regulator?: QatarRegulator
  date_created: string
  file_path: string
}

export interface ResearchPhase {
  phase_number: number
  phase_name: string
  description: string
  duration_days: string
  deliverables: string[]
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED'
}

// ============================================================================
// FILTERS & UI STATE
// ============================================================================

export interface ObligationFilters {
  regulators: QatarRegulator[]
  categories: ObligationCategory[]
  statuses: ComplianceStatus[]
  priorities: Priority[]
  search?: string
}

export interface ControlFilters {
  buckets: ControlBucket[]
  regulators: QatarRegulator[]
  testStatus: ('TESTED' | 'UNTESTED')[]
  search?: string
}

export interface SNCRFilters {
  severities: SNCRSeverity[]
  statuses: SNCRStatus[]
  dateRange?: {
    start: string
    end: string
  }
  search?: string
}
