# ZeroH V2: AG-UI Protocol Demo Project Blueprint

**Version**: 2.0.0
**Status**: Architecture & Planning Phase
**Date**: 2025-11-07
**Deployment**: Netlify (Frontend-only with Mocks)

---

## Executive Summary

ZeroH V2 is a complete rewrite implementing AG-UI Protocol (Agent-User Interaction) for Islamic finance compliance. This is a **production-quality frontend demo** with realistic mocks, designed to be a drop-in replacement when backend microservices are ready.

### Strategic Goals

1. **Showcase AG-UI Protocol**: Conversational, streaming-first UX
2. **Reduce Complexity**: 3 steps vs 12 steps (75% reduction)
3. **Production-Ready Architecture**: Not a prototype - real patterns
4. **Backend-Ready**: Mock-to-real swap in < 1 day
5. **Netlify Optimized**: Static export, edge functions ready
6. **Microservice Alignment**: Assumes 8 microservices exist (mocked)

---

## Project Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                    │
│                     Deployed on Netlify Edge                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
         ┌──────────▼────────┐  ┌────────▼─────────┐
         │   Service Layer   │  │   Mock Layer     │
         │   (Interfaces)    │  │ (Implementations)│
         └──────────┬────────┘  └────────┬─────────┘
                    │                    │
                    └────────┬───────────┘
                             │
              ┌──────────────▼──────────────────┐
              │    Backend Microservices        │
              │  (Mocked now, Real later)       │
              │                                 │
              │  1. Workflow Designer Service   │
              │  2. Control Engine Service      │
              │  3. Agent Orchestration Service │
              │  4. Evidence Vault Service      │
              │  5. Proof Layer Service         │
              │  6. Dashboard Generator Service │
              │  7. Trust Portal Service        │
              │  8. Asset Tokenization Service  │
              └─────────────────────────────────┘
