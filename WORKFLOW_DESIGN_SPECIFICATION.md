# ZeroH Workflow Design Specification
## GRC-Aligned Architecture for Islamic Finance

**Version:** 1.0
**Date:** November 7, 2025
**Status:** Design Specification
**Foundation Document:** [ZEROH_SOURCE_OF_TRUTH.md](./ZEROH_SOURCE_OF_TRUTH.md)

---

## Executive Summary

This document specifies the **blank slate workflow design** for ZeroH, the AI-native GRC platform for Islamic finance. The design aligns with international GRC best practices while implementing the 5-bucket taxonomy defined in the Source of Truth.

### Core Innovation

**Configuration-Driven Control Activation**: Users configure their deal profile through a guided wizard, and the system automatically determines which of the 26 controls must be executed. This creates transparency, educational value, and ensures nothing is missed.

### Three-Phase Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Deal Profile Configuration (6-Step Wizard)       │
│  → User Input: Product, Jurisdiction, Scale, etc.          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 2: Control Activation Mapping                        │
│  → System Output: Which controls apply and WHY              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 3: Control Execution Workflow (4 Lifecycle Phases)   │
│  → Guided Execution: Pre-Issuance → Issuance → Post → Audit │
└─────────────────────────────────────────────────────────────┘
```

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Phase 1: Deal Profile Configuration](#phase-1-deal-profile-configuration)
3. [Phase 2: Control Activation Mapping](#phase-2-control-activation-mapping)
4. [Phase 3: Control Execution Workflow](#phase-3-control-execution-workflow)
5. [Alignment Matrix](#alignment-matrix)
6. [User Experience Flows](#user-experience-flows)
7. [AI Integration Points](#ai-integration-points)
8. [Implementation Patterns](#implementation-patterns)
9. [Design Rationale](#design-rationale)

---

## Design Principles

### 1. GRC Best Practice Alignment

**Standards-First Approach**: Every control cites specific standards (AAOIFI, IFSB, ICMA, BNM, FATF). Users see WHY they must complete each control, not just WHAT.

**5-Bucket Taxonomy for Monitoring**:
- Bucket 1: Shariah Governance & Compliance
- Bucket 2: Regulatory & Legal Compliance
- Bucket 3: Risk Management
- Bucket 4: Financial & Product Reporting
- Bucket 5: Audit & Assurance

### 2. Configuration-Driven Architecture

**Control Library IS the Product**: The UI auto-generates from structured control definitions. Adding a new control to the library automatically creates:
- Configuration logic to determine when it activates
- Execution steps in the workflow
- Dashboard monitoring
- Evidence requirements
- Verifiable credential templates

### 3. Lifecycle Phases for Execution

**Buckets ≠ Execution Order**: Users don't work by governance domain (Shariah, then Regulatory, then Risk). They work chronologically:
- Phase A: Pre-Issuance (structure design, documentation, approvals)
- Phase B: Issuance/Execution (transaction closing, legal finalization)
- Phase C: Post-Issuance (ongoing monitoring, reporting, covenant compliance)
- Phase D: Audit & Assurance (periodic reviews, external audits)

### 4. Transparency & Education

**Show the Reasoning**: When the system activates a control, it explains why:
- "SG-01 activated because you selected Sukuk structure (requires SSB fatwa per AAOIFI GS-1)"
- "AA-02 activated because transaction size >$50M (requires external Shariah audit per IFSB-10)"

This builds user trust and educates them on compliance requirements.

### 5. Progressive Disclosure

**Appropriate Detail at Each Stage**:
- Configuration: High-level choices (product type, jurisdiction)
- Activation Summary: Overview of what's required
- Execution: Granular steps with evidence collection
- Dashboard: Real-time compliance status across buckets

---

## Phase 1: Deal Profile Configuration

### Overview

A **6-step wizard** that captures essential deal characteristics. Each step activates specific controls based on the user's selections.

### Step 1: Product Structure Selection

**Purpose**: Determine the Islamic finance product type, which drives Shariah compliance requirements.

**User Interface**:
```
┌────────────────────────────────────────────────────────┐
│  Step 1 of 6: Select Product Structure                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Choose the Islamic finance structure for this deal:  │
│                                                        │
│  [ ] Sukuk (Asset-Backed Securities)                  │
│      → Ijarah, Murabaha, Musharakah, Mudarabah        │
│                                                        │
│  [ ] Islamic Banking Products                         │
│      → Murabaha, Tawarruq, Istisna'a, Salam          │
│                                                        │
│  [ ] Takaful (Islamic Insurance)                      │
│      → General, Family, Retakaful                     │
│                                                        │
│  [ ] Islamic Funds                                    │
│      → Equity, Sukuk, Real Estate, Commodity          │
│                                                        │
│  [ ] Equity Investment                                │
│      → Musharakah, Mudarabah, Diminishing Musharakah │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Controls Activated**:

| Control | Name | Bucket | Activation Logic |
|---------|------|--------|-----------------|
| SG-01 | SSB Mandate & Fatwa Issuance | Shariah | Always (all products require fatwa) |
| SG-02 | Shariah Review (Compliance) | Shariah | Always (ongoing conformity check) |
| RM-01 | Shariah Non-Compliance Risk ID | Risk | Always (SNC risk applies to all) |
| RM-03 | Credit/Counterparty Risk | Risk | If Murabaha, Istisna'a, or Salam selected |
| RM-04 | Equity Investment Risk | Risk | If Musharakah, Mudarabah, or Islamic Funds selected |
| FR-01 | AAOIFI/IFRS Reporting | Financial | Depends on Step 4 (Accounting Framework) |

**Example Selection**:
- User selects: "Sukuk → Ijarah"
- System notes: Activates SG-01, SG-02, RM-01 + conditional RM-02 (RoR risk for asset-based Sukuk)

---

### Step 2: Regulatory Jurisdiction

**Purpose**: Identify the primary regulatory jurisdiction(s) to determine applicable legal and regulatory requirements.

**User Interface**:
```
┌────────────────────────────────────────────────────────┐
│  Step 2 of 6: Regulatory Jurisdiction                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Select the primary jurisdiction(s):                  │
│                                                        │
│  [ ] Malaysia                                         │
│      → BNM oversight, Shariah Advisory Council        │
│                                                        │
│  [ ] UAE (DIFC/ADGM)                                  │
│      → DFSA/FSRA regulations                          │
│                                                        │
│  [ ] Saudi Arabia                                     │
│      → CMA regulations, SAMA oversight                │
│                                                        │
│  [ ] United Kingdom                                   │
│      → FCA oversight, UK Shariah Board                │
│                                                        │
│  [ ] Luxembourg                                       │
│      → CSSF oversight for Islamic funds               │
│                                                        │
│  [ ] Cross-Border (Multiple jurisdictions)            │
│      → Specify all applicable jurisdictions            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Controls Activated**:

| Control | Name | Bucket | Activation Logic |
|---------|------|--------|-----------------|
| RL-01 | Licensing & Registration | Regulatory | Always (all jurisdictions require permits) |
| RL-02 | Local Shariah Board Requirements | Regulatory | If Malaysia (BNM SAC), Saudi (local SSB), UAE (central SSB) |
| RL-03 | Public Offering Compliance | Regulatory | If Step 3 indicates public offering |
| RL-04 | AML/CTF Compliance (FATF) | Regulatory | Always (global requirement) |
| FR-03 | Taxation Compliance | Financial | Tax rules vary by jurisdiction |

**Jurisdiction-Specific Rules**:

**Malaysia** (BNM):
- Requires Shariah Governance Policy (2019) compliance → Activates SG-03
- Requires VBIAF if sustainability-linked → Conditional on Step 5
- Triggers quarterly reporting to BNM → FR-02 frequency becomes quarterly

**UAE** (DIFC/ADGM):
- DFSA/FSRA reporting requirements → RL-03 for prospectus
- Central Shariah Supervisory Authority approval → RL-02

**Saudi Arabia** (CMA):
- CMA Sukuk regulations → RL-03 for offering circular
- SAMA oversight for banking products → RL-01 licensing

**Example Selection**:
- User selects: "Malaysia" + "Cross-Border: Luxembourg"
- System notes: Dual jurisdiction triggers RL-01 (both), RL-02 (BNM SAC), FR-03 (both tax regimes)

---

### Step 3: Transaction Scale & Visibility

**Purpose**: Determine transaction size, investor type, and public visibility to activate audit and disclosure requirements.

**User Interface**:
```
┌────────────────────────────────────────────────────────┐
│  Step 3 of 6: Transaction Scale & Visibility          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Transaction Size:                                    │
│  [ ] < $10M (Small-scale)                             │
│  [ ] $10M - $50M (Medium-scale)                       │
│  [ ] $50M - $500M (Large-scale)                       │
│  [ ] > $500M (Mega-scale)                             │
│                                                        │
│  Offering Type:                                       │
│  [ ] Private Placement (Institutional investors only) │
│  [ ] Public Offering (Retail investors)               │
│  [ ] Hybrid (Both institutional and retail)           │
│                                                        │
│  Listing:                                             │
│  [ ] Not Listed                                       │
│  [ ] Listed on Exchange (specify: ________)           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Controls Activated**:

| Control | Name | Bucket | Activation Logic |
|---------|------|--------|-----------------|
| AA-01 | Internal Shariah Audit | Audit | Always (AAOIFI GS-3 baseline) |
| AA-02 | External Shariah Audit | Audit | If transaction > $50M OR public offering |
| AA-03 | Periodic Assurance Reports | Audit | If listed on exchange |
| RL-03 | Public Offering Compliance | Regulatory | If public or hybrid offering |
| FR-06 | Investor Reporting | Financial | Frequency depends on size/listing |

