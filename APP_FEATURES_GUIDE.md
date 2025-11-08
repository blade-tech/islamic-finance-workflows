# ZeroH Platform - Complete Features Guide

**Version**: 1.0
**Last Updated**: November 7, 2025
**Purpose**: Comprehensive reference for all platform features, workflows, and navigation

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [12-Step Workflow Deep Dive](#12-step-workflow-deep-dive)
3. [Navigation Pages](#navigation-pages)
4. [Key Features & Capabilities](#key-features--capabilities)
5. [Data Tour Attributes Reference](#data-tour-attributes-reference)
6. [Demo Script Recommendations](#demo-script-recommendations)

---

## Platform Overview

**ZeroH** is a Sustainable Islamic Finance governance, monitoring and risk management system that combines:
- **AI-powered compliance analysis** (Claude, OpenAI, LlamaIndex)
- **Blockchain integration** (Hedera Guardian, HCS, HTS)
- **Knowledge graph** (Graphiti + Neo4j) with 23 Islamic finance disciplines
- **Modular architecture** - Each component works standalone or as part of complete workflow

### Core Value Propositions

1. **Modularity**: Use impact measurement alone OR full product creation workflow
2. **AI-Native**: Auto-fill suggestions, compliance analysis, contract generation
3. **Blockchain-Ready**: Deploy to Hedera with Guardian policy engine
4. **Standards-Based**: AAOIFI, IFRS, ICMA frameworks embedded

---

## 12-Step Workflow Deep Dive

### Step 0: Overview Screen
**Route**: `/` (when currentStepIndex = 0)
**Component**: `src/components/workflow/OverviewScreen.tsx`

**Purpose**: Intent-driven landing page showing 4 modular use cases

**Key Features**:
- **4 Use Case Cards**:
  1. **Complete Workflow** (15-20 min) - Full Islamic finance product creation
  2. **Impact Measurement** (5-7 min) - ESG/sustainability tracking only (Modular badge)
  3. **Quick Compliance Check** (3-5 min) - Shariah validation of existing contracts
  4. **Asset Tokenization** (10-12 min) - Blockchain deployment focus (Phase 3, disabled)

**Interactive Elements**:
- Use case cards with time estimates
- Feature checklists with checkmarks
- "Start [Use Case]" buttons
- "Learn More" link to `/welcome`

**Demo Value**:
- Shows platform modularity upfront
- Clear time commitment for each use case
- Professional feature lists (connect to Shariah sources, test in sandbox, deploy to blockchain)
- Phase badges show transparent roadmap

**Tour Opportunities** (3-4 steps):
1. Welcome message explaining modular platform concept
2. Highlight "Complete Workflow" card with full feature list
3. Point out "Impact Measurement" as standalone capability (Modular badge)
4. Explain "Coming Soon" features with Phase badges

---

### Step 1: Connect Sources
**Route**: `/` (when currentStepIndex = 1)
**Component**: `src/components/workflow/steps/Step1SourceConnection.tsx`
**File Size**: 836 lines

**Purpose**: Backend architecture overview showcasing connected services + optional knowledge graph search

**Key Features**:

#### Backend Architecture Overview Card
- **4 Core AI Services** (all green ✓):
  1. **Graphiti Knowledge Graph** - Neo4j + semantic search
  2. **Document Processing** - LlamaIndex + vector embeddings
  3. **AI Orchestrator** - Claude Sonnet 4.5 + reasoning
  4. **MCP Integration** - Model Context Protocol for tool use

- **4 Blockchain Services** (amber, in-development):
  1. **Hedera Guardian** - Policy engine integration
  2. **HCS (Consensus Service)** - Immutable audit trails
  3. **HTS (Token Service)** - NFT certificate minting
  4. **IPFS** - Decentralized document storage

- **2 Asset Tokenization Services** (development):
  1. **Tokenization Studio** - Certificate issuance
  2. **Digital Asset Registry** - On-chain tracking

- **3 Research & Discovery Services** (development):
  1. **Perplexity** - Real-time research
  2. **Metaphor** - Semantic document discovery
  3. **Tavily** - Regulatory monitoring

#### Knowledge Base Accordion (23 Disciplines)
- **7 Shariah Structures**: Ijara, Murabaha, Musharaka, Mudaraba, Istisna, Salam, Wakala
- **5 Jurisdictions**: UAE DFSA, Saudi CMA, Qatar QFC, Malaysia SC, Luxembourg
- **3 Accounting Frameworks**: AAOIFI, IFRS+Islamic, Local GAAP
- **8 Impact Metrics**: Green Sukuk (ICMA), SDG, ESG, QFC Sustainable, VBI Malaysia, Islamic Social Finance, CBI, No Impact

#### AI Compliance Analysis Card (`data-tour="ai-analysis"`)
- **Natural language search** of knowledge graph
- **Search results** with relevance scores (0.0-1.0)
- **Citation display** with confidence indicators
- **Example queries**: "What are the requirements for Ijara Sukuk?", "Explain Murabaha accounting"

**Interactive Elements**:
- Backend services cards (click to expand)
- Knowledge base accordion (click to view sources)
- Search input + button
- Results display with citations

**Demo Value**:
- **4/4 AI Services Connected** - Professional credibility
- **Knowledge graph depth** - 23 disciplines, 20+ authoritative sources
- **Live search demo** - Ask "What is Murabaha?" and get instant knowledge graph response
- **Development roadmap transparency** - Blockchain services clearly marked as in-progress

**Tour Opportunities** (2-3 steps):
1. Backend Architecture Overview card (`data-tour="methodology-connect"`) - Highlight 4/4 connected AI services
2. Knowledge Base accordion - Show 23 disciplines across 4 categories
3. AI Search Demo (`data-tour="ai-analysis"`) - Demonstrate natural language query capability

---

### Step 2: Select Shariah Structure
**Route**: `/` (when currentStepIndex = 2)
**Component**: `src/components/workflow/steps/Step2SelectShariahStructure.tsx`

**Purpose**: Select Islamic finance contract structure (Component 1 of 4) + optional Sukuk securitization + optional Takaful overlay

**Key Features**:

#### AI Guidance Alert
- Suggests structure based on use case
- Can be dismissed

#### 6 Shariah Structure Cards (`data-tour="structure-selection"`)
1. **Ijara (Lease-Based)**
   - Market share: **60%** (badge)
   - AAOIFI Standard: SS 9, FAS 33
   - Use cases: Real estate, equipment financing
   - Click to select

2. **Murabaha (Cost-Plus Financing)**
   - Market share: 25%
   - AAOIFI Standard: FAS 28
   - Use cases: Trade finance, commodity financing

3. **Musharaka (Partnership)**
   - AAOIFI Standard: FAS 4
   - Use cases: Project finance, joint ventures

4. **Mudaraba (Trust-Based Profit Sharing)**
   - AAOIFI Standard: SS 40
   - Use cases: Investment accounts, fund management

5. **Sukuk (Islamic Bonds)**
   - AAOIFI Standard: SS 62, FAS 33
   - Use cases: Capital markets, sovereign issuance

6. **Istisna/Salam/Wakala** (grouped)
   - Various standards
   - Use cases: Manufacturing, agriculture, agency

#### Sukuk Securitization Toggle
- **Card with switch** - "Add Sukuk Securitization Layer?"
- **Explanation**: Convert direct financing into tradable certificates
- **Implications**: Adds SPV structure, investor prospectus requirements

#### Takaful Overlay (Optional)
- **Switch** to enable Islamic insurance
- **Model selection** when enabled:
  - Mudaraba Model (profit-sharing)
  - Wakalah Model (agency fee)
  - Hybrid Model
- **Coverage type selection**: Property, Liability, Takaful-General

#### Methodology Upload Flow
- **Component**: `MethodologyUploadFlow`
- Upload custom Shariah methodology documents
- AI extraction of principles

**Interactive Elements**:
- 6 structure cards (click to select, green border when selected)
- Sukuk toggle switch
- Takaful toggle + model dropdown
- Info icons (ⓘ) with hover tooltips
- Upload button for custom methodologies

**Demo Value**:
- **60% market share badge** - Ijara dominance in Islamic finance
- **Real-world use cases** - Every structure shows practical applications
- **Sukuk vs. Direct Financing** - Clear explanation of securitization concept
- **Takaful uniqueness** - Islamic insurance as add-on (differentiator vs. conventional)
- **AAOIFI compliance built-in** - Standards shown for each structure

**Tour Opportunities** (3-4 steps):
1. Structure selection cards (`data-tour="structure-selection"`) - Highlight Ijara with 60% badge
2. Info icons (ⓘ) - Show how to get detailed explanations
3. Sukuk toggle - Explain securitization layer concept
4. Takaful overlay - Show optional Islamic insurance feature

---

### Step 3: Select Jurisdiction
**Route**: `/` (when currentStepIndex = 3)
**Component**: `src/components/workflow/steps/Step3SelectJurisdiction.tsx`

**Purpose**: Select regulatory framework (Component 2 of 4)

**Key Features**:

#### AI Guidance Alert
- Suggests jurisdiction based on issuer location
- Shows compatibility with selected Shariah structure

#### 4 Jurisdiction Cards
1. **UAE DFSA (Dubai International Financial Centre)**
   - **Tax rate**: 0% (green badge)
   - **Language**: Arabic + English
   - **Currency**: USD, AED
   - **Listing**: Dubai Stock Exchange
   - **Regulatory framework**: DFSA Rulebook - Sukuks Module
   - **Click to select**

2. **Saudi CMA (Capital Market Authority)**
   - **Tax rate**: 20% (amber badge)
   - **Mandatory**: AAOIFI accounting (red alert)
   - **Language**: Arabic required
   - **Currency**: SAR
   - **Listing**: Tadawul (Saudi Exchange)
   - **Regulatory framework**: CMA Islamic Finance Guide

3. **Qatar QFC (Qatar Financial Centre)**
   - **Tax rate**: 0% (green badge)
   - **Language**: Arabic + English
   - **Currency**: USD, QAR
   - **Listing**: Qatar Stock Exchange
   - **Regulatory framework**: QFC IBANK 10.1.2 - Sukuk + QFC Sustainable Sukuk Framework
   - **Sustainability focus**: Green/sustainable sukuk specialization

4. **Malaysia SC (Securities Commission)**
   - **Tax rate**: 24% (amber badge)
   - **Language**: Malay + English
   - **Currency**: MYR
   - **Listing**: Bursa Malaysia
   - **Regulatory framework**: Guidelines on Islamic Capital Market Products
   - **Unique feature**: VBI (Value-Based Intermediation) framework

#### Jurisdiction Impact Alerts
- **If Saudi selected**: Shows "AAOIFI accounting is mandatory" (red alert)
- **If Qatar selected**: Shows "Consider sustainable sukuk framework" (blue info)
- **If Malaysia selected**: Shows "VBI framework available for impact measurement" (blue info)

**Interactive Elements**:
- 4 jurisdiction cards (click to select)
- Tax rate badges (color-coded: green for 0%, amber for taxed)
- Required accounting alerts
- External links to regulatory frameworks

**Demo Value**:
- **Tax-free jurisdictions** - UAE/Qatar 0% vs. Saudi 20% shows strategic choice
- **Mandatory compliance** - Saudi CMA → AAOIFI requirement (enforced by system)
- **Language requirements** - Arabic-first for Saudi, Malay for Malaysia
- **Sustainability leadership** - Qatar's specialized green sukuk framework
- **Market access** - Each has specific listing requirements

**Tour Opportunities** (3-4 steps):
1. Jurisdiction cards overview - Show 4 major Islamic finance hubs
2. Tax rate comparison - Highlight 0% (UAE/Qatar) vs. 20% (Saudi)
3. Mandatory accounting alert - Show Saudi CMA → AAOIFI requirement
4. Regulatory framework links - External resources for due diligence

---

### Step 4: Select Accounting
**Route**: `/` (when currentStepIndex = 4)
**Component**: `src/components/workflow/steps/Step4SelectAccounting.tsx`

**Purpose**: Select accounting framework (Component 3 of 4)

**Key Features**:

#### Jurisdiction Context Alert
- Shows selected jurisdiction
- Explains accounting constraints (if any)
- e.g., "Saudi CMA requires AAOIFI accounting"

#### AI Guidance Alert
- Recommends accounting framework based on jurisdiction + structure
- Can be dismissed

#### 3 Accounting Framework Cards
1. **AAOIFI (Islamic Accounting Standards)**
   - **Badge**: "Required" (if Saudi jurisdiction selected) OR "Recommended" (default)
   - **Standards**: 62+ Financial Accounting Standards (FAS), 65+ Shariah Standards (SS)
   - **Coverage**:
     - FAS 33 - Investment Sukuk
     - FAS 28 - Murabaha
     - FAS 4 - Musharaka
     - SS 9 - Ijara
     - SS 62 - Sukuk
   - **Global reach**: Used by 200+ institutions in 50+ countries
   - **Link**: [aaoifi.com](https://aaoifi.com)

2. **IFRS + Islamic (Hybrid Framework)**
   - **Badge**: "International"
   - **Use case**: Cross-border issuances needing IFRS compliance
   - **Approach**: IFRS 9 (Financial Instruments) + Shariah-compliant adjustments
   - **Coverage**:
     - IFRS 9 - Sukuk classification as financial assets
     - IFRS 15 - Revenue recognition for Murabaha
     - IAS 17 / IFRS 16 - Ijara lease accounting
   - **Compatibility**: May conflict with pure AAOIFI approach
   - **Academic research**: SSRN papers on AAOIFI vs. IFRS reconciliation

3. **Local GAAP (Jurisdiction-Specific)**
   - **Availability**: Depends on selected jurisdiction
   - **Coverage**: National accounting standards + Islamic finance supplements
   - **Examples**:
     - Malaysia: MFRS (Malaysian Financial Reporting Standards) + BNM guidance
     - UAE: UAE Commercial Companies Law + DFSA requirements
     - Luxembourg: Luxembourg GAAP + CSSF circulars
   - **Grayed out if incompatible**: e.g., Saudi requires AAOIFI (Local GAAP disabled)

#### Compatibility Validation
- **If Saudi jurisdiction**: Only AAOIFI selectable (others grayed out with "Not permitted" tooltip)
- **If other jurisdictions**: All 3 options available
- **Conflict warnings**: Shows if IFRS conflicts with pure Shariah approach

**Interactive Elements**:
- 3 accounting cards (click to select, green border when selected)
- "Required" / "Recommended" / "International" badges
- Standards lists (expandable)
- External links to AAOIFI, IFRS websites
- Grayed-out incompatible options

**Demo Value**:
- **AAOIFI global benchmark** - 62+ FAS, 65+ SS, 200+ institutions
- **Mandatory enforcement** - Saudi CMA requires AAOIFI (system enforces)
- **IFRS reconciliation challenge** - IFRS+Islamic option shows complexity
- **Professional standards** - Links to authoritative sources
- **Compatibility validation** - Grayed-out options show intelligent constraints

**Tour Opportunities** (3-4 steps):
1. Jurisdiction context - Show how selected jurisdiction affects accounting choice
2. AAOIFI card - Highlight global benchmark (62+ FAS, 65+ SS)
3. Mandatory enforcement - If Saudi selected, show "Required" badge and disabled alternatives
4. Standards detail - Expand standards list to show FAS 33, FAS 28, etc.

---

### Step 5: Select Impact Metrics
**Route**: `/` (when currentStepIndex = 5)
**Component**: `src/components/workflow/steps/Step5SelectImpact.tsx`

**Purpose**: Select impact/ESG frameworks (Component 4 of 4) - **MULTI-SELECT**

**Key Features**:

#### AI Guidance Alert
- **Key message**: "You can select multiple frameworks or 'No Impact'"
- Suggests frameworks based on Shariah structure + jurisdiction

#### 4 Impact Framework Cards (Multi-Select)
1. **Green Sukuk (ICMA Principles)**
   - **Category badge**: Environmental (green)
   - **Standards**: ICMA Green Bond Principles + IsDB/LSEG Guidance
   - **Use cases**: Renewable energy, green buildings, clean transport
   - **Certification**: Pre-issuance verification required
   - **Reporting**: Annual impact reports mandatory
   - **Real example**: "IDB Green Sukuk 2019 ($2.5B for climate projects)"
   - **Link**: [ICMA Green Sukuk Guidance PDF](https://www.icmagroup.org/assets/documents/Sustainable-finance/ICMA-IsDB-LSEG-Guidance-on-Green-Social-and-Sustainability-Sukuk-April-2024.pdf)

2. **SDG-Linked (UN Sustainable Development Goals)**
   - **Category badge**: Social (blue)
   - **Standards**: UN SDG Investment Framework
   - **Coverage**: 17 SDGs (poverty, health, education, climate, etc.)
   - **Reporting**: SDG impact metrics (# beneficiaries, emissions reduced, etc.)
   - **Certification**: Not mandatory, but encouraged
   - **Real example**: "IsDB SDG Sukuk 2020 ($1.5B for healthcare/education)"
   - **Link**: [UNDP Green Sukuk Report](https://www.undp.org/publications/potential-growth-and-future-trends-green-sukuk-tool-sustainable-financing)

3. **ESG Framework (Environmental, Social, Governance)**
   - **Category badge**: Governance (purple)
   - **Standards**: MSCI ESG Ratings, S&P Global ESG Scores, Fitch ESG Relevance
   - **Coverage**: E (climate, waste), S (labor, human rights), G (board, transparency)
   - **Reporting**: Annual ESG disclosure, third-party ratings
   - **Certification**: Optional ESG ratings from agencies
   - **Use case**: Institutional investors requiring ESG compliance

4. **No Impact**
   - **Category badge**: None (gray)
   - **Use case**: Conventional structures without ESG/sustainability focus
   - **Note**: Select this if no impact measurement needed
   - **Mutually exclusive**: Cannot combine with other frameworks

#### Multi-Select Behavior
- **Can select**: Green Sukuk + SDG-Linked + ESG (combine all 3)
- **Cannot select**: "No Impact" + any other framework (mutually exclusive)
- **Visual indicator**: Multiple green borders when multiple selected

#### Certification Requirements Alert
- **If Green Sukuk selected**: Shows "Pre-issuance verification required by ICMA" (amber alert)
- **If SDG selected**: Shows "Annual SDG impact reporting required" (blue info)
- **If ESG selected**: Shows "Consider third-party ESG rating" (blue info)

**Interactive Elements**:
- 4 impact cards (multi-select, green borders on selection)
- Category badges (Environmental, Social, Governance, None)
- Certification alerts (appear when selecting Green Sukuk)
- Use case lists (expandable)
- Real example boxes
- External links to frameworks

**Demo Value**:
- **Multi-select capability** - Unique feature (can combine Green + SDG + ESG)
- **Real examples with amounts** - IDB $2.5B, IsDB $1.5B (credibility)
- **Certification requirements** - ICMA pre-issuance verification (professional rigor)
- **ESG rating agencies** - MSCI, S&P, Fitch (institutional-grade)
- **Flexibility** - "No Impact" option for conventional structures

**Tour Opportunities** (3-5 steps):
1. Multi-select explanation - Show AI guidance alert about multiple selection
2. Green Sukuk card - Highlight ICMA Principles + real $2.5B example
3. SDG-Linked card - Show 17 SDGs and impact metrics
4. Multi-select demo - Click Green + SDG to show both can be selected
5. "No Impact" option - Explain for conventional structures

---

### Step 6: Review Configuration
**Route**: `/` (when currentStepIndex = 6)
**Component**: `src/components/workflow/steps/Step6ReviewConfiguration.tsx`

**Purpose**: Review and validate complete 4-component configuration before proceeding

**Key Features**:

#### Configuration Summary Header
- **Configuration name**: Auto-generated (e.g., "Ijara Sukuk - UAE DFSA - AAOIFI - Green Sukuk")
- **Created date**: Timestamp
- **Status badge**: "Valid" (green) or "Invalid" (red)

#### 4 Component Summary Cards
1. **Shariah Structure Card**
   - Shows selected structure (e.g., "Ijara")
   - Sukuk layer indicator (if enabled)
   - Takaful overlay indicator (if enabled)
   - **Edit button** → Returns to Step 2

2. **Jurisdiction Card**
   - Shows selected jurisdiction (e.g., "UAE DFSA")
   - Tax rate, language requirements
   - **Edit button** → Returns to Step 3

3. **Accounting Card**
   - Shows selected framework (e.g., "AAOIFI")
   - Applicable standards (FAS 33, etc.)
   - **Edit button** → Returns to Step 4

4. **Impact Metrics Card**
   - Shows selected frameworks (e.g., "Green Sukuk, SDG-Linked")
   - Certification requirements
   - **Edit button** → Returns to Step 5

#### Validation Results Section
- **Success alert** (green):
  - "✓ Configuration is valid and ready to proceed"
  - Shows what was validated:
    - ✓ Shariah structure compatibility
    - ✓ Jurisdiction requirements met (e.g., Saudi → AAOIFI)
    - ✓ Accounting framework compatible
    - ✓ Impact frameworks compatible

- **Error alert** (red, if invalid):
  - "✗ Configuration has errors that must be fixed"
  - Lists specific errors:
    - ✗ Saudi CMA requires AAOIFI accounting (if IFRS selected)
    - ✗ Green Sukuk requires impact measurement (if "No Impact" selected)
  - **Fix buttons** next to each error

- **Warning alert** (amber, informational):
  - "⚠ Recommendations (optional)"
  - Shows suggestions:
    - ⚠ Consider ICMA Green Sukuk verification for credibility
    - ⚠ Qatar QFC has specialized sustainable framework

#### Continue Button
- **Enabled** only when configuration is valid
- **Disabled** with tooltip explaining errors if invalid
- Proceeds to Step 7 (Configure Details)

**Interactive Elements**:
- 4 component summary cards
- Edit buttons (return to specific step)
- Validation status alerts
- Fix buttons next to errors
- Continue button (enabled/disabled based on validation)

**Demo Value**:
- **Configuration validation logic** - Shows intelligent compatibility checking
- **Error vs. warning distinction** - Errors block progress, warnings are informational
- **Configuration name generation** - Professional naming convention
- **Edit capability** - Each component editable without losing progress
- **Visual status indicators** - Green ✓ for valid, red ✗ for invalid

**Tour Opportunities** (3-4 steps):
1. Configuration summary - Show auto-generated name and 4 components
2. Validation results - Highlight green success alerts with checkmarks
3. Edit buttons - Show how to go back and change any component
4. Continue button logic - Explain enabled only when valid

---

### Step 7: Configure Details
**Route**: `/` (when currentStepIndex = 7)
**Component**: `src/components/workflow/steps/Step7ConfigureDetails.tsx`

**Purpose**: Dynamic form composition from all 4 selected components + AI auto-fill + document upload

**Key Features**:

#### Configuration Summary Card
- Shows 4 components selected
- Collapsible

#### AI Assistance Toggle
- **Button**: "Enable AI Auto-Fill" (toggle on/off)
- **When enabled**: Sparkles (✨) icons appear next to each field
- **Behavior**: Clicking sparkles fills field with AI suggestion

#### Dynamic Form Sections (5 cards)
**Section 1: Shariah Structure Details**
- **Fields** (example for Ijara):
  - Asset description (text area with AI ✨)
  - Lease term (number + unit dropdown)
  - Rental rate (number + percentage/fixed dropdown)
  - Ownership transfer clause (radio buttons: Yes/No)
  - AAOIFI FAS 33 compliance checkbox (auto-checked)
- **Standards display**: Shows "✓ AAOIFI SS 9 (Ijara)" as green badge
- **Validation**: Real-time error messages if invalid

**Section 2: Jurisdiction Compliance**
- **Fields** (example for UAE DFSA):
  - Regulatory disclosure document (file upload)
  - Offering memorandum (file upload)
  - DFSA approval status (dropdown: Pending/Approved)
  - Listing exchange (dropdown: Dubai Stock Exchange)
- **Standards display**: Shows "✓ DFSA Rulebook - Sukuks Module" as green badge

**Section 3: Accounting Treatment**
- **Fields** (example for AAOIFI):
  - Financial statements prepared by (text input with AI ✨)
  - Audit firm (text input with AI ✨)
  - Accounting period (date range)
  - FAS 33 application confirmation (checkbox)
- **Standards display**: Shows "✓ AAOIFI FAS 33" as green badge

**Section 4: Impact Measurement** (if selected)
- **Fields** (example for Green Sukuk):
  - Use of proceeds description (text area with AI ✨)
  - Green project categories (multi-select checkboxes: Renewable Energy, Green Buildings, Clean Transport)
  - Estimated CO2 reduction (number + metric tons)
  - Third-party verifier (text input with AI ✨)
  - ICMA Green Bond Principles compliance checkbox
- **Standards display**: Shows "✓ ICMA Green Bond Principles" as green badge

**Section 5: Takaful Details** (if Takaful overlay enabled in Step 2)
- **Fields**:
  - Takaful provider (text input with AI ✨)
  - Coverage amount (number + currency)
  - Premium calculation method (dropdown: Mudaraba/Wakalah/Hybrid)
  - Policy term (number + years)

#### AI Auto-Fill Demonstration
- **Click Sparkles (✨)** next to "Asset description":
  - AI suggests: "Commercial real estate property located in Dubai Internet City, comprising 5 floors of office space with total area 50,000 sq ft, valued at $25 million, with existing lease agreements generating $2M annual rental income"
- **Click Sparkles (✨)** next to "Use of proceeds":
  - AI suggests: "Proceeds will finance solar panel installation across 10 commercial buildings, expected to generate 5 MW renewable energy and reduce CO2 emissions by 3,000 metric tons annually"
- **Click Sparkles (✨)** next to "Financial statements prepared by":
  - AI suggests: "KPMG Dubai"

#### Document Upload Section
- **File upload component** (drag-and-drop or click)
- **Accepted formats**: PDF, DOCX, XLSX
- **AI extraction promise**: "AI will extract key terms from uploaded documents"
- **Progress indicators**: Shows file upload progress
- **File list**: Displays uploaded files with remove buttons

#### Validation & Continue
- **Real-time validation**: Red error messages appear below invalid fields
- **Continue button**: Enabled only when all required fields valid
- **Save draft button**: Save progress without completing

**Interactive Elements**:
- Configuration summary (collapsible)
- AI toggle button
- Sparkles icons (✨) next to fields (when AI enabled)
- Dynamic form fields (text inputs, dropdowns, checkboxes, radio buttons)
- File upload (drag-and-drop)
- Continue button (enabled/disabled based on validation)

**Demo Value**:
- **Dynamic field composition** - Form fields come from all 4 components (no hardcoding)
- **AI auto-fill magic** - Sparkles icons with intelligent suggestions for every field
- **Standards auto-applied** - AAOIFI FAS 33, ICMA GBP shown as green checkmarks
- **Professional suggestions** - AI suggests "KPMG Dubai" for audit firm (realistic)
- **Document upload + AI extraction** - Promise of AI extracting key terms from PDFs
- **Real-time validation** - Instant feedback on invalid fields

**Tour Opportunities** (4-6 steps):
1. Configuration summary - Show 4 components feeding into dynamic form
2. AI toggle - Demonstrate enabling AI auto-fill (sparkles appear)
3. AI auto-fill demo - Click sparkles next to "Asset description" to show AI suggestion
4. Standards display - Highlight auto-applied standards (AAOIFI FAS 33, etc.)
5. Document upload - Show drag-and-drop with AI extraction promise
6. Validation - Show real-time error messages on invalid fields

---

### Step 8: Review Policy Structure
**Route**: `/` (when currentStepIndex = 8)
**Component**: `src/components/workflow/steps/Step8ReviewPolicyStructure.tsx`

**Purpose**: 3-column BPMN workflow visualization (ServiceNow Flow Designer-inspired)

**Key Features**:

#### Policy Metadata Section (Top, Collapsible)
**3 summary cards**:
1. **Policy Overview Card**
   - Policy name: "Ijara Sukuk Workflow"
   - Version: 1.0.0
   - Status: Draft
   - Created: [timestamp]
   - Estimated execution time: 15-20 minutes

2. **Components Card**
   - Workflow schemas: 10 (e.g., IjaraContract, AssetOwnership, RentalPayment)
   - Workflow steps: 12 (detailed in BPMN)
   - Sub-workflows: 3 (Main, ESG Verification, Audit)
   - Required roles: 5 (Issuer, Shariah Advisor, Auditor, Custodian, Investor)

3. **Standards Card**
   - AAOIFI FAS 33 ✓
   - DFSA Rulebook ✓
   - ICMA Green Bond Principles ✓
   - Hedera Guardian compatible ✓

#### Main Layout: 3-Column BPMN Viewer

**Left Column (200px): Workflow Navigator**
- **Main Workflow** (bold, always visible)
  - Button showing "12 steps"
  - Click to load main BPMN in center column

- **Sub-Workflows** (expandable)
  - "ESG Verification" (4 steps)
  - "Audit Process" (6 steps)
  - "Asset Transfer" (3 steps)

- **Legend** (bottom)
  - Start Event (green circle)
  - User Task (blue rectangle)
  - Service Task (gray rectangle)
  - Gateway (yellow diamond)
  - End Event (red circle)

**Center Column (Flexible): BPMN Canvas Viewer**
- **BPMN.js viewer** - Interactive BPMN 2.0 diagram
- **Main Workflow Steps** (12 steps total):
  1. Start → Issuer submits application
  2. User Task → Shariah board preliminary review
  3. Service Task → AI compliance analysis (automated)
  4. User Task → Asset valuation by appraiser
  5. Gateway → Valuation acceptable? (diamond, branches)
  6. User Task → Shariah board final approval
  7. Service Task → Generate documentation (automated)
  8. User Task → Custodian confirms asset custody
  9. Service Task → Record on Hedera HCS (blockchain)
  10. User Task → Investor subscription period
  11. Service Task → Mint NFT certificates via HTS (blockchain)
  12. End → Sukuk issuance complete

- **Interactive elements**:
  - Click any BPMN element → Right panel slides in with details
  - Hover → Tooltips show step names
  - Zoom controls (+ / - buttons)
  - Fit to view button

- **Color coding**:
  - User tasks: Blue
  - Service tasks (automated): Gray
  - Blockchain tasks: Purple
  - Gateways: Yellow
  - Start/End: Green/Red

**Right Column (300px): Step Details Panel** (slides in on click)
- **Triggered by**: Clicking any BPMN element in center column

- **Panel contents** (example: User Task "Shariah board final approval"):
  - **Step name**: "Shariah board final approval"
  - **Type**: User Task
  - **Assigned role**: Shariah Advisor
  - **Description**: "Shariah board reviews complete application and provides final approval or rejection with justification"
  - **Required documents**:
    - Ijara contract draft
    - Asset valuation report
    - Rental schedule
    - Shariah compliance checklist
  - **Estimated duration**: 3-5 business days
  - **Completion criteria**:
    - Shariah board signature obtained
    - Approval documented in system
    - Conditions precedent list (if any) created
  - **Next steps**:
    - If approved → "Generate documentation"
    - If rejected → Return to "Asset valuation" (rework)

- **Close button**: X icon to close panel

**Interactive Elements**:
- Workflow navigator buttons (click to switch between main/sub-workflows)
- BPMN canvas (click elements, zoom, pan)
- Step details panel (slides in/out)
- Collapsible metadata cards

**Demo Value**:
- **Professional BPMN visualization** - Real BPMN.js viewer (industry standard)
- **12-step workflow** - Complete end-to-end process shown visually
- **Role assignments** - Each user task shows assigned role (Shariah Advisor, Auditor, etc.)
- **Blockchain integration** - Purple tasks show Hedera HCS/HTS steps
- **Interactive exploration** - Click any step to see details (assigned role, documents, duration)
- **Sub-workflows** - Shows modularity (ESG Verification, Audit Process as separate flows)
- **Estimated durations** - Professional project planning (3-5 business days for Shariah approval)

**Tour Opportunities** (4-5 steps):
1. 3-column layout overview - Explain navigator, canvas, details panel
2. Workflow navigator - Show main workflow (12 steps) + sub-workflows
3. BPMN canvas - Highlight key steps (Shariah approval, blockchain recording)
4. Interactive exploration - Click a step to show details panel sliding in
5. Role assignments - Show each step has assigned role (Shariah Advisor, Auditor, etc.)

---

### Step 9: Test Workflow
**Route**: `/` (when currentStepIndex = 9)
**Component**: `src/components/workflow/steps/Step3TestWorkflow.tsx` (legacy naming)

**Purpose**: Sandbox simulation of workflow execution with live validation and AI issue detection

**Key Features**:

#### Test Control Bar
- **Start Test button** (green, prominent) - Begins simulation
- **Stop Test button** (red) - Pauses execution (appears when running)
- **Restart Test button** (gray) - Resets simulation (appears when complete/stopped)
- **Status indicator**: "Ready" / "Running..." / "Completed" / "Failed"

#### Progress Bar
- **Percentage**: 0% → 100% as steps execute
- **Color**: Blue (in-progress), Green (completed), Red (failed)
- **Estimated time remaining**: Updates in real-time (e.g., "~8 minutes remaining")

#### 12-Step Execution List (Animated)
**Each step shows**:
- **Step number & name**
- **Status icon**:
  - ⏳ Pending (gray)
  - ⏱️ In Progress (spinning blue)
  - ✓ Completed (green checkmark)
  - ✗ Failed (red X)
  - ⚠️ Warning (amber triangle)
- **Timestamp**: [00:02:15] when step completed
- **Assigned role**: (Shariah Advisor, Auditor, etc.)
- **Duration**: (e.g., "Completed in 3s")

**12 Steps**:
1. Issuer submits application → ✓ [00:00:03]
2. Shariah board preliminary review → ✓ [00:00:18]
3. AI compliance analysis (automated) → ✓ [00:00:25]
4. Asset valuation by appraiser → ⚠️ [00:01:02] "Missing Shariah advisor signature"
5. Valuation review gateway → ✓ [00:01:05]
6. Shariah board final approval → ✓ [00:02:15]
7. Generate documentation (automated) → ✓ [00:02:22]
8. Custodian confirms asset custody → ✓ [00:03:10]
9. Record on Hedera HCS (mock) → ✓ [00:03:18]
10. Investor subscription period → ✓ [00:04:30]
11. Mint NFT certificates via HTS (mock) → ✓ [00:04:35]
12. Sukuk issuance complete → ✓ [00:04:40]

#### Live Validation Checks (During Execution)
**Validation card** (appears below progress bar):
- **Title**: "Real-Time Validation"
- **Checks performed** (green ✓ or red ✗):
  - ✓ AAOIFI FAS 33 compliance verified
  - ✓ Required roles assigned (5/5)
  - ✓ All documents uploaded (8/8)
  - ⚠️ Asset valuation missing Shariah advisor signature
  - ✓ Blockchain connection verified (mock)
  - ✓ SPV structure validated

- **Warning indicators**:
  - If step 4 shows warning → Yellow amber alert appears
  - "⚠️ Asset valuation needs Shariah advisor signature"

#### AI Issue Detection & Suggestions
**When warning appears** (e.g., step 4):
- **Alert card** slides in (amber background)
- **Title**: "AI Detected Issue"
- **Description**: "Asset valuation report is missing required Shariah advisor signature per AAOIFI FAS 33 requirements"
- **AI Suggestion** (with Sparkles ✨ icon): "Automatically notify Shariah advisor to review and sign valuation report"
- **Actions**:
  - "Apply AI Suggestion" button (green)
  - "Manual Fix" button (gray)
  - "Ignore Warning" button (red)
- **If "Apply AI Suggestion" clicked**:
  - Shows "✓ Shariah advisor notified, signature pending"
  - Simulation continues

#### Detailed Log Viewer (Collapsible)
- **Accordion**: "View Detailed Execution Log"
- **Expanded view**:
  - Code block with monospace font
  - Timestamped entries:
    ```
    [00:00:00] INFO: Test workflow started
    [00:00:03] SUCCESS: Step 1 completed - Issuer application submitted
    [00:00:18] SUCCESS: Step 2 completed - Shariah preliminary review passed
    [00:00:25] SUCCESS: Step 3 completed - AI compliance analysis: 98% confidence
    [00:01:02] WARNING: Step 4 completed - Asset valuation missing signature
    [00:01:02] INFO: AI suggestion generated for signature issue
    [00:02:15] SUCCESS: Step 6 completed - Shariah board final approval granted
    [00:03:18] INFO: Mock Hedera HCS transaction: 0.0.123456@1234567890.789012
    [00:04:35] INFO: Mock HTS NFT mint: 10 certificates minted (token 0.0.654321)
    [00:04:40] SUCCESS: Workflow test completed successfully
    ```
  - Color-coded: Green (SUCCESS), Amber (WARNING), Red (ERROR), Gray (INFO)
  - Copy log button

#### Completion Alert
- **When test completes successfully**:
  - Green success alert appears
  - "✓ Test workflow completed successfully!"
  - "Duration: 4 minutes 40 seconds"
  - "All validation checks passed (1 warning resolved)"
  - "Ready to proceed to live execution"

- **Sandbox reminder**:
  - Blue info alert
  - "ℹ️ This was a sandbox test - nothing was recorded on blockchain"
  - "Proceed to Step 10 for live deployment"

**Interactive Elements**:
- Test control buttons (Start, Stop, Restart)
- Progress bar (animated)
- 12-step execution list (real-time updates)
- Validation checks card (live updates)
- AI suggestion alerts with action buttons
- Detailed log viewer (collapsible accordion)
- Completion alerts

**Demo Value**:
- **Real-time step execution** - 12 steps execute with timestamps and durations
- **Live validation during execution** - AAOIFI FAS 33 checked in real-time
- **AI issue detection** - "Asset valuation needs Shariah advisor signature" with auto-fix
- **Professional logging** - Timestamped execution log with SUCCESS/WARNING/ERROR levels
- **Blockchain mock indicators** - "Mock Hedera HCS transaction" shows future integration
- **Sandbox clarity** - "Nothing recorded on blockchain yet" prevents confusion
- **Warning resolution** - Shows AI suggestion → user action → problem resolved flow

**Tour Opportunities** (5-7 steps):
1. Test control bar - Show Start/Stop/Restart buttons and status indicator
2. Progress bar - Show percentage and estimated time remaining
3. 12-step execution list - Highlight real-time status updates with timestamps
4. Live validation checks - Show AAOIFI FAS 33 verified, required roles assigned
5. AI issue detection - Show warning alert when asset valuation missing signature
6. AI auto-fix suggestion - Demonstrate "Apply AI Suggestion" button
7. Completion alert - Show success message with sandbox reminder

---

### Step 10: Live Execution
**Route**: `/` (when currentStepIndex = 10)
**Component**: `src/components/workflow/steps/Step10LiveExecution.tsx`

**Purpose**: Deploy workflow to Hedera Guardian blockchain (mock implementation in Phase 1)

**Key Features**:

#### Configuration Summary Card (Collapsible)
- Shows final configuration:
  - Shariah structure: Ijara Sukuk
  - Jurisdiction: UAE DFSA
  - Accounting: AAOIFI
  - Impact: Green Sukuk
- Edit button (disabled) - "Cannot edit after test workflow"
- "Reviewed in Step 8" timestamp

#### Participant Roles & DID Assignment Section
- **Title**: "Workflow Participants"
- **5 role cards**:
  1. **Issuer**
     - Name: Qatar Islamic Investment Bank (QIIB)
     - DID: `did:hedera:testnet:zABC123...XYZ789_0.0.123456`
     - Hedera Account: 0.0.123456
     - Status: ✓ Registered

  2. **Shariah Advisor**
     - Name: Dr. Ahmed Al-Mansouri
     - DID: `did:hedera:testnet:zDEF456...UVW012_0.0.234567`
     - Hedera Account: 0.0.234567
     - Status: ✓ Registered

  3. **Auditor**
     - Name: KPMG Dubai
     - DID: `did:hedera:testnet:zGHI789...RST345_0.0.345678`
     - Hedera Account: 0.0.345678
     - Status: ✓ Registered

  4. **Custodian**
     - Name: Emirates NBD
     - DID: `did:hedera:testnet:zJKL012...OPQ678_0.0.456789`
     - Hedera Account: 0.0.456789
     - Status: ✓ Registered

  5. **Investor** (representative)
     - Name: Institutional Investor Pool
     - DID: `did:hedera:testnet:zMNO345...LMN901_0.0.567890`
     - Hedera Account: 0.0.567890
     - Status: ✓ Registered

#### Deployment Confirmation Section
- **Warning alert** (amber):
  - "⚠️ You are about to deploy to Hedera blockchain"
  - "This action is irreversible and will record transactions on-chain"
  - "Estimated cost: ~0.5 HBAR (gas fees)"

- **Confirmation checkboxes** (all required):
  - [ ] I confirm all configuration details are correct
  - [ ] I confirm all participants have provided consent
  - [ ] I understand this deployment is final and cannot be reversed
  - [ ] I have reviewed the test workflow results (Step 9)

- **Deploy button**: Enabled only when all 4 checkboxes checked

#### 6-Phase Deployment Progress
**Phase card** (appears after clicking Deploy):
- **Title**: "Blockchain Deployment In Progress"

**6 phases** (execute sequentially with animations):
1. **Generate Guardian Policy**
   - Status: ⏱️ In Progress... → ✓ Completed [00:00:12]
   - Description: Converting workflow to Guardian policy format
   - Output: `policy_ijara_sukuk_v1.json` (42 KB)

2. **Validate Policy Structure**
   - Status: ⏱️ In Progress... → ✓ Completed [00:00:18]
   - Description: Checking BPMN compliance, schema validation
   - Output: ✓ All schemas valid (10/10)

3. **Publish Policy to IPFS**
   - Status: ⏱️ In Progress... → ✓ Completed [00:01:05]
   - Description: Uploading policy to decentralized storage
   - Output:
     - IPFS CID: `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`
     - [View on IPFS Gateway] link

4. **Publish Policy to Hedera Blockchain**
   - Status: ⏱️ In Progress... → ✓ Completed [00:01:32]
   - Description: Recording policy hash on Hedera Consensus Service
   - Output:
     - HCS Transaction ID: `0.0.123456@1699876543.123456789`
     - Topic ID: `0.0.789012`
     - [Verify on HashScan] link → https://hashscan.io/testnet/transaction/0.0.123456@1699876543.123456789

5. **Create Workflow Topic**
   - Status: ⏱️ In Progress... → ✓ Completed [00:01:45]
   - Description: Creating HCS topic for workflow messages
   - Output:
     - Workflow Topic ID: `0.0.890123`
     - [Verify on HashScan] link

6. **Assign Participant DIDs**
   - Status: ⏱️ In Progress... → ✓ Completed [00:02:10]
   - Description: Registering participant DIDs to workflow topic
   - Output: 5 participants registered successfully

#### Transaction Summary Card (After Deployment)
- **Title**: "✓ Deployment Successful"
- **Green success alert**
- **Transaction details**:
  - Policy IPFS CID: `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`
  - Policy HCS Transaction: `0.0.123456@1699876543.123456789` [Copy] [Verify]
  - Workflow Topic ID: `0.0.890123` [Copy] [Verify]
  - Total deployment time: 2 minutes 10 seconds
  - Gas fees: 0.47 HBAR

#### Deal Creation Status
- **Info alert** (blue):
  - "ℹ️ Deal record created in lifecycle management system"
  - "Deal ID: DEAL-2025-001-QIIB-IJARA"
  - "Status: Active - In Execution"
  - "View in Dashboard" button

#### Next Steps Checklist
- **Card**: "What Happens Next?"
- **Numbered list**:
  1. ✓ Guardian policy is now live on Hedera blockchain
  2. → Participants will receive notifications to begin execution
  3. → Issuer (QIIB) will submit first workflow step via Guardian UI
  4. → Shariah board will receive preliminary review task
  5. → Track progress in Dashboard or Deal Detail page
  6. → Receive notifications for each milestone completion

- **Action buttons**:
  - "Go to Dashboard" (primary, blue)
  - "View Deal Details" (secondary)
  - "Start New Workflow" (outline)

**Interactive Elements**:
- Configuration summary (collapsible)
- Participant role cards (expandable to see DID details)
- Confirmation checkboxes
- Deploy button (enabled/disabled based on checkboxes)
- 6-phase progress list (real-time animations)
- Transaction ID copy buttons
- "Verify on HashScan" links (external)
- Next steps action buttons

**Demo Value**:
- **6-phase deployment** - Professional multi-step process (generate → validate → IPFS → blockchain → topic → roles)
- **Mock Hedera transaction IDs** - Realistic format `0.0.123456@1234567890.123456789`
- **IPFS integration** - Shows decentralized storage with CID
- **DID issuance** - Participants receive DIDs like `did:hedera:testnet:abc123...def456_0.0.789012`
- **HashScan verification** - Real links to Hedera explorer (mock data)
- **Deal lifecycle record** - Backend creates deal for compliance tracking
- **Gas fees transparency** - Shows 0.47 HBAR cost estimate
- **Next steps clarity** - Users know exactly what happens after deployment

**Tour Opportunities** (5-7 steps):
1. Participant roles - Show 5 participants with DIDs and Hedera accounts
2. Deployment confirmation - Highlight 4 required checkboxes and irreversibility warning
3. 6-phase progress - Demonstrate each phase executing with real-time status
4. IPFS publication - Show CID and link to IPFS gateway
5. HCS transaction - Show transaction ID and "Verify on HashScan" link
6. Deal creation - Show lifecycle management system integration
7. Next steps - Explain what happens after deployment (notifications, Guardian UI)

---

### Step 11: Monitor & Collaborate
**Route**: `/` (when currentStepIndex = 11)
**Component**: `src/components/workflow/steps/Step11MonitorCollaborate.tsx`

**Purpose**: Bridge from workflow completion to lifecycle management (4 navigation options)

**Key Features**:

#### Success Confirmation Alert
- **Green success alert** at top
- **Title**: "✓ Workflow Deployed Successfully!"
- **Content**:
  - "Your Islamic finance workflow has been deployed to Hedera blockchain"
  - "Deal ID: **DEAL-2025-001-QIIB-IJARA**"
  - "Policy Topic: **0.0.890123**"
  - "Status: **Active - In Execution**"

#### "What's Next?" Info Card
- **Blue info alert**
- **Content**:
  - "Your workflow is now live and participants can begin execution"
  - "Choose where you'd like to go next to monitor progress and collaborate"

#### 4 Navigation Options (`data-tour="collaboration"`)

**Card 1: Dashboard** (Recommended badge, green accent)
- **Icon**: 📊 LayoutDashboard
- **Title**: "Go to Dashboard"
- **Description**: "View all deals and platform-wide compliance monitoring"
- **Features list**:
  - Real-time compliance metrics
  - Active deals overview
  - Risk alerts and warnings
  - Analytics and reporting
- **Action button**: "Open Dashboard" (primary, blue)
- **Route**: `/dashboard`

**Card 2: Deal Detail**
- **Icon**: 🛡️ ShieldCheck
- **Title**: "View Deal Details"
- **Description**: "Track this specific deal's compliance progress and milestones"
- **Features list**:
  - Workflow execution timeline
  - Participant activity feed
  - Document viewer
  - Status updates and notifications
- **Action button**: "Open Deal" (secondary, outline)
- **Route**: `/deals/DEAL-2025-001-QIIB-IJARA`

**Card 3: Contracts (AI)** (Phase 3 badge, disabled, amber accent)
- **Icon**: 📝 FileText
- **Title**: "Collaborate on Contracts"
- **Description**: "AI-powered contract generation and review workflows"
- **Features list**:
  - AI contract drafting from workflow parameters
  - Clause library with Shariah-compliant templates
  - Real-time collaborative editing
  - Version control and track changes
- **Action button**: "Open Contracts" (disabled)
- **Route**: `/contracts` (future)
- **Badge**: "Phase 3 - Coming Soon"

**Card 4: Reviews** (Phase 4 badge, disabled, purple accent)
- **Icon**: ✓ CheckCircle2
- **Title**: "Manage Reviews"
- **Description**: "Shariah board reviews and approval workflows"
- **Features list**:
  - Submit documents for Shariah board review
  - Track review status and approvals
  - Fatwa repository and precedents
  - Audit trail for compliance
- **Action button**: "Open Reviews" (disabled)
- **Route**: `/reviews` (future)
- **Badge**: "Phase 4 - Coming Soon"

#### Action Buttons Footer
- **Start New Workflow** button (outline, gray) - Returns to Step 0
- **Go to Dashboard** button (primary, blue) - Routes to `/dashboard`

**Interactive Elements**:
- Success alert
- 4 navigation cards (2 active, 2 disabled)
- "Recommended" badge (Dashboard)
- "Phase 3/4" badges (disabled features)
- Action buttons (primary vs. secondary vs. disabled)
- Routes to different pages

**Demo Value**:
- **Deal successfully created** - Confirmation with deal ID `DEAL-2025-001-QIIB-IJARA`
- **4 lifecycle navigation options** - Shows platform completeness
- **Dashboard recommended** - Guides user to compliance monitoring hub
- **Phase roadmap transparency** - Contracts (Phase 3) and Reviews (Phase 4) clearly marked
- **Deal Detail integration** - Direct link to lifecycle management
- **Real-time execution promise** - "Participants can begin execution" message

**Tour Opportunities** (3-4 steps):
1. Success confirmation - Highlight deal ID and "Active - In Execution" status
2. Dashboard card - Show recommended option for compliance monitoring
3. Deal Detail card - Explain workflow execution timeline and participant activity
4. Coming Soon features - Show Contracts (Phase 3) and Reviews (Phase 4) with badges

---

## Navigation Pages

### Dashboard
**Route**: `/dashboard`
**Component**: `src/app/dashboard/page.tsx`

**Purpose**: Platform-wide compliance monitoring and analytics hub

**Key Features**:

#### Top Metrics Cards (4 cards)
1. **Total Deals**
   - Number: 12
   - Change: +3 this month (green arrow)
   - Icon: 🛡️ ShieldCheck

2. **Active Compliance Issues**
   - Number: 4
   - Change: -2 resolved (green arrow)
   - Icon: ⚠️ AlertTriangle

3. **Pending Shariah Reviews**
   - Number: 7
   - Change: 2 urgent (red badge)
   - Icon: ✓ CheckCircle2

4. **Blockchain Transactions**
   - Number: 156
   - Change: +42 this week (blue arrow)
   - Icon: 🔗 Link

#### Deals Overview Table
- **Columns**: Deal ID, Name, Structure, Status, Risk Level, Last Updated
- **Rows**: 12 deals shown
- **Sortable**: Click column headers to sort
- **Filterable**: Dropdown filters for Structure, Status, Risk Level
- **Actions**: "View" button for each deal

#### Risk Alerts Section
- **Card**: "Compliance Alerts"
- **3 alerts shown**:
  1. ⚠️ "Deal DEAL-2024-045: Asset valuation pending Shariah approval (2 days overdue)"
  2. ⚠️ "Deal DEAL-2024-012: AAOIFI FAS 33 disclosure deadline in 3 days"
  3. ℹ️ "New AAOIFI standard update available: FAS 35 (Zakat)"

#### Analytics Chart Section
- **Card**: "Compliance Metrics Over Time"
- **Line chart**: 6 months of data
- **Metrics**: Active deals, Issues resolved, Reviews completed
- **Interactive**: Hover to see exact values

**Tour Opportunities** (4-5 steps):
1. Top metrics cards - Show 4 KPIs with trend indicators
2. Deals overview table - Highlight sortable columns and filters
3. Risk alerts - Show compliance issues and deadlines
4. Analytics chart - Demonstrate trend visualization
5. "View Deal" action - Show navigation to Deal Detail page

---

### Deals
**Route**: `/deals`
**Component**: `src/app/deals/page.tsx`

**Purpose**: List all deals with lifecycle management

**Key Features**:

#### Filters Bar
- **Search**: Search by deal ID or name
- **Structure filter**: Dropdown (Ijara, Murabaha, Musharaka, etc.)
- **Status filter**: Dropdown (Draft, Active, Completed, Suspended)
- **Date range**: Date picker for created/updated dates

#### Deals Grid/List View Toggle
- **Grid view**: 3 columns of cards
- **List view**: Table format

#### Deal Cards (Grid View)
**Each card shows**:
- Deal ID: DEAL-2025-001
- Name: QIIB Oryx Sukuk
- Structure: Ijara + Sukuk + Takaful
- Status badge: Active (green)
- Risk level: Low (green), Medium (amber), High (red)
- Progress bar: 60% complete
- Last updated: 2 hours ago
- "View Details" button

**Tour Opportunities** (3-4 steps):
1. Filters bar - Show search and filter capabilities
2. Grid/List toggle - Demonstrate two view modes
3. Deal card - Highlight structure, status, risk, progress
4. "View Details" - Navigate to Deal Detail page

---

### Deal Detail
**Route**: `/deals/[id]/page.tsx`
**Component**: `src/app/deals/[id]/page.tsx`
**File Size**: 634 lines

**Purpose**: Single deal compliance tracking and lifecycle management

**Key Features**:

#### Deal Header
- Deal ID: DEAL-2025-001-QIIB-IJARA
- Name: QIIB Oryx Sukuk
- Status badge: Active - In Execution (green)
- Created: November 1, 2025
- Last updated: 2 hours ago

#### 5 Tab Navigation
1. **Overview** (default)
   - Deal summary card
   - Workflow execution timeline (12 steps with status)
   - Participant activity feed
   - Key milestones

2. **Documents**
   - Uploaded documents list (Ijara contract, asset valuation, etc.)
   - Version history
   - Download/preview buttons

3. **Digital Assets** (links to `/deals/[id]/digital-assets`)
   - 3 NFT certificates shown
   - Token IDs, mint dates, blockchain links

4. **Collaboration** (links to `/deals/[id]/collaborate`)
   - Comment threads
   - @mentions
   - Activity feed

5. **Audit Trail**
   - Complete blockchain transaction history
   - Timestamps, actors, actions

#### Workflow Execution Timeline (Overview Tab)
- **12 steps** with visual timeline:
  1. ✓ Issuer submitted (Nov 1, 10:00 AM)
  2. ✓ Shariah preliminary review (Nov 1, 2:30 PM)
  3. ⏱️ AI compliance analysis (In Progress...)
  4. ⚬ Asset valuation (Pending)
  5. ⚬ Valuation review (Pending)
  6. ⚬ Shariah final approval (Pending)
  7. ⚬ Generate docs (Pending)
  8. ⚬ Custodian custody (Pending)
  9. ⚬ Record on HCS (Pending)
  10. ⚬ Investor subscription (Pending)
  11. ⚬ Mint NFT certificates (Pending)
  12. ⚬ Issuance complete (Pending)

#### Participant Activity Feed
- **Real-time feed** of actions:
  - "Dr. Ahmed Al-Mansouri completed Shariah preliminary review" (2 hours ago)
  - "QIIB uploaded Ijara contract draft" (4 hours ago)
  - "System triggered AI compliance analysis" (1 hour ago)

**Tour Opportunities** (5-6 steps):
1. Deal header - Show ID, name, status, timestamps
2. Tab navigation - Explain 5 tabs (Overview, Documents, Digital Assets, Collaboration, Audit)
3. Workflow timeline - Highlight 12 steps with visual status (✓ ⏱️ ⚬)
4. Participant activity feed - Show real-time updates
5. Documents tab - Navigate to uploaded documents
6. Digital Assets tab - Navigate to NFT certificates

---

### Digital Assets
**Route**: `/deals/[id]/digital-assets/page.tsx` OR `/digital-assets/page.tsx`
**Component**: `src/app/deals/[id]/digital-assets/page.tsx` OR `src/app/digital-assets/page.tsx`

**Purpose**: NFT certificates and tokenized assets management

**Key Features**:

#### Assets Overview
- **Total assets**: 10 NFTs
- **Total value**: $25M
- **Blockchain**: Hedera (HTS)

#### Asset Cards Grid
**Each card shows**:
- **Asset type**: Shariah Compliance Certificate, Tokenized Sukuk, Impact Validation Certificate
- **Token ID**: 0.0.123456
- **Mint date**: November 1, 2025
- **Status**: Active (green) / Burned (gray) / Transferred (blue)
- **Metadata**:
  - Deal ID: DEAL-2025-001
  - Certificate type: Ijara compliance
  - Issued by: QIIB
  - Valid until: November 1, 2026
- **Actions**:
  - "View on HashScan" (external link)
  - "Download Certificate" (PDF)
  - "Transfer NFT" (button, opens modal)
  - "Burn NFT" (button, confirmation required)

#### Certificate Preview
- **Click on card** → Modal opens with full certificate
- **Certificate contents**:
  - ZeroH logo + QR code
  - Certificate title: "Shariah Compliance Certificate"
  - Deal details
  - Shariah board signature
  - Token ID and blockchain transaction ID
  - Issued date, expiry date

**Tour Opportunities** (4-5 steps):
1. Assets overview - Show total NFTs, value, blockchain
2. Asset cards - Highlight different types (Compliance, Sukuk, Impact)
3. Token ID and HashScan - Show blockchain verification
4. Certificate preview - Click card to open modal with full certificate
5. Actions - Demonstrate transfer, burn, download

---

### Collaboration
**Route**: `/collaboration/page.tsx`
**Component**: `src/app/collaboration/page.tsx`

**Purpose**: Cross-deal collaboration hub with tasks and mentions

**Key Features**:

#### 3 Tab Navigation
1. **My Tasks** (default)
   - Tasks assigned to current user
   - Sortable by priority, due date, status

2. **Mentions**
   - All @mentions of current user across deals
   - Links to source (comment, document annotation)

3. **Activity Feed**
   - Platform-wide activity stream
   - Filterable by deal, participant, action type

#### Task List (My Tasks Tab)
**Each task shows**:
- **Task title**: "Review Shariah compliance checklist"
- **Deal**: DEAL-2025-001 (QIIB Oryx Sukuk)
- **Assigned by**: Dr. Ahmed Al-Mansouri
- **Due date**: November 10, 2025 (3 days remaining, amber badge)
- **Priority**: High (red badge) / Medium (amber) / Low (green)
- **Status**: To Do / In Progress / Done
- **Actions**: "Start Task" / "Mark Complete" buttons

#### Mentions List (Mentions Tab)
**Each mention shows**:
- **Source**: Comment in Deal DEAL-2025-001 → Documents tab
- **Author**: Dr. Ahmed Al-Mansouri
- **Content**: "@JohnDoe Please review the updated Ijara contract clause 4.2"
- **Timestamp**: 2 hours ago
- **Action**: "View Context" button (navigates to source)

**Tour Opportunities** (3-4 steps):
1. Tab navigation - Explain My Tasks, Mentions, Activity Feed
2. Task list - Show assigned tasks with priority and due dates
3. Mentions list - Show @mentions with context links
4. Activity feed - Show platform-wide updates

---

### Contracts
**Route**: `/contracts/page.tsx`
**Component**: `src/app/contracts/page.tsx`
**File Size**: 722 lines

**Purpose**: AI-powered contract listing and management (Phase 3 placeholder)

**Key Features**:

#### Contracts List
- **Contract cards** showing:
  - Contract name: "Ijara Master Agreement"
  - Deal: DEAL-2025-001
  - Type: Ijara, Murabaha, etc.
  - Status: Draft / Under Review / Approved / Executed
  - Last edited: 2 hours ago
  - "Edit" / "Review" buttons

#### AI Contract Generation (Coming Soon badge)
- **Button**: "Generate Contract with AI"
- **Modal** (when Phase 3 complete):
  - Select deal
  - Select contract type
  - AI auto-fills clauses from workflow parameters
  - User edits generated contract

**Tour Opportunities** (2-3 steps):
1. Contracts list - Show contract cards with status
2. "Generate with AI" - Explain Phase 3 feature (disabled)
3. Edit/Review - Show navigation to contract detail (future)

---

### Notifications
**Route**: `/notifications/page.tsx`
**Component**: `src/app/notifications/page.tsx`

**Purpose**: Notification center for all platform alerts

**Key Features**:

#### Notification Types
1. **Task assignments** - "Dr. Ahmed assigned you a task"
2. **@Mentions** - "John mentioned you in a comment"
3. **Workflow milestones** - "Shariah approval completed for DEAL-2025-001"
4. **Risk alerts** - "Asset valuation overdue by 2 days"
5. **System updates** - "New AAOIFI standard available"

#### Notification List
**Each notification shows**:
- **Type icon**: 🔔 Task, 💬 Mention, ✓ Milestone, ⚠️ Alert, ℹ️ Update
- **Title**: "Task assigned: Review Shariah checklist"
- **Description**: "Dr. Ahmed Al-Mansouri assigned you a task"
- **Timestamp**: 2 hours ago
- **Status**: Unread (blue dot) / Read (no dot)
- **Action**: "View" button (navigates to source)

#### Filters
- **All** / **Unread** / **Tasks** / **Mentions** / **Alerts**

**Tour Opportunities** (2-3 steps):
1. Notification types - Show 5 types with icons
2. Notification list - Show unread/read status and timestamps
3. Filters - Demonstrate filtering by type

---

## Key Features & Capabilities

### Backend Services (Step 1 shows all)
1. **Graphiti Knowledge Graph** - 23 disciplines, 20+ sources
2. **Claude AI** - Sonnet 4.5 reasoning
3. **LlamaIndex** - Document processing + vector embeddings
4. **Neo4j** - Graph database
5. **Hedera Guardian** - Policy engine (mock)
6. **HCS** - Consensus Service (mock)
7. **HTS** - Token Service (mock)
8. **IPFS** - Decentralized storage (mock)

### 4-Component Modular Architecture
1. **Shariah Structure** - 7 options
2. **Jurisdiction** - 5 options
3. **Accounting** - 3 options
4. **Impact Metrics** - 8 options (multi-select)

### AI Features
1. **Auto-fill suggestions** - Step 7 (Sparkles icons)
2. **Compliance analysis** - Step 1 knowledge graph search
3. **Issue detection** - Step 9 test workflow
4. **Contract generation** - Phase 3 (future)

### Blockchain Integration (Mock)
1. **Policy deployment** - Step 10 (6 phases)
2. **HCS transactions** - Timestamped IDs
3. **NFT minting** - HTS certificates
4. **DID issuance** - Participant identities
5. **IPFS storage** - Policy and documents

### Collaboration Features
1. **Comments** - Deal-specific threads
2. **@Mentions** - User tagging
3. **Tasks** - Assignment and tracking
4. **Activity feed** - Real-time updates
5. **Audit trail** - Complete blockchain history

---

## Data Tour Attributes Reference

### Currently Implemented
| Attribute | Location | Step | Description |
|-----------|----------|------|-------------|
| `data-tour="dashboard"` | WorkflowContainer.tsx | 0-11 | Main workflow container |
| `data-tour="methodology-connect"` | Step1SourceConnection.tsx | 1 | Backend Architecture card |
| `data-tour="ai-analysis"` | Step1SourceConnection.tsx | 1 | AI search panel |
| `data-tour="structure-selection"` | Step2SelectShariahStructure.tsx | 2 | 6 structure cards |
| `data-tour="collaboration"` | Step11MonitorCollaborate.tsx | 11 | 4 navigation cards |

### Recommended Additions
| Attribute | Location | Step | Description |
|-----------|----------|------|-------------|
| `data-tour="sukuk-toggle"` | Step2SelectShariahStructure.tsx | 2 | Sukuk securitization switch |
| `data-tour="takaful-overlay"` | Step2SelectShariahStructure.tsx | 2 | Takaful insurance switch |
| `data-tour="jurisdiction-cards"` | Step3SelectJurisdiction.tsx | 3 | 4 jurisdiction cards |
| `data-tour="mandatory-alert"` | Step3SelectJurisdiction.tsx | 3 | Saudi CMA → AAOIFI alert |
| `data-tour="accounting-cards"` | Step4SelectAccounting.tsx | 4 | 3 accounting framework cards |
| `data-tour="impact-cards"` | Step5SelectImpact.tsx | 5 | 4 impact framework cards |
| `data-tour="multi-select-info"` | Step5SelectImpact.tsx | 5 | Multi-select explanation |
| `data-tour="validation-results"` | Step6ReviewConfiguration.tsx | 6 | Validation status card |
| `data-tour="ai-toggle"` | Step7ConfigureDetails.tsx | 7 | AI auto-fill toggle |
| `data-tour="ai-suggestions"` | Step7ConfigureDetails.tsx | 7 | Sparkles icons |
| `data-tour="bpmn-viewer"` | Step8ReviewPolicyStructure.tsx | 8 | Center BPMN canvas |
| `data-tour="workflow-navigator"` | Step8ReviewPolicyStructure.tsx | 8 | Left column navigator |
| `data-tour="test-controls"` | Step3TestWorkflow.tsx | 9 | Start/Stop/Restart buttons |
| `data-tour="test-progress"` | Step3TestWorkflow.tsx | 9 | Progress bar + 12 steps |
| `data-tour="ai-issues"` | Step3TestWorkflow.tsx | 9 | AI suggestion alerts |
| `data-tour="deployment-phases"` | Step10LiveExecution.tsx | 10 | 6-phase progress list |
| `data-tour="transaction-ids"` | Step10LiveExecution.tsx | 10 | HCS/HTS transaction IDs |

---

## Demo Script Recommendations

### 5-Minute Quick Demo
**Steps to show**: 0 → 1 → 2 → 7 → 9 → 11

1. **Step 0**: Start here, show 4 use cases, click "Complete Workflow"
2. **Step 1**: Show 4/4 AI services connected + knowledge graph search demo
3. **Step 2**: Select Ijara (60% badge), toggle Sukuk ON, show Takaful overlay
4. **Skip Steps 3-6**: Say "We've pre-configured jurisdiction, accounting, impact"
5. **Step 7**: Show AI auto-fill - click Sparkles icon next to "Asset description"
6. **Skip Step 8**: Say "We've reviewed the BPMN workflow structure"
7. **Step 9**: Run test simulation - show AI detecting asset valuation issue + auto-fix
8. **Skip Step 10**: Say "In production, this deploys to Hedera blockchain"
9. **Step 11**: Show 4 navigation options, click "Go to Dashboard"

**Why this flow**:
- Shows modularity (Step 0)
- Shows AI depth (Steps 1, 7, 9)
- Shows unique features (Sukuk, Takaful in Step 2)
- Keeps under 5 minutes
- Ends with lifecycle management (Step 11 → Dashboard)

---

### 10-Minute Comprehensive Demo
**Steps to show**: 0 → 1 → 2 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → Dashboard

1. **Step 0** (30s): Show 4 use cases, explain modularity
2. **Step 1** (1 min): Show 4/4 AI services, knowledge base (23 disciplines), demo knowledge graph search
3. **Step 2** (1 min): Select Ijara, toggle Sukuk, show Takaful, explain AAOIFI compliance
4. **Skip Steps 3-4**: Say "We're using UAE DFSA jurisdiction and AAOIFI accounting"
5. **Step 5** (1 min): Select Green Sukuk + SDG-Linked (multi-select), show ICMA certification requirement
6. **Step 6** (30s): Show configuration review with validation (✓ all green)
7. **Step 7** (1.5 min): Show AI auto-fill for 3 fields (asset description, use of proceeds, audit firm)
8. **Step 8** (1 min): Show BPMN viewer, click a step to show details panel
9. **Step 9** (1.5 min): Run test, show AI issue detection + auto-fix suggestion
10. **Step 10** (1 min): Show 6-phase deployment, HCS transaction IDs, HashScan links
11. **Step 11** (30s): Show 4 navigation options, go to Dashboard
12. **Dashboard** (1 min): Show 4 KPIs, risk alerts, deals table

**Why this flow**:
- Comprehensive feature showcase
- Shows all 4 components (Shariah, Jurisdiction, Accounting, Impact)
- Demonstrates AI throughout (Steps 1, 7, 9)
- Shows blockchain integration (Step 10)
- Ends with lifecycle management (Dashboard)

---

### 15-Minute Deep Dive
**All steps**: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → Dashboard → Deal Detail → Digital Assets

Follow 10-minute demo, but add:
- **Step 3** (1 min): Show jurisdiction selection, highlight tax-free UAE vs. 20% Saudi, show mandatory AAOIFI alert
- **Step 4** (1 min): Show accounting selection, explain AAOIFI 62+ FAS, show IFRS+Islamic option
- **Deal Detail** (2 min): Show workflow timeline (12 steps), participant activity feed, documents tab
- **Digital Assets** (1 min): Show 3 NFT certificates, token IDs, HashScan verification

**Why this flow**:
- Complete end-to-end platform tour
- Shows all 12 workflow steps
- Demonstrates lifecycle management in depth
- Shows digital asset management (NFTs)

---

## Summary Statistics

### Workflow Steps
- **Total steps**: 12 (0-11)
- **Interactive elements**: ~200+
- **data-tour attributes**: 5 existing, 12+ recommended
- **Lines of code**: ~10,000+ across 12 step components

### Navigation Pages
- **Total pages**: 15+
- **Main navigation**: 7 (Workflow, Dashboard, Deals, Digital Assets, Collaboration, Notifications, Welcome)
- **Detail pages**: 8 (Deal Detail, Digital Assets Detail, Contracts, Tasks, Mentions, etc.)

### Key Technologies
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, Python, Pydantic
- **AI**: Claude Sonnet 4.5, OpenAI, LlamaIndex
- **Knowledge**: Graphiti, Neo4j, 23 Islamic finance disciplines
- **Blockchain**: Hedera Guardian, HCS, HTS, IPFS (mock in Phase 1)

### Feature Counts
- **Shariah structures**: 7
- **Jurisdictions**: 5
- **Accounting frameworks**: 3
- **Impact metrics**: 8
- **Backend services**: 13 (4 AI, 4 Blockchain, 2 Tokenization, 3 Research)
- **BPMN workflow steps**: 12
- **NFT certificate types**: 3

---

**End of Guide**

This document provides a complete reference for understanding all platform features, designing tours, and presenting demos. Use the step-by-step breakdowns to design contextual tours, and refer to the demo scripts for presentation flows.

**Last Updated**: November 7, 2025
**Version**: 1.0
**Maintained By**: ZeroH Platform Team
