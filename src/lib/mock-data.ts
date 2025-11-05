/**
 * MOCK DATA FOR TESTING
 * ======================
 * Mock templates and data used when backend services are unavailable.
 *
 * ⚠️ CRITICAL: All mock data should be clearly labeled in the UI
 * with MockDataBadge component to avoid confusion during testing.
 */

import type { WorkflowTemplate } from './types'

/**
 * 5 Pre-built Islamic Finance Workflow Templates
 * Based on AAOIFI standards for core Islamic finance contracts
 */
export const MOCK_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'sukuk_issuance_mock',
    name: 'Sukuk Issuance Document',
    description: 'Generate compliant Sukuk (Islamic bond) issuance documentation following AAOIFI FAS 33 standards',
    icon: '💰',
    category: 'debt',
    openCodeTemplate: `Generate a Sukuk issuance document that:
- Describes the underlying asset structure
- Outlines profit distribution mechanisms
- Ensures Shariah compliance per AAOIFI standards
- Includes risk disclosures and investor rights
- Specifies trustee and SPV arrangements`,
    axialCode: {
      steps: [
        {
          id: 'analyze_asset',
          name: 'Analyze Underlying Asset',
          type: 'query',
          instruction: 'Search AAOIFI standards for asset-backed Sukuk requirements',
          axialParams: { query_type: 'asset_requirements' },
          sources: ['aaoifi_fas_33'],
          expectedOutput: 'Asset structure requirements and compliance criteria'
        },
        {
          id: 'generate_structure',
          name: 'Generate Sukuk Structure',
          type: 'generate',
          instruction: 'Create Sukuk structure section describing SPV, assets, and cash flows',
          axialParams: { section: 'structure', format: 'markdown' },
          sources: ['aaoifi_fas_33', 'sukuk_precedents'],
          expectedOutput: 'Detailed structure section with diagrams'
        },
        {
          id: 'validate_shariah',
          name: 'Validate Shariah Compliance',
          type: 'validate',
          instruction: 'Verify all terms comply with AAOIFI Shariah standards',
          axialParams: { validation_type: 'shariah_compliance' },
          sources: ['aaoifi_shariah_standards'],
          expectedOutput: 'Compliance validation report'
        }
      ],
      requiredSources: ['AAOIFI FAS 33', 'AAOIFI Shariah Standards'],
      outputFormat: 'markdown',
      estimatedDuration: 20,
      complexity: 'complex'
    },
    requiredServices: ['Documents', 'Graphiti', 'MCP', 'Orchestrator'],
    version: '1.0.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    executionCount: 0,
    successRate: 0.0,
    averageRating: 0.0,
    refinements: []
  },

  {
    id: 'murabaha_purchase_mock',
    name: 'Murabaha Purchase Agreement',
    description: 'Generate a cost-plus financing agreement compliant with AAOIFI FAS 2',
    icon: '🏪',
    category: 'debt',
    openCodeTemplate: `Generate a Murabaha purchase agreement that:
- Defines the asset being purchased
- Specifies cost price and profit margin transparently
- Outlines payment terms and schedules
- Ensures two separate contracts (purchase and resale)
- Includes Shariah compliance disclosures`,
    axialCode: {
      steps: [
        {
          id: 'query_aaoifi',
          name: 'Query AAOIFI Standards',
          type: 'query',
          instruction: 'Search AAOIFI FAS 2 for Murabaha contract requirements',
          axialParams: { standard: 'FAS_2' },
          sources: ['aaoifi_fas_2'],
          expectedOutput: 'Contract structure and disclosure requirements'
        },
        {
          id: 'generate_contract',
          name: 'Generate Contract Document',
          type: 'generate',
          instruction: 'Create complete Murabaha contract with all required clauses',
          axialParams: { contract_type: 'murabaha' },
          sources: ['aaoifi_fas_2', 'murabaha_templates'],
          expectedOutput: 'Full contract document'
        }
      ],
      requiredSources: ['AAOIFI FAS 2'],
      outputFormat: 'markdown',
      estimatedDuration: 15,
      complexity: 'moderate'
    },
    requiredServices: ['Documents', 'Graphiti', 'MCP', 'Orchestrator'],
    version: '1.0.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    executionCount: 0,
    successRate: 0.0,
    averageRating: 0.0,
    refinements: []
  },

  {
    id: 'ijarah_lease_mock',
    name: 'Ijarah Lease Contract',
    description: 'Generate Islamic lease agreement following AAOIFI FAS 8 for operating/finance leases',
    icon: '🏢',
    category: 'lease',
    openCodeTemplate: `Generate an Ijarah lease contract that:
- Describes the leased asset in detail
- Specifies rental payments and terms
- Clarifies ownership and maintenance responsibilities
- Addresses end-of-lease options (purchase, return, renew)
- Ensures compliance with Islamic leasing principles`,
    axialCode: {
      steps: [
        {
          id: 'analyze_lease_type',
          name: 'Analyze Lease Type',
          type: 'query',
          instruction: 'Determine operating vs finance lease requirements from AAOIFI',
          axialParams: { lease_classification: true },
          sources: ['aaoifi_fas_8'],
          expectedOutput: 'Lease type classification and requirements'
        },
        {
          id: 'generate_terms',
          name: 'Generate Lease Terms',
          type: 'generate',
          instruction: 'Create detailed lease terms and conditions',
          axialParams: { document_section: 'terms' },
          sources: ['aaoifi_fas_8', 'ijarah_precedents'],
          expectedOutput: 'Complete lease agreement'
        }
      ],
      requiredSources: ['AAOIFI FAS 8'],
      outputFormat: 'markdown',
      estimatedDuration: 15,
      complexity: 'moderate'
    },
    requiredServices: ['Documents', 'Graphiti', 'MCP', 'Orchestrator'],
    tags: ['R&D Phase'],
    version: '1.0.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    executionCount: 0,
    successRate: 0.0,
    averageRating: 0.0,
    refinements: []
  },

  {
    id: 'mudarabah_partnership_mock',
    name: 'Mudarabah Partnership Agreement',
    description: 'Generate profit-sharing partnership agreement per AAOIFI FAS 3',
    icon: '🤝',
    category: 'partnership',
    openCodeTemplate: `Generate a Mudarabah partnership agreement that:
- Defines roles of capital provider (Rab al-Mal) and manager (Mudarib)
- Specifies profit-sharing ratios
- Outlines loss-bearing provisions
- Details management rights and restrictions
- Ensures compliance with profit-sharing principles`,
    axialCode: {
      steps: [
        {
          id: 'query_partnership_rules',
          name: 'Query Partnership Rules',
          type: 'query',
          instruction: 'Search AAOIFI FAS 3 for Mudarabah partnership requirements',
          axialParams: { partnership_type: 'mudarabah' },
          sources: ['aaoifi_fas_3'],
          expectedOutput: 'Partnership structure and profit-sharing rules'
        },
        {
          id: 'generate_agreement',
          name: 'Generate Partnership Agreement',
          type: 'generate',
          instruction: 'Create complete partnership agreement document',
          axialParams: { agreement_type: 'mudarabah' },
          sources: ['aaoifi_fas_3', 'mudarabah_templates'],
          expectedOutput: 'Full partnership agreement'
        }
      ],
      requiredSources: ['AAOIFI FAS 3'],
      outputFormat: 'markdown',
      estimatedDuration: 18,
      complexity: 'complex'
    },
    requiredServices: ['Documents', 'Graphiti', 'MCP', 'Orchestrator'],
    version: '1.0.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    executionCount: 0,
    successRate: 0.0,
    averageRating: 0.0,
    refinements: []
  },

  {
    id: 'wakalah_agency_mock',
    name: 'Wakalah Agency Agreement',
    description: 'Generate Islamic agency contract following AAOIFI standards for investment management',
    icon: '📋',
    category: 'agency',
    openCodeTemplate: `Generate a Wakalah agency agreement that:
- Defines scope of agent's authority
- Specifies fee structure (fixed or performance-based)
- Outlines investment guidelines and restrictions
- Clarifies fiduciary duties and liability
- Ensures Shariah-compliant investment mandate`,
    axialCode: {
      steps: [
        {
          id: 'query_agency_rules',
          name: 'Query Agency Requirements',
          type: 'query',
          instruction: 'Search AAOIFI standards for Wakalah agency rules',
          axialParams: { contract_type: 'wakalah' },
          sources: ['aaoifi_governance_standards'],
          expectedOutput: 'Agency structure and fee requirements'
        },
        {
          id: 'generate_mandate',
          name: 'Generate Investment Mandate',
          type: 'generate',
          instruction: 'Create detailed investment mandate and restrictions',
          axialParams: { section: 'investment_mandate' },
          sources: ['aaoifi_governance_standards', 'wakalah_precedents'],
          expectedOutput: 'Complete agency agreement with mandate'
        }
      ],
      requiredSources: ['AAOIFI Governance Standards'],
      outputFormat: 'markdown',
      estimatedDuration: 12,
      complexity: 'simple'
    },
    requiredServices: ['Documents', 'Graphiti', 'MCP', 'Orchestrator'],
    version: '1.0.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    executionCount: 0,
    successRate: 0.0,
    averageRating: 0.0,
    refinements: []
  }
]

