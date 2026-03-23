export interface GinkoCollections {
}
export type GinkoCmsLocalePrefixStrategy = 'prefix_except_default' | 'prefix_all' | 'none';
export interface GinkoCmsSiteLocale {
    code: string;
    hreflang: string;
    isDefault?: boolean;
}
export interface GinkoCmsSiteRouting {
    localePrefixStrategy?: GinkoCmsLocalePrefixStrategy;
}
export interface GinkoCmsSiteCollectionSearch {
    collections?: ReadonlyArray<string>;
    limit?: number;
}
export interface GinkoCmsSiteCollectionCommon {
    source: string;
    localized?: boolean;
    slugField?: string;
    keyField?: 'id' | 'slug';
    pageSize?: number;
    listQuery?: Record<string, unknown>;
    getQuery?: Record<string, unknown>;
    search?: GinkoCmsSiteCollectionSearch;
}
export interface GinkoCmsSiteFlatRouting {
    prefix?: string;
    prefixByLocale?: Record<string, string>;
    pathMapByLocale?: Record<string, Record<string, string>>;
}
export interface GinkoCmsSiteHierarchyRouting {
    baseSegment?: string;
    baseSegmentByLocale?: Record<string, string>;
    rootSlug?: string;
    rootSlugByLocale?: Record<string, string>;
}
export interface GinkoCmsSiteFlatCollection extends GinkoCmsSiteCollectionCommon {
    kind: 'flat';
    routing: GinkoCmsSiteFlatRouting;
}
export interface GinkoCmsSiteHierarchyCollection extends GinkoCmsSiteCollectionCommon {
    kind: 'hierarchy';
    routing: GinkoCmsSiteHierarchyRouting;
    maxDepth?: number;
    includeFolders?: boolean;
    contentSlugField?: string;
    contentTitleField?: string;
    contentOrderField?: string;
    contentIdField?: string;
}
export type GinkoCmsSiteCollection = GinkoCmsSiteFlatCollection | GinkoCmsSiteHierarchyCollection;
export interface GinkoCmsSiteSitemap {
    enabled?: boolean;
    sourcePath?: string;
}
export interface GinkoPageResponse<T = Record<string, unknown>> {
    item: T | null;
    redirect?: string;
    locale: string;
    collectionKey?: string;
}
export interface GinkoCmsSiteSearch {
    enabled?: boolean;
    defaultLimit?: number;
}
export interface GinkoCmsSiteConfig {
    defaultLocale?: string;
    locales: ReadonlyArray<GinkoCmsSiteLocale>;
    routing?: GinkoCmsSiteRouting;
    staticRoutes?: ReadonlyArray<string>;
    collections: Record<string, GinkoCmsSiteCollection>;
    search?: GinkoCmsSiteSearch;
    sitemap?: boolean | GinkoCmsSiteSitemap;
}
export interface GinkoResolveResponse {
    matched: boolean;
    path: string;
    locale: string;
    canonicalPath?: string;
    collectionKey?: string;
    collectionSource?: string;
    kind?: 'flat' | 'hierarchy';
    slug?: string;
    itemId?: string;
    contentId?: string;
}
export interface GinkoQueryOperationSearch {
    q: string;
    limit?: number;
}
export interface GinkoQueryOperationPathBy {
    itemId?: string;
    contentId?: string;
    slug?: string;
}
export interface GinkoQueryPayload {
    op: 'find' | 'first' | 'navigation' | 'surround' | 'search' | 'pathBy' | 'page';
    collectionKey?: string;
    path?: string;
    where?: Record<string, unknown>;
    sort?: {
        field: string;
        dir?: 'asc' | 'desc';
    };
    limit?: number;
    offset?: number;
    locale?: string | null;
    includeBody?: boolean;
    populate?: string[];
    search?: GinkoQueryOperationSearch;
    surround?: {
        path?: string;
    };
    pathBy?: GinkoQueryOperationPathBy;
}
export interface GinkoQueryResponse<T = Record<string, unknown>> {
    data: T;
    meta?: Record<string, unknown>;
}
export interface GinkoSearchHit {
    id?: string;
    collectionKey?: string;
    collectionSource?: string;
    slug?: string;
    title?: string;
    snippet?: string;
    path?: string;
    updatedAt?: number;
    raw: Record<string, unknown>;
}
