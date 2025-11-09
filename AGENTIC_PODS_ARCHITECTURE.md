# Agentic Pods Architecture

## Overview

The Qatar Ijārah demo implements **Agentic Pods** - specialized AI agents that assist humans with GRC (Governance, Risk, Compliance) tasks following the **HITL-first** (Human-In-The-Loop) pattern.

**Core Principle:** Pods **propose**, humans **approve**, system **executes**.

## Architecture Principles

### 1. **L1 Autonomy: Propose-Only**

All pods operate at **Level 1 autonomy**:
- ✅ **DO:** Analyze data, run rules, generate recommendations
- ❌ **DON'T:** Execute side effects without human approval
- 🛡️ **Safety:** Fail-safe mode - deny/block on uncertainty

### 2. **KISS 4-Step Workflow**

Every pod follows the exact same pattern:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1. INTAKE                                         │
│     └─ Validate inputs                            │
│     └─ List missing items                         │
│                                                     │
│  2. EVALUATE                                       │
│     └─ Run deterministic rules                    │
│     └─ Calculate values                           │
│     └─ Reference evidence                         │
│                                                     │
│  3. PROPOSE                                        │
│     └─ Single clear recommendation                │
│     └─ Reasons + evidence refs                    │
│     └─ Next actions                               │
│                                                     │
│  4. HITL (Human-In-The-Loop)                      │
│     └─ Present to approver(s)                     │
│     └─ Await approval/rejection                   │
│     └─ Execute only after approval                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. **ControlPack Driven**

- All rules come from pre-compiled **ControlPacks** (see `ijarah-controls.ts`)
- **No runtime policy invention** - ensures auditability
- Controls map to regulatory requirements (QFCRA, QCB, AAOIFI)

### 4. **Clear RACI**

Each pod has defined approvers:

| Pod | Approver(s) | Escalation |
|-----|------------|------------|
| Evidence Intake | Evidence Custodian | Control Owner |
| CCM Monitoring | Control Owner | CRO |
| Gatekeeping | Product Owner + SCO | SSB |
| SNCR Triage | SCO + Finance Controller + SSB | Board |
| Segregated Funds | CFO/COO | Audit Committee |
| Counterparty Screening | Onboarding Officer + SCO | Compliance Head |
| Shariah Committee | SSB Secretary + Chair | N/A |
| Regulatory Reporting | Head of Compliance + Signatory | CEO |
| Audit Binder | Internal Audit Lead | External Auditor |
| RCSA Health | CRO + Control Owners | Risk Committee |
| Training | HR + Compliance PM | CPO |

## Pod Categories

### Event-Driven Pods (6)

React to real-time events:

1. **Evidence Intake & Checklist** (`evidence-intake`)
   - Trigger: Document uploaded
   - Action: OCR → validate → hash → checklist
   - Output: Evidence bundle ready for approval

2. **Continuous Controls Monitoring** (`ccm-monitoring`)
   - Trigger: Transaction/payment/milestone event
   - Action: Run control test logic
   - Output: Pass/warn/fail findings

3. **Product/Process Gatekeeping** (`gatekeeping`)
   - Trigger: User attempts gated action
   - Action: Check preconditions
   - Output: ALLOW/DENY + reasons

4. **SNCR Triage & Purification** (`sncr-triage`)
   - Trigger: Critical Shariah control failure
   - Action: Classify, calculate exposure/purification
   - Output: SNCR case + rectification tasks

5. **Segregated Funds / Escrow** (`segregated-funds`)
   - Trigger: Bank event or disbursement request
   - Action: Validate against whitelists + retention rules
   - Output: Approve/block proposal

6. **Counterparty & Instrument Screening** (`counterparty-screening`)
   - Trigger: Onboarding or sanctions list update
   - Action: Screen against sanctions + Shariah rules
   - Output: Pass/fail + cure tasks

### Scheduled Pods (5)

Run on cadence:

7. **Shariah Committee e-Pack** (`shariah-committee`)
   - Cadence: Weekly/Monthly
   - Action: Assemble meeting packs + draft resolutions
   - Output: E-pack ready for SSB review

8. **Regulatory Reporting** (`regulatory-reporting`)
   - Cadence: Monthly/Quarterly/Annual
   - Action: Generate submissions (QCB, QFCRA)
   - Output: Validated reports ready for e-sign

9. **Audit Binder** (`audit-binder`)
   - Cadence: Monthly + ad-hoc
   - Action: Build binders + draft RFI responses
   - Output: Hash-verified binder

10. **RCSA & Control Health** (`rcsa-health`)
    - Cadence: Quarterly
    - Action: Analyze control effectiveness
    - Output: Top 5 tuning recommendations

11. **Training & Attestation** (`training-attestation`)
    - Cadence: Monthly
    - Action: Assign trainings based on failure patterns
    - Output: Training assignments + attestation tracking

## File Structure

