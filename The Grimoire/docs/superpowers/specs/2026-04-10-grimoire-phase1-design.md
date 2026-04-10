# The Grimoire — Phase 1 Design Spec

**Date:** 2026-04-10
**Phase:** 1 — Foundation
**Status:** Approved

---

## Overview

Phase 1 establishes the complete foundation: project scaffold, Supabase auth + schema, Zustand state, navigation shell, and the Hub home screen with pixel art character. No quest, treasury, or workout logic is built in this phase — those sections are stubbed as placeholder screens.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Fast DX, native PWA support via plugin |
| PWA | vite-plugin-pwa (Workbox) | Precache shell, offline fallback |
| Backend | Supabase | Auth, Postgres, real-time (future) |
| State | Zustand | Minimal boilerplate, no Provider wrapping |
| Routing | React Router v6 | Nested routes, loader pattern for auth guard |
| Styling | CSS Modules + CSS custom properties | No runtime overhead, pixel-perfect control |
| Font | Press Start 2P (Google Fonts) | Pixel RPG aesthetic |

---

## Project Structure

```
src/
  app/
    main.tsx              # Vite entry, React root
    App.tsx               # Router setup, providers
    router.tsx            # Route definitions
  components/
    layout/
      AppShell.tsx        # Wraps all authenticated screens
      TabBar.tsx          # Fixed bottom 5-tab bar
      QuickAddButton.tsx  # Central ⊕ button (modal placeholder)
    hub/
      HubScreen.tsx       # Hub page component
      CharacterCanvas.tsx # Canvas pixel art character
      XPBar.tsx           # Gold gradient XP bar
      StatBadge.tsx       # Individual stat row (icon + bar + value)
      StatsPanel.tsx      # Scrollable 2-col stats grid
      SummaryCards.tsx    # Streak / quests today / gold row
    auth/
      LoginScreen.tsx     # Magic link email entry
      OnboardingScreen.tsx # First-login username setup
    ui/
      ProgressBar.tsx     # Reusable themed progress bar
      Modal.tsx           # Base modal (used by QuickAdd)
  stores/
    authStore.ts          # Session, user object, sign-out
    userStore.ts          # Username, level, xp, streak, stats
  lib/
    supabase.ts           # Supabase client singleton
    constants.ts          # XP thresholds per level, stat metadata
  types/
    index.ts              # User, UserStats, StatKey, StatValues
  styles/
    global.css            # CSS custom properties, reset, scrollbar
    tokens.css            # Color palette, typography scale
public/
  sprites/
    warrior-idle.png      # 192×48px, 4 frames at 48×48px each
  manifest.json           # PWA manifest
  icons/                  # 192px + 512px app icons
```

---

## Supabase Schema

### Table: `users`

Mirrors `auth.users` via an `on_auth_user_created` trigger.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | FK → `auth.users.id` |
| `username` | `text` | Set during onboarding, unique |
| `avatar_url` | `text` | Nullable, reserved for Phase 6 |
| `created_at` | `timestamptz` | Default `now()` |

### Table: `user_stats`

