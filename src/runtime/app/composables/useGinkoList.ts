import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import type { GinkoError } from '../../types/error.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig, useState } from '#imports'
import { computed, isRef, toValue } from 'vue'
import { normalizePopulateFields } from '../../shared/query-populate.js'
import { toGinkoError } from '../../types/error.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

type InferCollection<K extends string> = K extends keyof GinkoCollections ? GinkoCollections[K] : Record<string, unknown>

/**
 * Parse a sort string like `'-date'` into `{ field, dir }`.
 * Prefix `-` = desc, no prefix = asc.
 */
function parseSort(sort: string): { field: string, dir: 'asc' | 'desc' } {
  if (sort.startsWith('-')) {
    return { field: sort.slice(1), dir: 'desc' }
  }
  return { field: sort, dir: 'asc' }
}

/** Options for {@link useGinkoList}. */
export interface UseGinkoListOptions<T = Record<string, unknown>, R = T> {
  /** Sort string. Prefix with `-` for descending. E.g., `'-date'`, `'title'`. */
  sort?: string
  /** Maximum items to return. */
  limit?: number
  /** Items to skip. Accepts a reactive `Ref<number>` for pagination. */
  offset?: number | Ref<number>
  /** Filter conditions. */
  where?: Record<string, unknown>
  /** Fields to populate (relation expansion). */
  populate?: string[]
  /** Include full body content. @default false */
  includeBody?: boolean
  /** Transform applied to item list. */
  transform?: (items: T[]) => R[]
  /** Locale override. */
  locale?: Ref<string> | string
  /** Watch reactive sources for refetching. @default true */
  watch?: boolean
}

/** Return shape of {@link useGinkoList}. */
export interface UseGinkoListResult<R = Record<string, unknown>> {
  /** The list of items. */
  data: Ref<R[]>
  /** Total matching items (for pagination math). */
  total: Ref<number>
  /** Whether a fetch is in progress. */
  pending: Ref<boolean>
  /** Error from last fetch, if any. */
  error: Ref<GinkoError | null>
  /** Manually refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetch a list of CMS items with sorting, pagination, and filtering.
 *
 * @module ginko
 * @scope list
 * @state Local
 * @mutations None
 *
 * @example
 * ```ts
 * const { data: posts, total } = await useGinkoList('blog', {
 *   sort: '-date',
 *   limit: 20,
 * })
 * ```
 */
export async function useGinkoList<K extends keyof GinkoCollections | (string & {}), T = InferCollection<K>, R = T>(
  collectionKey: K,
  options: UseGinkoListOptions<T, R> = {},
): Promise<UseGinkoListResult<R>> {
  const {
    sort,
    limit,
    where,
    populate,
    includeBody = false,
    transform,
    watch: enableWatch = true,
  } = options

  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const requestFetch = useRequestFetch()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')

  const stableWhere = where ? JSON.stringify(where) : ''
  const stableSort = sort ?? ''
  const resolvedOffset = isRef(options.offset) ? options.offset : undefined
  const staticOffset = isRef(options.offset) ? undefined : options.offset

  const cacheKey = () => [
    'ginko-list',
    String(collectionKey),
    resolvedLocale.value,
    String(limit ?? ''),
    String(toValue(options.offset) ?? ''),
    stableWhere,
    stableSort,
  ].join(':')

  const totalRef = useState<number>(`ginko-list-total:${String(collectionKey)}`, () => 0)

  const watchSources: any[] = enableWatch ? [resolvedLocale] : []
  if (enableWatch && resolvedOffset) {
    watchSources.push(resolvedOffset)
  }

  const { data, pending, error: rawError, refresh } = await useAsyncData(
    cacheKey,
    async () => {
      const payload: Record<string, unknown> = {
        op: 'find',
        collectionKey: String(collectionKey),
        locale: resolvedLocale.value || undefined,
        includeBody,
        populate: normalizePopulateFields(populate),
      }

      if (where) payload.where = where
      if (sort) payload.sort = parseSort(sort)
      if (typeof limit === 'number') payload.limit = limit
      const offsetVal = toValue(options.offset)
      if (typeof offsetVal === 'number') payload.offset = offsetVal

      const response: any = await requestFetch(`${routeBase}/query`, {
        method: 'POST',
        body: payload,
      })

      const items = Array.isArray(response.data) ? response.data : []
      const total = typeof response.meta?.total === 'number' ? response.meta.total : items.length
      totalRef.value = total

      return transform ? transform(items) : items
    },
    {
      default: () => [],
      watch: watchSources,
    },
  )

  const typedError = computed<GinkoError | null>(() =>
    rawError.value ? toGinkoError(rawError.value) : null,
  )

  return {
    data,
    total: totalRef,
    pending,
    error: typedError as Ref<GinkoError | null>,
    refresh,
  }
}
