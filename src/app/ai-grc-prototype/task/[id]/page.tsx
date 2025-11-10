'use client'

/**
 * AI-NATIVE GRC UX PROTOTYPE - TASK PAGE
 * =======================================
 * Shows a single task with:
 * 1. Task card (self-contained information pack)
 * 2. AI Assistant Panel (with HITL approval)
 * 3. Progressive disclosure (Why This Exists, Policy Requirements, Evidence)
 *
 * This demonstrates the contract-driven compliance UX where each task
 * has all necessary information and an AI helper.
 */

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Lock,
  Shield,
  Sparkles,
  User
} from 'lucide-react'
import { getControlById } from '@/lib/mock-data/mudarabah-controls'
import { AIAssistantPanel } from '@/components/ai-grc-prototype/AIAssistantPanel'
import {
  calculateCapitalHappy,
  calculateCapitalSad,
  scheduleMeeting,
  uploadEvidence
} from '@/lib/mock-data/ai-conversations'

export default function TaskPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  // Extract control ID from task ID (task-mud-profit-002 → ctrl-mud-profit-002)
  const controlId = taskId.replace('task-', 'ctrl-')
  const control = getControlById(controlId)

  // Mock task data
  const mockTask = {
    id: taskId,
    title: control ? `${control.frequency === 'quarterly' ? 'Quarterly' : 'Monthly'} ${control.name}` : 'Task',
    description: control?.description || '',
    priority: control?.isHardGate ? 'CRITICAL' : 'HIGH',
    dueDate: '2025-11-24',
    daysRemaining: 14,
    assignedRole: control?.frequency === 'quarterly' ? 'Compliance Officer' : 'Risk Analyst',
    status: 'In Progress',
    control: control
  }

  if (!control) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Task not found</p>
          <Button onClick={() => router.push('/ai-grc-prototype/categories')} className="mt-4">
            Back to Categories
          </Button>
        </div>
      </div>
    )
  }

  // Select conversations based on control
  const availableConversations = control.isHardGate
    ? [calculateCapitalHappy, calculateCapitalSad, scheduleMeeting, uploadEvidence]
    : [scheduleMeeting, uploadEvidence]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push(`/ai-grc-prototype/control/${controlId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Control
            </Button>
            <Badge className="bg-purple-600 text-sm px-3 py-1">
              <Bot className="h-4 w-4 mr-1" />
              AI-Assisted Task
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Task Card */}
          <div className="space-y-6">
            {/* Task Header Card */}
            <Card className={`border-2 ${control.isHardGate ? 'border-red-400 bg-red-50' : 'border-purple-300'}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{mockTask.title}</h1>
                      {control.isHardGate && (
                        <Badge className="bg-red-600">
                          <Lock className="h-3 w-3 mr-1" />
                          HARD GATE
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{mockTask.description}</p>
                  </div>
                </div>

                {/* Task Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Priority</p>
                    <Badge className={mockTask.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'}>
                      {mockTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Due Date</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <Calendar className="h-4 w-4" />
                      <span>{mockTask.daysRemaining} days</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Assigned To</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <User className="h-4 w-4" />
                      <span>{mockTask.assignedRole}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <Badge variant="outline" className="border-blue-400 text-blue-700">
                      {mockTask.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Progressive Disclosure Sections */}
            <Accordion type="multiple" defaultValue={['why-exists', 'evidence']} className="space-y-4">
              {/* Level 2: Why This Exists (Always Visible in Accordion) */}
              <AccordionItem value="why-exists">
                <Card className="border-2 border-blue-300">
                  <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Why This Exists</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        This control is mandated by <strong>AAOIFI SS-13 {control.aaoifiSection}</strong> for Mudarabah contracts.
                        It ensures compliance with Shariah principles regarding {control.name.toLowerCase()}.
                      </p>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Regulatory Sources:</p>
                        <div className="space-y-1">
                          {control.requiredBy.map((source, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <Shield className="h-4 w-4 text-blue-600" />
                              <span>{source}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Level 3: Policy Requirements */}
              <AccordionItem value="policy-requirements">
                <Card className="border-2 border-purple-300">
                  <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-900">Policy Requirements & Traceability</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      {/* Test Procedure */}
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Test Procedure:</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{control.testProcedure}</p>
                      </div>

                      {/* Conflict Resolution (if applicable) */}
                      {control.conflictResolution && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Conflict Resolution
                          </p>
                          <p className="text-sm text-gray-700">{control.conflictResolution.resolution}</p>
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('#', '_blank')}
                          className="text-xs"
                        >
                          View in Control Library
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Level 5: Required Evidence */}
              <AccordionItem value="evidence">
                <Card className="border-2 border-green-300">
                  <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Required Evidence</h3>
                      <Badge variant="outline" className="border-green-400 text-green-700">
                        {control.evidenceRequired.length} documents
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3">
                      {control.evidenceRequired.map((evidence, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{evidence}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs text-gray-600">
                                Not uploaded
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* Quick Actions */}
            <Card className="border-2 border-gray-300">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Upload Evidence
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Request Extension
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: AI Assistant */}
          <div className="space-y-6">
            {/* Instructional Callout */}
            <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-yellow-900">How It Works</CardTitle>
                </div>
                <CardDescription className="text-yellow-700">
                  Try the pre-scripted conversations to see HITL (Human-in-the-Loop) approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-yellow-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Click a conversation</strong> to load a pre-scripted demo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Review tool parameters</strong> when AI requests approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Click Approve</strong> to execute the tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>See results</strong> with full transparency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Assistant Panel */}
            <AIAssistantPanel
              taskId={taskId}
              taskName={mockTask.title}
              availableConversations={availableConversations}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
