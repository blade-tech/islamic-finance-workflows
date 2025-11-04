# Methodology Digitization Integration Plan
**Islamic Finance Workflows - Hedera Guardian Integration**

*Planning Document - Created: November 4, 2025*
*Last Updated: November 4, 2025 - 15:45 UTC*
*Status: ✅ PHASE 1 + FRONTEND COMPLETE - Full Stack Implementation with Mock Data*

---

## 🚀 Implementation Progress

### ✅ Completed (Phase 1: Full Stack Implementation)

#### How Guardian Influenced Phase 1 (Current Implementation)

**What We Built**: The "consumption" side - browsing and selecting already-digitized methodologies

**Guardian Concepts Applied**:

1. **Methodology Metadata Structure** - Our `Methodology` Pydantic model mirrors Guardian's digitized output:
   ```python
   schema_count: int          # Guardian's schemas (general-data, parameter-data, validation-data)
   policy_steps: int          # Guardian's workflow blocks
   required_roles: List[str]  # Guardian's multi-stakeholder roles (VVB, Project Developer, etc.)
   source_type: str          # Track if from Guardian instance or other source
   status: str               # Guardian's lifecycle: draft → active → archived
   ```

2. **Display Semantics** - UI shows Guardian digitization artifacts:
   ```typescript
   <FileCheck /> {methodology.schemaCount} schemas    // Guardian Part III output
   <GitBranch /> {methodology.policySteps} steps      // Guardian Part IV output
   <Users />     {methodology.requiredRoles}          // Guardian workflow roles
   ```

3. **Classification System** - Based on Guardian's methodology taxonomy:
   - `type: 'islamic-finance' | 'environmental' | 'social'` (Guardian has environmental)
   - `standard: 'IIFM' | 'AAOIFI'` (Guardian has Verra, Gold Standard)
   - `category: 'mudarabah' | 'sukuk'` (Guardian has methodology types)

**In Other Words**:
- **Guardian digitizes** VM0033 (Tidal Wetland) → creates schemas, policies, workflows
- **We display** those artifacts → schemaCount: 10, policySteps: 15, requiredRoles: [...]
- **Our mock data** mimics Guardian's output for Islamic finance methodologies

#### Backend Foundation
- **Backend Models**: Created Pydantic models for `Methodology`, `MethodologyListFilters`, API request/response models
- **Mock Service**: Implemented `MethodologyService` with 7 pre-populated Islamic finance methodologies:
  - IIFM Mudarabah Standard (ST-14)
  - IIFM Sukuk Al Mudarabah (Tier 1)
  - AAOIFI Murabaha Standard (FAS 28)
  - AAOIFI Ijara Lease Standard
  - Diminishing Musharakah Partnership
  - Wakala Investment Agency
  - [DRAFT] Takaful Insurance Framework
- **API Endpoints**: Created `/api/methodologies` router with:
  - `GET /api/methodologies` - List all methodologies (with filtering support)
  - `GET /api/methodologies/{id}` - Get specific methodology details
- **Field Serialization**: Implemented proper camelCase serialization for frontend compatibility
  - Used `serialization_alias` on all Pydantic Field() definitions
  - Manual `model_dump(mode='json', by_alias=True)` with JSONResponse
  - Bypassed FastAPI's default serialization to ensure camelCase output
- **Testing**: All endpoints tested and working with filtering (by type, category, standard, status, search)

#### Frontend Implementation
- **TypeScript Types** (`src/lib/types.ts`): Added comprehensive methodology interfaces
  - `Methodology` - Full methodology model with camelCase fields
  - `MethodologyListFilters` - Filter parameters
  - `MethodologyListResponse` - API response structure
- **MethodologyCard Component** (`src/components/workflow/MethodologyCard.tsx`):
  - Reusable card component for methodology previews
  - Category icons (mudarabah 🤝, sukuk 📜, murabaha 💰, etc.)
  - Status badges (active, draft, archived)
  - Guardian metadata display (schema count, policy steps)
  - Statistics display (application count, success rate)
  - Selection state with visual indicators
- **MethodologySelector Component** (`src/components/workflow/MethodologySelector.tsx`):
  - Full-featured methodology selection UI
  - Split-panel layout (methodology cards left, preview right)
  - Button-based filters (Type: Islamic Finance/Environmental/Social, Status: Active/Draft/Archived)
  - Search input for free-text filtering
  - Real-time API integration with query parameters
  - Upload placeholder UI for future document digitization
  - Mock data badge notification
- **Test Page** (`src/app/test-methodologies/page.tsx`):
  - Standalone test page at `/test-methodologies`
  - Separate from main workflow (as requested)
  - Developer notes with implementation details

#### Key Technical Challenge Solved
**Problem**: Backend returned snake_case fields (`schema_count`, `policy_steps`, etc.) but frontend expected camelCase (`schemaCount`, `policySteps`, etc.)

**Solution Chain**:
1. Added `serialization_alias` to all Field() definitions in Pydantic models
2. Configured `model_config = ConfigDict(populate_by_name=True, ser_json_bytes='utf8')`
3. Modified API endpoints to explicitly call `response.model_dump(mode='json', by_alias=True)`
4. Returned `JSONResponse` to bypass FastAPI's automatic serialization

**Result**: API now correctly returns camelCase fields matching frontend TypeScript interfaces

### 🔄 In Progress
- None - Phase 1 complete and verified working

### ⏳ Planned (Next Steps - Future Phases)

#### How Guardian Will Influence "Upload New" (Future Phase 2-3)

**What We'll Build**: The "creation" side - digitizing new methodologies from PDF documents

**Guardian Process We'll Automate**:

