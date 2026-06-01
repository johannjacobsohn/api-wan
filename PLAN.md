# Implementation Spec: Star Wars SWAPI React App

> This document is a complete, self-contained specification for an implementing agent.
> Follow it as written. Where it says "do not", treat that as a hard constraint.

## 1. Objective

Build a Star Wars themed React single-page app that connects to SWAPI (the Star Wars API)
and lets the user browse all resource types. It is a take-home showcase: prioritize clean,
typed, well-tested code over visual polish. Keep the design minimal and pragmatic.

## 2. Hard constraints

- **Commit as you go: semantic, atomic commits** using **Conventional Commits** messages
  (`feat:`, `fix:`, `test:`, `chore:`, `docs:`, `refactor:`, `ci:`; optional scope, e.g.
  `feat(list):`). Each commit is one coherent change (e.g. `chore: scaffold Vite + TS`,
  `feat: add SWAPI client`, `feat: resource registry`, `feat(list): table view`,
  `test: client unit tests`). Do not squash unrelated work into one commit.
  **Do NOT `git push`** — publishing the repo is owned by the human.
- **Do NOT put live-API tests in CI.** Real SWAPI calls go in a separate manual-only suite.
- Keep total scope pragmatic (target ~4–8 h of effort). If you must cut something, cut
  resource types (the registry makes this trivial) and record it in the README's
  "Cuts & assumptions" section — do not cut the test infrastructure.
- TypeScript everywhere, `tsconfig` in **`strict`** mode; the build must be type-error free.
  No `any` in committed code except where unavoidable and commented.
- **Lint and format must pass.** ESLint + Prettier are configured (see §3); CI fails on
  violations. Enforced locally via **husky**: a `pre-commit` hook runs **lint-staged**
  (ESLint + Prettier on staged files) and a `commit-msg` hook runs **commitlint**
  (`@commitlint/config-conventional`) so every commit matches the Conventional Commits rule.

## 3. Tech stack (exact)

- Package manager: **pnpm** (use `pnpm` for all installs and scripts; commit `pnpm-lock.yaml`).
- Repo layout: **pnpm-workspaces monorepo**. One app today — **`apps/frontend`** (this Vite
  app). Shared dev tooling/config (ESLint, Prettier, husky, commitlint, Renovate, `.nvmrc`)
  lives at the repo root; reserve `packages/*` for shared code added later. App-specific deps
  go in `apps/frontend/package.json`; root holds only workspace-wide tooling.
- Build: **Vite** with the `react-ts` template.
- UI: **React 18 + TypeScript**.
- Routing: **TanStack Router** (`@tanstack/react-router`) — type-safe routes + validated
  search params. Use the code-based route tree (no file-based router plugin required).
- Data fetching: **TanStack Query** (`@tanstack/react-query`) — all SWAPI reads go through
  `useQuery`. The client functions in `api/client.ts` are the query functions; caching,
  loading, and error state come from Query, not hand-rolled. Wrap the app in
  `QueryClientProvider`. Consider adding `@tanstack/react-query-devtools` (dev only).
- Tables: **TanStack Table** (`@tanstack/react-table`) — use it for any tabular UI
  (the resource list table). Headless; render with Pico-styled `<table>` markup.
- Icons: **react-icons** (`react-icons`) — use for nav/resource icons and UI affordances
  (e.g. a distinct icon per resource type in `ResourceNav`, search/pagination/error icons).
- Styling: **Pico CSS** (`@picocss/pico`, classless) + one small custom `src/theme.css`
  for a Star Wars yellow accent (define it with Pico CSS variables so it works in **both**
  light and dark). No Tailwind, no component library.
- Theming: **next-themes** drives a **dark / light / system** toggle (see §7). It works in
  plain React (no Next.js needed); configure `attribute="data-theme"` so it sets Pico's
  `data-theme` on `<html>`, with `enableSystem` and `defaultTheme="system"`. It handles
  persistence and flash-free first paint for us.
- Unit/integration tests: **Vitest** + **@testing-library/react** + **@testing-library/jest-dom**.
- HTTP mocking: **MSW** (`msw`).
- E2E: **Playwright** (`@playwright/test`).
- Lint/format: **ESLint** (keep the Vite react-ts config) + **Prettier** (`prettier`,
  `eslint-config-prettier`). Add `lint`, `format`, and `typecheck` scripts.
- Engine pinning: target **Node 20 LTS** — add `.nvmrc` and a `packageManager` field +
  `engines` pinning the pnpm version so local and CI match.

Setup (monorepo):

