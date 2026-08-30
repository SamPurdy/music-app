# Soundwave Studio — Quick Reference (Local Model)

> Use this mid-session to refresh context without burning tokens on the full ARCHITECTURE.md.
> **New session?** Read ARCHITECTURE.md + last 2 DEVLOG entries instead.

## Stack
React 19 + TS + Vite + Tailwind CSS + Tone.js + Tonal.js. No backend. Port 5173.

## Context Cards (read before editing a component)
| Component | Card |
|---|---|
| ChordProgressionDisplay | `docs/context/chord-progression.md` |
| CreativeInspiration | `docs/context/inspiration.md` |
| GuitarLab + ChordDiagram + Fretboard | `docs/context/guitar-lab.md` |
| SongStructureBuilder | `docs/context/song-builder.md` |
| TheoryExplorer + PianoKeyboard | `docs/context/theory-explorer.md` |
| JSON schemas | `docs/context/schemas.md` |

## Tabs → Components
- song → `SongStructureBuilder.tsx`
- chords → `ChordProgressionDisplay.tsx`
- inspiration → `CreativeInspiration.tsx`
- theory → `TheoryExplorer.tsx`
- guitar → `GuitarLab.tsx`

## Cross-Tab Data Flow (App.tsx)
`App.tsx` owns `pendingProgression: { key, chords: string[] } | null`.
- Set by `handleSendToSong()` called from `ChordProgressionDisplay` via `onSendToSong` prop
- Consumed by `SongStructureBuilder` via `pendingProgression` + `onClearPending` props
- Setting it also switches `activeTab` to `'song'` automatically

## Audio — ONLY via `src/lib/audio/synth.ts`
```ts
playPianoNote(noteIdx, octave)  playGuitarNote(noteIdx, octave)
playPianoChord(noteNames)       playGuitarChord(noteNames)
playProgression(chords[], instrument)
chordNotesToNoteNames(chord.notes, instrument)  // ← REQUIRED before play calls
// Always: somePlayFn(...).catch(() => {})
```

## Theory — ONLY via `src/lib/music-theory/`
```ts
// scales.ts
SCALES['major' | 'naturalMinor' | 'dorian' | 'blues' | ...]  → { name, intervals[], ... }
getScaleNoteIndices(root, scaleKey)  // returns 0-11 indices including root
// SCALES intervals do NOT include 0 — root is always implied

// chord-functions.ts  ← NEW
getChordFunction(roman: string): ChordFunctionInfo | null
// Returns: { roman, name, shortDesc, fullDesc, tension (0-10), commonCadences[], songwritingTip, color }
// Covers: I ii iii IV V vi vii° i ii° ♭III iv v ♭VI ♭VII

// notes.ts: noteToMidi(), midiToNote(), getChordNotes(), getRomanNumeral()
// progressions.ts: generateMajorProgression(), generateRandomProgression(), suggestProgressions()
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

## SongStructureBuilder — Section.chords is a STRING
```ts
// ⚠️ chords is "Am  F  C  G" — space-separated string, NOT string[]
// Split:  section.chords.split(/[\s,]+/).filter(Boolean)
// Join:   chords.join('  ')
```

## Colors (Tailwind)
```
studio-bg=#090c12  studio-surface=#0e1219  studio-surface-2=#131922
studio-accent=#38bdf8(sky/CTA)  studio-purple=#8b5cf6  studio-muted=#64748b
studio-border=white/8  studio-success=#10b981  studio-pink=#ec4899
```

## Rules
- `twMerge(...)` for conditional classes — never string concat
- No `any` types
- All music theory → `src/lib/music-theory/` only
- All audio → `synth.ts` only
- After changes: `npm run build` → update TODOS + DEVLOG → **stop and wait for user to approve before committing**

## JSON / Data Structures
When producing JSON (song files, suggestions, chord voicings) — check `docs/context/schemas.md` for exact schemas.
