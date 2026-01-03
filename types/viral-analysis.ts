// Phase 0: User Input Context
export interface UserContext {
  niche: string;
  category: string;
  productService: string;
  targetOutcome: string;
  targetAudience: string;
  targetDuration: number; // in seconds, default 27
}

// Phase 1: Gemini Analysis Types
export interface TranscriptionItem {
  timestamp_start: string;
  timestamp_end: string;
  type: 'VISUAL' | 'DIALOGUE' | 'TEXT' | 'AUDIO';
  content: string;
}

export interface ChecklistItem {
  section: string;
  item_number: number;
  item_text: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL' | 'N/A';
  evidence: string;
  mechanism: string;
  classification: 'STRUCTURAL' | 'CONTEXTUAL';
  impact_score: number;
}

export interface SectionScores {
  section_1_hook: number;
  section_2_structure: number;
  section_3_audio: number;
  section_4_emotional: number;
  section_5_rewatch: number;
  section_6_audience: number;
  section_7_algorithmic: number;
  section_8_distribution: number;
  section_9a_physiological: number;
  section_9b_emotional: number;
  section_9c_behavioral: number;
  section_10_psychology: number;
  section_11_context: number;
  section_12_saturation: number;
  section_13_intensity: number;
  section_14_advanced: number;
  section_15_formula: number;
  weighted_total: number;
  critical_failures: string[];
}

export interface ViralGrade {
  tier: 'A' | 'B' | 'C';
  score: number;
  justification: string[];
}

export interface ReplicationDecision {
  should_replicate: boolean;
  must_change: string[];
  never_copy: string[];
  best_niches: string[];
}

export interface GeminiAnalysis {
  step1_transcription: TranscriptionItem[];
  step2_checklist: ChecklistItem[];
  step3_viral_mechanism: string;
  step4_scores: SectionScores;
  step5_grade: ViralGrade;
  step6_replication: ReplicationDecision;
  metadata: {
    video_duration: string;
    analysis_timestamp: string;
    user_context: UserContext;
  };
}

// Phase 2: GPT Evaluation Types
export interface ValidationResult {
  transcription_issues: string[];
  checklist_contradictions: string[];
  scoring_anomalies: string[];
  overall_reliability: 'HIGH' | 'MEDIUM' | 'LOW';
  adjusted_gemini_score: number;
}

export interface ReplicationChecklistItem {
  item_number: number;
  item_text: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL';
  response: string;
}

export interface ReplicationChecklistSection {
  section: string;
  section_number: number;
  items: ReplicationChecklistItem[];
  section_score: number;
}

export interface ReplicationScoring {
  section_scores: { [key: string]: number };
  foundation_average: number;
  core_transfer_average: number;
  niche_fit_average: number;
  total_score: number;
  critical_blockers: string[];
}

export interface Verdict {
  decision: 'REPLICABLE' | 'CONDITIONALLY_REPLICABLE' | 'NON_REPLICABLE';
  confidence: number;
  reasoning: string[];
}

export interface ModificationRequirement {
  category: 'HOOK' | 'STRUCTURE' | 'EMOTION' | 'LANGUAGE' | 'NICHE';
  checklist_ref: number;
  issue: string;
  solution: string;
}

export interface Modifications {
  mandatory_changes: ModificationRequirement[];
  preserve_structural: string[];
  replace_contextual: string[];
  avoid: string[];
}

export interface GPTEvaluation {
  task1_validation: ValidationResult;
  task2_replication_checklist: ReplicationChecklistSection[];
  task3_scoring: ReplicationScoring;
  task4_verdict: Verdict;
  task5_modifications: Modifications;
  proceed_to_script_generation: boolean;
}

// Phase 3: Script Generation Types
export interface IntentLock {
  primary_virality_driver: string;
  emotional_debt_targeted: string;
  internal_conflict_hijacked: string;
  primary_behavioral_outcome: 'rewatch' | 'send' | 'save';
  post_viewer_identity_shift: string;
}

export interface PreProduction {
  equipment_needed: string[];
  location_requirements: string;
  talent_notes: string;
  props_needed: string[];
}

export interface Dialogue {
  spoken_text: string;
  delivery_notes: string;
  tone: string;
  forbidden?: string[];
}

export interface OnScreenText {
  text: string;
  timing: string;
  position: string;
  style: string;
  differs_from_spoken: boolean;
}

