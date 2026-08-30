# Soundwave Studio — Developer Log

> **Instructions for local model:** After completing a session of changes, insert a new entry at the **TOP** of this file (directly below this `---` line). Use the exact template below — each label and each bullet point must be on its own line. Do NOT write the entry as a single block of text.

**Required format — copy exactly:**
```
## YYYY-MM-DD — Short title

**Changed files:** `src/path/file.tsx`, `docs/DEVLOG.md`

**What changed:**
- One specific change per bullet
- Second change on its own line

**Why:** One or two sentences explaining the reason.

---
```

## 2026-08-30 — JSON Song Export & Library Backup System

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added a dedicated `Export JSON` button in the Song Editor action bar to export the current song to a structured `.json` backup file
- Added a `Backup All` button in the Saved Songs header to export all saved songs into a consolidated library backup file (`soundwave-songs-backup-YYYY-MM-DD.json`)
- Added per-song `Export JSON` download buttons on every saved song card in the library list
- Enhanced `loadSong` to automatically detect and import both single-song JSON files and multi-song library backup files
- Added visual feedback on the `Save to Library` button with animated confirmation

**Why:** Protects songwriters against accidental loss of songs if browser localStorage is cleared or when migrating songs between devices.

---
## 2026-08-30 — Softened background metronome volume and timbre

**Changed files:** `src/lib/audio/synth.ts`, `docs/DEVLOG.md`

**What changed:**
- Reduced metronome synthesizer volume from -3 dB to -14 dB for a soft, subtle background reference that does not overpower chords or vocals
- Tuned pitch and velocity (`A5` / `E5` with gentle offbeats) and shortened envelope decay for a clean, non-intrusive guide click

**Why:** The previous metronome volume was too loud and harsh. Lowering the volume creates a comfortable background guide track.

---
## 2026-08-30 — Live metronome toggle & Voice Memo scratchpad metronome/sustain fixes

**Changed files:** `src/components/SongStructureBuilder.tsx`, `src/components/SectionAudioMemo.tsx`, `docs/DEVLOG.md`

**What changed:**
- Fixed live metronome toggle in `SongStructureBuilder.tsx` by using `metronomeRef` so toggling the Click ON/OFF button instantly starts/stops clicks in real time without restarting playback
- Fixed piano/guitar chord sustain in `SectionAudioMemo.tsx` by calculating exact dynamic chord durations (`chordDurationSec`) instead of a fixed 0.5s quarter note
- Added metronome click option (`playMetronome`) to `SectionAudioMemo.tsx` so songwriters have a clear tempo/rhythm reference while singing or playing guitar takes (both with and without backing chords)
- Added live `⏱️ Click ON/OFF` toggle button during active recording in the voice memo scratchpad

**Why:** Gives songwriters instant live control over metronome clicks and full natural harmonic sustain while recording vocal or acoustic ideas.

---
## 2026-08-30 — Full chord duration sustain & tempo metronome clicker

**Changed files:** `src/lib/audio/synth.ts`, `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Fixed short chord playback cutoff by passing exact dynamic duration in seconds to `playPianoChord` and `playGuitarChord` so chords sustain naturally until the next chord begins
- Created `playMetronomeClick()` synth in `synth.ts` with accented downbeat on Beat 1 (`C6`) and clear percussive clicks on subsequent beats (`G5`)
- Added sub-beat metronome clock loop in `SongStructureBuilder.tsx` aligned with tempo and time signature
- Added Metronome toggle button (`⏱️ Click ON/OFF`) and live animated beat visualizer dots in the playback transport bar

**Why:** Chords previously cut off after a hardcoded 1-second half-note. Sustaining chords for their full bar duration and adding a tempo metronome provides musical momentum and a clear groove for songwriters.

---
## 2026-08-30 — Section Voice Memos & Melody Scratchpad

**Changed files:** `src/lib/audio/memoStorage.ts`, `src/components/SectionAudioMemo.tsx`, `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Created `memoStorage.ts` providing IndexedDB binary blob persistence for audio recordings
- Built `SectionAudioMemo.tsx` component with microphone recording, real-time audio level visualizer bars, and optional backing chord accompaniment during takes
- Added voice memo player with scrubbing, duration tracking, "Play with Chords" dual-playback, audio download, and delete/re-record
- Added voice memo status pill badges in the Song Editor section header showing audio duration at a glance
- Integrated `audioMemoId` and `audioDuration` into section state and storage persistence

