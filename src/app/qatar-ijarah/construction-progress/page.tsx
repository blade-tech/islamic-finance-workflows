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
  Circle,
  Clock,
  Upload,
  DollarSign,
  Building2,
  AlertTriangle,
  FileCheck,
  TrendingUp
} from 'lucide-react'

interface Milestone {
  id: string
  name: string
  description: string
  targetDate: string
  completionDate?: string
  status: 'completed' | 'in-progress' | 'pending'
  percentComplete: number
  disbursementAmount: number
  evidenceRequired: string[]
  evidenceUploaded: boolean
  authorityVerified: boolean
}

export default function ConstructionProgressPage() {
  const router = useRouter()
  const { currentProject, loadDemoData } = useIjarahStore()

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'ms-1',
      name: 'Foundation & Piling',
      description: 'Complete foundation work and piling for all units',
      targetDate: '2025-03-01',
      completionDate: '2025-02-28',
      status: 'completed',
      percentComplete: 100,
      disbursementAmount: 15000000,
      evidenceRequired: ['Engineer certification', 'Site photos', 'Material receipts'],
      evidenceUploaded: true,
      authorityVerified: true
    },
    {
      id: 'ms-2',
      name: 'Structural Framework',
      description: 'Complete concrete framework and structural elements',
      targetDate: '2025-06-01',
      completionDate: '2025-05-30',
      status: 'completed',
      percentComplete: 100,
      disbursementAmount: 20000000,
      evidenceRequired: ['Structural engineer report', 'Load test results', 'Progress photos'],
      evidenceUploaded: true,
      authorityVerified: true
    },
    {
      id: 'ms-3',
      name: 'Envelope & MEP Rough-in',
      description: 'Building envelope, windows, and MEP rough installation',
      targetDate: '2025-09-01',
      status: 'in-progress',
      percentComplete: 65,
      disbursementAmount: 18000000,
      evidenceRequired: ['MEP inspection report', 'Envelope test results', 'Progress certification'],
      evidenceUploaded: false,
      authorityVerified: false
    },
    {
      id: 'ms-4',
      name: 'Interior Finishes',
      description: 'Complete interior finishes, fixtures, and fittings',
      targetDate: '2025-12-01',
      status: 'pending',
      percentComplete: 0,
      disbursementAmount: 22000000,
      evidenceRequired: ['Quality inspection', 'Fire safety certification', 'Finishes approval'],
      evidenceUploaded: false,
      authorityVerified: false
    },
    {
      id: 'ms-5',
      name: 'Final Completion',
      description: 'Final completion, defects rectification, and handover',
      targetDate: '2026-01-15',
      status: 'pending',
      percentComplete: 0,
      disbursementAmount: 25000000,
      evidenceRequired: ['Completion certificate', 'Occupancy permit', 'Final inspection report'],
      evidenceUploaded: false,
      authorityVerified: false
    }
  ])

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  const handleUploadEvidence = (milestoneId: string) => {
    setMilestones(prev =>
      prev.map(ms => ms.id === milestoneId ? { ...ms, evidenceUploaded: true } : ms)
    )
  }

  const handleVerifyMilestone = (milestoneId: string) => {
    setMilestones(prev =>
      prev.map(ms => ms.id === milestoneId ? {
        ...ms,
        authorityVerified: true,
        status: 'completed' as const,
        percentComplete: 100,
        completionDate: new Date().toISOString().split('T')[0]
      } : ms)
    )
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading construction data...</p>
        </div>
      </div>
    )
  }

  const completedMilestones = milestones.filter(ms => ms.status === 'completed').length
  const totalMilestones = milestones.length
  const overallProgress = (completedMilestones / totalMilestones) * 100

  const totalDisbursed = milestones
    .filter(ms => ms.status === 'completed' && ms.authorityVerified)
    .reduce((sum, ms) => sum + ms.disbursementAmount, 0)

  const totalBudget = milestones.reduce((sum, ms) => sum + ms.disbursementAmount, 0)
  const remainingBudget = totalBudget - totalDisbursed

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Scene 3: Construction Progress</h1>
                <p className="text-sm text-gray-600">Milestone Tracking & Disbursement Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                {Math.round(overallProgress)}% Complete
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Progress Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardTitle className="flex items-center text-lg">
                  <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Milestones Completed</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {completedMilestones} / {totalMilestones}
                    </p>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(overallProgress)}%</p>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                    <p className="text-xl font-bold text-gray-900">
                      QAR {totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Disbursed to Date</p>
                    <p className="text-lg font-semibold text-green-600">
                      QAR {totalDisbursed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Remaining Budget</p>
                    <p className="text-lg font-semibold text-blue-600">
                      QAR {remainingBudget.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Disbursement Progress</p>
                  <Progress value={(totalDisbursed / totalBudget) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((totalDisbursed / totalBudget) * 100)}% of budget deployed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-sm text-purple-900">Control References</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-purple-800 font-mono mb-1">IJR-B7: Authority Disbursement</p>
                    <p className="text-sm text-purple-900">
                      QCB Circular 2/2025 Art.5 - Milestone-based fund release with authority verification.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-purple-200">
                    <p className="text-xs text-purple-800 font-mono mb-1">IJR-B8: Project Completion Gate</p>
                    <p className="text-sm text-purple-900">
                      Final completion requires RERA registration and authority sign-off.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Milestone Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-purple-600" />
                  Construction Milestones
                </CardTitle>
                <CardDescription>
                  Track progress and trigger escrow disbursements upon completion
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {milestones.map((milestone, index) => {
                    const isLast = index === milestones.length - 1
                    const canDisburse = milestone.evidenceUploaded && milestone.authorityVerified

                    return (
                      <div key={milestone.id} className="relative">
                        {!isLast && (
                          <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                        )}

                        <div className={`relative p-5 rounded-lg border-2 ${
                          milestone.status === 'completed'
                            ? 'bg-green-50 border-green-200'
                            : milestone.status === 'in-progress'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          {/* Status Icon */}
                          <div className="absolute left-5 top-5">
                            {milestone.status === 'completed' ? (
                              <CheckCircle2 className="h-10 w-10 text-green-600 bg-white rounded-full" />
                            ) : milestone.status === 'in-progress' ? (
                              <Clock className="h-10 w-10 text-blue-600 bg-white rounded-full p-2 border-2 border-blue-600" />
                            ) : (
                              <Circle className="h-10 w-10 text-gray-400 bg-white rounded-full p-2 border-2 border-gray-300" />
                            )}
                          </div>

                          <div className="ml-16">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {milestone.name}
                                </h3>
                                <p className="text-sm text-gray-600">{milestone.description}</p>
                              </div>
                              <Badge
                                variant={
                                  milestone.status === 'completed' ? 'default' :
                                  milestone.status === 'in-progress' ? 'secondary' : 'outline'
                                }
                                className="ml-4"
                              >
                                {milestone.status === 'completed' ? 'Completed' :
                                 milestone.status === 'in-progress' ? 'In Progress' : 'Pending'}
                              </Badge>
                            </div>

                            {/* Progress Bar (for in-progress milestones) */}
                            {milestone.status === 'in-progress' && (
                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <p className="text-xs text-gray-600">Construction Progress</p>
                                  <p className="text-xs font-semibold text-gray-900">{milestone.percentComplete}%</p>
                                </div>
                                <Progress value={milestone.percentComplete} className="h-2" />
                              </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Target Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {new Date(milestone.targetDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              {milestone.completionDate && (
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Completed</p>
                                  <p className="text-sm font-semibold text-green-700">
                                    {new Date(milestone.completionDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Disbursement Amount</p>
                                <p className="text-sm font-semibold text-purple-700">
                                  QAR {milestone.disbursementAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Evidence Section */}
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-2">Required Evidence:</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {milestone.evidenceRequired.map((evidence, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {evidence}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center space-x-1">
                                    {milestone.evidenceUploaded ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className={milestone.evidenceUploaded ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                      Evidence Uploaded
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {milestone.authorityVerified ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className={milestone.authorityVerified ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                      Authority Verified
                                    </span>
                                  </div>
                                </div>

                                {milestone.status !== 'completed' && (
                                  <div className="flex items-center space-x-2">
                                    {!milestone.evidenceUploaded && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUploadEvidence(milestone.id)}
                                      >
                                        <Upload className="h-4 w-4 mr-1" />
                                        Upload Evidence
                                      </Button>
                                    )}
                                    {milestone.evidenceUploaded && !milestone.authorityVerified && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleVerifyMilestone(milestone.id)}
                                        className="bg-purple-600 hover:bg-purple-700"
                                      >
                                        <FileCheck className="h-4 w-4 mr-1" />
                                        Verify & Disburse
                                      </Button>
                                    )}
                                  </div>
                                )}

                                {canDisburse && milestone.status === 'completed' && (
                                  <Badge variant="default" className="bg-green-600">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    Disbursed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Disbursements are only released after authority verification of milestone completion.
                This ensures compliance with QCB Circular 2/2025 Article 5.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
