---
description: Load project context and start a new coding session on Soundwave Studio
agent: music-dev
---

You are starting a new coding session on **Soundwave Studio** — a professional music theory and songwriting web app (React 19 + TypeScript + Vite + Tailwind CSS + Tone.js + Tonal.js). No backend. Dev server: `npm run dev` → http://localhost:5173.

Follow these steps in order. Stop reading as soon as you have enough context for the task.

**Step 1 — Read the handoff (~200 words, very cheap)**
Read `docs/HANDOFF.md` — tells you exactly what was done last session and what comes next.

**Step 2 — Read recent DEVLOG entries (top 2–3 only)**
Read the top of `docs/DEVLOG.md`. Stop after 3 entries — do not read the full log.

**Step 3 — Scan the todo list**
Read `docs/TODOS.md` — scan the High and Medium priority open items only.

**Step 4 — Check build health**
Run the build and report any errors:
```bash
npm run build 2>&1 | tail -20
```
A clean build ends with `✓ built in X.XXs`. Report TypeScript errors before proceeding.

**Step 5 — Read ARCHITECTURE.md only if needed**
Only read `ARCHITECTURE.md` if HANDOFF + TODOS + DEVLOG don't give you enough context.
For component work, read the matching `docs/context/*.md` card first, then the source file.

**Step 6 — Suggest next steps**
Synthesize everything into a short numbered menu:

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

Rules:
- Lead with any build errors or broken features first
- Pull from open todos in `docs/TODOS.md` — don't duplicate things already listed
- You may suggest new items not yet in TODOS if they seem natural
- Never imply any item is required

**Step 7 — Understand the task**
Once the user picks a direction, look up only the relevant files. For component work, read the context card first (`docs/context/*.md`), then the source file. Note which todo you're working on so you can mark it done at the end.

---

If context gets long mid-session, suggest running `/handoff` and starting fresh.

At end of session: run `/handoff` to wrap up cleanly.
