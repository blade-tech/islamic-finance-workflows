# Frontend-Only GRC Implementation Plan
**Status**: 🟢 RECOMMENDED APPROACH
**Date**: 2025-11-08
**Impact**: Zero backend changes, pure frontend addition

---

## 🎯 Core Strategy

**Simulate Qatar GRC infrastructure entirely in the frontend using Zustand + mock data.**

This matches exactly how the current demo works - no backend, no database, just state management and UI.

---

## ✅ Why This Approach is Better

1. **Faster Implementation**: 4-6 hours vs. 12-16 hours
2. **Zero Backend Risk**: No database, no migrations, no API changes
3. **Immediate Demonstration**: Users can interact with GRC features right away
4. **Matches Current Demo Pattern**: Already using Zustand + mock data successfully
5. **Easy Backend Migration Later**: When you need persistence, we add it

---

## 📁 What We'll Create

### 1. Zustand GRC Store (Mock Data)
**File**: `src/lib/grc-store.ts` (~400 lines)

```typescript
import { create } from 'zustand'

// Mock Qatar obligations data (from research)
const mockObligations: Obligation[] = [
  {
    id: 'UNIFIED-OBL-001',
    title: 'SSB Appointment & Composition',
    requirement: 'Appoint minimum 3 qualified Shariah scholars...',
    applicability: ['QCB', 'QFCRA'],
    category: 'SSB_GOVERNANCE',
    frequency: 'ONGOING',
    compliance_status: 'COMPLIANT',
    priority: 'HIGH',
    // ... full mock data from research
  },
  // ... 59 more obligations from QATAR_UNIFIED_OBLIGATIONS_REGISTER.md
]

// Mock controls data (26 existing + 8 Qatar-specific)
const mockControls: Control[] = [
  {
    id: 'CTRL-001',
    name: 'Shariah Board Independence Verification',
    description: 'Verify SSB members meet independence criteria',
    bucket: 'governance',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review SSB member disclosures quarterly',
    last_test_date: '2025-10-15',
    last_test_result: 'PASS',
    // ... full mock data
  },
  // ... 33 more controls
]

// Mock SSB members
const mockSSBMembers: SSBMember[] = [
  {
    id: 'ssb-001',
    name: 'Dr. Ahmad Al-Rashid',
    qualifications: 'PhD Islamic Finance, AAOIFI CSAA',
    appointment_date: '2023-01-01',
    current_positions_count: 2,
    status: 'ACTIVE',
  },
  // ... more members
]

// Mock SNCR incidents
const mockSNCRIncidents: SNCRIncident[] = [
  {
    id: 'sncr-001',
    incident_date: '2025-10-01',
    detected_by: 'Internal Audit',
    description: 'Late Sukuk profit distribution',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    purification_amount: 1500.00,
    purification_status: 'DISTRIBUTED',
  },
  // ... more incidents
]

// Zustand store
interface GRCStore {
  // Selected regulators
  selectedRegulators: QatarRegulator[]
  setSelectedRegulators: (regulators: QatarRegulator[]) => void

  // Obligations
  obligations: Obligation[]
  getFilteredObligations: () => Obligation[]
  updateObligationStatus: (id: string, status: ComplianceStatus) => void

  // Controls
  controls: Control[]
  getActiveControls: () => Control[]
  executeControlTest: (id: string) => void

  // SSB
  ssbMembers: SSBMember[]
  addSSBDecision: (decision: SSBDecision) => void

  // SNCR
  sncrIncidents: SNCRIncident[]
  reportSNCRIncident: (incident: Omit<SNCRIncident, 'id'>) => void

  // Compliance metrics (calculated)
  getComplianceMetrics: () => ComplianceMetrics
}

export const useGRCStore = create<GRCStore>((set, get) => ({
  selectedRegulators: ['QCB'], // Default to QCB
  setSelectedRegulators: (regulators) => set({ selectedRegulators: regulators }),

  obligations: mockObligations,
  getFilteredObligations: () => {
    const { selectedRegulators, obligations } = get()
    return obligations.filter(obl =>
      selectedRegulators.some(reg => obl.applicability.includes(reg))
    )
  },

  updateObligationStatus: (id, status) => set(state => ({
    obligations: state.obligations.map(obl =>
      obl.id === id ? { ...obl, compliance_status: status } : obl
    )
  })),

  controls: mockControls,
  getActiveControls: () => {
    const { selectedRegulators, controls } = get()
    return controls.filter(ctrl => {
      if (selectedRegulators.includes('QCB') && ctrl.qcb_required) return true
      if (selectedRegulators.includes('QFCRA') && ctrl.qfcra_required) return true
      return false
    })
  },

  executeControlTest: (id) => set(state => ({
    controls: state.controls.map(ctrl =>
      ctrl.id === id ? {
        ...ctrl,
        last_test_date: new Date().toISOString(),
        last_test_result: 'PASS' // Mock success
      } : ctrl
    )
  })),

  ssbMembers: mockSSBMembers,
  addSSBDecision: (decision) => {
    // Mock implementation - store in memory
    console.log('SSB Decision recorded:', decision)
  },

  sncrIncidents: mockSNCRIncidents,
  reportSNCRIncident: (incident) => set(state => ({
    sncrIncidents: [...state.sncrIncidents, {
      ...incident,
      id: `sncr-${Date.now()}`,
    }]
  })),

  getComplianceMetrics: () => {
    const { obligations, controls } = get()
    const compliantObligations = obligations.filter(o => o.compliance_status === 'COMPLIANT').length
    const passedControls = controls.filter(c => c.last_test_result === 'PASS').length

    return {
      overall_compliance: (compliantObligations / obligations.length) * 100,
      obligations_completion: (compliantObligations / obligations.length) * 100,
      controls_completion: (passedControls / controls.length) * 100,
      total_obligations: obligations.length,
      compliant_obligations: compliantObligations,
      total_controls: controls.length,
      passed_controls: passedControls,
    }
  },
}))
```

