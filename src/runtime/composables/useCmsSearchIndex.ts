/**
 * Mode-aware search index composable
 *
 * - Dev mode: Fetches collections dynamically and builds index in-memory
 * - Preview/Production: Loads pre-built search-index.json from cache
 */

import type { AsyncData, NuxtError } from '#app'
import type { SearchIndex, SearchIndexEntry } from '../server/utils/content-cache'
import process from 'node:process'
import { useAsyncData, useRuntimeConfig } from '#imports'
import { useCmsLocale } from './useCmsLocale'

export interface UseCmsSearchIndexOptions {
  /** Locale for search index (defaults to current locale) */
  locale?: string
  /** Custom cache key */
  key?: string
}

export interface CmsSearchIndexResult {
  entries: SearchIndexEntry[]
  locale: string
  generatedAt?: number
}

/**
 * Get the search index for the current locale
 *
 * - Dev/Preview mode with no cached index: Falls back to empty index
 * - Preview/Production mode: Loads pre-built search-index.json
 *
 * @param options - Options for the search index
 * @returns AsyncData with search index entries
 *
 * @example
 * ```ts
 * const { data: searchIndex } = await useCmsSearchIndex()
 *
 * // Use with Fuse.js or similar
 * const fuse = new Fuse(searchIndex.value?.entries || [], {
 *   keys: ['title', 'excerpt'],
 * })
 * ```
 */
export function useCmsSearchIndex(
  options: UseCmsSearchIndexOptions = {},
): AsyncData<CmsSearchIndexResult | null | undefined, NuxtError<unknown> | undefined> {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsNuxt
  const { locale: currentLocale } = useCmsLocale()

  const getLocale = () => options.locale || currentLocale.value
  const cacheKey = options.key || `cms-search-index`

  return useAsyncData<CmsSearchIndexResult | null>(
    cacheKey,
    async () => {
      const locale = getLocale()

      // In dev mode (preview=true), try to load from cache but fallback gracefully
      // In production mode, load from cache
      return fetchSearchIndexFromCache(locale, cmsConfig)
    },
    {
      watch: [currentLocale],
    },
  )
}

/**
 * Fetch search index from cache
 */
async function fetchSearchIndexFromCache(
  locale: string,
  cmsConfig: typeof useRuntimeConfig extends () => { public: { cmsNuxt: infer T } } ? T : never,
): Promise<CmsSearchIndexResult | null> {
  // On server (including prerender): read from file system directly
  if (import.meta.server) {
    try {
      const { readSearchIndex } = await import('../server/utils/content-cache')
      const cacheOptions = {
        cacheDir: cmsConfig.cacheDir,
        rootDir: process.cwd(),
      }
      const index = await readSearchIndex(cacheOptions, locale)
      if (index) {
        return {
          entries: index.entries,
          locale: index.locale,
          generatedAt: index.generatedAt,
        }
      }
      // No cached index available - return empty
      return { entries: [], locale }
    }
    catch (error) {
      // Only warn in production - in dev mode, missing index is expected
      if (!cmsConfig.preview) {
        console.warn(`[cms-nuxt] Failed to load search index for ${locale}:`, error)
      }
      return { entries: [], locale }
    }
  }

  // On client: fetch from public directory
  const cachePath = `/${cmsConfig.cacheDir}/${locale}/search-index.json`

  try {
    const index = await $fetch<SearchIndex>(cachePath)
    return {
      entries: index.entries,
      locale: index.locale,
      generatedAt: index.generatedAt,
    }
  }
  catch (error) {
    // Only warn in production - in dev mode, missing index is expected
    if (!cmsConfig.preview) {
      console.warn(`[cms-nuxt] Failed to load search index for ${locale}:`, error)
    }
    return { entries: [], locale }
  }
}

// Re-export type for convenience
export type { SearchIndexEntry }
