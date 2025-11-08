# Visual Mockups - New Workflow Design
## GRC-Aligned Configuration & Execution Interface

**Version:** 1.0
**Date:** November 7, 2025
**Status:** Design Mockups (Ready for Implementation)

---

## Overview

This document contains visual descriptions of all key screens in the new workflow design:
1. **6-Step Configuration Wizard** - Deal profile setup
2. **Control Activation Summary** - Transparency screen showing which controls apply and why
3. **New Dashboard** - Buckets (monitoring) + Lifecycle Phases (execution)

---

## 1. Configuration Wizard - Visual Flow

### Step 1: Product Structure Selection

```
┌────────────────────────────────────────────────────────────────┐
│  Configure Deal Profile                                        │
│  Step 1 of 6: Product Structure                                │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 17%                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Select Product Structure                              │
│  Choose the Islamic finance structure for this deal            │
│                                                                 │
│  Product Category:                                             │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │ 📜 Sukuk             │  │ 🏦 Islamic Banking   │          │
│  │ Asset-Backed         │  │ Shariah-compliant    │          │
│  │ Securities           │  │ banking solutions    │          │
│  │                  [✓] │  │                      │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │ 📊 Islamic Funds     │  │ 💼 Equity Investment │          │
│  │ Shariah-compliant    │  │ Shariah-compliant    │          │
│  │ investment funds     │  │ equity & VC          │          │
│  │                      │  │                      │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                                 │
│  ─────────────────────────────────────────────────────────    │
│  Sukuk Structure:                                              │
│                                                                 │
│  ◉ Ijarah (Leasing)                                           │
│    Asset-based lease structure                                │
│                                                                 │
│  ○ Murabaha (Cost-plus)                                       │
│    Asset purchase and resale                                  │
│                                                                 │
│  ○ Musharakah (Partnership)                                   │
│    Profit/loss sharing partnership                            │
│                                                                 │
│  ○ Mudarabah (Trust financing)                                │
│    Entrepreneur-investor partnership                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────    │
│  🎯 Controls Activated by This Selection:                     │
│  ✓ SG-01: SSB Mandate & Fatwa Issuance (all products)        │
│  ✓ SG-02: Shariah Review (ongoing conformity)                │
│  ✓ RM-01: SNC Risk Identification (all products)              │
│  ✓ RM-02: Rate-of-Return Risk (Ijarah has RoR volatility)    │
│                                                                 │
│  [← Previous]              ✓ Step completed      [Next Step →]│
└────────────────────────────────────────────────────────────────┘
```

### Step 2: Regulatory Jurisdiction

```
┌────────────────────────────────────────────────────────────────┐
│  Configure Deal Profile                                        │
│  Step 2 of 6: Regulatory Jurisdiction                          │
│  ████████████████░░░░░░░░░░░░░░░░░░░ 33%                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 2: Regulatory Jurisdiction                               │
│  Select the primary jurisdiction(s)                            │
│                                                                 │
│  Primary Jurisdiction:                                         │
│                                                                 │
│  ◉ Malaysia                                                    │
│    🇲🇾 BNM oversight, Shariah Advisory Council                │
│                                                                 │
│  ○ UAE (DIFC/ADGM)                                            │
│    🇦🇪 DFSA/FSRA regulations                                   │
│                                                                 │
│  ○ Saudi Arabia                                               │
│    🇸🇦 CMA regulations, SAMA oversight                         │
│                                                                 │
│  ○ United Kingdom                                             │
│    🇬🇧 FCA oversight, UK Shariah Board                         │
│                                                                 │
│  ○ Luxembourg                                                 │
│    🇱🇺 CSSF oversight for Islamic funds                        │
│                                                                 │
│  ☑ Cross-Border (Multiple jurisdictions)                      │
│                                                                 │
│  Additional Jurisdictions: [+ Add Luxembourg]                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────    │
│  🎯 Controls Activated:                                        │
│  ✓ RL-01: Licensing & Registration (Malaysia BNM licensing)   │
│  ✓ RL-02: Local Shariah Board (BNM SAC endorsement required)  │
│  ✓ RL-04: AML/CTF Compliance (FATF global requirement)        │
│  ✓ FR-03: Taxation (Malaysia + Luxembourg tax reporting)      │
│                                                                 │
│  [← Previous]              ✓ Step completed      [Next Step →]│
└────────────────────────────────────────────────────────────────┘
```

