export enum Domain {
  EMOTION_CONTROL = 'EMOTION_CONTROL',
  IMPULSIVITY = 'IMPULSIVITY',
  RULE_EXECUTION = 'RULE_EXECUTION',
  LONG_TERM_PATIENCE = 'LONG_TERM_PATIENCE',
}

export interface Question {
  id: number;
  text: string;
  domain: Domain;
}

export interface DomainScore {
  domain: Domain;
  score: number; // 0 to 100
}

export interface DiagnosisResult {
  totalScore: number;
  domainScores: DomainScore[];
  category: 'UNSUITABLE' | 'CONDITIONAL' | 'SUITABLE';
  recommendation: string;
  aiAdvice?: string;
}
