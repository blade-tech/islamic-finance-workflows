/**
 * DEAL DETAIL PAGE
 * ================
 * Central hub for managing and monitoring individual deals.
 *
 * FEATURES:
 * - Deal overview with compliance status
 * - 4 component tabs (Shariah, Jurisdiction, Accounting, Impact)
 * - Component progress visualization
 * - Quick actions sidebar
 * - Navigation to contracts, reviews, documents
 *
 * INTEGRATION POINTS:
 * - From: Workflow Step 11, Dashboard active deals list
 * - To: Contract Collaboration, Reviews, Documents
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { backendClient } from '@/lib/backend-client'
import { DealConfigurationDashboard } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ComponentProgressCard } from '@/components/dashboard/ComponentProgressCard'
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
  Users,
  Clock,
  BarChart3,
  ShieldCheck,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'

// Tour components
import { ProductTour } from '@/components/onboarding/ProductTour'
import { getTourForPage, hasTourForPage } from '@/lib/page-tours'

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dealId = params?.id as string

  const [dealData, setDealData] = useState<DealConfigurationDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Tour state
  const [pageTourSteps, setPageTourSteps] = useState<any[]>([])
  const [showPageTour, setShowPageTour] = useState(false)

  useEffect(() => {
    if (dealId) {
      loadDealDetails()
    }
  }, [dealId])

  async function loadDealDetails() {
    setLoading(true)
    setError(null)
    try {
      const data = await backendClient.getDealCompliance(dealId)
      if (!data) {
        setError('Deal not found')
      } else {
        setDealData(data)
      }
    } catch (err) {
      console.error('Failed to load deal details:', err)
      setError('Failed to load deal details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Start page-specific tour
  const startPageTour = () => {
    const steps = getTourForPage('/deals/[id]')
    if (steps) {
      setPageTourSteps(steps)
      setShowPageTour(true)
    } else {
      console.log('[PageTour] No tour available for /deals/[id]')
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !dealData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <p className="font-semibold mb-2">
                  {error || 'Deal Not Found'}
                </p>
                <p className="text-sm mb-4">
                  The deal you're looking for doesn't exist or you don't have access.
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'default'
      case 'needs_attention':
        return 'destructive'
      case 'in_progress':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Compliant'
      case 'needs_attention':
        return 'Needs Attention'
      case 'in_progress':
        return 'In Progress'
      case 'not_applicable':
        return 'N/A'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" data-tour="deal-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {dealData.deal_name}
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Deal ID: {dealData.deal_id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusBadgeVariant(dealData.status)}>
                {getStatusLabel(dealData.status)}
              </Badge>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {dealData.overall_completion.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Component Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-tour="component-stats">
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🕌</div>
                    <div className="text-2xl font-bold text-purple-700">
                      {dealData.shariah_compliance.overall_completion.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Shariah Structure
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚖️</div>
                    <div className="text-2xl font-bold text-orange-700">
                      {dealData.jurisdiction_compliance.overall_completion.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Jurisdiction
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {dealData.accounting_compliance.overall_completion.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Accounting
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌱</div>
                    <div className="text-2xl font-bold text-green-700">
                      {dealData.impact_compliance ?
                        dealData.impact_compliance.overall_completion.toFixed(0)
                        : 'N/A'}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Impact Metrics
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Component Details Tabs */}
            <Card data-tour="component-tabs">
              <CardHeader>
                <CardTitle>Component Compliance Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of controls and evidence for each component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="shariah">Shariah</TabsTrigger>
                    <TabsTrigger value="jurisdiction">Jurisdiction</TabsTrigger>
                    <TabsTrigger value="accounting">Accounting</TabsTrigger>
                    <TabsTrigger value="impact">Impact</TabsTrigger>
                    <TabsTrigger value="contracts">Contracts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ComponentProgressCard
                        component={dealData.shariah_compliance}
                        color="purple"
                        icon="🕌"
                      />
                      <ComponentProgressCard
                        component={dealData.jurisdiction_compliance}
                        color="orange"
                        icon="⚖️"
                      />
                      <ComponentProgressCard
                        component={dealData.accounting_compliance}
                        color="blue"
                        icon="📊"
                      />
                      {dealData.impact_compliance && (
                        <ComponentProgressCard
                          component={dealData.impact_compliance}
                          color="green"
                          icon="🌱"
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="shariah" className="space-y-4">
                    <ComponentProgressCard
                      component={dealData.shariah_compliance}
                      color="purple"
                      icon="🕌"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <div className="text-2xl font-bold">
                              {dealData.shariah_compliance.completed_requirements}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Completed Requirements
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <div className="text-2xl font-bold">
                              {dealData.shariah_compliance.evidence_count}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Evidence Documents
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                            <div className="text-2xl font-bold">
                              {dealData.shariah_compliance.needs_attention_count}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Needs Attention
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="jurisdiction" className="space-y-4">
                    <ComponentProgressCard
                      component={dealData.jurisdiction_compliance}
                      color="orange"
                      icon="⚖️"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <div className="text-2xl font-bold">
                              {dealData.jurisdiction_compliance.completed_requirements}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Completed Requirements
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <div className="text-2xl font-bold">
                              {dealData.jurisdiction_compliance.evidence_count}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Evidence Documents
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                            <div className="text-2xl font-bold">
                              {dealData.jurisdiction_compliance.needs_attention_count}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Needs Attention
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="accounting" className="space-y-4">
                    <ComponentProgressCard
                      component={dealData.accounting_compliance}
                      color="blue"
                      icon="📊"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <div className="text-2xl font-bold">
                              {dealData.accounting_compliance.completed_requirements}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Completed Requirements
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <div className="text-2xl font-bold">
                              {dealData.accounting_compliance.evidence_count}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Evidence Documents
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                            <div className="text-2xl font-bold">
                              {dealData.accounting_compliance.needs_attention_count}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Needs Attention
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="impact" className="space-y-4">
                    {dealData.impact_compliance ? (
                      <>
                        <ComponentProgressCard
                          component={dealData.impact_compliance}
                          color="green"
                          icon="🌱"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                <div className="text-2xl font-bold">
                                  {dealData.impact_compliance.completed_requirements}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  Completed Requirements
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                <div className="text-2xl font-bold">
                                  {dealData.impact_compliance.evidence_count}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  Evidence Documents
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                                <div className="text-2xl font-bold">
                                  {dealData.impact_compliance.needs_attention_count}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  Needs Attention
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    ) : (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <div className="text-gray-400 mb-2">
                            <BarChart3 className="h-16 w-16 mx-auto" />
                          </div>
                          <p className="text-gray-600">
                            No impact metrics configured for this deal
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="contracts" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Deal Contracts</CardTitle>
                        <CardDescription>
                          Contracts associated with this deal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">
                            View all contracts for this deal in the Contracts List
                          </p>
                          <Button
                            onClick={() => router.push(`/contracts?deal=${dealId}`)}
                            className="mx-auto"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Contracts for This Deal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Deal Configuration Details */}
            <Card data-tour="deal-config">
              <CardHeader>
                <CardTitle>Deal Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Shariah Structure</div>
                    <div className="font-medium capitalize">
                      {dealData.shariah_structure.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Jurisdiction</div>
                    <div className="font-medium capitalize">
                      {dealData.jurisdiction.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Accounting Framework</div>
                    <div className="font-medium uppercase">
                      {dealData.accounting}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Impact Metrics</div>
                    <div className="font-medium capitalize">
                      {dealData.impact === 'none' ? 'None' : dealData.impact.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar - 1 column */}
          <div className="space-y-4" data-tour="quick-actions">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push(`/contracts?deal=${dealId}`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Contracts
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push('/collaboration')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Collaboration Hub
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push('/tasks')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  My Tasks
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push(`/deals/${dealId}/digital-assets`)}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Digital Assets
                </Button>
                <Button className="w-full justify-start" variant="outline" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deal Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-xs text-gray-500">
                        {new Date(dealData.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium">Last Updated</div>
                      <div className="text-xs text-gray-500">
                        {new Date(dealData.shariah_compliance.last_updated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Page-Specific Tour */}
      <ProductTour
        run={showPageTour}
        steps={pageTourSteps}
        onComplete={() => setShowPageTour(false)}
        onStateChange={(running) => !running && setShowPageTour(false)}
      />

      {/* Floating Help Button */}
      {hasTourForPage('/deals/[id]') && (
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
