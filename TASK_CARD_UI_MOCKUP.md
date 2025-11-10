# Task Card UI Mockup - Before & After Comparison

**Date**: 2025-11-10
**Purpose**: Visual representation of proposed task card redesign

---

## Current Design (My Tasks Page)

### Problems Identified
```
┌─────────────────────────────────────────────────────┐
│ 📊 Statistics (Generic, Not Actionable)             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │  47  │ │  12  │ │   3  │ │   2  │ │   7  │     │
│ │Total │ │ Due  │ │In Pr.│ │Wait  │ │Over  │     │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🎚️  Filters (Too Many, Overwhelming)                │
│ Time: [Today][Week][Month][All]                     │
│ Status: [All][Not Started][In Prog][Waiting][Done] │
│ Role: [All][SCO][Legal][Ops][Finance]               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ❌ MINIMAL TASK CARD (Current)                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📋 Obtain Legal Title Documentation             │ │
│ │                                                  │ │
│ │ Acquire proof of legal ownership: title deed,   │ │
│ │ purchase invoice, asset registration            │ │
│ │                                                  │ │
│ │ 🔴 High  📅 Due in 5 days  👤 Legal/Asset Mgmt  │ │
│ │                                                  │ │
│ │ [Mark In Progress] [Mark Complete]              │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

❌ User Questions:
1. WHY am I doing this?
2. What policy requires this?
3. What documents do I need?
4. Has anything been validated already?
5. Where can I ask questions?
6. What if I'm stuck?
```

---

## Proposed Design (Qatar Ijarah V2 Pattern + AI Assistant)

### Self-Contained Task Card

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✅ SELF-CONTAINED TASK CARD (Proposed)                              │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ 📋 Obtain Legal Title Documentation          🟠 HIGH PRIORITY  │ │
│ │                                                                  │ │
│ │ 📍 Workflow: Ijarah (Islamic Lease) - Qatar                     │ │
│ │ 📊 Step 2 of 9    ⏰ Due: 5 days    👤 Legal / Asset Management │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │                                                                  │ │
│ │ 💡 WHY THIS EXISTS:                                             │ │
│ │ AAOIFI SS-9 (Ijarah) §3/1 requires the institution to legally   │ │
│ │ own the asset before leasing it. This hard gate ensures Shariah │ │
│ │ compliance by verifying ownership documentation.                │ │
│ │                                                                  │ │
│ │ 📜 [Show Policy Clause →]                                       │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │                                                                  │ │
│ │ 🤖 AI REASONING: [Click to Expand ▼]                            │ │
│ │   ✅ Asset identified: Pearl Towers Unit A1                     │ │
│ │   ✅ Purchase transaction verified in ERP (TXN-12345)           │ │
│ │   ⏳ Awaiting: Title deed upload                                │ │
│ │   +3 more checks                                                │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │                                                                  │ │
│ │ 📄 REQUIRED DOCUMENTS (0 of 3 uploaded): [Click to Expand ▼]   │ │
│ │   🔴 Title Deed or Ownership Certificate (Required)             │ │
│ │   🔴 Purchase Invoice (Required)                                │ │
│ │   🟡 Asset Registration (Optional)                              │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │                                                                  │ │
│ │ 🤖 AI ASSISTANT: [Ask AI About This Task →]                     │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │                                                                  │ │
│ │ [📤 Upload Documents]  [❌ Flag Issue]  [💬 Need Help]          │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

