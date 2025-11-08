'use client'

/**
 * STEP 2: PRODUCT STRUCTURE SELECTION
 * ====================================
 * Filters product structures based on jurisdiction prohibitions
 */

import { useState, useMemo, useRef, useEffect } from 'react'
import { ProductStructure, Jurisdiction } from '@/lib/control-engine/types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { isStructureProhibited, getProhibitedStructures } from '@/lib/control-engine/jurisdiction-controls'
import { AlertCircle } from 'lucide-react'

interface ProductStructureStepProps {
  value?: ProductStructure
  onChange: (value: ProductStructure) => void
  jurisdiction?: Jurisdiction // Passed from wizard to filter prohibited structures
}

const PRODUCT_OPTIONS = [
  {
    category: 'sukuk' as const,
    title: 'Sukuk (Asset-Backed Securities)',
    description: 'Islamic bonds representing ownership in underlying assets',
    subtypes: [
      { value: 'Ijarah', label: 'Ijarah (Leasing)', description: 'Asset-based lease structure' },
      { value: 'Murabaha', label: 'Murabaha (Cost-plus)', description: 'Asset purchase and resale' },
      { value: 'Musharakah', label: 'Musharakah (Partnership)', description: 'Profit/loss sharing partnership' },
      { value: 'Mudarabah', label: 'Mudarabah (Trust financing)', description: 'Entrepreneur-investor partnership' }
    ],
    icon: '📜',
    color: 'purple'
  },
  {
    category: 'banking' as const,
    title: 'Islamic Banking Products',
    description: 'Shariah-compliant banking and financing solutions',
    subtypes: [
      { value: 'Murabaha', label: 'Murabaha', description: 'Asset financing' },
      { value: 'Tawarruq', label: 'Tawarruq', description: 'Commodity murabaha for liquidity' },
      { value: 'Istisna\'a', label: 'Istisna\'a', description: 'Manufacturing finance' },
      { value: 'Salam', label: 'Salam', description: 'Advance purchase of commodities' }
    ],
    icon: '🏦',
    color: 'blue'
  },
  {
    category: 'funds' as const,
    title: 'Islamic Funds',
    description: 'Shariah-compliant investment funds and portfolios',
    subtypes: [
      { value: 'Equity Fund', label: 'Equity Fund', description: 'Shariah-screened stocks' },
      { value: 'Sukuk Fund', label: 'Sukuk Fund', description: 'Fixed-income Sukuk portfolio' },
      { value: 'Real Estate Fund', label: 'Real Estate Fund', description: 'Property investments' },
      { value: 'Commodity Fund', label: 'Commodity Fund', description: 'Halal commodity trading' }
    ],
    icon: '📊',
    color: 'green'
  },
  {
    category: 'equity' as const,
    title: 'Equity Investment',
    description: 'Shariah-compliant equity and venture capital',
    subtypes: [
      { value: 'Musharakah', label: 'Musharakah', description: 'Joint venture partnership' },
      { value: 'Mudarabah', label: 'Mudarabah', description: 'Venture capital structure' },
      { value: 'Diminishing Musharakah', label: 'Diminishing Musharakah', description: 'Declining partnership for ownership transfer' }
    ],
    icon: '💼',
    color: 'orange'
  }
]

