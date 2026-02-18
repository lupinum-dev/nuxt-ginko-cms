# ginko-nuxt - Developer Documentation

> Central reference for understanding, maintaining, and extending the CMS Nuxt module.

## Overview

`ginko-nuxt` is a Nuxt 3 module that connects to the Convex CMS public API. It supports two modes:

| Mode | Use Case | Data Source | Assets |
|------|----------|-------------|--------|
| **Preview** | Development, content editing | Live API calls | Remote Convex storage URLs |
| **Production** | Static site generation (SSG) | Pre-built JSON cache | Downloaded local files |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Nuxt Application                         │
├─────────────────────────────────────────────────────────────────┤
│  Pages/Components                                                │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Composables (Auto-imported)                 │    │
│  │  • useCmsCollection() - Fetch list of items              │    │
│  │  • useCmsItem()       - Fetch single item by slug        │    │
│  │  • useCmsRelatedItem()- Fetch related item by ID         │    │
│  │  • useCmsLocale()     - Get/set current locale           │    │
│  │  • useCmsAssetUrl()   - Transform asset URLs             │    │
│  └─────────────────────────────────────────────────────────┘    │
│       │                                                          │
│       ▼                                                          │
│  ┌──────────────┐              ┌──────────────────────────┐     │
│  │ Preview Mode │              │    Production Mode        │     │
│  │              │              │                           │     │
│  │  /api/_cms/*  │              │  Server: File system      │     │
│  │  proxy route │              │  Client: $fetch from      │     │
│  │      │       │              │          public/*.json    │     │
│  │      ▼       │              │                           │     │
│  │  Convex API  │              │  public/.cms-cache/       │     │
│  │  (real-time) │              │  public/cms-assets/       │     │
│  └──────────────┘              └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### Module Options

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ginko-nuxt'],

  cmsGinko: {
    // Required
    apiUrl: 'https://xxx.convex.site', // Convex HTTP API URL
    apiKey: 'your-api-key', // CMS API key (kept server-side)
    teamSlug: 'your-team', // Team identifier in CMS

    // Localization
    locales: ['en', 'de'], // Available locales
    defaultLocale: 'en', // Fallback locale

    // Collections
    collections: [
      {
        slug: 'blogs', // Collection slug in CMS
        populate: ['author'], // Relations to populate
        routePattern: '/blog/[slug]', // Route pattern for prerendering
      },
      {
        slug: 'authors', // No routePattern = no prerendered routes
      },
    ],

    // Optional
    preview: undefined, // Auto: true in dev, false in build
    assetDir: 'cms-assets', // Asset download directory (in public/)
    cacheDir: '.cms-cache', // Cache directory (in public/)

    // Route Generation Strategy (for prerendering)
    localePrefix: 'no_prefix', // See "Locale Prefix Strategies" below
  },
})
```

### Locale Prefix Strategies

Controls how routes are generated during `nuxt generate`:

| Strategy | Default Locale | Other Locales | Example |
|----------|---------------|---------------|---------|
| `no_prefix` | `/blog/slug` | `/blog/slug` | Single route, locale from cookie/state |
| `prefix_except_default` | `/blog/slug` | `/de/blog/slug` | Default has no prefix |
| `prefix_all` | `/en/blog/slug` | `/de/blog/slug` | All locales prefixed |

**Choose based on your i18n setup:**
- `no_prefix`: Using `@nuxtjs/i18n` with `strategy: 'no_prefix'`
- `prefix_except_default`: Using `strategy: 'prefix_except_default'`
- `prefix_all`: Using `strategy: 'prefix'` or `strategy: 'prefix_and_default'`

### Environment Variables

```bash
NUXT_CMS_API_URL=https://xxx.convex.site
NUXT_CMS_API_KEY=your-api-key
NUXT_CMS_TEAM_SLUG=your-team
NUXT_CMS_PREVIEW=true  # Force preview mode in production
```

## Build Process

### Preview Mode (Development)

```
pnpm dev
```

1. Module initializes with `preview: true`
2. Composables make real-time API calls via `/api/_cms/*` proxy
3. API key is kept server-side (never exposed to client)
4. Assets served directly from Convex storage URLs

**Data Flow:**
```
Component → useCmsCollection() → /api/_cms/blogs → Convex API → Response
```

### Production Mode (Static Generation)

```
pnpm generate
```

**Build Pipeline:**

```
1. nitro:init
   └── Register build hooks

2. prerender:routes
   └── Generate routes from collections with routePattern
       └── Apply localePrefix strategy
       └── Add to Nitro's prerender list

3. prerender:init
   └── Process CMS content:
       a. Clear existing cache
       b. Fetch all items for each collection/locale
       c. Extract Convex storage URLs from content
       d. Download all assets to public/cms-assets/
       e. Transform content (replace storage URLs with local paths)
       f. Write JSON cache to public/.cms-cache/

4. Prerender pages
   └── Composables detect server context
       └── Read from file system (not HTTP)
       └── Content rendered into static HTML

5. Output
   └── .output/public/
       ├── .cms-cache/          # JSON content cache
       │   ├── en/
       │   │   ├── blogs/
       │   │   │   ├── index.json
       │   │   │   └── my-post.json
       │   │   └── authors/
       │   └── de/
       ├── cms-assets/          # Downloaded images
       │   ├── uuid1.png
       │   └── uuid2.jpg
       ├── blog/
       │   └── my-post/
       │       └── index.html   # Prerendered page
       └── index.html
```

## Composables

### useCmsCollection()

Fetch a list of items from a collection.

```typescript
const { data, pending, error, refresh } = await useCmsCollection('blogs', {
  locale: 'en', // Optional, defaults to current locale
  populate: ['author'], // Optional, relations to populate
  limit: 10, // Optional, pagination
  offset: 0, // Optional, pagination
  key: 'my-key', // Optional, custom cache key
})

// data.value = { items: CmsItem[], total: number, locale: string }
```

**Behavior:**
| Context | Preview Mode | Production Mode |
|---------|--------------|-----------------|
| Server (SSR/SSG) | API via proxy | File system read |
| Client | API via proxy | HTTP fetch from `/.cms-cache/` |

### useCmsItem()

Fetch a single item by slug.

```typescript
const { data, pending, error } = await useCmsItem('blogs', 'my-post-slug', {
  locale: 'en',
  populate: ['author'],
})

// data.value = { id, slug, title, content, author, _locale, _fallback }
```

### useCmsRelatedItem()

Fetch a related item by ID (for populating relations client-side).

```typescript
const { data: author } = await useCmsRelatedItem('authors', post.value?.authorId)
```

### useCmsLocale()

Manage the current CMS locale.

```typescript
const { locale, setLocale, locales } = useCmsLocale()

// locale.value = 'en'
// locales = ['en', 'de']
setLocale('de')
```

### useCmsAssetUrl()

Transform asset URLs (useful if you need manual control).

```typescript
const { getAssetUrl } = useCmsAssetUrl()

const localUrl = getAssetUrl('https://xxx.convex.cloud/api/storage/abc123')
// Preview: returns original URL
// Production: returns '/cms-assets/abc123.png'
```

## File Structure

```
packages/cms-nuxt/
├── src/
│   ├── module.ts                    # Nuxt module entry point
│   └── runtime/
│       ├── types/
│       │   ├── index.ts             # Module & config types
│       │   └── api.ts               # API response types
│       ├── composables/
│       │   ├── useCmsCollection.ts
│       │   ├── useCmsItem.ts
│       │   ├── useCmsRelatedItem.ts
│       │   ├── useCmsLocale.ts
│       │   └── useCmsAssetUrl.ts
│       └── server/
│           ├── api/
│           │   └── cms/
│           │       ├── [...path].ts  # API proxy (preview mode)
│           ├── nitro/
│           │   └── cms-build.ts      # Build hooks (production)
│           └── utils/
│               ├── cms-client.ts     # Convex API client
│               ├── content-cache.ts  # Cache read/write utilities
│               └── asset-downloader.ts
```

## Key Implementation Details

### Why File System Reads During Prerender?

During `nuxt generate`, pages are prerendered in a Node.js environment. The composables run server-side, but there's **no HTTP server** serving the `public/` directory yet.

```typescript
// In composables, we detect server context:
if (import.meta.server) {
  // Direct file system read
  const { readCachedCollectionIndex } = await import('../server/utils/content-cache')
  return readCachedCollectionIndex(options, locale, collection)
}
else {
  // Client-side: HTTP fetch from static files
  return $fetch(`/.cms-cache/${locale}/${collection}/index.json`)
}
```

The dynamic import inside `import.meta.server` block is tree-shaken from client bundles.

### Asset URL Transformation

During build, Convex storage URLs are replaced with local paths:

```
Before: https://shiny-condor-497.convex.cloud/api/storage/abc123
After:  /cms-assets/abc123.png
```

This happens in `cms-build.ts`:
1. `extractStorageUrlsFromContent()` - Finds all storage URLs in content
2. `downloadAssetsFromUrls()` - Downloads to `public/cms-assets/`
3. `transformItemStorageUrls()` - Replaces URLs in cached JSON

### API Proxy Security

The API key is never exposed to the client:

```typescript
// Server route: /api/_cms/[...path].ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.cmsGinkoApiKey // Server-only

  // Forward request to Convex with auth header
  return $fetch(convexUrl, {
    headers: { Authorization: `Bearer ${apiKey}` }
  })
})
```

## Common Patterns

### Page with CMS Content

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: post, error } = await useCmsItem('blogs', slug, {
  populate: ['author'],
})

if (error.value || !post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}
</script>

<template>
  <article>
    <h1>{{ post.title }}</h1>
    <img :src="post.featuredImage" :alt="post.title">
    <div v-html="post.content" />
  </article>
</template>
```

### Collection Listing

```vue
<!-- pages/blog/index.vue -->
<script setup lang="ts">
const { data } = await useCmsCollection('blogs')
</script>

<template>
  <div>
    <article v-for="post in data?.items" :key="post.id">
      <NuxtLink :to="`/blog/${post.slug}`">
        {{ post.title }}
      </NuxtLink>
    </article>
  </div>
</template>
```

### Locale Switching

```vue
<script setup lang="ts">
const { locale, setLocale, locales } = useCmsLocale()
</script>

<template>
  <button
    v-for="loc in locales"
    :key="loc"
    :class="{ active: locale === loc }"
    @click="setLocale(loc)"
  >
    {{ loc.toUpperCase() }}
  </button>
</template>
```

## Troubleshooting

### "Failed to load cached content" during generate

**Cause:** Cache files not written before pages prerender.

**Solution:** Ensure `prerender:init` hook runs before pages. Check that API credentials are correct and collections are configured.

### Routes generated with wrong locale prefix

**Cause:** `localePrefix` option doesn't match your i18n strategy.

**Solution:** Set `localePrefix` to match your `@nuxtjs/i18n` strategy:
```typescript
cmsGinko: {
  localePrefix: 'no_prefix', // or 'prefix_except_default' or 'prefix_all'
}
```

### Images 404 in production

**Cause:** Asset download failed or URL transformation didn't work.

**Solution:**
1. Check build logs for download errors
2. Verify `assetDir` matches your config
3. Check if Convex storage URLs are in expected format

### Preview mode not working

**Cause:** API proxy not registered or credentials missing.

**Solution:**
1. Check `NUXT_CMS_API_KEY` is set
2. Verify `/api/_cms/*` routes are registered (check server logs)
3. Test API directly: `curl https://xxx.convex.site/api/public/...`

## Testing

### Test Production Build Locally

```bash
# Build static site
pnpm generate --dotenv .env.local

# Preview
npx serve .output/public

# Or use Nuxt preview
pnpm preview
```

### Verify Cache Contents

```bash
# Check cache structure
ls -la .output/public/.cms-cache/en/blogs/

# Verify content
cat .output/public/.cms-cache/en/blogs/index.json | jq .

# Check assets downloaded
ls -la .output/public/cms-assets/
```

## Version History

| Version | Changes |
|---------|---------|
| 1.0.0 | Initial release with preview/production modes |
| 1.1.0 | Added `localePrefix` option for route generation |
| 1.1.0 | Fixed prerender cache access (file system reads) |