```

### Key Architectural Principles

1. **Mock-to-Real Pattern**: All backend interactions go through service layer with mock implementations
2. **Contract-First**: OpenAPI specs define service contracts (even for mocks)
3. **Type-Safe**: Full TypeScript, Zod validation, auto-generated types
4. **Streaming-First**: AG-UI protocol uses SSE/WebSocket patterns (mocked with delays)
5. **Stateless Frontend**: All state lives in backend (mocked in localStorage for demo)
6. **Component Isolation**: Each feature is self-contained module

---

## Repository Structure

```
zeroh-v2/
├── .github/
│   ├── workflows/
│   │   ├── deploy-preview.yml      # Netlify preview deployments
│   │   ├── deploy-production.yml   # Main branch → production
│   │   └── type-check.yml          # CI for TypeScript validation
│   └── PULL_REQUEST_TEMPLATE.md
│
├── public/
│   ├── assets/
│   │   ├── images/                 # Static images
│   │   ├── icons/                  # SVG icons
│   │   └── fonts/                  # Custom fonts (if any)
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── (marketing)/            # Marketing pages (landing, about)
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── about/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (demo)/                 # Main demo application
│   │   │   ├── layout.tsx          # Demo layout with nav
│   │   │   ├── page.tsx            # Demo home (Step 0)
│   │   │   │
│   │   │   ├── configure/          # Step 1: Conversational Config
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/    # Step-specific components
│   │   │   │       ├── ChatInterface.tsx
│   │   │   │       ├── ControlMatrix.tsx
│   │   │   │       └── ProgressIndicator.tsx
│   │   │   │
│   │   │   ├── review/             # Step 2: Review & Confirm
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── ConfigSummary.tsx
│   │   │   │       ├── ControlActivationTable.tsx
│   │   │   │       └── PolicyPreview.tsx
│   │   │   │
│   │   │   └── dashboard/          # Step 3: GRC Dashboard
│   │   │       ├── [dealId]/
│   │   │       │   ├── page.tsx    # Deal detail view
│   │   │       │   ├── evidence/
│   │   │       │   ├── tasks/
│   │   │       │   └── credentials/
│   │   │       └── page.tsx        # Dashboard home
│   │   │
│   │   ├── api/                    # API routes (mock endpoints)
│   │   │   ├── chat/
│   │   │   │   └── route.ts        # SSE chat stream mock
│   │   │   ├── deals/
│   │   │   │   ├── route.ts        # Create deal
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # Get deal details
│   │   │   └── controls/
│   │   │       └── activate/
│   │   │           └── route.ts    # Control activation logic
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Tailwind imports
│   │   └── providers.tsx           # React Query, Theme providers
│   │
│   ├── features/                   # Feature-based organization
│   │   ├── configuration/          # Conversational configuration feature
│   │   │   ├── components/
│   │   │   │   ├── ConversationalAgent.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── SuggestedResponses.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useConversation.ts
│   │   │   │   └── useControlActivation.ts
│   │   │   ├── services/
│   │   │   │   ├── conversationService.ts     # Mock conversation logic
│   │   │   │   └── conversationService.real.ts # Real API (template)
│   │   │   ├── types/
│   │   │   │   └── configuration.types.ts
│   │   │   └── utils/
│   │   │       └── parseUserMessage.ts
│   │   │
│   │   ├── compliance/             # GRC Dashboard feature
│   │   │   ├── components/
│   │   │   │   ├── BucketScore.tsx
│   │   │   │   ├── ControlCard.tsx
│   │   │   │   └── ComplianceOverview.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDealCompliance.ts
│   │   │   ├── services/
│   │   │   │   ├── complianceService.ts       # Mock
│   │   │   │   └── complianceService.real.ts  # Real
│   │   │   └── types/
│   │   │       └── compliance.types.ts
│   │   │
│   │   ├── evidence/               # Evidence vault feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   └── credentials/            # Verifiable Credentials feature
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types/
│   │
│   ├── lib/                        # Shared utilities
│   │   ├── api/                    # API client layer
│   │   │   ├── client.ts           # Base HTTP client (fetch wrapper)
│   │   │   ├── mock-client.ts      # Mock client implementation
│   │   │   └── types.ts            # API response types
│   │   │
│   │   ├── config/                 # Configuration
│   │   │   ├── app.config.ts       # App-level config
│   │   │   ├── routes.ts           # Route constants
│   │   │   └── features.ts         # Feature flags
│   │   │
│   │   ├── hooks/                  # Shared hooks
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useDebounce.ts
│   │   │
│   │   ├── stores/                 # State management
│   │   │   ├── demo.store.ts       # Main demo state (Zustand)
│   │   │   └── ui.store.ts         # UI state (modals, etc)
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── cn.ts               # Class name merger
│   │   │   ├── format.ts           # Formatters
│   │   │   └── validation.ts       # Zod schemas
│   │   │
│   │   └── constants/              # Constants
│   │       ├── controls.ts         # 26 controls definition
│   │       ├── buckets.ts          # 5 buckets definition
│   │       └── questions.ts        # 12 questions MVQ
│   │
│   ├── components/                 # Shared UI components
│   │   ├── ui/                     # Radix UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (30+ components)
│   │   │
│   │   ├── layouts/                # Layout components
│   │   │   ├── DemoLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   └── common/                 # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── mocks/                      # Mock data & services
│   │   ├── data/                   # Static mock data
│   │   │   ├── deals.mock.ts
│   │   │   ├── controls.mock.ts
│   │   │   ├── evidence.mock.ts
│   │   │   └── credentials.mock.ts
│   │   │
│   │   ├── handlers/               # MSW handlers (for tests)
│   │   │   ├── chat.handlers.ts
│   │   │   └── deals.handlers.ts
│   │   │
│   │   └── browser.ts              # MSW browser setup
│   │
│   ├── types/                      # Global TypeScript types
│   │   ├── index.ts                # Re-exports all types
│   │   ├── deal.types.ts
│   │   ├── control.types.ts
│   │   └── api.types.ts
│   │
│   └── styles/                     # Global styles
│       ├── globals.css             # Tailwind + custom CSS
│       └── themes.css              # Theme variables
│
├── contracts/                      # API contracts (OpenAPI specs)
│   ├── workflow-designer.openapi.yaml
│   ├── control-engine.openapi.yaml
│   ├── agent-orchestration.openapi.yaml
│   └── ... (one per microservice)
│
├── scripts/                        # Build & dev scripts
│   ├── generate-types.ts           # Generate TS from OpenAPI
│   ├── validate-contracts.ts       # Validate OpenAPI specs
│   └── seed-mocks.ts               # Generate mock data
│
├── docs/                           # Documentation
│   ├── ARCHITECTURE.md             # System architecture
│   ├── MOCK_TO_REAL_GUIDE.md       # Migration guide
│   ├── COMPONENT_LIBRARY.md        # Component docs
│   └── API_CONTRACTS.md            # API documentation
│
├── .env.example                    # Environment variables template
├── .env.local                      # Local development env
├── .eslintrc.json                  # ESLint config
├── .prettierrc                     # Prettier config
├── next.config.js                  # Next.js config (static export)
├── netlify.toml                    # Netlify deployment config
├── package.json
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind config
└── README.md                       # Project README
```

---

## Technology Stack

### Core Framework
- **Next.js 14.2.x** (App Router, React Server Components)
- **React 18.3.x** (with Concurrent Features)
- **TypeScript 5.6.x** (Strict mode enabled)

### Styling & UI
- **Tailwind CSS 3.4.x** (Utility-first CSS)
- **Radix UI** (Accessible primitives)
- **Framer Motion** (Animations)
- **Lucide Icons** (Icon library)
- **class-variance-authority** (Component variants)

### State Management
- **Zustand 4.x** (Lightweight state management)
- **TanStack Query v5** (Server state, caching)
- **React Hook Form** (Form state - if needed)
- **Zod** (Runtime validation)

### Data & API
- **OpenAPI 3.1** (Contract-first API design)
- **openapi-typescript** (Generate TS types from specs)
- **MSW (Mock Service Worker)** (API mocking for tests)
- **SWR / TanStack Query** (Data fetching & caching)

### Development Tools
- **ESLint** (Linting)
- **Prettier** (Code formatting)
- **Husky** (Git hooks)
- **lint-staged** (Pre-commit linting)
- **TypeScript ESLint** (TS-aware linting)

### Testing (Phase 2)
- **Vitest** (Unit testing)
- **Testing Library** (Component testing)
- **Playwright** (E2E testing)
- **MSW** (API mocking)

### Deployment
- **Netlify** (Hosting & CDN)
- **Netlify Edge Functions** (Future: serverless endpoints)
- **GitHub Actions** (CI/CD)

---

## Key Design Patterns

### 1. Service Layer Pattern

**Problem**: Direct API calls make mock-to-real migration painful.

**Solution**: All backend interactions go through service layer with swappable implementations.

```typescript
// features/configuration/services/conversationService.ts
// This is the INTERFACE - both mock and real implement this
export interface ConversationService {
  sendMessage(message: string, context: ConfigContext): Promise<AgentResponse>
  streamMessage(message: string, context: ConfigContext): AsyncGenerator<MessageChunk>
}

