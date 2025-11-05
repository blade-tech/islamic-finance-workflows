/**
 * GUARDIAN MOCK DATA GENERATORS
 * ==============================
 * Comprehensive mock data generation for Guardian-related features.
 *
 * PURPOSE:
 * - Enable UX development without real Guardian integration
 * - Provide realistic demo data for presentations
 * - Support frontend testing and development
 *
 * GENERATORS:
 * 1. Compliance Certificates (NFTs)
 * 2. Verifiable Presentations (VPs)
 * 3. Verifiable Credentials (VCs) - 4 types (Shariah, Jurisdiction, Accounting, Impact)
 * 4. Documents
 * 5. Platform Analytics
 * 6. Sukuk Tokens (ATS integration)
 *
 * DATA REALISM:
 * - Hedera-style IDs (0.0.XXXXXX)
 * - IPFS CIDs (QmXXXXXX...)
 * - Real timestamps
 * - Proper relationships between entities
 */

import { faker } from '@faker-js/faker'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MockCertificate {
  token_id: string // Hedera token ID (e.g., "0.0.123456")
  serial_number: number
  deal_id: string
  deal_name: string
  minted_at: string // ISO 8601
  vp_cid: string // IPFS CID of Verifiable Presentation
  hcs_topic_id: string // Hedera Consensus Service topic
  hcs_sequence_number: number
  consensus_timestamp: string // ISO 8601
  hashscan_url: string
  verification_status: {
    vp_signature_valid: boolean
    hcs_timestamp_verified: boolean
    ipfs_accessible: boolean
  }
}

export interface MockVP {
  vp_id: string
  cid: string // IPFS CID
  created_at: string
  holder_did: string // Decentralized Identifier
  credential_cids: string[] // 4 VCs (one per component)
  credential_types: string[] // ["ShariahVC", "JurisdictionVC", "AccountingVC", "ImpactVC"]
  proof: {
    type: string
    created: string
    verification_method: string
    proof_value: string
  }
}

export interface MockVC {
  vc_id: string
  cid: string // IPFS CID
  type: 'ShariahVC' | 'JurisdictionVC' | 'AccountingVC' | 'ImpactVC'
  issuer_did: string
  subject_did: string
  issuance_date: string
  credential_subject: Record<string, unknown> // Component-specific data
  proof: {
    type: string
    created: string
    verification_method: string
    proof_value: string
  }
}

export interface MockDocument {
  document_id: string
  document_type: 'compliance_report' | 'certificate' | 'audit_trail' | 'regulatory_filing'
  file_name: string
  file_size: number // bytes
  generated_at: string
  deal_id: string
  deal_name: string
  pages: number
  download_url: string // Mock S3/IPFS URL
  ipfs_cid?: string
}

export interface MockPlatformMetrics {
  overview: {
    total_deals: number
    compliant_deals: number
    pending_deals: number
    total_certificates_issued: number
  }
  certificate_issuance_trend: Array<{
    date: string // YYYY-MM-DD
    certificates_issued: number
  }>
  component_breakdown: {
    shariah: { total: number; compliant: number }
    jurisdiction: { total: number; compliant: number }
    accounting: { total: number; compliant: number }
    impact: { total: number; compliant: number }
  }
  recent_activity: Array<{
    activity_id: string
    activity_type: 'certificate_minted' | 'deal_created' | 'document_generated' | 'workflow_completed'
    timestamp: string
    deal_id: string
    deal_name: string
    description: string
  }>
}