### Step 3: Transaction Scale & Visibility

```
┌────────────────────────────────────────────────────────────────┐
│  Configure Deal Profile                                        │
│  Step 3 of 6: Transaction Scale & Visibility                   │
│  ████████████████████████░░░░░░░░░░ 50%                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 3: Transaction Scale & Visibility                        │
│  Determine size, investor type, and public visibility          │
│                                                                 │
│  Transaction Size:                                             │
│  ○ < $10M (Small-scale)                                       │
│  ○ $10M - $50M (Medium-scale)                                 │
│  ◉ $50M - $500M (Large-scale)                                 │
│  ○ > $500M (Mega-scale)                                       │
│                                                                 │
│  Exact Amount: [$ 100,000,000] USD                            │
│                                                                 │
│  Offering Type:                                                │
│  ○ Private Placement (Institutional investors only)            │
│  ◉ Public Offering (Retail investors)                         │
│  ○ Hybrid (Both institutional and retail)                      │
│                                                                 │
│  Listing:                                                      │
│  ☑ Listed on Exchange                                         │
│  Exchange: [Bursa Malaysia ▼]                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────    │
│  🎯 Controls Activated:                                        │
│  ✓ AA-02: External Shariah Audit (size >$50M requires         │
│     independent audit per IFSB-10 §4.2)                       │
│  ✓ RL-03: Public Offering Compliance (prospectus required)    │
│  ✓ AA-03: Periodic Assurance Reports (listed = semi-annual    │
│     assurance per exchange rules)                             │
│  ✓ FR-06: Investor Reporting (quarterly updates to investors) │
│                                                                 │
│  [← Previous]              ✓ Step completed      [Next Step →]│
└────────────────────────────────────────────────────────────────┘
```

### Step 4: Accounting & Reporting Framework

```
┌────────────────────────────────────────────────────────────────┐
│  Configure Deal Profile                                        │
│  Step 4 of 6: Accounting & Reporting                           │
│  ████████████████████████████████░░ 67%                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 4: Accounting & Reporting Framework                      │
│  Select accounting standard and reporting requirements         │
│                                                                 │
│  Primary Accounting Standard:                                  │
│                                                                 │
│  ◉ AAOIFI (Accounting and Auditing Organization for           │
│    Islamic Financial Institutions)                            │
│    → FAS 1-34, GS-1/2/3, Shariah-centric reporting           │
│                                                                 │
│  ○ IFRS (International Financial Reporting Standards          │
│    with Islamic finance adaptations)                          │
│    → IFRS 9, substance-over-form approach                     │
│                                                                 │
│  ○ Dual Reporting (AAOIFI + IFRS)                            │
│    → Two parallel reporting streams                           │
│                                                                 │
│  Reporting Frequency:                                          │
│  ○ Annual    ○ Semi-Annual    ◉ Quarterly    ○ Monthly        │
│                                                                 │
│  Financial Year End:                                           │
│  [December 31 ▼] (Gregorian)                                  │
│  [Dhul Hijjah ▼] (Hijri - optional for AAOIFI)               │
│                                                                 │
│  ─────────────────────────────────────────────────────────    │
│  🎯 Controls Activated:                                        │
│  ✓ FR-01: AAOIFI Reporting (FAS-compliant statements)         │
│  ✓ FR-02: Regulatory Reporting (quarterly to BNM)             │
│  ✓ AA-05: Shariah Audit (AAOIFI requires Shariah audit per    │
│     GS-3 §5)                                                  │
│                                                                 │
│  [← Previous]              ✓ Step completed      [Next Step →]│
└────────────────────────────────────────────────────────────────┘
```

### Step 5: Sustainability & Impact (Optional)

