# Islamic Finance GRC Infrastructure - System Architecture

**Version**: 1.0
**Date**: 2025-11-08
**Status**: Design Complete - Ready for Implementation

---

## Executive Summary

This document defines the **complete system architecture** for a standards-compliant Islamic Finance GRC (Governance, Risk, Compliance) infrastructure, using Qatar as the reference implementation.

**Architecture Goals**:
1. **Standards-Aligned**: ISO 37301 + ISO 31000 + COSO + IFSB/AAOIFI compliant
2. **Jurisdiction-Agnostic**: Qatar first, replicable to SAMA/BNM/CBB
3. **Multi-Regulator**: Supports dual regulation (QCB + QFCRA)
4. **Pluggable Backend**: Maintains existing architectural principles
5. **Scalable**: Handles enterprise-grade compliance operations

**Key Principles**:
- Universal GRC Engine + Islamic Finance Layer + Jurisdiction Plugins
- Microservices architecture with clear boundaries
- Event-driven for real-time compliance monitoring
- API-first for frontend flexibility
- MCP/Graphiti integration for knowledge management

---

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     GRC System Boundary                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Presentation Layer                        │  │
│  │  ┌─────────┐  ┌────────────┐  ┌───────────┐  ┌────────┐ │  │
│  │  │ Web UI  │  │ Mobile UI  │  │ Admin UI  │  │Reports │ │  │
│  │  └────┬────┘  └─────┬──────┘  └─────┬─────┘  └────┬───┘ │  │
│  └───────┼─────────────┼────────────────┼─────────────┼─────┘  │
│          │             │                │             │        │
│  ┌───────┴─────────────┴────────────────┴─────────────┴─────┐  │
│  │               API Gateway / Backend Client               │  │
│  │          (Service Discovery + Load Balancing)            │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐  │
│  │                   Service Layer                          │  │
│  │  ┌──────────────┐  ┌────────────┐  ┌────────────────┐   │  │
│  │  │  Obligations │  │  Control   │  │      SSB       │   │  │
│  │  │   Service    │  │  Execution │  │   Governance   │   │  │
│  │  │              │  │  Service   │  │    Service     │   │  │
│  │  └──────┬───────┘  └──────┬─────┘  └────────┬───────┘   │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌────────────┐  ┌────────────────┐   │  │
│  │  │   Evidence   │  │    SNCR    │  │   Regulatory   │   │  │
│  │  │  Collection  │  │  Incident  │  │   Reporting    │   │  │
│  │  │   Service    │  │  Service   │  │    Service     │   │  │
│  │  └──────┬───────┘  └──────┬─────┘  └────────┬───────┘   │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌────────────┐  ┌────────────────┐   │  │
│  │  │     Risk     │  │   Workflow │  │  Notification  │   │  │
│  │  │  Management  │  │   Engine   │  │    Service     │   │  │
│  │  │   Service    │  │            │  │                │   │  │
│  │  └──────┬───────┘  └──────┬─────┘  └────────┬───────┘   │  │
│  └─────────┼──────────────────┼──────────────────┼──────────┘  │
│            │                  │                  │             │
│  ┌─────────┴──────────────────┴──────────────────┴──────────┐  │
│  │                    Data Layer                             │  │
│  │  ┌──────────┐  ┌────────────┐  ┌────────────┐            │  │
│  │  │PostgreSQL│  │   Neo4j    │  │   Redis    │            │  │
│  │  │  (Main)  │  │ (Graphiti) │  │  (Cache)   │            │  │
│  │  └──────────┘  └────────────┘  └────────────┘            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Integration Layer                            │  │
│  │  ┌──────────┐  ┌────────────┐  ┌────────────┐            │  │
│  │  │   MCP    │  │   Hedera   │  │  External  │            │  │
│  │  │ Graphiti │  │Blockchain  │  │Evidence Src│            │  │
│  │  └──────────┘  └────────────┘  └────────────┘            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

External Actors:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  SSB Members │  │  Compliance  │  │  Regulators  │  │   External   │
│              │  │   Officers   │  │  (QCB/QFCRA) │  │   Auditors   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Architecture Layers

### Layer 1: Presentation Layer

**Components**:
- Web UI (Next.js 14 App Router)
- Mobile UI (React Native - future)
- Admin UI (specialized dashboards)
- Report Viewer (PDF/Excel generation)

**Responsibilities**:
- User interface rendering
- User interaction handling
- State management (Zustand)
- Real-time updates (SSE consumption)

**Technology Stack**:
- Framework: Next.js 14
- State: Zustand
- UI Library: Radix UI + Tailwind CSS
- Forms: React Hook Form + Zod
- Real-time: Server-Sent Events (SSE)

