/**
 * WORKFLOW EXECUTION STORE
 * ========================
 * Zustand store for agentic workflow execution transparency.
 * Contains mock data for 3 workflow executions matching existing tasks.
 */

import { create } from 'zustand'
import type {
  WorkflowExecution,
  WorkflowExecutionFilters,
  TaskLineage,
  WorkflowStatus
} from './workflow-types'

interface WorkflowExecutionStore {
  // Data
  executions: WorkflowExecution[]

  // Methods
  getExecutionById: (id: string) => WorkflowExecution | undefined
  getTaskLineage: (taskId: string) => TaskLineage | undefined
  filterExecutions: (filters: WorkflowExecutionFilters) => WorkflowExecution[]
  getExecutionStats: () => {
    total: number
    completed: number
    running: number
    failed: number
  }
}

/**
 * Mock workflow execution data
 * These align with the existing tasks in the AI Native tasks page
 */
const MOCK_EXECUTIONS: WorkflowExecution[] = [
  // Execution 1: Commodity Murabaha deal that generated SG-02, RM-03, RL-03 tasks
  {
    id: 'wf-20241108-001',
    name: 'Commodity Murabaha Compliance Setup',
    deal_id: 'deal-002',
    deal_name: 'Commodity Murabaha - Corporate Working Capital',
    status: 'COMPLETED',
    created_at: '2024-11-08T10:34:00Z',
    started_at: '2024-11-08T10:34:02Z',
    completed_at: '2024-11-08T10:36:34Z',
    duration_seconds: 152,
    initiated_by: 'Sarah Chen',
    phases: [
      {
        id: 'A0',
        name: 'Deal Profiler',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:34:02Z',
        completed_at: '2024-11-08T10:34:10Z',
        duration_seconds: 8,
        input: {
          user_intent: 'Corporate working capital financing using commodity Murabaha structure',
          asset_type: 'Commodities (LME metals)',
          jurisdiction: 'Qatar',
          amount: '$5M USD'
        },
        output: {
          contractType: 'Murabaha',
          subtype: 'Commodity Murabaha',
          jurisdictions: ['QA'],
          regulators: ['QCB', 'QFCRA'],
          asset_class: 'Commodities',
          deal_complexity: 'Standard',
          estimated_obligations: 12
        },
        hitl_gate: {
          status: 'APPROVED',
          approver: 'Sarah Chen',
          approved_at: '2024-11-08T10:34:12Z',
          feedback: 'Confirmed: Standard commodity Murabaha for working capital'
        }
      },
      {
        id: 'A1',
        name: 'Obligation Extractor',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:34:12Z',
        completed_at: '2024-11-08T10:34:35Z',
        duration_seconds: 23,
        data_source: {
          type: 'qatar-unified-obligations',
          source_name: 'Qatar Unified Obligations Register',
          confidence_score: 0.96,
          timestamp: '2024-11-08T10:34:35Z'
        },
        input: {
          contract_type: 'Murabaha',
          jurisdictions: ['QA'],
          regulators: ['QCB', 'QFCRA']
        },
        output: {
          obligations_found: 8,
          obligations: [
            {
              id: 'UNIFIED-OBL-001',
              title: 'Establish Shariah Supervisory Board (min 3 scholars)',
              source: 'QCB Law 13/2012 Art 109; QFCRA ISFI Rule 6.1.1',
              link: '/research/obligations#UNIFIED-OBL-001',
              category: 'SSB_GOVERNANCE',
              priority: 'Critical'
            },
            {
              id: 'UNIFIED-OBL-004',
              title: 'Obtain SSB approval before product launch',
              source: 'QCB Law 13/2012 Art 110; AAOIFI GS-1 §3.1',
              link: '/research/obligations#UNIFIED-OBL-004',
              category: 'PRODUCT_APPROVAL',
              priority: 'Critical'
            },
            {
              id: 'UNIFIED-OBL-015',
              title: 'Bank must own commodity before sale to customer',
              source: 'AAOIFI SS-8 §3/2/1; QCB Islamic Banking Regulation',
              link: '/research/obligations#UNIFIED-OBL-015',
              category: 'PRODUCT_APPROVAL',
              priority: 'Critical'
            },
            {
              id: 'UNIFIED-OBL-023',
              title: 'Conduct periodic RoR benchmarking for profit distribution',
              source: 'QCB Instruction 7/2018; AAOIFI FAS-27',
              link: '/research/obligations#UNIFIED-OBL-023',
              category: 'RISK_MANAGEMENT',
              priority: 'High'
            },
            {
              id: 'UNIFIED-OBL-042',
              title: 'Screen counterparties against sanctions lists',
              source: 'QFCRA AIFC Regulations; QCB AML/CFT Guidelines',
              link: '/research/obligations#UNIFIED-OBL-042',
              category: 'RISK_MANAGEMENT',
              priority: 'Critical'
            }
          ]
        },
        quality_checks: {
          ragas_faithfulness: 0.94,
          ragas_answer_relevancy: 0.92,
          source_citations: '8/8 obligations cited',
          validation_passed: true
        },
        hitl_gate: {
          status: 'APPROVED',
          approver: 'Sarah Chen',
          approved_at: '2024-11-08T10:34:45Z',
          feedback: 'Obligations look comprehensive for Murabaha'
        }
      },
      {
        id: 'A2',
        name: 'Risk Mapper',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:34:45Z',
        completed_at: '2024-11-08T10:35:03Z',
        duration_seconds: 18,
        input: {
          obligations: 8,
          contract_type: 'Murabaha',
          asset_class: 'Commodities'
        },
        output: {
          risks_identified: 5,
          risks: [
            {
              id: 'RISK-SG-001',
              title: 'SSB asset ownership approval risk',
              description: 'Commodity ownership transfer may not meet Shariah requirements',
              likelihood: 'Medium',
              impact: 'High',
              mitigation_control: 'SG-02'
            },
            {
              id: 'RISK-RM-001',
              title: 'Profit rate benchmarking gap',
              description: 'Missing Q4 RoR data could delay profit distribution',
              likelihood: 'High',
              impact: 'Medium',
              mitigation_control: 'RM-03'
            },
            {
              id: 'RISK-RL-001',
              title: 'Sanctions screening failure',
              description: 'Counterparty may be on sanctions list',
              likelihood: 'Low',
              impact: 'High',
              mitigation_control: 'RL-03'
            }
          ]
        },
        quality_checks: {
          ragas_faithfulness: 0.91,
          validation_passed: true
        }
      },
      {
        id: 'A3',
        name: 'Control Designer',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:35:03Z',
        completed_at: '2024-11-08T10:35:28Z',
        duration_seconds: 25,
        input: {
          obligations: 8,
          risks: 5
        },
        output: {
          controls_designed: 6,
          controls: [
            {
              id: 'SG-02',
              name: 'SSB Asset Ownership Review',
              description: 'Quarterly review of asset ownership compliance in Murabaha transactions',
              type: 'Detective',
              automation_level: 'Semi-Automated',
              related_obligations: ['UNIFIED-OBL-015', 'UNIFIED-OBL-004']
            },
            {
              id: 'RM-03',
              name: 'RoR Benchmark Data Collection',
              description: 'Automated collection of quarterly RoR benchmark data for profit distribution',
              type: 'Preventive',
              automation_level: 'Automated',
              related_obligations: ['UNIFIED-OBL-023']
            },
            {
              id: 'RL-03',
              name: 'Sanctions Screening Automation',
              description: 'Real-time sanctions screening for all counterparties',
              type: 'Preventive',
              automation_level: 'Automated',
              related_obligations: ['UNIFIED-OBL-042']
            }
          ]
        },
        quality_checks: {
          validation_passed: true,
          warning_count: 0
        },
        hitl_gate: {
          status: 'APPROVED',
          approver: 'Sarah Chen',
          approved_at: '2024-11-08T10:35:35Z',
          feedback: 'Controls align well with identified risks'
        }
      },
      {
        id: 'A4',
        name: 'Schema Designer',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:35:35Z',
        completed_at: '2024-11-08T10:35:52Z',
        duration_seconds: 17,
        input: {
          controls: 6,
          obligations: 8
        },
        output: {
          schemas_created: 3,
          fields: [
            { field_name: 'commodity_ownership_transfer_date', field_type: 'date', required: true },
            { field_name: 'ssb_approval_reference', field_type: 'text', required: true },
            { field_name: 'ror_benchmark_value', field_type: 'number', required: true },
            { field_name: 'sanctions_screening_status', field_type: 'boolean', required: true }
          ]
        },
        quality_checks: {
          validation_passed: true
        }
      },
      {
        id: 'A6',
        name: 'Policy Generator',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:35:52Z',
        completed_at: '2024-11-08T10:36:14Z',
        duration_seconds: 22,
        input: {
          controls: 6,
          schemas: 3,
          obligations: 8
        },
        output: {
          policy_generated: true,
          policy_filename: 'guardian-policy-murabaha-qatar-20241108.json',
          policy_size_kb: 47,
          verifiable_credentials_count: 8,
          blockchain_ready: true
        },
        quality_checks: {
          validation_passed: true
        }
      },
      {
        id: 'A7',
        name: 'Unit Tester',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:36:14Z',
        completed_at: '2024-11-08T10:36:26Z',
        duration_seconds: 12,
        input: {
          policy: 'guardian-policy-murabaha-qatar-20241108.json',
          controls: 6
        },
        output: {
          test_cases_generated: 12,
          test_cases: [
            {
              id: 'TC-001',
              scenario: 'Commodity ownership transfer without SSB approval',
              expected_result: 'Transaction blocked',
              actual_result: 'Transaction blocked',
              status: 'PASSED'
            },
            {
              id: 'TC-002',
              scenario: 'Missing Q4 RoR benchmark data',
              expected_result: 'Alert generated',
              actual_result: 'Alert generated',
              status: 'PASSED'
            }
          ],
          passed: 12,
          failed: 0
        },
        quality_checks: {
          validation_passed: true
        }
      },
      {
        id: 'A8',
        name: 'Dry-Run',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:36:26Z',
        completed_at: '2024-11-08T10:36:32Z',
        duration_seconds: 6,
        input: {
          policy: 'guardian-policy-murabaha-qatar-20241108.json',
          test_results: { passed: 12, failed: 0 }
        },
        output: {
          simulation_successful: true,
          tasks_would_generate: 3,
          controls_would_activate: 6,
          estimated_compliance_score: 0.94
        },
        quality_checks: {
          validation_passed: true
        },
        hitl_gate: {
          status: 'APPROVED',
          approver: 'Sarah Chen',
          approved_at: '2024-11-08T10:36:34Z',
          feedback: 'Ready for publishing'
        }
      },
      {
        id: 'A9',
        name: 'Publisher',
        status: 'COMPLETED',
        started_at: '2024-11-08T10:36:32Z',
        completed_at: '2024-11-08T10:36:34Z',
        duration_seconds: 2,
        input: {
          policy: 'guardian-policy-murabaha-qatar-20241108.json',
          dry_run_approved: true
        },
        output: {
          published: true,
          policy_hash: '0x7f8a9c2d...',
          hedera_topic_id: '0.0.12345',
          ipfs_cid: 'Qm...',
          tasks_created: ['SG-02', 'RM-03', 'RL-03']
        }
      }
    ],
    outputs: {
      guardian_policy: 'guardian-policy-murabaha-qatar-20241108.json',
      guardian_policy_url: '/api/policies/guardian-policy-murabaha-qatar-20241108.json',
      tasks_generated: [
        {
          id: 'SG-02',
          title: 'Shariah review flagged asset ownership',
          category: 'SSB Governance',
          priority: 'High',
          status: 'In Progress'
        },
        {
          id: 'RM-03',
          title: 'Q4 RoR benchmark data incomplete',
          category: 'Risk Management',
          priority: 'Medium',
          status: 'Pending'
        },
        {
          id: 'RL-03',
          title: 'Sanctions screening failed for counterparty',
          category: 'Regulatory',
          priority: 'Critical',
          status: 'Action Required'
        }
      ],
      controls_activated: 6,
      controls_list: ['SG-02', 'RM-03', 'RL-03', 'SG-01', 'RM-01', 'RL-01'],
      obligations_addressed: 8,
      obligations_list: ['UNIFIED-OBL-001', 'UNIFIED-OBL-004', 'UNIFIED-OBL-015', 'UNIFIED-OBL-023', 'UNIFIED-OBL-042'],
      risks_identified: 5,
      test_cases_generated: 12,
      validation_errors: 0
    },
    overall_quality: {
      avg_faithfulness: 0.93,
      total_citations: 8,
      validation_errors: 0,
      hitl_approvals: 4
    },
    tags: ['murabaha', 'qatar', 'completed']
  },

  // Execution 2: Ijara deal that's currently running
  {
    id: 'wf-20241108-002',
    name: 'Ijara Real Estate Compliance Setup',
    deal_id: 'deal-003',
    deal_name: 'Ijara - Commercial Property Lease',
    status: 'RUNNING',
    created_at: '2024-11-08T11:15:00Z',
    started_at: '2024-11-08T11:15:05Z',
    duration_seconds: 0,
    initiated_by: 'Ahmed Al-Mansoori',
    phases: [
      {
        id: 'A0',
        name: 'Deal Profiler',
        status: 'COMPLETED',
        started_at: '2024-11-08T11:15:05Z',
        completed_at: '2024-11-08T11:15:13Z',
        duration_seconds: 8,
        input: {
          user_intent: 'Commercial real estate financing using Ijara structure',
          asset_type: 'Real Estate',
          jurisdiction: 'Qatar',
          amount: '$15M USD'
        },
        output: {
          contractType: 'Ijara',
          subtype: 'Ijara Muntahia Bittamleek',
          jurisdictions: ['QA'],
          regulators: ['QCB', 'QFCRA'],
          asset_class: 'Real Estate',
          deal_complexity: 'Complex',
          estimated_obligations: 15
        },
        hitl_gate: {
          status: 'APPROVED',
          approver: 'Ahmed Al-Mansoori',
          approved_at: '2024-11-08T11:15:15Z'
        }
      },
      {
        id: 'A1',
        name: 'Obligation Extractor',
        status: 'RUNNING',
        started_at: '2024-11-08T11:15:15Z',
        input: {
          contract_type: 'Ijara',
          jurisdictions: ['QA'],
          regulators: ['QCB', 'QFCRA']
        }
      },
      {
        id: 'A2',
        name: 'Risk Mapper',
        status: 'PENDING'
      },
      {
        id: 'A3',
        name: 'Control Designer',
        status: 'PENDING'
      },
      {
        id: 'A4',
        name: 'Schema Designer',
        status: 'PENDING'
      },
      {
        id: 'A6',
        name: 'Policy Generator',
        status: 'PENDING'
      },
      {
        id: 'A7',
        name: 'Unit Tester',
        status: 'PENDING'
      },
      {
        id: 'A8',
        name: 'Dry-Run',
        status: 'PENDING'
      },
      {
        id: 'A9',
        name: 'Publisher',
        status: 'PENDING'
      }
    ],
    outputs: {
      tasks_generated: [],
      controls_activated: 0,
      obligations_addressed: 0
    },
    tags: ['ijara', 'qatar', 'running']
  },

  // Execution 3: Sukuk deal that failed
  {
    id: 'wf-20241107-003',
    name: 'Sukuk Issuance Compliance Setup',
    deal_id: 'deal-001',
    deal_name: 'Sukuk Al-Ijara - Infrastructure Project',
    status: 'FAILED',
    created_at: '2024-11-07T14:22:00Z',
    started_at: '2024-11-07T14:22:05Z',
    completed_at: '2024-11-07T14:23:18Z',
    duration_seconds: 73,
    initiated_by: 'Fatima Al-Kuwari',
    phases: [
      {
        id: 'A0',
        name: 'Deal Profiler',
        status: 'COMPLETED',
        started_at: '2024-11-07T14:22:05Z',
        completed_at: '2024-11-07T14:22:12Z',
        duration_seconds: 7,
        input: {
          user_intent: 'Infrastructure project financing via Sukuk',
          asset_type: 'Infrastructure',
          jurisdiction: 'Qatar',
          amount: '$500M USD'
        },
        output: {
          contractType: 'Sukuk',
          subtype: 'Sukuk Al-Ijara',
          jurisdictions: ['QA'],
          regulators: ['QCB', 'QFCRA', 'QFMA'],
          asset_class: 'Infrastructure',
          deal_complexity: 'Very Complex',
          estimated_obligations: 24
        },
        hitl_gate: {
          status: 'APPROVED',
          approver: 'Fatima Al-Kuwari',
          approved_at: '2024-11-07T14:22:15Z'
        }
      },
      {
        id: 'A1',
        name: 'Obligation Extractor',
        status: 'COMPLETED',
        started_at: '2024-11-07T14:22:15Z',
        completed_at: '2024-11-07T14:22:48Z',
        duration_seconds: 33,
        data_source: {
          type: 'qatar-unified-obligations',
          source_name: 'Qatar Unified Obligations Register',
          confidence_score: 0.88,
          timestamp: '2024-11-07T14:22:48Z'
        },
        output: {
          obligations_found: 18,
          obligations: [
            {
              id: 'UNIFIED-OBL-001',
              title: 'Establish SSB',
              source: 'QCB Law 13/2012 Art 109',
              priority: 'Critical'
            }
          ]
        },
        quality_checks: {
          ragas_faithfulness: 0.88,
          source_citations: '18/18 obligations cited',
          validation_passed: true,
          warning_count: 2
        },
        warnings: [
          'QFMA-specific obligations may be incomplete',
          'Sukuk structuring requires additional AAOIFI SS-17 review'
        ],
        hitl_gate: {
          status: 'APPROVED',
          approver: 'Fatima Al-Kuwari',
          approved_at: '2024-11-07T14:22:55Z',
          feedback: 'Proceed despite warnings - will review QFMA manually'
        }
      },
      {
        id: 'A2',
        name: 'Risk Mapper',
        status: 'FAILED',
        started_at: '2024-11-07T14:22:55Z',
        completed_at: '2024-11-07T14:23:18Z',
        duration_seconds: 23,
        error: {
          message: 'Risk mapping failed: Missing QFMA regulatory data',
          details: 'Cannot map risks for QFMA obligations. Qatar GRC knowledge base does not include QFMA (Qatar Financial Markets Authority) obligations. Only QCB and QFCRA obligations are available.',
          timestamp: '2024-11-07T14:23:18Z'
        }
      },
      {
        id: 'A3',
        name: 'Control Designer',
        status: 'SKIPPED'
      },
      {
        id: 'A4',
        name: 'Schema Designer',
        status: 'SKIPPED'
      },
      {
        id: 'A6',
        name: 'Policy Generator',
        status: 'SKIPPED'
      },
      {
        id: 'A7',
        name: 'Unit Tester',
        status: 'SKIPPED'
      },
      {
        id: 'A8',
        name: 'Dry-Run',
        status: 'SKIPPED'
      },
      {
        id: 'A9',
        name: 'Publisher',
        status: 'SKIPPED'
      }
    ],
    outputs: {
      tasks_generated: [],
      controls_activated: 0,
      obligations_addressed: 0,
      validation_errors: 1
    },
    overall_quality: {
      avg_faithfulness: 0.88,
      total_citations: 18,
      validation_errors: 1,
      hitl_approvals: 2
    },
    tags: ['sukuk', 'qatar', 'failed', 'qfma']
  }
]

