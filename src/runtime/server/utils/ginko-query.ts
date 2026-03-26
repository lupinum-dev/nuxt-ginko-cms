import type { H3Event } from 'h3'
import type { GinkoHierarchyState, HierarchyEntry } from '../../../hierarchy'
import type { GinkoQueryOperation } from '../../types/api'
import { useRuntimeConfig } from '#imports'
import { createError } from 'h3'
import { buildGinkoHierarchyState, canonicalizeGinkoHierarchyPath, getGinkoHierarchyEntryPath, getGinkoHierarchySurroundEntries, resolveGinkoHierarchyPath } from '../../../hierarchy'
import {
  detectLocaleFromPath,
  isFlatCollection,
  isHierarchyCollection,
  localizeSitePath,
  normalizeSiteLocale,
  normalizeSitePath,
  resolveFlatPathBySlug,
  resolveFlatSlugByPath,
  resolveSiteLocales,
  stripLocalePrefix,
} from '../../shared/site.js'
import { isPopulateSupportedOperation, normalizePopulateFields } from '../../shared/query-populate.js'
import { asString } from '../../../type-guards'
import { fetchGinkoCmsJson } from './ginko-cms.js'
import { assertValidPublicItem } from './public-item.js'

interface HierarchyCacheStore {
  cache: Map<string, { expiresAt: number, state: unknown }>
  inflight: Map<string, Promise<unknown>>
}

declare const globalThis: {
  __ginkoCmsNuxtHierarchyCache?: HierarchyCacheStore
} & Record<string, unknown>

