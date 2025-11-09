/**
 * QATAR IJĀRAH OFF-PLAN CONTROLS LIBRARY
 * ========================================
 * 15 controls across QCB, QFCRA, and AAOIFI for Ijārah off-plan construction
 *
 * Regulatory Sources:
 * - QFCRA IBANK 7.5.2-7.5.8 (Ijārah & Istisnā')
 * - QFCRA ISFI 5.1-6.2 (Shariah Governance)
 * - QCB Circular 2/2025 (Off-Plan Escrow)
 * - AAOIFI SS-9 (Ijarah)
 */

export interface QatarIjarahControl {
  // Identity
  id: string
  bucket: 1 | 2 | 3  // 1=Shariah, 2=Regulatory, 3=Risk
  bucketName: string
  name: string
  purpose: string

  // Execution
  trigger: string
  frequency: 'event-driven' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  requiredEvidence: string[]
  owner: string

  // Validation
  ruleSource: string
  ruleLogic: string
  passThreshold: number

  // Regulatory Applicability
  qcb_required: boolean
  qfcra_required: boolean

  // Automation
  automatable: boolean
  verifiable: boolean
  selectiveDisclosure: boolean
}

// ============================================================================
// A. SHARIAH GOVERNANCE & COMPLIANCE CONTROLS (AAOIFI + QFCRA)
// ============================================================================

export const shariahControls: QatarIjarahControl[] = [
  {
    id: 'IJR-A1',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Lease Commencement Control',
    purpose: 'Prevent rent accrual until possession/usufruct delivered (AAOIFI SS-9 4/1/3)',
    trigger: 'Before first rent billing',
    frequency: 'event-driven',
    requiredEvidence: [
      'Completion Certificate',
      'Occupancy Certificate',
      'Utility Activation Proof',
      'Lessor Title/Assignment Document'
    ],
    owner: 'Shariah Compliance Officer',
    ruleSource: 'AAOIFI SS-9 4/1/3, QFCRA IBANK 7.5.2(1)',
    ruleLogic: `
      IF (completionCert.verified == true
          AND occupancyCert.verified == true
          AND lessorTitle.confirmed == true
          AND deliveryDate.confirmed == true)
      THEN allowRentBilling(startDate = deliveryDate)
      ELSE blockRentBilling()

      IF (deliveryDate > contractualStartDate)
      THEN autoReduceRent(period = contractualStartDate to deliveryDate, rule = 'AAOIFI SS-9 4/1/3')
    `,
    passThreshold: 100, // Must be 100% - hard gate
    qcb_required: true,
    qfcra_required: true,
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-A2',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Forward Ijārah (IMFD) Integrity',
    purpose: 'Ensure pre-delivery commitments are wa\'d/forward, not present lease of non-existent asset',
    trigger: 'Contract signing',
    frequency: 'event-driven',
    requiredEvidence: [
      'Istisnā\' Contract (construction)',
      'Wa\'d to Lease (promise)',
      'Ijārah Contract (pending delivery)',
      'Time-stamped contract suite',
      'No interdependence clause verification'
    ],
    owner: 'Legal + Shariah Review',
    ruleSource: 'QFCRA IBANK 7.5.3(1), AAOIFI SS-9 Forward Ijarah',
    ruleLogic: `
      REQUIRE:
        - 3 separate contracts (Istisnā', Wa'd, Ijārah)
        - Ijārah effective date = AFTER delivery
        - No clause making Istisnā' + Ijārah interdependent
        - SSB sign-off on structure
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: true,
    automatable: true, // AI can scan contracts
    verifiable: true,
    selectiveDisclosure: true
  },

  {
    id: 'IJR-A3',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Permissible Use Control',
    purpose: 'Ensure asset use is halal; if not, income is non-permissible and must be purified',
    trigger: 'Lease inception + ongoing monitoring',
    frequency: 'quarterly',
    requiredEvidence: [
      'Use-case declaration in term sheet',
      'Periodic use verification',
      'Lessee attestation'
    ],
    owner: 'Shariah Compliance Officer',
    ruleSource: 'QFCRA IBANK 7.5.8(2), AAOIFI SS-9',
    ruleLogic: `
      IF (assetUse.category IN prohibitedUses)
      THEN:
        - flagAsNonPermissible()
        - triggerRepossessionPathway()
        - alertSSB()
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: true,
    automatable: false, // Requires human judgment
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-A4',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Late Payment Treatment',
    purpose: 'No increase in rent for delay; only charity pledge if willful (AAOIFI SS-9 6/3-6/4)',
    trigger: 'Payment overdue',
    frequency: 'event-driven',
    requiredEvidence: [
      'Payment history',
      'Willfulness assessment',
      'Charity pledge documentation',
      'SSB approval for charity routing'
    ],
    owner: 'Operations + Shariah',
    ruleSource: 'AAOIFI SS-9 6/3-6/4',
    ruleLogic: `
      IF (paymentOverdue == true)
      THEN:
        - blockLateFeeAccrual()
        - IF (willfulDelay == true) THEN:
            - createCharityPledge()
            - routeToSSBForApproval()
        - markAsNonPermissibleIncome()
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: true,
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-A5',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Maintenance & Takaful Allocation',
    purpose: 'Major maintenance/insurance obligations remain with lessor (not shifted to lessee)',
    trigger: 'Policy renewal + maintenance events',
    frequency: 'annual',
    requiredEvidence: [
      'Takaful policy (lessor-paid)',
      'Renewal confirmations',
      'Major maintenance work orders (lessor-billed)',
      'Minor maintenance delegation (lessee)'
    ],
    owner: 'Asset Manager',
    ruleSource: 'AAOIFI SS-9 5/1/5-5/1/7',
    ruleLogic: `
      REQUIRE:
        - Takaful premium payer = lessor entity
        - Major maintenance = lessor responsibility
        - Minor maintenance = can delegate to lessee

      IF (takafulExpired == true) THEN flagCritical('Takaful lapsed')
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: true,
    automatable: true, // Auto-check policy renewals
    verifiable: true,
    selectiveDisclosure: false
  }
]

