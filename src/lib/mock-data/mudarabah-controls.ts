/**
 * MUDARABAH CONTRACT-SPECIFIC CONTROLS
 * =====================================
 * Controls extracted from AAOIFI SS-13 Mudarabah Standard
 *
 * Each control maps to specific AAOIFI sections and defines:
 * - Test procedures
 * - Frequency (one-time, quarterly, monthly, event-driven, final)
 * - Hard gates (cannot bypass)
 * - Evidence requirements
 * - Workflow associations
 */

export interface MudarabahControl {
  id: string
  name: string
  category: string
  aaoifiSection: string
  description: string
  requiredBy: string[]
  testProcedure: string
  frequency: 'one-time' | 'quarterly' | 'monthly' | 'event-driven' | 'final'
  workflow: string
  isHardGate: boolean
  evidenceRequired: string[]
  conflictResolution?: {
    qcbRule?: string
    qfcraRule?: string
    resolution: string
  }
}

export interface MudarabahCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
  controlCount: number
}

/**
 * 5 MUDARABAH CATEGORIES
 */
export const mudarabahCategories: MudarabahCategory[] = [
  {
    id: 'cat-capital',
    name: 'Capital Verification',
    description: 'Verify capital clarity, delivery, and valuation (AAOIFI SS-13 §7)',
    color: 'blue',
    icon: 'DollarSign',
    controlCount: 1
  },
  {
    id: 'cat-profit',
    name: 'Profit-Sharing Compliance',
    description: 'Ensure profit ratios and distribution rules (AAOIFI SS-13 §8)',
    color: 'green',
    icon: 'TrendingUp',
    controlCount: 2
  },
  {
    id: 'cat-conduct',
    name: 'Mudarib Conduct Monitoring',
    description: 'Monitor Mudarib actions against prohibited activities (AAOIFI SS-13 §9)',
    color: 'purple',
    icon: 'Shield',
    controlCount: 3
  },
  {
    id: 'cat-liability',
    name: 'Liability & Trust Assessment',
    description: 'Assess Mudarib liability and trust obligations (AAOIFI SS-13 §4, §6)',
    color: 'orange',
    icon: 'AlertTriangle',
    controlCount: 1
  },
  {
    id: 'cat-termination',
    name: 'Termination & Liquidation',
    description: 'Manage contract termination and final valuation (AAOIFI SS-13 §10)',
    color: 'red',
    icon: 'FileX',
    controlCount: 1
  }
]

/**
 * 8 MUDARABAH CONTROLS FROM AAOIFI SS-13
 */