// =============================================================================
// GUARDIAN/HEDERA MOCK DATA FOR DIGITAL ASSETS (Netlify Deployment)
// =============================================================================

/**
 * Type definitions matching backend Pydantic models
 */
export interface MockCertificate {
  token_id: string
  serial_number: number
  deal_id: string
  deal_name: string
  minted_at: string
  vp_cid: string
  hcs_topic_id: string
  hcs_sequence_number: number
  consensus_timestamp: string
  hashscan_url: string
  verification_status: {
    vp_signature_valid: boolean
    hcs_timestamp_verified: boolean
    ipfs_accessible: boolean
  }
}

export interface MockVP {
  id: string
  type: string[]
  holder: string
  verifiableCredential: any[]
  proof: {
    type: string
    created: string
    verificationMethod: string
    proofPurpose: string
    ipfsCid: string
    hcsTopicId: string
    hcsSequenceNumber: number
  }
}

export interface MockSukukToken {
  token_id: string
  token_name: string
  token_symbol: string
  total_supply: number
  decimals: number
  certificate_token_id: string
  deal_id: string
  created_at: string
  treasury_account: string
  holders_count: number
  hashscan_url: string
  status?: string
}

/**
 * Static mock data store for known deals
 */
const DEAL_MOCK_DATA: Record<string, {
  certificate: MockCertificate
  vp: MockVP
  sukuk_token: MockSukukToken
}> = {
  'exec-001': {
    certificate: {
      token_id: '0.0.4929427',
      serial_number: 1,
      deal_id: 'exec-001',
      deal_name: 'QIIB Oryx Fund - Phase 1 (Green Sukuk Ijara)',
      minted_at: '2024-01-15T10:00:00Z',
      vp_cid: 'QmY8Kbp3XVN5u2h7KxV7J5T9z6d8Ww3K4r2N7Bq9P6M5F',
      hcs_topic_id: '0.0.5100001',
      hcs_sequence_number: 1234,
      consensus_timestamp: '2024-01-15T10:00:00Z',
      hashscan_url: 'https://hashscan.io/testnet/token/0.0.4929427/1',
      verification_status: {
        vp_signature_valid: true,
        hcs_timestamp_verified: true,
        ipfs_accessible: true
      }
    },
    vp: {
      id: 'vp:exec-001',
      type: ['VerifiablePresentation'],
      holder: 'did:hedera:testnet:0.0.4929427',
      verifiableCredential: [
        { type: 'ShariahVC', cid: 'QmShariahVC123456789abcdefghijklmnopqrstuvwx' },
        { type: 'JurisdictionVC', cid: 'QmJurisdictionVC123456789abcdefghijklmnop' },
        { type: 'AccountingVC', cid: 'QmAccountingVC123456789abcdefghijklmnopqr' },
        { type: 'ImpactVC', cid: 'QmImpactVC123456789abcdefghijklmnopqrstuv' }
      ],
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-01-15T09:30:00Z',
        verificationMethod: 'did:hedera:testnet:0.0.4929427#key-1',
        proofPurpose: 'authentication',
        ipfsCid: 'QmY8Kbp3XVN5u2h7KxV7J5T9z6d8Ww3K4r2N7Bq9P6M5F',
        hcsTopicId: '0.0.4929428',
        hcsSequenceNumber: 15
      }
    },
    sukuk_token: {
      token_id: '0.0.4929427',
      token_name: 'QIIB Oryx Green Sukuk',
      token_symbol: 'QIIB-ORYX',
      total_supply: 50000000,
      decimals: 2,
      certificate_token_id: '0.0.4929427',
      deal_id: 'exec-001',
      created_at: '2024-01-16T08:00:00Z',
      treasury_account: '0.0.4929428',
      holders_count: 127,
      hashscan_url: 'https://hashscan.io/testnet/token/0.0.4929427',
      status: 'active'
    }
  },
  'exec-002': {
    certificate: {
      token_id: '0.0.5123456',
      serial_number: 1,
      deal_id: 'exec-002',
      deal_name: 'Dubai Islamic Bank Murabaha Facility',
      minted_at: '2024-02-20T08:30:00Z',
      vp_cid: 'QmZ9Lcp4YWO6v3i8LyW8K6U0a7e9Xx4L5s3O8Cr0Q7N6G',
      hcs_topic_id: '0.0.5100002',
      hcs_sequence_number: 2345,
      consensus_timestamp: '2024-02-20T08:30:00Z',
      hashscan_url: 'https://hashscan.io/testnet/token/0.0.5123456/1',
      verification_status: {
        vp_signature_valid: true,
        hcs_timestamp_verified: true,
        ipfs_accessible: true
      }
    },
    vp: {
      id: 'vp:exec-002',
      type: ['VerifiablePresentation'],
      holder: 'did:hedera:testnet:0.0.5123456',
      verifiableCredential: [
        { type: 'ShariahVC', cid: 'QmShariahVC234567890bcdefghijklmnopqrstuvwxy' },
        { type: 'JurisdictionVC', cid: 'QmJurisdictionVC234567890bcdefghijklmnopq' },
        { type: 'AccountingVC', cid: 'QmAccountingVC234567890bcdefghijklmnopqrs' },
        { type: 'ImpactVC', cid: 'QmImpactVC234567890bcdefghijklmnopqrstuv' }
      ],
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-02-20T08:00:00Z',
        verificationMethod: 'did:hedera:testnet:0.0.5123456#key-1',
        proofPurpose: 'authentication',
        ipfsCid: 'QmZ9Lcp4YWO6v3i8LyW8K6U0a7e9Xx4L5s3O8Cr0Q7N6G',
        hcsTopicId: '0.0.5123457',
        hcsSequenceNumber: 22
      }
    },
    sukuk_token: {
      token_id: '0.0.5123456',
      token_name: 'DIB Murabaha Notes',
      token_symbol: 'DIB-MRB',
      total_supply: 25000000,
      decimals: 2,
      certificate_token_id: '0.0.5123456',
      deal_id: 'exec-002',
      created_at: '2024-02-21T07:00:00Z',
      treasury_account: '0.0.5123457',
      holders_count: 89,
      hashscan_url: 'https://hashscan.io/testnet/token/0.0.5123456',
      status: 'active'
    }
  },
  'exec-003': {
    certificate: {
      token_id: '0.0.5234567',
      serial_number: 1,
      deal_id: 'exec-003',
      deal_name: 'Abu Dhabi Sovereign Wakala (Infrastructure)',
      minted_at: '2024-03-10T14:15:00Z',
      vp_cid: 'QmA1Mdq5ZXP7w4j9MzX9L7V1b8f0Yy5M6t4P9Ds1R8O7H',
      hcs_topic_id: '0.0.5100003',
      hcs_sequence_number: 3456,
      consensus_timestamp: '2024-03-10T14:15:00Z',
      hashscan_url: 'https://hashscan.io/testnet/token/0.0.5234567/1',
      verification_status: {
        vp_signature_valid: true,
        hcs_timestamp_verified: true,
        ipfs_accessible: true
      }
    },
    vp: {
      id: 'vp:exec-003',
      type: ['VerifiablePresentation'],
      holder: 'did:hedera:testnet:0.0.5234567',
      verifiableCredential: [
        { type: 'ShariahVC', cid: 'QmShariahVC345678901cdefghijklmnopqrstuvwxyz' },
        { type: 'JurisdictionVC', cid: 'QmJurisdictionVC345678901cdefghijklmnopqr' },
        { type: 'AccountingVC', cid: 'QmAccountingVC345678901cdefghijklmnopqrst' },
        { type: 'ImpactVC', cid: 'QmImpactVC345678901cdefghijklmnopqrstuvw' }
      ],
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-03-10T13:45:00Z',
        verificationMethod: 'did:hedera:testnet:0.0.5234567#key-1',
        proofPurpose: 'authentication',
        ipfsCid: 'QmA1Mdq5ZXP7w4j9MzX9L7V1b8f0Yy5M6t4P9Ds1R8O7H',
        hcsTopicId: '0.0.5234568',
        hcsSequenceNumber: 31
      }
    },
    sukuk_token: {
      token_id: '0.0.5234567',
      token_name: 'ADGOV Wakala Certificates',
      token_symbol: 'ADGOV-WKL',
      total_supply: 100000000,
      decimals: 2,
      certificate_token_id: '0.0.5234567',
      deal_id: 'exec-003',
      created_at: '2024-03-11T06:00:00Z',
      treasury_account: '0.0.5234568',
      holders_count: 342,
      hashscan_url: 'https://hashscan.io/testnet/token/0.0.5234567',
      status: 'active'
    }
  }
}

