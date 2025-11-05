import type { DocumentAnalysis } from '../types/digitization'

export const mockAnalysis: DocumentAnalysis = {
  methodologyType: 'islamic-finance',
  category: 'mudarabah',
  standard: 'IIFM',
  extractedEntities: {
    stakeholderRoles: [
      'Mudarib (Investment Manager)',
      'Rab-ul-Mal (Capital Provider)',
      'Shariah Board',
      'Independent Auditor',
    ],
    complianceRequirements: [
      'Profit-sharing ratio must be predetermined',
      'Loss borne by capital provider only',
      'No guaranteed returns or fixed income',
      'Shariah Board approval required',
      'No investment in riba-based activities',
      'Annual compliance audit required',
    ],
    approvalGates: [
      'Initial Shariah compliance certification',
      'Contract registration and documentation',
      'Quarterly compliance reviews',
      'Annual Shariah audit',
    ],
    formulas: [
      {
        name: 'Mudarib Profit Share Calculation',
        formula: 'mudarib_share = total_profit * mudarib_ratio / 100',
        variables: ['total_profit', 'mudarib_ratio'],
      },
      {
        name: 'Rab-ul-Mal Profit Share Calculation',
        formula: 'rabul_mal_share = total_profit * rabul_mal_ratio / 100',
        variables: ['total_profit', 'rabul_mal_ratio'],
      },
      {
        name: 'Profit Ratio Validation',
        formula: 'mudarib_ratio + rabul_mal_ratio === 100',
        variables: ['mudarib_ratio', 'rabul_mal_ratio'],
      },
    ],
  },
  recommendedSchemas: [
    'contract-details-schema',
    'profit-sharing-parameters-schema',
    'shariah-compliance-validation-schema',
    'capital-contribution-schema',
    'investment-mandate-schema',
    'profit-distribution-schema',
    'audit-trail-schema',
    'termination-conditions-schema',
  ],
  recommendedPolicySteps: [
    'Contract Initiation',
    'Shariah Compliance Review',
    'Capital Contribution',
    'Investment Execution',
    'Quarterly Compliance Check',
    'Profit Calculation',
    'Profit Distribution Approval',
    'Annual Shariah Audit',
    'Contract Termination',
  ],
  confidence: 0.92,
}
