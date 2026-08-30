#!/usr/bin/env node
/**
 * init.js — Interactive project setup wizard
 *
 * Walks through every boilerplate customization step-by-step in the terminal
 * and rewrites the relevant config / doc files in one pass.
 *
 * Uses ONLY Node.js built-ins (readline, fs, path, child_process).
 * No npm install required to run this script.
 *
 * Usage:
 *   npm run init          (recommended)
 *   node scripts/init.js  (alternative)
 *
 * Safe to re-run — the script reads the current file state before writing,
 * so running it a second time simply overwrites the previous answers.
 */

'use strict';

const readline    = require('readline');
const fs          = require('fs');
const path        = require('path');
const { execSync } = require('child_process');

// ─── Project root ─────────────────────────────────────────────────────────────
// __dirname is setup/scripts/ — root is one level up
const ROOT = path.resolve(__dirname, '..');

// ─── ANSI terminal colours ────────────────────────────────────────────────────
// These work in Git Bash, macOS Terminal, and Windows Terminal.
// If colours look broken, set NO_COLOR=1 in your environment.
const NO_COLOR = process.env.NO_COLOR || process.env.TERM === 'dumb';
const C = NO_COLOR
  ? { reset:'', bold:'', dim:'', green:'', yellow:'', blue:'', cyan:'', red:'', white:'' }
  : {
      reset:  '\x1b[0m',
      bold:   '\x1b[1m',
      dim:    '\x1b[2m',
      green:  '\x1b[32m',
      yellow: '\x1b[33m',
      blue:   '\x1b[34m',
      cyan:   '\x1b[36m',
      red:    '\x1b[31m',
      white:  '\x1b[37m',
    };

// Logging helpers
const ok   = (msg) => console.log(`  ${C.green}✓${C.reset} ${msg}`);
const warn = (msg) => console.log(`  ${C.yellow}⚠${C.reset} ${msg}`);
const fail = (msg) => console.log(`  ${C.red}✗${C.reset} ${msg}`);
const note = (msg) => console.log(`  ${C.dim}${msg}${C.reset}`);
const step = (n, total, title) => {
  console.log('');
  console.log(`${C.bold}${C.cyan}Step ${n}/${total} — ${title}${C.reset}`);
  console.log('─'.repeat(52));
  console.log('');
};

// ─── Background theme presets ─────────────────────────────────────────────────
// Each preset defines the full set of background-related color tokens.
// The user picks one, and the wizard writes all values to tailwind.config.js.
const BG_PRESETS = [
  {
    label:       'Dark Slate    #0b0e14  (default — near-black, blue-grey tint)',
    bg:          '#0b0e14',
    surface:     '#0e1219',
    surface2:    '#131922',
    border:      'rgba(255,255,255,0.08)',
    borderHover: 'rgba(255,255,255,0.16)',
    text:        '#e2e8f0',
    muted:       '#64748b',
  },
  {
    label:       'Dark Navy     #0a0f1e  (deep blue-black)',
    bg:          '#0a0f1e',
    surface:     '#0f1628',
    surface2:    '#162035',
    border:      'rgba(255,255,255,0.08)',
    borderHover: 'rgba(255,255,255,0.16)',
    text:        '#e2e8f0',
    muted:       '#64748b',
  },
  {
    label:       'Dark Zinc     #09090b  (pure near-black, neutral)',
    bg:          '#09090b',
    surface:     '#18181b',
    surface2:    '#27272a',
    border:      'rgba(255,255,255,0.08)',
    borderHover: 'rgba(255,255,255,0.16)',
    text:        '#e4e4e7',
    muted:       '#71717a',
  },
  {
    label:       'Dark Charcoal #111110  (warm dark)',
    bg:          '#111110',
    surface:     '#1c1c1a',
    surface2:    '#262624',
    border:      'rgba(255,255,255,0.08)',
    borderHover: 'rgba(255,255,255,0.16)',
    text:        '#eeeeec',
    muted:       '#6f6f6b',
  },
  {
    label:       'Custom        — enter your own hex values',
    custom:      true,
  },
];

