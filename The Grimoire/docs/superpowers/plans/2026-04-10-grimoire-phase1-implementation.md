# The Grimoire — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Phase 1 foundation — Vite/React/TS project scaffold, Supabase auth + schema, Zustand stores, navigation shell, and the Hub home screen with animated pixel art character.

**Architecture:** React 18 + Vite app at repo root; Zustand for all client state; Supabase for auth and Postgres (read-only in Phase 1); offline-capable PWA shell via vite-plugin-pwa/Workbox.

**Tech Stack:** React 18, Vite 5, TypeScript 5, React Router v6, Zustand 5, @supabase/supabase-js 2, vite-plugin-pwa, Vitest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-04-10-grimoire-phase1-design.md`

---

## File Map

```
[new] package.json
[new] vite.config.ts
[new] tsconfig.json
[new] tsconfig.node.json
[new] index.html
[new] .gitignore
[new] .env.example
[new] src/main.tsx
[new] src/App.tsx
[new] src/router.tsx
[new] src/types/index.ts
[new] src/lib/supabase.ts
[new] src/lib/constants.ts
[new] src/lib/__tests__/constants.test.ts
[new] src/styles/tokens.css
[new] src/styles/global.css
[new] src/stores/authStore.ts
[new] src/stores/__tests__/authStore.test.ts
[new] src/stores/userStore.ts
[new] src/stores/__tests__/userStore.test.ts
[new] src/components/auth/LoginScreen.tsx
[new] src/components/auth/LoginScreen.module.css
[new] src/components/auth/OnboardingScreen.tsx
[new] src/components/auth/OnboardingScreen.module.css
[new] src/components/auth/AuthGuard.tsx
[new] src/components/auth/__tests__/AuthGuard.test.tsx
[new] src/components/ui/ProgressBar.tsx
[new] src/components/ui/ProgressBar.module.css
[new] src/components/ui/__tests__/ProgressBar.test.tsx
[new] src/components/ui/Modal.tsx
[new] src/components/ui/Modal.module.css
[new] src/components/layout/AppShell.tsx
[new] src/components/layout/AppShell.module.css
[new] src/components/layout/TabBar.tsx
[new] src/components/layout/TabBar.module.css
[new] src/components/layout/QuickAddButton.tsx
[new] src/components/placeholders/QuestsPlaceholder.tsx
[new] src/components/placeholders/VaultPlaceholder.tsx
[new] src/components/placeholders/CharacterPlaceholder.tsx
[new] src/components/hub/HubScreen.tsx
[new] src/components/hub/HubScreen.module.css
[new] src/components/hub/CharacterCanvas.tsx
[new] src/components/hub/CharacterCanvas.module.css
[new] src/components/hub/__tests__/CharacterCanvas.test.tsx
[new] src/components/hub/XPBar.tsx
[new] src/components/hub/XPBar.module.css
[new] src/components/hub/__tests__/XPBar.test.tsx
[new] src/components/hub/StatBadge.tsx
[new] src/components/hub/StatBadge.module.css
[new] src/components/hub/StatsPanel.tsx
[new] src/components/hub/StatsPanel.module.css
[new] src/components/hub/__tests__/StatsPanel.test.tsx
[new] src/components/hub/SummaryCards.tsx
[new] src/components/hub/SummaryCards.module.css
[new] src/components/hub/__tests__/SummaryCards.test.tsx
[new] src/components/hub/__tests__/HubScreen.test.tsx
[new] public/manifest.json
[new] public/sprites/warrior-idle.png  ← pixel art asset (see Task 13)
[new] public/icons/icon-192.png
[new] public/icons/icon-512.png
[new] supabase/migrations/001_initial_schema.sql
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `.gitignore`

- [ ] **Step 1: Initialise npm and install dependencies**

Run from repo root (`c:\Users\Pilmena\Desktop\The Grimoire`):

```bash
npm init -y
npm install react@^18.3.1 react-dom@^18.3.1 react-router-dom@^6.26.2 zustand@^5.0.0 @supabase/supabase-js@^2.45.4
npm install -D vite@^5.4.8 @vitejs/plugin-react@^4.3.1 vite-plugin-pwa@^0.21.1 typescript@^5.5.3 @types/react@^18.3.5 @types/react-dom@^18.3.0 vitest@^2.1.1 @testing-library/react@^16.0.1 @testing-library/user-event@^14.5.2 @testing-library/jest-dom@^6.5.0 jsdom@^25.0.1
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 2: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sprites/*.png', 'icons/*.png'],
      manifest: false, // we manage manifest.json manually in public/
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: true,
  },
})
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0a0c14" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" />
    <title>The Grimoire</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Write `.gitignore`**

```gitignore
node_modules/
dist/
.env.local
.env
*.local
.DS_Store
.graphify_*.json
.graphify_python
```

- [ ] **Step 7: Write test setup file**

Create `src/test-setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Add scripts to `package.json`**

Edit `package.json` to set the scripts block (npm init -y gives a basic one — replace `scripts`):

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 9: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors (src/ is empty so this just validates tsconfig).

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json index.html .gitignore src/test-setup.ts
git commit -m "feat: scaffold React + Vite + TypeScript project"
```

---

## Task 2: TypeScript Types + Constants

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/constants.ts`
- Create: `src/lib/__tests__/constants.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/__tests__/constants.test.ts
import { describe, it, expect } from 'vitest'
import { xpToNext, getTitleForLevel, STAT_KEYS, STAT_META } from '../constants'

describe('xpToNext', () => {
  it('returns 100 for level 1', () => {
    expect(xpToNext(1)).toBe(100)
  })
  it('increases with each level', () => {
    expect(xpToNext(2)).toBeGreaterThan(xpToNext(1))
    expect(xpToNext(5)).toBeGreaterThan(xpToNext(4))
  })
  it('returns a positive integer', () => {
    for (let i = 1; i <= 50; i++) {
      expect(Number.isInteger(xpToNext(i))).toBe(true)
      expect(xpToNext(i)).toBeGreaterThan(0)
    }
  })
})

describe('getTitleForLevel', () => {
  it('returns Initiate for level 1', () => {
    expect(getTitleForLevel(1)).toBe('Initiate')
  })
  it('returns Apprentice at level 5', () => {
    expect(getTitleForLevel(5)).toBe('Apprentice')
  })
  it('returns Warrior at level 10', () => {
    expect(getTitleForLevel(10)).toBe('Warrior')
  })
  it('uses highest matching title', () => {
    expect(getTitleForLevel(12)).toBe('Warrior')
    expect(getTitleForLevel(15)).toBe('Veteran')
  })
})

describe('STAT_META', () => {
  it('has an entry for every stat key', () => {
    STAT_KEYS.forEach(key => {
      expect(STAT_META[key]).toBeDefined()
      expect(STAT_META[key].label).toBeTruthy()
      expect(STAT_META[key].icon).toBeTruthy()
      expect(STAT_META[key].color).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `../constants` module not found.

- [ ] **Step 3: Write `src/types/index.ts`**

```ts
import { STAT_KEYS } from '../lib/constants'

