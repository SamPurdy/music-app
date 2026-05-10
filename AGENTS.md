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
Music and songwriting application with built-in music theory, creative inspiration tools, and Ableton integration.

## Tech Stack
- **Frontend**: React + TypeScript (or Electron for desktop)
- **Backend**: Node.js or Python (for music theory engine)
- **Music Theory**: `tonal` (JS) / `music21` (Python)
- **MIDI**: `@tonejs/midi`, `midi-js`
- **Ableton Integration**: Ableton Link, OSC bridge, MIDI export

## Project Structure
```
src/
  components/     # React UI components
  lib/            # Music theory engine, utilities
  types/          # TypeScript types
  music-theory/   # Core theory analysis
  midi/           # MIDI generation/export
  ableton/        # Ableton integration (Link, OSC)
  songwriting/    # Lyric/chord workflow tools
  hooks/          # Custom React hooks
tests/
public/
```

## Key Domains

### Music Theory
- Chord scales, modes, progressions
- Roman numeral analysis
- Voice leading, harmonic tension
- Chord substitutions and extensions

### Songwriting
- Song structure (verse, chorus, bridge, etc.)
- Lyrics with chord overlays
- Tempo, key, time signature
- Creative generation (AI-assisted)

### Ableton Integration
- MIDI clip export
- Ableton Link sync
- OSC communication
- Max for Live companion device

## Conventions
- Use functional components with hooks
- Type all interfaces explicitly
- Music theory calculations in `lib/music-theory/`
- MIDI generation in `lib/midi/`
- Ableton integration in `lib/ableton/`
- Tests for all music theory logic
- No hardcoded frequencies — derive from note data
