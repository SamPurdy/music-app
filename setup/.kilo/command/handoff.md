---
description: End the current session — update HANDOFF, DEVLOG, and TODOS, then stop
agent: code
---

# Handoff

You are ending this coding session. Complete these steps in order before stopping.

## Step 1 — Build check

Run `npm run build`. If there are errors, note them in HANDOFF.md as known issues.
Do not leave broken code without documenting it.

## Step 2 — Update TODOS.md

- Mark completed items with `[x]`
- Add any newly discovered tasks with appropriate priority (🔴 🟡 🟢)
- Do not remove old completed items — keep them for history

## Step 3 — Append to DEVLOG.md

Add a new entry at the **top** of the file in this format:

```
## YYYY-MM-DD

**Changed files:**
- `src/path/to/file.tsx` — what changed and why
- `docs/TODOS.md` — updated

**Summary:** One or two sentences describing what was accomplished this session.

**Known issues:** Any bugs or incomplete work.
```

## Step 4 — Update HANDOFF.md

Replace the entire file content with a fresh ~200 word summary:

```
## Last Session

**Date:** YYYY-MM-DD
**Status:** [what state the code is in]

**What was worked on:**
[1–3 bullet points]

**Files changed:**
[list]

**Next steps:**
[1–3 prioritized next actions]

**Known issues:**
[any bugs, broken state, or things to watch out for]
```

## Step 5 — Report to user

Show the user:
1. A list of all files changed this session
2. The updated HANDOFF.md content

Then **stop. Do not commit or push.** Wait for the user's explicit approval before
running any `git` commands.
