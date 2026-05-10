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

### Step 3 — Read todo list and recent DEVLOG
Read `docs/TODOS.md` — scan the High and Medium priority open items.
Read the top of `docs/DEVLOG.md` — recent changes (top 2–3 entries only).

### Step 4 — Read full architecture only if needed
Read `ARCHITECTURE.md` only if you need deeper reference (component props, lib exports, etc). For routine tasks, HANDOFF + TODOS + DEVLOG is enough.

### Step 5 — Check build health
Run: `npm run build 2>&1 | tail -20`
Report any TypeScript or build errors before proceeding.

### Step 6 — Suggest next steps
Synthesize everything you've read into a suggested task list. Present it as a short numbered menu:

```
Here's what I'd suggest working on today:

1. 🔴 [High priority item from TODOS or build error]
2. 🔴 [Another high priority item if applicable]
3. 🟡 [Medium priority item from TODOS]
4. 🟡 [Another medium item or carry-forward from HANDOFF]
5. 🟢 [A nice-to-have / feature idea]

These are suggestions only — pick any, or tell me something else entirely.
What would you like to tackle?
```

**Rules for this suggestion list:**
- Always lead with any build errors or broken features first
- Pull from `docs/TODOS.md` open items — don't invent things already listed there
- You may suggest new items not yet in TODOS if they seem like natural improvements
- Do NOT imply the user must do any of these — they are suggestions

### Step 7 — Understand the task
Once the user picks a direction, look up only the relevant source file(s). For component work, read the matching `docs/context/*.md` card first, then the actual source file.

If the user picks a todo from the list, **note which todo you're working on** so you can mark it done at the end.

---

## Mid-Session Context Saving
If you feel your context is getting long, ask the user if they want you to `/handoff` and start fresh. This preserves progress without losing state.

---

## End-of-Session Checklist
1. Run `npm run build` — verify no errors
2. **Update `docs/TODOS.md`:**
   - Mark any completed todos as `[x] YYYY-MM-DD — description` and move to the ✅ Completed section
   - Add any new todos discovered during the session to the appropriate priority section
3. Update `docs/HANDOFF.md` with current state and next steps
4. Append entry to top of `docs/DEVLOG.md`
5. **Stop — do NOT commit.** Show the user a list of changed files and wait for explicit approval before any `git` command.
