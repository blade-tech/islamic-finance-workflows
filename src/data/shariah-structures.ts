/**
 * SHARIAH STRUCTURES DATA
 * =======================
 * Islamic finance CONTRACT TYPES (Component 1 of modular architecture).
 *
 * These are contract mechanisms that can be used for:
 * - Sukuk (Islamic bonds)
 * - Trade financing
 * - Project financing
 * - Partnerships and joint ventures
 * - Leasing arrangements
 * - And other Islamic finance products
 *
 * CONTRACT CLASSIFICATIONS:
 * 1. Lease (Ijara) - Rental/leasing contracts
 * 2. Sale (Murabaha, Salam, Istisna'a) - Purchase/sale contracts
 * 3. Partnership (Musharaka, Mudaraba) - Profit-sharing arrangements
 * 4. Agency (Wakala) - Representative/agent arrangements
 * 5. Hybrid - Combinations of above
 *
 * NOTE: Takaful (Islamic insurance) is handled separately as an optional overlay
 *
 * DATA SOURCE:
 * - AAOIFI Shariah Standards
 * - IIFM standards
 * - Real-world Islamic finance practices
 */

import type { ShariahStructure, FormField } from '@/lib/types'

// ============================================================================
// LEASE-BASED CONTRACTS
// ============================================================================

/**
 * 1. IJARA (Islamic Lease Contract)
 * Market share: 60% of Sukuk market when used for Sukuk
 * Use case: Leasing, Sukuk, real estate, infrastructure, equipment financing
 */
