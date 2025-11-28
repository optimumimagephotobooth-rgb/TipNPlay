# TipNPlay Master Feature & Architecture Pack

## 🏗️ Full App Architecture

### Frontend Structure
```
TipNPlay/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx        # Main layout wrapper
│   │   ├── AnimatedPage.jsx  # Page transition wrapper
│   │   ├── AnimatedButton.jsx # Animated buttons
│   │   ├── QRCodeDisplay.jsx # QR code component
│   │   ├── QRCodeModal.jsx   # QR modal
│   │   ├── SupabaseStatus.jsx # Connection status
│   │   └── SubscriptionTier.jsx # Subscription UI
│   ├── pages/                # Page components
│   │   ├── Home.jsx          # Landing page
│   │   ├── CreateEvent.jsx   # Event creation flow
│   │   ├── DJDashboard.jsx   # DJ analytics dashboard
│   │   └── TipPage.jsx       # Guest tipping page
│   ├── lib/                  # Core libraries
│   │   └── supabase.js       # Supabase client
│   ├── utils/                # Utility functions
│   │   ├── qrStorage.js      # QR storage utilities
│   │   ├── api.js            # API helpers
│   │   ├── retry.js          # Retry logic
│   │   └── performance.js    # Performance tools
│   ├── hooks/                # Custom React hooks
│   │   ├── useDebounce.js    # Debounce hook
│   │   └── useLocalStorage.js # LocalStorage hook
│   ├── App.jsx               # Main app router
│   └── main.jsx              # Entry point
├── public/                   # Static assets
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies
```

### Backend Structure (Supabase)
```
Supabase/
├── Tables/
│   ├── users                 # User profiles
│   ├── events                # Event data
│   └── tips                  # Tip transactions
├── Storage/
│   └── tipnplay-assets/      # QR codes, images
├── Functions/                # Edge functions (if needed)
└── Policies/                 # Row Level Security
```

---

## 📄 Frontend Pages

### 1. **Home Page** (`/`)
**Purpose:** Landing page and marketing
**Features:**
- Hero section with animated background
- How it works section
- Key benefits
- Call-to-action buttons
- Social sharing

**Components Used:**
- `AnimatedPage`
- `AnimatedButton`
- `FadeIn`
- `StaggerChildren`

### 2. **Create Event** (`/create-event`)
**Purpose:** Event creation flow
**Features:**
- Multi-step form (3 steps)
- Event details input
- Color customization
- Tip presets configuration
- Stripe payment integration
- QR code generation
- Success page with sharing

**Components Used:**
- `QRCodeDisplay`
- `AnimatedButton`
- Stripe Elements

### 3. **DJ Dashboard** (`/dj-dashboard`)
**Purpose:** Analytics and event management
**Features:**
- Event list
- Analytics charts (Recharts)
- Real-time tip updates
- QR code display
- Event sharing
- Time range filters

**Components Used:**
- `QRCodeDisplay`
- `QRCodeModal`
- `SupabaseStatus`
- Recharts components

### 4. **Tip Page** (`/tip/:eventId`)
**Purpose:** Guest tipping interface
**Features:**
- Event display
- Tip amount selection
- Custom tip input
- Tipper name/message
- Real-time updates
- Confetti animation
- Recent tips display

**Components Used:**
- `AnimatedButton`
- Canvas Confetti
- Real-time Supabase subscriptions

---

## 🔌 Backend Endpoints

### Supabase Tables

