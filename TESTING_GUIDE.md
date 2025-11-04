# 4-Component Modular Architecture - Testing Guide

**Project:** Islamic Finance Workflows
**Architecture:** Modular 4-Component Selection System
**Created:** 2025-11-04
**Status:** Phase 4A Implementation Complete

## Overview

This document provides comprehensive testing guidance for the 4-component modular architecture. The system allows users to compose Islamic finance deals from 4 independent components plus an optional Takaful (Islamic insurance) overlay:

1. **Shariah Structure** (7 options): Ijara, Murabaha, Musharaka, Mudaraba, Wakala, Salam, Istisna
   - **Securitization Toggle**: Each structure can be used for direct financing OR securitized as Sukuk certificates
2. **Jurisdiction** (5 options): Saudi Arabia (CMA), UAE (DFSA), Qatar (QFC/QCB), Malaysia (SC), Luxembourg (CSSF)
3. **Accounting Framework** (3 options): AAOIFI, IFRS+Islamic, Local GAAP
4. **Impact Metrics** (7 options, multi-select): Green Sukuk, SDG-Linked, ESG Framework, QFC Sustainable Sukuk, Islamic Social Finance, VBI Malaysia, None
5. **Takaful Overlay** (optional): Islamic insurance with 3 models (Mudaraba, Wakalah, Hybrid) and 4 coverage types

**Total Theoretical Combinations:** 7 × 2 (Sukuk toggle) × 5 × 3 × 127 (multi-select impact) × 2 (Takaful on/off) = 26,670+ combinations
**Valid Combinations (after validation):** ~150-200 (many combinations are filtered by compatibility rules)

**New in Phase 4A:**
- 🆕 **Wakala structure** - Agency-based contracts (18% market share)
- 🆕 **Qatar (QFC/QCB)** jurisdiction - Dual regulator framework
- 🆕 **QFC Sustainable Sukuk Framework** - Qatar-specific ESG standards
- 🆕 **Islamic Social Finance** - SDG-aligned social impact framework
- 🆕 **VBI Malaysia** - Value-Based Intermediation framework
- 🆕 **Sukuk Securitization Toggle** - Contract types vs securitized instruments
- 🆕 **Multi-Select Impact Metrics** - Combine multiple ESG/sustainability frameworks
- 🆕 **Takaful Overlay UI** - Visible Islamic insurance configuration
- 🆕 **Demo Mode** - One-click QIIB Oryx configuration pre-population

## Testing Objectives

1. **Functional Testing** - Verify all 13 workflow steps work correctly
2. **Component Selection** - Validate proper selection and display of all components
3. **Validation Rules** - Ensure validation engine catches all incompatible combinations
4. **Dynamic Form Composition** - Verify forms are correctly built from component fields
5. **User Experience** - Check navigation, progress tracking, error messaging
6. **Data Persistence** - Validate Zustand state management across steps

## Test Environment Setup

### Prerequisites
- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Dev server running (`npm run dev` on port 3030)
- Backend services running (optional for full testing)

### Starting the Application
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (optional)
cd backend
./venv/Scripts/uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Access
- Frontend: http://localhost:3030
- Zustand DevTools: Open React DevTools and check Zustand state

## Test Scenarios

### Scenario 1: Happy Path - Saudi Arabia Green Sukuk
**Objective:** Test most common market configuration with strict validation

**Steps:**
1. Navigate to Step 1: Connect Sources (skip for now, testing mode allows)
2. Navigate to Step 2: Select Template (skip for now)
3. **Step 3: Select Shariah Structure**
   - Select: **Ijara** (leasing-based)
   - Verify: Card highlights, summary badge appears
4. **Step 4: Select Jurisdiction**
   - Select: **Saudi Arabia (CMA)**
   - Verify: Tax-free badge, mandatory AAOIFI warning displays
5. **Step 5: Select Accounting**
   - Verify: Only **AAOIFI** is available (IFRS and Local GAAP should be disabled/grayed)
   - Select: **AAOIFI**
   - Verify: "Required" badge shows
