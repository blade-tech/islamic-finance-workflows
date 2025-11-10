# Qatar MVP Implementation Plan

**Project**: Islamic Finance GRC Infrastructure - Qatar MVP
**Duration**: 8 weeks (4 two-week sprints)
**Timeline**: Foundation (Weeks 1-4) + Qatar MVP (Weeks 5-8)
**Target**: Achieve basic Qatar compliance capability (QCB + QFCRA dual-regulator support)

---

## Executive Summary

This implementation plan operationalizes the GRC infrastructure architecture into an **8-week Qatar MVP** that delivers:

✅ **60 Qatar obligations** tracked and managed (32 QCB-only, 14 QFCRA-only, 14 common)
✅ **34 controls** executable with evidence collection (26 existing + 8 Qatar-specific)
✅ **SSB governance workflows** for decisions, fatwas, and approvals
✅ **SNCR incident pipeline** with purification workflow
✅ **Evidence management** with dual retention (QCB 10-year, QFCRA 6-year)
✅ **Regulatory selector** (QCB, QFCRA, or Both with conflict resolution)
✅ **Basic reporting** for critical monthly/quarterly reports
✅ **RBAC foundation** for SSB, Compliance Officer, and Regulator roles

**Success Criteria**: Demo entity can demonstrate basic Qatar compliance readiness to QFCRA/QCB inspector.

---

## Team Structure

### Core Team (5 FTEs)

**Backend Team (2 FTEs)**
- **Senior Backend Engineer** (Python/FastAPI expert)
  - Responsibilities: Obligations Service, Control Execution Service, SSB Governance Service
  - Skills: FastAPI, SQLAlchemy, async/await, PostgreSQL, Redis
  - Time Allocation: 100%

- **Backend Engineer** (Integration specialist)
  - Responsibilities: Evidence Collection Service, SNCR Service, MCP/Graphiti integration
  - Skills: Neo4j, Graphiti, Hedera SDK, API design
  - Time Allocation: 100%

**Frontend Team (1 FTE)**
- **Senior Frontend Engineer** (Next.js expert)
  - Responsibilities: Regulatory selector UI, obligations dashboard, SSB workflows, evidence upload
  - Skills: Next.js 14, TypeScript, Zustand, Radix UI, Tailwind CSS
  - Time Allocation: 100%

**Full-Stack/DevOps (1 FTE)**
- **Full-Stack Engineer** (DevOps focus)
  - Responsibilities: Database migrations, deployment pipeline, monitoring, API Gateway setup
  - Skills: Docker, PostgreSQL, Neo4j, CI/CD, monitoring (Prometheus/Grafana)
  - Time Allocation: 100%

**QA/Test (1 FTE)**
- **QA Engineer** (Compliance testing specialist)
  - Responsibilities: Test automation, compliance validation, integration testing, UAT coordination
  - Skills: Pytest, Playwright, regulatory compliance testing
  - Time Allocation: 100%

### Part-Time Support

**Product Owner** (0.25 FTE)
- Prioritization, stakeholder communication, acceptance criteria validation
- Time Allocation: ~10 hours/week (sprint planning, review, stakeholder sync)

**Islamic Finance SME** (0.1 FTE)
- Shariah compliance validation, SSB workflow review, AAOIFI guidance
- Time Allocation: ~4 hours/week (on-demand consultation)

**Total Team Cost Estimate**: 5.35 FTEs
- Base: $180-220K USD (8 weeks)
- Contingency (15%): $27-33K
- **Total**: $207-253K

---

## Sprint Structure

### Sprint 0: Pre-Development Setup (Week 0)

**Objective**: Team onboarding and environment setup

**Tasks**:
- [ ] Provision PostgreSQL 15+ database (AWS RDS or similar)
- [ ] Provision Neo4j Aura instance for Graphiti
- [ ] Set up Redis for caching
- [ ] Create GitHub repository with branching strategy
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure development environments for all engineers
- [ ] Install MCP server dependencies (uvx, Graphiti MCP)
- [ ] Document API standards and coding conventions
- [ ] Set up project management tools (Jira/Linear)
- [ ] Create initial database schema (core 11 tables)

**Deliverables**:
- [x] Development environment documentation
- [x] Database schema v1.0 deployed to dev
- [x] CI/CD pipeline functional
- [x] Team onboarded and ready

**Time**: 3-5 business days (included in Week 1)

---

### Sprint 1: Foundation Layer (Weeks 1-2)

**Theme**: Build data models, core services, and basic CRUD operations

#### User Stories

**US-1.1: As a Compliance Officer, I want to view all Qatar obligations so I can understand my compliance requirements**
- **Acceptance Criteria**:
  - [ ] Obligations table created with 60 Qatar obligations pre-seeded
  - [ ] GET /api/obligations endpoint returns obligations filtered by regulator
  - [ ] Obligations dashboard UI displays obligations with filtering (QCB/QFCRA/Both)
  - [ ] Each obligation shows title, description, category, frequency, applicability
