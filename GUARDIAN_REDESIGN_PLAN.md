# Guardian Policy Execution Platform - Redesign Plan

**Platform Name**: ZeroH
**Purpose**: AI-powered wizard for Hedera Guardian policy execution
**Alignment**: AG-UI protocol + Guardian methodology digitization lifecycle
**Last Updated**: 2025-11-04

---

## Executive Summary

Transform the Islamic Finance Workflows application from a **document generation tool** into a **Guardian policy execution platform** that guides users through the complete lifecycle:

1. **Design** - Configure policy from methodologies
2. **Test** - Dry run execution in sandbox
3. **Execute** - Deploy to Guardian and execute on Hedera blockchain
4. **Monitor** - Track ongoing execution and analytics

### Key Principles

- **Guardian-First Architecture**: All workflows map to Guardian policies and schemas
- **AG-UI Protocol Alignment**: AI agents wizard users at every checkpoint
- **Mock-Then-Real**: Phase 4A uses mocks, Phase 4B integrates real Guardian MCP
- **User-Friendly Terminology**: Hide technical complexity, explicit about blockchain
- **Pre-Ingested Standards**: AAOIFI/IIFM available by default (no user uploads)
- **Dynamic UI Generation**: Forms and dashboards rendered from Guardian Source of Truth

---

## Terminology Framework

### User-Facing (Simple, Intuitive)
- **Platform**: "ZeroH" (never "Guardian" unless explaining blockchain)
- **Methodologies**: "Templates" (e.g., "Sukuk Template", "Murabaha Template")
- **Policies**: "Workflows" (e.g., "Sukuk Workflow")
- **Dry Run**: "Test Run" or "Simulation"
- **Policy Steps**: "Workflow Steps"
- **Hedera Blockchain**: **Explicitly mentioned** for transparency and verification
- **Standards**: Just mention "AAOIFI" or "IIFM" (users know these)

### Technical (Hidden from UI, used in code)
- Guardian (policy engine)
- HCS (Hedera Consensus Service)
- Guardian Indexer
- Guardian Schemas
- MCP (Model Context Protocol)
- Source of Truth

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ZeroH Platform                          │
│                  (Islamic Finance Workflows)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐            ┌──────▼──────┐
         │   Frontend   │            │   Backend   │
         │  (Next.js)   │────────────│  (FastAPI)  │
         └──────┬──────┘            └──────┬──────┘
                │                           │
         ┌──────▼──────────────┐    ┌──────▼──────────────┐
         │  AG-UI Components   │    │  Guardian MCP       │
         │  - AI Wizards       │    │  - 10+ Tools        │
         │  - Dynamic Forms    │    │  - Policy CRUD      │
         │  - Dashboards       │    │  - Dry Run          │
         └─────────────────────┘    └──────┬──────────────┘
                                            │
                                  ┌─────────▼─────────┐
                                  │ Hedera Guardian   │
                                  │ Policy Engine     │
                                  └─────────┬─────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                  ┌─────▼─────┐     ┌──────▼──────┐    ┌──────▼──────┐
                  │  Guardian  │     │   Guardian   │    │   Hedera    │
                  │  Schemas   │     │   Indexer    │    │  Blockchain │
                  │            │     │ (Source of   │    │             │
                  │            │     │   Truth)     │    │             │
                  └────────────┘     └──────────────┘    └─────────────┘
