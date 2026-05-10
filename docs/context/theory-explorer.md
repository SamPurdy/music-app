# Context: TheoryExplorer + PianoKeyboard

**Files:** `src/components/TheoryExplorer.tsx`, `src/components/PianoKeyboard.tsx`
**Tab:** Theory (key `theory`)

## TheoryExplorer State
```ts
rootNote: string   // "C", "D", "F#", etc.
scaleKey: string   // key into SCALES object
```

## How It Computes Notes
```ts
const rootIdx = NOTE_NAMES.indexOf(rootNote)  // 0-11
const noteIndices = getScaleNoteIndices(rootNote, scaleKey)  // includes root
// When passing to PianoKeyboard — MUST filter root out:
scaleNotes={noteIndices.filter(n => n !== rootIdx)}
rootNote={rootIdx}
```

## PianoKeyboard Props
```ts
scaleNotes?: number[]  // 0-11, root NOT included
rootNote?: number      // 0-11
onNoteClick?: (noteIndex: number) => void
label?: string
```

## Key Colors (4 states — all must be in legend)
- Sky blue (`sky-400`) → root
- Violet (`violet-500` / `violet-300`) → scale note
- White → white key, not in scale
- Gray-600 → black key, not in scale

## Watch Out
- `SCALES[key].intervals` does NOT include 0 (root implied)
- `getScaleNoteIndices()` DOES return root — always filter before passing to PianoKeyboard
- `bg-zinc-900` is invisible on dark background — use `bg-gray-600` for non-scale black keys
