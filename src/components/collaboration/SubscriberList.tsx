/**
 * SUBSCRIBER LIST COMPONENT
 * =========================
 * Display and manage contract subscribers with notification preferences.
 *
 * Features:
 * - List all subscribers with roles
 * - Add new subscribers (owner only)
 * - Remove subscribers (owner or self)
 * - Display notification preferences
 * - Show contract owner
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
import { Badge } from '@/components/ui/badge'
import { X, UserPlus, Mail, Bell, BellOff } from 'lucide-react'
import { backendClient } from '@/lib/backend-client'

// ============================================================================
// TYPES
// ============================================================================

interface Subscriber {
  contract_id: string
  user_email: string
  user_name: string
  user_role: 'business_team' | 'shariah_advisor' | 'legal_counsel' | 'compliance_manager' | 'finance_team'
  notification_preferences: {
    enabled: boolean
    channels: {
      email: boolean
      in_app: boolean
      webhook?: string
    }
    frequency: 'real_time' | 'daily_digest' | 'weekly_digest'
  }
  subscribed_at: string
  subscribed_by: string
}

interface SubscriberListProps {
  contractId: string
  currentUserEmail?: string
  isOwner?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SubscriberList({
  contractId,
  currentUserEmail = 'current_user@example.com',
  isOwner = false
}: SubscriberListProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [ownerEmail, setOwnerEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [removingSubscriber, setRemovingSubscriber] = useState<string | null>(null)

  // Add subscriber form state
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('')
  const [newSubscriberName, setNewSubscriberName] = useState('')
  const [newSubscriberRole, setNewSubscriberRole] = useState<string>('business_team')
  const [addingSubscriber, setAddingSubscriber] = useState(false)

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadSubscribers()
  }, [contractId])

  const loadSubscribers = async () => {
    try {
      setLoading(true)
      const data = await backendClient.api<{
        subscribers: Subscriber[]
        owner_email: string
      }>(`/api/contracts/${contractId}/subscribers`, {
        method: 'GET'
      })

      setSubscribers(data.subscribers || [])
      setOwnerEmail(data.owner_email || '')
    } catch (error) {
      console.error('Failed to load subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // SUBSCRIBER ACTIONS
  // ============================================================================

  const handleAddSubscriber = async () => {
    if (!newSubscriberEmail || !newSubscriberName) {
      return
    }

    try {
      setAddingSubscriber(true)
      await backendClient.api(`/api/contracts/${contractId}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: newSubscriberEmail,
          user_name: newSubscriberName,
          user_role: newSubscriberRole,
          notification_preferences: {
            enabled: true,
            channels: { email: true, in_app: true },
            frequency: 'real_time'
          }
        })
      })

      // Reset form
      setNewSubscriberEmail('')
      setNewSubscriberName('')
      setNewSubscriberRole('business_team')
      setAddDialogOpen(false)

      // Reload subscribers
      await loadSubscribers()
    } catch (error) {
      console.error('Failed to add subscriber:', error)
      alert('Failed to add subscriber. Please try again.')
    } finally {
      setAddingSubscriber(false)
    }
  }

  const handleRemoveSubscriber = async (subscriberEmail: string) => {
    if (!confirm(`Remove ${subscriberEmail} from subscribers?`)) {
      return
    }

    try {
      setRemovingSubscriber(subscriberEmail)
      await backendClient.api(`/api/contracts/${contractId}/subscribers/${subscriberEmail}`, {
        method: 'DELETE'
      })

      // Reload subscribers
      await loadSubscribers()
    } catch (error) {
      console.error('Failed to remove subscriber:', error)
      alert('Failed to remove subscriber. Please try again.')
    } finally {
      setRemovingSubscriber(null)
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      business_team: 'bg-blue-100 text-blue-800',
      shariah_advisor: 'bg-green-100 text-green-800',
      legal_counsel: 'bg-purple-100 text-purple-800',
      compliance_manager: 'bg-orange-100 text-orange-800',
      finance_team: 'bg-pink-100 text-pink-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      business_team: 'Business Team',
      shariah_advisor: 'Shariah Advisor',
      legal_counsel: 'Legal Counsel',
      compliance_manager: 'Compliance Manager',
      finance_team: 'Finance Team'
    }
    return labels[role] || role
  }

  const canRemoveSubscriber = (subscriberEmail: string) => {
    return isOwner || subscriberEmail === currentUserEmail
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Loading subscribers...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Contract Stakeholders
        </h3>
        {isOwner && subscribers.length < 10 && (
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Subscriber</DialogTitle>
                <DialogDescription>
                  Add a new stakeholder to this contract. They will receive notifications based on their preferences.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newSubscriberEmail}
                    onChange={(e) => setNewSubscriberEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={newSubscriberName}
                    onChange={(e) => setNewSubscriberName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newSubscriberRole} onValueChange={setNewSubscriberRole}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business_team">Business Team</SelectItem>
                      <SelectItem value="shariah_advisor">Shariah Advisor</SelectItem>
                      <SelectItem value="legal_counsel">Legal Counsel</SelectItem>
                      <SelectItem value="compliance_manager">Compliance Manager</SelectItem>
                      <SelectItem value="finance_team">Finance Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSubscriber}
                  disabled={!newSubscriberEmail || !newSubscriberName || addingSubscriber}
                >
                  {addingSubscriber ? 'Adding...' : 'Add Subscriber'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Owner */}
      <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-600" />
              <span className="font-medium">{ownerEmail}</span>
              <Badge className="bg-amber-100 text-amber-800">Owner</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Contract owner with full permissions
            </p>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      {subscribers.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">
            No subscribers yet. {isOwner && 'Add subscribers to enable collaboration.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.user_email}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{subscriber.user_name}</span>
                    <Badge className={getRoleBadgeColor(subscriber.user_role)}>
                      {getRoleLabel(subscriber.user_role)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    {subscriber.user_email}
                  </p>
                  <div className="flex items-center gap-3 mt-2 ml-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      {subscriber.notification_preferences.enabled ? (
                        <>
                          <Bell className="h-3 w-3" />
                          Notifications: {subscriber.notification_preferences.frequency.replace('_', ' ')}
                        </>
                      ) : (
                        <>
                          <BellOff className="h-3 w-3" />
                          Notifications disabled
                        </>
                      )}
                    </span>
                    {subscriber.notification_preferences.channels.email && (
                      <span>Email</span>
                    )}
                    {subscriber.notification_preferences.channels.in_app && (
                      <span>In-app</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-6">
                    Added {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </p>
                </div>
                {canRemoveSubscriber(subscriber.user_email) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveSubscriber(subscriber.user_email)}
                    disabled={removingSubscriber === subscriber.user_email}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscriber Limit Warning */}
      {subscribers.length >= 10 && (
        <p className="text-xs text-amber-600 text-center">
          Maximum subscribers reached (10/10)
        </p>
      )}
    </div>
  )
}
