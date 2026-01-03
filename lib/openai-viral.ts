import OpenAI from 'openai';
import {
  UserContext,
  GeminiAnalysis,
  GPTEvaluation,
  GeneratedScript,
  ScriptEvaluation,
} from '@/types/viral-analysis';
import {
  PROMPT_PHASE2_EVALUATION,
  PROMPT_PHASE3_SCRIPT_GENERATION,
  PROMPT_PHASE4_SCRIPT_EVALUATION,
  PROMPT_PHASE5_REVISION,
} from './prompts/viral-prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = 'gpt-4-turbo-preview';

/**
 * Phase 2: GPT Evaluation & Replication Checklist (123 Items)
 */
export async function evaluateWithGPT(
  geminiAnalysis: GeminiAnalysis,
  userContext: UserContext
): Promise<GPTEvaluation> {
  const prompt = PROMPT_PHASE2_EVALUATION
    .replace('{{NICHE}}', userContext.niche)
    .replace('{{CATEGORY}}', userContext.category)
    .replace('{{PRODUCT_SERVICE}}', userContext.productService)
    .replace('{{TARGET_OUTCOME}}', userContext.targetOutcome)
    .replace('{{TARGET_AUDIENCE}}', userContext.targetAudience)
    .replace('{{GEMINI_OUTPUT}}', JSON.stringify(geminiAnalysis, null, 2));

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a senior content strategist specializing in viral content replication. You provide detailed, evidence-based analysis.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 16000,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from GPT evaluation');
  }

  const evaluation: GPTEvaluation = JSON.parse(content);
  return evaluation;
}

/**
 * Phase 3: Script Generation
 */
export async function generateScript(
  geminiAnalysis: GeminiAnalysis,
  gptEvaluation: GPTEvaluation,
  userContext: UserContext
): Promise<GeneratedScript> {
  const prompt = PROMPT_PHASE3_SCRIPT_GENERATION
    .replace('{{NICHE}}', userContext.niche)
    .replace('{{CATEGORY}}', userContext.category)
    .replace('{{PRODUCT_SERVICE}}', userContext.productService)
    .replace('{{TARGET_OUTCOME}}', userContext.targetOutcome)
    .replace('{{TARGET_AUDIENCE}}', userContext.targetAudience)
    .replace('{{TARGET_DURATION}}', userContext.targetDuration.toString())
    .replace('{{GEMINI_OUTPUT}}', JSON.stringify(geminiAnalysis, null, 2))
    .replace('{{GPT_EVALUATION}}', JSON.stringify(gptEvaluation, null, 2));

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an elite viral script writer. You create comprehensive shooting scripts with precise technical direction.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 16000,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from script generation');
  }

  const script: GeneratedScript = JSON.parse(content);
  return script;
}

/**
 * Phase 4: Script Evaluation (150-item checklist)
 */
export async function evaluateScript(
  script: GeneratedScript,
  geminiAnalysis: GeminiAnalysis,
  gptEvaluation: GPTEvaluation
): Promise<ScriptEvaluation> {
  const prompt = PROMPT_PHASE4_SCRIPT_EVALUATION
    .replace('{{GENERATED_SCRIPT}}', JSON.stringify(script, null, 2))
    .replace('{{GEMINI_ANALYSIS}}', JSON.stringify(geminiAnalysis, null, 2))
    .replace('{{GPT_EVALUATION}}', JSON.stringify(gptEvaluation, null, 2));

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a script quality assurance expert. You evaluate scripts against comprehensive execution checklists.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    max_tokens: 12000,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from script evaluation');
  }

  const evaluation: ScriptEvaluation = JSON.parse(content);
  return evaluation;
}

/**
 * Phase 5: Script Revision
 */
export async function reviseScript(
  currentScript: GeneratedScript,
  scriptEvaluation: ScriptEvaluation,
  geminiAnalysis: GeminiAnalysis,
  gptEvaluation: GPTEvaluation
): Promise<GeneratedScript> {
  const prompt = PROMPT_PHASE5_REVISION
    .replace('{{CURRENT_SCRIPT}}', JSON.stringify(currentScript, null, 2))
    .replace('{{SCRIPT_EVALUATION}}', JSON.stringify(scriptEvaluation, null, 2))
    .replace('{{GEMINI_ANALYSIS}}', JSON.stringify(geminiAnalysis, null, 2))
    .replace('{{GPT_EVALUATION}}', JSON.stringify(gptEvaluation, null, 2));

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an elite viral script writer specializing in script revision. You regenerate only failed sections while preserving successful elements.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 16000,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from script revision');
  }

  const revisedScript: GeneratedScript = JSON.parse(content);
  return revisedScript;
}
