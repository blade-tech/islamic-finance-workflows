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

      // Determine initial status (first task is pending, rest are not-started)
      const status = index === 0 ? 'pending' : 'not-started'

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
        requiredEvidence: step.requiredEvidence,
        policyConstraints: step.policyConstraints,
        dependencies: step.startAfter || [],
        estimatedDurationDays: step.durationDays,
        isHardGate: step.isHardGate,
        approvalRequired: step.requiresApproval,
        approvalRole: step.approvalRole,
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

  // Default to normal priority
  return 'normal'
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
// HELPER: Update Task Dependencies
// ============================================================================

export function updateTaskDependencies(tasks: Task[]): Task[] {
  // Build a map of stepId → taskId
  const stepToTaskMap = new Map<string, string>()
  tasks.forEach((task) => {
    stepToTaskMap.set(task.stepId, task.id)
  })

  // Update dependencies to use taskIds instead of stepIds
  return tasks.map((task) => {
    if (!task.dependencies || task.dependencies.length === 0) {
      return task
    }

    const taskDependencies = task.dependencies
      .map((stepId) => stepToTaskMap.get(stepId))
      .filter((id): id is string => id !== undefined)

    return {
      ...task,
      dependencies: taskDependencies,
    }
  })
}

// ============================================================================
// HELPER: Get Task Statistics
// ============================================================================

export function getTaskStatistics(tasks: Task[]) {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
    critical: tasks.filter((t) => t.priority === 'critical').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    normal: tasks.filter((t) => t.priority === 'normal').length,
    hardGates: tasks.filter((t) => t.isHardGate).length,
    requiresApproval: tasks.filter((t) => t.approvalRequired).length,
    totalEstimatedDays: tasks.reduce(
      (sum, t) => sum + (t.estimatedDurationDays || 0),
      0
    ),
  }
}
