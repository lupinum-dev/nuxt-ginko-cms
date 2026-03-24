import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { resolveGinkoLocale } from './_ginkoUtils.js'

/** A node in the hierarchy navigation tree. */
export interface NavigationItem {
  /** Display title of the navigation node. */
  title?: string
  /** URL slug segment for this node. */
  slug?: string
  /** Kind of node: content page, folder container, or visual group. */
  nodeKind?: 'page' | 'folder' | 'group'
  /** Optional icon identifier for UI rendering. */
  icon?: string
  /** Optional badge text for UI rendering. */
  badge?: string
  /** Resolved URL path for this node. */
  path?: string
  /** Child navigation nodes. Always present (empty array for leaf nodes). */
  children: NavigationItem[]
}

/** Options for {@link useGinkoNavigation}. */
export interface UseGinkoNavigationOptions {
  /** Locale override. Falls back to the standard locale resolution chain. */
  locale?: Ref<string> | string
  /** Watch locale for reactive refetching. @defaultValue `true` */
  watch?: boolean
  /** Custom `useAsyncData` cache key. @defaultValue `ginko-nav:<collection>:<locale>` */
  key?: string
}

/** Return shape of {@link useGinkoNavigation}. */
export interface UseGinkoNavigationResult {
  /** The navigation tree. Defaults to `[]` on initial load. */
  data: Ref<NavigationItem[]>
  /** Whether a fetch is currently in progress. */
  pending: Ref<boolean>
  /** Error from the last fetch attempt, if any. */
  error: Ref<unknown>
  /** Manually trigger a refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetches the hierarchy navigation tree for a collection.
 *
 * Uses `op: 'navigation'`. Only valid for hierarchy collections — calling on a flat
 * collection returns a server 400 error.
 *
 * @param collectionKey - The hierarchy collection to fetch navigation for.
 * @param options - Navigation options.
 * @returns Reactive navigation tree, pending state, error, and refresh function.
 *
 * @example
 * ```ts
 * const { data: navigation } = useGinkoNavigation('wiki')
 * ```
 */
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