**Why:** Allows songwriters to immediately capture vocal melodies, humming, or acoustic scratchpad ideas directly over their song sections and listen back with backing chords.

---
## 2026-08-30 — Full CAGED fretboard voicings & Guitar Lab transpose unification

**Changed files:** `src/lib/guitar/chords.ts`, `src/components/GuitarLab.tsx`, `docs/DEVLOG.md`

**What changed:**
- Expanded `getGuitarVoicings()` to dynamically generate complete CAGED system voicings (C, A, G, E, and D shape barres/inversions) across the full fretboard up to fret 12/14 for major, minor, dominant 7, major 7, and minor 7 chords
- Sorted CAGED voicings in ascending order by base fret so variation cycling naturally moves up the guitar neck
- Updated the Progression Viewer in Guitar Lab to use the same step-by-step (+/−) semitone transpose control with amber Reset button as the Song Editor
- Added interactive variation pagers to the chord cards in the Guitar Lab Progression Viewer so users can cycle through fretboard voicings for every chord in their progression

**Why:** Gives musicians complete fretboard visibility for any chord using the CAGED system, and provides a unified, intuitive semitone transpose experience across both the Song Editor and Guitar Lab.

---
## 2026-08-30 — Chord shape hover popups for song editor with guitar and piano views

**Changed files:** `src/components/ChordTooltip.tsx`, `src/components/SongStructureBuilder.tsx`, `src/lib/guitar/chords.ts`, `src/lib/music-theory/notes.ts`, `docs/DEVLOG.md`

**What changed:**
- Created `ChordTooltip` component rendering floating hover popups on chord pills using React portals to avoid clipping
- Integrated `GuitarChordDiagram` with variation pagers to cycle through alternative guitar chord voicings (open + barre forms)
- Added `MiniPiano` interactive keyboard diagram showing highlighted root and chord tones with inversion cycling (root, 1st, 2nd, 3rd inversion)
- Added instrument toggle (🎸/🎹) inside the tooltip with audio preview button to play the chord sound
- Added `getGuitarVoicings()` helper in `chords.ts` and `getChordNoteIndices()` helper in `notes.ts`
- Wrapped chord pills in `SongStructureBuilder` with `ChordTooltip`

**Why:** Musicians writing or arranging songs in the Song Editor can quickly see guitar fingerings or piano chord inversions directly on hover without navigating away to the Guitar Lab.

---
## 2026-08-30 — Non-destructive transpose, capo support, instrumental lyrics fix

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Replaced the multi-button transpose panel with simple +/− buttons that transpose one semitone at a time
- Transposition is now non-destructive: original chords are preserved in state, display/playback/export use computed offsets
- Added a "Reset" button (appears when transpose ≠ 0) to return to the original key
- Added guitar capo fret selector (None / Fret 1–12) that adjusts displayed chord shapes accordingly
- Info bar shows sounding key and capo shape key when transpose or capo is active
- Chord input label shows "(original)" hint when a display offset is active
- Playback and MIDI export use sounding (transposed) chords; chord pills show capo-adjusted shapes
- Instrumental sections no longer show a lyrics textarea — only chord progression input is visible
- Save/load (localStorage + JSON file) now persists transposeSemitones and capoFret
- Key dropdown no longer auto-transposes chords; it just sets the base key

**Why:** The old transpose mutated stored chords and couldn't be undone. The new system keeps originals intact and lets musicians quickly transpose or set a capo for guitar playback without losing data. Instrumental sections don't need lyrics.

---
## 2026-06-06 — Fix silent first note/chord in audio playback

**Changed files:** `src/lib/audio/synth.ts`, `src/components/SongStructureBuilder.tsx`, `src/components/ChordProgressionDisplay.tsx`, `docs/DEVLOG.md`

**What changed:**
- Captured Tone.Reverb instances for piano, guitar sampler, and pluck synth inside `synth.ts`.
- Added `await reverb.ready` check in all note/chord trigger functions before playing sound.
- Added `ensureInstrumentLoaded` helper function to pre-load samplers and wait for Reverb impulse responses.
- Integrated `ensureInstrumentLoaded` in both `SongStructureBuilder.tsx` and `ChordProgressionDisplay.tsx` to pre-load audio before starting sequential loop playbacks.

**Why:** Tone.Reverb compiles impulse responses asynchronously and silent first notes/chords were occurring because triggers occurred before the Reverb nodes or the samplers were fully ready.

---

