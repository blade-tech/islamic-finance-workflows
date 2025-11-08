'use client'

/**
 * WORKFLOW EXECUTIONS LIST PAGE
 * ==============================
 * Central hub for viewing all workflow executions.
 * Shows execution status, phases progress, and links to details.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useWorkflowExecutionStore } from '@/lib/workflow-execution-store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  GitBranch,
  ChevronRight,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import type { WorkflowStatus } from '@/lib/workflow-types'

export default function WorkflowExecutionsPage() {
  const { executions, filterExecutions, getExecutionStats } = useWorkflowExecutionStore()
  const [statusFilter, setStatusFilter] = useState<'ALL' | WorkflowStatus>('ALL')

  const stats = getExecutionStats()

  // Apply filters
  const filteredExecutions = statusFilter === 'ALL'
    ? executions
    : filterExecutions({ status: [statusFilter] })

  // Get status badge styling
  const getStatusBadge = (status: WorkflowStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case 'RUNNING':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <PlayCircle className="w-3 h-3 mr-1" />
            Running
          </Badge>
        )
      case 'FAILED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case 'PENDING_HITL':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        )
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
    }
  }

  // Calculate phase progress for an execution
  const getPhaseProgress = (execution: typeof executions[0]) => {
    const totalPhases = execution.phases.length
    const completedPhases = execution.phases.filter(p => p.status === 'COMPLETED').length
    const percentage = Math.round((completedPhases / totalPhases) * 100)
    return { completedPhases, totalPhases, percentage }
  }

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Workflow Executions</h1>
        <p className="text-muted-foreground mt-2">
          Explore how AI agents generate compliance tasks from regulatory obligations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Executions</div>
              </div>
              <GitBranch className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
                <div className="text-xs text-muted-foreground">Running</div>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <XCircle className="w-8 h-8 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transparency Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-blue-900">How This Works</div>
              <div className="text-sm text-blue-700 mt-1">
                Each workflow shows the complete 8-phase pipeline (A0→A9) that transforms a deal profile
                into compliance tasks. Click any execution to see detailed input/output, quality metrics,
                and human approval gates for each phase.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Executions
              </CardTitle>
              <CardDescription>Filter by status to find specific executions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed Only</SelectItem>
                <SelectItem value="RUNNING">Running Only</SelectItem>
                <SelectItem value="FAILED">Failed Only</SelectItem>
                <SelectItem value="PENDING_HITL">Pending Approval</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              Showing {filteredExecutions.length} execution{filteredExecutions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executions List */}
      <div className="space-y-4">
        {filteredExecutions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No executions found matching the selected filters
            </CardContent>
          </Card>
        )}

        {filteredExecutions.map(execution => {
          const progress = getPhaseProgress(execution)

          return (
            <Card key={execution.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{execution.name}</h3>
                        {getStatusBadge(execution.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {execution.deal_name && (
                          <div className="flex items-center gap-2">
                            <span>Deal: {execution.deal_name}</span>
                            {execution.deal_id && (
                              <Badge variant="outline" className="text-xs">{execution.deal_id}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <Link href={`/workflows/executions/${execution.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="font-medium">{formatTimestamp(execution.created_at)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="font-medium">{formatDuration(execution.duration_seconds)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Initiated By</div>
                      <div className="font-medium">{execution.initiated_by || 'System'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Tasks Generated</div>
                      <div className="font-medium">{execution.outputs.tasks_generated.length}</div>
                    </div>
                  </div>

                  {/* Phase Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-muted-foreground">
                        Phase Progress: {progress.completedPhases}/{progress.totalPhases}
                      </div>
                      <div className="text-xs font-medium">{progress.percentage}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          execution.status === 'COMPLETED'
                            ? 'bg-green-600'
                            : execution.status === 'FAILED'
                            ? 'bg-red-600'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Phase Status Pills */}
                  <div className="flex flex-wrap gap-2">
                    {execution.phases.map(phase => (
                      <div
                        key={phase.id}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          phase.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-700'
                            : phase.status === 'RUNNING'
                            ? 'bg-blue-100 text-blue-700'
                            : phase.status === 'FAILED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {phase.id}: {phase.name}
                      </div>
                    ))}
                  </div>

                  {/* Outputs Summary (for completed workflows) */}
                  {execution.status === 'COMPLETED' && execution.outputs.tasks_generated.length > 0 && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-xs font-semibold mb-2">Generated Tasks:</div>
                      <div className="flex flex-wrap gap-2">
                        {execution.outputs.tasks_generated.map(task => (
                          <Badge key={task.id} variant="outline">
                            {task.id}: {task.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Message (for failed workflows) */}
                  {execution.status === 'FAILED' && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-red-900">Workflow Failed</div>
                          {execution.phases.find(p => p.status === 'FAILED')?.error?.message && (
                            <div className="text-xs text-red-700 mt-1">
                              {execution.phases.find(p => p.status === 'FAILED')?.error?.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quality Metrics (for completed workflows) */}
                  {execution.status === 'COMPLETED' && execution.overall_quality && (
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      {execution.overall_quality.avg_faithfulness && (
                        <div>
                          <div className="text-muted-foreground">Avg Faithfulness</div>
                          <div className="font-semibold text-green-600">
                            {(execution.overall_quality.avg_faithfulness * 100).toFixed(0)}%
                          </div>
                        </div>
                      )}
                      {execution.overall_quality.total_citations !== undefined && (
                        <div>
                          <div className="text-muted-foreground">Source Citations</div>
                          <div className="font-semibold">{execution.overall_quality.total_citations}</div>
                        </div>
                      )}
                      {execution.overall_quality.hitl_approvals !== undefined && (
                        <div>
                          <div className="text-muted-foreground">HITL Approvals</div>
                          <div className="font-semibold">{execution.overall_quality.hitl_approvals}</div>
                        </div>
                      )}
                      {execution.overall_quality.validation_errors !== undefined && (
                        <div>
                          <div className="text-muted-foreground">Validation Errors</div>
                          <div className="font-semibold text-red-600">
                            {execution.overall_quality.validation_errors}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Footer Links */}
      <Card className="bg-muted">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Want to see how obligations are mapped to controls?
            </div>
            <Button variant="outline" asChild>
              <Link href="/research/mapping">
                View Obligation-Control Mapping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
