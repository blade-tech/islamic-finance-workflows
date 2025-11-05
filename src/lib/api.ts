/**
 * API CLIENT
 * ==========
 * HTTP client for communicating with the FastAPI backend.
 *
 * WHY THIS PATTERN:
 * - Centralized API configuration
 * - Type-safe request/response handling
 * - Error normalization
 * - Easy to mock for testing
 * - SSE (Server-Sent Events) support for Claude streaming
 *
 * USAGE:
 * - Regular API calls: Use the typed methods (uploadDocument, executeWorkflow, etc.)
 * - Claude streaming: Use streamClaude() which returns ReadableStream
 */

import type {
  WorkflowTemplate,
  WorkflowExecution,
  UploadedDocument,
  Citation,
  Learning,
  GeneratedFile,
  GraphitiStats,
} from './types'
import { backendClient } from './backend-client'

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    let errorDetails = null

    try {
      const errorData = await response.json()

      // Handle Pydantic validation errors (422)
      if (response.status === 422 && errorData.detail && Array.isArray(errorData.detail)) {
        // Extract validation error messages
        const validationErrors = errorData.detail.map((err: any) => {
          const field = err.loc?.join('.') || 'unknown'
          return `${field}: ${err.msg}`
        }).join(', ')
        errorMessage = `Validation error: ${validationErrors}`
        errorDetails = errorData.detail
      } else if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail
        errorDetails = errorData
      } else if (errorData.message) {
        errorMessage = errorData.message
        errorDetails = errorData
      } else {
        errorDetails = errorData
      }
    } catch {
      // Response body is not JSON, use default error message
    }

    throw new ApiError(response.status, errorMessage, errorDetails)
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// ============================================================================
// WORKFLOW TEMPLATES
// ============================================================================

/**
 * Maps backend template format to frontend WorkflowTemplate type
 */
function mapBackendTemplate(backend: any): WorkflowTemplate {
  return {
    id: backend.id,
    name: backend.title, // Map title -> name
    description: backend.description,
    icon: getIconForCategory(backend.category),
    category: backend.category,
    openCodeTemplate: backend.system_prompt || `Generate ${backend.title}`,
    axialCode: {
      steps: [], // Will be populated during execution
      requiredSources: backend.metadata?.required_sources || [],
      outputFormat: 'markdown',
      estimatedDuration: 15,
      complexity: 'moderate' as const,
    },
    version: backend.metadata?.version || '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executionCount: 0,
    successRate: 0,
    averageRating: 0,
    refinements: [],
  }
}

/**
 * Get icon emoji for template category
 */
function getIconForCategory(category: string): string {
  const icons: Record<string, string> = {
    structuring: '💰',
    screening: '🔍',
    documentation: '📜',
    compliance: '✅',
    reconciliation: '📊',
  }
  return icons[category] || '📄'
}

export async function fetchWorkflowTemplates(): Promise<{
  templates: WorkflowTemplate[]
  isMock: boolean
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/templates`, {
      signal: AbortSignal.timeout(3000), // 3 second timeout
    })
    const backendTemplates = await handleResponse<any[]>(response)
    return {
      templates: backendTemplates.map(mapBackendTemplate),
      isMock: false,
    }
  } catch (error) {
    // Backend unavailable - return mock data
    console.log('[API] Backend unavailable, returning mock templates')
    const { MOCK_TEMPLATES } = await import('./mock-data')
    return {
      templates: MOCK_TEMPLATES,
      isMock: true,
    }
  }
}

export async function createCustomTemplate(
  openCodePrompt: string
): Promise<WorkflowTemplate> {
  const response = await fetch(`${API_BASE_URL}/api/templates/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ openCodePrompt }),
  })
  return handleResponse<WorkflowTemplate>(response)
}

// ============================================================================
// GRAPHITI CONNECTION
// ============================================================================

export async function testGraphitiConnection(): Promise<GraphitiStats> {
  const response = await fetch(`${API_BASE_URL}/api/graphiti/test`)
  return handleResponse<GraphitiStats>(response)
}

