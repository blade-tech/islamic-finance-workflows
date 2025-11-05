/**
 * VALIDATION RULES ENGINE
 * =======================
 * Comprehensive validation for 4-component modular architecture configurations.
 *
 * VALIDATION LAYERS:
 * 1. Individual Component Validation - Check required fields in each component
 * 2. Pairwise Compatibility - Validate compatibility between component pairs
 * 3. Cross-Cutting Rules - Validate rules that span multiple components
 * 4. Business Logic Validation - Check domain-specific constraints
 *
 * VALIDATION OUTCOMES:
 * - Errors: Block configuration (isValid = false)
 * - Warnings: Allow configuration but highlight potential issues (isValid = true)
 */

import type {
  ShariahStructure,
  Jurisdiction,
  AccountingFramework,
  ImpactMetrics,
  TakafulOverlay,
  DealConfiguration,
} from './types'

/**
 * VALIDATION ERROR/WARNING TYPES
 */
export type ValidationSeverity = 'error' | 'warning'

export interface ValidationResult {
  severity: ValidationSeverity
  message: string
  componentPair?: string
  rule?: string
}

/**
 * LAYER 1: INDIVIDUAL COMPONENT VALIDATION
 */

export function validateShariahStructure(structure: ShariahStructure | null): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!structure) {
    results.push({
      severity: 'error',
      message: 'Shariah Structure is required',
      rule: 'REQUIRED_COMPONENT',
    })
    return results
  }

  // Check required fields
  if (!structure.name) {
    results.push({
      severity: 'error',
      message: 'Shariah Structure name is missing',
      rule: 'REQUIRED_FIELD',
    })
  }

  if (!structure.baseFields || structure.baseFields.length === 0) {
    results.push({
      severity: 'warning',
      message: 'Shariah Structure has no base fields defined',
      rule: 'MISSING_FIELDS',
    })
  }

  if (!structure.aaoifiStandards || structure.aaoifiStandards.length === 0) {
    results.push({
      severity: 'warning',
      message: 'Shariah Structure has no AAOIFI standards defined',
      rule: 'MISSING_STANDARDS',
    })
  }

  return results
}

export function validateJurisdiction(jurisdiction: Jurisdiction | null): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!jurisdiction) {
    results.push({
      severity: 'error',
      message: 'Jurisdiction is required',
      rule: 'REQUIRED_COMPONENT',
    })
    return results
  }

  // Check required fields
  if (!jurisdiction.name) {
    results.push({
      severity: 'error',
      message: 'Jurisdiction name is missing',
      rule: 'REQUIRED_FIELD',
    })
  }

  if (!jurisdiction.regulator) {
    results.push({
      severity: 'warning',
      message: 'Jurisdiction regulator is missing',
      rule: 'MISSING_FIELD',
    })
  }

  return results
}

export function validateAccountingFramework(framework: AccountingFramework | null): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!framework) {
    results.push({
      severity: 'error',
      message: 'Accounting Framework is required',
      rule: 'REQUIRED_COMPONENT',
    })
    return results
  }

  // Check required fields
  if (!framework.name) {
    results.push({
      severity: 'error',
      message: 'Accounting Framework name is missing',
      rule: 'REQUIRED_FIELD',
    })
  }

  if (!framework.applicableStandards || framework.applicableStandards.length === 0) {
    results.push({
      severity: 'warning',
      message: 'Accounting Framework has no applicable standards defined',
      rule: 'MISSING_STANDARDS',
    })
  }

  return results
}

export function validateImpactMetrics(impact: ImpactMetrics | null): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!impact) {
    results.push({
      severity: 'error',
      message: 'Impact Metrics are required',
      rule: 'REQUIRED_COMPONENT',
    })
    return results
  }

  // Check required fields
  if (!impact.name) {
    results.push({
      severity: 'error',
      message: 'Impact Metrics name is missing',
      rule: 'REQUIRED_FIELD',
    })
  }

  if (impact.certificationRequired && (!impact.certifiers || impact.certifiers.length === 0)) {
    results.push({
      severity: 'warning',
      message: `${impact.name} requires certification but no certifiers are defined`,
      rule: 'MISSING_CERTIFIERS',
    })
  }

  return results
}

/**
 * LAYER 2: PAIRWISE COMPATIBILITY VALIDATION
 */

