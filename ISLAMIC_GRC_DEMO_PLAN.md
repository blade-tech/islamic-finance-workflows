# Islamic GRC Demo - Planning & Tracker

**Project Name**: islamic-grc-demo
**Vision**: Jurisdiction-first GRC platform with composable workflow modules
**Target Market**: Qatar Islamic finance practitioners
**Start Date**: November 10, 2025
**Status**: 🟡 Planning Phase

---

## 📋 Executive Summary

### What We're Building
A fresh demo showcasing Islamic GRC capabilities through a **3-phase user journey**:
1. **Configuration** - Single-page selection (jurisdiction, product, accounting, sustainability, docs)
2. **Workflow Review** - Human-readable workflows with moderate customization
3. **Execution Dashboard** - Role-based task management and process tracking

### Core Principles
- ✅ **Composable Workflow Modules** - Lego-block style workflow assembly
- ✅ **Policy-Locked Constraints** - Users can adjust timing/assignments but not break AAOIFI/QCB/QFCRA rules
- ✅ **Practitioner Validation** - Use demo to validate workflows with Qatar practitioners
- ✅ **Design Continuity** - Reuse existing UI components, colors, and patterns from V1/V2

---

## 🎯 Product Scope

### Qatar Products (In Depth)
| Product | Priority | Status | Standards |
|---------|----------|--------|-----------|
| **Ijarah (Islamic Lease)** | 🔴 P0 | 📝 Planning | AAOIFI SS-9, QCB, QFCRA IBANK 1.3.12 |
| **Murabaha (Cost-Plus)** | 🔴 P0 | 📝 Planning | AAOIFI FAS-28, QCB, QFCRA |
| **Mudaraba (Profit-Sharing)** | 🔴 P0 | 📝 Planning | AAOIFI FAS-3, QCB, QFCRA |

### Coming Soon (Ghost Cards)
| Product | Priority | Display Status |
|---------|----------|----------------|
| **Sukuk (Islamic Bonds)** | 🟡 P1 | 🔜 Coming Soon |
| **Islamic Funds** | 🟡 P1 | 🔜 Coming Soon |
| **Takaful (Islamic Insurance)** | 🟡 P1 | 🔜 Coming Soon |
| **Musharaka (Partnership)** | 🟢 P2 | 🔜 Coming Soon |

### Other Jurisdictions (Future)
| Jurisdiction | Priority | Display Status |
|--------------|----------|----------------|
| **UAE (DFSA/ADGM)** | 🟢 P2 | 🔜 Coming Q2 2025 |
| **Saudi Arabia (SAMA/CMA)** | 🟢 P2 | 🔜 Coming Q3 2025 |
| **Malaysia (BNM/SC)** | 🟢 P2 | 🔜 Coming Q3 2025 |

---

## 🏗️ Architecture Overview

### File Structure
```
src/app/islamic-grc-demo/
├── layout.tsx                           # Demo-specific layout
├── page.tsx                             # PHASE 1: Configuration
├── workflows/
│   └── page.tsx                         # PHASE 2: Workflow review & customization
├── dashboard/
│   ├── page.tsx                         # PHASE 3: Dashboard router
│   ├── my-tasks/
│   │   └── page.tsx                    # My Tasks (daily/weekly/monthly)
│   ├── process-tracking/
│   │   └── page.tsx                    # Process Tracking (manager view)
│   └── overview/
│       └── page.tsx                    # Overview Dashboard (executive view)
└── components/
    ├── JurisdictionSelector.tsx         # Ghost cards for jurisdictions
    ├── ProductSelector.tsx              # Product selection cards
    ├── ConfigurationForm.tsx            # Full Phase 1 form
    ├── WorkflowTimeline.tsx             # Timeline/checklist format
    ├── WorkflowEditor.tsx               # Moderate customization UI
    ├── TaskCard.tsx                     # Reuse from V2
    ├── PolicyConstraintBadge.tsx        # Shows locked/editable status
    └── CalendarExportButton.tsx         # Export tasks to .ics

src/lib/stores/
└── grc-demo-store.ts                    # Isolated Zustand store

src/lib/workflow-templates/
├── qatar/
│   ├── modules/                         # Composable workflow modules
│   │   ├── shariah-board-approval.json
│   │   ├── contract-gates-ijarah.json
│   │   ├── contract-gates-murabaha.json
│   │   ├── contract-gates-mudaraba.json
│   │   ├── sncr-monitoring.json
│   │   ├── purification-workflow.json
│   │   ├── per-irr-management.json
│   │   └── financial-reporting-aaoifi.json
│   ├── ijarah.json                      # Assembled workflow
│   ├── murabaha.json
│   └── mudaraba.json
├── validator.ts                         # Policy constraint validation
└── assembler.ts                         # Compose modules into workflows

src/lib/types/
└── grc-demo-types.ts                    # TypeScript types
```

