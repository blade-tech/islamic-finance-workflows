# AG-UI Conversational Flow Implementation Plan

**Status**: Component Created - Integration Paused
**Date**: 2025-11-07
**Context**: Implementing ARCHITECTURE_SESSION_FINDINGS.md recommendations

---

## Executive Summary

Following the architectural session findings, I've created a conversational interface component that implements the AG-UI protocol to replace the current 5-step form-based workflow (Steps 2-6) with a single agent-guided conversation. This document outlines what's been created and the plan for full integration.

### Key User Feedback
> "we don't need to have 10 steps, in fact we should reduce steps where possible as this is a AG-UI protocol aligned UI that doesn't need to adhere to traditional cluttered dashboard with navigation nightmare problems"

### Architectural Goal
- **Current**: 12 steps (0-11) with 5 separate form steps for configuration (Steps 2-6)
- **Target**: Reduce to ~3-4 steps with conversational configuration replacing form steps
- **Benefit**: Natural interaction, progressive disclosure, real-time control activation feedback

---

## What's Been Created

### 1. Step2ConversationalConfig Component
**File**: `src/components/workflow/steps/Step2ConversationalConfig.tsx`

**Features Implemented**:
- ✅ Conversational chat interface with agent (Bot) and user messages
- ✅ 12-Question Minimum Viable Questionnaire (MVQ) flow
- ✅ Suggested response buttons for quick answers
- ✅ Real-time control activation matrix display (shows which controls activate as user answers)
- ✅ Live bucket score preview (5 buckets with control counts)
- ✅ Progress indicator (X/12 questions answered)
- ✅ TypeScript types for `DealConfiguration` (12 question responses)
- ✅ Simulated agent response logic (TODO: Replace with actual Claude API call)
- ✅ Control activation logic (simplified - TODO: Implement full matrix from architecture docs)

**Architecture Pattern**:
```typescript
// Domain 1: Product & Structure (3 questions)
productType: 'Sukuk' | 'Murabaha' | 'Ijara' | 'Musharaka' | 'Mudaraba' | 'Istisna' | 'Salam' | 'Wakala'
sustainabilityOverlay: 'None' | 'GBP' | 'SBP' | 'SLB' | 'Transition'
dealComplexity: 'Simple' | 'Medium' | 'Complex'

// Domain 2: Jurisdiction & Regulatory (3 questions)
primaryJurisdiction: string
crossBorder: 'No' | 'Yes - Investor base' | 'Yes - Asset location' | 'Yes - Both'
listingStatus: 'Private' | 'Public'

// Domain 3: Risk Profile (2 questions)
counterpartyRisk: 'Low' | 'Medium' | 'High'
fundingModel: 'Fixed maturity' | 'IAH' | 'Line of credit'

// Domain 4: Governance & Assurance (3 questions)
shariahGovernance: 'Full SSB+Review+Audit' | 'SSB+Review only' | 'SSB only'
internalAudit: 'Yes (in-house)' | 'Yes (outsourced)' | 'No'
externalAudit: 'Yes (regulatory)' | 'Yes (voluntary)' | 'No'

// Domain 5: Accounting (1 question)
accountingFramework: 'AAOIFI FAS' | 'IFRS' | 'Local GAAP' | 'Hybrid'
```

**UI Layout**:
- **Left (2/3 width)**: Chat interface with scrollable message history
- **Right (1/3 width)**: Live control activation matrix showing:
  - 5 buckets with control counts
  - Individual control activations with reasons
  - Configuration progress bar
  - Completion alert when all 12 questions answered

---

## Integration Plan (When Ready)

### Phase 1: Update WorkflowContainer (Estimated: 1 hour)

**Current Structure** (`src/components/workflow/WorkflowContainer.tsx:64-77`):
```typescript
const STEPS = [
  { index: 0, title: 'Overview', component: OverviewScreen },
  { index: 1, title: 'Connect Sources', component: Step1SourceConnection },
  // OLD: 5 separate form steps (to be replaced)
  { index: 2, title: 'Select Shariah Structure', component: Step2SelectShariahStructure },
  { index: 3, title: 'Select Jurisdiction', component: Step3SelectJurisdiction },
  { index: 4, title: 'Select Accounting', component: Step4SelectAccounting },
  { index: 5, title: 'Select Impact Metrics', component: Step5SelectImpact },
  { index: 6, title: 'Review Configuration', component: Step6ReviewConfiguration },
  // Remaining steps
  { index: 7, title: 'Configure Details', component: Step7ConfigureDetails },
  { index: 8, title: 'Review Policy Structure', component: Step8ReviewPolicyStructure },
  { index: 9, title: 'Test Workflow', component: Step3TestWorkflow },
  { index: 10, title: 'Live Execution', component: Step10LiveExecution },
  { index: 11, title: 'Monitor & Collaborate', component: Step11MonitorCollaborate },
]
```

