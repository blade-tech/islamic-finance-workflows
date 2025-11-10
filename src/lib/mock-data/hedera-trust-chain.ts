/**
 * HEDERA GUARDIAN DID/VC MOCK DATA
 * =================================
 * Mock Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs)
 * to showcase multi-stakeholder collaboration via Hedera Guardian.
 *
 * VALUE PROPOSITION:
 * - Each action anchored to Hedera via Hedera Guardian using DIDs
 * - VCs enable multi-stakeholder collaboration
 * - External parties can verify credentials independently
 * - Immutable audit trail without exposing sensitive data
 */

export interface HederaDID {
  id: string
  type: 'Organization' | 'Person' | 'System'
  name: string
  role: string
  hederaAccountId: string
  publicKey: string
  createdAt: string
  verificationMethod: string
}

export interface VerifiableCredential {
  id: string
  type: string[]
  issuer: HederaDID
  issuanceDate: string
  expirationDate?: string
  credentialSubject: {
    id: string
    action: string
    details: Record<string, any>
    contractId?: string
    policyId?: string
  }
  proof: {
    type: string
    created: string
    proofPurpose: string
    verificationMethod: string
    jws: string
  }
  hcsTopicId: string
  hcsMessageId: string
  hcsTimestamp: string
  hashScanUrl: string
}

export interface TrustChainStep {
  id: string
  timestamp: string
  actor: HederaDID
  action: string
  credentialIssued: VerifiableCredential
  status: 'completed' | 'pending' | 'verified'
  verifiedBy?: HederaDID[]
  dependencies?: string[] // IDs of previous steps
}

export interface ExternalVerification {
  id: string
  verifier: HederaDID
  credentialId: string
  verificationTimestamp: string
  verificationMethod: 'hashscan' | 'guardian-api' | 'did-resolver'
  result: 'valid' | 'invalid' | 'expired'
  notes?: string
}

// ============================================================================
// MOCK DIDs - Participants in Islamic Finance Ecosystem
// ============================================================================

export const mockDIDs: Record<string, HederaDID> = {
  qatarBank: {
    id: 'did:hedera:mainnet:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK_0.0.123456',
    type: 'Organization',
    name: 'Qatar Islamic Bank',
    role: 'Issuer',
    hederaAccountId: '0.0.123456',
    publicKey: '302a300506032b6570032100b3d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1',
    createdAt: '2024-01-15T10:00:00Z',
    verificationMethod: 'did:hedera:mainnet:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK_0.0.123456#key-1'
  },

  shariahBoard: {
    id: 'did:hedera:mainnet:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH_0.0.234567',
    type: 'Organization',
    name: 'Qatar Central Shariah Board',
    role: 'Shariah Supervisor',
    hederaAccountId: '0.0.234567',
    publicKey: '302a300506032b6570032100c4e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2',
    createdAt: '2024-01-10T09:00:00Z',
    verificationMethod: 'did:hedera:mainnet:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH_0.0.234567#key-1'
  },

  externalAuditor: {
    id: 'did:hedera:mainnet:z6MkrJVnaZkeFzdQyMZTRRWkYpFJf7bsKvXXHwVmN9pzEMQL_0.0.345678',
    type: 'Organization',
    name: 'KPMG Qatar',
    role: 'External Auditor',
    hederaAccountId: '0.0.345678',
    publicKey: '302a300506032b6570032100d5f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3',
    createdAt: '2024-01-20T11:00:00Z',
    verificationMethod: 'did:hedera:mainnet:z6MkrJVnaZkeFzdQyMZTRRWkYpFJf7bsKvXXHwVmN9pzEMQL_0.0.345678#key-1'
  },

  investor: {
    id: 'did:hedera:mainnet:z6MktYRVdYJC4Ja7Xb9Qp3Xz5Yj7KqPvN8WmLkHgF2RtEsWq_0.0.456789',
    type: 'Organization',
    name: 'Dubai Investment Fund',
    role: 'Investor',
    hederaAccountId: '0.0.456789',
    publicKey: '302a300506032b6570032100e6g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4',
    createdAt: '2024-02-01T14:00:00Z',
    verificationMethod: 'did:hedera:mainnet:z6MktYRVdYJC4Ja7Xb9Qp3Xz5Yj7KqPvN8WmLkHgF2RtEsWq_0.0.456789#key-1'
  },

  qcbRegulator: {
    id: 'did:hedera:mainnet:z6MkuBXnCJPQw4VKzYjDpZpYRnXqZ8TmNvLkJhGfDcRtWxYz_0.0.567890',
    type: 'Organization',
    name: 'Qatar Central Bank',
    role: 'Regulator',
    hederaAccountId: '0.0.567890',
    publicKey: '302a300506032b6570032100f7h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5',
    createdAt: '2024-01-05T08:00:00Z',
    verificationMethod: 'did:hedera:mainnet:z6MkuBXnCJPQw4VKzYjDpZpYRnXqZ8TmNvLkJhGfDcRtWxYz_0.0.567890#key-1'
  },

  guardianSystem: {
    id: 'did:hedera:mainnet:z6MkvNRqP8WmHgT2YzDpLmQnXvZ9UoKjLhFgDcRtWxYzAbCd_0.0.678901',
    type: 'System',
    name: 'Hedera Guardian',
    role: 'Credential Issuer',
    hederaAccountId: '0.0.678901',
    publicKey: '302a300506032b6570032100g8i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6i6',
    createdAt: '2024-01-01T00:00:00Z',
    verificationMethod: 'did:hedera:mainnet:z6MkvNRqP8WmHgT2YzDpLmQnXvZ9UoKjLhFgDcRtWxYzAbCd_0.0.678901#key-1'
  }
}

