'use client'

/**
 * STEP 6: CITATION VERIFICATION
 * ==============================
 * Review and approve/reject sources used in document generation.
 */

import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Info } from 'lucide-react'

export function Step6CitationVerification() {
  const execution = useWorkflowStore((state) => state.execution)
  const updateCitationApproval = useWorkflowStore((state) => state.updateCitationApproval)

  return (
    <div className="space-y-6">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What's Happening in Step 6</AlertTitle>
        <AlertDescription>
          Review all sources and citations used in the document. Approve accurate references or reject questionable ones.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Citations & Sources</CardTitle>
          <CardDescription>
            {execution?.citations.length || 0} citations found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {execution && execution.citations.length > 0 ? (
            <div className="space-y-4">
              {execution.citations.map((citation) => (
                <div key={citation.id} className="p-4 border rounded-md space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{citation.documentTitle}</p>
                      <Badge variant="secondary">{citation.source}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={citation.approved ? 'default' : 'outline'}
                        onClick={() => updateCitationApproval(citation.id, true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant={citation.rejected ? 'destructive' : 'outline'}
                        onClick={() => updateCitationApproval(citation.id, false)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{citation.excerpt}</p>
                  <p className="text-xs text-muted-foreground">
                    Used in: {citation.usedInSection}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No citations yet. Complete execution first.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
