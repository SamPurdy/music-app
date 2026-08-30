# My App — AGENTS.md

> **For AI agents and local models working on this project.**
> This file is auto-loaded by GitHub Copilot CLI and similar tools.

---

## ⚡ Shell & Command Execution Setup

> **One-time setup required** — the Copilot CLI needs a `pwsh.exe` on PATH.
> This project ships a Git Bash shim. Run this **once** from the project root:
>
> ```bat
> build-pwsh.bat
> ```
>
> Requirements: [Go](https://go.dev/dl/) + [Git for Windows](https://git-scm.com)
> After running, restart VS Code. The shim routes all agent shell commands through Git Bash.
>
> **Alternative**: Install [PowerShell 7+](https://aka.ms/powershell) directly:
> `winget install Microsoft.PowerShell`

### Shell Rules for Agents
- **Always use Bash syntax** — no `cmd.exe` or PowerShell idioms
- Use `&&` for chaining, `$VAR` for variables, forward slashes for paths
- Package manager: `npm` (not yarn or pnpm)
- Git: standard git CLI via bash

---

## 🔧 Git Hook Setup (one-time, per clone)

This repo ships a pre-commit hook that warns when `src/` changes are committed
without updating `docs/HANDOFF.md`. Activate it once after cloning:

```bash
git config core.hooksPath .githooks
```

The hook is **non-blocking** — it only warns, never hard-stops a commit.
To bypass: `git commit --no-verify`

---

## 📋 Project Overview

> ⚙️ **Customize this section** — replace everything below with your app's details.
> Describe what the app does, the tech stack, and the dev server URL.
> Agents read this to understand the project before doing any work.

**[Your App Name]** — [One sentence description of what this app does.]
React 18 + TypeScript + Vite + Tailwind CSS. No backend. Dev server: `npm run dev` → http://localhost:3000.

> **📖 For detailed codebase context, read `README.md`.**
> **📝 For recent changes, read `docs/DEVLOG.md`.**
> **🚀 To start a coding session, use the `/start-session` prompt.**

---

## 🧙 First-Time Project Setup (one-time, per project)

Run the interactive setup wizard to rename the app, set colors, and customize all boilerplate in one pass:

```bash
npm install
npm run init
```

The wizard walks through every customization step (app name, colors, meta tags, AGENTS.md description) and writes all files for you. Safe to re-run.

---

## 📁 Project Structure

```
src/
  App.tsx                    # Root component — tab shell / page router
  main.tsx                   # Entry point — mounts React + DevErrorBoundary
  index.css                  # Global styles + Tailwind directives
  components/                # Reusable UI components
    DevErrorBoundary.tsx     # Dev-only error boundary (do not remove)
  lib/
    utils.ts                 # cn(), formatDate(), sleep(), debounce()
    # TODO: add domain-specific lib folders here as the app grows
    # e.g. lib/api/, lib/auth/, lib/data/
  types/
    index.ts                 # All shared TypeScript interfaces — single source of truth
docs/
  HANDOFF.md                 # Session handoff — read first, update at end
  DEVLOG.md                  # Running change log — append after each session
  QUICK_REF.md               # Mid-session quick reference
  TODOS.md                   # Prioritised task list
  context/
    README.md                # How to write context cards
    schemas.md               # Data schemas + API shapes (update as you build)
    example-component.md     # Example context card (delete once you add your own)
.github/
  instructions/
    codebase.instructions.md # Auto-injected rules for src/** edits
  prompts/
    start-session.prompt.md  # /start-session slash command
.kilo/
  command/
    start-session.md         # Kilo Code session-start command (mirrors /start-session)
    handoff.md               # Kilo Code session-end command (mirrors /handoff)
.githooks/
  pre-commit                 # HANDOFF.md reminder hook
build-pwsh.bat               # Windows: builds pwsh.exe shim for Copilot CLI (one-time)
pwsh_shim.go                 # Source for the pwsh.exe shim
```

---

## ✅ Conventions

- **Functional components with hooks only** — no class components
  (exception: `DevErrorBoundary` — React requires class components for error boundaries)
- **All interfaces explicitly typed** — no `any` types, ever
- **`cn(...)` for all conditional Tailwind classes** — never string concatenation
  (imported from `@/lib/utils` — wraps `twMerge` + `clsx`)
- **Lib separation**: keep business logic in `src/lib/`, UI only in `src/components/`
- **Types in one place**: all shared interfaces live in `src/types/index.ts`

### After Every Session
1. Run `npm run build` — fix any TypeScript errors before stopping
2. Update `docs/TODOS.md` — mark completed items, add newly discovered ones
3. Append entry to top of `docs/DEVLOG.md`
4. Update `docs/HANDOFF.md` with current state and next steps
5. **STOP — do NOT commit.** Show the user a list of changed files and wait for explicit approval before any `git` command.

---

## 🤖 Kilo / Alternative AI Tool Commands

If you are using [Kilo Code](https://kilocode.ai/) or a similar tool that supports `.kilo/command/` slash commands, this project ships two pre-built commands:

| Command | File | What it does |
|---|---|---|
| `/start-session` | `.kilo/command/start-session.md` | Loads context (HANDOFF → DEVLOG → TODOS → build check) and suggests tasks |
| `/handoff` | `.kilo/command/handoff.md` | Ends the session: build check → update TODOS → append DEVLOG → write HANDOFF |

These mirror the `.github/prompts/` commands used by GitHub Copilot CLI. Use whichever matches your tool.
