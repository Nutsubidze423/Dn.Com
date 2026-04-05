# PortfolioOS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a retro Windows 98 OS simulation portfolio for Demetre Nutsubidze that runs entirely in the browser as a Next.js 14 SPA.

**Architecture:** Single page at `/` mounts all OS chrome; windows are lazy-mounted in Zustand on first open and kept in DOM. Gemini 2.0 Flash and Resend are accessed server-side only via Next.js API routes. All animation via Framer Motion spring physics.

**Tech Stack:** Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, Framer Motion, Zustand, @use-gesture/react, Howler.js, @google/generative-ai, Resend, VT323 + Share Tech Mono fonts.

---

## File Map

```
src/
  app/
    page.tsx                         ← root: renders boot or desktop
    layout.tsx                       ← fonts, metadata, global styles
    globals.css                      ← CRT overlay, scanlines, custom cursor, CSS vars
    api/
      terminal/route.ts              ← POST: Gemini 2.0 Flash streaming proxy
      contact/route.ts               ← POST: Resend email sender
  components/
    boot/
      BootSequence.tsx               ← orchestrates all boot stages
      BiosScreen.tsx                 ← scrolling POST text
      Win98ProgressBar.tsx           ← segmented chunky progress bar
      Win98Logo.tsx                  ← logo + scanline wipe
    desktop/
      Desktop.tsx                    ← wallpaper + icon grid + window manager
      DesktopWallpaper.tsx           ← canvas noise + color shift
      DesktopIcon.tsx                ← pixel icon + label + double-click
      ContextMenu.tsx                ← right-click menu
      CRTOverlay.tsx                 ← scanlines + vignette pseudo-overlay
    taskbar/
      Taskbar.tsx                    ← root taskbar layout
      StartButton.tsx                ← 4-color flag + "Start" label
      StartMenu.tsx                  ← slide-up menu
      TaskbarApp.tsx                 ← open window pill with phosphor dot
      SystemTray.tsx                 ← clock + icons + sound toggle
    windows/
      Window.tsx                     ← draggable/resizable window shell
      TitleBar.tsx                   ← title + min/max/close buttons
      ResizeHandle.tsx               ← 8-direction resize handle
      WindowManager.tsx              ← renders all open windows
    apps/
      AboutMe/AboutMe.tsx            ← Notepad style, typewriter bio
      Projects/
        Projects.tsx                 ← Explorer style, folder grid
        ProjectDetail.tsx            ← project detail child window
      Skills/Skills.tsx              ← Task Manager style, animated bars
      Terminal/
        Terminal.tsx                 ← terminal shell + history
        TerminalInput.tsx            ← input row with blinking cursor
      Resume/Resume.tsx              ← PDF viewer UI
      Contact/Contact.tsx            ← Outlook Express compose
      RecycleBin/RecycleBin.tsx      ← easter egg
  store/
    windowStore.ts                   ← Zustand: windows, z-index, focus
    bootStore.ts                     ← Zustand: boot phase tracking
    soundStore.ts                    ← Zustand: mute toggle + Howler refs
  hooks/
    useWindowDrag.ts                 ← useDrag wrapper for windows
    useWindowResize.ts               ← 8-handle resize logic
    useWindowSnap.ts                 ← edge snap detection
    useSoundEffect.ts                ← play named sound effect
    useReducedMotion.ts              ← wraps Framer's useReducedMotion
  lib/
    windowConfigs.ts                 ← default size/position per AppId
    sounds.ts                        ← Howler instance map
    terminalCommands.ts              ← built-in command handlers
  types/
    index.ts                         ← shared TypeScript types
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json` (via CLI)
- Create: `tsconfig.json`
- Create: `.env.local`
- Create: `.gitignore`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `CLAUDE.md`

- [ ] **Step 1: Initialise Next.js 14 project**

```bash
cd "c:/Users/Pilmena/Desktop/PortfolioOS"
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted, accept all defaults. This creates `src/app/`, `tailwind.config.ts`, `tsconfig.json`.

- [ ] **Step 2: Install all dependencies**

```bash
npm install framer-motion @use-gesture/react zustand howler @google/generative-ai resend
npm install --save-dev @types/howler
```

- [ ] **Step 3: Enable TypeScript strict mode**

Open `tsconfig.json`. Ensure `compilerOptions` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

- [ ] **Step 4: Create `.env.local`**

```bash
# c:/Users/Pilmena/Desktop/PortfolioOS/.env.local
GEMINI_API_KEY=AIzaSyBO8K55M5DmOSVv7F0zrl0sxpUbwAnG5xQ
RESEND_API_KEY=re_placeholder_add_real_key_later
```

- [ ] **Step 5: Update `.gitignore` to protect secrets**

Ensure `.gitignore` contains (create-next-app adds this, verify):
```
.env.local
.env*.local
.superpowers/
```

- [ ] **Step 6: Create `src/types/index.ts`**

```typescript
export type AppId =
  | 'about-me'
  | 'projects'
  | 'skills'
  | 'terminal'
  | 'resume'
  | 'contact'
  | 'recycle-bin'

export interface WindowState {
  id: string
  appId: AppId
  title: string
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isMounted: boolean
}

export interface DesktopIconConfig {
  appId: AppId
  label: string
  icon: string // emoji or path to pixel icon svg
}

export type BootPhase =
  | 'idle'
  | 'bios'
  | 'progress'
  | 'logo'
  | 'done'
```

- [ ] **Step 7: Create `src/lib/windowConfigs.ts`**

```typescript
import { AppId, WindowState } from '@/types'

type WindowDefaults = Pick<WindowState, 'title' | 'size' | 'position'>

export const WINDOW_CONFIGS: Record<AppId, WindowDefaults> = {
  'about-me': {
    title: 'About Me — Notepad',
    size: { width: 480, height: 380 },
    position: { x: 80, y: 60 },
  },
  'projects': {
    title: 'My Projects — Explorer',
    size: { width: 640, height: 480 },
    position: { x: 100, y: 50 },
  },
  'skills': {
    title: 'Skills.exe — Task Manager',
    size: { width: 500, height: 440 },
    position: { x: 120, y: 70 },
  },
  'terminal': {
    title: 'Terminal — demetre@portfolioos',
    size: { width: 580, height: 420 },
    position: { x: 90, y: 55 },
  },
  'resume': {
    title: 'Resume.pdf — PDF Viewer',
    size: { width: 620, height: 520 },
    position: { x: 110, y: 45 },
  },
  'contact': {
    title: 'New Message — Outlook Express',
    size: { width: 500, height: 420 },
    position: { x: 130, y: 65 },
  },
  'recycle-bin': {
    title: 'Recycle Bin',
    size: { width: 460, height: 380 },
    position: { x: 150, y: 80 },
  },
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Server running at `http://localhost:3000`. Default Next.js page visible. No TypeScript errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 14 project with all dependencies and types"
```

---

## Task 2: Global Styles + Fonts

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update `src/app/layout.tsx` with fonts**

```tsx
import type { Metadata } from 'next'
import { VT323, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Demetre Nutsubidze — Portfolio',
  description: 'Front End Developer Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${vt323.variable} ${shareTechMono.variable}`}>
      <body className="overflow-hidden bg-[#0a0a0f]">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Replace `src/app/globals.css` with OS styles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── CSS Variables ── */
:root {
  --color-bg: #0a0a0f;
  --color-phosphor: #00ff88;
  --color-amber: #ffb347;
  --color-chrome: #c0bdb5;
  --color-chrome-light: #d4d0c8;
  --color-chrome-dark: #808080;
  --color-bevel-light: #ffffff;
  --color-bevel-dark: #404040;
  --color-title-from: #000080;
  --color-title-to: #1084d0;
  --font-terminal: var(--font-vt323), 'Courier New', monospace;
  --font-ui: var(--font-share-tech-mono), 'Courier New', monospace;
}

/* ── Reset ── */
* {
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* ── Custom pixel cursor ── */
body {
  cursor: default;
}

/* ── Win98 bevel utilities ── */
.bevel-raised {
  border: 2px solid;
  border-color: var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light);
}

.bevel-inset {
  border: 2px solid;
  border-color: var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark);
}

/* ── Phosphor glow ── */
.phosphor-glow {
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.3), 0 0 24px rgba(0, 255, 136, 0.1);
}

.phosphor-text-glow {
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
}

/* ── Blinking cursor ── */
.blink-cursor::after {
  content: '█';
  animation: blink 1s step-end infinite;
  color: var(--color-phosphor);
}

@keyframes blink {
  50% { opacity: 0; }
}

/* ── CRT Scanlines (applied via component overlay) ── */
.crt-scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.07) 3px,
    rgba(0, 0, 0, 0.07) 4px
  );
}

.crt-vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

/* ── Scrollbar styling ── */
::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
::-webkit-scrollbar-track {
  background: var(--color-chrome);
  border: 1px solid var(--color-chrome-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--color-chrome);
  border: 2px solid;
  border-color: var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light);
}
::-webkit-scrollbar-button {
  background: var(--color-chrome);
  border: 2px solid;
  border-color: var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light);
  width: 16px;
  height: 16px;
}

/* ── Window drag ── */
.window-dragging {
  user-select: none;
}
```

- [ ] **Step 3: Update `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'os-bg': '#0a0a0f',
        'os-phosphor': '#00ff88',
        'os-amber': '#ffb347',
        'os-chrome': '#c0bdb5',
        'os-chrome-light': '#d4d0c8',
        'os-chrome-dark': '#808080',
        'os-bevel-light': '#ffffff',
        'os-bevel-dark': '#404040',
      },
      fontFamily: {
        terminal: ['var(--font-vt323)', 'Courier New', 'monospace'],
        ui: ['var(--font-share-tech-mono)', 'Courier New', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Verify build with no errors**

```bash
npm run build
```

Expected: Build succeeds. No TypeScript or Tailwind errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add global OS styles, CSS variables, fonts, and Tailwind config"
```

---

## Task 3: Zustand Stores

**Files:**
- Create: `src/store/windowStore.ts`
- Create: `src/store/bootStore.ts`
- Create: `src/store/soundStore.ts`
- Create: `src/hooks/useReducedMotion.ts`

- [ ] **Step 1: Create `src/store/windowStore.ts`**

```typescript
import { create } from 'zustand'
import { AppId, WindowState } from '@/types'
import { WINDOW_CONFIGS } from '@/lib/windowConfigs'

interface WindowStoreState {
  windows: Record<string, WindowState>
  zCounter: number
  openWindow: (appId: AppId) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updatePosition: (id: string, position: { x: number; y: number }) => void
  updateSize: (id: string, size: { width: number; height: number }) => void
}

const STAGGER_OFFSET = 24

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: {},
  zCounter: 10,

  openWindow: (appId) => {
    const { windows, zCounter } = get()

    // If already open, just focus it
    const existing = Object.values(windows).find(
      (w) => w.appId === appId && !w.isMinimized
    )
    if (existing) {
      get().focusWindow(existing.id)
      return
    }

    // If minimized, restore it
    const minimized = Object.values(windows).find(
      (w) => w.appId === appId && w.isMinimized
    )
    if (minimized) {
      get().restoreWindow(minimized.id)
      return
    }

    const config = WINDOW_CONFIGS[appId]
    const openCount = Object.keys(windows).length
    const id = `${appId}-${Date.now()}`
    const newZCounter = zCounter + 1

    const newWindow: WindowState = {
      id,
      appId,
      title: config.title,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: config.position.x + openCount * STAGGER_OFFSET,
        y: config.position.y + openCount * STAGGER_OFFSET,
      },
      size: config.size,
      zIndex: newZCounter,
      isMounted: true,
    }

    set({
      windows: { ...windows, [id]: newWindow },
      zCounter: newZCounter,
    })
  },

  closeWindow: (id) => {
    set((state) => {
      const { [id]: _, ...rest } = state.windows
      return { windows: rest }
    })
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true },
      },
    }))
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMaximized: true, isMinimized: false },
      },
    }))
  },

  restoreWindow: (id) => {
    const { zCounter } = get()
    const newZ = zCounter + 1
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: false,
          isMaximized: false,
          zIndex: newZ,
        },
      },
      zCounter: newZ,
    }))
  },

  focusWindow: (id) => {
    const { zCounter } = get()
    const newZ = zCounter + 1
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], zIndex: newZ },
      },
      zCounter: newZ,
    }))
  },

  updatePosition: (id, position) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position },
      },
    }))
  },

  updateSize: (id, size) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], size },
      },
    }))
  },
}))
```

- [ ] **Step 2: Create `src/store/bootStore.ts`**

```typescript
import { create } from 'zustand'
import { BootPhase } from '@/types'