export function ProductStructureStep({ value, onChange, jurisdiction }: ProductStructureStepProps) {
  const [selectedCategory, setSelectedCategory] = useState(value?.category)
  const [selectedSubtype, setSelectedSubtype] = useState(value?.subtype)

  // Store onChange in a ref to avoid infinite loop from changing reference
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Get prohibited structures for the selected jurisdiction
  const prohibitedStructures = useMemo(() => {
    return jurisdiction ? getProhibitedStructures(jurisdiction) : []
  }, [jurisdiction])

  const handleCategorySelect = (category: typeof selectedCategory) => {
    setSelectedCategory(category)
    setSelectedSubtype(undefined) // Reset subtype when category changes
  }

  const handleSubtypeSelect = (subtype: string) => {
    setSelectedSubtype(subtype)
    if (selectedCategory) {
      onChangeRef.current({
        category: selectedCategory,
        subtype: subtype
      })
    }
  }

  const selectedOption = PRODUCT_OPTIONS.find(opt => opt.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 2: Select Product Structure
        </h2>
        <p className="text-gray-600">
          Choose the Islamic finance structure for this deal. This determines core Shariah and risk compliance requirements.
        </p>
      </div>

      {/* Prohibited Structures Warning */}
      {jurisdiction && prohibitedStructures.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-2">
                ⚠️ Prohibited Structures in {jurisdiction}
              </h4>
              <div className="space-y-2">
                {prohibitedStructures.map((prohibited, index) => (
                  <div key={index} className="text-sm text-red-800">
                    <strong>{prohibited.structure}:</strong> {prohibited.reason}
                    <div className="text-xs text-red-700 mt-1">
                      Authority: {prohibited.authority} ({prohibited.reference})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">Product Category</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCT_OPTIONS.map((option) => (
            <Card
              key={option.category}
              className={`
                p-6 cursor-pointer transition-all hover:shadow-lg border-2
                ${selectedCategory === option.category
                  ? `border-${option.color}-600 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => handleCategorySelect(option.category)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
                {selectedCategory === option.category && (
                  <div className={`w-6 h-6 rounded-full bg-${option.color}-600 flex items-center justify-center`}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Subtype Selection */}
      {selectedOption && (
        <div className="pt-6 border-t">
          <Label className="text-lg font-semibold mb-4 block">
            {selectedOption.title} Structure
          </Label>
          <RadioGroup value={selectedSubtype} onValueChange={handleSubtypeSelect}>
            <div className="space-y-3">
              {selectedOption.subtypes.map((subtype) => {
                const prohibited = jurisdiction ? isStructureProhibited(subtype.value, jurisdiction) : undefined
                const isDisabled = !!prohibited

                return (
                  <Card
                    key={subtype.value}
                    className={`
                      p-4 transition-all border
                      ${isDisabled
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-red-300'
                        : selectedSubtype === subtype.value
                        ? `border-${selectedOption.color}-600 bg-${selectedOption.color}-50 cursor-pointer`
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }
                    `}
                    onClick={() => !isDisabled && handleSubtypeSelect(subtype.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={subtype.value}
                        id={subtype.value}
                        disabled={isDisabled}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={subtype.value}
                            className={`font-medium ${isDisabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900 cursor-pointer'}`}
                          >
                            {subtype.label}
                          </Label>
                          {prohibited && (
                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              PROHIBITED
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${isDisabled ? 'text-gray-500' : 'text-gray-600'}`}>
                          {prohibited ? prohibited.reason : subtype.description}
                        </p>
                        {prohibited && (
                          <p className="text-xs text-red-700 mt-1">
                            {prohibited.authority} - {prohibited.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Controls Activation Preview */}
      {selectedCategory && selectedSubtype && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
            <span className="mr-2">🎯</span>
            Controls Activated by This Selection
          </h4>
          <div className="text-sm text-purple-800 space-y-1">
            <p>✓ <strong>SG-01:</strong> SSB Mandate & Fatwa Issuance (all products require fatwa)</p>
            <p>✓ <strong>SG-02:</strong> Shariah Review (ongoing conformity check)</p>
            <p>✓ <strong>RM-01:</strong> SNC Risk Identification (all products have SNC risk)</p>
            {selectedSubtype === 'Ijarah' && (
              <p>✓ <strong>RM-02:</strong> Rate-of-Return Risk (asset-based returns have volatility)</p>
            )}
            {['Murabaha', 'Istisna\'a', 'Salam'].includes(selectedSubtype) && (
              <p>✓ <strong>RM-03:</strong> Credit/Counterparty Risk (payment obligations exist)</p>
            )}
            {['Musharakah', 'Mudarabah'].includes(selectedSubtype) && (
              <p>✓ <strong>RM-04:</strong> Equity Investment Risk (profit/loss sharing structure)</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
