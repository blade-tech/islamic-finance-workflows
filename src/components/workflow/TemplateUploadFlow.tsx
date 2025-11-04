'use client'

/**
 * TEMPLATE UPLOAD FLOW
 * =====================
 * Allows users to upload documents to create new custom templates.
 *
 * USER-FACING TERMINOLOGY:
 * - "Template" (not "methodology")
 * - "Upload" (simple, intuitive)
 *
 * NOTE: This is a placeholder for Phase 4A. Full implementation in Phase 4B.
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Upload, Info } from 'lucide-react'

export function TemplateUploadFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Template</CardTitle>
        <CardDescription>
          Create a custom template by uploading documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="info">
          <Info className="h-4 w-4" />
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            Template upload functionality will be available in a future update. For now, please
            select from existing templates.
          </AlertDescription>
        </Alert>

        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload PDF, DOCX, or markdown documentation to create a custom template
          </p>
          <Button variant="outline" disabled>
            Select Files
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, DOCX, MD
          <br />
          Maximum file size: 10 MB
        </p>
      </CardContent>
    </Card>
  )
}
