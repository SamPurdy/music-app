# Context: ChordProgressionDisplay

**File:** `src/components/ChordProgressionDisplay.tsx`
**Tab:** Chords (key `chords` in App.tsx)

## Props
```ts
interface Props {
  onSendToSong?: (prog: { key: string; chords: string[] }) => void
}
```
`onSendToSong` is wired from `App.tsx`. When present, a green "Song ↗" button appears in the toolbar and sends `{ key, chords: string[] }` upward. `App.tsx` then sets `pendingProgression` state and switches to the Song tab.

## State
```ts
key: string               // e.g. "C", "F#" — selected from KEYS array
mode: 'major' | 'minor'
length: number            // bars: 2 | 4 | 6 | 8 | 12 | 16
result: Progression | null
instrument: 'piano' | 'guitar'
isPlaying: boolean
selectedChordIndex: number | null  // which card is selected for ChordFunctionExplainer
```

## How a Progression Is Generated
```ts
// Both major and minor use random generation for variety:
const prog = generateRandomProgression(key, length)
setResult(prog)
setSelectedChordIndex(null)  // always reset on new generation
```

## Progression Shape (from progressions.ts)
```ts
{
  key: string             // e.g. "C"
  scaleNotes: string[]    // e.g. ["C", "D", "E", "F", "G", "A", "B"]
  chords: Array<{
    full: string          // chord name e.g. "Am"
    roman: string         // e.g. "vi"
    quality: ChordQuality // 'major' | 'minor' | 'diminished'
    notes: string[]       // midi note strings e.g. ["C4", "E4", "G4"]
  }>
}
```

## Audio Playback
```ts
import { playPianoChord, playGuitarChord, chordNotesToNoteNames } from '@/lib/audio/synth'

// Single chord — play button uses e.stopPropagation() to avoid toggling explainer:
const noteNames = chordNotesToNoteNames(chord.notes, instrument)
playPianoChord(noteNames, '2n').catch(() => {})

// Play All (sequential, 2s apart):
for (let i = 0; i < result.chords.length; i++) {
  if (i > 0) await new Promise<void>(resolve => setTimeout(resolve, 2000))
  const noteNames = chordNotesToNoteNames(result.chords[i].notes, instrument)
  playPianoChord(noteNames, '2n').catch(() => {})
}
await new Promise<void>(resolve => setTimeout(resolve, 1500))
setIsPlaying(false)
```

## Chord Function Explainer
Clicking a chord card sets `selectedChordIndex`. Below the grid, `<ChordFunctionExplainer>` renders for the selected chord using `chord.roman`. Clicking the same card again or pressing ✕ clears selection. The explainer animates in/out with `AnimatePresence` + height animation.

```ts
import ChordFunctionExplainer from '@/components/ChordFunctionExplainer'
// Rendered below the grid inside AnimatePresence
```

## Chord Card Visual Styles (quality-driven)
```ts
const QUALITY_STYLE = {
  major:      { bg: 'bg-sky-500/10',    border: 'border-sky-500/25',    text: 'text-sky-400'    },
  minor:      { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-400' },
  diminished: { bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  text: 'text-amber-400'  },
}
```
Selected card adds: `ring-2 ring-offset-1 ring-offset-studio-bg ring-studio-accent/60`

## Watch Out
- `chordNotesToNoteNames()` is required before passing chord notes to the play functions — do NOT pass `chord.notes` directly
- Play button uses `e.stopPropagation()` — clicking play must NOT toggle the explainer panel
- `isPlaying` state must be reset after the full progression plays (extra 1500ms delay after loop)
- The Download button (MIDI export) is present in the UI but not yet wired up — `src/lib/midi/export.ts` has the foundation
- Chord cards now use `cursor-pointer` (not `cursor-default`) since they're clickable
