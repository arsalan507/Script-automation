# Integration Guide - Script Automation → Video Hub

This guide explains how to integrate the Script Automation analysis system into your Video Hub project.

---

## 🎯 Integration Options

### Option 1: API Microservice (Recommended)
Deploy Script Automation as a standalone API service that Video Hub calls.

**Pros**:
- ✅ Decoupled architecture
- ✅ Independent scaling
- ✅ Easier testing and deployment
- ✅ Can be used by multiple projects

**Cons**:
- ⚠️ Requires separate deployment
- ⚠️ Network latency for API calls

### Option 2: Shared Package/Monorepo
Move both projects into a monorepo structure with shared utilities.

**Pros**:
- ✅ Share types and utilities
- ✅ Single codebase
- ✅ No network overhead

**Cons**:
- ⚠️ Tight coupling
- ⚠️ Harder to scale independently

### Option 3: Copy Code Modules
Copy the analysis modules directly into Video Hub.

**Pros**:
- ✅ Simplest initial setup
- ✅ No external dependencies

**Cons**:
- ⚠️ Code duplication
- ⚠️ Harder to maintain updates

---

## 📋 Recommended Approach: API Microservice

### Step 1: Deploy Script Automation

```bash
# Option A: Deploy to Vercel
cd /Users/arsalan/Desktop/ScriptAutomation
vercel deploy --prod

# Option B: Deploy to your VPS
npm run build
pm2 start npm --name "script-automation-api" -- start

# Note your deployment URL
# Example: https://script-automation.vercel.app
```

### Step 2: Add Environment Variable to Video Hub

In your Video Hub `.env.local`:

```bash
# Script Automation API
SCRIPT_AUTOMATION_API_URL=https://script-automation.vercel.app
# or
SCRIPT_AUTOMATION_API_URL=http://localhost:3002  # for local development
```

### Step 3: Create API Client in Video Hub

Create `/lib/scriptAutomation.ts` in Video Hub:

```typescript
// Video Hub: /lib/scriptAutomation.ts

export interface VideoAnalysisResult {
  id: string;
  fileName: string;
  status: 'processing' | 'completed' | 'failed';
  geminiAnalysis?: {
    transcription: string;
    visualBreakdown: {
      scenes: Array<{
        timestamp: string;
        description: string;
        duration: number;
        visualElements: string[];
      }>;
      colorPalette: string[];
      visualStyle: string;
      transitions: string[];
    };
    hookAnalysis: {
      openingHook: string;
      screenHook: string;
      storyHook: string;
      closingHook: string;
      hookTimings: number[];
    };
    pacing: {
      totalDuration: number;
      clipCount: number;
      averageClipDuration: number;
      tempo: 'slow' | 'medium' | 'fast' | 'very-fast';
    };
    audioAnalysis: {
      music: boolean;
      musicStyle?: string;
      voiceover: boolean;
      soundEffects: string[];
    };
  };
  chatgptFormula?: {
    score: number;
    formula: string;
    viralElements: string[];
    checklist: Array<{
      category: string;
      item: string;
      present: boolean;
      importance: 'high' | 'medium' | 'low';
    }>;
    suggestions: string[];
    replicationStrategy: string;
  };
  autoApproved: boolean;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export async function analyzeVideoReel(
  videoFile: File
): Promise<VideoAnalysisResult> {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await fetch(
    `${process.env.SCRIPT_AUTOMATION_API_URL}/api/analyze`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Video analysis failed');
  }

  return response.json();
}
```

### Step 4: Use in Video Hub Components

