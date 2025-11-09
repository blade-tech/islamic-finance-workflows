# Ijārah Off-Plan Demo - Isolated Development Plan

**Objective**: Build Qatar Ijārah demo independently without affecting existing demo, then integrate modularly.

**Testing Strategy**: GitHub → Netlify preview deployments for browser testing

---

## 🎯 Development Strategy: Feature Branch + Modular Structure

### **Approach: Parallel Development with Feature Flags**

```
main branch (existing demo)
    │
    ├─> Existing features continue working
    │
    └─> feature/qatar-ijarah-demo (NEW)
         │
         ├─> New files only (no edits to existing)
         ├─> Feature flag controlled
         ├─> Independent Netlify preview
         └─> Merge when ready
```

---

## 📁 File Structure: Zero Collision with Existing Demo

### **Phase 1: New Directories (No Impact on Existing)**

```
src/
├── app/
│   ├── ai-native/            ← EXISTING (don't touch)
│   ├── controls/             ← EXISTING (don't touch)
│   ├── obligations/          ← EXISTING (don't touch)
│   │
│   └── qatar-ijarah/         ← NEW (isolated namespace)
│       ├── page.tsx                    # Landing page with demo selector
│       ├── layout.tsx                  # Ijārah-specific layout
│       │
│       ├── project-setup/
│       │   └── page.tsx                # Scene 1: Project onboarding
│       │
│       ├── escrow-wiring/
│       │   └── page.tsx                # Scene 2: Escrow setup
│       │
│       ├── construction-progress/
│       │   └── page.tsx                # Scene 3: Progress tracking
│       │
│       ├── contract-integrity/
│       │   └── page.tsx                # Scene 4: Forward Ijārah validation
│       │
│       ├── rent-gating/
│       │   └── page.tsx                # Scene 5: SHOWSTOPPER - Rent gate
│       │
│       ├── retention-tracker/
│       │   └── page.tsx                # Scene 6: Retention & defects
│       │
│       ├── late-payment/
│       │   └── page.tsx                # Scene 7: Late payment scenario
│       │
│       ├── grc-dashboard/
│       │   └── page.tsx                # Scene 8: 7 KPI tiles
│       │
│       └── workflow-designer/
│           └── page.tsx                # BPMN workflow designer
│
├── lib/
│   ├── store.ts                        ← EXISTING (don't touch)
│   ├── grc-store.ts                    ← EXISTING (don't touch)
│   │
│   └── qatar-ijarah/                   ← NEW (isolated state)
│       ├── ijarah-store.ts             # Zustand store for Ijārah demo
│       ├── ijarah-controls.ts          # 15 Qatar Ijārah controls
│       ├── ijarah-types.ts             # TypeScript types
│       ├── ijarah-workflows.ts         # BPMN workflow templates
│       ├── evidence-validator.ts       # OCR + hash validation
│       └── rent-calculator.ts          # AAOIFI SS-9 4/1/3 logic
│
├── components/
│   ├── ui/                             ← EXISTING (shared, safe to use)
│   ├── workflow/                       ← EXISTING (don't touch)
│   │
│   └── qatar-ijarah/                   ← NEW (isolated components)
│       ├── RentGateWidget.tsx          # Red/green lock gate UI
│       ├── EvidenceChecklist.tsx       # 4-item checklist
│       ├── AutoAdjustmentCalculator.tsx # Rent reduction math
│       ├── EscrowAccountCard.tsx       # Per-unit sub-ledger display
│       ├── AuthorityLetterUpload.tsx   # OCR + validation
│       ├── SSBApprovalGate.tsx         # SSB workflow widget
│       ├── KPIDashboardTile.tsx        # Green/amber/red tile
│       └── BPMNWorkflowCanvas.tsx      # Workflow designer canvas
│
└── public/
    └── qatar-ijarah/                   ← NEW (demo assets)
        ├── sample-completion-cert.pdf
        ├── sample-authority-letter.pdf
        ├── sample-istisna-contract.pdf
        └── demo-data.json
```

**Key Principle**: **ALL new code goes in `/qatar-ijarah/` namespaces**

---

## 🚀 Feature Flag Implementation

### **Option 1: Environment Variable (Recommended)**

**File**: `.env.local`