/**
 * GRAPHITI SEARCH - FULLY MIGRATED TO MCP
 * ========================================
 * Uses blade-graphiti MCP server for all search operations.
 * NO MORE fast_mode, use_llm_synthesis, or custom_prompt - MCP handles everything.
 */

export interface GraphitiSearchRequest {
  query: string
  num_results?: number
  group_ids?: string[]
}

export interface GraphitiSearchResponse {
  query: string
  results: Array<{
    fact: string
    relevance: number
    type: string
    temporal?: {
      created: string
      valid_from?: string
      valid_until?: string
    }
  }>
  total_results: number
  answer?: string  // LLM summary from MCP
  status: string
  context?: {
    total_facts: number
    confidence: string
  }
}

export async function searchGraphiti(request: GraphitiSearchRequest): Promise<GraphitiSearchResponse> {
  // Use backendClient which handles service discovery and mock mode fallback
  const result = await backendClient.searchGraphiti(
    request.query,
    {
      num_results: request.num_results || 10,
      group_ids: request.group_ids,
    }
  )

  // Map backendClient response to expected GraphitiSearchResponse format
  return {
    query: result.query,
    results: result.facts?.map((fact) => ({
      fact: fact.fact,
      relevance: fact.relevance,
      type: fact.type || 'unknown',
      temporal: fact.temporal,
    })) || [],
    total_results: result.context?.total_facts || 0,
    answer: result.answer,
    status: result.status,
    context: result.context,
  }
}

export interface IngestDocumentResponse {
  document: UploadedDocument
  message: string
}

export async function ingestDocument(
  file: File,
  documentType: 'aaoifi' | 'context'
): Promise<UploadedDocument> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', documentType)  // Backend expects 'type' not 'document_type'

  const response = await fetch(`${API_BASE_URL}/api/documents/ingest`, {
    method: 'POST',
    body: formData,
  })

  const result = await handleResponse<IngestDocumentResponse>(response)
  return result.document
}

// ============================================================================
// WORKFLOW EXECUTION
// ============================================================================

export interface ExecuteWorkflowRequest {
  templateId: string
  contextText?: string
  contextDocumentIds: string[]
  userNotes: Record<string, string>
}

export async function executeWorkflow(
  request: ExecuteWorkflowRequest
): Promise<{ execution_id: string; stream_url: string }> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  return handleResponse<{ execution_id: string; stream_url: string }>(response)
}

/**
 * CLAUDE STREAMING (Legacy)
 * ==========================
 * Opens an SSE connection to stream Claude's response with callback-based API.
 *
 * NOTE: This is the OLD API for single-turn execution.
 * For multi-turn conversations, use the new Session API.
 *
 * USAGE:
 * ```typescript
 * const controller = new AbortController()
 *
 * await streamClaude(executionId, {
 *   onChunk: (text) => {
 *     setOutput(prev => prev + text)
 *   },
 *   onStatus: (status) => {
 *     setStatus(status)
 *   },
 *   onError: (error) => {
 *     setError(error)
 *   },
 *   onDone: () => {
 *     setIsRunning(false)
 *   }
 * }, controller.signal)
 *
 * // To cancel:
 * controller.abort()
 * ```
 */
export async function streamClaude(
  executionId: string,
  callbacks: {
    onChunk: (text: string) => void
    onStatus: (status: string) => void
    onError: (error: string) => void
    onDone: () => void
  },
  abortSignal?: AbortSignal
): Promise<void> {
  const { parseSSEStream } = await import('./sse-parser')

  return parseSSEStream(executionId, callbacks, abortSignal)
}

/**
 * INTERRUPT WORKFLOW
 * ==================
 * Send an interrupt message during execution.
 */
export async function interruptWorkflow(
  executionId: string,
  message: string
): Promise<{ acknowledged: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${executionId}/interrupt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  return handleResponse<{ acknowledged: boolean }>(response)
}

/**
 * RESUME WORKFLOW
 * ===============
 * Resume a paused workflow.
 */
