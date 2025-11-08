# AI-Native GRC Demo - Implementation Plan

**Project**: Standalone Frontend-Only AI-Native GRC for Islamic Finance
**Purpose**: Replace/refine current Vanta-style collaboration/dashboard with AI-native UX
**Protocol**: AG-UI (Agent-User Interaction Protocol)
**Architecture**: Frontend-only with mocked AI agent behaviors
**Last Updated**: 2025-11-07

---

## Executive Summary

Create a standalone frontend demo that showcases **AI-native GRC for Islamic Finance** using AG-UI protocol patterns. This demo will replace the current Vanta-style dashboard/collaboration features with an agent-first, instruction-to-action interface.

### Key Differentiators vs. Current Implementation

| Current Vanta-Style | New AI-Native |
|---------------------|---------------|
| **Tab-based navigation** | **Task-based inbox** ("My Tasks" priority queue) |
| **Manual form filling** | **AI auto-completes, human approves** |
| **Static dashboards** | **Agent-generated insights** |
| **Compliance reports** | **Blockchain-anchored proofs (VCs)** |
| **Request→Review→Approve** | **Instruction→Agent Execute→Review** |
| **5 role-specific views** | **Unified task queue** (context-aware) |

---

## AG-UI Protocol Integration

### What is AG-UI?

**AG-UI (Agent-User Interaction Protocol)** is an open standard for frontend↔agent communication created by CopilotKit. It standardizes:

1. **Real-time event streaming** - Messages, typing indicators, status updates
2. **Frontend tools** - Actions agents can invoke in the UI
3. **Shared state** - Context synchronized between agent and UI
4. **Custom events** - Domain-specific notifications

### How We'll Use AG-UI

#### 1. Event Streaming Pattern
```typescript
// Agent sends events to UI
interface AGUIEvent {
  type: 'message' | 'status' | 'typing' | 'tool_call' | 'state_update'
  agentId: string
  timestamp: string
  payload: unknown
}

// Examples:
{ type: 'typing', agentId: 'compliance-copilot', timestamp: '...' }
{ type: 'message', agentId: 'evidence-agent', payload: { text: 'Found 12 documents...' }}
{ type: 'tool_call', agentId: 'drift-agent', payload: { tool: 'send_alert', params: {...} }}
```

#### 2. Agent Capabilities (Frontend Tools)
Agents can invoke these UI actions:
- `showNotification(message, severity)` - Display toast/alert
- `updateDashboard(metricId, value)` - Update metric card
- `createTask(title, description, assignee)` - Add task to queue
- `generateProof(dealId, evidenceIds)` - Mint VC and show in UI
- `highlightBlocker(taskId, reason)` - Highlight urgent item
- `suggestAction(taskId, action)` - Show "Do It For Me" button

#### 3. Shared State Management
```typescript
interface AGUIState {
  // User context
  user: { role: string, permissions: string[] }

  // Current deal context
  activeDeal?: { dealId: string, status: string, compliance: number }

  // Agent working memory
  agentContext: {
    lastQuery?: string
    activeTasks: string[]
    suggestions: Action[]
  }

  // UI state
  ui: {
    activeScreen: 'home' | 'tasks' | 'evidence' | 'proofs' | 'workflows' | 'trust-portal'
    selectedTaskId?: string
    filters: Record<string, any>
  }
}
```

#### 4. Custom Events
Domain-specific events for Islamic finance GRC:
- `shariah:review_complete` - Shariah advisor approved
- `compliance:drift_detected` - Policy violation found
- `blockchain:proof_minted` - VC created on Hedera
- `evidence:auto_collected` - Agent gathered new evidence
- `task:auto_assigned` - Agent routed task to best person

---

## 6-Screen Information Architecture

### Screen 1: Home (Readiness Dashboard)

