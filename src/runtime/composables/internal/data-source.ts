export type CmsDataSource = 'api' | 'cache-server' | 'cache-client'

interface QueryOptions {
  populate?: string[]
  limit?: number
  offset?: number
}

/**
 * Decide where composables should fetch data from.
 */
export function resolveCmsDataSource(preview: boolean, isServer: boolean): CmsDataSource {
  if (preview) {
    return 'api'
  }
  return isServer ? 'cache-server' : 'cache-client'
}

export function buildCollectionProxyUrl(
  collectionSlug: string,
  locale: string,
  options: QueryOptions,
): string {
  const params = new URLSearchParams()
  params.set('locale', locale)

  if (options.limit) {
    params.set('limit', String(options.limit))
  }
  if (options.offset) {
    params.set('offset', String(options.offset))
  }
  if (options.populate?.length) {
    params.set('populate', options.populate.join(','))
  }

  return `/api/_cms/${collectionSlug}?${params.toString()}`
}

export function buildItemProxyUrl(
  collectionSlug: string,
  itemSlug: string,
  locale: string,
  options: QueryOptions,
): string {
  const params = new URLSearchParams()
  params.set('locale', locale)

  if (options.populate?.length) {
    params.set('populate', options.populate.join(','))
  }

  return `/api/_cms/${collectionSlug}/${itemSlug}?${params.toString()}`
}

export function buildCollectionCachePath(cacheDir: string, locale: string, collectionSlug: string): string {
  return `/${cacheDir}/${locale}/${collectionSlug}/index.json`
}

export function buildItemCachePath(
  cacheDir: string,
  locale: string,
  collectionSlug: string,
  itemSlug: string,
): string {
  return `/${cacheDir}/${locale}/${collectionSlug}/${itemSlug}.json`
}

export function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }
  const candidate = error as { status?: number, statusCode?: number }
  return candidate.status === 404 || candidate.statusCode === 404
}
