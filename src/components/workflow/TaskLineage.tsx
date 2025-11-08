'use client'

/**
 * TASK LINEAGE COMPONENT
 * =======================
 * Shows how a specific task was created by the agentic workflow.
 * Displays the flow from obligation → risk → control → task.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useWorkflowExecutionStore } from '@/lib/workflow-execution-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  Database,
  AlertTriangle,
  Shield,
  FileCheck,
  ArrowRight,
  ExternalLink,
  GitBranch
} from 'lucide-react'

interface TaskLineageProps {
  taskId: string
}

export function TaskLineage({ taskId }: TaskLineageProps) {
  const { getTaskLineage } = useWorkflowExecutionStore()
  const [open, setOpen] = useState(false)

  const lineage = getTaskLineage(taskId)

  // If no lineage data, don't show the button
  if (!lineage) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto py-2">
          <Search className="w-4 h-4 mr-2" />
          View Lineage
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How This Task Was Created</DialogTitle>
          <DialogDescription>
            Trace the complete workflow that generated this compliance task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Workflow Header */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-900">Source Workflow</span>
                  </div>
                  <div className="text-sm text-purple-700">{lineage.workflow_name}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    ID: {lineage.workflow_execution_id}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/workflows/executions/${lineage.workflow_execution_id}`}>
                    View Full Execution
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Obligation Found */}
          {lineage.source_obligation && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                  1
                </div>
                <span>A1: Obligation Extractor found regulatory requirement</span>
              </div>

              <Card className="ml-10 border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{lineage.source_obligation.id}</Badge>
                        {lineage.source_obligation.priority && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              lineage.source_obligation.priority === 'Critical'
                                ? 'bg-red-50 text-red-700'
                                : lineage.source_obligation.priority === 'High'
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            {lineage.source_obligation.priority}
                          </Badge>
                        )}
                      </div>
                      <div className="font-semibold mb-1">{lineage.source_obligation.title}</div>
                      <div className="text-xs text-muted-foreground mb-2">{lineage.source_obligation.source}</div>
                      {lineage.source_obligation.link && (
                        <Button variant="link" size="sm" className="h-auto p-0" asChild>
                          <Link href={lineage.source_obligation.link}>
                            View in Qatar Obligations Register
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" style={{ transform: 'rotate(90deg)' }} />
          </div>

          {/* Step 2: Risk Identified */}
          {lineage.mitigating_risk && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">
                  2
                </div>
                <span>A2: Risk Mapper identified compliance risk</span>
              </div>

              <Card className="ml-10 border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{lineage.mitigating_risk.id}</Badge>
                        <Badge variant="outline" className="text-xs bg-orange-50">
                          {lineage.mitigating_risk.likelihood} Likelihood
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-50">
                          {lineage.mitigating_risk.impact} Impact
                        </Badge>
                      </div>
                      <div className="font-semibold mb-1">{lineage.mitigating_risk.title}</div>
                      <div className="text-sm text-muted-foreground">{lineage.mitigating_risk.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" style={{ transform: 'rotate(90deg)' }} />
          </div>

          {/* Step 3: Control Designed */}
          {lineage.implementing_control && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                  3
                </div>
                <span>A3: Control Designer created control</span>
              </div>

              <Card className="ml-10 border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{lineage.implementing_control.id}</Badge>
                        <Badge variant="outline" className="text-xs">{lineage.implementing_control.type}</Badge>
                        {lineage.implementing_control.automation_level && (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            {lineage.implementing_control.automation_level}
                          </Badge>
                        )}
                      </div>
                      <div className="font-semibold mb-1">{lineage.implementing_control.name}</div>
                      <div className="text-sm text-muted-foreground">{lineage.implementing_control.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" style={{ transform: 'rotate(90deg)' }} />
          </div>

          {/* Step 4: Task Published */}
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">
              4
            </div>
            <span>A9: Publisher created this task</span>
          </div>

          <Card className="ml-10 border-l-4 border-l-purple-500 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs bg-purple-100">{lineage.task_id}</Badge>
                  </div>
                  <div className="font-semibold mb-1">{lineage.task_title}</div>
                  <div className="text-xs text-purple-700">
                    Created: {new Date(lineage.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground text-center">
                This task was automatically generated by the 8-phase agentic workflow pipeline.
                Click &quot;View Full Execution&quot; above to see all phases, HITL approvals, and quality metrics.
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
