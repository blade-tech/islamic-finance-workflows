/**
 * QATAR IJĀRAH STORE
 * ===================
 * Zustand store for Qatar Ijārah off-plan demo state management
 */

import { create } from 'zustand'
import type {
  IjarahProject,
  EscrowAccount,
  UnitSubLedger,
  ConstructionMilestone,
  ContractSuite,
  RentGate,
  LatePayment,
  TakafulPolicy,
  ControlExecution,
  GRCMetrics,
  SceneStatus,
  SceneId
} from './ijarah-types'
import { qatarIjarahControls } from './ijarah-controls'

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface IjarahStore {
  // Current Project
  currentProject: IjarahProject | null
  setCurrentProject: (project: IjarahProject) => void

  // Escrow
  escrowAccount: EscrowAccount | null
  unitSubLedgers: UnitSubLedger[]
  updateEscrowAccount: (account: EscrowAccount) => void
  addUnitSubLedger: (subLedger: UnitSubLedger) => void

  // Construction
  milestones: ConstructionMilestone[]
  addMilestone: (milestone: ConstructionMilestone) => void
  updateMilestone: (id: string, updates: Partial<ConstructionMilestone>) => void

  // Contracts
  contractSuite: ContractSuite | null
  setContractSuite: (suite: ContractSuite) => void

  // Rent Gating
  rentGate: RentGate | null
  updateRentGate: (updates: Partial<RentGate>) => void
  unlockRentGate: () => void

  // Late Payments
  latePayments: LatePayment[]
  addLatePayment: (payment: LatePayment) => void

  // Takaful
  takafulPolicies: TakafulPolicy[]
  addTakafulPolicy: (policy: TakafulPolicy) => void

  // Control Executions
  controlExecutions: ControlExecution[]
  executeControl: (execution: ControlExecution) => void

  // GRC Metrics
  grcMetrics: GRCMetrics | null
  calculateGRCMetrics: () => void

  // Scene Progress
  sceneStatuses: Record<SceneId, SceneStatus>
  markSceneCompleted: (sceneId: SceneId) => void
  updateSceneProgress: (sceneId: SceneId, progress: number) => void

  // Demo Actions
  loadDemoData: () => void
  resetDemo: () => void
}

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

function generateDemoProject(): IjarahProject {
  return {
    id: 'project-alpha',
    name: 'Al Khor Towers - Off-Plan Development',
    developerId: 'dev-001',
    developerName: 'Qatar Real Estate Development Co.',
    location: 'Al Khor, Qatar',
    totalUnits: 40,
    projectValue: 120000000, // QAR 120M
    currency: 'QAR',
    startDate: '2024-01-01',
    expectedCompletionDate: '2025-12-31',
    status: 'construction',
    authorityApprovals: [
      {
        id: 'approval-001',
        authority: 'RERA',
        approvalType: 'Development Permit',
        approvalNumber: 'RERA-2024-00123',
        approvalDate: '2023-12-15',
        documentUrl: '/evidence/rera-approval.pdf',
        verified: true
      },
      {
        id: 'approval-002',
        authority: 'Ministry_Municipality',
        approvalType: 'Building Permit',
        approvalNumber: 'BP-2024-00456',
        approvalDate: '2024-01-10',
        documentUrl: '/evidence/building-permit.pdf',
        verified: true
      }
    ],
    ssbApproval: {
      id: 'ssb-approval-001',
      decisionDate: '2024-02-01',
      unanimous: true,
      fatwaDocumentUrl: '/evidence/ssb-fatwa-project-alpha.pdf',
      conditions: [
        'Istisnā\' contract must specify clear construction milestones',
        'Wa\'d to lease must not be binding on both parties',
        'Ijārah to commence only after completion certificate'
      ],
      effectiveDate: '2024-02-15'
    },
    shariahPolicyManualUrl: '/evidence/shariah-policy-manual-project-alpha.pdf'
  }
}

function generateDemoEscrowAccount(): EscrowAccount {
  return {
    id: 'escrow-001',
    projectId: 'project-alpha',
    accountNumber: 'ESC-QA-2024-001',
    bankName: 'Qatar Islamic Bank',
    balance: 85000000, // QAR 85M
    totalDeposits: 90000000, // QAR 90M
    totalDisbursements: 5000000, // QAR 5M
    retentionAmount: 12000000, // 10% of QAR 120M
    retentionReleased: false,
    lastReconciliationDate: new Date().toISOString().split('T')[0],
    nonCompliantDeposits: 0
  }
}

