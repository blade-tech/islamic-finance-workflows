# ZeroH Taxonomy Integration - Complete System Explanation

**Date**: 2025-11-07
**Purpose**: Explain how the 5-bucket sustainable Islamic finance governance framework integrates with the entire ZeroH demo

---

## Executive Summary

The **5-bucket taxonomy** is the **SOURCE OF TRUTH** that drives everything in ZeroH:

- **What agents do** → Execute controls from buckets 1-5
- **What dashboards show** → Display KRIs/metrics from control library
- **What tasks appear** → Generated from control triggers
- **What proofs get minted** → VC types defined in control "Proof Type"
- **What workflows execute** → Guardian policies implementing controls

**Key Insight**: The Control Library v1 (25 controls) IS the product. Everything else is UX on top of this structured governance framework.

---

## How Everything Connects

### 1. The Foundation: 5 Buckets → Control Library

```
5 Buckets (Governance Framework)
  ├─ 1. Shariah Governance & Compliance (SG)
  ├─ 2. Regulatory & Legal Compliance (RL)
  ├─ 3. Risk Management (RM)
  ├─ 4. Financial & Product Reporting (FR)
  └─ 5. Audit & Assurance (AA)
      ↓
Control Library v1 (25+ controls)
  ├─ SG-01: Fatwa Issued for Structure
  ├─ SG-02: Pre-Execution Doc Review
  ├─ RL-01: Licensing Valid & Current
  ├─ RM-03: Credit Approval & Limits
  ├─ FR-04: Use-of-Proceeds Allocation Logged
  └─ AA-04: External Sustainability Verification
      ↓
Each Control Defines:
  ├─ ID (e.g., SG-01)
  ├─ Purpose (why it exists)
  ├─ Trigger/Frequency (when to execute)
  ├─ Required Evidence (what to collect)
  ├─ Owner (who executes)
  ├─ Proof Type (VC to mint)
  ├─ Metric/KRI (dashboard widget)
  └─ Notes (implementation details)
```

**This means**: The control library is a **configuration file** that drives the entire platform. Add a new control → system automatically creates tasks, agents, dashboards, and proofs for it.

---

## 2. Control Library → AI-Native UX Mapping

### Control Structure Maps to UI Components

Each control in the library becomes a **multi-surface experience**:

