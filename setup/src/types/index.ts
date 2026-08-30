/**
 * src/types/index.ts — Single source of truth for all shared TypeScript interfaces.
 *
 * RULES:
 *   - All interfaces that are used in more than one file live here.
 *   - Component-specific prop types can be defined inline in the component file.
 *   - Never use `any` — if you don't know the type yet, use `unknown` and narrow it.
 *
 * ADDING TYPES:
 *   - Add new shared interfaces/types here.
 *   - Import with: import type { MyType } from '@/types'
 *     (The barrel import works because of the `paths` alias in tsconfig.json.)
 */

// ─── Navigation ──────────────────────────────────────────────────────────────

/**
 * A single top-level navigation tab shown in the header.
 * Used by App.tsx to render the tab bar.
 *
 * TODO: Extend with an `icon` field (LucideIcon) once you add icons to tabs.
 */
export interface Tab {
  /** Unique string identifier — used as the key and for routing */
  id: string
  /** Human-readable label shown in the tab button */
  label: string
}

// ─── API / Data fetching ──────────────────────────────────────────────────────

/**
 * Generic wrapper for API responses.
 * Use this as the return type of any function that fetches remote data.
 *
 * Example:
 *   async function fetchUser(id: string): Promise<ApiResponse<User>> { ... }
 *
 * TODO: Extend with pagination fields if your API is paginated.
 */
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  /** HTTP status code, if available */
  status?: number
}

// ─── UI state ─────────────────────────────────────────────────────────────────

/**
 * Represents the loading state of any async operation.
 * Use with useState to track fetch / mutation status.
 *
 * Example:
 *   const [status, setStatus] = useState<LoadingState>('idle')
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// ─── TODO: Add your domain types below ───────────────────────────────────────
// As you build out the app, add your feature-specific interfaces here.
// For example:
//
// export interface User {
//   id: string
//   name: string
//   email: string
//   createdAt: string
// }
//
// export interface Product {
//   id: string
//   name: string
//   price: number
//   imageUrl: string
// }
