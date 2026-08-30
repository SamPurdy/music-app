---
description: Start a new coding session — loads project context and suggests next tasks
agent: code
---

# Start Session

You are starting a new coding session on this project. Follow these steps in order,
stopping as soon as you have enough context for the chosen task.

## Step 1 — Read HANDOFF.md

Read `docs/HANDOFF.md` in full. This is the session bridge document — it tells you
what was last worked on, what files changed, and what the known issues are.

## Step 2 — Scan DEVLOG.md

Read the top 2–3 entries of `docs/DEVLOG.md` only. Do not read the full file.
These entries give you recent history without loading the entire source tree.

## Step 3 — Check open TODOs

Read `docs/TODOS.md`. Note which items are open (unchecked). Do not mark anything
done yet — that happens after the user confirms a task is complete.

## Step 4 — Build check

Run `npm run build`. Report any TypeScript or Vite errors. A failing build is always
top priority — fix it before anything else.

## Step 5 — Load ARCHITECTURE.md if needed

If the task requires understanding how components connect, read `ARCHITECTURE.md`.
Skip this step if HANDOFF + DEVLOG already gave you enough context.

## Step 6 — Suggest a task menu

Present a numbered list of 4–6 suggested tasks based on:
- Open items in TODOS.md (prioritized 🔴 > 🟡 > 🟢)
- Any build errors from Step 4
- Natural improvements you noticed while reading context

Wait for the user to choose a number before doing any work.

## Step 7 — Load only what you need

Once the user selects a task:
- Check `docs/context/` for a matching context card
- Read only the source files relevant to that task
- Do not speculatively load files "just in case"

---

## Mid-Session Reminder

If the conversation is getting long (10+ exchanges), pause and say:
> "Context is getting long. Want me to write a handoff and start a fresh session?"

---

## End-of-Session Checklist

Before stopping:
1. `npm run build` — confirm no errors
2. Update `docs/TODOS.md` — mark done items, add new discoveries
3. Append entry to top of `docs/DEVLOG.md`
4. Update `docs/HANDOFF.md` with current status and next steps
5. Show the user a list of changed files — **do not commit without explicit approval**