```typescript
// Example: SG-02 "Pre-Execution Doc Review"
const control_SG_02 = {
  id: "SG-02",
  bucket: "Shariah Governance & Compliance",
  name: "Pre-Execution Doc Review",
  purpose: "Catch SNC risks in docs",
  trigger: "Per template update & per deal pack",
  requiredEvidence: [
    "Checked clauses list",
    "Review minutes"
  ],
  owner: "Shariah Reviewer",
  proofType: "VC + hash of redlined docs",
  metric: "% doc sets reviewed pre-sign",
  notes: "Exceptions auto-open remediation"
}

// This control automatically generates:

// 1. TASK CARD (Screen 2: My Tasks)
{
  taskId: "task-SG-02-deal-123",
  controlId: "SG-02",
  priority: "high",
  summary: "Review contract templates for Sukuk-123 to catch Shariah risks",
  dealId: "deal-123",
  dealName: "Sukuk Issuance - $250M",

  evidence: [
    { type: 'document', name: 'Checked clauses list', status: 'pending', source: 'Agent' },
    { type: 'document', name: 'Review minutes', status: 'pending', source: 'SharePoint' }
  ],

  rule: {
    standard: "AAOIFI Shariah Standard 21",
    text: "All contracts must be reviewed for riba, gharar, and maisir before execution",
    citation_url: "https://aaoifi.com/standard/ss-21/"
  },

  proposedFix: {
    description: "Agent prepared checklist of prohibited clauses to review",
    actions: [
      {
        type: 'open_document',
        params: { documentId: 'checklist-sg-02.pdf' }
      }
    ]
  },

  availableActions: ['approve', 'do_it_for_me', 'ask_why']
}

// 2. DASHBOARD METRIC (Screen 1: Home / Deal Dashboard)
{
  metricId: "SG-02-completion-rate",
  bucket: "Shariah Governance",
  label: "Doc Sets Reviewed Pre-Sign",
  value: 85, // % calculated from control executions
  target: 100,
  trend: "up",
  kri: "% doc sets reviewed pre-sign",
  aiInsight: "85% of document sets reviewed before signing. 3 pending reviews for Nov 8 deadline.",
  actions: [
    { label: "Review Pending Docs", route: "/ai-native/tasks?filter=SG-02" }
  ]
}

// 3. AGENT BEHAVIOR (Background automation)
const evidenceAgent = {
  controlId: "SG-02",
  actions: [
    "Auto-collect 'Checked clauses list' from document repository",
    "Generate checklist from contract templates",
    "Flag clauses containing prohibited terms (riba, gharar, maisir)",
    "Create redlined version highlighting risks",
    "Assign review task to 'Shariah Reviewer' role"
  ]
}

// 4. PROOF (Screen 5: Verifiable Credentials)
const vcTemplate_SG_02 = {
  "@context": "https://www.w3.org/2018/credentials/v1",
  "type": ["VerifiableCredential", "ShariahDocReviewCredential"],
  "issuer": "did:hedera:mainnet:zeroh-shariah-governance",
  "credentialSubject": {
    "controlId": "SG-02",
    "dealId": "deal-123",
    "documentSet": {
      "templateVersion": "v2.1",
      "checkedClauses": 47,
      "exceptions": 0,
      "reviewedBy": "Dr. Ahmed Al-Mansouri",
      "reviewDate": "2024-11-07T10:23:00Z"
    },
    "evidenceHash": "sha256:...", // Hash of redlined docs
    "status": "approved"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-11-07T10:25:00Z",
    "verificationMethod": "did:hedera:mainnet:...",
    "proofPurpose": "assertionMethod",
    "hederaTxId": "0.0.123456@1699564800.123"
  }
}

// 5. WORKFLOW STEP (Screen 4: Workflows)
const workflowStep = {
  stepNumber: 3,
  stepName: "Shariah Document Review",
  controlId: "SG-02",
  status: "in_progress",
  assignedTo: "Dr. Ahmed Al-Mansouri",
  dueDate: "2024-11-08T17:00:00Z",
  autoApply: false, // Requires human review
  evidence: [
    { collected: true, verified: false }
  ],
  agentSummary: "Agent prepared checklist. Awaiting Dr. Ahmed's approval."
}
```

**Key Insight**: ONE control definition → FIVE UI surfaces automatically generated. This is the power of configuration-driven architecture.

---

## 3. Platform Architecture Mapping

### How Each ZeroH Surface Maps to Buckets

