---
description: Save or export song data from Soundwave Studio
agent: music-dev
---

Save or export song data from Soundwave Studio:

**Current Save System** (JSON):
- Songs are saved as JSON files in `public/songs/`
- Save button is in the Song tab (`src/components/SongStructureBuilder.tsx`)
- JSON format includes: song name, key, BPM, time signature, sections (chords + lyrics)

**To save a song**:
The save functionality uses the browser's Fetch API to POST JSON to a local endpoint,
or falls back to triggering a browser download of the JSON file.

**Future: MIDI Export**:
The `@tonejs/midi` package is available for MIDI generation:
```typescript
import { Midi } from '@tonejs/midi'
const midi = new Midi()
const track = midi.addTrack()
// Add notes from chord data...
const blob = new Blob([midi.toArray()], { type: 'audio/midi' })
```

Usage: /export-midi [describe what to export]

Examples:
- /export-midi Save current song as JSON
- /export-midi Generate MIDI file from the current song's chord progression
- /export-midi Fix the save button not working
