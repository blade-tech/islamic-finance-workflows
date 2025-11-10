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
import { ServiceStatusButton } from '@/components/workflow/ServiceStatusButton'
import { Navigation } from '@/components/layout/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI native Governance, Risk & Compliance platform for Islamic Finance',
  description:
    'AI-powered Shariah compliance platform built on AAOIFI, IFSB, and ISO standards. Assist Shariah officers with reviews, manage risk, and enable compliant digital asset issuance.',
  keywords: [
    'Islamic Finance',
    'GRC',
    'Governance Risk Compliance',
    'Shariah Compliance',
    'AAOIFI',
    'IFSB',
    'Risk Management',
    'Sukuk',
    'Digital Assets',
    'Verifiable Credentials',
    'Tokenization',
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
          {/* Global navigation bar */}
          <Navigation />

          {/* Main application content */}
          {children}

          {/* Visible error display (floating, top-right) */}
          <ErrorDisplay />

          {/* Toast notifications (bottom-right) */}
          <Toaster />

          {/* Backend service status button (floating, bottom-right) */}
          <ServiceStatusButton />
        </ErrorBoundary>
      </body>
    </html>
  )
}
