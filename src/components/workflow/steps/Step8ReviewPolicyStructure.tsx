'use client'

/**
 * STEP 8: REVIEW POLICY STRUCTURE WITH BPMN VISUALIZATION
 * =========================================================
 * ServiceNow Flow Designer-inspired 3-column layout showing:
 * - Policy metadata summary (top)
 * - Workflow Navigator (left 200px)
 * - BPMN Canvas (center, flexible)
 * - Step Details Panel (right 300px, slides in on click)
 *
 * BASED ON:
 * - ServiceNow Flow Designer patterns
 * - STEP8_BPMN_VISUALIZATION.md design
 * - bpmn-js viewer integration
 * - Mock BPMN generation from 4-component configuration
 *
 * NOTE: Phase 4A uses mock BPMN. Phase 4B will use real Guardian BPMN.
 */

import { useState, useEffect } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { generateMockBPMN, generateESGSubWorkflow, generateAuditSubWorkflow } from '@/lib/bpmn-generator'
import { BpmnViewer } from '@/components/bpmn/BpmnViewer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileCheck,
  Clock,
  Users,
  Info,
  CheckCircle,
  Loader2,
  RefreshCw,
  Building2,
  BarChart3,
  Shield,
  GitBranch,
  ChevronRight,
  X
} from 'lucide-react'

// Policy Structure from backend (internal interface - Guardian terminology okay here)
interface GuardianPolicyStructure {
  policyId: string
  policyName: string
  description: string
  schemaCount: number
  policySteps: number
  requiredRoles: string[]
  generatedFrom: {
    shariahStructure: string
    jurisdiction: string
    accounting: string
    impact: string[]
  }
  estimatedExecutionTime: string
  blockchainCost: string
}

interface WorkflowDefinition {
  id: string
  name: string
  description: string
  type: 'main' | 'sub'
  bpmnXml: string
}

