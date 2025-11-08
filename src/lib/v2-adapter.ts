/**
 * V2 ADAPTER LAYER
 * =================
 * Maps between workflow-v2 data model and main demo data model
 *
 * V2 Model (GRC-aligned):
 * - ProductStructure (category + subtype)
 * - JurisdictionConfig (primary + additional + crossBorder)
 * - TransactionScale (size + offeringType + listed)
 * - AccountingConfig (framework + reportingFrequency)
 * - SustainabilityConfig (type + frameworks)
 * - GovernanceConfig (SSB + compliance + risk)
 *
 * Main Demo Model (4-component modular):
 * - ShariahStructure (contract-based)
 * - Jurisdiction (regulatory authority)
 * - AccountingFramework (reporting standard)
 * - ImpactMetrics[] (ESG/sustainability, multi-select)
 */

import type {
  DealConfiguration as V2DealConfiguration,
  ProductStructure,
  JurisdictionConfig,
  TransactionScale,
  AccountingConfig,
  SustainabilityConfig,
  GovernanceConfig,
  Jurisdiction as V2Jurisdiction
} from '@/lib/control-engine/types'

import type {
  WorkflowExecution,
  ShariahStructure,
  Jurisdiction,
  AccountingFramework,
  ImpactMetrics,
  DealConfiguration
} from '@/lib/types'

import {
  ALL_SHARIAH_STRUCTURES,
  getShariahStructureById
} from '@/data/shariah-structures'

import {
  ALL_JURISDICTIONS,
  getJurisdictionById
} from '@/data/jurisdictions'

import {
  ALL_ACCOUNTING_FRAMEWORKS,
  getAccountingFrameworkById
} from '@/data/accounting-frameworks'

import {
  ALL_IMPACT_METRICS,
  getImpactMetricsById
} from '@/data/impact-metrics'

// ============================================================================
// MAPPING TABLES
// ============================================================================

/**
 * Map V2 jurisdiction names to main demo jurisdiction IDs
 */
const JURISDICTION_NAME_TO_ID: Record<V2Jurisdiction, string> = {
  'Malaysia': 'malaysia_sc',
  'Saudi Arabia': 'saudi_cma',
  'UAE': 'uae_dfsa',
  'Qatar': 'qatar_qfc',
  'Bahrain': 'uae_dfsa', // Fallback to UAE DFSA (similar GCC framework)
  'Other': 'luxembourg'
}

/**
 * Map V2 product subtypes to main demo Shariah structure IDs
 * (Lowercase for case-insensitive matching)
 */
const SUBTYPE_TO_STRUCTURE_ID: Record<string, string> = {
  'ijarah': 'ijara',
  'murabaha': 'murabaha',
  'musharakah': 'musharaka',
  'mudarabah': 'mudaraba',
  "istisna'a": 'istisna',
  'istisna': 'istisna',
  'salam': 'salam',
  'wakala': 'wakala',
  'wakalah': 'wakala',
  'tawarruq': 'murabaha', // Tawarruq is a form of Murabaha
  'equity fund': 'mudaraba', // Equity funds typically use Mudaraba structure
  'sukuk fund': 'wakala', // Sukuk funds often use Wakala
  'real estate fund': 'musharaka', // Real estate funds typically Musharaka
  'commodity fund': 'murabaha', // Commodity funds use Murabaha/Tawarruq
  'diminishing musharakah': 'musharaka'
}

/**
 * Map V2 accounting framework names to main demo IDs
 */
const ACCOUNTING_NAME_TO_ID: Record<string, string> = {
  'AAOIFI': 'aaoifi',
  'Dual': 'ifrs_islamic',  // Dual = IFRS + Islamic adjustments
  'IFRS': 'ifrs'
}

/**
 * Map V2 sustainability types/frameworks to main demo impact metrics IDs
 */
const SUSTAINABILITY_TO_IMPACT: Record<string, string[]> = {
  'Green': ['green_sukuk'],
  'Social': ['sdg_sukuk', 'islamic_social_finance'],
  'Sustainability': ['green_sukuk', 'sdg_sukuk'], // Combined green + social
  'ESG': ['esg_framework'],
  'None': ['none']
}

// Additional sustainability framework mappings
const SUSTAINABILITY_FRAMEWORK_TO_IMPACT: Record<string, string> = {
  'ICMA Green Bond Principles': 'green_sukuk',
  'UN SDGs': 'sdg_sukuk',
  'QFC Sustainable': 'qfc_sustainable',
  'VBI Malaysia': 'vbi_malaysia',
  'Climate Bonds Initiative': 'cbi_certification',
  'Islamic Social Finance': 'islamic_social_finance'
}

// ============================================================================
// V2 → MAIN DEMO MAPPING
// ============================================================================

/**
 * Map V2 ProductStructure to main demo ShariahStructure
 */
export function mapProductStructureToShariah(
  productStructure: ProductStructure
): ShariahStructure | null {
  // Normalize subtype for matching (lowercase, remove special chars)
  const normalizedSubtype = productStructure.subtype.toLowerCase().trim()

  // Look up structure ID
  const structureId = SUBTYPE_TO_STRUCTURE_ID[normalizedSubtype]

  if (!structureId) {
    console.warn(`No Shariah structure mapping found for subtype: ${productStructure.subtype}`)
    return null
  }

  return getShariahStructureById(structureId) || null
}

