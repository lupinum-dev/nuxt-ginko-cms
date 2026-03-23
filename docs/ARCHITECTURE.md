# Architecture

The canonical architecture reference lives in the `ginko-cms` repo.

Read these instead of maintaining a second, stale explanation here:

- `docs/ginko-mental-model.md`
- `docs/nuxt-module-reference.md`
- `docs/runbooks/seed-new-team-via-mcp.md`

Current architectural defaults:

- package: `@lupinum/ginko-nuxt`
- runtime config key: `ginkoCms`
- site DSL: `ginkoCms.site`
- server-BFF query flow through `/api/ginko/*`
- composable-first usage
- explicit hierarchy root documents via `routing.rootSlug` / `routing.rootSlugByLocale`

The old Convex preview/static architecture notes are legacy and intentionally removed from the current path.
