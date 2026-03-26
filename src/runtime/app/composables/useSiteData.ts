import type { Ref } from 'vue'
import type { SiteDataPublic } from '../../types/siteData.js'
import { useAsyncData, useRuntimeConfig } from '#imports'
import { computed, isRef } from 'vue'

/** Options for {@link useSiteData}. */
export interface UseSiteDataOptions {
  /** Override the Convex URL. Falls back to `runtimeConfig.public.convexUrl`. */
  convexUrl?: string
}

/** Return shape of {@link useSiteData}. */
export interface UseSiteDataResult {
  /** The fetched site data, or `null` if not found. */
  data: Ref<SiteDataPublic | null>
  /** Whether a fetch is currently in progress. */
  pending: Ref<boolean>
  /** Error from the last fetch attempt, if any. */
  error: Ref<Error | null>
  /** Manually trigger a refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetch a SiteData container by ID at build time (`nuxt generate`).
 *
 * Data is baked into `_payload.json` during static generation — no runtime
 * client-side fetching occurs. The Convex URL is read from
 * `runtimeConfig.public.convexUrl` unless overridden via `options.convexUrl`.
 *
 * @example
 * ```ts
 * const { data: siteData } = await useSiteData('abc123def456')
 * const hours = siteData.value?.blocks.find(b => b.type === 'hours')
 * ```
 */
export async function useSiteData(
  siteDataId: string | Ref<string>,
  options: UseSiteDataOptions = {},
): Promise<UseSiteDataResult> {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = options.convexUrl ?? (runtimeConfig.public.convexUrl as string ?? '')

  const id = computed(() => isRef(siteDataId) ? siteDataId.value : siteDataId)

  const { data, pending, error, refresh } = await useAsyncData(
    `ginko-site-data:${id.value}`,
    () => $fetch<SiteDataPublic>(`${baseUrl}/api/v1/site-data/${id.value}`).catch(() => null),
    { watch: [id] },
  )

  return {
    data: data as Ref<SiteDataPublic | null>,
    pending,
    error: error as Ref<Error | null>,
    refresh,
  }
}
