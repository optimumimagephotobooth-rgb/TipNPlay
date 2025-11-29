# Complete Payment System for Replit

## 🚀 What's Included

### ✅ Backend (Supabase Edge Functions)
- Payment intent creation
- Stripe webhook handling
- Event checkout sessions
- DJ payout processing

### ✅ Frontend Components
- Tip payment form with Stripe Elements
- Event creation with payment
- Payout profile management
- Payment confirmation flow

### ✅ Database Schema
- Payout profiles table
- Payouts table
- Updated tips table
- All RLS policies

---

## 📦 Files to Copy to Replit

### 1. Supabase Edge Functions

**File: `supabase/functions/create-payment-intent/index.ts`**
```typescript
// Copy the entire file from the repo
```

**File: `supabase/functions/stripe-webhook/index.ts`**
```typescript
// Copy the entire file from the repo
```

**File: `supabase/functions/create-event-checkout/index.ts`**
```typescript
// Copy the entire file from the repo
```

### 2. Frontend Components

**File: `src/components/TipPaymentForm.jsx`**
```javascript
// Copy the entire file from the repo
```

**File: `src/utils/payments.js`**
```javascript
// Copy the entire file from the repo
```

**File: `src/components/PayoutProfileForm.jsx`**
```javascript
// Copy the entire file from the repo
```

**File: `src/components/PayoutMethodsList.jsx`**
```javascript
// Copy the entire file from the repo
```

### 3. Updated Pages

**File: `src/pages/TipPage.jsx`**
- Updated with Stripe Elements integration
- Real payment processing

**File: `src/pages/CreateEvent.jsx`**
- Updated with Stripe Checkout integration

### 4. Database Schema

**File: `SUPABASE_SCHEMA.sql`**
- Run this in Supabase SQL Editor
- Includes payout tables and RLS policies

---

## 🔧 Setup Steps for Replit

### Step 1: Deploy Edge Functions

```bash
# In Replit Shell or locally with Supabase CLI
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook  
supabase functions deploy create-event-checkout
```

### Step 2: Add Environment Variables

In Supabase Dashboard → Edge Functions → Secrets:

```
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=https://your-repl.repl.co
```

### Step 3: Configure Stripe Webhook

1. Stripe Dashboard → Webhooks
2. Add endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret → Add to Supabase secrets

### Step 4: Update Database

Run `SUPABASE_SCHEMA.sql` in Supabase SQL Editor

---

## ✅ All Code Files Listed Below

