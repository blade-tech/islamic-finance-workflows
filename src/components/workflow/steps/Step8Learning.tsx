'use client'

/**
 * STEP 8: LEARNING CAPTURE
 * =========================
 * View diff showing open code → axial code conversion and extracted learnings.
 */

import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle, Info, TrendingUp } from 'lucide-react'

export function Step8Learning() {
  const execution = useWorkflowStore((state) => state.execution)
  const applyLearning = useWorkflowStore((state) => state.applyLearning)
  const setUserFeedback = useWorkflowStore((state) => state.setUserFeedback)

  return (
    <div className="space-y-6">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What's Happening in Step 8</AlertTitle>
        <AlertDescription>
          Review extracted learnings that convert your open code notes to axial code improvements. These will enhance future workflow executions.
        </AlertDescription>
      </Alert>

      {/* Extracted Learnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Extracted Learnings
          </CardTitle>
          <CardDescription>
            {execution?.extractedLearnings.length || 0} improvements identified
          </CardDescription>
        </CardHeader>
        <CardContent>
          {execution && execution.extractedLearnings.length > 0 ? (
            <div className="space-y-4">
              {execution.extractedLearnings.map((learning) => (
                <div key={learning.id} className="p-4 border rounded-md space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{learning.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {learning.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{learning.category}</Badge>
                        <Badge variant="outline">
                          Confidence: {(learning.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={learning.approved ? 'default' : 'outline'}
                        onClick={() => applyLearning(learning.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Open Code Change */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Open Code</p>
                    <p className="text-sm bg-muted p-2 rounded">{learning.openCodeChange}</p>
                  </div>

                  {/* Axial Code Change */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Axial Code</p>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(learning.axialCodeChange, null, 2)}
                    </pre>
                  </div>

                  {/* Impact */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Expected Impact</p>
                    <p className="text-sm">{learning.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No learnings extracted yet. Complete the workflow first.
            </p>
          )}
        </CardContent>
      </Card>

      {/* User Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feedback</CardTitle>
          <CardDescription>
            Help improve future workflows by sharing your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="How was your experience? What could be improved?"
            value={execution?.userFeedback || ''}
            onChange={(e) => setUserFeedback(e.target.value)}
            rows={4}
          />
          <Button>Submit Feedback</Button>
        </CardContent>
      </Card>

      {/* Workflow Summary */}
      {execution && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{execution.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{execution.durationSeconds}s</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tokens Used</p>
                <p className="font-medium">{execution.tokensUsed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Interrupts</p>
                <p className="font-medium">{execution.interruptCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