```
┌─────────────────────────────────────────────────────────────────┐
│ Guardian Manual Process (20-30 hrs)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Part II: Analysis (30-40 min manual)                           │
│   ↓ Human reads PDF                                            │
│   ↓ Manually identifies equations                              │
│   ↓ Maps parameters                                            │
│                                                                 │
│ Part III: Schema Design (3-4 hrs manual)                       │
│   ↓ Human writes JSON schemas field-by-field                   │
│   ↓ Manually defines validation rules                          │
│   ↓ Creates nested structures                                  │
│                                                                 │
│ Part IV: Policy Workflow (3-4 hrs manual)                      │
│   ↓ Human configures workflow blocks                           │
│   ↓ Sets up roles and permissions                              │
│   ↓ Defines approval gates                                     │
│                                                                 │
│ Part V: Calculations (2-3 hrs manual)                          │
│   ↓ Human writes JavaScript code                               │
│   ↓ Implements formulas                                        │
│   ↓ Creates calculation logic                                  │
│                                                                 │
│ Part VI: Testing (7-10 hrs manual)                             │
│   ↓ Human manually tests workflows                             │
│   ↓ Multi-role testing                                         │
│   ↓ Edge case validation                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

             ⚡ AI AUTOMATION ⚡

┌─────────────────────────────────────────────────────────────────┐
│ Our AI-Powered Process (~30 min)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. Upload IIFM Mudarabah PDF (user action: 30 sec)            │
│    ↓                                                           │
│ 2. LlamaParse extraction (automated: 1-2 min)                 │
│    ↓ Preserves structure, tables, clauses                     │
│    ↓                                                           │
│ 3. Claude analysis (automated: 2-3 min)                       │
│    ↓ Extracts Shariah compliance criteria                     │
│    ↓ Identifies stakeholder roles                             │
│    ↓ Maps profit-sharing formulas                             │
│    ↓ Finds approval workflows                                 │
│    ↓                                                           │
│ 4. Guardian schema generation (automated: 3-5 min)            │
│    ↓ Creates general-data schema (contract details)           │
│    ↓ Creates parameter-data schema (profit ratios)            │
│    ↓ Creates validation-data schema (Shariah certification)   │
│    ↓                                                           │
│ 5. Guardian policy generation (automated: 3-5 min)            │
│    ↓ Generates workflow blocks                                │
│    ↓ Configures roles (Mudarib, Rab-ul-Mal, Shariah Board)    │
│    ↓ Sets up approval gates                                   │
│    ↓                                                           │
│ 6. Calculation logic generation (automated: 2-3 min)          │
│    ↓ Generates JavaScript formulas                            │
│    ↓ Creates profit distribution logic                        │
│    ↓ Implements loss allocation rules                         │
│    ↓                                                           │
│ 7. Automated testing (automated: 10-15 min)                   │
│    ↓ Guardian dry-run validation                              │
│    ↓ Schema validation                                        │
│    ↓ Workflow simulation                                      │
│    ↓                                                           │
│ 8. Human review & approval (user action: 10-15 min)           │
│    ✓ User reviews generated artifacts                         │
│    ✓ Makes final adjustments if needed                        │
│    ✓ Approves for production                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

RESULT: 20-30 hours → 30 minutes (97% time reduction)
```

**Next Phase Tasks**:
- Integration with Step 2 workflow (plug in to existing app)
- Real document upload functionality
- Guardian API integration
- AI-powered document digitization (Claude + LlamaParse)
- Implement DocumentDigitizationService (backend/app/services/document_digitization.py)
- Create `/api/methodologies/digitize` endpoint

---

## Executive Summary

This document outlines the plan to integrate Hedera Guardian's methodology digitization framework into the Islamic Finance Workflows application, starting with the digitization of a **Mudarabah contract** using IIFM templates. The integration will create a new workflow step that allows users to:

1. **Select existing digitized methodologies** from Guardian's library
2. **Upload documents to create new digitized methodologies**
3. **Apply methodologies** to Islamic finance contracts and workflows

---

## 1. Task Understanding Confirmation

### Primary Objective
Create a **Step 2 workflow option** that replaces or augments the current "Workflow Selection" step with "**Apply/Create Methodology**" functionality.

### Key Requirements
✅ **Non-disruptive**: Build as separate component, then plug into existing workflow
✅ **Guardian Integration**: Access Guardian's existing digitized methodologies
✅ **Document Upload**: Enable users to upload documents (PDF, Word, etc.) for methodology creation
✅ **Mudarabah Focus**: Start with IIFM Mudarabah contract template as proof-of-concept
✅ **UI/UX Excellence**: Professional, intuitive interface matching existing app design

---

## 2. Research Findings

### 2.1 Hedera Guardian Methodology Framework

