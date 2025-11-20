# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Development
pnpm dev              # Start Vite dev server with HMR (runs on http://localhost:5173)

# Building & Deployment
pnpm build            # TypeScript check + Vite production build (outputs to dist/)
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint with strict TypeScript checking
```

## Project Architecture

**Brello** is a modern React web application built with TypeScript, Vite, and a rich component ecosystem designed for an interactive, feature-rich UI.
This project uses Effector state manager (or will use it in the nearest future).
The core principle of this project is for me to learn about Effector, patronum and 
other ecosystem.

### Technology Stack

- **Frontend Framework:** React 19 with TypeScript 5.9
- **Build Tool:** Vite 7.2 (fast HMR, optimized bundling)
- **UI Components:** Mantine v8 (comprehensive component library)
- **Styling:** Mantine CSS-in-JS with built-in theming (dark mode support)
- **Rich Text:** TipTap v3 for headless rich text editing
- **Icons:** @tabler/icons-react and lucide-react
- **Package Manager:** pnpm (faster and more efficient than npm)
- **Effector**

### Core Architecture Decisions

1. **Component Library First:** Mantine provides polished components for modals, dropdowns, notifications, date pickers, and spotlight search. Avoid building basic components from scratch.

2. **Styling Strategy:**
   - Use Mantine's CSS-in-JS solution for component styling
   - Mantine components have built-in theme colors and styling
   - Customize styles via Mantine's `sx` prop or CSS modules
   - Global theme configuration through Mantine Provider

3. **Path Aliases:** Import from `@` instead of relative paths:
   ```typescript
   import { SomeComponent } from '@/components/SomeComponent'
   import { someStore } from '@/model'
   ```
   This is configured in `vite.config.ts` and `tsconfig.app.json`.

4. **Strict TypeScript:** All strict checks enabled:
   - No implicit `any`
   - No unused variables or parameters
   - Type-safe code is required from the start

### Project Structure

```
src/
├── main.tsx              # React entry point (initializes Mantine providers)
├── App.tsx               # Root component
├── App.css               # Root component styles
├── index.css             # Global styles and CSS variables
├── model.ts              # Effector stores and events
└── assets/               # Static assets
```

### Important Patterns

**Styling Components:** Use Mantine's styling approaches:
- `sx` prop for inline styles with theme access
- CSS modules for complex component styling
- Mantine's `createStyles` hook for component-scoped styles

```typescript
import { Button } from '@mantine/core'

export function MyButton() {
  return (
    <Button
      sx={{ backgroundColor: 'var(--mantine-color-blue-6)' }}
    >
      Click me
    </Button>
  )
}
```

**Mantine Components:** Prefer using Mantine components over building from scratch:
- `Button`, `Input`, `Modal`, `Notification`, `Select`, `DatePicker` - all provided by Mantine
- Mantine components include built-in styling and theme support
- Rich text editing: Use TipTap via `@mantine/tiptap` integration

**React 19 Features:** The project uses React 19, which includes:
- Automatic JSX transform (no need to import React)
- Server Components ready (though not used yet)
- Concurrent features via StrictMode

### ESLint Configuration

ESLint is configured with strict rules:
- TypeScript type-checking enabled
- React Hooks rules enforced
- React Refresh Fast Refresh support
- No auto-fixing of formatting (focus on code quality)

Run `pnpm lint` before committing to catch issues early.

### Development Workflow

1. **Start Development:** `pnpm dev` - Vite will open the dev server with HMR
2. **Make Changes:** Edit files in `/src/` - changes reflect instantly in the browser
3. **Type Check:** TypeScript errors show in the terminal and IDE
4. **Lint Before Commit:** `pnpm lint` - fix any ESLint violations
5. **Build for Production:** `pnpm build` - runs TypeScript check and Vite bundling

### Future Additions

- **Testing:** No test framework configured yet. When needed, Vitest would be ideal (Vite-native)
- **API/Backend:** This is a frontend-only setup. Backend integration will require HTTP client setup (consider `fetch` or `axios`)
- **Patronum:** Explore Patronum utilities for advanced Effector patterns and async operations

### Key Files & Their Purposes

- `vite.config.ts` - Build configuration, path aliases
- `tsconfig.app.json` - TypeScript compiler options (strict mode enabled)
- `src/index.css` - Global styles and CSS variables
- `src/model.ts` - Effector state management (stores, events, effects)
- `src/main.tsx` - React app initialization with Mantine providers
