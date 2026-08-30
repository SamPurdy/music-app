# [Your App Name] — Architecture Reference

> **For AI agents:** Read this file only when you need deep context about a specific component
> or module. At session start, read `docs/HANDOFF.md` and `docs/DEVLOG.md` first — they are
> much cheaper and usually sufficient. Load this file only when those aren't enough.

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 18 |
| Language | TypeScript | 5.3 |
| Build Tool | Vite | 5 |
| Styling | Tailwind CSS | 3.4 |
| Animations | Framer Motion | 11 |
| Icons | Lucide React | latest |
| Class Utility | clsx + tailwind-merge (`cn()`) | latest |
| Testing | Vitest | 1 |

Dev server: `npm run dev` -> http://localhost:3000

---

## Directory Structure

```
src/
  App.tsx                    # Root component -- tab shell / router
  main.tsx                   # Entry point -- mounts React + DevErrorBoundary
  index.css                  # Global styles + Tailwind base directives
  components/
    DevErrorBoundary.tsx     # Dev-only error boundary (wraps entire app in dev mode)
    # TODO: add your components here
  lib/
    utils.ts                 # Shared utilities: cn(), formatDate(), sleep(), debounce()
    # TODO: add domain-specific lib folders (e.g. lib/api/, lib/auth/)
  types/
    index.ts                 # All shared TypeScript interfaces -- single source of truth
  vite-env.d.ts              # Vite env type declarations
docs/
  HANDOFF.md                 # Session bridge -- read first every session
  DEVLOG.md                  # Chronological change log
  QUICK_REF.md               # Mid-session cheat sheet (API, tokens, shortcuts)
  TODOS.md                   # Prioritized task list
  context/
    README.md                # Guide for writing context cards
    example-component.md     # Example context card
    schemas.md               # Data schemas -- TypeScript interfaces + API shapes
```

---

## Component Map

> Update this table as you add components. It is the model's map of the UI.

| Component | File | Description |
|---|---|---|
| `App` | `src/App.tsx` | Root -- replace with your app's top-level layout |
| `DevErrorBoundary` | `src/components/DevErrorBoundary.tsx` | Dev-only error display -- do not remove |
| _(add your components here)_ | | |

---

## Lib Exports

### `src/lib/utils.ts`

| Export | Signature | Description |
|---|---|---|
| `cn` | `(...inputs: ClassValue[]) => string` | Merges Tailwind classes safely (clsx + twMerge) |
| `formatDate` | `(date: Date or string, fmt?: string) => string` | Human-readable date formatting |
| `sleep` | `(ms: number) => Promise<void>` | Async delay helper |
| `debounce` | `<T extends (...args) => void>(fn: T, ms: number) => T` | Debounce wrapper |

---

## TypeScript Types

All shared types live in `src/types/index.ts`. Add new interfaces there.

> Key existing types (update as you add more):
> - `Tab` -- `{ id: string; label: string }` — top-level navigation tab
> - `ApiResponse<T>` -- `{ data: T|null; error: string|null; status?: number }` — standard fetch wrapper
> - `LoadingState` -- `'idle' | 'loading' | 'success' | 'error'` — async status machine

---

## Key Files Quick Reference

| Purpose | File |
|---|---|
| Add a new page/tab | `src/App.tsx` |
| Add a shared type | `src/types/index.ts` |
| Add a shared utility | `src/lib/utils.ts` |
| Global CSS / design tokens | `src/index.css` |
| Tailwind config / colors | `tailwind.config.js` |
| Vite aliases + plugins | `vite.config.ts` |

---

## Design Tokens

> Document your color tokens here once you have customized `tailwind.config.js`.

All colors use the `app-*` namespace defined in `tailwind.config.js`:

| Token class | Default value | Purpose |
|---|---|---|
| `bg-app-bg` | `#0b0e14` | Outermost page background (darkest layer) |
| `bg-app-surface` | `#0e1219` | Card / panel background |
| `bg-app-surface-2` | `#131922` | Nested panel / inner card |
| `border-app-border` | `rgba(255,255,255,0.08)` | Subtle dividers |
| `border-app-border-hover` | `rgba(255,255,255,0.16)` | Border on hover / focus |
| `text-app-text` | `#e2e8f0` | Primary text |
| `text-app-muted` | `#64748b` | Secondary / dimmed text |
| `bg-app-accent` | `#6366f1` | Primary interactive (buttons, active tabs) |
| `text-app-success` | `#10b981` | Success / positive states |
| `text-app-warning` | `#f59e0b` | Warning states |
| `text-app-danger` | `#ef4444` | Error / destructive states |

> Never use raw Tailwind colors (e.g. `bg-slate-900`). Always use the `app-*` alias.
> To retheme the entire app, change the hex values in `tailwind.config.js` once.

---

## Scripts Reference

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Vite HMR server at :3000 |
| Dev + log | `npm run dev:log` | Dev server, all output piped to `dev.log` |
| Build | `npm run build` | TypeScript check + Vite production build |
| Preview | `npm run preview` | Serve production build locally |
| Test | `npm run test` | Vitest unit test runner |
| Lint | `npm run lint` | ESLint on src/ |
| Setup wizard | `npm run init` | Interactive project customization wizard |

---

## Local Model Server Reference

| Tool | Default URL | Model Command | Notes |
|---|---|---|---|
| LM Studio | `http://localhost:1234/v1` | Load model via GUI | Set context to 32768 in model settings |
| Ollama | `http://localhost:11434/v1` | `ollama run <model>` | Start service with `ollama serve` |

**Recommended models (7B-14B range):**
- `qwen2.5-coder:7b` (Ollama) -- strong code, fast
- `codellama:13b` (Ollama) -- good general coding
- `Qwen2.5-Coder-7B-Instruct` (LM Studio) -- equivalent to above

**Key parameters:**
- Context length: `32768`
- Temperature: `0.3` (code) / `0.6` (brainstorming)
- Max output tokens: `2048-4096`
- Repeat penalty: `1.1`
- Max concurrent predictions: `1`