**Reference**: [Guardian Methodology Digitization Handbook](https://docs.hedera.com/guardian/methodology-digitization/methodology-digitization-handbook)

#### What is a "Methodology"?
In Guardian context, a methodology is a **digitized compliance framework** that:
- Defines **schemas** (data structures) for collecting information
- Implements **policies** (workflow logic) for processing
- Contains **calculation engines** for quantification (emissions, compliance metrics, etc.)
- Creates **verifiable credentials** for audit trails
- Generates **tokens** as proof of compliance

**Example**: VM0033 (Tidal Wetland Restoration) is a 135-page environmental methodology digitized into:
- **400+ structured data components**
- **3,779 rows of project description schema**
- **Automated calculation workflows**
- **Multi-stakeholder verification processes**

#### Guardian's 7-Part Digitization Process (20-30 hours manual)
From the official handbook:

| Part | Duration | Focus | Output |
|------|----------|-------|--------|
| **I: Foundation** | 20-30 min | Understanding Guardian platform | Platform knowledge |
| **II: Analysis & Planning** | 30-40 min | Systematic methodology decomposition | Requirements analysis |
| **III: Schema Design** | 3-4 hours | Schema development and testing | Production-ready schemas |
| **IV: Policy Workflow** | 3-4 hours | Workflow implementation | Complete policies |
| **V: Calculation Logic** | 2-3 hours | Formula implementation | Custom logic blocks |
| **VI: Integration & Testing** | 7-10 hours | End-to-end testing, API automation | Production validation |
| **VII: Advanced Topics** | 5-7 hours | External integration, troubleshooting | Expert-level implementation |

**Guardian Success Metrics**:
- 50-70% reduction in methodology maintenance time
- 60-80% reduction in digitization time (after first implementation)
- Automated audit trails and validation
- Streamlined certification processes

#### Guardian's Available Digitized Methodologies

**Environmental (VCS Program):**
- VM0033: Tidal Wetland and Seagrass Restoration v2.1
- VM0048: Reducing Emissions from Deforestation v1.0
- VM0049: Carbon Capture and Storage v1.0
- VM0051: Improved Management in Rice Production v1.0
- **20+ total methodologies** across Verra's programs

**Status**: Verra announced collaboration with Hedera Foundation (May 2025) to accelerate digitalization of carbon market methodologies.

**Our Opportunity**: Apply this same framework to **Islamic finance compliance** - a natural fit for Guardian's strengths in:
- Complex multi-stakeholder workflows
- Shariah compliance verification
- Document audit trails
- Tokenization of compliant instruments

---

### 2.2 Guardian Schema Architecture

#### Five Schema Content Types:

| Type | Purpose | Example for Mudarabah |
|------|---------|----------------------|
| **general-data** | Basic project info, stakeholder details | Mudarabah contract parties, capital amount, profit-sharing ratio |
| **parameter-data** | Methodology-specific parameters with equations | Profit calculation formulas, Shariah compliance criteria |
| **validation-data** | Calculation results, verification outcomes | Final profit distribution, Shariah board approval |
| **tool-integration** | External tool implementations | AAOIFI standards validation, Shariah screening tools |
| **guardian-schema** | Complex nested schemas, advanced features | Multi-period profit tracking, ongoing compliance monitoring |

#### Two-Part Schema Structure:
1. **Project Description Foundation**
   - Establishes all foundational information
   - Supports multiple certification pathways (e.g., AAOIFI, local regulations)
   - Conditional logic for different contract types

2. **Calculations and Parameter Engine**
   - Time-series data collection
   - Annual/periodic parameter tracking
   - Automated compliance calculations
   - Net result validation

**Key Insight**: Guardian's schema system can map perfectly to Islamic finance contracts:
- **General Data** = Contract parties, instrument details
- **Parameter Data** = Shariah compliance parameters, profit ratios
- **Validation Data** = Shariah board certification, compliance scores
- **Tool Integration** = AAOIFI standards, Islamic finance calculators

---

### 2.4 Our AI-Powered Acceleration of Guardian's Process

**Guardian's Challenge**: Manual digitization takes 20-30 hours (after learning curve)

**Our Solution**: Use Claude + LlamaParse to automate Guardian's 7-part process

| Guardian Part | Manual Work | Our AI Automation | Time Saved |
|---------------|-------------|-------------------|------------|
| **II: Analysis** | Human reads PDF, maps equations, identifies parameters | **Claude analyzes** entire document, extracts Shariah requirements, identifies stakeholder roles | ~30 min → 2 min |
| **III: Schema** | Human writes JSON schemas field-by-field | **Claude generates** Guardian-compatible schemas from analysis | ~3-4 hrs → 5 min |
| **IV: Policy** | Human configures workflow blocks, roles, gates | **Claude generates** policy workflows from approval processes | ~3-4 hrs → 5 min |
| **V: Calculations** | Human writes JavaScript formulas | **Claude generates** calculation logic from extracted equations | ~2-3 hrs → 3 min |
| **VI: Testing** | Human manually tests multi-role workflows | **Automated** Guardian dry-run + API testing | ~7-10 hrs → 15 min |
| **TOTAL** | **20-30 hours** (manual Guardian process) | **~30 minutes** (AI-powered) | **97% faster** |

**Example: IIFM Mudarabah Digitization**

Guardian Manual Process:
```
1. Read 50-page IIFM Mudarabah template (1-2 hours)
2. Identify data requirements manually (30-60 min)
3. Create schemas in Guardian UI (3-4 hours)
4. Configure policy workflows (3-4 hours)
5. Write profit calculation code (2-3 hours)
6. Test with sample data (7-10 hours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 20-30 hours
```

Our AI Process:
```
1. User uploads IIFM Mudarabah PDF
2. LlamaParse extracts structured text (1-2 min)
3. Claude analyzes document:
   → Identifies profit-sharing clauses
   → Extracts Shariah compliance requirements
   → Maps stakeholder roles (Mudarib, Rab-ul-Mal)
   → Finds calculation formulas
4. Claude generates Guardian artifacts:
   → 3 schemas (general-data, parameter-data, validation-data)
   → 1 policy workflow (5 steps)
   → 2 calculation blocks (profit distribution, loss allocation)
5. Automated testing with Guardian dry-run
6. Human reviews and approves (10-15 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ~30 minutes (97% faster than Guardian manual)
```

**Why This Matters**:
- **Guardian's strength**: Proven framework for methodology digitization
- **Our innovation**: AI automation of Guardian's manual steps
- **Best of both**: Guardian's rigor + AI's speed = 97% time savings

---

### 2.3 IIFM Mudarabah Templates

**Source**: International Islamic Financial Market (IIFM) - Industry standard setter

**Available Templates** (IIFM Standard - 14):
- ✅ **Mudarabah Sukuk Template - Prospectus (TIER 1)**
- ✅ **Mudarabah Sukuk Template - Mudarabah Agreement (TIER 1)**
- ✅ **Mudarabah Sukuk Template - Declaration of Trust (TIER 1)**

**Language**: Available in English and Arabic

**Access**: Templates are standardized legal documents addressing:
- Common clauses challenged during drafting
- Repetitive documentation requirements
- Shariah requirements standardization
- Cost reduction through standardization

**Our Use Case**: Extract compliance requirements from IIFM templates to create:
1. **Guardian schemas** for data collection
2. **Validation rules** for Shariah compliance
3. **Workflow policies** for multi-party approval
4. **Calculation logic** for profit distribution

---

### 2.4 Guardian Technical Architecture

#### Policy Import/Export Mechanisms:

**API Endpoints Available:**
```
POST /api/v1/policies/import/file           # Import from ZIP
POST /api/v1/policies/import/message        # Import from IPFS
GET  /api/v1/policies                       # List all policies
GET  /api/v1/policies/{policyId}            # Get policy details
POST /api/v1/policies/push/import/file      # Async import
```

**Policy File Format:**
- **ZIP archive** containing:
  - `policy.json` - Workflow definition
  - `schemas/*.json` - Data structure definitions
  - `tools/*.json` - Calculation logic
  - `metadata.json` - Methodology information

**Schema Import/Export:**
```
POST /api/v1/schemas/{topicId}/import/file  # Import schema ZIP
GET  /api/v1/schemas                        # List all schemas
POST /api/v1/schemas                        # Create new schema
```

**Key Discovery**: Guardian provides **full API access** to:
- ✅ Import pre-built methodologies (policies)
- ✅ Export our custom methodologies
- ✅ List available methodologies from Guardian instances
- ✅ Create new methodologies programmatically

---

## 3. Proposed UI/UX Flow

### 3.1 New "Step 2: Methodology Selection" Screen

**Current Flow:**
```
Step 1: Source Connection → Step 2: Workflow Selection → Step 3: Configuration → ...
```

**Proposed Flow:**
```
Step 1: Source Connection → Step 2: Methodology Selection → Step 3: Workflow Configuration → ...
```

### 3.2 Methodology Selection UI Components

#### Option 1: Select Existing Methodology

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ 📋 Select Existing Methodology                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Search methodologies...]                     [Filter▼] │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏦 Mudarabah Sukuk Issuance (IIFM Standard 14)     │ │
│ │ Status: ✓ Certified  |  Type: Islamic Finance     │ │
│ │ Last Updated: Oct 2024                             │ │
│ │ [View Details] [Apply Methodology →]               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📊 Mudarabah Portfolio Management                  │ │
│ │ Status: Draft  |  Type: Islamic Finance           │ │
│ │ Last Updated: Nov 2024                             │ │
│ │ [View Details] [Apply Methodology →]               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🌱 VM0033 Tidal Wetland Restoration (Verra)       │ │
│ │ Status: ✓ Certified  |  Type: Environmental       │ │
│ │ Last Updated: Sep 2023                             │ │
│ │ [View Details] [Apply Methodology →]               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Filters:**
- Type: Islamic Finance / Environmental / All
- Status: Certified / Draft / In Review
- Standard: IIFM / AAOIFI / Verra / All
- Search: Free text across name, description, tags

