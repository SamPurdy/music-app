# Context: ChordProgressionDisplay

**File:** `src/components/ChordProgressionDisplay.tsx`
**Tab:** Chords (key `chords` in App.tsx)

## State
```ts
key: string               // e.g. "C", "F#" — selected from KEYS array
mode: 'major' | 'minor'
length: number            // bars: 2 | 4 | 6 | 8 | 12 | 16
result: Progression | null
instrument: 'piano' | 'guitar'
isPlaying: boolean
```

## How a Progression Is Generated
```ts
// mode='major':
const prog = generateMajorProgression(key, length)
// mode='minor':
const prog = generateMinorProgression(key, length)
setResult(prog)
```

## Progression Shape (from progressions.ts)
```ts
{
  key: string             // e.g. "C"
  scaleNotes: string[]    // e.g. ["C", "D", "E", "F", "G", "A", "B"]
  chords: Array<{
    full: string          // chord name e.g. "Am7"
    roman: string         // e.g. "vi"
    quality: ChordQuality // 'major' | 'minor' | 'diminished'
    notes: string[]       // midi note strings e.g. ["C4", "E4", "G4"]
  }>
}
```

## Audio Playback
```ts
import { playPianoChord, playGuitarChord, chordNotesToNoteNames } from '@/lib/audio/synth'

// Single chord (on card hover/click):
const noteNames = chordNotesToNoteNames(chord.notes, instrument)
playPianoChord(noteNames, '2n').catch(() => {})   // or playGuitarChord

// Play All (sequential, 2s apart):
for (let i = 0; i < result.chords.length; i++) {
  await new Promise<void>(resolve => setTimeout(resolve, i === 0 ? 0 : 2000))
  const noteNames = chordNotesToNoteNames(result.chords[i].notes, instrument)
  playPianoChord(noteNames, '2n').catch(() => {})
}
```

## Chord Card Visual Styles (quality-driven)
```ts
const QUALITY_STYLE = {
  major:      { bg: 'bg-sky-500/10',    border: 'border-sky-500/25',    text: 'text-sky-400'    },
  minor:      { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-400' },
  diminished: { bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  text: 'text-amber-400'  },
}
```

## Watch Out
- `chordNotesToNoteNames()` is required before passing chord notes to the play functions — do NOT pass `chord.notes` directly
- `isPlaying` state must be reset after the full progression plays (use `setTimeout` at the end)
- The Download button (MIDI export) is present in the UI but not yet wired up — `src/lib/midi/export.ts` has the foundation
- Chord cards only show their play button on hover (CSS `group-hover:opacity-100`)
