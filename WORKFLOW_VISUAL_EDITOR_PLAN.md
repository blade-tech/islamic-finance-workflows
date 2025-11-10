# Visual Workflow Editor Plan - BPMN Integration

**Date**: 2025-11-10
**Status**: Planning Phase
**Goal**: Add visual BPMN workflow viewer and editor (like ServiceNow)

---

## Problem Statement

**Current Workflow Creation Process:**
```
1. User configures: Qatar + Ijarah
2. Backend loads JSON templates (qat-ssb-001.json, qat-ijr-gate-001.json, etc.)
3. Assembler combines modules into workflow
4. User sees text list of steps in "Workflow Review" page
```

**Problems:**
- ❌ User can't visualize the workflow flow (sequence, parallel tasks, dependencies)
- ❌ User can't understand why certain steps come before others
- ❌ User can't edit workflows visually (must edit JSON files)
- ❌ Hard to explain workflows to non-technical stakeholders
- ❌ No way to see "this step blocks these 3 other steps"

**Desired State (ServiceNow-style):**
- ✅ Visual BPMN diagram showing workflow flow
- ✅ Drag-and-drop step reordering
- ✅ Visual indicators for hard gates, parallel tasks, dependencies
- ✅ Plain English labels (not technical jargon)
- ✅ Edit mode: Add/remove/reorder steps
- ✅ View mode: Understand current workflow

---

## Visual Mockup - BPMN Workflow Diagram

### Example: Qatar Ijarah Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│ Visual Workflow Editor - Ijarah (Islamic Lease) - Qatar            │
│                                                                      │
│ [View Mode] [Edit Mode] [Export] [Save]                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│     START                                                            │
│       │                                                              │
│       ▼                                                              │
│  ┌────────────────┐                                                 │
│  │ 1. SSB Approval│  🔴 HARD GATE                                  │
│  │ Duration: 14d  │                                                 │
│  │ Role: SCO      │                                                 │
│  └────────┬───────┘                                                 │
│           │                                                          │
│           ▼                                                          │
│  ┌────────────────────┐                                            │
│  │ 2. Asset Ownership │  🔴 HARD GATE                              │
│  │ Verification       │                                             │
│  │ Duration: 3d       │                                             │
│  │ Role: Legal        │                                             │
│  └────────┬───────────┘                                             │
│           │                                                          │
│           ├─────────────────┬─────────────────┐                    │
│           │                 │                 │                     │
│           ▼                 ▼                 ▼                     │
│    ┌──────────┐      ┌──────────┐     ┌──────────┐                │
│    │ 3a. SCF  │      │ 3b. SNCR │     │ 3c. Asset│                │
│    │ Ex-Ante  │      │ Register │     │ Delivery │  🔴 HARD GATE  │
│    │ Review   │      │ Setup    │     │          │                 │
│    │ 5d       │      │ 3d       │     │ 2d       │                 │
│    └────┬─────┘      └────┬─────┘     └────┬─────┘                │
│         │                 │                 │                       │
│         └─────────────────┴─────────────────┘                      │
│                           │                                         │
│                           ▼                                         │
│                   ┌──────────────┐                                 │
│                   │ 4. Financial │                                  │
│                   │ Reporting    │                                  │
│                   │ AAOIFI FAS   │                                  │
│                   │ Duration: 5d │                                  │
│                   └──────┬───────┘                                  │
│                          │                                          │
│                          ▼                                          │
│                   ┌──────────────┐                                 │
│                   │ 5. QCB       │                                  │
│                   │ Regulatory   │                                  │
│                   │ Reporting    │                                  │
│                   │ Duration: 4d │                                  │
│                   └──────┬───────┘                                  │
│                          │                                          │
│                          ▼                                          │
│                        END                                          │
│                                                                      │
│  Legend:                                                            │
│  🔴 Hard Gate - Cannot proceed until complete                      │
│  ⚪ Regular Step - Can be done in parallel                         │
│  ├─ Parallel Tasks - Can execute simultaneously                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Proposed Solution