```

---

## Workflow Transformation Map

### Current Flow (Document Generation)
```
Step 1: Source Connection → AAOIFI upload
Step 2: Workflow Selection → Template selection
Step 3: Context Upload → User documents
Step 4: [Missing] → Configuration
Step 5: Live Execution → Claude generates document
Step 6: Citation Verification → Check sources
Step 7: Outcome & Download → PDF/DOCX export
Step 8: Learning Capture → Feedback loop
```

### New Flow (Guardian Policy Execution)
```
Step 1: Select Template → Methodology selection (was Step1_5)
Step 2: Configure Details → Policy configuration (dynamic forms)
Step 3: Test Workflow → Dry run in sandbox
Step 4: Validate Compliance → AAOIFI/IIFM check + AI review
Step 5: Launch & Execute → Deploy to Guardian + Hedera Blockchain
Step 6: Monitor & Review → Real-time dashboard + role-specific PDFs
Step 7: Improve & Learn → Feedback loop for template refinement
```

---

## Step-by-Step Specifications

### **Step 1: Select Template**
**User-Facing Title**: "Select Template"
**Technical Mapping**: Methodology Selection (Guardian policies)

#### What User Sees
```
┌────────────────────────────────────────────────────────────┐
│  Select Template                                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Choose a template for your Islamic finance workflow:     │
│                                                            │
│  🔍 [Search templates...]                                 │
│                                                            │
│  Filters: [All] [Sukuk] [Murabaha] [Ijarah]              │
│                                                            │
│  ┌──────────────────────────────────────────────┐         │
│  │ 🏦 Sukuk Issuance                            │         │
│  │ Complete workflow for issuing Sukuk bonds    │         │
│  │                                              │         │
│  │ ✓ AAOIFI FAS 33 compliant                   │         │
│  │ ✓ 12 workflow steps                         │         │
│  │ ✓ Recorded on Hedera Blockchain             │         │
│  │                                              │         │
│  │ Roles: Issuer, Auditor, Shariah Advisor     │         │
│  │                                              │         │
│  │              [Select Template]               │         │
│  └──────────────────────────────────────────────┘         │
│                                                            │
│  ┌──────────────────────────────────────────────┐         │
│  │ 🏪 Murabaha Purchase Agreement               │         │
│  │ Cost-plus financing for asset purchases      │         │
│  │ ...                                          │         │
│  └──────────────────────────────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### AI Agent Assistance
- **Hover explanations**: "Sukuk are Shariah-compliant bonds that represent ownership"
- **Recommendations**: "Based on your organization, we recommend starting with Murabaha"
- **Search assist**: Natural language → filter by AAOIFI standard

#### Technical Implementation
- **Component**: Step1_5MethodologySelection (renamed to Step1SelectTemplate)
- **Data Source**: GET /api/methodologies (mock in 4A, Guardian MCP in 4B)
- **Selection**: Single or multi-select (combine templates)
- **Backend Call**: POST /api/workflows/generate-from-methodologies
- **Output**: WorkflowTemplate with Guardian policy structure

#### Success Criteria
- User selects template in <30 seconds
- Template preview shows all required roles and steps
- "AAOIFI" standards referenced (not "upload AAOIFI docs")

---

### **Step 2: Configure Details**
**User-Facing Title**: "Configure Workflow Details"
**Technical Mapping**: Dynamic form generation from Guardian schemas

#### What User Sees
```
┌────────────────────────────────────────────────────────────┐
│  Configure Workflow Details                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Sukuk Issuance Workflow                                  │
│                                                            │
│  ━━━ Basic Information ━━━                                │
│                                                            │
│  Issuer Name:                                             │
│  [                    ] 💡 AI: "ABC Islamic Bank"         │
│                                                            │
│  Sukuk Type:                                              │
│  [Ijarah Sukuk     ▼] 💡 AI: Common for real estate       │
│                                                            │
│  Total Issue Amount (USD):                                │
│  [                    ] 💡 AI: Typical range: $100M-500M  │
│                                                            │
│  ━━━ Compliance & Standards ━━━                          │
│                                                            │
│  ✓ AAOIFI FAS 33 - Sukuk (auto-applied)                  │
│  ✓ IIFM Sukuk Standards (auto-applied)                   │
│                                                            │
│  ━━━ Role Assignments ━━━                                │
│                                                            │
│  Shariah Advisor: [Assign...] 💡 AI: Role required       │
│  Auditor:         [Assign...] 💡 AI: Role required       │
│  Issuer:          [You      ] ✓                          │
│                                                            │
│  ━━━ Upload Supporting Documents (Optional) ━━━          │
│                                                            │
│  📄 [Upload] Financial Statements                         │
│  📄 [Upload] Asset Valuation Reports                      │
│                                                            │
│                           [Next: Test Workflow]           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### AI Agent Assistance
- **Auto-fill suggestions**: Extract from user's previous workflows
- **Validation**: "Issue amount must be >$1M for AAOIFI compliance"
- **Role matching**: Suggest users from organization based on credentials
- **Document analysis**: AI reads uploaded PDFs and pre-fills forms

#### Technical Implementation
- **Forms Generated From**: Guardian schema definitions (via MCP)
- **Data Source**: Guardian policy schema → Dynamic JSON forms
- **Validation**: Real-time validation against AAOIFI rules
- **Backend Storage**: Saved to WorkflowExecution.user_notes
- **AI Integration**: Claude analyzes uploads, suggests values

#### Success Criteria
- Forms render dynamically from Guardian schemas
- AI pre-fills 50%+ of fields correctly
- Validation errors shown before user advances
- No mention of "Guardian" or "policy" in UI

---

### **Step 3: Test Workflow**
**User-Facing Title**: "Test Workflow"
**Technical Mapping**: Guardian dry run execution

#### What User Sees
```
┌────────────────────────────────────────────────────────────┐
│  Test Workflow                                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Before launching, let's test your Sukuk workflow:        │
│                                                            │
│  ━━━ Simulation Environment ━━━                           │
│                                                            │
│  💡 This test runs in a sandbox - nothing is recorded     │
│     on the Hedera Blockchain yet.                         │
│                                                            │
│  [▶ Start Test Run]                                       │
│                                                            │
│  ━━━ Test Progress ━━━                                    │
│                                                            │
│  ✓ Step 1: Issuer submits application         (2s)       │
│  ✓ Step 2: Shariah board review              (5s)       │
│  ⏳ Step 3: Asset valuation...                           │
│  ⏸ Step 4: Auditor verification                          │
│  ⏸ Step 5: Sukuk structure approval                      │
│  ...                                                      │
│                                                            │
│  ━━━ Live Validation ━━━                                 │
│                                                            │
│  ✅ AAOIFI FAS 33 compliance: PASSED                      │
│  ✅ All required roles assigned: PASSED                   │
│  ⚠️  Asset value verification: PENDING                    │
│     💡 AI: "Asset valuation report needs Shariah         │
│            advisor signature"                             │
│                                                            │
│  [View Detailed Log] [Stop Test] [Run Again]             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### AI Agent Assistance
- **Predictive issues**: "Step 4 will likely fail - missing document X"
- **Fix suggestions**: "Add Shariah signature here to pass validation"
- **Performance insights**: "This workflow typically takes 2-3 days in production"