```typescript
// Video Hub: /app/research/page.tsx

'use client';

import { useState } from 'react';
import { analyzeVideoReel, VideoAnalysisResult } from '@/lib/scriptAutomation';

export default function ResearchTab() {
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    try {
      const result = await analyzeVideoReel(file);
      setAnalysis(result);

      // Auto-fill idea and script if approved
      if (result.autoApproved && result.chatgptFormula) {
        // TODO: Fill your idea section with result.chatgptFormula.formula
        // TODO: Fill your script section with result.chatgptFormula.replicationStrategy
        // TODO: Add to shoot plan if score >= 8
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Research & Development</h1>

      {/* Upload component */}
      <VideoUpload onUpload={handleAnalyze} />

      {/* Loading state */}
      {loading && <LoadingSpinner />}

      {/* Results */}
      {analysis && (
        <div>
          <h2>Analysis Results</h2>
          <p>Score: {analysis.chatgptFormula?.score}/10</p>
          <p>Auto-approved: {analysis.autoApproved ? 'Yes' : 'No'}</p>

          {/* Display analysis details */}
          <AnalysisDisplay data={analysis} />

          {/* Action buttons */}
          <button onClick={() => addToShootPlan(analysis)}>
            Add to Shoot Plan
          </button>
        </div>
      )}
    </div>
  );
}
```

### Step 5: Database Integration (Optional)

If you want to store analyses in Video Hub database:

```typescript
// Video Hub: /app/api/research/save/route.ts

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const analysis = await request.json();

  const saved = await prisma.videoAnalysis.create({
    data: {
      fileName: analysis.fileName,
      score: analysis.chatgptFormula.score,
      formula: analysis.chatgptFormula.formula,
      viralElements: analysis.chatgptFormula.viralElements,
      checklist: analysis.chatgptFormula.checklist,
      transcription: analysis.geminiAnalysis.transcription,
      autoApproved: analysis.autoApproved,
      // ... other fields
    },
  });

  return NextResponse.json(saved);
}
```

---

## 🔄 Alternative: Direct Code Integration

If you prefer to copy the code directly into Video Hub:

### Step 1: Copy Files

```bash
# From Script Automation root
cp -R lib /path/to/video-hub/lib/scriptAutomation
cp -R types/analysis.ts /path/to/video-hub/types/scriptAutomation.ts
```

### Step 2: Install Dependencies

In Video Hub `package.json`:

```json
{
  "dependencies": {
    "@google/genai": "^1.34.0",
    "openai": "^6.15.0",
    // ... other deps
  }
}
```

### Step 3: Update Imports

```typescript
// Video Hub: /app/api/analyze/route.ts

import { analyzeVideoWithGemini } from '@/lib/scriptAutomation/gemini';
import { generateFormulaWithChatGPT } from '@/lib/scriptAutomation/openai';

export async function POST(request: NextRequest) {
  // ... same logic as Script Automation
}
```

---

## 🎨 UI Component Integration

### Embed Upload Component

```typescript
// Video Hub: /components/ResearchUpload.tsx

import { useState } from 'react';

export function ResearchUpload() {
  return (
    <div className="research-tab">
      <h2>Upload Reel for Analysis</h2>

      {/* Drag & drop area */}
      <div className="upload-zone">
        <input type="file" accept="video/*" />
        <p>Drag & drop video or click to browse</p>
      </div>

      {/* Progress indicator */}
      <AnalysisProgress steps={[
        'Uploading Video',
        'Gemini Analysis',
        'ChatGPT Processing',
        'Generating Report'
      ]} />

      {/* Results display */}
      <ResultsPanel />
    </div>
  );
}
```

### Add to Sidebar Navigation

```typescript
// Video Hub: /components/Sidebar.tsx

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Research', href: '/research' },  // ← Add this
  { name: 'Script Writer', href: '/scripts' },
  { name: 'Editor', href: '/editor' },
  // ...
];
```

---

## 🔗 Workflow Integration

### Research → Script Writer Flow

```typescript
// Video Hub: /lib/workflows/researchToScript.ts

export async function applyAnalysisToScript(
  analysis: VideoAnalysisResult,
  scriptId: string
) {
  // 1. Fill idea section
  await updateScriptSection(scriptId, 'idea', {
    concept: analysis.chatgptFormula.formula,
    viralElements: analysis.chatgptFormula.viralElements,
  });

  // 2. Fill script section using checklist
  await updateScriptSection(scriptId, 'script', {
    hooks: analysis.geminiAnalysis.hookAnalysis,
    structure: analysis.chatgptFormula.replicationStrategy,
  });

  // 3. Auto-approve if score >= 8
  if (analysis.autoApproved) {
    await approveScript(scriptId);
    await addToShootPlan(scriptId);
  }
}
```

