/**
 * MOCK EVIDENCE
 * Evidence artifacts collected by agents from multiple sources
 * Demonstrates automated evidence gathering across integrations
 */

import { Evidence } from '@/lib/types'

export const mockEvidence: Evidence[] = [
  // DEAL-001: Green Sukuk Evidence
  {
    id: 'ev-001',
    controlId: 'SG-01',
    dealId: 'deal-001',
    name: 'SSB Fatwa - Green Sukuk Structure',
    type: 'document',
    source: 'SharePoint',
    url: '/evidence/ssb-fatwa-green-sukuk-2024.pdf',
    collectedBy: 'agent' as const,
    collectedAt: '2024-11-01T09:00:00Z',
    verified: true,
    lastVerified: '2024-11-01T09:00:00Z',
    hash: 'sha256:a1b2c3d4e5f6...',
    stale: false,
    selectiveDisclosureEnabled: true
  },
  {
    type: 'document',
    name: 'Asset Purchase Agreement (Solar Portfolio)',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/asset-purchase-solar-portfolio.pdf',
    hash: 'sha256:f1e2d3c4b5a6...',
    collectedAt: '2024-11-02T10:30:00Z',
    lastVerified: '2024-11-02T10:30:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'Shariah Approval VC - Hedera Mainnet',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.12345@1730462400.000',
    hash: 'hedera:mainnet:0.0.12345@1730462400.000',
    collectedAt: '2024-11-01T09:15:00Z',
    lastVerified: '2024-11-01T09:15:00Z'
  },
  {
    type: 'api_response',
    name: 'PEP Screening - Cayman Investor',
    verified: true,
    source: 'API',
    url: 'https://dowjones.com/risk-compliance/results/987654',
    collectedAt: '2024-11-04T13:15:00Z',
    lastVerified: '2024-11-04T13:15:00Z'
  },
  {
    type: 'document',
    name: 'UBO Declaration - Cayman Green Investment Fund',
    verified: true,
    source: 'Agent',
    url: '/evidence/ubo-cayman-investor.pdf',
    hash: 'sha256:1a2b3c4d5e6f...',
    collectedAt: '2024-11-05T09:00:00Z'
  },
  {
    type: 'document',
    name: 'Source of Funds Verification',
    verified: false,
    source: 'Manual',
    collectedAt: '2024-11-05T14:00:00Z'
  },
  {
    type: 'api_response',
    name: 'Bloomberg RoR Data (Q1-Q3 2024)',
    verified: false,
    source: 'API',
    url: 'https://bloomberg.com/data/sukuk-benchmarks',
    collectedAt: '2024-09-30T00:00:00Z',
    lastVerified: '2024-09-30T00:00:00Z'
  },
  {
    type: 'calculation',
    name: 'RoR Projection Model - Q4 2024',
    verified: false,
    source: 'Agent',
    url: '/evidence/ror-projection-q4-2024.xlsx',
    collectedAt: '2024-10-15T00:00:00Z'
  },
  {
    type: 'document',
    name: 'Comparable Sukuk Analysis',
    verified: true,
    source: 'Agent',
    url: '/evidence/comparable-sukuk-analysis.pdf',
    hash: 'sha256:9f8e7d6c5b4a...',
    collectedAt: '2024-11-05T09:00:00Z'
  },
  {
    type: 'document',
    name: 'Green Sukuk Framework',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/green-sukuk-framework.pdf',
    hash: 'sha256:7g8h9i0j1k2l...',
    collectedAt: '2024-10-20T00:00:00Z',
    lastVerified: '2024-10-20T00:00:00Z'
  },
  {
    type: 'api_response',
    name: 'Project KPI Data Feed - Solar Farm A',
    verified: true,
    source: 'API',
    url: 'https://projectapi.example.com/solar-farm-a/kpis',
    collectedAt: '2024-11-06T09:00:00Z',
    lastVerified: '2024-11-06T09:00:00Z'
  },
  {
    type: 'document',
    name: 'External Verifier Contract - Sustainalytics',
    verified: true,
    source: 'Agent',
    url: '/evidence/sustainalytics-contract-2024.pdf',
    hash: 'sha256:3m4n5o6p7q8r...',
    collectedAt: '2024-11-06T10:00:00Z'
  },
  {
    type: 'calculation',
    name: 'UoP Allocation Report - Q4 2024',
    verified: false,
    source: 'Agent',
    url: '/evidence/uop-allocation-q4-2024.xlsx',
    collectedAt: '2024-11-06T11:00:00Z'
  },

  // DEAL-002: Murabaha Evidence (Blocked Deal)
  {
    type: 'document',
    name: 'Commodity Purchase Agreement (Draft)',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/murabaha-purchase-agreement-draft.pdf',
    hash: 'sha256:def456...',
    collectedAt: '2024-10-29T14:00:00Z'
  },
  {
    type: 'document',
    name: 'Shariah Review Findings - Dr. Ahmed',
    verified: true,
    source: 'Manual',
    url: '/evidence/shariah-review-findings-deal-002.pdf',
    collectedAt: '2024-10-30T10:00:00Z'
  },
  {
    type: 'document',
    name: 'Warehouse Receipt',
    verified: false,
    source: 'Manual',
    collectedAt: '2024-10-30T12:00:00Z'
  },
  {
    type: 'api_response',
    name: 'OFAC SDN Search Result',
    verified: true,
    source: 'API',
    url: 'https://sanctionslistsearch.ofac.treas.gov/Details/12345678',
    collectedAt: '2024-11-02T15:00:00Z',
    lastVerified: '2024-11-02T15:00:00Z'
  },
  {
    type: 'document',
    name: 'Counterparty KYC Form',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/kyc-albaraka-2024.pdf',
    hash: 'sha256:abc123...',
    collectedAt: '2024-10-28T10:00:00Z'
  },
  {
    type: 'api_response',
    name: 'S&P Credit Rating - Al-Baraka Trading',
    verified: true,
    source: 'API',
    url: 'https://spglobal.com/ratings/entity/12345',
    collectedAt: '2024-11-01T09:00:00Z',
    lastVerified: '2024-11-01T09:00:00Z'
  },
  {
    type: 'document',
    name: 'Credit Policy (Internal)',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/credit-policy-2024.pdf',
    hash: 'sha256:5s6t7u8v9w0x...',
    collectedAt: '2024-11-01T09:30:00Z'
  },
  {
    type: 'calculation',
    name: 'Risk-Adjusted Capital Calculation',
    verified: true,
    source: 'Agent',
    url: '/evidence/risk-adjusted-capital-deal-002.xlsx',
    collectedAt: '2024-11-01T10:00:00Z'
  },
  {
    type: 'document',
    name: 'Commodity Valuation Report (Expired)',
    verified: false,
    source: 'S3',
    url: '/evidence/commodity-valuation-aug-2024.pdf',
    collectedAt: '2024-08-01T00:00:00Z',
    lastVerified: '2024-08-01T00:00:00Z'
  },
  {
    type: 'document',
    name: 'External Valuator Email - Nov 12 Delivery',
    verified: true,
    source: 'Agent',
    url: '/evidence/valuator-email-nov-12-delivery.pdf',
    collectedAt: '2024-11-03T14:00:00Z'
  },

  // DEAL-003: Ijara Evidence (Near Complete)
  {
    type: 'document',
    name: 'SSB Fatwa - Ijara Muntahia Bittamleek',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/ssb-fatwa-ijara-2024.pdf',
    hash: 'sha256:ijara123...',
    collectedAt: '2024-10-15T09:00:00Z',
    lastVerified: '2024-10-15T09:00:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'Shariah Approval VC - Hedera Mainnet',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.23456@1728990000.000',
    hash: 'hedera:mainnet:0.0.23456@1728990000.000',
    collectedAt: '2024-10-15T09:15:00Z',
    lastVerified: '2024-10-15T09:15:00Z'
  },
  {
    type: 'document',
    name: 'Aircraft Lease Agreement',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/aircraft-lease-agreement.pdf',
    hash: 'sha256:lease987...',
    collectedAt: '2024-10-16T11:00:00Z'
  },
  {
    type: 'document',
    name: 'Asset Ownership Certificate - Aircraft',
    verified: true,
    source: 'Agent',
    url: '/evidence/aircraft-ownership-cert.pdf',
    hash: 'sha256:own654...',
    collectedAt: '2024-10-17T14:00:00Z'
  },
  {
    type: 'document',
    name: 'Insurance Certificate - Aircraft Hull & Liability',
    verified: true,
    source: 'API',
    url: '/evidence/aircraft-insurance-cert.pdf',
    collectedAt: '2024-10-18T10:00:00Z',
    lastVerified: '2024-10-18T10:00:00Z'
  },
  {
    type: 'document',
    name: 'Investor KYC Package - Complete',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/investor-kyc-package-deal-003.pdf',
    hash: 'sha256:kyc321...',
    collectedAt: '2024-10-20T15:00:00Z'
  },
  {
    type: 'api_response',
    name: 'Sanctions Screening Results - All Clear',
    verified: true,
    source: 'API',
    url: 'https://dowjones.com/sanctions/results/deal-003',
    collectedAt: '2024-10-22T09:00:00Z',
    lastVerified: '2024-10-22T09:00:00Z'
  },
  {
    type: 'document',
    name: 'Trust Deed (Signed)',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/trust-deed-deal-003.pdf',
    hash: 'sha256:trust456...',
    collectedAt: '2024-10-17T00:00:00Z'
  },
  {
    type: 'document',
    name: 'Trustee Reminder Email (Sent)',
    verified: true,
    source: 'Agent',
    url: '/evidence/trustee-reminder-nov-5.pdf',
    collectedAt: '2024-11-05T10:00:00Z'
  },
  {
    type: 'document',
    name: 'Trustee Confirmation Response',
    verified: true,
    source: 'Agent',
    url: '/evidence/trustee-confirmation-nov-5.pdf',
    collectedAt: '2024-11-05T11:30:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'Shariah Review VC - Hedera Mainnet',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.34567@1729612800.000',
    hash: 'hedera:mainnet:0.0.34567@1729612800.000',
    collectedAt: '2024-10-25T11:00:00Z',
    lastVerified: '2024-10-25T11:00:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'Internal Audit Completion VC - Hedera',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.45678@1730822400.000',
    hash: 'hedera:mainnet:0.0.45678@1730822400.000',
    collectedAt: '2024-11-01T14:00:00Z',
    lastVerified: '2024-11-01T14:00:00Z'
  },

  // DEAL-004: Musharaka Evidence (Early Stage)
  {
    type: 'document',
    name: 'Product Structure Memo (Draft)',
    verified: false,
    source: 'Agent',
    url: '/evidence/musharaka-structure-memo-draft.pdf',
    collectedAt: '2024-11-07T09:30:00Z'
  },
  {
    type: 'document',
    name: 'Comparable Fatwa Analysis',
    verified: true,
    source: 'Agent',
    url: '/evidence/comparable-musharaka-fatwas.pdf',
    hash: 'sha256:comp789...',
    collectedAt: '2024-11-07T10:00:00Z'
  },
  {
    type: 'document',
    name: 'Profit-Loss Sharing Calculation',
    verified: false,
    source: 'Agent',
    url: '/evidence/pls-calculation-deal-004.xlsx',
    collectedAt: '2024-11-07T11:00:00Z'
  },
  {
    type: 'document',
    name: 'Real Estate Valuation Report',
    verified: true,
    source: 'Manual',
    url: '/evidence/real-estate-valuation-deal-004.pdf',
    hash: 'sha256:val321...',
    collectedAt: '2024-11-01T14:00:00Z'
  },

  // DEAL-005: Infrastructure Sukuk Evidence (Fully Complete)
  {
    type: 'document',
    name: 'SSB Fatwa - Infrastructure Sukuk',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/ssb-fatwa-infrastructure-2024.pdf',
    hash: 'sha256:infra123...',
    collectedAt: '2024-09-15T09:00:00Z',
    lastVerified: '2024-09-15T09:00:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'Shariah Approval VC - Hedera Mainnet',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.56789@1726387200.000',
    hash: 'hedera:mainnet:0.0.56789@1726387200.000',
    collectedAt: '2024-09-15T09:15:00Z',
    lastVerified: '2024-09-15T09:15:00Z'
  },
  {
    type: 'document',
    name: 'Asset Transfer Agreement - Infrastructure Portfolio',
    verified: true,
    source: 'SharePoint',
    url: '/evidence/asset-transfer-infrastructure.pdf',
    hash: 'sha256:transfer456...',
    collectedAt: '2024-09-16T10:00:00Z'
  },
  {
    type: 'document',
    name: 'Complete Investor Registry',
    verified: true,
    source: 'Agent',
    url: '/evidence/investor-registry-deal-005.xlsx',
    hash: 'sha256:registry789...',
    collectedAt: '2024-09-20T14:00:00Z'
  },
  {
    type: 'api_response',
    name: 'Sanctions Screening - All Investors Clear',
    verified: true,
    source: 'API',
    url: 'https://dowjones.com/sanctions/results/deal-005',
    collectedAt: '2024-09-22T09:00:00Z',
    lastVerified: '2024-09-22T09:00:00Z'
  },
  {
    type: 'document',
    name: 'Financial Statements - Audited',
    verified: true,
    source: 'S3',
    url: '/evidence/financial-statements-deal-005.pdf',
    hash: 'sha256:fin123...',
    collectedAt: '2024-09-17T00:00:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'Shariah Review VC - Hedera Mainnet',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.67890@1727078400.000',
    hash: 'hedera:mainnet:0.0.67890@1727078400.000',
    collectedAt: '2024-09-25T11:00:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'Internal Audit VC - Hedera Mainnet',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.78901@1728288000.000',
    hash: 'hedera:mainnet:0.0.78901@1728288000.000',
    collectedAt: '2024-10-01T14:00:00Z'
  },
  {
    type: 'blockchain_tx',
    name: 'External Audit VC - Hedera Mainnet',
    verified: true,
    source: 'Agent',
    url: 'https://hashscan.io/mainnet/transaction/0.0.89012@1728892800.000',
    hash: 'hedera:mainnet:0.0.89012@1728892800.000',
    collectedAt: '2024-10-07T16:00:00Z'
  },

  // Cross-Deal Evidence
  {
    type: 'document',
    name: 'AAOIFI FAS 28 Standard (Murabaha)',
    verified: true,
    source: 'Manual',
    url: 'https://aaoifi.com/fas-28-murabaha-and-other-deferred-payment-sales/',
    collectedAt: '2024-10-01T00:00:00Z'
  },
  {
    type: 'document',
    name: 'IFSB-1 Risk Management Standard',
    verified: true,
    source: 'Manual',
    url: 'https://www.ifsb.org/standard.php?id=1',
    collectedAt: '2024-10-01T00:00:00Z'
  },
  {
    type: 'document',
    name: 'FATF 40 Recommendations (2025)',
    verified: true,
    source: 'Manual',
    url: 'https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html',
    collectedAt: '2024-10-01T00:00:00Z'
  },
  {
    type: 'document',
    name: 'ICMA Green Bond Principles (2021)',
    verified: true,
    source: 'Manual',
    url: 'https://www.icmagroup.org/sustainable-finance/the-principles-guidelines-and-handbooks/green-bond-principles-gbp/',
    collectedAt: '2024-10-01T00:00:00Z'
  }
]

