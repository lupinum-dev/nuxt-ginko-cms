import type { GinkoQueryOperation } from './api'

export type { BannerBlock, BannerData, FileBlock, HoursBlock, HoursData, HoursDay, JsonBlock, SiteDataPublic, SiteDataPublicBlock, SiteDataPublicFileData } from './siteData.js'

/**
 * Augmentable interface mapping collection keys to their item types.
 *
 * Extend this interface in your project to get type-safe composables:
 * ```ts
 * declare module 'nuxt-ginko-cms/runtime/types' {
 *   interface GinkoCollections {
 *     blog: BlogPost
 *     wiki: WikiPage
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GinkoCollections {
}

/** Strategy for prefixing locale codes in URL paths. */
export type GinkoCmsLocalePrefixStrategy = 'prefix_except_default' | 'prefix_all' | 'none'

/** Configuration for a single locale in the site. */
export interface GinkoCmsSiteLocale {
  /** ISO locale code (e.g., `'de'`, `'en'`). Must be unique across locales. */
  code: string
  /** BCP 47 hreflang tag (e.g., `'de-DE'`, `'en-US'`). Used in `<link rel="alternate">`. */
  hreflang: string
  /** Whether this is the default locale. Only one locale should be marked as default. */
  isDefault?: boolean
}

/** Global routing strategy for the site. */
export interface GinkoCmsSiteRouting {
  /** How locale prefixes are applied to URL paths. @defaultValue `'prefix_except_default'` */
  localePrefixStrategy?: GinkoCmsLocalePrefixStrategy
}

/** Per-collection search configuration override. */
export interface GinkoCmsSiteCollectionSearch {
  /** Override which upstream collection sources are searched. @defaultValue `[source]` */
  collections?: ReadonlyArray<string>
  /** Reserved: per-collection search limit. The endpoint uses request/site defaults. */
  limit?: number
}

/** Fields common to both flat and hierarchy collections. */
export interface GinkoCmsSiteCollectionCommon {
  /** Upstream CMS collection slug. Required. */
  source: string
  /** Whether this collection supports localized content. @defaultValue `true` */
  localized?: boolean
  /** Field name used as the slug identifier for flat path resolution. @defaultValue `'slug'` */
  slugField?: string
  /** Key field for sitemap generation helpers. @defaultValue `'id'` */
  keyField?: 'id' | 'slug'
  /** Page size for sitemap generation helpers. @defaultValue `100` */
  pageSize?: number
  /** Reserved metadata for list queries (not currently applied by runtime). */
  listQuery?: Record<string, unknown>
  /** Reserved metadata for single-item queries (not currently applied by runtime). */
  getQuery?: Record<string, unknown>
  /** Per-collection search configuration. */
  search?: GinkoCmsSiteCollectionSearch
}

/** Routing configuration for flat (non-hierarchical) collections. Exactly one mode must be set. */
export interface GinkoCmsSiteFlatRouting {
  /** Single URL prefix for all locales (e.g., `'/blog'`). */
  prefix?: string
  /** Locale-specific URL prefixes (e.g., `{ de: '/blog', en: '/articles' }`). */
  prefixByLocale?: Record<string, string>
  /** Explicit path maps per locale for custom slug-to-path mapping. Highest priority. */
  pathMapByLocale?: Record<string, Record<string, string>>
}

/** Routing configuration for hierarchy (tree-structured) collections. Exactly one base mode must be set. */
export interface GinkoCmsSiteHierarchyRouting {
  /** Base URL segment for all locales (e.g., `'wiki'`). */
  baseSegment?: string
  /** Locale-specific base URL segments (e.g., `{ de: 'wiki', en: 'docs' }`). */
  baseSegmentByLocale?: Record<string, string>
  /** Slug of the root document to alias onto the collection base path. */
  rootSlug?: string
  /** Locale-specific root document slugs. */
  rootSlugByLocale?: Record<string, string>
}

/** A flat (non-hierarchical) collection with prefix-based routing. */
export interface GinkoCmsSiteFlatCollection extends GinkoCmsSiteCollectionCommon {
  /** Discriminator: this is a flat collection. */
  kind: 'flat'
  /** Routing configuration. One of `prefix`, `prefixByLocale`, or `pathMapByLocale` is required. */
  routing: GinkoCmsSiteFlatRouting
}