---

### Layer 2: API Gateway / Backend Client

**Current Implementation**: `src/lib/backend-client.ts`

**Enhanced for GRC**:

```typescript
interface BackendClient {
  // Existing
  init(): Promise<void>
  searchGraphiti(query: string): Promise<Results>

  // New GRC Services
  obligations: {
    list(regulator?: QatarRegulator[]): Promise<Obligation[]>
    get(id: string): Promise<Obligation>
    checkCompliance(id: string): Promise<ComplianceStatus>
  }

  controls: {
    list(activated?: boolean): Promise<Control[]>
    execute(controlId: string): Promise<ControlTest>
    getResults(controlId: string): Promise<ControlTest[]>
  }

  ssb: {
    getDecisions(): Promise<SSBDecision[]>
    submitProductApproval(product: Product): Promise<ApprovalWorkflow>
    recordVote(decisionId: string, vote: Vote): Promise<void>
  }

  evidence: {
    upload(file: File, obligationId: string): Promise<Evidence>
    collect(sourceId: string): Promise<Evidence>
    verify(evidenceId: string): Promise<VerificationResult>
  }

  sncr: {
    reportIncident(incident: SNCRIncident): Promise<SNCRIncident>
    calculatePurification(incidentId: string): Promise<Purification>
    recordPurification(purification: Purification): Promise<void>
  }

  reports: {
    list(): Promise<Report[]>
    generate(reportId: string): Promise<ReportArtifact>
    submit(reportId: string): Promise<SubmissionConfirmation>
  }
}
```

**Service Discovery Enhancement**:
```typescript
interface ServiceDiscovery {
  discover(): Promise<AvailableServices>
  getCapabilities(service: string): Promise<ServiceCapabilities>
  checkHealth(service: string): Promise<HealthStatus>
}

interface AvailableServices {
  grc: {
    obligations: boolean
    controls: boolean
    evidence: boolean
    ssb: boolean
    sncr: boolean
    reporting: boolean
  }
  integrations: {
    graphiti: boolean
    hedera: boolean
    externalEvidence: boolean
  }
}
```

---

### Layer 3: Service Layer

#### 3.1 Obligations Service

**Responsibilities**:
- Manage obligations register (CRUD)
- Filter obligations by regulator
- Track compliance status
- Map obligations to controls
- Schedule obligation assessments

**API Endpoints**:
```
GET  /api/obligations                    # List all obligations
GET  /api/obligations/:id                # Get obligation details
GET  /api/obligations/regulator/:reg    # Filter by regulator
POST /api/obligations/:id/assess         # Assess compliance
GET  /api/obligations/:id/controls       # Get linked controls
GET  /api/obligations/:id/evidence       # Get required evidence
```

**Data Model**:
```python
class Obligation(BaseModel):
    id: str
    title: str
    requirement: str
    applicability: List[QatarRegulator]  # ['QCB'], ['QFCRA'], or both
    category: ObligationCategory
    frequency: Frequency  # OneTime, Ongoing, Daily, Monthly, Quarterly, Annual
    timeline: Optional[str]
    evidence_required: List[str]
    penalty: Optional[str]
    source: str  # Regulation citation
    qcb_details: Optional[ObligationDetails]
    qfcra_details: Optional[ObligationDetails]
    related_standards: List[str]  # AAOIFI, IFSB, ISO references
    related_controls: List[str]  # Control IDs
    compliance_status: ComplianceStatus
    last_assessed: Optional[datetime]
    next_assessment: Optional[datetime]
    priority: Priority  # Critical, High, Medium, Low
```

**Business Logic**:
- When user selects regulator(s), filter applicable obligations
- When obligation is assessed, update compliance status
- Schedule next assessment based on frequency
- Alert on upcoming assessments

---

#### 3.2 Control Execution Service

**Responsibilities**:
- Execute control tests
- Collect test evidence
- Record test results
- Calculate KRI/KCI
- Schedule periodic tests
- Manage control failures and remediation

**API Endpoints**:
```
GET  /api/controls                       # List all controls
GET  /api/controls/:id                   # Get control details
POST /api/controls/:id/execute           # Execute control test
GET  /api/controls/:id/tests             # Get test history
POST /api/controls/:id/schedule          # Schedule periodic test
GET  /api/controls/:id/kri               # Get KRI/KCI values
POST /api/controls/:id/remediate         # Record remediation action
```