export function validateJurisdictionAccountingCompatibility(
  jurisdiction: Jurisdiction | null,
  accounting: AccountingFramework | null
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!jurisdiction || !accounting) return results

  // Check if accounting framework is compatible with jurisdiction
  if (!accounting.compatibleJurisdictions.includes(jurisdiction.id)) {
    results.push({
      severity: 'error',
      message: `${accounting.name} is not compatible with ${jurisdiction.name}`,
      componentPair: 'jurisdiction-accounting',
      rule: 'INCOMPATIBLE_COMBINATION',
    })
  }

  // Check mandatory accounting requirement
  if (jurisdiction.mandatoryAccounting && jurisdiction.mandatoryAccounting.length > 0) {
    const isMandatory = jurisdiction.mandatoryAccounting.includes(accounting.id)
    if (!isMandatory) {
      results.push({
        severity: 'error',
        message: `${jurisdiction.name} requires ${jurisdiction.mandatoryAccounting.map(id => id.toUpperCase()).join(' or ')} accounting framework. ${accounting.name} is not allowed.`,
        componentPair: 'jurisdiction-accounting',
        rule: 'MANDATORY_FRAMEWORK_VIOLATION',
      })
    }
  }

  return results
}

export function validateShariahJurisdictionCompatibility(
  shariah: ShariahStructure | null,
  jurisdiction: Jurisdiction | null
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!shariah || !jurisdiction) return results

  // BUSINESS RULE: Certain Sukuk structures may have jurisdiction restrictions
  // Example: Salam Sukuk not commonly used in certain jurisdictions
  if (shariah.id === 'salam' && jurisdiction.id === 'luxembourg') {
    results.push({
      severity: 'warning',
      message: `${shariah.name} is rarely used in ${jurisdiction.name} due to regulatory complexity`,
      componentPair: 'shariah-jurisdiction',
      rule: 'UNCOMMON_COMBINATION',
    })
  }

  // BUSINESS RULE: Hybrid Sukuk may require specific regulatory approvals
  if (shariah.id === 'hybrid' && jurisdiction.region === 'GCC') {
    results.push({
      severity: 'warning',
      message: `${shariah.name} may require additional regulatory approval in ${jurisdiction.region} jurisdictions`,
      componentPair: 'shariah-jurisdiction',
      rule: 'ADDITIONAL_APPROVAL_REQUIRED',
    })
  }

  return results
}

export function validateImpactShariahCompatibility(
  impact: ImpactMetrics | null,
  shariah: ShariahStructure | null
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!impact || !shariah) return results

  // BUSINESS RULE: Green Sukuk certification typically pairs with asset-backed structures
  if (impact.id === 'green_sukuk' && !['ijara', 'istisna'].includes(shariah.id)) {
    results.push({
      severity: 'warning',
      message: `${impact.name} is typically issued using asset-backed structures like Ijara or Istisna. ${shariah.name} is less common for green issuances.`,
      componentPair: 'impact-shariah',
      rule: 'UNCOMMON_GREEN_STRUCTURE',
    })
  }

  // BUSINESS RULE: SDG-Linked Sukuk often pairs with social-impact structures
  if (impact.id === 'sdg_linked' && shariah.id === 'murabaha') {
    results.push({
      severity: 'warning',
      message: `${impact.name} is often associated with project-based structures. ${shariah.name} (commodity trade) may not align well with social impact goals.`,
      componentPair: 'impact-shariah',
      rule: 'MISALIGNED_IMPACT_STRUCTURE',
    })
  }

  return results
}

export function validateImpactJurisdictionCompatibility(
  impact: ImpactMetrics | null,
  jurisdiction: Jurisdiction | null
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!impact || !jurisdiction) return results

  // BUSINESS RULE: Green Sukuk certification requirements vary by jurisdiction
  if (impact.certificationRequired && jurisdiction.region === 'GCC') {
    results.push({
      severity: 'warning',
      message: `${impact.name} certification standards may differ in ${jurisdiction.region}. Ensure certifiers are recognized in ${jurisdiction.name}.`,
      componentPair: 'impact-jurisdiction',
      rule: 'CERTIFICATION_RECOGNITION',
    })
  }

  return results
}

/**
 * LAYER 3: CROSS-CUTTING VALIDATION
 */

export function validateTakafulOverlay(
  takaful: TakafulOverlay | undefined,
  shariah: ShariahStructure | null,
  jurisdiction: Jurisdiction | null
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!takaful || !takaful.enabled) return results

  // Takaful overlay validation
  if (shariah && !['ijara', 'murabaha', 'musharaka'].includes(shariah.id)) {
    results.push({
      severity: 'warning',
      message: `Takaful overlay is less common with ${shariah?.name}. Typically used with Ijara, Murabaha, or Musharaka.`,
      rule: 'UNCOMMON_TAKAFUL_STRUCTURE',
    })
  }

  if (jurisdiction && jurisdiction.region === 'Europe') {
    results.push({
      severity: 'warning',
      message: `Takaful products may require additional regulatory approval in ${jurisdiction.name}`,
      rule: 'TAKAFUL_REGULATORY_COMPLEXITY',
    })
  }

  return results
}