/** A hierarchy (tree-structured) collection with segment-based routing. */
export interface GinkoCmsSiteHierarchyCollection extends GinkoCmsSiteCollectionCommon {
  /** Discriminator: this is a hierarchy collection. */
  kind: 'hierarchy'
  /** Routing configuration. One of `baseSegment` or `baseSegmentByLocale` is required. */
  routing: GinkoCmsSiteHierarchyRouting
  /** Maximum tree depth for navigation and surround queries. @defaultValue `5` (clamped 1–20) */
  maxDepth?: number
  /** Whether to include folder nodes in navigation responses. @defaultValue `false` */
  includeFolders?: boolean
  /** Field name for the content slug in hierarchy items. @defaultValue `'slug'` */
  contentSlugField?: string
  /** Field name for the content title in hierarchy items. @defaultValue `'title'` */
  contentTitleField?: string
  /** Field name for sort ordering in hierarchy items. @defaultValue `'pageOrder'` */
  contentOrderField?: string
  /** Field name for the colocation folder ID in hierarchy items. @defaultValue `'colocationFolderId'` */
  contentIdField?: string
}

/** Union of all collection kinds. Use the `kind` discriminator to narrow. */
export type GinkoCmsSiteCollection = GinkoCmsSiteFlatCollection | GinkoCmsSiteHierarchyCollection

/** Sitemap endpoint configuration. */
export interface GinkoCmsSiteSitemap {
  /** Whether the sitemap endpoint is enabled. @defaultValue `true` */
  enabled?: boolean
  /** URL path for the sitemap endpoint. @defaultValue `'/api/ginko/sitemap'` */
  sourcePath?: string
}

/** Response from `op: 'page'` — combines resolve, canonical check, and fetch in one call. */
export interface GinkoPageResponse<T = Record<string, unknown>> {
  /** The fetched item, or `null` if the path did not resolve. */
  item: T | null
  /** When set, the client should redirect to this canonical path (301). */
  redirect?: string
  /** The resolved locale for this request. */
  locale: string
  /** The collection key that matched the path, if any. */
  collectionKey?: string
}

/** Global search configuration for the site. */
export interface GinkoCmsSiteSearch {
  /** Whether search is enabled globally. @defaultValue `true` */
  enabled?: boolean
  /** Default search result limit when not specified in the request. @defaultValue `12` (clamped 1–100) */
  defaultLimit?: number
}

/**
 * Top-level site configuration DSL.
 *
 * Passed as `ginkoCms.site` in `nuxt.config.ts`. Defines locales, routing strategy,
 * collections, search behavior, and sitemap settings.
 */
export interface GinkoCmsSiteConfig {
  /** Default locale code. Inferred from `isDefault` locale or first locale if not set. */
  defaultLocale?: string
  /** Available locales. Must include at least one valid locale. */
  locales: ReadonlyArray<GinkoCmsSiteLocale>
  /** Global routing strategy. */
  routing?: GinkoCmsSiteRouting
  /** Non-CMS routes to include in sitemap generation (e.g., `['/', '/kontakt']`). */
  staticRoutes?: ReadonlyArray<string>
  /** Collection definitions keyed by collection name. */
  collections: Record<string, GinkoCmsSiteCollection>
  /** Global search configuration. */
  search?: GinkoCmsSiteSearch
  /** Sitemap endpoint configuration. Pass `true` for defaults, `false` to disable. */
  sitemap?: boolean | GinkoCmsSiteSitemap
}

// ─── Navigation types ────────────────────────────────────────────────────────

/** A navigation section (top-level sidebar partition). */
export interface GinkoNavSection {
  /** Slugified section id. */
  id: string
  /** Original section slug when the hierarchy uses explicit section nodes. */
  slug?: string
  /** Display title. */
  title: string
  /** First routable page within the section. */
  path?: string
  /** Optional icon string (e.g., `'lucide:rocket'`). */
  icon?: string
  /** Groups within this section. */
  groups: GinkoNavGroup[]
}

/** A navigation group (section heading / separator). */
export interface GinkoNavGroup {
  /** Slugified group id. */
  id: string
  /** Display title. `undefined` = ungrouped (no heading rendered). */
  title?: string
  /** Navigation items in this group. */
  items: GinkoNavItem[]
}

/** A navigation item (page or folder). */
export interface GinkoNavItem {
  /** Display title. */
  title: string
  /** Resolved URL path. `undefined` = not routable. */
  path?: string
  /** Item kind. 'folder' items are collapsible groups, not navigable links. */
  kind?: 'page' | 'folder'
  /** Optional icon string. */
  icon?: string
  /** Optional badge text. */
  badge?: string
  /** Child items (empty for pages). */
  children: GinkoNavItem[]
}

/** A table-of-contents item extracted from markdown headings. */
export interface GinkoTocItem {
  /** Heading anchor id. */
  id: string
  /** Heading text content. */
  text: string
  /** Heading depth (2 = h2, 3 = h3, etc.). */
  depth: number
}

