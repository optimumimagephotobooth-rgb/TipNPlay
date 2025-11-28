import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow external connections (needed for Replit)
    strictPort: false // Allow port fallback
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  preview: {
    port: 3000,
    host: true
  }
})

