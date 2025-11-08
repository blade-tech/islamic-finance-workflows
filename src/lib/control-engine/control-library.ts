/**
 * CONTROL LIBRARY - 26 Controls across 5 Buckets
 * ================================================
 * Source: ZEROH_SOURCE_OF_TRUTH.md
 *
 * This is the single source of truth for all compliance controls.
 * The UI auto-generates from this structured data.
 */

export type ControlBucket = 1 | 2 | 3 | 4 | 5
export type LifecyclePhase = 'A' | 'B' | 'C' | 'D'
export type ControlFrequency = 'one-time' | 'event-driven' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'

export interface Control {
  id: string // Format: {BUCKET}-{NN} e.g., "SG-01"
  bucket: ControlBucket
  bucketName: 'Shariah' | 'Regulatory' | 'Risk' | 'Financial' | 'Audit'
  name: string
  purpose: string
  standardReference: string // e.g., "AAOIFI GS-1; IFSB-10 §4.1"
  trigger: string
  frequency: ControlFrequency
  requiredEvidence: string[]
  owner: string // Role name
  ruleLogic?: string
  proofType: string // VC type to mint
  metric: string // KRI/KPI for dashboard
  metricType: 'percentage' | 'count' | 'duration' | 'score' | 'amount'
  automatable: boolean
  verifiable: boolean
  selectiveDisclosure: boolean
  lifecyclePhases: LifecyclePhase[] // Which phases this control executes in
}

// =============================================================================
// BUCKET 1: SHARIAH GOVERNANCE & COMPLIANCE
// =============================================================================

export const BUCKET_1_CONTROLS: Control[] = [
  {
    id: 'SG-01',
    bucket: 1,
    bucketName: 'Shariah',
    name: 'SSB Mandate & Fatwa Issuance',
    purpose: 'Obtain SSB fatwa confirming Shariah compliance of product structure',
    standardReference: 'AAOIFI GS-1; IFSB-10 §4.1',
    trigger: 'New product/transaction structure',
    frequency: 'one-time',
    requiredEvidence: ['SSB Resolution', 'Fatwa Document', 'Product Structure Review'],
    owner: 'Shariah Supervisory Board',
    proofType: 'ShariahFatwaCredential',
    metric: 'Fatwa issuance time (days)',
    metricType: 'duration',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['A']
  },
  {
    id: 'SG-02',
    bucket: 1,
    bucketName: 'Shariah',
    name: 'Shariah Review (Compliance Function)',
    purpose: 'Ongoing review of transaction documents for Shariah conformity',
    standardReference: 'AAOIFI GS-2; BNM Shariah Governance Policy §7',
    trigger: 'Pre-issuance, issuance, and monthly ongoing',
    frequency: 'monthly',
    requiredEvidence: ['Shariah Compliance Certificate', 'Document Review Report', 'Compliance Checklist'],
    owner: 'Shariah Compliance Officer',
    proofType: 'ShariahReviewCredential',
    metric: 'Non-compliance issues identified',
    metricType: 'count',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['A', 'B', 'C']
  },
  {
    id: 'SG-03',
    bucket: 1,
    bucketName: 'Shariah',
    name: 'Shariah Risk Management',
    purpose: 'Identify and manage Shariah Non-Compliance (SNC) risk',
    standardReference: 'BNM Shariah Governance §5; IFSB-1 §7.2',
    trigger: 'Product design phase',
    frequency: 'one-time',
    requiredEvidence: ['SNC Risk Matrix', 'Risk Mitigation Plan', 'Control Framework'],
    owner: 'Risk Management',
    proofType: 'ShariahRiskCredential',
    metric: 'SNC risk score',
    metricType: 'score',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['A']
  },
  {
    id: 'SG-04',
    bucket: 1,
    bucketName: 'Shariah',
    name: 'Shariah Audit (Internal/Independent)',
    purpose: 'Periodic independent audit of Shariah compliance execution',
    standardReference: 'AAOIFI GS-3',
    trigger: 'Annual or per SSB requirement',
    frequency: 'annual',
    requiredEvidence: ['Internal Audit Report', 'Audit Findings', 'Management Response'],
    owner: 'Internal Audit',
    proofType: 'ShariahAuditCredential',
    metric: 'Audit findings count',
    metricType: 'count',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['D']
  },
  {
    id: 'SG-05',
    bucket: 1,
    bucketName: 'Shariah',
    name: 'SNC Event Handling & Purification',
    purpose: 'Log and purify any non-compliant income',
    standardReference: 'IFSB-1 §7.2; AAOIFI GS-1 §3',
    trigger: 'When SNC event detected',
    frequency: 'event-driven',
    requiredEvidence: ['SNC Event Log', 'Purification Calculation', 'Charity Receipt'],
    owner: 'Shariah Compliance Officer',
    proofType: 'SNCEventCredential',
    metric: 'SNC events count',
    metricType: 'count',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['C']
  }
]

