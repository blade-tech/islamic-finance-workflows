/**
 * AGENTIC POD TYPE SYSTEM
 * ========================
 * Type definitions for HITL-first AI pods that assist with GRC workflows
 *
 * Architecture:
 * - All pods follow KISS 4-step workflow: Intake → Evaluate → Propose → HITL
 * - L1 Autonomy: Propose-only, never execute without human approval
 * - ControlPack driven: No runtime policy invention
 * - Clear RACI: Each pod has defined approvers
 */

// ============================================================================
// POD CATEGORIES
// ============================================================================

export type PodCategory = 'event-driven' | 'scheduled'

export type PodId =
  // Event-Driven Pods
  | 'evidence-intake'
  | 'ccm-monitoring'
  | 'gatekeeping'
  | 'sncr-triage'
  | 'segregated-funds'
  | 'counterparty-screening'
  // Scheduled Pods
  | 'shariah-committee'
  | 'regulatory-reporting'
  | 'audit-binder'
  | 'rcsa-health'
  | 'training-attestation'

export type PodStatus =
  | 'idle'
  | 'intake'
  | 'evaluating'
  | 'proposing'
  | 'awaiting-approval'
  | 'executing'
  | 'completed'
  | 'blocked'
  | 'error'

export type ProposalRecommendation =
  | 'ALLOW'
  | 'DENY'
  | 'OPEN_CASE'
  | 'RELEASE'
  | 'HOLD'
  | 'SUBMIT'
  | 'ASSIGN'
  | 'ESCALATE'

export type AutonomyLevel =
  | 'L0' // Full human control (no AI)
  | 'L1' // Propose-only (HITL required)
  | 'L2' // Auto-execute low-risk (human can override)
  | 'L3' // Auto-execute all (human monitors)

// ============================================================================
// CORE POD WORKFLOW
// ============================================================================

/**
 * KISS 4-Step Workflow
 * Every pod follows this exact pattern
 */
export interface PodWorkflow {
  // Step 1: Intake
  intake: {
    required_inputs: string[]
    received_inputs: Record<string, any>
    validation_status: 'valid' | 'invalid' | 'incomplete'
    missing_items: string[]
  }

  // Step 2: Evaluate
  evaluate: {
    rules_run: string[]
    calculations: Record<string, any>
    evidence_refs: string[]
    deterministic: boolean // Must be true - no runtime policy invention
  }

  // Step 3: Propose
  propose: {
    recommendation: ProposalRecommendation
    confidence: number // 0-100
    reasons: string[]
    evidence_refs: string[]
    next_actions: string[]
    estimated_time_saved?: string
  }

  // Step 4: HITL
  hitl: {
    required_approvers: string[] // RACI roles
    approval_status: 'pending' | 'approved' | 'rejected' | 'escalated'
    approved_by?: string[]
    rejected_by?: string
    rejection_reason?: string
    approved_at?: string // ISO date
  }
}

// ============================================================================
// POD EXECUTION CONTEXT
// ============================================================================

export interface PodContext {
  pod_id: PodId
  execution_id: string

  // Guardian Policy Context
  policy_id: string
  jurisdiction: string
  product: string
  control_pack_id: string
  case_id?: string

  // Autonomy & Safety
  autonomy_level: AutonomyLevel
  fail_safe: boolean // If true, deny/block on uncertainty

  // Audit Trail
  initiated_by: string // User ID or system trigger
  initiated_at: string // ISO date
  completed_at?: string // ISO date

  // Inputs
  inputs: Record<string, any>
}

// ============================================================================
// POD OUTPUT (Standard JSON)
// ============================================================================

export interface PodOutput {
  status: 'proposed' | 'blocked' | 'approved' | 'rejected' | 'executing' | 'completed' | 'error'
  recommendation: ProposalRecommendation
  reasons: string[]
  evidence_refs: string[]
  next_actions: string[]

  // Metrics
  time_saved?: string
  confidence?: number

  // Blocking
  missing_items?: string[]

  // Error handling
  error?: {
    code: string
    message: string
    recoverable: boolean
  }
}

// ============================================================================
// SPECIFIC POD DEFINITIONS
// ============================================================================

// Pod #1: Evidence Intake & Checklist
export interface EvidenceIntakePodInput {
  files: Array<{
    filename: string
    content_type: string
    url: string
    size_bytes: number
  }>
  checklist_spec: {
    control_id: string
    required_items: string[]
    templates?: Record<string, any> // OCR templates
  }
}