**Methodology Card Details:**
- Name and icon
- Status badge (Certified, Draft, In Review)
- Type/Category
- Last updated date
- Preview/Apply actions

---

#### Option 2: Upload & Digitize Document

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ 📤 Upload Document to Create Methodology                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Step 1: Upload Contract Document                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  Drag & Drop file here                             │ │
│ │  or [Browse Files]                                 │ │
│ │                                                     │ │
│ │  Supported: PDF, DOCX, TXT                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ Step 2: Methodology Information                          │
│ Name: [_____________________________]                    │
│ Type: [Islamic Finance ▼]                                │
│ Standard: [IIFM ▼]                                       │
│ Description: [________________________________          ] │
│              [________________________________          ] │
│                                                          │
│ Step 3: AI-Assisted Digitization (Powered by Claude)    │
│ ☐ Extract compliance requirements automatically         │
│ ☐ Generate validation rules from contract clauses       │
│ ☐ Create workflow steps based on approval processes     │
│ ☐ Map financial calculations to Guardian schemas        │
│                                                          │
│ [Cancel]                    [Generate Methodology →]     │
└─────────────────────────────────────────────────────────┘
```

**AI Processing Steps** (Backend with Claude):
1. **Document Parsing** (LlamaParse API)
   - Extract text from PDF/DOCX
   - Preserve structure (headings, sections, tables)

2. **Compliance Analysis** (Claude API)
   - Identify Shariah compliance requirements
   - Extract calculation formulas
   - Map stakeholder roles
   - Detect approval workflows

3. **Schema Generation** (Claude Agent SDK)
   - Create Guardian schema JSON
   - Define field types and validations
   - Build conditional logic

4. **Policy Creation** (Guardian API)
   - Generate workflow policy JSON
   - Configure stakeholder roles
   - Set up approval gates

---

#### Option 3: Browse Methodology Library

**Integration with Guardian Instances:**
```
┌─────────────────────────────────────────────────────────┐
│ 🌐 Browse Guardian Methodology Library                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Connected Instances:                                     │
│ ○ Verra Project Hub         [Connected ✓]               │
│ ○ IIFM Standards Registry   [Connected ✓]               │
│ ○ Local Guardian Instance   [Connected ✓]               │
│                                                          │
│ [📥 Import from Guardian Instance]                       │
│                                                          │
│ Available Methodologies: 23                              │
│ [Search across all instances...]                         │
│                                                          │
│ ... methodology cards ...                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 Methodology Details Modal

**When user clicks "View Details":**