```
┌─────────────────────────────────────────────────────────┐
│          ZeroH Platform Architecture                    │
└─────────────────────────────────────────────────────────┘

1. WORKFLOW HUB (Uses Buckets 1-4)
   ├─ Generates task queues from control triggers
   ├─ Routes to owners based on control "Owner" field
   ├─ Tracks SLAs from control "Trigger/Frequency"
   └─ Outputs: Task inbox, assignment notifications

   Example:
   - SG-02 triggers → Task assigned to "Shariah Reviewer"
   - RL-02 triggers → Task assigned to "Onboarding/KYC"
   - RM-03 triggers → Task assigned to "Credit"

2. CONTROLS ENGINE (Uses Buckets 1-5)
   ├─ Evaluates control rules (pass/fail)
   ├─ Suggests remediation based on control "Notes"
   ├─ Monitors KRIs and alerts on breaches
   └─ Outputs: Pass/fail status, remediation workflows

   Example:
   - SG-01: Check if fatwa exists → FAIL → Open "Request fatwa" workflow
   - RL-01: Check license expiry → PASS → Schedule renewal reminder
   - RM-05: Check KPI deviation → FAIL → Alert sustainability team

3. EVIDENCE VAULT (Uses All Buckets)
   ├─ Collects "Required Evidence" from all controls
   ├─ Tracks evidence source (SharePoint, S3, Agent, API)
   ├─ Maintains evidence freshness (last verified)
   └─ Outputs: Evidence repository, source tracking

   Example:
   - SG-02 requires: "Checked clauses list" + "Review minutes"
   - RL-02 requires: "KYC checklist" + "PEP/sanctions results"
   - FR-04 requires: "UoP ledger entry" + "Invoices"

4. PROOF LAYER (Guardian/VC) (Uses Buckets 1, 2, 5)
   ├─ Mints VCs based on control "Proof Type"
   ├─ Anchors to Hedera blockchain
   ├─ Enables selective disclosure per role
   └─ Outputs: Verifiable credentials, blockchain TXs

   Example:
   - SG-01: VC (approval) → Fatwa issuance certificate
   - RL-02: VC (CDD complete) → KYC completion proof
   - AA-04: VC (assurance) → Verifier attestation

5. REPORT STUDIO (Uses Buckets 4 & 5)
   ├─ Compiles reports from control executions
   ├─ Generates ICMA/AAOIFI/regulator packs
   ├─ Assembles evidence bundles for auditors
   └─ Outputs: Structured reports, PBC packs

   Example:
   - FR-06: Post-issuance investor report (auto-compiled from live data)
   - AA-03: External audit PBC list (evidence bundles)
   - RL-04: Market disclosure filing (ICMA SRI template)

6. TRUST PORTAL (Synthesized from All Buckets)
   ├─ Public/regulator view of live proofs
   ├─ AI chatbot constrained to verified data
   ├─ Selective disclosure based on viewer role
   └─ Outputs: Customer-facing compliance portal

   Example:
   - Investor sees: FR-04 (UoP allocation) + FR-05 (KPI attestation)
   - Regulator sees: RL-01 (license) + RL-04 (disclosures)
   - Auditor sees: All buckets (full transparency)
```

---

## 4. AI Agent → Control Execution Mapping

### How Each Agent Type Relates to Buckets

```typescript
// 1. COMPLIANCE COPILOT AGENT
// Bucket coverage: ALL (answers questions about any control)
const complianceCopilot = {
  role: "Q&A and guidance on controls",
  capabilities: [
    "Explain control purpose and requirements",
    "Cite relevant AAOIFI/BNM/ICMA standards",
    "Show control execution status",
    "Suggest remediation for failed controls"
  ],

  exampleQueries: [
    "What's the status of SG-01 for Deal-123?",
    "Why did RL-02 fail for customer ABC?",
    "How do I fix RM-05 KPI deviation?",
    "Show me all overdue controls"
  ],

  dataSource: "Control Library + execution logs + AAOIFI knowledge base"
}

// 2. EVIDENCE COLLECTION AGENT
// Bucket coverage: ALL (collects "Required Evidence" from all controls)
const evidenceAgent = {
  role: "Auto-collect evidence for control execution",
  capabilities: [
    "Monitor SharePoint/S3 for new documents",
    "Extract data from APIs (Guardian, KYC providers)",
    "Generate synthetic evidence (checklists, calculators)",
    "Track evidence freshness and alert on stale data"
  ],

  exampleActions: [
    "SG-02: Generate 'Checked clauses list' from contract templates",
    "RL-02: Fetch 'PEP/sanctions results' from KYC API",
    "FR-04: Extract 'UoP ledger entry' from accounting system",
    "AA-04: Request 'Verifier statement' from external party"
  ],

  outputEvents: [
    { type: 'evidence:collected', controlId: 'SG-02', evidenceId: 'ev-123' },
    { type: 'evidence:stale', controlId: 'RL-02', evidenceId: 'ev-456' }
  ]
}

// 3. DRIFT DETECTION AGENT
// Bucket coverage: Buckets 1, 2, 3 (monitors compliance drift)
const driftAgent = {
  role: "Monitor KRIs and alert on control failures",
  capabilities: [
    "Poll KRIs from control library",
    "Compare actual vs target thresholds",
    "Detect SLA breaches (trigger missed)",
    "Alert on policy changes (AAOIFI updates)"
  ],

  exampleActions: [
    "SG-01: Alert if fatwa expiry < 30 days",
    "RL-01: Alert if license renewal overdue",
    "RM-05: Alert if KPI deviation > tolerance",
    "SG-04: Alert if SNC event not closed in 7 days"
  ],

  outputEvents: [
    { type: 'compliance:drift_detected', controlId: 'SG-01', severity: 'high' },
    { type: 'compliance:sla_breach', controlId: 'RL-02', daysPastDue: 5 }
  ]
}

// 4. AUTO-ASSIGNMENT AGENT
// Bucket coverage: ALL (routes control tasks to owners)
const autoAssignmentAgent = {
  role: "Route control tasks to appropriate owners",
  capabilities: [
    "Read 'Owner' field from control",
    "Match to active users/roles",
    "Consider workload and availability",
    "Escalate if no owner available"
  ],

  exampleActions: [
    "SG-02 triggered → Assign to 'Shariah Reviewer' → Dr. Ahmed",
    "RL-02 triggered → Assign to 'Onboarding/KYC' → Sarah",
    "RM-03 triggered → Assign to 'Credit' → John",
    "AA-04 triggered → Assign to 'Sustainability' → External verifier"
  ],

  outputEvents: [
    { type: 'task:auto_assigned', taskId: 'task-SG-02', assignee: 'Dr. Ahmed' }
  ]
}

// 5. BLOCKCHAIN VERIFICATION AGENT
// Bucket coverage: Buckets 1, 2, 5 (mints VCs for attestations)
const blockchainAgent = {
  role: "Mint VCs and anchor to Hedera blockchain",
  capabilities: [
    "Generate VC from control execution data",
    "Sign with issuer DID",
    "Submit to Hedera Guardian",
    "Return blockchain TX ID and VC ID"
  ],

  exampleActions: [
    "SG-01: Mint VC (approval) after fatwa issuance",
    "RL-02: Mint VC (CDD complete) after KYC approval",
    "AA-04: Mint VC (assurance) after verifier attestation",
    "FR-05: Mint VC (KPI attested) after data verification"
  ],

  outputEvents: [
    { type: 'blockchain:proof_minted', vcId: 'VC-001234', hederaTx: '0.0.123456@...' }
  ]
}
```

