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
  collection: any
}

/** Map collection keys → upstream source slugs, expanding search.collections overrides. */
export function resolveSourceCollections(
  collectionKeys: string[] | undefined,
  site: any,
): string[] {
  if (!site?.collections) return []
  const cols = collectionKeys ?? Object.keys(site.collections)
  return [...new Set(cols.flatMap((key: string) => {
    const col = site.collections[key]
    if (!col) return []
    const configured = col.search?.collections
    return Array.isArray(configured) && configured.length > 0 ? [...configured] : [col.source]
  }))]
}

/** Build reverse map: upstream source slug → { key, collection config }. */
export function buildSourceMap(site: any): Map<string, CollectionEntry> {
  const map = new Map<string, CollectionEntry>()
  if (!site?.collections) return map
  for (const [key, col] of Object.entries(site.collections) as [string, any][]) {
    if (col.source) {
      map.set(col.source, { key, collection: col })
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
  site: any,
): string | undefined {
  const entry = sourceMap.get(hit.collectionSlug)
  if (!entry) return undefined
  const { collection } = entry
  const defaultLocale = site?.defaultLocale || 'en'
  const localePrefixStrategy = site?.routing?.localePrefixStrategy || 'none'

  if (isFlatCollection(collection)) {
    const canonicalPath = resolveFlatPathBySlug({ collection, slug: hit.slug, locale })
    if (canonicalPath) {
      return localizeSitePath({ path: canonicalPath, locale, defaultLocale, localePrefixStrategy })
    }
  }

  if (isHierarchyCollection(collection)) {
    const baseSegment = collection.routing?.baseSegment
    if (baseSegment && hit.slug) {
      const path = `/${baseSegment}/${hit.slug}`
      return localizeSitePath({ path, locale, defaultLocale, localePrefixStrategy })
    }
  }

  return undefined
}
