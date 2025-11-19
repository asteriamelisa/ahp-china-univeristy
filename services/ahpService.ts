
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

// Specific Scoring Logic based on User Requirements
export const getCriterionScore = (criterionId: string, value: number): number => {
  switch (criterionId) {
    // C1: Global Rank (Cost) - Lower is better
    // 1–10: 5, 11–50: 4, 51–100: 3, 101–200: 2, >200: 1
    case 'C1':
      if (value <= 10) return 5;
      if (value <= 50) return 4;
      if (value <= 100) return 3;
      if (value <= 200) return 2;
      return 1;

    // C2: Subject Rank (Cost) - Lower is better
    // 1–20: 5, 21–50: 4, 51–100: 3, 101–200: 2, >200: 1
    case 'C2':
      if (value <= 20) return 5;
      if (value <= 50) return 4;
      if (value <= 100) return 3;
      if (value <= 200) return 2;
      return 1;

    // C3: Tuition Fee (Cost) - Lower is better
    // < 25k: 5, 25k–39.9k: 4, 40k–59.9k: 3, 60k–79.9k: 2, >= 80k: 1
    case 'C3':
      if (value < 25000) return 5;
      if (value < 40000) return 4;
      if (value < 60000) return 3;
      if (value < 80000) return 2;
      return 1;

    // C4: Living Cost Index (Cost) - Lower is better
    // < 45: 5, 45–54: 4, 55–64: 3, 65–74: 2, >= 75: 1
    case 'C4':
      if (value < 45) return 5;
      if (value < 55) return 4;
      if (value < 65) return 3;
      if (value < 75) return 2;
      return 1;

    // C5: English Programs (Benefit) - Higher is better
    // >= 5: 5, 4: 4, 3: 3, 2: 2, 1: 1
    case 'C5':
      if (value >= 5) return 5;
      if (value === 4) return 4;
      if (value === 3) return 3;
      if (value === 2) return 2;
      return 1;

    // C6: Intl Students % (Benefit) - Higher is better
    // >= 25%: 5, 20–24%: 4, 15–19%: 3, 10–14%: 2, < 10%: 1
    case 'C6':
      if (value >= 25) return 5;
      if (value >= 20) return 4;
      if (value >= 15) return 3;
      if (value >= 10) return 2;
      return 1;

    default:
      return 0;
  }
};
