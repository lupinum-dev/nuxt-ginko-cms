# @lupinum/ginko-nuxt

Nuxt integration for Ginko CMS with the current composable-first API.

## Current surface

- Configure the module under `ginkoCms`
- Define site routing under `ginkoCms.site`
- Use `useGinkoPage`, `useGinkoItems`, `useGinkoNavigation`, `useGinkoSurround`, and `queryGinko`
- Generate types with the `ginko` CLI

## Install

```bash
pnpm add @lupinum/ginko-nuxt
```

```ts
export default defineNuxtConfig({
  modules: ["@lupinum/ginko-nuxt"],
})
```

## Required env

```bash
NUXT_GINKO_CMS_KEY=gink_...
```

Optional:

```bash
NUXT_GINKO_CMS_BASE=https://site.ginko-cms.com
NUXT_GINKO_CMS_LOCALE=en
NUXT_GINKO_CMS_TIMEOUT_MS=8000
```

## Minimal config

```ts
export default defineNuxtConfig({
  modules: ["@lupinum/ginko-nuxt"],
  ginkoCms: {
    site: {
      defaultLocale: "en",
      locales: [{ code: "en", hreflang: "en-US", isDefault: true }],
      routing: { localePrefixStrategy: "none" },
      collections: {
        blog: {
          kind: "flat",
          source: "blog-posts",
          routing: { prefix: "/blog" },
        },
        docs: {
          kind: "hierarchy",
          source: "docs",
          routing: {
            baseSegment: "docs",
            rootSlug: "quick-start",
          },
          includeFolders: true,
        },
      },
    },
  },
})
```

## Canonical docs

The single source of truth is the `ginko-cms` repo:

- `docs/nuxt-module-reference.md`
- `docs/runbooks/seed-new-team-via-mcp.md`
- `docs/ginko-mental-model.md`

The older `cmsGinko` / `useCms*` documentation is no longer current.
