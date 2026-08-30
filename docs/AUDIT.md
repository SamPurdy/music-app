# Soundwave Studio — Code Audit Report

I have conducted a thorough review of the codebase for **Soundwave Studio** and identified several critical bugs, non-functional placeholders, and opportunities for architectural improvements. Below is a structured summary of the findings, along with proposed technical solutions.

---

## 🔴 Critical Bugs & Non-Functional Features

### 1. Completely Non-Functional MIDI Export
- **File(s):** [SongStructureBuilder.tsx](file:///c:/Coding%20Projects/Music%20App/src/components/SongStructureBuilder.tsx#L563-L565), [ChordProgressionDisplay.tsx](file:///c:/Coding%20Projects/Music%20App/src/components/ChordProgressionDisplay.tsx#L230-L235), and [export.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/midi/export.ts)
- **Description:** The "Export MIDI" buttons in the **Song Editor** and **Chord Lab** have no `onClick` handlers and do nothing. Furthermore, the library helper `generateMidiFromProgression` in `export.ts` is just a skeleton returning a custom JSON object. It does not interface with `@tonejs/midi` (which is in `package.json` but unused) to build binary MIDI data and trigger a file download.
- **Impact:** Users are unable to export their chord progressions or songs to DAWs, rendering a key feature listed in the devlogs non-functional.
- **Proposed Fix:** 
  1. Rewrite [export.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/midi/export.ts) to use `@tonejs/midi` (`new Midi()`, `track.addNote(...)`), convert it to a `Uint8Array`, wrap it in a `Blob`, and trigger a file download.
  2. Wire up the `onClick` actions in both components to parse the active progression and trigger the export.

### 2. Broken `noteToMidi` and `midiToNote` in `notes.ts`
- **File(s):** [notes.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/music-theory/notes.ts#L13-L32)
- **Description:** `NOTE_NAMES` contains 16 notes (including sharp and flat duplicates like `'Db'`, `'Eb'`, etc.) instead of a standard 12-semitone chromatic scale:
  ```ts
  export const NOTE_NAMES = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'] as const
  ```
  - In `noteToMidi(note, octave)`, finding the index of a note like `'D'` yields `3`, making `noteToMidi('D', 4)` evaluate to `63` (D# / Eb) instead of `62` (D).
  - In `midiToNote(midi)`, doing `midi % 12` restricts the returned note names to indices `0–11`, making `'B'` (index 15) completely unreachable.
- **Impact:** While these helpers are not actively called in the existing front-end layout, they are core library functions. Any future feature that relies on them will introduce pitch-shifting bugs.
- **Proposed Fix:** Redefine `NOTE_NAMES` to be the standard 12 sharp notes, and normalise incoming flats using a mapping object (e.g. `FLAT_TO_SHARP`). Better yet, delegate directly to Tonal.js's native `Note.midi(note)` and `Note.fromMidi(midi)` methods.

### 3. Broken `transposeChord` for Negative Intervals in `chords.ts`
- **File(s):** [chords.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/guitar/chords.ts#L123-L137)
- **Description:** Transposing a chord name downwards (with negative semitones) results in `notes[(idx + semitones) % 12]`. Because JavaScript's `%` operator calculates the remainder rather than the mathematical modulo, it returns negative values for negative dividends. For instance, transposing C (`idx = 0`) down 1 semitone gives `-1`, resulting in `notes[-1]` which returns `"undefined"`.
- **Impact:** Transposing chords downward in the guitar viewer results in invalid chord names like `"undefined"`.
- **Proposed Fix:** Modify the transposition modulo to handle negative values properly:
  ```ts
  const newIdx = ((idx + semitones) % 12 + 12) % 12;
  return notes[newIdx] + suffix;
  ```

### 4. Incorrect Minor Key Analysis in Roman Numeral Helpers
- **File(s):** [notes.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/music-theory/notes.ts#L55-L69) and [progressions.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/music-theory/progressions.ts#L177-L190)
- **Description:** `getRomanNumeral` and `analyzeProgression` assume the scale is always major by hardcoding `${key} major` and looking up degrees in `MAJOR_ROMANS`.
- **Impact:** If the user is in a minor key (e.g. A Minor) and inputs diatonic minor chords like `Am` (i), `Dm` (iv), and `Em` (v), the system analyzes them in A Major. It outputs `I` (for `Am`), `IV` (for `Dm`), and `V` (for `Em`), which is incorrect.
- **Proposed Fix:** Update the functions to accept an optional `scaleType` or mode parameter (`'major' | 'minor'`) and dynamically select the correct scale context (`${key} minor`) and Roman numeral map (`MINOR_ROMANS`).

---

## 🟡 UI & UX Enhancements

### 5. Completely Hardcoded Right Sidebar ("Harmonic Context")
- **File(s):** [App.tsx](file:///c:/Coding%20Projects/Music%20App/src/App.tsx#L23-L32) and [App.tsx](file:///c:/Coding%20Projects/Music%20App/src/App.tsx#L182-L213)
- **Description:** The right sidebar displaying the "Harmonic Context" (Key, Scale, Degree, Mode, Parallel, etc.) is fed from a completely static, hardcoded array (`HARMONIC_CONTEXT` mapping to C Major).
- **Impact:** Changing the song key or generating progressions in other modes/genres does not update the right sidebar. It remains frozen on C Major, which is confusing and breaks immersion.
- **Proposed Fix:** Calculate these values dynamically based on `songMeta` or the currently active tab context and generate the sidebar list items programmatically using Tonal.js.

### 6. Limited Chord Extensions Playback in `playProgression`
- **File(s):** [synth.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/audio/synth.ts#L140-L184)
- **Description:** `playProgression` delegates to `buildTriad` to construct notes. However, `buildTriad` only accepts `isMinor` and builds standard major or minor triads. It ignores extensions like `maj7`, `m7`, `sus4`, `dim`, or `add9`.
- **Impact:** An advanced suggestion in the **Inspiration** tab like `Cmaj7` is played back as a simple `C` major triad (`C-E-G`), and `Cdim` is played back as a minor triad (`C-Eb-G` instead of `C-Eb-Gb`).
- **Proposed Fix:** Rewrite `buildTriad` to use the existing library function `getChordNotes(chordName)` which queries Tonal.js, and map those notes to appropriate octaves dynamically.

---

## 🟢 Code Quality & Duplication (DRY)

### 7. Duplicated Transposition Logic
- **File(s):** [SongStructureBuilder.tsx](file:///c:/Coding%20Projects/Music%20App/src/components/SongStructureBuilder.tsx#L31-L41), [GuitarLab.tsx](file:///c:/Coding%20Projects/Music%20App/src/components/GuitarLab.tsx#L483-L487), and [chords.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/guitar/chords.ts#L123-L137)
- **Description:** Transposition functions are re-implemented multiple times with slightly different logic.
- **Proposed Fix:** Define a single robust `transposeChordName` in `src/lib/music-theory/notes.ts` (using Tonal.js or a robust chromatic modulo), and import it wherever transposition is required.

### 8. Duplicated Flat-to-Sharp Mappings
- **File(s):** [synth.ts](file:///c:/Coding%20Projects/Music%20App/src/lib/audio/synth.ts#L5-L7), [SongStructureBuilder.tsx](file:///c:/Coding%20Projects/Music%20App/src/components/SongStructureBuilder.tsx#L29), and [GuitarLab.tsx](file:///c:/Coding%20Projects/Music%20App/src/components/GuitarLab.tsx#L474)
- **Description:** The `FLAT_TO_SHARP` mapping object is defined as a local constant in three separate files.
- **Proposed Fix:** Move it to a single shared utility in `src/lib/music-theory/notes.ts` and export it.
