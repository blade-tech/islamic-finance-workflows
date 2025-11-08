# Global GRC Research Process Documentation

**Purpose**: Document the research methodology for Islamic Finance GRC regulatory frameworks to enable replication across jurisdictions

**Date Created**: 2025-11-08
**Status**: Living Document - Updated as process evolves

---

## Overview

This document captures the **complete research process** for discovering regulatory obligations, control requirements, and evidence standards for Islamic Finance jurisdictions. The process was developed while researching Qatar and is designed to be replicated for:
- Saudi Arabia (SAMA)
- Malaysia (BNM)
- Bahrain (CBB)
- UAE (CBUAE + DFSA + ADGM)
- And other jurisdictions

---

## Phase 1: Regulatory Landscape Discovery

### Objective
Identify ALL regulatory bodies governing Islamic finance in the target jurisdiction

### Critical Lesson: Never Assume Single Regulator
Many jurisdictions have multiple regulators:
- **Central Bank** vs. **Special Financial Authority**
- **Onshore** vs. **Offshore/Free Zone** regulators
- **Federal** vs. **State/Emirate** regulators
- **Conventional** vs. **Islamic-Specific** regulators

### Qatar Example
- **QCB** (Qatar Central Bank) - Mainland Qatar, Civil Law
- **QFCRA** (Qatar Financial Centre Regulatory Authority) - QFC Zone, Common Law

### Research Questions
1. What financial regulatory bodies exist in this jurisdiction?
2. Which regulate Islamic finance institutions?
3. What are the boundaries of each regulator's authority?
4. Can an entity be regulated by multiple bodies?
5. Are there special zones with different rules?
6. Is there a central/national Shariah board?

### Research Method
**Step 1**: Search for "[Country] financial regulatory authority"
- Example: "Qatar financial regulatory authority"
- Example: "Saudi Arabia banking regulator"

**Step 2**: Search for "[Country] Islamic finance regulation"
- This reveals Islamic-specific regulators or frameworks

**Step 3**: Search for "[Country] central bank Islamic banking"
- Central banks often have separate Islamic finance rules

**Step 4**: Look for special financial zones
- Search: "[Country] financial free zone"
- Examples: QFC (Qatar), DIFC (Dubai), ADGM (Abu Dhabi)

**Step 5**: Confirm scope
- Create a table of all regulators with jurisdictional boundaries

### Tools Used
- Exa AI search: `mcp__exa__web_search_exa`
- Web search: Standard search tools
- Wikipedia/jurisdiction pages for overview

### Output Template
Create: `[JURISDICTION]_REGULATORY_LANDSCAPE.md`

```markdown
# [Jurisdiction] Regulatory Landscape

## Financial Regulators

### [Regulator 1 Name]
- **Full Name**:
- **Scope**:
- **Islamic Finance Authority**: Yes/No
- **Key Regulations**:
- **Website**:

[Repeat for all regulators]

## Regulatory Boundaries
[When does each regulator apply?]

## Central Shariah Board
[Does the jurisdiction have a national Shariah authority?]
```

---

## Phase 2: Regulatory Document Discovery

### Objective
Locate the PRIMARY regulatory documents for Islamic finance

### Documents to Find

#### Essential Documents
1. **Islamic Banking/Finance Regulations**
   - Main rulebook or act
   - May be separate from conventional banking rules

2. **Shariah Governance Framework**
   - SSB requirements
   - Shariah compliance processes
   - Internal Shariah audit

3. **Prudential/Capital Requirements**
   - Capital adequacy for Islamic banks
   - Risk management requirements
   - Liquidity requirements

4. **Reporting & Disclosure Rules**
   - Periodic reporting to regulator
   - Public disclosure requirements
   - Audit requirements

5. **Product/Contract Guidelines**
   - Approved Islamic finance products
   - Contract requirements
   - Product approval processes

#### Supplementary Documents
- Guidance circulars
- Policy statements
- Consultations
- FAQs
- Templates and forms

### Research Method

**Step 1**: Locate regulator website
- Search: "[Regulator name] official website"
- Navigate to "Regulations" or "Rulebook" section

**Step 2**: Search for Islamic finance regulations
- On-site search: "Islamic finance"
- On-site search: "Shariah"
- Look for dedicated Islamic banking section

**Step 3**: Download or scrape documents
- PDFs: Download to `/research/source-materials/[REGULATOR]/`
- Web pages: Use Firecrawl to scrape content
- Note: Some sites block scraping