export const IJARA: ShariahStructure = {
  id: 'ijara',
  name: 'Ijara',
  category: 'lease',
  subCategory: 'operating-lease',
  description: 'Islamic lease contract where lessor retains ownership of asset while lessee pays rental. Can be used for Sukuk, equipment leasing, real estate, or infrastructure financing.',
  useCases: [
    'Ijara Sukuk (lease-based Islamic bonds)',
    'Real estate leasing and development',
    'Infrastructure projects (airports, seaports, toll roads)',
    'Equipment financing (aircraft, ships, machinery)',
    'Green energy facilities (solar farms, wind turbines)',
  ],
  marketShare: 60,
  requiredRoles: ['Shariah Advisory Board', 'SPO Provider', 'Trustee', 'Asset Manager', 'Issuer'],
  aaoifiStandards: ['AAOIFI Shariah Standard 62 (Sukuk)', 'AAOIFI FAS 33 - Investment Sukuk'],
  iifmStandards: ['IIFM Sukuk Standards'],
  baseFields: [
    {
      id: 'issuer_name',
      label: 'Issuer Name',
      type: 'text',
      placeholder: 'e.g., Qatar International Islamic Bank',
      aiSuggestion: 'Qatar International Islamic Bank',
      required: true,
    },
    {
      id: 'asset_type',
      label: 'Underlying Asset Type',
      type: 'select',
      options: ['Real Estate', 'Infrastructure', 'Equipment', 'Aircraft', 'Green Energy Facilities'],
      aiSuggestion: 'For Ijara: Real Estate or Infrastructure most common',
      required: true,
    },
    {
      id: 'asset_value',
      label: 'Asset Value (USD)',
      type: 'number',
      placeholder: '500,000,000',
      aiSuggestion: 'Should match Sukuk issue amount (typical: $100M-$500M)',
      required: true,
    },
    {
      id: 'issue_amount',
      label: 'Sukuk Issue Amount (USD)',
      type: 'number',
      placeholder: '500,000,000',
      aiSuggestion: '$500M (QIIB Orix Green Sukuk reference)',
      required: true,
    },
    {
      id: 'rental_rate',
      label: 'Expected Rental Return Rate (%)',
      type: 'number',
      placeholder: '5.25',
      aiSuggestion: '5.25% (market competitive rate)',
      required: true,
    },
    {
      id: 'tenure',
      label: 'Tenure (years)',
      type: 'select',
      options: ['3', '5', '7', '10'],
      aiSuggestion: '5 years (most common)',
      required: true,
    },
  ],
  icon: 'Building2',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 2. MURABAHA (Islamic Cost-Plus Sale Contract)
 * Market share: 15% of Sukuk market when used for Sukuk
 * Use case: Cost-plus financing, trade finance, commodity purchases, working capital
 */
export const MURABAHA: ShariahStructure = {
  id: 'murabaha',
  name: 'Murabaha',
  category: 'sale',
  subCategory: 'cost-plus-sale',
  description: 'Islamic cost-plus sale contract where seller discloses cost and adds agreed profit margin. Can be used for Sukuk, trade finance, or commodity procurement.',
  useCases: [
    'Murabaha Sukuk (cost-plus sale Islamic bonds)',
    'Trade finance and working capital',
    'Commodity procurement',
    'Short-term liquidity management',
  ],
  marketShare: 15,
  requiredRoles: ['Shariah Advisory Board', 'Commodity Agent', 'Issuer'],
  aaoifiStandards: ['AAOIFI Shariah Standard 62 (Sukuk)', 'AAOIFI Shariah Standard 8 (Murabaha)'],
  iifmStandards: ['IIFM Murabaha Standards'],
  baseFields: [
    {
      id: 'issuer_name',
      label: 'Issuer Name',
      type: 'text',
      placeholder: 'e.g., Dubai Islamic Bank',
      aiSuggestion: 'Dubai Islamic Bank',
      required: true,
    },
    {
      id: 'commodity_type',
      label: 'Underlying Commodity',
      type: 'select',
      options: ['Metals', 'Energy (Oil/Gas)', 'Agricultural Products', 'Other'],
      aiSuggestion: 'Metals most common for Murabaha Sukuk',
      required: true,
    },
    {
      id: 'purchase_cost',
      label: 'Commodity Purchase Cost (USD)',
      type: 'number',
      placeholder: '100,000,000',
      aiSuggestion: "Bank's purchase cost",
      required: true,
    },
    {
      id: 'sale_price',
      label: 'Sale Price to Customer (USD)',
      type: 'number',
      placeholder: '110,000,000',
      aiSuggestion: 'Purchase cost + profit margin (typically 8-15%)',
      required: true,
    },
    {
      id: 'profit_rate',
      label: 'Profit Margin (%)',
      type: 'number',
      placeholder: '10',
      aiSuggestion: '10% (typical range: 8-15%)',
      required: true,
    },
    {
      id: 'tenure',
      label: 'Tenure (months)',
      type: 'select',
      options: ['6', '12', '18', '24'],
      aiSuggestion: '12 months (Murabaha Sukuk typically shorter tenure)',
      required: true,
    },
  ],
  icon: 'TrendingUp',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 3. MUSHARAKA (Islamic Partnership Contract)
 * Market share: 10% of Sukuk market when used for Sukuk
 * Use case: Joint ventures, equity partnerships, project finance, PPP
 */
export const MUSHARAKA: ShariahStructure = {
  id: 'musharaka',
  name: 'Musharaka',
  category: 'partnership',
  subCategory: 'equity-partnership',
  description: 'Islamic partnership contract where all partners contribute capital and share profits/losses. Can be used for Sukuk, joint ventures, or project financing.',
  useCases: [
    'Musharaka Sukuk (partnership-based Islamic bonds)',
    'Joint venture project financing',
    'Public-private partnerships (PPP)',
    'Mixed-use development projects',
  ],
  marketShare: 10,
  requiredRoles: ['Shariah Advisory Board', 'Managing Partner', 'Independent Auditor', 'Issuer'],
  aaoifiStandards: ['AAOIFI Shariah Standard 62 (Sukuk)', 'AAOIFI Shariah Standard 12 (Musharaka)'],
  iifmStandards: ['IIFM Musharaka Standards'],
  baseFields: [
    {
      id: 'issuer_name',
      label: 'Issuer Name',
      type: 'text',
      placeholder: 'e.g., Saudi British Bank',
      aiSuggestion: 'Saudi British Bank',
      required: true,
    },
    {
      id: 'project_name',
      label: 'Partnership Project Name',
      type: 'text',
      placeholder: 'e.g., Riyadh Metro Phase 2',
      aiSuggestion: 'Infrastructure or real estate project',
      required: true,
    },
    {
      id: 'total_capital',
      label: 'Total Partnership Capital (USD)',
      type: 'number',
      placeholder: '300,000,000',
      aiSuggestion: '$300M (typical Musharaka Sukuk size)',
      required: true,
    },
    {
      id: 'issuer_contribution',
      label: 'Issuer Capital Contribution (%)',
      type: 'number',
      placeholder: '30',
      aiSuggestion: '20-40% (issuer maintains management control)',
      required: true,
    },
    {
      id: 'profit_sharing_ratio',
      label: 'Profit Sharing Ratio (Investors %)',
      type: 'number',
      placeholder: '70',
      aiSuggestion: '60-80% (proportional to capital contribution)',
      required: true,
    },
    {
      id: 'tenure',
      label: 'Partnership Duration (years)',
      type: 'select',
      options: ['5', '7', '10', '15'],
      aiSuggestion: '7-10 years (project completion timeframe)',
      required: true,
    },
  ],
  icon: 'Users',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 4. MUDARABA (Islamic Profit-Sharing Contract)
 * Market share: 8% of Sukuk market when used for Sukuk
 * Use case: Investment funds, asset management, profit-sharing ventures
 */
export const MUDARABA: ShariahStructure = {
  id: 'mudaraba',
  name: 'Mudaraba',
  category: 'partnership',
  subCategory: 'profit-sharing',
  description: 'Islamic profit-sharing contract where capital provider (Rabb-ul-Mal) provides funds and entrepreneur (Mudarib) provides expertise. Can be used for Sukuk, investment funds, or asset management.',
  useCases: [
    'Mudaraba Sukuk (profit-sharing Islamic bonds)',
    'Islamic investment funds',
    'Asset management ventures',
    'Trade finance portfolios',
  ],
  marketShare: 8,
  requiredRoles: ['Shariah Advisory Board', 'Mudarib (Manager)', 'Independent Auditor', 'Rabb-ul-Mal (Investors)'],
  aaoifiStandards: ['AAOIFI Shariah Standard 62 (Sukuk)', 'AAOIFI Shariah Standard 13 (Mudaraba)'],
  iifmStandards: ['IIFM Mudaraba Standards'],
  baseFields: [
    {
      id: 'mudarib_name',
      label: 'Mudarib (Manager) Name',
      type: 'text',
      placeholder: 'e.g., Abu Dhabi Islamic Bank',
      aiSuggestion: 'Bank or asset manager with proven track record',
      required: true,
    },
    {
      id: 'capital_amount',
      label: 'Capital Provided by Investors (USD)',
      type: 'number',
      placeholder: '150,000,000',
      aiSuggestion: '$150M (typical Mudaraba fund size)',
      required: true,
    },
    {
      id: 'investment_strategy',
      label: 'Investment Strategy',
      type: 'select',
      options: ['Real Estate', 'Equities', 'Fixed Income Alternatives', 'Mixed Portfolio'],
      aiSuggestion: 'Mixed Portfolio (diversified Shariah-compliant investments)',
      required: true,
    },
    {
      id: 'profit_sharing_mudarib',
      label: 'Mudarib Profit Share (%)',
      type: 'number',
      placeholder: '20',
      aiSuggestion: '15-25% (mudarib keeps portion as performance fee)',
      required: true,
    },
    {
      id: 'profit_sharing_investors',
      label: 'Investors Profit Share (%)',
      type: 'number',
      placeholder: '80',
      aiSuggestion: '75-85% (capital providers receive majority)',
      required: true,
    },
    {
      id: 'tenure',
      label: 'Fund Duration (years)',
      type: 'select',
      options: ['3', '5', '7'],
      aiSuggestion: '5 years (standard Islamic fund tenure)',
      required: true,
    },
  ],
  icon: 'PieChart',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 5. ISTISNA'A (Islamic Manufacturing/Construction Sale Contract)
 * Market share: 5% of Sukuk market when used for Sukuk
 * Use case: Construction projects, manufacturing, shipbuilding
 */
export const ISTISNA: ShariahStructure = {
  id: 'istisna',
  name: 'Istisna\'a',
  category: 'sale',
  subCategory: 'manufacturing-sale',
  description: 'Islamic manufacturing/construction sale contract where buyer orders customized asset to be constructed or manufactured. Can be used for Sukuk, infrastructure projects, or manufacturing.',
  useCases: [
    'Istisna\'a Sukuk (construction-based Islamic bonds)',
    'Infrastructure construction',
    'Shipbuilding and aircraft manufacturing',
    'Industrial plant development',
  ],
  marketShare: 5,
  requiredRoles: ['Shariah Advisory Board', 'General Contractor', 'Project Engineer', 'Issuer'],
  aaoifiStandards: ['AAOIFI Shariah Standard 62 (Sukuk)', 'AAOIFI Shariah Standard 11 (Istisna)'],
  iifmStandards: ['IIFM Istisna Standards'],
  baseFields: [
    {
      id: 'issuer_name',
      label: 'Issuer Name',
      type: 'text',
      placeholder: 'e.g., Kuwait Finance House',
      aiSuggestion: 'Kuwait Finance House',
      required: true,
    },
    {
      id: 'project_type',
      label: 'Construction Project Type',
      type: 'select',
      options: ['Infrastructure', 'Industrial Facility', 'Shipbuilding', 'Aircraft', 'Real Estate'],
      aiSuggestion: 'Infrastructure (airports, bridges, highways)',
      required: true,
    },
    {
      id: 'contract_value',
      label: 'Construction Contract Value (USD)',
      type: 'number',
      placeholder: '200,000,000',
      aiSuggestion: '$200M (typical large-scale construction project)',
      required: true,
    },
    {
      id: 'construction_period',
      label: 'Construction Period (months)',
      type: 'number',
      placeholder: '36',
      aiSuggestion: '24-48 months (typical infrastructure projects)',
      required: true,
    },
    {
      id: 'delivery_date',
      label: 'Expected Delivery Date',
      type: 'date',
      aiSuggestion: 'Set delivery milestone for Istisna contract',
      required: true,
    },
    {
      id: 'profit_margin',
      label: 'Profit Margin on Construction (%)',
      type: 'number',
      placeholder: '12',
      aiSuggestion: '10-15% (construction profit)',
      required: true,
    },
  ],
  icon: 'Construction',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 6. SALAM (Islamic Forward Sale Contract)
 * Market share: 2% of Sukuk market when used for Sukuk
 * Use case: Agricultural financing, commodity trading, supply chain financing
 */
export const SALAM: ShariahStructure = {
  id: 'salam',
  name: 'Salam',
  category: 'sale',
  subCategory: 'forward-sale',
  description: 'Islamic forward sale contract where buyer pays in advance for commodities to be delivered at future date. Can be used for Sukuk, agricultural financing, or commodity trading.',
  useCases: [
    'Salam Sukuk (forward sale Islamic bonds)',
    'Agricultural crop financing',
    'Commodity forward contracts',
    'Supply chain pre-financing',
  ],
  marketShare: 2,
  requiredRoles: ['Shariah Advisory Board', 'Commodity Supplier', 'Quality Inspector', 'Issuer'],
  aaoifiStandards: ['AAOIFI Shariah Standard 62 (Sukuk)', 'AAOIFI Shariah Standard 10 (Salam)'],
  iifmStandards: ['IIFM Salam Standards'],
  baseFields: [
    {
      id: 'issuer_name',
      label: 'Issuer Name',
      type: 'text',
      placeholder: 'e.g., Bahrain Islamic Bank',
      aiSuggestion: 'Bahrain Islamic Bank',
      required: true,
    },
    {
      id: 'commodity_type',
      label: 'Forward Commodity Type',
      type: 'select',
      options: ['Agricultural (Wheat, Rice, Dates)', 'Metals', 'Energy', 'Other'],
      aiSuggestion: 'Agricultural commodities (most common for Salam)',
      required: true,
    },
    {
      id: 'advance_payment',
      label: 'Advance Payment (USD)',
      type: 'number',
      placeholder: '50,000,000',
      aiSuggestion: '$50M (Salam Sukuk typically smaller than other types)',
      required: true,
    },
    {
      id: 'commodity_quantity',
      label: 'Commodity Quantity',
      type: 'text',
      placeholder: 'e.g., 10,000 metric tons',
      aiSuggestion: 'Specify quantity and unit (e.g., metric tons, barrels)',
      required: true,
    },
    {
      id: 'delivery_date',
      label: 'Delivery Date',
      type: 'date',
      aiSuggestion: 'Future delivery date (typically 3-12 months)',
      required: true,
    },
    {
      id: 'expected_return',
      label: 'Expected Return Rate (%)',
      type: 'number',
      placeholder: '8',
      aiSuggestion: '6-10% (commodity price appreciation)',
      required: true,
    },
  ],
  icon: 'Wheat',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 7. WAKALA (Islamic Agency Contract)
 * Market share: 15-20% of Sukuk market when used for Sukuk (rapidly growing, especially for bank Sukuk)
 * Use case: Investment agency, bank financing, portfolio management
 */
export const WAKALA: ShariahStructure = {
  id: 'wakala',
  name: 'Wakala',
  category: 'agency',
  subCategory: 'investment-agency',
  description: 'Islamic agency contract where principal appoints agent (Wakil) to invest funds on their behalf in Shariah-compliant investments. Can be used for Sukuk, investment management, or corporate financing.',
  useCases: [
    'Wakala Sukuk (agency-based Islamic bonds)',
    'Bank corporate financing (e.g., QIIB Oryx Sustainability Sukuk)',
    'General investment portfolios',
    'Working capital and liquidity management',
    'Sustainability and green financing',
  ],
  marketShare: 18,
  requiredRoles: ['Shariah Advisory Board', 'Wakil (Investment Agent)', 'SPV Trustee', 'Issuer'],
  aaoifiStandards: ['AAOIFI Shariah Standard 62 (Sukuk)', 'AAOIFI Shariah Standard 23 (Wakalah)'],
  iifmStandards: ['IIFM Sukuk Standards', 'IIFM Wakalah Standards'],
  baseFields: [
    {
      id: 'issuer_name',
      label: 'Issuer Name',
      type: 'text',
      placeholder: 'e.g., Qatar International Islamic Bank',
      aiSuggestion: 'Qatar International Islamic Bank',
      required: true,
    },
    {
      id: 'spv_name',
      label: 'SPV/Trust Name',
      type: 'text',
      placeholder: 'e.g., QIIB Senior Oryx Ltd',
      aiSuggestion: 'Typically: [Issuer Name] + "Trust" or "Ltd"',
      required: true,
    },
    {
      id: 'spv_jurisdiction',
      label: 'SPV Jurisdiction',
      type: 'select',
      options: ['Cayman Islands', 'Jersey', 'British Virgin Islands', 'Delaware (USA)', 'Other'],
      aiSuggestion: 'Cayman Islands (most common for international Sukuk)',
      required: true,
    },
    {
      id: 'issue_amount',
      label: 'Sukuk Issue Amount (USD)',
      type: 'number',
      placeholder: '500,000,000',
      aiSuggestion: '$500M (QIIB Oryx reference)',
      required: true,
    },
    {
      id: 'wakil_fee',
      label: 'Wakil Management Fee (%)',
      type: 'number',
      placeholder: '0.25',
      aiSuggestion: '0.15-0.35% annual management fee',
      required: true,
    },
    {
      id: 'expected_return',
      label: 'Expected Return Rate (%)',
      type: 'number',
      placeholder: '5.25',
      aiSuggestion: '5.25% (QIIB Oryx yield)',
      required: true,
    },
    {
      id: 'investment_strategy',
      label: 'Investment Strategy',
      type: 'select',
      options: ['General Corporate Financing', 'Sustainability Projects', 'Real Estate Portfolio', 'Mixed Assets'],
      aiSuggestion: 'Sustainability Projects (for sustainability Sukuk)',
      required: true,
    },
    {
      id: 'tenure',
      label: 'Tenure (years)',
      type: 'select',
      options: ['3', '5', '7', '10'],
      aiSuggestion: '5 years (standard for bank Sukuk)',
      required: true,
    },
  ],
  icon: 'Handshake',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ============================================================================
// ALL SHARIAH STRUCTURES ARRAY
// ============================================================================

export const ALL_SHARIAH_STRUCTURES: ShariahStructure[] = [
  IJARA,
  MURABAHA,
  MUSHARAKA,
  MUDARABA,
  ISTISNA,
  SALAM,
  WAKALA,
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Shariah structure by ID
 */
export function getShariahStructureById(id: string): ShariahStructure | undefined {
  return ALL_SHARIAH_STRUCTURES.find((s) => s.id === id)
}

/**
 * Get structures by category (contract type)
 */
export function getStructuresByCategory(category: 'lease' | 'sale' | 'partnership' | 'agency' | 'hybrid'): ShariahStructure[] {
  return ALL_SHARIAH_STRUCTURES.filter((s) => s.category === category)
}

/**
 * Get sale-based structures (Murabaha, Salam, Istisna'a)
 */
export function getSaleStructures(): ShariahStructure[] {
  return ALL_SHARIAH_STRUCTURES.filter((s) => s.category === 'sale')
}

/**
 * Get partnership-based structures (Musharaka, Mudaraba)
 */
export function getPartnershipStructures(): ShariahStructure[] {
  return ALL_SHARIAH_STRUCTURES.filter((s) => s.category === 'partnership')
}
