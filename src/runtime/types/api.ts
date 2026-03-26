/**
 * CMS API response types used by the upstream Ginko CMS backend.
 * @module api
 */

/** Supported query operations for the Ginko CMS query builder. */
export type GinkoQueryOperation = 'find' | 'first' | 'navigation' | 'surround' | 'search' | 'pathBy' | 'page'

/** A single content item from the CMS API. */
export interface CmsItem {
  /** Unique item identifier. */
  id: string
  /** URL-safe slug for the item. */
  slug: string
  /** Publication status of the item. */
  status: 'draft' | 'preview' | 'published' | 'archived'
  /** Epoch timestamp when the item was published. */
  publishedAt?: number
  /** Epoch timestamp when the item was last previewed. */
  previewedAt?: number
  /** Epoch timestamp when the item was created. */
  createdAt: number
  /** Epoch timestamp when the item was last updated. */
  updatedAt: number
  /** The locale this item was fetched in. */
  _locale: string
  /** Map of field names to whether they fell back to a different locale. */
  _fallback: Record<string, boolean>
  /** Additional dynamic fields defined by the collection schema. */
  [key: string]: unknown
}

/** Response from a collection list query. */
export interface CmsListResponse {
  /** Array of items matching the query. */
  data: CmsItem[]
  /** Pagination and locale metadata. */
  meta: {
    /** Total number of matching items across all pages. */
    total: number
    /** Maximum items per page. */
    limit: number
    /** Number of items skipped. */
    offset: number
    /** The locale used for this query. */
    locale: string
  }
}

/** Response from a single-item query. */
export interface CmsItemResponse {
  /** The fetched item. */
  data: CmsItem
}

/** Processed collection query result used internally. */
export interface CmsCollectionResult {
  /** Array of items. */
  items: CmsItem[]
  /** Total count of matching items. */
  total: number
  /** The locale used for this query. */
  locale: string
}

/** Schema definition for a single field in a collection. */
export interface FieldSchema {
  /** Machine-readable field key. */
  key: string
  /** Field type identifier (e.g., `'text'`, `'richtext'`, `'relation'`). */
  type: string
  /** Whether this field supports localized values. */
  localized?: boolean
}

/** Schema definition for a CMS collection. */
export interface CollectionSchema {
  /** URL-safe collection slug. */
  slug: string
  /** Array of field definitions for this collection. */
  fields: FieldSchema[]
}

/** Metadata for an uploaded asset. */
export interface AssetInfo {
  /** Unique asset identifier. */
  assetId: string
  /** CDN or storage URL for the asset. */
  storageUrl: string
  /** Original local file path (from upload context). */
  localPath: string
  /** Original filename. */
  filename: string
  /** MIME type of the asset. */
  mimeType: string
}

/** Result of scanning a field for asset references. */
export interface FieldAssetResult {
  /** The field name that contains asset references. */
  fieldName: string
  /** Array of referenced asset IDs. */
  assetIds: string[]
  /** Whether the asset is directly referenced or embedded in rich text. */
  usageType: 'direct' | 'embedded'
}

/** A cached content item with fetch metadata. */
export interface CachedContent {
  /** The cached item data. */
  item: CmsItem
  /** The locale this item was fetched in. */
  locale: string
  /** Epoch timestamp when this item was fetched. */
  fetchedAt: number
}
