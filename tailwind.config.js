/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#090c12',
          surface: '#0e1219',
          'surface-2': '#131922',
          border: 'rgba(255,255,255,0.08)',
          'border-hover': 'rgba(255,255,255,0.16)',
          text: '#e2e8f0',
          muted: '#64748b',
          accent: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          purple: '#8b5cf6',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
      },
      keyframes: {
        spin_slow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulse_ring: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1' },
        },
        fade_in_up: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
