import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/gemini-viral-simple';
import { evaluateWithGPT, generateScript, evaluateScript, reviseScript } from '@/lib/openai-viral';
import {
  UserContext,
  GeminiAnalysis,
  GPTEvaluation,
  GeneratedScript,
  ScriptEvaluation,
  ViralReelAnalysisResult,
} from '@/types/viral-analysis';

// Vercel serverless function configuration
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes (requires Pro plan)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const userContext = JSON.parse(formData.get('context') as string) as UserContext;

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Check file size (Vercel limit: 4.5MB on Hobby, 100MB on Pro)
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: `Video file too large. Maximum size is ${maxSize / (1024 * 1024)}MB. Your file is ${(videoFile.size / (1024 * 1024)).toFixed(2)}MB.` },
        { status: 413 }
      );
    }

    // Convert file to base64 for Gemini
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Video = buffer.toString('base64');

    const result: Partial<ViralReelAnalysisResult> = {
      phase0_user_context: userContext,
    };

    // PHASE 1: Gemini Video Analysis (187-item checklist)
    console.log('Phase 1: Starting Gemini analysis...');
    const geminiAnalysis: GeminiAnalysis = await analyzeWithGemini(
      base64Video,
      videoFile.type,
      userContext
    );
    result.phase1_gemini_analysis = geminiAnalysis;

    // PHASE 2: GPT Evaluation & Replication Check (123-item checklist)
    console.log('Phase 2: Starting GPT evaluation...');
    const gptEvaluation: GPTEvaluation = await evaluateWithGPT(
      geminiAnalysis,
      userContext
    );
    result.phase2_gpt_evaluation = gptEvaluation;

    // Check if replication should proceed
    if (!gptEvaluation.proceed_to_script_generation ||
        gptEvaluation.task4_verdict.decision === 'NON_REPLICABLE') {
      console.log('Phase 2: NON-REPLICABLE verdict, stopping analysis');
      return NextResponse.json({
        ...result,
        final_output: {
          status: 'NON_REPLICABLE',
          all_analyses: true,
          export_ready: true,
        },
      });
    }

    // PHASE 3: Script Generation
    console.log('Phase 3: Generating script...');
    let generatedScript: GeneratedScript = await generateScript(
      geminiAnalysis,
      gptEvaluation,
      userContext
    );
    result.phase3_generated_script = generatedScript;

    // PHASE 4 & 5: Script Evaluation and Revision Loop (max 3 iterations)
    const maxIterations = 3;
    let currentIteration = 0;
    const revisions = [];

    while (currentIteration < maxIterations) {
      console.log(`Phase 4: Evaluating script (iteration ${currentIteration + 1})...`);

      const scriptEvaluation: ScriptEvaluation = await evaluateScript(
        generatedScript,
        geminiAnalysis,
        gptEvaluation
      );
      result.phase4_script_evaluation = scriptEvaluation;

      // Check if script passes (≥90% AND no critical failures)
      if (scriptEvaluation.pass && scriptEvaluation.critical_failures.length === 0) {
        console.log('Phase 4: Script passed evaluation');
        break;
      }

      // If we've reached max iterations, stop
      if (currentIteration >= maxIterations - 1) {
        console.log('Phase 5: Max iterations reached');
        break;
      }

      // PHASE 5: Revise failed sections
      console.log(`Phase 5: Revising script (iteration ${currentIteration + 1})...`);

      const revisionRequest = {
        iteration: currentIteration + 1,
        failed_sections: scriptEvaluation.specific_failures || [],
        specific_issues: scriptEvaluation.critical_failures,
        regenerate_only: scriptEvaluation.specific_failures || [],
      };

      revisions.push(revisionRequest);

      generatedScript = await reviseScript(
        generatedScript,
        scriptEvaluation,
        geminiAnalysis,
        gptEvaluation
      );

      result.phase3_generated_script = generatedScript;
      currentIteration++;
    }

    result.phase5_revisions = revisions;

    // Final output
    const finalOutput = {
      status: 'COMPLETED' as const,
      final_script: generatedScript,
      all_analyses: true,
      export_ready: true,
    };

    result.final_output = finalOutput;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in viral analysis:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
