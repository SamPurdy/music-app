# Skill: Guitar Fretboard Geometry
**Description:** Use this skill when calculating guitar chord fingerings, scale patterns on a 6-string neck, capo-adjusted transpositions, or updating the GuitarLab component.

## Instructions

### 1. Standard Tuning Constants
- String 6 (Low E): E2 — MIDI note 40
- String 5: A2 — MIDI note 45
- String 4: D3 — MIDI note 50
- String 3: G3 — MIDI note 55
- String 2: B3 — MIDI note 59
- String 1 (High E): E4 — MIDI note 64

### 2. Capo Calculation
The capo shifts the effective open-string pitch up by N semitones:
- **Formula:** `effectiveKey = openShapeKey + capoFret`
- **Reverse:** `capoFret = targetKey - openShapeKey`
- *Example:* Playing C shapes with capo on fret 3 → sounds in Eb Major

### 3. GuitarLab Component
Located at `src/components/GuitarLab.tsx`. Contains:
- Capo calculator
- Chord diagrams (SVG grid with finger position dots)
- Fretboard visualizer
- Chord progression input with transpose controls

When adding chord shapes, the diagram data format is:
```typescript
interface ChordDiagram {
  name: string
  frets: number[]    // per string, -1 = muted, 0 = open
  fingers: number[]  // finger number (0–4)
  barres?: { fret: number; fromString: number; toString: number }[]
  baseFret?: number  // for chords higher on the neck
}
```

### 4. Fingering Logic (CAGED System)
When suggesting chord shapes:
- Prioritize open shapes (CAGED positions) when capo is active
- Prioritize barre shapes for higher-register voicings
- Show nearest voicing to capo position

### 5. Scale Visualization
For fretboard scale patterns, map each scale note to `(string, fret)` coordinates:
- `note = (openStringMidi + fret) % 12`
- Highlight root notes distinctly from scale notes (same color scheme as PianoKeyboard)
