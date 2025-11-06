'use client'

/**
 * WORKFLOW CONTAINER
 * ==================
 * Main workflow orchestrator displaying the 10-step modular architecture process.
 *
 * 10 WORKFLOW STEPS (4-Component Modular Architecture → Guardian Policy Execution):
 * 1.  Connect Sources         - Check backend services, connect to Graphiti
 * 2.  Select Shariah Structure - Choose Islamic finance mechanism (Component 1 of 4)
 * 3.  Select Jurisdiction     - Choose legal/regulatory framework (Component 2 of 4)
 * 4.  Select Accounting       - Choose accounting standards (Component 3 of 4)
 * 5.  Select Impact Metrics   - Choose ESG/sustainability framework (Component 4 of 4)
 * 6.  Review Configuration    - Validate 4-component configuration
 * 7.  Configure Details       - Fill workflow parameters + optional document uploads
 * 8.  Review Policy Structure - View Guardian policy (schemas, steps, roles) generated from config
 * 9.  Test Workflow           - Run Guardian dry run simulation (sandbox, not blockchain)
 * 10. Live Execution          - Deploy to Guardian & execute on Hedera Blockchain
 *
 * UX PATTERN:
 * - Human-in-the-loop (AI works → human guides)
 * - 4-component modular selection (Shariah, Jurisdiction, Accounting, Impact)
 * - Configuration composition from all 4 components
 * - Optional document uploads integrated into Configure Details (Step 7)
 * - Sandbox testing before production execution
 * - Real-time oversight and interruption capability
 *
 * NOTE: Steps 2-6 are new for modular architecture (Phase 4A pivot)
 * NOTE: Legacy "Select Template" step removed - 4 components ARE the methodologies
 * NOTE: Context Upload removed as separate step - now integrated into Step 7
 * NOTE: Citation Verification and Outcome steps removed - workflow ends at deployment
 */

