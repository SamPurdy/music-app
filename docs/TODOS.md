# Soundwave Studio — Todo List

> **Local model instructions:**
> - At session start: read this file, reference open todos when suggesting next steps
> - When implementing a todo: mark it `[x]` and add the date
> - When suggesting new todos: add them under the appropriate section with `[ ]`
> - Do NOT delete todos — mark done ones `[x]` so there's a history
> - The user decides which todos to work on — never assume a todo is approved just because it's listed

---

## 🔴 High Priority

<!-- Bugs, broken features, things that block the user -->

- [ ] Inspiration tab play buttons — chord audio still unreliable (content string parsing)
- [ ] CreativeInspiration list still may append on repeated genre/key changes — verify clear behavior

---

## 🟡 Medium Priority

<!-- Feature improvements, polish, UX enhancements -->

- [ ] Guitar Lab chord diagram label text too small (below diagrams)
- [ ] Song tab — save to `public/songs/` not fully implemented (currently download only)
- [ ] Theory Explorer — add interval name labels between keys on piano
- [ ] Guitar Lab — show scale note names on fretboard dots

---

## 🟢 Low Priority / Nice to Have

<!-- Ideas, enhancements, non-blocking improvements -->

- [ ] Add metronome / click track to Song tab
- [ ] Circle of Fifths visualization in Theory tab
- [ ] Chord Lab — copy progression to Song section with one click
- [ ] Song tab — loop playback for individual sections
- [ ] MIDI export for song sections (foundation exists in `src/lib/midi/export.ts`)
- [ ] Dark/light mode toggle
- [ ] Mobile-responsive layout pass

---

## ⏸ Deferred

<!-- Items the user decided to skip for now. Not deleted — can be revived later. -->

<!-- Example: -->
<!-- - [ ] Dark/light mode toggle — deferred 2026-05-10, too much effort for now -->

---

## ✅ Completed

<!-- Move items here when done, with date -->

- [x] 2026-05-10 — Piano key highlighting fixed (root vs scale vs none, 3-state system)
- [x] 2026-05-10 — Non-scale black keys visible as gray-600
- [x] 2026-05-10 — Piano size increased (52×165 white, 33×104 black)
- [x] 2026-05-10 — Theory Explorer legend updated to show all 4 key states
- [x] 2026-05-10 — Key dropdown in Song tab now triggers chord transposition correctly
- [x] 2026-05-10 — Multiple song sections expandable simultaneously (Set-based)
- [x] 2026-05-10 — All .kilo agent/skill/command files updated for Soundwave Studio

---

## How to Manage Todos

**Quick commands** (use `/todo` in Kilo):
- `/todo` — view open items
- `/todo add [high|medium|low] description` — add a new todo
- `/todo done description` — mark done and move to ✅ Completed
- `/todo defer description` — move to ⏸ Deferred (decided not to do now)

**Manual format:**
```
- [ ] Brief description (component or file if known)   ← open
- [x] 2026-05-10 — Brief description                  ← done (move to ✅)
```
Never delete a todo — only mark done or defer it.
