# Workflow Transparency Implementation Plan

**Date**: 2025-11-08
**Goal**: Integrate agentic workflow transparency into existing demo
**Status**: 🟢 Ready for Implementation

---

## Executive Summary

### What We're Building
A **workflow execution transparency system** that shows users how AI agents generate compliance tasks, following the 8-phase agentic workflow plan while grounding in Qatar GRC research data.

### Why This Matters
**Problem**: Users see tasks appear on their dashboard but don't understand:
- Where tasks came from
- What AI logic created them
- How compliance requirements were determined
- Whether the AI can be trusted

**Solution**: Three-level transparency system
1. **Task Lineage** (contextual) - "View Lineage" button on tasks
2. **Workflow Executions** (central hub) - `/workflows/executions` page
3. **Architecture Docs** (educational) - Static reference pages

### Strategic Alignment
This bridges the gap between:
- **Qatar GRC Research** (60 obligations, 34 controls) = Knowledge Base
- **Agentic Workflow** (A0-A9 phases) = Policy Generation Engine
- **User Tasks** (existing demo) = Actionable Outputs

---

## Design Decisions

### Decision 1: Add New Page, Don't Replace Existing
**Choice**: Create `/workflows/executions` as new section
**Rationale**:
- Existing `/ai-native/tasks` shows **what** to do
- New `/workflows/executions` shows **how** it was determined
- Maintains separation of concerns
- Users can navigate between views

### Decision 2: Progressive Disclosure Pattern
**Choice**: Start from task → lineage → full execution → architecture
**Rationale**:
- Casual users: See tasks, optionally click lineage
- Power users: Explore executions page
- Technical users: Study architecture
- No forced complexity on simple use cases

### Decision 3: Mock Data Matching Real Tasks
**Choice**: Create workflow executions that generated existing tasks
**Rationale**:
- Demonstrates end-to-end flow
- Users see familiar tasks traced back to workflow
- Validates integration story
- Easier to explain causality

### Decision 4: Link to Qatar GRC Pages
**Choice**: Every obligation/control links to `/obligations` or `/controls`
**Rationale**:
- Shows data provenance
- Demonstrates Qatar GRC as knowledge base
- Users understand source of truth
- Reinforces research credibility

---

## Implementation Architecture

### Files to Create

#### 1. Type Definitions
**File**: `src/lib/workflow-types.ts`
**Purpose**: TypeScript types for workflow executions
**Size**: ~200 lines

```typescript
export type WorkflowPhaseId = 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9'
export type WorkflowStatus = 'RUNNING' | 'HITL_PENDING' | 'COMPLETED' | 'FAILED'
export type HITLStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface WorkflowExecution {
  id: string
  name: string
  deal_id: string
  deal_name: string
  status: WorkflowStatus
  created_at: string
  completed_at?: string
  duration_seconds?: number
  phases: WorkflowPhase[]
  outputs: WorkflowOutputs
}

export interface WorkflowPhase {
  id: WorkflowPhaseId
  name: string
  description: string
  status: 'COMPLETED' | 'RUNNING' | 'HITL_PENDING' | 'FAILED' | 'PENDING'
  duration_seconds?: number
  input: any
  output: any
  validation?: ValidationResult
  quality_checks?: QualityCheck
  hitl_gate?: HITLGate
  data_source?: string
  search_query?: string
}

export interface HITLGate {
  status: HITLStatus
  approver?: string
  approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  pending_since?: string
}

export interface WorkflowOutputs {
  guardian_policy?: string
  ipfs_hash?: string
  hedera_topic?: string
  tasks_generated: Array<{id: string, title: string}>
  vcs_generated: number
  controls_activated: number
}
```

#### 2. Mock Data Store
**File**: `src/lib/workflow-execution-store.ts`
**Purpose**: Zustand store with mock workflow executions
**Size**: ~800 lines (detailed mock data)

**Mock Executions** (matching existing tasks):
1. **Ijara Deal Compliance Setup** (deal-002) → Generated tasks SG-02, RM-03, RL-03
2. **Green Sukuk Compliance** (deal-001) → HITL pending at A6
3. **Commodity Murabaha Setup** (deal-003) → Completed, generated 2 tasks