- **Story Points**: 8
- **Technical Tasks**:
  - [ ] Create Obligation model (Pydantic + SQLAlchemy)
  - [ ] Implement Obligations Service with CRUD operations
  - [ ] Create database seed script from QATAR_UNIFIED_OBLIGATIONS_REGISTER.md
  - [ ] Build API endpoints: GET /obligations, GET /obligations/{id}
  - [ ] Create ObligationsList component with filtering
  - [ ] Implement regulatory selector component (QCB/QFCRA/Both)

**US-1.2: As a System Administrator, I want to manage controls so I can activate the correct controls for each regulator**
- **Acceptance Criteria**:
  - [ ] Controls table created with 34 controls pre-seeded (26 + 8 Qatar-specific)
  - [ ] GET /api/controls endpoint returns controls with activation rules
  - [ ] Control activation rules applied based on regulatory selector
  - [ ] Controls dashboard shows which controls are active for selected regulator
- **Story Points**: 8
- **Technical Tasks**:
  - [ ] Create Control model with Qatar activation rules
  - [ ] Implement Controls Service
  - [ ] Create database seed script from QATAR_CONTROL_ACTIVATION_RULES.md
  - [ ] Build API endpoints: GET /controls, GET /controls/{id}, POST /controls/activate
  - [ ] Create ControlsList component showing activation status
  - [ ] Implement control→obligation mapping visualization

**US-1.3: As a Compliance Officer, I want to track evidence so I can prove compliance with retention requirements**
- **Acceptance Criteria**:
  - [ ] Evidence table created with retention period configuration
  - [ ] Evidence upload API with automatic retention calculation (QCB: 10yr, QFCRA: 6yr)
  - [ ] Evidence stored with metadata (type, source, language, retention expiry)
  - [ ] Evidence dashboard shows uploaded evidence with expiry dates
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Create Evidence model with retention logic
  - [ ] Implement Evidence Collection Service
  - [ ] Build file upload handler (PDF, DOCX, images)
  - [ ] Create storage integration (S3 or local filesystem)
  - [ ] Build API endpoints: POST /evidence/upload, GET /evidence, GET /evidence/{id}
  - [ ] Create EvidenceUpload component with drag-drop
  - [ ] Implement evidence viewer component

**US-1.4: As a Developer, I want API authentication so only authorized users can access GRC data**
- **Acceptance Criteria**:
  - [ ] JWT authentication implemented on all API endpoints
  - [ ] User model with basic roles (Admin, Compliance Officer, SSB Member)
  - [ ] Login endpoint returns JWT token
  - [ ] Protected routes require valid JWT
- **Story Points**: 5
- **Technical Tasks**:
  - [ ] Implement JWT auth middleware (FastAPI Depends)
  - [ ] Create User model and authentication service
  - [ ] Build POST /auth/login, POST /auth/refresh endpoints
  - [ ] Add role-based permission checking
  - [ ] Update frontend to store and send JWT in headers
  - [ ] Create login page UI

#### Sprint 1 Metrics

**Velocity Target**: 34 story points
**Deliverables**:
- [x] Database schema v1.0 with 4 core tables (obligations, controls, evidence, users)
- [x] 60 Qatar obligations seeded
- [x] 34 controls seeded with activation rules
- [x] Evidence upload functional
- [x] Basic authentication working
- [x] Regulatory selector UI functional

**Definition of Done**:
- [ ] All code reviewed and merged to main
- [ ] Unit tests written (80% coverage minimum)
- [ ] API endpoints documented in OpenAPI spec
- [ ] Frontend components have TypeScript types
- [ ] Database migrations tested
- [ ] Sprint demo conducted with stakeholders

---

### Sprint 2: SSB Governance & SNCR Pipeline (Weeks 3-4)

**Theme**: Build Shariah governance workflows and non-compliance incident handling

#### User Stories

**US-2.1: As an SSB Member, I want to record SSB decisions so we can maintain a decision register**
- **Acceptance Criteria**:
  - [ ] SSBMember table created with position tracking and cooling-off validation
  - [ ] SSBDecision table created with voting records and dissents
  - [ ] SSB members can be added with automatic conflict-of-interest checks (max 3 positions for QCB)
  - [ ] Decisions can be recorded with voting results and fatwa text
  - [ ] Decision history is queryable by product, date, or topic
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Create SSBMember and SSBDecision models
  - [ ] Implement SSB Governance Service
  - [ ] Add position tracking logic (QCB: max 3, QFCRA: no limit)
  - [ ] Build API endpoints: POST /ssb/members, GET /ssb/members, POST /ssb/decisions, GET /ssb/decisions
  - [ ] Create SSBMemberForm component with validation
  - [ ] Create SSBDecisionForm component with voting interface
  - [ ] Build SSBDecisionHistory component