// ============================================================================
// MOCK VERIFIABLE CREDENTIALS - Actions Anchored to Hedera
// ============================================================================

export const mockVCs: VerifiableCredential[] = [
  {
    id: 'vc:mudarabah-contract-approval-2024-001',
    type: ['VerifiableCredential', 'ShariahComplianceCredential'],
    issuer: mockDIDs.shariahBoard,
    issuanceDate: '2024-11-08T10:30:00Z',
    expirationDate: '2025-11-08T10:30:00Z',
    credentialSubject: {
      id: mockDIDs.qatarBank.id,
      action: 'Shariah Board Approval for Mudarabah Contract',
      details: {
        contractType: 'Mudarabah Investment Account',
        productId: 'MUD-2024-001',
        capitalAmount: 1000000,
        profitSharingRatio: '60/40',
        approvalDate: '2024-11-08',
        boardMembers: ['Dr. Ahmed Al-Thani', 'Sheikh Mohammed Al-Kuwari', 'Dr. Fatima Al-Mansouri'],
        fatwaReference: 'SSB-2024-MUD-067'
      },
      contractId: 'MUD-2024-001',
      policyId: 'guardian-policy-islamic-finance-v1.0'
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2024-11-08T10:30:15Z',
      proofPurpose: 'assertionMethod',
      verificationMethod: mockDIDs.shariahBoard.verificationMethod,
      jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Kz1Z8vN9X2pQmK6R7wF3nL4eT9yJ2aM5cH8bV1sD4gU3fP0oI7qW6xE9tN2mR5vK8cJ4wL7pY1hZ6gT3rB0aBg'
    },
    hcsTopicId: '0.0.789012',
    hcsMessageId: '1699444215.123456789',
    hcsTimestamp: '2024-11-08T10:30:15.123456789Z',
    hashScanUrl: 'https://hashscan.io/mainnet/topic/0.0.789012/message/1699444215.123456789'
  },

  {
    id: 'vc:capital-verification-2024-001',
    type: ['VerifiableCredential', 'CapitalVerificationCredential'],
    issuer: mockDIDs.externalAuditor,
    issuanceDate: '2024-11-08T14:45:00Z',
    credentialSubject: {
      id: mockDIDs.qatarBank.id,
      action: 'Capital Verification for Mudarabah Contract',
      details: {
        verifiedCapital: 1000000,
        verificationMethod: 'Bank statement review + blockchain confirmation',
        capitalDeliveryDate: '2024-11-07',
        bankAccount: 'QA****1234 (masked)',
        aaoifiCompliance: 'SS-13 §7/2, §7/4'
      },
      contractId: 'MUD-2024-001',
      policyId: 'guardian-policy-islamic-finance-v1.0'
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2024-11-08T14:45:20Z',
      proofPurpose: 'assertionMethod',
      verificationMethod: mockDIDs.externalAuditor.verificationMethod,
      jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..M8wY2nP4xL9qRnN1hS5fK7dT0yI3aL6bW9sE5gV4fQ2oK8pJ9rX0wF5uT3mL8vN2dK5wM4pZ2iY7hU4sC1bBh'
    },
    hcsTopicId: '0.0.789012',
    hcsMessageId: '1699459520.234567890',
    hcsTimestamp: '2024-11-08T14:45:20.234567890Z',
    hashScanUrl: 'https://hashscan.io/mainnet/topic/0.0.789012/message/1699459520.234567890'
  },

  {
    id: 'vc:profit-calculation-2024-q1',
    type: ['VerifiableCredential', 'ProfitCalculationCredential'],
    issuer: mockDIDs.qatarBank,
    issuanceDate: '2024-11-09T09:00:00Z',
    credentialSubject: {
      id: mockDIDs.qatarBank.id,
      action: 'Quarterly Profit Calculation',
      details: {
        quarter: 'Q1 2024',
        totalRevenue: 150000,
        expenses: 30000,
        netProfit: 120000,
        rabbulMaalShare: 48000, // 40%
        mudaribShare: 72000, // 60%
        profitSharingRatio: '60/40',
        calculationMethod: 'AAOIFI SS-13 §8/1',
        capitalStatus: 'Maintained (no impairment)'
      },
      contractId: 'MUD-2024-001',
      policyId: 'guardian-policy-islamic-finance-v1.0'
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2024-11-09T09:00:25Z',
      proofPurpose: 'assertionMethod',
      verificationMethod: mockDIDs.qatarBank.verificationMethod,
      jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..N9xZ3oQ5yM0rSoO2iT6gL8eU1zJ4bM7dX0tF6hW5gR3pL9qK0sY1xG6vU4nM9wO3eL6xN5qA3jZ8iV5tD2cCi'
    },
    hcsTopicId: '0.0.789012',
    hcsMessageId: '1699525225.345678901',
    hcsTimestamp: '2024-11-09T09:00:25.345678901Z',
    hashScanUrl: 'https://hashscan.io/mainnet/topic/0.0.789012/message/1699525225.345678901'
  },

  {
    id: 'vc:compliance-attestation-2024-001',
    type: ['VerifiableCredential', 'ComplianceAttestationCredential'],
    issuer: mockDIDs.guardianSystem,
    issuanceDate: '2024-11-09T16:30:00Z',
    credentialSubject: {
      id: mockDIDs.qatarBank.id,
      action: 'Full Compliance Attestation',
      details: {
        standards: ['AAOIFI SS-13', 'QCB Guidelines', 'QFCRA Islamic Finance Rulebook'],
        controlsTested: 8,
        controlsPassed: 8,
        hardGatesPassed: 1,
        complianceScore: 100,
        attestationPeriod: 'Q1 2024',
        verifiedBy: [
          mockDIDs.shariahBoard.name,
          mockDIDs.externalAuditor.name
        ]
      },
      contractId: 'MUD-2024-001',
      policyId: 'guardian-policy-islamic-finance-v1.0'
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2024-11-09T16:30:35Z',
      proofPurpose: 'assertionMethod',
      verificationMethod: mockDIDs.guardianSystem.verificationMethod,
      jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..O0yA4pR6zN1sTpP3jU7hM9fV2aK5cN8eY1uG7iX6hS4qM0rL1tZ2yH7wV5oN0xP4fM7yO6rB4kA9jW6uE3dDj'
    },
    hcsTopicId: '0.0.789012',
    hcsMessageId: '1699552235.456789012',
    hcsTimestamp: '2024-11-09T16:30:35.456789012Z',
    hashScanUrl: 'https://hashscan.io/mainnet/topic/0.0.789012/message/1699552235.456789012'
  }
]

