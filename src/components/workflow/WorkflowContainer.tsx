'use client'

/**
 * WORKFLOW CONTAINER
 * ==================
 * Main workflow orchestrator displaying the 7-step process.
 *
 * 7 WORKFLOW STEPS (Human-Oversees-AI Pattern):
 * 1. Source Connection  - Connect to Graphiti, upload AAOIFI docs, search knowledge graph
 * 2. Workflow Selection - Select from 5 templates with live preview
 * 3. Context Upload     - Optionally add context documents and text (can skip)
 * 4. Live Execution     - Review template, add optional guidance, execute & oversee Claude
 * 5. Citation Verification - Approve/reject sources used
 * 6. Outcome & Download - View final document, download as PDF/DOCX
 * 7. Learning Capture   - View diff, extract learnings
 *
 * UX PATTERN:
 * - Human-in-the-loop (AI works → human guides)
 * - NOT batch workflow (configure everything → execute)
 * - Real-time oversight and interruption capability
 */

import { useEffect } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Step components
import { Step1SourceConnection } from './steps/Step1SourceConnection'
import { Step2WorkflowSelection } from './steps/Step2WorkflowSelection'
import { Step3ContextUpload } from './steps/Step3ContextUpload'
import { Step5LiveExecution } from './steps/Step5LiveExecution'
import { Step6CitationVerification } from './steps/Step6CitationVerification'
import { Step7Outcome } from './steps/Step7Outcome'
import { Step8Learning } from './steps/Step8Learning'

const STEPS = [
  { index: 0, title: 'Source Connection', component: Step1SourceConnection },
  { index: 1, title: 'Workflow Selection', component: Step2WorkflowSelection },
  { index: 2, title: 'Context Upload', component: Step3ContextUpload },
  { index: 3, title: 'Live Execution', component: Step5LiveExecution },
  { index: 4, title: 'Citation Verification', component: Step6CitationVerification },
  { index: 5, title: 'Outcome & Download', component: Step7Outcome },
  { index: 6, title: 'Learning Capture', component: Step8Learning },
]

export function WorkflowContainer() {
  const execution = useWorkflowStore((state) => state.execution)
  const initializeExecution = useWorkflowStore((state) => state.initializeExecution)
  const nextStep = useWorkflowStore((state) => state.nextStep)
  const previousStep = useWorkflowStore((state) => state.previousStep)

  // Initialize execution on mount
  useEffect(() => {
    if (!execution) {
      initializeExecution('user_123') // TODO: Get real user ID
    }
  }, [execution, initializeExecution])

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

    // Step-specific validation (RELAXED FOR TESTING)
    switch (execution.currentStepIndex) {
      case 0: // Step 1: Source Connection - ALLOW PROCEED (for testing)
        return true // was: execution.graphitiConnected
      case 1: // Step 2: Workflow Selection - ALLOW PROCEED (for testing)
        return true // was: execution.selectedTemplate !== null
      case 2: // Step 3: Context Upload - optional, always allow proceed
        return true
      case 3: // Step 4: Live Execution - ALLOW PROCEED (for testing)
        return true // was: execution.status === 'completed'
      case 4: // Step 5: Citation Verification - allow proceed (citations optional)
        return true
      case 5: // Step 6: Outcome & Download - allow proceed
        return true
      case 6: // Step 7: Learning Capture - allow proceed
        return true
      default:
        return true
    }
  })()

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold">Islamic Finance Workflows</h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered AAOIFI-compliant document generation
              </p>
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

            {/* Step indicators */}
            <div className="flex gap-2 overflow-x-auto pb-2">
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
    </div>
  )
}
