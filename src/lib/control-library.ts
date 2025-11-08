/**
 * ZeroH Control Library v2.0 (Standards-Aligned)
 *
 * Configuration-driven control library for Islamic Finance GRC
 * Aligned to: IFSB, AAOIFI, BNM, FATF, ICMA standards
 *
 * Each control auto-generates:
 * - Task cards (Screen 2)
 * - Dashboard metrics (Screen 1)
 * - Agent behaviors
 * - VC templates (Screen 5)
 * - Workflow steps (Screen 4)
 */

export interface Control {
  // Identity
  id: string                    // "SG-01"
  bucket: 1 | 2 | 3 | 4 | 5
  bucketName: string
  name: string
  purpose: string

  // Execution
  trigger: string
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'event-driven'
  requiredEvidence: string[]
  owner: string                 // Role name

  // Validation
  ruleSource: string            // "AAOIFI GS-1, IFSB-10 §4.1"
  ruleLogic?: string            // Natural language or Rego
  passThreshold?: number

  // Output
  proofType: string             // "VC (approval)"
  vcSchema?: string             // JSON-LD schema URL
  metric: string
  metricType: 'percentage' | 'count' | 'duration' | 'score'
  targetValue?: number

  // Implementation
  notes?: string
  automatable: boolean
  verifiable: boolean
  selectiveDisclosure: boolean
}

/**
 * BUCKET 1: SHARIAH GOVERNANCE & COMPLIANCE (SG)
 * Standards: IFSB-10, AAOIFI GS-1/2/3/11/12, BNM Shariah Governance Policy
 */
