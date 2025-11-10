# Task Card Redesign Plan - GRC Demo Enhancement

**Date**: 2025-11-10
**Status**: Planning Phase
**Goal**: Create self-contained, actionable task cards with AI assistance

---

## Problem Statement

**Current State (My Tasks Page)**:
- ❌ Minimal task cards (just title + description + badges)
- ❌ Generic filters that don't add value
- ❌ No contextual information for completing tasks
- ❌ No AI reasoning or validation checks
- ❌ No inline evidence/documents
- ❌ Missing "why this exists" explanation
- ❌ No AI assistant to help complete tasks

**Desired State (Qatar Ijarah V2 Pattern)**:
- ✅ Self-contained information packs
- ✅ Clear context (workflow, step, severity, deadline)
- ✅ "Why this exists" section with policy references
- ✅ AI pre-validation checks (chain of thought)
- ✅ Inline evidence documents
- ✅ Contextual action buttons
- ✅ **NEW**: AI assistant per task

---

## What Makes V2 Task Cards "Self-Contained"

### 1. **Hierarchical Information Design**

```
Priority 1 (Always Visible):
├─ Task Title
├─ Severity Badge (Critical/High/Medium/Low)
├─ Deadline Countdown (2h 30m remaining)
└─ Context Chips (Workflow, Step X of Y)

Priority 2 (1 Paragraph):
└─ "WHY THIS EXISTS" - Plain English explanation

Priority 3 (Collapsed by Default):
├─ AI Reasoning (7 checks passed)
├─ Chain of Thought (6 validation steps with pass/fail)
└─ Evidence Documents (4 items)

Priority 4 (Bottom):
└─ Action Buttons (Approve/Reject/Need Info)
```

### 2. **Progressive Disclosure**
- **Summary View**: Shows 2 AI checks, 3 documents
- **Expanded View**: Shows all checks, all documents, full policy clauses
- User chooses their information depth

### 3. **AI Pre-Validation**
- AI has already checked 6-7 items before human sees task
- Shows "Payment verified ✓", "Bank reference validated ✓", etc.
- Builds confidence - human just needs to verify, not start from scratch

### 4. **Evidence Integration**
- All documents attached inline (no hunting)
- Preview/download buttons
- Document type labels (BankProof, ContractRef, etc.)

### 5. **Policy Traceability**
- Links to specific clauses: "QFC DAR 2024 Article 12(2)"
- Shows regulation in context
- Approver knows exactly why they're being asked

---

## Recurring Workflows - Critical Gap

### Current Problem
The demo assumes workflows are **one-time project workflows** (configure Qatar Ijarah → generate → complete).

But GRC is **continuous operations** with recurring tasks:

### Recurring Task Categories

| Frequency | Examples | Owner |
|-----------|----------|-------|
| **Daily** | SNCR monitoring check<br>Treasury reconciliation<br>Asset valuation updates | Shariah Compliance Officer<br>Finance Team |
| **Weekly** | Team task review<br>Overdue task escalation<br>Pipeline report | Manager<br>Compliance Manager |
| **Monthly** | AAOIFI FAS financial reporting<br>QCB prudential reporting<br>PER/IRR ratio review | Finance Manager<br>Compliance Manager |
| **Quarterly** | SSB meeting preparation<br>IAH profit distribution<br>Board GRC report | Shariah Board<br>Finance Manager<br>Risk Officer |
| **Annual** | SSB annual report<br>External Shariah audit<br>License renewal | Shariah Board<br>Audit Committee<br>Legal |

### Proposed Solution

**Add `recurrence` field to workflow templates**:
```typescript
{
  id: "qat-sncr-daily-monitoring",
  name: "Daily SNCR Monitoring",
  recurrence: {
    type: "daily",
    time: "09:00",
    timezone: "Asia/Qatar"
  },
  steps: [...]
}
```

**Add recurring task generator**:
- Generates tasks based on schedule
- Shows "Recurring" badge on task cards
- Links to previous instances (history)

---

## UI Simplification Strategy

