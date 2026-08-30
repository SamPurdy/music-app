# Context Cards -- Usage Guide

Context cards are compact (~50 line) reference files for individual components or modules.
Instead of reading a full 300-400 line source file, the AI agent reads the card first and
only opens the source file if it needs to make actual edits.

---

## Why Context Cards?

A local 7B-9B model with a 32K context window can hold roughly 8-10 files before performance
degrades. Cards let the model reference many components in a single session without hitting
that limit. They also encode project-specific gotchas that the model cannot infer from code alone.

---

## What Goes In a Card

| Section | What to Include |
|---|---|
| **Props** | Full TypeScript interface with inline explanations |
| **State** | Key useState / useReducer shapes |
| **Imports** | Exact import paths the component needs |
| **Key Patterns** | Recurring call patterns (API calls, data transforms) |
| **Watch Out** | Bugs that have occurred before, gotchas, non-obvious behavior |

See `example-component.md` for a filled-in template.

---

## Cards In This Project

| Component / Module | Card File |
|---|---|
| _(add your components here)_ | _(e.g. `docs/context/my-component.md`)_ |
| Data schemas + API shapes | `docs/context/schemas.md` |

The instructions in `.github/instructions/codebase.instructions.md` tell the agent:

> Before reading a source file, check `docs/context/` for a matching card.
> Read the card first. Only open the source file if you need to make actual code changes.

This saves 80%+ of the tokens that would otherwise be spent parsing full component files.

---

## Writing a New Card

1. Copy `example-component.md` -> `docs/context/<your-component>.md`
2. Fill in Props, State, Imports, Key Patterns, Watch Out
3. Add a row to the table above
4. Add a row to the Context Cards table in `docs/QUICK_REF.md`