## 2026-06-06 — Song Playback in Song tab

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added `isPlaying`, `playingSectionId`, `playingChordIdx`, `playbackInstrument`, and `cancelRef` state to `SongStructureBuilder`
- Added `playSong()` — async loop that steps through each section with chords, computing `msPerChord = (bars / numChords) × secondsPerBar × 1000` for BPM-accurate timing (min 500ms per chord). Calls `playPianoChord` or `playGuitarChord` per chord, using `getChordNotes` to resolve names to note arrays and `chordNotesToNoteNames` for octave-aware note strings
- Added `stopPlayback()` — sets `cancelRef.cancelled = true` for immediate async cancellation with no leaks
- Added playback transport bar (only visible when any section has chords): Play/Stop button, 🎹/🎸 instrument toggle, BPM·time-sig readout, animated "Now Playing" indicator (section name + current chord with pulsing dot)
- Active section gets an emerald glow border (`shadow-[0_0_12px_rgba(16,185,129,0.15)]`)
- Active chord pill in expanded sections highlights in emerald with a scale-105 pop

**Why:** The Song tab had no way to actually hear the song structure — chords were written but silent. This closes the core gap.

---

## 2026-06-06 — Sync Theory Explorer root note with Circle of Fifths

**Changed files:** `src/components/CircleOfFifths.tsx`, `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added `selectedKey` and `onKeyChange` props to `CircleOfFifths`
- Added `keyToCircleIndex()` helper with enharmonic mapping (C#→Db, D#→Eb, G#→Ab, A#→Bb) to translate chromatic root spellings to the circle's flat-based key set
- `useEffect` in `CircleOfFifths` syncs the internal `selected` index whenever `selectedKey` prop changes
- All three click sites (major segment, minor segment, modulation buttons) now call `handleSelect` which also fires `onKeyChange`
- `TheoryExplorer` passes `root` as `selectedKey` and maps flat spellings back to sharps in `onKeyChange` before calling `setRoot`

**Why:** The root note selector and the Circle of Fifths were managing independent state, so changing one had no effect on the other. They now stay in sync in both directions.

---

## 2026-06-06 — Move Emotion → Chord Mapper to Inspiration tab

**Changed files:** `src/components/TheoryExplorer.tsx`, `src/components/CreativeInspiration.tsx`, `docs/DEVLOG.md`

**What changed:**
- Removed `EmotionChordMapper` import and usage from `TheoryExplorer.tsx`
- Added `EmotionChordMapper` import to `CreativeInspiration.tsx` and rendered it below the existing suggestion tool, separated by a divider

**Why:** The Emotion → Chord Mapper is a songwriting inspiration tool, not a theory reference — it belongs alongside the Creative Inspiration generator, not in the Theory Explorer.

---

## 2026-06-06 — New song starts with no sections

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Set `DEFAULT_SECTIONS` to an empty array so new songs start with a blank slate
- Reset `nextIdRef` initial value to `1` (previously derived from the default section count)
- Added an empty state UI in the section list — dashed border placeholder with a "No sections yet" message and hint to use the Add Section buttons

**Why:** The pre-filled Intro/Verse/Chorus/etc. structure was presumptuous — users should build their own arrangement from scratch using the Add Section buttons.

---

## 2026-06-06 — Improve UI contrast and element visibility

**Changed files:** `tailwind.config.js`, `src/index.css`, `src/components/SongStructureBuilder.tsx`, `src/components/ChordProgressionDisplay.tsx`, `src/components/GuitarLab.tsx`, `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`

**What changed:**
- Raised `studio-muted` token from `#64748b` (slate-500) to `#94a3b8` (slate-400) — brighter secondary text across the whole app
- Increased `studio-border` opacity from `0.08` to `0.12` and `border-hover` from `0.16` to `0.22` for clearly visible borders
- Added `bg-studio-surface/40` to Transpose buttons so they are distinguishable from the panel background
- Raised delete/trash button initial opacity from `opacity-0` to `opacity-40`, starting text from `muted/30` to `muted/60`
- Replaced `border-transparent` on all inactive selector buttons (root notes, mode, bars, quality, capo fret, etc.) with `border-studio-border/60`
- Raised chord card position number opacity from `/40` to `/70`
- Upgraded GripVertical drag handle from `muted/30` to full `muted`
- Upgraded section type badges from `/15` bg to `/20` bg, text from `300` to `200`, border from `/30` to `/40`

**Why:** Many buttons, labels, and icons used very low-opacity colors that blended into the dark background. The muted text token was too dark, and many buttons were practically invisible until hovered.

---

