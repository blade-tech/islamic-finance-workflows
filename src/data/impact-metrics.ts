/**
 * IMPACT METRICS DATA
 * ====================
 * ESG, sustainability, and social impact frameworks for Islamic finance (Component 4 of modular architecture).
 *
 * IMPACT CATEGORIES:
 * 1. Environmental - Green Sukuk (ICMA), QFC Sustainable, Climate Bonds Initiative Certification
 * 2. Social - SDG-Linked Sukuk, Islamic Social Finance (Zakat, Waqf, Sadaqah, Qard Hassan)
 * 3. Governance - ESG Framework, VBI Malaysia (Value-Based Intermediation)
 * 4. None - No specific impact metrics
 *
 * TOTAL FRAMEWORKS: 8 (7 impact frameworks + 1 "None" option)
 *
 * MULTI-SELECT CAPABLE: Users can combine frameworks (e.g., Green Sukuk + CBI Certification, ESG + VBI Malaysia)
 *
 * COMPLIANCE FOCUS:
 * - Reporting requirements
 * - Certification needs
 * - Use of proceeds restrictions
 * - Impact measurement
 * - Maqasid al-Shariah alignment (VBI, Islamic Social Finance)
 */

import type { ImpactMetrics, FormField } from '@/lib/types'

// ============================================================================
// IMPACT METRICS FRAMEWORKS
// ============================================================================

/**
 * 1. GREEN SUKUK (ICMA Green Bond Principles)
 * Category: Environmental
 * Focus: Climate and environmental projects
 */