#### Technical Implementation
- **Guardian MCP Tool**: execute-dry-run(policy_id, test_data)
- **Streaming**: SSE stream of dry run execution events
- **Validation**: Real-time AAOIFI/IIFM checks during execution
- **Mock Data**: Phase 4A uses simulated Guardian responses
- **Rollback**: Dry run state discarded after test

#### Success Criteria
- Test completes in <60 seconds
- User sees each step execute in real-time
- Validation errors shown with AI fix suggestions
- "Blockchain" not mentioned (only in next step)

---

### **Step 4: Validate Compliance**
**User-Facing Title**: "Validate Compliance"
**Technical Mapping**: AAOIFI/IIFM validation + AI review

#### What User Sees
```
┌────────────────────────────────────────────────────────────┐
│  Validate Compliance                                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Compliance Check Results:                                │
│                                                            │
│  ━━━ AAOIFI Standards ━━━                                 │
│                                                            │
│  ✅ FAS 33 - Investment Sukuk                             │
│     All requirements met                                  │
│                                                            │
│  ✅ Shariah Governance Standard 1/2018                    │
│     Shariah board properly configured                     │
│                                                            │
│  ━━━ IIFM Standards ━━━                                   │
│                                                            │
│  ✅ IIFM Sukuk Product Guide                              │
│     Structure complies with Ijarah principles             │
│                                                            │
│  ━━━ AI Review ━━━                                        │
│                                                            │
│  🤖 AI Compliance Advisor:                                │
│                                                            │
│  "I've analyzed your Sukuk structure against 247         │
│  AAOIFI standards. Here are my findings:                 │
│                                                            │
│  ✅ Asset ownership transfer: Compliant                   │
│  ✅ Profit distribution mechanism: Compliant              │
│  ⚠️  Minor issue: Maturity date falls on Friday          │
│      💡 Recommendation: Adjust to Thursday to align       │
│         with Islamic calendar best practices"             │
│                                                            │
│  [View Full Report] [Accept Recommendations]              │
│                                                            │
│  ━━━ Shariah Advisor Approval ━━━                        │
│                                                            │
│  Awaiting approval from: Dr. Ahmed Al-Mansouri           │
│  [✓] I confirm this structure is Shariah-compliant       │
│                                                            │
│  [Send for Approval] [Next: Launch Workflow]             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### AI Agent Assistance
- **Deep validation**: AI reads full AAOIFI standards from Graphiti
- **Risk assessment**: "This structure has 12% higher default risk than average"
- **Shariah nuances**: "Some scholars prefer avoiding Friday maturities"
- **Citation linking**: Click any standard → view full AAOIFI text

#### Technical Implementation
- **Data Source**: AAOIFI/IIFM from Graphiti (pre-ingested)
- **AI Validation**: Claude analyzes workflow against standards
- **Approval Flow**: Human-in-loop checkpoint for Shariah advisor
- **Backend**: POST /api/workflows/{id}/validate-compliance
- **Storage**: Validation report saved to execution log

#### Success Criteria
- All AAOIFI standards checked automatically
- AI provides natural language explanation (not just ✓/✗)
- Human Shariah advisor can override AI
- Users understand WHY something is compliant

---

### **Step 5: Launch & Execute**
**User-Facing Title**: "Launch & Execute on Hedera Blockchain"
**Technical Mapping**: Guardian policy deployment + HCS recording

#### What User Sees
```
┌────────────────────────────────────────────────────────────┐
│  Launch & Execute on Hedera Blockchain                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ⚠️  IMPORTANT: This will record your workflow on the     │
│      Hedera Blockchain for permanent transparency.        │
│                                                            │
│  What happens when you launch:                            │
│                                                            │
│  1. Workflow structure → Hedera Blockchain                │
│  2. All participants notified via HCS messages            │
│  3. Each workflow step → Blockchain transaction           │
│  4. Permanent audit trail created                         │
│                                                            │
│  ━━━ Blockchain Details ━━━                               │
│                                                            │
│  Network:        Hedera Mainnet                           │
│  Topic ID:       0.0.123456 (will be assigned)            │
│  Consensus:      Hashgraph (3-5 second finality)          │
│  Participants:   4 roles assigned                         │
│                                                            │
│  Estimated Cost: ~$0.50 USD (in HBAR)                     │
│                  💡 AI: "Typical Sukuk workflows cost     │
│                          $0.30-$1.20"                      │
│                                                            │
│  ━━━ Launch Confirmation ━━━                              │
│                                                            │
│  [✓] I understand this will be recorded on Hedera        │
│      Blockchain and cannot be deleted                     │
│                                                            │
│  [✓] I have reviewed all compliance checks                │
│                                                            │
│  [✓] All required approvals obtained                      │
│                                                            │
│            [🚀 Launch Workflow on Blockchain]             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**After Launch:**
```
┌────────────────────────────────────────────────────────────┐
│  Workflow Executing on Hedera Blockchain                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Blockchain Transaction ID: 0.0.123456@1699564800.123     │
│  [View on HashScan] ↗                                     │
│                                                            │
│  ━━━ Live Execution ━━━                                   │
│                                                            │
│  ✅ Step 1: Application submitted                         │
│     Blockchain TX: 0.0.123456@1699564801.001 ↗            │
│     Timestamp: 2024-11-04 10:23:15 UTC                    │
│                                                            │
│  ⏳ Step 2: Shariah board review in progress...           │
│     Assigned to: Dr. Ahmed Al-Mansouri                    │
│     Notified via: HCS message (confirmed)                 │
│                                                            │
│  ⏸ Step 3: Asset valuation (pending)                      │
│  ⏸ Step 4: Auditor verification (pending)                 │
│  ...                                                      │
│                                                            │
│  [Pause Workflow] [View Blockchain Audit Trail]           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### AI Agent Assistance
- **Cost prediction**: "This workflow will cost ~$0.50 based on 12 steps"
- **Performance insights**: "Average Sukuk execution: 3-5 days"
- **Participant alerts**: "All 4 participants notified via Hedera HCS"
- **Blockchain links**: Direct links to HashScan explorer

#### Technical Implementation
- **Guardian MCP Tool**: deploy-policy(policy_id, mainnet=true)
- **Hedera Integration**: Guardian → HCS topic → Blockchain
- **Streaming**: SSE stream of execution events from Guardian
- **Audit Trail**: Every step recorded with blockchain TX ID
- **Verification**: Links to HashScan for public verification

#### Success Criteria
- User explicitly confirms blockchain recording
- Hedera Blockchain mentioned 3+ times in UI
- Every workflow step has blockchain TX ID
- Users can verify on HashScan independently

---

### **Step 6: Monitor & Review**
**User-Facing Title**: "Monitor & Review"
**Technical Mapping**: Guardian Indexer + dynamic dashboard rendering

#### What User Sees
```
┌────────────────────────────────────────────────────────────┐
│  Monitor & Review                                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Sukuk Issuance Workflow                                  │
│  Status: In Progress (Step 5/12)                          │
│  On Hedera Blockchain: Topic 0.0.123456                   │
│                                                            │
│  ━━━ Executive Dashboard ━━━                              │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ Progress         │  │ Time Elapsed     │              │
│  │ ████████░░░░ 42% │  │ 2 days, 4 hours  │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ Blockchain TXs   │  │ Compliance Score │              │
│  │ 23 recorded      │  │ 98/100 ✅        │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                            │
│  ━━━ Workflow Timeline ━━━                                │
│                                                            │
│  ✅ Nov 1, 10:00 - Application submitted                  │
│     [View Details] [Blockchain TX ↗]                      │
│                                                            │
│  ✅ Nov 1, 14:30 - Shariah board approved                 │
│     Approver: Dr. Ahmed Al-Mansouri                       │
│     [View Approval] [Blockchain TX ↗]                     │
│                                                            │
│  ⏳ Nov 4, 09:15 - Asset valuation in progress            │
│     Assigned: ABC Appraisal Co.                           │
│     💡 AI: "Typically takes 1-2 days"                     │
│                                                            │
│  ━━━ Role-Specific Reports ━━━                            │
│                                                            │
│  📄 [Download] Shariah Department Report (PDF)            │
│  📄 [Download] Legal & Compliance Report (PDF)            │
│  📄 [Download] Back Office Summary (PDF)                  │
│  📄 [Download] Management Executive Summary (PDF)         │
│                                                            │
│  ━━━ AI Insights ━━━                                      │
│                                                            │
│  🤖 "Your workflow is progressing 15% faster than         │
│      average Sukuk issuances. Asset valuation is the      │
│      current bottleneck - consider parallel processing    │
│      for future workflows."                               │
│                                                            │
│  [View Full Blockchain Audit Trail ↗]                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### AI Agent Assistance
- **Predictive analytics**: "Step 7 likely to complete by Nov 6"
- **Bottleneck detection**: "Asset valuation is delaying workflow"
- **Optimization suggestions**: "Parallel processing could save 2 days"
- **Anomaly alerts**: "Unusual: Shariah approval took 4 hours (avg: 2h)"

