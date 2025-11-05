/**
 * USER TASKS PAGE
 * ===============
 * Comprehensive view of all tasks assigned to the current user.
 *
 * Features:
 * - List all user tasks
 * - Filter by status/priority
 * - Show overdue tasks
 * - Task statistics
 * - Update task status
 * - Group by contract
 *
 * Route: /tasks
 */

'use client'

import { useState, useEffect } from 'react'
import { CollaborationNav } from '@/components/layout/CollaborationNav'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  Filter
} from 'lucide-react'
import { TaskList } from '@/components/collaboration/TaskList'
import { backendClient } from '@/lib/backend-client'

// ============================================================================
// TYPES
// ============================================================================

interface TaskStats {
  total: number
  pending: number
  in_progress: number
  completed: number
  cancelled: number
  overdue: number
  due_today: number
  due_this_week: number
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function UserTasksPage() {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
    due_today: 0,
    due_this_week: 0
  })
  const [loading, setLoading] = useState(true)

  const currentUserEmail = 'current_user@example.com' // TODO: Get from auth

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadTaskStats()
  }, [])

  const loadTaskStats = async () => {
    try {
      setLoading(true)
      const data = await backendClient.api<TaskStats>(
        `/api/users/${currentUserEmail}/tasks/stats`,
        { method: 'GET' }
      )

      setStats(data)
    } catch (error) {
      console.error('Failed to load task stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getCompletionRate = () => {
    if (stats.total === 0) return 0
    return Math.round((stats.completed / stats.total) * 100)
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <CollaborationNav />
      <div className="container mx-auto py-8 max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CheckCircle className="h-8 w-8" />
          My Tasks
        </h1>
        <p className="text-gray-600 mt-1">
          Track and manage all your assigned tasks
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">
              {stats.pending} pending, {stats.in_progress} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-gray-500">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.due_this_week}</div>
            <p className="text-xs text-gray-500">
              {stats.due_today} due today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getCompletionRate()}%</div>
            <p className="text-xs text-gray-500">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{stats.in_progress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Lists by Status */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Tasks ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
            Overdue ({stats.overdue})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({stats.in_progress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completed})
          </TabsTrigger>
        </TabsList>

        {/* All Tasks */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>
                All tasks assigned to you across all contracts
              </CardDescription>
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

        {/* Overdue Tasks */}
        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Overdue Tasks
              </CardTitle>
              <CardDescription>
                Tasks that have passed their due date and require immediate attention
              </CardDescription>
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

        {/* Pending Tasks */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>
                Tasks that haven't been started yet
              </CardDescription>
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

        {/* In Progress Tasks */}
        <TabsContent value="in_progress">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Tasks</CardTitle>
              <CardDescription>
                Tasks you're currently working on
              </CardDescription>
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

        {/* Completed Tasks */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>
                Tasks you've finished
              </CardDescription>
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
      </Tabs>

      {/* Quick Filters Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Status Filters</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Use tabs to filter by task status</li>
                <li>• Each task list has additional filters available</li>
                <li>• Filter by priority: low, medium, high, critical</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Due Date Tracking</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Red badge indicates overdue tasks</li>
                <li>• Orange text shows tasks due this week</li>
                <li>• Click "Overdue Only" button in task list for quick filter</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
