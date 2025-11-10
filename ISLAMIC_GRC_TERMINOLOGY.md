# Islamic GRC Terminology Mapping
**Platform**: AI native Governance, Risk & Compliance platform for Islamic Finance

## Principles
1. **Respect accepted taxonomies** from AAOIFI, IFSB, national regulators
2. **Explain jargon in simple terms** for non-tech-savvy practitioners
3. **Maintain standards fidelity** (ISO 37301, ISO 31000, COSO + AAOIFI/IFSB)
4. **Use parenthetical explanations** when technical terms are required

---

## Platform Identity

### Official Name
**Primary**: AI native Governance, Risk & Compliance platform for Islamic Finance

**Short Form**: Islamic Finance GRC Platform

**Tagline Options**:
- "Ensure Shariah Compliance • Manage Risk • Meet Regulatory Requirements"
- "Automated Shariah Compliance • Built on Standards • Digital-Asset Ready"
- "AI-Powered Compliance for Islamic Finance Institutions"

### Footer/About
"Built on ISO 37301 (Compliance Systems) • ISO 31000 (Risk Management) • COSO (Internal Controls) • AAOIFI/IFSB Standards • Integrated with Hedera Guardian for verifiable credentials and compliant tokenization"

---

## Islamic GRC Unique Layers (What Makes This Different)

### A) Shariah Governance Bodies (AAOIFI GS-1/5/8)

| Technical Term | Simple Explanation | When to Use Which |
|----------------|-------------------|-------------------|
| **Shariah Supervisory Board (SSB)** | Shariah Board | Use "Shariah Board" in UI, keep "SSB" in technical docs |
| **Shariah Compliance Function** | Shariah Review Team (Day-to-Day) | "Shariah Review Team" in UI |
| **Internal Shariah Review** | Shariah Review (After Transactions) | "Shariah Review" in UI |
| **Internal Shariah Audit** | Shariah Audit | Keep as-is (familiar term) |
| **External Shariah Audit** | Independent Shariah Audit | "Independent Shariah Audit" |
| **Central Shariah Board** | National Shariah Authority | Context: "Central SSB (National Authority)" |

**UI Labels**:
- Dashboard section: "Shariah Governance"
- Submenu: "Shariah Board Oversight"
- Action: "Request Shariah Board Approval"
- Status: "Pending Shariah Review"

### B) Islamic Risk Categories (IFSB-1, IFSB-10)

| Technical Term | Simple Explanation | Full Context Label |
|----------------|-------------------|-------------------|
| **Shariah Non-Compliance Risk (SNCR)** | Shariah Breach Risk | "Shariah Breach Risk (SNCR)" on first use, then "Shariah Breach Risk" |
| **Displaced Commercial Risk (DCR)** | Profit Smoothing Risk | "Profit Smoothing Risk (DCR)" |
| **Rate-of-Return Risk (RoR)** | Profit Rate Risk | "Profit Rate Risk (for Investment Accounts)" |
| **Fiduciary Risk** | Investor Trust Risk | "Investor Trust Risk (Fiduciary Duty)" |
| **Investment Account Holders (IAH)** | Investment Account Holders | Keep as-is (standard term) |
| **Profit Equalisation Reserve (PER)** | Profit Smoothing Reserve | "Profit Smoothing Reserve (PER)" |
| **Investment Risk Reserve (IRR)** | Investment Protection Reserve | "Investment Protection Reserve (IRR)" |

**UI Labels**:
- Risk Register: "Shariah Breach Risk (SNCR)"
- Tooltip: "Risk that a transaction violates Shariah principles, requiring income purification"
- Dashboard Widget: "Shariah Breach Incidents This Quarter"
- Alert: "Potential Shariah Breach Detected - Review Required"

### C) Product-Level Controls (Contract Mechanics)

