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

## Color Tokens
`studio-bg` `studio-surface` `studio-surface-2` `studio-border` `studio-text` `studio-muted` `studio-accent`(sky) `studio-success`(green) `studio-purple` `studio-pink`

## After Making Changes
1. Run `npm run build` and report any TypeScript errors before declaring done
2. Append a concise entry to `docs/DEVLOG.md` summarizing what changed and why
3. **DO NOT commit or push** — show the user a list of changed files and wait for their approval

## Workflow Rules for Local Model
- **Read the target file before editing it** — never edit blindly from memory
- **One file at a time** — complete and verify one change before moving to the next
- **When unsure about an interface or function signature** — check `src/types/index.ts` or the relevant lib file
- **If the task is large** — ask the user to break it into smaller steps rather than attempting everything in one response
- **Context getting long?** — suggest running `/handoff` and starting a fresh session
