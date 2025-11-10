# Integration Architecture: Research Methodology → Task Cards

**Date**: 2025-11-10
**Status**: Planning - Architecture Design
**Goal**: Unify research-driven GRC system with workflow template system

---

## Executive Summary

Currently, the platform has **two parallel GRC systems** that don't communicate:

1. **Research-Driven System**: `/obligations`, `/controls`, `/research` pages
   - 60 unified obligations from QCB/QFCRA research
   - 34 controls with activation logic
   - 8-phase systematic methodology
   - Transparent obligation-to-control mapping

2. **Template-Driven System**: `/islamic-grc-demo` workflows
   - Qatar Ijarah V2 workflow templates
   - Module-based workflow assembly
   - Task generation from templates
   - Policy constraints embedded in steps

**The Problem**: Task cards reference "AAOIFI GS-1" or "QCB Article 109" but don't link back to the research register that explains:
- Why this obligation was included
- How conflicts between regulators were resolved
- Which controls it activates
- What evidence is required

**The Solution**: Integrate both systems using progressive disclosure in task cards, enabling complete traceability from regulatory text → obligation → control → workflow → task.

---

## Current Architecture Analysis

### System 1: Research-Driven GRC

**Data Flow:**
```
Regulatory Documents (QCB Law, QFCRA Rulebook, AAOIFI)
         ↓
    [Extraction Phase]
         ↓
  74 Raw Obligations
         ↓
  [Unification Phase]
         ↓
  60 Unified Obligations (UNIFIED-OBL-001 to UNIFIED-OBL-060)
         ↓
   [Mapping Phase]
         ↓
  34 Controls (CTRL-SSB-001, CTRL-SNCR-001, etc.)
         ↓
  [Activation Logic]
         ↓
   Active Controls (based on regulator selection)
```

**Key Files:**
- `/src/lib/grc-store.ts` - Zustand store with mock obligations and controls
- `/src/lib/grc-types.ts` - TypeScript types for Obligation and Control
- `/src/app/obligations/page.tsx` - Obligations register UI
- `/src/app/controls/page.tsx` - Control library UI
- `/src/app/research/mapping/page.tsx` - Mapping visualization

**Strengths:**
- ✅ Complete research transparency
- ✅ Source-level traceability (exact document, section, URL)
- ✅ Conflict resolution documentation
- ✅ Activation logic visibility (TypeScript shown in UI)

**Weaknesses:**
- ❌ Not connected to actual workflow generation
- ❌ Mock data only (no real workflow templates)
- ❌ No task card integration

---

### System 2: Template-Driven Workflows

**Data Flow:**
```
User Selects: Qatar + Ijarah
         ↓
  [Workflow Assembler]
         ↓
Loads Qatar Ijarah Template → References 9 Modules
         ↓
   [Module Loading]
         ↓
qat-ssb-001, qat-scf-001, qat-ijr-gate-001, etc.
         ↓
  [Workflow Assembly]
         ↓
Flattened workflow with 37 steps + dependencies
         ↓
   [Task Generator]
         ↓
37 Tasks with policy constraints and evidence requirements
         ↓
    [Dashboard]
         ↓
   Task Cards displayed by role
```

**Key Files:**
- `/src/lib/workflow-templates/qatar/ijarah.json` - Product template
- `/src/lib/workflow-templates/qatar/modules/*.json` - 9 workflow modules
- `/src/lib/workflow-assembler/index.ts` - Template loader and assembler
- `/src/lib/task-generator/index.ts` - Task generation from workflows
- `/src/app/islamic-grc-demo/dashboard/my-tasks/page.tsx` - Task display

**Strengths:**
- ✅ Real workflow templates for Qatar Ijarah, Murabaha, Mudaraba
- ✅ Working task generation and dashboard
- ✅ Policy constraints embedded in steps
- ✅ Hard gate enforcement

**Weaknesses:**
- ❌ No link to research methodology
- ❌ Policy sources are just strings ("AAOIFI GS-1")
- ❌ No activation logic transparency
- ❌ Can't explain why obligations were unified

