# Soundwave Studio — Project Instructions

> **Read `ARCHITECTURE.md` first every session.** It is the definitive codebase map.
> **Then check `docs/DEVLOG.md`** for recent changes before touching any code.

---

## 1. Project Identity
**Soundwave Studio** — Professional music theory and songwriting web app.
- Pure frontend: React 19 + TypeScript + Vite + Tailwind CSS
- **No backend, no Python, no FastAPI** — everything runs in the browser
- Audio: Tone.js (piano samples + Karplus-Strong guitar synthesis)
- Music theory: Tonal.js library
- Dev server: `npm run dev` → http://localhost:5173

---

## 2. Shell & Terminal
- **ALWAYS use Git Bash syntax** — no PowerShell, no CMD
- Use `&&` for chaining, `$VAR` for variables, `/` in paths
- Package manager: `npm` only (not yarn, not pnpm)

## 3. Key Commands
```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run build   # verify — then STOP and show user changed files for review
```

---

## 4. App Tabs
| Tab | Component | Purpose |
|-----|-----------|---------|
| Song | `SongStructureBuilder` | Build sections, write chords/lyrics, save/load JSON, transpose |
| Chord Lab | `ChordProgressionDisplay` | Generate & play chord progressions |
| Inspiration | `CreativeInspiration` | Suggestions by key/genre — clears on change, does NOT append |
| Theory | `TheoryExplorer` | Scale/interval explorer + piano keyboard |
| Guitar Lab | `GuitarLab` | Capo calc, chord diagrams, fretboard, progressions |

---

## 5. Critical Coding Rules
1. Functional components + hooks only — no class components
2. No `any` types — all interfaces explicitly typed
3. Always `twMerge(...)` for conditional Tailwind classes
4. Synth calls are async — always `.catch(() => {})` on fire-and-forget
5. **`PianoKeyboard` `scaleNotes` prop must NOT include root** — filter at call site:
   `scaleNotes={noteIndices.filter(n => n !== rootIdx)}`
6. `SCALES[key].intervals` does NOT include 0 — root is always implied
7. All music theory calcs in `src/lib/music-theory/` only
8. All audio playback via `src/lib/audio/synth.ts` only

---

## 6. Design System (Tailwind tokens)
```
studio-bg       #090c12   Page background
studio-surface  #0e1219   Cards/panels
studio-border   rgba(255,255,255,0.08)
studio-text     #e2e8f0   Primary text
studio-muted    #64748b   Secondary text
studio-accent   #38bdf8   Sky blue — root note, primary CTA
studio-purple   #8b5cf6   Scale notes, secondary accent
studio-success  #10b981   Success states
studio-pink     #ec4899   Tertiary accent
```

---

## 7. Note Index System (0–11, chromatic)
| 0 | 1  | 2 | 3  | 4 | 5 | 6  | 7 | 8  | 9 | 10 | 11 |
|---|----|----|----|----|---|----|----|----|----|----|----|
| C | C# | D | D# | E | F | F# | G | G# | A | A# | B  |

White keys: [0,2,4,5,7,9,11] — Black keys: [1,3,6,8,10]

---

## 8. After Making Changes
1. Verify build: `npm run build`
2. Append entry to `docs/DEVLOG.md` (template is at the top of that file)
3. **Stop — do NOT commit.** Show the user a summary of changed files and wait for explicit approval before running any `git` command.
