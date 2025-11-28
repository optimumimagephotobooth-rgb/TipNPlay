# TipNPlay

Live Tipping Platform for DJs & Entertainers

## Features

- 🎵 Instant payouts — DJs keep 100%
- ⚡ One-tap tipping for guests
- 🎉 Perfect for clubs, weddings, parties & festivals
- 🔓 No account needed for tippers
- 📊 Real-time analytics and insights
- 📱 QR code generation for easy sharing
- 🎨 Custom branding for events

## 🚀 Quick Start with Replit

### Option 1: Import from GitHub (Recommended)

1. Go to [Replit](https://replit.com)
2. Click **"Create Repl"**
3. Select **"Import from GitHub"**
4. Enter: `https://github.com/optimumimagephotobooth-rgb/TipNPlay`
5. Click **"Import"**
6. Replit will automatically:
   - Install Node.js 20
   - Install all dependencies
   - Set up the project

### Option 2: Manual Setup

1. Create a new Repl
2. Choose **"Node.js"** template
3. Clone the repository:
   ```bash
   git clone https://github.com/optimumimagephotobooth-rgb/TipNPlay.git .
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## ⚙️ Configuration

### Environment Variables (Replit Secrets)

1. Click the **🔒 Secrets** tab in Replit sidebar
2. Add these secrets:

   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Supabase Setup

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the contents of `SUPABASE_SCHEMA.sql`
4. Copy your project URL and anon key
5. Add them to Replit Secrets (see above)

## 🏃 Running the Project

### In Replit:

1. Click the **▶️ Run** button, or
2. Run manually: `npm run dev`
3. The app will be available at your Replit URL

### Local Development:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
TipNPlay/
├── src/
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── DJDashboard.jsx
│   │   └── TipPage.jsx
│   ├── components/      # Reusable components
│   ├── lib/            # Utilities (Supabase client)
│   └── App.jsx          # Main app component
├── public/             # Static assets
├── .replit             # Replit configuration
├── replit.nix          # Nix environment config
└── package.json        # Dependencies
```

## 🎯 Key Features

- **Guest Tipping Page**: Beautiful one-tap tipping experience
- **Event Management**: Create and customize tipping events
- **Real-Time Updates**: Live tip notifications and counters
- **Analytics Dashboard**: Charts and insights for your events
- **QR Code Generation**: Easy sharing via QR codes
- **Social Sharing**: Share events on WhatsApp, Facebook, Twitter
- **Custom Branding**: Customize colors and messaging

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Payments**: Stripe
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **Notifications**: React Hot Toast

## 📚 Documentation

- See `IMPROVEMENTS.md` for detailed feature list
- See `SUPABASE_SCHEMA.sql` for database schema

## 🐛 Troubleshooting

### Replit Issues

**Problem**: npm not found
- **Solution**: The `.replit` file should auto-configure Node.js 20. If not, manually select Node.js 20 in the Replit environment settings.

**Problem**: Port already in use
- **Solution**: Vite will automatically use the next available port. Check the console output for the actual port.

**Problem**: Environment variables not working
- **Solution**: Make sure you've added them in Replit Secrets (🔒 icon), not in a `.env` file.

### General Issues

**Problem**: Supabase connection errors
- **Solution**: Verify your Supabase URL and anon key are correct in Replit Secrets.

**Problem**: Stripe errors
- **Solution**: Make sure you're using a valid Stripe publishable key (starts with `pk_test_` or `pk_live_`).

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

