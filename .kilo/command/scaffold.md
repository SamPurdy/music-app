---
description: Add a new tab, component, or feature to Soundwave Studio
agent: music-dev
---

Add a new feature or component to Soundwave Studio:

**IMPORTANT**: The project already exists — do NOT re-initialize or scaffold from scratch.

Steps to add a new tab/component:
1. Create the component in `src/components/NewComponent.tsx`
2. Add the tab to the tab list in `src/App.tsx`
3. Add any music theory logic to `src/lib/music-theory/`
4. Add any audio logic to `src/lib/audio/synth.ts`
5. Style using Tailwind with `studio-*` color tokens from `tailwind.config.js`

Before starting:
- Read `ARCHITECTURE.md` to understand the existing structure
- Check `docs/DEVLOG.md` for recent changes

Usage: /scaffold [feature description]

Examples:
- /scaffold Add a metronome component to the Song tab
- /scaffold Add a Circle of Fifths visualization to Theory tab
- /scaffold Add MIDI export functionality for song sections