export interface EvidenceIntakePodOutput extends PodOutput {
  evidence_bundle?: {
    manifest: Array<{
      filename: string
      hash: string
      extracted_fields: Record<string, any>
      checklist_item: string
      ocr_confidence: number
    }>
    checklist_status: {
      total: number
      complete: number
      missing: string[]
    }
  }
}

// Pod #2: Continuous Controls Monitoring (CCM)
export interface CCMPodInput {
  control_pack: string
  event: {
    source: string
    type: string
    timestamp: string
    data: Record<string, any>
  }
}

export interface CCMPodOutput extends PodOutput {
  findings?: Array<{
    control_id: string
    status: 'pass' | 'warn' | 'fail'
    evidence_refs: string[]
    test_logic: string
    actual_value: any
    expected_value: any
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
  summary?: {
    total_tested: number
    passed: number
    failed: number
    warnings: number
    test_duration_seconds: number
  }
}

// Pod #3: Product/Process Gatekeeping
export interface GatekeepingPodInput {
  gate_id: string
  action: string // e.g., "activate_lease", "approve_disbursement"
  evidence_bundle: any
  findings: any[]
  context: Record<string, any>
}

export interface GatekeepingPodOutput extends PodOutput {
  gate_decision?: {
    allow: boolean
    preconditions_met: string[]
    preconditions_missing: string[]
    schedule_delta?: string
    amount_delta?: number
    required_remediation?: string[]
  }
}

// Pod #4: SNCR Triage & Purification
export interface SNCRPodInput {
  failing_finding: any
  transactions: any[]
  contract_context: Record<string, any>
}

export interface SNCRPodOutput extends PodOutput {
  sncr_case?: {
    case_id: string
    classification: 'contractual' | 'operational' | 'systemic'
    exposure: {
      amount: number
      currency: string
      period: string
    }
    purification: {
      method: 'charity' | 'waiver' | 'adjustment' | 'reversal'
      amount: number
      recipient?: string
    }
    rectification_tasks: Array<{
      task: string
      owner: string
      due_date: string
    }>
  }
}

// Pod #5: Segregated Funds / Escrow
export interface SegregatedFundsPodInput {
  event_type: 'deposit' | 'disbursement_request' | 'reconciliation'
  bank_feed?: any
  disbursement_request?: {
    amount: number
    destination: string
    purpose: string
    authority_docs: string[]
  }
  retention_rules: {
    percentage: number
    release_conditions: string[]
  }
}

export interface SegregatedFundsPodOutput extends PodOutput {
  disbursement_proposal?: {
    amount: number
    destination: string
    checks_passed: string[]
    checks_failed: string[]
    retention_held: number
    release_conditions: string[]
  }
}

// Pod #6: Counterparty & Instrument Screening
export interface ScreeningPodInput {
  counterparty: {
    name: string
    country: string
    business_type: string
    kyc_pack: any[]
  }
  sanctions_lists: string[]
  shariah_ruleset: string
}

export interface ScreeningPodOutput extends PodOutput {
  screening_decision?: {
    passed: boolean
    sanctions_hits: Array<{
      list: string
      match_score: number
      details: string
    }>
    shariah_permissibility: 'halal' | 'haram' | 'doubtful'
    missing_evidence: string[]
    cure_tasks: string[]
  }
}

// ============================================================================
// POD ACTIVITY FEED
// ============================================================================

export interface PodActivityItem {
  id: string
  podId: PodId
  timestamp: string
  status: 'completed' | 'failed'
  message: string
}

// ============================================================================
// POD METRICS & MONITORING
// ============================================================================

export interface PodMetrics {
  pod_id: PodId
  period: {
    start: string
    end: string
  }

  executions: {
    total: number
    proposed: number
    approved: number
    rejected: number
    blocked: number
    errors: number
  }

  performance: {
    avg_duration_ms: number
    avg_confidence: number
    approval_rate: number
  }

  impact: {
    time_saved_total: string
    cases_handled: number
    controls_tested: number
    evidence_processed: number
  }
}

// ============================================================================
// POD REGISTRY
// ============================================================================

export interface PodDefinition {
  id: PodId
  name: string
  category: PodCategory
  autonomy_level: AutonomyLevel

  description: string

