# Animation Libraries Guide

## 🎨 Animation Libraries Added

### 1. **Framer Motion** ⭐ (Primary)
- **Best for:** React animations, page transitions, micro-interactions
- **Size:** ~50KB gzipped
- **Why:** Most popular React animation library, declarative API, great performance
- **Features:**
  - Page transitions
  - Hover/tap effects
  - Stagger animations
  - Spring physics
  - Gesture support

### 2. **Lottie React** 🎬
- **Best for:** Complex animations from After Effects
- **Size:** ~30KB gzipped
- **Why:** Industry standard for complex animations
- **Features:**
  - JSON-based animations
  - After Effects export
  - Lightweight
  - Scalable vector animations

### 3. **Canvas Confetti** 🎉 (Already Installed)
- **Best for:** Celebration effects
- **Size:** ~5KB gzipped
- **Why:** Perfect for tip celebrations
- **Features:**
  - Confetti animations
  - Customizable colors
  - Lightweight

---

## 📦 Components Created

### `AnimatedPage.jsx`
Smooth page transitions with fade and slide effects.

**Usage:**
```jsx
<AnimatedPage>
  <YourContent />
</AnimatedPage>
```

### `AnimatedButton.jsx`
Buttons with hover and tap animations.

**Usage:**
```jsx
<AnimatedButton 
  variant="primary"
  onClick={handleClick}
>
  Click Me
</AnimatedButton>
```

### `FadeIn.jsx`
Simple fade-in animation with optional delay.

**Usage:**
```jsx
<FadeIn delay={0.2}>
  <YourContent />
</FadeIn>
```

### `StaggerChildren.jsx`
Animates children one after another.

**Usage:**
```jsx
<StaggerChildren>
  <motion.div variants={itemVariants}>Item 1</motion.div>
  <motion.div variants={itemVariants}>Item 2</motion.div>
  <motion.div variants={itemVariants}>Item 3</motion.div>
</StaggerChildren>
```

---

## 🚀 Quick Examples

### Page Transition
```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
  Content
</motion.div>
```

### Hover Effect
```jsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Hover me!
</motion.div>
```

### Stagger Animation
```jsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Spring Animation
```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  Bouncy!
</motion.div>
```

---

## 📊 Performance

- **Framer Motion:** Optimized with `will-change`, GPU acceleration
- **Lazy loading:** Animations only load when needed
- **Code splitting:** Animation code split from main bundle
- **Reduced motion:** Respects `prefers-reduced-motion`

---

## 🎯 Best Practices

1. **Use AnimatePresence** for route transitions
2. **Memoize** animated components
3. **Use variants** for reusable animations
4. **Respect** user preferences (reduced motion)
5. **Optimize** with `will-change` CSS property

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lottie Files](https://lottiefiles.com/)
- [Animation Examples](https://www.framer.com/motion/examples/)

---

**All animations are production-ready and optimized!** 🎨