interface BootStoreState {
  phase: BootPhase
  skipped: boolean
  setPhase: (phase: BootPhase) => void
  skip: () => void
}

export const useBootStore = create<BootStoreState>((set) => ({
  phase: 'idle',
  skipped: false,
  setPhase: (phase) => set({ phase }),
  skip: () => set({ phase: 'done', skipped: true }),
}))
```

- [ ] **Step 3: Create `src/store/soundStore.ts`**

```typescript
import { create } from 'zustand'

interface SoundStoreState {
  muted: boolean
  toggleMute: () => void
}

export const useSoundStore = create<SoundStoreState>((set) => ({
  muted: false,
  toggleMute: () => set((state) => ({ muted: !state.muted })),
}))
```

- [ ] **Step 4: Create `src/hooks/useReducedMotion.ts`**

```typescript
'use client'

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}
```

- [ ] **Step 5: Write unit tests for window store**

Create `src/store/__tests__/windowStore.test.ts`:

```typescript
import { act, renderHook } from '@testing-library/react'
import { useWindowStore } from '../windowStore'

// Reset store between tests
beforeEach(() => {
  useWindowStore.setState({ windows: {}, zCounter: 10 })
})

describe('windowStore', () => {
  it('opens a window and mounts it', () => {
    const { result } = renderHook(() => useWindowStore())
    act(() => result.current.openWindow('terminal'))
    const windows = Object.values(result.current.windows)
    expect(windows).toHaveLength(1)
    expect(windows[0].appId).toBe('terminal')
    expect(windows[0].isMounted).toBe(true)
    expect(windows[0].isMinimized).toBe(false)
  })

  it('focuses existing window instead of opening duplicate', () => {
    const { result } = renderHook(() => useWindowStore())
    act(() => result.current.openWindow('terminal'))
    const firstId = Object.keys(result.current.windows)[0]
    act(() => result.current.openWindow('terminal'))
    expect(Object.keys(result.current.windows)).toHaveLength(1)
    expect(result.current.windows[firstId].zIndex).toBeGreaterThan(10)
  })

  it('minimizes and restores a window', () => {
    const { result } = renderHook(() => useWindowStore())
    act(() => result.current.openWindow('terminal'))
    const id = Object.keys(result.current.windows)[0]
    act(() => result.current.minimizeWindow(id))
    expect(result.current.windows[id].isMinimized).toBe(true)
    act(() => result.current.restoreWindow(id))
    expect(result.current.windows[id].isMinimized).toBe(false)
  })

  it('closes a window and removes it from state', () => {
    const { result } = renderHook(() => useWindowStore())
    act(() => result.current.openWindow('terminal'))
    const id = Object.keys(result.current.windows)[0]
    act(() => result.current.closeWindow(id))
    expect(result.current.windows[id]).toBeUndefined()
  })

  it('assigns higher z-index to focused window', () => {
    const { result } = renderHook(() => useWindowStore())
    act(() => result.current.openWindow('terminal'))
    act(() => result.current.openWindow('about-me'))
    const ids = Object.keys(result.current.windows)
    const z0 = result.current.windows[ids[0]].zIndex
    act(() => result.current.focusWindow(ids[0]))
    expect(result.current.windows[ids[0]].zIndex).toBeGreaterThan(z0)
  })
})
```

- [ ] **Step 6: Install test dependencies and configure Jest**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest ts-jest
```

Create `jest.config.ts`:

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

Create `jest.setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npx jest src/store/__tests__/windowStore.test.ts --no-coverage
```

Expected: 5 tests pass, 0 fail.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Zustand stores for windows, boot, and sound + window store tests"
```

---

## Task 4: Boot Sequence

**Files:**
- Create: `src/components/boot/BootSequence.tsx`
- Create: `src/components/boot/BiosScreen.tsx`
- Create: `src/components/boot/Win98ProgressBar.tsx`
- Create: `src/components/boot/Win98Logo.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/boot/BiosScreen.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BIOS_LINES = [
  'Award Modular BIOS v4.51PG, An Energy Star Ally',
  'Copyright (C) 1984-98, Award Software, Inc.',
  '',
  'PortfolioOS BIOS v1.0 — Custom Build',
  '',
  'CPU: Demetre-9000 @ 4200 MHz',
  'Memory Test: 524288K OK',
  '',
  'Detecting IDE drives...',
  'Primary Master:   ST34500A — 4500MB',
  'Primary Slave:    CREATIVITY_MODULE — Unlimited',
  '',
  'Detecting PnP devices...',
  'PnP Init Completed',
  '',
  'Verifying DMI Pool Data........',
  'Boot from CD: Failure',
  'Boot from HDD: PORTFOLIO_OS',
  '',
]

export function BiosScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i >= BIOS_LINES.length) {
        clearInterval(interval)
        setTimeout(onComplete, 300)
        return
      }
      setVisibleLines((prev) => [...prev, BIOS_LINES[i]])
      i++
    }, 80)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="w-full h-full bg-black flex flex-col p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {visibleLines.map((line, i) => (
        <div
          key={i}
          className="font-terminal text-[#c0c0c0] text-sm leading-5"
        >
          {line || '\u00A0'}
        </div>
      ))}
      <div className="font-terminal text-[#c0c0c0] text-sm animate-blink mt-1">
        _
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `src/components/boot/Win98ProgressBar.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const SEGMENT_COUNT = 22

export function Win98ProgressBar({ onComplete }: { onComplete: () => void }) {
  const [filled, setFilled] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current++
      setFilled(current)
      if (current >= SEGMENT_COUNT) {
        clearInterval(interval)
        setTimeout(onComplete, 400)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="w-full h-full bg-[#008080] flex flex-col items-center justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="font-terminal text-white text-2xl tracking-widest">
        Starting Windows 98...
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[18px] h-[14px]"
            animate={{
              backgroundColor: i < filled ? '#000080' : '#c0c0c0',
            }}
            transition={{ duration: 0.05 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 3: Create `src/components/boot/Win98Logo.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

export function Win98Logo({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="w-full h-full bg-black flex flex-col items-center justify-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      {/* 4-color Windows flag */}
      <div className="grid grid-cols-2 gap-[3px] w-[72px] h-[72px]">
        <div className="bg-red-600 rounded-tl-[3px]" />
        <div className="bg-green-600 rounded-tr-[3px]" />
        <div className="bg-blue-700 rounded-bl-[3px]" />
        <div className="bg-yellow-400 rounded-br-[3px]" />
      </div>
      <div className="font-terminal text-white text-5xl tracking-[0.3em]">
        Windows<span className="text-[#00ff88]">98</span>
      </div>
      <motion.div
        className="font-ui text-[#808080] text-sm tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        portfolio edition
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Create `src/components/boot/BootSequence.tsx`**

```tsx
'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBootStore } from '@/store/bootStore'
import { BiosScreen } from './BiosScreen'
import { Win98ProgressBar } from './Win98ProgressBar'
import { Win98Logo } from './Win98Logo'

export function BootSequence() {
  const { phase, setPhase, skip } = useBootStore()

  const handleBiosComplete = useCallback(() => setPhase('progress'), [setPhase])
  const handleProgressComplete = useCallback(() => setPhase('logo'), [setPhase])
  const handleLogoComplete = useCallback(() => setPhase('done'), [setPhase])

  // Start BIOS on mount
  if (phase === 'idle') {
    setPhase('bios')
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black z-[10000] cursor-pointer"
      onClick={skip}
      title="Click to skip"
    >
      <AnimatePresence mode="wait">
        {phase === 'bios' && (
          <motion.div
            key="bios"
            className="w-full h-full"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BiosScreen onComplete={handleBiosComplete} />
          </motion.div>
        )}
        {phase === 'progress' && (
          <motion.div
            key="progress"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Win98ProgressBar onComplete={handleProgressComplete} />
          </motion.div>
        )}
        {phase === 'logo' && (
          <motion.div
            key="logo"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Win98Logo onComplete={handleLogoComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-4 right-4 font-ui text-[#333] text-xs">
        Click anywhere to skip
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 5: Update `src/app/page.tsx`**

```tsx
'use client'

import { useBootStore } from '@/store/bootStore'
import { BootSequence } from '@/components/boot/BootSequence'

export default function Home() {
  const { phase } = useBootStore()

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0a0a0f]">
      {phase !== 'done' && <BootSequence />}
      {phase === 'done' && (
        <div className="w-full h-full flex items-center justify-center font-terminal text-os-phosphor text-2xl">
          Desktop loading...
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 6: Run dev server and verify boot sequence plays**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: BIOS text scrolls → progress bar fills → Windows 98 logo → "Desktop loading..." placeholder. Click to skip works.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement 4-stage boot sequence with skip support"
```

---

## Task 5: Desktop Wallpaper + CRT Overlay

**Files:**
- Create: `src/components/desktop/DesktopWallpaper.tsx`
- Create: `src/components/desktop/CRTOverlay.tsx`
- Create: `src/components/desktop/Desktop.tsx`

- [ ] **Step 1: Create `src/components/desktop/DesktopWallpaper.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'

export function DesktopWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let hue = 220 // start deep navy
    let animFrame: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      hue = (hue + 0.02) % 360

      // Base gradient
      const grad = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      )
      grad.addColorStop(0, `hsla(${hue}, 60%, 4%, 1)`)
      grad.addColorStop(0.5, `hsla(${(hue + 20) % 360}, 50%, 3%, 1)`)
      grad.addColorStop(1, `hsla(220, 70%, 2%, 1)`)

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Subtle noise overlay
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 6
        data[i] = Math.max(0, Math.min(255, data[i] + noise))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
      }
      ctx.putImageData(imageData, 0, 0)

      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}
```

- [ ] **Step 2: Create `src/components/desktop/CRTOverlay.tsx`**

```tsx
export function CRTOverlay() {
  return (
    <>
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
    </>
  )
}
```

- [ ] **Step 3: Create `src/components/desktop/Desktop.tsx`**

```tsx
'use client'

import { DesktopWallpaper } from './DesktopWallpaper'
import { CRTOverlay } from './CRTOverlay'

export function Desktop() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]">
      <DesktopWallpaper />
      {/* Icons, windows, taskbar mount here in later tasks */}
      <CRTOverlay />
    </div>
  )
}
```

- [ ] **Step 4: Update `src/app/page.tsx` to use Desktop**

```tsx
'use client'

import { useBootStore } from '@/store/bootStore'
import { BootSequence } from '@/components/boot/BootSequence'
import { Desktop } from '@/components/desktop/Desktop'

export default function Home() {
  const { phase } = useBootStore()

  return (
    <main className="w-screen h-screen overflow-hidden">
      {phase !== 'done' && <BootSequence />}
      {phase === 'done' && <Desktop />}
    </main>
  )
}
```

- [ ] **Step 5: Verify desktop renders after boot**

```bash
npm run dev
```

Expected: After boot sequence completes, animated noise canvas fills screen with CRT scanlines overlaid.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add animated desktop wallpaper and CRT scanline/vignette overlay"
```

