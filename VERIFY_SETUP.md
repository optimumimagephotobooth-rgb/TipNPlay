# TipNPlay Setup Verification Guide

Use this guide to verify everything is working correctly after merging changes in Replit.

## ✅ Step-by-Step Verification

### 1. Check Dependencies Installation

Run in Replit Shell:
```bash
npm install
```

**Expected Output:**
- Should install 6 new packages without errors
- Check for: `qrcode.react`, `canvas-confetti`, `react-hot-toast`, `date-fns`, `recharts`, `react-share`

**Verify:**
```bash
npm list --depth=0
```

You should see all dependencies listed.

---

### 2. Verify Environment Variables

Check that these are set in Replit Secrets (🔒 tab):

- ✅ `VITE_STRIPE_PUBLISHABLE_KEY` - Should start with `pk_test_` or `pk_live_`
- ✅ `VITE_SUPABASE_URL` - Should be `https://xxx.supabase.co`
- ✅ `VITE_SUPABASE_ANON_KEY` - Should be a long string starting with `eyJ`

**Test in Shell:**
```bash
echo $VITE_STRIPE_PUBLISHABLE_KEY
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

All should show values (not empty).

---

### 3. Verify Configuration Files

**Check `.replit` file:**
```bash
cat .replit | grep "modules"
```
Should show: `modules = ["nodejs-20"]`

**Check `replit.nix`:**
```bash
cat replit.nix
```
Should show: `pkgs.nodejs-20_x`

**Check `vite.config.js`:**
```bash
cat vite.config.js | grep "host"
```
Should show: `host: true`

---

### 4. Verify New Files Exist

Check that new files were added:

```bash
# Core new files
ls src/pages/TipPage.jsx
ls src/pages/TipPage.css
ls src/lib/supabase.js
ls src/components/SubscriptionTier.jsx

# Should all exist (no "file not found" errors)
```

---

### 5. Check Package.json Dependencies

```bash
cat package.json | grep -A 10 "dependencies"
```

Should include:
- `qrcode.react`
- `canvas-confetti`
- `react-hot-toast`
- `date-fns`
- `recharts`
- `react-share`

---

### 6. Start the App

```bash
npm run dev
```

**Expected:**
- Server starts without errors
- Shows URL (usually `https://your-repl.repl.co`)
- No red error messages in console

---

### 7. Test Routes

Open your Replit URL and test these pages:

#### ✅ Home Page (`/`)
- [ ] Page loads
- [ ] No video loading errors
- [ ] CSS animation background shows
- [ ] "Get Started" button works

#### ✅ Create Event (`/create-event`)
- [ ] Page loads
- [ ] Multi-step form appears
- [ ] Can fill in event details
- [ ] Color pickers work
- [ ] Can proceed to payment step

#### ✅ DJ Dashboard (`/dj-dashboard`)
- [ ] Page loads
- [ ] Shows stats cards
- [ ] Can see events (or "no events" message)
- [ ] Analytics section visible (if event selected)

#### ✅ Tip Page (`/tip/[any-id]`)
- [ ] Page loads (even with demo event)
- [ ] Shows tip amount buttons
- [ ] Can enter custom amount
- [ ] Form submission works
- [ ] Confetti animation triggers

---

### 8. Test Supabase Connection (Optional)

If Supabase is configured, test the connection:

```bash
# In browser console (F12), run:
console.log(import.meta.env.VITE_SUPABASE_URL)
```

Should show your Supabase URL (not the placeholder).

---

### 9. Check Console for Errors

Open browser DevTools (F12) → Console tab:

**Should NOT see:**
- ❌ "Failed to load resource" errors
- ❌ "Module not found" errors
- ❌ "Cannot read property" errors
- ❌ Stripe/Supabase connection errors (unless not configured)

**OK to see:**
- ✅ Info/warning messages
- ✅ Supabase connection attempts (if not fully configured)

---

### 10. Performance Check

**Test page load speed:**
- Home page should load in < 2 seconds
- No heavy video file loading
- CSS animations should be smooth

**Test on mobile view:**
- Open DevTools → Toggle device toolbar
- Check responsive design works
- Buttons are touch-friendly

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found" errors
**Fix:**
```bash
npm install
npm run dev
```

### Issue: Environment variables not working
**Fix:**
1. Check Secrets tab (🔒)
2. Verify variable names match exactly (case-sensitive)
3. Restart Repl after adding secrets

### Issue: Port already in use
**Fix:**
- Vite will auto-select another port
- Check console output for actual URL

### Issue: Supabase errors
**Fix:**
- If not using Supabase yet, errors are OK
- App will use fallback/demo data
- Set up Supabase later if needed

### Issue: Stripe errors
**Fix:**
- Make sure `VITE_STRIPE_PUBLISHABLE_KEY` is set
- Use test key (`pk_test_...`) for development

---

## ✅ Verification Checklist

Copy and check off as you verify:

- [ ] Dependencies installed successfully
- [ ] Environment variables set in Secrets
- [ ] `.replit` shows Node.js 20
- [ ] `replit.nix` shows Node.js 20
- [ ] `vite.config.js` has `host: true`
- [ ] New files exist (TipPage.jsx, supabase.js, etc.)
- [ ] App starts without errors (`npm run dev`)
- [ ] Home page loads correctly
- [ ] Create Event page works
- [ ] DJ Dashboard loads
- [ ] Tip page works (even with demo data)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast page loads

---

## 🎯 Quick Test Script

Run this in Replit Shell to quickly verify:

```bash
# Check Node version
node --version
# Should show v20.x.x

# Check dependencies
npm list --depth=0 | grep -E "qrcode|confetti|toast|recharts|react-share"
# Should list all new packages

# Check files exist
test -f src/pages/TipPage.jsx && echo "✅ TipPage.jsx exists" || echo "❌ TipPage.jsx missing"
test -f src/lib/supabase.js && echo "✅ supabase.js exists" || echo "❌ supabase.js missing"
test -f .replit && echo "✅ .replit exists" || echo "❌ .replit missing"

# Check config
grep -q "nodejs-20" .replit && echo "✅ Node.js 20 configured" || echo "❌ Wrong Node version"
```

---

## 🚀 If Everything Checks Out

Your setup is complete! You can now:

1. **Create your first event** at `/create-event`
2. **View the tipping page** at `/tip/[event-id]`
3. **Check analytics** in the dashboard
4. **Share QR codes** with your audience

---

## 📞 Need Help?

If something doesn't work:
1. Check the error message in console
2. Verify environment variables are set
3. Make sure `npm install` completed successfully
4. Try restarting the Repl

