/**
 * ROLE-BASED DASHBOARD
 * ====================
 * Dynamic dashboard page for different stakeholder roles.
 *
 * Features:
 * - Role-specific views
 * - My tasks
 * - My contracts (owned + subscribed)
 * - Recent notifications
 * - Quick actions
 * - Activity feed
 *
 * Supported Roles:
 * - business-team
 * - shariah-advisor
 * - legal-counsel
 * - compliance-manager
 * - finance-team
 *
 * Part of: Vanta Phase A - Collaboration Features
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Bell,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { TaskList } from '@/components/collaboration/TaskList'
import { NotificationBell } from '@/components/collaboration/NotificationBell'
import { backendClient } from '@/lib/backend-client'
import Link from 'next/link'

// ============================================================================
// TYPES
// ============================================================================

type RoleType = 'business-team' | 'shariah-advisor' | 'legal-counsel' | 'compliance-manager' | 'finance-team'

interface DashboardStats {
  total_contracts: number
  owned_contracts: number
  subscribed_contracts: number
  pending_tasks: number
  in_progress_tasks: number
  overdue_tasks: number
  unread_notifications: number
}

interface RecentContract {
  contract_id: string
  contract_name: string
  contract_type: string
  status: string
  updated_at: string
}

// ============================================================================
// ROLE CONFIGURATION
// ============================================================================

const ROLE_CONFIG: Record<RoleType, {
  label: string
  description: string
  color: string
  icon: any
}> = {
  'business-team': {
    label: 'Business Team',
    description: 'Contract creation and business operations',
    color: 'blue',
    icon: FileText
  },
  'shariah-advisor': {
    label: 'Shariah Advisor',
    description: 'Islamic compliance review and guidance',
    color: 'green',
    icon: CheckCircle
  },
  'legal-counsel': {
    label: 'Legal Counsel',
    description: 'Legal review and regulatory compliance',
    color: 'purple',
    icon: FileText
  },
  'compliance-manager': {
    label: 'Compliance Manager',
    description: 'Regulatory compliance and monitoring',
    color: 'orange',
    icon: AlertCircle
  },
  'finance-team': {
    label: 'Finance Team',
    description: 'Financial review and approval',
    color: 'pink',
    icon: TrendingUp
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function RoleDashboardPage() {
  const params = useParams()
  const role = params?.role as RoleType
  const roleConfig = ROLE_CONFIG[role]

  const [stats, setStats] = useState<DashboardStats>({
    total_contracts: 0,
    owned_contracts: 0,
    subscribed_contracts: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
    overdue_tasks: 0,
    unread_notifications: 0
  })
  const [recentContracts, setRecentContracts] = useState<RecentContract[]>([])
  const [loading, setLoading] = useState(true)

  const currentUserEmail = 'current_user@example.com' // TODO: Get from auth

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    if (role) {
      loadDashboardData()
    }
  }, [role])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Using mock data for frontend-only deployment
      const contractsData = {
        owned: ['contract-1', 'contract-2'],
        subscribed: ['contract-3', 'contract-4', 'contract-5'],
        total: 5
      }

      const taskStats = {
        total: 8,
        pending: 3,
        in_progress: 2,
        overdue: 1
      }

      const notificationData = {
        count: 5
      }

      setStats({
        total_contracts: contractsData.total || 0,
        owned_contracts: contractsData.owned?.length || 0,
        subscribed_contracts: contractsData.subscribed?.length || 0,
        pending_tasks: taskStats.pending || 0,
        in_progress_tasks: taskStats.in_progress || 0,
        overdue_tasks: taskStats.overdue || 0,
        unread_notifications: notificationData.count || 0
      })

      // Mock recent contracts
      setRecentContracts([])

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // ROLE-SPECIFIC CONTENT
  // ============================================================================

  const getRoleSpecificActions = () => {
    switch (role) {
      case 'business-team':
        return [
          { label: 'Create Contract', href: '/contracts/new', icon: FileText },
          { label: 'View Templates', href: '/templates', icon: FileText }
        ]
      case 'shariah-advisor':
        return [
          { label: 'Review Queue', href: '/review/shariah', icon: CheckCircle },
          { label: 'Compliance Library', href: '/library/shariah', icon: FileText }
        ]
      case 'legal-counsel':
        return [
          { label: 'Legal Review', href: '/review/legal', icon: FileText },
          { label: 'Contract Templates', href: '/templates/legal', icon: FileText }
        ]
      case 'compliance-manager':
        return [
          { label: 'Compliance Dashboard', href: '/compliance', icon: AlertCircle },
          { label: 'Audit Trail', href: '/audit', icon: FileText }
        ]
      case 'finance-team':
        return [
          { label: 'Financial Review', href: '/review/finance', icon: TrendingUp },
          { label: 'Approval Queue', href: '/approvals', icon: CheckCircle }
        ]
      default:
        return []
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!roleConfig) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Role</h1>
          <p className="text-gray-600">
            The role "{role}" is not recognized. Please select a valid role.
          </p>
        </div>
      </div>
    )
  }

  const Icon = roleConfig.icon

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Icon className="h-8 w-8" />
            {roleConfig.label} Dashboard
          </h1>
          <p className="text-gray-600 mt-1">{roleConfig.description}</p>
        </div>
        <NotificationBell userEmail={currentUserEmail} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_contracts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.owned_contracts} owned, {stats.subscribed_contracts} subscribed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_tasks}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.in_progress_tasks} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue_tasks}</div>
            <p className="text-xs text-gray-500 mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread_notifications}</div>
            <p className="text-xs text-gray-500 mt-1">
              Unread notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common actions for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {getRoleSpecificActions().map((action) => {
              const ActionIcon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Button variant="outline">
                    <ActionIcon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="contracts">My Contracts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList
                userEmail={currentUserEmail}
                currentUserEmail={currentUserEmail}
                canCreateTasks={false}
                showCreateButton={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Contracts</CardTitle>
              <CardDescription>
                Contracts you own or are subscribed to
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentContracts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p>No contracts yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentContracts.map((contract) => (
                    <div
                      key={contract.contract_id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <h4 className="font-medium">{contract.contract_name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge>{contract.contract_type}</Badge>
                        <Badge variant="outline">{contract.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Activity feed coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
