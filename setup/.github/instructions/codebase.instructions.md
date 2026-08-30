---
applyTo: "src/**"
---

# App — Coding Context

> Auto-injected for all `src/**` edits. Keep rules concise — this file is read on every agent turn.

## Critical Rules
- **Tailwind classes:** always use `cn(...)` from `@/lib/utils` for conditional classes — never string concatenation
- **No `any` types** — all interfaces must be explicit; add to `src/types/index.ts` if shared
- **Async error handling** — always `.catch(() => {})` on fire-and-forget async calls to avoid unhandled rejections
- **One concern per file** — UI components in `src/components/`, logic in `src/lib/`, types in `src/types/`

## Key File Locations
| What | Where |
|------|-------|
| Shared TypeScript interfaces | `src/types/index.ts` |
| `cn()` utility + helpers | `src/lib/utils.ts` |
| App root / tab shell | `src/App.tsx` |
| Global styles | `src/index.css` |
| Design tokens (colors) | `tailwind.config.js` → `app.*` |
| Dev error boundary | `src/components/DevErrorBoundary.tsx` |

> ⚙️ **Customize:** Add rows to this table as you create new lib modules.

## Context Cards — Read Before Editing a Component
Each context card contains props, state shape, key behaviors, and watch-outs for a specific component.
**Read the card before reading the source file** — it's much smaller and highlights the gotchas.

| Component file | Context card |
|---|---|
| *(add rows here as you build components)* | `docs/context/example-component.md` (template) |

> ⚙️ See `docs/context/README.md` for how to create context cards. Add a row per component.

## Color Tokens
All colors must use the `app-*` tokens from `tailwind.config.js`:
```
app-bg         app-surface      app-surface-2
app-border     app-border-hover
app-text       app-muted
app-accent     app-success      app-warning     app-danger
```
Usage: `bg-app-bg`, `text-app-accent`, `border-app-border`, etc.
Never use raw Tailwind colors (e.g. `bg-slate-900`) — always the `app-*` alias.

## After Making Changes
1. Run `npm run build` — report any TypeScript errors before declaring done
2. **Update `docs/TODOS.md`:** mark completed todos `[x]` with date; add newly found bugs/todos
3. Append a DEVLOG entry — see exact format below
4. **DO NOT commit or push** — show the user a list of changed files and wait for approval

### DEVLOG Entry Format — copy this template exactly

Insert a new entry at the **very top** of `docs/DEVLOG.md`, directly below the header block.

```
## YYYY-MM-DD — Short title describing what changed

**Changed files:** `src/path/file.tsx`, `docs/DEVLOG.md`

**What changed:**
- Bullet point describing one specific change
- Another bullet point for a second change

**Why:** One or two sentences explaining the reason for the change.

---
```

**Rules — read carefully:**
- Each `**label:**` must be on its own line, followed by a blank line if a list follows
- Bullet points must each be on their own line starting with `- `
- There must be a blank line between the title (`##`) and `**Changed files:**`
- There must be a blank line between `**Changed files:**` and `**What changed:**`
- There must be a blank line before the closing `---`
- **Do NOT write the entire entry on one line** — every `**label:**` and every `- ` bullet is a separate line

---

## ✋ Safe Edit Protocol — ALWAYS follow before touching any file

1. **Read first.** Before editing, view the exact function/block you intend to change.
   Paste the relevant section in your analysis. Never edit from memory.
2. **State your intent.** Describe which lines will change and why.
   If you can't pinpoint specific lines, read the file again.
3. **Minimal change only.** Replace only the specific code that needs changing.
   Do NOT rewrite surrounding code, functions, or imports that are not part of the task.
4. **Verify after.** Re-read the edited section to confirm the change looks correct
   and no surrounding code was accidentally removed or modified.
5. **Check the import chain.** After adding/moving a component, verify it is actually
   imported and rendered where expected — trace from `App.tsx` down to the component.

### General Rules
- **One file at a time** — complete and verify one change before moving to the next
- **When unsure about a type or function signature** — check `src/types/index.ts` first
- **If the task is large** — break it into smaller steps rather than attempting everything in one response
- **Context getting long?** — suggest running the `/start-session` handoff flow and starting a fresh session

---

## Debugging UI Changes That Don't Appear
If a change is made but nothing visibly changes in the browser:

1. **Check for an on-screen error toast** (bottom-right corner) or the full-screen Error Boundary —
   it means a runtime/render error occurred. The error message is shown directly on the page.
2. **Run `npm run build`** — TypeScript errors are the #1 silent cause of UI changes not appearing.
   Fix all errors before concluding the change worked.
3. **Confirm the component is imported and rendered** — check `App.tsx` and the parent component
   to make sure the edited file is actually in the render tree.
4. **Check `dev.log`** (generated by `npm run dev:log`) for HMR errors or module resolution failures.
