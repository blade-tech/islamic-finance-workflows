/**
 * REUSABLE POD UI COMPONENTS
 * ===========================
 * Standard components for displaying agentic pods across all scenes
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Brain,
  TrendingUp,
  Shield,
  ChevronRight
} from 'lucide-react'
import type {
  PodId,
  PodStatus,
  PodOutput,
  ProposalRecommendation
} from './pod-types'
import { POD_REGISTRY } from './pod-types'

// ============================================================================
// POD CARD - Main container for pod UI
// ============================================================================

interface PodCardProps {
  podId: PodId
  status: PodStatus
  output?: PodOutput | null
  onApprove?: () => void
  onReject?: () => void
  onViewDetails?: () => void
  compact?: boolean
}

export function PodCard({
  podId,
  status,
  output,
  onApprove,
  onReject,
  onViewDetails,
  compact = false
}: PodCardProps) {
  const podDef = POD_REGISTRY[podId]

  const getStatusColor = () => {
    switch (status) {
      case 'idle': return 'border-gray-200 bg-gray-50'
      case 'intake': return 'border-blue-200 bg-blue-50'
      case 'evaluating': return 'border-purple-200 bg-purple-50 animate-pulse'
      case 'proposing': return 'border-green-200 bg-green-50'
      case 'awaiting-approval': return 'border-yellow-200 bg-yellow-50'
      case 'executing': return 'border-indigo-200 bg-indigo-50'
      case 'completed': return 'border-green-300 bg-green-100'
      case 'blocked': return 'border-red-200 bg-red-50'
      case 'error': return 'border-red-300 bg-red-100'
      default: return 'border-gray-200'
    }
  }

  return (
    <Card className={`border-2 ${getStatusColor()} transition-all duration-300`}>
      <CardHeader className={compact ? 'pb-3' : undefined}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle className={compact ? 'text-base' : 'text-lg'}>
                {podDef.name}
              </CardTitle>
              {!compact && (
                <CardDescription className="text-xs mt-1">
                  {podDef.description}
                </CardDescription>
              )}
            </div>
          </div>
          <PodStatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent>
        {/* Thinking/Processing State */}
        {(status === 'intake' || status === 'evaluating') && (
          <ThinkingAnimation status={status} />
        )}

        {/* Proposal State */}
        {status === 'proposing' && output && (
          <ProposalView
            output={output}
            onApprove={onApprove}
            onReject={onReject}
            onViewDetails={onViewDetails}
            compact={compact}
          />
        )}

        {/* Blocked State */}
        {status === 'blocked' && output && (
          <BlockedView output={output} compact={compact} />
        )}

        {/* Completed State */}
        {status === 'completed' && output && (
          <CompletedView output={output} compact={compact} />
        )}

        {/* Error State */}
        {status === 'error' && output?.error && (
          <ErrorView error={output.error} compact={compact} />
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// STATUS BADGE
// ============================================================================

interface PodStatusBadgeProps {
  status: PodStatus
}

function PodStatusBadge({ status }: PodStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return { label: 'Idle', variant: 'secondary' as const, icon: null }
      case 'intake':
        return { label: 'Validating', variant: 'secondary' as const, icon: Clock }
      case 'evaluating':
        return { label: 'Analyzing', variant: 'default' as const, icon: Brain }
      case 'proposing':
        return { label: 'Proposing', variant: 'default' as const, icon: Zap }
      case 'awaiting-approval':
        return { label: 'Awaiting Approval', variant: 'secondary' as const, icon: Clock }
      case 'executing':
        return { label: 'Executing', variant: 'default' as const, icon: Zap }
      case 'completed':
        return { label: 'Completed', variant: 'default' as const, icon: CheckCircle2 }
      case 'blocked':
        return { label: 'Blocked', variant: 'destructive' as const, icon: XCircle }
      case 'error':
        return { label: 'Error', variant: 'destructive' as const, icon: AlertTriangle }
      default:
        return { label: status, variant: 'outline' as const, icon: null }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="text-xs px-2 py-1">
      {Icon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  )
}

// ============================================================================
// THINKING ANIMATION
// ============================================================================

interface ThinkingAnimationProps {
  status: 'intake' | 'evaluating'
}

function ThinkingAnimation({ status }: ThinkingAnimationProps) {
  return (
    <div className="py-6 text-center">
      <div className="inline-flex items-center justify-center space-x-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-sm text-purple-700 font-medium">
        {status === 'intake' ? 'Validating inputs...' : 'Running analysis...'}
      </p>
      <p className="text-xs text-gray-600 mt-1">
        This should take 2-5 seconds
      </p>
    </div>
  )
}

// ============================================================================
// PROPOSAL VIEW
// ============================================================================

interface ProposalViewProps {
  output: PodOutput
  onApprove?: () => void
  onReject?: () => void
  onViewDetails?: () => void
  compact?: boolean
}

function ProposalView({ output, onApprove, onReject, onViewDetails, compact }: ProposalViewProps) {
  const getRecommendationIcon = (rec: ProposalRecommendation) => {
    switch (rec) {
      case 'ALLOW': return CheckCircle2
      case 'DENY': return XCircle
      case 'HOLD': return Clock
      case 'ESCALATE': return AlertTriangle
      default: return ChevronRight
    }
  }

  const getRecommendationColor = (rec: ProposalRecommendation) => {
    switch (rec) {
      case 'ALLOW': return 'text-green-600 bg-green-50 border-green-200'
      case 'DENY': return 'text-red-600 bg-red-50 border-red-200'
      case 'HOLD': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'ESCALATE': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const Icon = getRecommendationIcon(output.recommendation)

  return (
    <div className="space-y-4">
      {/* Recommendation */}
      <div className={`p-4 rounded-lg border-2 ${getRecommendationColor(output.recommendation)}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className="h-6 w-6" />
            <span className="font-bold text-lg">{output.recommendation}</span>
          </div>
          {output.confidence && (
            <Badge variant="outline" className="text-xs">
              {output.confidence}% confident
            </Badge>
          )}
        </div>

        {!compact && output.reasons && output.reasons.length > 0 && (
          <div className="space-y-1 mt-3">
            {output.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Time Saved */}
      {output.time_saved && (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900">Time Saved</span>
          </div>
          <span className="text-lg font-bold text-green-700">{output.time_saved}</span>
        </div>
      )}

      {/* Next Actions */}
      {!compact && output.next_actions && output.next_actions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">Next Actions:</p>
          <div className="space-y-1">
            {output.next_actions.map((action, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(onApprove || onReject || onViewDetails) && (
        <div className="flex items-center space-x-2 pt-2">
          {onApprove && (
            <Button
              onClick={onApprove}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          {onReject && (
            <Button
              onClick={onReject}
              variant="outline"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          )}
          {onViewDetails && (
            <Button
              onClick={onViewDetails}
              variant="ghost"
              size="sm"
            >
              Details
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// BLOCKED VIEW
// ============================================================================

interface BlockedViewProps {
  output: PodOutput
  compact?: boolean
}

function BlockedView({ output, compact }: BlockedViewProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
        <div className="flex items-center space-x-2 mb-3">
          <XCircle className="h-6 w-6 text-red-600" />
          <span className="font-bold text-lg text-red-900">Action Blocked</span>
        </div>

        {output.reasons && output.reasons.length > 0 && (
          <div className="space-y-1">
            {output.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-red-800">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {output.missing_items && output.missing_items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">Missing Items:</p>
          <div className="space-y-1">
            {output.missing_items.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700 p-2 bg-gray-50 rounded border">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {output.next_actions && output.next_actions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">To Proceed:</p>
          <div className="space-y-1">
            {output.next_actions.map((action, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// COMPLETED VIEW
// ============================================================================

interface CompletedViewProps {
  output: PodOutput
  compact?: boolean
}

function CompletedView({ output, compact }: CompletedViewProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
      <div className="flex items-center space-x-2 mb-2">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        <span className="font-bold text-lg text-green-900">Completed Successfully</span>
      </div>

      {!compact && output.reasons && output.reasons.length > 0 && (
        <div className="space-y-1 mt-3 text-sm text-green-800">
          {output.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}

      {output.time_saved && (
        <div className="mt-3 flex items-center justify-between p-2 bg-green-100 rounded">
          <span className="text-xs font-semibold text-green-900">Time Saved:</span>
          <span className="text-sm font-bold text-green-700">{output.time_saved}</span>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ERROR VIEW
// ============================================================================

interface ErrorViewProps {
  error: {
    code: string
    message: string
    recoverable: boolean
  }
  compact?: boolean
}

function ErrorView({ error, compact }: ErrorViewProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-red-300 bg-red-100">
      <div className="flex items-center space-x-2 mb-2">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <span className="font-bold text-lg text-red-900">Error</span>
      </div>

      <div className="space-y-2 text-sm text-red-800">
        <div>
          <span className="font-semibold">Code:</span> <code className="bg-red-200 px-1 rounded">{error.code}</code>
        </div>
        <div>
          <span className="font-semibold">Message:</span> {error.message}
        </div>
        <div>
          <span className="font-semibold">Recoverable:</span> {error.recoverable ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// BEFORE/AFTER METRICS
// ============================================================================

interface BeforeAfterMetricsProps {
  before: {
    steps: string[]
    time: string
    errors?: string
  }
  after: {
    steps: string[]
    time: string
    errors?: string
  }
  savings: {
    time: string
    accuracy?: string
  }
}

export function BeforeAfterMetrics({ before, after, savings }: BeforeAfterMetricsProps) {
  return (
    <Card className="border-2 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Impact: Manual vs AI-Assisted
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Before */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">❌ Without Pod</h4>
            <div className="space-y-2">
              {before.steps.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <div className="text-xs text-red-700 mb-1">Total Time</div>
              <div className="text-2xl font-bold text-red-900">{before.time}</div>
              {before.errors && (
                <div className="text-xs text-red-600 mt-1">{before.errors}</div>
              )}
            </div>
          </div>

          {/* After */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">✅ With Pod</h4>
            <div className="space-y-2">
              {after.steps.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <div className="text-xs text-green-700 mb-1">Total Time</div>
              <div className="text-2xl font-bold text-green-900">{after.time}</div>
              {after.errors && (
                <div className="text-xs text-green-600 mt-1">{after.errors}</div>
              )}
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-green-900">Savings</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-700">{savings.time}</div>
              <div className="text-xs text-green-600">time saved</div>
              {savings.accuracy && (
                <div className="text-sm text-green-700 mt-1">{savings.accuracy} accuracy gain</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// POD ACTIVITY FEED
// ============================================================================

interface PodActivityItem {
  id: string
  podId: PodId
  timestamp: string
  status: 'completed' | 'failed'
  message: string
}

interface PodActivityFeedProps {
  items: PodActivityItem[]
  maxItems?: number
}

export function PodActivityFeed({ items, maxItems = 10 }: PodActivityFeedProps) {
  const displayItems = items.slice(0, maxItems)

  return (
    <div className="space-y-2">
      {displayItems.map((item) => {
        const podDef = POD_REGISTRY[item.podId]
        return (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${
              item.status === 'completed'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-semibold text-gray-900">{podDef.name}</span>
                </div>
                <p className="text-xs text-gray-700">{item.message}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
