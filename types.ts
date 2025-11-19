
export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT', // Decision Maker
  ADMIN = 'ADMIN',
}

export interface Criterion {
  id: string;
  name: string;
  type: 'benefit' | 'cost';
  description: string;
  defaultWeight?: number;
}

export interface University {
  id: string;
  name: string;
  city: string;
  description: string;
  logoUrl: string; // Use placeholder
  rankGlobal: number;
  rankSubject: number;
  tuition: number; // RMB
  cpiIndex: number; // Cost of living index
  englishPrograms: number;
  intlStudentPercent: number;
  website: string;
  references?: Record<string, string>; // Map of Criterion ID (e.g., 'C1') to Source URL
}

export interface AhpResult {
  weights: Record<string, number>; // criterionId -> weight
  consistencyRatio: number;
  isConsistent: boolean;
  // Detailed Calculation Engine Data
  normalizedMatrix: number[][];
  eigenVector: number[];
  lambdaMax: number;
  consistencyIndex: number;
  randomIndex: number;
}

export interface UniversityScore {
  universityId: string;
  totalScore: number;
  breakdown: Record<string, number>; // criterionId -> weighted score
}

export type SaatyValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
