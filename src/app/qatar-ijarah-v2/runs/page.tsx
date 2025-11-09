'use client'

import { useState } from 'react'
import { WorkflowStepper, WorkflowStep } from '@/components/v2/WorkflowStepper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'

interface WorkflowRun {
  runId: string
  workflowName: string
  entityId: string
  entityName: string
  status: 'running' | 'completed' | 'blocked' | 'failed'
  startedAt: string
  completedAt?: string
  currentStep: number
  totalSteps: number
  steps: WorkflowStep[]
}

// Mock workflow runs
const mockWorkflowRuns: WorkflowRun[] = [
  {
    runId: 'run-pay-001',
    workflowName: 'Payment Processing → Issue Payment Certificate',
    entityId: 'PAY-001',
    entityName: 'Ahmed Al-Thani - QAR 500,000 (Unit A1, M1)',
    status: 'blocked',
    startedAt: '2025-01-14T10:30:00Z',
    currentStep: 5,
    totalSteps: 8,
    steps: [
      {
        id: 'step-1',
        title: 'Payment Received',
        description: 'Bank transfer confirmed and reconciled in ERP',
        status: 'done',
        actor: 'human',
        actorName: 'Finance Team',
        completedAt: '2025-01-14T10:30:00Z',
        duration: '5 min'
      },
      {
        id: 'step-2',
        title: 'Sign Validation Certificate',
        description: 'Authorization Officer signs Validation Certificate',
        status: 'done',
        actor: 'human',
        actorName: 'Sarah validator@qiib.qa',
        completedAt: '2025-01-14T11:15:00Z',
        duration: '45 min',
        hasTask: false
      },
      {
        id: 'step-3',
        title: 'Record on Blockchain',
        description: 'AI Assistant records Validation Certificate on blockchain',
        status: 'done',
        actor: 'agent',
        completedAt: '2025-01-14T11:15:03Z',
        duration: '3 sec'
      },
      {
        id: 'step-4',
        title: 'Collect Evidence Documents',
        description: 'AI Assistant collects all payment documents and details',
        status: 'done',
        actor: 'agent',
        completedAt: '2025-01-14T11:15:05Z',
        duration: '2 sec'
      },
      {
        id: 'step-5',
        title: 'Approve Issuance Decision',
        description: 'AI Assistant validates token settings per Regulations Article 9 Pod #8 validates token config per DAR Article 9 & 12 12',
        status: 'in_review',
        actor: 'human',
        actorName: 'Compliance Officer',
        hasTask: true,
        taskUrl: '/qatar-ijarah-v2/tasks#approve-mint-pay-001'
      },
      {
        id: 'step-6',
        title: 'Create Digital Token',
        description: 'AI Assistant creates Payment Certificate as digital token',
        status: 'todo',
        actor: 'agent'
      },
      {
        id: 'step-7',
        title: 'Verify Identity Grant KYC & Transfer Transfer',
        description: 'Link investor account, verify identity, transfer token',
        status: 'todo',
        actor: 'agent'
      },
      {
        id: 'step-8',
        title: 'Update Rights Ledger',
        description: 'Link Payment Certificate to off-chain rights ledger',
        status: 'todo',
        actor: 'agent'
      }
    ]
  },
  {
    runId: 'run-pay-002',
    workflowName: 'Payment Processing → Issue Payment Certificate',
    entityId: 'PAY-002',
    entityName: 'Fatima Al-Mansouri - QAR 500,000 (Unit B2, M1)',
    status: 'blocked',
    startedAt: '2025-01-14T14:20:00Z',
    currentStep: 1,
    totalSteps: 8,
    steps: [
      {
        id: 'step-1',
        title: 'Upload Documents',
        description: 'Document Manager uploads 4 required documents',
        status: 'in_review',
        actor: 'human',
        actorName: 'Evidence Custodian',
        hasTask: true,
        taskUrl: '/qatar-ijarah-v2/tasks#upload-evidence-pay-002'
      },
      {
        id: 'step-2',
        title: 'Sign Validation Certificate',
        description: 'Authorization Officer signs Validation Certificate',
        status: 'todo',
        actor: 'human'
      },
      {
        id: 'step-3',
        title: 'Record on Blockchain',
        description: 'AI Assistant records Validation Certificate on blockchain',
        status: 'todo',
        actor: 'agent'
      },
      {
        id: 'step-4',
        title: 'Collect Evidence Documents',
        description: 'AI Assistant collects all payment documents and details',
        status: 'todo',
        actor: 'agent'
      },
      {
        id: 'step-5',
        title: 'Approve Issuance Decision',
        description: 'AI Assistant validates token settings per Regulations Article 9 Pod #8 validates token config per DAR Article 9 & 12 12',
        status: 'todo',
        actor: 'human'
      },
      {
        id: 'step-6',
        title: 'Create Digital Token',
        description: 'AI Assistant creates Payment Certificate as digital token',
        status: 'todo',
        actor: 'agent'
      },
      {
        id: 'step-7',
        title: 'Verify Identity Grant KYC & Transfer Transfer',
        description: 'Link investor account, verify identity, transfer token',
        status: 'todo',
        actor: 'agent'
      },
      {
        id: 'step-8',
        title: 'Update Rights Ledger',
        description: 'Link Payment Certificate to off-chain rights ledger',
        status: 'todo',
        actor: 'agent'
      }
    ]
  },
  {
    runId: 'run-pay-003',
    workflowName: 'Payment Processing → Issue Payment Certificate',
    entityId: 'PAY-003',
    entityName: 'Khalid Bin Rashid - QAR 500,000 (Unit C3, M1)',
    status: 'completed',
    startedAt: '2025-01-13T09:00:00Z',
    completedAt: '2025-01-13T14:30:00Z',
    currentStep: 8,
    totalSteps: 8,
    steps: [
      {
        id: 'step-1',
        title: 'Payment Received',
        description: 'Bank transfer confirmed and reconciled in ERP',
        status: 'done',
        actor: 'human',
        completedAt: '2025-01-13T09:00:00Z',
        duration: '3 min'
      },
      {
        id: 'step-2',
        title: 'Sign Validation Certificate',
        description: 'Authorization Officer signs Validation Certificate',
        status: 'done',
        actor: 'human',
        completedAt: '2025-01-13T10:00:00Z',
        duration: '1 hour'
      },
      {
        id: 'step-3',
        title: 'Record on Blockchain',
        description: 'AI Assistant records Validation Certificate on blockchain',
        status: 'done',
        actor: 'agent',
        completedAt: '2025-01-13T10:00:02Z',
        duration: '2 sec'
      },
      {
        id: 'step-4',
        title: 'Collect Evidence Documents',
        description: 'AI Assistant collects all payment documents and details',
        status: 'done',
        actor: 'agent',
        completedAt: '2025-01-13T10:00:04Z',
        duration: '2 sec'
      },
      {
        id: 'step-5',
        title: 'Approve Issuance Decision',
        description: 'AI Assistant validates token settings per Regulations Article 9 Pod #8 validates token config per DAR Article 9 & 12 12',
        status: 'done',
        actor: 'human',
        completedAt: '2025-01-13T11:30:00Z',
        duration: '1.5 hours'
      },
      {
        id: 'step-6',
        title: 'Create Digital Token',
        description: 'AI Assistant creates Payment Certificate as digital token',
        status: 'done',
        actor: 'agent',
        completedAt: '2025-01-13T11:30:02Z',
        duration: '2 sec'
      },
      {
        id: 'step-7',
        title: 'Verify Identity Grant KYC & Transfer Transfer',
        description: 'Link investor account, verify identity, transfer token',
        status: 'done',
        actor: 'agent',
        completedAt: '2025-01-13T11:30:03Z',
        duration: '1 sec'
      },
      {
        id: 'step-8',
        title: 'Update Rights Ledger',
        description: 'Link Payment Certificate to off-chain rights ledger',
        status: 'done',
        actor: 'agent',
        completedAt: '2025-01-13T11:30:04Z',
        duration: '1 sec'
      }
    ]
  }
]

