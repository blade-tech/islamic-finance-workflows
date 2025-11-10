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
      issue: 'Authorization Officer approval pending for 3 Validation Certificates',
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
      recommendation: 'Automate document collection from bank system'
    }
  ]

  const workflowMetrics = [
    {
      workflowName: 'Payment Processing → Issue Payment Certificate',
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
      podName: 'Document Processing Assistant',
      executionCount: 45,
      avgDuration: '2.1 sec',
      successRate: 100,
      timeSaved: '8.5 min per run'
    },
    {
      podId: 'hcs-anchor',
      podName: 'Blockchain Recording Assistant',
      executionCount: 12,
      avgDuration: '2.3 sec',
      successRate: 100,
      timeSaved: 'N/A (automated)'
    },
    {
      podId: 'hts-mint-deliver',
      podName: 'Token Creation Assistant',
      executionCount: 12,
      avgDuration: '3.1 sec',
      successRate: 100,
      timeSaved: '15 min per run'
    }
  ]

  // Islamic GRC Risk Categories (IFSB-1, IFSB-10)
  const islamicRisks = [
    {
      id: 'sncr',
      name: 'Shariah Breach Risk',
      acronym: 'SNCR',
      level: 'Low',
      color: 'green',
      description: 'Risk of Shariah non-compliance requiring purification',
      incidents: 0,
      purificationAmount: 'QAR 0',
      standard: 'IFSB-1 §6.1-6.2'
    },
    {
      id: 'dcr',
      name: 'Profit Smoothing Risk',
      acronym: 'DCR',
      level: 'Low',
      color: 'green',
      description: 'Risk requiring PER/IRR reserve usage',
      perBalance: 'QAR 1.2M',
      irrBalance: 'QAR 800K',
      standard: 'IFSB-1 §7.1-7.2'
    },
    {
      id: 'ror',
      name: 'Profit Rate Risk',
      acronym: 'RoR',
      level: 'Medium',
      color: 'yellow',
      description: 'Investment Account Holder profit distribution fairness',
      variance: '1.2%',
      threshold: '2%',
      standard: 'IFSB-10 (Shariah Governance)'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Real-time monitoring of compliance health, Islamic risk categories, and workflow performance
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">ISO 37301 (Compliance)</Badge>
          <Badge variant="outline" className="text-xs">ISO 31000 (Risk)</Badge>
          <Badge variant="outline" className="text-xs">AAOIFI SS-9 (Ijarah)</Badge>
          <Badge variant="outline" className="text-xs">QFC DAR 2024</Badge>
        </div>
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
              <CardTitle className="text-sm font-medium text-gray-700">Waiting for Approval</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-700">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-900">{stats.overSLA}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              All on time
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

      {/* Islamic GRC Risk Categories */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Islamic Risk Categories (IFSB-1, IFSB-10)
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Real-time monitoring of Shariah-specific risk categories
              </p>
            </div>
            <Badge className="bg-green-600">All Within Policy</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {islamicRisks.map((risk) => (
              <Card key={risk.id} className={`border-2 border-${risk.color}-200 bg-${risk.color}-50`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-900">
                        {risk.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">{risk.acronym}</Badge>
                    </div>
                    <Badge className={`bg-${risk.color}-600 text-white`}>
                      {risk.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3">{risk.description}</p>
                  <div className="space-y-1 text-xs">
                    {risk.id === 'sncr' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Incidents (This Quarter):</span>
                          <span className="font-semibold text-green-700">{risk.incidents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Purification Amount:</span>
                          <span className="font-semibold text-gray-900">{risk.purificationAmount}</span>
                        </div>
                      </>
                    )}
                    {risk.id === 'dcr' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PER Balance:</span>
                          <span className="font-semibold text-gray-900">{risk.perBalance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IRR Balance:</span>
                          <span className="font-semibold text-gray-900">{risk.irrBalance}</span>
                        </div>
                      </>
                    )}
                    {risk.id === 'ror' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profit Variance:</span>
                          <span className="font-semibold text-yellow-700">{risk.variance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Policy Threshold:</span>
                          <span className="font-semibold text-gray-900">{risk.threshold}</span>
                        </div>
                      </>
                    )}
                    <div className="mt-2 pt-2 border-t">
                      <span className="text-gray-500">Standard: </span>
                      <span className="font-medium text-gray-700">{risk.standard}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-700">
              <strong>SNCR (Shariah Breach Risk):</strong> Risk of Shariah non-compliance requiring purification (donating non-compliant income to charity).
              <strong className="ml-2">DCR (Profit Smoothing Risk):</strong> Risk requiring use of Profit Equalization Reserve (PER) or Investment Risk Reserve (IRR) to smooth returns for Investment Account Holders.
              <strong className="ml-2">RoR (Profit Rate Risk):</strong> Risk of unfair profit distribution to Investment Account Holders.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Throughput Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Tasks Completed This Week
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
                AI Assistant Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {podPerformance.map(pod => (
                  <div key={pod.podId} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{pod.podName}</p>
                        <p className="text-xs text-gray-600">Used {pod.executionCount} times</p>
                      </div>
                      <Badge className="bg-green-600">{pod.successRate}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">Average Time</p>
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
                      <span className="text-gray-600">Average Time</span>
                      <span className="font-semibold text-gray-900">{workflow.avgDuration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">On-Time Performance</span>
                      <span className="font-semibold text-green-600">{workflow.slaCompliance}%</span>
                    </div>
                  </div>

                  {/* SLA Progress Bar */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">On-Time Performance Rate</p>
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
                Configure Deadline Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