/**
 * Mock task lineage data
 * Maps tasks to their originating workflow executions
 */
const TASK_LINEAGE_MAP: Record<string, TaskLineage> = {
  'SG-02': {
    task_id: 'SG-02',
    task_title: 'Shariah review flagged asset ownership',
    workflow_execution_id: 'wf-20241108-001',
    workflow_name: 'Commodity Murabaha Compliance Setup',
    source_obligation: {
      id: 'UNIFIED-OBL-015',
      title: 'Bank must own commodity before sale to customer',
      source: 'AAOIFI SS-8 §3/2/1; QCB Islamic Banking Regulation',
      link: '/research/obligations#UNIFIED-OBL-015',
      category: 'PRODUCT_APPROVAL',
      priority: 'Critical'
    },
    implementing_control: {
      id: 'SG-02',
      name: 'SSB Asset Ownership Review',
      description: 'Quarterly review of asset ownership compliance in Murabaha transactions',
      type: 'Detective',
      automation_level: 'Semi-Automated',
      related_obligations: ['UNIFIED-OBL-015', 'UNIFIED-OBL-004']
    },
    mitigating_risk: {
      id: 'RISK-SG-001',
      title: 'SSB asset ownership approval risk',
      description: 'Commodity ownership transfer may not meet Shariah requirements',
      likelihood: 'Medium',
      impact: 'High',
      mitigation_control: 'SG-02'
    },
    created_by_phase: 'A9',
    created_at: '2024-11-08T10:36:34Z'
  },
  'RM-03': {
    task_id: 'RM-03',
    task_title: 'Q4 RoR benchmark data incomplete',
    workflow_execution_id: 'wf-20241108-001',
    workflow_name: 'Commodity Murabaha Compliance Setup',
    source_obligation: {
      id: 'UNIFIED-OBL-023',
      title: 'Conduct periodic RoR benchmarking for profit distribution',
      source: 'QCB Instruction 7/2018; AAOIFI FAS-27',
      link: '/research/obligations#UNIFIED-OBL-023',
      category: 'RISK_MANAGEMENT',
      priority: 'High'
    },
    implementing_control: {
      id: 'RM-03',
      name: 'RoR Benchmark Data Collection',
      description: 'Automated collection of quarterly RoR benchmark data for profit distribution',
      type: 'Preventive',
      automation_level: 'Automated',
      related_obligations: ['UNIFIED-OBL-023']
    },
    mitigating_risk: {
      id: 'RISK-RM-001',
      title: 'Profit rate benchmarking gap',
      description: 'Missing Q4 RoR data could delay profit distribution',
      likelihood: 'High',
      impact: 'Medium',
      mitigation_control: 'RM-03'
    },
    created_by_phase: 'A9',
    created_at: '2024-11-08T10:36:34Z'
  },
  'RL-03': {
    task_id: 'RL-03',
    task_title: 'Sanctions screening failed for counterparty',
    workflow_execution_id: 'wf-20241108-001',
    workflow_name: 'Commodity Murabaha Compliance Setup',
    source_obligation: {
      id: 'UNIFIED-OBL-042',
      title: 'Screen counterparties against sanctions lists',
      source: 'QFCRA AIFC Regulations; QCB AML/CFT Guidelines',
      link: '/research/obligations#UNIFIED-OBL-042',
      category: 'RISK_MANAGEMENT',
      priority: 'Critical'
    },
    implementing_control: {
      id: 'RL-03',
      name: 'Sanctions Screening Automation',
      description: 'Real-time sanctions screening for all counterparties',
      type: 'Preventive',
      automation_level: 'Automated',
      related_obligations: ['UNIFIED-OBL-042']
    },
    mitigating_risk: {
      id: 'RISK-RL-001',
      title: 'Sanctions screening failure',
      description: 'Counterparty may be on sanctions list',
      likelihood: 'Low',
      impact: 'High',
      mitigation_control: 'RL-03'
    },
    created_by_phase: 'A9',
    created_at: '2024-11-08T10:36:34Z'
  }
}