const shariahGovernanceControls: Control[] = [
  {
    id: 'SG-01',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'SSB Mandate & Fatwa Issuance',
    purpose: 'Ensure Shariah approval before use',
    trigger: 'Once per product/deal + on amendment',
    frequency: 'event-driven',
    requiredEvidence: [
      'Signed fatwa document',
      'SSB resolution',
      'Fatwa scope statement',
      'Conditions and restrictions'
    ],
    owner: 'Shariah Board Secretary',
    ruleSource: 'AAOIFI GS-1, IFSB-10 §4.1',
    ruleLogic: 'All deals must have valid, current fatwa before execution',
    passThreshold: 100,
    proofType: 'VC (Shariah Approval)',
    vcSchema: 'https://zeroh.io/schemas/shariah-approval-v1.json',
    metric: '% deals with valid fatwa',
    metricType: 'percentage',
    targetValue: 100,
    automatable: false, // Requires SSB human approval
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Critical control - blocks deal execution if missing'
  },
  {
    id: 'SG-02',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Shariah Review (Compliance Function)',
    purpose: 'Catch SNC risks in docs pre-execution',
    trigger: 'Per template update & deal pack',
    frequency: 'event-driven',
    requiredEvidence: [
      'Checked clauses list',
      'Review minutes',
      'Shariah compliance sign-off'
    ],
    owner: 'Shariah Reviewer',
    ruleSource: 'AAOIFI GS-2, BNM Shariah Governance Policy §6.3',
    ruleLogic: 'All transaction docs reviewed by Shariah Review function before execution',
    passThreshold: 100,
    proofType: 'VC (Review Complete) + hash of redlined docs',
    vcSchema: 'https://zeroh.io/schemas/shariah-review-v1.json',
    metric: '% doc sets reviewed pre-sign',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent can collect docs, flag clauses
    verifiable: true,
    selectiveDisclosure: true,
    notes: 'Auto-open remediation task if non-compliant clauses found'
  },
  {
    id: 'SG-03',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Shariah Risk Management',
    purpose: 'Identify & control SNC risks',
    trigger: 'Quarterly risk register update',
    frequency: 'quarterly',
    requiredEvidence: [
      'SNC risk register',
      'Risk ratings',
      'Mitigation plans',
      'Risk owner assignments'
    ],
    owner: 'Shariah Risk Officer',
    ruleSource: 'BNM Shariah Governance Policy §5, IFSB-1 Principle 7',
    ruleLogic: 'All SNC risks documented with mitigation and ownership',
    passThreshold: 100,
    proofType: 'VC (Risk Register Updated)',
    vcSchema: 'https://zeroh.io/schemas/shariah-risk-v1.json',
    metric: '% SNC risks with active mitigations',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent can track register, alert on gaps
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Cross-links to SG-04 (Shariah Audit) and RM-05 (SNC Risk)'
  },
  {
    id: 'SG-04',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'Shariah Audit (Internal/Independent)',
    purpose: 'Periodic audit of execution vs fatwa',
    trigger: 'Annual + deal milestones',
    frequency: 'annual',
    requiredEvidence: [
      'Audit plan',
      'Sampled transactions',
      'Audit findings',
      'Management responses',
      'Closure evidence'
    ],
    owner: 'Shariah Auditor',
    ruleSource: 'AAOIFI GS-3/GS-11, BNM Shariah Governance Policy §7',
    ruleLogic: 'Independent Shariah audit conducted annually with findings closed',
    passThreshold: 95,
    proofType: 'VC (Shariah Audit Complete)',
    vcSchema: 'https://zeroh.io/schemas/shariah-audit-v1.json',
    metric: 'Findings aging, reopen rate',
    metricType: 'duration',
    targetValue: 30, // Max 30 days to close findings
    automatable: false, // Requires independent auditor
    verifiable: true,
    selectiveDisclosure: true, // Auditor findings sensitive
    notes: 'Pulls evidence from SG bucket. Distinct from AA-01 (Internal Audit)'
  },
  {
    id: 'SG-05',
    bucket: 1,
    bucketName: 'Shariah Governance & Compliance',
    name: 'SNC Event Handling & Purification',
    purpose: 'Record and rectify non-compliance',
    trigger: 'On each suspected SNC event',
    frequency: 'event-driven',
    requiredEvidence: [
      'SNC incident record',
      'Purification computation',
      'Donation proof',
      'Disclosure documentation'
    ],
    owner: 'Operations + Shariah',
    ruleSource: 'IFSB-1 §7.2, AAOIFI Shariah Standards',
    ruleLogic: 'All SNC events logged, purified, and disclosed per AAOIFI guidance',
    passThreshold: 100,
    proofType: 'VC (SNC Closed) + ledger anchor',
    vcSchema: 'https://zeroh.io/schemas/snc-purification-v1.json',
    metric: 'Mean time to close SNC',
    metricType: 'duration',
    targetValue: 7, // Max 7 days to close
    automatable: true, // Agent can compute purification amount
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Ties to financial adjustments (FR-02 Profit Recognition)'
  }
]

/**
 * BUCKET 2: REGULATORY & LEGAL COMPLIANCE (RL)
 * Standards: FATF 40, Securities/Listing Guidelines
 */