**US-2.2: As a Compliance Officer, I want SSB approval workflows so products get Shariah approval before launch**
- **Acceptance Criteria**:
  - [ ] Workflow engine supports SSB approval process
  - [ ] Product submissions trigger SSB review workflow
  - [ ] SSB members receive notifications for pending approvals
  - [ ] Decisions are recorded with voting breakdown
  - [ ] Products cannot be marked "Shariah-compliant" without SSB approval
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Implement basic workflow engine (state machine)
  - [ ] Create SSB approval workflow definition
  - [ ] Add workflow_state column to relevant entities
  - [ ] Build POST /workflows/ssb-approval endpoint
  - [ ] Implement notification service (email + in-app)
  - [ ] Create SSBApprovalQueue component
  - [ ] Build product submission form

**US-2.3: As a Compliance Officer, I want to log SNCR incidents so I can track Shariah violations**
- **Acceptance Criteria**:
  - [ ] SNCRIncident table created with violation details and financial impact
  - [ ] SNCR incidents can be logged with root cause analysis
  - [ ] Incidents automatically flagged for SSB reporting if material
  - [ ] Incident dashboard shows open incidents and purification status
- **Story Points**: 8
- **Technical Tasks**:
  - [ ] Create SNCRIncident model
  - [ ] Implement SNCR Incident Service
  - [ ] Add materiality threshold logic (e.g., >$10K or >1% of income)
  - [ ] Build API endpoints: POST /sncr/incidents, GET /sncr/incidents, PATCH /sncr/incidents/{id}
  - [ ] Create SNCRIncidentForm component
  - [ ] Build SNCRIncidentDashboard component with filtering

**US-2.4: As a Compliance Officer, I want to execute purification so I can donate non-compliant income to charity**
- **Acceptance Criteria**:
  - [ ] PurificationJournal table created with donation tracking
  - [ ] Purification workflow triggered from SNCR incident
  - [ ] Purification amount calculated from financial impact
  - [ ] Donation recorded with proof of donation upload
  - [ ] SNCR incident marked as "purified" after donation
- **Story Points**: 8
- **Technical Tasks**:
  - [ ] Create PurificationJournal model
  - [ ] Implement purification workflow in SNCR service
  - [ ] Build API endpoints: POST /sncr/purify, GET /purifications
  - [ ] Create PurificationForm component
  - [ ] Link purification to SNCR incidents in UI
  - [ ] Add proof-of-donation upload

#### Sprint 2 Metrics

**Velocity Target**: 42 story points
**Deliverables**:
- [x] SSB governance module functional
- [x] SSB member management with conflict tracking
- [x] SSB decision register operational
- [x] SNCR incident logging working
- [x] Purification workflow implemented
- [x] Basic workflow engine for approvals

**Definition of Done**:
- [ ] All acceptance criteria met
- [ ] Integration tests passing
- [ ] SSB workflow tested end-to-end
- [ ] SNCR→Purification pipeline validated
- [ ] Sprint demo with Islamic Finance SME validation

---

### Sprint 3: Control Execution & Evidence Linking (Weeks 5-6)

**Theme**: Make controls executable with automated evidence collection

#### User Stories

**US-3.1: As a Compliance Officer, I want to execute control tests so I can validate compliance**
- **Acceptance Criteria**:
  - [ ] ControlTest table created with test results and evidence links
  - [ ] Controls can be executed manually with results recorded
  - [ ] Test results include Pass/Fail/Partial status
  - [ ] Failed tests trigger remediation workflow
  - [ ] Control test history is queryable
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Create ControlTest model
  - [ ] Implement Control Execution Service
  - [ ] Add control test execution logic (manual for MVP)
  - [ ] Build API endpoints: POST /controls/{id}/execute, GET /controls/{id}/tests
  - [ ] Create ControlTestForm component
  - [ ] Build ControlTestHistory component
  - [ ] Implement remediation workflow trigger

**US-3.2: As a Compliance Officer, I want to link evidence to control tests so I can prove compliance**
- **Acceptance Criteria**:
  - [ ] Evidence can be tagged to specific obligations and control tests
  - [ ] Control tests require minimum evidence before Pass result
  - [ ] Evidence→ControlTest→Obligation chain is queryable
  - [ ] Evidence dashboard shows which obligations/controls are covered
- **Story Points**: 8
- **Technical Tasks**:
  - [ ] Add many-to-many relationship: Evidence ↔ ControlTest ↔ Obligation
  - [ ] Implement evidence validation rules per control
  - [ ] Update POST /controls/{id}/execute to require evidence
  - [ ] Build evidence linking UI in control test form
  - [ ] Create evidence coverage report API
  - [ ] Implement EvidenceCoverageReport component

**US-3.3: As a Compliance Officer, I want automated KRI calculation so I can monitor risk trends**
- **Acceptance Criteria**:
  - [ ] KRIs calculated automatically from control test results
  - [ ] KRI dashboard shows trends over time (monthly)
  - [ ] Thresholds trigger alerts (e.g., >3 failed tests = high risk)
  - [ ] KRIs exportable for regulatory reporting
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Add kri_values JSONB column to ControlTest table
  - [ ] Implement KRI calculation functions (e.g., SNCR frequency, SSB response time)
  - [ ] Create scheduled job for KRI aggregation (Redis + Celery or APScheduler)
  - [ ] Build GET /kris endpoint with time series data
  - [ ] Create KRIDashboard component with charts
  - [ ] Implement alert threshold logic

