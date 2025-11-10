/**
 * SSB REQUIREMENT PROTOTYPE
 * =========================
 * Complete traceability example: Obligation → Control → Module → Tasks
 *
 * This prototype demonstrates how UNIFIED-OBL-001 (SSB requirement) flows through
 * the entire system with full research transparency.
 */

// ============================================================================
// OBLIGATION: UNIFIED-OBL-001
// ============================================================================

export interface Obligation {
  id: string
  category: string
  requirement: string
  regulators: Array<{
    id: 'QCB' | 'QFCRA'
    source: {
      document: string
      section: string
      url: string
    }
    requirementText: string
  }>

  // Unification metadata
  conflictsWith?: string[]
  conflictResolution?: string

  // Activation
  qcb_required: boolean
  qfcra_required: boolean

  // Mappings
  controls_activated: string[]
  workflow_modules: string[]

  // Evidence
  evidence_required: string[]

  // Research
  research_phase: number
  peer_reviewed: boolean
}

export const UNIFIED_OBL_001: Obligation = {
  id: 'UNIFIED-OBL-001',
  category: 'Shariah Governance',
  requirement: 'Establish Shariah Supervisory Board (SSB) with minimum 3 qualified scholars',

  regulators: [
    {
      id: 'QCB',
      source: {
        document: 'QCB Law No. 13 of 2012',
        section: 'Article 109',
        url: 'https://www.qcb.gov.qa/en/about-qcb/qcb-law',
      },
      requirementText: 'Every Islamic financial institution shall establish a Shariah Supervisory Board consisting of at least three members specialized in Islamic jurisprudence (fiqh al-muamalat).',
    },
    {
      id: 'QFCRA',
      source: {
        document: 'QFCRA ISFI Rulebook',
        section: 'Chapter 2, Section 2.1',
        url: 'https://www.qfca.org.qa/en/rulebooks/isfi',
      },
      requirementText: 'An Islamic Financial Institution must appoint and maintain a Shariah Supervisory Board of not less than three members who are suitably qualified.',
    },
  ],

  conflictsWith: ['UNIFIED-OBL-002'],
  conflictResolution: 'QCB requires max 3 positions per scholar, QFCRA allows max 5. Applied strictest requirement (3 positions).',

  qcb_required: true,
  qfcra_required: true,

  controls_activated: ['CTRL-SSB-001', 'CTRL-SSB-004'],
  workflow_modules: ['qat-ssb-001'],

  evidence_required: [
    'SSB appointment letters',
    'Scholar CVs and qualifications',
    'Board composition documentation',
    'Independence declarations',
  ],

  research_phase: 2, // Extracted in Phase 2: Obligation Extraction
  peer_reviewed: true,
}

// ============================================================================
// CONTROL: CTRL-SSB-001
// ============================================================================

export interface Control {
  id: string
  bucket: number
  bucketName: string
  name: string
  description: string

  // Testing
  testProcedure: string
  testFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  evidenceTypes: string[]

  // Activation
  qcb_required: boolean
  qfcra_required: boolean

  // Mappings
  satisfiesObligations: string[]
  implementedByModules: string[]
  implementedBySteps: string[]

  // KRIs
  keyRiskIndicators: Array<{
    name: string
    targetValue: number
    currentValue?: number
    unit: string
  }>

  // Automation
  automatable: boolean
  verifiable: boolean
}

