/**
 * NOTIFICATIONS PAGE
 * ==================
 * Full page view of all user notifications.
 *
 * Features:
 * - List all notifications with filters
 * - Mark as read/unread
 * - Delete notifications
 * - Mark all as read
 * - Filter by unread only
 * - Search notifications
 * - Pagination
 *
 * Route: /notifications
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bell,
  BellOff,
  Check,
  X,
  Search,
  Settings,
  CheckCheck,
  Filter,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  UserPlus,
  FileText
} from 'lucide-react'
import { backendClient } from '@/lib/backend-client'
import Link from 'next/link'

// ============================================================================
// TYPES
// ============================================================================

interface Notification {
  notification_id: string
  recipient_email: string
  type:
    | 'contract_created'
    | 'contract_updated'
    | 'approval_requested'
    | 'approval_granted'
    | 'approval_rejected'
    | 'task_assigned'
    | 'task_completed'
    | 'task_overdue'
    | 'comment_added'
    | 'mention_in_comment'
    | 'workflow_completed'
    | 'workflow_failed'
    | 'subscriber_added'
    | 'subscriber_removed'
    | 'ownership_transferred'
  title: string
  message: string
  source_contract_id: string
  source_task_id?: string
  source_comment_id?: string
  source_user_email?: string
  read: boolean
  read_at?: string
  action_url?: string
  action_label?: string
  created_at: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const currentUserEmail = 'current_user@example.com' // TODO: Get from auth

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [notifications, searchQuery, showUnreadOnly, typeFilter])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await backendClient.api<{
        notifications: Notification[]
        unread_count: number
      }>(`/api/notifications?user_email=${currentUserEmail}&limit=100`, {
        method: 'GET'
      })

      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...notifications]

    // Filter by unread
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.read)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      )
    }

    setFilteredNotifications(filtered)
  }

  // ============================================================================
  // NOTIFICATION ACTIONS
  // ============================================================================

  const handleMarkAsRead = async (notificationId: string, read: boolean = true) => {
    try {
      await backendClient.api(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read })
      })

      await loadNotifications()
    } catch (error) {
      console.error('Failed to mark notification:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await backendClient.api(`/api/notifications/mark-all-read?user_email=${currentUserEmail}`, {
        method: 'POST'
      })

      await loadNotifications()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    if (!confirm('Delete this notification?')) return

    try {
      await backendClient.api(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      await loadNotifications()
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
      case 'task_completed':
      case 'task_overdue':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'comment_added':
      case 'mention_in_comment':
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      case 'approval_requested':
      case 'approval_granted':
      case 'approval_rejected':
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case 'subscriber_added':
      case 'subscriber_removed':
      case 'ownership_transferred':
        return <UserPlus className="h-5 w-5 text-green-600" />
      case 'workflow_completed':
      case 'workflow_failed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <Link href="/notifications/preferences">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-gray-500">All notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <BellOff className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <p className="text-xs text-gray-500">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered</CardTitle>
            <Filter className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredNotifications.length}</div>
            <p className="text-xs text-gray-500">Current view</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="task_assigned">Task Assigned</SelectItem>
                <SelectItem value="task_completed">Task Completed</SelectItem>
                <SelectItem value="comment_added">Comment Added</SelectItem>
                <SelectItem value="mention_in_comment">Mentioned</SelectItem>
                <SelectItem value="approval_requested">Approval Requested</SelectItem>
                <SelectItem value="workflow_completed">Workflow Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Unread Toggle */}
            <Button
              variant={showUnreadOnly ? 'default' : 'outline'}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              {showUnreadOnly ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
              Unread Only
            </Button>

            {/* Mark All Read */}
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {showUnreadOnly ? 'Unread Notifications' : 'All Notifications'}
          </CardTitle>
          <CardDescription>
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || typeFilter !== 'all' || showUnreadOnly
                  ? 'No notifications match your filters'
                  : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(notification.created_at)}
                        </span>
                        {notification.action_url && notification.action_label && (
                          <Link href={notification.action_url}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => {
                                if (!notification.read) {
                                  handleMarkAsRead(notification.notification_id)
                                }
                              }}
                            >
                              {notification.action_label}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!notification.read ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.notification_id)}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.notification_id, false)}
                          title="Mark as unread"
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(notification.notification_id)}
                        className="text-red-600"
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
