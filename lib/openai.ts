import OpenAI from 'openai';
import { ChatGPTFormula } from '@/types/analysis';
import { GeminiAnalysis } from '@/types/analysis';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateFormulaWithChatGPT(
  geminiAnalysis: GeminiAnalysis
): Promise<ChatGPTFormula> {
  try {
    const prompt = `You are an expert in viral social media content analysis. I will provide you with a detailed analysis of a video reel from Gemini AI. Your task is to:

1. Create a "viral formula" - the core strategy that makes this reel work
2. Identify viral elements that contribute to engagement
3. Create a detailed replication checklist
4. Score the reel from 0-10 based on viral potential
5. Provide actionable suggestions for improvement
6. Create a replication strategy

Here's the Gemini analysis:
${JSON.stringify(geminiAnalysis, null, 2)}

Return your analysis in this exact JSON format:

{
  "score": 8.5,
  "formula": "Brief description of the viral formula (2-3 sentences)",
  "viralElements": [
    "Element 1 that makes it viral",
    "Element 2 that makes it viral"
  ],
  "checklist": [
    {
      "category": "Hook",
      "item": "Strong opening hook within first 2 seconds",
      "present": true,
      "importance": "high"
    }
  ],
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2"
  ],
  "replicationStrategy": "Detailed paragraph on how to replicate this reel's success"
}

Scoring criteria (0-10):
- 9-10: Exceptional viral potential, all elements perfect
- 7-8: Strong viral potential, minor improvements needed
- 5-6: Decent content, needs significant improvements
- 3-4: Weak viral potential, major issues
- 0-2: Poor viral potential

Important:
- Be honest and critical in scoring
- Focus on ACTIONABLE insights
- Checklist should have 10-15 items covering: hooks, pacing, visuals, audio, storytelling, CTA
- Return ONLY valid JSON`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a viral content strategist who analyzes social media reels and provides actionable insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response from ChatGPT');
    }

    const formula: ChatGPTFormula = JSON.parse(responseText);
    return formula;
  } catch (error) {
    console.error('ChatGPT formula generation error:', error);
    throw new Error('Failed to generate formula with ChatGPT');
  }
}