// ============================================================================
// MOCK TRUST CHAIN - Sequential Flow from Action to Verification
// ============================================================================

export const mockTrustChain: TrustChainStep[] = [
  {
    id: 'step-1',
    timestamp: '2024-11-08T10:30:00Z',
    actor: mockDIDs.shariahBoard,
    action: 'Shariah Board Approval',
    credentialIssued: mockVCs[0],
    status: 'completed',
    verifiedBy: [mockDIDs.qcbRegulator],
    dependencies: []
  },

  {
    id: 'step-2',
    timestamp: '2024-11-08T14:45:00Z',
    actor: mockDIDs.externalAuditor,
    action: 'Capital Verification',
    credentialIssued: mockVCs[1],
    status: 'completed',
    verifiedBy: [mockDIDs.qcbRegulator, mockDIDs.investor],
    dependencies: ['step-1']
  },

  {
    id: 'step-3',
    timestamp: '2024-11-09T09:00:00Z',
    actor: mockDIDs.qatarBank,
    action: 'Quarterly Profit Calculation',
    credentialIssued: mockVCs[2],
    status: 'completed',
    verifiedBy: [mockDIDs.shariahBoard, mockDIDs.externalAuditor],
    dependencies: ['step-1', 'step-2']
  },

  {
    id: 'step-4',
    timestamp: '2024-11-09T16:30:00Z',
    actor: mockDIDs.guardianSystem,
    action: 'Full Compliance Attestation',
    credentialIssued: mockVCs[3],
    status: 'completed',
    verifiedBy: [mockDIDs.investor, mockDIDs.qcbRegulator],
    dependencies: ['step-1', 'step-2', 'step-3']
  }
]