export const GREEN_SUKUK: ImpactMetrics = {
  id: 'green_sukuk',
  name: 'Green Sukuk (ICMA GBP)',
  category: 'environmental',
  description: 'Sukuk aligned with ICMA Green Bond Principles. Proceeds used exclusively for environmentally beneficial projects.',
  framework: 'International Capital Market Association (ICMA) Green Bond Principles',
  reportingRequirements: [
    'Annual Green Bond Impact Report',
    'Use of proceeds tracking and disclosure',
    'Environmental impact metrics (CO2 reduction, energy saved, etc.)',
    'Third-party verification of green credentials',
    'Alignment with EU Taxonomy (if applicable)',
  ],
  certificationRequired: true,
  certifiers: [
    'Second-party opinion providers (e.g., Sustainalytics, Vigeo Eiris)',
    'Climate Bonds Initiative (CBI) certification',
    'ICMA Green Bond Principles verification',
  ],
  additionalFields: [
    {
      id: 'green_project_category',
      label: 'Green Project Category',
      type: 'select',
      options: [
        'Renewable Energy (Solar, Wind, Hydro)',
        'Energy Efficiency',
        'Clean Transportation',
        'Sustainable Water Management',
        'Green Buildings',
        'Climate Change Adaptation',
      ],
      aiSuggestion: 'Renewable Energy (most common for Green Sukuk)',
      required: true,
    },
    {
      id: 'environmental_kpis',
      label: 'Key Environmental Performance Indicators',
      type: 'text',
      placeholder: 'e.g., CO2 emissions reduced, MW renewable capacity added',
      aiSuggestion: 'Quantifiable environmental metrics for annual reporting',
      required: true,
    },
    {
      id: 'second_party_opinion',
      label: 'Second-Party Opinion Provider',
      type: 'select',
      options: ['Sustainalytics', 'Vigeo Eiris', 'ISS ESG', 'CICERO', 'Other'],
      aiSuggestion: 'Sustainalytics (leading provider for Islamic green bonds)',
      required: true,
    },
    {
      id: 'cbi_certification',
      label: 'Climate Bonds Initiative Certification',
      type: 'select',
      options: ['Yes - seeking certification', 'No - not pursuing', 'Already certified'],
      aiSuggestion: 'Consider CBI certification for credibility',
      required: false,
    },
  ],
  examples: [
    'Malaysia Sustainable Energy Development Authority (SEDA) Green Sukuk - $165M',
    'Indonesia Green Sukuk - $1.25B (2018)',
    'Dubai Islamic Bank Green Sukuk - $500M',
  ],
  useCases: [
    'Solar and wind farm financing',
    'Green building construction',
    'Public transit infrastructure',
    'Water treatment facilities',
  ],
  icon: 'Leaf',
  websiteUrl: 'https://www.icmagroup.org/sustainable-finance/the-principles-guidelines-and-handbooks/green-bond-principles-gbp/',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 2. SDG-LINKED SUKUK (UN Sustainable Development Goals)
 * Category: Social + Environmental
 * Focus: Alignment with UN SDGs
 */
export const SDG_SUKUK: ImpactMetrics = {
  id: 'sdg_sukuk',
  name: 'SDG-Linked Sukuk',
  category: 'social',
  description: 'Sukuk proceeds aligned with specific UN Sustainable Development Goals. Broader than green - includes social and governance objectives.',
  framework: 'United Nations Sustainable Development Goals (17 Goals)',
  reportingRequirements: [
    'Annual SDG Impact Report',
    'SDG alignment statement',
    'Progress metrics for each targeted SDG',
    'Independent verification of SDG contribution',
  ],
  certificationRequired: false, // Voluntary verification
  certifiers: [
    'UN-affiliated SDG verification bodies',
    'Independent ESG rating agencies',
    'Third-party SDG consultants',
  ],
  additionalFields: [
    {
      id: 'targeted_sdgs',
      label: 'Targeted SDGs',
      type: 'text',
      placeholder: 'e.g., SDG 7 (Clean Energy), SDG 11 (Sustainable Cities)',
      aiSuggestion: 'Select 2-4 SDGs that align with use of proceeds',
      required: true,
    },
    {
      id: 'sdg_impact_metrics',
      label: 'SDG Impact Metrics',
      type: 'text',
      placeholder: 'Quantifiable metrics for SDG contribution',
      aiSuggestion: 'Number of people impacted, infrastructure built, etc.',
      required: true,
    },
    {
      id: 'sdg_verification',
      label: 'SDG Alignment Verification',
      type: 'select',
      options: ['Third-party verified', 'Self-assessed', 'Not verified'],
      aiSuggestion: 'Third-party verification adds credibility',
      required: true,
    },
  ],
  examples: [
    'Indonesia SDG Sukuk - targeting SDG 4 (Education), SDG 9 (Infrastructure)',
    'Islamic Development Bank SDG Sukuk',
  ],
  useCases: [
    'Education infrastructure (SDG 4)',
    'Healthcare facilities (SDG 3)',
    'Affordable housing (SDG 11)',
    'Clean water access (SDG 6)',
  ],
  icon: 'Target',
  websiteUrl: 'https://sdgs.un.org/',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 3. ESG FRAMEWORK (Comprehensive ESG)
 * Category: Governance
 * Focus: Environmental, Social, and Governance criteria
 */
export const ESG_FRAMEWORK: ImpactMetrics = {
  id: 'esg_framework',
  name: 'ESG Framework',
  category: 'governance',
  description: 'Comprehensive Environmental, Social, and Governance framework. Broader than green/social - includes corporate governance.',
  framework: 'ESG Rating Agencies (MSCI, Sustainalytics, etc.)',
  reportingRequirements: [
    'Annual ESG Report',
    'ESG rating disclosure (if rated)',
    'Environmental performance metrics',
    'Social impact metrics',
    'Governance structure disclosure',
    'Sustainability accounting (e.g., GRI, SASB)',
  ],
  certificationRequired: false, // ESG ratings voluntary
  certifiers: [
    'MSCI ESG Ratings',
    'Sustainalytics ESG Risk Rating',
    'S&P Global ESG Scores',
    'Refinitiv ESG Scores',
  ],
  additionalFields: [
    {
      id: 'esg_priorities',
      label: 'ESG Priorities',
      type: 'text',
      placeholder: 'E.g., Carbon neutrality, diversity, board independence',
      aiSuggestion: 'Highlight key ESG focus areas',
      required: true,
    },
    {
      id: 'esg_rating_agency',
      label: 'ESG Rating Agency',
      type: 'select',
      options: ['MSCI', 'Sustainalytics', 'S&P Global', 'Refinitiv', 'Not rated'],
      aiSuggestion: 'Consider obtaining ESG rating for transparency',
      required: false,
    },
    {
      id: 'sustainability_framework',
      label: 'Sustainability Reporting Framework',
      type: 'select',
      options: ['GRI (Global Reporting Initiative)', 'SASB (Sustainability Accounting Standards Board)', 'TCFD (Climate-related Financial Disclosures)', 'None'],
      aiSuggestion: 'GRI (most widely used)',
      required: false,
    },
  ],
  examples: [
    'Sovereign ESG Sukuk (multiple countries)',
    'Corporate ESG Sukuk from Islamic banks',
  ],
  useCases: [
    'General corporate financing with ESG focus',
    'Diversified infrastructure projects',
    'Sustainable business operations',
  ],
  icon: 'BarChart3',
  websiteUrl: undefined,
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 4. QFC SUSTAINABLE SUKUK FRAMEWORK (Qatar Financial Centre)
 * Category: Environmental + Social
 * Focus: Comprehensive sustainability framework for Qatar market
 */
export const QFC_SUSTAINABLE: ImpactMetrics = {
  id: 'qfc_sustainable',
  name: 'QFC Sustainable Sukuk Framework',
  category: 'environmental',
  description: 'Qatar Financial Centre Sustainable Sukuk Framework - first comprehensive sustainability framework in the GCC region. Based on ICMA principles and aligned with Qatar National Vision 2030.',
  framework: 'QFC Sustainable Sukuk and Bonds Framework (based on ICMA GBP/SBP/SBG 2021)',
  reportingRequirements: [
    'Annual sustainability impact report',
    'Use of proceeds tracking and allocation report',
    'Environmental and/or social impact metrics',
    'Third-party verification of sustainability credentials',
    'Alignment with Qatar National Vision 2030 reporting',
    'QCB Third Financial Sector Strategy compliance',
  ],
  certificationRequired: true,
  certifiers: [
    'QFC Regulatory Authority',
    'ICMA-recognized second-party opinion providers',
    'Independent ESG verification agencies',
    'Qatar Central Bank (for bank issuers)',
  ],
  additionalFields: [
    {
      id: 'qfc_pillar_compliance',
      label: 'QFC Framework Pillars Compliance',
      type: 'text',
      placeholder: 'Confirm compliance with all 5 pillars',
      aiSuggestion: 'Must address: 1) Framework establishment, 2) Use of proceeds, 3) Project evaluation, 4) Proceeds management, 5) Reporting',
      required: true,
    },
    {
      id: 'sustainability_category',
      label: 'Sustainability Category',
      type: 'select',
      options: ['Green', 'Social', 'Sustainability (Green + Social)'],
      aiSuggestion: 'Sustainability (Green + Social) for bank financing like QIIB Oryx',
      required: true,
    },
    {
      id: 'eligible_project_category',
      label: 'Eligible Project Categories',
      type: 'select',
      options: [
        'Climate Change Mitigation/Adaptation',
        'Pollution Prevention and Control',
        'Renewable Energy',
        'Sustainable Water and Wastewater Management',
        'Energy Efficiency',
        'Clean Transportation',
        'Sustainable Infrastructure',
        'Social Projects (Healthcare, Education)',
      ],
      aiSuggestion: 'Select primary use of proceeds category',
      required: true,
    },
    {
      id: 'qnv_2030_pillar',
      label: 'Qatar National Vision 2030 Pillar',
      type: 'select',
      options: [
        'Economic Development',
        'Social Development',
        'Human Development',
        'Environmental Development',
      ],
      aiSuggestion: 'Environmental Development for green/sustainability Sukuk',
      required: true,
    },
    {
      id: 'qcb_strategy_alignment',
      label: 'QCB Third Financial Sector Strategy Alignment',
      type: 'select',
      options: ['Aligned', 'Partially Aligned', 'Not Applicable'],
      aiSuggestion: 'Aligned (required for bank issuers like QIIB)',
      required: true,
    },
    {
      id: 'second_party_opinion',
      label: 'Second-Party Opinion Provider',
      type: 'select',
      options: ['Sustainalytics', 'Vigeo Eiris', 'ISS ESG', 'CICERO', 'Other ICMA-recognized provider'],
      aiSuggestion: 'Required for QFC framework compliance',
      required: true,
    },
  ],
  examples: [
    'QIIB US$500M Sustainability Oryx Sukuk (January 2024) - first Qatari bank sustainability Sukuk',
    'QIIB US$250M Sustainability Tap Sukuk (July 2024)',
  ],
  useCases: [
    'Bank sustainability financing (QIIB model)',
    'Corporate green/social project financing',
    'Infrastructure development aligned with Qatar National Vision 2030',
    'Renewable energy projects in Qatar',
    'Social infrastructure (healthcare, education)',
  ],
  icon: 'Award',
  websiteUrl: 'https://www.qfc.qa',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 5. VBI (VALUE-BASED INTERMEDIATION) - Malaysia
 * Category: Governance
 * Focus: Triple bottom line (People, Planet, Profit) for Islamic banking
 */
export const VBI_MALAYSIA: ImpactMetrics = {
  id: 'vbi_malaysia',
  name: 'VBI (Value-Based Intermediation) Malaysia',
  category: 'governance',
  description: 'Bank Negara Malaysia\'s Value-Based Intermediation framework launched in 2017. Encourages Islamic financial institutions to deliver practices and offerings that generate positive and sustainable impact on economy, community, and environment, aligned with maqasid al-Shariah (higher objectives of Islamic law).',
  framework: 'Bank Negara Malaysia VBI Strategy Paper (2017) & VBI Financing and Investment Impact Assessment Framework',
  reportingRequirements: [
    'VBI Scorecard reporting (economic, community, environment dimensions)',
    'Triple bottom line impact assessment (People, Planet, Profit)',
    'Annual VBI implementation progress report',
    'Maqasid al-Shariah alignment statement',
    'Sustainable returns and long-term stakeholder interests disclosure',
  ],
  certificationRequired: false, // Voluntary adoption
  certifiers: [
    'VBI Community of Practitioners (CoP) peer review',
    'Bank Negara Malaysia supervisory assessment',
    'Independent ESG rating agencies',
  ],
  additionalFields: [
    {
      id: 'vbi_dimension_focus',
      label: 'VBI Dimension Focus',
      type: 'select',
      options: [
        'Economic Development (entrepreneurship, job creation)',
        'Community Development (education, healthcare, affordable housing)',
        'Environmental Development (green projects, climate resilience)',
        'Holistic (all three dimensions)',
      ],
      aiSuggestion: 'Holistic approach recommended for comprehensive VBI compliance',
      required: true,
    },
    {
      id: 'maqasid_alignment',
      label: 'Maqasid al-Shariah Alignment',
      type: 'text',
      placeholder: 'E.g., Protection of life, intellect, progeny, wealth, environment',
      aiSuggestion: 'Demonstrate how financing aligns with higher objectives of Shariah',
      required: true,
    },
    {
      id: 'vbi_cop_member',
      label: 'VBI Community of Practitioners Membership',
      type: 'select',
      options: ['Yes - active member', 'No - but following VBI principles', 'Seeking membership'],
      aiSuggestion: 'VBI CoP membership provides guidance and best practices',
      required: false,
    },
    {
      id: 'vbi_scorecard_metrics',
      label: 'VBI Scorecard Metrics',
      type: 'text',
      placeholder: 'Quantifiable metrics for economic, community, and environmental impact',
      aiSuggestion: 'Jobs created, people served, CO2 reduced, etc.',
      required: true,
    },
  ],
  examples: [
    'Malaysian Islamic banks implementing VBI strategies (Bank Islam, Maybank Islamic, CIMB Islamic)',
    'VBI-aligned SME financing with social impact',
    'Affordable housing financing under VBI framework',
  ],
  useCases: [
    'Islamic banking business model transformation',
    'SME financing with social impact',
    'Affordable housing and community development',
    'Green and sustainable financing',
    'Financial inclusion initiatives',
  ],
  icon: 'Handshake',
  websiteUrl: 'https://www.bnm.gov.my/-/value-based-intermediation',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 6. ISLAMIC SOCIAL FINANCE (Zakat, Waqf, Sadaqah, Qard Hassan)
 * Category: Social
 * Focus: Poverty alleviation, social welfare, financial inclusion
 */
export const ISLAMIC_SOCIAL_FINANCE: ImpactMetrics = {
  id: 'islamic_social_finance',
  name: 'Islamic Social Finance Framework',
  category: 'social',
  description: 'Integrated Islamic social finance framework utilizing Zakat (obligatory charity), Waqf (endowment), Sadaqah (voluntary charity), and Qard Hassan (benevolent loans) to address poverty, inequality, and social welfare. Rooted in Islamic principles of wealth distribution and community support.',
  framework: 'Integrated Islamic Social Finance Model (Zakat, Waqf, Sadaqah, Qard Hassan)',
  reportingRequirements: [
    'Social impact metrics (beneficiaries served, poverty alleviation outcomes)',
    'Fund allocation transparency (Zakat, Waqf, Sadaqah, Qard Hassan)',
    'Shariah compliance verification for all instruments',
    'Community well-being and SDG alignment reporting',
    'Governance framework for social finance ecosystem',
  ],
  certificationRequired: false, // Varies by jurisdiction
  certifiers: [
    'National Zakat boards and authorities',
    'Waqf regulatory bodies',
    'Shariah advisory boards',
    'Islamic Development Bank verification',
  ],
  additionalFields: [
    {
      id: 'isf_instruments',
      label: 'Islamic Social Finance Instruments',
      type: 'select',
      options: [
        'Zakat (obligatory charity - 2.5% of wealth)',
        'Waqf (charitable endowment)',
        'Sadaqah (voluntary charity)',
        'Qard Hassan (interest-free benevolent loan)',
        'Integrated (multiple instruments)',
      ],
      aiSuggestion: 'Integrated approach leverages strengths of all instruments',
      required: true,
    },
    {
      id: 'target_beneficiaries',
      label: 'Target Beneficiary Groups',
      type: 'text',
      placeholder: 'E.g., Poor and needy (Zakat), students (Waqf), refugees, disaster victims',
      aiSuggestion: 'Identify specific vulnerable communities to support',
      required: true,
    },
    {
      id: 'social_impact_sdgs',
      label: 'Aligned UN SDGs',
      type: 'text',
      placeholder: 'E.g., SDG 1 (No Poverty), SDG 2 (Zero Hunger), SDG 3 (Good Health)',
      aiSuggestion: 'Islamic social finance naturally aligns with SDGs 1, 2, 3, 4, 10',
      required: true,
    },
    {
      id: 'governance_structure',
      label: 'Social Finance Governance Structure',
      type: 'select',
      options: [
        'National Zakat authority',
        'Waqf foundation/board',
        'Islamic charity organization',
        'Integrated ISF institution',
      ],
      aiSuggestion: 'Strong governance ensures effective fund management and distribution',
      required: true,
    },
  ],
  examples: [
    'Malaysia Zakat for poverty alleviation and education',
    'Singapore Waqf Fund for social infrastructure',
    'Indonesia Waqf-based microfinance for entrepreneurs',
    'Qard Hassan housing schemes in Middle East',
  ],
  useCases: [
    'Poverty alleviation and basic needs support',
    'Education funding (scholarships, schools)',
    'Healthcare services for underprivileged',
    'Affordable housing (Qard Hassan loans)',
    'Microfinance and entrepreneurship',
    'Disaster relief and refugee support',
  ],
  icon: 'Heart',
  websiteUrl: undefined,
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 7. CLIMATE BONDS INITIATIVE (CBI) CERTIFICATION
 * Category: Environmental
 * Focus: Paris Agreement aligned certification with science-based criteria
 */
export const CBI_CERTIFICATION: ImpactMetrics = {
  id: 'cbi_certification',
  name: 'Climate Bonds Initiative Certification',
  category: 'environmental',
  description: 'Independent certification confirming debt instruments, assets, or entities meet Paris Agreement goals (1.5°C limit) using science-based Climate Bonds Standard and Sector Criteria. Provides highest level of climate integrity assurance with independent verification.',
  framework: 'Climate Bonds Standard v4.2 (ICMA-aligned) with Science-Based Sector Criteria',
  reportingRequirements: [
    'Pre-issuance certification report (Approved Verifier)',
    'Post-issuance annual certification reporting',
    'Sector-specific technical criteria compliance',
    'Use of proceeds allocation and impact reporting',
    'Independent verification by CBI Approved Verifier',
    'Climate Bonds Standard Board oversight compliance',
  ],
  certificationRequired: true, // Core feature of CBI
  certifiers: [
    'Climate Bonds Approved Verifiers (network of independent assessors)',
    'Sustainalytics',
    'KPMG',
    'DNV',
    'Other CBI-approved verification agencies',
  ],
  additionalFields: [
    {
      id: 'certification_type',
      label: 'CBI Certification Type',
      type: 'select',
      options: [
        'Use of Proceeds (debt instrument)',
        'Assets (specific projects/assets)',
        'Entity (non-financial legal entity)',
      ],
      aiSuggestion: 'Use of Proceeds most common for Sukuk issuance',
      required: true,
    },
    {
      id: 'sector_criteria',
      label: 'Applicable Sector Criteria',
      type: 'select',
      options: [
        'Renewable Energy (Solar, Wind, Geothermal)',
        'Low Carbon Buildings',
        'Low Carbon Transport',
        'Water Infrastructure',
        'Land Use and Marine Resources',
        'Waste and Pollution Control',
        'Industry (low-carbon processes)',
      ],
      aiSuggestion: 'Select sector matching use of proceeds',
      required: true,
    },
    {
      id: 'approved_verifier',
      label: 'CBI Approved Verifier',
      type: 'select',
      options: ['Sustainalytics', 'KPMG', 'DNV', 'EY', 'Other Approved Verifier'],
      aiSuggestion: 'Choose from CBI Approved Verifier network',
      required: true,
    },
    {
      id: 'paris_alignment',
      label: 'Paris Agreement Alignment Pathway',
      type: 'select',
      options: [
        '1.5°C pathway (net-zero by 2050)',
        'Well below 2°C pathway',
      ],
      aiSuggestion: '1.5°C pathway recommended for highest climate integrity',
      required: true,
    },
    {
      id: 'green_sukuk_integration',
      label: 'Green Sukuk Integration',
      type: 'select',
      options: [
        'Yes - combining CBI certification with ICMA Green Bond Principles',
        'No - standalone CBI certification',
      ],
      aiSuggestion: 'Integration provides dual recognition (ICMA + CBI)',
      required: false,
    },
  ],
  examples: [
    'Certified Green Sukuk from sovereigns and corporates',
    'Renewable energy project bonds with CBI certification',
    'Green building bonds certified under CBI Buildings Criteria',
    'Transport infrastructure bonds (low-carbon transit)',
  ],
  useCases: [
    'Green Sukuk with independent climate integrity assurance',
    'Renewable energy project financing',
    'Low-carbon buildings and infrastructure',
    'Clean transportation systems',
    'Water and waste management infrastructure',
  ],
  icon: 'ShieldCheck',
  websiteUrl: 'https://www.climatebonds.net',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * 8. NONE (No specific impact metrics)
 * Category: None
 * Focus: Conventional Sukuk without impact focus
 */
export const NO_IMPACT: ImpactMetrics = {
  id: 'none',
  name: 'No Impact Metrics',
  category: 'none',
  description: 'Conventional Sukuk without specific impact/ESG focus. Proceeds used for general corporate purposes or non-impact projects.',
  framework: undefined,
  reportingRequirements: [
    'Standard financial reporting only',
    'Use of proceeds disclosure (general)',
  ],
  certificationRequired: false,
  certifiers: undefined,
  additionalFields: [],
  examples: [
    'General corporate Sukuk',
    'Working capital Sukuk',
    'Refinancing Sukuk',
  ],
  useCases: [
    'General corporate financing',
    'Debt refinancing',
    'Working capital',
    'Non-impact-specific projects',
  ],
  icon: 'CircleDashed',
  websiteUrl: undefined,
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ============================================================================
// ALL IMPACT METRICS ARRAY
// ============================================================================

export const ALL_IMPACT_METRICS: ImpactMetrics[] = [
  GREEN_SUKUK,
  SDG_SUKUK,
  ESG_FRAMEWORK,
  QFC_SUSTAINABLE,
  VBI_MALAYSIA,
  ISLAMIC_SOCIAL_FINANCE,
  CBI_CERTIFICATION,
  NO_IMPACT,
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get impact metrics by ID
 */
export function getImpactMetricsById(id: string): ImpactMetrics | undefined {
  return ALL_IMPACT_METRICS.find((i) => i.id === id)
}

/**
 * Get impact metrics by category
 */
export function getImpactMetricsByCategory(category: 'environmental' | 'social' | 'governance' | 'none'): ImpactMetrics[] {
  return ALL_IMPACT_METRICS.filter((i) => i.category === category)
}

/**
 * Get impact metrics requiring certification
 */
export function getCertifiedImpactMetrics(): ImpactMetrics[] {
  return ALL_IMPACT_METRICS.filter((i) => i.certificationRequired)
}
