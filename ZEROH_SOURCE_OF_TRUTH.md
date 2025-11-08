# ZeroH Source of Truth
**AI-Native GRC for Sustainable Islamic Finance**

**Version**: 1.0
**Date**: 2025-01-07
**Status**: Foundation Document - Authoritative Reference
**Purpose**: Single source of truth for architecture, standards, controls, and implementation

---

## Document Authority

This document is the **definitive specification** for ZeroH. All implementation decisions, technical designs, control definitions, and architectural patterns must reference this document. When conflicts arise between this document and other materials, this document takes precedence.

**Change Control**: Updates require approval from Product, Engineering, and Shariah Advisory leads.

---

## Table of Contents

1. [Vision & Positioning](#vision--positioning)
2. [Core Principles](#core-principles)
3. [Standards-Aligned 5-Bucket Taxonomy](#standards-aligned-5-bucket-taxonomy)
4. [Control Library v1 (Standards-Referenced)](#control-library-v1-standards-referenced)
5. [Architecture: The Four Ledgers](#architecture-the-four-ledgers)
6. [Data Model (Relational Backbone)](#data-model-relational-backbone)
7. [AI Agent Specifications](#ai-agent-specifications)
8. [Proof Layer (Verifiable Credentials)](#proof-layer-verifiable-credentials)
9. [Implementation Patterns](#implementation-patterns)
10. [Validation Criteria](#validation-criteria)

---

## Vision & Positioning

### The Problem

Islamic finance institutions operate in a **multi-stakeholder compliance environment**:
- **Shariah boards** require proof of ongoing conformity (fatwa compliance, SNC handling)
- **Regulators** demand AML/CFT, disclosure, and risk management evidence (FATF, local authorities)
- **Investors** expect transparent Use-of-Proceeds and sustainability KPI verification (ICMA standards)
- **External auditors** need complete evidence trails for Shariah and financial audits
- **Trustees** require timely filings and confirmations

Current solutions are inadequate:
- **Generic GRC platforms** (ServiceNow, Vanta) lack Islamic-specific controls (SNC, DCR, RoR risks)
- **Manual processes** create evidence gaps and compliance drift
- **PDF-based disclosures** are unverifiable and inflexible
- **Siloed systems** disconnect Shariah governance from risk management from financial reporting

### ZeroH Solution

**ZeroH** is the **AI-native GRC platform for Islamic finance** that:
1. **Turns rules into workflows** - Standards (AAOIFI, IFSB, ICMA) become executable controls
2. **Monitors controls continuously** - Real-time visibility across 5 governance buckets
3. **Issues verifiable proofs** - DID/VC attestations that stakeholders independently verify
4. **Automates evidence collection** - AI agents gather artifacts, humans approve checkpoints
5. **Enables selective disclosure** - Share exactly what each stakeholder needs to see

**Positioning**: *ServiceNow + Vanta + Hedera Guardian for Islamic Finance*

### Differentiators

- **Standards-agnostic**: Works with AAOIFI, BNM VBI, ICMA, IFSB, Basel, COSO
- **Product-agnostic**: Supports Sukuk, Murabaha, Ijara, Musharaka, Mudaraba, Istisna, Salam
- **Jurisdiction-agnostic**: Malaysia, UAE, Saudi Arabia, Qatar, UK, Singapore
- **Configuration-driven**: Control library defines everything; UI auto-generates
- **Proof-first**: Every control execution can produce a blockchain-anchored VC

---

## Core Principles

### 1. Configuration-Driven Architecture

**Axiom**: The Control Library IS the product. Everything else (UI, agents, dashboards, proofs) auto-generates from structured controls.

**Implication**: Adding a new control to the library automatically creates:
- Task generation logic (when control triggers)
- Dashboard widgets (control KRI/metric)
- Agent behaviors (evidence collection strategy)
- VC templates (proof structure)
- Workflow steps (execution sequence)

### 2. Multi-Stakeholder by Design

**Axiom**: Every control execution must support selective disclosure to different audiences.

**Stakeholders**:
- **Internal**: Business units, Shariah reviewers, risk officers, finance, operations
- **Board**: Shariah Supervisory Board, audit committee, executive management
- **External**: Regulators, trustees, external auditors, Shariah auditors, sustainability verifiers
- **Market**: Investors, rating agencies, research analysts

**Implication**: VCs must use selective disclosure (SD-JWT/BBS+) by default; access control is role-based.

### 3. Proof-First Sharing

**Axiom**: Verifiable receipts, not email attachments.

**Pattern**: approval/attestation → mint VC → anchor critical checkpoints → share via presentation

**Benefits**:
- **Tamper-evident**: Cryptographic proof of integrity
- **Independently verifiable**: Stakeholders check without calling issuer
- **Portable**: Standard W3C VC format works across systems
- **Privacy-preserving**: Selective disclosure shows only relevant claims

### 4. Human-in-the-Loop AI

**Axiom**: Agents propose, humans approve, system proves.

**AI role**: Draft controls, map rules, collect evidence, prepare filings, explain decisions
**Human role**: Approve material actions, resolve exceptions, sign attestations
**System role**: Record decisions, mint proofs, track status, alert on drift

**Anti-pattern**: Silent AI decision-making without audit trails or explanations

### 5. Standards Fidelity

**Axiom**: Use regulator terminology exactly; cite primary sources.

**Practice**:
- Control names match standard language (e.g., "Shariah Review" per AAOIFI GS-2, not "Doc check")
- Evidence requirements reflect standard mandates
- Risk taxonomy uses IFSB-1 categories explicitly (RoR, DCR, SNC, equity investment)
- Reporting templates align to ICMA/AAOIFI formats

---

## Standards-Aligned 5-Bucket Taxonomy

### Overview

The **5-Bucket Framework** organizes all governance, risk, and compliance activities into five domains aligned to recognized Islamic finance standards.

```
┌────────────────────────────────────────────────────────────┐
│  SUSTAINABLE ISLAMIC FINANCE GOVERNANCE FRAMEWORK          │
│  Standards-Aligned: IFSB/AAOIFI/BNM/FATF/ICMA            │
└────────────────────────────────────────────────────────────┘
```

### Bucket 1: Shariah Governance & Compliance (SG)

**Purpose**: Ensure conformity to Shariah principles across product lifecycle

**Standards**: IFSB-10 (Sharīʿah Governance), AAOIFI GS-1/2/3/11/12, BNM Shariah Governance Policy (2019)

**Sub-domains**:
1. **Shariah Supervisory Board (SSB) Mandate & Fatwa Issuance** (AAOIFI GS-1; IFSB-10 §4.1)
2. **Shariah Review (Compliance Function)** - Ongoing conformity checking (AAOIFI GS-2; BNM SG §6.3)
3. **Shariah Risk Management** - SNC risk identification & controls (BNM SG §5; IFSB-1 Principle 7)
4. **Shariah Audit (Internal/Independent)** - Periodic execution audits (AAOIFI GS-3/GS-11; BNM SG §7)
5. **SNC Event Handling & Purification** - Incident logging, restitution (IFSB-1 §7.2; AAOIFI guidance)

**Key Distinction**: Shariah **Review** (compliance function, ongoing) vs Shariah **Audit** (independent assurance, periodic) per AAOIFI/BNM requirements.

### Bucket 2: Regulatory & Legal Compliance (RL)

**Purpose**: Satisfy jurisdictional legal and regulatory requirements

**Standards**: FATF 40 Recommendations (2025), Securities/Listing Guidelines (jurisdictional)

**Sub-domains**:
1. **Licensing & Fit-and-Proper** - Operate within permitted scope
2. **AML/CFT & Sanctions (FATF 40)** - CDD, ongoing monitoring, PEP/sanctions, beneficial ownership
3. **Securities & Trustee Obligations** - Pre/post-issuance filings, trustee confirmations
4. **Data Protection & Sharing** - Consent, lawful basis, audit trails (GDPR/PDPA)
5. **Cross-Border Regime Mapping** - Map deals to local rulebooks (DIFC, CBB, QFCRA, SC Malaysia)

### Bucket 3: Risk Management (RM)

**Purpose**: Manage Islamic-specific and conventional financial risks

**Standards**: IFSB-1 (Risk Management Principles), IFSB-12 (Liquidity Risk Management)

**Islamic-Specific Risks** (IFSB-1 canonical taxonomy):
- **Rate-of-Return (RoR) Risk** - Distinct from interest rate risk; managing profit distribution expectations
- **Displaced Commercial Risk (DCR)** - Managing Investment Account Holders' (IAH) return expectations vs actuals
- **Sharīʿah Non-Compliance (SNC) Risk** - Risk of transaction non-conformity to Shariah
- **Equity Investment Risk** - For profit-sharing structures (Mushārakah/Muḍārabah)

**Conventional Risks**:
- Credit & Counterparty Risk
- Market Risk (including rate benchmarks)
- Liquidity Risk (IFSB-12 governance, stress/contingency planning)
- Operational Risk (documentation, title transfer, settlement, multi-party handoffs)

### Bucket 4: Financial & Product Reporting (FR)

**Purpose**: Transparent financial statements and sustainability disclosures

**Standards**: AAOIFI FAS (Financial Accounting Standards), ICMA GBP/SBP/SLBP (2025), BNM VBIAF

**Sub-domains**:
1. **AAOIFI/IFRS Financials** - Statement presentation, recognition/measurement per product
2. **Profit Recognition & Distribution** - PLS (Profit-Loss Sharing) allocation logic and evidence
3. **SPV/Trustee Account Segregation** - Proper asset/fund segregation and reconciliations
4. **Use-of-Proceeds (UoP) Ledger** - Allocation tracking, drawdowns, invoice evidence (ICMA GBP/SBP)
5. **KPI/SPT Monitoring** - Sustainability/SLB targets (ICMA SLBP requires **annual external verification**)
6. **Post-Issuance Reporting** - Quarterly/annual investor reports (ICMA/SC templates)

**Key Integration**: Sustainability reporting is not separate; it's part of financial/product reporting per ICMA and BNM VBIAF frameworks.

### Bucket 5: Audit & Assurance (AA)

**Purpose**: Independent assurance over governance, controls, and disclosures

**Standards**: AAOIFI GS-3/GS-11 (Shariah Audit), ICMA External Review Guidelines, ISA (International Standards on Auditing)

**Sub-domains**:
1. **Internal Audit (Financial/Operational)** - Independent assurance on control effectiveness
2. **Shariah Audit (Independent)** - Shariah execution assurance (AAOIFI GS-3/GS-11; BNM SG §7)
3. **External Financial Audit** - Annual statutory audit support
4. **External Sustainability Assurance / External Review** - SPO (Second Party Opinion), SLB KPI verification (ICMA)
5. **Regulator/Trustee Inspections** - Inspection readiness, selective disclosure bundles

**Key Distinction**: Shariah Audit is a separate function from Internal Audit per AAOIFI/BNM requirements.

### Standards Crosswalk Table

| ZeroH Bucket | Aligned Standards | Citation Purpose |
|--------------|-------------------|------------------|
| **1. Shariah Governance** | IFSB-10 Sharīʿah Governance<br>AAOIFI GS-1/2/3/11/12<br>BNM Shariah Governance Policy (2019) | Formalizes SSB oversight, Shariah risk management, distinct Shariah review vs audit functions |
| **2. Regulatory & Legal** | FATF 40 Recommendations (2025)<br>Securities/Listing Guidelines (jurisdictional) | AML/CFT baseline (CDD, monitoring, sanctions), capital markets disclosures, trustee engagement |
| **3. Risk Management** | IFSB-1 Risk Management Principles<br>IFSB-12 Liquidity Risk Management | Canonical Islamic risk taxonomy: RoR, DCR, SNC, equity investment risk + conventional risks |
| **4. Financial & Product Reporting** | AAOIFI FAS + Governance Standards<br>ICMA GBP/SBP/SLBP (2025)<br>BNM VBIAF | Financial presentation, UoP tracking, KPI/SPT verification (required for SLB, recommended for GBP/SBP) |
| **5. Audit & Assurance** | AAOIFI GS-3/GS-11 (Shariah Audit)<br>ICMA External Review Guidelines<br>ISA | Shariah audit as independent function, external sustainability assurance, regulator inspection readiness |

---

## Control Library v1 (Standards-Referenced)

### Control Schema

Every control follows this structure:

```typescript
interface Control {
  // Identity
  id: string                    // Format: {BUCKET}-{NN} e.g., "SG-01"
  bucket: 1 | 2 | 3 | 4 | 5     // Governance bucket
  bucketName: string
  name: string                  // Control name (use standard terminology)
  purpose: string               // Why this control exists

  // Standard Reference (NEW - REQUIRED)
  standardReference: string     // e.g., "AAOIFI GS-1; IFSB-10 §4.1"
  citationUrl?: string          // Link to primary source

  // Execution
  trigger: string               // When to execute
  frequency?: 'event-driven' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  requiredEvidence: string[]    // What artifacts to collect
  owner: string                 // Role name (not person)

  // Validation
  ruleLogic?: string            // Rego code or natural language rule
  passThreshold?: number        // For numeric metrics

  // Output
  proofType: string             // VC type to mint
  vcSchema?: string             // JSON-LD schema URL
  metric: string                // KRI/KPI for dashboard
  metricType: 'percentage' | 'count' | 'duration' | 'score' | 'amount'
  targetValue?: number

  // Implementation
  notes: string                 // Implementation guidance
  automatable: boolean          // Can agent fully execute?
  verifiable: boolean           // Mint VC/blockchain anchor?
  selectiveDisclosure: boolean  // Support minimal disclosure?
}
```

### Bucket 1: Shariah Governance & Compliance (5 Controls)

| ID | Control | Purpose | Standard Reference | Trigger | Required Evidence | Owner | Proof Type | Metric/KRI | Notes |
|----|---------|---------|-------------------|---------|-------------------|-------|------------|------------|-------|
| **SG-01** | SSB Mandate & Fatwa Issuance | Ensure Shariah approval before product use | AAOIFI GS-1<br>IFSB-10 §4.1 | Once per product/deal + amendment | Signed fatwa, SSB resolution, version, scope, conditions | Shariah Board Secretary | VC (FatwaApprovalCredential) | % deals with current valid fatwa | Link fatwa to product structure; track expiry |
| **SG-02** | Shariah Review (Compliance Function) | Catch SNC risks in docs pre-execution | AAOIFI GS-2<br>BNM SG Policy §6.3 | Per template update & per deal pack | Checked clauses list, review minutes, compliance sign-off | Shariah Reviewer | VC (ShariahReviewCredential) + doc hash | % doc sets reviewed pre-sign | Auto-flag prohibited clauses (riba, gharar, maisir) |
| **SG-03** | Shariah Risk Management | Identify & control SNC risks | BNM SG Policy §5<br>IFSB-1 Principle 7 | Quarterly risk register update | SNC risk register, ratings, mitigation plans, ownership | Shariah Risk Officer | VC (RiskRegisterCredential) | % SNC risks with active mitigations | Cross-links to RM-05 |
| **SG-04** | Shariah Audit (Internal/Independent) | Periodic audit of execution vs fatwa | AAOIFI GS-3/GS-11<br>BNM SG Policy §7 | Annual + deal milestones | Audit plan, sampled transactions, findings, management responses, closures | Shariah Auditor | VC (ShariahAuditCredential) | Findings aging (days), reopen rate | Independent from Shariah Review function |
| **SG-05** | SNC Event Handling & Purification | Record and rectify non-compliance | IFSB-1 §7.2<br>AAOIFI Shariah Standards | On each suspected SNC event | SNC incident record, computation, donation/purification proof, disclosure | Operations + Shariah | VC (SNCClosureCredential) + ledger anchor | Mean time to close SNC (days) | Links to financial adjustments in FR bucket |

### Bucket 2: Regulatory & Legal Compliance (5 Controls)

| ID | Control | Purpose | Standard Reference | Trigger | Required Evidence | Owner | Proof Type | Metric/KRI | Notes |
|----|---------|---------|-------------------|---------|-------------------|-------|------------|------------|-------|
| **RL-01** | Licensing & Fit-and-Proper | Operate within permitted scope | Jurisdictional (DFSA, CBB, OJK, etc.) | Daily check / renewal cycles | License certificate, registry lookup, fit-and-proper attestations | Compliance Officer | VC (LicenseStatusCredential) | Days to expiry; gaps=0 | Multi-jurisdiction tracking |
| **RL-02** | AML/CFT & Sanctions (FATF 40) | Meet AML/CFT obligations | FATF Rec 10, 11, 12<br>Local AML Acts | Onboarding + periodic refresh | CDD records, PEP/sanctions screening logs, ongoing monitoring evidence | KYC/AML Officer | VC (CDDCompleteCredential) | % customers current on refresh | Auto-reminders for refresh windows |
| **RL-03** | Data Processing Consent & Sharing | Lawful basis for personal data use | GDPR / Local Privacy Laws (e.g., PDPA Malaysia) | On collection & each share event | Consent record, sharing log, lawful basis documentation | DPO / Compliance | VC (ConsentCredential) + SD presentation | % records with valid consent | Selective disclosure enforced |
| **RL-04** | Securities & Trustee Obligations | Meet listing/trustee disclosure rules | SC Malaysia Guidelines<br>Exchange Listing Rules | Per schedule (pre/post-issuance) | Filing PDFs, timestamps, trustee confirmations, receipts | Capital Markets Lead | VC (FilingCompleteCredential) | On-time filing rate (%) | Generates regulator/trustee packs |
| **RL-05** | Cross-Border Regime Mapping | Map deal to applicable local rulebooks | Jurisdictional compliance matrix | Per deal initiation | Jurisdiction analysis, local counsel opinion, compliance mapping matrix | Legal / Compliance | VC (RegimeMappingCredential) | % deals with documented compliance map | Covers DIFC, CBB, QFCRA, SC, etc. |

### Bucket 3: Risk Management (5 Controls)

**Note**: Islamic-specific risks (RoR, DCR, SNC, equity investment) explicitly named per IFSB-1 taxonomy.

| ID | Control | Purpose | Standard Reference | Trigger | Required Evidence | Owner | Proof Type | Metric/KRI | Notes |
|----|---------|---------|-------------------|---------|-------------------|-------|------------|------------|-------|
| **RM-01** | Credit & Counterparty Risk | Manage counterparty creditworthiness | IFSB-1 Credit Risk<br>Basel III (adapted) | Per counterparty + periodic review | Credit memo, approved limits, collateral documentation, rating | Credit Risk Officer | VC (CreditApprovalCredential) | Breach rate (%), limit utilization | Alerts on limit breaches |
| **RM-02** | Operational Risk (Asset Transfer) | Prevent documentation/settlement/title errors | IFSB-1 Operational Risk | Per Murabaha/Ijara/Wakala asset transfer | Delivery note, title deed, timestamp, settlement confirmation | Operations | VC (TransferAttestationCredential) + hash | Exceptions per 100 transfers | Blocks profit recognition until complete |
| **RM-03** | Liquidity & RoR Risk | Manage liquidity gaps and rate-of-return expectations | IFSB-12 Liquidity Risk Management<br>IFSB-1 RoR Risk | Weekly liquidity monitoring | Liquidity gap report, RoR benchmarks, rate change log, stress test results | Treasury | VC (LiquidityReviewCredential) | Gap thresholds, RoR variance (bps) | Triggers repricing workflow if breached |
| **RM-04** | Displaced Commercial Risk (DCR) | Manage IAH return expectations vs actuals | IFSB-1 DCR<br>AAOIFI FAS 27 | Monthly/quarterly | IAH return analysis, smoothing reserve calculation, market comparisons | Treasury / Risk | VC (DCRReviewCredential) | DCR reserve adequacy (%), IAH churn rate | Links to profit distribution in FR bucket |
| **RM-05** | SNC Risk & Equity Investment Risk | Monitor SNC events and equity exposure | IFSB-1 Principle 7 (SNC)<br>IFSB-1 Equity Investment Risk | Quarterly risk register review | SNC risk register, equity exposure reports, Mushārakah/Muḍārabah valuations | Risk Officer | VC (RiskRegisterCredential) | # open SNC risks, equity loss rate (%) | Cross-links to SG-03 |

### Bucket 4: Financial & Product Reporting (6 Controls)

**Note**: Sustainability reporting (UoP, KPI/SPT) integrated within this bucket per ICMA/BNM VBIAF.

| ID | Control | Purpose | Standard Reference | Trigger | Required Evidence | Owner | Proof Type | Metric/KRI | Notes |
|----|---------|---------|-------------------|---------|-------------------|-------|------------|------------|-------|
| **FR-01** | AAOIFI/IFRS Financials | Audit-ready financial statements | AAOIFI FAS (e.g., FAS 28, 33)<br>IFRS 9/15 (adapted) | Monthly close | GL/TB, lineage to source documents, reconciliations | Finance Controller | Hash + VC (CloseApprovedCredential) | Reconciling items count | Exports AAOIFI/IFRS schedules |
| **FR-02** | Profit Recognition & Distribution | Fair PLS allocation per structure | AAOIFI FAS 4 (Mudaraba)<br>AAOIFI FAS 7 (Salam/Istisna) | On posting events | PLS calculation, allocation rules, profit distribution report | Finance / Product | VC (ProfitCalcCredential) | Exceptions rate (%), allocation variance | Mudaraba/Musharakah calculators |
| **FR-03** | SPV/Trustee Account Segregation | Proper asset/fund segregation | Trustee/SPV agreements<br>AAOIFI FAS 33 §5 (Sukuk) | Monthly reconciliation | Bank statements, trustee confirmations, segregation matrix | SPV Controller | VC (SegregationVerifiedCredential) | Variances count, late posts | Trustee can co-sign VC |
| **FR-04** | Use-of-Proceeds (UoP) Ledger | Transparent UoP allocation and tracking | ICMA GBP/SBP<br>BNM VBIAF §4.2 | On each draw/use event | UoP ledger entry, invoices, approval records, allocation report | Treasury / PM | VC (UoPAllocationCredential) + anchor | % allocated, deviations from plan | Feeds post-issuance reporting |
| **FR-05** | KPI/SPT Monitoring & Attestation | Evidence for sustainability claims | ICMA SLBP (annual verification required)<br>BNM VBIAF KPI Framework | Per KPI schedule (annual for SLB) | Data extract, calculation methodology, **external verifier attestation** | Sustainability Lead | VC (KPIAttestedCredential) + verifier VC | On-time verification rate (%) | SLB requires external verification annually |
| **FR-06** | Post-Issuance / Investor Reporting | Transparent ongoing disclosure | ICMA GBP/SBP/SLBP Templates<br>SC Malaysia Guidelines | Quarterly / Annual | Compiled report, UoP allocation, KPI progress, change log | Capital Markets | VC (ReportIssuedCredential) | On-time delivery (%), investor queries | Auto-compile from live data |

### Bucket 5: Audit & Assurance (5 Controls)

**Note**: Shariah Audit kept distinct from Internal Audit per AAOIFI/BNM requirements.

| ID | Control | Purpose | Standard Reference | Trigger | Required Evidence | Owner | Proof Type | Metric/KRI | Notes |
|----|---------|---------|-------------------|---------|-------------------|-------|------------|------------|-------|
| **AA-01** | Internal Audit (Financial/Operational) | Independent assurance on control effectiveness | IIA Standards<br>COSO Framework | Annual audit plan + cycles | Audit plan, sampling methodology, findings, management responses, closures | Internal Audit | VC (InternalAuditCredential) | Findings aging (days), reopen rate | Read-only evidence workspace access |
| **AA-02** | Shariah Audit (Independent) | Shariah execution assurance | AAOIFI GS-3/GS-11<br>BNM SG Policy §7 | Annual + per deal milestone | Sampling plan, transaction reviews, SNC findings, Shariah audit report | Shariah Auditor | VC (ShariahAuditReportCredential) | SNC recurrence rate, findings severity | Pulls evidence from SG bucket |
| **AA-03** | External Financial Audit Support | Efficient external audit preparation | ISA (International Standards on Auditing) | Annual + ad hoc auditor requests | PBC (Provided By Client) list, evidence bundles, management representation letter | Finance Controller | VC (PBCReadyCredential) | PBC request turnaround time (days) | Selective disclosure bundles per auditor needs |
| **AA-04** | External Sustainability Assurance | Credibility of sustainability/impact data | ICMA External Review Guidelines<br>ICMA SLBP Verification Requirements | Pre-issuance (SPO) + annual (SLB KPI verification) | Underlying data, calculation methodology, **external verifier statement**, assurance letter | Sustainability Lead | VC (AssuranceCredential) + verifier VC | Variance vs prior year, verifier findings count | Verifier onboarding as role in system |
| **AA-05** | Regulator/Trustee Inspection Ready | Smooth regulator/trustee supervision | Regulator inspection frameworks<br>Trustee agreements | Ad hoc / scheduled inspections | Inspection readiness pack, access logs, selective disclosure bundles | Compliance / Trustee Relations | VC (InspectionPackCredential) | Response time (hours), outstanding requests | Shares live proofs vs static PDFs |

### Control Library Maintenance

**Versioning**: Control Library follows semantic versioning (MAJOR.MINOR.PATCH)
- MAJOR: Standard reference changes (e.g., new AAOIFI version)
- MINOR: New controls added or scope changes
- PATCH: Clarifications, metric adjustments, notes updates

**Review Cycle**: Quarterly review; annual major update aligned to standard publications

**Change Log**: Track in `/docs/CONTROL_LIBRARY_CHANGELOG.md`

---

## Architecture: The Four Ledgers

### Conceptual Model

ZeroH maintains **four logical ledgers** (not four physical databases, but four append-only logs of different event types):

```
┌─────────────────────────────────────────────────────────┐
│                    ZeroH Ledgers                        │
└─────────────────────────────────────────────────────────┘

1. WORKFLOW LEDGER (Internal, append-only)
   Purpose: Who did what, when - complete audit trail
   Events: task_created, task_assigned, step_started, step_completed,
           approval_requested, approval_granted, exception_raised, etc.
   Storage: Event table in Postgres + optional event stream (Kafka/Redis)

2. CONTROLS LEDGER (Internal, append-only)
   Purpose: Control execution history - pass/fail over time
   Events: control_triggered, evidence_collected, control_evaluated,
           control_passed, control_failed, remediation_started, etc.
   Storage: control_run table in Postgres with immutable records

3. EVIDENCE LEDGER (Hybrid: metadata internal, artifacts external)
   Purpose: Hash registry of all artifacts
   Events: evidence_uploaded, evidence_verified, evidence_stale,
           evidence_linked_to_control
   Storage: evidence table (metadata + hash) in Postgres;
            actual files in object storage (S3/MinIO)

4. PROOF LEDGER (External-facing, verifiable)
   Purpose: Issued verifiable credentials and their status
   Events: vc_issued, vc_presented, vc_revoked, vc_suspended
   Storage: VC table in Postgres + optional blockchain anchors
            (Hedera Guardian) for critical checkpoints
```

### Separation of Concerns

- **Workflow & Controls Ledgers**: Internal operational records (never shared externally)
- **Evidence Ledger**: Hybrid - hashes are internal, artifacts selectively disclosed
- **Proof Ledger**: External-facing - VCs designed for multi-stakeholder sharing

**Key Principle**: Internal ledgers track HOW you run; proof ledger proves WHAT you achieved.

### Ledger Interactions

```typescript
// Example: Control execution creates entries in all four ledgers

// 1. Workflow event
workflow_ledger.append({
  event: 'step_completed',
  workflow_id: 'wf-123',
  step_id: 'step-SG-01',
  actor: 'user@example.com',
  timestamp: '2025-01-07T10:30:00Z'
})

// 2. Control execution record
control_ledger.append({
  event: 'control_passed',
  control_id: 'SG-01',
  deal_id: 'deal-123',
  status: 'passed',
  evidence_ids: ['ev-001', 'ev-002'],
  timestamp: '2025-01-07T10:30:00Z'
})

// 3. Evidence records
evidence_ledger.append({
  event: 'evidence_verified',
  evidence_id: 'ev-001',
  hash: 'sha256:abc123...',
  verified_by: 'agent',
  timestamp: '2025-01-07T10:29:45Z'
})

// 4. Proof issuance
proof_ledger.append({
  event: 'vc_issued',
  vc_id: 'VC-2025-001234',
  type: 'FatwaApprovalCredential',
  issuer: 'did:hedera:mainnet:...',
  subject: 'deal-123',
  hedera_tx: '0.0.123456@1699564800.123',  // Optional anchor
  timestamp: '2025-01-07T10:30:15Z'
})
```

---

## Data Model (Relational Backbone)

### Core Tables

**Note**: This is the minimal schema. Actual implementation may add indexes, constraints, audit columns.

```sql
-- OBLIGATIONS (what the standards require)
CREATE TABLE obligation (
  id UUID PRIMARY KEY,
  source VARCHAR(100) NOT NULL,        -- 'AAOIFI GS-1', 'IFSB-10', 'FATF Rec 10'
  citation TEXT,
  citation_url TEXT,
  bucket INT NOT NULL CHECK (bucket BETWEEN 1 AND 5),
  product_type VARCHAR(50),            -- 'Sukuk', 'Murabaha', 'Ijara', NULL=all
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CONTROLS (how we meet obligations)
CREATE TABLE control (
  id VARCHAR(20) PRIMARY KEY,          -- 'SG-01', 'RL-02'
  bucket INT NOT NULL CHECK (bucket BETWEEN 1 AND 5),
  bucket_name VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  purpose TEXT NOT NULL,
  standard_reference TEXT NOT NULL,    -- NEW: Required field
  citation_url TEXT,

  -- Execution params
  trigger TEXT NOT NULL,
  frequency VARCHAR(20),               -- 'event-driven', 'daily', 'weekly', etc.
  required_evidence JSONB NOT NULL,    -- Array of evidence types
  owner VARCHAR(100) NOT NULL,         -- Role name

  -- Validation
  rule_logic TEXT,                     -- Rego code or natural language
  pass_threshold NUMERIC,

  -- Output
  proof_type VARCHAR(100) NOT NULL,
  vc_schema TEXT,
  metric VARCHAR(200) NOT NULL,
  metric_type VARCHAR(20) NOT NULL,    -- 'percentage', 'count', etc.
  target_value NUMERIC,

  -- Implementation
  notes TEXT,
  automatable BOOLEAN DEFAULT false,
  verifiable BOOLEAN DEFAULT true,
  selective_disclosure BOOLEAN DEFAULT true,

  version VARCHAR(20) DEFAULT '1.0.0',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CONTROL_OBLIGATION_MAP (many-to-many)
CREATE TABLE control_obligation_map (
  control_id VARCHAR(20) REFERENCES control(id),
  obligation_id UUID REFERENCES obligation(id),
  PRIMARY KEY (control_id, obligation_id)
);

-- WORKFLOWS (long-lived processes)
CREATE TABLE workflow (
  id UUID PRIMARY KEY,
  product_type VARCHAR(50) NOT NULL,   -- 'Sukuk', 'Murabaha', etc.
  deal_id VARCHAR(100),
  deal_name VARCHAR(200),
  template_version VARCHAR(20),
  state VARCHAR(50) DEFAULT 'draft',   -- 'draft', 'in_progress', 'completed', 'suspended'
  phase VARCHAR(50),                   -- 'pre-issuance', 'issuance', 'post-issuance', 'audit'
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- STEPS (workflow stages, linked to controls)
CREATE TABLE step (
  id UUID PRIMARY KEY,
  workflow_id UUID REFERENCES workflow(id) ON DELETE CASCADE,
  control_id VARCHAR(20) REFERENCES control(id),
  step_number INT NOT NULL,
  step_name VARCHAR(200) NOT NULL,
  assignee_role VARCHAR(100),
  assignee_user VARCHAR(100),
  due_date TIMESTAMP,
  sla_hours INT,
  state VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'blocked', 'failed'
  auto_apply BOOLEAN DEFAULT false,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (workflow_id, step_number)
);

-- CONTROL_RUN (execution records - immutable after creation)
CREATE TABLE control_run (
  id UUID PRIMARY KEY,
  control_id VARCHAR(20) REFERENCES control(id),
  workflow_id UUID REFERENCES workflow(id),
  deal_id VARCHAR(100),
  period_start DATE,
  period_end DATE,
  status VARCHAR(20) NOT NULL,         -- 'passed', 'failed', 'conditional', 'not_started', 'in_progress'
  reason TEXT,
  kri_value NUMERIC,
  target_value NUMERIC,
  evidence_ids JSONB,                  -- Array of evidence UUIDs
  vc_id VARCHAR(100),                  -- Link to issued VC
  opened_at TIMESTAMP NOT NULL,
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
  -- Note: No updated_at - records are immutable
);

-- EVIDENCE (artifact registry)
CREATE TABLE evidence (
  id UUID PRIMARY KEY,
  control_id VARCHAR(20) REFERENCES control(id),
  control_run_id UUID REFERENCES control_run(id),
  deal_id VARCHAR(100),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,           -- 'document', 'api_response', 'calculation', 'blockchain_tx'

  -- Storage
  source VARCHAR(50) NOT NULL,         -- 'SharePoint', 'S3', 'API', 'Agent', 'Manual', 'Guardian'
  source_path TEXT,
  source_url TEXT,
  file_type VARCHAR(50),
  file_size BIGINT,

  -- Collection
  collected_by VARCHAR(20) NOT NULL,   -- 'agent' or 'user'
  collected_by_name VARCHAR(200),
  collected_at TIMESTAMP NOT NULL,

  -- Verification
  verified BOOLEAN DEFAULT false,
  last_verified TIMESTAMP,
  verified_by VARCHAR(200),
  hash VARCHAR(128),                   -- SHA-256 hash

  -- Lifecycle
  version VARCHAR(20) DEFAULT '1.0',
  expiry_date TIMESTAMP,
  stale BOOLEAN DEFAULT false,

  -- VC linkage
  vc_id VARCHAR(100),
  hedera_tx VARCHAR(100),

  -- Selective Disclosure
  selective_disclosure_enabled BOOLEAN DEFAULT false,
  visibility_rules JSONB,              -- {role: [fields_visible]}

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- VERIFIABLE_CREDENTIAL (proof records)
CREATE TABLE verifiable_credential (
  id VARCHAR(100) PRIMARY KEY,         -- 'VC-2025-001234'
  type VARCHAR(100) NOT NULL,          -- 'FatwaApprovalCredential', 'UoPAllocationCredential'
  issuer_did TEXT NOT NULL,
  subject_did TEXT,
  control_id VARCHAR(20) REFERENCES control(id),
  deal_id VARCHAR(100),

  -- VC content
  credential_subject JSONB NOT NULL,   -- Full credential subject claims
  context JSONB NOT NULL,              -- @context array

  -- Issuance
  issuance_date TIMESTAMP NOT NULL,
  expiration_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'issued', -- 'issued', 'revoked', 'suspended', 'expired'
  status_list_index INT,

  -- Proof
  proof_type VARCHAR(100) NOT NULL,    -- 'Ed25519Signature2020'
  proof_value TEXT NOT NULL,           -- JWS signature
  verification_method TEXT NOT NULL,   -- DID URL

  -- Blockchain anchor (optional)
  hedera_tx VARCHAR(100),              -- '0.0.123456@1699564800.123'
  anchor_timestamp TIMESTAMP,

  -- Selective Disclosure (SD-JWT)
  selective_disclosure_enabled BOOLEAN DEFAULT false,
  disclosures JSONB,                   -- Array of base64-encoded disclosures

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RISK (risk register)
CREATE TABLE risk (
  id UUID PRIMARY KEY,
  category VARCHAR(100) NOT NULL,      -- 'SNC', 'DCR', 'RoR', 'Equity Investment', 'Credit', 'Market', 'Liquidity', 'Operational'
  sub_category VARCHAR(100),
  description TEXT NOT NULL,
  product_type VARCHAR(50),
  deal_id VARCHAR(100),

  -- Assessment
  likelihood VARCHAR(20),              -- 'low', 'medium', 'high', 'very_high'
  impact VARCHAR(20),
  inherent_rating VARCHAR(20),
  residual_rating VARCHAR(20),

  -- Treatment
  owner VARCHAR(200),
  treatment_plan TEXT,
  mitigation_controls JSONB,           -- Array of control IDs
  target_date DATE,

  -- Status
  status VARCHAR(20) DEFAULT 'open',   -- 'open', 'in_treatment', 'closed', 'accepted'

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ISSUE/EXCEPTION (findings, blockers, remediation tracking)
CREATE TABLE issue (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,           -- 'control_failure', 'audit_finding', 'exception', 'blocker'
  source VARCHAR(50),                  -- 'control_run', 'audit', 'manual'
  control_id VARCHAR(20) REFERENCES control(id),
  control_run_id UUID REFERENCES control_run(id),
  deal_id VARCHAR(100),

  severity VARCHAR(20) NOT NULL,       -- 'critical', 'high', 'medium', 'low'
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,

  -- Ownership
  owner VARCHAR(200),
  assignee VARCHAR(200),

  -- Resolution
  target_date DATE,
  status VARCHAR(20) DEFAULT 'open',   -- 'open', 'in_progress', 'resolved', 'closed', 'accepted'
  resolution TEXT,
  resolved_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- REPORT (compiled outputs)
CREATE TABLE report (
  id UUID PRIMARY KEY,
  type VARCHAR(100) NOT NULL,          -- 'UoP', 'post_issuance', 'SGF_annual', 'audit_PBC', 'sustainability'
  deal_id VARCHAR(100),
  period_start DATE,
  period_end DATE,

  -- Compilation
  compiled_from JSONB,                 -- Array of {control_runs, evidence_ids, vc_ids}
  version VARCHAR(20) DEFAULT '1.0',

  -- Storage
  file_path TEXT,
  hash VARCHAR(128),

  -- VC
  vc_id VARCHAR(100),

  status VARCHAR(20) DEFAULT 'draft',  -- 'draft', 'finalized', 'issued'
  issued_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- EVENT_LOG (append-only audit trail)
CREATE TABLE event_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  ledger VARCHAR(20) NOT NULL,         -- 'workflow', 'control', 'evidence', 'proof'
  entity_type VARCHAR(50),             -- 'workflow', 'step', 'control_run', 'evidence', 'vc'
  entity_id VARCHAR(100),
  actor VARCHAR(200),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_event_log_ledger_timestamp ON event_log(ledger, timestamp DESC);
CREATE INDEX idx_event_log_entity ON event_log(entity_type, entity_id);
```

### Polyglot Storage Strategy

| Data Type | Store | Reason |
|-----------|-------|--------|
| Structured data (controls, workflows, runs, risks) | **PostgreSQL** | Relational queries, transactions, constraints |
| Artifacts (PDFs, spreadsheets, images) | **Object Storage** (S3/MinIO) | Scalable, cost-effective; hash stored in Postgres |
| Event streams (optional) | **Kafka/Redis Streams** | Real-time agent coordination, audit replay |
| Full-text search | **PostgreSQL FTS** or **Elasticsearch** | Evidence/report search |
| Vector embeddings (AI retrieval) | **pgvector** or **Pinecone** | Semantic search over standards/controls |
| Verifiable Credentials | **PostgreSQL** (metadata) + **IPFS/Arweave** (optional immutable backup) | VC table is authoritative; blockchain just anchors critical checkpoints |

---

## AI Agent Specifications

### Agent Architecture Principles

1. **Agents propose, humans approve**: Agents draft, collect, prepare; humans make decisions
2. **Provenance first**: Every suggestion links to rules + evidence
3. **Deterministic workflows**: Agents operate within structured control execution paths
4. **Idempotent actions**: Retry-safe operations
5. **Explainable**: Agents must cite control library, standards, evidence when acting

### Agent Interface

```typescript
interface Agent {
  id: string
  name: string
  role: string
  capabilities: string[]
  supportedControls: string[]          // Control IDs this agent can help with

  execute(action: AgentAction): AsyncGenerator<AGUIEvent>

  context: AgentContext
}

interface AgentAction {
  type: 'collect_evidence' | 'validate_control' | 'mint_vc' |
        'send_notification' | 'detect_drift' | 'prepare_report'
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

interface AgentContext {
  controlLibrary: Control[]
  obligations: Obligation[]
  dealContext?: Deal
  userRole: string
}
```

### Core Agents

#### 1. Compliance Copilot Agent

**Role**: Q&A and guidance on controls

**Capabilities**:
- Answer questions about control requirements
- Explain control purpose and standards alignment
- Show control execution status
- Suggest remediation for failed controls
- Cite relevant AAOIFI/BNM/ICMA/IFSB/FATF standards

**Supported Controls**: ALL (answers questions about any control)

**Data Sources**:
- Control Library (control definitions, rules, evidence requirements)
- Standards knowledge base (AAOIFI, IFSB, ICMA, FATF docs)
- Control execution logs (status, evidence, KRIs)
- Evidence vault (what's collected)

**Example Queries**:
- "What's the status of SG-01 for Deal-123?"
- "Why did RL-02 fail for customer ABC?"
- "How do I fix RM-05 KPI deviation?"
- "Show me all overdue controls"
- "Explain the difference between Shariah Review and Shariah Audit"

**Implementation Pattern**:
```typescript
async *execute(action: AgentAction) {
  yield { type: 'typing', agentId: this.id, timestamp: now() }

  // Retrieve control and context
  const control = this.context.controlLibrary.find(c => c.id === action.controlId)
  const controlRuns = await db.controlRun.findMany({ where: { controlId: action.controlId }})

  // Generate response using RAG over control + standards + execution history
  const response = await this.llm.generate({
    systemPrompt: COMPLIANCE_COPILOT_SYSTEM_PROMPT,
    context: { control, controlRuns, standards: this.standardsKB },
    userQuery: action.params.query
  })

  yield {
    type: 'message',
    agentId: this.id,
    timestamp: now(),
    payload: {
      text: response.text,
      citations: response.citations,  // Links to standards, controls
      suggestedActions: response.actions
    }
  }
}
```

#### 2. Evidence Collection Agent

**Role**: Auto-collect evidence for control execution

**Capabilities**:
- Monitor SharePoint/S3/Google Drive for new documents
- Extract data from APIs (Guardian, KYC providers, accounting systems)
- Generate synthetic evidence (checklists, calculators, templates)
- Track evidence freshness and alert on stale data
- Hash artifacts and record in evidence ledger

**Supported Controls**: ALL (collects requiredEvidence from any control)

**Collection Strategies**:
- **Document scanning**: Periodic checks of document repositories matching naming conventions
- **API polling**: Query external systems on schedule
- **Event-driven**: React to webhooks (e.g., new Hedera transaction, accounting system close)
- **Synthetic generation**: Create evidence artifacts (e.g., pre-fill forms from deal data)

**Example Actions**:
- SG-02: Generate "Checked clauses list" from contract templates by scanning for prohibited terms
- RL-02: Fetch "PEP/sanctions screening results" from KYC API
- FR-04: Extract "UoP ledger entry" from accounting system
- AA-04: Request "External verifier statement" via email automation

**Implementation Pattern**:
```typescript
async *execute(action: AgentAction) {
  const control = this.context.controlLibrary.find(c => c.id === action.controlId)

  yield { type: 'status', payload: { message: 'Starting evidence collection...' }}

  for (const evidenceName of control.requiredEvidence) {
    yield { type: 'typing', agentId: this.id, timestamp: now() }

    // Determine source
    const source = this.determineSource(evidenceName)

    yield { type: 'message', payload: { text: `Collecting "${evidenceName}" from ${source}...` }}

    // Collect
    const artifact = await this.collect(evidenceName, source, action.dealId)

    // Hash
    const hash = await this.hash(artifact)

    // Store metadata + hash in evidence ledger
    const evidenceId = await db.evidence.create({
      control_id: action.controlId,
      deal_id: action.dealId,
      name: evidenceName,
      source,
      hash,
      collected_by: 'agent',
      collected_at: now()
    })

    yield {
      type: 'tool_call',
      agentId: this.id,
      payload: {
        tool: 'addEvidence',
        params: { evidenceId, hash }
      }
    }

    yield {
      type: 'message',
      payload: { text: `✅ Collected "${evidenceName}" (hash: ${hash.substring(0,16)}...)` }
    }
  }

  yield { type: 'status', payload: { message: 'Evidence collection complete', status: 'success' }}
}
```

#### 3. Drift Detection Agent

**Role**: Monitor KRIs and alert on control failures

**Capabilities**:
- Poll KRIs from control library
- Compare actual vs target thresholds
- Detect SLA breaches (trigger missed, due date passed)
- Alert on policy changes (standard updates)
- Auto-create remediation tasks

**Supported Controls**: Time-sensitive controls (SG-01, SG-04, RL-01, RL-02, RM-05, FR-05)

**Monitoring Approach**:
- Scheduled checks (daily/weekly depending on control frequency)
- Threshold comparisons (KRI value vs target)
- Trend analysis (3-period rolling average)
- Expiry tracking (fatwa, license, consent, evidence freshness)

**Example Actions**:
- SG-01: Alert if fatwa expiry < 30 days
- RL-01: Alert if license renewal overdue
- RM-05: Alert if KPI deviation > tolerance
- SG-04: Alert if SNC event not closed within SLA

**Implementation Pattern**:
```typescript
async *execute(action: AgentAction) {
  const control = this.context.controlLibrary.find(c => c.id === action.controlId)

  // Get latest KRI value
  const latestRun = await db.controlRun.findFirst({
    where: { control_id: action.controlId, deal_id: action.dealId },
    orderBy: { opened_at: 'desc' }
  })

  const currentValue = latestRun.kri_value
  const targetValue = control.targetValue

  // Check threshold
  if (this.isOutOfThreshold(currentValue, targetValue, control.metricType)) {
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
        tool: 'createIssue',
        params: {
          type: 'control_failure',
          control_id: control.id,
          severity: 'high',
          title: `Fix ${control.metric} drift`,
          description: `Current: ${currentValue}, Target: ${targetValue}`
        }
      }
    }
  }
}
```

#### 4. Auto-Assignment Agent

**Role**: Route control tasks to appropriate owners

**Capabilities**:
- Read "owner" field from control
- Match to active users/roles
- Consider workload and availability
- Escalate if no owner available
- Send notifications

**Supported Controls**: ALL (routes any triggered control)

**Assignment Logic**:
1. Read control.owner (role name)
2. Query active users with that role
3. Calculate workload (# open tasks per user)
4. Select least-busy user
5. Create task assignment
6. Send notification

**Implementation Pattern**:
```typescript
async *execute(action: AgentAction) {
  const control = this.context.controlLibrary.find(c => c.id === action.controlId)

  // Find users with required role
  const candidates = await db.user.findMany({
    where: {
      roles: { contains: control.owner },
      status: 'active'
    }
  })

  if (candidates.length === 0) {
    yield {
      type: 'message',
      payload: {
        text: `⚠️ No active user found for role "${control.owner}". Escalating to admin...`,
        severity: 'warning'
      }
    }
    // Escalation logic...
    return
  }

  // Calculate workload
  const workloads = await Promise.all(
    candidates.map(async user => ({
      user,
      openTasks: await db.step.count({ where: { assignee_user: user.email, state: { in: ['pending', 'in_progress'] }}})
    }))
  )

  // Select least busy
  const assignee = workloads.sort((a, b) => a.openTasks - b.openTasks)[0].user

  yield {
    type: 'message',
    payload: { text: `Assigning ${control.name} to ${assignee.name} (${assignee.email})` }
  }

  // Update task
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
        body: `You've been assigned control ${control.id} for deal ${action.dealId}`
      }
    }
  }
}
```

#### 5. Blockchain Verification Agent

**Role**: Mint VCs and anchor to Hedera blockchain

**Capabilities**:
- Generate VC from control execution data
- Sign with issuer DID
- Submit to Hedera Guardian (for critical checkpoints)
- Return blockchain TX ID and VC ID
- Update proof ledger

**Supported Controls**: Controls where verifiable=true (most controls)

**Minting Logic**:
1. Read control.proofType and vcSchema
2. Generate credential subject from control_run data + evidence
3. Sign VC with issuer DID key
4. Optionally anchor to Hedera (for critical controls only: SG-01, FR-04, FR-05, AA-04)
5. Store VC in proof ledger
6. Return VC ID and optional blockchain TX

**Implementation Pattern**:
```typescript
async *execute(action: AgentAction) {
  const control = this.context.controlLibrary.find(c => c.id === action.controlId)

  yield { type: 'message', payload: { text: 'Generating Verifiable Credential...' }}

  // Generate VC
  const vc = {
    '@context': ['https://www.w3.org/2018/credentials/v1', control.vcSchema],
    type: ['VerifiableCredential', control.proofType],
    issuer: this.issuerDID,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      controlId: control.id,
      controlName: control.name,
      bucketId: control.bucket,
      dealId: action.dealId,
      ...action.params.credentialData  // Control-specific claims
    }
  }

  yield { type: 'message', payload: { text: 'Signing credential with issuer DID...' }}

  // Sign
  const signedVC = await this.didKit.signVC(vc, this.issuerKey)

  // Decide if anchoring needed (only critical controls)
  const shouldAnchor = ['SG-01', 'FR-04', 'FR-05', 'AA-04'].includes(control.id)

  let hederaTx = null
  if (shouldAnchor) {
    yield { type: 'message', payload: { text: 'Anchoring to Hedera Guardian...' }}

    const result = await this.guardian.submitVC(signedVC)
    hederaTx = result.txId
  }

  // Store in proof ledger
  const vcId = await db.verifiableCredential.create({
    type: control.proofType,
    issuer_did: this.issuerDID,
    control_id: control.id,
    deal_id: action.dealId,
    credential_subject: signedVC.credentialSubject,
    context: signedVC['@context'],
    issuance_date: signedVC.issuanceDate,
    proof_type: signedVC.proof.type,
    proof_value: signedVC.proof.proofValue,
    verification_method: signedVC.proof.verificationMethod,
    hedera_tx: hederaTx
  })

  yield {
    type: 'message',
    payload: {
      text: `✅ Proof minted! VC: ${vcId}${hederaTx ? ` | Hedera TX: ${hederaTx}` : ''}`,
      vcId,
      hederaTx
    }
  }
}
```

### Agent Coordination

Agents can work in sequence or parallel depending on control requirements:

**Sequential** (common pattern):
1. Auto-Assignment Agent assigns task to human
2. Human completes task, marks evidence collected
3. Evidence Collection Agent verifies and hashes artifacts
4. Compliance Copilot explains status to user
5. Blockchain Verification Agent mints VC proof

**Parallel** (for efficiency):
- Compliance Copilot answers user questions while Evidence Collection Agent gathers artifacts
- Drift Detection Agent monitors all controls continuously in background

---

## Proof Layer (Verifiable Credentials)

### W3C VC Standards Compliance

ZeroH issues **W3C Verifiable Credentials** that are:
- **Portable**: Standard JSON-LD format works across systems
- **Verifiable**: Cryptographically signed by issuer DID
- **Selective**: Support SD-JWT/BBS+ for minimal disclosure
- **Anchored** (optional): Critical checkpoints recorded on Hedera ledger

### VC Lifecycle

```
1. ISSUANCE
   Control passes → Blockchain Agent generates VC → Signs with issuer DID →
   (Optional) Anchors to Hedera → Stores in proof ledger

2. PRESENTATION
   Stakeholder requests proof → System generates presentation (minimal disclosure) →
   Stakeholder verifies signature + (optional) checks blockchain anchor

3. REVOCATION (if needed)
   Control fails audit / evidence invalidated → Update status list →
   Presentation check will show "revoked"

4. EXPIRATION
   Time-based VCs (e.g., fatwa with expiry) → Automatically marked expired →
   Drift agent alerts for renewal
```

### VC Template Structure

Every control defines a VC template. Example for **SG-01 (Fatwa Issuance)**:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://zeroh.io/credentials/v1"
  ],
  "type": ["VerifiableCredential", "FatwaApprovalCredential"],
  "issuer": "did:hedera:mainnet:zeroh-shariah-board",
  "issuanceDate": "2025-01-07T10:23:15Z",
  "expirationDate": "2026-01-07T00:00:00Z",

  "credentialSubject": {
    "id": "did:deal:123",
    "controlId": "SG-01",
    "controlName": "SSB Mandate & Fatwa Issuance",
    "bucketId": 1,
    "bucketName": "Shariah Governance & Compliance",

    "dealId": "deal-123",
    "dealName": "Green Sukuk Issuance - $250M",
    "productType": "Sukuk",

    "fatwa": {
      "number": "2024-11-001",
      "version": "1.0",
      "scope": "Ijara-based Sukuk issuance for renewable energy projects",
      "conditions": [],
      "issuedBy": "Dr. Ahmed Al-Mansouri",
      "issuedDate": "2025-01-07",
      "expiryDate": "2026-01-07"
    },

    "evidenceHash": "sha256:abc123def456...",
    "status": "approved"
  },

  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2025-01-07T10:25:00Z",
    "verificationMethod": "did:hedera:mainnet:zeroh-shariah-board#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGc..."
  },

  "hederaAnchor": {
    "txId": "0.0.123456@1699564800.123",
    "timestamp": "2025-01-07T10:25:30Z",
    "topicId": "0.0.789012"
  }
}
```

### Selective Disclosure Implementation

For **privacy-sensitive VCs** (RL-02 KYC, RL-03 Data Consent), use SD-JWT:

**Full VC** (issuer holds):
```json
{
  "credentialSubject": {
    "controlId": "RL-02",
    "customer": {
      "name": "ABC Trading LLC",
      "jurisdiction": "UAE",
      "kycStatus": "approved",
      "riskRating": "low",
      "pepScreening": "clear",
      "sanctionsScreening": "clear",
      "beneficialOwners": ["Person A", "Person B"],
      "kycCompletionDate": "2025-01-05"
    }
  }
}
```

**Minimal Presentation** (shared with investor):
```json
{
  "credentialSubject": {
    "controlId": "RL-02",
    "customer": {
      "kycStatus": "approved",
      "kycCompletionDate": "2025-01-05"
      // Other fields redacted via SD-JWT
    }
  },
  "proof": { ... }  // Still verifiable!
}
```

**Implementation**: Use `@digitalbazaar/sd-jwt` library or Guardian's built-in SD support.

### Blockchain Anchoring Strategy

**NOT all VCs get anchored** (too expensive and noisy). Only anchor:
- **Critical approvals**: SG-01 (Fatwa), AA-04 (External verifier attestation)
- **Financial milestones**: FR-04 (UoP allocation batches), FR-05 (Annual KPI attestation)
- **Audit checkpoints**: AA-02 (Shariah audit report)

**For other VCs**: Signature verification is sufficient; blockchain anchoring is optional.

**Anchoring via Hedera Guardian**:
1. Submit VC to Guardian policy
2. Guardian hashes VC and submits to HCS (Hedera Consensus Service)
3. Return HCS transaction ID (e.g., `0.0.123456@1699564800.123`)
4. Store TX ID in `verifiable_credential.hedera_tx`

**Verification**:
- Verifier checks VC signature (always)
- Optionally queries Hedera mirror node to confirm TX timestamp and hash

---

## Implementation Patterns

### Pattern 1: Control-Driven Task Generation

When a control triggers, the system auto-generates a task:

```typescript
// Control trigger detection
async function checkTriggers() {
  for (const control of controlLibrary) {
    if (shouldTrigger(control, currentContext)) {
      await createTaskForControl(control, currentContext)
    }
  }
}

function shouldTrigger(control: Control, context: Context): boolean {
  // Event-driven triggers
  if (control.trigger.includes('on deal creation') && context.event === 'deal_created') {
    return true
  }

  // Time-based triggers
  if (control.frequency === 'monthly' && isMonthEnd()) {
    return true
  }

  // Conditional triggers
  if (control.trigger.includes('if KPI deviation') && hasKPIDeviation(control, context)) {
    return true
  }

  return false
}

async function createTaskForControl(control: Control, context: Context) {
  // Generate task from control template
  const task = {
    id: `task-${control.id}-${context.dealId}-${Date.now()}`,
    control_id: control.id,
    deal_id: context.dealId,
    assigned_to_role: control.owner,
    due_date: calculateDueDate(control.trigger, context),
    status: 'pending',
    evidence_required: control.requiredEvidence
  }

  // Create workflow step
  await db.step.create(task)

  // Auto-assign
  await autoAssignmentAgent.execute({ type: 'assign_task', params: { taskId: task.id }})

  // Notify
  await notificationService.send({
    to: task.assigned_to_role,
    subject: `New task: ${control.name}`,
    body: `Control ${control.id} has been triggered for ${context.dealName}`
  })
}
```

### Pattern 2: Evidence Collection + Verification

```typescript
async function collectEvidenceForControl(controlId: string, dealId: string) {
  const control = controlLibrary.find(c => c.id === controlId)

  const collectionResults = []

  for (const evidenceName of control.requiredEvidence) {
    // Determine source
    const source = evidenceSourceMap[evidenceName] || 'Manual'

    let artifact, hash

    if (source === 'API') {
      artifact = await externalAPI.fetch(evidenceName, dealId)
      hash = await hashArtifact(artifact)
    } else if (source === 'SharePoint') {
      artifact = await sharepoint.search(evidenceName, dealId)
      hash = await hashArtifact(artifact)
    } else if (source === 'Agent') {
      artifact = await evidenceAgent.generate(evidenceName, dealId, control)
      hash = await hashArtifact(artifact)
    }
    // else: Manual upload, wait for user

    // Store in evidence ledger
    const evidenceId = await db.evidence.create({
      control_id: controlId,
      deal_id: dealId,
      name: evidenceName,
      source,
      hash,
      collected_by: source === 'Manual' ? 'user' : 'agent',
      collected_at: new Date(),
      verified: source !== 'Manual'  // Agent-collected is auto-verified
    })

    collectionResults.push({ evidenceName, evidenceId, hash, status: 'collected' })
  }

  return collectionResults
}
```

### Pattern 3: Control Evaluation + VC Minting

```typescript
async function evaluateControl(controlId: string, dealId: string) {
  const control = controlLibrary.find(c => c.id === controlId)

  // Check all evidence collected
  const evidence = await db.evidence.findMany({
    where: { control_id: controlId, deal_id: dealId, verified: true }
  })

  const allEvidencePresent = control.requiredEvidence.every(req =>
    evidence.some(ev => ev.name === req)
  )

  if (!allEvidencePresent) {
    return { status: 'blocked', reason: 'Missing evidence' }
  }

  // Execute rule logic (simplified - real version uses Rego engine)
  let passed = true
  let kri_value = null

  if (control.ruleLogic) {
    const result = await ruleEngine.evaluate(control.ruleLogic, { evidence, dealId })
    passed = result.passed
    kri_value = result.kri_value
  }

  // Create control_run record (immutable)
  const controlRun = await db.controlRun.create({
    control_id: controlId,
    deal_id: dealId,
    status: passed ? 'passed' : 'failed',
    kri_value,
    target_value: control.targetValue,
    evidence_ids: evidence.map(e => e.id),
    opened_at: new Date(),
    closed_at: passed ? new Date() : null
  })

  // If passed and verifiable, mint VC
  if (passed && control.verifiable) {
    const vc = await blockchainAgent.execute({
      type: 'mint_vc',
      controlId,
      dealId,
      params: {
        credentialData: {
          status: 'passed',
          kri_value,
          evidenceHashes: evidence.map(e => e.hash)
        }
      }
    })

    // Link VC to control_run
    await db.controlRun.update({
      where: { id: controlRun.id },
      data: { vc_id: vc.vcId }
    })
  }

  // If failed, create issue
  if (!passed) {
    await db.issue.create({
      type: 'control_failure',
      control_id: controlId,
      deal_id: dealId,
      severity: control.bucket === 1 ? 'critical' : 'high',  // Shariah failures are critical
      title: `${control.name} failed`,
      description: `Control ${controlId} evaluation failed. KRI: ${kri_value}, Target: ${control.targetValue}`,
      owner: control.owner,
      status: 'open'
    })
  }

  return { status: passed ? 'passed' : 'failed', controlRun }
}
```

### Pattern 4: Dashboard Auto-Generation

```typescript
function generateDashboard(deals: Deal[]): DashboardConfig {
  const config = {
    overall: {
      totalDeals: deals.length,
      activeDeals: deals.filter(d => d.status !== 'completed').length,
      compliantDeals: 0,
      overallCompliance: 0
    },
    buckets: []
  }

  // Generate bucket cards
  for (let bucketId = 1; bucketId <= 5; bucketId++) {
    const bucketControls = controlLibrary.filter(c => c.bucket === bucketId)

    const bucketCard = {
      bucketId,
      bucketName: getBucketName(bucketId),
      totalControls: bucketControls.length,
      passedControls: 0,
      failedControls: 0,
      kris: [],
      insights: []
    }

    // Calculate KRIs for each control across all deals
    for (const control of bucketControls) {
      const kri = await calculateKRI(control, deals)
      bucketCard.kris.push(kri)

      if (kri.status === 'pass') bucketCard.passedControls++
      if (kri.status === 'fail') bucketCard.failedControls++
    }

    bucketCard.score = (bucketCard.passedControls / bucketCard.totalControls) * 100

    // Generate AI insights
    bucketCard.insights = await generateInsights(bucketCard, deals)

    config.buckets.push(bucketCard)
  }

  // Calculate overall compliance
  config.overall.compliantDeals = deals.filter(d =>
    d.controls.every(c => c.status === 'passed')
  ).length

  config.overall.overallCompliance =
    (config.overall.compliantDeals / config.overall.totalDeals) * 100

  return config
}

async function calculateKRI(control: Control, deals: Deal[]) {
  const runs = await db.controlRun.findMany({
    where: {
      control_id: control.id,
      deal_id: { in: deals.map(d => d.id) }
    },
    orderBy: { opened_at: 'desc' }
  })

  // Aggregate based on metric type
  let value
  if (control.metricType === 'percentage') {
    const passed = runs.filter(r => r.status === 'passed').length
    value = (passed / runs.length) * 100
  } else if (control.metricType === 'duration') {
    const closedRuns = runs.filter(r => r.closed_at)
    const durations = closedRuns.map(r =>
      (r.closed_at - r.opened_at) / (1000 * 60 * 60 * 24)  // days
    )
    value = durations.reduce((a, b) => a + b, 0) / durations.length
  } else {
    value = runs[0]?.kri_value || 0
  }

  const status = value >= control.targetValue ? 'pass' : 'fail'

  return {
    controlId: control.id,
    metric: control.metric,
    value,
    target: control.targetValue,
    unit: control.metricType === 'percentage' ? '%' : control.metricType === 'duration' ? 'days' : '',
    status
  }
}
```

---

## Validation Criteria

### System Validation Checklist

**Configuration Integrity**:
- [ ] All 26 controls have unique IDs, standard references, and complete schemas
- [ ] Every control maps to at least one obligation
- [ ] Every control has a defined proof type (VC schema)
- [ ] Control trigger logic is unambiguous

**Data Integrity**:
- [ ] All control_run records are immutable after creation
- [ ] Every evidence record has a hash
- [ ] VCs are cryptographically signed
- [ ] Event log is append-only

**Agent Behavior**:
- [ ] Agents cite control library + standards when explaining
- [ ] Evidence collection strategies match control requirements
- [ ] Drift detection respects control thresholds
- [ ] Auto-assignment respects role mappings
- [ ] VC minting uses correct schemas per control

**Proof Verification**:
- [ ] All VCs validate against W3C spec
- [ ] Selective disclosure properly hides sensitive fields
- [ ] Blockchain anchors (when present) resolve on Hedera mirror nodes
- [ ] Expired VCs are flagged in presentations

**Standards Compliance**:
- [ ] Shariah Review and Shariah Audit are distinct functions (AAOIFI/BNM)
- [ ] Islamic-specific risks (RoR, DCR, SNC, equity) are explicitly tracked (IFSB-1)
- [ ] UoP tracking meets ICMA GBP/SBP requirements
- [ ] SLB controls include annual external verification (ICMA SLBP)
- [ ] AML/CFT controls cover FATF 40 recommendations

### Acceptance Criteria (MVP)

**Core Functionality**:
- [ ] Control library loaded and queryable
- [ ] Control triggers generate tasks automatically
- [ ] Evidence collection (manual + agent-assisted) works for 5 sample controls
- [ ] Control evaluation engine passes/fails based on evidence + rules
- [ ] VC minting works for at least 3 control types
- [ ] Dashboard auto-generates from control execution data

**AI Agents**:
- [ ] Compliance Copilot answers questions with citations
- [ ] Evidence Collection Agent fetches from at least 2 sources (S3, API)
- [ ] Drift Detection Agent alerts on threshold breaches
- [ ] Auto-Assignment Agent routes to correct roles
- [ ] Blockchain Agent mints and signs VCs

**User Experience**:
- [ ] Task inbox shows control-generated tasks
- [ ] Task cards display control purpose, evidence requirements, and standard references
- [ ] Evidence vault shows collection status and hashes
- [ ] Proof viewer displays VCs with verification links
- [ ] Trust Portal renders minimal disclosures

**Integration**:
- [ ] Hedera Guardian connection for VC anchoring
- [ ] Object storage (S3/MinIO) for artifacts
- [ ] Event streaming for real-time updates

---

## Appendix: Standard References

### AAOIFI Standards Cited

- **GS-1**: Shariah Supervisory Board: Appointment, Composition and Report
- **GS-2**: Shariah Review
- **GS-3**: Internal Shariah Review
- **GS-11**: Shariah Audit for Islamic Financial Institutions
- **GS-12**: Shariah Governance System for Sukuk
- **FAS 4**: Mudaraba Financing
- **FAS 7**: Salam and Parallel Salam
- **FAS 27**: Investment Accounts
- **FAS 28**: Murabaha and Other Deferred Payment Sales
- **FAS 33**: Investment Sukuk

### IFSB Standards Cited

- **IFSB-1**: Guiding Principles of Risk Management for Institutions (Other than Insurance Institutions) Offering Only Islamic Financial Services
- **IFSB-10**: Guiding Principles on Sharīʿah Governance System for Institutions Offering Islamic Financial Services
- **IFSB-12**: Guiding Principles on Liquidity Risk Management for Institutions Offering Islamic Financial Services

### ICMA Standards Cited

- **Green Bond Principles (GBP)** - June 2025
- **Social Bond Principles (SBP)** - June 2021
- **Sustainability-Linked Bond Principles (SLBP)** - June 2023
- **External Review Guidelines** - June 2022

### BNM Standards Cited

- **Shariah Governance Policy** (2019)
- **Value-Based Intermediation Financing and Investment Impact Assessment Framework (VBIAF)**

### FATF Standards Cited

- **FATF 40 Recommendations** (2025 version)
  - Recommendation 10: Customer Due Diligence
  - Recommendation 11: Record-keeping
  - Recommendation 12: Politically Exposed Persons

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-07 | System Architect | Initial Source of Truth document combining taxonomy, controls, architecture, AI agents, proof layer, and implementation patterns |

---

**END OF SOURCE OF TRUTH DOCUMENT**

This document is authoritative for all ZeroH implementation decisions. Updates require formal change control approval.