### Current Dashboard Structure (Too Complex)
```
Islamic GRC Demo
├─ Overview (Information Overload)
│  ├─ 4 metric tiles
│  ├─ Shariah compliance card
│  ├─ Regulatory reporting card
│  ├─ Islamic risk categories
│  ├─ Active workflows
│  └─ Recent activity
├─ My Tasks (Right Concept, Weak Execution)
├─ Process Tracking (Manager View)
└─ (Planned: Controls, Policies, Evidence)
```

**Problem**: User doesn't know what they're supposed to DO.

### Proposed Simplified Structure

```
Islamic GRC Demo
├─ 🎯 My Tasks (PRIMARY - Task Doer View)
│  ├─ Summary Stats (4 tiles: Open, Critical, Due Soon, Completed Today)
│  ├─ Task List (Self-Contained Cards with AI Assistant)
│  └─ Quick Filters (Critical Only, Overdue Only, By Workflow)
│
├─ 📊 Team Dashboard (Manager View)
│  ├─ Team Utilization (by role)
│  ├─ Workflow Progress (all active workflows)
│  └─ Bottleneck Alerts
│
└─ 📚 Knowledge Base (Reference)
   ├─ Control Library (browse controls)
   ├─ Policy Constraints (search policies)
   └─ Standards Mapping (AAOIFI, IFSB, ISO)
```

### Design Principles

1. **One Primary Action Per Page**
   - My Tasks → Complete your assigned tasks
   - Team Dashboard → Monitor team progress
   - Knowledge Base → Look up information

2. **Clear Visual Hierarchy**
   - High Priority: What's due now (red/orange)
   - Medium Priority: What's due this week (yellow)
   - Low Priority: What's due later (green)

3. **Actionable Metrics Only**
   - ✅ "3 tasks due in next 4 hours" (actionable)
   - ❌ "42% completion rate" (vanity metric)

4. **Progressive Disclosure**
   - Summary → Details → AI Assistant → Evidence
   - User controls information depth

---

## AI Assistant Integration - The Game Changer

### Vision: Task-Specific AI Agent

**Each task gets its own AI assistant that:**
1. Knows the task context (policy, evidence, validation steps)
2. Can answer questions about requirements
3. Can review uploaded documents
4. Can suggest next steps
5. Cites specific policy clauses in answers

### Example Interaction

**Task**: "Approve Payment Certificate Issuance (PAY-001)"

**User**: "Why is transfer lock required?"

**AI Assistant**:
> Transfer lock is required per **QFC Digital Asset Regulations 2024, Article 9**, which states that Payment Certificates cannot function as a means of payment. Enabling transfer lock ensures the token cannot be transferred to third parties, preventing it from circulating as a payment instrument.
>
> **Related Controls**:
> - Article 20: Token Issuer must implement security controls
> - AAOIFI SS-9 §4/4: Lease payments are contractual obligations, not tradable assets
>
> **Evidence Check**: Your token settings show "transferLock: true" ✓

---

**User**: "Can I see the bank proof document?"

**AI Assistant**:
> Here's the bank proof document for Payment PAY-001:
>
> 📄 **bank-proof-pay-001.pdf**
> - File hash: a3f5c2b8...
> - Upload date: 2025-01-14
> - Verified by: System AI
>
> **Key Details Extracted**:
> - Amount: QAR 500,000 ✓
> - Bank Reference: TT12345678 ✓
> - Payer: Ahmed Al-Thani (Account 0.0.100001) ✓
> - Payment Date: 2025-01-14 (1 day early) ✓
>
> [View Document] [Download]

---

**User**: "Is everything ready for approval?"

**AI Assistant**:
> ✅ **YES - All validation checks passed:**
>
> 1. ✓ Validation Certificate issued and verified
> 2. ✓ Blockchain record confirmed (Topic 0.0.12345, Seq 100432)
> 3. ✓ Token settings compliant (all 4 security controls enabled)
> 4. ✓ Investor identity verified (did:hedera:testnet:buyer-001)
> 5. ✓ Rights register entry reserved
> 6. ✓ No conflicting issuance requests
>
> **Recommendation**: You can safely approve this request.
>
> **Policy Compliance Summary**:
> - QFC DAR Article 9: ✓ Not a means of payment
> - QFC DAR Article 12: ✓ Correct generation sequence
> - QFC DAR Article 20: ✓ Security controls enabled
> - AAOIFI SS-9 §4/4: ✓ Links to lease contract
>
> [Approve Now] [View Full Reasoning]