```
# root workspace
pnpm init                                   # root package.json (set "private": true)
# add pnpm-workspace.yaml ->  packages: ["apps/*", "packages/*"]
pnpm create vite apps/frontend --template react-ts

# app deps (runtime + app-local dev)
pnpm --filter frontend add @tanstack/react-router @tanstack/react-query \
  @tanstack/react-table react-icons next-themes @picocss/pico
pnpm --filter frontend add -D vitest @testing-library/react @testing-library/jest-dom \
  jsdom msw @playwright/test @tanstack/react-query-devtools

# workspace-wide dev tooling at the root
pnpm add -w -D prettier eslint-config-prettier husky lint-staged \
  @commitlint/cli @commitlint/config-conventional

pnpm --filter frontend exec playwright install --with-deps chromium
pnpm exec husky init
```

## 4. SWAPI reference (everything you need about the API)

Base URL: `https://swapi.info/api` (fallback mirror: `https://swapi.py4e.com/api`).
SWAPI has a history of downtime/TLS issues — make the base URL configurable and document
the fallback (see §6).

**Resource types** (six): `people`, `films`, `planets`, `species`, `vehicles`, `starships`.

**List endpoint:** `GET {base}/{resource}/?page={n}&search={q}` → paginated envelope:

```ts
interface Page<T> {
  count: number;
  next: string | null; // full URL or null
  previous: string | null; // full URL or null
  results: T[];
}
```

- Page size is 10. `films` returns all ~6 in one page (no pagination).
- `search` matches the resource's name/title field on most resources.

**Detail endpoint:** `GET {base}/{resource}/{id}/` → a single object. Every object has a
`url` field like `https://swapi.info/api/people/1/`. Parse the trailing integer for the id.

**Display name field:** `films` uses `title`; all other resources use `name`.

**Fields and which are related-resource URL links** (links are arrays of URLs unless noted):

- `people`: name, height, mass, hair_color, skin_color, eye_color, birth_year, gender;
  links → `homeworld` (single URL), `films`, `species`, `vehicles`, `starships`.
- `films`: title, episode_id, opening_crawl, director, producer, release_date;
  links → `characters`, `planets`, `starships`, `vehicles`, `species`.
- `planets`: name, rotation_period, orbital_period, diameter, climate, gravity, terrain,
  surface_water, population; links → `residents`, `films`.
- `species`: name, classification, designation, average_height, skin_colors, hair_colors,
  eye_colors, average_lifespan, language; links → `homeworld` (single URL), `people`, `films`.
- `vehicles`: name, model, manufacturer, cost_in_credits, length, max_atmosphering_speed,
  crew, passengers, cargo_capacity, consumables, vehicle_class; links → `pilots`, `films`.
- `starships`: name, model, manufacturer, cost_in_credits, length, max_atmosphering_speed,
  crew, passengers, cargo_capacity, consumables, hyperdrive_rating, MGLT, starship_class;
  links → `pilots`, `films`.

A related URL points at another resource; resolving it (GET the URL) yields an object whose
display field (`name`/`title`) is the human-readable label, and whose `url` gives the target
route. Use this for clickable cross-navigation.

## 5. Project structure (pnpm-workspaces monorepo)