```
┌────────────────────────────────────────────────────────────────┐
│  Configure Deal Profile                                        │
│  Step 5 of 6: Sustainability & Impact                          │
│  ████████████████████████████████████████░░ 83%               │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 5: Sustainability & Impact (Optional)                    │
│  Define sustainability goals and impact frameworks             │
│                                                                 │
│  Does this transaction have sustainability goals?              │
│                                                                 │
│  ○ No sustainability component (skip to Step 6)               │
│  ◉ Yes - Green/Sustainable Sukuk                              │
│  ○ Yes - Social Impact Sukuk                                  │
│  ○ Yes - Sustainability-Linked (KPI-based)                    │
│                                                                 │
│  Framework Alignment:                                          │
│  ☑ ICMA Green Bond Principles (GBP)                           │
│  ☐ ICMA Social Bond Principles (SBP)                          │
│  ☐ ICMA Sustainability-Linked Bond Principles (SLBP)          │
│  ☑ BNM Value-Based Intermediation Assessment (VBIAF)          │
│  ☑ UN Sustainable Development Goals (SDGs)                    │
│                                                                 │
│  Impact Categories (select all that apply):                    │
│  ☑ Climate & Environment (SDG 13, 14, 15)                     │
│  ☐ Social Welfare (SDG 1, 2, 3, 8)                            │
│  ☐ Economic Inclusion (SDG 8, 9, 10)                          │
│  ☐ Governance & Ethics (SDG 16, 17)                           │
│                                                                 │
│  Eligible Green Projects:                                      │
│  • Renewable Energy (Solar Farm - Kedah, 30 MW)               │
│  • Renewable Energy (Wind Farm - Terengganu, 20 MW)           │
│  [+ Add Project]                                               │
│                                                                 │
│  ─────────────────────────────────────────────────────────    │
│  🎯 Controls Activated:                                        │
│  ✓ FR-04: Use of Proceeds Tracking (quarterly allocation      │
│     reporting to eligible green projects per ICMA GBP)        │
│  ✓ AA-04: External Assurance (Second Party Opinion from       │
│     accredited provider per ICMA GBP §4)                      │
│  ✓ SG-04: Shariah Risk Management (Maqasid alignment check    │
│     for sustainability goals)                                 │
│                                                                 │
│  [← Previous]              ✓ Step completed      [Next Step →]│
└────────────────────────────────────────────────────────────────┘
```

### Step 6: Stakeholder & Governance Setup