export async function resumeWorkflow(
  executionId: string
): Promise<{ resumed: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${executionId}/resume`, {
    method: 'POST',
  })

  return handleResponse<{ resumed: boolean }>(response)
}

// ============================================================================
// SESSION API (NEW - Multi-turn Conversations)
// ============================================================================

/**
 * SESSION API - Following Anthropic Agent SDK Patterns
 * ====================================================
 *
 * This is the NEW API for interactive, multi-turn conversations.
 * Use this instead of the legacy executeWorkflow + streamClaude pattern.
 *
 * BENEFITS:
 * - Multi-turn conversations (like Claude CLI)
 * - Interrupt and resume capability
 * - Full conversation history maintained
 * - AbortController support for cancellation
 *
 * FLOW:
 * 1. createSession() → Get session_id
 * 2. streamSession() → Stream Claude response
 * 3. User interrupts → abort() + interruptSession()
 * 4. streamSession() again → Continue conversation
 */

export interface CreateSessionRequest {
  template_id: string
  system_prompt: string
  initial_message?: string
  context_text?: string
  context_document_ids?: string[]
  user_notes?: Record<string, string>
  execution_id?: string  // Link to legacy execution
}

export interface CreateSessionResponse {
  session_id: string
  stream_url: string
  status: string
}

export interface InterruptSessionRequest {
  message: string
}

export interface InterruptSessionResponse {
  status: string
  message_count: number
  ready_to_resume: boolean
}

export interface SessionStateResponse {
  session_id: string
  template_id: string
  status: string
  message_count: number
  created_at: string
  last_updated: string
}

/**
 * Create a new conversation session.
 *
 * This replaces the old executeWorkflow() for interactive sessions.
 */
export async function createSession(
  request: CreateSessionRequest
): Promise<CreateSessionResponse> {
  // Use backendClient which handles service discovery and mock mode fallback
  const sessionId = await backendClient.createSession(
    request.initial_message || 'Start workflow execution'
  )

  return {
    session_id: sessionId,
    stream_url: `/api/sessions/${sessionId}/stream`,
    status: 'created',
  }
}

/**
 * Stream Claude response for a session.
 *
 * This replaces the old streamClaude() for multi-turn conversations.
 * Supports AbortController for user cancellation.
 *
 * USAGE:
 * ```typescript
 * const controller = new AbortController()
 *
 * await streamSession(sessionId, {
 *   onChunk: (text) => setOutput(prev => prev + text),
 *   onStatus: (status) => setStatus(status),
 *   onError: (error) => setError(error),
 *   onDone: () => setIsRunning(false)
 * }, controller.signal)
 *
 * // To cancel:
 * controller.abort()
 * ```
 */
export async function streamSession(
  sessionId: string,
  callbacks: {
    onChunk: (text: string) => void
    onStatus: (status: string) => void
    onError: (error: string) => void
    onDone: () => void
  },
  abortSignal?: AbortSignal
): Promise<void> {
  // Check if orchestrator service is available via backendClient
  const serviceStatus = backendClient.getServiceStatus('orchestrator')

  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 Session SSE: Orchestrator status:', serviceStatus)
  }

  const { parseSSEStream } = await import('./sse-parser')

  // Use parseSSEStream with session ID as execution ID
  // Backend routes /api/sessions/{id}/stream
  // But parseSSEStream constructs /api/workflows/{id}/stream
  // So we need a custom URL construction

  const streamUrl = `${API_BASE_URL}/api/sessions/${sessionId}/stream`

  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 Session SSE: Connecting to stream:', streamUrl)
  }

  try {
    const response = await fetch(streamUrl, {
      signal: abortSignal
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null - no stream available')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🏁 Session SSE: Stream ended')
        }
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      let currentEvent: { event?: string; data?: string } = {}

      for (const line of lines) {
        if (line.trim() === '') {
          if (currentEvent.event && currentEvent.data) {
            processSSEEvent(currentEvent as { event: string; data: string }, callbacks)
            currentEvent = {}
          }
          continue
        }

        if (line.startsWith(':')) {
          continue
        }

        if (line.startsWith('event:')) {
          currentEvent.event = line.slice(6).trim()
          continue
        }

        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          currentEvent.data = currentEvent.data
            ? currentEvent.data + '\n' + data
            : data
          continue
        }
      }
    }

    callbacks.onDone()

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🛑 Session SSE: Stream aborted by user')
      }
      return
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error'

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Session SSE: Stream error:', error)
    }

    callbacks.onError(errorMessage)
    throw error
  }
}

// Helper function for processing SSE events (same as sse-parser.ts)
function processSSEEvent(
  event: { event: string; data: string },
  callbacks: {
    onChunk: (text: string) => void
    onStatus: (status: string) => void
    onError: (error: string) => void
    onDone: () => void
  }
): void {
  try {
    const data = JSON.parse(event.data)

    switch (event.event) {
      case 'chunk':
        if (data.text !== undefined) {
          callbacks.onChunk(data.text)
        }
        break

      case 'status':
        if (data.status) {
          callbacks.onStatus(data.status)
        }
        break

      case 'error':
        if (data.error) {
          callbacks.onError(data.error)
        }
        break

      case 'done':
        // Done callback will be invoked when stream ends
        break

      default:
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Unknown event type:', event.event)
        }
    }
  } catch (parseError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Failed to parse event data:', event.data, parseError)
    }
  }
}

/**
 * Interrupt a session with a user message.
 *
 * Call this after aborting the stream to add user input.
 * Then call streamSession() again to continue the conversation.
 */
export async function interruptSession(
  sessionId: string,
  request: InterruptSessionRequest
): Promise<InterruptSessionResponse> {
  // Use backendClient which handles service discovery
  await backendClient.interruptSession(sessionId, request.message)

  return {
    status: 'interrupted',
    message_count: 1,
    ready_to_resume: true,
  }
}

/**
 * Get session state (for debugging/UI updates).
 */
export async function getSessionState(sessionId: string): Promise<SessionStateResponse> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`)
  return handleResponse<SessionStateResponse>(response)
}

