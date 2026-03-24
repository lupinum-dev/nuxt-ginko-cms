# Usage

The current API is:

- package: `@lupinum/ginko-nuxt`
- config key: `ginkoCms`
- site DSL: `ginkoCms.site`
- composables: `useGinkoPage`, `useGinkoList`, `useGinkoNavigation`, `useGinkoNav`, `useGinkoSurround`, `useGinkoSearch`, `queryGinko`
- CLI: `ginko sync-types`, `ginko check`

Typical flow:

1. Define collection routing in `ginkoCms.site.collections`
2. Generate local types with `ginko sync-types`
3. Resolve route-driven pages with `useGinkoPage`
4. Build sidebar sections/groups with `useGinkoNav`
5. Use `useGinkoSurround(..., { scope: 'section' })` when prev/next should stay inside the active section
6. List/search content with `useGinkoList`, `useGinkoSearch`, or `queryGinko`

Use `useGinkoNavigation` only when you need the raw hierarchy tree. For generic docs UIs, prefer `useGinkoNav`.

Canonical documentation lives in the `ginko-cms` repo:

- `docs/nuxt-module-reference.md`
- `docs/runbooks/seed-new-team-via-mcp.md`
- `docs/ginko-mental-model.md`

The old `cmsGinko` / `useCms*` guidance is legacy and should not be used for new work.
