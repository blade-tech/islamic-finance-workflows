'use client'

/**
 * STEP 6: STAKEHOLDER & GOVERNANCE SETUP
 * =======================================
 */

import { useState, useEffect, useRef } from 'react'
import { GovernanceConfig } from '@/lib/control-engine/types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface GovernanceStepProps {
  value?: GovernanceConfig
  onChange: (value: GovernanceConfig) => void
}

const COMPLIANCE_REVIEW_SLAS: Array<{
  value: 'weekly' | 'monthly'
  label: string
}> = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
]

const RISK_APPETITES: Array<{
  value: 'conservative' | 'moderate' | 'aggressive'
  label: string
  description: string
}> = [
  {
    value: 'conservative',
    label: 'Conservative',
    description: 'Lower risk tolerance, strict thresholds'
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Balanced risk/reward approach'
  },
  {
    value: 'aggressive',
    label: 'Aggressive',
    description: 'Higher risk tolerance for returns'
  }
]

const DISCLOSURE_POLICIES: Array<{
  value: 'status-only' | 'full-audit-trail' | 'custom'
  label: string
  description: string
}> = [
  {
    value: 'status-only',
    label: 'Compliance status only',
    description: 'Green/yellow/red badges (minimal disclosure)'
  },
  {
    value: 'full-audit-trail',
    label: 'Full audit trail',
    description: 'Complete evidence access for investors'
  },
  {
    value: 'custom',
    label: 'Custom per investor type',
    description: 'Different disclosure for institutional vs retail'
  }
]