**Key Insight**: Agents don't have arbitrary behaviors - they execute **structured control logic** from the library. This makes them predictable, auditable, and configurable.

---

## 5. Dashboard Design → KRI/Metric Mapping

### How Control Metrics Become Dashboard Widgets

Each control defines a **Metric/KRI** that becomes a dashboard widget:

```typescript
// DASHBOARD DATA MODEL (Auto-generated from Control Library)

interface DashboardConfig {
  // Top-level metrics (aggregated across all controls)
  overall: {
    totalControls: 25,
    activeControls: 22,
    passedControls: 18,
    failedControls: 3,
    inProgressControls: 1,
    complianceScore: 81.8  // (passed / active) * 100
  },

  // Bucket-level metrics (grouped by 5 buckets)
  buckets: [
    {
      bucketId: 1,
      bucketName: "Shariah Governance & Compliance",
      controls: 5,
      passed: 4,
      failed: 1,
      score: 80,

      // KRIs from each control
      kris: [
        { controlId: "SG-01", metric: "% deals with current fatwa", value: 100, target: 100, status: "pass" },
        { controlId: "SG-02", metric: "% doc sets reviewed pre-sign", value: 85, target: 100, status: "warning" },
        { controlId: "SG-03", metric: "Exceptions per 100 txns", value: 2, target: 0, status: "fail" },
        { controlId: "SG-04", metric: "Mean time to close SNC", value: 3.2, target: 7, status: "pass" },
        { controlId: "SG-05", metric: "On-time SGF report delivery", value: 1, target: 1, status: "pass" }
      ],

      // AI-generated insights
      insights: [
        "⚠️ SG-03 has 2 Shariah exceptions - need review",
        "💡 SG-02 at 85% - 3 pending doc reviews for Nov 8 deadline",
        "✅ SG-01, SG-04, SG-05 all passing"
      ],

      // Actions user can take
      actions: [
        { label: "Review 2 Shariah Exceptions", route: "/ai-native/tasks?filter=SG-03" },
        { label: "Approve 3 Pending Doc Reviews", route: "/ai-native/tasks?filter=SG-02" }
      ]
    },

    {
      bucketId: 2,
      bucketName: "Regulatory & Legal Compliance",
      controls: 5,
      passed: 5,
      failed: 0,
      score: 100,

      kris: [
        { controlId: "RL-01", metric: "Days to license expiry", value: 90, target: ">30", status: "pass" },
        { controlId: "RL-02", metric: "% customers in refresh window", value: 95, target: 100, status: "pass" },
        { controlId: "RL-03", metric: "% records with valid consent", value: 100, target: 100, status: "pass" },
        { controlId: "RL-04", metric: "On-time disclosure rate", value: 100, target: 100, status: "pass" },
        { controlId: "RL-05", metric: "Exceptions vs plan", value: 0, target: 0, status: "pass" }
      ],

      insights: [
        "✅ All regulatory controls passing",
        "💡 RL-01 license renewal due in 90 days - agent will remind in 60 days"
      ],

      actions: []
    },

    // ... buckets 3, 4, 5
  ],

  // Deal-level metrics (controls applied to specific deal)
  deals: [
    {
      dealId: "deal-123",
      dealName: "Sukuk Issuance - $250M",
      overallCompliance: 88,

      bucketScores: [
        { bucketId: 1, score: 85 },  // Shariah
        { bucketId: 2, score: 100 }, // Regulatory
        { bucketId: 3, score: 90 },  // Risk
        { bucketId: 4, score: 82 },  // Financial
        { bucketId: 5, score: 85 }   // Audit
      ],

      blockers: [
        {
          controlId: "SG-02",
          blocker: "Missing Shariah board minutes from Oct meeting",
          impact: "Blocks Step 5 execution",
          aiSuggestion: "Request from secretary",
          actions: ["do_it_for_me", "ask_why"]
        }
      ]
    }
  ]
}

// DASHBOARD RENDERING (Example: Bucket Card)
function renderBucketCard(bucket: BucketMetrics) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{bucket.bucketName}</CardTitle>
        <Badge className={getScoreColor(bucket.score)}>
          {bucket.score}% Compliant
        </Badge>
      </CardHeader>

      <CardContent>
        {/* KRI widgets */}
        {bucket.kris.map(kri => (
          <div key={kri.controlId} className="kri-widget">
            <span className="kri-label">{kri.metric}</span>
            <div className="kri-value">
              {kri.value}
              {kri.status === 'fail' && (
                <span className="kri-status-fail">⚠️</span>
              )}
            </div>
            <Progress value={(kri.value / kri.target) * 100} />
          </div>
        ))}

        {/* AI insights */}
        <div className="ai-insights">
          {bucket.insights.map((insight, i) => (
            <p key={i} className="text-sm">🤖 {insight}</p>
          ))}
        </div>

        {/* Actions */}
        {bucket.actions.map((action, i) => (
          <Button key={i} onClick={() => navigate(action.route)}>
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
```

