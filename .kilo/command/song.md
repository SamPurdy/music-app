---
description: Work with the Song tab (SongStructureBuilder) — add sections, write chords/lyrics, save/load, transpose
agent: music-dev
---

Work with the Song tab in Soundwave Studio (`src/components/SongStructureBuilder.tsx`):

1. The Song tab allows creating and organizing song sections (Verse, Chorus, Bridge, etc.)
2. Each section can have chord progressions (space-separated: "Am F C G") and lyrics
3. Songs are saved as JSON files in `public/songs/`
4. The sidebar shows song metadata (key, BPM, time signature) — updates reactively
5. Song key selection is a dropdown; key/BPM changes update the sidebar immediately
6. The song can be transposed up/down (all chords shift by semitones)
7. Sections can be drag-and-drop reordered

Usage: /song [describe what you want to do]

Examples:
- /song Add a bridge section with Am-F-C-G progression
- /song Fix the save functionality not persisting
- /song Add a loop playback feature for a single section