**Data Model**:
```python
class Control(BaseModel):
    id: str
    bucket: int  # 1-5
    title: str
    objective: str
    trigger: str
    frequency: Frequency
    required_evidence: List[str]
    rule_source: List[str]  # Standards references
    proof_type: str
    activated_by: List[QatarRegulator]
    test_procedures: Dict[QatarRegulator, str]
    kri_definitions: List[KRIDefinition]

class ControlTest(BaseModel):
    id: str
    control_id: str
    regulator: QatarRegulator
    test_date: datetime
    tester: str  # User ID
    procedure_used: str
    evidence_collected: List[str]  # Evidence IDs
    result: TestResult  # Pass, Fail, Partial
    findings: Optional[str]
    remediation_required: bool
    remediation_action: Optional[str]
    remediation_deadline: Optional[date]
    kri_values: Dict[str, float]

class KRIDefinition(BaseModel):
    name: str
    calculation: str
    threshold_warning: float
    threshold_critical: float
    unit: str
```

**Business Logic**:
- Schedule tests based on frequency
- Execute test procedure
- Collect evidence automatically where possible
- Calculate KRI values
- Alert on threshold breaches
- Create issues for control failures
- Track remediation to completion

---

#### 3.3 SSB Governance Service

**Responsibilities**:
- Manage SSB members
- Product approval workflow
- SSB decision recording
- Voting and dissent tracking
- SSB reporting generation

**API Endpoints**:
```
GET  /api/ssb/members                    # List SSB members
POST /api/ssb/members                    # Add SSB member
GET  /api/ssb/decisions                  # List SSB decisions
POST /api/ssb/decisions                  # Record decision
POST /api/ssb/product-approval           # Submit product for approval
POST /api/ssb/vote                       # Record vote
GET  /api/ssb/reports                    # Generate SSB reports
```

**Data Model**:
```python
class SSBMember(BaseModel):
    id: str
    name: str
    qualifications: List[str]
    expertise: List[str]
    appointment_date: date
    term_end_date: Optional[date]
    other_positions: List[str]  # For position limit tracking (QCB: max 3)
    independence_attestation: bool
    cooling_off_end_date: Optional[date]  # QCB: 2-year cooling-off

class SSBDecision(BaseModel):
    id: str
    decision_type: DecisionType  # ProductApproval, Fatwa, PolicyReview, etc.
    subject: str
    description: str
    meeting_date: date
    quorum_met: bool
    voting_record: List[Vote]
    decision_outcome: Outcome  # Approved, Rejected, Conditional
    conditions: Optional[List[str]]
    dissents: Optional[List[Dissent]]
    effective_date: date
    expiry_date: Optional[date]
    related_products: List[str]
    related_transactions: List[str]
    fatwa_text: Optional[str]

class Vote(BaseModel):
    member_id: str
    vote: VoteValue  # Approve, Reject, Abstain
    rationale: Optional[str]

class Dissent(BaseModel):
    member_id: str
    dissent_text: str
    reasoning: str
```

**Business Logic**:
- Product approval requires quorum and majority vote
- Record all votes and dissents
- Generate SSB annual report (QCB: within 90 days; QFCRA: within 3 months)
- Track SSB member positions for QCB limit (max 3)
- Enforce cooling-off period (QCB: 2 years)

---

#### 3.4 Evidence Collection Service

**Responsibilities**:
- Collect evidence from multiple sources
- Store evidence securely
- Verify evidence authenticity
- Manage retention periods
- Support bilingual evidence (Arabic + English for QCB)

**API Endpoints**:
```
POST /api/evidence/upload                # Manual upload
POST /api/evidence/collect               # Automated collection
GET  /api/evidence/:id                   # Get evidence
POST /api/evidence/:id/verify            # Verify evidence
GET  /api/evidence/obligation/:id        # Evidence for obligation
POST /api/evidence/:id/mint-vc           # Mint Verifiable Credential
```

**Data Model**:
```python
class Evidence(BaseModel):
    id: str
    type: EvidenceType  # Document, APIResponse, BlockchainTx, Calculation
    name: str
    description: str
    source: EvidenceSource  # SharePoint, S3, API, Agent, Manual, Guardian
    file_path: Optional[str]
    file_hash: Optional[str]
    language: List[str]  # ['ar', 'en'] for bilingual
    collected_date: datetime
    retention_period_years: int  # QCB: 10, QFCRA: 6
    retention_deadline: date
    status: EvidenceStatus  # Verified, Pending, Missing, Stale
    related_obligations: List[str]
    related_controls: List[str]
    related_control_tests: List[str]
    verifiable_credential_id: Optional[str]
    blockchain_tx_id: Optional[str]

class VerifiableCredential(BaseModel):
    id: str
    issuer: str
    credential_subject: Dict[str, Any]
    issuance_date: datetime
    expiration_date: Optional[datetime]
    proof: VCProof
    hedera_tx_id: Optional[str]

class VCProof(BaseModel):
    type: str  # Ed25519Signature2020
    created: datetime
    proof_purpose: str
    verification_method: str
    proof_value: str
```