**Thresholds**:

**Transaction Size Impact**:
- **< $10M**: Internal audit only (AA-01), simplified reporting
- **$10M - $50M**: Internal audit + annual Shariah review
- **$50M - $500M**: External Shariah audit required (AA-02)
- **> $500M**: External audit + Big 4 accounting firm + listing expected

**Offering Type Impact**:
- **Private**: Lighter disclosure, institutional investor protections
- **Public**: Full prospectus (RL-03), retail investor protections, quarterly reporting (FR-06)
- **Listed**: Continuous disclosure (RL-05), AA-03 periodic assurance

**Example Selection**:
- User selects: "$100M", "Public Offering", "Listed on Nasdaq Dubai"
- System notes: Activates AA-02 (size), RL-03 (public), AA-03 (listed), FR-06 (quarterly)

---

### Step 4: Accounting & Reporting Framework

**Purpose**: Select the accounting standard and reporting requirements to activate financial controls.

**User Interface**:
```
┌────────────────────────────────────────────────────────┐
│  Step 4 of 6: Accounting & Reporting Framework        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Primary Accounting Standard:                         │
│  [ ] AAOIFI (Accounting and Auditing Organization     │
│      for Islamic Financial Institutions)              │
│                                                        │
│  [ ] IFRS (International Financial Reporting Standards│
│      with Islamic finance adaptations)                │
│                                                        │
│  [ ] Dual Reporting (AAOIFI + IFRS)                   │
│                                                        │
│  Reporting Frequency:                                 │
│  [ ] Annual                                           │
│  [ ] Semi-Annual                                      │
│  [ ] Quarterly                                        │
│  [ ] Monthly (institutional investors)                │
│                                                        │
│  Financial Year End:                                  │
│  [ Month Dropdown ]                                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Controls Activated**:

| Control | Name | Bucket | Activation Logic |
|---------|------|--------|-----------------|
| FR-01 | AAOIFI/IFRS Reporting | Financial | Always (base financial reporting) |
| FR-02 | Regulatory Reporting | Financial | Frequency set by Step 2 jurisdiction |
| FR-03 | Taxation Compliance | Financial | Tax rules from Step 2 jurisdiction |
| FR-06 | Investor Reporting | Financial | Frequency set by this step |
| AA-05 | Shariah Audit (if AAOIFI) | Audit | If AAOIFI selected (requires Shariah audit per GS-3) |

**Framework Impact**:

**AAOIFI**:
- Activates AA-05 (Shariah audit mandatory per AAOIFI GS-3)
- Requires FAS-compliant templates for FR-01
- Zakah calculation if applicable
- Purification of non-compliant income (links to SG-05)

**IFRS**:
- Uses IFRS 9 (Financial Instruments) adaptations for Islamic finance
- No automatic Shariah audit requirement (unless triggered by Step 3 size)
- Focuses on substance-over-form for asset recognition

**Dual Reporting**:
- Creates two parallel reporting streams
- Increases AA-01 scope (reconciliation between frameworks)
- Common for cross-border transactions

**Example Selection**:
- User selects: "AAOIFI", "Quarterly", "December (Gregorian) + Dhul Hijjah (Hijri)"
- System notes: Activates FR-01 (AAOIFI FAS), AA-05 (Shariah audit), FR-06 (quarterly)

---

### Step 5: Sustainability & Impact (Optional)

**Purpose**: Determine if the transaction has sustainability/impact goals to activate Use of Proceeds and KPI controls.

**User Interface**:
```
┌────────────────────────────────────────────────────────┐
│  Step 5 of 6: Sustainability & Impact (Optional)      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Does this transaction have sustainability goals?     │
│  [ ] No sustainability component (skip to Step 6)     │
│  [ ] Yes - Green/Sustainable Sukuk                    │
│  [ ] Yes - Social Impact Sukuk                        │
│  [ ] Yes - Sustainability-Linked (KPI-based)          │
│                                                        │
│  If Yes, select framework alignment:                  │
│  [ ] ICMA Green Bond Principles (GBP)                 │
│  [ ] ICMA Social Bond Principles (SBP)                │
│  [ ] ICMA Sustainability-Linked Bond Principles (SLBP)│
│  [ ] BNM Value-Based Intermediation Assessment (VBIAF)│
│  [ ] UN Sustainable Development Goals (SDGs)          │
│                                                        │
│  Impact Categories (select all that apply):           │
│  [ ] Climate & Environment (SDG 13, 14, 15)           │
│  [ ] Social Welfare (SDG 1, 2, 3, 8)                  │
│  [ ] Economic Inclusion (SDG 8, 9, 10)                │
│  [ ] Governance & Ethics (SDG 16, 17)                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Controls Activated**:

| Control | Name | Bucket | Activation Logic |
|---------|------|--------|-----------------|
| FR-04 | Use of Proceeds Tracking | Financial | If Green/Social Sukuk selected |
| FR-05 | KPI Monitoring (Sustainability) | Financial | If Sustainability-Linked selected |
| AA-04 | External Assurance (Impact/ESG) | Audit | If any sustainability component |
| SG-04 | Shariah Risk Management | Shariah | Updated to include Maqasid alignment check |

**Sustainability Framework Impact**:

**ICMA GBP/SBP**:
- Requires Use of Proceeds framework (FR-04)
- Project eligibility criteria (renewable energy, affordable housing, etc.)
- Annual impact reporting
- External review (Second Party Opinion) → AA-04

**ICMA SLBP**:
- Requires KPI selection and baseline (FR-05)
- Sustainability Performance Targets (SPTs)
- Step-up/step-down coupon mechanics
- Annual verification of KPIs → AA-04

**BNM VBIAF** (Malaysia-specific):
- Value-Based Intermediation scorecard
- Maqasid al-Shariah alignment (faith, life, intellect, lineage, wealth)
- Community impact assessment
- Quarterly VBIAF reporting to BNM

**Example Selection**:
- User selects: "Yes - Green Sukuk", "ICMA GBP", "Climate & Environment (SDG 13)"
- System notes: Activates FR-04 (Use of Proceeds), AA-04 (Second Party Opinion), SG-04 (Maqasid check)

---

### Step 6: Stakeholder & Governance Setup

**Purpose**: Define roles, responsibilities, SLA requirements, risk appetite, and disclosure policies.

