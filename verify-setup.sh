#!/bin/bash

# TipNPlay Setup Verification Script
# Run this in Replit Shell: bash verify-setup.sh

echo "🔍 TipNPlay Setup Verification"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "1. Checking Node.js version..."
NODE_VERSION=$(node --version)
if [[ $NODE_VERSION == v20* ]]; then
    echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Wrong Node version: $NODE_VERSION (should be v20.x.x)${NC}"
fi
echo ""

# Check if dependencies are installed
echo "2. Checking dependencies..."
if npm list qrcode.react &>/dev/null; then
    echo -e "${GREEN}✅ qrcode.react installed${NC}"
else
    echo -e "${RED}❌ qrcode.react missing - run: npm install${NC}"
fi

if npm list canvas-confetti &>/dev/null; then
    echo -e "${GREEN}✅ canvas-confetti installed${NC}"
else
    echo -e "${RED}❌ canvas-confetti missing${NC}"
fi

if npm list react-hot-toast &>/dev/null; then
    echo -e "${GREEN}✅ react-hot-toast installed${NC}"
else
    echo -e "${RED}❌ react-hot-toast missing${NC}"
fi

if npm list recharts &>/dev/null; then
    echo -e "${GREEN}✅ recharts installed${NC}"
else
    echo -e "${RED}❌ recharts missing${NC}"
fi
echo ""

# Check key files exist
echo "3. Checking key files..."
FILES=(
    "src/pages/TipPage.jsx"
    "src/pages/TipPage.css"
    "src/lib/supabase.js"
    "src/components/SubscriptionTier.jsx"
    ".replit"
    "replit.nix"
    "package.json"
    "vite.config.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done
echo ""

# Check .replit configuration
echo "4. Checking Replit configuration..."
if grep -q "nodejs-20" .replit 2>/dev/null; then
    echo -e "${GREEN}✅ Node.js 20 configured in .replit${NC}"
else
    echo -e "${RED}❌ Node.js 20 not found in .replit${NC}"
fi

if grep -q "host: true" vite.config.js 2>/dev/null; then
    echo -e "${GREEN}✅ Vite host configured for Replit${NC}"
else
    echo -e "${YELLOW}⚠️  Vite host setting not found${NC}"
fi
echo ""

# Check environment variables (if accessible)
echo "5. Checking environment variables..."
if [ -n "$VITE_STRIPE_PUBLISHABLE_KEY" ]; then
    if [[ $VITE_STRIPE_PUBLISHABLE_KEY == pk_* ]]; then
        echo -e "${GREEN}✅ VITE_STRIPE_PUBLISHABLE_KEY is set${NC}"
    else
        echo -e "${YELLOW}⚠️  VITE_STRIPE_PUBLISHABLE_KEY exists but format looks wrong${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  VITE_STRIPE_PUBLISHABLE_KEY not set (check Replit Secrets)${NC}"
fi

if [ -n "$VITE_SUPABASE_URL" ]; then
    if [[ $VITE_SUPABASE_URL == https://*.supabase.co ]]; then
        echo -e "${GREEN}✅ VITE_SUPABASE_URL is set${NC}"
    else
        echo -e "${YELLOW}⚠️  VITE_SUPABASE_URL exists but format looks wrong${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  VITE_SUPABASE_URL not set (check Replit Secrets)${NC}"
fi
echo ""

# Summary
echo "================================"
echo "📋 Verification Complete!"
echo ""
echo "Next steps:"
echo "1. If any ❌ errors, fix them first"
echo "2. Run: npm run dev"
echo "3. Test the app in your browser"
echo "4. Check VERIFY_SETUP.md for detailed testing"