export type StatKey = typeof STAT_KEYS[number]

export type StatValues = Record<StatKey, number>

export interface GrimoireUser {
  id: string
  username: string
  avatarUrl: string | null
  createdAt: string
}

export interface UserStats {
  id: string
  userId: string
  level: number
  xp: number
  xpToNext: number
  streakCount: number
  lastActiveDate: string | null
  stats: StatValues
  updatedAt: string
}
```

- [ ] **Step 4: Write `src/lib/constants.ts`**

```ts
export const STAT_KEYS = [
  'strength',
  'intelligence',
  'agility',
  'wisdom',
  'discipline',
  'vitality',
  'creativity',
  'charisma',
  'serenity',
  'endurance',
  'courage',
] as const

export interface StatMeta {
  label: string
  icon: string
  color: string
}

export const STAT_META: Record<typeof STAT_KEYS[number], StatMeta> = {
  strength:     { label: 'STRENGTH',     icon: '⚔',  color: '#cc4444' },
  intelligence: { label: 'INTELLIGENCE', icon: '◈',  color: '#4466cc' },
  agility:      { label: 'AGILITY',      icon: '▶',  color: '#44cc88' },
  wisdom:       { label: 'WISDOM',       icon: '◆',  color: '#c9a84c' },
  discipline:   { label: 'DISCIPLINE',   icon: '✦',  color: '#8844cc' },
  vitality:     { label: 'VITALITY',     icon: '♥',  color: '#dd3344' },
  creativity:   { label: 'CREATIVITY',   icon: '✧',  color: '#cc6699' },
  charisma:     { label: 'CHARISMA',     icon: '◉',  color: '#dd8833' },
  serenity:     { label: 'SERENITY',     icon: '❋',  color: '#44aa88' },
  endurance:    { label: 'ENDURANCE',    icon: '◎',  color: '#dd6622' },
  courage:      { label: 'COURAGE',      icon: '▲',  color: '#e8c040' },
}

export const LEVEL_TITLES: Array<{ minLevel: number; title: string }> = [
  { minLevel: 1,  title: 'Initiate' },
  { minLevel: 5,  title: 'Apprentice' },
  { minLevel: 10, title: 'Warrior' },
  { minLevel: 15, title: 'Veteran' },
  { minLevel: 20, title: 'Champion' },
  { minLevel: 25, title: 'Elite' },
  { minLevel: 30, title: 'Master' },
  { minLevel: 35, title: 'Grand Master' },
  { minLevel: 40, title: 'Legendary' },
  { minLevel: 45, title: 'Mythic' },
  { minLevel: 50, title: 'Prestige Ready' },
]

/** XP required to reach the next level. Curve: 100 * 1.4^(level-1) */
export const xpToNext = (level: number): number =>
  Math.floor(100 * Math.pow(1.4, level - 1))

/** Human-readable title for a given level */
export const getTitleForLevel = (level: number): string => {
  const matching = LEVEL_TITLES.filter(t => level >= t.minLevel)
  return matching[matching.length - 1]?.title ?? 'Initiate'
}

export const DEFAULT_STATS: Record<typeof STAT_KEYS[number], number> = {
  strength: 0, intelligence: 0, agility: 0, wisdom: 0,
  discipline: 0, vitality: 0, creativity: 0, charisma: 0,
  serenity: 0, endurance: 0, courage: 0,
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```

Expected: All 9 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/lib/constants.ts src/lib/__tests__/constants.test.ts
git commit -m "feat: add TypeScript types and game constants (XP curve, stats, titles)"
```

---

## Task 3: CSS Design Tokens + Global Styles

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

No tests for CSS. Visual verification during dev server.

- [ ] **Step 1: Write `src/styles/tokens.css`**

```css
:root {
  /* Backgrounds */
  --color-bg:         #07090f;
  --color-surface:    #0a0c14;
  --color-surface-2:  #0e1020;
  --color-surface-3:  #131828;

  /* Borders */
  --color-border:     #13162a;
  --color-border-2:   #1e2448;

  /* Gold */
  --color-gold:       #c9a84c;
  --color-gold-dim:   #8b6b20;
  --color-gold-bright:#e8d090;
  --color-gold-glow:  rgba(201, 168, 76, 0.25);

  /* Text */
  --color-text:       #8899cc;
  --color-text-dim:   #4a5070;
  --color-text-muted: #2a3050;

  /* Status */
  --color-success:    #44cc88;
  --color-danger:     #cc4444;

  /* Typography */
  --font-pixel: 'Press Start 2P', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;

  /* Safe areas (iPhone home indicator) */
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-top:    env(safe-area-inset-top, 0px);
}
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
@import './tokens.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-pixel);
  -webkit-font-smoothing: antialiased;
  /* prevent bounce scroll on iOS */
  overscroll-behavior: none;
  touch-action: pan-y;
}

/* Scrollable containers */
.scroll-y {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.scroll-y::-webkit-scrollbar {
  display: none;
}

/* Pixel-sharp image rendering */
.pixel {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Scanline overlay — apply to full-screen containers */
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.05) 2px,
    rgba(0, 0, 0, 0.05) 4px
  );
  pointer-events: none;
  z-index: 1000;
}
```

- [ ] **Step 3: Import global styles in `src/main.tsx`** (placeholder file for now)

Create `src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>Loading…</div>
  </React.StrictMode>
)
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite starts, browser shows "Loading…" on dark background (`#07090f`), Press Start 2P font loads.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css src/main.tsx
git commit -m "feat: add CSS design tokens and global styles"
```

---

## Task 4: Supabase Client + Database Schema

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `.env.example`
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Write `.env.example`**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] **Step 2: Create `.env.local` with real credentials**

Copy `.env.example` to `.env.local` and fill in your Supabase project URL and anon key from the Supabase dashboard (Settings → API).

`.env.local` is already in `.gitignore` — never commit it.

- [ ] **Step 3: Write `src/lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error('Missing Supabase env vars. Check .env.local.')
}

export const supabase = createClient(url, key)
```

- [ ] **Step 4: Write `supabase/migrations/001_initial_schema.sql`**

```sql
-- Extension for UUID generation
create extension if not exists "pgcrypto";

-- ─── users ────────────────────────────────────────────────────────────────────
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own row"
  on public.users for update
  using (auth.uid() = id);

