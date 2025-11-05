'use client'

/**
 * STEP 5: INTERACTIVE EXECUTION (Claude CLI UX)
 * ===============================================
 * Multi-turn, collaborative AI conversation following Anthropic Agent SDK patterns.
 *
 * NEW UX PATTERN: Interactive Collaboration
 * - Users can interrupt Claude mid-response (like Claude CLI)
 * - Add context and guidance at any time
 * - Full conversation history maintained
 * - Chat bubble interface showing user/assistant messages
 * - Always-visible input for seamless interaction
 *
 * FOLLOWS ANTHROPIC PATTERNS:
 * - Session-based conversations
 * - Full message history
 * - AbortController for stream cancellation
 * - Alternating user/assistant roles
 */

import { useState, useEffect, useRef } from 'react'
import { useWorkflowStore } from '@/lib/store'
import {
  createSession,
  streamSession,
  interruptSession,
  deleteSession,
  type CreateSessionRequest
} from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ServiceDependencyBadge } from '@/components/workflow/ServiceDependencyBadge'
import {
  Play,
  StopCircle,
  Send,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  User,
  Bot
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export function Step5LiveExecution() {
  const execution = useWorkflowStore((state) => state.execution)
  const addUserNote = useWorkflowStore((state) => state.addUserNote)
  const addLogEntry = useWorkflowStore((state) => state.addLogEntry)
  const updateExecution = useWorkflowStore((state) => state.updateExecution)

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  // UI state
  const [configNotes, setConfigNotes] = useState('')
  const [showTemplateDetails, setShowTemplateDetails] = useState(true)
  const [showConfigNotes, setShowConfigNotes] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Streaming metrics
  const [streamStatus, setStreamStatus] = useState<'idle' | 'connecting' | 'streaming' | 'completed' | 'error'>('idle')
  const [charsReceived, setCharsReceived] = useState(0)
  const [streamStartTime, setStreamStartTime] = useState<number | null>(null)

  // Helper to create log entries
  const logEntry = (stepName: string, content: string, type: 'info' | 'error' | 'interrupt' = 'info') => {
    addLogEntry({
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toISOString(),
      stepIndex: execution?.currentStepIndex || 4,
      stepName,
      type,
      content
    })
  }

  const handleAddConfigNote = () => {
    if (configNotes.trim()) {
      addUserNote('execution_guidance', configNotes)
      setConfigNotes('')
    }
  }

  /**
   * START SESSION
   * Creates a new conversation session with Claude
   */
  const handleStartSession = async () => {
    if (!execution || !(execution as any)?.selectedTemplate) {
      setError('Please select a template first')
      return
    }

    try {
      setError(null)
      logEntry('system', '🚀 Creating conversation session...')

      // Build initial message
      const initialMessage = execution.contextText ||
        "Please proceed with the task according to the template instructions."

      // Create session
      const request: CreateSessionRequest = {
        template_id: (execution as any).selectedTemplate.id,
        system_prompt: (execution as any).selectedTemplate.openCodeTemplate,
        initial_message: initialMessage,
        context_text: execution.contextText || undefined,
        context_document_ids: execution.contextDocuments.map((doc) => doc.id) || [],
        user_notes: execution.userNotes
      }

      const response = await createSession(request)
      setSessionId(response.session_id)

      // Add initial user message to UI
      const userMessage: Message = {
        role: 'user',
        content: initialMessage,
        timestamp: new Date().toISOString()
      }
      setMessages([userMessage])

      logEntry('system', `✅ Session created: ${response.session_id}`)
      updateExecution({ status: 'running' })

      // Start streaming immediately
      await startStreaming(response.session_id)

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create session'
      setError(errorMsg)
      logEntry('error', `❌ Failed to create session: ${errorMsg}`, 'error')
    }
  }

  /**
   * START STREAMING
   * Connects to SSE stream and processes Claude's response
   */
  const startStreaming = async (sessionIdToStream: string) => {
    try {
      setIsStreaming(true)
      setStreamStatus('connecting')
      setStreamStartTime(Date.now())
      setCurrentAssistantMessage('')
      setCharsReceived(0)

      // Create AbortController for this stream
      const controller = new AbortController()
      setAbortController(controller)

      logEntry('system', '🔌 Connecting to stream...')

      // Stream Claude response
      await streamSession(
        sessionIdToStream,
        {
          onChunk: (text) => {
            // Update status on first chunk
            if (streamStatus === 'connecting') {
              setStreamStatus('streaming')
              logEntry('system', '✅ Stream connected, receiving response...')
            }

            // Append to current assistant message
            setCurrentAssistantMessage((prev) => prev + text)
            setCharsReceived((prev) => prev + text.length)

            // Auto-scroll
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
          },
          onStatus: (status) => {
            logEntry('system', `Status: ${status}`)
            if (status === 'completed') {
              setStreamStatus('completed')
            }
          },
          onError: (errorMsg) => {
            setError(errorMsg)
            setStreamStatus('error')
            setIsStreaming(false)
            logEntry('error', `❌ Stream error: ${errorMsg}`, 'error')
          },
          onDone: () => {
            // Add complete assistant message to messages array
            if (currentAssistantMessage) {
              const assistantMessage: Message = {
                role: 'assistant',
                content: currentAssistantMessage,
                timestamp: new Date().toISOString()
              }
              setMessages((prev) => [...prev, assistantMessage])
            }

            setIsStreaming(false)
            setStreamStatus('completed')
            setAbortController(null)
            updateExecution({ status: 'completed' })
            logEntry('system', '✅ Stream completed')
          }
        },
        controller.signal
      )

    } catch (err) {
      // Check if it was aborted (not an error)
      if (err instanceof Error && err.name === 'AbortError') {
        logEntry('system', '🛑 Stream aborted by user')
        return
      }

      const errorMsg = err instanceof Error ? err.message : 'Streaming failed'
      setError(errorMsg)
      setStreamStatus('error')
      setIsStreaming(false)
      logEntry('error', `❌ Streaming failed: ${errorMsg}`, 'error')
    }
  }

  /**
   * STOP STREAMING
   * Aborts the current stream (user clicks Stop button)
   */
  const handleStopStream = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsStreaming(false)
      setStreamStatus('idle')

      // Save partial assistant message if any
      if (currentAssistantMessage) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: currentAssistantMessage + '\n\n[Interrupted by user]',
          timestamp: new Date().toISOString()
        }
        setMessages((prev) => [...prev, assistantMessage])
        setCurrentAssistantMessage('')
      }

      logEntry('system', '⏸️ Stream stopped by user')
    }
  }

  /**
   * SEND MESSAGE
   * Sends user message and resumes streaming
   * This is the core of the interactive flow
   */
  const handleSendMessage = async () => {
    if (!sessionId || !currentMessage.trim()) return

    try {
      // Add user message to UI immediately
      const userMessage: Message = {
        role: 'user',
        content: currentMessage,
        timestamp: new Date().toISOString()
      }
      setMessages((prev) => [...prev, userMessage])
      setCurrentMessage('')

      logEntry('user_interrupt', `User: ${currentMessage}`, 'interrupt')

      // Send interrupt to backend (appends message to session)
      await interruptSession(sessionId, {
        message: currentMessage
      })

      logEntry('system', '📨 Message sent, resuming stream...')

      // Resume streaming
      await startStreaming(sessionId)

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMsg)
      logEntry('error', `❌ Failed to send message: ${errorMsg}`, 'error')
    }
  }

  /**
   * CLEANUP
   * Delete session when component unmounts
   */
  useEffect(() => {
    return () => {
      if (sessionId) {
        deleteSession(sessionId).catch(console.error)
      }
    }
  }, [sessionId])

  /**
   * AUTO-SCROLL
   * Keep scroll at bottom when new messages arrive
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, currentAssistantMessage])

  return (
    <div className="space-y-6">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Interactive AI Collaboration</AlertTitle>
        <AlertDescription>
          Have a back-and-forth conversation with Claude, just like the Claude CLI.
          Interrupt anytime to add context, correct course, or ask follow-ups.
        </AlertDescription>
      </Alert>

      {/* Template Review (collapsible) */}
      {(execution as any)?.selectedTemplate && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowTemplateDetails(!showTemplateDetails)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{(execution as any).selectedTemplate.icon}</span>
                <CardTitle>{(execution as any).selectedTemplate.name}</CardTitle>
              </div>
              {showTemplateDetails ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <CardDescription>
              {(execution as any).selectedTemplate.description}
            </CardDescription>
          </CardHeader>

          {showTemplateDetails && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {(execution as any).selectedTemplate.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Complexity</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {(execution as any).selectedTemplate.axialCode.complexity}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {(execution as any).selectedTemplate.axialCode.estimatedDuration} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Output Format</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {(execution as any).selectedTemplate.axialCode.outputFormat}
                  </p>
                </div>
              </div>

              {(execution as any).selectedTemplate.axialCode.requiredSources?.length > 0 && (
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-2">Required Sources</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {(execution as any).selectedTemplate.axialCode.requiredSources.map((source: string, idx: number) => (
                      <li key={idx}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">What Claude Will Do</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {(execution as any).selectedTemplate.openCodeTemplate}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Optional Configuration Notes (collapsible) */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => setShowConfigNotes(!showConfigNotes)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Add Guidance (Optional)</CardTitle>
              <Badge variant="secondary">Optional</Badge>
            </div>
            {showConfigNotes ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <CardDescription>
            Provide specific instructions to guide Claude's execution
          </CardDescription>
        </CardHeader>

        {showConfigNotes && (
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'Emphasize profit-sharing ratios', 'Include dispute resolution clauses', 'Reference AAOIFI FAS 3'..."
              value={configNotes}
              onChange={(e) => setConfigNotes(e.target.value)}
              rows={6}
            />
            <Button
              onClick={handleAddConfigNote}
              disabled={!configNotes.trim()}
              variant="outline"
            >
              Add Guidance Note
            </Button>

            {/* Show added notes */}
            {execution && execution.userNotes.execution_guidance && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Guidance Notes Added:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {execution.userNotes.execution_guidance}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Start Session Button (only show if no session) */}
      {!sessionId && (
        <Card>
          <CardHeader>
            <CardTitle>Start Conversation</CardTitle>
            <CardDescription>
              Begin an interactive conversation with Claude
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Required Services */}
            <ServiceDependencyBadge services={['mcp', 'orchestrator', 'graphiti']} inline={false} />

            <Button
              onClick={handleStartSession}
              size="lg"
              disabled={!(execution as any)?.selectedTemplate}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Interactive Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conversation Display (Chat Bubbles) */}
      {sessionId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Conversation</CardTitle>
                <CardDescription>
                  {messages.length} message{messages.length !== 1 ? 's' : ''} exchanged
                </CardDescription>
              </div>

              {/* Status Badge */}
              {isStreaming && (
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      streamStatus === 'streaming' ? 'default' :
                      streamStatus === 'connecting' ? 'secondary' :
                      'outline'
                    }
                  >
                    {(streamStatus === 'streaming' || streamStatus === 'connecting') && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    <span className="capitalize">{streamStatus}</span>
                  </Badge>

                  <span className="text-xs text-muted-foreground font-mono">
                    {charsReceived.toLocaleString()} chars
                  </span>

                  {streamStartTime && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {Math.floor((Date.now() - streamStartTime) / 1000)}s
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Messages ScrollArea */}
            <div
              ref={scrollRef}
              className="h-[500px] w-full rounded-md border p-4 overflow-y-auto space-y-4 bg-muted/20"
            >
              {/* Render all messages */}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar (assistant only) */}
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        msg.role === 'user'
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Avatar (user only) */}
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Currently streaming assistant message */}
              {isStreaming && currentAssistantMessage && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                      {currentAssistantMessage}
                      <span className="inline-block w-2 h-4 bg-primary/50 animate-pulse ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Loading state */}
              {isStreaming && !currentAssistantMessage && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-lg p-4 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area (Always Visible - Claude CLI Style) */}
            <div className="mt-4 space-y-2">
              <Textarea
                ref={inputRef}
                placeholder={
                  isStreaming
                    ? "Type your message to interrupt and guide Claude..."
                    : "Type your message to continue the conversation..."
                }
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (isStreaming) {
                      handleStopStream()
                    }
                    handleSendMessage()
                  }
                }}
                rows={3}
                className="resize-none"
              />

              <div className="flex gap-2">
                {/* Send Message Button */}
                <Button
                  onClick={() => {
                    if (isStreaming) {
                      handleStopStream()
                    }
                    handleSendMessage()
                  }}
                  disabled={!currentMessage.trim()}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isStreaming ? 'Stop & Send' : 'Send Message'}
                </Button>

                {/* Stop Button (during streaming) */}
                {isStreaming && (
                  <Button
                    onClick={handleStopStream}
                    variant="destructive"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Press Enter to send • Shift+Enter for new line
                {isStreaming && " • Click Stop or type to interrupt"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Execution Logs */}
      {execution && execution.executionLog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Session Logs</CardTitle>
            <CardDescription>
              System messages and status updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full rounded-md border p-4">
              {execution.executionLog.map((entry) => (
                <div
                  key={entry.id}
                  className={`mb-2 p-2 rounded text-sm ${
                    entry.stepName === 'error'
                      ? 'bg-destructive/10 text-destructive'
                      : entry.stepName === 'user_interrupt'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted'
                  }`}
                >
                  <strong>[{entry.stepName}]</strong> {entry.content}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
