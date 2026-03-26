import type { Ref } from 'vue'
import type { DatasetPublic } from '../../types/dataset.js'
import { useAsyncData, useRuntimeConfig } from '#imports'
import { computed, isRef } from 'vue'

/** Options for {@link useLiveDataset}. */
export interface UseLiveDatasetOptions {
  /** Override the Convex URL. Falls back to `runtimeConfig.public.convexUrl`. */
  convexUrl?: string
}

/** Return shape of {@link useLiveDataset}. */
export interface UseLiveDatasetResult {
  /** The fetched dataset, or `null` if not found. */
  data: Ref<DatasetPublic | null>
  /** Whether a fetch is currently in progress. */
  pending: Ref<boolean>
  /** Error from the last fetch attempt, if any. */
  error: Ref<Error | null>
  /** Manually trigger a refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetch a Dataset by ID at build time (`nuxt generate`).
 *
 * Data is baked into `_payload.json` during static generation — no runtime
 * client-side fetching occurs. The Convex URL is read from
 * `runtimeConfig.public.convexUrl` unless overridden via `options.convexUrl`.
 *
 * @example
 * ```ts
 * const { data: dataset } = await useLiveDataset('abc123def456')
 * const hours = dataset.value?.blocks.find(b => b.type === 'hours')
 * ```
 */
export async function useLiveDataset(
  datasetId: string | Ref<string>,
  options: UseLiveDatasetOptions = {},
): Promise<UseLiveDatasetResult> {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = options.convexUrl ?? (runtimeConfig.public.convexUrl as string ?? '')

  const id = computed(() => isRef(datasetId) ? datasetId.value : datasetId)

  const { data, pending, error, refresh } = await useAsyncData(
    () => `ginko-dataset:${id.value}`,
    () => $fetch<DatasetPublic>(`${baseUrl}/api/v1/datasets/${id.value}`).catch(() => null),
    { watch: [id] },
  )

  return {
    data: data as Ref<DatasetPublic | null>,
    pending,
    error: error as Ref<Error | null>,
    refresh,
  }
}
