'use client';

import { useState } from 'react';
import { UserContext } from '@/types/viral-analysis';
import { Upload } from 'lucide-react';

interface Phase0UserInputProps {
  onSubmit: (context: UserContext, videoFile: File) => void;
}

export default function Phase0UserInput({ onSubmit }: Phase0UserInputProps) {
  const [context, setContext] = useState<UserContext>({
    niche: '',
    category: '',
    productService: '',
    targetOutcome: '',
    targetAudience: '',
    targetDuration: 27,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        alert('Please upload a video file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      alert('Please upload a video file');
      return;
    }

    if (!context.niche || !context.category || !context.productService ||
        !context.targetOutcome || !context.targetAudience) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit(context, videoFile);
  };

  const isFormValid = videoFile && context.niche && context.category &&
                       context.productService && context.targetOutcome &&
                       context.targetAudience;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Phase 0: Project Context
          </h2>
          <p className="text-gray-600">
            Provide detailed information about your niche and target audience to enable precise viral analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Viral Reel to Analyze
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {videoFile ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">{videoFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => setVideoFile(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your video here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Select Video
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Context Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niche/Industry <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={context.niche}
                onChange={(e) => setContext({ ...context, niche: e.target.value })}
                placeholder="e.g., SaaS Marketing, Fitness, E-commerce"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={context.category}
                onChange={(e) => setContext({ ...context, category: e.target.value })}
                placeholder="e.g., Educational, Entertainment, Product Demo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product/Service <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={context.productService}
                onChange={(e) => setContext({ ...context, productService: e.target.value })}
                placeholder="e.g., AI Video Editor, Fitness App, CRM Platform"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Duration (seconds)
              </label>
              <input
                type="number"
                value={context.targetDuration}
                onChange={(e) => setContext({ ...context, targetDuration: parseInt(e.target.value) })}
                min="10"
                max="90"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Outcome <span className="text-red-500">*</span>
            </label>
            <textarea
              value={context.targetOutcome}
              onChange={(e) => setContext({ ...context, targetOutcome: e.target.value })}
              placeholder="e.g., Generate qualified leads, Drive app downloads, Increase brand awareness"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <textarea
              value={context.targetAudience}
              onChange={(e) => setContext({ ...context, targetAudience: e.target.value })}
              placeholder="e.g., B2B SaaS founders aged 30-45, struggling with customer acquisition, seeking scalable growth strategies"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Analysis
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Phase 1: Gemini Analysis</h3>
          <p className="text-sm text-blue-700">
            187-item comprehensive checklist evaluation with transcription and viral mechanism analysis
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Phase 2: GPT Evaluation</h3>
          <p className="text-sm text-green-700">
            123-item replication checklist with niche-fit assessment and modification requirements
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Phase 3-5: Script Generation</h3>
          <p className="text-sm text-purple-700">
            Complete shooting script with scene-by-scene breakdown, evaluation, and iterative refinement
          </p>
        </div>
      </div>
    </div>
  );
}
