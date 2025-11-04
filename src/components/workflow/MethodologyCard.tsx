'use client'

/**
 * METHODOLOGY CARD
 * ================
 * Reusable card component for displaying methodology previews.
 *
 * FEATURES:
 * - Shows methodology name, category, standard, status
 * - Displays statistics (application count, success rate)
 * - Visual indicators for schema count and policy steps
 * - Click handler for selection
 * - Selected state styling
 *
 * DESIGN:
 * - Compact card layout matching workflow template cards
 * - Color-coded status badges
 * - Guardian-inspired metadata display
 */

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, FileCheck, GitBranch } from 'lucide-react'
import type { Methodology } from '@/lib/types'

interface MethodologyCardProps {
  methodology: Methodology
  selected?: boolean
  onClick?: () => void
  showStats?: boolean
}

export function MethodologyCard({
  methodology,
  selected = false,
  onClick,
  showStats = true,
}: MethodologyCardProps) {
  // Status badge variant mapping
  const statusVariant = {
    active: 'default' as const,
    draft: 'secondary' as const,
    archived: 'outline' as const,
  }

  // Category icon mapping
  const categoryIcon: Record<string, string> = {
    mudarabah: '🤝',
    sukuk: '📜',
    murabaha: '💰',
    ijara: '🏠',
    musharakah: '👥',
    wakala: '🔑',
    takaful: '🛡️',
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-primary ${
        selected ? 'border-primary bg-primary/5' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Icon + Content */}
          <div className="flex items-start gap-3 flex-1">
            {/* Category Icon */}
            <span className="text-2xl flex-shrink-0">
              {methodology.category && categoryIcon[methodology.category]
                ? categoryIcon[methodology.category]
                : '📋'}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <CardTitle className="text-base line-clamp-2 mb-2">
                {methodology.name}
              </CardTitle>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-1 mb-2">
                {/* Status */}
                <Badge variant={statusVariant[methodology.status]} className="text-xs">
                  {methodology.status}
                </Badge>

                {/* Standard */}
                {methodology.standard && (
                  <Badge variant="secondary" className="text-xs">
                    {methodology.standard}
                  </Badge>
                )}

                {/* Category */}
                {methodology.category && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {methodology.category}
                  </Badge>
                )}
              </div>

              {/* Guardian Metadata (Schema + Steps) */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileCheck className="h-3 w-3" />
                  <span>{methodology.schemaCount} schemas</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  <span>{methodology.policySteps} steps</span>
                </div>
              </div>

              {/* Statistics (if enabled) */}
              {showStats && methodology.applicationCount > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{methodology.applicationCount} applications</span>
                    <span>•</span>
                    <span>{(methodology.successRate * 100).toFixed(0)}% success</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Selection Indicator */}
          {selected && (
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
          )}
        </div>
      </CardHeader>
    </Card>
  )
}