```
pnpm-workspace.yaml      // packages: ["apps/*", "packages/*"]
package.json             // root: workspace + shared dev tooling; scripts delegate via --filter
.nvmrc                   // Node 20
.gitignore
.husky/                  // pre-commit: lint-staged; commit-msg: commitlint
commitlint.config.cjs    // Conventional Commits rules (§2)
renovate.json            // dependency automation (§14)
.prettierrc / eslint config  // shared at root, applied across the workspace
apps/
  frontend/              // the api-wan Vite app (only app today)
    package.json         // app deps + scripts (dev/build/preview/test/test:e2e/test:live)
    index.html           // set <title> to the app name (§ app name)
    vite.config.ts
    vitest.config.ts     // jsdom, setupFiles: test/setupTests.ts (excludes test/live/**)
    vitest.live.config.ts// includes only test/live/** (manual)
    playwright.config.ts // baseURL + webServer (pnpm preview) so CI e2e runs the built app
    Dockerfile           // multi-stage build → nginx (SPA fallback) for Coolify (§13)
    .dockerignore        // node_modules, dist, .git, test artifacts
    public/
      favicon.svg        // Star Wars themed favicon
    src/
      api/
        client.ts        // typed fetch wrapper (base URL, page/search params, error normalize)
        types.ts         // Page<T> + per-resource interfaces + ResourceType union
        resolve.ts       // resolve a related URL (or array) into { id, label, resource, url }
        parseUrl.ts      // extract { resource, id } from a SWAPI url
      resources/
        registry.ts      // ResourceType -> { endpoint, label, displayField, listColumns,
                         //   detailFields, linkFields }
      hooks/
        queryKeys.ts         // query-key factory: list(resource,page,search), detail(resource,id), url(u)
        useResourceList.ts   // useQuery wrapper around client.fetchList -> Page<T>
        useResourceDetail.ts // useQuery wrapper around client.fetchDetail; resolves links via Query
      components/
        ThemeToggle.tsx      // dark / light / system via next-themes useTheme (react-icons)
        ResourceNav.tsx      // links to all six resources (react-icons per resource)
        ResourceList.tsx     // debounced search + TanStack Table + pagination
        ResourceDetail.tsx   // detail fields + resolved clickable links
        ErrorBoundary.tsx    // top-level React error boundary for unexpected crashes
        NotFound.tsx         // 404 view (unknown resource / missing record)
        Loading.tsx
        ErrorState.tsx
        Empty.tsx
      routes/                // TanStack Router route definitions (code-based)
      router.tsx             // route tree + Router instance
      queryClient.ts         // shared QueryClient instance (§6 defaults)
      theme.css              // Star Wars accent over Pico
      main.tsx               // @picocss/pico + theme.css; ErrorBoundary > ThemeProvider (next-themes) > QueryClientProvider > RouterProvider
    test/
      setupTests.ts          // jest-dom matchers + MSW server lifecycle (beforeAll/afterEach/afterAll)
      msw/handlers.ts        // mocked SWAPI responses + fixtures
      msw/server.ts          // setupServer for node (vitest)
      renderWithProviders.tsx// test helper: wraps in QueryClientProvider (retry: false)
      *.test.ts(x)           // unit/integration tests (mocked)
      live/*.live.test.ts    // REAL SWAPI tests (manual only — see §8)
    e2e/
      *.spec.ts              // Playwright (SWAPI fully mocked)
```

Paths in §6–§8 are relative to `apps/frontend/`. Root `package.json` scripts delegate, e.g.
`"dev": "pnpm --filter frontend dev"`, `"test": "pnpm --filter frontend test"`.

## 6. API client & data fetching

**Client (`src/api/client.ts`)**

- Read base URL from `import.meta.env.VITE_SWAPI_BASE_URL`, defaulting to
  `https://swapi.info/api`. Document `swapi.py4e.com/api` as the fallback in README and
  `.env.example`.
- `fetchList(resource, { page, search })` → `Page<T>`; `fetchDetail(resource, id)` → `T`;
  `fetchUrl(url)` → `T` (for resolving related links).
- Normalize errors: throw a typed error with `{ status?, message }` for non-2xx responses
  and for network failures. No silent failures.

**TanStack Query config (`src/queryClient.ts`)**

- SWAPI data is effectively immutable: set `staleTime` high (e.g. 1 h) and a generous
  `gcTime`; disable `refetchOnWindowFocus`; `retry: 1` (tests override to `retry: false`).

**Related-link resolution (avoid N+1 slowness)**

- A detail object can link to many related URLs (films, species, pilots, …). Resolve them
  **in parallel** (e.g. `useQueries`, one query per `fetchUrl`) keyed by the URL so the
  Query cache **dedupes** repeated URLs across the app. Render each resolved name as it
  arrives with a lightweight placeholder while pending — do **not** block the whole detail
  page on link resolution, and do **not** fetch links serially. For very large link lists,
  consider lazy/capped resolution and note any cap in the README.

## 7. Routing (TanStack Router, code-based)

- `/` → landing page rendering `ResourceNav`.
- `/$resource` → list. Validate the `$resource` param against the six known types (404/redirect
  otherwise). Validate search params with a schema: `page: number = 1`, `search: string = ''`.
  Pagination and search update the typed search params (URL is the source of truth).
- `/$resource/$id` → detail. Validate `$resource`; `$id` is a string/number.
- Use `<Link>` for navigation so search-param state stays in the URL and is shareable.
- **Not found:** an unknown `$resource`, or a detail id that 404s, renders the `NotFound`
  view via the router's not-found handling. Wrap the tree in `ErrorBoundary` for unexpected
  errors.
- **Debounced search:** the search input debounces (~300 ms) before updating the `search`
  param / firing the query.

### Theme toggle (dark / light / system) — next-themes

- Wrap the app in next-themes `ThemeProvider` with `attribute="data-theme"`,
  `defaultTheme="system"`, `enableSystem`, and `themes={['light','dark']}` so it writes
  Pico's `data-theme` on `<html>`.
