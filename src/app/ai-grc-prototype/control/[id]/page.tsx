'use client'

/**
 * AI-NATIVE GRC UX PROTOTYPE - CONTROL DETAIL PAGE
 * =================================================
 * Shows detailed view of a single control with 3 tabs:
 * 1. Overview - Control details, AAOIFI sections, test procedure
 * 2. Workflow - Visual workflow with steps and hard gates
 * 3. Evidence - Required evidence list
 *
 * User can click "Start Workflow" to begin executing tasks
 */

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  GitBranch,
  HelpCircle,
  Lock,
  Shield,
  Sparkles
} from 'lucide-react'
import {
  getControlById,
  getCategoryById,
  getWorkflowById,
  mudarabahWorkflows
} from '@/lib/mock-data/mudarabah-controls'

export default function ControlDetailPage() {
  const params = useParams()
  const router = useRouter()
  const controlId = params.id as string

  const control = getControlById(controlId)
  const category = control ? getCategoryById(control.category) : null
  const workflow = control ? getWorkflowById(control.workflow) : null

  const [selectedTab, setSelectedTab] = useState('overview')

  if (!control) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Control not found</p>
          <Button onClick={() => router.push('/ai-grc-prototype/categories')} className="mt-4">
            Back to Categories
          </Button>
        </div>
      </div>
    )
  }

  // Mock task ID for demo
  const mockTaskId = control.id.replace('ctrl-', 'task-')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/ai-grc-prototype/categories')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
            {control.isHardGate && (
              <Badge className="bg-red-600 text-sm px-3 py-1">
                <Lock className="h-4 w-4 mr-1" />
                HARD GATE
              </Badge>
            )}
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bot className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">{control.name}</h1>
              </div>
              <p className="text-gray-600 text-sm mb-3">{control.description}</p>
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">{control.aaoifiSection}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">{control.frequency}</span>
                </div>
                {category && (
                  <Badge variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                )}
              </div>

              {/* Why This Control Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Why this control?
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Shield className="h-6 w-6 text-purple-600" />
                      Why This Control?
                    </DialogTitle>
                    <DialogDescription>
                      Understanding the regulatory foundation and Shariah purpose of this control
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Regulatory Obligations */}
                    <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Regulatory Obligations Satisfied
                      </h4>
                      <p className="text-sm text-purple-800 mb-3">
                        This control ensures compliance with the following regulatory requirements:
                      </p>
                      <div className="space-y-2">
                        {control.requiredBy.map((source, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200">
                            <Shield className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-900">{source}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shariah Purpose */}
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Shariah Purpose
                      </h4>
                      <p className="text-sm text-green-800">
                        {control.aaoifiSection} mandates this control to ensure Mudarabah contracts adhere to Islamic principles of {control.name.toLowerCase()}, protecting the rights of all parties and maintaining Shariah compliance throughout the contract lifecycle.
                      </p>
                    </div>

                    {/* Traceability */}
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        Traceability Chain
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            1
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-blue-900">Regulatory Obligation</p>
                            <p className="text-blue-700 text-xs">{control.requiredBy[0]}</p>
                          </div>
                        </div>
                        <div className="ml-4 w-0.5 h-6 bg-blue-300" />
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-purple-900">Control</p>
                            <p className="text-purple-700 text-xs">{control.name}</p>
                          </div>
                        </div>
                        <div className="ml-4 w-0.5 h-6 bg-blue-300" />
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            3
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-indigo-900">Workflow & Tasks</p>
                            <p className="text-indigo-700 text-xs">{control.frequency} testing with {control.evidenceRequired.length} evidence items</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Learn More */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push('/ai-grc-prototype/obligations')}
                      >
                        View Full Obligations Register
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/ssb-prototype')}
                      >
                        View Traceability Map
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workflow">
              <GitBranch className="h-4 w-4 mr-2" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="evidence">
              <FileCheck className="h-4 w-4 mr-2" />
              Evidence
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Required By */}
            <Card>
              <CardHeader>
                <CardTitle>Required By</CardTitle>
                <CardDescription>Regulatory sources mandating this control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {control.requiredBy.map((source, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">{source}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Procedure */}
            <Card>
              <CardHeader>
                <CardTitle>Test Procedure</CardTitle>
                <CardDescription>How this control is tested for compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{control.testProcedure}</p>
              </CardContent>
            </Card>

            {/* Conflict Resolution (if applicable) */}
            {control.conflictResolution && (
              <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-orange-900">Conflict Resolution</CardTitle>
                  </div>
                  <CardDescription className="text-orange-700">
                    How conflicts between regulators were resolved
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {control.conflictResolution.qcbRule && (
                    <div className="p-3 bg-white rounded-lg border border-orange-200">
                      <p className="text-xs font-semibold text-orange-900 mb-1">QCB Rule</p>
                      <p className="text-sm text-gray-700">{control.conflictResolution.qcbRule}</p>
                    </div>
                  )}
                  {control.conflictResolution.qfcraRule && (
                    <div className="p-3 bg-white rounded-lg border border-orange-200">
                      <p className="text-xs font-semibold text-orange-900 mb-1">QFCRA Rule</p>
                      <p className="text-sm text-gray-700">{control.conflictResolution.qfcraRule}</p>
                    </div>
                  )}
                  <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                    <p className="text-xs font-semibold text-green-900 mb-1">Resolution Applied</p>
                    <p className="text-sm text-gray-900 font-medium">{control.conflictResolution.resolution}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 2: Workflow */}
          <TabsContent value="workflow" className="space-y-6">
            {workflow && (
              <>
                {/* Workflow Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>{workflow.name}</CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">Frequency: {workflow.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{workflow.controls.length} controls</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Workflow Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Steps</CardTitle>
                    <CardDescription>Sequential tasks to complete this workflow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {workflow.steps.map((step, index) => {
                        const isHardGate = workflow.hardGates.includes(step)
                        return (
                          <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < workflow.steps.length - 1 && (
                              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300" />
                            )}

                            <div className="flex items-start gap-4 mb-6">
                              {/* Step Number or Hard Gate Icon */}
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isHardGate
                                  ? 'bg-red-600 text-white'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {isHardGate ? (
                                  <Lock className="h-6 w-6" />
                                ) : (
                                  <span className="font-bold">{index + 1}</span>
                                )}
                              </div>

                              {/* Step Content */}
                              <div className={`flex-1 p-4 rounded-lg border-2 ${
                                isHardGate
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-gray-200 bg-white'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <p className={`font-medium ${isHardGate ? 'text-red-900' : 'text-gray-900'}`}>
                                    {step}
                                  </p>
                                  {isHardGate && (
                                    <Badge className="bg-red-600">BLOCKS WORKFLOW</Badge>
                                  )}
                                </div>
                                {isHardGate && (
                                  <p className="text-sm text-red-700">
                                    This step cannot be bypassed. Workflow progression is blocked until this control passes.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Tab 3: Evidence */}
          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Required Evidence</CardTitle>
                <CardDescription>
                  Documents and artifacts needed to demonstrate compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {control.evidenceRequired.map((evidence, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{evidence}</p>
                        <p className="text-xs text-gray-600 mt-1">Status: Not uploaded</p>
                      </div>
                      <FileCheck className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Evidence Instructions */}
            <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-900">Evidence Instructions</CardTitle>
                <CardDescription className="text-green-700">
                  Best practices for collecting and organizing evidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>All documents must be digitally signed or certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Upload evidence before workflow deadline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Use AI Assistant to help draft documents and verify completeness</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Start Workflow Button */}
        <Card className="mt-8 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-1">
                  Ready to test this control?
                </h3>
                <p className="text-sm text-purple-700">
                  Start workflow with AI assistant • Human-in-the-loop approval • Progressive disclosure
                </p>
              </div>
              <Button
                onClick={() => router.push(`/ai-grc-prototype/task/${mockTaskId}`)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Start Workflow
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