export function validateConfigurationCompleteness(
  shariah: ShariahStructure | null,
  jurisdiction: Jurisdiction | null,
  accounting: AccountingFramework | null,
  impact: ImpactMetrics | null
): ValidationResult[] {
  const results: ValidationResult[] = []

  const missingComponents: string[] = []
  if (!shariah) missingComponents.push('Shariah Structure')
  if (!jurisdiction) missingComponents.push('Jurisdiction')
  if (!accounting) missingComponents.push('Accounting Framework')
  if (!impact) missingComponents.push('Impact Metrics')

  if (missingComponents.length > 0) {
    results.push({
      severity: 'error',
      message: `Configuration incomplete: Missing ${missingComponents.join(', ')}`,
      rule: 'INCOMPLETE_CONFIGURATION',
    })
  }

  return results
}

/**
 * LAYER 4: BUSINESS LOGIC VALIDATION
 */

export function validateMarketPractices(
  shariah: ShariahStructure | null,
  jurisdiction: Jurisdiction | null,
  accounting: AccountingFramework | null,
  impact: ImpactMetrics | null
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!shariah || !jurisdiction || !accounting || !impact) return results

  // BUSINESS RULE: AAOIFI + GCC combination is highly standardized
  if (accounting.id === 'aaoifi' && jurisdiction.region === 'GCC') {
    // This is the gold standard - no warnings needed
  }

  // BUSINESS RULE: IFRS in GCC may require additional disclosure
  if (accounting.id === 'ifrs_islamic' && jurisdiction.region === 'GCC') {
    results.push({
      severity: 'warning',
      message: `Using ${accounting.name} in ${jurisdiction.region} region may require additional AAOIFI disclosures for local compliance`,
      rule: 'DUAL_STANDARD_DISCLOSURE',
    })
  }

  // BUSINESS RULE: Local GAAP outside home jurisdiction
  if (accounting.id === 'local_gaap' && jurisdiction.id !== 'malaysia') {
    results.push({
      severity: 'warning',
      message: `${accounting.name} is typically used in Malaysia. International investors may prefer AAOIFI or IFRS.`,
      rule: 'LOCAL_STANDARD_INTERNATIONAL_DEAL',
    })
  }

  return results
}

/**
 * MASTER VALIDATION FUNCTION
 * Orchestrates all validation layers and returns comprehensive results
 */
export function validateDealConfiguration(
  shariah: ShariahStructure | null,
  jurisdiction: Jurisdiction | null,
  accounting: AccountingFramework | null,
  impact: ImpactMetrics | null,
  takaful?: TakafulOverlay
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  allResults: ValidationResult[]
} {
  const allResults: ValidationResult[] = []

  // Layer 1: Individual component validation
  allResults.push(...validateShariahStructure(shariah))
  allResults.push(...validateJurisdiction(jurisdiction))
  allResults.push(...validateAccountingFramework(accounting))
  allResults.push(...validateImpactMetrics(impact))

  // Layer 2: Pairwise compatibility
  allResults.push(...validateJurisdictionAccountingCompatibility(jurisdiction, accounting))
  allResults.push(...validateShariahJurisdictionCompatibility(shariah, jurisdiction))
  allResults.push(...validateImpactShariahCompatibility(impact, shariah))
  allResults.push(...validateImpactJurisdictionCompatibility(impact, jurisdiction))

  // Layer 3: Cross-cutting validation
  allResults.push(...validateTakafulOverlay(takaful, shariah, jurisdiction))
  allResults.push(...validateConfigurationCompleteness(shariah, jurisdiction, accounting, impact))

  // Layer 4: Business logic validation
  allResults.push(...validateMarketPractices(shariah, jurisdiction, accounting, impact))

  // Separate errors and warnings
  const errors = allResults.filter(r => r.severity === 'error').map(r => r.message)
  const warnings = allResults.filter(r => r.severity === 'warning').map(r => r.message)

  // Configuration is valid only if there are no errors
  const isValid = errors.length === 0

  return {
    isValid,
    errors,
    warnings,
    allResults,
  }
}
