# Qatar Regulatory Selector Mechanism Design

## User Experience

### Selection Interface

**Question**: "Which Qatar regulator(s) govern your Islamic finance operations?"

**Options**:
1. ○ QCB (Qatar Central Bank) - Mainland Qatar operations
2. ○ QFCRA (Qatar Financial Centre Regulatory Authority) - QFC operations
3. ○ Both (Group with entities in both jurisdictions)

**Helper Text**:
- Choose QCB if you operate in mainland Qatar under QCB banking license
- Choose QFCRA if you operate exclusively in Qatar Financial Centre under QFCRA authorization
- Choose Both if your group has entities in both jurisdictions or you're planning dual operations

**Additional Context Questions** (if needed):
- Entity type: Islamic Bank / Islamic Window / Takaful / Investment Firm
- License status: Existing / In Application / Planning
- Group structure: Standalone / Subsidiary / Branch

### Selection Impact

**When User Selects "QCB"**:
- Load 46 QCB obligations + 14 common obligations (60 total active)
- Activate 25 mandatory controls + 8 QCB-specific new controls
- Set evidence retention: 10 years
- Set language requirements: Arabic primary + English translation
- Set reporting calendar: QCB schedule (35+ reports, including 15 monthly)
- Set AAOIFI: Full FAS mandatory adoption
- Enable QCB-specific features:
  - Monthly financial reporting by 8th
  - Pre-approval of financial statements
  - Quarterly SNCR reporting
  - SSB member position limit (max 3)
  - Specific product documentation templates

**When User Selects "QFCRA"**:
- Load 28 QFCRA obligations + 14 common obligations (42 total active)
- Activate 23 mandatory controls
- Set evidence retention: 6 years
- Set language requirements: English
- Set reporting calendar: QFCRA schedule (20 reports, quarterly/annual focus)
- Set AAOIFI: Selective reference approach
- Enable QFCRA-specific features:
  - Quarterly prudential reporting
  - Post-filing of financial statements
  - Event-driven SNCR reporting
  - Principles-based compliance
  - Innovation-friendly framework

