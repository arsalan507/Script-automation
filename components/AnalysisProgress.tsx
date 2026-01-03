'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check, Upload, Eye, Brain, Sparkles } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
}

const steps: Step[] = [
  {
    id: 1,
    name: 'Uploading Video',
    description: 'Uploading your video to our servers...',
    icon: <Upload className="w-6 h-6" />,
    duration: 2000,
  },
  {
    id: 2,
    name: 'Gemini Analysis',
    description: 'Analyzing visuals, audio, transcription, and hooks...',
    icon: <Eye className="w-6 h-6" />,
    duration: 5000,
  },
  {
    id: 3,
    name: 'ChatGPT Processing',
    description: 'Creating formula and replication strategy...',
    icon: <Brain className="w-6 h-6" />,
    duration: 4000,
  },
  {
    id: 4,
    name: 'Generating Report',
    description: 'Compiling analysis and generating script...',
    icon: <Sparkles className="w-6 h-6" />,
    duration: 2000,
  },
];

export default function AnalysisProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let delay = 0;

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
      }, delay);
      timers.push(timer);
      delay += step.duration;
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Video
          </h2>
          <p className="text-gray-600">
            This will take approximately 1-2 minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div
                key={step.id}
                className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : isCompleted
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      isActive || isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isActive
                        ? 'text-blue-700'
                        : isCompleted
                        ? 'text-green-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {isCompleted
                      ? 'Completed'
                      : isActive
                      ? step.description
                      : 'Waiting...'}
                  </p>
                </div>

                {/* Status Badge */}
                {isActive && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Processing
                    </span>
                  </div>
                )}
                {isCompleted && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Done
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
