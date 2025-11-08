/**
 * DEALS LIST PAGE
 * ===============
 * Comprehensive view of all deals in the system.
 *
 * FEATURES:
 * - List of all deals with status and compliance
 * - Filter by status, product type
 * - Sort by completion, date
 * - Quick access to deal details
 * - 5-pillar compliance at-a-glance
 *
 * INTEGRATION POINTS:
 * - From: Dashboard, Navigation
 * - To: Deal detail pages (/ai-native/deals/[id])
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockDeals } from '@/lib/mock-data/deals'
import { bucketTheme } from '@/lib/control-library'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react'

export default function DealsListPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter deals based on status
  const filteredDeals = statusFilter === 'all'
    ? mockDeals
    : mockDeals.filter(deal => deal.status === statusFilter)

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        )
      case 'complete':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Complete
          </Badge>
        )
      case 'blocked':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Blocked
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get compliance status color
  const getComplianceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/ai-native')}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  All Deals
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Complete</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredDeals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No deals found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredDeals.map((deal) => (
              <Card
                key={deal.dealId}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/ai-native/deals/${deal.dealId}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">
                          {deal.dealName}
                        </CardTitle>
                        {getStatusBadge(deal.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Deal ID:</span> {deal.dealId}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Type:</span> {deal.productType}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Phase:</span> {deal.phase}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className={`text-3xl font-bold ${getComplianceColor(deal.compliance.overall)}`}>
                        {deal.compliance.overall}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Overall Compliance
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 5 Compliance Buckets Progress */}
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(bucketTheme).map(([bucketNum, bucket]) => {
                      const bucketKey = bucketNum === '1' ? 'shariah' :
                                       bucketNum === '2' ? 'regulatory' :
                                       bucketNum === '3' ? 'risk' :
                                       bucketNum === '4' ? 'financial' : 'audit'
                      const percentage = deal.compliance.buckets[bucketKey as keyof typeof deal.compliance.buckets]

                      return (
                        <div key={bucketNum} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg">{bucket.icon}</span>
                              <span className="text-xs font-medium text-gray-700">
                                {bucket.name}
                              </span>
                            </div>
                            <span className={`text-sm font-semibold ${getComplianceColor(percentage)}`}>
                              {percentage}%
                            </span>
                          </div>
                          <Progress
                            value={percentage}
                            className="h-2"
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Blockers Alert */}
                  {deal.blockers && deal.blockers.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {deal.blockers.length} blocker{deal.blockers.length !== 1 ? 's' : ''} requiring attention
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
