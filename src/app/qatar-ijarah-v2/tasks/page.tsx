'use client'

import { useState, useEffect } from 'react'
import { TaskCard } from '@/components/v2/TaskCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListFilter, CheckCircle2, AlertTriangle } from 'lucide-react'

interface Task {
  taskId: string
  title: string
  workflowName: string
  stepNumber: number
  totalSteps: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  slaDueAt: string
  primaryAction: 'APPROVE_REJECT' | 'UPLOAD' | 'REVIEW'
  why: string
  policyClause?: string
  aiReasoning: string[]
  chainOfThought?: Array<{
    step: string
    check: string
    result: 'pass' | 'fail' | 'warn'
    evidence?: string
  }>
  evidenceRefs: Array<{
    name: string
    type: string
    url?: string
  }>
  assignedRoles: string[]
}

// Generate PET workflow tasks
function generatePETWorkflowTasks(): Task[] {
  const now = new Date()
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString()
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()

  return [
    // Task 1: Validator approves CoV-VC
    {
      taskId: 'validate-cov-pay-001',
      title: 'Sign Certificate of Validation (Payment PAY-001)',
      workflowName: 'Payment Processing → PET Minting (Track A)',
      stepNumber: 2,
      totalSteps: 8,
      severity: 'high',
      slaDueAt: fourHoursFromNow,
      primaryAction: 'APPROVE_REJECT',
      why: 'Confirm payment ownership and issue CoV-VC per QFC DAR Article 19 (Validation Services). The Certificate of Validation is a W3C Verifiable Credential that proves the investor owns the contractual right to receive a Payment Evidence Token.',
      policyClause: 'QFC Digital Asset Regulations 2024, Article 12(2): "The owner must receive a certificate of validation confirming their ownership of the contractual right before a token generation request can be made." Article 19: "Validation services must verify evidence and issue certificates in accordance with TSP Guidelines."',
      aiReasoning: [
        'Payment verified: QAR 500,000 received from Ahmed Al-Thani (Account: 0.0.100001)',
        'Bank reference validated: TT12345678 matches contract milestone M1 (Escrow Wiring)',
        'Milestone confirmed: M1 - QAR 500,000 due on 2025-01-15, received 2025-01-14',
        'Investor DID verified: did:hedera:testnet:buyer-001 (KYC complete)',
        'Evidence bundle complete: 4 documents uploaded and hashed',
        'Contract reference valid: ctr_Alpha_01 (Pearl Towers - Unit A1)',
        'No duplicate payments detected for this milestone'
      ],
      chainOfThought: [
        {
          step: '1. Validate Payment Details',
          check: 'Payment amount matches contract milestone M1',
          result: 'pass',
          evidence: 'Contract: QAR 500,000 | Received: QAR 500,000'
        },
        {
          step: '2. Verify Bank Proof',
          check: 'Bank reference TT12345678 is authentic and complete',
          result: 'pass',
          evidence: 'bank-proof.pdf (SHA256: a3f5...)'
        },
        {
          step: '3. Confirm Timing',
          check: 'Payment received within milestone window',
          result: 'pass',
          evidence: 'Due: 2025-01-15 | Received: 2025-01-14 (1 day early)'
        },
        {
          step: '4. Check Investor Identity',
          check: 'Payer DID matches contract buyer',
          result: 'pass',
          evidence: 'did:hedera:testnet:buyer-001 (KYC: ✓ | AML: ✓)'
        },
        {
          step: '5. Validate Evidence Bundle',
          check: 'All 4 required documents present and valid',
          result: 'pass',
          evidence: 'BankProof ✓ | ERPEntry ✓ | ContractRef ✓ | MilestoneProof ✓'
        },
        {
          step: '6. Check for Duplicates',
          check: 'No prior CoV-VC issued for this payment',
          result: 'pass',
          evidence: 'Database query: 0 matches for payment_id=PAY-001'
        }
      ],
      evidenceRefs: [
        {
          name: 'bank-proof.pdf',
          type: 'BankProof',
          url: '/evidence/bank-proof-pay-001.pdf'
        },
        {
          name: 'erp-entry.json',
          type: 'ERPEntry',
          url: '/evidence/erp-entry-pay-001.json'
        },
        {
          name: 'contract-alpha-01.pdf',
          type: 'ContractRef',
          url: '/evidence/contract-alpha-01.pdf'
        },
        {
          name: 'milestone-m1-spec.pdf',
          type: 'MilestoneProof',
          url: '/evidence/milestone-m1-spec.pdf'
        }
      ],
      assignedRoles: ['validator']
    },

    // Task 2: Compliance approves PET mint
    {
      taskId: 'approve-mint-pay-001',
      title: 'Approve PET Mint Decision (Payment PAY-001)',
      workflowName: 'Payment Processing → PET Minting (Track A)',
      stepNumber: 5,
      totalSteps: 8,
      severity: 'critical',
      slaDueAt: twoHoursFromNow,
      primaryAction: 'APPROVE_REJECT',
      why: 'Validate that the Payment Evidence Token configuration complies with QFC DAR Article 9 (not a means of payment) and Article 12 (token generation steps). This is the final compliance gate before minting the HTS NFT on Hedera.',
      policyClause: 'QFC Digital Asset Regulations 2024, Article 9: "A token that evidences a contractual right shall not be treated as a means of payment if it is not transferable except in accordance with the underlying contract." Article 12(1): "Token generation must follow the sequence: (a) certificate of validation, (b) generation request, (c) mint and deliver." Article 20: "Token Service Providers must implement KYC, freeze, pause, and wipe controls."',
      aiReasoning: [
        'DAR Article 9 compliant: Token is non-transferable (freeze_default=true, no secondary market)',
        'DAR Article 12 compliant: CoV-VC issued → Anchored to HCS → Mint request generated',
        'HCS anchor confirmed: Topic 0.0.12345, Sequence 100432, Consensus timestamp recorded',
        'Token config validated: KYC required, Freeze enabled, Pause enabled, Wipe enabled',
        'Investor KYC complete: did:hedera:testnet:buyer-001 verified on 2025-01-10',
        'Rights register updated: Entry rr://alpha/ctr_Alpha_01/m1/PAY-001 reserved',
        'No conflicting mint requests for this payment'
      ],
      chainOfThought: [
        {
          step: '1. Check DAR Article 9 (Not Means of Payment)',
          check: 'Token config prevents use as payment instrument',
          result: 'pass',
          evidence: 'transfer_restrictions=kyc_only | freeze_default=true'
        },
        {
          step: '2. Check DAR Article 12 (Generation Steps)',
          check: 'CoV-VC → HCS anchor → Mint sequence followed',
          result: 'pass',
          evidence: 'CoV-VC: ipfs://bafy2x7k... | HCS: 0.0.12345/100432'
        },
        {
          step: '3. Validate Token Controls (Article 20)',
          check: 'KYC, Freeze, Pause, Wipe keys configured',
          result: 'pass',
          evidence: 'All 4 controls enabled per TSP Guidelines'
        },
        {
          step: '4. Verify Investor KYC',
          check: 'Buyer account has valid KYC status',
          result: 'pass',
          evidence: 'KYC completed 2025-01-10 | Status: Active'
        },
        {
          step: '5. Check Rights Register',
          check: 'Off-chain rights entry exists and is unencumbered',
          result: 'pass',
          evidence: 'Entry reserved: rr://alpha/ctr_Alpha_01/m1/PAY-001'
        },
        {
          step: '6. Validate HCS Anchor',
          check: 'CoV-VC hash matches HCS message',
          result: 'pass',
          evidence: 'HCS message hash: sha256:7b9f... (verified)'
        }
      ],
      evidenceRefs: [
        {
          name: 'cov-vc-pay-001.json',
          type: 'CoV-VC',
          url: '/evidence/cov-vc-pay-001.json'
        },
        {
          name: 'hcs-receipt-100432.json',
          type: 'HCS Receipt',
          url: '/evidence/hcs-receipt-100432.json'
        },
        {
          name: 'token-config-pet-receipt.json',
          type: 'Token Config',
          url: '/evidence/token-config-pet-receipt.json'
        },
        {
          name: 'investor-kyc-buyer-001.pdf',
          type: 'KYC Certificate',
          url: '/evidence/investor-kyc-buyer-001.pdf'
        },
        {
          name: 'rights-register-entry.json',
          type: 'Rights Register',
          url: '/evidence/rights-register-entry.json'
        }
      ],
      assignedRoles: ['compliance']
    },

    // Task 3: Evidence upload (for Evidence Custodian role)
    {
      taskId: 'upload-evidence-pay-002',
      title: 'Upload Payment Evidence (Payment PAY-002)',
      workflowName: 'Payment Processing → PET Minting (Track A)',
      stepNumber: 1,
      totalSteps: 8,
      severity: 'medium',
      slaDueAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      primaryAction: 'UPLOAD',
      why: 'Gather and upload the 4 required evidence documents for payment PAY-002 (Fatima Al-Mansouri, QAR 500,000, Milestone M1, Unit B2). This initiates the PET workflow.',
      policyClause: 'QFC Digital Asset Regulations 2024, Article 19(3): "Evidence must include bank proof, contract reference, milestone specification, and ERP reconciliation."',
      aiReasoning: [
        'Payment received: QAR 500,000 from Fatima Al-Mansouri (Account: 0.0.100002)',
        'Required documents: BankProof, ERPEntry, ContractRef, MilestoneProof',
        'Current status: 0 of 4 documents uploaded',
        'Recommended action: Upload bank proof first (highest priority)'
      ],
      evidenceRefs: [],
      assignedRoles: ['evidence']
    },

    // Task 4: Review dashboard (for Manager role)
    {
      taskId: 'review-pet-dashboard',
      title: 'Review Weekly PET Issuance Report',
      workflowName: 'Compliance Monitoring',
      stepNumber: 1,
      totalSteps: 1,
      severity: 'low',
      slaDueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      primaryAction: 'REVIEW',
      why: 'Review the weekly summary of Payment Evidence Tokens issued, including compliance metrics and reconciliation status.',
      aiReasoning: [
        '12 PETs issued this week (target: 10-15)',
        '100% DAR compliance rate maintained',
        'Average processing time: 4.2 hours (under 6-hour SLA)',
        '2 pending mint approvals (both within SLA)'
      ],
      evidenceRefs: [
        {
          name: 'weekly-pet-report.pdf',
          type: 'Report',
          url: '/reports/weekly-pet-2025-w02.pdf'
        }
      ],
      assignedRoles: ['manager']
    }
  ]
}

