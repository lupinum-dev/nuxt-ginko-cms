/**
 * CMS API Response Types
 */

export interface CmsItem {
  id: string
  slug: string
  status: 'draft' | 'preview' | 'published' | 'archived'
  publishedAt?: number
  previewedAt?: number
  createdAt: number
  updatedAt: number
  _locale: string
  _fallback: Record<string, boolean>
  [key: string]: unknown
}

export interface CmsListResponse {
  data: CmsItem[]
  meta: {
    total: number
    limit: number
    offset: number
    locale: string
  }
}

export interface CmsItemResponse {
  data: CmsItem
}

export interface CmsCollectionResult {
  items: CmsItem[]
  total: number
  locale: string
}

export interface FieldSchema {
  key: string
  type: string
  localized?: boolean
}

export interface CollectionSchema {
  slug: string
  fields: FieldSchema[]
}

export interface AssetInfo {
  assetId: string
  storageUrl: string
  localPath: string
  filename: string
  mimeType: string
}

export interface FieldAssetResult {
  fieldName: string
  assetIds: string[]
  usageType: 'direct' | 'embedded'
}

export interface CachedContent {
  item: CmsItem
  locale: string
  fetchedAt: number
}