const regulatoryLegalControls: Control[] = [
  {
    id: 'RL-01',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Licensing & Fit-and-Proper',
    purpose: 'Operate within permitted scope',
    trigger: 'Daily check / renewal cycles',
    frequency: 'daily',
    requiredEvidence: [
      'License certificate',
      'Regulator registry lookup',
      'Fit-and-proper attestations'
    ],
    owner: 'Compliance Officer',
    ruleSource: 'Jurisdictional regulations (DFSA, CBB, OJK, BNM, etc.)',
    ruleLogic: 'Valid license with >30 days to expiry',
    passThreshold: 30, // Alert if <30 days to expiry
    proofType: 'VC (License Status)',
    vcSchema: 'https://zeroh.io/schemas/license-status-v1.json',
    metric: 'Days to license expiry',
    metricType: 'duration',
    targetValue: 90, // Target: maintain >90 days buffer
    automatable: true, // Agent can check registry daily
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Multi-jurisdiction map for cross-border deals'
  },
  {
    id: 'RL-02',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'AML/CFT & Sanctions (FATF 40)',
    purpose: 'Meet AML/CFT obligations',
    trigger: 'Onboarding + periodic refresh',
    frequency: 'event-driven',
    requiredEvidence: [
      'CDD records',
      'PEP screening results',
      'Sanctions screening results',
      'Ongoing monitoring logs',
      'Beneficial ownership records'
    ],
    owner: 'KYC/AML Officer',
    ruleSource: 'FATF Recommendations 10, 11, 12; Local AML Acts',
    ruleLogic: 'All customers have current CDD within refresh window (12 months high-risk, 24 months low-risk)',
    passThreshold: 100,
    proofType: 'VC (CDD Complete)',
    vcSchema: 'https://zeroh.io/schemas/aml-cdd-v1.json',
    metric: '% customers current on CDD refresh',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent can run screenings, flag expiries
    verifiable: true,
    selectiveDisclosure: true, // PII sensitive
    notes: 'Auto-reminders 30 days before refresh due'
  },
  {
    id: 'RL-03',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Data Processing Consent & Sharing',
    purpose: 'Lawful basis for data use',
    trigger: 'On data collection & each share event',
    frequency: 'event-driven',
    requiredEvidence: [
      'Consent record',
      'Data sharing log',
      'Lawful basis documentation',
      'Privacy notice acknowledgment'
    ],
    owner: 'Data Protection Officer',
    ruleSource: 'GDPR Art. 6/7, Local Privacy Laws (e.g., PDPA Malaysia)',
    ruleLogic: 'All personal data has valid consent or lawful basis',
    passThreshold: 100,
    proofType: 'VC (Consent) + SD presentation',
    vcSchema: 'https://zeroh.io/schemas/data-consent-v1.json',
    metric: '% records with valid consent',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent tracks consent expiry
    verifiable: true,
    selectiveDisclosure: true, // Use SD-JWT for sharing
    notes: 'Selective disclosure feature critical for compliance'
  },
  {
    id: 'RL-04',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Securities & Trustee Obligations',
    purpose: 'Meet listing/trustee disclosure rules',
    trigger: 'Per schedule (pre/post-issuance)',
    frequency: 'event-driven',
    requiredEvidence: [
      'Filing PDFs',
      'Submission timestamps',
      'Trustee confirmations',
      'Exchange receipts'
    ],
    owner: 'Capital Markets Lead',
    ruleSource: 'SC Malaysia Guidelines, Exchange Listing Rules',
    ruleLogic: 'All required filings submitted on-time per schedule',
    passThreshold: 100,
    proofType: 'VC (Filing Done)',
    vcSchema: 'https://zeroh.io/schemas/market-disclosure-v1.json',
    metric: 'On-time filing rate',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent can prepare packs, track deadlines
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Generates regulator pack automatically'
  },
  {
    id: 'RL-05',
    bucket: 2,
    bucketName: 'Regulatory & Legal Compliance',
    name: 'Cross-Border Regime Mapping',
    purpose: 'Map deal to local rulebooks',
    trigger: 'Per deal initiation',
    frequency: 'event-driven',
    requiredEvidence: [
      'Jurisdiction analysis',
      'Local counsel opinion',
      'Compliance matrix',
      'Regime comparison'
    ],
    owner: 'Legal/Compliance',
    ruleSource: 'Jurisdictional compliance matrix',
    ruleLogic: 'All cross-border deals have documented compliance mapping',
    passThreshold: 100,
    proofType: 'VC (Mapping Complete)',
    vcSchema: 'https://zeroh.io/schemas/jurisdiction-map-v1.json',
    metric: '% deals with documented compliance map',
    metricType: 'percentage',
    targetValue: 100,
    automatable: false, // Requires legal counsel judgment
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Covers DIFC, CBB, QFCRA, OJK, BNM, etc.'
  }
]

/**
 * BUCKET 3: RISK MANAGEMENT (RM)
 * Standards: IFSB-1 Risk Taxonomy, IFSB-12 Liquidity
 *
 * NOTE: Explicitly names Islamic-specific risks (RoR, DCR, SNC, equity investment)
 */