---

## Data Model Mapping

### Current Disconnects

| Research System | Template System | Connection Status |
|----------------|-----------------|-------------------|
| `Obligation` (UNIFIED-OBL-001) | `WorkflowModule` (qat-ssb-001) | ❌ No link |
| `Control` (CTRL-SSB-001) | `WorkflowStep` | ❌ No link |
| `obligation.source` (QCB Law 13/2012, Article 109) | `step.policyConstraints[].source` (AAOIFI GS-1) | ⚠️ String overlap only |
| `control.testProcedure` | `step.requiredEvidence` | ⚠️ Similar but different formats |
| `control.activationLogic` | Hardcoded in template | ❌ No transparency |

---

## Proposed Unified Architecture

### Core Principle: Single Source of Truth

**Obligations** are the single source of truth. Everything flows from obligations:

```
┌─────────────────────────────────────────────────────────────┐
│                   OBLIGATIONS REGISTER                       │
│  (60 unified obligations from research)                     │
│  - Source: QCB Law 13/2012, Article 109                     │
│  - Requirement: "Establish Shariah Supervisory Board"       │
│  - Applicability: qcb_required: true, qfcra_required: true  │
│  - Conflicts Resolved: QCB max 3 positions, QFCRA max 5     │
│  - Resolution: Use stricter (3 positions)                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLS LIBRARY                          │
│  (34 controls mapped to obligations)                        │
│  - CTRL-SSB-001: SSB Appointment & Composition              │
│  - Satisfies: [UNIFIED-OBL-001, UNIFIED-OBL-002]            │
│  - Test Procedure: "Review appointments, verify quals..."   │
│  - Evidence Types: [Appointment letters, CVs, Resolutions]  │
│  - KRIs: [SSB independence score, Meeting frequency]        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  WORKFLOW TEMPLATES                          │
│  (Product + Jurisdiction specific)                          │
│  - qat-ssb-001 module: Shariah Board Approval               │
│  - Implements: [CTRL-SSB-001, CTRL-SSB-004]                 │
│  - 4 steps: Prepare proposal → Submit → Review → Approve    │
│  - Policy constraints inherited from controls               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                        TASKS                                 │
│  (Executable work items with full traceability)             │
│  - Task: "Obtain SSB Resolution"                            │
│  - Satisfies Obligation: UNIFIED-OBL-001                    │
│  - Tests Control: CTRL-SSB-001                              │
│  - From Module: qat-ssb-001                                 │
│  - Evidence Required: [SSB Resolution, Approved Contracts]  │
│  - Progressive Disclosure: Click to see full research       │
└─────────────────────────────────────────────────────────────┘
```

---

## Enhanced Data Models

### 1. Obligation (Enhanced)

**Current** (in `grc-types.ts`):
```typescript
interface Obligation {
  id: string  // "UNIFIED-OBL-001"
  category: string
  requirement: string
  regulator: string
  source: { document: string, section: string, url: string }
  qcb_required: boolean
  qfcra_required: boolean
  controls_activated: string[]  // Control IDs
}
```

**Proposed** (add workflow module mapping):
```typescript
interface Obligation {
  id: string  // "UNIFIED-OBL-001"
  category: string
  requirement: string
  regulators: Array<{
    id: 'QCB' | 'QFCRA'
    source: { document: string, section: string, url: string }
    requirementText: string  // Exact text from regulation
  }>

  // Unification metadata
  conflictsWith?: string[]  // Other obligation IDs
  conflictResolution?: string  // How conflict was resolved

  // Activation
  qcb_required: boolean
  qfcra_required: boolean

  // Mappings
  controls_activated: string[]  // Control IDs
  workflow_modules: string[]    // NEW: Module IDs (e.g., "qat-ssb-001")

  // Evidence
  evidence_required: string[]

  // Research
  research_phase: number  // Which phase this was extracted (1-8)
  peer_reviewed: boolean
}
```

---

### 2. Control (Enhanced)

