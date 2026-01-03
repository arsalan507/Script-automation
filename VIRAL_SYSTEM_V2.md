# Viral Reel Analysis & Script Generation System V2

## 🎯 Overview

A comprehensive 5-phase AI-powered system that analyzes viral reels, evaluates replication potential, and generates production-ready shooting scripts with 460 total evaluation checkpoints.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 0: USER INPUT                          │
│  • Niche/Industry • Category • Product/Service                  │
│  • Target Outcome • Target Audience • Target Duration           │
│  • Video Upload (MP4, MOV, AVI)                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 1: GEMINI VIDEO ANALYSIS                     │
│  • 187-Item Master Checklist Evaluation                         │
│  • Line-by-line transcription (visual, audio, text, dialogue)   │
│  • Viral mechanism explanation (why it went viral)              │
│  • Section-by-section scoring (17 sections)                     │
│  • Tier grading (A/B/C)                                         │
│  • Replication decision (YES/NO/CONDITIONAL)                    │
│  OUTPUT: gemini_analysis.json                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         PHASE 2: CHATGPT EVALUATION & REPLICATION              │
│  • 123-Item Replication Checklist (25 sections)                │
│  • Validate Gemini analysis for accuracy                        │
│  • Niche-fit assessment                                         │
│  • Verdict: REPLICABLE / CONDITIONAL / NON-REPLICABLE          │
│  • Modification requirements (mandatory changes)                │
│  OUTPUT: gpt_evaluation.json                                    │
│  [If NON-REPLICABLE → STOP]                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│             PHASE 3: CHATGPT SCRIPT GENERATION                  │
│  • Complete shooting script with scene-by-scene breakdown       │
│  • Intent lock (virality driver, emotional debt, conflict)      │
│  • 4+ scenes with full technical direction                      │
│  • Dialogue, visuals, audio, editing notes per scene           │
│  • Checklist compliance mapping                                 │
│  • Director notes & role-specific instructions                  │
│  OUTPUT: generated_script.json                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│          PHASE 4: CHATGPT SCRIPT EVALUATION                     │
│  • 150-Item Script & Execution Checklist (15 sections)         │
│  • Section-by-section quality scoring                           │
│  • Identify specific failures                                   │
│  • Pass criteria: ≥90% AND no critical failures                │
│  OUTPUT: script_evaluation.json                                 │
│  [If PASS → FINAL OUTPUT]                                      │
│  [If FAIL → PHASE 5]                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            PHASE 5: CHATGPT SCRIPT REVISION                     │
│  • Regenerate ONLY failed sections                              │
│  • Preserve all successful elements                             │
│  • Apply specific fixes to identified issues                    │
│  • Return to Phase 4 evaluation                                 │
│  • Max 3 iterations                                             │
│  OUTPUT: revised_script.json → Phase 4                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FINAL OUTPUT PACKAGE                          │
│  • Complete analysis from all 5 phases                          │
│  • Production-ready shooting script                             │
│  • Downloadable JSON report                                     │
│  • All 460 checklist evaluations                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Checkpoint Breakdown

| Phase | Checklist | Items | Purpose |
|-------|-----------|-------|---------|
| 1 | Master Viral Reel | 187 | Analyze source video for viral elements |
| 2 | Replication Checklist | 123 | Evaluate replication feasibility |
| 3 | N/A | N/A | Generate complete shooting script |
| 4 | Script & Execution | 150 | Evaluate script quality |
| 5 | N/A | N/A | Refine script based on failures |
| **Total** | **3 Checklists** | **460 Items** | **Complete viral analysis pipeline** |

---

## 🚀 Quick Start

### 1. Install Dependencies

Already installed from previous setup.

### 2. Add Environment Variables

Edit `.env.local`:

