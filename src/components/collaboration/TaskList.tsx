/**
 * TASK LIST COMPONENT
 * ===================
 * Display and manage task assignments with status tracking.
 *
 * Features:
 * - List tasks (contract or user tasks)
 * - Create new tasks
 * - Update task status
 * - Filter by status/priority
 * - Show overdue tasks
 * - Priority-based sorting
 * - Due date tracking
 *
 * Part of: Vanta Phase A - Collaboration Features
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Calendar
} from 'lucide-react'
import { backendClient } from '@/lib/backend-client'

// ============================================================================
// TYPES
// ============================================================================

interface Task {
  task_id: string
  contract_id: string
  step_number?: number
  assignee_email: string
  assignee_name: string
  assignee_role: string
  assigner_email: string
  assigner_name: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date?: string
  status: {
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    completed_at?: string
    cancelled_at?: string
    cancellation_reason?: string
  }
  created_at: string
  updated_at: string
}

interface TaskListProps {
  contractId?: string
  userEmail?: string
  currentUserEmail?: string
  canCreateTasks?: boolean
  showCreateButton?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export function TaskList({
  contractId,
  userEmail,
  currentUserEmail = 'current_user@example.com',
  canCreateTasks = false,
  showCreateButton = true
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)

  // Create task form
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [newTaskAssigneeName, setNewTaskAssigneeName] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<string>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [creatingTask, setCreatingTask] = useState(false)

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadTasks()
  }, [contractId, userEmail, statusFilter, priorityFilter, showOverdueOnly])

  const loadTasks = async () => {
    try {
      setLoading(true)
      let url = ''
      const params = new URLSearchParams()

      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      if (showOverdueOnly) params.append('overdue_only', 'true')

      if (contractId) {
        url = `/api/contracts/${contractId}/tasks?${params}`
      } else if (userEmail) {
        url = `/api/users/${userEmail}/tasks?${params}`
      } else {
        return
      }

      const data = await backendClient.api<{ tasks: Task[] }>(url, { method: 'GET' })
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // TASK ACTIONS
  // ============================================================================

  const handleCreateTask = async () => {
    if (!newTaskTitle || !newTaskAssignee || !contractId) return

    try {
      setCreatingTask(true)
      await backendClient.api(`/api/contracts/${contractId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignee_email: newTaskAssignee,
          assignee_name: newTaskAssigneeName || newTaskAssignee,
          assignee_role: 'business_team',
          title: newTaskTitle,
          description: newTaskDescription,
          priority: newTaskPriority,
          due_date: newTaskDueDate || undefined
        })
      })

      // Reset form
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskAssignee('')
      setNewTaskAssigneeName('')
      setNewTaskPriority('medium')
      setNewTaskDueDate('')
      setCreateDialogOpen(false)

      await loadTasks()
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task. Please try again.')
    } finally {
      setCreatingTask(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await backendClient.api(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      await loadTasks()
    } catch (error) {
      console.error('Failed to update task status:', error)
      alert('Failed to update task status. Please try again.')
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'cancelled':
        return <Circle className="h-5 w-5 text-gray-400" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }

  const isOverdue = (task: Task) => {
    if (!task.due_date || task.status.status === 'completed' || task.status.status === 'cancelled') {
      return false
    }
    return new Date(task.due_date) < new Date()
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / 86400000)

    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    if (days < 7) return `Due in ${days} days`
    return date.toLocaleDateString()
  }

  const canUpdateTask = (task: Task) => {
    return task.assignee_email === currentUserEmail
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Tasks {!loading && `(${tasks.length})`}
        </h3>
        {canCreateTasks && showCreateButton && contractId && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Assign a task to a stakeholder with priority and due date.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Task description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assignee Email *</Label>
                    <Input
                      id="assignee"
                      type="email"
                      placeholder="assignee@example.com"
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee-name">Assignee Name</Label>
                    <Input
                      id="assignee-name"
                      placeholder="Full Name"
                      value={newTaskAssigneeName}
                      onChange={(e) => setNewTaskAssigneeName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTask}
                  disabled={!newTaskTitle || !newTaskAssignee || creatingTask}
                >
                  {creatingTask ? 'Creating...' : 'Create Task'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showOverdueOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowOverdueOnly(!showOverdueOnly)}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Overdue Only
        </Button>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="text-center py-8 text-sm text-gray-500">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">
            No tasks found. {canCreateTasks && 'Create a task to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                isOverdue(task) ? 'border-red-300 bg-red-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className="mt-1">
                  {getStatusIcon(task.status.status)}
                </div>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      {isOverdue(task) && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Assigned to: <span className="font-medium">{task.assignee_name}</span>
                    </span>
                    {task.due_date && (
                      <span className={`flex items-center gap-1 ${isOverdue(task) ? 'text-red-600 font-medium' : ''}`}>
                        <Calendar className="h-3 w-3" />
                        {formatDueDate(task.due_date)}
                      </span>
                    )}
                    {task.step_number !== undefined && (
                      <span>Step {task.step_number}</span>
                    )}
                  </div>

                  {/* Status Update (for assignee) */}
                  {canUpdateTask(task) && task.status.status !== 'completed' && task.status.status !== 'cancelled' && (
                    <div className="mt-3 pt-3 border-t flex gap-2">
                      {task.status.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTaskStatus(task.task_id, 'in_progress')}
                        >
                          Start Task
                        </Button>
                      )}
                      {task.status.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.task_id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Completion Info */}
                  {task.status.status === 'completed' && task.status.completed_at && (
                    <p className="text-xs text-green-600 mt-2">
                      Completed {new Date(task.status.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
