'use client'

/**
 * SSB REQUIREMENT PROTOTYPE DEMO
 * ==============================
 * Demonstrates complete traceability from obligation → control → module → tasks
 *
 * This prototype shows how UNIFIED-OBL-001 (SSB requirement) flows through
 * the entire system with full research transparency and progressive disclosure.
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  GitBranch,
  Workflow,
  ListTodo,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { EnhancedTaskCard } from '@/components/EnhancedTaskCard'
import {
  getSSBTraceability,
  getResearchLinksForSSBTask,
  type Obligation,
  type Control,
} from '@/lib/prototype-ssb-traceability'
import type { Task } from '@/lib/types/grc-demo-types'

export default function SSBPrototypePage() {
  const traceability = getSSBTraceability()
  const [activeView, setActiveView] = useState<'flow' | 'task'>('flow')

  // Mock SSB task data (normally would come from task generator)
  const mockSSBTask: Task = {
    id: 'task-qatar-ijarah-qat-ssb-001-step-4',
    workflowId: 'workflow-qatar-ijarah-001',
    stepId: 'qat-ssb-001-step-4',
    title: 'Obtain SSB Resolution (Formal Approval)',
    description: 'Receive formal SSB resolution approving product structure and contracts. This is a HARD GATE - product cannot proceed without SSB approval.',
    priority: 'critical',
    assignedRole: 'Shariah Supervisory Board',
    assignedTo: undefined,
    status: 'in-progress',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    requiredEvidence: [
      {
        type: 'SSB Resolution',
        description: 'Formal written resolution signed by SSB members approving the product',
        isRequired: true,
        uploadedFiles: [],
      },
      {
        type: 'Conditions or Restrictions',
        description: 'Any conditions, restrictions, or monitoring requirements imposed by SSB',
        isRequired: false,
        uploadedFiles: [],
      },
      {
        type: 'Approved Contracts',
        description: "Final version of contracts approved by SSB (marked as 'Shariah-approved')",
        isRequired: true,
        uploadedFiles: [],
      },
    ],
    requiresApproval: true,
    approvalStatus: 'pending',
    approver: 'Shariah Supervisory Board',
    policyReference: 'AAOIFI GS-1 §6/3, QCB Regulation',
    policyConstraints: [
      {
        source: 'AAOIFI GS-1 §6/3',
        constraint: 'SSB resolution is legally binding - product cannot launch without approval',
        cannotModify: true,
      },
      {
        source: 'QCB Regulation',
        constraint: 'SSB approval must be obtained before any customer transactions',
        cannotModify: true,
      },
    ],
    calendarExported: false,
  }

  const researchLinks = getResearchLinksForSSBTask(mockSSBTask.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                SSB Requirement Traceability Prototype
              </h1>
              <p className="text-gray-600 mt-1">
                Complete flow from obligation → control → module → tasks with full research transparency
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge className="bg-purple-600">
              Option C: Prototype First
            </Badge>
            <Badge variant="outline">
              UNIFIED-OBL-001 Example
            </Badge>
            <Badge variant="outline">
              4 Tasks Generated
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="flow">
              <GitBranch className="h-4 w-4 mr-2" />
              Traceability Flow
            </TabsTrigger>
            <TabsTrigger value="task">
              <ListTodo className="h-4 w-4 mr-2" />
              Task Card Demo
            </TabsTrigger>
          </TabsList>

          {/* Traceability Flow View */}
          <TabsContent value="flow" className="space-y-6 mt-6">
            {/* Flow Diagram */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-6 w-6 text-purple-600" />
                  SSB Requirement Traceability Flow
                </CardTitle>
                <CardDescription>
                  How UNIFIED-OBL-001 flows through all system layers with full auditability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1: Obligation */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">1</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Obligation</h3>
                        <a href="/obligations?filter=UNIFIED-OBL-001" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View in Register
                          </Button>
                        </a>
                      </div>
                      <ObligationCard obligation={traceability.obligation} />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>

                  {/* Step 2: Control */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Control</h3>
                        <a href="/controls?filter=CTRL-SSB-001" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View in Library
                          </Button>
                        </a>
                      </div>
                      <ControlCard control={traceability.control} />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>

                  {/* Step 3: Workflow Module */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-600">3</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Workflow Module</h3>
                        <Button variant="outline" size="sm" disabled>
                          <Workflow className="h-3 w-3 mr-1" />
                          qat-ssb-001
                        </Button>
                      </div>
                      <ModuleCard moduleEnhancement={traceability.moduleEnhancement} />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>

                  {/* Step 4: Tasks */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-orange-600">4</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Executable Tasks</h3>
                        <Badge variant="secondary">{traceability.taskCount} tasks generated</Badge>
                      </div>
                      <Card className="border-2 border-orange-200 bg-orange-50">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <TaskPreview
                              number={1}
                              title="Prepare Product Proposal for SSB Review"
                              duration="3 days"
                            />
                            <TaskPreview
                              number={2}
                              title="Submit Proposal to SSB Secretariat"
                              duration="1 day"
                            />
                            <TaskPreview
                              number={3}
                              title="SSB Review and Deliberation"
                              duration="7 days"
                            />
                            <TaskPreview
                              number={4}
                              title="Obtain SSB Resolution (Formal Approval)"
                              duration="3 days"
                              isHighlighted
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 w-full"
                            onClick={() => setActiveView('task')}
                          >
                            View Task #4 with Progressive Disclosure →
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <CheckCircle2 className="h-5 w-5" />
                  Key Insights from Prototype
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-green-900">
                <p>✓ <strong>Complete Traceability:</strong> Every task can be traced back to the exact regulatory requirement</p>
                <p>✓ <strong>Conflict Resolution Transparency:</strong> Shows how QCB vs QFCRA conflicts were resolved</p>
                <p>✓ <strong>Research Methodology Visibility:</strong> Links to 8-phase research process</p>
                <p>✓ <strong>Progressive Disclosure:</strong> Users see summary first, can drill down for details</p>
                <p>✓ <strong>Auditability:</strong> Full paper trail for regulatory audits</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Card Demo View */}
          <TabsContent value="task" className="mt-6">
            <div className="space-y-4">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Demo:</strong> This enhanced task card shows progressive disclosure with 5 information levels.
                    Click "Show Full Details" to see policy requirements and research methodology sections.
                  </p>
                </CardContent>
              </Card>

              <EnhancedTaskCard
                task={mockSSBTask}
                researchLinks={researchLinks}
                onStatusChange={(id, status) => console.log('Status change:', id, status)}
                onComplete={(id) => console.log('Complete:', id)}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Progressive Disclosure Levels</CardTitle>
                  <CardDescription>How information is organized in the enhanced task card</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Level 1</Badge>
                    <div>
                      <p className="font-semibold text-sm">Always Visible</p>
                      <p className="text-sm text-gray-600">Task title, priority, due date, assigned role</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Level 2</Badge>
                    <div>
                      <p className="font-semibold text-sm">"Why This Exists"</p>
                      <p className="text-sm text-gray-600">1-2 sentences linking to obligation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Level 3</Badge>
                    <div>
                      <p className="font-semibold text-sm">Policy Requirements (Collapsed)</p>
                      <p className="text-sm text-gray-600">Full obligation details, control mappings, policy constraints</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Level 4</Badge>
                    <div>
                      <p className="font-semibold text-sm">Research Methodology (Collapsed)</p>
                      <p className="text-sm text-gray-600">Unification process, conflict resolution, research phase</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Level 5</Badge>
                    <div>
                      <p className="font-semibold text-sm">Evidence Requirements (Collapsed)</p>
                      <p className="text-sm text-gray-600">Required documents, upload interface</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-900">Next Steps After Prototype</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-purple-900">
            <p>📋 <strong>Get Feedback:</strong> Does progressive disclosure help users understand requirements?</p>
            <p>🔗 <strong>Validate Links:</strong> Are obligation/control cross-references valuable for compliance?</p>
            <p>📊 <strong>Test Performance:</strong> Is resolving all research links fast enough?</p>
            <p>🚀 <strong>Scale Decision:</strong> Roll out to all 60 obligations or adjust approach?</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper Components

function ObligationCard({ obligation }: { obligation: Obligation }) {
  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardContent className="p-4 space-y-3">
        <div>
          <Badge className="bg-purple-600 mb-2">{obligation.id}</Badge>
          <p className="font-semibold text-gray-900">{obligation.requirement}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {obligation.regulators.map((reg) => (
            <div key={reg.id} className="p-2 bg-white rounded border text-xs">
              <p className="font-semibold">{reg.id}</p>
              <p className="text-gray-600">{reg.source.document}, {reg.source.section}</p>
            </div>
          ))}
        </div>

        {obligation.conflictResolution && (
          <div className="p-2 bg-amber-100 border border-amber-300 rounded text-xs">
            <p className="font-semibold text-amber-900">Conflict Resolved:</p>
            <p className="text-amber-800">{obligation.conflictResolution}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ControlCard({ control }: { control: Control }) {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-4 space-y-3">
        <div>
          <Badge className="bg-blue-600 mb-2">{control.id}</Badge>
          <p className="font-semibold text-gray-900">{control.name}</p>
          <p className="text-sm text-gray-700 mt-1">{control.description}</p>
        </div>

        <div className="space-y-2">
          <div className="text-xs">
            <span className="font-semibold">Test Frequency:</span> {control.testFrequency}
          </div>
          <div className="text-xs">
            <span className="font-semibold">Satisfies:</span> {control.satisfiesObligations.join(', ')}
          </div>
          <div className="text-xs">
            <span className="font-semibold">Implemented by:</span> {control.implementedByModules.join(', ')}
          </div>
        </div>

        {control.keyRiskIndicators.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {control.keyRiskIndicators.map((kri) => (
              <div key={kri.name} className="p-2 bg-white rounded border text-xs">
                <p className="font-semibold">{kri.name}</p>
                <p className="text-gray-600">{kri.currentValue}/{kri.targetValue} {kri.unit}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ModuleCard({ moduleEnhancement }: { moduleEnhancement: any }) {
  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardContent className="p-4 space-y-3">
        <div>
          <Badge className="bg-green-600 mb-2">{moduleEnhancement.moduleId}</Badge>
          <p className="font-semibold text-gray-900">Shariah Supervisory Board (SSB) Approval</p>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="font-semibold">Satisfies:</span> {moduleEnhancement.satisfiesObligations.join(', ')}
          </div>
          <div>
            <span className="font-semibold">Implements:</span> {moduleEnhancement.implementsControls.join(', ')}
          </div>
        </div>

        {moduleEnhancement.researchMethodology.conflictsResolved.length > 0 && (
          <div className="p-2 bg-white rounded border text-xs space-y-1">
            <p className="font-semibold">Conflicts Resolved:</p>
            {moduleEnhancement.researchMethodology.conflictsResolved.map((c: string, i: number) => (
              <p key={i} className="text-gray-700">• {c}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TaskPreview({
  number,
  title,
  duration,
  isHighlighted = false,
}: {
  number: number
  title: string
  duration: string
  isHighlighted?: boolean
}) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        isHighlighted
          ? 'bg-white border-orange-400 border-2'
          : 'bg-white border-orange-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center">
          <span className="text-sm font-bold text-orange-700">{number}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${isHighlighted ? 'font-semibold' : 'font-medium'} text-gray-900`}>
            {title}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">{duration}</p>
        </div>
      </div>
    </div>
  )
}
