/**
 * MOCK VERIFIABLE CREDENTIALS
 * W3C-compliant VCs with Hedera blockchain anchoring
 * Demonstrates blockchain-backed proof of compliance
 */

import { VerifiableCredential } from '@/lib/types'

export const mockCredentials: VerifiableCredential[] = [
  // DEAL-001: Green Sukuk VCs
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "ShariahApprovalCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-11-01T09:00:00Z",

    "credentialSubject": {
      "controlId": "SG-01",
      "controlName": "SSB Mandate & Fatwa Issuance",
      "bucketId": 1,
      "bucketName": "Shariah Governance & Compliance",
      "dealId": "deal-001",
      "dealName": "Green Sukuk Issuance - Renewable Energy Portfolio",
      "productType": "Sukuk",
      "fatwaId": "SSB-2024-GS-001",
      "approvalDate": "2024-11-01T09:00:00Z",
      "approver": "Dr. Ahmed Al-Saleh (SSB Chairman)",
      "validUntil": "2025-11-01T09:00:00Z",
      "conditions": [
        "Asset ownership must transfer before sale",
        "Quarterly Shariah review required",
        "No prohibited investment sectors"
      ],
      "status": "approved",
      "evidenceHash": "sha256:a1b2c3d4e5f6...",
      "evidenceCount": 3
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-11-01T09:15:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.12345@1730462400.000"
    },

    "selectiveDisclosure": {
      "salt": "random-salt-123",
      "disclosures": ["conditions", "approver"] // These fields can be hidden
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "ShariahReviewCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-11-03T14:30:00Z",

    "credentialSubject": {
      "controlId": "SG-02",
      "controlName": "Shariah Compliance Review",
      "bucketId": 1,
      "bucketName": "Shariah Governance & Compliance",
      "dealId": "deal-001",
      "dealName": "Green Sukuk Issuance - Renewable Energy Portfolio",
      "productType": "Sukuk",
      "reviewPeriod": "2024-Q4",
      "reviewer": "Shariah Compliance Officer",
      "findingsCount": 0,
      "nonComplianceEvents": 0,
      "status": "approved",
      "reviewDate": "2024-11-03T14:30:00Z",
      "nextReview": "2025-02-03T00:00:00Z",
      "evidenceHash": "sha256:review123...",
      "evidenceCount": 5
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-11-03T14:35:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.12346@1730646900.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "KYCComplianceCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-11-02T10:00:00Z",

    "credentialSubject": {
      "controlId": "RL-01",
      "controlName": "Investor KYC/CDD",
      "bucketId": 2,
      "bucketName": "Regulatory & Legal Compliance",
      "dealId": "deal-001",
      "dealName": "Green Sukuk Issuance - Renewable Energy Portfolio",
      "productType": "Sukuk",
      "investorCount": 12,
      "kycCompletionRate": 100,
      "pepScreeningComplete": true,
      "sanctionsScreeningComplete": true,
      "eddRequired": 2,
      "eddCompleted": 0,
      "status": "conditional",
      "conditions": ["EDD pending for 2 high-risk investors"],
      "evidenceHash": "sha256:kyc456...",
      "evidenceCount": 24
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-11-02T10:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.12347@1730552400.000"
    },

    "selectiveDisclosure": {
      "salt": "random-salt-456",
      "disclosures": ["investorCount", "eddRequired"] // Can be hidden for customer view
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "FinancialReportingCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-11-02T14:00:00Z",

    "credentialSubject": {
      "controlId": "FR-01",
      "controlName": "AAOIFI FAS Compliance",
      "bucketId": 4,
      "bucketName": "Financial & Product Reporting",
      "dealId": "deal-001",
      "dealName": "Green Sukuk Issuance - Renewable Energy Portfolio",
      "productType": "Sukuk",
      "standard": "AAOIFI FAS 33 (Investment in Sukuk)",
      "reportingDate": "2024-11-02T00:00:00Z",
      "assetValuation": "$250M",
      "valuationMethod": "Fair value per FAS 33",
      "auditStatus": "Reviewed by external auditor",
      "status": "approved",
      "evidenceHash": "sha256:fas789...",
      "evidenceCount": 8
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-11-02T14:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.12348@1730566800.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "InternalAuditCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-11-01T15:00:00Z",

    "credentialSubject": {
      "controlId": "AA-01",
      "controlName": "Internal Audit (AAOIFI GS-12)",
      "bucketId": 5,
      "bucketName": "Audit & Assurance",
      "dealId": "deal-001",
      "dealName": "Green Sukuk Issuance - Renewable Energy Portfolio",
      "productType": "Sukuk",
      "auditScope": "Pre-issuance compliance review",
      "findingsCount": 2,
      "findings": [
        "Minor: KYC documentation missing expiry dates (2 investors)",
        "Observation: Consider quarterly Shariah review frequency"
      ],
      "recommendationsCount": 2,
      "status": "approved",
      "auditDate": "2024-11-01T15:00:00Z",
      "auditor": "Internal Audit Department",
      "evidenceHash": "sha256:audit321...",
      "evidenceCount": 12
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-11-01T15:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.12349@1730473500.000"
    },

    "selectiveDisclosure": {
      "salt": "random-salt-789",
      "disclosures": ["findings", "auditor"] // Internal details can be hidden
    }
  },

  // DEAL-003: Ijara VCs (Complete Deal)
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "ShariahApprovalCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-10-15T09:00:00Z",

    "credentialSubject": {
      "controlId": "SG-01",
      "controlName": "SSB Mandate & Fatwa Issuance",
      "bucketId": 1,
      "bucketName": "Shariah Governance & Compliance",
      "dealId": "deal-003",
      "dealName": "Ijara Muntahia Bittamleek - Aircraft Leasing",
      "productType": "Ijara",
      "fatwaId": "SSB-2024-IJ-003",
      "approvalDate": "2024-10-15T09:00:00Z",
      "approver": "Dr. Ahmed Al-Saleh (SSB Chairman)",
      "validUntil": "2025-10-15T09:00:00Z",
      "conditions": [
        "Asset must remain owned by lessor until final payment",
        "Maintenance obligations per AAOIFI SS 9",
        "Annual Shariah audit required"
      ],
      "status": "approved",
      "evidenceHash": "sha256:ijara123...",
      "evidenceCount": 4
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-10-15T09:15:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.23456@1728990000.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "ShariahReviewCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-10-25T11:00:00Z",

    "credentialSubject": {
      "controlId": "SG-02",
      "controlName": "Shariah Compliance Review",
      "bucketId": 1,
      "bucketName": "Shariah Governance & Compliance",
      "dealId": "deal-003",
      "dealName": "Ijara Muntahia Bittamleek - Aircraft Leasing",
      "productType": "Ijara",
      "reviewPeriod": "2024-Q4",
      "reviewer": "Shariah Compliance Officer",
      "findingsCount": 0,
      "nonComplianceEvents": 0,
      "status": "approved",
      "reviewDate": "2024-10-25T11:00:00Z",
      "nextReview": "2025-01-25T00:00:00Z",
      "evidenceHash": "sha256:ijarareview456...",
      "evidenceCount": 6
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-10-25T11:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.34567@1729612800.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "KYCComplianceCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-10-16T13:00:00Z",

    "credentialSubject": {
      "controlId": "RL-01",
      "controlName": "Investor KYC/CDD",
      "bucketId": 2,
      "bucketName": "Regulatory & Legal Compliance",
      "dealId": "deal-003",
      "dealName": "Ijara Muntahia Bittamleek - Aircraft Leasing",
      "productType": "Ijara",
      "investorCount": 8,
      "kycCompletionRate": 100,
      "pepScreeningComplete": true,
      "sanctionsScreeningComplete": true,
      "eddRequired": 0,
      "eddCompleted": 0,
      "status": "approved",
      "evidenceHash": "sha256:ijarakyc789...",
      "evidenceCount": 16
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-10-16T13:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.23457@1729083600.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "SanctionsScreeningCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-10-22T09:00:00Z",

    "credentialSubject": {
      "controlId": "RL-03",
      "controlName": "Sanctions & Watchlist Screening",
      "bucketId": 2,
      "bucketName": "Regulatory & Legal Compliance",
      "dealId": "deal-003",
      "dealName": "Ijara Muntahia Bittamleek - Aircraft Leasing",
      "productType": "Ijara",
      "screenedParties": 8,
      "ofacHits": 0,
      "unHits": 0,
      "euHits": 0,
      "status": "approved",
      "screeningDate": "2024-10-22T09:00:00Z",
      "nextScreening": "2025-01-22T00:00:00Z",
      "evidenceHash": "sha256:sanctions123...",
      "evidenceCount": 8
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-10-22T09:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.23458@1729587600.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "FinancialReportingCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-10-17T14:00:00Z",

    "credentialSubject": {
      "controlId": "FR-01",
      "controlName": "AAOIFI FAS Compliance",
      "bucketId": 4,
      "bucketName": "Financial & Product Reporting",
      "dealId": "deal-003",
      "dealName": "Ijara Muntahia Bittamleek - Aircraft Leasing",
      "productType": "Ijara",
      "standard": "AAOIFI FAS 8 (Ijarah and Ijarah Muntahia Bittamleek)",
      "reportingDate": "2024-10-17T00:00:00Z",
      "assetValuation": "$150M",
      "valuationMethod": "Depreciated cost per FAS 8",
      "auditStatus": "Reviewed by external auditor",
      "status": "approved",
      "evidenceHash": "sha256:ijarafas456...",
      "evidenceCount": 6
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-10-17T14:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.23459@1729173600.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "InternalAuditCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-10-18T15:00:00Z",

    "credentialSubject": {
      "controlId": "AA-01",
      "controlName": "Internal Audit (AAOIFI GS-12)",
      "bucketId": 5,
      "bucketName": "Audit & Assurance",
      "dealId": "deal-003",
      "dealName": "Ijara Muntahia Bittamleek - Aircraft Leasing",
      "productType": "Ijara",
      "auditScope": "Pre-issuance compliance review",
      "findingsCount": 0,
      "recommendationsCount": 1,
      "recommendations": ["Consider insurance coverage review frequency (currently annual)"],
      "status": "approved",
      "auditDate": "2024-10-18T15:00:00Z",
      "auditor": "Internal Audit Department",
      "evidenceHash": "sha256:ijaraaudit789...",
      "evidenceCount": 10
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-10-18T15:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.23460@1729260300.000"
    }
  },

  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://zeroh.io/credentials/v1"
    ],
    "type": ["VerifiableCredential", "ShariahAuditCredential"],
    "issuer": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH",
    "issuanceDate": "2024-10-25T09:00:00Z",

    "credentialSubject": {
      "controlId": "AA-02",
      "controlName": "Shariah Audit (AAOIFI GS-3)",
      "bucketId": 5,
      "bucketName": "Audit & Assurance",
      "dealId": "deal-003",
      "dealName": "Ijara Muntahia Bittamleek - Aircraft Leasing",
      "productType": "Ijara",
      "auditScope": "Independent Shariah audit per AAOIFI GS-3/GS-11",
      "findingsCount": 0,
      "nonComplianceEvents": 0,
      "status": "approved",
      "auditDate": "2024-10-25T09:00:00Z",
      "auditor": "External Shariah Auditor",
      "nextAudit": "2025-10-25T00:00:00Z",
      "evidenceHash": "sha256:shariahaudit321...",
      "evidenceCount": 14
    },

    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-10-25T09:05:00Z",
      "verificationMethod": "did:hedera:mainnet:z6MkrCDRw9Y8GvQHPaS8Uqr5d3KfJnBjVr4p2JKnPxGkS1dH#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19...",
      "hederaTxId": "0.0.34567@1729612800.000"
    }
  }
]

// Utility functions
export const getCredentialById = (vcId: string): VerifiableCredential | undefined => {
  // Extract VC ID from credentialSubject if it has one
  return mockCredentials.find(vc =>
    vc.credentialSubject.controlId && vc.credentialSubject.dealId &&
    `vc-${vc.credentialSubject.controlId.toLowerCase()}-${vc.credentialSubject.dealId}` === vcId
  )
}

export const getCredentialsByDeal = (dealId: string): VerifiableCredential[] => {
  return mockCredentials.filter(vc => vc.credentialSubject.dealId === dealId)
}

export const getCredentialsByControl = (controlId: string): VerifiableCredential[] => {
  return mockCredentials.filter(vc => vc.credentialSubject.controlId === controlId)
}

export const getCredentialsByBucket = (bucketId: number): VerifiableCredential[] => {
  return mockCredentials.filter(vc => vc.credentialSubject.bucketId === bucketId)
}

export const getCredentialsByType = (type: string): VerifiableCredential[] => {
  return mockCredentials.filter(vc => vc.type.includes(type))
}

export const getCredentialsByStatus = (status: string): VerifiableCredential[] => {
  return mockCredentials.filter(vc => vc.credentialSubject.status === status)
}

export const verifyCredentialOnHedera = async (hederaTxId: string): Promise<boolean> => {
  // Mock verification - in production, this would query Hedera Hashgraph
  console.log(`Verifying credential on Hedera: ${hederaTxId}`)
  return true
}

export const getSelectiveDisclosureView = (
  vc: VerifiableCredential,
  hiddenFields: string[] = []
): VerifiableCredential => {
  // Create customer view with selective disclosure
  const customerView = { ...vc }

  if (vc.selectiveDisclosure && vc.selectiveDisclosure.disclosures) {
    hiddenFields.forEach(field => {
      if (customerView.credentialSubject[field]) {
        customerView.credentialSubject[field] = '[REDACTED]'
      }
    })
  }

  return customerView
}
