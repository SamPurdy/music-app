---
applyTo: "src/**"
---

# Soundwave Studio — Coding Context

## Critical Rules
- **Tailwind classes:** always `twMerge(...)` for conditional classes — never string concat
- **No `any` types** — all interfaces must be explicit
- **Synth calls** are async — always `.catch(() => {})` on fire-and-forget
- **PianoKeyboard `scaleNotes` prop** must NOT include root — filter at call site
- **`SCALES[key].intervals`** does NOT include 0 (root) — root is always implied

## Note Index System (0–11)
```
C=0  C#=1  D=2  D#=3  E=4  F=5  F#=6  G=7  G#=8  A=9  A#=10  B=11
```
White keys: [0,2,4,5,7,9,11] | Black keys: [1,3,6,8,10]

## Key File Locations
| What | Where |
|------|-------|
| Scale data + helpers | `src/lib/music-theory/scales.ts` |
| Interval data | `src/lib/music-theory/intervals.ts` |
| Chord/progression logic | `src/lib/music-theory/progressions.ts` |
| Note utilities | `src/lib/music-theory/notes.ts` |
| Audio playback | `src/lib/audio/synth.ts` |
| Guitar chord voicings | `src/lib/guitar/chords.ts` |
| Song utilities | `src/lib/songwriting/song.ts` |
| All TS types | `src/types/index.ts` |
| Design tokens | `tailwind.config.js` |

## Context Cards — Read Before Editing a Component
Each card has props, state shape, key behaviors, and watch-outs for that component.
**Read the card before reading the source file** — it's much smaller.

| Component file | Context card |
|---|---|
| `ChordProgressionDisplay.tsx` | `docs/context/chord-progression.md` |
| `CreativeInspiration.tsx` | `docs/context/inspiration.md` |
| `GuitarLab.tsx` + `GuitarChordDiagram.tsx` + `GuitarFretboard.tsx` | `docs/context/guitar-lab.md` |
| `SongStructureBuilder.tsx` | `docs/context/song-builder.md` |
| `TheoryExplorer.tsx` + `PianoKeyboard.tsx` | `docs/context/theory-explorer.md` |
| Song/suggestion JSON schemas | `docs/context/schemas.md` |

## Color Tokens
`studio-bg` `studio-surface` `studio-surface-2` `studio-border` `studio-text` `studio-muted` `studio-accent`(sky) `studio-success`(green) `studio-purple` `studio-pink`

## After Making Changes
1. Run `npm run build` and report any TypeScript errors before declaring done
2. **Update `docs/TODOS.md`:** mark any completed todos `[x]` and move to ✅ Completed; add new todos if bugs/improvements are discovered
3. Append a concise entry to `docs/DEVLOG.md` summarizing what changed and why
4. **DO NOT commit or push** — show the user a list of changed files and wait for their approval

## Workflow Rules for Local Model

### ✋ Safe Edit Protocol — ALWAYS follow before touching any file

1. **Read first.** Before editing, view the exact function/block you intend to change and paste the relevant section in your analysis. Never edit from memory.
2. **State your intent.** Describe which lines will change and why. If you can't pinpoint specific lines, read the file again.
3. **Minimal change only.** Replace only the specific code that needs changing — do NOT rewrite surrounding code, functions, or imports that are not part of the task.
4. **Verify after.** Re-read the edited section to confirm the change looks correct and no surrounding code was lost.
5. **Check the import chain.** After adding/moving a component, verify it is actually imported and rendered where expected (trace from `App.tsx` down to the component).

### General Rules
- **One file at a time** — complete and verify one change before moving to the next
- **When unsure about a type or function signature** — check `src/types/index.ts` or the relevant lib file first
- **If the task is large** — ask the user to break it into smaller steps rather than attempting everything in one response
- **Context getting long?** — suggest running `/handoff` and starting a fresh session

### Debugging UI Changes That Don't Appear
If a change is made but nothing visibly changes in the browser:
1. Check the browser for an on-screen error toast or the full-screen Error Boundary — it means a runtime/render error occurred
2. Run `npm run build` — TypeScript errors are the #1 silent cause of UI changes not appearing
3. Confirm the edited component is actually imported and rendered in the current tab's component tree (check `App.tsx` and the relevant tab component)
4. Check `dev.log` (created by `npm run dev:log`) for HMR errors or module resolution failures