**Purpose**: Single glance at compliance readiness
**AG-UI Pattern**: Agent-generated insights dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Islamic Finance GRC - Home                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Good morning, Sarah! 👋                                │
│  💡 AI: "You have 3 tasks ready for approval"          │
│                                                         │
│  ━━━ Compliance Readiness ━━━                          │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ ✅ Agent    │  │ ⚠️ Blockers │  │ 📝 Changes  │   │
│  │  Finished   │  │             │  │  Detected   │   │
│  │             │  │             │  │             │   │
│  │     8       │  │      2      │  │      5      │   │
│  │   tasks     │  │  critical   │  │  policies   │   │
│  │             │  │             │  │             │   │
│  │ [Review] →  │  │ [Fix Now] → │  │ [Review] →  │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│  ━━━ Predictive Timeline ━━━                           │
│                                                         │
│  🤖 "At current pace, you'll be 100% compliant by      │
│      Nov 15 (3 days). Bottleneck: Shariah review."     │
│                                                         │
│  [Nov 7]──✅──[Nov 10]──⏳──[Nov 15]──🎯              │
│   Now    Docs     Shariah    100%                      │
│                                                         │
│  ━━━ AI Copilot ━━━                                    │
│                                                         │
│  💬 "What's blocking Deal-123?"                        │
│  🤖 "2 documents need Shariah signatures. I've         │
│      auto-assigned to Dr. Ahmed."                      │
│  [Ask Another Question...]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**AG-UI Events**:
- Agent streams status updates: `{ type: 'status', payload: { completed: 8, blockers: 2 }}`
- Timeline calculated by agent: `{ type: 'insight', payload: { prediction: '...' }}`
- Copilot chat uses message streaming: `{ type: 'message', payload: { text: '...' }}`

---

### Screen 2: My Tasks (Priority Queue)

**Purpose**: Unified task inbox across all deals
**AG-UI Pattern**: Agent-assigned, context-aware task cards

```
┌─────────────────────────────────────────────────────────┐
│  My Tasks                                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Filters: [All] [Needs Approval] [Auto-Completed]      │
│  Sort by: [Priority ▼] [Due Date] [Deal]               │
│                                                         │
│  ━━━ Tasks (12) ━━━                                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🔴 CRITICAL - Shariah Review Needed               │ │
│  │ Deal-123: Sukuk Issuance                          │ │
│  │                                                    │ │
│  │ 🤖 Summary: "Asset ownership transfer requires    │ │
│  │    Shariah board approval per AAOIFI FAS 33"      │ │
│  │                                                    │ │
│  │ 📎 Evidence: 3 documents auto-collected           │ │
│  │    ✓ Asset purchase agreement (verified)          │ │
│  │    ✓ Valuation report (verified)                  │ │
│  │    ⚠️ Shariah certificate (pending signature)     │ │
│  │                                                    │ │
│  │ 📋 Rule: AAOIFI FAS 28 §4.2                       │ │
│  │    "Institution must own asset before selling"    │ │
│  │    [View Full Standard]                           │ │
│  │                                                    │ │
│  │ 💡 Proposed Fix:                                  │ │
│  │    "Send certificate to Dr. Ahmed for signature"  │ │
│  │    📧 Draft email prepared                        │ │
│  │    [Preview Email]                                │ │
│  │                                                    │ │
│  │ Actions:                                          │ │
│  │ [✓ Approve & Make Proof]  [Do It For Me]  [Ask Why] │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🟡 MEDIUM - Evidence Collection Complete          │ │
│  │ Deal-456: Murabaha Agreement                      │ │
│  │                                                    │ │
│  │ 🤖 "I've gathered all required documents.         │ │
│  │    Ready to mint Guardian Certificate."           │ │
│  │                                                    │ │
│  │ [Review Evidence →]  [Make Proof]                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**AG-UI Features**:
- **"Do It For Me"** button → Agent executes, sends `tool_call` event
- **"Ask Why"** → Agent explains reasoning via message stream
- **"Make Proof"** → Agent calls `generateProof()` frontend tool
- Task cards dynamically rendered from agent state

**Task Card Data Model**:
```typescript
interface AITaskCard {
  id: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  summary: string  // AI-generated plain English
  dealId: string
  dealName: string

  // Agent-collected evidence
  evidence: Array<{
    type: 'document' | 'api_response' | 'blockchain_tx'
    name: string
    status: 'verified' | 'pending' | 'missing'
    source: 'SharePoint' | 'S3' | 'API' | 'Agent'
  }>

  // Compliance rule reference
  rule: {
    standard: string  // e.g., "AAOIFI FAS 28 §4.2"
    text: string
    citation_url?: string
  }

  // Agent's proposed action
  proposedFix: {
    description: string
    actions: Array<{
      type: 'send_email' | 'create_doc' | 'update_field'
      params: Record<string, any>
      preview?: string  // For emails, show draft
    }>
  }

