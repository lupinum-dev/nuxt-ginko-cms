/**
 * Fetch a related item by its ID
 * Used to populate relation fields client-side
 */

import type { MaybeRef } from 'vue'
import type { CmsItem } from '../types/api'
import process from 'node:process'
import { useAsyncData, useRuntimeConfig } from '#imports'
import { computed, toValue } from 'vue'
import { useCmsLocale } from './useCmsLocale'

export interface UseCmsRelatedItemOptions {
  /** Locale for content (defaults to current locale) */
  locale?: string
  /** Custom cache key */
  key?: string
}

/**
 * Fetch a related item by its ID from a CMS collection
 *
 * This composable is useful for populating relation fields client-side
 * when the API returns only the ID instead of the full object.
 *
 * @param collectionSlug - The collection to fetch from (e.g., 'authors')
 * @param itemId - The item ID (reactive ref supported)
 * @param options - Fetch options
 * @returns AsyncData with the related item
 *
 * @example
 * ```ts
 * // Fetch author by ID
 * const { data: author } = await useCmsRelatedItem('authors', post.value?.author)
 * ```
 */
export function useCmsRelatedItem(
  collectionSlug: string,
  itemId: MaybeRef<string | null | undefined>,
  options: UseCmsRelatedItemOptions = {},
) {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsGinko
  const { locale: currentLocale } = useCmsLocale()

  // Use a function to get current locale (reactive)
  const getLocale = () => options.locale || currentLocale.value
  const resolvedId = computed(() => toValue(itemId))
  const cacheKey = options.key || `cms-related-${collectionSlug}-${resolvedId.value}`

  return useAsyncData<CmsItem | null>(
    cacheKey,
    async () => {
      const id = resolvedId.value
      if (!id)
        return null

      const locale = getLocale()
      // Preview mode: fetch from API
      if (cmsConfig.preview) {
        return fetchFromApi(collectionSlug, id, locale, cmsConfig)
      }

      // Production mode: read from cache
      return fetchFromCache(collectionSlug, id, locale, cmsConfig)
    },
    {
      watch: [resolvedId, currentLocale],
    },
  )
}

/**
 * Fetch item by ID from CMS API (preview mode)
 * Uses the list endpoint and filters by ID
 * Uses the /api/_cms proxy to keep API key secure
 */
async function fetchFromApi(
  collectionSlug: string,
  itemId: string,
  locale: string,
  _cmsConfig: typeof useRuntimeConfig extends () => { public: { cmsGinko: infer T } } ? T : never,
): Promise<CmsItem | null> {
  const params = new URLSearchParams()
  params.set('locale', locale)

  // Use the local API proxy which adds authentication server-side
  // Fetch all items and filter by ID (not optimal but works without API changes)
  const url = `/api/_cms/${collectionSlug}?${params.toString()}`

  try {
    const response = await $fetch<{ data: CmsItem[], meta: { total: number, locale: string } }>(url)

    // Find the item by ID
    return response.data.find(item => item.id === itemId) || null
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Fetch item by ID from cache (production mode)
 */
async function fetchFromCache(
  collectionSlug: string,
  itemId: string,
  locale: string,
  cmsConfig: typeof useRuntimeConfig extends () => { public: { cmsGinko: infer T } } ? T : never,
): Promise<CmsItem | null> {
  // On server (including prerender): read from file system directly
  // This is necessary because during prerendering, there's no HTTP server
  if (import.meta.server) {
    try {
      const { readCachedCollectionIndex } = await import('../server/utils/content-cache')
      const cacheOptions = {
        cacheDir: cmsConfig.cacheDir,
        rootDir: process.cwd(),
      }
      const cached = await readCachedCollectionIndex(cacheOptions, locale, collectionSlug)
      if (cached) {
        return cached.items.find(item => item.id === itemId) || null
      }
      return null
    }
    catch (error) {
      console.warn(`Failed to load cached item ${collectionSlug}/${itemId}/${locale}:`, error)
      return null
    }
  }

  // On client: fetch from public directory (after build, files are served statically)
  const cachePath = `/${cmsConfig.cacheDir}/${locale}/${collectionSlug}/index.json`

  try {
    const response = await $fetch<{ items: CmsItem[] }>(cachePath)
    return response.items.find(item => item.id === itemId) || null
  }
  catch (error) {
    console.warn(`Failed to load cached item ${collectionSlug}/${itemId}/${locale}:`, error)
    return null
  }
}