// =============================================================================
// BUCKET 2: REGULATORY & LEGAL COMPLIANCE
// =============================================================================

export const BUCKET_2_CONTROLS: Control[] = [
  {
    id: 'RL-01',
    bucket: 2,
    bucketName: 'Regulatory',
    name: 'Licensing & Registration',
    purpose: 'Obtain required regulatory licenses and registrations',
    standardReference: 'BNM FSA 2013; CMA Regulations; DFSA/FSRA Rules',
    trigger: 'New product launch in jurisdiction',
    frequency: 'one-time',
    requiredEvidence: ['License Application', 'Approval Letter', 'Registration Certificate'],
    owner: 'Legal & Compliance',
    proofType: 'RegulatoryLicenseCredential',
    metric: 'License approval time (days)',
    metricType: 'duration',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['A']
  },
  {
    id: 'RL-02',
    bucket: 2,
    bucketName: 'Regulatory',
    name: 'Local Shariah Board Requirements',
    purpose: 'Obtain local Shariah authority endorsement (jurisdiction-specific)',
    standardReference: 'BNM SAC; CMA Shariah Rules; DFSA Shariah Supervisory',
    trigger: 'If Malaysia, Saudi Arabia, or UAE jurisdiction',
    frequency: 'one-time',
    requiredEvidence: ['SAC Endorsement', 'Local SSB Approval', 'Shariah Certification'],
    owner: 'Legal & Compliance',
    proofType: 'LocalShariahEndorsementCredential',
    metric: 'Endorsement time (days)',
    metricType: 'duration',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['A']
  },
  {
    id: 'RL-03',
    bucket: 2,
    bucketName: 'Regulatory',
    name: 'Public Offering Compliance',
    purpose: 'Prepare and file prospectus/offering circular for public offerings',
    standardReference: 'BNM SC Guidelines; MAS Notice; DFSA Rulebook',
    trigger: 'If public or hybrid offering',
    frequency: 'one-time',
    requiredEvidence: ['Prospectus', 'Regulatory Approval', 'Material Disclosure'],
    owner: 'Legal & Compliance',
    proofType: 'PublicOfferingCredential',
    metric: 'Prospectus approval time (days)',
    metricType: 'duration',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['B']
  },
  {
    id: 'RL-04',
    bucket: 2,
    bucketName: 'Regulatory',
    name: 'AML/CTF Compliance (FATF)',
    purpose: 'Customer Due Diligence and beneficial ownership identification',
    standardReference: 'FATF R.10, R.11 (CDD for Islamic finance)',
    trigger: 'All transactions (global requirement)',
    frequency: 'one-time',
    requiredEvidence: ['CDD Forms', 'AML Risk Assessment', 'Screening Reports'],
    owner: 'Compliance',
    proofType: 'AMLComplianceCredential',
    metric: 'CDD completion rate',
    metricType: 'percentage',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['B', 'C']
  },
  {
    id: 'RL-05',
    bucket: 2,
    bucketName: 'Regulatory',
    name: 'Ongoing Disclosure & Material Events',
    purpose: 'Continuous disclosure of material events (if listed)',
    standardReference: 'Exchange Listing Rules; Securities Regulations',
    trigger: 'If listed on exchange',
    frequency: 'event-driven',
    requiredEvidence: ['Material Event Disclosure', 'Exchange Filing', 'Investor Notice'],
    owner: 'Legal & Compliance',
    proofType: 'MaterialEventCredential',
    metric: 'Disclosure timeliness (hours)',
    metricType: 'duration',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['C']
  }
]

// =============================================================================
// BUCKET 3: RISK MANAGEMENT
// =============================================================================

