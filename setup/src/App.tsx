/**
 * App.tsx — Root application component.
 *
 * This is the starting point for your app's UI. It renders a tab bar at the
 * top and displays the content for the currently selected tab.
 *
 * TODO: Replace the two example tabs (Dashboard, Settings) with your real
 * feature areas. Each tab should map to a dedicated component in src/components/.
 *
 * The `cn()` utility (from @/lib/utils) is used throughout for conditional
 * Tailwind classes — this is the preferred pattern for this project.
 *
 * Color tokens used here (defined in tailwind.config.js):
 *   bg-app-bg        — outermost background
 *   bg-app-surface   — card / panel backgrounds
 *   border-app-border — subtle dividers
 *   text-app-text    — primary text
 *   text-app-muted   — secondary / dimmed text
 *   bg-app-accent    — active / highlighted state
 */
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Tab } from '@/types'

// ─── Tab definitions ────────────────────────────────────────────────────────
// TODO: Replace these with your real top-level sections.
// Each Tab id maps to a rendered panel below in <TabContent>.
const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'settings', label: 'Settings' },
]

// ─── Root component ─────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id)

  return (
    // Full-viewport dark container — matches app-bg token
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col">

      {/* ── Header / Tab bar ─────────────────────────────────────────────── */}
      {/*
        TODO: Replace this with your real navigation (router links, sidebar,
        breadcrumbs, etc.) once you have more than 2–3 tabs.
      */}
      <header className="border-b border-app-border bg-app-surface">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 py-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  // Base styles — all tabs share these
                  'px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150',
                  // Active tab: highlighted background + bright text
                  activeTab === tab.id
                    ? 'bg-app-accent text-white'
                    : 'text-app-muted hover:text-app-text hover:bg-white/5'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <TabContent activeTab={activeTab} />
      </main>
    </div>
  )
}

// ─── Tab content router ──────────────────────────────────────────────────────
/**
 * Renders the content panel for the currently active tab.
 *
 * TODO: Replace each placeholder panel with a real imported component.
 * Example:
 *   case 'dashboard': return <DashboardPage />
 *   case 'settings':  return <SettingsPage />
 */
function TabContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'dashboard':
      return <PlaceholderPanel title="Dashboard" description="Your main content goes here." />

    case 'settings':
      return <PlaceholderPanel title="Settings" description="App configuration goes here." />

    default:
      return null
  }
}

// ─── Placeholder panel ───────────────────────────────────────────────────────
/**
 * Temporary stand-in component — replace with real content as you build.
 *
 * TODO: Delete this component once all tabs have real implementations.
 */
function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-app-surface border border-app-border rounded-xl p-10 max-w-md w-full">
        <h2 className="text-xl font-semibold text-app-text mb-2">{title}</h2>
        <p className="text-app-muted text-sm">{description}</p>
        <div className="mt-6 text-xs text-app-muted/60 font-mono">
          {/* TODO: Replace this component with your real implementation */}
          src/components/{title.toLowerCase()}.tsx
        </div>
      </div>
    </div>
  )
}
