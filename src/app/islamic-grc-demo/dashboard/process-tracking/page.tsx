'use client'

/**
 * PROCESS TRACKING PAGE
 * =====================
 * Manager view - track workflow progress across all team members
 */

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Activity,
} from 'lucide-react'
import {
  useTasks,
  useCurrentWorkflows,
  useCurrentConfig,
} from '@/lib/stores/grc-demo-store'

const statusConfig = {
  completed: {
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle2,
    label: 'Completed',
  },
  'in-progress': {
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: Clock,
    label: 'In Progress',
  },
  'waiting-approval': {
    color: 'text-yellow-700',
    bg: 'bg-yellow-50 border-yellow-200',
    icon: Clock,
    label: 'Waiting Approval',
  },
  blocked: {
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: AlertTriangle,
    label: 'Blocked',
  },
  'not-started': {
    color: 'text-gray-600',
    bg: 'bg-gray-50 border-gray-200',
    icon: Clock,
    label: 'Not Started',
  },
}

export default function ProcessTrackingPage() {
  const tasks = useTasks()
  const workflows = useCurrentWorkflows()
  const config = useCurrentConfig()

  // Get the primary workflow (first one)
  const primaryWorkflow = workflows[0]

  // Calculate workflow data
  const workflowData = useMemo(() => {
    if (!primaryWorkflow) {
      return null
    }

    const workflowTasks = tasks.filter((t) => t.workflowId === primaryWorkflow.id)
    const completedSteps = workflowTasks.filter((t) => t.status === 'completed')
      .length
    const totalSteps = workflowTasks.length

    // Count critical path tasks (critical priority)
    const criticalPathTasks = workflowTasks.filter((t) => t.priority === 'critical')
    const criticalPathCompleted = criticalPathTasks.filter(
      (t) => t.status === 'completed'
    ).length

    // Calculate progress
    const progress =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

    // Determine status (at-risk if any critical task is overdue)
    const now = new Date()
    const criticalOverdue = criticalPathTasks.some(
      (t) => t.status !== 'completed' && new Date(t.dueDate) < now
    )
    const status = criticalOverdue ? ('at-risk' as const) : ('on-track' as const)

    // Find latest due date for estimated completion
    const dueDates = workflowTasks.map((t) => new Date(t.dueDate))
    const estimatedCompletion =
      dueDates.length > 0
        ? new Date(Math.max(...dueDates.map((d) => d.getTime())))
            .toISOString()
            .split('T')[0]
        : new Date().toISOString().split('T')[0]

    // Find earliest created date for start date
    const createdDates = workflowTasks.map((t) => new Date(t.createdAt))
    const startedAt =
      createdDates.length > 0
        ? new Date(Math.min(...createdDates.map((d) => d.getTime())))
            .toISOString()
            .split('T')[0]
        : new Date().toISOString().split('T')[0]

    return {
      workflowName: primaryWorkflow.name,
      productType: config?.productType || 'Unknown',
      jurisdiction: config?.jurisdiction || 'Unknown',
      startedAt,
      estimatedCompletion,
      totalSteps,
      completedSteps,
      criticalPathSteps: criticalPathTasks.length,
      criticalPathCompleted,
      progress,
      status,
    }
  }, [primaryWorkflow, tasks, config])

  // Calculate step status from tasks
  const stepStatuses = useMemo(() => {
    if (!primaryWorkflow) return []

    const workflowTasks = tasks.filter((t) => t.workflowId === primaryWorkflow.id)

    return workflowTasks.map((task, index) => ({
      stepNumber: index + 1,
      title: task.title,
      assignedTo: task.assignedRole,
      status: task.status,
      completedDate: task.completedAt
        ? new Date(task.completedAt).toISOString().split('T')[0]
        : undefined,
      startedDate:
        task.status === 'in-progress'
          ? new Date(task.createdAt).toISOString().split('T')[0]
          : undefined,
      duration: Math.ceil(
        (new Date(task.dueDate).getTime() - new Date(task.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      isOnCriticalPath: task.priority === 'critical',
    }))
  }, [primaryWorkflow, tasks])

  // Calculate team utilization
  const teamUtilization = useMemo(() => {
    const roleStats = new Map<
      string,
      {
        assignedTasks: number
        completedTasks: number
        inProgressTasks: number
      }
    >()

    tasks.forEach((task) => {
      const role = task.assignedRole
      const stats = roleStats.get(role) || {
        assignedTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
      }

      stats.assignedTasks++
      if (task.status === 'completed') stats.completedTasks++
      if (task.status === 'in-progress') stats.inProgressTasks++

      roleStats.set(role, stats)
    })

    return Array.from(roleStats.entries()).map(([role, stats]) => {
      // Simple utilization calculation: (completed + in-progress) / total * 100
      const utilization = Math.round(
        ((stats.completedTasks + stats.inProgressTasks) / stats.assignedTasks) *
          100
      )

      return {
        role,
        ...stats,
        utilization,
      }
    })
  }, [tasks])

  const completionPercentage = workflowData?.progress || 0

  if (!workflowData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Active Workflow
            </h3>
            <p className="text-sm text-gray-600">
              Configure a product to generate a workflow.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflow Overview */}
      <Card className="border-2 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">
                {workflowData.workflowName}
              </CardTitle>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{workflowData.productType}</span>
                <span>•</span>
                <span>{workflowData.jurisdiction}</span>
                <span>•</span>
                <span>Started {workflowData.startedAt}</span>
              </div>
            </div>
            <Badge
              className={
                workflowData.status === 'on-track' ? 'bg-green-600' : 'bg-orange-600'
              }
            >
              {workflowData.status === 'on-track' ? 'On Track' : 'At Risk'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm font-bold text-purple-700">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                <span>
                  {workflowData.completedSteps} of {workflowData.totalSteps}{' '}
                  steps completed
                </span>
                <span>
                  Est. completion: {workflowData.estimatedCompletion}
                </span>
              </div>
            </div>

            {/* Critical Path Progress */}
            {workflowData.criticalPathSteps > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      Critical Path
                    </span>
                  </div>
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    {workflowData.criticalPathCompleted} /{' '}
                    {workflowData.criticalPathSteps}
                  </Badge>
                </div>
                <Progress
                  value={
                    (workflowData.criticalPathCompleted /
                      workflowData.criticalPathSteps) *
                    100
                  }
                  className="h-2"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Workflow Steps Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stepStatuses.map((step) => {
              const status = statusConfig[step.status]
              const StatusIcon = status.icon

              return (
                <div
                  key={step.stepNumber}
                  className={`p-4 border-2 rounded-lg ${status.bg}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-700">
                            {step.stepNumber}
                          </span>
                        </div>
                      </div>

                      {/* Step Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {step.title}
                          </h4>
                          {step.isOnCriticalPath && (
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
                              Critical Path
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {step.assignedTo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.duration} days
                          </span>
                          {step.completedDate && (
                            <span className="text-green-700">
                              ✓ Completed {step.completedDate}
                            </span>
                          )}
                          {step.startedDate && !step.completedDate && (
                            <span className="text-blue-700">
                              Started {step.startedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge className={`${status.color} bg-white border flex-shrink-0`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Utilization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamUtilization.map((member) => (
              <div key={member.role} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {member.role}
                  </h4>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {member.completedTasks} completed
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-600" />
                      {member.inProgressTasks} in progress
                    </span>
                    <span className="text-gray-600">
                      {member.assignedTasks} total
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Utilization</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {member.utilization}%
                    </span>
                  </div>
                  <Progress value={member.utilization} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