### Technical Implementation

**AI Assistant Features**:
1. **Context Loading**: Task metadata, evidence, policy clauses
2. **RAG (Retrieval Augmented Generation)**: Search policy documents
3. **Document Analysis**: Parse PDFs, extract key fields
4. **Citation Linking**: Always cite sources
5. **Conversation History**: Remember chat within task
6. **Action Suggestions**: "Ready to approve" vs "Missing evidence"

**UI Component**:
```tsx
<TaskCard>
  {/* Existing sections */}

  {/* NEW: AI Assistant Section */}
  <div className="border-t pt-4 mt-4">
    <Button
      variant="outline"
      onClick={() => setShowAI(true)}
    >
      <Bot className="h-4 w-4 mr-2" />
      Ask AI Assistant
    </Button>
  </div>
</TaskCard>

{/* AI Chat Drawer */}
<Sheet open={showAI}>
  <SheetContent>
    <AITaskAssistant
      taskId={task.id}
      context={task}
      evidence={task.evidenceRefs}
      policies={task.policyClause}
    />
  </SheetContent>
</Sheet>
```

---

## Implementation Plan (Phased)

### Phase 2.5: Task Card Redesign (3 days)
**Goal**: Adopt Qatar Ijarah V2 pattern for GRC demo tasks

**Tasks**:
1. Create new `TaskCard` component based on V2 design
2. Add "Why This Exists" section with policy references
3. Add AI reasoning section (collapsed by default)
4. Add chain of thought validation checks
5. Add evidence section with inline documents
6. Update task generator to include AI reasoning data

**Files**:
- `src/components/grc-demo/TaskCard.tsx` (new, based on v2)
- `src/lib/task-generator/index.ts` (add AI reasoning)
- `src/app/islamic-grc-demo/dashboard/my-tasks/page.tsx` (use new card)

**Mockup Changes**:
```typescript
// Old TaskCard (minimal)
<TaskCard
  task={task}
  onStatusChange={handleStatusChange}
  onComplete={handleComplete}
/>

// New TaskCard (self-contained)
<TaskCard
  task={task}
  why="Confirm asset ownership before rent per AAOIFI SS-9 §3/1"
  policyClause="AAOIFI SS-9 (Ijarah) §3/1: Institution must own asset before leasing"
  aiReasoning={[
    "Title deed verified ✓",
    "Purchase invoice validated ✓",
    "Asset registration confirmed ✓"
  ]}
  chainOfThought={[
    { step: "1. Check Title Deed", check: "Document authentic and complete", result: "pass" },
    { step: "2. Verify Purchase", check: "Invoice shows institution as buyer", result: "pass" }
  ]}
  evidenceRefs={[
    { name: "title-deed.pdf", type: "Legal Document", url: "/..." }
  ]}
  onApprove={handleApprove}
  onReject={handleReject}
  onNeedInfo={handleNeedInfo}
/>
```

---

### Phase 2.6: AI Assistant Integration (4-5 days)
**Goal**: Add task-specific AI chatbot to help users complete tasks

**Tasks**:
1. Create `AITaskAssistant` component (chat interface)
2. Build context loader (task + evidence + policies)
3. Integrate Claude API with RAG for policy search
4. Add document upload/analysis capability
5. Add conversation history persistence
6. Create "Ask AI" button on task cards

**Files**:
- `src/components/grc-demo/AITaskAssistant.tsx` (new)
- `src/lib/ai/task-assistant.ts` (API integration)
- `src/lib/ai/policy-search.ts` (RAG for policies)
- `src/app/api/ai/task-chat/route.ts` (API endpoint)