#### 3. Executions List Page
**File**: `src/app/workflows/executions/page.tsx`
**Purpose**: Main workflow executions list view
**Size**: ~400 lines
**Features**:
- List of recent executions (cards)
- Status badges (Completed, HITL Pending, Running)
- Phase progress indicators (8-phase checklist)
- Quick stats (duration, tasks generated, controls activated)
- Filter by status
- Search by deal name/ID

#### 4. Execution Detail Page
**File**: `src/app/workflows/executions/[id]/page.tsx`
**Purpose**: Full transparency view for single execution
**Size**: ~600 lines
**Features**:
- Execution header (deal info, status, duration)
- 8-phase accordion (expand to see details)
- Per-phase: Input, Output, Validation, Quality Checks, HITL Gate
- Links to Qatar GRC pages (obligations, controls)
- Outputs section (Guardian policy, tasks generated, VCs)
- Timeline visualization

#### 5. Task Lineage Component
**File**: `src/components/workflow/TaskLineage.tsx`
**Purpose**: Lineage panel shown when clicking "View Lineage" on task
**Size**: ~200 lines
**Features**:
- Compact view of workflow that generated task
- Shows obligation → control → task flow
- Links to full execution detail
- Links to Qatar GRC sources

#### 6. Update Tasks Page
**File**: `src/app/ai-native/tasks/page.tsx` (MODIFY)
**Purpose**: Add "View Lineage" button to task cards
**Changes**: ~50 lines
**Features**:
- Add lineage button to each task
- Open lineage dialog on click
- Pass task ID to lineage component

#### 7. Update Navigation
**File**: `src/components/layout/Navigation.tsx` (MODIFY)
**Purpose**: Add Workflows menu item
**Changes**: ~30 lines

---

## User Flow Walkthrough

### Flow 1: Casual User Discovery
```
1. User visits /ai-native/tasks (existing page)
2. Sees task: "Shariah review flagged asset ownership transfer"
3. Thinks: "Why did this appear?"
4. Clicks: [🔍 View Lineage]
5. Sees lineage panel:
   ┌─────────────────────────────────────────┐
   │ Generated by: Ijara Compliance Workflow │
   │                                          │
   │ 1. Found obligation: UNIFIED-OBL-015     │
   │    "Lessor must own asset..."            │
   │    [View in Qatar Obligations →]         │
   │                                          │
   │ 2. Designed control: CTRL-IJARA-002      │
   │    "Ownership Verification..."           │
   │                                          │
   │ 3. Unit test detected missing evidence  │
   │    → Generated this task                 │
   │                                          │
   │ [View Full Workflow Execution →]         │
   └─────────────────────────────────────────┘
6. Clicks "View in Qatar Obligations" → Goes to /obligations#UNIFIED-OBL-015
7. Understands: Task is grounded in QCB Law 13/2012, Article 109
```

### Flow 2: Power User Exploration
```
1. User clicks "Workflows" in navigation
2. Lands on /workflows/executions
3. Sees list of recent workflow runs:
   ┌─────────────────────────────────────────┐
   │ ✅ Ijara Deal Compliance Setup          │
   │ deal-002 • 2m 34s • Created 3 tasks     │
   │ A0→A1→A2→A3→A4→A6→A7→A8→A9 ✓           │
   │ [View Details →]                         │
   └─────────────────────────────────────────┘
   ┌─────────────────────────────────────────┐
   │ 🟡 Green Sukuk Compliance                │
   │ deal-001 • HITL Pending at A6            │
   │ A0→A1→A2→A3→A4→A5→🔸A6 ⏸                │
   │ [Review & Approve →]                     │
   └─────────────────────────────────────────┘
4. Clicks "View Details" on Ijara workflow
5. Sees full 8-phase breakdown with accordion:
   ▼ A0: Deal Profiler ✓ (8s)
     Input: "Ijara structure for commercial property..."
     Output: {contractType: "Ijara", regulators: ["QCB", "QFCRA"]}
     Validation: ✓ Schema valid, regulators verified
     HITL: ✓ Approved by Sarah Chen

   ▼ A1: Obligation Extractor ✓ (23s)
     Data Source: qatar-unified-obligations
     Search Query: "Ijara obligations for QCB and QFCRA..."
     Output: 8 obligations found
       • UNIFIED-OBL-001: Establish SSB [View →]
       • UNIFIED-OBL-015: Lessor ownership [View →]
       ...
     Quality: RAGAS 0.94, Source citations 8/8
     HITL: ✓ Approved by Dr. Ahmad Al-Rashid

   [... A2-A9 phases ...]

6. Clicks "View" on UNIFIED-OBL-015
7. Goes to /obligations page, scrolled to that obligation
8. Sees full obligation details with QCB/QFCRA sources
```