#### Technical Implementation
- **Data Source**: Guardian Indexer (Source of Truth)
- **Dynamic Dashboard**: AI renders dashboard from Guardian state
- **Real-Time Updates**: WebSocket or SSE from Guardian
- **PDF Generation**: Role-specific reports from execution log
- **Blockchain Links**: Every event links to HashScan TX

#### Success Criteria
- Dashboard updates in real-time (<5 second latency)
- 4+ role-specific PDFs downloadable
- Users can verify every step on Hedera Blockchain
- AI provides actionable insights (not just status)

---

### **Step 7: Improve & Learn**
**User-Facing Title**: "Improve & Learn"
**Technical Mapping**: Feedback loop + template refinement

#### What User Sees
```
┌────────────────────────────────────────────────────────────┐
│  Improve & Learn                                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Help us improve the Sukuk Issuance template:             │
│                                                            │
│  ━━━ Your Feedback ━━━                                    │
│                                                            │
│  How was your experience? ⭐⭐⭐⭐⭐                         │
│                                                            │
│  What worked well:                                        │
│  [                                              ]          │
│                                                            │
│  What could be improved:                                  │
│  [                                              ]          │
│                                                            │
│  ━━━ AI-Detected Improvements ━━━                         │
│                                                            │
│  🤖 "I noticed you manually corrected the asset           │
│      valuation amount 3 times. Should I suggest           │
│      this validation rule for future workflows?"          │
│                                                            │
│  Proposed change:                                         │
│  "Asset valuation must be within 5% of purchase price"   │
│                                                            │
│  [✓ Apply to Template] [✗ Ignore]                        │
│                                                            │
│  ━━━ Template Evolution ━━━                               │
│                                                            │
│  Sukuk Issuance Template v2.1                             │
│  - 12 workflows executed                                  │
│  - 98% success rate                                       │
│  - 8 AI improvements applied                              │
│                                                            │
│  Recent improvements:                                     │
│  • Added auto-fill for issuer details (Nov 1)            │
│  • Improved asset validation logic (Oct 28)              │
│  • Reduced approval wait time by 30% (Oct 15)            │
│                                                            │
│  [Submit Feedback]                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### AI Agent Assistance
- **Pattern detection**: "You corrected field X 3 times → suggest validation"
- **Template versioning**: "v2.1 is 15% faster than v2.0"
- **Crowd-sourced improvements**: "80% of users enabled parallel processing"

#### Technical Implementation
- **Learning Extraction**: Analyze execution log for user corrections
- **Template Updates**: Apply approved learnings to WorkflowTemplate
- **Versioning**: Semantic versioning for templates (v2.1 → v2.2)
- **A/B Testing**: Test new validations on subset of users
- **Backend Storage**: Learning objects in database

#### Success Criteria
- Users submit feedback in <2 minutes
- AI detects 2+ improvement opportunities per workflow
- Template success rate increases over time
- Users see tangible impact of their feedback

---

## Pre-Ingestion Strategy

### AAOIFI/IIFM Standards (One-Time Setup)

#### What Gets Pre-Ingested
- All AAOIFI Financial Accounting Standards (FAS 1-62)
- All AAOIFI Shariah Standards (SS 1-65)
- All AAOIFI Governance Standards
- All AAOIFI Ethics Standards
- IIFM Sukuk Product Guides
- IIFM Hedging Standards
- IIFM Liquidity Management Standards

#### Backend Implementation

**File**: `backend/scripts/pre_ingest_standards.py`

```python
"""
AAOIFI/IIFM Standards Pre-Ingestion Script
===========================================
One-time script to ingest Islamic finance standards into Graphiti.

Usage:
  python scripts/pre_ingest_standards.py

What it does:
  1. Downloads AAOIFI standards from official sources
  2. Parses PDF documents into structured text
  3. Creates Graphiti episodes for each standard
  4. Tags with group_id="aaoifi-standards" for easy retrieval
"""