// features/configuration/services/conversationService.mock.ts
// MOCK implementation (used in V2 demo)
export class MockConversationService implements ConversationService {
  async sendMessage(message: string, context: ConfigContext): Promise<AgentResponse> {
    // Simulate network delay
    await delay(1000)

    // Return hardcoded/rule-based response
    return {
      message: this.generateResponse(message, context),
      suggestedResponses: this.getSuggestions(context.questionNumber),
    }
  }

  async *streamMessage(message: string, context: ConfigContext): AsyncGenerator<MessageChunk> {
    const response = await this.sendMessage(message, context)

    // Simulate streaming by yielding chunks
    for (const chunk of this.chunkText(response.message, 10)) {
      await delay(50)
      yield { type: 'content', content: chunk }
    }

    yield { type: 'suggestions', suggestions: response.suggestedResponses }
    yield { type: 'done' }
  }
}

// features/configuration/services/conversationService.real.ts
// REAL implementation (template for future)
export class RealConversationService implements ConversationService {
  constructor(private apiClient: ApiClient) {}

  async sendMessage(message: string, context: ConfigContext): Promise<AgentResponse> {
    // Call actual backend API
    return this.apiClient.post('/api/agent/chat', { message, context })
  }

  async *streamMessage(message: string, context: ConfigContext): AsyncGenerator<MessageChunk> {
    // Use SSE from actual backend
    const stream = await this.apiClient.stream('/api/agent/chat/stream', { message, context })

    for await (const chunk of stream) {
      yield chunk
    }
  }
}