---

## Task 6: Desktop Icons

**Files:**
- Create: `src/components/desktop/DesktopIcon.tsx`
- Create: `src/components/desktop/ContextMenu.tsx`
- Modify: `src/components/desktop/Desktop.tsx`

- [ ] **Step 1: Create `src/components/desktop/DesktopIcon.tsx`**

```tsx
'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AppId, DesktopIconConfig } from '@/types'
import { useWindowStore } from '@/store/windowStore'

const ICON_MAP: Record<AppId, string> = {
  'about-me': '📝',
  'projects': '📁',
  'skills': '⚙️',
  'terminal': '🖥️',
  'resume': '📄',
  'contact': '✉️',
  'recycle-bin': '🗑️',
}

export const DESKTOP_ICONS: DesktopIconConfig[] = [
  { appId: 'projects', label: 'My Projects', icon: ICON_MAP['projects'] },
  { appId: 'about-me', label: 'About Me', icon: ICON_MAP['about-me'] },
  { appId: 'skills', label: 'Skills.exe', icon: ICON_MAP['skills'] },
  { appId: 'resume', label: 'Resume.pdf', icon: ICON_MAP['resume'] },
  { appId: 'contact', label: 'Contact', icon: ICON_MAP['contact'] },
  { appId: 'terminal', label: 'Terminal', icon: ICON_MAP['terminal'] },
  { appId: 'recycle-bin', label: 'Recycle Bin', icon: ICON_MAP['recycle-bin'] },
]

interface DesktopIconProps {
  config: DesktopIconConfig
}

export function DesktopIcon({ config }: DesktopIconProps) {
  const { openWindow } = useWindowStore()
  const [selected, setSelected] = useState(false)
  const [lastClick, setLastClick] = useState(0)

  const handleClick = useCallback(() => {
    const now = Date.now()
    setSelected(true)
    if (now - lastClick < 400) {
      openWindow(config.appId)
      setSelected(false)
    }
    setLastClick(now)
  }, [lastClick, config.appId, openWindow])

  return (
    <motion.button
      className="flex flex-col items-center gap-1 w-[72px] py-2 px-1 rounded cursor-pointer border border-transparent focus:outline-none"
      style={{
        background: selected ? 'rgba(0,0,128,0.5)' : 'transparent',
        borderColor: selected ? 'rgba(0,100,200,0.6)' : 'transparent',
      }}
      onClick={handleClick}
      onBlur={() => setSelected(false)}
      whileHover={{ filter: 'brightness(1.2)' }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Open ${config.label}`}
    >
      <motion.span
        className="text-[32px] leading-none select-none"
        style={{
          filter: selected
            ? 'drop-shadow(0 0 8px rgba(0,255,136,0.5))'
            : 'drop-shadow(0 0 4px rgba(0,255,136,0.2))',
        }}
        animate={selected ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {config.icon}
      </motion.span>
      <span
        className="font-ui text-[11px] text-white text-center leading-tight select-none"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
      >
        {config.label}
      </span>
    </motion.button>
  )
}
```

- [ ] **Step 2: Create `src/components/desktop/ContextMenu.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface MenuItem {
  label: string
  action: () => void
  divider?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
}

export function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const items: MenuItem[] = [
    { label: 'Refresh', action: onClose },
    { label: 'View', action: onClose, divider: true },
    { label: 'Properties', action: () => {
      alert('Demetre Nutsubidze — Front End Developer\nBuilt with Next.js + Framer Motion\nVersion 1.0.0')
      onClose()
    }},
  ]

  // Clamp to viewport
  const safeX = Math.min(x, window.innerWidth - 160)
  const safeY = Math.min(y, window.innerHeight - 120)

  return (
    <motion.div
      ref={menuRef}
      className="fixed z-[9990] bg-os-chrome bevel-raised py-[2px] min-w-[160px] shadow-lg"
      style={{ left: safeX, top: safeY }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 0.15 }}
    >
      {items.map((item, i) => (
        <div key={i}>
          {item.divider && <div className="border-t border-os-chrome-dark mx-1 my-[2px]" />}
          <button
            className="w-full text-left px-4 py-[3px] font-ui text-[12px] text-black hover:bg-[#000080] hover:text-white"
            onClick={item.action}
          >
            {item.label}
          </button>
        </div>
      ))}
    </motion.div>
  )
}
```

- [ ] **Step 3: Update `src/components/desktop/Desktop.tsx`**

```tsx
'use client'

import { useState, useCallback } from 'react'
import { DesktopWallpaper } from './DesktopWallpaper'
import { CRTOverlay } from './CRTOverlay'
import { DesktopIcon, DESKTOP_ICONS } from './DesktopIcon'
import { ContextMenu } from './ContextMenu'

export function Desktop() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      <DesktopWallpaper />

      {/* Icon grid */}
      <div
        className="absolute top-4 left-4 flex flex-col flex-wrap gap-1"
        style={{ height: 'calc(100vh - 60px)', zIndex: 10 }}
      >
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon key={icon.appId} config={icon} />
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}

      <CRTOverlay />
    </div>
  )
}
```

- [ ] **Step 4: Verify icons render and double-click triggers openWindow**

```bash
npm run dev
```

Expected: 7 icons in left column, double-click logs in store (window opens, even though no window UI yet — verify via React DevTools or console).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add desktop icons with double-click to open and right-click context menu"
```

---

## Task 7: Window Shell (Drag + Resize)

**Files:**
- Create: `src/hooks/useWindowDrag.ts`
- Create: `src/hooks/useWindowResize.ts`
- Create: `src/hooks/useWindowSnap.ts`
- Create: `src/components/windows/TitleBar.tsx`
- Create: `src/components/windows/ResizeHandle.tsx`
- Create: `src/components/windows/Window.tsx`

- [ ] **Step 1: Create `src/hooks/useWindowDrag.ts`**

```typescript
'use client'

import { useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { useWindowStore } from '@/store/windowStore'
import { useWindowSnap } from './useWindowSnap'

const TASKBAR_HEIGHT = 40

export function useWindowDrag(id: string) {
  const { windows, updatePosition, focusWindow, maximizeWindow } = useWindowStore()
  const { checkSnap } = useWindowSnap()

  const bind = useDrag(
    ({ offset: [x, y], last, velocity: [vx, vy] }) => {
      const win = windows[id]
      if (!win || win.isMaximized) return

      const maxX = window.innerWidth - win.size.width
      const maxY = window.innerHeight - TASKBAR_HEIGHT - win.size.height

      const clampedX = Math.max(0, Math.min(x, maxX))
      const clampedY = Math.max(0, Math.min(y, maxY))

      updatePosition(id, { x: clampedX, y: clampedY })

      if (last) {
        checkSnap(id, clampedX, clampedY)
      }
    },
    {
      from: () => {
        const win = windows[id]
        return [win?.position.x ?? 0, win?.position.y ?? 0]
      },
    }
  )

  const handlePointerDown = useCallback(() => {
    focusWindow(id)
  }, [id, focusWindow])

  return { bind, handlePointerDown }
}
```

- [ ] **Step 2: Create `src/hooks/useWindowSnap.ts`**

```typescript
'use client'

import { useCallback } from 'react'
import { useWindowStore } from '@/store/windowStore'

const SNAP_THRESHOLD = 12

export function useWindowSnap() {
  const { maximizeWindow, updatePosition, updateSize } = useWindowStore()

  const checkSnap = useCallback(
    (id: string, x: number, y: number) => {
      const TASKBAR_HEIGHT = 40
      const W = window.innerWidth
      const H = window.innerHeight - TASKBAR_HEIGHT

      // Top edge → maximize
      if (y <= SNAP_THRESHOLD) {
        maximizeWindow(id)
        return
      }

      // Left edge → snap to left half
      if (x <= SNAP_THRESHOLD) {
        updatePosition(id, { x: 0, y: 0 })
        updateSize(id, { width: W / 2, height: H })
        return
      }

      // Right edge → snap to right half
      if (x >= W - SNAP_THRESHOLD) {
        updatePosition(id, { x: W / 2, y: 0 })
        updateSize(id, { width: W / 2, height: H })
        return
      }
    },
    [maximizeWindow, updatePosition, updateSize]
  )

  return { checkSnap }
}
```

- [ ] **Step 3: Create `src/hooks/useWindowResize.ts`**

```typescript
'use client'

import { useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { useWindowStore } from '@/store/windowStore'

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

const MIN_WIDTH = 280
const MIN_HEIGHT = 200

export function useWindowResize(id: string, direction: ResizeDirection) {
  const { windows, updatePosition, updateSize } = useWindowStore()

  const bind = useDrag(({ delta: [dx, dy] }) => {
    const win = windows[id]
    if (!win) return

    let { x, y } = win.position
    let { width, height } = win.size

    if (direction.includes('e')) width = Math.max(MIN_WIDTH, width + dx)
    if (direction.includes('s')) height = Math.max(MIN_HEIGHT, height + dy)
    if (direction.includes('w')) {
      const newWidth = Math.max(MIN_WIDTH, width - dx)
      x = x + width - newWidth
      width = newWidth
    }
    if (direction.includes('n')) {
      const newHeight = Math.max(MIN_HEIGHT, height - dy)
      y = y + height - newHeight
      height = newHeight
    }

    updatePosition(id, { x, y })
    updateSize(id, { width, height })
  })

  return bind
}
```

- [ ] **Step 4: Create `src/components/windows/TitleBar.tsx`**

```tsx
'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { useWindowDrag } from '@/hooks/useWindowDrag'

interface TitleBarProps {
  id: string
  title: string
  isActive: boolean
}

export function TitleBar({ id, title, isActive }: TitleBarProps) {
  const { minimizeWindow, maximizeWindow, restoreWindow, closeWindow, windows } =
    useWindowStore()
  const { bind } = useWindowDrag(id)
  const win = windows[id]

  const handleMaxRestore = useCallback(() => {
    if (win?.isMaximized) restoreWindow(id)
    else maximizeWindow(id)
  }, [id, win?.isMaximized, maximizeWindow, restoreWindow])

  return (
    <div
      {...bind()}
      className="flex items-center justify-between h-[26px] px-[3px] select-none touch-none"
      style={{
        background: isActive
          ? 'linear-gradient(90deg, #000080, #1084d0)'
          : 'linear-gradient(90deg, #555, #888)',
        cursor: 'move',
      }}
      onDoubleClick={handleMaxRestore}
    >
      <div className="flex items-center gap-[5px] overflow-hidden">
        <span className="font-ui text-white text-[11px] font-bold truncate">
          {title}
        </span>
      </div>
      <div className="flex gap-[3px] flex-shrink-0">
        {/* Minimize */}
        <button
          className="w-[18px] h-[16px] bg-os-chrome bevel-raised flex items-center justify-center text-[10px] font-bold text-black leading-none hover:bg-os-chrome-light active:bevel-inset"
          onClick={(e) => { e.stopPropagation(); minimizeWindow(id) }}
          aria-label="Minimize"
        >
          _
        </button>
        {/* Maximize / Restore */}
        <button
          className="w-[18px] h-[16px] bg-os-chrome bevel-raised flex items-center justify-center text-[10px] font-bold text-black leading-none hover:bg-os-chrome-light"
          onClick={(e) => { e.stopPropagation(); handleMaxRestore() }}
          aria-label={win?.isMaximized ? 'Restore' : 'Maximize'}
        >
          {win?.isMaximized ? '❐' : '□'}
        </button>
        {/* Close */}
        <button
          className="w-[18px] h-[16px] bg-os-chrome bevel-raised flex items-center justify-center text-[10px] font-bold text-black leading-none hover:bg-red-600 hover:text-white"
          onClick={(e) => { e.stopPropagation(); closeWindow(id) }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/windows/ResizeHandle.tsx`**