### Flow 3: HITL Approval
```
1. Compliance officer Sarah visits /workflows/executions
2. Sees notification: "1 workflow awaiting your approval"
3. Clicks on Green Sukuk workflow (status: HITL Pending)
4. Sees workflow stopped at A6 (Policy Generator):
   ▼ A6: Guardian Policy Generator 🔸 HITL REVIEW PENDING
     Generated Policy:
       • 12 Guardian blocks implementing 6 controls
       • 4 VC schemas (Ownership, Delivery, Rent, Maintenance)
       • SNCR escalation workflow (Low/Med/High/Critical)

     Policy Preview:
     {
       "workflow": "ijara-qatar-qcb-qfcra",
       "controls": [
         {"id": "CTRL-IJARA-001", "block": "customLogicBlock", ...},
         ...
       ]
     }

     Quality Checks:
       ✓ All 6 controls have unit tests
       ✓ Policy schema valid
       ✓ Qatar obligations coverage: 8/8

     [❌ Reject] [✅ Approve & Continue →]
5. Reviews policy
6. Clicks "Approve & Continue"
7. Workflow proceeds to A7 (Unit Tester)
8. Task updates to show new phase running
```

---

## Data Model Design

### Workflow Execution Example (Full)
```typescript
{
  id: 'wf-20241108-001',
  name: 'Ijara Deal Compliance Setup',
  deal_id: 'deal-002',
  deal_name: 'Commodity Murabaha - Corporate Working Capital',
  status: 'COMPLETED',
  created_at: '2024-11-08T10:34:00Z',
  completed_at: '2024-11-08T10:36:34Z',
  duration_seconds: 154,

  phases: [
    // A0: Deal Profiler
    {
      id: 'A0',
      name: 'Deal Profiler',
      description: 'Transform free-form intent into structured deal profile',
      status: 'COMPLETED',
      duration_seconds: 8,
      input: {
        user_intent: "Ijara structure for commercial property lease. Institution operates in Qatar Financial Centre, regulated by both QFCRA and QCB. Operating lease, not IMB."
      },
      output: {
        contractType: 'Ijara',
        variant: 'Operating',
        assetType: 'Real Estate',
        jurisdictions: ['QA'],
        regulators: [
          {code: 'QCB', name: 'Qatar Central Bank', type: 'Prudential'},
          {code: 'QFCRA', name: 'Qatar Financial Centre Regulatory Authority', type: 'Prudential'}
        ],
        privacy_zone: {
          applicable: true,
          framework: 'QFC_DP',
          cross_border: false
        }
      },
      validation: {
        schema_valid: true,
        regulators_verified: true,
        iso_codes_valid: true
      },
      hitl_gate: {
        status: 'APPROVED',
        approver: 'Sarah Chen',
        approved_at: '2024-11-08T10:34:12Z'
      }
    },

    // A1: Obligation Extractor
    {
      id: 'A1',
      name: 'Obligation Extractor',
      description: 'Retrieve obligations from Qatar knowledge base',
      status: 'COMPLETED',
      duration_seconds: 23,
      data_source: 'qatar-unified-obligations (Graphiti)',
      search_query: 'Ijara obligations for QCB and QFCRA regulated entities in Qatar. Include Shariah governance, product approval, and SNCR requirements.',
      input: {
        deal_profile: { /* A0 output */ },
        filters: {
          regulators: ['QCB', 'QFCRA'],
          contract_type: 'Ijara'
        }
      },
      output: {
        obligations_found: 8,
        obligations: [
          {
            id: 'UNIFIED-OBL-001',
            title: 'Establish Shariah Supervisory Board (SSB)',
            requirement: 'Establish minimum 3 qualified Shariah scholars...',
            applicability: ['QCB', 'QFCRA'],
            category: 'SSB_GOVERNANCE',
            priority: 'CRITICAL',
            source: {
              qcb: 'QCB Law 13/2012, Article 109',
              qfcra: 'ISFI Rule 6.1.1'
            },
            link: '/obligations#UNIFIED-OBL-001'
          },
          {
            id: 'UNIFIED-OBL-015',
            title: 'Lessor Asset Ownership Before Lease',
            requirement: 'Lessor must own the leased asset prior to entering lease contract',
            applicability: ['QCB', 'QFCRA'],
            category: 'PRODUCT_APPROVAL',
            priority: 'HIGH',
            source: {
              aaoifi: 'AAOIFI SS-9 §3/1/1',
              qcb: 'Adopted via QCB Islamic Banking Regulations'
            },
            link: '/obligations#UNIFIED-OBL-015'
          },
          // ... 6 more obligations
        ]
      },
      quality_checks: {
        ragas_faithfulness: 0.94,
        source_citations: '8/8',
        regulator_match: true,
        aaoifi_alignment: true
      },
      hitl_gate: {
        status: 'APPROVED',
        approver: 'Dr. Ahmad Al-Rashid',
        approved_at: '2024-11-08T10:35:45Z'
      }
    },

    // A2: Risk Mapper
    {
      id: 'A2',
      name: 'Risk Mapper',
      description: 'Map obligations to risks using ISO 31000 framework',
      status: 'COMPLETED',
      duration_seconds: 15,
      input: {
        obligations: [ /* A1 output */ ],
        framework: 'ISO 31000'
      },
      output: {
        risks_identified: 4,
        risks: [
          {
            id: 'RISK-IJARA-001',
            name: 'SNCR - Lease Before Ownership',
            description: 'Risk of entering lease contract before acquiring asset ownership',
            severity: 'HIGH',
            likelihood: 'MEDIUM',
            impact: 'CRITICAL',
            category: 'SNCR',
            related_obligations: ['UNIFIED-OBL-015'],
            mitigation: 'Implement ownership verification control before contract execution'
          },
          // ... 3 more risks
        ]
      },
      hitl_gate: {
        status: 'APPROVED',
        approver: 'Sarah Chen',
        approved_at: '2024-11-08T10:36:02Z'
      }
    },

    // A3: Control Designer
    {
      id: 'A3',
      name: 'Control Designer',
      description: 'Design controls using COSO framework and Qatar control library',
      status: 'COMPLETED',
      duration_seconds: 18,
      input: {
        obligations: [ /* A1 output */ ],
        risks: [ /* A2 output */ ],
        regulators: ['QCB', 'QFCRA']
      },
      output: {
        controls_designed: 6,
        controls_from_qatar_library: 5,
        controls_custom: 1,
        controls: [
          {
            id: 'CTRL-IJARA-001',
            name: 'SSB Appointment & Independence',
            description: 'Verify SSB members meet qualification and independence criteria',
            test_procedure: 'Review SSB member CVs, check AAOIFI CSAA certification, verify position count',
            qcb_required: true,
            qfcra_required: true,
            related_obligations: ['UNIFIED-OBL-001', 'UNIFIED-OBL-002'],
            source: 'Qatar Control Library CTRL-SG-01',
            link: '/controls#CTRL-SG-01'
          },
          {
            id: 'CTRL-IJARA-002',
            name: 'Ownership Verification Before Lease',
            description: 'Verify lessor owns asset before entering lease contract',
            test_procedure: 'Confirm ownership title and review ownership timeline',
            qcb_required: true,
            qfcra_required: true,
            related_obligations: ['UNIFIED-OBL-015'],
            source: 'Qatar Control Library CTRL-PA-03',
            link: '/controls#CTRL-PA-03'
          },
          // ... 4 more controls
        ]
      },
      quality_checks: {
        all_controls_testable: true,
        obligation_coverage: '8/8',
        qatar_library_reuse: '5/6'
      },
      hitl_gate: {
        status: 'APPROVED',
        approver: 'Sarah Chen',
        approved_at: '2024-11-08T10:36:24Z'
      }
    },

    // A4-A9 phases follow similar structure...
  ],

  outputs: {
    guardian_policy: 'policy-ijara-qatar-20241108.json',
    ipfs_hash: 'QmX7Y8Z9W1V2U3T4S5R6Q7P8O9N0M1L2K3J4I5H6G7F8E9D',
    hedera_topic: '0.0.12345678',
    tasks_generated: [
      {id: 'SG-02', title: 'Shariah review flagged asset ownership transfer mechanism'},
      {id: 'RM-03', title: 'Q4 RoR benchmark data incomplete for projection'},
      {id: 'RL-03', title: 'Sanctions screening failed - counterparty on OFAC SDN list'}
    ],
    vcs_generated: 12,
    controls_activated: 6
  }
}
```