export interface MockSukukToken {
  token_id: string // Hedera token ID for sukuk
  token_name: string
  token_symbol: string
  total_supply: number
  decimals: number
  certificate_token_id: string // Links to compliance certificate
  deal_id: string
  created_at: string
  treasury_account: string
  holders_count: number
  hashscan_url: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateHederaAccountId(): string {
  return `0.0.${faker.number.int({ min: 100000, max: 999999 })}`
}

function generateIPFSCid(): string {
  return `Qm${faker.string.alphanumeric({ length: 44 })}`
}

function generateDID(): string {
  const method = faker.helpers.arrayElement(['hedera', 'key', 'web'])
  const identifier = faker.string.alphanumeric({ length: 32 })
  return `did:${method}:${identifier}`
}

function generateProof() {
  return {
    type: 'Ed25519Signature2020',
    created: faker.date.recent({ days: 7 }).toISOString(),
    verification_method: generateDID() + '#key-1',
    proof_value: faker.string.alphanumeric({ length: 64 }),
  }
}

// ============================================================================
// CERTIFICATE GENERATOR
// ============================================================================

export function generateMockCertificate(
  dealId: string,
  dealName: string,
  options?: {
    mintedDaysAgo?: number
    verificationIssue?: 'signature' | 'timestamp' | 'ipfs' | null
  }
): MockCertificate {
  const tokenId = generateHederaAccountId()
  const vpCid = generateIPFSCid()
  const topicId = generateHederaAccountId()
  const mintedDate = faker.date.recent({ days: options?.mintedDaysAgo || 7 })

  return {
    token_id: tokenId,
    serial_number: 1,
    deal_id: dealId,
    deal_name: dealName,
    minted_at: mintedDate.toISOString(),
    vp_cid: vpCid,
    hcs_topic_id: topicId,
    hcs_sequence_number: faker.number.int({ min: 1000, max: 9999 }),
    consensus_timestamp: mintedDate.toISOString(),
    hashscan_url: `https://hashscan.io/testnet/token/${tokenId}/1`,
    verification_status: {
      vp_signature_valid: options?.verificationIssue !== 'signature',
      hcs_timestamp_verified: options?.verificationIssue !== 'timestamp',
      ipfs_accessible: options?.verificationIssue !== 'ipfs',
    },
  }
}

// ============================================================================
// VERIFIABLE PRESENTATION GENERATOR
// ============================================================================

export function generateMockVP(dealId: string): MockVP {
  const vpCid = generateIPFSCid()
  const credentialCids = [
    generateIPFSCid(), // Shariah VC
    generateIPFSCid(), // Jurisdiction VC
    generateIPFSCid(), // Accounting VC
    generateIPFSCid(), // Impact VC
  ]

  return {
    vp_id: `vp:${faker.string.uuid()}`,
    cid: vpCid,
    created_at: faker.date.recent({ days: 7 }).toISOString(),
    holder_did: generateDID(),
    credential_cids: credentialCids,
    credential_types: ['ShariahVC', 'JurisdictionVC', 'AccountingVC', 'ImpactVC'],
    proof: generateProof(),
  }
}

// ============================================================================
// VERIFIABLE CREDENTIAL GENERATORS
// ============================================================================

export function generateMockVC(
  type: 'ShariahVC' | 'JurisdictionVC' | 'AccountingVC' | 'ImpactVC',
  dealConfig: {
    shariah_structure?: string
    jurisdiction?: string
    accounting?: string
    impact?: string
  }
): MockVC {
  const credentialSubject: Record<string, unknown> = {
    id: generateDID(),
  }

  // Component-specific credential data
  switch (type) {
    case 'ShariahVC':
      credentialSubject.shariah_structure = dealConfig.shariah_structure || 'wakala'
      credentialSubject.shariah_compliance_status = 'compliant'
      credentialSubject.reviewed_by = faker.person.fullName()
      credentialSubject.review_date = faker.date.recent({ days: 30 }).toISOString()
      break
    case 'JurisdictionVC':
      credentialSubject.jurisdiction = dealConfig.jurisdiction || 'uae'
      credentialSubject.regulatory_status = 'approved'
      credentialSubject.license_number = faker.string.alphanumeric({ length: 10 }).toUpperCase()
      break
    case 'AccountingVC':
      credentialSubject.accounting_framework = dealConfig.accounting || 'AAOIFI'
      credentialSubject.audit_status = 'passed'
      credentialSubject.auditor = faker.company.name() + ' LLP'
      break
    case 'ImpactVC':
      credentialSubject.impact_framework = dealConfig.impact || 'sdg'
      credentialSubject.impact_score = faker.number.int({ min: 70, max: 100 })
      credentialSubject.sdg_alignment = faker.helpers.arrayElements(
        ['SDG 7', 'SDG 9', 'SDG 11', 'SDG 13'],
        { min: 2, max: 4 }
      )
      break
  }

  return {
    vc_id: `vc:${faker.string.uuid()}`,
    cid: generateIPFSCid(),
    type,
    issuer_did: generateDID(),
    subject_did: generateDID(),
    issuance_date: faker.date.recent({ days: 30 }).toISOString(),
    credential_subject: credentialSubject,
    proof: generateProof(),
  }
}

export function generateMockVCs(dealConfig: {
  shariah_structure?: string
  jurisdiction?: string
  accounting?: string
  impact?: string
}): {
  shariah: MockVC
  jurisdiction: MockVC
  accounting: MockVC
  impact: MockVC
} {
  return {
    shariah: generateMockVC('ShariahVC', dealConfig),
    jurisdiction: generateMockVC('JurisdictionVC', dealConfig),
    accounting: generateMockVC('AccountingVC', dealConfig),
    impact: generateMockVC('ImpactVC', dealConfig),
  }
}

// ============================================================================
// DOCUMENT GENERATOR
// ============================================================================

export function generateMockDocument(
  documentType: 'compliance_report' | 'certificate' | 'audit_trail' | 'regulatory_filing',
  dealId: string,
  dealName: string
): MockDocument {
  const fileExtension = 'pdf'
  const fileName = `${documentType}_${dealId}_${Date.now()}.${fileExtension}`
  const pages = faker.number.int({ min: 5, max: 50 })
  const avgBytesPerPage = 100000 // ~100KB per page
  const fileSize = pages * avgBytesPerPage + faker.number.int({ min: -20000, max: 20000 })

  return {
    document_id: `doc-${faker.string.uuid()}`,
    document_type: documentType,
    file_name: fileName,
    file_size: fileSize,
    generated_at: new Date().toISOString(),
    deal_id: dealId,
    deal_name: dealName,
    pages,
    download_url: `/api/mock-documents/${fileName}`, // Mock endpoint
    ipfs_cid: documentType === 'audit_trail' ? generateIPFSCid() : undefined,
  }
}

// ============================================================================
// PLATFORM METRICS GENERATOR
// ============================================================================

export function generateMockPlatformMetrics(): MockPlatformMetrics {
  const totalDeals = faker.number.int({ min: 50, max: 200 })
  const compliantDeals = faker.number.int({ min: Math.floor(totalDeals * 0.7), max: totalDeals })
  const pendingDeals = totalDeals - compliantDeals

  // Certificate issuance trend (last 30 days)
  const trend: Array<{ date: string; certificates_issued: number }> = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    trend.push({
      date: date.toISOString().split('T')[0],
      certificates_issued: i === 0 ? 0 : faker.number.int({ min: 1, max: 10 }),
    })
  }

