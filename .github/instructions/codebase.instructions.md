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
Append a concise entry to `docs/DEVLOG.md` summarizing what changed and why.
