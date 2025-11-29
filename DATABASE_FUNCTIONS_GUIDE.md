# 🗄️ Database Schema & Functions Guide

## 📍 Location of All Database Files

### 1. **Database Schema (SQL)** 
**File:** `SUPABASE_SCHEMA.sql`
**Location:** Root directory (`TipNPlay/SUPABASE_SCHEMA.sql`)

This file contains:
- ✅ All database tables (users, events, tips, payout_profiles, payouts)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ SQL functions (triggers)
- ✅ Database triggers

---

### 2. **Supabase Edge Functions (Backend API)**
**Location:** `supabase/functions/`

These are TypeScript functions that run on Supabase's serverless platform:

#### **Function 1: Create Payment Intent**
**Path:** `supabase/functions/create-payment-intent/index.ts`
- Creates Stripe payment intents for tips
- Saves tip records to database
- Handles Stripe Connect for DJ payouts

#### **Function 2: Stripe Webhook**
**Path:** `supabase/functions/stripe-webhook/index.ts`
- Handles Stripe webhook events
- Updates tip status when payment succeeds/fails
- Processes payment confirmations

#### **Function 3: Create Event Checkout**
**Path:** `supabase/functions/create-event-checkout/index.ts`
- Creates Stripe Checkout sessions for event creation
- Handles event payment processing

---

## 📋 SQL Functions in Schema

### `update_updated_at_column()` Function
**Location:** Lines 126-132 in `SUPABASE_SCHEMA.sql`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Purpose:** Automatically updates the `updated_at` timestamp when records are modified.

**Used by Triggers:**
- `update_users_updated_at` (line 135-138)
- `update_events_updated_at` (line 140-143)
- `update_payout_profiles_updated_at` (if exists)

---

## 🚀 How to Set Up Database Functions

### Step 1: Run Database Schema

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Copy and paste the **entire contents** of `SUPABASE_SCHEMA.sql`
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: ✅ "Success. No rows returned"

This will create:
- ✅ All tables
- ✅ All indexes
- ✅ All RLS policies
- ✅ The `update_updated_at_column()` function
- ✅ All triggers

---

### Step 2: Deploy Supabase Edge Functions

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-event-checkout
```

#### Option B: Using Supabase Dashboard

1. Go to **Supabase Dashboard** → Your Project
2. Click **Edge Functions** (left sidebar)
3. Click **"Create a new function"**
4. For each function:
   - Name: `create-payment-intent`
   - Copy code from `supabase/functions/create-payment-intent/index.ts`
   - Click **"Deploy"**
   - Repeat for `stripe-webhook` and `create-event-checkout`

---

### Step 3: Set Edge Function Secrets

In **Supabase Dashboard** → **Edge Functions** → **Secrets**, add:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SITE_URL=https://your-repl.repl.co
```

---

## 📁 Complete File Structure

```
TipNPlay/
├── SUPABASE_SCHEMA.sql                    ✅ SQL Schema (run in Supabase SQL Editor)
│   ├── Tables: users, events, tips, payout_profiles, payouts
│   ├── Indexes
│   ├── RLS Policies
│   └── SQL Function: update_updated_at_column()
│
└── supabase/
    └── functions/                         ✅ Edge Functions (deploy to Supabase)
        ├── create-payment-intent/
        │   └── index.ts                   ✅ Creates Stripe payment intents
        ├── stripe-webhook/
        │   └── index.ts                   ✅ Handles Stripe webhooks
        └── create-event-checkout/
            └── index.ts                   ✅ Creates event checkout sessions
```

---

## 🔍 What Each Function Does

### SQL Function: `update_updated_at_column()`
- **Type:** PostgreSQL function
- **Purpose:** Auto-update timestamps
- **Runs:** Automatically via triggers
- **Location:** In database (created by schema)

### Edge Function: `create-payment-intent`
- **Type:** TypeScript/Deno function
- **Purpose:** Create Stripe payment for tips
- **Runs:** Called from frontend (`src/utils/payments.js`)
- **Location:** Supabase Edge Functions

### Edge Function: `stripe-webhook`
- **Type:** TypeScript/Deno function
- **Purpose:** Handle Stripe payment events
- **Runs:** Called by Stripe when payment completes
- **Location:** Supabase Edge Functions

### Edge Function: `create-event-checkout`
- **Type:** TypeScript/Deno function
- **Purpose:** Create Stripe checkout for event creation
- **Runs:** Called from frontend (`src/pages/CreateEvent.jsx`)
- **Location:** Supabase Edge Functions

---

## ✅ Checklist for Replit Setup

- [ ] ✅ Run `SUPABASE_SCHEMA.sql` in Supabase SQL Editor
- [ ] ✅ Deploy `create-payment-intent` Edge Function
- [ ] ✅ Deploy `stripe-webhook` Edge Function
- [ ] ✅ Deploy `create-event-checkout` Edge Function
- [ ] ✅ Set Edge Function secrets (Stripe keys, Supabase keys)
- [ ] ✅ Configure Stripe webhook URL in Stripe Dashboard
- [ ] ✅ Test payment flow

---

## 📚 Related Files

- **Frontend Payment Utils:** `src/utils/payments.js` (calls Edge Functions)
- **Frontend Supabase Client:** `src/lib/supabase.js` (queries database)
- **Backend Setup Guide:** `BACKEND_SETUP.md`

---

## 🆘 Troubleshooting

**Problem:** "Function not found" error
- **Fix:** Make sure Edge Functions are deployed in Supabase Dashboard

**Problem:** "Permission denied" error
- **Fix:** Check RLS policies in schema are correct

**Problem:** "Stripe webhook not working"
- **Fix:** 
  1. Get webhook URL from Supabase Edge Functions
  2. Add it to Stripe Dashboard → Webhooks
  3. Set webhook secret in Edge Function secrets

**Problem:** "updated_at not updating"
- **Fix:** Make sure triggers are created (check schema ran successfully)

---

**All database functions are ready to deploy!** 🚀