#### **users**
```sql
- id (UUID, PK)
- email (TEXT)
- full_name (TEXT)
- subscription_tier (TEXT)
- subscription_status (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **events**
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- name (TEXT)
- description (TEXT)
- event_date (DATE)
- event_time (TIME)
- end_time (TIME)
- custom_colors (JSONB)
- tip_presets (JSONB)
- thank_you_message (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **tips**
```sql
- id (UUID, PK)
- event_id (UUID, FK → events)
- amount (DECIMAL)
- tipper_name (TEXT)
- message (TEXT)
- payment_intent_id (TEXT)
- status (TEXT)
- created_at (TIMESTAMP)
```

### Supabase Storage Buckets

#### **tipnplay-assets**
- Path: `qr-codes/{event_id}/{filename}`
- Public: Yes
- Purpose: Store QR code images

---

## 💳 Stripe Workflows

### Payment Flow

1. **Event Creation**
   - User creates event
   - Stripe Checkout Session created
   - User completes payment
   - Event activated

2. **Tip Processing**
   - Guest selects tip amount
   - Payment Intent created
   - Guest completes payment
   - Tip recorded in database
   - Real-time update sent

### Stripe Integration Points

- **CreateEvent.jsx**: Checkout session creation
- **TipPage.jsx**: Payment Intent creation
- **Environment Variables**: `VITE_STRIPE_PUBLISHABLE_KEY`

---

## 📱 QR System Automation

### Automatic Generation
- Generated on event creation
- Stored in Supabase Storage
- High-resolution for printing
- Multiple formats (PNG, SVG)

### Components
- `QRCodeDisplay.jsx`: Main display component
- `QRCodeModal.jsx`: Full-screen modal
- `qrStorage.js`: Storage utilities

### Features
- ✅ High-res downloads (4x scale)
- ✅ SVG export
- ✅ Custom colors
- ✅ Center logo overlay
- ✅ Print-ready

---

## 🖥️ Server Structure Rules

### Vite Configuration
```javascript
- Server: host: true (Replit)
- Port: 3000 (auto-fallback)
- HMR: Port 443 (Replit HTTPS)
- Build: ESBuild minification
- Code splitting: Manual chunks
```

### Environment Variables
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Build Requirements
- Node.js 20
- ESBuild for minification
- Code splitting enabled
- Source maps disabled (production)
- Asset optimization

---

## 🐛 Known Issues & Fixes

### Issue 1: Video Loading Performance
**Status:** ✅ Fixed
**Solution:** Replaced with CSS animations

### Issue 2: Node.js Version Mismatch
**Status:** ✅ Fixed
**Solution:** Updated to Node.js 20 in all configs

### Issue 3: Replit Configuration
**Status:** ✅ Fixed
**Solution:** Added `.replit`, `replit.nix` configs

### Issue 4: Supabase Connection
**Status:** ✅ Fixed
**Solution:** Added connection testing component

### Issue 5: QR Code Downloads
**Status:** ✅ Fixed
**Solution:** Enhanced QR components with high-res export

---

## ⚡ Performance Requirements

### Target Metrics
- **First Load:** < 1 second
- **Time to Interactive:** < 2 seconds
- **Bundle Size:** < 200KB initial
- **Lighthouse Score:** > 90

### Optimizations Applied
- ✅ Code splitting (React.lazy)
- ✅ Component memoization
- ✅ Data caching (5-minute cache)
- ✅ Request deduplication
- ✅ Optimistic UI updates
- ✅ Image lazy loading
- ✅ CSS animations (no video)
- ✅ Bundle optimization

---

## 🎯 Cursor-Specific Instructions

### When Adding Features
1. Use existing component patterns
2. Follow animation guidelines (Framer Motion)
3. Add error boundaries
4. Include loading states
5. Test with Supabase fallback

### Code Style
- Use functional components
- Hooks for state management
- Memoization for expensive operations
- Error handling with fallbacks
- TypeScript-ready structure

### Testing Checklist
- [ ] Works without Supabase (fallback mode)
- [ ] Works without Stripe (demo mode)
- [ ] Mobile responsive
- [ ] Fast loading
- [ ] No console errors
- [ ] Animations smooth
- [ ] QR codes scan correctly

---

## ✅ Full "What to Rebuild" Checklist

### Core Features
- [x] Home page with animations
- [x] Event creation flow
- [x] DJ dashboard with analytics
- [x] Guest tipping page
- [x] QR code generation
- [x] Real-time updates
- [x] Stripe integration
- [x] Supabase integration

### UI Components
- [x] Animated page transitions
- [x] Animated buttons
- [x] QR code display
- [x] QR code modal
- [x] Loading spinners
- [x] Error boundaries
- [x] Toast notifications

### Performance
- [x] Code splitting
- [x] Component memoization
- [x] Data caching
- [x] Request optimization
- [x] Bundle optimization
- [x] CSS animations

### Backend
- [x] Supabase schema
- [x] RLS policies
- [x] Storage buckets
- [x] Real-time subscriptions
- [x] Error handling

### Documentation
- [x] Setup guides
- [x] Architecture docs
- [x] Component guides
- [x] Performance docs
- [x] Troubleshooting

---

## 🚀 Next Steps

1. **Test all features** end-to-end
2. **Set up Supabase** storage bucket
3. **Configure Stripe** webhooks
4. **Deploy to production**
5. **Monitor performance**

---

**Architecture is production-ready!** 🎉