**Current** (in `grc-types.ts`):
```typescript
interface Control {
  id: string  // "CTRL-SSB-001"
  bucket: string
  name: string
  description: string
  testProcedure: string
  evidenceTypes: string[]
  qcb_required: boolean
  qfcra_required: boolean
  relatedObligations: string[]
}
```

**Proposed** (add workflow step mapping):
```typescript
interface Control {
  id: string  // "CTRL-SSB-001"
  bucket: 1 | 2 | 3 | 4 | 5 | 6
  bucketName: string
  name: string
  description: string

  // Testing
  testProcedure: string
  testFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  evidenceTypes: string[]

  // Activation
  qcb_required: boolean
  qfcra_required: boolean

  // Mappings
  satisfiesObligations: string[]  // Obligation IDs
  implementedByModules: string[]  // NEW: Module IDs
  implementedBySteps: string[]    // NEW: Step IDs (within modules)

  // KRIs
  keyRiskIndicators: Array<{
    name: string
    targetValue: number
    currentValue?: number
    unit: string
  }>

  // Automation
  automatable: boolean
  verifiable: boolean  // Can be verified on-chain
}
```

---

### 3. WorkflowModule (Enhanced)

**Current** (in `grc-demo-types.ts`):
```typescript
interface WorkflowModule {
  id: string  // "qat-ssb-001"
  name: string
  category: ModuleCategory
  policySource: string  // Free text
  isRequired: boolean
  steps: WorkflowStep[]
}
```

**Proposed** (add obligation/control links):
```typescript
interface WorkflowModule {
  id: string  // "qat-ssb-001"
  name: string
  nameArabic?: string
  category: ModuleCategory

  // Policy Sources (enhanced)
  policySource: string  // Human-readable summary
  satisfiesObligations: string[]  // NEW: Obligation IDs
  implementsControls: string[]    // NEW: Control IDs

  // Activation
  isRequired: boolean
  isEditable: boolean
  isHardGate: boolean

  // Product/Jurisdiction
  requiredFor: ProductType[]
  optionalFor: ProductType[]
  jurisdiction: Jurisdiction

  // Execution
  estimatedDurationDays: number
  steps: WorkflowStep[]

  // Research Traceability (NEW)
  researchMethodology?: {
    extractedInPhase: number
    conflictsResolved: string[]
    peerReviewedBy: string[]
  }
}
```

---

### 4. WorkflowStep (Enhanced)

**Current**:
```typescript
interface WorkflowStep {
  id: string
  title: string
  description: string
  assignedRole: string
  durationDays: number
  requiredEvidence: RequiredEvidence[]
  policyConstraints: PolicyConstraint[]
  requiresApproval: boolean
  isHardGate: boolean
}
```

**Proposed** (add control test mapping):
```typescript
interface WorkflowStep {
  id: string
  order: number
  title: string
  description: string

  // Assignment
  assignedRole: string
  assignedTo?: string

  // Timing
  durationDays: number
  startAfter?: string[]  // Step IDs

  // Evidence (enhanced)
  requiredEvidence: RequiredEvidence[]
  evidenceInstructions?: string  // NEW: Detailed upload instructions

  // Policy (enhanced)
  policyConstraints: PolicyConstraint[]
  satisfiesObligations?: string[]  // NEW: Obligation IDs
  testsControls?: string[]         // NEW: Control IDs being tested

  // Approval
  requiresApproval: boolean
  approvalRole?: string
  approvalCriteria?: string[]  // NEW: What approver checks

  // Gates
  isHardGate: boolean
  isOptional: boolean

  // Customization
  allowDurationChange: boolean
  allowRoleChange: boolean
}
```

---

### 5. Task (Enhanced)

**Current**:
```typescript
interface Task {
  id: string
  workflowId: string
  stepId: string
  title: string
  description: string
  priority: TaskPriority
  assignedRole: string
  dueDate: string
  status: TaskStatus
  requiredEvidence: TaskEvidence[]
  requiresApproval: boolean
  policyReference: string  // Just a string
  policyConstraints?: PolicyConstraint[]
}
```

