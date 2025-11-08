# ZeroH System Architecture & Taxonomy
**Sustainable Islamic Finance Governance Framework**

**Version**: 2.0 (Standards-Aligned)
**Date**: 2025-11-07
**Purpose**: Source of truth for ZeroH demo architecture, taxonomy, and control library
**Status**: Foundation Document - Use this to recreate the entire demo

**Version 2.0 Updates**:
- Standards-aligned taxonomy with explicit references to IFSB, AAOIFI, BNM, FATF, ICMA
- Islamic-specific risks explicitly named (RoR, DCR, SNC, equity investment) per IFSB-1
- Shariah Review and Shariah Audit distinguished per AAOIFI GS-2/GS-3
- Sustainability reporting integrated within FR bucket per ICMA/BNM VBIAF
- All 26 controls now include Standard Reference column

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [5-Bucket Governance Framework](#5-bucket-governance-framework)
3. [Control Library v1 (25 Controls)](#control-library-v1-25-controls)
4. [Platform Architecture](#platform-architecture)
5. [Data Models & Schemas](#data-models--schemas)
6. [Component-to-Control Mapping](#component-to-control-mapping)
7. [AI Agent Specifications](#ai-agent-specifications)
8. [Dashboard Configuration](#dashboard-configuration)
9. [Verifiable Credential Templates](#verifiable-credential-templates)
10. [Implementation Checklist](#implementation-checklist)

---

## Executive Summary

### What is ZeroH?

**ZeroH** is an AI-native GRC (Governance, Risk & Compliance) platform for Islamic finance that uses:
- **5-Bucket Taxonomy** - Structured governance framework
- **Control Library** - Configuration-driven compliance rules
- **AG-UI Protocol** - Agent-user interaction standard
- **Hedera Guardian** - Blockchain anchoring for verifiable credentials
- **AI Agents** - Automated evidence collection and drift detection

### Core Principle

**Configuration-Driven Architecture**: The entire platform is generated from the Control Library. Add a control → system automatically creates tasks, agents, dashboards, and proofs.

### Unique Differentiators

1. **Product-Agnostic**: Works for Sukuk, Murabaha, Ijara, Musharaka, Mudaraba
2. **Standard-Agnostic**: Supports AAOIFI, BNM VBI, ICMA, IFSB, Basel, COSO
3. **Jurisdiction-Agnostic**: Malaysia, UAE, Saudi, UK, Singapore, Qatar
4. **Evidence-Anchored**: Every control execution → Verifiable Credential
5. **AI-Automated**: Agents execute, humans approve checkpoints

---

## 5-Bucket Governance Framework

### Taxonomy Structure

The 5-Bucket Framework is the foundational taxonomy that organizes all governance, risk, and compliance activities. This taxonomy is **standards-aligned** to IFSB, AAOIFI, BNM, FATF, and ICMA requirements.

```
┌────────────────────────────────────────────────────────────┐
│  SUSTAINABLE ISLAMIC FINANCE GOVERNANCE FRAMEWORK          │
│  Standards-Aligned to IFSB/AAOIFI/BNM/FATF/ICMA          │
└────────────────────────────────────────────────────────────┘

1. SHARIAH GOVERNANCE & COMPLIANCE (SG)
   Purpose: Ensure conformity to Shariah principles
   Standards: IFSB-10, AAOIFI GS-1/2/3/11/12, BNM Shariah Governance Policy
   Sub-categories:
   ├─ Shariah Supervisory Board (SSB) Mandate & Fatwa Issuance (GS-1; IFSB-10)
   ├─ Shariah Review (Compliance Function) - ongoing conformity (AAOIFI GS-2; BNM SG)
   ├─ Shariah Risk Management - SNC risk identification & controls (BNM SG)
   ├─ Shariah Audit (Internal/Independent) - periodic execution audits (AAOIFI GS-3/GS-11)
   └─ SNC Event Handling & Purification - incident log, restitution (IFSB-1 §7; AAOIFI)

2. REGULATORY & LEGAL COMPLIANCE (RL)
   Purpose: Satisfy jurisdictional requirements
   Standards: FATF 40 Recommendations, Securities/Listing Guidelines
   Sub-categories:
   ├─ Licensing & Fit-and-Proper (jurisdictional)
   ├─ AML/CFT & Sanctions (FATF 40) - CDD, monitoring, PEP/sanctions, BO records
   ├─ Securities & Trustee Obligations - pre/post-issuance filings, trustee confirmations
   ├─ Data Protection & Sharing - consent, lawful basis, audit trails
   └─ Cross-Border Regime Mapping - map deal to local rulebooks (DIFC, CBB, QFCRA, etc.)

3. RISK MANAGEMENT (RM)
   Purpose: Manage Islamic-specific and conventional risks
   Standards: IFSB-1 Risk Taxonomy, IFSB-12 Liquidity
   Sub-categories:
   ├─ Credit & Counterparty Risk
   ├─ Market Risk (incl. rate benchmarks)
   ├─ Liquidity Risk (IFSB-12 - governance, stress/contingency)
   ├─ Operational Risk (documentation, title, settlement, multi-party handoffs)
   ├─ Rate-of-Return (RoR) Risk (distinct from interest rate risk)
   ├─ Displaced Commercial Risk (DCR) - managing IAH expectations
   ├─ Sharīʿah Non-Compliance (SNC) Risk (cross-links to Bucket 1)
   └─ Equity Investment Risk (for Mushārakah/Muḍārabah)

4. FINANCIAL & PRODUCT REPORTING (FR)
   Purpose: Transparent financials and sustainability reporting
   Standards: AAOIFI FAS/Governance, ICMA GBP/SBP/SLBP, BNM VBIAF
   Sub-categories:
   ├─ AAOIFI/IFRS Financials - presentation, recognition/measurement per product
   ├─ Profit Recognition & Distribution - PLS allocation logic and evidence
   ├─ SPV/Trustee Accounts - segregation & reconciliations
   ├─ Use-of-Proceeds (UoP) Ledger - allocations, drawdowns, evidence
   ├─ KPI/SPT Monitoring (SRI/SLB/SL Sukuk) - annual external verification for SLB
   └─ Post-Issuance Reporting - ICMA/SC templates, change logs, auditor/verifier packs

5. AUDIT & ASSURANCE (AA)
   Purpose: Independent assurance over controls
   Standards: AAOIFI GS-3/GS-11, ICMA External Review Guidelines
   Sub-categories:
   ├─ Internal Audit (Financial/Operational)
   ├─ Shariah Audit - independent view on Shariah execution (AAOIFI GS-3/GS-11)
   ├─ External Financial Audit
   ├─ External Sustainability Assurance / External Review - SPO/pre-issuance review, SLB KPI assurance
   └─ Regulator/Trustee Inspections - readiness packs, selective disclosure
```

### Standards Crosswalk

This table shows how our 5-bucket taxonomy maps to recognized Islamic finance standards:

| ZeroH Bucket | Aligned Standards | Purpose |
|--------------|-------------------|---------|
| **1. Shariah Governance** | IFSB-10 Sharīʿah Governance<br>AAOIFI GS-1/2/3/11/12<br>BNM Shariah Governance Policy (2019) | Formalizes SSB oversight, Shariah risk management, Shariah review/compliance, and Shariah audit as distinct functions |
| **2. Regulatory & Legal** | FATF 40 Recommendations (2025)<br>Securities/Listing Guidelines (e.g., SC Malaysia) | AML/CFT baseline (CDD, monitoring, sanctions), capital markets disclosures, trustee engagement |
| **3. Risk Management** | IFSB-1 Risk Management Principles<br>IFSB-12 Liquidity Risk Management | Canonical Islamic risk taxonomy: credit, market, liquidity, operational, **RoR, DCR, SNC, equity investment risk** |
| **4. Financial & Product Reporting** | AAOIFI FAS + Governance Standards<br>ICMA GBP/SBP/SLBP (2025)<br>BNM VBIAF | Financial presentation, UoP tracking, KPI/SPT verification (required for SLB, recommended for GBP/SBP) |
| **5. Audit & Assurance** | AAOIFI GS-3/GS-11 (Shariah Audit)<br>ICMA External Review Guidelines<br>SLB Verification Requirements | Shariah audit as independent function, external sustainability assurance, regulator inspection readiness |

### Platform Surface Mapping

| Platform Component | Uses Buckets | Purpose |
|-------------------|--------------|---------|
| **Workflow Hub** | 1-4 | Task routing, SLA tracking, approvals |
| **Controls Engine** | 1-5 | Pass/fail evaluation, remediation |
| **Evidence Vault** | All | Artifact collection, versioning, hashing |
| **Proof Layer (Guardian/VC)** | 1, 2, 5 | Verifiable credential issuance |
| **Report Studio** | 4, 5 | ICMA/AAOIFI/regulator packs |
| **Trust Portal** | All | Public/regulator view of proofs |

---

## Control Library v1 (25 Controls)

### Control Schema

Every control follows this structure:

```typescript
interface Control {
  id: string                    // e.g., "SG-01"
  bucket: 1 | 2 | 3 | 4 | 5     // Which governance bucket
  name: string                  // Control name
  purpose: string               // Why this control exists
  trigger: string               // When to execute (frequency/event)
  requiredEvidence: string[]    // What to collect
  owner: string                 // Who executes (role)
  proofType: string             // VC type to mint
  metric: string                // KRI/metric for dashboard
  notes: string                 // Implementation guidance
  ruleSource?: string           // AAOIFI FAS 33, BNM VBI, etc.
  automatable: boolean          // Can agent fully execute?
  verifiable: boolean           // Can blockchain anchor?
}
```

### Bucket 1: Shariah Governance & Compliance (5 controls)

| ID | Control | Purpose | Standard Reference | Trigger | Evidence | Owner | Proof | Metric |
|----|---------|---------|-------------------|---------|----------|-------|-------|--------|
| **SG-01** | SSB Mandate & Fatwa Issuance | Ensure Shariah approval before use | AAOIFI GS-1<br>IFSB-10 §4.1 | Once per product/deal + amendment | Signed fatwa, SSB resolution, scope, conditions | Shariah Board Sec. | VC (approval) | % deals with valid fatwa |
| **SG-02** | Shariah Review (Compliance Function) | Catch SNC risks in docs pre-execution | AAOIFI GS-2<br>BNM SG Policy §6.3 | Per template update & deal pack | Checked clauses list, review minutes, compliance sign-off | Shariah Reviewer | VC + hash of redlined docs | % doc sets reviewed pre-sign |
| **SG-03** | Shariah Risk Management | Identify & control SNC risks | BNM SG Policy §5<br>IFSB-1 Principle 7 | Quarterly risk register update | SNC risk register, ratings, mitigation plans | Shariah Risk Officer | VC (register updated) | % SNC risks with active mitigations |
| **SG-04** | Shariah Audit (Internal/Independent) | Periodic audit of execution vs fatwa | AAOIFI GS-3/GS-11<br>BNM SG Policy §7 | Annual + deal milestones | Audit plan, sampled txns, findings, closures | Shariah Auditor | VC (audit complete) | Findings aging, reopen rate |
| **SG-05** | SNC Event Handling & Purification | Record and rectify non-compliance | IFSB-1 §7.2<br>AAOIFI Shariah Standards | On each suspected SNC | SNC record, computation, donation proof, disclosure | Ops + Shariah | VC (SNC closed) + ledger anchor | Mean time to close SNC |

### Bucket 2: Regulatory & Legal Compliance (5 controls)

| ID | Control | Purpose | Standard Reference | Trigger | Evidence | Owner | Proof | Metric |
|----|---------|---------|-------------------|---------|----------|-------|-------|--------|
| **RL-01** | Licensing & Fit-and-Proper | Operate within permitted scope | Jurisdictional regs (e.g., DFSA, CBB, OJK) | Daily check / renewal cycles | License cert, registry lookup, fit-and-proper attestations | Compliance Officer | VC (license status) | Days to expiry |
| **RL-02** | AML/CFT & Sanctions (FATF 40) | Meet AML/CFT obligations | FATF Rec 10, 11, 12<br>Local AML Acts | Onboarding + periodic refresh | CDD records, PEP/sanctions screening, ongoing monitoring | KYC/AML Officer | VC (CDD complete) | % customers current on refresh |
| **RL-03** | Data Processing Consent & Sharing | Lawful basis for data use | GDPR/local privacy laws<br>(e.g., PDPA Malaysia) | On collection & each share | Consent record, sharing log, lawful basis documentation | DPO/Compliance | VC (consent) + SD presentation | % records with valid consent |
| **RL-04** | Securities & Trustee Obligations | Meet listing/trustee disclosure rules | SC Malaysia Guidelines<br>Exchange Listing Rules | Per schedule (pre/post-issuance) | Filing PDFs, timestamps, trustee confirmations, receipts | Capital Markets Lead | VC (filing done) | On-time filing rate |
| **RL-05** | Cross-Border Regime Mapping | Map deal to local rulebooks | Jurisdictional compliance matrix | Per deal initiation | Jurisdiction analysis, local counsel opinion, compliance matrix | Legal/Compliance | VC (mapping complete) | % deals with documented compliance map |

### Bucket 3: Risk Management (5 controls)

**Note**: This bucket explicitly addresses Islamic-specific risks (RoR, DCR, SNC, equity investment) as per IFSB-1 taxonomy.

| ID | Control | Purpose | Standard Reference | Trigger | Evidence | Owner | Proof | Metric |
|----|---------|---------|-------------------|---------|----------|-------|-------|--------|
| **RM-01** | Credit & Counterparty Risk | Manage counterparty creditworthiness | IFSB-1 Credit Risk<br>Basel III (adapted) | Per counterparty + periodic review | Credit memo, limits, collateral docs, rating | Credit Risk Officer | VC (limit set) | Breach rate, limit utilization |
| **RM-02** | Operational Risk (Asset Transfer) | Prevent doc/settlement/title errors | IFSB-1 Operational Risk | Per Murabaha/Ijara/Wakala transfer | Delivery note, title deed, timestamp, settlement confirmation | Operations | VC (transfer attested) + hash | Exceptions per 100 transfers |
| **RM-03** | Liquidity & RoR Risk | Manage liquidity gaps and rate-of-return expectations | IFSB-12 Liquidity<br>IFSB-1 RoR Risk | Weekly liquidity monitoring | Liquidity gap report, RoR benchmarks, rate changes, stress tests | Treasury | VC (review complete) | Gap thresholds, RoR variance |
| **RM-04** | Displaced Commercial Risk (DCR) | Manage IAH return expectations vs actuals | IFSB-1 DCR<br>AAOIFI FAS 27 | Monthly/quarterly | IAH return analysis, smoothing reserve, market comparisons | Treasury/Risk | VC (DCR review) | DCR reserve adequacy, IAH churn rate |
| **RM-05** | SNC Risk & Equity Investment Risk | Monitor SNC events and equity exposure | IFSB-1 Principle 7 (SNC)<br>IFSB-1 Equity Risk | Quarterly risk register review | SNC risk register, equity exposure reports, Mushārakah/Muḍārabah valuations | Risk Officer | VC (register updated) | # open SNC risks, equity loss rate |

### Bucket 4: Financial & Product Reporting (6 controls)

**Note**: Sustainability reporting (UoP, KPI/SPT) is integrated within this bucket per ICMA/BNM VBIAF requirements.

| ID | Control | Purpose | Standard Reference | Trigger | Evidence | Owner | Proof | Metric |
|----|---------|---------|-------------------|---------|----------|-------|-------|--------|
| **FR-01** | AAOIFI/IFRS Financials | Audit-ready financial statements | AAOIFI FAS (e.g., FAS 28, 33)<br>IFRS 9/15 (adapted) | Monthly close | GL/TB, lineage to source docs, reconciliations | Finance Controller | Hash + VC (close approved) | Reconciling items count |
| **FR-02** | Profit Recognition & Distribution | Fair PLS allocation per structure | AAOIFI FAS 4 (Mudaraba)<br>AAOIFI FAS 7 (Salam/Istisna) | On posting events | PLS calculation, allocation rules, profit distribution report | Finance/Product | VC (calc approved) | Exceptions rate, allocation variance |
| **FR-03** | SPV/Trustee Account Segregation | Proper asset/fund segregation | Trustee/SPV agreements<br>AAOIFI FAS 33 §5 (Sukuk) | Monthly reconciliation | Bank statements, trustee confirmations, segregation matrix | SPV Controller | VC (segregation verified) | Variances, late posts |
| **FR-04** | Use-of-Proceeds (UoP) Ledger | Transparent UoP allocation | ICMA GBP/SBP<br>BNM VBIAF §4.2 | On each draw/use | UoP ledger entry, invoices, approvals, allocation reports | Treasury/PM | VC (allocation approved) + anchor | % allocated, deviations from plan |
| **FR-05** | KPI/SPT Monitoring & Attestation | Evidence for sustainability claims | ICMA SLBP (annual verification)<br>BNM VBIAF KPI Framework | Per KPI schedule (annual for SLB) | Data extract, methodology, **external verifier attestation** | Sustainability Lead | VC (KPI attested) + verifier VC | On-time verification rate |
| **FR-06** | Post-Issuance/Investor Reporting | Transparent ongoing disclosure | ICMA GBP/SBP/SLBP Templates<br>SC Malaysia Guidelines | Quarterly/Annual | Compiled report, UoP allocation, KPI progress, changelog | Capital Markets | VC (report issued) | On-time delivery, investor queries |

### Bucket 5: Audit & Assurance (5 controls)

**Note**: Shariah Audit is kept distinct from Internal Audit per AAOIFI/BNM requirements.

| ID | Control | Purpose | Standard Reference | Trigger | Evidence | Owner | Proof | Metric |
|----|---------|---------|-------------------|---------|----------|-------|-------|--------|
| **AA-01** | Internal Audit (Financial/Operational) | Independent assurance on controls | IIA Standards<br>COSO Framework | Annual plan + audit cycles | Audit plan, sampling, findings, management responses, closures | Internal Audit | VC (audit completed) | Findings aging, reopen rate |
| **AA-02** | Shariah Audit (Independent) | Shariah execution assurance | AAOIFI GS-3/GS-11<br>BNM SG Policy §7 | Annual + per deal milestone | Sampling plan, txn reviews, SNC findings, Shariah audit report | Shariah Auditor | VC (Shariah audit report) | SNC recurrence rate, findings severity |
| **AA-03** | External Financial Audit Support | Efficient external audit | ISA (International Standards on Auditing) | Annual + ad hoc requests | PBC list, evidence bundles, management representation letter | Finance Controller | VC (PBC ready) | PBC request turnaround time |
| **AA-04** | External Sustainability Assurance | Credibility of sustainability data | ICMA External Review Guidelines<br>ICMA SLBP Verification | Pre-issuance (SPO) + annual (SLB KPI verification) | Underlying data, methodology, **external verifier statement**, assurance letter | Sustainability Lead | VC (assurance) + verifier VC | Variance vs prior year, verifier findings |
| **AA-05** | Regulator/Trustee Inspection Ready | Smooth regulator/trustee supervision | Regulator inspection frameworks<br>Trustee agreements | Ad hoc / scheduled inspections | Inspection readiness pack, access logs, selective disclosure bundles | Compliance/Trustee Relations | VC (pack delivered) | Response time, outstanding requests |

---

## Platform Architecture

### High-Level System Design

```
┌──────────────────────────────────────────────────────────────┐
│                      USER INTERFACE LAYER                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ Dashboard  │  │ Task Inbox │  │  Evidence  │             │
│  │  (Home)    │  │ (My Tasks) │  │    Vault   │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ Workflows  │  │   Proofs   │  │   Trust    │             │
│  │  (Steps)   │  │    (VCs)   │  │   Portal   │             │
│  └────────────┘  └────────────┘  └────────────┘             │
└──────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────────────────────────────────────────────────────┐
│                    AG-UI EVENT LAYER                         │
│  Event Bus: message, status, typing, tool_call, state_update│
└──────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────────────────────────────────────────────────────┐
│                     AI AGENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Compliance   │  │  Evidence    │  │    Drift     │       │
│  │   Copilot    │  │  Collection  │  │  Detection   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │    Auto-     │  │  Blockchain  │                         │
│  │ Assignment   │  │ Verification │                         │
│  └──────────────┘  └──────────────┘                         │
└──────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────────────────────────────────────────────────────┐
│                   CONTROL ENGINE LAYER                        │
│  - Load Control Library (25 controls)                        │
│  - Evaluate trigger conditions                               │
│  - Execute control logic (Rego rules)                        │
│  - Track KRIs and metrics                                    │
│  - Generate remediation tasks                                │
└──────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Control Lib  │  │    Deals     │  │   Evidence   │       │
│  │  (Config)    │  │   (State)    │  │    (Vault)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │    Tasks     │  │     VCs      │                         │
│  │   (Queue)    │  │  (Proofs)    │                         │
│  └──────────────┘  └──────────────┘                         │
└──────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN LAYER                            │
│  Hedera Guardian: Policy execution, VC minting, HCS anchoring│
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**:
- Framework: Next.js 14 (App Router)
- UI Components: shadcn/ui (Radix UI)
- State Management: Zustand (AG-UI state)
- Styling: Tailwind CSS
- Protocol: AG-UI (Agent-User Interaction)

**Backend** (Mock for Demo):
- Language: TypeScript
- Data: JSON fixtures (mock-data/)
- Agents: Async generators with delays
- Streaming: Server-Sent Events (SSE) simulation

**Backend** (Production):
- Language: Python + FastAPI
- Control Engine: Rego (OPA) + Python
- Database: PostgreSQL + Neo4j
- Blockchain: Hedera Guardian (MCP)
- AI: Claude 3.5 Sonnet (Anthropic)

---

## Data Models & Schemas

### Control Schema

```typescript
interface Control {
  // Identity
  id: string                    // "SG-01"
  bucket: 1 | 2 | 3 | 4 | 5
  bucketName: string            // "Shariah Governance & Compliance"
  name: string
  purpose: string

  // Execution
  trigger: string               // "Once per product/deal + on amendment"
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'event-driven'
  requiredEvidence: string[]
  owner: string                 // Role name
  automatable: boolean          // Can agent fully execute?

  // Validation
  ruleSource?: string           // "AAOIFI FAS 33 §4.2"
  ruleLogic?: string            // Rego code or natural language
  passThreshold?: number        // For numeric metrics

  // Output
  proofType: string             // "VC (approval)"
  vcSchema?: string             // JSON-LD schema URL
  metric: string                // "% deals with current fatwa"
  metricType: 'percentage' | 'count' | 'duration' | 'score'
  targetValue?: number

  // Implementation
  notes: string
  verifiable: boolean           // Can blockchain anchor?
  selectiveDisclosure: boolean  // Support SD-JWT?
}
```

### Task Schema (Generated from Control)

```typescript
interface AITaskCard {
  // Identity
  id: string                    // "task-SG-02-deal-123"
  controlId: string             // "SG-02"
  dealId: string
  dealName: string

  // Metadata
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'failed'
  createdAt: string             // ISO 8601
  dueDate?: string
  assignedTo: string            // User email or role

  // AI-Generated Content
  summary: string               // Plain English summary
  aiInsight?: string            // Predictive insight

  // Evidence
  evidence: Array<{
    type: 'document' | 'api_response' | 'blockchain_tx' | 'calculation'
    name: string
    status: 'verified' | 'pending' | 'missing' | 'stale'
    source: 'SharePoint' | 'S3' | 'API' | 'Agent' | 'Manual'
    url?: string
    hash?: string
    collectedAt?: string
    lastVerified?: string
  }>

  // Compliance Rule
  rule: {
    standard: string            // "AAOIFI FAS 28 §4.2"
    text: string
    citation_url?: string
  }

  // Agent Proposed Fix
  proposedFix?: {
    description: string
    confidence: number          // 0-100
    actions: Array<{
      type: 'send_email' | 'create_doc' | 'update_field' | 'request_approval' | 'mint_vc'
      params: Record<string, any>
      preview?: string          // For emails/docs
    }>
  }

  // Available Actions
  availableActions: Array<'approve' | 'reject' | 'do_it_for_me' | 'ask_why' | 'delegate'>

  // Execution Log
  executionLog?: Array<{
    timestamp: string
    actor: 'user' | 'agent'
    action: string
    result: 'success' | 'failure'
  }>
}
```

### Evidence Schema

```typescript
interface Evidence {
  // Identity
  id: string                    // "ev-001"
  controlId: string             // "SG-02"
  dealId: string
  name: string

  // Source
  source: 'SharePoint' | 'S3' | 'API' | 'Agent' | 'Manual' | 'Guardian'
  sourcePath?: string           // "Finance/Deals/2024/Sukuk/"
  sourceUrl?: string

  // Collection
  collectedBy: 'agent' | 'user'
  collectedByName?: string      // "evidence-agent" or user email
  collectedAt: string           // ISO 8601

  // Verification
  verified: boolean
  lastVerified?: string
  verifiedBy?: string
  hash?: string                 // SHA-256

  // Verifiable Credential
  vcId?: string                 // "VC-2024-001234"
  hederaTx?: string             // "0.0.123456@1699564800.123"

  // Metadata
  fileType?: string             // "application/pdf"
  fileSize?: number             // bytes
  version?: string
  expiryDate?: string           // For time-sensitive evidence
  stale: boolean                // True if past expiry

  // Selective Disclosure
  selectiveDisclosureEnabled: boolean
  visibilityRules?: Record<string, string[]>  // role → fields visible
}
```

### Verifiable Credential Schema

```typescript
interface VerifiableCredential {
  // W3C VC Standard Fields
  "@context": string[]          // ["https://www.w3.org/2018/credentials/v1", ...]
  type: string[]                // ["VerifiableCredential", "ShariahApprovalCredential"]
  issuer: string                // DID: "did:hedera:mainnet:..."
  issuanceDate: string          // ISO 8601
  expirationDate?: string

  // ZeroH Credential Subject
  credentialSubject: {
    // Control Reference
    controlId: string           // "SG-01"
    controlName: string
    bucketId: number
    bucketName: string

    // Deal Reference
    dealId: string
    dealName: string
    productType: string         // "Sukuk", "Murabaha", etc.

    // Control-Specific Data (varies by control)
    [key: string]: any          // SG-01: fatwa details, RL-02: KYC status, etc.

    // Evidence Reference
    evidenceHash?: string       // SHA-256 of evidence bundle
    evidenceCount?: number

    // Status
    status: 'approved' | 'rejected' | 'conditional' | 'expired'
    conditions?: string[]       // For conditional approvals
  }

  // Blockchain Proof
  proof: {
    type: string                // "Ed25519Signature2020"
    created: string             // ISO 8601
    verificationMethod: string  // DID URL
    proofPurpose: string        // "assertionMethod"
    jws?: string
    hederaTxId?: string         // "0.0.123456@1699564800.123"
  }

  // Selective Disclosure (SD-JWT)
  selectiveDisclosure?: {
    salt?: string
    disclosures?: string[]      // Base64-encoded disclosures
  }
}
```

### Deal Schema

```typescript
interface Deal {
  // Identity
  dealId: string                // "deal-123"
  dealName: string
  productType: 'Sukuk' | 'Murabaha' | 'Ijara' | 'Musharaka' | 'Mudaraba' | 'Istisna'

  // Status
  status: 'draft' | 'in_progress' | 'completed' | 'suspended'
  phase: 'pre-issuance' | 'issuance' | 'post-issuance' | 'audit'
  createdAt: string
  updatedAt: string
  completedAt?: string

  // Parties
  issuer: string
  shariahAdvisor?: string
  auditor?: string
  trustee?: string
  verifier?: string

  // Compliance Scores (by bucket)
  compliance: {
    overall: number             // 0-100
    buckets: {
      shariah: number           // Bucket 1
      regulatory: number        // Bucket 2
      risk: number              // Bucket 3
      financial: number         // Bucket 4
      audit: number             // Bucket 5
    }
  }

  // Control Execution Status
  controls: Array<{
    controlId: string
    status: 'not_started' | 'in_progress' | 'passed' | 'failed' | 'conditional'
    lastExecuted?: string
    nextExecution?: string
    kri?: number                // Latest KRI value
    vcId?: string               // If proof minted
  }>

  // Blockers
  blockers: Array<{
    controlId: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    description: string
    since: string
    assignedTo?: string
  }>

  // Product-Specific Data
  productData?: {
    // Sukuk
    issueAmount?: number
    currency?: string
    maturityDate?: string
    structure?: 'Ijara' | 'Murabaha' | 'Wakala' | 'Musharaka'

    // Murabaha
    assetType?: string
    costPrice?: number
    profitMargin?: number

    // Common
    jurisdiction?: string
    framework?: 'AAOIFI' | 'BNM VBI' | 'ICMA SRI' | 'IFSB'
  }
}
```

### Dashboard Configuration Schema

```typescript
interface DashboardConfig {
  // Overall Platform Metrics
  overall: {
    totalDeals: number
    activeDeals: number
    compliantDeals: number        // 100% compliance
    dealsNeedingAttention: number // < 100% compliance
    overallPlatformCompliance: number  // Average across all deals
  }

  // Bucket-Level Metrics
  buckets: Array<{
    bucketId: number              // 1-5
    bucketName: string
    icon: string                  // Emoji or icon name
    color: string                 // For UI theming

    // Aggregated across all deals
    totalControls: number
    passedControls: number
    failedControls: number
    inProgressControls: number
    score: number                 // 0-100

    // KRIs (from control library)
    kris: Array<{
      controlId: string
      metric: string
      value: number
      target: number
      unit?: string               // "%", "days", "count"
      status: 'pass' | 'warning' | 'fail'
      trend?: 'up' | 'down' | 'stable'
    }>

    // AI-Generated Insights
    insights: string[]            // Natural language insights

    // Actions
    actions: Array<{
      label: string
      route: string
      count?: number              // Badge count
    }>
  }>

  // Predictive Timeline
  prediction?: {
    currentComplianceRate: number
    projectedCompletionDate: string
    bottleneck?: string           // Which bucket/control is slowing
    confidence: number            // 0-100
  }
}
```

---

## Component-to-Control Mapping

### How Controls Generate UI Components

Each control in the library automatically generates multiple UI components:

```typescript
// Example: SG-02 "Pre-Execution Doc Review"

const control = controlLibrary.find(c => c.id === 'SG-02')

// 1. GENERATES TASK CARD
function generateTaskCard(control: Control, deal: Deal): AITaskCard {
  return {
    id: `task-${control.id}-${deal.dealId}`,
    controlId: control.id,
    dealId: deal.dealId,
    dealName: deal.dealName,

    priority: determinePriority(control, deal),  // Based on due date, severity
    summary: generateSummary(control, deal),     // AI-generated plain English

    evidence: control.requiredEvidence.map(evidenceName => ({
      type: 'document',
      name: evidenceName,
      status: 'pending',
      source: 'Agent'
    })),

    rule: {
      standard: control.ruleSource,
      text: control.purpose,
      citation_url: getCitationUrl(control.ruleSource)
    },

    availableActions: ['approve', 'do_it_for_me', 'ask_why']
  }
}

// 2. GENERATES DASHBOARD METRIC
function generateDashboardMetric(control: Control, deals: Deal[]): DashboardMetric {
  const executions = deals.flatMap(d =>
    d.controls.filter(c => c.controlId === control.id)
  )

  const passed = executions.filter(e => e.status === 'passed').length
  const total = executions.length

  return {
    controlId: control.id,
    metric: control.metric,
    value: total > 0 ? (passed / total) * 100 : 0,
    target: control.targetValue || 100,
    status: determineStatus(value, target),
    trend: calculateTrend(executions)
  }
}

// 3. GENERATES AGENT BEHAVIOR
function generateAgentBehavior(control: Control): AgentBehavior {
  return {
    controlId: control.id,

    canAutoExecute: control.automatable,

    evidenceCollectionStrategy: control.requiredEvidence.map(ev => ({
      evidenceName: ev,
      source: determineSource(ev),  // SharePoint, S3, API, etc.
      collectionMethod: 'auto' | 'manual'
    })),

    validationLogic: control.ruleLogic,

    remediationActions: control.notes  // Parse for "Auto-open remediation"
  }
}

// 4. GENERATES VC TEMPLATE
function generateVCTemplate(control: Control): VCTemplate {
  return {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential", `${control.id}Credential`],

    credentialSubject: {
      controlId: control.id,
      controlName: control.name,
      bucketId: control.bucket,
      bucketName: control.bucketName,

      // Control-specific fields (dynamic)
      ...generateControlSpecificFields(control)
    },

    proof: {
      type: "Ed25519Signature2020",
      hederaTxId: "{{HEDERA_TX_ID}}"  // Filled at mint time
    }
  }
}

// 5. GENERATES WORKFLOW STEP
function generateWorkflowStep(control: Control, deal: Deal): WorkflowStep {
  return {
    stepNumber: determineStepNumber(control, deal),
    stepName: control.name,
    controlId: control.id,

    status: 'pending',
    assignedTo: control.owner,
    dueDate: calculateDueDate(control.trigger, deal),

    autoApply: control.automatable,  // Human-in-loop if false

    requiredEvidence: control.requiredEvidence,
    collectedEvidence: []
  }
}
```

### UI Screen → Control Mapping

```typescript
// SCREEN 1: Home Dashboard
// Shows: Aggregated metrics from ALL controls
controls.forEach(control => {
  const metric = generateDashboardMetric(control, deals)
  dashboardConfig.buckets[control.bucket].kris.push(metric)
})

// SCREEN 2: My Tasks
// Shows: Tasks generated from triggered controls
const tasks = controls
  .filter(control => isTriggered(control, deals))
  .flatMap(control => deals.map(deal => generateTaskCard(control, deal)))

// SCREEN 3: Evidence Vault
// Shows: Evidence from all control executions
const evidence = controls.flatMap(control =>
  control.requiredEvidence.map(ev => findEvidence(ev, control))
)

// SCREEN 4: Workflows
// Shows: Workflow steps generated from controls
const steps = controls.map(control => generateWorkflowStep(control, currentDeal))

// SCREEN 5: Proofs
// Shows: VCs minted from completed controls
const vcs = deals.flatMap(deal =>
  deal.controls
    .filter(c => c.status === 'passed' && c.vcId)
    .map(c => getVC(c.vcId))
)

// SCREEN 6: Trust Portal
// Shows: Public-facing proofs (selective disclosure)
const publicProofs = vcs.map(vc => applySelectiveDisclosure(vc, 'customer'))
```

---

## AI Agent Specifications

### Agent Architecture

```typescript
interface Agent {
  id: string
  name: string
  role: string
  capabilities: string[]

  // Which controls this agent supports
  supportedControls: string[]  // Control IDs

  // Execution method
  execute(action: AgentAction): AsyncGenerator<AGUIEvent>

  // State
  context: AgentContext
}

interface AgentAction {
  type: 'collect_evidence' | 'validate_control' | 'mint_vc' | 'send_notification' | 'detect_drift'
  controlId: string
  dealId?: string
  params: Record<string, any>
}

interface AGUIEvent {
  type: 'message' | 'status' | 'typing' | 'tool_call' | 'state_update'
  agentId: string
  timestamp: string
  payload: any
}
```

### Agent 1: Compliance Copilot

```typescript
const complianceCopilot: Agent = {
  id: 'compliance-copilot',
  name: 'Compliance Copilot',
  role: 'Q&A and guidance on controls',

  capabilities: [
    'Answer questions about control requirements',
    'Explain control purpose and AAOIFI standards',
    'Show control execution status',
    'Suggest remediation for failed controls',
    'Cite relevant AAOIFI/BNM/ICMA/IFSB standards'
  ],

  supportedControls: ['*'],  // All controls

  async *execute(action: AgentAction) {
    yield { type: 'typing', agentId: this.id, timestamp: now() }

    // Retrieve control from library
    const control = controlLibrary.find(c => c.id === action.controlId)

    // Generate response using control context + AAOIFI knowledge base
    const response = await generateResponse(action.params.query, control)

    yield {
      type: 'message',
      agentId: this.id,
      timestamp: now(),
      payload: {
        text: response.text,
        citations: response.citations,
        suggestedActions: response.actions
      }
    }
  }
}
```

### Agent 2: Evidence Collection

```typescript
const evidenceAgent: Agent = {
  id: 'evidence-agent',
  name: 'Evidence Collection Agent',
  role: 'Auto-collect evidence for control execution',

  capabilities: [
    'Monitor SharePoint/S3 for new documents',
    'Extract data from APIs (Guardian, KYC providers)',
    'Generate synthetic evidence (checklists, calculators)',
    'Track evidence freshness and alert on stale data'
  ],

  supportedControls: ['*'],  // All controls

  async *execute(action: AgentAction) {
    const control = controlLibrary.find(c => c.id === action.controlId)

    yield { type: 'status', payload: { message: 'Starting evidence collection...' }}

    for (const evidenceName of control.requiredEvidence) {
      yield { type: 'typing', agentId: this.id, timestamp: now() }

      // Determine source
      const source = determineSource(evidenceName)

      // Collect
      yield { type: 'message', payload: { text: `Collecting "${evidenceName}" from ${source}...` }}

      await sleep(1000)  // Simulate collection delay

      const evidence = await collectEvidence(evidenceName, source, action.dealId)

      // Verify
      const verified = await verifyEvidence(evidence)

      yield {
        type: 'tool_call',
        agentId: this.id,
        payload: {
          tool: 'addEvidence',
          params: { evidenceId: evidence.id, verified }
        }
      }

      yield {
        type: 'message',
        payload: { text: `✅ Collected "${evidenceName}" (${verified ? 'verified' : 'pending verification'})` }
      }
    }

    yield { type: 'status', payload: { message: 'Evidence collection complete', status: 'success' }}
  }
}
```

### Agent 3: Drift Detection

```typescript
const driftAgent: Agent = {
  id: 'drift-agent',
  name: 'Drift Detection Agent',
  role: 'Monitor KRIs and alert on control failures',

  capabilities: [
    'Poll KRIs from control library',
    'Compare actual vs target thresholds',
    'Detect SLA breaches (trigger missed)',
    'Alert on policy changes (AAOIFI updates)'
  ],

  supportedControls: ['SG-01', 'SG-04', 'RL-01', 'RL-02', 'RM-05'],  // Time-sensitive controls

  async *execute(action: AgentAction) {
    const control = controlLibrary.find(c => c.id === action.controlId)

    // Check KRI
    const currentValue = await getKRI(control.id, action.dealId)
    const targetValue = control.targetValue

    if (currentValue < targetValue) {
      yield {
        type: 'tool_call',
        agentId: this.id,
        payload: {
          tool: 'sendAlert',
          params: {
            severity: 'high',
            message: `Drift detected: ${control.metric} is ${currentValue} (target: ${targetValue})`
          }
        }
      }

      yield {
        type: 'message',
        payload: {
          text: `⚠️ Compliance drift detected in ${control.name}. Creating remediation task...`
        }
      }

      // Auto-create remediation task
      yield {
        type: 'tool_call',
        payload: {
          tool: 'createTask',
          params: {
            controlId: control.id,
            priority: 'high',
            summary: `Fix ${control.metric} drift (${currentValue} < ${targetValue})`
          }
        }
      }
    }
  }
}
```

### Agent 4: Auto-Assignment

```typescript
const autoAssignmentAgent: Agent = {
  id: 'auto-assignment-agent',
  name: 'Auto-Assignment Agent',
  role: 'Route control tasks to appropriate owners',

  capabilities: [
    'Read Owner field from control',
    'Match to active users/roles',
    'Consider workload and availability',
    'Escalate if no owner available'
  ],

  supportedControls: ['*'],

  async *execute(action: AgentAction) {
    const control = controlLibrary.find(c => c.id === action.controlId)

    // Find users with this role
    const candidates = await findUsersByRole(control.owner)

    // Consider workload
    const assignee = selectLeastBusy(candidates)

    yield {
      type: 'message',
      payload: { text: `Assigning ${control.name} to ${assignee.name} (${assignee.email})` }
    }

    yield {
      type: 'tool_call',
      payload: {
        tool: 'assignTask',
        params: { taskId: action.params.taskId, assignee: assignee.email }
      }
    }

    // Send notification
    yield {
      type: 'tool_call',
      payload: {
        tool: 'sendNotification',
        params: {
          to: assignee.email,
          subject: `New task: ${control.name}`,
          body: `You've been assigned task ${action.params.taskId}`
        }
      }
    }
  }
}
```

### Agent 5: Blockchain Verification

```typescript
const blockchainAgent: Agent = {
  id: 'blockchain-agent',
  name: 'Blockchain Verification Agent',
  role: 'Mint VCs and anchor to Hedera blockchain',

  capabilities: [
    'Generate VC from control execution data',
    'Sign with issuer DID',
    'Submit to Hedera Guardian',
    'Return blockchain TX ID and VC ID'
  ],

  supportedControls: controls.filter(c => c.verifiable).map(c => c.id),

  async *execute(action: AgentAction) {
    const control = controlLibrary.find(c => c.id === action.controlId)

    yield { type: 'message', payload: { text: 'Generating Verifiable Credential...' }}

    // Generate VC
    const vc = generateVCTemplate(control)
    vc.credentialSubject = {
      ...vc.credentialSubject,
      ...action.params.credentialData
    }

    yield { type: 'message', payload: { text: 'Signing credential with issuer DID...' }}

    // Sign
    const signedVC = await signVC(vc, issuerDID)

    yield { type: 'message', payload: { text: 'Submitting to Hedera Guardian...' }}

    // Submit to Guardian
    const result = await submitToGuardian(signedVC)

    yield {
      type: 'tool_call',
      payload: {
        tool: 'updateVC',
        params: {
          vcId: result.vcId,
          hederaTx: result.txId
        }
      }
    }

    yield {
      type: 'message',
      payload: {
        text: `✅ Proof minted! VC: ${result.vcId} | Hedera TX: ${result.txId}`,
        vcId: result.vcId,
        hederaTx: result.txId
      }
    }
  }
}
```

---

## Dashboard Configuration

### Bucket Color Scheme

```typescript
const bucketTheme = {
  1: { name: 'Shariah Governance', color: 'purple', icon: '🕌' },
  2: { name: 'Regulatory & Legal', color: 'orange', icon: '⚖️' },
  3: { name: 'Risk Management', color: 'red', icon: '🛡️' },
  4: { name: 'Financial & Impact', color: 'blue', icon: '📊' },
  5: { name: 'Audit & Assurance', color: 'green', icon: '✓' }
}
```

### Dashboard Generation Logic

```typescript
// Auto-generate dashboard from control library
function generateDashboard(deals: Deal[]): DashboardConfig {
  const config: DashboardConfig = {
    overall: {
      totalDeals: deals.length,
      activeDeals: deals.filter(d => d.status !== 'completed').length,
      compliantDeals: deals.filter(d => d.compliance.overall === 100).length,
      dealsNeedingAttention: deals.filter(d => d.compliance.overall < 100).length,
      overallPlatformCompliance: avg(deals.map(d => d.compliance.overall))
    },
    buckets: []
  }

  // Generate bucket cards
  for (let bucketId = 1; bucketId <= 5; bucketId++) {
    const bucketControls = controlLibrary.filter(c => c.bucket === bucketId)

    const bucketCard = {
      bucketId,
      bucketName: bucketTheme[bucketId].name,
      icon: bucketTheme[bucketId].icon,
      color: bucketTheme[bucketId].color,

      totalControls: bucketControls.length,
      passedControls: 0,
      failedControls: 0,
      inProgressControls: 0,
      score: 0,

      kris: [],
      insights: [],
      actions: []
    }

    // Calculate metrics for each control
    bucketControls.forEach(control => {
      const kri = generateDashboardMetric(control, deals)
      bucketCard.kris.push(kri)

      if (kri.status === 'pass') bucketCard.passedControls++
      if (kri.status === 'fail') bucketCard.failedControls++
      if (kri.status === 'warning') bucketCard.inProgressControls++
    })

    bucketCard.score = (bucketCard.passedControls / bucketCard.totalControls) * 100

    // Generate AI insights
    bucketCard.insights = generateInsights(bucketCard, deals)

    // Generate actions
    bucketCard.actions = generateActions(bucketCard)

    config.buckets.push(bucketCard)
  }

  return config
}
```

---

## Verifiable Credential Templates

### VC Template: SG-01 (Fatwa Approval)

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://zeroh.io/credentials/v1"
  ],
  "type": ["VerifiableCredential", "ShariahApprovalCredential"],
  "issuer": "did:hedera:mainnet:zeroh-shariah-board",
  "issuanceDate": "{{ISO_8601_TIMESTAMP}}",
  "expirationDate": "{{EXPIRY_DATE}}",

  "credentialSubject": {
    "controlId": "SG-01",
    "controlName": "Fatwa Issued for Structure",
    "bucketId": 1,
    "bucketName": "Shariah Governance & Compliance",

    "dealId": "{{DEAL_ID}}",
    "dealName": "{{DEAL_NAME}}",
    "productType": "{{PRODUCT_TYPE}}",

    "fatwa": {
      "number": "{{FATWA_NUMBER}}",
      "version": "{{VERSION}}",
      "scope": "{{SCOPE}}",
      "conditions": [],
      "issuedBy": "{{SHARIAH_BOARD_MEMBER}}",
      "issuedDate": "{{FATWA_DATE}}",
      "expiryDate": "{{FATWA_EXPIRY}}"
    },

    "evidenceHash": "{{SHA256_HASH}}",
    "status": "approved"
  },

  "proof": {
    "type": "Ed25519Signature2020",
    "created": "{{ISO_8601_TIMESTAMP}}",
    "verificationMethod": "did:hedera:mainnet:{{DID_FRAGMENT}}",
    "proofPurpose": "assertionMethod",
    "hederaTxId": "{{HEDERA_TX_ID}}"
  }
}
```

### VC Template: FR-04 (Use-of-Proceeds)

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://icmagroup.org/sustainable-finance/v1"
  ],
  "type": ["VerifiableCredential", "UseOfProceedsCredential"],
  "issuer": "did:hedera:mainnet:zeroh-treasury",
  "issuanceDate": "{{ISO_8601_TIMESTAMP}}",

  "credentialSubject": {
    "controlId": "FR-04",
    "controlName": "Use-of-Proceeds Allocation Logged",
    "bucketId": 4,
    "bucketName": "Financial & Product Reporting",

    "dealId": "{{DEAL_ID}}",
    "dealName": "{{DEAL_NAME}}",

    "useOfProceeds": {
      "totalIssueAmount": {{TOTAL_AMOUNT}},
      "currency": "{{CURRENCY}}",
      "allocated": {{ALLOCATED_AMOUNT}},
      "unallocated": {{UNALLOCATED_AMOUNT}},
      "allocationPercentage": {{PERCENTAGE}},

      "allocations": [
        {
          "projectName": "{{PROJECT_NAME}}",
          "amount": {{AMOUNT}},
          "category": "{{GREEN_PROJECT_CATEGORY}}",
          "allocationDate": "{{DATE}}",
          "invoiceHash": "{{HASH}}"
        }
      ]
    },

    "evidenceHash": "{{SHA256_HASH}}",
    "status": "approved"
  },

  "proof": {
    "type": "Ed25519Signature2020",
    "hederaTxId": "{{HEDERA_TX_ID}}"
  },

  "selectiveDisclosure": {
    "disclosures": [
      "{{BASE64_DISCLOSURE_1}}",
      "{{BASE64_DISCLOSURE_2}}"
    ]
  }
}
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1-2)

**Data Layer**:
- [ ] Create `src/lib/control-library.ts` with 25 controls
- [ ] Create TypeScript types for all schemas (Control, Task, Evidence, VC, Deal)
- [ ] Create mock data fixtures (5 deals, 25 tasks, 50 evidence items, 20 VCs)
- [ ] Implement control → task mapping logic
- [ ] Implement control → KRI mapping logic

**AG-UI Infrastructure**:
- [ ] Set up event bus (`src/lib/ag-ui/event-bus.ts`)
- [ ] Create Zustand store for AG-UI state
- [ ] Build AGUIEventStream component
- [ ] Create mock agent classes (5 agents)
- [ ] Implement event streaming with delays

**Base Components**:
- [ ] Create bucket progress card component
- [ ] Create KRI widget component
- [ ] Create AI insight component
- [ ] Create action button component

### Phase 2: Core Screens (Week 3-4)

**Screen 1: Home Dashboard**:
- [ ] Overall platform metrics card
- [ ] 5 bucket cards with KRIs
- [ ] AI-generated insights
- [ ] Predictive timeline widget
- [ ] Quick actions sidebar

**Screen 2: My Tasks**:
- [ ] Task inbox with filters
- [ ] AI task card component
- [ ] Evidence list with source badges
- [ ] "Do It For Me" button
- [ ] "Ask Why" modal
- [ ] Proposed fix preview

**Screen 3: Evidence Vault**:
- [ ] Evidence list with search/filter
- [ ] Source breakdown chart
- [ ] Evidence detail modal
- [ ] VC badge display
- [ ] Freshness warnings

### Phase 3: Advanced Screens (Week 5-6)

**Screen 4: Workflows**:
- [ ] Workflow step list
- [ ] Auto-apply toggle
- [ ] Agent execution streaming
- [ ] Evidence collection progress
- [ ] Step completion checkmarks

**Screen 5: Proofs (VCs)**:
- [ ] VC list with filters
- [ ] W3C VC JSON viewer
- [ ] Hedera blockchain links
- [ ] Selective disclosure controls
- [ ] Share modal

**Screen 6: Trust Portal**:
- [ ] Public compliance overview
- [ ] Live controls checklist
- [ ] Document repository
- [ ] Proof-constrained AI chatbot
- [ ] Blockchain verification links

### Phase 4: Agent Behaviors (Week 7)

- [ ] Compliance Copilot responses
- [ ] Evidence Collection simulation
- [ ] Drift Detection alerts
- [ ] Auto-Assignment routing
- [ ] Blockchain VC minting

### Phase 5: Polish & Demo (Week 8)

- [ ] Pre-load Sukuk demo scenario
- [ ] Agent event streaming
- [ ] Dashboard auto-updates
- [ ] Loading states
- [ ] Toast notifications
- [ ] Animations
- [ ] Responsive design
- [ ] Demo video recording
- [ ] Sales deck update

---

## Migration from 4-Component to 5-Bucket

### Mapping Strategy

```typescript
// OLD: 4-component model
interface OldDealCompliance {
  shariah: number        // 0-100
  jurisdiction: number
  accounting: number
  impact: number
}

// NEW: 5-bucket model
interface NewDealCompliance {
  buckets: {
    shariah: number           // Bucket 1: Maps from old.shariah
    regulatory: number        // Bucket 2: Maps from old.jurisdiction
    risk: number              // Bucket 3: NEW (calculated from controls)
    financial: number         // Bucket 4: Maps from old.accounting + old.impact
    audit: number             // Bucket 5: NEW (calculated from controls)
  }
}

// Migration function
function migrateCompliance(old: OldDealCompliance): NewDealCompliance {
  return {
    buckets: {
      shariah: old.shariah,
      regulatory: old.jurisdiction,
      risk: calculateRiskScore(deal),  // From RM controls
      financial: avg([old.accounting, old.impact]),
      audit: calculateAuditScore(deal)  // From AA controls
    }
  }
}
```

### UI Component Updates

```typescript
// OLD
<ComponentProgressCard component="shariah" />
<ComponentProgressCard component="jurisdiction" />
<ComponentProgressCard component="accounting" />
<ComponentProgressCard component="impact" />

// NEW
<BucketProgressCard bucketId={1} name="Shariah Governance" />
<BucketProgressCard bucketId={2} name="Regulatory & Legal" />
<BucketProgressCard bucketId={3} name="Risk Management" />
<BucketProgressCard bucketId={4} name="Financial & Impact" />
<BucketProgressCard bucketId={5} name="Audit & Assurance" />
```

---

## Appendix: Standard References

### AAOIFI Standards Covered

- **FAS 28**: Murabaha and Other Deferred Payment Sales
- **FAS 33**: Investment Sukuk
- **SS 21**: Financial Papers (Shares and Bonds)
- **GS 1/2018**: Shariah Governance Systems
- **Ethics Standards**: Professional Ethics for Accountants

### BNM VBI Framework

- **Value-Based Intermediation**: Sustainable Islamic finance principles
- **Impact Measurement**: KPI tracking and reporting
- **Disclosure Requirements**: Transparency and accountability

### ICMA SRI Standards

- **Green Bond Principles**: Use-of-proceeds, project evaluation
- **Social Bond Principles**: Impact reporting
- **Sustainability Bond Guidelines**: Combined green/social

### IFSB Standards

- **IFSB-1**: Risk Management
- **IFSB-17**: Core Principles for Islamic Finance Regulation

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | Claude | Initial architecture document |
| 2.0 | 2025-11-07 | Claude | Standards-aligned refinement: Added IFSB/AAOIFI/BNM/FATF/ICMA references to all controls, explicit Islamic-specific risks (RoR, DCR, SNC, equity), Standards Crosswalk table, updated taxonomy with regulatory terminology |

---

**END OF DOCUMENT**

This document is the source of truth for ZeroH system architecture. All implementation decisions should reference this standards-aligned taxonomy and control library.
