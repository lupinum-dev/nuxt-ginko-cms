/**
 * Schema-aware asset extraction from CMS content
 *
 * Ported from layers/cms/lib/utils/extractAssetsFromContent.ts
 *
 * Uses field schema to reliably identify asset fields:
 * - `image` type fields: Extract asset ID directly (usageType: 'direct')
 * - `richtext` type fields: Parse MDC for :image{} and :file{} (usageType: 'embedded')
 * - All other field types: Skip (relation, text, number, etc. are not asset references)
 */

export interface FieldSchema {
  key: string
  type: string
}

export interface ExtractOptions {
  /** Field schema from collection definition */
  fields: FieldSchema[]
}

export interface FieldAssetResult {
  fieldName: string
  assetIds: string[]
  usageType: 'direct' | 'embedded'
}

/**
 * Extract asset IDs from CMS content data using field schema
 *
 * @param data - Content data object with field names as keys
 * @param options - Extraction options including field schema
 * @returns Array of field asset mappings with field name, asset IDs, and usage type
 */
export function extractAssetsFromContent(
  data: Record<string, unknown>,
  options: ExtractOptions,
): FieldAssetResult[] {
  const result: FieldAssetResult[] = []

  // Build field type lookup map for O(1) access
  const fieldTypeMap = new Map<string, string>()
  for (const field of options.fields) {
    fieldTypeMap.set(field.key, field.type)
  }

  for (const [fieldName, value] of Object.entries(data)) {
    const fieldType = fieldTypeMap.get(fieldName)
    if (!fieldType)
      continue // Unknown field, skip

    switch (fieldType) {
      case 'image': {
        // Direct asset reference - extract ID directly
        const assetId = extractDirectAssetId(value)
        if (assetId) {
          result.push({
            fieldName,
            assetIds: [assetId],
            usageType: 'direct',
          })
        }
        break
      }

      case 'richtext': {
        // MDC content - parse for embedded assets
        if (typeof value === 'string') {
          const embeddedIds = extractEmbeddedAssetIds(value)
          if (embeddedIds.length > 0) {
            result.push({
              fieldName,
              assetIds: embeddedIds,
              usageType: 'embedded',
            })
          }
        }
        break
      }

      // Skip all other field types:
      // - relation: contains item IDs, not asset IDs
      // - text, number, boolean, date, datetime: not asset references
      // - select, multiselect: option values, not asset references
      // - slug, json: not asset references
      default:
        break
    }
  }

  return result
}

/**
 * Extract asset ID from an image field value
 *
 * Validates it's a non-empty string that matches Convex ID format.
 *
 * @param value - Field value (should be asset ID string)
 * @returns Asset ID string or null if invalid
 */
function extractDirectAssetId(value: unknown): string | null {
  // Null/undefined check
  if (value == null)
    return null

  // Must be a string
  if (typeof value !== 'string')
    return null

  // Empty string check
  const trimmed = value.trim()
  if (!trimmed)
    return null

  // Skip URLs (legacy content might have URLs instead of IDs)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return null
  }

  // Convex ID format: 20-40 lowercase alphanumeric characters
  if (/^[a-z0-9]{20,40}$/.test(trimmed)) {
    return trimmed
  }

  return null
}

/**
 * Extract asset IDs from MDC content using multiple patterns
 *
 * Only extracts IDs from known asset-containing components:
 * - :image{...} - image assets
 * - :file{...} - file assets
 *
 * Supported syntaxes:
 * - :image{#assetId ...} (shorthand)
 * - :image{id="assetId" ...} (long form with double quotes)
 * - :image{id='assetId' ...} (long form with single quotes)
 *
 * @param content - MDC content string
 * @returns Array of unique asset IDs found
 */
function extractEmbeddedAssetIds(content: string): string[] {
  const ids = new Set<string>()
  const assetComponents = ['image', 'file']

  for (const component of assetComponents) {
    // Shorthand syntax :image{#assetId ...}
    // Captures: :image{#[20-40 char lowercase alphanumeric ID]
    const shorthandRegex = new RegExp(`:${component}\\{#([a-z0-9]{20,40})`, 'g')

    for (const match of content.matchAll(shorthandRegex)) {
      if (match[1]) {
        ids.add(match[1])
      }
    }

    // Long form syntax :image{id="assetId" ...} or :image{id='assetId' ...}
    // Captures: :image{...id="[ID]"... or :image{...id='[ID]'...
    const longFormRegex = new RegExp(`:${component}\\{[^}]*\\bid=["']([a-z0-9]{20,40})["']`, 'g')

    for (const match of content.matchAll(longFormRegex)) {
      if (match[1]) {
        ids.add(match[1])
      }
    }
  }

  return Array.from(ids)
}

/**
 * MDC asset regex patterns - exported for documentation and testing
 *
 * Only matches known asset-containing components (image, file)
 * Convex ID format: 20-40 lowercase alphanumeric characters [a-z0-9]{20,40}
 */

// Shorthand: :image{#assetId ...}
// Matches: :image{#jh7x4xkqnf5v9r8w2p1m3n5q and captures the ID
export const MDC_IMAGE_SHORTHAND_REGEX = /:image\{#([a-z0-9]{20,40})/g

// Long form: :image{id="assetId" ...} or :image{id='assetId' ...}
// Matches: :image{src="..." id="jh7x4xkqnf5v9r8w2p1m3n5q" or id='...'
export const MDC_IMAGE_LONGFORM_REGEX = /:image\{[^}]*\bid=["']([a-z0-9]{20,40})["']/g

// Shorthand: :file{#assetId ...}
// Matches: :file{#jh7x4xkqnf5v9r8w2p1m3n5q and captures the ID
export const MDC_FILE_SHORTHAND_REGEX = /:file\{#([a-z0-9]{20,40})/g

// Long form: :file{id="assetId" ...} or :file{id='assetId' ...}
// Matches: :file{name="..." id="jh7x4xkqnf5v9r8w2p1m3n5q" or id='...'
export const MDC_FILE_LONGFORM_REGEX = /:file\{[^}]*\bid=["']([a-z0-9]{20,40})["']/g