- `ThemeToggle` uses next-themes' `useTheme()` (`theme`, `setTheme`, `resolvedTheme`) to
  switch between **dark**, **light**, and **system**, with a react-icons glyph per state.
- next-themes handles `localStorage` persistence, live OS-preference changes, and flash-free
  first paint — no manual inline script needed.
- next-themes renders nothing theme-dependent until mounted; guard any icon that depends on
  `resolvedTheme` against the initial undefined render to avoid a hydration/SSR-style flash.

## 8. Testing

Add these `package.json` scripts (run with `pnpm <script>`):

```jsonc
{
  "test": "vitest run", // mocked only — CI safe
  "test:watch": "vitest",
  "test:e2e": "playwright test", // mocked network — CI safe
  "test:live": "vitest run -c vitest.live.config.ts", // REAL SWAPI — manual only
}
```

- **Mocked unit/integration (`*.test.ts(x)`, in `test`):** drive the client through MSW.
  Cover: list URL/param construction (page + search), envelope parsing, detail parsing,
  related-link resolution (single URL and arrays), and error paths (404, 500, network
  failure). Add component tests for `ResourceList` (renders rows, search input, pagination
  controls) and `ResourceDetail` (renders fields + resolved links). MSW handlers live in
  `test/msw/` with small fixtures. Component/hook tests that use TanStack Query must render
  inside a `QueryClientProvider` with a fresh `QueryClient` configured with
  `retry: false` (provide a small `renderWithProviders` test helper).
- **E2E (`e2e/*.spec.ts`, Playwright):** SWAPI is **always mocked** — e2e must never make a
  real network call to SWAPI (no live e2e variant). Intercept every SWAPI request at the
  browser level (Playwright `page.route('**/api/**', …)` or an MSW browser worker) and serve
  fixtures; assert mocks are hit and fail the test on any unmocked SWAPI request. Cover:
  landing → pick a resource → list loads → search narrows results → paginate → open a detail
  → resolved related link is clickable and navigates → error state renders when a route 500s
  → 404 view renders for an unknown resource. Include one basic accessibility assertion
  (axe check, or role/label queries) on a key page. `playwright.config.ts` sets `baseURL`
  and a `webServer` (e.g. `pnpm preview`) so CI builds then tests the real app bundle.
- **Live (`test/live/*.live.test.ts`, in `test:live` only):** hit real SWAPI. Smoke each
  resource list, fetch one detail per resource, and assert the documented field shapes +
  one related-link resolution still hold. Use a dedicated `vitest.live.config.ts` that only
  includes `test/live/**` so the default `vitest run` never picks these up. **These must not
  run in CI.**

## 9. CI (`.github/workflows/ci.yml`)

GitHub Actions on push/PR using **pnpm** (e.g. `pnpm/action-setup` + `actions/setup-node`
with `cache: pnpm`): `pnpm install --frozen-lockfile` at the workspace root, then run the
root delegating scripts — `pnpm lint`, `pnpm typecheck`, `pnpm test` — install the Playwright
browser and run `pnpm test:e2e` (each forwards to `--filter frontend`). **Do not** run
`test:live`. No live SWAPI calls anywhere in CI.

## 10. README.md

Include: what the app does, prerequisites (Node 20, pnpm), setup (`pnpm install`), how to run
(`pnpm dev`), all test commands (clear note that `test:live` hits the real API and is
manual-only), `lint`/`typecheck`/`format`, and the Coolify deployment notes (§13). Add a
**"Cuts & assumptions"** section documenting: the generic config-driven design choice, the
SWAPI base-URL fallback, what the live-only tests cover, and any resource types or features
dropped for time.

## 11. Implementation order

Make a semantic, atomic commit after each step (see §2).

1. Init the monorepo: root `package.json` (`private: true`) + `pnpm-workspace.yaml`; scaffold
   the Vite `react-ts` app into `apps/frontend`; install deps (§3); add `.nvmrc` (Node 20) +
   pin pnpm (`packageManager`/`engines`); configure root ESLint + Prettier + strict
   `tsconfig`, and root delegating `lint`/`format`/`typecheck`/`dev`/`build` scripts
   (`--filter frontend`); set up husky + lint-staged + commitlint (§2); set `index.html`
   `<title>` + themed `public/favicon.svg`; wire Pico + `theme.css`, `ErrorBoundary`, and
   `QueryClientProvider` (shared `queryClient.ts` with the §6 defaults) in `main.tsx`.
