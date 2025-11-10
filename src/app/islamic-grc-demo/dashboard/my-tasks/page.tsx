'use client'

/**
 * MY TASKS PAGE
 * =============
 * View and manage tasks with daily/weekly/monthly filters
 */

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { TaskCard } from '../../components/TaskCard'
import { useGRCDemoStore, useTasks } from '@/lib/stores/grc-demo-store'
import type { Task, TaskStatus } from '@/lib/types/grc-demo-types'

type TimeFilter = 'today' | 'week' | 'month' | 'all'
type StatusFilter = 'all' | TaskStatus

// Mock tasks for demonstration
const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    workflowId: 'wf-1',
    stepId: 'qat-ssb-001-step-1',
    title: 'Prepare Product Proposal for SSB Review',
    description:
      'Compile comprehensive product documentation including structure, contracts, fatwa basis, and Shariah compliance analysis',
    priority: 'critical',
    assignedRole: 'Shariah Compliance Officer',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress',
    requiredEvidence: [
      {
        type: 'Product Structure Document',
        description: 'Detailed description of product mechanics and cash flows',
        isRequired: true,
      },
      {
        type: 'Draft Contracts',
        description: 'All customer-facing and operational contracts',
        isRequired: true,
      },
    ],
    requiresApproval: false,
    policyReference: 'AAOIFI GS-1 §6/1',
    calendarExported: false,
  },
  {
    id: 'task-2',
    workflowId: 'wf-1',
    stepId: 'qat-ijr-gate-001-step-1',
    title: 'Obtain Legal Title Documentation',
    description:
      'Acquire proof of legal ownership: title deed, purchase invoice, asset registration',
    priority: 'high',
    assignedRole: 'Legal / Asset Management',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'not-started',
    requiredEvidence: [
      {
        type: 'Title Deed or Ownership Certificate',
        description: "Legal document proving institution's ownership",
        isRequired: true,
      },
      {
        type: 'Purchase Invoice',
        description: 'Invoice showing institution purchased asset',
        isRequired: true,
      },
    ],
    requiresApproval: false,
    policyReference: 'AAOIFI SS-9 §3/1',
    calendarExported: false,
  },
  {
    id: 'task-3',
    workflowId: 'wf-1',
    stepId: 'qat-ijr-gate-002-step-2',
    title: 'Physical Asset Delivery and Handover',
    description:
      'Execute formal handover of asset to lessee with signed delivery receipt',
    priority: 'critical',
    assignedRole: 'Operations Manager',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'waiting-approval',
    requiredEvidence: [
      {
        type: 'Delivery Receipt (Signed)',
        description: 'Physical or electronic delivery receipt signed by lessee',
        isRequired: true,
      },
      {
        type: 'Asset Handover Certificate',
        description: 'Formal certificate documenting asset details and condition',
        isRequired: true,
      },
    ],
    requiresApproval: true,
    approver: 'Shariah Compliance Officer',
    policyReference: 'AAOIFI SS-9 §4/4 (HARD GATE)',
    calendarExported: false,
  },
  {
    id: 'task-4',
    workflowId: 'wf-1',
    stepId: 'qat-sncr-001-step-1',
    title: 'Establish SNCR Register',
    description:
      'Create dedicated register to log all potential and actual Shariah non-compliance incidents',
    priority: 'high',
    assignedRole: 'Shariah Compliance Officer',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress',
    requiredEvidence: [
      {
        type: 'SNCR Register Template',
        description: 'Spreadsheet or system module for logging incidents',
        isRequired: true,
      },
      {
        type: 'SNCR Classification Policy',
        description: 'Policy defining what constitutes SNCR and severity levels',
        isRequired: true,
      },
    ],
    requiresApproval: false,
    policyReference: 'IFSB-1 §6.1',
    calendarExported: true,
  },
  {
    id: 'task-5',
    workflowId: 'wf-1',
    stepId: 'qat-scf-001-step-2',
    title: 'SCO Ex-Ante Compliance Review',
    description:
      'Shariah Compliance Officer conducts detailed review to verify transaction complies with Shariah requirements',
    priority: 'critical',
    assignedRole: 'Shariah Compliance Officer',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'not-started',
    requiredEvidence: [
      {
        type: 'SCO Review Report',
        description: "Detailed report documenting SCO's compliance assessment",
        isRequired: true,
      },
    ],
    requiresApproval: false,
    policyReference: 'AAOIFI GS-9 §3/2',
    calendarExported: false,
  },
]

