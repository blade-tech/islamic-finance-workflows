/**
 * MONITORING CARD
 * ===============
 * Visual card showing status of key monitoring areas
 * (Contracts, Shariah Reviews, Impact Validations, Documents)
 *
 * Displays:
 * - Card icon and title
 * - Total count
 * - Needs attention count (highlighted)
 * - Status indicator
 * - Clickable to view details
 */

'use client'

import { MonitoringCard as MonitoringCardType } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MonitoringCardProps {
  card: MonitoringCardType
  icon: string
  onClick?: () => void
}

const statusVariants = {
  compliant: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  needs_attention: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
  in_progress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
  },
  not_applicable: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    dot: 'bg-gray-500',
  },
}

export function MonitoringCard({ card, icon, onClick }: MonitoringCardProps) {
  const statusClasses = statusVariants[card.status]
  const hasIssues = card.needs_attention_count > 0

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md cursor-pointer',
        onClick && 'hover:scale-105',
        hasIssues && 'border-red-200 border-2'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl bg-gray-100 p-2 rounded-lg">{icon}</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {card.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={cn('w-2 h-2 rounded-full', statusClasses.dot)}
                />
                <span className="text-xs text-gray-500">
                  {card.total_count} total
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Needs Attention Alert */}
        {hasIssues ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold">
                  {card.needs_attention_count} Need Attention
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Click to review and resolve
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold">All Up to Date</p>
                <p className="text-xs text-green-600 mt-0.5">
                  No issues requiring attention
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Component Breakdown */}
        {Object.keys(card.breakdown_by_component).length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-medium text-gray-600 mb-2">
              By Component:
            </p>
            <div className="space-y-1">
              {Object.entries(card.breakdown_by_component)
                .slice(0, 3)
                .map(([component, count]) => (
                  <div
                    key={component}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-600 capitalize">
                      {component.replace(/_/g, ' ')}
                    </span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* View Details Link */}
        <div className="mt-3 pt-3 border-t">
          <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
            View Details →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