---

## 📐 Data Models

### Configuration (Phase 1)
```typescript
interface DealConfiguration {
  id: string
  createdAt: string

  // Step 1: Jurisdiction
  jurisdiction: 'qatar' | 'uae' | 'saudi' | 'malaysia'

  // Step 2: Product Structure
  productType: 'ijarah' | 'murabaha' | 'mudaraba' | 'sukuk' | 'funds' | 'takaful'
  productSubtype?: string // e.g., "Ijarah Muntahia Bittamleek (IMB)"

  // Step 3: Accounting & Reporting
  accountingStandard: 'aaoifi' | 'ifrs' | 'ifrs-islamic'

  // Step 4: Sustainability & Impact (Optional)
  sustainability?: {
    framework: 'green-sukuk' | 'un-sdgs' | 'vbi' | 'none'
    targetSDGs?: string[]
  }

  // Step 5: Additional Documents (Optional)
  uploadedDocuments: {
    id: string
    name: string
    type: 'policy' | 'fatwa' | 'contract-template' | 'other'
    url: string
    uploadedAt: string
  }[]

  // Generated metadata
  status: 'draft' | 'workflows-generated' | 'workflows-customized' | 'deployed'
  generatedWorkflows?: Workflow[]
}
```

### Workflow Module (Composable)
```typescript
interface WorkflowModule {
  id: string
  name: string
  category: 'shariah-governance' | 'contract-gates' | 'risk-management' | 'reporting'

  // Policy constraints
  policySource: string // e.g., "AAOIFI SS-9 §4/4"
  isRequired: boolean
  isEditable: boolean // Can users customize this module?

  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  order: number
  title: string
  description: string

  // Assignments
  assignedRole: string // e.g., "Shariah Compliance Officer"
  assignedTo?: string // Specific person (optional)

  // Timing
  durationDays: number
  startAfter?: string[] // Step IDs that must complete first

  // Evidence requirements
  requiredEvidence: {
    type: string
    description: string
    isRequired: boolean
  }[]

  // Policy constraints
  policyConstraints: {
    source: string // e.g., "AAOIFI SS-9 §3/1"
    constraint: string // Human-readable description
    cannotModify: boolean
  }[]

  // Approval gates
  requiresApproval: boolean
  approvalRole?: string

  // Customization metadata
  isHardGate: boolean // If true, cannot be skipped/removed
  isOptional: boolean
  allowDurationChange: boolean
  allowRoleChange: boolean
}
```

### Assembled Workflow
```typescript
interface Workflow {
  id: string
  dealConfigId: string
  name: string
  description: string

  // Composed from modules
  modules: WorkflowModule[]

  // Flattened steps for execution
  steps: WorkflowStep[]

  // Metadata
  totalDurationDays: number
  criticalPath: string[] // Step IDs on critical path

  // Customization tracking
  isCustomized: boolean
  customizationLog: {
    stepId: string
    field: string
    oldValue: any
    newValue: any
    changedBy: string
    changedAt: string
  }[]
}
```

### Task (Phase 3)
```typescript
interface Task {
  id: string
  workflowId: string
  stepId: string

  // Task details
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'

  // Assignment
  assignedRole: string
  assignedTo?: string

  // Timing
  createdAt: string
  dueDate: string
  scheduledFor?: string // For recurring tasks
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'quarterly'

  // Status
  status: 'not-started' | 'in-progress' | 'waiting-approval' | 'completed' | 'blocked'
  completedAt?: string
  completedBy?: string

  // Evidence
  requiredEvidence: {
    type: string
    description: string
    isRequired: boolean
    uploadedFiles?: string[]
  }[]

  // Approval
  requiresApproval: boolean
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  approver?: string

  // Policy context
  policyReference: string // e.g., "AAOIFI SS-9 §4/4"

  // Calendar export
  calendarExported: boolean
  calendarUrl?: string // .ics file URL
}
```

---

## 🧩 Composable Workflow Modules

### Module Library (Qatar)

