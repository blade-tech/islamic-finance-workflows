/**
 * MOCK DEALS
 * Realistic Islamic finance deals for demo
 * Aligned to IFSB/AAOIFI/BNM standards
 */

import { Deal } from '@/lib/types'

// Re-export the Deal type for convenience
export type { Deal }

export const mockDeals: Deal[] = [
  // Deal 1: Sukuk Issuance (High Progress)
  {
    dealId: 'deal-001',
    dealName: 'Green Sukuk Issuance - Renewable Energy Portfolio',
    productType: 'Sukuk',
    status: 'in_progress',
    phase: 'issuance',

    compliance: {
      overall: 88,
      buckets: {
        shariah: 95,      // Strong Shariah approval
        regulatory: 85,   // Minor AML gaps
        risk: 82,         // RoR/DCR monitoring in progress
        financial: 90,    // Good UoP reporting
        audit: 85         // Shariah audit complete
      }
    },

    controls: [
      // Shariah Governance (5 controls)
      { controlId: 'SG-01', status: 'passed', lastExecuted: '2024-11-01T09:00:00Z', kri: 100, vcId: 'vc-sg-01-deal-001' },
      { controlId: 'SG-02', status: 'passed', lastExecuted: '2024-11-03T14:30:00Z', kri: 100, vcId: 'vc-sg-02-deal-001' },
      { controlId: 'SG-03', status: 'in_progress', kri: 75 },
      { controlId: 'SG-04', status: 'passed', lastExecuted: '2024-11-05T11:00:00Z', kri: 100, vcId: 'vc-sg-04-deal-001' },
      { controlId: 'SG-05', status: 'passed', lastExecuted: '2024-11-06T16:00:00Z', kri: 100 },

      // Regulatory & Legal (5 controls)
      { controlId: 'RL-01', status: 'passed', lastExecuted: '2024-11-02T10:00:00Z', kri: 100, vcId: 'vc-rl-01-deal-001' },
      { controlId: 'RL-02', status: 'in_progress', kri: 60 },
      { controlId: 'RL-03', status: 'passed', lastExecuted: '2024-11-04T13:00:00Z', kri: 100 },
      { controlId: 'RL-04', status: 'passed', lastExecuted: '2024-11-05T15:00:00Z', kri: 100 },
      { controlId: 'RL-05', status: 'passed', lastExecuted: '2024-11-06T09:00:00Z', kri: 100 },

      // Risk Management (5 controls)
      { controlId: 'RM-01', status: 'passed', lastExecuted: '2024-11-03T08:00:00Z', kri: 95 },
      { controlId: 'RM-02', status: 'passed', lastExecuted: '2024-11-04T10:00:00Z', kri: 90 },
      { controlId: 'RM-03', status: 'in_progress', kri: 70 },
      { controlId: 'RM-04', status: 'in_progress', kri: 75 },
      { controlId: 'RM-05', status: 'passed', lastExecuted: '2024-11-05T12:00:00Z', kri: 100 },

      // Financial & Product Reporting (6 controls)
      { controlId: 'FR-01', status: 'passed', lastExecuted: '2024-11-02T14:00:00Z', kri: 100, vcId: 'vc-fr-01-deal-001' },
      { controlId: 'FR-02', status: 'passed', lastExecuted: '2024-11-03T16:00:00Z', kri: 100 },
      { controlId: 'FR-03', status: 'passed', lastExecuted: '2024-11-04T11:00:00Z', kri: 95 },
      { controlId: 'FR-04', status: 'passed', lastExecuted: '2024-11-05T14:00:00Z', kri: 90 },
      { controlId: 'FR-05', status: 'passed', lastExecuted: '2024-11-06T10:00:00Z', kri: 100 },
      { controlId: 'FR-06', status: 'in_progress', kri: 80 },

      // Audit & Assurance (5 controls)
      { controlId: 'AA-01', status: 'passed', lastExecuted: '2024-11-01T15:00:00Z', kri: 100, vcId: 'vc-aa-01-deal-001' },
      { controlId: 'AA-02', status: 'passed', lastExecuted: '2024-11-03T09:00:00Z', kri: 100 },
      { controlId: 'AA-03', status: 'in_progress', kri: 70 },
      { controlId: 'AA-04', status: 'passed', lastExecuted: '2024-11-05T13:00:00Z', kri: 100 },
      { controlId: 'AA-05', status: 'not_started', nextExecution: '2024-11-20T00:00:00Z' }
    ],

    blockers: [
      {
        controlId: 'RL-02',
        severity: 'high',
        description: 'Enhanced CDD pending for 2 investors (FATF Rec 10)',
        since: '2024-11-04T00:00:00Z',
        assignedTo: 'Compliance Officer'
      },
      {
        controlId: 'RM-03',
        severity: 'medium',
        description: 'RoR benchmark data incomplete for Q4 projection',
        since: '2024-11-05T00:00:00Z',
        assignedTo: 'Risk Manager'
      }
    ]
  },

  // Deal 2: Murabaha Financing (Blocked)
  {
    dealId: 'deal-002',
    dealName: 'Commodity Murabaha - Corporate Working Capital',
    productType: 'Murabaha',
    status: 'in_progress',
    phase: 'pre-issuance',

    compliance: {
      overall: 62,
      buckets: {
        shariah: 60,      // Missing fatwa conditions
        regulatory: 70,   // KYC complete but sanctions pending
        risk: 55,         // Credit risk assessment incomplete
        financial: 65,    // Asset valuation pending
        audit: 60         // Internal audit incomplete
      }
    },

    controls: [
      // Shariah Governance
      { controlId: 'SG-01', status: 'conditional', lastExecuted: '2024-10-28T09:00:00Z', kri: 80, vcId: 'vc-sg-01-deal-002' },
      { controlId: 'SG-02', status: 'failed', lastExecuted: '2024-10-30T10:00:00Z', kri: 40 },
      { controlId: 'SG-03', status: 'not_started' },
      { controlId: 'SG-04', status: 'in_progress', kri: 50 },
      { controlId: 'SG-05', status: 'passed', lastExecuted: '2024-11-01T14:00:00Z', kri: 100 },

      // Regulatory & Legal
      { controlId: 'RL-01', status: 'passed', lastExecuted: '2024-10-29T11:00:00Z', kri: 100 },
      { controlId: 'RL-02', status: 'in_progress', kri: 65 },
      { controlId: 'RL-03', status: 'failed', lastExecuted: '2024-11-02T15:00:00Z', kri: 30 },
      { controlId: 'RL-04', status: 'passed', lastExecuted: '2024-11-03T10:00:00Z', kri: 100 },
      { controlId: 'RL-05', status: 'in_progress', kri: 55 },

      // Risk Management
      { controlId: 'RM-01', status: 'in_progress', kri: 60 },
      { controlId: 'RM-02', status: 'failed', lastExecuted: '2024-11-01T09:00:00Z', kri: 35 },
      { controlId: 'RM-03', status: 'not_started' },
      { controlId: 'RM-04', status: 'not_started' },
      { controlId: 'RM-05', status: 'passed', lastExecuted: '2024-11-04T13:00:00Z', kri: 100 },

      // Financial & Product Reporting
      { controlId: 'FR-01', status: 'in_progress', kri: 50 },
      { controlId: 'FR-02', status: 'passed', lastExecuted: '2024-11-02T16:00:00Z', kri: 100 },
      { controlId: 'FR-03', status: 'failed', lastExecuted: '2024-11-03T11:00:00Z', kri: 40 },
      { controlId: 'FR-04', status: 'in_progress', kri: 60 },
      { controlId: 'FR-05', status: 'passed', lastExecuted: '2024-11-05T09:00:00Z', kri: 100 },
      { controlId: 'FR-06', status: 'not_started' },

      // Audit & Assurance
      { controlId: 'AA-01', status: 'in_progress', kri: 55 },
      { controlId: 'AA-02', status: 'passed', lastExecuted: '2024-10-31T14:00:00Z', kri: 100 },
      { controlId: 'AA-03', status: 'not_started' },
      { controlId: 'AA-04', status: 'in_progress', kri: 45 },
      { controlId: 'AA-05', status: 'not_started' }
    ],

    blockers: [
      {
        controlId: 'SG-02',
        severity: 'critical',
        description: 'Shariah review flagged asset ownership transfer mechanism - needs SSB re-approval',
        since: '2024-10-30T00:00:00Z',
        assignedTo: 'Shariah Officer'
      },
      {
        controlId: 'RL-03',
        severity: 'critical',
        description: 'Counterparty on OFAC sanctions list - deal cannot proceed',
        since: '2024-11-02T00:00:00Z',
        assignedTo: 'Compliance Officer'
      },
      {
        controlId: 'RM-02',
        severity: 'high',
        description: 'Credit rating below investment grade threshold (BB+ vs BBB- required)',
        since: '2024-11-01T00:00:00Z',
        assignedTo: 'Risk Manager'
      },
      {
        controlId: 'FR-03',
        severity: 'high',
        description: 'Asset valuation report expired (>90 days old per AAOIFI FAS 28)',
        since: '2024-11-03T00:00:00Z',
        assignedTo: 'Finance Manager'
      }
    ]
  },

  // Deal 3: Ijara Lease (Near Complete)
  {
    dealId: 'deal-003',
    dealName: 'Ijara Muntahia Bittamleek - Aircraft Leasing',
    productType: 'Ijara',
    status: 'in_progress',
    phase: 'post-issuance',

    compliance: {
      overall: 96,
      buckets: {
        shariah: 100,
        regulatory: 95,
        risk: 92,
        financial: 98,
        audit: 95
      }
    },

    controls: [
      // All Shariah controls passed
      { controlId: 'SG-01', status: 'passed', lastExecuted: '2024-10-15T09:00:00Z', kri: 100, vcId: 'vc-sg-01-deal-003' },
      { controlId: 'SG-02', status: 'passed', lastExecuted: '2024-10-18T14:00:00Z', kri: 100, vcId: 'vc-sg-02-deal-003' },
      { controlId: 'SG-03', status: 'passed', lastExecuted: '2024-10-25T11:00:00Z', kri: 100, vcId: 'vc-sg-03-deal-003' },
      { controlId: 'SG-04', status: 'passed', lastExecuted: '2024-10-28T16:00:00Z', kri: 100, vcId: 'vc-sg-04-deal-003' },
      { controlId: 'SG-05', status: 'passed', lastExecuted: '2024-11-01T10:00:00Z', kri: 100 },

      // Regulatory & Legal
      { controlId: 'RL-01', status: 'passed', lastExecuted: '2024-10-16T13:00:00Z', kri: 100, vcId: 'vc-rl-01-deal-003' },
      { controlId: 'RL-02', status: 'passed', lastExecuted: '2024-10-20T15:00:00Z', kri: 100, vcId: 'vc-rl-02-deal-003' },
      { controlId: 'RL-03', status: 'passed', lastExecuted: '2024-10-22T09:00:00Z', kri: 100 },
      { controlId: 'RL-04', status: 'passed', lastExecuted: '2024-10-26T14:00:00Z', kri: 100 },
      { controlId: 'RL-05', status: 'in_progress', kri: 85 },

      // Risk Management
      { controlId: 'RM-01', status: 'passed', lastExecuted: '2024-10-19T11:00:00Z', kri: 100 },
      { controlId: 'RM-02', status: 'passed', lastExecuted: '2024-10-23T13:00:00Z', kri: 95 },
      { controlId: 'RM-03', status: 'passed', lastExecuted: '2024-10-27T10:00:00Z', kri: 90 },
      { controlId: 'RM-04', status: 'passed', lastExecuted: '2024-10-30T15:00:00Z', kri: 85 },
      { controlId: 'RM-05', status: 'passed', lastExecuted: '2024-11-02T09:00:00Z', kri: 100 },

      // Financial & Product Reporting
      { controlId: 'FR-01', status: 'passed', lastExecuted: '2024-10-17T14:00:00Z', kri: 100, vcId: 'vc-fr-01-deal-003' },
      { controlId: 'FR-02', status: 'passed', lastExecuted: '2024-10-21T16:00:00Z', kri: 100 },
      { controlId: 'FR-03', status: 'passed', lastExecuted: '2024-10-24T11:00:00Z', kri: 100 },
      { controlId: 'FR-04', status: 'passed', lastExecuted: '2024-10-29T13:00:00Z', kri: 95 },
      { controlId: 'FR-05', status: 'passed', lastExecuted: '2024-11-03T10:00:00Z', kri: 100 },
      { controlId: 'FR-06', status: 'passed', lastExecuted: '2024-11-05T14:00:00Z', kri: 100 },

      // Audit & Assurance
      { controlId: 'AA-01', status: 'passed', lastExecuted: '2024-10-18T15:00:00Z', kri: 100, vcId: 'vc-aa-01-deal-003' },
      { controlId: 'AA-02', status: 'passed', lastExecuted: '2024-10-25T09:00:00Z', kri: 100, vcId: 'vc-aa-02-deal-003' },
      { controlId: 'AA-03', status: 'passed', lastExecuted: '2024-11-01T14:00:00Z', kri: 100 },
      { controlId: 'AA-04', status: 'passed', lastExecuted: '2024-11-04T11:00:00Z', kri: 100 },
      { controlId: 'AA-05', status: 'in_progress', kri: 80 }
    ],

    blockers: [
      {
        controlId: 'RL-05',
        severity: 'low',
        description: 'Annual trustee report due Nov 15 - automated reminder sent',
        since: '2024-11-05T00:00:00Z',
        assignedTo: 'Legal Counsel'
      }
    ]
  },

  // Deal 4: Musharaka Partnership (Early Stage)
  {
    dealId: 'deal-004',
    dealName: 'Diminishing Musharaka - Real Estate Development',
    productType: 'Musharaka',
    status: 'draft',
    phase: 'pre-issuance',

    compliance: {
      overall: 35,
      buckets: {
        shariah: 40,
        regulatory: 30,
        risk: 25,
        financial: 45,
        audit: 35
      }
    },

    controls: [
      // Most controls not started
      { controlId: 'SG-01', status: 'in_progress', kri: 50 },
      { controlId: 'SG-02', status: 'not_started' },
      { controlId: 'SG-03', status: 'not_started' },
      { controlId: 'SG-04', status: 'not_started' },
      { controlId: 'SG-05', status: 'in_progress', kri: 30 },

      { controlId: 'RL-01', status: 'in_progress', kri: 40 },
      { controlId: 'RL-02', status: 'not_started' },
      { controlId: 'RL-03', status: 'not_started' },
      { controlId: 'RL-04', status: 'not_started' },
      { controlId: 'RL-05', status: 'not_started' },

      { controlId: 'RM-01', status: 'in_progress', kri: 30 },
      { controlId: 'RM-02', status: 'not_started' },
      { controlId: 'RM-03', status: 'not_started' },
      { controlId: 'RM-04', status: 'not_started' },
      { controlId: 'RM-05', status: 'in_progress', kri: 20 },

      { controlId: 'FR-01', status: 'in_progress', kri: 45 },
      { controlId: 'FR-02', status: 'in_progress', kri: 50 },
      { controlId: 'FR-03', status: 'not_started' },
      { controlId: 'FR-04', status: 'not_started' },
      { controlId: 'FR-05', status: 'not_started' },
      { controlId: 'FR-06', status: 'not_started' },

      { controlId: 'AA-01', status: 'in_progress', kri: 35 },
      { controlId: 'AA-02', status: 'not_started' },
      { controlId: 'AA-03', status: 'not_started' },
      { controlId: 'AA-04', status: 'not_started' },
      { controlId: 'AA-05', status: 'not_started' }
    ],

    blockers: []
  },

  // Deal 5: Sukuk Al-Ijara (Complete - Ready for Audit)
  {
    dealId: 'deal-005',
    dealName: 'Sukuk Al-Ijara - Infrastructure Portfolio',
    productType: 'Sukuk',
    status: 'completed',
    phase: 'audit',

    compliance: {
      overall: 100,
      buckets: {
        shariah: 100,
        regulatory: 100,
        risk: 100,
        financial: 100,
        audit: 100
      }
    },

    controls: [
      // All controls passed with VCs minted
      { controlId: 'SG-01', status: 'passed', lastExecuted: '2024-09-15T09:00:00Z', kri: 100, vcId: 'vc-sg-01-deal-005' },
      { controlId: 'SG-02', status: 'passed', lastExecuted: '2024-09-18T14:00:00Z', kri: 100, vcId: 'vc-sg-02-deal-005' },
      { controlId: 'SG-03', status: 'passed', lastExecuted: '2024-09-25T11:00:00Z', kri: 100, vcId: 'vc-sg-03-deal-005' },
      { controlId: 'SG-04', status: 'passed', lastExecuted: '2024-09-28T16:00:00Z', kri: 100, vcId: 'vc-sg-04-deal-005' },
      { controlId: 'SG-05', status: 'passed', lastExecuted: '2024-10-01T10:00:00Z', kri: 100, vcId: 'vc-sg-05-deal-005' },

      { controlId: 'RL-01', status: 'passed', lastExecuted: '2024-09-16T13:00:00Z', kri: 100, vcId: 'vc-rl-01-deal-005' },
      { controlId: 'RL-02', status: 'passed', lastExecuted: '2024-09-20T15:00:00Z', kri: 100, vcId: 'vc-rl-02-deal-005' },
      { controlId: 'RL-03', status: 'passed', lastExecuted: '2024-09-22T09:00:00Z', kri: 100, vcId: 'vc-rl-03-deal-005' },
      { controlId: 'RL-04', status: 'passed', lastExecuted: '2024-09-26T14:00:00Z', kri: 100, vcId: 'vc-rl-04-deal-005' },
      { controlId: 'RL-05', status: 'passed', lastExecuted: '2024-09-30T11:00:00Z', kri: 100, vcId: 'vc-rl-05-deal-005' },

      { controlId: 'RM-01', status: 'passed', lastExecuted: '2024-09-19T11:00:00Z', kri: 100, vcId: 'vc-rm-01-deal-005' },
      { controlId: 'RM-02', status: 'passed', lastExecuted: '2024-09-23T13:00:00Z', kri: 100, vcId: 'vc-rm-02-deal-005' },
      { controlId: 'RM-03', status: 'passed', lastExecuted: '2024-09-27T10:00:00Z', kri: 100, vcId: 'vc-rm-03-deal-005' },
      { controlId: 'RM-04', status: 'passed', lastExecuted: '2024-09-29T15:00:00Z', kri: 100, vcId: 'vc-rm-04-deal-005' },
      { controlId: 'RM-05', status: 'passed', lastExecuted: '2024-10-02T09:00:00Z', kri: 100, vcId: 'vc-rm-05-deal-005' },

      { controlId: 'FR-01', status: 'passed', lastExecuted: '2024-09-17T14:00:00Z', kri: 100, vcId: 'vc-fr-01-deal-005' },
      { controlId: 'FR-02', status: 'passed', lastExecuted: '2024-09-21T16:00:00Z', kri: 100, vcId: 'vc-fr-02-deal-005' },
      { controlId: 'FR-03', status: 'passed', lastExecuted: '2024-09-24T11:00:00Z', kri: 100, vcId: 'vc-fr-03-deal-005' },
      { controlId: 'FR-04', status: 'passed', lastExecuted: '2024-09-28T13:00:00Z', kri: 100, vcId: 'vc-fr-04-deal-005' },
      { controlId: 'FR-05', status: 'passed', lastExecuted: '2024-10-01T10:00:00Z', kri: 100, vcId: 'vc-fr-05-deal-005' },
      { controlId: 'FR-06', status: 'passed', lastExecuted: '2024-10-03T14:00:00Z', kri: 100, vcId: 'vc-fr-06-deal-005' },

      { controlId: 'AA-01', status: 'passed', lastExecuted: '2024-09-18T15:00:00Z', kri: 100, vcId: 'vc-aa-01-deal-005' },
      { controlId: 'AA-02', status: 'passed', lastExecuted: '2024-09-25T09:00:00Z', kri: 100, vcId: 'vc-aa-02-deal-005' },
      { controlId: 'AA-03', status: 'passed', lastExecuted: '2024-10-01T14:00:00Z', kri: 100, vcId: 'vc-aa-03-deal-005' },
      { controlId: 'AA-04', status: 'passed', lastExecuted: '2024-10-04T11:00:00Z', kri: 100, vcId: 'vc-aa-04-deal-005' },
      { controlId: 'AA-05', status: 'passed', lastExecuted: '2024-10-07T16:00:00Z', kri: 100, vcId: 'vc-aa-05-deal-005' }
    ],

    blockers: []
  }
]

// Utility functions
export const getDealById = (dealId: string): Deal | undefined => {
  return mockDeals.find(d => d.dealId === dealId)
}

export const getDealsByStatus = (status: Deal['status']): Deal[] => {
  return mockDeals.filter(d => d.status === status)
}

export const getDealsByPhase = (phase: Deal['phase']): Deal[] => {
  return mockDeals.filter(d => d.phase === phase)
}

export const getDealsWithBlockers = (): Deal[] => {
  return mockDeals.filter(d => d.blockers.length > 0)
}

export const getDealComplianceScore = (dealId: string): number => {
  const deal = getDealById(dealId)
  return deal?.compliance.overall || 0
}