**Key Insight**: Dashboards are **NOT hand-coded** - they're **auto-generated** from control KRIs. Add a new control → new dashboard widget appears automatically.

---

## 6. Updated Component Model: 4 → 5 Buckets

### Evolution of Component Architecture

**Current (4-Component Model)**:
```
1. Shariah Compliance
2. Jurisdiction Compliance
3. Accounting Compliance
4. Impact Compliance
```

**New (5-Bucket Model)**:
```
1. Shariah Governance & Compliance (SG)
2. Regulatory & Legal Compliance (RL)
3. Risk Management (RM)
4. Financial & Product Reporting (FR) - includes Accounting + Impact
5. Audit & Assurance (AA)
```

**Mapping**:
- **Old Shariah** → **New Bucket 1** (SG)
- **Old Jurisdiction** → **New Bucket 2** (RL)
- **Old Accounting** → **New Bucket 4** (FR - Financial sub-category)
- **Old Impact** → **New Bucket 4** (FR - Impact sub-category) + **New Bucket 3** (RM - ESG risk)
- **NEW** → **New Bucket 5** (AA - Audit & Assurance)

**Why 5 is Better**:
1. **Risk Management** is now explicit (was implicit across others)
2. **Audit & Assurance** is now separate (was missing)
3. **Financial + Impact** are together (both reporting)
4. Aligns with **industry standards** (Basel, COSO, AAOIFI)

