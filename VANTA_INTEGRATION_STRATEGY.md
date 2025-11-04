# Vanta Feature Integration Strategy
## Non-Conflicting Implementation Plan for Islamic Finance Workflows

**Created**: 2025-11-04
**Purpose**: Integrate Vanta's multi-stakeholder collaboration patterns without disrupting Phase 4A Guardian integration work
**Status**: Phase 4A is 50% complete (7/14 tasks) - ACTIVE WORK IN PROGRESS

---

## Executive Summary

### The Challenge
We have two concurrent work streams:
1. **Phase 4A**: Guardian integration redesign (50% complete, 7/14 tasks done)
2. **Vanta Integration**: Multi-stakeholder collaboration patterns (not started)

**Goal**: Integrate Vanta's UX patterns WITHOUT creating merge conflicts or disrupting Phase 4A progress.

### The Solution
**Parallel Component Architecture** - Add Vanta features as NEW components/services that Phase 4A doesn't touch:
- ✅ **Safe to add**: New backend services, new API endpoints, new collaboration UI components
- ⚠️ **Requires coordination**: WorkflowContainer.tsx (Phase 4A actively modifying)
- ❌ **Avoid**: Step4ValidateCompliance (approval workflow overlap)

---

## Current State Analysis

### Phase 4A Progress (50% complete, ACTIVE)

**Completed Tasks (7/14)**:
- ✅ Task 1-2: Planning & documentation
- ✅ Task 3: Repository forked (`phase-3-docgen-complete` branch)
- ✅ Task 4-5: Step1SelectTemplate created and integrated
- ✅ Task 6: Step2ConfigureDetails with conditional forms
- ✅ Task 7: Step3TestWorkflow with sandbox testing

**Pending Tasks (7/14) - DO NOT CONFLICT WITH THESE**:
- ⏸️ Task 8: Step4ValidateCompliance (AAOIFI/IIFM checklists)
- ⏸️ Task 9: Step5LaunchExecute (blockchain launch)
- ⏸️ Task 10: Step6MonitorReview (dashboard)
- ⏸️ Task 11: Step7ImproveLearn (feedback loop)
- ⏸️ Task 12-13: Backend mock Guardian services
- ⏸️ Task 14: E2E testing

**Phase 4A Timeline**: Estimated 3-4 days full-time remaining (Tasks 8-14)

---

### Main Progress (70% complete)

**Completed Work**:
- ✅ Phase 1: Graphiti knowledge graph integration
- ✅ Phase 2: Methodology upload & digitization
- ✅ Phase 3: Methodology→Workflow integration
- ✅ Backend services: 4/6 complete (67%)
- ✅ API endpoints: 11/15 complete (73%)
- ✅ Templates: 5/5 complete (100%)

**Current Workflow Pipeline** (OPERATIONAL):
```
User selects methodology → Template generated → Workflow executed → Documents produced
```

**Frontend Components** (OPERATIONAL):
- Step1SourceConnection.tsx (backend monitoring)
- Step1SelectTemplate.tsx (template selection) - NEW in Phase 4A
- Step2ConfigureDetails.tsx (conditional forms) - NEW in Phase 4A
- Step3TestWorkflow.tsx (sandbox testing) - NEW in Phase 4A

---

## Vanta Features to Integrate

### From Part 9 (Multi-Stakeholder Collaboration Analysis)

**1. Owner + Subscribers Model**
- **Pattern**: 1 owner + up to 10 subscribers per contract
- **Features**: Ownership transfer, notification preferences, subscriber management
- **Implementation**: Backend service + API endpoints + frontend UI

**2. Approval Workflows**
- **Pattern**: Multi-step approval chains with parallel/sequential approvers
- **Features**: Approve/reject/request changes, reminder notifications, delegation
- **Implementation**: Backend approval engine + API + frontend approval UI
- ⚠️ **CONFLICT RISK**: Phase 4A Task 8 (Step4ValidateCompliance) also handles approvals

**3. Comment Threads & @Mentions**
- **Pattern**: Threaded comments at contract level and step level
- **Features**: @mentions with notifications, edit/delete, search/filter
- **Implementation**: Backend comment service + API + frontend comment UI

**4. Role-Based Dashboards**
- **Pattern**: Personalized dashboards by stakeholder role
- **Features**: Pending tasks, recent activity, metrics, quick actions
- **Implementation**: New dashboard pages + backend aggregation service