```tsx
'use client'

import { useWindowResize } from '@/hooks/useWindowResize'

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

const CURSOR_MAP: Record<ResizeDirection, string> = {
  n: 'n-resize', ne: 'ne-resize', e: 'e-resize', se: 'se-resize',
  s: 's-resize', sw: 'sw-resize', w: 'w-resize', nw: 'nw-resize',
}

const POSITION_MAP: Record<ResizeDirection, React.CSSProperties> = {
  n:  { top: 0, left: 4, right: 4, height: 4 },
  ne: { top: 0, right: 0, width: 8, height: 8 },
  e:  { top: 4, right: 0, bottom: 4, width: 4 },
  se: { bottom: 0, right: 0, width: 8, height: 8 },
  s:  { bottom: 0, left: 4, right: 4, height: 4 },
  sw: { bottom: 0, left: 0, width: 8, height: 8 },
  w:  { top: 4, left: 0, bottom: 4, width: 4 },
  nw: { top: 0, left: 0, width: 8, height: 8 },
}

interface ResizeHandleProps {
  id: string
  direction: ResizeDirection
}

export function ResizeHandle({ id, direction }: ResizeHandleProps) {
  const bind = useWindowResize(id, direction)

  return (
    <div
      {...bind()}
      className="absolute z-10 touch-none"
      style={{
        ...POSITION_MAP[direction],
        cursor: CURSOR_MAP[direction],
      }}
    />
  )
}
```

- [ ] **Step 6: Create `src/components/windows/Window.tsx`**

```tsx
'use client'

import { useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { TitleBar } from './TitleBar'
import { ResizeHandle } from './ResizeHandle'
import { AppId } from '@/types'

const AppComponents: Record<AppId, React.LazyExoticComponent<() => JSX.Element>> = {
  'about-me': lazy(() => import('@/components/apps/AboutMe/AboutMe').then(m => ({ default: m.AboutMe }))),
  'projects': lazy(() => import('@/components/apps/Projects/Projects').then(m => ({ default: m.Projects }))),
  'skills': lazy(() => import('@/components/apps/Skills/Skills').then(m => ({ default: m.Skills }))),
  'terminal': lazy(() => import('@/components/apps/Terminal/Terminal').then(m => ({ default: m.Terminal }))),
  'resume': lazy(() => import('@/components/apps/Resume/Resume').then(m => ({ default: m.Resume }))),
  'contact': lazy(() => import('@/components/apps/Contact/Contact').then(m => ({ default: m.Contact }))),
  'recycle-bin': lazy(() => import('@/components/apps/RecycleBin/RecycleBin').then(m => ({ default: m.RecycleBin }))),
}

const DIRECTIONS = ['n','ne','e','se','s','sw','w','nw'] as const

interface WindowProps {
  id: string
}

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 }

const TASKBAR_HEIGHT = 40

export function Window({ id }: WindowProps) {
  const { windows, focusWindow } = useWindowStore()
  const reducedMotion = useReducedMotion()
  const win = windows[id]

  const activeWindowId = Object.values(windows).reduce<string | null>(
    (topId, w) => (!topId || w.zIndex > (windows[topId]?.zIndex ?? 0) ? w.id : topId),
    null
  )
  const isActive = activeWindowId === id

  const handleFocus = useCallback(() => focusWindow(id), [id, focusWindow])

  if (!win || !win.isMounted) return null

  const AppComponent = AppComponents[win.appId]

  const maximizedStyle = {
    x: 0,
    y: 0,
    width: '100vw',
    height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
  }

  const normalStyle = {
    x: win.position.x,
    y: win.position.y,
    width: win.size.width,
    height: win.size.height,
  }

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          key={id}
          className="absolute flex flex-col overflow-hidden"
          style={{
            zIndex: win.zIndex,
            border: '2px solid',
            borderColor: 'var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light)',
            boxShadow: isActive
              ? '3px 3px 12px rgba(0,0,0,0.6), 0 0 20px rgba(0,100,255,0.1)'
              : '3px 3px 8px rgba(0,0,0,0.4)',
          }}
          initial={reducedMotion ? false : { scale: 0.85, opacity: 0 }}
          animate={win.isMaximized ? maximizedStyle : { ...normalStyle, scale: 1, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : SPRING}
          onPointerDown={handleFocus}
          layout
        >
          <TitleBar id={id} title={win.title} isActive={isActive} />
          <div className="flex-1 overflow-hidden bg-os-chrome relative">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full font-terminal text-black text-lg">
                  Loading...
                </div>
              }
            >
              <AppComponent />
            </Suspense>
          </div>
          {!win.isMaximized &&
            DIRECTIONS.map((dir) => (
              <ResizeHandle key={dir} id={id} direction={dir} />
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: window shell with drag, resize, snap, minimize/maximize/close animations"
```

---

## Task 8: Window Manager

**Files:**
- Create: `src/components/windows/WindowManager.tsx`
- Modify: `src/components/desktop/Desktop.tsx`

- [ ] **Step 1: Create `src/components/windows/WindowManager.tsx`**

```tsx
'use client'

import { useWindowStore } from '@/store/windowStore'
import { Window } from './Window'

export function WindowManager() {
  const { windows } = useWindowStore()

  return (
    <>
      {Object.keys(windows).map((id) => (
        <Window key={id} id={id} />
      ))}
    </>
  )
}
```

- [ ] **Step 2: Add WindowManager to Desktop**

```tsx
'use client'

import { useState, useCallback } from 'react'
import { DesktopWallpaper } from './DesktopWallpaper'
import { CRTOverlay } from './CRTOverlay'
import { DesktopIcon, DESKTOP_ICONS } from './DesktopIcon'
import { ContextMenu } from './ContextMenu'
import { WindowManager } from '@/components/windows/WindowManager'

export function Desktop() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      <DesktopWallpaper />

      <div
        className="absolute top-4 left-4 flex flex-col flex-wrap gap-1"
        style={{ height: 'calc(100vh - 60px)', zIndex: 10 }}
      >
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon key={icon.appId} config={icon} />
        ))}
      </div>

      <WindowManager />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}

      <CRTOverlay />
    </div>
  )
}
```

- [ ] **Step 3: Create placeholder app stubs so Window.tsx lazy imports resolve**

Create these files (they will be filled in later tasks):

`src/components/apps/AboutMe/AboutMe.tsx`:
```tsx
export function AboutMe() {
  return <div className="p-4 font-terminal text-black">About Me — Coming Soon</div>
}
```

`src/components/apps/Projects/Projects.tsx`:
```tsx
export function Projects() {
  return <div className="p-4 font-terminal text-black">Projects — Coming Soon</div>
}
```

`src/components/apps/Projects/ProjectDetail.tsx`:
```tsx
export function ProjectDetail() {
  return <div className="p-4 font-terminal text-black">Project Detail</div>
}
```

`src/components/apps/Skills/Skills.tsx`:
```tsx
export function Skills() {
  return <div className="p-4 font-terminal text-black">Skills — Coming Soon</div>
}
```

`src/components/apps/Terminal/Terminal.tsx`:
```tsx
export function Terminal() {
  return <div className="p-4 bg-[#0a0a0f] text-os-phosphor font-terminal h-full">Terminal — Coming Soon</div>
}
```

`src/components/apps/Terminal/TerminalInput.tsx`:
```tsx
export function TerminalInput() {
  return null
}
```

`src/components/apps/Resume/Resume.tsx`:
```tsx
export function Resume() {
  return <div className="p-4 font-terminal text-black">Resume — Coming Soon</div>
}
```

`src/components/apps/Contact/Contact.tsx`:
```tsx
export function Contact() {
  return <div className="p-4 font-terminal text-black">Contact — Coming Soon</div>
}
```

`src/components/apps/RecycleBin/RecycleBin.tsx`:
```tsx
export function RecycleBin() {
  return <div className="p-4 font-terminal text-black">Recycle Bin — Coming Soon</div>
}
```

- [ ] **Step 4: Verify windows open on double-click**

```bash
npm run dev
```

Expected: Double-clicking a desktop icon opens a draggable, resizable window with spring animation. Multiple windows stack correctly. Title bar drag moves window. ✕ closes it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: WindowManager renders open windows; app stubs resolve lazy imports"
```

---

## Task 9: Taskbar + Start Menu

**Files:**
- Create: `src/components/taskbar/StartButton.tsx`
- Create: `src/components/taskbar/TaskbarApp.tsx`
- Create: `src/components/taskbar/SystemTray.tsx`
- Create: `src/components/taskbar/StartMenu.tsx`
- Create: `src/components/taskbar/Taskbar.tsx`
- Modify: `src/components/desktop/Desktop.tsx`

- [ ] **Step 1: Create `src/components/taskbar/StartButton.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

interface StartButtonProps {
  onClick: () => void
  isMenuOpen: boolean
}

export function StartButton({ onClick, isMenuOpen }: StartButtonProps) {
  return (
    <motion.button
      className="h-[30px] font-ui text-[12px] font-black text-black flex items-center gap-[5px] px-[8px] select-none"
      style={{
        background: 'var(--color-chrome-light)',
        border: '2px solid',
        borderColor: isMenuOpen
          ? 'var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)'
          : 'var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light)',
      }}
      onClick={onClick}
      whileTap={{ filter: 'brightness(0.9)' }}
    >
      {/* 4-color Windows flag */}
      <div className="grid grid-cols-2 gap-[1px] w-[16px] h-[16px] flex-shrink-0">
        <div className="bg-red-600" />
        <div className="bg-green-600" />
        <div className="bg-blue-700" />
        <div className="bg-yellow-400" />
      </div>
      <span>Start</span>
    </motion.button>
  )
}
```

- [ ] **Step 2: Create `src/components/taskbar/TaskbarApp.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { WindowState } from '@/types'

interface TaskbarAppProps {
  win: WindowState
  isActive: boolean
}

