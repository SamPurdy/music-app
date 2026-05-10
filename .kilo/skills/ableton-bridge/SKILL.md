# Skill: Tone.js Audio Integration
**Description:** Use this skill when adding or fixing audio playback, synthesis, or instrument sounds in Soundwave Studio.

## Instructions
All audio in Soundwave Studio is handled by Tone.js via a single module: `src/lib/audio/synth.ts`.

### 1. Never Call Tone.js Directly
Always import from `src/lib/audio/synth.ts`:
```typescript
import { playNote, playChord, playGuitarNote, playGuitarChord } from '../lib/audio/synth'
```

### 2. Available Functions
Check `src/lib/audio/synth.ts` for the current API. Common patterns:
```typescript
// Piano
await playNote('C4')
await playChord(['C4', 'E4', 'G4'])

// Guitar (Karplus-Strong synthesis)
await playGuitarNote('E2')
await playGuitarChord(['E2', 'A2', 'D3', 'G3', 'B3', 'E4'])
```

### 3. Async Rules
- All synth functions are async — use `await` or `.catch(() => {})`
- For fire-and-forget (button clicks): `playChord(notes).catch(() => {})`
- Tone.js requires a user gesture to start AudioContext — this is handled internally in `synth.ts`

### 4. Note Naming Convention
- Tone.js uses scientific notation: `C4`, `D#3`, `Gb5`
- Note index (0–11) → note name: index 0 = C, 1 = C#, etc. + octave

### 5. Adding New Sounds
1. Add new functions to `src/lib/audio/synth.ts` only
2. Export them from that module
3. Import in components — never instantiate Tone.js instruments in components
