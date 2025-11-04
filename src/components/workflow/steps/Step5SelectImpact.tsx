'use client'

/**
 * STEP 5: SELECT IMPACT METRICS
 * ==============================
 * Fourth and final component selection in the 4-component modular architecture.
 *
 * USER-FACING TERMINOLOGY:
 * - "Impact Metrics" (not "ESG" or "sustainability" alone)
 * - "Select" (not "choose" or "pick")
 * - Clear certification and reporting requirements
 *
 * FEATURES:
 * - Grid display of all 4 impact metric options
 * - Category badges (Environmental, Social, Governance, None)
 * - Certification requirement highlighting
 * - Reporting requirements
 * - Use cases and examples
 * - AI assistance for selection
 *
 * NOTE: This is Component 4 of 4 in the modular architecture.
 */

import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Leaf,
  Target,
  BarChart3,
  CircleDashed,
  CheckCircle2,
  Sparkles,
  Info,
  AlertTriangle,
  ExternalLink,
  Award,
} from 'lucide-react'
import { ALL_IMPACT_METRICS } from '@/data/impact-metrics'
import type { ImpactMetrics } from '@/lib/types'

// Icon mapping for dynamic rendering
const ICON_MAP: Record<string, any> = {
  Leaf,
  Target,
  BarChart3,
  CircleDashed,
}

export function Step5SelectImpact() {
  const execution = useWorkflowStore((state) => state.execution)
  const toggleImpact = useWorkflowStore((state) => state.toggleImpact)

  const selectedImpacts = execution?.selectedImpacts || []

  const handleToggle = (impact: ImpactMetrics) => {
    toggleImpact(impact)
  }

  const isSelected = (impactId: string) => {
    return selectedImpacts.some(i => i.id === impactId)
  }

  const getIcon = (iconName: string | undefined) => {
    if (!iconName || !ICON_MAP[iconName]) return Target
    return ICON_MAP[iconName]
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'environmental':
        return 'default' // green-ish
      case 'social':
        return 'secondary'
      case 'governance':
        return 'outline'
      case 'none':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'environmental':
        return 'Environmental'
      case 'social':
        return 'Social'
      case 'governance':
        return 'Governance'
      case 'none':
        return 'No Impact Focus'
      default:
        return category
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Select Impact Metrics</h2>
        <p className="text-muted-foreground mt-1">
          Select one or more ESG/sustainability frameworks for your deal (Component 4 of 4)
        </p>
      </div>

      {/* AI Guidance */}
      <Alert variant="info">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <AlertTitle>AI Guidance (Multi-Select Available)</AlertTitle>
        <AlertDescription>
          <strong>You can select multiple frameworks!</strong> Combine{' '}
          <strong>Green Sukuk</strong> (renewable energy) with <strong>SDG-Linked</strong> (social impact).{' '}
          Or use <strong>ESG Framework</strong> alone for comprehensive sustainability.{' '}
          Select <strong>No Impact Metrics</strong> only for conventional Sukuk without ESG focus.
        </AlertDescription>
      </Alert>

      {/* Impact Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_IMPACT_METRICS.map((impact) => {
          const Icon = getIcon(impact.icon)
          const selected = isSelected(impact.id)

          return (
            <Card
              key={impact.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selected ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => handleToggle(impact)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{impact.name}</CardTitle>
                      <Badge variant={getCategoryBadgeVariant(impact.category)} className="mt-1">
                        {getCategoryLabel(impact.category)}
                      </Badge>
                    </div>
                  </div>
                  {selected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground">{impact.description}</p>

                {/* Framework */}
                {impact.framework && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Framework:</h4>
                    <p className="text-xs text-muted-foreground">{impact.framework}</p>
                  </div>
                )}

                {/* Certification Requirement */}
                {impact.certificationRequired && (
                  <Alert variant="warning" className="py-2">
                    <Award className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Certification Required</strong>
                      {impact.certifiers && impact.certifiers.length > 0 && (
                        <span> - {impact.certifiers[0]}</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Reporting Requirements */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Reporting:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {impact.reportingRequirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                    {impact.reportingRequirements.length > 3 && (
                      <li className="text-xs text-muted-foreground italic">
                        +{impact.reportingRequirements.length - 3} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                {/* Use Cases */}
                {impact.useCases && impact.useCases.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Use Cases:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {impact.useCases.slice(0, 3).map((useCase, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {impact.examples && impact.examples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Examples:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {impact.examples.slice(0, 2).map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Website Link */}
                {impact.websiteUrl && (
                  <a
                    href={impact.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedImpacts.length > 0 && (
        <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>
            {selectedImpacts.length} Impact Framework{selectedImpacts.length > 1 ? 's' : ''} Selected
          </AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              {selectedImpacts.map((impact) => (
                <div key={impact.id}>
                  <strong>{impact.name}</strong> ({getCategoryLabel(impact.category)})
                  {impact.certificationRequired && (
                    <span className="font-medium"> - Certification required</span>
                  )}
                  {' - '}
                  {impact.reportingRequirements.length} reporting requirements
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-green-600/20">
                Next: Review your complete configuration.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Info Box */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What are Impact Metrics?</AlertTitle>
        <AlertDescription>
          Impact metrics define the <strong>ESG and sustainability framework</strong> for your Sukuk.
          This includes environmental goals (Green Sukuk), social objectives (SDG-Linked), comprehensive
          ESG criteria, or no specific impact focus. Some frameworks require third-party certification
          and have specific reporting obligations (e.g., ICMA Green Bond Principles, UN SDGs).
        </AlertDescription>
      </Alert>
    </div>
  )
}
