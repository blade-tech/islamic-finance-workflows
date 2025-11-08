'use client'

/**
 * STEP 1: REGULATORY JURISDICTION
 * ================================
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { JurisdictionConfig, Jurisdiction } from '@/lib/control-engine/types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'

interface JurisdictionStepProps {
  value?: JurisdictionConfig
  onChange: (value: JurisdictionConfig) => void
}

const JURISDICTION_OPTIONS: Array<{
  value: Jurisdiction
  label: string
  flag: string
  description: string
}> = [
  {
    value: 'Malaysia',
    label: 'Malaysia',
    flag: '🇲🇾',
    description: 'BNM oversight, SAC binding rulings, IFRS accounting'
  },
  {
    value: 'Saudi Arabia',
    label: 'Saudi Arabia',
    flag: '🇸🇦',
    description: 'SAMA/CMA regulations, SOCPA accounting standards'
  },
  {
    value: 'UAE',
    label: 'UAE (DIFC/ADGM/Onshore)',
    flag: '🇦🇪',
    description: 'Multi-zone regulation (CBUAE/DFSA/FSRA)'
  },
  {
    value: 'Qatar',
    label: 'Qatar',
    flag: '🇶🇦',
    description: 'QCB oversight, AAOIFI FAS mandatory'
  },
  {
    value: 'Bahrain',
    label: 'Bahrain',
    flag: '🇧🇭',
    description: 'CBB oversight, CSSB centralized board, AAOIFI standards'
  },
  {
    value: 'Other',
    label: 'Other',
    flag: '🌍',
    description: 'Other jurisdiction'
  }
]

export function JurisdictionStep({ value, onChange }: JurisdictionStepProps) {
  const [primaryJurisdiction, setPrimaryJurisdiction] = useState<Jurisdiction | undefined>(
    value?.primary
  )
  const [crossBorder, setCrossBorder] = useState(value?.crossBorder || false)
  const [additionalJurisdictions, setAdditionalJurisdictions] = useState<Jurisdiction[]>(
    value?.additional || []
  )

  // Store onChange in a ref to avoid infinite loop from changing reference
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Handlers call onChange directly - no useEffect needed
  const handlePrimaryChange = useCallback((value: string) => {
    const newJurisdiction = value as Jurisdiction
    setPrimaryJurisdiction(newJurisdiction)
    onChangeRef.current({
      primary: newJurisdiction,
      crossBorder,
      additional: crossBorder ? additionalJurisdictions : undefined
    })
  }, [crossBorder, additionalJurisdictions])

  const handleCrossBorderChange = useCallback((checked: boolean) => {
    setCrossBorder(checked)
    const newAdditionalJurisdictions = checked ? additionalJurisdictions : []
    if (!checked) {
      setAdditionalJurisdictions([])
    }
    if (primaryJurisdiction) {
      onChangeRef.current({
        primary: primaryJurisdiction,
        crossBorder: checked,
        additional: checked ? newAdditionalJurisdictions : undefined
      })
    }
  }, [primaryJurisdiction, additionalJurisdictions])

  const handleAdditionalJurisdictionToggle = useCallback((jurisdiction: Jurisdiction) => {
    if (jurisdiction === primaryJurisdiction) return // Can't select primary as additional

    const newAdditionalJurisdictions = additionalJurisdictions.includes(jurisdiction)
      ? additionalJurisdictions.filter((j) => j !== jurisdiction)
      : [...additionalJurisdictions, jurisdiction]

    setAdditionalJurisdictions(newAdditionalJurisdictions)

    if (primaryJurisdiction) {
      onChangeRef.current({
        primary: primaryJurisdiction,
        crossBorder,
        additional: newAdditionalJurisdictions
      })
    }
  }, [primaryJurisdiction, crossBorder, additionalJurisdictions])

  const availableAdditionalJurisdictions = JURISDICTION_OPTIONS.filter(
    (j) => j.value !== primaryJurisdiction
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 1: Select Regulatory Jurisdiction
        </h2>
        <p className="text-gray-600">
          Choose the primary jurisdiction(s) for this transaction. This determines applicable
          regulatory and compliance requirements.
        </p>
      </div>

      {/* Primary Jurisdiction Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">Primary Jurisdiction</Label>
        <RadioGroup value={primaryJurisdiction} onValueChange={handlePrimaryChange}>
          <div className="space-y-3">
            {JURISDICTION_OPTIONS.map((option) => (
              <Card
                key={option.value}
                className={`
                  p-4 transition-all border
                  ${
                    primaryJurisdiction === option.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{option.flag}</span>
                    <div>
                      <Label
                        htmlFor={option.value}
                        className="font-medium text-gray-900 cursor-pointer block"
                      >
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Cross-Border Selection */}
      {primaryJurisdiction && (
        <div className="pt-6 border-t">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="cross-border"
              checked={crossBorder}
              onCheckedChange={handleCrossBorderChange}
            />
            <div>
              <Label
                htmlFor="cross-border"
                className="font-semibold text-gray-900 cursor-pointer block"
              >
                Cross-Border Transaction (Multiple jurisdictions)
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select if this transaction involves investors or assets in multiple jurisdictions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Jurisdictions Selection */}
      {crossBorder && primaryJurisdiction && (
        <div className="pt-4">
          <Label className="text-lg font-semibold mb-4 block">
            Additional Jurisdictions
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableAdditionalJurisdictions.map((option) => (
              <Card
                key={option.value}
                className={`
                  p-3 transition-all border
                  ${
                    additionalJurisdictions.includes(option.value)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={additionalJurisdictions.includes(option.value)}
                    onCheckedChange={() => handleAdditionalJurisdictionToggle(option.value)}
                  />
                  <span className="text-xl">{option.flag}</span>
                  <Label className="cursor-pointer text-sm font-medium">
                    {option.label}
                  </Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Controls Activation Preview */}
      {primaryJurisdiction && primaryJurisdiction !== 'Other' && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
            <span className="mr-2">🎯</span>
            Controls Activated by This Selection
          </h4>
          <div className="text-sm text-purple-800 space-y-1">
            {/* Licensing Control */}
            <p>
              ✓ <strong>RL-01:</strong> Licensing & Registration (
              {primaryJurisdiction === 'Malaysia' && 'BNM licensing'}
              {primaryJurisdiction === 'Saudi Arabia' && 'SAMA banking license / CMA for securities'}
              {primaryJurisdiction === 'UAE' && 'Zone-specific: CBUAE/DFSA/FSRA'}
              {primaryJurisdiction === 'Qatar' && 'QCB licensing'}
              {primaryJurisdiction === 'Bahrain' && 'CBB licensing'}
              )
            </p>

            {/* Shariah Governance Control */}
            <p>
              ✓ <strong>RL-02:</strong> Shariah Governance (
              {primaryJurisdiction === 'Malaysia' && 'BNM SAC binding rulings (IFSA 2013)'}
              {primaryJurisdiction === 'Saudi Arabia' && 'SAMA Shariah Board + Institution SSB'}
              {primaryJurisdiction === 'UAE' && 'Higher Sharia Authority (onshore) / Independent SSB (free zones)'}
              {primaryJurisdiction === 'Qatar' && 'QCB Centralized Shariah Board'}
              {primaryJurisdiction === 'Bahrain' && 'CSSB Centralized Shariah Supervisory Board'}
              )
            </p>

            {/* Accounting Standards */}
            <p>
              ✓ <strong>FR-01:</strong> Accounting Framework (
              {primaryJurisdiction === 'Malaysia' && 'MFRS (IFRS-aligned)'}
              {primaryJurisdiction === 'Saudi Arabia' && 'SOCPA standards'}
              {primaryJurisdiction === 'UAE' && 'IFRS (AAOIFI FAS supplementary)'}
              {primaryJurisdiction === 'Qatar' && 'AAOIFI FAS mandatory'}
              {primaryJurisdiction === 'Bahrain' && 'AAOIFI FAS mandatory'}
              )
            </p>

            {/* AML/CTF - Universal */}
            <p>
              ✓ <strong>RL-04:</strong> AML/CTF Compliance (FATF standards apply)
            </p>

            {/* Jurisdiction-Specific Controls */}
            {primaryJurisdiction === 'Malaysia' && (
              <p>
                ✓ <strong>SG-MY-01:</strong> BNM SAC Endorsement (Mandatory for all products)
              </p>
            )}
            {primaryJurisdiction === 'Saudi Arabia' && (
              <p>
                ✓ <strong>RL-SA-02:</strong> Real Estate LTV Limits (Max 85% residential, 70% commercial)
              </p>
            )}

            {/* Prohibited Structures Warning */}
            {primaryJurisdiction === 'Malaysia' && (
              <p className="text-red-700 font-medium mt-2">
                ⚠️ <strong>Prohibited:</strong> Bay Al-Inah, Organized Tawarruq (BNM SAC)
              </p>
            )}

            {/* Cross-Border Controls */}
            {crossBorder && additionalJurisdictions.length > 0 && (
              <>
                <p className="mt-2">
                  ✓ <strong>FR-03:</strong> Multi-Jurisdiction Tax Reporting (
                  {primaryJurisdiction} + {additionalJurisdictions.join(', ')})
                </p>
                <p>
                  ✓ <strong>RL-05:</strong> Cross-Border Disclosure (IOSCO standards)
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