| Technical Term | Simple Explanation | UI Context |
|----------------|-------------------|------------|
| **Murabaha** | Cost-Plus Sale | "Cost-Plus Sale (Murabaha)" |
| **Ijarah** | Islamic Lease | "Islamic Lease (Ijarah)" |
| **Ijarah Muntahia Bittamleek (IMB)** | Lease-to-Own | "Lease-to-Own (IMB)" |
| **Musharaka** | Partnership | "Partnership Financing (Musharaka)" |
| **Mudaraba** | Profit-Sharing | "Profit-Sharing Investment (Mudaraba)" |
| **Sukuk** | Islamic Bond | "Islamic Bond (Sukuk)" |
| **Salam** | Advance Purchase | "Advance Purchase (Salam)" |
| **Istisna'** | Manufacturing Contract | "Manufacturing Finance (Istisna')" |
| **Takaful** | Islamic Insurance | "Islamic Insurance (Takaful)" |

**UI Labels**:
- Product Selection: "Islamic Lease (Ijarah)"
- Control Gate: "Verify Delivery Before Rent Collection"
- Checklist: "Lessor Maintenance Responsibility Confirmed"
- Evidence: "Takaful (Insurance) Policy Uploaded"

### D) Shariah Compliance Workflow States

| Technical Term | Simple Explanation | Status Badge |
|----------------|-------------------|--------------|
| **Ex-ante Shariah review** | Before Transaction Review | "Pending Pre-Transaction Review" |
| **Ex-post Shariah review** | After Transaction Review | "In Post-Transaction Review" |
| **Fatwa** | Shariah Ruling | "Shariah Ruling (Fatwa)" |
| **SSB Resolution** | Shariah Board Decision | "Shariah Board Decision" |
| **Shariah-compliant** | Meets Shariah Requirements | "Shariah Compliant ✓" |
| **Shariah non-compliant** | Violates Shariah Requirements | "Shariah Breach Detected" |
| **Purification required** | Non-Compliant Income to Charity | "Requires Purification" |

**UI Labels**:
- Workflow Step: "Shariah Board Approval"
- Status: "Approved by Shariah Board"
- Action Required: "Purification Needed - Donate Non-Compliant Income"
- Dashboard: "Transactions Awaiting Shariah Review"

### E) Purification & Charity Controls

| Technical Term | Simple Explanation | UI Context |
|----------------|-------------------|------------|
| **Purification** | Donate Non-Compliant Income | "Purification (Charity Donation)" |
| **Tainted income** | Income from Shariah Breach | "Non-Compliant Income" |
| **Charity disbursement** | Donation to Approved Charity | "Charity Donation" |
| **Purification register** | Log of Non-Compliant Income | "Purification Ledger" |

**UI Labels**:
- Alert: "QAR 5,200 requires purification - donate to approved charity"
- Workflow: "Log Purification Amount"
- Report: "Purification Activity (Non-Compliant Income Donated)"
- Control: "Reconcile Purification Amounts to Charity Disbursements"

### F) Governance & Independence Controls (AAOIFI GS-1/5)

| Technical Term | Simple Explanation | UI Context |
|----------------|-------------------|------------|
| **Fit-and-proper** | Qualified & Suitable | "Shariah Board Member Qualifications" |
| **Independence requirements** | Conflict-Free Requirements | "Independence & Conflicts Policy" |
| **Conflict of Interest (COI)** | Conflict of Interest | Keep as-is (standard term) |
| **SSB charter** | Shariah Board Charter | "Shariah Board Charter" |
| **SSB report** | Shariah Board Annual Report | "Shariah Board Report" |

**UI Labels**:
- Checklist: "Shariah Board Member Independence Confirmed"
- Document: "Shariah Board Charter (2024)"
- Report: "Annual Shariah Board Report"
- Alert: "Conflict of Interest Declaration Due"

---

## Top 10 Islamic GRC Controls (Operationalized)

### 1. Shariah Board Independence & Competence
**Control Name**: Shariah Board Governance
**Simple Description**: "Ensure Shariah Board members are qualified, independent, and free from conflicts"
**Evidence**:
- Appointment minutes
- Qualifications verification (fit-and-proper)
- Independence declarations
- Conflict of Interest logs
- Meeting attendance records

**UI Workflow**:
```
Step 1: Upload Shariah Board Member Qualifications
Step 2: Verify Independence Requirements
Step 3: Review Conflict Declarations
Step 4: Board Approves Appointment
Step 5: Record Decision on Blockchain
```

### 2. Shariah Compliance Function (Ex-Ante)
**Control Name**: Pre-Transaction Shariah Review
**Simple Description**: "Review and approve transactions BEFORE execution to prevent Shariah breaches"
**Evidence**:
- Product approval checklist
- Transaction review sign-off
- Shariah compliance memo
- Supporting Shariah ruling (fatwa)

