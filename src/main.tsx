import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { DevErrorBoundary } from './components/DevErrorBoundary'

const container = document.getElementById('root') as HTMLElement
if (!container) throw new Error('Root not found')

const root = createRoot(container)

// In development, wrap with an on-screen error boundary so the local model
// can see render errors without needing browser DevTools.
const tree = import.meta.env.DEV ? (
  <DevErrorBoundary>
    <App />
  </DevErrorBoundary>
) : (
  <App />
)

root.render(tree)
