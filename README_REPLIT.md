# TipNPlay - Replit Setup Guide

## Quick Start

1. **Import from GitHub:**
   - Go to Replit
   - Click "Create Repl"
   - Select "Import from GitHub"
   - Enter: `https://github.com/optimumimagephotobooth-rgb/TipNPlay`
   - Click "Import"

2. **Install Dependencies:**
   - Replit will automatically run `npm install` when you open the project
   - Or manually run: `npm install` in the Shell

3. **Set Environment Variables:**
   - Go to Secrets (lock icon in left sidebar)
   - Add: `VITE_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
   - Or edit `.replit` file and update the `VITE_STRIPE_PUBLISHABLE_KEY` value

4. **Run the Project:**
   - Click the "Run" button
   - Or run: `npm run dev`
   - The app will be available at the Replit URL

5. **Deploy:**
   - Click "Deploy" button in Replit
   - Or run: `npm run build` then deploy the `dist` folder

## Environment Variables

Make sure to set these in Replit Secrets:
- `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

## Notes

- The app runs on port 3000 by default
- Replit will automatically expose it via their URL
- For production, use the Deploy button to build and host

