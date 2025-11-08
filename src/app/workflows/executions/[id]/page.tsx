'use client'

/**
 * WORKFLOW EXECUTION DETAIL PAGE
 * ===============================
 * Shows complete execution details with 8-phase accordion.
 * Displays input/output, validation, and HITL gates for each phase.
 */

import { use } from 'react'
import Link from 'next/link'
import { useWorkflowExecutionStore } from '@/lib/workflow-execution-store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  PlayCircle,
  Shield,
  GitBranch,
  Download,
  ExternalLink,
  AlertCircle,
  TrendingUp,
  User,
  FileJson,
  Database,
  TestTube,
  Zap
} from 'lucide-react'
import type { WorkflowPhase, WorkflowStatus, HITLStatus } from '@/lib/workflow-types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function WorkflowExecutionDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { getExecutionById } = useWorkflowExecutionStore()
  const execution = getExecutionById(id)

  if (!execution) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Execution Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The workflow execution &quot;{id}&quot; could not be found.
            </p>
            <Button asChild>
              <Link href="/workflows/executions">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Executions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  // Get status badge
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

  // Get HITL status badge
  const getHITLBadge = (status: HITLStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case 'SKIPPED':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
            Skipped
          </Badge>
        )
    }
  }

  // Get phase icon
  const getPhaseIcon = (phaseId: string) => {
    switch (phaseId) {
      case 'A0':
        return <FileJson className="w-4 h-4" />
      case 'A1':
        return <Database className="w-4 h-4" />
      case 'A2':
        return <AlertCircle className="w-4 h-4" />
      case 'A3':
        return <Shield className="w-4 h-4" />
      case 'A4':
        return <FileJson className="w-4 h-4" />
      case 'A6':
        return <FileJson className="w-4 h-4" />
      case 'A7':
        return <TestTube className="w-4 h-4" />
      case 'A8':
        return <PlayCircle className="w-4 h-4" />
      case 'A9':
        return <Zap className="w-4 h-4" />
      default:
        return <GitBranch className="w-4 h-4" />
    }
  }

  // Render phase content
  const renderPhaseContent = (phase: WorkflowPhase) => {
    return (
      <div className="space-y-4">
        {/* Phase Metadata */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="font-medium">
              {phase.status === 'COMPLETED' && <span className="text-green-600">Completed</span>}
              {phase.status === 'RUNNING' && <span className="text-blue-600">Running</span>}
              {phase.status === 'FAILED' && <span className="text-red-600">Failed</span>}
              {phase.status === 'PENDING' && <span className="text-gray-500">Pending</span>}
              {phase.status === 'SKIPPED' && <span className="text-gray-400">Skipped</span>}
            </div>
          </div>
          {phase.duration_seconds !== undefined && (
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium">{formatDuration(phase.duration_seconds)}</div>
            </div>
          )}
          {phase.started_at && (
            <div>
              <div className="text-xs text-muted-foreground">Started</div>
              <div className="font-medium text-xs">{formatTimestamp(phase.started_at)}</div>
            </div>
          )}
        </div>

        {/* Data Source */}
        {phase.data_source && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="text-xs font-semibold text-blue-900 mb-1">Data Source</div>
              <div className="text-xs text-blue-700">
                <div><strong>Type:</strong> {phase.data_source.type}</div>
                {phase.data_source.source_name && (
                  <div><strong>Source:</strong> {phase.data_source.source_name}</div>
                )}
                {phase.data_source.confidence_score && (
                  <div>
                    <strong>Confidence:</strong> {(phase.data_source.confidence_score * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input */}
        {phase.input && Object.keys(phase.input).length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">Input</div>
            <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(phase.input, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Output */}
        {phase.output && Object.keys(phase.output).length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">Output</div>

            {/* Special rendering for A1 obligations */}
            {phase.id === 'A1' && phase.output.obligations && Array.isArray(phase.output.obligations) && (
              <div className="space-y-2">
                {phase.output.obligations.map((obl: any, idx: number) => (
                  <Card key={idx} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{obl.id}</Badge>
                            {obl.priority && (
                              <Badge
                                variant="outline"
                                className={
                                  obl.priority === 'Critical'
                                    ? 'bg-red-50 text-red-700'
                                    : obl.priority === 'High'
                                    ? 'bg-orange-50 text-orange-700'
                                    : 'bg-yellow-50 text-yellow-700'
                                }
                              >
                                {obl.priority}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-medium">{obl.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{obl.source}</div>
                          {obl.link && (
                            <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                              <Link href={obl.link}>
                                View in Qatar GRC <ExternalLink className="w-3 h-3 ml-1" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Special rendering for A2 risks */}
            {phase.id === 'A2' && phase.output.risks && Array.isArray(phase.output.risks) && (
              <div className="space-y-2">
                {phase.output.risks.map((risk: any, idx: number) => (
                  <Card key={idx} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{risk.id}</Badge>
                        <Badge variant="outline" className="text-xs bg-orange-50">
                          {risk.likelihood} Likelihood
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-50">
                          {risk.impact} Impact
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">{risk.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{risk.description}</div>
                      {risk.mitigation_control && (
                        <div className="text-xs text-green-600 mt-1">
                          Mitigated by: {risk.mitigation_control}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Special rendering for A3 controls */}
            {phase.id === 'A3' && phase.output.controls && Array.isArray(phase.output.controls) && (
              <div className="space-y-2">
                {phase.output.controls.map((ctrl: any, idx: number) => (
                  <Card key={idx} className="border-l-4 border-l-green-500">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{ctrl.id}</Badge>
                        <Badge variant="outline" className="text-xs">{ctrl.type}</Badge>
                        {ctrl.automation_level && (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            {ctrl.automation_level}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium">{ctrl.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{ctrl.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Default JSON rendering for other outputs */}
            {phase.id !== 'A1' && phase.id !== 'A2' && phase.id !== 'A3' && (
              <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(phase.output, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Quality Checks */}
        {phase.quality_checks && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="text-xs font-semibold text-green-900 mb-2">Quality Metrics</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {phase.quality_checks.ragas_faithfulness !== undefined && (
                  <div>
                    <span className="text-muted-foreground">RAGAS Faithfulness:</span>{' '}
                    <span className="font-semibold">
                      {(phase.quality_checks.ragas_faithfulness * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
                {phase.quality_checks.ragas_answer_relevancy !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Answer Relevancy:</span>{' '}
                    <span className="font-semibold">
                      {(phase.quality_checks.ragas_answer_relevancy * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
                {phase.quality_checks.source_citations && (
                  <div>
                    <span className="text-muted-foreground">Source Citations:</span>{' '}
                    <span className="font-semibold">{phase.quality_checks.source_citations}</span>
                  </div>
                )}
                {phase.quality_checks.validation_passed !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Validation:</span>{' '}
                    <span className={`font-semibold ${phase.quality_checks.validation_passed ? 'text-green-600' : 'text-red-600'}`}>
                      {phase.quality_checks.validation_passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* HITL Gate */}
        {phase.hitl_gate && (
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-xs font-semibold text-purple-900">Human Approval Gate</div>
                    {getHITLBadge(phase.hitl_gate.status)}
                  </div>
                  {phase.hitl_gate.approver && (
                    <div className="text-xs text-purple-700">
                      <strong>Approver:</strong> {phase.hitl_gate.approver}
                    </div>
                  )}
                  {phase.hitl_gate.approved_at && (
                    <div className="text-xs text-purple-700">
                      <strong>Approved:</strong> {formatTimestamp(phase.hitl_gate.approved_at)}
                    </div>
                  )}
                  {phase.hitl_gate.feedback && (
                    <div className="text-xs text-purple-700 mt-1">
                      <strong>Feedback:</strong> {phase.hitl_gate.feedback}
                    </div>
                  )}
                  {phase.hitl_gate.rejection_reason && (
                    <div className="text-xs text-red-700 mt-1">
                      <strong>Rejection Reason:</strong> {phase.hitl_gate.rejection_reason}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warnings */}
        {phase.warnings && phase.warnings.length > 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3">
              <div className="text-xs font-semibold text-amber-900 mb-1">Warnings</div>
              <ul className="list-disc list-inside text-xs text-amber-700 space-y-1">
                {phase.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {phase.error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-red-900">Error</div>
                  <div className="text-xs text-red-700 mt-1">{phase.error.message}</div>
                  {phase.error.details && (
                    <div className="text-xs text-red-600 mt-2 font-mono">{phase.error.details}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="outline" asChild>
          <Link href="/workflows/executions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Executions
          </Link>
        </Button>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{execution.name}</h1>
              <div className="flex items-center gap-2">
                {getStatusBadge(execution.status)}
                <Badge variant="outline">{execution.id}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Deal</div>
              <div className="font-medium">{execution.deal_name || 'N/A'}</div>
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Overall Quality Metrics */}
      {execution.overall_quality && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Overall Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              {execution.overall_quality.avg_faithfulness !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground">Avg Faithfulness</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(execution.overall_quality.avg_faithfulness * 100).toFixed(0)}%
                  </div>
                </div>
              )}
              {execution.overall_quality.total_citations !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground">Total Citations</div>
                  <div className="text-2xl font-bold">{execution.overall_quality.total_citations}</div>
                </div>
              )}
              {execution.overall_quality.hitl_approvals !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground">HITL Approvals</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {execution.overall_quality.hitl_approvals}
                  </div>
                </div>
              )}
              {execution.overall_quality.validation_errors !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground">Validation Errors</div>
                  <div className="text-2xl font-bold text-red-600">
                    {execution.overall_quality.validation_errors}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phases Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            8-Phase Workflow Pipeline
          </CardTitle>
          <CardDescription>
            Expand each phase to see detailed input, output, quality checks, and human approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {execution.phases.map((phase, idx) => (
              <AccordionItem key={phase.id} value={phase.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      phase.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : phase.status === 'RUNNING'
                        ? 'bg-blue-100 text-blue-700'
                        : phase.status === 'FAILED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getPhaseIcon(phase.id)}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">
                        {phase.id}: {phase.name}
                      </div>
                      {phase.duration_seconds !== undefined && (
                        <div className="text-xs text-muted-foreground">
                          {formatDuration(phase.duration_seconds)}
                        </div>
                      )}
                    </div>
                    <div>
                      {phase.status === 'COMPLETED' && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {phase.status === 'RUNNING' && (
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                      )}
                      {phase.status === 'FAILED' && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      {phase.status === 'PENDING' && (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-11 pt-4">
                    {renderPhaseContent(phase)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Generated Outputs */}
      {execution.outputs && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Generated Outputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Guardian Policy */}
            {execution.outputs.guardian_policy && (
              <div>
                <div className="text-sm font-semibold mb-2">Guardian Policy</div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {execution.outputs.guardian_policy}
                  </Badge>
                  {execution.outputs.guardian_policy_url && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={execution.outputs.guardian_policy_url}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Policy
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Generated Tasks */}
            {execution.outputs.tasks_generated.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">
                  Generated Tasks ({execution.outputs.tasks_generated.length})
                </div>
                <div className="space-y-2">
                  {execution.outputs.tasks_generated.map(task => (
                    <Card key={task.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{task.id}</Badge>
                          <span className="text-sm font-medium">{task.title}</span>
                          {task.priority && (
                            <Badge variant="outline" className={
                              task.priority === 'Critical'
                                ? 'bg-red-50 text-red-700'
                                : task.priority === 'High'
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }>
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Controls Activated</div>
                <div className="text-2xl font-bold">{execution.outputs.controls_activated}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Obligations Addressed</div>
                <div className="text-2xl font-bold">{execution.outputs.obligations_addressed}</div>
              </div>
              {execution.outputs.risks_identified !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground">Risks Identified</div>
                  <div className="text-2xl font-bold">{execution.outputs.risks_identified}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Links */}
      <Card className="bg-muted">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Explore the Qatar GRC obligations that powered this workflow
            </div>
            <Button variant="outline" asChild>
              <Link href="/research/obligations">
                View Qatar Obligations
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
