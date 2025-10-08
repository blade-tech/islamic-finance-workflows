'use client'

/**
 * ERROR BOUNDARY
 * ==============
 * React error boundary to catch and display runtime errors.
 *
 * WHY WE NEED THIS:
 * - Prevents the entire app from crashing
 * - Shows user-friendly error messages
 * - Logs errors for debugging
 * - Provides recovery options
 *
 * WHEN IT TRIGGERS:
 * - Uncaught exceptions in React components
 * - Errors during rendering
 * - Errors in lifecycle methods
 *
 * LIMITATIONS:
 * - Does NOT catch errors in:
 *   - Event handlers (use try/catch)
 *   - Async code (use try/catch)
 *   - Server-side rendering
 *   - Errors in the error boundary itself
 */

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-destructive">
                  Something went wrong
                </CardTitle>
              </div>
              <CardDescription>
                The application encountered an unexpected error. This has been logged for investigation.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error Message */}
              <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
                <p className="text-sm font-mono text-destructive">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              {/* Component Stack (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium mb-2">
                    Component Stack (Development Only)
                  </summary>
                  <pre className="text-xs p-4 bg-muted rounded-md overflow-auto max-h-64">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Error Stack (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium mb-2">
                    Error Stack (Development Only)
                  </summary>
                  <pre className="text-xs p-4 bg-muted rounded-md overflow-auto max-h-64">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              {/* What to do next */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">What you can do:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Try refreshing the page</li>
                  <li>Check your internet connection</li>
                  <li>Clear your browser cache</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button onClick={this.handleReset} variant="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
