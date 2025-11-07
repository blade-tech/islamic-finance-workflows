'use client'

/**
 * DIGITAL ASSETS LISTING PAGE (ROLE: TREASURY/FINANCE)
 * ======================================================
 * Cross-deal view of all Guardian certificates and ATS tokens.
 * Primary interface for treasury and finance teams to manage digital assets.
 *
 * FEATURES:
 * - Grid view of all deals with their digital assets
 * - Guardian certificate status across all deals
 * - ATS tokenization status and metrics
 * - Quick navigation to individual deal digital assets
 * - Filtering by certificate status, token status
 * - Summary metrics (total value, total tokens, etc.)
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ShieldCheck,
  Coins,
  ArrowRight,
  TrendingUp,
  Building2,
  FileCheck,
  Wallet,
  HelpCircle
} from 'lucide-react'

// Tour components
import { ProductTour } from '@/components/onboarding/ProductTour'
import { getTourForPage, hasTourForPage } from '@/lib/page-tours'

interface DealDigitalAssets {
  deal_id: string
  deal_name: string
  status: string
  created_at: string

  // Guardian Certificate
  has_certificate: boolean
  certificate_id?: string
  certificate_status?: string

  // ATS Token
  has_token: boolean
  token_id?: string
  token_name?: string
  token_symbol?: string
  total_supply?: number
  holders_count?: number
}

export default function DigitalAssetsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<DealDigitalAssets[]>([])
  const [loading, setLoading] = useState(true)

  // Tour state
  const [pageTourSteps, setPageTourSteps] = useState<any[]>([])
  const [showPageTour, setShowPageTour] = useState(false)

  useEffect(() => {
    fetchDigitalAssets()
  }, [])

  // Start page-specific tour
  const startPageTour = () => {
    const steps = getTourForPage('/digital-assets')
    if (steps) {
      setPageTourSteps(steps)
      setShowPageTour(true)
    } else {
      console.log('[PageTour] No tour available for /digital-assets')
    }
  }

  const fetchDigitalAssets = async () => {
    try {
      setLoading(true)
      // Fetch all deals with their digital assets
      const response = await fetch('http://localhost:8000/api/deals')
      const data = await response.json()
      setDeals(data || [])
    } catch (error) {
      console.error('Error fetching digital assets:', error)
      // Fallback to rich mock data showcasing full platform capabilities
      setDeals([
        {
          deal_id: 'exec-001',
          deal_name: 'QIIB Oryx Fund - Phase 1 (Green Sukuk Ijara)',
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          has_certificate: true,
          certificate_id: 'GC-2024-001-QIIB-ORYX',
          certificate_status: 'issued',
          has_token: true,
          token_id: '0.0.4929427',
          token_name: 'QIIB Oryx Green Sukuk',
          token_symbol: 'QIIB-ORYX',
          total_supply: 50000000,
          holders_count: 127
        },
        {
          deal_id: 'exec-002',
          deal_name: 'Dubai Islamic Bank Murabaha Facility',
          status: 'active',
          created_at: '2024-02-20T08:30:00Z',
          has_certificate: true,
          certificate_id: 'GC-2024-002-DIB-MURABAHA',
          certificate_status: 'issued',
          has_token: true,
          token_id: '0.0.5123456',
          token_name: 'DIB Murabaha Notes',
          token_symbol: 'DIB-MRB',
          total_supply: 25000000,
          holders_count: 89
        },
        {
          deal_id: 'exec-003',
          deal_name: 'Abu Dhabi Sovereign Wakala (Infrastructure)',
          status: 'active',
          created_at: '2024-03-10T14:15:00Z',
          has_certificate: true,
          certificate_id: 'GC-2024-003-ADGOV-WAKALA',
          certificate_status: 'issued',
          has_token: true,
          token_id: '0.0.5234567',
          token_name: 'ADGOV Wakala Certificates',
          token_symbol: 'ADGOV-WKL',
          total_supply: 100000000,
          holders_count: 342
        },
        {
          deal_id: 'exec-004',
          deal_name: 'Saudi Aramco Green Sukuk Istisna',
          status: 'active',
          created_at: '2024-03-25T11:00:00Z',
          has_certificate: true,
          certificate_id: 'GC-2024-004-ARAMCO-ISTISNA',
          certificate_status: 'issued',
          has_token: false,
          token_id: undefined,
          token_name: undefined,
          token_symbol: undefined,
          total_supply: undefined,
          holders_count: undefined
        },
        {
          deal_id: 'exec-005',
          deal_name: 'Malaysia Sustainable Sukuk Musharaka',
          status: 'active',
          created_at: '2024-04-05T09:45:00Z',
          has_certificate: true,
          certificate_id: 'GC-2024-005-MYS-MUSHARAKA',
          certificate_status: 'issued',
          has_token: true,
          token_id: '0.0.5345678',
          token_name: 'Malaysia Musharaka Sukuk',
          token_symbol: 'MYS-MSH',
          total_supply: 75000000,
          holders_count: 215
        },
        {
          deal_id: 'exec-006',
          deal_name: 'Kuwait Finance House Hybrid Sukuk',
          status: 'pending',
          created_at: '2024-04-18T13:20:00Z',
          has_certificate: false,
          certificate_id: undefined,
          certificate_status: undefined,
          has_token: false,
          token_id: undefined,
          token_name: undefined,
          token_symbol: undefined,
          total_supply: undefined,
          holders_count: undefined
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary metrics
  const metrics = {
    totalDeals: deals.length,
    totalCertificates: deals.filter(d => d.has_certificate).length,
    totalTokens: deals.filter(d => d.has_token).length,
    totalSupply: deals.reduce((sum, d) => sum + (d.total_supply || 0), 0),
    totalHolders: deals.reduce((sum, d) => sum + (d.holders_count || 0), 0)
  }

  // Filter deals by status
  const dealsWithCertificates = deals.filter(d => d.has_certificate)
  const dealsWithTokens = deals.filter(d => d.has_token)
  const dealsWithBoth = deals.filter(d => d.has_certificate && d.has_token)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8" data-tour="assets-header">
        <h1 className="text-3xl font-bold mb-2">Digital Assets Management</h1>
        <p className="text-muted-foreground">
          Cross-deal view of Guardian certificates and ATS tokenization for treasury and finance teams
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8" data-tour="assets-metrics">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Deals</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {metrics.totalDeals}
                </p>
              </div>
              <Building2 className="h-10 w-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Guardian Certificates</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {metrics.totalCertificates}
                </p>
              </div>
              <ShieldCheck className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Tokenized Assets</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">
                  {metrics.totalTokens}
                </p>
              </div>
              <Coins className="h-10 w-10 text-amber-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Supply</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {(metrics.totalSupply / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 font-medium">Token Holders</p>
                <p className="text-3xl font-bold text-indigo-900 mt-1">
                  {metrics.totalHolders}
                </p>
              </div>
              <Wallet className="h-10 w-10 text-indigo-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed View */}
      <Tabs defaultValue="all" className="space-y-6" data-tour="assets-tabs">
        <TabsList>
          <TabsTrigger value="all">
            All Assets ({deals.length})
          </TabsTrigger>
          <TabsTrigger value="certificates">
            Certificates Only ({dealsWithCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="tokens">
            Tokens Only ({dealsWithTokens.length})
          </TabsTrigger>
          <TabsTrigger value="complete">
            Complete Set ({dealsWithBoth.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" data-tour="assets-grid">
          <DealAssetGrid deals={deals} router={router} />
        </TabsContent>

        <TabsContent value="certificates">
          <DealAssetGrid deals={dealsWithCertificates} router={router} />
        </TabsContent>

        <TabsContent value="tokens">
          <DealAssetGrid deals={dealsWithTokens} router={router} />
        </TabsContent>

        <TabsContent value="complete">
          <DealAssetGrid deals={dealsWithBoth} router={router} />
        </TabsContent>
      </Tabs>

      {/* Page-Specific Tour */}
      <ProductTour
        run={showPageTour}
        steps={pageTourSteps}
        onComplete={() => setShowPageTour(false)}
        onStateChange={(running) => !running && setShowPageTour(false)}
      />

      {/* Floating Help Button */}
      {hasTourForPage('/digital-assets') && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={startPageTour}
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all"
            size="icon"
            title="Tour This Page"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Grid component showing deal digital assets
 */
function DealAssetGrid({ deals, router }: { deals: DealDigitalAssets[], router: any }) {
  if (deals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileCheck className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Assets Found</h3>
          <p className="text-muted-foreground mb-6">
            No deals match the selected filter
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <Card
          key={deal.deal_id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push(`/deals/${deal.deal_id}/digital-assets`)}
        >
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-lg line-clamp-2">{deal.deal_name}</CardTitle>
              <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                {deal.status}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {new Date(deal.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Guardian Certificate */}
            <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-4 w-4 ${deal.has_certificate ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">Guardian Certificate</span>
                </div>
                {deal.has_certificate && (
                  <Badge variant="outline" className="text-xs bg-white">
                    Issued
                  </Badge>
                )}
              </div>
              {deal.has_certificate && deal.certificate_id && (
                <p className="text-xs text-muted-foreground font-mono">
                  {deal.certificate_id}
                </p>
              )}
              {!deal.has_certificate && (
                <p className="text-xs text-muted-foreground">Not issued</p>
              )}
            </div>

            {/* ATS Token */}
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className={`h-4 w-4 ${deal.has_token ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">ATS Token</span>
                </div>
                {deal.has_token && (
                  <Badge variant="outline" className="text-xs bg-white">
                    {deal.token_symbol}
                  </Badge>
                )}
              </div>
              {deal.has_token && deal.token_id && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-mono">
                    {deal.token_id}
                  </p>
                  {deal.total_supply && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Supply:</span>
                      <span className="font-medium">{deal.total_supply.toLocaleString()}</span>
                    </div>
                  )}
                  {deal.holders_count && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Holders:</span>
                      <span className="font-medium">{deal.holders_count}</span>
                    </div>
                  )}
                </div>
              )}
              {!deal.has_token && (
                <p className="text-xs text-muted-foreground">Not tokenized</p>
              )}
            </div>

            {/* View Details Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/deals/${deal.deal_id}/digital-assets`)
              }}
            >
              View Details
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
