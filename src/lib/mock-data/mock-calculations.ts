import type { CalculationLogic } from '../types/digitization'

export const mockCalculations: CalculationLogic[] = [
  {
    id: 'profit-distribution-calc',
    name: 'Profit Distribution Calculator',
    description: 'Calculates Mudarib and Rab-ul-Mal profit shares',
    language: 'javascript',
    code: `// Guardian Calculation Logic: Profit Distribution
function calculateProfitDistribution(data) {
  const { total_profit, mudarib_ratio, rabul_mal_ratio } = data;

  // Validation
  if (mudarib_ratio + rabul_mal_ratio !== 100) {
    throw new Error('Profit ratios must sum to 100%');
  }

  if (total_profit < 0) {
    throw new Error('Profit cannot be negative');
  }

  // Calculate shares
  const mudarib_share = (total_profit * mudarib_ratio) / 100;
  const rabul_mal_share = (total_profit * rabul_mal_ratio) / 100;

  return {
    mudarib_share,
    rabul_mal_share,
    total_profit,
    timestamp: new Date().toISOString()
  };
}`,
    inputs: [
      { name: 'total_profit', type: 'number', description: 'Total profit amount' },
      { name: 'mudarib_ratio', type: 'number', description: 'Mudarib share percentage' },
      { name: 'rabul_mal_ratio', type: 'number', description: 'Rab-ul-Mal share percentage' },
    ],
    outputs: [
      { name: 'mudarib_share', type: 'number', description: 'Mudarib profit amount' },
      { name: 'rabul_mal_share', type: 'number', description: 'Rab-ul-Mal profit amount' },
      { name: 'total_profit', type: 'number', description: 'Total profit distributed' },
      { name: 'timestamp', type: 'string', description: 'Calculation timestamp' },
    ],
  },
]
