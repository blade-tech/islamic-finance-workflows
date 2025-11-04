/**
 * ACCOUNTING FRAMEWORKS DATA
 * ===========================
 * Accounting and reporting standards for Islamic finance (Component 3 of modular architecture).
 *
 * FRAMEWORK CATEGORIES:
 * 1. AAOIFI - Global Islamic finance accounting standard
 * 2. IFRS+Islamic - IFRS adapted for Islamic finance
 * 3. Local GAAP - Country-specific Islamic accounting
 *
 * COMPLIANCE FOCUS:
 * - Applicable standards
 * - Reporting requirements
 * - Jurisdiction compatibility
 */

import type { AccountingFramework, FormField } from '@/lib/types'

// ============================================================================
// ACCOUNTING FRAMEWORKS
// ============================================================================

/**
 * 1. AAOIFI STANDARDS
 * Organization: Accounting and Auditing Organization for Islamic Financial Institutions
 * Coverage: Global standard for Islamic finance
 */
export const AAOIFI: AccountingFramework = {
  id: 'aaoifi',
  name: 'AAOIFI Standards',
  description: 'Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) standards - the global benchmark for Islamic finance accounting.',
  organization: 'Accounting and Auditing Organization for Islamic Financial Institutions',
  applicableStandards: [
    'FAS 1 - General Presentation and Disclosure in the Financial Statements of Islamic Banks',
    'FAS 33 - Investment Sukuk',
    'FAS 34 - Financial Reporting for Sukuk-Holders',
    'Shariah Standard 17 - Investment Sukuk',
    'Shariah Standard 62 - Sukuk',
    'Governance Standard 7 - Corporate Social Responsibility',
  ],
  reportingRequirements: [
    'Annual audited financial statements (AAOIFI-compliant)',
    'Shariah Supervisory Board Report',
    'Statement of Sources and Uses of Zakat and Charity Funds',
    'Statement of Changes in Restricted Investments',
    'Quarterly financial reports',
    'Sukuk-specific disclosures per FAS 33',
  ],
  additionalFields: [
    {
      id: 'shariah_board_composition',
      label: 'Shariah Supervisory Board Composition',
      type: 'text',
      placeholder: 'List of board members',
      aiSuggestion: 'AAOIFI requires min. 3 qualified Shariah scholars',
      required: true,
    },
    {
      id: 'aaoifi_audit_firm',
      label: 'AAOIFI-Certified Audit Firm',
      type: 'text',
      placeholder: 'Audit firm name',
      aiSuggestion: 'Must have AAOIFI Certified Islamic Public Accountants (CIPA)',
      required: true,
    },
    {
      id: 'zakat_calculation_method',
      label: 'Zakat Calculation Method',
      type: 'select',
      options: ['Net Assets Method', 'Net Invested Funds Method', 'Other AAOIFI-Approved Method'],
      aiSuggestion: 'Net Assets Method (most common)',
      required: false,
    },
  ],
  compatibleJurisdictions: ['saudi_cma', 'uae_dfsa', 'qatar_qfc', 'malaysia_sc', 'luxembourg'], // Compatible with all
  websiteUrl: 'https://aaoifi.com',
  icon: 'BookOpen',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 2. IFRS + ISLAMIC ADAPTATIONS
 * Organization: IFRS Foundation with Islamic finance adaptations
 * Coverage: International standard with Shariah-compliant modifications
 */
export const IFRS_ISLAMIC: AccountingFramework = {
  id: 'ifrs_islamic',
  name: 'IFRS + Islamic Adaptations',
  description: 'International Financial Reporting Standards (IFRS) adapted for Islamic finance principles. Used when AAOIFI is not mandated.',
  organization: 'IFRS Foundation (with Islamic finance adaptations)',
  applicableStandards: [
    'IFRS 9 - Financial Instruments (adapted for Islamic finance)',
    'IFRS 15 - Revenue from Contracts with Customers',
    'IFRS 16 - Leases (adapted for Ijara)',
    'IAS 1 - Presentation of Financial Statements',
    'IAS 32 - Financial Instruments: Presentation',
    'Islamic Finance Disclosure Requirements',
  ],
  reportingRequirements: [
    'Annual audited financial statements (IFRS-compliant)',
    'Shariah compliance certificate',
    'Islamic finance-specific disclosures',
    'Quarterly financial reports',
    'Management discussion and analysis (MD&A)',
  ],
  additionalFields: [
    {
      id: 'ifrs_version',
      label: 'IFRS Version',
      type: 'select',
      options: ['IFRS 2023', 'IFRS 2024', 'Latest'],
      aiSuggestion: 'Latest version for new issuances',
      required: true,
    },
    {
      id: 'islamic_adaptations',
      label: 'Islamic Finance Adaptations Applied',
      type: 'text',
      placeholder: 'List key adaptations (e.g., riba-free discounting)',
      aiSuggestion: 'Document deviations from standard IFRS for Islamic compliance',
      required: true,
    },
    {
      id: 'audit_firm',
      label: 'Big 4 Audit Firm (Islamic Finance Practice)',
      type: 'select',
      options: ['PwC Islamic Finance', 'Deloitte Islamic Finance', 'EY Islamic Finance', 'KPMG Islamic Finance', 'Other'],
      aiSuggestion: 'PwC Islamic Finance (largest Islamic finance audit practice)',
      required: true,
    },
  ],
  compatibleJurisdictions: ['uae_dfsa', 'saudi_cma', 'qatar_qfc', 'malaysia_sc', 'luxembourg'], // All except those mandating AAOIFI exclusively
  websiteUrl: 'https://www.ifrs.org',
  icon: 'Globe',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 3. LOCAL GAAP (Country-Specific)
 * Organization: Local regulators
 * Coverage: Country-specific accounting standards with Islamic finance adaptations
 */
export const LOCAL_GAAP: AccountingFramework = {
  id: 'local_gaap',
  name: 'Local GAAP (Islamic-Compliant)',
  description: 'Country-specific Generally Accepted Accounting Principles adapted for Islamic finance. Used for domestic issuances.',
  organization: 'Local regulatory authorities',
  applicableStandards: [
    'Country-specific accounting standards',
    'Local Islamic finance regulations',
    'Central bank guidelines',
    'Securities commission rules',
  ],
  reportingRequirements: [
    'Annual audited financial statements (local GAAP)',
    'Compliance with local Shariah board requirements',
    'Periodic regulatory filings',
    'Local language financial reports',
  ],
  additionalFields: [
    {
      id: 'country',
      label: 'Country/Jurisdiction',
      type: 'select',
      options: ['Malaysia', 'Indonesia', 'Pakistan', 'Turkey', 'Egypt', 'Other'],
      aiSuggestion: 'Select country for specific GAAP requirements',
      required: true,
    },
    {
      id: 'local_standards',
      label: 'Specific Local Standards',
      type: 'text',
      placeholder: 'e.g., MFRS (Malaysia), PSAK (Indonesia)',
      aiSuggestion: 'Document applicable local accounting standards',
      required: true,
    },
    {
      id: 'local_shariah_authority',
      label: 'Local Shariah Authority',
      type: 'text',
      placeholder: 'Name of local Shariah authority',
      aiSuggestion: 'e.g., SAC Malaysia, Indonesian National Shariah Board',
      required: true,
    },
  ],
  compatibleJurisdictions: ['malaysia_sc', 'uae_dfsa', 'luxembourg'], // Not Saudi (requires AAOIFI)
  compatibleStructures: undefined, // Compatible with all structures
  websiteUrl: undefined,
  icon: 'Map',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ============================================================================
// ALL ACCOUNTING FRAMEWORKS ARRAY
// ============================================================================

export const ALL_ACCOUNTING_FRAMEWORKS: AccountingFramework[] = [
  AAOIFI,
  IFRS_ISLAMIC,
  LOCAL_GAAP,
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get accounting framework by ID
 */
export function getAccountingFrameworkById(id: string): AccountingFramework | undefined {
  return ALL_ACCOUNTING_FRAMEWORKS.find((a) => a.id === id)
}

/**
 * Get frameworks compatible with specific jurisdiction
 */
export function getFrameworksForJurisdiction(jurisdictionId: string): AccountingFramework[] {
  return ALL_ACCOUNTING_FRAMEWORKS.filter((f) => f.compatibleJurisdictions.includes(jurisdictionId))
}

/**
 * Get mandatory framework for jurisdiction (if any)
 */
export function getMandatoryFramework(jurisdictionId: string): AccountingFramework | undefined {
  // Saudi CMA requires AAOIFI
  if (jurisdictionId === 'saudi_cma') {
    return AAOIFI
  }
  // Others don't have mandatory frameworks
  return undefined
}
