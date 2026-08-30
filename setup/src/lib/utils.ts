/**
 * src/lib/utils.ts — General-purpose utility functions.
 *
 * This is the standard utilities module for the app.
 * Import from here rather than re-implementing these in individual components.
 *
 * Usage:
 *   import { cn, formatDate, sleep, debounce } from '@/lib/utils'
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── cn() — Tailwind class merging ───────────────────────────────────────────

/**
 * Merges Tailwind CSS class names intelligently.
 *
 * Combines `clsx` (conditional classes) with `twMerge` (conflict resolution).
 * twMerge ensures that conflicting Tailwind utilities are deduplicated correctly —
 * e.g. `cn('p-4', 'p-8')` → `'p-8'` (last wins), not `'p-4 p-8'`.
 *
 * This is the ONLY way to conditionally apply Tailwind classes in this project.
 * Never use string concatenation for Tailwind classes — it breaks deduplication.
 *
 * Examples:
 *   cn('px-4 py-2', isActive && 'bg-app-accent', 'text-sm')
 *   cn('border', { 'border-red-500': hasError, 'border-app-border': !hasError })
 *   cn(baseClasses, props.className)  // safe className passthrough
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── formatDate() ─────────────────────────────────────────────────────────────

/**
 * Formats a Date object or ISO date string into a human-readable string.
 *
 * Examples:
 *   formatDate(new Date())          → "Jan 15, 2025"
 *   formatDate('2025-01-15')        → "Jan 15, 2025"
 *   formatDate(new Date(), 'long')  → "January 15, 2025"
 *
 * @param date   - Date object or ISO 8601 string
 * @param style  - 'short' (default) | 'long' | 'numeric'
 */
export function formatDate(
  date: Date | string,
  style: 'short' | 'long' | 'numeric' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const monthFormat: Record<typeof style, Intl.DateTimeFormatOptions['month']> = {
    short: 'short',
    long: 'long',
    numeric: 'numeric',
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: monthFormat[style],
    day: 'numeric',
  })
}

// ─── sleep() ──────────────────────────────────────────────────────────────────

/**
 * Returns a Promise that resolves after the given number of milliseconds.
 * Useful for adding intentional delays in async flows, animations, or tests.
 *
 * Example:
 *   await sleep(500) // wait 500ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── debounce() ───────────────────────────────────────────────────────────────

/**
 * Returns a debounced version of the given function.
 * The returned function delays invoking `fn` until after `delay` ms have
 * elapsed since the last time it was called.
 *
 * Common use case: debounce a search input so you don't fire on every keystroke.
 *
 * Example:
 *   const handleSearch = debounce((query: string) => fetchResults(query), 300)
 *   <input onChange={(e) => handleSearch(e.target.value)} />
 *
 * Note: For React components, create the debounced function with useMemo or
 * useCallback so it isn't re-created on every render.
 *
 * @param fn    - The function to debounce
 * @param delay - Milliseconds to wait after the last call before invoking fn
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
