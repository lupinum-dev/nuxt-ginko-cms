import { buildGinkoHierarchyState } from './hierarchy'
import { asNumber, asString } from './type-guards'

interface SitemapLocale {
  code: string
  hreflang: string
  isDefault?: boolean
}

interface NormalizedLocaleState {
  defaultLocale: string
  locales: SitemapLocale[]
}

interface GroupedRoute {
  key: string
  paths: Record<string, string>
  updatedAtByLocale: Record<string, number>
}

export interface SitemapEntry {
  loc: string
  alternatives: { hreflang: string, href: string }[]
  _sitemap: string
  lastmod?: string
}

interface RouteMapEntry {
  key: string
  paths: Record<string, string>
  lastmodByLocale?: Record<string, string>
}

interface SitemapSource {
  kind: string
  [key: string]: unknown
}

function normalizeBase(base: string): string {
  const parsed = new URL(base)
  parsed.pathname = '/'
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}
function normalizeRoutePath(path: unknown): string {
  const normalized = (asString(path) || '').replace(/\/{2,}/g, '/').replace(/\/+$/g, '')
  if (!normalized || normalized === '/') {
    return '/'
  }
  return normalized.startsWith('/') ? normalized : `/${normalized}`
}
function normalizePrefixPath(prefix: string): string {
  const normalized = normalizeRoutePath(prefix)
  return normalized
}
function localizeRoutePath(args: { path: string, localeCode: string, defaultLocale: string, localePrefixStrategy: string }): string {
  const normalizedPath = normalizeRoutePath(args.path)
  if (args.localePrefixStrategy === 'none') {
    return normalizedPath
  }
  const localePrefix = `/${args.localeCode}`
  if (normalizedPath === localePrefix || normalizedPath.startsWith(`${localePrefix}/`)) {
    return normalizedPath
  }
  if (args.localePrefixStrategy === 'prefix_except_default' && args.localeCode === args.defaultLocale) {
    return normalizedPath
  }
  return normalizeRoutePath(`${localePrefix}${normalizedPath}`)
}
async function fetchJson(url: URL, key: string): Promise<Record<string, unknown>> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`[ginko-cms] Sitemap upstream failed (${response.status}) at ${url.pathname}`)
  }
  return await response.json()
}
function normalizeLocales(args: { locales: SitemapLocale[], defaultLocale?: string }): NormalizedLocaleState {
  const seen = /* @__PURE__ */ new Set<string>()
  const unique = args.locales.filter((locale: SitemapLocale) => {
    const code = asString(locale.code)
    const hreflang = asString(locale.hreflang)
    if (!code || !hreflang || seen.has(code)) {
      return false
    }
    seen.add(code)
    return true
  }).map((locale: SitemapLocale) => ({
    code: locale.code.trim(),
    hreflang: locale.hreflang.trim(),
    isDefault: locale.isDefault === true,
  }))
  if (!unique.length) {
    throw new Error('[ginko-cms] Missing sitemap locales configuration')
  }
  const firstLocale = unique[0]
  if (!firstLocale) {
    throw new Error('[ginko-cms] Missing sitemap locales configuration')
  }
  const explicitDefault = asString(args.defaultLocale)
  const defaultLocale = explicitDefault || unique.find((locale: SitemapLocale) => locale.isDefault)?.code || firstLocale.code
  return {
    defaultLocale,
    locales: unique.map((locale: SitemapLocale) => ({
      ...locale,
      isDefault: locale.code === defaultLocale,
    })),
  }
}
async function resolveNormalizedLocales(args: { key: string, base: string, locales: SitemapLocale[], defaultLocale?: string }): Promise<NormalizedLocaleState> {
  const localeConfig = normalizeLocales({
    locales: args.locales,
    defaultLocale: args.defaultLocale,
  })
  let defaultLocale = localeConfig.defaultLocale
  if (!args.defaultLocale) {
    const contextUrl = new URL('/api/v1/cms/context', args.base)
    const context = await fetchJson(contextUrl, args.key)
    defaultLocale = asString(((context.data as Record<string, unknown>)?.locale as Record<string, unknown>)?.default) || defaultLocale
  }
  return {
    defaultLocale,
    locales: localeConfig.locales.map((locale: SitemapLocale) => ({
      ...locale,
      isDefault: locale.code === defaultLocale,
    })),
  }
}
function toIsoDate(value: unknown): string | undefined {
  if (!value) {
    return void 0
  }
  const date = new Date(value as string | number)
  return Number.isFinite(date.getTime()) ? date.toISOString() : void 0
}
function addGroupedRoute(args: { grouped: Map<string, GroupedRoute>, routeKey: string, localeCode: string, path: string, updatedAt?: number }): void {
  const current = args.grouped.get(args.routeKey) || {
    key: args.routeKey,
    paths: {},
    updatedAtByLocale: {},
  }
  current.paths[args.localeCode] = args.path
  const updatedAt = args.updatedAt
  if (typeof updatedAt === 'number' && Number.isFinite(updatedAt)) {
    const previous = current.updatedAtByLocale[args.localeCode] || 0
    if (updatedAt > previous) {
      current.updatedAtByLocale[args.localeCode] = updatedAt
    }
  }
  args.grouped.set(args.routeKey, current)
}
const SITEMAP_MAX_ITEMS = 50_000
const SITEMAP_MAX_PAGES = 500