function getHierarchyStore(): HierarchyCacheStore {
  const globalScope = globalThis
  if (!globalScope.__ginkoCmsNuxtHierarchyCache) {
    globalScope.__ginkoCmsNuxtHierarchyCache = {
      cache: /* @__PURE__ */ new Map(),
      inflight: /* @__PURE__ */ new Map(),
    }
  }
  return globalScope.__ginkoCmsNuxtHierarchyCache
}
function getSiteConfig(event: H3Event): Record<string, unknown> {
  const runtimeConfig = useRuntimeConfig(event)
  const site = runtimeConfig.public.ginkoCms?.site
  if (!site) {
    throw createError({ statusCode: 500, statusMessage: '[ginko-cms] Missing ginkoCms.site configuration' })
  }
  return site as unknown as Record<string, unknown>
}
function toHierarchyDefaultLocale(args: { strategy: string, locale: string, defaultLocale: string }): string {
  if (args.strategy === 'none') {
    return args.locale
  }
  if (args.strategy === 'prefix_all') {
    return '__ginko_prefix_all__'
  }
  return args.defaultLocale
}
function resolveHierarchyBaseSegment(collection: Record<string, unknown>, locale: string): string {
  const routing = collection.routing as Record<string, unknown>
  const byLocale = (routing?.baseSegmentByLocale || {}) as Record<string, unknown>
  const fromLocale = asString(byLocale[locale])
  if (fromLocale) {
    return fromLocale
  }
  const fallback = asString(routing?.baseSegment)
  if (fallback) {
    return fallback
  }
  const firstByLocale = Object.values(byLocale).map(value => asString(value)).find(entry => Boolean(entry))
  if (firstByLocale) {
    return firstByLocale
  }
  throw createError({
    statusCode: 400,
    statusMessage: `[ginko-cms] Missing hierarchy base segment for collection ${collection.source}`,
  })
}
function resolveHierarchyRootSlug(collection: Record<string, unknown>, locale: string): string | undefined {
  const routing = collection.routing as Record<string, unknown>
  const rootSlugByLocale = (routing?.rootSlugByLocale || {}) as Record<string, unknown>
  const fromLocale = asString(rootSlugByLocale[locale])
  if (fromLocale) {
    return fromLocale
  }
  return asString(routing?.rootSlug)
}
function cacheKey(args: Record<string, unknown>): string {
  return [
    args.source,
    args.locale,
    args.defaultLocale,
    args.strategy,
    args.baseSegment,
    String(args.maxDepth),
    String(args.includeFolders),
    args.contentSlugField,
    args.contentTitleField,
    args.contentOrderField,
    args.contentIdField,
  ].join('::')
}
async function getHierarchyState(args: Record<string, unknown>): Promise<unknown> {
  const collection = args.collection as Record<string, unknown>
  const baseSegment = resolveHierarchyBaseSegment(collection, args.locale as string)
  const maxDepth = Math.max(1, Math.min((collection.maxDepth as number) || 5, 20))
  const includeFolders = collection.includeFolders === true
  const contentSlugField = (collection.contentSlugField as string) || 'slug'
  const contentTitleField = (collection.contentTitleField as string) || 'title'
  const contentOrderField = (collection.contentOrderField as string) || 'pageOrder'
  const contentIdField = (collection.contentIdField as string) || 'colocationFolderId'
  const key = cacheKey({
    source: collection.source,
    locale: args.locale,
    defaultLocale: args.defaultLocale,
    strategy: args.strategy,
    baseSegment,
    maxDepth,
    includeFolders,
    contentSlugField,
    contentTitleField,
    contentOrderField,
    contentIdField,
  })
  const store = getHierarchyStore()
  const now = Date.now()
  const cached = store.cache.get(key)
  if (cached && cached.expiresAt > now) {
    return cached.state
  }
  const inflight = store.inflight.get(key)
  if (inflight) {
    return inflight
  }
  const request = (async () => {
    const upstream = await fetchGinkoCmsJson(args.event as H3Event, `/api/v1/cms/${collection.source}`, {
      locale: collection.localized === false ? void 0 : args.locale,
      view: 'tree',
      include: 'content',
      maxDepth,
    })
    const rows = Array.isArray(upstream.body?.data) ? upstream.body.data : []
    const state = buildGinkoHierarchyState(rows, {
      locale: args.locale,
      defaultLocale: toHierarchyDefaultLocale({
        locale: args.locale as string,
        defaultLocale: args.defaultLocale as string,
        strategy: args.strategy as string,
      }),
      baseSegment,
      includeFolders,
      rootSlug: resolveHierarchyRootSlug(collection, args.locale as string),
      contentSlugField,
      contentTitleField,
      contentOrderField,
      contentIdField,
    })
    store.cache.set(key, {
      expiresAt: Date.now() + 6e4,
      state,
    })
    return state
  })().finally(() => {
    store.inflight.delete(key)
  })
  store.inflight.set(key, request)
  return request
}
function getLocaleForRequest(args: { site: Record<string, unknown>, explicitLocale?: string, path?: string }): { locale: string, normalizedPath?: string } {
  const localeState = resolveSiteLocales(args.site)
  const localeCodes = localeState.locales.map(locale => locale.code)
  const explicitLocale = asString(args.explicitLocale)
  if (explicitLocale) {
    return {
      locale: normalizeSiteLocale(explicitLocale, localeState.defaultLocale),
      normalizedPath: args.path ? normalizeSitePath(args.path) : void 0,
    }
  }
  if (args.path) {
    const normalizedPath = normalizeSitePath(args.path)
    const detected = detectLocaleFromPath({
      path: normalizedPath,
      locales: localeCodes,
      defaultLocale: localeState.defaultLocale,
      localePrefixStrategy: localeState.localePrefixStrategy,
    })
    return {
      locale: detected.locale,
      normalizedPath,
    }
  }
  return {
    locale: localeState.defaultLocale,
  }
}
function getCollectionOrThrow(site: Record<string, unknown>, key: string | undefined): Record<string, unknown> {
  if (!key) {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Missing collectionKey for this operation' })
  }
  const collections = (site.collections || {}) as Record<string, unknown>
  const collection = collections[key]
  if (!collection) {
    throw createError({ statusCode: 404, statusMessage: `[ginko-cms] Unknown collection key: ${key}` })
  }
  return collection as Record<string, unknown>
}
function mapNavigationEntry(entry: HierarchyEntry, state: GinkoHierarchyState): Record<string, unknown> {
  return {
    title: entry.title,
    slug: entry.slug,
    kind: entry.nodeKind,
    icon: entry.icon,
    badge: entry.badge,
    path: getGinkoHierarchyEntryPath(state, entry),
    children: entry.children.map((child: HierarchyEntry) => mapNavigationEntry(child, state)),
  }
}
function attachFlatPath(args: Record<string, unknown>): Record<string, unknown> {
  const collection = args.collection as Record<string, unknown>
  const item = args.item as Record<string, unknown>
  const slugField = (collection.slugField as string) || 'slug'
  const slug = asString(item[slugField]) || asString(item.slug)
  if (!slug) {
    return item
  }
  const canonicalPath = resolveFlatPathBySlug({
    collection,
    slug,
    locale: args.locale as string,
  })
  if (!canonicalPath) {
    return item
  }
  return {
    ...item,
    path: localizeSitePath({
      path: canonicalPath,
      locale: args.locale as string,
      defaultLocale: args.defaultLocale as string,
      localePrefixStrategy: args.strategy as string,
    }),
  }
}
function normalizeListQuery(payload: Record<string, unknown>): Record<string, unknown> {
  const sort = payload.sort as Record<string, unknown> | undefined
  const query: Record<string, unknown> = {
    ...((payload.where as Record<string, unknown>) || {}),
  }
  if (sort?.field) {
    query.sortBy = sort.field
    query.sortDir = (sort.dir as string) || 'asc'
  }
  if (typeof payload.limit === 'number') {
    query.limit = Math.max(1, Math.min(payload.limit, 200))
  }
  if (typeof payload.offset === 'number') {
    query.offset = Math.max(0, payload.offset)
  }
  if (payload.includeBody === true) {
    query.includeBody = true
  }
  const populate = normalizePopulateFields(payload.populate)
  if (populate.length > 0) {
    query.populate = populate.join(',')
  }
  return query
}
export async function resolveSitePath(event: H3Event, args: { path: string, locale?: string }): Promise<Record<string, unknown>> {
  const site = getSiteConfig(event)
  const localeState = resolveSiteLocales(site)
  const localeCodes = localeState.locales.map(locale => locale.code)
  const normalizedPath = normalizeSitePath(args.path)
  const detectedLocale = asString(args.locale)
    ? normalizeSiteLocale(args.locale!, localeState.defaultLocale)
    : detectLocaleFromPath({
      path: normalizedPath,
      locales: localeCodes,
      defaultLocale: localeState.defaultLocale,
      localePrefixStrategy: localeState.localePrefixStrategy,
    }).locale
  for (const [collectionKey, collection] of Object.entries((site.collections || {}) as Record<string, Record<string, unknown>>)) {
    if (!isHierarchyCollection(collection)) {
      continue
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale: detectedLocale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy,
    }) as GinkoHierarchyState
    const entry = resolveGinkoHierarchyPath(state, normalizedPath)
    if (!entry) {
      continue
    }
    const canonicalPath = canonicalizeGinkoHierarchyPath(state, normalizedPath)
    return {
      matched: true,
      path: normalizedPath,
      canonicalPath,
      locale: detectedLocale,
      kind: 'hierarchy',
      collectionKey,
      collectionSource: collection.source,
      slug: entry.slug,
      itemId: entry.itemId,
      contentId: entry.contentId,
    }
  }
  const canonicalLookupPath = stripLocalePrefix({
    path: normalizedPath,
    locale: detectedLocale,
    defaultLocale: localeState.defaultLocale,
    localePrefixStrategy: localeState.localePrefixStrategy,
  })
  for (const [collectionKey, collection] of Object.entries((site.collections || {}) as Record<string, Record<string, unknown>>)) {
    if (!isFlatCollection(collection)) {
      continue
    }
    const slug = resolveFlatSlugByPath({
      collection,
      locale: detectedLocale,
      path: canonicalLookupPath,
    })
    if (!slug) {
      continue
    }
    const canonicalPath = resolveFlatPathBySlug({
      collection,
      locale: detectedLocale,
      slug,
    })
    return {
      matched: true,
      path: normalizedPath,
      canonicalPath: canonicalPath
        ? localizeSitePath({
            path: canonicalPath,
            locale: detectedLocale,
            defaultLocale: localeState.defaultLocale,
            localePrefixStrategy: localeState.localePrefixStrategy,
          })
        : void 0,
      locale: detectedLocale,
      kind: 'flat',
      collectionKey,
      collectionSource: collection.source,
      slug,
    }
  }
  return {
    matched: false,
    path: normalizedPath,
    locale: detectedLocale,
  }
}
async function resolveHierarchyPath(args: Record<string, unknown>): Promise<string | undefined> {
  const collection = args.collection as Record<string, unknown>
  const item = args.item as Record<string, unknown>
  const state = await getHierarchyState({
    event: args.event,
    collection,
    locale: args.locale,
    defaultLocale: args.defaultLocale,
    strategy: args.strategy,
  }) as GinkoHierarchyState
  const itemId = asString(item.id)
  const contentId = asString(item[(collection.contentIdField as string) || 'colocationFolderId']) || asString(item.contentId)
  const slug = asString(item.slug)
  const resolvedPath = (itemId && state.pathByItemId[itemId]) || (contentId && state.pathByContentId[contentId]) || (slug && state.pathBySlug[slug])
  if (!resolvedPath) {
    return void 0
  }
  const nodeEntry = state.nodeByPath[resolvedPath]
  return nodeEntry ? getGinkoHierarchyEntryPath(state, nodeEntry) : canonicalizeGinkoHierarchyPath(state, resolvedPath)
}
async function fetchHierarchyItemFromResolved(args: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const resolved = args.resolved as Record<string, unknown>
  const collection = args.collection as Record<string, unknown>
  const query = args.query as Record<string, unknown>
  if (!resolved.slug) {
    return null
  }
  const getResponse = await fetchGinkoCmsJson(
    args.event as H3Event,
    `/api/v1/cms/${collection.source}/${resolved.slug}`,
    {
      ...query,
      locale: collection.localized === false ? void 0 : args.locale,
    },
  )
  if (getResponse.status === 200 && getResponse.body?.data) {
    return assertValidPublicItem(getResponse.body.data, {
      collectionSource: collection.source as string,
      op: 'page',
      includeBody: query.includeBody === true,
    })
  }
  return null
}
async function fetchItemByResolvedPath(args: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const { event, site, resolved, locale, defaultLocale, strategy, query } = args as {
    event: H3Event
    site: Record<string, unknown>
    resolved: Record<string, unknown>
    locale: string
    defaultLocale: string
    strategy: string
    query: Record<string, unknown>
  }
  if (!resolved.matched || !resolved.collectionKey) {
    return null
  }
  const collections = (site.collections || {}) as Record<string, unknown>
  const collection = collections[resolved.collectionKey as string] as Record<string, unknown> | undefined
  if (!collection) {
    return null
  }
  if (isFlatCollection(collection)) {
    if (!resolved.slug) {
      return null
    }
    const upstream = await fetchGinkoCmsJson(event, `/api/v1/cms/${collection.source}/${resolved.slug}`, {
      ...query,
      locale: collection.localized === false ? void 0 : locale,
    })
    if (upstream.status !== 200 || !upstream.body?.data) {
      return null
    }
    return attachFlatPath({
      item: assertValidPublicItem(upstream.body.data, {
        collectionSource: collection.source as string,
        op: 'page',
        includeBody: query.includeBody === true,
      }),
      collection,
      locale,
      defaultLocale,
      strategy,
    })
  }
  const hierarchyItem = await fetchHierarchyItemFromResolved({
    event,
    collection,
    resolved,
    locale,
    query,
  })
  if (!hierarchyItem) {
    return null
  }
  const hierarchyPath = await resolveHierarchyPath({
    event,
    collection,
    locale,
    defaultLocale,
    strategy,
    item: hierarchyItem,
  })
  return {
    ...hierarchyItem,
    ...hierarchyPath ? { path: hierarchyPath } : {},
  }
}
export async function executeGinkoQuery(event: H3Event, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const site = getSiteConfig(event)
  const localeState = resolveSiteLocales(site)
  const op = payload.op as GinkoQueryOperation
  const localeInfo = getLocaleForRequest({
    explicitLocale: payload.locale as string | undefined,
    path: payload.path as string | undefined,
    site,
  })
  const locale = localeInfo.locale
  const populate = normalizePopulateFields(payload.populate)
  if (populate.length > 0 && !isPopulateSupportedOperation(op)) {
    throw createError({
      statusCode: 400,
      statusMessage: `[ginko-cms] populate() is not supported for ${op}()`,
    })
  }
  if (op === 'search') {
    throw createError({
      statusCode: 410,
      statusMessage: '[ginko-cms] Server-proxy search is removed. Use useGinkoSearch() or queryGinko().search() which call Convex directly.',
    })
  }
  if (op === 'first' || op === 'find') {
    const query = normalizeListQuery(payload)
    if (payload.path) {
      const resolved = await resolveSitePath(event, {
        path: payload.path as string,
        locale: payload.locale as string | undefined,
      })
      if (!resolved.matched || !resolved.collectionKey) {
        return { data: op === 'first' ? null : [] }
      }
      const row = await fetchItemByResolvedPath({
        event,
        site,
        resolved,
        locale,
        defaultLocale: localeState.defaultLocale,
        strategy: localeState.localePrefixStrategy,
        query,
      })
      if (!row) {
        return { data: op === 'first' ? null : [] }
      }
      return {
        data: op === 'first' ? row : [row],
        meta: { resolved },
      }
    }
    const collection = getCollectionOrThrow(site, payload.collectionKey as string | undefined)
    const effectiveQuery: Record<string, unknown> = {
      ...query,
      ...op === 'first' ? { limit: 1 } : {},
      locale: collection.localized === false ? void 0 : locale,
    }
    const upstream = await fetchGinkoCmsJson(
      event,
      `/api/v1/cms/${collection.source}`,
      effectiveQuery,
    )
    const rows = Array.isArray(upstream.body?.data)
      ? upstream.body.data.map((row: unknown) => assertValidPublicItem(row, {
          collectionSource: collection.source as string,
          op: op as 'find' | 'first' | 'page',
          includeBody: payload.includeBody === true,
        }))
      : []
    if (isFlatCollection(collection)) {
      const mapped2 = rows.map((row: Record<string, unknown>) => attachFlatPath({
        item: row,
        collection,
        locale,
        defaultLocale: localeState.defaultLocale,
        strategy: localeState.localePrefixStrategy,
      }))
      return {
        data: op === 'first' ? mapped2[0] || null : mapped2,
        meta: upstream.body?.meta,
      }
    }
    const mapped = await Promise.all(rows.map(async (row: Record<string, unknown>) => {
      const path = await resolveHierarchyPath({
        event,
        collection,
        locale,
        defaultLocale: localeState.defaultLocale,
        strategy: localeState.localePrefixStrategy,
        item: row,
      })
      return {
        ...row,
        ...path ? { path } : {},
      }
    }))
    return {
      data: op === 'first' ? mapped[0] || null : mapped,
      meta: upstream.body?.meta,
    }
  }
  if (op === 'navigation') {
    const collection = getCollectionOrThrow(site, payload.collectionKey as string | undefined)
    if (!isHierarchyCollection(collection)) {
      throw createError({ statusCode: 400, statusMessage: '[ginko-cms] navigation() is only valid for hierarchy collections' })
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy,
    }) as GinkoHierarchyState
    return {
      data: state.tree.map((entry: HierarchyEntry) => mapNavigationEntry(entry, state)),
      meta: { locale },
    }
  }
  if (op === 'surround') {
    const collection = getCollectionOrThrow(site, payload.collectionKey as string | undefined)
    if (!isHierarchyCollection(collection)) {
      throw createError({ statusCode: 400, statusMessage: '[ginko-cms] surround() is only valid for hierarchy collections' })
    }
    const surround = payload.surround as Record<string, unknown> | undefined
    const requestedPath = (surround?.path || payload.path) as string | undefined
    if (!requestedPath) {
      throw createError({ statusCode: 400, statusMessage: '[ginko-cms] surround() requires a path' })
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy,
    }) as GinkoHierarchyState
    const resolved = await resolveSitePath(event, {
      path: requestedPath,
      locale,
    })
    const lookupPath = canonicalizeGinkoHierarchyPath(state, (resolved.canonicalPath || requestedPath) as string)
    const navigableEntries = getGinkoHierarchySurroundEntries(state, lookupPath, {
      scope: surround?.scope,
      includeFolders: collection.includeFolders,
    })
    const pages = navigableEntries.map((entry: HierarchyEntry) => ({
      entry,
      path: getGinkoHierarchyEntryPath(state, entry),
    })).filter(entry => Boolean(entry.path))
    const index = pages.findIndex(entry => entry.path === lookupPath)
    if (index < 0) {
      return { data: [null, null], meta: { locale } }
    }
    const previous = pages[index - 1]
    const next = pages[index + 1]
    return {
      data: [
        previous?.path ? { title: previous.entry.title, path: previous.path } : null,
        next?.path ? { title: next.entry.title, path: next.path } : null,
      ],
      meta: { locale },
    }
  }
  if (op === 'pathBy') {
    const collection = getCollectionOrThrow(site, payload.collectionKey as string | undefined)
    const input = (payload.pathBy || {}) as Record<string, unknown>
    if (isFlatCollection(collection)) {
      const slug = asString(input.slug)
      if (!slug) {
        throw createError({ statusCode: 400, statusMessage: '[ginko-cms] pathBy() for flat collections requires slug' })
      }
      const canonicalPath = resolveFlatPathBySlug({
        collection,
        slug,
        locale,
      })
      return {
        data: canonicalPath
          ? localizeSitePath({
              path: canonicalPath,
              locale,
              defaultLocale: localeState.defaultLocale,
              localePrefixStrategy: localeState.localePrefixStrategy,
            })
          : null,
        meta: { locale },
      }
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy,
    }) as GinkoHierarchyState
    const path = (asString(input.itemId) && state.pathByItemId[asString(input.itemId)!]) || (asString(input.contentId) && state.pathByContentId[asString(input.contentId)!]) || (asString(input.slug) && state.pathBySlug[asString(input.slug)!]) || null
    return {
      data: path ? canonicalizeGinkoHierarchyPath(state, path) : null,
      meta: { locale },
    }
  }
  if (op === 'page') {
    if (!payload.path) {
      throw createError({ statusCode: 400, statusMessage: '[ginko-cms] page() requires a path' })
    }
    const query = normalizeListQuery(payload)
    const resolved = await resolveSitePath(event, {
      path: payload.path as string,
      locale: payload.locale as string | undefined,
    })
    if (!resolved.matched) {
      return {
        data: {
          item: null,
          locale,
          collectionKey: void 0,
        },
      }
    }
    const requestedPath = normalizeSitePath(payload.path as string)
    const canonicalPath = resolved.canonicalPath ? normalizeSitePath(resolved.canonicalPath as string) : requestedPath
    if (canonicalPath !== requestedPath) {
      return {
        data: {
          item: null,
          redirect: canonicalPath,
          locale,
          collectionKey: resolved.collectionKey,
        },
      }
    }
    const item = await fetchItemByResolvedPath({
      event,
      site,
      resolved,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy,
      query,
    })
    return {
      data: {
        item: item ?? null,
        locale,
        collectionKey: resolved.collectionKey,
      },
    }
  }
  throw createError({ statusCode: 400, statusMessage: `[ginko-cms] Unsupported query operation: ${op}` })
}
