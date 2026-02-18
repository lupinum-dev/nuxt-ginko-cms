# ginko-nuxt

Nuxt module for consuming Convex CMS content with two runtime modes:

- Preview mode: live API access in development.
- Static mode: build-time content caching + optional asset localization for production.

## Features

- Auto-imported composables: `useCmsCollection`, `useCmsItem`, `useCmsRelatedItem`, `useCmsLocale`, `useCmsAssetUrl`, `useCmsSearchIndex`
- Secure server proxy for CMS API requests (`/api/_cms/*`)
- Build hooks for static content cache generation (`public/.cms-cache`)
- Optional asset download and URL rewriting (`public/cms-assets`)
- Locale-aware content + prerender route generation
- Type generation CLI: `cms-nuxt generate-types`

## Installation

```bash
pnpm add ginko-nuxt
```

## Quick Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ginko-nuxt'],

  cmsNuxt: {
    apiUrl: process.env.NUXT_CMS_API_URL || '',
    teamSlug: process.env.NUXT_CMS_TEAM_SLUG || '',
    apiKeyPublic: process.env.NUXT_CMS_API_KEY_PUBLIC,
    apiKeyPreview: process.env.NUXT_CMS_API_KEY_PREVIEW,
    locales: ['en', 'de'],
    defaultLocale: 'en',
    collections: [
      { slug: 'blogs', populate: ['author'], routePattern: '/blog/[slug]' },
      { slug: 'authors' },
      { slug: 'legal', routePattern: '/legal/[slug]' },
    ],
    cacheDir: '.cms-cache',
    assetDir: 'cms-assets',
    localizeAssets: false,
  },
})
```

## Environment Variables

```bash
NUXT_CMS_API_URL=https://your-app.convex.site
NUXT_CMS_TEAM_SLUG=your-team
NUXT_CMS_API_KEY_PUBLIC=...
NUXT_CMS_API_KEY_PREVIEW=...
```

## Composable Example

```ts
const { data, pending, error } = await useCmsCollection('blogs', {
  populate: ['author'],
  limit: 10,
})
```

## CLI

Generate collection item TypeScript types from schema:

```bash
npx cms-nuxt generate-types --output ./app/types/cms.generated.ts
```

## Local Development

```bash
pnpm install
pnpm run dev:prepare
pnpm run dev
pnpm run lint
pnpm run test
pnpm run test:types
pnpm run prepack
```

## Documentation

- Usage guide: `docs/USAGE.md`
- Architecture details: `docs/ARCHITECTURE.md`

## License

MIT