**US-3.4: As a Developer, I want MCP/Graphiti integration so I can search GRC knowledge**
- **Acceptance Criteria**:
  - [ ] Obligations, controls, SSB decisions indexed in Graphiti knowledge graph
  - [ ] Semantic search returns relevant GRC knowledge
  - [ ] Graph queries can traverse obligation→control→evidence chains
  - [ ] Search results include temporal context (when obligation became effective)
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Set up Graphiti MCP server configuration
  - [ ] Create episode ingestion pipeline for obligations/controls/decisions
  - [ ] Implement POST /graphiti/search endpoint (proxy to MCP)
  - [ ] Add automatic episode creation on obligation/control/decision CRUD
  - [ ] Build GraphitiSearch component
  - [ ] Test graph traversal queries

#### Sprint 3 Metrics

**Velocity Target**: 47 story points
**Deliverables**:
- [x] Control execution engine operational
- [x] Evidence→Control→Obligation linking working
- [x] KRI calculation automated
- [x] Graphiti knowledge graph populated with GRC data
- [x] Semantic search functional

**Definition of Done**:
- [ ] Control tests can be executed end-to-end
- [ ] Evidence validation working
- [ ] KRI dashboard showing real data
- [ ] Graphiti search returning accurate results
- [ ] Performance testing passed (control execution <2s)

---

### Sprint 4: Regulatory Reporting & Conflict Resolution (Weeks 7-8)

**Theme**: Enable regulatory reporting and finalize dual-regulator conflict handling

#### User Stories

**US-4.1: As a Compliance Officer, I want to generate regulatory reports so I can submit to QCB/QFCRA**
- **Acceptance Criteria**:
  - [ ] Report templates created for critical Qatar reports (SSB Report, SNCR Report, Compliance Report)
  - [ ] Reports auto-populate from obligations, control tests, and evidence
  - [ ] Reports exportable to PDF with bilingual support (Arabic + English for QCB)
  - [ ] Report submission tracked with submission date and recipient
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Create Report and ReportGeneration models
  - [ ] Implement Regulatory Reporting Service
  - [ ] Create report templates (SSB Report, SNCR Report, Compliance Report)
  - [ ] Build GET /reports/templates, POST /reports/generate endpoints
  - [ ] Implement PDF generation (ReportLab or WeasyPrint)
  - [ ] Add bilingual template support (Arabic for QCB)
  - [ ] Create ReportGenerator component
  - [ ] Build ReportHistory component

**US-4.2: As a Compliance Officer, I want automatic conflict resolution so dual-regulated entities comply with both regulators**
- **Acceptance Criteria**:
  - [ ] When Both regulators selected, system applies strictest requirement for conflicting obligations
  - [ ] Conflict resolution rules documented and transparent
  - [ ] UI shows which requirement was applied and why
  - [ ] Evidence requirements merge (10-year retention for QCB overrides 6-year for QFCRA)
- **Story Points**: 8
- **Technical Tasks**:
  - [ ] Implement conflict resolution engine from QATAR_REGULATORY_SELECTOR_DESIGN.md
  - [ ] Add conflict_resolution_applied flag to obligations
  - [ ] Update regulatory selector logic to apply conflict rules
  - [ ] Create conflict resolution audit log
  - [ ] Build ConflictResolutionIndicator component
  - [ ] Add tooltips explaining applied rules

**US-4.3: As a Compliance Officer, I want a compliance dashboard so I can see overall compliance status**
- **Acceptance Criteria**:
  - [ ] Dashboard shows compliance % by regulator (QCB/QFCRA)
  - [ ] Red/Amber/Green indicators for each obligation category
  - [ ] Overdue obligations highlighted
  - [ ] Recent SNCR incidents surfaced
  - [ ] Upcoming SSB meetings and pending approvals shown
- **Story Points**: 13
- **Technical Tasks**:
  - [ ] Implement compliance scoring algorithm
  - [ ] Create GET /compliance/dashboard endpoint with aggregated metrics
  - [ ] Calculate obligation compliance % (evidence present + recent control test pass)
  - [ ] Build ComplianceDashboard component with RAG indicators
  - [ ] Implement real-time updates via SSE
  - [ ] Add drill-down capability to obligation details

**US-4.4: As a QA Engineer, I want automated compliance tests so I can validate Qatar requirements**
- **Acceptance Criteria**:
  - [ ] Integration tests cover full workflows (SSB approval, SNCR→purification, control test→evidence)
  - [ ] Test suite validates all 60 Qatar obligations are seeded correctly
  - [ ] Regulatory selector tested for all combinations (QCB/QFCRA/Both)
  - [ ] Conflict resolution rules validated via automated tests
