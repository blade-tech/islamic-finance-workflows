/**
 * ZUSTAND GLOBAL STATE STORE
 * =========================
 * This is the single source of truth for the entire workflow execution state.
 *
 * WHY ZUSTAND:
 * - Simple API, no boilerplate
 * - TypeScript-first design
 * - No React Context limitations
 * - Easy to test and debug
 * - Middleware support for persistence
 *
 * STATE STRUCTURE:
 * - execution: Current workflow execution state (null if not started)
 * - errors: Array of error states to display in UI
 * - loading: Loading states for different operations
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  WorkflowExecution,
  Methodology,
  UploadedDocument,
  LogEntry,
  Citation,
  Learning,
  ErrorState,
  InterruptMessage,
  GeneratedFile,
  ShariahStructure,
  Jurisdiction,
  AccountingFramework,
  ImpactMetrics,
  TakafulOverlay,
  DealConfiguration,
} from './types'
import type { BackendServicesStatus, ServiceName, ServiceStatus } from './service-types'
import { backendClient } from './backend-client'
import { validateDealConfiguration } from './validation'
import { WAKALA } from '@/data/shariah-structures'
import { QATAR_QFC } from '@/data/jurisdictions'
import { AAOIFI } from '@/data/accounting-frameworks'
import { QFC_SUSTAINABLE, ISLAMIC_SOCIAL_FINANCE } from '@/data/impact-metrics'

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface WorkflowStore {
  // -------------------------
  // STATE
  // -------------------------

  /** Current workflow execution (null if not started) */
  execution: WorkflowExecution | null

  /** Visible errors to display in UI */
  errors: ErrorState[]

  /** Loading states */
  loading: {
    graphitiConnection: boolean
    documentUpload: boolean
    executionRunning: boolean
    citationVerification: boolean
    documentGeneration: boolean
    learningExtraction: boolean
  }

  /** Backend services status */
  servicesStatus: BackendServicesStatus | null

  /** Developer mode settings */
  developerMode: boolean
  disableAllMocks: boolean
  showApiLogs: boolean

  // -------------------------
  // ACTIONS
  // -------------------------

  /** Initialize backend services (discovery + health check) */
  initializeServices: () => Promise<void>

  /** Update status of a specific service */
  updateServiceStatus: (service: ServiceName, status: ServiceStatus) => void

  /** Refresh all service health checks */
  refreshServices: () => Promise<void>

  /** Initialize a new workflow execution */
  initializeExecution: (userId: string, templateId?: string) => void

  /** Update execution field */
  updateExecution: (updates: Partial<WorkflowExecution>) => void

  /** Move to next step */
  nextStep: () => void

  /** Move to previous step */
  previousStep: () => void

  /** Set Graphiti connection status */
  setGraphitiConnected: (connected: boolean) => void

  /** Add uploaded document */
  addDocument: (type: 'aaoifi' | 'context', document: UploadedDocument) => void

  /** Remove uploaded document */
  removeDocument: (type: 'aaoifi' | 'context', documentId: string) => void

  /** Set selected methodologies (multi-select) */
  setSelectedMethodologies: (methodologies: Methodology[]) => void

  /** Add single methodology to selection */
  addMethodology: (methodology: Methodology) => void

  /** Remove single methodology from selection */
  removeMethodology: (methodologyId: string) => void

  // -------------------------
  // 4-Component Selection Actions
  // -------------------------

  /** Set selected Shariah structure (Component 1) */
  setShariahStructure: (structure: ShariahStructure | null) => void

  /** Set whether to securitize as Sukuk (true) or use direct financing (false) */
  setIsSecuritized: (isSecuritized: boolean) => void

  /** Set selected jurisdiction (Component 2) */
  setJurisdiction: (jurisdiction: Jurisdiction | null) => void

  /** Set selected accounting framework (Component 3) */
  setAccounting: (accounting: AccountingFramework | null) => void

  /** Toggle impact metric in selection (add if not present, remove if present) */
  toggleImpact: (impact: ImpactMetrics) => void

  /** Add impact metric to selection */
  addImpact: (impact: ImpactMetrics) => void

  /** Remove impact metric from selection */
  removeImpact: (impactId: string) => void

  /** Clear all selected impacts */
  clearImpacts: () => void
  /** Set impacts array (V2 workflow extension) */
  setImpacts: (impacts: ImpactMetrics[]) => void

  /** Set Takaful overlay configuration */
  setTakaful: (takaful: TakafulOverlay) => void

  /** Build and validate deal configuration from 4 components */
  buildDealConfiguration: () => DealConfiguration | null

  /** Load demo configuration (QIIB Oryx Sukuk) - pre-populates all 4 components */
  loadDemoConfiguration: () => void

  // -------------------------
  // V2 Workflow Actions (Transaction Scale, Governance, etc.)
  // -------------------------

  /** Set transaction scale (V2 workflow extension) */
  setTransactionScale: (scale: NonNullable<WorkflowExecution['transactionScale']>) => void

  /** Set governance configuration (V2 workflow extension) */
  setGovernance: (governance: NonNullable<WorkflowExecution['governance']>) => void

  /** Set cross-border flag (V2 workflow extension) */
  setCrossBorder: (crossBorder: boolean) => void

  /** Set additional jurisdictions (V2 workflow extension) */
  setAdditionalJurisdictions: (jurisdictions: Jurisdiction[]) => void

  /** Set reporting frequency (V2 workflow extension) */
  setReportingFrequency: (frequency: 'quarterly' | 'semi-annual' | 'annual') => void

  /** Set workflow mode and navigate to appropriate step (Option C modular workflows) */
  setWorkflowMode: (mode: 'full' | 'impact-only' | 'compliance-check' | 'tokenization-only', startStep: number) => void

  /** Add context text */
  setContextText: (text: string) => void

  /** Add user notes for a step */
  addUserNote: (stepId: string, note: string) => void

  /** Add execution log entry */
  addLogEntry: (entry: LogEntry) => void

  /** Add interrupt message */
  addInterruptMessage: (message: InterruptMessage) => void

  /** Add citation */
  addCitation: (citation: Citation) => void

  /** Update citation approval */
  updateCitationApproval: (citationId: string, approved: boolean, rejectionReason?: string) => void

  /** Set final document */
  setFinalDocument: (document: string) => void

  /** Add generated file */
  addGeneratedFile: (file: GeneratedFile) => void

  /** Add extracted learning */
  addLearning: (learning: Learning) => void

  /** Apply learning to template */
  applyLearning: (learningId: string) => void

  /** Set user feedback */
  setUserFeedback: (feedback: string) => void

  /** Complete execution */
  completeExecution: () => void

  /** Fail execution */
  failExecution: (reason: string) => void

  /** Add error to display in UI */
  addError: (error: ErrorState) => void

  /** Remove error from UI */
  removeError: (errorId: string) => void

  /** Clear all errors */
  clearErrors: () => void

  /** Set loading state */
  setLoading: (key: keyof WorkflowStore['loading'], value: boolean) => void

  /** Set developer mode */
  setDeveloperMode: (enabled: boolean) => void

  /** Set disable all mocks */
  setDisableAllMocks: (enabled: boolean) => void

  /** Set show API logs */
  setShowApiLogs: (enabled: boolean) => void

  /** Reset entire store (for testing/new workflow) */
  reset: () => void
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialLoading = {
  graphitiConnection: false,
  documentUpload: false,
  templateSelection: false,
  executionRunning: false,
  citationVerification: false,
  documentGeneration: false,
  learningExtraction: false,
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    (set, get) => ({
      // -------------------------
      // INITIAL STATE
      // -------------------------
      execution: null,
      errors: [],
      loading: initialLoading,
      servicesStatus: null,
      developerMode: false,
      disableAllMocks: false,
      showApiLogs: false,

      // -------------------------
      // ACTIONS: BACKEND SERVICES
      // -------------------------

      initializeServices: async () => {
        try {
          await backendClient.init()
          const status = backendClient.getAllServicesStatus()
          set({ servicesStatus: status })

          // Subscribe to status changes
          backendClient.on('status-change', (data: { service: ServiceName; newStatus: ServiceStatus }) => {
            const { servicesStatus } = get()
            if (servicesStatus) {
              const updatedStatus = {
                ...servicesStatus,
                [data.service]: {
                  ...servicesStatus[data.service],
                  status: data.newStatus,
                  lastChecked: new Date(),
                },
              }
              set({ servicesStatus: updatedStatus })
            }
          })
        } catch (error) {
          console.error('[Store] Failed to initialize services:', error)
        }
      },

      updateServiceStatus: (service: ServiceName, status: ServiceStatus) => {
        const { servicesStatus } = get()
        if (!servicesStatus) return

        const updatedStatus = {
          ...servicesStatus,
          [service]: {
            ...servicesStatus[service],
            status,
            lastChecked: new Date(),
          },
        }
        set({ servicesStatus: updatedStatus })
      },

      refreshServices: async () => {
        try {
          const status = await backendClient.checkHealth()
          set({ servicesStatus: status })
        } catch (error) {
          console.error('[Store] Failed to refresh services:', error)
        }
      },

      // -------------------------
      // ACTIONS: WORKFLOW EXECUTION
      // -------------------------

      initializeExecution: (userId: string, templateId?: string) => {
        const execution: WorkflowExecution = {
          id: `exec_${Date.now()}`,
          workflowTemplateId: templateId || '',
          userId,
          status: 'not_started',
          currentStepIndex: 0,
          graphitiConnected: false,
          aaaoifiDocuments: [],
          // New 4-component selection fields
          selectedShariahStructure: null,
          isSecuritized: false,                // Default to direct financing (not Sukuk)
          selectedJurisdiction: null,
          selectedAccounting: null,
          selectedImpacts: [],
          selectedTakaful: { enabled: false },
          dealConfiguration: null,
          contextDocuments: [],
          contextText: '',
          contextEpisodeIds: [],
          userNotes: {},
          workflowIterations: 0,
          participants: [],
          executionLog: [],
          completedSteps: [],
          interruptCount: 0,
          interruptMessages: [],
          citations: [],
          approvedCitations: [],
          rejectedCitations: [],
          finalDocument: '',
          generatedFiles: [],
          extractedLearnings: [],
          appliedLearnings: [],
          userFeedback: '',
          startedAt: new Date().toISOString(),
          completedAt: null,
          durationSeconds: 0,
          tokensUsed: 0,
        }

        set({ execution })
      },

      updateExecution: (updates: Partial<WorkflowExecution>) => {
        const { execution } = get()
        if (!execution) return

        set({ execution: { ...execution, ...updates } })
      },

      nextStep: () => {
        const { execution } = get()
        if (!execution) return

        // Step 0-11 (12 steps total: Welcome + 11 workflow steps)
        const nextIndex = Math.min(execution.currentStepIndex + 1, 11)
        set({
          execution: {
            ...execution,
            currentStepIndex: nextIndex,
          },
        })
      },

      previousStep: () => {
        const { execution } = get()
        if (!execution) return

        const prevIndex = Math.max(execution.currentStepIndex - 1, 0)
        set({
          execution: {
            ...execution,
            currentStepIndex: prevIndex,
          },
        })
      },

      setGraphitiConnected: (connected: boolean) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            graphitiConnected: connected,
          },
        })
      },

      addDocument: (type: 'aaoifi' | 'context', document: UploadedDocument) => {
        const { execution } = get()
        if (!execution) return

        if (type === 'aaoifi') {
          set({
            execution: {
              ...execution,
              aaaoifiDocuments: [...execution.aaaoifiDocuments, document],
            },
          })
        } else {
          set({
            execution: {
              ...execution,
              contextDocuments: [...execution.contextDocuments, document],
            },
          })
        }
      },

      removeDocument: (type: 'aaoifi' | 'context', documentId: string) => {
        const { execution } = get()
        if (!execution) return

        if (type === 'aaoifi') {
          set({
            execution: {
              ...execution,
              aaaoifiDocuments: execution.aaaoifiDocuments.filter((d) => d.id !== documentId),
            },
          })
        } else {
          set({
            execution: {
              ...execution,
              contextDocuments: execution.contextDocuments.filter((d) => d.id !== documentId),
            },
          })
        }
      },

      setSelectedMethodologies: (methodologies: Methodology[]) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedMethodologies: methodologies,
          } as any,
        })
      },

      addMethodology: (methodology: Methodology) => {
        const { execution } = get()
        if (!execution) return

        // Check if methodology already selected
        const exists = (execution as any).selectedMethodologies?.find((m: any) => m.id === methodology.id)
        if (exists) return

        set({
          execution: {
            ...execution,
            selectedMethodologies: [...((execution as any).selectedMethodologies || []), methodology],
          } as any,
        })
      },

      removeMethodology: (methodologyId: string) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedMethodologies: ((execution as any).selectedMethodologies || []).filter(
              (m: any) => m.id !== methodologyId
            ),
          } as any,
        })
      },

      // -------------------------
      // ACTIONS: 4-COMPONENT SELECTION
      // -------------------------

      setShariahStructure: (structure: ShariahStructure | null) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedShariahStructure: structure,
          },
        })
      },

      setIsSecuritized: (isSecuritized: boolean) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            isSecuritized,
          },
        })
      },

      setJurisdiction: (jurisdiction: Jurisdiction | null) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedJurisdiction: jurisdiction,
          },
        })
      },

      setAccounting: (accounting: AccountingFramework | null) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedAccounting: accounting,
          },
        })
      },

      toggleImpact: (impact: ImpactMetrics) => {
        const { execution } = get()
        if (!execution) return

        const isSelected = execution.selectedImpacts.some(i => i.id === impact.id)

        set({
          execution: {
            ...execution,
            selectedImpacts: isSelected
              ? execution.selectedImpacts.filter(i => i.id !== impact.id)
              : [...execution.selectedImpacts, impact],
          },
        })
      },

      addImpact: (impact: ImpactMetrics) => {
        const { execution } = get()
        if (!execution) return

        const isAlreadySelected = execution.selectedImpacts.some(i => i.id === impact.id)
        if (isAlreadySelected) return

        set({
          execution: {
            ...execution,
            selectedImpacts: [...execution.selectedImpacts, impact],
          },
        })
      },

      removeImpact: (impactId: string) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedImpacts: execution.selectedImpacts.filter(i => i.id !== impactId),
          },
        })
      },

      clearImpacts: () => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedImpacts: [],
          },
        })
      },

      setTakaful: (takaful: TakafulOverlay) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedTakaful: takaful,
          },
        })
      },

      buildDealConfiguration: () => {
        const { execution } = get()
        if (!execution) return null

        const { selectedShariahStructure, selectedJurisdiction, selectedAccounting, selectedImpacts, selectedTakaful } = execution

        // All 4 components must be selected (at least one impact metric)
        if (!selectedShariahStructure || !selectedJurisdiction || !selectedAccounting || selectedImpacts.length === 0) {
          return null
        }

        // Run comprehensive validation using validation engine
        const validationResults = validateDealConfiguration(
          selectedShariahStructure,
          selectedJurisdiction,
          selectedAccounting,
          selectedImpacts[0], // Pass first impact for validation (validation engine expects single impact)
          selectedTakaful
        )

        // Build configuration
        const config: DealConfiguration = {
          shariahStructure: selectedShariahStructure,
          jurisdiction: selectedJurisdiction,
          accounting: selectedAccounting,
          impacts: selectedImpacts,
          takaful: selectedTakaful,
          configurationName: `${selectedShariahStructure.name} - ${selectedJurisdiction.name} - ${selectedAccounting.name}`,
          isValid: validationResults.isValid,
          validationErrors: validationResults.errors,
          validationWarnings: validationResults.warnings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Save to execution state
        set({
          execution: {
            ...execution,
            dealConfiguration: config,
          },
        })

        return config
      },

      loadDemoConfiguration: () => {
        const { execution } = get()
        if (!execution) return

        // Pre-populate QIIB Oryx Sustainability Sukuk configuration
        // Wakala + Qatar QFC + AAOIFI + QFC Sustainable + Islamic Social Finance + Sukuk ON
        set({
          execution: {
            ...execution,
            selectedShariahStructure: WAKALA,
            isSecuritized: true, // SUKUK MODE ON
            selectedJurisdiction: QATAR_QFC,
            selectedAccounting: AAOIFI,
            selectedImpacts: [QFC_SUSTAINABLE, ISLAMIC_SOCIAL_FINANCE],
            selectedTakaful: {
              enabled: false, // No Takaful in QIIB Oryx
            },
          },
        })

        // Auto-advance to step 2 (Shariah Structure) to show pre-populated configuration
        // NOTE: Step indices are now: 0=Welcome, 1=Connect, 2=Shariah, etc.
        set({
          execution: {
            ...get().execution!,
            currentStepIndex: 2,
          },
        })
      },

      setWorkflowMode: (mode: 'full' | 'impact-only' | 'compliance-check' | 'tokenization-only', startStep: number) => {
        const { execution } = get()
        if (!execution) return

        // Define which steps to skip based on mode
        let skippedSteps: number[] = []

        switch (mode) {
          case 'impact-only':
            // Skip all steps except Impact (Step 5) - go directly to impact metrics
            skippedSteps = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11]
            break
          case 'compliance-check':
            // Quick compliance: Source connection + AI analysis, skip configuration
            skippedSteps = [2, 3, 4, 5, 6, 8, 9, 10, 11]
            break
          case 'tokenization-only':
            // Jump to testing/deployment (Steps 9-10), skip configuration
            skippedSteps = [1, 2, 3, 4, 5, 6, 7, 8]
            break
          case 'full':
          default:
            // No steps skipped - full workflow
            skippedSteps = []
            break
        }

        set({
          execution: {
            ...execution,
            workflowMode: mode,
            skippedSteps,
            currentStepIndex: startStep,
          },
        })
      },

      // -------------------------
      // ACTIONS: V2 WORKFLOW EXTENSIONS
      // -------------------------

      setTransactionScale: (scale: NonNullable<WorkflowExecution['transactionScale']>) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            transactionScale: scale,
          },
        })
      },

      setGovernance: (governance: NonNullable<WorkflowExecution['governance']>) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            governance,
          },
        })
      },

      setCrossBorder: (crossBorder: boolean) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            crossBorder,
          },
        })
      },

      setAdditionalJurisdictions: (jurisdictions: Jurisdiction[]) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            additionalJurisdictions: jurisdictions,
          },
        })
      },

      setReportingFrequency: (frequency: 'quarterly' | 'semi-annual' | 'annual') => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            reportingFrequency: frequency,
          },
        })
      },
      setImpacts: (impacts: ImpactMetrics[]) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            selectedImpacts: impacts,
          },
        })
      },

      // -------------------------
      // ACTIONS: CONTEXT
      // -------------------------

      setContextText: (text: string) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            contextText: text,
          },
        })
      },

      addUserNote: (stepId: string, note: string) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            userNotes: {
              ...execution.userNotes,
              [stepId]: note,
            },
          },
        })
      },

      addLogEntry: (entry: LogEntry) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            executionLog: [...execution.executionLog, entry],
          },
        })
      },

      addInterruptMessage: (message: InterruptMessage) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            interruptMessages: [...execution.interruptMessages, message],
            interruptCount: execution.interruptCount + 1,
            status: 'interrupted',
          },
        })
      },

      addCitation: (citation: Citation) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            citations: [...execution.citations, citation],
          },
        })
      },

      updateCitationApproval: (citationId: string, approved: boolean, rejectionReason?: string) => {
        const { execution } = get()
        if (!execution) return

        const updatedCitations = execution.citations.map((c) =>
          c.id === citationId
            ? { ...c, approved, rejected: !approved, rejectionReason }
            : c
        )

        const approvedIds = approved
          ? [...execution.approvedCitations, citationId]
          : execution.approvedCitations.filter((id) => id !== citationId)

        const rejectedIds = !approved
          ? [...execution.rejectedCitations, citationId]
          : execution.rejectedCitations.filter((id) => id !== citationId)

        set({
          execution: {
            ...execution,
            citations: updatedCitations,
            approvedCitations: approvedIds,
            rejectedCitations: rejectedIds,
          },
        })
      },

      setFinalDocument: (document: string) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            finalDocument: document,
          },
        })
      },

      addGeneratedFile: (file: GeneratedFile) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            generatedFiles: [...execution.generatedFiles, file],
          },
        })
      },

      addLearning: (learning: Learning) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            extractedLearnings: [...execution.extractedLearnings, learning],
          },
        })
      },

      applyLearning: (learningId: string) => {
        const { execution } = get()
        if (!execution) return

        const updatedLearnings = execution.extractedLearnings.map((l) =>
          l.id === learningId ? { ...l, approved: true, appliedToTemplate: true } : l
        )

        set({
          execution: {
            ...execution,
            extractedLearnings: updatedLearnings,
            appliedLearnings: [...execution.appliedLearnings, learningId],
          },
        })
      },

      setUserFeedback: (feedback: string) => {
        const { execution } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            userFeedback: feedback,
          },
        })
      },

      completeExecution: () => {
        const { execution } = get()
        if (!execution) return

        const now = new Date().toISOString()
        const startTime = new Date(execution.startedAt).getTime()
        const endTime = new Date(now).getTime()
        const durationSeconds = Math.floor((endTime - startTime) / 1000)

        set({
          execution: {
            ...execution,
            status: 'completed',
            completedAt: now,
            durationSeconds,
          },
        })
      },

      failExecution: (reason: string) => {
        const { execution, addError } = get()
        if (!execution) return

        set({
          execution: {
            ...execution,
            status: 'failed',
            completedAt: new Date().toISOString(),
          },
        })

        // Add error to UI
        addError({
          id: `error_${Date.now()}`,
          timestamp: new Date().toISOString(),
          severity: 'error',
          title: 'Workflow Execution Failed',
          message: reason,
          dismissible: true,
        })
      },

      addError: (error: ErrorState) => {
        set((state) => ({
          errors: [...state.errors, error],
        }))
      },

      removeError: (errorId: string) => {
        set((state) => ({
          errors: state.errors.filter((e) => e.id !== errorId),
        }))
      },

      clearErrors: () => {
        set({ errors: [] })
      },

      setLoading: (key: keyof WorkflowStore['loading'], value: boolean) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: value,
          },
        }))
      },

      setDeveloperMode: (enabled: boolean) => {
        set({ developerMode: enabled })
      },

      setDisableAllMocks: (enabled: boolean) => {
        set({ disableAllMocks: enabled })
      },

      setShowApiLogs: (enabled: boolean) => {
        set({ showApiLogs: enabled })
      },

      reset: () => {
        set({
          execution: null,
          errors: [],
          loading: initialLoading,
          // Don't reset servicesStatus - keep service connections across workflow resets
          // Don't reset developer settings either - they persist across workflows
        })
      },
    }),
    {
      name: 'workflow-store',
    }
  )
)