**Business Logic**:
- Automated evidence collection from integrated sources
- Hash evidence on upload for integrity
- Enforce retention deadlines (QCB: 10 years; QFCRA: 6 years)
- Auto-delete evidence past retention (with audit log)
- Support bilingual evidence upload/storage for QCB
- Mint VCs for critical evidence and anchor to Hedera

---

#### 3.5 SNCR Incident Service

**Responsibilities**:
- SNCR incident detection and reporting
- Purification calculation
- Purification tracking and evidence
- SNCR reporting to SSB/regulators

**API Endpoints**:
```
POST /api/sncr/incident                  # Report SNCR incident
GET  /api/sncr/incidents                 # List incidents
POST /api/sncr/:id/investigate           # Record investigation
POST /api/sncr/:id/purify                # Calculate purification
POST /api/sncr/:id/record-purification   # Record purification donation
POST /api/sncr/:id/notify                # Notify SSB/regulator
```

**Data Model**:
```python
class SNCRIncident(BaseModel):
    id: str
    incident_date: date
    detection_method: DetectionMethod  # Automated, ManualReview, AuditFinding, External
    description: str
    affected_product: Optional[str]
    affected_transactions: List[str]
    shariah_principle_violated: str
    root_cause: Optional[str]
    investigation_status: InvestigationStatus
    financial_impact: Decimal
    purification_required: bool
    purification_amount: Optional[Decimal]
    purification_status: PurificationStatus
    reported_to_ssb: bool
    reported_to_regulator: bool
    remediation_action: Optional[str]
    remediation_deadline: Optional[date]

class PurificationJournal(BaseModel):
    id: str
    incident_id: str
    amount: Decimal
    currency: str
    calculation_method: str
    beneficiary_name: str
    beneficiary_type: str  # Charity, Islamic organization
    donation_date: date
    proof_of_donation: str  # Evidence ID
    recorded_by: str  # User ID
    approved_by: str  # SSB member ID
```

**Business Logic**:
- QCB: Report SNCR to SSB within 24 hours, to QCB within 5 days
- QFCRA: Report in reasonable time
- Calculate purification amount (non-compliant income)
- Route purification to charity (NOT back to entity)
- Record proof of donation
- Include SNCR summary in SSB annual report

---

#### 3.6 Regulatory Reporting Service

**Responsibilities**:
- Generate regulatory reports (55+ for Qatar)
- Collect report data from system
- Validate report completeness
- Track submission deadlines
- Record submission confirmations

**API Endpoints**:
```
GET  /api/reports                        # List all reports
GET  /api/reports/calendar               # Reporting calendar
POST /api/reports/:id/generate           # Generate report
GET  /api/reports/:id/data               # Get report data
POST /api/reports/:id/validate           # Validate report
POST /api/reports/:id/submit             # Submit to regulator
GET  /api/reports/:id/status             # Submission status
```

**Data Model**:
```python
class Report(BaseModel):
    id: str
    report_type: str  # "QCB_Monthly_Financial", "QFCRA_Quarterly_Prudential", etc.
    regulator: QatarRegulator
    frequency: Frequency
    due_date_rule: str  # "15th of following month", "90 days after year-end", etc.
    next_due_date: date
    template_id: str
    required_data_points: List[str]

class ReportGeneration(BaseModel):
    id: str
    report_id: str
    period_start: date
    period_end: date
    generated_date: datetime
    generated_by: str  # User ID
    data_collected: Dict[str, Any]
    validation_status: ValidationStatus
    validation_errors: List[str]
    artifact_path: str  # PDF/Excel file path
    submitted: bool
    submission_date: Optional[datetime]
    submission_confirmation: Optional[str]
```

**Business Logic**:
- Calculate due dates based on rules
- Alert 2 weeks before deadline
- Collect data from obligations, controls, SSB, etc.
- Validate data completeness before generation
- Generate PDF/Excel artifact
- Track submission and confirmation

---

#### 3.7 Risk Management Service

**Responsibilities**:
- Maintain risk register
- Calculate KRIs
- Track risk mitigation
- Risk reporting

