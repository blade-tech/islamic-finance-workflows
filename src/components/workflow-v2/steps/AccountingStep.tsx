'use client'

/**
 * STEP 4: ACCOUNTING & REPORTING FRAMEWORK
 * =========================================
 */

import { useState, useEffect, useRef } from 'react'
import { AccountingConfig } from '@/lib/control-engine/types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'

interface AccountingStepProps {
  value?: AccountingConfig
  onChange: (value: AccountingConfig) => void
}

const ACCOUNTING_FRAMEWORKS: Array<{
  value: 'AAOIFI' | 'IFRS' | 'Dual'
  label: string
  description: string
  details: string
}> = [
  {
    value: 'AAOIFI',
    label: 'AAOIFI',
    description: 'Accounting and Auditing Organization for Islamic Financial Institutions',
    details: 'FAS 1-34, GS-1/2/3, Shariah-centric reporting'
  },
  {
    value: 'IFRS',
    label: 'IFRS',
    description: 'International Financial Reporting Standards with Islamic finance adaptations',
    details: 'IFRS 9, substance-over-form approach'
  },
  {
    value: 'Dual',
    label: 'Dual Reporting (AAOIFI + IFRS)',
    description: 'Two parallel reporting streams',
    details: 'Complies with both AAOIFI and IFRS standards'
  }
]

const REPORTING_FREQUENCIES: Array<{
  value: 'monthly' | 'quarterly' | 'semi-annual' | 'annual'
  label: string
}> = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi-annual', label: 'Semi-Annual' },
  { value: 'annual', label: 'Annual' }
]

const MONTH_OPTIONS = [
  { value: '01-31', label: 'January 31' },
  { value: '02-28', label: 'February 28/29' },
  { value: '03-31', label: 'March 31' },
  { value: '04-30', label: 'April 30' },
  { value: '05-31', label: 'May 31' },
  { value: '06-30', label: 'June 30' },
  { value: '07-31', label: 'July 31' },
  { value: '08-31', label: 'August 31' },
  { value: '09-30', label: 'September 30' },
  { value: '10-31', label: 'October 31' },
  { value: '11-30', label: 'November 30' },
  { value: '12-31', label: 'December 31' }
]

export function AccountingStep({ value, onChange }: AccountingStepProps) {
  const [framework, setFramework] = useState<'AAOIFI' | 'IFRS' | 'Dual'>(
    value?.framework || 'AAOIFI'
  )
  const [reportingFrequency, setReportingFrequency] = useState<
    'monthly' | 'quarterly' | 'semi-annual' | 'annual'
  >(value?.reportingFrequency || 'quarterly')
  const [financialYearEnd, setFinancialYearEnd] = useState(
    value?.financialYearEnd || '12-31'
  )

  // Store onChange in a ref to avoid infinite loop from changing reference
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Update parent whenever any value changes
  useEffect(() => {
    onChangeRef.current({
      framework,
      reportingFrequency,
      financialYearEnd
    })
  }, [framework, reportingFrequency, financialYearEnd])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 4: Accounting & Reporting Framework
        </h2>
        <p className="text-gray-600">
          Select the accounting standard and reporting requirements for this transaction.
        </p>
      </div>

      {/* Primary Accounting Standard */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">Primary Accounting Standard</Label>
        <RadioGroup value={framework} onValueChange={(v) => setFramework(v as any)}>
          <div className="space-y-3">
            {ACCOUNTING_FRAMEWORKS.map((fw) => (
              <Card
                key={fw.value}
                className={`
                  p-4 cursor-pointer transition-all border
                  ${
                    framework === fw.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setFramework(fw.value)}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={fw.value} id={fw.value} className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor={fw.value}
                      className="font-medium text-gray-900 cursor-pointer block"
                    >
                      {fw.label}
                    </Label>
                    <p className="text-sm text-gray-700 mt-1">{fw.description}</p>
                    <p className="text-sm text-gray-600 mt-1">→ {fw.details}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Reporting Frequency */}
      <div className="pt-6 border-t">
        <Label className="text-lg font-semibold mb-4 block">Reporting Frequency</Label>
        <RadioGroup
          value={reportingFrequency}
          onValueChange={(v) => setReportingFrequency(v as any)}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {REPORTING_FREQUENCIES.map((freq) => (
              <Card
                key={freq.value}
                className={`
                  p-4 cursor-pointer transition-all border text-center
                  ${
                    reportingFrequency === freq.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setReportingFrequency(freq.value)}
              >
                <div className="flex flex-col items-center space-y-2">
                  <RadioGroupItem value={freq.value} id={freq.value} />
                  <Label htmlFor={freq.value} className="cursor-pointer font-medium">
                    {freq.label}
                  </Label>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Financial Year End */}
      <div className="pt-6 border-t">
        <Label htmlFor="year-end" className="text-lg font-semibold mb-4 block">
          Financial Year End
        </Label>
        <select
          id="year-end"
          value={financialYearEnd}
          onChange={(e) => setFinancialYearEnd(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {MONTH_OPTIONS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600 mt-2">Gregorian calendar</p>
      </div>

      {/* Controls Activation Preview */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
          <span className="mr-2">🎯</span>
          Controls Activated by This Selection
        </h4>
        <div className="text-sm text-purple-800 space-y-1">
          {framework === 'AAOIFI' && (
            <p>
              ✓ <strong>FR-01:</strong> AAOIFI Reporting (FAS-compliant financial statements)
            </p>
          )}
          {framework === 'IFRS' && (
            <p>
              ✓ <strong>FR-01:</strong> IFRS Reporting (IFRS 9-compliant statements)
            </p>
          )}
          {framework === 'Dual' && (
            <>
              <p>
                ✓ <strong>FR-01:</strong> AAOIFI + IFRS Reporting (dual compliance required)
              </p>
              <p>
                ✓ <strong>FR-05:</strong> Reconciliation Reporting (reconcile AAOIFI/IFRS
                differences)
              </p>
            </>
          )}
          {['quarterly', 'monthly'].includes(reportingFrequency) && (
            <p>
              ✓ <strong>FR-02:</strong> Regulatory Reporting ({reportingFrequency} filings)
            </p>
          )}
          {(framework === 'AAOIFI' || framework === 'Dual') && (
            <p>
              ✓ <strong>AA-05:</strong> Shariah Audit (AAOIFI requires Shariah audit per GS-3 §5)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