- **Story Points**: 8
- **Technical Tasks**:
  - [ ] Write integration tests for SSB workflows (pytest)
  - [ ] Write integration tests for SNCR pipeline
  - [ ] Write integration tests for regulatory selector + conflict resolution
  - [ ] Create test data fixtures for Qatar obligations
  - [ ] Implement E2E tests for critical user journeys (Playwright)
  - [ ] Set up test coverage reporting (>80% target)

#### Sprint 4 Metrics

**Velocity Target**: 42 story points
**Deliverables**:
- [x] Regulatory reporting functional for 3 critical reports
- [x] Bilingual PDF generation working
- [x] Dual-regulator conflict resolution automated
- [x] Compliance dashboard operational
- [x] Comprehensive test suite (>80% coverage)

**Definition of Done**:
- [ ] All MVP user stories complete
- [ ] All automated tests passing
- [ ] Compliance dashboard showing real metrics
- [ ] Reports generated successfully for QCB and QFCRA
- [ ] UAT conducted with Islamic Finance SME
- [ ] MVP demo ready for stakeholders

---

## Technical Implementation Details

### Database Migrations Strategy

**Tool**: Alembic (SQLAlchemy migration tool)

**Migration Schedule**:
- **Sprint 1**: Initial schema (obligations, controls, evidence, users)
- **Sprint 2**: Add SSB tables (ssb_members, ssb_decisions, sncr_incidents, purification_journal)
- **Sprint 3**: Add control_tests table and relationship tables
- **Sprint 4**: Add reports and report_generations tables

**Migration Pattern**:
```python
# Example migration
def upgrade():
    op.create_table(
        'obligations',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('requirement', sa.Text, nullable=False),
        sa.Column('applicability', postgresql.ARRAY(sa.String(10)), nullable=False),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('frequency', sa.String(20), nullable=False),
        sa.Column('evidence_required', postgresql.ARRAY(sa.String(100))),
        sa.Column('related_controls', postgresql.ARRAY(sa.String(50))),
        sa.Column('compliance_status', sa.String(20)),
        sa.Column('priority', sa.String(10)),
        sa.Column('created_at', sa.DateTime, default=func.now()),
        sa.Column('updated_at', sa.DateTime, onupdate=func.now())
    )
    op.create_index('ix_obligations_applicability', 'obligations', ['applicability'])
```

### API Design Standards

**REST Conventions**:
- `GET /api/{resource}` - List resources with filtering
- `GET /api/{resource}/{id}` - Get single resource
- `POST /api/{resource}` - Create resource
- `PATCH /api/{resource}/{id}` - Partial update
- `DELETE /api/{resource}/{id}` - Delete resource

**Response Format**:
```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "total": 60,
    "page": 1,
    "per_page": 20
  }
}
```

**Error Format**:
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid regulator selection",
    "details": { ... }
  }
}
```

### Frontend State Management

**Zustand Store Structure**:
```typescript
interface GRCStore {
  // Regulatory selector
  selectedRegulators: QatarRegulator[]
  setRegulators: (regulators: QatarRegulator[]) => void

  // Obligations
  obligations: Obligation[]
  filteredObligations: Obligation[]
  loadObligations: () => Promise<void>

  // Controls
  controls: Control[]
  activeControls: Control[]
  loadControls: () => Promise<void>

  // Evidence
  evidence: Evidence[]
  uploadEvidence: (file: File, metadata: EvidenceMetadata) => Promise<void>

