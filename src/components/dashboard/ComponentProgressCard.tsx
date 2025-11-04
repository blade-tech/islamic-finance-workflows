/**
 * COMPONENT PROGRESS CARD
 * ======================
 * Visual card showing compliance progress for one of the 4 modular components
 * (Shariah Structure, Jurisdiction, Accounting Framework, Impact Metrics)
 *
 * Displays:
 * - Component icon and name
 * - Overall progress percentage
 * - Control completion % and Evidence completion %
 * - Status badge (compliant, needs attention, in progress)
 * - Issues needing attention count
 */

'use client'

import { ComponentCompliance } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ComponentProgressCardProps {
  component: ComponentCompliance
  color: 'purple' | 'orange' | 'blue' | 'green'
  icon: string
  onClick?: () => void
}

const colorVariants = {
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    progress: 'bg-purple-500',
    border: 'border-purple-200',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    progress: 'bg-orange-500',
    border: 'border-orange-200',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    progress: 'bg-blue-500',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    progress: 'bg-green-500',
    border: 'border-green-200',
  },
}

const statusVariants = {
  compliant: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Compliant',
  },
  needs_attention: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Needs Attention',
  },
  in_progress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'In Progress',
  },
  not_applicable: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'N/A',
  },
}

export function ComponentProgressCard({
  component,
  color,
  icon,
  onClick,
}: ComponentProgressCardProps) {
  const colorClasses = colorVariants[color]
  const statusClasses = statusVariants[component.status]

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md cursor-pointer border-2',
        colorClasses.border,
        onClick && 'hover:scale-105'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('text-2xl', colorClasses.bg, 'p-2 rounded-lg')}>
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {component.component_name}
              </h3>
              <p className="text-xs text-gray-500">
                {component.component_type.replace('_', ' ')}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              statusClasses.bg,
              statusClasses.text
            )}
          >
            {statusClasses.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">
              Overall Progress
            </span>
            <span className={cn('text-2xl font-bold', colorClasses.text)}>
              {component.overall_completion.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all', colorClasses.progress)}
              style={{ width: `${component.overall_completion}%` }}
            />
          </div>
        </div>

        {/* Control & Evidence Completion */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Controls</span>
              <span className="text-sm font-semibold text-gray-900">
                {component.control_completion.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={component.control_completion}
              className="h-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              {component.completed_requirements}/{component.total_requirements}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Evidence</span>
              <span className="text-sm font-semibold text-gray-900">
                {component.evidence_completion.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={component.evidence_completion}
              className="h-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              {component.evidence_count}/{component.required_evidence_count}
            </p>
          </div>
        </div>

        {/* Needs Attention Count */}
        {component.needs_attention_count > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-red-600">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">
                {component.needs_attention_count} issue
                {component.needs_attention_count !== 1 ? 's' : ''} need
                attention
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