**New Structure** (Proposed):
```typescript
const STEPS = [
  { index: 0, title: 'Overview', component: OverviewScreen },
  { index: 1, title: 'Connect Sources', component: Step1SourceConnection },
  // NEW: Single conversational configuration (replaces Steps 2-6)
  { index: 2, title: 'Configure Deal', component: Step2ConversationalConfig },
  // Keep existing policy review/test/execution steps
  { index: 3, title: 'Review Policy Structure', component: Step8ReviewPolicyStructure },
  { index: 4, title: 'Test Workflow', component: Step3TestWorkflow },
  { index: 5, title: 'Live Execution', component: Step10LiveExecution },
  { index: 6, title: 'Monitor & Collaborate', component: Step11MonitorCollaborate },
]
```

**Changes Required**:
1. Replace Steps 2-6 with single `Step2ConversationalConfig`
2. Update step indices (7 steps instead of 12)
3. Update progress calculation (`progressPercentage` formula)
4. Update step validation logic (`canGoNext` switch statement)
5. Import new component at top of file

**Migration Strategy**:
- Option A: Hard cutover (remove old steps entirely)
- Option B: Feature flag (allow switching between old and new approach)
- Option C: Keep old steps but hide them (preserve for reference)

**Recommendation**: Option A (hard cutover) - cleanest approach, aligns with architectural vision

### Phase 2: Update Zustand Store (Estimated: 30 minutes)

**Current State** (`src/lib/store.ts:36`):
- Already imports `DealConfiguration` type ✅
- Has `buildDealConfiguration()` method for 4-component approach
- Individual setters for each component (`setShariahStructure`, `setJurisdiction`, etc.)

**Changes Required**:
1. Add new action: `setDealConfiguration: (config: DealConfiguration) => void`
2. Update `execution.dealConfiguration` field to support 12-question config
3. Optionally deprecate individual component setters (or keep for backward compatibility)

**Implementation**:
```typescript
// Add to WorkflowStore interface (around line 154)
/** Set complete deal configuration from conversational flow */
setDealConfiguration: (config: DealConfiguration) => void

// Add to store implementation (around line 600)
setDealConfiguration: (config) =>
  set((state) => {
    if (!state.execution) return state

    return {
      execution: {
        ...state.execution,
        dealConfiguration: config,
      },
    }
  }),
```

### Phase 3: Integrate Claude API for Real Agent Responses (Estimated: 2-3 hours)

**Current State**: Simulated responses with hardcoded logic
**Target**: Real Claude API calls using AG-UI streaming

**Implementation Approach**:
```typescript
// Create new service: src/lib/services/conversational-agent.ts
import { backendClient } from '@/lib/backend-client'

export async function askAgent(
  userMessage: string,
  currentConfig: DealConfiguration,
  conversationHistory: ChatMessage[]
): Promise<{ agentResponse: string; suggestedResponses: string[] }> {

  // Option A: Use backend API with Claude SDK
  const response = await backendClient.chatWithAgent({
    message: userMessage,
    context: {
      config: currentConfig,
      history: conversationHistory,
      questionNumber: getCurrentQuestionNumber(currentConfig),
    },
  })

  return {
    agentResponse: response.message,
    suggestedResponses: response.suggestions || [],
  }
}

function getCurrentQuestionNumber(config: DealConfiguration): number {
  let answered = 0
  if (config.productType) answered++
  if (config.sustainabilityOverlay) answered++
  if (config.dealComplexity) answered++
  // ... continue for all 12 questions
  return answered + 1
}
```

**System Prompt for Agent**:
```
You are an AI compliance advisor for Islamic finance. Your role is to guide users through configuring their deal by asking 12 strategic questions. The questions follow this structure:

Domain 1: Product & Structure (3 questions)
- Q1: Product Type (Sukuk, Murabaha, Ijara, Musharaka, Mudaraba, Istisna, Salam, Wakala)
- Q2: Sustainability Overlay (None, GBP, SBP, SLB, Transition)
- Q3: Deal Complexity (Simple, Medium, Complex)

[... continue for all 5 domains]

Guidelines:
- Ask ONE question at a time conversationally
- Provide 2-5 suggested response buttons for quick answers
- Adapt follow-up questions based on previous answers (e.g., if user says "Sukuk", ask if it's asset-backed or equity-based)
- After each answer, explain which controls will be activated and why
- After all 12 questions, summarize the configuration and control activation matrix
- Be concise but friendly - avoid jargon unless the user demonstrates expertise
```