```
┌────────────────────────────────────────────────────────────┐
│ Mudarabah Sukuk Issuance (IIFM Standard 14)          [×]  │
├────────────────────────────────────────────────────────────┤
│ [Overview] [Schema] [Workflow] [Calculations] [Audit]     │
├────────────────────────────────────────────────────────────┤
│ Overview                                                   │
│ ─────────────────────────────────────────────────────────  │
│ Standard: IIFM Standard - 14                               │
│ Type: Sukuk Al Mudarabah (Tier 1)                          │
│ Status: ✓ Shariah Board Certified                         │
│ Last Updated: October 2024                                 │
│                                                            │
│ Description:                                               │
│ Standardized documentation template for issuing Sukuk     │
│ Al Mudarabah Tier 1 instruments. Includes Prospectus,     │
│ Mudarabah Agreement, and Declaration of Trust templates.  │
│                                                            │
│ Compliance Requirements:                                   │
│ ✓ AAOIFI FAS Standards                                    │
│ ✓ IIFM Shariah Board Approval                             │
│ ✓ Local Regulatory Requirements                           │
│                                                            │
│ Key Features:                                              │
│ • Multi-party approval workflow                           │
│ • Automated profit distribution calculations              │
│ • Ongoing compliance monitoring                           │
│ • Audit trail with verifiable credentials                 │
│                                                            │
│ Stakeholder Roles:                                         │
│ • Issuer (Mudarib)                                        │
│ • Investors (Rab-ul-Mal)                                  │
│ • Shariah Advisor                                         │
│ • Trustee                                                 │
│ • Regulator                                               │
│                                                            │
│ [Cancel]                     [Apply This Methodology →]    │
└────────────────────────────────────────────────────────────┘
```

**Tabs:**
- **Overview**: High-level description, status, requirements
- **Schema**: Data structure preview, required fields
- **Workflow**: Visual workflow diagram, approval gates
- **Calculations**: Formulas, validation rules
- **Audit**: Change history, certification records

---

## 4. Backend Architecture Plan

### 4.1 New Backend Services

#### Service: `MethodologyService` (backend/app/services/methodology_service.py)

**Responsibilities:**
```python
class MethodologyService:
    """
    Manages Guardian methodology lifecycle:
    - Discovery and listing
    - Import/export
    - Digitization from documents
    - Application to workflows
    """

    async def list_methodologies(
        self,
        filters: MethodologyFilters = None
    ) -> List[Methodology]:
        """List all available methodologies"""

    async def get_methodology(
        self,
        methodology_id: str
    ) -> Methodology:
        """Get detailed methodology information"""

    async def import_methodology(
        self,
        source: str,  # "guardian_instance" | "file" | "ipfs"
        data: Union[UploadFile, str]
    ) -> Methodology:
        """Import methodology from various sources"""

    async def digitize_document(
        self,
        document: UploadFile,
        metadata: MethodologyMetadata
    ) -> Methodology:
        """
        AI-powered document digitization:
        1. Parse with LlamaParse
        2. Analyze with Claude
        3. Generate Guardian schemas
        4. Create policy JSON
        """

    async def apply_methodology(
        self,
        methodology_id: str,
        workflow_session_id: str
    ) -> WorkflowSession:
        """Apply methodology to active workflow"""
```

---

#### Service: `GuardianClientService` (backend/app/services/guardian_client.py)

**Responsibilities:**
```python
class GuardianClientService:
    """
    HTTP client for Guardian API interactions
    """

    def __init__(self):
        self.base_url = os.getenv("GUARDIAN_API_URL")
        self.api_key = os.getenv("GUARDIAN_API_KEY")

    async def list_policies(self) -> List[GuardianPolicy]:
        """GET /api/v1/policies"""

    async def get_policy(self, policy_id: str) -> GuardianPolicy:
        """GET /api/v1/policies/{policyId}"""

    async def import_policy_from_file(
        self,
        file_data: bytes
    ) -> GuardianPolicy:
        """POST /api/v1/policies/import/file"""

    async def import_policy_from_ipfs(
        self,
        message_id: str
    ) -> GuardianPolicy:
        """POST /api/v1/policies/import/message"""

    async def export_policy(
        self,
        policy_id: str
    ) -> bytes:
        """GET /api/v1/policies/{policyId}/export/file"""
```

---

#### Service: `DocumentDigitizationService` (backend/app/services/document_digitization.py)

**Responsibilities:**
```python
class DocumentDigitizationService:
    """
    AI-powered document digitization using Claude + LlamaParse
    """

    async def parse_document(
        self,
        document: UploadFile
    ) -> ParsedDocument:
        """
        Use LlamaParse to extract structured text
        Preserves headings, tables, clauses
        """

    async def analyze_compliance_requirements(
        self,
        parsed_doc: ParsedDocument
    ) -> ComplianceAnalysis:
        """
        Use Claude to identify:
        - Shariah compliance criteria
        - Stakeholder roles
        - Approval workflows
        - Calculation requirements
        """

    async def generate_guardian_schema(
        self,
        compliance_analysis: ComplianceAnalysis
    ) -> GuardianSchema:
        """
        Generate Guardian JSON schema from analysis
        Maps to 5 schema types
        """

    async def generate_guardian_policy(
        self,
        schema: GuardianSchema,
        compliance_analysis: ComplianceAnalysis
    ) -> GuardianPolicy:
        """
        Generate Guardian policy JSON
        Includes workflow blocks, roles, gates
        """
```

---

### 4.2 New API Endpoints

#### Router: `/api/methodologies` (backend/app/api/methodologies.py)

