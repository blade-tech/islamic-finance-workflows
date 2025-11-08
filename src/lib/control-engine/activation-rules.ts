/**
 * ACTIVATION RULES ENGINE
 * ========================
 * Maps deal configuration → control activation
 *
 * Each rule defines:
 * - Which control it activates
 * - The condition logic (function)
 * - Human-readable reason (educational)
 * - Standard reference (GRC alignment)
 */

import { DealConfiguration, ActivatedControl, ActivationSummary } from './types'
import { ALL_CONTROLS, Control } from './control-library'

export interface ActivationRule {
  controlId: string
  condition: (config: DealConfiguration) => boolean
  getReason: (config: DealConfiguration) => string
  standardReference: string
}

// =============================================================================
// BUCKET 1: SHARIAH GOVERNANCE & COMPLIANCE RULES
// =============================================================================

const SHARIAH_RULES: ActivationRule[] = [
  {
    controlId: 'SG-01',
    condition: () => true, // Always active
    getReason: () => 'All Islamic finance products require SSB fatwa',
    standardReference: 'AAOIFI GS-1; IFSB-10 §4.1'
  },
  {
    controlId: 'SG-02',
    condition: () => true, // Always active
    getReason: () => 'Ongoing Shariah conformity monitoring required',
    standardReference: 'AAOIFI GS-2; BNM Shariah Governance Policy §7'
  },
  {
    controlId: 'SG-03',
    condition: (config) =>
      config.jurisdiction.primary === 'Malaysia' ||
      config.productStructure.category === 'sukuk',
    getReason: (config) =>
      config.jurisdiction.primary === 'Malaysia'
        ? 'Malaysia (BNM) requires SNC risk management framework'
        : 'Sukuk structures require SNC risk identification',
    standardReference: 'BNM Shariah Governance §5; IFSB-1 §7.2'
  },
  {
    controlId: 'SG-04',
    condition: () => true, // Always active
    getReason: () => 'Periodic Shariah audit required per AAOIFI GS-3',
    standardReference: 'AAOIFI GS-3'
  },
  {
    controlId: 'SG-05',
    condition: () => true, // Always active (event-driven)
    getReason: () => 'Must log and purify any non-compliant income if SNC event occurs',
    standardReference: 'IFSB-1 §7.2; AAOIFI GS-1 §3'
  }
]

// =============================================================================
// BUCKET 2: REGULATORY & LEGAL COMPLIANCE RULES
// =============================================================================

const REGULATORY_RULES: ActivationRule[] = [
  {
    controlId: 'RL-01',
    condition: () => true, // Always active
    getReason: (config) =>
      `${config.jurisdiction.primary} jurisdiction requires regulatory licensing`,
    standardReference: 'BNM FSA 2013; CMA Regulations; DFSA/FSRA Rules'
  },
  {
    controlId: 'RL-02',
    condition: (config) =>
      ['Malaysia', 'Saudi Arabia', 'UAE'].includes(config.jurisdiction.primary),
    getReason: (config) => {
      const jurisdictionText = {
        Malaysia: 'BNM requires SAC (Shariah Advisory Council) endorsement',
        'Saudi Arabia': 'CMA requires local SSB approval',
        UAE: 'DFSA/FSRA requires central Shariah supervisory authority approval'
      }
      return (
        jurisdictionText[config.jurisdiction.primary as keyof typeof jurisdictionText] ||
        'Local Shariah Board endorsement required'
      )
    },
    standardReference: 'BNM SAC; CMA Shariah Rules; DFSA Shariah Supervisory'
  },
  {
    controlId: 'RL-03',
    condition: (config) =>
      config.transactionScale.offeringType === 'public' ||
      config.transactionScale.offeringType === 'hybrid',
    getReason: () => 'Public offering requires prospectus/offering circular',
    standardReference: 'BNM SC Guidelines; MAS Notice; DFSA Rulebook'
  },
  {
    controlId: 'RL-04',
    condition: () => true, // FATF applies globally
    getReason: () => 'FATF 40 Recommendations apply to all Islamic finance transactions',
    standardReference: 'FATF R.10, R.11 (CDD for Islamic finance)'
  },
  {
    controlId: 'RL-05',
    condition: (config) => config.transactionScale.listed,
    getReason: () =>
      'Listed securities require continuous disclosure of material events',
    standardReference: 'Exchange Listing Rules; Securities Regulations'
  }
]

// =============================================================================
// BUCKET 3: RISK MANAGEMENT RULES
// =============================================================================