async function fetchCollectionRows(args: { base: string, key: string, localeCode: string, collection: string, pageSize: number, maxItems?: number }): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = []
  const maxItems = args.maxItems ?? SITEMAP_MAX_ITEMS
  let offset = 0
  let page = 0
  while (page < SITEMAP_MAX_PAGES) {
    const url = new URL(`/api/v1/cms/${args.collection}`, args.base)
    url.searchParams.set('locale', args.localeCode)
    url.searchParams.set('limit', String(args.pageSize))
    url.searchParams.set('offset', String(offset))
    url.searchParams.set('sortBy', 'updatedAt')
    url.searchParams.set('sortDir', 'desc')
    const response = await fetchJson(url, args.key)
    const pageRows = Array.isArray(response.data) ? response.data as Record<string, unknown>[] : []
    rows.push(...pageRows)
    if (rows.length >= maxItems) {
      console.warn(`[ginko-cms] Sitemap: truncated ${args.collection} at ${rows.length} items (limit: ${maxItems})`)
      return rows.slice(0, maxItems)
    }
    if (pageRows.length < args.pageSize) {
      break
    }
    offset += args.pageSize
    page += 1
  }
  if (page >= SITEMAP_MAX_PAGES) {
    console.warn(`[ginko-cms] Sitemap: reached max page limit (${SITEMAP_MAX_PAGES}) for ${args.collection}`)
  }
  return rows
}
async function collectFlatCollectionRoutes(args: { base: string, key: string, locale: SitemapLocale, defaultLocale: string, localePrefixStrategy: string, source: SitemapSource & { collection: string, keyField?: string, slugField?: string, pathMapByLocale: Record<string, Record<string, string>>, pageSize?: number }, grouped: Map<string, GroupedRoute>, pageSize: number }): Promise<void> {
  const keyField = args.source.keyField || 'id'
  const slugField = asString(args.source.slugField) || 'slug'
  const pathMap = args.source.pathMapByLocale[args.locale.code] || {}
  const limit = Math.max(1, Math.min((args.source.pageSize as number) || args.pageSize, 100))
  const rows = await fetchCollectionRows({
    base: args.base,
    key: args.key,
    localeCode: args.locale.code,
    collection: args.source.collection,
    pageSize: limit,
  })
  for (const row of rows) {
    const slug = asString(row[slugField])
    if (!slug) {
      continue
    }
    const mappedPath = asString(pathMap[slug])
    if (!mappedPath) {
      continue
    }
    const itemKey = keyField === 'slug' ? slug : asString(row.id) || slug
    if (!itemKey) {
      continue
    }
    addGroupedRoute({
      grouped: args.grouped,
      routeKey: `flat:${args.source.collection}:${itemKey}`,
      localeCode: args.locale.code,
      path: localizeRoutePath({
        path: mappedPath,
        localeCode: args.locale.code,
        defaultLocale: args.defaultLocale,
        localePrefixStrategy: args.localePrefixStrategy,
      }),
      updatedAt: asNumber(row.updatedAt),
    })
  }
}
async function resolveFlatCollectionPathMap(args: { base: string, key: string, locales: SitemapLocale[], source: SitemapSource & { collection: string, slugField?: string, pageSize?: number, prefix?: string, prefixByLocale?: Record<string, string>, pathMapByLocale?: Record<string, Record<string, string>> }, pageSize: number }): Promise<Record<string, Record<string, string>>> {
  if (args.source.pathMapByLocale) {
    return Object.fromEntries(
      Object.entries(args.source.pathMapByLocale).map(([localeCode, pathMap]: [string, Record<string, string>]) => [
        localeCode,
        Object.fromEntries(
          Object.entries(pathMap).map(([slug, path]: [string, string]) => [slug, normalizeRoutePath(path)]),
        ),
      ]),
    )
  }
  const fallbackPrefix = asString(args.source.prefix)
  const slugField = asString(args.source.slugField) || 'slug'
  const limit = Math.max(1, Math.min((args.source.pageSize as number) || args.pageSize, 100))
  const output: Record<string, Record<string, string>> = {}
  for (const locale of args.locales) {
    const localePrefix = asString(args.source.prefixByLocale?.[locale.code]) || fallbackPrefix
    if (!localePrefix) {
      throw new Error(`[ginko-cms] Missing flat collection prefix for locale ${locale.code}`)
    }
    const normalizedPrefix = normalizePrefixPath(localePrefix)
    const rows = await fetchCollectionRows({
      base: args.base,
      key: args.key,
      localeCode: locale.code,
      collection: args.source.collection,
      pageSize: limit,
    })
    output[locale.code] = Object.fromEntries(
      rows.map((row: Record<string, unknown>) => {
        const slug = asString(row[slugField])
        if (!slug) {
          return void 0
        }
        const path = normalizeRoutePath(`${normalizedPrefix}/${slug}`)
        return [slug, path]
      }).filter((entry: unknown) => Boolean(entry)) as [string, string][],
    )
  }
  return output
}
async function collectHierarchyRoutes(args: { base: string, key: string, locale: SitemapLocale, defaultLocale: string, localePrefixStrategy: string, source: SitemapSource & { collection: string, maxDepth?: number, baseSegment?: string, baseSegmentByLocale?: Record<string, string>, includeFolders?: boolean, contentSlugField?: string, contentTitleField?: string, contentOrderField?: string, contentIdField?: string }, grouped: Map<string, GroupedRoute> }): Promise<void> {
  const maxDepth = Math.max(1, Math.min((args.source.maxDepth as number) || 5, 20))
  const url = new URL(`/api/v1/cms/${args.source.collection}`, args.base)
  url.searchParams.set('view', 'tree')
  url.searchParams.set('include', 'content')
  url.searchParams.set('maxDepth', String(maxDepth))
  url.searchParams.set('locale', args.locale.code)
  const response = await fetchJson(url, args.key)
  const rawNodes = Array.isArray(response.data) ? response.data : []
  const baseSegment = asString(args.source.baseSegmentByLocale?.[args.locale.code]) || args.source.baseSegment
  const hierarchyDefaultLocale = args.localePrefixStrategy === 'none' ? args.locale.code : args.localePrefixStrategy === 'prefix_all' ? '__ginko_all_locales__' : args.defaultLocale
  const hierarchy = buildGinkoHierarchyState(rawNodes, {
    locale: args.locale.code,
    defaultLocale: hierarchyDefaultLocale,
    baseSegment,
    includeFolders: args.source.includeFolders,
    contentSlugField: args.source.contentSlugField,
    contentTitleField: args.source.contentTitleField,
    contentOrderField: args.source.contentOrderField,
    contentIdField: args.source.contentIdField,
  })
  const entries = args.source.includeFolders ? hierarchy.flat : hierarchy.pages
  for (const entry of entries) {
    if (!entry.path) {
      continue
    }
    const itemKey = entry.itemId || entry.contentId || entry.path
    addGroupedRoute({
      grouped: args.grouped,
      routeKey: `hierarchy:${args.source.collection}:${itemKey}`,
      localeCode: args.locale.code,
      path: entry.path,
      updatedAt: entry.updatedAt,
    })
  }
}
async function normalizePresetToRouteMapOptions(options: Record<string, unknown>): Promise<Record<string, unknown>> {
  const key = asString(options.key)
  if (!key) {
    throw new Error('[ginko-cms] Missing key for sitemap generation')
  }
  const base = normalizeBase((options.base as string) || 'https://site.ginko-cms.com')
  const pageSize = Math.max(1, Math.min((options.pageSize as number) || 100, 100))
  const localePrefixStrategy = (options.localePrefixStrategy as string) || 'prefix_except_default'
  const staticUrls = (options.staticUrls as string[]) || []
  const flatCollections = (options.flatCollections as Record<string, unknown>[]) || []
  const hierarchyCollections = (options.hierarchyCollections as Record<string, unknown>[]) || []
  const localeState = await resolveNormalizedLocales({
    key,
    base,
    locales: options.locales as SitemapLocale[],
    defaultLocale: options.defaultLocale as string | undefined,
  })
  const sources: SitemapSource[] = [
    ...staticUrls.map((path: string, index: number) => ({
      kind: 'static',
      key: `static:${index}`,
      pathsByLocale: Object.fromEntries(
        localeState.locales.map((locale: SitemapLocale) => [locale.code, normalizeRoutePath(path)]),
      ),
    })),
  ]
  for (const collection of flatCollections) {
    const pathMapByLocale = await resolveFlatCollectionPathMap({
      base,
      key,
      locales: localeState.locales,
      source: collection as SitemapSource & { collection: string },
      pageSize,
    })
    sources.push({
      kind: 'flatCollection',
      collection: collection.collection,
      pathMapByLocale,
      keyField: collection.keyField,
      slugField: collection.slugField,
      pageSize: collection.pageSize,
    })
  }
  for (const collection of hierarchyCollections) {
    sources.push({
      kind: 'hierarchyCollection',
      collection: collection.collection,
      baseSegment: collection.baseSegment,
      baseSegmentByLocale: collection.baseSegmentByLocale,
      maxDepth: collection.maxDepth,
      includeFolders: collection.includeFolders,
      contentSlugField: collection.contentSlugField,
      contentTitleField: collection.contentTitleField,
      contentOrderField: collection.contentOrderField,
      contentIdField: collection.contentIdField,
    })
  }
  return {
    key,
    base,
    pageSize,
    defaultLocale: localeState.defaultLocale,
    locales: localeState.locales,
    localePrefixStrategy,
    sources,
  }
}
function dedupeSitemapEntries(entries: SitemapEntry[]): SitemapEntry[] {
  const byKey = /* @__PURE__ */ new Map<string, SitemapEntry>()
  for (const entry of entries) {
    const key = `${entry._sitemap}:${entry.loc}`
    if (!byKey.has(key)) {
      byKey.set(key, entry)
    }
  }
  return [...byKey.values()].sort((a: SitemapEntry, b: SitemapEntry) => {
    if (a.loc !== b.loc) {
      return a.loc.localeCompare(b.loc)
    }
    return a._sitemap.localeCompare(b._sitemap)
  })
}
function dedupeAndSortUrls(urls: string[]): string[] {
  return [...new Set(urls)].sort((a: string, b: string) => a.localeCompare(b))
}
async function getGinkoSitemapRouteMap(options: Record<string, unknown>): Promise<RouteMapEntry[]> {
  const key = asString(options.key)
  if (!key) {
    throw new Error('[ginko-cms] Missing key for sitemap generation')
  }
  const base = normalizeBase((options.base as string) || 'https://site.ginko-cms.com')
  const pageSize = Math.max(1, Math.min((options.pageSize as number) || 100, 100))
  const localePrefixStrategy = (options.localePrefixStrategy as string) || 'prefix_except_default'
  const localeState = await resolveNormalizedLocales({
    key,
    base,
    locales: options.locales as SitemapLocale[],
    defaultLocale: options.defaultLocale as string | undefined,
  })
  const grouped = /* @__PURE__ */ new Map<string, GroupedRoute>()
  for (const source of options.sources as SitemapSource[]) {
    if (source.kind === 'static') {
      for (const locale of localeState.locales) {
        const path = asString((source.pathsByLocale as Record<string, string>)[locale.code])
        if (!path) {
          continue
        }
        addGroupedRoute({
          grouped,
          routeKey: `static:${source.key as string}`,
          localeCode: locale.code,
          path: localizeRoutePath({
            path,
            localeCode: locale.code,
            defaultLocale: localeState.defaultLocale,
            localePrefixStrategy,
          }),
          updatedAt: source.updatedAt as number | undefined,
        })
      }
      continue
    }
    if (source.kind === 'flatCollection') {
      for (const locale of localeState.locales) {
        await collectFlatCollectionRoutes({
          base,
          key,
          locale,
          defaultLocale: localeState.defaultLocale,
          localePrefixStrategy,
          source: source as SitemapSource & { collection: string, keyField?: string, slugField?: string, pathMapByLocale: Record<string, Record<string, string>>, pageSize?: number },
          grouped,
          pageSize,
        })
      }
      continue
    }
    for (const locale of localeState.locales) {
      await collectHierarchyRoutes({
        base,
        key,
        locale,
        defaultLocale: localeState.defaultLocale,
        localePrefixStrategy,
        source: source as SitemapSource & { collection: string, maxDepth?: number, baseSegment?: string, baseSegmentByLocale?: Record<string, string>, includeFolders?: boolean, contentSlugField?: string, contentTitleField?: string, contentOrderField?: string, contentIdField?: string },
        grouped,
      })
    }
  }
  return [...grouped.values()].map((group: GroupedRoute) => {
    const lastmodByLocale = Object.fromEntries(
      Object.entries(group.updatedAtByLocale).map(([localeCode, updatedAt]: [string, number]) => [localeCode, toIsoDate(updatedAt)]).filter(([, value]: unknown[]) => Boolean(value)),
    )
    return {
      key: group.key,
      paths: group.paths,
      ...Object.keys(lastmodByLocale).length > 0 ? { lastmodByLocale } : {},
    }
  })
}
function toNuxtSitemapEntries(args: { routes: RouteMapEntry[], locales: SitemapLocale[], defaultLocale?: string }): SitemapEntry[] {
  const normalized = normalizeLocales({
    locales: args.locales,
    defaultLocale: args.defaultLocale,
  })
  const entries: SitemapEntry[] = []
  for (const route of args.routes) {
    const available = normalized.locales.filter((locale: SitemapLocale) => Boolean(route.paths[locale.code]))
    if (!available.length) {
      continue
    }
    const firstAvailable = available[0]
    if (!firstAvailable) {
      continue
    }
    const alternatives = available.map((locale: SitemapLocale) => ({
      hreflang: locale.hreflang,
      href: route.paths[locale.code] as string,
    }))
    const xDefaultLocale = available.find((locale: SitemapLocale) => locale.code === normalized.defaultLocale) || firstAvailable
    alternatives.push({
      hreflang: 'x-default',
      href: route.paths[xDefaultLocale.code] as string,
    })
    for (const locale of available) {
      entries.push({
        loc: route.paths[locale.code] as string,
        alternatives,
        _sitemap: locale.hreflang,
        lastmod: route.lastmodByLocale?.[locale.code],
      })
    }
  }
  entries.sort((a: SitemapEntry, b: SitemapEntry) => a.loc.localeCompare(b.loc))
  return entries
}
async function getGinkoLocalizedSitemapEntries(options: Record<string, unknown>): Promise<SitemapEntry[]> {
  const routes = await getGinkoSitemapRouteMap(options)
  return toNuxtSitemapEntries({
    routes,
    locales: options.locales as SitemapLocale[],
    defaultLocale: options.defaultLocale as string | undefined,
  })
}
async function getGinkoSitemapPresetEntries(options: Record<string, unknown>): Promise<SitemapEntry[]> {
  const routeMapOptions = await normalizePresetToRouteMapOptions(options)
  const entries = await getGinkoLocalizedSitemapEntries(routeMapOptions)
  return dedupeSitemapEntries(entries)
}
async function getGinkoSitemapPresetUrls(options: Record<string, unknown>): Promise<string[]> {
  const entries = await getGinkoSitemapPresetEntries(options)
  return dedupeAndSortUrls(entries.map((entry: SitemapEntry) => entry.loc))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPresetOptionsFromSiteConfig(options: { key: string, base: string, site: Record<string, any> }): Record<string, unknown> {
  const site = options.site as Record<string, unknown>
  const locales = ((site.locales as Record<string, unknown>[]) || []).map((locale: Record<string, unknown>) => ({
    code: locale.code as string,
    hreflang: locale.hreflang as string,
    isDefault: locale.code === ((site.defaultLocale as string) || ''),
  }))
  const defaultLocale = (site.defaultLocale as string) || locales.find((locale: SitemapLocale) => locale.isDefault)?.code || locales[0]?.code
  if (!defaultLocale) {
    throw new Error('[ginko-cms] Missing default locale in ginkoCms.site for sitemap generation')
  }
  const flatCollections: Record<string, unknown>[] = []
  const hierarchyCollections: Record<string, unknown>[] = []
  for (const collection of Object.values((site.collections as Record<string, Record<string, unknown>>) || {})) {
    if ((collection as Record<string, unknown>).kind === 'flat') {
      const routing = (collection as Record<string, unknown>).routing as Record<string, unknown>
      flatCollections.push({
        collection: (collection as Record<string, unknown>).source,
        keyField: (collection as Record<string, unknown>).keyField,
        slugField: (collection as Record<string, unknown>).slugField,
        pageSize: (collection as Record<string, unknown>).pageSize,
        prefix: routing.prefix,
        prefixByLocale: routing.prefixByLocale,
        pathMapByLocale: routing.pathMapByLocale,
      })
      continue
    }
    const routing = (collection as Record<string, unknown>).routing as Record<string, unknown>
    const baseSegment = asString(routing.baseSegment as unknown) || asString(Object.values((routing.baseSegmentByLocale as Record<string, unknown>) || {})[0] as unknown)
    if (!baseSegment) {
      throw new Error(`[ginko-cms] Missing hierarchy base segment for collection: ${(collection as Record<string, unknown>).source}`)
    }
    hierarchyCollections.push({
      collection: (collection as Record<string, unknown>).source,
      baseSegment,
      baseSegmentByLocale: routing.baseSegmentByLocale,
      maxDepth: (collection as Record<string, unknown>).maxDepth,
      includeFolders: (collection as Record<string, unknown>).includeFolders,
      contentSlugField: (collection as Record<string, unknown>).contentSlugField,
      contentTitleField: (collection as Record<string, unknown>).contentTitleField,
      contentOrderField: (collection as Record<string, unknown>).contentOrderField,
      contentIdField: (collection as Record<string, unknown>).contentIdField,
    })
  }
  const routing = site.routing as Record<string, unknown> | undefined
  const localePrefixStrategy = (routing?.localePrefixStrategy as string) || 'prefix_except_default'
  return {
    key: options.key,
    base: options.base,
    defaultLocale,
    locales,
    localePrefixStrategy,
    staticUrls: [...(site.staticRoutes as string[]) || []],
    flatCollections,
    hierarchyCollections,
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGinkoSitemapFromSiteConfig(options: { key: string, base: string, site: Record<string, any> }): Promise<RouteMapEntry[]> {
  const preset = toPresetOptionsFromSiteConfig(options)
  const routeMapOptions = await normalizePresetToRouteMapOptions(preset)
  return await getGinkoSitemapRouteMap(routeMapOptions)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGinkoSitemapEntriesFromSiteConfig(options: { key: string, base: string, site: Record<string, any> }): Promise<SitemapEntry[]> {
  const entries = await getGinkoSitemapPresetEntries(toPresetOptionsFromSiteConfig(options))
  return dedupeSitemapEntries(entries)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGinkoSitemapUrlsFromSiteConfig(options: { key: string, base: string, site: Record<string, any> }): Promise<string[]> {
  const entries = await getGinkoSitemapEntriesFromSiteConfig(options)
  return dedupeAndSortUrls(entries.map((entry: SitemapEntry) => entry.loc))
}

export { getGinkoLocalizedSitemapEntries, getGinkoSitemapEntriesFromSiteConfig, getGinkoSitemapFromSiteConfig, getGinkoSitemapPresetEntries, getGinkoSitemapPresetUrls, getGinkoSitemapRouteMap, getGinkoSitemapUrlsFromSiteConfig, toNuxtSitemapEntries }
