import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { normalizePopulateFields } from '../../shared/query-populate.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

type InferCollection<K extends string> = K extends keyof GinkoCollections ? GinkoCollections[K] : Record<string, unknown>

export interface UseGinkoItemsOptions<T = Record<string, unknown>, R = T> {
  sort?: [string, 'asc' | 'desc']
  limit?: number
  offset?: number
  where?: Record<string, unknown>
  populate?: string[]
  includeBody?: boolean
  transform?: (items: T[]) => R[]
  locale?: Ref<string> | string
  watch?: boolean
}

export interface UseGinkoItemsResult<R = Record<string, unknown>> {
  data: Ref<R[]>
  pending: Ref<boolean>
  error: Ref<unknown>
  refresh: () => Promise<void>
}

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