**UI Workflow**:
```
Step 1: Submit Transaction for Shariah Review
Step 2: Shariah Review Team Checks Contract Structure
Step 3: Verify Compliance with Approved Fatwa
Step 4: Sign-Off or Request Modifications
Step 5: Record Review Decision
```

### 3. Shariah Review & Internal Shariah Audit (Ex-Post)
**Control Name**: Post-Transaction Shariah Audit
**Simple Description**: "Test completed transactions to catch any Shariah breaches that occurred"
**Evidence**:
- Sample selection methodology
- Testing results
- Breach findings (if any)
- Remediation actions
- Shariah audit report

**UI Workflow**:
```
Step 1: Select Sample of Completed Transactions
Step 2: Test Against Shariah Requirements
Step 3: Identify Any Breaches
Step 4: Calculate Non-Compliant Income (if any)
Step 5: Generate Shariah Audit Report
```

### 4. External Shariah Audit & Reporting
**Control Name**: Independent Shariah Assurance
**Simple Description**: "Independent auditor verifies Shariah compliance and publishes opinion"
**Evidence**:
- External auditor engagement letter
- Audit plan and scope
- Management responses
- Final audit opinion
- Published Shariah Board report

**UI Workflow**:
```
Step 1: Provide Evidence to External Auditor
Step 2: Respond to Audit Queries
Step 3: Review Draft Findings
Step 4: Publish Shariah Board Report
Step 5: Record on Blockchain
```

### 5. SNCR Register & Purification
**Control Name**: Shariah Breach Risk Management
**Simple Description**: "Track Shariah breaches, calculate non-compliant income, and donate to charity"
**Evidence**:
- SNCR incident log
- Root cause analysis
- Non-compliant income calculation
- Charity donation receipt
- Shariah Board approval of donation

**UI Workflow**:
```
Step 1: Log Shariah Breach Incident
Step 2: Calculate Non-Compliant Income
Step 3: Get Shariah Board Approval for Purification
Step 4: Donate to Approved Charity
Step 5: Reconcile Purification Amount
```

### 6. Profit Smoothing (PER/IRR) Governance
**Control Name**: Investment Account Protection
**Simple Description**: "Manage reserves to smooth profits for investors and protect against losses"
**Evidence**:
- PER/IRR policy document
- Board approval of policy
- Reserve movement tracker
- Trigger threshold monitoring
- Investment Account Holder disclosures

**UI Workflow**:
```
Step 1: Define PER/IRR Policy & Thresholds
Step 2: Board Approves Policy
Step 3: Monitor Profit Rate Triggers
Step 4: Transfer to/from Reserves (if triggered)
Step 5: Disclose to Investment Account Holders
```

### 7. Investment Account Holder Fairness
**Control Name**: Investor Fairness Controls
**Simple Description**: "Ensure fair profit allocation and transparent disclosure to investors"
**Evidence**:
- Profit allocation methodology
- Investment Account Holder disclosures
- Change notices (if allocation basis changes)
- Investor complaint log
- Fairness attestation

**UI Workflow**:
```
Step 1: Define Profit Allocation Basis
Step 2: Disclose to Investment Account Holders
Step 3: Calculate Profit Distribution
Step 4: Verify Fairness (No Preferential Treatment)
Step 5: Distribute Profits & Issue Statement
```

### 8. Contract-Sequence Gates (Product-Specific)
**Control Name**: Contract Structure Validation
**Simple Description**: "Verify transaction follows required contract sequence for the product type"

**Example - Ijarah (Islamic Lease)**:
```
Gate 1: Verify Asset Ownership by Lessor ✓
Gate 2: Verify Asset Delivered to Lessee ✓
Gate 3: Verify Takaful (Insurance) in Place ✓
Gate 4: Start Rent Collection (Only After Delivery) ✓
Gate 5: Lessor Maintains Major Repairs ✓
```

**Example - IMB (Lease-to-Own)**:
```
Gate 1: Complete Ijarah (Lease) Contract ✓
Gate 2: Separate Sale or Gift Contract for Title Transfer ✓
Gate 3: Verify No Penalty Clauses (Donation Only) ✓
```

