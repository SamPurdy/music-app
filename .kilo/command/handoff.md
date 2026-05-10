---
description: End-of-session wrap-up — update HANDOFF.md and DEVLOG, then summarize for user review
agent: music-dev
---

Wrap up this coding session for Soundwave Studio:

1. **Update `docs/HANDOFF.md`** — overwrite the "Current State", "Next Steps", and "Known Issues" sections with a summary of what was done this session (keep under 200 words)

2. **Append to `docs/DEVLOG.md`** — add a new entry at the TOP (below the instructions header) using the template:
   ```
   ## YYYY-MM-DD — [Brief title]
   **Changed files:** list files
   **What changed:**
   - bullet points
   **Why:** one sentence
   **Watch out:** any gotchas
   ```

3. **Run `npm run build`** to verify no TypeScript errors

4. **Show user a summary** of all changed files and what was done. Do NOT commit — wait for the user to explicitly say "commit" or "push" before running any `git` command.

Example summary to give the user:
```
✅ Build passes. Ready to commit when you are.

Changed files:
- src/components/SongStructureBuilder.tsx
- docs/DEVLOG.md
- docs/HANDOFF.md

To commit: git add -A && git commit -m "your message"
```

Usage: /handoff