**Dashboard Migration**:
```typescript
// Before
<ComponentProgressCard component="shariah" />
<ComponentProgressCard component="jurisdiction" />
<ComponentProgressCard component="accounting" />
<ComponentProgressCard component="impact" />

// After
<BucketProgressCard bucket={1} name="Shariah Governance" />
<BucketProgressCard bucket={2} name="Regulatory & Legal" />
<BucketProgressCard bucket={3} name="Risk Management" />
<BucketProgressCard bucket={4} name="Financial & Impact" />
<BucketProgressCard bucket={5} name="Audit & Assurance" />
```

---

## 7. Complete Data Flow: Control → VC

### End-to-End Example: SG-01 "Fatwa Issued for Structure"

```
STEP 1: Control Triggers
─────────────────────────
Trigger: "Once per product/deal + on amendment"
Event: New Sukuk deal created (Deal-123)
System: Control Engine detects trigger → Creates task

STEP 2: Task Created
─────────────────────────
Task ID: task-SG-01-deal-123
Control ID: SG-01
Assigned To: "Shariah Board Secretary" (from control "Owner" field)
Due Date: Nov 8, 2024 (calculated from deal timeline)
Status: pending

STEP 3: Evidence Collection Agent Activates
────────────────────────────────────────────
Agent reads control "Required Evidence":
  - "Signed fatwa"
  - "Version"
  - "Scope"
  - "Conditions"

Agent actions:
  1. Generate fatwa request template
  2. Pre-fill from deal data (Sukuk structure, AAOIFI FAS 33)
  3. Attach to task for human review
  4. Set reminder for 2 days before due date

STEP 4: Human Executes Task
─────────────────────────────
User (Shariah Board Secretary):
  1. Reviews agent-prepared request
  2. Submits to Shariah Board
  3. Receives signed fatwa PDF
  4. Uploads evidence to task
  5. Marks task complete

STEP 5: Controls Engine Validates
──────────────────────────────────
Engine checks:
  ✓ All required evidence present
  ✓ Fatwa version matches deal structure
  ✓ Fatwa scope covers all deal components
  ✓ No conditions that block execution

Result: PASS

STEP 6: Blockchain Agent Mints VC
──────────────────────────────────
Agent reads control "Proof Type": "VC (approval)"

Agent generates VC:
{
  "@context": "https://www.w3.org/2018/credentials/v1",
  "type": ["VerifiableCredential", "ShariahApprovalCredential"],
  "issuer": "did:hedera:mainnet:zeroh-shariah-board",
  "issuanceDate": "2024-11-07T10:23:15Z",
  "credentialSubject": {
    "controlId": "SG-01",
    "dealId": "deal-123",
    "fatwa": {
      "number": "2024-11-001",
      "version": "1.0",
      "scope": "Sukuk Issuance - Ijarah structure",
      "conditions": [],
      "issuedBy": "Dr. Ahmed Al-Mansouri",
      "issuedDate": "2024-11-07",
      "expiryDate": "2025-11-07"
    },
    "evidenceHash": "sha256:abc123...",
    "status": "approved"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "hederaTxId": "0.0.123456@1699564800.123"
  }
}

Agent submits to Hedera Guardian
Guardian returns: TX ID, VC ID

STEP 7: Dashboard Updates
──────────────────────────
KRI: "% deals with current fatwa"
Before: 11/12 = 91.7%
After: 12/12 = 100% ✅

AI Insight: "All deals now have current fatwa. SG-01 compliance at 100%."

STEP 8: Trust Portal Updates
─────────────────────────────
Customer view: "Shariah Certified ✓"
Click → Shows VC (selective disclosure: just badge, not full fatwa)

Regulator view: "Shariah Certified ✓"
Click → Shows VC (full disclosure: entire fatwa PDF + conditions)

Auditor view: "Shariah Certified ✓"
Click → Shows VC + evidence trail + Hedera TX
```

**Key Insight**: The control definition drives the ENTIRE workflow - from task creation to VC minting to dashboard updates. Everything is **deterministic** and **auditable**.

