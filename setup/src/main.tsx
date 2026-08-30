/**
 * main.tsx — Application entry point.
 *
 * Mounts the React app into the #root div in index.html.
 *
 * In development mode (npm run dev), the app is wrapped in DevErrorBoundary,
 * which catches React render errors and displays them visibly on-screen —
 * useful for local AI models that can't open browser DevTools.
 *
 * In production builds (npm run build), DevErrorBoundary is stripped out
 * and the app renders directly. Add your own production error boundary if needed.
 */
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { DevErrorBoundary } from './components/DevErrorBoundary'

const container = document.getElementById('root') as HTMLElement
if (!container) throw new Error('Root element #root not found in index.html')

const root = createRoot(container)

// Conditionally wrap in DevErrorBoundary during development only.
// import.meta.env.DEV is a Vite constant — it's statically replaced at build
// time so the production bundle never includes the DevErrorBoundary code.
const tree = import.meta.env.DEV ? (
  <DevErrorBoundary>
    <App />
  </DevErrorBoundary>
) : (
  <App />
)

root.render(tree)