```
src/lib/qatar-ijarah/
├── pod-types.ts              # Type definitions for all pods
├── pod-components.tsx         # Reusable UI components
├── pod-orchestrator.ts        # Orchestration logic (future)
└── pods/
    ├── evidence-intake.ts     # Pod #1 implementation
    ├── ccm-monitoring.ts      # Pod #2 implementation
    ├── gatekeeping.ts         # Pod #3 implementation
    └── ...

src/app/qatar-ijarah/
├── ai-control-center/        # Scene 9: AI Control Center
│   └── page.tsx
└── [existing scenes]/
    └── page.tsx              # Enhanced with pod integrations
```

## Standard Pod Output Format

All pods return this JSON structure:

```typescript
{
  status: 'proposed' | 'blocked' | 'approved' | 'rejected',
  recommendation: 'ALLOW' | 'DENY' | 'OPEN_CASE' | 'RELEASE' | 'HOLD',
  reasons: [
    "Completion certificate verified (hash: 8f3a2b...)",
    "Occupancy permit uploaded and validated",
    "All 4 evidence items present"
  ],
  evidence_refs: [
    "/evidence/completion-cert-unit-12.pdf",
    "/evidence/occupancy-permit-unit-12.pdf"
  ],
  next_actions: [
    "Approve to unlock rent gate",
    "Review auto-adjustment calculation"
  ],
  time_saved: "9 minutes 30 seconds",
  confidence: 98
}
```

If blocked:

```typescript
{
  status: 'blocked',
  recommendation: 'DENY',
  reasons: [
    "Missing required evidence"
  ],
  missing_items: [
    "Completion certificate",
    "Lessor title verification"
  ],
  next_actions: [
    "Upload completion certificate",
    "Provide lessor title document"
  ]
}
```

## Integration Pattern

### Step 1: Import Pod Types

```typescript
import type {
  PodOutput,
  EvidenceIntakePodInput,
  EvidenceIntakePodOutput
} from '@/lib/qatar-ijarah/pod-types'
```

### Step 2: Simulate Pod Execution

```typescript
const [podState, setPodState] = useState<'idle' | 'thinking' | 'proposing'>('idle')
const [podOutput, setPodOutput] = useState<EvidenceIntakePodOutput | null>(null)

const runEvidenceIntakePod = async () => {
  setPodState('thinking')

  // Simulate 3-second analysis
  await new Promise(resolve => setTimeout(resolve, 3000))

  setPodState('proposing')
  setPodOutput({
    status: 'proposed',
    recommendation: 'APPROVE',
    reasons: [
      'OCR extracted 12 fields with 98% confidence',
      'Completion certificate verified',
      'Hash: 8f3a2b...'
    ],
    evidence_refs: ['/evidence/completion-cert.pdf'],
    next_actions: ['Approve to add to evidence bundle'],
    time_saved: '8 minutes',
    confidence: 98,
    evidence_bundle: {
      manifest: [...],
      checklist_status: { total: 4, complete: 4, missing: [] }
    }
  })
}
```

### Step 3: Display Pod UI

```typescript
<PodCard
  podId="evidence-intake"
  status={podState}
  output={podOutput}
  onApprove={handleApprove}
  onReject={handleReject}
/>
```

## UI Components

### Pod Card

Standard card showing pod status and proposal:

```tsx
<Card className="border-2 border-blue-200">
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3>🤖 Evidence Intake Pod</h3>
      <Badge>Proposing</Badge>
    </div>
  </CardHeader>
  <CardContent>
    {/* Thinking animation */}
    {status === 'thinking' && <ThinkingSpinner />}

    {/* Proposal */}
    {status === 'proposing' && (
      <ProposalView
        recommendation={output.recommendation}
        reasons={output.reasons}
        confidence={output.confidence}
        timeSaved={output.time_saved}
      />
    )}

    {/* Action buttons */}
    <div className="flex space-x-2">
      <Button onClick={onApprove}>Approve</Button>
      <Button variant="outline" onClick={onReject}>Reject</Button>
    </div>
  </CardContent>
</Card>
```

### Before/After Metrics

```tsx
<MetricsComparison
  before={{
    steps: ['Upload', 'Manual review', 'Data entry', 'Cross-check', 'Approval'],
    time: '11.5 minutes',
    errors: '~5% human error rate'
  }}
  after={{
    steps: ['Upload', 'Pod analyzes', 'Approve'],
    time: '30 seconds',
    errors: '<0.1% error rate'
  }}
  savings={{
    time: '95%',
    accuracy: '+4.9%'
  }}
/>
```

## Metrics & Monitoring

Each pod tracks:

- **Executions:** Total, proposed, approved, rejected, blocked, errors
- **Performance:** Avg duration, avg confidence, approval rate
- **Impact:** Time saved, cases handled, controls tested, evidence processed

Displayed in Scene 8 (GRC Dashboard) and Scene 9 (AI Control Center).

## Safety & Guardrails

### Fail-Safe Defaults