```python
@router.get("/methodologies")
async def list_methodologies(
    type: Optional[str] = None,
    status: Optional[str] = None,
    standard: Optional[str] = None,
    search: Optional[str] = None
) -> List[MethodologyResponse]:
    """
    List all available methodologies with filtering

    Query Parameters:
    - type: "islamic_finance" | "environmental" | "all"
    - status: "certified" | "draft" | "review"
    - standard: "iifm" | "aaoifi" | "verra" | "all"
    - search: Free text search
    """

@router.get("/methodologies/{methodology_id}")
async def get_methodology(
    methodology_id: str
) -> MethodologyDetailResponse:
    """
    Get detailed methodology information including:
    - Metadata
    - Schema structure
    - Workflow diagram
    - Calculation logic
    - Audit history
    """

@router.post("/methodologies/import")
async def import_methodology(
    source: str = Form(...),  # "guardian" | "file" | "ipfs"
    file: Optional[UploadFile] = File(None),
    guardian_url: Optional[str] = Form(None),
    policy_id: Optional[str] = Form(None),
    ipfs_message_id: Optional[str] = Form(None)
) -> MethodologyResponse:
    """
    Import methodology from various sources
    """

@router.post("/methodologies/digitize")
async def digitize_document(
    file: UploadFile = File(...),
    name: str = Form(...),
    type: str = Form(...),
    standard: str = Form(...),
    description: str = Form(...),
    auto_extract: bool = Form(True),
    auto_validation: bool = Form(True),
    auto_workflow: bool = Form(True),
    auto_calculations: bool = Form(True)
) -> MethodologyResponse:
    """
    AI-powered document digitization
    Returns methodology with generated schemas and policies
    """

@router.post("/methodologies/{methodology_id}/apply")
async def apply_methodology(
    methodology_id: str,
    workflow_session_id: str
) -> WorkflowSessionResponse:
    """
    Apply methodology to active workflow session
    Updates session with methodology configuration
    """
```

---

### 4.3 Database Schema Extensions

**New Table: `methodologies`**
```sql
CREATE TABLE methodologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'islamic_finance', 'environmental', etc.
    standard VARCHAR(50), -- 'iifm', 'aaoifi', 'verra', etc.
    status VARCHAR(20) NOT NULL, -- 'certified', 'draft', 'review'
    description TEXT,

    -- Guardian integration
    guardian_policy_id VARCHAR(255),
    guardian_policy_json JSONB, -- Full policy definition
    guardian_schema_json JSONB, -- Schema definitions

    -- Source tracking
    source_type VARCHAR(50), -- 'guardian_import', 'document_upload', 'manual'
    source_document_url TEXT,
    source_guardian_instance VARCHAR(255),

    -- Metadata
    version VARCHAR(20),
    certification_date TIMESTAMP,
    certified_by VARCHAR(255),
    tags TEXT[], -- For search/filtering

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),

    -- Search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', name || ' ' || COALESCE(description, ''))
    ) STORED
);

CREATE INDEX idx_methodologies_type ON methodologies(type);
CREATE INDEX idx_methodologies_status ON methodologies(status);
CREATE INDEX idx_methodologies_standard ON methodologies(standard);
CREATE INDEX idx_methodologies_search ON methodologies USING GIN(search_vector);
```

**New Table: `methodology_applications`**
```sql
CREATE TABLE methodology_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    methodology_id UUID REFERENCES methodologies(id),
    workflow_session_id UUID REFERENCES workflow_sessions(id),

    -- Application data
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by UUID REFERENCES users(id),
    configuration_json JSONB, -- Methodology-specific config

    -- Results
    status VARCHAR(20), -- 'active', 'completed', 'failed'
    results_json JSONB,

    UNIQUE(methodology_id, workflow_session_id)
);
```

---

## 5. Integration with Existing Workflow

### 5.1 Current Workflow Structure

**Existing Steps:**
1. Source Connection
2. Workflow Selection (Templates)
3. Configuration
4. Review & Execute
5. Live Execution

### 5.2 Proposed Integration Points

**Option A: Replace Step 2**
```
Step 1: Source Connection
    ↓
Step 2: Methodology Selection (NEW - replaces template selection)
    ↓
Step 3: Workflow Configuration (auto-populated from methodology)
    ↓
Step 4: Review & Execute
    ↓
Step 5: Live Execution
```

**Option B: Insert Between Steps (Recommended)**
```
Step 1: Source Connection
    ↓
Step 2: Methodology Selection (NEW)
    ├─→ [Selected] → Auto-configure Step 3
    └─→ [Skipped] → Manual selection at Step 3
    ↓
Step 3: Workflow Configuration (now methodology-aware)
    ↓
Step 4: Review & Execute
    ↓
Step 5: Live Execution
```

**Recommendation**: **Option B** provides flexibility while maintaining backward compatibility.

---

### 5.3 Component Structure

**New Components to Create:**

```
src/components/methodology/
├── MethodologySelector.tsx          # Main selection UI (Step 2)
├── MethodologyCard.tsx              # Individual methodology card
├── MethodologyDetailsModal.tsx      # Full methodology details
├── MethodologyFilters.tsx           # Search and filter controls
├── DocumentUploadForm.tsx           # Document upload for digitization
├── GuardianBrowser.tsx              # Browse Guardian instances
└── types.ts                         # TypeScript types

src/lib/methodology-client.ts        # API client for methodologies
```

**Modified Components:**

```
src/components/workflow/
├── WorkflowSteps.tsx                # ADD: Step 2 methodology selection
├── WorkflowConfiguration.tsx        # MODIFY: Accept methodology config
└── WorkflowReview.tsx               # MODIFY: Display methodology info
```

---

## 6. Phased Implementation Plan

### Phase 1: Foundation (Week 1-2) - RESEARCH & PLANNING ✓
**Status**: COMPLETE (This Document)

- ✅ Research Guardian methodology framework
- ✅ Research IIFM Mudarabah templates
- ✅ Design UI/UX flow
- ✅ Plan backend architecture
- ✅ Document integration approach

---

### Phase 2: Guardian Integration Layer (Week 3-4)

**Backend:**
- [ ] Create `GuardianClientService` with API integration
- [ ] Implement methodology import from Guardian instances
- [ ] Create database schema for methodologies
- [ ] Build `/api/methodologies` endpoints (list, get, import)
- [ ] Test Guardian API connectivity

**Frontend:**
- [ ] Create basic `MethodologySelector` component
- [ ] Implement methodology listing UI
- [ ] Add methodology card components
- [ ] Build search and filter functionality

**Testing:**
- [ ] Connect to Verra Project Hub (test instance)
- [ ] Import VM0033 methodology as proof-of-concept
- [ ] Verify schema and policy structure

---

### Phase 3: Document Digitization Engine (Week 5-6)

