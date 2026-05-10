---
description: Generate or analyze chord progressions in the Chord Lab tab
agent: music-dev
---

Work with chord progressions in Soundwave Studio:

1. The Chord Lab tab (`src/components/ChordProgressionDisplay.tsx`) generates progressions
2. Progressions use the `tonal` library for music theory calculations
3. Roman numeral analysis is shown for each chord (I, IV, V, etc.)
4. Chords can be played back via `src/lib/audio/synth.ts`
5. Progressions can be copied to the Song tab sections

Usage: /progression [key] [style/genre] [number of chords]

Examples:
- /progression C major 4
- /progression Am blues 8
- /progression F# minor jazz 6

Theory note: Use the `tonal` library (already installed) for all calculations:
```typescript
import { Scale, Chord } from 'tonal'
Scale.get("C major").notes  // ["C", "D", "E", "F", "G", "A", "B"]
```
