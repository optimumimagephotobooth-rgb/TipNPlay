# Replit Setup Guide for TipNPlay

## 🚀 Quick Import (30 seconds)

1. **Go to Replit**: https://replit.com
2. **Click "Create Repl"** (or the + button)
3. **Select "Import from GitHub"**
4. **Paste this URL**: 
   ```
   https://github.com/optimumimagephotobooth-rgb/TipNPlay
   ```
5. **Click "Import"**
6. **Wait for auto-setup** (Replit will install dependencies automatically)
7. **Click "Run"** button

That's it! Your app should start running.

## ⚙️ Configuration Steps

### Step 1: Set Up Environment Variables (Secrets)

1. Click the **🔒 Secrets** tab in the left sidebar
2. Add these three secrets:

   | Key | Value | Where to Get It |
   |-----|-------|-----------------|
   | `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
   | `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | [Supabase Dashboard](https://app.supabase.com) |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` | [Supabase Dashboard](https://app.supabase.com) |

### Step 2: Set Up Supabase (5 minutes)

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
   - Copy **Project URL** → Use as `VITE_SUPABASE_URL`
   - Copy **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

### Step 3: Set Up Stripe (Optional for testing)

1. **Create Stripe Account**: https://stripe.com (free)
2. **Get Test Key**:
   - Go to **Developers** → **API keys**
   - Copy **Publishable key** (starts with `pk_test_`)
   - Use as `VITE_STRIPE_PUBLISHABLE_KEY`

## 🎯 Running the App

### First Time Setup:

1. After importing, Replit will automatically run `npm install`
2. Wait for installation to complete (check the console)
3. Click the **▶️ Run** button
4. The app will start on your Replit URL

### Manual Commands (if needed):

```bash
# Install dependencies (usually auto-done)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔍 Verifying Setup

### Check if everything works:

1. **App loads**: You should see the TipNPlay homepage
2. **Create Event**: Try creating a test event
3. **Tipping Page**: Visit `/tip/[event-id]` to see the tipping interface
4. **Dashboard**: Check `/dj-dashboard` for analytics

### Common Issues:

**❌ "npm not found"**
- Solution: Make sure Node.js 20 is selected. Check `.replit` file has `modules = ["nodejs-20"]`

**❌ "Port already in use"**
- Solution: Vite will auto-select another port. Check console output for the actual URL.

**❌ "Environment variables not working"**
- Solution: Make sure you added them in **Secrets** (🔒), not in a `.env` file. Restart the Repl after adding secrets.

**❌ "Supabase connection error"**
- Solution: 
  - Verify your Supabase URL and key are correct
  - Make sure you ran the SQL schema
  - Check Supabase project is active (not paused)

**❌ "Stripe errors"**
- Solution: Make sure you're using a test key (`pk_test_...`) for development

## 📱 Accessing Your App

- **Development**: Your Replit URL (e.g., `https://tipnplay.yourusername.repl.co`)
- **Production**: Deploy using Replit Deploy or export to Vercel/Netlify

## 🎨 Customization

- **Colors**: Edit event colors in Create Event form
- **Branding**: Modify `src/components/Layout.jsx` for logo/branding
- **Styling**: All CSS files are in respective component folders

## 📚 Next Steps

1. ✅ Import project to Replit
2. ✅ Set up Supabase
3. ✅ Add environment variables
4. ✅ Test the app
5. 🚀 Create your first event!
6. 📊 View analytics in dashboard
7. 🎉 Share your tipping page!

## 💡 Tips

- **Free Tier**: Both Supabase and Stripe have generous free tiers
- **Real-time**: Supabase real-time works automatically once configured
- **QR Codes**: Generated automatically for each event
- **Analytics**: View charts and insights in the dashboard

## 🆘 Need Help?

- Check `README.md` for general documentation
- Check `IMPROVEMENTS.md` for feature list
- Check `SUPABASE_SCHEMA.sql` for database structure

---

**Ready to go!** 🎉 Your TipNPlay app should now be running on Replit!

