import type { GuardianPolicy } from '../types/digitization'

export const mockPolicy: GuardianPolicy = {
  id: 'mudarabah-workflow',
  name: 'IIFM Mudarabah Workflow',
  description: 'Complete workflow from contract initiation to profit distribution',
  roles: ['Mudarib', 'Rab-ul-Mal', 'Shariah Board', 'Independent Auditor'],
  workflow_blocks: [
    {
      id: 'block-1',
      type: 'data-input',
      name: 'Contract Initiation',
      assigned_role: 'Mudarib',
      inputs: ['contract-details'],
      outputs: ['contract-draft'],
    },
    {
      id: 'block-2',
      type: 'approval',
      name: 'Shariah Compliance Review',
      assigned_role: 'Shariah Board',
      inputs: ['contract-draft'],
      outputs: ['shariah-certification'],
      conditions: [
        { field: 'profit_sharing_ratio_predetermined', operator: 'equals', value: true },
        { field: 'investment_scope_compliant', operator: 'equals', value: true },
      ],
    },
    {
      id: 'block-3',
      type: 'data-input',
      name: 'Capital Contribution',
      assigned_role: 'Rab-ul-Mal',
      inputs: ['contract-details'],
      outputs: ['capital-contribution-record'],
    },
    {
      id: 'block-4',
      type: 'data-input',
      name: 'Investment Execution',
      assigned_role: 'Mudarib',
      inputs: ['capital-contribution-record'],
      outputs: ['investment-records'],
    },
    {
      id: 'block-5',
      type: 'calculation',
      name: 'Profit Calculation',
      assigned_role: 'Mudarib',
      inputs: ['investment-records', 'profit-sharing-parameters'],
      outputs: ['profit-calculation-results'],
    },
    {
      id: 'block-6',
      type: 'approval',
      name: 'Profit Distribution Approval',
      assigned_role: 'Rab-ul-Mal',
      inputs: ['profit-calculation-results'],
      outputs: ['approved-distribution'],
    },
  ],
}