**UI Workflow**:
```
Step 1: Select Product Type (e.g., Ijarah)
Step 2: System Loads Required Gates
Step 3: Verify Each Gate with Evidence
Step 4: Block Transaction if Gate Fails
Step 5: Issue Compliance Certificate if All Pass
```

### 9. Late-Fee & Penalty Treatment
**Control Name**: Penalty Donation (No Profit from Delays)
**Simple Description**: "Late fees and penalties must be donated to charity, not recorded as income"
**Evidence**:
- Late fee calculation
- Donation approval (Shariah Board)
- Approved charity list
- Donation receipt
- Ledger reconciliation (ensure not booked as income)

**UI Workflow**:
```
Step 1: Calculate Late Fee or Penalty
Step 2: Flag Amount for Purification (Not Income)
Step 3: Get Shariah Board Approval
Step 4: Donate to Approved Charity
Step 5: Reconcile to Ensure Not Booked as Revenue
```

### 10. Template Discipline (IIFM/ISDA/BAFT Standards)
**Control Name**: Standardized Contract Compliance
**Simple Description**: "Use approved contract templates and control any deviations tightly"
**Evidence**:
- Template library (IIFM/ISDA/BAFT standard)
- Template version control
- Shariah Board approval of template
- Deviation log (if any)
- Shariah Board approval of deviations

**UI Workflow**:
```
Step 1: Select Approved Template (e.g., IIFM Ijarah v2.1)
Step 2: Fill Required Fields
Step 3: If Deviation Needed, Request Shariah Board Approval
Step 4: Link to Underlying Shariah Ruling (Fatwa)
Step 5: Record Final Contract with Version & Approvals
```

---

## Persona-Based Value Prop Integration (UI Messaging)

### 1. Welcome Screen - Role Selection
**Headline**: "Welcome to the Islamic Finance GRC Platform"

**Subheadline**: "AI-powered compliance automation built on AAOIFI, IFSB, and ISO standards"

**Role Cards** (with persona-specific value props):

#### For Shariah Officers / Shariah Board Members
**Card Title**: "Shariah Compliance Officer"
**Value Prop**: "Automate Shariah reviews, track breach risks, and generate audit-ready reports—with 80% less manual work."
**Quick Actions**:
- Review pending transactions (5)
- View Shariah breach risk register
- Generate Shariah Board report

#### For Compliance Officers
**Card Title**: "Compliance Officer"
**Value Prop**: "Stay audit-ready 24/7. Meet AAOIFI, IFSB, and regulatory requirements automatically."
**Quick Actions**:
- View compliance dashboard
- Review control testing results
- Prepare for regulator visit

#### For Risk Officers
**Card Title**: "Risk Management Officer"
**Value Prop**: "Monitor SNCR, DCR, and fiduciary risks in real-time. One dashboard for all Islamic risk categories."
**Quick Actions**:
- View risk heat map
- Review PER/IRR triggers
- Analyze Shariah breach trends

#### For Innovation Teams / Digital Asset Teams
**Card Title**: "Digital Asset Manager"
**Value Prop**: "Launch compliant Sukuk, tokens, and digital assets in weeks—not quarters. Compliance is built-in."
**Quick Actions**:
- Configure new Sukuk issuance
- Issue verifiable credentials
- Tokenize compliant assets

#### For CFO / Executives
**Card Title**: "Executive Dashboard"
**Value Prop**: "One view of Shariah compliance health, regulatory risk exposure, and digital asset performance."
**Quick Actions**:
- View executive summary
- Review Board reports
- Track purification & charity donations

---

### 2. Dashboard Widgets (Persona-Specific)

#### Shariah Compliance Officer Dashboard
```
┌─────────────────────────────────────────────┐
│ Shariah Governance Overview                 │
├─────────────────────────────────────────────┤
│ Transactions Pending Shariah Review: 12     │
│ Shariah Breach Risk (SNCR) Incidents: 2     │
│ Purification Amount (This Quarter): QAR 8.5K│
│ Next Shariah Board Meeting: Mar 15, 2025    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Top Shariah Compliance Issues               │
├─────────────────────────────────────────────┤
│ • 2 Ijarah contracts: rent collected before │
│   delivery - QAR 5,200 requires purification│
│ • 1 Murabaha: cost disclosure incomplete    │
│   - pending document upload                 │
└─────────────────────────────────────────────┘
```