export const CTRL_SSB_001: Control = {
  id: 'CTRL-SSB-001',
  bucket: 1,
  bucketName: 'Shariah Governance',
  name: 'SSB Appointment & Composition Verification',
  description: 'Verify that the Shariah Supervisory Board is properly appointed with qualified members meeting all regulatory requirements',

  testProcedure: `
1. Review SSB appointment letters and verify Board resolution approval
2. Verify each scholar has qualifications in fiqh al-muamalat (Islamic commercial jurisprudence)
3. Check position limits: Each scholar max 3 concurrent SSB positions (QCB requirement)
4. Verify independence: No financial interest in institution exceeding 5%
5. Confirm meeting frequency: Minimum quarterly meetings scheduled
6. Review prior year fatwa issuance: Minimum 2 fatwas per year
  `.trim(),

  testFrequency: 'quarterly',

  evidenceTypes: [
    'SSB appointment letters with Board approval',
    'Scholar CVs with Islamic finance qualifications',
    'Position declarations (list of all concurrent SSB roles)',
    'Independence declarations (financial interests)',
    'Meeting schedule for upcoming year',
    'Prior year fatwa register',
  ],

  qcb_required: true,
  qfcra_required: true,

  satisfiesObligations: ['UNIFIED-OBL-001', 'UNIFIED-OBL-002'],
  implementedByModules: ['qat-ssb-001'],
  implementedBySteps: [
    'qat-ssb-001-step-1',
    'qat-ssb-001-step-2',
    'qat-ssb-001-step-3',
    'qat-ssb-001-step-4',
  ],

  keyRiskIndicators: [
    {
      name: 'SSB Independence Score',
      targetValue: 100,
      currentValue: 98,
      unit: '%',
    },
    {
      name: 'Scholar Position Compliance',
      targetValue: 100,
      currentValue: 100,
      unit: '%',
    },
    {
      name: 'Meeting Frequency Compliance',
      targetValue: 4,
      currentValue: 5,
      unit: 'meetings/year',
    },
  ],

  automatable: false, // Requires human judgment
  verifiable: true,   // Can issue Verifiable Credential
}

// ============================================================================
// MODULE ENHANCEMENT: qat-ssb-001
// ============================================================================

export interface ModuleEnhancement {
  moduleId: string
  satisfiesObligations: string[]
  implementsControls: string[]
  researchMethodology: {
    extractedInPhase: number
    conflictsResolved: string[]
    peerReviewedBy: string[]
  }
}

export const QAT_SSB_001_ENHANCEMENT: ModuleEnhancement = {
  moduleId: 'qat-ssb-001',
  satisfiesObligations: ['UNIFIED-OBL-001', 'UNIFIED-OBL-002'],
  implementsControls: ['CTRL-SSB-001', 'CTRL-SSB-004'],
  researchMethodology: {
    extractedInPhase: 2,
    conflictsResolved: [
      'SSB Position Limits: QCB max 3 vs QFCRA max 5 → Applied stricter (3)',
      'Meeting Frequency: QCB quarterly vs QFCRA semi-annual → Applied stricter (quarterly)',
    ],
    peerReviewedBy: ['Senior Shariah Advisor', 'GRC Compliance Lead'],
  },
}

// ============================================================================
// TASK ENHANCEMENTS
// ============================================================================

export interface TaskResearchLinks {
  obligations: Array<{
    id: string
    requirement: string
    source: string
    url: string
  }>
  controls: Array<{
    id: string
    name: string
    testProcedure: string
    url: string
  }>
  methodology: {
    phase: number
    conflictsResolved: string[]
    url: string
  }
}

export function getResearchLinksForSSBTask(taskId: string): TaskResearchLinks {
  return {
    obligations: [
      {
        id: 'UNIFIED-OBL-001',
        requirement: 'Establish Shariah Supervisory Board (SSB) with minimum 3 qualified scholars',
        source: 'QCB Law 13/2012 Article 109, QFCRA ISFI Chapter 2',
        url: '/obligations?filter=UNIFIED-OBL-001',
      },
    ],
    controls: [
      {
        id: 'CTRL-SSB-001',
        name: 'SSB Appointment & Composition Verification',
        testProcedure: 'Review appointments, verify qualifications, check position limits (max 3 per scholar)',
        url: '/controls?filter=CTRL-SSB-001',
      },
    ],
    methodology: {
      phase: 2,
      conflictsResolved: [
        'SSB Position Limits: QCB max 3 vs QFCRA max 5 → Applied stricter (3 positions)',
      ],
      url: '/research/mapping?obligation=UNIFIED-OBL-001',
    },
  }
}

// ============================================================================
// UTILITY: Get full traceability for SSB workflow
// ============================================================================

export interface SSBTraceability {
  obligation: Obligation
  control: Control
  moduleEnhancement: ModuleEnhancement
  taskCount: number
  researchLinks: TaskResearchLinks
}

export function getSSBTraceability(): SSBTraceability {
  return {
    obligation: UNIFIED_OBL_001,
    control: CTRL_SSB_001,
    moduleEnhancement: QAT_SSB_001_ENHANCEMENT,
    taskCount: 4, // qat-ssb-001 has 4 steps
    researchLinks: getResearchLinksForSSBTask('any-ssb-task'),
  }
}
