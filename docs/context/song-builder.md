# Context: SongStructureBuilder

**File:** `src/components/SongStructureBuilder.tsx`
**Tab:** Song (key `song` in App.tsx)

## State Shape
```ts
songName: string
songKey: string        // e.g. "C", "Am" — dropdown, NOT freeform
bpm: number
timeSignature: string  // "4/4", "3/4", etc.
sections: Section[]    // drag-and-drop ordered
expandedIds: Set<number>  // multiple sections can be open at once
```

## Section Interface
```ts
interface Section {
  id: number
  name: string      // "Verse", "Chorus", etc.
  chords: string[]  // e.g. ["Am", "F", "C", "G"]
  lyrics: string    // freeform text
}
```

## Key Behaviors
- Key change triggers `handleKeyChange(newKey)` which transposes all chords
- Drag reorder: `@dnd-kit/core` library
- Save: downloads JSON or POSTs to `public/songs/`
- Transpose: `transposeChord(chord, semitones)` from `src/lib/guitar/chords.ts`
- Multiple sections expandable simultaneously (Set-based, not single toggle)

## Watch Out
- `onChange` on key dropdown must use `e.target.value`, NOT the current state value
- Song sidebar (key/bpm/time) updates reactively — no manual refresh needed
