/**
 * SSE PARSER - Educational Implementation
 * ========================================
 * Server-Sent Events (SSE) parser for streaming Claude responses.
 *
 * WHY NOT EventSource?
 * - EventSource doesn't support POST requests or custom headers
 * - We need full control over fetch (auth, CORS, request body)
 * - EventSource has limited error handling
 *
 * SSE PROTOCOL BASICS:
 * - Events are separated by double newlines (\n\n)
 * - Format: event: <type>\ndata: <payload>\n\n
 * - Comments start with : (used for heartbeats, ignored by parser)
 * - Data can span multiple lines (data: line1\ndata: line2\n\n)
 *
 * EXAMPLE SSE STREAM:
 * ```
 * event: chunk
 * data: {"text": "Hello"}
 *
 * event: chunk
 * data: {"text": " world"}
 *
 * event: status
 * data: {"status": "completed"}
 *
 * event: done
 * data: {"execution_id": "123"}
 * ```
 *
 * FLOW:
 * 1. fetch() returns Response with body: ReadableStream<Uint8Array>
 * 2. getReader() creates a reader for consuming chunks
 * 3. TextDecoder converts binary chunks to UTF-8 strings
 * 4. Buffer incomplete lines (chunks can split mid-event)
 * 5. Parse complete events and route to callbacks
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Callback interface for SSE events
 */
export interface SSECallbacks {
  /** Called when a text chunk is received from Claude */
  onChunk: (text: string) => void
  /** Called when execution status changes */
  onStatus: (status: string) => void
  /** Called when an error occurs */
  onError: (error: string) => void
  /** Called when the stream completes successfully */
  onDone: () => void
}

/**
 * Parsed SSE event
 */
interface SSEEvent {
  event: string
  data: string
}

/**
 * Parse Server-Sent Events stream with callback-based API and abort support.
 *
 * This function:
 * 1. Fetches the SSE endpoint with optional AbortController
 * 2. Reads the stream chunk by chunk
 * 3. Buffers incomplete lines
 * 4. Parses SSE events (event: type, data: payload)
 * 5. Invokes appropriate callbacks based on event type
 * 6. Can be cancelled mid-stream using AbortController
 *
 * @param executionId - Workflow execution ID or session ID
 * @param callbacks - Event handlers for different SSE event types
 * @param abortSignal - Optional AbortSignal for cancelling the stream
 * @throws Error if fetch fails or stream encounters error
 *
 * @example
 * ```typescript
 * const controller = new AbortController()
 *
 * await parseSSEStream('execution-123', {
 *   onChunk: (text) => console.log('Received:', text),
 *   onStatus: (status) => console.log('Status:', status),
 *   onError: (error) => console.error('Error:', error),
 *   onDone: () => console.log('Stream complete!')
 * }, controller.signal)
 *
 * // Later, to cancel:
 * controller.abort()
 * ```
 */
export async function parseSSEStream(
  executionId: string,
  callbacks: SSECallbacks,
  abortSignal?: AbortSignal
): Promise<void> {
  const streamUrl = `${API_BASE_URL}/api/workflows/${executionId}/stream`

  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 SSE: Connecting to stream:', streamUrl)
  }

  try {
    // Step 1: Fetch the SSE endpoint with optional abort signal
    const response = await fetch(streamUrl, {
      signal: abortSignal  // ✅ Can be cancelled with AbortController
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null - no stream available')
    }

    // Step 2: Get a reader for the ReadableStream
    const reader = response.body.getReader()

    // Step 3: Create decoder for UTF-8 text
    const decoder = new TextDecoder('utf-8')

    // Step 4: Initialize buffer for incomplete lines
    let buffer = ''
    let eventCount = 0
    let chunkCount = 0

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ SSE: Connected, reading stream...')
    }

    // Step 5: Read stream chunks in a loop
    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🏁 SSE: Stream ended naturally')
          console.log(`📊 SSE Stats: ${eventCount} events, ${chunkCount} chunks`)
        }
        break
      }

      chunkCount++

      // Step 6: Decode binary chunk to UTF-8 string
      const chunk = decoder.decode(value, { stream: true })

      // Step 7: Add to buffer (may contain partial lines)
      buffer += chunk

      // Step 8: Split by newlines
      const lines = buffer.split('\n')

      // Step 9: Keep incomplete line in buffer
      // (last element might be incomplete if chunk didn't end with \n)
      buffer = lines.pop() || ''

      // Step 10: Parse complete lines
      let currentEvent: Partial<SSEEvent> = {}

      for (const line of lines) {
        // Skip empty lines (event separator) and comments
        if (line.trim() === '') {
          // Empty line = end of event, process it
          if (currentEvent.event && currentEvent.data) {
            eventCount++
            processSSEEvent(currentEvent as SSEEvent, callbacks)
            currentEvent = {}
          }
          continue
        }

        // Comments (heartbeats) - ignore
        if (line.startsWith(':')) {
          if (process.env.NODE_ENV === 'development') {
            console.log('💓 SSE: Heartbeat received')
          }
          continue
        }

        // Parse "event: <type>" line
        if (line.startsWith('event:')) {
          currentEvent.event = line.slice(6).trim()
          continue
        }

        // Parse "data: <payload>" line
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          // SSE allows multi-line data (append with newline)
          currentEvent.data = currentEvent.data
            ? currentEvent.data + '\n' + data
            : data
          continue
        }

        // Unknown line format - log in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ SSE: Unknown line format:', line)
        }
      }
    }

    // Stream completed successfully
    callbacks.onDone()

  } catch (error) {
    // Handle abort errors gracefully (user-initiated cancellation)
    if (error instanceof Error && error.name === 'AbortError') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🛑 SSE: Stream aborted by user')
      }
      // Don't call onError for user-initiated aborts
      // Don't call onDone either - stream was interrupted
      return
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error'

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ SSE: Stream error:', error)
    }

    callbacks.onError(errorMessage)
    throw error
  }
}

/**
 * Process a parsed SSE event and invoke appropriate callback.
 *
 * Event types:
 * - "chunk": Claude response text chunk
 * - "status": Execution status update
 * - "error": Backend error message
 * - "done": Stream completion
 *
 * @param event - Parsed SSE event with type and data
 * @param callbacks - Callback handlers
 */
function processSSEEvent(event: SSEEvent, callbacks: SSECallbacks): void {
  if (process.env.NODE_ENV === 'development') {
    console.group('📨 SSE Event')
    console.log('Type:', event.event)
    console.log('Data:', event.data)
    console.groupEnd()
  }

  try {
    // Parse JSON payload
    const data = JSON.parse(event.data)

    // Route to appropriate callback based on event type
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
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ SSE: Received done event', data)
        }
        // Done callback will be invoked when stream ends
        break

      default:
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ SSE: Unknown event type:', event.event)
        }
    }

  } catch (parseError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ SSE: Failed to parse event data:', event.data, parseError)
    }
    // Don't call onError for parse errors - they're usually non-fatal
  }
}
