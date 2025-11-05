/**
 * ISLAMIC FINANCE COMPLIANCE DASHBOARD (ROLE: MANAGERS)
 * ======================================================
 * Compliance monitoring and metrics dashboard for managers.
 * Primary interface for tracking compliance across all deals.
 *
 * DISPLAYS:
 * 1. Overall platform compliance score
 * 2. Component compliance metrics (Shariah, Jurisdiction, Accounting, Impact)
 * 3. Monitoring cards (Contracts, Reviews, Validations, Documents)
 * 4. Quick summary stats
 *
 * ROLE: Managers - Monitor compliance, not manage individual deals
 * For deal management → Navigate to Deals page
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { backendClient } from '@/lib/backend-client'
import { DashboardMetrics } from '@/lib/types'
import { ComponentProgressCard } from '@/components/dashboard/ComponentProgressCard'
import { MonitoringCard } from '@/components/dashboard/MonitoringCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    setError(null)
    try {
      const data = await backendClient.getDashboardOverview()
      setMetrics(data)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      setError('Failed to load dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="font-semibold mb-2">Error Loading Dashboard</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={loadDashboard}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Overall Compliance */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Islamic Finance Compliance Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            4-Component Modular Architecture Tracking
          </p>
        </div>
        <Card className="px-6 py-4 bg-white shadow-md">
          <div className="text-center">
            <div className="text-sm text-gray-500 font-medium">
              Overall Platform Compliance
            </div>
            <div className="text-4xl font-bold text-blue-600 mt-1">
              {metrics.overall_platform_compliance.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Across {metrics.total_deals} active deals
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metrics.total_deals}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliant Deals</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {metrics.compliant_deals}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {metrics.deals_needing_attention}
                </p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4-Component Progress Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Component Compliance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ComponentProgressCard
            component={metrics.shariah_compliance}
            color="purple"
            icon="🕌"
          />
          <ComponentProgressCard
            component={metrics.jurisdiction_compliance}
            color="orange"
            icon="⚖️"
          />
          <ComponentProgressCard
            component={metrics.accounting_compliance}
            color="blue"
            icon="📊"
          />
          <ComponentProgressCard
            component={metrics.impact_compliance}
            color="green"
            icon="🌱"
          />
        </div>
      </div>

      {/* Monitoring Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Monitoring & Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MonitoringCard
            card={metrics.contracts_card}
            icon="📄"
            onClick={() => router.push('/contracts')}
          />
          <MonitoringCard card={metrics.shariah_reviews_card} icon="✓" />
          <MonitoringCard
            card={metrics.impact_validations_card}
            icon="🌍"
          />
          <MonitoringCard card={metrics.documents_card} icon="📁" />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/deals')}>
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Manage Deals
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  View and manage all {metrics.total_deals} active deals
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-blue-50 border-blue-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push('/deals')
                  }}
                >
                  View All Deals →
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/digital-assets')}>
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Digital Assets
                </h3>
                <p className="text-sm text-purple-700 mb-3">
                  Guardian certificates and ATS tokens
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-purple-50 border-purple-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push('/digital-assets')
                  }}
                >
                  View Assets →
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/')}>
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Create New Deal
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  Start a new 11-step workflow
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-green-50 border-green-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push('/')
                  }}
                >
                  Start Workflow →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for dashboard
 */
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-24 w-48" />
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      {/* Component Cards Skeleton */}
      <div>
        <Skeleton className="h-6 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>

      {/* Monitoring Cards Skeleton */}
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>

      {/* Active Deals Skeleton */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
