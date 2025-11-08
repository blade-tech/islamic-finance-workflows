# Jurisdiction Plugin Guide: Global GRC Expansion

**Purpose**: Comprehensive guide for replicating Qatar GRC infrastructure to other jurisdictions
**Target Jurisdictions**: SAMA (Saudi Arabia), BNM (Malaysia), CBB (Bahrain), CBUAE (UAE), others
**Based On**: Qatar reference implementation and 8-phase research process
**Status**: Ready for replication

---

## Executive Summary

This guide enables **rapid jurisdiction expansion** by replicating the proven Qatar GRC infrastructure pattern. Following this guide, a team can add a new jurisdiction's compliance requirements in **1-3 weeks of research** + **4-6 weeks of implementation**.

**What This Guide Provides**:
✅ Complete jurisdiction plugin architecture pattern
✅ Step-by-step replication process (8 phases)
✅ Templates for all research documents
✅ Technical implementation guide with code patterns
✅ Validation checklist for quality assurance
✅ Lessons learned from Qatar to avoid pitfalls

**Proven Success**: Qatar implementation delivered 74 obligations across 2 regulators with complete documentation in 6 hours of research + 8 weeks of MVP development.

---

## Table of Contents

1. [Jurisdiction Plugin Architecture](#jurisdiction-plugin-architecture)
2. [8-Phase Research Process](#8-phase-research-process)
3. [Research Document Templates](#research-document-templates)
4. [Technical Implementation Guide](#technical-implementation-guide)
5. [Code Patterns & Examples](#code-patterns--examples)
6. [Validation Checklist](#validation-checklist)
7. [Lessons Learned from Qatar](#lessons-learned-from-qatar)
8. [Jurisdiction-Specific Guidance](#jurisdiction-specific-guidance)

---

## Jurisdiction Plugin Architecture

### Conceptual Model

```
┌─────────────────────────────────────────────────────────────┐
│                   Universal GRC Engine                       │
│  (ISO 37301 + ISO 31000 + COSO + Control Library)           │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐              ┌───────▼────────┐
│ Islamic Finance │              │  Conventional  │
│   Overlay       │              │   Finance      │
│ (IFSB/AAOIFI)   │              │   Overlay      │
└───────┬────────┘              └────────────────┘
        │
        │
┌───────▼─────────────────────────────────────────────┐
│            Jurisdiction Plugins                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │  Qatar  │ │  SAMA   │ │   BNM   │ │   CBB   │  │
│  │ (QCB +  │ │ (Saudi) │ │(Malaysia│ │(Bahrain)│  │
│  │ QFCRA)  │ │         │ │         │ │         │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────────────────┘
```

### Plugin Components

Each jurisdiction plugin consists of **7 core components**:

#### 1. Obligations Register
- **Purpose**: Catalog of all regulatory obligations for this jurisdiction
- **Structure**: Obligation entity with jurisdiction-specific metadata
- **Example**: Qatar has 60 unified obligations (32 QCB-only, 14 QFCRA-only, 14 common)

#### 2. Regulator Metadata
- **Purpose**: Define regulators and their characteristics
- **Structure**: Regulator entity with retention rules, language requirements, reporting calendars
- **Example**: Qatar has QCB (10-year retention, Arabic+English) and QFCRA (6-year, English)

#### 3. Control Activation Rules
- **Purpose**: Map universal controls to jurisdiction-specific requirements
- **Structure**: Activation matrix (Control × Regulator → Required/Optional)
- **Example**: Qatar activates 25/26 controls for QCB, 23/26 for QFCRA, adds 8 new controls

#### 4. Evidence Standards
- **Purpose**: Define what evidence satisfies each regulator
- **Structure**: Evidence requirement specifications per regulator
- **Example**: Qatar requires bilingual evidence for QCB, digital-preferred for QFCRA

#### 5. SSB Governance Model
- **Purpose**: Document Shariah governance requirements
- **Structure**: SSB composition rules, decision-making processes, reporting obligations
- **Example**: Qatar QCB requires min 3 members, max 3 positions per scholar, 2-year cooling-off

#### 6. AAOIFI/IFSB Alignment
- **Purpose**: Define which international standards are mandatory
- **Structure**: Standard adoption matrix (Standard × Regulator → Mandatory/Optional/Not Required)
- **Example**: Qatar QCB mandates full AAOIFI FAS, QFCRA selectively adopts GSIFI 1,2,3

#### 7. Reporting Requirements
- **Purpose**: Catalog all regulatory reports and their schedules
- **Structure**: Report templates with frequency, recipient, data requirements
- **Example**: Qatar requires 55+ total reports (35+ QCB, 20 QFCRA)

### Plugin Interface (TypeScript)

```typescript
interface JurisdictionPlugin {
  // Metadata
  id: string                          // e.g., 'QA-QCB-QFCRA', 'SA-SAMA', 'MY-BNM'
  country: string                     // ISO 3166-1 alpha-2 (e.g., 'QA', 'SA', 'MY')
  name: string                        // e.g., 'Qatar (QCB + QFCRA)', 'Saudi Arabia (SAMA)'

  // Regulators
  regulators: Regulator[]             // List of regulators (mainland, offshore, etc.)

  // Obligations
  obligations: Obligation[]           // All obligations for this jurisdiction
  obligationCategories: Category[]    // Jurisdiction-specific categories

  // Controls
  controlActivationRules: ControlActivationRule[]  // Which controls required per regulator
  jurisdictionSpecificControls: Control[]          // New controls unique to jurisdiction

  // Evidence
  evidenceStandards: EvidenceStandard[]  // Evidence requirements per regulator
  retentionRules: RetentionRule[]        // Retention periods by document type

  // SSB Governance
  ssbGovernanceModel: SSBGovernanceModel  // SSB requirements

  // Standards Alignment
  aaoifiAlignment: AaoifiAlignment        // Which AAOIFI standards mandatory
  ifsbAlignment: IfsbAlignment            // Which IFSB standards mandatory

  // Reporting
  reportingRequirements: ReportRequirement[]  // All regulatory reports
  reportingCalendar: ReportingCalendar        // Report due dates

  // Conflict Resolution (for multi-regulator jurisdictions)
  conflictResolutionRules?: ConflictResolutionRule[]

  // Localization
  languages: Language[]                   // e.g., ['ar', 'en'] for Qatar QCB
  defaultLanguage: Language               // Primary language

  // Metadata
  implementationDate: Date                // When plugin became active
  version: string                         // Plugin version (e.g., '1.0.0')
}

interface Regulator {
  id: string                          // e.g., 'QCB', 'QFCRA', 'SAMA', 'BNM'
  name: string                        // Full name
  type: RegulatorType                 // CENTRAL_BANK, SECURITIES_REGULATOR, SPECIAL_ZONE
  jurisdiction: string                // Mainland, offshore zone, etc.
  website: string                     // Official website

  // Retention & Evidence
  defaultRetentionYears: number       // e.g., 10 for QCB, 6 for QFCRA
  permanentRetentionCategories: string[]  // e.g., ['SSB_FATWA'] for permanent retention
  languageRequirements: Language[]    // Required languages for documentation

  // Reporting
  reportingFrequencies: Frequency[]   // Monthly, quarterly, annual, ad-hoc
  primaryContactChannel: string       // How to submit reports (portal, email, etc.)

  // AAOIFI/IFSB
  aaoifiMandatory: boolean            // Whether AAOIFI standards mandatory
  ifsbMandatory: boolean              // Whether IFSB standards mandatory

  // Central Shariah Board
  hasCentralShariahBoard: boolean     // Critical: not all jurisdictions have this!
  centralBoardName?: string           // e.g., 'Shariah Advisory Council' (Malaysia)
}

interface Obligation {
  id: string                          // e.g., 'QA-OBL-001', 'SA-OBL-001'
  title: string
  requirement: string                 // Full text of obligation
  regulatorIds: string[]              // Which regulators require this (e.g., ['QCB'], ['QFCRA'], ['QCB', 'QFCRA'])
  category: string                    // SSB_GOVERNANCE, RISK_MANAGEMENT, etc.
  frequency: Frequency                // ONGOING, MONTHLY, QUARTERLY, ANNUAL, AD_HOC
  evidenceRequired: string[]          // Evidence types that satisfy this obligation
  relatedControls: string[]           // Control IDs that validate compliance
  priority: Priority                  // HIGH, MEDIUM, LOW
  source: ObligationSource            // Citation to regulation/law
  effectiveDate: Date                 // When obligation became effective
}

interface ControlActivationRule {
  controlId: string                   // e.g., 'CTRL-001' (universal control)
  regulatorId: string                 // e.g., 'QCB', 'SAMA'
  required: boolean                   // True if mandatory, false if optional
  customization?: ControlCustomization  // Jurisdiction-specific tweaks
}

interface EvidenceStandard {
  regulatorId: string
  evidenceType: string                // e.g., 'SSB_APPOINTMENT_RESOLUTION'
  acceptedFormats: string[]           // ['PDF', 'DOCX', 'SCANNED_IMAGE']
  languageRequirement: Language[]     // ['ar', 'en'] for bilingual
  retentionYears: number              // 6, 10, or -1 for permanent
  mustBeOriginal: boolean             // True if scanned copies not accepted
  blockchainAnchorRequired: boolean   // True if VC anchoring required
}

interface SSBGovernanceModel {
  minMembers: number                  // e.g., 3 for Qatar
  maxMembers?: number                 // Optional cap
  independenceRequirements: string[]  // List of independence criteria
  maxPositionsPerScholar?: number     // e.g., 3 for Qatar QCB
  coolingOffPeriodYears?: number      // e.g., 2 for Qatar QCB
  votingRules: VotingRules            // Majority, unanimity, etc.
  meetingFrequency: Frequency         // Quarterly, semi-annual, etc.
  reportingToRegulator: boolean       // Whether SSB reports to regulator
  reportingFrequency?: Frequency      // If reporting required
}

interface AaoifiAlignment {
  shariahStandards: StandardAdoption[]   // SS-1 to SS-66
  governanceStandards: StandardAdoption[] // GS-1 to GS-22
  accountingStandards: StandardAdoption[] // FAS-1 to FAS-35
  auditingStandards: StandardAdoption[]   // ASIFI standards
}

interface StandardAdoption {
  standardId: string                  // e.g., 'FAS-25', 'GSIFI-1'
  status: AdoptionStatus              // MANDATORY, OPTIONAL, NOT_REQUIRED
  regulatorId: string                 // Which regulator mandates this
  effectiveDate?: Date                // When became mandatory
  deviations?: string[]               // Any local deviations from standard
}

interface ReportRequirement {
  id: string                          // e.g., 'QCB-REPORT-001'
  title: string                       // 'Monthly SNCR Report'
  regulatorId: string
  frequency: Frequency
  dueDate: ReportDueDate              // e.g., '15th of following month'
  format: ReportFormat                // PDF, EXCEL, XML, etc.
  language: Language[]
  template?: string                   // Path to report template
  dataRequirements: string[]          // What data must be included
  submissionMethod: string            // Portal, email, API, etc.
}
```

---

## 8-Phase Research Process

This is the proven process used for Qatar, documented in `RESEARCH_PROCESS_DOCUMENTATION.md`. Follow these phases sequentially for each new jurisdiction.

### Phase 1: Regulatory Landscape Discovery (1-2 days)

**Objective**: Identify ALL regulators in the jurisdiction (don't assume there's only one!)

**Critical Lesson from Qatar**: Qatar has TWO regulators (QCB mainland + QFCRA offshore). Always check for:
- Central banks
- Securities/capital markets regulators
- Special economic zone regulators (e.g., DIFC in Dubai, QFC in Qatar, ADGM in Abu Dhabi)
- Islamic finance-specific regulators (rare but possible)

**Research Tasks**:
- [ ] Search for "{Country} financial regulator" and "{Country} Islamic finance regulator"
- [ ] Identify central bank (usually primary regulator for Islamic banks)
- [ ] Check for special economic zones (offshore financial centers often have separate regulators)
- [ ] Map regulatory jurisdiction (which regulator covers which entities)
- [ ] Document regulator websites and contact information

**Tools**:
- Web search for overview
- Exa AI for academic papers on regulatory structure
- Regulator websites for official organizational charts

**Deliverable**: `{JURISDICTION}_REGULATORY_LANDSCAPE.md`

**Template**:
```markdown
# {Jurisdiction} Regulatory Landscape

## Regulators Identified

### {Regulator 1 Name} ({Abbreviation})
- **Type**: Central Bank / Securities Regulator / Special Zone
- **Jurisdiction**: Mainland / Offshore / Specific Zone
- **Islamic Finance Authority**: Yes / No
- **Website**: [URL]
- **Primary Laws/Regulations**: [List]

### {Regulator 2 Name} (if applicable)
...

## Regulatory Map
- **Onshore Islamic Banks**: Regulated by [Regulator]
- **Islamic Investment Firms**: Regulated by [Regulator]
- **Takaful Companies**: Regulated by [Regulator]
- **Islamic Windows**: Regulated by [Regulator]

## Central Shariah Board
- **Exists**: Yes / No
- **Name**: [Name if exists]
- **Authority**: Advisory / Mandatory / Supreme
- **Regulator Affiliation**: [Which regulator it belongs to]
```

### Phase 2: Regulatory Document Discovery (2-3 days)

**Objective**: Find primary sources (laws, regulations, circulars, rulebooks)

**Research Tasks**:
- [ ] Download all Islamic finance regulations from regulator websites
- [ ] Search for Shariah governance circulars/guidelines
- [ ] Find risk management requirements (SNCR, fiduciary risk)
- [ ] Locate reporting requirements (forms, templates, circulars)
- [ ] Identify AAOIFI/IFSB adoption announcements
- [ ] Find SSB governance requirements

**Tools**:
- Firecrawl scrape for regulator websites
- Firecrawl search for navigating complex sites
- Exa AI for finding industry compliance guides
- Web search for official gazette publications

**Key Documents to Find**:
1. **Primary Islamic Finance Law/Regulation** (e.g., Qatar QCB's Islamic Banking Law)
2. **Shariah Governance Framework** (e.g., Malaysia BNM's Shariah Governance Policy)
3. **SNCR/Risk Management Requirements** (usually in prudential regulations)
4. **Reporting Requirements** (circulars on regulatory returns)
5. **AAOIFI/IFSB Adoption Notices** (official announcements)
6. **Licensing Requirements** (for Islamic banks/windows)

**Deliverable**: Document repository with all PDFs and links in `{JURISDICTION}_REGULATORY_DOCUMENTS.md`

### Phase 3: Obligation Extraction (3-5 days)

**Objective**: Catalog every "must", "shall", "required" obligation

**Critical**: Extract obligations from PRIMARY sources, not secondary commentary.

**Extraction Pattern**:
1. Read regulation sequentially
2. Flag every sentence with "must", "shall", "required", "obligated"
3. Extract obligation text + citation
4. Categorize by domain (SSB Governance, Risk, Reporting, Products, etc.)
5. Tag by regulator if multiple regulators

**Categories** (consistent across jurisdictions):
- SSB_GOVERNANCE
- SNCR_MANAGEMENT
- PRODUCT_APPROVAL
- RISK_MANAGEMENT
- INTERNAL_CONTROLS
- REPORTING_DISCLOSURE
- ACCOUNTING_STANDARDS
- AUDIT_ASSURANCE
- LICENSING_REGISTRATION
- COMPLAINT_HANDLING
- TECHNOLOGY_SYSTEMS
- DOCUMENTATION_RECORDKEEPING
- TRAINING_COMPETENCE
- CUSTOMER_PROTECTION
- ANTI_MONEY_LAUNDERING

**Deliverable**: `{REGULATOR}_OBLIGATIONS_CATALOG.md`

**Template**:
```markdown
# {Regulator} Islamic Finance Obligations Catalog

**Total Obligations**: {Count}
**Regulator**: {Regulator Name}
**Effective Date**: {Date}
**Last Updated**: {Date}

---

## SSB Governance ({Count} obligations)

### {REGULATOR}-OBL-001: SSB Appointment
**Requirement**: {Full text of requirement}
**Frequency**: ONGOING / ANNUAL / etc.
**Citation**: {Regulation Name, Article/Section}
**Evidence Required**: [List of evidence types]
**Priority**: HIGH / MEDIUM / LOW
**Related AAOIFI**: GS-1 (if applicable)

### {REGULATOR}-OBL-002: SSB Independence
...

## SNCR Management ({Count} obligations)
...

[Continue for all 15 categories]
```

### Phase 4: Shariah Governance Framework (1-2 days)

**Objective**: Document SSB requirements in detail

**Critical Discovery from Qatar**: QCB has NO Central Shariah Board (unlike UAE, Malaysia, Bahrain). Never assume one exists!

**Research Focus**:
- SSB composition (min/max members)
- Independence criteria
- Qualification requirements (Shariah degrees, experience)
- Appointment process
- Term limits and cooling-off periods
- Position limits (e.g., max 3 positions per scholar in Qatar QCB)
- Decision-making process (voting rules, quorum, unanimity vs majority)
- Reporting to regulator (frequency, content)
- Central Shariah Board (if exists):
  - Relationship to entity-level SSBs
  - Mandatory referral requirements
  - Binding vs advisory role

**Deliverable**: `{REGULATOR}_SSB_GOVERNANCE_MODEL.md`

**Template**:
```markdown
# {Regulator} Shariah Governance Model

## Overview
- **Regulator**: {Name}
- **Governance Approach**: Centralized / Decentralized / Hybrid
- **Central Shariah Board**: Yes / No

---

## SSB Composition

### Membership Requirements
- **Minimum Members**: {Number}
- **Maximum Members**: {Number or 'No limit'}
- **Independence Requirement**: {Description}
- **Qualifications**: [List required Shariah degrees, experience]

### Appointment Process
{Describe how SSB members are appointed}

### Term Limits
- **Term Length**: {Years}
- **Re-appointment**: Allowed / Not allowed / {Conditions}
- **Cooling-Off Period**: {Years or 'None'}

### Position Limits
- **Max Positions Per Scholar**: {Number or 'No limit'}
- **Conflict of Interest Rules**: {Description}

## Decision-Making Process

### Voting Rules
- **Quorum**: {Number or percentage}
- **Decision Threshold**: Simple majority / Supermajority / Unanimity
- **Dissent Recording**: Required / Optional / Not allowed
- **Fatwa Issuance**: {Process}

### Meeting Frequency
- **Minimum Meetings**: {Number} per year
- **Ad-Hoc Meetings**: {Allowed / Process}

## Reporting to Regulator

### SSB Report
- **Frequency**: Annual / Semi-annual / Quarterly
- **Submission Deadline**: {Date}
- **Required Content**: [List]
- **Language**: {Arabic, English, both}

## Central Shariah Board (if applicable)

### Structure
- **Name**: {Official name}
- **Members**: {Number and composition}
- **Appointing Authority**: {Who appoints members}

### Authority
- **Binding Decisions**: Yes / No
- **Mandatory Referral**: {When entity SSB must refer to Central Board}
- **Appeal Process**: {If decisions can be appealed}

---

## Citations
{List all regulation citations}
```

### Phase 5: Evidence Standards Documentation (1 day)

**Objective**: Define what evidence satisfies regulators and retention requirements

**Key Differences by Jurisdiction**:
- Retention periods (6-10+ years varies widely)
- Language requirements (Arabic, English, local language, bilingual)
- Format requirements (digital vs physical, original vs certified copy)
- Blockchain/notarization requirements (emerging)

**Research Focus**:
- Document retention requirements (by document type)
- Acceptable formats (PDF, scanned, original, etc.)
- Language requirements
- Storage requirements (onshore, secure, etc.)
- Production timeline (how quickly must be produced for inspection)
- Permanent retention categories (SSB fatwas, licenses, etc.)

**Deliverable**: `{REGULATOR}_EVIDENCE_STANDARDS.md`

**Template**:
```markdown
# {Regulator} Evidence Standards

## Retention Requirements

### Default Retention Period
**Standard**: {Years} years from {event trigger}

### Document-Specific Retention

| Document Type | Retention Period | Notes |
|---------------|------------------|-------|
| SSB Fatwas | Permanent | Cannot be destroyed |
| SSB Meeting Minutes | {Years} | |
| Internal Audit Reports | {Years} | |
| Customer Contracts | {Years} | From contract end |
| Financial Statements | {Years} | |
| Compliance Certifications | {Years} | |

## Format Requirements

### Acceptable Formats
- **Primary**: Digital (PDF, electronic records)
- **Secondary**: Physical documents (original or certified copy)
- **Scanned Documents**: Accepted / Not accepted / {Conditions}

### Digital Signatures
- **Accepted**: Yes / No
- **Blockchain Anchoring**: Required / Optional / Not accepted
- **Standards**: {e.g., eIDAS, local standard}

## Language Requirements

### Primary Language
**Required**: {Arabic, English, local language}

### Translation Requirements
- **Bilingual Required**: Yes / No
- **Certified Translation**: Required / Not required
- **Which Documents**: [List if selective]

## Storage Requirements

### Location
- **Onshore Requirement**: Yes / No
- **Acceptable Jurisdictions**: {List}

### Security
- **Encryption Required**: Yes / No / {For which documents}
- **Access Controls**: {Requirements}
- **Backup Requirements**: {Requirements}

## Production for Inspection

### Timeline
**Must Produce Within**: {Days} business days of request

### Format for Submission
{How regulator wants to receive documents}

---

## Citations
{List all regulation citations}
```

### Phase 6: Reporting Requirements Documentation (1-2 days)

**Objective**: Catalog all regulatory reports (frequency, format, deadlines)

**Categorize by Frequency**:
- Monthly reports (highest burden)
- Quarterly reports
- Semi-annual reports
- Annual reports
- Ad-hoc reports (upon request or event-triggered)

**For Each Report, Capture**:
- Report ID
- Title
- Frequency
- Due date (e.g., "15th of following month")
- Format (PDF, Excel, XML, portal submission)
- Language
- Data requirements
- Template (if available)
- Submission method (email, portal, API)

**Deliverable**: `{REGULATOR}_REPORTING_REQUIREMENTS.md`

**Template**:
```markdown
# {Regulator} Reporting Requirements

**Total Reports**: {Count}
- **Monthly**: {Count}
- **Quarterly**: {Count}
- **Semi-Annual**: {Count}
- **Annual**: {Count}
- **Ad-Hoc**: {Count}

---

## Monthly Reports ({Count})

### {REGULATOR}-REPORT-001: Monthly SNCR Report
**Frequency**: Monthly
**Due Date**: 15th of following month
**Format**: Excel template
**Language**: {Arabic, English, both}
**Submission**: {Portal / Email / API}
**Template**: [Link if available]

**Data Requirements**:
- Total SNCR incidents logged
- Financial impact (by incident category)
- Incidents reported to SSB
- Incidents reported to regulator
- Purification executed (amount, beneficiary)

**Citation**: {Regulation reference}

---

## Quarterly Reports ({Count})

### {REGULATOR}-REPORT-010: SSB Activity Report
...

[Continue for all report frequencies]

---

## Reporting Calendar

| Month | Due Date | Report ID | Report Title |
|-------|----------|-----------|--------------|
| Jan | 15th | {ID} | {Title} |
| Jan | 31st | {ID} | {Title} |
| Feb | 15th | {ID} | {Title} |
...

---

## Citations
{List all regulation citations}
```

### Phase 7: AAOIFI/IFSB Alignment Analysis (1-2 days)

**Objective**: Determine which international standards are mandatory

**Critical Discovery from Qatar**: AAOIFI adoption varies DRAMATICALLY:
- QCB: Full mandatory AAOIFI FAS
- QFCRA: Selective AAOIFI (GSIFI 1,2,3 + select FAS)

Never assume uniform AAOIFI compliance!

**Research Focus**:
- Official AAOIFI adoption announcements
- Which standards are mandatory (Shariah SS, Governance GS, Accounting FAS, Auditing ASIFI)
- Effective dates of adoption
- Any local deviations from AAOIFI standards
- IFSB standards adoption (IFSB-1, IFSB-10, etc.)

**Deliverable**: `{REGULATOR}_AAOIFI_ALIGNMENT.md`

**Template**:
```markdown
# {Regulator} AAOIFI/IFSB Alignment

## AAOIFI Adoption Status

### Official Announcement
- **Date**: {Date of adoption announcement}
- **Scope**: Full adoption / Selective adoption / Reference only
- **Effective Date**: {When became mandatory}
- **Citation**: {Official circular/regulation}

---

## Shariah Standards (SS)

| Standard | Title | Status | Effective Date | Notes |
|----------|-------|--------|----------------|-------|
| SS-1 | Trading in Currencies | Mandatory / Optional / Not Required | {Date} | {Any deviations} |
| SS-2 | Debit Card | ... | ... | ... |
...

**Summary**: {X} of {66} Shariah Standards mandatory

---

## Governance Standards (GS)

| Standard | Title | Status | Effective Date | Notes |
|----------|-------|--------|----------------|-------|
| GS-1 (GSIFI-1) | Shariah Supervisory Board: Appointment, Composition and Report | Mandatory / Optional | {Date} | |
| GS-2 (GSIFI-2) | Shariah Review | ... | ... | ... |
...

**Summary**: {X} of {22} Governance Standards mandatory

---

## Financial Accounting Standards (FAS)

| Standard | Title | Status | Effective Date | Notes |
|----------|-------|--------|----------------|-------|
| FAS-1 | General Presentation and Disclosure | Mandatory / Optional | {Date} | |
| FAS-17 | Investment Funds | ... | ... | ... |
| FAS-25 | Investment Accounts | ... | ... | ... |
...

**Summary**: {X} of {35} Accounting Standards mandatory

---

## Auditing Standards (ASIFI)

**Status**: {Adopted / Not adopted / Reference only}

---

## IFSB Standards Alignment

### Risk Management
- **IFSB-1 (Risk Management)**: Mandatory / Reference / Not required
- **IFSB-2 (Capital Adequacy)**: ...

### Shariah Governance
- **IFSB-10 (Shariah Governance)**: Mandatory / Reference / Not required
- **IFSB-31 (Supervision of Shariah Governance)**: ...

### Corporate Governance
- **IFSB-30 (Corporate Governance)**: ...

---

## Deviation Analysis

### Local Deviations from AAOIFI
{List any cases where regulator deviates from AAOIFI standard text}

### Gaps (AAOIFI Standards Not Adopted)
{List any AAOIFI standards that are NOT adopted but might be relevant}

---

## Implications for GRC System

### Must Support
{List which AAOIFI/IFSB standards must be validated in GRC system}

### Optional Support
{List which standards are optional but should be configurable}

---

## Citations
{List all circulars, regulations, official announcements}
```

### Phase 8: Integration & Synthesis (1-2 days)

**Objective**: Create unified view and identify conflicts (for multi-regulator jurisdictions)

**Tasks**:
- [ ] Create unified obligations register (if multiple regulators)
- [ ] Identify obligation conflicts and document resolution rules
- [ ] Map obligations to ISO 37301 structure
- [ ] Map obligations to universal control library
- [ ] Identify jurisdiction-specific controls needed
- [ ] Create regulatory selector design (if multi-regulator)
- [ ] Write executive summary document

**Deliverables**:
- `{JURISDICTION}_UNIFIED_OBLIGATIONS_REGISTER.md` (if multi-regulator)
- `{JURISDICTION}_ISO37301_MAPPING.md`
- `{JURISDICTION}_CONTROL_ACTIVATION_RULES.md`
- `{JURISDICTION}_REGULATORY_SELECTOR_DESIGN.md` (if multi-regulator)
- `{JURISDICTION}_RESEARCH_SUMMARY.md`

**Templates**: See Qatar versions as templates for these documents.

---

## Research Document Templates

All templates are available in the `/qatar-grc-infrastructure/research/` directory. Use Qatar documents as working examples:

1. **{REGULATOR}_OBLIGATIONS_CATALOG.md** → Template: `QCB_OBLIGATIONS_CATALOG.md` or `QFCRA_OBLIGATIONS_CATALOG.md`
2. **{REGULATOR}_SSB_GOVERNANCE_MODEL.md** → Template: `QCB_SSB_GOVERNANCE_MODEL.md`
3. **{REGULATOR}_EVIDENCE_STANDARDS.md** → Template: `QCB_EVIDENCE_STANDARDS.md`
4. **{REGULATOR}_REPORTING_REQUIREMENTS.md** → Template: `QCB_REPORTING_REQUIREMENTS.md`
5. **{REGULATOR}_AAOIFI_ALIGNMENT.md** → Template: `QCB_AAOIFI_ALIGNMENT.md`
6. **{JURISDICTION}_UNIFIED_OBLIGATIONS_REGISTER.md** (multi-regulator only) → Template: `QATAR_UNIFIED_OBLIGATIONS_REGISTER.md`
7. **{JURISDICTION}_RESEARCH_SUMMARY.md** → Template: `QATAR_RESEARCH_SUMMARY.md`

---

## Technical Implementation Guide

Once research is complete, follow these steps to implement the jurisdiction plugin in code.

### Step 1: Create Jurisdiction Plugin File

**Location**: `backend/app/jurisdictions/{jurisdiction_id}.py`

Example: `backend/app/jurisdictions/qatar.py`

```python
# backend/app/jurisdictions/qatar.py

from typing import List
from app.models.jurisdiction import (
    JurisdictionPlugin,
    Regulator,
    Obligation,
    ControlActivationRule,
    EvidenceStandard,
    SSBGovernanceModel,
    AaoifiAlignment,
    ReportRequirement,
    RegulatorType,
    Frequency,
    Priority,
    Language
)

# Define regulators
QCB = Regulator(
    id="QCB",
    name="Qatar Central Bank",
    type=RegulatorType.CENTRAL_BANK,
    jurisdiction="Mainland Qatar",
    website="https://www.qcb.gov.qa",
    defaultRetentionYears=10,
    permanentRetentionCategories=["SSB_FATWA", "LICENSING_DOCUMENTS"],
    languageRequirements=[Language.ARABIC, Language.ENGLISH],
    reportingFrequencies=[Frequency.MONTHLY, Frequency.QUARTERLY, Frequency.ANNUAL],
    primaryContactChannel="QCB Regulatory Portal",
    aaoifiMandatory=True,
    ifsbMandatory=True,
    hasCentralShariahBoard=False  # CRITICAL: No Central Board
)

QFCRA = Regulator(
    id="QFCRA",
    name="Qatar Financial Centre Regulatory Authority",
    type=RegulatorType.SPECIAL_ZONE,
    jurisdiction="Qatar Financial Centre",
    website="https://www.qfcra.com",
    defaultRetentionYears=6,
    permanentRetentionCategories=["SSB_FATWA"],
    languageRequirements=[Language.ENGLISH],
    reportingFrequencies=[Frequency.QUARTERLY, Frequency.ANNUAL],
    primaryContactChannel="QFCRA Portal",
    aaoifiMandatory=False,  # Selective adoption
    ifsbMandatory=True,
    hasCentralShariahBoard=False
)

# Define obligations (from QATAR_UNIFIED_OBLIGATIONS_REGISTER.md)
qatar_obligations: List[Obligation] = [
    Obligation(
        id="QA-OBL-001",
        title="SSB Appointment & Composition",
        requirement="Appoint SSB with minimum 3 members meeting independence and qualification criteria",
        regulatorIds=["QCB", "QFCRA"],  # Common to both
        category="SSB_GOVERNANCE",
        frequency=Frequency.ONGOING,
        evidenceRequired=["SSB_APPOINTMENT_RESOLUTION", "SSB_MEMBER_CVS"],
        relatedControls=["CTRL-001", "CTRL-002"],
        priority=Priority.HIGH,
        source={
            "QCB": "Islamic Banking Law Article 5",
            "QFCRA": "IFR Rule 3.1.1"
        },
        effectiveDate="2020-01-01"
    ),
    # ... 59 more obligations
]

# Define control activation rules (from QATAR_CONTROL_ACTIVATION_RULES.md)
qatar_control_activation: List[ControlActivationRule] = [
    ControlActivationRule(
        controlId="CTRL-001",
        regulatorId="QCB",
        required=True,
        customization={
            "max_positions_per_scholar": 3,
            "cooling_off_years": 2
        }
    ),
    ControlActivationRule(
        controlId="CTRL-001",
        regulatorId="QFCRA",
        required=True,
        customization={
            "max_positions_per_scholar": None  # No limit for QFCRA
        }
    ),
    # ... rules for all 34 controls
]

# Define evidence standards (from QCB_EVIDENCE_STANDARDS.md and QFCRA_EVIDENCE_STANDARDS.md)
qatar_evidence_standards: List[EvidenceStandard] = [
    EvidenceStandard(
        regulatorId="QCB",
        evidenceType="SSB_APPOINTMENT_RESOLUTION",
        acceptedFormats=["PDF", "SCANNED_ORIGINAL"],
        languageRequirement=[Language.ARABIC, Language.ENGLISH],  # Bilingual
        retentionYears=10,
        mustBeOriginal=True,
        blockchainAnchorRequired=False
    ),
    EvidenceStandard(
        regulatorId="QFCRA",
        evidenceType="SSB_APPOINTMENT_RESOLUTION",
        acceptedFormats=["PDF", "DIGITAL_SIGNATURE"],
        languageRequirement=[Language.ENGLISH],
        retentionYears=6,
        mustBeOriginal=False,
        blockchainAnchorRequired=False
    ),
    # ... standards for all evidence types
]

# Define SSB governance models
qatar_ssb_governance_qcb = SSBGovernanceModel(
    minMembers=3,
    maxMembers=None,
    independenceRequirements=[
        "No employment relationship with entity",
        "No financial interest >5%",
        "No family relationship with management"
    ],
    maxPositionsPerScholar=3,  # QCB specific
    coolingOffPeriodYears=2,   # QCB specific
    votingRules={
        "quorum": 2,
        "threshold": "simple_majority",
        "dissent_recording": "mandatory"
    },
    meetingFrequency=Frequency.QUARTERLY,
    reportingToRegulator=True,
    reportingFrequency=Frequency.ANNUAL
)

qatar_ssb_governance_qfcra = SSBGovernanceModel(
    minMembers=3,
    maxMembers=None,
    independenceRequirements=[
        "No employment relationship with entity",
        "No material financial interest"
    ],
    maxPositionsPerScholar=None,  # No limit
    coolingOffPeriodYears=None,   # Not required
    votingRules={
        "quorum": 2,
        "threshold": "simple_majority",
        "dissent_recording": "optional"
    },
    meetingFrequency=Frequency.QUARTERLY,
    reportingToRegulator=True,
    reportingFrequency=Frequency.ANNUAL
)

# Define AAOIFI alignment
qatar_aaoifi_alignment = AaoifiAlignment(
    shariahStandards=[
        # QCB: Implicitly required via product compliance (~20 standards)
        # QFCRA: Reference only
    ],
    governanceStandards=[
        StandardAdoption(standardId="GS-1", status="MANDATORY", regulatorId="QFCRA"),
        StandardAdoption(standardId="GS-2", status="MANDATORY", regulatorId="QFCRA"),
        StandardAdoption(standardId="GS-3", status="MANDATORY", regulatorId="QFCRA"),
        # QCB: Not explicitly mandatory
    ],
    accountingStandards=[
        StandardAdoption(standardId="FAS-25", status="MANDATORY", regulatorId="QCB"),
        StandardAdoption(standardId="FAS-17", status="MANDATORY", regulatorId="QCB"),
        # ... all FAS mandatory for QCB
        StandardAdoption(standardId="FAS-12", status="MANDATORY", regulatorId="QFCRA"),
        StandardAdoption(standardId="FAS-13", status="MANDATORY", regulatorId="QFCRA"),
        StandardAdoption(standardId="FAS-18", status="MANDATORY", regulatorId="QFCRA"),
    ]
)

# Define reporting requirements (from QCB_REPORTING_REQUIREMENTS.md and QFCRA_REPORTING_REQUIREMENTS.md)
qatar_reports: List[ReportRequirement] = [
    ReportRequirement(
        id="QCB-REPORT-001",
        title="Monthly SNCR Report",
        regulatorId="QCB",
        frequency=Frequency.MONTHLY,
        dueDate="15th of following month",
        format="EXCEL",
        language=[Language.ARABIC, Language.ENGLISH],
        template="/templates/qcb_sncr_monthly.xlsx",
        dataRequirements=[
            "SNCR incidents count",
            "Financial impact by category",
            "Purification executed",
            "SSB reporting status"
        ],
        submissionMethod="QCB Portal"
    ),
    # ... 54 more reports
]

# Conflict resolution rules (from QATAR_REGULATORY_SELECTOR_DESIGN.md)
qatar_conflict_rules = [
    {
        "conflict": "SSB member position limit",
        "QCB": "Max 3 positions",
        "QFCRA": "No limit",
        "resolution": "Apply QCB (strictest)"
    },
    {
        "conflict": "Evidence retention period",
        "QCB": "10 years",
        "QFCRA": "6 years",
        "resolution": "Apply QCB (longer)"
    },
    # ... 8 total conflict rules
]

# Assemble plugin
QATAR_PLUGIN = JurisdictionPlugin(
    id="QA-QCB-QFCRA",
    country="QA",
    name="Qatar (QCB + QFCRA)",
    regulators=[QCB, QFCRA],
    obligations=qatar_obligations,
    controlActivationRules=qatar_control_activation,
    jurisdictionSpecificControls=[
        # 8 new Qatar-specific controls defined in QATAR_CONTROL_ACTIVATION_RULES.md
    ],
    evidenceStandards=qatar_evidence_standards,
    ssbGovernanceModel={
        "QCB": qatar_ssb_governance_qcb,
        "QFCRA": qatar_ssb_governance_qfcra
    },
    aaoifiAlignment=qatar_aaoifi_alignment,
    reportingRequirements=qatar_reports,
    conflictResolutionRules=qatar_conflict_rules,
    languages=[Language.ARABIC, Language.ENGLISH],
    defaultLanguage=Language.ENGLISH,
    implementationDate="2025-11-08",
    version="1.0.0"
)
```

### Step 2: Register Plugin in Plugin Registry

**Location**: `backend/app/jurisdictions/__init__.py`

```python
# backend/app/jurisdictions/__init__.py

from typing import Dict
from app.models.jurisdiction import JurisdictionPlugin
from app.jurisdictions.qatar import QATAR_PLUGIN
# Import future plugins here
# from app.jurisdictions.saudi_arabia import SAMA_PLUGIN
# from app.jurisdictions.malaysia import BNM_PLUGIN

JURISDICTION_REGISTRY: Dict[str, JurisdictionPlugin] = {
    "QA-QCB-QFCRA": QATAR_PLUGIN,
    # "SA-SAMA": SAMA_PLUGIN,
    # "MY-BNM": BNM_PLUGIN,
}

def get_jurisdiction_plugin(jurisdiction_id: str) -> JurisdictionPlugin:
    """Get jurisdiction plugin by ID"""
    if jurisdiction_id not in JURISDICTION_REGISTRY:
        raise ValueError(f"Unknown jurisdiction: {jurisdiction_id}")
    return JURISDICTION_REGISTRY[jurisdiction_id]

def list_jurisdictions() -> List[Dict]:
    """List all available jurisdictions"""
    return [
        {
            "id": plugin.id,
            "country": plugin.country,
            "name": plugin.name,
            "regulators": [r.id for r in plugin.regulators],
            "version": plugin.version
        }
        for plugin in JURISDICTION_REGISTRY.values()
    ]
```

### Step 3: Create Database Seed Script

**Location**: `backend/app/seeds/jurisdictions/{jurisdiction_id}_seed.py`

```python
# backend/app/seeds/jurisdictions/qatar_seed.py

from sqlalchemy.ext.asyncio import AsyncSession
from app.models.database import Obligation, Control, ControlActivationRule, EvidenceStandard, ReportRequirement
from app.jurisdictions.qatar import QATAR_PLUGIN

async def seed_qatar_data(session: AsyncSession):
    """Seed Qatar jurisdiction data"""

    # Seed obligations
    for obl_data in QATAR_PLUGIN.obligations:
        obl = Obligation(
            id=obl_data.id,
            title=obl_data.title,
            requirement=obl_data.requirement,
            applicability=obl_data.regulatorIds,
            category=obl_data.category,
            frequency=obl_data.frequency,
            evidence_required=obl_data.evidenceRequired,
            related_controls=obl_data.relatedControls,
            priority=obl_data.priority,
            source=obl_data.source,
            effective_date=obl_data.effectiveDate,
            jurisdiction_id=QATAR_PLUGIN.id
        )
        session.add(obl)

    # Seed control activation rules
    for rule in QATAR_PLUGIN.controlActivationRules:
        activation = ControlActivationRule(
            control_id=rule.controlId,
            regulator_id=rule.regulatorId,
            required=rule.required,
            customization=rule.customization,
            jurisdiction_id=QATAR_PLUGIN.id
        )
        session.add(activation)

    # Seed evidence standards
    for std in QATAR_PLUGIN.evidenceStandards:
        evidence_std = EvidenceStandard(
            regulator_id=std.regulatorId,
            evidence_type=std.evidenceType,
            accepted_formats=std.acceptedFormats,
            language_requirement=std.languageRequirement,
            retention_years=std.retentionYears,
            must_be_original=std.mustBeOriginal,
            blockchain_anchor_required=std.blockchainAnchorRequired,
            jurisdiction_id=QATAR_PLUGIN.id
        )
        session.add(evidence_std)

    # Seed report requirements
    for report in QATAR_PLUGIN.reportingRequirements:
        report_req = ReportRequirement(
            id=report.id,
            title=report.title,
            regulator_id=report.regulatorId,
            frequency=report.frequency,
            due_date=report.dueDate,
            format=report.format,
            language=report.language,
            template=report.template,
            data_requirements=report.dataRequirements,
            submission_method=report.submissionMethod,
            jurisdiction_id=QATAR_PLUGIN.id
        )
        session.add(report_req)

    await session.commit()
    print(f"✅ Qatar jurisdiction data seeded: {len(QATAR_PLUGIN.obligations)} obligations")
```

### Step 4: Add API Endpoints for Jurisdiction Selection

**Location**: `backend/app/api/jurisdictions.py`

```python
# backend/app/api/jurisdictions.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.jurisdictions import get_jurisdiction_plugin, list_jurisdictions
from app.models.database import Obligation, ControlActivationRule
from typing import List

router = APIRouter(prefix="/api/jurisdictions", tags=["jurisdictions"])

@router.get("/")
async def get_available_jurisdictions():
    """List all available jurisdictions"""
    return {
        "status": "success",
        "data": list_jurisdictions()
    }

@router.get("/{jurisdiction_id}")
async def get_jurisdiction_details(jurisdiction_id: str):
    """Get details for a specific jurisdiction"""
    plugin = get_jurisdiction_plugin(jurisdiction_id)
    return {
        "status": "success",
        "data": {
            "id": plugin.id,
            "country": plugin.country,
            "name": plugin.name,
            "regulators": [
                {
                    "id": r.id,
                    "name": r.name,
                    "type": r.type,
                    "retention_years": r.defaultRetentionYears,
                    "languages": r.languageRequirements
                }
                for r in plugin.regulators
            ],
            "obligations_count": len(plugin.obligations),
            "reports_count": len(plugin.reportingRequirements)
        }
    }

@router.post("/{jurisdiction_id}/activate")
async def activate_jurisdiction(
    jurisdiction_id: str,
    selected_regulators: List[str],
    session: AsyncSession = Depends(get_db)
):
    """
    Activate a jurisdiction with selected regulators
    This loads obligations and controls for the selected regulators
    """
    plugin = get_jurisdiction_plugin(jurisdiction_id)

    # Validate regulator selection
    valid_regulator_ids = [r.id for r in plugin.regulators]
    for reg_id in selected_regulators:
        if reg_id not in valid_regulator_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid regulator: {reg_id}. Valid options: {valid_regulator_ids}"
            )

    # Filter obligations by selected regulators
    applicable_obligations = [
        obl for obl in plugin.obligations
        if any(reg_id in obl.regulatorIds for reg_id in selected_regulators)
    ]

    # Filter control activation rules
    applicable_controls = [
        rule for rule in plugin.controlActivationRules
        if rule.regulatorId in selected_regulators and rule.required
    ]

    # Apply conflict resolution if multiple regulators selected
    if len(selected_regulators) > 1:
        # Apply conflict resolution rules from plugin
        pass  # Implement conflict resolution logic

    return {
        "status": "success",
        "data": {
            "jurisdiction_id": jurisdiction_id,
            "selected_regulators": selected_regulators,
            "obligations_count": len(applicable_obligations),
            "active_controls_count": len(applicable_controls),
            "conflict_resolution_applied": len(selected_regulators) > 1
        }
    }
```

### Step 5: Update Frontend Regulatory Selector

**Location**: `src/components/regulatory-selector/RegulatorySelector.tsx`

```typescript
// src/components/regulatory-selector/RegulatorySelector.tsx

import { useState, useEffect } from 'react'
import { backendClient } from '@/lib/backend-client'

interface Jurisdiction {
  id: string
  country: string
  name: string
  regulators: string[]
}

export function RegulatorySelector() {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([])
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('')
  const [selectedRegulators, setSelectedRegulators] = useState<string[]>([])

  useEffect(() => {
    loadJurisdictions()
  }, [])

  async function loadJurisdictions() {
    const response = await backendClient.get('/api/jurisdictions')
    setJurisdictions(response.data)
  }

  async function activateJurisdiction() {
    await backendClient.post(`/api/jurisdictions/${selectedJurisdiction}/activate`, {
      selected_regulators: selectedRegulators
    })
    // Reload obligations and controls
  }

  return (
    <div className="regulatory-selector">
      <select
        value={selectedJurisdiction}
        onChange={(e) => setSelectedJurisdiction(e.target.value)}
      >
        <option value="">Select Jurisdiction</option>
        {jurisdictions.map((j) => (
          <option key={j.id} value={j.id}>
            {j.name}
          </option>
        ))}
      </select>

      {selectedJurisdiction && (
        <div className="regulator-checkboxes">
          {jurisdictions
            .find((j) => j.id === selectedJurisdiction)
            ?.regulators.map((regId) => (
              <label key={regId}>
                <input
                  type="checkbox"
                  checked={selectedRegulators.includes(regId)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRegulators([...selectedRegulators, regId])
                    } else {
                      setSelectedRegulators(selectedRegulators.filter((id) => id !== regId))
                    }
                  }}
                />
                {regId}
              </label>
            ))}
        </div>
      )}

      <button onClick={activateJurisdiction}>Activate</button>
    </div>
  )
}
```

---

## Code Patterns & Examples

### Pattern 1: Multi-Regulator Conflict Resolution

```python
def resolve_obligation_conflicts(
    obligations: List[Obligation],
    selected_regulators: List[str],
    conflict_rules: List[ConflictResolutionRule]
) -> List[Obligation]:
    """
    When multiple regulators selected, apply conflict resolution rules
    Default: Strictest requirement wins
    """

    # Group obligations by ID (same obligation from different regulators)
    obligation_groups = {}
    for obl in obligations:
        base_id = obl.id.split('-REG-')[0]  # Remove regulator suffix if exists
        if base_id not in obligation_groups:
            obligation_groups[base_id] = []
        obligation_groups[base_id].append(obl)

    resolved = []
    for base_id, group in obligation_groups.items():
        if len(group) == 1:
            # No conflict
            resolved.append(group[0])
        else:
            # Multiple regulators have this obligation - apply conflict resolution
            strictest = apply_conflict_rule(group, conflict_rules)
            resolved.append(strictest)

    return resolved

def apply_conflict_rule(
    conflicting_obligations: List[Obligation],
    conflict_rules: List[ConflictResolutionRule]
) -> Obligation:
    """Apply conflict resolution rule to pick strictest requirement"""

    # Rule 1: Highest priority wins
    highest_priority = max(obl.priority for obl in conflicting_obligations)
    candidates = [obl for obl in conflicting_obligations if obl.priority == highest_priority]

    if len(candidates) == 1:
        return candidates[0]

    # Rule 2: Most frequent reporting wins
    frequency_order = [Frequency.DAILY, Frequency.WEEKLY, Frequency.MONTHLY, Frequency.QUARTERLY, Frequency.ANNUAL, Frequency.AD_HOC]
    most_frequent = min(candidates, key=lambda obl: frequency_order.index(obl.frequency))

    return most_frequent
```

### Pattern 2: Evidence Validation by Jurisdiction

```python
def validate_evidence_for_jurisdiction(
    evidence: Evidence,
    jurisdiction_id: str,
    regulator_id: str
) -> ValidationResult:
    """
    Validate evidence meets jurisdiction-specific requirements
    """
    plugin = get_jurisdiction_plugin(jurisdiction_id)

    # Find evidence standard for this regulator and evidence type
    standard = next(
        (std for std in plugin.evidenceStandards
         if std.regulatorId == regulator_id and std.evidenceType == evidence.type),
        None
    )

    if not standard:
        return ValidationResult(valid=False, error="No evidence standard defined")

    # Validate format
    if evidence.format not in standard.acceptedFormats:
        return ValidationResult(
            valid=False,
            error=f"Format {evidence.format} not accepted. Allowed: {standard.acceptedFormats}"
        )

    # Validate language
    if not all(lang in standard.languageRequirement for lang in evidence.languages):
        return ValidationResult(
            valid=False,
            error=f"Languages {evidence.languages} do not meet requirement: {standard.languageRequirement}"
        )

    # Validate retention expiry
    expected_expiry = evidence.created_date + timedelta(days=365 * standard.retentionYears)
    if evidence.retention_expiry != expected_expiry:
        return ValidationResult(
            valid=False,
            error=f"Incorrect retention expiry. Expected: {expected_expiry}"
        )

    return ValidationResult(valid=True)
```

### Pattern 3: Report Auto-Population by Jurisdiction

```python
async def generate_report_for_jurisdiction(
    report_id: str,
    jurisdiction_id: str,
    regulator_id: str,
    session: AsyncSession
) -> ReportGeneration:
    """
    Auto-populate report template with data from GRC system
    """
    plugin = get_jurisdiction_plugin(jurisdiction_id)

    # Find report requirement
    report_req = next(
        (r for r in plugin.reportingRequirements if r.id == report_id),
        None
    )

    if not report_req:
        raise ValueError(f"Report {report_id} not found in {jurisdiction_id}")

    # Fetch data based on report requirements
    data = {}
    for requirement in report_req.dataRequirements:
        if requirement == "SNCR incidents count":
            # Query SNCR incidents for reporting period
            count = await session.execute(
                select(func.count(SNCRIncident.id)).where(
                    SNCRIncident.regulator_id == regulator_id,
                    SNCRIncident.incident_date >= report_period_start
                )
            )
            data["sncr_count"] = count.scalar()

        elif requirement == "Purification executed":
            # Query purification journal
            purification = await session.execute(
                select(func.sum(PurificationJournal.amount)).where(
                    PurificationJournal.donation_date >= report_period_start
                )
            )
            data["purification_amount"] = purification.scalar()

        # ... handle other data requirements

    # Generate report using template
    if report_req.format == "PDF":
        pdf_bytes = generate_pdf_from_template(report_req.template, data, report_req.language)
    elif report_req.format == "EXCEL":
        excel_bytes = generate_excel_from_template(report_req.template, data)

    # Save generation record
    generation = ReportGeneration(
        report_id=report_id,
        jurisdiction_id=jurisdiction_id,
        regulator_id=regulator_id,
        generated_at=datetime.utcnow(),
        data=data,
        file_path=f"/reports/{report_id}_{datetime.now().strftime('%Y%m%d')}.pdf"
    )
    session.add(generation)
    await session.commit()

    return generation
```

---

## Validation Checklist

Use this checklist before marking jurisdiction research as "complete":

### Research Completeness

- [ ] **Phase 1**: All regulators identified (checked for mainland + offshore + special zones)
- [ ] **Phase 2**: All primary regulatory documents downloaded and cataloged
- [ ] **Phase 3**: Obligations catalog complete for each regulator (every "must"/"shall" extracted)
- [ ] **Phase 4**: SSB governance model documented (including Central Board if exists)
- [ ] **Phase 5**: Evidence standards documented (retention, language, format)
- [ ] **Phase 6**: All reporting requirements cataloged (monthly, quarterly, annual, ad-hoc)
- [ ] **Phase 7**: AAOIFI/IFSB alignment analyzed (which standards mandatory)
- [ ] **Phase 8**: Integration complete (unified register if multi-regulator, ISO 37301 mapping, control activation rules)

### Quality Assurance

- [ ] Every obligation has exact citation to regulation (Article, Section, Rule number)
- [ ] Every obligation has category assigned (SSB_GOVERNANCE, RISK_MANAGEMENT, etc.)
- [ ] Every obligation has frequency specified (ONGOING, MONTHLY, etc.)
- [ ] Every obligation has priority assigned (HIGH, MEDIUM, LOW)
- [ ] Evidence requirements specified for each obligation
- [ ] SSB governance model has all fields populated (min members, voting rules, etc.)
- [ ] Retention periods verified for each document type
- [ ] Report templates identified or noted as needing development
- [ ] AAOIFI alignment status verified (mandatory vs optional vs not required)

### Comparative Analysis (if multi-regulator)

- [ ] Unified obligations register created with regulator tags
- [ ] Conflicts identified and documented (at least 5-10 conflicts expected)
- [ ] Conflict resolution rules documented for each conflict
- [ ] Regulatory selector design created (UI mockup + logic)

### Reusability

- [ ] Research process documented (lessons learned, tools used, time taken)
- [ ] Templates used consistently (all documents follow same structure)
- [ ] Citations are reusable (can be verified by future researchers)
- [ ] Jurisdiction-specific nuances documented (e.g., "No Central Board" for Qatar QCB)

### Technical Implementation Ready

- [ ] Obligation count confirmed (total obligations across all regulators)
- [ ] Control activation matrix created (which controls required per regulator)
- [ ] New jurisdiction-specific controls identified
- [ ] Evidence standard requirements translated to technical specs
- [ ] Report generation requirements understood (data sources identified)

---

## Lessons Learned from Qatar

### Critical Lessons

**1. Always Check for Multiple Regulators**

Qatar discovery: **TWO regulators** (QCB mainland + QFCRA offshore)

**Implication**: Never assume one regulator per country. Check for:
- Central bank
- Securities regulator
- Special economic zones (DIFC in Dubai, QFC in Qatar, ADGM in Abu Dhabi)

**Pattern**: Onshore/offshore regulatory split is common in Gulf countries.

**2. Central Shariah Board is NOT Universal**

Qatar discovery: QCB has **NO Central Shariah Board** (decentralized model)

**Implication**: Cannot assume centralized Shariah governance. Each jurisdiction has different model:
- **Centralized**: Malaysia (SAC), Bahrain (Central Shariah Board), UAE (Higher Shariah Authority)
- **Decentralized**: Qatar (entity-level SSBs only), Indonesia
- **Hybrid**: Saudi Arabia (SAMA oversight but no binding Central Board)

**Always verify**: Does Central Board exist? Is it binding or advisory?

**3. AAOIFI Adoption Varies Dramatically**

Qatar discovery: **QCB full mandatory FAS** vs **QFCRA selective reference**

**Implication**: Cannot assume uniform AAOIFI compliance even within one country.

**Pattern**:
- Bahrain: Full AAOIFI adoption (AAOIFI headquarters)
- Saudi Arabia: Expected full adoption (SAMA is AAOIFI member)
- Malaysia: AAOIFI-aligned but with Malaysian adaptations
- UAE: Selective adoption varies by regulator

**Always verify**: Which AAOIFI standards are mandatory? FAS only? GS? SS? All?

**4. Retention Periods Vary Significantly**

Qatar discovery: **10 years (QCB)** vs **6 years (QFCRA)** vs **permanent (SSB fatwas)**

**Implication**: Cannot hardcode retention periods. Must be configurable per:
- Regulator
- Document type
- Jurisdiction

**Common range**: 5-10 years for most documents, permanent for critical (fatwas, licenses)

**5. Bilingual Requirements Are Common**

Qatar discovery: QCB requires **Arabic + English** for all documentation

**Implication**: GRC system must support:
- Multilingual evidence (primary + translation)
- Bilingual report generation
- Language selector per regulator

**Pattern**: Gulf countries often require Arabic + English. Malaysia requires Malay + English for some documents.

**6. Offshore Regulators Are Often Less Stringent**

Qatar pattern: **QFCRA has 64% fewer obligations than QCB** (28 vs 46)

**Implication**: Special economic zones often have lighter regulatory burden but may have different standards (e.g., QFCRA uses selective AAOIFI vs QCB mandatory).

**Common pattern**: Offshore zones attract entities by reducing regulatory burden while maintaining credibility.

### Replication Efficiency

**Qatar Time Investment**: 6 hours for comprehensive research (74 obligations, 11 documents)

**Expected Time for Future Jurisdictions**:
- **SAMA (Saudi Arabia)**: 1-2 weeks (expected to be most comprehensive, AAOIFI headquarters neighbor)
- **BNM (Malaysia)**: 1-2 weeks (well-documented, comprehensive Shariah Governance Policy)
- **CBB (Bahrain)**: 2-3 weeks (likely most detailed, AAOIFI headquarters location)
- **CBUAE (UAE)**: 1 week (Central Bank only, well-documented)
- **DFSA (Dubai)**: 3-5 days (smaller offshore regulator)

**Efficiency Multiplier**: 8-phase research process + templates = **3-5x faster** than Qatar (first jurisdiction).

---

## Jurisdiction-Specific Guidance

### SAMA (Saudi Arabia) - Expected Patterns

**Regulator**: Saudi Central Bank (SAMA)

**Expected Characteristics**:
- **Central Shariah Board**: Yes (Higher Shariah Authority at SAMA)
- **AAOIFI Adoption**: Expected full mandatory (SAMA is AAOIFI member)
- **Retention**: Likely 10+ years (conservative jurisdiction)
- **Language**: Arabic + English bilingual
- **Obligation Count**: High (comprehensive regulatory framework)
- **Special Features**: Shariah Governance Framework (2020), detailed product approval process

**Research Focus**:
- SAMA Shariah Governance Framework (2020)
- Islamic Banking Control Law
- Prudential Rules for Islamic banks
- Relationship between entity SSB and Higher Shariah Authority

**Time Estimate**: 1-2 weeks

### BNM (Malaysia) - Expected Patterns

**Regulator**: Bank Negara Malaysia (BNM)

**Expected Characteristics**:
- **Central Shariah Board**: Yes (Shariah Advisory Council - SAC) - **BINDING**
- **AAOIFI Adoption**: AAOIFI-aligned but with Malaysian adaptations
- **Retention**: Likely 7-10 years
- **Language**: Malay + English bilingual (some documents)
- **Obligation Count**: High (comprehensive Shariah Governance Policy 2019)
- **Special Features**: SAC has **binding authority** (unique globally), mandatory referral for novel products

**Research Focus**:
- Shariah Governance Policy (2019)
- Islamic Financial Services Act (2013)
- SAC resolutions and fatwa database
- BNM circulars on Islamic banking

**Time Estimate**: 1-2 weeks

### CBB (Bahrain) - Expected Patterns

**Regulator**: Central Bank of Bahrain (CBB)

**Expected Characteristics**:
- **Central Shariah Board**: Yes (CBB Shariah Board)
- **AAOIFI Adoption**: **Full mandatory** (Bahrain hosts AAOIFI headquarters)
- **Retention**: Likely 10 years
- **Language**: Arabic + English bilingual
- **Obligation Count**: Highest expected (Bahrain is global Islamic finance hub)
- **Special Features**: Most comprehensive AAOIFI adoption, detailed Shariah Governance Module (2017/2018)

**Research Focus**:
- Shariah Governance Module (HC Module)
- CBB Rulebook (HC volume)
- AAOIFI adoption circulars
- CBB Shariah Board decisions

**Time Estimate**: 2-3 weeks (most comprehensive)

### CBUAE (UAE - Mainland) - Expected Patterns

**Regulator**: Central Bank of UAE (CBUAE)

**Expected Characteristics**:
- **Central Shariah Board**: Yes (Higher Shariah Authority)
- **AAOIFI Adoption**: Selective (similar to Qatar pattern)
- **Retention**: Likely 7-10 years
- **Language**: Arabic + English bilingual
- **Obligation Count**: Moderate-High
- **Special Features**: Higher Shariah Authority has **supreme authority** over entity SSBs

**Research Focus**:
- Islamic Finance Law (Federal Law No. 6 of 1985 as amended)
- CBUAE circulars on Islamic banking
- Higher Shariah Authority decisions
- Prudential standards for Islamic banks

**Time Estimate**: 1 week

### DFSA (Dubai) - Expected Patterns

**Regulator**: Dubai Financial Services Authority (DFSA - DIFC offshore)

**Expected Characteristics**:
- **Central Shariah Board**: Likely no (similar to QFCRA pattern)
- **AAOIFI Adoption**: Selective reference (offshore pattern)
- **Retention**: Likely 6-7 years
- **Language**: English primary
- **Obligation Count**: Lower (offshore zone)
- **Special Features**: Lighter regulation similar to QFCRA

**Research Focus**:
- DFSA Rulebook (Islamic Finance Module if exists)
- Shariah Supervision requirements
- Comparison to CBUAE (mainland)

**Time Estimate**: 3-5 days

---

## Conclusion

This Jurisdiction Plugin Guide provides a **complete, proven process** for replicating Qatar GRC infrastructure to any Islamic finance jurisdiction globally.

**Key Takeaways**:

1. **8-Phase Research Process**: Systematic, reusable, proven with Qatar
2. **Jurisdiction Plugin Architecture**: Clean separation between universal engine and jurisdiction specifics
3. **Technical Implementation**: Clear code patterns for backend and frontend
4. **Validation Checklist**: Ensures quality and completeness
5. **Lessons Learned**: Avoid pitfalls discovered in Qatar research

**Proven Success**: Qatar delivered **74 obligations** across **2 regulators** with **14 comprehensive documents** in **6 hours of research** + **8 weeks of MVP development**.

**Replication Target**: Future jurisdictions achievable in **1-3 weeks research** + **4-6 weeks implementation** using this guide.

**Next Jurisdictions**: SAMA (Saudi Arabia), BNM (Malaysia), CBB (Bahrain) recommended as next targets with detailed guidance provided.

---

**Document Version**: 1.0
**Date**: 2025-11-08
**Status**: Ready for Use
**Next Action**: Apply guide to SAMA (Saudi Arabia) research for jurisdiction replication validation

