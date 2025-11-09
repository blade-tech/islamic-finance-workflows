'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import type { QatarIjarahControl } from '@/lib/qatar-ijarah/ijarah-controls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  TrendingUp,
  FileCheck,
  Zap,
  AlertTriangle,
  Target,
  BarChart3,
  Award
} from 'lucide-react'

export default function GRCDashboardPage() {
  const router = useRouter()
  const { currentProject, ijarahControls, loadDemoData } = useIjarahStore()

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading GRC dashboard...</p>
        </div>
      </div>
    )
  }

  // Calculate KPIs
  const totalControls = ijarahControls.length
  const shariahControls = ijarahControls.filter((c: QatarIjarahControl) => c.bucket === 1).length
  const regulatoryControls = ijarahControls.filter((c: QatarIjarahControl) => c.bucket === 2).length
  const riskControls = ijarahControls.filter((c: QatarIjarahControl) => c.bucket === 3).length

  // KPI 1: Overall GRC Health Score (composite)
  const overallHealthScore = 94  // Based on all controls passing

  // KPI 2: Control Execution Rate
  const executedControls = 15  // All controls executed in demo
  const controlExecutionRate = (executedControls / totalControls) * 100

  // KPI 3: Evidence Completeness
  const requiredEvidenceItems = 42  // Sum of all evidence requirements
  const uploadedEvidenceItems = 42  // All evidence uploaded in demo
  const evidenceCompleteness = (uploadedEvidenceItems / requiredEvidenceItems) * 100

  // KPI 4: Regulatory Compliance Score
  const qcbCompliant = 6  // All QCB controls passing
  const qfcraCompliant = 8  // All QFCRA controls passing
  const regulatoryComplianceScore = ((qcbCompliant + qfcraCompliant) / (6 + 8)) * 100

  // KPI 5: Shariah Compliance Score
  const aaoifiCompliant = 6  // All AAOIFI controls passing
  const shariahComplianceScore = (aaoifiCompliant / 6) * 100

  // KPI 6: Risk Mitigation Effectiveness
  const identifiedRisks = 8
  const mitigatedRisks = 8
  const riskMitigationEffectiveness = (mitigatedRisks / identifiedRisks) * 100

  // KPI 7: Automation Rate
  const automatableControls = ijarahControls.filter((c: QatarIjarahControl) => c.automatable).length
  const automationRate = (automatableControls / totalControls) * 100

  const kpis = [
    {
      id: 'kpi-1',
      name: 'Overall GRC Health',
      value: overallHealthScore,
      unit: '%',
      icon: Award,
      color: 'purple',
      description: 'Composite score across all GRC activities',
      trend: '+2%',
      trendPositive: true
    },
    {
      id: 'kpi-2',
      name: 'Control Execution Rate',
      value: controlExecutionRate,
      unit: '%',
      icon: CheckCircle2,
      color: 'green',
      description: `${executedControls} / ${totalControls} controls executed`,
      trend: '+100%',
      trendPositive: true
    },
    {
      id: 'kpi-3',
      name: 'Evidence Completeness',
      value: evidenceCompleteness,
      unit: '%',
      icon: FileCheck,
      color: 'blue',
      description: `${uploadedEvidenceItems} / ${requiredEvidenceItems} evidence items`,
      trend: '+100%',
      trendPositive: true
    },
    {
      id: 'kpi-4',
      name: 'Regulatory Compliance',
      value: regulatoryComplianceScore,
      unit: '%',
      icon: Shield,
      color: 'indigo',
      description: 'QCB & QFCRA requirements met',
      trend: '0%',
      trendPositive: true
    },
    {
      id: 'kpi-5',
      name: 'Shariah Compliance',
      value: shariahComplianceScore,
      unit: '%',
      icon: Target,
      color: 'emerald',
      description: 'AAOIFI standards compliance',
      trend: '0%',
      trendPositive: true
    },
    {
      id: 'kpi-6',
      name: 'Risk Mitigation',
      value: riskMitigationEffectiveness,
      unit: '%',
      icon: AlertTriangle,
      color: 'orange',
      description: `${mitigatedRisks} / ${identifiedRisks} risks mitigated`,
      trend: '0%',
      trendPositive: true
    },
    {
      id: 'kpi-7',
      name: 'Automation Rate',
      value: automationRate,
      unit: '%',
      icon: Zap,
      color: 'yellow',
      description: `${automatableControls} / ${totalControls} controls automated`,
      trend: '+93%',
      trendPositive: true
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200', icon: 'text-purple-600' },
      green: { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200', icon: 'text-green-600' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200', icon: 'text-blue-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', border: 'border-indigo-200', icon: 'text-indigo-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-200', icon: 'text-emerald-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-200', icon: 'text-orange-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200', icon: 'text-yellow-600' }
    }
    return colors[color] || colors.purple
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/qatar-ijarah')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scene 8: GRC Dashboard</h1>
                <p className="text-sm text-gray-600">7 Key Performance Indicators - Real-time Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="text-sm px-3 py-1 bg-purple-600">
                <Award className="h-4 w-4 mr-1" />
                {overallHealthScore}% Health Score
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero KPI Card */}
        <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-purple-900 mb-2">
                    {overallHealthScore}% GRC Health Score
                  </h2>
                  <p className="text-lg text-purple-700">
                    Al Khor Towers - Off-Plan Ijārah Project
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    All 15 controls passing • 100% evidence complete • Full regulatory compliance
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Excellent
                </Badge>
                <p className="text-xs text-gray-600 mt-2">Last updated: Just now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7 KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => {
            const colors = getColorClasses(kpi.color)
            const IconComponent = kpi.icon

            return (
              <Card key={kpi.id} className={`border-2 ${colors.border}`}>
                <CardHeader className={`pb-3 ${colors.bg}`}>
                  <div className="flex items-center justify-between">
                    <IconComponent className={`h-8 w-8 ${colors.icon}`} />
                    <Badge
                      variant={kpi.trendPositive ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {kpi.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {kpi.name}
                  </h3>
                  <div className="flex items-baseline space-x-1 mb-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {Math.round(kpi.value)}
                    </span>
                    <span className="text-lg text-gray-600">{kpi.unit}</span>
                  </div>
                  <Progress value={kpi.value} className="h-2 mb-2" />
                  <p className="text-xs text-gray-600">{kpi.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Control Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Controls by Bucket
              </CardTitle>
              <CardDescription>Distribution across Shariah, Regulatory, and Risk</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm font-semibold text-gray-700">Bucket 1: Shariah</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{shariahControls} controls</span>
                  </div>
                  <Progress value={(shariahControls / totalControls) * 100} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    AAOIFI SS-9, FAS-28 compliance
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">Bucket 2: Regulatory</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{regulatoryControls} controls</span>
                  </div>
                  <Progress value={(regulatoryControls / totalControls) * 100} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    QCB Circular 2/2025, QFCRA IBANK compliance
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                      <span className="text-sm font-semibold text-gray-700">Bucket 3: Risk</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{riskControls} controls</span>
                  </div>
                  <Progress value={(riskControls / totalControls) * 100} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    Operational risk, fraud prevention, data integrity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                Automation Highlights
              </CardTitle>
              <CardDescription>Controls with automated execution & validation</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Rent Gating</p>
                      <p className="text-xs text-gray-600">IJR-A1: Auto-blocks rent until delivery</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Auto</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Escrow Reconciliation</p>
                      <p className="text-xs text-gray-600">IJR-B6: Real-time payment verification</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-blue-600">Auto</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Charity Allocation</p>
                      <p className="text-xs text-gray-600">IJR-A3: Late payments → charity</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-purple-600">Auto</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Contract Validation</p>
                      <p className="text-xs text-gray-600">IJR-A2: Tri-party structure checks</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-indigo-600">Auto</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Retention Tracking</p>
                      <p className="text-xs text-gray-600">IJR-B10: Auto-release after defects period</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-orange-600">Auto</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Achievements */}
        <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <Award className="h-6 w-6 mr-2 text-green-600" />
              GRC Transformation Achieved
            </CardTitle>
            <CardDescription className="text-green-700">
              Click-click-click pain relief through automated workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600 mb-1">95%</p>
                <p className="text-sm text-gray-700">Time Savings</p>
                <p className="text-xs text-gray-600 mt-1">vs. manual compliance</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600 mb-1">100%</p>
                <p className="text-sm text-gray-700">Evidence Traceability</p>
                <p className="text-xs text-gray-600 mt-1">Audit-ready at all times</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600 mb-1">Zero</p>
                <p className="text-sm text-gray-700">Compliance Breaches</p>
                <p className="text-xs text-gray-600 mt-1">Automated hard gates</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600 mb-1">Real-time</p>
                <p className="text-sm text-gray-700">Risk Visibility</p>
                <p className="text-xs text-gray-600 mt-1">Live dashboard monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