export function Step8ReviewPolicyStructure() {
  const execution = useWorkflowStore((state) => state.execution)
  const [policyStructure, setPolicyStructure] = useState<GuardianPolicyStructure | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // BPMN Visualization State
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('main')
  const [selectedStep, setSelectedStep] = useState<any>(null)
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false)

  // Generate policy structure and BPMN when component mounts
  useEffect(() => {
    generatePolicyStructure()
  }, [])

  const generatePolicyStructure = async () => {
    if (!execution) return

    try {
      setLoading(true)
      setError(null)

      // Mock policy structure generation
      // In Phase 4B, this will call: POST /api/guardian/generate-policy (backend Guardian MCP call)
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      // Mock policy structure based on 4-component configuration
      const mockPolicy: GuardianPolicyStructure = {
        policyId: `policy-${Date.now()}`,
        policyName: `${execution.selectedShariahStructure?.name || 'Islamic Finance'} Policy`,
        description: `Policy for ${execution.selectedShariahStructure?.name || 'Islamic Finance'} workflow in ${execution.selectedJurisdiction?.name || 'selected jurisdiction'}`,
        schemaCount: calculateSchemaCount(),
        policySteps: calculatePolicySteps(),
        requiredRoles: calculateRequiredRoles(),
        generatedFrom: {
          shariahStructure: execution.selectedShariahStructure?.name || 'Unknown',
          jurisdiction: execution.selectedJurisdiction?.name || 'Unknown',
          accounting: execution.selectedAccounting?.name || 'Unknown',
          impact: execution.selectedImpacts?.map((i) => i.name) || []
        },
        estimatedExecutionTime: '~15-20 minutes'
      }

      setPolicyStructure(mockPolicy)

      // Generate BPMN XML for all workflows
      const workflowList: WorkflowDefinition[] = []

      // Main workflow (always present)
      const mainBpmn = generateMockBPMN(execution)
      workflowList.push({
        id: 'main',
        name: 'Main Workflow',
        description: `${mockPolicy.policyName} execution flow`,
        type: 'main',
        bpmnXml: mainBpmn
      })

      // ESG Verification sub-workflow (if impact metrics selected)
      if (execution.selectedImpacts && execution.selectedImpacts.length > 0) {
        const esgBpmn = generateESGSubWorkflow(execution)
        workflowList.push({
          id: 'esg_verification',
          name: 'ESG Verification',
          description: 'Impact metrics verification sub-workflow',
          type: 'sub',
          bpmnXml: esgBpmn
        })
      }

      // Audit Process sub-workflow (if accounting framework selected)
      if (execution.selectedAccounting) {
        const auditBpmn = generateAuditSubWorkflow(execution)
        workflowList.push({
          id: 'audit_process',
          name: 'Audit Process',
          description: `${execution.selectedAccounting.name} audit sub-workflow`,
          type: 'sub',
          bpmnXml: auditBpmn
        })
      }

      setWorkflows(workflowList)
      setLoading(false)
    } catch (err) {
      console.error('Failed to generate policy structure:', err)
      setError('Failed to generate policy structure. Please try again.')
      setLoading(false)
    }
  }

  const calculateSchemaCount = (): number => {
    if (!execution) return 0
    let count = 0
    if (execution.selectedShariahStructure) count += 4
    if (execution.selectedJurisdiction) count += 3
    if (execution.selectedAccounting) count += 3
    if (execution.selectedImpacts) count += execution.selectedImpacts.length * 2
    return count
  }

  const calculatePolicySteps = (): number => {
    if (!execution) return 0
    let steps = 8 // Base workflow steps
    if (execution.isSecuritized) steps += 2
    if (execution.selectedTakaful?.enabled) steps += 2
    if (execution.selectedImpacts && execution.selectedImpacts.length > 0) {
      steps += execution.selectedImpacts.length
    }
    return steps
  }

  const calculateRequiredRoles = (): string[] => {
    if (!execution) return []
    const roles = new Set<string>(['Issuer', 'Shariah Advisor'])
    if (execution.selectedAccounting?.id === 'aaoifi') {
      roles.add('AAOIFI Auditor')
    } else {
      roles.add('External Auditor')
    }
    if (execution.selectedImpacts && execution.selectedImpacts.length > 0) {
      roles.add('ESG Verifier')
    }
    if (execution.selectedJurisdiction?.id === 'saudi_cma') {
      roles.add('CMA Compliance Officer')
    }
    if (execution.selectedTakaful?.enabled) {
      roles.add('Takaful Provider')
    }
    return Array.from(roles)
  }

  // Handle BPMN element click
  const handleElementClick = (elementId: string, element: any) => {
    console.log('BPMN element clicked:', elementId, element)
    setSelectedStep({
      id: elementId,
      name: element.businessObject?.name || elementId,
      type: element.type,
      role: element.businessObject?.['camunda:assignee'] || 'System'
    })
    setDetailsPanelOpen(true)
  }

  if (!execution) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Execution not initialized</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Review Workflow Structure</h2>
        <p className="text-muted-foreground mt-1">
          Review the workflow visualization generated from your 4-component configuration
        </p>
      </div>

      {/* Info Alert */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Workflow Visualization</AlertTitle>
        <AlertDescription>
          This shows the BPMN workflow that will execute on Hedera Blockchain.
          Click on workflow steps to view details, roles, and data requirements.
        </AlertDescription>
      </Alert>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generating workflow structure...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Policy Structure Display */}
      {!loading && policyStructure && workflows.length > 0 && (
        <>
          {/* Policy Metadata Summary (collapsed cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Policy Overview Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Policy Overview</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generatePolicyStructure}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Policy Name</p>
                  <p className="font-medium">{policyStructure.policyName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Time</p>
                  <p>{policyStructure.estimatedExecutionTime}</p>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Components Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Workflow Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                  <span>{policyStructure.schemaCount} Data Schemas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{policyStructure.policySteps} Workflow Steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{policyStructure.requiredRoles.length} Required Roles</span>
                </div>
              </CardContent>
            </Card>

            {/* Configuration Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{policyStructure.generatedFrom.shariahStructure}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{policyStructure.generatedFrom.jurisdiction}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{policyStructure.generatedFrom.accounting}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3-Column BPMN Visualization Layout */}
          <Card className="overflow-hidden">
            <div className="flex" style={{ height: '700px' }}>
              {/* LEFT: Workflow Navigator (200px fixed) */}
              <div className="w-[200px] border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Workflows
                  </h3>

                  {workflows.map((workflow) => (
                    <button
                      key={workflow.id}
                      onClick={() => setSelectedWorkflow(workflow.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                        ${
                          selectedWorkflow === workflow.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }
                      `}
                    >
                      <div className="font-medium">{workflow.name}</div>
                      <div className="text-xs opacity-80 mt-0.5">
                        {workflow.description}
                      </div>
                      {workflow.type === 'sub' && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Sub-workflow
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>

                {/* Required Roles Section */}
                <div className="p-4 border-t">
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Required Roles
                  </h4>
                  <div className="space-y-1">
                    {policyStructure.requiredRoles.map((role, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs block mb-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* CENTER: BPMN Canvas (flexible width) */}
              <div className="flex-1 relative bg-white min-h-[600px]">
                <BpmnViewer
                  xml={workflows.find(w => w.id === selectedWorkflow)?.bpmnXml || ''}
                  onElementClick={handleElementClick}
                  height="600px"
                />
              </div>

              {/* RIGHT: Step Details Panel (300px, slides in) */}
              {detailsPanelOpen && selectedStep && (
                <div className="w-[300px] border-l bg-card flex-shrink-0 overflow-y-auto animate-in slide-in-from-right duration-200">
                  <div className="p-4 space-y-4">
                    {/* Close button */}
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-semibold">Step Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailsPanelOpen(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Step Information */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Step Name</p>
                        <p className="text-sm font-medium mt-1">{selectedStep.name}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Step ID</p>
                        <p className="text-xs font-mono mt-1">{selectedStep.id}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {selectedStep.type}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Assigned Role</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {selectedStep.role}
                        </Badge>
                      </div>

                      {/* Placeholder for additional details */}
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Description</p>
                        <p className="text-xs">
                          {selectedStep.type === 'bpmn:UserTask'
                            ? 'Manual task requiring human action and approval.'
                            : selectedStep.type === 'bpmn:ServiceTask'
                            ? 'Automated task executed by the system.'
                            : selectedStep.type === 'bpmn:ExclusiveGateway'
                            ? 'Decision point that routes the workflow based on conditions.'
                            : selectedStep.type === 'bpmn:ParallelGateway'
                            ? 'Gateway that splits or joins parallel workflow paths.'
                            : 'Workflow step in the process.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Phase 4B</p>
                        <p className="text-xs">
                          Real Guardian integration will show:
                        </p>
                        <ul className="text-xs space-y-1 mt-2 list-disc list-inside">
                          <li>Input data schemas</li>
                          <li>Output data schemas</li>
                          <li>Compliance checkpoints</li>
                          <li>Estimated duration</li>
                          <li>Cost estimation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Next Step Indication */}
          <Alert variant="default" className="border-blue-600 bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              Ready for Test Run
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              Your workflow structure is ready. Click "Next Step" to run a test simulation
              in sandbox before deploying to Hedera Blockchain.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  )
}
