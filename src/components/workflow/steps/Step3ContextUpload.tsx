'use client'

/**
 * STEP 3: ADD CONTEXT (OPTIONAL)
 * ===============================
 * Optionally add context documents and text to guide Claude's execution.
 * This step can be skipped - Claude will work with the template alone.
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { ingestDocument } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Trash2, Info, ArrowRight, Upload, Loader2 } from 'lucide-react'
import { ServiceDependencyBadge } from '../ServiceDependencyBadge'

export function Step3ContextUpload() {
  const execution = useWorkflowStore((state) => state.execution)
  const addDocument = useWorkflowStore((state) => state.addDocument)
  const removeDocument = useWorkflowStore((state) => state.removeDocument)
  const setContextText = useWorkflowStore((state) => state.setContextText)
  const addError = useWorkflowStore((state) => state.addError)
  const nextStep = useWorkflowStore((state) => state.nextStep)

  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      // Upload each file
      for (const file of Array.from(files)) {
        // Validate file type
        const ext = file.name.toLowerCase()
        if (!ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.doc')) {
          addError({
            id: `error_${Date.now()}`,
            timestamp: new Date().toISOString(),
            severity: 'warning',
            title: 'Invalid File Type',
            message: `${file.name} is not a supported file type. Only PDF and DOCX files are allowed.`,
            dismissible: true,
          })
          continue
        }

        // Upload to backend
        const uploadedDoc = await ingestDocument(file, 'context')

        // Add to store
        addDocument('context', uploadedDoc)
      }
    } catch (error: any) {
      addError({
        id: `error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'error',
        title: 'Upload Failed',
        message: error.message || 'Failed to upload document',
        technicalDetails: error.stack,
        dismissible: true,
      })
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Optional Step Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>This Step is Optional</AlertTitle>
        <AlertDescription>
          Add context to help guide Claude's execution, or skip this step to proceed with the template alone.
          Claude will work effectively either way - context just provides additional personalization.
        </AlertDescription>
      </Alert>

      {/* Prominent Skip Button */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Skip Context & Proceed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Continue to execution without adding context. You can guide Claude during execution instead.
              </p>
            </div>
            <Button size="lg" variant="default" onClick={nextStep}>
              Skip to Execution
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Context Text (Optional) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Guidance Notes</CardTitle>
            <Badge variant="secondary">Optional</Badge>
          </div>
          <CardDescription>
            Provide specific guidance, constraints, or preferences to help Claude tailor the output
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Required Services */}
          <ServiceDependencyBadge
            services={['orchestrator']}
            specialTags={['R&D Phase']}
            inline={false}
          />

          <Textarea
            placeholder="e.g., 'Emphasize profit-sharing ratios', 'Include dispute resolution clauses', 'Reference AAOIFI FAS 3'..."
            value={execution?.contextText || ''}
            onChange={(e) => setContextText(e.target.value)}
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Context Documents (Optional) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Reference Documents</CardTitle>
            <Badge variant="secondary">Optional</Badge>
          </div>
          <CardDescription>
            Upload supporting documents that Claude can reference during execution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Required Services */}
          <ServiceDependencyBadge
            services={['documents', 'graphiti']}
            specialTags={['R&D Phase']}
            inline={false}
          />

          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf,.docx,.doc"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>

          {execution && execution.contextDocuments.length > 0 && (
            <div className="space-y-2">
              {execution.contextDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{doc.filename}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument('context', doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
