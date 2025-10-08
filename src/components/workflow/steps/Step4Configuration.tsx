'use client'

/**
 * STEP 4: CONFIGURATION
 * ======================
 * Configure workflow with open code notes and iterate with Claude.
 */

import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Info, MessageSquare } from 'lucide-react'

export function Step4Configuration() {
  const execution = useWorkflowStore((state) => state.execution)
  const addUserNote = useWorkflowStore((state) => state.addUserNote)

  return (
    <div className="space-y-6">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What's Happening in Step 4</AlertTitle>
        <AlertDescription>
          Add open code notes to guide Claude's execution. These natural language instructions will be converted to axial code later.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Configuration Notes</CardTitle>
          <CardDescription>
            Add guidance and requirements in natural language (open code)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Make sure to emphasize profit-sharing ratios, include clauses about dispute resolution, reference AAOIFI FAS 3..."
            rows={10}
            onChange={(e) => addUserNote('config', e.target.value)}
          />
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Discuss with Claude
          </Button>
        </CardContent>
      </Card>

      {/* Selected Template Info */}
      {execution?.selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Workflow Template</CardTitle>
            <CardDescription>
              Review the selected template details before execution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{execution.selectedTemplate.icon}</span>
                <h3 className="text-lg font-semibold">{execution.selectedTemplate.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {execution.selectedTemplate.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground capitalize">{execution.selectedTemplate.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Complexity</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {execution.selectedTemplate.axialCode.complexity}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Estimated Duration</p>
                <p className="text-sm text-muted-foreground">
                  {execution.selectedTemplate.axialCode.estimatedDuration} minutes
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Output Format</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {execution.selectedTemplate.axialCode.outputFormat}
                </p>
              </div>
            </div>

            {execution.selectedTemplate.axialCode.requiredSources?.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Required Sources</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {execution.selectedTemplate.axialCode.requiredSources.map((source, idx) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">System Prompt</p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">
                  {execution.selectedTemplate.openCodeTemplate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
