/**
 * Direct Convex search via HTTP API — zero dependencies, just fetch().
 *
 * POST {convexUrl}/api/query
 * { "path": "cms/search:search", "args": {...}, "format": "json" }
 */

export interface ConvexSearchHit {
  collectionSlug: string
  slug: string
  title: string
  snippet: string
  score: number
  updatedAt: number
  locale: string
}

export interface FetchConvexSearchArgs {
  convexUrl: string
  searchKey: string
  query: string
  collections: string[]
  locale?: string
  limit?: number
}

export class ConvexSearchError extends Error {
  code: string | undefined
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'ConvexSearchError'
    this.code = code
  }
}

export async function fetchConvexSearch(args: FetchConvexSearchArgs): Promise<ConvexSearchHit[]> {
  const res = await fetch(`${args.convexUrl}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      path: 'cms/search:search',
      args: {
        key: args.searchKey,
        query: args.query,
        collections: args.collections,
        locale: args.locale,
        limit: args.limit,
      },
      format: 'json',
    }),
  })

  if (!res.ok) {
    throw new ConvexSearchError(`Convex search failed with HTTP ${res.status}`, `http_${res.status}`)
  }

  let body: any
  try {
    body = await res.json()
  }
  catch {
    throw new ConvexSearchError(`Convex search returned non-JSON response (HTTP ${res.status})`)
  }

  if (body.status !== 'success') {
    throw new ConvexSearchError(body.errorMessage || 'Convex query failed', 'convex_error')
  }

  const value = body.value
  if (value.status !== 'ok') {
    throw new ConvexSearchError(value.error || 'Search error', value.error)
  }

  return value.hits
}
