# TipNPlay Backend Setup Guide

## 🚀 Complete Payment System Implementation

### Supabase Edge Functions Created

1. **create-payment-intent** - Processes tip payments
2. **stripe-webhook** - Handles Stripe webhooks
3. **create-event-checkout** - Creates event checkout sessions

---

## 📋 Setup Instructions

### Step 1: Deploy Supabase Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-event-checkout
```

### Step 2: Set Environment Variables

In Supabase Dashboard → Settings → Edge Functions → Secrets:

```
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=https://your-domain.com
```

### Step 3: Set Up Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret → Add to Supabase secrets

### Step 4: Update Database Schema

Run the updated `SUPABASE_SCHEMA.sql` which includes:
- `payout_profiles` table
- `payouts` table
- RLS policies

---

## 🔧 Frontend Integration

### TipPage.jsx Updates Needed

The `TipPage` component needs to:
1. Use `createPaymentIntent` from `utils/payments.js`
2. Integrate Stripe Elements for card input
3. Call `processTipPayment` on form submit
4. Handle payment confirmation

### CreateEvent.jsx Updates Needed

The `CreateEvent` component needs to:
1. Use `createEventCheckout` for payment
2. Redirect to Stripe Checkout
3. Handle success/cancel callbacks
4. Create event after successful payment

---

## 💳 Payment Flow

### Tip Payment Flow:
1. Guest fills tip form
2. Frontend calls `create-payment-intent` function
3. Function creates Stripe Payment Intent
4. Function saves tip record (pending)
5. Frontend confirms payment with Stripe
6. Stripe sends webhook on success
7. Webhook updates tip status to completed
8. Real-time update sent to event page

### Event Creation Flow:
1. DJ fills event form
2. Frontend calls `create-event-checkout` function
3. Function creates Stripe Checkout Session
4. DJ redirected to Stripe Checkout
5. After payment, redirects back with session_id
6. Frontend creates event in Supabase
7. Event is now active

---

## 🔐 Security

- ✅ All functions use Supabase Service Role Key
- ✅ Stripe webhook signature verification
- ✅ Input validation on all endpoints
- ✅ RLS policies protect data
- ✅ Environment variables secured

---

## 📊 Database Updates

### New Tables:
- `payout_profiles` - DJ payout methods
- `payouts` - Payout transaction history

### Updated Tables:
- `tips` - Now includes `payment_intent_id` and `status`
- `events` - Links to user's Stripe Connect account

---

## ✅ Testing Checklist

- [ ] Deploy all Edge Functions
- [ ] Set environment variables
- [ ] Configure Stripe webhook
- [ ] Test tip payment flow
- [ ] Test event creation flow
- [ ] Verify webhook processing
- [ ] Test real-time updates
- [ ] Test error handling

---

**Backend system ready to deploy!** 🚀

