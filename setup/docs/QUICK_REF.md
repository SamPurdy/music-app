# Quick Reference (Local Model)

> Use this mid-session to refresh context without burning tokens on the full README.
> **New session?** Read HANDOFF.md + top 2 DEVLOG entries first, then this if needed.

---

## Stack

React 18 + TS + Vite + Tailwind CSS. No backend.
Dev server: `npm run dev` → http://localhost:3000

> ⚙️ **Customize:** Update this line if you change the port or add a backend.

---

## Tab → Component Map

> ⚙️ **Customize:** Update this table as you build out the app.
> Add a row for each new tab / page / major feature area.

| Tab / Route | Component file | Context card |
|---|---|---|
| Dashboard | `src/components/Dashboard.tsx` *(not yet created)* | *(add card when built)* |
| Settings  | `src/components/Settings.tsx` *(not yet created)*  | *(add card when built)* |

---

## `cn()` Utility

```ts
import { cn } from '@/lib/utils'

// Conditional classes — the only approved pattern
cn('base-class', isActive && 'active-class', 'always-present')
cn('p-4', { 'bg-app-accent': selected, 'bg-app-surface': !selected })
cn(baseClasses, props.className)  // safe className passthrough from parent
```

---

## Color Tokens (Tailwind)

All colors use the `app-*` namespace (defined in `tailwind.config.js`):

```
bg-app-bg          — outermost page background
bg-app-surface     — card / panel background
bg-app-surface-2   — nested / inner card background
border-app-border  — subtle dividers
text-app-text      — primary text
text-app-muted     — secondary / dimmed text
bg-app-accent      — primary interactive color (buttons, active tabs)
text-app-success   — success states
text-app-warning   — warning states
text-app-danger    — error / destructive states
```

> Never use raw Tailwind colors (e.g. `bg-slate-900`). Always use `app-*` aliases.

---

## Context Cards

Read the context card for a component before reading its source file.
Cards are much smaller and highlight the exact gotchas that cause bugs.

| Component | Context card |
|---|---|
| *(add rows here as you create components)* | `docs/context/` |

> See `docs/context/README.md` for the card template and instructions.

---

## Rules Summary

- `cn(...)` for conditional classes — never string concatenation
- No `any` types — all interfaces in `src/types/index.ts`
- Logic in `src/lib/`, UI in `src/components/`
- After changes: `npm run build` → update TODOS + DEVLOG + HANDOFF → **stop, do not commit**