**Proposed** (full traceability):
```typescript
interface Task {
  id: string
  workflowId: string
  stepId: string

  // Basic info
  title: string
  description: string
  priority: TaskPriority

  // Assignment
  assignedRole: string
  assignedTo?: string

  // Timing
  createdAt: string
  dueDate: string
  scheduledFor?: string
  recurrence?: TaskRecurrence

  // Status
  status: TaskStatus
  completedAt?: string
  completedBy?: string

  // Evidence
  requiredEvidence: TaskEvidence[]
  evidenceInstructions?: string

  // Approval
  requiresApproval: boolean
  approvalStatus?: ApprovalStatus
  approver?: string
  approvalCriteria?: string[]

  // Policy & Research Traceability (ENHANCED)
  policyReference: string  // Human-readable summary
  policyConstraints: PolicyConstraint[]  // Full constraint objects

  satisfiesObligations: string[]  // NEW: Obligation IDs
  testsControls: string[]         // NEW: Control IDs
  fromModule: string              // NEW: Module ID

  researchLinks: {  // NEW: Progressive disclosure links
    obligations: Array<{
      id: string
      requirement: string
      source: string
      url: string  // Link to /obligations page with filter
    }>
    controls: Array<{
      id: string
      name: string
      testProcedure: string
      url: string  // Link to /controls page with filter
    }>
    methodology: {
      phase: number
      conflictsResolved: string[]
      url: string  // Link to /research/mapping
    }
  }

  // Calendar
  calendarExported: boolean
  calendarUrl?: string
}
```

---

## Implementation Phases

### Phase 1: Data Model Enhancement (2-3 days)

**Goal**: Add cross-references between systems without changing UI

**Tasks**:
1. Update `grc-types.ts` with enhanced Obligation and Control types
2. Update `grc-demo-types.ts` with enhanced WorkflowModule, WorkflowStep, Task types
3. Add `satisfiesObligations` and `implementsControls` fields to all 9 Qatar modules JSON files
4. Update task generator to populate `researchLinks` in Task objects
5. Write migration utility to convert existing data

**Files Modified**:
- `/src/lib/grc-types.ts`
- `/src/lib/types/grc-demo-types.ts`
- `/src/lib/workflow-templates/qatar/modules/*.json` (9 files)
- `/src/lib/task-generator/index.ts`

**Validation**:
- All TypeScript compiles without errors
- Existing pages still work (backwards compatible)
- New fields are populated correctly in task generation

---

### Phase 2: Control Library Unification (1-2 days)

**Goal**: Merge the two control library implementations

**Current State**:
- `/src/app/controls/page.tsx` - Shows 34 controls from grc-store (research system)
- `/src/app/islamic-grc-demo/dashboard/controls/page.tsx` - Shows controls extracted from templates

**Proposed**:
- Create `/src/lib/unified-control-library/index.ts`
- Merge both data sources into single registry
- Both pages pull from same source
- Add "Implementation Status" field: `research-only`, `template-only`, or `fully-implemented`

**Tasks**:
1. Create unified control library service
2. Merge 34 research controls + template-extracted controls
3. Identify gaps (controls in research but not in templates)
4. Update both pages to use unified library
5. Add "Implementation Coverage" metric to research page

---

### Phase 3: Task Card Progressive Disclosure UI (2-3 days)

**Goal**: Implement the progressive disclosure pattern in task cards

**UI Hierarchy**:

```
┌─────────────────────────────────────────────────────────────┐
│ Priority 1: Always Visible                                   │
│ ├─ Task Title: "Obtain SSB Resolution"                      │
│ ├─ Priority Badge: [CRITICAL]                               │
│ ├─ Due Date: 2025-11-24 (14 days)                          │
│ └─ Assigned: Shariah Supervisory Board                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Priority 2: "Why This Exists" (1-2 sentences)               │
│                                                              │
│ This task ensures compliance with QCB Law 13/2012 Article   │
│ 109, which requires all Islamic banks to obtain Shariah     │
│ Supervisory Board approval before launching new products.   │
│                                                              │
│ [▼ Show Policy Requirements] [▼ Show Research Methodology]  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Priority 3: Policy Requirements (Collapsed by Default)      │
│ [Expanded when clicked]                                      │
│                                                              │
│ Satisfies Obligations:                                       │
│ ├─ UNIFIED-OBL-001: Establish Shariah Supervisory Board     │
│ │  ├─ Source: QCB Law 13/2012, Article 109                 │
│ │  ├─ Regulator: QCB + QFCRA                               │
│ │  └─ [View in Obligations Register →]                     │
│ └─ UNIFIED-OBL-002: SSB Product Approval Required           │
│    └─ [View in Obligations Register →]                     │
│                                                              │
│ Tests Controls:                                              │
│ └─ CTRL-SSB-001: SSB Appointment & Composition              │
│    ├─ Test Procedure: Review appointments, verify quals...  │
│    ├─ Evidence: [Appointment letters, CVs, Resolutions]     │
│    └─ [View in Control Library →]                          │
│                                                              │
│ Policy Constraints:                                          │
│ ├─ ⚠️ [CANNOT MODIFY] AAOIFI GS-1 §6/3: SSB resolution is  │
│ │   legally binding - product cannot launch without approval│
│ └─ 📋 QCB Regulation: SSB approval must be obtained before  │
│     any customer transactions                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Priority 4: Research Methodology (Collapsed by Default)     │
│ [Expanded when clicked]                                      │
│                                                              │
│ This requirement was unified from:                           │
│ ├─ QCB Law 13/2012, Article 109: "All Islamic banks shall  │
│ │   establish a Shariah Supervisory Board..."              │
│ └─ QFCRA ISFI Rulebook, Chapter 2, Section 2.1: "Every     │
│     Islamic financial institution must maintain an SSB..."   │
│                                                              │
│ Conflicts Resolved:                                          │
│ └─ SSB Position Limits:                                     │
│    ├─ QCB: Maximum 3 positions per scholar                  │
│    ├─ QFCRA: Maximum 5 positions per scholar                │
│    └─ ✓ Resolution: Use stricter (3 positions)             │
│                                                              │
│ Research Methodology:                                        │
│ ├─ Phase 2: Obligation Extraction                          │
│ ├─ Phase 5: Conflict Resolution (strictest rule principle) │
│ └─ Phase 6: Unified as UNIFIED-OBL-001                     │
│                                                              │
│ [View Full Methodology →] [View Obligation Mapping →]      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Priority 5: AI Validation (Collapsed by Default)            │
│ [Future enhancement - Phase 2.6 from Task Card Redesign]    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Priority 6: Evidence Documents (Collapsed by Default)       │
│                                                              │
│ Required Documents (3):                                      │
│ ├─ ✓ SSB Resolution [Uploaded 2025-11-10]                  │
│ ├─ ✓ Approved Contracts [Uploaded 2025-11-10]              │
│ └─ ⏳ Conditions Document [Not uploaded]                    │
│                                                              │
│ [Upload Files] [View All Evidence]                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Action Buttons                                               │
│ [Approve] [Reject] [Need More Info]                         │
└─────────────────────────────────────────────────────────────┘
```

**Tasks**:
1. Update TaskCard component with new sections
2. Implement collapsible sections with smooth animations
3. Add "View in..." links that open filtered obligation/control pages
4. Style mandatory constraints differently (red bg, lock icon)
5. Add research methodology section with conflict resolution display

**Files Modified**:
- `/src/app/islamic-grc-demo/components/TaskCard.tsx`
- Add new component: `/src/components/PolicyRequirementsSection.tsx`
- Add new component: `/src/components/ResearchMethodologySection.tsx`

---

### Phase 4: Obligation-Driven Workflow Generation (3-4 days)

**Goal**: Generate workflows from active obligations instead of hardcoded templates