/**
 * Zustand store
 */
export const useWorkflowExecutionStore = create<WorkflowExecutionStore>((set, get) => ({
  executions: MOCK_EXECUTIONS,

  getExecutionById: (id: string) => {
    return get().executions.find(exec => exec.id === id)
  },

  getTaskLineage: (taskId: string) => {
    return TASK_LINEAGE_MAP[taskId]
  },

  filterExecutions: (filters: WorkflowExecutionFilters) => {
    const { executions } = get()

    return executions.filter(exec => {
      // Filter by status
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(exec.status)) return false
      }

      // Filter by deal ID
      if (filters.deal_id && exec.deal_id !== filters.deal_id) {
        return false
      }

      // Filter by date range
      if (filters.date_from) {
        const execDate = new Date(exec.created_at)
        const fromDate = new Date(filters.date_from)
        if (execDate < fromDate) return false
      }

      if (filters.date_to) {
        const execDate = new Date(exec.created_at)
        const toDate = new Date(filters.date_to)
        if (execDate > toDate) return false
      }

      // Filter by initiator
      if (filters.initiated_by && exec.initiated_by !== filters.initiated_by) {
        return false
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        if (!exec.tags || !filters.tags.some(tag => exec.tags?.includes(tag))) {
          return false
        }
      }

      return true
    })
  },

  getExecutionStats: () => {
    const { executions } = get()
    return {
      total: executions.length,
      completed: executions.filter(e => e.status === 'COMPLETED').length,
      running: executions.filter(e => e.status === 'RUNNING').length,
      failed: executions.filter(e => e.status === 'FAILED').length
    }
  }
}))
