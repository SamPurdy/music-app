---
name: start-session
description: "Load project context for a new coding session. Run this at the start of every session to orient yourself on the codebase state."
---

# Session Start — Soundwave Studio

You are working on **Soundwave Studio**, a professional music theory and songwriting web app.

## Step 1: Read architecture reference
Read `ARCHITECTURE.md` in the project root. This is your primary codebase map — component props, lib exports, data flow, and common pitfalls.

## Step 2: Check recent changes
Read `docs/DEVLOG.md` (top entries only). This tells you what changed in recent sessions so you don't repeat work or break recent fixes.

## Step 3: Confirm current state
Run `npm run build 2>&1 | tail -20` to verify the project currently builds clean. Report any errors before proceeding.

## Step 4: Understand the task
Ask the user what they want to work on today. Reference `ARCHITECTURE.md` to identify which files are relevant before touching anything.

## Step 5: After completing changes
- Verify the build still passes: `npm run build`
- Append a new entry at the TOP of `docs/DEVLOG.md` summarizing what you changed and why
- Commit: `git add -A && git commit -m "description" && git push`