import asyncio
from pathlib import Path
from app.services.graphiti_service import graphiti_service

STANDARDS_DIR = Path("data/standards")

AAOIFI_STANDARDS = [
    {
        "id": "FAS-1",
        "name": "General Presentation and Disclosure in the Financial Statements of Islamic Banks",
        "file": "AAOIFI_FAS_1.pdf",
        "category": "accounting"
    },
    # ... 200+ more standards
]

async def ingest_standard(standard: dict):
    """Ingest a single standard into Graphiti"""

    # Parse PDF
    text = parse_pdf(STANDARDS_DIR / standard["file"])

    # Create episode
    episode_id = await graphiti_service.add_episode(
        name=f"AAOIFI {standard['id']}: {standard['name']}",
        episode_body=text,
        episode_type="text",
        source_description=f"AAOIFI Standard {standard['id']}",
        group_id="aaoifi-standards"
    )

    print(f"✅ Ingested {standard['id']}")
    return episode_id

async def main():
    print("Starting AAOIFI/IIFM standards ingestion...")

    for standard in AAOIFI_STANDARDS:
        await ingest_standard(standard)

    print(f"✅ Ingested {len(AAOIFI_STANDARDS)} standards")

if __name__ == "__main__":
    asyncio.run(main())
```

**Run Once**: `python backend/scripts/pre_ingest_standards.py`

#### Frontend Impact
- Users never see "Upload AAOIFI documents" option
- Standards available instantly via Graphiti search
- AI can cite specific AAOIFI standards during validation

---

## AG-UI Protocol Integration

### Human-in-the-Loop Checkpoints

1. **Step 1**: Template selection (user chooses, AI recommends)
2. **Step 2**: Form submission (AI pre-fills, user corrects)
3. **Step 3**: Test run review (AI validates, user approves)
4. **Step 4**: Shariah advisor approval (AI checks, human signs off)
5. **Step 5**: Blockchain launch confirmation (user explicitly confirms)
6. **Step 6**: Workflow interruptions (user can pause/resume)
7. **Step 7**: Feedback submission (user provides learning data)

### AI Wizarding Components

#### 1. Contextual Tooltips
```typescript
<Tooltip>
  <TooltipTrigger>AAOIFI FAS 33</TooltipTrigger>
  <TooltipContent>
    <AIExplanation standard="FAS-33" />
    {/* AI fetches from Graphiti, explains in simple terms */}
  </TooltipContent>
