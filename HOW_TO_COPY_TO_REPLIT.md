# 🚀 Complete Replit Setup Guide for TipNPlay

## ✅ EASIEST METHOD: Import from GitHub (Recommended)

Your code is already on GitHub, so this is the fastest way!

### Step-by-Step:

1. **Go to Replit**: https://replit.com
   - Log in or create a free account

2. **Create New Repl**:
   - Click the **"+"** button (or "Create Repl")
   - Select **"Import from GitHub"** tab

3. **Paste Your GitHub URL**:
   ```
   https://github.com/optimumimagephotobooth-rgb/TipNPlay
   ```
   - Or use the full URL: `https://github.com/optimumimagephotobooth-rgb/TipNPlay.git`

4. **Click "Import"**
   - Replit will automatically:
     - ✅ Clone all your files
     - ✅ Install Node.js 20
     - ✅ Install all dependencies (`npm install`)
     - ✅ Set up the project structure

5. **Wait for Setup** (1-2 minutes)
   - Watch the console for installation progress
   - You'll see: "Installing dependencies..." → "Done!"

6. **Set Environment Variables** (🔒 Secrets):
   - Click the **🔒 Secrets** tab in the left sidebar
   - Add these 3 secrets:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_key_here
     VITE_SUPABASE_URL = https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY = your-anon-key-here
     ```
   - Click **"Add secret"** for each one

7. **Click "Run"** ▶️
   - Your app will start automatically!
   - You'll see a URL like: `https://tipnplay.yourusername.repl.co`

---

## ⚙️ Configuration Steps

### Step 1: Set Up Supabase (5 minutes)

1. **Create Supabase Account**: https://supabase.com (free tier available)
2. **Create New Project**:
   - Click "New Project"
   - Choose organization
   - Enter project name: `tipnplay`
   - Set database password (save it!)
   - Choose region closest to you
   - Click "Create new project"

3. **Set Up Database Schema**:
   - In Supabase dashboard, go to **SQL Editor**
   - Click **"New query"**
   - Copy and paste the entire contents of `SUPABASE_SCHEMA.sql`
   - Click **"Run"** (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

4. **Get Your Credentials**:
   - Go to **Settings** → **API**
   - Copy **Project URL** → Use as `VITE_SUPABASE_URL` in Replit Secrets
   - Copy **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY` in Replit Secrets

### Step 2: Set Up Stripe (Optional for testing)

1. **Create Stripe Account**: https://stripe.com (free)
2. **Get Test Key**:
   - Go to **Developers** → **API keys**
   - Copy **Publishable key** (starts with `pk_test_`)
   - Use as `VITE_STRIPE_PUBLISHABLE_KEY` in Replit Secrets

### Step 3: Deploy Supabase Edge Functions

1. **Install Supabase CLI** (in Replit Shell):
   ```bash
   npm install -g supabase
   ```

2. **Login and Deploy**:
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy create-payment-intent
   supabase functions deploy stripe-webhook
   supabase functions deploy create-event-checkout
   ```

3. **Set Edge Function Secrets** (in Supabase Dashboard → Edge Functions → Secrets):
   - `STRIPE_SECRET_KEY` (from Stripe Dashboard)
   - `STRIPE_WEBHOOK_SECRET` (from Stripe Webhook)
   - `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Settings)
   - `SITE_URL` (your Replit URL)

---

## 📋 After Import - Quick Setup Checklist

- [ ] ✅ Code imported successfully
- [ ] ✅ Dependencies installed (`npm install` completed)
- [ ] ✅ Environment variables added in Secrets (🔒 tab)
- [ ] ✅ Supabase project created
- [ ] ✅ Database schema run (see `SUPABASE_SCHEMA.sql`)
- [ ] ✅ Supabase Edge Functions deployed
- [ ] ✅ Stripe webhook configured
- [ ] ✅ App runs without errors
- [ ] ✅ Test creating an event
- [ ] ✅ Test tipping page (`/tip/:eventId`)

---

## 🔧 First-Time Setup Commands (Run in Replit Shell)

```bash
# Install dependencies (usually auto-done)
npm install

# Start the app (or just click Run button)
npm run dev

# Build for production
npm run build
```

---

## 🎯 What Happens After Import?

1. **Replit detects** `.replit` file → Auto-configures Node.js 20
2. **Replit detects** `package.json` → Auto-runs `npm install`
3. **Your app is ready** → Just click Run!

---

## 🆘 Troubleshooting

**Problem**: "npm not found"
- **Fix**: Make sure `.replit` file has `modules = ["nodejs-20"]` (it should!)

**Problem**: "Port already in use"
- **Fix**: Vite will auto-select another port. Check console for the URL.

**Problem**: "Environment variables not working"
- **Fix**: Make sure you added them in **Secrets** (🔒), not `.env` file. Restart after adding.

**Problem**: Import fails
- **Fix**: Make sure your GitHub repo is public, or use a GitHub token for private repos.

**Problem**: "Supabase connection error"
- **Fix**: 
  - Verify your Supabase URL and key are correct
  - Make sure you ran the SQL schema
  - Check Supabase project is active (not paused)

**Problem**: "Stripe errors"
- **Fix**: Make sure you're using a test key (`pk_test_...`) for development

---

## 📚 Related Documentation

- `README.md` - General project info
- `SUPABASE_SCHEMA.sql` - Database schema
- `DATABASE_FUNCTIONS_GUIDE.md` - Database functions guide
- `BACKEND_SETUP.md` - Backend setup details
- `ALL_FILES_FOR_REPLIT.md` - Complete file list

---

**That's it!** Your TipNPlay app should now be running on Replit! 🎉