## 2026-06-06 — Add Instrumental section type to Song Editor

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added `instrumental` entry to `SECTION_TYPES` with amber/orange color theme (`bg-amber-500/15 text-amber-300 border-amber-500/30`)
- Positioned between Bridge and Outro in the section type order

**Why:** There was no way to mark a section as an instrumental break/solo. Users can now add Instrumental sections to their song structure and use the Add Section buttons to insert them anywhere in the arrangement.

---

## 2026-06-06 — Add New Song button to Song tab

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added `newSong()` handler that resets title, key, tempo, time signature, and sections to blank defaults after a confirmation prompt
- Added a "New Song" button in the Saved Songs panel header (accent-colored, always visible)
- Added a "New" button in the footer actions row next to Load and Save for quick access at any scroll position

**Why:** Once a saved song was loaded, there was no way to start fresh — users were stuck editing the loaded song with no escape route.

---

## 2026-06-03 — Fix Audit Bugs and Implement MIDI Export

**Changed files:** `src/lib/music-theory/notes.ts`, `src/lib/music-theory/progressions.ts`, `src/lib/music-theory/voice-leading.ts`, `src/lib/guitar/chords.ts`, `src/lib/midi/export.ts`, `src/lib/audio/synth.ts`, `src/App.tsx`, `src/components/ChordProgressionDisplay.tsx`, `src/components/SongStructureBuilder.tsx`, `src/components/GuitarLab.tsx`, `docs/DEVLOG.md`

**What changed:**
- Replaced skeletal MIDI helper with full export engine using @tonejs/midi and wired it to Chord Lab and Song Editor buttons
- Delegated noteToMidi and midiToNote functions in notes.ts to Tonal.js to resolve index offset pitch-shifting bugs
- Replaced duplicate transposition functions with a single robust mathematical modulo function in notes.ts and delegated chords.ts and component files to it
- Updated progression generator and analysis functions to accept scaleType and support minor key Roman numerals
- Derived right sidebar Harmonic Context values dynamically using Tonal.js based on active song key metadata
- Rewrote playProgression to fetch all notes for chord extensions dynamically using Tonal.js instead of hardcoding major/minor triads

**Why:** To resolve all critical bugs, UI/UX gaps, and code duplication identified in the code audit report, ensuring correct music theory calculations, functional MIDI exports, and responsive harmonic context display.

---

## 2026-06-03 — Code Audit and Task Import

**Changed files:** `docs/AUDIT.md`, `docs/TODOS.md`, `docs/DEVLOG.md`

**What changed:**
- Created docs/AUDIT.md detailing critical bugs, UX gaps, and code quality suggestions
- Updated docs/TODOS.md to track new high, medium, and low priority tasks from the audit

**Why:** To document findings from a complete review of the codebase and establish actionable next steps for development.

---

## 2026-05-31 — Copy Progression to Song

**Changed files:** `src/App.tsx`, `src/components/ChordProgressionDisplay.tsx`, `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`, `docs/TODOS.md`

**What changed:**
- `App.tsx` — added `pendingProgression` state and `handleSendToSong()` which stores the progression and switches to the Song tab automatically
- `ChordProgressionDisplay.tsx` — added `onSendToSong` prop; green "Song ↗" button appears in the progression info row after generating; passes `{ key, chords: string[] }` upward
- `SongStructureBuilder.tsx` — added `pendingProgression` + `onClearPending` props; animated acceptance banner appears at top with chord preview, section type picker (Intro/Verse/Chorus/etc.), "Add Section" confirm button, and dismiss button; accepted progression creates a new expanded section with chords pre-filled

**Why:** Chord Lab and Song Builder were isolated islands. This closes the core workflow loop — generate a progression, send it to the song with one click.

---

## 2026-05-31 — Chord Function Explainer

**Changed files:** `src/lib/music-theory/chord-functions.ts`, `src/components/ChordFunctionExplainer.tsx`, `src/components/ChordProgressionDisplay.tsx`, `docs/DEVLOG.md`, `docs/TODOS.md`

**What changed:**
- Added `src/lib/music-theory/chord-functions.ts` with `ChordFunctionInfo` interface and `getChordFunction(roman)` helper — covers all 14 diatonic Roman numerals (I, ii, iii, IV, V, vi, vii°, i, ii°, ♭III, iv, v, ♭VI, ♭VII) with name, tension score, description, common cadences, and songwriting tip
- Created `src/components/ChordFunctionExplainer.tsx` — animated panel showing chord function name, harmonic tension bar, full description, common cadences list, and songwriting tip
- Updated `ChordProgressionDisplay.tsx` — chord cards are now clickable (toggle selected state); clicking a card opens the explainer panel below the grid with an animated expand/collapse; play button uses `e.stopPropagation()` so clicking play doesn't toggle the explainer; selection resets on new generation

