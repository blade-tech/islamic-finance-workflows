/**
 * DASHBOARD PAGE REDIRECT
 * =======================
 * Redirects to the enhanced AI Native dashboard at /ai-native
 *
 * The AI Native dashboard now includes all features from the original dashboard:
 * - Backend data integration
 * - 4-component progress cards (Shariah, Jurisdiction, Accounting, Impact)
 * - Monitoring cards (Contracts, Reviews, Validations, Documents)
 * - AI insights and predictions
 * - Deal prioritization and blocker detection
 * - Compliance forecasting
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to AI Native dashboard
    router.replace('/ai-native')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Redirecting to AI Native Dashboard
        </h2>
        <p className="text-gray-600 mb-4">
          We've enhanced your dashboard with AI-powered insights and predictions.
        </p>
        <div className="bg-white rounded-lg border border-purple-200 p-4 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">New Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✨ AI-powered deal prioritization</li>
            <li>📊 Compliance forecasting</li>
            <li>🎯 Intelligent blocker detection</li>
            <li>📈 All original dashboard metrics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