// ============================================================================
// MOCK EXTERNAL VERIFICATIONS - How External Parties Verify VCs
// ============================================================================

export const mockExternalVerifications: ExternalVerification[] = [
  {
    id: 'verify-1',
    verifier: mockDIDs.investor,
    credentialId: 'vc:capital-verification-2024-001',
    verificationTimestamp: '2024-11-08T15:00:00Z',
    verificationMethod: 'hashscan',
    result: 'valid',
    notes: 'Verified capital delivery via HashScan. Credential signature valid, HCS timestamp confirmed.'
  },

  {
    id: 'verify-2',
    verifier: mockDIDs.qcbRegulator,
    credentialId: 'vc:mudarabah-contract-approval-2024-001',
    verificationTimestamp: '2024-11-08T11:00:00Z',
    verificationMethod: 'guardian-api',
    result: 'valid',
    notes: 'Shariah Board approval verified via Guardian API. All board members confirmed.'
  },

  {
    id: 'verify-3',
    verifier: mockDIDs.investor,
    credentialId: 'vc:compliance-attestation-2024-001',
    verificationTimestamp: '2024-11-09T17:00:00Z',
    verificationMethod: 'did-resolver',
    result: 'valid',
    notes: 'Full compliance attestation verified. Ready to proceed with investment.'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getVCById(vcId: string): VerifiableCredential | undefined {
  return mockVCs.find(vc => vc.id === vcId)
}

export function getDIDById(didId: string): HederaDID | undefined {
  return Object.values(mockDIDs).find(did => did.id === didId)
}

export function getTrustChainStepById(stepId: string): TrustChainStep | undefined {
  return mockTrustChain.find(step => step.id === stepId)
}

export function getVerificationsForVC(vcId: string): ExternalVerification[] {
  return mockExternalVerifications.filter(v => v.credentialId === vcId)
}

export function getVCsForDID(didId: string): VerifiableCredential[] {
  return mockVCs.filter(vc => vc.credentialSubject.id === didId || vc.issuer.id === didId)
}
