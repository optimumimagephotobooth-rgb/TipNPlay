# TipNPlay DJ Payout Methods System

## 🏦 Payout Methods Supported

### Option A: Global, Simple Payout Profiles

#### Supported Methods:
1. **Bank Transfer (ACH)**
   - Direct bank account
   - Routing number
   - Account number
   - Account holder name

2. **Stripe Connect**
   - Express accounts
   - Standard accounts
   - Instant payouts
   - Scheduled payouts

3. **PayPal**
   - PayPal email
   - Instant transfers
   - Business accounts

4. **Venmo**
   - Venmo handle
   - Quick transfers

5. **Cash App**
   - Cash App tag
   - Instant payouts

---

## 📊 Payout Profile Structure

### Database Schema
```sql
-- Payout profiles table
CREATE TABLE payout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL, -- 'bank', 'stripe', 'paypal', 'venmo', 'cashapp'
  is_default BOOLEAN DEFAULT false,
  account_name TEXT,
  account_details JSONB, -- Encrypted payment details
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'verified', 'suspended'
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payouts table
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  payout_profile_id UUID REFERENCES payout_profiles(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  method_type TEXT NOT NULL,
  transaction_id TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Features

### Payout Profile Management
- ✅ Add multiple payout methods
- ✅ Set default method
- ✅ Verify accounts
- ✅ Edit/delete profiles
- ✅ View payout history

### Payout Processing
- ✅ Automatic payouts (daily/weekly/monthly)
- ✅ Manual payout requests
- ✅ Instant payouts (Stripe Connect)
- ✅ Scheduled payouts
- ✅ Payout notifications

### Security
- ✅ Encrypted account details
- ✅ Verification required
- ✅ Two-factor authentication
- ✅ Audit logs

---

## 🚀 Implementation Components

1. **PayoutProfileForm** - Add/edit payout methods
2. **PayoutMethodsList** - Display all methods
3. **PayoutHistory** - Transaction history
4. **PayoutSettings** - Payout preferences
5. **PayoutRequest** - Request manual payout

---

**Ready to implement!** 💰

