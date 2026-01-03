'use client';

import { Loader2, CheckCircle, Circle } from 'lucide-react';

interface ViralAnalysisProgressProps {
  currentPhase: number;
  phaseStatus: {
    phase: number;
    name: string;
    status: 'pending' | 'in_progress' | 'completed';
    message?: string;
  }[];
}

export default function ViralAnalysisProgress({ currentPhase, phaseStatus }: ViralAnalysisProgressProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Viral Reel
          </h2>
          <p className="text-gray-600">
            This comprehensive analysis may take 2-4 minutes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${(currentPhase / 5) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              />
            </div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Phase {currentPhase} of 5
          </div>
        </div>

        {/* Phase Steps */}
        <div className="space-y-4">
          {phaseStatus.map((phase) => (
            <div
              key={phase.phase}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                phase.status === 'in_progress'
                  ? 'bg-blue-50 border border-blue-200'
                  : phase.status === 'completed'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {phase.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : phase.status === 'in_progress' ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-semibold ${
                      phase.status === 'in_progress'
                        ? 'text-blue-900'
                        : phase.status === 'completed'
                        ? 'text-green-900'
                        : 'text-gray-600'
                    }`}
                  >
                    Phase {phase.phase}: {phase.name}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      phase.status === 'in_progress'
                        ? 'bg-blue-200 text-blue-800'
                        : phase.status === 'completed'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {phase.status === 'in_progress'
                      ? 'In Progress'
                      : phase.status === 'completed'
                      ? 'Completed'
                      : 'Pending'}
                  </span>
                </div>
                {phase.message && (
                  <p
                    className={`text-sm mt-1 ${
                      phase.status === 'in_progress' ? 'text-blue-700' : 'text-gray-600'
                    }`}
                  >
                    {phase.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What's Happening?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Gemini AI is transcribing and analyzing your video against 187 checkpoints</li>
            <li>• GPT-4 is evaluating replication potential with 123-item checklist</li>
            <li>• If replicable, generating custom shooting script for your niche</li>
            <li>• Evaluating script quality against 150-item execution checklist</li>
            <li>• Refining script up to 3 iterations for 90%+ quality score</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