</Tooltip>
```

#### 2. Field Auto-Fill
```typescript
<Input
  value={issuerName}
  onChange={setIssuerName}
  aiSuggestion={aiSuggestIssuer()} // AI reads from previous workflows
  onAcceptSuggestion={() => setIssuerName(aiSuggestIssuer())}
/>
```

#### 3. Validation Assistance
```typescript
<ValidationMessage>
  ❌ Issue amount must be ≥$1M
  💡 AI: "Typical Sukuk issuances range from $100M-$500M"
  <Button>Auto-correct to $100M</Button>
</ValidationMessage>
```

#### 4. Dynamic Dashboard Rendering
```typescript
// Guardian Indexer returns arbitrary JSON state
const guardianState = await fetchGuardianIndexer(policyId)

// AI generates dashboard components on-the-fly
<AIDashboard data={guardianState} />
// Renders charts, tables, metrics dynamically
```

---

## Implementation Phases

### **Phase 4A: Mock Guardian Integration** (Current Sprint)

**Goal**: Nail the UX flow with mocked Guardian responses

**Tasks**:
1. ✅ Document this plan
2. ⏳ Create progress tracker (PHASE_4A_TRACKER.md)
3. ⏳ Fork repository (preserve document generation version)
4. ⏳ Replace Step2 with Step1_5 (renamed "Select Template")
5. ⏳ Build Step2: Configure Details (dynamic forms from mock schemas)
6. ⏳ Build Step3: Test Workflow (simulated dry run)
7. ⏳ Build Step4: Validate Compliance (mock AAOIFI checks)
8. ⏳ Build Step5: Launch & Execute (simulated blockchain recording)
9. ⏳ Build Step6: Monitor & Review (mock Guardian Indexer dashboard)
10. ⏳ Build Step7: Improve & Learn (feedback loop)
11. ⏳ Implement AI agents for each step (AG-UI wizarding)
12. ⏳ Create mock Guardian service in backend
13. ⏳ Build AAOIFI pre-ingestion script (mock PDFs for now)
14. ⏳ Test complete flow: Sukuk issuance end-to-end

**Success Criteria**:
- Complete Sukuk workflow executes in <10 minutes
- Every step shows AI assistance
- "Hedera Blockchain" mentioned explicitly in Step 5/6
- Users understand flow without documentation
- No mention of "Guardian", "HCS", or other technical jargon

---

### **Phase 4B: Real Guardian MCP Integration** (Future Sprint)

**Goal**: Replace mocks with real Guardian instance

**Prerequisites**:
- Guardian instance running (testnet or mainnet)
- Guardian MCP server configured
- Hedera account with HBAR for transactions

**Tasks**:
1. Set up Guardian instance (Docker or cloud deployment)
2. Configure Guardian MCP in backend
3. Replace mock methodology list with Guardian API
4. Implement real dry run execution
5. Implement real policy deployment to Guardian
6. Connect to Hedera testnet/mainnet
7. Integrate Guardian Indexer for real-time state
8. Test with real blockchain transactions
9. Verify HashScan links work correctly
10. Performance testing (handle 100+ concurrent workflows)

**Success Criteria**:
- Workflows execute on real Hedera blockchain
- HashScan links show actual transactions
- Guardian Indexer provides real-time updates
- No mock data remaining in critical paths

---

### **Phase 4C: Production Deployment** (Future)

**Goal**: Production-ready platform

**Tasks**:
- Multi-tenancy (multiple organizations)
- Authentication and authorization
- Role-based access control (RBAC)
- Audit logging
- Security audit
- Performance optimization
- Monitoring and observability
- Documentation for end users
- Training materials
- Production deployment (AWS/GCP/Azure)

**Success Criteria**:
- 99.9% uptime SLA
- <2 second page load times
- SOC 2 compliance
- 10,000+ workflows executed successfully

---

## Example: Sukuk Issuance Workflow

### User Journey (End-to-End)

#### **Step 1: Select Template** (30 seconds)
- User searches "Sukuk"
- Selects "Sukuk Issuance Template"
- Sees: 12 workflow steps, AAOIFI FAS 33 compliant, Hedera Blockchain recording
- Clicks "Select Template"

#### **Step 2: Configure Details** (5 minutes)
- AI pre-fills issuer name: "ABC Islamic Bank" (from previous workflows)
- User corrects issue amount: $250M
- User assigns roles:
  - Shariah Advisor: Dr. Ahmed Al-Mansouri
  - Auditor: XYZ Audit Firm
- AI validates: "✅ All required fields complete"
- User uploads financial statements (AI extracts key metrics)
- Clicks "Next: Test Workflow"

#### **Step 3: Test Workflow** (60 seconds)
- User clicks "Start Test Run"
- Watches 12 steps execute in sandbox
- Sees: "✅ AAOIFI FAS 33: PASSED"
- AI alerts: "⚠️ Asset valuation needs Shariah signature"
- User fixes and re-runs test
- Test passes, clicks "Next: Validate Compliance"

#### **Step 4: Validate Compliance** (2 minutes)
- AI automatically checks all AAOIFI standards
- Shows: "✅ 247 standards checked, all compliant"
- AI suggests: "💡 Adjust maturity to Thursday (Islamic best practice)"
- User accepts AI suggestion
- Shariah advisor reviews and approves
- Clicks "Next: Launch Workflow"

#### **Step 5: Launch & Execute** (1 minute)
- User reads blockchain warning
- Confirms: "✓ I understand this will be on Hedera Blockchain"
- Clicks "🚀 Launch Workflow on Blockchain"
- Sees: "Blockchain TX: 0.0.123456@1699564800.123"
- Clicks [View on HashScan ↗] → opens browser tab to verify
- Workflow executing, user clicks "Next: Monitor"

#### **Step 6: Monitor & Review** (Ongoing, days/weeks)
- User checks dashboard daily
- Sees: "Progress: 58% (Step 7/12)"
- Downloads "Legal & Compliance Report (PDF)" for legal team
- Downloads "Shariah Department Report (PDF)" for Shariah board
- AI alerts: "Step 9 completing ahead of schedule"
- Workflow completes after 5 days
- User clicks "View Full Blockchain Audit Trail ↗"

#### **Step 7: Improve & Learn** (2 minutes)
- User rates experience: ⭐⭐⭐⭐⭐
- AI suggests: "I noticed you corrected asset validation 3 times"
- User approves: "✓ Apply to Template"
- Template updated: v2.1 → v2.2
- User sees: "Your feedback will help 1,200+ other users"

**Total Time**: 8 minutes setup + 5 days execution + 2 minutes feedback

---

## Success Criteria

### Phase 4A (Mock Integration)
- ✅ All 7 steps functional with mock data
- ✅ Sukuk workflow completes end-to-end in <10 minutes (setup time)
- ✅ AI agents provide assistance at every step
- ✅ "Hedera Blockchain" mentioned explicitly (not hidden)
- ✅ Zero mentions of "Guardian", "HCS", "policy" in user-facing UI
- ✅ Users understand flow without documentation/training

### Phase 4B (Real Guardian)
- ✅ Workflows execute on real Hedera blockchain
- ✅ HashScan links verify every transaction
- ✅ Guardian Indexer provides real-time state updates
- ✅ Dry run execution works with real Guardian instance
- ✅ AAOIFI standards pre-ingested and searchable

### Phase 4C (Production)
- ✅ 100+ concurrent workflows without performance degradation
- ✅ 99.9% uptime SLA
- ✅ SOC 2 compliance achieved
- ✅ 10,000+ workflows executed successfully
- ✅ Average user setup time <10 minutes
- ✅ Average workflow execution time 3-5 days (real-world timelines)

---

## Appendix: Technical Glossary

**For Developers Only** (Never show users)

- **Guardian**: Hedera policy execution engine
- **HCS**: Hedera Consensus Service (blockchain messaging)
- **Guardian Indexer**: Source of Truth for policy execution state
- **Guardian Schemas**: JSON schemas defining policy data structures
- **MCP**: Model Context Protocol (AI<>Guardian communication)
- **Dry Run**: Sandbox execution (nothing recorded on blockchain)
- **Policy**: Guardian's term for workflow
- **Methodology**: Guardian's term for reusable policy template
- **Topic ID**: Hedera blockchain topic identifier (e.g., 0.0.123456)
- **HashScan**: Hedera blockchain explorer (like Etherscan)

**User-Facing Terms:**
- Template, Workflow, Test Run, Simulation, Hedera Blockchain, Standards, Compliance

---

**End of Plan**
