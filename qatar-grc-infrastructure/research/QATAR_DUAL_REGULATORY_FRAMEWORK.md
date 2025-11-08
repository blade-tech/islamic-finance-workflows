# Qatar Dual Regulatory Framework for Islamic Finance

**Critical Discovery**: Qatar has TWO distinct financial regulators with separate Islamic finance requirements

---

## Regulatory Structure

### 1. QCB (Qatar Central Bank)
**Full Name**: Qatar Central Bank (formerly Qatar Monetary Agency)
**Scope**: Regulates financial institutions operating in mainland Qatar
**Applicability**:
- Domestic banks (Islamic and conventional)
- Islamic finance institutions in Qatar proper
- Insurance companies (Takaful)
- Exchange houses and other financial institutions

**Key Regulations**:
- QCB Islamic Banking Regulations
- QCB Shariah Governance Framework
- QCB Prudential Regulations for Islamic Banks
- QCB Guidelines on Internal Shariah Audit

### 2. QFCRA (Qatar Financial Centre Regulatory Authority)
**Full Name**: Qatar Financial Centre Regulatory Authority
**Scope**: Regulates financial institutions operating within the Qatar Financial Centre (QFC)
**Applicability**:
- QFC-licensed banks
- QFC-licensed investment firms
- QFC-licensed insurance firms
- Islamic windows within QFC entities

**Key Regulations**:
- QFCRA Islamic Finance Rules (IFR)
- QFCRA Governance & Controlled Functions Rules
- QFCRA Prudential Returns Rules

---

## Key Differences

| Aspect | QCB (Mainland Qatar) | QFCRA (QFC Zone) |
|--------|---------------------|------------------|
| **Jurisdiction** | Qatar proper | Special financial zone |
| **Legal System** | Qatar Civil Law | English Common Law |
| **SSB Requirements** | Detailed in QCB framework | Detailed in QFCRA IFR |
| **AAOIFI Adoption** | Mandatory accounting & governance | Selective reference |
| **Central Shariah Board** | Qatar Central Bank has Central Shariah Board | No central board for QFC |
| **Reporting** | To QCB | To QFCRA |
| **Capital Standards** | Basel III + QCB modifications | QFCRA prudential rules |

---

## Research Status

### QFCRA Research ✅ COMPLETE
- [x] Obligations catalog (28 obligations)
- [x] SSB governance model
- [x] Evidence standards
- [x] Reporting requirements
- [x] AAOIFI alignment

**Location**: `/qatar-grc-infrastructure/research/QFCRA_*.md`

### QCB Research ⏳ IN PROGRESS
- [ ] QCB obligations catalog
- [ ] QCB SSB governance framework
- [ ] QCB Central Shariah Board relationship
- [ ] QCB evidence standards
- [ ] QCB reporting requirements
- [ ] QCB AAOIFI alignment (expected to be more extensive than QFCRA)

**Target Location**: `/qatar-grc-infrastructure/research/QCB_*.md`

---

## Comprehensive Qatar Framework

For a **complete** Qatar GRC infrastructure, we need:

### Dual-Mode Support
The system must support:
1. **QCB Mode**: For entities regulated by Qatar Central Bank
2. **QFCRA Mode**: For entities in Qatar Financial Centre
3. **Hybrid Mode**: For groups with entities in both jurisdictions

### Unified Obligations Register
Structure:
```
Qatar Obligations Register
├── QCB Obligations (mainland Qatar)
├── QFCRA Obligations (QFC zone)
└── Common Obligations (both jurisdictions)
```

### Regulatory Selector
Users select their regulatory regime:
- "QCB - Qatar Central Bank (Mainland Qatar)"
- "QFCRA - Qatar Financial Centre"
- "Both - Group with QCB and QFCRA entities"

### Control Activation
Controls activate based on selected regulator:
- Some controls apply to both (AAOIFI-based)
- Some are QCB-specific
- Some are QFCRA-specific

---

## Next Steps

### Immediate: QCB Research
Launch comprehensive research on QCB Islamic finance requirements:
1. QCB Islamic Banking Regulations
2. QCB Shariah Governance Framework
3. QCB Central Shariah Board role and authority
4. QCB prudential requirements for Islamic banks
5. QCB reporting requirements
6. QCB Internal Shariah Audit Guidelines
7. QCB AAOIFI adoption (expected to be comprehensive)

### Integration: Unified Qatar Framework
After QCB research is complete:
1. Create unified Qatar obligations register
2. Map control activation rules for both regulators
3. Design regulatory selector mechanism
4. Document evidence requirements for each regulator
5. Create unified Qatar reporting calendar

### Replication: Multi-Jurisdiction Pattern
The Qatar dual-regulatory pattern informs our jurisdiction plugin design:
- Some jurisdictions may have multiple regulators (onshore/offshore)
- System must support regulatory regime selection
- Controls and obligations must be tagged by regulator

---

## Research Process Documentation

### Phase 1: QFCRA Research ✅
**Method**: Web search → Firecrawl scraping → Analysis → Documentation
**Tools Used**: Exa AI, Firecrawl, regulatory database searches
**Time**: ~2 hours
**Output**: 5 comprehensive documents

### Phase 2: QCB Research ⏳
**Status**: Launching now
**Expected Method**: Same as Phase 1
**Expected Time**: ~2-3 hours (QCB likely has more detailed requirements)
**Expected Output**: 5 comprehensive QCB documents + 1 comparative analysis

### Phase 3: Integration 🔜
**Task**: Merge QFCRA and QCB into unified Qatar framework
**Expected Output**: Unified obligations register, regulatory selector design

---

## Lessons Learned

### Critical Insight
**Never assume a jurisdiction has one regulator.** Many jurisdictions have:
- Onshore vs. offshore regulators
- Central bank vs. specialized financial authorities
- Federal vs. state/emirate regulators
- Conventional vs. Islamic-specific regulators

### Replication Checklist
When researching new jurisdictions (SAMA, BNM, CBB), always ask:
- [ ] Are there multiple regulatory bodies?
- [ ] Do onshore and offshore have different rules?
- [ ] Is there a central Shariah board vs. entity-level SSBs?
- [ ] Are there special zones with different regulations?
- [ ] Do regulators have overlapping or distinct mandates?

---

## Updated Qatar GRC Scope

### Original Scope (Incomplete)
- QFCRA Islamic Finance Rules only
- QFC entities only

### Corrected Scope (Complete)
- **QCB Islamic Finance Regulations** (mainland Qatar)
- **QFCRA Islamic Finance Rules** (QFC zone)
- Unified Qatar framework supporting both regulators
- Regulatory regime selector for implementation

---

**Status**: QFCRA research complete. QCB research launching now.

**Date Updated**: 2025-11-08

---

*This document will be updated as QCB research completes and integration proceeds.*
