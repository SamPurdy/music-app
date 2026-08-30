---
name: start-session
description: "Load project context for a new coding session. Run this at the start of every session."
---

# Session Start

You are working on **[Your App Name]** — [replace with a one-line description of your app].
Stack: React 18 + TypeScript + Vite + Tailwind CSS. No backend.
Dev server: `npm run dev` → http://localhost:3000.

> ⚙️ **Customize:** Update the app name and description above before your first session.

---

## Context Load Sequence (read in this order to save context window)

### Step 1 — Read handoff (~200 words, very cheap)
Read `docs/HANDOFF.md` — tells you exactly what was done last session and what comes next.
If the handoff is empty, read `README.md` for full project context.

### Step 2 — Read recent DEVLOG entries (top 2–3 only)
Read the top of `docs/DEVLOG.md` — recent changes you need to know about.
Stop after 3 entries — do not read the full log.

### Step 3 — Scan the todo list
Read `docs/TODOS.md` — scan the High and Medium priority open items only.
Do not read Low priority items unless the user asks.

### Step 4 — Read QUICK_REF if needed
Read `docs/QUICK_REF.md` for the tab→component map and color token reference.
Skip if the handoff already covers what you need.

### Step 5 — Check build health
Run the build and check for errors:
```bash
# Git Bash (preferred):
npm run build 2>&1 | tail -20

# PowerShell fallback:
npm run build 2>&1 | Select-Object -Last 20
```
Report any TypeScript or build errors before proceeding.
A clean build ends with `✓ built in X.XXs`.

### Step 6 — Suggest next steps
Synthesize everything you've read into a short suggested task list:

```
Here's what I'd suggest working on today:

1. 🔴 [High priority item from TODOS or a build error]
2. 🔴 [Another high priority item if applicable]
3. 🟡 [Medium priority item from TODOS]
4. 🟡 [Another medium item or carry-forward from HANDOFF]
5. 🟢 [A nice-to-have / feature idea]

These are suggestions only — pick any, or tell me something else entirely.
What would you like to tackle?
```

**Rules for the suggestion list:**
- Lead with any build errors or broken features first
- Pull items from `docs/TODOS.md` open items — don't invent things that are already listed
- You may suggest improvements not yet in TODOS if they seem natural
- Do NOT imply the user must do any of these — they are suggestions only

### Step 7 — Understand the task
Once the user picks a direction, look up only the relevant source file(s).
For any component work, read the matching `docs/context/*.md` card first, then the actual source file.
If the user picks a todo, **note which todo you're working on** so you can mark it done at the end.

---

## Mid-Session Context Saving
If your context is getting long (lots of back-and-forth, many files read), ask the user:
> "My context window is getting long — would you like me to update HANDOFF.md and start a fresh session to keep things clean?"

---

## End-of-Session Checklist
Before stopping, always complete these in order:

1. **Run `npm run build`** — verify no TypeScript errors
2. **Update `docs/TODOS.md`:**
   - Mark completed todos as `[x] YYYY-MM-DD — description` and move to ✅ Completed
   - Add any new todos discovered during the session
3. **Update `docs/HANDOFF.md`** — overwrite Current State, Next Steps, Known Issues
4. **Append entry to top of `docs/DEVLOG.md`** — what changed and why, bullet points only
5. **STOP — do NOT commit.** Show the user a list of all changed files and wait for explicit approval before any `git` command.
