# PortfolioOS — Design Spec
*Date: 2026-04-04 | Owner: Demetre Nutsubidze*

---

## 1. Overview

A personal portfolio built as a fully functional retro Windows 95/98 OS simulation running in the browser. Single-page application — no routing breaks the OS illusion. Every animation uses Framer Motion spring physics. Target: the most polished retro-OS portfolio on the internet.

---

## 2. Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict, no `any`) |
| Styling | Tailwind CSS |
| Animation | Framer Motion (all animations — no CSS transitions except simple hover) |
| State | Zustand (window manager) |
| AI Terminal | Google Gemini API (`gemini-2.0-flash`) |
| Email | Resend |
| Sound | Howler.js |
| Gestures | @use-gesture/react |

---

## 3. Architecture

**Approach: Pure SPA + Next.js API Routes**

- Everything renders on one page (`/`)
- All window state managed in Zustand
- Windows are lazy-mounted on first open, kept in DOM after (preserves state, avoids re-mount flash)
- Gemini API access: server-side only via `/api/terminal` — key stored in `.env.local` as `GEMINI_API_KEY`, never bundled client-side
- Contact form: server-side via `/api/contact` using Resend
- No client-side secrets

---

## 4. Visual Identity

### Color Palette
```
Background:      #0a0a0f  (deep navy/near-black)
Phosphor green:  #00ff88  (accents, active elements, terminal text)
Amber:           #ffb347  (highlights, clock, warnings)
Win chrome:      #c0bdb5  (window chrome, taskbar — warm-tinted classic gray)
Title bar:       linear-gradient(90deg, #000080, #1084d0)
Inactive title:  linear-gradient(90deg, #555, #888)
```

### Typography
- `VT323` — terminal text, system messages, boot sequence
- `Share Tech Mono` — UI labels, taskbar, window titles, icon labels
- Clean modern sans (`Inter` or similar) — content inside apps (bio text, project descriptions)

### Effects
- **CRT scanlines:** CSS `repeating-linear-gradient` pseudo-element over entire desktop, subtle opacity
- **CRT vignette:** `radial-gradient` border darkening on desktop frame
- **Noise wallpaper:** SVG `feTurbulence` filter layered over desktop background with slow color shift
- **Phosphor glow:** `box-shadow` / `text-shadow` on focused windows and active elements
- **Screen flicker:** Framer Motion animation on initial load (opacity oscillation, 2–3 cycles, 300ms)
- **Custom cursor:** Pixel-art arrow cursor via `cursor: url()`

### Window Chrome
- Raised bevel: `box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf`
- Title bar: navy-to-blue gradient (active), gray gradient (inactive)
- Controls: `_  □  ✕` using styled `<button>` elements, Win98 proportions

---

## 5. File Structure

```
src/
  app/
    page.tsx              ← single root page, mounts everything
    layout.tsx
    api/
      terminal/route.ts   ← Gemini API proxy (POST, streaming)
      contact/route.ts    ← Resend email sender (POST)
  components/
    boot/
      BootSequence.tsx    ← full boot animation orchestrator
      BiosScreen.tsx
      ProgressBar.tsx
    desktop/
      Desktop.tsx
      DesktopIcon.tsx
      DesktopWallpaper.tsx
      ContextMenu.tsx     ← right-click menu
    taskbar/
      Taskbar.tsx
      StartButton.tsx
      StartMenu.tsx
      TaskbarApp.tsx      ← open window indicator
      SystemTray.tsx
    windows/
      Window.tsx          ← core draggable/resizable window shell
      WindowManager.tsx   ← renders all open windows
      TitleBar.tsx
      ResizeHandle.tsx
    apps/
      AboutMe/
        AboutMe.tsx       ← Notepad-style, typewriter bio
      Projects/
        Projects.tsx      ← Explorer-style
        ProjectDetail.tsx
      Skills/
        Skills.tsx        ← Task Manager style
      Terminal/
        Terminal.tsx
        TerminalInput.tsx
      Resume/
        Resume.tsx        ← PDF viewer UI
      Contact/
        Contact.tsx       ← Outlook Express style
      RecycleBin/
        RecycleBin.tsx    ← Easter egg
    shared/
      CRTOverlay.tsx
      PhosphorGlow.tsx
  store/
    windowStore.ts        ← Zustand: windows, z-index, focus
    soundStore.ts         ← Zustand: sound on/off, Howler instances
    bootStore.ts          ← Zustand: boot state
  hooks/
    useDrag.ts
    useResize.ts
    useWindowSnap.ts
    useSoundEffect.ts
  lib/
    geminiApi.ts          ← client helper for /api/terminal streaming
    resendApi.ts          ← client helper for /api/contact
    sounds.ts             ← Howler sound definitions
  styles/
    globals.css           ← CRT overlay, custom cursor, scanlines
```

