'use client'

/**
 * STEP 5: SUSTAINABILITY & IMPACT (OPTIONAL)
 * ===========================================
 */

import { useState, useEffect, useRef } from 'react'
import { SustainabilityConfig, SustainabilityFramework } from '@/lib/control-engine/types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'

interface SustainabilityStepProps {
  value?: SustainabilityConfig
  onChange: (value: SustainabilityConfig) => void
}

const SUSTAINABILITY_TYPES: Array<{
  value: 'none' | 'green' | 'social' | 'sustainability-linked'
  label: string
  description: string
}> = [
  {
    value: 'none',
    label: 'No sustainability component',
    description: 'Skip to Step 6'
  },
  {
    value: 'green',
    label: 'Green/Sustainable Sukuk',
    description: 'Environmental projects (renewable energy, green buildings, etc.)'
  },
  {
    value: 'social',
    label: 'Social Impact Sukuk',
    description: 'Social welfare projects (education, healthcare, affordable housing)'
  },
  {
    value: 'sustainability-linked',
    label: 'Sustainability-Linked (KPI-based)',
    description: 'Performance-based sustainability targets'
  }
]

const FRAMEWORK_OPTIONS: Array<{
  value: SustainabilityFramework
  label: string
}> = [
  { value: 'ICMA-GBP', label: 'ICMA Green Bond Principles (GBP)' },
  { value: 'ICMA-SBP', label: 'ICMA Social Bond Principles (SBP)' },
  { value: 'ICMA-SLBP', label: 'ICMA Sustainability-Linked Bond Principles (SLBP)' },
  { value: 'BNM-VBIAF', label: 'BNM Value-Based Intermediation Assessment (VBIAF)' },
  { value: 'UN-SDG', label: 'UN Sustainable Development Goals (SDGs)' }
]

const IMPACT_CATEGORIES = [
  { value: 'Climate & Environment (SDG 13)', label: 'Climate & Environment (SDG 13, 14, 15)' },
  { value: 'Social Welfare (SDG 1)', label: 'Social Welfare (SDG 1, 2, 3, 8)' },
  { value: 'Economic Inclusion (SDG 8)', label: 'Economic Inclusion (SDG 8, 9, 10)' },
  { value: 'Governance & Ethics (SDG 16)', label: 'Governance & Ethics (SDG 16, 17)' }
]

export function SustainabilityStep({ value, onChange }: SustainabilityStepProps) {
  const [sustainabilityType, setSustainabilityType] = useState<
    'none' | 'green' | 'social' | 'sustainability-linked'
  >(value?.enabled ? value.type || 'green' : 'none')

  const [frameworks, setFrameworks] = useState<SustainabilityFramework[]>(value?.frameworks || [])
  const [impactCategories, setImpactCategories] = useState<string[]>(
    value?.impactCategories || []
  )

  // Store onChange in a ref to avoid infinite loop from changing reference
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Update parent whenever any value changes
  useEffect(() => {
    if (sustainabilityType === 'none') {
      onChangeRef.current({
        enabled: false
      })
    } else {
      onChangeRef.current({
        enabled: true,
        type: sustainabilityType,
        frameworks,
        impactCategories
      })
    }
  }, [sustainabilityType, frameworks, impactCategories])

  const handleFrameworkToggle = (framework: SustainabilityFramework) => {
    setFrameworks((prev) =>
      prev.includes(framework) ? prev.filter((f) => f !== framework) : [...prev, framework]
    )
  }

  const handleImpactCategoryToggle = (category: string) => {
    setImpactCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const enabled = sustainabilityType !== 'none'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 5: Sustainability & Impact (Optional)
        </h2>
        <p className="text-gray-600">
          Define sustainability goals and impact frameworks for this transaction.
        </p>
      </div>

      {/* Sustainability Type Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Does this transaction have sustainability goals?
        </Label>
        <RadioGroup
          value={sustainabilityType}
          onValueChange={(v) => setSustainabilityType(v as any)}
        >
          <div className="space-y-3">
            {SUSTAINABILITY_TYPES.map((type) => (
              <Card
                key={type.value}
                className={`
                  p-4 cursor-pointer transition-all border
                  ${
                    sustainabilityType === type.value
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setSustainabilityType(type.value)}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className="flex-1">
                    <Label
                      htmlFor={type.value}
                      className="font-medium text-gray-900 cursor-pointer block"
                    >
                      {type.label}
                    </Label>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Framework Alignment - only show if enabled */}
      {enabled && (
        <div className="pt-6 border-t">
          <Label className="text-lg font-semibold mb-4 block">Framework Alignment</Label>
          <div className="space-y-3">
            {FRAMEWORK_OPTIONS.map((framework) => (
              <Card
                key={framework.value}
                className={`
                  p-3 cursor-pointer transition-all border
                  ${
                    frameworks.includes(framework.value)
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleFrameworkToggle(framework.value)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={frameworks.includes(framework.value)}
                    onCheckedChange={() => handleFrameworkToggle(framework.value)}
                  />
                  <Label className="cursor-pointer flex-1">{framework.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Impact Categories - only show if enabled */}
      {enabled && (
        <div className="pt-6 border-t">
          <Label className="text-lg font-semibold mb-4 block">
            Impact Categories (select all that apply)
          </Label>
          <div className="space-y-3">
            {IMPACT_CATEGORIES.map((category) => (
              <Card
                key={category.value}
                className={`
                  p-3 cursor-pointer transition-all border
                  ${
                    impactCategories.includes(category.value)
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleImpactCategoryToggle(category.value)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={impactCategories.includes(category.value)}
                    onCheckedChange={() => handleImpactCategoryToggle(category.value)}
                  />
                  <Label className="cursor-pointer flex-1">{category.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Controls Activation Preview */}
      {enabled && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
            <span className="mr-2">🎯</span>
            Controls Activated by This Selection
          </h4>
          <div className="text-sm text-purple-800 space-y-1">
            {sustainabilityType === 'green' && (
              <p>
                ✓ <strong>FR-04:</strong> Use of Proceeds Tracking (quarterly allocation reporting
                to eligible green projects per ICMA GBP)
              </p>
            )}
            {sustainabilityType === 'social' && (
              <p>
                ✓ <strong>FR-04:</strong> Use of Proceeds Tracking (quarterly allocation reporting
                to social projects per ICMA SBP)
              </p>
            )}
            {frameworks.length > 0 && (
              <p>
                ✓ <strong>AA-04:</strong> External Assurance (Second Party Opinion from
                accredited provider per ICMA {frameworks[0]} §4)
              </p>
            )}
            {impactCategories.includes('Climate & Environment (SDG 13)') && (
              <p>
                ✓ <strong>SG-04:</strong> Shariah Risk Management (Maqasid alignment check for
                sustainability goals)
              </p>
            )}
            {sustainabilityType === 'sustainability-linked' && (
              <p>
                ✓ <strong>FR-07:</strong> KPI Reporting (sustainability performance indicator
                tracking per ICMA SLBP)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