#### 1. Shariah Governance Modules
| Module ID | Name | Required For | Policy Source |
|-----------|------|--------------|---------------|
| `qat-ssb-001` | Shariah Board Approval | All products | AAOIFI GS-1, QCB |
| `qat-ssb-002` | SSB Independence Check | All products | AAOIFI GS-5 |
| `qat-ssb-003` | SSB Annual Reporting | All products | AAOIFI GS-1 §6 |
| `qat-fatwa-001` | Fatwa Issuance Workflow | New products | AAOIFI GS-1 |
| `qat-scf-001` | Shariah Compliance Function (Ex-Ante) | All transactions | AAOIFI GS-9 |
| `qat-scr-001` | Shariah Review (Ex-Post) | All transactions | AAOIFI GS-3 |
| `qat-sia-001` | Internal Shariah Audit | All products | AAOIFI GS-11 |

#### 2. Contract Gates Modules (Product-Specific)
| Module ID | Name | Required For | Policy Source |
|-----------|------|--------------|---------------|
| `qat-ijr-gate-001` | Ijarah: Asset Ownership Verification | Ijarah | AAOIFI SS-9 §3/1 |
| `qat-ijr-gate-002` | Ijarah: Delivery Before Rent | Ijarah | AAOIFI SS-9 §4/4, QFCRA IBANK 1.3.12 |
| `qat-ijr-gate-003` | Ijarah: Takaful Coverage | Ijarah | AAOIFI SS-9 (Lessor risk) |
| `qat-ijr-gate-004` | Ijarah: Maintenance Responsibility Split | Ijarah | AAOIFI SS-9 |
| `qat-mrb-gate-001` | Murabaha: Cost Disclosure | Murabaha | AAOIFI FAS-28 §3 |
| `qat-mrb-gate-002` | Murabaha: Asset Ownership Before Sale | Murabaha | AAOIFI FAS-28 §4 |
| `qat-mrb-gate-003` | Murabaha: Promise vs Contract | Murabaha | AAOIFI FAS-28 §5 |
| `qat-mdr-gate-001` | Mudaraba: Capital Verification | Mudaraba | AAOIFI FAS-3 §2 |
| `qat-mdr-gate-002` | Mudaraba: Profit-Sharing Ratio | Mudaraba | AAOIFI FAS-3 §3 |
| `qat-mdr-gate-003` | Mudaraba: Loss Allocation | Mudaraba | AAOIFI FAS-3 §4 |

#### 3. Risk Management Modules
| Module ID | Name | Required For | Policy Source |
|-----------|------|--------------|---------------|
| `qat-sncr-001` | SNCR Monitoring Setup | All products | IFSB-1 §6.1-6.2 |
| `qat-sncr-002` | SNCR Incident Response | All products | IFSB-1 §6.1-6.2 |
| `qat-pur-001` | Purification Workflow | When SNCR occurs | IFSB-1, AAOIFI |
| `qat-per-irr-001` | PER/IRR Policy Setup | Investment accounts | IFSB-1 §7.1-7.2 |
| `qat-dcr-001` | Displaced Commercial Risk Monitoring | Investment accounts | IFSB-1 §7.1 |
| `qat-ror-001` | Rate-of-Return Risk Monitoring | Investment accounts | IFSB-10 |

#### 4. Financial Reporting Modules
| Module ID | Name | Required For | Policy Source |
|-----------|------|--------------|---------------|
| `qat-rep-aaoifi-001` | AAOIFI FAS Financial Statements | AAOIFI accounting | AAOIFI FAS |
| `qat-rep-qcb-001` | QCB Prudential Reporting | All Qatar entities | QCB Regulations |
| `qat-rep-qfcra-001` | QFCRA Regulatory Reporting | QFC entities | QFCRA Rules |
| `qat-disc-001` | IAH Disclosure Requirements | Investment accounts | IFSB-10, AAOIFI |

#### 5. Sustainability Modules (Optional)
| Module ID | Name | Required For | Policy Source |
|-----------|------|--------------|---------------|
| `qat-green-001` | Green Sukuk Eligible Project Verification | Green Sukuk | AAOIFI, Green Sukuk Principles |
| `qat-sdg-001` | UN SDG Tracking & Reporting | SDG-aligned products | UN SDGs Framework |
| `qat-vbi-001` | Value-Based Intermediation Monitoring | VBI products | BNM VBI (adapted for Qatar) |

---

## 🔨 Module Assembly Logic