**User Interface**:
```
┌────────────────────────────────────────────────────────┐
│  Step 6 of 6: Stakeholder & Governance Setup          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Key Stakeholders:                                    │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Shariah Supervisory Board (SSB)                  │ │
│  │ [ ] Internal SSB  [ ] External Scholars          │ │
│  │ Scholars: [Add names/institutions]               │ │
│  │ Fatwa SLA: [ 14 days ] [ 30 days ] [ Custom ]    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Compliance Function                               │ │
│  │ Owner: [Name/Role]                               │ │
│  │ Shariah Review SLA: [ Weekly ] [ Monthly ]       │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Risk Management                                   │ │
│  │ Owner: [Name/Role]                               │ │
│  │ Risk Appetite: [ Conservative ] [ Moderate ]     │ │
│  │                [ Aggressive ]                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Disclosure & Selective Sharing                    │ │
│  │ [ ] Enable Verifiable Credentials for proofs     │ │
│  │ [ ] Investors see: [Compliance status only]      │ │
│  │                   [Full audit trail]             │ │
│  │                   [Custom per investor type]     │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Controls Activated**:

| Control | Name | Bucket | Activation Logic |
|---------|------|--------|-----------------|
| SG-01 | SSB Mandate & Fatwa Issuance | Shariah | SSB setup determines fatwa workflow SLA |
| SG-02 | Shariah Review (Compliance) | Shariah | Compliance owner and review frequency set |
| RM-01-05 | Risk Controls | Risk | Risk appetite determines thresholds |
| RL-05 | Ongoing Disclosure | Regulatory | Disclosure policy determines what gets published |

**Governance Impact**:

**SSB Configuration**:
- **Internal SSB**: Faster fatwa turnaround, lower cost, potential independence concerns
- **External Scholars**: Higher credibility, longer SLA, higher fees
- Fatwa SLA determines SG-01 task deadline

**Risk Appetite**:
- **Conservative**: Tighter limits on RM-02 (RoR risk), RM-03 (credit risk), higher equity ratio
- **Moderate**: Balanced approach per IFSB-1 guidelines
- **Aggressive**: Higher leverage permitted, requires stronger RM-05 (stress testing)

**Disclosure Policy**:
- **Compliance Status Only**: Investors see green/yellow/red status, not underlying evidence
- **Full Audit Trail**: Complete transparency (rare, institutional only)
- **Custom per Investor Type**: Retail sees summary, institutional sees details, regulators see everything

**Verifiable Credentials (VCs)**:
- If enabled, each control execution mints a VC upon completion
- VCs are cryptographically signed, tamper-proof
- Selective disclosure allows sharing specific claims without revealing full evidence

**Example Selection**:
- User configures: "External SSB (3 scholars)", "30-day fatwa SLA", "Moderate risk", "VCs enabled"
- System notes: SG-01 SLA set to 30 days, risk thresholds loaded from moderate profile, VC minting enabled for all controls

---

### Configuration Completion

After Step 6, the system has captured:
1. **Product Structure** → Determines core Shariah and risk controls
2. **Jurisdiction** → Determines regulatory and legal controls
3. **Transaction Scale** → Determines audit intensity
4. **Accounting Framework** → Determines financial reporting controls
5. **Sustainability** → Optionally activates impact controls
6. **Governance** → Sets SLAs, risk appetite, disclosure rules

**Next Phase**: Control Activation Mapping

---

## Phase 2: Control Activation Mapping

### Overview

After configuration, the system analyzes the user's inputs and determines which of the 26 controls apply to this specific deal. The system then presents a **Control Activation Summary** that shows:
- All 5 buckets with activated controls
- WHY each control was activated (educational)
- Standard references for each control
- Ability to drill down or adjust configuration

### Control Activation Summary Screen

**User Interface**:
```
┌───────────────────────────────────────────────────────────────────┐
│  Control Activation Summary                                       │
│  Based on your configuration, 22 of 26 controls will be executed │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🕌 BUCKET 1: SHARIAH GOVERNANCE & COMPLIANCE (5/5 activated)    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ✓ SG-01: SSB Mandate & Fatwa Issuance                       │ │
│  │   Why: All Islamic finance products require SSB fatwa       │ │
│  │   Standard: AAOIFI GS-1; IFSB-10 §4.1                       │ │
│  │                                                              │ │
│  │ ✓ SG-02: Shariah Review (Compliance Function)               │ │
│  │   Why: Ongoing conformity monitoring required               │ │
│  │   Standard: AAOIFI GS-2; BNM SG Policy §7                   │ │
│  │                                                              │ │
│  │ ✓ SG-03: Shariah Risk Management                            │ │
│  │   Why: SNC risk must be identified and managed              │ │
│  │   Standard: BNM Shariah Governance §5; IFSB-1 §7.2          │ │
│  │                                                              │ │
│  │ ✓ SG-04: Shariah Audit (Internal/Independent)               │ │
│  │   Why: Periodic execution audit per AAOIFI GS-3             │ │
│  │   Standard: AAOIFI GS-3                                     │ │
│  │                                                              │ │
│  │ ✓ SG-05: SNC Event Handling & Purification                  │ │
│  │   Why: Must log and purify any non-compliant income         │ │
│  │   Standard: IFSB-1 §7.2; AAOIFI GS-1 §3                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ⚖️ BUCKET 2: REGULATORY & LEGAL COMPLIANCE (4/5 activated)      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ✓ RL-01: Licensing & Registration                           │ │
│  │   Why: Malaysia jurisdiction requires BNM licensing         │ │
│  │   Standard: BNM Financial Services Act 2013                 │ │
│  │                                                              │ │
│  │ ✓ RL-02: Local Shariah Board Requirements                   │ │
│  │   Why: BNM requires SAC endorsement for Malaysia            │ │
│  │   Standard: BNM Shariah Governance Policy 2019 §3           │ │
│  │                                                              │ │
│  │ ✓ RL-03: Public Offering Compliance                         │ │
│  │   Why: Public offering requires prospectus/offering circular│ │
│  │   Standard: BNM SC Guidelines; MAS Notice                   │ │
│  │                                                              │ │
│  │ ✓ RL-04: AML/CTF Compliance                                 │ │
│  │   Why: FATF 40 Recommendations apply globally               │ │
│  │   Standard: FATF R.10, R.11 (CDD for Islamic finance)       │ │
│  │                                                              │ │
│  │ ✗ RL-05: Ongoing Disclosure & Material Events               │ │
│  │   Why: Not activated (not listed on exchange)               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  📊 BUCKET 3: RISK MANAGEMENT (4/5 activated)                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ✓ RM-01: Shariah Non-Compliance (SNC) Risk ID               │ │
│  │   Why: All products have SNC risk                           │ │
│  │   Standard: IFSB-1 §7.2; BNM ICAAP                          │ │
│  │                                                              │ │
│  │ ✓ RM-02: Rate-of-Return (RoR) Risk                          │ │
│  │   Why: Ijarah Sukuk has asset-based return volatility       │ │
│  │   Standard: IFSB-1 §4.4; IFSB-10 §7.1                       │ │
│  │                                                              │ │
│  │ ✓ RM-03: Credit/Counterparty Risk                           │ │
│  │   Why: Counterparty payment obligations exist               │ │
│  │   Standard: IFSB-1 §4.5; Basel III (IFSB adaptation)        │ │
│  │                                                              │ │
│  │ ✗ RM-04: Equity Investment Risk                             │ │
│  │   Why: Not activated (not Musharakah/Mudarabah structure)   │ │
│  │                                                              │ │
│  │ ✓ RM-05: Stress Testing & Scenario Analysis                 │ │
│  │   Why: Transaction size >$50M requires stress testing       │ │
│  │   Standard: IFSB-1 §6.3; BNM Stress Testing Guidelines      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  📈 BUCKET 4: FINANCIAL & PRODUCT REPORTING (5/6 activated)      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ✓ FR-01: AAOIFI/IFRS-Compliant Reporting                    │ │
│  │   Why: AAOIFI framework selected in Step 4                  │ │
│  │   Standard: AAOIFI FAS 1-34; IFSB-1 §9                      │ │
│  │                                                              │ │
│  │ ✓ FR-02: Regulatory Reporting                               │ │
│  │   Why: BNM requires quarterly reporting for Sukuk >$50M     │ │
│  │   Standard: BNM Reporting Requirements (RR series)          │ │
│  │                                                              │ │
│  │ ✓ FR-03: Taxation Compliance                                │ │
│  │   Why: Malaysia tax reporting required                      │ │
│  │   Standard: Malaysia Income Tax Act 1967 (Islamic finance)  │ │
│  │                                                              │ │
│  │ ✓ FR-04: Use of Proceeds Tracking                           │ │
│  │   Why: Green Sukuk requires eligible project tracking       │ │
│  │   Standard: ICMA GBP; AAOIFI GS-47 (Sustainable Sukuk)      │ │
│  │                                                              │ │
│  │ ✗ FR-05: KPI Monitoring (Sustainability-Linked)             │ │
│  │   Why: Not activated (Green Sukuk, not SLBP)                │ │
│  │                                                              │ │
│  │ ✓ FR-06: Investor Reporting                                 │ │
│  │   Why: Public offering requires quarterly investor updates  │ │
│  │   Standard: ICMA transparency recommendations               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  🔍 BUCKET 5: AUDIT & ASSURANCE (4/5 activated)                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ✓ AA-01: Internal Shariah Audit                             │ │
│  │   Why: AAOIFI GS-3 baseline requirement for all products    │ │
│  │   Standard: AAOIFI GS-3; IFSB-10 §4.2                       │ │
│  │                                                              │ │
│  │ ✓ AA-02: External Shariah Audit                             │ │
│  │   Why: Transaction size >$50M requires independent audit    │ │
│  │   Standard: IFSB-10 §4.2; BNM audit guidelines              │ │
│  │                                                              │ │
│  │ ✗ AA-03: Periodic Assurance Reports                         │ │
│  │   Why: Not activated (not listed on exchange)               │ │
│  │                                                              │ │
│  │ ✓ AA-04: External Assurance (Impact/ESG)                    │ │
│  │   Why: Green Sukuk requires Second Party Opinion            │ │
│  │   Standard: ICMA GBP §4 (External Review)                   │ │
│  │                                                              │ │
│  │ ✓ AA-05: Shariah Audit (AAOIFI-specific)                    │ │
│  │   Why: AAOIFI framework requires Shariah audit per GS-3     │ │
│  │   Standard: AAOIFI GS-3 §5                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  [View Detailed Mapping]  [Adjust Configuration]  [Proceed] │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### Activation Logic Reference

The system uses a rules engine to map configuration choices to control activation:

**Rule Format**:
```typescript
interface ActivationRule {
  controlId: string
  condition: (config: DealConfiguration) => boolean
  reason: string
  standardReference: string
}
```

**Example Rules**:

```typescript
const activationRules: ActivationRule[] = [
  {
    controlId: 'SG-01',
    condition: (config) => true, // Always active
    reason: 'All Islamic finance products require SSB fatwa',
    standardReference: 'AAOIFI GS-1; IFSB-10 §4.1'
  },
  {
    controlId: 'RM-02',
    condition: (config) =>
      config.productStructure.category === 'Sukuk' &&
      ['Ijarah', 'Mudarabah'].includes(config.productStructure.subtype),
    reason: 'Asset-based Sukuk structures have Rate-of-Return risk',
    standardReference: 'IFSB-1 §4.4; IFSB-10 §7.1'
  },
  {
    controlId: 'AA-02',
    condition: (config) =>
      config.transactionScale.size > 50_000_000 ||
      config.transactionScale.offeringType === 'public',
    reason: 'Transaction size >$50M or public offering requires external Shariah audit',
    standardReference: 'IFSB-10 §4.2; BNM audit guidelines'
  },
  {
    controlId: 'FR-04',
    condition: (config) =>
      config.sustainability?.enabled &&
      ['green', 'social'].includes(config.sustainability.type),
    reason: 'Green/Social Sukuk requires Use of Proceeds tracking',
    standardReference: 'ICMA GBP; AAOIFI GS-47 (Sustainable Sukuk)'
  },
  {
    controlId: 'RL-02',
    condition: (config) =>
      ['Malaysia', 'Saudi Arabia', 'UAE'].includes(config.jurisdiction.primary),
    reason: `${config.jurisdiction.primary} requires local Shariah Board endorsement`,
    standardReference:
      config.jurisdiction.primary === 'Malaysia' ? 'BNM Shariah Governance Policy 2019 §3' :
      config.jurisdiction.primary === 'Saudi Arabia' ? 'CMA Sukuk Regulations Art. 8' :
      'DFSA/FSRA Shariah Supervisory requirements'
  }
]
```

