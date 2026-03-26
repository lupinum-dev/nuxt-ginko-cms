import type { ComputedRef } from 'vue'
import { useRoute, useRouter, useState } from '#imports'
import { computed } from 'vue'

/**
 * Preview mode composable.
 *
 * Activates automatically when the URL contains `?ginko_preview=TOKEN`.
 * The module validates the token and switches to preview API key for that session.
 *
 * @module ginko
 * @scope preview
 * @state Global
 * @mutations None
 *
 * @example
 * ```ts
 * const { isPreview, exitPreview } = useGinkoPreview()
 * ```
 */
export function useGinkoPreview(): {
  /** Whether preview mode is active. */
  isPreview: ComputedRef<boolean>
  /** Exit preview mode and redirect to clean URL. */
  exitPreview: () => Promise<void>
} {
  const route = useRoute()
  const router = useRouter()
  const previewToken = useState<string | null>('ginko-preview-token', () => null)

  // Auto-detect preview token from query params
  const tokenFromQuery = route.query.ginko_preview
  if (typeof tokenFromQuery === 'string' && tokenFromQuery.length > 0) {
    previewToken.value = tokenFromQuery
  }

  const isPreview = computed(() => previewToken.value !== null)

  const exitPreview = async () => {
    previewToken.value = null
    // Remove preview param from URL
    const query = { ...route.query }
    delete query.ginko_preview
    await router.replace({ ...route, query })
  }

  return {
    isPreview,
    exitPreview,
  }
}
