/**
 * Client-side fuzzy search for CMS collections using Fuse.js
 * Works in both dev (API) and production (static cache) modes
 */
import type { ComputedRef, Ref } from 'vue'
import Fuse from 'fuse.js'

interface CmsItem {
  id: string
  slug: string
  [key: string]: unknown
}

export interface UseCmsSearchOptions {
  /** Fields to search (default: ['title', 'excerpt', 'slug']) */
  keys?: string[]
  /** Fuse.js threshold: 0 = exact, 1 = fuzzy (default: 0.3) */
  threshold?: number
  /** Maximum results to return (default: 20) */
  limit?: number
}

export interface UseCmsSearchReturn<T extends CmsItem> {
  query: Ref<string>
  results: ComputedRef<T[]>
  hasResults: ComputedRef<boolean>
  isSearching: ComputedRef<boolean>
  resultCount: ComputedRef<number>
}

/**
 * Create a fuzzy search over a list of items using Fuse.js
 *
 * @param items - Ref containing the items to search
 * @param options - Search configuration options
 *
 * @example
 * ```ts
 * const { data: blogs } = await useCmsCollection('blogs')
 * const items = computed(() => blogs.value?.items ?? [])
 *
 * const { query, results, isSearching } = useCmsSearch(items, {
 *   keys: ['title', 'excerpt', 'content'],
 *   threshold: 0.4,
 *   limit: 10
 * })
 *
 * // Bind query to input, results will update reactively
 * ```
 */
export function useCmsSearch<T extends CmsItem>(
  items: Ref<T[]> | ComputedRef<T[]>,
  options: UseCmsSearchOptions = {},
): UseCmsSearchReturn<T> {
  const {
    keys = ['title', 'excerpt', 'slug'],
    threshold = 0.3,
    limit = 20,
  } = options

  const query = ref('')

  // Initialize Fuse.js when items are loaded
  const fuse = computed(() => {
    const itemList = items.value
    if (!itemList?.length)
      return null

    return new Fuse(itemList, {
      keys,
      threshold,
      includeScore: true,
      ignoreLocation: true, // Search anywhere in string
    })
  })

  // Computed search results
  const results = computed<T[]>(() => {
    const trimmedQuery = query.value.trim()

    // Return all items when no query
    if (!trimmedQuery) {
      return items.value ?? []
    }

    if (!fuse.value)
      return []

    return fuse.value
      .search(trimmedQuery)
      .slice(0, limit)
      .map(result => result.item)
  })

  const hasResults = computed(() => results.value.length > 0)
  const isSearching = computed(() => query.value.trim().length > 0)
  const resultCount = computed(() => results.value.length)

  return {
    query,
    results,
    hasResults,
    isSearching,
    resultCount,
  }
}