One row per user. Stats stored as JSONB in Phase 1; will be split to per-row in Phase 5 when decay logic is introduced.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` | FK → `users.id`, unique |
| `level` | `int` | Default 1 |
| `xp` | `int` | Default 0 |
| `xp_to_next` | `int` | Computed from level (see constants) |
| `streak_count` | `int` | Default 0 |
| `last_active_date` | `date` | Updated on any action |
| `stats` | `jsonb` | `{ strength: 0, intelligence: 0, … }` — all 11 stats |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

### RLS Policies

- `users`: SELECT/UPDATE own row only (`auth.uid() = id`)
- `user_stats`: SELECT/UPDATE own row only (`auth.uid() = user_id`)

---

## Auth Flow

1. User visits app → `authStore` checks Supabase session
2. No session → redirect to `/login`
3. `/login`: email input → `supabase.auth.signInWithOtp({ email })` → magic link sent
4. Magic link click → Supabase callback → session established → `onAuthStateChange` fires
5. Check `users` table for username:
   - No username → redirect to `/onboarding`
   - Username exists → redirect to `/hub`
6. `/onboarding`: set username → INSERT into `users` → INSERT into `user_stats` (defaults) → redirect to `/hub`

Auth state lives in `authStore`. All routes except `/login` and `/onboarding` wrapped in `<AuthGuard>` component that reads from the store.

---

## Navigation Architecture

5 routes, all rendered inside `<AppShell>` (which renders `<TabBar>`):

| Route | Component | Tab |
|---|---|---|
| `/` → redirect | — | — |
| `/login` | `LoginScreen` | No tab bar |
| `/onboarding` | `OnboardingScreen` | No tab bar |
| `/hub` | `HubScreen` | Hub (active on load) |
| `/quests` | `QuestsPlaceholder` | Quests |
| `/add` | — | ⊕ tab click opens `<QuickAddModal>`, no route change, no URL update |
| `/vault` | `VaultPlaceholder` | Vault |
| `/character` | `CharacterPlaceholder` | Char |

Tab bar is fixed, respects `env(safe-area-inset-bottom)` for iPhone notch/home indicator.

The ⊕ button does not navigate — it opens a modal. In Phase 1 the modal shows a "Coming soon" message. Phase 2+ fills it with quest/expense/workout quick-add.

---

## Hub Screen

Vertical layout, single scroll container:

```
┌─────────────────────────┐
│ status bar              │
│ PLAYERNAME         LV 7 │  ← top bar
├─────────────────────────┤
│                         │
│    [character canvas]   │  ← 160×180px canvas, 2× scale
│    IRON WARD            │
│    WARRIOR · PRESTIGE   │
├─────────────────────────┤
│ EXPERIENCE  340/500     │
│ ████████████░░░░░░░     │  ← XP bar
├─────────────────────────┤
│  [streak]  [quests]  [gold] │  ← 3-card summary row
├─────────────────────────┤
│ ATTRIBUTES              │
│ ⚔ STRENGTH  ████░  12  │  ← scrollable stats grid
│ ◈ INTELL.   ████░   8  │    2 columns
│ …                       │
├─────────────────────────┤
│  ⌂    ≡   [⊕]   ◈   ⚔  │  ← tab bar
└─────────────────────────┘
```

### Character Canvas (`CharacterCanvas.tsx`)

- `<canvas>` element, `width=96 height=96` (CSS pixels), internal resolution 48×48 via 2× scale (`canvas.width = 96`, draw at 2× transform)
- Spritesheet: `public/sprites/warrior-idle.png` — 4 frames × 48px wide × 48px tall = 192×48px source, single row
- `imageSmoothingEnabled = false` on 2d context for pixel-crisp rendering
- Animation loop: `setInterval(500ms)` advances `frameIndex` 0→1→2→3→0
- `useEffect` cleanup cancels interval on unmount
- Phase 4: additional spritesheets for walk, attack, level-up burst

### XP Bar

- Input: `xp` and `xp_to_next` from `userStore`
- Gold gradient fill: `linear-gradient(90deg, #8b6b20, #c9a84c, #e8d090)`
- Animated on mount via CSS transition (`width` from 0 to fill %)
- Glint shimmer on the leading edge via pseudo-element

### Stats Panel

- `overflow-y: auto` on the stats section container
- 2-column CSS grid
- Each stat has its own bar color (defined in `constants.ts` per stat)
- Values read from `userStore.stats` (all zero in Phase 1 for new users)

---

## Zustand Stores

### `authStore`

```ts
interface AuthStore {
  session: Session | null
  loading: boolean
  setSession: (s: Session | null) => void
  signOut: () => Promise<void>
}
```

Initialised in `App.tsx` via `supabase.auth.onAuthStateChange`.

### `userStore`

```ts
interface UserStore {
  username: string
  level: number
  xp: number
  xpToNext: number
  streakCount: number
  lastActiveDate: string | null
  stats: Record<StatKey, number>
  fetchUserData: (userId: string) => Promise<void>
  setStats: (stats: Record<StatKey, number>) => void
}
```

`fetchUserData` called once after auth resolves. Reads from `user_stats` row. All mutation functions added in Phases 2–5.

---

## PWA Configuration

`vite-plugin-pwa` with Workbox `generateSW` strategy:

- **Precache:** `index.html`, all JS/CSS chunks, `warrior-idle.png`, manifest icons
- **Runtime cache:** Supabase API calls — NetworkFirst with 5s timeout, fallback to cache
- **Offline fallback:** Full app shell renders from cache; Supabase calls fail gracefully with stale data shown
- **Manifest:**
  - `display: standalone`
  - `orientation: portrait`
  - `theme_color: #0a0c14`
  - `background_color: #0a0c14`

---

## CSS Design Tokens

```css
/* tokens.css */
--color-bg:         #07090f;
--color-surface:    #0a0c14;
--color-surface-2:  #0e1020;
--color-border:     #13162a;
--color-border-2:   #1e2448;
--color-gold:       #c9a84c;
--color-gold-dim:   #8b6b20;
--color-gold-bright:#e8d090;
--color-text:       #8899cc;
--color-text-dim:   #4a5070;
--color-text-muted: #2a3050;
--font-pixel:       'Press Start 2P', monospace;
--safe-bottom:      env(safe-area-inset-bottom, 0px);
```

---

## Error Handling

- Supabase errors on auth: display inline message below email input
- `fetchUserData` failure: show retry button on Hub (data won't render)
- Missing spritesheet: canvas renders empty (no crash); sprite load error logged
- No global error boundary in Phase 1 — added in Phase 3 when complexity warrants it

---

## Out of Scope (Phase 1)

- Quest creation, completion, XP awarding
- Expense logging or budget categories
- Workout logging or muscle group mapping
- Stat decay or synergy title calculation
- Inventory or cosmetics
- The Chronicle, Oracle, Mood logging
- Voice log
- Push notifications
- Any real-time Supabase subscription

---

## Definition of Done

- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] App installs as PWA on iPhone Safari (add to home screen)
- [ ] Magic link auth works end-to-end (sign in → onboarding → hub)
- [ ] Hub renders character animation, XP bar, streak, stats (all zeros for new user)
- [ ] Tab bar navigates between hub / quests / vault / character stubs
- [ ] App loads from cache with no network (offline shell)
- [ ] No Supabase keys in source code (env vars only)
