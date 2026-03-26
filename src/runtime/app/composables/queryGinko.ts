import type { Ref } from 'vue'
import type { GinkoSearchHit } from '../../types/index.js'
import type { ConvexSearchHit } from '../utils/convexSearch.js'
import type { GinkoNavigationItem } from './useGinkoNavigation.js'
import type { SurroundItem } from './useGinkoSurround.js'
import { useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { asString } from '../../../type-guards'
import { isPopulateSupportedOperation, normalizePopulateFields } from '../../shared/query-populate.js'
import { fetchConvexSearch } from '../utils/convexSearch.js'
import { buildSourceMap, resolveHitPath, resolveSourceCollections } from '../utils/searchHelpers.js'

/** Chainable query builder returned by {@link queryGinko}. */
export interface GinkoQueryBuilder<T = Record<string, unknown>> {
  /** Set the content path to resolve. */
  path: (path: string) => GinkoQueryBuilder<T>
  /** Merge filter conditions (additive across calls). */
  where: (filters: Record<string, unknown>) => GinkoQueryBuilder<T>
  /** Set sort field and direction. @defaultValue dir `'asc'` */
  sort: (field: string, dir?: 'asc' | 'desc') => GinkoQueryBuilder<T>
  /** Set maximum number of items to return. Clamped to `>= 1` client-side, max 200 server-side. */
  limit: (n: number) => GinkoQueryBuilder<T>
  /** Set result offset. Clamped to `>= 0` client-side. */
  offset: (n: number) => GinkoQueryBuilder<T>
  /** Override the locale. Pass `null` to skip locale resolution. */
  locale: (code: string | null) => GinkoQueryBuilder<T>
  /** Include the full body content in the response. @defaultValue `true` */
  includeBody: (enabled?: boolean) => GinkoQueryBuilder<T>
  /** Add fields to populate (relation expansion). Normalized and deduplicated. Only supported for `find`, `first`, and `page` operations. */
  populate: (fields: string | string[]) => GinkoQueryBuilder<T>
  /** Execute a `find` query returning a list of items. */
  find: () => Promise<T[]>
  /** Execute a `first` query returning a single item or `null`. */
  first: () => Promise<T | null>
  /** Fetch the hierarchy navigation tree. Only valid for hierarchy collections. */
  navigation: () => Promise<GinkoNavigationItem[]>
  /** Fetch the previous/next surround items for a hierarchy path. Pass `scope: 'section'` to stay within the active section. */
  surround: (path?: string, options?: { scope?: 'collection' | 'section' }) => Promise<[SurroundItem | null, SurroundItem | null]>
  /** Execute a full-text search query. */
  search: (query: string, options?: { limit?: number }) => Promise<GinkoSearchHit[]>
  /** Resolve a content path by item ID, content ID, or slug. */
  pathBy: (input: { itemId?: string, contentId?: string, slug?: string }) => Promise<string | null>
}

function unrefValue(value: unknown): unknown {
  if (!value || typeof value !== 'object') {
    return value
  }
  if (!('value' in value)) {
    return value
  }
  return (value as Ref).value
}

interface BuilderState {
  collectionKey?: string
  path?: string
  where?: Record<string, unknown>
  sort?: { field: string, dir: 'asc' | 'desc' }
  limit?: number
  offset?: number
  locale?: string | null
  includeBody?: boolean
  populate?: string[]
}

function assertPopulateSupported(op: string, state: BuilderState): void {
  if (!state.populate?.length) {
    return
  }
  if (isPopulateSupportedOperation(op)) {
    return
  }
  throw new Error(`[ginko-cms] populate() is not supported for ${op}()`)
}

/**
 * Low-level query builder for direct CMS API access.
 *
 * Provides a chainable interface to construct and execute query payloads against the
 * Ginko CMS server endpoint. Use the high-level composables (`useGinkoPage`, `useGinkoList`, etc.)
 * for reactive data fetching — this builder is an escape hatch for advanced use cases.
 *
 * @param collectionKey - The collection to query, or omit for cross-collection operations.
 * @returns A chainable {@link GinkoQueryBuilder} instance.
 *
 * @example
 * ```ts
 * // Find published posts sorted by date
 * const posts = await queryGinko('blog')
 *   .where({ status: 'published' })
 *   .sort('publishedAt', 'desc')
 *   .limit(10)
 *   .find()
 *
 * // Cross-collection search
 * const hits = await queryGinko().search('auth', { limit: 8 })
 * ```
 */
export function queryGinko<T = Record<string, unknown>>(collectionKey?: string): GinkoQueryBuilder<T> {
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()
  const nuxtApp = useNuxtApp()
  const requestFetch = useRequestFetch()
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')

  // Search config — read once per queryGinko() instance
  const ginkoCms = runtimeConfig.public.ginkoCms
  const searchConvexUrl = ginkoCms?.convexUrl
  const searchKey = ginkoCms?.searchKey
  const site = ginkoCms?.site as Record<string, unknown> | undefined
  const searchSourceMap = buildSourceMap(site)

  const resolveLocale = (explicitLocale: string | null | undefined): string | null | undefined => {
    if (explicitLocale === null) {
      return null
    }
    if (typeof explicitLocale === 'string' && explicitLocale.trim()) {
      return explicitLocale.trim()
    }
    const i18n = (nuxtApp as Record<string, unknown>).$i18n as Record<string, unknown> | undefined
    const i18nLocale = asString(String(unrefValue(i18n?.locale) ?? ''))
    if (i18nLocale) {
      return i18nLocale
    }
    const routeLocale = asString(String((route.params as Record<string, unknown>)?.locale ?? ''))
    if (routeLocale) {
      return routeLocale
    }
    return asString(String(runtimeConfig.public.ginkoCms?.locale ?? ''))
  }

  const request = async (payload: Record<string, unknown>): Promise<unknown> => {
    const response = await requestFetch(`${routeBase}/query`, {
      method: 'POST',
      body: payload,
    }) as { data: unknown }
    return response.data
  }

  const createBuilder = (state: BuilderState): GinkoQueryBuilder<T> => {
    const withState = (next: Partial<BuilderState>): GinkoQueryBuilder<T> => createBuilder({
      ...state,
      ...next,
    })

    const toPayload = (op: string): Record<string, unknown> => {
      assertPopulateSupported(op, state)
      return {
        op,
        collectionKey: state.collectionKey,
        path: state.path,
        where: state.where,
        sort: state.sort,
        limit: state.limit,
        offset: state.offset,
        locale: resolveLocale(state.locale),
        includeBody: state.includeBody,
        populate: state.populate,
      }
    }

    return {
      path: (path: string) => withState({ path }),
      where: (filters: Record<string, unknown>) => withState({ where: { ...state.where || {}, ...filters } }),
      sort: (field: string, dir: 'asc' | 'desc' = 'asc') => withState({ sort: { field, dir } }),
      limit: (n: number) => withState({ limit: Math.max(1, Math.floor(n)) }),
      offset: (n: number) => withState({ offset: Math.max(0, Math.floor(n)) }),
      locale: (code: string | null) => withState({ locale: code }),
      includeBody: (enabled: boolean = true) => withState({ includeBody: enabled }),
      populate: (fields: string | string[]) => {
        const merged = [...new Set([...state.populate || [], ...normalizePopulateFields(fields)])]
        return withState({ populate: merged })
      },
      find: async () => {
        return await request(toPayload('find'))
      },
      first: async () => {
        return await request(toPayload('first'))
      },
      navigation: async () => {
        return await request(toPayload('navigation'))
      },
      surround: async (path?: string, options?: { scope?: 'collection' | 'section' }) => {
        return await request({
          ...toPayload('surround'),
          surround: { path, scope: options?.scope },
        })
      },
      search: async (query: string, options: { limit?: number } = {}) => {
        if (!searchConvexUrl || !searchKey) {
          throw new Error(
            '[nuxt-ginko-cms] queryGinko().search() requires NUXT_PUBLIC_GINKO_CMS_CONVEX_URL and NUXT_PUBLIC_GINKO_CMS_SEARCH_KEY',
          )
        }

        const siteCollections = (site?.collections || {}) as Record<string, unknown>
        const collectionKeys = state.collectionKey ? [state.collectionKey] : Object.keys(siteCollections)
        const sourceCollections = resolveSourceCollections(collectionKeys, site)
        const locale = resolveLocale(state.locale) || ''

        try {
          const hits = await fetchConvexSearch({
            convexUrl: searchConvexUrl,
            searchKey,
            query,
            collections: sourceCollections,
            locale: locale || undefined,
            limit: options.limit,
          })

          return hits.map((hit: ConvexSearchHit): GinkoSearchHit => ({
            title: hit.title || 'Untitled',
            snippet: hit.snippet || '',
            path: resolveHitPath(hit, searchSourceMap, locale, site),
            collectionKey: searchSourceMap.get(hit.collectionSlug)?.key || hit.collectionSlug,
            collectionSource: hit.collectionSlug,
            slug: hit.slug,
            updatedAt: hit.updatedAt,
            raw: hit as unknown as Record<string, unknown>,
          }))
        }
        catch (err) {
          throw new Error(
            `[nuxt-ginko-cms] Search failed: ${err instanceof Error ? err.message : String(err)}`,
            { cause: err },
          )
        }
      },
      pathBy: async (input: { itemId?: string, contentId?: string, slug?: string }) => {
        return await request({
          ...toPayload('pathBy'),
          pathBy: input,
        })
      },
    }
  }

  return createBuilder({
    collectionKey: collectionKey ? String(collectionKey) : undefined,
  })
}
