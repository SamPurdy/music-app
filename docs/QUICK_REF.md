# Soundwave Studio — Quick Reference (Local Model)

> Use this mid-session to refresh context without burning tokens on the full ARCHITECTURE.md.
> **New session?** Read ARCHITECTURE.md + last 2 DEVLOG entries instead.

## Stack
React 19 + TS + Vite + Tailwind CSS + Tone.js + Tonal.js. No backend. Port 5173.

## Tabs → Components
- song → `SongStructureBuilder.tsx`
- chords → `ChordProgressionDisplay.tsx`
- inspiration → `CreativeInspiration.tsx`
- theory → `TheoryExplorer.tsx`
- guitar → `GuitarLab.tsx`

## Audio — ONLY via `src/lib/audio/synth.ts`
```ts
playPianoNote(noteIdx, octave)  playGuitarNote(noteIdx, octave)
playPianoChord(chordName)       playGuitarChord(chordName)
playProgression(chords[], instrument)
// Always: somePlayFn(...).catch(() => {})
```

## Theory — ONLY via `src/lib/music-theory/`
```ts
// scales.ts
SCALES['major' | 'naturalMinor' | 'dorian' | 'blues' | ...]  → { name, intervals[], ... }
getScaleNoteIndices(root, scaleKey)  // returns 0-11 indices including root
// SCALES intervals do NOT include 0 — root is always implied

// notes.ts: noteToMidi(), midiToNote(), getChordNotes(), getRomanNumeral()
// progressions.ts: generateMajorProgression(), suggestProgressions()
// guitar/chords.ts: GUITAR_CHORDS map, transposeChord(chord, semitones)
```

## Note Indices (0–11)
`C=0  C#=1  D=2  D#=3  E=4  F=5  F#=6  G=7  G#=8  A=9  A#=10  B=11`
White: [0,2,4,5,7,9,11]   Black: [1,3,6,8,10]

## PianoKeyboard Props
```ts
scaleNotes?: number[]  // ← NEVER include root here, filter it out!
rootNote?: number
onNoteClick?: (idx: number) => void
// Usage: scaleNotes={noteIndices.filter(n => n !== rootIdx)}
```

## Colors (Tailwind)
```
studio-bg=#090c12  studio-surface=#0e1219  studio-accent=#38bdf8(root/CTA)
studio-purple=#8b5cf6(scale)  studio-muted=#64748b  studio-border=white/8
```

## Rules
- `twMerge(...)` for conditional classes — never string concat
- No `any` types
- All music theory → `src/lib/music-theory/` only
- All audio → `synth.ts` only
- After changes: `npm run build` → update TODOS + DEVLOG → **stop and wait for user to approve before committing**

## JSON / Data Structures
When producing JSON (song files, suggestions, chord voicings) — check `docs/context/schemas.md` for exact schemas.