---

## UI Components Design

### Component 1: Workflow Execution Card (List View)
```tsx
<Card className={status === 'COMPLETED' ? 'border-green-200' : 'border-yellow-200'}>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          {status === 'COMPLETED' ? <CheckCircle2 className="text-green-600" /> : <Clock className="text-yellow-600" />}
          {name}
        </CardTitle>
        <CardDescription>
          {deal_name} • {duration_seconds}s • Created {tasks_generated.length} tasks
        </CardDescription>
      </div>
      <Badge variant={status === 'COMPLETED' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    </div>
  </CardHeader>
  <CardContent>
    {/* Phase Progress */}
    <div className="flex items-center gap-1 mb-4">
      {phases.map(phase => (
        <div
          key={phase.id}
          className={`h-2 flex-1 rounded ${
            phase.status === 'COMPLETED' ? 'bg-green-500' :
            phase.status === 'HITL_PENDING' ? 'bg-yellow-500' :
            'bg-gray-200'
          }`}
          title={`${phase.id}: ${phase.name}`}
        />
      ))}
    </div>

    {/* Quick Stats */}
    <div className="flex gap-4 text-sm text-muted-foreground">
      <span>{controls_activated} controls</span>
      <span>{vcs_generated} VCs</span>
      <span>RAGAS {quality_score}</span>
    </div>

    <Button variant="outline" className="mt-4">
      View Details <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </CardContent>
</Card>
```