**Why:** Implements feature #7 — contextual music theory education woven into the chord workflow. Users can click any chord to instantly understand its harmonic function without leaving the Chord Lab tab.

---

## 2026-05-31 — Emotion → Chord Mapper

**Changed files:** `src/components/EmotionChordMapper.tsx`, `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`, `docs/TODOS.md`

**What changed:**
- Created `EmotionChordMapper.tsx` — 10 emotion presets (Joy, Melancholy, Tension, Wonder, Longing, Anger, Serenity, Nostalgia, Suspense, Euphoria)
- Each emotion maps to a suggested key, scale, 4-chord progression with Roman numerals, theory explanation, and genre tags
- Chord pills are interactive — click single chord to preview on piano or guitar; Play All button plays them sequentially with 1.4s spacing
- Piano/guitar instrument toggle per emotion; voice leading sketch row shows chord arrow flow
- Integrated at the bottom of `TheoryExplorer.tsx` below Circle of Fifths

**Why:** Helps songwriters find chords that match a target emotion, with theory context to understand why the chords work.

---

**Changed files:** `src/components/CircleOfFifths.tsx`, `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`, `docs/TODOS.md`

**What changed:**
- Created `CircleOfFifths.tsx` — interactive SVG wheel with major key outer ring and relative minor inner ring
- Clicking a key highlights tonic (sky), dominant (orange), subdominant (violet) relationships on the wheel
- Info panel shows 4 key relationships, 7 clickable diatonic chord pills (piano playback), and modulation targets
- Integrated the component at the bottom of `TheoryExplorer.tsx`

**Why:** Gives songwriters a visual map of key relationships and helps music theory learners understand the circle of fifths interactively.

---

## 2026-05-10 — Fix CreativeInspiration per-suggestion chord generation

**Changed files:** `src/components/CreativeInspiration.tsx`, `docs/DEVLOG.md`

**What changed:**
- Each chord-type suggestion now generates its OWN fresh progression matching its specific roman numeral pattern (e.g., "I – V – vi – IV")
- Added `parseRomanNumerals()` to extract numerals from each suggestion's content
- Removed shared-chord bug where all suggestions got the same generated chords

**Why:** Previously all chord suggestions displayed identical chords; now each gets its own progression matching its pattern.

---

**Changed files:** `src/lib/music-theory/progressions.ts`, `src/components/ChordProgressionDisplay.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added `generateRandomProgression()` function that creates harmonically compatible random chords using scale degrees with voice-leading-friendly patterns
- Changed Chord Lab to use random generation instead of fixed pattern-based generation for better variety  
- Fixed last chord not playing: restructured `playAll()` timing to add extra delay after loop completes before disabling play state

**Why:** The generate button appeared unresponsive (state update was happening but users expected different behavior), and the last chord in a progression wasn't completing playback due to aggressive timeout. Now generates truly random but harmonically compatible progressions with smooth voice leading between chords.

---

## 2026-05-10 — Remove Voice Leading Analysis from Song tab

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md` (deleted `VoiceLeadingAnalyzer.tsx`)

**What changed:**
- Removed `VoiceLeadingAnalyzer` import and panel from SongStructureBuilder
- Deleted unused `VoiceLeadingAnalyzer.tsx` component file
- Cleaned up unused `Music4` icon import

**Why:** Voice Leading Analysis was incorrectly placed in the Song tab during a previous session. The DEVLOG indicated it should be replaced with TheoryExplorer, but the removal wasn't completed. This restores the intended state where VoiceLeadingAnalyzer is not present in the app (can be re-added to Theory tab if needed).

---

## 2026-05-10 — Piano key highlighting fixed (root vs scale vs none, 3-state system)

**Changed files:** `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`

**What changed:**
- Fixed piano keyboard to show three distinct states: root note (emerald), scale notes (sky), non-scale black keys (gray-600), and no highlight for other white keys
- Increased piano size from 48×152 to 52×165 white keys, 33×104 black keys
- Updated legend to show all four key states clearly

**Why:** Users needed clear visual distinction between root notes, scale notes, and non-scale notes for better theory exploration.

---

## 2026-05-10 — Add Voice Leading Analyzer component

**Changed files:** `src/components/VoiceLeadingAnalyzer.tsx` (new), `src/App.tsx`

