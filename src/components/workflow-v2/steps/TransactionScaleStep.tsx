'use client'

/**
 * STEP 3: TRANSACTION SCALE & VISIBILITY
 * =======================================
 */

import { useState, useEffect, useRef } from 'react'
import { TransactionScale } from '@/lib/control-engine/types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface TransactionScaleStepProps {
  value?: TransactionScale
  onChange: (value: TransactionScale) => void
}

const SIZE_RANGES = [
  { value: 10_000_000, label: '< $10M', description: 'Small-scale transaction' },
  { value: 30_000_000, label: '$10M - $50M', description: 'Medium-scale transaction' },
  { value: 100_000_000, label: '$50M - $500M', description: 'Large-scale transaction' },
  { value: 750_000_000, label: '> $500M', description: 'Mega-scale transaction' }
]

const OFFERING_TYPES: Array<{
  value: 'private' | 'public' | 'hybrid'
  label: string
  description: string
}> = [
  {
    value: 'private',
    label: 'Private Placement',
    description: 'Institutional investors only'
  },
  {
    value: 'public',
    label: 'Public Offering',
    description: 'Retail investors'
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
    description: 'Both institutional and retail'
  }
]

const EXCHANGES = [
  'Bursa Malaysia',
  'Dubai Financial Market',
  'Tadawul (Saudi Exchange)',
  'London Stock Exchange',
  'Luxembourg Stock Exchange',
  'Singapore Exchange',
  'Indonesia Stock Exchange',
  'Other'
]

export function TransactionScaleStep({ value, onChange }: TransactionScaleStepProps) {
  const [sizeRange, setSizeRange] = useState<number>(
    value?.size || 100_000_000
  )
  const [exactSize, setExactSize] = useState<string>(
    value?.size?.toString() || '100000000'
  )
  const [offeringType, setOfferingType] = useState<'private' | 'public' | 'hybrid'>(
    value?.offeringType || 'public'
  )
  const [listed, setListed] = useState(value?.listed || false)
  const [exchange, setExchange] = useState(value?.exchange || 'Bursa Malaysia')

  // Store onChange in a ref to avoid infinite loop from changing reference
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Update parent whenever any value changes
  useEffect(() => {
    const numericSize = parseInt(exactSize) || sizeRange
    onChangeRef.current({
      size: numericSize,
      offeringType,
      listed,
      exchange: listed ? exchange : undefined
    })
  }, [exactSize, sizeRange, offeringType, listed, exchange])

  const handleSizeRangeChange = (value: string) => {
    const numValue = parseInt(value)
    setSizeRange(numValue)
    setExactSize(numValue.toString())
  }

  const handleExactSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setExactSize(value)
  }

  const formattedSize = parseInt(exactSize || '0').toLocaleString('en-US')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 3: Transaction Scale & Visibility
        </h2>
        <p className="text-gray-600">
          Determine the size, investor type, and public visibility of this transaction.
        </p>
      </div>

      {/* Transaction Size Range */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">Transaction Size</Label>
        <RadioGroup value={sizeRange.toString()} onValueChange={handleSizeRangeChange}>
          <div className="space-y-3">
            {SIZE_RANGES.map((range) => (
              <Card
                key={range.value}
                className={`
                  p-4 cursor-pointer transition-all border
                  ${
                    sizeRange === range.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleSizeRangeChange(range.value.toString())}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={range.value.toString()} id={range.value.toString()} />
                  <div className="flex-1">
                    <Label
                      htmlFor={range.value.toString()}
                      className="font-medium text-gray-900 cursor-pointer block"
                    >
                      {range.label}
                    </Label>
                    <p className="text-sm text-gray-600">{range.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Exact Amount */}
      <div className="pt-4">
        <Label htmlFor="exact-size" className="font-semibold mb-2 block">
          Exact Amount
        </Label>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">$</span>
          <Input
            id="exact-size"
            type="text"
            value={exactSize}
            onChange={handleExactSizeChange}
            className="flex-1 max-w-xs text-lg"
            placeholder="100000000"
          />
          <span className="text-sm text-gray-600">USD</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          = ${formattedSize} USD
        </p>
      </div>

      {/* Offering Type */}
      <div className="pt-6 border-t">
        <Label className="text-lg font-semibold mb-4 block">Offering Type</Label>
        <RadioGroup value={offeringType} onValueChange={(v) => setOfferingType(v as any)}>
          <div className="space-y-3">
            {OFFERING_TYPES.map((type) => (
              <Card
                key={type.value}
                className={`
                  p-4 cursor-pointer transition-all border
                  ${
                    offeringType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setOfferingType(type.value)}
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

      {/* Listing */}
      <div className="pt-6 border-t">
        <div className="flex items-start space-x-3 mb-4">
          <Checkbox
            id="listed"
            checked={listed}
            onCheckedChange={(checked) => setListed(checked as boolean)}
          />
          <div>
            <Label htmlFor="listed" className="font-semibold text-gray-900 cursor-pointer block">
              Listed on Exchange
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Select if this transaction will be listed on a public exchange
            </p>
          </div>
        </div>

        {listed && (
          <div className="mt-4 ml-7">
            <Label htmlFor="exchange" className="font-medium mb-2 block">
              Exchange
            </Label>
            <select
              id="exchange"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EXCHANGES.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Controls Activation Preview */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
          <span className="mr-2">🎯</span>
          Controls Activated by This Selection
        </h4>
        <div className="text-sm text-purple-800 space-y-1">
          {parseInt(exactSize || '0') > 50_000_000 && (
            <p>
              ✓ <strong>AA-02:</strong> External Shariah Audit (size &gt;$50M requires
              independent audit per IFSB-10 §4.2)
            </p>
          )}
          {offeringType === 'public' && (
            <p>
              ✓ <strong>RL-03:</strong> Public Offering Compliance (prospectus required)
            </p>
          )}
          {listed && (
            <p>
              ✓ <strong>AA-03:</strong> Periodic Assurance Reports (listed = semi-annual
              assurance per exchange rules)
            </p>
          )}
          {(offeringType === 'public' || offeringType === 'hybrid') && (
            <p>
              ✓ <strong>FR-06:</strong> Investor Reporting (quarterly updates to investors)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