**5. Task Assignment & Notifications**
- **Pattern**: Explicit task assignment with due dates and reminders
- **Features**: Task list, overdue alerts, reassignment, completion tracking
- **Implementation**: Task service + notification service + frontend task UI

---

## Conflict Analysis

### Files Phase 4A is Actively Modifying

**Frontend Files (AVOID EDITING)**:
- `src/components/workflow/WorkflowContainer.tsx` - Integration point for Steps 1-7
- `src/components/workflow/steps/Step1SelectTemplate.tsx` - Template selection (Task 4-5 ✅)
- `src/components/workflow/steps/Step2ConfigureDetails.tsx` - Conditional forms (Task 6 ✅)
- `src/components/workflow/steps/Step3TestWorkflow.tsx` - Sandbox testing (Task 7 ✅)
- **PENDING (Tasks 8-11)**:
  - `src/components/workflow/steps/Step4ValidateCompliance.tsx` - NOT YET CREATED
  - `src/components/workflow/steps/Step5LaunchExecute.tsx` - NOT YET CREATED
  - `src/components/workflow/steps/Step6MonitorReview.tsx` - NOT YET CREATED
  - `src/components/workflow/steps/Step7ImproveLearn.tsx` - NOT YET CREATED

**Backend Files (AVOID EDITING)**:
- `backend/app/services/mock_guardian_service.py` - NOT YET CREATED (Task 12)
- `backend/scripts/pre_ingest_standards.py` - NOT YET CREATED (Task 13)
- `backend/app/api/workflows.py` - MAY BE MODIFIED for Guardian integration

**Coordination Required**:
- `src/components/workflow/WorkflowContainer.tsx` - Phase 4A actively adding Steps 4-7

---

### Overlap Analysis

**High Conflict Risk** ⚠️:
- **Approval Workflows**: Phase 4A Task 8 (Step4ValidateCompliance) handles AAOIFI/IIFM approvals
- **Solution**: Wait for Task 8 completion, then add Vanta approval patterns as enhancement

**Medium Conflict Risk** ⚠️:
- **WorkflowContainer.tsx**: Phase 4A adding Steps 4-7 to STEPS array
- **Solution**: Add collaboration UI as SEPARATE components, not integrated into WorkflowContainer

**Low/No Conflict Risk** ✅:
- **Comment Threads**: New feature, no overlap with Phase 4A
- **Role-Based Dashboards**: New pages, no overlap
- **Task Assignment**: New service, no overlap
- **Owner + Subscribers**: Backend enhancement, no frontend overlap

---

## Integration Architecture

### Parallel Component Strategy

**Principle**: Add Vanta features as NEW components/services that don't touch Phase 4A code.

```
┌─────────────────────────────────────────────────────────────┐
│                     Islamic Finance Platform                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────┐  ┌────────────────────────┐  │
│  │  Phase 4A Guardian Work  │  │  Vanta Integration     │  │
│  │  (50% complete, ACTIVE)  │  │  (Parallel, No Overlap)│  │
│  ├──────────────────────────┤  ├────────────────────────┤  │
│  │ - Step1-3 ✅             │  │ - Comment threads      │  │
│  │ - Step4-7 (pending)      │  │ - Owner + subscribers  │  │
│  │ - Mock Guardian service  │  │ - Task assignment      │  │
│  │ - AAOIFI pre-ingestion   │  │ - Role dashboards      │  │
│  │ - E2E testing            │  │ - Notification service │  │
│  └──────────────────────────┘  └────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Coordination Point (WorkflowContainer)      │  │
│  │  Phase 4A adds Steps 4-7 | Vanta adds collaboration  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase A: Safe Vanta Features (No Conflicts) - START NOW

**Timeline**: Can start immediately (parallel with Phase 4A)
**Estimated Effort**: 12-15 hours

#### A1. Backend Services (New Files)
- **File**: `backend/app/services/collaboration_service.py`
  - Owner + subscribers model
  - Subscriber management (add/remove)
  - Notification preferences
  - Ownership transfer
- **File**: `backend/app/services/comment_service.py`
  - Comment CRUD operations
  - Thread management
  - @mention parsing
  - Search/filter
- **File**: `backend/app/services/task_service.py`
  - Task CRUD operations
  - Task assignment
  - Due date tracking
  - Task completion
- **File**: `backend/app/services/notification_service.py`
  - Multi-channel notifications (email, in-app, webhook)
  - Notification preferences
  - Reminder scheduling
  - Notification history

**Estimated Time**: 6 hours

---

#### A2. Backend API Endpoints (New Files)
- **File**: `backend/app/api/collaboration.py`
  ```python
  # Endpoints:
  # POST /api/contracts/{id}/subscribers
  # DELETE /api/contracts/{id}/subscribers/{email}
  # PUT /api/contracts/{id}/owner
  # GET /api/contracts/{id}/subscribers
  ```
- **File**: `backend/app/api/comments.py`
  ```python
  # Endpoints:
  # POST /api/contracts/{id}/comments
  # GET /api/contracts/{id}/comments
  # PUT /api/comments/{id}
  # DELETE /api/comments/{id}
  # GET /api/comments/search
  ```
- **File**: `backend/app/api/tasks.py`
  ```python
  # Endpoints:
  # POST /api/contracts/{id}/tasks
  # GET /api/tasks (user's tasks)
  # PUT /api/tasks/{id}
  # DELETE /api/tasks/{id}
  # POST /api/tasks/{id}/complete
  ```
- **File**: `backend/app/api/notifications.py`
  ```python
  # Endpoints:
  # GET /api/notifications (user's notifications)
  # PUT /api/notifications/{id}/read
  # POST /api/notifications/preferences
  # GET /api/notifications/preferences
  ```

**Register in `backend/app/main.py`**:
```python
from app.api import collaboration, comments, tasks, notifications

