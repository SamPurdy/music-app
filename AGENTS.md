# Music App - AGENTS.md

## ⚡ Shell & Command Execution Setup

> **One-time setup required** — the Copilot CLI needs a `pwsh.exe` on PATH.
> This project ships a Git Bash shim. Run this **once** in any terminal:
>
> ```bat
> # In the project root (cmd, Git Bash, or PowerShell):
> build-pwsh.bat
> ```
>
> Requirements: [Go](https://go.dev/dl/) + [Git for Windows](https://git-scm.com)  
> After running, restart VS Code. The shim routes all agent shell commands through Git Bash.
>
> **Alternative**: Install [PowerShell 7+](https://aka.ms/powershell) directly (`winget install Microsoft.PowerShell`).

### Shell Rules for Agents
- **Always use Bash syntax** — no `cmd.exe` or PowerShell idioms
- Use `&&` for chaining, `$VAR` for variables, forward slashes for paths
- Package manager: `npm` (not yarn or pnpm)
- Git: standard git CLI via bash

---

## Project Overview
**Soundwave Studio** — Professional music theory and songwriting web app.
React 19 + TypeScript + Vite + Tailwind CSS + Tone.js + Tonal.js.

> **📖 For codebase context, read `ARCHITECTURE.md` first.**
> **📝 For recent changes, read `docs/DEVLOG.md`.**
> **🚀 To start a session, use the `/start-session` prompt.**

## Project Structure
```
src/
  App.tsx                         # Tab shell (song/chords/inspiration/theory/guitar)
  components/                     # React UI components
  lib/
    audio/synth.ts                # Tone.js audio playback
    music-theory/                 # scales, intervals, notes, progressions, voice-leading
    guitar/chords.ts              # Guitar voicings + transposeChord()
    songwriting/song.ts           # Song/section CRUD
    midi/export.ts                # MIDI generation
    ableton/                      # Link sync + OSC (optional integration)
  types/index.ts                  # All TypeScript interfaces
docs/
  DEVLOG.md                       # Running change log — UPDATE after each session
.github/
  instructions/codebase.instructions.md  # Auto-injected coding context
  prompts/start-session.prompt.md        # /start-session slash command
```

## Conventions
- Functional components with hooks only — no class components
- All interfaces explicitly typed — no `any`
- `twMerge` for all conditional Tailwind class merging
- Music theory calcs only in `src/lib/music-theory/`
- Audio playback only via `src/lib/audio/synth.ts`
- After changes: run `npm run build`, append entry to `docs/DEVLOG.md`, then **stop — do NOT commit**. Show the user a summary of changed files and wait for their approval before any `git` operations.
