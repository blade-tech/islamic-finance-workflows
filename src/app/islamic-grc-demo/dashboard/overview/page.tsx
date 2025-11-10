'use client'

/**
 * OVERVIEW DASHBOARD
 * ==================
 * Executive view with high-level metrics and Islamic GRC indicators
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  FileText,
  DollarSign,
  Activity,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

// Mock data
const DASHBOARD_METRICS = {
  activeWorkflows: 3,
  totalTasks: 47,
  completedTasks: 21,
  overdueItems: 2,
  hardGatesCleared: 8,
  totalHardGates: 12,
  shariahCompliance: 100,
  sncr: {
    incidents: 0,
    lastReview: '2025-11-09',
    status: 'compliant' as const,
  },
  ssb: {
    lastMeeting: '2025-10-15',
    nextMeeting: '2025-12-15',
    pendingApprovals: 1,
  },
  regulatoryReporting: {
    qcb: { status: 'current', lastSubmission: '2025-10-31' },
    qfcra: { status: 'current', lastSubmission: '2025-10-31' },
    aaoifi: { status: 'current', lastSubmission: '2025-09-30' },
  },
}

const WORKFLOW_SUMMARY = [
  {
    name: 'Ijarah Off-Plan Construction',
    product: 'Ijarah',
    progress: 58,
    status: 'on-track',
    dueDate: '2025-12-13',
    criticalIssues: 0,
  },
  {
    name: 'Murabaha Trade Finance',
    product: 'Murabaha',
    progress: 42,
    status: 'on-track',
    dueDate: '2025-12-20',
    criticalIssues: 0,
  },
  {
    name: 'Mudaraba Investment Fund',
    product: 'Mudaraba',
    progress: 25,
    status: 'at-risk',
    dueDate: '2025-12-28',
    criticalIssues: 1,
  },
]

const ISLAMIC_RISK_CATEGORIES = [
  {
    name: 'SNCR (Shariah Non-Compliance Risk)',
    level: 'low',
    incidents: 0,
    lastIncident: 'None',
    mitigation: 'Active monitoring',
  },
  {
    name: 'DCR (Displaced Commercial Risk)',
    level: 'medium',
    value: 'PER/IRR ratio: 2.5%',
    status: 'Within limits',
    mitigation: 'PER reserves adequate',
  },
  {
    name: 'RoR (Rate-of-Return Risk)',
    level: 'low',
    value: 'IAH profit rate: 4.2%',
    status: 'Fair distribution',
    mitigation: 'Quarterly review active',
  },
]

const RECENT_ACTIVITY = [
  {
    event: 'SSB Resolution Approved',
    product: 'Ijarah Off-Plan',
    timestamp: '2 hours ago',
    type: 'approval',
  },
  {
    event: 'Asset Delivery Completed',
    product: 'Ijarah Off-Plan',
    timestamp: '5 hours ago',
    type: 'milestone',
  },
  {
    event: 'SNCR Register Updated',
    product: 'All Products',
    timestamp: '1 day ago',
    type: 'compliance',
  },
  {
    event: 'QCB Reporting Submitted',
    product: 'All Products',
    timestamp: '2 days ago',
    type: 'regulatory',
  },
]

export default function OverviewDashboardPage() {
  const completionRate = Math.round(
    (DASHBOARD_METRICS.completedTasks / DASHBOARD_METRICS.totalTasks) * 100
  )

  const hardGateProgress = Math.round(
    (DASHBOARD_METRICS.hardGatesCleared / DASHBOARD_METRICS.totalHardGates) * 100
  )

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <Badge className="bg-purple-600">Active</Badge>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {DASHBOARD_METRICS.activeWorkflows}
            </div>
            <div className="text-xs text-purple-700 mt-1">Active Workflows</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                {completionRate}%
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {DASHBOARD_METRICS.completedTasks}/{DASHBOARD_METRICS.totalTasks}
            </div>
            <div className="text-xs text-blue-700 mt-1">Tasks Completed</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-600">
                {hardGateProgress}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {DASHBOARD_METRICS.hardGatesCleared}/{DASHBOARD_METRICS.totalHardGates}
            </div>
            <div className="text-xs text-green-700 mt-1">Hard Gates Cleared</div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${DASHBOARD_METRICS.overdueItems > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className={`h-5 w-5 ${DASHBOARD_METRICS.overdueItems > 0 ? 'text-red-600' : 'text-gray-400'}`} />
              {DASHBOARD_METRICS.overdueItems > 0 && (
                <Badge className="bg-red-600">Alert</Badge>
              )}
            </div>
            <div className={`text-2xl font-bold ${DASHBOARD_METRICS.overdueItems > 0 ? 'text-red-900' : 'text-gray-600'}`}>
              {DASHBOARD_METRICS.overdueItems}
            </div>
            <div className={`text-xs mt-1 ${DASHBOARD_METRICS.overdueItems > 0 ? 'text-red-700' : 'text-gray-600'}`}>
              Overdue Items
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shariah Compliance & Governance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shariah Compliance Status */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-green-600" />
              Shariah Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-900 mb-2">
                {DASHBOARD_METRICS.shariahCompliance}%
              </div>
              <Badge className="bg-green-600">Fully Compliant</Badge>
            </div>

            {/* SNCR Status */}
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  SNCR Incidents
                </span>
                <Badge className="bg-green-600">{DASHBOARD_METRICS.sncr.incidents}</Badge>
              </div>
              <p className="text-xs text-gray-600">
                Last review: {DASHBOARD_METRICS.sncr.lastReview}
              </p>
            </div>

            {/* SSB Meeting Status */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-900">
                  Shariah Board
                </span>
                {DASHBOARD_METRICS.ssb.pendingApprovals > 0 && (
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    {DASHBOARD_METRICS.ssb.pendingApprovals} pending
                  </Badge>
                )}
              </div>
              <div className="text-xs text-purple-800 space-y-1">
                <p>Last meeting: {DASHBOARD_METRICS.ssb.lastMeeting}</p>
                <p>Next meeting: {DASHBOARD_METRICS.ssb.nextMeeting}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Reporting */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-blue-600" />
              Regulatory Reporting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* QCB */}
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  Qatar Central Bank (QCB)
                </span>
                <Badge className="bg-green-600">Current</Badge>
              </div>
              <p className="text-xs text-gray-600">
                Last submission: {DASHBOARD_METRICS.regulatoryReporting.qcb.lastSubmission}
              </p>
            </div>

            {/* QFCRA */}
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  QFCRA IBANK
                </span>
                <Badge className="bg-green-600">Current</Badge>
              </div>
              <p className="text-xs text-gray-600">
                Last submission: {DASHBOARD_METRICS.regulatoryReporting.qfcra.lastSubmission}
              </p>
            </div>

            {/* AAOIFI */}
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  AAOIFI Financial Statements
                </span>
                <Badge className="bg-green-600">Current</Badge>
              </div>
              <p className="text-xs text-gray-600">
                Last submission: {DASHBOARD_METRICS.regulatoryReporting.aaoifi.lastSubmission}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Islamic Risk Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Islamic Risk Categories (IFSB-1)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ISLAMIC_RISK_CATEGORIES.map((risk) => {
              const levelColor =
                risk.level === 'low'
                  ? 'bg-green-50 border-green-200'
                  : risk.level === 'medium'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'

              const levelBadge =
                risk.level === 'low'
                  ? 'bg-green-600'
                  : risk.level === 'medium'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'

              return (
                <div key={risk.name} className={`p-4 rounded-lg border-2 ${levelColor}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 flex-1">
                      {risk.name}
                    </h4>
                    <Badge className={levelBadge}>
                      {risk.level}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    {'incidents' in risk && (
                      <p>Incidents: {risk.incidents}</p>
                    )}
                    {'value' in risk && <p>{risk.value}</p>}
                    {'status' in risk && <p>Status: {risk.status}</p>}
                    <p className="text-gray-600 italic">{risk.mitigation}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {WORKFLOW_SUMMARY.map((workflow) => (
              <div
                key={workflow.name}
                className="p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {workflow.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Badge variant="outline">{workflow.product}</Badge>
                      <span>Due: {workflow.dueDate}</span>
                      {workflow.criticalIssues > 0 && (
                        <Badge className="bg-red-600">
                          {workflow.criticalIssues} issues
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={
                      workflow.status === 'on-track'
                        ? 'bg-green-600'
                        : 'bg-orange-600'
                    }
                  >
                    {workflow.status === 'on-track' ? 'On Track' : 'At Risk'}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {workflow.progress}%
                    </span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((activity, idx) => {
              const typeConfig = {
                approval: { icon: CheckCircle2, color: 'text-green-600' },
                milestone: { icon: TrendingUp, color: 'text-blue-600' },
                compliance: { icon: Shield, color: 'text-purple-600' },
                regulatory: { icon: FileText, color: 'text-orange-600' },
              }

              const config = typeConfig[activity.type as keyof typeof typeConfig]
              const Icon = config.icon

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.event}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <span>{activity.product}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