### Ijarah Workflow Assembly
```typescript
// src/lib/workflow-templates/qatar/ijarah.json
{
  "productType": "ijarah",
  "jurisdiction": "qatar",
  "modules": [
    // Shariah Governance (Required)
    "qat-ssb-001",      // Shariah Board Approval
    "qat-scf-001",      // Shariah Compliance Function

    // Contract Gates (Ijarah-Specific)
    "qat-ijr-gate-001", // Asset Ownership
    "qat-ijr-gate-002", // Delivery Before Rent (HARD GATE)
    "qat-ijr-gate-003", // Takaful Coverage
    "qat-ijr-gate-004", // Maintenance Split

    // Risk Management (Required)
    "qat-sncr-001",     // SNCR Monitoring

    // Financial Reporting (Based on accounting choice)
    "qat-rep-aaoifi-001", // AAOIFI FAS (if selected)
    "qat-rep-qcb-001",    // QCB Reporting

    // Optional (if sustainability selected)
    "qat-green-001"     // Green Sukuk (if applicable)
  ],
  "assemblyRules": {
    "hardGates": ["qat-ijr-gate-002"], // Cannot be removed
    "dependencyChains": [
      {
        "before": "qat-ssb-001",
        "after": ["qat-ijr-gate-001", "qat-ijr-gate-002"]
      },
      {
        "before": "qat-ijr-gate-001",
        "after": "qat-ijr-gate-002"
      },
      {
        "before": "qat-ijr-gate-002",
        "after": "qat-rep-aaoifi-001"
      }
    ]
  }
}
```

### Murabaha Workflow Assembly
```typescript
// src/lib/workflow-templates/qatar/murabaha.json
{
  "productType": "murabaha",
  "jurisdiction": "qatar",
  "modules": [
    // Shariah Governance
    "qat-ssb-001",
    "qat-scf-001",

    // Contract Gates (Murabaha-Specific)
    "qat-mrb-gate-001", // Cost Disclosure (HARD GATE)
    "qat-mrb-gate-002", // Asset Ownership Before Sale (HARD GATE)
    "qat-mrb-gate-003", // Promise vs Contract

    // Risk Management
    "qat-sncr-001",

    // Financial Reporting
    "qat-rep-aaoifi-001",
    "qat-rep-qcb-001"
  ],
  "assemblyRules": {
    "hardGates": ["qat-mrb-gate-001", "qat-mrb-gate-002"],
    "dependencyChains": [
      {
        "before": "qat-ssb-001",
        "after": ["qat-mrb-gate-001", "qat-mrb-gate-002"]
      },
      {
        "before": "qat-mrb-gate-002",
        "after": "qat-mrb-gate-001"
      }
    ]
  }
}
```

### Mudaraba Workflow Assembly
```typescript
// src/lib/workflow-templates/qatar/mudaraba.json
{
  "productType": "mudaraba",
  "jurisdiction": "qatar",
  "modules": [
    // Shariah Governance
    "qat-ssb-001",
    "qat-scf-001",

    // Contract Gates (Mudaraba-Specific)
    "qat-mdr-gate-001", // Capital Verification (HARD GATE)
    "qat-mdr-gate-002", // Profit-Sharing Ratio (HARD GATE)
    "qat-mdr-gate-003", // Loss Allocation (HARD GATE)

    // Risk Management (Investment Account specific)
    "qat-sncr-001",
    "qat-per-irr-001",  // PER/IRR Management
    "qat-dcr-001",      // DCR Monitoring
    "qat-ror-001",      // RoR Monitoring

    // Financial Reporting
    "qat-rep-aaoifi-001",
    "qat-rep-qcb-001",
    "qat-disc-001"      // IAH Disclosures
  ],
  "assemblyRules": {
    "hardGates": ["qat-mdr-gate-001", "qat-mdr-gate-002", "qat-mdr-gate-003"],
    "dependencyChains": [
      {
        "before": "qat-ssb-001",
        "after": ["qat-mdr-gate-001"]
      },
      {
        "before": "qat-mdr-gate-001",
        "after": ["qat-mdr-gate-002", "qat-mdr-gate-003"]
      },
      {
        "before": "qat-mdr-gate-002",
        "after": "qat-per-irr-001"
      }
    ]
  }
}
```

---

## 📚 Research Checklist

### Qatar Regulatory Requirements