const riskManagementControls: Control[] = [
  {
    id: 'RM-01',
    bucket: 3,
    bucketName: 'Risk Management',
    name: 'Credit & Counterparty Risk',
    purpose: 'Manage counterparty creditworthiness',
    trigger: 'Per counterparty + periodic review',
    frequency: 'quarterly',
    requiredEvidence: [
      'Credit memo',
      'Credit limits',
      'Collateral documentation',
      'Credit rating/scoring'
    ],
    owner: 'Credit Risk Officer',
    ruleSource: 'IFSB-1 Credit Risk, Basel III (adapted for Islamic finance)',
    ruleLogic: 'All counterparties have current credit assessment within limits',
    passThreshold: 95,
    proofType: 'VC (Credit Limit Set)',
    vcSchema: 'https://zeroh.io/schemas/credit-limit-v1.json',
    metric: 'Breach rate, limit utilization',
    metricType: 'percentage',
    targetValue: 5, // Max 5% breach rate
    automatable: true, // Agent alerts on limit breach
    verifiable: true,
    selectiveDisclosure: true,
    notes: 'Alerts on limit breach, utilization >90%'
  },
  {
    id: 'RM-02',
    bucket: 3,
    bucketName: 'Risk Management',
    name: 'Operational Risk (Asset Transfer)',
    purpose: 'Prevent documentation/settlement/title errors',
    trigger: 'Per Murabaha/Ijara/Wakala transfer',
    frequency: 'event-driven',
    requiredEvidence: [
      'Delivery note',
      'Title deed',
      'Timestamp proof',
      'Settlement confirmation'
    ],
    owner: 'Operations',
    ruleSource: 'IFSB-1 Operational Risk',
    ruleLogic: 'Asset ownership transfer documented with <1% exception rate',
    passThreshold: 99,
    proofType: 'VC (Transfer Attested) + hash',
    vcSchema: 'https://zeroh.io/schemas/asset-transfer-v1.json',
    metric: 'Exceptions per 100 transfers',
    metricType: 'count',
    targetValue: 1, // Max 1 exception per 100 transfers
    automatable: true, // Agent verifies docs, timestamps
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Blocks profit recognition (FR-02) until ownership transferred'
  },
  {
    id: 'RM-03',
    bucket: 3,
    bucketName: 'Risk Management',
    name: 'Liquidity & RoR Risk',
    purpose: 'Manage liquidity gaps and rate-of-return expectations',
    trigger: 'Weekly liquidity monitoring',
    frequency: 'weekly',
    requiredEvidence: [
      'Liquidity gap report',
      'RoR benchmarks',
      'Rate changes',
      'Stress test results'
    ],
    owner: 'Treasury',
    ruleSource: 'IFSB-12 Liquidity Risk Management, IFSB-1 RoR Risk',
    ruleLogic: 'Liquidity gaps within limits, RoR variance <5% vs benchmark',
    passThreshold: 95,
    proofType: 'VC (Liquidity Review Complete)',
    vcSchema: 'https://zeroh.io/schemas/liquidity-ror-v1.json',
    metric: 'Gap thresholds, RoR variance',
    metricType: 'percentage',
    targetValue: 5, // Max 5% RoR variance
    automatable: true, // Agent monitors daily, alerts on threshold breach
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Triggers repricing if RoR variance exceeds threshold'
  },
  {
    id: 'RM-04',
    bucket: 3,
    bucketName: 'Risk Management',
    name: 'Displaced Commercial Risk (DCR)',
    purpose: 'Manage IAH return expectations vs actuals',
    trigger: 'Monthly/quarterly review',
    frequency: 'monthly',
    requiredEvidence: [
      'IAH return analysis',
      'Smoothing reserve calculation',
      'Market benchmark comparison',
      'Profit equalization reserve (PER)'
    ],
    owner: 'Treasury/Risk',
    ruleSource: 'IFSB-1 Displaced Commercial Risk, AAOIFI FAS 27',
    ruleLogic: 'IAH returns within 2% of market benchmark, smoothing reserve adequate',
    passThreshold: 95,
    proofType: 'VC (DCR Review)',
    vcSchema: 'https://zeroh.io/schemas/dcr-review-v1.json',
    metric: 'DCR reserve adequacy, IAH churn rate',
    metricType: 'percentage',
    targetValue: 100, // 100% adequacy
    automatable: true, // Agent calculates reserve, tracks IAH churn
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Monitors IAH account churn as early warning'
  },
  {
    id: 'RM-05',
    bucket: 3,
    bucketName: 'Risk Management',
    name: 'SNC Risk & Equity Investment Risk',
    purpose: 'Monitor SNC events and equity exposure',
    trigger: 'Quarterly risk register review',
    frequency: 'quarterly',
    requiredEvidence: [
      'SNC risk register',
      'Equity exposure reports',
      'Mushārakah/Muḍārabah valuations',
      'Equity loss provisions'
    ],
    owner: 'Risk Officer',
    ruleSource: 'IFSB-1 Principle 7 (SNC Risk), IFSB-1 Equity Investment Risk',
    ruleLogic: 'All SNC risks tracked with mitigation, equity exposure within limits',
    passThreshold: 95,
    proofType: 'VC (Risk Register Updated)',
    vcSchema: 'https://zeroh.io/schemas/snc-equity-risk-v1.json',
    metric: '# open SNC risks, equity loss rate',
    metricType: 'count',
    targetValue: 0, // Target: zero open SNC risks
    automatable: true, // Agent tracks register, alerts on new SNC events
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Cross-links to SG-03 (Shariah Risk) and SG-05 (SNC Event Handling)'
  }
]

