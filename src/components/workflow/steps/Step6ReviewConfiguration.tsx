'use client'

/**
 * STEP 6: REVIEW CONFIGURATION
 * =============================
 * Review and validate the complete 4-component configuration before proceeding.
 *
 * USER-FACING TERMINOLOGY:
 * - "Review Configuration" (not "summary" or "validation")
 * - Clear validation feedback
 * - Easy navigation back to edit components
 *
 * FEATURES:
 * - Summary cards for all 4 selected components
 * - Edit buttons to modify each component
 * - Validation results display
 * - Deal configuration metadata
 * - Continue button (enabled only when valid)
 *
 * NOTE: This is the review step after all 4 components are selected.
 */

import { useEffect, useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  MapPin,
  BookOpen,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit,
  ArrowRight,
  Info,
} from 'lucide-react'
import type { DealConfiguration } from '@/lib/types'

export function Step6ReviewConfiguration() {
  const execution = useWorkflowStore((state) => state.execution)
  const buildDealConfiguration = useWorkflowStore((state) => state.buildDealConfiguration)

  const [config, setConfig] = useState<DealConfiguration | null>(null)

  const selectedShariahStructure = execution?.selectedShariahStructure
  const selectedJurisdiction = execution?.selectedJurisdiction
  const selectedAccounting = execution?.selectedAccounting
  const selectedImpacts = execution?.selectedImpacts || []

  // Build and validate configuration on mount and when selections change
  useEffect(() => {
    if (selectedShariahStructure && selectedJurisdiction && selectedAccounting && selectedImpacts.length > 0) {
      const builtConfig = buildDealConfiguration()
      setConfig(builtConfig)
    } else {
      setConfig(null)
    }
  }, [selectedShariahStructure, selectedJurisdiction, selectedAccounting, selectedImpacts, buildDealConfiguration])

  const allComponentsSelected = selectedShariahStructure && selectedJurisdiction && selectedAccounting && selectedImpacts.length > 0
  const isValid = config?.isValid ?? false
  const hasErrors = (config?.validationErrors?.length ?? 0) > 0
  const hasWarnings = (config?.validationWarnings?.length ?? 0) > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Review Configuration</h2>
        <p className="text-muted-foreground mt-1">
          Review your complete 4-component configuration and validation results
        </p>
      </div>

      {/* Missing Components Warning */}
      {!allComponentsSelected && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incomplete Configuration</AlertTitle>
          <AlertDescription>
            Please complete all 4 component selections before reviewing your configuration:
            <ul className="mt-2 space-y-1 text-sm">
              {!selectedShariahStructure && <li>• Step 2: Select Shariah Structure</li>}
              {!selectedJurisdiction && <li>• Step 3: Select Jurisdiction</li>}
              {!selectedAccounting && <li>• Step 4: Select Accounting Framework</li>}
              {selectedImpacts.length === 0 && <li>• Step 5: Select Impact Metrics</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Component Summary Cards */}
      {allComponentsSelected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shariah Structure Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Shariah Structure</CardTitle>
                    <CardDescription className="text-sm">{selectedShariahStructure?.name}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{selectedShariahStructure?.description}</p>
                {selectedShariahStructure?.marketShare && (
                  <Badge variant="secondary">
                    {selectedShariahStructure.marketShare}% Market Share
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Jurisdiction Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Jurisdiction</CardTitle>
                    <CardDescription className="text-sm">{selectedJurisdiction?.name}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{selectedJurisdiction?.regulator}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedJurisdiction?.region}</Badge>
                  {selectedJurisdiction?.taxRate !== null && selectedJurisdiction?.taxRate !== undefined ? (
                    <Badge variant="secondary">
                      {selectedJurisdiction.taxRate === 0 ? 'Tax-Free' : `${selectedJurisdiction.taxRate}% Tax`}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Tax-Free</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accounting Framework Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Accounting Framework</CardTitle>
                    <CardDescription className="text-sm">{selectedAccounting?.name}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{selectedAccounting?.organization}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedAccounting?.applicableStandards.length} applicable standards
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Impact Metrics</CardTitle>
                    <CardDescription className="text-sm">
                      {selectedImpacts.length} framework{selectedImpacts.length > 1 ? 's' : ''} selected
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {selectedImpacts.map((impact) => (
                  <div key={impact.id} className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{impact.name}</span>
                    <Badge variant="outline" className="capitalize">
                      {impact.category}
                    </Badge>
                    {impact.certificationRequired && (
                      <Badge variant="secondary">Certification Required</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Validation Results */}
      {config && (
        <div className="space-y-4">
          {/* Overall Status */}
          {isValid ? (
            <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Configuration Valid</AlertTitle>
              <AlertDescription>
                Your 4-component configuration is valid and ready to proceed.
                {config.configurationName && (
                  <div className="mt-2 font-medium">
                    {config.configurationName}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Configuration Invalid</AlertTitle>
              <AlertDescription>
                Please resolve the validation errors below before proceeding.
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Errors */}
          {hasErrors && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1">
                  {config.validationErrors?.map((error, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Warnings */}
          {hasWarnings && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Validation Warnings</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1">
                  {config.validationWarnings?.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Configuration Metadata */}
          {config.configurationName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Configuration Name:</span>{' '}
                    <span className="text-muted-foreground">{config.configurationName}</span>
                  </div>
                  {config.createdAt && (
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      <span className="text-muted-foreground">
                        {new Date(config.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    {isValid ? (
                      <Badge variant="default" className="ml-2">Valid</Badge>
                    ) : (
                      <Badge variant="destructive" className="ml-2">Invalid</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Info Box */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>About Configuration Validation</AlertTitle>
        <AlertDescription>
          The validation engine checks compatibility between your selected components. For example,
          Saudi Arabia (CMA) requires AAOIFI accounting standards. Some jurisdictions may not allow
          certain accounting frameworks. Validation ensures your configuration meets all regulatory
          requirements and compatibility constraints.
        </AlertDescription>
      </Alert>

      {/* Continue Button Section */}
      {allComponentsSelected && (
        <div className="flex justify-end">
          <Button
            size="lg"
            disabled={!isValid}
            className="gap-2"
          >
            Continue to Configuration Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
