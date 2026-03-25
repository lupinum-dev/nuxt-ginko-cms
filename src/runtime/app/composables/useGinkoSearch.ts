import type { Ref } from 'vue'
import type { GinkoSearchResult } from '../../types/index.js'
import type { GinkoError } from '../../types/error.js'
import type { ConvexSearchHit } from '../utils/convexSearch.js'
import { useNuxtApp, useRoute, useRuntimeConfig } from '#imports'
import { computed, onScopeDispose, ref, watch } from 'vue'
import { toGinkoError } from '../../types/error.js'
import { fetchConvexSearch } from '../utils/convexSearch.js'
import { buildSourceMap, resolveCollectionKey, resolveHitPath, resolveSourceCollections } from '../utils/searchHelpers.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

/** Options for {@link useGinkoSearch}. */
export interface UseGinkoSearchOptions {
  /** Debounce delay in ms. @default 200 */
  debounce?: number
  /** Minimum query length. @default 2 */
  minLength?: number
  /** Max results. @default 12 */
  limit?: number
  /** Include raw item data in results. @default false */
  includeRaw?: boolean
  /** Locale override. */
  locale?: Ref<string> | string
}

/** Return shape of {@link useGinkoSearch}. */
export interface UseGinkoSearchResult {
  /** Bind to search input v-model. */
  query: Ref<string>
  /** Search results with resolved paths. */
  results: Ref<GinkoSearchResult[]>
  /** Whether a request is in flight. */
  pending: Ref<boolean>
  /** Error from last search. */
  error: Ref<GinkoError | null>
  /** Reset query, results, and error. */
  clear: () => void
}

/**
 * Pure data search composable — calls Convex directly from the browser.
 *
 * @module ginko
 * @scope search
 * @state Local
 * @mutations None
 *
 * @example
 * ```ts
 * // Single collection
 * const { query, results, pending } = useGinkoSearch('docs')
 *
 * // Multiple collections
 * const search = useGinkoSearch(['blog', 'docs'], { limit: 12 })
 *
 * // All collections
 * const search = useGinkoSearch()
 * ```
 */
export function useGinkoSearch(
  collections?: string | string[],
  options: UseGinkoSearchOptions = {},
): UseGinkoSearchResult {
  const {
    debounce: debounceMs = 200,
    minLength = 2,
    limit = 12,
    includeRaw = false,
  } = options

  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)

  const ginkoCms = runtimeConfig.public.ginkoCms as any
  const convexUrl: string | undefined = ginkoCms?.convexUrl
  const searchKey: string | undefined = ginkoCms?.searchKey
  const site = ginkoCms?.site as any

  // Normalize collection keys
  const collectionKeys: string[] | undefined = collections
    ? (typeof collections === 'string' ? [collections] : collections)
    : undefined

  // Map collection keys → upstream source slugs (built once)
  const sourceCollections = resolveSourceCollections(collectionKeys, site)

  // Build reverse map: source slug → collection config (built once)
  const sourceToCollection = buildSourceMap(site)

  const query = ref('')
  const results = ref<GinkoSearchResult[]>([])
  const pending = ref(false)
  const rawError = ref<unknown>(null)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined
  let requestSerial = 0

  const clear = () => {
    requestSerial += 1
    clearTimeout(debounceTimer)
    query.value = ''
    results.value = []
    rawError.value = null
    pending.value = false
  }

  const executeSearch = async (q: string) => {
    if (q.length < minLength) {
      results.value = []
      pending.value = false
      return
    }

    if (!convexUrl || !searchKey) {
      rawError.value = new Error(
        '[nuxt-ginko-cms] Search not configured. Set NUXT_PUBLIC_GINKO_CMS_CONVEX_URL and NUXT_PUBLIC_GINKO_CMS_SEARCH_KEY.',
      )
      pending.value = false
      return
    }

    const serial = ++requestSerial
    pending.value = true
    rawError.value = null

    try {
      const hits = await fetchConvexSearch({
        convexUrl,
        searchKey,
        query: q,
        collections: sourceCollections,
        locale: resolvedLocale.value || undefined,
        limit,
      })

      if (serial !== requestSerial) return

      results.value = hits.map((hit: ConvexSearchHit): GinkoSearchResult => ({
        title: hit.title || 'Untitled',
        snippet: hit.snippet || '',
        path: resolveHitPath(hit, sourceToCollection, resolvedLocale.value, site),
        collection: resolveCollectionKey(hit.collectionSlug, sourceToCollection) || hit.collectionSlug,
        ...(includeRaw ? { raw: hit as any } : {}),
      }))
    }
    catch (err) {
      if (serial !== requestSerial) return
      rawError.value = err
      results.value = []
    }
    finally {
      if (serial === requestSerial) {
        pending.value = false
      }
    }
  }

  watch(query, (q) => {
    clearTimeout(debounceTimer)
    if (q.length < minLength) {
      requestSerial += 1
      results.value = []
      rawError.value = null
      pending.value = false
      return
    }
    pending.value = true
    debounceTimer = setTimeout(() => executeSearch(q), debounceMs)
  })

  onScopeDispose(() => {
    requestSerial += 1
    clearTimeout(debounceTimer)
  })

  const typedError = computed<GinkoError | null>(() =>
    rawError.value ? toGinkoError(rawError.value) : null,
  )

  return {
    query,
    results,
    pending,
    error: typedError as Ref<GinkoError | null>,
    clear,
  }
}