// Utility functions
export const getEvidenceByDeal = (dealId: string): Evidence[] => {
  // Filter by checking if the evidence URL contains the deal ID
  return mockEvidence.filter(e =>
    e.url?.includes(dealId) ||
    e.name?.toLowerCase().includes(dealId.toLowerCase())
  )
}

export const getEvidenceBySource = (source: Evidence['source']): Evidence[] => {
  return mockEvidence.filter(e => e.source === source)
}

export const getVerifiedEvidence = (): Evidence[] => {
  return mockEvidence.filter(e => e.verified === true)
}

export const getPendingEvidence = (): Evidence[] => {
  return mockEvidence.filter(e => e.verified === false)
}

export const getEvidenceByType = (type: Evidence['type']): Evidence[] => {
  return mockEvidence.filter(e => e.type === type)
}

export const getBlockchainEvidence = (): Evidence[] => {
  return mockEvidence.filter(e => e.type === 'blockchain_tx')
}

export const getAgentCollectedEvidence = (): Evidence[] => {
  return mockEvidence.filter(e => e.source === 'Agent')
}

export const getStaleEvidence = (): Evidence[] => {
  return mockEvidence.filter(e => e.stale === true)
}

export const getMissingEvidence = (): Evidence[] => {
  return mockEvidence.filter(e => !e.name || e.verified === false)
}
