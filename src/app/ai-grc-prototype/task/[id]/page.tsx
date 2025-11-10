'use client'

/**
 * AI-NATIVE GRC UX PROTOTYPE - TASK PAGE (REDESIGNED)
 * ====================================================
 * Action-first design with clear information hierarchy:
 * 1. What You Need to Do (Required Evidence with upload)
 * 2. Get AI Help (Assistant + Conversations)
 * 3. Why This Matters (Collapsible context)
 *
 * This demonstrates contract-driven compliance UX with:
 * - Immediate actionability (upload buttons)
 * - Progressive disclosure (context on demand)
 * - AI assistance (HITL approval)
 */

import { useState, useRef } from 'react'
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
  ChevronDown,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Lock,
  Shield,
  Sparkles,
  Upload,
  User
} from 'lucide-react'
import { getControlById } from '@/lib/mock-data/mudarabah-controls'
import { AIAssistantPanel, type AIAssistantPanelRef } from '@/components/ai-grc-prototype/AIAssistantPanel'
import {
  calculateCapitalHappy,
  calculateCapitalSad,
  scheduleMeeting,
  uploadEvidence,
  type Conversation
} from '@/lib/mock-data/ai-conversations'

export default function TaskPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  const aiAssistantRef = useRef<AIAssistantPanelRef>(null)

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

  // Track uploaded evidence
  const [uploadedDocs, setUploadedDocs] = useState<Record<number, boolean>>({})

  const handleUpload = (index: number) => {
    // Mock upload
    setUploadedDocs(prev => ({ ...prev, [index]: true }))
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* TASK HEADER */}
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

        {/* SECTION 1: WHAT YOU NEED TO DO */}
        <Card className="border-2 border-green-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle className="text-green-900">What You Need to Do</CardTitle>
                <CardDescription className="text-green-700">
                  Upload {control.evidenceRequired.length} required documents to complete this task
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {control.evidenceRequired.map((evidence, index) => {
              const isUploaded = uploadedDocs[index]
              return (
                <Card
                  key={index}
                  className={`border-2 ${
                    isUploaded
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                        isUploaded ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                      }`}>
                        {isUploaded ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{evidence}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {isUploaded ? (
                            <>
                              <Badge className="bg-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Uploaded
                              </Badge>
                              <Button size="sm" variant="outline" className="text-xs h-7">
                                <FileText className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </>
                          ) : (
                            <>
                              <Badge variant="outline" className="text-gray-600 border-gray-300">
                                Not uploaded
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => handleUpload(index)}
                                className="bg-green-600 hover:bg-green-700 text-xs h-7"
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1 bg-green-600 hover:bg-green-700" size="lg">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Mark as Complete
              </Button>
              <Button variant="outline" size="lg">
                <Clock className="h-5 w-5 mr-2" />
                Request Extension
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: GET AI HELP */}
        <Card className="border-2 border-purple-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-purple-900">Get AI Help</CardTitle>
                <CardDescription className="text-purple-700">
                  Try pre-scripted conversations to see HITL (Human-in-the-Loop) approval
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* AI Action Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableConversations.map(conv => (
                <Card
                  key={conv.id}
                  className="border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all"
                  onClick={() => aiAssistantRef.current?.loadConversation(conv)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Bot className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-xs font-semibold text-gray-900 leading-tight">
                        {conv.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Assistant Panel */}
            <div className="mt-6 pt-6 border-t">
              <AIAssistantPanel
                ref={aiAssistantRef}
                taskId={taskId}
                taskName={mockTask.title}
                availableConversations={availableConversations}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: WHY THIS MATTERS (Collapsible) */}
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="context">
            <Card className="border-2 border-gray-300">
              <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Why This Matters</h3>
                  <Badge variant="outline" className="ml-2">Context & Details</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Regulatory Requirements */}
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Regulatory Requirements</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      This control is mandated by <strong>AAOIFI SS-13 {control.aaoifiSection}</strong> for Mudarabah contracts.
                      It ensures compliance with Shariah principles regarding {control.name.toLowerCase()}.
                    </p>
                    <div className="space-y-1">
                      {control.requiredBy.map((source, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span>{source}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Procedure */}
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">Test Procedure</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{control.testProcedure}</p>
                  </div>

                  {/* Conflict Resolution (if applicable) */}
                  {control.conflictResolution && (
                    <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-orange-900">Conflict Resolution</h4>
                      </div>
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
        </Accordion>
      </div>
    </div>
  )
}
