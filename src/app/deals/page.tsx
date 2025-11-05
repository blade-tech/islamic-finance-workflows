'use client'

/**
 * DEALS LISTING PAGE (ROLE: OPERATORS)
 * =====================================
 * Deal lifecycle management for operators.
 * Primary interface for managing active Islamic finance deals.
 *
 * FEATURES:
 * - List all active deals with compliance status
 * - Quick access to deal details and digital assets
 * - Filtering by status, component compliance
 * - Deal performance metrics
 *
 * DATA SOURCE: /api/dashboard/deals (full DealConfiguration objects)
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ShieldCheck,
  Coins,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  AlertCircle
} from 'lucide-react'
import { backendClient } from '@/lib/backend-client'

interface Deal {
  deal_id: string
  deal_name: string
  status: string
  created_at: string
  overall_completion: number
  shariah_structure: string
  jurisdiction: string
  accounting: string
  impact: string

  // Component compliance
  shariah_compliance: {
    overall_completion: number
  }
  jurisdiction_compliance: {
    overall_completion: number
  }
  accounting_compliance: {
    overall_completion: number
  }
  impact_compliance?: {
    overall_completion: number
  }
}

export default function DealsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true)
        // Fetch deals from dashboard endpoint (full compliance data)
        const data = await backendClient.getAllDeals()
        setDeals(data || [])
      } catch (error) {
        console.error('Error fetching deals:', error)
        setDeals([])
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Deals & Digital Assets</h1>
        <p className="text-muted-foreground">
          Manage Guardian compliance certificates and ATS tokenization across all deals
        </p>
      </div>

      {/* Deals Grid */}
      {deals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Deals Found</h3>
            <p className="text-muted-foreground mb-6">Create your first deal to get started</p>
            <Button onClick={() => router.push('/')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Start New Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card
              key={deal.deal_id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/deals/${deal.deal_id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg line-clamp-2">{deal.deal_name}</CardTitle>
                  <Badge className={getStatusColor(deal.status)}>{deal.status}</Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  {new Date(deal.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Compliance Score */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Overall Compliance</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {deal.overall_completion.toFixed(0)}%
                  </span>
                </div>

                {/* Component Status Grid */}
                {(deal.shariah_compliance || deal.jurisdiction_compliance || deal.accounting_compliance) && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-purple-50 border border-purple-200">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="text-xs font-medium text-purple-700">Shariah</div>
                      </div>
                      <div className="text-sm font-bold text-purple-900">
                        {deal.shariah_compliance?.overall_completion?.toFixed(0) ?? 'N/A'}%
                      </div>
                    </div>
                    <div className="p-2 rounded bg-orange-50 border border-orange-200">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="text-xs font-medium text-orange-700">Jurisdiction</div>
                      </div>
                      <div className="text-sm font-bold text-orange-900">
                        {deal.jurisdiction_compliance?.overall_completion?.toFixed(0) ?? 'N/A'}%
                      </div>
                    </div>
                    <div className="p-2 rounded bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="text-xs font-medium text-blue-700">Accounting</div>
                      </div>
                      <div className="text-sm font-bold text-blue-900">
                        {deal.accounting_compliance?.overall_completion?.toFixed(0) ?? 'N/A'}%
                      </div>
                    </div>
                    <div className={`p-2 rounded ${deal.impact_compliance ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`text-xs font-medium ${deal.impact_compliance ? 'text-green-700' : 'text-gray-400'}`}>Impact</div>
                      </div>
                      <div className={`text-sm font-bold ${deal.impact_compliance ? 'text-green-900' : 'text-gray-400'}`}>
                        {deal.impact_compliance?.overall_completion?.toFixed(0) ?? 'N/A'}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Deal Configuration */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Structure:</span>
                    <span className="capitalize">{deal.shariah_structure.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Jurisdiction:</span>
                    <span className="capitalize">{deal.jurisdiction.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/deals/${deal.deal_id}`)
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/deals/${deal.deal_id}/digital-assets`)
                    }}
                  >
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Assets
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
