'use client'

/**
 * PROCESS TRACKING PAGE
 * =====================
 * Manager view - track workflow progress across all team members
 */

import React from 'react'
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
} from 'lucide-react'

// Mock workflow data
const WORKFLOW_DATA = {
  workflowName: 'Ijarah (Islamic Lease) - Qatar',
  productType: 'Ijarah',
  jurisdiction: 'Qatar',
  startedAt: '2025-11-08',
  estimatedCompletion: '2025-12-13',
  totalSteps: 12,
  completedSteps: 5,
  criticalPathSteps: 8,
  criticalPathCompleted: 3,
  progress: 42,
  status: 'on-track' as const,
}

const STEP_STATUS = [
  {
    stepNumber: 1,
    title: 'Shariah Supervisory Board Approval',
    assignedTo: 'Shariah Compliance Officer',
    status: 'completed',
    completedDate: '2025-11-10',
    duration: 2,
    isOnCriticalPath: true,
  },
  {
    stepNumber: 2,
    title: 'Asset Ownership Verification',
    assignedTo: 'Legal / Asset Management',
    status: 'completed',
    completedDate: '2025-11-12',
    duration: 2,
    isOnCriticalPath: true,
  },
  {
    stepNumber: 3,
    title: 'Delivery Before Rent (HARD GATE)',
    assignedTo: 'Operations Manager',
    status: 'in-progress',
    startedDate: '2025-11-13',
    duration: 2,
    isOnCriticalPath: true,
  },
  {
    stepNumber: 4,
    title: 'Takaful Coverage Setup',
    assignedTo: 'Risk Officer',
    status: 'not-started',
    duration: 1,
    isOnCriticalPath: false,
  },
  {
    stepNumber: 5,
    title: 'Shariah Compliance Function (Ex-Ante)',
    assignedTo: 'Shariah Compliance Officer',
    status: 'not-started',
    duration: 3,
    isOnCriticalPath: true,
  },
  {
    stepNumber: 6,
    title: 'SNCR Monitoring Setup',
    assignedTo: 'Shariah Compliance Officer',
    status: 'not-started',
    duration: 3,
    isOnCriticalPath: true,
  },
  {
    stepNumber: 7,
    title: 'AAOIFI FAS Financial Reporting',
    assignedTo: 'Finance Manager',
    status: 'not-started',
    duration: 5,
    isOnCriticalPath: false,
  },
  {
    stepNumber: 8,
    title: 'QCB Prudential Reporting',
    assignedTo: 'Compliance Manager',
    status: 'not-started',
    duration: 4,
    isOnCriticalPath: true,
  },
]

const TEAM_UTILIZATION = [
  {
    role: 'Shariah Compliance Officer',
    assignedTasks: 4,
    completedTasks: 1,
    inProgressTasks: 1,
    utilization: 75,
  },
  {
    role: 'Legal / Asset Management',
    assignedTasks: 2,
    completedTasks: 1,
    inProgressTasks: 0,
    utilization: 50,
  },
  {
    role: 'Operations Manager',
    assignedTasks: 2,
    completedTasks: 0,
    inProgressTasks: 1,
    utilization: 50,
  },
  {
    role: 'Finance Manager',
    assignedTasks: 3,
    completedTasks: 0,
    inProgressTasks: 0,
    utilization: 0,
  },
  {
    role: 'Risk Officer',
    assignedTasks: 1,
    completedTasks: 0,
    inProgressTasks: 0,
    utilization: 0,
  },
]

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
  'not-started': {
    color: 'text-gray-600',
    bg: 'bg-gray-50 border-gray-200',
    icon: Clock,
    label: 'Not Started',
  },
}

export default function ProcessTrackingPage() {
  const completionPercentage = Math.round(
    (WORKFLOW_DATA.completedSteps / WORKFLOW_DATA.totalSteps) * 100
  )

  return (
    <div className="space-y-6">
      {/* Workflow Overview */}
      <Card className="border-2 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">
                {WORKFLOW_DATA.workflowName}
              </CardTitle>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{WORKFLOW_DATA.productType}</span>
                <span>•</span>
                <span>{WORKFLOW_DATA.jurisdiction}</span>
                <span>•</span>
                <span>Started {WORKFLOW_DATA.startedAt}</span>
              </div>
            </div>
            <Badge className="bg-green-600">
              {WORKFLOW_DATA.status === 'on-track' && 'On Track'}
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
                  {WORKFLOW_DATA.completedSteps} of {WORKFLOW_DATA.totalSteps}{' '}
                  steps completed
                </span>
                <span>
                  Est. completion: {WORKFLOW_DATA.estimatedCompletion}
                </span>
              </div>
            </div>

            {/* Critical Path Progress */}
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">
                    Critical Path
                  </span>
                </div>
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  {WORKFLOW_DATA.criticalPathCompleted} / {WORKFLOW_DATA.criticalPathSteps}
                </Badge>
              </div>
              <Progress
                value={
                  (WORKFLOW_DATA.criticalPathCompleted /
                    WORKFLOW_DATA.criticalPathSteps) *
                  100
                }
                className="h-2"
              />
            </div>
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
            {STEP_STATUS.map((step) => {
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
            {TEAM_UTILIZATION.map((member) => (
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