  // Compliance metrics
  complianceScore: number
  loadComplianceMetrics: () => Promise<void>
}
```

### Testing Strategy

**Unit Tests** (Target: 80% coverage)
- All service methods tested with mocked dependencies
- Pydantic model validation tested
- Business logic functions tested (KRI calculation, conflict resolution)

**Integration Tests**
- API endpoints tested with TestClient (FastAPI)
- Database operations tested with test database
- Workflow state transitions tested

**E2E Tests** (Playwright)
- Critical user journeys:
  1. Login → Select QCB → View obligations → Execute control test → Upload evidence
  2. Login → Record SNCR incident → Execute purification → Verify incident closed
  3. Login → Submit product for SSB approval → SSB member votes → Decision recorded

**Performance Tests**
- Control execution <2s
- Evidence upload <5s for 10MB file
- Dashboard load <1s
- Report generation <10s

### Deployment Architecture (MVP)

**Environment**: Staging (for MVP demo)

**Infrastructure**:
- **Backend**: Single EC2 instance or Render.com
- **Database**: AWS RDS PostgreSQL (db.t3.small)
- **Neo4j**: Neo4j Aura (Free tier or Professional)
- **Redis**: ElastiCache or Upstash (for caching)
- **Frontend**: Vercel or Netlify
- **File Storage**: AWS S3 or local filesystem (MVP)

**Monitoring**:
- Application logs: CloudWatch or Render logs
- Database metrics: RDS dashboard
- API metrics: Simple request logging (structured JSON logs)

**CI/CD**:
- GitHub Actions workflow:
  1. Run linters (flake8, eslint)
  2. Run unit tests
  3. Run integration tests
  4. Build Docker image (backend)
  5. Build Next.js app (frontend)
  6. Deploy to staging on main branch merge

---

## Risk Management

### Technical Risks

**Risk 1: MCP/Graphiti Integration Complexity**
- **Impact**: High (core knowledge graph feature)
- **Probability**: Medium
- **Mitigation**:
  - Allocate dedicated integration engineer
  - Create fallback plan (direct Neo4j queries if MCP fails)
  - Test MCP server stability early (Sprint 0)
- **Contingency**: If MCP unstable, use direct Neo4j Python driver with same Cypher queries

**Risk 2: Bilingual PDF Generation**
- **Impact**: Medium (QCB reporting requirement)
- **Probability**: Medium
- **Mitigation**:
  - Research Arabic PDF libraries early (Week 1)
  - Test with sample Arabic text
  - Consider outsourcing to specialized service (DocRaptor)
- **Contingency**: Manual bilingual report creation for MVP demo if automation fails

**Risk 3: Workflow Engine Complexity**
- **Impact**: Medium (SSB approvals critical)
- **Probability**: Low-Medium
- **Mitigation**:
  - Use simple state machine for MVP (not full workflow engine like Temporal)
  - Limit to 1-2 workflows (SSB approval, SNCR pipeline)
  - Document state transitions clearly
- **Contingency**: Manual workflow tracking via status fields if engine over-engineered

**Risk 4: Performance at Scale**
- **Impact**: Low (MVP only)
- **Probability**: Low
- **Mitigation**:
  - Add database indexes early
  - Use Redis caching for frequently accessed data
  - Test with realistic data volumes (60 obligations, 100 control tests)
- **Contingency**: Acceptable for MVP to have slower performance; optimize post-MVP

### Non-Technical Risks

**Risk 5: Scope Creep**
- **Impact**: High (threatens 8-week timeline)
- **Probability**: High
- **Mitigation**:
  - Strict adherence to user stories
  - Product Owner veto power on new features
  - Backlog for post-MVP enhancements
- **Contingency**: Cut nice-to-have features (e.g., advanced KRI charts, automated reporting scheduler)

**Risk 6: SME Availability**
- **Impact**: Medium (validation delays)
- **Probability**: Medium
- **Mitigation**:
  - Schedule SME availability upfront
  - Batch validation sessions (end of Sprint 2 and Sprint 4)
  - Document SME feedback for async review
- **Contingency**: Proceed with best interpretation; validate post-MVP

**Risk 7: Resource Constraints**
- **Impact**: High (team availability)
- **Probability**: Low-Medium
- **Mitigation**:
  - Confirm team availability before Sprint 0
  - Build 15% buffer into estimates
  - Cross-train team members for critical knowledge
- **Contingency**: Reduce scope to core workflows (obligations + SSB + SNCR only)

---

## Success Metrics

### Functional Metrics

**MVP Completion Criteria**:
- [x] 60 Qatar obligations seeded and manageable via UI
- [x] 34 controls activated based on regulatory selector
- [x] SSB governance workflow functional (member management + decision recording)
- [x] SNCR incident logging and purification workflow operational
- [x] Evidence upload and retention management working
- [x] Regulatory selector (QCB/QFCRA/Both) with conflict resolution
- [x] 3 critical reports generatable (SSB Report, SNCR Report, Compliance Report)
- [x] Compliance dashboard showing real metrics
- [x] >80% test coverage

### Quality Metrics

**Code Quality**:
- [ ] Linter passing (flake8, eslint)
- [ ] No critical security vulnerabilities (Snyk scan)
- [ ] API documentation complete (OpenAPI spec)
- [ ] TypeScript strict mode enabled

**Performance**:
- [ ] Dashboard load time <1s
- [ ] Control execution <2s
- [ ] Evidence upload (10MB file) <5s
- [ ] Report generation <10s

**Usability**:
- [ ] UAT session with 2+ users (Compliance Officer, SSB Member)
- [ ] No critical usability issues found
- [ ] All critical workflows completable without errors

### Business Metrics

**Demo Readiness**:
- [ ] Demo entity configured with sample data (10 obligations, 5 controls, 3 evidence items)
- [ ] SSB approval workflow demonstrable end-to-end
- [ ] SNCR→purification pipeline demonstrable
- [ ] Compliance dashboard showing realistic metrics (e.g., 75% compliance)
- [ ] Report generation working for QCB and QFCRA

**Stakeholder Satisfaction**:
- [ ] Islamic Finance SME validates Shariah accuracy
- [ ] Product Owner approves all user stories
- [ ] Sprint demos show incremental progress
- [ ] Final MVP demo receives stakeholder approval

---

## Post-MVP Roadmap

### Immediate Enhancements (Weeks 9-12)

**Reporting Automation**:
- Scheduled report generation (e.g., monthly SNCR report auto-generated)
- Report submission tracking with regulator response logging
- Email notifications for report deadlines

**Advanced Control Execution**:
- Automated control tests (scheduled execution)
- Control test templates (reusable test procedures)
- Remediation tracking (link failed tests to corrective actions)

**Evidence Enhancements**:
- Blockchain anchoring (Hedera Verifiable Credentials)
- OCR for scanned documents
- Evidence search by content

**User Management**:
- Advanced RBAC (granular permissions per obligation/control)
- Audit trail for all actions
- Multi-tenancy support (multiple entities per system)

### Future Phases

**Phase 3: Full Qatar Compliance (Weeks 13-16)**
- All 55+ Qatar reports implemented
- Advanced KRIs and risk scoring
- Complete AAOIFI alignment tracking
- Comprehensive audit trail

**Phase 4: ISO 37301 Certification Ready (Weeks 17-20)**
- Close 6 identified ISO 37301 gaps
- External audit preparation
- Compliance effectiveness testing
- ISO 37301 self-assessment tool

**Phase 5: Multi-Jurisdiction (Weeks 21+)**
- SAMA (Saudi Arabia) jurisdiction plugin
- BNM (Malaysia) jurisdiction plugin
- Jurisdiction comparison tool
- Global GRC dashboard

---

## Appendices

### Appendix A: Data Seeding Scripts

**Obligations Seed (obligations_seed.py)**:
```python
# Seed 60 Qatar obligations from QATAR_UNIFIED_OBLIGATIONS_REGISTER.md
obligations = [
    {
        "id": "UNIFIED-OBL-001",
        "title": "SSB Appointment & Composition",
        "requirement": "Appoint SSB with minimum 3 members...",
        "applicability": ["QCB", "QFCRA"],
        "category": "SSB_GOVERNANCE",
        "frequency": "ONGOING",
        "evidence_required": ["SSB_APPOINTMENT_RESOLUTION", "SSB_CVS"],
        "related_controls": ["CTRL-001", "CTRL-002"],
        "compliance_status": "PENDING",
        "priority": "HIGH"
    },
    # ... 59 more obligations
]

