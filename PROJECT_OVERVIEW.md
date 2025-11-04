# Islamic Finance Workflows - Project Overview

**Status**: Phase 1 MVP Demo (Mock Implementation)
**Date**: 2025-11-04
**Version**: 1.0.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Demo Configuration: QIIB Oryx Sustainability Sukuk](#demo-configuration-qiib-oryx-sustainability-sukuk)
3. [10-Step Workflow Architecture](#10-step-workflow-architecture)
4. [Technical Implementation](#technical-implementation)
5. [Key Features](#key-features)
6. [Known Gaps & Limitations](#known-gaps--limitations)
7. [Future Enhancements](#future-enhancements)
8. [Development Learnings](#development-learnings)
9. [Getting Started](#getting-started)

---

## Executive Summary

**Islamic Finance Workflows** is an AI-powered platform for generating AAOIFI-compliant financial documents through a modular, component-based configuration system. The application guides users through a 10-step workflow that culminates in deploying validated Islamic finance structures to the Hedera Guardian blockchain platform.

### Core Value Proposition

- **Modular 4-Component Architecture**: Select Shariah Structure, Jurisdiction, Accounting Framework, and Impact Metrics independently
- **Validation Engine**: Real-time compatibility checking across selected components
- **Human-in-the-Loop UX**: AI assists, human guides and approves
- **Blockchain Deployment**: Direct integration with Hedera Guardian (mock in Phase 1)
- **Demo-Ready**: Pre-configured QIIB Oryx Sustainability Sukuk example

### Phase 1 Status

✅ **Completed**: Full 10-step UI workflow with modular component selection
✅ **Completed**: Mock Guardian deployment simulation with blockchain transaction IDs
✅ **Completed**: BPMN policy structure visualization
✅ **Completed**: Real-time validation engine
⚠️ **Mock**: Guardian API integration (simulated deployment)
⚠️ **Mock**: Document generation (AI-powered extraction planned)
📝 **Documented Gap**: Participant email management UI

---

## Demo Configuration: QIIB Oryx Sustainability Sukuk

The application ships with a pre-configured demo representing a real-world Qatar Islamic finance deal.

### Configuration Details

**Click "Load QIIB Oryx Demo" button** to automatically populate:

| Component | Selection | Details |
|-----------|-----------|---------|
| **Shariah Structure** | Wakala (Agency) | Asset-backed agency structure |
| **Securitization** | ✅ Sukuk Mode ON | Issues tradable Sukuk certificates |
| **Jurisdiction** | Qatar QFC | Qatar Financial Centre regulatory framework |
| **Accounting** | AAOIFI | Accounting and Auditing Organization for Islamic Financial Institutions |
| **Impact Metrics** | • QFC Sustainable Finance<br>• Islamic Social Finance | Dual ESG/sustainability frameworks |
| **Takaful Overlay** | ❌ Not Enabled | No Islamic insurance component |

### Demo Workflow Flow

```mermaid
graph LR
    A[Load Demo] --> B[Step 1: Connect Sources]
    B --> C[Step 2: Wakala Selected]
    C --> D[Step 3: Qatar QFC]
    D --> E[Step 4: AAOIFI]
    E --> F[Step 5: Impact Metrics]
    F --> G[Step 6: Review Config]
    G --> H[Step 7: Configure Details]
    H --> I[Step 8: Review Policy]
    I --> J[Step 9: Test Workflow]
    J --> K[Step 10: Deploy to Hedera]
```

### What Makes This Configuration Special

1. **Multi-Framework Compliance**: Satisfies QFC regulatory requirements + AAOIFI accounting standards
2. **Sustainability Focus**: Incorporates both QFC Sustainable Finance and Islamic Social Finance impact frameworks
3. **Real-World Example**: Based on actual Qatar Islamic Bank (QIIB) structures
4. **Sukuk Securitization**: Demonstrates tradable Islamic bond issuance, not just direct financing

---

## 10-Step Workflow Architecture

The workflow follows a **modular composition pattern** where users build configurations from 4 independent components.

### Step 1: Connect Sources

**Purpose**: Initialize backend services and connect to knowledge graph (Graphiti)

**User Experience**:
- Health check for backend API (FastAPI on port 8000)
- Graphiti connection status display
- Service dependency badges (Backend, Graphiti, Supabase, Vanta)
- Tooltips explaining each service's role

**Technical Details**:
- Calls `/health` endpoint on backend
- Mock Graphiti connection (no real integration in Phase 1)
- Service status stored in Zustand state

**Validation**: User can proceed without connections (relaxed for testing)

---

### Step 2: Select Shariah Structure (Component 1 of 4)

**Purpose**: Choose the Islamic finance mechanism/contract type

**Available Options**:
- **Murabaha** (Cost-Plus Sale)
- **Wakala** (Agency) ⭐ *Used in QIIB Oryx Demo*
- **Ijarah** (Leasing)
- **Musharaka** (Partnership)
- **Mudaraba** (Profit-Sharing)
- **Istisna** (Manufacturing Contract)
- **Salam** (Forward Sale)

**Sub-Decision: Sukuk Toggle**
- ✅ **Sukuk Mode ON**: Securitize as tradable Islamic bonds
- ❌ **Direct Financing**: Non-securitized structure

**User Experience**:
- Card-based selection UI with descriptions
- Toggle switch for Sukuk securitization
- Real-time validation hints

**Validation**: Must select one structure before proceeding

---

### Step 3: Select Jurisdiction (Component 2 of 4)

**Purpose**: Choose legal and regulatory framework

**Available Options**:
- **Qatar QFC** (Qatar Financial Centre) ⭐ *Used in QIIB Oryx Demo*
- **UAE DIFC** (Dubai International Financial Centre)
- **Malaysia SC** (Securities Commission Malaysia)
- **UK FCA** (Financial Conduct Authority)
- **Bahrain CBB** (Central Bank of Bahrain)
- **Saudi CMA** (Capital Market Authority)

**Jurisdiction Details Displayed**:
- Country and regulatory body
- Key regulations (e.g., QFC Rules & Regulations)
- AAOIFI compliance requirement status
- Sukuk issuance framework availability

**User Experience**:
- Filterable search for jurisdictions
- Detailed info cards with regulatory context
- Compatibility hints with previously selected structure

**Validation**: Must select one jurisdiction

---

### Step 4: Select Accounting (Component 3 of 4)

**Purpose**: Choose financial reporting and accounting standards

**Available Options**:
- **AAOIFI** (Accounting and Auditing Organization for Islamic Financial Institutions) ⭐ *Used in QIIB Oryx Demo*
- **IFRS** (International Financial Reporting Standards)
- **GAAP** (Generally Accepted Accounting Principles)
- **Hybrid AAOIFI/IFRS**

**Framework Details**:
- Geographic adoption (e.g., GCC, Malaysia, South Asia for AAOIFI)
- Standard-setting body
- Shariah compliance integration
- Reporting requirements

**User Experience**:
- Card selection with detailed descriptions
- Jurisdiction compatibility warnings
- Real-time validation with selected components

**Validation**: Must select one accounting framework

---

### Step 5: Select Impact Metrics (Component 4 of 4)

**Purpose**: Choose ESG and sustainability measurement frameworks

**Available Options** (Multi-Select):
- **QFC Sustainable Finance** ⭐ *Used in QIIB Oryx Demo*
- **Islamic Social Finance (ISF)** ⭐ *Used in QIIB Oryx Demo*
- **UN SDGs** (Sustainable Development Goals)
- **GRI Standards** (Global Reporting Initiative)
- **SASB** (Sustainability Accounting Standards Board)
- **EU Taxonomy**
- **Green Sukuk Principles**
- **Social Sukuk Principles**

**Impact Framework Details**:
- Focus areas (e.g., Environmental, Social Welfare, Governance)
- Metrics tracked
- Reporting requirements
- Geographic relevance

**User Experience**:
- **Multi-select interface** (unique to this step)
- Checkboxes for selecting multiple frameworks
- Summary of selected metrics
- At least one metric required

**Validation**: Must select at least one impact framework

---

### Step 6: Review Configuration

**Purpose**: Validate 4-component configuration and build deal structure

**What Happens**:
1. **Validation Engine Runs**: Cross-checks all 4 selected components
2. **Compatibility Analysis**: Identifies conflicts (e.g., IFRS not compatible with certain Shariah structures)
3. **Deal Configuration Built**: Generates structured configuration object
4. **Validation Results Displayed**:
   - ✅ Compatible configurations (green badges)
   - ⚠️ Warnings (yellow alerts)
   - ❌ Blocking errors (red alerts)

**Configuration Summary Displayed**:
```
Selected Configuration:
├─ Shariah Structure: Wakala (Sukuk Mode: ON)
├─ Jurisdiction: Qatar QFC
├─ Accounting: AAOIFI
├─ Impact Metrics: QFC Sustainable Finance, Islamic Social Finance
└─ Takaful: Not Enabled
```

**Validation Results**:
- Shariah-Accounting compatibility
- Jurisdiction-Accounting alignment
- Impact metrics applicability
- Sukuk issuance framework availability

**User Experience**:
- Clear pass/fail indicators
- Detailed validation messages
- Ability to go back and adjust selections
- "Configuration Valid" badge when all checks pass

**Validation**: Configuration must pass validation to proceed

---

### Step 7: Configure Details

**Purpose**: Fill in deal-specific parameters and upload optional documents

**Form Fields** (Dynamically Generated from 4 Components):

The form adapts based on selected configuration. For QIIB Oryx Demo:

**General Fields**:
- Deal Name (e.g., "QIIB Oryx Sustainability Sukuk")
- Deal Amount (e.g., "500,000,000")
- Currency (e.g., "QAR", "USD")
- Issue Date
- Maturity Date

**Wakala-Specific Fields**:
- Wakala Fee Percentage
- Investment Strategy Description
- Expected Return Rate

**QFC-Specific Fields**:
- QFC License Number
- Regulatory Contact Person

**AAOIFI-Specific Fields**:
- Financial Year End Date
- Auditor Firm Name

**Impact Metrics Fields**:
- Sustainability Targets (for QFC Sustainable Finance)
- Social Impact Goals (for Islamic Social Finance)

**Document Upload Section**:
- **AAOIFI Documents**: Standards, guidelines, compliance reports
- **Context Documents**: Term sheets, prospectuses, previous transactions
- Drag-and-drop file upload
- File management (view, remove uploaded files)
- AI-powered extraction hint: "AI will extract relevant information from uploaded documents (coming soon)"

**🔴 KNOWN GAP - Participant Management**:
Currently **NOT IMPLEMENTED** in UI. Participant emails are hardcoded in Step 10.

**What Should Be Here**:
- "Workflow Participants" section
- Add participant with role, name, email
- Roles: Issuer, Shariah Advisor, Auditor, Trustee, Asset Manager, Legal Counsel, etc.
- Edit/remove participants
- Email validation
- Minimum 1 participant required (Issuer recommended)

See [KNOWN_GAPS.md](./KNOWN_GAPS.md) for implementation plan.

**User Experience**:
- Dynamic form generation
- Field-level validation
- Optional document uploads
- Form data persists in Zustand state

**Validation**: Relaxed for testing (all fields optional in Phase 1)

---

### Step 8: Review Policy Structure

**Purpose**: Preview the Guardian policy structure (schemas, workflow steps, roles) that will be deployed

**What's Displayed**:

**Policy Metadata**:
- Policy Name: Generated from configuration (e.g., "Wakala Sukuk - Qatar QFC - AAOIFI")
- Policy Version: 1.0.0
- Guardian Standard: Automatically set

**BPMN Workflow Visualization**:
- Interactive BPMN diagram using `bpmn-js` library
- Zoom controls (zoom in, zoom out, fit to viewport)
- Shows workflow steps as BPMN tasks
- Click to inspect individual steps

**Example BPMN Flow**:
```
[Start] → [Issuer Submit Application] → [Shariah Board Review] →
[Auditor Verification] → [Trustee Asset Custody] → [Issue Sukuk Certificates] → [End]
```

**Schema Preview**:
- Data schemas for each step (JSON Schema format)
- Field requirements for participants
- Validation rules

**Role Assignments**:
- Issuer
- Shariah Advisor
- Auditor
- Trustee
- Investor
- Regulator (if applicable)

**User Experience**:
- Read-only policy preview
- BPMN diagram is interactive but not editable
- Collapsible sections for schemas and roles
- Ability to go back and adjust configuration if needed

**Technical Implementation**:
- Policy structure is **generated from the 4-component configuration**
- BPMN XML is constructed based on Shariah structure workflow requirements
- Mock Guardian policy format (real Guardian schema to be integrated in Phase 2)

**Validation**: No validation required (informational step)

---

### Step 9: Test Workflow

**Purpose**: Run a dry-run simulation of the workflow in sandbox mode (not on blockchain)

**What Happens**:
1. **Sandbox Mode Activated**: No real blockchain transactions
2. **Workflow Steps Simulated**: Each participant action is simulated
3. **Progress Tracking**: Real-time progress bar and step-by-step execution log
4. **Mock Participant Actions**:
   - Issuer submits application
   - Shariah Advisor reviews and approves
   - Auditor verifies financials
   - Trustee acknowledges asset custody
   - Sukuk issuance completes

**Execution Log Example**:
```
[09:45:12] Workflow test started in sandbox mode
[09:45:13] ✓ Issuer "ABC Islamic Bank" submitted application
[09:45:15] ✓ Shariah Advisor "Dr. Ahmed Al-Mansouri" approved structure
[09:45:17] ✓ Auditor "XYZ Audit Firm" verified compliance
[09:45:19] ✓ Trustee "DEF Trust Services" confirmed asset custody
[09:45:21] ✓ Sukuk certificates issued successfully
[09:45:22] Workflow test completed successfully
```

**Test Results**:
- ✅ **Success**: All steps completed, ready for live deployment
- ⚠️ **Warnings**: Non-blocking issues identified
- ❌ **Failure**: Blocking errors that must be resolved

**User Experience**:
- "Run Test" button to start simulation
- Real-time progress indicator (0-100%)
- Expandable execution log
- Clear pass/fail result
- Ability to re-run test after configuration changes

**Technical Implementation**:
- Mock simulation with 2-second delays per step
- No real Guardian API calls in Phase 1
- Logs stored in Zustand state

**Validation**: Test must pass to proceed to live deployment

---

### Step 10: Live Execution (Guardian Deployment)

**Purpose**: Deploy validated policy to Hedera Guardian and execute on blockchain

**🔴 MOCK IMPLEMENTATION (Phase 1)**:
This step **simulates** Guardian deployment with realistic blockchain transaction IDs, DIDs, and HashScan links. No actual blockchain transactions occur.

**Deployment Flow**:

**Phase 1: Deploy Policy to Guardian**
- Guardian policy creation
- Policy validation
- **Mock Transaction ID**: `0.0.123456789-1730000000-123456789`
- Duration: ~5 seconds

**Phase 2: Publish to Hedera Blockchain**
- Immutable policy publication on Hedera Consensus Service (HCS)
- **Mock Transaction ID**: `0.0.123456790-1730000005-987654321`
- **Mock HashScan Link**: `https://hashscan.io/testnet/transaction/0.0.123456790-1730000005-987654321`
- Duration: ~8 seconds

**Phase 3: Assign Participant Roles**
- Participant DID (Decentralized Identifier) generation
- Role assignments (Issuer, Shariah Advisor, Auditor, Trustee)
- **Mock DIDs** (W3C DID format):
  - Issuer: `did:hedera:testnet:z6Mk...abc123_0.0.12345`
  - Shariah Advisor: `did:hedera:testnet:z6Mk...def456_0.0.12346`
  - Auditor: `did:hedera:testnet:z6Mk...ghi789_0.0.12347`
  - Trustee: `did:hedera:testnet:z6Mk...jkl012_0.0.12348`
- Duration: ~6 seconds

**Phase 4: Generate Blockchain Records**
- Guardian workflow topic creation on HCS
- **Mock Topic ID**: `0.0.987654`
- Transaction receipts generated
- Duration: ~4 seconds

**Deployment Complete UI**:

```
🎉 Deployment Successful!

Policy Deployed to Hedera Guardian
Policy ID: policy-uuid-12345678-abcd-efgh

Blockchain Transaction Records:
├─ Policy Deployment: 0.0.123456789-1730000000-123456789
├─ Blockchain Publication: 0.0.123456790-1730000005-987654321
└─ Workflow Topic: 0.0.987654

Participants Assigned:
├─ Issuer: ABC Islamic Bank (did:hedera:testnet:z6Mk...abc123_0.0.12345)
├─ Shariah Advisor: Dr. Ahmed Al-Mansouri (did:hedera:testnet:z6Mk...def456_0.0.12346)
├─ Auditor: XYZ Audit Firm (did:hedera:testnet:z6Mk...ghi789_0.0.12347)
└─ Trustee: DEF Trust Services (did:hedera:testnet:z6Mk...jkl012_0.0.12348)

Next Steps:
1. Invite Participants - Send DID credentials to participant emails
2. Configure Signing Keys - Set up cryptographic signing for each role
3. Monitor Progress - Track workflow on HashScan blockchain explorer

[View on HashScan] [Copy Transaction ID] [Download Policy JSON]
```

**🔴 KNOWN GAP - Hardcoded Participants**:
Participant data shown above is **hardcoded** in Step 10. Users cannot currently enter participant emails in the workflow.

**What's Hardcoded**:
```javascript
const participants = [
  { role: 'Issuer', name: 'ABC Islamic Bank', email: 'issuer@abcbank.com' },
  { role: 'Shariah Advisor', name: 'Dr. Ahmed Al-Mansouri', email: 'ahmed@shariahboard.com' },
  { role: 'Auditor', name: 'XYZ Audit Firm', email: 'audit@xyzaudit.com' },
  { role: 'Trustee', name: 'DEF Trust Services', email: 'trustee@deftrust.com' }
]
```

**What Should Happen**:
- Participants should be managed in Step 7 (Configure Details)
- Users should add/edit/remove participants with roles, names, emails
- Step 10 should read from store: `execution?.participants || []`

See [KNOWN_GAPS.md](./KNOWN_GAPS.md) for implementation plan.

**User Experience**:
- "Deploy to Hedera Blockchain" button
- Real-time deployment progress (0-100%)
- Phase-by-phase status updates
- Transaction IDs displayed as they're generated
- Copyable transaction IDs and DIDs
- HashScan links open in new tab
- Success celebration UI with confetti (optional)

**Technical Implementation**:
- Mock deployment with realistic timing (5-8 seconds per phase)
- Generates valid-format Hedera transaction IDs
- Generates valid W3C DID format identifiers
- All data stored in component state (not persisted)
- No real Guardian API calls in Phase 1

**Validation**: Final step - no proceeding to next step

---

## Technical Implementation

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 14.2.18 | React-based full-stack framework |
| **UI Framework** | React 18.3.1 | Component-based UI |
| **Language** | TypeScript 5.x | Type-safe development |
| **State Management** | Zustand 4.5.2 | Lightweight global state |
| **UI Components** | shadcn/ui (Radix UI) | Accessible component primitives |
| **Styling** | Tailwind CSS 3.4.1 | Utility-first CSS framework |
| **BPMN Rendering** | bpmn-js 17.12.1 | BPMN 2.0 diagram visualization |
| **Icons** | Lucide React | Icon library |
| **Backend** | FastAPI (Python) | Backend API (minimal in Phase 1) |
| **Blockchain Platform** | Hedera Guardian | Policy execution (mock in Phase 1) |

### Project Structure

```
D:\projects\Islamic Finance Workflows\
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Main workflow page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── workflow/
│   │   │   ├── WorkflowContainer.tsx        # Main orchestrator
│   │   │   └── steps/
│   │   │       ├── Step1SourceConnection.tsx
│   │   │       ├── Step2SelectShariahStructure.tsx
│   │   │       ├── Step3SelectJurisdiction.tsx
│   │   │       ├── Step4SelectAccounting.tsx
│   │   │       ├── Step5SelectImpact.tsx
│   │   │       ├── Step6ReviewConfiguration.tsx
│   │   │       ├── Step7ConfigureDetails.tsx
│   │   │       ├── Step8ReviewPolicyStructure.tsx
│   │   │       ├── Step3TestWorkflow.tsx
│   │   │       └── Step10LiveExecution.tsx
│   │   ├── bpmn/
│   │   │   └── BpmnViewer.tsx               # BPMN diagram viewer
│   │   └── ui/                              # shadcn/ui components
│   ├── lib/
│   │   ├── store.ts                         # Zustand state management
│   │   ├── types.ts                         # TypeScript type definitions
│   │   ├── validation.ts                    # Validation engine
│   │   ├── backend-client.ts                # Backend API client
│   │   └── service-types.ts                 # Service status types
│   ├── data/
│   │   ├── shariah-structures.ts            # Shariah structure data
│   │   ├── jurisdictions.ts                 # Jurisdiction data
│   │   ├── accounting-frameworks.ts         # Accounting framework data
│   │   └── impact-metrics.ts                # Impact metrics data
│   └── utils/                               # Utility functions
├── backend/
│   └── app/
│       └── main.py                          # FastAPI backend (minimal)
├── KNOWN_GAPS.md                            # Documented gaps and TODOs
├── PROJECT_OVERVIEW.md                      # This document
├── SPEC.md                                  # Technical specification
└── package.json                             # Dependencies
```

### State Management Architecture

**Zustand Store** (`src/lib/store.ts`):

```typescript
interface WorkflowStore {
  // Current workflow execution state
  execution: WorkflowExecution | null

  // Service health status
  servicesStatus: BackendServicesStatus | null

  // Actions
  initializeExecution: (userId: string) => void
  loadDemoConfiguration: () => void
  setShariahStructure: (structure: ShariahStructure | null) => void
  setJurisdiction: (jurisdiction: Jurisdiction | null) => void
  setAccounting: (accounting: AccountingFramework | null) => void
  toggleImpact: (impact: ImpactMetrics) => void
  buildDealConfiguration: () => DealConfiguration | null
  nextStep: () => void
  previousStep: () => void
  // ... more actions
}
```

**WorkflowExecution State** (`src/lib/types.ts`):

```typescript
interface WorkflowExecution {
  // Identifiers
  id: string
  userId: string
  currentStepIndex: number

  // 4-Component Selection
  selectedShariahStructure: ShariahStructure | null
  isSecuritized: boolean  // Sukuk toggle
  selectedJurisdiction: Jurisdiction | null
  selectedAccounting: AccountingFramework | null
  selectedImpacts: ImpactMetrics[]
  selectedTakaful: TakafulOverlay

  // Validation
  dealConfiguration: DealConfiguration | null

  // Step 7: Form data and documents
  formData: Record<string, any>
  uploadedDocuments: { aaoifi: [], context: [] }

  // Step 7: Participants (ADDED, not yet used in UI)
  participants: WorkflowParticipant[]

  // Execution metadata
  status: 'idle' | 'running' | 'completed' | 'error'
  startedAt: string
  completedAt: string | null

  // Logs and citations
  executionLog: LogEntry[]
  citations: Citation[]

  // ... more fields
}
```

### Validation Engine

**File**: `src/lib/validation.ts`

**Purpose**: Cross-validate 4-component configuration for compatibility

**Validation Checks**:

1. **Shariah-Accounting Compatibility**
   - AAOIFI required for most Shariah structures
   - IFRS allowed with Ijarah and Murabaha only
   - Hybrid AAOIFI/IFRS supported for certain jurisdictions

2. **Jurisdiction-Accounting Alignment**
   - GCC jurisdictions (Qatar, UAE, Bahrain, Saudi) prefer AAOIFI
   - Malaysia allows IFRS
   - UK/international jurisdictions flexible

3. **Sukuk Issuance Framework**
   - Check if jurisdiction has Sukuk regulation
   - Verify accounting framework supports Sukuk disclosure

4. **Impact Metrics Applicability**
   - Ensure selected frameworks align with jurisdiction
   - Check if sustainability reporting is mandatory

**Return Type**:
```typescript
interface DealConfiguration {
  isValid: boolean
  validationResults: {
    shariahAccountingCompatibility: ValidationResult
    jurisdictionAccountingAlignment: ValidationResult
    sukukIssuanceFramework: ValidationResult
    impactMetricsApplicability: ValidationResult
  }
  // ... configuration details
}
```

### BPMN Generation

**File**: `src/components/bpmn/BpmnViewer.tsx`

**Library**: `bpmn-js` 17.12.1 (Viewer mode, not Modeler)

**What It Does**:
- Renders BPMN 2.0 XML diagrams
- Provides zoom controls
- Supports element click handlers (not currently used)

**BPMN XML Generation** (Planned for Phase 2):
- Currently mock XML is hardcoded in Step 8
- Real implementation will generate BPMN based on Shariah structure workflow
- Each Shariah structure has predefined workflow steps
- Guardian policy converts BPMN to execution steps

---

## Key Features

### ✅ Implemented Features

1. **Modular 4-Component Selection**
   - Independent selection of Shariah, Jurisdiction, Accounting, Impact
   - Real-time validation across components
   - Sukuk toggle for securitization

2. **Pre-Configured Demo**
   - One-click "Load QIIB Oryx Demo" button
   - Auto-populates all 4 components
   - Advances to Step 2 to show configuration

3. **Dynamic Form Generation**
   - Step 7 form fields adapt to selected configuration
   - Component-specific fields appear based on selections

4. **BPMN Policy Visualization**
   - Interactive BPMN diagram rendering
   - Zoom controls and navigation

5. **Mock Guardian Deployment**
   - Realistic blockchain transaction IDs
   - W3C DID format identifiers
   - HashScan links (valid format, but mock data)
   - Phase-by-phase deployment progress

6. **Service Health Monitoring**
   - Backend API health checks
   - Service dependency badges with tooltips
   - Graphiti connection status

7. **Workflow Navigation**
   - Free navigation between all steps (relaxed validation for testing)
   - Progress bar showing completion percentage
   - Scrollable step indicators with left/right arrows

8. **Responsive Design**
   - Mobile-friendly UI (Tailwind responsive classes)
   - Accessible components (Radix UI primitives)

### ⚠️ Mock Implementations (Phase 1)

1. **Guardian API Integration**
   - No real API calls to Hedera Guardian
   - Mock deployment simulation with realistic timing
   - Transaction IDs are generated, not from blockchain

2. **Document Upload Processing**
   - Files are uploaded and stored in state
   - No AI extraction or parsing (placeholder text shown)

3. **Graphiti Knowledge Graph**
   - Connection status shown, but no real queries
   - Knowledge graph integration planned for context retrieval

4. **Participant Management**
   - TypeScript types defined (`WorkflowParticipant`)
   - State field added to `WorkflowExecution`
   - **UI NOT IMPLEMENTED** - participants hardcoded in Step 10

---

## Known Gaps & Limitations

See [KNOWN_GAPS.md](./KNOWN_GAPS.md) for detailed implementation plans.

### 1. Participant Email Management (Priority: Medium)

**Issue**: Users cannot enter participant information. Emails are hardcoded in Step 10.

**Impact**: Demo shows mock participants, not real workflow participants.

**Status**: TypeScript types completed, UI not implemented.

**Implementation Plan**:
- Add "Workflow Participants" section to Step 7
- CRUD operations for adding/editing/removing participants
- Email validation (RFC 5322 format)
- Role-based validation (e.g., Sukuk requires Trustee + Shariah Advisor)
- Store participants in Zustand state
- Step 10 reads from `execution?.participants || []`

**Effort**: ~4-6 hours

### 2. Real Guardian Integration (Priority: High for Production)

**Issue**: Guardian deployment is fully mocked. No actual blockchain transactions.

**Impact**: Cannot deploy real policies or execute workflows on Hedera.

**Status**: Mock implementation complete, real integration not started.

**Requirements**:
- Guardian node setup (local or hosted)
- Guardian REST API client
- Policy creation and deployment endpoints
- DID generation and management
- Transaction signing with Hedera private keys

**Effort**: ~2-3 weeks for full integration

### 3. AI Document Extraction (Priority: Medium)

**Issue**: Uploaded documents are stored but not processed.

**Impact**: Users must manually enter all form fields (AI-assist not available).

**Status**: Placeholder text shown, no implementation.

**Requirements**:
- Document parsing backend service (PDF, DOCX extraction)
- LLM integration for entity extraction (OpenAI, Anthropic, or local model)
- Confidence scoring for extracted values
- User approval workflow for AI suggestions

**Effort**: ~1-2 weeks

### 4. Citation Verification (Priority: Low)

**Issue**: Removed from 10-step workflow (was Step 11 in 12-step version).

**Impact**: No automated citation checking for AAOIFI standard references.

**Status**: Deliberately removed to streamline workflow.

**Future Consideration**: May add back as optional review step for audit trails.

### 5. Outcome & Download (Priority: Low)

**Issue**: Removed from 10-step workflow (was Step 12).

**Impact**: No final outcome screen with downloadable documents.

**Status**: Deliberately removed - workflow ends at deployment (Step 10).

**Future Consideration**: Add post-deployment screen with:
- Final executed documents
- Blockchain proof of execution
- Participant signature confirmations
- Regulatory filing receipts

---

## Future Enhancements

### Phase 2: Real Guardian Integration

1. **Guardian Node Setup**
   - Deploy Guardian locally or use hosted instance
   - Configure Hedera Testnet credentials
   - Set up policy registry

2. **Policy Deployment**
   - Convert 4-component configuration to Guardian policy JSON
   - Generate BPMN XML programmatically based on Shariah structure
   - Deploy policy via Guardian REST API
   - Handle deployment errors and rollback

3. **Participant Onboarding**
   - Send DID credentials via email
   - Guardian web interface for participant acceptance
   - Role assignment and permissions

4. **Workflow Execution**
   - Track real workflow progress on blockchain
   - Display live updates from Guardian events
   - Handle participant actions (approvals, rejections, signatures)

### Phase 3: AI-Powered Features

1. **Document Intelligence**
   - Extract entities from uploaded documents (deal amount, dates, parties)
   - Auto-populate form fields with confidence scores
   - User approval workflow for AI suggestions
   - Learning from user corrections

2. **Context-Aware Recommendations**
   - Graphiti knowledge graph integration for similar deals
   - Suggest compatible component selections based on past configurations
   - Highlight potential validation issues before selection

3. **Natural Language Configuration**
   - Chat interface for configuring workflows
   - "I want to issue a Wakala Sukuk in Qatar with AAOIFI accounting and sustainability metrics"
   - AI translates to component selections

### Phase 4: Collaboration & Workflow Management

1. **Multi-User Workflows**
   - Team collaboration on deal configuration
   - Role-based access control (Deal Originator, Compliance Officer, Legal)
   - Comment threads on each step

2. **Approval Workflows**
   - Internal approval chains before Guardian deployment
   - Email notifications for approvals
   - Audit trail of all changes

3. **Deal Pipeline Management**
   - Dashboard showing all workflows in progress
   - Status tracking (Draft, Under Review, Approved, Deployed, Live)
   - Analytics on deal volume and types

### Phase 5: Regulatory & Compliance

1. **Automated Compliance Checking**
   - Integration with Vanta for compliance monitoring
   - Real-time regulatory updates from knowledge graph
   - Automatic policy updates when regulations change

2. **Audit Trail & Reporting**
   - Immutable record of all workflow actions
   - Export audit reports for regulators
   - Compliance certificate generation

3. **Multi-Jurisdiction Support**
   - Cross-border deal structuring
   - Multi-regulator approval workflows
   - Automatic regulatory filing generation

---

## Development Learnings

### What Worked Well

1. **Modular 4-Component Architecture**
   - Clear separation of concerns
   - Easy to add new Shariah structures, jurisdictions, etc.
   - Validation engine is extensible

2. **Mock-First Development**
   - Allowed rapid UI development without waiting for backend
   - Realistic mock data makes demo compelling
   - Easy to swap mocks for real implementations later

3. **Zustand State Management**
   - Simple, type-safe global state
   - No Context API complexity
   - Easy to debug with Redux DevTools integration

4. **shadcn/ui Components**
   - High-quality accessible components
   - Consistent design language
   - Easy to customize with Tailwind

5. **Step-Based Workflow Pattern**
   - Clear user journey
   - Easy to add/remove/reorder steps
   - Progress tracking built-in

### Challenges & Solutions

1. **BPMN Integration Complexity**
   - **Challenge**: `bpmn-js` has steep learning curve, requires specific XML structure
   - **Solution**: Started with mock XML, plan to use BPMN builder library in Phase 2
   - **Learning**: Keep BPMN read-only in UI, generate programmatically

2. **Validation Engine Scope**
   - **Challenge**: Initial validation was too strict (blocked all progression)
   - **Solution**: Relaxed validation for testing, plan to make configurable
   - **Learning**: Provide "strict mode" toggle for production vs. demo

3. **Participant Management Gap**
   - **Challenge**: Realized late in development that participants were hardcoded
   - **Solution**: Added TypeScript types and documented gap, UI implementation deferred
   - **Learning**: Do end-to-end user flow testing early to catch UX gaps

4. **Step Reorganization**
   - **Challenge**: Original 13-step workflow was too long, then reduced to 12, then 10
   - **Solution**: Consolidated steps (removed Citation Verification, Outcome & Download)
   - **Learning**: Minimize steps in MVP, add back later if users request

5. **Dev Server Caching Issues**
   - **Challenge**: Next.js `.next` cache caused stale imports after file changes
   - **Solution**: Added cache clear commands (`rm -rf .next && npm run dev`)
   - **Learning**: Clear cache when adding/removing/renaming components

### Code Quality Decisions

1. **TypeScript Strict Mode**
   - All files use TypeScript with strict type checking
   - Interface-first design for all data structures
   - Reduces runtime errors significantly

2. **Component Documentation**
   - All step components have header comments explaining purpose
   - Store actions have JSDoc comments
   - Types have inline documentation

3. **Separation of Concerns**
   - Data files (`/data`) separate from components
   - Validation logic separate from UI
   - Backend client abstraction layer

4. **Mock Data Realism**
   - Used actual Qatar Islamic Bank deal structure for demo
   - Transaction IDs follow Hedera format exactly
   - DIDs use W3C standard format

### Performance Considerations

1. **Lazy Loading** (Not Yet Implemented)
   - All steps currently load upfront
   - Future: Lazy load step components with `next/dynamic`

2. **State Persistence** (Not Yet Implemented)
   - Zustand state is in-memory only
   - Future: Add `persist` middleware for localStorage

3. **BPMN Rendering**
   - BPMN viewer initializes on mount, can be slow for large diagrams
   - Future: Optimize by lazy-loading BPMN viewer component

---

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Python**: 3.10+ (for backend, optional in Phase 1)

### Installation

1. **Clone Repository**:
   ```bash
   cd "D:\projects\Islamic Finance Workflows"
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies** (Optional for Phase 1):
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   pip install -r requirements.txt
   ```

### Running the Application

**Frontend** (Primary):
```bash
npm run dev
```
- Opens on `http://localhost:3040`
- Hot reload enabled

**Backend** (Optional for Phase 1):
```bash
cd backend
.\venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Backend API on `http://localhost:8000`
- Health check: `http://localhost:8000/health`

### Quick Start - Deploy Full Demo (Frontend + Backend)

For the best demo experience, run both frontend and backend servers simultaneously.

#### Option 1: One-Command Deployment

**Windows** (`start-demo.bat` already in project root):
```bash
start-demo.bat
```

**Mac/Linux** (`start-demo.sh` already in project root):
```bash
chmod +x start-demo.sh
./start-demo.sh
```

This will:
- Start backend API (port 8000)
- Start frontend dev server (port 3040)
- Open browser to `http://localhost:3040`
- **Windows**: Press any key to stop both servers
- **Mac/Linux**: Press `Ctrl+C` to stop both servers

#### Option 2: Manual Deployment (Cross-Platform)

**Terminal 1 - Backend API**:
```bash
cd backend
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend Dev Server**:
```bash
npm run dev
```

**Open Browser**:
- Navigate to `http://localhost:3040`

#### Option 3: Frontend Only (Backend Optional in Phase 1)

Backend is **optional** for Phase 1 demo since Step 1 (Connect Sources) allows proceeding without backend connection.

```bash
npm run dev
```

Open `http://localhost:3040` and click "Load QIIB Oryx Demo" to bypass Step 1.

### Deployment Verification

**Check Backend Health** (if running):
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Islamic Finance Workflows Backend",
  "version": "1.0.0",
  "timestamp": "2025-11-04T..."
}
```

**Check Frontend**:
- Navigate to `http://localhost:3040`
- Should see "Islamic Finance Workflows" header
- "Load QIIB Oryx Demo" button visible in top-right

### Using the Demo

1. **Start the app**: `npm run dev` (or run `start-demo.bat`)
2. **Click "Load QIIB Oryx Demo"** button in top-right
3. **Navigate through steps**:
   - Step 2-5: View pre-selected components
   - Step 6: Review validation results
   - Step 7: Optionally edit deal parameters
   - Step 8: View BPMN policy structure
   - Step 9: Run workflow test
   - Step 10: Deploy to "Hedera Blockchain" (mock)

4. **Explore features**:
   - Change Shariah structure and see validation update
   - Toggle Sukuk mode on/off
   - Upload documents (optional)
   - View blockchain transaction IDs and HashScan links

### Production Deployment

#### Frontend (Next.js)

**Build for Production**:
```bash
npm run build
```

**Start Production Server**:
```bash
npm start
```

**Deploy to Vercel** (Recommended):
```bash
npm install -g vercel
vercel
```

**Deploy to Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Environment Variables** (create `.env.local`):
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
NEXT_PUBLIC_GRAPHITI_ENABLED=false
```

#### Backend (FastAPI)

**Build Docker Image**:
```dockerfile
# Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deploy to Cloud**:

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option 2: Render**
```bash
# Create render.yaml
services:
  - type: web
    name: islamic-finance-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```

**Option 3: Google Cloud Run**
```bash
gcloud run deploy islamic-finance-backend \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Troubleshooting

**Issue: "Port 3040 already in use"**
```bash
# Windows: Find and kill process
netstat -ano | findstr :3040
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3040 | xargs kill -9
```

**Issue: Backend not connecting**
- Verify backend is running: `curl http://localhost:8000/health`
- Check firewall settings
- Ensure Python venv is activated

**Issue: BPMN diagram not loading**
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear Next.js cache: `rm -rf .next && npm run dev`

**Issue: Demo button not working**
- Check browser console for errors (`F12`)
- Verify store is initialized (Redux DevTools extension)
- Try manual navigation to Step 2

### Development Mode Features

- **Free Navigation**: Click any step to jump directly (validation relaxed)
- **Dev Server**: Auto-reload on file changes
- **Zustand DevTools**: Install Redux DevTools browser extension to inspect state
- **Hot Reload**: Changes to components reflect immediately

---

## Architecture Decisions

### Why Modular 4-Component Design?

**Problem**: Original template-based approach was inflexible. Users wanted to mix-and-match components.

**Solution**: Break down Islamic finance structures into 4 independent components:
1. Shariah Structure (contract type)
2. Jurisdiction (legal framework)
3. Accounting (reporting standards)
4. Impact Metrics (sustainability frameworks)

**Benefits**:
- Users compose custom configurations
- Easy to add new components without changing workflow
- Validation engine checks cross-component compatibility
- Scales to hundreds of component combinations

### Why 10 Steps (Not 12 or 13)?

**Evolution**:
- **Original**: 13 steps (too many, user fatigue)
- **Iteration 1**: 12 steps (removed one redundant step)
- **Iteration 2**: 10 steps (removed Citation Verification and Outcome & Download)

**Reasoning**:
- Steps 2-5 (component selection) are fast, low cognitive load
- Step 6 (review) is lightweight validation screen
- Citation verification was redundant (built into backend, not user-facing)
- Outcome screen was empty in Phase 1 (no real documents generated yet)

**Future**: May add back Outcome screen when real documents are generated.

### Why Mock Guardian in Phase 1?

**Reasoning**:
1. **Frontend-First Development**: Build compelling UI/UX before backend complexity
2. **Demo-Ready**: Show realistic blockchain deployment without infrastructure
3. **Incremental Integration**: Easier to swap mocks for real Guardian later

**Trade-offs**:
- ✅ Faster development
- ✅ No Hedera Testnet dependencies (avoids rate limits, setup complexity)
- ❌ Cannot test real blockchain interactions
- ❌ Mock data doesn't reveal integration edge cases

**Mitigation**: Phase 2 will replace mocks with real Guardian integration systematically.

---

## Conclusion

**Islamic Finance Workflows** demonstrates a production-ready UI/UX for modular Islamic finance configuration with blockchain deployment. Phase 1 delivers a fully navigable 10-step workflow with realistic mock data, pre-configured QIIB Oryx Sustainability Sukuk demo, and BPMN policy visualization.

**Key Achievements**:
- ✅ Modular 4-component architecture with real-time validation
- ✅ 10-step workflow with clear user journey
- ✅ Mock Guardian deployment with realistic blockchain transaction IDs
- ✅ BPMN policy structure visualization
- ✅ One-click demo configuration

**Next Steps**:
1. Implement participant management UI (KNOWN_GAPS.md)
2. Integrate real Hedera Guardian API (Phase 2)
3. Add AI document extraction (Phase 3)
4. Deploy to production with real blockchain transactions

**Contact & Support**:
- Project Repository: `D:\projects\Islamic Finance Workflows`
- Documentation: [SPEC.md](./SPEC.md), [KNOWN_GAPS.md](./KNOWN_GAPS.md)

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-04
**Author**: AI-Assisted Development (Claude + Developer)
