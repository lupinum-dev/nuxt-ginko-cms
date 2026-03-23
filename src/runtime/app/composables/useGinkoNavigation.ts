import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { resolveGinkoLocale } from './_ginkoUtils.js'

export interface NavigationItem {
  title?: string
  slug?: string
  path?: string
  children: NavigationItem[]
}

export interface UseGinkoNavigationOptions {
  locale?: Ref<string> | string
  watch?: boolean
  key?: string
}

export interface UseGinkoNavigationResult {
  data: Ref<NavigationItem[]>
  pending: Ref<boolean>
  error: Ref<unknown>
  refresh: () => Promise<void>
}

export function useGinkoNavigation<K extends keyof GinkoCollections | (string & {})>(
  collectionKey: K,
  options: UseGinkoNavigationOptions = {},
): UseGinkoNavigationResult {
  const { watch: enableWatch = true, key } = options;
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const requestFetch = useRequestFetch();
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig);
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || "/api/ginko").replace(/\/$/, "");
  const cacheKey = () => key ?? `ginko-nav:${String(collectionKey)}:${resolvedLocale.value}`;
  const { data, pending, error, refresh } = useAsyncData(
    cacheKey,
    async () => {
      const payload = {
        op: "navigation",
        collectionKey: String(collectionKey),
        locale: resolvedLocale.value || void 0
      };
      const response = await requestFetch(`${routeBase}/query`, {
        method: "POST",
        body: payload
      });
      return Array.isArray(response.data) ? response.data : [];
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