export default function TasksPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [currentRole, setCurrentRole] = useState<string>('compliance')
  const [sortBy, setSortBy] = useState<'severity' | 'sla' | 'workflow'>('severity')
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'overdue'>('all')

  // Load tasks on mount
  useEffect(() => {
    const tasks = generatePETWorkflowTasks()
    setAllTasks(tasks)
  }, [])

  // Extract role from layout context
  useEffect(() => {
    const roleContext = document.querySelector('[data-role]')
    if (roleContext) {
      const role = roleContext.getAttribute('data-role')
      if (role) setCurrentRole(role)
    }
  }, [])

  // Filter tasks by role and status
  useEffect(() => {
    let filtered = allTasks.filter(task => task.assignedRoles.includes(currentRole))

    // Apply status filter
    if (filterStatus === 'critical') {
      filtered = filtered.filter(t => t.severity === 'critical')
    } else if (filterStatus === 'overdue') {
      filtered = filtered.filter(t => new Date(t.slaDueAt) < new Date())
    }

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === 'severity') {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return severityOrder[a.severity] - severityOrder[b.severity]
      } else if (sortBy === 'sla') {
        return new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime()
      } else {
        return a.workflowName.localeCompare(b.workflowName)
      }
    })

    setFilteredTasks(filtered)
  }, [allTasks, currentRole, sortBy, filterStatus])

  const handleApprove = (taskId: string) => {
    console.log('Approved task:', taskId)
    // In real app: call API, update workflow state, remove from task list
    setAllTasks(prev => prev.filter(t => t.taskId !== taskId))
  }

  const handleReject = (taskId: string) => {
    console.log('Rejected task:', taskId)
    // In real app: call API, trigger rejection workflow
    setAllTasks(prev => prev.filter(t => t.taskId !== taskId))
  }

  const handleNeedInfo = (taskId: string) => {
    console.log('Need more info:', taskId)
    // In real app: call API, send back to previous step
  }

  const roleDisplayNames: Record<string, string> = {
    validator: 'Validator',
    compliance: 'Compliance Officer',
    evidence: 'Evidence Custodian',
    manager: 'Project Manager'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold">{roleDisplayNames[currentRole]}</span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
            <SelectTrigger className="w-[180px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="severity">Sort by Severity</SelectItem>
              <SelectItem value="sla">Sort by SLA</SelectItem>
              <SelectItem value="workflow">Sort by Workflow</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('critical')}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Critical
            </Button>
            <Button
              variant={filterStatus === 'overdue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('overdue')}
            >
              Overdue
            </Button>
          </div>
        </div>
      </div>

      {/* Task Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Open Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{filteredTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Critical</p>
          <p className="text-2xl font-bold text-red-600">
            {filteredTasks.filter(t => t.severity === 'critical').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Due Soon (&lt; 4h)</p>
          <p className="text-2xl font-bold text-orange-600">
            {filteredTasks.filter(t => {
              const diff = new Date(t.slaDueAt).getTime() - new Date().getTime()
              return diff < 4 * 60 * 60 * 1000
            }).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Completed Today</p>
          <p className="text-2xl font-bold text-green-600">
            <CheckCircle2 className="h-6 w-6 inline mr-1" />
            3
          </p>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-sm text-gray-600">
            No tasks assigned to {roleDisplayNames[currentRole]} at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.taskId}
              {...task}
              onApprove={() => handleApprove(task.taskId)}
              onReject={() => handleReject(task.taskId)}
              onNeedInfo={() => handleNeedInfo(task.taskId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
