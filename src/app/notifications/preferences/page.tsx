/**
 * NOTIFICATION PREFERENCES PAGE
 * =============================
 * Configure notification delivery and event type preferences.
 *
 * Features:
 * - Enable/disable all notifications
 * - Configure delivery channels (email, in-app, webhook)
 * - Set notification frequency (real-time, daily, weekly digest)
 * - Toggle individual event types
 * - Save preferences
 *
 * Route: /notifications/preferences
 */

'use client'

import { useState, useEffect } from 'react'
import { CollaborationNav } from '@/components/layout/CollaborationNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { Separator } from '@/components/ui/separator'
import {
  Bell,
  Mail,
  Monitor,
  Globe,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { backendClient } from '@/lib/backend-client'
import Link from 'next/link'

// ============================================================================
// TYPES
// ============================================================================

interface NotificationPreferences {
  enabled: boolean
  channels: {
    email: boolean
    in_app: boolean
    webhook?: string
  }
  frequency: 'real_time' | 'daily_digest' | 'weekly_digest'
  contract_updates: boolean
  approval_requests: boolean
  task_assignments: boolean
  comments_mentions: boolean
  workflow_completion: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    channels: {
      email: true,
      in_app: true,
      webhook: undefined
    },
    frequency: 'real_time',
    contract_updates: true,
    approval_requests: true,
    task_assignments: true,
    comments_mentions: true,
    workflow_completion: true
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const currentUserEmail = 'current_user@example.com' // TODO: Get from auth

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      setLoading(true)
      const data = await backendClient.api<{ preferences: NotificationPreferences }>(
        `/api/notifications/preferences?user_email=${currentUserEmail}`,
        { method: 'GET' }
      )

      if (data.preferences) {
        setPreferences(data.preferences)
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // SAVE PREFERENCES
  // ============================================================================

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveSuccess(false)
      setSaveError(null)

      await backendClient.api('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: preferences
        })
      })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
      setSaveError('Failed to save preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ============================================================================
  // UPDATE HANDLERS
  // ============================================================================

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateChannel = (channel: keyof typeof preferences.channels, value: any) => {
    setPreferences(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: value
      }
    }))
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="text-center py-12 text-gray-500">
          Loading preferences...
        </div>
      </div>
    )
  }

  return (
    <>
      <CollaborationNav />
      <div className="container mx-auto py-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/notifications">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Notification Preferences
            </h1>
          </div>
          <p className="text-gray-600">
            Configure how and when you receive notifications
          </p>
        </div>
      </div>

      {/* Save Success/Error Messages */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800">Preferences saved successfully!</p>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{saveError}</p>
        </div>
      )}

      {/* Master Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Master Control</CardTitle>
          <CardDescription>
            Enable or disable all notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Notifications</Label>
              <p className="text-sm text-gray-500">
                Turn off to stop receiving all notifications
              </p>
            </div>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={(checked) => updatePreference('enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Channels</CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.channels.email}
              onCheckedChange={(checked) => updateChannel('email', checked)}
              disabled={!preferences.enabled}
            />
          </div>

          <Separator />

          {/* In-App */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Monitor className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="space-y-0.5">
                <Label className="text-base">In-App Notifications</Label>
                <p className="text-sm text-gray-500">
                  Show notifications in the notification bell
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.channels.in_app}
              onCheckedChange={(checked) => updateChannel('in_app', checked)}
              disabled={!preferences.enabled}
            />
          </div>

          <Separator />

          {/* Webhook */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <Label className="text-base">Webhook URL (Optional)</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Send notifications to a webhook endpoint
                </p>
                <Input
                  type="url"
                  placeholder="https://your-webhook.com/endpoint"
                  value={preferences.channels.webhook || ''}
                  onChange={(e) => updateChannel('webhook', e.target.value || undefined)}
                  disabled={!preferences.enabled}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>
            Control how often you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>Frequency</Label>
            <Select
              value={preferences.frequency}
              onValueChange={(value: any) => updatePreference('frequency', value)}
              disabled={!preferences.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real_time">Real-time (as they happen)</SelectItem>
                <SelectItem value="daily_digest">Daily Digest (once per day)</SelectItem>
                <SelectItem value="weekly_digest">Weekly Digest (once per week)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {preferences.frequency === 'real_time' && 'Receive notifications immediately as events occur'}
              {preferences.frequency === 'daily_digest' && 'Receive a summary of notifications once per day'}
              {preferences.frequency === 'weekly_digest' && 'Receive a weekly summary of all notifications'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Event Types */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
          <CardDescription>
            Choose which types of events trigger notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Contract Updates</Label>
              <p className="text-sm text-gray-500">
                When contracts are created or modified
              </p>
            </div>
            <Switch
              checked={preferences.contract_updates}
              onCheckedChange={(checked) => updatePreference('contract_updates', checked)}
              disabled={!preferences.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Approval Requests</Label>
              <p className="text-sm text-gray-500">
                When your approval is requested or given
              </p>
            </div>
            <Switch
              checked={preferences.approval_requests}
              onCheckedChange={(checked) => updatePreference('approval_requests', checked)}
              disabled={!preferences.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Task Assignments</Label>
              <p className="text-sm text-gray-500">
                When tasks are assigned to you or completed
              </p>
            </div>
            <Switch
              checked={preferences.task_assignments}
              onCheckedChange={(checked) => updatePreference('task_assignments', checked)}
              disabled={!preferences.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Comments & Mentions</Label>
              <p className="text-sm text-gray-500">
                When someone comments or @mentions you
              </p>
            </div>
            <Switch
              checked={preferences.comments_mentions}
              onCheckedChange={(checked) => updatePreference('comments_mentions', checked)}
              disabled={!preferences.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Workflow Completion</Label>
              <p className="text-sm text-gray-500">
                When workflows complete or fail
              </p>
            </div>
            <Switch
              checked={preferences.workflow_completion}
              onCheckedChange={(checked) => updatePreference('workflow_completion', checked)}
              disabled={!preferences.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Link href="/notifications">
          <Button variant="outline">
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
    </>
  )
}
