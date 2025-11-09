'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react'

export default function BigPictureMapPage() {
  // Mock data
  const stats = {
    openTasks: 8,
    blockedTasks: 2,
    overSLA: 0,
    criticalTasks: 1,
    completedToday: 3,
    completedThisWeek: 12,
    avgProcessingTime: '4.2 hours',
    slaComplianceRate: 98.5
  }

  const throughputData = [
    { date: 'Mon', completed: 2, blocked: 0 },
    { date: 'Tue', completed: 3, blocked: 1 },
    { date: 'Wed', completed: 2, blocked: 0 },
    { date: 'Thu', completed: 3, blocked: 1 },
    { date: 'Fri', completed: 2, blocked: 0 }
  ]

  const topBlockers = [
    {
      id: 1,
      issue: 'Validator approval pending for 3 CoV-VCs',
      count: 3,
      severity: 'high',
      avgWaitTime: '2.5 hours',
      recommendation: 'Assign backup validator during peak hours'
    },
    {
      id: 2,
      issue: 'Missing bank proof documents',
      count: 2,
      severity: 'medium',
      avgWaitTime: '4 hours',
      recommendation: 'Automate evidence intake from banking API'
    }
  ]

  const workflowMetrics = [
    {
      workflowName: 'Payment Processing → PET Minting (Track A)',
      totalRuns: 15,
      completed: 12,
      blocked: 2,
      failed: 0,
      running: 1,
      avgDuration: '4.2 hours',
      slaCompliance: 98.5,
      trend: 'up'
    }
  ]

  const podPerformance = [
    {
      podId: 'evidence-intake',
      podName: 'Evidence Intake Pod',
      executionCount: 45,
      avgDuration: '2.1 sec',
      successRate: 100,
      timeSaved: '8.5 min per run'
    },
    {
      podId: 'hcs-anchor',
      podName: 'HCS Anchor Pod',
      executionCount: 12,
      avgDuration: '2.3 sec',
      successRate: 100,
      timeSaved: 'N/A (automated)'
    },
    {
      podId: 'hts-mint-deliver',
      podName: 'HTS Mint & Deliver Pod',
      executionCount: 12,
      avgDuration: '3.1 sec',
      successRate: 100,
      timeSaved: '15 min per run'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Big Picture Map</h2>
        <p className="text-sm text-gray-600 mt-1">
          High-level view of workflow health, bottlenecks, and performance
        </p>
      </div>

      {/* Top 4 Tiles */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">Open Tasks</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-900">{stats.openTasks}</p>
            <p className="text-xs text-gray-600 mt-1">Across all workflows</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">Blocked (HITL)</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-900">{stats.blockedTasks}</p>
            <p className="text-xs text-gray-600 mt-1">Waiting for human approval</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">Over SLA</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-900">{stats.overSLA}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              All within SLA
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">Critical Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-900">{stats.criticalTasks}</p>
            <p className="text-xs text-gray-600 mt-1">High priority items</p>
          </CardContent>
        </Card>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Throughput Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Weekly Throughput
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {throughputData.map((day, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{day.date}</span>
                      <span className="text-sm text-gray-600">{day.completed} completed</span>
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="h-8 bg-green-500 rounded"
                        style={{ width: `${(day.completed / 5) * 100}%` }}
                        title={`${day.completed} completed`}
                      />
                      {day.blocked > 0 && (
                        <div
                          className="h-8 bg-orange-400 rounded"
                          style={{ width: `${(day.blocked / 5) * 100}%` }}
                          title={`${day.blocked} blocked`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-400 rounded mr-2" />
                    <span className="text-gray-600">Blocked</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{stats.completedThisWeek} total</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pod Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                AI Pod Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {podPerformance.map(pod => (
                  <div key={pod.podId} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{pod.podName}</p>
                        <p className="text-xs text-gray-600">Executed {pod.executionCount} times</p>
                      </div>
                      <Badge className="bg-green-600">{pod.successRate}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">Avg Duration</p>
                        <p className="font-semibold text-gray-900">{pod.avgDuration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time Saved</p>
                        <p className="font-semibold text-purple-700">{pod.timeSaved}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Blockers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Top Blockers (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBlockers.map((blocker, idx) => (
                  <div key={blocker.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg font-bold text-orange-900">#{idx + 1}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{blocker.issue}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {blocker.count} instances
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                blocker.severity === 'high' ? 'bg-red-600' : 'bg-yellow-600'
                              }`}
                            >
                              {blocker.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-orange-300">
                      <p className="text-xs text-gray-600">Avg Wait Time</p>
                      <p className="text-sm font-semibold text-orange-900 mb-2">{blocker.avgWaitTime}</p>
                      <div className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-700">
                          <strong>Recommendation:</strong> {blocker.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workflow Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Workflow Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workflowMetrics.map(workflow => (
                <div key={workflow.workflowName} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{workflow.workflowName}</p>
                      <p className="text-xs text-gray-600">{workflow.totalRuns} total runs</p>
                    </div>
                    {workflow.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>

                  {/* Status Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold text-green-600">{workflow.completed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Blocked</span>
                      <span className="font-semibold text-orange-600">{workflow.blocked}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Running</span>
                      <span className="font-semibold text-blue-600">{workflow.running}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Failed</span>
                      <span className="font-semibold text-red-600">{workflow.failed}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Avg Duration</span>
                      <span className="font-semibold text-gray-900">{workflow.avgDuration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">SLA Compliance</span>
                      <span className="font-semibold text-green-600">{workflow.slaCompliance}%</span>
                    </div>
                  </div>

                  {/* SLA Progress Bar */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">SLA Compliance Rate</p>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-600 rounded-full"
                        style={{ width: `${workflow.slaCompliance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Weekly Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                View All Metrics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Configure SLA Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
