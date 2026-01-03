export interface GeminiAnalysis {
  transcription: string;
  visualBreakdown: {
    scenes: Scene[];
    colorPalette: string[];
    visualStyle: string;
    transitions: string[];
  };
  hookAnalysis: {
    openingHook: string;
    screenHook: string;
    storyHook: string;
    closingHook: string;
    hookTimings: number[];
  };
  pacing: {
    totalDuration: number;
    clipCount: number;
    averageClipDuration: number;
    tempo: 'slow' | 'medium' | 'fast' | 'very-fast';
  };
  audioAnalysis: {
    music: boolean;
    musicStyle?: string;
    voiceover: boolean;
    soundEffects: string[];
  };
}

export interface Scene {
  timestamp: string;
  description: string;
  duration: number;
  visualElements: string[];
}

export interface ChatGPTFormula {
  score: number; // 0-10
  formula: string;
  viralElements: string[];
  checklist: ChecklistItem[];
  suggestions: string[];
  replicationStrategy: string;
}

export interface ChecklistItem {
  category: string;
  item: string;
  present: boolean;
  importance: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  videoUrl: string;
  status: 'processing' | 'completed' | 'failed';
  geminiAnalysis?: GeminiAnalysis;
  chatgptFormula?: ChatGPTFormula;
  autoApproved: boolean;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ScriptSuggestion {
  title: string;
  openingHook: string;
  screenHook: string;
  storyHook: string;
  problemStatement: string;
  solution: string;
  cta: string;
  closingHook: string;
  visualDirections: string;
  audioNotes: string;
  caption: string;
  hashtags: string[];
}