export const mudarabahControls: MudarabahControl[] = [
  // CATEGORY 1: CAPITAL VERIFICATION
  {
    id: 'ctrl-mud-cap-001',
    name: 'Capital Clarity & Delivery',
    category: 'cat-capital',
    aaoifiSection: 'Section 7/2, 7/4',
    description: 'Verify that capital is clearly defined in amount, currency, and type, and has been delivered to the Mudarib',
    requiredBy: ['AAOIFI SS-13 §7/2', 'AAOIFI SS-13 §7/4'],
    testProcedure: 'Review Mudarabah contract for capital specification (amount, currency). Verify bank transfer or asset delivery receipt. Confirm Mudarib acknowledgment of capital receipt.',
    frequency: 'one-time',
    workflow: 'mudarabah-setup',
    isHardGate: false,
    evidenceRequired: [
      'Mudarabah contract with capital specification',
      'Bank transfer receipt or asset delivery confirmation',
      'Mudarib capital receipt acknowledgment (signed)'
    ]
  },

  // CATEGORY 2: PROFIT-SHARING COMPLIANCE
  {
    id: 'ctrl-mud-profit-001',
    name: 'Profit Ratio Verification',
    category: 'cat-profit',
    aaoifiSection: 'Section 8/1',
    description: 'Verify that profit-sharing ratios are expressed as percentages (not fixed amounts) and agreed upon at contract inception',
    requiredBy: ['AAOIFI SS-13 §8/1'],
    testProcedure: 'Review Mudarabah contract clause specifying profit ratios. Confirm ratios are percentages (e.g., 60% Rab al-Mal, 40% Mudarib). Verify ratios sum to 100%.',
    frequency: 'one-time',
    workflow: 'mudarabah-setup',
    isHardGate: false,
    evidenceRequired: [
      'Mudarabah contract profit-sharing clause',
      'Shariah Board approval of profit ratios',
      'Signed agreement from both parties'
    ]
  },
  {
    id: 'ctrl-mud-profit-002',
    name: 'Capital Maintenance Gate',
    category: 'cat-profit',
    aaoifiSection: 'Section 8/7',
    description: 'HARD GATE: Verify capital is intact before profit distribution. If capital impaired (assets < original capital), profit distribution is BLOCKED until capital restored.',
    requiredBy: ['AAOIFI SS-13 §8/7'],
    testProcedure: 'Calculate current asset value of Mudarabah. Compare to original capital amount. If assets < capital, block profit distribution and notify both parties. If assets >= capital, allow distribution per agreed ratios.',
    frequency: 'quarterly',
    workflow: 'quarterly-profit-distribution',
    isHardGate: true, // THIS IS A HARD GATE
    evidenceRequired: [
      'Current asset valuation report (certified)',
      'Original capital amount confirmation',
      'Capital maintenance calculation worksheet'
    ],
    conflictResolution: {
      qcbRule: 'No specific capital maintenance requirement',
      qfcraRule: 'QFCRA IBANK 7.7.5 - Mudarabah capital must be maintained',
      resolution: 'Applied AAOIFI §8/7 stricter requirement: Cannot distribute profit if capital impaired'
    }
  },

  // CATEGORY 3: MUDARIB CONDUCT MONITORING
  {
    id: 'ctrl-mud-conduct-001',
    name: 'Loan/Gift Prohibition Check',
    category: 'cat-conduct',
    aaoifiSection: 'Section 9/2',
    description: 'Monitor that Mudarib does not make loans or gifts from Mudarabah funds without Rab al-Mal permission',
    requiredBy: ['AAOIFI SS-13 §9/2'],
    testProcedure: 'Review Mudarabah transaction logs for transfers categorized as "loan" or "gift". Flag any outbound transfers not matching business activities. Require Mudarib justification.',
    frequency: 'monthly',
    workflow: 'monthly-conduct-audit',
    isHardGate: false,
    evidenceRequired: [
      'Monthly transaction log (all Mudarabah accounts)',
      'Categorization of each transaction (business expense vs. loan/gift)',
      'Mudarib attestation of compliance'
    ]
  },
  {
    id: 'ctrl-mud-conduct-002',
    name: 'Market Pricing Verification',
    category: 'cat-conduct',
    aaoifiSection: 'Section 9/3',
    description: 'Verify that Mudarib sells goods/services at market price (not artificially low to related parties)',
    requiredBy: ['AAOIFI SS-13 §9/3'],
    testProcedure: 'For 5 largest transactions each quarter, compare sale prices to market benchmarks. Flag transactions with >10% deviation. Require Mudarib explanation for flagged sales.',
    frequency: 'quarterly',
    workflow: 'quarterly-profit-distribution',
    isHardGate: false,
    evidenceRequired: [
      'Top 5 transaction sale prices',
      'Market benchmark prices from independent sources',
      'Price deviation analysis report'
    ]
  },
  {
    id: 'ctrl-mud-conduct-003',
    name: 'Mudarabah Fund Segregation',
    category: 'cat-conduct',
    aaoifiSection: 'Section 9/1',
    description: 'Verify that Mudarib maintains separate accounts for Mudarabah funds (not commingled with personal/other business funds)',
    requiredBy: ['AAOIFI SS-13 §9/1'],
    testProcedure: 'Confirm existence of dedicated bank account for Mudarabah. Review account statements for non-Mudarabah transactions. Flag any commingling.',
    frequency: 'monthly',
    workflow: 'monthly-conduct-audit',
    isHardGate: false,
    evidenceRequired: [
      'Dedicated Mudarabah bank account details',
      'Monthly bank statements',
      'Mudarib attestation of fund segregation'
    ]
  },

  // CATEGORY 4: LIABILITY & TRUST ASSESSMENT
  {
    id: 'ctrl-mud-trust-001',
    name: 'Mudarib Liability Investigation',
    category: 'cat-liability',
    aaoifiSection: 'Section 4/3, 6/2',
    description: 'Investigate reported losses to determine if Mudarib liable due to misconduct, negligence, or breach of contract terms',
    requiredBy: ['AAOIFI SS-13 §4/3', 'AAOIFI SS-13 §6/2'],
    testProcedure: 'Upon loss report, initiate investigation. Review loss circumstances, Mudarib actions, contract terms. Determine if loss due to: (a) market risk (Mudarib not liable), (b) misconduct/negligence (Mudarib liable). Document findings.',
    frequency: 'event-driven',
    workflow: 'event-liability-investigation',
    isHardGate: false,
    evidenceRequired: [
      'Loss report with circumstances',
      'Investigation report (3rd party or internal)',
      'Mudarib response to allegations',
      'Shariah Board liability determination'
    ]
  },

  // CATEGORY 5: TERMINATION & LIQUIDATION
  {
    id: 'ctrl-mud-term-001',
    name: 'Final Asset Valuation & Settlement',
    category: 'cat-termination',
    aaoifiSection: 'Section 10/1',
    description: 'Upon Mudarabah termination, conduct final asset valuation, liquidate assets, distribute proceeds per profit-sharing ratios',
    requiredBy: ['AAOIFI SS-13 §10/1'],
    testProcedure: 'Engage certified valuator for final asset valuation. Liquidate all assets. Calculate: (1) Capital restoration to Rab al-Mal, (2) Profit = Proceeds - Capital, (3) Distribute profit per agreed ratios. Issue settlement report.',
    frequency: 'final',
    workflow: 'final-liquidation',
    isHardGate: false,
    evidenceRequired: [
      'Final asset valuation report (certified)',
      'Liquidation proceeds confirmation',
      'Settlement calculation worksheet',
      'Capital + profit distribution confirmations (bank transfers)'
    ]
  }
]