export const BUCKET_3_CONTROLS: Control[] = [
  {
    id: 'RM-01',
    bucket: 3,
    bucketName: 'Risk',
    name: 'Shariah Non-Compliance (SNC) Risk Identification',
    purpose: 'Identify and quantify SNC risk for the transaction',
    standardReference: 'IFSB-1 §7.2; BNM ICAAP',
    trigger: 'All Islamic finance products',
    frequency: 'one-time',
    requiredEvidence: ['Risk Register', 'SNC Risk Assessment', 'Mitigation Controls'],
    owner: 'Risk Management',
    proofType: 'SNCRiskCredential',
    metric: 'SNC risk score',
    metricType: 'score',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['A']
  },
  {
    id: 'RM-02',
    bucket: 3,
    bucketName: 'Risk',
    name: 'Rate-of-Return (RoR) Risk',
    purpose: 'Quantify variability in asset returns affecting profit distributions',
    standardReference: 'IFSB-1 §4.4; IFSB-10 §7.1',
    trigger: 'If asset-based structure (Ijarah, Mudarabah)',
    frequency: 'quarterly',
    requiredEvidence: ['RoR Stress Testing', 'Profit Smoothing Reserve Policy', 'DCR Analysis'],
    owner: 'Risk Management',
    proofType: 'RoRRiskCredential',
    metric: 'RoR volatility (%)',
    metricType: 'percentage',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['A', 'C']
  },
  {
    id: 'RM-03',
    bucket: 3,
    bucketName: 'Risk',
    name: 'Credit/Counterparty Risk',
    purpose: 'Assess counterparty payment obligations and creditworthiness',
    standardReference: 'IFSB-1 §4.5; Basel III (IFSB adaptation)',
    trigger: 'If debt-like structure (Murabaha, Istisna\'a, Salam)',
    frequency: 'quarterly',
    requiredEvidence: ['Credit Risk Assessment', 'Counterparty Analysis', 'Collateral Valuation'],
    owner: 'Risk Management',
    proofType: 'CreditRiskCredential',
    metric: 'Expected credit loss',
    metricType: 'amount',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['A', 'C']
  },
  {
    id: 'RM-04',
    bucket: 3,
    bucketName: 'Risk',
    name: 'Equity Investment Risk',
    purpose: 'Assess equity-based profit/loss sharing volatility',
    standardReference: 'IFSB-1 §4.6; AAOIFI FAS 3',
    trigger: 'If equity structure (Musharakah, Mudarabah, Islamic Funds)',
    frequency: 'quarterly',
    requiredEvidence: ['Equity Risk Analysis', 'Profit/Loss Projections', 'Exit Strategy'],
    owner: 'Risk Management',
    proofType: 'EquityRiskCredential',
    metric: 'Equity volatility (%)',
    metricType: 'percentage',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['A', 'C']
  },
  {
    id: 'RM-05',
    bucket: 3,
    bucketName: 'Risk',
    name: 'Stress Testing & Scenario Analysis',
    purpose: 'Test resilience under adverse economic scenarios',
    standardReference: 'IFSB-1 §6.3; BNM Stress Testing Guidelines',
    trigger: 'If transaction size >$50M',
    frequency: 'annual',
    requiredEvidence: ['Stress Test Scenarios', 'Impact Analysis', 'Contingency Plans'],
    owner: 'Risk Management',
    proofType: 'StressTestCredential',
    metric: 'Worst-case loss (%)',
    metricType: 'percentage',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['B', 'C']
  }
]

// =============================================================================
// BUCKET 4: FINANCIAL & PRODUCT REPORTING
// =============================================================================