/**
 * Delete a session (cleanup).
 */
export async function deleteSession(sessionId: string): Promise<{ deleted: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
    method: 'DELETE',
  })

  return handleResponse<{ deleted: boolean }>(response)
}

// ============================================================================
// CITATIONS
// ============================================================================

export async function fetchCitations(executionId: string): Promise<Citation[]> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${executionId}/citations`)
  return handleResponse<Citation[]>(response)
}

export async function updateCitationApproval(
  citationId: string,
  approved: boolean,
  rejectionReason?: string
): Promise<{ updated: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/citations/${citationId}/approval`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved, rejectionReason }),
  })

  return handleResponse<{ updated: boolean }>(response)
}

// ============================================================================
// DOCUMENT GENERATION
// ============================================================================

export async function generateDocument(
  executionId: string,
  format: 'pdf' | 'docx' | 'markdown'
): Promise<GeneratedFile> {
  const response = await fetch(`${API_BASE_URL}/api/documents/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ executionId, format }),
  })

  return handleResponse<GeneratedFile>(response)
}

export async function downloadDocument(fileId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${fileId}/download`)

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to download document: ${response.statusText}`)
  }

  return response.blob()
}

// ============================================================================
// LEARNING EXTRACTION
// ============================================================================

export async function extractLearnings(executionId: string): Promise<Learning[]> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${executionId}/learnings`, {
    method: 'POST',
  })

  return handleResponse<Learning[]>(response)
}

export async function applyLearningToTemplate(
  learningId: string
): Promise<{ applied: boolean; templateId: string }> {
  const response = await fetch(`${API_BASE_URL}/api/learnings/${learningId}/apply`, {
    method: 'POST',
  })

  return handleResponse<{ applied: boolean; templateId: string }>(response)
}

// ============================================================================
// EXECUTION STATE
// ============================================================================

export async function fetchExecutionState(executionId: string): Promise<WorkflowExecution> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${executionId}`)
  return handleResponse<WorkflowExecution>(response)
}
