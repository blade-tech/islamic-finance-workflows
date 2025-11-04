/**
 * ISLAMIC FINANCE COMPLIANCE DASHBOARD
 * =====================================
 * Main dashboard page showing compliance status across 4 modular components:
 * 1. Shariah Structure compliance
 * 2. Jurisdiction compliance
 * 3. Accounting Framework compliance
 * 4. Impact Metrics compliance
 *
 * Also displays:
 * - Monitoring cards (Contracts, Shariah Reviews, Impact Validations, Documents)
 * - Active deals summary
 * - Overall platform compliance score
 */

'use client'

import { useEffect, useState } from 'react'
import { backendClient } from '@/lib/backend-client'
import { DashboardMetrics } from '@/lib/types'
import { ComponentProgressCard } from '@/components/dashboard/ComponentProgressCard'
import { MonitoringCard } from '@/components/dashboard/MonitoringCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
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
          <MonitoringCard card={metrics.contracts_card} icon="📄" />
          <MonitoringCard card={metrics.shariah_reviews_card} icon="✓" />
          <MonitoringCard
            card={metrics.impact_validations_card}
            icon="🌍"
          />
          <MonitoringCard card={metrics.documents_card} icon="📁" />
        </div>
      </div>

      {/* Active Deals Summary */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Active Deals
        </h2>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="space-y-3">
              {metrics.active_deals.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No active deals yet. Create your first deal to start tracking
                  compliance.
                </p>
              ) : (
                metrics.active_deals.map((deal) => (
                  <div
                    key={deal.deal_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">
                        {deal.deal_name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="capitalize">
                          {deal.shariah_structure.replace(/_/g, ' ')}
                        </span>{' '}
                        •{' '}
                        <span className="capitalize">
                          {deal.jurisdiction.replace(/_/g, ' ')}
                        </span>{' '}
                        •{' '}
                        <span className="uppercase">{deal.accounting}</span>
                        {deal.impact !== 'none' && (
                          <>
                            {' '}
                            •{' '}
                            <span className="capitalize">
                              {deal.impact.replace(/_/g, ' ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {deal.overall_completion.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
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
