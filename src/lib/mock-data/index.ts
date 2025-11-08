/**
 * MOCK DATA INDEX
 * Central export for all demo mock data
 *
 * Provides realistic Islamic finance demo data:
 * - 5 deals (Sukuk, Murabaha, Ijara, Musharaka) at various stages
 * - 8+ task cards showing AI automation capabilities
 * - 50+ evidence artifacts from multiple sources
 * - 15+ Verifiable Credentials with Hedera blockchain anchoring
 *
 * All data aligned to IFSB/AAOIFI/BNM/FATF/ICMA standards
 */

// Deals
export {
  mockDeals,
  getDealById,
  getDealsByStatus,
  getDealsByPhase,
  getDealsWithBlockers,
  getDealComplianceScore
} from './deals'

// Tasks
export {
  mockTasks,
  getTaskById,
  getTasksByDeal,
  getTasksByPriority,
  getTasksByStatus,
  getBlockedTasks,
  getCriticalTasks,
  getTasksWithProposedFix
} from './tasks'

// Evidence
export {
  mockEvidence,
  getEvidenceByDeal,
  getEvidenceBySource,
  getEvidenceByStatus,
  getEvidenceByType,
  getBlockchainEvidence,
  getAgentCollectedEvidence,
  getStaleEvidence,
  getMissingEvidence
} from './evidence'

// Verifiable Credentials
export {
  mockCredentials,
  getCredentialById,
  getCredentialsByDeal,
  getCredentialsByControl,
  getCredentialsByBucket,
  getCredentialsByType,
  getCredentialsByStatus,
  verifyCredentialOnHedera,
  getSelectiveDisclosureView
} from './credentials'

// Summary Statistics (for dashboard)
export const mockDataStats = {
  totalDeals: 5,
  activeDeals: 3,
  completedDeals: 1,
  blockedDeals: 1,
  totalTasks: 8,
  criticalTasks: 1,
  blockedTasks: 3,
  tasksWithAIFix: 6,
  totalEvidence: 50,
  agentCollectedEvidence: 15,
  blockchainVCs: 15,
  totalControls: 26,
  averageCompliance: 76.2
} as const

// Demo scenarios (for guided tours)
export const demoScenarios = {
  happyPath: {
    name: 'Green Sukuk - Near Complete',
    dealId: 'deal-001',
    description: 'Well-progressing deal with minor blockers (88% complete)',
    keyFeatures: [
      'AI-generated EDD compliance memo',
      'Automated RoR risk monitoring',
      'Green KPI tracking with external verification',
      'Blockchain-anchored Shariah approval VC'
    ]
  },
  blockedDeal: {
    name: 'Murabaha - Multiple Blockers',
    dealId: 'deal-002',
    description: 'Deal with critical compliance issues (62% complete)',
    keyFeatures: [
      'OFAC sanctions hit (critical blocker)',
      'Shariah review failed - asset ownership issue',
      'Credit rating below threshold',
      'Expired asset valuation'
    ]
  },
  perfectDeal: {
    name: 'Infrastructure Sukuk - Complete',
    dealId: 'deal-005',
    description: 'Fully compliant deal ready for audit (100% complete)',
    keyFeatures: [
      'All 26 controls passed',
      'Full VC set minted on Hedera',
      'Zero blockers',
      'Ready for regulator inspection'
    ]
  },
  earlyStage: {
    name: 'Musharaka - Just Started',
    dealId: 'deal-004',
    description: 'New deal in early stages (35% complete)',
    keyFeatures: [
      'Agent drafted SSB submission package',
      'Comparable fatwa analysis automated',
      'Profit-sharing calculation in progress',
      'Demonstrates deal creation workflow'
    ]
  }
} as const

// Agent automation showcase (for demo)
export const agentCapabilities = {
  evidenceCollection: {
    description: 'Agents automatically gather evidence from 5+ sources',
    examples: [
      'SharePoint document retrieval',
      'API-based sanctions screening',
      'Blockchain VC verification',
      'Bloomberg data integration',
      'PEP/KYC screening automation'
    ]
  },
  intelligentProposals: {
    description: 'AI generates contextual fix proposals with confidence scores',
    examples: [
      'Pre-filled EDD compliance memos',
      'Drafted SSB waiver requests',
      'Automated trustee reminders',
      'Credit mitigation recommendations',
      'Shariah review amendments'
    ]
  },
  blockchainProofs: {
    description: 'Immutable compliance proofs on Hedera',
    examples: [
      'W3C Verifiable Credentials',
      'Selective disclosure for privacy',
      'Hedera transaction anchoring',
      'Multi-party verification',
      'Tamper-proof audit trail'
    ]
  },
  standardsAlignment: {
    description: 'Deep knowledge of Islamic finance standards',
    examples: [
      'AAOIFI FAS/GS citations',
      'IFSB risk taxonomy (RoR, DCR, SNC)',
      'FATF AML/CFT compliance',
      'ICMA sustainability reporting',
      'BNM Shariah governance'
    ]
  }
} as const

// Control execution summary (for metrics)
export const controlExecutionSummary = {
  totalControls: 26,
  buckets: {
    shariah: { total: 5, automated: 2, verifiable: 5 },
    regulatory: { total: 5, automated: 4, verifiable: 5 },
    risk: { total: 5, automated: 3, verifiable: 4 },
    financial: { total: 6, automated: 4, verifiable: 6 },
    audit: { total: 5, automated: 2, verifiable: 5 }
  },
  automationRate: 58, // 15/26 controls can be automated
  verificationRate: 96, // 25/26 controls produce VCs
  averageExecutionTime: '4.2 hours', // AI reduces from 2 days to 4 hours
  evidenceSourcesPerControl: 3.8 // Average sources per control
} as const
