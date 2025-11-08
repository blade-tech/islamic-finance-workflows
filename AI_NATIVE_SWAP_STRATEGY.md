# AI Native GRC Dashboard Swap Strategy

## Current State Analysis

### System 1: Main Dashboard (`/dashboard`)
**Purpose:** Manager-focused compliance monitoring
**Key Features:**
- 4-component compliance tracking (Shariah, Jurisdiction, Accounting, Impact)
- Overall platform compliance score across all deals
- Component progress cards with detailed metrics
- Monitoring cards (contracts, reviews, validations, documents)
- Backend-connected via `backendClient.getDashboardOverview()`
- Product tours and onboarding

**Data Source:** Backend API (real/mock depending on environment)

### System 2: AI Native GRC (`/ai-native`)
**Purpose:** AI-enhanced portfolio management with agent insights
**Key Features:**
- AI greeting with actionable insights
- Portfolio overview (Active, At Risk, Compliant, Pending)
- AI-prioritized deals with blocker detection
- AI compliance forecast with timeline predictions
- Agent automation statistics (58% controls automated, 4.2hrs avg)
- Links to: tasks, deals, evidence, workflows, trust-portal

**Data Source:** Mock data (`mockDeals`, `mockTasks`, `mockDataStats`)

### System 3: Home Page (`/`)
**Purpose:** Deal creation workflow
**Key Features:**
- 8-step WorkflowContainer
- Guided deal creation process

---

## Overlap Analysis

### 🔴 COMPLETE OVERLAP (Replace)
1. **Compliance Scoring**
   - Main Dashboard: Overall platform compliance (76.2%)
   - AI Native: Portfolio compliance with forecast
   - **Decision:** Keep AI Native's forecast feature, add real data integration

2. **Deal Status Cards**
   - Main Dashboard: Total/Compliant/Need Attention
   - AI Native: Active/At Risk/Compliant/Pending
   - **Decision:** AI Native version is more actionable with risk prioritization

3. **Summary Statistics**
   - Main Dashboard: 3 stat cards (deals, compliant, needs attention)
   - AI Native: 4 stat cards (active, at risk, compliant, pending tasks)
   - **Decision:** AI Native adds task tracking, more comprehensive

### 🟡 PARTIAL OVERLAP (Merge)
1. **Monitoring/Tracking**
   - Main Dashboard: Monitoring cards (contracts, reviews, validations, docs)
   - AI Native: Deal cards with AI insights and blockers
   - **Decision:** Combine - add AI insights to monitoring cards

2. **Navigation/Actions**
   - Main Dashboard: Quick Actions (Manage Deals, Digital Assets, Create Deal)
   - AI Native: Contextual actions (View Deal, Fix Now, Approve All)
   - **Decision:** Keep both - Quick Actions for navigation, contextual for deal-level

### 🟢 UNIQUE TO MAIN DASHBOARD (Preserve)
1. **4-Component Architecture**
   - Shariah, Jurisdiction, Accounting, Impact progress cards
   - **Decision:** MUST preserve - core differentiator

2. **Component-Specific Metrics**
   - Detailed compliance breakdown per component
   - **Decision:** MUST preserve - valuable for managers

3. **Backend Integration**
   - `backendClient.getDashboardOverview()`
   - **Decision:** MUST preserve - real data connection

4. **Product Tours**
   - Onboarding and help system
   - **Decision:** MUST preserve - user guidance

### 🟢 UNIQUE TO AI NATIVE (Preserve)
1. **AI Greeting & Insights**
   - Contextual AI messages ("3 deals need attention")
   - **Decision:** MUST add - key AI-native feature

2. **Blocker Detection & Prioritization**
   - Critical/high/medium blocker severity
   - AI-generated fix proposals
   - **Decision:** MUST add - core agent functionality

3. **Compliance Forecast**
   - Predictive timeline (Nov 7 → Nov 20 projection)
   - Bottleneck analysis (Shariah reviews avg 3 days)
   - Agent impact metrics (58% automated, 4.2hrs avg)
   - **Decision:** MUST add - unique AI value

4. **AI-Prioritized Deal List**
   - Deals sorted by AI priority (blockers first)
   - Inline AI insights per deal
   - **Decision:** MUST add - improves decision-making