/**
 * Get mock certificate for a deal.
 * Falls back to generic data if deal_id not found.
 */
export function getMockCertificate(dealId: string): MockCertificate {
  const dealData = DEAL_MOCK_DATA[dealId]
  if (dealData) {
    return dealData.certificate
  }

  // Generic fallback for unknown deal IDs
  return {
    token_id: '0.0.5999999',
    serial_number: 1,
    deal_id: dealId,
    deal_name: `Deal ${dealId}`,
    minted_at: new Date().toISOString(),
    vp_cid: 'QmGenericVPCID123456789abcdefghijklmnopqrstuv',
    hcs_topic_id: '0.0.5100999',
    hcs_sequence_number: 9999,
    consensus_timestamp: new Date().toISOString(),
    hashscan_url: 'https://hashscan.io/testnet/token/0.0.5999999/1',
    verification_status: {
      vp_signature_valid: true,
      hcs_timestamp_verified: true,
      ipfs_accessible: true
    }
  }
}

/**
 * Get mock Verifiable Presentation for a deal.
 * Falls back to generic data if deal_id not found.
 */
export function getMockVP(dealId: string): MockVP {
  const dealData = DEAL_MOCK_DATA[dealId]
  if (dealData) {
    return dealData.vp
  }

  // Generic fallback
  return {
    id: `vp:${dealId}`,
    type: ['VerifiablePresentation'],
    holder: 'did:hedera:testnet:0.0.5999999',
    verifiableCredential: [
      {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'ShariahVC'],
        credentialSubject: {}
      },
      {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'JurisdictionVC'],
        credentialSubject: {}
      }
    ],
    proof: {
      type: 'Ed25519Signature2020',
      created: new Date().toISOString(),
      verificationMethod: 'did:hedera:testnet:0.0.5999999#key-1',
      proofPurpose: 'assertionMethod',
      ipfsCid: 'QmGenericProof123456789abcdefghijklmnopqrst',
      hcsTopicId: '0.0.5999998',
      hcsSequenceNumber: 999999
    }
  }
}

/**
 * Get mock Sukuk token for a deal.
 * Falls back to generic data if deal_id not found.
 */
export function getMockSukukToken(dealId: string): MockSukukToken {
  const dealData = DEAL_MOCK_DATA[dealId]
  if (dealData) {
    return dealData.sukuk_token
  }

  // Generic fallback
  return {
    token_id: '0.0.5999999',
    token_name: `Sukuk Token ${dealId}`,
    token_symbol: 'GENR-SK',
    total_supply: 10000000,
    decimals: 2,
    certificate_token_id: '0.0.5999999',
    deal_id: dealId,
    created_at: new Date().toISOString(),
    treasury_account: '0.0.5999998',
    holders_count: 50,
    hashscan_url: 'https://hashscan.io/testnet/token/0.0.5999999',
    status: 'active'
  }
}

/**
 * Get all mock data for a deal in one call.
 */
export function getCompleteMockData(dealId: string) {
  return {
    certificate: getMockCertificate(dealId),
    vp: getMockVP(dealId),
    sukuk_token: getMockSukukToken(dealId)
  }
}
