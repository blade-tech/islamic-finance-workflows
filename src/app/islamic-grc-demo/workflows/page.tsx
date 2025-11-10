'use client'

/**
 * PHASE 2: WORKFLOW REVIEW
 * =========================
 * Review and customize generated workflows before deployment
 *
 * Features:
 * - Timeline view of all workflow steps
 * - Policy constraint visualization
 * - Moderate customization (where allowed)
 * - Deploy to Phase 3 (Dashboard)
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield,
  AlertTriangle,
  Rocket,
} from 'lucide-react'
import { WorkflowTimeline } from '../components/WorkflowTimeline'
import {
  useGRCDemoStore,
  useCurrentConfig,
  useCurrentWorkflows,
} from '@/lib/stores/grc-demo-store'

export default function WorkflowReviewPage() {
  const router = useRouter()
  const config = useCurrentConfig()
  const workflows = useCurrentWorkflows()
  const { deployWorkflows, goToPhase } = useGRCDemoStore()

  const [isDeploying, setIsDeploying] = useState(false)

  // Redirect if no configuration
  useEffect(() => {
    if (!config) {
      router.push('/islamic-grc-demo')
    }
  }, [config, router])

  // Mock workflow generation (temporary until assembler is connected)
  useEffect(() => {
    if (config && workflows.length === 0) {
      // Generate mock workflow based on product type
      generateMockWorkflow()
    }
  }, [config, workflows])

  const generateMockWorkflow = () => {
    // This will be replaced with actual assembler call
    // For now, create a simple mock workflow
    const mockSteps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Shariah Supervisory Board Approval',
        description:
          'Obtain SSB approval for product structure and documentation',
        assignedRole: 'Shariah Compliance Officer',
        durationDays: 14,
        startAfter: [],
        requiredEvidence: [
          {
            type: 'SSB Resolution',
            description: 'Formal SSB approval resolution',
            isRequired: true,
          },
        ],
        policyConstraints: [
          {
            source: 'AAOIFI GS-1',
            constraint: 'All products require SSB approval before launch',
            cannotModify: true,
          },
        ],
        requiresApproval: true,
        approvalRole: 'Shariah Supervisory Board',
        isHardGate: true,
        isOptional: false,
        allowDurationChange: false,
        allowRoleChange: false,
      },
    ]

    // Store mock workflow (this will be replaced with real assembler)
    console.log('Mock workflow generated for:', config?.productType)
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      await deployWorkflows()
      router.push('/islamic-grc-demo/dashboard/my-tasks')
    } catch (error) {
      console.error('Deployment failed:', error)
    } finally {
      setIsDeploying(false)
    }
  }

  const handleBack = () => {
    router.push('/islamic-grc-demo')
  }

  if (!config) return null

  // Calculate workflow statistics
  const totalSteps = workflows.reduce((sum, w) => sum + w.steps.length, 0)
  const hardGateSteps = workflows.reduce(
    (sum, w) => sum + w.steps.filter((s) => s.isHardGate).length,
    0
  )
  const totalDuration = workflows.reduce(
    (sum, w) => sum + w.totalDurationDays,
    0
  )
  const policyConstraints = workflows.reduce(
    (sum, w) =>
      sum +
      w.steps.reduce((s, step) => s + step.policyConstraints.length, 0),
    0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Workflow Review
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {config.productType.toUpperCase()} •{' '}
                  {config.jurisdiction.toUpperCase()} •{' '}
                  {config.accountingStandard.toUpperCase()}
                </p>
              </div>
            </div>
            <Badge className="bg-purple-600">Phase 2: Review</Badge>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
              ✓
            </div>
            <span className="text-sm font-medium text-gray-600">
              Configuration
            </span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-purple-900">
              Workflow Review
            </span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-sm font-medium text-gray-600">Dashboard</span>
          </div>
        </div>

        {/* Workflow Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Workflow Generated Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">
                  {totalSteps || '12'}
                </div>
                <div className="text-xs text-blue-700 mt-1">Total Steps</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-900">
                  {hardGateSteps || '3'}
                </div>
                <div className="text-xs text-red-700 mt-1">Hard Gates</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">
                  {policyConstraints || '18'}
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  Policy Constraints
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-900">
                  {totalDuration || '35'} days
                </div>
                <div className="text-xs text-orange-700 mt-1">
                  Total Duration
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Standards Compliance
                  </h4>
                  <p className="text-xs text-blue-800">
                    This workflow is compliant with: AAOIFI GS-1/3/5/9 • AAOIFI
                    SS-9/FAS-28/FAS-3 • IFSB-1/10 • QCB Regulations • QFCRA
                    IBANK
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Workflow Steps</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Click steps to expand details</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {workflows.length > 0 && workflows[0].steps.length > 0 ? (
              <WorkflowTimeline
                steps={workflows[0].steps}
                onEditStep={(stepId) => {
                  console.log('Edit step:', stepId)
                  // TODO: Implement edit modal
                }}
              />
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Workflow generation in progress...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This will be connected to the workflow assembler shortly
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={handleBack} size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Configuration
          </Button>

          <Button
            onClick={handleDeploy}
            disabled={isDeploying || workflows.length === 0}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isDeploying ? (
              <>
                <Clock className="mr-2 h-5 w-5 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-5 w-5" />
                Deploy Workflows
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
