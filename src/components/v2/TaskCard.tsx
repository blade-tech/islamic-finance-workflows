'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Eye
} from 'lucide-react'

export interface TaskCardProps {
  taskId: string
  title: string
  workflowName: string
  stepNumber: number
  totalSteps: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  deadlineAt: string
  primaryAction: 'APPROVE_REJECT' | 'UPLOAD' | 'REVIEW'
  why: string
  policyClause?: string
  aiReasoning: string[]
  chainOfThought?: Array<{
    step: string
    check: string
    result: 'pass' | 'fail' | 'warn'
    evidence?: string
  }>
  evidenceRefs: Array<{
    name: string
    type: string
    url?: string
  }>
  onApprove?: () => void
  onReject?: () => void
  onNeedInfo?: () => void
}

export function TaskCard({
  taskId,
  title,
  workflowName,
  stepNumber,
  totalSteps,
  severity,
  deadlineAt,
  primaryAction,
  why,
  policyClause,
  aiReasoning,
  chainOfThought,
  evidenceRefs,
  onApprove,
  onReject,
  onNeedInfo
}: TaskCardProps) {
  const [showFullWhy, setShowFullWhy] = useState(false)
  const [showChainOfThought, setShowChainOfThought] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)

  // Calculate time remaining
  const timeRemaining = () => {
    const now = new Date()
    const due = new Date(deadlineAt)
    const diff = due.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours < 0) return 'OVERDUE'
    if (hours < 1) return `${minutes}m`
    if (hours < 24) return `${hours}h ${minutes}m`
    return `${Math.floor(hours / 24)}d ${hours % 24}h`
  }

  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  }

  const severityBadgeColors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-600',
    high: 'bg-orange-600',
    critical: 'bg-red-600'
  }

  return (
    <Card className={`border-2 ${severityColors[severity]} hover:shadow-lg transition-shadow`}>
      <CardHeader>
        <div className="space-y-3">
          {/* Title */}
          <CardTitle className="text-lg font-bold flex items-start justify-between">
            <span>{title}</span>
            <Badge className={severityBadgeColors[severity]}>
              {severity.toUpperCase()}
            </Badge>
          </CardTitle>

          {/* Context Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="font-normal">
              Workflow: {workflowName}
            </Badge>
            <Badge variant="outline" className="font-normal">
              Step {stepNumber} of {totalSteps}
            </Badge>
            <Badge variant="outline" className="font-normal flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due: {timeRemaining()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Why This Exists */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">WHY THIS EXISTS:</p>
          <p className="text-sm text-gray-800">{why}</p>
          {policyClause && !showFullWhy && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={() => setShowFullWhy(true)}
            >
              Show regulation →
            </Button>
          )}
          {showFullWhy && policyClause && (
            <Alert className="mt-2">
              <FileText className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Regulation:</strong> {policyClause}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* AI Reasoning (Collapsed by Default) */}
        <div>
          <button
            onClick={() => setShowChainOfThought(!showChainOfThought)}
            className="flex items-center text-sm font-semibold text-purple-700 hover:text-purple-900 w-full"
          >
            <Brain className="h-4 w-4 mr-2" />
            AI REASONING:
            {showChainOfThought ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </button>

          {!showChainOfThought && (
            <div className="mt-2 space-y-1">
              {aiReasoning.slice(0, 2).map((reason, idx) => (
                <div key={idx} className="flex items-start text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
              {aiReasoning.length > 2 && (
                <p className="text-xs text-purple-600 ml-6">
                  +{aiReasoning.length - 2} more checks passed
                </p>
              )}
            </div>
          )}

          {showChainOfThought && chainOfThought && (
            <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-3">
              <p className="text-xs font-semibold text-purple-900">AI REASONING STEPS:</p>
              {chainOfThought.map((item, idx) => (
                <div key={idx} className="border-l-2 border-purple-300 pl-3">
                  <p className="text-xs font-semibold text-gray-800">{item.step}</p>
                  <p className="text-xs text-gray-600 mt-1">Check: {item.check}</p>
                  <div className="flex items-center mt-1 text-xs">
                    {item.result === 'pass' && (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                        <span className="text-green-700 font-semibold">PASS</span>
                      </>
                    )}
                    {item.result === 'fail' && (
                      <>
                        <AlertTriangle className="h-3 w-3 mr-1 text-red-600" />
                        <span className="text-red-700 font-semibold">FAIL</span>
                      </>
                    )}
                    {item.result === 'warn' && (
                      <>
                        <AlertTriangle className="h-3 w-3 mr-1 text-yellow-600" />
                        <span className="text-yellow-700 font-semibold">WARN</span>
                      </>
                    )}
                  </div>
                  {item.evidence && (
                    <p className="text-xs text-gray-500 mt-1">Evidence: {item.evidence}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evidence (Collapsed by Default) */}
        <div>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            DOCUMENTS ({evidenceRefs.length} items):
            {showEvidence ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </button>

          {!showEvidence && (
            <div className="mt-2 flex flex-wrap gap-2">
              {evidenceRefs.slice(0, 3).map((evidence, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  📄 {evidence.name}
                </Badge>
              ))}
              {evidenceRefs.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{evidenceRefs.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {showEvidence && (
            <div className="mt-2 space-y-2">
              {evidenceRefs.map((evidence, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{evidence.name}</p>
                      <p className="text-xs text-gray-600">{evidence.type}</p>
                    </div>
                  </div>
                  {evidence.url && (
                    <Button variant="outline" size="sm" className="text-xs" asChild>
                      <a href={evidence.url} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Actions */}
        <div className="pt-4 border-t flex gap-2">
          {primaryAction === 'APPROVE_REJECT' && (
            <>
              <Button
                onClick={onApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={onReject}
                variant="destructive"
                className="flex-1"
              >
                Reject
              </Button>
              <Button
                onClick={onNeedInfo}
                variant="outline"
                className="flex-1"
              >
                Need More Info
              </Button>
            </>
          )}
          {primaryAction === 'UPLOAD' && (
            <Button className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
          {primaryAction === 'REVIEW' && (
            <Button className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Review Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