// features/configuration/services/index.ts
// FACTORY - switches between mock and real
import { MockConversationService } from './conversationService.mock'
import { RealConversationService } from './conversationService.real'
import { config } from '@/lib/config/app.config'

export const conversationService = config.useMockServices
  ? new MockConversationService()
  : new RealConversationService(apiClient)
```

### 2. Contract-First API Design

**Problem**: Frontend and backend teams need to work in parallel.

**Solution**: Define OpenAPI contracts first, generate types, mock from contracts.

```yaml
# contracts/agent-orchestration.openapi.yaml
openapi: 3.1.0
info:
  title: Agent Orchestration Service
  version: 1.0.0

paths:
  /api/agent/chat:
    post:
      summary: Send message to conversational agent
      operationId: sendChatMessage
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatRequest'
      responses:
        '200':
          description: Agent response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatResponse'

  /api/agent/chat/stream:
    post:
      summary: Stream agent responses (SSE)
      operationId: streamChatMessage
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatRequest'
      responses:
        '200':
          description: SSE stream of message chunks
          content:
            text/event-stream:
              schema:
                $ref: '#/components/schemas/MessageChunk'

components:
  schemas:
    ChatRequest:
      type: object
      required:
        - message
        - context
      properties:
        message:
          type: string
          description: User message
        context:
          $ref: '#/components/schemas/ConfigContext'

    ChatResponse:
      type: object
      required:
        - message
      properties:
        message:
          type: string
        suggestedResponses:
          type: array
          items:
            type: string

    ConfigContext:
      type: object
      properties:
        questionNumber:
          type: integer
          minimum: 1
          maximum: 12
        currentConfig:
          $ref: '#/components/schemas/DealConfiguration'

    MessageChunk:
      type: object
      required:
        - type
      properties:
        type:
          type: string
          enum: [content, suggestions, done]
        content:
          type: string
        suggestions:
          type: array
          items:
            type: string
```

**Generate TypeScript types**:
```bash
npm run generate-types
# Uses openapi-typescript to generate src/types/api.generated.ts
```

**Generated types are used everywhere**:
```typescript
// Auto-generated from OpenAPI spec
import type {
  ChatRequest,
  ChatResponse,
  MessageChunk
} from '@/types/api.generated'

// Type-safe throughout the app
const request: ChatRequest = {
  message: "I'm structuring a Sukuk",
  context: {
    questionNumber: 1,
    currentConfig: {}
  }
}
```

### 3. Feature-Based Organization

**Problem**: Traditional folder-by-type organization doesn't scale.

**Solution**: Organize by feature/domain, not by file type.

```
features/
├── configuration/           # Everything for conversational config
│   ├── components/          # Only used in this feature
│   ├── hooks/               # Feature-specific hooks
│   ├── services/            # Backend interactions
│   ├── types/               # Feature types
│   └── utils/               # Feature utilities
│
└── compliance/              # Everything for GRC dashboard
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    └── utils/
```

**Benefits**:
- Easy to find related code
- Features can be extracted into packages
- Clear boundaries between domains
- Reduces cognitive load

### 4. Optimistic UI with Rollback

**Problem**: Mocks feel fake if UI waits for responses.

**Solution**: Update UI immediately, rollback on error.

```typescript
// features/compliance/hooks/useCreateDeal.ts
export function useCreateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: DealConfiguration) => {
      return dealService.create(config)
    },

    // Optimistic update
    onMutate: async (config) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['deals'] })

      // Snapshot previous value
      const previousDeals = queryClient.getQueryData(['deals'])

      // Optimistically update to the new value
      queryClient.setQueryData(['deals'], (old: Deal[]) => [
        ...old,
        {
          id: 'temp-' + Date.now(),
          ...config,
          status: 'creating',
        }
      ])

      // Return context with snapshot
      return { previousDeals }
    },

    // Rollback on error
    onError: (err, config, context) => {
      queryClient.setQueryData(['deals'], context.previousDeals)
    },

    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })
}
```

### 5. Streaming with Server-Sent Events (Mocked)

**Problem**: AG-UI protocol requires streaming, but backend isn't ready.

**Solution**: Mock SSE using async generators.

```typescript
// lib/api/mock-client.ts
export class MockApiClient {
  async *streamSSE<T>(endpoint: string, data: any): AsyncGenerator<T> {
    // Simulate SSE stream
    const response = await this.generateMockResponse(endpoint, data)

    // Yield chunks with realistic delays
    for (const chunk of this.chunkResponse(response)) {
      await delay(50 + Math.random() * 100) // 50-150ms per chunk
      yield chunk
    }
  }
}

