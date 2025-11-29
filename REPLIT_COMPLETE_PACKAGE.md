# 🚀 TipNPlay - Complete Replit Package

**Everything you need to get TipNPlay running on Replit!**

---

## 📦 Quick Start (3 Steps)

### Step 1: Import from GitHub
1. Go to [Replit.com](https://replit.com)
2. Click **"Create Repl"** → **"Import from GitHub"**
3. Paste: `https://github.com/optimumimagephotobooth-rgb/TipNPlay`
4. Click **"Import"**

### Step 2: Set Environment Variables
In Replit → **🔒 Secrets** tab, add:
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_key_here
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
```

### Step 3: Click "Run" ▶️
That's it! Your app will start automatically.

---

## 📋 Complete Setup Checklist

### ✅ After Import
- [ ] Code imported from GitHub
- [ ] Dependencies installed (auto-done by Replit)
- [ ] Environment variables set in Secrets

### ✅ Supabase Setup (5 minutes)
- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Run `SUPABASE_SCHEMA.sql` in SQL Editor
- [ ] Copy Project URL → Add to Replit Secrets as `VITE_SUPABASE_URL`
- [ ] Copy anon key → Add to Replit Secrets as `VITE_SUPABASE_ANON_KEY`

### ✅ Stripe Setup (Optional)
- [ ] Create account at [stripe.com](https://stripe.com)
- [ ] Get test publishable key (`pk_test_...`)
- [ ] Add to Replit Secrets as `VITE_STRIPE_PUBLISHABLE_KEY`

### ✅ Backend Functions (Optional - for payments)
- [ ] Deploy Supabase Edge Functions (see Backend Setup section)
- [ ] Configure Stripe webhook

---

## 🔧 Configuration Files

### `.replit` (Already configured)
```toml
language = "nodejs"
run = "npm run dev"
modules = ["nodejs-20"]

[deploy]
run = ["sh", "-c", "npm run build"]
publishDir = "dist"

[env]
VITE_STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_KEY_HERE"
VITE_SUPABASE_URL = "https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY = "your-anon-key-here"
```

### `replit.nix` (Already configured)
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
  ];
}
```

### `package.json` (Dependencies)
All dependencies are already listed. Replit will auto-install them.

---

## 📁 Project Structure

```
TipNPlay/
├── src/
│   ├── components/          # 28 React components
│   │   ├── AnimatedPage.jsx
│   │   ├── AnimatedButton.jsx
│   │   ├── FadeIn.jsx
│   │   ├── StaggerChildren.jsx
│   │   ├── QRCodeDisplay.jsx
│   │   ├── TipPaymentForm.jsx
│   │   └── ... (22 more)
│   ├── pages/               # 4 main pages
│   │   ├── Home.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── TipPage.jsx
│   │   └── DJDashboard.jsx
│   ├── utils/               # Utilities
│   │   └── payments.js
│   ├── lib/                 # Libraries
│   │   └── supabase.js
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── functions/           # 3 Edge Functions
│       ├── create-payment-intent/
│       ├── stripe-webhook/
│       └── create-event-checkout/
├── public/                  # Static assets
├── SUPABASE_SCHEMA.sql      # Database schema
├── .replit                  # Replit config
├── replit.nix              # Node.js config
└── package.json            # Dependencies
```

---

## 🗄️ Database Setup

### Run SQL Schema in Supabase

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Copy entire contents of `SUPABASE_SCHEMA.sql`
4. Click **"Run"**

This creates:
- ✅ `users` table
- ✅ `events` table
- ✅ `tips` table
- ✅ `payout_profiles` table
- ✅ `payouts` table
- ✅ RLS policies
- ✅ Indexes
- ✅ Triggers

---

## 🔌 Backend Functions Setup (Optional)

### Deploy Supabase Edge Functions

**In Replit Shell:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-event-checkout
```

### Set Edge Function Secrets

In **Supabase Dashboard** → **Edge Functions** → **Secrets**:
```
STRIPE_SECRET_KEY = sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
SITE_URL = https://your-repl.repl.co
```

---

## 🎯 What Gets Installed Automatically

When you import from GitHub, Replit will:
- ✅ Install Node.js 20
- ✅ Run `npm install` (installs all dependencies)
- ✅ Set up project structure
- ✅ Configure environment

**Dependencies installed:**
- React 18 + Vite
- Stripe SDK
- Supabase Client
- Framer Motion (animations)
- QR Code generator
- Charts (Recharts)
- And 10+ more packages

---

## 🚀 Running the App

### Development Mode
- Click **"Run"** button in Replit
- Or run: `npm run dev`
- App available at: `https://your-repl.repl.co`

### Production Build
- Click **"Deploy"** button
- Or run: `npm run build`
- Deploy the `dist` folder

---

## 🆘 Troubleshooting

### "npm not found"
- Check `.replit` has `modules = ["nodejs-20"]`
- Restart Repl

### "Port already in use"
- Vite auto-selects next available port
- Check console for actual URL

### "Environment variables not working"
- Make sure added in **Secrets** (🔒), not `.env`
- Restart Repl after adding secrets

### "Supabase connection error"
- Verify URL and key in Secrets
- Check SQL schema was run
- Verify Supabase project is active

### "Stripe errors"
- Use test key (`pk_test_...`) for development
- Check key is correct in Secrets

---

## 📚 Key Features Included

### ✅ Frontend
- React 18 + Vite
- Responsive design
- Animations (Framer Motion)
- QR code generation
- Social sharing
- Real-time updates
- Analytics dashboard

### ✅ Backend
- Supabase database
- Edge Functions (serverless)
- Stripe payments
- Real-time subscriptions

### ✅ Components
- 4 Animation components
- QR code components
- Payment forms
- Social proof
- Leaderboards
- Achievement badges
- Payout management

---

## 📖 Documentation Files

All documentation is included in the repo:
- `README.md` - Main documentation
- `HOW_TO_COPY_TO_REPLIT.md` - Detailed Replit guide
- `ALL_FILES_FOR_REPLIT.md` - Complete file reference
- `DATABASE_FUNCTIONS_GUIDE.md` - Database guide
- `BACKEND_SETUP.md` - Backend setup
- `ANIMATIONS_GUIDE.md` - Animation usage
- And 15+ more guides

---

## ✅ Verification Steps

After setup, verify:

1. **App loads**: Homepage displays
2. **Create Event**: Can create a test event
3. **Tipping Page**: Visit `/tip/[event-id]` works
4. **Dashboard**: `/dj-dashboard` shows analytics
5. **QR Codes**: QR codes generate correctly
6. **Payments**: Payment flow works (if Stripe configured)

---

## 🎉 You're Ready!

Once imported and configured:
- ✅ App runs automatically
- ✅ All features available
- ✅ Ready for production
- ✅ Fully documented

**Need help?** Check the documentation files in the repo!

---

**GitHub Repository:** `https://github.com/optimumimagephotobooth-rgb/TipNPlay`

**Import URL:** `https://github.com/optimumimagephotobooth-rgb/TipNPlay`

---

*Last Updated: Complete package ready for Replit import*