  // Actions user can take
  availableActions: ['approve' | 'do_it_for_me' | 'ask_why' | 'reject']
}
```

---

### Screen 3: Evidence (Proof Repository)

**Purpose**: All evidence collected by agents
**AG-UI Pattern**: Agent tracks sources and freshness

```
┌─────────────────────────────────────────────────────────┐
│  Evidence Repository                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Search: [Find evidence...]                             │
│  Filters: [All Sources] [Last 30 Days] [Verified Only] │
│                                                         │
│  ━━━ Evidence Stats ━━━                                │
│                                                         │
│  Total: 247 items  |  Auto-collected: 198  |  VCs: 45  │
│                                                         │
│  ━━━ Sources ━━━                                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📁 SharePoint                              134x │   │
│  │ ☁️  AWS S3                                  67x │   │
│  │ 🔗 API (Guardian)                          31x │   │
│  │ 🤖 AI Agent Collected                      15x │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ━━━ Evidence List ━━━                                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 📄 Asset Purchase Agreement                       │ │
│  │ Deal: Sukuk Issuance (Deal-123)                   │ │
│  │ Source: SharePoint → Finance/Deals/2024/          │ │
│  │ Collected: 2024-11-04 10:23 UTC (Agent)           │ │
│  │ Last Verified: 2 hours ago ✅                     │ │
│  │                                                    │ │
│  │ 🔒 Selective Disclosure:                          │ │
│  │    [Show All Fields ●] [Minimal View ○]           │ │
│  │                                                    │ │
│  │ 🛡️ Verifiable Credential: VC-2024-001234         │ │
│  │    Minted: Nov 4, 2024 | Hedera TX ↗              │ │
│  │                                                    │ │
│  │ [View] [Download] [Share with Auditor]            │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**AG-UI Events**:
- Agent collects evidence: `{ type: 'evidence:collected', payload: { url, source }}`
- Freshness check: `{ type: 'evidence:stale', payload: { evidenceId }}`
- VC minted: `{ type: 'blockchain:proof_minted', payload: { vcId, txHash }}`

---

### Screen 4: Workflows (Human-in-the-Loop)

**Purpose**: Review agent-prepped workflow steps
**AG-UI Pattern**: Agent executes, human approves checkpoints

```
┌─────────────────────────────────────────────────────────┐
│  Workflows                                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Active: Sukuk Issuance Workflow (Deal-123)             │
│  Progress: 8/11 steps (73%) | Est. completion: Nov 15   │
│                                                         │
│  ━━━ Workflow Steps ━━━                                │
│                                                         │
│  ✅ 1. Initial Configuration                           │
│     Agent: Auto-filled from previous Sukuk deals        │
│     Status: Approved by Sarah (Nov 1, 10:00)            │
│     [View Details]                                      │
│                                                         │
│  ✅ 2. Document Collection                             │
│     Agent: Collected 12 documents from SharePoint       │
│     Status: Auto-completed (Nov 2, 14:30)               │
│     [View Evidence]                                     │
│                                                         │
│  ✅ 3. AAOIFI Validation                               │
│     Agent: Checked FAS 33, all requirements met         │
│     Status: Auto-completed (Nov 3, 09:15)               │
│     [View Validation Report]                            │
│                                                         │
│  ⏳ 4. Shariah Board Review (IN PROGRESS)              │
│     Agent: Prepared review package, sent to Dr. Ahmed   │
│     Status: Awaiting human approval                     │
│     Due: Nov 8, 17:00                                   │
│                                                         │
│     🤖 "Dr. Ahmed typically responds in 4-6 hours.      │
│         I'll notify you when he approves."              │
│                                                         │
│     Mode: [● Auto-Apply] [○ Review Manually]            │
│                                                         │
│  ⏸️ 5. Asset Valuation (PENDING)                       │
│     Agent: Waiting for Step 4 approval                  │
│     [Preview Agent Plan]                                │
│                                                         │
│  ...                                                    │
│                                                         │
│  ━━━ Workflow Controls ━━━                             │
│                                                         │
│  [⏸️ Pause]  [⏭️ Skip Step]  [🔄 Restart]  [📋 Export Log] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**AG-UI Features**:
- **Auto-Apply vs Review Manually** toggle per step
- Agent streams step execution: `{ type: 'workflow:step_started', payload: { stepId }}`
- Human approval checkpoint: `{ type: 'workflow:approval_needed', payload: { stepId, reason }}`

---

### Screen 5: Proofs (Verifiable Credentials)

**Purpose**: Blockchain-anchored compliance certificates
**AG-UI Pattern**: Agent generates, user shares selectively

```
┌─────────────────────────────────────────────────────────┐
│  Compliance Proofs (Verifiable Credentials)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Total Proofs: 45  |  On Hedera: 45  |  Shared: 12      │
│                                                         │
│  ━━━ Recent Proofs ━━━                                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🛡️ Guardian Certificate #001234                  │ │
│  │ Deal: Sukuk Issuance (Deal-123)                   │ │
│  │ Issued: Nov 4, 2024 10:23 UTC                     │ │
│  │                                                    │ │
│  │ ━━ W3C Verifiable Credential ━━                  │ │
│  │ {                                                 │ │
│  │   "@context": "https://www.w3.org/2018/credentials/v1", │
│  │   "type": ["VerifiableCredential", "GuardianCertificate"], │
│  │   "issuer": "did:hedera:mainnet:...",             │ │
│  │   "issuanceDate": "2024-11-04T10:23:15Z",        │ │
│  │   "credentialSubject": {                          │ │
│  │     "dealId": "Deal-123",                        │ │
│  │     "compliance": {                               │ │
│  │       "shariah": { "status": "compliant", ... },  │ │
│  │       "jurisdiction": { "status": "compliant" }   │ │
│  │     }                                              │ │
│  │   }                                                │ │
│  │ }                                                 │ │
│  │                                                    │ │
│  │ ━━ Blockchain Proof ━━                           │ │
│  │ Hedera TX: 0.0.123456@1699564800.123              │ │
│  │ [Verify on HashScan ↗]                           │ │
│  │                                                    │ │
│  │ ━━ Selective Disclosure ━━                       │ │
│  │ Share with:                                       │ │
│  │ 👁️ Auditor    → [Show All Fields]                │ │
│  │ 👁️ Customer   → [Show Badge Only]                │ │
│  │ 👁️ Regulator  → [Show Compliance Status]         │ │
│  │                                                    │ │
│  │ [Share] [Download] [Revoke]                       │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**AG-UI Events**:
- VC minted: `{ type: 'blockchain:proof_minted', payload: { vcId, txHash }}`
- Shared: `{ type: 'proof:shared', payload: { vcId, recipientType }}`