function generateDemoRentGate(): RentGate {
  return {
    id: 'rent-gate-001',
    projectId: 'project-alpha',
    completionCertificate: {
      uploaded: false,
      verified: false
    },
    occupancyCertificate: {
      uploaded: false,
      verified: false
    },
    utilityActivation: {
      uploaded: false,
      verified: false
    },
    lessorTitle: {
      uploaded: false,
      verified: false
    },
    gateUnlocked: false,
    rentBillingActive: false,
    contractualStartDate: '2025-01-01'
  }
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useIjarahStore = create<IjarahStore>((set, get) => ({
  // ========================================================================
  // STATE
  // ========================================================================
  currentProject: null,
  escrowAccount: null,
  unitSubLedgers: [],
  milestones: [],
  contractSuite: null,
  rentGate: null,
  latePayments: [],
  takafulPolicies: [],
  controlExecutions: [],
  grcMetrics: null,
  sceneStatuses: {
    'project-setup': { sceneId: 'project-setup', completed: false, progress: 0 },
    'escrow-wiring': { sceneId: 'escrow-wiring', completed: false, progress: 0 },
    'construction-progress': { sceneId: 'construction-progress', completed: false, progress: 0 },
    'contract-integrity': { sceneId: 'contract-integrity', completed: false, progress: 0 },
    'rent-gating': { sceneId: 'rent-gating', completed: false, progress: 0 },
    'retention-tracker': { sceneId: 'retention-tracker', completed: false, progress: 0 },
    'late-payment': { sceneId: 'late-payment', completed: false, progress: 0 },
    'grc-dashboard': { sceneId: 'grc-dashboard', completed: false, progress: 0 }
  },

  // ========================================================================
  // ACTIONS
  // ========================================================================

  setCurrentProject: (project) => set({ currentProject: project }),

  updateEscrowAccount: (account) => set({ escrowAccount: account }),

  addUnitSubLedger: (subLedger) => set((state) => ({
    unitSubLedgers: [...state.unitSubLedgers, subLedger]
  })),

  addMilestone: (milestone) => set((state) => ({
    milestones: [...state.milestones, milestone]
  })),

  updateMilestone: (id, updates) => set((state) => ({
    milestones: state.milestones.map(m =>
      m.id === id ? { ...m, ...updates } : m
    )
  })),

  setContractSuite: (suite) => set({ contractSuite: suite }),

  updateRentGate: (updates) => set((state) => ({
    rentGate: state.rentGate ? { ...state.rentGate, ...updates } : null
  })),

  unlockRentGate: () => {
    const { rentGate } = get()
    if (!rentGate) return

    const allEvidenceUploaded =
      rentGate.completionCertificate.uploaded &&
      rentGate.occupancyCertificate.uploaded &&
      rentGate.utilityActivation.uploaded &&
      rentGate.lessorTitle.uploaded

    if (allEvidenceUploaded) {
      set((state) => ({
        rentGate: state.rentGate ? {
          ...state.rentGate,
          gateUnlocked: true,
          rentBillingActive: true
        } : null
      }))
    }
  },

  addLatePayment: (payment) => set((state) => ({
    latePayments: [...state.latePayments, payment]
  })),

  addTakafulPolicy: (policy) => set((state) => ({
    takafulPolicies: [...state.takafulPolicies, policy]
  })),

  executeControl: (execution) => set((state) => ({
    controlExecutions: [...state.controlExecutions, execution]
  })),

  calculateGRCMetrics: () => {
    const state = get()
    if (!state.currentProject) return

    const metrics: GRCMetrics = {
      projectId: state.currentProject.id,
      shariahLeaseGate: {
        id: 'kpi-shariah-lease-gate',
        name: 'Shariah Lease Gate',
        controlId: 'IJR-A1',
        status: state.rentGate?.gateUnlocked ? 'green' : 'red',
        value: state.rentGate?.gateUnlocked ? '100%' : '0%',
        description: '0 rents posted pre-handover',
        lastUpdated: new Date().toISOString(),
        clickThroughUrl: '/qatar-ijarah/rent-gating'
      },
      escrowCompliance: {
        id: 'kpi-escrow-compliance',
        name: 'Escrow Compliance',
        controlId: 'IJR-B6',
        status: state.escrowAccount?.nonCompliantDeposits === 0 ? 'green' : 'red',
        value: '100%',
        description: '100% deposits in compliance',
        lastUpdated: new Date().toISOString(),
        clickThroughUrl: '/qatar-ijarah/escrow-wiring'
      },
      authorityDisbursement: {
        id: 'kpi-authority-disbursement',
        name: 'Authority Disbursement Gating',
        controlId: 'IJR-B7',
        status: 'green',
        value: '<24h',
        description: 'SLA after Authority letter match',
        lastUpdated: new Date().toISOString(),
        clickThroughUrl: '/qatar-ijarah/construction-progress'
      },
      retentionLock: {
        id: 'kpi-retention-lock',
        name: 'Retention Lock',
        controlId: 'IJR-B10',
        status: state.escrowAccount?.retentionReleased ? 'red' : 'green',
        value: '10%',
        description: 'Retention balance locked until release',
        lastUpdated: new Date().toISOString(),
        clickThroughUrl: '/qatar-ijarah/retention-tracker'
      },
      ssbActions: {
        id: 'kpi-ssb-actions',
        name: 'SSB Actions',
        controlId: 'IJR-C15',
        status: state.currentProject?.ssbApproval ? 'green' : 'amber',
        value: '100%',
        description: 'Policy manual + fatwa registry current',
        lastUpdated: new Date().toISOString(),
        clickThroughUrl: '/ssb'
      },
      takafulStatus: {
        id: 'kpi-takaful-status',
        name: 'Takaful Status',
        controlId: 'IJR-A5',
        status: state.takafulPolicies.length > 0 ? 'green' : 'red',
        value: state.takafulPolicies.length > 0 ? 'Active' : 'Missing',
        description: 'Lessor-paid, renewal in 90 days',
        lastUpdated: new Date().toISOString(),
        clickThroughUrl: '/qatar-ijarah/project-setup'
      },
      amlKycCoverage: {
        id: 'kpi-aml-kyc-coverage',
        name: 'AML/KYC Coverage',
        controlId: 'IJR-B12',
        status: 'amber',
        value: '95%',
        description: '38/40 buyers verified, 2 pending',
        lastUpdated: new Date().toISOString(),
        clickThroughUrl: '/qatar-ijarah/escrow-wiring'
      }
    }

    set({ grcMetrics: metrics })
  },

  markSceneCompleted: (sceneId) => set((state) => ({
    sceneStatuses: {
      ...state.sceneStatuses,
      [sceneId]: {
        ...state.sceneStatuses[sceneId],
        completed: true,
        progress: 100,
        lastVisited: new Date().toISOString()
      }
    }
  })),

  updateSceneProgress: (sceneId, progress) => set((state) => ({
    sceneStatuses: {
      ...state.sceneStatuses,
      [sceneId]: {
        ...state.sceneStatuses[sceneId],
        progress,
        lastVisited: new Date().toISOString()
      }
    }
  })),

  // ========================================================================
  // DEMO DATA
  // ========================================================================

  loadDemoData: () => {
    const project = generateDemoProject()
    const escrowAccount = generateDemoEscrowAccount()
    const rentGate = generateDemoRentGate()

    set({
      currentProject: project,
      escrowAccount,
      rentGate,
      takafulPolicies: [
        {
          id: 'takaful-001',
          projectId: project.id,
          policyNumber: 'TKF-2024-00789',
          provider: 'Qatar Islamic Insurance Group',
          coverageType: 'comprehensive',
          startDate: '2024-03-01',
          expiryDate: '2025-03-01',
          premium: 125000, // QAR
          payer: 'lessor',
          autoRenewal: true,
          renewalAlert: '2024-12-01'
        }
      ]
    })

    // Calculate initial metrics
    get().calculateGRCMetrics()
  },

  resetDemo: () => set({
    currentProject: null,
    escrowAccount: null,
    unitSubLedgers: [],
    milestones: [],
    contractSuite: null,
    rentGate: null,
    latePayments: [],
    takafulPolicies: [],
    controlExecutions: [],
    grcMetrics: null,
    sceneStatuses: {
      'project-setup': { sceneId: 'project-setup', completed: false, progress: 0 },
      'escrow-wiring': { sceneId: 'escrow-wiring', completed: false, progress: 0 },
      'construction-progress': { sceneId: 'construction-progress', completed: false, progress: 0 },
      'contract-integrity': { sceneId: 'contract-integrity', completed: false, progress: 0 },
      'rent-gating': { sceneId: 'rent-gating', completed: false, progress: 0 },
      'retention-tracker': { sceneId: 'retention-tracker', completed: false, progress: 0 },
      'late-payment': { sceneId: 'late-payment', completed: false, progress: 0 },
      'grc-dashboard': { sceneId: 'grc-dashboard', completed: false, progress: 0 }
    }
  })
}))
