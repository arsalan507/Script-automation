# API Keys Setup Guide

Quick guide to get your Gemini and OpenAI API keys.

---

## 🔑 Gemini API Key (Google)

### Step 1: Go to Google AI Studio
Visit: https://makersuite.google.com/app/apikey

### Step 2: Sign in
- Use your Google account
- Accept terms if prompted

### Step 3: Create API Key
1. Click **"Get API Key"** or **"Create API Key"**
2. Choose existing Google Cloud project or create new one
3. Click **"Create API key in new project"** (recommended for testing)
4. Copy the API key immediately

### Example:
```
AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Free Tier Limits:
- **15 requests per minute**
- **1,500 requests per day**
- **Resets daily**
- **No credit card required**

### Testing Your Key:
```bash
curl \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY
```

---

## 🔑 OpenAI API Key

### Step 1: Go to OpenAI Platform
Visit: https://platform.openai.com/api-keys

### Step 2: Sign Up / Log In
- Create account or sign in
- Verify email if new account

### Step 3: Add Payment Method
1. Go to **Billing** → https://platform.openai.com/account/billing
2. Click **"Add payment method"**
3. Add credit/debit card
4. Add minimum $5 credit (recommended $10-20 for testing)

### Step 4: Create API Key
1. Go to **API Keys** → https://platform.openai.com/api-keys
2. Click **"+ Create new secret key"**
3. Give it a name (e.g., "Script Automation")
4. **Copy immediately** - you won't see it again!

### Example:
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Pricing:
- **GPT-4 Turbo**: ~$0.01 - $0.03 per analysis
- **Check current pricing**: https://openai.com/pricing

### Testing Your Key:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4-turbo-preview",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## ⚙️ Adding Keys to Your Project

### 1. Open `.env.local`
```bash
cd script-automation
open .env.local
# or use any text editor
```

### 2. Add Your Keys
```bash
# Replace with your actual keys
GEMINI_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Keep these as default
GEMINI_MODEL=gemini-2.0-flash-exp
OPENAI_MODEL=gpt-4-turbo-preview
MAX_FILE_SIZE=100000000
```

### 3. Save and Restart Server
```bash
# If server is running, stop it (Ctrl+C)
# Then restart
npm run dev
```

---

## 🛡️ Security Best Practices

### ✅ DO:
- Store keys in `.env.local` (gitignored by default)
- Keep keys secret - never share publicly
- Use separate keys for development and production
- Rotate keys periodically
- Monitor usage dashboards

### ❌ DON'T:
- Commit `.env.local` to git
- Share keys in screenshots or videos
- Use production keys in development
- Hard-code keys in your code
- Share keys in chat/email

---

## 🚨 If Your Key is Exposed

### Gemini API Key:
1. Go to https://makersuite.google.com/app/apikey
2. Delete compromised key
3. Create new key
4. Update `.env.local`

### OpenAI API Key:
1. Go to https://platform.openai.com/api-keys
2. Click revoke on compromised key
3. Create new key
4. Update `.env.local`
5. Check billing for unauthorized usage

---

## 📊 Monitoring Usage

### Gemini (Google AI Studio):
- No dashboard yet for free tier
- Rate limits enforced automatically
- Check quota errors in console

### OpenAI:
1. Go to https://platform.openai.com/usage
2. View usage by:
   - Day/month
   - Model
   - API key
3. Set up usage limits:
   - Go to **Billing** → **Limits**
   - Set monthly budget cap

---

## 💰 Cost Estimates

### For This Project:

**Per Reel Analysis:**
- Gemini: $0.002-0.005 (or FREE with free tier)
- OpenAI: $0.03-0.10
- **Total**: ~$0.04-0.15 per reel

**Monthly Estimates:**
- 10 reels: $0.40-1.50
- 50 reels: $2-7.50
- 100 reels: $4-15
- 500 reels: $20-75

**Tip**: Use Gemini free tier (1,500/day) to minimize costs!

---

## 🧪 Testing Your Setup

### Quick Test:
1. Get both API keys
2. Add to `.env.local`
3. Run `npm run dev`
4. Go to http://localhost:3000
5. Upload a short test video (5-15 seconds)
6. Wait 1-2 minutes for analysis
7. Check results!

### If It Works:
✅ You're ready to analyze reels!

### If It Fails:
1. Check console for errors
2. Verify API keys are correct
3. Check OpenAI has credits
4. See [Troubleshooting](README.md#troubleshooting)

---

## 📞 Support

**Gemini Issues:**
- Docs: https://ai.google.dev/docs
- Community: https://stackoverflow.com/questions/tagged/google-gemini

**OpenAI Issues:**
- Docs: https://platform.openai.com/docs
- Support: https://help.openai.com
- Community: https://community.openai.com

---

**Ready to get your API keys? Start with Gemini (it's free!) then add OpenAI.**
