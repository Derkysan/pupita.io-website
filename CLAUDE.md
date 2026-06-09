# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Type-check then bundle for production (tsc -b && vite build)
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

No test suite is configured.

## Project Context

Marketing/landing site for **Pupita.io**, a software development agency. Currently a single-page site (`/`) with a dark mauve-themed layout. The project is in early development — `HomePage.tsx` still contains placeholder copy.

## Stack

React 19 · TypeScript 5.8 · Vite 7 · Tailwind CSS v4 · Framer Motion 12 · React Router DOM v7 · react-icons v5

## Architecture

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # BrowserRouter + AppRouter only
├── index.css                 # CSS layer imports + @theme font config
├── routers/AppRouter.tsx     # Route definitions
├── hooks/                    # App-wide reusable hooks
├── lib/utils.ts
├── styles/                   # CSS token system (see below)
└── presentation/
    ├── components/           # Feature components (each is a folder)
    └── views/                # Page components (routed directly)
```

The `presentation/` layer is the only UI concern — there is currently no `libs/`, `store/`, or API layer (those are documented in `ARQUITECTURA-FRONTEND-BOILERPLATE.md` as the intended architecture when forms and API calls are added).

### Component folder convention

Every component lives in its own folder with:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── index.ts           # barrel re-export
└── ComponentName.css  # only if needed
```

### Responsive props pattern

`useBreakpoint` returns the active breakpoint (`base | sm | md | lg | xl | 2xl`). Component props that vary by breakpoint use `ResponsiveValue<T>`, resolved at render time with `resolveResponsive(value, breakpoint, fallback)`. Both are exported from `@/hooks`.

### Animation

`TextAnimate` (in `presentation/components/text-pull-up`) drives letter or word stagger animations via Framer Motion. Props: `mode: 'letters' | 'words'`, `stagger`, `delay`.

## CSS Token System

Styles are organized in 4 levels — override at the highest level possible:

| Level | Example | File |
|---|---|---|
| 1 Primitives | `--color-brand-primary-500` | `styles/theme/colors.css` |
| 2 Semantic | `--color-primary` | `styles/theme/colors.css` |
| 3 Application | `--bg-primary`, `--text-primary` | `styles/theme/colors.css` |
| 4 Component | `--btn-primary-bg` | `styles/components/` |

Dark mode uses the `.dark` class on `document.documentElement`. Multi-tenant overrides go in `styles/instances/`.

Font family (Outfit) is declared in `index.css` via the Tailwind v4 `@theme` block — not in a separate token file.

## Path Alias

`@/` resolves to `src/` — configured in both `vite.config.ts` and `tsconfig.json`.

## Future Architecture Reference

`ARQUITECTURA-FRONTEND-BOILERPLATE.md` documents the full intended architecture for adding API calls (Axios + HttpClient interface), server state (React Query), client state (Zustand), and multi-step forms (React Hook Form + Zod). Follow those patterns when implementing those features.