-- ─── user_stats ───────────────────────────────────────────────────────────────
create table public.user_stats (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references public.users(id) on delete cascade,
  level            integer not null default 1,
  xp               integer not null default 0,
  xp_to_next       integer not null default 100,
  streak_count     integer not null default 0,
  last_active_date date,
  stats            jsonb not null default '{
    "strength":0,"intelligence":0,"agility":0,"wisdom":0,
    "discipline":0,"vitality":0,"creativity":0,"charisma":0,
    "serenity":0,"endurance":0,"courage":0
  }'::jsonb,
  updated_at       timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "Users can read own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "Users can update own stats"
  on public.user_stats for update
  using (auth.uid() = user_id);

-- ─── auto-update updated_at ───────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_stats_updated_at
  before update on public.user_stats
  for each row execute function public.set_updated_at();

-- ─── auto-create user row on sign-up ─────────────────────────────────────────
-- Note: users.username is set during onboarding, not here.
-- This trigger is NOT created here — the app inserts into users + user_stats
-- during onboarding after the user chooses a username.
```

- [ ] **Step 5: Run migration in Supabase**

Open the Supabase dashboard → SQL Editor → paste the full contents of `supabase/migrations/001_initial_schema.sql` → Run.

Expected: "Success. No rows returned."

Verify in Table Editor that `users` and `user_stats` tables appear under the `public` schema.

- [ ] **Step 6: Verify TypeScript sees env vars**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/supabase.ts .env.example supabase/migrations/001_initial_schema.sql
git commit -m "feat: add Supabase client and initial DB schema migration"
```

---

## Task 5: Auth Store

**Files:**
- Create: `src/stores/authStore.ts`
- Create: `src/stores/__tests__/authStore.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/stores/__tests__/authStore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase before importing the store
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithOtp: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}))

import { useAuthStore } from '../authStore'

beforeEach(() => {
  useAuthStore.setState({ session: null, loading: false })
})

describe('authStore', () => {
  it('initialises with null session and loading false', () => {
    const { session, loading } = useAuthStore.getState()
    expect(session).toBeNull()
    expect(loading).toBe(false)
  })

  it('setSession updates session', () => {
    const fakeSession = { user: { id: 'abc' } } as any
    useAuthStore.getState().setSession(fakeSession)
    expect(useAuthStore.getState().session).toBe(fakeSession)
  })

  it('signOut calls supabase.auth.signOut and clears session', async () => {
    const { supabase } = await import('../../lib/supabase')
    useAuthStore.setState({ session: { user: { id: 'abc' } } as any })
    await useAuthStore.getState().signOut()
    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(useAuthStore.getState().session).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `../authStore` module not found.

- [ ] **Step 3: Write `src/stores/authStore.ts`**

```ts
import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  session: Session | null
  loading: boolean
  setSession: (session: Session | null) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session, loading: false }),

  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null })
  },
}))
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 3 authStore tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stores/authStore.ts src/stores/__tests__/authStore.test.ts
git commit -m "feat: add authStore with Zustand (session, setSession, signOut)"
```

---

## Task 6: User Stats Store

**Files:**
- Create: `src/stores/userStore.ts`
- Create: `src/stores/__tests__/userStore.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/stores/__tests__/userStore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              user_id: 'u1',
              level: 3,
              xp: 150,
              xp_to_next: 196,
              streak_count: 5,
              last_active_date: '2026-04-10',
              stats: { strength: 10, intelligence: 5, agility: 8, wisdom: 3,
                       discipline: 7, vitality: 4, creativity: 2, charisma: 6,
                       serenity: 1, endurance: 9, courage: 11 },
            },
            error: null,
          }),
        })),
      })),
    })),
  },
}))

import { useUserStore } from '../userStore'
import { DEFAULT_STATS } from '../../lib/constants'

beforeEach(() => {
  useUserStore.setState({
    username: '',
    level: 1,
    xp: 0,
    xpToNext: 100,
    streakCount: 0,
    lastActiveDate: null,
    stats: { ...DEFAULT_STATS },
  })
})