// ─── Accent color presets ─────────────────────────────────────────────────────
// The accent color is used for buttons, active states, highlights, and links.
const ACCENT_PRESETS = [
  { label: 'Indigo  #6366f1   (professional, versatile — default)', hex: '#6366f1' },
  { label: 'Sky     #38bdf8   (tech, creative, airy)',               hex: '#38bdf8' },
  { label: 'Violet  #8b5cf6   (premium, creative)',                  hex: '#8b5cf6' },
  { label: 'Emerald #10b981   (fresh, positive, growth)',            hex: '#10b981' },
  { label: 'Rose    #f43f5e   (bold, energetic)',                    hex: '#f43f5e' },
  { label: 'Amber   #f59e0b   (warm, attention-grabbing)',           hex: '#f59e0b' },
  { label: 'Custom  — enter your own hex',                          custom: true  },
];

// ─── Utility functions ────────────────────────────────────────────────────────

/** Read a file relative to the project root. */
function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

/** Write a file relative to the project root. */
function writeFile(relPath, content) {
  fs.writeFileSync(path.join(ROOT, relPath), content, 'utf8');
}

/** Returns true if `str` is a valid 6-digit hex color (#rrggbb). */
function isValidHex(str) {
  return /^#[0-9a-fA-F]{6}$/.test(str);
}

/**
 * Converts a display name to a valid package.json name:
 * lowercase letters, numbers, and hyphens only.
 * Example: "My Cool App" → "my-cool-app"
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Returns today's date as YYYY-MM-DD (local time). */
function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Lightens a #rrggbb hex color by adding `amount` to each RGB channel.
 * Used to auto-derive surface / surface-2 from a custom background color.
 */
