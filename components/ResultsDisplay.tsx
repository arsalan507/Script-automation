'use client';

import { AnalysisResult } from '@/types/analysis';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Copy,
  Video,
  FileText,
  TrendingUp,
  Clock,
  Hash,
  Palette,
  Music,
  Zap,
} from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { geminiAnalysis, chatgptFormula, autoApproved } = result;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="w-8 h-8" />;
    if (score >= 6) return <AlertCircle className="w-8 h-8" />;
    return <XCircle className="w-8 h-8" />;
  };

  const downloadReport = () => {
    const reportData = JSON.stringify(result, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${result.id}.json`;
    a.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!geminiAnalysis || !chatgptFormula) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Score Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div
              className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(
                chatgptFormula.score
              )}`}
            >
              {getScoreIcon(chatgptFormula.score)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Score: {chatgptFormula.score}/10
              </h2>
              <p className="text-gray-600 mt-1">
                {autoApproved ? (
                  <span className="text-green-600 font-semibold">
                    ✓ Auto-Approved for Production
                  </span>
                ) : (
                  <span className="text-yellow-600 font-semibold">
                    Requires Manual Review
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Viral Formula */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h3 className="text-2xl font-bold text-gray-900">Viral Formula</h3>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          {chatgptFormula.formula}
        </p>
      </div>

      {/* Viral Elements */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Viral Elements Detected
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chatgptFormula.viralElements.map((element, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg"
            >
              <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-800">{element}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Replication Checklist */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Replication Checklist
        </h3>
        <div className="space-y-3">
          {chatgptFormula.checklist.map((item, index) => (
            <div
              key={index}
              className={`flex items-start justify-between p-4 rounded-lg border-2 ${
                item.present
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3 flex-1">
                {item.present ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{item.item}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  item.importance === 'high'
                    ? 'bg-red-100 text-red-800'
                    : item.importance === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.importance}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transcription */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Transcription</h3>
          </div>
          <button
            onClick={() => copyToClipboard(geminiAnalysis.transcription)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {geminiAnalysis.transcription}
          </p>
        </div>
      </div>

      {/* Hook Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Hook Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Opening Hook</h4>
              <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                {geminiAnalysis.hookAnalysis.openingHook}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Screen Hook</h4>
              <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
                {geminiAnalysis.hookAnalysis.screenHook}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Story Hook</h4>
              <p className="text-gray-700 bg-green-50 p-4 rounded-lg">
                {geminiAnalysis.hookAnalysis.storyHook}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Closing Hook</h4>
              <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">
                {geminiAnalysis.hookAnalysis.closingHook}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-pink-600" />
          <h3 className="text-2xl font-bold text-gray-900">Visual Analysis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Visual Style</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {geminiAnalysis.visualBreakdown.visualStyle}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Color Palette</h4>
            <div className="flex flex-wrap gap-2">
              {geminiAnalysis.visualBreakdown.colorPalette.map((color, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Scene Breakdown</h4>
          <div className="space-y-3">
            {geminiAnalysis.visualBreakdown.scenes.map((scene, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {scene.timestamp}
                  </span>
                  <span className="text-sm text-gray-500">
                    {scene.duration}s
                  </span>
                </div>
                <p className="text-gray-700">{scene.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pacing & Audio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pacing */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">Pacing Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{geminiAnalysis.pacing.totalDuration}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clip Count:</span>
              <span className="font-semibold">{geminiAnalysis.pacing.clipCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Clip:</span>
              <span className="font-semibold">{geminiAnalysis.pacing.averageClipDuration}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tempo:</span>
              <span className="font-semibold capitalize">{geminiAnalysis.pacing.tempo}</span>
            </div>
          </div>
        </div>

        {/* Audio */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Music className="w-6 h-6 text-pink-600" />
            <h3 className="text-xl font-bold text-gray-900">Audio Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Music:</span>
              <span className="font-semibold">
                {geminiAnalysis.audioAnalysis.music ? 'Yes' : 'No'}
              </span>
            </div>
            {geminiAnalysis.audioAnalysis.musicStyle && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Style:</span>
                <span className="font-semibold">{geminiAnalysis.audioAnalysis.musicStyle}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Voiceover:</span>
              <span className="font-semibold">
                {geminiAnalysis.audioAnalysis.voiceover ? 'Yes' : 'No'}
              </span>
            </div>
            {geminiAnalysis.audioAnalysis.soundEffects.length > 0 && (
              <div>
                <span className="text-gray-600 block mb-2">Sound Effects:</span>
                <div className="flex flex-wrap gap-2">
                  {geminiAnalysis.audioAnalysis.soundEffects.map((effect, idx) => (
                    <span key={idx} className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-sm">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Improvement Suggestions
        </h3>
        <div className="space-y-3">
          {chatgptFormula.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <p className="text-gray-800">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Replication Strategy */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Replication Strategy
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          {chatgptFormula.replicationStrategy}
        </p>
      </div>
    </div>
  );
}
