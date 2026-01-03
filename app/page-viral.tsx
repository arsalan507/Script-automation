'use client';

import { useState } from 'react';
import Phase0UserInput from '@/components/Phase0UserInput';
import ViralAnalysisProgress from '@/components/ViralAnalysisProgress';
import ViralAnalysisResults from '@/components/ViralAnalysisResults';
import { UserContext, ViralReelAnalysisResult } from '@/types/viral-analysis';

export default function ViralAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<ViralReelAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseStatus, setPhaseStatus] = useState<
    {
      phase: number;
      name: string;
      status: 'pending' | 'in_progress' | 'completed';
      message?: string;
    }[]
  >([
    { phase: 1, name: 'Gemini Video Analysis', status: 'pending', message: '187-item Master Checklist evaluation' },
    { phase: 2, name: 'GPT Replication Evaluation', status: 'pending', message: '123-item Replication Checklist' },
    { phase: 3, name: 'Script Generation', status: 'pending', message: 'Complete shooting script creation' },
    { phase: 4, name: 'Script Quality Evaluation', status: 'pending', message: '150-item Script Checklist' },
    { phase: 5, name: 'Script Refinement', status: 'pending', message: 'Iterative improvement (up to 3 rounds)' },
  ]);

  const updatePhaseStatus = (phase: number, status: 'pending' | 'in_progress' | 'completed', message?: string) => {
    setPhaseStatus((prev) =>
      prev.map((p) => (p.phase === phase ? { ...p, status, message: message || p.message } : p))
    );
    if (status === 'in_progress') {
      setCurrentPhase(phase);
    }
  };

  const handleSubmit = async (context: UserContext, videoFile: File) => {
    setIsAnalyzing(true);
    setCurrentPhase(1);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('context', JSON.stringify(context));

      // Phase 1
      updatePhaseStatus(1, 'in_progress', 'Transcribing and analyzing video...');

      const response = await fetch('/api/viral-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      // Simulated phase updates (in reality, you'd use Server-Sent Events or polling)
      updatePhaseStatus(1, 'completed');
      updatePhaseStatus(2, 'in_progress', 'Evaluating replication potential...');

      const result: ViralReelAnalysisResult = await response.json();

      updatePhaseStatus(2, 'completed');

      // Check if we proceeded to script generation
      if (result.phase3_generated_script) {
        updatePhaseStatus(3, 'in_progress', 'Generating custom shooting script...');
        updatePhaseStatus(3, 'completed');

        if (result.phase4_script_evaluation) {
          updatePhaseStatus(4, 'in_progress', 'Evaluating script quality...');
          updatePhaseStatus(4, 'completed');

          if (result.phase5_revisions && result.phase5_revisions.length > 0) {
            updatePhaseStatus(5, 'in_progress', `Refining script (${result.phase5_revisions.length} iteration(s))...`);
            updatePhaseStatus(5, 'completed');
          }
        }
      }

      setAnalysisResult(result);
    } catch (error) {
      console.error('Error during analysis:', error);
      alert(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCurrentPhase(0);
    setPhaseStatus([
      { phase: 1, name: 'Gemini Video Analysis', status: 'pending', message: '187-item Master Checklist evaluation' },
      { phase: 2, name: 'GPT Replication Evaluation', status: 'pending', message: '123-item Replication Checklist' },
      { phase: 3, name: 'Script Generation', status: 'pending', message: 'Complete shooting script creation' },
      { phase: 4, name: 'Script Quality Evaluation', status: 'pending', message: '150-item Script Checklist' },
      { phase: 5, name: 'Script Refinement', status: 'pending', message: 'Iterative improvement (up to 3 rounds)' },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Viral Reel Analysis System V2
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                5-Phase AI-powered viral content analysis and script generation
              </p>
            </div>
            {analysisResult && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysisResult && !isAnalyzing && (
          <Phase0UserInput onSubmit={handleSubmit} />
        )}

        {isAnalyzing && (
          <ViralAnalysisProgress currentPhase={currentPhase} phaseStatus={phaseStatus} />
        )}

        {analysisResult && !isAnalyzing && (
          <ViralAnalysisResults result={analysisResult} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Powered by Gemini 2.0 Flash & GPT-4 Turbo • 187 + 123 + 150 = 460 Total Checkpoints
          </p>
        </div>
      </footer>
    </div>
  );
}
