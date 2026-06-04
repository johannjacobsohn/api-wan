# API Wan Kenobi

A Star Wars themed React SPA that connects to SWAPI (the Star Wars API) and lets you browse all resource types.

## Prerequisites

- Node.js 20+
- pnpm 10+

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Open http://localhost:5173.

## Build

```bash
pnpm build
pnpm preview    # serve the production build locally
```

## Test commands

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `pnpm test`       | Mocked unit/integration tests (Vitest, CI-safe)      |
| `pnpm test:watch` | Watch mode                                           |
| `pnpm test:e2e`   | Playwright e2e tests (SWAPI fully mocked, CI-safe)   |
| `pnpm test:live`  | Real SWAPI smoke tests (manual only — hits live API) |

## Lint, typecheck, format

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm format:check
```

## Environment

| Variable              | Default                  | Description    |
| --------------------- | ------------------------ | -------------- |
| `VITE_SWAPI_BASE_URL` | `https://swapi.info/api` | SWAPI base URL |

Copy `.env.example` to `.env` to override. Fallback mirror: `https://swapi.py4e.com/api`.

## Deployment (Coolify)

- Build pack: Dockerfile
- Base directory: `apps/frontend`
- Domain: `api-wan.codecino.io`
- Build arg: `VITE_SWAPI_BASE_URL` (optional, defaults to `https://swapi.info/api`)

The Dockerfile builds the app with pnpm and serves it via nginx with SPA fallback (all unknown paths rewrite to `/index.html`).

## Cuts & assumptions

- **Config-driven design:** The resource registry in `src/resources/registry.ts` drives all list/detail views. Adding a new resource type is a one-config change.
- **SWAPI base-URL fallback:** If `VITE_SWAPI_BASE_URL` is unset, it defaults to `https://swapi.info/api`. If SWAPI is down, set the env to `https://swapi.py4e.com/api`.
- **Live tests** cover one detail fetch per resource, list fetches, and one related-link resolution. They run manually via `pnpm test:live` and are excluded from CI.
- **No resource types were cut.** All six SWAPI types are implemented (people, films, planets, species, vehicles, starships).