// Usage in component
const { data, error } = useStreamingQuery({
  queryKey: ['chat', message],
  queryFn: async function* () {
    for await (const chunk of apiClient.streamSSE('/api/chat', { message })) {
      yield chunk
    }
  }
})
```

---

## Mock Data Strategy

### Realistic Mock Data Requirements

1. **Sufficient Variety**: At least 10-15 deals with different configurations
2. **Edge Cases**: Include deals with 12 controls (min) and 26 controls (max)
3. **Temporal Data**: Deals at different stages (active, completed, failed)
4. **Relationships**: Evidence linked to controls, controls linked to VCs
5. **Realistic Names**: Use actual Islamic finance terminology

### Mock Data Structure

```typescript
// mocks/data/deals.mock.ts
export const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-001',
    dealName: 'QIIB Oryx Sukuk Al-Ijara',
    dealId: 'QIIB-2024-001',
    productType: 'Sukuk',
    shariahStructure: 'Ijara',
    jurisdiction: 'Qatar',
    amount: 500_000_000,
    currency: 'USD',
    status: 'active',
    phase: 'execution',
    createdAt: '2024-10-15T00:00:00Z',

    // Configuration (12 questions)
    configuration: {
      productType: 'Sukuk',
      sustainabilityOverlay: 'GBP',
      dealComplexity: 'Complex',
      primaryJurisdiction: 'Qatar',
      crossBorder: 'Yes - Investor base',
      listingStatus: 'Public',
      counterpartyRisk: 'Medium',
      fundingModel: 'Fixed maturity',
      shariahGovernance: 'Full SSB+Review+Audit',
      internalAudit: 'Yes (in-house)',
      externalAudit: 'Yes (regulatory)',
      accountingFramework: 'AAOIFI FAS',
    },

    // Activated controls (21 for this config)
    activatedControls: [
      'SG-01', 'SG-02', 'SG-03', 'SG-04', 'SG-05',
      'RL-01', 'RL-02', 'RL-03', 'RL-04', 'RL-05',
      'RM-01', 'RM-02',
      'FR-01', 'FR-02', 'FR-03', 'FR-04', 'FR-05', 'FR-06',
      'AA-01', 'AA-02', 'AA-03', 'AA-04', 'AA-05',
    ],

    // Control execution status
    controls: [
      {
        controlId: 'SG-01',
        status: 'passed',
        lastExecuted: '2024-11-01T10:00:00Z',
        nextExecution: '2024-12-01T10:00:00Z',
        kri: 100,
        vcId: 'vc-sg-01-001',
      },
      // ... 20 more controls
    ],

    // Compliance scores
    compliance: {
      overall: 85,
      buckets: {
        shariah: 100,
        regulatory: 90,
        risk: 75,
        financial: 80,
        audit: 80,
      },
    },

    // Blockers
    blockers: [
      {
        controlId: 'RM-02',
        severity: 'high',
        description: 'Annual financial audit pending',
        since: '2024-10-20T00:00:00Z',
        assignedTo: 'Compliance Team',
      },
    ],
  },

  // Simple Murabaha (minimum controls)
  {
    id: 'deal-002',
    dealName: 'Trade Finance Murabaha',
    productType: 'Murabaha',
    // ... only 12 controls activated
  },

  // Complex SLB (maximum controls)
  {
    id: 'deal-003',
    dealName: 'Green Sukuk SLB',
    sustainabilityOverlay: 'SLB',
    // ... all 26 controls activated
  },
]
```

### Mock Service Implementation Pattern

```typescript
// features/compliance/services/complianceService.mock.ts
export class MockComplianceService implements ComplianceService {
  private deals = MOCK_DEALS