#### Risk Management Officer Dashboard
```
┌─────────────────────────────────────────────┐
│ Islamic Risk Categories                     │
├─────────────────────────────────────────────┤
│ Shariah Breach Risk (SNCR):        Medium   │
│ Profit Smoothing Risk (DCR):       Low      │
│ Profit Rate Risk (RoR):            Low      │
│ Investor Trust Risk (Fiduciary):   Low      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Profit Smoothing Reserves (PER/IRR)         │
├─────────────────────────────────────────────┤
│ PER Balance: QAR 1.2M                       │
│ IRR Balance: QAR 800K                       │
│ Trigger Threshold: 2% profit variance       │
│ Status: Within Policy ✓                     │
└─────────────────────────────────────────────┘
```

#### Digital Asset Manager Dashboard
```
┌─────────────────────────────────────────────┐
│ Compliant Digital Assets                    │
├─────────────────────────────────────────────┤
│ Active Sukuk Issuances: 3                   │
│ Verifiable Credentials Issued: 847          │
│ Tokenized Assets: 12 (QAR 45M)              │
│ All Shariah-Compliant ✓                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Ready to Launch                             │
├─────────────────────────────────────────────┤
│ ✓ Shariah Board Approved                    │
│ ✓ All Contract Gates Passed                 │
│ ✓ Risk Assessment Complete                  │
│ → Issue Verifiable Credentials              │
│ → Tokenize Asset                            │
└─────────────────────────────────────────────┘
```

---

### 3. Workflow Step Messaging (Simple + Authoritative)

#### Example: Ijarah (Islamic Lease) Process

**Step 1: Define Lease Terms**
- **Title**: "Configure Islamic Lease (Ijarah)"
- **Subtitle**: "Set rental terms, asset details, and maintenance responsibilities"
- **Why**: "Per AAOIFI Shariah Standard 9, the lessor must own the asset and bear major maintenance costs."
- **Checklist**:
  - ✓ Asset identification & ownership proof
  - ✓ Rental amount & payment schedule
  - ✓ Maintenance split (lessor: major, lessee: minor)
  - ✓ Takaful (insurance) coverage

**Step 2: Shariah Board Approval**
- **Title**: "Request Shariah Board Approval"
- **Subtitle**: "Submit lease structure for Shariah Board review"
- **Why**: "AAOIFI GS-1 requires Shariah Board approval for new product structures and significant transactions."
- **Evidence Upload**:
  - Lease agreement draft
  - Asset ownership documents
  - Takaful (insurance) policy
  - Shariah ruling (fatwa) reference

**Step 3: Verify Delivery Before Rent**
- **Title**: "Confirm Asset Delivery"
- **Subtitle**: "Rent can only start AFTER the lessee takes possession"
- **Why**: "Per QFCRA IBANK 1.3.12 and AAOIFI SS-9, the lessor bears risk until delivery. Collecting rent before delivery creates Shariah Breach Risk (SNCR)."
- **Control Gate**:
  - ❌ BLOCKED: Cannot collect rent until delivery confirmed
  - ✓ Delivery acceptance signed by lessee
  - → Proceed to rent collection

**Step 4: Record on Blockchain**
- **Title**: "Issue Verifiable Credential"
- **Subtitle**: "Create blockchain-verified proof of Shariah compliance"
- **Why**: "QFC Digital Asset Regulations Article 19 requires verifiable records of compliance for tokenized assets."
- **Output**:
  - Validation Certificate (VC) issued
  - Recorded on Hedera Consensus Service (HCS)
  - NFT certificate minted (optional)

---

### 4. Help Text & Tooltips (Jargon Explanations)

