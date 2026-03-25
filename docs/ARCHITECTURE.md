# Architecture

Current architectural defaults:

- package: `nuxt-ginko-cms`
- runtime config key: `ginkoCms`
- site DSL: `ginkoCms.site`
- server-BFF query flow through `/api/ginko/*`
- composable-first usage
- explicit hierarchy root documents via `routing.rootSlug` / `routing.rootSlugByLocale`

This module no longer supports or documents the older preview/static split, `cmsGinko`, or `useCms*` examples.

Deeper cross-repo references live in:

- `docs/ginko-mental-model.md`
- `docs/nuxt-module-reference.md`
- `docs/runbooks/seed-new-team-via-mcp.md`
