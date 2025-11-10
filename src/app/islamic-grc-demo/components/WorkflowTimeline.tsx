'use client'

/**
 * WORKFLOW TIMELINE
 * =================
 * Timeline/checklist display for workflow steps
 *
 * Shows:
 * - Step sequence and dependencies
 * - Policy constraints (hard gates)
 * - Evidence requirements
 * - Assigned roles and duration
 * - Customization capabilities
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Lock,
  Edit3,
  Shield,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { WorkflowStep } from '@/lib/types/grc-demo-types'

interface WorkflowTimelineProps {
  steps: WorkflowStep[]
  onEditStep?: (stepId: string) => void
  readonly?: boolean
}

export function WorkflowTimeline({
  steps,
  onEditStep,
  readonly = false,
}: WorkflowTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const isExpanded = (stepId: string) => expandedSteps.has(stepId)

  return (
    <div className="space-y-4">
      {steps.map((step, idx) => {
        const expanded = isExpanded(step.id)
        const canEdit =
          !readonly &&
          !step.isHardGate &&
          (step.allowDurationChange || step.allowRoleChange)

        return (
          <Card
            key={step.id}
            className={`transition-all ${
              step.isHardGate
                ? 'border-2 border-red-200 bg-red-50/30'
                : 'border'
            }`}
          >
            <CardHeader
              className="p-4 cursor-pointer hover:bg-gray-50/50"
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-700">
                      {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">
                        {step.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {step.description}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {step.isHardGate && (
                        <Badge className="bg-red-600 hover:bg-red-700">
                          <Lock className="h-3 w-3 mr-1" />
                          Hard Gate
                        </Badge>
                      )}
                      {step.requiresApproval && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Requires Approval
                        </Badge>
                      )}
                      {expanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{step.assignedRole}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{step.durationDays} days</span>
                    </div>
                    {step.policyConstraints.length > 0 && (
                      <div className="flex items-center gap-1 text-purple-600">
                        <Shield className="h-4 w-4" />
                        <span>{step.policyConstraints.length} policy constraints</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Expanded Content */}
            {expanded && (
              <CardContent className="p-4 pt-0 border-t bg-white">
                <div className="space-y-4 mt-4">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Step Description
                    </h4>
                    <p className="text-sm text-gray-700">{step.description}</p>
                  </div>

                  {/* Assignment & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-600" />
                        Assigned To
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                          {step.assignedRole}
                        </p>
                        {canEdit && step.allowRoleChange && !readonly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditStep?.(step.id)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-indigo-600" />
                        Duration
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                          {step.durationDays} days
                        </p>
                        {canEdit && step.allowDurationChange && !readonly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditStep?.(step.id)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Policy Constraints */}
                  {step.policyConstraints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        Policy Constraints
                      </h4>
                      <div className="space-y-2">
                        {step.policyConstraints.map((constraint, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                          >
                            <div className="flex items-start gap-2">
                              {constraint.cannotModify ? (
                                <Lock className="h-4 w-4 text-purple-700 mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-purple-700 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-purple-900 mb-1">
                                  {constraint.source}
                                </p>
                                <p className="text-xs text-purple-800">
                                  {constraint.constraint}
                                </p>
                                {constraint.cannotModify && (
                                  <Badge className="mt-1 bg-purple-700 text-xs">
                                    Cannot Modify
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Evidence */}
                  {step.requiredEvidence.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Required Evidence
                      </h4>
                      <div className="space-y-2">
                        {step.requiredEvidence.map((evidence, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2 bg-blue-50/50 rounded border border-blue-100"
                          >
                            <CheckCircle2
                              className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                evidence.isRequired
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {evidence.type}
                                {evidence.isRequired && (
                                  <span className="text-red-600 ml-1">*</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {evidence.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Approval Requirement */}
                  {step.requiresApproval && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-orange-900">
                            Approval Required
                          </p>
                          <p className="text-xs text-orange-800 mt-1">
                            This step requires approval from:{' '}
                            <span className="font-medium">
                              {step.approvalRole}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Button */}
                  {canEdit && !readonly && (
                    <div className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditStep?.(step.id)}
                        className="w-full"
                      >
                        <Edit3 className="h-3 w-3 mr-2" />
                        Customize Step
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
