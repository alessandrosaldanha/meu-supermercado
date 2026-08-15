# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mercado Vital — e-commerce frontend (supermarket delivery, Maceió/AL) built with React 19 + TypeScript + Vite. Backend is a hosted Xano (no-code) instance, consumed over REST.

Detailed docs live under `docs/`, split by topic so this file stays short:

- [docs/architecture.md](docs/architecture.md) — folder structure, routing table, route guards, pagination, styling approach
- [docs/auth-e-estado.md](docs/auth-e-estado.md) — auth flow (localStorage-based, no context), CartContext, why Toast isn't a shared context
- [docs/api.md](docs/api.md) — `services/api.ts` endpoints, which flows bypass it (Signup, CEP lookup, Orders, Profile), Checkout wizard details
- [docs/known-issues.md](docs/known-issues.md) — known inconsistencies/tech debt found in the codebase, useful before refactoring

## Commands

```bash
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview the production build
```

No test script/framework is configured in this repo (no vitest/jest and no `test` entry in `package.json`).

## Environment

Requires a `.env` at the project root (gitignored, not committed):

```
VITE_API_URL=https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/
```

This is the only env var read by the app (`src/services/api.ts`). Note it does **not** govern every network call — see [docs/api.md](docs/api.md) for the calls that bypass it (Signup, ViaCEP lookup).

## Architecture at a glance

- **Routing**: `react-router-dom` v7, all routes defined in `src/App.tsx`. Two independent guards: `ProtectedRoute` (any logged-in user, checks `localStorage.token`) and `ProtectedAdminRoute` (inline in `App.tsx`, checks `localStorage.userRole`).
- **Auth**: no `AuthContext` — session lives in `localStorage` (`token`, `user`, `userName`, `userRole`), propagated across components via a `window.dispatchEvent(new Event("storage"))` hack. Full details in [docs/auth-e-estado.md](docs/auth-e-estado.md).
- **Cart**: the one real Context in the app, `src/context/CartContext.tsx` (`useCart()`), in-memory only — not persisted across refreshes.
- **API**: single module `src/services/api.ts` (axios instance + Bearer interceptor + global 401 handler). Several flows (checkout, orders, profile updates, signup) make their own inline `api`/`fetch` calls instead of going through it — check [docs/api.md](docs/api.md) before assuming an endpoint has a helper.
- **Styling**: plain per-component `.css` files (no CSS Modules/Tailwind/styled-components), design tokens as CSS custom properties in `src/index.css`.

Before making structural changes (adding a new shared context, centralizing an API call, adding a types folder), check [docs/known-issues.md](docs/known-issues.md) — it lists the existing inconsistencies you'd likely be fixing, so you don't rediscover them from scratch.