import { useEffect, useRef, useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

// Onboarding components
import { WelcomeModal } from '@/components/onboarding/WelcomeModal'
import { ProductTour } from '@/components/onboarding/ProductTour'

// Step components
import { Step1SourceConnection } from './steps/Step1SourceConnection'
import { Step2SelectShariahStructure } from './steps/Step2SelectShariahStructure'
import { Step3SelectJurisdiction } from './steps/Step3SelectJurisdiction'
import { Step4SelectAccounting } from './steps/Step4SelectAccounting'
import { Step5SelectImpact } from './steps/Step5SelectImpact'
import { Step6ReviewConfiguration } from './steps/Step6ReviewConfiguration'
import { Step7ConfigureDetails } from './steps/Step7ConfigureDetails'
import { Step8ReviewPolicyStructure } from './steps/Step8ReviewPolicyStructure'
import { Step3TestWorkflow } from './steps/Step3TestWorkflow'
import { Step10LiveExecution } from './steps/Step10LiveExecution'
import { Step11MonitorCollaborate } from './steps/Step11MonitorCollaborate'

const STEPS = [
  { index: 0, title: 'Connect Sources', component: Step1SourceConnection },
  { index: 1, title: 'Select Shariah Structure', component: Step2SelectShariahStructure },
  { index: 2, title: 'Select Jurisdiction', component: Step3SelectJurisdiction },
  { index: 3, title: 'Select Accounting', component: Step4SelectAccounting },
  { index: 4, title: 'Select Impact Metrics', component: Step5SelectImpact },
  { index: 5, title: 'Review Configuration', component: Step6ReviewConfiguration },
  { index: 6, title: 'Configure Details', component: Step7ConfigureDetails },
  { index: 7, title: 'Review Policy Structure', component: Step8ReviewPolicyStructure },
  { index: 8, title: 'Test Workflow', component: Step3TestWorkflow },
  { index: 9, title: 'Live Execution', component: Step10LiveExecution },
  { index: 10, title: 'Monitor & Collaborate', component: Step11MonitorCollaborate },
]

export function WorkflowContainer() {
  const execution = useWorkflowStore((state) => state.execution)
  const initializeExecution = useWorkflowStore((state) => state.initializeExecution)
  const nextStep = useWorkflowStore((state) => state.nextStep)
  const previousStep = useWorkflowStore((state) => state.previousStep)
  const loadDemoConfiguration = useWorkflowStore((state) => state.loadDemoConfiguration)

  // Tour state management
  const [runTour, setRunTour] = useState(false)
  const [isTourRunning, setIsTourRunning] = useState(false)

  // Scroll controls for step indicators
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check scroll position to enable/disable arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  // Scroll left/right
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  // Initialize execution on mount (only once)
  useEffect(() => {
    if (!execution) {
      initializeExecution('user_123') // TODO: Get real user ID
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check scroll position on mount and when scrolling
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }

    checkScroll()
    container.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [execution])

  if (!execution) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Initializing workflow...</p>
      </div>
    )
  }

  const currentStep = STEPS[execution.currentStepIndex]
  const CurrentStepComponent = currentStep.component
  const progressPercentage = ((execution.currentStepIndex + 1) / STEPS.length) * 100

  const canGoBack = execution.currentStepIndex > 0

  // Validate if user can proceed to next step based on current step requirements
  const canGoNext = (() => {
    if (execution.currentStepIndex >= STEPS.length - 1) return false

    // Step-specific validation (RELAXED FOR TESTING - enable strict validation later)
    switch (execution.currentStepIndex) {
      case 0: // Step 1: Connect Sources - ALLOW PROCEED (for testing)
        return true // STRICT: execution.graphitiConnected
      case 1: // Step 2: Select Shariah Structure - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedShariahStructure !== null
      case 2: // Step 3: Select Jurisdiction - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedJurisdiction !== null
      case 3: // Step 4: Select Accounting - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedAccounting !== null
      case 4: // Step 5: Select Impact Metrics - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedImpact !== null
      case 5: // Step 6: Review Configuration - ALLOW PROCEED (for testing)
        return true // STRICT: execution.dealConfiguration?.isValid === true
      case 6: // Step 7: Configure Details (includes optional uploads) - ALLOW PROCEED
        return true // STRICT: validate form completion
      case 7: // Step 8: Review Policy Structure - allow proceed
        return true
      case 8: // Step 9: Test Workflow - allow proceed
        return true
      case 9: // Step 10: Live Execution - Final step
        return false // No next step after deployment
      default:
        return true
    }
  })()

  return (
    <div className="min-h-screen bg-background" data-tour="dashboard">
      {/* Header with progress */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Title and Demo Button */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">ZeroH</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Sustainable Islamic Finance governance, monitoring and risk management system
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDemoConfiguration}
                className="shrink-0"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Load QIIB Oryx Demo
              </Button>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Step {execution.currentStepIndex + 1} of {STEPS.length}:{' '}
                  {currentStep.title}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} />
            </div>

            {/* Step indicators with scroll arrows */}
            <div className="relative flex items-center gap-2">
              {/* Left scroll arrow */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`flex-shrink-0 p-1 rounded-md border bg-background transition-all ${
                  canScrollLeft
                    ? 'hover:bg-accent cursor-pointer opacity-100'
                    : 'opacity-30 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Scrollable step indicators */}
              <ScrollArea className="flex-1 whitespace-nowrap">
                <div ref={scrollContainerRef} className="flex gap-2 pb-2">
                  {STEPS.map((step) => {
                    const isCompleted = step.index < execution.currentStepIndex
                    const isCurrent = step.index === execution.currentStepIndex
                    const isUpcoming = step.index > execution.currentStepIndex

                    return (
                      <button
                        key={step.index}
                        onClick={() => {
                          // Allow navigating to ANY step (for testing)
                          useWorkflowStore.setState((state) => ({
                            execution: state.execution
                              ? { ...state.execution, currentStepIndex: step.index }
                              : null,
                          }))
                        }}
                        disabled={false} // was: disabled={isUpcoming}
                        className={`
                          flex-shrink-0 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer
                          ${
                            isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : isCompleted
                              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }
                        `}
                      >
                        {step.index + 1}. {step.title}
                      </button>
                    )
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Right scroll arrow */}
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`flex-shrink-0 p-1 rounded-md border bg-background transition-all ${
                  canScrollRight
                    ? 'hover:bg-accent cursor-pointer opacity-100'
                    : 'opacity-30 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <CurrentStepComponent />
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={!canGoBack}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Step
          </Button>

          <div className="text-right">
            <Button
              onClick={nextStep}
              disabled={!canGoNext}
            >
              Next Step
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            {!canGoNext && execution.currentStepIndex < STEPS.length - 1 && (
              <p className="text-xs text-muted-foreground mt-1">
                {/* Removed validation for testing - navigate freely */}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding System */}
      <WelcomeModal
        onStartTour={() => setRunTour(true)}
        onSkip={() => setRunTour(false)}
      />
      <ProductTour
        run={runTour}
        onComplete={() => setRunTour(false)}
        onStateChange={setIsTourRunning}
      />
    </div>
  )
}