**Backend:**
- [ ] Create `DocumentDigitizationService`
- [ ] Integrate LlamaParse for document parsing
- [ ] Implement Claude-powered compliance analysis
- [ ] Build Guardian schema generation logic
- [ ] Create Guardian policy generation logic
- [ ] Add `/api/methodologies/digitize` endpoint

**Frontend:**
- [ ] Create `DocumentUploadForm` component
- [ ] Build AI-processing progress indicator
- [ ] Implement methodology preview/editing UI
- [ ] Add validation and testing tools

**Testing:**
- [ ] Test with IIFM Mudarabah template (sample document)
- [ ] Validate generated Guardian schemas
- [ ] Test policy workflow logic
- [ ] User acceptance testing

---

### Phase 4: Mudarabah Proof-of-Concept (Week 7-8)

**Backend:**
- [ ] Obtain IIFM Mudarabah templates
- [ ] Digitize Mudarabah contract methodology
- [ ] Create Shariah compliance validation rules
- [ ] Implement profit distribution calculations
- [ ] Build multi-party approval workflow

**Frontend:**
- [ ] Create Mudarabah-specific UI components
- [ ] Build profit sharing visualization
- [ ] Add Shariah compliance checklist
- [ ] Implement stakeholder role assignment

**Testing:**
- [ ] End-to-end Mudarabah contract workflow
- [ ] Shariah compliance validation testing
- [ ] Multi-stakeholder approval testing

---

### Phase 5: Integration with Existing Workflow (Week 9-10)

**Backend:**
- [ ] Create `methodology_applications` table
- [ ] Implement methodology application logic
- [ ] Update workflow session management
- [ ] Add methodology-aware template generation

**Frontend:**
- [ ] Insert Step 2 into existing workflow
- [ ] Update `WorkflowSteps` component
- [ ] Modify `WorkflowConfiguration` for methodology awareness
- [ ] Update `WorkflowReview` to display methodology
- [ ] Ensure backward compatibility (skip Step 2 option)

**Testing:**
- [ ] Complete workflow with methodology selection
- [ ] Complete workflow without methodology (backward compat)
- [ ] Cross-browser testing
- [ ] Performance testing

---

### Phase 6: Polish & Production (Week 11-12)

**Backend:**
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Logging and monitoring
- [ ] API documentation

**Frontend:**
- [ ] UI/UX refinements
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Loading states and error messages

**Documentation:**
- [ ] User guide for methodology selection
- [ ] Developer guide for adding new methodologies
- [ ] API documentation
- [ ] Deployment guide

**Deployment:**
- [ ] Staging deployment
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Monitoring and support

---

## 7. Technical Dependencies

### 7.1 Required Services

**Already Available:**
- ✅ Anthropic Claude API (for AI analysis)
- ✅ OpenAI API (for embeddings)
- ✅ LlamaParse API (for document parsing)
- ✅ Neo4j Database (for knowledge graph)

**New Requirements:**
- ⚠️ **Hedera Guardian Instance**
  - Options:
    1. Use Verra Project Hub (read-only access to methodologies)
    2. Deploy own Guardian instance (full control)
    3. Use IIFM Guardian instance (if available)
  - **Recommendation**: Start with Verra Project Hub access, deploy own instance in Phase 4

- ⚠️ **Guardian API Access**
  - Need API keys/authentication
  - Network connectivity to Guardian instances

### 7.2 Environment Variables to Add

```bash
# Guardian Configuration
GUARDIAN_API_URL=https://guardian-api-url.com
GUARDIAN_API_KEY=your_guardian_api_key
GUARDIAN_INSTANCE_TYPE=verra_project_hub  # or 'self_hosted'

# Document Digitization
ENABLE_AI_DIGITIZATION=true
MAX_DOCUMENT_SIZE_MB=50

# Feature Flags
ENABLE_METHODOLOGY_SELECTION=true
ENABLE_DOCUMENT_UPLOAD=true
ENABLE_GUARDIAN_IMPORT=true
```

---

## 8. Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Guardian API Access Limitations** | High | Medium | Start with public Verra Hub, deploy own instance if needed |
| **IIFM Template Access Restrictions** | Medium | Medium | IIFM templates require membership; use publicly available standards or generic Mudarabah template |
| **AI Digitization Accuracy** | High | Medium | Implement manual review step, allow schema editing before finalization |
| **Complexity of Guardian Schema** | Medium | High | Start with simplified schema, iterate based on user feedback |
| **Integration Disruption** | High | Low | Build as separate component, thorough backward compatibility testing |
| **Performance with Large Documents** | Medium | Medium | Implement async processing, progress indicators, size limits |

---

## 9. Success Metrics

### Phase 1-2 (Foundation & Integration)
- [ ] Successfully import 3+ methodologies from Guardian instances
- [ ] Methodology listing UI matches existing app quality
- [ ] Search and filter functions work accurately

### Phase 3 (Document Digitization)
- [ ] AI successfully extracts compliance requirements from test documents
- [ ] Generated schemas validate correctly in Guardian format
- [ ] Processing time < 2 minutes for typical contract document

### Phase 4 (Mudarabah POC)
- [ ] Complete Mudarabah contract digitization end-to-end
- [ ] Shariah compliance validation functions correctly
- [ ] Multi-stakeholder workflow executes successfully

### Phase 5-6 (Integration & Production)
- [ ] Zero disruption to existing workflows
- [ ] < 5% increase in average workflow completion time
- [ ] Methodology selection adoption > 30% within first month
- [ ] User satisfaction score > 4/5

---

## 10. Open Questions for User Confirmation

### Critical Decisions Needed:

1. **Guardian Instance Strategy**
   - ❓ Do we have access to Verra Project Hub API?
   - ❓ Should we deploy our own Guardian instance?
   - ❓ Is there an IIFM Guardian instance we can connect to?

2. **IIFM Template Access**
   - ❓ Do we have IIFM membership for template access?
   - ❓ Should we use publicly available Mudarabah resources instead?
   - ❓ Can we obtain sample templates for POC?

