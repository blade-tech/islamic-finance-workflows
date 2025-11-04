/**
 * NOTIFICATION BELL COMPONENT
 * ===========================
 * Dropdown notification center with real-time updates.
 *
 * Features:
 * - Unread count badge
 * - Notification dropdown
 * - Mark as read/unread
 * - Delete notifications
 * - Mark all as read
 * - Notification preferences link
 * - Action buttons (view source)
 *
 * Part of: Vanta Phase A - Collaboration Features
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Settings,
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

interface NotificationBellProps {
  userEmail?: string
  refreshInterval?: number // milliseconds
}

// ============================================================================
// COMPONENT
// ============================================================================

export function NotificationBell({
  userEmail = 'current_user@example.com',
  refreshInterval = 30000 // 30 seconds
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadNotifications()

    // Set up polling for new notifications
    const interval = setInterval(loadNotifications, refreshInterval)
    return () => clearInterval(interval)
  }, [userEmail, refreshInterval])

  const loadNotifications = async () => {
    try {
      const data = await backendClient.api<{
        notifications: Notification[]
        unread_count: number
      }>(`/api/notifications?user_email=${userEmail}&limit=20`, {
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
      await backendClient.api(`/api/notifications/mark-all-read?user_email=${userEmail}`, {
        method: 'POST'
      })

      await loadNotifications()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
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
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'comment_added':
      case 'mention_in_comment':
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case 'approval_requested':
      case 'approval_granted':
      case 'approval_rejected':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'subscriber_added':
      case 'subscriber_removed':
      case 'ownership_transferred':
        return <UserPlus className="h-4 w-4 text-green-600" />
      case 'workflow_completed':
      case 'workflow_failed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
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

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllAsRead}
                className="h-7 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Link href="/notifications/preferences">
              <Button size="sm" variant="ghost" className="h-7 px-2">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`p-3 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-0.5">
                        {notification.title}
                      </h4>
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
                              className="h-6 text-xs"
                              onClick={() => {
                                setOpen(false)
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
                    <div className="flex flex-col gap-1">
                      {!notification.read ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.notification_id)}
                          className="h-6 w-6 p-0"
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.notification_id, false)}
                          className="h-6 w-6 p-0"
                          title="Mark as unread"
                        >
                          <Bell className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(notification.notification_id)}
                        className="h-6 w-6 p-0 text-red-600"
                        title="Delete"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Link href="/notifications">
                <Button variant="ghost" className="w-full" size="sm">
                  View all notifications
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
