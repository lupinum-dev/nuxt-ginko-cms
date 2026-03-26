/**
 * Shared helpers for client-side search path resolution.
 * Used by both `useGinkoSearch` and `queryGinko().search()`.
 */

import type { ConvexSearchHit } from './convexSearch.js'
import {
  isFlatCollection,
  isHierarchyCollection,
  localizeSitePath,
  resolveFlatPathBySlug,
} from '../../shared/site.js'

export interface CollectionEntry {
  key: string
  collection: Record<string, unknown>
}

/** Map collection keys → upstream source slugs, expanding search.collections overrides. */
export function resolveSourceCollections(
  collectionKeys: string[] | undefined,
  site: Record<string, unknown> | undefined,
): string[] {
  const collections = site?.collections as Record<string, Record<string, unknown>> | undefined
  if (!collections) return []
  const cols = collectionKeys ?? Object.keys(collections)
  return [...new Set(cols.flatMap((key: string) => {
    const col = collections[key]
    if (!col) return []
    const search = col.search as Record<string, unknown> | undefined
    const configured = search?.collections
    return Array.isArray(configured) && configured.length > 0 ? [...configured] : [col.source as string]
  }))]
}

/** Build reverse map: upstream source slug → { key, collection config }. */
export function buildSourceMap(site: Record<string, unknown> | undefined): Map<string, CollectionEntry> {
  const map = new Map<string, CollectionEntry>()
  const collections = site?.collections as Record<string, Record<string, unknown>> | undefined
  if (!collections) return map
  for (const [key, col] of Object.entries(collections)) {
    if (col.source) {
      map.set(col.source as string, { key, collection: col })
    }
  }
  return map
}

/** Resolve a search hit's upstream collection slug to the site collection key. */
export function resolveCollectionKey(sourceSlug: string, sourceMap: Map<string, CollectionEntry>): string | undefined {
  return sourceMap.get(sourceSlug)?.key
}

/** Resolve a search hit to its site path using collection routing config. */
export function resolveHitPath(
  hit: ConvexSearchHit,
  sourceMap: Map<string, CollectionEntry>,
  locale: string,
  site: Record<string, unknown> | undefined,
): string | undefined {
  const entry = sourceMap.get(hit.collectionSlug)
  if (!entry) return undefined
  const { collection } = entry
  const defaultLocale = (site?.defaultLocale as string) || 'en'
  const routing = site?.routing as Record<string, unknown> | undefined
  const localePrefixStrategy = (routing?.localePrefixStrategy as string) || 'none'

  if (isFlatCollection(collection)) {
    const canonicalPath = resolveFlatPathBySlug({ collection, slug: hit.slug, locale })
    if (canonicalPath) {
      return localizeSitePath({ path: canonicalPath, locale, defaultLocale, localePrefixStrategy })
    }
  }

  if (isHierarchyCollection(collection)) {
    const routing = collection.routing as Record<string, unknown> | undefined
    const baseSegment = routing?.baseSegment as string | undefined
    const rootSlug = routing?.rootSlug as string | undefined
    const rootSlugByLocale = (routing?.rootSlugByLocale || {}) as Record<string, string>
    const effectiveRootSlug = rootSlugByLocale[locale] || rootSlug
    if (baseSegment && hit.slug) {
      const isRoot = effectiveRootSlug && hit.slug === effectiveRootSlug
      const path = isRoot ? `/${baseSegment}` : `/${baseSegment}/${hit.slug}`
      return localizeSitePath({ path, locale, defaultLocale, localePrefixStrategy })
    }
  }

  return undefined
}