---

## 8. Demo Scenario: Sukuk Issuance (Complete Flow)

### How 5 Buckets Execute for One Deal

**Deal**: Sukuk Issuance - $250M Ijarah

**Lifecycle**:

```
PHASE 1: PRE-ISSUANCE (Buckets 1, 2, 3)
───────────────────────────────────────

Controls Triggered:
  SG-01: Fatwa Issued for Structure
  SG-02: Pre-Execution Doc Review
  RL-01: Licensing Valid & Current
  RL-02: KYC/AML Completed (for issuer)
  RL-03: Data Processing Consent
  RM-01: Shariah Risk Register Maintained
  RM-03: Credit Approval & Limits (for underlying assets)

Agent Actions:
  - Evidence Agent collects: License cert, KYC docs, consent records
  - Compliance Copilot answers: "Is our license valid for Sukuk issuance?"
  - Drift Agent monitors: Credit approval expiry dates
  - Auto-Assignment Agent routes: SG-01 to Shariah Board, RL-02 to KYC team

Dashboard Shows:
  - Bucket 1 (Shariah): 80% (4/5 controls passed)
  - Bucket 2 (Regulatory): 100% (5/5 controls passed)
  - Bucket 3 (Risk): 90% (2/3 controls passed)
  - Overall: 88%
  - Blocker: SG-02 missing Shariah board minutes

User Actions:
  - Click "Do It For Me: Request minutes from secretary"
  - Agent sends email, updates task
  - Dashboard auto-updates to 95%

PHASE 2: ISSUANCE (Bucket 4)
────────────────────────────

Controls Triggered:
  FR-01: Journal Lineage & Reconciliation
  FR-03: SPV/Trustee Account Segregation
  FR-04: Use-of-Proceeds Allocation Logged
  RL-04: Market/Trustee Disclosures Filed

Agent Actions:
  - Evidence Agent collects: SPV bank statements, UoP invoices
  - Blockchain Agent mints: VC for UoP allocation
  - Compliance Copilot answers: "How much UoP allocated so far?"

Dashboard Shows:
  - Bucket 4 (Financial): 82% (3/4 controls passed)
  - UoP Allocation: $180M / $250M = 72%
  - Blocker: FR-04 missing invoice for $70M drawdown

User Actions:
  - Upload invoice for $70M
  - Agent verifies, mints VC
  - Dashboard updates to 100%

PHASE 3: POST-ISSUANCE (Buckets 4, 5)
──────────────────────────────────────

Controls Triggered:
  FR-05: KPI/SPT Collection & Attestation
  FR-06: Post-Issuance/Investor Reporting
  AA-04: External Sustainability Verification

Agent Actions:
  - Evidence Agent collects: KPI data from project APIs
  - Compliance Copilot answers: "Are we on track for SPT targets?"
  - Blockchain Agent mints: VC for quarterly investor report

Dashboard Shows:
  - Bucket 4 (Impact): 95% (KPIs on target)
  - Bucket 5 (Audit): 85% (verifier reviewing)
  - Overall: 93%

User Actions:
  - Review quarterly report
  - Click "Approve & Make Proof"
  - Agent mints VC, publishes to Trust Portal

PHASE 4: AUDIT (Bucket 5)
─────────────────────────

Controls Triggered:
  AA-01: Internal Audit Plan Executed
  AA-02: Shariah Audit Conducted
  AA-03: External Financial Audit Support
  AA-05: Regulator/Trustee Inspection Ready

Agent Actions:
  - Evidence Agent assembles: PBC list for external auditors
  - Compliance Copilot answers: "Show me all VCs for Deal-123"
  - Blockchain Agent provides: Hedera TX links for verification

Dashboard Shows:
  - Bucket 5 (Audit): 100% (all audits complete)
  - Overall: 100% ✅

Trust Portal:
  - Customer sees: "100% Compliant ✓" badge
  - Regulator sees: All 25 VCs with blockchain proofs
  - Auditor sees: Full evidence trail + execution logs
```

**Key Insight**: The demo shows the ENTIRE lifecycle of a Sukuk deal through the 5-bucket framework. Every control executes, every KRI updates, every VC mints - all visible in real-time dashboards.

