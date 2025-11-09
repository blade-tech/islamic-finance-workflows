/**
 * QATAR IJĀRAH TYPES
 * ===================
 * TypeScript types for Qatar Ijārah off-plan demo
 */

import type { QatarIjarahControl } from './ijarah-controls'

// ============================================================================
// PROJECT & DEAL
// ============================================================================

export interface IjarahProject {
  id: string
  name: string
  developerId: string
  developerName: string
  location: string
  totalUnits: number
  projectValue: number // QAR
  currency: 'QAR' | 'USD'
  startDate: string // ISO date
  expectedCompletionDate: string // ISO date
  actualCompletionDate?: string // ISO date
  status: 'planning' | 'construction' | 'completed' | 'on-hold'

  // Regulatory
  authorityApprovals: AuthorityApproval[]

  // Shariah
  ssbApproval?: SSBApproval
  shariahPolicyManualUrl?: string
}

export interface AuthorityApproval {
  id: string
  authority: 'RERA' | 'Aqarat' | 'Ministry_Municipality' | 'Other'
  approvalType: string
  approvalNumber: string
  approvalDate: string // ISO date
  expiryDate?: string // ISO date
  documentUrl: string
  verified: boolean
}

export interface SSBApproval {
  id: string
  decisionDate: string // ISO date
  unanimous: boolean
  fatwaDocumentUrl: string
  conditions?: string[]
  effectiveDate: string // ISO date
}

// ============================================================================
// ESCROW
// ============================================================================

export interface EscrowAccount {
  id: string
  projectId: string
  accountNumber: string
  bankName: string
  accountType: string
  balance: number // QAR
  currency: string
  totalDeposits: number
  totalDisbursements: number
  retentionAmount: number // 10% of project value
  retentionReleased: boolean

  // Compliance
  qcbCompliant: boolean
  lastReconciliationDate: string // ISO date
  nonCompliantDeposits: number
}

export interface UnitSubLedger {
  id: string
  projectId: string
  unitNumber: string
  buyerId: string
  buyerName: string
  buyerPayments: Payment[]
  allocatedDisbursements: Disbursement[]
  balance: number // QAR
}

export interface Payment {
  id: string
  date: string // ISO date
  amount: number
  source: 'buyer_payment' | 'project_finance' | 'other'
  reference: string
  verified: boolean
}

export interface Disbursement {
  id: string
  date: string // ISO date
  amount: number
  authorityLetterUrl?: string
  consultantReportUrl?: string
  recipientAccount: string
  status: 'pending' | 'approved' | 'disbursed' | 'blocked'
  blockReason?: string
}

// ============================================================================
// CONSTRUCTION PROGRESS
// ============================================================================

export interface ConstructionMilestone {
  id: string
  projectId: string
  milestoneNumber: number
  description: string
  targetDate: string // ISO date
  actualDate?: string // ISO date
  completionPercentage: number
  consultantReport?: ConsultantReport
  authorityLetter?: AuthorityLetter
  disbursementAmount: number // QAR
  disbursed: boolean
}

export interface ConsultantReport {
  id: string
  reportDate: string // ISO date
  consultantName: string
  completionPercentage: number
  workCompleted: string[]
  amountCertified: number // QAR
  documentUrl: string
  verified: boolean
}

export interface AuthorityLetter {
  id: string
  letterDate: string // ISO date
  authority: 'RERA' | 'Aqarat'
  letterNumber: string
  approvedAmount: number // QAR
  documentUrl: string
  ocrVerified: boolean
  hash: string
}

// ============================================================================
// CONTRACTS
// ============================================================================

export interface ContractSuite {
  id: string
  projectId: string

  // Tri-split structure
  istisnaContract: Contract
  wadToLease: Contract
  ijarahContract: Contract

  // Validation
  structureValid: boolean
  noInterdependence: boolean
  ssbApproved: boolean
}

export interface Contract {
  id: string
  contractType: 'istisna' | 'wad' | 'ijarah'
  signedDate: string // ISO date
  effectiveDate: string // ISO date
  parties: string[]
  documentUrl: string
  hash: string
  verified: boolean
}

