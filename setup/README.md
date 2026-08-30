# React + TypeScript + Vite + Tailwind Boilerplate

A production-ready starter kit for front-end web apps, pre-configured with
a local-model-friendly AI agent workflow.

---

## Stack Overview

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.3 | Type safety |
| [Vite](https://vitejs.dev/) | 5 | Dev server + bundler |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 11 | Animations |
| [Lucide React](https://lucide.dev/) | latest | Icon library |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | latest | Conditional class utility (`cn()`) |
| [Vitest](https://vitest.dev/) | 1 | Unit testing |

**Dev server:** http://localhost:3000

---

## Quick Start

```bash
# Install dependencies
npm install

# Customize the boilerplate (one-time, interactive wizard)
npm run init

# Start the dev server
npm run dev
# → http://localhost:3000

# Type-check without building
npm run typecheck

# Production build
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test
```

---

## Customization Checklist

Work through this list top-to-bottom when setting up a new project.
Each item links to the file you need to edit.

### 1. Rename the project in `package.json`
```json
{
  "name": "my-app"  // ← change to your project name (lowercase, hyphens)
}
```

### 2. Update the app title and meta in `index.html`
```html
<title>My App</title>
<meta name="description" content="My App — description here" />
<meta name="theme-color" content="#0b0e14" />  <!-- match your app-bg color -->
```

### 3. Set your color palette in `tailwind.config.js`
The entire app uses `app-*` color tokens. Change the hex values once here
and every component updates automatically:
```js
app: {
  bg: '#0b0e14',       // ← your darkest background color
  surface: '#0e1219',  // ← card / panel color
  accent: '#6366f1',   // ← your brand's primary interactive color
  // ... see tailwind.config.js for full token list
}
```
See `tailwind.config.js` for the full list with comments explaining each token.

### 4. Update `AGENTS.md` — Project Overview section
Find the "📋 Project Overview" section in `AGENTS.md` and replace the placeholder:
```
**[Your App Name]** — [One sentence description]
```
This is the first thing any AI agent reads when starting a session.

### 5. Update `docs/QUICK_REF.md`
- Change the Stack line to reflect your actual tech
- Fill in the "Tab → Component Map" table as you build components

### 6. Build your first real component
- Create `src/components/YourFeature.tsx`
- Replace the placeholder tab in `src/App.tsx` that maps to it
- Create a context card: `docs/context/your-feature.md` (use the template in `docs/context/README.md`)
- Add the card to the tables in `docs/QUICK_REF.md` and `.github/instructions/codebase.instructions.md`

### 7. Activate the git hook (one-time, per clone)
```bash
git config core.hooksPath .githooks
```
This adds a pre-commit warning when you commit `src/` changes without updating `docs/HANDOFF.md`.

---

## Local Model / AI Agent Setup

This boilerplate is designed to work with local AI models running through
[LM Studio](https://lmstudio.ai/) or any OpenAI-compatible server,
as well as cloud models via GitHub Copilot CLI.

### Recommended LM Studio parameters
These settings work well for most 7B–14B instruction-tuned models:

| Setting | Value | Notes |
|---|---|---|
| Context length | 32768 | More is better — docs and code take tokens |
| Temperature | 0.3–0.5 | Lower = more predictable code edits |
| Max tokens | 2048–4096 | Enough for a full component |
| Concurrent predictions | 1 | Avoids state corruption on multi-step tasks |

> Model choice is up to you — these parameters work across most instruction models.
> Larger context window = fewer "I forgot what we were doing" problems.

### Starting a session
Use the built-in `/start-session` prompt (defined in `.github/prompts/start-session.prompt.md`):

1. Open GitHub Copilot Chat in VS Code
2. Type `/start-session` and press Enter
3. The model reads HANDOFF → DEVLOG → TODOS → checks build health → suggests tasks

---

## Agent Workflow

This project follows a structured session workflow optimized for local models:

```
Session start
    ↓
/start-session → reads HANDOFF + DEVLOG + TODOS + build check
    ↓
User picks a task
    ↓
Agent reads context card → reads source file → makes minimal change
    ↓
Agent runs: npm run build  (TypeScript error check)
    ↓
Agent updates: TODOS → DEVLOG → HANDOFF
    ↓
Agent STOPS and shows changed files — waits for user approval
    ↓
User reviews → git add → git commit → git push
```

**Why this matters for local models:**
Local models have limited context windows and can't open browser DevTools.
The workflow is designed to:
- Minimize context usage (read cards, not full files)
- Make errors visible on-screen (error toast + DevErrorBoundary)
- Prevent runaway changes (STOP before committing)
- Preserve session state (HANDOFF.md) across context resets

---

## File Structure Reference

```
├── index.html                           # Entry HTML + dev error toast script
├── package.json                         # Dependencies + scripts
├── vite.config.ts                       # Vite config — @/ alias, port 3000
├── tailwind.config.js                   # Color tokens (app-*) + animations
├── tsconfig.json                        # TS config — strict, path aliases
├── postcss.config.js                    # Tailwind + autoprefixer
├── AGENTS.md                            # AI agent instructions (read this first)
├── build-pwsh.bat                       # Windows: builds pwsh.exe shim (one-time)
├── pwsh_shim.go                         # Source for the pwsh.exe shim
│
├── .githooks/
│   └── pre-commit                       # HANDOFF.md reminder hook
│
├── .github/
│   ├── instructions/
│   │   └── codebase.instructions.md    # Auto-injected rules for src/** edits
│   └── prompts/
│       └── start-session.prompt.md     # /start-session slash command
│
├── .kilo/
│   └── command/
│       ├── start-session.md            # Kilo Code session-start command
│       └── handoff.md                  # Kilo Code session-end command
│
├── scripts/
│   └── init.cjs                        # Interactive setup wizard (npm run init)
│
├── src/
│   ├── main.tsx                         # Entry — mounts React + DevErrorBoundary
│   ├── App.tsx                          # Root component — tab shell
│   ├── index.css                        # Tailwind directives + global styles
│   ├── vite-env.d.ts                    # Vite type references
│   │
│   ├── components/
│   │   └── DevErrorBoundary.tsx         # Dev-only render error overlay
│   │
│   ├── lib/
│   │   └── utils.ts                     # cn(), formatDate(), sleep(), debounce()
│   │
│   └── types/
│       └── index.ts                     # All shared TypeScript interfaces
│
└── docs/
    ├── HANDOFF.md                       # Session handoff — read first each session
    ├── DEVLOG.md                        # Running change log — append after changes
    ├── QUICK_REF.md                     # Mid-session quick reference
    ├── TODOS.md                         # Prioritised task list
    └── context/
        ├── README.md                    # Context card template + instructions
        ├── schemas.md                   # Data schemas + API shapes
        └── example-component.md        # Example filled-in card (delete when ready)
```