---

### Screen 6: Trust Portal (Customer-Facing)

**Purpose**: Self-serve compliance verification for customers
**AG-UI Pattern**: AI chatbot constrained to blockchain proofs

```
┌─────────────────────────────────────────────────────────┐
│  🏦 ABC Islamic Bank - Trust Portal                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ━━━ Compliance Overview ━━━                           │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ ✅ Shariah  │  │ ✅ Legal    │  │ ✅ Audit    │   │
│  │  Compliant  │  │  Compliant  │  │  Passed     │   │
│  │             │  │             │  │             │   │
│  │    100%     │  │    100%     │  │   98/100    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│  Last Verified: Nov 4, 2024 | Verified by Hedera Blockchain │
│  [View Blockchain Proof ↗]                             │
│                                                         │
│  ━━━ Live Controls ━━━                                 │
│                                                         │
│  ✅ Asset Ownership Verification (AAOIFI FAS 28)       │
│  ✅ Profit Distribution Mechanism (AAOIFI FAS 33)      │
│  ✅ Shariah Board Oversight (AAOIFI Governance)        │
│  ✅ Quarterly Audit Completion                         │
│                                                         │
│  ━━━ Documents ━━━                                     │
│                                                         │
│  📄 Shariah Compliance Certificate (Nov 2024)          │
│  📄 Auditor Report Q3 2024                             │
│  📄 Asset Ownership Documentation                      │
│                                                         │
│  ━━━ AI Q&A (Proof-Constrained) ━━━                   │
│                                                         │
│  💬 Ask about our compliance:                          │
│  [                                                   ]  │
│                                                         │
│  Example:                                              │
│  User: "Is this Sukuk Shariah-compliant?"              │
│  🤖: "Yes. Our Shariah board certified this Sukuk      │
│       on Nov 2, 2024. Certificate verified on          │
│       Hedera blockchain. [View Proof ↗]"               │
│                                                         │
│  User: "Who is the Shariah advisor?"                   │
│  🤖: "Dr. Ahmed Al-Mansouri, AAOIFI-certified.         │
│       Board approval recorded on blockchain.           │
│       [View Certificate ↗]"                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**AG-UI Features**:
- Chatbot only answers from blockchain-verified proofs
- Agent refuses questions outside scope: "I can only answer based on verified compliance data"
- Every answer links to blockchain proof

---

## Mock Data Strategy

### 1. Agent Behavior Simulation

Since this is frontend-only, we'll mock AI agent actions using:

#### Local State Machine
```typescript
// src/lib/mock-agents.ts
type AgentAction =
  | { type: 'collect_evidence', dealId: string }
  | { type: 'validate_aaoifi', standard: string }
  | { type: 'send_for_approval', approver: string }
  | { type: 'mint_vc', evidenceIds: string[] }
  | { type: 'detect_drift', policyId: string }

