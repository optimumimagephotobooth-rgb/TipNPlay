# Landing Page Background Video Implementation Guide

## 🎥 Video Setup

### File Placement (Vite-compatible)
```
public/
  videos/
    hero-background.mp4  ← Your video file here
  images/
    hero-poster.jpg      ← Video poster/thumbnail
    hero-fallback.jpg    ← Fallback image
```

### Video Specifications
- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080 (Full HD) or 1280x720 (HD)
- **Duration:** 10-30 seconds (will loop)
- **File Size:** < 5MB (optimized for web)
- **Frame Rate:** 24-30fps
- **Aspect Ratio:** 16:9

### Optimization Tips
1. **Compress video:** Use HandBrake or FFmpeg
2. **Reduce bitrate:** 2-3 Mbps for web
3. **Trim length:** Shorter = faster load
4. **Use poster:** Shows while video loads

---

## 🚀 Features Implemented

### ✅ Performance Optimizations
- **Lazy loading:** Video loads after initial render (100ms delay)
- **Non-blocking:** Doesn't block page load
- **Metadata preload:** Only loads metadata initially
- **Fallback image:** Shows immediately
- **CSS fallback:** Animated gradient if video fails

### ✅ Mobile Safety
- **Autoplay handling:** Gracefully handles autoplay blocks
- **PlaysInline:** Required for iOS
- **Muted:** Required for autoplay
- **Touch-friendly:** Video doesn't interfere with interactions

### ✅ Accessibility
- **Reduced motion:** Respects user preferences
- **Poster image:** Shows if video disabled
- **Fallback support:** Multiple fallback layers

---

## 📝 Usage

### Basic Usage
```jsx
<BackgroundVideo
  src="/videos/hero-background.mp4"
  poster="/images/hero-poster.jpg"
  fallbackImage="/images/hero-fallback.jpg"
  overlay={true}
  opacity={0.3}
/>
```

### Props
- `src` - Video file path (required)
- `poster` - Poster image path (optional)
- `fallbackImage` - Fallback image path (optional)
- `overlay` - Show dark overlay (default: true)
- `opacity` - Overlay opacity 0-1 (default: 0.3)
- `className` - Additional CSS classes

---

## 🎨 CSS Customization

### Adjust Overlay Opacity
```css
.video-overlay {
  opacity: 0.4; /* Darker overlay */
}
```

### Change Gradient
```css
.gradient-overlay {
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
}
```

---

## 🔧 Performance Rules

### ✅ Do's
- ✅ Keep video < 5MB
- ✅ Use MP4 H.264 format
- ✅ Provide poster image
- ✅ Provide fallback image
- ✅ Test on mobile devices
- ✅ Compress video properly

### ❌ Don'ts
- ❌ Don't use videos > 10MB
- ❌ Don't skip poster image
- ❌ Don't forget fallback
- ❌ Don't use unsupported formats
- ❌ Don't block initial render

---

## 📱 Mobile Autoplay Rules

### iOS Safari
- Requires `muted` attribute
- Requires `playsInline` attribute
- Autoplay may be blocked (fallback shows)

### Android Chrome
- Autoplay works if muted
- `playsInline` not required but recommended

### Desktop
- Autoplay works reliably
- All features supported

---

## 🎯 Loading Behavior

1. **Instant:** Fallback image shows immediately
2. **100ms:** Video starts loading (non-blocking)
3. **Video loads:** Smooth fade-in transition
4. **If fails:** CSS animation fallback shows

---

## ✅ Implementation Complete

The video background system is:
- ✅ Ultra-light and instant-load
- ✅ Mobile-safe with autoplay handling
- ✅ Performance optimized
- ✅ Accessibility compliant
- ✅ Fallback supported

**Ready to use!** 🎥