export const BUCKET_4_CONTROLS: Control[] = [
  {
    id: 'FR-01',
    bucket: 4,
    bucketName: 'Financial',
    name: 'AAOIFI/IFRS-Compliant Reporting',
    purpose: 'Prepare financial statements per selected accounting framework',
    standardReference: 'AAOIFI FAS 1-34; IFSB-1 §9',
    trigger: 'Accounting framework selection',
    frequency: 'quarterly',
    requiredEvidence: ['Financial Statements', 'Accounting Policies', 'Notes to Accounts'],
    owner: 'Finance',
    proofType: 'FinancialReportingCredential',
    metric: 'Reporting timeliness (days)',
    metricType: 'duration',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['B', 'C', 'D']
  },
  {
    id: 'FR-02',
    bucket: 4,
    bucketName: 'Financial',
    name: 'Regulatory Reporting',
    purpose: 'Submit regulatory reports per jurisdiction requirements',
    standardReference: 'BNM RR Series; CMA Reporting; DFSA Returns',
    trigger: 'Jurisdiction-specific frequency',
    frequency: 'quarterly',
    requiredEvidence: ['Regulatory Returns', 'Submission Receipts', 'Reconciliation'],
    owner: 'Finance',
    proofType: 'RegulatoryReportingCredential',
    metric: 'Submission timeliness (days)',
    metricType: 'duration',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['C']
  },
  {
    id: 'FR-03',
    bucket: 4,
    bucketName: 'Financial',
    name: 'Taxation Compliance',
    purpose: 'Tax calculation and filing per jurisdiction',
    standardReference: 'Malaysia ITA 1967; Zakat regulations',
    trigger: 'Jurisdiction tax rules',
    frequency: 'annual',
    requiredEvidence: ['Tax Returns', 'Zakat Calculation', 'Payment Receipts'],
    owner: 'Finance',
    proofType: 'TaxComplianceCredential',
    metric: 'Tax filing timeliness (days)',
    metricType: 'duration',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['B', 'C']
  },
  {
    id: 'FR-04',
    bucket: 4,
    bucketName: 'Financial',
    name: 'Use of Proceeds Tracking',
    purpose: 'Track allocation of proceeds to eligible green/social projects',
    standardReference: 'ICMA GBP; AAOIFI GS-47 (Sustainable Sukuk)',
    trigger: 'If Green/Social Sukuk',
    frequency: 'quarterly',
    requiredEvidence: ['Allocation Report', 'Project Disbursements', 'Eligibility Confirmation'],
    owner: 'Finance',
    proofType: 'UseOfProceedsCredential',
    metric: 'Allocation percentage (%)',
    metricType: 'percentage',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['A', 'C']
  },
  {
    id: 'FR-05',
    bucket: 4,
    bucketName: 'Financial',
    name: 'KPI Monitoring (Sustainability-Linked)',
    purpose: 'Track sustainability KPIs and verify SPT achievement',
    standardReference: 'ICMA SLBP; BNM VBIAF',
    trigger: 'If Sustainability-Linked structure',
    frequency: 'quarterly',
    requiredEvidence: ['KPI Measurement Report', 'Baseline Documentation', 'SPT Verification'],
    owner: 'Finance',
    proofType: 'SustainabilityKPICredential',
    metric: 'KPI achievement (%)',
    metricType: 'percentage',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['A', 'C']
  },
  {
    id: 'FR-06',
    bucket: 4,
    bucketName: 'Financial',
    name: 'Investor Reporting',
    purpose: 'Provide periodic updates to investors on performance and compliance',
    standardReference: 'ICMA transparency recommendations',
    trigger: 'Offering type and listing status',
    frequency: 'quarterly',
    requiredEvidence: ['Investor Report', 'Performance Summary', 'Compliance Update'],
    owner: 'Finance',
    proofType: 'InvestorReportCredential',
    metric: 'Report distribution time (days)',
    metricType: 'duration',
    automatable: true,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['B', 'C']
  }
]

// =============================================================================
// BUCKET 5: AUDIT & ASSURANCE
// =============================================================================