#### QCB (Qatar Central Bank)
- [ ] QCB Circular on Islamic Banking (latest version)
- [ ] QCB Prudential Reporting Requirements for Islamic Banks
- [ ] QCB Shariah Governance Guidelines
- [ ] QCB Guidelines on Ijarah Financing
- [ ] QCB Guidelines on Murabaha Financing
- [ ] QCB Guidelines on Mudaraba Financing
- [ ] QCB 2/2025 Retention Requirements (10% for off-plan)

#### QFCRA (Qatar Financial Centre Regulatory Authority)
- [ ] QFCRA IBANK Module (Islamic Banking Rules)
  - [ ] Section 1.3.12 (Ijarah requirements)
  - [ ] Murabaha requirements
  - [ ] Investment account requirements
- [ ] QFC Digital Asset Regulations 2024 (DAR)
- [ ] QFCRA Prudential Rules for Islamic Banks
- [ ] QFCRA Conduct of Business Rules

#### AAOIFI Standards
- [ ] **Governance Standards (GS)**
  - [ ] GS-1: Shariah Supervisory Board
  - [ ] GS-3: Internal Shariah Review
  - [ ] GS-5: Independence of SSB
  - [ ] GS-9: Shariah Compliance Function
  - [ ] GS-11: Internal Shariah Audit

- [ ] **Shariah Standards (SS)**
  - [ ] SS-9: Ijarah and Ijarah Muntahia Bittamleek
  - [ ] (Murabaha standard - confirm number)
  - [ ] (Mudaraba standard - confirm number)

- [ ] **Financial Accounting Standards (FAS)**
  - [ ] FAS-28: Murabaha and Other Deferred Payment Sales
  - [ ] FAS-3: Mudaraba Financing
  - [ ] FAS for Ijarah (confirm number)

#### IFSB Standards
- [ ] IFSB-1: Risk Management for Islamic Financial Institutions
  - [ ] Section 6.1-6.2: SNCR (Shariah Non-Compliance Risk)
  - [ ] Section 7.1-7.2: DCR, PER, IRR
- [ ] IFSB-10: Shariah Governance Systems
- [ ] IFSB-30: Revised Corporate Governance (2023)

#### Additional Research
- [ ] IIFM (International Islamic Financial Market) standards
  - [ ] IIFM Ijarah Master Agreement
  - [ ] IIFM Murabaha Master Agreement
- [ ] Green Sukuk Principles (if sustainability module)
- [ ] MLETR (Model Law on Electronic Transferable Records) - for tokenization

---

## 🎨 UI Component Reuse Strategy

### Existing Components to Reuse

#### From V2 (qatar-ijarah-v2)
```typescript
// Already built, tested, and approved
import { TaskCard } from '@/components/v2/TaskCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
```

**TaskCard Props** (reuse as-is):
```typescript
interface TaskCardProps {
  taskId: string
  title: string
  workflowName: string
  stepNumber: number
  totalSteps: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  deadlineAt: string
  primaryAction: 'APPROVE_REJECT' | 'UPLOAD' | 'REVIEW'
  why: string
  policyClause?: string
  aiReasoning: string[]
  chainOfThought?: Array<{
    step: string
    check: string
    result: 'pass' | 'fail' | 'warn'
    evidence?: string
  }>
  evidenceRefs: Array<{
    name: string
    type: string
    url?: string
  }>
  assignedRoles: string[]
}
```

#### Color Palette (from existing demos)
```typescript
// Reuse these exact color schemes
const DEMO_COLORS = {
  // Shariah Governance
  shariah: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    icon: 'text-purple-600'
  },

  // Risk Management
  risk: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    icon: 'text-orange-600'
  },

  // Compliance
  compliance: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    icon: 'text-green-600'
  },

  // Financial Reporting
  financial: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    icon: 'text-blue-600'
  },

  // Contract Gates
  contractGates: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-900',
    icon: 'text-indigo-600'
  }
}
```

#### Icons (from lucide-react - already used)
```typescript
import {
  CheckCircle2,     // Completed tasks
  AlertTriangle,    // Warnings
  Clock,            // Pending/deadlines
  Lock,             // Hard gates (cannot modify)
  Edit3,            // Editable fields
  Calendar,         // Calendar export
  FileText,         // Documents
  Shield,           // Shariah governance
  TrendingUp,       // Risk management
  Target,           // KPIs
  Users             // Roles/assignments
} from 'lucide-react'
```

### New Components to Build