---

## 6. Boot Sequence

Duration: ~4 seconds. Skippable on click anywhere.

**Stages (Framer Motion orchestrated):**
1. **Black screen** — 200ms
2. **BIOS POST** — Fast-scrolling monospace text (VT323): fake memory count, CPU detection, hardware init. ~1.5s
3. **"Starting Windows 98..."** — Segmented retro progress bar fills over ~1s
4. **Windows 98 logo** — Fade in with scanline wipe transition. ~500ms
5. **Desktop fade-in** — Desktop appears with screen flicker. Startup chime fires via Howler.js

State managed in `bootStore`. Once complete, `bootStore.done = true` and boot component unmounts.

---

## 7. Window Manager

State shape in `windowStore`:
```typescript
interface WindowState {
  id: string
  appId: AppId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isMounted: boolean  // lazy mount flag
}
```

**Behaviors:**
- **Drag:** `@use-gesture/react` `useDrag`, constrained to viewport
- **Resize:** 8 handles (4 edges + 4 corners), min size enforced per app
- **Z-index:** Click-to-focus increments global `zCounter`, assigns to window
- **Minimize:** Framer Motion `animate` shrinks window toward taskbar button position (layoutId shared element)
- **Maximize:** Animates to `{ x:0, y:0, width:'100vw', height:'calc(100vh - 40px)' }` with spring
- **Snap:** Drag to top edge → maximize; drag to left/right edge → 50% width snap
- **Close:** Instant for most apps; confirmation dialog for Contact if form has content
- **Multiple windows:** All render simultaneously, z-index determines stacking

All open/close/minimize/maximize use `spring` physics: `{ stiffness: 300, damping: 30 }` (no linear easing anywhere).

---

## 8. Apps

### 8.1 About Me (Notepad.exe)
- Notepad UI: menu bar (File / Edit / Format / Help — decorative), scrollable text area
- Bio typewriter animation on window open (Framer Motion `staggerChildren`)
- Content: creative bio for Demetre Nutsubidze — Front End Developer
- Fake file metadata footer: `about_me.txt  |  Created: 1995-08-24  |  Modified: 2026-04-04  |  1.2 KB`
- Blinking cursor `█` at end of text

### 8.2 My Projects (Explorer.exe)
- Left sidebar: folder tree with project categories
- Main area: icon grid of project "folders"
- Double-click project → opens new child window with project detail
- Project detail: title, description, tech stack as file-type icons, live link + GitHub as `.lnk` shortcut icons
- Placeholder projects (3): `project_1/`, `project_2/`, `project_3/`

### 8.3 Skills.exe (Task Manager)
- Tabs: Frontend / Tools / Languages
- Each skill = a process row: name, fake PID, fake memory usage (MB), animated progress bar
- Progress bars animate from 0 to value on window open (`staggerChildren`, spring)
- Skills: React, Angular, Next.js, TypeScript, JavaScript, HTML/CSS, Three.js, Framer Motion, Git, etc.
- Footer: "CPU Usage: 94% — because I actually know what I'm doing"

### 8.4 Resume.pdf
- Custom PDF viewer window UI: toolbar with Print / Zoom In / Zoom Out / Page nav (decorative except download)
- Resume rendered as HTML inside viewer (placeholder content)
- Download button: triggers file download of actual PDF (placeholder PDF for now)

