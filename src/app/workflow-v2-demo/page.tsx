'use client'

/**
 * WORKFLOW V2 DEMO PAGE
 * =====================
 * Demo of the new GRC-aligned configuration wizard
 * Navigate to: http://localhost:3030/workflow-v2-demo
 */

import { useState } from 'react'
import { ConfigurationWizard } from '@/components/workflow-v2/ConfigurationWizard'
import { DocumentUploadMock } from '@/components/workflow-v2/DocumentUploadMock'
import { generateActivationSummary } from '@/lib/control-engine/activation-rules'
import { DealConfiguration, ActivationSummary } from '@/lib/control-engine/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function WorkflowV2DemoPage() {
  const [showWizard, setShowWizard] = useState(true)
  const [activationSummary, setActivationSummary] = useState<ActivationSummary | null>(null)

  const handleConfigComplete = (config: DealConfiguration) => {
    // Generate activation summary
    const summary = generateActivationSummary(config)
    setActivationSummary(summary)
    setShowWizard(false)
  }

  const handleReset = () => {
    setShowWizard(true)
    setActivationSummary(null)
  }

  if (showWizard) {
    return <ConfigurationWizard onComplete={handleConfigComplete} />
  }

  if (!activationSummary) return null

  // Show activation results
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={handleReset}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Start Over
        </Button>

        <Card className="p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Control Activation Summary
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Based on your configuration, <strong>{activationSummary.activatedControls} of {activationSummary.totalControls}</strong> controls will be executed
          </p>

          {/* Bucket Breakdown */}
          <div className="space-y-6">
            {Object.entries(activationSummary.controlsByBucket).map(([bucket, data]) => {
              const bucketNum = parseInt(bucket)
              const bucketNames = {
                1: { name: 'Shariah Governance & Compliance', icon: '🕌', color: 'purple' },
                2: { name: 'Regulatory & Legal Compliance', icon: '⚖️', color: 'orange' },
                3: { name: 'Risk Management', icon: '📊', color: 'blue' },
                4: { name: 'Financial & Product Reporting', icon: '📈', color: 'green' },
                5: { name: 'Audit & Assurance', icon: '🔍', color: 'gray' }
              }
              const bucketInfo = bucketNames[bucketNum as keyof typeof bucketNames]

              return (
                <div key={bucket} className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">{bucketInfo.icon}</span>
                    BUCKET {bucket}: {bucketInfo.name}
                    <span className="ml-auto text-sm font-normal text-gray-600">
                      {data.activated}/{data.total} activated
                    </span>
                  </h2>

                  <div className="space-y-3">
                    {data.controls.map((ac) => (
                      <Card
                        key={ac.controlId}
                        className={`p-4 ${
                          ac.activated
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="mr-3">
                            {ac.activated ? (
                              <span className="text-green-600 text-xl">✓</span>
                            ) : (
                              <span className="text-gray-400 text-xl">✗</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {ac.controlId}: {ac.activationReason.split(' - ')[0]}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Why:</strong> {ac.activationReason}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              <strong>Standard:</strong> {ac.standardReference}
                            </p>
                            {ac.lifecyclePhases.length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                <strong>Lifecycle Phases:</strong>{' '}
                                {ac.lifecyclePhases.map(phase => {
                                  const phaseNames = {
                                    A: 'Pre-Issuance',
                                    B: 'Issuance',
                                    C: 'Post-Issuance',
                                    D: 'Audit'
                                  }
                                  return phaseNames[phase as keyof typeof phaseNames]
                                }).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Configuration Summary */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Your Configuration:</h3>
            <pre className="text-sm text-blue-800 overflow-auto">
              {JSON.stringify(activationSummary.configuration, null, 2)}
            </pre>
          </div>
        </Card>

        {/* Document Upload Section */}
        <Card className="p-8 mb-6">
          <DocumentUploadMock />
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button onClick={handleReset} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Configure New Deal
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Proceed to Execution →
          </Button>
        </div>
      </div>
    </div>
  )
}