**Step 4**: Search for regulatory databases
- Search: "[Country] financial regulations database"
- Look for third-party legal databases (LexisNexis, etc.)

**Step 5**: Find industry guides
- Search: "[Regulator] Islamic finance compliance guide"
- Big 4 (KPMG, PwC, Deloitte, EY) often publish guides
- Law firms publish summaries

**Step 6**: Academic research
- Use Exa AI for academic papers
- Search: "[Country] Islamic finance regulation analysis"
- Google Scholar: "[Regulator] Shariah governance"

### Tools Used
- **Firecrawl Scrape**: `mcp__firecrawl__firecrawl_scrape`
  - For scraping regulator websites
  - For downloading web-based rulebooks

- **Firecrawl Search**: `mcp__firecrawl__firecrawl_search`
  - For finding documents on regulator sites

- **Exa AI**: `mcp__exa__web_search_exa`
  - For academic and industry research
  - For finding compliance guides

- **Web Search**: Standard search
  - For general queries and verification

### Output
- Downloaded PDFs in `/research/source-materials/[REGULATOR]/`
- Scraped web content in markdown format
- Bibliography of sources

### Qatar Example - QFCRA

**Documents Found**:
1. QFCRA Islamic Finance Rules (IFR) - Web-based rulebook
2. QFCRA Governance & Controlled Functions Rules
3. QFCRA Prudential Returns Rules
4. Industry guides from Big 4 on QFCRA compliance

**Documents Found - QCB** (In Progress):
1. QCB Islamic Banking Regulations
2. QCB Shariah Governance Framework
3. QCB Guidelines on Internal Shariah Audit
4. QCB Prudential Regulations for Islamic Banks

---

## Phase 3: Obligation Extraction

### Objective
Extract EVERY regulatory obligation from discovered documents

### Extraction Method

**Step 1**: Identify obligation-bearing language
Look for keywords:
- "must", "shall", "required", "mandatory"
- "prohibited", "not permitted"
- "ensure", "maintain", "establish"
- "within [timeframe]"
- "report to [regulator]"

**Step 2**: Categorize obligations
Use standard categories:
1. Shariah Governance
2. Product Approval
3. Documentation & Evidence
4. Regulatory Reporting
5. Audit & Assurance
6. SNCR & Remediation
7. Customer Protection
8. Capital & Prudential
9. Risk Management
10. Operational Requirements