### Component 2: Phase Accordion (Detail View)
```tsx
<Accordion type="multiple">
  {phases.map(phase => (
    <AccordionItem key={phase.id} value={phase.id}>
      <AccordionTrigger>
        <div className="flex items-center gap-3 w-full">
          <Badge>{phase.id}</Badge>
          <span className="font-semibold">{phase.name}</span>
          {phase.status === 'COMPLETED' && <CheckCircle2 className="text-green-600" />}
          {phase.status === 'HITL_PENDING' && <Clock className="text-yellow-600" />}
          <span className="ml-auto text-sm text-muted-foreground">
            {phase.duration_seconds}s
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {/* Input Section */}
        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Input</div>
          <pre className="bg-muted p-3 rounded text-xs overflow-auto">
            {JSON.stringify(phase.input, null, 2)}
          </pre>
        </div>

        {/* Output Section */}
        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Output</div>
          {phase.id === 'A1' && (
            <div className="space-y-2">
              <div className="text-sm">Found {phase.output.obligations_found} obligations:</div>
              {phase.output.obligations.map(obl => (
                <Card key={obl.id} className="bg-blue-50">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline">{obl.id}</Badge>
                        <div className="font-semibold mt-1">{obl.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Source: {obl.source.qcb} + {obl.source.qfcra}
                        </div>
                      </div>
                      <Button variant="link" asChild>
                        <Link href={obl.link}>View in Qatar Register →</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quality Checks */}
        {phase.quality_checks && (
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Quality Checks</div>
            <div className="space-y-1 text-sm">
              {Object.entries(phase.quality_checks).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>{key.replace(/_/g, ' ')}: {String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HITL Gate */}
        {phase.hitl_gate && (
          <Card className={phase.hitl_gate.status === 'APPROVED' ? 'bg-green-50' : 'bg-yellow-50'}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Human Approval Gate</div>
                  <div className="text-xs mt-1">
                    {phase.hitl_gate.status === 'APPROVED' && (
                      <>Approved by {phase.hitl_gate.approver} on {new Date(phase.hitl_gate.approved_at).toLocaleString()}</>
                    )}
                    {phase.hitl_gate.status === 'PENDING' && (
                      <>Awaiting approval from {phase.hitl_gate.approver}</>
                    )}
                  </div>
                </div>
                <Badge variant={phase.hitl_gate.status === 'APPROVED' ? 'default' : 'secondary'}>
                  {phase.hitl_gate.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

### Component 3: Task Lineage Panel
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="ghost" size="sm">
      <Search className="w-4 h-4 mr-2" />
      View Lineage
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>How This Task Was Created</DialogTitle>
      <DialogDescription>
        Generated by: {workflow.name}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>{new Date(workflow.created_at).toLocaleString()}</span>
        <span>•</span>
        <span>Execution ID: {workflow.id}</span>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold">Workflow Path:</div>

        {/* Step 1: Obligation Found */}
        <Card className="bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">A1: Found obligation UNIFIED-OBL-015</div>
                <div className="text-xs mt-1">
                  "Lessor must own the leased asset prior to entering lease contract"
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Source: AAOIFI SS-9 §3/1/1
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  View in Qatar Obligations →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Control Designed */}
        <Card className="bg-purple-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">A3: Designed control CTRL-IJARA-002</div>
                <div className="text-xs mt-1">
                  "Ownership Verification Before Lease"
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  View in Control Library →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Unit Test Found Gap */}
        <Card className="bg-red-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">A7: Unit test detected gap in evidence</div>
                <div className="text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Missing: OwnershipVC for asset-12345
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Task Generated */}
        <Card className="bg-green-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Generated this task</div>
                <div className="text-xs mt-1">
                  Assigned to you • Priority: HIGH (SNCR risk if unresolved)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link href={`/workflows/executions/${workflow.id}`}>
          View Full Workflow Execution →
        </Link>
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

---

## Navigation Changes

### Before
```tsx
const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'My Tasks', href: '/ai-native/tasks', icon: CheckSquare },
  { name: 'Deals', href: '/deals', icon: Briefcase },
  { name: 'Evidence', href: '/ai-native/evidence', icon: FileText },
]

