import { GoogleGenerativeAI } from '@google/genai';
import { UserContext, GeminiAnalysis } from '@/types/viral-analysis';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeWithGemini(
  videoBase64: string,
  mimeType: string,
  userContext: UserContext
): Promise<GeminiAnalysis> {
  const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are a viral content forensic analyst. Your task is to perform a comprehensive analysis of the uploaded video reel using a strict 6-step methodology and evaluate it against a 187-item Master Checklist.

## CONTEXT PROVIDED BY USER
- Niche/Industry: ${userContext.niche}
- Category: ${userContext.category}
- Product/Service: ${userContext.productService}
- Target Outcome: ${userContext.targetOutcome}
- Target Audience: ${userContext.targetAudience}

---

## STEP 1 — LINE-BY-LINE TRANSCRIPTION (Zero Interpretation)

Transcribe the video with absolute precision. Output must be timestamped.

### Required Elements:
1. **Spoken Dialogue** — Word-for-word transcription
2. **On-Screen Text** — All captions, titles, subtitles, text overlays
3. **Visual Actions** — Camera movements, cuts, transitions, facial expressions, gestures, scene changes
4. **Sound Cues** — Music drops, beat switches, silence, sound effects, audio transitions

❌ NO analysis, interpretation, or commentary in this step
✅ Pure transcription only

---

## STEP 2 — CHECKPOINT-BASED DECODING (187-Item Evaluation)

Using the Master Viral Reel Checklist below, evaluate EVERY checkpoint.

### For EACH of the 187 items, provide:

1. **Status**: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL | N/A
2. **Evidence**: Quote exact timestamp/moment from Step 1
3. **Mechanism**: Explain the psychological, emotional, or behavioral mechanism
4. **Classification**: STRUCTURAL (replicable) | CONTEXTUAL (non-replicable)
5. **Impact Score**: 1-10 (if FAIL, explain impact on virality)

## MASTER CHECKLIST (187 Items)

### SECTION 1: HOOK — 0-3 SECOND WAR (18 items)
1. The reel opens with a pattern interrupt in the very first frame
2. The first frame contains sudden movement, anomaly, extreme close-up, or visual contrast
3. The subject moves within the first 1.5 seconds
4. The camera moves within the first 1.5 seconds
5. An object enters the frame rapidly within the first 1.5 seconds
6. The opening frame is not a static face
7. The first frame is visually different from at least 90% of reels in the feed
8. A face or eyes are visible in the first frame OR a cognitively "wrong" visual moment is shown
9. The hook works clearly with sound muted
10. On-screen text appears within the first 0.5 seconds
11. The hook text is readable in under one second
12. The hook text is placed inside safe UI zones
13. The hook instantly answers why the viewer should keep watching
14. The hook uses a curiosity gap
15. The hook uses loss aversion framing
16. The hook presents a contrarian or unexpected truth
17. The hook calls out a specific identity or audience
18. The reel contains no greeting, logo, context setup, or breathing gap

### SECTION 2: CONTENT STRUCTURE — RETENTION ENGINEERING (17 items)
19. The total reel length is between 14 and 45 seconds
20. Every second delivers new information or stimulation
21. The reel contains no filler content
22. The reel contains no politeness or recap
23. A visual change occurs every 0.5–3 seconds
24. Jump cuts, zooms, B-roll, text pops, or angle changes are used
25. Visual changes occur before attention drops
26. No single shot exceeds three seconds unless intentionally justified
27. The reel follows a Hook → Build → Payoff structure
28. The build phase increases curiosity
29. The build phase increases stakes
30. The build phase introduces contradiction
31. The payoff feels earned rather than rushed
32. The ending visually connects to the opening
33. The ending semantically connects to the opening
34. The final frame feels like a beginning, not an ending
35. The reel contains no verbal closure

### SECTION 3: AUDIO STRATEGY (8 items)
36. The audio emotionally matches the message
37. The audio is not oversaturated on the platform
38. The audio falls within the 10k–100k usage range
39. The spoken message is understandable without sound
40. Music volume supports the voice
41. Music never competes with the voice
42. Trending audio is used at low intensity if applied
43. Original voice remains dominant

### SECTION 4: EMOTIONAL TRIGGER (9 items)
44. The reel intentionally triggers curiosity
45. The reel intentionally triggers surprise
46. The reel intentionally triggers relatability or shared pain
47. The reel intentionally triggers aspiration
48. The reel intentionally triggers humor
49. The reel intentionally triggers fear or anxiety
50. The reel intentionally triggers awe
51. The triggered emotion matches the target audience identity
52. The reel is not calm-only, aesthetic-only, or informational-only

### SECTION 5: REWATCH & SEND ENGINE (6 items)
53. The ending creates unresolved psychological tension
54. The reel encourages rewatching
55. The reel encourages private sharing
56. The reel encourages saving
57. The reel is DM-shareable for identity signaling
58. The reel provides no full emotional closure

### SECTION 6: TARGET AUDIENCE PRECISION (6 items)
59. The reel clearly signals "this is for you"
60. The language matches how the target audience speaks
61. The reel is not designed to please everyone
62. The reel solves one specific pain
63. The reel addresses one specific desire
64. The reel reinforces one specific identity

### SECTION 7: ALGORITHMIC HYGIENE (7 items)
65. The reel uses a 9:16 vertical format
66. The resolution is 1080×1920 or higher
67. No TikTok or CapCut watermark is present
68. High-quality upload settings are enabled
69. On-screen text is not blocked by UI
70. Visuals are clean and uncluttered
71. Lighting and contrast are sharp

### SECTION 8: DISTRIBUTION & VELOCITY (6 items)
72. The reel is posted during target audience peak activity
73. The creator is available to reply immediately
74. Early comments are replied to quickly
75. Replies create conversation loops
76. The reel encourages tagging or debate organically
77. The reel is optionally tested as a trial reel

### SECTION 9A: HUMAN IMPACT — PHYSIOLOGICAL (6 items)
78. The first frame triggers an orienting response
79. A contrast spike or anomaly exists in the first second
80. The opening frame is not predictable
81. The content creates alertness rather than comfort
82. Slight tension or urgency is present
83. The viewer is pulled to pause, not scroll

### SECTION 9B: HUMAN IMPACT — EMOTIONAL (14 items)
84. The reel triggers curiosity
85. The reel triggers anxiety or fear
86. The reel triggers surprise
87. The reel triggers humor
88. The reel triggers aspiration
89. The reel triggers pain-based relatability
90. The reel triggers awe
91. Emotional tension is created early
92. Emotional tension increases over time
93. Emotional resolution is delayed
94. The ending does not fully satisfy emotionally
95. The reel clearly signals "this is for people like you"
96. The viewer feels personally called out
97. Language mirrors internal audience thought

### SECTION 9C: HUMAN IMPACT — BEHAVIORAL (9 items)
98. The hook or ending requires a second viewing
99. The reel loops visually or semantically
100. The reel feels incomplete after one watch
101. The content describes the viewer
102. The content describes someone the viewer knows
103. The reel allows indirect communication
104. The reel validates a shared belief or struggle
105. The reel contains no verbal CTA to share
106. The reel contains practical or future-use value

### SECTION 10: PRE/POST VIEWER PSYCHOLOGY (19 items)
107. The reel targets guilt
108. The reel targets anxiety
109. The reel targets frustration
110. The reel targets insecurity
111. The reel targets shame
112. The reel targets confusion
113. The pain is unvoiced, not obvious
114. The reel hijacks an internal conflict
115. The reel validates one side of the conflict
116. The opposing side is framed as incomplete
117. The reel releases identity pressure
118. The reel removes a self-blame narrative
119. The reel avoids moralizing tone
120. The reel avoids superiority tone
121. The viewer feels lighter after watching
122. The viewer experiences identity movement
123. The viewer feels more aligned with a tribe
124. The viewer feels justified in a belief
125. The viewer feels less alone

### SECTION 11: CONTEXT ALIGNMENT (6 items)
126. The reel aligns with night-time regret scrolling
127. The reel aligns with morning anxiety scrolling
128. The reel aligns with workday boredom
129. The reel aligns with post-failure validation seeking
130. The reel aligns with comparison-driven insecurity
131. The tone matches the viewer's existing mood

### SECTION 12: SATURATION CONTROL (7 items)
132. The hook format has not been overused recently
133. The reel is not visually identical to recent clones
134. The structure is not predictable after three seconds
135. The primary emotion is not overused in the niche
136. The emotional angle is rotated
137. The pain is reframed from a new identity angle
138. At least one pattern-break element is new

### SECTION 13: INTENSITY CALIBRATION (6 items)
139. Emotional intensity matches tolerance level
140. The reel creates tension without threat
141. The reel destabilizes beliefs, not identity
142. The viewer does not feel attacked
143. Curiosity exceeds clarity
144. Resolution is delayed rather than denied

### SECTION 14: ADVANCED MIX CHECKS (23 items)
145. No more than 70% of the reel is modeled from a reference
146. At least 30% of the reel is original
147. The reel is not recognizable as a clone
148. Cuts-per-minute fall within optimal range
149. Visual resets occur every 1–1.5 seconds
150. Looming motion or scale intrusion is used sparingly
151. On-screen text differs from spoken words
152. Cognitive dissonance is present
153. Beats are connected using conflict causality
154. No passive "and then" sequencing exists
155. Hook intensity matches payoff intensity
156. No bait-and-switch occurs
157. Early engagement velocity is prioritized
158. Creator is active for the first 30–60 minutes
159. Comments create DM flywheel potential
160. Stories are used to prime engagement
161. On-screen text contains searchable phrases
162. Captions are optimized for intent
163. The reel answers a specific query
164. Emotional complexity includes a secondary emotion
165. Sentence structure varies naturally
166. Colloquial phrasing is present
167. No synthetic or AI tone is detectable

### SECTION 15: VIRALITY REASONING & FORMULA ENGINE (20 items)
168. A primary virality driver is identified
169. Only one primary virality driver is selected
170. A full transcript is produced
171. On-screen text is extracted
172. Silent moments are noted
173. The core claim is isolated
174. The contrarian angle is isolated
175. The implication to the viewer is isolated
176. The emotional-cognitive sequence is mapped
177. Prediction error is present
178. Emotional spike is present
179. Cognitive tension is present
180. Identity alignment occurs
181. Behavioral release occurs
182. The dominant lever is isolated
183. A virality formula is written
184. Emotional debt still exists
185. The internal conflict remains unresolved in the niche
186. The POV remains credible
187. The framing has not become obvious

---

## STEP 3 — VIRAL MECHANISM EXPLANATION

Answer in ONE tight paragraph (150-200 words):

1. **Why did this reel actually go viral?** — Identify the primary psychological trigger
2. **What emotional debt does it trigger?** — The unresolved feeling viewers carry
3. **What internal conflict does it surface?** — The viewer's inner tension it exploits
4. **What identity permission does it give the viewer?** — How it validates their self-image
5. **What behavior does it reward?** — rewatch / send / save / comment — and WHY

---

## STEP 4 — SCORING SYSTEM

Score each section (0-10). Apply the weighting formula:
- Hook (Section 1): 20% weight
- Retention (Section 2): 15% weight
- All other sections: Equal distribution of remaining 65%

### Critical Failure Rules:
- If Section 1 (Hook) scores < 6 → Auto-cap total at 6.5 max
- If Section 2 (Retention) scores < 6 → Auto-cap total at 7.0 max

---

## STEP 5 — FINAL VIRAL GRADE

Based on the weighted total score:
- 🟢 Tier A: High-Confidence Replicable Viral Asset (8.5+)
- 🟡 Tier B: Partial Replication Possible (7.0–8.4)
- 🔴 Tier C: Non-Replicable / Context-Locked (<7.0)

---

## STEP 6 — REPLICATION DECISION OUTPUT

Provide:
- Should this reel be replicated? [YES / NO / CONDITIONAL]
- What MUST change if replicated?
- What should NEVER be copied?
- Best niches for this structure

---

## OUTPUT STRUCTURE

Return your analysis as a valid JSON object matching this structure:

{
  "step1_transcription": [...],
  "step2_checklist": [...],
  "step3_viral_mechanism": "...",
  "step4_scores": {...},
  "step5_grade": {...},
  "step6_replication": {...},
  "metadata": {...}
}

## RULES
- No generic commentary
- Every claim must map to a specific timestamp
- If uncertain, mark as PARTIAL
- Maintain clinical objectivity
- Return ONLY valid JSON`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: videoBase64,
      },
    },
    { text: prompt },
  ]);

  const response = await result.response;
  const text = response.text();

  // Extract JSON from response (handle markdown code blocks)
  let jsonText = text;
  if (text.includes('```json')) {
    jsonText = text.split('```json')[1].split('```')[0].trim();
  } else if (text.includes('```')) {
    jsonText = text.split('```')[1].split('```')[0].trim();
  }

  const analysis: GeminiAnalysis = JSON.parse(jsonText);

  return analysis;
}
