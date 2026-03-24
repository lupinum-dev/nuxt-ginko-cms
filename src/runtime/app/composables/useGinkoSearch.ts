import type { Ref } from 'vue'
import type { GinkoSearchResult } from '../../types/index.js'
import type { GinkoError } from '../../types/error.js'
import { useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { computed, onScopeDispose, ref, watch } from 'vue'
import { toGinkoError } from '../../types/error.js'
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
 * Pure data search composable. No modal state — that's the consumer's concern.
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
  const requestFetch = useRequestFetch()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')

  // Normalize collection keys
  const collectionKeys: string[] | undefined = collections
    ? (typeof collections === 'string' ? [collections] : collections)
    : undefined

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

    const serial = ++requestSerial
    pending.value = true
    rawError.value = null

    try {
      // Fan out to each collection (or single search if undefined)
      if (collectionKeys && collectionKeys.length > 0) {
        const promises = collectionKeys.map(async (key) => {
          const payload = {
            op: 'search' as const,
            collectionKey: key,
            locale: resolvedLocale.value || undefined,
            search: { q, limit: Math.ceil(limit / collectionKeys.length) },
          }
          const response: any = await requestFetch(`${routeBase}/query`, {
            method: 'POST',
            body: payload,
          })
          return {
            collection: key,
            hits: Array.isArray(response.data) ? response.data : [],
          }
        })

        const allResults = await Promise.all(promises)
        if (serial !== requestSerial) return

        results.value = allResults.flatMap(({ collection, hits }) =>
          hits.map((hit: any): GinkoSearchResult => ({
            title: hit.title || 'Untitled',
            snippet: hit.snippet || '',
            path: hit.path || '/',
            collection: hit.collectionKey || collection,
            ...(includeRaw && hit.raw ? { raw: hit.raw } : {}),
          })),
        )
      }
      else {
        // No collections specified — search all
        const payload = {
          op: 'search' as const,
          locale: resolvedLocale.value || undefined,
          search: { q, limit },
        }
        const response: any = await requestFetch(`${routeBase}/query`, {
          method: 'POST',
          body: payload,
        })
        if (serial !== requestSerial) return

        const hits = Array.isArray(response.data) ? response.data : []
        results.value = hits.map((hit: any): GinkoSearchResult => ({
          title: hit.title || 'Untitled',
          snippet: hit.snippet || '',
          path: hit.path || '/',
          collection: hit.collectionKey || '',
          ...(includeRaw && hit.raw ? { raw: hit.raw } : {}),
        }))
      }
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