**Features**:
- Chat interface in slide-out panel
- Document Q&A ("What does the bank proof say?")
- Policy explanation ("Why is this required?")
- Completion readiness check ("Can I approve?")
- Citation links to source documents

---

### Phase 2.7: Recurring Workflows (2 days)
**Goal**: Support daily/weekly/monthly/quarterly/annual tasks

**Tasks**:
1. Add `recurrence` field to workflow template type
2. Create recurring workflow templates (daily SNCR, monthly reporting, etc.)
3. Build recurring task generator
4. Add "Recurring" badge to task cards
5. Add task history view (previous instances)

**Files**:
- `src/lib/types/grc-demo-types.ts` (add recurrence type)
- `src/lib/workflow-templates/recurring/` (new directory)
  - `daily-sncr-monitoring.json`
  - `monthly-aaoifi-reporting.json`
  - `quarterly-ssb-meeting.json`
- `src/lib/task-generator/recurring.ts` (new)

**Recurrence Types**:
```typescript
type Recurrence = {
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  time?: string  // "09:00" for daily tasks
  dayOfWeek?: number  // 1-7 for weekly tasks
  dayOfMonth?: number  // 1-31 for monthly tasks
  monthOfQuarter?: number  // 1-3 for quarterly tasks
  timezone?: string  // "Asia/Qatar"
}
```

---

### Phase 2.8: UI Simplification (2 days)
**Goal**: Reduce information overload, focus on actionable tasks

**Tasks**:
1. Simplify "Overview" page (merge into My Tasks header)
2. Rename "Process Tracking" to "Team Dashboard"
3. Move risk categories and regulatory reporting to Knowledge Base
4. Add "Knowledge Base" section with Controls/Policies/Standards
5. Improve visual hierarchy (high priority tasks first)

**Files**:
- `src/app/islamic-grc-demo/dashboard/my-tasks/page.tsx` (add summary stats)
- `src/app/islamic-grc-demo/dashboard/team/page.tsx` (rename from process-tracking)
- `src/app/islamic-grc-demo/knowledge/` (new section)
  - `controls/page.tsx`
  - `policies/page.tsx`
  - `standards/page.tsx`

---

## Questions for User

Before proceeding, please clarify:

1. **AI Assistant Priority**:
   - Should we do Phase 2.5 (task card redesign) first, then add AI later?
   - Or prioritize AI assistant integration from the start?

2. **Recurring Workflows Scope**:
   - Which recurring tasks are most important for the demo?
   - Daily SNCR monitoring? Monthly AAOIFI reporting? Quarterly SSB meeting?

3. **Evidence Upload**:
   - Should the AI assistant be able to analyze uploaded documents?
   - Mock analysis or real PDF parsing with LlamaParse?

4. **UI Simplification**:
   - Keep Overview page or merge into My Tasks?
   - Keep Process Tracking separate or combine with Team Dashboard?

5. **Standards Mapping**:
   - Should task cards show AAOIFI/IFSB standard badges?
   - E.g., "AAOIFI SS-9 §3/1" badge on Ijarah tasks

---

## Success Metrics

**User Experience**:
- ✅ User can complete a task without leaving the task card
- ✅ User understands WHY the task exists (policy clarity)
- ✅ User has confidence in approval (AI pre-validation)
- ✅ User can ask questions (AI assistant)
- ✅ User sees recurring tasks automatically (no manual setup)

**Technical**:
- ✅ Task cards show all relevant context
- ✅ AI assistant cites policy clauses
- ✅ Document upload and analysis works
- ✅ Recurring tasks generate on schedule
- ✅ UI is simplified (3 main sections, not 5+)

---

## Next Steps

1. **Review this plan** with user
2. **Get feedback** on priorities and scope
3. **Create mockups** for new task card design
4. **Prototype AI assistant** interaction flow
5. **Begin Phase 2.5** implementation

---

**Note**: This plan builds on Phase 1 (workflow generation working) and enhances the task execution experience. It addresses the "information overload" problem by making task cards self-contained and adding AI assistance.
