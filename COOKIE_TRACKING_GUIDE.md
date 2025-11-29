# 🍪 Cookie Tracking Implementation Guide

## ✅ What's Implemented

### 1. **Cookie Management System**
- ✅ Cookie utilities (`src/utils/cookies.js`)
- ✅ Set, get, delete cookies
- ✅ Cookie consent banner (GDPR/CCPA compliant)
- ✅ Automatic tracking cookie setup

### 2. **Tracking Cookies Set**
When a user visits the site (with consent), the following cookies are automatically set:

- **`_tipnplay_visitor_id`** - Unique visitor identifier (365 days)
- **`_tipnplay_session_id`** - Session identifier (1 day)
- **`_tipnplay_visit_count`** - Number of visits (365 days)
- **`_tipnplay_first_visit`** - First visit timestamp (365 days)
- **`_tipnplay_last_visit`** - Last visit timestamp (365 days)
- **`_tipnplay_referrer`** - Where visitor came from (30 days)
- **`_tipnplay_device_type`** - mobile/desktop (365 days)
- **`_tipnplay_browser`** - Browser type (365 days)
- **`_tipnplay_utm_source`** - UTM source (30 days)
- **`_tipnplay_utm_medium`** - UTM medium (30 days)
- **`_tipnplay_utm_campaign`** - UTM campaign (30 days)
- **`_tipnplay_utm_term`** - UTM term (30 days)
- **`_tipnplay_utm_content`** - UTM content (30 days)
- **`_tipnplay_cookie_consent`** - Consent status (365 days)

### 3. **Cookie Consent Banner**
- ✅ GDPR/CCPA compliant
- ✅ Shows on first visit
- ✅ Options: Accept All, Reject, Customize
- ✅ Remembers user preference
- ✅ Only sets tracking cookies after consent

### 4. **Integration**
- ✅ Integrated into `App.jsx` and `main.jsx`
- ✅ Analytics only initialize after consent
- ✅ Tracking cookies only set after consent
- ✅ Enhanced analytics with cookie data

---

## 📋 How It Works

### First Visit Flow:
1. User visits site
2. Cookie consent banner appears after 1 second
3. User clicks "Accept All"
4. Tracking cookies are set
5. Analytics initialize
6. All future visits use existing cookies

### Returning Visitor Flow:
1. User visits site
2. System checks for `_tipnplay_cookie_consent` cookie
3. If consent was given, tracking cookies are updated
4. Analytics work automatically
5. No banner shown (consent remembered)

---

## 🔧 Usage

### Get Tracking Data:
```javascript
import { getTrackingData } from './utils/cookies'

const data = getTrackingData()
// Returns: { visitorId, sessionId, visitCount, firstVisit, ... }
```

### Check Consent:
```javascript
import { getCookie } from './utils/cookies'

const consent = getCookie('_tipnplay_cookie_consent')
// Returns: 'accepted', 'rejected', 'custom', or null
```

### Set Tracking Cookies Manually:
```javascript
import { setTrackingCookies } from './utils/cookies'

// Only call if consent is given
const consent = getCookie('_tipnplay_cookie_consent')
if (consent === 'accepted' || consent === 'custom') {
  setTrackingCookies()
}
```

### Enhanced Tracking:
```javascript
import { trackEventWithCookies, trackPageViewWithCookies } from './utils/tracking'

// Automatically includes cookie data
trackPageViewWithCookies('/tip/event-123')
trackEventWithCookies('tip', { amount: 25, eventId: 'event-123' })
```

---

## 🎯 What Gets Tracked

### Automatic Tracking:
- ✅ Visitor ID (unique per user)
- ✅ Session ID (unique per session)
- ✅ Visit count (how many times they've visited)
- ✅ First visit timestamp
- ✅ Last visit timestamp
- ✅ Referrer (where they came from)
- ✅ Device type (mobile/desktop)
- ✅ Browser type
- ✅ UTM parameters (marketing campaigns)

### Enhanced Analytics:
- ✅ All analytics events include cookie data
- ✅ Page views tracked with visitor info
- ✅ Tips tracked with visitor info
- ✅ Conversions tracked with visitor info

---

## 🔒 Privacy & Compliance

### GDPR Compliance:
- ✅ Cookie consent banner
- ✅ User can reject cookies
- ✅ User can customize preferences
- ✅ Clear privacy policy link
- ✅ Only essential cookies without consent

### CCPA Compliance:
- ✅ "Do Not Sell" option (Reject button)
- ✅ Clear disclosure of cookie usage
- ✅ User control over tracking

### Cookie Categories:
1. **Essential Cookies** - Always set (consent not required)
2. **Analytics Cookies** - Only with consent
3. **Marketing Cookies** - Only with consent

---

## 📊 Analytics Integration

### Google Analytics:
- Visitor ID sent as custom dimension
- Session ID tracked
- Visit count tracked
- Device/browser info tracked

### Plausible:
- All cookie data sent as props
- Visitor tracking enabled
- Session tracking enabled

---

## 🚀 Next Steps

### Optional Enhancements:
1. **Cookie Preferences Modal** - Let users customize which cookies to accept
2. **Backend Tracking** - Store tracking data in Supabase
3. **Retention Analysis** - Track user retention over time
4. **A/B Testing** - Use visitor ID for consistent A/B test groups
5. **Personalization** - Use tracking data to personalize experience

---

## 📝 Files Created

1. `src/utils/cookies.js` - Cookie management utilities
2. `src/utils/tracking.js` - Enhanced tracking with cookies
3. `src/components/CookieConsent.jsx` - Consent banner component
4. `src/components/CookieConsent.css` - Consent banner styles

---

## ✅ Status

**Cookie tracking is now fully implemented and active!**

- ✅ Cookies set on first visit (with consent)
- ✅ Consent banner shows on first visit
- ✅ Analytics enhanced with cookie data
- ✅ GDPR/CCPA compliant
- ✅ Privacy-friendly

---

**The system is ready to track visitors and provide valuable analytics data!** 🎉