/** A search result hit. */
export interface GinkoSearchResult {
  /** Display title. */
  title: string
  /** HTML snippet with `<mark>` tags. */
  snippet: string
  /** Resolved URL path. `undefined` when path resolution fails (e.g. missing routing config). */
  path?: string
  /** Which collection this came from. */
  collection: string
  /** Raw item data (only when `includeRaw: true`). */
  raw?: Record<string, unknown>
}

// ─── Existing types ─────────────────────────────────────────────────────────────

/** Response from the `GET /api/ginko/resolve` endpoint. */
export interface GinkoResolveResponse {
  /** Whether the path matched any collection route. */
  matched: boolean
  /** The input path. */
  path: string
  /** The resolved locale. */
  locale: string
  /** The canonical path for this item (may differ from input path). */
  canonicalPath?: string
  /** The matched collection key. */
  collectionKey?: string
  /** The upstream collection source slug. */
  collectionSource?: string
  /** The kind of collection that matched. */
  kind?: 'flat' | 'hierarchy'
  /** The resolved item slug. */
  slug?: string
  /** The resolved item ID (hierarchy only). */
  itemId?: string
  /** The resolved content/colocation ID (hierarchy only). */
  contentId?: string
}

/** Search operation payload nested within {@link GinkoQueryPayload}. */
export interface GinkoQueryOperationSearch {
  /** The search query string. Queries shorter than 2 characters return empty results. */
  q: string
  /** Maximum number of search results. Clamped server-side to max 100. */
  limit?: number
}

/** PathBy operation payload nested within {@link GinkoQueryPayload}. */
export interface GinkoQueryOperationPathBy {
  /** Resolve path by item ID (hierarchy collections). */
  itemId?: string
  /** Resolve path by content/colocation folder ID (hierarchy collections). */
  contentId?: string
  /** Resolve path by slug (flat or hierarchy collections). */
  slug?: string
}

/**
 * Request body for `POST /api/ginko/query`.
 *
 * The `op` field selects the operation. Additional fields are consumed based on the operation.
 */
export interface GinkoQueryPayload {
  /** The query operation to execute. */
  op: GinkoQueryOperation
  /** Target collection key. Required for most operations; omit for cross-collection search. */
  collectionKey?: string
  /** Content path for path-based operations (`page`, `find`, `first`, `surround`). */
  path?: string
  /** Filter conditions for `find`/`first` operations. */
  where?: Record<string, unknown>
  /** Sort configuration for `find`/`first` operations. */
  sort?: {
    /** Field name to sort by. */
    field: string
    /** Sort direction. @defaultValue `'asc'` */
    dir?: 'asc' | 'desc'
  }
  /** Maximum items to return. Clamped server-side to max 200 for find, 100 for search. */
  limit?: number
  /** Number of items to skip. Clamped server-side to `>= 0`. */
  offset?: number
  /** Locale for the request. Falls back to runtime config default. */
  locale?: string | null
  /** Include full body content in response. */
  includeBody?: boolean
  /** Fields to populate (relation expansion). Only supported for `find`, `first`, `page`. */
  populate?: string[]
  /** @deprecated Search now uses direct Convex queries. Server returns 410 for `op: 'search'`. */
  search?: GinkoQueryOperationSearch
  /** Surround operation parameters. Used when `op: 'surround'`. */
  surround?: {
    /** The anchor path for surround lookup. */
    path?: string
    /** Restrict surround links to the active section when section nodes exist. @defaultValue `'collection'` */
    scope?: 'collection' | 'section'
  }
  /** PathBy operation parameters. Required when `op: 'pathBy'`. */
  pathBy?: GinkoQueryOperationPathBy
}

/** Standard response envelope from the query endpoint. */
export interface GinkoQueryResponse<T = Record<string, unknown>> {
  /** The response data. Shape varies by operation. */
  data: T
  /** Optional metadata (e.g., pagination info). */
  meta?: Record<string, unknown>
}

/** A single search result hit. */
export interface GinkoSearchHit {
  /** Upstream item ID. */
  id?: string
  /** The collection key this hit belongs to. */
  collectionKey?: string
  /** The upstream collection source slug. */
  collectionSource?: string
  /** The item slug. */
  slug?: string
  /** Display title of the item. */
  title?: string
  /** Text snippet with search term context. */
  snippet?: string
  /** Resolved URL path for this item. */
  path?: string
  /** Last update timestamp (epoch ms). */
  updatedAt?: number
  /** The full raw item data from the CMS. */
  raw: Record<string, unknown>
}