/**
 * Map V2 JurisdictionConfig to main demo Jurisdiction
 */
export function mapJurisdictionConfigToJurisdiction(
  jurisdictionConfig: JurisdictionConfig
): Jurisdiction | null {
  // Map primary jurisdiction
  const jurisdictionId = JURISDICTION_NAME_TO_ID[jurisdictionConfig.primary]

  if (!jurisdictionId) {
    console.warn(`No jurisdiction mapping found for: ${jurisdictionConfig.primary}`)
    return null
  }

  return getJurisdictionById(jurisdictionId) || null
}

/**
 * Map V2 AccountingConfig to main demo AccountingFramework
 */
export function mapAccountingConfigToFramework(
  accountingConfig: AccountingConfig
): AccountingFramework | null {
  const frameworkId = ACCOUNTING_NAME_TO_ID[accountingConfig.framework]

  if (!frameworkId) {
    console.warn(`No accounting framework mapping found for: ${accountingConfig.framework}`)
    return null
  }

  return getAccountingFrameworkById(frameworkId) || null
}

/**
 * Map V2 SustainabilityConfig to main demo ImpactMetrics[]
 */
export function mapSustainabilityToImpacts(
  sustainabilityConfig: SustainabilityConfig
): ImpactMetrics[] {
  const impacts: ImpactMetrics[] = []

  // Map by type
  const impactIds = SUSTAINABILITY_TO_IMPACT[sustainabilityConfig.type ?? 'None'] || []

  // Add impacts based on type
  impactIds.forEach(id => {
    const impact = getImpactMetricsById(id)
    if (impact) impacts.push(impact)
  })

  // Map additional frameworks if specified
  if (sustainabilityConfig.frameworks && sustainabilityConfig.frameworks.length > 0) {
    sustainabilityConfig.frameworks.forEach(framework => {
      const impactId = SUSTAINABILITY_FRAMEWORK_TO_IMPACT[framework]
      if (impactId) {
        const impact = getImpactMetricsById(impactId)
        if (impact && !impacts.find(i => i.id === impact.id)) {
          impacts.push(impact)
        }
      }
    })
  }

  return impacts
}

/**
 * Convert V2 DealConfiguration to main demo WorkflowExecution partial
 */
export function mapV2ToMainDemo(
  v2Config: V2DealConfiguration
): Partial<WorkflowExecution> {
  // Map each component
  const shariahStructure = mapProductStructureToShariah(v2Config.productStructure)
  const jurisdiction = mapJurisdictionConfigToJurisdiction(v2Config.jurisdiction)
  const accounting = mapAccountingConfigToFramework(v2Config.accounting)
  const impacts = mapSustainabilityToImpacts(v2Config.sustainability)

  // Build partial WorkflowExecution
  const mapped: Partial<WorkflowExecution> = {
    selectedShariahStructure: shariahStructure,
    isSecuritized: v2Config.productStructure.category === 'sukuk', // Sukuk = securitized
    selectedJurisdiction: jurisdiction,
    selectedAccounting: accounting,
    selectedImpacts: impacts,

    // Store V2-specific data in metadata for later use
    metadata: {
      v2Config: {
        transactionScale: v2Config.transactionScale,
        governance: v2Config.governance,
        crossBorder: v2Config.jurisdiction.crossBorder,
        additionalJurisdictions: v2Config.jurisdiction.additional || [],
        reportingFrequency: v2Config.accounting.reportingFrequency
      }
    }
  }

  return mapped
}

// ============================================================================
// MAIN DEMO → V2 MAPPING (Reverse)
// ============================================================================

/**
 * Map main demo ShariahStructure to V2 ProductStructure
 */
export function mapShariahToProductStructure(
  shariahStructure: ShariahStructure,
  isSecuritized: boolean
): ProductStructure {
  // Determine category based on whether it's securitized
  const category = isSecuritized ? 'sukuk' : 'banking'

  return {
    category,
    subtype: shariahStructure.name,
    description: shariahStructure.description
  }
}

/**
 * Map main demo Jurisdiction to V2 JurisdictionConfig
 */
export function mapJurisdictionToConfig(
  jurisdiction: Jurisdiction,
  crossBorder: boolean = false,
  additional: V2Jurisdiction[] = []
): JurisdictionConfig {
  // Reverse lookup: ID → Name
  const nameEntry = Object.entries(JURISDICTION_NAME_TO_ID).find(
    ([_, id]) => id === jurisdiction.id
  )

  const primary = (nameEntry?.[0] as V2Jurisdiction) || 'Other'

  return {
    primary,
    additional,
    crossBorder
  }
}

/**
 * Map main demo AccountingFramework to V2 AccountingConfig
 */