**When User Selects "Both"**:
- Load ALL 60 unique obligations (union of QCB + QFCRA)
- Activate all 26 base controls + 8 additional QCB controls (34 total)
- Set evidence retention: 10 years (QCB's stricter requirement)
- Set language requirements: Bilingual (Arabic + English)
- Set reporting calendar: Combined (QCB + QFCRA schedules)
- Set AAOIFI: Full FAS mandatory (QCB's requirement)
- Apply precedence rule: When conflict exists, STRICTEST requirement wins
- Enable dual-regulator features:
  - Parallel reporting streams
  - Consolidated compliance dashboard
  - Conflict resolution tracking
  - Unified SSB governance
  - Cross-jurisdiction reconciliation

## System Architecture

### Data Model Changes

#### Core Entities

```typescript
// Jurisdiction Plugin Interface
interface QatarJurisdictionPlugin {
  country: 'QA'
  regulators: QatarRegulator[]  // Can be ['QCB'], ['QFCRA'], or ['QCB', 'QFCRA']
  obligations: Obligation[]
  controls: ControlActivationRule[]
  evidenceRequirements: EvidenceRequirement[]
  reportingCalendar: Report[]
  aaoifiAdoption: AaoifiAdoption
  conflictResolutions: ConflictResolution[]
}

// Regulator Type
type QatarRegulator = 'QCB' | 'QFCRA'

// Obligation with Multi-Regulator Support
interface Obligation {
  id: string                          // UNIFIED-OBL-XXX
  title: string
  category: string
  applicability: QatarRegulator[]     // ['QCB'], ['QFCRA'], or ['QCB', 'QFCRA']
  requirement: string                  // Unified description
  qcbDetails?: ObligationDetails
  qfcraDetails?: ObligationDetails
  conflictResolution?: string         // How to handle when both apply
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  relatedControls: string[]
  relatedStandards: string[]
}

// Regulator-Specific Details
interface ObligationDetails {
  source: string                       // Regulation citation
  specificRequirement: string          // Regulator-specific text
  frequency: string
  timeline: string
  evidence: string[]
  penalty?: string
  notes?: string
}

// Control Activation Rule
interface ControlActivationRule {
  controlId: string                    // SG-01, RM-02, etc.
  requiredBy: QatarRegulator[]
  parameters: {
    qcb?: ControlParameters
    qfcra?: ControlParameters
    unified?: ControlParameters        // When both regulators apply
  }
  testProcedures: {
    qcb?: TestProcedure[]
    qfcra?: TestProcedure[]
  }
}

// Control Parameters
interface ControlParameters {
  frequency: string
  threshold?: number
  methodology?: string
  language: 'Arabic' | 'English' | 'Bilingual'
  additionalRequirements?: string[]
}

// Evidence Requirements
interface EvidenceRequirement {
  type: string
  retentionPeriod: number              // Years
  language: 'Arabic' | 'English' | 'Bilingual'
  format?: string
  regulators: QatarRegulator[]
}

// Reporting
interface Report {
  id: string
  name: string
  regulator: QatarRegulator
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Event-driven'
  deadline: string                     // e.g., "8th of month", "30 days after quarter"
  language: 'Arabic' | 'English' | 'Bilingual'
  template?: string
  portal?: string
}

// AAOIFI Adoption Level
interface AaoifiAdoption {
  level: 'Full' | 'Selective' | 'Reference'
  mandatoryStandards: string[]
  optionalStandards: string[]
  fallbackFramework: 'IFRS' | 'Local GAAP'
}

// Conflict Resolution
interface ConflictResolution {
  area: string                         // e.g., "Evidence Retention"
  qcbRequirement: string
  qfcraRequirement: string
  resolution: string                    // How to resolve
  precedence: 'QCB' | 'QFCRA' | 'Stricter' | 'Both'
}
```

### Service Layer Architecture

```typescript
// Regulatory Configuration Service
class RegulatoryConfigurationService {
  private selectedRegulators: QatarRegulator[] = []
  private activeObligations: Obligation[] = []
  private activeControls: ControlActivationRule[] = []
  private reportingCalendar: Report[] = []
  private conflictResolutions: ConflictResolution[] = []

  // Main configuration method
  async configureForRegulators(regulators: QatarRegulator[]): Promise<void> {
    this.selectedRegulators = regulators

    // Load obligations
    this.activeObligations = await this.loadObligations(regulators)

    // Activate controls
    this.activeControls = await this.activateControls(regulators)

    // Build reporting calendar
    this.reportingCalendar = await this.buildReportingCalendar(regulators)

    // Apply conflict resolutions
    if (regulators.length > 1) {
      this.conflictResolutions = await this.loadConflictResolutions()
      await this.applyConflictResolutions()
    }

    // Configure subsystems
    await this.configureEvidenceManagement(regulators)
    await this.configureReportingEngine(regulators)
    await this.configureComplianceMonitoring(regulators)
  }
}
```

### Obligation Loading Logic

```typescript
function loadQatarObligations(selectedRegulators: QatarRegulator[]): Obligation[] {
  const allObligations = getUnifiedQatarObligations() // All 60 obligations

  return allObligations.filter(obl => {
    // Include if obligation applies to ANY selected regulator
    return obl.applicability.some(reg => selectedRegulators.includes(reg))
  }).map(obl => {
    // Enhance with regulator-specific details
    if (selectedRegulators.length === 1) {
      // Single regulator: use specific details
      const regulator = selectedRegulators[0]
      return {
        ...obl,
        details: regulator === 'QCB' ? obl.qcbDetails : obl.qfcraDetails
      }
    } else {
      // Multiple regulators: merge requirements
      return {
        ...obl,
        details: mergeObligationDetails(obl.qcbDetails, obl.qfcraDetails),
        conflictNote: obl.conflictResolution
      }
    }
  })
}

function mergeObligationDetails(
  qcb?: ObligationDetails,
  qfcra?: ObligationDetails
): ObligationDetails {
  if (!qcb) return qfcra!
  if (!qfcra) return qcb!

  // Apply strictest requirements
  return {
    source: `QCB: ${qcb.source} | QFCRA: ${qfcra.source}`,
    specificRequirement: `QCB: ${qcb.specificRequirement}\nQFCRA: ${qfcra.specificRequirement}`,
    frequency: getStricterFrequency(qcb.frequency, qfcra.frequency),
    timeline: getStricterTimeline(qcb.timeline, qfcra.timeline),
    evidence: [...new Set([...qcb.evidence, ...qfcra.evidence])],
    penalty: `QCB: ${qcb.penalty || 'N/A'} | QFCRA: ${qfcra.penalty || 'N/A'}`,
    notes: `Dual regulation - strictest requirement applies`
  }
}
```

### Control Activation Logic

```typescript
function activateQatarControls(selectedRegulators: QatarRegulator[]): Control[] {
  const controlActivationRules = getQatarControlActivationRules()

  const activeControls = controlActivationRules
    .filter(rule => {
      // Activate if ANY selected regulator requires this control
      return rule.requiredBy.some(reg => selectedRegulators.includes(reg))
    })
    .map(rule => {
      // Configure control with regulator-specific parameters
      return configureControl(rule, selectedRegulators)
    })

  // Add new controls for QCB if needed
  if (selectedRegulators.includes('QCB')) {
    activeControls.push(...getQCBSpecificNewControls())
  }

  return activeControls
}

function configureControl(
  rule: ControlActivationRule,
  regulators: QatarRegulator[]
): Control {
  if (regulators.length === 1) {
    // Single regulator configuration
    const regulator = regulators[0]
    const params = regulator === 'QCB' ? rule.parameters.qcb : rule.parameters.qfcra
    const tests = regulator === 'QCB' ? rule.testProcedures.qcb : rule.testProcedures.qfcra

    return {
      id: rule.controlId,
      parameters: params!,
      testProcedures: tests!,
      active: true
    }
  } else {
    // Dual regulator configuration - use unified or strictest
    return {
      id: rule.controlId,
      parameters: rule.parameters.unified || mergeControlParameters(
        rule.parameters.qcb!,
        rule.parameters.qfcra!
      ),
      testProcedures: [
        ...(rule.testProcedures.qcb || []),
        ...(rule.testProcedures.qfcra || [])
      ],
      active: true,
      dualMode: true
    }
  }
}
```

### Evidence Retention Logic

```typescript
function getRetentionPeriod(selectedRegulators: QatarRegulator[]): number {
  const retentionPeriods = {
    'QCB': 10,    // years
    'QFCRA': 6    // years
  }

  if (selectedRegulators.length === 1) {
    return retentionPeriods[selectedRegulators[0]]
  }

  // Both regulators: use stricter (longer) requirement
  return Math.max(...selectedRegulators.map(reg => retentionPeriods[reg]))
}

function getLanguageRequirement(selectedRegulators: QatarRegulator[]): string {
  if (selectedRegulators.includes('QCB') && selectedRegulators.includes('QFCRA')) {
    return 'Bilingual' // Arabic + English
  }
  if (selectedRegulators.includes('QCB')) {
    return 'Bilingual' // QCB requires Arabic + English
  }
  return 'English' // QFCRA only
}
```

### Reporting Calendar Logic

```typescript
function buildReportingCalendar(selectedRegulators: QatarRegulator[]): Report[] {
  let reports: Report[] = []

  if (selectedRegulators.includes('QCB')) {
    reports = reports.concat(getQCBReports())  // 35+ reports including 15 monthly
  }

  if (selectedRegulators.includes('QFCRA')) {
    reports = reports.concat(getQFCRAReports())  // 20 reports
  }

  // Deduplicate if same report exists for both
  return deduplicateReports(reports)
}

function deduplicateReports(reports: Report[]): Report[] {
  const uniqueReports = new Map<string, Report>()

  reports.forEach(report => {
    const key = `${report.name}-${report.frequency}`

    if (!uniqueReports.has(key)) {
      uniqueReports.set(key, report)
    } else {
      // Merge requirements if duplicate
      const existing = uniqueReports.get(key)!
      uniqueReports.set(key, {
        ...existing,
        regulator: 'Both' as any,
        deadline: getEarlierDeadline(existing.deadline, report.deadline),
        language: 'Bilingual'
      })
    }
  })

  return Array.from(uniqueReports.values())
}
```

### AAOIFI Configuration Logic

```typescript
function configureAaoifiAdoption(selectedRegulators: QatarRegulator[]): AaoifiAdoption {
  if (selectedRegulators.includes('QCB')) {
    // QCB requires full adoption
    return {
      level: 'Full',
      mandatoryStandards: getAllAaoifiStandards(),
      optionalStandards: [],
      fallbackFramework: 'IFRS' // Only where AAOIFI silent
    }
  }

  if (selectedRegulators.includes('QFCRA')) {
    // QFCRA selective approach
    return {
      level: 'Selective',
      mandatoryStandards: ['GS-1', 'GS-2', 'GS-3', 'FAS-12', 'FAS-13'],
      optionalStandards: getRemainingAaoifiStandards(),
      fallbackFramework: 'IFRS'
    }
  }

  // Should not reach here
  throw new Error('No regulator selected')
}
```

## Conflict Resolution Rules

**Principle**: When both regulators apply, the STRICTEST requirement wins.

### Specific Conflict Resolutions

#### 1. Evidence Retention
- **QCB**: 10 years
- **QFCRA**: 6 years
- **Resolution**: Apply 10 years (QCB's stricter requirement)
- **Implementation**: Set all retention policies to 10 years

#### 2. Language Requirements
- **QCB**: Arabic primary + English translation
- **QFCRA**: English only
- **Resolution**: Bilingual documentation (Arabic + English)
- **Implementation**: Prepare all documents in both languages

#### 3. SSB Reporting Timeline
- **QCB**: Annual report with financial statements
- **QFCRA**: Within 3 months of year-end
- **Resolution**: Meet both requirements (publish with financials AND submit to QFCRA within 3 months)
- **Implementation**: Dual submission process

#### 4. SSB Member Limits
- **QCB**: Maximum 3 SSB positions per scholar
- **QFCRA**: No specific limit stated
- **Resolution**: Apply 3-position limit (QCB's requirement)
- **Implementation**: Track all SSB positions

#### 5. AAOIFI Compliance
- **QCB**: Full FAS mandatory
- **QFCRA**: Selective reference
- **Resolution**: Full FAS mandatory (QCB's requirement)
- **Implementation**: Complete AAOIFI adoption

#### 6. Financial Reporting Frequency
- **QCB**: Monthly balance sheet by 8th
- **QFCRA**: Quarterly reports
- **Resolution**: Submit monthly to QCB, leverage for QFCRA quarterly
- **Implementation**: Monthly closing process

#### 7. Capital Adequacy Ratio
- **QCB**: 12.5% minimum (with buffer)
- **QFCRA**: 10.5% (8% + buffer)
- **Resolution**: Maintain 12.5% (QCB's higher requirement)
- **Implementation**: Set internal limit at 13% for safety margin

#### 8. Shariah Audit
- **QCB**: Annual mandatory
- **QFCRA**: Best practice (not mandatory)
- **Resolution**: Conduct annual Shariah audit
- **Implementation**: Annual audit program

#### 9. Product Documentation
- **QCB**: AAOIFI templates mandatory
- **QFCRA**: Appropriate documentation
- **Resolution**: Use AAOIFI templates
- **Implementation**: Standardize on AAOIFI

#### 10. SNCR Reporting
- **QCB**: Quarterly summary + event reporting
- **QFCRA**: Event-driven only
- **Resolution**: Both quarterly and event reporting
- **Implementation**: Comprehensive SNCR reporting

## Implementation Phases

### Phase 1: Basic Selector (MVP) - Month 1
**Features**:
- Radio button selection interface
- Single regulator selection only
- Basic obligation loading
- Manual configuration of other parameters

**Technical Tasks**:
1. Create selector UI component
2. Implement obligation filtering
3. Basic control activation
4. Simple reporting calendar

**Deliverables**:
- Functional selector interface
- QCB or QFCRA configuration
- Basic compliance dashboard

### Phase 2: Multi-Regulator Support - Month 2
**Features**:
- "Both" option enabled
- Conflict resolution engine
- Merged obligation view
- Unified control parameters

**Technical Tasks**:
1. Implement conflict resolution logic
2. Create merged obligation views
3. Develop unified control configuration
4. Build dual-reporting capability

**Deliverables**:
- Full multi-regulator support
- Conflict resolution dashboard
- Unified compliance view

### Phase 3: Smart Recommendations - Month 3
**Features**:
- Entity type detection
- Regulatory recommendation engine
- Gap analysis
- Compliance scoring

**Technical Tasks**:
1. Build recommendation algorithm
2. Create gap analysis engine
3. Implement compliance scoring
4. Develop suggestion system

**Deliverables**:
- Smart regulator selection
- Automated gap identification
- Compliance score dashboard

### Phase 4: Group Management - Month 4
**Features**:
- Multiple entity management
- Subsidiary configuration
- Consolidated reporting
- Group-level dashboard

**Technical Tasks**:
1. Multi-entity data model
2. Subsidiary relationship mapping
3. Consolidation engine
4. Group reporting framework

**Deliverables**:
- Group entity management
- Consolidated compliance view
- Cross-entity reporting

### Phase 5: Advanced Features - Month 5-6
**Features**:
- Regulatory change management
- Predictive compliance
- Automated remediation
- AI-powered insights

**Technical Tasks**:
1. Change tracking system
2. Predictive analytics
3. Remediation workflow
4. AI integration

**Deliverables**:
- Regulatory update alerts
- Predictive compliance warnings
- Automated action plans

## Testing Scenarios

### Scenario 1: New QFC-based Islamic Bank (QFCRA only)
**Setup**:
- Entity: NewBank QFC Ltd
- Regulator: QFCRA
- Status: New license application

**Expected Configuration**:
- 28 QFCRA obligations active
- 23 controls activated
- 6-year retention period
- English language
- 20 reports (quarterly/annual focus)
- Selective AAOIFI reference
- Principles-based compliance

**Test Cases**:
1. Verify obligation count = 28 + 14 common = 42
2. Check language = English only
3. Confirm retention = 6 years
4. Validate quarterly reporting focus
5. Test AAOIFI flexibility

### Scenario 2: Mainland Qatar Islamic Bank (QCB only)
**Setup**:
- Entity: Al-Bank Islamic
- Regulator: QCB
- Status: Operational bank

**Expected Configuration**:
- 46 QCB obligations active
- 25 controls + 8 new controls
- 10-year retention period
- Bilingual requirements
- 35+ reports (15 monthly)
- Full AAOIFI FAS mandatory
- Prescriptive compliance

**Test Cases**:
1. Verify obligation count = 46 + 14 common = 60
2. Check language = Arabic + English
3. Confirm retention = 10 years
4. Validate monthly reporting (by 8th)
5. Test full AAOIFI adoption

### Scenario 3: Large Group with QFC Subsidiary and Mainland Operations (Both)
**Setup**:
- Entity: Qatar Finance Group
- Regulators: QCB + QFCRA
- Status: Multi-entity group

**Expected Configuration**:
- All 60 unique obligations
- 34 total controls (26 base + 8 additional)
- 10-year retention (strictest)
- Bilingual documentation
- Combined reporting calendar
- Full AAOIFI FAS (QCB requirement)
- Dual compliance tracking

**Test Cases**:
1. Verify all 60 obligations loaded
2. Check conflict resolutions applied
3. Confirm 10-year retention
4. Test bilingual document generation
5. Validate dual reporting streams
6. Check consolidated dashboard

### Scenario 4: Entity Switching from QFCRA to QCB
**Setup**:
- Entity: Migrating Bank
- From: QFCRA
- To: QCB
- Status: Regulatory transition

**Expected Migration Path**:
1. Gap analysis: 18 additional obligations
2. Language translation: English → Bilingual
3. Retention extension: 6 → 10 years
4. Reporting frequency: Quarterly → Monthly
5. AAOIFI adoption: Selective → Full

**Test Cases**:
1. Pre-migration assessment
2. Translation workflow
3. Historical data retention
4. Reporting system update
5. Control reconfiguration

### Scenario 5: Islamic Window in QFC (QFCRA Window)
**Setup**:
- Entity: Conventional Bank - Islamic Window
- Regulator: QFCRA
- Status: Window authorization

**Expected Configuration**:
- QFCRA obligations + window-specific
- Control FR-06 mandatory
- Segregation requirements
- FAS 18 disclosures
- Separate governance

**Test Cases**:
1. Window authorization check
2. Segregation controls active
3. Separate SSB governance
4. FAS 18 compliance
5. Commingling prevention

## User Interface Mockup

```
┌─────────────────────────────────────────────────────────────┐
│                Qatar Regulatory Configuration                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Which Qatar regulator(s) govern your Islamic finance       │
│  operations?                                                │
│                                                              │
│  ○ QCB (Qatar Central Bank)                                │
│     Mainland Qatar operations                               │
│                                                              │
│  ○ QFCRA (Qatar Financial Centre Regulatory Authority)     │
│     Qatar Financial Centre operations                       │
│                                                              │
│  ○ Both                                                     │
│     Group with entities in both jurisdictions              │
│                                                              │
│  ─────────────────────────────────────────────              │
│                                                              │
│  Entity Type: [Islamic Bank ▼]                             │
│                                                              │
│  License Status: [Existing ▼]                              │
│                                                              │
│  [Advanced Options ▼]                                       │
│                                                              │
│            [Previous]  [Next: Configure →]                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

After Selection - Configuration Summary:
┌─────────────────────────────────────────────────────────────┐
│              Configuration Summary - QCB Selected            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Obligations Loaded: 60 (46 QCB + 14 Common)            │
│  ✓ Controls Activated: 34 (26 Base + 8 Additional)        │
│  ✓ Evidence Retention: 10 Years                           │
│  ✓ Language: Arabic (Primary) + English (Translation)     │
│  ✓ AAOIFI Standards: Full Mandatory Adoption              │
│                                                              │
│  Reporting Calendar:                                        │
│  • Monthly Reports: 15 (Due by 8th)                        │
│  • Quarterly Reports: 12                                    │
│  • Annual Reports: 8                                        │
│                                                              │
│  Key Requirements:                                          │
│  • SSB: Minimum 3 members, max 3 positions per scholar     │
│  • Shariah Audit: Annual mandatory                         │
│  • Capital Adequacy: 12.5% minimum                         │
│  • Documentation: AAOIFI templates required                │
│                                                              │
│  [← Back]  [Confirm Configuration]  [Customize →]          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema Changes

```sql
-- Regulatory Configuration Table
CREATE TABLE regulatory_configuration (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES entities(id),
  selected_regulators TEXT[], -- Array of regulator codes
  configuration_date TIMESTAMP,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Obligation Activation Table
CREATE TABLE obligation_activations (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES regulatory_configuration(id),
  obligation_id VARCHAR(50), -- UNIFIED-OBL-XXX
  regulator VARCHAR(10), -- QCB, QFCRA, or BOTH
  active BOOLEAN DEFAULT true,
  parameters JSONB, -- Regulator-specific parameters
  created_at TIMESTAMP DEFAULT NOW()
);

-- Control Activation Table
CREATE TABLE control_activations (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES regulatory_configuration(id),
  control_id VARCHAR(10), -- SG-01, RM-02, etc.
  active BOOLEAN DEFAULT true,
  parameters JSONB, -- Configuration parameters
  test_procedures JSONB, -- Test procedure details
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reporting Calendar Table
CREATE TABLE reporting_calendar (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES regulatory_configuration(id),
  report_name VARCHAR(200),
  regulator VARCHAR(10),
  frequency VARCHAR(20),
  next_due DATE,
  language VARCHAR(20),
  template_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conflict Resolution Log
CREATE TABLE conflict_resolutions (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES regulatory_configuration(id),
  conflict_area VARCHAR(100),
  qcb_requirement TEXT,
  qfcra_requirement TEXT,
  resolution_applied TEXT,
  precedence VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Configuration Audit Trail
CREATE TABLE configuration_audit (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES regulatory_configuration(id),
  change_type VARCHAR(50),
  previous_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

```typescript
// Regulatory Configuration API
class RegulatoryConfigurationAPI {

  // Get available regulators
  GET /api/config/regulators
  Response: {
    regulators: [
      { code: 'QCB', name: 'Qatar Central Bank', jurisdiction: 'Mainland' },
      { code: 'QFCRA', name: 'Qatar Financial Centre Regulatory Authority', jurisdiction: 'QFC' }
    ]
  }

  // Configure for selected regulators
  POST /api/config/configure
  Request: {
    entityId: string,
    regulators: QatarRegulator[],
    entityType?: string,
    licenseStatus?: string
  }
  Response: {
    configId: string,
    obligations: Obligation[],
    controls: Control[],
    reportingCalendar: Report[],
    settings: {
      retention: number,
      language: string,
      aaoifiLevel: string
    }
  }

  // Get current configuration
  GET /api/config/{entityId}
  Response: {
    currentConfig: RegulatoryConfiguration,
    summary: ConfigurationSummary
  }

  // Update configuration
  PUT /api/config/{configId}
  Request: {
    regulators?: QatarRegulator[],
    customSettings?: CustomSettings
  }

  // Get conflict resolutions
  GET /api/config/{configId}/conflicts
  Response: {
    conflicts: ConflictResolution[],
    resolutionStrategy: string
  }

  // Simulate configuration change
  POST /api/config/simulate
  Request: {
    fromRegulators: QatarRegulator[],
    toRegulators: QatarRegulator[]
  }
  Response: {
    gaps: Gap[],
    newRequirements: Requirement[],
    migrations: MigrationStep[]
  }
}
```

## Performance Considerations

### Optimization Strategies

1. **Caching**:
   - Cache regulator configurations
   - Pre-compute common scenarios
   - Store merged obligations

2. **Lazy Loading**:
   - Load obligations on demand
   - Defer control activation until needed
   - Progressive report calendar building

3. **Indexing**:
   - Index by regulator applicability
   - Index by obligation category
   - Index reporting by frequency

4. **Batch Operations**:
   - Bulk obligation loading
   - Batch control activation
   - Grouped report generation

### Performance Metrics

- Configuration load time: < 2 seconds
- Regulator switch time: < 1 second
- Conflict resolution: < 500ms
- Report calendar generation: < 1 second

## Security Considerations

1. **Access Control**:
   - Role-based configuration access
   - Audit all configuration changes
   - Require approval for regulator changes

2. **Data Validation**:
   - Validate regulator selections
   - Verify obligation applicability
   - Check control compatibility

3. **Compliance Tracking**:
   - Log all regulatory selections
   - Track configuration changes
   - Maintain change justification

## Future Enhancements

### Version 2.0 Features
- AI-powered regulator recommendation
- Automated gap remediation plans
- Real-time regulatory updates
- Cross-border expansion (Bahrain, Kuwait)

### Version 3.0 Features
- Predictive compliance scoring
- Regulatory change impact analysis
- Automated documentation generation
- Integration with regulatory portals

### Long-term Vision
- Pan-GCC regulatory framework
- Global Islamic finance coverage
- Regulatory intelligence platform
- Automated compliance certification

---

## Conclusion

The Qatar Regulatory Selector Mechanism provides a sophisticated yet user-friendly way to configure compliance systems for Qatar's dual regulatory environment. By automatically handling the complexity of multiple regulators, conflict resolution, and varying requirements, the system enables institutions to maintain compliance efficiently regardless of their regulatory jurisdiction.

Key benefits:
- **Simplicity**: Single selection determines entire configuration
- **Accuracy**: Automatic conflict resolution ensures compliance
- **Flexibility**: Supports single, dual, or transitioning entities
- **Scalability**: Designed for expansion to other jurisdictions
- **Intelligence**: Smart recommendations and gap analysis

---

*Document Version: 1.0*
*Last Updated: November 2024*
*Next Review: Upon implementation or regulatory changes*