### Integration with Shoot Planning

```typescript
// Video Hub: /lib/workflows/addToShootPlan.ts

export async function addAnalysisToShootPlan(
  analysis: VideoAnalysisResult
) {
  const shootPlan = await prisma.shootPlan.create({
    data: {
      title: `Reel based on ${analysis.fileName}`,
      score: analysis.chatgptFormula.score,
      status: analysis.autoApproved ? 'approved' : 'pending',
      formula: analysis.chatgptFormula.formula,
      checklist: analysis.chatgptFormula.checklist,
      scheduledDate: calculateShootDate(analysis),
      // ...
    },
  });

  return shootPlan;
}
```

---

## 🧪 Testing Integration

### Local Development Setup

1. **Run Script Automation API**:
```bash
cd /Users/arsalan/Desktop/ScriptAutomation
npm run dev
# Runs on http://localhost:3002
```

2. **Run Video Hub**:
```bash
cd /path/to/video-hub
npm run dev
# Runs on http://localhost:3000
```

3. **Test Integration**:
- Upload video in Video Hub research tab
- Verify API call to localhost:3002
- Check analysis results appear
- Test auto-fill functionality

### Production Testing

1. Deploy Script Automation to staging environment
2. Update Video Hub env vars
3. Test end-to-end workflow
4. Monitor performance and costs

---

## 📊 Monitoring Integration

### Track Usage Metrics

```typescript
// Video Hub: /lib/analytics/scriptAutomation.ts

export async function trackAnalysis(
  videoId: string,
  result: VideoAnalysisResult
) {
  await analytics.track('video_analyzed', {
    videoId,
    score: result.chatgptFormula?.score,
    autoApproved: result.autoApproved,
    processingTime: result.completedAt - result.createdAt,
    geminiCost: estimateGeminiCost(result),
    openaiCost: estimateOpenAICost(result),
  });
}
```

---

## 🔐 Security Considerations

### API Authentication

Add authentication to Script Automation API:

```typescript
// Script Automation: /app/api/analyze/route.ts

export async function POST(request: NextRequest) {
  // Verify API key from Video Hub
  const apiKey = request.headers.get('x-api-key');

  if (apiKey !== process.env.VIDEO_HUB_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // ... rest of analysis logic
}
```

In Video Hub:

```typescript
const response = await fetch(`${API_URL}/api/analyze`, {
  method: 'POST',
  headers: {
    'x-api-key': process.env.SCRIPT_AUTOMATION_API_KEY,
  },
  body: formData,
});
```

---

## 📝 Integration Checklist

- [ ] Choose integration approach (microservice/monorepo/copy)
- [ ] Set up environment variables
- [ ] Create API client or copy code modules
- [ ] Add UI components to Video Hub
- [ ] Implement workflow integration
- [ ] Set up database schemas (if storing analyses)
- [ ] Add authentication/authorization
- [ ] Test locally
- [ ] Deploy to staging
- [ ] Test end-to-end
- [ ] Deploy to production
- [ ] Set up monitoring and alerts
- [ ] Document for team

---

## 🚀 Quick Start (Microservice Approach)

1. **Deploy Script Automation**:
   ```bash
   cd /Users/arsalan/Desktop/ScriptAutomation
   vercel deploy --prod
   ```

2. **Add to Video Hub env**:
   ```bash
   echo "SCRIPT_AUTOMATION_API_URL=https://your-deployment.vercel.app" >> .env.local
   ```

3. **Copy API client**:
   ```bash
   cp /Users/arsalan/Desktop/ScriptAutomation/INTEGRATION_GUIDE.md \
      /path/to/video-hub/docs/
   ```

4. **Start integrating** using the code examples above!

---

**Ready to integrate!** Choose your approach and follow the steps above. For questions or issues, refer to the main [DEPLOYMENT.md](./DEPLOYMENT.md) documentation.
