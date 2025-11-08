# V1 Component Reusability Guide for V2

**Document Version**: 1.0
**Date**: 2025-11-07
**Purpose**: Identify and modernize valuable V1 components for ZeroH V2

---

## Table of Contents

1. [Overview](#overview)
2. [V1 Components Analysis](#v1-components-analysis)
3. [Reusable Components Strategy](#reusable-components-strategy)
4. [Integration with V2 3-Step Flow](#integration-with-v2-3-step-flow)
5. [Migration Implementation Guide](#migration-implementation-guide)
6. [Component Modernization Checklist](#component-modernization-checklist)

---

## Overview

### V2 Philosophy: "Reuse Value, Not Code"

**Principle**: Extract the **UX patterns and visual approaches** that worked in V1, but reimplement cleanly in V2 architecture.

**Why Not Direct Copy**:
- V1 uses different state management patterns
- V1 has 12-step wizard structure (V2 is 3-step conversational)
- V1 may have accumulated technical debt
- V2 uses feature-based organization (V1 uses folder-by-type)

**Strategy**: Selective extraction + Modernization + Clean integration

---

## V1 Components Analysis

### High-Value Components (Reuse Priority: HIGH)

#### 0. **Product Tour System** (Interactive Onboarding)

**What It Does**:
- Guided walkthrough for new users
- Step-by-step feature introduction
- Interactive tooltips with data-tour targets
- Customizable tour steps and styling

**Why Valuable**:
- Reduces learning curve for new users
- Improves demo experience
- Showcases key features systematically
- Professional first impression

**Technical Stack**:
```typescript
// V1 implementation
import Joyride, { Step } from 'react-joyride'

// Tour steps configuration
export const tourSteps: Step[] = [
  {
    target: '[data-tour="dashboard"]',
    content: <div>Welcome to ZeroH...</div>,
    placement: 'center',
    disableBeacon: true
  },
  {
    target: '[data-tour="methodology-connect"]',
    content: <div>Connect to Shariah Standards...</div>,
    placement: 'right'
  }
]

// Usage in component
<Joyride
  steps={tourSteps}
  run={showTour}
  continuous
  showProgress
  showSkipButton
  styles={tourStyles}
/>
```

**Reusability Assessment**: ✅ **REUSE** (adapt for V2 3-step flow)

**V2 Tour Steps** (Recommended):
```typescript
// V2 Tour Structure - Adapted for 3-step conversational flow
export const v2TourSteps: Step[] = [
  // Welcome
  {
    target: '[data-tour="overview"]',
    content: (
      <div>
        <h3>Welcome to ZeroH V2</h3>
        <p>AI-Native Blockchain-Anchored Islamic Finance GRC Platform</p>
        <p>Complete compliance in 3 simple steps</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true
  },

  // Step 1: Conversational Configuration
  {
    target: '[data-tour="chat-interface"]',
    content: 'Answer 12 questions conversationally. The AI adapts to your responses.',
    placement: 'right'
  },
  {
    target: '[data-tour="control-activation"]',
    content: 'Watch controls activate in real-time as you answer questions',
    placement: 'left'
  },
  {
    target: '[data-tour="suggested-responses"]',
    content: 'Use quick replies or type your own answers',
    placement: 'top'
  },

  // Step 2: Review & Confirm
  {
    target: '[data-tour="bpmn-viewer"]',
    content: 'Review your Guardian policy structure visually with BPMN',
    placement: 'top'
  },
  {
    target: '[data-tour="test-workflow"]',
    content: 'Test your workflow before deployment',
    placement: 'top'
  },
  {
    target: '[data-tour="control-activation-matrix"]',
    content: 'See which controls are activated across 5 buckets',
    placement: 'bottom'
  },

  // Step 3: GRC Dashboard
  {
    target: '[data-tour="5-bucket-breakdown"]',
    content: 'Monitor compliance across 5 buckets: Shariah, Regulatory, Risk, Financial, Audit',
    placement: 'bottom'
  },
  {
    target: '[data-tour="live-execution"]',
    content: 'Watch real-time control execution and VC minting',
    placement: 'left'
  },
  {
    target: '[data-tour="evidence-repository"]',
    content: 'Access all compliance evidence in one place',
    placement: 'left'
  },
  {
    target: '[data-tour="credentials"]',
    content: 'View minted Verifiable Credentials for each control',
    placement: 'right'
  }
]
```

---

#### 1. **BPMN.io Workflow Visualizer** (Step 9)

**What It Does**:
- Displays Guardian policy as visual BPMN diagram
- Allows users to understand workflow structure
- Enables policy amendment with visual editing
- Provides export/import functionality

**Why Valuable**:
- Makes complex Guardian policies understandable
- Visual editing is more intuitive than JSON
- Industry-standard BPMN notation
- Professional presentation for stakeholders

**Technical Stack**:
```typescript
// V1 implementation
import BpmnModeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

// Component wraps bpmn-js library
```

**Reusability Assessment**: ✅ **REUSE** (with modernization)

---

#### 2. **Test Workflow Animation** (Step 10)

**What It Does**:
- Simulates workflow execution visually
- Shows step-by-step control validation
- Animates transitions between states
- Displays pass/fail indicators per control

**Why Valuable**:
- Helps users understand workflow logic before deployment
- Builds confidence in configuration
- Identifies potential issues early
- Great demo/presentation feature

**Technical Approach**:
```typescript
// V1 pattern (simplified)
const TestWorkflowAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepResults, setStepResults] = useState([])

  const simulateStep = async (step) => {
    // Simulate control execution
    await delay(1000)
    const result = mockControlValidation(step)
    setStepResults(prev => [...prev, result])
    setCurrentStep(prev => prev + 1)
  }

  return (
    <AnimatedWorkflow
      currentStep={currentStep}
      results={stepResults}
    />
  )
}
```

**Reusability Assessment**: ✅ **REUSE** (with modernization)

---

#### 3. **Live Execution Animation** (Step 11)

**What It Does**:
- Shows real-time execution of Guardian workflow
- Displays control execution progress
- Animates VC minting process
- Shows Hedera transaction confirmations

**Why Valuable**:
- Provides transparency into blockchain operations
- Builds trust with visual feedback
- Educational for users unfamiliar with VCs
- Differentiates from competitors (shows proof generation)

**Technical Approach**:
```typescript
// V1 pattern (simplified)
const LiveExecutionAnimation = () => {
  const [executionLog, setExecutionLog] = useState([])
  const [vcsMinted, setVCsMinted] = useState([])

  useEffect(() => {
    // Listen to Guardian execution events
    const eventSource = new EventSource('/api/guardian/execute')
    eventSource.onmessage = (event) => {
      const log = JSON.parse(event.data)
      setExecutionLog(prev => [...prev, log])

      if (log.type === 'vc_minted') {
        setVCsMinted(prev => [...prev, log.vc])
      }
    }
  }, [])

  return (
    <ExecutionTimeline
      logs={executionLog}
      vcsMinted={vcsMinted}
    />
  )
}
```

**Reusability Assessment**: ✅ **REUSE** (adapt for 5-bucket execution)

---

### Medium-Value Components (Reuse Priority: MEDIUM)

#### 4. **Control Status Cards**

**What It Does**:
- Displays individual control compliance status
- Shows pass/fail/pending indicators
- Links to evidence
- Displays KRIs

**Reusability Assessment**: ✅ **REUSE** (already planned for GRC dashboard)

---

#### 5. **Evidence Upload Component**

**What It Does**:
- Drag-and-drop file upload
- File type validation
- Upload progress indicator
- Evidence preview

**Reusability Assessment**: ✅ **REUSE** (Evidence Repository feature)

---

#### 6. **VC Display Component**

**What It Does**:
- Renders Verifiable Credential in readable format
- Shows VC metadata (issuer, issued date, validity)
- QR code for verification
- JSON view toggle

**Reusability Assessment**: ✅ **REUSE** (Credentials screen)

---

### Low-Value Components (Reuse Priority: LOW)

#### 7. **Multi-Step Wizard Navigation**

**What It Does**:
- Step progress indicator
- Forward/back navigation
- Step validation

**Reusability Assessment**: ❌ **DO NOT REUSE** (V2 uses 3-step conversational flow)

---

#### 8. **Form-Based Configuration**

**What It Does**:
- Steps 2-6 modular selection forms
- Dropdown selectors
- Checkbox configurations

**Reusability Assessment**: ❌ **DO NOT REUSE** (V2 uses conversational interface)

---

## Reusable Components Strategy

### Component Migration Framework

```
V1 Component → Analysis → Extraction → Modernization → V2 Integration
```

### Migration Pattern

**For Each Reusable Component**:

1. **Extract Core Logic**
   - Identify pure business logic (reusable)
   - Separate from V1-specific dependencies
   - Document key algorithms/formulas

2. **Modernize Architecture**
   - Convert to V2 feature-based structure
   - Use Zustand for state (if needed)
   - Use TanStack Query for async data
   - Apply TypeScript strict mode
   - Add comprehensive types

3. **Adapt to V2 UX**
   - Integrate with 3-step flow
   - Match V2 design system (Radix UI + Tailwind)
   - Add AG-UI protocol support (if conversational)
   - Ensure mobile responsiveness

4. **Add Service Layer**
   - Create interface for data fetching
   - Implement mock service
   - Prepare for real backend integration

5. **Test Independently**
   - Unit tests for logic
   - Component tests for UI
   - Integration tests with V2 flow

---

## Integration with V2 3-Step Flow

### V2 Workflow Structure

```
Step 0: Overview
  ↓
Step 1: Conversational Configuration (12-question MVQ)
  ↓
Step 2: Review & Confirm
  • Guardian Policy Visualization (BPMN.io) ← V1 Component
  • Control Activation Matrix
  • Test Workflow Simulation ← V1 Component
  ↓
Step 3: GRC Dashboard
  • Live Execution Status ← Adapted V1 Component
  • 5-Bucket Breakdown
  • Control Details
  • Evidence Repository
  • VC Credentials
```

### Integration Points

#### **BPMN Visualizer → Step 2: Review & Confirm**

```typescript
// features/configuration/components/Step2ReviewConfirm.tsx

import { BpmnPolicyViewer } from '@/features/workflow-visualization'

export function Step2ReviewConfirm() {
  const { dealConfiguration, activatedControls } = useConfigurationStore()

  // Generate Guardian policy from configuration
  const guardianPolicy = useMemo(() => {
    return generateGuardianPolicy(dealConfiguration, activatedControls)
  }, [dealConfiguration, activatedControls])

  return (
    <div className="review-container">
      <h2>Review Configuration</h2>

      {/* Configuration Summary */}
      <ConfigurationSummary config={dealConfiguration} />

      {/* Control Activation Matrix */}
      <ControlActivationMatrix controls={activatedControls} />

      {/* BPMN Policy Visualization (V1 component, modernized) */}
      <section>
        <h3>Guardian Policy Structure</h3>
        <BpmnPolicyViewer
          policy={guardianPolicy}
          editable={true}
          onPolicyChange={(updatedPolicy) => {
            // Allow visual editing
            updateGuardianPolicy(updatedPolicy)
          }}
        />
      </section>

      {/* Test Workflow Simulation (V1 component, modernized) */}
      <section>
        <h3>Test Workflow</h3>
        <WorkflowTestSimulator
          policy={guardianPolicy}
          controls={activatedControls}
        />
      </section>

      {/* Confirmation Actions */}
      <div className="actions">
        <Button onClick={goBackToConfiguration}>Back</Button>
        <Button onClick={confirmAndProceed} variant="primary">
          Confirm & Create Deal
        </Button>
      </div>
    </div>
  )
}
```

---

#### **Live Execution → Step 3: GRC Dashboard**

```typescript
// features/compliance/components/LiveExecutionPanel.tsx

import { ExecutionTimeline } from '@/features/workflow-execution'

export function LiveExecutionPanel({ dealId }: { dealId: string }) {
  const { executionStatus, executionLogs } = useDealExecution(dealId)

  return (
    <div className="execution-panel">
      <h3>Workflow Execution Status</h3>

      {/* Live Execution Timeline (V1 component, adapted) */}
      <ExecutionTimeline
        logs={executionLogs}
        onVCMinted={(vc) => {
          // Handle VC minting events
          showVCNotification(vc)
        }}
      />

      {/* Execution Statistics */}
      <ExecutionStats
        totalControls={executionStatus.totalControls}
        passedControls={executionStatus.passedControls}
        failedControls={executionStatus.failedControls}
        vcsMinted={executionStatus.vcsMinted}
      />
    </div>
  )
}
```

---

## Migration Implementation Guide

### Step 1: Extract V1 Components

#### 1.1 Create Extraction Directory (Temporary)

```bash
# In V1 project
cd "D:\projects\Islamic Finance Workflows"

# Create extraction directory
mkdir v1-component-extraction
```

#### 1.2 Copy Target Components

```bash
# Copy BPMN visualizer
cp src/components/workflow/steps/Step9ReviewPolicy.tsx v1-component-extraction/
cp -r src/components/workflow/bpmn-viewer/ v1-component-extraction/

# Copy test workflow animation
cp src/components/workflow/steps/Step10TestWorkflow.tsx v1-component-extraction/

# Copy live execution
cp src/components/workflow/steps/Step11LiveExecution.tsx v1-component-extraction/

# Copy supporting utilities
cp src/lib/guardian-policy-generator.ts v1-component-extraction/
cp src/lib/workflow-simulator.ts v1-component-extraction/
```

#### 1.3 Document Dependencies

Create `v1-component-extraction/DEPENDENCIES.md`:

```markdown
# V1 Component Dependencies

## BPMN Visualizer
- **External**: bpmn-js v13.x
- **Internal**: workflowStore (Zustand), Guardian API client
- **Styles**: bpmn-js default styles

## Test Workflow Animation
- **External**: framer-motion v10.x (for animations)
- **Internal**: workflowStore, mock control validator
- **Styles**: Custom animation CSS

## Live Execution
- **External**: None (vanilla React)
- **Internal**: SSE client, Guardian event listener, workflowStore
- **Styles**: Timeline component styles
```

---

### Step 2: Analyze and Refactor

#### 2.1 Identify Pure Business Logic

```typescript
// Example: Extract Guardian policy generation logic

// v1-component-extraction/guardian-policy-logic.ts (PURE LOGIC)

/**
 * Pure function: Generate Guardian policy from deal configuration
 * No React dependencies, no side effects
 */
export function generateGuardianPolicy(
  dealConfig: DealConfiguration,
  activatedControls: string[]
): GuardianPolicy {
  const policySteps: PolicyStep[] = []

  // Add initial validation step
  policySteps.push({
    type: 'validation',
    name: 'Initial Validation',
    controls: activatedControls.filter(c => c.startsWith('SG-'))
  })

  // Add Shariah governance steps
  if (activatedControls.includes('SG-01')) {
    policySteps.push({
      type: 'shariah_check',
      name: 'SSB Mandate Verification',
      condition: 'ssbApproved === true'
    })
  }

  // Add regulatory steps
  activatedControls
    .filter(c => c.startsWith('RL-'))
    .forEach(control => {
      policySteps.push(createRegulatoryStep(control))
    })

  // ... more logic

  return {
    id: `policy-${Date.now()}`,
    name: `${dealConfig.productType} Policy`,
    steps: policySteps,
    bpmnXml: convertToBPMNXML(policySteps)
  }
}

/**
 * Convert policy steps to BPMN XML format
 */
function convertToBPMNXML(steps: PolicyStep[]): string {
  // Pure function: No dependencies on bpmn-js at this level
  // Just generates the XML structure
  // ...
}
```

#### 2.2 Separate UI from Logic

```typescript
// V1 MIXED (logic + UI together)
const Step9ReviewPolicy = () => {
  const workflow = useWorkflowStore()

  // Logic mixed with component
  const generatePolicy = () => {
    const steps = []
    if (workflow.shariahStructure === 'Sukuk') {
      steps.push({ type: 'sukuk_validation' })
    }
    // ... more logic
    return { steps }
  }

  return <BpmnViewer policy={generatePolicy()} />
}

// V2 SEPARATED (logic extracted)

// Logic (features/workflow-visualization/utils/policyGenerator.ts)
export function generateGuardianPolicy(
  config: DealConfiguration,
  controls: string[]
): GuardianPolicy {
  // Pure logic here
}

// UI (features/workflow-visualization/components/BpmnPolicyViewer.tsx)
export function BpmnPolicyViewer({ policy, editable, onPolicyChange }) {
  // Only UI logic here
  return <div>...</div>
}

// Integration (features/configuration/components/Step2ReviewConfirm.tsx)
export function Step2ReviewConfirm() {
  const { dealConfiguration, activatedControls } = useConfigurationStore()

  // Use pure function
  const policy = useMemo(
    () => generateGuardianPolicy(dealConfiguration, activatedControls),
    [dealConfiguration, activatedControls]
  )

  return <BpmnPolicyViewer policy={policy} />
}
```

---

### Step 3: Modernize for V2

#### 3.1 Convert to V2 Architecture

**V1 Structure** (folder-by-type):
```
src/
├── components/
│   └── workflow/
│       ├── bpmn-viewer/
│       │   └── BpmnViewer.tsx
│       └── steps/
│           └── Step9ReviewPolicy.tsx
└── lib/
    └── guardian-policy-generator.ts
```

**V2 Structure** (feature-based):
```
src/features/
└── workflow-visualization/
    ├── components/
    │   ├── BpmnPolicyViewer.tsx
    │   ├── BpmnEditor.tsx
    │   └── PolicyExportDialog.tsx
    ├── hooks/
    │   └── useBpmnModeler.ts
    ├── utils/
    │   ├── policyGenerator.ts
    │   └── bpmnConverter.ts
    ├── types/
    │   └── index.ts
    └── services/
        └── policyService.ts (interface + mock + real)
```

#### 3.2 Add TypeScript Types

```typescript
// features/workflow-visualization/types/index.ts

/**
 * Guardian policy structure
 */
export interface GuardianPolicy {
  id: string
  name: string
  version: string
  steps: PolicyStep[]
  bpmnXml: string
  metadata: {
    createdAt: string
    dealId: string
    controlsActivated: string[]
  }
}

export interface PolicyStep {
  id: string
  type: PolicyStepType
  name: string
  description?: string
  condition?: string
  controls?: string[]
  nextSteps: string[]
}

export type PolicyStepType =
  | 'validation'
  | 'shariah_check'
  | 'regulatory_check'
  | 'risk_assessment'
  | 'financial_reporting'
  | 'audit'
  | 'vc_minting'
  | 'decision_gate'

export interface BpmnViewerProps {
  policy: GuardianPolicy
  editable?: boolean
  onPolicyChange?: (updatedPolicy: GuardianPolicy) => void
  height?: number
  showToolbar?: boolean
}
```

#### 3.3 Create Service Layer

```typescript
// features/workflow-visualization/services/policyService.ts

export interface PolicyService {
  generatePolicy(
    config: DealConfiguration,
    controls: string[]
  ): Promise<GuardianPolicy>

  validatePolicy(policy: GuardianPolicy): Promise<ValidationResult>

  exportPolicy(policy: GuardianPolicy, format: 'json' | 'bpmn' | 'pdf'): Promise<Blob>

  importPolicy(file: File): Promise<GuardianPolicy>
}

// Mock implementation
export class MockPolicyService implements PolicyService {
  async generatePolicy(
    config: DealConfiguration,
    controls: string[]
  ): Promise<GuardianPolicy> {
    await delay(1000)

    // Use pure function (reused from V1)
    return generateGuardianPolicy(config, controls)
  }

  async validatePolicy(policy: GuardianPolicy): Promise<ValidationResult> {
    await delay(500)

    // Mock validation
    return {
      valid: true,
      warnings: [],
      errors: []
    }
  }

  async exportPolicy(
    policy: GuardianPolicy,
    format: 'json' | 'bpmn' | 'pdf'
  ): Promise<Blob> {
    await delay(800)

    if (format === 'bpmn') {
      return new Blob([policy.bpmnXml], { type: 'application/xml' })
    }

    // ... other formats
  }

  async importPolicy(file: File): Promise<GuardianPolicy> {
    const text = await file.text()
    // Parse and validate
    return JSON.parse(text)
  }
}

// Service resolution
export const policyService: PolicyService = config.useMockServices
  ? new MockPolicyService()
  : new RealPolicyService(apiClient)
```

#### 3.4 Modernize Component

```typescript
// features/workflow-visualization/components/BpmnPolicyViewer.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import BpmnViewer from 'bpmn-js/lib/Viewer'
import { Button } from '@/components/ui/button'
import { GuardianPolicy, BpmnViewerProps } from '../types'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

/**
 * BPMN Policy Viewer/Editor
 * Modernized from V1 with V2 architecture patterns
 */
export function BpmnPolicyViewer({
  policy,
  editable = false,
  onPolicyChange,
  height = 500,
  showToolbar = true
}: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<BpmnModeler | BpmnViewer | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize BPMN viewer/modeler
  useEffect(() => {
    if (!containerRef.current) return

    // Create viewer or modeler based on editable prop
    const instance = editable
      ? new BpmnModeler({
          container: containerRef.current,
          keyboard: { bindTo: document }
        })
      : new BpmnViewer({
          container: containerRef.current
        })

    modelerRef.current = instance

    // Load policy BPMN
    instance.importXML(policy.bpmnXml).catch((err) => {
      console.error('Error loading BPMN:', err)
    })

    // Listen for changes (if editable)
    if (editable) {
      const eventBus = instance.get('eventBus')
      eventBus.on('commandStack.changed', () => {
        setHasChanges(true)
      })
    }

    // Cleanup
    return () => {
      instance.destroy()
    }
  }, [policy.bpmnXml, editable])

  // Save changes
  const handleSave = async () => {
    if (!modelerRef.current || !onPolicyChange) return

    try {
      const { xml } = await (modelerRef.current as BpmnModeler).saveXML({ format: true })

      // Update policy with new BPMN
      onPolicyChange({
        ...policy,
        bpmnXml: xml
      })

      setHasChanges(false)
    } catch (err) {
      console.error('Error saving BPMN:', err)
    }
  }

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!modelerRef.current) return

    const canvas = modelerRef.current.get('canvas')

    switch (direction) {
      case 'in':
        canvas.zoom(zoomLevel + 0.1)
        setZoomLevel(prev => prev + 0.1)
        break
      case 'out':
        canvas.zoom(zoomLevel - 0.1)
        setZoomLevel(prev => prev - 0.1)
        break
      case 'reset':
        canvas.zoom('fit-viewport')
        setZoomLevel(1)
        break
    }
  }

  return (
    <div className="bpmn-viewer-container">
      {/* Toolbar */}
      {showToolbar && (
        <div className="toolbar">
          <div className="toolbar-section">
            <Button
              onClick={() => handleZoom('in')}
              variant="outline"
              size="sm"
            >
              Zoom In
            </Button>
            <Button
              onClick={() => handleZoom('out')}
              variant="outline"
              size="sm"
            >
              Zoom Out
            </Button>
            <Button
              onClick={() => handleZoom('reset')}
              variant="outline"
              size="sm"
            >
              Fit
            </Button>
          </div>

          {editable && (
            <div className="toolbar-section">
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                variant="primary"
                size="sm"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}

      {/* BPMN Canvas */}
      <div
        ref={containerRef}
        style={{ height: `${height}px` }}
        className="bpmn-canvas"
      />

      {/* Status */}
      {editable && hasChanges && (
        <div className="status-bar">
          Unsaved changes
        </div>
      )}
    </div>
  )
}
```

---

### Step 4: Create Workflow Test Simulator

```typescript
// features/workflow-execution/components/WorkflowTestSimulator.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GuardianPolicy } from '@/features/workflow-visualization/types'
import { AnimatedWorkflowTimeline } from './AnimatedWorkflowTimeline'
import { workflowSimulatorService } from '../services'

export function WorkflowTestSimulator({
  policy,
  controls
}: {
  policy: GuardianPolicy
  controls: string[]
}) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  const handleStartSimulation = async () => {
    setIsSimulating(true)
    setSimulationLogs([])
    setCurrentStep(0)

    try {
      // Stream simulation events
      for await (const event of workflowSimulatorService.simulate(policy, controls)) {
        setSimulationLogs(prev => [...prev, event])
        setCurrentStep(prev => prev + 1)
      }
    } catch (error) {
      console.error('Simulation error:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleReset = () => {
    setSimulationLogs([])
    setCurrentStep(0)
  }

  return (
    <div className="workflow-test-simulator">
      <div className="simulator-controls">
        <Button
          onClick={handleStartSimulation}
          disabled={isSimulating}
          variant="primary"
        >
          {isSimulating ? 'Simulating...' : 'Run Test'}
        </Button>

        <Button
          onClick={handleReset}
          disabled={isSimulating}
          variant="outline"
        >
          Reset
        </Button>
      </div>

      {/* Animated Timeline (V1 component, modernized) */}
      <AnimatedWorkflowTimeline
        logs={simulationLogs}
        currentStep={currentStep}
        totalSteps={policy.steps.length}
      />

      {/* Results Summary */}
      {!isSimulating && simulationLogs.length > 0 && (
        <SimulationResults logs={simulationLogs} />
      )}
    </div>
  )
}
```

---

## Component Modernization Checklist

### For Each V1 Component Being Migrated:

**Architecture**:
- [ ] Moved to feature-based structure
- [ ] Separated logic from UI
- [ ] Created service layer (interface + mock + real)
- [ ] Added TypeScript types
- [ ] Updated imports to use @/ alias

**Code Quality**:
- [ ] Removed any V1-specific dependencies
- [ ] Applied TypeScript strict mode
- [ ] No `any` types
- [ ] All props typed
- [ ] Added JSDoc comments

**State Management**:
- [ ] Using Zustand (if local state management needed)
- [ ] Using TanStack Query (if async data)
- [ ] No prop drilling
- [ ] State collocated with feature

**Styling**:
- [ ] Using Tailwind CSS (not custom CSS files)
- [ ] Using Radix UI primitives where appropriate
- [ ] Mobile responsive
- [ ] Dark mode compatible (if applicable)

**Testing**:
- [ ] Unit tests for pure functions
- [ ] Component tests for UI
- [ ] Integration tests with V2 flow
- [ ] Visual regression tests (if applicable)

**Documentation**:
- [ ] Component documented with examples
- [ ] Props documented with JSDoc
- [ ] Service interface documented
- [ ] Added to Storybook (if applicable)

**Integration**:
- [ ] Integrated with V2 3-step flow
- [ ] Works with mock services
- [ ] Ready for real backend (service layer)
- [ ] Tested in context

---

## Summary: V1 → V2 Component Port Strategy

### High Priority (Implement First)

1. **BPMN Policy Viewer** → Step 2: Review & Confirm
   - Estimated effort: 3 days
   - Dependencies: bpmn-js library, policy generation logic
   - Value: High (visual policy understanding + editing)

2. **Workflow Test Simulator** → Step 2: Review & Confirm
   - Estimated effort: 2 days
   - Dependencies: Animation library (framer-motion), simulator service
   - Value: High (builds confidence, great demo feature)

3. **Live Execution Timeline** → Step 3: GRC Dashboard
   - Estimated effort: 2 days
   - Dependencies: SSE streaming, execution service
   - Value: High (transparency, differentiation)

### Medium Priority (Implement Later)

4. **Control Status Cards** → Step 3: GRC Dashboard
   - Estimated effort: 1 day
   - Already planned, ensure V1 learnings applied

5. **Evidence Upload** → Evidence Repository
   - Estimated effort: 1 day
   - Straightforward port with modernization

6. **VC Display Component** → Credentials Screen
   - Estimated effort: 1 day
   - Enhanced with QR codes and verification

### Low Priority (Nice to Have)

7. **Export/Import Utilities**
   - Estimated effort: 0.5 days
   - Add as polish feature

---

## Total Estimated Effort

**Phase 1** (High Priority): 7 days
**Phase 2** (Medium Priority): 3 days
**Phase 3** (Low Priority): 0.5 days

**Total**: ~10.5 days for full V1 component migration and modernization

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | Claude | Initial V1 component reusability guide |

---

**END OF GUIDE**

This guide ensures valuable V1 components are preserved and modernized for V2, while maintaining clean architecture and avoiding technical debt carryover.
