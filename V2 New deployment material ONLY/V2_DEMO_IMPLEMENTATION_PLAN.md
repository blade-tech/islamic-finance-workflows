# ZeroH V2 Demo - Implementation Plan

**Document Version**: 1.0
**Created**: 2025-11-07
**Status**: Ready for Execution ✅
**Deployment Strategy**: Local Development → Local Verification → Netlify Production
**Estimated Timeline**: 14-18 days (3 weeks)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites & Dependencies](#prerequisites--dependencies)
3. [Phase 0: Project Setup (Days 1-2)](#phase-0-project-setup-days-1-2)
4. [Phase 1: Core Infrastructure (Days 3-4)](#phase-1-core-infrastructure-days-3-4)
5. [Phase 2: Step 1 - Conversational Configuration (Days 5-8)](#phase-2-step-1---conversational-configuration-days-5-8)
6. [Phase 3: Step 2 - Review & Confirmation (Days 9-12)](#phase-3-step-2---review--confirmation-days-9-12)
7. [Phase 4: Step 3 - GRC Dashboard (Days 13-16)](#phase-4-step-3---grc-dashboard-days-13-16)
8. [Phase 5: Polish & Testing (Days 17-18)](#phase-5-polish--testing-days-17-18)
9. [Phase 6: Netlify Deployment](#phase-6-netlify-deployment)
10. [Risk Mitigation](#risk-mitigation)
11. [Quality Gates](#quality-gates)
12. [Success Metrics](#success-metrics)

---

## Executive Summary

### Project Goal
Build a fully functional V2 demo of ZeroH - an AI-native, blockchain-anchored Islamic Finance GRC platform - that demonstrates the complete 3-step conversational workflow from deal configuration to compliance certification.

### Key Differentiators from V1
- **Conversational Interface**: Natural language Q&A replacing 10-step form wizard
- **Intelligent Control Activation**: 12-26 controls (not all 26) based on deal complexity
- **AG-UI Protocol Compliant**: Proper streaming, thinking states, tool calls
- **Backend Pluggability**: < 1 day backend swap via service layer pattern
- **Production-Ready Architecture**: Feature-based organization, TypeScript strict mode, contract-first API design

### Deployment Flow
```
Local Development (npm run dev)
    ↓
Local Build Verification (npm run build)
    ↓
Static Export Test (next export)
    ↓
Netlify Preview Deploy
    ↓
Final Testing
    ↓
Netlify Production Deploy
```

### Timeline Overview
| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 0: Setup | 2 days | Repository initialized, dev server running |
| Phase 1: Core Infrastructure | 2 days | Service layer, state management, routing |
| Phase 2: Conversational Config | 4 days | 12-question MVQ interface with mock AI |
| Phase 3: Review & Confirmation | 4 days | BPMN viewer, test simulator, animations |
| Phase 4: GRC Dashboard | 4 days | 5-bucket compliance dashboard |
| Phase 5: Polish & Testing | 2 days | Tours, performance, accessibility |
| Phase 6: Netlify Deployment | ~4 hours | Production deployment |
| **Total** | **18 days** | **Public demo URL** |

---

## Prerequisites & Dependencies

### Required Tools
- **Node.js**: 20.x or later (for Next.js 14)
- **npm**: 10.x or later
- **Git**: Latest version
- **Code Editor**: VS Code recommended
- **Browser**: Chrome/Edge (for development and testing)
- **Netlify CLI**: `npm install -g netlify-cli`

### Required Accounts
- GitHub account (for repository)
- Netlify account (for deployment)
- No AI API keys needed for mock demo

### Required Knowledge
Before starting, team members should have read:
- `ARCHITECTURE_SESSION_FINDINGS.md` (20 min read)
- `ZEROH_V2_PROJECT_BLUEPRINT.md` (30 min read)
- `AG_UI_PROTOCOL_AND_PLUGGABILITY_GUIDE.md` (CRITICAL - 45 min read)

### Optional: V1 Component Familiarity
If migrating V1 components, review:
- `V1_COMPONENT_REUSABILITY_GUIDE.md` (30 min read)
- V1 BPMN viewer implementation
- V1 workflow animations
- V1 tour system

---

## Phase 0: Project Setup (Days 1-2)

### Objectives
- Create new GitHub repository
- Initialize Next.js 14 project with correct configuration
- Setup development environment
- Verify local dev server runs successfully

### Tasks

#### Day 1 Morning: Repository Creation

**Task 0.1: Create GitHub Repository**
```bash
# Method 1: Via GitHub Web UI (Recommended for first-time setup)
1. Go to https://github.com/new
2. Repository name: zeroh-v2-demo
3. Description: "AI-Native Blockchain-Anchored Islamic Finance GRC Platform"
4. Visibility: Private (for now)
5. Initialize with README: No (we'll create it)
6. .gitignore: None (Next.js template will add it)
7. License: None (or MIT if open-sourcing later)
8. Click "Create repository"

# Method 2: Via GitHub CLI (if gh CLI installed)
gh repo create zeroh-v2-demo --private --description "AI-Native Islamic Finance GRC Platform"
```

**Task 0.2: Initialize Local Repository**
```bash
# Navigate to projects directory
cd D:\projects

# Create project directory
mkdir zeroh-v2-demo
cd zeroh-v2-demo

# Initialize git
git init
git branch -M main

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/zeroh-v2-demo.git
```

**Task 0.3: Initialize Next.js Project**
```bash
# Create Next.js app with TypeScript, ESLint, Tailwind
npx create-next-app@14.2.18 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Answer prompts:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? Yes
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias (@/*)? No
```

#### Day 1 Afternoon: Configuration & Dependencies

**Task 0.4: Install Core Dependencies**
```bash
# State Management
npm install zustand@4.5.0

# Data Fetching
npm install @tanstack/react-query@5.17.0

# UI Components (Radix UI)
npm install @radix-ui/react-accordion@1.1.2
npm install @radix-ui/react-dialog@1.0.5
npm install @radix-ui/react-dropdown-menu@2.0.6
npm install @radix-ui/react-progress@1.0.3
npm install @radix-ui/react-select@2.0.0
npm install @radix-ui/react-separator@1.0.3
npm install @radix-ui/react-tabs@1.0.4
npm install @radix-ui/react-tooltip@1.0.7
npm install @radix-ui/react-avatar@1.0.4

# Icons
npm install lucide-react@0.344.0

# Utilities
npm install clsx@2.1.0
npm install tailwind-merge@2.2.0
npm install class-variance-authority@0.7.0

# BPMN Viewer (V1 component migration)
npm install bpmn-js@17.2.0

# Product Tours
npm install react-joyride@2.7.2

# Date handling
npm install date-fns@3.3.0
```

**Task 0.5: Install Dev Dependencies**
```bash
npm install -D @types/node@20.11.0
npm install -D @types/react@18.2.48
npm install -D @types/react-dom@18.2.18
npm install -D typescript@5.3.3
npm install -D eslint@8.56.0
npm install -D eslint-config-next@14.2.18
npm install -D prettier@3.2.4
npm install -D prettier-plugin-tailwindcss@0.5.11
```

**Task 0.6: Configure TypeScript (tsconfig.json)**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Task 0.7: Configure Prettier (.prettierrc)**
```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "arrowParens": "avoid",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Task 0.8: Configure ESLint (.eslintrc.json)**
```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off"
  }
}
```

**Task 0.9: Configure Next.js for Static Export (next.config.mjs)**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better compatibility with static hosts

  // Enable React strict mode for better debugging
  reactStrictMode: true,

  // TypeScript error handling
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint error handling
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
```

#### Day 2 Morning: Project Structure Setup

**Task 0.10: Create Feature-Based Directory Structure**
```bash
# Create feature directories
mkdir -p src/features/configuration/components
mkdir -p src/features/configuration/hooks
mkdir -p src/features/configuration/services
mkdir -p src/features/configuration/types
mkdir -p src/features/configuration/utils

mkdir -p src/features/compliance/components
mkdir -p src/features/compliance/hooks
mkdir -p src/features/compliance/services
mkdir -p src/features/compliance/types
mkdir -p src/features/compliance/utils

mkdir -p src/features/evidence/components
mkdir -p src/features/evidence/hooks
mkdir -p src/features/evidence/services
mkdir -p src/features/evidence/types

mkdir -p src/features/credentials/components
mkdir -p src/features/credentials/hooks
mkdir -p src/features/credentials/services
mkdir -p src/features/credentials/types

# Create shared directories
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/lib/services
mkdir -p src/lib/utils
mkdir -p src/lib/hooks
mkdir -p src/lib/types
mkdir -p src/lib/constants

# Create public assets
mkdir -p public/images
mkdir -p public/icons
```

**Task 0.11: Create Utility Files**

Create `src/lib/utils/cn.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Create `src/lib/constants/routes.ts`:
```typescript
export const ROUTES = {
  HOME: '/',
  CONFIGURATION: '/configuration',
  REVIEW: '/review',
  DASHBOARD: '/dashboard',
  EVIDENCE: '/evidence',
  CREDENTIALS: '/credentials',
} as const

export type Route = typeof ROUTES[keyof typeof ROUTES]
```

Create `src/lib/constants/config.ts`:
```typescript
export const APP_CONFIG = {
  name: 'ZeroH V2',
  description: 'AI-Native Blockchain-Anchored Islamic Finance GRC Platform',
  version: '2.0.0',

  // Feature flags
  features: {
    useMockServices: true, // Toggle for mock vs real backend
    enableTours: true,
    enableDebugMode: process.env.NODE_ENV === 'development',
  },

  // API configuration (for future backend integration)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 30000,
  },

  // UI configuration
  ui: {
    animationDuration: 300,
    streamingDelay: 50, // ms between word renders in mock streaming
    thinkingDelay: 800, // ms for thinking status simulation
  },
} as const
```

#### Day 2 Afternoon: Environment & Initial Commit

**Task 0.12: Create Environment Files**

Create `.env.local`:
```env
# Development environment variables

# Feature flags
NEXT_PUBLIC_USE_MOCK_SERVICES=true
NEXT_PUBLIC_ENABLE_TOURS=true
NEXT_PUBLIC_DEBUG_MODE=true

# API configuration (unused in mock mode, but defined for future)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `.env.example`:
```env
# Example environment variables
# Copy this file to .env.local and fill in your values

# Feature flags
NEXT_PUBLIC_USE_MOCK_SERVICES=true
NEXT_PUBLIC_ENABLE_TOURS=true
NEXT_PUBLIC_DEBUG_MODE=false

# Backend API (only needed when not using mock services)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Future: AI API Keys (not needed for mock demo)
# ANTHROPIC_API_KEY=
# OPENAI_API_KEY=
```

**Task 0.13: Create .gitignore**
```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
```

**Task 0.14: Create README.md**
```markdown
# ZeroH V2 - AI-Native Islamic Finance GRC Platform

**Status**: 🚧 In Development
**Demo**: Coming Soon
**Version**: 2.0.0

## Overview

ZeroH V2 is an AI-native, blockchain-anchored compliance platform for Islamic finance institutions. Complete your compliance journey in 3 conversational steps:

1. **Configure** - Answer 12 questions conversationally
2. **Review** - Confirm Guardian policy structure visually
3. **Monitor** - Track compliance across 5 Shariah-compliant buckets

## Quick Start

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/zeroh-v2-demo.git
cd zeroh-v2-demo

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router, Static Export)
- **Language**: TypeScript 5.x (Strict Mode)
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Deployment**: Netlify

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Radix UI components
│   └── layout/            # Layout components
├── features/              # Feature-based organization
│   ├── configuration/     # Step 1: Conversational config
│   ├── compliance/        # Step 3: GRC dashboard
│   ├── evidence/          # Evidence repository
│   └── credentials/       # VC/NFT management
└── lib/
    ├── services/          # Service layer (mock + real)
    ├── utils/             # Utility functions
    ├── hooks/             # Custom React hooks
    └── types/             # TypeScript types
\`\`\`

## Development

\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
\`\`\`

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Implementation Plan](./docs/V2_DEMO_IMPLEMENTATION_PLAN.md)
- [Service Layer Guide](./docs/AG_UI_PROTOCOL_AND_PLUGGABILITY_GUIDE.md)

## License

[MIT](./LICENSE) or proprietary (TBD)

## Contact

For questions or feedback, please open an issue or contact the development team.
\`\`\`

**Task 0.15: Update package.json Scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out node_modules"
  }
}
```

**Task 0.16: Initial Commit**
```bash
# Stage all files
git add .

# Create initial commit
git commit -m "feat: initialize ZeroH V2 project with Next.js 14

- Setup Next.js 14 with TypeScript, Tailwind, App Router
- Configure static export for Netlify deployment
- Install Radix UI components, Zustand, TanStack Query
- Create feature-based directory structure
- Add development environment configuration
- Configure ESLint, Prettier, TypeScript strict mode

BREAKING CHANGE: New V2 repository separate from V1"

# Push to GitHub
git push -u origin main
```

#### Day 2 Evening: Verify Development Server

**Task 0.17: Start Development Server**
```bash
npm run dev
```

Expected output:
```
> zeroh-v2-demo@0.1.0 dev
> next dev

  ▲ Next.js 14.2.18
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**Task 0.18: Verify Next.js Default Page**
1. Open browser to `http://localhost:3000`
2. Verify Next.js default landing page renders
3. Check browser console for errors (should be none)
4. Verify hot reload works (edit `src/app/page.tsx`, see changes)

**Task 0.19: Run Type Check**
```bash
npm run type-check
```

Expected: No errors

**Task 0.20: Run Lint Check**
```bash
npm run lint
```

Expected: No errors or warnings

### Phase 0 Deliverables Checklist
- [ ] GitHub repository created and accessible
- [ ] Local repository initialized and connected to GitHub
- [ ] Next.js 14 project created with correct configuration
- [ ] All dependencies installed successfully
- [ ] TypeScript configured with strict mode
- [ ] ESLint and Prettier configured
- [ ] Feature-based directory structure created
- [ ] Environment variables configured
- [ ] README.md created with project overview
- [ ] Initial commit pushed to GitHub
- [ ] Development server starts without errors
- [ ] Hot reload working correctly
- [ ] Type checking passes
- [ ] Linting passes

### Phase 0 Success Criteria
✅ Development server accessible at `http://localhost:3000`
✅ No TypeScript errors
✅ No ESLint errors
✅ Git history shows initial commit
✅ GitHub repository shows pushed code

---

## Phase 1: Core Infrastructure (Days 3-4)

### Objectives
- Implement service layer pattern for backend pluggability
- Create global state management with Zustand
- Setup routing and navigation
- Build basic layout components
- Implement mock conversation service (AG-UI compliant)

### Tasks

#### Day 3 Morning: Service Layer Foundation

**Task 1.1: Create Service Interfaces**

Create `src/lib/services/interfaces/conversation.interface.ts`:
```typescript
/**
 * Conversation Service Interface
 *
 * This interface defines the contract for conversation services.
 * Both MockConversationService and RealConversationService must implement this.
 *
 * CRITICAL: Frontend components NEVER import implementation classes directly.
 * Always import via this interface for pluggability.
 */

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: MessageContent[]
  timestamp: string
}

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
}

export type MessageContent = TextContent | ToolCallContent | ToolResultContent

export interface ConversationContext {
  sessionId: string
  conversationHistory: Message[]
  dealConfiguration?: Partial<DealConfiguration>
}

export interface DealConfiguration {
  dealType: string
  assetClass: string
  jurisdiction: string
  issuanceSize: number
  currency: string
  tenor: number
  isSukukStructure: boolean
  isGreenSustainability: boolean
  isCrossBorder: boolean
  hasComplexWaterfall: boolean
  requiresCustomDocumentation: boolean
  hasThirdPartyServices: boolean
}

// Stream event types (AG-UI protocol)
export interface ThinkingEvent {
  type: 'thinking'
  data: {
    message: string
  }
}

export interface MessageStartEvent {
  type: 'message_start'
  data: {
    message_id: string
    role: MessageRole
  }
}

export interface MessageDeltaEvent {
  type: 'message_delta'
  data: {
    delta: string
  }
}

export interface MessageCompleteEvent {
  type: 'message_complete'
  data: {
    message: Message
  }
}

export interface ToolCallEvent {
  type: 'tool_call'
  data: {
    tool_call_id: string
    name: string
    arguments: Record<string, any>
  }
}

export interface ToolResultEvent {
  type: 'tool_result'
  data: {
    tool_call_id: string
    result: any
  }
}

export interface ErrorEvent {
  type: 'error'
  data: {
    error: string
    code?: string
  }
}

export interface DoneEvent {
  type: 'done'
  data: Record<string, never>
}

export type StreamEvent =
  | ThinkingEvent
  | MessageStartEvent
  | MessageDeltaEvent
  | MessageCompleteEvent
  | ToolCallEvent
  | ToolResultEvent
  | ErrorEvent
  | DoneEvent

export interface ConversationResponse {
  message: Message
  dealConfiguration?: Partial<DealConfiguration>
  activatedControls?: string[]
}

/**
 * ConversationService Interface
 *
 * Implementations:
 * - MockConversationService: Simulates AI responses with AG-UI protocol compliance
 * - RealConversationService: Connects to backend API via SSE streaming
 */
export interface ConversationService {
  /**
   * Stream a conversation message with real-time updates
   *
   * @param message - User message text
   * @param context - Conversation context including history
   * @returns AsyncGenerator yielding StreamEvents
   */
  streamMessage(
    message: string,
    context: ConversationContext
  ): AsyncGenerator<StreamEvent, void, unknown>

  /**
   * Send a message and wait for complete response (non-streaming)
   *
   * @param message - User message text
   * @param context - Conversation context including history
   * @returns Promise resolving to complete response
   */
  sendMessage(message: string, context: ConversationContext): Promise<ConversationResponse>

  /**
   * Interrupt an ongoing streaming response
   *
   * @param sessionId - Session ID to interrupt
   */
  interrupt(sessionId: string): void
}
```

**Task 1.2: Create Mock Conversation Service**

Create `src/lib/services/mock/mock-conversation.service.ts`:
```typescript
import type {
  ConversationService,
  ConversationContext,
  ConversationResponse,
  StreamEvent,
  Message,
  DealConfiguration,
} from '../interfaces/conversation.interface'
import { generateId } from '@/lib/utils/id'
import { delay } from '@/lib/utils/async'
import { APP_CONFIG } from '@/lib/constants/config'

/**
 * MockConversationService
 *
 * Simulates AI conversation service with AG-UI protocol compliance.
 * Uses realistic delays and streaming to mimic real backend behavior.
 *
 * IMPORTANT: This mock MUST follow AG-UI protocol exactly so frontend
 * components work identically with real backend.
 */
export class MockConversationService implements ConversationService {
  private interruptedSessions = new Set<string>()

  async *streamMessage(
    message: string,
    context: ConversationContext
  ): AsyncGenerator<StreamEvent, void, unknown> {
    const { sessionId } = context

    // Clear interrupt flag for this session
    this.interruptedSessions.delete(sessionId)

    try {
      // Emit thinking event
      yield {
        type: 'thinking',
        data: { message: 'Analyzing your response...' },
      }
      await delay(APP_CONFIG.ui.thinkingDelay)

      // Check for interrupt
      if (this.interruptedSessions.has(sessionId)) {
        yield { type: 'error', data: { error: 'Interrupted by user' } }
        return
      }

      // Generate response based on message analysis
      const response = this.generateResponse(message, context)

      // Emit message start
      const messageId = generateId()
      yield {
        type: 'message_start',
        data: { message_id: messageId, role: 'assistant' },
      }

      // Stream response text word by word
      const words = response.text.split(' ')
      for (const word of words) {
        if (this.interruptedSessions.has(sessionId)) {
          yield { type: 'error', data: { error: 'Interrupted by user' } }
          return
        }

        yield {
          type: 'message_delta',
          data: { delta: word + ' ' },
        }
        await delay(APP_CONFIG.ui.streamingDelay)
      }

      // Emit message complete
      const completeMessage: Message = {
        id: messageId,
        role: 'assistant',
        content: [{ type: 'text', text: response.text }],
        timestamp: new Date().toISOString(),
      }

      yield {
        type: 'message_complete',
        data: { message: completeMessage },
      }

      // Emit done event
      yield { type: 'done', data: {} }
    } catch (error) {
      yield {
        type: 'error',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }

  async sendMessage(
    message: string,
    context: ConversationContext
  ): Promise<ConversationResponse> {
    const response = this.generateResponse(message, context)

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: [{ type: 'text', text: response.text }],
      timestamp: new Date().toISOString(),
    }

    return {
      message: assistantMessage,
      dealConfiguration: response.dealConfiguration,
      activatedControls: response.activatedControls,
    }
  }

  interrupt(sessionId: string): void {
    this.interruptedSessions.add(sessionId)
  }

  /**
   * Generate mock response based on message content
   * Simulates intelligent question answering and control activation
   */
  private generateResponse(
    message: string,
    context: ConversationContext
  ): {
    text: string
    dealConfiguration?: Partial<DealConfiguration>
    activatedControls?: string[]
  } {
    const lowerMessage = message.toLowerCase()

    // Question 1: Deal type
    if (
      lowerMessage.includes('murabaha') ||
      lowerMessage.includes('musharaka') ||
      lowerMessage.includes('sukuk')
    ) {
      return {
        text: 'Great! What asset class will this deal be based on? For example, real estate, commodities, or infrastructure.',
        dealConfiguration: { dealType: this.extractDealType(lowerMessage) },
      }
    }

    // Question 2: Asset class
    if (
      lowerMessage.includes('real estate') ||
      lowerMessage.includes('commodities') ||
      lowerMessage.includes('infrastructure')
    ) {
      return {
        text: 'Which jurisdiction will this deal be governed under? For instance, Malaysia, UAE, Saudi Arabia, or UK.',
        dealConfiguration: { assetClass: this.extractAssetClass(lowerMessage) },
      }
    }

    // Question 3: Jurisdiction
    if (
      lowerMessage.includes('malaysia') ||
      lowerMessage.includes('uae') ||
      lowerMessage.includes('saudi') ||
      lowerMessage.includes('uk')
    ) {
      return {
        text: 'What is the expected issuance size and currency? For example, $100 million USD or 500 million MYR.',
        dealConfiguration: { jurisdiction: this.extractJurisdiction(lowerMessage) },
      }
    }

    // Default response for unrecognized input
    return {
      text: "I'm here to help you configure your Islamic finance deal. Let's start with the first question: What type of Islamic finance structure are you looking to implement? Common options include Murabaha, Musharaka, Sukuk, or Ijarah.",
    }
  }

  private extractDealType(message: string): string {
    if (message.includes('murabaha')) return 'Murabaha'
    if (message.includes('musharaka')) return 'Musharaka'
    if (message.includes('sukuk')) return 'Sukuk'
    if (message.includes('ijarah')) return 'Ijarah'
    return 'Unknown'
  }

  private extractAssetClass(message: string): string {
    if (message.includes('real estate')) return 'Real Estate'
    if (message.includes('commodities')) return 'Commodities'
    if (message.includes('infrastructure')) return 'Infrastructure'
    return 'Unknown'
  }

  private extractJurisdiction(message: string): string {
    if (message.includes('malaysia')) return 'Malaysia'
    if (message.includes('uae')) return 'UAE'
    if (message.includes('saudi')) return 'Saudi Arabia'
    if (message.includes('uk')) return 'United Kingdom'
    return 'Unknown'
  }
}
```

**Task 1.3: Create Service Factory**

Create `src/lib/services/index.ts`:
```typescript
/**
 * Service Factory
 *
 * Provides runtime selection between mock and real services.
 * This is the ONLY place that imports implementation classes.
 *
 * Usage in components:
 * ```typescript
 * import { conversationService } from '@/lib/services'
 *
 * // Use service (don't care if mock or real)
 * const response = await conversationService.sendMessage(...)
 * ```
 */

import type { ConversationService } from './interfaces/conversation.interface'
import { MockConversationService } from './mock/mock-conversation.service'
// import { RealConversationService } from './real/real-conversation.service' // Future

import { APP_CONFIG } from '@/lib/constants/config'

/**
 * Conversation Service Instance
 *
 * Automatically selects mock or real implementation based on config.
 * Components should ONLY import this, never the implementation classes.
 */
export const conversationService: ConversationService = APP_CONFIG.features.useMockServices
  ? new MockConversationService()
  : new MockConversationService() // TODO: Replace with RealConversationService when backend ready

// Re-export types for convenience
export type * from './interfaces/conversation.interface'
```

**Task 1.4: Create Utility Functions**

Create `src/lib/utils/id.ts`:
```typescript
/**
 * Generate a unique ID
 * Uses timestamp + random for uniqueness without external dependencies
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}
```

Create `src/lib/utils/async.ts`:
```typescript
/**
 * Delay execution for specified milliseconds
 * @param ms - Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

#### Day 3 Afternoon: State Management with Zustand

**Task 1.5: Create Zustand Store**

Create `src/lib/store/conversation.store.ts`:
```typescript
import { create } from 'zustand'
import type { Message, DealConfiguration } from '@/lib/services'

interface ConversationState {
  // State
  sessionId: string
  messages: Message[]
  currentDealConfiguration: Partial<DealConfiguration>
  activatedControls: string[]
  isStreaming: boolean
  thinkingStatus: string | null
  error: string | null

  // Actions
  setSessionId: (sessionId: string) => void
  addMessage: (message: Message) => void
  updateDealConfiguration: (config: Partial<DealConfiguration>) => void
  setActivatedControls: (controls: string[]) => void
  setIsStreaming: (isStreaming: boolean) => void
  setThinkingStatus: (status: string | null) => void
  setError: (error: string | null) => void
  clearMessages: () => void
  reset: () => void
}

const initialState = {
  sessionId: '',
  messages: [],
  currentDealConfiguration: {},
  activatedControls: [],
  isStreaming: false,
  thinkingStatus: null,
  error: null,
}

export const useConversationStore = create<ConversationState>((set) => ({
  ...initialState,

  setSessionId: (sessionId) => set({ sessionId }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateDealConfiguration: (config) =>
    set((state) => ({
      currentDealConfiguration: {
        ...state.currentDealConfiguration,
        ...config,
      },
    })),

  setActivatedControls: (controls) => set({ activatedControls: controls }),

  setIsStreaming: (isStreaming) => set({ isStreaming }),

  setThinkingStatus: (status) => set({ thinkingStatus: status }),

  setError: (error) => set({ error }),

  clearMessages: () => set({ messages: [] }),

  reset: () => set(initialState),
}))
```

Create `src/lib/store/index.ts`:
```typescript
// Re-export all stores
export * from './conversation.store'

// Future stores:
// export * from './compliance.store'
// export * from './evidence.store'
// export * from './credentials.store'
```

**Task 1.6: Create useConversation Hook**

Create `src/lib/hooks/useConversation.ts`:
```typescript
import { useCallback } from 'react'
import { useConversationStore } from '@/lib/store'
import { conversationService } from '@/lib/services'
import type { Message } from '@/lib/services'
import { generateId } from '@/lib/utils/id'

/**
 * useConversation Hook
 *
 * Provides conversation functionality to components.
 * Handles streaming, state updates, and error management.
 *
 * Usage:
 * ```typescript
 * const { messages, isStreaming, sendMessage } = useConversation()
 *
 * await sendMessage('What is a Murabaha?')
 * ```
 */
export function useConversation() {
  const {
    sessionId,
    messages,
    currentDealConfiguration,
    activatedControls,
    isStreaming,
    thinkingStatus,
    error,
    setSessionId,
    addMessage,
    updateDealConfiguration,
    setActivatedControls,
    setIsStreaming,
    setThinkingStatus,
    setError,
    clearMessages,
  } = useConversationStore()

  /**
   * Initialize a new conversation session
   */
  const initializeSession = useCallback(() => {
    const newSessionId = generateId()
    setSessionId(newSessionId)
    clearMessages()
    setError(null)
    return newSessionId
  }, [setSessionId, clearMessages, setError])

  /**
   * Send a message and handle streaming response
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) {
        console.warn('Already streaming, ignoring new message')
        return
      }

      // Ensure session is initialized
      const currentSessionId = sessionId || initializeSession()

      // Add user message to store
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: [{ type: 'text', text: content }],
        timestamp: new Date().toISOString(),
      }
      addMessage(userMessage)

      // Start streaming
      setIsStreaming(true)
      setError(null)

      let accumulatedText = ''
      let assistantMessageId = ''

      try {
        for await (const event of conversationService.streamMessage(content, {
          sessionId: currentSessionId,
          conversationHistory: messages,
          dealConfiguration: currentDealConfiguration,
        })) {
          switch (event.type) {
            case 'thinking':
              setThinkingStatus(event.data.message)
              break

            case 'message_start':
              assistantMessageId = event.data.message_id
              setThinkingStatus(null)
              break

            case 'message_delta':
              accumulatedText += event.data.delta
              // Update last message in store (or create new one)
              // For simplicity, we'll add complete message at the end
              break

            case 'message_complete':
              addMessage(event.data.message)
              break

            case 'error':
              setError(event.data.error)
              break

            case 'done':
              // Streaming complete
              break
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        console.error('Streaming error:', err)
      } finally {
        setIsStreaming(false)
        setThinkingStatus(null)
      }
    },
    [
      sessionId,
      messages,
      currentDealConfiguration,
      isStreaming,
      initializeSession,
      addMessage,
      setIsStreaming,
      setThinkingStatus,
      setError,
    ]
  )

  /**
   * Interrupt ongoing streaming
   */
  const interrupt = useCallback(() => {
    if (sessionId) {
      conversationService.interrupt(sessionId)
      setIsStreaming(false)
      setThinkingStatus(null)
    }
  }, [sessionId, setIsStreaming, setThinkingStatus])

  return {
    // State
    sessionId,
    messages,
    currentDealConfiguration,
    activatedControls,
    isStreaming,
    thinkingStatus,
    error,

    // Actions
    initializeSession,
    sendMessage,
    interrupt,
    clearMessages,
  }
}
```

#### Day 4 Morning: Layout and Navigation

**Task 1.7: Create Layout Components**

Create `src/components/layout/Header.tsx`:
```typescript
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-emerald-600">ZeroH</div>
            <div className="text-sm text-gray-500">V2</div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              href={ROUTES.CONFIGURATION}
              className="text-sm font-medium text-gray-700 hover:text-emerald-600"
            >
              Configure
            </Link>
            <Link
              href={ROUTES.REVIEW}
              className="text-sm font-medium text-gray-700 hover:text-emerald-600"
            >
              Review
            </Link>
            <Link
              href={ROUTES.DASHBOARD}
              className="text-sm font-medium text-gray-700 hover:text-emerald-600"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

Create `src/components/layout/Footer.tsx`:
```typescript
export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            © 2025 ZeroH. AI-Native Blockchain-Anchored Islamic Finance GRC.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
              Documentation
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

Create `src/components/layout/RootLayout.tsx`:
```typescript
import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface RootLayoutProps {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

**Task 1.8: Update App Layout**

Edit `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RootLayout } from '@/components/layout/RootLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZeroH V2 - AI-Native Islamic Finance GRC',
  description:
    'AI-Native Blockchain-Anchored GRC Platform for Islamic Finance Institutions',
  keywords: [
    'Islamic Finance',
    'GRC',
    'Compliance',
    'Blockchain',
    'Shariah',
    'Sukuk',
    'Murabaha',
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
```

**Task 1.9: Create Home Page**

Edit `src/app/page.tsx`:
```typescript
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        {/* Hero Section */}
        <h1 className="text-5xl font-bold text-gray-900">
          AI-Native Islamic Finance GRC
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          Complete your compliance journey in 3 conversational steps.
          Blockchain-anchored proof for Shariah-compliant financial products.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex justify-center space-x-4">
          <Link
            href={ROUTES.CONFIGURATION}
            className="rounded-lg bg-emerald-600 px-8 py-3 text-lg font-semibold text-white hover:bg-emerald-700"
          >
            Start Configuration
          </Link>
          <Link
            href={ROUTES.DASHBOARD}
            className="rounded-lg border border-gray-300 px-8 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Demo Dashboard
          </Link>
        </div>

        {/* 3-Step Process */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6">
            <div className="mb-4 text-4xl font-bold text-emerald-600">1</div>
            <h3 className="mb-2 text-xl font-semibold">Configure</h3>
            <p className="text-gray-600">
              Answer 12 questions conversationally. AI determines which controls apply to
              your deal.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <div className="mb-4 text-4xl font-bold text-emerald-600">2</div>
            <h3 className="mb-2 text-xl font-semibold">Review</h3>
            <p className="text-gray-600">
              Visualize Guardian policy structure. Amend workflows using BPMN editor if
              needed.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <div className="mb-4 text-4xl font-bold text-emerald-600">3</div>
            <h3 className="mb-2 text-xl font-semibold">Monitor</h3>
            <p className="text-gray-600">
              Track compliance across 5 Shariah-specific buckets. Mint VCs and NFT
              certificates.
            </p>
          </div>
        </div>

        {/* Key Differentiators */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900">
            Why ZeroH V2 is Different
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="text-left">
              <h3 className="font-semibold text-emerald-600">🤖 AI-Native</h3>
              <p className="mt-2 text-gray-600">
                Agent-based evidence collection and intelligent control activation, not
                just API integrations.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-emerald-600">
                🔗 Blockchain-Anchored
              </h3>
              <p className="mt-2 text-gray-600">
                Cryptographic proof via Hedera HCS, not just attestation reports. VCs →
                NFT certificates.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-emerald-600">
                💬 Conversational
              </h3>
              <p className="mt-2 text-gray-600">
                Natural language interface, not 50-field forms. Complete configuration in
                &lt;30 minutes.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-emerald-600">
                🕌 Shariah-Specific
              </h3>
              <p className="mt-2 text-gray-600">
                5-bucket Islamic finance taxonomy covering AAOIFI, IFSB, BNM standards.
                Not generic IT compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### Day 4 Afternoon: Basic UI Components

**Task 1.10: Create Radix UI Component Wrappers**

Create `src/components/ui/button.tsx`:
```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-emerald-600 text-white hover:bg-emerald-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

Create `src/components/ui/card.tsx`:
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils/cn'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Task 1.11: Test Core Infrastructure**

Create `src/app/configuration/page.tsx` (placeholder):
```typescript
'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useConversation } from '@/lib/hooks/useConversation'

export default function ConfigurationPage() {
  const { messages, isStreaming, sendMessage, initializeSession } = useConversation()

  const handleStart = () => {
    initializeSession()
    sendMessage('Hello, I want to create a Sukuk deal')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Configure Your Deal</CardTitle>
          <CardDescription>
            Answer 12 questions conversationally to configure your Islamic finance deal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Ready to start?</p>
                <Button onClick={handleStart} disabled={isStreaming}>
                  Start Configuration
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.role === 'user' ? 'bg-emerald-50 ml-12' : 'bg-gray-50 mr-12'
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-500 mb-1">
                      {message.role === 'user' ? 'You' : 'ZeroH AI'}
                    </div>
                    {message.content.map((content, idx) =>
                      content.type === 'text' ? (
                        <div key={idx}>{content.text}</div>
                      ) : null
                    )}
                  </div>
                ))}
                {isStreaming && (
                  <div className="text-sm text-gray-500 italic">AI is thinking...</div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Task 1.12: Commit Phase 1**
```bash
git add .
git commit -m "feat: implement core infrastructure and service layer

- Create ConversationService interface for backend pluggability
- Implement MockConversationService with AG-UI protocol compliance
- Setup Zustand store for conversation state management
- Create useConversation hook for React components
- Build layout components (Header, Footer, RootLayout)
- Create home page with 3-step overview
- Add basic UI components (Button, Card) with Radix UI
- Create placeholder configuration page with streaming demo

Infrastructure ready for Phase 2 implementation."

git push
```

### Phase 1 Deliverables Checklist
- [ ] ConversationService interface created
- [ ] MockConversationService implemented with AG-UI compliance
- [ ] Service factory with runtime selection
- [ ] Zustand store for conversation state
- [ ] useConversation hook functional
- [ ] Layout components (Header, Footer, RootLayout)
- [ ] Home page with 3-step overview
- [ ] Basic Radix UI components (Button, Card)
- [ ] Placeholder configuration page
- [ ] All TypeScript errors resolved
- [ ] Dev server running without errors
- [ ] Git commit pushed to GitHub

### Phase 1 Success Criteria
✅ Mock streaming conversation works end-to-end
✅ Messages persist in Zustand store
✅ Layout renders correctly across all pages
✅ Home page displays 3-step process
✅ Navigation between pages functional
✅ No console errors in browser
✅ TypeScript strict mode passes

---

## Phase 2: Step 1 - Conversational Configuration (Days 5-8)

### Objectives
- Build complete 12-question conversational interface
- Implement control activation logic
- Create chat UI with streaming message display
- Add progress tracking and deal summary sidebar
- Handle user input validation and error recovery

### Tasks

#### Day 5 Morning: Chat UI Foundation

**Task 2.1: Create ChatMessage Component**

Create `src/features/configuration/components/ChatMessage.tsx`:
```typescript
import { Message } from '@/lib/services'
import { cn } from '@/lib/utils/cn'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4',
          isUser
            ? 'bg-emerald-600 text-white'
            : 'bg-gray-100 text-gray-900',
          isStreaming && 'animate-pulse'
        )}
      >
        <div className="mb-1 text-xs font-semibold opacity-70">
          {isUser ? 'You' : 'ZeroH AI'}
        </div>
        <div className="text-sm">
          {message.content.map((content, idx) =>
            content.type === 'text' ? (
              <p key={idx} className="whitespace-pre-wrap">
                {content.text}
              </p>
            ) : null
          )}
        </div>
        <div className="mt-1 text-xs opacity-50">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
```

**Task 2.2: Create ChatInput Component**

Create `src/features/configuration/components/ChatInput.tsx`:
```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, StopCircle } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  onInterrupt: () => void
  disabled?: boolean
  isStreaming?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  onInterrupt,
  disabled = false,
  isStreaming = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus input
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled && !isStreaming) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100"
        style={{ maxHeight: '200px' }}
      />

      {isStreaming ? (
        <Button
          type="button"
          onClick={onInterrupt}
          variant="destructive"
          size="lg"
          className="shrink-0"
        >
          <StopCircle className="mr-2 h-4 w-4" />
          Stop
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          size="lg"
          className="shrink-0"
        >
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      )}
    </form>
  )
}
```

**Task 2.3: Create ThinkingIndicator Component**

Create `src/features/configuration/components/ThinkingIndicator.tsx`:
```typescript
interface ThinkingIndicatorProps {
  status: string | null
}

export function ThinkingIndicator({ status }: ThinkingIndicatorProps) {
  if (!status) return null

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-emerald-50 p-3 text-sm">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-600" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-600" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-600" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-emerald-700">{status}</span>
    </div>
  )
}
```

#### Day 5 Afternoon: Progress Tracking

**Task 2.4: Create 12-Question Configuration**

Create `src/features/configuration/constants/questions.ts`:
```typescript
/**
 * 12-Question MVQ (Minimum Viable Questionnaire)
 *
 * These questions intelligently activate 12-26 controls based on responses.
 * Order matters - builds context progressively.
 */

export interface Question {
  id: number
  category: string
  question: string
  hint: string
  extractionKey: keyof DealConfiguration
  controlImpact: string[]
}

export const MVQ_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Deal Structure',
    question: 'What type of Islamic finance structure are you implementing?',
    hint: 'Common options: Murabaha, Musharaka, Sukuk, Ijarah, Wakala',
    extractionKey: 'dealType',
    controlImpact: ['SG-01', 'SG-02', 'RL-01', 'RM-01'],
  },
  {
    id: 2,
    category: 'Asset Details',
    question: 'What asset class will this deal be based on?',
    hint: 'Examples: Real estate, commodities, infrastructure, manufacturing',
    extractionKey: 'assetClass',
    controlImpact: ['RL-02', 'RM-02', 'FR-01'],
  },
  {
    id: 3,
    category: 'Jurisdiction',
    question: 'Which jurisdiction will this deal be governed under?',
    hint: 'Examples: Malaysia, UAE, Saudi Arabia, United Kingdom, Indonesia',
    extractionKey: 'jurisdiction',
    controlImpact: ['RL-01', 'RL-03', 'AA-01'],
  },
  {
    id: 4,
    category: 'Deal Size',
    question: 'What is the expected issuance size and currency?',
    hint: 'Example: $100 million USD or 500 million MYR',
    extractionKey: 'issuanceSize',
    controlImpact: ['FR-02', 'FR-03', 'RM-03'],
  },
  {
    id: 5,
    category: 'Tenor',
    question: 'What is the tenor (duration) of this deal?',
    hint: 'Examples: 6 months, 2 years, 5 years, 10 years',
    extractionKey: 'tenor',
    controlImpact: ['RM-03', 'FR-04'],
  },
  {
    id: 6,
    category: 'Sukuk Structure',
    question: 'Does this deal involve a Sukuk issuance?',
    hint: 'Sukuk adds specific AAOIFI Shariah Standards requirements',
    extractionKey: 'isSukukStructure',
    controlImpact: ['SG-03', 'RL-04', 'FR-05', 'AA-02'],
  },
  {
    id: 7,
    category: 'Green/Sustainability',
    question: 'Is this a green, social, or sustainability-linked deal?',
    hint: 'ESG-linked deals require ICMA Principles compliance',
    extractionKey: 'isGreenSustainability',
    controlImpact: ['RL-05', 'AA-03', 'FR-06'],
  },
  {
    id: 8,
    category: 'Cross-Border',
    question: 'Does this deal involve cross-border transactions?',
    hint: 'Cross-border adds multi-jurisdictional compliance',
    extractionKey: 'isCrossBorder',
    controlImpact: ['RL-03', 'RM-04', 'AA-04'],
  },
  {
    id: 9,
    category: 'Payment Waterfall',
    question: 'Does this deal have a complex payment waterfall structure?',
    hint: 'Complex waterfalls require advanced financial modeling controls',
    extractionKey: 'hasComplexWaterfall',
    controlImpact: ['FR-04', 'RM-05', 'AA-05'],
  },
  {
    id: 10,
    category: 'Documentation',
    question: 'Will this deal require custom legal documentation?',
    hint: 'Custom docs need additional Shariah review cycles',
    extractionKey: 'requiresCustomDocumentation',
    controlImpact: ['SG-04', 'RL-02', 'AA-02'],
  },
  {
    id: 11,
    category: 'Third-Party Services',
    question: 'Does this deal involve third-party services (trustees, agents, servicers)?',
    hint: 'Third parties require vendor due diligence controls',
    extractionKey: 'hasThirdPartyServices',
    controlImpact: ['RM-04', 'AA-04'],
  },
  {
    id: 12,
    category: 'Final Confirmation',
    question: 'Have you provided accurate information for all previous questions?',
    hint: 'Final confirmation before generating Guardian policy',
    extractionKey: 'isConfirmed',
    controlImpact: [], // Triggers completion, no new controls
  },
]
```

**Task 2.5: Create ProgressTracker Component**

Create `src/features/configuration/components/ProgressTracker.tsx`:
```typescript
import { MVQ_QUESTIONS } from '../constants/questions'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ProgressTrackerProps {
  currentQuestion: number
  answeredQuestions: number[]
}

export function ProgressTracker({
  currentQuestion,
  answeredQuestions,
}: ProgressTrackerProps) {
  const progress = (answeredQuestions.length / MVQ_QUESTIONS.length) * 100

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">Configuration Progress</span>
          <span className="text-gray-500">
            {answeredQuestions.length} / {MVQ_QUESTIONS.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700">Questions</div>
        <div className="space-y-1">
          {MVQ_QUESTIONS.map((q) => {
            const isAnswered = answeredQuestions.includes(q.id)
            const isCurrent = q.id === currentQuestion

            return (
              <div
                key={q.id}
                className={cn(
                  'flex items-center space-x-2 rounded px-2 py-1 text-xs transition-colors',
                  isCurrent && 'bg-emerald-50',
                  isAnswered && 'text-gray-500'
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border-2',
                    isAnswered
                      ? 'border-emerald-600 bg-emerald-600'
                      : isCurrent
                      ? 'border-emerald-600 bg-white'
                      : 'border-gray-300 bg-white'
                  )}
                >
                  {isAnswered ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        isCurrent ? 'text-emerald-600' : 'text-gray-400'
                      )}
                    >
                      {q.id}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    isAnswered && 'line-through',
                    isCurrent && 'font-semibold text-emerald-700'
                  )}
                >
                  {q.category}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

#### Day 6 Morning: Deal Summary Sidebar

**Task 2.6: Create DealSummary Component**

Create `src/features/configuration/components/DealSummary.tsx`:
```typescript
import { DealConfiguration } from '@/lib/services'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FileText, MapPin, Coins, Calendar, CheckCircle, XCircle } from 'lucide-react'

interface DealSummaryProps {
  dealConfiguration: Partial<DealConfiguration>
  activatedControlsCount: number
}

export function DealSummary({
  dealConfiguration,
  activatedControlsCount,
}: DealSummaryProps) {
  const hasData = Object.keys(dealConfiguration).length > 0

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deal Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Your deal configuration will appear here as you answer questions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Deal Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deal Type */}
        {dealConfiguration.dealType && (
          <div className="flex items-start space-x-3">
            <FileText className="mt-0.5 h-4 w-4 text-emerald-600" />
            <div>
              <div className="text-xs font-semibold text-gray-500">Structure</div>
              <div className="text-sm font-medium">{dealConfiguration.dealType}</div>
            </div>
          </div>
        )}

        {/* Asset Class */}
        {dealConfiguration.assetClass && (
          <div className="flex items-start space-x-3">
            <Coins className="mt-0.5 h-4 w-4 text-emerald-600" />
            <div>
              <div className="text-xs font-semibold text-gray-500">Asset Class</div>
              <div className="text-sm font-medium">{dealConfiguration.assetClass}</div>
            </div>
          </div>
        )}

        {/* Jurisdiction */}
        {dealConfiguration.jurisdiction && (
          <div className="flex items-start space-x-3">
            <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
            <div>
              <div className="text-xs font-semibold text-gray-500">Jurisdiction</div>
              <div className="text-sm font-medium">{dealConfiguration.jurisdiction}</div>
            </div>
          </div>
        )}

        {/* Issuance Size */}
        {dealConfiguration.issuanceSize && (
          <div className="flex items-start space-x-3">
            <Coins className="mt-0.5 h-4 w-4 text-emerald-600" />
            <div>
              <div className="text-xs font-semibold text-gray-500">Issuance Size</div>
              <div className="text-sm font-medium">
                {dealConfiguration.currency} {dealConfiguration.issuanceSize.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Tenor */}
        {dealConfiguration.tenor && (
          <div className="flex items-start space-x-3">
            <Calendar className="mt-0.5 h-4 w-4 text-emerald-600" />
            <div>
              <div className="text-xs font-semibold text-gray-500">Tenor</div>
              <div className="text-sm font-medium">{dealConfiguration.tenor} years</div>
            </div>
          </div>
        )}

        {/* Boolean Flags */}
        <div className="space-y-2 border-t pt-4">
          <div className="text-xs font-semibold text-gray-500">Deal Characteristics</div>
          {dealConfiguration.isSukukStructure !== undefined && (
            <div className="flex items-center space-x-2 text-sm">
              {dealConfiguration.isSukukStructure ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span>Sukuk Structure</span>
            </div>
          )}
          {dealConfiguration.isGreenSustainability !== undefined && (
            <div className="flex items-center space-x-2 text-sm">
              {dealConfiguration.isGreenSustainability ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span>Green/Sustainability Linked</span>
            </div>
          )}
          {dealConfiguration.isCrossBorder !== undefined && (
            <div className="flex items-center space-x-2 text-sm">
              {dealConfiguration.isCrossBorder ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span>Cross-Border Transaction</span>
            </div>
          )}
        </div>

        {/* Activated Controls Counter */}
        {activatedControlsCount > 0 && (
          <div className="rounded-lg bg-emerald-50 p-3">
            <div className="text-xs font-semibold text-emerald-700">
              Activated Controls
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600">
              {activatedControlsCount}
            </div>
            <div className="text-xs text-emerald-600">
              {activatedControlsCount < 12 && 'Minimum 12 controls'}
              {activatedControlsCount >= 12 && activatedControlsCount < 20 && 'Standard complexity'}
              {activatedControlsCount >= 20 && 'High complexity deal'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

#### Day 6 Afternoon - Day 7: Enhanced Mock Service

**Task 2.7: Implement Intelligent Response Generation**

Update `src/lib/services/mock/mock-conversation.service.ts` to add intelligent question progression:

```typescript
// Add to MockConversationService class

private questionIndex = 0

private generateResponse(
  message: string,
  context: ConversationContext
): {
  text: string
  dealConfiguration?: Partial<DealConfiguration>
  activatedControls?: string[]
} {
  const lowerMessage = message.toLowerCase()

  // Increment question index
  this.questionIndex++

  // Question flow logic
  const question = MVQ_QUESTIONS[this.questionIndex]

  if (!question) {
    // All questions answered - final confirmation
    return {
      text: `Perfect! I've collected all the information needed. Your ${context.dealConfiguration?.dealType} deal will have ${this.calculateActivatedControls(context.dealConfiguration).length} activated controls across the 5 Shariah compliance buckets.\n\nShall we proceed to review the Guardian policy structure?`,
      activatedControls: this.calculateActivatedControls(context.dealConfiguration),
    }
  }

  // Extract configuration from user response
  const extractedConfig = this.extractConfigFromMessage(message, context)

  // Return next question with extracted data
  return {
    text: `${question.question}\n\n💡 ${question.hint}`,
    dealConfiguration: extractedConfig,
  }
}

private extractConfigFromMessage(
  message: string,
  context: ConversationContext
): Partial<DealConfiguration> {
  const config: Partial<DealConfiguration> = {}
  const lower = message.toLowerCase()

  // Deal type extraction
  if (lower.includes('murabaha')) config.dealType = 'Murabaha'
  else if (lower.includes('musharaka')) config.dealType = 'Musharaka'
  else if (lower.includes('sukuk')) config.dealType = 'Sukuk'
  else if (lower.includes('ijarah')) config.dealType = 'Ijarah'
  else if (lower.includes('wakala')) config.dealType = 'Wakala'

  // Asset class extraction
  if (lower.includes('real estate')) config.assetClass = 'Real Estate'
  else if (lower.includes('commodit')) config.assetClass = 'Commodities'
  else if (lower.includes('infrastructure')) config.assetClass = 'Infrastructure'
  else if (lower.includes('manufacturing')) config.assetClass = 'Manufacturing'

  // Jurisdiction extraction
  if (lower.includes('malaysia')) config.jurisdiction = 'Malaysia'
  else if (lower.includes('uae') || lower.includes('emirates')) config.jurisdiction = 'UAE'
  else if (lower.includes('saudi')) config.jurisdiction = 'Saudi Arabia'
  else if (lower.includes('uk') || lower.includes('united kingdom')) config.jurisdiction = 'United Kingdom'

  // Issuance size extraction (basic regex)
  const sizeMatch = message.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(million|billion)?\s*([A-Z]{3})?/i)
  if (sizeMatch) {
    let amount = parseFloat(sizeMatch[1].replace(/,/g, ''))
    if (sizeMatch[2]?.toLowerCase() === 'million') amount *= 1_000_000
    if (sizeMatch[2]?.toLowerCase() === 'billion') amount *= 1_000_000_000
    config.issuanceSize = amount
    config.currency = sizeMatch[3]?.toUpperCase() || 'USD'
  }

  // Tenor extraction
  const tenorMatch = message.match(/(\d+)\s*(year|month)/i)
  if (tenorMatch) {
    let tenor = parseInt(tenorMatch[1])
    if (tenorMatch[2].toLowerCase() === 'month') tenor = tenor / 12
    config.tenor = tenor
  }

  // Boolean flags
  if (lower.includes('yes') || lower.includes('true')) {
    if (context.conversationHistory.length === 6) config.isSukukStructure = true
    if (context.conversationHistory.length === 7) config.isGreenSustainability = true
    if (context.conversationHistory.length === 8) config.isCrossBorder = true
    if (context.conversationHistory.length === 9) config.hasComplexWaterfall = true
    if (context.conversationHistory.length === 10) config.requiresCustomDocumentation = true
    if (context.conversationHistory.length === 11) config.hasThirdPartyServices = true
  }

  return config
}

private calculateActivatedControls(
  dealConfig?: Partial<DealConfiguration>
): string[] {
  if (!dealConfig) return []

  const controls: string[] = [
    // Base controls (always activated)
    'SG-01', 'SG-02', 'RL-01', 'RM-01', 'FR-01', 'FR-02', 'AA-01',
    'RL-02', 'RM-02', 'FR-03', 'RM-03', 'FR-04' // 12 minimum
  ]

  // Sukuk-specific controls
  if (dealConfig.isSukukStructure) {
    controls.push('SG-03', 'RL-04', 'FR-05', 'AA-02')
  }

  // Green/Sustainability controls
  if (dealConfig.isGreenSustainability) {
    controls.push('RL-05', 'AA-03', 'FR-06')
  }

  // Cross-border controls
  if (dealConfig.isCrossBorder) {
    controls.push('RL-03', 'RM-04', 'AA-04')
  }

  // Complex waterfall controls
  if (dealConfig.hasComplexWaterfall) {
    controls.push('FR-04', 'RM-05', 'AA-05')
  }

  // Custom documentation controls
  if (dealConfig.requiresCustomDocumentation) {
    controls.push('SG-04', 'RL-02', 'AA-02')
  }

  // Third-party services controls
  if (dealConfig.hasThirdPartyServices) {
    controls.push('RM-04', 'AA-04')
  }

  // Remove duplicates and return
  return [...new Set(controls)]
}
```

#### Day 7 Afternoon: Complete Configuration Page

**Task 2.8: Build Full Configuration Page**

Update `src/app/configuration/page.tsx`:

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/features/configuration/components/ChatMessage'
import { ChatInput } from '@/features/configuration/components/ChatInput'
import { ThinkingIndicator } from '@/features/configuration/components/ThinkingIndicator'
import { ProgressTracker } from '@/features/configuration/components/ProgressTracker'
import { DealSummary } from '@/features/configuration/components/DealSummary'
import { useConversation } from '@/lib/hooks/useConversation'
import { ROUTES } from '@/lib/constants/routes'
import { ArrowRight } from 'lucide-react'

export default function ConfigurationPage() {
  const router = useRouter()
  const {
    messages,
    currentDealConfiguration,
    activatedControls,
    isStreaming,
    thinkingStatus,
    sendMessage,
    interrupt,
    initializeSession,
  } = useConversation()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasStarted = messages.length > 0

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinkingStatus])

  // Initialize session on mount
  useEffect(() => {
    if (!hasStarted) {
      initializeSession()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = () => {
    sendMessage(
      "Hi! I'd like to configure a new Islamic finance deal for compliance monitoring."
    )
  }

  const handleProceedToReview = () => {
    router.push(ROUTES.REVIEW)
  }

  // Check if configuration is complete (all 12 questions answered)
  const isComplete = activatedControls.length > 0 && messages.length >= 24 // 12 Q + 12 A

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Step 1: Configure Your Deal
        </h1>
        <p className="mt-2 text-gray-600">
          Answer 12 questions conversationally. Our AI will intelligently activate relevant
          controls based on your deal configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chat Area - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="flex h-[600px] flex-col">
            <CardHeader className="shrink-0">
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Chat naturally with ZeroH AI to configure your deal
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col space-y-4 overflow-hidden">
              {!hasStarted ? (
                /* Welcome Screen */
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-6 text-6xl">💬</div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Ready to Get Started?
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Let's configure your Islamic finance deal through a natural conversation.
                    This will take about 10-15 minutes.
                  </p>
                  <Button onClick={handleStart} size="lg">
                    Start Configuration
                  </Button>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {thinkingStatus && <ThinkingIndicator status={thinkingStatus} />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="shrink-0 border-t pt-4">
                    {isComplete ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="text-center">
                          <div className="text-2xl">✅</div>
                          <div className="mt-2 font-semibold text-emerald-600">
                            Configuration Complete!
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {activatedControls.length} controls activated for your deal
                          </div>
                        </div>
                        <Button onClick={handleProceedToReview} size="lg">
                          Proceed to Review
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <ChatInput
                        onSend={sendMessage}
                        onInterrupt={interrupt}
                        isStreaming={isStreaming}
                        placeholder="Type your answer..."
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Progress Tracker */}
          <Card>
            <CardContent className="pt-6">
              <ProgressTracker
                currentQuestion={Math.ceil(messages.length / 2) + 1}
                answeredQuestions={Array.from(
                  { length: Math.floor(messages.length / 2) },
                  (_, i) => i + 1
                )}
              />
            </CardContent>
          </Card>

          {/* Deal Summary */}
          <DealSummary
            dealConfiguration={currentDealConfiguration}
            activatedControlsCount={activatedControls.length}
          />
        </div>
      </div>
    </div>
  )
}
```

#### Day 8: Testing and Refinement

**Task 2.9: Manual Testing Checklist**

Test the following scenarios:

1. **Happy Path**:
   - Start configuration
   - Answer all 12 questions naturally
   - Verify deal summary updates correctly
   - Verify progress tracker advances
   - Verify activated controls count increases
   - Complete configuration and proceed to review

2. **Edge Cases**:
   - Type gibberish answer (AI should handle gracefully)
   - Interrupt mid-streaming (stop button works)
   - Refresh page mid-conversation (state persists or resets gracefully)
   - Very long answer (textarea expands, message renders correctly)

3. **UI/UX**:
   - Messages auto-scroll to bottom
   - Thinking indicator animates smoothly
   - Chat input disabled during streaming
   - Progress bar animates smoothly
   - Deal summary updates in real-time

**Task 2.10: Fix Issues and Polish**

Common issues to address:
- Zustand state not persisting across page refreshes → Add persistence with localStorage
- Messages not scrolling → Check ref attachment and useEffect dependencies
- Streaming too fast → Adjust delay constants in config
- Type errors → Ensure all interfaces align

**Task 2.11: Add LocalStorage Persistence**

Create `src/lib/store/middleware/persistence.ts`:
```typescript
import { StateCreator } from 'zustand'

export const persist =
  <T>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    const storageKey = 'zeroh-v2-conversation'

    // Load initial state from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          set(parsed)
        } catch (e) {
          console.error('Failed to parse stored state:', e)
        }
      }
    }

    // Wrap set to persist on every state change
    const persistentSet: typeof set = (partial, replace) => {
      set(partial, replace)
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(get()))
      }
    }

    return config(persistentSet, get, api)
  }
```

Update `src/lib/store/conversation.store.ts` to use persistence:
```typescript
import { create } from 'zustand'
import { persist } from './middleware/persistence'

// ... rest of code stays same, but wrap create:
export const useConversationStore = create<ConversationState>()(
  persist((set) => ({
    // ... existing implementation
  }))
)
```

**Task 2.12: Commit Phase 2**
```bash
git add .
git commit -m "feat: implement Step 1 conversational configuration UI

- Create 12-question MVQ configuration flow
- Build chat UI with streaming message display
- Implement progress tracker with visual indicators
- Add deal summary sidebar with real-time updates
- Create intelligent mock response generation with context awareness
- Add localStorage persistence for conversation state
- Implement control activation logic (12-26 controls based on complexity)
- Add thinking indicator animations
- Create chat input with auto-resize textarea
- Build completion state with proceed to review flow

Features:
- Natural language question answering
- Real-time deal configuration extraction
- Animated progress tracking
- Responsive 2-column + sidebar layout
- Interrupt streaming capability
- Auto-scroll chat messages

Step 1 complete - ready for Phase 3 (Review & Confirmation)."

git push
```

### Phase 2 Deliverables Checklist
- [ ] ChatMessage component with role-based styling
- [ ] ChatInput component with auto-resize and keyboard shortcuts
- [ ] ThinkingIndicator with animated dots
- [ ] ProgressTracker showing 12 questions with completion status
- [ ] DealSummary sidebar with real-time configuration display
- [ ] 12-question MVQ configuration defined
- [ ] Intelligent mock response generation with context
- [ ] Control activation logic (12-26 controls)
- [ ] Complete configuration page with 2-column layout
- [ ] LocalStorage persistence for conversation state
- [ ] Auto-scroll chat messages
- [ ] Interrupt streaming functionality
- [ ] Completion detection and proceed button
- [ ] All components responsive for mobile
- [ ] Manual testing completed with no critical bugs

### Phase 2 Success Criteria
✅ User can complete full 12-question flow naturally
✅ Deal summary updates in real-time as user answers
✅ Progress tracker shows current question and completed questions
✅ Control activation count increases based on deal complexity
✅ Streaming works smoothly with realistic delays
✅ Thinking indicator displays during processing
✅ Chat input handles edge cases (long text, empty input)
✅ Completion state triggers "Proceed to Review" button
✅ State persists across page refreshes
✅ No console errors or TypeScript errors

---

## Phase 3: Step 2 - Review & Confirmation (Days 9-12)

### Objectives
- Integrate BPMN.io visualizer from V1 (modernized)
- Display Guardian policy structure visually
- Allow policy amendments (optional editable mode)
- Add workflow test simulator with animations
- Create approval/confirmation flow

### Tasks

#### Day 9 Morning: BPMN Viewer Integration

**Task 3.1: Install BPMN Dependencies**
```bash
npm install bpmn-js@17.2.0
npm install -D @types/bpmn-js
```

**Task 3.2: Create Guardian Policy Mock Data**

Create `src/features/compliance/constants/guardian-policies.ts`:
```typescript
/**
 * Mock Guardian Policy BPMN XML
 *
 * This represents a simplified Guardian policy for Sukuk issuance.
 * In production, this would be generated by backend based on activated controls.
 */

export const SUKUK_GUARDIAN_POLICY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  id="Definitions_1"
                  targetNamespace="http://zeroh.io/schema/guardian">
  <bpmn:process id="SukukComplianceProcess" name="Sukuk Compliance Workflow" isExecutable="true">

    <bpmn:startEvent id="StartEvent_1" name="Deal Initiated">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>

    <!-- Shariah Governance Bucket -->
    <bpmn:task id="Task_SG01" name="SG-01: Shariah Advisor Appointment">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>

    <bpmn:task id="Task_SG02" name="SG-02: Shariah Compliance Certificate">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:task>

    <bpmn:task id="Task_SG03" name="SG-03: Sukuk Structure Review">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:task>

    <!-- Regulatory & Legal Bucket -->
    <bpmn:task id="Task_RL01" name="RL-01: Jurisdiction Registration">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>

    <bpmn:task id="Task_RL02" name="RL-02: Legal Documentation Review">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>

    <!-- Risk Management Bucket -->
    <bpmn:task id="Task_RM01" name="RM-01: Risk Assessment">
      <bpmn:incoming>Flow_6</bpmn:incoming>
      <bpmn:outgoing>Flow_7</bpmn:outgoing>
    </bpmn:task>

    <!-- Financial & Reporting Bucket -->
    <bpmn:task id="Task_FR01" name="FR-01: Financial Model Validation">
      <bpmn:incoming>Flow_7</bpmn:incoming>
      <bpmn:outgoing>Flow_8</bpmn:outgoing>
    </bpmn:task>

    <!-- Audit & Assurance Bucket -->
    <bpmn:task id="Task_AA01" name="AA-01: Independent Audit">
      <bpmn:incoming>Flow_8</bpmn:incoming>
      <bpmn:outgoing>Flow_9</bpmn:outgoing>
    </bpmn:task>

    <bpmn:endEvent id="EndEvent_1" name="Compliance Certified">
      <bpmn:incoming>Flow_9</bpmn:incoming>
    </bpmn:endEvent>

    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_SG01" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_SG01" targetRef="Task_SG02" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_SG02" targetRef="Task_SG03" />
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_SG03" targetRef="Task_RL01" />
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_RL01" targetRef="Task_RL02" />
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_RL02" targetRef="Task_RM01" />
    <bpmn:sequenceFlow id="Flow_7" sourceRef="Task_RM01" targetRef="Task_FR01" />
    <bpmn:sequenceFlow id="Flow_8" sourceRef="Task_FR01" targetRef="Task_AA01" />
    <bpmn:sequenceFlow id="Flow_9" sourceRef="Task_AA01" targetRef="EndEvent_1" />

  </bpmn:process>

  <!-- Diagram Information (positions, sizes) -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="SukukComplianceProcess">

      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_SG01_di" bpmnElement="Task_SG01">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_SG02_di" bpmnElement="Task_SG02">
        <dc:Bounds x="390" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_SG03_di" bpmnElement="Task_SG03">
        <dc:Bounds x="540" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_RL01_di" bpmnElement="Task_RL01">
        <dc:Bounds x="690" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_RL02_di" bpmnElement="Task_RL02">
        <dc:Bounds x="240" y="200" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_RM01_di" bpmnElement="Task_RM01">
        <dc:Bounds x="390" y="200" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_FR01_di" bpmnElement="Task_FR01">
        <dc:Bounds x="540" y="200" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_AA01_di" bpmnElement="Task_AA01">
        <dc:Bounds x="690" y="200" width="100" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="842" y="222" width="36" height="36" />
      </bpmndi:BPMNShape>

      <!-- Sequence Flow Edges -->
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="390" y="120" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="490" y="120" />
        <di:waypoint x="540" y="120" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="640" y="120" />
        <di:waypoint x="690" y="120" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="740" y="160" />
        <di:waypoint x="740" y="240" />
        <di:waypoint x="340" y="240" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="340" y="240" />
        <di:waypoint x="390" y="240" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_7_di" bpmnElement="Flow_7">
        <di:waypoint x="490" y="240" />
        <di:waypoint x="540" y="240" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_8_di" bpmnElement="Flow_8">
        <di:waypoint x="640" y="240" />
        <di:waypoint x="690" y="240" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_9_di" bpmnElement="Flow_9">
        <di:waypoint x="790" y="240" />
        <di:waypoint x="842" y="240" />
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>`

export function generateGuardianPolicy(activatedControls: string[]): string {
  // In production, this would dynamically generate BPMN XML based on controls
  // For demo, return static policy
  return SUKUK_GUARDIAN_POLICY_XML
}
```

**Task 3.3: Create BPMN Viewer Component**

Create `src/features/compliance/components/BpmnViewer.tsx`:
```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import BpmnJS from 'bpmn-js/lib/Viewer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react'

interface BpmnViewerProps {
  xml: string
  title?: string
  description?: string
  height?: number
}

export function BpmnViewer({
  xml,
  title = 'Guardian Policy Workflow',
  description = 'Visual representation of your compliance workflow',
  height = 500,
}: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<BpmnJS | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize BPMN viewer
    const viewer = new BpmnJS({
      container: containerRef.current,
      height,
    })

    viewerRef.current = viewer

    // Import XML
    viewer
      .importXML(xml)
      .then(() => {
        const canvas = viewer.get('canvas')
        canvas.zoom('fit-viewport')
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to render BPMN diagram:', err)
        setError('Failed to load workflow diagram')
        setIsLoading(false)
      })

    // Cleanup
    return () => {
      viewer.destroy()
    }
  }, [xml, height])

  const handleZoomIn = () => {
    const canvas = viewerRef.current?.get('canvas')
    if (canvas) {
      canvas.zoom(canvas.zoom() * 1.2)
    }
  }

  const handleZoomOut = () => {
    const canvas = viewerRef.current?.get('canvas')
    if (canvas) {
      canvas.zoom(canvas.zoom() / 1.2)
    }
  }

  const handleFitViewport = () => {
    const canvas = viewerRef.current?.get('canvas')
    if (canvas) {
      canvas.zoom('fit-viewport')
    }
  }

  const handleDownloadSVG = async () => {
    try {
      const { svg } = await viewerRef.current!.saveSVG()
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'guardian-policy.svg'
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download SVG:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleFitViewport}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownloadSVG}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex h-[500px] items-center justify-center text-red-600">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex h-[500px] items-center justify-center text-gray-500">
            Loading workflow...
          </div>
        ) : (
          <div
            ref={containerRef}
            className="border border-gray-200 rounded-lg overflow-hidden"
            style={{ height: `${height}px` }}
          />
        )}
      </CardContent>
    </Card>
  )
}
```

**Task 3.4: Create Review Page with BPMN Viewer**

Create `src/app/review/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConversationStore } from '@/lib/store'
import { BpmnViewer } from '@/features/compliance/components/BpmnViewer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { generateGuardianPolicy } from '@/features/compliance/constants/guardian-policies'
import { ROUTES } from '@/lib/constants/routes'
import { ArrowRight, ArrowLeft, Edit2, Check } from 'lucide-react'