export const BUCKET_5_CONTROLS: Control[] = [
  {
    id: 'AA-01',
    bucket: 5,
    bucketName: 'Audit',
    name: 'Internal Shariah Audit',
    purpose: 'Internal audit of Shariah compliance execution',
    standardReference: 'AAOIFI GS-3; IFSB-10 §4.2',
    trigger: 'All products (baseline requirement)',
    frequency: 'annual',
    requiredEvidence: ['Internal Audit Report', 'Audit Program', 'Management Response'],
    owner: 'Internal Audit',
    proofType: 'InternalAuditCredential',
    metric: 'Audit findings count',
    metricType: 'count',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: false,
    lifecyclePhases: ['D']
  },
  {
    id: 'AA-02',
    bucket: 5,
    bucketName: 'Audit',
    name: 'External Shariah Audit',
    purpose: 'Independent third-party Shariah compliance audit',
    standardReference: 'IFSB-10 §4.2; BNM audit guidelines',
    trigger: 'If transaction >$50M OR public offering',
    frequency: 'annual',
    requiredEvidence: ['External Audit Report', 'Auditor Opinion', 'Management Letter'],
    owner: 'External Auditor',
    proofType: 'ExternalAuditCredential',
    metric: 'Audit opinion (clean/qualified)',
    metricType: 'score',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['D']
  },
  {
    id: 'AA-03',
    bucket: 5,
    bucketName: 'Audit',
    name: 'Periodic Assurance Reports',
    purpose: 'Semi-annual assurance for listed securities',
    standardReference: 'Exchange Listing Rules',
    trigger: 'If listed on exchange',
    frequency: 'annual',
    requiredEvidence: ['Assurance Report', 'Compliance Certificate', 'Exchange Filing'],
    owner: 'External Auditor',
    proofType: 'AssuranceReportCredential',
    metric: 'Report submission time (days)',
    metricType: 'duration',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['C']
  },
  {
    id: 'AA-04',
    bucket: 5,
    bucketName: 'Audit',
    name: 'External Assurance (Impact/ESG)',
    purpose: 'Second Party Opinion or external verification for sustainability claims',
    standardReference: 'ICMA GBP §4 (External Review)',
    trigger: 'If any sustainability component',
    frequency: 'annual',
    requiredEvidence: ['Second Party Opinion', 'Verification Report', 'Assurance Statement'],
    owner: 'External ESG Auditor',
    proofType: 'ESGAssuranceCredential',
    metric: 'Assurance opinion (positive/qualified)',
    metricType: 'score',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['B', 'C']
  },
  {
    id: 'AA-05',
    bucket: 5,
    bucketName: 'Audit',
    name: 'Shariah Audit (AAOIFI-specific)',
    purpose: 'Mandatory Shariah audit if AAOIFI framework selected',
    standardReference: 'AAOIFI GS-3 §5',
    trigger: 'If AAOIFI accounting framework',
    frequency: 'annual',
    requiredEvidence: ['AAOIFI Shariah Audit Report', 'FAS Compliance Review', 'Fatwa Conformity'],
    owner: 'External Auditor',
    proofType: 'AAOIFIAuditCredential',
    metric: 'Audit opinion (clean/qualified)',
    metricType: 'score',
    automatable: false,
    verifiable: true,
    selectiveDisclosure: true,
    lifecyclePhases: ['D']
  }
]

// =============================================================================
// AGGREGATED CONTROL LIBRARY
// =============================================================================

export const ALL_CONTROLS: Control[] = [
  ...BUCKET_1_CONTROLS,
  ...BUCKET_2_CONTROLS,
  ...BUCKET_3_CONTROLS,
  ...BUCKET_4_CONTROLS,
  ...BUCKET_5_CONTROLS
]

export const CONTROLS_BY_BUCKET = {
  1: BUCKET_1_CONTROLS,
  2: BUCKET_2_CONTROLS,
  3: BUCKET_3_CONTROLS,
  4: BUCKET_4_CONTROLS,
  5: BUCKET_5_CONTROLS
}

export const BUCKET_NAMES = {
  1: 'Shariah Governance & Compliance',
  2: 'Regulatory & Legal Compliance',
  3: 'Risk Management',
  4: 'Financial & Product Reporting',
  5: 'Audit & Assurance'
}

export const BUCKET_ICONS = {
  1: '🕌',
  2: '⚖️',
  3: '📊',
  4: '📈',
  5: '🔍'
}

export const LIFECYCLE_PHASE_NAMES = {
  A: 'Pre-Issuance',
  B: 'Issuance/Execution',
  C: 'Post-Issuance',
  D: 'Audit & Assurance'
}

// Helper functions
export function getControlById(id: string): Control | undefined {
  return ALL_CONTROLS.find(control => control.id === id)
}

export function getControlsByBucket(bucket: ControlBucket): Control[] {
  return CONTROLS_BY_BUCKET[bucket] || []
}

export function getControlsByPhase(phase: LifecyclePhase): Control[] {
  return ALL_CONTROLS.filter(control => control.lifecyclePhases.includes(phase))
}
