/**
 * Fetch a single item from a CMS collection
 */

import type { AsyncData, NuxtError } from '#app'
import type { CmsItem } from '../types/api'
import process from 'node:process'
import { useAsyncData, useRuntimeConfig } from '#imports'
import { useCmsLocale } from './useCmsLocale'

export interface UseCmsItemOptions {
  /** Locale for content (defaults to current locale) */
  locale?: string
  /** Fields to populate (relation fields) */
  populate?: string[]
  /** Custom cache key */
  key?: string
}

export interface CmsItemResult extends CmsItem {
  /** Indicates which fields used fallback locale */
  _fallback: Record<string, boolean>
}

/**
 * Fetch a single item from a CMS collection by slug
 *
 * - Preview mode: Fetches from Convex CMS API in real-time
 * - Production mode: Reads from cached JSON file
 *
 * @typeParam T - The expected item type (extends CmsItem)
 * @param collectionSlug - The collection slug
 * @param itemSlug - The item slug to fetch
 * @param options - Fetch options
 * @returns AsyncData with the item data
 *
 * @example
 * ```ts
 * // Without type parameter (uses CmsItemResult)
 * const { data, pending, error } = await useCmsItem('blogs', 'my-post')
 *
 * // With type parameter for typed access
 * import type { BlogPost } from '~/types/cms.generated'
 * const { data: post } = await useCmsItem<BlogPost>('blogs', 'my-post', {
 *   populate: ['author'],
 * })
 * // post.value?.title is typed as string
 * ```
 */
export function useCmsItem(
  collectionSlug: string,
  itemSlug: string,
  options: UseCmsItemOptions = {},
): AsyncData<CmsItemResult | null | undefined, NuxtError<unknown> | undefined> {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsNuxt
  const { locale: currentLocale } = useCmsLocale()

  // Use a function to get current locale (reactive)
  const getLocale = () => options.locale || currentLocale.value
  const cacheKey = options.key || `cms-item-${collectionSlug}-${itemSlug}`

  return useAsyncData<CmsItemResult | null>(
    cacheKey,
    async () => {
      const locale = getLocale()
      // Preview mode: fetch from API
      if (cmsConfig.preview) {
        return fetchFromApi(collectionSlug, itemSlug, locale, options, cmsConfig)
      }

      // Production mode: read from cache
      return fetchFromCache(collectionSlug, itemSlug, locale, cmsConfig)
    },
    {
      watch: [currentLocale],
    },
  )
}

/**
 * Fetch item from CMS API (preview mode)
 * Uses the /api/_cms proxy to keep API key secure
 */
async function fetchFromApi(
  collectionSlug: string,
  itemSlug: string,
  locale: string,
  options: UseCmsItemOptions,
  _cmsConfig: typeof useRuntimeConfig extends () => { public: { cmsNuxt: infer T } } ? T : never,
): Promise<CmsItemResult | null> {
  const params = new URLSearchParams()
  params.set('locale', locale)
  if (options.populate?.length)
    params.set('populate', options.populate.join(','))

  // Use the local API proxy which adds authentication server-side
  const url = `/api/_cms/${collectionSlug}/${itemSlug}?${params.toString()}`

  try {
    const response = await $fetch<{ data: CmsItemResult }>(url)
    return response.data
  }
  catch (error: unknown) {
    // Handle 404 gracefully
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Fetch item from cache (production mode)
 */
async function fetchFromCache(
  collectionSlug: string,
  itemSlug: string,
  locale: string,
  cmsConfig: typeof useRuntimeConfig extends () => { public: { cmsNuxt: infer T } } ? T : never,
): Promise<CmsItemResult | null> {
  // On server (including prerender): read from file system directly
  // This is necessary because during prerendering, there's no HTTP server
  if (import.meta.server) {
    try {
      const { readCachedItem } = await import('../server/utils/content-cache')
      const cacheOptions = {
        cacheDir: cmsConfig.cacheDir,
        rootDir: process.cwd(),
      }
      const item = await readCachedItem(cacheOptions, locale, collectionSlug, itemSlug)
      return item as CmsItemResult | null
    }
    catch (error) {
      console.warn(`Failed to load cached item ${collectionSlug}/${itemSlug}/${locale}:`, error)
      return null
    }
  }

  // On client: fetch from public directory (after build, files are served statically)
  const cachePath = `/${cmsConfig.cacheDir}/${locale}/${collectionSlug}/${itemSlug}.json`

  try {
    const item = await $fetch<CmsItemResult>(cachePath)
    return item
  }
  catch (error) {
    console.warn(`Failed to load cached item ${collectionSlug}/${itemSlug}/${locale}:`, error)
    return null
  }
}
