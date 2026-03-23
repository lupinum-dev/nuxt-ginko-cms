# Usage

The current API is:

- package: `@lupinum/ginko-nuxt`
- config key: `ginkoCms`
- site DSL: `ginkoCms.site`
- composables: `useGinkoPage`, `useGinkoItems`, `useGinkoNavigation`, `useGinkoSurround`, `useGinkoSearch`, `queryGinko`
- CLI: `ginko sync-types`, `ginko check`

Typical flow:

1. Define collection routing in `ginkoCms.site.collections`
2. Generate local types with `ginko sync-types`
3. Resolve route-driven pages with `useGinkoPage`
4. List/search content with `useGinkoItems`, `useGinkoSearch`, or `queryGinko`

Canonical documentation lives in the `ginko-cms` repo:

- `docs/nuxt-module-reference.md`
- `docs/runbooks/seed-new-team-via-mcp.md`
- `docs/ginko-mental-model.md`

The old `cmsGinko` / `useCms*` guidance is legacy and should not be used for new work.
