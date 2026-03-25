import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { computed, isRef } from 'vue'
import { resolveGinkoLocale } from './_ginkoUtils.js'

/** A previous or next page link in a hierarchy. */
export interface SurroundItem {
  /** Display title of the surround page. */
  title?: string
  /** Resolved URL path of the surround page. */
  path: string
}

export type SurroundScope = 'collection' | 'section'

/** Options for {@link useGinkoSurround}. */
export interface UseGinkoSurroundOptions {
  /** Surround anchor path. @defaultValue `route.path` */
  path?: Ref<string> | string
  /** Locale override. Falls back to the standard locale resolution chain. */
  locale?: Ref<string> | string
  /** Restrict prev/next to the active section when section nodes exist. @defaultValue `'collection'` */
  scope?: Ref<SurroundScope> | SurroundScope
  /** Watch `path` and `locale` for reactive refetching. @defaultValue `true` */
  watch?: boolean
}

/** Return shape of {@link useGinkoSurround}. */
export interface UseGinkoSurroundResult {
  /** The previous page in the hierarchy, or `null` at the start. */
  prev: Ref<SurroundItem | null>
  /** The next page in the hierarchy, or `null` at the end. */
  next: Ref<SurroundItem | null>
  /** Whether a fetch is currently in progress. */
  pending: Ref<boolean>
  /** Error from the last fetch attempt, if any. */
  error: Ref<unknown>
  /** Manually trigger a refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetches the previous and next pages surrounding a path in a hierarchy collection.
 *
 * Uses `op: 'surround'`. Converts the raw `[prev, next]` array response into named refs.
 * Only valid for hierarchy collections.
 *
 * @param collectionKey - The hierarchy collection to query.
 * @param options - Surround options.
 * @returns Reactive prev/next items, pending state, error, and refresh function.
 *
 * @example
 * ```ts
 * const { prev, next } = await useGinkoSurround('wiki', { scope: 'section' })
 * ```
 */
export async function useGinkoSurround<K extends keyof GinkoCollections | (string & {})>(
  collectionKey: K,
  options: UseGinkoSurroundOptions = {},
): Promise<UseGinkoSurroundResult> {
  const { watch: enableWatch = true } = options
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const requestFetch = useRequestFetch()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)
  const resolvedScope = computed<SurroundScope>(() => {
    const scope = options.scope
    const value = scope ? (isRef(scope) ? scope.value : scope) : 'collection'
    return value === 'section' ? 'section' : 'collection'
  })
  const resolvedPath = computed(() => {
    const p = options.path
    return p ? String(isRef(p) ? p.value : p) : route.path
  })
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')
  const cacheKey = () => `ginko-surround:${String(collectionKey)}:${resolvedPath.value}:${resolvedLocale.value}:${resolvedScope.value}`
  const { data, pending, error, refresh } = await useAsyncData(
    cacheKey,
    async () => {
      const payload = {
        op: 'surround',
        collectionKey: String(collectionKey),
        path: resolvedPath.value,
        locale: resolvedLocale.value || void 0,
        surround: { path: resolvedPath.value, scope: resolvedScope.value },
      }
      const response = await requestFetch(`${routeBase}/query`, {
        method: 'POST',
        body: payload,
      })
      const raw = Array.isArray(response.data) ? response.data : [null, null]
      const prev = raw[0] ?? null
      const next = raw[1] ?? null
      return { prev, next }
    },
    {
      default: () => ({ prev: null, next: null }),
      watch: enableWatch ? [resolvedPath, resolvedLocale, resolvedScope] : [],
    },
  )
  return {
    prev: computed(() => data.value?.prev ?? null),
    next: computed(() => data.value?.next ?? null),
    pending,
    error,
    refresh,
  }
}
