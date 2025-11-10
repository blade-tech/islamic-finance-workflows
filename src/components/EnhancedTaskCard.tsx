'use client'

/**
 * ENHANCED TASK CARD (Prototype)
 * ===============================
 * Task card with progressive disclosure and full research traceability
 *
 * Demonstrates complete obligation → control → module → task flow
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
  Lock,
  ExternalLink,
  BookOpen,
  GitBranch,
} from 'lucide-react'
import type { Task, TaskPriority, TaskStatus } from '@/lib/types/grc-demo-types'
import type { TaskResearchLinks } from '@/lib/prototype-ssb-traceability'

interface EnhancedTaskCardProps {
  task: Task
  researchLinks?: TaskResearchLinks
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

export function EnhancedTaskCard({
  task,
  researchLinks,
  onStatusChange,
  onComplete
}: EnhancedTaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  const priority = priorityConfig[task.priority]
  const status = statusConfig[task.status]
  const StatusIcon = status.icon

  const dueDate = new Date(task.dueDate)
  const isOverdue = dueDate < new Date() && task.status !== 'completed'
  const dueDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={`border-2 ${priority.bg} transition-all hover:shadow-lg`}>
      <CardHeader className="p-6">
        {/* Priority 1: Always Visible */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>
              <Badge className={`${priority.color} bg-white border`}>
                {priority.label}
              </Badge>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{task.assignedRole}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
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
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <Badge className={`${status.color} bg-white border text-sm px-3 py-1`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Priority 2: "Why This Exists" (Always Visible) */}
        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-200">
          <div className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-900 mb-1">
                Why This Exists
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                This task ensures compliance with <span className="font-semibold">QCB Law 13/2012 Article 109</span> and{' '}
                <span className="font-semibold">QFCRA ISFI Chapter 2</span>, which require all Islamic banks
                to obtain Shariah Supervisory Board approval before launching new products. This is a mandatory
                control that cannot be bypassed.
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
          {task.description}
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-4">
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
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Full Details
              </>
            )}
          </Button>
        </div>

        {/* Expanded Details with Progressive Disclosure */}
        {expanded && (
          <Accordion type="multiple" className="space-y-3" defaultValue={['evidence']}>
            {/* Priority 3: Policy Requirements */}
            {researchLinks && (
              <AccordionItem value="policy" className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Policy Requirements & Traceability</span>
                    <Badge variant="secondary" className="ml-2">
                      {researchLinks.obligations.length} obligations
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 mt-2">
                    {/* Obligations */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        Satisfies Obligations:
                      </h5>
                      {researchLinks.obligations.map((obl) => (
                        <div
                          key={obl.id}
                          className="p-3 bg-purple-50 rounded-lg border border-purple-200 mb-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-purple-900">
                                {obl.id}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                {obl.requirement}
                              </p>
                              <p className="text-xs text-purple-700 mt-1">
                                <strong>Source:</strong> {obl.source}
                              </p>
                            </div>
                            <a
                              href={obl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0"
                            >
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Controls */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        Tests Controls:
                      </h5>
                      {researchLinks.controls.map((ctrl) => (
                        <div
                          key={ctrl.id}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-blue-900">
                                {ctrl.id}: {ctrl.name}
                              </p>
                              <p className="text-xs text-gray-700 mt-1">
                                <strong>Test Procedure:</strong> {ctrl.testProcedure}
                              </p>
                            </div>
                            <a
                              href={ctrl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0"
                            >
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Policy Constraints */}
                    {task.policyConstraints && task.policyConstraints.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">
                          Policy Constraints:
                        </h5>
                        {task.policyConstraints.map((constraint, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border mb-2 ${
                              constraint.cannotModify
                                ? 'bg-red-50 border-red-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {constraint.cannotModify ? (
                                <Lock className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Shield className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-gray-900">
                                    {constraint.source}
                                  </p>
                                  {constraint.cannotModify && (
                                    <Badge variant="destructive" className="text-xs">
                                      Cannot Modify
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                  {constraint.constraint}
                                </p>
                                {constraint.cannotModify && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    ⚠️ This is a mandatory control that cannot be bypassed
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Priority 4: Research Methodology */}
            {researchLinks && (
              <AccordionItem value="research" className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold">Research Methodology & Conflict Resolution</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 mt-2">
                    <p className="text-sm text-gray-700">
                      This requirement was unified from multiple regulatory sources during our
                      8-phase research methodology.
                    </p>

                    {researchLinks.methodology.conflictsResolved.length > 0 && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <h5 className="text-sm font-semibold text-amber-900 mb-2">
                          Conflicts Resolved:
                        </h5>
                        <ul className="space-y-2">
                          {researchLinks.methodology.conflictsResolved.map((conflict, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{conflict}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-indigo-700">
                      <span>Extracted in Phase {researchLinks.methodology.phase}: Obligation Extraction</span>
                    </div>

                    <a
                      href={researchLinks.methodology.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-indigo-700 hover:text-indigo-900 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View full methodology and unification process
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Priority 5: Evidence Requirements */}
            <AccordionItem value="evidence" className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Required Evidence</span>
                  <Badge variant="secondary" className="ml-2">
                    {task.requiredEvidence.filter(e => e.isRequired).length} required
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2 mt-2">
                  {task.requiredEvidence.map((evidence, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm p-3 bg-white rounded-lg border"
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
                        {evidence.uploadedFiles && evidence.uploadedFiles.length > 0 && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                              ✓ Uploaded
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