```env
# Existing env vars
NEXT_PUBLIC_API_URL=http://localhost:8000
PORT=3030

# NEW: Ijārah demo feature flag
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=true
```

**File**: `src/lib/feature-flags.ts` (NEW)

```typescript
export const featureFlags = {
  qatarIjarahDemo: process.env.NEXT_PUBLIC_ENABLE_IJARAH_DEMO === 'true',
  // Future flags
  uaeDemo: false,
  saudiDemo: false
}
```

**Usage in Navigation**:

**File**: `src/components/navigation/MainNav.tsx` (EDIT - safe, just adding link)

```typescript
import { featureFlags } from '@/lib/feature-flags'

export function MainNav() {
  return (
    <nav>
      {/* Existing links */}
      <Link href="/ai-native">Dashboard</Link>
      <Link href="/controls">Controls</Link>
      <Link href="/obligations">Obligations</Link>

      {/* NEW: Conditional Ijārah demo link */}
      {featureFlags.qatarIjarahDemo && (
        <Link href="/qatar-ijarah" className="bg-green-100 px-3 py-1 rounded">
          Qatar Ijārah Demo 🆕
        </Link>
      )}
    </nav>
  )
}
```

### **Option 2: Route-Based (Even Safer)**

Don't even add nav link - just access via direct URL:

```
https://your-app.netlify.app/qatar-ijarah
```

If flag is off, redirect to 404 or existing dashboard.

---

## 🧪 Testing Workflow: GitHub → Netlify Preview Deployments

### **Step-by-Step Testing Process**

#### **1. Create Feature Branch**

```bash
git checkout -b feature/qatar-ijarah-demo
```

#### **2. Develop in Isolation**

```bash
# Add new files only
touch src/app/qatar-ijarah/page.tsx
touch src/lib/qatar-ijarah/ijarah-store.ts

# Commit
git add src/app/qatar-ijarah/ src/lib/qatar-ijarah/
git commit -m "feat(ijarah): add rent gating scene"
```

#### **3. Push to GitHub**

```bash
git push -u origin feature/qatar-ijarah-demo
```

#### **4. Netlify Auto-Deploys Preview**

Netlify automatically creates a **preview deployment** for your branch:

```
Main site:    https://islamic-finance-workflows.netlify.app
Preview site: https://deploy-preview-[PR#]--islamic-finance-workflows.netlify.app
```

**OR** (if not using PRs):

```
Branch deploy: https://feature-qatar-ijarah-demo--islamic-finance-workflows.netlify.app
```

#### **5. Test in Browser**

Navigate to:
```
https://[preview-url]/qatar-ijarah/rent-gating
```

Test:
- ✅ Upload evidence files
- ✅ See rent gate unlock
- ✅ Auto-calculation runs
- ✅ VC minting simulation
- ✅ No impact on existing demo at `/ai-native`

#### **6. Iterate**

```bash
# Make changes
vim src/app/qatar-ijarah/rent-gating/page.tsx

# Commit and push
git add .
git commit -m "fix(ijarah): adjust rent calculation formula"
git push

# Netlify auto-redeploys preview in ~2 minutes
# Test again at same preview URL
```

---

## 📦 Netlify Configuration

### **File**: `netlify.toml` (ADD - if not exists)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_ENABLE_IJARAH_DEMO = "true"

# Deploy previews for all branches
[context.deploy-preview]
  command = "npm run build"

# Branch-specific builds
[context.feature/qatar-ijarah-demo]
  command = "npm run build"

[context.feature/qatar-ijarah-demo.environment]
  NEXT_PUBLIC_ENABLE_IJARAH_DEMO = "true"

# Production keeps flag off until ready
[context.production]
  command = "npm run build"

[context.production.environment]
  NEXT_PUBLIC_ENABLE_IJARAH_DEMO = "false"
