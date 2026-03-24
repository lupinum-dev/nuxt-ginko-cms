# @lupinum/ginko-nuxt

Nuxt integration for Ginko CMS with the current composable-first API.

## Current surface

- Configure the module under `ginkoCms`
- Define collection routing and locale policy under `ginkoCms.site`
- Read content through `useGinkoPage`, `useGinkoList`, `useGinkoNavigation`, `useGinkoNav`, `useGinkoSurround`, `useGinkoSearch`, and `queryGinko`
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
const { data: posts } = await useGinkoList('blog', { sort: '-updatedAt' })
const { data: navigation } = await useGinkoNavigation('docs')
const { sections, groups } = useGinkoNav('docs')
const { prev, next } = await useGinkoSurround('docs', { scope: 'section' })
</script>
```

Use `useGinkoNavigation()` when you need the raw hierarchy tree. Use `useGinkoNav()` when you want section/group/item data ready for docs sidebars and switchers.

```ts
const featuredPosts = await queryGinko('blog')
  .sort('updatedAt', 'desc')
  .limit(3)
  .find()

const [prev, next] = await queryGinko('docs').surround('/docs/deploy-overview', {
  scope: 'section',
})
```

## Deeper references

For the full cross-repo mental model and seeding workflow, see the `ginko-cms` repo:

- `docs/nuxt-module-reference.md`
- `docs/runbooks/seed-new-team-via-mcp.md`
- `docs/ginko-mental-model.md`

Legacy `cmsGinko` / `useCms*` examples are intentionally removed from the supported path.
