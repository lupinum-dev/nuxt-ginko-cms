/**
 * Mode-aware asset URL resolution
 */

import type { ComputedRef } from 'vue'
import { computed, useRuntimeConfig } from '#imports'

/**
 * Get the URL for a CMS asset based on the current mode
 *
 * The CMS API now returns full storage URLs for image fields, so in most cases
 * you can use the URL directly from the API response. This composable is useful for:
 * - Asset IDs that haven't been resolved
 * - Production mode where URLs need to be transformed to local paths
 *
 * @param urlOrId - The storage URL (from API) or asset ID
 * @returns Computed URL string
 *
 * @example
 * ```ts
 * const imageUrl = useCmsAssetUrl(item.featuredImage)
 * // Preview: returns the URL as-is (already resolved by API)
 * // Production: /cms-assets/abc123.webp (transformed during build)
 * ```
 */
export function useCmsAssetUrl(urlOrId: string | undefined | null): ComputedRef<string> {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsNuxt

  return computed(() => {
    if (!urlOrId) {
      return ''
    }

    // If it's already a full URL, return as-is in preview mode
    // In production, URLs should already be transformed during build
    if (urlOrId.startsWith('http://') || urlOrId.startsWith('https://')) {
      return urlOrId
    }

    // If it's a local path, return as-is
    if (urlOrId.startsWith('/')) {
      return urlOrId
    }

    // Otherwise treat as asset ID - construct URL based on mode
    if (cmsConfig.preview) {
      // Extract the deployment name from apiUrl
      const apiUrlMatch = cmsConfig.apiUrl.match(/https?:\/\/([^.]+)\.convex\.site/)
      const deploymentName = apiUrlMatch?.[1] || cmsConfig.teamSlug
      return `https://${deploymentName}.convex.cloud/api/storage/${urlOrId}`
    }

    // In production mode, use local asset path
    return `/${cmsConfig.assetDir}/${urlOrId}`
  })
}

/**
 * Get multiple asset URLs
 *
 * @param assetIds - Array of asset IDs
 * @returns Computed array of URL strings
 */
export function useCmsAssetUrls(assetIds: (string | undefined | null)[]): ComputedRef<string[]> {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsNuxt

  return computed(() => {
    return assetIds
      .filter((id): id is string => !!id)
      .map((assetId) => {
        if (cmsConfig.preview) {
          const apiUrlMatch = cmsConfig.apiUrl.match(/https?:\/\/([^.]+)\.convex\.site/)
          const deploymentName = apiUrlMatch?.[1] || cmsConfig.teamSlug
          return `https://${deploymentName}.convex.cloud/api/storage/${assetId}`
        }
        return `/${cmsConfig.assetDir}/${assetId}`
      })
  })
}
