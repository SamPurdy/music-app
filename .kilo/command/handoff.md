---
description: End-of-session wrap-up — update HANDOFF.md, DEVLOG, and commit changes
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

3. **Run `npm run build`** to verify no TypeScript errors before committing

4. **Commit all changes:**
   ```bash
   git add -A && git commit -m "brief description of session changes"
   ```
   Do NOT auto-push — user pushes manually.

Usage: /handoff
