export type TriggerType = 'contains' | 'exact' | 'regex' | 'starts_with';

export interface Rule {
  id: string;
  name: string;
  triggerType: TriggerType;
  patterns: string[]; // Patterns/keywords to match
  response: string;
  category: string;
  usageCount: number;
  isSystem?: boolean;
}

export interface DebugMatchInfo {
  originalText: string;
  normalizedText: string;
  tokens: string[];
  matchedPattern?: string;
  triggerType?: TriggerType;
  matchScore?: number; // percentage of token matches or 1 for exact
  evaluationSteps: { stepName: string; details: string; status: 'success' | 'info' | 'fail' }[];
  searchTimeMs: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  matchedRuleId?: string;
  debugInfo?: DebugMatchInfo;
}

export interface BotScenario {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  welcomeMessage: string;
  defaultRules: Rule[];
}
