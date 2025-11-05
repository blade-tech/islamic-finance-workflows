import type { GuardianSchema } from '../types/digitization'

export const mockSchemas: GuardianSchema[] = [
  {
    id: 'contract-details',
    name: 'Mudarabah Contract Details',
    description: 'Core contract information and parties',
    entity: 'MudarabahContract',
    fields: [
      { name: 'contract_id', type: 'string', required: true, description: 'Unique contract identifier' },
      { name: 'mudarib_name', type: 'string', required: true, description: 'Investment manager name' },
      { name: 'rabul_mal_name', type: 'string', required: true, description: 'Capital provider name' },
      {
        name: 'capital_amount',
        type: 'number',
        required: true,
        description: 'Initial capital in base currency',
      },
      {
        name: 'contract_date',
        type: 'date',
        required: true,
        description: 'Contract execution date',
      },
    ],
  },
  {
    id: 'profit-sharing-parameters',
    name: 'Profit Sharing Parameters',
    description: 'Profit distribution configuration',
    entity: 'ProfitSharingRatio',
    fields: [
      {
        name: 'mudarib_percentage',
        type: 'number',
        required: true,
        description: 'Mudarib profit share (0-100)',
      },
      {
        name: 'rabul_mal_percentage',
        type: 'number',
        required: true,
        description: 'Rab-ul-Mal profit share (0-100)',
      },
      {
        name: 'profit_tier',
        type: 'enum',
        required: true,
        description: 'Profit tier structure',
        enum_values: ['conservative', 'moderate', 'aggressive'],
      },
    ],
  },
  {
    id: 'shariah-compliance',
    name: 'Shariah Compliance Validation',
    description: 'Shariah board certification and compliance status',
    entity: 'ShariahCompliance',
    fields: [
      {
        name: 'certification_date',
        type: 'date',
        required: true,
        description: 'Date of Shariah board approval',
      },
      {
        name: 'shariah_board_name',
        type: 'string',
        required: true,
        description: 'Name of certifying Shariah board',
      },
      {
        name: 'compliance_status',
        type: 'enum',
        required: true,
        description: 'Current compliance status',
        enum_values: ['approved', 'pending', 'rejected', 'expired'],
      },
      {
        name: 'next_audit_date',
        type: 'date',
        required: false,
        description: 'Scheduled next audit date',
      },
    ],
  },
]
