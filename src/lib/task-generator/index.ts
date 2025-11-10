/**
 * TASK GENERATOR
 * ==============
 * Converts assembled workflows into executable tasks for Phase 3 dashboard
 *
 * Flow:
 * 1. Take assembled workflows
 * 2. Flatten all steps from all modules
 * 3. Convert each step → task with metadata
 * 4. Calculate due dates based on dependencies
 * 5. Assign priorities based on hard gates
 */

import type {
  Workflow,
  WorkflowStep,
  Task,
  TaskPriority,
  TaskStatus,
  TaskEvidence,
} from '@/lib/types/grc-demo-types'

// ============================================================================
// TASK GENERATION
// ============================================================================

export function generateTasksFromWorkflows(workflows: Workflow[]): Task[] {
  const tasks: Task[] = []
  const now = new Date()

  workflows.forEach((workflow) => {
    workflow.steps.forEach((step, index) => {
      // Calculate due date based on step duration and dependencies
      const dueDate = calculateDueDate(step, index, now)

      // Determine priority based on hard gates and constraints
      const priority = determinePriority(step)

      // Determine initial status (first task is in-progress, rest are not-started)
      const status: TaskStatus = index === 0 ? 'in-progress' : 'not-started'

      // Convert RequiredEvidence to TaskEvidence format
      const taskEvidence: TaskEvidence[] = step.requiredEvidence.map((evidence) => ({
        type: evidence.type,
        description: evidence.description,
        isRequired: evidence.isRequired,
        uploadedFiles: [],
      }))

      // Extract policy references from constraints
      const policyReference = step.policyConstraints
        .map((c) => c.source)
        .join(', ') || 'N/A'

      // Create task from step
      const task: Task = {
        id: `task-${workflow.id}-${step.id}`,
        workflowId: workflow.id,
        stepId: step.id,
        title: step.title,
        description: step.description,
        assignedRole: step.assignedRole,
        assignedTo: step.assignedTo,
        status,
        priority,
        dueDate: dueDate.toISOString(),
        createdAt: now.toISOString(),
        requiredEvidence: taskEvidence,
        requiresApproval: step.requiresApproval,
        approvalStatus: step.requiresApproval ? 'pending' : undefined,
        approver: step.approvalRole,
        policyReference,
        policyConstraints: step.policyConstraints.length > 0 ? step.policyConstraints : undefined,
        calendarExported: false,
      }

      tasks.push(task)
    })
  })

  return tasks
}

// ============================================================================
// HELPER: Calculate Due Date
// ============================================================================

function calculateDueDate(
  step: WorkflowStep,
  stepIndex: number,
  startDate: Date
): Date {
  // For first step, due date = startDate + step duration
  if (stepIndex === 0) {
    return addBusinessDays(startDate, step.durationDays)
  }

  // For subsequent steps, calculate based on dependencies
  // For now, use simple sequential calculation: index * avg 7 days
  const estimatedStartDays = stepIndex * 7 // Rough estimate
  return addBusinessDays(startDate, estimatedStartDays + step.durationDays)
}

// ============================================================================
// HELPER: Determine Priority
// ============================================================================

function determinePriority(step: WorkflowStep): TaskPriority {
  // Hard gates are always critical
  if (step.isHardGate) {
    return 'critical'
  }

  // Steps requiring approval are high priority
  if (step.requiresApproval) {
    return 'high'
  }

  // Steps with non-modifiable policy constraints are high priority
  const hasStrictConstraints = step.policyConstraints.some(
    (c) => c.cannotModify
  )
  if (hasStrictConstraints) {
    return 'high'
  }

  // Default to medium priority
  return 'medium'
}

// ============================================================================
// HELPER: Add Business Days
// ============================================================================

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let remainingDays = days

  while (remainingDays > 0) {
    result.setDate(result.getDate() + 1)
    const dayOfWeek = result.getDay()

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remainingDays--
    }
  }

  return result
}

// ============================================================================
// HELPER: Update Task Dependencies (Not used - Task type doesn't have dependencies)
// ============================================================================

export function updateTaskDependencies(tasks: Task[]): Task[] {
  // Task type doesn't have dependencies field, return as-is
  // Dependencies are tracked via workflow step relationships
  return tasks
}

// ============================================================================
// HELPER: Get Task Statistics
// ============================================================================

export function getTaskStatistics(tasks: Task[]) {
  return {
    total: tasks.length,
    notStarted: tasks.filter((t) => t.status === 'not-started').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    waitingApproval: tasks.filter((t) => t.status === 'waiting-approval').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
    critical: tasks.filter((t) => t.priority === 'critical').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length,
    requiresApproval: tasks.filter((t) => t.requiresApproval).length,
  }
}