  // Component breakdown
  const componentBreakdown = {
    shariah: {
      total: totalDeals,
      compliant: faker.number.int({ min: Math.floor(totalDeals * 0.8), max: totalDeals }),
    },
    jurisdiction: {
      total: totalDeals,
      compliant: faker.number.int({ min: Math.floor(totalDeals * 0.75), max: totalDeals }),
    },
    accounting: {
      total: totalDeals,
      compliant: faker.number.int({ min: Math.floor(totalDeals * 0.85), max: totalDeals }),
    },
    impact: {
      total: totalDeals,
      compliant: faker.number.int({ min: Math.floor(totalDeals * 0.7), max: totalDeals }),
    },
  }

  // Recent activity (last 10 activities)
  const activityTypes: Array<'certificate_minted' | 'deal_created' | 'document_generated' | 'workflow_completed'> = [
    'certificate_minted',
    'deal_created',
    'document_generated',
    'workflow_completed',
  ]

  const recentActivity = Array.from({ length: 10 }, (_, i) => {
    const activityType = faker.helpers.arrayElement(activityTypes)
    const dealId = `deal-${faker.string.uuid().slice(0, 8)}`
    const dealName = faker.company.name() + ' Sukuk'

    const descriptions: Record<typeof activityType, string> = {
      certificate_minted: `Compliance certificate minted for ${dealName}`,
      deal_created: `New deal created: ${dealName}`,
      document_generated: `Compliance report generated for ${dealName}`,
      workflow_completed: `Workflow execution completed for ${dealName}`,
    }

    return {
      activity_id: `activity-${faker.string.uuid()}`,
      activity_type: activityType,
      timestamp: faker.date.recent({ days: 7 }).toISOString(),
      deal_id: dealId,
      deal_name: dealName,
      description: descriptions[activityType],
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return {
    overview: {
      total_deals: totalDeals,
      compliant_deals: compliantDeals,
      pending_deals: pendingDeals,
      total_certificates_issued: compliantDeals,
    },
    certificate_issuance_trend: trend,
    component_breakdown: componentBreakdown,
    recent_activity: recentActivity,
  }
}

// ============================================================================
// SUKUK TOKEN GENERATOR (ATS Integration)
// ============================================================================

export function generateMockSukukToken(
  dealId: string,
  certificateTokenId: string,
  options?: {
    tokenName?: string
    tokenSymbol?: string
    totalSupply?: number
  }
): MockSukukToken {
  const tokenId = generateHederaAccountId()
  const tokenName = options?.tokenName || `${faker.company.name()} Sukuk`
  const tokenSymbol = options?.tokenSymbol || faker.string.alpha({ length: 4, casing: 'upper' }) + 'SK'
  const totalSupply = options?.totalSupply || faker.number.int({ min: 1000000, max: 100000000 })

  return {
    token_id: tokenId,
    token_name: tokenName,
    token_symbol: tokenSymbol,
    total_supply: totalSupply,
    decimals: 2,
    certificate_token_id: certificateTokenId,
    deal_id: dealId,
    created_at: faker.date.recent({ days: 3 }).toISOString(),
    treasury_account: generateHederaAccountId(),
    holders_count: faker.number.int({ min: 10, max: 500 }),
    hashscan_url: `https://hashscan.io/testnet/token/${tokenId}`,
  }
}

// ============================================================================
// BATCH GENERATORS (for demo data)
// ============================================================================

/**
 * Generate complete mock data for a single deal (certificate + VP + VCs + documents)
 */
export function generateCompleteDealMockData(dealId: string, dealName: string, dealConfig: {
  shariah_structure?: string
  jurisdiction?: string
  accounting?: string
  impact?: string
}) {
  const certificate = generateMockCertificate(dealId, dealName)
  const vp = generateMockVP(dealId)
  const vcs = generateMockVCs(dealConfig)
  const documents = {
    compliance_report: generateMockDocument('compliance_report', dealId, dealName),
    certificate: generateMockDocument('certificate', dealId, dealName),
    audit_trail: generateMockDocument('audit_trail', dealId, dealName),
    regulatory_filing: generateMockDocument('regulatory_filing', dealId, dealName),
  }
  const sukukToken = generateMockSukukToken(dealId, certificate.token_id, {
    tokenName: dealName + ' Token',
  })

  return {
    certificate,
    vp,
    vcs,
    documents,
    sukukToken,
  }
}

/**
 * Generate demo data for QIIB Oryx (the demo deal)
 */
export function generateQIIBOryxDemoData() {
  return generateCompleteDealMockData(
    'deal-qiib-oryx-2024',
    'QIIB Oryx Sustainable Aviation Sukuk',
    {
      shariah_structure: 'wakala',
      jurisdiction: 'qfca',
      accounting: 'aaoifi',
      impact: 'sdg',
    }
  )
}
