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
  deadlineAt: string
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

// Generate Payment Certificate workflow tasks
function generatePaymentCertificateWorkflowTasks(): Task[] {
  const now = new Date()
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString()
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()

  return [
    // Task 1: Authorization Officer approves Validation Certificate
    {
      taskId: 'validate-cov-pay-001',
      title: 'Sign Validation Certificate (Payment PAY-001)',
      workflowName: 'Payment Processing → Issue Payment Certificate',
      stepNumber: 2,
      totalSteps: 8,
      severity: 'high',
      deadlineAt: fourHoursFromNow,
      primaryAction: 'APPROVE_REJECT',
      why: 'Confirm payment ownership and issue Validation Certificate per QFC Digital Asset Regulations Article 19 (Validation Services). The Validation Certificate proves the investor owns the contractual right to receive a Payment Certificate under an Islamic Lease (Ijarah) contract.',
      policyClause: 'QFC Digital Asset Regulations 2024, Article 12(2) & Article 19 • AAOIFI SS-9 (Ijarah) §4/4: Rental payments commence after lessee receives asset • ISO 37301 (Compliance Management Systems): Evidence-based validation of contractual obligations',
      aiReasoning: [
        'Payment verified: QAR 500,000 received from Ahmed Al-Thani (Account: 0.0.100001)',
        'Bank reference validated: TT12345678 matches contract milestone M1 (Escrow Wiring)',
        'Milestone confirmed: M1 - QAR 500,000 due on 2025-01-15, received 2025-01-14',
        'Investor Digital ID verified: did:hedera:testnet:buyer-001 (Identity Verification complete)',
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
          check: 'Payer Digital ID matches contract buyer',
          result: 'pass',
          evidence: 'did:hedera:testnet:buyer-001 (Identity Verified ✓ | Anti-Money Laundering ✓)'
        },
        {
          step: '5. Validate Evidence Bundle',
          check: 'All 4 required documents present and valid',
          result: 'pass',
          evidence: 'BankProof ✓ | ERPEntry ✓ | ContractRef ✓ | MilestoneProof ✓'
        },
        {
          step: '6. Check for Duplicates',
          check: 'No prior Validation Certificate issued for this payment',
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

    // Task 2: Compliance approves Payment Certificate issuance
    {
      taskId: 'approve-mint-pay-001',
      title: 'Approve Payment Certificate Issuance (Payment PAY-001)',
      workflowName: 'Payment Processing → Issue Payment Certificate',
      stepNumber: 5,
      totalSteps: 8,
      severity: 'critical',
      deadlineAt: twoHoursFromNow,
      primaryAction: 'APPROVE_REJECT',
      why: 'Validate that the Payment Certificate settings comply with QFC Digital Asset Regulations (non-transferable token) and Shariah requirements for Islamic Lease (Ijarah) contracts. This is the final compliance check before issuing the digital token.',
      policyClause: 'QFC DAR 2024 Article 9 (not a means of payment), Article 12 (token generation sequence), Article 20 (Token Issuer controls) • AAOIFI SS-9: Ijarah payment evidence must link to underlying lease contract • ISO 31000 (Risk Management): Control-based token issuance to manage operational risk',
      aiReasoning: [
        'Regulations Article 9 compliant: Token cannot be transferred or sold',
        'Regulations Article 12 compliant: Validation Certificate issued → Recorded on Blockchain → Issuance request created',
        'Blockchain record confirmed: Topic 0.0.12345, Sequence 100432, Officially timestamped',
        'Token settings validated: Identity check required, Transfer lock enabled, Emergency stop enabled, Reversal option enabled',
        'Investor identity verification complete: did:hedera:testnet:buyer-001 verified on 2025-01-10',
        'Rights register updated: Entry rr://alpha/ctr_Alpha_01/m1/PAY-001 reserved',
        'No conflicting issuance requests for this payment'
      ],
      chainOfThought: [
        {
          step: '1. Check Regulations Article 9 (Not Means of Payment)',
          check: 'Token settings prevent use as payment instrument',
          result: 'pass',
          evidence: 'Cannot be transferred or sold (security controls enabled)'
        },
        {
          step: '2. Check Regulations Article 12 (Generation Steps)',
          check: 'Validation Certificate → Blockchain record → Issuance sequence followed',
          result: 'pass',
          evidence: 'Validation Cert: ipfs://bafy2x7k... | Blockchain: 0.0.12345/100432'
        },
        {
          step: '3. Validate Security Controls (Article 20)',
          check: 'Identity check, Transfer lock, Emergency stop, Reversal option configured',
          result: 'pass',
          evidence: 'All 4 controls enabled per Token Issuer Guidelines'
        },
        {
          step: '4. Verify Investor Identity',
          check: 'Buyer account has valid identity verification',
          result: 'pass',
          evidence: 'Identity verification completed 2025-01-10 | Status: Active'
        },
        {
          step: '5. Check Rights Register',
          check: 'Off-chain rights entry exists and is unencumbered',
          result: 'pass',
          evidence: 'Entry reserved: rr://alpha/ctr_Alpha_01/m1/PAY-001'
        },
        {
          step: '6. Validate Blockchain Record',
          check: 'Validation Certificate hash matches blockchain message',
          result: 'pass',
          evidence: 'Blockchain message hash: sha256:7b9f... (verified)'
        }
      ],
      evidenceRefs: [
        {
          name: 'validation-cert-pay-001.json',
          type: 'Validation Certificate',
          url: '/evidence/cov-vc-pay-001.json'
        },
        {
          name: 'blockchain-receipt-100432.json',
          type: 'Blockchain Receipt',
          url: '/evidence/hcs-receipt-100432.json'
        },
        {
          name: 'token-settings-payment-receipt.json',
          type: 'Token Settings',
          url: '/evidence/token-config-pet-receipt.json'
        },
        {
          name: 'investor-identity-buyer-001.pdf',
          type: 'Identity Verification Certificate',
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

    // Task 3: Evidence upload (for Document Manager role)
    {
      taskId: 'upload-evidence-pay-002',
      title: 'Upload Payment Documents (Payment PAY-002)',
      workflowName: 'Payment Processing → Issue Payment Certificate',
      stepNumber: 1,
      totalSteps: 8,
      severity: 'medium',
      deadlineAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      primaryAction: 'UPLOAD',
      why: 'Gather and upload the 4 required documents for payment PAY-002 (Fatima Al-Mansouri, QAR 500,000, Milestone M1, Unit B2). This starts the Payment Certificate process.',
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
      title: 'Review Weekly Payment Certificate Report',
      workflowName: 'Compliance Monitoring',
      stepNumber: 1,
      totalSteps: 1,
      severity: 'low',
      deadlineAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      primaryAction: 'REVIEW',
      why: 'Review the weekly summary of Payment Certificates issued, including compliance metrics and reconciliation status.',
      aiReasoning: [
        '12 Payment Certificates issued this week (target: 10-15)',
        '100% regulatory compliance rate maintained',
        'Average processing time: 4.2 hours (meets deadline requirements)',
        '2 pending issuance approvals (both on time)'
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
  const [sortBy, setSortBy] = useState<'severity' | 'deadline' | 'process'>('severity')
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'overdue'>('all')

  // Load tasks on mount
  useEffect(() => {
    const tasks = generatePaymentCertificateWorkflowTasks()
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
      filtered = filtered.filter(t => new Date(t.deadlineAt) < new Date())
    }

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === 'severity') {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return severityOrder[a.severity] - severityOrder[b.severity]
      } else if (sortBy === 'deadline') {
        return new Date(a.deadlineAt).getTime() - new Date(b.deadlineAt).getTime()
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
    validator: 'Authorization Officer',
    compliance: 'Compliance Officer',
    evidence: 'Document Manager',
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
              <SelectItem value="deadline">Sort by Deadline</SelectItem>
              <SelectItem value="process">Sort by Process</SelectItem>
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
              const diff = new Date(t.deadlineAt).getTime() - new Date().getTime()
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
