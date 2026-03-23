import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { computed, isRef } from 'vue'
import { resolveGinkoLocale } from './_ginkoUtils.js'

export interface SurroundItem {
  title?: string
  path: string
}

export interface UseGinkoSurroundOptions {
  path?: Ref<string> | string
  locale?: Ref<string> | string
  watch?: boolean
}

export interface UseGinkoSurroundResult {
  prev: Ref<SurroundItem | null>
  next: Ref<SurroundItem | null>
  pending: Ref<boolean>
  error: Ref<unknown>
  refresh: () => Promise<void>
}

export async function useGinkoSurround<K extends keyof GinkoCollections | (string & {})>(
  collectionKey: K,
  options: UseGinkoSurroundOptions = {},
): Promise<UseGinkoSurroundResult> {
  const { watch: enableWatch = true } = options;
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
  const cacheKey = () => `ginko-surround:${String(collectionKey)}:${resolvedPath.value}:${resolvedLocale.value}`;
  const { data, pending, error, refresh } = await useAsyncData(
    cacheKey,
    async () => {
      const payload = {
        op: "surround",
        collectionKey: String(collectionKey),
        path: resolvedPath.value,
        locale: resolvedLocale.value || void 0,
        surround: { path: resolvedPath.value }
      };
      const response = await requestFetch(`${routeBase}/query`, {
        method: "POST",
        body: payload
      });
      const raw = Array.isArray(response.data) ? response.data : [null, null];
      const prev = raw[0] ?? null;
      const next = raw[1] ?? null;
      return { prev, next };
    },
    {
      default: () => ({ prev: null, next: null }),
      watch: enableWatch ? [resolvedPath, resolvedLocale] : []
    }
  );
  return {
    prev: computed(() => data.value?.prev ?? null),
    next: computed(() => data.value?.next ?? null),
    pending,
    error,
    refresh
  };
}
