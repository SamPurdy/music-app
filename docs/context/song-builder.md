# Context: SongStructureBuilder

**File:** `src/components/SongStructureBuilder.tsx`
**Tab:** Song (key `song` in App.tsx)

## Props
```ts
interface Props {
  onMetaChange?: (meta: { key: string; tempo: number; timeSig: string }) => void
  pendingProgression?: { key: string; chords: string[] } | null
  onClearPending?: () => void
}
```
`pendingProgression` is set by `App.tsx` when the user clicks "Song ↗" in Chord Lab. When non-null, a green acceptance banner renders at the top of the component. `onClearPending` dismisses it.

## State Shape
```ts
title: string
songKey: string            // e.g. "C" — dropdown from KEYS array
tempo: number              // BPM
timeSig: string            // "4/4", "3/4", etc.
sections: Section[]
expandedIds: Set<number>   // multiple sections expandable simultaneously
savedSongs: Song[]         // persisted in localStorage under 'sws_saved_songs'
pendingSectionType: SectionType  // for the acceptance banner section picker
```

## Section Interface
```ts
interface Section {
  id: number
  name: string       // "Verse", "Chorus", etc.
  type: SectionType  // 'intro'|'verse'|'pre-chorus'|'chorus'|'bridge'|'outro'
  bars: number       // bar count
  chords: string     // ⚠️ SPACE-SEPARATED STRING, not array — e.g. "Am  F  C  G"
  lyrics: string     // freeform text
}
```
**⚠️ CRITICAL:** `chords` is a `string`, not `string[]`. Split with `/[\s,]+/` to get individual chords. When writing chord string: join with `'  '` (two spaces).

## Key Behaviors
- Key change triggers `handleKeyChange(oldKey)` — reads current `songKey` state for new key, passes old key as argument to calculate semitone diff, transposes all section chords
- `transposeAllChords(semitones)` — changes key + transposes all chords
- `acceptPendingProgression()` — creates a new section from `pendingProgression`, pre-fills chords, expands it, calls `onClearPending()`
- Drag reorder: `draggedId` state + `onDragOver` / `onDrop` handlers (no external DnD lib — native HTML5)
- Save: downloads JSON + saves to `localStorage`
- Multiple sections expandable simultaneously via `Set<number>`

## Acceptance Banner (pendingProgression)
When `pendingProgression` is non-null, an animated banner appears at the very top (before saved songs panel) with:
- Chord preview: `pendingProgression.chords.join('  ')`  
- Section type `<select>` bound to `pendingSectionType` state
- "Add Section" button → calls `acceptPendingProgression()`
- ✕ dismiss button → calls `onClearPending()`

## Save File Format
See `docs/context/schemas.md` for the exact JSON schema.
Key points: `chords` is stored as a `string` (space-separated), timestamps are Unix ms (`Date.now()`).

## Watch Out
- `chords` in Section is a **string** not an array — always split before processing, join with `'  '` when writing back
- `handleKeyChange` receives the **old** key as argument — it reads the new key from `songKey` state directly
- Song sidebar (key/bpm/time) updates reactively via `onMetaChange` effect
- `savedSongs` persists to `localStorage` key `'sws_saved_songs'`
