# Developer Log

> **Instructions for local model:**
> After completing a session of changes, prepend a new entry at the TOP of this file
> (immediately below this header block) using the template at the bottom.
> Keep entries concise — bullet points only, no prose paragraphs.
> This log lets you catch up on recent changes without reading every source file.
> **Read only the top 2–3 entries at session start** — do not read the full log.

---

## YYYY-MM-DD — Initial boilerplate setup

**Changed files:** all files (initial creation)

**What changed:**
- Created project from React + TypeScript + Vite + Tailwind CSS boilerplate
- Set up `app-*` color token system in `tailwind.config.js`
- Configured `@/` path alias in `vite.config.ts` and `tsconfig.json`
- Added `DevErrorBoundary` (dev-only render error overlay) and runtime error toast in `index.html`
- Created docs scaffolding: HANDOFF, DEVLOG, QUICK_REF, TODOS, context cards
- Created AGENTS.md + `.github/` instructions and prompts for local model workflow

**Why:** Fresh project setup — all files are new.

---

## Entry Template
```
## YYYY-MM-DD — [Brief title]

**Changed files:** list files changed or created

**What changed:**
- [bullet point describing a specific change]
- [another bullet point]

**Why:** [One sentence explaining the reason for the change]
```
