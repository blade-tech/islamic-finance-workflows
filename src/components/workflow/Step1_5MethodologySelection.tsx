'use client'

/**
 * STEP 1.5: METHODOLOGY SELECTION (BRIDGE COMPONENT)
 * ===================================================
 * This component bridges the gap between methodology selection and workflow execution.
 *
 * WHAT THIS DOES:
 * - Wraps the standalone MethodologySelector component
 * - Connects selected methodologies to the workflow store
 * - Generates a WorkflowTemplate from selected methodologies via backend
 * - Sets the generated template in the execution state for Step 2
 *
 * INTEGRATION FLOW:
 * 1. User selects methodologies in MethodologySelector
 * 2. User clicks "Apply Methodologies" or "Combine N Methodologies"
 * 3. This component calls POST /api/workflows/generate-from-methodologies
 * 4. Backend returns generated WorkflowTemplate
 * 5. Template is set in store via setSelectedTemplate()
 * 6. User proceeds to Step 2 with a methodology-generated template
 *
 * RELATION TO EXISTING WORKFLOW:
 * - Phase 3: Methodology→Workflow Integration
 * - Replaces manual template selection with methodology-driven generation
 * - Maintains backward compatibility with existing template-based workflows
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { MethodologySelector } from './MethodologySelector'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, CheckCircle2, Info } from 'lucide-react'
import type { Methodology, WorkflowTemplate } from '@/lib/types'

export function Step1_5MethodologySelection() {
  const [localSelectedMethodologies, setLocalSelectedMethodologies] = useState<Methodology[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { setSelectedMethodologies, setSelectedTemplate, nextStep } = useWorkflowStore()

  const handleApplyMethodologies = async () => {
    if (localSelectedMethodologies.length === 0) {
      setError('Please select at least one methodology')
      return
    }

    try {
      setGenerating(true)
      setError(null)
      setSuccess(false)

      // Call backend to generate template from methodologies
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/workflows/generate-from-methodologies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            methodology_ids: localSelectedMethodologies.map((m) => m.id),
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Failed to generate template: ${response.statusText}`)
      }

      const data = await response.json()
      const generatedTemplate: WorkflowTemplate = data.template

      // Update workflow store
      setSelectedMethodologies(localSelectedMethodologies)
      setSelectedTemplate(generatedTemplate)

      setSuccess(true)

      // Auto-advance to next step after 1.5 seconds
      setTimeout(() => {
        nextStep()
      }, 1500)
    } catch (err) {
      console.error('Failed to apply methodologies:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate workflow template')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Methodology-Driven Workflow Generation</AlertTitle>
        <AlertDescription>
          Select one or more digitized methodologies. A complete workflow template will be generated
          automatically, combining all schemas, policy steps, and compliance requirements.
        </AlertDescription>
      </Alert>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert variant="default" className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Template Generated!</AlertTitle>
          <AlertDescription className="text-green-800">
            Workflow template created from {localSelectedMethodologies.length} methodolog
            {localSelectedMethodologies.length === 1 ? 'y' : 'ies'}. Advancing to configuration...
          </AlertDescription>
        </Alert>
      )}

      {/* Methodology Selector (standalone component) */}
      <div className="border rounded-lg p-6 bg-card">
        <MethodologySelector
          selectedMethodologies={localSelectedMethodologies}
          onSelectionChange={setLocalSelectedMethodologies}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {localSelectedMethodologies.length === 0 ? (
            'No methodologies selected'
          ) : (
            <span>
              {localSelectedMethodologies.length} methodolog
              {localSelectedMethodologies.length === 1 ? 'y' : 'ies'} selected
            </span>
          )}
        </div>

        <Button
          size="lg"
          onClick={handleApplyMethodologies}
          disabled={localSelectedMethodologies.length === 0 || generating || success}
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Template...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Template Ready
            </>
          ) : localSelectedMethodologies.length === 1 ? (
            'Apply Methodology'
          ) : (
            `Combine ${localSelectedMethodologies.length} Methodologies`
          )}
        </Button>
      </div>
    </div>
  )
}
