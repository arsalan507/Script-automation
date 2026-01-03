import { GoogleGenAI } from '@google/genai';
import { UserContext, GeminiAnalysis } from '@/types/viral-analysis';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Simplified Gemini analysis that works reliably
 * This is a temporary implementation to get the system working
 * TODO: Gradually expand to full 187-item checklist
 */
export async function analyzeWithGemini(
  videoBase64: string,
  mimeType: string,
  userContext: UserContext
): Promise<GeminiAnalysis> {
  const prompt = `Analyze this video reel for viral potential. Provide a comprehensive analysis in JSON format.

USER CONTEXT:
- Niche: ${userContext.niche}
- Category: ${userContext.category}
- Product: ${userContext.productService}
- Outcome: ${userContext.targetOutcome}
- Audience: ${userContext.targetAudience}

Provide analysis as valid JSON with this structure:
{
  "step1_transcription": [
    {"timestamp_start": "00:00.0", "timestamp_end": "00:01.0", "type": "VISUAL", "content": "description"}
  ],
  "step2_checklist": [
    {"section": "Hook", "item_number": 1, "item_text": "description", "status": "PASS", "evidence": "timestamp reference", "mechanism": "explanation", "classification": "STRUCTURAL", "impact_score": 8}
  ],
  "step3_viral_mechanism": "Explanation of why this went viral (150-200 words)",
  "step4_scores": {
    "section_1_hook": 8,
    "section_2_structure": 7,
    "section_3_audio": 9,
    "section_4_emotional": 8,
    "section_5_rewatch": 7,
    "section_6_audience": 8,
    "section_7_algorithmic": 10,
    "section_8_distribution": 6,
    "section_9a_physiological": 8,
    "section_9b_emotional": 7,
    "section_9c_behavioral": 8,
    "section_10_psychology": 7,
    "section_11_context": 6,
    "section_12_saturation": 7,
    "section_13_intensity": 8,
    "section_14_advanced": 7,
    "section_15_formula": 8,
    "weighted_total": 7.5,
    "critical_failures": []
  },
  "step5_grade": {
    "tier": "B",
    "score": 7.5,
    "justification": ["reason 1", "reason 2", "reason 3"]
  },
  "step6_replication": {
    "should_replicate": true,
    "must_change": ["change 1", "change 2"],
    "never_copy": ["contextual element 1"],
    "best_niches": ["niche 1", "niche 2", "niche 3"]
  },
  "metadata": {
    "video_duration": "00:27",
    "analysis_timestamp": "${new Date().toISOString()}",
    "user_context": {
      "niche": "${userContext.niche}",
      "category": "${userContext.category}",
      "product_service": "${userContext.productService}",
      "target_outcome": "${userContext.targetOutcome}",
      "target_audience": "${userContext.targetAudience}"
    }
  }
}

IMPORTANT:
- Return ONLY valid JSON
- Escape all special characters in strings
- Keep string values concise (max 200 chars each)
- Use simple, direct language
- Provide at least 10 checklist items covering: hook, structure, audio, emotional triggers, rewatch potential`;

  try {
    const result = await genai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: videoBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4, // Lower temperature for more consistent output
        maxOutputTokens: 8192,
      },
    });

    const text = result.text || '';

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0].trim();
    }

    // Parse JSON
    const analysis: GeminiAnalysis = JSON.parse(jsonText);

    console.log('✅ Gemini analysis completed successfully');
    console.log(`- Transcription items: ${analysis.step1_transcription?.length || 0}`);
    console.log(`- Checklist items: ${analysis.step2_checklist?.length || 0}`);
    console.log(`- Weighted score: ${analysis.step4_scores?.weighted_total || 0}`);

    return analysis;
  } catch (error) {
    console.error('❌ Gemini analysis failed:', error);
    throw new Error(`Gemini analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
