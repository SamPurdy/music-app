# Structured Output Schemas — Soundwave Studio

> **Local model:** When producing JSON (save files, API responses, data structures), always match these schemas exactly. Do not add extra fields or change field names.

---

## Song Save File (`public/songs/<name>.json`)

```json
{
  "id": "uuid-string",
  "title": "Song Title",
  "key": "C",
  "tempo": 120,
  "timeSignature": "4/4",
  "sections": [
    {
      "id": 1,
      "name": "Verse",
      "chords": ["Am", "F", "C", "G"],
      "lyrics": "Line one of lyrics\nLine two of lyrics"
    },
    {
      "id": 2,
      "name": "Chorus",
      "chords": ["C", "G", "Am", "F"],
      "lyrics": ""
    }
  ],
  "createdAt": "2026-05-10T19:00:00.000Z",
  "updatedAt": "2026-05-10T20:00:00.000Z"
}
```

**Field rules:**
- `id`: string UUID — use `crypto.randomUUID()` or `Date.now().toString()`
- `key`: note name only — e.g. `"C"`, `"Am"`, `"F#"` — must be a valid key string
- `tempo`: integer BPM
- `timeSignature`: string `"4/4"` | `"3/4"` | `"6/8"` | `"2/4"`
- `sections[].id`: auto-incrementing integer
- `sections[].chords`: array of chord name strings — never a single string
- `sections[].lyrics`: newline-separated string, may be empty `""`
- `createdAt` / `updatedAt`: ISO 8601 timestamp strings

---

## CreativeSuggestion (generated in `CreativeInspiration.tsx`)

```ts
interface CreativeSuggestion {
  type: 'chord' | 'lyric' | 'melody' | 'structure' | 'rhythm'
  content: string    // for type='chord': a valid chord name e.g. "Am7", "Cmaj7"
  context: string    // human-readable explanation
  confidence: number // 0.0 – 1.0
}
```

**When `type === 'chord'`:**
- `content` must be a raw chord name string that can be passed directly to `playPianoChord(content)`
- Valid examples: `"C"`, `"Am"`, `"Gmaj7"`, `"F#m"`, `"Bb"`, `"Dm7"`
- Invalid (do not use): `"C major"`, `"Am chord"`, `"play Am"`, `"the Am chord"`

**When generating a suggestion array, always produce exactly this shape:**
```ts
const suggestions: CreativeSuggestion[] = [
  { type: 'chord', content: 'Am7',  context: 'Works well as a i chord in A minor', confidence: 0.9 },
  { type: 'chord', content: 'Fmaj7', context: 'Adds a dreamy quality as the bVI', confidence: 0.85 },
  { type: 'lyric', content: 'Fading light', context: 'Fits the melancholic mood of A minor', confidence: 0.75 },
]
// Then: setSuggestions(suggestions)  — NOT setSuggestions(prev => [...prev, ...suggestions])
```

---

## GuitarChordVoicing (`src/lib/guitar/chords.ts`)

```ts
interface GuitarChordVoicing {
  name: string          // chord name e.g. "Am"
  frets: number[]       // 6 values, one per string (low E to high E). -1=muted, 0=open, 1-22=fret
  fingers: number[]     // 6 values, finger number 0-4 (0=open/muted)
  baseFret?: number     // if chord starts above fret 1 — the fret number shown on diagram
  barres?: Array<{
    fret: number
    fromString: number  // 1-6 (1=high E)
    toString: number    // 1-6
  }>
}
```

**Example — open Am:**
```ts
{ name: 'Am', frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0] }
```

**Example — F barre:**
```ts
{ name: 'F', frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 1, toString: 6 }] }
```

---

## MIDI Export Options (`src/lib/midi/export.ts`)

```ts
interface MidiExportOptions {
  tempo: number           // BPM integer
  key: string             // e.g. "C", "Am"
  trackName?: string      // defaults to song title
  instrument?: number     // General MIDI program number (0=piano, 25=acoustic guitar)
  quantization?: '1/4' | '1/8' | '1/16'  // defaults to '1/4'
}
```
