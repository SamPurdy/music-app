# Context: GuitarLab

**File:** `src/components/GuitarLab.tsx`
**Tab:** Guitar Lab (key `guitar`)

## Sub-tabs
1. **Capo** — capo calculator (target key + open-shape key → capo fret)
2. **Chords** — chord diagram lookup + transposition
3. **Scales** — fretboard scale visualizer
4. **Progression** — enter chords, see diagrams, transpose up/down

## Key Dependencies
```ts
import { GUITAR_CHORDS, transposeChord } from '../lib/guitar/chords'
import { GuitarChordDiagram } from './GuitarChordDiagram'
import { GuitarFretboard } from './GuitarFretboard'
import { playGuitarChord } from '../lib/audio/synth'
```

## GuitarChordVoicing Interface
```ts
interface GuitarChordVoicing {
  name: string
  frets: number[]      // per string, -1=muted, 0=open
  fingers: number[]    // finger number 0-4
  barres?: { fret: number; fromString: number; toString: number }[]
  baseFret?: number
}
```

## Capo Logic
```ts
// targetKey and openShapeKey are semitone indices (0-11)
const capoFret = (targetKey - openShapeKey + 12) % 12
```

---

## Sub-component: GuitarChordDiagram

**File:** `src/components/GuitarChordDiagram.tsx`

### Props
```ts
interface GuitarChordDiagramProps {
  chordName: string
  frets: number[]       // 6 values — one per string (string 1=low E to 6=high e)
                        // -1 = muted (X), 0 = open, 1+ = fret number
  baseFret?: number     // default 1; if >1, fret number shown on left instead of nut
  barres?: { fromString: number; toString: number; fret: number }[]
  size?: 'sm' | 'md' | 'lg'   // default 'md'
}
```

### Size reference (pixels)
| size | w   | h   | dot radius | label font |
|------|-----|-----|------------|------------|
| sm   | 100 | 130 | 4          | 10px       |
| md   | 140 | 175 | 6          | 14px       |
| lg   | 180 | 220 | 8          | 18px       |

### Visual encoding
- **Red X** → muted string (`fret === -1`)
- **Open circle** → open string (`fret === 0`)
- **Filled sky-400 dot** → fretted note
- **Sky-400 rectangle** → barre chord
- Chord name label is always rendered at bottom center

### Watch Out
- String numbering: string 1 = low E (leftmost), string 6 = high e (rightmost) — matches `frets` array index 0–5
- `labelFontSize` was previously too small at `sm` — keep label at ≥10px
- SVG is pure — no Tailwind inside the SVG element

---

## Sub-component: GuitarFretboard

**File:** `src/components/GuitarFretboard.tsx`

### Props
```ts
interface GuitarFretboardProps {
  scaleNotes: number[]          // 0-11 indices of notes in scale (INCLUDING root)
  rootNote: number              // 0-11 — root shown in sky-400, others in violet-500
  numFrets?: number             // default 12
  onNoteClick?: (noteIndex: number, string: number, fret: number) => void
}
```

### Tuning constants (standard)
```ts
const OPEN_NOTES   = [4, 9, 2, 7, 11, 4]   // E A D G B e  (semitone indices)
const OPEN_OCTAVES = [2, 2, 3, 3,  3, 4]
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e']
```

### Dot coloring
```ts
fill={isRoot ? '#38bdf8' : '#8b5cf6'}   // sky-400 for root, violet-500 for scale notes
```

### Note name calculation (for a given string `s` and fret `f`)
```ts
const absoluteSemitone = OPEN_NOTES[s] + f
const noteIndex = absoluteSemitone % 12
const octave = OPEN_OCTAVES[s] + Math.floor(absoluteSemitone / 12)
```

### Audio on click
```ts
playGuitarNote(noteIndex, octave).catch(() => {})
```

### Watch Out
- `scaleNotes` DOES include the root (unlike PianoKeyboard which filters it out)
- Dots are only shown on frets 1+ — open strings are not highlighted on the fretboard
- Component wraps SVG in `overflow-x-auto` div — the fretboard can scroll horizontally

## Watch Out (GuitarLab overall)
- Chord diagram text labels should be at least 14px — the SVG font-size was too small before
- Transposing chord progression: apply `transposeChord(chord, n)` to each chord in array
- Audio: always `playGuitarChord(chordName).catch(() => {})`