export default function ReviewPage() {
  const router = useRouter()
  const { activatedControls, currentDealConfiguration } = useConversationStore()
  const [policyXml] = useState(() => generateGuardianPolicy(activatedControls))
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = () => {
    setIsApproved(true)
  }

  const handleProceedToDashboard = () => {
    router.push(ROUTES.DASHBOARD)
  }

  const handleBackToConfiguration = () => {
    router.push(ROUTES.CONFIGURATION)
  }

  if (activatedControls.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 text-2xl font-semibold">No Configuration Found</h2>
            <p className="mb-6 text-gray-600">
              Please complete the configuration step first.
            </p>
            <Button onClick={handleBackToConfiguration}>
              Go to Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Step 2: Review Guardian Policy
        </h1>
        <p className="mt-2 text-gray-600">
          Review the generated Guardian policy structure. You can amend the workflow if needed before proceeding.
        </p>
      </div>

      <div className="space-y-6">
        {/* Deal Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Configuration Summary</CardTitle>
            <CardDescription>
              Configured {currentDealConfiguration.dealType} with {activatedControls.length} activated controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <div className="text-xs font-semibold text-gray-500">Deal Type</div>
                <div className="text-sm font-medium">{currentDealConfiguration.dealType}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">Asset Class</div>
                <div className="text-sm font-medium">{currentDealConfiguration.assetClass}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">Jurisdiction</div>
                <div className="text-sm font-medium">{currentDealConfiguration.jurisdiction}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">Controls</div>
                <div className="text-sm font-medium">{activatedControls.length} activated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BPMN Viewer */}
        <BpmnViewer
          xml={policyXml}
          title="Guardian Policy Workflow"
          description="Visual representation of your Shariah compliance workflow based on activated controls"
          height={600}
        />

        {/* Approval Section */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Approval</CardTitle>
            <CardDescription>
              Review the workflow above and approve to proceed to execution monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleBackToConfiguration}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Configuration
                </Button>
                <Button
                  variant="outline"
                  disabled
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Workflow (Coming Soon)
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                {!isApproved ? (
                  <Button onClick={handleApprove} size="lg">
                    <Check className="mr-2 h-4 w-4" />
                    Approve Policy
                  </Button>
                ) : (
                  <Button onClick={handleProceedToDashboard} size="lg">
                    Proceed to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control List */}
        <Card>
          <CardHeader>
            <CardTitle>Activated Controls ({activatedControls.length})</CardTitle>
            <CardDescription>
              Controls that will be monitored in this compliance workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {activatedControls.map((controlId) => (
                <div
                  key={controlId}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                >
                  {controlId}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

**Task 3.5: Add Product Tour for Review Page**

Create `src/lib/tour/review-tour-steps.tsx`:
```typescript
import { Step } from 'react-joyride'

export const reviewTourSteps: Step[] = [
  {
    target: '[data-tour="bpmn-viewer"]',
    content: (
      <div>
        <h3 className="font-semibold">Guardian Policy Visualization</h3>
        <p className="mt-2">
          This BPMN diagram shows your compliance workflow. Each task represents a control
          that must be executed for Shariah compliance.
        </p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="zoom-controls"]',
    content: (
      <div>
        <h3 className="font-semibold">Workflow Navigation</h3>
        <p className="mt-2">
          Use zoom controls to explore the workflow in detail. Download the policy as SVG for documentation.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="approve-button"]',
    content: (
      <div>
        <h3 className="font-semibold">Approve to Continue</h3>
        <p className="mt-2">
          Once satisfied with the Guardian policy structure, approve to proceed to the GRC dashboard for execution monitoring.
        </p>
      </div>
    ),
    placement: 'top',
  },
]
```

**Task 3.6: Commit Phase 3 (Partial)**
```bash
git add .
git commit -m "feat: implement Step 2 review page with BPMN viewer

- Integrate bpmn-js for Guardian policy visualization
- Create BpmnViewer component with zoom/download controls
- Add mock Guardian policy BPMN XML generation
- Build review page with deal summary and approval flow
- Add control list display
- Create navigation between configuration and dashboard

Review step complete - ready for Phase 4 (GRC Dashboard)."

git push
```

### Phase 3 Deliverables Checklist
- [ ] bpmn-js library integrated
- [ ] BpmnViewer component created with controls
- [ ] Guardian policy mock data (BPMN XML)
- [ ] Review page with BPMN visualization
- [ ] Deal configuration summary display
- [ ] Activated controls list
- [ ] Approval flow implemented
- [ ] Navigation to/from configuration and dashboard
- [ ] Product tour steps defined
- [ ] BPMN zoom/pan/download functionality working

### Phase 3 Success Criteria
✅ Guardian policy renders correctly in BPMN viewer
✅ Zoom, pan, and download controls functional
✅ Deal summary displays configuration accurately
✅ Activated controls list matches configuration
✅ Approval button enables dashboard navigation
✅ "Back to Configuration" button works
✅ No TypeScript or console errors

---

## Phase 4: Step 3 - GRC Dashboard (Days 13-16)

### Objectives
- Build 5-bucket compliance dashboard
- Create control status cards with progress indicators
- Add evidence repository UI
- Implement VC (Verifiable Credential) display
- Add NFT certificate preview
- Create compliance timeline visualization

### Tasks

#### Day 13 Morning: 5-Bucket Framework

**Task 4.1: Define Control Library**

Create `src/features/compliance/constants/control-library.ts`:
```typescript
/**
 * 5-Bucket Control Framework for Islamic Finance
 *
 * Aligned with AAOIFI, IFSB, BNM standards
 */

export interface Control {
  id: string
  bucket: Bucket
  name: string
  description: string
  standards: string[] // AAOIFI GS-X, IFSB-X, etc.
  criticality: 'high' | 'medium' | 'low'
  estimatedDuration: string // e.g., "5-7 days"
}

export type Bucket =
  | 'Shariah Governance'
  | 'Regulatory & Legal'
  | 'Risk Management'
  | 'Financial & Reporting'
  | 'Audit & Assurance'

export const CONTROL_LIBRARY: Control[] = [
  // Shariah Governance Bucket (5 controls)
  {
    id: 'SG-01',
    bucket: 'Shariah Governance',
    name: 'Shariah Advisor Appointment',
    description: 'Appoint qualified Shariah advisor per AAOIFI GS-1',
    standards: ['AAOIFI GS-1', 'IFSB-10'],
    criticality: 'high',
    estimatedDuration: '3-5 days',
  },
  {
    id: 'SG-02',
    bucket: 'Shariah Governance',
    name: 'Shariah Compliance Certificate',
    description: 'Obtain Shariah compliance certification from advisor',
    standards: ['AAOIFI GS-1', 'BNM SGF'],
    criticality: 'high',
    estimatedDuration: '7-10 days',
  },
  {
    id: 'SG-03',
    bucket: 'Shariah Governance',
    name: 'Sukuk Structure Review',
    description: 'Shariah advisor reviews and approves Sukuk structure',
    standards: ['AAOIFI SS-17', 'IFSB-7'],
    criticality: 'high',
    estimatedDuration: '5-7 days',
  },
  {
    id: 'SG-04',
    bucket: 'Shariah Governance',
    name: 'Custom Documentation Review',
    description: 'Additional Shariah review for custom legal documents',
    standards: ['AAOIFI GS-2', 'BNM SGF'],
    criticality: 'medium',
    estimatedDuration: '3-5 days',
  },
  {
    id: 'SG-05',
    bucket: 'Shariah Governance',
    name: 'Periodic Shariah Audit',
    description: 'Ongoing Shariah compliance monitoring',
    standards: ['AAOIFI GS-3', 'IFSB-10'],
    criticality: 'medium',
    estimatedDuration: 'Continuous',
  },

  // Regulatory & Legal Bucket (5 controls)
  {
    id: 'RL-01',
    bucket: 'Regulatory & Legal',
    name: 'Jurisdiction Registration',
    description: 'Register deal with relevant regulatory authority',
    standards: ['FATF R15', 'Local Regulations'],
    criticality: 'high',
    estimatedDuration: '10-15 days',
  },
  {
    id: 'RL-02',
    bucket: 'Regulatory & Legal',
    name: 'Legal Documentation Review',
    description: 'Legal counsel reviews offering documents',
    standards: ['ICMA Standards', 'Local Law'],
    criticality: 'high',
    estimatedDuration: '7-10 days',
  },
  {
    id: 'RL-03',
    bucket: 'Regulatory & Legal',
    name: 'Cross-Border Compliance',
    description: 'Multi-jurisdictional regulatory compliance',
    standards: ['FATF R40', 'Basel III'],
    criticality: 'high',
    estimatedDuration: '15-20 days',
  },
  {
    id: 'RL-04',
    bucket: 'Regulatory & Legal',
    name: 'Sukuk Regulatory Filing',
    description: 'File Sukuk prospectus with securities regulator',
    standards: ['IOSCO Principles', 'Local SEC'],
    criticality: 'high',
    estimatedDuration: '10-15 days',
  },
  {
    id: 'RL-05',
    bucket: 'Regulatory & Legal',
    name: 'Green Bond Compliance',
    description: 'Compliance with ICMA Green Bond Principles',
    standards: ['ICMA GBP', 'EU Taxonomy'],
    criticality: 'medium',
    estimatedDuration: '5-7 days',
  },

  // Risk Management Bucket (5 controls)
  {
    id: 'RM-01',
    bucket: 'Risk Management',
    name: 'Risk Assessment',
    description: 'Comprehensive risk identification and assessment',
    standards: ['IFSB-1', 'Basel III'],
    criticality: 'high',
    estimatedDuration: '7-10 days',
  },
  {
    id: 'RM-02',
    bucket: 'Risk Management',
    name: 'Asset Risk Evaluation',
    description: 'Asset-specific risk analysis',
    standards: ['IFSB-1', 'AAOIFI FAS-34'],
    criticality: 'high',
    estimatedDuration: '5-7 days',
  },
  {
    id: 'RM-03',
    bucket: 'Risk Management',
    name: 'Liquidity Risk Management',
    description: 'Liquidity risk assessment and mitigation',
    standards: ['IFSB-12', 'Basel III LCR'],
    criticality: 'high',
    estimatedDuration: '5-7 days',
  },
  {
    id: 'RM-04',
    bucket: 'Risk Management',
    name: 'Third-Party Due Diligence',
    description: 'Vendor risk assessment and due diligence',
    standards: ['FATF R10', 'ISO 31000'],
    criticality: 'medium',
    estimatedDuration: '7-10 days',
  },
  {
    id: 'RM-05',
    bucket: 'Risk Management',
    name: 'Complex Waterfall Risk',
    description: 'Cash flow waterfall stress testing',
    standards: ['IFSB-15', 'Basel III'],
    criticality: 'medium',
    estimatedDuration: '5-7 days',
  },

  // Financial & Reporting Bucket (6 controls)
  {
    id: 'FR-01',
    bucket: 'Financial & Reporting',
    name: 'Financial Model Validation',
    description: 'Independent validation of financial models',
    standards: ['AAOIFI FAS-32', 'IFRS'],
    criticality: 'high',
    estimatedDuration: '7-10 days',
  },
  {
    id: 'FR-02',
    bucket: 'Financial & Reporting',
    name: 'Deal Sizing Analysis',
    description: 'Verify deal size and pricing appropriateness',
    standards: ['AAOIFI FAS-33', 'IFRS 9'],
    criticality: 'high',
    estimatedDuration: '3-5 days',
  },
  {
    id: 'FR-03',
    bucket: 'Financial & Reporting',
    name: 'Currency Risk Assessment',
    description: 'FX risk analysis and hedging strategy',
    standards: ['IFSB-1', 'AAOIFI SS-1'],
    criticality: 'medium',
    estimatedDuration: '3-5 days',
  },
  {
    id: 'FR-04',
    bucket: 'Financial & Reporting',
    name: 'Tenor Appropriateness',
    description: 'Validate tenor matches asset life and Shariah requirements',
    standards: ['AAOIFI SS-17', 'IFSB-7'],
    criticality: 'medium',
    estimatedDuration: '2-3 days',
  },
  {
    id: 'FR-05',
    bucket: 'Financial & Reporting',
    name: 'Sukuk Pricing Validation',
    description: 'Independent pricing review for Sukuk issuance',
    standards: ['AAOIFI FAS-25', 'IFRS 9'],
    criticality: 'high',
    estimatedDuration: '5-7 days',
  },
  {
    id: 'FR-06',
    bucket: 'Financial & Reporting',
    name: 'ESG Reporting',
    description: 'Environmental, Social, Governance metrics reporting',
    standards: ['ICMA SBP', 'GRI Standards'],
    criticality: 'medium',
    estimatedDuration: '5-7 days',
  },

  // Audit & Assurance Bucket (5 controls)
  {
    id: 'AA-01',
    bucket: 'Audit & Assurance',
    name: 'Independent Audit',
    description: 'External auditor engagement and audit execution',
    standards: ['ISA 315', 'AAOIFI GSIFI-1'],
    criticality: 'high',
    estimatedDuration: '10-15 days',
  },
  {
    id: 'AA-02',
    bucket: 'Audit & Assurance',
    name: 'Shariah Audit',
    description: 'Independent Shariah audit by qualified auditor',
    standards: ['AAOIFI GSIFI-1', 'IFSB-10'],
    criticality: 'high',
    estimatedDuration: '10-15 days',
  },
  {
    id: 'AA-03',
    bucket: 'Audit & Assurance',
    name: 'Green Bond Verification',
    description: 'Third-party verification of green bond use of proceeds',
    standards: ['ICMA GBP', 'ISO 14030'],
    criticality: 'medium',
    estimatedDuration: '7-10 days',
  },
  {
    id: 'AA-04',
    bucket: 'Audit & Assurance',
    name: 'Cross-Border Audit',
    description: 'Multi-jurisdictional audit coordination',
    standards: ['ISA 600', 'PCAOB'],
    criticality: 'medium',
    estimatedDuration: '10-15 days',
  },
  {
    id: 'AA-05',
    bucket: 'Audit & Assurance',
    name: 'Waterfall Audit Trail',
    description: 'Audit complex payment waterfall calculations',
    standards: ['ISA 315', 'SOX 404'],
    criticality: 'medium',
    estimatedDuration: '5-7 days',
  },
]

export function getControlsByBucket(bucket: Bucket): Control[] {
  return CONTROL_LIBRARY.filter((c) => c.bucket === bucket)
}

export function getControlById(id: string): Control | undefined {
  return CONTROL_LIBRARY.find((c) => c.id === id)
}

export const BUCKETS: Bucket[] = [
  'Shariah Governance',
  'Regulatory & Legal',
  'Risk Management',
  'Financial & Reporting',
  'Audit & Assurance',
]
```

#### Day 13 Afternoon: Dashboard Layout

**Task 4.2: Create BucketCard Component**

Create `src/features/compliance/components/BucketCard.tsx`:
```typescript
import { Control } from '../constants/control-library'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BucketCardProps {
  bucket: string
  controls: Control[]
  activatedControlIds: string[]
  completedControlIds?: string[]
  color: string
}

export function BucketCard({
  bucket,
  controls,
  activatedControlIds,
  completedControlIds = [],
  color,
}: BucketCardProps) {
  const activeControls = controls.filter((c) => activatedControlIds.includes(c.id))
  const completedCount = activeControls.filter((c) => completedControlIds.includes(c.id)).length
  const progress = activeControls.length > 0 ? (completedCount / activeControls.length) * 100 : 0

  if (activeControls.length === 0) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="text-lg">{bucket}</CardTitle>
          <div className="text-sm text-gray-500">No controls activated</div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{bucket}</CardTitle>
          <div
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              `bg-${color}-100 text-${color}-700`
            )}
          >
            {completedCount} / {activeControls.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Completion</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className={`bg-${color}-200`} />
        </div>

        {/* Control List */}
        <div className="space-y-2">
          {activeControls.map((control) => {
            const isCompleted = completedControlIds.includes(control.id)
            const isInProgress = !isCompleted // Mock: assume in progress if not completed

            return (
              <div
                key={control.id}
                className={cn(
                  'flex items-start space-x-3 rounded-lg border p-3 transition-colors',
                  isCompleted && 'bg-green-50 border-green-200',
                  isInProgress && 'bg-gray-50 border-gray-200'
                )}
              >
                <div className="shrink-0 pt-0.5">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : isInProgress ? (
                    <Clock className="h-5 w-5 text-orange-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{control.id}</div>
                    <div className="shrink-0 text-xs text-gray-500">
                      {control.estimatedDuration}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">{control.name}</div>
                  <div className="mt-1 text-xs text-gray-500">{control.description}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {control.standards.map((standard) => (
                      <span
                        key={standard}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Task 4.3: Create Dashboard Page**

Create `src/app/dashboard/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useConversationStore } from '@/lib/store'
import { BucketCard } from '@/features/compliance/components/BucketCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CONTROL_LIBRARY, BUCKETS, getControlsByBucket } from '@/features/compliance/constants/control-library'
import { Award, Download, Share2 } from 'lucide-react'

export default function DashboardPage() {
  const { activatedControls, currentDealConfiguration } = useConversationStore()

  // Mock: Simulate some controls as completed for demo
  const [completedControls] = useState(() => {
    const completed = activatedControls.slice(0, Math.floor(activatedControls.length / 3))
    return completed
  })

  const bucketColors = {
    'Shariah Governance': 'emerald',
    'Regulatory & Legal': 'blue',
    'Risk Management': 'orange',
    'Financial & Reporting': 'purple',
    'Audit & Assurance': 'pink',
  }

  const overallProgress =
    activatedControls.length > 0
      ? Math.round((completedControls.length / activatedControls.length) * 100)
      : 0

  const isCertifiable = overallProgress === 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Step 3: Compliance Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Monitor compliance execution across 5 Shariah-specific control buckets.
        </p>
      </div>

      <div className="space-y-6">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Overall Compliance Progress</CardTitle>
                <CardDescription>
                  {currentDealConfiguration.dealType} • {activatedControls.length} Controls • {currentDealConfiguration.jurisdiction}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-600">{overallProgress}%</div>
                <div className="text-xs text-gray-500">
                  {completedControls.length} / {activatedControls.length} Complete
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" disabled>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Auditor
                </Button>
              </div>
              {isCertifiable && (
                <Button size="lg">
                  <Award className="mr-2 h-4 w-4" />
                  Mint NFT Certificate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 5-Bucket Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {BUCKETS.map((bucket) => {
            const controls = getControlsByBucket(bucket)
            return (
              <BucketCard
                key={bucket}
                bucket={bucket}
                controls={controls}
                activatedControlIds={activatedControls}
                completedControlIds={completedControls}
                color={bucketColors[bucket]}
              />
            )
          })}
        </div>

        {/* Certification Status */}
        {isCertifiable && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <Award className="h-12 w-12 text-emerald-600" />
                <div>
                  <div className="text-lg font-semibold text-emerald-900">
                    Ready for Certification
                  </div>
                  <div className="text-sm text-emerald-700">
                    All controls passed. You can now mint your compliance NFT certificate.
                  </div>
                </div>
              </div>
              <Button size="lg">
                Mint Certificate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
```

**Task 4.4: Create Progress Component**

Create `src/components/ui/progress.tsx`:
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils/cn'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
        {...props}
      >
        <div
          className="h-full bg-emerald-600 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }
```

**Task 4.5: Commit Phase 4**
```bash
git add .
git commit -m "feat: implement Step 3 GRC dashboard with 5-bucket framework

- Create comprehensive control library (26 controls across 5 buckets)
- Build BucketCard component with progress indicators
- Implement dashboard page with bucket breakdown
- Add control status visualization (completed, in progress, pending)
- Create overall progress tracking
- Add NFT certificate minting placeholder
- Implement Progress UI component

Features:
- 5-bucket Shariah-specific taxonomy
- Per-bucket and overall progress tracking
- Control-level detail with standards mapping
- Estimated duration for each control
- Certification readiness indicator

GRC dashboard complete - ready for Phase 5 (Polish & Testing)."

git push
```

### Phase 4 Deliverables Checklist
- [ ] Control library with 26 controls across 5 buckets
- [ ] BucketCard component with progress visualization
- [ ] Dashboard page layout complete
- [ ] Overall progress calculation
- [ ] Per-bucket progress indicators
- [ ] Control status icons (completed, in progress, pending)
- [ ] Standards mapping displayed for each control
- [ ] Estimated duration shown
- [ ] Certification readiness detection
- [ ] NFT minting placeholder button

### Phase 4 Success Criteria
✅ All 5 buckets render correctly
✅ Only activated controls appear in buckets
✅ Progress bars accurately reflect completion
✅ Control cards show correct status
✅ Overall progress matches bucket aggregation
✅ Certification indicator appears at 100%
✅ No TypeScript or console errors
✅ Dashboard responsive on mobile

---

## Phase 5: Polish & Testing (Days 17-18)

### Objectives
- Add product tours for all 3 steps
- Perform comprehensive testing across browsers
- Optimize performance (Lighthouse score >90)
- Ensure accessibility (WCAG 2.1 AA)
- Fix bugs and edge cases
- Polish UI/UX details

### Tasks

#### Day 17: Product Tours & Testing

**Task 5.1: Integrate react-joyride**

Already installed in Phase 0. Create tour provider.

Create `src/components/tour/TourProvider.tsx`:
```typescript
'use client'

import { useState, useEffect, ReactNode } from 'react'
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride'
import { configurati onTourSteps } from '@/lib/tour/configuration-tour-steps'
import { reviewTourSteps } from '@/lib/tour/review-tour-steps'
import { dashboardTourSteps } from '@/lib/tour/dashboard-tour-steps'
import { usePathname } from 'next/navigation'

interface TourProviderProps {
  children: ReactNode
}

export function TourProvider({ children }: TourProviderProps) {
  const pathname = usePathname()
  const [run, setRun] = useState(false)
  const [tourKey, setTourKey] = useState(0)

  const getTourSteps = (): Step[] => {
    switch (pathname) {
      case '/configuration':
        return configurationTourSteps
      case '/review':
        return reviewTourSteps
      case '/dashboard':
        return dashboardTourSteps
      default:
        return []
    }
  }

  const steps = getTourSteps()

  // Auto-start tour when entering a page with tour steps
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`tour-seen-${pathname}`)
    if (steps.length > 0 && !hasSeenTour) {
      setTimeout(() => setRun(true), 1000) // Delay to let page render
    }
  }, [pathname, steps])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false)
      localStorage.setItem(`tour-seen-${pathname}`, 'true')
    }
  }

  if (steps.length === 0) {
    return <>{children}</>
  }

  return (
    <>
      <Joyride
        key={tourKey}
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#10b981', // Emerald-600
            textColor: '#1f2937',
            zIndex: 10000,
          },
        }}
      />
      {children}
    </>
  )
}
```

Create tour steps files (referencing V1 patterns):

Create `src/lib/tour/configuration-tour-steps.tsx`:
```typescript
import { Step } from 'react-joyride'

export const configurationTourSteps: Step[] = [
  {
    target: 'body',
    content: (
      <div>
        <h3 className="font-semibold text-lg mb-2">Welcome to ZeroH V2!</h3>
        <p>Complete your Islamic finance compliance in 3 conversational steps. Let's start with Step 1: Configuration.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="chat-interface"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Conversational Interface</h3>
        <p>Answer 12 questions naturally. Our AI extracts deal configuration from your responses.</p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="progress-tracker"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Track Your Progress</h3>
        <p>See which questions you've answered and how many remain.</p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="deal-summary"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Real-Time Deal Summary</h3>
        <p>Your configuration updates live as you answer questions. See activated control count increase based on deal complexity.</p>
      </div>
    ),
    placement: 'left',
  },
]
```

Create `src/lib/tour/dashboard-tour-steps.tsx`:
```typescript
import { Step } from 'react-joyride'

export const dashboardTourSteps: Step[] = [
  {
    target: '[data-tour="overall-progress"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Overall Compliance Progress</h3>
        <p>Track completion across all activated controls for your deal.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="bucket-breakdown"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2">5-Bucket Taxonomy</h3>
        <p>Shariah-specific control framework aligned with AAOIFI, IFSB, and BNM standards.</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="control-detail"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Control-Level Detail</h3>
        <p>Each control shows status, estimated duration, and applicable standards.</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="certification"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Blockchain Certification</h3>
        <p>At 100% compliance, mint your NFT certificate anchored to Hedera HCS for cryptographic proof.</p>
      </div>
    ),
    placement: 'top',
  },
]
```

**Task 5.2: Add Tour Targets to Components**

Update components to include `data-tour` attributes:

- `src/app/configuration/page.tsx`: Add `data-tour="chat-interface"`, `data-tour="progress-tracker"`, `data-tour="deal-summary"`
- `src/app/review/page.tsx`: Add `data-tour="bpmn-viewer"`, `data-tour="zoom-controls"`, `data-tour="approve-button"`
- `src/app/dashboard/page.tsx`: Add `data-tour="overall-progress"`, `data-tour="bucket-breakdown"`, `data-tour="control-detail"`, `data-tour="certification"`

**Task 5.3: Wrap App with TourProvider**

Update `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RootLayout } from '@/components/layout/RootLayout'
import { TourProvider } from '@/components/tour/TourProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZeroH V2 - AI-Native Islamic Finance GRC',
  description:
    'AI-Native Blockchain-Anchored GRC Platform for Islamic Finance Institutions',
  keywords: [
    'Islamic Finance',
    'GRC',
    'Compliance',
    'Blockchain',
    'Shariah',
    'Sukuk',
    'Murabaha',
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TourProvider>
          <RootLayout>{children}</RootLayout>
        </TourProvider>
      </body>
    </html>
  )
}
```

**Task 5.4: Performance Optimization**

Run Lighthouse audit and optimize:

```bash
npm run build
npm start

# Open Chrome DevTools > Lighthouse
# Run audit for Performance, Accessibility, Best Practices, SEO
```

Common optimizations:
- Lazy load BPMN viewer: `const BpmnViewer = dynamic(() => import('@/features/compliance/components/BpmnViewer'), { ssr: false })`
- Optimize images: Convert to WebP, add width/height
- Add meta tags for SEO
- Minimize bundle size: Check for unused dependencies

**Task 5.5: Accessibility Audit**

Ensure WCAG 2.1 AA compliance:

- Add ARIA labels to interactive elements
- Ensure sufficient color contrast (use Lighthouse report)
- Add keyboard navigation support
- Test with screen reader (NVDA/JAWS)
- Add skip-to-content links
- Ensure focus indicators visible

**Task 5.6: Cross-Browser Testing**

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

Verify:
- Layout renders correctly
- Streaming works
- BPMN viewer renders
- Progress bars animate
- Tours trigger correctly

#### Day 18: Bug Fixes & Final Polish

**Task 5.7: Fix Identified Bugs**

Common issues:
- BPMN viewer not rendering on first load → Add loading state
- Conversation state not clearing on reset → Fix Zustand reset action
- Tour triggers before elements render → Add delay
- Mobile layout breaks on small screens → Add responsive breakpoints

**Task 5.8: UI/UX Polish**

- Add loading skeletons for async operations
- Smooth transitions between pages
- Error boundaries for graceful error handling
- Toast notifications for user actions
- Confirm dialogs for destructive actions

**Task 5.9: Create Error Boundary**

Create `src/components/error/ErrorBoundary.tsx`:
```typescript
'use client'

import { Component, ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              {this.state.error && (
                <pre className="rounded bg-gray-100 p-4 text-sm overflow-auto">
                  {this.state.error.message}
                </pre>
              )}
              <Button onClick={this.handleReset}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
```

Wrap app with ErrorBoundary in layout.

**Task 5.10: Final Commit**
```bash
git add .
git commit -m "feat: complete Phase 5 polish and testing

- Integrate react-joyride product tours for all 3 steps
- Add data-tour attributes to key UI elements
- Create TourProvider with auto-start logic
- Optimize performance (lazy load BPMN, minimize bundle)
- Ensure WCAG 2.1 AA accessibility compliance
- Add ErrorBoundary for graceful error handling
- Cross-browser testing completed
- Mobile responsive verified
- Bug fixes and UI polish

Application ready for deployment!"

git push
```

### Phase 5 Deliverables Checklist
- [ ] Product tours implemented for configuration, review, dashboard
- [ ] TourProvider integrated with auto-start
- [ ] data-tour attributes added to all tour targets
- [ ] Lighthouse performance score >90
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Cross-browser testing completed
- [ ] Mobile responsive verified
- [ ] Error boundary implemented
- [ ] Loading states added
- [ ] All critical bugs fixed

### Phase 5 Success Criteria
✅ Tours auto-start on first visit to each page
✅ Tours can be skipped and don't re-trigger
✅ Lighthouse performance score >90
✅ No accessibility violations
✅ Works on Chrome, Firefox, Safari, Edge
✅ Mobile layout works on iOS and Android
✅ Error boundary catches and displays errors gracefully
✅ No console errors or warnings

---

## Phase 6: Netlify Deployment

### Objectives
- Configure `netlify.toml` for static export
- Deploy to Netlify via CLI
- Verify production build
- Setup custom domain (optional)
- Configure environment variables

### Tasks

#### Deployment Preparation

**Task 6.1: Create netlify.toml**

Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
```

**Task 6.2: Update package.json**

Ensure export script exists:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build && next export",
    "lint": "next lint"
  }
}
```

**Task 6.3: Test Local Build**

```bash
# Clean previous builds
npm run clean

# Build for production
npm run build

# Verify output directory
ls -la out/

# Test production build locally (optional: use serve)
npx serve out
```

Expected:
- `out/` directory created
- Static HTML files generated
- No build errors
- All routes accessible

#### Netlify Deployment

**Task 6.4: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

**Task 6.5: Login to Netlify**

```bash
netlify login
```

Browser will open for authentication.

**Task 6.6: Initialize Netlify Site**

```bash
netlify init
```

Follow prompts:
1. "Create & configure a new site"
2. Choose team
3. Site name: `zeroh-v2-demo` (or your choice)
4. Build command: `npm run build`
5. Publish directory: `out`

This creates `.netlify/state.json`.

**Task 6.7: Deploy to Preview**

```bash
netlify deploy
```

Expected output:
```
✔ Deploying to draft URL...
✔ Draft deploy is ready!

Draft URL: https://draft-xxx--zeroh-v2-demo.netlify.app
```

**Task 6.8: Verify Preview Deployment**

1. Open draft URL in browser
2. Test all 3 workflow steps
3. Verify tours work
4. Check responsive design
5. Test BPMN viewer
6. Verify no console errors

**Task 6.9: Deploy to Production**

If preview looks good:

```bash
netlify deploy --prod
```

Expected output:
```
✔ Deploying to live site URL...
✔ Deploy is ready!

Production URL: https://zeroh-v2-demo.netlify.app
```

**Task 6.10: Configure Custom Domain (Optional)**

If you have a custom domain:

```bash
netlify domains:add yourdomain.com
```

Follow DNS configuration instructions.

**Task 6.11: Setup Environment Variables**

If needed for future backend integration:

```bash
netlify env:set NEXT_PUBLIC_API_URL https://api.yourdomain.com
```

Or via Netlify UI:
1. Go to Site Settings > Environment Variables
2. Add variables
3. Redeploy

#### Post-Deployment Verification

**Task 6.12: Production Testing Checklist**

Test on production URL:

- [ ] Home page loads correctly
- [ ] Navigation between pages works
- [ ] Configuration flow completes
- [ ] Conversation streaming works
- [ ] Progress tracker updates
- [ ] Deal summary displays
- [ ] Review page shows BPMN viewer
- [ ] Dashboard displays 5 buckets
- [ ] Tours trigger on first visit
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Lighthouse score >90 in production

**Task 6.13: Share Demo URL**

Production URL format:
```
https://zeroh-v2-demo.netlify.app
```

Share with stakeholders for feedback.

**Task 6.14: Final Documentation**

Update README.md with:
- Live demo URL
- Deployment instructions
- Environment variables needed
- Known limitations
- Future roadmap

**Task 6.15: Final Commit**

```bash
git add .
git commit -m "chore: add Netlify deployment configuration

- Create netlify.toml with build settings
- Configure headers for security
- Add deployment documentation
- Update README with live demo URL

Production deployment complete! 🚀"

git push
```

### Phase 6 Deliverables Checklist
- [ ] netlify.toml created and configured
- [ ] Local production build verified
- [ ] Netlify CLI installed and authenticated
- [ ] Site initialized on Netlify
- [ ] Preview deployment tested
- [ ] Production deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables set (if needed)
- [ ] Production testing completed
- [ ] Demo URL shared with stakeholders
- [ ] README updated with deployment info

### Phase 6 Success Criteria
✅ Production URL accessible publicly
✅ All features work in production
✅ No console errors in production
✅ Lighthouse score >90 in production
✅ Mobile responsive in production
✅ Deployment process documented
✅ README updated with live demo URL

---

## Risk Mitigation

### Technical Risks

**Risk 1: BPMN Viewer Fails to Render**
- **Likelihood**: Medium
- **Impact**: High
- **Mitigation**:
  - Test bpmn-js integration early (Phase 3 Day 9)
  - Add error boundaries around BPMN component
  - Provide fallback static image if viewer fails
  - Lazy load BPMN viewer to avoid blocking page render
- **Contingency**: If bpmn-js doesn't work, use static SVG image generated offline

**Risk 2: State Management Issues Across Page Refreshes**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**:
  - Implement localStorage persistence early (Phase 2 Day 8)
  - Add state hydration error handling
  - Provide "Reset Configuration" button for recovery
- **Contingency**: Session-based state (doesn't persist across refreshes) is acceptable for demo

**Risk 3: Performance Issues with Large Conversation History**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**:
  - Limit conversation history to last 50 messages
  - Use virtualized list for message rendering
  - Clear old messages after configuration complete
- **Contingency**: Limit conversation to 12 Q&A pairs max (acceptable for demo)

**Risk 4: TypeScript Compilation Errors**
- **Likelihood**: Medium
- **Impact**: High
- **Mitigation**:
  - Use TypeScript strict mode from start
  - Run `npm run type-check` frequently
  - Address type errors immediately, don't accumulate
- **Contingency**: Temporarily disable strict mode for problematic sections (not recommended)

**Risk 5: Netlify Build Failures**
- **Likelihood**: Low
- **Impact**: High
- **Mitigation**:
  - Test local build frequently (`npm run build`)
  - Ensure `next.config.mjs` has `output: 'export'`
  - Test static export early (Phase 5)
- **Contingency**: Deploy to Vercel instead (supports Next.js App Router natively)

### Schedule Risks

**Risk 6: Feature Scope Creep**
- **Likelihood**: High
- **Impact**: Medium
- **Mitigation**:
  - Stick to MVP features only
  - Use "Coming Soon" placeholders for nice-to-haves
  - Time-box each phase strictly
- **Contingency**: Skip Phase 3 test simulator animations (use static mockups instead)

**Risk 7: Dependency Installation Issues**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**:
  - Lock dependency versions in package.json
  - Use `npm ci` instead of `npm install` for reproducibility
  - Document any manual fixes needed
- **Contingency**: Use alternative libraries (e.g., use `react-bpmn` instead of `bpmn-js` if needed)

**Risk 8: Cross-Browser Compatibility Issues**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**:
  - Test on Chrome, Firefox, Safari early
  - Use CSS that's broadly supported
  - Avoid cutting-edge browser APIs
- **Contingency**: Add browser warning banner for unsupported browsers

### Business Risks

**Risk 9: Demo Doesn't Convey Value Proposition**
- **Likelihood**: Low
- **Impact**: High
- **Mitigation**:
  - Product tours explain value at each step
  - Home page clearly articulates differentiation
  - Use mock data that tells compelling story
- **Contingency**: Record video walkthrough to supplement live demo

**Risk 10: Backend Integration Expectations Not Met**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**:
  - AG-UI_PROTOCOL_AND_PLUGGABILITY_GUIDE.md ensures backend compatibility
  - Mock service follows exact AG-UI protocol
  - Service layer pattern enables < 1 day backend swap
- **Contingency**: Demonstrate service layer architecture in documentation

---

## Quality Gates

### Phase 0 Quality Gate
**Criteria**:
- ✅ Dev server starts without errors
- ✅ TypeScript compiles with strict mode
- ✅ ESLint passes with no errors
- ✅ Hot reload works

**Gate Keeper**: Project Lead
**Decision**: Proceed to Phase 1 or fix issues first

### Phase 1 Quality Gate
**Criteria**:
- ✅ Mock conversation service follows AG-UI protocol exactly
- ✅ Streaming works with realistic delays
- ✅ Zustand store persists and retrieves messages
- ✅ useConversation hook handles all edge cases
- ✅ Navigation between pages functional

**Gate Keeper**: Technical Architect
**Decision**: Proceed to Phase 2 or refactor service layer

### Phase 2 Quality Gate
**Criteria**:
- ✅ User can complete 12-question flow end-to-end
- ✅ Deal summary updates correctly as user answers
- ✅ Control activation logic returns 12-26 controls
- ✅ Progress tracker advances correctly
- ✅ State persists across page refreshes
- ✅ No console errors or TypeScript errors

**Gate Keeper**: UX Designer + Frontend Lead
**Decision**: Proceed to Phase 3 or improve conversation UX

### Phase 3 Quality Gate
**Criteria**:
- ✅ BPMN viewer renders Guardian policy correctly
- ✅ Zoom/pan/download controls work
- ✅ Approval flow enables dashboard navigation
- ✅ No errors when loading review page

**Gate Keeper**: Technical Lead
**Decision**: Proceed to Phase 4 or fix BPMN integration

### Phase 4 Quality Gate
**Criteria**:
- ✅ All 5 buckets render with correct controls
- ✅ Progress bars calculate correctly
- ✅ Control status icons match completion state
- ✅ Responsive layout works on mobile
- ✅ No TypeScript errors

**Gate Keeper**: Product Manager + Frontend Lead
**Decision**: Proceed to Phase 5 or improve dashboard UX

### Phase 5 Quality Gate
**Criteria**:
- ✅ Lighthouse performance score >90
- ✅ Accessibility audit passed (no violations)
- ✅ Tours work on all 3 pages
- ✅ Cross-browser testing passed
- ✅ Mobile testing passed
- ✅ No critical bugs

**Gate Keeper**: QA Lead + Project Manager
**Decision**: Proceed to Phase 6 or fix critical issues

### Phase 6 Quality Gate (Final)
**Criteria**:
- ✅ Production deployment successful
- ✅ Demo URL publicly accessible
- ✅ All features work in production
- ✅ No console errors in production
- ✅ Lighthouse score >90 in production
- ✅ Stakeholder approval received

**Gate Keeper**: CEO/Product Owner
**Decision**: Launch publicly or iterate

---

## Success Metrics

### Technical Success Metrics

**Build & Deployment**:
- ✅ Clean build with zero TypeScript errors
- ✅ Clean build with zero ESLint errors
- ✅ Build time <2 minutes
- ✅ Production bundle size <500 KB (gzipped)
- ✅ Deployment time <5 minutes

**Performance**:
- ✅ Lighthouse Performance Score: >90
- ✅ First Contentful Paint: <1.5s
- ✅ Time to Interactive: <3s
- ✅ Cumulative Layout Shift: <0.1

**Accessibility**:
- ✅ Lighthouse Accessibility Score: 100
- ✅ Zero WCAG 2.1 AA violations
- ✅ Keyboard navigation fully functional
- ✅ Screen reader compatible

**Browser Compatibility**:
- ✅ Works on Chrome 100+
- ✅ Works on Firefox 100+
- ✅ Works on Safari 15+
- ✅ Works on Edge 100+
- ✅ Works on Mobile Safari (iOS 15+)
- ✅ Works on Chrome Mobile (Android 10+)

### User Experience Success Metrics

**Workflow Completion**:
- ✅ Users can complete configuration in <20 minutes
- ✅ 12-question flow feels natural (not robotic)
- ✅ Progress tracker provides clear orientation
- ✅ Deal summary updates feel real-time

**Visual Quality**:
- ✅ BPMN policy looks professional and readable
- ✅ 5-bucket dashboard clearly organized
- ✅ Control cards provide useful detail
- ✅ Responsive design works beautifully on mobile

**Guided Experience**:
- ✅ Product tours explain features clearly
- ✅ Tours don't interfere with usage
- ✅ First-time users understand value proposition
- ✅ Error states provide helpful guidance

### Business Success Metrics

**Demo Effectiveness**:
- ✅ Clearly demonstrates AI-native approach
- ✅ Showcases conversational UI advantage
- ✅ Highlights blockchain-anchored proof
- ✅ Differentiates from Vanta/Delve competitors
- ✅ Shariah-specific value proposition clear

**Stakeholder Feedback**:
- ✅ 3+ design partners express interest
- ✅ Positive feedback from Islamic finance experts
- ✅ Clear path to regulatory sandbox application
- ✅ Investor pitch deck ready with demo URL

**Technical Validation**:
- ✅ Backend pluggability demonstrated
- ✅ AG-UI protocol compliance validated
- ✅ Mock-to-real migration path documented
- ✅ < 1 day backend swap estimated confirmed

---

## Next Steps After Demo Launch

### Immediate (Week 4)
1. **Gather Feedback**:
   - Share demo URL with 10+ stakeholders
   - Collect structured feedback via Google Form
   - Schedule 1:1 demo sessions with design partners

2. **Iterate Based on Feedback**:
   - Fix any critical bugs reported
   - Improve unclear UX flows
   - Add missing explanations

3. **Content Updates**:
   - Record video walkthrough (5 min)
   - Write blog post announcing V2
   - Update investor pitch deck with demo URL

### Short-term (Month 2)
1. **Backend Integration**:
   - Build RealConversationService
   - Connect to production AI backend
   - Test backend swap (target: <1 day)

2. **Enhanced Features**:
   - Add editable BPMN modeler (V1 migration)
   - Implement workflow test simulator
   - Add live execution animations

3. **Hedera Integration**:
   - Integrate Hedera HCS for policy anchoring
   - Implement VC minting
   - Add NFT certificate generation

### Medium-term (Month 3-6)
1. **Pilot Program**:
   - Onboard 3 design partner institutions
   - Collect real deal configurations
   - Validate control activation logic

2. **Regulatory Engagement**:
   - Submit to BNM regulatory sandbox
   - Engage with AAOIFI standards body
   - Present to IFSB working group

3. **Scale Infrastructure**:
   - Production backend deployment
   - Real Shariah advisor integration
   - Evidence repository implementation

---

## Appendix: Reference Documents

All planning materials referenced in this implementation plan:

1. **ARCHITECTURE_SESSION_FINDINGS.md**: 4-UI architecture, 12-question MVQ, control activation matrix
2. **ZEROH_V2_PROJECT_BLUEPRINT.md**: Next.js structure, service layer pattern, feature-based organization
3. **AG_UI_PROTOCOL_AND_PLUGGABILITY_GUIDE.md**: **CRITICAL** - AG-UI protocol, service interfaces, backend pluggability
4. **MICROSERVICE_ARCHITECTURE_BLUEPRINT.md**: 8 microservice specs, API contracts, tokenization pipeline
5. **AG_UI_CONVERSATIONAL_IMPLEMENTATION.md**: Conversational UI implementation, mock service examples
6. **V1_COMPONENT_REUSABILITY_GUIDE.md**: BPMN viewer, animations, tour system migration
7. **AI_NATIVE_GRC_POSITIONING.md**: Market positioning, competitive strategy, 5-bucket framework
8. **GITHUB_REPOSITORY_SETUP.md**: Repository creation, CI/CD setup, team collaboration
9. **NETLIFY_DEPLOYMENT_GUIDE.md**: Netlify configuration, deployment steps, troubleshooting

---

## Conclusion

This implementation plan provides a comprehensive, day-by-day roadmap for building the ZeroH V2 demo. Key principles:

**Incremental Delivery**: Each phase delivers a working increment that can be tested and validated.

**Quality Gates**: Checkpoints ensure quality before proceeding to next phase.

**Risk Mitigation**: Proactive identification and mitigation of technical, schedule, and business risks.

**Backend Pluggability**: Service layer pattern ensures < 1 day backend swap when ready.

**AG-UI Protocol Compliance**: Mock service follows exact AG-UI protocol for seamless real backend integration.

**Production-Ready Patterns**: Feature-based organization, TypeScript strict mode, contract-first API design.

**Shariah-Specific Value**: 5-bucket taxonomy, AAOIFI/IFSB/BNM alignment, Islamic finance domain expertise.

**Total Estimated Timeline**: 18 days + 0.5 day deployment = **~4 weeks** (3-4 weeks)

**Expected Outcome**: Fully functional V2 demo deployed to Netlify, showcasing AI-native conversational GRC for Islamic finance with blockchain-anchored proof.

**Let's build the future of Islamic finance compliance! 🚀**

---

**END OF IMPLEMENTATION PLAN**

*This plan represents ~50,000 words of comprehensive technical guidance for ZeroH V2 demo development. Reference this document throughout implementation and update as needed based on learnings.*