```bash
# Gemini AI (Required for Phase 1)
GEMINI_API_KEY=your-gemini-api-key

# OpenAI (Required for Phases 2-5)
OPENAI_API_KEY=sk-your-openai-key

# Optional Model Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
OPENAI_MODEL=gpt-4-turbo-preview
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎬 How to Use

### Step 1: Provide Context

Fill in the required fields:
- **Niche/Industry**: e.g., "SaaS Marketing"
- **Category**: e.g., "Educational"
- **Product/Service**: e.g., "AI Video Editor"
- **Target Outcome**: e.g., "Generate qualified leads"
- **Target Audience**: e.g., "B2B SaaS founders aged 30-45"
- **Target Duration**: Default 27 seconds

### Step 2: Upload Video

Upload a viral reel you want to analyze (MP4, MOV, AVI).

### Step 3: Wait for Analysis

The system will process through 5 phases (2-4 minutes total):
1. Gemini analyzes video (30-60s)
2. GPT evaluates replication (20-40s)
3. GPT generates script (30-60s)
4. GPT evaluates script (20-30s)
5. GPT refines script if needed (20-30s per iteration, max 3)

### Step 4: Review Results

View comprehensive analysis:
- Gemini score and tier grading
- Replication verdict and modifications
- Complete shooting script
- Script quality evaluation
- Revision history (if applicable)

### Step 5: Download Report

Click "Download Report" to get complete JSON analysis package.

---

## 📁 Project Structure

```
script-automation/
├── app/
│   ├── api/
│   │   └── viral-analysis/
│   │       └── route.ts              # 5-phase analysis API endpoint
│   ├── page.tsx                      # Main application page (V2)
│   └── layout.tsx
│
├── components/
│   ├── Phase0UserInput.tsx           # User context input form
│   ├── ViralAnalysisProgress.tsx     # 5-phase progress tracker
│   └── ViralAnalysisResults.tsx      # Complete results display
│
├── lib/
│   ├── gemini-viral.ts               # Phase 1: Gemini integration
│   ├── openai-viral.ts               # Phases 2-5: OpenAI integration
│   └── prompts/
│       └── viral-prompts.ts          # All system prompts
│
├── types/
│   └── viral-analysis.ts             # Complete TypeScript types
│
└── PROJECT_SUMMARY.md                # Full prompts & methodology
```

---

## 🔍 Phase Details

### Phase 1: Gemini Video Analysis

**187-Item Master Checklist** organized in 15 sections:

1. Hook (0-3 Second War) - 18 items
2. Content Structure - 17 items
3. Audio Strategy - 8 items
4. Emotional Trigger - 9 items
5. Rewatch & Send Engine - 6 items
6. Target Audience Precision - 6 items
7. Algorithmic Hygiene - 7 items
8. Distribution & Velocity - 6 items
9A. Human Impact - Physiological - 6 items
9B. Human Impact - Emotional - 14 items
9C. Human Impact - Behavioral - 9 items
10. Pre/Post Viewer Psychology - 19 items
11. Context Alignment - 6 items
12. Saturation Control - 7 items
13. Intensity Calibration - 6 items
14. Advanced Mix Checks - 23 items
15. Virality Formula Engine - 20 items

**Output:**
- Timestamped transcription
- Item-by-item evaluation (PASS/FAIL/PARTIAL/N/A)
- Viral mechanism explanation (150-200 words)
- Weighted scoring (0-10)
- Tier grading (A/B/C)
- Replication decision

### Phase 2: GPT Replication Evaluation

**123-Item Replication Checklist** organized in 25 sections:

1. Source Reel Selection Check - 5 items
2. Viral DNA Extraction - 5 items
3. Structural Skeleton Capture - 7 items
4. Personality & Context Replacement - 5 items
5. Hook Re-Engineering - 6 items
6. Physiological Match Check - 4 items
7. Emotional Parity Check - 5 items
8. Internal Conflict Alignment - 4 items
9. Identity Permission Transfer - 4 items
10. Behavioral Outcome Match - 4 items
11. Intensity Calibration - 4 items
12. Context & Timing Adaptation - 3 items
13. Distribution & Momentum Setup - 4 items
14. Replication Mix Checks - 5 items
15. State-Aware Replication Gate - 5 items
16. Social Risk & Novelty Control - 5 items
17. Expectation Violation Check - 3 items
18. Niche Replicability & Transfer - 13 items
19. Language, Symbol & Social Fit - 6 items
20. Niche Sharing & Repetition Tolerance - 3 items
21. Emotional–Mental–Behavioral R-EMB Gate - 6 items
22. Psychological Conflict Parity R-EMB - 4 items
23. Behavioral Output Equivalence R-EMB - 5 items
24. Identity Positioning Match R-EMB - 5 items
25. Creator–Audience Permission Check R-EMB - 3 items

**Output:**
- Gemini analysis validation
- Item-by-item replication evaluation
- Verdict: REPLICABLE / CONDITIONALLY_REPLICABLE / NON-REPLICABLE
- Mandatory modifications
- Elements to preserve vs replace

### Phase 3: Script Generation

**Complete Shooting Script** with:

1. **Script Metadata** - Title, version, duration, platform, niche
2. **Intent Lock** - Virality driver, emotional debt, conflict, behavioral outcome, identity shift
3. **Pre-Production** - Equipment, location, talent notes, props
4. **Scenes** (minimum 4):
   - Scene 1: HOOK (0-3 seconds)
   - Scene 2: BUILD - TENSION
   - Scene 3: BUILD - STAKES
   - Scene 4: PAYOFF + LOOP

Each scene includes:
- Dialogue (spoken text, delivery notes, tone, forbidden phrases)
- On-Screen Text (text, timing, position, style, differs from spoken)
- Visual Direction (shot type, framing, camera movement, lighting, background)
- Action Cues (timestamped actions)
- Audio (music, volume, timing, sound effects, voice processing)
- Editing Notes (transitions, effects, color grade, cuts)
- Checklist Compliance (which items this scene satisfies)

5. **Full Script Text** - Dialogue-only, on-screen-only, combined transcript
6. **Sentence-by-Sentence Breakdown** - Function, emotional debt, checklist items per sentence
7. **Technical Specs** - Aspect ratio, resolution, frame rate, export settings, safe zones
8. **Checklist Summary** - Compliance percentages
9. **Modifications Applied** - Changes from Phase 2
10. **Director Notes** - Critical moments, mistakes to avoid, success indicators
11. **Role-Specific Instructions** - Creator, videographer, editor instructions

### Phase 4: Script Evaluation

**150-Item Script & Execution Checklist** organized in 15 sections:

1. Pre-Script Foundation - 10 items
2. Hook Script Quality - 15 items
3. Build Script Quality - 15 items
4. Payoff Script Quality - 15 items
5. Dialogue Execution - 10 items
6. On-Screen Text Execution - 10 items
7. Visual Direction - 15 items
8. Audio Direction - 10 items
9. Editing Instructions - 15 items
10. Technical Compliance - 10 items
11. Checklist Mapping Accuracy - 10 items
12. Modification Integration - 10 items
13. Director Notes Quality - 10 items
14. Role Instructions Clarity - 5 items
15. Overall Coherence - 10 items

**Pass Criteria:**
- Total score ≥ 90%
- NO critical failures (hook < 7, payoff < 7, missing intent lock)

### Phase 5: Script Revision

**Iterative Refinement** (max 3 iterations):

1. Identify failed sections from Phase 4
2. Preserve all successful elements
3. Regenerate ONLY failed sections
4. Apply specific fixes to each failure
5. Return to Phase 4 for re-evaluation
6. Repeat until pass or max iterations reached

---

## 💰 Cost Estimation

### Per Analysis (All 5 Phases):

| Component | Cost | Notes |
|-----------|------|-------|
| Gemini Phase 1 | $0.002-0.01 | Video analysis, free tier: 1,500/day |
| GPT Phase 2 | $0.03-0.10 | Evaluation with large context |
| GPT Phase 3 | $0.05-0.15 | Script generation |
| GPT Phase 4 | $0.03-0.08 | Script evaluation |
| GPT Phase 5 (if needed) | $0.05-0.15 | Per revision iteration |
| **Total per reel** | **$0.13-0.48** | Without revisions |
| **Total with 3 revisions** | **$0.28-0.93** | Worst case |

### Monthly Estimates:

| Usage | Cost (avg) |
|-------|-----------|
| 10 analyses/month | $2-5 |
| 50 analyses/month | $10-25 |
| 100 analyses/month | $20-50 |
| 500 analyses/month | $100-250 |

---

## 🔧 Configuration

### API Keys

Get your API keys:

1. **Gemini API Key** (Free tier available):
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API key
   - Free: 15 requests/min, 1,500/day

2. **OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create secret key
   - Requires payment method ($5 minimum)

### Model Configuration

Edit `.env.local`:

```bash
GEMINI_MODEL=gemini-2.0-flash-exp    # Or gemini-1.5-flash
OPENAI_MODEL=gpt-4-turbo-preview     # Or gpt-4o
```

### File Upload Limits

Default: 100MB max video size

Edit `.env.local`:

```bash
MAX_FILE_SIZE=100000000  # 100MB in bytes
```

---

## 🐛 Troubleshooting

### Phase 1 Fails (Gemini)

- Check Gemini API key is valid
- Verify video file is < 100MB
- Check Gemini rate limits (15/min free tier)
- Try smaller video file

### Phase 2 Fails (GPT Evaluation)

- Check OpenAI API key is valid
- Verify you have OpenAI credits
- Check for large JSON context (may timeout)

### Phase 3-5 Fails (Script Generation/Evaluation)

- Same as Phase 2
- Check prompt length (very large prompts may timeout)
- Review OpenAI usage limits

### "NON-REPLICABLE" Verdict

This is expected! The system determined the source reel:
- Relies too heavily on creator personality
- Is context-specific and cannot transfer
- Has too many non-structural elements
- Doesn't align with your target niche

You'll still receive the full Gemini + GPT analysis.

---

## 📈 Next Steps

### Future Enhancements

1. **Real-time Progress Updates** - Implement Server-Sent Events for live phase updates
2. **DOCX Export** - Generate formatted Microsoft Word report with all analysis
3. **Video Comparison** - Side-by-side comparison of source vs recommended script
4. **Batch Processing** - Analyze multiple reels simultaneously
5. **Template Library** - Save and reuse successful script templates
6. **A/B Testing** - Generate multiple script variations
7. **Performance Tracking** - Track actual reel performance vs predictions

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

---

## 📚 References

- Full prompts: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- API integration: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- API keys setup: [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)

---

## 🎉 You're Ready!

Start analyzing viral reels and generating production-ready scripts with the most comprehensive viral content analysis system ever built.

**460 checkpoints. 5 phases. 1 powerful system.**
