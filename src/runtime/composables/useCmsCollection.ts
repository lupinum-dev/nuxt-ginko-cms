/**
 * Fetch items from a CMS collection
 */

import type { AsyncData, NuxtError } from '#app'
import type { CmsCollectionResult, CmsItem } from '../types/api'
import process from 'node:process'
import { useAsyncData, useRuntimeConfig } from '#imports'
import { useCmsLocale } from './useCmsLocale'

export interface UseCmsCollectionOptions {
  /** Locale for content (defaults to current locale) */
  locale?: string
  /** Fields to populate (relation fields) */
  populate?: string[]
  /** Maximum items to fetch */
  limit?: number
  /** Offset for pagination */
  offset?: number
  /** Custom cache key */
  key?: string
}

/**
 * Result type for collection queries with generic item type
 */
export interface CmsCollectionResultTyped<T extends CmsItem> {
  items: T[]
  total: number
  locale: string
}

/**
 * Fetch a list of items from a CMS collection
 *
 * - Preview mode: Fetches from Convex CMS API in real-time
 * - Production mode: Reads from cached JSON files
 *
 * @typeParam T - The expected item type (extends CmsItem)
 * @param collectionSlug - The collection slug to fetch from
 * @param options - Fetch options
 * @returns AsyncData with items, total count, and locale
 *
 * @example
 * ```ts
 * // Without type parameter
 * const { data } = await useCmsCollection('blogs')
 *
 * // With type parameter for typed access
 * import type { BlogPost } from '~/types/cms.generated'
 * const { data } = await useCmsCollection<BlogPost>('blogs', {
 *   populate: ['author'],
 * })
 * // data.value?.items[0].title is typed as string
 * ```
 */
export function useCmsCollection<T extends CmsItem = CmsItem>(
  collectionSlug: string,
  options: UseCmsCollectionOptions = {},
): AsyncData<CmsCollectionResultTyped<T> | null | undefined, NuxtError<unknown> | undefined> {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsNuxt
  const { locale: currentLocale } = useCmsLocale()

  // Use a function to get current locale (reactive)
  const getLocale = () => options.locale || currentLocale.value
  const cacheKey = options.key || `cms-collection-${collectionSlug}`

  return useAsyncData<CmsCollectionResultTyped<T> | null>(
    cacheKey,
    async () => {
      const locale = getLocale()
      // Preview mode: fetch from API
      if (cmsConfig.preview) {
        return fetchFromApi(collectionSlug, locale, options, cmsConfig) as Promise<CmsCollectionResultTyped<T>>
      }

      // Production mode: read from cache
      return fetchFromCache(collectionSlug, locale, cmsConfig) as Promise<CmsCollectionResultTyped<T>>
    },
    {
      watch: [currentLocale],
    },
  )
}

/**
 * Fetch collection from CMS API (preview mode)
 * Uses the /api/_cms proxy to keep API key secure
 */
async function fetchFromApi(
  collectionSlug: string,
  locale: string,
  options: UseCmsCollectionOptions,
  _cmsConfig: typeof useRuntimeConfig extends () => { public: { cmsNuxt: infer T } } ? T : never,
): Promise<CmsCollectionResult> {
  const params = new URLSearchParams()
  params.set('locale', locale)
  if (options.limit)
    params.set('limit', String(options.limit))
  if (options.offset)
    params.set('offset', String(options.offset))
  if (options.populate?.length)
    params.set('populate', options.populate.join(','))

  // Use the local API proxy which adds authentication server-side
  const url = `/api/_cms/${collectionSlug}?${params.toString()}`

  const response = await $fetch<{ data: CmsItem[], meta: { total: number, locale: string } }>(url)

  return {
    items: response.data,
    total: response.meta.total,
    locale: response.meta.locale,
  }
}

/**
 * Fetch collection from cache (production mode)
 */
async function fetchFromCache(
  collectionSlug: string,
  locale: string,
  cmsConfig: typeof useRuntimeConfig extends () => { public: { cmsNuxt: infer T } } ? T : never,
): Promise<CmsCollectionResult> {
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
        return { items: cached.items, total: cached.total, locale }
      }
      return { items: [], total: 0, locale }
    }
    catch (error) {
      console.warn(`Failed to load cached content for ${collectionSlug}/${locale}:`, error)
      return { items: [], total: 0, locale }
    }
  }

  // On client: fetch from public directory (after build, files are served statically)
  const cachePath = `/${cmsConfig.cacheDir}/${locale}/${collectionSlug}/index.json`

  try {
    const response = await $fetch<{ items: CmsItem[], total: number }>(cachePath)
    return {
      items: response.items,
      total: response.total,
      locale,
    }
  }
  catch (error) {
    console.warn(`Failed to load cached content for ${collectionSlug}/${locale}:`, error)
    return {
      items: [],
      total: 0,
      locale,
    }
  }
}
