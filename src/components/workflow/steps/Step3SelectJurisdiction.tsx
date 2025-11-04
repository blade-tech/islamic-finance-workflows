'use client'

/**
 * STEP 3: SELECT JURISDICTION
 * ============================
 * Second component selection in the 4-component modular architecture.
 *
 * USER-FACING TERMINOLOGY:
 * - "Jurisdiction" (not "country" or "regulator")
 * - "Select" (not "choose" or "pick")
 * - Clear regulatory requirements and tax implications
 *
 * FEATURES:
 * - Grid display of all 4 jurisdictions
 * - Tax rate indicators
 * - Regulatory requirements
 * - Mandatory accounting framework highlights
 * - Currency and language requirements
 * - AI assistance for selection
 *
 * NOTE: This is Component 2 of 4 in the modular architecture.
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  CheckCircle2,
  Sparkles,
  Info,
  AlertTriangle,
  Globe,
  DollarSign,
} from 'lucide-react'
import { ALL_JURISDICTIONS } from '@/data/jurisdictions'
import type { Jurisdiction } from '@/lib/types'

export function Step3SelectJurisdiction() {
  const execution = useWorkflowStore((state) => state.execution)
  const setJurisdiction = useWorkflowStore((state) => state.setJurisdiction)

  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(
    execution?.selectedJurisdiction || null
  )

  const handleSelect = (jurisdiction: Jurisdiction) => {
    setSelectedJurisdiction(jurisdiction)
    setJurisdiction(jurisdiction)
  }

  const getTaxBadgeVariant = (taxRate: number | null) => {
    if (taxRate === null || taxRate === 0) return 'default'
    if (taxRate < 15) return 'secondary'
    if (taxRate < 25) return 'outline'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Select Jurisdiction</h2>
        <p className="text-muted-foreground mt-1">
          Choose the legal and regulatory framework for your deal (Component 2 of 4)
        </p>
      </div>

      {/* AI Guidance */}
      <Alert variant="info">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <AlertTitle>AI Guidance</AlertTitle>
        <AlertDescription>
          <strong>UAE DFSA</strong> offers flexibility and tax efficiency (0% tax).{' '}
          <strong>Malaysia SC</strong> has the most developed Islamic capital market.{' '}
          <strong>Saudi Arabia CMA</strong> requires AAOIFI standards but offers access to the largest Sukuk market.
        </AlertDescription>
      </Alert>

      {/* Jurisdiction Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_JURISDICTIONS.map((jurisdiction) => {
          const isSelected = selectedJurisdiction?.id === jurisdiction.id

          return (
            <Card
              key={jurisdiction.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => handleSelect(jurisdiction)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{jurisdiction.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {jurisdiction.region}
                      </Badge>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground">{jurisdiction.description}</p>

                {/* Regulator */}
                <div>
                  <h4 className="text-sm font-medium mb-1">Regulator:</h4>
                  <p className="text-sm text-muted-foreground">{jurisdiction.regulator}</p>
                </div>

                {/* Tax Rate */}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tax Rate:</span>
                  {jurisdiction.taxRate === null || jurisdiction.taxRate === 0 ? (
                    <Badge variant="default">0% (Tax-Free)</Badge>
                  ) : (
                    <Badge variant={getTaxBadgeVariant(jurisdiction.taxRate)}>
                      {jurisdiction.taxRate}%
                    </Badge>
                  )}
                </div>

                {/* Required Languages & Currencies */}
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Languages:</span>{' '}
                      {jurisdiction.requiredLanguages.join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Currencies:</span>{' '}
                      {jurisdiction.currencies.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Mandatory Accounting Highlight */}
                {jurisdiction.mandatoryAccounting && jurisdiction.mandatoryAccounting.length > 0 && (
                  <Alert variant="warning" className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Requires:</strong>{' '}
                      {jurisdiction.mandatoryAccounting.map((acc) => acc.toUpperCase()).join(' or ')} accounting
                    </AlertDescription>
                  </Alert>
                )}

                {/* Listing Requirements */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Listing Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {jurisdiction.listingRequirements?.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                    {jurisdiction.listingRequirements && jurisdiction.listingRequirements.length > 3 && (
                      <li className="text-xs text-muted-foreground italic">
                        +{jurisdiction.listingRequirements.length - 3} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                {/* Compatible Accounting Frameworks */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Compatible Accounting:</h4>
                  <div className="flex flex-wrap gap-1">
                    {jurisdiction.compatibleAccounting.map((acc, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {acc.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedJurisdiction && (
        <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Jurisdiction Selected</AlertTitle>
          <AlertDescription>
            <strong>{selectedJurisdiction.name}</strong> selected.{' '}
            {selectedJurisdiction.taxRate === null || selectedJurisdiction.taxRate === 0 ? (
              <span>Tax-free jurisdiction. </span>
            ) : (
              <span>{selectedJurisdiction.taxRate}% corporate tax rate. </span>
            )}
            {selectedJurisdiction.mandatoryAccounting && selectedJurisdiction.mandatoryAccounting.length > 0 && (
              <span className="font-medium">
                Note: {selectedJurisdiction.mandatoryAccounting.map((a) => a.toUpperCase()).join(' or ')} accounting required.{' '}
              </span>
            )}
            Next: Select accounting framework.
          </AlertDescription>
        </Alert>
      )}

      {/* Info Box */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What is a Jurisdiction?</AlertTitle>
        <AlertDescription>
          The jurisdiction determines the <strong>legal and regulatory framework</strong> for your Sukuk issuance.
          This includes listing requirements, tax treatment, mandatory accounting standards, and language requirements.
          Each jurisdiction has unique compliance obligations and market access implications.
        </AlertDescription>
      </Alert>
    </div>
  )
}
