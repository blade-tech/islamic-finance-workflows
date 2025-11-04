/**
 * USER MENTIONS PAGE
 * ==================
 * View all comments where the current user was @mentioned.
 *
 * Features:
 * - List all mentions
 * - Group by contract
 * - Show comment context
 * - Link to original comment/contract
 * - Mark as read
 * - Search mentions
 *
 * Route: /mentions
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
  AtSign,
  Search,
  MessageSquare,
  FileText,
  Calendar,
  ArrowRight,
  X
} from 'lucide-react'
import { backendClient } from '@/lib/backend-client'
import Link from 'next/link'

// ============================================================================
// TYPES
// ============================================================================

interface Comment {
  comment_id: string
  contract_id: string
  step_number?: number
  author_email: string
  author_name: string
  author_role: string
  content: string
  mentions: string[]
  created_at: string
  updated_at?: string
  edited: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function UserMentionsPage() {
  const [mentions, setMentions] = useState<Comment[]>([])
  const [filteredMentions, setFilteredMentions] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const currentUserEmail = 'current_user@example.com' // TODO: Get from auth

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadMentions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [mentions, searchQuery])

  const loadMentions = async () => {
    try {
      setLoading(true)
      const data = await backendClient.api<{
        comments: Comment[]
      }>(`/api/users/${currentUserEmail}/mentions`, {
        method: 'GET'
      })

      setMentions(data.comments || [])
    } catch (error) {
      console.error('Failed to load mentions:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...mentions]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m =>
        m.content.toLowerCase().includes(query) ||
        m.author_name.toLowerCase().includes(query) ||
        m.contract_id.toLowerCase().includes(query)
      )
    }

    setFilteredMentions(filtered)
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
      business_team: 'Business',
      shariah_advisor: 'Shariah',
      legal_counsel: 'Legal',
      compliance_manager: 'Compliance',
      finance_team: 'Finance'
    }
    return labels[role] || role
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

  const highlightMentions = (content: string) => {
    const mentionPattern = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    return content.split(mentionPattern).map((part, i) => {
      if (i % 2 === 1) {
        // This is a mention
        const isCurrentUser = part === currentUserEmail
        return (
          <span
            key={i}
            className={`font-medium ${
              isCurrentUser ? 'text-blue-600 bg-blue-50 px-1 rounded' : 'text-blue-600'
            }`}
          >
            @{part}
          </span>
        )
      }
      return part
    })
  }

  const getCommentUrl = (comment: Comment) => {
    const base = `/contracts/${comment.contract_id}/collaborate`
    if (comment.step_number !== undefined) {
      return `${base}?tab=comments&step=${comment.step_number}`
    }
    return `${base}?tab=comments`
  }

  // Group mentions by contract
  const groupedMentions = filteredMentions.reduce((acc, mention) => {
    const contractId = mention.contract_id
    if (!acc[contractId]) {
      acc[contractId] = []
    }
    acc[contractId].push(mention)
    return acc
  }, {} as Record<string, Comment[]>)

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <AtSign className="h-8 w-8" />
          My Mentions
        </h1>
        <p className="text-gray-600 mt-1">
          Comments where you were @mentioned
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
            <AtSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentions.length}</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(groupedMentions).length}
            </div>
            <p className="text-xs text-gray-500">With mentions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered</CardTitle>
            <Search className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMentions.length}</div>
            <p className="text-xs text-gray-500">Current view</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by content, author, or contract..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {searchQuery && (
              <Button
                variant="ghost"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mentions List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Loading mentions...
          </CardContent>
        </Card>
      ) : filteredMentions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AtSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Mentions</h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'No mentions match your search'
                : 'You haven\'t been mentioned in any comments yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMentions).map(([contractId, contractMentions]) => (
            <Card key={contractId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Contract {contractId}
                    </CardTitle>
                    <CardDescription>
                      {contractMentions.length} mention{contractMentions.length > 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <Link href={`/contracts/${contractId}/collaborate`}>
                    <Button variant="outline" size="sm">
                      View Contract
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contractMentions.map((mention) => (
                  <div
                    key={mention.comment_id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{mention.author_name}</span>
                        <Badge className={getRoleBadgeColor(mention.author_role)} variant="secondary">
                          {getRoleLabel(mention.author_role)}
                        </Badge>
                        {mention.step_number !== undefined && (
                          <Badge variant="outline">
                            Step {mention.step_number}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTimestamp(mention.created_at)}
                        </span>
                        {mention.edited && (
                          <span>(edited)</span>
                        )}
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="text-sm text-gray-700 whitespace-pre-wrap mb-3 pl-6">
                      {highlightMentions(mention.content)}
                    </div>

                    {/* Other Mentions */}
                    {mention.mentions.length > 1 && (
                      <div className="flex items-center gap-2 pl-6 text-xs text-gray-500">
                        <span>Also mentioned:</span>
                        {mention.mentions
                          .filter(email => email !== currentUserEmail)
                          .map((email, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              @{email}
                            </Badge>
                          ))}
                      </div>
                    )}

                    {/* Action */}
                    <div className="flex justify-end mt-3 pt-3 border-t">
                      <Link href={getCommentUrl(mention)}>
                        <Button size="sm" variant="outline">
                          View Comment
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            About Mentions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • Use @email in comments to mention someone and notify them
            </p>
            <p>
              • Mentioned users receive notifications based on their preferences
            </p>
            <p>
              • Click "View Comment" to see the full conversation and reply
            </p>
            <p>
              • Mentions are highlighted in blue for easy identification
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
