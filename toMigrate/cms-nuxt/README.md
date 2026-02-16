# @lupinum/cms-nuxt

Nuxt module for consuming the Convex CMS public API.

## Features

- **Preview Mode**: Real-time API calls during development
- **Production Mode**: Static SSG with cached content and downloaded assets
- **Locale Support**: Multi-language content with fallback chains
- **Auto-imports**: Composables are automatically available in your app

## Installation

```bash
pnpm add @lupinum/cms-nuxt
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@lupinum/cms-nuxt'],

  cmsNuxt: {
    apiUrl: 'https://xxx.convex.site',
    apiKey: process.env.CMS_API_KEY,
    teamSlug: 'your-team',

    locales: ['en', 'de'],
    defaultLocale: 'en',

    collections: [
      { slug: 'blogs', populate: ['author'], routePattern: '/blog/[slug]' },
      { slug: 'authors' },
      { slug: 'legal', routePattern: '/legal/[slug]' },
    ],

    // Optional: force preview mode
    // preview: true,

    // Asset directory (relative to public/)
    assetDir: 'cms-assets',

    // Cache directory for static content
    cacheDir: '.cms-cache',
  }
})
```

## Composables

### useCmsCollection

Fetch a list of items from a CMS collection.

```ts
const { data, pending, error } = await useCmsCollection('blogs', {
  locale: 'en',
  populate: ['author'],
  limit: 10,
})

// data.value = { items: [...], total: 42, locale: 'en' }
```

### useCmsItem

Fetch a single item by slug.

```ts
const { data } = await useCmsItem('blogs', 'my-post', {
  locale: 'en',
  populate: ['author'],
})

// data.value = { id, slug, title, content, author: {...}, _locale, _fallback }
```

### useCmsLocale

Manage the current locale.

```ts
const { locale, locales, setLocale, defaultLocale } = useCmsLocale()

// Get current locale
console.log(locale.value) // 'en'

// Change locale
setLocale('de')
```

### useCmsAssetUrl

Get mode-aware asset URLs.

```ts
const imageUrl = useCmsAssetUrl(item.featuredImage)

// Preview mode: https://xxx.convex.cloud/api/storage/abc123
// Production mode: /cms-assets/abc123.webp
```

## Mode Detection

| Priority | Condition | Result |
|----------|-----------|--------|
| 1 | `options.preview === true/false` | Use explicit value |
| 2 | `NUXT_CMS_PREVIEW=true` env var | Preview mode |
| 3 | Development mode | Preview mode |
| 4 | Production build | Static mode |

## Build-Time Processing

During production builds (`nuxt generate`), the module:

1. Fetches all content from configured collections
2. Downloads all referenced assets to `public/cms-assets/`
3. Transforms asset URLs in content (MDC and direct fields)
4. Caches transformed content to `public/.cms-cache/`
5. Generates prerender routes based on `routePattern` config

## Environment Variables

- `NUXT_CMS_API_URL` - Convex site URL
- `NUXT_CMS_API_KEY` - CMS API key
- `NUXT_CMS_TEAM_SLUG` - Team slug
- `NUXT_CMS_PREVIEW` - Force preview mode (`true`/`false`)

## License

MIT