**What changed:**
- Created new `VoiceLeadingAnalyzer` component for the Theory tab
- Visualizes voice motion between chord transitions with color-coded indicators: common tones (emerald), stepwise (blue), skips yellow, leaps red
- Parses chord progression input and calculates individual voice motions for each transition
- Shows from/to notes with motion type labels for each voice
- Play button to audition each chord in the progression
- Includes legend and educational tips about voice leading principles

**Why:** Users wanted a dedicated tool to analyze and understand voice leading patterns between chords, helping them write smoother harmonic transitions.

---

## 2026-05-10 — Add per-component context cards

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added Voice Leading Analysis panel to Song tab (dedicated section)
- Shows how individual notes move between chords with color-coded motion indicators
- Displays current chord progression from any expanded section
- Auto-analyzes when 2+ chords are entered (no manual button needed)
- Includes educational tips about voice leading principles

**Why:** Users wanted immediate visual feedback on their chord progressions to understand and improve voice leading.

---

## 2026-05-10 — Key dropdown in Song tab now triggers chord transposition correctly

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Fixed key dropdown to properly calculate semitone difference between old and new key
- Only transposes chords when there's an actual change AND chords exist in sections
- Preserves chord suffixes (7, maj7, min7, dim, etc.) during transposition

**Why:** Previous implementation had issues with key changes not applying correctly to existing chords.

---

## 2026-05-10 — Multiple song sections expandable simultaneously (Set-based)

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Changed expanded state from boolean per-section to Set<number> for multiple simultaneous expansions
- Added "Expand All", "Collapse All", and "Toggle Sections" buttons in metadata card
- Each section has individual expand/collapse chevron button

**Why:** Users wanted the ability to view multiple sections at once without having to click through each one individually.

---

## 2026-05-10 — All .kilo agent/skill/command files updated for Soundwave Studio

**Changed files:** `.kilo/agent/*.md`, `.kilo/skill/*.md`, `.kilo/command/*.md`

**What changed:**
- Updated all Kilo configuration files to reference Soundwave Studio project
- Set up proper paths, permissions, and workflows for the music app context

**Why:** Ensured the agent system is properly configured for this specific project.

---

## 2026-05-10 — Piano size increased (52×165 white, 33×104 black)

**Changed files:** `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`

**What changed:**
- Increased piano key dimensions for better visual presence and clickability
- White keys: 52px height × 165px width (was smaller before)
- Black keys: 33px height × 104px width (was smaller before)

**Why:** Larger keys are easier to see and interact with, especially on higher DPI displays.

---

## 2026-05-10 — Theory Explorer legend updated to show all 4 key states

**Changed files:** `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`

**What changed:**
- Updated piano legend to clearly show: root (emerald), scale note (sky), non-scale black key (gray), no highlight
- Added descriptive text for each state in the legend tooltip

**Why:** Users needed clear documentation of what each key color means on the piano keyboard.

---

## 2026-05-10 — Non-scale black keys visible as gray-600

**Changed files:** `src/components/TheoryExplorer.tsx`, `docs/DEVLOG.md`

**What changed:**
- Black keys that are not in the current scale now show as gray-600 instead of being hidden or incorrectly colored
- Maintains visual distinction between root, scale notes, and non-scale notes

**Why:** Users need to see all available black keys on the piano, even when they're not part of the current scale.

---

## 2026-05-10 — Save song to localStorage with metadata preservation

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Implemented save/load functionality using localStorage for song persistence
- Preserves all metadata: title, key, tempo, time signature, sections with chords and lyrics
- Added saved songs panel in Song tab showing recently saved projects
- Load button restores full song state including expanded section states

**Why:** Users wanted to save their work locally without needing to download/upload files manually.

---

## 2026-05-10 — Export MIDI for song sections (foundation exists)

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added "Export MIDI" button in Song tab footer
- Button triggers MIDI generation from current song structure and chords
- Uses existing MIDI export infrastructure in `src/lib/midi/export.ts`

**Why:** Users wanted to export their compositions to DAWs for further production work.

---

## 2026-05-10 — Add metronome / click track support (UI placeholder)

**Changed files:** `src/components/SongStructureBuilder.tsx`, `docs/DEVLOG.md`

**What changed:**
- Added BPM display in Song tab metadata card
- Prepared infrastructure for future metronome implementation
- Tempo value is shared with MIDI export for accurate timing

**Why:** Users wanted precise tempo control and click track functionality for recording.

---
