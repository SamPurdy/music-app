# Soundwave Studio — Architecture Reference

> **For local models:** Read this file at the start of every session. It is the single source of truth for the codebase. Check `docs/DEVLOG.md` for recent changes.

---

## App Identity
- **Name:** Soundwave Studio
- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Tone.js + Tonal.js
- **Dev server:** `npm run dev` → http://localhost:5173
- **Build:** `npm run build` | **Test:** `npm run test` | **Lint:** `npm run lint`
- **Git remote:** https://github.com/SamPurdy/music-app

---

## Design System (Tailwind tokens)

| Token | Value | Use |
|-------|-------|-----|
| `studio-bg` | `#090c12` | Page background |
| `studio-surface` | `#0e1219` | Cards / panels |
| `studio-surface-2` | `#131922` | Nested panels |
| `studio-border` | `rgba(255,255,255,0.08)` | All borders |
| `studio-text` | `#e2e8f0` | Primary text |
| `studio-muted` | `#64748b` | Secondary text |
| `studio-accent` | `#38bdf8` | Sky blue — highlights, primary actions |
| `studio-success` | `#10b981` | Success states |
| `studio-purple` | `#8b5cf6` | Secondary accent |
| `studio-pink` | `#ec4899` | Tertiary accent |

**Always use `twMerge` for conditional Tailwind classes.**

---

## App Shell (`src/App.tsx`)

Five tabs rendered in `<main>` based on `activeTab` state:

| Tab key | Component | Description |
|---------|-----------|-------------|
| `song` | `SongStructureBuilder` | Build song sections, write chords/lyrics, save/load JSON |
| `chords` | `ChordProgressionDisplay` | Generate & play chord progressions by key/mode |
| `inspiration` | `CreativeInspiration` | AI-style suggestions by key/genre/vibe |
| `theory` | `TheoryExplorer` | Scale & interval explorer with piano keyboard |
| `guitar` | `GuitarLab` | Capo calc, chord diagrams, fretboard, progressions |

Left sidebar: `songMeta` state (key, tempo, timeSignature). Right sidebar: harmonic context.

---

## Component Map (`src/components/`)

### `PianoKeyboard.tsx`
Interactive piano (C4–C6, 15 white keys × 2 octaves + C6).

**Props:**
- `scaleNotes?: number[]` — note indices 0–11 IN the scale (root EXCLUDED)
- `rootNote?: number` — single root note index 0–11
- `onNoteClick?: (noteIndex: number) => void`
- `label?: string`

**Key colors:**
- Sky blue → root
- Violet → scale note
- Gray-600 → black key, not in scale
- White → white key, not in scale

**IMPORTANT:** Always pass `scaleNotes` with the root filtered out: `noteIndices.filter(n => n !== rootIdx)`

**Sizes:** WHITE_W=52, WHITE_H=165, BLACK_W=33, BLACK_H=104

---

### `GuitarChordDiagram.tsx`
SVG chord diagram. Props: `chord: GuitarChordVoicing`, `size?: 'sm'|'md'|'lg'`, `showName?: boolean`.

### `GuitarFretboard.tsx`
6-string fretboard with highlighted scale notes. Props: `scale`, `root`, `frets?`, `onNoteClick?`.

### `ChordProgressionDisplay.tsx`
Chord grid by key/mode. Plays chords via `synth.ts`. Exports MIDI. Shows roman numerals.

### `SongStructureBuilder.tsx`
Drag-and-drop song sections. Each section has chords + lyrics. Saves/loads JSON. Transposes all chords.

### `CreativeInspiration.tsx`
Suggestions cards by key/genre. Clears list on key/genre change (does NOT append). Has play buttons.

### `TheoryExplorer.tsx`
Root + scale selector → passes to `PianoKeyboard` and interval table. Passes `scaleNotes={noteIndices.filter(n => n !== rootIdx)}`.

### `GuitarLab.tsx`
4 sub-tabs: Capo | Chords | Scales | Progression. Uses `GuitarChordDiagram` and `GuitarFretboard`.

---

## Library Map (`src/lib/`)

### Music Theory (`src/lib/music-theory/`)

