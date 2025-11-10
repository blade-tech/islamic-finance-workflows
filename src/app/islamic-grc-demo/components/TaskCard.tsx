'use client'

/**
 * TASK CARD
 * =========
 * Display individual task with action buttons and details
 * Adapted from V2 TaskCard for GRC Demo
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Shield,
  FileText,
  User,
  Calendar,
} from 'lucide-react'
import type { Task, TaskPriority, TaskStatus } from '@/lib/types/grc-demo-types'

interface TaskCardProps {
  task: Task
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onComplete?: (taskId: string) => void
}

const priorityConfig: Record<
  TaskPriority,
  { color: string; bg: string; label: string }
> = {
  critical: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'Critical' },
  high: { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', label: 'High' },
  medium: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', label: 'Medium' },
  low: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', label: 'Low' },
}

const statusConfig: Record<TaskStatus, { color: string; icon: any; label: string }> = {
  'not-started': { color: 'text-gray-600', icon: Clock, label: 'Not Started' },
  'in-progress': { color: 'text-blue-600', icon: Clock, label: 'In Progress' },
  'waiting-approval': { color: 'text-orange-600', icon: AlertTriangle, label: 'Waiting Approval' },
  completed: { color: 'text-green-600', icon: CheckCircle2, label: 'Completed' },
  blocked: { color: 'text-red-600', icon: AlertTriangle, label: 'Blocked' },
}

export function TaskCard({ task, onStatusChange, onComplete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  const priority = priorityConfig[task.priority]
  const status = statusConfig[task.status]
  const StatusIcon = status.icon

  const dueDate = new Date(task.dueDate)
  const isOverdue = dueDate < new Date() && task.status !== 'completed'
  const dueDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={`border-2 ${priority.bg} transition-all hover:shadow-md`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-base">{task.title}</h3>
              <Badge className={`${priority.color} bg-white border`}>
                {priority.label}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {task.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignedRole}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span
                  className={isOverdue ? 'text-red-600 font-semibold' : ''}
                >
                  Due: {dueDate.toLocaleDateString()}
                  {dueDays >= 0 && dueDays <= 7 && !isOverdue && (
                    <span className="ml-1">({dueDays}d)</span>
                  )}
                  {isOverdue && <span className="ml-1">(Overdue)</span>}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span className="text-purple-700">{task.policyReference}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <Badge className={`${status.color} bg-white border`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          {task.status === 'not-started' && (
            <Button
              size="sm"
              onClick={() => onStatusChange?.(task.id, 'in-progress')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Task
            </Button>
          )}
          {task.status === 'in-progress' && (
            <>
              {task.requiresApproval ? (
                <Button
                  size="sm"
                  onClick={() => onStatusChange?.(task.id, 'waiting-approval')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Submit for Approval
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onComplete?.(task.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Complete Task
                </Button>
              )}
            </>
          )}
          {task.status === 'waiting-approval' && (
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              Awaiting approval from {task.approver || task.assignedRole}
            </Badge>
          )}
          {task.status === 'completed' && (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Completed {task.completedAt && new Date(task.completedAt).toLocaleDateString()}
                {task.completedBy && ` by ${task.completedBy}`}
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="ml-auto"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Details
              </>
            )}
          </Button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t">
            {/* Evidence Requirements */}
            {task.requiredEvidence.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Required Evidence
                </h4>
                <div className="space-y-1">
                  {task.requiredEvidence.map((evidence, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm p-2 bg-white rounded border"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          evidence.isRequired ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {evidence.type}
                          {evidence.isRequired && (
                            <span className="text-red-600 ml-1">*</span>
                          )}
                        </span>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {evidence.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policy Reference */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-purple-900">
                    Policy Requirement
                  </p>
                  <p className="text-xs text-purple-800 mt-1">
                    {task.policyReference}
                  </p>
                </div>
              </div>
            </div>

            {/* Recurrence Info */}
            {task.recurrence && (
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Recurring: {task.recurrence}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