// ============================================================================
// B. ESCROW & REGULATORY CONTROLS (QCB CIRCULAR 2/2025)
// ============================================================================

export const escrowControls: QatarIjarahControl[] = [
  {
    id: 'IJR-B6',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Escrow Account Integrity',
    purpose: 'Ensure only buyer payments + project finance flow into escrow (QCB Circular 2/2025)',
    trigger: 'Daily bank feed reconciliation',
    frequency: 'daily',
    requiredEvidence: [
      'Bank statements',
      'Deposit source classification',
      'Flagged non-escrow receipts'
    ],
    owner: 'Finance Controller',
    ruleSource: 'QCB Circular 2/2025 Third(4-5), Fourth(1-3)',
    ruleLogic: `
      FOR EACH deposit IN escrowAccount:
        IF (source NOT IN ['buyer_payment', 'project_finance'])
        THEN:
          - flagCritical('Non-escrow receipt detected')
          - blockDisbursement()
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: false, // QCB-specific
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-B7',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Authority-Gated Disbursements',
    purpose: 'No escrow disbursement without Authority letter (RERA/Aqarat)',
    trigger: 'Disbursement request',
    frequency: 'event-driven',
    requiredEvidence: [
      'Authority letter (RERA/Aqarat) - OCR verified',
      'Consultant progress report',
      'Amount reconciliation',
      'Registered project account confirmation'
    ],
    owner: 'Escrow Manager',
    ruleSource: 'QCB Circular 2/2025 Sixth(1-2)',
    ruleLogic: `
      BEFORE disbursement:
        REQUIRE:
          - authorityLetter.verified == true
          - consultantReport.amount == disbursementAmount
          - recipient == registeredProjectAccount
        ELSE:
          - blockDisbursement(status = 'RED')
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: false,
    automatable: true, // OCR + validation
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-B8',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Per-Unit Sub-Ledger',
    purpose: 'Maintain sub-ledger per off-plan unit with buyer payments and allocated disbursements',
    trigger: 'Unit reservation',
    frequency: 'ongoing',
    requiredEvidence: [
      'Sub-ledger entries',
      'Buyer payment allocations',
      'Disbursement allocations',
      'Buyer statements'
    ],
    owner: 'Finance Controller',
    ruleSource: 'QCB Circular 2/2025 Fourth(2-3)',
    ruleLogic: `
      FOR EACH unit:
        CREATE subLedger {
          unitId: string
          buyerPayments: []
          allocatedDisbursements: []
          balance: number
        }

      PROVIDE buyerStatement ON DEMAND
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: false,
    automatable: true,
    verifiable: true,
    selectiveDisclosure: true // Buyer privacy
  },

  {
    id: 'IJR-B9',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Financing Flows & Assignment of Rights',
    purpose: 'Project finance sits in dedicated financing account; lender may hold assignment of rights',
    trigger: 'Project finance disbursement',
    frequency: 'event-driven',
    requiredEvidence: [
      'Dedicated financing account setup',
      'Lender proceeds deposit into escrow',
      'Assignment of rights approval document',
      'Drawdown routing (escrow → developer account)'
    ],
    owner: 'Finance Controller',
    ruleSource: 'QCB Circular 2/2025 Fifth(2-4); (3)',
    ruleLogic: `
      REQUIRE:
        - separateFinancingAccount(not escrow)
        - lenderProceeds → escrow
        - lenderAssignmentOfRights(optional, documented)
        - drawdowns: escrow → developerAccount
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: false,
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-B10',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Retention & Defect-Liability Control',
    purpose: 'Keep 10% retained in escrow until conditions satisfied (bank guarantee / ministerial period)',
    trigger: 'Project completion',
    frequency: 'event-driven',
    requiredEvidence: [
      'Retention balance (10% of project value)',
      'Bank guarantee (if provided)',
      'Ministerial defect-liability period completion',
      'Authority release approval'
    ],
    owner: 'Escrow Manager',
    ruleSource: 'QCB Circular 2/2025 Seventh(1)',
    ruleLogic: `
      CALCULATE retentionAmount = projectValue * 0.10

      BLOCK release UNTIL:
        - (bankGuarantee.verified == true) OR
        - (ministerialPeriod.completed == true AND authorityRelease.approved == true)
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: false,
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-B11',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Emergency/Step-In Procedures',
    purpose: 'Procedures for transfer/continuation if developer fails (protect buyers and lender)',
    trigger: 'Developer failure event',
    frequency: 'event-driven',
    requiredEvidence: [
      'Step-in playbook',
      'Authority/QCB approval for transfer',
      'Buyer notifications',
      'Continuation plan'
    ],
    owner: 'Legal + Risk',
    ruleSource: 'QCB Circular 2/2025 Seventh(2-4)',
    ruleLogic: `
      IF (developerDefault == true)
      THEN:
        - activateStepInPlaybook()
        - notifyAuthority()
        - protectBuyerInterests()
        - executeContingencyPlan()
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: false,
    automatable: false, // Requires human decision
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-B12',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'AML/KYC on Escrow Participants',
    purpose: 'Meet AML/KYC requirements across buyers/beneficiaries and monitor for misuse',
    trigger: 'Buyer onboarding + ongoing monitoring',
    frequency: 'ongoing',
    requiredEvidence: [
      'KYC documentation (per buyer)',
      'Sanctions screening results',
      'Ongoing monitoring reports',
      'Exam-ready audit trail'
    ],
    owner: 'Compliance Officer',
    ruleSource: 'QCB Circular 2/2025 Eighth(1-3)',
    ruleLogic: `
      FOR EACH buyer:
        - collectKYC()
        - screenSanctions()
        - ongoingMonitoring(frequency = 'quarterly')

      GENERATE examReadyReports()
    `,
    passThreshold: 95, // Allow 5% pending at any time
    qcb_required: true,
    qfcra_required: false,
    automatable: true,
    verifiable: true,
    selectiveDisclosure: true
  }
]