const grcNavigation = [
  { name: 'Obligations', href: '/obligations', icon: Shield },
  { name: 'Controls', href: '/controls', icon: CheckCircle2 },
  { name: 'SSB', href: '/ssb', icon: Users },
  { name: 'SNCR', href: '/sncr', icon: AlertTriangle },
  { name: 'Research Hub', href: '/research', icon: BookOpen },
]
```

### After
```tsx
const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'My Tasks', href: '/ai-native/tasks', icon: CheckSquare },
  { name: 'Deals', href: '/deals', icon: Briefcase },
  { name: 'Evidence', href: '/ai-native/evidence', icon: FileText },
  { name: 'Workflows', href: '/workflows/executions', icon: GitBranch, badge: '1' }, // NEW
]

const grcNavigation = [
  { name: 'Obligations', href: '/obligations', icon: Shield },
  { name: 'Controls', href: '/controls', icon: CheckCircle2 },
  { name: 'SSB', href: '/ssb', icon: Users },
  { name: 'SNCR', href: '/sncr', icon: AlertTriangle },
  { name: 'Research Hub', href: '/research', icon: BookOpen },
  { name: 'Workflow Executions', href: '/workflows/executions', icon: GitBranch }, // NEW
]
```

---

## Implementation Timeline

### Phase 1: Foundation (Day 1)
- ✅ Create type definitions (`workflow-types.ts`)
- ✅ Create mock data store (`workflow-execution-store.ts`)
- ✅ Create basic executions list page
- **Time**: 3-4 hours
- **Deliverable**: Can visit `/workflows/executions` and see list

### Phase 2: Detail View (Day 1-2)
- ✅ Create execution detail page with accordion
- ✅ Link to Qatar GRC pages
- ✅ Show all 8 phases with full data
- **Time**: 4-5 hours
- **Deliverable**: Can click into execution and see full transparency

### Phase 3: Task Integration (Day 2)
- ✅ Create TaskLineage component
- ✅ Update tasks page with lineage button
- ✅ Connect tasks to workflow executions
- **Time**: 2-3 hours
- **Deliverable**: Can view lineage from task card

### Phase 4: Navigation & Polish (Day 2)
- ✅ Update navigation menu
- ✅ Add status badges and filters
- ✅ Polish UI/UX
- **Time**: 1-2 hours
- **Deliverable**: Production-ready feature

**Total Time**: 10-14 hours over 2 days

---

## Success Criteria

### Must Have (MVP)
- ✅ User can view list of workflow executions
- ✅ User can drill into execution detail
- ✅ All 8 phases visible with input/output
- ✅ Links to Qatar GRC pages work
- ✅ Task lineage shows workflow that generated task
- ✅ Navigation updated

### Nice to Have (Future)
- Filter executions by status/date/deal
- Search executions
- Download Guardian policy JSON
- HITL approval interface (interactive)
- Real-time execution progress (SSE)
- Execution comparison view

### Quality Gates
- ✅ TypeScript compiles with no errors
- ✅ All pages render without console errors
- ✅ Links between pages work bidirectionally
- ✅ Mobile responsive
- ✅ Matches existing design system

---

## Risk Mitigation

### Risk 1: Too Much Information Overload
**Mitigation**: Progressive disclosure
- Start with high-level list view
- Accordion collapses details by default
- "View Lineage" is optional, not forced

### Risk 2: Mock Data Doesn't Match Real Tasks
**Mitigation**: Careful alignment
- Use existing task IDs (SG-02, RM-03, RL-03)
- Match deal names from existing data
- Validate consistency before implementation

### Risk 3: Navigation Confusion
**Mitigation**: Clear labeling
- "Workflow Executions" not just "Workflows"
- Descriptive page headers
- Breadcrumbs showing current location

---

## Future Enhancements

### Short-term (Post-MVP)
1. **Interactive HITL Approval**: Approve/reject workflows from UI
2. **Execution Search**: Search by deal, obligation, control
3. **Execution Comparison**: Compare two workflow runs side-by-side

### Medium-term
4. **Real-time Execution**: Watch workflow run in real-time with SSE
5. **Workflow Templates**: Pre-configured workflows for common deals
6. **Execution Analytics**: Success rate, average duration, bottlenecks

### Long-term
7. **Custom Workflow Builder**: Visual workflow designer
8. **Multi-jurisdiction Support**: Toggle between Qatar/SAMA/BNM
9. **Regulatory Change Impact**: "This execution would be different under new QCB rules"

---

## Conclusion

This implementation provides **three levels of transparency**:
1. **Contextual** (task lineage) - "Where did this come from?"
2. **Detailed** (execution view) - "How does the AI work?"
3. **Educational** (architecture) - "Why is it designed this way?"

By grounding every workflow in **Qatar GRC research** and showing **full AI reasoning**, we demonstrate:
- ✅ AI is not a black box
- ✅ All requirements are source-grounded
- ✅ Human oversight at critical gates
- ✅ Quality checks prevent hallucinations
- ✅ Complete audit trail exists

**Status**: Ready to implement. Proceeding with Phase 1...

---

**Prepared By**: Claude (Sonnet 4.5)
**Date**: 2025-11-08
