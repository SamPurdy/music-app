import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vite configuration.
 *
 * Key options:
 *   plugins    — @vitejs/plugin-react enables JSX transform + HMR
 *   resolve.alias — maps '@' to the src/ directory so you can write
 *                   `import foo from '@/lib/utils'` anywhere in src/
 *   server.port   — using 3000 to distinguish from other Vite projects
 *                   (default is 5173). Change if 3000 is taken.
 *
 * TODO: If you add env-specific config (proxies, https, etc.) do it here.
 */
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Allows '@/...' imports resolving to 'src/...'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    // TODO: Change port if 3000 conflicts with another project
    port: 3000,
    // Don't crash if port is taken — try the next available port
    strictPort: false,
    // Don't auto-open browser on start (personal preference — set to true if desired)
    open: false,
    host: 'localhost',
  },
})