export function TaskbarApp({ win, isActive }: TaskbarAppProps) {
  const { focusWindow, minimizeWindow, restoreWindow } = useWindowStore()

  const handleClick = () => {
    if (win.isMinimized) {
      restoreWindow(win.id)
    } else if (isActive) {
      minimizeWindow(win.id)
    } else {
      focusWindow(win.id)
    }
  }

  return (
    <motion.button
      className="h-[26px] min-w-[120px] max-w-[160px] flex items-center gap-[6px] px-[8px] font-ui text-[11px] text-black select-none overflow-hidden"
      style={{
        background: 'var(--color-chrome)',
        border: '2px solid',
        borderColor: isActive && !win.isMinimized
          ? 'var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)'
          : 'var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light)',
        boxShadow: isActive && !win.isMinimized ? 'inset 1px 1px 2px rgba(0,0,0,0.2)' : 'none',
      }}
      onClick={handleClick}
      whileHover={{ filter: 'brightness(1.05)' }}
      layoutId={`taskbar-${win.id}`}
    >
      {/* Phosphor dot — active indicator */}
      {!win.isMinimized && (
        <motion.div
          className="w-[6px] h-[6px] rounded-full flex-shrink-0"
          style={{
            background: '#00cc66',
            boxShadow: '0 0 4px #00ff88',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      )}
      <span className="truncate">{win.title}</span>
    </motion.button>
  )
}
```

- [ ] **Step 3: Create `src/components/taskbar/SystemTray.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useSoundStore } from '@/store/soundStore'

export function SystemTray() {
  const { muted, toggleMute } = useSoundStore()
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="h-[26px] flex items-center gap-[8px] px-[8px] font-ui text-[11px] text-black select-none"
      style={{
        background: 'var(--color-chrome)',
        border: '2px solid',
        borderColor: 'var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)',
      }}
    >
      <span title="Network">📶</span>
      <span title="Battery">🔋</span>
      <button
        onClick={toggleMute}
        title={muted ? 'Unmute' : 'Mute'}
        className="hover:opacity-70"
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <span style={{ color: 'var(--color-title-from)', fontWeight: 'bold' }}>
        {time}
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/taskbar/StartMenu.tsx`**

```tsx
'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { AppId } from '@/types'

interface StartMenuItem {
  label: string
  appId?: AppId
  icon: string
  action?: () => void
}

const MENU_ITEMS: StartMenuItem[] = [
  { label: 'About Me', appId: 'about-me', icon: '📝' },
  { label: 'My Projects', appId: 'projects', icon: '📁' },
  { label: 'Skills.exe', appId: 'skills', icon: '⚙️' },
  { label: 'Terminal', appId: 'terminal', icon: '🖥️' },
  { label: 'Contact', appId: 'contact', icon: '✉️' },
]

interface StartMenuProps {
  onClose: () => void
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow } = useWindowStore()

  const handleItem = useCallback(
    (item: StartMenuItem) => {
      if (item.appId) openWindow(item.appId)
      if (item.action) item.action()
      onClose()
    },
    [openWindow, onClose]
  )

  return (
    <motion.div
      className="absolute bottom-[40px] left-0 w-[220px] overflow-hidden"
      style={{
        background: 'var(--color-chrome)',
        border: '2px solid',
        borderColor: 'var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light)',
        boxShadow: '3px 3px 8px rgba(0,0,0,0.5)',
        zIndex: 9999,
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Sidebar stripe */}
      <div className="flex">
        <div
          className="w-[8px] flex-shrink-0"
          style={{
            background: 'linear-gradient(180deg, #000080, #1084d0)',
          }}
        />
        <div className="flex-1">
          {/* Header */}
          <div
            className="px-3 py-2 font-ui text-white text-[13px] font-bold"
            style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}
          >
            Demetre Nutsubidze
          </div>

          {/* Items */}
          {MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-[6px] font-ui text-[12px] text-black hover:bg-[#000080] hover:text-white text-left"
              onClick={() => handleItem(item)}
            >
              <span className="text-[16px] w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Divider */}
          <div className="border-t border-os-chrome-dark mx-2 my-1" />

          {/* Shutdown */}
          <button
            className="w-full flex items-center gap-3 px-3 py-[6px] font-ui text-[12px] text-black hover:bg-[#000080] hover:text-white text-left"
            onClick={() => {
              onClose()
              if (confirm('Shut down PortfolioOS?')) window.location.reload()
            }}
          >
            <span className="text-[16px] w-5 text-center">⏻</span>
            Shut Down...
          </button>
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 5: Create `src/components/taskbar/Taskbar.tsx`**

```tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { StartButton } from './StartButton'
import { TaskbarApp } from './TaskbarApp'
import { SystemTray } from './SystemTray'
import { StartMenu } from './StartMenu'

export function Taskbar() {
  const { windows } = useWindowStore()
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => setStartMenuOpen((prev) => !prev), [])
  const closeMenu = useCallback(() => setStartMenuOpen(false), [])

  // Close start menu on click outside
  useEffect(() => {
    if (!startMenuOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-taskbar]')) setStartMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [startMenuOpen])

  const activeWindowId = Object.values(windows).reduce<string | null>(
    (topId, w) => (!w.isMinimized && (!topId || w.zIndex > (windows[topId]?.zIndex ?? 0)) ? w.id : topId),
    null
  )

  const openWindows = Object.values(windows)

  return (
    <div
      data-taskbar
      className="absolute bottom-0 left-0 right-0 h-[40px] flex items-center px-[4px] gap-[4px]"
      style={{
        background: 'var(--color-chrome)',
        borderTop: '2px solid var(--color-bevel-light)',
        boxShadow: 'inset 0 1px 0 var(--color-chrome-light)',
        zIndex: 9900,
      }}
    >
      <StartButton onClick={toggleMenu} isMenuOpen={startMenuOpen} />

      {/* Divider */}
      <div
        className="h-[26px] w-[2px] mx-[2px]"
        style={{ borderLeft: '1px solid var(--color-chrome-dark)', borderRight: '1px solid var(--color-bevel-light)' }}
      />

      {/* Open window buttons */}
      <div className="flex gap-[3px] flex-1 overflow-hidden">
        {openWindows.map((win) => (
          <TaskbarApp
            key={win.id}
            win={win}
            isActive={win.id === activeWindowId}
          />
        ))}
      </div>

      <SystemTray />

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && <StartMenu onClose={closeMenu} />}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 6: Add Taskbar to Desktop and fix desktop height**

```tsx
// src/components/desktop/Desktop.tsx
'use client'

import { useState, useCallback } from 'react'
import { DesktopWallpaper } from './DesktopWallpaper'
import { CRTOverlay } from './CRTOverlay'
import { DesktopIcon, DESKTOP_ICONS } from './DesktopIcon'
import { ContextMenu } from './ContextMenu'
import { WindowManager } from '@/components/windows/WindowManager'
import { Taskbar } from '@/components/taskbar/Taskbar'

export function Desktop() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      <DesktopWallpaper />

      <div
        className="absolute top-4 left-4 flex flex-col flex-wrap gap-1"
        style={{ height: 'calc(100vh - 56px)', zIndex: 10 }}
      >
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon key={icon.appId} config={icon} />
        ))}
      </div>

      <WindowManager />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}

      <Taskbar />
      <CRTOverlay />
    </div>
  )
}
```

- [ ] **Step 7: Verify taskbar renders with Start Menu animation**

```bash
npm run dev
```

Expected: Win98-style taskbar at bottom. Start button opens slide-up menu. Open windows appear as taskbar pills with glowing phosphor dot. Clock updates every 10 seconds. Sound toggle works.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: taskbar with Start button, open window pills, system tray, and Start Menu"
```

---

## Task 10: About Me App

**Files:**
- Modify: `src/components/apps/AboutMe/AboutMe.tsx`

- [ ] **Step 1: Replace stub with full Notepad implementation**

```tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const BIO_TEXT = `Demetre Nutsubidze
Front End Developer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Some developers write code. Demetre orchestrates
digital experiences that live somewhere between
engineering precision and visual poetry.

Born in the era of dial-up modems and pixel fonts,
he carries the soul of the early web — raw,
creative, unapologetically expressive — into
every project he touches.

Armed with React, Angular, Next.js, TypeScript,
Three.js, and Framer Motion, he builds interfaces
that don't just work. They feel alive.

Currently: Available for hire.
Status: Probably refactoring something that
        was already working fine.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"The best code is the kind that makes
 someone smile when they first see it."
`

const CHARS_PER_TICK = 3
const TICK_MS = 18

export function AboutMe() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const reducedMotion = useReducedMotion()
  const indexRef = useRef(0)

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(BIO_TEXT)
      setDone(true)
      return
    }

    const interval = setInterval(() => {
      indexRef.current = Math.min(indexRef.current + CHARS_PER_TICK, BIO_TEXT.length)
      setDisplayed(BIO_TEXT.slice(0, indexRef.current))
      if (indexRef.current >= BIO_TEXT.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Notepad menu bar */}
      <div
        className="flex gap-0 text-[11px] font-ui text-black bg-os-chrome px-1 py-[2px]"
        style={{ borderBottom: '1px solid var(--color-chrome-dark)' }}
      >
        {['File', 'Edit', 'Format', 'View', 'Help'].map((item) => (
          <button
            key={item}
            className="px-2 py-[1px] hover:bg-[#000080] hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Text area */}
      <div className="flex-1 overflow-auto p-3 font-terminal text-black text-[15px] leading-relaxed whitespace-pre-wrap">
        {displayed}
        {!done && (
          <span className="inline-block w-[9px] h-[15px] bg-black align-middle animate-blink" />
        )}
        {done && (
          <span className="inline-block w-[9px] h-[15px] bg-black align-middle animate-blink" />
        )}
      </div>

      {/* Status bar */}
      <div
        className="flex justify-between px-2 py-[2px] font-ui text-[10px] text-black bg-os-chrome"
        style={{ borderTop: '1px solid var(--color-chrome-dark)' }}
      >
        <span>about_me.txt</span>
        <span>Created: 1995-08-24 | Modified: 2026-04-04 | 1.2 KB</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify About Me typewriter plays on open**

```bash
npm run dev
```

Expected: Double-click "About Me" icon → Notepad window opens → bio text types out character by character → blinking cursor at end.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: About Me app with typewriter bio animation and Notepad UI"
```

---

## Task 11: Terminal API Route (Gemini)

**Files:**
- Create: `src/app/api/terminal/route.ts`
- Create: `src/lib/terminalCommands.ts`

- [ ] **Step 1: Create `src/lib/terminalCommands.ts`**

```typescript
export type CommandResult =
  | { type: 'text'; content: string }
  | { type: 'clear' }
  | { type: 'ai' }

const COMMANDS: Record<string, () => CommandResult> = {
  help: () => ({
    type: 'text',
    content: `Available commands:
  help        Show this help message
  whoami      Display owner info
  ls          List portfolio contents
  skills      List technical skills
  projects    List projects
  contact     Show contact info
  clear       Clear terminal
  
Any other input is sent to the AI assistant.`,
  }),

  whoami: () => ({
    type: 'text',
    content: 'Demetre Nutsubidze — Front End Developer\ndemetrenutsubidze423@gmail.com',
  }),

  ls: () => ({
    type: 'text',
    content: `drwxr-xr-x  projects/
drwxr-xr-x  skills/
-rw-r--r--  resume.pdf        (124 KB)
-rw-r--r--  about_me.txt      (1.2 KB)
-rw-r--r--  contact.lnk`,
  }),

  skills: () => ({
    type: 'text',
    content: `Frontend:  React · Angular · Next.js · TypeScript · JavaScript
Styling:   HTML · CSS · Tailwind CSS
Animation: Framer Motion · Three.js
Tools:     Git · npm · VS Code`,
  }),

  projects: () => ({
    type: 'text',
    content: `[1] project_one/      — placeholder
[2] project_two/      — placeholder
[3] project_three/    — placeholder

Double-click "My Projects" icon to browse.`,
  }),

  contact: () => ({
    type: 'text',
    content: 'Email: demetrenutsubidze423@gmail.com\nDouble-click the "Contact" icon to send a message.',
  }),

  clear: () => ({ type: 'clear' }),
}

export function runCommand(input: string): CommandResult {
  const cmd = input.trim().toLowerCase().split(' ')[0]
  if (cmd in COMMANDS) return COMMANDS[cmd]()
  return { type: 'ai' }
}
```

