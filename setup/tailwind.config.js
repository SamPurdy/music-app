/** @type {import('tailwindcss').Config} */

/**
 * Tailwind CSS configuration — design token system.
 *
 * ALL colors in this project should use the `app-*` tokens below
 * instead of raw Tailwind colors (e.g. use `bg-app-bg` not `bg-slate-900`).
 *
 * This makes global theme changes a single-file edit.
 *
 * HOW TO CHANGE THE COLOR PALETTE:
 *   1. Replace the hex values in the `app` section below.
 *   2. Run `npm run build` to verify no TypeScript errors.
 *   3. Your whole app updates instantly.
 *
 * TOKEN REFERENCE:
 *   app-bg        — outermost page background (darkest layer)
 *   app-surface   — card/panel background (one step lighter than bg)
 *   app-surface-2 — nested panel / inner card (two steps lighter)
 *   app-border    — subtle border color (low-opacity white for dark themes)
 *   app-border-hover — border on hover / focused state
 *   app-text      — primary text color
 *   app-muted     — secondary / dimmed text
 *   app-accent    — primary interactive color (buttons, active tabs, highlights)
 *   app-success   — success / positive state color
 *   app-warning   — warning state color
 *   app-danger    — error / destructive state color
 *
 * USAGE EXAMPLES:
 *   <div className="bg-app-bg text-app-text border border-app-border">
 *   <button className="bg-app-accent hover:bg-app-accent/80 text-white">
 *   <span className="text-app-muted">Subtitle</span>
 */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        app: {
          // Page background — the darkest layer
          // TODO: Replace with your brand's darkest background color
          bg: '#0b0e14',

          // Primary surface — cards, panels, sidebars
          // TODO: Slightly lighter than bg — creates visual depth
          surface: '#0e1219',

          // Secondary surface — nested panels, inner cards
          // TODO: Another step lighter for layering
          'surface-2': '#131922',

          // Borders — low-opacity white works well on dark themes;
          // for light themes try something like 'rgba(0,0,0,0.1)'
          // TODO: Adjust opacity to match your contrast needs
          border: 'rgba(255,255,255,0.08)',
          'border-hover': 'rgba(255,255,255,0.16)',

          // Primary text and muted/secondary text
          // TODO: Replace with your palette's text colors
          text: '#e2e8f0',
          muted: '#64748b',

          // Accent — your brand's primary interactive color
          // Used for: active tabs, primary buttons, highlights, focus rings
          // TODO: Replace with your brand color
          accent: '#6366f1',      // indigo-500 — a neutral, versatile default

          // Semantic colors
          // TODO: Adjust if your brand has specific success/warning/danger colors
          success: '#10b981',     // emerald-500
          warning: '#f59e0b',     // amber-500
          danger: '#ef4444',      // red-500
        },
      },

      fontFamily: {
        // TODO: Replace 'Inter' with your chosen font (and update index.html/index.css)
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      // Reusable animations — use as className="animate-fade-in-up" etc.
      animation: {
        'fade-in-up': 'fade-in-up 0.25s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