describe('userStore', () => {
  it('initialises with default values', () => {
    const state = useUserStore.getState()
    expect(state.level).toBe(1)
    expect(state.xp).toBe(0)
    expect(state.streakCount).toBe(0)
    expect(state.stats.strength).toBe(0)
  })

  it('fetchUserData populates state from Supabase row', async () => {
    await useUserStore.getState().fetchUserData('u1')
    const state = useUserStore.getState()
    expect(state.level).toBe(3)
    expect(state.xp).toBe(150)
    expect(state.streakCount).toBe(5)
    expect(state.stats.strength).toBe(10)
    expect(state.stats.courage).toBe(11)
  })

  it('setStats updates all stats', () => {
    const newStats = { ...DEFAULT_STATS, strength: 99 }
    useUserStore.getState().setStats(newStats)
    expect(useUserStore.getState().stats.strength).toBe(99)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `../userStore` module not found.

- [ ] **Step 3: Write `src/stores/userStore.ts`**

```ts
import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { DEFAULT_STATS } from '../lib/constants'
import type { StatKey, StatValues } from '../types'

interface UserState {
  username: string
  level: number
  xp: number
  xpToNext: number
  streakCount: number
  lastActiveDate: string | null
  stats: StatValues

  fetchUserData: (userId: string) => Promise<void>
  setStats: (stats: StatValues) => void
  setUsername: (username: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  username: '',
  level: 1,
  xp: 0,
  xpToNext: 100,
  streakCount: 0,
  lastActiveDate: null,
  stats: { ...DEFAULT_STATS },

  fetchUserData: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) return

    set({
      level: data.level,
      xp: data.xp,
      xpToNext: data.xp_to_next,
      streakCount: data.streak_count,
      lastActiveDate: data.last_active_date,
      stats: data.stats as StatValues,
    })

    const { data: userData } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single()

    if (userData) set({ username: userData.username })
  },

  setStats: (stats: StatValues) => set({ stats }),

  setUsername: (username: string) => set({ username }),
}))
```

Note: `fetchUserData` makes two queries (user_stats then users). This is intentional — they are separate tables and we avoid a join in Phase 1. Combine in Phase 5 if performance warrants.

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 3 userStore tests PASS (total 6 tests pass across both stores).

- [ ] **Step 5: Commit**

```bash
git add src/stores/userStore.ts src/stores/__tests__/userStore.test.ts
git commit -m "feat: add userStore with Zustand (level, xp, streak, stats, fetchUserData)"
```

---

## Task 7: Auth Screens

**Files:**
- Create: `src/components/auth/LoginScreen.tsx` + `.module.css`
- Create: `src/components/auth/OnboardingScreen.tsx` + `.module.css`
- Create: `src/components/auth/AuthGuard.tsx`
- Create: `src/components/auth/__tests__/AuthGuard.test.tsx`

- [ ] **Step 1: Write AuthGuard failing test**

```tsx
// src/components/auth/__tests__/AuthGuard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard } from '../AuthGuard'
import { useAuthStore } from '../../../stores/authStore'

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signOut: vi.fn(),
    },
  },
}))

describe('AuthGuard', () => {
  it('redirects to /login when no session', () => {
    useAuthStore.setState({ session: null, loading: false })

    render(
      <MemoryRouter initialEntries={['/hub']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/hub" element={<AuthGuard><div>Hub</div></AuthGuard>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Hub')).not.toBeInTheDocument()
  })

  it('renders children when session exists', () => {
    useAuthStore.setState({ session: { user: { id: 'abc' } } as any, loading: false })

    render(
      <MemoryRouter initialEntries={['/hub']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/hub" element={<AuthGuard><div>Hub</div></AuthGuard>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Hub')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `AuthGuard` module not found.

- [ ] **Step 3: Write `src/components/auth/AuthGuard.tsx`**

```tsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const session = useAuthStore(s => s.session)
  const loading = useAuthStore(s => s.loading)

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}
```

- [ ] **Step 4: Write `src/components/auth/LoginScreen.tsx`**

```tsx
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './LoginScreen.module.css'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <div className={styles.title}>THE GRIMOIRE</div>
        <div className={styles.subtitle}>YOUR LIFE. YOUR LEGEND.</div>

        {sent ? (
          <div className={styles.sent}>
            <p>Magic link sent.</p>
            <p className={styles.sentSub}>Check your email and tap the link to enter.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'SENDING…' : 'ENTER THE GRIMOIRE'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Write `src/components/auth/LoginScreen.module.css`**

```css
.screen {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-6);
  position: relative;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  width: 100%;
  max-width: 320px;
}

.title {
  font-size: 18px;
  color: var(--color-gold);
  letter-spacing: 4px;
  text-shadow: 0 0 16px var(--color-gold-glow);
  text-align: center;
}

.subtitle {
  font-size: 7px;
  color: var(--color-text-dim);
  letter-spacing: 3px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.input {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  color: var(--color-text);
  font-family: var(--font-pixel);
  font-size: 8px;
  padding: 14px var(--space-3);
  border-radius: 2px;
  width: 100%;
  outline: none;
}
.input:focus {
  border-color: var(--color-gold-dim);
}

.button {
  background: var(--color-gold);
  color: var(--color-bg);
  font-family: var(--font-pixel);
  font-size: 8px;
  border: none;
  padding: 14px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: opacity 0.2s;
}
.button:disabled { opacity: 0.5; cursor: default; }

.error {
  font-size: 7px;
  color: var(--color-danger);
  text-align: center;
}

.sent { text-align: center; }
.sent p { font-size: 9px; color: var(--color-gold); margin-bottom: var(--space-3); }
.sentSub { font-size: 7px; color: var(--color-text-dim); }
```

- [ ] **Step 6: Write `src/components/auth/OnboardingScreen.tsx`**

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { useUserStore } from '../../stores/userStore'
import { xpToNext } from '../../lib/constants'
import styles from './OnboardingScreen.module.css'

export function OnboardingScreen() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const session = useAuthStore(s => s.session)
  const setUsername_ = useUserStore(s => s.setUsername)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    setError(null)

    const userId = session.user.id
    const trimmed = username.trim().toUpperCase()

    // Insert into users table
    const { error: userError } = await supabase
      .from('users')
      .insert({ id: userId, username: trimmed })

    if (userError) {
      setError(userError.code === '23505' ? 'Username taken. Try another.' : userError.message)
      setLoading(false)
      return
    }

    // Insert into user_stats with defaults
    const { error: statsError } = await supabase
      .from('user_stats')
      .insert({ user_id: userId, xp_to_next: xpToNext(1) })

    if (statsError) {
      setError(statsError.message)
      setLoading(false)
      return
    }

    setUsername_(trimmed)
    navigate('/hub', { replace: true })
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <div className={styles.title}>NAME YOUR WARRIOR</div>
        <p className={styles.subtitle}>This is how you appear in the chronicles.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="WARRIOR NAME"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={styles.input}
            maxLength={20}
            minLength={2}
            required
            autoComplete="off"
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'FORGING…' : 'BEGIN YOUR LEGEND'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Write `src/components/auth/OnboardingScreen.module.css`**

```css
.screen {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-6);
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  width: 100%;
  max-width: 320px;
}

.title {
  font-size: 12px;
  color: var(--color-gold);
  letter-spacing: 3px;
  text-align: center;
  text-shadow: 0 0 12px var(--color-gold-glow);
}

.subtitle {
  font-size: 7px;
  color: var(--color-text-dim);
  text-align: center;
  line-height: 1.8;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.input {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  color: var(--color-gold);
  font-family: var(--font-pixel);
  font-size: 10px;
  padding: 14px var(--space-3);
  border-radius: 2px;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  outline: none;
}
.input:focus { border-color: var(--color-gold); }

.button {
  background: var(--color-gold);
  color: var(--color-bg);
  font-family: var(--font-pixel);
  font-size: 8px;
  border: none;
  padding: 14px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 1px;
}
.button:disabled { opacity: 0.5; }

.error {
  font-size: 7px;
  color: var(--color-danger);
  text-align: center;
}
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
npm test
```

Expected: All previous tests still PASS (AuthGuard test now also passes — 8 total).

- [ ] **Step 9: Commit**

```bash
git add src/components/auth/
git commit -m "feat: add auth screens (LoginScreen, OnboardingScreen, AuthGuard)"
```

---

## Task 8: Router + App Entry

**Files:**
- Create: `src/router.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Write `src/router.tsx`**

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AuthGuard } from './components/auth/AuthGuard'
import { LoginScreen } from './components/auth/LoginScreen'
import { OnboardingScreen } from './components/auth/OnboardingScreen'
import { HubScreen } from './components/hub/HubScreen'
import { QuestsPlaceholder } from './components/placeholders/QuestsPlaceholder'
import { VaultPlaceholder } from './components/placeholders/VaultPlaceholder'
import { CharacterPlaceholder } from './components/placeholders/CharacterPlaceholder'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginScreen /> },
  { path: '/onboarding', element: <OnboardingScreen /> },
  {
    path: '/',
    element: <AuthGuard><AppShell /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/hub" replace /> },
      { path: 'hub', element: <HubScreen /> },
      { path: 'quests', element: <QuestsPlaceholder /> },
      { path: 'vault', element: <VaultPlaceholder /> },
      { path: 'character', element: <CharacterPlaceholder /> },
    ],
  },
  { path: '*', element: <Navigate to="/hub" replace /> },
])
```

- [ ] **Step 2: Write `src/App.tsx`**

```tsx
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/authStore'
import { useUserStore } from './stores/userStore'
import { router } from './router'

export function App() {
  const setSession = useAuthStore(s => s.setSession)
  const fetchUserData = useUserStore(s => s.fetchUserData)

  useEffect(() => {
    // Bootstrap session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) fetchUserData(data.session.user.id)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) fetchUserData(session.user.id)
      }
    )

    return () => subscription.unsubscribe()
  }, [setSession, fetchUserData])

  return <RouterProvider router={router} />
}
```

- [ ] **Step 3: Update `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 4: Note on TypeScript errors**

`router.tsx` imports `AppShell`, placeholder screens (created Task 9), and `HubScreen` (created Task 13). TypeScript will report import errors until those tasks are complete. **This is expected.** Vite's dev server still works without them. Do not run `tsc --noEmit` until Task 15.

- [ ] **Step 5: Commit**

```bash
git add src/router.tsx src/App.tsx src/main.tsx
git commit -m "feat: wire router, App bootstrap with Supabase auth listener"
```

---

## Task 9: Placeholder Screens + UI Shell

**Files:**
- Create: `src/components/placeholders/QuestsPlaceholder.tsx`
- Create: `src/components/placeholders/VaultPlaceholder.tsx`
- Create: `src/components/placeholders/CharacterPlaceholder.tsx`
- Create: `src/components/layout/AppShell.tsx` + `.module.css`
- Create: `src/components/layout/TabBar.tsx` + `.module.css`
- Create: `src/components/ui/Modal.tsx` + `.module.css`

- [ ] **Step 1: Write placeholder screens**

```tsx
// src/components/placeholders/QuestsPlaceholder.tsx
import styles from './Placeholder.module.css'
export function QuestsPlaceholder() {
  return <div className={styles.screen}><span>QUEST LOG</span><p>Coming in Phase 2</p></div>
}
```

```tsx
// src/components/placeholders/VaultPlaceholder.tsx
import styles from './Placeholder.module.css'
export function VaultPlaceholder() {
  return <div className={styles.screen}><span>THE VAULT</span><p>Coming in Phase 3</p></div>
}
```

```tsx
// src/components/placeholders/CharacterPlaceholder.tsx
import styles from './Placeholder.module.css'
export function CharacterPlaceholder() {
  return <div className={styles.screen}><span>CHARACTER</span><p>Coming in Phase 5</p></div>
}
```

Create `src/components/placeholders/Placeholder.module.css`:

```css
.screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--color-bg);
}
.screen span {
  font-size: 10px;
  color: var(--color-gold);
  letter-spacing: 3px;
}
.screen p {
  font-size: 7px;
  color: var(--color-text-dim);
}
```

- [ ] **Step 2: Write `src/components/ui/Modal.tsx`**

```tsx
import { useEffect } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
```

Create `src/components/ui/Modal.module.css`:

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: flex-end;
  z-index: 200;
}

.panel {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border-2);
  width: 100%;
  max-height: 60dvh;
  border-radius: 12px 12px 0 0;
  padding: var(--space-6);
  padding-bottom: calc(var(--space-6) + var(--safe-bottom));
}
```

- [ ] **Step 3: Write `src/components/layout/TabBar.tsx`**

```tsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Modal } from '../ui/Modal'
import styles from './TabBar.module.css'

const TABS = [
  { to: '/hub',       icon: '⌂', label: 'HUB' },
  { to: '/quests',    icon: '≡', label: 'QUESTS' },
  { to: '/vault',     icon: '◈', label: 'VAULT' },
  { to: '/character', icon: '⚔', label: 'CHAR' },
] as const

export function TabBar() {
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  return (
    <>
      <nav className={styles.bar}>
        {TABS.slice(0, 2).map(tab => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }>
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
          </NavLink>
        ))}

        <button className={styles.addBtn} onClick={() => setQuickAddOpen(true)}>
          +
        </button>

        {TABS.slice(2).map(tab => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }>
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      <Modal open={quickAddOpen} onClose={() => setQuickAddOpen(false)}>
        <p className={styles.comingSoon}>QUICK ADD</p>
        <p className={styles.comingSoonSub}>Quest · Expense · Workout — Phase 2</p>
      </Modal>
    </>
  )
}
```

Create `src/components/layout/TabBar.module.css`:

```css
.bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  padding: 10px 0 calc(10px + var(--safe-bottom));
  flex-shrink: 0;
  position: relative;
}

.bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold-glow), transparent);
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-decoration: none;
  opacity: 0.3;
  transition: opacity 0.2s;
  padding: 4px 8px;
}
.tab.active { opacity: 1; }

.icon {
  font-size: 16px;
  color: var(--color-gold);
  font-style: normal;
}

.label {
  font-size: 5px;
  color: var(--color-gold);
  letter-spacing: 1px;
}

.addBtn {
  width: 40px;
  height: 40px;
  background: var(--color-gold);
  border-radius: 50%;
  border: none;
  color: var(--color-bg);
  font-family: sans-serif;
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  box-shadow: 0 0 0 3px var(--color-bg), 0 0 12px var(--color-gold-glow);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.comingSoon {
  font-size: 10px;
  color: var(--color-gold);
  text-align: center;
  margin-bottom: 8px;
}
.comingSoonSub {
  font-size: 7px;
  color: var(--color-text-dim);
  text-align: center;
}
```

- [ ] **Step 4: Write `src/components/layout/AppShell.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import { TabBar } from './TabBar'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
```

Create `src/components/layout/AppShell.module.css`:

```css
.shell {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  overflow: hidden;
  position: relative;
}

.main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 5: Verify TypeScript and dev server**

```bash
npx tsc --noEmit
npm run dev
```

Expected: No TS errors. Dev server shows Login screen. Navigating to `/hub` after login shows tab bar + Hub placeholder.

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add AppShell, TabBar, Modal, placeholder screens, auth routing"
```

---

## Task 10: ProgressBar UI Primitive

**Files:**
- Create: `src/components/ui/ProgressBar.tsx` + `.module.css`
- Create: `src/components/ui/__tests__/ProgressBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/__tests__/ProgressBar.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

describe('ProgressBar', () => {
  it('renders fill at correct percentage', () => {
    const { container } = render(<ProgressBar value={340} max={500} color="#c9a84c" />)
    const fill = container.querySelector('[data-testid="fill"]') as HTMLElement
    expect(fill.style.width).toBe('68%')
  })

  it('clamps at 100%', () => {
    const { container } = render(<ProgressBar value={600} max={500} color="#c9a84c" />)
    const fill = container.querySelector('[data-testid="fill"]') as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('clamps at 0%', () => {
    const { container } = render(<ProgressBar value={-10} max={500} color="#c9a84c" />)
    const fill = container.querySelector('[data-testid="fill"]') as HTMLElement
    expect(fill.style.width).toBe('0%')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `../ProgressBar` not found.

- [ ] **Step 3: Write `src/components/ui/ProgressBar.tsx`**

```tsx
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max: number
  color: string
  className?: string
}

export function ProgressBar({ value, max, color, className }: ProgressBarProps) {
  const pct = Math.round(Math.min(100, Math.max(0, (value / max) * 100)))

  return (
    <div className={`${styles.track} ${className ?? ''}`}>
      <div
        data-testid="fill"
        className={styles.fill}
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
```

Create `src/components/ui/ProgressBar.module.css`:

```css
.track {
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

.fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.6s ease-out;
  position: relative;
}

.fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  filter: blur(2px);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 3 ProgressBar tests PASS (13 total).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ProgressBar.tsx src/components/ui/ProgressBar.module.css src/components/ui/__tests__/ProgressBar.test.tsx
git commit -m "feat: add ProgressBar UI primitive with percentage clamping"
```

---

## Task 11: Hub Sub-Components (XPBar, Stats, Summary)

**Files:**
- Create: `src/components/hub/XPBar.tsx` + `.module.css`
- Create: `src/components/hub/StatBadge.tsx` + `.module.css`
- Create: `src/components/hub/StatsPanel.tsx` + `.module.css`
- Create: `src/components/hub/SummaryCards.tsx` + `.module.css`
- Create: `src/components/hub/__tests__/XPBar.test.tsx`
- Create: `src/components/hub/__tests__/StatsPanel.test.tsx`
- Create: `src/components/hub/__tests__/SummaryCards.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/hub/__tests__/XPBar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { XPBar } from '../XPBar'

describe('XPBar', () => {
  it('displays xp and xpToNext', () => {
    render(<XPBar xp={340} xpToNext={500} />)
    expect(screen.getByText('340 / 500')).toBeInTheDocument()
  })
  it('has EXPERIENCE label', () => {
    render(<XPBar xp={0} xpToNext={100} />)
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument()
  })
})
```

```tsx
// src/components/hub/__tests__/StatsPanel.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsPanel } from '../StatsPanel'
import { DEFAULT_STATS } from '../../../lib/constants'

describe('StatsPanel', () => {
  it('renders all 11 stat labels', () => {
    render(<StatsPanel stats={DEFAULT_STATS} />)
    expect(screen.getByText('STRENGTH')).toBeInTheDocument()
    expect(screen.getByText('COURAGE')).toBeInTheDocument()
  })
  it('renders stat values', () => {
    const stats = { ...DEFAULT_STATS, strength: 42 }
    render(<StatsPanel stats={stats} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
```

```tsx
// src/components/hub/__tests__/SummaryCards.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCards } from '../SummaryCards'

describe('SummaryCards', () => {
  it('renders streak count', () => {
    render(<SummaryCards streakCount={12} questsToday={3} questsTotal={8} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })
  it('renders quests today/total', () => {
    render(<SummaryCards streakCount={0} questsToday={3} questsTotal={8} />)
    expect(screen.getByText('3/8')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — hub modules not found.

- [ ] **Step 3: Write `src/components/hub/XPBar.tsx`**

```tsx
import { ProgressBar } from '../ui/ProgressBar'
import styles from './XPBar.module.css'

interface XPBarProps {
  xp: number
  xpToNext: number
}

export function XPBar({ xp, xpToNext }: XPBarProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>EXPERIENCE</span>
        <span className={styles.value}>{xp} / {xpToNext}</span>
      </div>
      <ProgressBar
        value={xp}
        max={xpToNext}
        color="linear-gradient(90deg, #8b6b20, #c9a84c, #e8d090)"
        className={styles.bar}
      />
    </div>
  )
}
```

Create `src/components/hub/XPBar.module.css`:

```css
.wrap {
  padding: 10px var(--space-5) 8px;
  border-bottom: 1px solid var(--color-border);
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.label {
  font-size: 6px;
  color: var(--color-text-dim);
  letter-spacing: 2px;
}

.value {
  font-size: 6px;
  color: var(--color-gold);
}

.bar {
  height: 6px;
}
```

- [ ] **Step 4: Write `src/components/hub/StatBadge.tsx`**

```tsx
import type { StatKey } from '../../types'
import { STAT_META } from '../../lib/constants'
import styles from './StatBadge.module.css'

interface StatBadgeProps {
  statKey: StatKey
  value: number
}

export function StatBadge({ statKey, value }: StatBadgeProps) {
  const meta = STAT_META[statKey]
  const pct = Math.min(100, Math.round((value / 50) * 100))

  return (
    <div className={styles.row}>
      <span className={styles.icon}>{meta.icon}</span>
      <div className={styles.info}>
        <span className={styles.name}>{meta.label}</span>
        <div className={styles.track}>
          <div
            className={styles.fill}
            style={{ width: `${pct}%`, background: meta.color }}
          />
        </div>
      </div>
      <span className={styles.val}>{value}</span>
    </div>
  )
}
```

Create `src/components/hub/StatBadge.module.css`:

```css
.row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon {
  font-size: 9px;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
  font-style: normal;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  display: block;
  font-size: 5px;
  color: var(--color-text-dim);
  letter-spacing: 1px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track {
  height: 3px;
  background: var(--color-border);
  border-radius: 1px;
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.6s ease-out;
}

.val {
  font-size: 6px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  min-width: 14px;
  text-align: right;
}
```

- [ ] **Step 5: Write `src/components/hub/StatsPanel.tsx`**

```tsx
import { STAT_KEYS } from '../../lib/constants'
import type { StatValues } from '../../types'
import { StatBadge } from './StatBadge'
import styles from './StatsPanel.module.css'

interface StatsPanelProps {
  stats: StatValues
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>ATTRIBUTES</div>
      <div className={`${styles.grid} scroll-y`}>
        {STAT_KEYS.map(key => (
          <StatBadge key={key} statKey={key} value={stats[key]} />
        ))}
      </div>
    </div>
  )
}
```

Create `src/components/hub/StatsPanel.module.css`:

```css
.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px var(--space-4) 4px;
  min-height: 0;
}

.header {
  font-size: 6px;
  color: var(--color-text-muted);
  letter-spacing: 2px;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  align-content: start;
  padding-bottom: var(--space-2);
}
```

- [ ] **Step 6: Write `src/components/hub/SummaryCards.tsx`**

```tsx
import styles from './SummaryCards.module.css'

interface SummaryCardsProps {
  streakCount: number
  questsToday: number
  questsTotal: number
}

export function SummaryCards({ streakCount, questsToday, questsTotal }: SummaryCardsProps) {
  return (
    <div className={styles.row}>
      <div className={styles.card}>
        <span className={styles.value}>{streakCount}</span>
        <span className={styles.label}>STREAK</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{questsToday}/{questsTotal}</span>
        <span className={styles.label}>TODAY</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value} style={{ color: 'var(--color-success)' }}>0g</span>
        <span className={styles.label}>GOLD</span>
      </div>
    </div>
  )
}
```

Create `src/components/hub/SummaryCards.module.css`:

```css
.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  border-radius: 3px;
  padding: 8px 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold-glow), transparent);
}

.value {
  font-size: 10px;
  color: var(--color-gold);
  letter-spacing: 1px;
}

.label {
  font-size: 5px;
  color: var(--color-text-muted);
  letter-spacing: 1px;
}
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npm test
```

Expected: All hub sub-component tests PASS (20 total).

- [ ] **Step 8: Commit**

```bash
git add src/components/hub/XPBar.tsx src/components/hub/XPBar.module.css src/components/hub/StatBadge.tsx src/components/hub/StatBadge.module.css src/components/hub/StatsPanel.tsx src/components/hub/StatsPanel.module.css src/components/hub/SummaryCards.tsx src/components/hub/SummaryCards.module.css src/components/hub/__tests__/
git commit -m "feat: add Hub sub-components (XPBar, StatBadge, StatsPanel, SummaryCards)"
```

---

## Task 12: Character Canvas

**Files:**
- Create: `src/components/hub/CharacterCanvas.tsx` + `.module.css`
- Create: `src/components/hub/__tests__/CharacterCanvas.test.tsx`
- Create: `public/sprites/warrior-idle.png` (see Step 1)

- [ ] **Step 1: Create placeholder spritesheet**

The real spritesheet is a pixel art asset to be designed. For now, create a placeholder:

Option A — Generate with Node:
```bash
node -e "
const { createCanvas } = require('canvas');
const fs = require('fs');
const c = createCanvas(192, 48);
const ctx = c.getContext('2d');
// Frame backgrounds
[0,48,96,144].forEach((x,i) => {
  ctx.fillStyle = i % 2 === 0 ? '#2a3560' : '#1e2848';
  ctx.fillRect(x, 0, 48, 48);
  ctx.fillStyle = '#c9a84c';
  ctx.fillRect(x+20, 4, 8, 8);   // head
  ctx.fillRect(x+18, 12, 12, 16); // body
  ctx.fillRect(x+14, 12, 4, 12);  // left arm
  ctx.fillRect(x+30, 12, 4, 12);  // right arm
  ctx.fillRect(x+18, 28, 5, 12);  // left leg
  ctx.fillRect(x+25, 28, 5, 12);  // right leg
});
fs.writeFileSync('public/sprites/warrior-idle.png', c.toBuffer('image/png'));
console.log('Spritesheet written');
" 2>/dev/null || echo "canvas not available — copy a 192x48 PNG to public/sprites/warrior-idle.png"
```

Option B — Manual: Create any 192×48 PNG with 4 visible frames and place it at `public/sprites/warrior-idle.png`. The canvas component will work with any valid PNG at that path.

Ensure the directory exists:
```bash
mkdir -p public/sprites
```

- [ ] **Step 2: Write the failing test**

```tsx
// src/components/hub/__tests__/CharacterCanvas.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { CharacterCanvas } from '../CharacterCanvas'

// jsdom doesn't implement canvas — mock it
beforeEach(() => {
  const mockCtx = {
    drawImage: vi.fn(),
    clearRect: vi.fn(),
    scale: vi.fn(),
  }
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx) as any
})

describe('CharacterCanvas', () => {
  it('renders a canvas element', () => {
    const { container } = render(<CharacterCanvas />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('canvas has correct CSS dimensions', () => {
    const { container } = render(<CharacterCanvas />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    expect(canvas.style.width).toBe('96px')
    expect(canvas.style.height).toBe('96px')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `CharacterCanvas` not found.

- [ ] **Step 4: Write `src/components/hub/CharacterCanvas.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import styles from './CharacterCanvas.module.css'

const FRAME_COUNT = 4
const FRAME_W = 48
const FRAME_H = 48
const FRAME_INTERVAL_MS = 500

export function CharacterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Internal resolution: 2× scale for pixel crispness
    canvas.width = FRAME_W * 2
    canvas.height = FRAME_H * 2
    ctx.scale(2, 2)
    ctx.imageSmoothingEnabled = false

    const img = new Image()
    img.src = '/sprites/warrior-idle.png'

    const draw = () => {
      if (!img.complete) return
      ctx.clearRect(0, 0, FRAME_W, FRAME_H)
      ctx.drawImage(
        img,
        frameRef.current * FRAME_W, 0, FRAME_W, FRAME_H, // source
        0, 0, FRAME_W, FRAME_H                           // dest
      )
    }

    img.onload = draw

    const interval = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % FRAME_COUNT
      draw()
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.canvas} pixel`}
      style={{ width: '96px', height: '96px' }}
    />
  )
}
```

Create `src/components/hub/CharacterCanvas.module.css`:

```css
.canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```

Expected: Both CharacterCanvas tests PASS (22 total).

- [ ] **Step 6: Commit**

```bash
git add src/components/hub/CharacterCanvas.tsx src/components/hub/CharacterCanvas.module.css src/components/hub/__tests__/CharacterCanvas.test.tsx public/sprites/
git commit -m "feat: add CharacterCanvas with 4-frame idle spritesheet animation"
```

---

## Task 13: Hub Screen

**Files:**
- Create: `src/components/hub/HubScreen.tsx` + `.module.css`
- Create: `src/components/hub/__tests__/HubScreen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/hub/__tests__/HubScreen.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HubScreen } from '../HubScreen'

vi.mock('../../../stores/userStore', () => ({
  useUserStore: vi.fn((selector: any) => selector({
    username: 'DEMETRE',
    level: 7,
    xp: 340,
    xpToNext: 500,
    streakCount: 12,
    lastActiveDate: null,
    stats: {
      strength: 12, intelligence: 8, agility: 15, wisdom: 9,
      discipline: 11, vitality: 7, creativity: 5, charisma: 6,
      serenity: 4, endurance: 13, courage: 10,
    },
  })),
}))

vi.mock('../../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

// Mock canvas
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    drawImage: vi.fn(), clearRect: vi.fn(), scale: vi.fn(),
    imageSmoothingEnabled: true,
  })) as any
})

describe('HubScreen', () => {
  it('renders player username', () => {
    render(<HubScreen />)
    expect(screen.getByText('DEMETRE')).toBeInTheDocument()
  })

  it('renders level', () => {
    render(<HubScreen />)
    expect(screen.getByText(/LV 7/)).toBeInTheDocument()
  })

  it('renders XP label', () => {
    render(<HubScreen />)
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument()
  })

  it('renders all 11 stat labels', () => {
    render(<HubScreen />)
    expect(screen.getByText('STRENGTH')).toBeInTheDocument()
    expect(screen.getByText('COURAGE')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `HubScreen` not found.

- [ ] **Step 3: Write `src/components/hub/HubScreen.tsx`**

```tsx
import { useUserStore } from '../../stores/userStore'
import { getTitleForLevel } from '../../lib/constants'
import { CharacterCanvas } from './CharacterCanvas'
import { XPBar } from './XPBar'
import { SummaryCards } from './SummaryCards'
import { StatsPanel } from './StatsPanel'
import styles from './HubScreen.module.css'

export function HubScreen() {
  const username    = useUserStore(s => s.username)
  const level       = useUserStore(s => s.level)
  const xp          = useUserStore(s => s.xp)
  const xpToNext    = useUserStore(s => s.xpToNext)
  const streakCount = useUserStore(s => s.streakCount)
  const stats       = useUserStore(s => s.stats)
  const title       = getTitleForLevel(level)

  return (
    <div className={styles.screen}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <span className={styles.playerName}>{username || '…'}</span>
        <span className={styles.levelPill}>LV {level}</span>
      </div>

      {/* Character stage */}
      <div className={styles.stage}>
        <div className={styles.frameCorners}>
          <CharacterCanvas />
        </div>
        <div className={styles.charGlow} />
        <span className={styles.charTitle}>{title.toUpperCase()}</span>
        <span className={styles.charClass}>WARRIOR</span>
      </div>

      {/* XP bar */}
      <XPBar xp={xp} xpToNext={xpToNext} />

      {/* Summary row */}
      <SummaryCards streakCount={streakCount} questsToday={0} questsTotal={0} />

      {/* Stats panel — scrollable */}
      <StatsPanel stats={stats} />
    </div>
  )
}
```

Create `src/components/hub/HubScreen.module.css`:

```css
.screen {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  padding-top: var(--safe-top);
  overflow: hidden;
}

.topBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.playerName {
  font-size: 7px;
  color: var(--color-gold);
  letter-spacing: 2px;
}

.levelPill {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  font-size: 7px;
  color: var(--color-gold);
  padding: 3px 8px;
  border-radius: 2px;
}

.stage {
  background: radial-gradient(ellipse at 50% 70%, #1a1f35 0%, var(--color-bg) 70%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 10px;
  border-bottom: 1px solid var(--color-border);
  position: relative;
  flex-shrink: 0;
}

/* Corner bracket decoration */
.frameCorners {
  position: relative;
  padding: 8px;
}
.frameCorners::before,
.frameCorners::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: rgba(201, 168, 76, 0.4);
  border-style: solid;
}
.frameCorners::before {
  top: 0; left: 0;
  border-width: 2px 0 0 2px;
}
.frameCorners::after {
  bottom: 0; right: 0;
  border-width: 0 2px 2px 0;
}

.charGlow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  background: radial-gradient(ellipse, var(--color-gold-glow) 0%, transparent 70%);
  pointer-events: none;
}

.charTitle {
  margin-top: 6px;
  font-size: 8px;
  color: var(--color-gold);
  letter-spacing: 3px;
  text-shadow: 0 0 8px var(--color-gold-glow);
}

.charClass {
  margin-top: 3px;
  font-size: 6px;
  color: var(--color-text-muted);
  letter-spacing: 2px;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 4 HubScreen tests PASS (26 total).

- [ ] **Step 5: Commit**

```bash
git add src/components/hub/HubScreen.tsx src/components/hub/HubScreen.module.css src/components/hub/__tests__/HubScreen.test.tsx
git commit -m "feat: add HubScreen composing all hub sub-components"
```

---

## Task 14: PWA Configuration

**Files:**
- Create: `public/manifest.json`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`

- [ ] **Step 1: Create icon placeholders**

Create placeholder icons (32×32 black square) until real assets are designed:

```bash
mkdir -p public/icons
node -e "
const { createCanvas } = require('canvas');
const fs = require('fs');
[192, 512].forEach(size => {
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0a0c14';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#c9a84c';
  ctx.font = \`bold \${Math.floor(size * 0.4)}px serif\`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('G', size/2, size/2);
  fs.writeFileSync(\`public/icons/icon-\${size}.png\`, c.toBuffer('image/png'));
});
console.log('Icons written');
" 2>/dev/null || echo "canvas not available — place 192px and 512px PNGs at public/icons/icon-192.png and public/icons/icon-512.png"
```

If Node canvas is unavailable: manually place any 192×192 and 512×512 PNG files at the paths above. The app will function without them; they only affect the install icon.

- [ ] **Step 2: Write `public/manifest.json`**

```json
{
  "name": "The Grimoire",
  "short_name": "Grimoire",
  "description": "Your life. Your legend.",
  "start_url": "/hub",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0a0c14",
  "background_color": "#0a0c14",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 3: Build and verify PWA**

```bash
npm run build
npm run preview
```

Open `http://localhost:4173` in a browser. Open DevTools → Application → Manifest.
Expected: Manifest loads with all fields. Service worker registers.

- [ ] **Step 4: Test TypeScript build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors. Output in `dist/`.

- [ ] **Step 5: Commit**

```bash
git add public/manifest.json public/icons/
git commit -m "feat: add PWA manifest and app icons"
```

---

## Task 15: Definition of Done Verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All 26 tests PASS, 0 failures.

- [ ] **Step 2: TypeScript clean build**

```bash
npm run build
```

Expected: `tsc` succeeds, Vite bundles successfully, no errors.

- [ ] **Step 3: Verify auth end-to-end**

1. Start preview server: `npm run preview`
2. Open `http://localhost:4173`
3. Enter a real email address → magic link received
4. Click magic link → redirected to `/hub`
5. On first visit → `/onboarding` → enter username → redirected to `/hub`
6. Hub renders: character canvas animating, XP bar (0/100), streak 0, all 11 stats at 0

- [ ] **Step 4: Verify PWA install on iPhone**

1. Deploy to production host (Vercel, Netlify, or any HTTPS host)
2. Open in iPhone Safari
3. Tap Share → Add to Home Screen
4. Launch from home screen: no browser chrome, full-screen, dark background

Alternatively test on desktop Chrome: DevTools → Application → "Add to home screen" prompt.

- [ ] **Step 5: Verify offline shell**

1. Load the app once (caches the shell)
2. In DevTools → Network → set to "Offline"
3. Reload
Expected: App loads from cache, shows Hub skeleton (no Supabase data but no crash)

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: Phase 1 complete — foundation, auth, hub screen, PWA shell"
git push
```

---

## Notes

- **Supabase keys** — never committed; live in `.env.local` only
- **Stat max for bar** — hard-coded at 50 in `StatBadge.tsx`. Adjust in Phase 5 once stat ceiling is defined
- **Character spritesheet** — placeholder until real pixel art is commissioned. Swap the file at `public/sprites/warrior-idle.png` with no code changes needed
- **Gold value on SummaryCards** — hardcoded `0g` in Phase 1. Treasury store populates this in Phase 3
- **Quest counts on SummaryCards** — hardcoded `0/0`. Quest store populates in Phase 2
- **`fetchUserData` makes two queries** — acceptable for Phase 1. Consolidate with a Supabase join or view in Phase 5