✅ User Has Everything They Need:
1. ✅ Understands WHY (policy explanation)
2. ✅ Knows WHAT to do (upload 3 documents)
3. ✅ Sees validation status (AI pre-checks)
4. ✅ Can ask questions (AI assistant)
5. ✅ Has context (workflow, step X of Y)
6. ✅ Clear actions (upload, flag, ask)
```

---

## AI Assistant Panel (Slide-Out)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 AI Task Assistant                                      [✕]  │
│                                                                 │
│ Task: Obtain Legal Title Documentation                         │
│ Step 2 of 9 • Ijarah (Islamic Lease) - Qatar                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 💬 Ask me anything about this task...                          │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ User: Why do I need a title deed?                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🤖 AI: Great question! The title deed is required by       │ │
│ │    AAOIFI SS-9 (Ijarah) §3/1, which states:                │ │
│ │                                                             │ │
│ │    "The lessor must own the leased asset... ownership must │ │
│ │    be evidenced by legal documentation."                   │ │
│ │                                                             │ │
│ │    The title deed proves that your institution legally     │ │
│ │    owns the asset (Pearl Towers Unit A1) before leasing it │ │
│ │    to the customer. Without this, the Ijarah contract      │ │
│ │    would be Shariah non-compliant.                         │ │
│ │                                                             │ │
│ │    📚 Related Policy: AAOIFI SS-9 §3/1                     │ │
│ │    🔗 [View Full Standard]                                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ User: What if the title deed is in the bank's name?        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🤖 AI: If the title deed shows the bank (not your Islamic  │ │
│ │    finance division) as the owner, you have two options:   │ │
│ │                                                             │ │
│ │    1. Transfer title to the Islamic division (preferred)   │ │
│ │    2. Upload an internal asset allocation agreement        │ │
│ │                                                             │ │
│ │    AAOIFI SS-9 requires the Islamic entity to have legal   │ │
│ │    ownership or beneficial ownership rights.               │ │
│ │                                                             │ │
│ │    ⚠️ Note: Option 2 requires Shariah Board approval       │ │
│ │                                                             │ │
│ │    Need to flag this issue?                                │ │
│ │    [Flag for Shariah Review] [Continue with Option 1]     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [Type your question...]                                         │
│                                                                 │
│ 💡 Quick Questions:                                             │
│ • What documents are required?                                  │
│ • Can I approve without all documents?                          │
│ • Who reviews this after me?                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Expanded Task Card (AI Reasoning Visible)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 📋 Approve Payment Certificate Issuance (PAY-001)  🔴 CRITICAL   │ │
│                                                                      │
│ 📍 Payment Processing → Issue Payment Certificate                   │
│ 📊 Step 5 of 8    ⏰ Due: 2h 30m    👤 Compliance Officer          │
├──────────────────────────────────────────────────────────────────────┤
│ 💡 WHY THIS EXISTS:                                                 │
│ Validate that Payment Certificate settings comply with QFC Digital  │
│ Asset Regulations (non-transferable token) and Shariah requirements │
│ for Islamic Lease contracts. Final compliance check before issuance.│
│                                                                      │
│ 📜 Policy: QFC DAR 2024 Article 9, 12, 20 • AAOIFI SS-9 §4/4      │
├──────────────────────────────────────────────────────────────────────┤
│ 🤖 AI REASONING: [Click to Collapse ▲]                              │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ 🟣 AI VALIDATION CHECKS (6 steps)                            │   │
│ │                                                               │   │
│ │ 1. Check Regulations Article 9 (Not Means of Payment)        │   │
│ │    ├─ Check: Token cannot be transferred or sold             │   │
│ │    ├─ Result: ✅ PASS                                        │   │
│ │    └─ Evidence: Security controls enabled                    │   │
│ │                                                               │   │
│ │ 2. Check Regulations Article 12 (Generation Steps)           │   │
│ │    ├─ Check: Validation Cert → Blockchain → Issuance         │   │
│ │    ├─ Result: ✅ PASS                                        │   │
│ │    └─ Evidence: All steps completed in sequence              │   │
│ │                                                               │   │
│ │ 3. Validate Security Controls (Article 20)                   │   │
│ │    ├─ Check: Identity, Transfer lock, Emergency, Reversal    │   │
│ │    ├─ Result: ✅ PASS                                        │   │
│ │    └─ Evidence: All 4 controls configured                    │   │
│ │                                                               │   │
│ │ 4. Verify Investor Identity                                  │   │
│ │    ├─ Check: Buyer account has valid identity verification   │   │
│ │    ├─ Result: ✅ PASS                                        │   │
│ │    └─ Evidence: KYC completed 2025-01-10                     │   │
│ │                                                               │   │
│ │ 5. Check Rights Register                                     │   │
│ │    ├─ Check: Off-chain rights entry unencumbered             │   │
│ │    ├─ Result: ✅ PASS                                        │   │
│ │    └─ Evidence: Entry reserved rr://alpha/...                │   │
│ │                                                               │   │
│ │ 6. Validate Blockchain Record                                │   │
│ │    ├─ Check: Validation Cert hash matches blockchain         │   │
│ │    ├─ Result: ✅ PASS                                        │   │
│ │    └─ Evidence: Hash verified sha256:7b9f...                 │   │
│ └──────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│ 📄 EVIDENCE DOCUMENTS (5 items): [Click to Collapse ▲]             │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ 📄 validation-cert-pay-001.json                              │   │
│ │    Type: Validation Certificate                              │   │
│ │    [👁️ View] [⬇️ Download]                                  │   │
│ │                                                               │   │
│ │ 📄 blockchain-receipt-100432.json                            │   │
│ │    Type: Blockchain Receipt                                  │   │
│ │    [👁️ View] [⬇️ Download]                                  │   │
│ │                                                               │   │
│ │ 📄 token-settings-payment-receipt.json                       │   │
│ │    Type: Token Settings                                      │   │
│ │    [👁️ View] [⬇️ Download]                                  │   │
│ │                                                               │   │
│ │ 📄 investor-identity-buyer-001.pdf                           │   │
│ │    Type: Identity Verification Certificate                   │   │
│ │    [👁️ View] [⬇️ Download]                                  │   │
│ │                                                               │   │
│ │ 📄 rights-register-entry.json                                │   │
│ │    Type: Rights Register                                     │   │
│ │    [👁️ View] [⬇️ Download]                                  │   │
│ └──────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│ 🤖 AI ASSISTANT: [Ask AI About This Task →]                         │
├──────────────────────────────────────────────────────────────────────┤
│ [✅ Approve]  [❌ Reject]  [❓ Need More Info]                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Recurring Task Badge Example

```
┌─────────────────────────────────────────────────────────────────────┐
│ 📋 Daily SNCR Monitoring          🟡 MEDIUM    🔄 RECURRING        │ │
│                                                                      │
│ 📍 Compliance Monitoring                                            │
│ 📊 Daily Task    ⏰ Due: Today 17:00    👤 Shariah Compliance Ofc. │
│ 📅 Recurrence: Every day at 09:00 Asia/Qatar                       │
│ 🗂️ [View History: Last 30 days →]                                  │
├──────────────────────────────────────────────────────────────────────┤
│ 💡 WHY THIS EXISTS:                                                 │
│ IFSB-1 §6.1 requires daily monitoring of Shariah Non-Compliance     │
│ Risk. This daily check ensures no prohibited transactions occurred. │
│                                                                      │
│ 📜 Policy: IFSB-1 §6.1 • ISO 31000 (Risk Management)               │
├──────────────────────────────────────────────────────────────────────┤
│ 🤖 AI REASONING: [Click to Expand ▼]                                │
│   ✅ 0 SNCR incidents reported today                                │
│   ✅ All transaction logs reviewed                                  │
│   ✅ Register up to date                                            │
├──────────────────────────────────────────────────────────────────────┤
│ [✅ Mark Complete for Today]  [🤖 Ask AI Assistant]                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Simplified Dashboard Structure

