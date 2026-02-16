/**
 * CMS Build Hooks
 *
 * Nitro hooks for build-time content fetching, asset downloading, and caching
 */

import type { Nitro } from 'nitropack'
import type { CmsRuntimeConfig } from '../../types'
import type { CmsItem } from '../../types/api'
import type { SearchIndexEntry } from '../utils/content-cache'
import pLimit from 'p-limit'
import { downloadAssetsFromUrls } from '../utils/asset-downloader'
import { createCmsClient } from '../utils/cms-client'
import { clearCache, writeCachedCollectionIndex, writeCachedItem, writeSearchIndex } from '../utils/content-cache'

/**
 * Register CMS build hooks with Nitro
 */
export function registerCmsBuildHooks(nitro: Nitro, config: CmsRuntimeConfig, apiKey: string): void {
  // Hook into build:before to fetch and cache content
  nitro.hooks.hook('prerender:init', async (nitroRuntime) => {
    console.warn('[cms-nuxt] Starting build-time content processing...')

    try {
      await processCmsContent(nitroRuntime, config, apiKey)
    }
    catch (error) {
      console.error('[cms-nuxt] Failed to process CMS content:', error)
      throw error
    }
  })

  // Hook into prerender:routes to add dynamic routes
  nitro.hooks.hook('prerender:routes', async (routes) => {
    console.warn('[cms-nuxt] Adding prerender routes...')

    try {
      await addPrerenderRoutes(routes, config, apiKey)
    }
    catch (error) {
      console.error('[cms-nuxt] Failed to add prerender routes:', error)
    }
  })
}

/**
 * Main content processing pipeline
 */
async function processCmsContent(nitro: Nitro, config: CmsRuntimeConfig, apiKey: string): Promise<void> {
  const client = createCmsClient({
    apiUrl: config.apiUrl,
    apiKey,
    teamSlug: config.teamSlug,
  })

  const cacheOptions = {
    cacheDir: config.cacheDir,
    rootDir: nitro.options.rootDir,
  }

  const downloadOptions = {
    outputDir: config.assetDir,
    rootDir: nitro.options.rootDir,
  }

  // Clear existing cache
  await clearCache(cacheOptions)
  console.warn('[cms-nuxt] Cleared existing cache')

  // Collect all storage URLs across all content
  const allStorageUrls = new Set<string>()
  const contentByCollection = new Map<string, Map<string, CmsItem[]>>()

  // Step 1: Fetch all content in parallel with concurrency limit
  const limit = pLimit(5) // 5 concurrent requests

  interface FetchResult {
    collection: string
    locale: string
    items: CmsItem[]
  }

  // Build all fetch tasks
  const fetchTasks = config.collections.flatMap(collection =>
    config.locales.map(locale =>
      limit(async (): Promise<FetchResult> => {
        console.warn(`[cms-nuxt] Fetching ${collection.slug}/${locale}...`)

        const items = await client.fetchAllItems(
          collection.slug,
          locale,
          collection.populate,
        )

        console.warn(`[cms-nuxt] Found ${items.length} items in ${collection.slug}/${locale}`)

        return { collection: collection.slug, locale, items }
      }),
    ),
  )

  // Execute in parallel
  const results = await Promise.all(fetchTasks)

  // Organize results into contentByCollection map and collect storage URLs
  for (const { collection, locale, items } of results) {
    // Initialize collection map if needed
    if (!contentByCollection.has(collection)) {
      contentByCollection.set(collection, new Map())
    }
    contentByCollection.get(collection)!.set(locale, items)

    // Extract storage URLs from each item
    for (const item of items) {
      const urls = extractStorageUrlsFromContent(item)
      for (const url of urls) {
        allStorageUrls.add(url)
      }
    }
  }

  console.warn(`[cms-nuxt] Found ${allStorageUrls.size} unique assets`)

  // Step 2: Conditionally download assets based on localizeAssets config
  let urlToLocalPath = new Map<string, string>()

  if (config.localizeAssets) {
    urlToLocalPath = await downloadAssetsFromUrls(
      Array.from(allStorageUrls),
      downloadOptions,
    )
    console.warn(`[cms-nuxt] Downloaded ${urlToLocalPath.size} assets`)
  }
  else {
    console.warn(`[cms-nuxt] Asset localization disabled, using remote URLs`)
  }

  // Step 3: Transform content and write to cache
  // Also collect search index entries per locale
  const searchEntriesByLocale = new Map<string, SearchIndexEntry[]>()

  for (const [collectionSlug, localeContent] of contentByCollection) {
    // Get route pattern for this collection (for search index)
    const collectionConfig = config.collections.find(c => c.slug === collectionSlug)
    const routePattern = collectionConfig?.routePattern

    for (const [locale, items] of localeContent) {
      // Initialize search entries array for this locale if needed
      if (!searchEntriesByLocale.has(locale)) {
        searchEntriesByLocale.set(locale, [])
      }
      const searchEntries = searchEntriesByLocale.get(locale)!

      // Transform storage URLs to local paths in content (only if localizeAssets is enabled)
      const transformedItems = config.localizeAssets
        ? items.map(item => transformItemStorageUrls(item, urlToLocalPath))
        : items

      // Write collection index
      await writeCachedCollectionIndex(cacheOptions, locale, collectionSlug, transformedItems)

      // Write individual items and collect search index entries
      for (const item of transformedItems) {
        await writeCachedItem(cacheOptions, locale, collectionSlug, item)

        // Build search index entry
        if (routePattern && item.slug) {
          const route = routePattern.replace('[slug]', item.slug as string)
          searchEntries.push(createSearchIndexEntry(item, collectionSlug, route))
        }
      }

      console.warn(`[cms-nuxt] Cached ${transformedItems.length} items for ${collectionSlug}/${locale}`)
    }
  }

  // Step 4: Write search indices per locale
  for (const [locale, entries] of searchEntriesByLocale) {
    await writeSearchIndex(cacheOptions, locale, entries)
    console.warn(`[cms-nuxt] Generated search index with ${entries.length} entries for ${locale}`)
  }

  console.warn('[cms-nuxt] Build-time content processing complete')
}

