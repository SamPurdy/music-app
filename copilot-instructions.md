---
applyTo: "**"
---

# Kilo — Copilot Agent Instructions

## Shell Environment
- All shell commands use **Git Bash** syntax (via `pwsh_shim.go` wrapper)
- Never use PowerShell or CMD syntax
- Use `&&` for command chaining, `$VAR` for env vars, `/` in paths

## Project Commands
```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # TypeScript check + Vite production build
npm run test      # Run Vitest tests
npm run lint      # ESLint
git add . && git commit -m "message"   # ONLY when user explicitly requests a commit
```

## Architecture
- React 19 + TypeScript + Vite + Tailwind CSS
- Music theory engine: `tonal` (JS library)
- Animation: `framer-motion`
- Icons: `lucide-react`

## File Locations
| Domain | Path |
|--------|------|
| Components | `src/components/` |
| Music theory logic | `src/lib/music-theory/` |
| MIDI generation | `src/lib/midi/` |
| TypeScript types | `src/types/index.ts` |
| Global styles | `src/index.css` |
| Tailwind config | `tailwind.config.js` |

## Code Conventions
- Functional React components with hooks only
- All interfaces explicitly typed — no `any`
- Tailwind utility classes via `twMerge` for conditional styling
- Color tokens: `studio-bg`, `studio-surface`, `studio-border`, `studio-text`, `studio-muted`, `studio-accent`
- Music theory calculations only in `src/lib/music-theory/`
- No hardcoded note frequencies — derive from `tonal`
