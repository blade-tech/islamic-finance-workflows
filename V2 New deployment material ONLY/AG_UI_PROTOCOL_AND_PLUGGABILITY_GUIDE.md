# AG-UI Protocol Alignment & AI Backend Pluggability Guide

**Document Version**: 1.0
**Date**: 2025-11-07
**Purpose**: Technical implementation guide ensuring AG-UI protocol compliance and seamless AI backend integration

---

## Table of Contents

1. [Overview](#overview)
2. [Part 1: AG-UI Protocol Compliance](#part-1-ag-ui-protocol-compliance)
3. [Part 2: Service Layer Architecture](#part-2-service-layer-architecture)
4. [Part 3: Mock-to-Real Migration Strategy](#part-3-mock-to-real-migration-strategy)
5. [Part 4: Testing Strategy](#part-4-testing-strategy)
6. [Part 5: Implementation Checklist](#part-5-implementation-checklist)

---

## Overview

This guide ensures two critical objectives:

1. **AG-UI Protocol Compliance**: Frontend follows official AG-UI specifications for natural agent-user interaction
2. **AI Backend Pluggability**: Mock services can be swapped with real AI services in < 1 day without frontend changes

### Core Principles

**AG-UI Protocol**:
- Conversational interaction (not form-based)
- Streaming responses with Server-Sent Events (SSE)
- Structured tool calls for actions
- Progressive disclosure of information
- Human-readable message formatting

**Backend Pluggability**:
- Interface-based service design
- Contract-first API specifications (OpenAPI)
- Runtime service resolution
- Type-safe mock implementations
- Zero frontend changes on backend swap

---

## Part 1: AG-UI Protocol Compliance

### 1.1 What is AG-UI Protocol?

**AG-UI (Agent-User Interface)** is a specification for building conversational interfaces with AI agents. It defines:

1. **Message Format**: Structured messages with roles (user, assistant, system)
2. **Streaming**: Real-time response streaming via SSE
3. **Tool Calls**: Structured function invocations by the agent
4. **Event Types**: Thinking, message, tool_call, tool_result, error
5. **Progressive UI**: Show agent reasoning in real-time

### 1.2 AG-UI Message Structure

```typescript
// Core message types (AG-UI compliant)
export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageContent =
  | TextContent
  | ToolCallContent
  | ToolResultContent

export interface TextContent {
  type: 'text'
  text: string
}

export interface ToolCallContent {
  type: 'tool_call'
  id: string
  name: string
  arguments: Record<string, any>
}

export interface ToolResultContent {
  type: 'tool_result'
  tool_call_id: string
  result: any
  error?: string
}

export interface Message {
  id: string
  role: MessageRole
  content: MessageContent[]
  timestamp: string
}
```

### 1.3 AG-UI Streaming Events

```typescript
// SSE event types (AG-UI compliant)
export type StreamEventType =
  | 'thinking'        // Agent is processing
  | 'message_start'   // New message beginning
  | 'message_delta'   // Incremental message content
  | 'message_complete'// Message finished
  | 'tool_call'       // Agent invoking function
  | 'tool_result'     // Function result returned
  | 'error'           // Error occurred
  | 'done'            // Stream complete

export interface StreamEvent {
  type: StreamEventType
  data: any
  timestamp: string
}

// Example: Thinking event
{
  type: 'thinking',
  data: {
    status: 'analyzing_requirements',
    message: 'Analyzing your Sukuk structure requirements...'
  },
  timestamp: '2025-11-07T12:00:00Z'
}

// Example: Message delta event
{
  type: 'message_delta',
  data: {
    delta: 'Based on your answers, I recommend activating ',
    message_id: 'msg_abc123'
  },
  timestamp: '2025-11-07T12:00:01Z'
}

// Example: Tool call event
{
  type: 'tool_call',
  data: {
    id: 'call_xyz789',
    name: 'activateControls',
    arguments: {
      dealType: 'Sukuk',
      jurisdiction: 'Malaysia',
      sustainabilityOverlay: 'SLB'
    }
  },
  timestamp: '2025-11-07T12:00:02Z'
}
```

### 1.4 AG-UI Compliance Checklist

**UI/UX Requirements**:
- [ ] Chat-based interface (not forms)
- [ ] Streaming text display (typewriter effect)
- [ ] Thinking indicators visible
- [ ] Tool calls shown in UI (e.g., "🔧 Activating controls...")
- [ ] Suggested response buttons (quick replies)
- [ ] Message timestamps
- [ ] Ability to interrupt agent
- [ ] Conversation history preserved

**Technical Requirements**:
- [ ] SSE connection management
- [ ] Graceful reconnection on disconnect
- [ ] Message buffering and ordering
- [ ] Error handling and retry logic
- [ ] Optimistic UI updates
- [ ] Loading states for tool calls

**Accessibility Requirements**:
- [ ] ARIA labels for agent messages
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus management during streaming

### 1.5 AG-UI Component Architecture

```typescript
// features/configuration/components/ConversationalConfig.tsx

import { useConversation } from '../hooks/useConversation'
import { conversationService } from '../services'

export function ConversationalConfig() {
  const {
    messages,
    isStreaming,
    thinkingStatus,
    sendMessage,
    interrupt
  } = useConversation(conversationService)

  return (
    <div className="conversation-container">
      {/* Message List */}
      <MessageList messages={messages} />

      {/* Thinking Indicator (AG-UI compliant) */}
      {thinkingStatus && (
        <ThinkingIndicator status={thinkingStatus} />
      )}

      {/* Streaming Message (AG-UI compliant) */}
      {isStreaming && (
        <StreamingMessage />
      )}

      {/* Input Area with Suggested Responses */}
      <ConversationInput
        onSend={sendMessage}
        disabled={isStreaming}
        suggestedResponses={getSuggestedResponses()}
      />

      {/* Interrupt Button (AG-UI feature) */}
      {isStreaming && (
        <Button onClick={interrupt}>Stop</Button>
      )}
    </div>
  )
}
```

### 1.6 AG-UI Streaming Implementation

```typescript
// features/configuration/hooks/useConversation.ts

import { useState, useCallback } from 'react'
import { ConversationService } from '../services/conversationService'

export function useConversation(service: ConversationService) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [thinkingStatus, setThinkingStatus] = useState<string | null>(null)
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately (optimistic update)
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: [{ type: 'text', text: content }],
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])

    // Start streaming response
    setIsStreaming(true)
    const streamId = `stream_${Date.now()}`
    setCurrentStreamId(streamId)

    try {
      // Stream response from service (AG-UI compliant)
      for await (const event of service.streamMessage(content, {
        conversationHistory: messages
      })) {
        handleStreamEvent(event, streamId)
      }
    } catch (error) {
      handleStreamError(error)
    } finally {
      setIsStreaming(false)
      setThinkingStatus(null)
      setCurrentStreamId(null)
    }
  }, [messages, service])

  const handleStreamEvent = (event: StreamEvent, streamId: string) => {
    // Only process if stream hasn't been interrupted
    if (currentStreamId !== streamId) return

    switch (event.type) {
      case 'thinking':
        setThinkingStatus(event.data.message)
        break

      case 'message_start':
        // Create assistant message skeleton
        setMessages(prev => [...prev, {
          id: event.data.message_id,
          role: 'assistant',
          content: [{ type: 'text', text: '' }],
          timestamp: event.timestamp
        }])
        break

      case 'message_delta':
        // Append text incrementally (AG-UI streaming)
        setMessages(prev => prev.map(msg =>
          msg.id === event.data.message_id
            ? {
                ...msg,
                content: [{
                  type: 'text',
                  text: (msg.content[0] as TextContent).text + event.data.delta
                }]
              }
            : msg
        ))
        break

      case 'tool_call':
        // Show tool execution in UI
        setThinkingStatus(`🔧 ${event.data.name}...`)
        break

      case 'tool_result':
        // Handle tool result (e.g., control activation)
        handleToolResult(event.data)
        break

      case 'error':
        handleStreamError(event.data.error)
        break
    }
  }

  const interrupt = useCallback(() => {
    // Interrupt current stream (AG-UI feature)
    setCurrentStreamId(null)
    setIsStreaming(false)
    setThinkingStatus(null)
  }, [])

  return {
    messages,
    isStreaming,
    thinkingStatus,
    sendMessage,
    interrupt
  }
}
```

---

## Part 2: Service Layer Architecture

### 2.1 Core Principle: Interface-Based Design

**Golden Rule**: Frontend NEVER imports implementation classes directly. Always import via interface.

```typescript
// ❌ BAD: Direct implementation import
import { MockConversationService } from './conversationService.mock'
const service = new MockConversationService()

// ✅ GOOD: Interface import with runtime resolution
import { conversationService } from './services'
// Runtime resolution based on config
```

### 2.2 Service Interface Definition

```typescript
// features/configuration/services/conversationService.ts

/**
 * Conversation service interface for AG-UI compliant interaction
 * IMPORTANT: This interface is the contract between frontend and backend
 * Any implementation (mock or real) MUST follow this exact signature
 */
export interface ConversationService {
  /**
   * Send a message and receive a streaming response
   * @param message - User message content
   * @param context - Conversation context (history, deal config, etc.)
   * @returns AsyncGenerator yielding StreamEvent objects
   */
  streamMessage(
    message: string,
    context: ConversationContext
  ): AsyncGenerator<StreamEvent, void, unknown>

  /**
   * Send a message and receive a complete response (non-streaming)
   * Used for simpler interactions or when streaming not needed
   */
  sendMessage(
    message: string,
    context: ConversationContext
  ): Promise<ConversationResponse>

  /**
   * Get suggested responses based on current conversation state
   * Used for quick reply buttons
   */
  getSuggestedResponses(
    context: ConversationContext
  ): Promise<string[]>

  /**
   * Validate user input before sending
   * Used for input validation
   */
  validateInput(
    message: string
  ): Promise<ValidationResult>
}

export interface ConversationContext {
  conversationHistory: Message[]
  dealConfiguration?: Partial<DealConfiguration>
  activatedControls?: string[]
  currentQuestionNumber?: number
}

export interface ConversationResponse {
  message: Message
  suggestedResponses?: string[]
  toolCalls?: ToolCallContent[]
  metadata?: Record<string, any>
}

export interface ValidationResult {
  valid: boolean
  error?: string
  suggestions?: string[]
}
```

### 2.3 Mock Service Implementation

```typescript
// features/configuration/services/conversationService.mock.ts

import { ConversationService, StreamEvent } from './conversationService'

/**
 * Mock implementation of ConversationService
 * Simulates real AI behavior with realistic delays and responses
 */
export class MockConversationService implements ConversationService {
  private readonly questionBank: QuestionBank
  private readonly controlActivator: ControlActivator

  constructor() {
    this.questionBank = new QuestionBank()
    this.controlActivator = new ControlActivator()
  }

  /**
   * Simulate streaming response with realistic delays
   * Follows AG-UI protocol exactly as real service would
   */
  async *streamMessage(
    message: string,
    context: ConversationContext
  ): AsyncGenerator<StreamEvent, void, unknown> {
    // 1. Thinking phase (simulated processing)
    yield {
      type: 'thinking',
      data: {
        status: 'analyzing',
        message: 'Analyzing your requirements...'
      },
      timestamp: new Date().toISOString()
    }
    await delay(800) // Simulate processing time

    // 2. Determine next question or response
    const nextQuestion = this.questionBank.getNextQuestion(context)

    // 3. Start message
    const messageId = `msg_${Date.now()}`
    yield {
      type: 'message_start',
      data: { message_id: messageId },
      timestamp: new Date().toISOString()
    }

    // 4. Stream response text (word by word for realism)
    const responseText = this.generateResponse(message, context, nextQuestion)
    for (const word of responseText.split(' ')) {
      yield {
        type: 'message_delta',
        data: {
          message_id: messageId,
          delta: word + ' '
        },
        timestamp: new Date().toISOString()
      }
      await delay(50) // Simulate typing speed
    }

    // 5. Tool call if needed (e.g., activate controls)
    if (this.shouldActivateControls(context)) {
      yield {
        type: 'thinking',
        data: {
          status: 'activating_controls',
          message: 'Activating relevant controls...'
        },
        timestamp: new Date().toISOString()
      }
      await delay(500)

      const toolCallId = `call_${Date.now()}`
      yield {
        type: 'tool_call',
        data: {
          id: toolCallId,
          name: 'activateControls',
          arguments: this.extractControlActivationArgs(context)
        },
        timestamp: new Date().toISOString()
      }

      // Simulate control activation
      await delay(300)
      const activatedControls = this.controlActivator.activate(
        this.extractControlActivationArgs(context)
      )

      yield {
        type: 'tool_result',
        data: {
          tool_call_id: toolCallId,
          result: {
            activatedControls,
            bucketScores: this.calculateBucketScores(activatedControls)
          }
        },
        timestamp: new Date().toISOString()
      }
    }

    // 6. Complete message
    yield {
      type: 'message_complete',
      data: { message_id: messageId },
      timestamp: new Date().toISOString()
    }

    // 7. Done
    yield {
      type: 'done',
      data: {},
      timestamp: new Date().toISOString()
    }
  }

  async sendMessage(
    message: string,
    context: ConversationContext
  ): Promise<ConversationResponse> {
    // Non-streaming version (simpler, for when streaming not needed)
    await delay(1000) // Simulate network latency

    const nextQuestion = this.questionBank.getNextQuestion(context)
    const responseText = this.generateResponse(message, context, nextQuestion)

    return {
      message: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: [{ type: 'text', text: responseText }],
        timestamp: new Date().toISOString()
      },
      suggestedResponses: this.questionBank.getSuggestedAnswers(nextQuestion),
      metadata: {
        questionNumber: context.currentQuestionNumber || 1,
        totalQuestions: 12
      }
    }
  }

  async getSuggestedResponses(
    context: ConversationContext
  ): Promise<string[]> {
    const nextQuestion = this.questionBank.getNextQuestion(context)
    return this.questionBank.getSuggestedAnswers(nextQuestion)
  }

  async validateInput(message: string): Promise<ValidationResult> {
    if (message.trim().length < 3) {
      return {
        valid: false,
        error: 'Please provide more details'
      }
    }
    return { valid: true }
  }

  // Private helper methods
  private generateResponse(
    message: string,
    context: ConversationContext,
    nextQuestion: Question | null
  ): string {
    // Generate natural language response based on context
    // This simulates what real AI would generate
    // ...
  }

  private shouldActivateControls(context: ConversationContext): boolean {
    // Determine if we've collected enough info to activate controls
    return (context.currentQuestionNumber || 0) >= 12
  }

  private extractControlActivationArgs(
    context: ConversationContext
  ): ControlActivationArgs {
    // Extract structured data from conversation context
    return {
      productType: context.dealConfiguration?.productType,
      jurisdiction: context.dealConfiguration?.primaryJurisdiction,
      // ... other parameters
    }
  }
}

// Helper function for realistic delays
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### 2.4 Real Service Implementation (Future)

```typescript
// features/configuration/services/conversationService.real.ts

import { ConversationService, StreamEvent } from './conversationService'

/**
 * Real implementation connecting to backend AI service
 * IMPORTANT: Uses SAME interface as mock - frontend unchanged
 */
export class RealConversationService implements ConversationService {
  private readonly apiClient: ApiClient
  private readonly baseUrl: string

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }

  /**
   * Stream response from real backend AI service
   * Uses SSE exactly as mock does - UI sees no difference
   */
  async *streamMessage(
    message: string,
    context: ConversationContext
  ): AsyncGenerator<StreamEvent, void, unknown> {
    // Open SSE connection to backend
    const eventSource = new EventSource(
      `${this.baseUrl}/api/conversation/stream`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      }
    )

    // Create async generator from SSE events
    const eventQueue: StreamEvent[] = []
    let resolveNext: ((value: IteratorResult<StreamEvent>) => void) | null = null

    eventSource.onmessage = (event) => {
      const streamEvent: StreamEvent = JSON.parse(event.data)

      if (resolveNext) {
        resolveNext({ value: streamEvent, done: false })
        resolveNext = null
      } else {
        eventQueue.push(streamEvent)
      }

      if (streamEvent.type === 'done') {
        eventSource.close()
      }
    }

    eventSource.onerror = (error) => {
      eventSource.close()
      if (resolveNext) {
        resolveNext({ value: undefined, done: true })
      }
    }

    // Yield events as they arrive
    while (true) {
      if (eventQueue.length > 0) {
        const event = eventQueue.shift()!
        yield event
        if (event.type === 'done') break
      } else {
        // Wait for next event
        await new Promise<void>(resolve => {
          resolveNext = (result) => {
            if (!result.done) {
              eventQueue.push(result.value)
            }
            resolve()
          }
        })
      }
    }
  }

  async sendMessage(
    message: string,
    context: ConversationContext
  ): Promise<ConversationResponse> {
    // Standard REST API call
    return this.apiClient.post('/api/conversation/message', {
      message,
      context
    })
  }

  async getSuggestedResponses(
    context: ConversationContext
  ): Promise<string[]> {
    const response = await this.apiClient.post('/api/conversation/suggestions', {
      context
    })
    return response.suggestions
  }

  async validateInput(message: string): Promise<ValidationResult> {
    const response = await this.apiClient.post('/api/conversation/validate', {
      message
    })
    return response
  }
}
```

### 2.5 Service Resolution (Runtime Selection)

```typescript
// features/configuration/services/index.ts

import { ConversationService } from './conversationService'
import { MockConversationService } from './conversationService.mock'
import { RealConversationService } from './conversationService.real'
import { apiClient } from '@/lib/api/client'
import { config } from '@/lib/config'

/**
 * Service factory - returns mock or real based on config
 * CRITICAL: Frontend imports this, not implementation classes
 */
export const conversationService: ConversationService = (() => {
  if (config.useMockServices) {
    console.log('[ConversationService] Using mock implementation')
    return new MockConversationService()
  } else {
    console.log('[ConversationService] Using real implementation')
    return new RealConversationService(apiClient)
  }
})()

// Export interface (not implementations) for type safety
export type { ConversationService, ConversationContext, ConversationResponse }
```

### 2.6 Configuration Management

```typescript
// lib/config/app.config.ts

export interface AppConfig {
  useMockServices: boolean
  apiUrl: string
  enableDebugMode: boolean
  // ... other config
}

export const config: AppConfig = {
  // Read from environment variable
  useMockServices: process.env.NEXT_PUBLIC_API_MODE === 'mock',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  enableDebugMode: process.env.NEXT_PUBLIC_DEBUG === 'true',
}

// Validate config on load
if (!config.useMockServices && !config.apiUrl) {
  console.warn('Real services enabled but API_URL not set. Falling back to mock.')
  config.useMockServices = true
}
```

---

## Part 3: Mock-to-Real Migration Strategy

### 3.1 Migration Checklist

**Before Migration**:
- [ ] All frontend components use service interfaces (not implementations)
- [ ] All service methods have mock implementations
- [ ] All API contracts documented in OpenAPI specs
- [ ] TypeScript types match API contracts exactly
- [ ] Mock services simulate realistic delays and errors
- [ ] Integration tests pass with mock services

**Backend Ready**:
- [ ] Backend implements API endpoints matching OpenAPI specs
- [ ] Backend supports SSE for streaming responses
- [ ] Backend API returns data in exact format as mocks
- [ ] Backend CORS configured for frontend domain
- [ ] Backend environment variables configured

**Migration Steps**:
1. Deploy backend to staging environment
2. Update `NEXT_PUBLIC_API_URL` to staging URL
3. Change `NEXT_PUBLIC_API_MODE` from `mock` to `real`
4. Run integration tests
5. Fix any API contract mismatches
6. Deploy to production

**Estimated Time**: < 1 day if contracts followed correctly

### 3.2 Contract Validation

```typescript
// tests/contract-validation.test.ts

/**
 * Contract tests ensure mock and real services behave identically
 * Run these before and after migration
 */

describe('ConversationService Contract', () => {
  // Test with both mock and real implementations
  const services = [
    { name: 'Mock', service: new MockConversationService() },
    { name: 'Real', service: new RealConversationService(apiClient) }
  ]

  services.forEach(({ name, service }) => {
    describe(`${name} implementation`, () => {
      it('should stream messages with correct event types', async () => {
        const context: ConversationContext = {
          conversationHistory: [],
          currentQuestionNumber: 1
        }

        const events: StreamEvent[] = []
        for await (const event of service.streamMessage('Hello', context)) {
          events.push(event)
        }

        // Verify event sequence matches AG-UI protocol
        expect(events[0].type).toBe('thinking')
        expect(events[1].type).toBe('message_start')
        expect(events[events.length - 1].type).toBe('done')
      })

      it('should return suggested responses', async () => {
        const suggestions = await service.getSuggestedResponses({
          conversationHistory: [],
          currentQuestionNumber: 1
        })

        expect(Array.isArray(suggestions)).toBe(true)
        expect(suggestions.length).toBeGreaterThan(0)
        suggestions.forEach(s => expect(typeof s).toBe('string'))
      })

      it('should validate input correctly', async () => {
        const validResult = await service.validateInput('Valid input text')
        expect(validResult.valid).toBe(true)

        const invalidResult = await service.validateInput('x')
        expect(invalidResult.valid).toBe(false)
        expect(invalidResult.error).toBeDefined()
      })
    })
  })
})
```

### 3.3 API Contract (OpenAPI Specification)

```yaml
# contracts/conversation-api.yaml

openapi: 3.1.0
info:
  title: ZeroH V2 Conversation API
  version: 1.0.0
  description: AG-UI compliant conversation API

paths:
  /api/conversation/stream:
    post:
      summary: Stream conversation response
      description: Returns SSE stream of conversation events (AG-UI protocol)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  description: User message content
                context:
                  $ref: '#/components/schemas/ConversationContext'
      responses:
        '200':
          description: SSE stream of conversation events
          content:
            text/event-stream:
              schema:
                $ref: '#/components/schemas/StreamEvent'

  /api/conversation/message:
    post:
      summary: Send message (non-streaming)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                context:
                  $ref: '#/components/schemas/ConversationContext'
      responses:
        '200':
          description: Complete conversation response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ConversationResponse'

components:
  schemas:
    ConversationContext:
      type: object
      properties:
        conversationHistory:
          type: array
          items:
            $ref: '#/components/schemas/Message'
        dealConfiguration:
          $ref: '#/components/schemas/DealConfiguration'
        activatedControls:
          type: array
          items:
            type: string
        currentQuestionNumber:
          type: integer

    Message:
      type: object
      required:
        - id
        - role
        - content
        - timestamp
      properties:
        id:
          type: string
        role:
          type: string
          enum: [user, assistant, system]
        content:
          type: array
          items:
            oneOf:
              - $ref: '#/components/schemas/TextContent'
              - $ref: '#/components/schemas/ToolCallContent'
              - $ref: '#/components/schemas/ToolResultContent'
        timestamp:
          type: string
          format: date-time

    TextContent:
      type: object
      required:
        - type
        - text
      properties:
        type:
          type: string
          const: text
        text:
          type: string

    ToolCallContent:
      type: object
      required:
        - type
        - id
        - name
        - arguments
      properties:
        type:
          type: string
          const: tool_call
        id:
          type: string
        name:
          type: string
        arguments:
          type: object

    ToolResultContent:
      type: object
      required:
        - type
        - tool_call_id
        - result
      properties:
        type:
          type: string
          const: tool_result
        tool_call_id:
          type: string
        result:
          type: object
        error:
          type: string

    StreamEvent:
      type: object
      required:
        - type
        - data
        - timestamp
      properties:
        type:
          type: string
          enum:
            - thinking
            - message_start
            - message_delta
            - message_complete
            - tool_call
            - tool_result
            - error
            - done
        data:
          type: object
        timestamp:
          type: string
          format: date-time

    ConversationResponse:
      type: object
      required:
        - message
      properties:
        message:
          $ref: '#/components/schemas/Message'
        suggestedResponses:
          type: array
          items:
            type: string
        toolCalls:
          type: array
          items:
            $ref: '#/components/schemas/ToolCallContent'
        metadata:
          type: object

    DealConfiguration:
      type: object
      properties:
        productType:
          type: string
          enum: [Sukuk, Murabaha, Ijara, Musharaka, Mudaraba, Istisna, Salam, Wakala]
        sustainabilityOverlay:
          type: string
          enum: [None, GBP, SBP, SLB, Transition]
        primaryJurisdiction:
          type: string
        # ... other properties (see ARCHITECTURE_SESSION_FINDINGS.md)
```

### 3.4 Type Generation from OpenAPI

```json
// package.json scripts
{
  "scripts": {
    "generate:api-types": "openapi-typescript contracts/conversation-api.yaml -o src/lib/api/generated-types.ts",
    "validate:contracts": "openapi-generator validate -i contracts/conversation-api.yaml"
  }
}
```

```typescript
// After running generate:api-types
import type { paths, components } from '@/lib/api/generated-types'

// Type-safe API client
type ConversationRequest = paths['/api/conversation/message']['post']['requestBody']['content']['application/json']
type ConversationResponse = paths['/api/conversation/message']['post']['responses']['200']['content']['application/json']

// TypeScript ensures frontend matches backend contract exactly!
```

---

## Part 4: Testing Strategy

### 4.1 AG-UI Protocol Compliance Tests

```typescript
// tests/ag-ui-compliance.test.ts

/**
 * Test suite to ensure AG-UI protocol compliance
 * Run these to verify implementation follows spec
 */

describe('AG-UI Protocol Compliance', () => {
  it('should support streaming responses', async () => {
    const service = new MockConversationService()
    const stream = service.streamMessage('Hello', { conversationHistory: [] })

    let hasThinking = false
    let hasMessageStart = false
    let hasDelta = false
    let hasDone = false

    for await (const event of stream) {
      if (event.type === 'thinking') hasThinking = true
      if (event.type === 'message_start') hasMessageStart = true
      if (event.type === 'message_delta') hasDelta = true
      if (event.type === 'done') hasDone = true
    }

    expect(hasThinking).toBe(true)
    expect(hasMessageStart).toBe(true)
    expect(hasDelta).toBe(true)
    expect(hasDone).toBe(true)
  })

  it('should provide tool call structure', async () => {
    const service = new MockConversationService()
    const context: ConversationContext = {
      conversationHistory: [],
      currentQuestionNumber: 12, // Trigger control activation
      dealConfiguration: {
        productType: 'Sukuk',
        sustainabilityOverlay: 'SLB'
      }
    }

    const events: StreamEvent[] = []
    for await (const event of service.streamMessage('Done', context)) {
      events.push(event)
    }

    const toolCallEvent = events.find(e => e.type === 'tool_call')
    expect(toolCallEvent).toBeDefined()
    expect(toolCallEvent!.data).toHaveProperty('id')
    expect(toolCallEvent!.data).toHaveProperty('name')
    expect(toolCallEvent!.data).toHaveProperty('arguments')
  })

  it('should handle interruption gracefully', async () => {
    const service = new MockConversationService()
    const stream = service.streamMessage('Hello', { conversationHistory: [] })

    let eventCount = 0
    for await (const event of stream) {
      eventCount++
      if (eventCount === 3) {
        // Simulate interruption
        break
      }
    }

    expect(eventCount).toBe(3)
    // Should not throw error on early exit
  })
})
```

### 4.2 Service Pluggability Tests

```typescript
// tests/service-pluggability.test.ts

/**
 * Test suite to ensure services are pluggable
 * Verifies mock can be swapped with real without frontend changes
 */

describe('Service Pluggability', () => {
  it('should resolve correct service based on config', () => {
    // Mock mode
    process.env.NEXT_PUBLIC_API_MODE = 'mock'
    const mockService = resolveConversationService()
    expect(mockService).toBeInstanceOf(MockConversationService)

    // Real mode
    process.env.NEXT_PUBLIC_API_MODE = 'real'
    const realService = resolveConversationService()
    expect(realService).toBeInstanceOf(RealConversationService)
  })

  it('should have identical interfaces for mock and real', () => {
    const mockMethods = Object.getOwnPropertyNames(MockConversationService.prototype)
    const realMethods = Object.getOwnPropertyNames(RealConversationService.prototype)

    expect(mockMethods.sort()).toEqual(realMethods.sort())
  })

  it('should return compatible types', async () => {
    const mockService = new MockConversationService()
    const mockResponse = await mockService.sendMessage('Test', { conversationHistory: [] })

    // Type check (compile-time)
    const assertType = (response: ConversationResponse) => response
    assertType(mockResponse) // Should compile without error

    // Runtime check
    expect(mockResponse).toHaveProperty('message')
    expect(mockResponse.message).toHaveProperty('id')
    expect(mockResponse.message).toHaveProperty('role')
    expect(mockResponse.message).toHaveProperty('content')
    expect(mockResponse.message).toHaveProperty('timestamp')
  })
})
```

### 4.3 Contract Validation Tests

```typescript
// tests/api-contract-validation.test.ts

/**
 * Test suite to validate API contracts
 * Ensures mock responses match OpenAPI spec exactly
 */

import { validateAgainstSchema } from 'openapi-validator'

describe('API Contract Validation', () => {
  it('should match OpenAPI schema for conversation response', async () => {
    const service = new MockConversationService()
    const response = await service.sendMessage('Test', { conversationHistory: [] })

    // Validate against OpenAPI schema
    const validation = validateAgainstSchema(
      response,
      'ConversationResponse',
      'contracts/conversation-api.yaml'
    )

    expect(validation.valid).toBe(true)
    if (!validation.valid) {
      console.error('Schema validation errors:', validation.errors)
    }
  })

  it('should match OpenAPI schema for stream events', async () => {
    const service = new MockConversationService()
    const events: StreamEvent[] = []

    for await (const event of service.streamMessage('Test', { conversationHistory: [] })) {
      events.push(event)

      // Validate each event
      const validation = validateAgainstSchema(
        event,
        'StreamEvent',
        'contracts/conversation-api.yaml'
      )

      expect(validation.valid).toBe(true)
    }

    expect(events.length).toBeGreaterThan(0)
  })
})
```

---

## Part 5: Implementation Checklist

### 5.1 AG-UI Protocol Implementation

**Phase 1: Core Components**
- [ ] Create `Message` type with AG-UI structure
- [ ] Create `StreamEvent` type with all event types
- [ ] Implement `useConversation` hook with streaming support
- [ ] Create `ConversationalConfig` component with chat UI
- [ ] Add thinking indicator component
- [ ] Add streaming message component
- [ ] Implement interrupt functionality

**Phase 2: Service Layer**
- [ ] Define `ConversationService` interface
- [ ] Implement `MockConversationService` with AG-UI compliance
- [ ] Create `QuestionBank` for 12-question MVQ
- [ ] Create `ControlActivator` for control logic
- [ ] Implement realistic delays and streaming
- [ ] Add suggested responses feature

**Phase 3: Integration**
- [ ] Connect `useConversation` hook to service
- [ ] Implement SSE parsing for streaming
- [ ] Add error handling and retry logic
- [ ] Implement optimistic UI updates
- [ ] Add conversation state persistence
- [ ] Create control activation visualization

**Phase 4: Testing**
- [ ] Write AG-UI protocol compliance tests
- [ ] Write service pluggability tests
- [ ] Write API contract validation tests
- [ ] Manual testing with realistic scenarios
- [ ] Performance testing (streaming speed)
- [ ] Accessibility testing

### 5.2 Backend Pluggability Implementation

**Phase 1: Architecture Setup**
- [ ] Create service interface file
- [ ] Define all service methods
- [ ] Document all parameters and return types
- [ ] Create OpenAPI specification
- [ ] Setup type generation from OpenAPI

**Phase 2: Mock Implementation**
- [ ] Implement all interface methods in mock
- [ ] Add realistic delays (network latency simulation)
- [ ] Implement error scenarios
- [ ] Create comprehensive mock data
- [ ] Add logging for debugging

**Phase 3: Service Resolution**
- [ ] Create service factory with config-based resolution
- [ ] Setup environment variable configuration
- [ ] Add service initialization logging
- [ ] Implement fallback to mock on error

**Phase 4: Real Implementation Preparation**
- [ ] Document all API endpoints needed
- [ ] Provide OpenAPI spec to backend team
- [ ] Create request/response examples
- [ ] Define error response formats
- [ ] Document authentication requirements

**Phase 5: Migration**
- [ ] Deploy backend to staging
- [ ] Update environment variables
- [ ] Run contract validation tests
- [ ] Fix any mismatches
- [ ] Deploy to production
- [ ] Monitor for errors

### 5.3 Pre-Migration Validation

**Checklist Before Switching to Real Backend**:

1. **TypeScript Compilation**
   - [ ] No TypeScript errors
   - [ ] All types generated from OpenAPI
   - [ ] No `any` types in service calls

2. **Contract Tests**
   - [ ] All contract tests pass with mock
   - [ ] OpenAPI spec validated
   - [ ] Type generation successful

3. **Integration Tests**
   - [ ] All user flows work with mock
   - [ ] Streaming works correctly
   - [ ] Error handling works
   - [ ] Interruption works

4. **Documentation**
   - [ ] API endpoints documented
   - [ ] Request/response examples provided
   - [ ] Error codes documented
   - [ ] Authentication flow documented

5. **Environment**
   - [ ] Backend staging URL configured
   - [ ] CORS configured correctly
   - [ ] Environment variables documented
   - [ ] Secrets management setup

---

## Appendix A: AG-UI Protocol Reference

### Official Specification

AG-UI protocol specification (summary):

1. **Message Structure**:
   - Roles: user, assistant, system
   - Content: text, tool_call, tool_result
   - Metadata: id, timestamp

2. **Streaming Events**:
   - thinking: Agent processing
   - message_start: New message beginning
   - message_delta: Incremental content
   - message_complete: Message finished
   - tool_call: Function invocation
   - tool_result: Function result
   - error: Error occurred
   - done: Stream complete

3. **Tool Calls**:
   - Structured function invocations
   - Arguments validated against schema
   - Results returned to agent

4. **UI Guidelines**:
   - Show thinking states
   - Stream text naturally (typewriter effect)
   - Display tool calls visually
   - Allow interruption
   - Preserve conversation history

---

## Appendix B: Service Interface Template

```typescript
/**
 * Template for creating new pluggable services
 * Copy this template and modify for each service
 */

// 1. Define interface
export interface YourService {
  mainMethod(params: Params): Promise<Response>
  supportMethod(params: Params): Promise<Response>
}

// 2. Create mock implementation
export class MockYourService implements YourService {
  async mainMethod(params: Params): Promise<Response> {
    await delay(1000) // Simulate network
    return {
      // Return realistic mock data
    }
  }

  async supportMethod(params: Params): Promise<Response> {
    await delay(500)
    return {
      // Return realistic mock data
    }
  }
}

// 3. Create real implementation (when ready)
export class RealYourService implements YourService {
  constructor(private apiClient: ApiClient) {}

  async mainMethod(params: Params): Promise<Response> {
    return this.apiClient.post('/api/your/endpoint', params)
  }

  async supportMethod(params: Params): Promise<Response> {
    return this.apiClient.get('/api/your/support', params)
  }
}

// 4. Export resolved service
export const yourService: YourService = config.useMockServices
  ? new MockYourService()
  : new RealYourService(apiClient)
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | Claude | Initial guide for AG-UI protocol and backend pluggability |

---

**END OF GUIDE**

This guide ensures ZeroH V2 is built with AG-UI protocol compliance and seamless backend pluggability from day one. Follow these patterns consistently across all services for a production-ready architecture.
