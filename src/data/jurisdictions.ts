/**
 * JURISDICTIONS DATA
 * ==================
 * Legal and regulatory jurisdictions for Islamic finance (Component 2 of modular architecture).
 *
 * JURISDICTION CATEGORIES:
 * 1. GCC (Gulf Cooperation Council) - UAE, Saudi Arabia, Bahrain, Qatar, Kuwait, Oman
 * 2. Southeast Asia - Malaysia, Indonesia, Brunei
 * 3. Middle East/North Africa (MENA) - Pakistan, Turkey, Egypt
 * 4. Offshore/International - Luxembourg, Ireland, UK
 *
 * COMPLIANCE FOCUS:
 * - Mandatory accounting frameworks
 * - Currency and language requirements
 * - Tax implications
 * - Listing requirements
 */

import type { Jurisdiction, FormField } from '@/lib/types'

// ============================================================================
// GCC JURISDICTIONS
// ============================================================================

/**
 * 1. UAE DFSA (Dubai Financial Services Authority)
 * Region: GCC
 * Description: Premier Islamic finance hub in Middle East
 */
export const UAE_DFSA: Jurisdiction = {
  id: 'uae_dfsa',
  name: 'UAE DFSA (Dubai)',
  regulator: 'Dubai Financial Services Authority',
  country: 'AE',
  region: 'GCC',
  description: 'Dubai International Financial Centre (DIFC) - leading Islamic finance jurisdiction with flexible regulatory framework.',
  requiredLanguages: ['English', 'Arabic'],
  currencies: ['USD', 'AED'],
  taxRate: null, // UAE has no corporate income tax (as of 2023, 9% for profits >375k AED but Sukuk often exempt)
  listingRequirements: [
    'DFSA listing approval',
    'Minimum $50M issue size',
    'Credit rating from recognized agency',
    'Prospectus filing',
  ],
  // DFSA allows both AAOIFI and IFRS+Islamic
  mandatoryAccounting: undefined, // No mandatory framework, allows choice
  forbiddenAccounting: undefined,
  additionalFields: [
    {
      id: 'listing_exchange',
      label: 'Listing Exchange',
      type: 'select',
      options: ['NASDAQ Dubai', 'Dubai Financial Market (DFM)', 'Abu Dhabi Securities Exchange (ADX)'],
      aiSuggestion: 'NASDAQ Dubai (most common for Sukuk)',
      required: false,
    },
    {
      id: 'shariah_supervisory_board',
      label: 'DIFC Shariah Supervisory Board Approval',
      type: 'select',
      options: ['Required', 'Not Required'],
      aiSuggestion: 'Required for Sukuk issuances',
      required: true,
    },
  ],
  compatibleAccounting: ['aaoifi', 'ifrs_islamic', 'local_gaap'],
  icon: 'MapPin',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 2. SAUDI CMA (Capital Market Authority)
 * Region: GCC
 * Description: Largest Islamic finance market globally
 */
export const SAUDI_CMA: Jurisdiction = {
  id: 'saudi_cma',
  name: 'Saudi Arabia CMA',
  regulator: 'Capital Market Authority (CMA)',
  country: 'SA',
  region: 'GCC',
  description: 'Largest Sukuk market globally. Strict AAOIFI adherence required.',
  requiredLanguages: ['Arabic', 'English'],
  currencies: ['SAR', 'USD'],
  taxRate: 20, // 20% corporate tax on foreign companies, 2.5% Zakat for Saudi entities
  listingRequirements: [
    'CMA registration and approval',
    'Minimum SAR 100M issue size (~$27M USD)',
    'Shariah certification from approved scholars',
    'Arabic prospectus mandatory',
    'Local custodian bank required',
  ],
  // Saudi Arabia REQUIRES AAOIFI standards
  mandatoryAccounting: ['aaoifi'],
  forbiddenAccounting: ['local_gaap'], // Must use AAOIFI or IFRS+Islamic
  additionalFields: [
    {
      id: 'listing_exchange',
      label: 'Listing Exchange',
      type: 'select',
      options: ['Tadawul (Saudi Stock Exchange)', 'Sukuk & Bonds Platform'],
      aiSuggestion: 'Tadawul (primary exchange for Saudi Sukuk)',
      required: true,
    },
    {
      id: 'shariah_committee',
      label: 'CMA-Approved Shariah Committee',
      type: 'text',
      placeholder: 'Committee name',
      aiSuggestion: 'Must be from CMA-approved list of scholars',
      required: true,
    },
    {
      id: 'zakat_treatment',
      label: 'Zakat Treatment',
      type: 'select',
      options: ['Issuer pays Zakat', 'Investors pay Zakat individually'],
      aiSuggestion: 'Investors typically pay Zakat individually',
      required: true,
    },
  ],
  compatibleAccounting: ['aaoifi', 'ifrs_islamic'], // AAOIFI mandatory or IFRS+Islamic acceptable
  icon: 'MapPin',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 3. QATAR QFC/QCB (Qatar Financial Centre / Qatar Central Bank)
 * Region: GCC
 * Description: Innovative Islamic finance hub with QFC Sustainable Sukuk Framework
 */
export const QATAR_QFC: Jurisdiction = {
  id: 'qatar_qfc',
  name: 'Qatar (QFC/QCB)',
  regulator: 'Qatar Financial Centre Regulatory Authority (QFCRA) / Qatar Central Bank (QCB)',
  country: 'QA',
  region: 'GCC',
  description: 'First GCC jurisdiction with dedicated Sustainable Sukuk Framework. Home to QIIB Oryx Sustainability Sukuk. Aligned with Qatar National Vision 2030.',
  requiredLanguages: ['Arabic', 'English'],
  currencies: ['QAR', 'USD'],
  taxRate: 0, // Qatar is tax-free for most entities, 2.5% Zakat applies
  listingRequirements: [
    'QFC Regulatory Authority approval (for QFC entities)',
    'Qatar Central Bank approval (for banks)',
    'Qatar Stock Exchange (QSE) listing or London Stock Exchange',
    'QFC Sustainable Sukuk Framework compliance (if sustainability-linked)',
    'Shariah certification from recognized scholars',
  ],
  // Qatar strongly encourages AAOIFI like Saudi Arabia (research shows high compliance)
  mandatoryAccounting: ['aaoifi'], // Similar to Saudi Arabia
  forbiddenAccounting: ['local_gaap'],
  additionalFields: [
    {
      id: 'listing_exchange',
      label: 'Listing Exchange',
      type: 'select',
      options: ['Qatar Stock Exchange (QSE)', 'London Stock Exchange', 'Both'],
      aiSuggestion: 'London Stock Exchange (for international Sukuk like QIIB Oryx)',
      required: true,
    },
    {
      id: 'qfc_sustainable_framework',
      label: 'QFC Sustainable Sukuk Framework',
      type: 'select',
      options: ['Applicable - Sustainability Sukuk', 'Not Applicable - Conventional Sukuk'],
      aiSuggestion: 'Applicable for green/social/sustainability Sukuk',
      required: true,
    },
    {
      id: 'qnv_2030_alignment',
      label: 'Qatar National Vision 2030 Alignment',
      type: 'select',
      options: ['Economic Development', 'Social Development', 'Human Development', 'Environmental Development', 'Not Aligned'],
      aiSuggestion: 'Economic Development (for bank financing) or Environmental (for green Sukuk)',
      required: false,
    },
    {
      id: 'qcb_third_strategy',
      label: 'QCB Third Financial Sector Strategy',
      type: 'select',
      options: ['Aligned', 'Not Aligned'],
      aiSuggestion: 'Aligned (for sustainability Sukuk)',
      required: false,
    },
  ],
  compatibleAccounting: ['aaoifi', 'ifrs_islamic'], // AAOIFI mandatory, IFRS+Islamic acceptable
  icon: 'MapPin',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ============================================================================
// SOUTHEAST ASIA JURISDICTIONS
// ============================================================================

/**
 * 3. MALAYSIA SC (Securities Commission)
 * Region: Southeast Asia
 * Description: Most developed Islamic capital market
 */
export const MALAYSIA_SC: Jurisdiction = {
  id: 'malaysia_sc',
  name: 'Malaysia SC',
  regulator: 'Securities Commission Malaysia',
  country: 'MY',
  region: 'Southeast Asia',
  description: 'Most developed and sophisticated Islamic capital market globally. Largest Sukuk issuer by volume.',
  requiredLanguages: ['English', 'Malay'],
  currencies: ['MYR', 'USD'],
  taxRate: 24, // 24% corporate income tax, but Sukuk may have exemptions
  listingRequirements: [
    'SC Malaysia approval',
    'Bursa Malaysia listing (for public Sukuk)',
    'Credit rating from RAM or MARC (local agencies)',
    'Shariah Advisory Council (SAC) approval',
  ],
  mandatoryAccounting: undefined, // Allows flexibility
  forbiddenAccounting: undefined,
  additionalFields: [
    {
      id: 'sukuk_framework',
      label: 'Malaysian Sukuk Framework Compliance',
      type: 'select',
      options: ['SC Sukuk Guidelines', 'Bank Negara Malaysia Guidelines'],
      aiSuggestion: 'SC Sukuk Guidelines (for capital market issuances)',
      required: true,
    },
    {
      id: 'sac_approval',
      label: 'SC Shariah Advisory Council (SAC) Approval',
      type: 'select',
      options: ['Obtained', 'In Progress', 'Not Yet Applied'],
      aiSuggestion: 'Required for all Islamic securities in Malaysia',
      required: true,
    },
    {
      id: 'rating_agency',
      label: 'Rating Agency',
      type: 'select',
      options: ['RAM Rating Services', 'MARC (Malaysian Rating Corporation)', 'Both'],
      aiSuggestion: 'RAM Rating Services (most established)',
      required: false,
    },
  ],
  compatibleAccounting: ['aaoifi', 'ifrs_islamic', 'local_gaap'],
  icon: 'MapPin',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 4. LUXEMBOURG (Offshore Islamic Finance Hub)
 * Region: Europe
 * Description: European gateway for Islamic finance
 */
export const LUXEMBOURG: Jurisdiction = {
  id: 'luxembourg',
  name: 'Luxembourg',
  regulator: 'Commission de Surveillance du Secteur Financier (CSSF)',
  country: 'LU',
  region: 'Europe',
  description: 'Leading European center for Islamic finance. Gateway to EU investors.',
  requiredLanguages: ['English', 'French'],
  currencies: ['EUR', 'USD'],
  taxRate: 24.94, // ~25% corporate income tax
  listingRequirements: [
    'CSSF prospectus approval',
    'Luxembourg Stock Exchange listing',
    'Shariah certification from recognized scholars',
    'EU Prospectus Regulation compliance',
  ],
  mandatoryAccounting: undefined, // Flexible, allows IFRS
  forbiddenAccounting: undefined,
  additionalFields: [
    {
      id: 'listing_platform',
      label: 'Listing Platform',
      type: 'select',
      options: ['Luxembourg Stock Exchange (LuxSE)', 'Euro MTF'],
      aiSuggestion: 'LuxSE (main regulated market)',
      required: true,
    },
    {
      id: 'prospectus_language',
      label: 'Prospectus Language',
      type: 'select',
      options: ['English', 'French', 'Both'],
      aiSuggestion: 'English (most common for international Sukuk)',
      required: true,
    },
    {
      id: 'eu_passporting',
      label: 'EU Passporting',
      type: 'select',
      options: ['Yes - utilize EU passport', 'No - Luxembourg only'],
      aiSuggestion: 'Yes (access to all EU markets)',
      required: false,
    },
  ],
  compatibleAccounting: ['aaoifi', 'ifrs_islamic', 'local_gaap'],
  icon: 'MapPin',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ============================================================================
// ALL JURISDICTIONS ARRAY
// ============================================================================

export const ALL_JURISDICTIONS: Jurisdiction[] = [
  UAE_DFSA,
  SAUDI_CMA,
  QATAR_QFC,
  MALAYSIA_SC,
  LUXEMBOURG,
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get jurisdiction by ID
 */
export function getJurisdictionById(id: string): Jurisdiction | undefined {
  return ALL_JURISDICTIONS.find((j) => j.id === id)
}

/**
 * Get jurisdictions by region
 */
export function getJurisdictionsByRegion(region: string): Jurisdiction[] {
  return ALL_JURISDICTIONS.filter((j) => j.region === region)
}

/**
 * Get jurisdictions compatible with specific accounting framework
 */
export function getJurisdictionsForAccounting(accountingId: string): Jurisdiction[] {
  return ALL_JURISDICTIONS.filter((j) => {
    // If jurisdiction has mandatory accounting, check if it includes the framework
    if (j.mandatoryAccounting) {
      return j.mandatoryAccounting.includes(accountingId)
    }
    // If jurisdiction has forbidden accounting, exclude if framework is forbidden
    if (j.forbiddenAccounting) {
      return !j.forbiddenAccounting.includes(accountingId)
    }
    // Otherwise, check compatibleAccounting list
    return j.compatibleAccounting.includes(accountingId)
  })
}