### Option 1: React Flow (Recommended)
**Library**: `reactflow` (https://reactflow.dev)
**Why**: Modern, well-maintained, great for custom workflows
**Features**:
- ✅ Drag-and-drop nodes
- ✅ Custom node types (hard gate, approval, upload, etc.)
- ✅ Auto-layout algorithms
- ✅ Mini-map for large workflows
- ✅ Zoom/pan controls
- ✅ Export to PNG/SVG
- ✅ TypeScript support
- ✅ Mobile-friendly

**Pros**:
- More flexible than BPMN.js
- Easier to customize node appearance
- Better performance for complex workflows
- Modern React component

**Cons**:
- Not standard BPMN notation
- Need to build validation logic ourselves

### Option 2: BPMN.js (Standard Compliance)
**Library**: `bpmn-js` (https://bpmn.io)
**Why**: Standard BPMN 2.0 notation, industry-standard
**Features**:
- ✅ Full BPMN 2.0 support
- ✅ Standard notation (gateways, tasks, events)
- ✅ Export to BPMN XML
- ✅ Import existing BPMN diagrams
- ✅ Modeler and viewer modes

**Pros**:
- Industry-standard notation
- Interoperable with other BPMN tools
- Built-in validation
- Export to executable BPMN

**Cons**:
- Steeper learning curve
- Less flexible UI
- Harder to customize for Islamic finance concepts
- Larger bundle size

### Recommended: React Flow + Custom Nodes

**Rationale**:
1. **Plain English**: We want "SSB Approval" not "User Task"
2. **Islamic Finance Specific**: Hard gates, Shariah approval, evidence upload
3. **User-Friendly**: Non-technical users should understand it
4. **Flexible**: Can add custom features (AI reasoning, evidence preview)

---

## Implementation Plan

### Phase 1.4: Visual Workflow Viewer (3-4 days)
**Goal**: Read-only visualization of generated workflows

**Tasks**:
1. Install React Flow library
2. Create custom node types:
   - Task node (regular step)
   - Hard gate node (critical step)
   - Approval node (requires approval)
   - Parallel node (multiple paths)
3. Convert workflow data to React Flow format
4. Add auto-layout (dagre or elkjs)
5. Add controls (zoom, pan, mini-map)
6. Replace "Workflow Review" list with visual diagram

**Custom Node Types**:

```typescript
// Task Node (Regular Step)
{
  id: 'step-1',
  type: 'taskNode',
  data: {
    label: 'Prepare Product Proposal',
    duration: '3 days',
    role: 'Shariah Compliance Officer',
    priority: 'high',
    evidenceRequired: 2,
    policyReference: 'AAOIFI GS-1 §6/1'
  },
  position: { x: 100, y: 100 }
}

// Hard Gate Node (Critical Step)
{
  id: 'step-2',
  type: 'hardGateNode',
  data: {
    label: 'Asset Ownership Verification',
    duration: '3 days',
    role: 'Legal / Asset Management',
    priority: 'critical',
    gateReason: 'AAOIFI SS-9 §3/1: Must own asset before leasing',
    cannotProceedUntil: true
  },
  position: { x: 100, y: 200 }
}

// Approval Node
{
  id: 'step-3',
  type: 'approvalNode',
  data: {
    label: 'SSB Approval',
    approver: 'Shariah Supervisory Board',
    duration: '14 days',
    priority: 'critical',
    requiresEvidence: true
  },
  position: { x: 100, y: 300 }
}
```

**Files**:
- `src/components/workflow/ReactFlowDiagram.tsx` (new)
- `src/components/workflow/nodes/TaskNode.tsx` (new)
- `src/components/workflow/nodes/HardGateNode.tsx` (new)
- `src/components/workflow/nodes/ApprovalNode.tsx` (new)
- `src/lib/workflow-layout/toReactFlow.ts` (converter)
- `src/app/islamic-grc-demo/configure/workflow-review/page.tsx` (update)

**Estimated Time**: 3-4 days

---

### Phase 1.5: Visual Workflow Editor (4-5 days)
**Goal**: Allow users to modify workflows visually

**Tasks**:
1. Add edit mode toggle
2. Enable drag-and-drop step reordering
3. Add step creation panel (drag new steps)
4. Enable step deletion (with confirmation)
5. Enable step editing (click to edit properties)
6. Add validation (hard gates can't be removed)
7. Add save/cancel buttons
8. Convert visual changes back to workflow data
9. Show preview of changes

**Edit Mode Features**:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Workflow Editor - Ijarah (Islamic Lease) - Qatar                   │
│                                                                      │
│ [📋 View Mode] [✏️ Edit Mode] [💾 Save] [❌ Cancel] [🔄 Reset]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ 📦 Add Steps (Drag to Canvas):                                     │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                      │
│ │ 📋 Task    │ │ 🔴 Hard    │ │ ✅ Approval│                      │
│ │            │ │ Gate       │ │            │                      │
│ └────────────┘ └────────────┘ └────────────┘                      │
│                                                                      │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                      │
│ │ 📤 Upload  │ │ 🔍 Review  │ │ ⚡ Parallel│                      │
│ │ Evidence   │ │            │ │ Split      │                      │
│ └────────────┘ └────────────┘ └────────────┘                      │
│                                                                      │
│ Canvas: (Drag steps to reorder)                                    │
│                                                                      │
│     [Current workflow visualization...]                             │
│                                                                      │
│ ⚠️ Changes Preview:                                                │
│ • Added: "Takaful Coverage Setup" (Step 4)                         │
│ • Removed: "SNCR Register Setup" (was Step 5)                      │
│ • Reordered: "Financial Reporting" moved from Step 7 to Step 6     │
│                                                                      │
│ [💾 Save Changes] [❌ Cancel]                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Validation Rules**:
1. ❌ Cannot remove hard gates (shows warning)
2. ⚠️ Reordering hard gates shows warning
3. ✅ Can add optional steps
4. ✅ Can remove non-required steps
5. ✅ Can reorder non-dependent steps
6. ⚠️ Moving a step before its dependency shows warning

**Files**:
- `src/components/workflow/WorkflowEditor.tsx` (new)
- `src/components/workflow/StepPalette.tsx` (drag panel)
- `src/components/workflow/StepPropertiesPanel.tsx` (edit properties)
- `src/lib/workflow-layout/fromReactFlow.ts` (convert back)
- `src/lib/workflow-validation/validateWorkflow.ts` (validation)

**Estimated Time**: 4-5 days

---

### Phase 1.6: Workflow Templates Library (2-3 days)
**Goal**: Browse and use pre-built workflow templates

**Tasks**:
1. Create workflow template gallery
2. Add template previews (thumbnails)
3. Enable template import
4. Enable template customization
5. Add template export/sharing
6. Add community templates (optional)

**Template Gallery**:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Workflow Template Library                                          │
│                                                                      │
│ 🔍 Search templates...                                             │
│ 📁 Categories: [Qatar] [UAE] [Saudi] [All]                         │
│ 🏷️  Products: [Ijarah] [Murabaha] [Mudaraba] [All]                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│ │ Qatar Ijarah    │  │ Qatar Murabaha  │  │ Qatar Mudaraba  │    │
│ │ [Thumbnail]     │  │ [Thumbnail]     │  │ [Thumbnail]     │    │
│ │                 │  │                 │  │                 │    │
│ │ 9 steps         │  │ 8 steps         │  │ 7 steps         │    │
│ │ 3 hard gates    │  │ 2 hard gates    │  │ 2 hard gates    │    │
│ │ 35 days         │  │ 28 days         │  │ 21 days         │    │
│ │                 │  │                 │  │                 │    │
│ │ [Preview]       │  │ [Preview]       │  │ [Preview]       │    │
│ │ [Use Template]  │  │ [Use Template]  │  │ [Use Template]  │    │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                      │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│ │ UAE Ijarah      │  │ Saudi Ijarah    │  │ Generic SNCR    │    │
│ │ [Thumbnail]     │  │ [Thumbnail]     │  │ Monitoring      │    │
│ │                 │  │                 │  │ [Thumbnail]     │    │
│ │ 8 steps         │  │ 10 steps        │  │ 1 step          │    │
│ │ 2 hard gates    │  │ 4 hard gates    │  │ 0 hard gates    │    │
│ │ 30 days         │  │ 42 days         │  │ Daily           │    │
│ │                 │  │                 │  │                 │    │
│ │ [Preview]       │  │ [Preview]       │  │ [Preview]       │    │
│ │ [Use Template]  │  │ [Use Template]  │  │ [Use Template]  │    │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

**Files**:
- `src/app/islamic-grc-demo/templates/page.tsx` (new)
- `src/components/workflow/TemplateCard.tsx` (new)
- `src/components/workflow/TemplatePreview.tsx` (new)
- `src/lib/workflow-templates/registry.ts` (template catalog)

**Estimated Time**: 2-3 days

---

## Integration with Current System

### Current Workflow Generation Flow:
```
1. User configures: Qatar + Ijarah
2. assembleWorkflows(config) loads JSON modules
3. Generates Workflow object with steps
4. User sees text list in "Workflow Review"
5. User clicks "Deploy Workflows"
6. generateTasksFromWorkflows(workflows) creates tasks
```

### New Flow with Visual Editor:
```
1. User configures: Qatar + Ijarah
2. assembleWorkflows(config) loads JSON modules
3. Generates Workflow object with steps
4. toReactFlow(workflow) converts to visual diagram  <-- NEW
5. User sees visual BPMN-style diagram             <-- NEW
6. [Optional] User clicks "Edit Mode"               <-- NEW
7. [Optional] User modifies workflow visually       <-- NEW
8. [Optional] fromReactFlow(diagram) updates workflow <-- NEW
9. User clicks "Deploy Workflows"
10. generateTasksFromWorkflows(workflows) creates tasks
```

### Key Integration Points:

**1. Workflow Review Page** - Replace text list with visual diagram
```typescript
// Before (Current)
<WorkflowStepsList steps={workflow.steps} />

// After (With Visual Editor)
<ReactFlowDiagram
  workflow={workflow}
  mode="view"  // or "edit"
  onSave={(updatedWorkflow) => saveWorkflow(updatedWorkflow)}
/>
```

**2. Workflow Data Structure** - No changes required!
```typescript
// Workflow type stays the same
interface Workflow {
  id: string
  name: string
  steps: WorkflowStep[]
  totalDurationDays: number
  criticalPath: string[]
}

// Just add visual layout data
interface WorkflowStep {
  // ... existing fields ...
  visualPosition?: { x: number, y: number }  // NEW (optional)
  visualConnections?: string[]  // NEW (optional, for custom connections)
}
```

**3. Auto-Layout** - Use dagre or elkjs to automatically position nodes
```typescript
import dagre from 'dagre'

function autoLayout(workflow: Workflow): ReactFlowNode[] {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB' })  // Top to bottom

  // Add nodes
  workflow.steps.forEach((step) => {
    g.setNode(step.id, { width: 200, height: 80 })
  })

  // Add edges (dependencies)
  workflow.steps.forEach((step, i) => {
    if (i > 0) {
      g.setEdge(workflow.steps[i-1].id, step.id)
    }
  })

  dagre.layout(g)

  // Convert to React Flow format
  return workflow.steps.map((step) => {
    const node = g.node(step.id)
    return {
      id: step.id,
      type: step.isHardGate ? 'hardGateNode' : 'taskNode',
      data: { ...step },
      position: { x: node.x, y: node.y }
    }
  })
}
```

---

## User Experience Improvements

### Before (Current):
```
Workflow Review Page:

Ijarah (Islamic Lease) - Qatar
Total Duration: 35 days

Steps:
1. SSB Approval (14 days) - Shariah Compliance Officer
2. Asset Ownership Verification (3 days) - Legal
3. SCF Ex-Ante Review (5 days) - Shariah Compliance Officer
4. SNCR Register Setup (3 days) - Shariah Compliance Officer
5. Asset Delivery (2 days) - Operations Manager
6. Financial Reporting (5 days) - Finance Manager
7. QCB Reporting (4 days) - Compliance Manager

[Deploy Workflows]
```

**Problems**:
- ❌ Can't see which steps run in parallel
- ❌ Can't see dependencies
- ❌ Can't see critical path
- ❌ Can't understand why this sequence
- ❌ Can't modify without editing JSON

### After (With Visual Editor):
```
Workflow Review Page:

[Visual BPMN Diagram showing flow]

Controls:
├─ [🔍 Zoom In/Out]
├─ [🗺️ Mini-Map]
├─ [📸 Export PNG]
├─ [✏️ Edit Mode]
└─ [💾 Save as Template]

Info Panel:
├─ Total Duration: 35 days
├─ Total Steps: 9
├─ Hard Gates: 3
├─ Critical Path: 5 steps
└─ Estimated Completion: 2025-12-15

[Deploy Workflows]
```

**Benefits**:
- ✅ Visual understanding of flow
- ✅ See parallel execution paths
- ✅ Understand dependencies
- ✅ Identify bottlenecks
- ✅ Modify workflows visually
- ✅ Share/export diagrams

---

## Technical Stack

**Dependencies**:
```json
{
  "reactflow": "^11.10.0",
  "dagre": "^0.8.5",
  "@types/dagre": "^0.7.52"
}
```

**Optional (for BPMN export)**:
```json
{
  "bpmn-moddle": "^8.1.0"  // If we want to export BPMN XML later
}
```

**Bundle Size Impact**:
- React Flow: ~300KB (gzipped ~100KB)
- Dagre: ~50KB (gzipped ~20KB)
- Total: ~350KB uncompressed (~120KB gzipped)

---

## Implementation Priority

### High Priority (Phase 1.4 - Viewer)
**Why**: Helps users understand workflows immediately
**Estimated Time**: 3-4 days
**Impact**: High - Much clearer than text lists

### Medium Priority (Phase 1.5 - Editor)
**Why**: Allows workflow customization without JSON editing
**Estimated Time**: 4-5 days
**Impact**: Medium - Advanced users will love it

### Lower Priority (Phase 1.6 - Template Gallery)
**Why**: Nice-to-have for exploring templates
**Estimated Time**: 2-3 days
**Impact**: Low - Can defer until we have more templates

**Total Time (All Phases)**: 9-12 days

---

## Questions for User

Before proceeding, please clarify:

1. **Priority**: Which phase should we do first?
   - Option A: Visual viewer only (Phase 1.4, 3-4 days)
   - Option B: Full editor (Phases 1.4 + 1.5, 7-9 days)
   - Option C: Everything including templates (Phases 1.4 + 1.5 + 1.6, 9-12 days)

2. **Editing Scope**: How much editing should users be able to do?
   - Read-only visualization (safe, simple)
   - Reorder steps only (medium complexity)
   - Add/remove/edit steps (full flexibility, higher complexity)

3. **Template System**: Should we focus on:
   - Visual editor first, templates later
   - Templates first, editor later
   - Both together

4. **Integration Point**: When should users see the visual workflow?
   - Step 2: Workflow Review (current)
   - New "Workflow Designer" page (before configuration)
   - Both places

5. **Export Format**: What should users be able to export?
   - PNG image only
   - PNG + SVG
   - PNG + SVG + BPMN XML (standard format)
   - PNG + SVG + JSON (our format)

6. **Auto-Layout vs Manual**: Should workflows be:
   - Always auto-laid out (simple, consistent)
   - Manual positioning saved (flexible, but users must position)
   - Hybrid (auto-layout with manual adjustments)

---

## Next Steps

1. Get your answers to the 6 questions above
2. Decide where visual editor fits in overall plan:
   - Before task card redesign?
   - After task card redesign?
   - Before or after control library?
3. Create interactive prototype
4. Begin implementation

**Note**: Visual workflow editor is a major enhancement that will make workflows much more understandable and configurable, especially for non-technical users and stakeholders!
