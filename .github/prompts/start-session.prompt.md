---
name: start-session
description: "Load project context for a new coding session on Soundwave Studio. Run this at the start of every session."
---

# Session Start — Soundwave Studio

You are working on **Soundwave Studio** — a professional music theory and songwriting web app (React 19 + TypeScript + Vite + Tailwind CSS + Tone.js). No backend. Dev server: `npm run dev` → http://localhost:5173.

## Context Load Sequence (read in this order to save context window)

### Step 1 — Read handoff (tiny, ~200 words)
Read `docs/HANDOFF.md` — this tells you exactly what was done last session and what comes next.

### Step 2 — Read recent DEVLOG entries (top 2–3 only)
Read the top of `docs/DEVLOG.md` — recent changes you need to know about. Stop after 3 entries.

### Step 3 — Read full architecture only if needed
Read `ARCHITECTURE.md` only if you need deeper reference (component props, lib exports, etc). For routine tasks, the HANDOFF + DEVLOG is enough.

### Step 4 — Check build health
Run: `npm run build 2>&1 | tail -20`
Report any TypeScript or build errors before proceeding.

### Step 5 — Understand the task
Ask the user what they want to work on. Look up only the relevant source file(s) for that task — don't pre-read everything.

---

## Mid-Session Context Saving
If you feel your context is getting long, ask the user if they want you to `/handoff` and start fresh. This preserves progress without losing state.

---

## End-of-Session Checklist
1. Run `npm run build` — verify no errors
2. Update `docs/HANDOFF.md` with current state and next steps
3. Append entry to top of `docs/DEVLOG.md`
4. **Stop — do NOT commit.** Show the user a list of changed files and wait for explicit approval before any `git` command.