3. **Scope Clarification**
   - ❓ Is Step 2 a replacement for current workflow selection, or an addition?
   - ❓ Should methodology selection be optional or required?
   - ❓ Do we want to support environmental methodologies (VM0033, etc.) or Islamic finance only?

4. **AI Digitization Features**
   - ❓ Should document upload be Phase 3 or later?
   - ❓ How much manual review/editing should be required after AI generation?
   - ❓ Should we support real-time collaboration on methodology editing?

5. **Timeline & Priorities**
   - ❓ Is 12-week timeline acceptable?
   - ❓ Which phases are highest priority?
   - ❓ Should we do MVP (Phases 1-2) first, then decide on next steps?

---

## 11. Next Steps

### Immediate Actions (Pending Your Approval):

1. **Confirm Understanding**
   - ✅ Review this plan
   - ✅ Confirm scope and objectives
   - ✅ Answer open questions above

2. **Access & Credentials**
   - [ ] Obtain Guardian API access (Verra or self-hosted)
   - [ ] Secure IIFM template access (if possible)
   - [ ] Set up development Guardian instance

3. **Begin Implementation**
   - [ ] Create methodology service skeleton
   - [ ] Set up Guardian client
   - [ ] Build basic UI components
   - [ ] Test Guardian connectivity

---

## Appendix A: Guardian Methodology Structure Example

**Example: VM0033 Methodology JSON Structure**
```json
{
  "id": "vm0033-v2.1",
  "name": "Methodology for Tidal Wetland and Seagrass Restoration",
  "version": "2.1",
  "status": "active",
  "schemas": [
    {
      "id": "vm0033-pdd",
      "name": "Project Design Document",
      "type": "general-data",
      "fields": [
        {
          "name": "project_title",
          "type": "string",
          "required": true,
          "description": "Official project title"
        },
        {
          "name": "project_location",
          "type": "geopoint",
          "required": true,
          "description": "Geographic coordinates"
        }
        // ... 400+ more fields
      ]
    },
    {
      "id": "vm0033-monitoring",
      "name": "Monitoring Report",
      "type": "parameter-data",
      "fields": [
        {
          "name": "biomass_density",
          "type": "number",
          "unit": "t d.m. ha-1",
          "equation": "Equation 15",
          "source": "Field measurements or literature",
          "required": true
        }
        // ... calculation parameters
      ]
    }
  ],
  "policy": {
    "roles": ["project_developer", "vvb", "standard_registry"],
    "workflow": {
      "steps": [
        {
          "id": "project_registration",
          "role": "project_developer",
          "schema": "vm0033-pdd",
          "next": "validation"
        },
        {
          "id": "validation",
          "role": "vvb",
          "actions": ["approve", "reject"],
          "next": "registry_approval"
        }
        // ... more workflow steps
      ]
    }
  }
}
```

**This structure maps to Islamic Finance:**
```json
{
  "id": "mudarabah-sukuk-tier1",
  "name": "Mudarabah Sukuk Issuance (IIFM Standard 14)",
  "version": "1.0",
  "status": "certified",
  "schemas": [
    {
      "id": "mudarabah-contract",
      "name": "Mudarabah Contract Details",
      "type": "general-data",
      "fields": [
        {
          "name": "mudarib_name",
          "type": "string",
          "required": true,
          "description": "Name of Mudarib (Investment Manager)"
        },
        {
          "name": "capital_amount",
          "type": "number",
          "unit": "USD",
          "required": true,
          "description": "Rab-ul-Mal Capital Contribution"
        },
        {
          "name": "profit_sharing_ratio",
          "type": "object",
          "fields": [
            {"name": "mudarib_percentage", "type": "number"},
            {"name": "rab_ul_mal_percentage", "type": "number"}
          ],
          "validation": "sum_equals_100",
          "required": true
        }
      ]
    },
    {
      "id": "shariah-compliance",
      "name": "Shariah Compliance Validation",
      "type": "validation-data",
      "fields": [
        {
          "name": "shariah_board_approval",
          "type": "boolean",
          "required": true
        },
        {
          "name": "aaoifi_compliance_checklist",
          "type": "checklist",
          "items": [
            "No riba (interest) elements",
            "No gharar (excessive uncertainty)",
            "No maysir (gambling/speculation)",
            "Profit/loss sharing implemented",
            "Asset-backed instrument"
          ]
        }
      ]
    }
  ],
  "policy": {
    "roles": [
      "issuer_mudarib",
      "investor_rab_ul_mal",
      "shariah_advisor",
      "trustee",
      "regulator"
    ],
    "workflow": {
      "steps": [
        {
          "id": "contract_drafting",
          "role": "issuer_mudarib",
          "schema": "mudarabah-contract",
          "next": "shariah_review"
        },
        {
          "id": "shariah_review",
          "role": "shariah_advisor",
          "schema": "shariah-compliance",
          "actions": ["certify", "request_changes"],
          "next": "regulatory_approval"
        },
        {
          "id": "regulatory_approval",
          "role": "regulator",
          "actions": ["approve", "reject"],
          "next": "issuance"
        }
      ]
    }
  }
}
```

---

## Conclusion

This plan provides a comprehensive roadmap for integrating Hedera Guardian's methodology digitization framework into Islamic Finance Workflows, starting with Mudarabah contract digitization. The approach is:

✅ **Modular** - Build as separate component, plug in later
✅ **Scalable** - Foundation supports any methodology type
✅ **AI-Powered** - Leverage Claude for intelligent digitization
✅ **Standards-Based** - Align with IIFM, AAOIFI, Guardian frameworks
✅ **User-Friendly** - Professional UI/UX matching existing application

**Ready for your review and confirmation!**

---

**Document Version**: 1.0
**Last Updated**: November 4, 2025
**Next Review**: Upon user confirmation and phase kickoff
