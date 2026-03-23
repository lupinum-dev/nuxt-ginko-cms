import { useRuntimeConfig } from '#imports'
import { createError } from 'h3'
import { buildGinkoHierarchyState, canonicalizeGinkoHierarchyPath, getGinkoHierarchyEntryPath, resolveGinkoHierarchyPath } from '../../../hierarchy'
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
  stripLocalePrefix
} from "../../shared/site.js";
import { isPopulateSupportedOperation, normalizePopulateFields } from "../../shared/query-populate.js";
import { fetchGinkoCmsJson } from "./ginko-cms.js";
import { sanitizeSearchSnippet } from "./search-snippet.js";
function getHierarchyStore() {
  const globalScope = globalThis;
  if (!globalScope.__ginkoCmsNuxtHierarchyCache) {
    globalScope.__ginkoCmsNuxtHierarchyCache = {
      cache: /* @__PURE__ */ new Map(),
      inflight: /* @__PURE__ */ new Map()
    };
  }
  return globalScope.__ginkoCmsNuxtHierarchyCache;
}
function getSiteConfig(event) {
  const runtimeConfig = useRuntimeConfig(event);
  const site = runtimeConfig.public.ginkoCms?.site;
  if (!site) {
    throw createError({ statusCode: 500, statusMessage: "[ginko-cms] Missing ginkoCms.site configuration" });
  }
  return site;
}
function asString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : void 0;
}
function asNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function toRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value;
}
function toHierarchyDefaultLocale(args) {
  if (args.strategy === "none") {
    return args.locale;
  }
  if (args.strategy === "prefix_all") {
    return "__ginko_prefix_all__";
  }
  return args.defaultLocale;
}
function resolveHierarchyBaseSegment(collection, locale) {
  const fromLocale = asString(collection.routing.baseSegmentByLocale?.[locale]);
  if (fromLocale) {
    return fromLocale;
  }
  const fallback = asString(collection.routing.baseSegment);
  if (fallback) {
    return fallback;
  }
  const firstByLocale = Object.values(collection.routing.baseSegmentByLocale || {}).map((value) => asString(value)).find((entry) => Boolean(entry));
  if (firstByLocale) {
    return firstByLocale;
  }
  throw createError({
    statusCode: 400,
    statusMessage: `[ginko-cms] Missing hierarchy base segment for collection ${collection.source}`
  });
}
function resolveHierarchyRootSlug(collection, locale) {
  const fromLocale = asString(collection.routing.rootSlugByLocale?.[locale]);
  if (fromLocale) {
    return fromLocale;
  }
  return asString(collection.routing.rootSlug);
}
function cacheKey(args) {
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
    args.contentIdField
  ].join("::");
}
async function getHierarchyState(args) {
  const baseSegment = resolveHierarchyBaseSegment(args.collection, args.locale);
  const maxDepth = Math.max(1, Math.min(args.collection.maxDepth || 5, 20));
  const includeFolders = args.collection.includeFolders === true;
  const contentSlugField = args.collection.contentSlugField || "slug";
  const contentTitleField = args.collection.contentTitleField || "title";
  const contentOrderField = args.collection.contentOrderField || "pageOrder";
  const contentIdField = args.collection.contentIdField || "colocationFolderId";
  const key = cacheKey({
    source: args.collection.source,
    locale: args.locale,
    defaultLocale: args.defaultLocale,
    strategy: args.strategy,
    baseSegment,
    maxDepth,
    includeFolders,
    contentSlugField,
    contentTitleField,
    contentOrderField,
    contentIdField
  });
  const store = getHierarchyStore();
  const now = Date.now();
  const cached = store.cache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.state;
  }
  const inflight = store.inflight.get(key);
  if (inflight) {
    return inflight;
  }
  const request = (async () => {
    const upstream = await fetchGinkoCmsJson(args.event, `/api/v2/cms/${args.collection.source}`, {
      locale: args.collection.localized === false ? void 0 : args.locale,
      view: "tree",
      include: "content",
      maxDepth
    });
    const rows = Array.isArray(upstream.body?.data) ? upstream.body.data : [];
    const state = buildGinkoHierarchyState(rows, {
      locale: args.locale,
      defaultLocale: toHierarchyDefaultLocale({
        locale: args.locale,
        defaultLocale: args.defaultLocale,
        strategy: args.strategy
      }),
      baseSegment,
      includeFolders,
      rootSlug: resolveHierarchyRootSlug(args.collection, args.locale),
      contentSlugField,
      contentTitleField,
      contentOrderField,
      contentIdField
    });
    store.cache.set(key, {
      expiresAt: Date.now() + 6e4,
      state
    });
    return state;
  })().finally(() => {
    store.inflight.delete(key);
  });
  store.inflight.set(key, request);
  return request;
}
function getLocaleForRequest(args) {
  const localeState = resolveSiteLocales(args.site);
  const localeCodes = localeState.locales.map((locale) => locale.code);
  const explicitLocale = asString(args.explicitLocale);
  if (explicitLocale) {
    return {
      locale: normalizeSiteLocale(explicitLocale, localeState.defaultLocale),
      normalizedPath: args.path ? normalizeSitePath(args.path) : void 0
    };
  }
  if (args.path) {
    const normalizedPath = normalizeSitePath(args.path);
    const detected = detectLocaleFromPath({
      path: normalizedPath,
      locales: localeCodes,
      defaultLocale: localeState.defaultLocale,
      localePrefixStrategy: localeState.localePrefixStrategy
    });
    return {
      locale: detected.locale,
      normalizedPath
    };
  }
  return {
    locale: localeState.defaultLocale
  };
}
function getCollectionOrThrow(site, key) {
  if (!key) {
    throw createError({ statusCode: 400, statusMessage: "[ginko-cms] Missing collectionKey for this operation" });
  }
  const collection = site.collections?.[key];
  if (!collection) {
    throw createError({ statusCode: 404, statusMessage: `[ginko-cms] Unknown collection key: ${key}` });
  }
  return collection;
}
function mapNavigationEntry(entry, state) {
  return {
    title: entry.title,
    slug: entry.slug,
    path: getGinkoHierarchyEntryPath(state, entry),
    children: entry.children.map((child) => mapNavigationEntry(child, state))
  };
}
function attachFlatPath(args) {
  const slugField = args.collection.slugField || "slug";
  const slug = asString(args.item[slugField]) || asString(args.item.slug);
  if (!slug) {
    return args.item;
  }
  const canonicalPath = resolveFlatPathBySlug({
    collection: args.collection,
    slug,
    locale: args.locale
  });
  if (!canonicalPath) {
    return args.item;
  }
  return {
    ...args.item,
    path: localizeSitePath({
      path: canonicalPath,
      locale: args.locale,
      defaultLocale: args.defaultLocale,
      localePrefixStrategy: args.strategy
    })
  };
}
function normalizeListQuery(payload) {
  const query = {
    ...payload.where || {}
  };
  if (payload.sort?.field) {
    query.sortBy = payload.sort.field;
    query.sortDir = payload.sort.dir || "asc";
  }
  if (typeof payload.limit === "number") {
    query.limit = Math.max(1, Math.min(payload.limit, 200));
  }
  if (typeof payload.offset === "number") {
    query.offset = Math.max(0, payload.offset);
  }
  if (payload.includeBody === true) {
    query.includeBody = true;
  }
  const populate = normalizePopulateFields(payload.populate);
  if (populate.length > 0) {
    query.populate = populate.join(",");
  }
  return query;
}
export async function resolveSitePath(event, args) {
  const site = getSiteConfig(event);
  const localeState = resolveSiteLocales(site);
  const localeCodes = localeState.locales.map((locale) => locale.code);
  const normalizedPath = normalizeSitePath(args.path);
  const detectedLocale = asString(args.locale) ? normalizeSiteLocale(args.locale, localeState.defaultLocale) : detectLocaleFromPath({
    path: normalizedPath,
    locales: localeCodes,
    defaultLocale: localeState.defaultLocale,
    localePrefixStrategy: localeState.localePrefixStrategy
  }).locale;
  for (const [collectionKey, collection] of Object.entries(site.collections || {})) {
    if (!isHierarchyCollection(collection)) {
      continue;
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale: detectedLocale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy
    });
    const entry = resolveGinkoHierarchyPath(state, normalizedPath);
    if (!entry) {
      continue;
    }
    const canonicalPath = canonicalizeGinkoHierarchyPath(state, normalizedPath);
    return {
      matched: true,
      path: normalizedPath,
      canonicalPath,
      locale: detectedLocale,
      kind: "hierarchy",
      collectionKey,
      collectionSource: collection.source,
      slug: entry.slug,
      itemId: entry.itemId,
      contentId: entry.contentId
    };
  }
  const canonicalLookupPath = stripLocalePrefix({
    path: normalizedPath,
    locale: detectedLocale,
    defaultLocale: localeState.defaultLocale,
    localePrefixStrategy: localeState.localePrefixStrategy
  });
  for (const [collectionKey, collection] of Object.entries(site.collections || {})) {
    if (!isFlatCollection(collection)) {
      continue;
    }
    const slug = resolveFlatSlugByPath({
      collection,
      locale: detectedLocale,
      path: canonicalLookupPath
    });
    if (!slug) {
      continue;
    }
    const canonicalPath = resolveFlatPathBySlug({
      collection,
      locale: detectedLocale,
      slug
    });
    return {
      matched: true,
      path: normalizedPath,
      canonicalPath: canonicalPath ? localizeSitePath({
        path: canonicalPath,
        locale: detectedLocale,
        defaultLocale: localeState.defaultLocale,
        localePrefixStrategy: localeState.localePrefixStrategy
      }) : void 0,
      locale: detectedLocale,
      kind: "flat",
      collectionKey,
      collectionSource: collection.source,
      slug
    };
  }
  return {
    matched: false,
    path: normalizedPath,
    locale: detectedLocale
  };
}
async function resolveHierarchyPath(args) {
  const state = await getHierarchyState({
    event: args.event,
    collection: args.collection,
    locale: args.locale,
    defaultLocale: args.defaultLocale,
    strategy: args.strategy
  });
  const itemId = asString(args.item.id);
  const contentId = asString(args.item[args.collection.contentIdField || "colocationFolderId"]) || asString(args.item.contentId);
  const slug = asString(args.item.slug);
  const resolvedPath = itemId && state.pathByItemId[itemId] || contentId && state.pathByContentId[contentId] || slug && state.pathBySlug[slug];
  if (!resolvedPath) {
    return void 0;
  }
  const entry = state.nodeByPath[resolvedPath];
  return entry ? getGinkoHierarchyEntryPath(state, entry) : canonicalizeGinkoHierarchyPath(state, resolvedPath);
}
async function fetchHierarchyItemFromResolved(args) {
  if (!args.resolved.slug) {
    return null;
  }
  const getResponse = await fetchGinkoCmsJson(
    args.event,
    `/api/v2/cms/${args.collection.source}/${args.resolved.slug}`,
    {
      ...args.query,
      locale: args.collection.localized === false ? void 0 : args.locale
    }
  );
  if (getResponse.status === 200 && getResponse.body?.data) {
    const candidate = toRecord(getResponse.body.data);
    const candidateId = asString(candidate.id);
    const candidateContentId = asString(candidate[args.collection.contentIdField || "colocationFolderId"]);
    if (!args.resolved.itemId || candidateId === args.resolved.itemId || candidateContentId === args.resolved.contentId) {
      return candidate;
    }
  }
  const listResponse = await fetchGinkoCmsJson(
    args.event,
    `/api/v2/cms/${args.collection.source}`,
    {
      ...args.query,
      locale: args.collection.localized === false ? void 0 : args.locale,
      limit: 200,
      sortBy: "updatedAt",
      sortDir: "desc"
    }
  );
  const rows = Array.isArray(listResponse.body?.data) ? listResponse.body.data : [];
  const match = rows.find((row) => {
    const record = toRecord(row);
    const rowId = asString(record.id);
    const rowContentId = asString(record[args.collection.contentIdField || "colocationFolderId"]);
    const rowSlug = asString(record.slug);
    if (args.resolved.itemId && rowId === args.resolved.itemId) {
      return true;
    }
    if (args.resolved.contentId && rowContentId === args.resolved.contentId) {
      return true;
    }
    return Boolean(args.resolved.slug && rowSlug === args.resolved.slug);
  });
  return match ? toRecord(match) : null;
}
function collectionFromSource(site, source) {
  const matched = Object.entries(site.collections || {}).find(([, collection2]) => collection2.source === source);
  if (!matched) {
    return void 0;
  }
  const [key, collection] = matched;
  return { key, collection };
}
async function fetchItemByResolvedPath(args) {
  const { event, site, resolved, locale, defaultLocale, strategy, query } = args;
  if (!resolved.matched || !resolved.collectionKey) {
    return null;
  }
  const collection = site.collections?.[resolved.collectionKey];
  if (!collection) {
    return null;
  }
  if (isFlatCollection(collection)) {
    if (!resolved.slug) {
      return null;
    }
    const upstream = await fetchGinkoCmsJson(event, `/api/v2/cms/${collection.source}/${resolved.slug}`, {
      ...query,
      locale: collection.localized === false ? void 0 : locale
    });
    if (upstream.status !== 200 || !upstream.body?.data) {
      return null;
    }
    return attachFlatPath({
      item: toRecord(upstream.body.data),
      collection,
      locale,
      defaultLocale,
      strategy
    });
  }
  const hierarchyItem = await fetchHierarchyItemFromResolved({
    event,
    collection,
    resolved,
    locale,
    query
  });
  if (!hierarchyItem) {
    return null;
  }
  const hierarchyPath = await resolveHierarchyPath({
    event,
    collection,
    locale,
    defaultLocale,
    strategy,
    item: hierarchyItem
  });
  return {
    ...hierarchyItem,
    ...hierarchyPath ? { path: hierarchyPath } : {}
  };
}
export async function executeGinkoQuery(event, payload) {
  const site = getSiteConfig(event);
  const localeState = resolveSiteLocales(site);
  const localeInfo = getLocaleForRequest({
    explicitLocale: payload.locale,
    path: payload.path,
    site
  });
  const locale = localeInfo.locale;
  const populate = normalizePopulateFields(payload.populate);
  if (populate.length > 0 && !isPopulateSupportedOperation(payload.op)) {
    throw createError({
      statusCode: 400,
      statusMessage: `[ginko-cms] populate() is not supported for ${payload.op}()`
    });
  }
  if (payload.op === "search") {
    const queryText = asString(payload.search?.q);
    if (!queryText || queryText.length < 2) {
      return { data: [] };
    }
    const selected = payload.collectionKey ? [getCollectionOrThrow(site, payload.collectionKey)] : Object.values(site.collections || {});
    const sourceCollections = [...new Set(selected.flatMap((collection) => {
      const configured = collection.search?.collections;
      return Array.isArray(configured) && configured.length > 0 ? [...configured] : [collection.source];
    }))];
    const limit = Math.max(1, Math.min(payload.search?.limit || site.search?.defaultLimit || 12, 100));
    const upstream = await fetchGinkoCmsJson(event, "/api/v2/cms/search", {
      q: queryText,
      collections: sourceCollections.join(","),
      limit,
      locale
    });
    const rows = Array.isArray(upstream.body?.data) ? upstream.body.data : [];
    const hits = [];
    for (const row of rows) {
      const record = toRecord(row);
      const source = asString(record.collectionSlug) || asString(record.collection) || "";
      const entry = collectionFromSource(site, source);
      const collection = entry?.collection;
      let path;
      if (collection && isFlatCollection(collection)) {
        const slug = asString(record.slug);
        if (slug) {
          const canonicalPath = resolveFlatPathBySlug({
            collection,
            slug,
            locale
          });
          if (canonicalPath) {
            path = localizeSitePath({
              path: canonicalPath,
              locale,
              defaultLocale: localeState.defaultLocale,
              localePrefixStrategy: localeState.localePrefixStrategy
            });
          }
        }
      }
      if (collection && isHierarchyCollection(collection)) {
        const state = await getHierarchyState({
          event,
          collection,
          locale,
          defaultLocale: localeState.defaultLocale,
          strategy: localeState.localePrefixStrategy
        });
        const id = asString(record.id);
        const contentId = asString(record.contentId) || asString(record[collection.contentIdField || "colocationFolderId"]);
        const slug = asString(record.slug);
        const resolvedPath = id && state.pathByItemId[id] || contentId && state.pathByContentId[contentId] || slug && state.pathBySlug[slug];
        path = resolvedPath ? canonicalizeGinkoHierarchyPath(state, resolvedPath) : void 0;
      }
      hits.push({
        id: asString(record.id),
        collectionKey: entry?.key,
        collectionSource: source || void 0,
        slug: asString(record.slug),
        title: asString(record.title),
        snippet: sanitizeSearchSnippet(asString(record.snippet)),
        path,
        updatedAt: asNumber(record.updatedAt),
        raw: record
      });
    }
    return {
      data: hits,
      meta: {
        locale,
        limit
      }
    };
  }
  if (payload.op === "first" || payload.op === "find") {
    const query = normalizeListQuery(payload);
    if (payload.path) {
      const resolved = await resolveSitePath(event, {
        path: payload.path,
        locale: payload.locale
      });
      if (!resolved.matched || !resolved.collectionKey) {
        return { data: payload.op === "first" ? null : [] };
      }
      const row = await fetchItemByResolvedPath({
        event,
        site,
        resolved,
        locale,
        defaultLocale: localeState.defaultLocale,
        strategy: localeState.localePrefixStrategy,
        query
      });
      if (!row) {
        return { data: payload.op === "first" ? null : [] };
      }
      return {
        data: payload.op === "first" ? row : [row],
        meta: { resolved }
      };
    }
    const collection = getCollectionOrThrow(site, payload.collectionKey);
    const effectiveQuery = {
      ...query,
      ...payload.op === "first" ? { limit: 1 } : {},
      locale: collection.localized === false ? void 0 : locale
    };
    const upstream = await fetchGinkoCmsJson(
      event,
      `/api/v2/cms/${collection.source}`,
      effectiveQuery
    );
    const rows = Array.isArray(upstream.body?.data) ? upstream.body.data.map((row) => toRecord(row)) : [];
    if (isFlatCollection(collection)) {
      const mapped2 = rows.map((row) => attachFlatPath({
        item: row,
        collection,
        locale,
        defaultLocale: localeState.defaultLocale,
        strategy: localeState.localePrefixStrategy
      }));
      return {
        data: payload.op === "first" ? mapped2[0] || null : mapped2,
        meta: upstream.body?.meta
      };
    }
    const mapped = await Promise.all(rows.map(async (row) => {
      const path = await resolveHierarchyPath({
        event,
        collection,
        locale,
        defaultLocale: localeState.defaultLocale,
        strategy: localeState.localePrefixStrategy,
        item: row
      });
      return {
        ...row,
        ...path ? { path } : {}
      };
    }));
    return {
      data: payload.op === "first" ? mapped[0] || null : mapped,
      meta: upstream.body?.meta
    };
  }
  if (payload.op === "navigation") {
    const collection = getCollectionOrThrow(site, payload.collectionKey);
    if (!isHierarchyCollection(collection)) {
      throw createError({ statusCode: 400, statusMessage: "[ginko-cms] navigation() is only valid for hierarchy collections" });
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy
    });
    return {
      data: state.tree.map((entry) => mapNavigationEntry(entry, state)),
      meta: { locale }
    };
  }
  if (payload.op === "surround") {
    const collection = getCollectionOrThrow(site, payload.collectionKey);
    if (!isHierarchyCollection(collection)) {
      throw createError({ statusCode: 400, statusMessage: "[ginko-cms] surround() is only valid for hierarchy collections" });
    }
    const requestedPath = payload.surround?.path || payload.path;
    if (!requestedPath) {
      throw createError({ statusCode: 400, statusMessage: "[ginko-cms] surround() requires a path" });
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy
    });
    const resolved = await resolveSitePath(event, {
      path: requestedPath,
      locale
    });
    const lookupPath = canonicalizeGinkoHierarchyPath(state, resolved.canonicalPath || requestedPath);
    const pages = state.pages.map((entry) => ({
      entry,
      path: getGinkoHierarchyEntryPath(state, entry)
    })).filter((entry) => Boolean(entry.path));
    const index = pages.findIndex((entry) => entry.path === lookupPath);
    if (index < 0) {
      return { data: [null, null], meta: { locale } };
    }
    const previous = pages[index - 1];
    const next = pages[index + 1];
    return {
      data: [
        previous?.path ? { title: previous.entry.title, path: previous.path } : null,
        next?.path ? { title: next.entry.title, path: next.path } : null
      ],
      meta: { locale }
    };
  }
  if (payload.op === "pathBy") {
    const collection = getCollectionOrThrow(site, payload.collectionKey);
    const input = payload.pathBy || {};
    if (isFlatCollection(collection)) {
      const slug = asString(input.slug);
      if (!slug) {
        throw createError({ statusCode: 400, statusMessage: "[ginko-cms] pathBy() for flat collections requires slug" });
      }
      const canonicalPath = resolveFlatPathBySlug({
        collection,
        slug,
        locale
      });
      return {
        data: canonicalPath ? localizeSitePath({
          path: canonicalPath,
          locale,
          defaultLocale: localeState.defaultLocale,
          localePrefixStrategy: localeState.localePrefixStrategy
        }) : null,
        meta: { locale }
      };
    }
    const state = await getHierarchyState({
      event,
      collection,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy
    });
    const path = asString(input.itemId) && state.pathByItemId[asString(input.itemId)] || asString(input.contentId) && state.pathByContentId[asString(input.contentId)] || asString(input.slug) && state.pathBySlug[asString(input.slug)] || null;
    return {
      data: path ? canonicalizeGinkoHierarchyPath(state, path) : null,
      meta: { locale }
    };
  }
  if (payload.op === "page") {
    if (!payload.path) {
      throw createError({ statusCode: 400, statusMessage: "[ginko-cms] page() requires a path" });
    }
    const query = normalizeListQuery(payload);
    const resolved = await resolveSitePath(event, {
      path: payload.path,
      locale: payload.locale
    });
    if (!resolved.matched) {
      return {
        data: {
          item: null,
          locale,
          collectionKey: void 0
        }
      };
    }
    const requestedPath = normalizeSitePath(payload.path);
    const canonicalPath = resolved.canonicalPath ? normalizeSitePath(resolved.canonicalPath) : requestedPath;
    if (canonicalPath !== requestedPath) {
      return {
        data: {
          item: null,
          redirect: canonicalPath,
          locale,
          collectionKey: resolved.collectionKey
        }
      };
    }
    const item = await fetchItemByResolvedPath({
      event,
      site,
      resolved,
      locale,
      defaultLocale: localeState.defaultLocale,
      strategy: localeState.localePrefixStrategy,
      query
    });
    return {
      data: {
        item: item ?? null,
        locale,
        collectionKey: resolved.collectionKey
      }
    };
  }
  throw createError({ statusCode: 400, statusMessage: `[ginko-cms] Unsupported query operation: ${payload.op}` });
}
