import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { createError, navigateTo, useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { computed, isRef } from 'vue'
import { normalizePopulateFields } from '../../shared/query-populate.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

type InferCollection<K extends string> = K extends keyof GinkoCollections ? GinkoCollections[K] : Record<string, unknown>

/** Options for {@link useGinkoPage}. */
export interface UseGinkoPageOptions<T = Record<string, unknown>, R = T> {
  /** Page path to resolve and fetch. @defaultValue `route.path` */
  path?: Ref<string> | string
  /** Locale override. Falls back to the standard locale resolution chain. */
  locale?: Ref<string> | string
  /** Whether to include the full body content in the response. @defaultValue `true` */
  includeBody?: boolean
  /** Fields to populate (relation expansion). Normalized and deduplicated. */
  populate?: string[]
  /** Transform function applied to the raw item before exposure. Only called when item is non-null. */
  transform?: (raw: T) => R
  /** Throw a Nuxt 404 error when the resolved item is `null`. @defaultValue `true` */
  throwIfNotFound?: boolean
  /** Alias for `throwIfNotFound`. @defaultValue `true` */
  throw404?: boolean
  /** Watch `path` and `locale` for reactive refetching. Set `false` to disable watchers. @defaultValue `true` */
  watch?: boolean
}

/** Return shape of {@link useGinkoPage}. */
export interface UseGinkoPageResult<R = Record<string, unknown>> {
  /** The resolved page item, or `null` if not found. */
  data: Ref<R | null>
  /** Whether a fetch is currently in progress. */
  pending: Ref<boolean>
  /** Error from the last fetch attempt, if any. */
  error: Ref<unknown>
  /** Manually trigger a refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetches a single CMS page by path with locale resolution.
 *
 * Performs a single `op: 'page'` request that resolves the path to a collection,
 * checks canonical URL, and fetches the item in one round trip. Handles redirects
 * automatically and throws a 404 when the item is not found (configurable).
 *
 * @param collectionKey - The collection to resolve within, or omit for auto-detection.
 * @param options - Page fetch options.
 * @returns Reactive page data, pending state, error, and refresh function.
 *
 * @example
 * ```ts
 * const { data: post } = await useGinkoPage('blog', {
 *   populate: ['author', 'tags'],
 *   transform: raw => mapBlogPost(raw),
 * })
 * ```
 */
export async function useGinkoPage<K extends keyof GinkoCollections | (string & {}), T = InferCollection<K>, R = T>(
  collectionKey?: K,
  options: UseGinkoPageOptions<T, R> = {},
): Promise<UseGinkoPageResult<R>> {
  const {
    includeBody = true,
    populate,
    transform,
    throwIfNotFound,
    throw404,
    watch: enableWatch = true,
  } = options
  const shouldThrow = throwIfNotFound ?? throw404 ?? true
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const requestFetch = useRequestFetch()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)
  const resolvedPath = computed(() => {
    const p = options.path
    return p ? String(isRef(p) ? p.value : p) : route.path
  })
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')
  const cacheKey = () => `ginko-page:${String(collectionKey ?? '_auto')}:${resolvedPath.value}:${resolvedLocale.value}`
  const { data, pending, error, refresh } = await useAsyncData(
    cacheKey,
    async () => {
      const payload = {
        op: 'page',
        collectionKey: collectionKey ? String(collectionKey) : void 0,
        path: resolvedPath.value,
        locale: resolvedLocale.value || void 0,
        includeBody,
        populate: normalizePopulateFields(populate),
      }
      const response = await requestFetch(`${routeBase}/query`, {
        method: 'POST',
        body: payload,
      })
      const pageResponse = response.data
      if (pageResponse.redirect) {
        await navigateTo(pageResponse.redirect, { redirectCode: 301, replace: true })
        return null
      }
      if (pageResponse.item === null && shouldThrow) {
        throw createError({ statusCode: 404, fatal: true })
      }
      if (pageResponse.item !== null && transform) {
        return transform(pageResponse.item)
      }
      return pageResponse.item ?? null
    },
    {
      watch: enableWatch ? [resolvedPath, resolvedLocale] : [],
    },
  )
  return {
    data,
    pending,
    error,
    refresh,
  }
}