/**
 * BUCKET 4: FINANCIAL & PRODUCT REPORTING (FR)
 * Standards: AAOIFI FAS, ICMA GBP/SBP/SLBP, BNM VBIAF
 *
 * NOTE: Sustainability reporting (UoP, KPI/SPT) integrated here per ICMA/BNM
 */
const financialReportingControls: Control[] = [
  {
    id: 'FR-01',
    bucket: 4,
    bucketName: 'Financial & Product Reporting',
    name: 'AAOIFI/IFRS Financials',
    purpose: 'Audit-ready financial statements',
    trigger: 'Monthly close',
    frequency: 'monthly',
    requiredEvidence: [
      'General ledger',
      'Trial balance',
      'Lineage to source docs',
      'Reconciliations'
    ],
    owner: 'Finance Controller',
    ruleSource: 'AAOIFI FAS (e.g., FAS 28, 33), IFRS 9/15 (adapted)',
    ruleLogic: 'All GL entries reconciled with <5 material reconciling items',
    passThreshold: 95,
    proofType: 'Hash + VC (Close Approved)',
    vcSchema: 'https://zeroh.io/schemas/financial-close-v1.json',
    metric: 'Reconciling items count',
    metricType: 'count',
    targetValue: 5, // Max 5 material items
    automatable: true, // Agent exports AAOIFI/IFRS formats
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Exports both AAOIFI and IFRS formats for reporting'
  },
  {
    id: 'FR-02',
    bucket: 4,
    bucketName: 'Financial & Product Reporting',
    name: 'Profit Recognition & Distribution',
    purpose: 'Fair PLS allocation per structure',
    trigger: 'On profit posting events',
    frequency: 'event-driven',
    requiredEvidence: [
      'PLS calculation worksheets',
      'Allocation rules',
      'Profit distribution report',
      'Rabb al-Maal share calculation'
    ],
    owner: 'Finance/Product Controller',
    ruleSource: 'AAOIFI FAS 4 (Mudaraba), AAOIFI FAS 7 (Salam/Istisna)',
    ruleLogic: 'Profit allocated per agreed PLS ratios with <2% variance',
    passThreshold: 98,
    proofType: 'VC (Calculation Approved)',
    vcSchema: 'https://zeroh.io/schemas/profit-allocation-v1.json',
    metric: 'Exceptions rate, allocation variance',
    metricType: 'percentage',
    targetValue: 2, // Max 2% variance
    automatable: true, // Agent applies PLS formulas
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Mudaraba/Musharaka calculations, blocked by RM-02 if asset not transferred'
  },
  {
    id: 'FR-03',
    bucket: 4,
    bucketName: 'Financial & Product Reporting',
    name: 'SPV/Trustee Account Segregation',
    purpose: 'Proper asset/fund segregation',
    trigger: 'Monthly reconciliation',
    frequency: 'monthly',
    requiredEvidence: [
      'Bank statements',
      'Trustee confirmations',
      'Segregation matrix',
      'Account reconciliations'
    ],
    owner: 'SPV Controller',
    ruleSource: 'Trustee/SPV agreements, AAOIFI FAS 33 §5 (Sukuk)',
    ruleLogic: 'All SPV/trustee accounts reconciled with <3 variances per month',
    passThreshold: 95,
    proofType: 'VC (Segregation Verified)',
    vcSchema: 'https://zeroh.io/schemas/spv-segregation-v1.json',
    metric: 'Variances, late posts',
    metricType: 'count',
    targetValue: 3, // Max 3 variances
    automatable: true, // Agent matches bank statements to ledger
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Trustee VC optional for external trustee confirmations'
  },
  {
    id: 'FR-04',
    bucket: 4,
    bucketName: 'Financial & Product Reporting',
    name: 'Use-of-Proceeds (UoP) Ledger',
    purpose: 'Transparent UoP allocation',
    trigger: 'On each draw/use event',
    frequency: 'event-driven',
    requiredEvidence: [
      'UoP ledger entry',
      'Project invoices',
      'Allocation approvals',
      'Allocation reports'
    ],
    owner: 'Treasury/Project Manager',
    ruleSource: 'ICMA Green Bond Principles (GBP), ICMA Social Bond Principles (SBP), BNM VBIAF §4.2',
    ruleLogic: '100% of proceeds allocated to eligible projects per framework',
    passThreshold: 100,
    proofType: 'VC (Allocation Approved) + blockchain anchor',
    vcSchema: 'https://zeroh.io/schemas/uop-allocation-v1.json',
    metric: '% allocated, deviations from plan',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent tracks ledger, flags unallocated proceeds
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Feeds FR-06 (Post-Issuance Reporting) and AA-04 (External Verification)'
  },
  {
    id: 'FR-05',
    bucket: 4,
    bucketName: 'Financial & Product Reporting',
    name: 'KPI/SPT Monitoring & Attestation',
    purpose: 'Evidence for sustainability claims',
    trigger: 'Per KPI schedule (annual for SLB)',
    frequency: 'annual',
    requiredEvidence: [
      'KPI data extract',
      'Methodology documentation',
      'External verifier attestation (REQUIRED for SLB)',
      'Assurance letter'
    ],
    owner: 'Sustainability Lead',
    ruleSource: 'ICMA Sustainability-Linked Bond Principles (SLBP - annual verification required), BNM VBIAF KPI Framework',
    ruleLogic: 'All KPIs verified by external verifier annually per ICMA SLBP',
    passThreshold: 100,
    proofType: 'VC (KPI Attested) + External Verifier VC',
    vcSchema: 'https://zeroh.io/schemas/kpi-attestation-v1.json',
    metric: 'On-time verification rate',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent collects KPI data, coordinates with verifier
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Annual external verification REQUIRED for SLB per ICMA SLBP; recommended for GBP/SBP'
  },
  {
    id: 'FR-06',
    bucket: 4,
    bucketName: 'Financial & Product Reporting',
    name: 'Post-Issuance/Investor Reporting',
    purpose: 'Transparent ongoing disclosure',
    trigger: 'Quarterly/Annual per framework',
    frequency: 'quarterly',
    requiredEvidence: [
      'Compiled report',
      'UoP allocation update',
      'KPI progress',
      'Change log',
      'Impact metrics'
    ],
    owner: 'Capital Markets Lead',
    ruleSource: 'ICMA GBP/SBP/SLBP Templates, SC Malaysia Guidelines',
    ruleLogic: 'All required disclosures made on-time per ICMA templates',
    passThreshold: 100,
    proofType: 'VC (Report Issued)',
    vcSchema: 'https://zeroh.io/schemas/investor-report-v1.json',
    metric: 'On-time delivery, investor queries',
    metricType: 'percentage',
    targetValue: 100,
    automatable: true, // Agent auto-compiles from live data (FR-04, FR-05)
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Auto-compile from FR-04 (UoP) and FR-05 (KPI) data'
  }
]