### 2. TypeScript Types
**File**: `src/lib/grc-types.ts` (~200 lines)

```typescript
export type QatarRegulator = 'QCB' | 'QFCRA'

export type ComplianceStatus = 'COMPLIANT' | 'NEEDS_ATTENTION' | 'IN_PROGRESS' | 'NOT_APPLICABLE'

export type ObligationCategory =
  | 'SSB_GOVERNANCE'
  | 'SNCR_MANAGEMENT'
  | 'PRODUCT_APPROVAL'
  | 'RISK_MANAGEMENT'
  | 'CAPITAL_ADEQUACY'
  | 'LIQUIDITY_MANAGEMENT'
  | 'REPORTING'
  | 'AUDIT'
  | 'DISCLOSURE'
  | 'CUSTOMER_PROTECTION'
  | 'AML_CFT'
  | 'IT_SECURITY'
  | 'OUTSOURCING'
  | 'BRANCH_OPERATIONS'
  | 'INTERNAL_CONTROLS'

export type Frequency = 'ONGOING' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'AD_HOC'

export interface Obligation {
  id: string
  title: string
  requirement: string
  applicability: QatarRegulator[]
  category: ObligationCategory
  frequency: Frequency
  evidence_required: string[]
  related_controls: string[]
  compliance_status: ComplianceStatus
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  source: {
    regulator: QatarRegulator
    document: string
    section: string
  }
  effective_date: string
}

export interface Control {
  id: string
  name: string
  description: string
  bucket: 'governance' | 'operational' | 'technical' | 'shariah'
  qcb_required: boolean
  qfcra_required: boolean
  test_procedure: string
  evidence_types: string[]
  kri_tracked: string[]
  last_test_date?: string
  last_test_result?: 'PASS' | 'FAIL' | 'NOT_TESTED'
}

export interface SSBMember {
  id: string
  name: string
  qualifications: string
  appointment_date: string
  term_expiry?: string
  current_positions_count: number
  status: 'ACTIVE' | 'INACTIVE' | 'COOLING_OFF'
}

export interface SSBDecision {
  id: string
  decision_date: string
  decision_type: 'PRODUCT_APPROVAL' | 'FATWA' | 'POLICY_REVIEW' | 'INCIDENT_RULING'
  description: string
  ruling: string
  unanimous: boolean
  dissenting_opinions?: string
  related_products: string[]
}

export interface SNCRIncident {
  id: string
  incident_date: string
  detected_by: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'REPORTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED'
  purification_amount?: number
  purification_status?: 'PENDING' | 'DISTRIBUTED' | 'N/A'
  ssb_decision_id?: string
}

export interface ComplianceMetrics {
  overall_compliance: number
  obligations_completion: number
  controls_completion: number
  total_obligations: number
  compliant_obligations: number
  total_controls: number
  passed_controls: number
}
```

