'use client'

/**
 * CONFIGURATION WIZARD - 6-Step Deal Profile Setup
 * ==================================================
 * Visual mockup of the new workflow configuration process
 *
 * STEPS:
 * 1. Regulatory Jurisdiction
 * 2. Product Structure Selection
 * 3. Transaction Scale & Visibility
 * 4. Accounting & Reporting Framework
 * 5. Sustainability & Impact (Optional)
 * 6. Stakeholder & Governance Setup
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { DealConfiguration } from '@/lib/control-engine/types'
import { ProductStructureStep } from './steps/ProductStructureStep'
import { JurisdictionStep } from './steps/JurisdictionStep'
import { TransactionScaleStep } from './steps/TransactionScaleStep'
import { AccountingStep } from './steps/AccountingStep'
import { SustainabilityStep } from './steps/SustainabilityStep'
import { GovernanceStep } from './steps/GovernanceStep'
import { DocumentUploadMock } from './DocumentUploadMock'

interface ConfigurationWizardProps {
  onComplete: (config: DealConfiguration) => void
  initialConfig?: Partial<DealConfiguration>
}

const STEP_TITLES = [
  'Regulatory Jurisdiction',
  'Product Structure',
  'Transaction Scale & Visibility',
  'Accounting & Reporting',
  'Sustainability & Impact',
  'Stakeholder & Governance'
]

export function ConfigurationWizard({ onComplete, initialConfig }: ConfigurationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [config, setConfig] = useState<Partial<DealConfiguration>>(initialConfig || {})
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const progress = ((currentStep + 1) / 6) * 100

  // Using useRef pattern to avoid recreating callback on every step change
  const currentStepRef = useRef(currentStep)
  useEffect(() => {
    currentStepRef.current = currentStep
  }, [currentStep])

  const handleStepComplete = useCallback((stepData: Partial<DealConfiguration>) => {
    setConfig(prev => ({ ...prev, ...stepData }))
    setCompletedSteps(prev => new Set([...prev, currentStepRef.current]))
  }, [])

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step - complete configuration
      onComplete(config as DealConfiguration)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = completedSteps.has(currentStep)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configure Deal Profile
          </h1>
          <p className="text-gray-600">
            Step {currentStep + 1} of 6: {STEP_TITLES[currentStep]}
          </p>
          <Progress value={progress} className="mt-4 h-2" />
        </div>

        {/* Step Progress Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEP_TITLES.map((title, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                    ${index === currentStep
                      ? 'bg-purple-600 text-white ring-4 ring-purple-200'
                      : completedSteps.has(index)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {completedSteps.has(index) ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs text-center text-gray-600 hidden sm:block">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-6">
          {currentStep === 0 && (
            <>
              <JurisdictionStep
                value={config.jurisdiction}
                onChange={(data) => handleStepComplete({ jurisdiction: data })}
              />
              <div className="mt-8 pt-8 border-t">
                <DocumentUploadMock />
              </div>
            </>
          )}
          {currentStep === 1 && (
            <ProductStructureStep
              value={config.productStructure}
              onChange={(data) => handleStepComplete({ productStructure: data })}
              jurisdiction={config.jurisdiction?.primary}
            />
          )}
          {currentStep === 2 && (
            <TransactionScaleStep
              value={config.transactionScale}
              onChange={(data) => handleStepComplete({ transactionScale: data })}
            />
          )}
          {currentStep === 3 && (
            <AccountingStep
              value={config.accounting}
              onChange={(data) => handleStepComplete({ accounting: data })}
            />
          )}
          {currentStep === 4 && (
            <SustainabilityStep
              value={config.sustainability}
              onChange={(data) => handleStepComplete({ sustainability: data })}
            />
          )}
          {currentStep === 5 && (
            <GovernanceStep
              value={config.governance}
              onChange={(data) => handleStepComplete({ governance: data })}
            />
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {canProceed ? (
              <span className="text-green-600 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Step completed
              </span>
            ) : (
              <span>Complete this step to continue</span>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentStep === 5 ? (
              <>
                Review & Proceed
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          💡 Your selections will automatically activate the required compliance controls
        </div>
      </div>
    </div>
  )
}