async def seed_obligations(session: AsyncSession):
    for obl in obligations:
        obligation = Obligation(**obl)
        session.add(obligation)
    await session.commit()
```

**Controls Seed (controls_seed.py)**:
```python
# Seed 34 controls (26 existing + 8 Qatar-specific)
controls = [
    {
        "id": "CTRL-001",
        "name": "SSB Independence Validation",
        "description": "Validate SSB members meet independence criteria",
        "bucket": "SHARIAH_GOVERNANCE",
        "qcb_required": True,
        "qfcra_required": True,
        "test_procedure": "Review SSB member declarations...",
        "evidence_types": ["SSB_INDEPENDENCE_DECLARATION"],
        "kri_tracked": ["ssb_conflict_count"]
    },
    # ... 33 more controls
]

async def seed_controls(session: AsyncSession):
    for ctrl in controls:
        control = Control(**ctrl)
        session.add(control)
    await session.commit()
```

### Appendix B: API Endpoint Summary

**Obligations Service**:
- `GET /api/obligations` - List obligations with filtering
- `GET /api/obligations/{id}` - Get single obligation
- `POST /api/obligations` - Create obligation (admin only)
- `PATCH /api/obligations/{id}` - Update obligation
- `GET /api/obligations/coverage` - Evidence coverage report

**Controls Service**:
- `GET /api/controls` - List controls
- `GET /api/controls/{id}` - Get single control
- `POST /api/controls/activate` - Activate controls for regulator
- `POST /api/controls/{id}/execute` - Execute control test
- `GET /api/controls/{id}/tests` - List control test history

**SSB Governance Service**:
- `POST /api/ssb/members` - Add SSB member
- `GET /api/ssb/members` - List SSB members
- `POST /api/ssb/decisions` - Record SSB decision
- `GET /api/ssb/decisions` - List SSB decisions
- `GET /api/workflows/ssb-approval` - Get pending SSB approvals

**SNCR Service**:
- `POST /api/sncr/incidents` - Log SNCR incident
- `GET /api/sncr/incidents` - List SNCR incidents
- `PATCH /api/sncr/incidents/{id}` - Update incident
- `POST /api/sncr/purify` - Execute purification
- `GET /api/purifications` - List purification journal

**Evidence Service**:
- `POST /api/evidence/upload` - Upload evidence
- `GET /api/evidence` - List evidence
- `GET /api/evidence/{id}` - Get single evidence
- `GET /api/evidence/{id}/download` - Download evidence file

**Reporting Service**:
- `GET /api/reports/templates` - List report templates
- `POST /api/reports/generate` - Generate report
- `GET /api/reports` - List generated reports
- `GET /api/reports/{id}/download` - Download report PDF

**Compliance Service**:
- `GET /api/compliance/dashboard` - Get compliance metrics
- `GET /api/compliance/score` - Get compliance score by regulator
- `GET /api/kris` - Get KRI time series data

### Appendix C: Frontend Component Tree

```
App
├── AuthProvider (JWT context)
├── RegulatorySelector (QCB/QFCRA/Both)
├── Layout
│   ├── Navigation
│   └── UserMenu
└── Pages
    ├── Dashboard
    │   ├── ComplianceScoreCard
    │   ├── ObligationSummary
    │   ├── RecentSNCRIncidents
    │   └── UpcomingSSBMeetings
    ├── Obligations
    │   ├── ObligationsList (filterable by regulator)
    │   ├── ObligationDetail
    │   └── EvidenceCoverageIndicator
    ├── Controls
    │   ├── ControlsList
    │   ├── ControlDetail
    │   ├── ControlTestForm
    │   └── ControlTestHistory
    ├── SSB
    │   ├── SSBMembersList
    │   ├── SSBMemberForm
    │   ├── SSBDecisionsList
    │   ├── SSBDecisionForm
    │   └── SSBApprovalQueue
    ├── SNCR
    │   ├── SNCRIncidentDashboard
    │   ├── SNCRIncidentForm
    │   └── PurificationForm
    ├── Evidence
    │   ├── EvidenceUpload
    │   ├── EvidenceList
    │   └── EvidenceViewer
    └── Reports
        ├── ReportGenerator
        ├── ReportHistory
        └── ReportViewer (PDF display)
