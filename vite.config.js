import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh optimizations
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    port: 3000,
    host: true, // Allow external connections (needed for Replit)
    strictPort: false, // Allow port fallback if 3000 is taken
    hmr: {
      clientPort: 443 // Replit uses HTTPS on port 443
    }
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimize build performance
    minify: 'esbuild', // Faster than terser
    target: 'esnext',
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'charts-vendor': ['recharts'],
          'utils-vendor': ['date-fns', 'canvas-confetti', 'react-hot-toast']
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline small assets (< 4KB)
    cssCodeSplit: true
  },
  preview: {
    port: 3000,
    host: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@stripe/stripe-js',
      '@stripe/react-stripe-js',
      '@supabase/supabase-js',
      'qrcode.react',
      'canvas-confetti',
      'react-hot-toast',
      'date-fns',
      'recharts',
      'react-share'
    ],
    exclude: []
  }
})

