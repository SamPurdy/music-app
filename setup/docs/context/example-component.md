# UserProfile — Context Card

> **Example card** — shows every section filled in. Delete this file and replace
> it with cards for your own components.

**File:** `src/components/UserProfile.tsx`
**Used in:** Settings tab → `SettingsPage.tsx`

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| userId | string | ✅ | The authenticated user's ID — used to fetch profile data |
| onSave | `(data: UserProfileData) => void` | ✅ | Callback fired after a successful save |
| readOnly | boolean | ❌ | If true, hides the edit form and shows display-only view (default: false) |

---

## State

| Variable | Type | Description |
|----------|------|-------------|
| profile | `UserProfileData \| null` | Loaded profile data; null while loading or if fetch failed |
| status | `LoadingState` | Current async state: `'idle' \| 'loading' \| 'success' \| 'error'` |
| formValues | `Partial<UserProfileData>` | Controlled form state — synced from `profile` on load |
| errorMessage | `string \| null` | Shown in a red banner below the form if save fails |

---

## Key Behaviors

- On mount, fetches profile data from `GET /api/users/:userId` and populates `formValues`
- The Save button is disabled while `status === 'loading'`
- If `readOnly` is true, the form is never rendered — only `<ProfileDisplay />` is shown
- `onSave` receives the *submitted* form values (not the server response); the parent is responsible for refetching if needed
- Avatar upload is handled separately by `<AvatarUpload />` (not part of this component)

---

## Data Fetching

```ts
// Called once on mount — uses userId prop as the key
const result = await fetchUser(userId)   // returns ApiResponse<UserProfileData>
if (result.error) { setStatus('error'); setErrorMessage(result.error) }
else { setProfile(result.data); setFormValues(result.data ?? {}) }
```

Fetch is NOT re-triggered when `userId` changes (component unmounts/remounts instead).
If you need reactive re-fetching, add `userId` to the useEffect dependency array.

---

## Watch-Outs

- **Do NOT call `onSave` on every keystroke** — it fires only on form submit
- **`formValues` can be `Partial<UserProfileData>`** — always null-check before accessing nested fields
- **`status === 'loading'` should disable the entire form** — not just the button — to prevent partial edits during save
- **Avatar changes do NOT go through this component** — they have their own upload endpoint and must be saved separately before calling `onSave`