```

---

## 🔀 Integration Strategy: When Ready to Merge

### **Phase 1: Soft Launch (Week 3)**

**Merge to main BUT keep feature flag OFF**:

```bash
git checkout main
git merge feature/qatar-ijarah-demo
git push origin main
```

**File**: `.env.production`
```env
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=false  # Still hidden
```

**Result**: Code is in main, but users don't see it. You can enable for specific stakeholders via URL:

```
https://islamic-finance-workflows.netlify.app/qatar-ijarah
```

### **Phase 2: Stakeholder Preview (Week 4)**

Turn on flag for **preview environment only**:

**Netlify Dashboard** → **Deploy Settings** → **Environment Variables**:
```
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=true  (for branch deploys)
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=false (for production)
```

Share preview URL with stakeholders:
```
https://deploy-preview-123--islamic-finance-workflows.netlify.app
```

### **Phase 3: Full Launch (Week 5)**

Turn on flag globally:

```env
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=true  # Production
```

Navigation link appears for all users.

---

## 🎨 Visual Integration: Demo Switcher

### **Landing Page**: `src/app/qatar-ijarah/page.tsx`

```typescript
export default function QatarIjarahLanding() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Hero */}
      <div className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          Qatar Ijārah Off-Plan Demo
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          15 controls • 3 regulators • 8 scenes • 100% automated
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/qatar-ijarah/rent-gating">
              🌟 Start with Showstopper (Scene 5)
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/qatar-ijarah/project-setup">
              📋 Full 8-Scene Demo
            </Link>
          </Button>
        </div>
      </div>

      {/* 8 Scene Cards */}
      <div className="grid grid-cols-4 gap-4">
        {scenes.map(scene => (
          <Card key={scene.id} className="p-4 hover:shadow-lg cursor-pointer">
            <Link href={scene.url}>
              <div className="text-2xl mb-2">{scene.icon}</div>
              <h3 className="font-semibold mb-1">{scene.name}</h3>
              <p className="text-xs text-muted-foreground">{scene.description}</p>
            </Link>
          </Card>
        ))}
      </div>

      {/* Comparison to Existing Demo */}
      <Card className="p-6 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4">
          How This Differs from Main Demo
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Main Demo (5-Pillar)</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ Broad GRC framework</li>
              <li>✓ Multiple product types</li>
              <li>✓ 5-pillar compliance</li>
              <li>✓ Hedera Guardian integration</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Qatar Ijārah Demo (Focused)</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ Single product: Ijārah off-plan</li>
              <li>✓ Single jurisdiction: Qatar (QCB + QFCRA)</li>
              <li>✓ 15 specific controls</li>
              <li>✓ Hard gates + auto-remediation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

---

## 🧪 Comprehensive Testing Checklist

### **Pre-Merge Tests** (Run on Preview Deployment)

#### **1. Isolation Tests**
- [ ] Navigate to `/ai-native` → Existing demo works perfectly
- [ ] Navigate to `/controls` → Qatar GRC controls unaffected
- [ ] Navigate to `/obligations` → Obligations register unchanged
- [ ] Navigate to `/qatar-ijarah` → New demo loads independently

#### **2. Scene-by-Scene Tests**
- [ ] Scene 1: Project setup creates Shariah Policy Manual
- [ ] Scene 2: Escrow wiring validates deposit sources
- [ ] Scene 3: Construction progress blocks without Authority letter
- [ ] Scene 4: Contract integrity validates tri-split
- [ ] **Scene 5 (Showstopper)**: Rent gate blocks/unlocks correctly
- [ ] Scene 6: Retention tracker shows 10% locked
- [ ] Scene 7: Late payment routes to charity, no late fees
- [ ] Scene 8: Dashboard shows 7 KPI tiles with click-throughs

#### **3. Integration Tests**
- [ ] Shared UI components (from `/components/ui/`) work in new demo
- [ ] Navigation between scenes works smoothly
- [ ] Browser back/forward buttons work
- [ ] Mobile responsive (test on phone)

#### **4. Feature Flag Tests**
- [ ] Set `NEXT_PUBLIC_ENABLE_IJARAH_DEMO=false` → Link disappears
- [ ] Set `NEXT_PUBLIC_ENABLE_IJARAH_DEMO=true` → Link appears
- [ ] Direct URL `/qatar-ijarah` redirects to 404 when flag off

#### **5. Performance Tests**
- [ ] Page load time < 2 seconds
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## 📅 Implementation Timeline

### **Week 1: Foundation + Showstopper**
**Days 1-2**: Setup isolated structure
- Create `/qatar-ijarah/` directories
- Setup Zustand store
- Create 15 control definitions
- Configure feature flag
- Test Netlify preview deployment

