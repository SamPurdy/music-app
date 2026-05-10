# Soundwave Studio — Developer Log

> **Instructions for local model:** After completing a session of changes, append a new entry at the TOP of this file (below this header) using the template below. Keep entries concise — bullet points only. This log helps you catch up on recent changes without reading every file.

---

## 2026-05-10 — Add per-component context cards

**Changed files:** `docs/context/chord-progression.md` (new), `docs/context/guitar-lab.md`, `.github/instructions/codebase.instructions.md`, `docs/QUICK_REF.md`

**What changed:**
- Created `docs/context/chord-progression.md` — full context card for `ChordProgressionDisplay.tsx` covering state, progression shape, audio playback pattern, quality styles, and watch-outs
- Expanded `docs/context/guitar-lab.md` — added dedicated sub-sections for `GuitarChordDiagram.tsx` (props, size table, visual encoding, string numbering) and `GuitarFretboard.tsx` (props, tuning constants, dot colors, note calculation, audio on click)
- Added **Context Cards** table to `codebase.instructions.md` — maps every component file to its card so the local model knows exactly which doc to read before touching a component
- Added same table to `docs/QUICK_REF.md` for mid-session reference

**Why:** Local model was reading full 300–400 line component files when a 50-line card is enough. Cards reduce context usage by ~80% per component and highlight the specific gotchas that cause bugs.

---



**Changed files:** `src/components/DevErrorBoundary.tsx` (new), `src/main.tsx`, `index.html`, `src/vite-env.d.ts` (new), `package.json`, `.github/instructions/codebase.instructions.md`

**What changed:**
- Added `DevErrorBoundary` class component — wraps app in dev mode only, shows full-screen error panel with stack trace and component stack when a React render error occurs
- Added `window.onerror` / `unhandledrejection` toast overlay in `index.html` — catches runtime JS errors outside React and shows a visible badge in the bottom-right corner (dev/localhost only)
- Added `npm run dev:log` script — pipes dev server output (including HMR errors) to `dev.log` so the model can inspect it with `tail dev.log`
- Created `src/vite-env.d.ts` with Vite client types reference (was missing; fixes `import.meta.env` TypeScript errors)
- Expanded `codebase.instructions.md` with the **Safe Edit Protocol**: read → state intent → minimal change → verify → check import chain; added "UI changes not appearing" debugging checklist

**Why:** Local model often makes changes that silently fail (TypeScript error, wrong file, missing import) with no visible feedback. These tools make failures visible on-screen so the model can iterate without DevTools access.

---

## 2026-05-10 — Disable auto-push in AGENTS.md

**Changed files:** `AGENTS.md`

**What changed:**
- Updated convention from "After changes: append entry to `docs/DEVLOG.md`, then commit + push" to "After changes: append entry to `docs/DEVLOG.md`, then commit (no auto-push)"

**Why:** Auto-push behavior was unwanted. Agents should now commit changes locally and wait for manual push by user.

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

## 2026-05-10 — Key dropdown transposition fix

**Changed files:** `src/components/SongStructureBuilder.tsx`

**What changed:**
- Fixed key dropdown onChange handler: changed `onChange={() => handleKeyChange(songKey)}` to `onChange={(e) => handleKeyChange(e.target.value)}`

**Why:** Previous code passed current `songKey` as the oldKey parameter, making diff always 0 and preventing any transpose. Now it correctly passes the newly selected key so diff is calculated properly.

---

## 2026-05-10 — Auto transpose chords on key change (fixed)


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