- [ ] **Step 2: Create `src/app/api/terminal/route.ts`**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `You are Demetre Nutsubidze's personal AI assistant running inside his portfolio terminal.
You answer recruiter and developer questions about Demetre as if you are his knowledgeable assistant.

Facts about Demetre:
- Name: Demetre Nutsubidze
- Role: Front End Developer
- Skills: React, Angular, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Framer Motion, Three.js, Git
- Email: demetrenutsubidze423@gmail.com
- Projects: Placeholder project portfolio (details coming soon)
- Personality: Creative, detail-oriented, passionate about motion design and developer experience

Guidelines:
- Keep responses concise and terminal-appropriate (no markdown headers, use plain text)
- Be enthusiastic and professional about Demetre's work
- If asked something you don't know, say so honestly
- Stay in character — you are a terminal assistant, not a general AI
- Max 150 words per response`

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message } = (await request.json()) as { message: string }

    if (!message || typeof message !== 'string') {
      return new Response('Invalid request', { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await model.generateContentStream(message)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('[terminal/route] Error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}
```

- [ ] **Step 3: Test the API route manually**

```bash
npm run dev
```

In a separate terminal:
```bash
curl -X POST http://localhost:3000/api/terminal \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about Demetre skills"}'
```

Expected: Streaming text response about Demetre's skills. No API key in response headers.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Gemini 2.0 Flash streaming API route for terminal at /api/terminal"
```

---

## Task 12: Terminal UI

**Files:**
- Modify: `src/components/apps/Terminal/Terminal.tsx`
- Modify: `src/components/apps/Terminal/TerminalInput.tsx`

- [ ] **Step 1: Create `src/components/apps/Terminal/TerminalInput.tsx`**

```tsx
'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface TerminalInputProps {
  onSubmit: (value: string) => void
  disabled: boolean
}

export function TerminalInput({ onSubmit, disabled }: TerminalInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() && !disabled) {
      onSubmit(value.trim())
      setValue('')
    }
  }

  return (
    <div className="flex items-center gap-2 font-terminal text-os-phosphor text-[16px]">
      <span className="text-os-phosphor select-none">C:\&gt;</span>
      <input
        ref={inputRef}
        className="flex-1 bg-transparent outline-none text-os-phosphor caret-os-phosphor font-terminal text-[16px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        aria-label="Terminal input"
      />
    </div>
  )
}
```

- [ ] **Step 2: Replace Terminal stub with full implementation**

```tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TerminalInput } from './TerminalInput'
import { runCommand } from '@/lib/terminalCommands'
import { useSoundEffect } from '@/hooks/useSoundEffect'

interface HistoryEntry {
  type: 'input' | 'output' | 'error' | 'ai'
  content: string
}

const WELCOME = `PortfolioOS Terminal v1.0
Copyright (C) 2026 Demetre Nutsubidze

Type 'help' for available commands.
Any other input is handled by the AI assistant.
`

export function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', content: WELCOME },
  ])
  const [streaming, setStreaming] = useState(false)
  const [streamBuffer, setStreamBuffer] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const { play } = useSoundEffect()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, streamBuffer])

  const handleSubmit = useCallback(
    async (input: string) => {
      setHistory((prev) => [...prev, { type: 'input', content: input }])

      const result = runCommand(input)

      if (result.type === 'clear') {
        setHistory([])
        return
      }

      if (result.type === 'text') {
        setHistory((prev) => [...prev, { type: 'output', content: result.content }])
        return
      }

      // AI route
      setStreaming(true)
      setStreamBuffer('')

      try {
        const res = await fetch('/api/terminal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        })

        if (!res.ok || !res.body) {
          throw new Error('API error')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          accumulated += chunk
          setStreamBuffer(accumulated)
        }

        setHistory((prev) => [...prev, { type: 'ai', content: accumulated }])
        setStreamBuffer('')
      } catch {
        play('error')
        setHistory((prev) => [
          ...prev,
          { type: 'error', content: 'Error: Could not reach AI assistant. Check your connection.' },
        ])
        setStreamBuffer('')
      } finally {
        setStreaming(false)
      }
    },
    [play]
  )

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] p-3 overflow-hidden">
      <div className="flex-1 overflow-y-auto font-terminal text-[16px] leading-relaxed space-y-1">
        {history.map((entry, i) => (
          <div key={i}>
            {entry.type === 'input' && (
              <div className="flex gap-2 text-white">
                <span className="text-os-phosphor select-none">C:\&gt;</span>
                <span>{entry.content}</span>
              </div>
            )}
            {entry.type === 'output' && (
              <div className="text-os-phosphor whitespace-pre-wrap">{entry.content}</div>
            )}
            {entry.type === 'ai' && (
              <div className="text-os-phosphor whitespace-pre-wrap opacity-90">{entry.content}</div>
            )}
            {entry.type === 'error' && (
              <div className="text-red-400 whitespace-pre-wrap">{entry.content}</div>
            )}
          </div>
        ))}

        {/* Streaming preview */}
        {streaming && streamBuffer && (
          <div className="text-os-phosphor whitespace-pre-wrap opacity-90">
            {streamBuffer}
            <span className="inline-block w-[9px] h-[15px] bg-os-phosphor align-middle animate-blink ml-1" />
          </div>
        )}
        {streaming && !streamBuffer && (
          <div className="text-os-amber font-terminal text-[14px] opacity-60">
            thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div
        className="pt-2 mt-1"
        style={{ borderTop: '1px solid rgba(0,255,136,0.15)' }}
      >
        <TerminalInput onSubmit={handleSubmit} disabled={streaming} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/hooks/useSoundEffect.ts` stub (sounds wired in Task 15)**

```typescript
'use client'

// Stub — wired to Howler in Task 15
export function useSoundEffect() {
  const play = (_name: string) => {
    // no-op until Task 15
  }
  return { play }
}
```

- [ ] **Step 4: Verify terminal end-to-end**

```bash
npm run dev
```

Expected:
- Type `help` → command list appears instantly
- Type `whoami` → owner info
- Type `clear` → clears history
- Type `tell me about demetre` → streams Gemini response character by character with blinking cursor

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: terminal app with Gemini AI streaming, built-in commands, phosphor UI"
```

---

## Task 13: Projects App

**Files:**
- Modify: `src/components/apps/Projects/Projects.tsx`
- Modify: `src/components/apps/Projects/ProjectDetail.tsx`

- [ ] **Step 1: Define project data**

Add to top of `src/components/apps/Projects/Projects.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectDetail } from './ProjectDetail'

interface Project {
  id: string
  name: string
  description: string
  stack: string[]
  liveUrl?: string
  githubUrl?: string
  icon: string
}

const PROJECTS: Project[] = [
  {
    id: 'project-1',
    name: 'project_one',
    description: 'Placeholder project — replace with your real project description.',
    stack: ['React', 'TypeScript', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#',
    icon: '📦',
  },
  {
    id: 'project-2',
    name: 'project_two',
    description: 'Placeholder project — replace with your real project description.',
    stack: ['Next.js', 'Framer Motion', 'Three.js'],
    liveUrl: '#',
    githubUrl: '#',
    icon: '🚀',
  },
  {
    id: 'project-3',
    name: 'project_three',
    description: 'Placeholder project — replace with your real project description.',
    stack: ['Angular', 'TypeScript', 'CSS'],
    liveUrl: '#',
    githubUrl: '#',
    icon: '⚡',
  },
]
```

- [ ] **Step 2: Implement Projects Explorer UI (continuing same file)**

```tsx
export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [openProject, setOpenProject] = useState<Project | null>(null)

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div
        className="w-[140px] flex-shrink-0 bg-os-chrome p-2 font-ui text-[11px] text-black overflow-y-auto"
        style={{ borderRight: '2px solid var(--color-chrome-dark)' }}
      >
        <div className="font-bold mb-2 text-[10px] uppercase text-os-chrome-dark">Folders</div>
        {['Desktop', 'My Projects', 'Resume', 'Contact'].map((folder) => (
          <div
            key={folder}
            className={`flex items-center gap-1 px-1 py-[2px] cursor-pointer ${
              folder === 'My Projects' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
            }`}
          >
            <span>📁</span> {folder}
          </div>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Address bar */}
        <div
          className="flex items-center gap-2 px-2 py-1 bg-os-chrome font-ui text-[11px]"
          style={{ borderBottom: '1px solid var(--color-chrome-dark)' }}
        >
          <span className="text-black">Address:</span>
          <div
            className="flex-1 bg-white px-2 py-[1px] font-ui text-[11px] text-black"
            style={{ border: '2px solid var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)' }}
          >
            C:\My Projects
          </div>
        </div>

        {/* Files grid */}
        <div className="flex-1 p-4 flex flex-wrap gap-4 content-start overflow-y-auto">
          {PROJECTS.map((project) => (
            <motion.button
              key={project.id}
              className="flex flex-col items-center gap-1 w-[80px] p-2 rounded text-center"
              style={{
                background: selected?.id === project.id ? 'rgba(0,0,128,0.3)' : 'transparent',
                border: selected?.id === project.id ? '1px dotted #000080' : '1px solid transparent',
              }}
              onClick={() => setSelected(project)}
              onDoubleClick={() => setOpenProject(project)}
              whileHover={{ filter: 'brightness(1.1)' }}
            >
              <span className="text-[36px]">{project.icon}</span>
              <span className="font-ui text-[10px] text-black leading-tight">{project.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Status bar */}
        <div
          className="px-2 py-[2px] font-ui text-[10px] text-black bg-os-chrome"
          style={{ borderTop: '1px solid var(--color-chrome-dark)' }}
        >
          {selected ? `1 object(s) selected — ${selected.name}` : `${PROJECTS.length} object(s)`}
        </div>
      </div>

      {/* Project detail modal (inline child window) */}
      <AnimatePresence>
        {openProject && (
          <ProjectDetail
            project={openProject}
            onClose={() => setOpenProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 3: Implement ProjectDetail**

```tsx
'use client'

import { motion } from 'framer-motion'

interface Project {
  id: string
  name: string
  description: string
  stack: string[]
  liveUrl?: string
  githubUrl?: string
  icon: string
}

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <motion.div
      className="absolute inset-4 bg-white z-50 flex flex-col"
      style={{
        border: '2px solid',
        borderColor: 'var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light)',
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between h-[26px] px-2"
        style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}
      >
        <span className="font-ui text-white text-[11px] font-bold">{project.name} — Properties</span>
        <button
          className="w-[18px] h-[16px] bg-os-chrome bevel-raised text-[10px] font-bold text-black flex items-center justify-center"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto font-ui text-[12px] text-black space-y-3">
        <div className="text-[32px] text-center">{project.icon}</div>
        <div>
          <div className="font-bold text-[13px]">{project.name}</div>
          <div className="text-os-chrome-dark mt-1">{project.description}</div>
        </div>
        <div>
          <div className="font-bold mb-1">Tech Stack:</div>
          <div className="flex flex-wrap gap-1">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-[1px] font-ui text-[10px] bg-os-chrome"
                style={{
                  border: '1px solid var(--color-chrome-dark)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-os-chrome bevel-raised font-ui text-[11px] text-black hover:bg-os-chrome-light"
            >
              🌐 Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-os-chrome bevel-raised font-ui text-[11px] text-black hover:bg-os-chrome-light"
            >
              📂 GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Projects app with Explorer UI, folder grid, and project detail panel"
```

---

## Task 14: Skills App

**Files:**
- Modify: `src/components/apps/Skills/Skills.tsx`

- [ ] **Step 1: Replace stub with Task Manager implementation**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Category = 'Frontend' | 'Tools' | 'Languages'

interface Skill {
  name: string
  level: number // 0-100
  pid: number
  memory: string
}

const SKILLS: Record<Category, Skill[]> = {
  Frontend: [
    { name: 'React', level: 90, pid: 1024, memory: '892 K' },
    { name: 'Angular', level: 80, pid: 1031, memory: '743 K' },
    { name: 'Next.js', level: 88, pid: 1042, memory: '921 K' },
    { name: 'Framer Motion', level: 85, pid: 1055, memory: '412 K' },
    { name: 'Three.js', level: 72, pid: 1063, memory: '1,204 K' },
    { name: 'Tailwind CSS', level: 92, pid: 1071, memory: '124 K' },
  ],
  Tools: [
    { name: 'Git', level: 85, pid: 2011, memory: '88 K' },
    { name: 'VS Code', level: 95, pid: 2024, memory: '2,048 K' },
    { name: 'npm', level: 88, pid: 2037, memory: '312 K' },
  ],
  Languages: [
    { name: 'TypeScript', level: 88, pid: 3001, memory: '612 K' },
    { name: 'JavaScript', level: 92, pid: 3012, memory: '548 K' },
    { name: 'HTML', level: 95, pid: 3023, memory: '64 K' },
    { name: 'CSS', level: 90, pid: 3034, memory: '128 K' },
  ],
}

export function Skills() {
  const [activeTab, setActiveTab] = useState<Category>('Frontend')
  const [animated, setAnimated] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  const skills = SKILLS[activeTab]

  return (
    <div className="flex flex-col h-full bg-os-chrome">
      {/* Tabs */}
      <div className="flex gap-0 px-2 pt-2">
        {(['Frontend', 'Tools', 'Languages'] as Category[]).map((tab) => (
          <button
            key={tab}
            className="px-4 py-[3px] font-ui text-[11px] text-black relative"
            style={{
              background: activeTab === tab ? 'var(--color-chrome-light)' : 'var(--color-chrome)',
              border: '2px solid',
              borderColor: activeTab === tab
                ? 'var(--color-bevel-light) var(--color-chrome) var(--color-chrome-light) var(--color-bevel-light)'
                : 'var(--color-bevel-light) var(--color-bevel-dark) var(--color-bevel-dark) var(--color-bevel-light)',
              marginBottom: activeTab === tab ? '-2px' : '0',
              zIndex: activeTab === tab ? 1 : 0,
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="flex-1 flex flex-col overflow-hidden bg-white m-2 mt-0 p-2"
        style={{
          border: '2px solid',
          borderColor: 'var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)',
        }}
      >
        {/* Column headers */}
        <div
          className="grid font-ui text-[11px] text-black font-bold mb-1 pb-1"
          style={{
            gridTemplateColumns: '140px 1fr 60px 70px',
            borderBottom: '1px solid var(--color-chrome-dark)',
          }}
        >
          <span>Process Name</span>
          <span>CPU Usage</span>
          <span className="text-right">PID</span>
          <span className="text-right">Mem Usage</span>
        </div>

        {/* Skill rows */}
        <div className="flex-1 overflow-y-auto space-y-[3px]">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="grid items-center font-ui text-[11px] text-black py-[2px] hover:bg-[#000080] hover:text-white group"
              style={{ gridTemplateColumns: '140px 1fr 60px 70px' }}
              initial={false}
            >
              <span className="truncate">{skill.name}.exe</span>
              <div className="flex items-center gap-2 pr-4">
                <div
                  className="flex-1 h-[10px] bg-os-chrome relative overflow-hidden"
                  style={{
                    border: '1px solid var(--color-chrome-dark)',
                  }}
                >
                  <motion.div
                    className="h-full bg-[#000080] group-hover:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: animated || reducedMotion ? `${skill.level}%` : 0 }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 80, damping: 20, delay: i * 0.06 }
                    }
                  />
                </div>
                <span className="w-[28px] text-right">{skill.level}%</span>
              </div>
              <span className="text-right">{skill.pid}</span>
              <span className="text-right">{skill.memory}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="px-3 pb-2 font-ui text-[10px] text-black">
        CPU Usage: 94% — because I actually know what I&apos;m doing
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: Skills app with animated Task Manager UI, tabbed categories"
```

---

## Task 15: Resume App

**Files:**
- Modify: `src/components/apps/Resume/Resume.tsx`
- Create: `public/resume-placeholder.pdf` (empty placeholder)

- [ ] **Step 1: Create placeholder PDF**

```bash
# Create a simple placeholder PDF (1 page, text only)
node -e "
const fs = require('fs');
const pdf = '%PDF-1.4\n1 0 obj<</Type /Catalog /Pages 2 0 R>>endobj\n2 0 obj<</Type /Pages /Kids [3 0 R] /Count 1>>endobj\n3 0 obj<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer<</Size 4 /Root 1 0 R>>\nstartxref\n197\n%%EOF';
fs.writeFileSync('public/resume-placeholder.pdf', pdf);
console.log('Created placeholder PDF');
"
```

- [ ] **Step 2: Implement Resume viewer**

```tsx
'use client'

import { useState } from 'react'

export function Resume() {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const totalPages = 1

  return (
    <div className="flex flex-col h-full bg-os-chrome">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-2 py-1 flex-wrap"
        style={{ borderBottom: '2px solid var(--color-chrome-dark)' }}
      >
        {[
          { label: '🖨 Print', onClick: () => window.print() },
          { label: '🔍+', onClick: () => setZoom((z) => Math.min(z + 25, 200)) },
          { label: '🔍-', onClick: () => setZoom((z) => Math.max(z - 25, 50)) },
        ].map((btn) => (
          <button
            key={btn.label}
            className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black hover:bg-os-chrome-light"
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
        <div className="w-px h-4 bg-os-chrome-dark mx-1" />
        <button
          className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black hover:bg-os-chrome-light disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ◀
        </button>
        <span className="font-ui text-[11px] text-black">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black hover:bg-os-chrome-light disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          ▶
        </button>
        <div className="w-px h-4 bg-os-chrome-dark mx-1" />
        <a
          href="/resume-placeholder.pdf"
          download="Demetre_Nutsubidze_Resume.pdf"
          className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black hover:bg-os-chrome-light no-underline"
        >
          💾 Download
        </a>
        <span className="font-ui text-[11px] text-os-chrome-dark ml-2">
          Zoom: {zoom}%
        </span>
      </div>

      {/* PDF content area */}
      <div className="flex-1 overflow-auto bg-[#808080] p-4 flex justify-center">
        <div
          className="bg-white shadow-xl p-8 font-ui text-[12px] text-black"
          style={{
            width: `${(612 * zoom) / 100}px`,
            minHeight: `${(792 * zoom) / 100}px`,
            transform: 'none',
          }}
        >
          {/* Placeholder resume content */}
          <div className="text-center mb-6">
            <div className="text-[22px] font-bold">DEMETRE NUTSUBIDZE</div>
            <div className="text-[13px] text-gray-600">Front End Developer</div>
            <div className="text-[11px] text-gray-500 mt-1">
              demetrenutsubidze423@gmail.com
            </div>
          </div>

          <hr className="border-black mb-4" />

          <div className="mb-4">
            <div className="font-bold text-[13px] border-b border-black pb-1 mb-2">SKILLS</div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <div>• React / Next.js / Angular</div>
              <div>• TypeScript / JavaScript</div>
              <div>• Framer Motion / Three.js</div>
              <div>• HTML / CSS / Tailwind</div>
              <div>• Git</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold text-[13px] border-b border-black pb-1 mb-2">EXPERIENCE</div>
            <div className="text-[11px] text-gray-500 italic">
              Replace this placeholder with your real experience.
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold text-[13px] border-b border-black pb-1 mb-2">EDUCATION</div>
            <div className="text-[11px] text-gray-500 italic">
              Replace this placeholder with your real education.
            </div>
          </div>

          <div className="text-center text-[9px] text-gray-300 mt-8">
            [ Replace this entire section with your real resume content ]
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Resume app with PDF viewer UI, zoom controls, and download button"
```

---

## Task 16: Contact App + API Route

**Files:**
- Create: `src/app/api/contact/route.ts`
- Modify: `src/components/apps/Contact/Contact.tsx`

- [ ] **Step 1: Create `src/app/api/contact/route.ts`**

```typescript
import { Resend } from 'resend'
import { NextRequest } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, subject, message } = (await request.json()) as {
      name: string
      subject: string
      message: string
    }

    if (!name || !subject || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'PortfolioOS <onboarding@resend.dev>',
      to: ['demetrenutsubidze423@gmail.com'],
      subject: `[PortfolioOS] ${subject}`,
      text: `From: ${name}\n\n${message}`,
      html: `<p><strong>From:</strong> ${name}</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    })

    if (error) {
      console.error('[contact/route] Resend error:', error)
      return Response.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[contact/route] Unexpected error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Implement Contact UI**

```tsx
'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SendState = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sendState, setSendState] = useState<SendState>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSendState('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, message }),
      })

      if (!res.ok) throw new Error('Send failed')

      setSendState('sent')
    } catch {
      setSendState('error')
    }
  }

  return (
    <div className="flex flex-col h-full bg-os-chrome">
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-2 py-1"
        style={{ borderBottom: '2px solid var(--color-chrome-dark)' }}
      >
        <motion.button
          className="px-3 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black disabled:opacity-50"
          onClick={handleSubmit}
          disabled={sendState === 'sending' || sendState === 'sent' || !name || !message}
          whileTap={{ filter: 'brightness(0.9)' }}
        >
          📤 Send
        </motion.button>
        <button className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black">
          📎 Attach
        </button>
        <button className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black">
          🗑 Delete
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col p-2 gap-1 bg-white overflow-hidden relative">
        {[
          { label: 'To:', value: 'demetrenutsubidze423@gmail.com', readOnly: true },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="font-ui text-[11px] text-black w-[40px] text-right flex-shrink-0">
              {row.label}
            </span>
            <input
              className="flex-1 font-ui text-[11px] text-black px-1 py-[2px] bg-white"
              style={{
                border: '2px solid',
                borderColor: 'var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)',
              }}
              value={row.value}
              readOnly={row.readOnly}
              onChange={() => {}}
            />
          </div>
        ))}

        <div className="flex items-center gap-2">
          <span className="font-ui text-[11px] text-black w-[40px] text-right flex-shrink-0">
            From:
          </span>
          <input
            className="flex-1 font-ui text-[11px] text-black px-1 py-[2px]"
            style={{
              border: '2px solid',
              borderColor: 'var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)',
            }}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-ui text-[11px] text-black w-[40px] text-right flex-shrink-0">
            Subject:
          </span>
          <input
            className="flex-1 font-ui text-[11px] text-black px-1 py-[2px]"
            style={{
              border: '2px solid',
              borderColor: 'var(--color-bevel-dark) var(--color-bevel-light) var(--color-bevel-light) var(--color-bevel-dark)',
            }}
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div
          className="flex-1 flex flex-col mt-1"
          style={{ borderTop: '2px solid var(--color-chrome-dark)' }}
        >
          <textarea
            className="flex-1 font-ui text-[11px] text-black p-2 resize-none outline-none w-full"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Send animation overlay */}
        <AnimatePresence>
          {sendState === 'sending' && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-[48px]"
                animate={{ y: -120, rotate: 20, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeIn' }}
              >
                ✉️
              </motion.div>
              <span className="font-ui text-[12px] text-black">Sending...</span>
            </motion.div>
          )}
          {sendState === 'sent' && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <span className="text-[48px]">✅</span>
              <span className="font-ui text-[13px] font-bold text-black">Message Sent!</span>
              <span className="font-ui text-[11px] text-os-chrome-dark">
                Demetre will get back to you soon.
              </span>
            </motion.div>
          )}
          {sendState === 'error' && (
            <motion.div
              className="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-400 px-3 py-2 font-ui text-[11px] text-red-700 z-10 flex justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>Failed to send. Try again or email directly.</span>
              <button onClick={() => setSendState('idle')} className="font-bold">✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Contact app with Outlook Express UI, Resend API, and envelope send animation"
```

---

## Task 17: Recycle Bin

**Files:**
- Modify: `src/components/apps/RecycleBin/RecycleBin.tsx`

- [ ] **Step 1: Implement easter egg RecycleBin**

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface TrashItem {
  id: string
  name: string
  date: string
  size: string
  joke: string
}

const TRASH: TrashItem[] = [
  {
    id: '1',
    name: 'my_first_css_ever.html',
    date: '2019-03-14',
    size: '2 KB',
    joke: 'Contained 47 nested <center> tags and inline styles on every element.',
  },
  {
    id: '2',
    name: 'job_application_rejected_x47.zip',
    date: '2023-01-01',
    size: '124 KB',
    joke: '"We are looking for someone with 15 years of React experience." React was 11 years old.',
  },
  {
    id: '3',
    name: 'var_i_is_fine.js',
    date: '2020-07-22',
    size: '8 KB',
    joke: '500 lines of JavaScript. Every variable named i, j, k, x, or temp.',
  },
  {
    id: '4',
    name: 'TODO_fix_later.txt',
    date: '2021-11-30',
    size: '1 KB',
    joke: '"Later" was 3 years ago. The bug is still there. It shipped.',
  },
  {
    id: '5',
    name: 'self_doubt_june_2024.docx',
    date: '2024-06-15',
    size: '34 KB',
    joke: 'Deleted after shipping a feature that made 10,000 users happy.',
  },
]

export function RecycleBin() {
  const [selected, setSelected] = useState<string | null>(null)
  const [restored, setRestored] = useState<string[]>([])

  const items = TRASH.filter((t) => !restored.includes(t.id))

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-2 py-1 bg-os-chrome"
        style={{ borderBottom: '2px solid var(--color-chrome-dark)' }}
      >
        <button
          className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black disabled:opacity-40"
          disabled={!selected}
          onClick={() => selected && setRestored((r) => [...r, selected])}
          title="Some things are better left deleted"
        >
          ↩ Restore
        </button>
        <button
          className="px-2 py-[2px] bg-os-chrome bevel-raised font-ui text-[11px] text-black"
          onClick={() => setRestored(TRASH.map((t) => t.id))}
        >
          🗑 Empty Recycle Bin
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div
          className="grid font-ui text-[11px] font-bold text-black px-2 py-1 bg-os-chrome sticky top-0"
          style={{
            gridTemplateColumns: '200px 100px 80px',
            borderBottom: '1px solid var(--color-chrome-dark)',
          }}
        >
          <span>Name</span>
          <span>Date Deleted</span>
          <span>Size</span>
        </div>

        {items.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-32 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-[36px]">✨</span>
            <span className="font-ui text-[12px] text-os-chrome-dark">
              Recycle Bin is empty. New chapter.
            </span>
          </motion.div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div
                className="grid px-2 py-[3px] cursor-pointer font-ui text-[11px] text-black"
                style={{
                  gridTemplateColumns: '200px 100px 80px',
                  background: selected === item.id ? '#000080' : 'transparent',
                  color: selected === item.id ? 'white' : 'black',
                }}
                onClick={() => setSelected(selected === item.id ? null : item.id)}
              >
                <span className="truncate">🗑 {item.name}</span>
                <span>{item.date}</span>
                <span>{item.size}</span>
              </div>
              {selected === item.id && (
                <motion.div
                  className="px-4 py-2 bg-yellow-50 font-ui text-[11px] text-black italic"
                  style={{ borderBottom: '1px solid #e0e0a0' }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  💬 {item.joke}
                  <div className="mt-1 not-italic text-os-chrome-dark text-[10px]">
                    [Restore] tooltip: &quot;Some things are better left deleted&quot;
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div
        className="px-2 py-[2px] font-ui text-[10px] text-black bg-os-chrome"
        style={{ borderTop: '1px solid var(--color-chrome-dark)' }}
      >
        {items.length} item(s) — {items.length > 0 ? 'Demetre keeps it real' : 'Fresh start 🌱'}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: Recycle Bin easter egg with self-deprecating deleted files"
```

---

## Task 18: Sound System

**Files:**
- Create: `src/lib/sounds.ts`
- Modify: `src/hooks/useSoundEffect.ts`
- Create: `public/sounds/startup.mp3` (placeholder — user provides real files)

- [ ] **Step 1: Create sound file placeholders**

```bash
mkdir -p public/sounds
# User should replace these with real .mp3 files
# Placeholder: create empty files so the app doesn't crash
touch public/sounds/startup.mp3
touch public/sounds/window-open.mp3
touch public/sounds/window-close.mp3
touch public/sounds/error.mp3
touch public/sounds/start-menu.mp3
touch public/sounds/minimize.mp3
```

> **Note for Demetre:** Replace files in `public/sounds/` with real Win98-era sound effects. Find them at sites like [sounds-resource.com](https://www.sounds-resource.com) or use royalty-free alternatives.

- [ ] **Step 2: Implement `src/lib/sounds.ts`**

```typescript
import { Howl } from 'howler'

type SoundName = 'startup' | 'window-open' | 'window-close' | 'error' | 'start-menu' | 'minimize'

let sounds: Partial<Record<SoundName, Howl>> | null = null

export function initSounds(): void {
  if (typeof window === 'undefined') return
  if (sounds) return

  sounds = {
    startup: new Howl({ src: ['/sounds/startup.mp3'], volume: 0.6 }),
    'window-open': new Howl({ src: ['/sounds/window-open.mp3'], volume: 0.4 }),
    'window-close': new Howl({ src: ['/sounds/window-close.mp3'], volume: 0.3 }),
    error: new Howl({ src: ['/sounds/error.mp3'], volume: 0.5 }),
    'start-menu': new Howl({ src: ['/sounds/start-menu.mp3'], volume: 0.3 }),
    minimize: new Howl({ src: ['/sounds/minimize.mp3'], volume: 0.3 }),
  }
}

export function playSound(name: SoundName, muted: boolean): void {
  if (muted || typeof window === 'undefined') return
  if (!sounds) initSounds()
  sounds?.[name]?.play()
}
```

- [ ] **Step 3: Replace `src/hooks/useSoundEffect.ts` stub with real implementation**

```typescript
'use client'

import { useCallback } from 'react'
import { useSoundStore } from '@/store/soundStore'
import { playSound } from '@/lib/sounds'

type SoundName = 'startup' | 'window-open' | 'window-close' | 'error' | 'start-menu' | 'minimize'

export function useSoundEffect() {
  const { muted } = useSoundStore()

  const play = useCallback(
    (name: SoundName) => {
      playSound(name, muted)
    },
    [muted]
  )

  return { play }
}
```

- [ ] **Step 4: Wire sounds into Window open/close and boot complete**

In `src/components/windows/Window.tsx`, add sound on mount and close. Add this inside the `Window` component:

```tsx
// Add at top of Window component body:
const { play } = useSoundEffect()

// Add useEffect for open sound:
useEffect(() => {
  if (win?.isMounted) play('window-open')
}, []) // only on mount

// In the close button handler in TitleBar.tsx, the closeWindow call already triggers
// AnimatePresence exit — add sound in Window's onAnimationComplete on exit:
// (Add onExitComplete to AnimatePresence in Window.tsx)
```

Full updated Window.tsx close sound — add to `AnimatePresence`:
```tsx
<AnimatePresence onExitComplete={() => play('window-close')}>
```

- [ ] **Step 5: Play startup sound when boot completes**

In `src/components/boot/BootSequence.tsx`, update `handleLogoComplete`:

```tsx
// At top of BootSequence component:
const { play } = useSoundEffect()

// Update handleLogoComplete:
const handleLogoComplete = useCallback(() => {
  play('startup')
  setPhase('done')
}, [setPhase, play])
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: sound system with Howler.js, mute toggle, startup/open/close/error sounds"
```

---

## Task 19: Polish — Screen Flicker + CLAUDE.md Update

**Files:**
- Modify: `src/components/desktop/Desktop.tsx`
- Modify: `src/app/page.tsx`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add screen flicker on desktop reveal**

In `src/components/desktop/Desktop.tsx`, wrap the entire desktop in a Framer Motion flicker:

```tsx
// Wrap outer div with motion.div:
<motion.div
  className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]"
  initial={{ opacity: 0 }}
  animate={{ opacity: [0, 0.3, 0, 0.7, 0.4, 1] }}
  transition={{ duration: 0.6, times: [0, 0.1, 0.2, 0.5, 0.7, 1], ease: 'easeOut' }}
  onContextMenu={handleContextMenu}
  onClick={() => setContextMenu(null)}
>
```

- [ ] **Step 2: Add `prefers-reduced-motion` to boot sequence**

In `src/components/boot/BootSequence.tsx`, import and apply reduced motion:

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Inside component:
const reducedMotion = useReducedMotion()

// If reduced motion, skip boot entirely:
if (reducedMotion && phase !== 'done') {
  setPhase('done')
}
```

- [ ] **Step 3: Update `CLAUDE.md` with full project state**

```markdown
# PortfolioOS — CLAUDE.md

## Project
Retro Windows 98 OS simulation portfolio for Demetre Nutsubidze (Front End Developer).
Single-page Next.js 14 app. Every animation uses Framer Motion spring physics.

## Owner
- Name: Demetre Nutsubidze
- Email: demetrenutsubidze423@gmail.com
- Role: Front End Developer

## Tech Stack
Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · Framer Motion · Zustand
@use-gesture/react · Howler.js · @google/generative-ai · Resend

## Key Architecture Decisions
- All state in Zustand (windowStore, bootStore, soundStore)
- Windows lazy-mounted on first open, kept in DOM after
- Gemini 2.0 Flash API: server-side only via /api/terminal (GEMINI_API_KEY in .env.local)
- Resend email: server-side only via /api/contact (RESEND_API_KEY in .env.local)
- NO client-side API keys ever

## Color System
- Background: #0a0a0f
- Phosphor green: #00ff88
- Amber: #ffb347
- Win chrome: #c0bdb5 (--color-chrome)
- Active title bar: linear-gradient(90deg, #000080, #1084d0)

## Fonts
- VT323: terminal text (--font-terminal)
- Share Tech Mono: UI labels (--font-ui)

## Taskbar Style
Option C: Classic Win98 gray chrome + phosphor green dot on active windows + navy clock

## Build Status
- [x] Task 1: Scaffold
- [x] Task 2: Global styles + fonts
- [x] Task 3: Zustand stores
- [x] Task 4: Boot sequence
- [x] Task 5: Desktop wallpaper + CRT
- [x] Task 6: Desktop icons
- [x] Task 7: Window shell (drag/resize)
- [x] Task 8: Window manager
- [x] Task 9: Taskbar + Start Menu
- [x] Task 10: About Me
- [x] Task 11: Terminal API
- [x] Task 12: Terminal UI
- [x] Task 13: Projects
- [x] Task 14: Skills
- [x] Task 15: Resume
- [x] Task 16: Contact
- [x] Task 17: Recycle Bin
- [x] Task 18: Sounds
- [x] Task 19: Polish

## File Structure
See docs/superpowers/specs/2026-04-04-portfolioos-design.md

## TODO (for Demetre to fill in later)
- Replace placeholder projects in Projects app with real projects
- Replace resume placeholder with real PDF + content
- Replace sound files in public/sounds/ with real Win98 sounds
- Add RESEND_API_KEY to .env.local once Resend account created
- Deploy to Vercel
```

- [ ] **Step 4: Final build verification**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors and no ESLint errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: screen flicker on boot, reduced-motion support, CLAUDE.md fully updated"
```

---

## Self-Review

**Spec coverage:**
- Boot sequence (BIOS → progress → logo → desktop) ✓ Task 4
- CRT scanlines + vignette ✓ Task 5
- Desktop wallpaper (noise + color shift) ✓ Task 5
- Desktop icons + double-click ✓ Task 6
- Right-click context menu ✓ Task 6
- Window drag/resize/snap ✓ Task 7
- Min/max/close animations (spring) ✓ Task 7+8
- Z-index management ✓ windowStore
- Taskbar + Start Menu ✓ Task 9
- System tray with mute ✓ Task 9
- About Me (typewriter) ✓ Task 10
- Projects (Explorer) ✓ Task 13
- Skills (Task Manager, animated bars) ✓ Task 14
- Resume (PDF viewer) ✓ Task 15
- Terminal (Gemini streaming, commands) ✓ Task 11+12
- Contact (Outlook Express, Resend, envelope animation) ✓ Task 16
- Recycle Bin easter egg ✓ Task 17
- Sounds (Howler.js, mute toggle) ✓ Task 18
- Screen flicker on boot ✓ Task 19
- prefers-reduced-motion ✓ Task 19
- CLAUDE.md tracking ✓ Task 19

**Placeholder scan:** No TBDs. Sound files are intentionally empty placeholders with clear user instructions.

**Type consistency:** `AppId` defined in `types/index.ts` and used consistently. `WindowState` fields match across store and components. `useSoundEffect` type `SoundName` matches `sounds.ts`.
