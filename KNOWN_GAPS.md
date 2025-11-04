# Known Gaps & Future Enhancements

## 1. Participant Email Management (Step 7)

**Status**: Documented - Not Yet Implemented
**Priority**: Medium
**Discovered**: 2025-11-04

### Issue
Users currently cannot enter participant emails in the workflow. Participant data in Step 10 (Live Execution) is hardcoded with mock values.

### Current Behavior
- Step 10 displays hardcoded participants:
  - Issuer: ABC Islamic Bank (issuer@abcbank.com)
  - Shariah Advisor: Dr. Ahmed Al-Mansouri (ahmed@shariahboard.com)
  - Auditor: XYZ Audit Firm (audit@xyzaudit.com)
  - Trustee: DEF Trust Services (trustee@deftrust.com)

### Expected Behavior
- Step 7 (Configure Details) should include a "Workflow Participants" section where users can:
  - Add participants with role, name, and email
  - Edit participant information
  - Remove participants
  - See validation for required participants based on deal type

### Implementation Plan

**1. Type Definitions** (✅ COMPLETED)
- Added `WorkflowParticipant` interface to `src/lib/types.ts`:
  ```typescript
  export interface WorkflowParticipant {
    id: string
    role: string
    name: string
    email: string
    did?: string
    status: 'invited' | 'onboarded' | 'active'
  }
  ```
- Added `participants: WorkflowParticipant[]` to `WorkflowExecution`

**2. Store Updates** (TODO)
- File: `src/lib/store.ts`
- Initialize `participants: []` in `initializeExecution()`
- Add store methods:
  ```typescript
  addParticipant: (participant: Omit<WorkflowParticipant, 'id' | 'status'>) => void
  updateParticipant: (participantId: string, updates: Partial<WorkflowParticipant>) => void
  removeParticipant: (participantId: string) => void
  ```

**3. Step 7 UI Enhancement** (TODO)
- File: `src/components/workflow/steps/Step7ConfigureDetails.tsx`
- Add "Workflow Participants" card section after document uploads
- Components needed:
  - Role dropdown (pre-populated with common roles)
  - Name text input
  - Email text input with validation
  - "Add Participant" button
  - Participant list with edit/remove actions
  - Minimum participant validation

**Common Roles**:
- Issuer (required)
- Shariah Advisor (required for Islamic finance)
- Auditor (required for regulated transactions)
- Trustee (required for securitizations)
- Asset Manager (optional)
- Legal Counsel (optional)
- Regulatory Authority (optional for certain jurisdictions)
- Credit Rating Agency (optional)

**4. Step 10 Integration** (TODO)
- File: `src/components/workflow/steps/Step10LiveExecution.tsx`
- Replace hardcoded `useState` participants with:
  ```typescript
  const participants = execution?.participants || []
  ```
- Remove mock participant initialization
- Add validation: require at least 1 participant before deployment

### User Story
```
As a workflow user
I want to specify who will participate in the Guardian workflow
So that the correct people receive DID credentials and can sign off on their parts of the process
```

### Acceptance Criteria
- [ ] User can add participants with role, name, email in Step 7
- [ ] User can edit participant information
- [ ] User can remove participants
- [ ] Email validation enforced (RFC 5322 format)
- [ ] At least one participant required (Issuer role recommended)
- [ ] Participants persist in store and appear in Step 10
- [ ] Step 10 uses store participants instead of hardcoded values
- [ ] Demo configuration loads example participants

### Technical Notes
- Use `crypto.randomUUID()` for participant IDs
- Store participants in Zustand state (no backend persistence yet)
- Consider role-based validation (e.g., Sukuk requires Trustee + Shariah Advisor)
- Future: Auto-suggest participants from organization directory
- Future: Validate participant emails via backend before deployment

---

## Future Enhancements (Not Blocking)

### 2. Real Guardian Integration
- Currently using mock deployment simulation
- Need real Guardian API integration for production
- Requires Guardian node setup and configuration

### 3. AI Document Extraction
- Step 7 mentions "AI-powered extraction coming soon"
- Would auto-populate form fields from uploaded documents
- Requires document parsing backend service

### 4. Citation Verification
- Removed from 10-step workflow (was Step 11 in 12-step)
- May be re-added as optional review step in future
- Useful for audit trails and regulatory compliance

### 5. Outcome & Download
- Removed from 10-step workflow (was Step 12)
- May be re-added after Guardian execution completes
- Would show final executed documents and blockchain proof