export default function WorkflowRunsPage() {
  const [runs, setRuns] = useState<WorkflowRun[]>(mockWorkflowRuns)
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'blocked' | 'completed'>('all')

  const selectedRun = runs.find(r => r.runId === selectedRunId)

  const filteredRuns = runs.filter(run => {
    if (filterStatus === 'all') return true
    return run.status === filterStatus || (filterStatus === 'running' && run.status === 'blocked')
  })

  const getStatusBadge = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>
      case 'running':
        return <Badge className="bg-blue-600">Running</Badge>
      case 'blocked':
        return <Badge className="bg-orange-600">Waiting for Approval</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  const getStatusIcon = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'running':
        return <PlayCircle className="h-5 w-5 text-blue-600" />
      case 'blocked':
        return <Clock className="h-5 w-5 text-orange-600" />
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
  }

  const formatDuration = (startedAt: string, completedAt?: string) => {
    const start = new Date(startedAt)
    const end = completedAt ? new Date(completedAt) : new Date()
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Detail View */}
      {selectedRun ? (
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRunId(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Runs
          </Button>

          {/* Run Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-xl">{selectedRun.workflowName}</CardTitle>
                    {getStatusBadge(selectedRun.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedRun.entityName}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                    <span>Run ID: {selectedRun.runId}</span>
                    <span>•</span>
                    <span>Started: {new Date(selectedRun.startedAt).toLocaleString()}</span>
                    {selectedRun.completedAt && (
                      <>
                        <span>•</span>
                        <span>Completed: {new Date(selectedRun.completedAt).toLocaleString()}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Duration: {formatDuration(selectedRun.startedAt, selectedRun.completedAt)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedRun.currentStep}/{selectedRun.totalSteps}
                  </p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${(selectedRun.currentStep / selectedRun.totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Workflow Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowStepper
                steps={selectedRun.steps}
                currentStepId={selectedRun.steps[selectedRun.currentStep - 1]?.id || ''}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Process Tracking</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track all active and completed workflow executions
              </p>
            </div>

            {/* Filters */}
            <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as any)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Runs</SelectItem>
                <SelectItem value="running">Active (Running + Blocked)</SelectItem>
                <SelectItem value="blocked">Waiting for Approval</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-600">Total Runs</p>
              <p className="text-2xl font-bold text-gray-900">{runs.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-600">Waiting for Approval</p>
              <p className="text-2xl font-bold text-orange-600">
                {runs.filter(r => r.status === 'blocked').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-600">Running</p>
              <p className="text-2xl font-bold text-blue-600">
                {runs.filter(r => r.status === 'running').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {runs.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Runs List */}
          <div className="space-y-3">
            {filteredRuns.map(run => (
              <Card
                key={run.runId}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedRunId(run.runId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Left: Status + Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(run.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{run.workflowName}</h3>
                          {getStatusBadge(run.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{run.entityName}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{run.runId}</span>
                          <span>•</span>
                          <span>Started: {new Date(run.startedAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>Duration: {formatDuration(run.startedAt, run.completedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Progress + Arrow */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Step {run.currentStep}/{run.totalSteps}</p>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${(run.currentStep / run.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
