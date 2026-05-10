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

### Step 5 — Suggest next steps
Before asking the user what to work on, review what you've read (HANDOFF next steps, DEVLOG watch-outs, build errors) and proactively suggest 3–5 concrete things to work on. Format as a short numbered list covering:
- Any carry-forward tasks from `docs/HANDOFF.md`
- Any known issues or watch-outs from `docs/DEVLOG.md`
- Any build errors found in Step 4
- Feature improvements or polish that seem like natural next steps for a professional music app

Then ask: **"Which of these would you like to tackle, or is there something else on your mind?"**

### Step 6 — Understand the task
Once the user picks a direction, look up only the relevant source file(s) — don't pre-read everything. For component work, read the matching `docs/context/*.md` card first, then the actual source file.

---

## Mid-Session Context Saving
If you feel your context is getting long, ask the user if they want you to `/handoff` and start fresh. This preserves progress without losing state.

---

## End-of-Session Checklist
1. Run `npm run build` — verify no errors
2. Update `docs/HANDOFF.md` with current state and next steps
3. Append entry to top of `docs/DEVLOG.md`
4. **Stop — do NOT commit.** Show the user a list of changed files and wait for explicit approval before any `git` command.