### User Actions

**View Detailed Mapping**:
Opens a modal showing the full configuration → control mapping logic:
```
Configuration Input              Activated Controls
─────────────────────           ──────────────────
Product: Sukuk → Ijarah    →    SG-01, SG-02, RM-01, RM-02
Jurisdiction: Malaysia     →    RL-01, RL-02, FR-03
Size: $100M + Public       →    AA-02, RL-03, FR-06
Accounting: AAOIFI         →    FR-01, AA-05
Sustainability: Green      →    FR-04, AA-04
```

**Adjust Configuration**:
Returns to Phase 1 wizard to modify selections. The system recalculates control activation when the user returns.

**Proceed**:
Locks in the activated controls and proceeds to Phase 3: Control Execution Workflow.

---

## Phase 3: Control Execution Workflow

### Overview

After control activation is confirmed, the user executes the 22 activated controls organized by **4 Lifecycle Phases**:

- **Phase A: Pre-Issuance** (8 controls) - Structure design, documentation, approvals
- **Phase B: Issuance/Execution** (6 controls) - Transaction closing, legal finalization
- **Phase C: Post-Issuance** (5 controls) - Ongoing monitoring, recurring
- **Phase D: Audit & Assurance** (3 controls) - Periodic reviews, annual

**Key Principle**: Buckets are for **monitoring** (dashboard), phases are for **execution** (workflow).

### Phase A: Pre-Issuance (Setup & Approval)

**Timeline**: Typically 2-6 months before transaction closing
**Purpose**: Design the structure, obtain approvals, prepare documentation

**Controls in this Phase**:

| Step | Control | Name | Bucket | Owner | Duration |
|------|---------|------|--------|-------|----------|
| A1 | SG-01 | SSB Mandate & Fatwa Issuance | Shariah | SSB | 30 days |
| A2 | SG-03 | Shariah Risk Management | Shariah | Risk Mgmt | 14 days |
| A3 | RM-01 | SNC Risk Identification | Risk | Risk Mgmt | 7 days |
| A4 | RM-02 | RoR Risk Assessment | Risk | Risk Mgmt | 7 days |
| A5 | RM-03 | Credit/Counterparty Risk | Risk | Risk Mgmt | 7 days |
| A6 | RL-01 | Licensing & Registration | Regulatory | Legal | 60 days |
| A7 | RL-02 | Local Shariah Board Requirements | Regulatory | Compliance | 30 days |
| A8 | FR-04 | Use of Proceeds Framework | Financial | Finance | 14 days |

**User Interface (Phase A Overview)**:
```
┌───────────────────────────────────────────────────────────┐
│  Phase A: Pre-Issuance (Setup & Approval)                │
│  8 controls | Estimated duration: 60-90 days              │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Progress: ████████░░░░░░░░░░ 40% (3/8 completed)        │
│                                                           │
│  ┌───────────────────────────────────────────────────────┐│
│  │ ✓ A1: SSB Mandate & Fatwa Issuance                    ││
│  │   Status: Completed (Fatwa #2024-IF-127 issued)       ││
│  │   Completed: Nov 1, 2025 | Owner: Dr. Ahmad (SSB)     ││
│  │   Evidence: Fatwa_Ijarah_Sukuk.pdf ✓                  ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌───────────────────────────────────────────────────────┐│
│  │ ✓ A2: Shariah Risk Management                         ││
│  │   Status: Completed (SNC risk matrix approved)        ││
│  │   Completed: Nov 5, 2025 | Owner: Risk Mgmt Team      ││
│  │   Evidence: SNC_Risk_Matrix.xlsx ✓                    ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌───────────────────────────────────────────────────────┐│
│  │ ✓ A3: SNC Risk Identification (RM-01)                 ││
│  │   Status: Completed                                   ││
│  │   Completed: Nov 5, 2025 | Owner: Risk Mgmt Team      ││
│  │   Evidence: Risk_Register_Nov2025.pdf ✓               ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌───────────────────────────────────────────────────────┐│
│  │ 🔄 A4: RoR Risk Assessment (RM-02)                    ││
│  │   Status: In Progress | Due: Nov 12, 2025            ││
│  │   Owner: Risk Mgmt Team                               ││
│  │   AI Agent: Analyzing rental volatility scenarios...  ││
│  │   [View Details] [Upload Evidence]                    ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌───────────────────────────────────────────────────────┐│
│  │ ⏳ A5: Credit/Counterparty Risk (RM-03)              ││
│  │   Status: Pending | Starts: Nov 13, 2025             ││
│  │   Owner: Risk Mgmt Team                               ││
│  │   [Start Control]                                     ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ... (remaining controls collapsed)                       │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Example Control Detail (A4: RoR Risk Assessment)**:

```
┌──────────────────────────────────────────────────────────────┐
│  RM-02: Rate-of-Return (RoR) Risk Assessment                │
│  Phase A: Pre-Issuance | Step A4 of 8                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📋 CONTROL DETAILS                                          │
│  ────────────────────────────────────────────────────────    │
│  Purpose: Quantify and manage variability in asset returns  │
│            that affect profit distributions to Sukuk holders│
│                                                              │
│  Standard: IFSB-1 §4.4; IFSB-10 §7.1                         │
│                                                              │
│  Trigger: Activated because:                                │
│           - Ijarah Sukuk structure selected                  │
│           - Asset-based returns subject to market volatility │
│                                                              │
│  Owner: Risk Management Team                                │
│  SLA: 7 business days from A3 completion                    │
│  Started: Nov 8, 2025 | Due: Nov 12, 2025                   │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│  📊 REQUIRED EVIDENCE                                        │
│  ────────────────────────────────────────────────────────    │
│  [ ] RoR stress testing scenarios (3 scenarios minimum)     │
│      → AI Agent analyzing rental market volatility...       │
│                                                              │
│  [ ] Profit-smoothing reserve policy (if applicable)        │
│      → Upload policy document or confirm N/A                │
│                                                              │
│  [ ] Displaced Commercial Risk (DCR) analysis               │
│      → Will competitive pressure force profit distributions  │
│         beyond actual returns?                              │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│  🤖 AI AGENT ASSISTANCE                                      │
│  ────────────────────────────────────────────────────────    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Evidence Collection Agent (Running)                    │ │
│  │                                                        │ │
│  │ ✓ Retrieved rental yield data (Malaysia, 2020-2025)   │ │
│  │ ✓ Identified comparable Ijarah Sukuk benchmarks        │ │
│  │ 🔄 Generating stress scenarios:                        │ │
│  │    - Base case (expected rental yield)                 │ │
│  │    - Downside (-20% rental income shock)               │ │
│  │    - Severe downside (-40% rental income shock)        │ │
│  │                                                        │ │
│  │ Draft RoR stress test will be ready in 2 hours.        │ │
│  │ [Preview Draft] [Approve & Finalize]                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│  💬 COLLABORATION                                            │
│  ────────────────────────────────────────────────────────    │
│  @RiskAnalyst: Can you validate the stress scenarios?       │
│  @ComplianceOfficer: Does this satisfy BNM requirements?    │
│                                                              │
│  [Add Comment] [Mention Teammate] [Request Review]          │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│  ACTIONS                                                     │
│  ────────────────────────────────────────────────────────    │
│  [Upload Evidence Manually] [Approve AI-Generated Evidence] │
│  [Request Extension] [Mark as Complete]                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Phase A Completion**:
Once all 8 controls are completed, the system:
1. Generates a **Phase A Completion Report** (summary of all evidence collected)
2. Optionally mints **Verifiable Credentials** for SG-01 fatwa, RL-01 licensing, etc.
3. Unlocks **Phase B: Issuance/Execution**

---

### Phase B: Issuance/Execution (Transaction Closing)

**Timeline**: Typically 1-4 weeks around transaction closing date
**Purpose**: Execute the transaction, finalize legal agreements, conduct Shariah review

**Controls in this Phase**:

| Step | Control | Name | Bucket | Owner | Duration |
|------|---------|------|--------|-------|----------|
| B1 | SG-02 | Shariah Review (Compliance) | Shariah | Compliance | 7 days |
| B2 | RL-03 | Public Offering Compliance | Regulatory | Legal | 30 days |
| B3 | RL-04 | AML/CTF Compliance | Regulatory | Compliance | 14 days |
| B4 | RM-05 | Stress Testing & Scenario Analysis | Risk | Risk Mgmt | 14 days |
| B5 | FR-01 | AAOIFI/IFRS Reporting (Initial) | Financial | Finance | 14 days |
| B6 | AA-04 | External Assurance (Impact/ESG) | Audit | External Auditor | 30 days |

**Key Controls**:

**B1: Shariah Review (SG-02)**
- Review of all transaction documents for Shariah conformity
- Checklist against fatwa issued in A1 (SG-01)
- Sign-off from Compliance Function (not SSB - that's SG-04 audit)
- Evidence: Shariah Compliance Certificate, Document Review Report

**B2: Public Offering Compliance (RL-03)**
- Prospectus/Offering Circular preparation and filing
- Regulatory approval from BNM/SC (Malaysia) or equivalent
- Material disclosure requirements
- Evidence: Approved Prospectus, Regulatory Approval Letter

**B3: AML/CTF Compliance (RL-04)**
- Customer Due Diligence (CDD) for all investors
- Beneficial ownership identification
- FATF Recommendation 10, 11 compliance
- Evidence: CDD Forms, AML Risk Assessment, Screening Reports

**B6: External Assurance (Impact/ESG) (AA-04)**
- Second Party Opinion (SPO) for Green Sukuk
- Confirms Use of Proceeds framework aligns with ICMA GBP
- Pre-issuance assurance
- Evidence: SPO Report from accredited provider (e.g., Sustainalytics, S&P)

**Phase B Completion**:
Once all 6 controls are completed and transaction closes:
1. Sukuk is issued to investors
2. Proceeds are disbursed per Use of Proceeds framework (FR-04)
3. Ongoing monitoring begins (Phase C)
4. System mints VCs for public offering compliance, AML compliance, etc.

---

### Phase C: Post-Issuance (Ongoing Monitoring)

**Timeline**: Recurring for the life of the Sukuk (e.g., 5 years)
**Purpose**: Continuous compliance monitoring, reporting, covenant tracking

**Controls in this Phase** (Recurring):

| Control | Name | Bucket | Frequency | Owner |
|---------|------|--------|-----------|-------|
| SG-02 | Shariah Review (Ongoing) | Shariah | Monthly | Compliance |
| FR-01 | AAOIFI/IFRS Reporting | Financial | Quarterly | Finance |
| FR-02 | Regulatory Reporting | Financial | Quarterly | Finance |
| FR-04 | Use of Proceeds Tracking | Financial | Quarterly | Finance |
| FR-06 | Investor Reporting | Financial | Quarterly | Finance |

**Recurring Control Example (FR-04: Use of Proceeds Tracking)**:

Each quarter, the system triggers FR-04 to verify Green Sukuk proceeds are used for eligible projects:

```
┌──────────────────────────────────────────────────────────────┐
│  FR-04: Use of Proceeds Tracking (Q3 2025)                  │
│  Phase C: Post-Issuance | Recurring Control                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 PROCEEDS ALLOCATION STATUS                               │
│  ────────────────────────────────────────────────────────    │
│  Total Sukuk Proceeds: $100M                                │
│  Allocated to Eligible Projects: $85M (85%)                 │
│  Unallocated (in escrow): $15M (15%)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Eligible Green Projects (ICMA GBP Category: Renewable  │ │
│  │ Energy)                                                │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 1. Solar Farm (Kedah) - $50M allocated ✓               │ │
│  │    - Capacity: 30 MW                                   │ │
│  │    - CO2 avoided: ~25,000 tons/year                    │ │
│  │                                                        │ │
│  │ 2. Wind Farm (Terengganu) - $35M allocated ✓           │ │
│  │    - Capacity: 20 MW                                   │ │
│  │    - CO2 avoided: ~18,000 tons/year                    │ │
│  │                                                        │ │
│  │ 3. Future Project (To be allocated) - $15M pending     │ │
│  │    - Deadline: Q4 2025                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  🤖 AI AGENT FINDINGS                                        │
│  ────────────────────────────────────────────────────────    │
│  ✓ All allocated projects meet ICMA GBP eligibility         │
│  ✓ No proceeds used for non-eligible purposes               │
│  ⚠️ $15M unallocated for >90 days (approaching ICMA limit)   │
│     → Recommendation: Identify next eligible project        │
│                                                              │
│  📄 REQUIRED EVIDENCE                                        │
│  ────────────────────────────────────────────────────────    │
│  [✓] Use of Proceeds Allocation Report (Q3 2025)            │
│  [✓] Project disbursement receipts                          │
│  [✓] Project eligibility confirmation                       │
│  [✓] Unallocated proceeds management report                 │
│                                                              │
│  ACTIONS                                                     │
│  ────────────────────────────────────────────────────────    │
│  [Generate Investor Report] [Mark as Complete]              │
│  [Flag for External Assurance Review (AA-04 annual)]        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Phase C Automation**:
- AI agents automatically pull project disbursement data from accounting systems
- Flag deviations (e.g., unallocated proceeds >90 days)
- Generate draft investor reports
- Queue evidence for annual external assurance (AA-04)

**Phase C Never Ends**: These controls recur quarterly until Sukuk maturity (e.g., 5 years).

---

### Phase D: Audit & Assurance (Periodic Reviews)

**Timeline**: Annual or as required by regulation
**Purpose**: Independent verification of compliance, risk management, and financial reporting

**Controls in this Phase**:

| Control | Name | Bucket | Frequency | Owner |
|---------|------|--------|-----------|-------|
| SG-04 | Shariah Audit (Internal/Independent) | Shariah | Annual | Internal Audit |
| AA-01 | Internal Shariah Audit | Audit | Annual | Internal Audit |
| AA-02 | External Shariah Audit | Audit | Annual | External Auditor |
| AA-05 | Shariah Audit (AAOIFI-specific) | Audit | Annual | External Auditor |

**Key Distinction**:
- **SG-04 & AA-01**: Internal Shariah Audit (company's internal audit function)
- **AA-02 & AA-05**: External Shariah Audit (independent third party, required for AAOIFI or large transactions)

**Example: AA-02 External Shariah Audit (Annual)**

```
┌──────────────────────────────────────────────────────────────┐
│  AA-02: External Shariah Audit (FY 2025)                    │
│  Phase D: Audit & Assurance | Annual Control                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🔍 AUDIT SCOPE                                              │
│  ────────────────────────────────────────────────────────    │
│  Period: Jan 1, 2025 - Dec 31, 2025                         │
│  Auditor: KPMG Islamic Finance Audit Team                   │
│  Standards: IFSB-10 §4.2; AAOIFI GS-3                        │
│                                                              │
│  Audit Focus Areas:                                         │
│  1. Shariah compliance of transaction structure             │
│  2. Ongoing conformity with SSB fatwa (#2024-IF-127)        │
│  3. Use of Proceeds adherence to Green criteria             │
│  4. SNC event handling and purification (if any)            │
│                                                              │
│  📊 EVIDENCE PROVIDED TO AUDITOR                             │
│  ────────────────────────────────────────────────────────    │
│  [✓] SSB Fatwa and Shariah Review Reports (SG-01, SG-02)    │
│  [✓] Risk Management Documentation (RM-01, RM-02, RM-03)     │
│  [✓] Use of Proceeds Quarterly Reports (FR-04 Q1-Q4)        │
│  [✓] Investor Reporting (FR-06 Q1-Q4)                       │
│  [✓] SNC Event Log (SG-05) - No events recorded ✓           │
│  [✓] Internal Audit Report (AA-01)                          │
│                                                              │
│  🤖 AI AGENT: AUDIT READINESS CHECK                          │
│  ────────────────────────────────────────────────────────    │
│  ✓ All required evidence collected and organized            │
│  ✓ No control failures detected in FY 2025                  │
│  ✓ 100% compliance with SSB fatwa                           │
│  ⚠️ Minor observation: FR-04 Q4 report submitted 2 days late │
│     (not material, but flagged for process improvement)     │
│                                                              │
│  📄 AUDIT DELIVERABLES (Expected)                            │
│  ────────────────────────────────────────────────────────    │
│  [ ] External Shariah Audit Report (clean opinion expected) │
│      Due: March 31, 2026 (90 days post-FYE)                 │
│                                                              │
│  [ ] Management Letter (recommendations, if any)            │
│                                                              │
│  ACTIONS                                                     │
│  ────────────────────────────────────────────────────────    │
│  [Provide Evidence to Auditor] [Schedule Audit Fieldwork]   │
│  [Await Audit Report] [Publish to Investors]                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Phase D Completion**:
- External auditor issues Shariah Audit Report (clean opinion = full compliance)
- Report is shared with investors (RL-05 if listed) and regulators (FR-02)
- System mints Verifiable Credential for "2025 Shariah Audit - Clean Opinion"
- Cycle repeats next year

---

### Multi-Phase Control Execution

**Some controls execute in multiple phases**:

**SG-02: Shariah Review**
- **Phase A**: Initial review of transaction documents (pre-issuance)
- **Phase B**: Final review before closing (issuance)
- **Phase C**: Ongoing monthly reviews (post-issuance)

**FR-01: AAOIFI/IFRS Reporting**
- **Phase B**: Initial financial statement preparation (at issuance)
- **Phase C**: Quarterly financial reporting (recurring)
- **Phase D**: Annual audited financial statements (with AA-02)

The system tracks each execution instance separately:
- SG-02 (Phase A, Nov 2025) - Completed
- SG-02 (Phase B, Nov 2025) - Completed
- SG-02 (Phase C, Dec 2025) - In Progress
- SG-02 (Phase C, Jan 2026) - Pending

---

## Alignment Matrix

### Configuration → Control Activation

This matrix shows how each configuration step activates controls across the 5 buckets:

| Configuration Step | Bucket 1 (Shariah) | Bucket 2 (Regulatory) | Bucket 3 (Risk) | Bucket 4 (Financial) | Bucket 5 (Audit) |
|--------------------|--------------------|-----------------------|-----------------|----------------------|------------------|
| **Step 1: Product Structure** | SG-01, SG-02 (always) | - | RM-01 (always)<br>RM-02 (if asset-based)<br>RM-03 (if debt-like)<br>RM-04 (if equity) | - | AA-01 (always) |
| **Step 2: Jurisdiction** | SG-03 (if Malaysia) | RL-01 (always)<br>RL-02 (if Malaysia/Saudi/UAE)<br>RL-04 (always, FATF) | - | FR-03 (jurisdiction tax rules) | - |
| **Step 3: Transaction Scale** | - | RL-03 (if public offering)<br>RL-05 (if listed) | RM-05 (if >$50M) | FR-06 (frequency by size) | AA-02 (if >$50M or public)<br>AA-03 (if listed) |
| **Step 4: Accounting Framework** | - | - | - | FR-01 (AAOIFI or IFRS)<br>FR-02 (regulator frequency) | AA-05 (if AAOIFI selected) |
| **Step 5: Sustainability** | SG-04 (Maqasid check) | - | - | FR-04 (if Green/Social)<br>FR-05 (if SLBP) | AA-04 (if any sustainability) |
| **Step 6: Stakeholder Setup** | All (sets SLAs) | - | All (sets risk appetite thresholds) | - | All (sets audit scope) |

### Control → Lifecycle Phase Mapping

This matrix shows when each control is executed across the 4 lifecycle phases:

| Control | Pre-Issuance (A) | Issuance (B) | Post-Issuance (C) | Audit (D) |
|---------|------------------|--------------|-------------------|-----------|
| SG-01 | ✓ (one-time) | - | - | - |
| SG-02 | ✓ (initial) | ✓ (final) | ✓ (monthly) | - |
| SG-03 | ✓ (setup) | - | - | - |
| SG-04 | - | - | - | ✓ (annual) |
| SG-05 | - | - | ✓ (event-driven) | - |
| RL-01 | ✓ (one-time) | - | - | - |
| RL-02 | ✓ (one-time) | - | - | - |
| RL-03 | - | ✓ (one-time) | - | - |
| RL-04 | - | ✓ (one-time) | ✓ (ongoing CDD) | - |
| RL-05 | - | - | ✓ (continuous) | - |
| RM-01 | ✓ (one-time) | - | - | - |
| RM-02 | ✓ (one-time) | - | ✓ (quarterly review) | - |
| RM-03 | ✓ (one-time) | - | ✓ (quarterly review) | - |
| RM-04 | ✓ (one-time) | - | ✓ (quarterly review) | - |
| RM-05 | - | ✓ (one-time) | ✓ (annual) | - |
| FR-01 | - | ✓ (initial) | ✓ (quarterly) | ✓ (annual audited) |
| FR-02 | - | - | ✓ (quarterly) | - |
| FR-03 | - | ✓ (initial) | ✓ (annual) | - |
| FR-04 | ✓ (framework setup) | - | ✓ (quarterly tracking) | - |
| FR-05 | ✓ (KPI baseline) | - | ✓ (quarterly monitoring) | - |
| FR-06 | - | ✓ (initial disclosure) | ✓ (quarterly) | - |
| AA-01 | - | - | - | ✓ (annual) |
| AA-02 | - | - | - | ✓ (annual) |
| AA-03 | - | - | ✓ (semi-annual if listed) | - |
| AA-04 | - | ✓ (pre-issuance SPO) | ✓ (annual verification) | - |
| AA-05 | - | - | - | ✓ (annual if AAOIFI) |

---

## User Experience Flows

### Flow 1: New User Creating First Deal

**Scenario**: Compliance manager at an Islamic bank creating a $100M Green Ijarah Sukuk for Malaysia.

**Steps**:

1. **Landing**: User logs in → Dashboard shows "No deals yet. Create your first deal?"

2. **Phase 1: Configuration Wizard**
   - Step 1: Selects "Sukuk → Ijarah"
   - Step 2: Selects "Malaysia" (primary jurisdiction)
   - Step 3: Enters "$100M", "Public Offering", "Listed on Bursa Malaysia"
   - Step 4: Selects "AAOIFI", "Quarterly reporting"
   - Step 5: Selects "Yes - Green Sukuk", "ICMA GBP", "Climate & Environment (SDG 13)"
   - Step 6: Configures SSB (external, 30-day SLA), Moderate risk appetite, VCs enabled

3. **Phase 2: Control Activation Summary**
   - System shows: "22 of 26 controls activated"
   - User reviews activation reasons (educational moment)
   - User clicks "View Detailed Mapping" to understand why RM-02 activated (Ijarah → RoR risk)
   - User clicks "Proceed" to confirm

4. **Phase 3: Execution Begins**
   - User lands on **Phase A: Pre-Issuance** overview
   - Sees 8 controls in Phase A
   - First control (A1: SG-01) is automatically started
   - User assigns A1 to SSB Chairman (Dr. Ahmad)
   - Dr. Ahmad receives notification: "New task: SSB Fatwa for Green Ijarah Sukuk"

5. **SSB Member (Dr. Ahmad) Workflow**:
   - Dr. Ahmad logs in → Sees SG-01 task
   - Reviews deal structure, Use of Proceeds framework
   - AI agent provides draft fatwa template based on previous Ijarah fatwas
   - Dr. Ahmad edits, discusses with SSB colleagues
   - Uploads final fatwa PDF: "Fatwa_Ijarah_Sukuk_#2024-IF-127.pdf"
   - Marks SG-01 as complete
   - System mints Verifiable Credential: "SSB Fatwa - Green Ijarah Sukuk"

6. **Compliance Manager Continues**:
   - Sees A1 completed ✓
   - A2 (SG-03 Shariah Risk) auto-starts
   - Assigns to Risk Management Team
   - Risk team completes A2, A3, A4 with AI agent assistance
   - ...Phase A completes after 60 days

7. **Phase B: Issuance**
   - Legal team handles B2 (RL-03 Public Offering)
   - Finance team handles B5 (FR-01 Initial Reporting)
   - External consultant handles B6 (AA-04 Second Party Opinion for Green Sukuk)
   - All 6 controls completed → Transaction closes

8. **Phase C: Post-Issuance (Recurring)**
   - System automatically creates Q1 2026 tasks:
     - SG-02 (Monthly Shariah Review - Jan 2026)
     - FR-01 (Q1 Financial Reporting - due April 2026)
     - FR-04 (Use of Proceeds Q1 - due April 2026)
     - FR-06 (Investor Report Q1 - due April 2026)
   - AI agents draft reports, humans approve
   - Quarterly cycle repeats for 5 years

9. **Phase D: Audit (Annual)**
   - December 2026: System creates AA-02 (External Shariah Audit for FY 2025)
   - Compliance manager provides all Phase C evidence to auditor
   - Auditor issues clean opinion (March 2026)
   - System mints VC: "2025 Shariah Audit - Clean Opinion"
   - Audit report shared with investors and BNM

10. **Dashboard Monitoring (Throughout)**
    - User can view dashboard anytime to see:
      - **5 Buckets**: Compliance status per bucket
      - **4 Phases**: Progress through lifecycle
      - **KRIs**: Real-time metrics (e.g., SNC events: 0, Use of Proceeds: 85% allocated)
      - **Alerts**: "FR-04 Q2 due in 7 days"

**Total Time**: 60 days (Pre-Issuance) + 30 days (Issuance) + 5 years (Post-Issuance) + Annual Audits

---

### Flow 2: Risk Analyst Completing RM-02 (RoR Risk)

**Scenario**: Risk analyst using AI agent to complete RoR risk assessment.

**Steps**:

1. **Task Assignment**:
   - Risk analyst logs in → Sees "A4: RM-02 RoR Risk Assessment" assigned to them
   - Due: Nov 12, 2025 (7 days from A3 completion)

2. **Control Detail View**:
   - Clicks on A4 → Sees control details:
     - Purpose: Quantify asset return variability
     - Standard: IFSB-1 §4.4; IFSB-10 §7.1
     - Required Evidence: Stress scenarios, DCR analysis, profit-smoothing policy

3. **AI Agent Invocation**:
   - Clicks "Start AI Evidence Collection"
   - AI Agent (Evidence Collection Copilot) begins:
     - Searches internal knowledge graph for previous Ijarah Sukuk RoR analyses
     - Fetches rental yield data from Malaysia property market (2020-2025)
     - Identifies 3 comparable Ijarah Sukuk benchmarks
     - Generates 3 stress scenarios (base, -20%, -40%)

4. **AI Agent Output (2 hours later)**:
   - Agent presents draft report: "RoR_Stress_Test_Nov2025_DRAFT.pdf"
   - Risk analyst reviews:
     - Base case: 5.2% expected rental yield → 5.0% Sukuk profit rate (20bps spread)
     - Downside: 4.2% rental yield → 4.0% Sukuk rate (spread maintained)
     - Severe: 3.1% rental yield → 3.5% Sukuk rate (spread compressed, DCR risk emerges)

5. **Human Review & Edit**:
   - Risk analyst adjusts DCR analysis:
     - Notes: "If severe scenario occurs, bank may distribute 3.5% to stay competitive even though actual return is 3.1%. This creates DCR of 40bps."
   - Adds profit-smoothing reserve policy: "Establish 50bps reserve to manage DCR"

6. **Evidence Upload**:
   - Risk analyst approves AI-generated report with edits
   - Uploads final: "RoR_Stress_Test_Nov2025_FINAL.pdf"
   - Marks A4 as complete

7. **System Actions**:
   - Stores evidence in Evidence Ledger (hash + metadata)
   - Logs event in Controls Ledger: "RM-02 completed, evidence collected"
   - Advances workflow: A5 (RM-03 Credit Risk) auto-starts
   - If VCs enabled: Mints VC "RoR Risk Assessment - Compliant"

**Total Time**: 1 day (with AI assistance) vs. 7 days (manual)

---

### Flow 3: Investor Viewing Verifiable Credential

**Scenario**: Institutional investor independently verifying compliance claims.

**Steps**:

1. **Investor Due Diligence**:
   - Investor reviewing Green Sukuk investment opportunity
   - Wants to verify: "Is this Sukuk truly Shariah-compliant and green-certified?"

2. **Issuer Shares Verifiable Credential**:
   - Issuer (via ZeroH platform) selects which VCs to share:
     - ✓ SSB Fatwa (SG-01) - "Green Ijarah Sukuk approved by SSB"
     - ✓ Second Party Opinion (AA-04) - "Meets ICMA Green Bond Principles"
     - ✓ 2025 Shariah Audit (AA-02) - "Clean opinion from KPMG"
   - System generates **Verifiable Presentation** (VP) with selective disclosure:
     - VP includes: Fatwa #, Green certification, Audit opinion
     - VP excludes: Internal risk assessments, financial details (not relevant to investor)

3. **Investor Receives VP**:
   - Investor receives JSON file: "Green_Sukuk_VP.json"
   - VP contains:
     - Issuer DID (Decentralized Identifier): `did:web:zeroh.com:issuer-bank`
     - 3 Verifiable Credentials (digitally signed)
     - Proof of issuance (cryptographic signature)

4. **Investor Verifies VP**:
   - Investor uses **ZeroH Verification Portal** or **third-party VC verifier**
   - Verification checks:
     - ✓ Signature valid (issued by `did:web:zeroh.com:issuer-bank`)
     - ✓ Not revoked (checks revocation registry)
     - ✓ Issued by authorized parties (SSB, KPMG, SPO provider)
     - ✓ Timestamps valid (fatwa issued before Sukuk issuance)

5. **Investor Trusts, Invests**:
   - Investor confirms: "This Sukuk is Shariah-compliant and green-certified"
   - Investor proceeds with investment decision
   - **No need to request full audit trail** (VC provides cryptographic proof)

**Benefit**: Selective disclosure - Investor sees only what they need, issuer doesn't expose sensitive internal data.

---

## AI Integration Points

### Where AI Adds Value

AI agents integrate at multiple points in the workflow to reduce manual effort while keeping humans in control:

### 1. Configuration Phase (Phase 1)

**AI Role**: Intelligent defaults and recommendations

**Examples**:
- **Product Structure Suggestion**: "Based on your previous 3 Sukuk issuances, you typically select Ijarah. Pre-fill this?"
- **Jurisdiction Logic**: "You selected Malaysia. BNM requires SAC endorsement (RL-02). Auto-activating this control."
- **Risk Appetite Calibration**: "Your last 2 deals used 'Moderate' risk appetite. Apply same profile?"

**Implementation**:
```typescript
// AI analyzes user history to suggest defaults
const suggestedConfig = await AI.analyzeUserHistory(userId)
// e.g., { productStructure: 'Ijarah', jurisdiction: 'Malaysia', riskAppetite: 'Moderate' }
```

### 2. Control Activation (Phase 2)

**AI Role**: Explain activation logic in plain language

**Examples**:
- User hovers over "Why was RM-02 activated?"
- AI explains: "RM-02 (RoR Risk) activated because you selected Ijarah Sukuk structure. Ijarah involves asset-based returns (rental income), which can vary based on market conditions. IFSB-1 §4.4 requires institutions to quantify this variability and manage profit distribution expectations."

**Implementation**:
```typescript
// AI generates natural language explanation
const explanation = await AI.explainControlActivation(controlId, dealConfig)
// Returns: { reason: "...", standardCitation: "IFSB-1 §4.4", educationalContext: "..." }
```

### 3. Evidence Collection (Phase 3)

**AI Role**: Draft evidence documents, gather data, flag issues

**Evidence Collection Agent** (most impactful AI integration):

**Capabilities**:
1. **Data Retrieval**: Pull rental yield data, market benchmarks, regulatory filings from internal/external sources
2. **Document Drafting**: Generate draft stress tests, risk reports, compliance checklists
3. **Gap Detection**: "RM-02 requires DCR analysis, but I don't see profit-smoothing reserve policy in your documents. Flagging for manual input."
4. **Template Matching**: "Your last RM-02 submission used this template. Shall I use the same for consistency?"

**Example (RM-02 RoR Risk)**:
```python
# AI agent workflow
async def collect_ror_evidence(control_run_id):
    # Step 1: Retrieve historical data
    rental_data = await fetch_rental_yield_data(jurisdiction='Malaysia', years=5)

    # Step 2: Identify benchmarks
    benchmarks = await search_knowledge_graph("Ijarah Sukuk rental yield Malaysia")

    # Step 3: Generate stress scenarios
    scenarios = generate_stress_scenarios(
        base_yield=rental_data.median,
        volatility=rental_data.std_dev,
        scenario_count=3
    )

    # Step 4: Draft report
    draft_report = await claude_api.generate_document(
        template="RoR_Stress_Test_Template.md",
        data={"scenarios": scenarios, "benchmarks": benchmarks}
    )

    # Step 5: Flag for human review
    return {
        "status": "draft_ready",
        "document": draft_report,
        "human_action_required": "Review DCR analysis and profit-smoothing policy"
    }
```

**Human Role**: Review AI-generated draft, edit as needed, approve and finalize.

### 4. Drift Detection (Phase 3, Ongoing)

**AI Role**: Monitor for compliance drift and flag anomalies

**Drift Detection Agent**:

**Monitors**:
- **Use of Proceeds Drift** (FR-04): "Solar farm project allocated $50M, but only $42M disbursed. Why the gap?"
- **Covenant Compliance** (RL-05): "Debt-to-equity ratio exceeded 60% threshold. Flag for disclosure."
- **Shariah Review Backlog** (SG-02): "Monthly review is 10 days overdue. Escalate to compliance officer."

**Example**:
```python
# Drift detection logic
async def detect_compliance_drift(deal_id):
    # Check Use of Proceeds allocation vs. disbursement
    uop_data = await get_uop_tracking(deal_id)
    if uop_data.allocated - uop_data.disbursed > 5_000_000:
        alert = {
            "type": "use_of_proceeds_drift",
            "severity": "medium",
            "message": f"${uop_data.allocated - uop_data.disbursed}M allocated but not disbursed",
            "action": "Verify project delays or return to escrow"
        }
        await notify_stakeholder(deal_id, alert)
```

### 5. Auto-Assignment (Phase 3)

**AI Role**: Route tasks to appropriate owners based on workload, expertise, and SLAs

**Auto-Assignment Agent**:

**Logic**:
- SG-01 (Fatwa) → Always assign to SSB Chairman
- RM-02 (RoR Risk) → Assign to Risk Analyst with Sukuk expertise + current capacity
- FR-01 (Financial Reporting) → Assign to Finance team member with lightest workload

**Example**:
```python
# Auto-assignment logic
async def assign_control_task(control_id, deal_id):
    control = await get_control_definition(control_id)

    # Get eligible owners (by role)
    eligible_owners = await get_users_by_role(control.owner_role)

    # Score by expertise and workload
    scored_owners = [
        {
            "user": owner,
            "score": calculate_assignment_score(owner, control, deal_id)
            # Score factors: past experience with this control, current task count, SLA adherence
        }
        for owner in eligible_owners
    ]

    # Assign to highest score
    best_owner = max(scored_owners, key=lambda x: x['score'])
    await assign_task(control_id, deal_id, best_owner['user'].id)
```

### 6. Report Generation (Phase 3 & 4)

**AI Role**: Draft quarterly investor reports, regulatory filings, audit summaries

**Examples**:
- **FR-06 Investor Report (Quarterly)**: AI pulls data from FR-01, FR-04, SG-02 and generates investor-friendly PDF
- **AA-02 Audit Evidence Package**: AI collects all Phase C evidence, organizes by control, generates index for auditor
- **RL-05 Material Event Disclosure**: AI drafts disclosure based on drift detection alert (e.g., covenant breach)

**Implementation**:
```python
# Generate quarterly investor report
async def generate_investor_report(deal_id, quarter):
    # Gather data
    financial_data = await get_control_evidence(deal_id, 'FR-01', quarter)
    uop_data = await get_control_evidence(deal_id, 'FR-04', quarter)
    shariah_review = await get_control_evidence(deal_id, 'SG-02', quarter)

    # Use Claude to generate narrative
    report = await claude_api.generate_document(
        template="Investor_Report_Template.md",
        data={
            "quarter": quarter,
            "financial_highlights": financial_data.summary,
            "use_of_proceeds": uop_data.allocation_table,
            "shariah_compliance": shariah_review.status
        }
    )

    # Return draft for human approval
    return {"status": "draft", "document": report}
```

### 7. Verifiable Credential Minting (Throughout)

**AI Role**: Automatically mint VCs upon control completion (if enabled)

**Logic**:
- When user marks control as "Complete" → System mints VC
- VC schema defined per control (e.g., SSB Fatwa VC, Green Certification VC)
- Cryptographic signature using issuer's DID private key

**Example VC (SG-01 Fatwa)**:
```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "ShariahFatwaCredential"],
  "issuer": "did:web:zeroh.com:issuer-bank",
  "issuanceDate": "2025-11-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:web:zeroh.com:green-sukuk-2025",
    "fatwaNumber": "2024-IF-127",
    "productType": "Ijarah Sukuk",
    "issuanceSize": "$100M",
    "shariahBoard": "External SSB (Dr. Ahmad, Dr. Fatimah, Dr. Yusuf)",
    "compliance": "Shariah-compliant per AAOIFI GS-1",
    "sustainabilityAlignment": "ICMA Green Bond Principles"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2025-11-01T00:00:00Z",
    "verificationMethod": "did:web:zeroh.com:issuer-bank#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3FXQsZkPe...signature..."
  }
}
```

**No AI needed for VC minting** - This is pure cryptography, but AI can help:
- Suggest which VCs to share with which stakeholders (selective disclosure)
- Explain VC content in plain language for investors

---

## Implementation Patterns

### Database Schema (Control Execution State)

**Key Tables**:

```sql
-- Deal Profile (stores Phase 1 configuration)
CREATE TABLE deal_profile (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    product_structure JSONB,  -- Step 1 selections
    jurisdiction JSONB,       -- Step 2 selections
    transaction_scale JSONB,  -- Step 3 selections
    accounting JSONB,         -- Step 4 selections
    sustainability JSONB,     -- Step 5 selections (nullable)
    governance JSONB,         -- Step 6 selections
    created_at TIMESTAMPTZ,
    created_by UUID
);

-- Control Activation (stores Phase 2 mapping)
CREATE TABLE control_activation (
    id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deal_profile(id),
    control_id VARCHAR(10),  -- e.g., 'SG-01'
    activated BOOLEAN,
    activation_reason TEXT,
    standard_reference TEXT,
    lifecycle_phases TEXT[],  -- e.g., ['A', 'C'] if control runs in Pre-Issuance and Post-Issuance
    created_at TIMESTAMPTZ
);

-- Control Run (stores Phase 3 execution state)
CREATE TABLE control_run (
    id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deal_profile(id),
    control_id VARCHAR(10),
    lifecycle_phase CHAR(1),  -- 'A', 'B', 'C', or 'D'
    run_number INT,           -- For recurring controls (e.g., SG-02 run #12 = Dec 2026)
    status VARCHAR(20),       -- 'pending', 'in_progress', 'completed', 'failed'
    assigned_to UUID,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    sla_deadline TIMESTAMPTZ,
    evidence_ids UUID[],      -- References to evidence table
    vc_id UUID,               -- References to verifiable_credential table (if minted)
    metadata JSONB            -- AI agent notes, drift alerts, etc.
);

-- Evidence (stores control execution artifacts)
CREATE TABLE evidence (
    id UUID PRIMARY KEY,
    control_run_id UUID REFERENCES control_run(id),
    file_name VARCHAR(255),
    file_hash VARCHAR(64),    -- SHA-256 hash for tamper detection
    file_url TEXT,            -- S3 URL or IPFS CID
    uploaded_by UUID,
    uploaded_at TIMESTAMPTZ,
    ai_generated BOOLEAN,     -- TRUE if AI drafted this evidence
    human_approved BOOLEAN,   -- TRUE if human reviewed and approved
    metadata JSONB
);

-- Verifiable Credential (stores minted VCs)
CREATE TABLE verifiable_credential (
    id UUID PRIMARY KEY,
    control_run_id UUID REFERENCES control_run(id),
    vc_type VARCHAR(100),     -- e.g., 'ShariahFatwaCredential'
    vc_json JSONB,            -- Full VC JSON
    issuer_did TEXT,
    subject_did TEXT,
    issued_at TIMESTAMPTZ,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ
);
```

### API Endpoints (Backend)

**Phase 1: Configuration**
```
POST /api/deals/configure
Body: { productStructure, jurisdiction, transactionScale, accounting, sustainability, governance }
Response: { dealId, configurationSummary }
```

**Phase 2: Control Activation**
```
GET /api/deals/{dealId}/control-activation
Response: { activatedControls: [ { controlId, activated, reason, standardReference } ] }

POST /api/deals/{dealId}/confirm-activation
Body: { confirmed: true }
Response: { status: 'controls_activated', nextPhase: 'execution' }
```

**Phase 3: Execution**
```
GET /api/deals/{dealId}/workflow/phase/{phase}
Response: { phase, controls: [ { controlId, status, assignedTo, slaDeadline, evidence } ] }

POST /api/deals/{dealId}/controls/{controlId}/start
Body: { runNumber, assignedTo }
Response: { controlRunId, status: 'in_progress' }

POST /api/deals/{dealId}/controls/{controlId}/upload-evidence
Body: { controlRunId, file (multipart), aiGenerated, metadata }
Response: { evidenceId, fileHash, fileUrl }

POST /api/deals/{dealId}/controls/{controlId}/complete
Body: { controlRunId, evidenceIds }
Response: { status: 'completed', vcId (if VC minted) }
```

**AI Agent Endpoints**
```
POST /api/ai/evidence-collection/start
Body: { controlRunId, controlId, dealConfig }
Response: { agentRunId, status: 'collecting' }

GET /api/ai/evidence-collection/{agentRunId}/status
Response: { status: 'completed', draftEvidence: { fileUrl, summary, flagsForHuman } }
```

### Frontend State Management (Zustand)

```typescript
interface WorkflowStore {
  // Phase 1 state
  dealConfig: DealConfiguration | null
  setDealConfig: (config: DealConfiguration) => void

  // Phase 2 state
  activatedControls: ActivatedControl[]
  setActivatedControls: (controls: ActivatedControl[]) => void

  // Phase 3 state
  currentPhase: 'A' | 'B' | 'C' | 'D'
  controlRuns: ControlRun[]
  updateControlRun: (runId: string, updates: Partial<ControlRun>) => void

  // Evidence state
  evidenceByControlRun: Record<string, Evidence[]>
  uploadEvidence: (controlRunId: string, file: File, metadata: any) => Promise<void>

  // AI agent state
  agentRuns: Record<string, AIAgentRun>
  startEvidenceCollection: (controlRunId: string) => Promise<void>
}
```

---

## Design Rationale

### Why 6 Steps (Not 4)?

**Current Workflow**: 4 steps (Shariah, Jurisdiction, Accounting, Impact)

**Gaps**:
- No capture of **transaction scale** (affects audit requirements)
- No capture of **stakeholder/governance setup** (SLAs, risk appetite)
- Sustainability is optional but lumped with impact metrics

**New Workflow**: 6 steps explicitly capture all control activation drivers

**Benefit**: Every control activation can be traced to a specific configuration input → transparency and education.

---

### Why Lifecycle Phases (Not Buckets) for Execution?

**Problem**: Buckets are governance domains (Shariah, Regulatory, Risk, Financial, Audit), not chronological workflows.

**User Reality**: Users execute tasks chronologically:
1. First, design the structure and get approvals (Pre-Issuance)
2. Then, close the transaction (Issuance)
3. Then, monitor ongoing (Post-Issuance)
4. Finally, audit annually (Audit)

**Solution**: Organize execution by **4 Lifecycle Phases**, but **monitor by 5 Buckets** on the dashboard.

**Analogy**: Phases = "How you work", Buckets = "How you report"

---

### Why Show Activation Reasons?

**Transparency**: Users trust the system when they understand WHY controls apply.

**Education**: Junior compliance staff learn standards organically:
- "RM-02 activated because Ijarah has RoR risk (IFSB-1 §4.4)" → User learns what RoR risk is and why it matters

**Flexibility**: Users can adjust configuration if they disagree:
- "Wait, we don't have DCR risk because we have a strong profit-smoothing reserve. Can we adjust the risk appetite to reflect this?"

---

### Why Verifiable Credentials?

**Problem**: Traditional compliance = "Trust us, we're compliant" (opaque)

**Solution**: VCs = Cryptographic proof of compliance (transparent, verifiable, selective)

**Benefits**:
1. **Investor Confidence**: Investors independently verify claims without requesting full audit trail
2. **Regulatory Efficiency**: Regulators receive machine-readable compliance proofs, reducing manual review
3. **Selective Disclosure**: Share exactly what each stakeholder needs (investors see fatwa, regulators see full audit, public sees summary)
4. **Tamper-Proof**: Cryptographic signatures ensure VCs can't be forged or altered

**Alignment with Trends**: W3C VC standard, DID adoption by governments (EU Digital Identity, Canada, Singapore), Islamic finance's need for trust/transparency

---

### Why AI Agents (Not Full Automation)?

**Philosophy**: "AI suggests, human approves"

**Rationale**:
- **High-Stakes Domain**: Islamic finance compliance errors have real consequences (regulatory penalties, reputational damage, investor loss)
- **Judgment Required**: Many controls require professional judgment (e.g., "Is this contract Shariah-compliant?")
- **Accountability**: Humans must remain accountable for compliance decisions

**AI Role**: Reduce toil (data gathering, drafting, flagging), not replace expertise

**Example**:
- ❌ Bad: AI auto-approves Shariah compliance without SSB review
- ✅ Good: AI drafts Shariah review checklist, SSB reviews and approves

---

## Conclusion

This design specification defines a **GRC-aligned, education-first workflow** for Islamic finance compliance:

1. **Configuration-Driven**: 6-step wizard captures deal profile → system determines applicable controls
2. **Transparent Activation**: Users see WHY controls apply (standards alignment, activation logic)
3. **Lifecycle-Based Execution**: 4 phases guide users chronologically (Pre-Issuance → Issuance → Post-Issuance → Audit)
4. **Bucket-Based Monitoring**: Dashboard shows compliance across 5 GRC domains
5. **AI-Assisted, Human-Approved**: AI agents draft evidence, humans review and finalize
6. **Verifiable Proofs**: VCs provide cryptographic proof of compliance for stakeholders

**Next Steps**:
1. Review and approve this specification
2. Implement Phase 1 (Configuration Wizard) in frontend
3. Build control activation rules engine
4. Migrate current 4-step workflow to 6-step model
5. Add lifecycle phase organization to dashboard
6. Integrate AI evidence collection agents
7. Add VC minting capability

**Foundation**: This design is 100% aligned with [ZEROH_SOURCE_OF_TRUTH.md](./ZEROH_SOURCE_OF_TRUTH.md) - every control, standard, and bucket maps directly to the source of truth.

---

**Document Version:** 1.0
**Last Updated:** November 7, 2025
**Author:** ZeroH Design Team (with Claude Code)
**Status:** ✅ Ready for Implementation