```
┌────────────────────────────────────────────────────────────────┐
│  Configure Deal Profile                                        │
│  Step 6 of 6: Stakeholder & Governance                         │
│  ████████████████████████████████████████████████ 100%        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 6: Stakeholder & Governance Setup                        │
│  Define roles, SLAs, risk appetite, and disclosure policies    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Shariah Supervisory Board (SSB)                        │   │
│  │ ◉ Internal SSB    ○ External Scholars                  │   │
│  │                                                        │   │
│  │ Scholars:                                              │   │
│  │ • Dr. Ahmad bin Abdullah (Chairman)                    │   │
│  │ • Dr. Fatimah binti Yusuf                              │   │
│  │ • Dr. Yusuf al-Qaradawi                                │   │
│  │ [+ Add Scholar]                                        │   │
│  │                                                        │   │
│  │ Fatwa SLA: ◉ 30 days  ○ 14 days  ○ Custom [__] days   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Compliance Function                                     │   │
│  │ Owner: [Siti Noor (Shariah Compliance Officer) ▼]      │   │
│  │ Shariah Review SLA: ○ Weekly  ◉ Monthly                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Risk Management                                         │   │
│  │ Owner: [Ahmad Rashid (CRO) ▼]                          │   │
│  │ Risk Appetite: ○ Conservative  ◉ Moderate  ○ Aggressive│   │
│  │                                                        │   │
│  │ Risk Thresholds (Moderate Profile):                    │   │
│  │ • Max Debt-to-Equity: 60%                              │   │
│  │ • Min Profit Smoothing Reserve: 50 bps                 │   │
│  │ • SNC Event Tolerance: 0 (zero tolerance)              │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Disclosure & Selective Sharing                          │   │
│  │ ☑ Enable Verifiable Credentials for proofs             │   │
│  │                                                        │   │
│  │ Investors see:                                         │   │
│  │ ◉ Compliance status only (green/yellow/red badges)     │   │
│  │ ○ Full audit trail (complete evidence access)          │   │
│  │ ○ Custom per investor type (institutional vs retail)   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [← Previous]              ✓ Step completed  [Review & Proceed]│
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Control Activation Summary Screen

After completing all 6 steps, users see a comprehensive summary showing which controls activated and why:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Control Activation Summary                                             │
│  Based on your configuration, 22 of 26 controls will be executed       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Your Configuration:                                                    │
│  • Product: Sukuk → Ijarah                                             │
│  • Jurisdiction: Malaysia (+ Luxembourg cross-border)                   │
│  • Size: $100M, Public Offering, Listed (Bursa Malaysia)               │
│  • Accounting: AAOIFI, Quarterly reporting                             │
│  • Sustainability: Green Sukuk (ICMA GBP, BNM VBIAF)                   │
│  • Governance: External SSB, Moderate risk appetite, VCs enabled        │
│                                                                         │
│  [View Detailed Mapping]  [Adjust Configuration]  [Proceed to Execution]│
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  🕌 BUCKET 1: SHARIAH GOVERNANCE & COMPLIANCE (5/5 activated)          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✓ SG-01: SSB Mandate & Fatwa Issuance                                │
│    Why: All Islamic finance products require SSB fatwa                 │
│    Standard: AAOIFI GS-1; IFSB-10 §4.1                                │
│    Lifecycle Phases: Pre-Issuance (one-time)                           │
│                                                                         │
│  ✓ SG-02: Shariah Review (Compliance Function)                        │
│    Why: Ongoing Shariah conformity monitoring required                 │
│    Standard: AAOIFI GS-2; BNM SG Policy §7                            │
│    Lifecycle Phases: Pre-Issuance, Issuance, Post-Issuance (monthly)   │
│                                                                         │
│  ✓ SG-03: Shariah Risk Management                                     │
│    Why: Malaysia (BNM) requires SNC risk management framework          │
│    Standard: BNM Shariah Governance §5; IFSB-1 §7.2                   │
│    Lifecycle Phases: Pre-Issuance (one-time)                           │
│                                                                         │
│  ✓ SG-04: Shariah Audit (Internal/Independent)                        │
│    Why: Periodic Shariah audit required per AAOIFI GS-3               │
│    Standard: AAOIFI GS-3                                               │
│    Lifecycle Phases: Audit & Assurance (annual)                        │
│                                                                         │
│  ✓ SG-05: SNC Event Handling & Purification                           │
│    Why: Must log and purify any non-compliant income if event occurs   │
│    Standard: IFSB-1 §7.2; AAOIFI GS-1 §3                              │
│    Lifecycle Phases: Post-Issuance (event-driven)                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚖️ BUCKET 2: REGULATORY & LEGAL COMPLIANCE (4/5 activated)            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✓ RL-01: Licensing & Registration                                    │
│    Why: Malaysia jurisdiction requires BNM licensing                   │
│    Standard: BNM FSA 2013                                              │
│    Lifecycle Phases: Pre-Issuance (one-time)                           │
│                                                                         │
│  ✓ RL-02: Local Shariah Board Requirements                            │
│    Why: BNM requires SAC (Shariah Advisory Council) endorsement        │
│    Standard: BNM Shariah Governance Policy 2019 §3                     │
│    Lifecycle Phases: Pre-Issuance (one-time)                           │
│                                                                         │
│  ✓ RL-03: Public Offering Compliance                                  │
│    Why: Public offering requires prospectus/offering circular          │
│    Standard: BNM SC Guidelines; MAS Notice                             │
│    Lifecycle Phases: Issuance (one-time)                               │
│                                                                         │
│  ✓ RL-04: AML/CTF Compliance (FATF)                                   │
│    Why: FATF 40 Recommendations apply to all Islamic finance           │
│    Standard: FATF R.10, R.11 (CDD for Islamic finance)                │
│    Lifecycle Phases: Issuance, Post-Issuance (ongoing CDD)             │
│                                                                         │
│  ✗ RL-05: Ongoing Disclosure & Material Events                        │
│    Why: Not activated - Already covered by exchange listing rules      │
│         (AA-03 handles periodic assurance for listed securities)       │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  📊 BUCKET 3: RISK MANAGEMENT (4/5 activated)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✓ RM-01: Shariah Non-Compliance (SNC) Risk Identification            │
│    Why: All Islamic finance products have SNC risk                     │
│    Standard: IFSB-1 §7.2; BNM ICAAP                                   │
│    Lifecycle Phases: Pre-Issuance (one-time)                           │
│                                                                         │
│  ✓ RM-02: Rate-of-Return (RoR) Risk                                   │
│    Why: Ijarah Sukuk has asset-based return volatility                 │
│    Standard: IFSB-1 §4.4; IFSB-10 §7.1                                │
│    Lifecycle Phases: Pre-Issuance, Post-Issuance (quarterly)           │
│                                                                         │
│  ✓ RM-03: Credit/Counterparty Risk                                    │
│    Why: Ijarah involves counterparty payment obligations               │
│    Standard: IFSB-1 §4.5; Basel III (IFSB adaptation)                 │
│    Lifecycle Phases: Pre-Issuance, Post-Issuance (quarterly)           │
│                                                                         │
│  ✗ RM-04: Equity Investment Risk                                      │
│    Why: Not activated - Ijarah is not equity-based (Musharakah/        │
│         Mudarabah would activate this)                                 │
│                                                                         │
│  ✓ RM-05: Stress Testing & Scenario Analysis                          │
│    Why: Transaction size >$50M (current: $100M) requires stress testing│
│    Standard: IFSB-1 §6.3; BNM Stress Testing Guidelines               │
│    Lifecycle Phases: Issuance, Post-Issuance (annual)                  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  📈 BUCKET 4: FINANCIAL & PRODUCT REPORTING (5/6 activated)            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✓ FR-01: AAOIFI/IFRS-Compliant Reporting                             │
│    Why: AAOIFI framework requires FAS-compliant financial reporting    │
│    Standard: AAOIFI FAS 1-34; IFSB-1 §9                               │
│    Lifecycle Phases: Issuance, Post-Issuance (quarterly), Audit        │
│                                                                         │
│  ✓ FR-02: Regulatory Reporting                                        │
│    Why: Malaysia requires quarterly regulatory reporting to BNM        │
│    Standard: BNM RR Series                                             │
│    Lifecycle Phases: Post-Issuance (quarterly)                         │
│                                                                         │
│  ✓ FR-03: Taxation Compliance                                         │
│    Why: Malaysia + Luxembourg tax compliance required                  │
│    Standard: Malaysia ITA 1967; Luxembourg tax laws                    │
│    Lifecycle Phases: Issuance (initial), Post-Issuance (annual)        │
│                                                                         │
│  ✓ FR-04: Use of Proceeds Tracking                                    │
│    Why: Green Sukuk requires eligible project tracking                 │
│    Standard: ICMA GBP; AAOIFI GS-47 (Sustainable Sukuk)               │
│    Lifecycle Phases: Pre-Issuance (framework), Post-Issuance (tracking)│
│                                                                         │
│  ✗ FR-05: KPI Monitoring (Sustainability-Linked)                      │
│    Why: Not activated - Green Sukuk (not Sustainability-Linked)        │
│         Sustainability-Linked would use KPIs instead of UoP            │
│                                                                         │
│  ✓ FR-06: Investor Reporting                                          │
│    Why: Public offering requires quarterly investor updates            │
│    Standard: ICMA transparency recommendations                         │
│    Lifecycle Phases: Issuance (initial), Post-Issuance (quarterly)     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  🔍 BUCKET 5: AUDIT & ASSURANCE (4/5 activated)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✓ AA-01: Internal Shariah Audit                                      │
│    Why: Internal Shariah audit required for all products (baseline)    │
│    Standard: AAOIFI GS-3; IFSB-10 §4.2                                │
│    Lifecycle Phases: Audit & Assurance (annual)                        │
│                                                                         │
│  ✓ AA-02: External Shariah Audit                                      │
│    Why: Transaction size >$50M (current: $100M) requires independent   │
│         external Shariah audit                                         │
│    Standard: IFSB-10 §4.2; BNM audit guidelines                        │
│    Lifecycle Phases: Audit & Assurance (annual)                        │
│                                                                         │
│  ✓ AA-03: Periodic Assurance Reports                                  │
│    Why: Listed on Bursa Malaysia - exchange requires semi-annual       │
│         assurance reports                                              │
│    Standard: Bursa Malaysia Listing Rules                              │
│    Lifecycle Phases: Post-Issuance (semi-annual)                       │
│                                                                         │
│  ✓ AA-04: External Assurance (Impact/ESG)                             │
│    Why: Green Sukuk requires Second Party Opinion (SPO) for            │
│         sustainability claims                                          │
│    Standard: ICMA GBP §4 (External Review)                             │
│    Lifecycle Phases: Issuance (SPO), Post-Issuance (annual verification)│
│                                                                         │
│  ✓ AA-05: Shariah Audit (AAOIFI-specific)                             │
│    Why: AAOIFI framework requires Shariah audit per GS-3 §5            │
│    Standard: AAOIFI GS-3 §5                                            │
│    Lifecycle Phases: Audit & Assurance (annual)                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

[View Detailed Mapping] [Adjust Configuration] [Proceed to Execution →]
```