  async getDeal(id: string): Promise<Deal> {
    await delay(500) // Simulate network

    const deal = this.deals.find(d => d.id === id)
    if (!deal) throw new Error('Deal not found')

    return deal
  }

  async createDeal(config: DealConfiguration): Promise<Deal> {
    await delay(1000)

    // Generate realistic deal from config
    const activatedControls = activateControls(config)

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      dealName: config.dealName || 'Untitled Deal',
      ...config,
      activatedControls: activatedControls.map(c => c.controlId),
      controls: activatedControls.map(c => ({
        controlId: c.controlId,
        status: 'not_started',
        kri: 0,
      })),
      compliance: this.calculateCompliance(activatedControls),
      status: 'draft',
      createdAt: new Date().toISOString(),
    }

    // Add to mock store
    this.deals.push(newDeal)

    return newDeal
  }

  private calculateCompliance(controls: ControlActivation[]): ComplianceScores {
    // Realistic bucket score calculation
    // (This will be real backend logic when migrated)
  }
}
```

---

## Netlify Deployment Configuration

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "out"  # Next.js static export output

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

# Redirect all routes to index.html for client-side routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Cache static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Deploy previews for PRs
[context.deploy-preview]
  command = "npm run build"

# Branch deploys
[context.branch-deploy]
  command = "npm run build"

# Production only environment variables
[context.production.environment]
  NEXT_PUBLIC_ENV = "production"
  NEXT_PUBLIC_API_URL = "https://api.zeroh.io"  # Future real backend
```

### next.config.js (Static Export)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',

  // No trailing slashes
  trailingSlash: false,

  // Image optimization (use Netlify's)
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },

  // Disable TypeScript build errors (handled by CI)
  typescript: {
    ignoreBuildErrors: process.env.CI === 'true',
  },

  // Disable ESLint build errors (handled by CI)
  eslint: {
    ignoreDuringBuilds: process.env.CI === 'true',
  },
}

module.exports = nextConfig
```

---

## Mock-to-Real Migration Guide

### Phase 1: Contract Implementation (Backend Team)
1. Backend team implements OpenAPI contracts
2. Deploy backend to staging environment
3. Update `.env.local` with staging API URL

### Phase 2: Service Layer Swap (Frontend Team - 1 day)
```typescript
// lib/config/app.config.ts
export const config = {
  // Change this flag to switch from mock to real
  useMockServices: process.env.NEXT_PUBLIC_USE_MOCKS === 'true',

  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
}

// That's it! Service layer handles the rest.
```

### Phase 3: Testing & Validation
1. Test all features with real backend
2. Verify SSE streaming works
3. Load testing with realistic data volumes
4. Fix any API contract mismatches

### Phase 4: Gradual Rollout
1. Deploy with mocks enabled (safe rollback)
2. Enable real backend for internal users
3. Monitor errors and performance
4. Enable for all users
5. Remove mock implementations

**Estimated migration time**: 1-2 days (assuming contracts match)

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# → http://localhost:3000

# Run with real backend (when available)
NEXT_PUBLIC_USE_MOCKS=false npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run start
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/conversational-config

# Make changes, commit
git add .
git commit -m "feat: add conversational configuration"

# Push and create PR
git push origin feature/conversational-config
# → Creates Netlify preview deployment automatically
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_ENV: production

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=out
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Documentation Strategy

### README.md Structure

```markdown
# ZeroH V2: AG-UI Protocol Demo