### Old (Information Overload)
```
┌─────────────────────────────────────────────────┐
│ Overview Tab                                    │
│ ├─ 4 metric tiles                               │
│ ├─ Shariah compliance card                      │
│ ├─ Regulatory reporting card (3 regulators)     │
│ ├─ Islamic risk categories (3 types)            │
│ ├─ Active workflows (3 workflows)               │
│ └─ Recent activity (4 events)                   │
│                                                  │
│ ❌ Problem: What am I supposed to DO?           │
└─────────────────────────────────────────────────┘
```

### New (Action-Focused)
```
┌─────────────────────────────────────────────────┐
│ 🎯 My Tasks (PRIMARY VIEW)                      │
│                                                  │
│ 📊 Quick Stats                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│ │  12  │ │   3  │ │   2  │ │   7  │           │
│ │ Open │ │Crit. │ │Due   │ │Done  │           │
│ └──────┘ └──────┘ │Soon  │ │Today │           │
│                    └──────┘ └──────┘           │
│                                                  │
│ 🔴 CRITICAL (3 tasks)                           │
│ [Self-Contained Task Card 1]                    │
│ [Self-Contained Task Card 2]                    │
│ [Self-Contained Task Card 3]                    │
│                                                  │
│ 🟠 HIGH (5 tasks)                               │
│ [Collapsed - Click to Expand]                   │
│                                                  │
│ 🟡 MEDIUM (4 tasks)                             │
│ [Collapsed - Click to Expand]                   │
│                                                  │
│ ✅ Clear Action: Complete your tasks            │
└─────────────────────────────────────────────────┘
```