const RISK_RULES: ActivationRule[] = [
  {
    controlId: 'RM-01',
    condition: () => true, // All products have SNC risk
    getReason: () => 'All Islamic finance products have Shariah Non-Compliance (SNC) risk',
    standardReference: 'IFSB-1 §7.2; BNM ICAAP'
  },
  {
    controlId: 'RM-02',
    condition: (config) =>
      config.productStructure.category === 'sukuk' &&
      ['Ijarah', 'Mudarabah'].includes(config.productStructure.subtype),
    getReason: (config) =>
      `${config.productStructure.subtype} Sukuk has asset-based return volatility (RoR risk)`,
    standardReference: 'IFSB-1 §4.4; IFSB-10 §7.1'
  },
  {
    controlId: 'RM-03',
    condition: (config) =>
      (config.productStructure.category === 'sukuk' &&
        ['Murabaha', 'Salam', 'Istisna\'a'].includes(config.productStructure.subtype)) ||
      config.productStructure.category === 'banking',
    getReason: (config) =>
      `${config.productStructure.subtype} involves counterparty payment obligations (credit risk)`,
    standardReference: 'IFSB-1 §4.5; Basel III (IFSB adaptation)'
  },
  {
    controlId: 'RM-04',
    condition: (config) =>
      (config.productStructure.category === 'sukuk' &&
        ['Musharakah', 'Mudarabah'].includes(config.productStructure.subtype)) ||
      config.productStructure.category === 'funds' ||
      config.productStructure.category === 'equity',
    getReason: (config) =>
      config.productStructure.category === 'funds'
        ? 'Islamic funds have equity investment risk'
        : `${config.productStructure.subtype} involves profit/loss sharing (equity risk)`,
    standardReference: 'IFSB-1 §4.6; AAOIFI FAS 3'
  },
  {
    controlId: 'RM-05',
    condition: (config) => config.transactionScale.size > 50_000_000,
    getReason: (config) =>
      `Transaction size >$50M (current: $${(config.transactionScale.size / 1_000_000).toFixed(0)}M) requires stress testing`,
    standardReference: 'IFSB-1 §6.3; BNM Stress Testing Guidelines'
  }
]

// =============================================================================
// BUCKET 4: FINANCIAL & PRODUCT REPORTING RULES
// =============================================================================

const FINANCIAL_RULES: ActivationRule[] = [
  {
    controlId: 'FR-01',
    condition: () => true,
    getReason: (config) =>
      `${config.accounting.framework} framework requires compliant financial reporting`,
    standardReference: 'AAOIFI FAS 1-34; IFRS 9; IFSB-1 §9'
  },
  {
    controlId: 'FR-02',
    condition: () => true,
    getReason: (config) =>
      `${config.jurisdiction.primary} requires ${config.accounting.reportingFrequency} regulatory reporting`,
    standardReference: 'BNM RR Series; CMA Reporting; DFSA Returns'
  },
  {
    controlId: 'FR-03',
    condition: () => true,
    getReason: (config) => `${config.jurisdiction.primary} tax compliance required`,
    standardReference: 'Malaysia ITA 1967; Zakat regulations; Jurisdiction-specific tax laws'
  },
  {
    controlId: 'FR-04',
    condition: (config) =>
      config.sustainability.enabled &&
      (config.sustainability.type === 'green' || config.sustainability.type === 'social'),
    getReason: (config) =>
      `${config.sustainability.type === 'green' ? 'Green' : 'Social'} Sukuk requires Use of Proceeds tracking`,
    standardReference: 'ICMA GBP; ICMA SBP; AAOIFI GS-47 (Sustainable Sukuk)'
  },
  {
    controlId: 'FR-05',
    condition: (config) =>
      config.sustainability.enabled &&
      config.sustainability.type === 'sustainability-linked',
    getReason: () =>
      'Sustainability-Linked structure requires KPI monitoring and SPT verification',
    standardReference: 'ICMA SLBP; BNM VBIAF'
  },
  {
    controlId: 'FR-06',
    condition: (config) =>
      config.transactionScale.offeringType === 'public' ||
      config.transactionScale.offeringType === 'hybrid' ||
      config.transactionScale.listed,
    getReason: (config) => {
      if (config.transactionScale.listed) {
        return 'Listed securities require periodic investor reporting'
      }
      return 'Public offering requires transparent investor updates'
    },
    standardReference: 'ICMA transparency recommendations'
  }
]

// =============================================================================
// BUCKET 5: AUDIT & ASSURANCE RULES
// =============================================================================