/**
 * BUCKET 5: AUDIT & ASSURANCE (AA)
 * Standards: AAOIFI GS-3/GS-11, ICMA External Review Guidelines
 *
 * NOTE: Shariah Audit distinct from Internal Audit per AAOIFI/BNM
 */
const auditAssuranceControls: Control[] = [
  {
    id: 'AA-01',
    bucket: 5,
    bucketName: 'Audit & Assurance',
    name: 'Internal Audit (Financial/Operational)',
    purpose: 'Independent assurance on controls',
    trigger: 'Annual plan + audit cycles',
    frequency: 'annual',
    requiredEvidence: [
      'Audit plan',
      'Sampling methodology',
      'Audit findings',
      'Management responses',
      'Closure evidence'
    ],
    owner: 'Internal Audit',
    ruleSource: 'IIA Standards, COSO Framework',
    ruleLogic: 'All planned audits completed with findings closed within 90 days',
    passThreshold: 95,
    proofType: 'VC (Audit Completed)',
    vcSchema: 'https://zeroh.io/schemas/internal-audit-v1.json',
    metric: 'Findings aging, reopen rate',
    metricType: 'duration',
    targetValue: 90, // Max 90 days to close
    automatable: false, // Requires independent auditor judgment
    verifiable: true,
    selectiveDisclosure: true, // Findings sensitive
    notes: 'Read-only evidence workspace for auditors'
  },
  {
    id: 'AA-02',
    bucket: 5,
    bucketName: 'Audit & Assurance',
    name: 'Shariah Audit (Independent)',
    purpose: 'Shariah execution assurance',
    trigger: 'Annual + per deal milestone',
    frequency: 'annual',
    requiredEvidence: [
      'Sampling plan',
      'Transaction reviews',
      'SNC findings',
      'Shariah audit report'
    ],
    owner: 'Shariah Auditor',
    ruleSource: 'AAOIFI GS-3/GS-11, BNM Shariah Governance Policy §7',
    ruleLogic: 'Independent Shariah audit with <3 high-severity SNC findings',
    passThreshold: 95,
    proofType: 'VC (Shariah Audit Report)',
    vcSchema: 'https://zeroh.io/schemas/shariah-audit-report-v1.json',
    metric: 'SNC recurrence rate, findings severity',
    metricType: 'count',
    targetValue: 3, // Max 3 high-severity findings
    automatable: false, // Requires independent Shariah auditor
    verifiable: true,
    selectiveDisclosure: true,
    notes: 'Pulls from SG bucket. Distinct from AA-01 (Internal Audit) per AAOIFI/BNM'
  },
  {
    id: 'AA-03',
    bucket: 5,
    bucketName: 'Audit & Assurance',
    name: 'External Financial Audit Support',
    purpose: 'Efficient external audit',
    trigger: 'Annual + ad hoc requests',
    frequency: 'annual',
    requiredEvidence: [
      'PBC (Prepared By Client) list',
      'Evidence bundles',
      'Management representation letter',
      'Audit confirmations'
    ],
    owner: 'Finance Controller',
    ruleSource: 'ISA (International Standards on Auditing)',
    ruleLogic: 'All PBC requests fulfilled within 5 business days',
    passThreshold: 95,
    proofType: 'VC (PBC Ready)',
    vcSchema: 'https://zeroh.io/schemas/pbc-ready-v1.json',
    metric: 'PBC request turnaround time',
    metricType: 'duration',
    targetValue: 5, // Max 5 business days
    automatable: true, // Agent prepares evidence bundles with selective disclosure
    verifiable: true,
    selectiveDisclosure: true,
    notes: 'Selective disclosure bundles for external auditors'
  },
  {
    id: 'AA-04',
    bucket: 5,
    bucketName: 'Audit & Assurance',
    name: 'External Sustainability Assurance',
    purpose: 'Credibility of sustainability data',
    trigger: 'Pre-issuance (SPO) + annual (SLB KPI verification)',
    frequency: 'annual',
    requiredEvidence: [
      'Underlying data',
      'Methodology documentation',
      'External verifier statement (REQUIRED)',
      'Assurance letter'
    ],
    owner: 'Sustainability Lead',
    ruleSource: 'ICMA External Review Guidelines, ICMA SLBP Verification Requirements',
    ruleLogic: 'External verifier statement obtained for all sustainability claims per ICMA guidelines',
    passThreshold: 100,
    proofType: 'VC (External Assurance) + Verifier VC',
    vcSchema: 'https://zeroh.io/schemas/sustainability-assurance-v1.json',
    metric: 'Variance vs prior year, verifier findings',
    metricType: 'count',
    targetValue: 0, // Target: zero material variances
    automatable: true, // Agent coordinates with external verifier, tracks evidence
    verifiable: true,
    selectiveDisclosure: false,
    notes: 'Annual KPI verification REQUIRED for SLB per ICMA SLBP; SPO recommended for GBP/SBP pre-issuance'
  },
  {
    id: 'AA-05',
    bucket: 5,
    bucketName: 'Audit & Assurance',
    name: 'Regulator/Trustee Inspection Ready',
    purpose: 'Smooth regulator/trustee supervision',
    trigger: 'Ad hoc / scheduled inspections',
    frequency: 'event-driven',
    requiredEvidence: [
      'Inspection readiness pack',
      'Access logs',
      'Selective disclosure bundles',
      'Response documentation'
    ],
    owner: 'Compliance/Trustee Relations',
    ruleSource: 'Regulator inspection frameworks, Trustee agreements',
    ruleLogic: 'All inspection requests fulfilled within 2 business days with complete evidence',
    passThreshold: 100,
    proofType: 'VC (Pack Delivered)',
    vcSchema: 'https://zeroh.io/schemas/inspection-pack-v1.json',
    metric: 'Response time, outstanding requests',
    metricType: 'duration',
    targetValue: 2, // Max 2 business days
    automatable: true, // Agent prepares live proof bundles
    verifiable: true,
    selectiveDisclosure: true,
    notes: 'Shares live blockchain proofs with selective disclosure for regulators/trustees'
  }
]