#### 1. JurisdictionSelector.tsx
```typescript
// Ghost card design for jurisdictions
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <Card className="border-2 border-green-200 bg-green-50">
    <CardContent className="p-6">
      <div className="text-4xl mb-2">🇶🇦</div>
      <h3 className="font-semibold text-green-900">Qatar</h3>
      <Badge className="bg-green-600 mt-2">Active</Badge>
    </CardContent>
  </Card>

  <Card className="border-2 border-gray-200 bg-gray-50 opacity-60">
    <CardContent className="p-6">
      <div className="text-4xl mb-2">🇦🇪</div>
      <h3 className="font-semibold text-gray-600">UAE</h3>
      <Badge variant="outline" className="mt-2">Coming Soon</Badge>
    </CardContent>
  </Card>

  {/* More jurisdictions... */}
</div>
```

#### 2. ProductSelector.tsx
```typescript
// Product cards with "Coming Soon" state
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Active products */}
  <Card className="border-2 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
    <CardHeader>
      <CardTitle className="text-purple-900">Ijarah (Islamic Lease)</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-4">
        Asset-based leasing with lessor ownership and maintenance obligations
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Shield className="h-3 w-3" />
        <span>AAOIFI SS-9</span>
      </div>
    </CardContent>
  </Card>

  {/* Coming soon products */}
  <Card className="border-2 border-gray-200 bg-gray-50 opacity-60">
    <CardHeader>
      <CardTitle className="text-gray-600 flex items-center justify-between">
        Sukuk (Islamic Bonds)
        <Badge variant="outline">Coming Soon</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">
        Asset-backed securities with profit-sharing or rental returns
      </p>
    </CardContent>
  </Card>

  {/* More products... */}
</div>
```

#### 3. WorkflowTimeline.tsx
```typescript
// Timeline/checklist format for workflows
<div className="space-y-4">
  {workflow.steps.map((step, idx) => (
    <Card key={step.id} className={step.isHardGate ? 'border-2 border-red-200' : 'border'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-700">{idx + 1}</span>
            </div>
            <div>
              <CardTitle className="text-base">{step.title}</CardTitle>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>

          {step.isHardGate ? (
            <Badge className="bg-red-600">
              <Lock className="h-3 w-3 mr-1" />
              Required
            </Badge>
          ) : (
            <Button variant="outline" size="sm">
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Assigned to:</span>
            <span className="ml-2 font-medium">{step.assignedRole}</span>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <span className="ml-2 font-medium">{step.durationDays} days</span>
          </div>
        </div>

        {step.policyConstraints.map(constraint => (
          <div key={constraint.source} className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-900">{constraint.source}</p>
                <p className="text-xs text-blue-700 mt-1">{constraint.constraint}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  ))}
</div>
```

#### 4. CalendarExportButton.tsx
```typescript
// Export tasks to .ics file with options
<Card>
  <CardHeader>
    <CardTitle className="flex items-center">
      <Calendar className="h-5 w-5 mr-2" />
      Sync Tasks with Calendar
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-gray-600 mb-4">
      Export your tasks to your preferred calendar app
    </p>

    <div className="space-y-2">
      <Button className="w-full justify-start" variant="outline">
        <Calendar className="h-4 w-4 mr-2" />
        Download .ics file (Universal)
      </Button>

      <Button className="w-full justify-start" variant="outline">
        <img src="/icons/google-calendar.svg" className="h-4 w-4 mr-2" />
        Import to Google Calendar
      </Button>

      <Button className="w-full justify-start" variant="outline">
        <img src="/icons/outlook.svg" className="h-4 w-4 mr-2" />
        Import to Outlook
      </Button>

      <Button className="w-full justify-start" variant="outline">
        <img src="/icons/apple-calendar.svg" className="h-4 w-4 mr-2" />
        Import to Apple Calendar
      </Button>
    </div>

    <p className="text-xs text-gray-500 mt-4">
      Tasks will be exported with deadlines, descriptions, and priority levels.
      You can manually import the .ics file to any calendar application.
    </p>
  </CardContent>
</Card>
```

---

## 📅 Development Roadmap

### Phase 1: Foundation (Week 1)
**Goal**: Set up infrastructure, create workflow modules, build configuration page