/**
 * Add dynamic routes for prerendering
 */
async function addPrerenderRoutes(
  routes: Set<string>,
  config: CmsRuntimeConfig,
  apiKey: string,
): Promise<void> {
  const client = createCmsClient({
    apiUrl: config.apiUrl,
    apiKey,
    teamSlug: config.teamSlug,
  })

  for (const collection of config.collections) {
    if (!collection.routePattern)
      continue

    // Fetch items for route generation (use default locale)
    const items = await client.fetchAllItems(
      collection.slug,
      config.defaultLocale,
      undefined,
    )

    let routeCount = 0

    for (const item of items) {
      const slug = item.slug as string
      if (!slug)
        continue

      for (const locale of config.locales) {
        // Replace [slug] placeholder with actual slug
        const route = collection.routePattern.replace('[slug]', slug)

        // Apply locale prefix strategy
        let fullRoute: string
        switch (config.localePrefix) {
          case 'prefix_all':
            fullRoute = `/${locale}${route}`
            break
          case 'prefix_except_default':
            fullRoute = locale === config.defaultLocale ? route : `/${locale}${route}`
            break
          case 'no_prefix':
          default:
            fullRoute = route
            break
        }

        routes.add(fullRoute)
        routeCount++
      }
    }

    console.warn(`[cms-nuxt] Added ${routeCount} routes for ${collection.slug}`)
  }
}

/**
 * Extract Convex storage URLs from content
 * The API now returns full storage URLs for image fields
 */
function extractStorageUrlsFromContent(item: CmsItem): string[] {
  const urls: string[] = []
  // Pattern matches Convex storage URLs with various ID formats (UUID, base62, etc.)
  const storageUrlPattern = /https:\/\/[^/]+\.convex\.cloud\/api\/storage\/[\w-]+/g

  for (const [key, value] of Object.entries(item)) {
    // Skip metadata fields
    if (key.startsWith('_') || ['id', 'slug', 'status', 'createdAt', 'updatedAt', 'publishedAt'].includes(key)) {
      continue
    }

    if (typeof value === 'string') {
      // Extract all Convex storage URLs from the string
      // This handles both direct URLs and URLs embedded in MDC content
      const matches = value.matchAll(storageUrlPattern)
      for (const match of matches) {
        urls.push(match[0])
      }
    }
  }

  return [...new Set(urls)]
}

/**
 * Transform storage URLs to local paths in item content
 */
function transformItemStorageUrls(
  item: CmsItem,
  urlToLocalPath: Map<string, string>,
): CmsItem {
  const transformed = { ...item }

  for (const [key, value] of Object.entries(transformed)) {
    // Skip metadata fields
    if (key.startsWith('_') || ['id', 'slug', 'status', 'createdAt', 'updatedAt', 'publishedAt'].includes(key)) {
      continue
    }

    if (typeof value === 'string') {
      let newValue = value

      // Replace all storage URLs with local paths
      for (const [storageUrl, localPath] of urlToLocalPath) {
        newValue = newValue.split(storageUrl).join(localPath)
      }

      transformed[key] = newValue
    }
  }

  return transformed
}

/**
 * Create a search index entry from a CMS item
 * Extracts title and generates a truncated, plain-text excerpt
 */
function createSearchIndexEntry(
  item: CmsItem,
  collection: string,
  route: string,
): SearchIndexEntry {
  const title = (item.title as string) || (item.slug as string) || ''

  // Get excerpt from item (prefer excerpt field, fallback to content)
  let excerpt = ''
  if (item.excerpt && typeof item.excerpt === 'string') {
    excerpt = item.excerpt
  }
  else if (item.content && typeof item.content === 'string') {
    excerpt = item.content
  }

  // Strip MDC/markdown/HTML and truncate
  excerpt = stripContentForSearch(excerpt).slice(0, 200)

  return {
    id: item.id,
    slug: item.slug as string,
    collection,
    route,
    title,
    excerpt,
  }
}

/**
 * Strip MDC syntax, markdown, and HTML to get plain text for search indexing
 */
function stripContentForSearch(content: string): string {
  if (!content) {
    return ''
  }

  return content
    // Remove MDC component syntax :component{props}
    .replace(/:[a-z]+\{[^}]*\}/gi, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // Remove headers
    .replace(/#{1,6}\s*/g, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Collapse whitespace
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
