# Backlog

Open follow-ups from the code review of the `api-wan` app. Grouped by priority.
References use `file:line` from `apps/frontend/` unless noted.

## Blockers (fix before publishing the repo)

- [ ] **Untrack `node_modules`** — 38 pnpm symlink entries are committed under
      `apps/frontend/node_modules` (`git ls-files apps/frontend/node_modules`). They break on
      clone and bloat the repo. Fix: `git rm -r --cached apps/frontend/node_modules` then commit
      (`.gitignore` already lists `node_modules`).
- [ ] **Untrack committed build artifact** — `apps/frontend/vite.config.d.ts` is tracked
      (and `vitest.config.d.ts` / `vitest.live.config.d.ts` / `playwright.config.d.ts` sit
      untracked on disk). They come from `tsc -b`. Untrack and add `*.config.d.ts` to
      `.gitignore` (or stop emitting them in `tsconfig.node.json`).
- [ ] **Push to a public GitHub repo and capture the link** — the task explicitly requires a
      public repo + link. (Human-owned step; not yet done.)

## Logic / correctness

- [ ] **Avoid redundant full-dataset refetch** — `client.ts:55`, `useResourceList.ts`,
      `queryKeys.ts`. The query key includes `page` + `search`, but `fetchList` downloads the
      whole collection every time and slices in memory, so each distinct page/search re-fetches
      all rows under a new cache key. Key the list query by **resource only**, fetch once, then
      paginate/filter client-side (`select` or `useMemo`).
- [ ] **Validate/clamp the `page` search param** — `router.tsx:126`. `Number(search.page ?? 1)`
      turns `?page=foo` into `NaN` and doesn't clamp negatives/overflow; `slice(NaN, NaN)`
      silently yields an empty list. Clamp to an integer ≥ 1 (ideally ≤ `totalPages`).
- [ ] **Fix test-fixture fidelity** — `test/msw/handlers.ts`. `ResourceDetail` test fires an
      unhandled `GET …/films/2/` (Luke links to films 1 and 2; only `films/1` is mocked) → MSW
      error + unresolved link, though the test still passes. Add the missing handler. Also align
      fixture `url` fields to the real swapi.info shape (no trailing slash).
- [ ] **Remove dead `next`/`previous` data** — `client.ts:47-48`. `normalizePageResponse`
      fabricates URLs nothing consumes (UI uses `count` + page math). Drop them or make them
      booleans so they don't imply they're fetchable.
- [ ] **Keep search visible on empty results** — the search input disappears when a query
      returns no results, making it impossible to clear or change the search. Keep the field
      rendered (or at least the controls) so the user can refine their query.

## Style / hygiene

- [ ] **Tighten lint gate** — `package.json:10` uses `--max-warnings 20`. Lint emits 5
      `react-refresh/only-export-components` warnings because `router.tsx` exports `router`
      alongside component definitions. Split the route components into their own file(s) and set
      `--max-warnings 0`.
- [ ] **Justify or remove eslint-disable comments** — `ResourceList.tsx:81`
      (`react-hooks/incompatible-library` on `useReactTable`) and `ThemeToggle.tsx:9`
      (`set-state-in-effect`). The next-themes mounted guard is a legit idiom; add a one-line
      comment explaining each instead of a bare disable.
- [ ] **Resolve doc/working-tree drift** — `resolve.ts` was removed (resolution inlined into
      `ResolvedLink` — fine), and `.pnpmrc.json` shows an uncommitted deletion. Commit/clean the
      working tree intentionally.
- [ ] **Document client-side search/pagination in README** — README implies server-side
      search/pagination; swapi.info returns everything at once, so it's client-side. Add a line
      to "Cuts & assumptions" (the brief asks for assumptions to be recorded).

## Security (low risk — read-only public API, React auto-escaping)

- [ ] **Add security headers to the nginx server** — `Dockerfile:15`. No CSP,
      `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy`. Optional hardening for a
      public deploy.
- [ ] **Optionally restrict `fetchUrl` to the configured base host** — `ResolvedLink` follows
      arbitrary `url` strings from API payloads. Trust boundary is fine for public SWAPI; very
      low priority.

## Notes / nice-to-haves

- [ ] Strengthen the weak `client.test.ts` "supports pagination" assertion (currently only
      checks the result is defined).
- [ ] Consider rendering `opening_crawl` and `"unknown"`/`"n/a"` values more gracefully
      (placeholder for empty/unknown fields).
