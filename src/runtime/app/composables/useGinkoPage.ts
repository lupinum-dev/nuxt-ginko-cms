import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { createError, navigateTo, useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { computed, isRef } from 'vue'
import { normalizePopulateFields } from '../../shared/query-populate.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

type InferCollection<K extends string> = K extends keyof GinkoCollections ? GinkoCollections[K] : Record<string, unknown>

export interface UseGinkoPageOptions<T = Record<string, unknown>, R = T> {
  path?: Ref<string> | string
  locale?: Ref<string> | string
  includeBody?: boolean
  populate?: string[]
  transform?: (raw: T) => R
  throwIfNotFound?: boolean
  watch?: boolean
}

export interface UseGinkoPageResult<R = Record<string, unknown>> {
  data: Ref<R | null>
  pending: Ref<boolean>
  error: Ref<unknown>
  refresh: () => Promise<void>
}

export async function useGinkoPage<K extends keyof GinkoCollections | (string & {}), T = InferCollection<K>, R = T>(
  collectionKey?: K,
  options: UseGinkoPageOptions<T, R> = {},
): Promise<UseGinkoPageResult<R>> {
  const {
    includeBody = true,
    populate,
    transform,
    throwIfNotFound = true,
    watch: enableWatch = true
  } = options;
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const requestFetch = useRequestFetch();
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig);
  const resolvedPath = computed(() => {
    const p = options.path;
    return p ? String(isRef(p) ? p.value : p) : route.path;
  });
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || "/api/ginko").replace(/\/$/, "");
  const cacheKey = () => `ginko-page:${String(collectionKey ?? "_auto")}:${resolvedPath.value}:${resolvedLocale.value}`;
  const { data, pending, error, refresh } = await useAsyncData(
    cacheKey,
    async () => {
      const payload = {
        op: "page",
        collectionKey: collectionKey ? String(collectionKey) : void 0,
        path: resolvedPath.value,
        locale: resolvedLocale.value || void 0,
        includeBody,
        populate: normalizePopulateFields(populate)
      };
      const response = await requestFetch(`${routeBase}/query`, {
        method: "POST",
        body: payload
      });
      const pageResponse = response.data;
      if (pageResponse.redirect) {
        await navigateTo(pageResponse.redirect, { redirectCode: 301, replace: true });
        return null;
      }
      if (pageResponse.item === null && throwIfNotFound) {
        throw createError({ statusCode: 404, fatal: true });
      }
      if (pageResponse.item !== null && transform) {
        return transform(pageResponse.item);
      }
      return pageResponse.item ?? null;
    },
    {
      watch: enableWatch ? [resolvedPath, resolvedLocale] : []
    }
  );
  return {
    data,
    pending,
    error,
    refresh
  };
}