| File | Key Exports |
|------|-------------|
| `scales.ts` | `SCALES` record, `getScaleNoteNames(root, scaleKey)`, `getScaleNoteIndices(root, scaleKey)` |
| `intervals.ts` | `INTERVALS` array of `IntervalDefinition` (semitones, shortName, fullName, consonance) |
| `notes.ts` | `noteToMidi()`, `midiToNote()`, `getScaleNotes()`, `getChordNotes()`, `getRomanNumeral()` |
| `progressions.ts` | `generateMajorProgression()`, `generateMinorProgression()`, `analyzeProgression()`, `suggestProgressions()` |
| `voice-leading.ts` | `analyzeVoiceLeading()`, `findClosestVoice()` |

**`SCALES` object keys:** `major`, `naturalMinor`, `harmonicMinor`, `melodicMinor`, `majorPentatonic`, `minorPentatonic`, `blues`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `locrian`, `wholeTone`, `diminished`

Each scale has: `{ name, intervals: number[], description, genre, mood }`
Intervals are semitones from root, **NOT including root itself** (root = 0 is implied).

---

### Audio (`src/lib/audio/synth.ts`)

| Function | Description |
|----------|-------------|
| `playPianoNote(noteIdx, octave)` | Play single piano note |
| `playGuitarNote(noteIdx, octave)` | Play single guitar note |
| `playPianoChord(chordName)` | Play chord on piano |
| `playGuitarChord(chordName)` | Play chord on guitar |
| `playProgression(chords[], instrument)` | Play full progression |

Uses Tone.js + Salamander piano samples. Guitar uses Karplus-Strong synthesis.

---

### Guitar (`src/lib/guitar/chords.ts`)
`GUITAR_CHORDS` map: chord name → `GuitarChordVoicing[]` (frets, fingers, barre, baseFret).
`transposeChord(chord, semitones)` — shifts chord up/down fretboard.

---

### Songwriting (`src/lib/songwriting/song.ts`)
`createSong()`, `addSection()`, `updateSection()`, `removeSection()`.

### MIDI (`src/lib/midi/export.ts`)
`generateMidiFromProgression()` — outputs MIDI blob from chord array.

### Ableton (`src/lib/ableton/`)
`link.ts` — Ableton Link sync. `osc.ts` — OSC messages to Live.

---

## Types (`src/types/index.ts`)

```ts
ChordQuality = 'major' | 'minor' | 'diminished'
Note         = { name, octave, frequency? }
Chord        = { root, quality, full, notes[], intervals[], roman? }
ChordProgression = { chords[], key, romanNumeralAnalysis[] }
SongSection  = { id, name, type, chords?, lyrics[], tempo, timeSignature, repeats }
Song         = { id, title, key, tempo, timeSignature, sections[], createdAt, updatedAt }
Scale        = { name, intervals[], notes[] }
CreativeSuggestion = { type: 'chord'|'lyric'|'melody'|'structure'|'rhythm', content, context, confidence }
MidiExportOptions  = { tempo, key, trackName?, instrument?, quantization? }
```

---

## Note Index System
All piano/theory code uses **0–11 chromatic indices** (C=0, C#=1, D=2, ... B=11).

```
0=C  1=C#  2=D  3=D#  4=E  5=F  6=F#  7=G  8=G#  9=A  10=A#  11=B
```

White key indices: `[0, 2, 4, 5, 7, 9, 11]`
Black key indices: `[1, 3, 6, 8, 10]`

---

## Data Flow

```
User Input (tab/controls)
  → Component state (useState)
  → Music theory lib (scales.ts / progressions.ts / intervals.ts)
  → Audio (synth.ts via Tone.js)
  → Optional: MIDI export / Ableton OSC
```

---

## Common Pitfalls

1. **PianoKeyboard `scaleNotes` must NOT include root** — filter before passing
2. **`SCALES[key].intervals` does NOT include 0** — root is always implied
3. **CreativeInspiration** clears list on key/genre change — do not append
4. **synth.ts functions return Promises** — always `.catch(() => {})` on fire-and-forget calls
5. **Tailwind arbitrary values** must be safelisted or used in source files — don't construct class names dynamically