export function mapFrameworkToAccountingConfig(
  framework: AccountingFramework,
  reportingFrequency: 'quarterly' | 'semi-annual' | 'annual' = 'quarterly'
): AccountingConfig {
  // Reverse lookup: ID → Name
  const nameEntry = Object.entries(ACCOUNTING_NAME_TO_ID).find(
    ([_, id]) => id === framework.id
  )

  const frameworkName = (nameEntry?.[0] || 'AAOIFI') as 'AAOIFI' | 'IFRS' | 'Dual'

  return {
    framework: frameworkName,
    reportingFrequency,
    financialYearEnd: '12-31' // Default to calendar year end
  }
}

/**
 * Map main demo ImpactMetrics[] to V2 SustainabilityConfig
 */
export function mapImpactsToSustainability(
  impacts: ImpactMetrics[]
): SustainabilityConfig {
  if (impacts.length === 0 || impacts.some(i => i.id === 'none')) {
    return {
      enabled: false,
      type: 'none',
      frameworks: []
    }
  }

  // Determine type based on impacts
  const hasGreen = impacts.some(i => i.id === 'green_sukuk' || i.id === 'qfc_sustainable' || i.id === 'cbi_certification')
  const hasSocial = impacts.some(i => i.id === 'sdg_sukuk' || i.id === 'islamic_social_finance')

  let type: 'green' | 'social' | 'sustainability-linked' | 'none'

  if (hasGreen && hasSocial) {
    type = 'sustainability-linked'
  } else if (hasGreen) {
    type = 'green'
  } else if (hasSocial) {
    type = 'social'
  } else {
    type = 'none'
  }

  // Map frameworks
  const frameworks: string[] = impacts
    .map(impact => {
      // Reverse lookup
      const frameworkEntry = Object.entries(SUSTAINABILITY_FRAMEWORK_TO_IMPACT).find(
        ([_, id]) => id === impact.id
      )
      return frameworkEntry?.[0]
    })
    .filter((f): f is string => f !== undefined)

  return {
    enabled: type !== 'none',
    type,
    frameworks: frameworks as ('ICMA-GBP' | 'ICMA-SBP' | 'ICMA-SLBP' | 'BNM-VBIAF' | 'UN-SDG')[]
  }
}

/**
 * Convert main demo WorkflowExecution to V2 DealConfiguration
 */
export function mapMainDemoToV2(
  execution: WorkflowExecution,
  transactionScale?: TransactionScale,
  governance?: GovernanceConfig
): V2DealConfiguration | null {
  if (
    !execution.selectedShariahStructure ||
    !execution.selectedJurisdiction ||
    !execution.selectedAccounting
  ) {
    console.warn('Cannot map to V2: missing required components')
    return null
  }

  // Use metadata if available for V2-specific fields
  const v2Metadata = execution.metadata?.v2Config

  const productStructure = mapShariahToProductStructure(
    execution.selectedShariahStructure,
    execution.isSecuritized
  )

  const jurisdiction = mapJurisdictionToConfig(
    execution.selectedJurisdiction,
    v2Metadata?.crossBorder || false,
    v2Metadata?.additionalJurisdictions || []
  )

  const accounting = mapFrameworkToAccountingConfig(
    execution.selectedAccounting,
    v2Metadata?.reportingFrequency || 'quarterly'
  )

  const sustainability = mapImpactsToSustainability(execution.selectedImpacts || [])

  // Use provided or metadata values for V2-specific fields
  const finalTransactionScale = transactionScale || v2Metadata?.transactionScale || {
    size: 100000000, // Default $100M
    offeringType: 'private' as const,
    listed: false
  }

  const finalGovernance = governance || v2Metadata?.governance || {
    ssb: {
      mandated: true,
      members: 3,
      independenceRequired: true
    },
    complianceOwner: 'Compliance Officer',
    complianceReviewSLA: 'monthly' as const,
    riskOwner: 'Risk Manager',
    riskAppetite: 'moderate' as const,
    enableVCs: true,
    disclosurePolicy: 'full-audit-trail' as const
  }

  return {
    id: execution.id,
    name: `Deal ${execution.id}`,
    productStructure,
    jurisdiction,
    transactionScale: finalTransactionScale,
    accounting,
    sustainability,
    governance: finalGovernance,
    createdAt: new Date(), // WorkflowExecution doesn't have createdAt
    createdBy: 'system'
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate that V2 config can be mapped to main demo
 */
export function canMapV2ToMainDemo(v2Config: V2DealConfiguration): boolean {
  const shariahStructure = mapProductStructureToShariah(v2Config.productStructure)
  const jurisdiction = mapJurisdictionConfigToJurisdiction(v2Config.jurisdiction)
  const accounting = mapAccountingConfigToFramework(v2Config.accounting)

  return !!(shariahStructure && jurisdiction && accounting)
}

/**
 * Get all available mappings for debugging
 */
export function getMappingTables() {
  return {
    jurisdictions: JURISDICTION_NAME_TO_ID,
    structures: SUBTYPE_TO_STRUCTURE_ID,
    accounting: ACCOUNTING_NAME_TO_ID,
    sustainability: SUSTAINABILITY_TO_IMPACT,
    sustainabilityFrameworks: SUSTAINABILITY_FRAMEWORK_TO_IMPACT
  }
}
