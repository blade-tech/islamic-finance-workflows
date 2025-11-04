/**
 * COMMENT THREAD COMPONENT
 * ========================
 * Display and manage comment threads on contracts and workflow steps.
 *
 * Features:
 * - List comments (contract-level or step-specific)
 * - Add new comments with markdown support
 * - @mention users (auto-extracts @email)
 * - Edit own comments
 * - Delete comments (author or owner)
 * - Search comments
 * - Filter by author or mentions
 *
 * Part of: Vanta Phase A - Collaboration Features
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageSquare, Send, Edit, Trash2, MoreVertical, Search, X } from 'lucide-react'
import { backendClient } from '@/lib/backend-client'

// ============================================================================
// TYPES
// ============================================================================

interface Comment {
  comment_id: string
  contract_id: string
  step_number?: number
  author_email: string
  author_name: string
  author_role: 'business_team' | 'shariah_advisor' | 'legal_counsel' | 'compliance_manager' | 'finance_team'
  content: string
  mentions: string[]
  created_at: string
  updated_at?: string
  edited: boolean
  reactions: Record<string, number>
}

interface CommentThreadProps {
  contractId: string
  stepNumber?: number
  currentUserEmail?: string
  currentUserName?: string
  currentUserRole?: string
  isOwner?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CommentThread({
  contractId,
  stepNumber,
  currentUserEmail = 'current_user@example.com',
  currentUserName = 'Current User',
  currentUserRole = 'business_team',
  isOwner = false
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadComments()
  }, [contractId, stepNumber])

  const loadComments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (stepNumber !== undefined) {
        params.append('step_number', stepNumber.toString())
      }

      const data = await backendClient.api<{ comments: Comment[] }>(
        `/api/contracts/${contractId}/comments?${params}`,
        { method: 'GET' }
      )

      setComments(data.comments || [])
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // COMMENT ACTIONS
  // ============================================================================

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      setAddingComment(true)
      await backendClient.api(`/api/contracts/${contractId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          step_number: stepNumber
        })
      })

      setNewComment('')
      await loadComments()
    } catch (error) {
      console.error('Failed to add comment:', error)
      alert('Failed to add comment. Please try again.')
    } finally {
      setAddingComment(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      await backendClient.api(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })

      setEditingCommentId(null)
      setEditContent('')
      await loadComments()
    } catch (error) {
      console.error('Failed to edit comment:', error)
      alert('Failed to edit comment. Please try again.')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    try {
      await backendClient.api(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      await loadComments()
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('Failed to delete comment. Please try again.')
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.comment_id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditContent('')
  }

  // ============================================================================
  // SEARCH & FILTER
  // ============================================================================

  const filteredComments = comments.filter(comment => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      comment.content.toLowerCase().includes(query) ||
      comment.author_name.toLowerCase().includes(query) ||
      comment.author_email.toLowerCase().includes(query)
    )
  })

  // ============================================================================
  // HELPERS
  // ============================================================================

  const canEditComment = (comment: Comment) => {
    return comment.author_email === currentUserEmail
  }

  const canDeleteComment = (comment: Comment) => {
    return comment.author_email === currentUserEmail || isOwner
  }

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
        return (
          <span key={i} className="text-blue-600 font-medium">
            @{part}
          </span>
        )
      }
      return part
    })
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments {stepNumber !== undefined && `(Step ${stepNumber})`}
          {!loading && <span className="text-sm text-gray-500">({filteredComments.length})</span>}
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {searchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Add Comment */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <Textarea
          ref={textareaRef}
          placeholder="Add a comment... Use @email to mention someone"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-3 bg-white"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Markdown supported. Use @email to mention users.
          </p>
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || addingComment}
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            {addingComment ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-sm text-gray-500">
          Loading comments...
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {searchQuery ? 'No comments match your search' : 'No comments yet. Be the first to comment!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => (
            <div
              key={comment.comment_id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.author_name}</span>
                  <Badge className={getRoleBadgeColor(comment.author_role)} variant="secondary">
                    {getRoleLabel(comment.author_role)}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {formatTimestamp(comment.created_at)}
                    {comment.edited && ' (edited)'}
                  </span>
                </div>
                {(canEditComment(comment) || canDeleteComment(comment)) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canEditComment(comment) && (
                        <DropdownMenuItem onClick={() => startEditing(comment)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {canDeleteComment(comment) && (
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment.comment_id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Comment Content */}
              {editingCommentId === comment.comment_id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(comment.comment_id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {highlightMentions(comment.content)}
                </div>
              )}

              {/* Mentions */}
              {comment.mentions.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <span className="text-xs text-gray-500">Mentions:</span>
                  {comment.mentions.map((mention, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      @{mention}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
