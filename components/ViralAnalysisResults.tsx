'use client';

import { useState } from 'react';
import { ViralReelAnalysisResult } from '@/types/viral-analysis';
import { Download, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ViralAnalysisResultsProps {
  result: ViralReelAnalysisResult;
  onReset: () => void;
}

export default function ViralAnalysisResults({ result, onReset }: ViralAnalysisResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `viral-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTierBadge = (tier: 'A' | 'B' | 'C') => {
    const badges = {
      A: { bg: 'bg-green-100', text: 'text-green-800', label: 'Tier A - High Replicability' },
      B: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Tier B - Partial Replication' },
      C: { bg: 'bg-red-100', text: 'text-red-800', label: 'Tier C - Non-Replicable' },
    };
    const badge = badges[tier];
    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getVerdictIcon = (decision: string) => {
    if (decision === 'REPLICABLE') return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (decision === 'CONDITIONALLY_REPLICABLE') return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  const Section = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => {
    const isExpanded = expandedSections.has(id);
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isExpanded && <div className="p-6">{children}</div>}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Viral Reel Analysis Complete
            </h2>
            <p className="text-gray-600">
              {result.phase0_user_context.niche} • {result.phase0_user_context.category}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadJSON}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              New Analysis
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-900 mb-1">Gemini Score</div>
            <div className="text-3xl font-bold text-blue-600">
              {result.phase1_gemini_analysis.step4_scores.weighted_total.toFixed(1)}/10
            </div>
            <div className="mt-2">
              {getTierBadge(result.phase1_gemini_analysis.step5_grade.tier)}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-green-900 mb-1">Replication Score</div>
            <div className="text-3xl font-bold text-green-600">
              {result.phase2_gpt_evaluation.task3_scoring.total_score.toFixed(1)}/10
            </div>
            <div className="mt-2 flex items-center gap-2">
              {getVerdictIcon(result.phase2_gpt_evaluation.task4_verdict.decision)}
              <span className="text-sm font-medium text-green-900">
                {result.phase2_gpt_evaluation.task4_verdict.decision.replace('_', ' ')}
              </span>
            </div>
          </div>

          {result.phase4_script_evaluation && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-900 mb-1">Script Quality</div>
              <div className="text-3xl font-bold text-purple-600">
                {result.phase4_script_evaluation.percentage.toFixed(0)}%
              </div>
              <div className="mt-2 flex items-center gap-2">
                {result.phase4_script_evaluation.pass ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm font-medium text-purple-900">
                  {result.phase4_script_evaluation.pass ? 'Approved' : 'Needs Revision'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phase 1: Gemini Analysis */}
      <Section title="Phase 1: Gemini Analysis (187-Item Checklist)" id="phase1">
        <div className="space-y-6">
          {/* Viral Mechanism */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Viral Mechanism</h4>
            <p className="text-gray-700 leading-relaxed">
              {result.phase1_gemini_analysis.step3_viral_mechanism}
            </p>
          </div>

          {/* Section Scores */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Section Scores</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(result.phase1_gemini_analysis.step4_scores)
                .filter(([key]) => key.startsWith('section_'))
                .map(([key, score]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">
                      {key.replace('section_', 'Section ').replace('_', ' ')}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{score}/10</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Replication Decision */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Replication Guidance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Must Change:</div>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {result.phase1_gemini_analysis.step6_replication.must_change.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Never Copy:</div>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {result.phase1_gemini_analysis.step6_replication.never_copy.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Phase 2: GPT Evaluation */}
      <Section title="Phase 2: GPT Evaluation (123-Item Replication Checklist)" id="phase2">
        <div className="space-y-6">
          {/* Verdict */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {getVerdictIcon(result.phase2_gpt_evaluation.task4_verdict.decision)}
              <h4 className="font-semibold text-gray-900">
                {result.phase2_gpt_evaluation.task4_verdict.decision.replace('_', ' ')}
              </h4>
              <span className="text-sm text-gray-600">
                ({result.phase2_gpt_evaluation.task4_verdict.confidence}% confidence)
              </span>
            </div>
            <div className="space-y-2">
              {result.phase2_gpt_evaluation.task4_verdict.reasoning.map((reason, i) => (
                <p key={i} className="text-sm text-gray-700">• {reason}</p>
              ))}
            </div>
          </div>

          {/* Modifications Required */}
          {result.phase2_gpt_evaluation.task5_modifications.mandatory_changes.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Mandatory Modifications</h4>
              <div className="space-y-3">
                {result.phase2_gpt_evaluation.task5_modifications.mandatory_changes.map((mod, i) => (
                  <div key={i} className="border-l-4 border-blue-500 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-semibold">
                        {mod.category}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Issue: {mod.issue}
                        </div>
                        <div className="text-sm text-gray-700">
                          Solution: {mod.solution}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Phase 3: Generated Script */}
      {result.phase3_generated_script && (
        <Section title="Phase 3: Generated Shooting Script" id="phase3">
          <div className="space-y-6">
            {/* Intent Lock */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Intent Lock</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Virality Driver:</span>
                  <p className="text-gray-600 mt-1">{result.phase3_generated_script.intent_lock.primary_virality_driver}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Behavioral Outcome:</span>
                  <p className="text-gray-600 mt-1">{result.phase3_generated_script.intent_lock.primary_behavioral_outcome}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Emotional Debt:</span>
                  <p className="text-gray-600 mt-1">{result.phase3_generated_script.intent_lock.emotional_debt_targeted}</p>
                </div>
              </div>
            </div>

            {/* Scenes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Scene Breakdown</h4>
              <div className="space-y-4">
                {result.phase3_generated_script.scenes.map((scene) => (
                  <div key={scene.scene_number} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">
                        Scene {scene.scene_number}: {scene.scene_name}
                      </h5>
                      <span className="text-sm text-gray-600">{scene.timestamp}</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Dialogue:</span>
                        <p className="text-gray-600 mt-1">{scene.dialogue.spoken_text}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">On-Screen Text:</span>
                        <p className="text-gray-600 mt-1">{scene.on_screen_text.text}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Visual:</span>
                        <p className="text-gray-600 mt-1">{scene.visual_direction.shot_type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Script */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Complete Script</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {result.phase3_generated_script.full_script_text.combined_transcript}
                </pre>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Phase 4: Script Evaluation */}
      {result.phase4_script_evaluation && (
        <Section title="Phase 4: Script Evaluation (150-Item Checklist)" id="phase4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Total Score</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.phase4_script_evaluation.total_score}/150
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Percentage</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.phase4_script_evaluation.percentage.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Critical Failures</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.phase4_script_evaluation.critical_failures.length}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.phase4_script_evaluation.pass ? '✅ Pass' : '❌ Fail'}
                </div>
              </div>
            </div>

            {result.phase4_script_evaluation.critical_failures.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Critical Issues</h4>
                <div className="space-y-2">
                  {result.phase4_script_evaluation.critical_failures.map((failure, i) => (
                    <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                      {failure}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Phase 5: Revisions */}
      {result.phase5_revisions && result.phase5_revisions.length > 0 && (
        <Section title="Phase 5: Script Revisions" id="phase5">
          <div className="space-y-4">
            {result.phase5_revisions.map((revision, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  Iteration {revision.iteration}
                </h5>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    <span className="font-medium">Failed Sections:</span>
                    <p>{revision.failed_sections.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Issues Addressed:</span>
                    <ul className="list-disc list-inside mt-1">
                      {revision.specific_issues.map((issue, j) => (
                        <li key={j}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Final Status */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-lg font-semibold text-gray-900 mb-2">
          Final Status: {result.final_output.status}
        </div>
        {result.final_output.final_script && (
          <p className="text-gray-600">
            Script ready for production. Download the complete analysis package above.
          </p>
        )}
      </div>
    </div>
  );
}