### Phase 4: Implement Full Control Activation Logic (Estimated: 2 hours)

**Current State**: Simplified activation logic with ~10 controls
**Target**: Full 26-control activation matrix from `ARCHITECTURE_SESSION_FINDINGS.md:152-194`

**Implementation**:
```typescript
// Create new utility: src/lib/control-activation.ts

export interface ControlActivation {
  controlId: string
  name: string
  bucket: number
  activated: boolean
  reason: string
}

export function activateControls(config: DealConfiguration): ControlActivation[] {
  const controls: ControlActivation[] = []

  // BUCKET 1: Shariah Governance (5 controls)
  controls.push(
    { controlId: 'SG-01', name: 'SSB Mandate', bucket: 1, activated: true, reason: 'Always required for Islamic finance' },
    { controlId: 'SG-03', name: 'Shariah Risk Management', bucket: 1, activated: true, reason: 'Required per AAOIFI GS-11' },
    { controlId: 'SG-05', name: 'SNC Handling', bucket: 1, activated: true, reason: 'Required per AAOIFI GS-1' }
  )

  if (config.shariahGovernance !== 'SSB only') {
    controls.push({
      controlId: 'SG-02',
      name: 'Shariah Review',
      bucket: 1,
      activated: true,
      reason: `Governance maturity: ${config.shariahGovernance}`,
    })
  }

  if (config.shariahGovernance === 'Full SSB+Review+Audit') {
    controls.push({
      controlId: 'SG-04',
      name: 'Shariah Audit',
      bucket: 1,
      activated: true,
      reason: 'Full governance maturity per AAOIFI GS-3',
    })
  }

  // BUCKET 2: Regulatory & Legal (5 controls)
  controls.push(
    { controlId: 'RL-01', name: 'Licensing', bucket: 2, activated: true, reason: `Required in ${config.primaryJurisdiction}` },
    { controlId: 'RL-02', name: 'AML/CFT', bucket: 2, activated: true, reason: 'Required per FATF 40 Recommendations' }
  )

  if (config.crossBorder && config.crossBorder.includes('Investor')) {
    controls.push({
      controlId: 'RL-03',
      name: 'Data Protection',
      bucket: 2,
      activated: true,
      reason: 'Cross-border investor base (GDPR/local laws)',
    })
  }

  if (config.listingStatus === 'Public') {
    controls.push({
      controlId: 'RL-04',
      name: 'Securities & Trustee',
      bucket: 2,
      activated: true,
      reason: 'Public listing requires securities compliance',
    })
  }

  if (config.crossBorder && config.crossBorder !== 'No') {
    controls.push({
      controlId: 'RL-05',
      name: 'Cross-Border Mapping',
      bucket: 2,
      activated: true,
      reason: `Cross-border exposure: ${config.crossBorder}`,
    })
  }

  // BUCKET 3: Risk Management (5 controls)
  if (config.counterpartyRisk !== 'Low') {
    controls.push({
      controlId: 'RM-01',
      name: 'Credit Risk',
      bucket: 3,
      activated: true,
      reason: `Counterparty risk: ${config.counterpartyRisk}`,
    })
  }

  if (config.dealComplexity !== 'Simple') {
    controls.push({
      controlId: 'RM-02',
      name: 'Operational Risk',
      bucket: 3,
      activated: true,
      reason: `Deal complexity: ${config.dealComplexity}`,
    })
  }

  if (config.fundingModel === 'IAH') {
    controls.push(
      {
        controlId: 'RM-03',
        name: 'Liquidity & RoR',
        bucket: 3,
        activated: true,
        reason: 'IAH funding model requires liquidity management per IFSB-12',
      },
      {
        controlId: 'RM-04',
        name: 'Displaced Commercial Risk',
        bucket: 3,
        activated: true,
        reason: 'IAH funding model requires DCR management per IFSB-1',
      }
    )
  }

  if (['Musharaka', 'Mudaraba'].includes(config.productType || '')) {
    controls.push({
      controlId: 'RM-05',
      name: 'SNC & Equity Risk',
      bucket: 3,
      activated: true,
      reason: `${config.productType} structure involves equity risk`,
    })
  }

  // BUCKET 4: Financial & Reporting (6 controls)
  controls.push(
    {
      controlId: 'FR-01',
      name: 'Financials',
      bucket: 4,
      activated: true,
      reason: `Required per ${config.accountingFramework}`,
    },
    {
      controlId: 'FR-02',
      name: 'Profit Recognition',
      bucket: 4,
      activated: true,
      reason: `Required per ${config.accountingFramework}`,
    }
  )

  if (config.productType === 'Sukuk') {
    controls.push({
      controlId: 'FR-03',
      name: 'SPV Segregation',
      bucket: 4,
      activated: true,
      reason: 'Sukuk structure requires SPV financial segregation',
    })
  }

  if (['GBP', 'SBP'].includes(config.sustainabilityOverlay || '')) {
    controls.push(
      {
        controlId: 'FR-04',
        name: 'Use-of-Proceeds Ledger',
        bucket: 4,
        activated: true,
        reason: `${config.sustainabilityOverlay} requires use-of-proceeds tracking per ICMA`,
      },
      {
        controlId: 'FR-05',
        name: 'KPI Monitoring',
        bucket: 4,
        activated: true,
        reason: `${config.sustainabilityOverlay} requires impact KPI reporting`,
      },
      {
        controlId: 'FR-06',
        name: 'Post-Issuance Reporting',
        bucket: 4,
        activated: true,
        reason: `${config.sustainabilityOverlay} requires annual impact reporting`,
      }
    )
  }

  if (config.sustainabilityOverlay === 'SLB') {
    controls.push(
      {
        controlId: 'FR-05',
        name: 'KPI Monitoring',
        bucket: 4,
        activated: true,
        reason: 'SLB MANDATORY: Annual KPI verification per ICMA SLBP 2020',
      },
      {
        controlId: 'FR-06',
        name: 'Post-Issuance Reporting',
        bucket: 4,
        activated: true,
        reason: 'SLB requires annual reporting with external verification',
      }
    )
  }

  // BUCKET 5: Audit & Assurance (5 controls)
  controls.push({
    controlId: 'AA-05',
    name: 'Regulator Inspection',
    bucket: 5,
    activated: true,
    reason: 'Always required for compliance verification',
  })

  if (config.internalAudit && config.internalAudit.startsWith('Yes')) {
    controls.push({
      controlId: 'AA-01',
      name: 'Internal Audit',
      bucket: 5,
      activated: true,
      reason: `Internal audit: ${config.internalAudit}`,
    })
  }

  if (config.shariahGovernance === 'Full SSB+Review+Audit') {
    controls.push({
      controlId: 'AA-02',
      name: 'Shariah Audit',
      bucket: 5,
      activated: true,
      reason: 'Full governance maturity requires Shariah audit per AAOIFI GS-3',
    })
  }

  if (config.externalAudit && config.externalAudit.startsWith('Yes')) {
    controls.push({
      controlId: 'AA-03',
      name: 'External Audit',
      bucket: 5,
      activated: true,
      reason: `External audit: ${config.externalAudit}`,
    })
  }

  if (['GBP', 'SBP', 'SLB'].includes(config.sustainabilityOverlay || '')) {
    controls.push({
      controlId: 'AA-04',
      name: 'Sustainability Assurance',
      bucket: 5,
      activated: true,
      reason: `${config.sustainabilityOverlay} requires external review per ICMA`,
    })
  }

  return controls
}
```