function lightenHex(hex, amount) {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── readline prompt helpers ──────────────────────────────────────────────────

/**
 * Ask a free-text question. Returns the user's answer, or `defaultValue`
 * if they press Enter without typing anything.
 */
function ask(rl, question, defaultValue = '') {
  return new Promise((resolve) => {
    const dflt   = defaultValue ? ` ${C.dim}[${defaultValue}]${C.reset}` : '';
    const prompt = `  ${question}${dflt} › `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * Ask the user to pick from a numbered menu.
 * Prints each option, then prompts for a number.
 * Returns the 0-based index of the selection.
 *
 * @param {readline.Interface} rl
 * @param {string}             question
 * @param {Array}              options   — each item must have a `.label` string
 * @param {number}             defaultIdx — 0-based default selection
 */
async function askMenu(rl, question, options, defaultIdx = 0) {
  options.forEach((opt, i) => {
    // Highlight the default choice with a cyan arrow
    const marker = i === defaultIdx
      ? `${C.cyan}❯${C.reset} ${C.bold}`
      : '  ';
    const reset = i === defaultIdx ? C.reset : '';
    console.log(`  ${marker}${i + 1}. ${opt.label ?? opt}${reset}`);
  });
  console.log('');

  const raw = await ask(rl, question, String(defaultIdx + 1));
  const idx = parseInt(raw, 10) - 1;

  if (isNaN(idx) || idx < 0 || idx >= options.length) {
    warn(`Invalid choice — using default (${defaultIdx + 1})`);
    return defaultIdx;
  }
  return idx;
}

/**
 * Ask a yes/no question.
 * Returns true for yes, false for no.
 */
async function askYN(rl, question, defaultYes = true) {
  const hint   = defaultYes ? 'Y/n' : 'y/N';
  const answer = await ask(rl, `${question} (${hint})`, defaultYes ? 'y' : 'n');
  return answer.toLowerCase().startsWith('y');
}

// ─── File update functions ────────────────────────────────────────────────────
// Each function reads the current file, makes targeted replacements, and
// writes it back. They never touch lines that aren't related to the change.

/**
 * Update package.json — sets the "name" field.
 * All other fields (dependencies, scripts, etc.) are preserved exactly.
 */
function updatePackageJson(slug) {
  const json  = JSON.parse(readFile('package.json'));
  json.name   = slug;
  writeFile('package.json', JSON.stringify(json, null, 2) + '\n');
}

/**
 * Update index.html — replaces:
 *   <title>
 *   meta[name=description] content
 *   meta[name=theme-color] content
 *   body style background color
 */
function updateIndexHtml(displayTitle, description, bgHex) {
  let html = readFile('index.html');

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${displayTitle}</title>`
  );
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${description}$2`
  );
  html = html.replace(
    /(<meta name="theme-color" content=")[^"]*(")/,
    `$1${bgHex}$2`
  );
  // Inline body background (prevents flash of white before React mounts)
  html = html.replace(
    /background:\s*#[0-9a-fA-F]{3,8};/,
    `background: ${bgHex};`
  );

  writeFile('index.html', html);
}

/**
 * Update tailwind.config.js — replaces the color token hex values.
 * Uses exact string matching on each token line so that surrounding
 * comments and unrelated settings are never touched.
 */
function updateTailwindConfig(theme) {
  let css = readFile('tailwind.config.js');

  // Simple token → value replacements
  const replacements = [
    ["bg: '#0b0e14'",          `bg: '${theme.bg}'`],
    ["surface: '#0e1219'",     `surface: '${theme.surface}'`],
    ["'surface-2': '#131922'", `'surface-2': '${theme.surface2}'`],
    ["accent: '#6366f1'",      `accent: '${theme.accent}'`],
    ["text: '#e2e8f0'",        `text: '${theme.text}'`],
    ["muted: '#64748b'",       `muted: '${theme.muted}'`],
  ];
  for (const [from, to] of replacements) {
    css = css.replace(from, to);
  }

  // Border uses rgba() — handle separately with a regex
  css = css.replace(
    /border:\s*'rgba\(255,255,255,0\.08\)'/,
    `border: '${theme.border}'`
  );
  css = css.replace(
    /'border-hover':\s*'rgba\(255,255,255,0\.16\)'/,
    `'border-hover': '${theme.borderHover}'`
  );

  writeFile('tailwind.config.js', css);
}

/**
 * Update AGENTS.md — replaces the placeholder project overview with the
 * user's app name, description, and tech stack line.
 */
function updateAgentsMd(displayTitle, description, stack) {
  let md = readFile('AGENTS.md');

  // Replace placeholder name + description line
  md = md.replace(
    '**[Your App Name]** — [One sentence description of what this app does.]',
    `**${displayTitle}** — ${description}`
  );

  // Replace the stack line that appears directly below it
  md = md.replace(
    'React 18 + TypeScript + Vite + Tailwind CSS. No backend. Dev server: `npm run dev` → http://localhost:3000.',
    `${stack.trimEnd()} Dev server: \`npm run dev\` → http://localhost:3000.`
  );

  writeFile('AGENTS.md', md);
}

/**
 * Update docs/DEVLOG.md — replaces the YYYY-MM-DD placeholder date
 * in the initial entry with today's actual date and the project name.
 */
function updateDevlog(displayTitle) {
  let md = readFile('docs/DEVLOG.md');
  md = md.replace(
    '## YYYY-MM-DD — Initial boilerplate setup',
    `## ${today()} — Initial setup: ${displayTitle}`
  );
  writeFile('docs/DEVLOG.md', md);
}

/**
 * Update docs/QUICK_REF.md — prepends the project display name
 * to the Stack section so agents immediately know which project they're on.
 */
function updateQuickRef(displayTitle) {
  let md = readFile('docs/QUICK_REF.md');
  md = md.replace(
    'React 18 + TS + Vite + Tailwind CSS. No backend.',
    `**${displayTitle}** — React 18 + TS + Vite + Tailwind CSS. No backend.`
  );
  writeFile('docs/QUICK_REF.md', md);
}

/**
 * Update docs/HANDOFF.md — stamps the project name into the initial state
 * so the first /start-session knows what project it's working on.
 */
function updateHandoff(displayTitle) {
  let md = readFile('docs/HANDOFF.md');
  md = md.replace(
    '_No active session. Start fresh from README.md and DEVLOG._',
    `_Fresh project: **${displayTitle}**. No prior sessions. Start from README.md and DEVLOG._`
  );
  writeFile('docs/HANDOFF.md', md);
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

async function main() {
  const TOTAL_STEPS = 6;

  // Print banner
  console.log('');
  console.log(`${C.bold}${C.cyan}╔══════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║   React + TS + Vite + Tailwind  Setup Wizard    ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════╝${C.reset}`);
  console.log('');
  console.log(`  Customizes the boilerplate for your specific project.`);
  console.log(`  ${C.dim}Press Enter to accept the default shown in [brackets].${C.reset}`);
  console.log(`  ${C.dim}Safe to re-run — reads current state before writing.${C.reset}`);

  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  });

  // Collect all answers before making any file changes
  const answers = {};

  // ── Step 1: Project identity ────────────────────────────────────────────────
  step(1, TOTAL_STEPS, 'Project identity');
  console.log('  These values appear in the browser tab, meta tags, and agent docs.');
  console.log('');

  answers.displayTitle = await ask(rl, 'App display title (shown in browser tab)', 'My App');
  answers.slug = await ask(
    rl,
    'Package name        (lowercase, hyphens only)',
    slugify(answers.displayTitle)
  );
  answers.description = await ask(
    rl,
    'Short description   (1 sentence for meta tags + AGENTS.md)',
    `${answers.displayTitle} — a modern web application`
  );

  // ── Step 2: Tech stack ──────────────────────────────────────────────────────
  step(2, TOTAL_STEPS, 'Tech stack (for AGENTS.md)');
  console.log('  This line appears in AGENTS.md to tell AI agents what the project uses.');
  console.log('  Add any extra libraries beyond the base stack (e.g. Zustand, React Query).');
  console.log('');

  answers.stack = await ask(
    rl,
    'Tech stack line',
    'React 18 + TypeScript + Vite + Tailwind CSS. No backend.'
  );

  // ── Step 3: Background theme ────────────────────────────────────────────────
  step(3, TOTAL_STEPS, 'Background / dark theme');
  console.log('  Sets app-bg, app-surface, app-surface-2, and border color tokens.');
  console.log('');

  const bgIdx  = await askMenu(rl, 'Choose a background theme', BG_PRESETS, 0);
  let bgTheme  = { ...BG_PRESETS[bgIdx] };

  if (bgTheme.custom) {
    console.log('');
    // Ask for background hex — validate it
    let customBg = '';
    while (!isValidHex(customBg)) {
      customBg = await ask(rl, 'Background color hex (#rrggbb)', '#0b0e14');
      if (!isValidHex(customBg)) fail('Must be a 6-digit hex color, e.g. #1a2030');
    }

    // Auto-derive surface and surface-2 by lightening each channel slightly.
    // The user can always fine-tune these values in tailwind.config.js afterwards.
    bgTheme = {
      bg:          customBg,
      surface:     lightenHex(customBg, 5),
      surface2:    lightenHex(customBg, 12),
      border:      'rgba(255,255,255,0.08)',
      borderHover: 'rgba(255,255,255,0.16)',
      text:        '#e2e8f0',
      muted:       '#64748b',
    };

    console.log('');
    note(`Auto-derived:  surface → ${bgTheme.surface},  surface-2 → ${bgTheme.surface2}`);
    note('Fine-tune these in tailwind.config.js at any time.');
  }

  // ── Step 4: Accent color ────────────────────────────────────────────────────
  step(4, TOTAL_STEPS, 'Accent color');
  console.log('  Used for primary buttons, active tabs, focus rings, and highlights.');
  console.log('');

  const accentIdx = await askMenu(rl, 'Choose an accent color', ACCENT_PRESETS, 0);
  let accentHex   = ACCENT_PRESETS[accentIdx].hex;

  if (!accentHex) {
    // User chose "Custom"
    console.log('');
    while (!isValidHex(accentHex)) {
      accentHex = await ask(rl, 'Accent color hex (#rrggbb)', '#6366f1');
      if (!isValidHex(accentHex)) fail('Must be a 6-digit hex color, e.g. #6366f1');
    }
  }

  // Merge accent into the theme object
  answers.theme = { ...bgTheme, accent: accentHex };

  // ── Step 5: Git setup ───────────────────────────────────────────────────────
  step(5, TOTAL_STEPS, 'Git setup');

  const isGitRepo = fs.existsSync(path.join(ROOT, '.git'));

  if (isGitRepo) {
    note('A .git directory already exists — skipping git init.');
    answers.gitInit = false;
  } else {
    answers.gitInit = await askYN(rl, 'Initialize a new git repository?', true);
  }

  console.log('');
  console.log('  The pre-commit hook warns you when you commit src/ changes');
  console.log('  without updating docs/HANDOFF.md. It never hard-blocks a commit.');
  console.log('');
  answers.gitHook = await askYN(rl, 'Activate the HANDOFF.md pre-commit warning hook?', true);

  // ── Step 6: Install dependencies ────────────────────────────────────────────
  step(6, TOTAL_STEPS, 'Dependencies');

  const nodeModulesExists = fs.existsSync(path.join(ROOT, 'node_modules'));

  if (nodeModulesExists) {
    note('node_modules already exists — skipping npm install.');
    answers.npmInstall = false;
  } else {
    console.log('');
    answers.npmInstall = await askYN(rl, 'Run npm install now?', true);
  }

  rl.close();

  // ── Apply all changes ───────────────────────────────────────────────────────
  console.log('');
  console.log(`${C.bold}Applying changes…${C.reset}`);
  console.log('');

  const changed = [];
  const failed  = [];

  /**
   * Run `fn()` and log success/failure.
   * All file writes go through here so errors don't stop the whole wizard.
   */
  function apply(label, fn) {
    try {
      fn();
      ok(label);
      changed.push(label);
    } catch (e) {
      fail(`${label} — ${e.message}`);
      failed.push(label);
    }
  }

  apply(`package.json          — name: "${answers.slug}"`, () =>
    updatePackageJson(answers.slug));

  apply('index.html            — title, description, theme-color', () =>
    updateIndexHtml(answers.displayTitle, answers.description, answers.theme.bg));

  apply('tailwind.config.js    — color tokens', () =>
    updateTailwindConfig(answers.theme));

  apply('AGENTS.md             — project overview', () =>
    updateAgentsMd(answers.displayTitle, answers.description, answers.stack));

  apply('docs/DEVLOG.md        — initial entry date', () =>
    updateDevlog(answers.displayTitle));

  apply('docs/QUICK_REF.md     — project name', () =>
    updateQuickRef(answers.displayTitle));

  apply('docs/HANDOFF.md       — initial state', () =>
    updateHandoff(answers.displayTitle));

  // Git init
  if (answers.gitInit) {
    apply('git init', () =>
      execSync('git init', { cwd: ROOT, stdio: 'pipe' }));
  }

  // Activate pre-commit hook
  if (answers.gitHook) {
    apply('git config core.hooksPath .githooks', () => {
      // Make the hook executable on Unix/Git Bash (chmod is a no-op on Windows)
      const hookPath = path.join(ROOT, '.githooks', 'pre-commit');
      try { fs.chmodSync(hookPath, 0o755); } catch (_) { /* skip on Windows */ }
      execSync('git config core.hooksPath .githooks', { cwd: ROOT, stdio: 'pipe' });
    });
  }

  // npm install
  if (answers.npmInstall) {
    console.log('');
    console.log(`  ${C.cyan}Running npm install…${C.reset}`);
    try {
      execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
      ok('npm install complete');
      changed.push('node_modules/');
    } catch (e) {
      fail('npm install failed — run it manually after setup');
      failed.push('npm install');
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('');
  console.log('─'.repeat(52));
  console.log(`${C.bold}${C.green}Setup complete!${C.reset}`);
  console.log('─'.repeat(52));
  console.log('');
  console.log(`  ${C.bold}Project:${C.reset}     ${answers.displayTitle}  ${C.dim}(${answers.slug})${C.reset}`);
  console.log(`  ${C.bold}Accent:${C.reset}      ${accentHex}`);
  console.log(`  ${C.bold}Background:${C.reset}  ${answers.theme.bg}  →  surface ${answers.theme.surface}`);
  console.log('');

  if (failed.length > 0) {
    console.log(`  ${C.yellow}Some steps had errors — fix manually:${C.reset}`);
    failed.forEach(f => console.log(`    ${C.red}•${C.reset} ${f}`));
    console.log('');
  }

  // Next step guidance
  console.log(`  ${C.bold}Next steps:${C.reset}`);
  console.log('');

  let stepNum = 1;

  if (!answers.npmInstall && !nodeModulesExists) {
    console.log(`    ${C.cyan}${stepNum++}.${C.reset} npm install`);
  }

  console.log(`    ${C.cyan}${stepNum++}.${C.reset} npm run dev`);
  console.log(`       ${C.dim}→ http://localhost:3000${C.reset}`);

  console.log('');
  console.log(`    ${C.cyan}${stepNum++}.${C.reset} Open ${C.cyan}AGENTS.md${C.reset} and verify the project overview looks right`);
  console.log(`    ${C.cyan}${stepNum++}.${C.reset} Open ${C.cyan}docs/TODOS.md${C.reset} and plan your first features`);
  console.log(`    ${C.cyan}${stepNum++}.${C.reset} Replace the placeholder tabs in ${C.cyan}src/App.tsx${C.reset} with real components`);
  console.log(`    ${C.cyan}${stepNum++}.${C.reset} Create context cards in ${C.cyan}docs/context/${C.reset} as you build`);
  console.log(`         ${C.dim}(template: docs/context/README.md)${C.reset}`);

  console.log('');
  console.log(`  Start an AI coding session any time:`);
  console.log(`    ${C.cyan}/start-session${C.reset} in GitHub Copilot Chat`);
  console.log('');
}

// Run and handle top-level errors
main().catch((e) => {
  console.error(`\n${C.red}Setup wizard failed:${C.reset} ${e.message}`);
  process.exit(1);
});