| Task | Priority | Status | Owner | Est. Time |
|------|----------|--------|-------|-----------|
| Create file structure | 🔴 P0 | ⬜️ Todo | - | 1h |
| Set up Zustand store | 🔴 P0 | ⬜️ Todo | - | 2h |
| Define TypeScript types | 🔴 P0 | ⬜️ Todo | - | 2h |
| Research AAOIFI SS-9 (Ijarah) | 🔴 P0 | ⬜️ Todo | - | 4h |
| Research AAOIFI FAS-28 (Murabaha) | 🔴 P0 | ⬜️ Todo | - | 4h |
| Research AAOIFI FAS-3 (Mudaraba) | 🔴 P0 | ⬜️ Todo | - | 4h |
| Research QCB requirements | 🔴 P0 | ⬜️ Todo | - | 3h |
| Research QFCRA IBANK rules | 🔴 P0 | ⬜️ Todo | - | 3h |
| Create workflow module templates | 🔴 P0 | ⬜️ Todo | - | 6h |
| Build JurisdictionSelector component | 🟡 P1 | ⬜️ Todo | - | 2h |
| Build ProductSelector component | 🟡 P1 | ⬜️ Todo | - | 3h |
| Build ConfigurationForm page | 🟡 P1 | ⬜️ Todo | - | 4h |
| Create workflow assembler logic | 🔴 P0 | ⬜️ Todo | - | 4h |
| Create policy validator | 🔴 P0 | ⬜️ Todo | - | 3h |

**Deliverable**: Working configuration page that generates workflows

---

### Phase 2: Workflow Review (Week 2)
**Goal**: Build workflow review & customization UI

| Task | Priority | Status | Owner | Est. Time |
|------|----------|--------|-------|-----------|
| Build WorkflowTimeline component | 🔴 P0 | ⬜️ Todo | - | 4h |
| Build WorkflowEditor component | 🔴 P0 | ⬜️ Todo | - | 5h |
| Implement constraint validation | 🔴 P0 | ⬜️ Todo | - | 3h |
| Add edit capabilities (moderate level) | 🟡 P1 | ⬜️ Todo | - | 4h |
| Build PolicyConstraintBadge component | 🟡 P1 | ⬜️ Todo | - | 1h |
| Add workflow customization tracking | 🟡 P1 | ⬜️ Todo | - | 2h |
| Create "Deploy Workflows" functionality | 🟡 P1 | ⬜️ Todo | - | 3h |
| Add workflow summary view | 🟢 P2 | ⬜️ Todo | - | 2h |

**Deliverable**: Workflow review page with moderate customization

---

### Phase 3: Dashboard & Tasks (Week 3)
**Goal**: Build role-based dashboard with task management

| Task | Priority | Status | Owner | Est. Time |
|------|----------|--------|-------|-----------|
| Build dashboard router | 🔴 P0 | ⬜️ Todo | - | 1h |
| Build My Tasks page | 🔴 P0 | ⬜️ Todo | - | 6h |
| Implement task filtering (daily/weekly/monthly) | 🔴 P0 | ⬜️ Todo | - | 3h |
| Add task status management | 🔴 P0 | ⬜️ Todo | - | 3h |
| Build CalendarExportButton component | 🟡 P1 | ⬜️ Todo | - | 3h |
| Implement .ics file generation | 🟡 P1 | ⬜️ Todo | - | 4h |
| Build Process Tracking page | 🟡 P1 | ⬜️ Todo | - | 5h |
| Build Overview Dashboard page | 🟡 P1 | ⬜️ Todo | - | 6h |
| Add Islamic GRC risk widgets (SNCR/DCR/RoR) | 🟡 P1 | ⬜️ Todo | - | 4h |
| Implement role-based filtering | 🟢 P2 | ⬜️ Todo | - | 3h |

**Deliverable**: Full role-based dashboard with task management

---

### Phase 4: Polish & Validation (Week 4)
**Goal**: Refine UI, validate workflows with practitioners

| Task | Priority | Status | Owner | Est. Time |
|------|----------|--------|-------|-----------|
| Add loading states & transitions | 🟡 P1 | ⬜️ Todo | - | 3h |
| Add error handling & validation messages | 🔴 P0 | ⬜️ Todo | - | 3h |
| Create demo data for all 3 products | 🔴 P0 | ⬜️ Todo | - | 4h |
| Write workflow documentation | 🟡 P1 | ⬜️ Todo | - | 4h |
| Conduct practitioner validation (Ijarah) | 🔴 P0 | ⬜️ Todo | - | - |
| Conduct practitioner validation (Murabaha) | 🔴 P0 | ⬜️ Todo | - | - |
| Conduct practitioner validation (Mudaraba) | 🔴 P0 | ⬜️ Todo | - | - |
| Incorporate practitioner feedback | 🔴 P0 | ⬜️ Todo | - | 6h |
| Final testing & bug fixes | 🔴 P0 | ⬜️ Todo | - | 4h |
| Deploy to staging | 🟡 P1 | ⬜️ Todo | - | 2h |

