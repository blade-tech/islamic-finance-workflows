'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Brain,
  Zap,
  TrendingUp,
  Shield,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Eye
} from 'lucide-react'
import { PodCard, BeforeAfterMetrics, PodActivityFeed } from '@/lib/qatar-ijarah/pod-components'
import type {
  PodStatus,
  PodOutput,
  EvidenceIntakePodOutput,
  GatekeepingPodOutput,
  CCMPodOutput,
  PodActivityItem
} from '@/lib/qatar-ijarah/pod-types'

export default function AIControlCenterPage() {
  const router = useRouter()
  const { currentProject, loadDemoData } = useIjarahStore()

  // Pod states
  const [evidencePodStatus, setEvidencePodStatus] = useState<PodStatus>('idle')
  const [evidencePodOutput, setEvidencePodOutput] = useState<EvidenceIntakePodOutput | null>(null)

  const [gatekeepingPodStatus, setGatekeepingPodStatus] = useState<PodStatus>('idle')
  const [gatekeepingPodOutput, setGatekeepingPodOutput] = useState<GatekeepingPodOutput | null>(null)

  const [ccmPodStatus, setCcmPodStatus] = useState<PodStatus>('idle')
  const [ccmPodOutput, setCcmPodOutput] = useState<CCMPodOutput | null>(null)

  // Activity feed
  const [activityFeed, setActivityFeed] = useState<PodActivityItem[]>([])

  // Demo control
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  // Automated demo sequence
  const runDemoSequence = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    // Step 1: Evidence Intake Pod
    setCurrentStep(1)
    setEvidencePodStatus('intake')
    await new Promise(resolve => setTimeout(resolve, 1500))

    setEvidencePodStatus('evaluating')
    await new Promise(resolve => setTimeout(resolve, 2000))

    setEvidencePodStatus('proposing')
    setEvidencePodOutput({
      status: 'proposed',
      recommendation: 'ALLOW',
      reasons: [
        'OCR extracted 12 fields with 98% confidence',
        'Completion certificate verified (hash: 8f3a2b1c...)',
        'Document matches checklist template #3',
        'All required signatures present'
      ],
      evidence_refs: ['/evidence/completion-cert-unit-12.pdf'],
      next_actions: ['Approve to add to evidence bundle', 'Proceed to gatekeeping check'],
      time_saved: '8 minutes 30 seconds',
      confidence: 98,
      evidence_bundle: {
        manifest: [
          {
            filename: 'completion-cert-unit-12.pdf',
            hash: '8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c',
            extracted_fields: {
              projectName: 'Al Khor Towers',
              unitNumber: 'Unit 12',
              completionDate: '2026-01-10',
              contractor: 'Qatar Real Estate Dev. Co.',
              authority: 'Ministry of Municipality'
            },
            checklist_item: 'Completion Certificate',
            ocr_confidence: 98
          }
        ],
        checklist_status: {
          total: 4,
          complete: 1,
          missing: ['Occupancy Certificate', 'Utility Activation', 'Lessor Title']
        }
      }
    })

    addToActivityFeed('evidence-intake', 'completed', 'Evidence intake completed - 1/4 checklist items verified')

    await new Promise(resolve => setTimeout(resolve, 3000))

    // Step 2: CCM Monitoring Pod
    setCurrentStep(2)
    setCcmPodStatus('evaluating')
    await new Promise(resolve => setTimeout(resolve, 2000))

    setCcmPodStatus('proposing')
    setCcmPodOutput({
      status: 'proposed',
      recommendation: 'OPEN_CASE',
      reasons: [
        'Control IJR-A1 (Rent Gating): PASS - No rent active before delivery',
        'Control IJR-B6 (Escrow): PASS - All funds in compliant account',
        'Control IJR-C13 (Sub-Ledger): PASS - Reconciliation current',
        'Control IJR-A3 (Late Payment): FAIL - Payment 7 days overdue'
      ],
      evidence_refs: ['/controls/ijr-a3-finding.json'],
      next_actions: ['Open SNCR case for late payment purification', 'Calculate charity allocation'],
      time_saved: '35 minutes',
      confidence: 100,
      findings: [
        {
          control_id: 'IJR-A1',
          status: 'pass',
          evidence_refs: ['/rent-gate-status.json'],
          test_logic: 'rentBillingActive === false UNTIL gateUnlocked === true',
          actual_value: false,
          expected_value: false,
          severity: 'high'
        },
        {
          control_id: 'IJR-B6',
          status: 'pass',
          evidence_refs: ['/escrow-balance.json'],
          test_logic: 'qcbCompliant === true AND balance >= totalDeposits - disbursements',
          actual_value: true,
          expected_value: true,
          severity: 'high'
        },
        {
          control_id: 'IJR-C13',
          status: 'pass',
          evidence_refs: ['/unit-subledger-recon.json'],
          test_logic: 'lastReconciliationDate within 24 hours',
          actual_value: '2025-11-09T08:00:00Z',
          expected_value: 'within 24h',
          severity: 'medium'
        },
        {
          control_id: 'IJR-A3',
          status: 'fail',
          evidence_refs: ['/payment-invoice-2025-003.json'],
          test_logic: 'IF daysLate > 0 THEN charityPledge.amount = daysLate * dailyRate',
          actual_value: 7,
          expected_value: 0,
          severity: 'critical'
        }
      ]
    })

    addToActivityFeed('ccm-monitoring', 'completed', 'CCM scan completed - 3 PASS, 1 FAIL (late payment detected)')

    await new Promise(resolve => setTimeout(resolve, 3000))

    // Step 3: Gatekeeping Pod
    setCurrentStep(3)
    setGatekeepingPodStatus('intake')
    await new Promise(resolve => setTimeout(resolve, 1500))

    setGatekeepingPodStatus('evaluating')
    await new Promise(resolve => setTimeout(resolve, 2000))

    setGatekeepingPodStatus('proposing')
    setGatekeepingPodOutput({
      status: 'proposed',
      recommendation: 'DENY',
      reasons: [
        'Gate ID: rent-billing-unit-12',
        'Precondition check: 1/4 evidence items complete',
        'Missing: Occupancy Certificate, Utility Activation, Lessor Title',
        'AAOIFI SS-9 4/1/3: Rent cannot commence until possession delivered'
      ],
      evidence_refs: ['/rent-gate-status-unit-12.json'],
      next_actions: [
        'Upload remaining 3 evidence items',
        'Re-run gatekeeping check after evidence complete',
        'Rent billing will remain blocked until gate unlocked'
      ],
      time_saved: '4 minutes',
      confidence: 100,
      gate_decision: {
        allow: false,
        preconditions_met: ['SSB approval verified', 'Istisnā\' contract signed'],
        preconditions_missing: ['Completion certificate uploaded', 'Occupancy permit verified', 'Utility activation confirmed', 'Lessor title registered'],
        required_remediation: [
          'Upload completion certificate',
          'Obtain occupancy permit from Civil Defense',
          'Activate utilities (Kahramaa)',
          'Register lessor title with RERA'
        ]
      }
    })

    addToActivityFeed('gatekeeping', 'failed', 'Rent billing request DENIED - Missing 3/4 evidence items')

    setCurrentStep(4)
    setIsRunning(false)
  }

  const addToActivityFeed = (
    podId: 'evidence-intake' | 'ccm-monitoring' | 'gatekeeping',
    status: 'completed' | 'failed',
    message: string
  ) => {
    const newItem: PodActivityItem = {
      id: `activity-${Date.now()}`,
      podId,
      timestamp: new Date().toISOString(),
      status,
      message
    }
    setActivityFeed(prev => [newItem, ...prev])
  }

  const handleReset = () => {
    setEvidencePodStatus('idle')
    setEvidencePodOutput(null)
    setGatekeepingPodStatus('idle')
    setGatekeepingPodOutput(null)
    setCcmPodStatus('idle')
    setCcmPodOutput(null)
    setActivityFeed([])
    setCurrentStep(0)
    setIsRunning(false)
  }

  const handleApprove = (podType: 'evidence' | 'gatekeeping' | 'ccm') => {
    if (podType === 'evidence') {
      setEvidencePodStatus('completed')
      addToActivityFeed('evidence-intake', 'completed', 'Evidence approved and added to bundle')
    } else if (podType === 'gatekeeping') {
      setGatekeepingPodStatus('completed')
      addToActivityFeed('gatekeeping', 'completed', 'Gate decision approved')
    } else {
      setCcmPodStatus('completed')
      addToActivityFeed('ccm-monitoring', 'completed', 'CCM findings acknowledged and SNCR case opened')
    }
  }

  const handleReject = (podType: 'evidence' | 'gatekeeping' | 'ccm') => {
    if (podType === 'evidence') {
      setEvidencePodStatus('idle')
      setEvidencePodOutput(null)
      addToActivityFeed('evidence-intake', 'failed', 'Evidence rejected - requires re-submission')
    } else if (podType === 'gatekeeping') {
      setGatekeepingPodStatus('idle')
      setGatekeepingPodOutput(null)
      addToActivityFeed('gatekeeping', 'failed', 'Gate decision rejected')
    } else {
      setCcmPodStatus('idle')
      setCcmPodOutput(null)
      addToActivityFeed('ccm-monitoring', 'failed', 'CCM findings disputed')
    }
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI Control Center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/qatar-ijarah')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Brain className="h-7 w-7 mr-2 text-purple-600" />
                  AI Control Center
                </h1>
                <p className="text-sm text-gray-600">3 Agentic Pods Working Together</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={runDemoSequence}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Demo
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">
                Click, Click, Click... Pain Relief
              </h2>
              <p className="text-lg text-purple-700 mb-6 max-w-3xl mx-auto">
                Watch 3 specialized AI pods automatically process evidence, monitor controls, and validate
                gatekeeping decisions. What used to take <strong>50+ minutes</strong> of manual work now happens
                in <strong>under 10 seconds</strong> with human oversight.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">Dramatic</div>
                  <div className="text-xs text-gray-600">Time Saved</div>
                </div>
                <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">Full</div>
                  <div className="text-xs text-gray-600">Human Oversight</div>
                </div>
                <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <CheckCircle2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">Zero</div>
                  <div className="text-xs text-gray-600">Compliance Risk</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Stepper */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Demo Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Evidence Intake', icon: CheckCircle2 },
                { step: 2, label: 'CCM Scan', icon: Eye },
                { step: 3, label: 'Gatekeeping', icon: Shield },
                { step: 4, label: 'Complete', icon: TrendingUp }
              ].map((item, idx) => (
                <div key={item.step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      currentStep >= item.step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className={`text-xs mt-2 ${
                      currentStep >= item.step ? 'text-purple-700 font-semibold' : 'text-gray-500'
                    }`}>
                      {item.label}
                    </p>
                  </div>
                  {idx < 3 && (
                    <div className={`h-1 flex-1 ${
                      currentStep > item.step ? 'bg-purple-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pod #1: Evidence Intake */}
          <PodCard
            podId="evidence-intake"
            status={evidencePodStatus}
            output={evidencePodOutput}
            onApprove={() => handleApprove('evidence')}
            onReject={() => handleReject('evidence')}
          />

          {/* Pod #2: CCM Monitoring */}
          <PodCard
            podId="ccm-monitoring"
            status={ccmPodStatus}
            output={ccmPodOutput}
            onApprove={() => handleApprove('ccm')}
            onReject={() => handleReject('ccm')}
          />

          {/* Pod #3: Gatekeeping */}
          <PodCard
            podId="gatekeeping"
            status={gatekeepingPodStatus}
            output={gatekeepingPodOutput}
            onApprove={() => handleApprove('gatekeeping')}
            onReject={() => handleReject('gatekeeping')}
          />
        </div>

        {/* Before/After Metrics */}
        <div className="mb-8">
          <BeforeAfterMetrics
            before={{
              steps: [
                '👤 Upload document',
                '👤 Manual review (5 min)',
                '👤 Data entry (3 min)',
                '👤 Run 15 control checks (35 min)',
                '👤 Cross-reference rules (7 min)',
                '👤 Approval review (30 sec)'
              ],
              time: '50 minutes 30 seconds',
              errors: '~5% human error rate'
            }}
            after={{
              steps: [
                '👤 Upload document',
                '🤖 Evidence Pod analyzes (3 sec)',
                '🤖 CCM Pod runs controls (2 sec)',
                '🤖 Gatekeeping Pod validates (2 sec)',
                '👤 Review + Approve (3 clicks)'
              ],
              time: '30 seconds',
              errors: '<0.1% error rate'
            }}
            savings={{
              time: '95%',
              accuracy: '+4.9%'
            }}
          />
        </div>

        {/* Activity Feed */}
        {activityFeed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Activity Feed</CardTitle>
              <CardDescription>Real-time pod execution log</CardDescription>
            </CardHeader>
            <CardContent>
              <PodActivityFeed items={activityFeed} maxItems={10} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
