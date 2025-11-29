# 🚀 How to Copy Code to Replit - Complete Guide

## Method 1: Import from GitHub (EASIEST) ⭐

### Step 1: Push All Code to GitHub
```bash
# In your terminal (already done if you pushed)
git add -A
git commit -m "Complete payment system"
git push origin main
```

### Step 2: Import to Replit
1. Go to [Replit.com](https://replit.com)
2. Click **"Create Repl"** → **"Import from GitHub"**
3. Paste your repo URL: `https://github.com/optimumimagephotobooth-rgb/TipNPlay.git`
4. Click **"Import"**
5. Replit will clone everything automatically! ✅

---

## Method 2: Copy-Paste Individual Files

If you already have a Replit project, copy these files:

### 📁 New Files to Create:

#### 1. `supabase/functions/create-payment-intent/index.ts`
Copy from: `REPLIT_CODE_PACKAGE.txt` (see below)

#### 2. `supabase/functions/stripe-webhook/index.ts`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 3. `supabase/functions/create-event-checkout/index.ts`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 4. `src/components/TipPaymentForm.jsx`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 5. `src/components/TipPaymentForm.css`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 6. `src/components/PayoutProfileForm.jsx`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 7. `src/components/PayoutProfileForm.css`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 8. `src/components/PayoutMethodsList.jsx`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 9. `src/components/PayoutMethodsList.css`
Copy from: `REPLIT_CODE_PACKAGE.txt`

#### 10. `src/utils/payments.js`
Copy from: `REPLIT_CODE_PACKAGE.txt`

### 📝 Files to Update:

#### 1. `src/pages/TipPage.jsx`
- Add Stripe Elements wrapper
- Replace tip form with `TipPaymentForm` component

#### 2. `src/pages/CreateEvent.jsx`
- Add Stripe checkout flow
- Use `createEventCheckout` function

#### 3. `SUPABASE_SCHEMA.sql`
- Add payout tables (run in Supabase SQL Editor)

---

## Method 3: Upload Files Directly

1. In Replit, click **"Files"** tab
2. Right-click folder → **"Upload file"**
3. Select files from your computer
4. Or drag & drop files into Replit

---

## 📋 Quick Checklist After Import

- [ ] All files copied
- [ ] Install dependencies: `npm install`
- [ ] Set environment variables in Replit Secrets
- [ ] Deploy Supabase Edge Functions
- [ ] Run database schema in Supabase
- [ ] Configure Stripe webhook
- [ ] Test payment flow

---

## 🔧 Setup Commands (Run in Replit Shell)

```bash
# Install dependencies
npm install

# Install Supabase CLI (for Edge Functions)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy Edge Functions
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-event-checkout
```

---

## 🔑 Environment Variables Needed

### In Replit Secrets (🔒 tab):
- `VITE_STRIPE_PUBLISHABLE_KEY` ✅ (already set)
- `VITE_SUPABASE_URL` ✅ (already set)
- `VITE_SUPABASE_ANON_KEY` ✅ (already set)

### In Supabase Dashboard → Edge Functions → Secrets:
- `STRIPE_SECRET_KEY` (from Stripe Dashboard)
- `STRIPE_WEBHOOK_SECRET` (from Stripe Webhook)
- `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Settings)
- `SITE_URL` (your Replit URL: `https://your-repl.repl.co`)

---

## ✅ Recommended: Use Method 1 (GitHub Import)

It's the fastest and ensures you get everything!