**Current Flow**:
```
User selects Qatar + Ijarah
  → Load ijarah.json template
    → Load 9 hardcoded modules
      → Generate tasks
```

**Proposed Flow**:
```
User selects Qatar + Ijarah
  → Activate QCB obligations (46)
  → Activate QFCRA obligations (if in QFC) (28)
  → Unify to 60 obligations
    → Get controls from obligations (34 active)
      → Filter controls by product type (Ijarah)
        → Generate workflow modules from active controls
          → Generate tasks with full traceability
```

**Tasks**:
1. Create `getActiveObligations(regulators: string[])` function
2. Create `getControlsFromObligations(obligations: Obligation[])` function
3. Create `getModulesFromControls(controls: Control[], productType: ProductType)` function
4. Update workflow assembler to use obligation-driven approach
5. Add activation transparency page showing the full decision tree

**Files**:
- New: `/src/lib/obligation-driven-workflow/index.ts`
- Modified: `/src/lib/workflow-assembler/index.ts`
- New page: `/src/app/islamic-grc-demo/activation/page.tsx` (shows activation logic)

---

### Phase 5: Activation Transparency UI (1-2 days)

**Goal**: Show users WHY each workflow module was activated

**Page Design**: `/islamic-grc-demo/activation`

```
┌─────────────────────────────────────────────────────────────┐
│ Workflow Activation Transparency                             │
│                                                              │
│ Configuration:                                               │
│ ├─ Jurisdiction: Qatar (QFC)                                │
│ ├─ Regulators: QCB + QFCRA                                  │
│ └─ Product: Ijarah (Islamic Lease)                          │
│                                                              │
│ Step 1: Obligations Activated                                │
│ ├─ QCB obligations: 46                                      │
│ ├─ QFCRA obligations: 28                                    │
│ ├─ Duplicates removed: 14                                   │
│ └─ Unified obligations: 60 [View Register →]                │
│                                                              │
│ Step 2: Controls Activated                                   │
│ ├─ From obligations: 34 controls                            │
│ ├─ Filtered for Ijarah: 23 controls                        │
│ └─ [View Control Library →]                                 │
│                                                              │
│ Step 3: Workflow Modules Generated                           │
│ ├─ qat-ssb-001 (Shariah Board Approval)                    │
│ │  ├─ Satisfies: UNIFIED-OBL-001, UNIFIED-OBL-002           │
│ │  ├─ Tests: CTRL-SSB-001, CTRL-SSB-004                    │
│ │  └─ Steps: 4                                             │
│ ├─ qat-ijr-gate-002 (Delivery Before Rent Gate)            │
│ │  ├─ Satisfies: UNIFIED-OBL-023                           │
│ │  ├─ Tests: CTRL-GATE-002                                 │
│ │  └─ Steps: 3 [HARD GATE]                                │
│ └─ ... (7 more modules)                                     │
│                                                              │
│ Step 4: Tasks Generated                                      │
│ └─ Total: 37 tasks across 9 workflows                       │
│    [View My Tasks →]                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Checklist

### Data Layer
- [ ] Enhance Obligation type with workflow module references
- [ ] Enhance Control type with implementation tracking
- [ ] Enhance WorkflowModule type with obligation/control links
- [ ] Enhance WorkflowStep type with control test references
- [ ] Enhance Task type with full research traceability
- [ ] Add `satisfiesObligations` to all 9 Qatar module JSON files
- [ ] Add `implementsControls` to all 9 Qatar module JSON files
- [ ] Write data migration utility

### Service Layer
- [ ] Create unified control library service
- [ ] Merge research controls + template controls
- [ ] Create obligation-driven workflow generator
- [ ] Update task generator with research links
- [ ] Add activation logic service

### UI Layer
- [ ] Update TaskCard with progressive disclosure
- [ ] Add PolicyRequirementsSection component
- [ ] Add ResearchMethodologySection component
- [ ] Create Activation Transparency page
- [ ] Update Control Library page to show implementation status
- [ ] Add cross-links between all GRC pages

### Documentation
- [ ] Update CLAUDE.md with integration architecture
- [ ] Document the obligation → control → module → task flow
- [ ] Create user guide for progressive disclosure features
- [ ] Add developer guide for adding new jurisdictions

---

## Success Metrics

After integration is complete, users should be able to:

1. **Start from a Task Card**
   - Click "View Policy Requirements"
   - See exactly which UNIFIED-OBL-XXX obligations this satisfies
   - Click through to Obligations Register with pre-filtered view
   - See the exact regulatory text from QCB/QFCRA
   - Understand why conflicts were resolved a certain way

2. **Start from Obligations Register**
   - Click on UNIFIED-OBL-001
   - See which controls it activates (CTRL-SSB-001)
   - See which workflow modules implement it (qat-ssb-001)
   - See which tasks test it (4 tasks in SSB workflow)
   - Click through to see current task status

3. **Start from Control Library**
   - Click on CTRL-SSB-001
   - See which obligations it satisfies
   - See implementation status (research-only, template-only, or fully-implemented)
   - See test history and current pass/fail status
   - See which tasks are currently testing this control

4. **Understand Activation Logic**
   - Visit `/islamic-grc-demo/activation`
   - See exact TypeScript logic for control activation
   - Understand why 60 obligations → 34 controls → 9 modules → 37 tasks
   - Verify that all mandatory controls are included
   - See which controls are QCB-specific vs QFCRA-specific

---

## Risk Mitigation

### Risk 1: Data Model Complexity

**Risk**: Adding cross-references makes data model hard to maintain

**Mitigation**:
- Use TypeScript to enforce referential integrity
- Write validation utilities that check all IDs exist
- Create visualization tools to show the graph
- Document the data model extensively

### Risk 2: Performance

**Risk**: Resolving all cross-references on every task load is slow

**Mitigation**:
- Pre-compute research links during task generation
- Cache obligation/control lookups
- Use React query for efficient data fetching
- Lazy load research methodology sections

### Risk 3: Migration Complexity

**Risk**: Existing Qatar templates need to be updated with new fields

**Mitigation**:
- Write automated migration script
- Make new fields optional initially
- Support gradual rollout (some modules enhanced, others not)
- Backwards compatibility for 30 days

### Risk 4: User Confusion

**Risk**: Too much information overwhelms users

**Mitigation**:
- Progressive disclosure by default (collapsed sections)
- User preferences to show/hide research details
- Role-based defaults (managers see more than doers)
- Tooltips and help text throughout

---

## Timeline

**Total Estimated Time: 11-15 days**

| Phase | Days | Dependencies |
|-------|------|--------------|
| Phase 1: Data Model Enhancement | 2-3 | None |
| Phase 2: Control Library Unification | 1-2 | Phase 1 complete |
| Phase 3: Task Card Progressive Disclosure UI | 2-3 | Phase 1 complete |
| Phase 4: Obligation-Driven Workflow Generation | 3-4 | Phases 1, 2 complete |
| Phase 5: Activation Transparency UI | 1-2 | Phase 4 complete |

**Parallel Work Opportunities**:
- Phases 2 and 3 can be done in parallel after Phase 1
- UI work (Phases 3, 5) can be prototyped with mock data

---

## Next Steps - Decision Required

**Option A: Full Integration (11-15 days)**
- Implement all 5 phases
- Complete obligation → control → workflow → task traceability
- Deliver fully integrated system

**Option B: Phased Rollout (Start with Phase 3)**
- Just do Phase 3: Task Card Progressive Disclosure UI
- Use existing `policyConstraints` data (already in tasks)
- Add "View in Control Library" links
- Defer full obligation integration to later

**Option C: Prototype First (3-4 days)**
- Build ONE complete example: UNIFIED-OBL-001 → CTRL-SSB-001 → qat-ssb-001 → 4 tasks
- Show full traceability for this one obligation
- Get user feedback before rolling out to all 60 obligations

---

**Which option do you prefer? Or would you like me to adjust the architecture before proceeding?**
