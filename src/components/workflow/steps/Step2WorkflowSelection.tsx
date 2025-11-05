'use client'

/**
 * STEP 2: WORKFLOW SELECTION
 * ===========================
 * Select from 5 pre-built Islamic Finance workflows or create custom.
 *
 * AVAILABLE WORKFLOWS:
 * 1. Sukuk Issuance Document
 * 2. Murabaha Purchase Agreement
 * 3. Ijarah Lease Contract
 * 4. Mudarabah Partnership Agreement
 * 5. Wakalah Agency Agreement
 *
 * CUSTOM WORKFLOW:
 * - User describes what they want in natural language
 * - Claude generates a custom workflow template
 * - Template includes open code + axial code
 */

import { useState, useEffect } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { fetchWorkflowTemplates } from '@/lib/api'
import type { WorkflowTemplate } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Plus, CheckCircle, Info, Loader2 } from 'lucide-react'
import { MockDataBadge } from '../MockDataBadge'
import { ServiceDependencyBadge } from '../ServiceDependencyBadge'
import type { ServiceName } from '@/lib/service-types'
import type { SpecialTag } from '../ServiceDependencyBadge'

export function Step2WorkflowSelection() {
  const execution = useWorkflowStore((state) => state.execution)
  const updateExecution = useWorkflowStore((state) => state.updateExecution)
  const [showCustom, setShowCustom] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMockData, setIsMockData] = useState(false)

  // Fetch templates from backend on mount
  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true)
        const { templates: data, isMock } = await fetchWorkflowTemplates()

        setTemplates(data)
        setIsMockData(isMock)
      } catch (err) {
        console.error('Failed to load templates:', err)
        setError('Failed to load workflow templates. Please check if the backend is running.')
      } finally {
        setLoading(false)
      }
    }
    loadTemplates()
  }, [])

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      updateExecution({ workflowTemplateId: template.id })
    }
  }

  return (
    <div className="space-y-6">
      {/* Mock Data Badge */}
      <MockDataBadge visible={isMockData} />

      {/* Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What's Happening in Step 2</AlertTitle>
        <AlertDescription>
          Select a template to see what Claude will do, required sources, and the system prompt.
        </AlertDescription>
      </Alert>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error Loading Templates</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading templates...</span>
        </div>
      )}

      {/* Split Panel: Template Cards (Left) + Preview (Right) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Template Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Available Templates</h3>
            <div className="space-y-3">
              {templates.map((template) => {
                const isSelected = (execution as any)?.selectedTemplate?.id === template.id || execution?.workflowTemplateId === template.id

                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      isSelected ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <div className="flex flex-wrap items-center gap-1 mt-2">
                              <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                              {/* Service Dependency Badges */}
                              {(template.requiredServices || template.tags) && (
                                <ServiceDependencyBadge
                                  services={(template.requiredServices || []).map(s => s.toLowerCase()) as ServiceName[]}
                                  specialTags={(template.tags || []) as SpecialTag[]}
                                  inline={true}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}

              {/* Custom Workflow Card */}
              <Card
                className={`cursor-pointer transition-all hover:border-primary ${
                  showCustom ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setShowCustom(true)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <Plus className="h-6 w-6" />
                    <div className="flex-1">
                      <CardTitle className="text-base">Create Custom Workflow</CardTitle>
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">AI-Generated</Badge>
                        {/* Inferred services for custom workflows */}
                        <ServiceDependencyBadge
                          services={['mcp', 'orchestrator']}
                          specialTags={['Unknown']}
                          inline={true}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Right Panel: Template Preview */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            {(execution as any)?.selectedTemplate ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{(execution as any).selectedTemplate.icon}</span>
                    <div>
                      <CardTitle>{(execution as any).selectedTemplate.name}</CardTitle>
                      <CardDescription>{(execution as any).selectedTemplate.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium capitalize">{(execution as any).selectedTemplate.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Complexity</p>
                      <p className="text-sm font-medium capitalize">
                        {(execution as any).selectedTemplate.axialCode.complexity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">
                        {(execution as any).selectedTemplate.axialCode.estimatedDuration} min
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Output</p>
                      <p className="text-sm font-medium capitalize">
                        {(execution as any).selectedTemplate.axialCode.outputFormat}
                      </p>
                    </div>
                  </div>

                  {/* Required Sources */}
                  {(execution as any).selectedTemplate.axialCode.requiredSources?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Required Sources</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {(execution as any).selectedTemplate.axialCode.requiredSources.map((source: string, idx: number) => (
                          <li key={idx}>{source}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* System Prompt */}
                  <div>
                    <p className="text-sm font-medium mb-2">What Claude Will Do</p>
                    <div className="bg-muted p-3 rounded-md max-h-64 overflow-y-auto">
                      <p className="text-xs whitespace-pre-wrap text-muted-foreground">
                        {(execution as any).selectedTemplate.openCodeTemplate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                  <CardDescription>
                    Select a template from the left to see details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Custom Workflow Input */}
      {showCustom && !loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Custom Workflow</CardTitle>
            <CardDescription>
              Tell Claude what you want to generate (e.g., "I need a Shariah-compliant investment fund prospectus")
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your workflow..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={6}
            />
            <Button disabled={!customPrompt}>
              <BookOpen className="h-4 w-4 mr-2" />
              Generate Custom Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
