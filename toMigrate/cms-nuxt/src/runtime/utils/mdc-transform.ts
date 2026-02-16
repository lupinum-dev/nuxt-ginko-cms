/**
 * MDC Asset URL Transformation
 *
 * Transforms asset URLs in MDC content from Convex storage URLs to local paths
 */

export interface AssetInfo {
  assetId: string
  storageUrl: string
  localPath: string
  filename: string
  mimeType: string
}

/**
 * Transform asset URLs in MDC content from Convex storage URLs to local paths
 *
 * @param content - MDC content string
 * @param assetMap - Map of assetId to AssetInfo
 * @returns Transformed content with local asset paths
 *
 * @example
 * Input:  :image{#abc123 alt="test" src="https://convex.cloud/api/storage/uuid"}
 * Output: :image{#abc123 alt="test" src="/cms-assets/abc123.webp"}
 */
export function transformMdcAssetUrls(
  content: string,
  assetMap: Map<string, AssetInfo>,
): string {
  let transformed = content

  for (const [assetId, info] of assetMap) {
    // Pattern to match :image{#assetId ...src="..."...} or :file{#assetId ...src="..."...}
    // We need to replace the src value while preserving the rest of the attributes
    const pattern = new RegExp(
      `(:(?:image|file)\\{#${assetId}[^}]*\\bsrc=["'])([^"']+)(["'])`,
      'g',
    )
    transformed = transformed.replace(pattern, `$1${info.localPath}$3`)

    // Also handle the case where src might come before the id
    const patternAlt = new RegExp(
      `(:(?:image|file)\\{[^}]*\\bsrc=["'])([^"']+)(["'][^}]*#${assetId})`,
      'g',
    )
    transformed = transformed.replace(patternAlt, `$1${info.localPath}$3`)
  }

  return transformed
}

/**
 * Transform a direct field value (image field that stores asset ID)
 *
 * @param fieldValue - The asset ID stored in the field
 * @param assetMap - Map of assetId to AssetInfo
 * @returns Local path or original value if not found
 */
export function transformDirectAssetField(
  fieldValue: string | null | undefined,
  assetMap: Map<string, AssetInfo>,
): string | null | undefined {
  if (!fieldValue)
    return fieldValue

  const info = assetMap.get(fieldValue)
  if (info) {
    return info.localPath
  }

  return fieldValue
}

/**
 * Transform all asset references in an item's data
 *
 * @param data - Item data object
 * @param fields - Field schema array
 * @param assetMap - Map of assetId to AssetInfo
 * @returns Transformed data with local asset paths
 */
export function transformItemAssets(
  data: Record<string, unknown>,
  fields: Array<{ key: string, type: string }>,
  assetMap: Map<string, AssetInfo>,
): Record<string, unknown> {
  const transformed = { ...data }

  for (const field of fields) {
    const value = transformed[field.key]

    if (field.type === 'image' && typeof value === 'string') {
      // Direct asset field
      transformed[field.key] = transformDirectAssetField(value, assetMap)
    }
    else if (field.type === 'richtext' && typeof value === 'string') {
      // MDC content with embedded assets
      transformed[field.key] = transformMdcAssetUrls(value, assetMap)
    }
  }

  return transformed
}
