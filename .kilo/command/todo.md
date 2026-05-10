---
description: View, add, or update todos in docs/TODOS.md without a full handoff
agent: music-dev
---

Manage the Soundwave Studio todo list (`docs/TODOS.md`):

**View todos** — read and display open items grouped by priority:
```
/todo
```

**Add a todo** — add to the appropriate priority section:
```
/todo add [high|medium|low] description of the task
```
Example: `/todo add high Song tab save button throws error on empty sections`

**Mark done** — mark a todo complete (move to ✅ Completed):
```
/todo done [description or partial match]
```
Example: `/todo done guitar lab label`

**Defer a todo** — move to the ⏸ Deferred section (decided not to do now):
```
/todo defer [description or partial match]
```

**Rules:**
- Never delete a todo — only mark it done or defer it
- When adding, pick the right priority: High=broken features, Medium=improvements, Low=nice-to-have
- After any change, show the updated open todo list so the user can confirm
- Do NOT commit — TODOS.md changes get committed with the next regular commit