// ============================================================================
// C. RISK MANAGEMENT CONTROLS (QFCRA IBANK)
// ============================================================================

export const riskControls: QatarIjarahControl[] = [
  {
    id: 'IJR-C13',
    bucket: 3,
    bucketName: 'Risk Management',
    name: 'Ijārah Operational Risk Library',
    purpose: 'Surface key risks (damage, destruction, replacement, repossession, rent reduction)',
    trigger: 'Monthly risk review',
    frequency: 'monthly',
    requiredEvidence: [
      'Risk register',
      'Damage/destruction protocols',
      'Rent reduction procedures',
      'Repossession playbook'
    ],
    owner: 'Risk Manager',
    ruleSource: 'QFCRA IBANK 7.5.7-7.5.8',
    ruleLogic: `
      Monitor and respond:
        - Asset damage → replacement/rent reduction pathway
        - Asset destruction → termination + recovery
        - Misuse of asset → repossession + income purification
        - Partial utility impairment → proportional rent reduction (AAOIFI SS-9 5/1/6)
    `,
    passThreshold: 100,
    qcb_required: false,
    qfcra_required: true,
    automatable: false, // Requires human judgment
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-C14',
    bucket: 3,
    bucketName: 'Risk Management',
    name: 'Credit/Large Exposures & Concentration',
    purpose: 'Monitor real-estate/obligor limits per QFCRA prudential requirements',
    trigger: 'Pre-deal approval',
    frequency: 'ongoing',
    requiredEvidence: [
      'Exposure calculations',
      'Limit compliance checks',
      'Concentration reports'
    ],
    owner: 'Credit Risk',
    ruleSource: 'QFCRA IBANK Chapters 4-5',
    ruleLogic: `
      BEFORE deal approval:
        - calculateExposure(borrower, sector, geography)
        - checkAgainstLimits()
        - IF (exceeds) THEN requireBoardApproval()
    `,
    passThreshold: 100,
    qcb_required: false,
    qfcra_required: true,
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false
  },

  {
    id: 'IJR-C15',
    bucket: 1, // Shariah governance (not pure risk)
    bucketName: 'Shariah Governance & Compliance',
    name: 'Shariah Governance Operating Model',
    purpose: 'SSB appointment & operation; policy manual; recording fatāwā; annual Shariah report',
    trigger: 'Quarterly SSB cycle + annual report',
    frequency: 'quarterly',
    requiredEvidence: [
      'SSB appointment letters',
      'Policy & procedures manual',
      'Fatwa registry (immutable)',
      'SSB meeting minutes',
      'Implementation tracker',
      'Annual Shariah report'
    ],
    owner: 'Shariah Governance',
    ruleSource: 'QFCRA ISFI 5.1.2, 6.2.1; AAOIFI GSIFI No. 2',
    ruleLogic: `
      REQUIRE:
        - SSB.members >= 3
        - SSB.qualifications = verified
        - policyManual.upToDate == true
        - fatwaRegistry.immutable == true
        - annualReport.published == true (within 3 months of year-end per QFCRA)
    `,
    passThreshold: 100,
    qcb_required: true,
    qfcra_required: true,
    automatable: false, // SSB governance requires human oversight
    verifiable: true,
    selectiveDisclosure: false
  }
]

