/**
 * ROOT LAYOUT
 * ===========
 * Next.js App Router root layout wrapping the entire application.
 *
 * WHAT THIS DOES:
 * - Applies global CSS (Tailwind)
 * - Wraps app with error boundary
 * - Provides toast notifications
 * - Displays visible errors
 * - Sets HTML metadata
 *
 * WHY THIS STRUCTURE:
 * - Error boundary catches React errors
 * - ErrorDisplay shows Zustand store errors
 * - Toaster provides toast notifications
 * - Clean separation of concerns
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ErrorBoundary } from '@/components/workflow/ErrorBoundary'
import { ErrorDisplay } from '@/components/workflow/ErrorDisplay'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Islamic Finance Workflows - AI-Powered Document Generation',
  description:
    'Generate AAOIFI-compliant Islamic finance documents using AI workflows with Claude and Graphiti knowledge graph',
  keywords: [
    'Islamic Finance',
    'AAOIFI',
    'Sukuk',
    'Murabaha',
    'AI Workflows',
    'Document Generation',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {/* Main application content */}
          {children}

          {/* Visible error display (floating, top-right) */}
          <ErrorDisplay />

          {/* Toast notifications (bottom-right) */}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  )
}