const AUDIT_RULES: ActivationRule[] = [
  {
    controlId: 'AA-01',
    condition: () => true,
    getReason: () => 'Internal Shariah audit required for all products (AAOIFI GS-3 baseline)',
    standardReference: 'AAOIFI GS-3; IFSB-10 §4.2'
  },
  {
    controlId: 'AA-02',
    condition: (config) =>
      config.transactionScale.size > 50_000_000 ||
      config.transactionScale.offeringType === 'public',
    getReason: (config) => {
      if (config.transactionScale.size > 50_000_000) {
        return `Transaction size >$50M (current: $${(config.transactionScale.size / 1_000_000).toFixed(0)}M) requires independent external Shariah audit`
      }
      return 'Public offering requires independent external Shariah audit'
    },
    standardReference: 'IFSB-10 §4.2; BNM audit guidelines'
  },
  {
    controlId: 'AA-03',
    condition: (config) => config.transactionScale.listed,
    getReason: () =>
      'Listed securities require periodic assurance reports per exchange rules',
    standardReference: 'Exchange Listing Rules'
  },
  {
    controlId: 'AA-04',
    condition: (config) => config.sustainability.enabled,
    getReason: (config) => {
      if (config.sustainability.type === 'green' || config.sustainability.type === 'social') {
        return 'Green/Social Sukuk requires Second Party Opinion (SPO) for sustainability claims'
      }
      return 'Sustainability-linked structure requires external verification of KPIs'
    },
    standardReference: 'ICMA GBP §4 (External Review); ICMA SLBP'
  },
  {
    controlId: 'AA-05',
    condition: (config) =>
      config.accounting.framework === 'AAOIFI' ||
      config.accounting.framework === 'Dual',
    getReason: () => 'AAOIFI framework requires Shariah audit per GS-3 §5',
    standardReference: 'AAOIFI GS-3 §5'
  }
]

// =============================================================================
// AGGREGATED RULES
// =============================================================================

export const ALL_ACTIVATION_RULES: ActivationRule[] = [
  ...SHARIAH_RULES,
  ...REGULATORY_RULES,
  ...RISK_RULES,
  ...FINANCIAL_RULES,
  ...AUDIT_RULES
]

// =============================================================================
// ACTIVATION ENGINE
// =============================================================================

/**
 * Evaluate a single control against configuration
 */
export function evaluateControl(
  control: Control,
  config: DealConfiguration
): ActivatedControl {
  const rule = ALL_ACTIVATION_RULES.find((r) => r.controlId === control.id)

  if (!rule) {
    // No rule defined = always activated (conservative default)
    return {
      controlId: control.id,
      activated: true,
      activationReason: 'Default activation (no conditional logic)',
      standardReference: control.standardReference,
      lifecyclePhases: control.lifecyclePhases,
      configuration: config
    }
  }

  const activated = rule.condition(config)

  return {
    controlId: control.id,
    activated,
    activationReason: activated ? rule.getReason(config) : 'Not applicable to this configuration',
    standardReference: rule.standardReference,
    lifecyclePhases: control.lifecyclePhases,
    configuration: config
  }
}

/**
 * Evaluate all controls against configuration
 */
export function evaluateAllControls(config: DealConfiguration): ActivatedControl[] {
  return ALL_CONTROLS.map((control) => evaluateControl(control, config))
}

/**
 * Generate activation summary with bucket breakdown
 */
export function generateActivationSummary(config: DealConfiguration): ActivationSummary {
  const activatedControls = evaluateAllControls(config)

  const controlsByBucket: ActivationSummary['controlsByBucket'] = {
    1: { total: 0, activated: 0, controls: [] },
    2: { total: 0, activated: 0, controls: [] },
    3: { total: 0, activated: 0, controls: [] },
    4: { total: 0, activated: 0, controls: [] },
    5: { total: 0, activated: 0, controls: [] }
  }

  activatedControls.forEach((ac) => {
    const control = ALL_CONTROLS.find((c) => c.id === ac.controlId)
    if (control) {
      const bucket = control.bucket
      controlsByBucket[bucket].total++
      controlsByBucket[bucket].controls.push(ac)
      if (ac.activated) {
        controlsByBucket[bucket].activated++
      }
    }
  })

  const totalActivated = activatedControls.filter((ac) => ac.activated).length

  return {
    totalControls: ALL_CONTROLS.length,
    activatedControls: totalActivated,
    deactivatedControls: ALL_CONTROLS.length - totalActivated,
    controlsByBucket,
    configuration: config
  }
}

/**
 * Get activated controls for a specific lifecycle phase
 */
export function getActivatedControlsForPhase(
  summary: ActivationSummary,
  phase: 'A' | 'B' | 'C' | 'D'
): ActivatedControl[] {
  const allActivated = Object.values(summary.controlsByBucket)
    .flatMap((bucket) => bucket.controls)
    .filter((ac) => ac.activated)

  return allActivated.filter((ac) => {
    const control = ALL_CONTROLS.find((c) => c.id === ac.controlId)
    return control && control.lifecyclePhases.includes(phase)
  })
}