export interface VisualDirection {
  shot_type: string;
  framing: string;
  camera_movement: string;
  subject_movement: string;
  lighting: string;
  background: string;
  anomaly_or_pattern_interrupt?: string;
  loop_connection?: string;
  subject_position?: string;
}

export interface ActionCue {
  timestamp: string;
  action: string;
}

export interface Audio {
  music: string;
  music_volume: string;
  music_timing?: string;
  sound_effects?: string;
  sfx_timing?: string;
  voice_processing?: string;
}

export interface EditingNotes {
  transition_in: string;
  transition_out: string;
  effects?: string;
  color_grade?: string;
  cuts_in_scene: number;
  visual_resets?: string;
  loop_mechanism?: string;
  final_frame?: string;
}

export interface ChecklistCompliance {
  master_187_items: number[];
  replication_123_items: number[];
  script_execution_items: number[];
  notes: string;
}

export interface Scene {
  scene_number: number;
  scene_name: string;
  timestamp: string;
  duration: string;
  dialogue: Dialogue;
  on_screen_text: OnScreenText;
  visual_direction: VisualDirection;
  action_cues: ActionCue[];
  audio: Audio;
  editing_notes: EditingNotes;
  checklist_compliance: ChecklistCompliance;
}

export interface SentenceBreakdown {
  sentence_number: number;
  spoken_text: string;
  on_screen_text: string;
  timestamp: string;
  function: string;
  emotional_debt_addressed?: string;
  conflict_hijacked?: string;
  checklist_items_satisfied: number[];
}

export interface TechnicalSpecs {
  aspect_ratio: string;
  resolution: string;
  frame_rate: string;
  export_settings: string;
  safe_zones: {
    top: string;
    bottom: string;
    sides: string;
  };
}

export interface ChecklistSummary {
  master_187_compliance: {
    items_satisfied: number;
    total_items: number;
    percentage: number;
    critical_items_status: {
      hook_section: string;
      retention_section: string;
    };
  };
  replication_123_compliance: {
    items_satisfied: number;
    total_items: number;
    percentage: number;
  };
  key_gaps: string[];
}

export interface ModificationApplied {
  from_evaluation: string;
  implemented_in: string;
  original_ref: string;
}

export interface DirectorNotes {
  critical_moments: string[];
  common_mistakes_to_avoid: string[];
  success_indicators: string[];
}

export interface RoleSpecificInstructions {
  creator: string[];
  videographer: string[];
  editor: string[];
}

export interface GeneratedScript {
  script_metadata: {
    title: string;
    version: string;
    total_duration: string;
    target_platform: string;
    niche: string;
    generated_date: string;
  };
  intent_lock: IntentLock;
  pre_production: PreProduction;
  scenes: Scene[];
  full_script_text: {
    dialogue_only: string;
    on_screen_only: string;
    combined_transcript: string;
  };
  sentence_by_sentence_breakdown: SentenceBreakdown[];
  technical_specs: TechnicalSpecs;
  checklist_summary: ChecklistSummary;
  modifications_applied: ModificationApplied[];
  director_notes: DirectorNotes;
  role_specific_instructions: RoleSpecificInstructions;
}

// Phase 4: Script Evaluation Types
export interface ScriptEvaluationItem {
  item_number: number;
  item_text: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL';
  evidence: string;
  impact: string;
}

export interface ScriptEvaluationSection {
  section: string;
  section_number: number;
  items: ScriptEvaluationItem[];
  section_score: number;
}

export interface ScriptEvaluation {
  sections: ScriptEvaluationSection[];
  total_score: number;
  percentage: number;
  critical_failures: string[];
  pass: boolean;
  specific_failures: string[];
}

// Phase 5: Revision Types
export interface RevisionRequest {
  iteration: number;
  failed_sections: string[];
  specific_issues: string[];
  regenerate_only: string[];
}

// Complete System Types
export interface ViralReelAnalysisResult {
  phase0_user_context: UserContext;
  phase1_gemini_analysis: GeminiAnalysis;
  phase2_gpt_evaluation: GPTEvaluation;
  phase3_generated_script?: GeneratedScript;
  phase4_script_evaluation?: ScriptEvaluation;
  phase5_revisions?: RevisionRequest[];
  final_output: {
    status: 'COMPLETED' | 'NON_REPLICABLE' | 'FAILED';
    final_script?: GeneratedScript;
    all_analyses: boolean;
    export_ready: boolean;
  };
}
