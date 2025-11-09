'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Unlock,
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  Shield
} from 'lucide-react'

interface RetentionItem {
  id: string
  milestone: string
  amount: number
  retentionPercent: number
  retentionAmount: number
  releaseDate: string
  defectsDeadline: string
  status: 'locked' | 'inspection-pending' | 'released'
  defectsReported: number
  defectsResolved: number
}

export default function RetentionTrackerPage() {
  const router = useRouter()
  const { currentProject, loadDemoData } = useIjarahStore()

  const [retentions, setRetentions] = useState<RetentionItem[]>([
    {
      id: 'ret-1',
      milestone: 'Foundation & Piling',
      amount: 15000000,
      retentionPercent: 10,
      retentionAmount: 1500000,
      releaseDate: '2025-09-28',
      defectsDeadline: '2025-08-28',
      status: 'released',
      defectsReported: 2,
      defectsResolved: 2
    },
    {
      id: 'ret-2',
      milestone: 'Structural Framework',
      amount: 20000000,
      retentionPercent: 10,
      retentionAmount: 2000000,
      releaseDate: '2025-12-30',
      defectsDeadline: '2025-11-30',
      status: 'inspection-pending',
      defectsReported: 3,
      defectsResolved: 3
    },
    {
      id: 'ret-3',
      milestone: 'Envelope & MEP Rough-in',
      amount: 18000000,
      retentionPercent: 10,
      retentionAmount: 1800000,
      releaseDate: '2026-03-01',
      defectsDeadline: '2026-02-01',
      status: 'locked',
      defectsReported: 0,
      defectsResolved: 0
    },
    {
      id: 'ret-4',
      milestone: 'Interior Finishes',
      amount: 22000000,
      retentionPercent: 10,
      retentionAmount: 2200000,
      releaseDate: '2026-06-01',
      defectsDeadline: '2026-05-01',
      status: 'locked',
      defectsReported: 0,
      defectsResolved: 0
    },
    {
      id: 'ret-5',
      milestone: 'Final Completion',
      amount: 25000000,
      retentionPercent: 10,
      retentionAmount: 2500000,
      releaseDate: '2026-07-15',
      defectsDeadline: '2026-06-15',
      status: 'locked',
      defectsReported: 0,
      defectsResolved: 0
    }
  ])

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  const handleReleaseRetention = (retentionId: string) => {
    setRetentions(prev =>
      prev.map(ret => ret.id === retentionId ? { ...ret, status: 'released' as const } : ret)
    )
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading retention data...</p>
        </div>
      </div>
    )
  }

  const totalRetention = retentions.reduce((sum, ret) => sum + ret.retentionAmount, 0)
  const releasedRetention = retentions
    .filter(ret => ret.status === 'released')
    .reduce((sum, ret) => sum + ret.retentionAmount, 0)
  const lockedRetention = totalRetention - releasedRetention
  const releaseProgress = (releasedRetention / totalRetention) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Scene 6: Retention Tracker</h1>
                <p className="text-sm text-gray-600">QCB Circular 2/2025 Art.3 - Defects Liability Period</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Lock className="h-4 w-4 mr-1" />
                QAR {lockedRetention.toLocaleString()} Locked
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Retention Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardTitle className="flex items-center text-lg">
                  <Shield className="h-5 w-5 mr-2 text-orange-600" />
                  Retention Summary
                </CardTitle>
                <CardDescription>10% holdback per milestone</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Retention</p>
                  <p className="text-2xl font-bold text-gray-900">
                    QAR {totalRetention.toLocaleString()}
                  </p>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <Unlock className="h-4 w-4 mr-1 text-green-600" />
                      Released Retention
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      QAR {releasedRetention.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <Lock className="h-4 w-4 mr-1 text-orange-600" />
                      Locked Retention
                    </p>
                    <p className="text-lg font-semibold text-orange-600">
                      QAR {lockedRetention.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Release Progress</p>
                  <Progress value={releaseProgress} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round(releaseProgress)}% released
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Retention Breakdown</p>
                  <div className="space-y-2">
                    {retentions.map((ret) => (
                      <div key={ret.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 truncate flex-1">{ret.milestone}</span>
                        <div className="flex items-center space-x-2 ml-2">
                          {ret.status === 'released' ? (
                            <Unlock className="h-4 w-4 text-green-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-orange-600" />
                          )}
                          <span className="font-semibold text-gray-900 min-w-[80px] text-right">
                            {ret.retentionAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-sm text-orange-900">Control Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-orange-800 font-mono mb-2">IJR-B10: Retention Lock</p>
                <p className="text-sm text-orange-900 mb-3">
                  QCB Circular 2/2025 Art.3 requires retention holdback until defects liability period expires.
                </p>
                <div className="space-y-2 text-xs text-orange-800">
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>10% retention on each disbursement</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Defects liability period (typically 6 months)</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Release only after defects rectification</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Retention Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-orange-600" />
                  Retention Release Schedule
                </CardTitle>
                <CardDescription>
                  Track defects liability periods and retention releases
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {retentions.map((retention) => {
                    const today = new Date()
                    const defectsDeadline = new Date(retention.defectsDeadline)
                    const releaseDate = new Date(retention.releaseDate)
                    const daysUntilRelease = Math.ceil((releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    const isPastDefectsDeadline = today > defectsDeadline
                    const allDefectsResolved = retention.defectsReported === retention.defectsResolved

                    return (
                      <div
                        key={retention.id}
                        className={`p-5 rounded-lg border-2 ${
                          retention.status === 'released'
                            ? 'bg-green-50 border-green-200'
                            : retention.status === 'inspection-pending'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-orange-50 border-orange-200'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {retention.milestone}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Retention: QAR {retention.retentionAmount.toLocaleString()} ({retention.retentionPercent}% of {retention.amount.toLocaleString()})
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {retention.status === 'released' ? (
                              <Unlock className="h-8 w-8 text-green-600" />
                            ) : retention.status === 'inspection-pending' ? (
                              <Clock className="h-8 w-8 text-blue-600" />
                            ) : (
                              <Lock className="h-8 w-8 text-orange-600" />
                            )}
                            <Badge
                              variant={
                                retention.status === 'released' ? 'default' :
                                retention.status === 'inspection-pending' ? 'secondary' : 'outline'
                              }
                            >
                              {retention.status === 'released' ? 'Released' :
                               retention.status === 'inspection-pending' ? 'Inspection Pending' : 'Locked'}
                            </Badge>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-600">Defects Deadline</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(retention.defectsDeadline).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              {!isPastDefectsDeadline && retention.status !== 'released' && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {Math.ceil((defectsDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days remaining
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-600">Release Date</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(retention.releaseDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              {retention.status !== 'released' && daysUntilRelease > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {daysUntilRelease} days until release
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Defects Status */}
                        <div className="pt-4 border-t border-gray-200 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-700">Defects Status</p>
                            <Badge variant={allDefectsResolved ? 'default' : 'secondary'} className="text-xs">
                              {retention.defectsReported > 0 ? (
                                `${retention.defectsResolved} / ${retention.defectsReported} Resolved`
                              ) : (
                                'No Defects Reported'
                              )}
                            </Badge>
                          </div>
                          {retention.defectsReported > 0 && (
                            <Progress
                              value={(retention.defectsResolved / retention.defectsReported) * 100}
                              className="h-2"
                            />
                          )}
                        </div>

                        {/* Action / Status */}
                        <div className={`pt-4 border-t ${
                          retention.status === 'released' ? 'border-green-300' :
                          retention.status === 'inspection-pending' ? 'border-blue-300' : 'border-orange-300'
                        }`}>
                          {retention.status === 'released' && (
                            <div className="flex items-center text-green-800">
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              <span className="text-sm font-semibold">
                                Retention released to developer on {new Date(retention.releaseDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {retention.status === 'inspection-pending' && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-blue-800">
                                <Clock className="h-5 w-5 mr-2" />
                                <span className="text-sm">
                                  All defects resolved. Ready for final inspection.
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleReleaseRetention(retention.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Unlock className="h-4 w-4 mr-2" />
                                Release Retention
                              </Button>
                            </div>
                          )}

                          {retention.status === 'locked' && (
                            <div className="flex items-center text-orange-800">
                              <Lock className="h-5 w-5 mr-2" />
                              <span className="text-sm">
                                {!isPastDefectsDeadline
                                  ? `Retention locked until defects liability period expires (${Math.ceil((defectsDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days)`
                                  : 'Awaiting defects inspection'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900">
                <strong>Protection Mechanism:</strong> Retention holdbacks protect buyers and the IFI by ensuring
                the developer rectifies defects before receiving final payment. This is a mandatory requirement
                under QCB Circular 2/2025 Article 3 for all off-plan projects.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
