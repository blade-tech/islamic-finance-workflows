'use client'

/**
 * TEMPLATE CARD
 * =============
 * Displays a single Islamic finance template in a card format.
 *
 * USER-FACING TERMINOLOGY:
 * - "Process Template" (not "methodology")
 * - "Process steps" (not "policy steps")
 * - Standards (AAOIFI, IIFM) mentioned directly
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileCheck, Clock, Users, CheckCircle2 } from 'lucide-react'
import type { Methodology } from '@/lib/types'

interface TemplateCardProps {
  template: Methodology
  selected: boolean
  onClick: () => void
  showStats?: boolean
}

export function TemplateCard({ template, selected, onClick, showStats = true }: TemplateCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-primary border-2 bg-primary/5' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">{template.name}</CardTitle>
              {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
            <CardDescription className="text-sm">{template.description}</CardDescription>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mt-2">
          {template.standard && (
            <Badge variant="secondary" className="text-xs">
              {template.standard}
            </Badge>
          )}
          {template.status && (
            <Badge
              variant={template.status === 'active' ? 'default' : 'outline'}
              className="text-xs"
            >
              {template.status}
            </Badge>
          )}
          {template.type && (
            <Badge variant="outline" className="text-xs">
              {template.type}
            </Badge>
          )}
        </div>
      </CardHeader>

      {showStats && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileCheck className="h-3 w-3" />
              <span>{template.schemaCount} data formats</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{template.policySteps} process steps</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{template.requiredRoles.length} roles required</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