class MockAgent {
  async executeAction(action: AgentAction): Promise<AGUIEvent[]> {
    // Simulate agent work with delays
    await sleep(randomDelay(500, 2000))

    // Return series of events
    return [
      { type: 'status', payload: { message: 'Starting...' }},
      { type: 'typing', agentId: this.id },
      { type: 'message', payload: { text: 'Found 3 documents...' }},
      { type: 'tool_call', payload: { tool: 'update_dashboard', params: {...} }},
      { type: 'status', payload: { message: 'Complete', status: 'success' }}
    ]
  }
}
```

#### Streaming Event Generator
```typescript
// Simulate real-time agent streaming
async function* streamAgentExecution(action: AgentAction) {
  yield { type: 'typing', agentId: 'compliance-agent' }
  await sleep(500)

  yield { type: 'message', payload: { text: 'Checking AAOIFI FAS 28...' }}
  await sleep(1000)

  yield { type: 'message', payload: { text: '✅ Asset ownership verified' }}
  await sleep(500)

  yield { type: 'tool_call', payload: { tool: 'createTask', params: {...} }}
}
```

### 2. Mock Data Fixtures

```typescript
// src/lib/mock-data.ts

export const MOCK_DEALS = [
  {
    dealId: 'Deal-123',
    dealName: 'Sukuk Issuance - $250M',
    status: 'in_progress',
    compliance: { shariah: 100, jurisdiction: 100, accounting: 98, impact: 95 },
    created: '2024-11-01T10:00:00Z'
  },
  // ... more deals
]

export const MOCK_TASKS: AITaskCard[] = [
  {
    id: 'task-001',
    priority: 'critical',
    summary: 'Shariah Review Needed for Asset Transfer',
    dealId: 'Deal-123',
    dealName: 'Sukuk Issuance - $250M',
    evidence: [
      { type: 'document', name: 'Asset Purchase Agreement', status: 'verified', source: 'SharePoint' },
      { type: 'document', name: 'Valuation Report', status: 'verified', source: 'S3' },
      { type: 'document', name: 'Shariah Certificate', status: 'pending', source: 'Agent' }
    ],
    rule: {
      standard: 'AAOIFI FAS 28 §4.2',
      text: 'The Islamic financial institution must own the asset before selling it to the customer.',
      citation_url: 'https://aaoifi.com/standard/fas-28/'
    },
    proposedFix: {
      description: 'Send certificate to Dr. Ahmed Al-Mansouri for signature',
      actions: [
        {
          type: 'send_email',
          params: {
            to: 'ahmed@example.com',
            subject: 'Shariah Certificate Review Required',
            body: 'Please review and sign...'
          },
          preview: 'Dear Dr. Ahmed,\n\nPlease review the attached Shariah certificate...'
        }
      ]
    },
    availableActions: ['approve', 'do_it_for_me', 'ask_why']
  },
  // ... more tasks
]

export const MOCK_EVIDENCE = [
  {
    id: 'ev-001',
    name: 'Asset Purchase Agreement',
    dealId: 'Deal-123',
    source: 'SharePoint',
    sourcePath: 'Finance/Deals/2024/Sukuk/',
    collectedBy: 'evidence-agent',
    collectedAt: '2024-11-04T10:23:00Z',
    lastVerified: '2024-11-07T08:00:00Z',
    vcId: 'VC-2024-001234',
    hederaTx: '0.0.123456@1699564800.123'
  },
  // ... more evidence
]

export const MOCK_VCS = [
  {
    vcId: 'VC-2024-001234',
    dealId: 'Deal-123',
    issuer: 'did:hedera:mainnet:...',
    issuanceDate: '2024-11-04T10:23:15Z',
    credentialSubject: {
      dealId: 'Deal-123',
      compliance: {
        shariah: { status: 'compliant', score: 100 },
        jurisdiction: { status: 'compliant', score: 100 }
      }
    },
    hederaTx: '0.0.123456@1699564800.123',
    sharedWith: []
  },
  // ... more VCs
]
```

### 3. Synthetic Event Streams

```typescript
// Simulate background agent work
setInterval(() => {
  const randomEvent = generateRandomAgentEvent()
  agentEventBus.emit(randomEvent)
}, 5000) // New event every 5 seconds

