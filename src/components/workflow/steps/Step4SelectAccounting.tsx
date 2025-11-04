'use client'

/**
 * STEP 4: SELECT ACCOUNTING FRAMEWORK
 * ====================================
 * Third component selection in the 4-component modular architecture.
 *
 * USER-FACING TERMINOLOGY:
 * - "Accounting Framework" (not "standard" or "system")
 * - "Select" (not "choose" or "pick")
 * - Clear applicable standards and reporting requirements
 *
 * FEATURES:
 * - Grid display of all 3 accounting frameworks
 * - Applicable standards display
 * - Reporting requirements
 * - Compatible jurisdictions
 * - AAOIFI requirement highlighting
 * - AI assistance for selection based on jurisdiction
 *
 * NOTE: This is Component 3 of 4 in the modular architecture.
 */

import { useState, useEffect } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Globe,
  Map,
  CheckCircle2,
  Sparkles,
  Info,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { ALL_ACCOUNTING_FRAMEWORKS, getFrameworksForJurisdiction, getMandatoryFramework } from '@/data/accounting-frameworks'
import type { AccountingFramework } from '@/lib/types'

// Icon mapping for dynamic rendering
const ICON_MAP: Record<string, any> = {
  BookOpen,
  Globe,
  Map,
}

export function Step4SelectAccounting() {
  const execution = useWorkflowStore((state) => state.execution)
  const setAccounting = useWorkflowStore((state) => state.setAccounting)

  const [selectedAccounting, setSelectedAccounting] = useState<AccountingFramework | null>(
    execution?.selectedAccounting || null
  )

  const selectedJurisdiction = execution?.selectedJurisdiction

  // Get compatible frameworks based on selected jurisdiction
  const compatibleFrameworks = selectedJurisdiction
    ? getFrameworksForJurisdiction(selectedJurisdiction.id)
    : ALL_ACCOUNTING_FRAMEWORKS

  // Get mandatory framework if jurisdiction requires it
  const mandatoryFramework = selectedJurisdiction
    ? getMandatoryFramework(selectedJurisdiction.id)
    : undefined

  const handleSelect = (framework: AccountingFramework) => {
    setSelectedAccounting(framework)
    setAccounting(framework)
  }

  const getIcon = (iconName: string | undefined) => {
    if (!iconName || !ICON_MAP[iconName]) return BookOpen
    return ICON_MAP[iconName]
  }

  const isCompatible = (framework: AccountingFramework): boolean => {
    if (!selectedJurisdiction) return true
    return framework.compatibleJurisdictions.includes(selectedJurisdiction.id)
  }

  const isMandatory = (framework: AccountingFramework): boolean => {
    return mandatoryFramework?.id === framework.id
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Select Accounting Framework</h2>
        <p className="text-muted-foreground mt-1">
          Choose the accounting and reporting standard for your deal (Component 3 of 4)
        </p>
      </div>

      {/* Jurisdiction Context Alert */}
      {selectedJurisdiction && (
        <Alert variant="info">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle>Jurisdiction Context</AlertTitle>
          <AlertDescription>
            You selected <strong>{selectedJurisdiction.name}</strong>.{' '}
            {mandatoryFramework ? (
              <span className="font-medium text-orange-600">
                {mandatoryFramework.name} is required for this jurisdiction.
              </span>
            ) : (
              <span>
                All accounting frameworks are compatible with this jurisdiction.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* AI Guidance */}
      <Alert variant="info">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <AlertTitle>AI Guidance</AlertTitle>
        <AlertDescription>
          {mandatoryFramework ? (
            <span>
              <strong>{mandatoryFramework.name}</strong> is required for {selectedJurisdiction?.name}.
            </span>
          ) : (
            <span>
              <strong>AAOIFI</strong> is the global benchmark for Islamic finance (required in Saudi Arabia).{' '}
              <strong>IFRS+Islamic</strong> is preferred for international issuances.{' '}
              <strong>Local GAAP</strong> for domestic-only deals.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Accounting Framework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ALL_ACCOUNTING_FRAMEWORKS.map((framework) => {
          const Icon = getIcon(framework.icon)
          const isSelected = selectedAccounting?.id === framework.id
          const compatible = isCompatible(framework)
          const mandatory = isMandatory(framework)

          return (
            <Card
              key={framework.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : ''
              } ${!compatible ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => compatible && handleSelect(framework)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{framework.name}</CardTitle>
                      {mandatory && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground">{framework.description}</p>

                {/* Organization */}
                <div>
                  <h4 className="text-sm font-medium mb-1">Organization:</h4>
                  <p className="text-xs text-muted-foreground">{framework.organization}</p>
                </div>

                {/* Applicable Standards */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Standards:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {framework.applicableStandards.slice(0, 3).map((standard, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{standard}</span>
                      </li>
                    ))}
                    {framework.applicableStandards.length > 3 && (
                      <li className="text-xs text-muted-foreground italic">
                        +{framework.applicableStandards.length - 3} more standards
                      </li>
                    )}
                  </ul>
                </div>

                {/* Reporting Requirements */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Reporting:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {framework.reportingRequirements.slice(0, 2).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                    {framework.reportingRequirements.length > 2 && (
                      <li className="text-xs text-muted-foreground italic">
                        +{framework.reportingRequirements.length - 2} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                {/* Compatible Jurisdictions */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Compatible With:</h4>
                  <div className="flex flex-wrap gap-1">
                    {framework.compatibleJurisdictions.slice(0, 3).map((jur, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {jur.replace('_', ' ').toUpperCase()}
                      </Badge>
                    ))}
                    {framework.compatibleJurisdictions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{framework.compatibleJurisdictions.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Website Link */}
                {framework.websiteUrl && (
                  <a
                    href={framework.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                {/* Incompatible Warning */}
                {!compatible && selectedJurisdiction && (
                  <Alert variant="warning" className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Not compatible with {selectedJurisdiction.name}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedAccounting && (
        <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Accounting Framework Selected</AlertTitle>
          <AlertDescription>
            <strong>{selectedAccounting.name}</strong> selected.{' '}
            {isMandatory(selectedAccounting) && (
              <span className="font-medium">This framework is required for {selectedJurisdiction?.name}. </span>
            )}
            {selectedAccounting.applicableStandards.length} applicable standards.{' '}
            Next: Select impact metrics (ESG/sustainability).
          </AlertDescription>
        </Alert>
      )}

      {/* Info Box */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What is an Accounting Framework?</AlertTitle>
        <AlertDescription>
          The accounting framework determines the <strong>financial reporting standards</strong> for your Sukuk.
          This includes applicable accounting standards (e.g., AAOIFI FAS 33, IFRS 9), reporting requirements,
          and audit obligations. Some jurisdictions mandate specific frameworks (e.g., Saudi Arabia requires AAOIFI).
        </AlertDescription>
      </Alert>
    </div>
  )
}