**API Endpoints**:
```
GET  /api/risks                          # List all risks
POST /api/risks                          # Create risk
GET  /api/risks/:id                      # Get risk details
POST /api/risks/:id/assess               # Assess risk
POST /api/risks/:id/mitigate             # Record mitigation
GET  /api/risks/:id/kri                  # Get KRI values
```

**Data Model**:
```python
class Risk(BaseModel):
    id: str
    risk_type: RiskType  # SNCR, Fiduciary, DCR, Operational, etc.
    category: str
    description: str
    likelihood: int  # 1-5
    impact: int  # 1-5
    inherent_risk_score: int  # likelihood × impact
    mitigation_controls: List[str]  # Control IDs
    residual_risk_score: int
    risk_owner: str  # User ID
    status: RiskStatus  # Open, Mitigated, Accepted, Closed
    kri_definitions: List[KRIDefinition]
    kri_current_values: Dict[str, float]

class RiskType(str, Enum):
    SNCR = "SNCR"  # Shariah Non-Compliance Risk
    FIDUCIARY = "Fiduciary"
    DCR = "DisplacedCommercialRisk"
    EQUITY_INVESTMENT = "EquityInvestment"
    LIQUIDITY = "Liquidity"
    OPERATIONAL = "Operational"
    CONDUCT = "Conduct"
```

**Business Logic**:
- Calculate inherent and residual risk scores
- Link risks to mitigation controls
- Calculate KRI values
- Alert on KRI threshold breaches
- Track risk mitigation actions

---

#### 3.8 Workflow Engine

**Current Implementation**: `backend/app/services/workflow_engine.py`

**Enhanced for GRC**:
- Support for approval workflows (SSB product approval)
- Support for maker-checker workflows
- Support for escalation workflows (SNCR, control failures)
- Role-based gates (only SSB can approve products)

**New Workflow Types**:
1. **Product Approval Workflow**
   - Submit → SSB Review → SSB Meeting → Vote → Approve/Reject → Record Decision

2. **Control Test Workflow**
   - Schedule → Execute → Collect Evidence → Evaluate → Pass/Fail → Remediate (if fail)

3. **SNCR Incident Workflow**
   - Detect → Stop → Notify SSB → Investigate → Quantify → Purify → Report → Close

4. **Report Generation Workflow**
   - Alert → Collect Data → Validate → Generate → Review → Submit → Confirm

---

#### 3.9 Notification Service

**Responsibilities**:
- Send notifications for deadlines, failures, approvals
- Support multiple channels (email, SMS, in-app)
- Queue and batch notifications

**API Endpoints**:
```
POST /api/notifications/send             # Send notification
GET  /api/notifications/user/:id         # Get user notifications
POST /api/notifications/:id/read         # Mark as read
```

**Data Model**:
```python
class Notification(BaseModel):
    id: str
    recipient_id: str
    notification_type: NotificationType
    priority: Priority
    subject: str
    body: str
    channels: List[Channel]  # Email, SMS, InApp
    sent_date: datetime
    read: bool
    action_required: bool
    action_link: Optional[str]
```

---

### Layer 4: Data Layer

#### 4.1 PostgreSQL (Primary Database)

**Tables**:

**Obligations**
```sql
CREATE TABLE obligations (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  requirement TEXT NOT NULL,
  applicability VARCHAR[] NOT NULL,  -- ['QCB'], ['QFCRA'], or ['QCB','QFCRA']
  category VARCHAR(100),
  frequency VARCHAR(50),
  timeline VARCHAR(500),
  evidence_required TEXT[],
  penalty TEXT,
  source TEXT NOT NULL,
  qcb_details JSONB,
  qfcra_details JSONB,
  related_standards TEXT[],
  related_controls UUID[],
  compliance_status VARCHAR(50),
  last_assessed TIMESTAMP,
  next_assessment TIMESTAMP,
  priority VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_obligations_applicability ON obligations USING GIN(applicability);
CREATE INDEX idx_obligations_compliance_status ON obligations(compliance_status);
CREATE INDEX idx_obligations_next_assessment ON obligations(next_assessment);
```

**Controls**
```sql
CREATE TABLE controls (
  id UUID PRIMARY KEY,
  bucket INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  objective TEXT,
  trigger VARCHAR(200),
  frequency VARCHAR(50),
  required_evidence TEXT[],
  rule_source TEXT[],
  proof_type VARCHAR(100),
  activated_by VARCHAR[] NOT NULL,  -- ['QCB'], ['QFCRA'], or both
  test_procedures JSONB,  -- {qcb: "...", qfcra: "..."}
  kri_definitions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_controls_bucket ON controls(bucket);
CREATE INDEX idx_controls_activated_by ON controls USING GIN(activated_by);
```