export default function MyTasksPage() {
  const tasks = useTasks()
  const { updateTaskStatus, completeTask } = useGRCDemoStore()

  // Use mock tasks if no real tasks yet
  const displayTasks = tasks.length > 0 ? tasks : MOCK_TASKS

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Get unique roles
  const roles = useMemo(() => {
    const uniqueRoles = new Set(displayTasks.map((t) => t.assignedRole))
    return ['all', ...Array.from(uniqueRoles)]
  }, [displayTasks])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return displayTasks.filter((task) => {
      // Time filter
      if (timeFilter !== 'all') {
        const dueDate = new Date(task.dueDate)
        const now = new Date()
        const diffDays = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (timeFilter === 'today' && diffDays > 1) return false
        if (timeFilter === 'week' && diffDays > 7) return false
        if (timeFilter === 'month' && diffDays > 30) return false
      }

      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) return false

      // Role filter
      if (roleFilter !== 'all' && task.assignedRole !== roleFilter) return false

      return true
    })
  }, [displayTasks, timeFilter, statusFilter, roleFilter])

  // Statistics
  const stats = useMemo(() => {
    const today = new Date()
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    return {
      total: displayTasks.length,
      dueToday: displayTasks.filter(
        (t) =>
          new Date(t.dueDate) <= todayEnd &&
          t.status !== 'completed'
      ).length,
      inProgress: displayTasks.filter((t) => t.status === 'in-progress').length,
      waitingApproval: displayTasks.filter((t) => t.status === 'waiting-approval')
        .length,
      overdue: displayTasks.filter(
        (t) => new Date(t.dueDate) < today && t.status !== 'completed'
      ).length,
    }
  }, [displayTasks])

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus)
  }

  const handleComplete = (taskId: string) => {
    completeTask(taskId, 'Current User')
  }

  const handleExportCalendar = () => {
    // TODO: Implement calendar export
    console.log('Export to calendar')
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600 mt-1">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-900">
              {stats.dueToday}
            </div>
            <div className="text-xs text-orange-700 mt-1">Due Today</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">
              {stats.inProgress}
            </div>
            <div className="text-xs text-blue-700 mt-1">In Progress</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-900">
              {stats.waitingApproval}
            </div>
            <div className="text-xs text-yellow-700 mt-1">Waiting Approval</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-900">{stats.overdue}</div>
            <div className="text-xs text-red-700 mt-1">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCalendar}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Calendar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Time Filter */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Time Frame
            </label>
            <div className="flex gap-2">
              {(['today', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
                <Button
                  key={filter}
                  variant={timeFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeFilter(filter)}
                  className={timeFilter === filter ? 'bg-purple-600' : ''}
                >
                  {filter === 'today' && 'Today'}
                  {filter === 'week' && 'This Week'}
                  {filter === 'month' && 'This Month'}
                  {filter === 'all' && 'All'}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-purple-600' : ''}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'not-started' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('not-started')}
              >
                Not Started
              </Button>
              <Button
                variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('in-progress')}
              >
                In Progress
              </Button>
              <Button
                variant={
                  statusFilter === 'waiting-approval' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => setStatusFilter('waiting-approval')}
              >
                Waiting Approval
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Assigned Role
            </label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter(role)}
                  className={roleFilter === role ? 'bg-purple-600' : ''}
                >
                  {role === 'all' ? 'All Roles' : role}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Tasks ({filteredTasks.length})
          </h2>
        </div>

        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No tasks found
              </h3>
              <p className="text-sm text-gray-600">
                Try adjusting your filters to see more tasks
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