6. **Step 6: Select Impact Metrics**
   - Select: **Green Sukuk**
   - Verify: Certification warning shows (CBI/ICMA), reporting requirements listed
7. **Step 7: Review Configuration**
   - Verify: All 4 component cards display correctly
   - Verify: Green "Configuration Valid" alert shows
   - Verify: No validation errors
   - Verify: Configuration name: "Ijara - Saudi Arabia (CMA) - AAOIFI"
   - Click: Continue button
8. **Step 8: Configure Details**
   - Verify: 4 separate card sections (Shariah, Jurisdiction, Accounting, Impact)
   - Verify: Ijara base fields display (Asset Details, Lease Structure, etc.)
   - Verify: Saudi Arabia additional fields display
   - Verify: AAOIFI compliance standards auto-display (FAS 33, SS 62)
   - Verify: Green Sukuk reporting requirements display
   - Fill in sample values for all required fields
   - Click: Validate & Continue

**Expected Result:** ✅ No validation errors, smooth progression through all steps

---

### Scenario 2: Validation Error - Incompatible Accounting
**Objective:** Test validation engine catches jurisdiction-accounting incompatibility

**Steps:**
1. **Step 3:** Select **Murabaha**
2. **Step 4:** Select **Saudi Arabia (CMA)**
3. **Step 5:** Attempt to select **Local GAAP (Malaysia)**
   - **Expected:** Card should be disabled/grayed with "Not compatible" warning
   - **Expected:** Only AAOIFI should be selectable
4. If somehow able to select incompatible framework, proceed to Step 7
   - **Expected:** Red "Configuration Invalid" alert
   - **Expected:** Error message: "Saudi Arabia (CMA) requires AAOIFI accounting"
   - **Expected:** Continue button disabled

**Expected Result:** ✅ Validation prevents invalid combination, clear error messaging

---

### Scenario 3: Validation Warning - Uncommon Combination
**Objective:** Test business logic validation warnings (non-blocking)