function generateRandomAgentEvent(): AGUIEvent {
  const events = [
    { type: 'evidence:collected', payload: { evidenceId: 'ev-new', source: 'SharePoint' }},
    { type: 'task:auto_completed', payload: { taskId: 'task-005' }},
    { type: 'compliance:drift_detected', payload: { dealId: 'Deal-456', rule: 'AAOIFI FAS 33' }},
    { type: 'shariah:review_complete', payload: { taskId: 'task-001', approver: 'Dr. Ahmed' }}
  ]
  return events[Math.floor(Math.random() * events.length)]
}
```

---

## Component Architecture

### Directory Structure
```
src/
├── app/
│   └── ai-native/                    # NEW standalone section
│       ├── layout.tsx                # AG-UI shell
│       ├── page.tsx                  # Screen 1: Home
│       ├── tasks/
│       │   └── page.tsx              # Screen 2: My Tasks
│       ├── evidence/
│       │   └── page.tsx              # Screen 3: Evidence
│       ├── workflows/
│       │   └── page.tsx              # Screen 4: Workflows
│       ├── proofs/
│       │   └── page.tsx              # Screen 5: Proofs
│       └── trust-portal/
│           └── page.tsx              # Screen 6: Trust Portal
│
├── components/
│   └── ai-native/                    # AG-UI components
│       ├── AGUIEventStream.tsx       # Event stream listener
│       ├── AITaskCard.tsx            # Task card with agent actions
│       ├── ComplianceCopilot.tsx     # Floating AI chat widget
│       ├── AgentTypingIndicator.tsx  # "Agent is thinking..."
│       ├── DoItForMeButton.tsx       # Trigger agent execution
│       ├── EvidenceSourceBadge.tsx   # SharePoint/S3/Agent/API
│       ├── VCViewer.tsx              # W3C VC JSON viewer
│       ├── SelectiveDisclosure.tsx   # Toggle view modes
│       └── ReadinessDashboard.tsx    # 3-tile home screen
│
├── lib/
│   ├── ag-ui/                        # AG-UI protocol implementation
│   │   ├── types.ts                  # AGUIEvent, AGUIState, etc.
│   │   ├── event-bus.ts              # Event emitter/listener
│   │   ├── state-manager.ts          # Shared state (Zustand)
│   │   ├── agents/                   # Mock agent implementations
│   │   │   ├── compliance-copilot.ts
│   │   │   ├── evidence-agent.ts
│   │   │   ├── drift-agent.ts
│   │   │   ├── auto-assignment-agent.ts
│   │   │   └── blockchain-agent.ts
│   │   └── tools.ts                  # Frontend tools agents can call
│   │
│   ├── mock-data/                    # Mock fixtures
│   │   ├── deals.ts
│   │   ├── tasks.ts
│   │   ├── evidence.ts
│   │   ├── vcs.ts
│   │   └── aaoifi-standards.ts       # AAOIFI knowledge base
│   │
│   └── utils/
│       ├── streaming.ts              # Async generator helpers
│       └── vc-generator.ts           # Generate W3C VCs
│
└── styles/
    └── ai-native.css                 # AG-UI specific styles
```

### Key Components

#### 1. AG-UI Event Stream Listener
```typescript
// components/ai-native/AGUIEventStream.tsx
'use client'

import { useEffect } from 'react'
import { agentEventBus } from '@/lib/ag-ui/event-bus'
import { useAGUIStore } from '@/lib/ag-ui/state-manager'

export function AGUIEventStream() {
  const { dispatch } = useAGUIStore()

  useEffect(() => {
    const unsubscribe = agentEventBus.on('*', (event) => {
      // Route events to appropriate handlers
      switch (event.type) {
        case 'message':
          dispatch({ type: 'ADD_MESSAGE', payload: event.payload })
          break
        case 'tool_call':
          executeFrontendTool(event.payload)
          break
        case 'state_update':
          dispatch({ type: 'UPDATE_STATE', payload: event.payload })
          break
        // ... more handlers
      }
    })

    return unsubscribe
  }, [])

  return null // No UI, just event routing
}
```

#### 2. AI Task Card
```typescript
// components/ai-native/AITaskCard.tsx
'use client'