/**
 * WORKFLOW DEFINITIONS
 * Each workflow groups related controls
 */
export interface MudarabahWorkflow {
  id: string
  name: string
  description: string
  frequency: string
  controls: string[] // Control IDs
  steps: string[]
  hardGates: string[] // Step names that are hard gates
}

export const mudarabahWorkflows: MudarabahWorkflow[] = [
  {
    id: 'mudarabah-setup',
    name: 'Mudarabah Setup & Verification',
    description: 'One-time setup workflow to verify contract terms, capital delivery, and profit ratios',
    frequency: 'One-time (contract inception)',
    controls: ['ctrl-mud-cap-001', 'ctrl-mud-profit-001'],
    steps: [
      'Review Mudarabah contract',
      'Verify capital specification (amount, currency)',
      'Confirm capital delivery to Mudarib',
      'Verify profit-sharing ratios (percentages)'
    ],
    hardGates: []
  },
  {
    id: 'quarterly-profit-distribution',
    name: 'Quarterly Profit Distribution',
    description: 'Verify capital intact, calculate profit, distribute per ratios',
    frequency: 'Quarterly',
    controls: ['ctrl-mud-profit-002', 'ctrl-mud-conduct-002'],
    steps: [
      'Obtain current asset valuation',
      'Compare assets to original capital',
      '🔒 HARD GATE: Capital Maintenance Check (CTRL-MUD-PROFIT-002)',
      'Verify market pricing for top 5 transactions',
      'Calculate profit if capital intact',
      'Distribute profit per agreed ratios'
    ],
    hardGates: ['🔒 HARD GATE: Capital Maintenance Check (CTRL-MUD-PROFIT-002)']
  },
  {
    id: 'monthly-conduct-audit',
    name: 'Monthly Mudarib Conduct Audit',
    description: 'Review transactions for prohibited loans/gifts and fund segregation',
    frequency: 'Monthly',
    controls: ['ctrl-mud-conduct-001', 'ctrl-mud-conduct-003'],
    steps: [
      'Review monthly transaction logs',
      'Flag loans/gifts without permission',
      'Verify fund segregation (dedicated account)',
      'Document findings and exceptions'
    ],
    hardGates: []
  },
  {
    id: 'event-liability-investigation',
    name: 'Liability Investigation (Event-Driven)',
    description: 'Investigate losses to determine Mudarib liability',
    frequency: 'Event-driven (triggered by loss report)',
    controls: ['ctrl-mud-trust-001'],
    steps: [
      'Receive loss report from Mudarib',
      'Initiate 3rd-party investigation',
      'Review loss circumstances',
      'Determine liability (market risk vs. misconduct)',
      'Issue liability determination'
    ],
    hardGates: []
  },
  {
    id: 'final-liquidation',
    name: 'Final Liquidation & Settlement',
    description: 'Terminate Mudarabah, liquidate assets, settle accounts',
    frequency: 'Final (contract termination)',
    controls: ['ctrl-mud-term-001'],
    steps: [
      'Engage certified valuator',
      'Conduct final asset valuation',
      'Liquidate all assets',
      'Restore capital to Rab al-Mal',
      'Distribute profit per agreed ratios',
      'Issue final settlement report'
    ],
    hardGates: []
  }
]

/**
 * HELPER FUNCTIONS
 */

export function getControlById(controlId: string): MudarabahControl | undefined {
  return mudarabahControls.find(c => c.id === controlId)
}

export function getControlsByCategory(categoryId: string): MudarabahControl[] {
  return mudarabahControls.filter(c => c.category === categoryId)
}

export function getCategoryById(categoryId: string): MudarabahCategory | undefined {
  return mudarabahCategories.find(c => c.id === categoryId)
}

export function getWorkflowById(workflowId: string): MudarabahWorkflow | undefined {
  return mudarabahWorkflows.find(w => w.id === workflowId)
}

export function getHardGateControls(): MudarabahControl[] {
  return mudarabahControls.filter(c => c.isHardGate)
}