**Steps:**
1. **Step 3:** Select **Salam** (forward sale)
2. **Step 4:** Select **Luxembourg (CSSF)**
3. **Step 5:** Select **IFRS+Islamic**
4. **Step 6:** Select **No Impact Metrics**
5. **Step 7: Review Configuration**
   - **Expected:** Orange "Configuration Valid" status (valid but with warnings)
   - **Expected:** Warning message: "Salam is rarely used in Luxembourg due to regulatory complexity"
   - **Expected:** Continue button **enabled** (warnings don't block)

**Expected Result:** ✅ Configuration is valid, but user is warned about uncommon combination

---

### Scenario 4: Green Sukuk + Asset-Based Structure
**Objective:** Test impact-shariah compatibility recommendations

**Steps:**
1. **Step 3:** Select **Murabaha** (commodity trade)
2. **Step 4:** Select **Dubai (DFSA)**
3. **Step 5:** Select **IFRS+Islamic**
4. **Step 6:** Select **Green Sukuk**
5. **Step 7: Review Configuration**
   - **Expected:** Warning: "Green Sukuk is typically issued using asset-backed structures like Ijara or Istisna. Murabaha is less common for green issuances."
   - **Expected:** Continue button enabled

**Compare with:**
1. Change Step 3 to **Ijara**
2. Revisit Step 7
   - **Expected:** No warning about structure (Ijara is ideal for Green Sukuk)

**Expected Result:** ✅ Validation guides users toward better practices without blocking

---

### Scenario 5: Dynamic Form Composition - All Components
**Objective:** Verify dynamic form is correctly built from all 4 component field arrays

**Steps:**
1. **Step 3:** Select **Hybrid Sukuk**
2. **Step 4:** Select **Malaysia (SC)**
3. **Step 5:** Select **Local GAAP (Malaysia)**
4. **Step 6:** Select **ESG Framework**
5. **Step 7:** Validate (should be valid)
6. **Step 8: Configure Details**
   - **Verify Section 1:** "Hybrid Sukuk Details" card with baseFields from Hybrid structure
   - **Verify Section 2:** "Malaysia (SC) Requirements" card with jurisdiction fields
   - **Verify Section 3:** "Local GAAP (Malaysia) Fields" card with accounting fields
   - **Verify Section 4:** "ESG Framework Configuration" card with impact fields
   - **Verify:** Compliance standards section shows:
     - Hybrid Sukuk AAOIFI standards
     - Local GAAP accounting standards (3 shown)
     - ESG Framework (e.g., MSCI ESG Ratings)
   - **Verify:** All fields have AI suggestions toggle
   - **Fill:** All required fields
   - **Click:** Validate & Continue
   - **Expected:** No validation errors if all required fields filled

**Expected Result:** ✅ Form correctly composed from all 4 components, standards auto-applied

---

### Scenario 6: Edit Component Mid-Flow
**Objective:** Test ability to go back and change component selections

**Steps:**
1. Complete Steps 3-6 (select all 4 components)
2. At Step 7 (Review Configuration), click **Edit** button on Jurisdiction card
   - **Expected:** Navigate back to Step 4
3. Change jurisdiction from Saudi Arabia to **Dubai**
4. Navigate forward to Step 5 (Accounting)
   - **Expected:** Accounting options update (now IFRS and Local GAAP available)
5. Continue to Step 7
   - **Expected:** Configuration re-validates automatically
   - **Expected:** New configuration name reflects Dubai

**Expected Result:** ✅ Changes propagate correctly, validation updates dynamically

---

### Scenario 7: Multi-Framework Accounting Compatibility
**Objective:** Test jurisdictions that allow multiple accounting frameworks

**Steps:**
1. **Step 3:** Select **Musharaka**
2. **Step 4:** Select **Malaysia (SC)** (allows all 3 frameworks)
3. **Step 5:** Verify all 3 accounting frameworks are enabled
   - Try each: AAOIFI, IFRS+Islamic, Local GAAP
   - **Expected:** All should be selectable
4. Select **IFRS+Islamic**
5. **Step 7:** Review
   - **Expected:** Warning: "Using IFRS+Islamic in GCC region may require additional AAOIFI disclosures"
   - Wait, Malaysia is not GCC, so **no warning expected**

**Expected Result:** ✅ Flexible jurisdiction allows all frameworks without restrictions

---

### Scenario 8: Takaful Overlay (Future Feature)
**Objective:** Verify Takaful overlay fields are included when enabled

**Steps:**
1. Complete Steps 3-6 normally
2. **Step 8:** In Configure Details, verify Takaful section
   - **Expected:** Currently no UI to enable Takaful (future feature)
   - **Expected:** No "Takaful Overlay Configuration" card displays

**Note:** Takaful overlay is designed but not yet implemented in UI. Data model supports it.

**Expected Result:** ✅ Takaful fields hidden when not enabled (correct behavior)

---

### Scenario 9: Progress Tracking and Navigation
**Objective:** Test workflow progress bar and step navigation

**Steps:**
1. Start at Step 1
   - **Verify:** Progress bar shows "Step 1 of 14: Connect Sources"
   - **Verify:** Progress: 7% (1/14)
2. Navigate to Step 8 (Configure Details)
   - **Verify:** Progress bar shows "Step 8 of 14: Configure Details"
   - **Verify:** Progress: 57% (8/14)
3. Click on step indicators at top
   - **Verify:** Can jump to any step (testing mode allows free navigation)
4. Click "Previous Step" and "Next Step" buttons
   - **Verify:** Navigation works correctly
   - **Verify:** Current step highlights in blue

**Expected Result:** ✅ Progress tracking accurate, navigation intuitive

---

### Scenario 10: Validation Results Display
**Objective:** Test comprehensive error and warning display

**Steps:**
1. **Step 3:** Select **Hybrid Sukuk**
2. **Step 4:** Select **Saudi Arabia (CMA)**
3. **Step 5:** Try to select **IFRS+Islamic** (should be blocked, but if bypassed...)
4. **Step 6:** Select **SDG-Linked**
5. **Step 7: Review Configuration**
   - **Expected Errors:**
     - "Saudi Arabia (CMA) requires AAOIFI accounting"
   - **Expected Warnings:**
     - "Hybrid Sukuk may require additional regulatory approval in GCC jurisdictions"
     - "SDG-Linked Sukuk is often associated with project-based structures"
   - **Verify:** Red destructive alert for errors
   - **Verify:** Orange warning alert for warnings
   - **Verify:** Continue button disabled (errors block)

**Expected Result:** ✅ All validation results clearly displayed, severity differentiated

---

### Scenario 11: QIIB Oryx Demo Mode (Qatar QFC Wakala Sukuk)
**Objective:** Test one-click demo configuration pre-population using real-world QIIB Oryx Sustainability Sukuk

**Background:**
- **Real Deal:** Qatar International Islamic Bank (QIIB) Oryx Sustainability Sukuk
- **Issuance Date:** January 2024
- **Size:** US$500 million
- **Structure:** Wakala (agency-based) Sukuk with dual ESG/social impact frameworks
- **First:** First Qatari bank sustainability Sukuk issuance

**Steps:**
1. **Navigate to:** Home page (Step 1)
2. **Click:** "Load QIIB Oryx Demo" button (top right, sparkles icon)
   - **Expected:** Immediate navigation to Step 2 (Shariah Structure selection)
   - **Expected:** All 4 components pre-populated automatically

3. **Step 2: Verify Shariah Structure**
   - **Expected:** **Wakala** structure selected and highlighted
   - **Expected:** "18% Market Share" badge visible
   - **Expected:** Use case includes "Bank corporate financing (e.g., QIIB Oryx Sustainability Sukuk)"
   - **Expected:** Sukuk securitization toggle **ON** (enabled)
   - **Expected:** Green alert: "Sukuk Mode Enabled: Your workflow will generate Sukuk issuance documentation..."
   - **Expected:** Takaful toggle **OFF** (disabled) - QIIB Oryx doesn't use Takaful

4. **Navigate to Step 3: Verify Jurisdiction**
   - **Expected:** **Qatar (QFC/QCB)** selected
   - **Expected:** Description mentions Qatar Financial Centre + Qatar Central Bank
   - **Expected:** Tax rate: 0% (tax-free status)
   - **Expected:** "Requires AAOIFI" badge/indicator visible
   - **Expected:** QFC Sustainable Sukuk Framework fields pre-configured

5. **Navigate to Step 4: Verify Accounting**
   - **Expected:** **AAOIFI Standards** selected
   - **Expected:** "Required by Qatar" badge or indicator
   - **Expected:** Applicable standards include FAS 33 (Sukuk), FAS 34 (Sukuk-Holders)

6. **Navigate to Step 5: Verify Impact Metrics**
   - **Expected:** **Two** impact frameworks selected (multi-select)
     1. **QFC Sustainable Sukuk Framework**
     2. **Islamic Social Finance**
   - **Expected:** Both cards highlighted with checkmarks
   - **Expected:** QFC Sustainable includes Qatar National Vision 2030 alignment
   - **Expected:** Islamic Social Finance includes SDG mapping

7. **Navigate to Step 6: Review Configuration**
   - **CRITICAL VALIDATION TEST:**
   - **Expected:** Green "Configuration Valid" alert ✅
   - **Expected:** NO errors about "AAOIFI not compatible with Qatar" (bug fixed)
   - **Expected:** Configuration name: "Wakala - Qatar (QFC/QCB) - AAOIFI"
   - **Expected:** Summary shows:
     - Shariah Structure: Wakala (Sukuk mode ON)
     - Jurisdiction: Qatar (QFC/QCB)
     - Accounting: AAOIFI Standards
     - Impact Metrics: QFC Sustainable Sukuk Framework + Islamic Social Finance
     - Takaful: None
   - **Expected:** Possible warning (non-blocking): "QFC Sustainable Sukuk Framework certification standards may differ in GCC"
   - **Expected:** Continue button **enabled**

8. **Navigate to Step 7: Verify Dynamic Form**
   - **Expected:** 4+ sections displayed:
     1. Wakala Structure Details (Agent, Principal, Profit-Sharing Ratio, etc.)
     2. Qatar (QFC/QCB) Requirements (QFC-specific fields, QNV 2030 alignment)
     3. AAOIFI Compliance Fields (Shariah Board Composition, AAOIFI-Certified Audit Firm, Zakat Method)
     4. QFC Sustainable Sukuk Framework (Use of Proceeds, Sustainability Objectives)
     5. Islamic Social Finance (SDG Mapping, Social Impact KPIs)
   - **Expected:** Pre-filled AI suggestions include "Qatar International Islamic Bank" references
   - **Expected:** All compliance standards auto-display (AAOIFI FAS 33, SS 62, QFC Rulebook)

**Expected Result:** ✅ Demo loads successfully, all components pre-populated correctly, configuration validates without errors

**Regression Check:** This scenario tests:
- Demo mode button functionality
- State pre-population
- Wakala structure display
- Qatar jurisdiction compatibility (bug fix validation)
- Multi-select Impact Metrics
- Sukuk securitization toggle
- Takaful overlay (disabled state)
- AAOIFI-Qatar compatibility (critical bug fix)

---

### Scenario 12: Demo Mode Reset
**Objective:** Verify demo configuration can be cleared or overwritten

**Steps:**
1. Load QIIB Oryx demo (Scenario 11)
2. Navigate to Step 2 (Shariah Structure)
3. Select different structure (e.g., **Ijara**)
   - **Expected:** Previous Wakala selection deselected
   - **Expected:** New selection persists
4. Navigate to Step 6 (Review Configuration)
   - **Expected:** Configuration updates to reflect new Shariah Structure
   - **Expected:** Re-validation runs automatically
   - **Expected:** May show different validation results (Ijara + Qatar + AAOIFI + QFC Sustainable)

**Expected Result:** ✅ Demo configuration is not locked, user can modify any component

---

## Key Test Combinations

### Critical Path Combinations (Must Test)
1. **Wakala + Qatar + AAOIFI + QFC Sustainable + Islamic Social Finance** (QIIB Oryx demo - real-world 2024 deal)
2. **Ijara + Saudi Arabia + AAOIFI + Green Sukuk** (most common structure)
3. **Murabaha + Dubai + IFRS+Islamic + No Impact** (standard international)
4. **Musharaka + Malaysia + Local GAAP + ESG Framework** (local focus)
5. **Istisna + Luxembourg + IFRS+Islamic + Green Sukuk** (European green)

### Edge Case Combinations (Should Test)
5. **Salam + Luxembourg + IFRS+Islamic + SDG-Linked** (uncommon structure + jurisdiction)
6. **Hybrid + Saudi Arabia + AAOIFI + Green Sukuk** (hybrid structure in strict jurisdiction)
7. **Mudaraba + Dubai + AAOIFI + No Impact** (partnership structure)

### Invalid Combinations (Must Block)
8. **Any Structure + Saudi Arabia + IFRS+Islamic** (mandatory AAOIFI violation)
9. **Any Structure + Saudi Arabia + Local GAAP** (forbidden framework)

## Validation Rules to Verify

### Jurisdiction-Accounting Compatibility
- ✅ Saudi Arabia **requires** AAOIFI exclusively
- ✅ Saudi Arabia **forbids** Local GAAP and IFRS+Islamic
- ✅ Qatar (QFC/QCB) **requires** AAOIFI (allows IFRS+Islamic as secondary)
- ✅ UAE/Dubai (DFSA) **allows** AAOIFI and IFRS+Islamic
- ✅ Malaysia **allows** all three frameworks (most flexible)
- ✅ Luxembourg **allows** IFRS+Islamic only

### Business Logic Warnings
- ⚠️ Salam in Luxembourg (regulatory complexity warning)
- ⚠️ Hybrid in GCC (additional approval warning)
- ⚠️ Green Sukuk with Murabaha (structure mismatch warning)
- ⚠️ SDG-Linked with Murabaha (impact-structure misalignment)
- ⚠️ IFRS+Islamic in GCC (dual disclosure requirement warning)

### Certification Requirements
- 🏆 Green Sukuk requires CBI or ICMA certification
- 🏆 Certification standards may differ by jurisdiction (warning)

## Zustand State Inspection

Use React DevTools to inspect Zustand state at each step:

### After Step 3 (Shariah):
```javascript
execution.selectedShariahStructure = {
  id: "ijara",
  name: "Ijara Sukuk",
  // ... full object
}
```

### After Step 6 (All 4 components):
```javascript
execution.selectedShariahStructure = { ... }
execution.selectedJurisdiction = { ... }
execution.selectedAccounting = { ... }
execution.selectedImpact = { ... }
execution.dealConfiguration = null // not built yet
```

### After Step 7 (Validation):
```javascript
execution.dealConfiguration = {
  configurationName: "Ijara - Saudi Arabia (CMA) - AAOIFI",
  isValid: true,
  validationErrors: [],
  validationWarnings: [],
  // ... full config
}
```

## Regression Testing Checklist

After any code changes, verify:

- [ ] All 13 steps render without errors
- [ ] Step navigation (Previous/Next) works
- [ ] Component selection updates Zustand state
- [ ] Validation runs on Step 7 automatically
- [ ] Invalid configurations block progression
- [ ] Warnings don't block progression
- [ ] Dynamic form composition shows all component fields
- [ ] Compliance standards auto-display
- [ ] AI suggestions toggle works
- [ ] Form validation on Step 8 works
- [ ] Progress bar updates correctly
- [ ] Dev server compiles without TypeScript errors

## Known Limitations (Current Phase)

1. **Backend Integration:** Step 1 (Connect Sources) and Step 10 (Live Execution) are not yet connected to real backend
2. **Testing Mode:** Validation is relaxed (all steps return `true` in `canGoNext`)
3. **Mock Data:** Some steps use placeholder data
4. **Sukuk vs Direct Financing:** UI toggle implemented but downstream logic not yet differentiated

## Next Steps After Testing

1. **Enable Strict Validation:** Update `canGoNext` in WorkflowContainer to enforce real validation
2. **Backend Integration:** Connect Steps 1 and 11 to actual services
3. **E2E Automation:** Implement Playwright or Cypress tests for automated regression testing
4. **User Acceptance Testing:** Get feedback from Islamic finance domain experts
5. **Performance Testing:** Test with large form datasets

## Success Criteria

✅ **Phase 4A Complete When:**
- All 13 steps render correctly (Step 2 template selection removed)
- All 4-component combinations validate correctly
- Dynamic form composition works for all configurations
- Sukuk securitization toggle functions properly
- Multi-select impact metrics work correctly
- Takaful overlay UI is visible and functional
- Demo mode (QIIB Oryx) loads configuration successfully
- Qatar-AAOIFI compatibility validates without errors (bug fixed)
- No TypeScript compilation errors
- No console errors during navigation
- Validation rules engine catches all incompatibilities
- User can complete happy path from Step 2 to Step 8

## Support and Resources

- **Documentation:** See `MODULAR_ARCHITECTURE_PIVOT.md` for full architecture details
- **Validation Logic:** See `src/lib/validation.ts` for all validation rules
- **Component Data:** See `src/data/shariah-structures.ts`, `jurisdictions.ts`, etc.
- **State Management:** See `src/lib/store.ts` for Zustand actions

---

**Last Updated:** 2025-11-04
**Testing Status:** Ready for manual testing
**Automation Status:** Pending (Task 4L follow-up)
