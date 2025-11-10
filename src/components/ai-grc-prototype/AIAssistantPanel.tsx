'use client'

/**
 * AI ASSISTANT PANEL COMPONENT
 * =============================
 * Chat interface with Human-in-the-Loop (HITL) tool approval.
 *
 * FEATURES:
 * - Message history with user/assistant roles
 * - Tool approval cards (Approve/Modify/Reject)
 * - Typewriter animation for AI responses
 * - Pre-scripted conversations for demo
 */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Send,
  Sparkles,
  User,
  X
} from 'lucide-react'
import type { AIMessage, Conversation } from '@/lib/mock-data/ai-conversations'

interface AIAssistantPanelProps {
  taskId: string
  taskName: string
  availableConversations: Conversation[]
}

export interface AIAssistantPanelRef {
  loadConversation: (conversation: Conversation) => void
}

export const AIAssistantPanel = forwardRef<AIAssistantPanelRef, AIAssistantPanelProps>(function AIAssistantPanel({
  taskId,
  taskName,
  availableConversations
}, ref) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hi! I'm your AI assistant for **${taskName}**.\n\nI can help you:\n- Calculate compliance metrics\n- Draft documents\n- Schedule meetings\n- Upload and verify evidence\n- Search knowledge base\n- Extract contract terms\n- Verify compliance status\n\n**Click an action above to see me in action with Human-in-the-Loop approval!**`,
      timestamp: 'Just now'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [pendingMessages, setPendingMessages] = useState<AIMessage[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const playMessages = (messagesToPlay: AIMessage[], startDelay = 500) => {
    if (messagesToPlay.length === 0) return

    let delay = startDelay
    messagesToPlay.forEach((msg, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg])

        // If this message requires approval, pause playback
        if (msg.toolUse?.status === 'pending_approval') {
          setIsPaused(true)
          // Store remaining messages for later
          const remaining = messagesToPlay.slice(index + 1)
          setPendingMessages(remaining)
        }
      }, delay)

      // Only schedule next messages if not paused
      if (msg.toolUse?.status === 'pending_approval') {
        return // Stop scheduling further messages
      }

      delay += 1500
    })
  }

  const handleLoadConversation = (conversation: Conversation) => {
    // Reset state
    setMessages([messages[0]])
    setPendingMessages([])
    setIsPaused(false)

    // Start playing messages
    playMessages(conversation.messages)
  }

  // Expose loadConversation method via ref for parent component
  useImperativeHandle(ref, () => ({
    loadConversation: handleLoadConversation
  }))

  const handleApprove = (messageId: string, toolId: string) => {
    // Update status to executing
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId && msg.toolUse?.id === toolId) {
          return {
            ...msg,
            toolUse: {
              ...msg.toolUse,
              status: 'executing'
            }
          }
        }
        return msg
      })
    )

    // After 2s, mark as completed and resume playback
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id === messageId && msg.toolUse?.id === toolId) {
            return {
              ...msg,
              toolUse: {
                ...msg.toolUse,
                status: 'completed'
              }
            }
          }
          return msg
        })
      )

      // Resume playback with remaining messages
      setIsPaused(false)
      if (pendingMessages.length > 0) {
        playMessages(pendingMessages, 1500)
        setPendingMessages([])
      }
    }, 2000)
  }

  const handleReject = (messageId: string, toolId: string) => {
    // Update status to rejected
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId && msg.toolUse?.id === toolId) {
          return {
            ...msg,
            toolUse: {
              ...msg.toolUse,
              status: 'rejected'
            }
          }
        }
        return msg
      })
    )

    // Clear pending messages and unpause
    setPendingMessages([])
    setIsPaused(false)

    // Add rejection message
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `reject-${Date.now()}`,
          role: 'assistant',
          content: 'Tool execution rejected. How else can I help you?',
          timestamp: new Date().toLocaleTimeString()
        }
      ])
    }, 500)
  }

  const getToolIcon = (toolName: string) => {
    const icons: Record<string, any> = {
      search_policies: FileText,
      draft_document: FileText,
      schedule_meeting: Clock,
      check_calendars: Clock,
      analyze_document: FileText
    }
    return icons[toolName] || Sparkles
  }

  return (
    <div className="space-y-6">
      {/* Chat Panel */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Human-in-the-Loop • Tool Approval Required</CardDescription>
              </div>
            </div>
            <Badge className="bg-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id}>
                {/* Message Bubble */}
                <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Bot className="h-5 w-5 text-blue-600" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className={`text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                        {msg.content}
                      </p>
                    </div>
                    {msg.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                    )}

                    {/* Tool Approval Card */}
                    {msg.toolUse && (
                      <div className={`mt-3 ${msg.role === 'user' ? 'text-left' : ''}`}>
                        <ToolApprovalCard
                          toolUse={msg.toolUse}
                          messageId={msg.id}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          ToolIcon={getToolIcon(msg.toolUse.toolName)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-end gap-3">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about this task..."
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                disabled
              />
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                disabled
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ℹ️ Input disabled in demo mode. Use pre-scripted conversations above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

/**
 * TOOL APPROVAL CARD COMPONENT
 */

interface ToolApprovalCardProps {
  toolUse: AIMessage['toolUse']
  messageId: string
  onApprove: (messageId: string, toolId: string) => void
  onReject: (messageId: string, toolId: string) => void
  ToolIcon: any
}

function ToolApprovalCard({
  toolUse,
  messageId,
  onApprove,
  onReject,
  ToolIcon
}: ToolApprovalCardProps) {
  if (!toolUse) return null

  const getStatusBadge = () => {
    switch (toolUse.status) {
      case 'pending_approval':
        return (
          <Badge className="bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Awaiting Approval
          </Badge>
        )
      case 'executing':
        return (
          <Badge className="bg-blue-600">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Executing...
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-600">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className={`border-2 inline-block min-w-[300px] max-w-[500px] ${
      toolUse.status === 'pending_approval'
        ? 'border-yellow-400 bg-yellow-50'
        : toolUse.status === 'completed'
        ? 'border-green-400 bg-green-50'
        : toolUse.status === 'rejected'
        ? 'border-red-400 bg-red-50'
        : 'border-blue-400 bg-blue-50'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ToolIcon className="h-5 w-5 text-gray-700" />
            <span className="font-mono text-sm text-gray-700">{toolUse.toolName}</span>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Parameters */}
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">Parameters:</p>
          <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
            {JSON.stringify(toolUse.parameters, null, 2)}
          </pre>
        </div>

        {/* Reasoning */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-1">Why this action?</p>
          <p className="text-sm text-gray-800">{toolUse.reasoning}</p>
        </div>

        {/* Action Buttons */}
        {toolUse.status === 'pending_approval' && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onApprove(messageId, toolUse.id)}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              onClick={() => onReject(messageId, toolUse.id)}
              size="sm"
              variant="outline"
              className="border-red-400 text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {/* Result (if completed) */}
        {toolUse.status === 'completed' && toolUse.result && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-green-900 mb-2">Result:</p>
            <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
              {JSON.stringify(toolUse.result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
