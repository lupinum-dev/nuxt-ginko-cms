import type { H3Event } from 'h3'
import { createError, getQuery } from 'h3'
import { useRuntimeConfig } from '#imports'

interface GinkoCmsStore {
  contextCache: Map<string, { expiresAt: number, value: unknown }>
  inflightContext: Map<string, Promise<unknown>>
}

declare const globalThis: {
  __ginkoCmsNuxtCache?: GinkoCmsStore
} & Record<string, unknown>

function getGlobalStore(): GinkoCmsStore {
  const globalScope = globalThis
  if (!globalScope.__ginkoCmsNuxtCache) {
    globalScope.__ginkoCmsNuxtCache = {
      contextCache: /* @__PURE__ */ new Map(),
      inflightContext: /* @__PURE__ */ new Map(),
    }
  }
  return globalScope.__ginkoCmsNuxtCache
}
function normalizeBaseUrl(value: string | undefined): string {
  if (!value) {
    throw createError({ statusCode: 500, statusMessage: '[ginko-cms] Missing ginkoCms.base runtime config' })
  }
  const parsed = new URL(value)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw createError({ statusCode: 500, statusMessage: '[ginko-cms] Invalid ginkoCms.base protocol' })
  }
  parsed.pathname = '/'
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}
export function getGinkoCmsConfig(event: H3Event) {
  const runtimeConfig = useRuntimeConfig(event)
  const ginkoCms = (runtimeConfig as Record<string, unknown>).ginkoCms as Record<string, unknown> | undefined
  const key = String(ginkoCms?.key || '').trim()
  if (!key) {
    throw createError({
      statusCode: 500,
      statusMessage: '[ginko-cms] Missing NUXT_GINKO_CMS_KEY or NUXT_GINKO_KEY (runtimeConfig.ginkoCms.key)',
    })
  }
  return {
    key,
    base: normalizeBaseUrl(String(ginkoCms?.base || 'https://site.ginko-cms.com')),
    locale: String(ginkoCms?.locale || '').trim() || void 0,
    timeoutMs: Number(ginkoCms?.timeoutMs || 8e3),
    contextTtlMs: Number(ginkoCms?.contextTtlMs || 3e5),
  }
}
function buildUpstreamUrl(base: string, path: string, query: Record<string, unknown>): URL {
  if (!path.startsWith('/api/')) {
    throw createError({ statusCode: 500, statusMessage: '[ginko-cms] Invalid upstream path' })
  }
  const target = new URL(path, base)
  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === null || rawValue === void 0 || rawValue === '') {
      continue
    }
    if (Array.isArray(rawValue)) {
      target.searchParams.set(key, rawValue.join(','))
      continue
    }
    target.searchParams.set(key, String(rawValue))
  }
  return target
}
function shouldRetryStatus(status: number): boolean {
  return status === 429 || status >= 500
}
async function fetchWithRetry(url: URL, init: RequestInit, timeoutMs: number): Promise<Response> {
  const attempts = 2
  let lastError: unknown = null
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!shouldRetryStatus(response.status) || attempt === attempts - 1) {
        return response
      }
      await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)))
    }
    catch (error) {
      clearTimeout(timeout)
      lastError = error
      if (attempt === attempts - 1) {
        break
      }
      await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)))
    }
  }
  const message = lastError instanceof Error ? lastError.message : String(lastError || 'unknown')
  throw createError({
    statusCode: 502,
    statusMessage: `[ginko-cms] Upstream request failed: ${message}`,
  })
}

interface FetchResult {
  status: number
  headers: Headers
  body: Record<string, unknown>
}

export async function fetchGinkoCmsJson(event: H3Event, path: string, query: Record<string, unknown> = {}): Promise<FetchResult> {
  const config = getGinkoCmsConfig(event)
  const url = buildUpstreamUrl(config.base, path, query)
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.key}`,
      Accept: 'application/json',
    },
  }, config.timeoutMs)
  const rawBody = await response.text()
  if (!rawBody.trim()) {
    throw createError({
      statusCode: 502,
      statusMessage: `[ginko-cms] Upstream returned empty response (${response.status}) for ${url.pathname}`,
    })
  }
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(rawBody)
  }
  catch {
    const snippet = rawBody.replace(/\s+/g, ' ').trim().slice(0, 160)
    throw createError({
      statusCode: 502,
      statusMessage: `[ginko-cms] Upstream returned non-JSON (${response.status}) for ${url.pathname}. Check NUXT_GINKO_CMS_BASE and CMS deployment. Body: ${snippet || '<empty>'}`,
    })
  }
  return {
    status: response.status,
    headers: response.headers,
    body: parsed,
  }
}
export async function getCachedGinkoCmsContext(event: H3Event): Promise<unknown> {
  const config = getGinkoCmsConfig(event)
  const cacheKey = `${config.base}::${config.key}`
  const now = Date.now()
  const store = getGlobalStore()
  const cached = store.contextCache.get(cacheKey)
  if (cached && cached.expiresAt > now) {
    return cached.value
  }
  const inflight = store.inflightContext.get(cacheKey)
  if (inflight) {
    return inflight
  }
  const request = (async () => {
    const result = await fetchGinkoCmsJson(event, '/api/v1/cms/context')
    if (result.status !== 200) {
      throw createError({
        statusCode: result.status,
        statusMessage: `[ginko-cms] Failed to resolve context (${result.status})`,
      })
    }
    const meta = result.body.meta as Record<string, unknown> | undefined
    const ttlSeconds = Number(meta?.cacheTtl || Math.max(Math.floor(config.contextTtlMs / 1e3), 60))
    store.contextCache.set(cacheKey, {
      expiresAt: Date.now() + ttlSeconds * 1e3,
      value: result.body,
    })
    return result.body
  })().finally(() => {
    store.inflightContext.delete(cacheKey)
  })
  store.inflightContext.set(cacheKey, request)
  return request
}
export function resolveLocale(event: H3Event, context: Record<string, unknown>): string {
  const query = getQuery(event)
  if (typeof query.locale === 'string' && query.locale.trim()) {
    return query.locale.trim()
  }
  const config = getGinkoCmsConfig(event)
  if (config.locale?.trim()) {
    return config.locale.trim()
  }
  const data = context.data as Record<string, unknown> | undefined
  const locale = data?.locale as Record<string, unknown> | undefined
  return (locale?.default as string) || 'en'
}
