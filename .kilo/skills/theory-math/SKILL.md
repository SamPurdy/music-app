# Skill: Music Theory Mathematics
**Description:** Use this skill when calculating musical intervals, note frequencies, chord formulas, transpositions, or Circle of Fifths relationships.

## Instructions

### 1. Note Index System (0–11, chromatic)
| 0 | 1  | 2 | 3  | 4 | 5 | 6  | 7 | 8  | 9 | 10 | 11 |
|---|----|----|----|----|---|----|----|----|----|----|----|
| C | C# | D | D# | E | F | F# | G | G# | A | A# | B  |

White keys: `[0,2,4,5,7,9,11]` — Black keys: `[1,3,6,8,10]`

### 2. Interval Half-Step Mappings
- Minor 2nd: 1 | Major 2nd: 2
- Minor 3rd: 3 | Major 3rd: 4
- Perfect 4th: 5 | Tritone: 6
- Perfect 5th: 7 | Minor 6th: 8
- Major 6th: 9 | Minor 7th: 10
- Major 7th: 11 | Octave: 12

### 3. Tonal Library (TypeScript)
The app uses the `tonal` npm package. Prefer it for all calculations:
```typescript
import { Note, Chord, Scale } from 'tonal'

Note.transpose('C4', '5P')        // "G4" (Perfect 5th up)
Chord.get('Cmaj7').intervals      // ["1P", "3M", "5P", "7M"]
Scale.get('C major').notes        // ["C", "D", "E", "F", "G", "A", "B"]
```

### 4. Transposition
```typescript
// Transpose a chord name by N semitones
function transposeChord(chord: string, semitones: number): string {
  // Use tonal's Note.transpose with the semitone interval
  const root = chord.match(/^[A-G][#b]?/)?.[0]
  if (!root) return chord
  const newRoot = Note.transpose(root, `${semitones}m2`) // use Interval.fromSemitones
  return chord.replace(root, newRoot)
}
```

### 5. Frequency Formula (for reference)
Equal temperament: `f = 440 * 2^(n/12)` where n = semitones from A4

### 6. Scale Root Handling
- `SCALES[key].intervals` does NOT include 0 — root is always implied
- `getScaleNoteIndices(key, scale)` returns indices including root
- When passing to `PianoKeyboard`, filter root out: `noteIndices.filter(n => n !== rootIdx)`

### 7. Constraints
- No hardcoded frequency tables — derive from the formula
- Handle enharmonic equivalents: G# ↔ Ab, A# ↔ Bb, D# ↔ Eb
- All theory code goes in `src/lib/music-theory/` only
