/**
 * SCREEN 1: AI-ENHANCED HOME DASHBOARD
 * Portfolio overview with AI insights and predictions
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Bell
} from 'lucide-react'
import { mockDeals, getDealsByStatus, getDealsWithBlockers } from '@/lib/mock-data/deals'
import { mockTasks, getCriticalTasks, getBlockedTasks } from '@/lib/mock-data/tasks'
import { bucketTheme } from '@/lib/control-library'
import { backendClient } from '@/lib/backend-client'
import { ComponentProgressCard } from '@/components/dashboard/ComponentProgressCard'
import { MonitoringCard } from '@/components/dashboard/MonitoringCard'

// Temporary inline mockDataStats to bypass module resolution issue
const mockDataStats = {
  totalDeals: 5,
  activeDeals: 3,
  completedDeals: 1,
  blockedDeals: 1,
  totalTasks: 8,
  criticalTasks: 1,
  blockedTasks: 3,
  tasksWithAIFix: 6,
  totalEvidence: 50,
  agentCollectedEvidence: 15,
  blockchainVCs: 15,
  totalControls: 26,
  averageCompliance: 76.2
}

export default function AIHomePage() {
  // Backend data integration
  const [backendMetrics, setBackendMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Load backend data on mount
  useEffect(() => {
    async function loadBackendData() {
      setLoading(true)
      try {
        // Initialize backend client
        await backendClient.init()

        // Fetch dashboard overview
        const data = await backendClient.getDashboardOverview()
        setBackendMetrics(data)
      } catch (err) {
        console.error('Backend unavailable, using mock data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBackendData()
  }, [])

  const activeDeals = getDealsByStatus('in_progress')
  const dealsWithBlockers = getDealsWithBlockers()
  const criticalTasks = getCriticalTasks()
  const blockedTasks = getBlockedTasks()

  // Use backend data when available, fallback to mock
  const stats = {
    activeDeals: backendMetrics?.total_deals ?? mockDataStats.activeDeals,
    atRisk: backendMetrics?.deals_needing_attention ?? dealsWithBlockers.length,
    compliant: backendMetrics?.compliant_deals ?? mockDataStats.completedDeals,
    pendingTasks: mockDataStats.totalTasks,
    tasksWithAIFix: mockDataStats.tasksWithAIFix,
    averageCompliance: backendMetrics?.overall_platform_compliance ?? mockDataStats.averageCompliance
  }

  return (
    <div className="space-y-8">
      {/* AI Greeting */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">AI Copilot</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Good morning! 3 deals need attention.
            </h2>
            <p className="text-purple-100 max-w-2xl">
              2 deals have critical blockers that require immediate action.
              I've prepared fix proposals for 6 tasks across your portfolio.
            </p>
          </div>
          <Link
            href="/ai-native/tasks"
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center space-x-2"
          >
            <span>View Tasks</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Portfolio Overview */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Portfolio Overview (Agent-Generated)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Active Deals */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Active Deals</span>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.activeDeals}
            </div>
            <p className="text-xs text-gray-500">
              Avg. {stats.averageCompliance.toFixed(1)}% compliant
            </p>
          </div>

          {/* At Risk */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">At Risk</span>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.atRisk}
            </div>
            <p className="text-xs text-gray-500">
              Showing below
            </p>
          </div>

          {/* Compliant */}
          <div className="bg-white rounded-lg border border-green-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">100% Compliant</span>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.compliant}
            </div>
            <p className="text-xs text-gray-500">
              Ready for audit
            </p>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg border border-orange-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Pending Tasks</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {stats.pendingTasks}
            </div>
            <p className="text-xs text-gray-500">
              {stats.tasksWithAIFix} with AI fixes
            </p>
          </div>
        </div>
      </section>

      {/* AI-Prioritized Deals */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          AI-Prioritized Deals
        </h3>

        <div className="space-y-3">
          {dealsWithBlockers.slice(0, 2).map((deal) => {
            const criticalBlocker = deal.blockers.find(b => b.severity === 'critical')
            const highBlockers = deal.blockers.filter(b => b.severity === 'high')

            return (
              <div
                key={deal.dealId}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {criticalBlocker && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Critical
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {deal.productType}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {deal.dealId}: {deal.dealName}
                    </h4>

                    {/* AI Insight */}
                    <div className="flex items-start space-x-2 mb-3 bg-purple-50 rounded-lg p-3">
                      <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        {criticalBlocker
                          ? `Critical: ${criticalBlocker.description}`
                          : `${deal.blockers.length} blocker${deal.blockers.length > 1 ? 's' : ''} - ${highBlockers.length} high priority`
                        }
                      </p>
                    </div>

                    {/* Compliance Score */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Overall Compliance</span>
                          <span className="font-medium">{deal.compliance.overall}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              deal.compliance.overall >= 80
                                ? 'bg-green-500'
                                : deal.compliance.overall >= 60
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${deal.compliance.overall}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Link
                      href={`/ai-native/deals/${deal.dealId}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
                    >
                      View Deal
                    </Link>
                    {criticalBlocker && (
                      <Link
                        href="/ai-native/tasks"
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors whitespace-nowrap"
                      >
                        Fix Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Success Story */}
          {mockDeals.find(d => d.dealId === 'deal-003') && (
            <div className="bg-white rounded-lg border border-green-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      On Track
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Ijara
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    deal-003: Ijara Muntahia Bittamleek - Aircraft Leasing
                  </h4>

                  <div className="flex items-start space-x-2 mb-3 bg-green-50 rounded-lg p-3">
                    <Sparkles className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Agent completed 8 tasks - ready for final approval. Only 1 minor item remaining (trustee report due Nov 15).
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Overall Compliance</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '96%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Link
                    href="/ai-native/deals/deal-003"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    Review
                  </Link>
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors whitespace-nowrap">
                    Approve All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Compliance Forecast */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Compliance Forecast (AI-Generated)
        </h3>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Portfolio Trend: Improving
              </h4>
              <div className="flex items-start space-x-2 mb-4 bg-blue-50 rounded-lg p-3">
                <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  At current pace, all active deals will reach 100% compliance by Nov 20.
                  Main bottleneck: Shariah reviews (avg 3 days turnaround).
                  Agent has automated 58% of controls, reducing execution time from 2 days to 4.2 hours per control.
                </p>
              </div>

              {/* Forecast Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Today (Nov 7)</span>
                  <span className="font-medium text-gray-900">{stats.averageCompliance.toFixed(1)}% avg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nov 15 (projected)</span>
                  <span className="font-medium text-green-600">92% avg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nov 20 (projected)</span>
                  <span className="font-medium text-green-700">100% avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Component Compliance Details */}
      {backendMetrics && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Component Compliance Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComponentProgressCard
              component={backendMetrics.shariah_compliance}
              color="purple"
              icon="🕌"
            />
            <ComponentProgressCard
              component={backendMetrics.jurisdiction_compliance}
              color="orange"
              icon="⚖️"
            />
            <ComponentProgressCard
              component={backendMetrics.accounting_compliance}
              color="blue"
              icon="📊"
            />
            <ComponentProgressCard
              component={backendMetrics.impact_compliance}
              color="green"
              icon="🌱"
            />
          </div>
        </section>
      )}

      {/* Monitoring & Status Cards */}
      {backendMetrics && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monitoring & Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MonitoringCard card={backendMetrics.contracts_card} icon="📄" />
            <MonitoringCard card={backendMetrics.shariah_reviews_card} icon="✓" />
            <MonitoringCard card={backendMetrics.impact_validations_card} icon="🌍" />
            <MonitoringCard card={backendMetrics.documents_card} icon="📁" />
          </div>
        </section>
      )}

      {/* Team Activity */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/tasks"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">My Tasks</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {criticalTasks.length}
            </div>
            <p className="text-xs text-gray-500">Critical tasks pending</p>
          </Link>

          <Link
            href="/mentions"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Mentions</span>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              0
            </div>
            <p className="text-xs text-gray-500">New mentions</p>
          </Link>

          <Link
            href="/notifications"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Notifications</span>
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              0
            </div>
            <p className="text-xs text-gray-500">Unread notifications</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