### Phase 5: Testing & Validation (Estimated: 2 hours)

**Test Scenarios**:

1. **Simple Murabaha Deal** (Minimum Controls)
   - Product: Murabaha
   - Sustainability: None
   - Complexity: Simple
   - Jurisdiction: Malaysia
   - Cross-border: No
   - Listing: Private
   - Risk: Low
   - Funding: Fixed maturity
   - Governance: SSB only
   - Internal Audit: No
   - External Audit: No
   - Accounting: AAOIFI
   - **Expected**: 12 controls activated (minimum viable)

2. **Complex Sukuk SLB** (Maximum Controls)
   - Product: Sukuk
   - Sustainability: SLB
   - Complexity: Complex
   - Jurisdiction: Malaysia
   - Cross-border: Yes - Both
   - Listing: Public
   - Risk: High
   - Funding: IAH
   - Governance: Full SSB+Review+Audit
   - Internal Audit: Yes (in-house)
   - External Audit: Yes (regulatory)
   - Accounting: AAOIFI
   - **Expected**: 26 controls activated (maximum)

3. **Cross-Border Ijara** (Mid-Range Controls)
   - Product: Ijara
   - Sustainability: GBP
   - Complexity: Medium
   - Jurisdiction: UAE
   - Cross-border: Yes - Investor base
   - Listing: Private
   - Risk: Medium
   - Funding: Fixed maturity
   - Governance: SSB+Review only
   - Internal Audit: Yes (outsourced)
   - External Audit: Yes (voluntary)
   - Accounting: IFRS
   - **Expected**: ~18 controls activated