| Term in UI | Tooltip Explanation |
|------------|---------------------|
| **Shariah Breach Risk (SNCR)** | "Risk that a transaction violates Shariah principles, requiring purification (donating non-compliant income to charity)" |
| **Profit Smoothing Risk (DCR)** | "Risk that the bank must reduce its own profits to smooth returns for Investment Account Holders during poor performance" |
| **Profit Smoothing Reserve (PER)** | "Reserve set aside to smooth profit distributions to investors during periods of volatility" |
| **Investment Protection Reserve (IRR)** | "Reserve to absorb losses and protect Investment Account Holders' capital" |
| **Purification** | "Donating income from Shariah breaches to charity (not kept as profit)" |
| **Ex-ante Review** | "Shariah review BEFORE transaction execution (preventive)" |
| **Ex-post Review** | "Shariah review AFTER transaction execution (detective)" |
| **Fatwa** | "Formal legal opinion issued by the Shariah Board on whether something is permissible" |
| **Takaful** | "Islamic insurance based on mutual cooperation and donation" |
| **Investment Account Holders (IAH)** | "Investors who deposit funds in profit-sharing accounts (not guaranteed deposits)" |

---

### 5. Error Messages (Simple + Helpful)

| Error Scenario | User-Friendly Message | Technical Detail (Expandable) |
|----------------|----------------------|-------------------------------|
| Rent collected before delivery | **"Cannot collect rent yet - asset delivery not confirmed"** | "Per AAOIFI SS-9 §4/4, rental payments can only commence after the lessee has received the asset. This prevents Shariah Breach Risk (SNCR)." |
| Missing Takaful | **"Islamic insurance (Takaful) required before lease starts"** | "AAOIFI SS-9 requires the lessor to bear risk of asset loss. Takaful coverage protects against this risk." |
| No Shariah Board approval | **"Shariah Board approval required for this transaction type"** | "AAOIFI GS-1 §6/1 requires SSB approval for new products and significant transactions." |
| Purification amount not reconciled | **"Purification ledger doesn't match charity donations"** | "QAR 5,200 flagged for purification but only QAR 3,000 donated. Reconcile and donate remaining QAR 2,200." |
| PER threshold breached | **"Profit variance exceeded policy threshold - PER transfer required"** | "Profit Smoothing Reserve (PER) policy triggered: actual profit 2.5% below target (threshold: 2%). Transfer from PER to smooth investor returns." |

---

### 6. Onboarding Wizard (First-Time User Experience)

**Screen 1: Welcome**
```
┌──────────────────────────────────────────────────────┐
│  Welcome to the Islamic Finance GRC Platform         │
│  AI-Powered Shariah Compliance & Risk Management     │
│                                                       │
│  What you can do:                                    │
│  ✓ Automate Shariah reviews (ex-ante & ex-post)     │
│  ✓ Track Shariah Breach Risk (SNCR) & purification  │
│  ✓ Manage PER/IRR reserves for investor protection  │
│  ✓ Issue blockchain-verified compliance certificates│
│  ✓ Launch compliant Sukuk and digital assets        │
│                                                       │
│  Built on: AAOIFI • IFSB • ISO 37301 • ISO 31000    │
│                                                       │
│             [Continue] [Watch 2-min Demo]            │
└──────────────────────────────────────────────────────┘
```

**Screen 2: Role Selection**
```
┌──────────────────────────────────────────────────────┐
│  What's your role?                                   │
│                                                       │
│  This helps us customize your dashboard and workflows│
│                                                       │
│  ○ Shariah Compliance Officer                        │
│    → Automate Shariah reviews & breach tracking     │
│                                                       │
│  ○ Risk Management Officer                           │
│    → Monitor SNCR, DCR, PER/IRR in real-time        │
│                                                       │
│  ○ Compliance Officer                                │
│    → Stay audit-ready for AAOIFI/IFSB requirements  │
│                                                       │
│  ○ Digital Asset Manager                             │
│    → Issue compliant Sukuk & verifiable credentials │
│                                                       │
│  ○ Executive / CFO                                   │
│    → View compliance health & risk exposure         │
│                                                       │
│                      [Next]                          │
└──────────────────────────────────────────────────────┘
```

**Screen 3: Quick Start**
```
┌──────────────────────────────────────────────────────┐
│  Let's get started                                   │
│                                                       │
│  Choose your first task:                             │
│                                                       │
│  □ Configure an Islamic Lease (Ijarah) process      │
│    Learn how contract gates prevent Shariah breaches│
│                                                       │
│  □ Set up Shariah Breach Risk (SNCR) monitoring     │
│    Track incidents and automate purification        │
│                                                       │
│  □ Define PER/IRR policy for investor protection    │
│    Protect Investment Account Holders               │
│                                                       │
│  □ Review the Qatar Ijarah Demo (9 sections)        │
│    See a complete end-to-end example                │
│                                                       │
│  □ Skip - take me to my dashboard                   │
│                                                       │
│                      [Start]                         │
└──────────────────────────────────────────────────────┘
```

