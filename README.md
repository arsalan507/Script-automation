# Script Automation - AI-Powered Reel Analysis

Standalone Next.js application that analyzes video reels using **Gemini AI** and **ChatGPT** to generate viral formulas, replication checklists, and auto-generate scripts.

## Features

- 📤 **Video Upload**: Drag & drop or browse to upload reels (MP4, MOV, AVI)
- 🤖 **AI Analysis**: Powered by Gemini 2.0 Flash for video understanding
- 🧠 **Formula Generation**: ChatGPT creates viral formulas and checklists
- ⚡ **Auto-Approval**: Videos scoring ≥8/10 are automatically approved
- 📊 **Comprehensive Reports**: Visual breakdown, hooks, pacing, audio analysis
- 📥 **Export**: Download analysis reports as JSON

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **AI APIs**:
  - Google Gemini 2.0 Flash (video analysis)
  - OpenAI GPT-4 Turbo (formula generation)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Gemini API key (Google AI Studio)
- OpenAI API key

### 1. Get Your API Keys

#### **Gemini API Key** (Free tier available)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key" (you'll need a Google account)
3. Click "Create API Key"
4. Copy the API key

**Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- Free quota resets daily

#### **OpenAI API Key**

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the API key immediately (won't be shown again)

**Pricing:**
- GPT-4 Turbo: ~$0.01 per request for this use case
- You'll need to add payment method (credit/debit card)
- Minimum $5 credit to start

### 2. Installation

```bash
# Already installed! You're in the script-automation folder

# Install dependencies (if not done)
npm install
```

### 3. Configure Environment Variables

Edit `.env.local` and add your API keys:

```bash
# AI API Keys (REQUIRED)
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Model Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
OPENAI_MODEL=gpt-4-turbo-preview

# Optional: File Upload Configuration
MAX_FILE_SIZE=100000000
ALLOWED_VIDEO_FORMATS=video/mp4,video/quicktime,video/x-msvideo
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 How It Works

### Workflow

```
1. Upload Reel
   ↓
2. Gemini AI Analysis (30-60s)
   - Video transcription
   - Visual breakdown
   - Hook identification
   - Pacing analysis
   - Audio analysis
   ↓
3. ChatGPT Formula Generation (20-40s)
   - Viral formula creation
   - Element identification
   - Replication checklist
   - Scoring (0-10)
   - Improvement suggestions
   ↓
4. Results Display
   - Comprehensive report
   - Auto-approval if score ≥ 8/10
   - Downloadable JSON report
```

### Analysis Components

#### **Gemini Analysis**
- **Transcription**: Full text and speech extraction
- **Visual Breakdown**: Scene-by-scene analysis, color palette, visual style
- **Hook Analysis**: Opening, screen, story, and closing hooks
- **Pacing**: Duration, clip count, tempo (slow/medium/fast/very-fast)
- **Audio**: Music detection, style, voiceover, sound effects

#### **ChatGPT Formula**
- **Score (0-10)**: Viral potential rating
- **Formula**: Core viral strategy explanation
- **Viral Elements**: Key factors driving engagement
- **Checklist**: 10-15 items for replication
- **Suggestions**: Actionable improvements
- **Replication Strategy**: Step-by-step guide

---

## 💰 Cost Estimation

### Per Reel Analysis

| Service | Cost | Notes |
|---------|------|-------|
| Gemini API | $0.002-0.005 | Free tier: 1,500/day |
| OpenAI GPT-4 | $0.03-0.10 | Depends on response length |
| **Total** | **$0.04-0.15** | Per reel |

### Monthly Estimates

| Usage | Cost |
|-------|------|
| 10 reels/month | $0.40-1.50 |
| 50 reels/month | $2-7.50 |
| 100 reels/month | $4-15 |
| 500 reels/month | $20-75 |

**Note**: Use Gemini's free tier to minimize costs during testing.

---

## 📁 Project Structure

```
script-automation/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Video analysis API endpoint
│   ├── page.tsx                  # Main upload page
│   └── layout.tsx                # App layout
├── components/
│   ├── UploadSection.tsx         # Drag & drop upload UI
│   ├── AnalysisProgress.tsx      # Progress indicator
│   └── ResultsDisplay.tsx        # Analysis results UI
├── lib/
│   ├── gemini.ts                 # Gemini API integration
│   └── openai.ts                 # OpenAI API integration
├── types/
│   └── analysis.ts               # TypeScript types
├── .env.local                    # Environment variables (create this)
└── README.md                     # This file
```

---

## ✅ Quick Start Checklist

- [x] Node.js 18+ installed
- [x] Project created and dependencies installed
- [ ] Get Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Get OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- [ ] Edit `.env.local` with your API keys
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Upload a test video
- [ ] Get analysis results

---

## 🔧 Configuration

### Supported Video Formats

- MP4 (recommended)
- MOV (QuickTime)
- AVI

### File Size Limits

- Default: 100MB
- Configure in `.env.local` via `MAX_FILE_SIZE`

---

## 🔐 Security

- API keys stored in `.env.local` (gitignored, never committed)
- Videos processed in-memory (not saved to server)
- Analysis results exported on-demand only

---

## 🐛 Troubleshooting

### "Failed to analyze video"

1. Check API keys are set in `.env.local`
2. Verify API keys are active (not expired)
3. Ensure you have OpenAI credits
4. Check video file is valid and < 100MB

### Gemini API Errors

- Rate limit: Wait 1 minute (free tier: 15/min)
- Check key at [Google AI Studio](https://makersuite.google.com/app/apikey)

### OpenAI API Errors

- Add credits at [OpenAI Billing](https://platform.openai.com/account/billing)
- Regenerate API key if invalid

---

## 🔄 Integrating with Other Projects

### Option 1: API Integration

```typescript
const response = await fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  body: formData, // FormData with video file
});

const result = await response.json();
```

### Option 2: Button Component

```tsx
import UploadSection from '@/components/UploadSection';

<UploadSection onFileUpload={handleUpload} />
```

---

**Ready to analyze reels! 🎉**

For deployment or advanced setup, check the full documentation sections above.