  // Triggers
  trigger: {
    type: 'event' | 'schedule' | 'manual'
    event_types?: string[]
    cron_schedule?: string
  }

  // RACI
  approvers: string[] // Role names
  default_on_missing: 'deny' | 'escalate' | 'defer'

  // Control Pack
  control_pack_required: boolean
  controls_covered: string[] // Control IDs from ijarah-controls.ts

  // Integration
  tools_available: string[] // MCP tools, subagents
  side_effects: string[] // What this pod can do after approval
}

export const POD_REGISTRY: Record<PodId, PodDefinition> = {
  'evidence-intake': {
    id: 'evidence-intake',
    name: 'Evidence Intake & Checklist Pod',
    category: 'event-driven',
    autonomy_level: 'L1',
    description: 'Automatically processes uploaded documents via OCR, validates against checklists, generates hashes',
    trigger: {
      type: 'event',
      event_types: ['document.uploaded', 'document.ingested']
    },
    approvers: ['Evidence Custodian'],
    default_on_missing: 'deny',
    control_pack_required: true,
    controls_covered: ['IJR-C14', 'IJR-C15'], // OCR Validation, Blockchain VC Evidence
    tools_available: ['ocr', 'hash', 'checklist-validator'],
    side_effects: ['create_evidence_bundle', 'update_checklist']
  },

  'ccm-monitoring': {
    id: 'ccm-monitoring',
    name: 'Continuous Controls Monitoring (CCM) Pod',
    category: 'event-driven',
    autonomy_level: 'L1',
    description: 'Runs control test logic on incoming events, generates findings',
    trigger: {
      type: 'event',
      event_types: ['transaction.created', 'payment.received', 'milestone.completed']
    },
    approvers: ['Control Owner'],
    default_on_missing: 'escalate',
    control_pack_required: true,
    controls_covered: ['IJR-A1', 'IJR-A2', 'IJR-A3', 'IJR-B6', 'IJR-B7', 'IJR-B10', 'IJR-C13'],
    tools_available: ['rule-engine', 'data-validator', 'threshold-checker'],
    side_effects: ['create_finding', 'update_control_status']
  },

  'gatekeeping': {
    id: 'gatekeeping',
    name: 'Product/Process Gatekeeping Pod',
    category: 'event-driven',
    autonomy_level: 'L1',
    description: 'Validates preconditions before allowing gated actions (lease activation, disbursement approval)',
    trigger: {
      type: 'event',
      event_types: ['action.requested']
    },
    approvers: ['Product Owner', 'SCO'],
    default_on_missing: 'deny',
    control_pack_required: true,
    controls_covered: ['IJR-A1', 'IJR-A4', 'IJR-B8', 'IJR-B9'],
    tools_available: ['precondition-checker', 'sequence-validator'],
    side_effects: ['allow_action', 'deny_action', 'schedule_adjustment']
  },

  'sncr-triage': {
    id: 'sncr-triage',
    name: 'SNCR Triage & Purification Pod',
    category: 'event-driven',
    autonomy_level: 'L1',
    description: 'Classifies Shariah non-compliance, calculates exposure and purification, generates rectification tasks',
    trigger: {
      type: 'event',
      event_types: ['finding.critical_shariah_fail']
    },
    approvers: ['SCO', 'Finance Controller', 'SSB'],
    default_on_missing: 'escalate',
    control_pack_required: true,
    controls_covered: ['IJR-A3', 'IJR-A4', 'IJR-A5', 'IJR-A6'],
    tools_available: ['exposure-calculator', 'purification-rules', 'task-generator'],
    side_effects: ['create_sncr_case', 'propose_journal', 'propose_charity_payment']
  },

  'segregated-funds': {
    id: 'segregated-funds',
    name: 'Segregated Funds / Escrow & Fiduciary Flows Pod',
    category: 'event-driven',
    autonomy_level: 'L1',
    description: 'Validates escrow transactions against whitelists, retention rules, authority docs',
    trigger: {
      type: 'event',
      event_types: ['bank.ledger_event', 'disbursement.requested']
    },
    approvers: ['CFO', 'COO'],
    default_on_missing: 'deny',
    control_pack_required: true,
    controls_covered: ['IJR-B6', 'IJR-B7', 'IJR-B10'],
    tools_available: ['whitelist-checker', 'retention-calculator', 'authority-validator'],
    side_effects: ['approve_disbursement', 'block_transaction']
  },

  'counterparty-screening': {
    id: 'counterparty-screening',
    name: 'Counterparty & Instrument Screening Pod',
    category: 'event-driven',
    autonomy_level: 'L1',
    description: 'Screens counterparties against sanctions, KYC completeness, Shariah permissibility',
    trigger: {
      type: 'event',
      event_types: ['onboarding.initiated', 'screening.refresh_due', 'sanctions.list_updated']
    },
    approvers: ['Onboarding Officer', 'SCO'],
    default_on_missing: 'deny',
    control_pack_required: true,
    controls_covered: ['IJR-B11'],
    tools_available: ['sanctions-api', 'kyc-validator', 'shariah-screener'],
    side_effects: ['approve_onboarding', 'block_counterparty', 'create_cure_tasks']
  },

  'shariah-committee': {
    id: 'shariah-committee',
    name: 'Shariah Committee e-Pack & Resolutions Pod',
    category: 'scheduled',
    autonomy_level: 'L1',
    description: 'Assembles SSB meeting packs, drafts resolutions, tracks review dates',
    trigger: {
      type: 'schedule',
      cron_schedule: 'weekly'
    },
    approvers: ['SSB Secretary', 'SSB Chair'],
    default_on_missing: 'defer',
    control_pack_required: true,
    controls_covered: ['IJR-A4'],
    tools_available: ['agenda-builder', 'resolution-drafter', 'evidence-linker'],
    side_effects: ['create_epack', 'record_resolution']
  },

  'regulatory-reporting': {
    id: 'regulatory-reporting',
    name: 'Regulatory Reporting & Disclosures Pod',
    category: 'scheduled',
    autonomy_level: 'L1',
    description: 'Generates regulatory submissions (QCB, QFCRA), validates schemas, prepares for e-sign',
    trigger: {
      type: 'schedule',
      cron_schedule: 'monthly'
    },
    approvers: ['Head of Compliance', 'Authorized Signatory'],
    default_on_missing: 'defer',
    control_pack_required: true,
    controls_covered: ['IJR-B6', 'IJR-B7', 'IJR-B8', 'IJR-B9', 'IJR-B10', 'IJR-B11'],
    tools_available: ['schema-validator', 'report-generator', 'hash-manifest'],
    side_effects: ['create_submission_package']
  },

  'audit-binder': {
    id: 'audit-binder',
    name: 'Audit Binder & Examiner Response Pod',
    category: 'scheduled',
    autonomy_level: 'L1',
    description: 'Builds audit binders, indexes evidence, drafts RFI responses',
    trigger: {
      type: 'schedule',
      cron_schedule: 'monthly'
    },
    approvers: ['Internal Shariah Auditor', 'Internal Audit Lead'],
    default_on_missing: 'defer',
    control_pack_required: true,
    controls_covered: ['IJR-C14', 'IJR-C15'],
    tools_available: ['binder-builder', 'redaction-engine', 'rfi-drafter'],
    side_effects: ['create_audit_binder', 'create_rfi_response']
  },

  'rcsa-health': {
    id: 'rcsa-health',
    name: 'RCSA & Control Health Pod',
    category: 'scheduled',
    autonomy_level: 'L1',
    description: 'Analyzes control effectiveness, identifies hotspots, proposes tuning',
    trigger: {
      type: 'schedule',
      cron_schedule: 'quarterly'
    },
    approvers: ['CRO', 'Control Owners'],
    default_on_missing: 'defer',
    control_pack_required: true,
    controls_covered: ['*'], // All controls
    tools_available: ['trend-analyzer', 'hotspot-detector', 'control-tuner'],
    side_effects: ['create_rcsa_update', 'assign_tuning_tasks']
  },

  'training-attestation': {
    id: 'training-attestation',
    name: 'Training & Attestation Pod',
    category: 'scheduled',
    autonomy_level: 'L1',
    description: 'Assigns micro-trainings based on failure patterns, tracks attestations',
    trigger: {
      type: 'schedule',
      cron_schedule: 'monthly'
    },
    approvers: ['HR', 'Compliance Program Manager'],
    default_on_missing: 'defer',
    control_pack_required: false,
    controls_covered: [],
    tools_available: ['pattern-matcher', 'module-selector', 'assignment-tracker'],
    side_effects: ['assign_training', 'record_attestation']
  }
}
