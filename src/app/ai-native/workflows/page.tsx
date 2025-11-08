/**
 * SCREEN 5: WORKFLOWS (EXECUTION LOG)
 * Deterministic workflow steps with agent auto-complete and streaming execution
 * Shows the "Workflow Plane" from first principles
 */

'use client'

import { CheckCircle2, Clock, Play, User, Bot, AlertCircle } from 'lucide-react'
import { getDealById } from '@/lib/mock-data/deals'
import { getControlById } from '@/lib/control-library'

export default function WorkflowsPage() {
  // Demo: Show deal-001 workflow execution
  const deal = getDealById('deal-001')
  if (!deal) return null

  const workflowSteps = deal.controls.slice(0, 10).map((control, idx) => {
    const controlDef = getControlById(control.controlId)
    return {
      id: `step-${idx + 1}`,
      name: controlDef?.name || control.controlId,
      owner: controlDef?.owner || 'Unknown',
      status: control.status,
      isAutomated: controlDef?.automatable || false,
      lastExecuted: control.lastExecuted,
      nextExecution: control.nextExecution,
      sla: '48h'
    }
  })

  const getStepIcon = (status: string, isAutomated: boolean) => {
    if (status === 'passed') return <CheckCircle2 className="h-5 w-5 text-green-600" />
    if (status === 'in_progress') return <Clock className="h-5 w-5 text-blue-600" />
    if (status === 'failed') return <AlertCircle className="h-5 w-5 text-red-600" />
    return isAutomated
      ? <Bot className="h-5 w-5 text-purple-600" />
      : <User className="h-5 w-5 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workflow Execution Log</h1>
        <p className="text-gray-600">
          Deterministic, long-lived workflows with human-in-the-loop approvals
        </p>
      </div>

      {/* Workflow Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {deal.dealName}
            </h2>
            <p className="text-sm text-gray-500">
              {deal.dealId} • {deal.productType} • {deal.phase}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Workflow Progress</div>
            <div className="text-2xl font-bold text-gray-900">{deal.compliance.overall}%</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">
              {deal.controls.filter(c => c.status === 'passed').length} completed
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600">
              {deal.controls.filter(c => c.status === 'in_progress').length} in progress
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 text-purple-600" />
            <span className="text-gray-600">
              {workflowSteps.filter(s => s.isAutomated).length} automated
            </span>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Workflow Steps (Deterministic Execution)
        </h3>

        <div className="space-y-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.id}
              className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0"
            >
              {/* Step Number & Icon */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-semibold">
                  {idx + 1}
                </div>
              </div>

              {/* Step Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{step.name}</h4>
                      {step.isAutomated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          <Bot className="h-3 w-3 mr-1" />
                          Automated
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        step.status === 'passed' ? 'bg-green-100 text-green-800' :
                        step.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        step.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status || 'not started'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Owner: {step.owner}</span>
                      {step.sla && <span>SLA: {step.sla}</span>}
                      {step.lastExecuted && (
                        <span>Last: {new Date(step.lastExecuted).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    {getStepIcon(step.status, step.isAutomated)}
                  </div>
                </div>

                {/* Agent Action (if automated) */}
                {step.isAutomated && step.status === 'not_started' && (
                  <button
                    className="mt-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex items-center space-x-1"
                    onClick={() => alert('Agent executing step...')}
                  >
                    <Play className="h-3 w-3" />
                    <span>Run Agent</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Activity Log */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Agent Activity Log
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-3">
            <Bot className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">Evidence Agent</span>
                <span className="text-xs text-gray-500">Nov 7, 09:15</span>
              </div>
              <p className="text-gray-700">
                Collected 3 new documents from SharePoint for Shariah review
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-blue-50 rounded-lg p-3">
            <Bot className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">Drift Agent</span>
                <span className="text-xs text-gray-500">Nov 7, 08:00</span>
              </div>
              <p className="text-gray-700">
                Detected policy change in AAOIFI FAS 33 - running impact analysis...
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-3">
            <Bot className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">Compliance Copilot</span>
                <span className="text-xs text-gray-500">Nov 6, 16:30</span>
              </div>
              <p className="text-gray-700">
                Completed AAOIFI validation for Step 3 • VC minted to Hedera
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
