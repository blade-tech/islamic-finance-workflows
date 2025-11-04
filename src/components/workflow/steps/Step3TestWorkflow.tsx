'use client'

/**
 * STEP 3: TEST WORKFLOW
 * =====================
 * Allows users to run a dry run test of their workflow in a sandbox environment.
 *
 * USER-FACING TERMINOLOGY:
 * - "Test Run" or "Simulation" (not "dry run")
 * - "Sandbox" (clear that nothing is recorded on blockchain)
 * - "Workflow Steps" (not "policy steps")
 *
 * FEATURES:
 * - Test run button with simulation explanation
 * - Real-time step execution visualization
 * - AAOIFI/IIFM compliance validation display
 * - AI issue detection and fix suggestions
 * - Test log viewer
 * - Stop/restart test functionality
 *
 * NOTE: Phase 4A uses mocked execution. Phase 4B will integrate real Guardian MCP.
 */

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  Info,
  Sparkles,
  FileText
} from 'lucide-react'

// Mock workflow steps for Sukuk issuance (12 steps based on GUARDIAN_REDESIGN_PLAN.md)
const MOCK_WORKFLOW_STEPS = [
  { id: 1, name: 'Issuer submits application', duration: 2000 },
  { id: 2, name: 'Shariah board review', duration: 5000 },
  { id: 3, name: 'Asset valuation', duration: 3000 },
  { id: 4, name: 'Auditor verification', duration: 4000 },
  { id: 5, name: 'Sukuk structure approval', duration: 3000 },
  { id: 6, name: 'Legal documentation review', duration: 4000 },
  { id: 7, name: 'Compliance check', duration: 2000 },
  { id: 8, name: 'Pricing determination', duration: 2000 },
  { id: 9, name: 'Investor allocation', duration: 3000 },
  { id: 10, name: 'Settlement preparation', duration: 2000 },
  { id: 11, name: 'Final Shariah certification', duration: 3000 },
  { id: 12, name: 'Sukuk issuance complete', duration: 1000 },
]

// Mock validation checks
const MOCK_VALIDATION_CHECKS = [
  {
    id: 'aaoifi_fas33',
    name: 'AAOIFI FAS 33 compliance',
    status: 'passed' as const,
    message: 'All requirements met',
  },
  {
    id: 'required_roles',
    name: 'All required roles assigned',
    status: 'passed' as const,
    message: 'Shariah Board, Auditor, and Issuer assigned',
  },
  {
    id: 'asset_verification',
    name: 'Asset value verification',
    status: 'warning' as const,
    message: 'Asset valuation report needs Shariah advisor signature',
    aiSuggestion: 'Add Shariah signature to asset valuation document before launch',
  },
]

type StepStatus = 'pending' | 'in_progress' | 'completed'
type TestStatus = 'idle' | 'running' | 'completed' | 'stopped'

interface WorkflowStepState {
  id: number
  status: StepStatus
  elapsedTime: number
}