### 8.5 Terminal
- Prompt: `C:\> `
- Supported commands: `help`, `ls`, `whoami`, `clear`, `projects`, `contact`, `skills`
- Any unrecognised input → streams to `/api/terminal` (Gemini 2.0 Flash)
- Gemini system prompt: plays role of Demetre's AI assistant, answers recruiter questions about his work, skills, and experience
- Streaming response: typewriter character-by-character render
- Error sound on unknown command that isn't AI-routable
- Phosphor green text on #0a0a0f background, VT323 font, blinking block cursor

### 8.6 Contact (Outlook Express)
- UI: compose window with To (pre-filled: demetrenutsubidze423@gmail.com), Subject, Message fields
- Send button → POST to `/api/contact` → Resend delivers to Demetre's email
- Send animation: envelope "flies" off screen (Framer Motion y: -200, opacity: 0, rotate: 15)
- Confirmation toast after send

### 8.7 Recycle Bin (Easter egg)
- Empty state text: funny/self-deprecating content about old code, rejected applications, past mistakes
- "Restore" buttons that do nothing (with tooltip: "some things are better left deleted")
- Makes portfolio human and memorable

---

## 9. Taskbar

**Style: Option C — Win98 chrome + phosphor pulse**
- Classic gray (`#c0bdb5`) with raised top border
- Start button: Win98 style with 4-color Windows flag logo
- Quick launch area (optional: browser shortcut icon)
- Open window buttons: Win98 bevel style, phosphor green dot `●` on active/focused window
- System tray: clock in navy/amber accent, fake wifi + battery icons
- Start Menu: slides up with Framer Motion `y: 100% → 0`, contains: About, Projects, Skills, Terminal, Contact, Shutdown

---

## 10. Sound System (Howler.js)

| Event | Sound |
|---|---|
| Boot complete | Windows 98 startup chime |
| Window open | Soft whoosh |
| Window close | Click |
| Error (terminal) | Classic Windows error beep |
| Start menu open | Click |
| Minimize | Swoosh down |

All sounds toggleable via system tray speaker icon. State in `soundStore`.

---

## 11. Performance

- All animations: `transform` + `opacity` only (no width/height/top/left animation)
- Windows lazy-mounted (not rendered until first open)
- `useCallback` / `useMemo` on all drag/resize handlers
- `React.lazy` + `Suspense` for each app component
- `prefers-reduced-motion`: all Framer Motion animations check `useReducedMotion()` and fall back to instant transitions
- Target 60fps minimum, 120fps on capable displays via `framer-motion` layout animations

---

## 12. Personal Content

| Field | Value |
|---|---|
| Name | Demetre Nutsubidze |
| Title | Front End Developer |
| Email | demetrenutsubidze423@gmail.com |
| Skills | React, Angular, HTML, CSS, JavaScript, TypeScript, Next.js, Git, Three.js, Framer Motion |
| Projects | Placeholders (3) — to be filled later |
| Resume | Placeholder content — to be replaced with real PDF |
| Bio | Creative AI-generated — written at implementation time |

---

## 13. Environment & Secrets

```
# .env.local (never committed)
GEMINI_API_KEY=AIzaSyBO8K55M5DmOSVv7F0zrl0sxpUbwAnG5xQ
RESEND_API_KEY=<to be added>
```

Both keys accessed server-side only. Never referenced in any client component.

---

## 14. Build Order

1. Project scaffold (Next.js 14, TypeScript, Tailwind, dependencies)
2. Boot sequence
3. Desktop + wallpaper + icons
4. Window manager (drag, resize, z-index, min/max/close animations)
5. Taskbar + Start Menu
6. About Me app
7. Terminal app (Gemini integration)
8. Projects app
9. Skills app
10. Resume app
11. Contact app (Resend integration)
12. Recycle Bin easter egg
13. Sound system
14. Polish pass: CRT effects, phosphor glow, micro-interactions, reduced-motion

---

## 15. CLAUDE.md Tracking

Progress and architectural decisions are tracked in `CLAUDE.md` at the project root throughout the build.