**Control Tests**
```sql
CREATE TABLE control_tests (
  id UUID PRIMARY KEY,
  control_id UUID REFERENCES controls(id) NOT NULL,
  regulator VARCHAR(10) NOT NULL,  -- 'QCB' or 'QFCRA'
  test_date TIMESTAMP NOT NULL,
  tester_id UUID NOT NULL,  -- References user
  procedure_used TEXT,
  evidence_collected UUID[],  -- References evidence
  result VARCHAR(20) NOT NULL,  -- Pass, Fail, Partial
  findings TEXT,
  remediation_required BOOLEAN DEFAULT false,
  remediation_action TEXT,
  remediation_deadline DATE,
  kri_values JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_control_tests_control_id ON control_tests(control_id);
CREATE INDEX idx_control_tests_result ON control_tests(result);
CREATE INDEX idx_control_tests_test_date ON control_tests(test_date DESC);
```

**SSB Members**
```sql
CREATE TABLE ssb_members (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  qualifications TEXT[],
  expertise TEXT[],
  appointment_date DATE NOT NULL,
  term_end_date DATE,
  other_positions TEXT[],
  independence_attestation BOOLEAN DEFAULT false,
  cooling_off_end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**SSB Decisions**
```sql
CREATE TABLE ssb_decisions (
  id UUID PRIMARY KEY,
  decision_type VARCHAR(50) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  description TEXT,
  meeting_date DATE NOT NULL,
  quorum_met BOOLEAN NOT NULL,
  voting_record JSONB,
  decision_outcome VARCHAR(50) NOT NULL,
  conditions TEXT[],
  dissents JSONB,
  effective_date DATE NOT NULL,
  expiry_date DATE,
  related_products UUID[],
  related_transactions UUID[],
  fatwa_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ssb_decisions_decision_type ON ssb_decisions(decision_type);
CREATE INDEX idx_ssb_decisions_meeting_date ON ssb_decisions(meeting_date DESC);
```

**Evidence**
```sql
CREATE TABLE evidence (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  source VARCHAR(50) NOT NULL,
  file_path TEXT,
  file_hash VARCHAR(64),
  language VARCHAR[] DEFAULT ARRAY['en'],
  collected_date TIMESTAMP NOT NULL,
  retention_period_years INT NOT NULL,
  retention_deadline DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  related_obligations UUID[],
  related_controls UUID[],
  related_control_tests UUID[],
  verifiable_credential_id UUID,
  blockchain_tx_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evidence_status ON evidence(status);
CREATE INDEX idx_evidence_retention_deadline ON evidence(retention_deadline);
CREATE INDEX idx_evidence_related_obligations ON evidence USING GIN(related_obligations);
```

**SNCR Incidents**
```sql
CREATE TABLE sncr_incidents (
  id UUID PRIMARY KEY,
  incident_date DATE NOT NULL,
  detection_method VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  affected_product UUID,
  affected_transactions UUID[],
  shariah_principle_violated TEXT NOT NULL,
  root_cause TEXT,
  investigation_status VARCHAR(50),
  financial_impact DECIMAL(20,2),
  purification_required BOOLEAN DEFAULT true,
  purification_amount DECIMAL(20,2),
  purification_status VARCHAR(50),
  reported_to_ssb BOOLEAN DEFAULT false,
  reported_to_regulator BOOLEAN DEFAULT false,
  remediation_action TEXT,
  remediation_deadline DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sncr_incidents_incident_date ON sncr_incidents(incident_date DESC);
CREATE INDEX idx_sncr_incidents_purification_status ON sncr_incidents(purification_status);
```

**Purification Journal**
```sql
CREATE TABLE purification_journal (
  id UUID PRIMARY KEY,
  incident_id UUID REFERENCES sncr_incidents(id) NOT NULL,
  amount DECIMAL(20,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  calculation_method TEXT,
  beneficiary_name VARCHAR(200) NOT NULL,
  beneficiary_type VARCHAR(100) NOT NULL,
  donation_date DATE NOT NULL,
  proof_of_donation UUID,  -- References evidence
  recorded_by UUID NOT NULL,  -- User ID
  approved_by UUID NOT NULL,  -- SSB member ID
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purification_incident ON purification_journal(incident_id);
CREATE INDEX idx_purification_donation_date ON purification_journal(donation_date DESC);
```

**Reports**
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  report_type VARCHAR(100) NOT NULL,
  regulator VARCHAR(10) NOT NULL,
  frequency VARCHAR(50),
  due_date_rule TEXT,
  next_due_date DATE,
  template_id VARCHAR(100),
  required_data_points JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE report_generations (
  id UUID PRIMARY KEY,
  report_id UUID REFERENCES reports(id) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  generated_date TIMESTAMP NOT NULL,
  generated_by UUID NOT NULL,
  data_collected JSONB,
  validation_status VARCHAR(50),
  validation_errors TEXT[],
  artifact_path TEXT,
  submitted BOOLEAN DEFAULT false,
  submission_date TIMESTAMP,
  submission_confirmation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_report_generations_report_id ON report_generations(report_id);
CREATE INDEX idx_report_generations_submitted ON report_generations(submitted);
```

**Risks**
```sql
CREATE TABLE risks (
  id UUID PRIMARY KEY,
  risk_type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  description TEXT NOT NULL,
  likelihood INT CHECK (likelihood BETWEEN 1 AND 5),
  impact INT CHECK (impact BETWEEN 1 AND 5),
  inherent_risk_score INT,
  mitigation_controls UUID[],
  residual_risk_score INT,
  risk_owner UUID NOT NULL,
  status VARCHAR(50),
  kri_definitions JSONB,
  kri_current_values JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_risks_risk_type ON risks(risk_type);
CREATE INDEX idx_risks_status ON risks(status);
```

#### 4.2 Neo4j (Graphiti Knowledge Graph)

**Current Use**: Knowledge graph for Islamic finance precedents, rulings, concepts

**Enhanced for GRC**:

**Node Types**:
- `Obligation`: Regulatory obligations
- `Control`: Control definitions
- `Standard`: AAOIFI, IFSB, ISO standards
- `Ruling`: SSB fatwas and decisions
- `Product`: Islamic finance products
- `Concept`: Islamic finance concepts (Riba, Gharar, etc.)

**Relationship Types**:
- `REQUIRES`: Obligation REQUIRES Control
- `REFERENCES`: Obligation REFERENCES Standard
- `IMPLEMENTS`: Control IMPLEMENTS Standard
- `APPLIES_TO`: Control APPLIES_TO Product
- `BASED_ON`: Ruling BASED_ON Concept
- `VIOLATES`: SNCR Incident VIOLATES Ruling

**Use Cases**:
- Search for obligations related to a product
- Find all controls implementing AAOIFI GS-18
- Discover SSB rulings on Tawarruq
- Trace SNCR incident to violated Shariah principle

#### 4.3 Redis (Cache & Session)

**Use Cases**:
- Cache frequently accessed obligations
- Session storage for multi-step workflows
- Real-time compliance dashboard data
- Rate limiting for API endpoints

---

### Layer 5: Integration Layer

#### 5.1 MCP Graphiti Integration

**Current Implementation**: `backend/app/services/graphiti_mcp_service.py`

**Enhanced for GRC**:
- Store SSB decisions as episodes
- Store SNCR incidents as episodes
- Query for similar precedents
- Semantic search for obligations and rulings

#### 5.2 Hedera Blockchain Integration

**Purpose**: Tamper-evident evidence anchoring via Verifiable Credentials

**Flow**:
1. Critical evidence collected (SSB fatwa, SNCR purification proof)
2. Mint Verifiable Credential (W3C standard)
3. Anchor VC to Hedera Consensus Service
4. Store Hedera transaction ID with evidence
5. Verification: Retrieve VC, verify proof, check Hedera timestamp

**Implementation**:
```python
class HederaVCService:
    async def mint_vc(self, evidence: Evidence) -> VerifiableCredential:
        # Create VC with evidence as subject
        # Sign VC with issuer key
        # Submit to Hedera Consensus Service
        # Return VC with Hedera TX ID

    async def verify_vc(self, vc_id: str) -> VerificationResult:
        # Retrieve VC
        # Verify signature
        # Check Hedera consensus timestamp
        # Return verification result
```

#### 5.3 External Evidence Sources

**Integrations**:
- **SharePoint**: Retrieve policy documents, SSB minutes
- **S3**: Retrieve stored evidence artifacts
- **APIs**: Collect evidence from external systems (accounting, CRM, etc.)

**Evidence Collector Pattern**:
```python
class EvidenceCollector(ABC):
    @abstractmethod
    async def collect(self, source_id: str) -> Evidence:
        pass

class SharePointCollector(EvidenceCollector):
    async def collect(self, doc_id: str) -> Evidence:
        # Connect to SharePoint
        # Download document
        # Hash and store
        # Return evidence metadata

class S3Collector(EvidenceCollector):
    async def collect(self, s3_key: str) -> Evidence:
        # Connect to S3
        # Download file
        # Hash and store
        # Return evidence metadata

class APICollector(EvidenceCollector):
    async def collect(self, api_endpoint: str) -> Evidence:
        # Call external API
        # Save response as evidence
        # Hash and store
        # Return evidence metadata
```

---

## Deployment Architecture

### Development Environment
```
Docker Compose:
- Next.js dev server (port 3030)
- FastAPI dev server (port 8000)
- PostgreSQL (port 5432)
- Neo4j (port 7687)
- Redis (port 6379)
```

### Production Environment (Cloud)
```
Frontend:
- Vercel / Netlify (Next.js)
- CDN for static assets

Backend:
- Railway / Render / AWS ECS (FastAPI containers)
- Auto-scaling based on load
- Load balancer

Databases:
- PostgreSQL: Managed service (AWS RDS, Supabase, etc.)
- Neo4j: Neo4j Aura
- Redis: Managed service (AWS ElastiCache, Upstash)

Integrations:
- Hedera: Hedera Consensus Service (mainnet/testnet)
- Evidence Storage: S3 / Azure Blob Storage
```

---

## Security Architecture

### Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- SSB members, Compliance Officers, Auditors, Management roles
- OAuth 2.0 for external integrations

### Data Security
- Encryption at rest (database-level encryption)
- Encryption in transit (TLS/HTTPS)
- Evidence file encryption (AES-256)
- Secure key management (AWS Secrets Manager, Vault)

### Audit Trail
- All mutations logged (who, what, when)
- Immutable audit log (append-only)
- Evidence access logs
- SSB decision recording

---

## Performance & Scalability

### Performance Targets
- API response time: <200ms (p95)
- Report generation: <30s for standard reports
- Dashboard load time: <1s
- Evidence upload: Support up to 100MB files

### Scalability Strategy
- Horizontal scaling of API servers
- Database connection pooling
- Redis caching for hot data
- Async processing for long-running tasks (report generation, evidence collection)
- CDN for static assets

---

## Technology Stack Summary

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State**: Zustand
- **UI**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Real-time**: Server-Sent Events (SSE)

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic v2
- **Async**: asyncio + httpx
- **Task Queue**: Celery + Redis (for background jobs)

### Databases
- **Primary**: PostgreSQL 15+
- **Graph**: Neo4j 5+ (Graphiti)
- **Cache**: Redis 7+

### Integrations
- **Knowledge Graph**: Graphiti MCP
- **Blockchain**: Hedera Consensus Service
- **AI**: Claude API (for knowledge extraction)
- **Storage**: S3-compatible object storage

### DevOps
- **Containers**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), Railway/Render (backend)
- **Monitoring**: Sentry (errors), Prometheus + Grafana (metrics)

---

## Development Phases

### Phase 1: Foundation (Weeks 1-4)
- Data model implementation (PostgreSQL tables)
- Obligations Service
- SSB Governance Service (basic)
- Control Execution Service (basic)
- Evidence Service (upload only)
- SNCR Service (manual reporting)

### Phase 2: Core Compliance (Weeks 5-8)
- Complete Control Execution (automated scheduling)
- Complete Evidence Collection (external sources)
- Complete SNCR Pipeline (purification workflow)
- Regulatory Reporting Service (top 10 reports)
- RBAC implementation

### Phase 3: Enhanced Capabilities (Weeks 9-12)
- Advanced Control Execution (KRI/KCI, automated evidence)
- Advanced Evidence Management (retention enforcement, bilingual)
- Shariah Audit Workflow
- Complete Regulatory Reporting (all 55+ reports)
- Risk Management Service

### Phase 4: ISO 37301 & Advanced (Weeks 13-16)
- Fill ISO 37301 gaps
- Hedera/VC integration
- Analytics dashboards
- Multi-jurisdiction framework
- Performance optimization

---

## Conclusion

This architecture provides:
✅ **Standards-aligned infrastructure** (ISO 37301 + ISO 31000 + COSO + IFSB/AAOIFI)
✅ **Qatar-compliant from day 1** (60 obligations, 34 controls, dual-regulator support)
✅ **Scalable and extensible** (jurisdiction plugins for SAMA/BNM/CBB)
✅ **Modern tech stack** (Next.js, FastAPI, PostgreSQL, Neo4j, Hedera)
✅ **Comprehensive GRC coverage** (obligations, controls, evidence, SSB, SNCR, reporting, risk)

**Ready for**: Phase 1 implementation (Foundation)

**Next Step**: Create detailed implementation plan for Phase 1 (Qatar MVP)

---

**Document Version**: 1.0
**Date**: 2025-11-08
**Status**: Architecture Complete - Implementation Ready
