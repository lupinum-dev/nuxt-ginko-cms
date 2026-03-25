import type { Ref } from 'vue'
import type { GinkoCollections } from '../../types/index.js'
import type { GinkoError } from '../../types/error.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { computed } from 'vue'
import { toGinkoError } from '../../types/error.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

/** A raw hierarchy node returned by the navigation endpoint. */
export interface GinkoNavigationItem {
  /** Display title of the navigation node. */
  title: string
  /** Optional slug for routable nodes and sections. */
  slug?: string
  /** Node kind as exposed by the public tree API. */
  kind?: 'page' | 'folder' | 'group' | 'section'
  /** Optional icon string. */
  icon?: string
  /** Optional badge text. */
  badge?: string
  /** Resolved site path when the node is routable. */
  path?: string
  /** Child nodes. */
  children: GinkoNavigationItem[]
}

/** Options for {@link useGinkoNavigation}. */
export interface UseGinkoNavigationOptions {
  /** Locale override. */
  locale?: Ref<string> | string
  /** Watch for reactive refetching. @default true */
  watch?: boolean
}

/** Return shape of {@link useGinkoNavigation}. */
export interface UseGinkoNavigationResult {
  /** The raw hierarchy navigation tree. */
  data: Ref<GinkoNavigationItem[]>
  /** Whether a fetch is in progress. */
  pending: Ref<boolean>
  /** Error from the last fetch. */
  error: Ref<GinkoError | null>
  /** Manually refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetch the raw hierarchy navigation tree for a collection.
 *
 * Use this when you need the CMS tree shape directly. For docs sidebars and
 * section/group-aware UIs, prefer `useGinkoNav`.
 *
 * @example
 * ```ts
 * const { data: navigation } = await useGinkoNavigation('docs')
 * ```
 */
export async function useGinkoNavigation<K extends keyof GinkoCollections | (string & {})>(
  collectionKey: K,
  options: UseGinkoNavigationOptions = {},
): Promise<UseGinkoNavigationResult> {
  const { watch: enableWatch = true } = options
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const requestFetch = useRequestFetch()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')

  const cacheKey = () => `ginko-navigation:${String(collectionKey)}:${resolvedLocale.value}`

  const { data, pending, error: rawError, refresh } = await useAsyncData(
    cacheKey,
    async () => {
      const response = await requestFetch(`${routeBase}/query`, {
        method: 'POST',
        body: {
          op: 'navigation',
          collectionKey: String(collectionKey),
          locale: resolvedLocale.value || undefined,
        },
      }) as { data: GinkoNavigationItem[] }

      return Array.isArray(response.data) ? response.data : []
    },
    {
      default: () => [] as GinkoNavigationItem[],
      watch: enableWatch ? [resolvedLocale] : [],
    },
  )

  const typedError = computed<GinkoError | null>(() =>
    rawError.value ? toGinkoError(rawError.value) : null,
  )

  return {
    data,
    pending,
    error: typedError as Ref<GinkoError | null>,
    refresh,
  }
}