---

## 3. New Dashboard Design

The new dashboard shows both **Buckets** (for compliance monitoring) and **Lifecycle Phases** (for execution tracking).

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ZeroH - AI-Native GRC Dashboard                                       │
│  Green Ijarah Sukuk ($100M) - Malaysia/Luxembourg                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ╔═══════════════════════════════════════════════════════════════════╗ │
│  ║ 🤖 AI INSIGHTS                                                    ║ │
│  ╠═══════════════════════════════════════════════════════════════════╣ │
│  ║ Good morning! You're in Phase A: Pre-Issuance (8 controls).      ║ │
│  ║                                                                   ║ │
│  ║ ✓ 3 controls completed (SG-01, SG-02, SG-03)                     ║ │
│  ║ 🔄 1 control in progress (RM-02: RoR Risk - due Nov 12)          ║ │
│  ║ ⏳ 4 controls pending (RM-03, RM-05, RL-01, RL-02)               ║ │
│  ║                                                                   ║ │
│  ║ ⚠️ Priority Alert: RL-01 (BNM Licensing) has 60-day lead time.   ║ │
│  ║    Recommend starting immediately to meet Phase B timeline.       ║ │
│  ║                                                                   ║ │
│  ║ [View AI Recommendations] [Fix Priority Issues]                  ║ │
│  ╚═══════════════════════════════════════════════════════════════════╝ │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  COMPLIANCE OVERVIEW - By Bucket (Monitoring View)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐                    │
│  │ 🕌 Shariah           │ │ ⚖️ Regulatory         │                    │
│  │ Compliance           │ │ & Legal              │                    │
│  │ ──────────────────── │ │ ──────────────────── │                    │
│  │ Overall: 60%         │ │ Overall: 25%         │                    │
│  │ ████████████░░░░░░░░ │ │ █████░░░░░░░░░░░░░░░ │                    │
│  │                      │ │                      │                    │
│  │ 5 controls active    │ │ 4 controls active    │                    │
│  │ 3/5 completed        │ │ 1/4 completed        │                    │
│  │ 0 needs attention    │ │ 1 needs attention    │                    │
│  │                      │ │                      │                    │
│  │ Status: ✅ On Track  │ │ Status: ⚠️ Attention │                    │
│  └──────────────────────┘ └──────────────────────┘                    │
│                                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐                    │
│  │ 📊 Risk Management   │ │ 📈 Financial         │                    │
│  │                      │ │ Reporting            │                    │
│  │ ──────────────────── │ │ ──────────────────── │                    │
│  │ Overall: 50%         │ │ Overall: 20%         │                    │
│  │ ██████████░░░░░░░░░░ │ │ ████░░░░░░░░░░░░░░░░ │                    │
│  │                      │ │                      │                    │
│  │ 4 controls active    │ │ 5 controls active    │                    │
│  │ 2/4 completed        │ │ 1/5 completed        │                    │
│  │ 1 in progress        │ │ 0 needs attention    │                    │
│  │                      │ │                      │                    │
│  │ Status: 🔄 Working   │ │ Status: ⏳ Pending   │                    │
│  └──────────────────────┘ └──────────────────────┘                    │
│                                                                         │
│  ┌──────────────────────────────────────────────────┐                 │
│  │ 🔍 Audit & Assurance                             │                 │
│  │ ──────────────────────────────────────────────── │                 │
│  │ Overall: 0% (Phase D controls - not yet started) │                 │
│  │ ░░░░░░░░░░░░░░░░░░░░                             │                 │
│  │                                                  │                 │
│  │ 4 controls active (AA-01, AA-02, AA-04, AA-05)   │                 │
│  │ 0/4 completed - Annual controls, start in Phase D│                 │
│  │                                                  │                 │
│  │ Status: ⏸️ Not Started (Awaiting Phase D)        │                 │
│  └──────────────────────────────────────────────────┘                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  LIFECYCLE PHASES - Execution View                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ 🚀 Phase A: Pre-Issuance (CURRENT PHASE)                        │  │
│  │ Progress: 3/8 controls completed (38%)                          │  │
│  │ ██████████░░░░░░░░░░░░░░░░ 38%                                  │  │
│  │                                                                 │  │
│  │ ✓ SG-01: SSB Fatwa (Completed Nov 1)                           │  │
│  │ ✓ SG-02: Shariah Review (Completed Nov 5)                      │  │
│  │ ✓ SG-03: Shariah Risk Mgmt (Completed Nov 5)                   │  │
│  │ 🔄 RM-02: RoR Risk (In Progress - due Nov 12)                   │  │
│  │ ⏳ RM-03: Credit Risk (Pending - starts Nov 13)                 │  │
│  │ ⏳ RM-05: Stress Testing (Pending)                              │  │
│  │ ⏳ RL-01: BNM Licensing (⚠️ Priority - 60 day lead time)         │  │
│  │ ⏳ RL-02: SAC Endorsement (Pending)                             │  │
│  │                                                                 │  │
│  │ Timeline: 60-90 days | Target Completion: Jan 15, 2026          │  │
│  │ [View Full Phase A Details]                                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ 📋 Phase B: Issuance/Execution (LOCKED - Complete Phase A first)│  │
│  │ 6 controls will activate upon Phase A completion               │  │
│  │ Estimated Start: Jan 16, 2026                                   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ 🔁 Phase C: Post-Issuance (Recurring - starts after closing)    │  │
│  │ 5 recurring controls (monthly/quarterly)                        │  │
│  │ Duration: 5 years (until Sukuk maturity)                        │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Phase D: Audit & Assurance (Annual)                          │  │
│  │ 4 controls (AA-01, AA-02, AA-04, AA-05)                         │  │
│  │ First audit cycle: Dec 2026 (FY 2025 audit)                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