export function GovernanceStep({ value, onChange }: GovernanceStepProps) {
  const [ssbType, setSsbType] = useState<'internal' | 'external'>(
    value?.ssb?.type || 'external'
  )
  const [fatwaSLA, setFatwaSLA] = useState(value?.ssb?.fatwaSLA || 30)
  const [complianceOwner, setComplianceOwner] = useState(
    value?.complianceOwner || 'Shariah Compliance Officer'
  )
  const [complianceReviewSLA, setComplianceReviewSLA] = useState<
    'weekly' | 'monthly'
  >(value?.complianceReviewSLA || 'monthly')
  const [riskOwner, setRiskOwner] = useState(value?.riskOwner || 'Chief Risk Officer')
  const [riskAppetite, setRiskAppetite] = useState<'conservative' | 'moderate' | 'aggressive'>(
    value?.riskAppetite || 'moderate'
  )
  const [enableVCs, setEnableVCs] = useState(value?.enableVCs !== false) // Default to true
  const [disclosurePolicy, setDisclosurePolicy] = useState<'status-only' | 'full-audit-trail' | 'custom'>(
    value?.disclosurePolicy || 'status-only'
  )

  // Store onChange in a ref to avoid infinite loop from changing reference
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Update parent whenever any value changes
  useEffect(() => {
    onChangeRef.current({
      ssb: {
        type: ssbType,
        scholars: ['Dr. Ahmad bin Abdullah'], // Simplified for now
        fatwaSLA
      },
      complianceOwner,
      complianceReviewSLA,
      riskOwner,
      riskAppetite,
      enableVCs,
      disclosurePolicy
    })
  }, [
    ssbType,
    fatwaSLA,
    complianceOwner,
    complianceReviewSLA,
    riskOwner,
    riskAppetite,
    enableVCs,
    disclosurePolicy
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 6: Stakeholder & Governance Setup
        </h2>
        <p className="text-gray-600">
          Define roles, SLAs, risk appetite, and disclosure policies for this transaction.
        </p>
      </div>

      {/* Shariah Supervisory Board (SSB) */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Shariah Supervisory Board (SSB)</h3>
        <RadioGroup value={ssbType} onValueChange={(v) => setSsbType(v as any)}>
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="internal" id="ssb-internal" />
              <Label htmlFor="ssb-internal" className="cursor-pointer">
                Internal SSB
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="external" id="ssb-external" />
              <Label htmlFor="ssb-external" className="cursor-pointer">
                External Scholars
              </Label>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-4">
          <Label htmlFor="fatwa-sla" className="font-medium mb-2 block">
            Fatwa SLA (days)
          </Label>
          <div className="flex items-center space-x-4">
            <Input
              id="fatwa-sla"
              type="number"
              value={fatwaSLA}
              onChange={(e) => setFatwaSLA(parseInt(e.target.value))}
              className="w-24"
              min={7}
              max={90}
            />
            <span className="text-sm text-gray-600">days</span>
          </div>
        </div>
      </Card>

      {/* Compliance Function */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Compliance Function</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="compliance-owner" className="font-medium mb-2 block">
              Owner
            </Label>
            <Input
              id="compliance-owner"
              type="text"
              value={complianceOwner}
              onChange={(e) => setComplianceOwner(e.target.value)}
              placeholder="e.g., Shariah Compliance Officer"
            />
          </div>
          <div>
            <Label className="font-medium mb-2 block">Shariah Review SLA</Label>
            <RadioGroup
              value={complianceReviewSLA}
              onValueChange={(v) => setComplianceReviewSLA(v as any)}
            >
              <div className="flex space-x-4">
                {COMPLIANCE_REVIEW_SLAS.map((sla) => (
                  <div key={sla.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={sla.value} id={`compliance-${sla.value}`} />
                    <Label htmlFor={`compliance-${sla.value}`} className="cursor-pointer">
                      {sla.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Risk Management */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Risk Management</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="risk-owner" className="font-medium mb-2 block">
              Owner
            </Label>
            <Input
              id="risk-owner"
              type="text"
              value={riskOwner}
              onChange={(e) => setRiskOwner(e.target.value)}
              placeholder="e.g., Chief Risk Officer"
            />
          </div>
          <div>
            <Label className="font-medium mb-3 block">Risk Appetite</Label>
            <RadioGroup value={riskAppetite} onValueChange={(v) => setRiskAppetite(v as any)}>
              <div className="space-y-3">
                {RISK_APPETITES.map((appetite) => (
                  <Card
                    key={appetite.value}
                    className={`
                      p-3 cursor-pointer transition-all border
                      ${
                        riskAppetite === appetite.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setRiskAppetite(appetite.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={appetite.value} id={appetite.value} />
                      <div className="flex-1">
                        <Label
                          htmlFor={appetite.value}
                          className="font-medium cursor-pointer block"
                        >
                          {appetite.label}
                        </Label>
                        <p className="text-sm text-gray-600">{appetite.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Disclosure & Selective Sharing */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Disclosure & Selective Sharing</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="enable-vcs"
              checked={enableVCs}
              onCheckedChange={(checked) => setEnableVCs(checked as boolean)}
            />
            <div>
              <Label htmlFor="enable-vcs" className="font-medium cursor-pointer block">
                Enable Verifiable Credentials for proofs
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Issue blockchain-based credentials for compliance evidence
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Label className="font-medium mb-3 block">Investors see:</Label>
            <RadioGroup
              value={disclosurePolicy}
              onValueChange={(v) => setDisclosurePolicy(v as any)}
            >
              <div className="space-y-3">
                {DISCLOSURE_POLICIES.map((policy) => (
                  <Card
                    key={policy.value}
                    className={`
                      p-3 cursor-pointer transition-all border
                      ${
                        disclosurePolicy === policy.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setDisclosurePolicy(policy.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={policy.value} id={policy.value} />
                      <div className="flex-1">
                        <Label htmlFor={policy.value} className="font-medium cursor-pointer block">
                          {policy.label}
                        </Label>
                        <p className="text-sm text-gray-600">{policy.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Controls Activation Preview */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
          <span className="mr-2">🎯</span>
          Controls Activated by This Selection
        </h4>
        <div className="text-sm text-purple-800 space-y-1">
          <p>
            ✓ <strong>SG-03:</strong> SSB Governance (
            {ssbType === 'internal' ? 'internal SSB structure' : 'external scholars engagement'}
            )
          </p>
          {fatwaSLA <= 14 && (
            <p>
              ✓ <strong>SG-05:</strong> Fast-track Fatwa Review (expedited {fatwaSLA}-day SLA)
            </p>
          )}
          {complianceReviewSLA === 'weekly' && (
            <p>
              ✓ <strong>SG-02:</strong> Enhanced Shariah Review (weekly monitoring)
            </p>
          )}
          <p>
            ✓ <strong>RM-05:</strong> Risk Appetite Framework ({riskAppetite} risk profile)
          </p>
          {enableVCs && (
            <p>
              ✓ <strong>AA-06:</strong> Verifiable Credentials (blockchain-based proof issuance)
            </p>
          )}
          {disclosurePolicy === 'full-audit-trail' && (
            <p>
              ✓ <strong>FR-08:</strong> Enhanced Disclosure (full audit trail transparency)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