**Step 3**: Structure each obligation
For each obligation, document:
- **ID**: Unique identifier (OBL-[REGULATOR]-###)
- **Source**: Exact citation (regulation, chapter, article, section)
- **Requirement**: What must be done (exact or paraphrased)
- **Applicability**: Who must comply (all IFIs? specific types?)
- **Frequency**: One-time, ongoing, periodic (daily/monthly/quarterly/annual)
- **Timeline**: Deadlines or timeframes
- **Evidence Required**: What proves compliance
- **Penalty**: Consequences for non-compliance (if stated)
- **Related Standards**: AAOIFI, IFSB, ISO references
- **Related Controls**: From our 26 control library

**Step 4**: Cross-reference
- Link obligations to each other (dependencies)
- Map to AAOIFI standards
- Map to IFSB standards
- Map to ISO 37301 categories

### Tools Used
- Manual extraction from PDFs/documents
- Text search for obligation keywords
- Spreadsheet or structured markdown for tracking

### Output Template
Create: `[REGULATOR]_OBLIGATIONS_CATALOG.md`

Structure:
```markdown
# [Regulator] Obligations Catalog

## Summary Statistics
- Total Obligations: [N]
- Mandatory: [N]
- Advisory: [N]
- Categories: [N]

## Obligation Categories
1. [Category 1] - [N obligations]
2. [Category 2] - [N obligations]
...

## Detailed Obligations

### Category: [Category Name]

#### OBL-[REG]-001: [Obligation Title]
- **Source**: [Regulation] Chapter [X], Article [Y], Section [Z]
- **Requirement**:
  [Exact text or clear paraphrase]

- **Applicability**:
  [All Islamic finance institutions? Specific product types? Size threshold?]

- **Frequency**:
  [One-time / Ongoing / Periodic (specify: daily, monthly, quarterly, annual)]

- **Timeline**:
  [Deadlines: e.g., "Within 3 months of year-end", "Within 1 business day of event"]

- **Evidence Required**:
  [What documentation/proof is needed to demonstrate compliance?]

- **Penalty for Non-Compliance**:
  [Fines, sanctions, license revocation - if stated in regulation]

- **Related AAOIFI Standard**:
  [e.g., "GS-1 Shariah Supervisory Board", "FAS-1 General Presentation"]

- **Related IFSB Standard**:
  [e.g., "IFSB-10 Shariah Governance", "IFSB-1 Risk Management"]

- **Related Controls** (from 26-control library):
  [e.g., "Bucket 1, Control 1: SSB Appointment & Independence"]

- **Implementation Notes**:
  [Practical guidance, ambiguities, interpretation issues]

[Repeat for ALL obligations]
```

### Qatar Example - QFCRA

**Obligations Extracted**: 28 detailed obligations across 8 categories
- Shariah Governance: 6 obligations
- Disclosure & Transparency: 4 obligations
- Capital Adequacy: 3 obligations
- Regulatory Reporting: 5 obligations
- Operational Risk: 3 obligations
- Internal Shariah Review: 3 obligations
- Record Keeping: 2 obligations
- Islamic Windows: 2 obligations

---

## Phase 4: Shariah Governance Framework Documentation

### Objective
Document the complete SSB governance model required by the regulator

### Research Questions

1. **SSB Requirement**
   - Is SSB mandatory? Optional? Product-dependent?
   - Minimum/maximum number of members?
   - Qualification requirements for members?

2. **SSB Composition**
   - Must members be Shariah scholars? Jurists? Both?
   - Educational requirements (degree level, specialization)?
   - Experience requirements (years, prior SSB service)?
   - Diversity requirements (madhahib, geography)?

3. **SSB Independence**
   - Conflict of interest rules
   - Maximum number of simultaneous SSB positions
   - Cooling-off periods
   - Related party restrictions
   - Remuneration disclosure

4. **SSB Decision-Making**
   - Quorum requirements
   - Voting procedures (majority? unanimous? supermajority?)
   - Dissent recording requirements
   - Decision documentation requirements
   - Meeting frequency minimums

5. **SSB Reporting**
   - To regulator: What? When? How?
   - To board: What? When? How?
   - To public: What? When? How?
   - SSB annual report requirements

6. **Internal Shariah Compliance**
   - Shariah compliance officer/department requirements
   - Reporting line to SSB
   - Responsibilities and authorities
   - Qualifications

7. **Central/National Shariah Board**
   - Does jurisdiction have central Shariah authority?
   - Relationship between entity SSB and central board
   - Referral or escalation requirements
   - Binding vs. advisory nature of central rulings

### Output Template
Create: `[REGULATOR]_SSB_GOVERNANCE_MODEL.md`

Structure:
```markdown
# [Regulator] Shariah Supervisory Board Governance Model

## SSB Requirement
- **Mandatory**: Yes/No
- **Minimum Size**: [N members]
- **Maximum Size**: [N members or "No limit"]
- **Source**: [Regulation citation]

## SSB Member Qualifications
### Education
[Requirements]

### Experience
[Requirements]

### Competencies
[Technical, Shariah, financial, etc.]

## SSB Composition Requirements
[Diversity, specialization, etc.]

## SSB Independence & Conflicts
### Conflict of Interest Rules
[Detailed requirements]

### Maximum Positions
[How many SSB seats can one scholar hold?]

### Cooling-Off Periods
[Time required between leaving entity and joining SSB]

### Related Party Restrictions
[Can SSB members have relationships with entity?]

## SSB Decision-Making Process
### Quorum
[Minimum members for valid decisions]

### Voting
[Majority? Unanimous? Procedures?]

### Dissent Recording
[How are disagreements documented?]

### Decision Documentation
[What must be recorded for each decision?]

### Meeting Frequency
[Minimum meetings per year]

## SSB Reporting Requirements

### To Regulator
- **Frequency**: [Annual? Quarterly? Event-driven?]
- **Content**: [What must be included?]
- **Deadline**: [When is it due?]
- **Format**: [Template? Free-form?]
- **Source**: [Regulation citation]

### To Board of Directors
[Requirements]

### To Public
[Requirements]

### SSB Annual Report
[Detailed requirements for annual opinion/report]

## Internal Shariah Compliance Function

### Requirement
- **Mandatory**: Yes/No
- **Reporting Line**: [To SSB? To CEO? Dual reporting?]
- **Source**: [Regulation citation]

### Responsibilities
[Detailed list]

### Qualifications
[Requirements for Shariah compliance officer/staff]

### Resources
[Minimum staffing, budget, access rights]

## Central/National Shariah Board

### Existence
- **Central Shariah Authority**: Yes/No
- **Name**: [If applicable]
- **Legal Status**: [Advisory? Regulatory? Judicial?]

### Relationship to Entity SSB
[How do central board and entity SSB interact?]

### Referral Requirements
[When must entity SSB refer to central board?]

### Binding Nature
[Are central board rulings binding on entity SSBs?]

## Comparison to AAOIFI Standards

### AAOIFI GS-1 (Shariah Supervisory Board)
[How does regulator align with/deviate from GS-1?]

### AAOIFI GS-18 (Shariah Decision-Making Process)
[How does regulator align with/deviate from GS-18?]

### Key Similarities
[List]

### Key Differences
[List]

## Implementation Roadmap

### Immediate (Month 1)
- [ ] [Task]
- [ ] [Task]

### Short-term (Months 2-3)
- [ ] [Task]

### Medium-term (Months 4-6)
- [ ] [Task]

## Risk & Compliance Considerations
[Practical guidance for implementation]
```

---

## Phase 5: Evidence Standards Documentation

### Objective
Document what evidence/documentation is required for compliance

### Research Questions

1. **Product Approval Evidence**
   - What must be documented for SSB product approvals?
   - What format (fatwa, resolution, memo)?
   - What retention period?

2. **Transaction Evidence**
   - What must be documented for each transaction type?
   - Different requirements by product (Murabaha vs. Sukuk)?
   - Asset ownership/possession evidence?

3. **SSB Decision Evidence**
   - Meeting minutes requirements
   - Decision documentation
   - Dissent recording
   - Voting records

4. **SNCR Event Evidence**
   - Incident detection documentation
   - Investigation records
   - Remediation actions
   - Purification documentation

5. **Regulatory Reporting Evidence**
   - What proves accuracy of submitted reports?
   - Audit trails for regulatory data

6. **Retention Requirements**
   - How long must each document type be retained?
   - Physical vs. electronic storage
   - Destruction requirements

7. **Format Requirements**
   - Must documents be signed? By whom?
   - Digital vs. physical originals
   - Can blockchain/hash proofs be used?
   - Acceptable file formats

8. **Inspection Readiness**
   - What must be available for regulator inspections?
   - How quickly must it be produced?
   - Organization/indexing requirements

### Output Template
Create: `[REGULATOR]_EVIDENCE_STANDARDS.md`

---

## Phase 6: Reporting Requirements Documentation

### Objective
Map ALL reporting obligations to the regulator and other stakeholders

### Research Questions

1. **Periodic Reports** (scheduled, recurring)
   - What reports? (Financial, prudential, statistical, governance)
   - Frequency? (Daily, weekly, monthly, quarterly, annual)
   - Content requirements?
   - Deadlines?
   - Templates/formats?

2. **Event-Driven Reports** (triggered by events)
   - What events trigger reporting?
   - Timeline for reporting?
   - Content requirements?

3. **SSB Reports**
   - SSB annual report requirements
   - SSB quarterly/periodic updates
   - Product approval notifications

4. **Public Disclosures**
   - What must be disclosed publicly?
   - Where? (Website, annual report, news)
   - When?

5. **Penalties for Non-Reporting**
   - Fines for late submission
   - Sanctions for incomplete/inaccurate reports

### Output Template
Create: `[REGULATOR]_REPORTING_REQUIREMENTS.md`

---

## Phase 7: AAOIFI/IFSB Alignment Analysis

### Objective
Document how regulator aligns with or deviates from international standards

### Research Questions

1. **AAOIFI Adoption**
   - Which AAOIFI standards are explicitly mandatory?
   - Which are implicitly required (industry practice)?
   - Which are optional/advisory?
   - Accounting (FAS series)
   - Shariah (SS series)
   - Governance (GS series)
   - Auditing (ASIFI series)

2. **IFSB Adoption**
   - Which IFSB standards are referenced?
   - Capital adequacy frameworks
   - Risk management frameworks
   - Governance frameworks

3. **Deviations**
   - Where does regulator deviate from AAOIFI/IFSB?
   - Why? (Local preferences, stricter requirements, etc.)

4. **Conflict Resolution**
   - When regulator and AAOIFI conflict, which prevails?
   - Hierarchy of authority

### Output Template
Create: `[REGULATOR]_AAOIFI_ALIGNMENT.md`

---

## Phase 8: Integration & Synthesis

### Objective
Create unified framework for jurisdiction

### Outputs

1. **Unified Obligations Register**
   - Merge obligations from all regulators in jurisdiction
   - Tag by regulator
   - Remove duplicates
   - Identify conflicts

2. **Control Activation Rules**
   - Map obligations to 26 controls
   - Identify which controls are mandatory
   - Identify jurisdiction-specific controls

3. **Evidence Matrix**
   - Cross-reference evidence requirements across all obligations

4. **Reporting Calendar**
   - Unified calendar of all reporting deadlines
   - Organized by frequency and deadline

5. **Comparative Analysis**
   - If multiple regulators: Compare requirements
   - Document when each regulator applies

---

## Tools & Resources Reference

### MCP Tools Used

1. **Exa AI Web Search** (`mcp__exa__web_search_exa`)
   - Best for: Academic research, industry analyses
   - Use when: Need authoritative sources, compliance guides

2. **Firecrawl Scrape** (`mcp__firecrawl__firecrawl_scrape`)
   - Best for: Scraping regulator websites, extracting rulebook content
   - Use when: Documents are web-based, not downloadable PDFs
   - Note: Some sites block scraping

3. **Firecrawl Search** (`mcp__firecrawl__firecrawl_search`)
   - Best for: Finding documents on regulator sites
   - Use when: Navigating complex regulatory websites

4. **Web Search** (standard)
   - Best for: General queries, finding regulator websites
   - Use when: Starting research, need overview

### Research Databases

- Regulator official websites
- Central bank websites
- Financial services authority websites
- Legal databases (LexisNexis, Westlaw - if accessible)
- Academic databases (Google Scholar, SSRN)

### Industry Resources

- Big 4 compliance guides (KPMG, PwC, Deloitte, EY)
- Law firm publications
- Industry associations (AAOIFI, IFSB, IIFM)
- Academic journals (ISRA, INCEIF, etc.)

---

## Quality Assurance Checklist

Before marking research complete, verify:

- [ ] All regulators in jurisdiction identified
- [ ] Primary regulatory documents located and saved
- [ ] Obligations catalog is exhaustive (every "must"/"shall" captured)
- [ ] SSB governance model is complete
- [ ] Evidence requirements are clear for each obligation type
- [ ] Reporting calendar includes all periodic and event-driven reports
- [ ] AAOIFI/IFSB alignment is documented
- [ ] Source citations are precise (chapter, article, page)
- [ ] Documents are saved to `/research/source-materials/`
- [ ] All five core documents created per regulator
- [ ] Comparative analysis created (if multiple regulators)

---

## Replication Guide

### To Research a New Jurisdiction

1. **Create jurisdiction directory**
   ```
   mkdir -p /[jurisdiction]-grc-infrastructure/research/source-materials
   ```

2. **Copy this process document**
   - Use as checklist
   - Adapt as needed for jurisdiction specifics

3. **Follow phases sequentially**
   - Phase 1: Regulatory landscape
   - Phase 2: Document discovery
   - Phase 3: Obligation extraction
   - Phase 4: SSB governance
   - Phase 5: Evidence standards
   - Phase 6: Reporting requirements
   - Phase 7: AAOIFI/IFSB alignment
   - Phase 8: Integration

4. **Document as you go**
   - Update tracker after each phase
   - Note challenges and solutions
   - Capture lessons learned

5. **Use Qatar as reference**
   - Compare to Qatar findings
   - Note similarities and differences
   - Use Qatar templates as starting point

---

## Lessons Learned (Ongoing)

### Lesson 1: Multi-Regulator Jurisdictions
**Discovery**: Qatar has QCB (mainland) and QFCRA (QFC zone)
**Impact**: System must support multi-regulator jurisdictions
**Solution**: Regulatory selector in jurisdiction plugin

### Lesson 2: Document Availability
**Discovery**: Some regulators have web-based rulebooks, others have PDFs
**Impact**: Scraping may or may not work
**Solution**: Try Firecrawl first, fall back to manual extraction

### Lesson 3: AAOIFI Adoption Varies
**Discovery**: QFCRA selectively references AAOIFI; QCB may fully mandate it
**Impact**: Can't assume AAOIFI is always mandatory
**Solution**: Document AAOIFI adoption explicitly for each regulator

[More lessons to be added as research continues]

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-08 | Initial process documentation | Sonnet 4.5 |
| 1.1 | 2025-11-08 | Added multi-regulator lesson | Sonnet 4.5 |

---

*This document will be continuously updated as we research additional jurisdictions and refine the process.*
