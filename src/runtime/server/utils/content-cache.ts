/**
 * Content Cache
 *
 * Read/write cached content for production SSG builds
 */

import type { CmsItem } from '../../types/api'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export interface CacheOptions {
  /** Cache directory (relative to project root) */
  cacheDir: string
  /** Project root directory */
  rootDir: string
}

export interface CachedCollectionIndex {
  items: CmsItem[]
  total: number
  locale: string
  fetchedAt: number
}

export interface SearchIndexEntry {
  id: string
  slug: string
  collection: string
  route: string
  title: string
  excerpt: string
}

export interface SearchIndex {
  entries: SearchIndexEntry[]
  locale: string
  generatedAt: number
}

/**
 * Get the cache path for a collection index
 */
function getCollectionIndexPath(
  options: CacheOptions,
  locale: string,
  collectionSlug: string,
): string {
  return join(options.rootDir, 'public', options.cacheDir, locale, collectionSlug, 'index.json')
}

/**
 * Get the cache path for a single item
 */
function getItemPath(
  options: CacheOptions,
  locale: string,
  collectionSlug: string,
  itemSlug: string,
): string {
  return join(options.rootDir, 'public', options.cacheDir, locale, collectionSlug, `${itemSlug}.json`)
}

/**
 * Write a collection index to cache
 */
export async function writeCachedCollectionIndex(
  options: CacheOptions,
  locale: string,
  collectionSlug: string,
  items: CmsItem[],
): Promise<void> {
  const filePath = getCollectionIndexPath(options, locale, collectionSlug)
  await mkdir(dirname(filePath), { recursive: true })

  const index: CachedCollectionIndex = {
    items,
    total: items.length,
    locale,
    fetchedAt: Date.now(),
  }

  await writeFile(filePath, JSON.stringify(index, null, 2))
}

/**
 * Write a single item to cache
 */
export async function writeCachedItem(
  options: CacheOptions,
  locale: string,
  collectionSlug: string,
  item: CmsItem,
): Promise<void> {
  const slug = item.slug as string
  if (!slug) {
    console.warn(`Item ${item.id} has no slug, skipping cache`)
    return
  }

  const filePath = getItemPath(options, locale, collectionSlug, slug)
  await mkdir(dirname(filePath), { recursive: true })

  await writeFile(filePath, JSON.stringify(item, null, 2))
}

/**
 * Read a collection index from cache
 */
export async function readCachedCollectionIndex(
  options: CacheOptions,
  locale: string,
  collectionSlug: string,
): Promise<CachedCollectionIndex | null> {
  const filePath = getCollectionIndexPath(options, locale, collectionSlug)

  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}

/**
 * Read a single item from cache
 */
export async function readCachedItem(
  options: CacheOptions,
  locale: string,
  collectionSlug: string,
  itemSlug: string,
): Promise<CmsItem | null> {
  const filePath = getItemPath(options, locale, collectionSlug, itemSlug)

  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}

/**
 * List all cached item slugs for a collection
 */
export async function listCachedItemSlugs(
  options: CacheOptions,
  locale: string,
  collectionSlug: string,
): Promise<string[]> {
  const dirPath = join(options.rootDir, 'public', options.cacheDir, locale, collectionSlug)

  try {
    const files = await readdir(dirPath)
    return files
      .filter(f => f.endsWith('.json') && f !== 'index.json')
      .map(f => f.replace('.json', ''))
  }
  catch {
    return []
  }
}

/**
 * Clear all cached content
 */
export async function clearCache(options: CacheOptions): Promise<void> {
  const { rm } = await import('node:fs/promises')
  const cachePath = join(options.rootDir, 'public', options.cacheDir)

  try {
    await rm(cachePath, { recursive: true, force: true })
  }
  catch {
    // Ignore if doesn't exist
  }
}

/**
 * Get the path for the search index file
 */
function getSearchIndexPath(options: CacheOptions, locale: string): string {
  return join(options.rootDir, 'public', options.cacheDir, locale, 'search-index.json')
}

/**
 * Write search index to cache
 */
export async function writeSearchIndex(
  options: CacheOptions,
  locale: string,
  entries: SearchIndexEntry[],
): Promise<void> {
  const filePath = getSearchIndexPath(options, locale)
  await mkdir(dirname(filePath), { recursive: true })

  const index: SearchIndex = {
    entries,
    locale,
    generatedAt: Date.now(),
  }

  await writeFile(filePath, JSON.stringify(index, null, 2))
}

/**
 * Read search index from cache
 */
export async function readSearchIndex(
  options: CacheOptions,
  locale: string,
): Promise<SearchIndex | null> {
  const filePath = getSearchIndexPath(options, locale)

  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}