**Deliverable**: Production-ready demo validated by Qatar practitioners

---

## 🧪 Validation Plan

### Practitioner Validation Sessions

#### Session 1: Ijarah Workflows
**Target Participants**:
- Shariah Compliance Officer from Qatar Islamic bank
- Risk Officer with Ijarah experience
- Legal/Contracts specialist

**Validation Checklist**:
- [ ] Is the SSB approval workflow accurate?
- [ ] Are the Ijarah contract gates correct per AAOIFI SS-9?
- [ ] Is the "delivery before rent" gate positioned correctly?
- [ ] Are Takaful requirements accurate?
- [ ] Is the maintenance responsibility split correct?
- [ ] Are SNCR monitoring steps appropriate?
- [ ] Are purification workflows correct?
- [ ] Is timing realistic (duration estimates)?
- [ ] Are assigned roles appropriate?

#### Session 2: Murabaha Workflows
**Target Participants**:
- Shariah Compliance Officer
- Trade finance specialist
- Accounting/reporting specialist

**Validation Checklist**:
- [ ] Is the cost disclosure gate accurate per AAOIFI FAS-28?
- [ ] Is the asset ownership requirement correct?
- [ ] Is the promise vs contract distinction clear?
- [ ] Are profit calculation steps accurate?
- [ ] Are reporting requirements complete?

#### Session 3: Mudaraba Workflows
**Target Participants**:
- Investment account specialist
- Risk officer (PER/IRR expert)
- Shariah Compliance Officer

**Validation Checklist**:
- [ ] Is capital verification workflow correct?
- [ ] Are profit-sharing ratio controls accurate?
- [ ] Is loss allocation per AAOIFI FAS-3?
- [ ] Are PER/IRR workflows realistic?
- [ ] Are IAH disclosure requirements complete?
- [ ] Is DCR monitoring appropriate?

---

## 🎯 Success Criteria

### MVP Success Metrics
- [ ] All 3 products (Ijarah, Murabaha, Mudaraba) have complete workflows
- [ ] Qatar practitioners validate workflow accuracy (>90% approval)
- [ ] Users can configure a deal in <5 minutes
- [ ] Workflow customization UI is intuitive (user testing)
- [ ] Task management system is functional (daily/weekly/monthly views)
- [ ] Calendar export works for all major calendar apps (.ics tested)
- [ ] Zero policy violations possible (constraint system works)
- [ ] Demo is visually consistent with V1/V2 (same colors, components)

### Phase 2 Goals (Post-MVP)
- [ ] Add 3 more products (Sukuk, Funds, Takaful)
- [ ] Add 2 more jurisdictions (UAE, Saudi Arabia)
- [ ] Real-time multi-user collaboration
- [ ] AI-powered workflow generation from uploaded documents
- [ ] Integration with external calendar APIs (Google Calendar API)

---

## 📝 Notes & Decisions Log

### Design Decisions
| Date | Decision | Rationale | Approved By |
|------|----------|-----------|-------------|
| 2025-11-10 | Use composable workflow modules | Avoids template explosion, easier to maintain | Sami |
| 2025-11-10 | Timeline/checklist format for workflows | More intuitive than BPMN for non-technical users | Sami |
| 2025-11-10 | Moderate customization level | Balance between flexibility and compliance | Sami |
| 2025-11-10 | Manual .ics export (not API integration) | Simpler MVP, users familiar with import process | Sami |

### Open Questions
| Question | Status | Decision Deadline |
|----------|--------|-------------------|
| Should we add Sukuk to initial scope (4 products)? | 🟡 Open | Before Phase 1 starts |
| Need specific Qatar practitioner contacts? | 🟡 Open | Before Phase 4 |
| Should calendar export include recurring tasks? | 🟡 Open | Before Phase 3 |

---

## 🔗 Related Documentation
- [ISLAMIC_GRC_TERMINOLOGY.md](./ISLAMIC_GRC_TERMINOLOGY.md) - Terminology mapping
- [CLAUDE.md](./CLAUDE.md) - Platform positioning
- [README.md](./README.md) - Platform overview

---

**Last Updated**: November 10, 2025
**Next Review**: Start of Phase 1 development
**Document Owner**: Sami