### 3. Obligations Page
**File**: `src/app/obligations/page.tsx` (~300 lines)

```typescript
'use client'

import { useState } from 'react'
import { useGRCStore } from '@/lib/grc-store'
import { QatarRegulator, ObligationCategory, ComplianceStatus } from '@/lib/grc-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, CheckCircle2, AlertCircle, Clock, Filter } from 'lucide-react'

export default function ObligationsPage() {
  const {
    selectedRegulators,
    setSelectedRegulators,
    getFilteredObligations,
    updateObligationStatus,
  } = useGRCStore()

  const [categoryFilter, setCategoryFilter] = useState<ObligationCategory | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'ALL'>('ALL')

  const obligations = getFilteredObligations()
  const filteredObligations = obligations.filter(obl => {
    if (categoryFilter !== 'ALL' && obl.category !== categoryFilter) return false
    if (statusFilter !== 'ALL' && obl.compliance_status !== statusFilter) return false
    return true
  })

  const handleRegulatorChange = (regulators: QatarRegulator[]) => {
    setSelectedRegulators(regulators)
  }

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'NEEDS_ATTENTION': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-yellow-500" />
      default: return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Qatar Obligations Register</h1>
          <p className="text-muted-foreground mt-2">
            Manage regulatory obligations for QCB and QFCRA compliance
          </p>
        </div>
      </div>

      {/* Regulator Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Scope</CardTitle>
          <CardDescription>Select applicable regulators</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedRegulators.includes('QCB')}
              onChange={(e) => {
                if (e.target.checked) {
                  handleRegulatorChange([...selectedRegulators, 'QCB'])
                } else {
                  handleRegulatorChange(selectedRegulators.filter(r => r !== 'QCB'))
                }
              }}
            />
            <Badge variant="outline">QCB (Qatar Central Bank)</Badge>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedRegulators.includes('QFCRA')}
              onChange={(e) => {
                if (e.target.checked) {
                  handleRegulatorChange([...selectedRegulators, 'QFCRA'])
                } else {
                  handleRegulatorChange(selectedRegulators.filter(r => r !== 'QFCRA'))
                }
              }}
            />
            <Badge variant="outline">QFCRA (Qatar Financial Centre)</Badge>
          </label>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="SSB_GOVERNANCE">SSB Governance</SelectItem>
            <SelectItem value="SNCR_MANAGEMENT">SNCR Management</SelectItem>
            <SelectItem value="PRODUCT_APPROVAL">Product Approval</SelectItem>
            {/* ... more categories */}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="COMPLIANT">Compliant</SelectItem>
            <SelectItem value="NEEDS_ATTENTION">Needs Attention</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Obligations List */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredObligations.length} of {obligations.length} obligations
        </p>

        {filteredObligations.map(obligation => (
          <Card key={obligation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(obligation.compliance_status)}
                    <CardTitle className="text-lg">{obligation.title}</CardTitle>
                    <Badge variant={obligation.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                      {obligation.priority}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {obligation.applicability.map(reg => (
                      <Badge key={reg} variant="outline">{reg}</Badge>
                    ))}
                    <Badge>{obligation.category.replace(/_/g, ' ')}</Badge>
                    <Badge variant="secondary">{obligation.frequency}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {obligation.requirement}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={obligation.compliance_status === 'COMPLIANT' ? 'default' : 'outline'}
                  onClick={() => updateObligationStatus(obligation.id, 'COMPLIANT')}
                >
                  Mark Compliant
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateObligationStatus(obligation.id, 'IN_PROGRESS')}
                >
                  In Progress
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateObligationStatus(obligation.id, 'NEEDS_ATTENTION')}
                >
                  Needs Attention
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 4. Controls Page
**File**: `src/app/controls/page.tsx` (~250 lines)
- Control library display
- Execute control test button (mock execution)
- Test history
- Control activation based on regulator selection

### 5. SSB Governance Page
**File**: `src/app/ssb/page.tsx` (~250 lines)
- SSB members list
- Add member form (mock)
- Record SSB decision (mock)
- Decision history

### 6. SNCR Tracking Page
**File**: `src/app/sncr/page.tsx` (~200 lines)
- SNCR incidents list
- Report incident form (mock)
- Purification journal
- Severity tracking

### 7. Navigation Update
**File**: `src/components/layout/Navigation.tsx`
- Add "GRC" menu item with submenu

---

## 📊 File Changes Summary

| File | Change Type | Lines | Impact |
|------|-------------|-------|--------|
| `src/lib/grc-store.ts` | CREATE | ~400 | New Zustand store with mock data |
| `src/lib/grc-types.ts` | CREATE | ~200 | TypeScript types for GRC |
| `src/app/obligations/page.tsx` | CREATE | ~300 | Obligations management UI |
| `src/app/controls/page.tsx` | CREATE | ~250 | Controls execution UI |
| `src/app/ssb/page.tsx` | CREATE | ~250 | SSB governance UI |
| `src/app/sncr/page.tsx` | CREATE | ~200 | SNCR tracking UI |
| `src/components/layout/Navigation.tsx` | MODIFY | +15 | Add GRC menu item |
| **TOTAL** | | **~1,615 lines** | **7 files** |

---

## ✅ Benefits of Frontend-Only Approach

1. **No Backend Changes**: Zero risk to existing API
2. **No Database Setup**: No PostgreSQL, migrations, or connection config
3. **Fast Implementation**: 4-6 hours vs. 12-16 hours
4. **Immediate Demo**: Users can interact with GRC features right away
5. **Matches Current Pattern**: Already using Zustand successfully for workflow state
6. **Easy Backend Addition Later**: When you need persistence:
   - Create PostgreSQL tables
   - Create API endpoints
   - Connect Zustand actions to API calls
   - Mock data becomes seed data

---

## 🎯 Implementation Timeline

**Total Time: 4-6 hours**

- `grc-store.ts` + `grc-types.ts`: 1 hour (mock data from research docs)
- `obligations/page.tsx`: 1 hour
- `controls/page.tsx`: 1 hour
- `ssb/page.tsx`: 1 hour
- `sncr/page.tsx`: 1 hour
- Navigation update: 15 minutes
- Testing: 30 minutes

---

## 🔄 Backend Migration Path (Later)

When you need persistence, the migration is straightforward:

```typescript
// BEFORE (Frontend-only)
export const useGRCStore = create<GRCStore>((set, get) => ({
  obligations: mockObligations,  // Static mock data
  updateObligationStatus: (id, status) => set(state => ({
    obligations: state.obligations.map(obl =>
      obl.id === id ? { ...obl, compliance_status: status } : obl
    )
  })),
}))

// AFTER (With backend)
export const useGRCStore = create<GRCStore>((set, get) => ({
  obligations: [],  // Loaded from API

  loadObligations: async () => {
    const response = await fetch('/api/obligations')
    const data = await response.json()
    set({ obligations: data })
  },

  updateObligationStatus: async (id, status) => {
    await fetch(`/api/obligations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ compliance_status: status })
    })
    // Update local state
    set(state => ({
      obligations: state.obligations.map(obl =>
        obl.id === id ? { ...obl, compliance_status: status } : obl
      )
    }))
  },
}))
```

---

## ✅ Approval for Frontend-Only Approach?

This approach:
- ✅ Zero backend changes
- ✅ Zero database setup
- ✅ Matches current demo pattern (Zustand + mock data)
- ✅ 4-6 hours vs. 12-16 hours
- ✅ Immediate demonstration capability
- ✅ Easy backend migration when needed

**Proceed with frontend-only GRC implementation?**
