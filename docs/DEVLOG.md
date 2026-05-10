# Soundwave Studio — Developer Log

> **Instructions for local model:** After completing a session of changes, append a new entry at the TOP of this file (below this header) using the template below. Keep entries concise — bullet points only. This log helps you catch up on recent changes without reading every file.

---

## Entry Template
```
## YYYY-MM-DD — [Brief title]
**Changed files:** list files
**What changed:**
- bullet point summary of each change
**Why:** one sentence rationale
**Watch out:** any gotchas or follow-up needed
```

---

## 2026-05-10 — Multiple song sections expandable at once

**Changed files:** `src/components/SongStructureBuilder.tsx`

**What changed:**
- Removed `expanded` property from `Section` interface (no longer needed)
- Changed `expandedId` state from single number to `Set<number>` for multiple selections
- Updated `addSection()` to auto-expand new section
- Updated `removeSection()` and click handlers to use Set methods
- Updated DEFAULT_SECTIONS to remove expanded property

**Why:** Users wanted to view multiple sections' chord/lyrics content simultaneously instead of having to toggle between them.

---

## 2026-05-10 — Auto transpose chords on key change (fixed)

**Changed files:** `src/components/SongStructureBuilder.tsx`

**What changed:**
- Simplified auto-transpose logic: removed nested useEffect, now uses synchronous `handleKeyChange()` function
- Key dropdown onChange calls `handleKeyChange(songKey)` which calculates semitone difference and transposes all chords
- Chords automatically update when you select a different key from the dropdown

**Why:** Initial implementation violated React's Rules of Hooks by calling useRef inside useEffect. Fixed with simpler synchronous approach.


**Changed files:** `src/components/PianoKeyboard.tsx`, `src/components/TheoryExplorer.tsx`

**What changed:**
- Rewrote `PianoKeyboard` with 3-state `KeyState` type: `'root' | 'scale' | 'none'`
- Props changed: `highlightedNotes` removed, replaced with `scaleNotes` (root excluded) + `rootNote` (separate)
- Key colors: root=sky-400, scale=violet-500/violet-300, non-scale black=gray-600, non-scale white=white
- Key size increased: white 52×165px, black 33×104px; labels 11px (white), 9px (black)
- `TheoryExplorer` now passes `scaleNotes={noteIndices.filter(n => n !== rootIdx)}` — root excluded at call site
- Legend updated to show all 4 key states

**Why:** Previous `highlightedNotes` prop included the root, causing root to sometimes render as a scale note (both sky blue). Root/scale are now guaranteed mutually exclusive.

**Watch out:** Any other component using `PianoKeyboard` must use the new `scaleNotes` prop (not `highlightedNotes`). Currently only `TheoryExplorer` uses it.

---

## 2026-05-10 — Theory Explorer scale highlighting fix (initial attempt)

**Changed files:** `src/components/PianoKeyboard.tsx`, `src/components/TheoryExplorer.tsx`

**What changed:**
- Changed scale note color from `studio-accent/30` to `studio-purple/30` to distinguish from root

**Why:** Root and scale notes were both sky blue, making the display confusing.

**Watch out:** This was superseded by a full rewrite on the same day (see entry above).

---

## 2026-05-09 — Codebase cleanup, rename to Soundwave Studio, feature additions

**What changed:**
- App renamed from "Music App" to "Soundwave Studio"
- Added `GuitarLab` tab with capo calculator, chord diagrams, fretboard, progression builder
- Added `SongStructureBuilder` with drag-and-drop sections, chords/lyrics per section, save/load JSON, transpose
- Added `CreativeInspiration` tab with genre/key-based suggestions
- Added `TheoryExplorer` with scale/interval display and piano keyboard
- Added `PianoKeyboard` and `GuitarFretboard` interactive components
- Integrated Tone.js audio (piano + guitar sounds)
- Cleaned up unused/duplicate code

---

## 2026-05-08 — Initial UI overhaul and git setup

**What changed:**
- Initialized git repository, pushed to https://github.com/SamPurdy/music-app
- Major UI redesign to professional dark DAW aesthetic
- Established design token system (studio-bg, studio-surface, studio-accent, etc.)
- Set up Git Bash shim (`pwsh_shim.go`) for VS Code terminal
- Added `.gitignore`, `AGENTS.md`, `copilot-instructions.md`