---

## Key Improvements Summary

| Aspect | Before (Current) | After (Proposed) |
|--------|-----------------|------------------|
| **Task Context** | Title + Description only | Why, Policy, Workflow, Step X of Y |
| **Validation Status** | None | AI pre-checks visible |
| **Documents** | Not shown | Inline with preview |
| **Help** | None | AI assistant per task |
| **Actions** | Generic status changes | Contextual (Approve/Upload/Review) |
| **Recurring Tasks** | Not supported | Daily/Weekly/Monthly/etc. |
| **Information Depth** | Minimal | Progressive disclosure |
| **Policy Links** | None | Cited with specific clauses |

---

## User Journey Comparison

### Before (Current)
```
1. User sees task title: "Obtain Legal Title Documentation"
2. ❓ User thinks: "Why do I need this?"
3. ❓ User thinks: "What documents exactly?"
4. ❓ User thinks: "Has anyone checked anything?"
5. 😟 User clicks generic "Mark Complete" (unsure if done correctly)
```

### After (Proposed)
```
1. User sees task title + context: "Obtain Legal Title Documentation"
   └─ Step 2 of 9 • Ijarah Workflow • High Priority • Due 5 days

2. ✅ User reads: "WHY THIS EXISTS: AAOIFI SS-9 §3/1 requires ownership proof"

3. ✅ User sees: "REQUIRED DOCUMENTS: 0 of 3 uploaded"
   ├─ Title Deed (Required)
   ├─ Purchase Invoice (Required)
   └─ Asset Registration (Optional)

4. ✅ User sees AI pre-checks:
   ├─ Asset identified ✓
   ├─ Purchase verified ✓
   └─ Awaiting: Title deed upload

5. 🤖 User has question: "What if title deed is in bank's name?"
   └─ Clicks "Ask AI Assistant"
   └─ Gets answer with policy citation

6. ✅ User uploads 3 documents

7. ✅ AI validates uploads: "All documents verified ✓"

8. ✅ User clicks "Mark Complete" (confident it's correct)
```

---

## Next Steps

1. **Get user feedback** on this mockup
2. **Prioritize phases**:
   - Phase 2.5: Task card redesign (3 days)
   - Phase 2.6: AI assistant integration (4-5 days)
   - Phase 2.7: Recurring workflows (2 days)
   - Phase 2.8: UI simplification (2 days)
3. **Create interactive prototype** (Figma or code)
4. **Begin implementation** based on priority

**Total Estimated Time**: 11-13 days for all phases