/**
 * MASTER CONTROL LIBRARY
 * 26 Controls Total: 5 SG + 5 RL + 5 RM + 6 FR + 5 AA
 */
export const controlLibrary: Control[] = [
  ...shariahGovernanceControls,
  ...regulatoryLegalControls,
  ...riskManagementControls,
  ...financialReportingControls,
  ...auditAssuranceControls
]

/**
 * Utility functions for control library access
 */
export const getControlById = (id: string): Control | undefined => {
  return controlLibrary.find(c => c.id === id)
}

export const getControlsByBucket = (bucket: 1 | 2 | 3 | 4 | 5): Control[] => {
  return controlLibrary.filter(c => c.bucket === bucket)
}

export const getAutomatableControls = (): Control[] => {
  return controlLibrary.filter(c => c.automatable)
}

export const getVerifiableControls = (): Control[] => {
  return controlLibrary.filter(c => c.verifiable)
}

export const getBucketNames = (): Record<number, string> => {
  return {
    1: 'Shariah Governance & Compliance',
    2: 'Regulatory & Legal Compliance',
    3: 'Risk Management',
    4: 'Financial & Product Reporting',
    5: 'Audit & Assurance'
  }
}

/**
 * Bucket theme configuration for UI
 */
export const bucketTheme = {
  1: { name: 'Shariah Governance', color: 'purple', icon: '🕌' },
  2: { name: 'Regulatory & Legal', color: 'orange', icon: '⚖️' },
  3: { name: 'Risk Management', color: 'red', icon: '🛡️' },
  4: { name: 'Financial & Reporting', color: 'blue', icon: '📊' },
  5: { name: 'Audit & Assurance', color: 'green', icon: '✓' }
} as const

export default controlLibrary
