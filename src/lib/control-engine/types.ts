/**
 * TYPES - Deal Configuration & Control Activation
 * ================================================
 */

// =============================================================================
// STEP 1: PRODUCT STRUCTURE
// =============================================================================

export type ProductCategory = 'sukuk' | 'banking' | 'takaful' | 'funds' | 'equity'

export interface ProductStructure {
  category: ProductCategory
  subtype: string // e.g., "Ijarah", "Murabaha", "Musharakah"
  description?: string
}

// =============================================================================
// STEP 2: JURISDICTION
// =============================================================================

export type Jurisdiction =
  | 'Malaysia'
  | 'Saudi Arabia'
  | 'UAE'
  | 'Qatar'
  | 'Bahrain'
  | 'Other'

export interface JurisdictionConfig {
  primary: Jurisdiction
  additional?: Jurisdiction[]
  crossBorder: boolean
}

// =============================================================================
// STEP 3: TRANSACTION SCALE
// =============================================================================

export type OfferingType = 'private' | 'public' | 'hybrid'

export interface TransactionScale {
  size: number // In USD
  offeringType: OfferingType
  listed: boolean
  exchange?: string
}

// =============================================================================
// STEP 4: ACCOUNTING FRAMEWORK
// =============================================================================

export type AccountingFramework = 'AAOIFI' | 'IFRS' | 'Dual'
export type ReportingFrequency = 'annual' | 'semi-annual' | 'quarterly' | 'monthly'

export interface AccountingConfig {
  framework: AccountingFramework
  reportingFrequency: ReportingFrequency
  financialYearEnd: string // Format: "MM-DD" or "Hijri month"
}

// =============================================================================
// STEP 5: SUSTAINABILITY (OPTIONAL)
// =============================================================================

export type SustainabilityType = 'green' | 'social' | 'sustainability-linked' | 'none'
export type SustainabilityFramework = 'ICMA-GBP' | 'ICMA-SBP' | 'ICMA-SLBP' | 'BNM-VBIAF' | 'UN-SDG'

export interface SustainabilityConfig {
  enabled: boolean
  type?: SustainabilityType
  frameworks?: SustainabilityFramework[]
  impactCategories?: string[]
}

// =============================================================================
// STEP 6: STAKEHOLDER & GOVERNANCE
// =============================================================================

export type RiskAppetite = 'conservative' | 'moderate' | 'aggressive'

export interface SSBConfig {
  type: 'internal' | 'external'
  scholars: string[]
  fatwaSLA: number // In days
}

export interface GovernanceConfig {
  ssb: SSBConfig
  complianceOwner: string
  complianceReviewSLA: 'weekly' | 'monthly'
  riskOwner: string
  riskAppetite: RiskAppetite
  enableVCs: boolean
  disclosurePolicy: 'status-only' | 'full-audit-trail' | 'custom'
}

// =============================================================================
// COMPLETE DEAL CONFIGURATION
// =============================================================================

export interface DealConfiguration {
  // Core identification
  id?: string
  name?: string

  // 6-step configuration
  productStructure: ProductStructure
  jurisdiction: JurisdictionConfig
  transactionScale: TransactionScale
  accounting: AccountingConfig
  sustainability: SustainabilityConfig
  governance: GovernanceConfig

  // Metadata
  createdAt?: Date
  createdBy?: string
}

// =============================================================================
// CONTROL ACTIVATION
// =============================================================================

export interface ActivatedControl {
  controlId: string
  activated: boolean
  activationReason: string
  standardReference: string
  lifecyclePhases: string[]
  configuration: DealConfiguration
}

export interface ActivationSummary {
  totalControls: number
  activatedControls: number
  deactivatedControls: number
  controlsByBucket: {
    [bucket: number]: {
      total: number
      activated: number
      controls: ActivatedControl[]
    }
  }
  configuration: DealConfiguration
}