---

## 9. Why This Taxonomy Makes ZeroH Productizable

### From Demo → Production

**The Problem with Most Compliance Platforms**:
- Hard-coded workflows (can't adapt to new standards)
- Manual dashboards (don't update automatically)
- Siloed data (evidence disconnected from proofs)
- No agent automation (humans do everything)

**How ZeroH's Taxonomy Solves This**:

1. **Configuration-Driven** → Add new control in config file, system auto-generates UI
2. **Standard-Agnostic** → Works for AAOIFI, BNM VBI, ICMA, Basel, COSO
3. **Product-Agnostic** → Works for Sukuk, Murabaha, Ijara, Musharaka
4. **Jurisdiction-Agnostic** → Works for Malaysia, UAE, Saudi, UK, Singapore
5. **Evidence-Anchored** → Every control execution creates blockchain proof
6. **AI-Automated** → Agents execute controls, humans approve checkpoints

**Production Roadmap**:

```
PHASE 1: Demo (Mock Controls)
  - 25 controls from Control Library v1
  - Mock data (pre-scripted Sukuk deal)
  - Simulated agent behaviors
  - Static dashboards

PHASE 2: MVP (Real Controls)
  - Integrate Rego engine for control rules
  - Connect to real data sources (SharePoint, S3, APIs)
  - Real Guardian/Hedera integration
  - Dynamic dashboards from control KRIs

PHASE 3: Scalable (Control Library v2)
  - Expand to 100+ controls (10-20 per bucket)
  - Multi-product support (Sukuk, Murabaha, etc.)
  - Multi-jurisdiction support (BNM, AAOIFI, ICMA)
  - Customer-configurable controls

PHASE 4: Enterprise (Multi-Tenant)
  - Multiple organizations on one platform
  - Custom control libraries per customer
  - White-label Trust Portal
  - SLA monitoring & alerting
```

---

## 10. Immediate Next Steps

### What to Build First

**Week 1-2: Foundation**
- [ ] Create Control Library data model (TypeScript types)
- [ ] Build control → task mapping logic
- [ ] Build control → KRI dashboard mapping
- [ ] Mock 5 controls (1 per bucket) with full flow

**Week 3-4: AI-Native UX**
- [ ] Screen 1: Home dashboard with bucket cards
- [ ] Screen 2: Task inbox showing control-generated tasks
- [ ] Screen 3: Evidence vault with control requirements
- [ ] Screen 5: Proof viewer showing control VCs

**Week 5-6: Demo Polish**
- [ ] Pre-load Sukuk demo scenario
- [ ] Agent behaviors for 5 controls
- [ ] Dashboard auto-updates
- [ ] Trust Portal with selective disclosure

---

## Summary: The Big Picture

```
5-Bucket Taxonomy (Governance Framework)
    ↓
Control Library (25+ controls)
    ↓
┌─────────────────────────────────────────────┐
│ AI Agents Execute Controls                  │
│ - Evidence Collection                       │
│ - Drift Detection                           │
│ - Auto-Assignment                           │
│ - Blockchain Verification                   │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ Multi-Surface UX                            │
│ - Dashboards (KRIs)                         │
│ - Task Inbox (control triggers)             │
│ - Evidence Vault (required evidence)        │
│ - Proof Layer (VCs)                         │
│ - Workflows (execution steps)               │
│ - Trust Portal (selective disclosure)       │
└─────────────────────────────────────────────┘
    ↓
Customer Value
- Automated compliance execution
- Real-time visibility
- Blockchain-anchored proofs
- Audit-ready evidence
- Regulatory reporting
```

**The taxonomy is not just a classification system - it's the PRODUCT ARCHITECTURE that drives everything in ZeroH.**

---

**Questions for Discussion**:
1. Should we build all 25 controls or focus on 5 key controls first (1 per bucket)?
2. Do you want the demo to show one product (Sukuk) or multiple products?
3. Should we use real AAOIFI/BNM standards or simplified mock standards?
4. Timeline for this taxonomy integration: 2 weeks? 4 weeks?

Ready to proceed when you are!