5. **Task Management Integration**
   - Links to `/ai-native/tasks`
   - Tasks with AI fixes count
   - **Decision:** MUST add - completes the workflow

---

## Swap Strategy

### Option A: Replace `/dashboard` with Enhanced AI Native ⭐ RECOMMENDED
**Approach:** Make `/dashboard` redirect to enhanced `/ai-native`

**Steps:**
1. **Migrate 4-Component Cards to `/ai-native`**
   - Add ComponentProgressCard imports
   - Insert after Portfolio Overview section
   - Connect to `backendClient.getDashboardOverview()`

2. **Migrate Monitoring Cards to `/ai-native`**
   - Add MonitoringCard imports
   - Insert after Compliance Forecast
   - Enhance with AI insights where applicable

3. **Migrate Backend Integration**
   - Replace mock data with `backendClient` calls
   - Keep mock data as fallback for demos

4. **Migrate Product Tours**
   - Copy tour system from `/dashboard`
   - Update tour targets for new layout

5. **Update Navigation**
   - Change all `/dashboard` links to `/ai-native`
   - Update layout/navigation components

**Result:** Single unified AI-native dashboard with all features

---

### Option B: Keep Both, Add Toggle
**Approach:** Add "AI Mode" toggle to switch views

**Steps:**
1. Add state management for view mode (Classic vs AI)
2. Conditional rendering based on mode
3. Share backend data between both views
4. Add toggle in header

**Result:** Flexibility for different user preferences

**Pros:** Allows A/B testing, user choice
**Cons:** Maintenance overhead, confusion

---

### Option C: Make `/ai-native` the New Home
**Approach:** Swap home page and dashboard roles

**Steps:**
1. Move WorkflowContainer to `/workflow/new`
2. Make `/` render AI Native content
3. Keep `/dashboard` for component-level detail view
4. Update all navigation

**Result:** AI-first experience from landing

---

## Recommended Approach: **Option A**

### Why Option A?
1. **Single Source of Truth:** One dashboard to maintain
2. **Best of Both Worlds:** Combines 4-component tracking + AI insights
3. **Clear User Experience:** No confusion about which dashboard to use
4. **AI-First Strategy:** Aligns with "AI Native GRC" vision
5. **Easier Migration:** Can do incrementally

---

## Implementation Plan

### Phase 1: Data Integration (1-2 hours)
```typescript
// File: src/app/ai-native/page.tsx

// Add backend client
import { backendClient } from '@/lib/backend-client'

// Add state for real data
const [backendMetrics, setBackendMetrics] = useState<DashboardMetrics | null>(null)

useEffect(() => {
  async function loadData() {
    try {
      const data = await backendClient.getDashboardOverview()
      setBackendMetrics(data)
    } catch (err) {
      console.error('Falling back to mock data')
    }
  }
  loadData()
}, [])

// Use real data when available, fallback to mock
const activeDeals = backendMetrics?.total_deals ?? mockDataStats.activeDeals
```

### Phase 2: Add 4-Component Cards (30 minutes)
```typescript
// After Compliance Forecast section, add:

<section>
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    Component Compliance Details
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <ComponentProgressCard
      component={backendMetrics?.shariah_compliance}
      color="purple"
      icon="🕌"
    />
    <ComponentProgressCard
      component={backendMetrics?.jurisdiction_compliance}
      color="orange"
      icon="⚖️"
    />
    <ComponentProgressCard
      component={backendMetrics?.accounting_compliance}
      color="blue"
      icon="📊"
    />
    <ComponentProgressCard
      component={backendMetrics?.impact_compliance}
      color="green"
      icon="🌱"
    />
  </div>
</section>
```

### Phase 3: Add Monitoring Cards (30 minutes)
```typescript
// After Component Cards, add:

<section>
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    Monitoring & Status
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <MonitoringCard card={backendMetrics?.contracts_card} icon="📄" />
    <MonitoringCard card={backendMetrics?.shariah_reviews_card} icon="✓" />
    <MonitoringCard card={backendMetrics?.impact_validations_card} icon="🌍" />
    <MonitoringCard card={backendMetrics?.documents_card} icon="📁" />
  </div>
</section>
```

