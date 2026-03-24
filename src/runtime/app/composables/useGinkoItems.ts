import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { normalizePopulateFields } from '../../shared/query-populate.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

type InferCollection<K extends string> = K extends keyof GinkoCollections ? GinkoCollections[K] : Record<string, unknown>

/** Options for {@link useGinkoItems}. */
export interface UseGinkoItemsOptions<T = Record<string, unknown>, R = T> {
  /** Sort field and direction as a tuple. */
  sort?: [string, 'asc' | 'desc']
  /** Maximum number of items to return. Clamped server-side to max 200. */
  limit?: number
  /** Number of items to skip. Clamped server-side to `>= 0`. */
  offset?: number
  /** Filter conditions merged as query parameters. */
  where?: Record<string, unknown>
  /** Fields to populate (relation expansion). Normalized and deduplicated. */
  populate?: string[]
  /** Include the full body content for each item. @defaultValue `false` */
  includeBody?: boolean
  /** Transform function applied to the item list before exposure. */
  transform?: (items: T[]) => R[]
  /** Locale override. Falls back to the standard locale resolution chain. */
  locale?: Ref<string> | string
  /** Watch locale for reactive refetching. @defaultValue `true` */
  watch?: boolean
}

/** Return shape of {@link useGinkoItems}. */
export interface UseGinkoItemsResult<R = Record<string, unknown>> {
  /** The list of items. Defaults to `[]` on initial load. */
  data: Ref<R[]>
  /** Whether a fetch is currently in progress. */
  pending: Ref<boolean>
  /** Error from the last fetch attempt, if any. */
  error: Ref<unknown>
  /** Manually trigger a refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetches a list of CMS items from a collection with filtering, sorting, and pagination.
 *
 * Uses `op: 'find'` under the hood. The cache key includes collection, locale, limit, offset,
 * where, and sort — so different query configurations are cached independently.
 *
 * @param collectionKey - The collection to query.
 * @param options - List query options.
 * @returns Reactive item list, pending state, error, and refresh function.
 *
 * @example
 * ```ts
 * const { data: posts, pending } = await useGinkoItems('blog', {
 *   where: { status: 'published' },
 *   sort: ['publishedAt', 'desc'],
 *   limit: 12,
 *   transform: rows => rows.map(mapBlogCard),
 * })
 * ```
 */
export async function useGinkoItems<K extends keyof GinkoCollections | (string & {}), T = InferCollection<K>, R = T>(
  collectionKey: K,
  options: UseGinkoItemsOptions<T, R> = {},
): Promise<UseGinkoItemsResult<R>> {
  const {
    sort,
    limit,
    offset,
    where,
    populate,
    includeBody = false,
    transform,
    watch: enableWatch = true
  } = options;
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const requestFetch = useRequestFetch();
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig);
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || "/api/ginko").replace(/\/$/, "");
  const stableWhere = where ? JSON.stringify(where) : "";
  const stableSort = sort ? sort.join(":") : "";
  const cacheKey = () => [
    "ginko-items",
    String(collectionKey),
    resolvedLocale.value,
    String(limit ?? ""),
    String(offset ?? ""),
    stableWhere,
    stableSort
  ].join(":");
  const { data, pending, error, refresh } = await useAsyncData(
    cacheKey,
    async () => {
      const payload = {
        op: "find",
        collectionKey: String(collectionKey),
        locale: resolvedLocale.value || void 0,
        includeBody,
        populate: normalizePopulateFields(populate),
        ...where ? { where } : {},
        ...sort ? { sort: { field: sort[0], dir: sort[1] } } : {},
        ...typeof limit === "number" ? { limit } : {},
        ...typeof offset === "number" ? { offset } : {}
      };
      const response = await requestFetch(`${routeBase}/query`, {
        method: "POST",
        body: payload
      });
      const items = Array.isArray(response.data) ? response.data : [];
      if (transform) {
        return transform(items);
      }
      return items;
    },
    {
      default: () => [],
      watch: enableWatch ? [resolvedLocale] : []
    }
  );
  return {
    data,
    pending,
    error,
    refresh
  };
}
