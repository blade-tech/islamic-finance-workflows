/**
 * GRC DEMO STORE
 * ==============
 * Zustand store for Islamic GRC Demo state management
 *
 * This store is ISOLATED from the main workflow store to prevent
 * interference with existing V1/V2 demos.
 *
 * PHASES:
 * 1. Configuration - User selects jurisdiction, product, accounting, etc.
 * 2. Workflow Review - User reviews and moderately customizes workflows
 * 3. Dashboard - Task management and execution tracking
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DealConfiguration,
  Workflow,
  Task,
  GRCDemoState,
  TaskStatus,
  CalendarExportOptions,
  Jurisdiction,
  ProductType,
} from '@/lib/types/grc-demo-types'

interface GRCDemoStore extends GRCDemoState {
  // Additional internal state
  isLoading: boolean
  error: string | null
}

export const useGRCDemoStore = create<GRCDemoStore>()(
  persist(
    (set, get) => ({
      // ====================================================================
      // INITIAL STATE
      // ====================================================================

      // Configuration state
      currentConfig: null,
      isConfiguring: true,

      // Workflow state
      currentWorkflows: [],
      isCustomizingWorkflows: false,

      // Task state
      tasks: [],
      activeTaskId: null,

      // UI state
      currentPhase: 'configuration',
      selectedJurisdiction: null,
      selectedProduct: null,

      // Internal state
      isLoading: false,
      error: null,

      // ====================================================================
      // CONFIGURATION ACTIONS
      // ====================================================================

      setConfiguration: (config: DealConfiguration) => {
        set({
          currentConfig: config,
          selectedJurisdiction: config.jurisdiction,
          selectedProduct: config.productType,
          error: null,
        })
      },

      updateConfiguration: (updates: Partial<DealConfiguration>) => {
        const currentConfig = get().currentConfig
        if (!currentConfig) {
          set({ error: 'No configuration found to update' })
          return
        }

        set({
          currentConfig: {
            ...currentConfig,
            ...updates,
          },
        })
      },

      generateWorkflows: async () => {
        const currentConfig = get().currentConfig
        if (!currentConfig) {
          set({ error: 'No configuration found to generate workflows' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          // TODO: Call workflow assembler to generate workflows
          // For now, this will be implemented when we create the assembler
          // const workflows = await assembleWorkflows(currentConfig)

          // Placeholder: Empty workflows array
          const workflows: Workflow[] = []

          set({
            currentWorkflows: workflows,
            currentConfig: {
              ...currentConfig,
              status: 'workflows-generated',
              generatedWorkflows: workflows,
            },
            currentPhase: 'workflow-review',
            isLoading: false,
          })
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to generate workflows',
            isLoading: false,
          })
        }
      },

      customizeWorkflow: (workflowId: string, updates: Partial<Workflow>) => {
        const workflows = get().currentWorkflows
        const workflowIndex = workflows.findIndex((w) => w.id === workflowId)

        if (workflowIndex === -1) {
          set({ error: `Workflow ${workflowId} not found` })
          return
        }

        const updatedWorkflows = [...workflows]
        updatedWorkflows[workflowIndex] = {
          ...updatedWorkflows[workflowIndex],
          ...updates,
          isCustomized: true,
        }

        set({
          currentWorkflows: updatedWorkflows,
          currentConfig: get().currentConfig
            ? {
                ...get().currentConfig!,
                status: 'workflows-customized',
                generatedWorkflows: updatedWorkflows,
              }
            : null,
        })
      },

      deployWorkflows: async () => {
        const currentConfig = get().currentConfig
        const workflows = get().currentWorkflows

        if (!currentConfig || workflows.length === 0) {
          set({ error: 'No workflows to deploy' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          // TODO: Deploy workflows and generate tasks
          // For now, this will be implemented when we create task generation logic
          // const tasks = await generateTasksFromWorkflows(workflows)

          // Placeholder: Empty tasks array
          const tasks: Task[] = []

          set({
            tasks,
            currentConfig: {
              ...currentConfig,
              status: 'deployed',
            },
            currentPhase: 'dashboard',
            isLoading: false,
          })
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to deploy workflows',
            isLoading: false,
          })
        }
      },

      // ====================================================================
      // TASK ACTIONS
      // ====================================================================

      updateTaskStatus: (taskId: string, status: TaskStatus) => {
        const tasks = get().tasks
        const taskIndex = tasks.findIndex((t) => t.id === taskId)

        if (taskIndex === -1) {
          set({ error: `Task ${taskId} not found` })
          return
        }

        const updatedTasks = [...tasks]
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          status,
        }

        set({ tasks: updatedTasks })
      },

      completeTask: (taskId: string, completedBy: string) => {
        const tasks = get().tasks
        const taskIndex = tasks.findIndex((t) => t.id === taskId)

        if (taskIndex === -1) {
          set({ error: `Task ${taskId} not found` })
          return
        }

        const updatedTasks = [...tasks]
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedBy,
        }

        set({ tasks: updatedTasks })
      },

      exportToCalendar: async (
        options: CalendarExportOptions
      ): Promise<string> => {
        const tasks = get().tasks

        if (tasks.length === 0) {
          throw new Error('No tasks to export')
        }

        set({ isLoading: true, error: null })

        try {
          // TODO: Implement calendar export logic
          // For now, return a placeholder URL
          const calendarUrl = '/exports/calendar.ics'

          set({ isLoading: false })
          return calendarUrl
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to export calendar',
            isLoading: false,
          })
          throw error
        }
      },

      // ====================================================================
      // NAVIGATION ACTIONS
      // ====================================================================

      goToPhase: (phase: GRCDemoStore['currentPhase']) => {
        // Validate phase transitions
        const currentPhase = get().currentPhase
        const currentConfig = get().currentConfig
        const workflows = get().currentWorkflows

        // Can't go to workflow-review without configuration
        if (phase === 'workflow-review' && !currentConfig) {
          set({ error: 'Complete configuration first' })
          return
        }

        // Can't go to dashboard without workflows
        if (phase === 'dashboard' && workflows.length === 0) {
          set({ error: 'Generate workflows first' })
          return
        }

        set({ currentPhase: phase, error: null })
      },

      reset: () => {
        set({
          currentConfig: null,
          isConfiguring: true,
          currentWorkflows: [],
          isCustomizingWorkflows: false,
          tasks: [],
          activeTaskId: null,
          currentPhase: 'configuration',
          selectedJurisdiction: null,
          selectedProduct: null,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'grc-demo-storage', // Unique name to avoid conflicts
      partialize: (state) => ({
        // Only persist configuration and workflows, not loading states
        currentConfig: state.currentConfig,
        currentWorkflows: state.currentWorkflows,
        tasks: state.tasks,
        currentPhase: state.currentPhase,
        selectedJurisdiction: state.selectedJurisdiction,
        selectedProduct: state.selectedProduct,
      }),
    }
  )
)

// ====================================================================
// SELECTOR HOOKS (for performance optimization)
// ====================================================================

export const useCurrentConfig = () =>
  useGRCDemoStore((state) => state.currentConfig)

export const useCurrentWorkflows = () =>
  useGRCDemoStore((state) => state.currentWorkflows)

export const useTasks = () => useGRCDemoStore((state) => state.tasks)

export const useCurrentPhase = () =>
  useGRCDemoStore((state) => state.currentPhase)

export const useIsLoading = () => useGRCDemoStore((state) => state.isLoading)

export const useError = () => useGRCDemoStore((state) => state.error)

// ====================================================================
// COMPUTED SELECTORS
// ====================================================================

export const useTasksByStatus = (status: TaskStatus) =>
  useGRCDemoStore((state) => state.tasks.filter((t) => t.status === status))

export const useTasksByRole = (role: string) =>
  useGRCDemoStore((state) =>
    state.tasks.filter((t) => t.assignedRole === role)
  )

export const useCriticalTasks = () =>
  useGRCDemoStore((state) =>
    state.tasks.filter((t) => t.priority === 'critical')
  )

export const useOverdueTasks = () =>
  useGRCDemoStore((state) => {
    const now = new Date()
    return state.tasks.filter((t) => {
      if (t.status === 'completed') return false
      const dueDate = new Date(t.dueDate)
      return dueDate < now
    })
  })
