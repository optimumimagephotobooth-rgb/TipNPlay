import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const replitAllowedHosts = (process.env.REPLIT_DOMAINS ?? '')
  .split(',')
  .map((domain) => domain.trim())
  .filter(Boolean)

const allowedHosts = Array.from(
  new Set(['localhost', '127.0.0.1', '::1', ...replitAllowedHosts]),
)

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // allow network access (needed for Replit)
    strictPort: false, // fall back if 3000 is taken
    allowedHosts,
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  preview: {
    port: 3000,
    host: true,
  },
})

