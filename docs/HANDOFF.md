# Soundwave Studio — Session Handoff

> **LOCAL MODEL INSTRUCTIONS:**
> - **Start of session:** Read this file FIRST (tiny, fast). Then read DEVLOG last 2 entries. Only read ARCHITECTURE.md if you need deeper reference.
> - **End of session:** Overwrite the Current State section below with your summary, then stop and wait for user to approve before committing.

---

## Current State

**Last worked on:** Multiple major songwriting & playback features:
1. **Full CAGED Fretboard Voicings & Chord Hover Tooltips** (`ChordTooltip.tsx`, `chords.ts`) — Interactive chord popups showing full guitar CAGED diagrams with up/down variation cycling and mini piano SVG keyboards with inversion cycling.
2. **Step-by-Step Transpose & Capo** (`SongStructureBuilder.tsx`, `GuitarLab.tsx`) — Semitone transpose controls (`+`/`−`) with amber Reset button and guitar capo support.
3. **Section Voice Memos & Melody Scratchpad** (`SectionAudioMemo.tsx`, `memoStorage.ts`) — In-browser microphone recording with real-time level meters, backing chord accompaniment, player scrubbing, and IndexedDB blob persistence.
4. **Natural Chord Sustain & Metronome Click Engine** (`synth.ts`, `SongStructureBuilder.tsx`, `SectionAudioMemo.tsx`) — Dynamic chord durations for full sustain until the next chord, accented metronome clicks with live toggle (`⏱️ Click ON/OFF`), and live beat visualizer dots.
5. **JSON Song Export & Library Backup System** (`SongStructureBuilder.tsx`) — Dedicated `Export JSON` button, `Backup All` library export, per-card JSON downloads, and smart JSON file restoration.

**Status:** All features fully implemented and verified, build clean (`npm run build` passes with exit code 0).

---

## Next Steps (carry forward)

- [ ] Tension/Release Visualizer — `chord-functions.ts` already has `tension: number` for every Roman numeral
- [ ] Song section loop playback (already in TODOS)
- [ ] MIDI export wiring — foundation in `src/lib/midi/export.ts`
- [ ] CreativeInspiration list may append on repeated genre/key changes — verify clear behavior

---

## Known Issues / Watch-Outs

- **`chords` in `SongStructureBuilder.Section`** is a **space-separated `string`**, NOT `string[]` — the context card previously had this wrong. e.g. `"Am  F  C  G"`. Split with `/[\s,]+/` to get individual chords.
- **DEVLOG corruption:** Old corrupted entries can accumulate at the bottom of DEVLOG.md from failed edit attempts. Always view the top of the file before inserting a new entry.
- **`ChordFunctionExplainer`** only covers the 14 diatonic Roman numerals (I ii iii IV V vi vii° i ii° ♭III iv v ♭VI ♭VII). If `getChordFunction()` returns null, the component renders nothing — this is intentional for extended/chromatic chords.
- **`pendingProgression` in App.tsx** — shared state between Chord Lab and Song tab. If you add tabs or refactor App.tsx, make sure this state persists and the `handleSendToSong` callback still switches `activeTab` to `'song'`.