> Production-quality Islamic finance compliance platform demo

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

- 🤖 Conversational configuration (AG-UI Protocol)
- 📊 Real-time control activation
- 🎯 5-bucket compliance dashboard
- 🔐 Verifiable Credentials (VC) proof system
- ⚡ Optimized for Netlify Edge

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Mock to Real Migration

See [docs/MOCK_TO_REAL_GUIDE.md](./docs/MOCK_TO_REAL_GUIDE.md)

## Development

### Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run type-check` - TypeScript validation
- `npm run lint` - ESLint
- `npm run format` - Prettier

### Environment Variables

```env
NEXT_PUBLIC_USE_MOCKS=true          # Use mock services
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

## Deployment

Deployed to Netlify: https://zeroh-v2.netlify.app

Every PR gets a preview deployment automatically.

## License

Proprietary
```

---

## Package.json

```json
{
  "name": "zeroh-v2",
  "version": "2.0.0",
  "private": true,
  "description": "AG-UI Protocol demo for Islamic finance compliance",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "generate-types": "openapi-typescript contracts/*.openapi.yaml -o src/types/api.generated.ts",
    "validate-contracts": "ts-node scripts/validate-contracts.ts",
    "prepare": "husky install"
  },
  "dependencies": {
    "next": "14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.2",
    "@tanstack/react-query": "^5.60.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "framer-motion": "^11.11.11",
    "lucide-react": "^0.460.0",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.20",
    "eslint": "^8",
    "eslint-config-next": "14.2.18",
    "eslint-config-prettier": "^9.1.0",
    "husky": "^9.1.6",
    "lint-staged": "^15.2.10",
    "openapi-typescript": "^7.4.2",
    "postcss": "^8",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

---

## Success Metrics

### Technical Metrics
- ✅ TypeScript coverage: 100%
- ✅ Build size: < 500KB (first load JS)
- ✅ Lighthouse score: 95+ (all categories)
- ✅ Mock-to-real swap: < 1 day
- ✅ Zero runtime errors (production)

### UX Metrics
- ✅ Conversation flow completion: > 90%
- ✅ Time to configure deal: < 5 minutes
- ✅ Mobile usability score: 95+
- ✅ Accessibility: WCAG 2.1 AA compliant

### Business Metrics
- ✅ Demo showcases AG-UI value proposition
- ✅ Stakeholders can self-navigate demo
- ✅ Clear path to production (documented)
- ✅ Backend team can implement contracts independently

---

## Next Steps

### Phase 1: Repository Setup (Day 1)
1. Create GitHub repository: `zeroh-v2`
2. Initialize Next.js project with TypeScript
3. Configure Tailwind + Radix UI
4. Set up ESLint, Prettier, Husky
5. Create initial folder structure
6. Deploy to Netlify (empty project)

### Phase 2: Core Infrastructure (Days 2-3)
1. Implement service layer pattern
2. Create OpenAPI contracts for 8 services
3. Set up mock data generators
4. Configure Zustand stores
5. Build shared UI components

### Phase 3: Feature Implementation (Days 4-7)
1. Step 0: Welcome page
2. Step 1: Conversational configuration (already 80% done!)
3. Step 2: Review & confirm
4. Step 3: GRC Dashboard (port from V1)

### Phase 4: Polish & Deploy (Days 8-10)
1. Responsive design (mobile, tablet)
2. Accessibility audit
3. Performance optimization
4. Documentation
5. Production deployment

**Total estimated time**: 10 working days for complete V2 demo

---

## Appendix A: Control Activation Logic Reference

See `ARCHITECTURE_SESSION_FINDINGS.md:152-194` for complete 26-control activation matrix.

---

## Appendix B: OpenAPI Contract Templates

All 8 microservice contracts available in `contracts/` directory.

---

**END OF BLUEPRINT**

This document is the single source of truth for ZeroH V2 architecture and implementation.