2. `api/types.ts`, `api/parseUrl.ts`, `api/client.ts`, `api/resolve.ts`.
3. `resources/registry.ts` for all six resources (fields + link fields from §4).
4. Query layer: `hooks/queryKeys.ts`, `useResourceList`, `useResourceDetail` (TanStack Query,
   parallel/deduped link resolution per §6).
5. TanStack Router setup (`router.tsx`, `routes/`) with validated params/search + not-found.
6. Components: `ResourceNav` (react-icons), `ThemeToggle` (next-themes, dark/light/system),
   `ResourceList` (TanStack Table, debounced search), `ResourceDetail`, `NotFound`,
   `ErrorBoundary`, `Loading`/`ErrorState`/`Empty`.
7. Test config (`vitest.config.ts` + `test/setupTests.ts`) + MSW handlers/fixtures +
   `renderWithProviders` helper; write mocked unit/integration tests.
8. `playwright.config.ts` (webServer) + e2e with **SWAPI fully mocked** (incl. a11y assertion).
9. Live suite + `vitest.live.config.ts`.
10. CI workflow (pnpm); Coolify deploy config (§13, Dockerfile + nginx SPA fallback);
    `renovate.json` (§14).
11. README with "Cuts & assumptions".
12. Do NOT push — leave the published-repo step to the human.

## 12. Acceptance criteria

- `pnpm dev` serves an app whose landing page links to all six resources.
- Each resource list paginates and searches (TanStack Table); loading/error/empty states
  are explicit. All data fetching goes through TanStack Query.
- Detail pages resolve related links into clickable names that navigate across resources.
- `pnpm test` (mocked) and `pnpm test:e2e` (mocked) pass and make no live network calls.
- `pnpm test:live` exists, hits real SWAPI, and is excluded from `pnpm test` and CI.
- `pnpm lint` and `pnpm typecheck` pass; code is Prettier-formatted.
- Unknown routes render the 404 view; a top-level error boundary is in place; search is debounced.
- Theme toggle switches dark/light/system, persists across reloads, and has no flash of wrong theme.
- README documents setup, all test commands, and cuts/assumptions.
- App builds and serves correctly behind Coolify (see §13).
- History is a series of semantic, atomic Conventional Commits; nothing has been pushed.

## 13. Deployment (Coolify)

Deployed via **Coolify** at `https://api-wan.codecino.io` (app name is `api-wan`; see below).

- **Coolify base directory = `apps/frontend`** (build context), using its `Dockerfile`.
  In a workspace build, copy the root `pnpm-lock.yaml` + `pnpm-workspace.yaml` and install
  with `--filter frontend` (or build from the repo root with the app as the target).
- **Static SPA served by a tiny web server.** Multi-stage `Dockerfile`: stage 1 builds with
  `node:20` (`corepack enable && pnpm install --frozen-lockfile && pnpm --filter frontend build`),
  stage 2 serves `apps/frontend/dist/` with nginx (or Caddy) on port 80.
- **SPA fallback is required** — TanStack Router uses client-side routes, so the server must
  rewrite unknown paths to `/index.html` (nginx `try_files $uri $uri/ /index.html;`).
  Otherwise deep links like `/people/1` 404 on refresh.
- **Vite env is build-time.** `VITE_SWAPI_BASE_URL` is baked at build, not runtime — set it
  as a Coolify build arg/env so the deployed app points at the intended SWAPI base.
- Expose port 80; add a simple healthcheck on `/`. Document the Coolify setup (build pack =
  Dockerfile, domain, build env) briefly in the README.

## App name

App name is **`api-wan`** (a pun on Obi-Wan Kenobi + the SWAPI API). Used in: `index.html`
`<title>`, the header, the README, the favicon, and the Coolify subdomain
**`api-wan.codecino.io`**. Keep the display name in one place (a constant) so a later rename
is a one-line change.

## 14. Dependency automation (Renovate)

- Add a **Renovate** config at the repo root (`renovate.json`) so dependencies stay current
  after hand-off.
- Extend the recommended presets and enable lockfile maintenance, e.g.:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":dependencyDashboard", ":semanticCommits"],
  "lockFileMaintenance": { "enabled": true },
  "packageRules": [
    { "matchUpdateTypes": ["minor", "patch"], "automerge": true },
    { "matchPackagePatterns": ["^@tanstack/"], "groupName": "tanstack" }
  ]
}
```

- `:semanticCommits` keeps Renovate PRs consistent with the Conventional Commits rule (§2).
- Renovate runs as a GitHub App / on the platform side — no extra CI job is required.