### Phase 4: Add Product Tours (30 minutes)
```typescript
// Import tour system
import { ProductTour } from '@/components/onboarding/ProductTour'
import { getTourForPage, hasTourForPage } from '@/lib/page-tours'

// Add tour state
const [pageTourSteps, setPageTourSteps] = useState<any[]>([])
const [showPageTour, setShowPageTour] = useState(false)

// Add tour targets to sections
<div data-tour="ai-greeting">
  {/* AI Greeting section */}
</div>

<div data-tour="portfolio-overview">
  {/* Portfolio cards */}
</div>
```

### Phase 5: Redirect Old Dashboard (5 minutes)
```typescript
// File: src/app/dashboard/page.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/ai-native')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to AI Native Dashboard...</p>
      </div>
    </div>
  )
}
```

### Phase 6: Update Navigation (15 minutes)
```bash
# Find all references to /dashboard
grep -r '"/dashboard"' src/

# Replace with /ai-native
# Files likely to update:
# - src/components/layout/Navigation.tsx
# - src/app/layout.tsx
# - Any Link components
```

---

## Components to Preserve

### From Main Dashboard (`/dashboard`)
✅ `ComponentProgressCard` - 4-component tracking
✅ `MonitoringCard` - Status cards
✅ `backendClient` integration - Real data
✅ `ProductTour` - Onboarding system
✅ Loading states & error handling
✅ Responsive grid layouts

### From AI Native (`/ai-native`)
✅ AI greeting banner - Contextual insights
✅ AI-prioritized deal cards - Blocker detection
✅ Compliance forecast - Predictive analytics
✅ Portfolio overview - Multi-status tracking
✅ Sparkles icon - AI indicator
✅ Task integration - AI fix proposals

---

## File Structure After Swap

```
src/app/
├── page.tsx                    # WorkflowContainer (unchanged)
├── ai-native/                  # ENHANCED - New main dashboard
│   ├── page.tsx               # ✨ Merged dashboard (AI + Components)
│   ├── tasks/                 # Preserved
│   ├── deals/                 # Preserved
│   ├── evidence/              # Preserved
│   ├── workflows/             # Preserved
│   └── trust-portal/          # Preserved
└── dashboard/                  # REDIRECT to /ai-native
    └── page.tsx               # Simple redirect component
```

---

## Data Flow

```
┌─────────────────────────────────────────────┐
│  AI Native Dashboard (/ai-native)           │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Data Sources (Dual Mode)              │ │
│  ├───────────────────────────────────────┤ │
│  │ 1. Backend API (via backendClient)    │ │
│  │    - Real compliance data             │ │
│  │    - Component metrics                │ │
│  │    - Deal statuses                    │ │
│  │                                        │ │
│  │ 2. Mock Data (fallback/demo)          │ │
│  │    - mockDeals                         │ │
│  │    - mockTasks                         │ │
│  │    - mockDataStats                     │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Display Sections:                          │
│  ✓ AI Greeting & Insights                  │
│  ✓ Portfolio Overview (4 cards)            │
│  ✓ AI-Prioritized Deals                    │
│  ✓ 4-Component Progress Cards NEW          │
│  ✓ Monitoring Cards NEW                    │
│  ✓ Compliance Forecast                     │
│  ✓ Product Tours NEW                       │
└─────────────────────────────────────────────┘
```

---

## Testing Checklist

After implementation, verify:

- [ ] All 4 component cards display correctly
- [ ] Monitoring cards show accurate data
- [ ] AI insights still work
- [ ] Backend data loads (or gracefully falls back to mock)
- [ ] Product tours target correct elements
- [ ] Navigation links updated
- [ ] `/dashboard` redirects to `/ai-native`
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] All sub-pages still accessible (/tasks, /deals, etc.)
- [ ] Loading states work
- [ ] Error states work

---

## Timeline Estimate

**Total Time: 3-4 hours**

- Phase 1 (Data Integration): 1-2 hours
- Phase 2 (Component Cards): 30 min
- Phase 3 (Monitoring Cards): 30 min
- Phase 4 (Product Tours): 30 min
- Phase 5 (Redirect): 5 min
- Phase 6 (Navigation): 15 min
- Testing: 30 min

**Ready to proceed?** We can start with Phase 1 right now.
