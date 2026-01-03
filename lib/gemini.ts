import { GoogleGenAI } from '@google/genai';
import { GeminiAnalysis } from '@/types/analysis';
import fs from 'fs';
import path from 'path';
import os from 'os';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeVideoWithGemini(
  videoBuffer: Buffer,
  mimeType: string
): Promise<GeminiAnalysis> {
  let tempFilePath: string | null = null;

  try {
    // Save video to temporary file
    const tempDir = os.tmpdir();
    const ext = mimeType.split('/')[1] || 'mp4';
    tempFilePath = path.join(tempDir, `video-${Date.now()}.${ext}`);
    fs.writeFileSync(tempFilePath, videoBuffer);

    // Upload file to Gemini using new SDK
    const uploadResult = await genAI.files.upload({
      file: tempFilePath,
      config: { mimeType },
    });

    console.log(`Uploaded file: ${uploadResult.uri}`);

    // Wait for file to be processed (poll until ACTIVE)
    let fileState = uploadResult.state;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max wait

    while (fileState !== 'ACTIVE' && attempts < maxAttempts) {
      if (fileState === 'FAILED') {
        throw new Error('File processing failed on Gemini servers');
      }

      console.log(`File state: ${fileState}, waiting...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      // Get updated file info
      const fileInfo = await genAI.files.get({ name: uploadResult.name || '' });
      fileState = fileInfo.state;
      attempts++;
    }

    if (fileState !== 'ACTIVE') {
      throw new Error('File did not become active within timeout period');
    }

    console.log('File is now ACTIVE and ready for analysis');

    const prompt = `Analyze this video reel and provide a comprehensive breakdown in the following JSON format:

{
  "transcription": "Full transcription of all spoken words and text in the video",
  "visualBreakdown": {
    "scenes": [
      {
        "timestamp": "00:00",
        "description": "Detailed description of what's happening",
        "duration": 3,
        "visualElements": ["element1", "element2"]
      }
    ],
    "colorPalette": ["color1", "color2", "color3"],
    "visualStyle": "Description of overall visual style (e.g., modern, vintage, minimalist)",
    "transitions": ["type of transitions used"]
  },
  "hookAnalysis": {
    "openingHook": "The very first words or visual that grabs attention",
    "screenHook": "The on-screen text or visual hook (first 1-2 seconds)",
    "storyHook": "The narrative hook that builds curiosity",
    "closingHook": "The final call-to-action or memorable ending",
    "hookTimings": [0, 1.5, 3.0, 8.5]
  },
  "pacing": {
    "totalDuration": 10,
    "clipCount": 5,
    "averageClipDuration": 2.0,
    "tempo": "fast"
  },
  "audioAnalysis": {
    "music": true,
    "musicStyle": "upbeat pop",
    "voiceover": true,
    "soundEffects": ["whoosh", "pop"]
  }
}

Important guidelines:
1. Be specific and detailed in your analysis
2. Capture the exact wording of hooks
3. Identify all visual elements that contribute to engagement
4. Note pacing - fast-paced reels have clips < 2s, slow-paced > 4s
5. Return ONLY valid JSON, no other text`;

    // Generate content using the uploaded file
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: uploadResult.mimeType || mimeType,
                fileUri: uploadResult.uri || '',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = result.text;

    if (!response) {
      throw new Error('No response received from Gemini');
    }

    // Extract JSON from response (in case there's extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }

    const analysis: GeminiAnalysis = JSON.parse(jsonMatch[0]);

    // Clean up uploaded file
    try {
      if (uploadResult.name) {
        await genAI.files.delete({ name: uploadResult.name });
      }
    } catch (deleteError) {
      console.error('Failed to delete uploaded file:', deleteError);
    }

    return analysis;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw new Error('Failed to analyze video with Gemini');
  } finally {
    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError);
      }
    }
  }
}
