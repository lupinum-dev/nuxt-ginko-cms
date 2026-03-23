# @lupinum/ginko-nuxt

Nuxt integration for Ginko CMS with the current composable-first API.

## Current surface

- Configure the module under `ginkoCms`
- Define collection routing and locale policy under `ginkoCms.site`
- Read content through `useGinkoPage`, `useGinkoItems`, `useGinkoNavigation`, `useGinkoSurround`, `useGinkoSearch`, and `queryGinko`
- Generate `ginko.generated.ts` and `ginko.module.d.ts` with the `ginko` CLI

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

## Example usage

```vue
<script setup lang="ts">
const { data: page } = await useGinkoPage('docs', { includeBody: true })
const { data: posts } = await useGinkoItems('blog', { sort: ['updatedAt', 'desc'] })
const { data: navigation } = useGinkoNavigation('docs')
</script>
```

```ts
const featuredPosts = await queryGinko('blog')
  .sort('updatedAt', 'desc')
  .limit(3)
  .find()
```

## Deeper references

For the full cross-repo mental model and seeding workflow, see the `ginko-cms` repo:

- `docs/nuxt-module-reference.md`
- `docs/runbooks/seed-new-team-via-mcp.md`
- `docs/ginko-mental-model.md`

Legacy `cmsGinko` / `useCms*` examples are intentionally removed from the supported path.