[View Component Details] [View All Controls] [Export Compliance Report]
```

### Dashboard Features:

1. **AI Insights Panel** - Real-time alerts and recommendations
2. **Bucket View** - Compliance status across 5 GRC domains (monitoring)
3. **Phase View** - Chronological execution progress (workflow)
4. **Dual Organization** - Users see both perspectives simultaneously
5. **Priority Alerts** - AI flags critical path items (RL-01 60-day lead time)

---

## Implementation Status

### ✅ Complete:
1. **Control Library** - 26 controls with full metadata (`src/lib/control-engine/control-library.ts`)
2. **Activation Rules Engine** - Configuration → control mapping logic (`src/lib/control-engine/activation-rules.ts`)
3. **Configuration Wizard** - Main wizard component (`src/components/workflow-v2/ConfigurationWizard.tsx`)
4. **Step 1 Component** - Product Structure with visual mockup (`src/components/workflow-v2/steps/ProductStructureStep.tsx`)

### 🚧 To Complete:
1. **Steps 2-6 Components** - Visual implementations for remaining wizard steps
2. **Activation Summary Component** - Full activation summary screen with bucket breakdown
3. **New Dashboard Component** - Dual bucket/phase dashboard implementation

### 📦 Ready for Swap:
All files are in `src/components/workflow-v2/` and `src/lib/control-engine/` directories - completely separate from current workflow. When ready to swap:
1. Update `/` route to use `ConfigurationWizard` instead of current workflow
2. Update `/dashboard` or `/ai-native` to use new dashboard design
3. Keep old workflow in `src/components/workflow/` as backup

---

**Next Steps:**
1. Review visual mockups for alignment with requirements
2. Complete remaining step components (2-6)
3. Implement activation summary screen
4. Implement new dashboard design
5. Test configuration → activation → execution flow
6. Deploy to staging for user testing

**Status:** ✅ Design Complete | 🚧 Implementation 30% | ⏳ Testing Pending
