import { RANDOM_INDEX } from '../constants';
import { AhpResult } from '../types';

export const calculateAhp = (matrix: number[][], criteriaIds: string[]): AhpResult => {
  const n = matrix.length;
  const colSums = new Array(n).fill(0);

  // 1. Sum of columns
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  // 2. Normalize Matrix and 3. Calculate Priority Vector (Weights)
  const weights: Record<string, number> = {};
  const priorityVector = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += matrix[i][j] / colSums[j];
    }
    const weight = rowSum / n;
    priorityVector[i] = weight;
    weights[criteriaIds[i]] = weight;
  }

  // 4. Calculate Consistency Ratio (CR)
  // Consistency Vector = Original Matrix * Priority Vector
  const consistencyVector = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      consistencyVector[i] += matrix[i][j] * priorityVector[j];
    }
  }

  // Lambda Max
  let lambdaMaxSum = 0;
  for (let i = 0; i < n; i++) {
    lambdaMaxSum += consistencyVector[i] / priorityVector[i];
  }
  const lambdaMax = lambdaMaxSum / n;

  // CI
  const ci = (lambdaMax - n) / (n - 1);

  // CR
  const ri = RANDOM_INDEX[n - 1] || 1.49; // Fallback for > 10
  const cr = ci / ri;

  return {
    weights,
    consistencyRatio: cr,
    isConsistent: cr < 0.1,
  };
};

// Helper to normalize raw university data to 0-1 scale for scoring
export const normalizeData = (val: number, min: number, max: number, type: 'benefit' | 'cost') => {
  if (min === max) return 1;
  if (type === 'benefit') {
    return (val - min) / (max - min);
  } else {
    return (max - val) / (max - min);
  }
};
