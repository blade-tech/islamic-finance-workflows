'use client'

/**
 * ERROR DISPLAY
 * =============
 * Displays errors from the Zustand store as visible UI alerts.
 *
 * WHY VISIBLE ERRORS:
 * - User requested: "errors are visible in the UI"
 * - Transparency: Users should know what's happening
 * - Debugging: Helps identify issues quickly
 * - Learning: Shows how the system handles failures
 *
 * TYPES OF ERRORS:
 * - error: Critical failures (red)
 * - warning: Non-critical issues (yellow)
 * - info: Informational messages (blue)
 *
 * ERROR SOURCES:
 * - API failures
 * - Validation errors
 * - Network issues
 * - Claude execution errors
 * - Graphiti connection issues
 */

import { useWorkflowStore } from '@/lib/store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ErrorDisplay() {
  const errors = useWorkflowStore((state) => state.errors)
  const removeError = useWorkflowStore((state) => state.removeError)

  if (errors.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md space-y-2">
      <ScrollArea className="max-h-[80vh]">
        {errors.map((error) => {
          // Choose icon based on severity
          const Icon =
            error.severity === 'error'
              ? AlertCircle
              : error.severity === 'warning'
              ? AlertTriangle
              : Info

          // Choose variant based on severity
          const variant =
            error.severity === 'error'
              ? 'destructive'
              : error.severity === 'warning'
              ? 'warning'
              : 'info'

          return (
            <Alert key={error.id} variant={variant} className="relative pr-12 mb-2">
              <Icon className="h-4 w-4" />
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  {/* Main error message */}
                  <p className="text-sm">{error.message}</p>

                  {/* Technical details (expandable) */}
                  {error.technicalDetails && (
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium">
                        Technical Details
                      </summary>
                      <pre className="mt-2 p-2 bg-background/50 rounded text-xs overflow-auto">
                        {error.technicalDetails}
                      </pre>
                    </details>
                  )}

                  {/* Suggestion */}
                  {error.suggestion && (
                    <p className="text-xs italic mt-2 border-l-2 border-current pl-2">
                      💡 {error.suggestion}
                    </p>
                  )}

                  {/* Context (only in development) */}
                  {process.env.NODE_ENV === 'development' && error.context && (
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium">
                        Context (Dev Only)
                      </summary>
                      <pre className="mt-2 p-2 bg-background/50 rounded text-xs overflow-auto">
                        {JSON.stringify(error.context, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </AlertDescription>

              {/* Dismiss button */}
              {error.dismissible && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => removeError(error.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </Alert>
          )
        })}
      </ScrollArea>
    </div>
  )
}