```

---

## Sprint Calendar

### Week 0 (Pre-Sprint)
- **Mon-Wed**: Environment setup, database provisioning
- **Thu-Fri**: Team onboarding, initial schema deployment

### Week 1-2 (Sprint 1: Foundation)
- **Mon Week 1**: Sprint planning, task breakdown
- **Mon-Fri Week 1**: US-1.1 (Obligations), US-1.2 (Controls)
- **Mon-Thu Week 2**: US-1.3 (Evidence), US-1.4 (Auth)
- **Fri Week 2**: Sprint review, demo, retrospective

### Week 3-4 (Sprint 2: SSB & SNCR)
- **Mon Week 3**: Sprint planning
- **Mon-Fri Week 3**: US-2.1 (SSB Members/Decisions), US-2.2 (SSB Workflows)
- **Mon-Thu Week 4**: US-2.3 (SNCR Incidents), US-2.4 (Purification)
- **Fri Week 4**: Sprint review, demo with Islamic Finance SME, retrospective

### Week 5-6 (Sprint 3: Control Execution)
- **Mon Week 5**: Sprint planning
- **Mon-Fri Week 5**: US-3.1 (Control Tests), US-3.2 (Evidence Linking)
- **Mon-Thu Week 6**: US-3.3 (KRI Calculation), US-3.4 (Graphiti Integration)
- **Fri Week 6**: Sprint review, demo, retrospective

### Week 7-8 (Sprint 4: Reporting & Finalization)
- **Mon Week 7**: Sprint planning
- **Mon-Fri Week 7**: US-4.1 (Regulatory Reports), US-4.2 (Conflict Resolution)
- **Mon-Wed Week 8**: US-4.3 (Compliance Dashboard), US-4.4 (Automated Tests)
- **Thu Week 8**: UAT session, final bug fixes
- **Fri Week 8**: MVP demo to stakeholders, retrospective, project closure

---

## Contact & Escalation

**Product Owner**: [Name] - Final decisions on scope, priorities
**Tech Lead (Backend)**: [Name] - Technical architecture, backend escalations
**Tech Lead (Frontend)**: [Name] - Frontend architecture, UI/UX escalations
**Islamic Finance SME**: [Name] - Shariah compliance validation
**QA Lead**: [Name] - Quality gates, testing strategy

**Escalation Path**:
1. Team member → Tech Lead (within 1 day)
2. Tech Lead → Product Owner (within 2 days)
3. Product Owner → Executive Sponsor (critical issues only)

**Communication**:
- **Daily Standups**: 9:00 AM (15 minutes)
- **Sprint Planning**: Monday morning (2 hours)
- **Sprint Review/Demo**: Friday afternoon (1 hour)
- **Sprint Retrospective**: Friday afternoon (45 minutes)
- **Slack**: #qatar-grc-mvp channel for async communication

---

## Conclusion

This 8-week Qatar MVP implementation plan delivers a **production-ready foundation** for Qatar GRC compliance while establishing **reusable infrastructure** for global expansion.

**Key Success Factors**:
✅ Clear scope (60 obligations, 34 controls, 3 workflows)
✅ Phased approach (4 focused sprints)
✅ Realistic velocity (34-47 story points per sprint)
✅ Comprehensive testing (>80% coverage)
✅ SME validation (Islamic Finance expert embedded)
✅ Risk mitigation (clear contingencies for all major risks)

**Post-MVP**:
- Week 9-12: Immediate enhancements (reporting automation, advanced controls)
- Week 13-16: Full Qatar compliance (55+ reports, advanced KRIs)
- Week 17-20: ISO 37301 certification readiness
- Week 21+: Multi-jurisdiction expansion (SAMA, BNM, CBB)

**This plan is ready for team onboarding and Sprint 0 kickoff.**

---

**Document Version**: 1.0
**Date**: 2025-11-08
**Status**: Ready for Review & Approval
**Next Action**: Review with Product Owner and Tech Leads, confirm team availability, schedule Sprint 0