---

### 7. Standards Badge System (Build Trust)

Throughout the platform, show which standard each control maps to:

```
┌─────────────────────────────────────────────┐
│ Shariah Board Independence Check            │
│ [AAOIFI GS-1] [AAOIFI GS-5] [IFSB-10]      │
├─────────────────────────────────────────────┤
│ Verify Shariah Board members meet           │
│ independence and competence requirements    │
│                                             │
│ Evidence required:                          │
│ • Fit-and-proper assessment                 │
│ • Independence declarations                 │
│ • Conflict of Interest logs                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Contract-Sequence Gate: Ijarah Delivery     │
│ [AAOIFI SS-9] [QFCRA IBANK 1.3.12]         │
├─────────────────────────────────────────────┤
│ Rent can only be collected AFTER lessee    │
│ takes possession of the asset               │
│                                             │
│ Why: Lessor bears risk until delivery.     │
│ Collecting rent before = Shariah breach    │
└─────────────────────────────────────────────┘
```

---

## Implementation Priority (4 Phases)

### Phase 1: Platform Identity & Governance (Week 1)
**Files to Update**:
- Update platform name throughout
- Add Shariah Governance section to navigation
- Create SSB management UI
- Add Islamic risk categories to risk register

**Key Changes**:
- All references to "GRC" → "Governance, Risk & Compliance"
- Add "Shariah Governance" top-level menu
- Risk categories: Add SNCR, DCR, RoR, Fiduciary
- Dashboard: Add persona-based welcome

### Phase 2: Core Terminology Sweep (Week 2)
**Files to Update**:
- All workflow/process labels
- Error messages
- Help text and tooltips
- Control library

**Key Changes**:
- Add parenthetical explanations (e.g., "Shariah Breach Risk (SNCR)")
- Simplify status labels (e.g., "Pending Shariah Board Approval")
- Update all product names (e.g., "Islamic Lease (Ijarah)")

### Phase 3: Controls & Workflows (Week 3)
**Files to Update**:
- Implement 10 Islamic GRC control templates
- Add contract-sequence gates for each product type
- Build purification workflow
- Create PER/IRR management UI

**Key Changes**:
- Ijarah gates (delivery before rent, Takaful, maintenance split)
- IMB gates (separate sale/gift contract)
- Purification ledger and charity donation workflow
- PER/IRR policy configuration

### Phase 4: Documentation & Onboarding (Week 4)
**Files to Update**:
- User guide with glossary
- Onboarding wizard
- Context-sensitive help
- Standards mapping document

**Key Changes**:
- Create glossary of Islamic finance terms
- Build role-based onboarding flows
- Add standards badges to all controls
- Create "Learn More" links to AAOIFI/IFSB resources

---

## Developer Reference: Technical Term Mapping

| User-Facing UI | Backend/API | Database Schema | MCP Tool / VC Field |
|----------------|-------------|-----------------|---------------------|
| Shariah Board | ssb | shariah_supervisory_board | ssb_approval |
| Shariah Breach Risk | sncr | shariah_noncompliance_risk | sncr_incident |
| Purification | purification | purification_ledger | purification_amount |
| Islamic Lease | ijarah | ijarah_contract | ijarah_delivery_gate |
| Profit Smoothing Reserve | per | profit_equalisation_reserve | per_balance |
| Investment Protection Reserve | irr | investment_risk_reserve | irr_transfer |
| Shariah Ruling | fatwa | fatwa_reference | fatwa_id |
| Islamic Insurance | takaful | takaful_policy | takaful_evidence |

This ensures developers know the technical implementation while users see simple language.

---

## Next Steps

1. ✅ Terminology mapping complete
2. → Implement Phase 1 (Platform Identity & Governance)
3. → Update all V1 and V2 demos with Islamic GRC terminology
4. → Create persona-based dashboards
5. → Build 10 Islamic GRC control templates
6. → Add onboarding wizard with role selection
