# Context: CreativeInspiration

**File:** `src/components/CreativeInspiration.tsx`
**Tab:** Inspiration (key `inspiration`)

## State
```ts
selectedKey: string     // musical key
selectedVibe: string    // genre/mood
suggestions: CreativeSuggestion[]
isLoading: boolean
```

## CreativeSuggestion Interface
```ts
interface CreativeSuggestion {
  type: 'chord' | 'lyric' | 'melody' | 'structure' | 'rhythm'
  content: string
  context: string
  confidence: number
}
```

## Critical Behavior — CLEAR, Don't Append
When key or genre changes, the suggestions list MUST be **cleared and replaced**:
```ts
// CORRECT:
setSuggestions(newSuggestions)

// WRONG — this appends and causes duplicates:
setSuggestions(prev => [...prev, ...newSuggestions])
```

## Audio Playback
Play buttons on suggestion cards call audio via synth:
```ts
// Chord suggestions → piano or guitar
playPianoChord(chordName).catch(() => {})
// Check that chord is a valid chordName string before calling
```

## Suggestion Schema
See `docs/context/schemas.md` for full interface.  
**Critical for audio:** when `type === 'chord'`, `content` must be a bare chord name (`"Am7"`, `"Cmaj7"`) — no other words. This string is passed directly to `playPianoChord(content)`.

## Watch Out
- Each key/genre combination should generate fresh results — do not accumulate
- Play buttons were previously broken because chord data wasn't correctly parsed from `content` string
- Always verify `content` is a valid chord name before passing to `playPianoChord()`
