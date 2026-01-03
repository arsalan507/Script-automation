import { NextRequest, NextResponse } from 'next/server';
import { analyzeVideoWithGemini } from '@/lib/gemini';
import { generateFormulaWithChatGPT } from '@/lib/openai';
import { AnalysisResult } from '@/types/analysis';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max

export async function POST(request: NextRequest) {
  try {
    // Get the uploaded file
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!videoFile.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Validate file size (100MB max)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '100000000');
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large (max 100MB)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 1: Analyze with Gemini
    console.log('Step 1: Analyzing video with Gemini...');
    const geminiAnalysis = await analyzeVideoWithGemini(buffer, videoFile.type);

    // Step 2: Generate formula with ChatGPT
    console.log('Step 2: Generating formula with ChatGPT...');
    const chatgptFormula = await generateFormulaWithChatGPT(geminiAnalysis);

    // Step 3: Determine auto-approval
    const autoApproved = chatgptFormula.score >= 8;

    // Create result
    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      fileName: videoFile.name,
      videoUrl: '', // In production, upload to storage and get URL
      status: 'completed',
      geminiAnalysis,
      chatgptFormula,
      autoApproved,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    console.log(`Analysis complete! Score: ${chatgptFormula.score}/10, Auto-approved: ${autoApproved}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze video',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