app.include_router(collaboration.router, prefix="/api", tags=["collaboration"])
app.include_router(comments.router, prefix="/api", tags=["comments"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(notifications.router, prefix="/api", tags=["notifications"])
```

**Estimated Time**: 4 hours

---

#### A3. Frontend Components (New Files)
- **File**: `src/components/collaboration/SubscriberList.tsx`
  - Display subscribers
  - Add/remove subscribers
  - Show notification preferences
- **File**: `src/components/collaboration/CommentThread.tsx`
  - Display comment threads
  - Add new comments
  - Edit/delete own comments
  - @mention suggestions
- **File**: `src/components/collaboration/TaskList.tsx`
  - Display user's tasks
  - Task completion checkboxes
  - Due date indicators
  - Overdue alerts
- **File**: `src/components/collaboration/NotificationBell.tsx`
  - Notification icon with badge
  - Dropdown list of recent notifications
  - Mark as read
  - Link to notification source
- **File**: `src/app/dashboard/[role]/page.tsx`
  - Role-based dashboard pages
  - Pending tasks widget
  - Recent activity feed
  - Metrics cards
  - Quick actions

**Estimated Time**: 5 hours

---

#### A4. Database Models (New Models)
- **File**: `backend/app/models.py` (ADD new models, don't modify existing)
  ```python
  class Subscriber(BaseModel):
      contract_id: str
      user_email: str
      notification_preferences: NotificationPreferences
      added_at: datetime
      added_by: str

  class Comment(BaseModel):
      comment_id: str
      contract_id: str
      step_number: Optional[int]
      author_email: str
      content: str
      mentions: List[str]
      created_at: datetime
      updated_at: Optional[datetime]

  class Task(BaseModel):
      task_id: str
      contract_id: str
      assignee_email: str
      assigner_email: str
      title: str
      description: str
      due_date: Optional[datetime]
      completed: bool
      completed_at: Optional[datetime]

  class Notification(BaseModel):
      notification_id: str
      recipient_email: str
      type: NotificationType
      title: str
      message: str
      source_contract_id: str
      source_task_id: Optional[str]
      read: bool
      created_at: datetime
  ```

**Estimated Time**: 1 hour

**TOTAL PHASE A**: 16 hours (can be done in parallel with Phase 4A)

---

### Phase B: Coordination with Phase 4A - WAIT FOR TASK 8 COMPLETION

**Timeline**: Start after Phase 4A Task 8 (Step4ValidateCompliance) is complete
**Estimated Effort**: 8-10 hours

#### B1. Approval Workflow Enhancement
- **Wait for**: Phase 4A Task 8 completion (Step4ValidateCompliance)
- **Then add**: Vanta approval patterns as enhancement layer
  - Approval delegation
  - Parallel approvers
  - Reminder notifications
  - Approval history

**File to enhance**: `backend/app/services/workflow_engine.py`
- Add approval delegation logic
- Add reminder scheduling
- Add approval history tracking

**Estimated Time**: 4 hours

---

#### B2. WorkflowContainer Integration
- **Wait for**: Phase 4A Tasks 8-11 completion (Steps 4-7 added to WorkflowContainer)
- **Then add**: Collaboration UI elements to WorkflowContainer
  - Comment thread sidebar
  - Subscriber list in header
  - Task list panel
  - Notification bell

**File to enhance**: `src/components/workflow/WorkflowContainer.tsx`
- Add collaboration UI components (non-invasive)
- Add state management for comments/tasks/notifications

**Estimated Time**: 4 hours

**TOTAL PHASE B**: 8 hours (starts after Phase 4A complete)

---

### Phase C: Advanced Features - POST-PHASE 4A

**Timeline**: Start after Phase 4A fully complete (Tasks 1-14 done)
**Estimated Effort**: 12-15 hours

#### C1. Real-time Collaboration
- **WebSocket/SSE integration** for live updates
- Real-time comment updates
- Real-time task updates
- Real-time notification delivery

**Estimated Time**: 6 hours

---

#### C2. Enhanced Dashboards
- **Advanced role-based dashboards**
- Portfolio metrics aggregation
- Custom dashboard widgets
- Export/report generation

**Estimated Time**: 4 hours

---

#### C3. Integration Testing
- **E2E tests for collaboration features**
- Comment thread tests
- Task assignment tests
- Notification delivery tests
- Multi-user scenarios

**Estimated Time**: 3 hours

**TOTAL PHASE C**: 13 hours

---

## Implementation Timeline

### Option 1: Conservative (Wait for Phase 4A)
```
Week 1: Phase 4A completes (Tasks 8-14)
Week 2: Phase A + Phase B (Vanta integration)
Week 3: Phase C (advanced features)
```

**Pros**: Zero conflict risk, clean integration
**Cons**: Delays Vanta features by 1 week

---

### Option 2: Parallel (Recommended)
```
Week 1 (Days 1-4):
  - Phase 4A: Tasks 8-11 (Steps 4-7) ← Phase 4A team
  - Phase A: A1-A4 (Vanta safe features) ← Vanta team

Week 1 (Days 5-7):
  - Phase 4A: Tasks 12-14 (backend mocks, testing)
  - Phase B: Coordination work (approval + container integration)

Week 2:
  - Phase C: Advanced features
  - E2E testing across both work streams
```

**Pros**: Faster delivery (1 week total), efficient resource use
**Cons**: Requires coordination, merge risk if not careful

---

### Option 3: Aggressive (Maximum Parallelism)
```
Week 1 (All at once):
  - Phase 4A: Tasks 8-14 (all remaining work)
  - Phase A: A1-A4 (all safe features)
  - Phase B: Coordination work (coordinate on WorkflowContainer daily)

Week 2:
  - Phase C: Advanced features
  - Integration testing
```

**Pros**: Fastest delivery (1 week total)
**Cons**: High merge conflict risk, requires daily coordination

---

## Recommended Approach: Option 2 (Parallel)

**Rationale**:
- Balances speed with safety
- Phase A work is truly non-conflicting (new files only)
- Phase B coordination happens AFTER Phase 4A creates Step4-7 components
- Allows Vanta team to work independently for most of Week 1

**Coordination Points**:
1. **Day 1**: Phase 4A team shares planned file changes for Tasks 8-11
2. **Day 3**: Mid-week sync to ensure no conflicts
3. **Day 5**: Phase 4A completes Tasks 8-11, hands off WorkflowContainer for Phase B
4. **Day 7**: Joint testing of integrated system

---

## File-Level Safe Zones

### ✅ SAFE TO CREATE (No Phase 4A Conflict)

**Backend**:
- `backend/app/services/collaboration_service.py` ← NEW
- `backend/app/services/comment_service.py` ← NEW
- `backend/app/services/task_service.py` ← NEW
- `backend/app/services/notification_service.py` ← NEW
- `backend/app/api/collaboration.py` ← NEW
- `backend/app/api/comments.py` ← NEW
- `backend/app/api/tasks.py` ← NEW
- `backend/app/api/notifications.py` ← NEW

**Frontend**:
- `src/components/collaboration/SubscriberList.tsx` ← NEW
- `src/components/collaboration/CommentThread.tsx` ← NEW
- `src/components/collaboration/TaskList.tsx` ← NEW
- `src/components/collaboration/NotificationBell.tsx` ← NEW
- `src/app/dashboard/shariah-advisor/page.tsx` ← NEW
- `src/app/dashboard/business-team/page.tsx` ← NEW
- `src/app/dashboard/finance-team/page.tsx` ← NEW
- `src/app/dashboard/legal-counsel/page.tsx` ← NEW
- `src/app/dashboard/compliance-manager/page.tsx` ← NEW

**Database**:
- Add NEW models to `backend/app/models.py` (don't modify existing)

---

### ⚠️ REQUIRES COORDINATION (Phase 4A Active)

**Backend**:
- `backend/app/main.py` - Adding new router imports (coordinate)
- `backend/app/services/workflow_engine.py` - MAY be modified by Phase 4A Task 12

**Frontend**:
- `src/components/workflow/WorkflowContainer.tsx` - Phase 4A actively adding Steps 4-7
- `src/lib/store.ts` - MAY need updates for collaboration state

---

### ❌ DO NOT TOUCH (Phase 4A Exclusive)

**Frontend (Phase 4A owned)**:
- `src/components/workflow/steps/Step1SelectTemplate.tsx` - ✅ Phase 4A complete
- `src/components/workflow/steps/Step2ConfigureDetails.tsx` - ✅ Phase 4A complete
- `src/components/workflow/steps/Step3TestWorkflow.tsx` - ✅ Phase 4A complete
- `src/components/workflow/steps/Step4ValidateCompliance.tsx` - ⏸️ Phase 4A Task 8
- `src/components/workflow/steps/Step5LaunchExecute.tsx` - ⏸️ Phase 4A Task 9
- `src/components/workflow/steps/Step6MonitorReview.tsx` - ⏸️ Phase 4A Task 10
- `src/components/workflow/steps/Step7ImproveLearn.tsx` - ⏸️ Phase 4A Task 11

**Backend (Phase 4A owned)**:
- `backend/app/services/mock_guardian_service.py` - ⏸️ Phase 4A Task 12
- `backend/scripts/pre_ingest_standards.py` - ⏸️ Phase 4A Task 13

---

## Risk Mitigation

### High Risk: Approval Workflow Overlap

**Risk**: Phase 4A Task 8 (Step4ValidateCompliance) implements AAOIFI approval flow. Vanta also has approval patterns.

**Mitigation**:
1. **Phase A**: Skip approval workflow implementation
2. **Phase B**: After Task 8 complete, review Phase 4A's approval implementation
3. **Phase B**: Add Vanta approval enhancements (delegation, reminders) as layer on top

---

### Medium Risk: WorkflowContainer Merge Conflicts

**Risk**: Phase 4A adding Steps 4-7 to WorkflowContainer. Vanta adding collaboration UI to same file.

**Mitigation**:
1. **Phase A**: Don't touch WorkflowContainer
2. **Phase B**: After Phase 4A Tasks 8-11 complete, add collaboration UI as separate components
3. **Strategy**: Use composition (new components) instead of modification (editing existing JSX)

**Example Safe Pattern**:
```tsx
// Phase 4A adds Steps 4-7 to STEPS array
const STEPS = [
  Step1SourceConnection,
  Step1SelectTemplate,
  Step2ConfigureDetails,
  Step3TestWorkflow,
  Step4ValidateCompliance, // ← Phase 4A
  Step5LaunchExecute,      // ← Phase 4A
  Step6MonitorReview,      // ← Phase 4A
  Step7ImproveLearn        // ← Phase 4A
];

// Vanta adds collaboration UI as wrapper (Phase B)
return (
  <CollaborationLayout contractId={contractId}>
    {/* Phase 4A's workflow steps render here */}
    <div className="workflow-steps">
      {/* existing Phase 4A code */}
    </div>
    {/* Vanta's collaboration UI renders as sidebar */}
    <CollaborationSidebar contractId={contractId} />
  </CollaborationLayout>
);
```

---

### Low Risk: State Management Conflicts

**Risk**: Both teams may need to update Zustand store (`src/lib/store.ts`).

**Mitigation**:
1. **Phase A**: Create separate collaboration state slice
2. **Pattern**: Use Zustand's `createSlice` for clean separation
3. **Coordinate**: Share state structure early

**Example Safe Pattern**:
```typescript
// Phase 4A's slice (existing)
interface WorkflowState {
  currentStep: number;
  executionLog: string[];
  // ... Phase 4A state
}

// Vanta's slice (Phase A) - separate namespace
interface CollaborationState {
  comments: Comment[];
  tasks: Task[];
  notifications: Notification[];
  subscribers: Subscriber[];
}

// Combined store
export const useStore = create<WorkflowState & CollaborationState>((set) => ({
  // Phase 4A state and actions
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),

  // Vanta state and actions (Phase A)
  comments: [],
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
}));
```

---

## Success Criteria

### Phase A Success (Safe Vanta Features)
- [ ] All backend collaboration services implemented (4 services)
- [ ] All API endpoints functional (4 routers, 15+ endpoints)
- [ ] All frontend components render correctly (5+ components)
- [ ] Database models defined and integrated
- [ ] Zero conflicts with Phase 4A code
- [ ] Unit tests pass for all new services

---

### Phase B Success (Coordination)
- [ ] Approval workflow enhanced with Vanta patterns
- [ ] WorkflowContainer integrates collaboration UI without breaking Phase 4A steps
- [ ] Merge conflicts resolved (if any)
- [ ] Integration tests pass

---

### Phase C Success (Advanced Features)
- [ ] Real-time collaboration functional (WebSocket/SSE)
- [ ] Role-based dashboards operational for all 5 roles
- [ ] E2E tests pass for collaboration scenarios
- [ ] Performance benchmarks met (<3s page load)

---

### Overall Success Criteria
- [ ] Phase 4A completes all 14 tasks without delays from Vanta work
- [ ] Vanta features integrated within 1-2 weeks
- [ ] Zero production bugs from merge conflicts
- [ ] User testing confirms improved collaboration UX

---

## Communication Plan

### Daily Standups (If Parallel Approach)
- **Time**: 15 minutes daily
- **Attendees**: Phase 4A lead + Vanta lead
- **Topics**:
  - What files are you working on today?
  - Any merge conflicts detected?
  - Coordination needs for tomorrow?

---

### Coordination Checkpoints
1. **Day 1**: Kickoff meeting to review this strategy
2. **Day 3**: Mid-week sync to catch early conflicts
3. **Day 5**: Phase 4A hands off WorkflowContainer
4. **Day 7**: Joint integration testing

---

### Merge Strategy
- **Branch Strategy**: Create `vanta-integration` branch for Phase A work
- **Daily Rebases**: Rebase `vanta-integration` on `main` daily to catch conflicts early
- **Phase B Merge**: Merge after Phase 4A Tasks 8-11 complete

---

## Conclusion

### Recommended Path Forward

**Option 2 (Parallel)** is recommended because:
1. ✅ Phase A work (16 hours) is 100% non-conflicting (new files only)
2. ✅ Phase B work (8 hours) waits for Phase 4A Task 8 completion
3. ✅ Delivers Vanta features in 1 week with minimal conflict risk
4. ✅ Allows efficient resource allocation (2 teams working concurrently)

### Implementation Order
1. **Immediate**: Start Phase A (collaboration services, API endpoints, frontend components)
2. **Day 5-7**: Phase B coordination work (after Phase 4A Steps 4-7 complete)
3. **Week 2**: Phase C advanced features

### Key Success Factors
- **File-level discipline**: Stick to safe zones defined in this document
- **Daily communication**: 15-minute standups if parallel approach
- **Composition over modification**: Use new components instead of editing existing ones
- **Test early, test often**: Integration tests after each phase

---

## Appendix: Quick Reference

### Files Phase 4A Owns (DO NOT TOUCH)
```
src/components/workflow/steps/Step4ValidateCompliance.tsx
src/components/workflow/steps/Step5LaunchExecute.tsx
src/components/workflow/steps/Step6MonitorReview.tsx
src/components/workflow/steps/Step7ImproveLearn.tsx
backend/app/services/mock_guardian_service.py
backend/scripts/pre_ingest_standards.py
```

### Files Vanta Can Create (SAFE)
```
backend/app/services/collaboration_service.py
backend/app/services/comment_service.py
backend/app/services/task_service.py
backend/app/services/notification_service.py
backend/app/api/collaboration.py
backend/app/api/comments.py
backend/app/api/tasks.py
backend/app/api/notifications.py
src/components/collaboration/* (all files)
src/app/dashboard/* (all role pages)
```

### Coordination Required
```
src/components/workflow/WorkflowContainer.tsx (Phase B only)
backend/app/main.py (router registration)
src/lib/store.ts (collaboration state slice)
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-04
**Next Review**: After Phase 4A Task 8 completion