export function Step3TestWorkflow() {
  const [testStatus, setTestStatus] = useState<TestStatus>('idle')
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [steps, setSteps] = useState<WorkflowStepState[]>(
    MOCK_WORKFLOW_STEPS.map(step => ({
      id: step.id,
      status: 'pending' as StepStatus,
      elapsedTime: 0
    }))
  )
  const [showLog, setShowLog] = useState(false)

  // Calculate overall progress
  const completedSteps = steps.filter(s => s.status === 'completed').length
  const progressPercentage = (completedSteps / MOCK_WORKFLOW_STEPS.length) * 100

  // Simulate test execution
  useEffect(() => {
    if (testStatus !== 'running') return

    const currentStep = MOCK_WORKFLOW_STEPS[currentStepIndex]
    if (!currentStep) {
      // All steps completed
      setTestStatus('completed')
      return
    }

    // Mark current step as in_progress
    setSteps(prev =>
      prev.map((s, idx) =>
        idx === currentStepIndex
          ? { ...s, status: 'in_progress' as StepStatus }
          : s
      )
    )

    // Simulate step execution with mock duration
    const timer = setTimeout(() => {
      // Mark step as completed
      setSteps(prev =>
        prev.map((s, idx) =>
          idx === currentStepIndex
            ? { ...s, status: 'completed' as StepStatus, elapsedTime: currentStep.duration }
            : s
        )
      )

      // Move to next step
      setCurrentStepIndex(prev => prev + 1)
    }, currentStep.duration)

    return () => clearTimeout(timer)
  }, [testStatus, currentStepIndex])

  const startTest = () => {
    setTestStatus('running')
    setCurrentStepIndex(0)
    setSteps(MOCK_WORKFLOW_STEPS.map(step => ({
      id: step.id,
      status: 'pending' as StepStatus,
      elapsedTime: 0
    })))
  }

  const stopTest = () => {
    setTestStatus('stopped')
  }

  const resetTest = () => {
    setTestStatus('idle')
    setCurrentStepIndex(-1)
    setSteps(MOCK_WORKFLOW_STEPS.map(step => ({
      id: step.id,
      status: 'pending' as StepStatus,
      elapsedTime: 0
    })))
    setShowLog(false)
  }

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
      case 'pending':
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getValidationIcon = (status: 'passed' | 'warning' | 'failed') => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Test Workflow</h2>
        <p className="text-muted-foreground mt-1">
          Run a simulation to verify your workflow before launching on Hedera Blockchain
        </p>
      </div>

      {/* Simulation Environment Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Sandbox Environment</AlertTitle>
        <AlertDescription>
          This test runs in a sandbox - nothing is recorded on the Hedera Blockchain yet.
          Use this to catch issues before launch.
        </AlertDescription>
      </Alert>

      {/* Test Control Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Start, stop, or restart your workflow simulation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            {testStatus === 'idle' || testStatus === 'stopped' ? (
              <Button onClick={startTest} className="gap-2">
                <Play className="h-4 w-4" />
                {testStatus === 'stopped' ? 'Resume Test Run' : 'Start Test Run'}
              </Button>
            ) : null}

            {testStatus === 'running' ? (
              <Button variant="outline" onClick={stopTest} className="gap-2">
                <Square className="h-4 w-4" />
                Stop Test
              </Button>
            ) : null}

            {(testStatus === 'completed' || testStatus === 'stopped') && (
              <Button variant="outline" onClick={resetTest} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Run Again
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => setShowLog(!showLog)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              {showLog ? 'Hide' : 'View'} Detailed Log
            </Button>
          </div>

          {/* Progress Bar */}
          {testStatus !== 'idle' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="text-muted-foreground">
                  {completedSteps}/{MOCK_WORKFLOW_STEPS.length} steps ({Math.round(progressPercentage)}%)
                </span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Progress */}
      {testStatus !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle>Test Progress</CardTitle>
            <CardDescription>
              Real-time execution of workflow steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_WORKFLOW_STEPS.map((step, idx) => {
                const stepState = steps[idx]
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      stepState.status === 'in_progress'
                        ? 'bg-blue-50 dark:bg-blue-950'
                        : stepState.status === 'completed'
                        ? 'bg-muted/50'
                        : ''
                    }`}
                  >
                    {getStepIcon(stepState.status)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Step {step.id}: {step.name}
                      </div>
                    </div>
                    {stepState.status === 'completed' && (
                      <div className="text-xs text-muted-foreground">
                        ({(stepState.elapsedTime / 1000).toFixed(1)}s)
                      </div>
                    )}
                    {stepState.status === 'in_progress' && (
                      <div className="text-xs text-blue-600 font-medium">
                        Running...
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Live Validation</CardTitle>
          <CardDescription>
            AAOIFI/IIFM compliance checks and AI-detected issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_VALIDATION_CHECKS.map((check) => (
              <div key={check.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  {getValidationIcon(check.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{check.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {check.message}
                    </div>
                    {check.aiSuggestion && (
                      <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-100">
                          <span className="font-medium">AI Suggestion:</span> {check.aiSuggestion}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Log (Collapsible) */}
      {showLog && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Test Log</CardTitle>
            <CardDescription>
              Complete execution trace with timestamps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-xs space-y-1 max-h-80 overflow-y-auto">
              <div className="text-muted-foreground">[00:00:00] Test run initialized</div>
              <div className="text-muted-foreground">[00:00:00] Loading workflow configuration...</div>
              <div className="text-muted-foreground">[00:00:01] Configuration loaded successfully</div>
              {steps.map((step, idx) => {
                if (step.status === 'pending') return null
                const mockStep = MOCK_WORKFLOW_STEPS[idx]
                const timestamp = steps
                  .slice(0, idx + 1)
                  .reduce((sum, s) => sum + s.elapsedTime, 0) / 1000

                return (
                  <div key={step.id}>
                    {step.status === 'in_progress' && (
                      <div className="text-blue-600">
                        [{timestamp.toFixed(2)}s] Executing: {mockStep.name}...
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="text-green-600">
                        [{timestamp.toFixed(2)}s] ✓ Completed: {mockStep.name}
                      </div>
                    )}
                  </div>
                )
              })}
              {testStatus === 'completed' && (
                <>
                  <div className="text-green-600 font-bold">
                    [{(steps.reduce((sum, s) => sum + s.elapsedTime, 0) / 1000).toFixed(2)}s]
                    ✓ Test run completed successfully
                  </div>
                  <div className="text-muted-foreground">
                    [{(steps.reduce((sum, s) => sum + s.elapsedTime, 0) / 1000 + 0.5).toFixed(2)}s]
                    Ready for launch
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Complete Message */}
      {testStatus === 'completed' && (
        <Alert variant="success" className="border-green-600">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Test Run Completed Successfully</AlertTitle>
          <AlertDescription>
            Your workflow passed all validation checks. You can now proceed to validate compliance
            and launch on Hedera Blockchain.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
