# @lupinum/cms-nuxt Usage Guide

A Nuxt module for consuming content from Convex CMS with support for preview mode (real-time API) and production mode (static SSG).

## Installation

```bash
pnpm add @lupinum/cms-nuxt
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@lupinum/cms-nuxt'],

  cmsNuxt: {
    apiUrl: 'https://your-app.convex.site',
    apiKey: process.env.NUXT_CMS_API_KEY,
    teamSlug: 'your-team',
    locales: ['en', 'de'],
    defaultLocale: 'en',
    collections: [
      { slug: 'blogs', routePattern: '/blog/[slug]' },
      { slug: 'authors' },
      { slug: 'legal', routePattern: '/legal/[slug]' },
    ],
    // Optional: force preview mode (defaults to dev mode)
    // preview: true,
  },
})
```

### Environment Variables

Create a `.env` or `.env.local` file:

```env
NUXT_CMS_API_KEY=your-api-key-here
```

## Composables

### useCmsCollection

Fetch a list of items from a collection.

```typescript
const { data, pending, error } = await useCmsCollection('blogs', {
  locale: 'en', // Optional: defaults to current locale
  limit: 10, // Optional: pagination
  offset: 0, // Optional: pagination
})

// data.value = { items: [...], total: 42, locale: 'en' }
```

### useCmsItem

Fetch a single item by slug.

```typescript
const { data, pending, error } = await useCmsItem('blogs', 'my-post', {
  locale: 'en', // Optional: defaults to current locale
})

// data.value = { id, slug, title, content, ... }
```

### useCmsLocale

Manage locale state.

```typescript
const { locale, locales, setLocale, defaultLocale } = useCmsLocale()

// Get current locale
console.log(locale.value) // 'en'

// Change locale
setLocale('de')

// Available locales
console.log(locales.value) // ['en', 'de']
```

### useCmsAssetUrl

Resolve asset URLs (handles preview vs production modes).

```typescript
const imageUrl = useCmsAssetUrl(item.featuredImage)
// Preview: https://convex.cloud/api/storage/uuid
// Production: /cms-assets/abc123.webp
```

## Relation Population (Client-Side)

The API returns relation fields as IDs. To display related content, fetch the related collection and match by ID:

```vue
<script setup>
// Fetch the blog post
const { data: post } = await useCmsItem('blogs', slug)

// Fetch all authors for client-side population
const { data: authorsData } = await useCmsCollection('authors')

// Resolve author from ID
const author = computed(() => {
  if (!post.value?.author)
    return null

  // If already an object, use it directly
  if (typeof post.value.author === 'object') {
    return post.value.author
  }

  // Otherwise find by ID
  return authorsData.value?.items.find(a => a.id === post.value.author) || null
})
</script>

<template>
  <AuthorCard v-if="author" :author="author" />
</template>
```

### Why Client-Side Population?

- **No backend changes needed** - Works with the existing Convex API
- **Simple and predictable** - Easy to understand and debug
- **Efficient for small collections** - Authors, categories, etc. are typically small
- **Cached automatically** - Nuxt's `useAsyncData` handles caching

## Locale Switching

The composables automatically refetch when the locale changes:

```vue
<script setup>
const { locale, setLocale, locales } = useCmsLocale()
const { data: post } = await useCmsItem('blogs', 'my-post')
// Post will automatically refetch when locale changes
</script>

<template>
  <select @change="setLocale($event.target.value)">
    <option v-for="loc in locales" :key="loc" :value="loc">
      {{ loc }}
    </option>
  </select>
</template>
```

## Error Handling

### Content Not Found (404)

```vue
<script setup>
const { data: post, error } = await useCmsItem('blogs', slug)
</script>

<template>
  <div v-if="error">
    <p v-if="error.statusCode === 404">
      Post not found
    </p>
    <p v-else>
      Error loading content: {{ error.message }}
    </p>
  </div>
  <article v-else-if="post">
    <!-- Content -->
  </article>
</template>
```

### Loading States

```vue
<script setup>
const { data, pending, error } = await useCmsCollection('blogs')
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else-if="error">
    Error: {{ error.message }}
  </div>
  <div v-else-if="!data?.items.length">
    No items found
  </div>
  <div v-else>
    <BlogCard v-for="post in data.items" :key="post.id" :post="post" />
  </div>
</template>
```

## Common Pitfalls

### 1. Content Not Showing (Empty Results)

**Problem:** API returns empty array even though content exists.

**Solution:** Make sure content is **published** in the CMS dashboard. Draft content is not returned by the public API.

### 2. Relation Fields Show IDs Instead of Objects

**Problem:** `post.author` is a string ID like `"k176h8f8emf2cc1..."` instead of an object.

**Solution:** Use client-side population (see "Relation Population" section above). The API returns IDs for relation fields - fetch the related collection and match by ID.

### 3. Locale Not Changing

**Problem:** Content doesn't update when switching locales.

**Solution:**
- Use `useCmsLocale()` to manage locale state
- Don't pass a static `locale` option to composables (let them use the reactive locale)
- Make sure you have translations for the target locale

### 4. API Key Errors (401)

**Problem:** "Missing API key" error in browser console.

**Solution:** The module uses a server-side proxy (`/api/cms/...`) to protect the API key. Make sure:
- The `NUXT_CMS_API_KEY` environment variable is set
- You're using the module's composables (not direct fetch to Convex)

### 5. Images Not Loading in Production

**Problem:** Images work in preview but not in production build.

**Solution:** The module downloads assets at build time. Make sure:
- Run a full build (`nuxt generate`) to download assets
- Check that the `assetDir` is being served correctly

## Preview vs Production Mode

| Feature | Preview Mode | Production Mode |
|---------|--------------|-----------------|
| Data Source | Live Convex API | Pre-built JSON cache |
| Assets | Convex storage URLs | Local `/cms-assets/` |
| Updates | Real-time | Requires rebuild |
| Best For | Development | Static hosting |

Preview mode is enabled automatically in development. Force it in production with:

```typescript
cmsNuxt: {
  preview: true,
}
```

Or via environment variable:

```env
NUXT_CMS_PREVIEW=true
```

## TypeScript

The module provides full TypeScript support:

```typescript
import type { CmsCollectionResult, CmsItem } from '@lupinum/cms-nuxt'

interface BlogPost extends CmsItem {
  title: string
  content: string
  author: string // ID of related author
  featuredImage?: string
}

const { data } = await useCmsCollection('blogs') as AsyncData<CmsCollectionResult<BlogPost>>
```

## Best Practices

1. **Publish content before testing** - Draft content won't appear in the API
2. **Use client-side population for relations** - Simple, predictable, and cacheable
3. **Don't hardcode locales** - Use `useCmsLocale()` for reactive locale management
4. **Handle loading and error states** - Always show feedback to users
5. **Use TypeScript interfaces** - Define your content types for better DX
6. **Test both modes** - Preview mode and production build may behave differently