**Days 3-5**: Build Scene 5 (Rent Gating)
- Evidence checklist UI
- Hard gate logic
- Auto-adjustment calculator
- VC minting simulation
- Audit trail
- Polish animations

**Day 5**: First stakeholder test
- Share preview URL
- Collect feedback
- Iterate

### **Week 2: Complete 8 Scenes**
**Day 6-7**: Scenes 1-2 (Setup + Escrow)
**Day 8-9**: Scenes 3-4 (Progress + Integrity)
**Day 10**: Scenes 6-7 (Retention + Late Payment)

### **Week 3: Dashboard + Polish**
**Day 11-12**: Scene 8 (GRC Dashboard with 7 KPIs)
**Day 13-14**: BPMN Workflow Designer
**Day 15**: Integration testing + bug fixes

### **Week 4: Merge + Launch Prep**
**Day 16-17**: Merge to main (flag OFF)
**Day 18-19**: Stakeholder preview (flag ON for preview only)
**Day 20**: Production launch (flag ON globally)

---

## 🚦 Decision Points

### **Go/No-Go Criteria for Merge**

**Must Have** (Blockers):
- ✅ Scene 5 (Rent Gating) working perfectly
- ✅ Zero impact on existing demo verified
- ✅ At least 2 stakeholders tested and approved
- ✅ No console errors or warnings
- ✅ Mobile responsive

**Nice to Have** (Can defer):
- ⚠️ All 8 scenes complete (can launch with 5 scenes)
- ⚠️ BPMN workflow designer (can add later)
- ⚠️ Perfect animations (can polish post-launch)

---

## 🔧 Development Commands

### **Local Development**

```bash
# Start with Ijārah demo enabled
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=true npm run dev

# Start with Ijārah demo disabled
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=false npm run dev

# Build with Ijārah demo
NEXT_PUBLIC_ENABLE_IJARAH_DEMO=true npm run build
npm start
```

### **Git Workflow**

```bash
# Create feature branch
git checkout -b feature/qatar-ijarah-demo

# Daily commits
git add src/app/qatar-ijarah/ src/lib/qatar-ijarah/
git commit -m "feat(ijarah): add [scene name]"
git push

# Test preview URL
# https://feature-qatar-ijarah-demo--islamic-finance-workflows.netlify.app

# When ready to merge
git checkout main
git merge feature/qatar-ijarah-demo
git push origin main
```

---

## 🎯 Success Metrics

### **Developer Experience**
- ⏱️ **Time to first preview**: < 5 minutes after push
- 🐛 **Bugs introduced to existing demo**: 0
- 🔄 **Iterations per day**: 5+ (fast feedback loop)

### **Demo Quality**
- ⚡ **Page load time**: < 2 seconds
- 📱 **Mobile usability**: Full responsive
- 🎨 **Visual polish**: Professional animations
- 📊 **Data accuracy**: 100% (rent calculations, dates, amounts)

### **Stakeholder Feedback**
- 👍 **"Wow factor"**: 8+/10 rating on Scene 5
- ⏰ **Time to understand**: < 3 minutes
- 💡 **Clarity**: "I get exactly what this does"

---

## 🚀 Ready to Start?

**Approval Checklist**:
- [ ] Isolated namespace strategy approved (`/qatar-ijarah/`)
- [ ] Feature flag approach approved (env var)
- [ ] Netlify preview testing approved
- [ ] Timeline approved (3 weeks)
- [ ] Success criteria agreed

**Next Steps After Approval**:
1. Create feature branch
2. Setup directory structure
3. Configure feature flag
4. Build Scene 5 (Rent Gating) first
5. Push to GitHub → Test on Netlify preview
6. Share preview URL for feedback

---

## 📞 Questions to Resolve

1. **Feature flag preference**: Environment variable or route-based?
2. **Navigation visibility**: Show Ijārah link in main nav or keep hidden?
3. **Merge timeline**: Prefer fast (2 weeks) or polished (4 weeks)?
4. **Stakeholder access**: Who gets preview URLs for testing?
5. **Production launch**: Soft launch (invite-only) or hard launch (public)?

Ready to proceed when you approve the plan! 🚀
