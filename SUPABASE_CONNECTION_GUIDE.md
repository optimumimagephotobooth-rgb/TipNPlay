# Supabase Connection Guide

## 🔌 Quick Setup (5 minutes)

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Sign in or create account (free tier available)
3. Create a new project:
   - Click **"New Project"**
   - Enter project name: `tipnplay`
   - Set database password (save it!)
   - Choose region closest to you
   - Click **"Create new project"**
   - Wait 2-3 minutes for setup

### Step 2: Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `SUPABASE_SCHEMA.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### Step 4: Add to Replit Secrets

1. In Replit, click the **🔒 Secrets** tab
2. Add these secrets:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | Your Project URL from Step 2 |
   | `VITE_SUPABASE_ANON_KEY` | Your anon key from Step 2 |

3. Click **"Add secret"** for each
4. **Restart your Repl** after adding secrets

### Step 5: Test Connection

Open browser console (F12) and run:
```javascript
// Import the test function
import { testSupabaseConnection } from './src/utils/testSupabase.js'

// Run test
testSupabaseConnection()
```

Or use the global function:
```javascript
window.testSupabase()
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Supabase project created
- [ ] Database schema run successfully
- [ ] Environment variables added to Replit Secrets
- [ ] Repl restarted
- [ ] Connection test passes
- [ ] Can create events
- [ ] Can receive tips
- [ ] Real-time updates work

---

## 🧪 Testing the Connection

### Method 1: Browser Console Test

1. Open your app in browser
2. Press F12 (DevTools)
3. Go to Console tab
4. Run:
```javascript
window.testSupabase()
```

### Method 2: Check in App

1. Try creating an event at `/create-event`
2. If Supabase is connected, it will save to database
3. If not configured, it will use fallback/demo mode

### Method 3: Check Network Tab

1. Open DevTools → Network tab
2. Filter by "supabase"
3. You should see requests to your Supabase URL
4. Check response status (should be 200)

---

## 🔧 Troubleshooting

### Issue: "Invalid API key"
**Solution:**
- Double-check the anon key in Secrets
- Make sure you copied the **anon/public** key, not the service_role key
- Restart Repl after updating

### Issue: "Table does not exist"
**Solution:**
- Run `SUPABASE_SCHEMA.sql` in SQL Editor
- Check table names match exactly
- Verify RLS policies are created

### Issue: "Connection timeout"
**Solution:**
- Check your Supabase project is active (not paused)
- Verify the URL is correct
- Check network connectivity

### Issue: "RLS policy violation"
**Solution:**
- Check RLS policies in `SUPABASE_SCHEMA.sql`
- Make sure policies allow public read for tips table
- Verify user authentication if needed

---

## 📊 What Gets Stored in Supabase

### Events Table
- Event name, description, date/time
- Custom colors and branding
- Tip presets
- Thank you message

### Tips Table
- Tip amount
- Tipper name (optional)
- Message (optional)
- Timestamp
- Payment intent ID (for Stripe)

### Users Table (Future)
- User profiles
- Subscription tiers
- Account settings

---

## 🔐 Security Notes

- ✅ Using **anon key** (safe for client-side)
- ✅ Row Level Security (RLS) enabled
- ✅ Public read access for tips (needed for guest page)
- ✅ User-specific access for events
- ⚠️  Never expose **service_role** key in client code

---

## 🚀 Next Steps After Connection

1. ✅ Test creating an event
2. ✅ Test receiving a tip
3. ✅ Check real-time updates work
4. ✅ View data in Supabase dashboard
5. ✅ Set up Stripe for actual payments

---

**Need help?** Check the connection test results for specific error messages!