import { useState } from 'react'
import { AITaskCard as TaskData } from '@/lib/ag-ui/types'
import { DoItForMeButton } from './DoItForMeButton'

export function AITaskCard({ task }: { task: TaskData }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border rounded-lg p-4">
      {/* Priority badge */}
      <div className={`badge badge-${task.priority}`}>
        {task.priority.toUpperCase()}
      </div>

      {/* AI Summary */}
      <div className="mt-2">
        <span className="text-sm text-gray-500">🤖 Summary:</span>
        <p className="font-medium">{task.summary}</p>
      </div>

      {/* Evidence list */}
      <div className="mt-4">
        <span className="text-sm font-semibold">📎 Evidence:</span>
        {task.evidence.map(ev => (
          <div key={ev.name} className="flex items-center gap-2 mt-1">
            {ev.status === 'verified' ? '✓' : '⚠️'}
            {ev.name}
            <EvidenceSourceBadge source={ev.source} />
          </div>
        ))}
      </div>

      {/* Compliance rule */}
      <div className="mt-4 p-3 bg-blue-50 rounded">
        <span className="text-sm font-semibold">📋 Rule:</span>
        <p className="font-mono text-sm">{task.rule.standard}</p>
        <p className="text-sm italic">&quot;{task.rule.text}&quot;</p>
        <a href={task.rule.citation_url} target="_blank" className="text-blue-600 text-sm">
          [View Full Standard]
        </a>
      </div>

      {/* Proposed fix */}
      <div className="mt-4">
        <span className="text-sm font-semibold">💡 Proposed Fix:</span>
        <p className="text-sm">{task.proposedFix.description}</p>
        {task.proposedFix.actions.map((action, i) => (
          <div key={i} className="mt-2">
            {action.type === 'send_email' && (
              <details>
                <summary className="cursor-pointer text-blue-600 text-sm">
                  📧 Draft email prepared
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
                  {action.preview}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button className="btn btn-primary">
          ✓ Approve & Make Proof
        </button>
        <DoItForMeButton task={task} />
        <button className="btn btn-outline">
          Ask Why
        </button>
      </div>
    </div>
  )
}
```

#### 3. "Do It For Me" Button
```typescript
// components/ai-native/DoItForMeButton.tsx
'use client'

import { useState } from 'react'
import { complianceCopilot } from '@/lib/ag-ui/agents/compliance-copilot'
import { agentEventBus } from '@/lib/ag-ui/event-bus'

export function DoItForMeButton({ task }: { task: AITaskCard }) {
  const [executing, setExecuting] = useState(false)

  const handleExecute = async () => {
    setExecuting(true)

    // Stream agent execution
    for await (const event of complianceCopilot.executeTask(task)) {
      agentEventBus.emit(event)

      // Show progress in UI
      if (event.type === 'message') {
        // Toast notification
      }
    }

    setExecuting(false)
  }

  return (
    <button
      onClick={handleExecute}
      disabled={executing}
      className="btn btn-secondary"
    >
      {executing ? (
        <>⏳ Agent Working...</>
      ) : (
        <>🤖 Do It For Me</>
      )}
    </button>
  )
}
```

---

## Integration with Existing App

### Option 1: Standalone Section (Recommended)
Add new route `/ai-native` that's completely separate:

```typescript
// src/app/layout.tsx - Add navigation link
export default function RootLayout() {
  return (
    <html>
      <body>
        <nav>
          <Link href="/">Workflow Builder</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/ai-native">🆕 AI-Native GRC</Link> {/* NEW */}
        </nav>
        {children}
      </body>
    </html>
  )
}
```

Users can toggle between:
- **Classic mode**: Current Vanta-style dashboard (`/dashboard`, `/collaboration`)
- **AI-Native mode**: New AG-UI interface (`/ai-native/*`)

### Option 2: Progressive Migration
Gradually replace existing pages:
1. Start with `/ai-native/tasks` as alternative to `/collaboration`
2. Add `/ai-native/proofs` as alternative to `/digital-assets`
3. Eventually deprecate old routes

### Option 3: Feature Flag
Use environment variable to enable/disable AI-native mode:

```typescript
// .env.local
NEXT_PUBLIC_AI_NATIVE_ENABLED=true

// Navigation
{process.env.NEXT_PUBLIC_AI_NATIVE_ENABLED && (
  <Link href="/ai-native">AI-Native GRC</Link>
)}
```

**Recommendation**: Start with **Option 1** (standalone section) for cleanest demo separation.

---

## Implementation Checklist

### Phase 1: Foundation (Day 1-2)
- [ ] Create `/ai-native` route structure
- [ ] Implement AG-UI event bus
- [ ] Create mock data fixtures
- [ ] Build AGUIEventStream component
- [ ] Set up Zustand state manager for AG-UI state

### Phase 2: Core Screens (Day 3-5)
- [ ] Screen 1: Home (Readiness Dashboard)
  - [ ] 3-tile layout (Finished/Blockers/Changes)
  - [ ] Predictive timeline
  - [ ] Embedded AI Copilot widget
- [ ] Screen 2: My Tasks
  - [ ] AITaskCard component
  - [ ] "Do It For Me" button
  - [ ] "Ask Why" modal
  - [ ] Evidence list with source badges
- [ ] Screen 3: Evidence Repository
  - [ ] Evidence list with filters
  - [ ] Source breakdown
  - [ ] VC badge
  - [ ] Selective disclosure toggle

### Phase 3: Advanced Screens (Day 6-8)
- [ ] Screen 4: Workflows
  - [ ] Step-by-step progress view
  - [ ] Auto-Apply vs Review Manually toggle
  - [ ] Agent execution streaming
- [ ] Screen 5: Proofs
  - [ ] W3C VC JSON viewer
  - [ ] Hedera blockchain link
  - [ ] Selective disclosure controls
  - [ ] Share modal
- [ ] Screen 6: Trust Portal
  - [ ] Public compliance overview
  - [ ] Live controls list
  - [ ] Proof-constrained AI chatbot

### Phase 4: Agent Behaviors (Day 9-10)
- [ ] ComplianceCopilot agent (Q&A)
- [ ] EvidenceAgent (auto-collect documents)
- [ ] DriftAgent (detect policy violations)
- [ ] AutoAssignmentAgent (route tasks)
- [ ] BlockchainAgent (mint VCs, verify)

### Phase 5: Polish (Day 11-12)
- [ ] Typing indicators
- [ ] Toast notifications for agent events
- [ ] Loading states
- [ ] Animations (task completion, proof minting)
- [ ] Responsive design
- [ ] Dark mode support

### Phase 6: Demo Prep (Day 13-14)
- [ ] Pre-script demo flow (Sukuk issuance)
- [ ] Record demo video
- [ ] Create sales deck slides
- [ ] Document key talking points

---

## Success Criteria

### User Experience
- [ ] Users understand "AI-native" difference in <30 seconds
- [ ] "Do It For Me" button works seamlessly
- [ ] Agent streaming feels real (not instant)
- [ ] Blockchain verification links work
- [ ] Selective disclosure UI is intuitive

### Technical
- [ ] All 6 screens functional
- [ ] AG-UI events stream in real-time
- [ ] Mock agents execute believably (1-3 second delays)
- [ ] No backend dependencies
- [ ] Responsive on desktop + tablet

### Demo-Ready
- [ ] 3-minute walkthrough script prepared
- [ ] Pre-loaded data for Sukuk deal
- [ ] Agent responses feel natural
- [ ] Sales deck updated with screenshots

---

## Decision Points

### 1. Technology Stack
**Recommendation**: Use existing Next.js + shadcn/ui
**Rationale**: Leverage current component library, no new dependencies

### 2. State Management
**Recommendation**: Zustand for AG-UI state (separate from current store)
**Rationale**: Avoid polluting existing workflow state, clean separation

### 3. Mock Agent Implementation
**Recommendation**: TypeScript classes with async generators
**Rationale**: Easy to simulate streaming, realistic delays

### 4. Deployment
**Recommendation**: Deploy to `/ai-native` route on existing Netlify instance
**Rationale**: Single deployment, easy comparison between classic vs AI-native

---

## Next Steps

1. **Review this plan** - Get user feedback/approval
2. **Set up directory structure** - Create `/ai-native` routes
3. **Build event bus** - Core AG-UI infrastructure
4. **Mock first screen** - Home (Readiness Dashboard) as proof-of-concept
5. **Iterate** - Get feedback, refine UX

---

**Questions for Discussion**:
1. Should we build all 6 screens or focus on 2-3 key screens first?
2. Do you want real Islamic finance data or generic mock data?
3. Should AI Copilot widget be global (all screens) or per-screen?
4. Do you have specific demo scenario in mind (Sukuk, Murabaha, etc.)?
5. Timeline expectations (2 weeks? 1 month?)?

---

**End of Plan**
