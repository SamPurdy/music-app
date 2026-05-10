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

## Watch Out
- Chord diagram text labels should be at least 14px — the SVG font-size was too small before
- Transposing chord progression: apply `transposeChord(chord, n)` to each chord in array
- Audio: always `playGuitarChord(chordName).catch(() => {})`
