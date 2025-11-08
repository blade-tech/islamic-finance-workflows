'use client'

/**
 * WORKFLOW CONTAINER
 * ==================
 * Main workflow orchestrator for GRC-aligned Islamic finance deal configuration.
 *
 * 11 WORKFLOW STEPS (V2 Jurisdiction-First Approach → Guardian Policy Execution):
 * 1.  Connect Sources              - Check backend services, connect to Graphiti
 * 2.  Regulatory Jurisdiction (V2) - Choose jurisdiction FIRST (enables prohibition filtering)
 * 3.  Product Structure (V2)       - Choose Islamic finance product (filtered by jurisdiction)
 * 4.  Transaction Scale (V2)       - Define size, offering type, listing (activates scale-based controls)
 * 5.  Accounting & Reporting (V2)  - Choose accounting standard + reporting frequency
 * 6.  Sustainability & Impact (V2) - Optional ESG/sustainability framework
 * 7.  Configure Details            - Fill workflow parameters + optional document uploads
 * 8.  Review Policy Structure      - View Guardian policy (schemas, steps, roles) generated from config
 * 9.  Test Workflow                - Run Guardian dry run simulation (sandbox, not blockchain)
 * 10. Live Execution               - Deploy to Guardian & execute on Hedera Blockchain
 * 11. Monitor & Collaborate        - Track execution, collaborate with stakeholders
 *
 * V2 INTEGRATION (GRC-ALIGNED WORKFLOW):
 * - Jurisdiction-first philosophy: Start with regulatory context, then filter products
 * - Prohibition filtering: Malaysia prohibits Bay Al-Inah and Organized Tawarruq
 * - Inline control activation: Each step shows which controls activate
 * - Transaction scale-based controls: Large deals (>$50M) trigger external Shariah audit
 * - Dual reporting: AAOIFI + IFRS support with reconciliation controls
 *
 * DATA MODEL:
 * - V2 components wrap around main demo Zustand store via adapter layer
 * - Bidirectional mapping: V2 ↔ Main demo (ProductStructure ↔ ShariahStructure, etc.)
 * - V2-specific fields: transactionScale, governance, crossBorder, reportingFrequency
 * - Backward compatible: V2 fields are optional in WorkflowExecution type
 *
 * UX PATTERN:
 * - Human-in-the-loop (AI works → human guides)
 * - GRC-aligned compliance-first workflow
 * - Self-documenting steps with inline control activation previews
 * - Sandbox testing before production execution
 * - Real-time oversight and interruption capability
 */

import { useEffect, useRef, useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, Sparkles, HelpCircle } from 'lucide-react'

// Onboarding components
import { WelcomeModal } from '@/components/onboarding/WelcomeModal'
import { ProductTour } from '@/components/onboarding/ProductTour'
import { useTour } from '@/hooks/useTour'

// Per-page tours
import { getTourForPage, hasTourForPage } from '@/lib/page-tours'

// Step components
import { Step1SourceConnection } from './steps/Step1SourceConnection'
import { Step2JurisdictionV2 } from './steps-v2-wrappers/Step2JurisdictionV2'
import { Step3ProductStructureV2 } from './steps-v2-wrappers/Step3ProductStructureV2'
import { Step4TransactionScaleV2 } from './steps-v2-wrappers/Step4TransactionScaleV2'
import { Step5AccountingV2 } from './steps-v2-wrappers/Step5AccountingV2'
import { Step6SustainabilityV2 } from './steps-v2-wrappers/Step6SustainabilityV2'
import { Step7ConfigureDetails } from './steps/Step7ConfigureDetails'
import { Step8ReviewPolicyStructure } from './steps/Step8ReviewPolicyStructure'
import { Step3TestWorkflow } from './steps/Step3TestWorkflow'
import { Step10LiveExecution } from './steps/Step10LiveExecution'
import { Step11MonitorCollaborate } from './steps/Step11MonitorCollaborate'

const STEPS = [
  { index: 0, title: 'Connect Sources', component: Step1SourceConnection },
  { index: 1, title: 'Regulatory Jurisdiction', component: Step2JurisdictionV2 },
  { index: 2, title: 'Product Structure', component: Step3ProductStructureV2 },
  { index: 3, title: 'Transaction Scale', component: Step4TransactionScaleV2 },
  { index: 4, title: 'Accounting & Reporting', component: Step5AccountingV2 },
  { index: 5, title: 'Sustainability & Impact', component: Step6SustainabilityV2 },
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

  // Tour state management (global state via Zustand)
  const { runTour, startTour, stopTour } = useTour()
  const [isTourRunning, setIsTourRunning] = useState(false)

  // Page-specific tour state
  const [pageTourSteps, setPageTourSteps] = useState<any[]>([])
  const [showPageTour, setShowPageTour] = useState(false)

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

  // Start page-specific tour
  const startPageTour = () => {
    if (!execution) return

    const steps = getTourForPage(execution.currentStepIndex)

    if (steps) {
      setPageTourSteps(steps)
      setShowPageTour(true)
    } else {
      console.log(`[PageTour] No tour available for step ${execution.currentStepIndex}`)
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
      case 0: // Step 0: Welcome Screen - always allow proceed
        return true
      case 1: // Step 1: Connect Sources - ALLOW PROCEED (for testing)
        return true // STRICT: execution.graphitiConnected
      case 2: // Step 2: Select Shariah Structure - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedShariahStructure !== null
      case 3: // Step 3: Select Jurisdiction - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedJurisdiction !== null
      case 4: // Step 4: Select Accounting - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedAccounting !== null
      case 5: // Step 5: Select Impact Metrics - ALLOW PROCEED (for testing)
        return true // STRICT: execution.selectedImpact !== null
      case 6: // Step 6: Review Configuration - ALLOW PROCEED (for testing)
        return true // STRICT: execution.dealConfiguration?.isValid === true
      case 7: // Step 7: Configure Details (includes optional uploads) - ALLOW PROCEED
        return true // STRICT: validate form completion
      case 8: // Step 8: Review Policy Structure - allow proceed
        return true
      case 9: // Step 9: Test Workflow - allow proceed
        return true
      case 10: // Step 10: Live Execution - allow proceed to monitor
        return true
      case 11: // Step 11: Monitor & Collaborate - Final step
        return false // No next step after this
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
                    const isSkipped = execution.skippedSteps?.includes(step.index) || false

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
                          flex-shrink-0 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer relative
                          ${
                            isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : isCompleted
                              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }
                          ${isSkipped ? 'opacity-40 line-through' : ''}
                        `}
                        title={isSkipped ? `Skipped for ${execution.workflowMode} mode` : undefined}
                      >
                        {step.index + 1}. {step.title}
                        {isSkipped && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-amber-500 text-white rounded-full text-[10px]">
                            ✓
                          </span>
                        )}
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

      {/* Onboarding System - DISABLED FOR DEMO */}
      {/* <WelcomeModal onStartTour={startTour} onSkip={stopTour} /> */}

      {/* Full Platform Tour (from welcome modal) */}
      <ProductTour
        run={runTour}
        onComplete={stopTour}
        onStateChange={setIsTourRunning}
      />

      {/* Page-Specific Tour (from help button) */}
      <ProductTour
        run={showPageTour}
        steps={pageTourSteps}
        onComplete={() => setShowPageTour(false)}
        onStateChange={(running) => !running && setShowPageTour(false)}
      />

      {/* Floating Help Button - Always Visible */}
      {hasTourForPage(execution.currentStepIndex) && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={startPageTour}
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all"
            size="icon"
            title="Tour This Page"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  )
}
