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
- **Styling:** Tailwind CSS v4 with design tokens (OKLCH color space, dark mode support)
- **Rich Text:** TipTap v3 for headless rich text editing
- **Icons:** @tabler/icons-react and lucide-react
- **Package Manager:** pnpm (faster and more efficient than npm)
- **Effector**

### Core Architecture Decisions

1. **Component Library First:** Mantine provides polished components for modals, dropdowns, notifications, date pickers, and spotlight search. Avoid building basic components from scratch.

2. **Styling Strategy:**
   - Tailwind CSS for utility-first styling
   - Mantine components come with built-in Mantine theme colors
   - Global theme variables in `/src/index.css` (OKLCH colors, dark mode)
   - Use the `cn()` utility from `/src/lib/utils.ts` to merge Tailwind classes intelligently

3. **Path Aliases:** Import from `@` instead of relative paths:
   ```typescript
   import { cn } from '@/lib/utils'
   import { SomeComponent } from '@/components/SomeComponent'
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
├── index.css             # Global styles, design system tokens, Tailwind config
├── lib/
│   └── utils.ts          # Utility functions (cn() for class merging)
└── assets/               # Static assets
```

### Important Patterns

**Class Name Merging:** When combining Tailwind classes (especially when overriding), use the `cn()` utility to prevent class conflicts:

```typescript
import { cn } from '@/lib/utils'

export function Button({ className, ...props }) {
  return <button className={cn("px-4 py-2 bg-blue-500", className)} {...props} />
}
```

**Mantine Components:** Prefer using Mantine components over building from scratch:
- `Button`, `Input`, `Modal`, `Notification`, `Select`, `DatePicker` - all provided by Mantine
- Mantine components integrate seamlessly with Tailwind CSS
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
- **State Management:** No global state manager yet (React Context + hooks may suffice initially, but watch for complexity)

### Key Files & Their Purposes

- `vite.config.ts` - Build configuration, path aliases
- `tsconfig.app.json` - TypeScript compiler options (strict mode enabled)
- `src/index.css` - Design tokens, global styles, Tailwind theme
- `src/lib/utils.ts` - Helper functions (`cn()` for class merging)
- `src/main.tsx` - React app initialization with Mantine providers