```typescript
{
  autonomy_level: 'L1',          // Propose-only
  fail_safe: true,               // Deny on uncertainty
  default_on_missing: 'deny',    // Block if inputs incomplete
  deterministic: true            // No runtime policy invention
}
```

### Audit Trail

Every pod execution creates:
- Unique `execution_id`
- `initiated_by` (user ID)
- `initiated_at` / `completed_at` timestamps
- Full input/output log
- Approval/rejection record

### Error Handling

```typescript
{
  status: 'error',
  error: {
    code: 'OCR_CONFIDENCE_LOW',
    message: 'OCR confidence 45% below threshold of 80%',
    recoverable: true  // User can re-upload higher quality scan
  },
  next_actions: [
    'Upload higher resolution scan',
    'Manually enter fields'
  ]
}
```

## Extending the System

### Adding a New Pod

1. **Define types** in `pod-types.ts`:
```typescript
export interface MyNewPodInput { ... }
export interface MyNewPodOutput extends PodOutput { ... }
```

2. **Add to registry**:
```typescript
export const POD_REGISTRY: Record<PodId, PodDefinition> = {
  'my-new-pod': {
    id: 'my-new-pod',
    name: 'My New Pod',
    category: 'event-driven',
    autonomy_level: 'L1',
    ...
  }
}
```

3. **Create implementation** in `pods/my-new-pod.ts`:
```typescript
export async function executeMyNewPod(
  input: MyNewPodInput,
  context: PodContext
): Promise<MyNewPodOutput> {
  // 1. Intake
  // 2. Evaluate
  // 3. Propose
  // 4. Return (HITL happens in UI)
}
```

4. **Add UI component** in scene or control center

### Best Practices

✅ **DO:**
- Follow the KISS 4-step workflow
- Return standard JSON output
- Reference ControlPack for rules
- Track metrics
- Provide clear reasons
- Include time-saved estimates

❌ **DON'T:**
- Execute side effects without approval
- Invent policy at runtime
- Skip validation
- Hide uncertainty
- Assume inputs are valid
- Auto-approve L1 pods

## Demo Scenarios

### Scenario 1: Evidence Upload (Pod #1)

```
User uploads completion certificate PDF
  ↓
Evidence Intake Pod activates
  ↓
[3 seconds - thinking animation]
  ↓
Pod proposes: "APPROVE - 12 fields extracted, 98% confidence"
  ↓
User clicks "Approve"
  ↓
Evidence added to bundle, checklist updated
  ↓
Time saved: 8 minutes vs manual data entry
```

### Scenario 2: Rent Gate Check (Pod #3)

```
User clicks "Activate Rent Billing"
  ↓
Gatekeeping Pod checks preconditions
  ↓
[2 seconds - evaluating]
  ↓
Pod proposes: "DENY - 3/4 evidence items complete, missing: Lessor Title"
  ↓
User sees missing items list
  ↓
Uploads lessor title
  ↓
Pod re-evaluates → "APPROVE"
  ↓
User approves → Rent billing activated
```

### Scenario 3: Control Monitoring (Pod #2)

```
Payment received (event)
  ↓
CCM Pod runs 5 relevant controls
  ↓
[1 second - testing]
  ↓
All PASS except IJR-A3 (late payment detected)
  ↓
Pod creates finding: "7 days late, QAR 700 penalty → charity"
  ↓
Triggers SNCR Triage Pod (Pod #4)
  ↓
SNCR Pod proposes charity allocation
  ↓
SCO approves → Penalty to Qatar Charity
```

## Performance Targets

- **Evidence Intake:** < 5 seconds (vs 10 minutes manual)
- **Gatekeeping:** < 3 seconds (vs 5 minutes review)
- **CCM:** < 1 second per control (vs 40 minutes daily review)
- **SNCR Triage:** < 10 seconds (vs 2 hours analysis)

**Overall Impact:** 95% time savings across GRC workflows

## Future Enhancements

### Phase 2: Real Orchestration
- LangGraph integration for multi-pod workflows
- Real MCP tool calling (not mocked)
- Claude Agent SDK integration

### Phase 3: L2 Autonomy (Selective)
- Low-risk actions auto-execute with human monitor
- High-risk still requires HITL
- Confidence-based gating

### Phase 4: Learning
- Track approval/rejection patterns
- Tune confidence thresholds
- Suggest control improvements

## References

- `src/lib/qatar-ijarah/pod-types.ts` - Type definitions
- `src/lib/qatar-ijarah/ijarah-controls.ts` - ControlPack (15 controls)
- `src/app/qatar-ijarah/ai-control-center/page.tsx` - Scene 9
- `PLUGGABLE_ARCHITECTURE.md` - Overall architecture
- `GRC_FIRST_PRINCIPLES_GAP_ANALYSIS.md` - GRC requirements

---

**Version:** 1.0
**Last Updated:** 2025-11-09
**Status:** ✅ Foundation Complete
