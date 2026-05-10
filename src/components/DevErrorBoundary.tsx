/**
 * DevErrorBoundary — catches React render/lifecycle errors and displays them
 * visibly on-screen in development so the local model can see what broke
 * without needing to open browser DevTools.
 *
 * NOTE: Error Boundaries must be class components per React's API.
 * This is the one explicit exception to the "no class components" rule.
 */
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
  errorInfo: string | null
}

export class DevErrorBoundary extends Component<Props, State> {
  state: State = { error: null, errorInfo: null }

  static getDerivedStateFromError(error: Error): State {
    return { error, errorInfo: null }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({ error, errorInfo: info.componentStack })
    console.error('[DevErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null })
  }

  render() {
    const { error, errorInfo } = this.state
    if (!error) return this.props.children

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#0b0e14',
          color: '#f87171',
          fontFamily: 'monospace',
          padding: '2rem',
          overflow: 'auto',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⚠</span>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fca5a5' }}>
                React Render Error
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                DEV ONLY — this panel is hidden in production
              </div>
            </div>
            <button
              onClick={this.handleReset}
              style={{
                marginLeft: 'auto',
                padding: '0.4rem 1rem',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 6,
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Retry
            </button>
          </div>

          {/* Error message */}
          <div
            style={{
              background: '#1c0a0a',
              border: '1px solid #7f1d1d',
              borderRadius: 8,
              padding: '1rem 1.25rem',
              marginBottom: '1rem',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ color: '#fca5a5', fontWeight: 600 }}>{error.name}: </span>
            {error.message}
          </div>

          {/* Stack trace */}
          {error.stack && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Error Stack
              </div>
              <pre
                style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '1rem',
                  fontSize: '0.78rem',
                  color: '#cbd5e1',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  lineHeight: 1.6,
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                {error.stack}
              </pre>
            </div>
          )}

          {/* Component stack */}
          {errorInfo && (
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Component Stack
              </div>
              <pre
                style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '1rem',
                  fontSize: '0.78rem',
                  color: '#93c5fd',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  maxHeight: 250,
                  overflow: 'auto',
                }}
              >
                {errorInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }
}