**Validation Checks**:
- [ ] All 12 questions asked sequentially
- [ ] Suggested responses display correctly
- [ ] Control activation updates in real-time
- [ ] Bucket scores calculate correctly
- [ ] Configuration persists in Zustand store
- [ ] User can navigate back and review answers
- [ ] Edge cases handled (user types free-form answers)
- [ ] Mobile responsive layout works
- [ ] Accessibility (keyboard navigation, screen readers)

---

## Technical Considerations

### 1. Backward Compatibility
**Challenge**: Existing users may have workflows in progress using old 4-component approach

**Solutions**:
- **Option A**: Migration script to convert old configs to new 12-question format
- **Option B**: Support both formats (detect which format and render appropriate UI)
- **Option C**: Reset all in-progress workflows (acceptable for demo/alpha stage)

**Recommendation**: Option C for current stage, Option B for production

### 2. Claude API Rate Limits
**Challenge**: Conversational flow makes 12+ API calls per configuration session

**Solutions**:
- Cache common question patterns
- Use streaming for real-time feel without extra calls
- Consider using faster Claude model (Haiku) for quick questions
- Batch questions if user provides detailed initial description

### 3. Control Library Version Management
**Challenge**: Control activation logic may change as standards evolve

**Solutions**:
- Version the control activation function
- Store control library version with each deal configuration
- Allow deals to upgrade to new control library versions

### 4. Error Handling
**Scenarios to Handle**:
- Claude API timeout/failure → Fallback to form-based questions
- User provides ambiguous answer → Agent asks clarifying question
- User wants to change previous answer → Allow navigation back through conversation
- User abandons mid-conversation → Save partial config to resume later

---

## Next Steps (When Ready to Proceed)

1. ✅ **Create conversational component** (DONE)
2. ⏸️ **Integrate into WorkflowContainer** (PAUSED)
3. ⏸️ **Update Zustand store** (PAUSED)
4. ⏸️ **Connect Claude API** (PAUSED)
5. ⏸️ **Implement full control activation logic** (PAUSED)
6. ⏸️ **Test end-to-end** (PAUSED)

**Estimated Total Implementation Time**: 8-10 hours

---

## References

- **Architecture Findings**: `ARCHITECTURE_SESSION_FINDINGS.md`
- **Microservice Blueprint**: `MICROSERVICE_ARCHITECTURE_BLUEPRINT.md`
- **Control Library**: `src/lib/control-library.ts`
- **Existing Implementation**: `src/components/workflow/WorkflowContainer.tsx`
- **Store**: `src/lib/store.ts`
- **Types**: `src/lib/types.ts`

---

## Appendix: Key Architectural Decisions from Session

### From ARCHITECTURE_SESSION_FINDINGS.md:116-151

**User Feedback**: *"We don't need to have 10 steps, in fact we should reduce steps where possible as this is a AG-UI protocol aligned UI that doesn't need to adhere to traditional cluttered dashboard with navigation nightmare problems"*

**Recommended Conversational Flow**:
```
Step 0: Overview
  ↓
Step 1: Agent-Guided Configuration
  • Agent: "Tell me about your deal. I'll ask clarifying questions."
  • User: "We're structuring a $500M Sukuk for renewable energy in Malaysia"
  • Agent: [Asks 12 questions conversationally, not as forms]
  • Agent: "Based on your answers, I've activated 21 controls across 5 buckets"
  ↓
Step 2: Review & Confirm
  • Show: Control activation matrix, Guardian policy preview
  • User: Approve → Deal created
  ↓
Step 3: Navigate to GRC Dashboard (/ai-native/deals/:dealId)
```

**Benefits**:
- Fewer explicit steps (3 instead of 10)
- More natural interaction (conversation vs forms)
- Agent can adaptively ask follow-up questions
- Progressive disclosure (only ask what's needed)
- AG-UI streaming (real-time feedback)

---

**END OF IMPLEMENTATION PLAN**