// ============================================================================
// RENT GATING
// ============================================================================

export interface RentGate {
  id: string
  projectId: string
  unitNumber?: string

  // Evidence Status
  completionCertificate: EvidenceItem
  occupancyCertificate: EvidenceItem
  utilityActivation: EvidenceItem
  lessorTitle: EvidenceItem

  // Gate Status
  gateUnlocked: boolean
  rentBillingActive: boolean

  // Dates
  contractualStartDate: string // ISO date
  actualDeliveryDate?: string // ISO date
  delayDays?: number

  // Auto-Adjustment (AAOIFI SS-9 4/1/3)
  rentReduction?: RentReduction
}

export interface EvidenceItem {
  uploaded: boolean
  documentUrl?: string
  uploadDate?: string // ISO date
  verified: boolean
  hash?: string
  source?: string
}

export interface RentReduction {
  delayDays: number
  monthlyRent: number // QAR
  dailyRent: number // QAR
  totalReduction: number // QAR
  reason: string
  auditLog: string[]
}

// ============================================================================
// LATE PAYMENT
// ============================================================================

export interface LatePayment {
  id: string
  projectId: string
  unitNumber: string

  // Payment Details
  dueDate: string // ISO date
  amount: number // QAR
  paidDate?: string // ISO date
  dayslate?: number

  // Shariah Compliance
  lateFeeBlocked: boolean
  willfulDelay: boolean
  charityPledge?: CharityPledge
  ssbReview?: SSBReview
}

export interface CharityPledge {
  id: string
  amount: number // QAR
  pledgeDate: string // ISO date
  beneficiary: string
  distributedDate?: string // ISO date
  receiptUrl?: string
  ssbApproved: boolean
}

export interface SSBReview {
  id: string
  reviewDate: string // ISO date
  finding: string
  ruling: string
  approved: boolean
}

// ============================================================================
// TAKAFUL & MAINTENANCE
// ============================================================================

export interface TakafulPolicy {
  id: string
  projectId: string
  policyNumber: string
  provider: string
  coverageType: 'hull' | 'liability' | 'comprehensive'
  startDate: string // ISO date
  expiryDate: string // ISO date
  premium: number // QAR
  payer: 'lessor' | 'lessee'
  autoRenewal: boolean
  renewalAlert?: string // ISO date (90 days before expiry)
}

export interface MaintenanceEvent {
  id: string
  projectId: string
  eventType: 'major' | 'minor'
  description: string
  cost: number // QAR
  responsibility: 'lessor' | 'lessee'
  completedDate?: string // ISO date
  verified: boolean
}

// ============================================================================
// CONTROL EXECUTION
// ============================================================================

export interface ControlExecution {
  id: string
  controlId: string
  projectId: string
  executedBy: string
  executionDate: string // ISO date
  result: 'pass' | 'fail' | 'pending'
  evidenceCollected: string[] // URLs
  notes: string
  findings?: string
  remediation?: string
  vcProofUrl?: string // Hedera VC transaction URL
}

// ============================================================================
// KPI METRICS
// ============================================================================

export interface GRCMetrics {
  projectId: string

  // 7 KPI Tiles
  shariahLeaseGate: KPI
  escrowCompliance: KPI
  authorityDisbursement: KPI
  retentionLock: KPI
  ssbActions: KPI
  takafulStatus: KPI
  amlKycCoverage: KPI
}

export interface KPI {
  id: string
  name: string
  controlId: string
  status: 'green' | 'amber' | 'red'
  value: string | number
  description: string
  lastUpdated: string // ISO date
  clickThroughUrl: string
}

// ============================================================================
// WORKFLOW SCENE STATE
// ============================================================================

export type SceneId =
  | 'project-setup'
  | 'escrow-wiring'
  | 'construction-progress'
  | 'contract-integrity'
  | 'rent-gating'
  | 'retention-tracker'
  | 'late-payment'
  | 'grc-dashboard'

export interface SceneStatus {
  sceneId: SceneId
  completed: boolean
  progress: number // 0-100
  lastVisited?: string // ISO date
}