// ============================================================================
// COMBINED LIBRARY
// ============================================================================

export const qatarIjarahControls: QatarIjarahControl[] = [
  ...shariahControls,
  ...escrowControls,
  ...riskControls
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getControlById(id: string): QatarIjarahControl | undefined {
  return qatarIjarahControls.find(c => c.id === id)
}

export function getControlsByBucket(bucket: 1 | 2 | 3): QatarIjarahControl[] {
  return qatarIjarahControls.filter(c => c.bucket === bucket)
}

export function getControlsByRegulator(regulator: 'QCB' | 'QFCRA'): QatarIjarahControl[] {
  return qatarIjarahControls.filter(c =>
    regulator === 'QCB' ? c.qcb_required : c.qfcra_required
  )
}

export function getAutomatableControls(): QatarIjarahControl[] {
  return qatarIjarahControls.filter(c => c.automatable)
}

export function getControlStats() {
  return {
    total: qatarIjarahControls.length,
    shariah: shariahControls.length,
    escrow: escrowControls.length,
    risk: riskControls.length,
    qcbRequired: qatarIjarahControls.filter(c => c.qcb_required).length,
    qfcraRequired: qatarIjarahControls.filter(c => c.qfcra_required).length,
    automatable: qatarIjarahControls.filter(c => c.automatable).length,
  }
}
