import { buildGinkoHierarchyState } from './hierarchy'

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
function normalizeBase(base) {
  const parsed = new URL(base);
  parsed.pathname = "/";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}
function normalizeRoutePath(path) {
  const normalized = (asString(path) || "").replace(/\/{2,}/g, "/").replace(/\/+$/g, "");
  if (!normalized || normalized === "/") {
    return "/";
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
function normalizePrefixPath(prefix) {
  const normalized = normalizeRoutePath(prefix);
  return normalized;
}
function localizeRoutePath(args) {
  const normalizedPath = normalizeRoutePath(args.path);
  if (args.localePrefixStrategy === "none") {
    return normalizedPath;
  }
  const localePrefix = `/${args.localeCode}`;
  if (normalizedPath === localePrefix || normalizedPath.startsWith(`${localePrefix}/`)) {
    return normalizedPath;
  }
  if (args.localePrefixStrategy === "prefix_except_default" && args.localeCode === args.defaultLocale) {
    return normalizedPath;
  }
  return normalizeRoutePath(`${localePrefix}${normalizedPath}`);
}
async function fetchJson(url, key) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`[ginko-cms] Sitemap upstream failed (${response.status}) at ${url.pathname}`);
  }
  return await response.json();
}
function normalizeLocales(args) {
  const seen = /* @__PURE__ */ new Set();
  const unique = args.locales.filter((locale) => {
    const code = asString(locale.code);
    const hreflang = asString(locale.hreflang);
    if (!code || !hreflang || seen.has(code)) {
      return false;
    }
    seen.add(code);
    return true;
  }).map((locale) => ({
    code: locale.code.trim(),
    hreflang: locale.hreflang.trim(),
    isDefault: locale.isDefault === true
  }));
  if (!unique.length) {
    throw new Error("[ginko-cms] Missing sitemap locales configuration");
  }
  const firstLocale = unique[0];
  if (!firstLocale) {
    throw new Error("[ginko-cms] Missing sitemap locales configuration");
  }
  const explicitDefault = asString(args.defaultLocale);
  const defaultLocale = explicitDefault || unique.find((locale) => locale.isDefault)?.code || firstLocale.code;
  return {
    defaultLocale,
    locales: unique.map((locale) => ({
      ...locale,
      isDefault: locale.code === defaultLocale
    }))
  };
}
async function resolveNormalizedLocales(args) {
  const localeConfig = normalizeLocales({
    locales: args.locales,
    defaultLocale: args.defaultLocale
  });
  let defaultLocale = localeConfig.defaultLocale;
  if (!args.defaultLocale) {
    const contextUrl = new URL("/api/v1/cms/context", args.base);
    const context = await fetchJson(contextUrl, args.key);
    defaultLocale = asString(context.data?.locale?.default) || defaultLocale;
  }
  return {
    defaultLocale,
    locales: localeConfig.locales.map((locale) => ({
      ...locale,
      isDefault: locale.code === defaultLocale
    }))
  };
}
function toIsoDate(value) {
  if (!value) {
    return void 0;
  }
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : void 0;
}
function addGroupedRoute(args) {
  const current = args.grouped.get(args.routeKey) || {
    key: args.routeKey,
    paths: {},
    updatedAtByLocale: {}
  };
  current.paths[args.localeCode] = args.path;
  const updatedAt = args.updatedAt;
  if (typeof updatedAt === "number" && Number.isFinite(updatedAt)) {
    const previous = current.updatedAtByLocale[args.localeCode] || 0;
    if (updatedAt > previous) {
      current.updatedAtByLocale[args.localeCode] = updatedAt;
    }
  }
  args.grouped.set(args.routeKey, current);
}
async function fetchCollectionRows(args) {
  const rows = [];
  let offset = 0;
  while (true) {
    const url = new URL(`/api/v1/cms/${args.collection}`, args.base);
    url.searchParams.set("locale", args.localeCode);
    url.searchParams.set("limit", String(args.pageSize));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("sortBy", "updatedAt");
    url.searchParams.set("sortDir", "desc");
    const response = await fetchJson(url, args.key);
    const pageRows = Array.isArray(response.data) ? response.data : [];
    rows.push(...pageRows);
    if (pageRows.length < args.pageSize) {
      break;
    }
    offset += args.pageSize;
  }
  return rows;
}
async function collectFlatCollectionRoutes(args) {
  const keyField = args.source.keyField || "id";
  const slugField = asString(args.source.slugField) || "slug";
  const pathMap = args.source.pathMapByLocale[args.locale.code] || {};
  const limit = Math.max(1, Math.min(args.source.pageSize || args.pageSize, 100));
  const rows = await fetchCollectionRows({
    base: args.base,
    key: args.key,
    localeCode: args.locale.code,
    collection: args.source.collection,
    pageSize: limit
  });
  for (const row of rows) {
    const slug = asString(row[slugField]);
    if (!slug) {
      continue;
    }
    const mappedPath = asString(pathMap[slug]);
    if (!mappedPath) {
      continue;
    }
    const itemKey = keyField === "slug" ? slug : asString(row.id) || slug;
    if (!itemKey) {
      continue;
    }
    addGroupedRoute({
      grouped: args.grouped,
      routeKey: `flat:${args.source.collection}:${itemKey}`,
      localeCode: args.locale.code,
      path: localizeRoutePath({
        path: mappedPath,
        localeCode: args.locale.code,
        defaultLocale: args.defaultLocale,
        localePrefixStrategy: args.localePrefixStrategy
      }),
      updatedAt: asNumber(row.updatedAt)
    });
  }
}
async function resolveFlatCollectionPathMap(args) {
  if (args.source.pathMapByLocale) {
    return Object.fromEntries(
      Object.entries(args.source.pathMapByLocale).map(([localeCode, pathMap]) => [
        localeCode,
        Object.fromEntries(
          Object.entries(pathMap).map(([slug, path]) => [slug, normalizeRoutePath(path)])
        )
      ])
    );
  }
  const fallbackPrefix = asString(args.source.prefix);
  const slugField = asString(args.source.slugField) || "slug";
  const limit = Math.max(1, Math.min(args.source.pageSize || args.pageSize, 100));
  const output = {};
  for (const locale of args.locales) {
    const localePrefix = asString(args.source.prefixByLocale?.[locale.code]) || fallbackPrefix;
    if (!localePrefix) {
      throw new Error(`[ginko-cms] Missing flat collection prefix for locale ${locale.code}`);
    }
    const normalizedPrefix = normalizePrefixPath(localePrefix);
    const rows = await fetchCollectionRows({
      base: args.base,
      key: args.key,
      localeCode: locale.code,
      collection: args.source.collection,
      pageSize: limit
    });
    output[locale.code] = Object.fromEntries(
      rows.map((row) => {
        const slug = asString(row[slugField]);
        if (!slug) {
          return void 0;
        }
        const path = normalizeRoutePath(`${normalizedPrefix}/${slug}`);
        return [slug, path];
      }).filter((entry) => Boolean(entry))
    );
  }
  return output;
}
async function collectHierarchyRoutes(args) {
  const maxDepth = Math.max(1, Math.min(args.source.maxDepth || 5, 20));
  const url = new URL(`/api/v1/cms/${args.source.collection}`, args.base);
  url.searchParams.set("view", "tree");
  url.searchParams.set("include", "content");
  url.searchParams.set("maxDepth", String(maxDepth));
  url.searchParams.set("locale", args.locale.code);
  const response = await fetchJson(url, args.key);
  const rawNodes = Array.isArray(response.data) ? response.data : [];
  const baseSegment = asString(args.source.baseSegmentByLocale?.[args.locale.code]) || args.source.baseSegment;
  const hierarchyDefaultLocale = args.localePrefixStrategy === "none" ? args.locale.code : args.localePrefixStrategy === "prefix_all" ? "__ginko_all_locales__" : args.defaultLocale;
  const hierarchy = buildGinkoHierarchyState(rawNodes, {
    locale: args.locale.code,
    defaultLocale: hierarchyDefaultLocale,
    baseSegment,
    includeFolders: args.source.includeFolders,
    contentSlugField: args.source.contentSlugField,
    contentTitleField: args.source.contentTitleField,
    contentOrderField: args.source.contentOrderField,
    contentIdField: args.source.contentIdField
  });
  const entries = args.source.includeFolders ? hierarchy.flat : hierarchy.pages;
  for (const entry of entries) {
    if (!entry.path) {
      continue;
    }
    const itemKey = entry.itemId || entry.contentId || entry.path;
    addGroupedRoute({
      grouped: args.grouped,
      routeKey: `hierarchy:${args.source.collection}:${itemKey}`,
      localeCode: args.locale.code,
      path: entry.path,
      updatedAt: entry.updatedAt
    });
  }
}
async function normalizePresetToRouteMapOptions(options) {
  const key = asString(options.key);
  if (!key) {
    throw new Error("[ginko-cms] Missing key for sitemap generation");
  }
  const base = normalizeBase(options.base || "https://site.ginko-cms.com");
  const pageSize = Math.max(1, Math.min(options.pageSize || 100, 100));
  const localePrefixStrategy = options.localePrefixStrategy || "prefix_except_default";
  const staticUrls = options.staticUrls || [];
  const flatCollections = options.flatCollections || [];
  const hierarchyCollections = options.hierarchyCollections || [];
  const localeState = await resolveNormalizedLocales({
    key,
    base,
    locales: options.locales,
    defaultLocale: options.defaultLocale
  });
  const sources = [
    ...staticUrls.map((path, index) => ({
      kind: "static",
      key: `static:${index}`,
      pathsByLocale: Object.fromEntries(
        localeState.locales.map((locale) => [locale.code, normalizeRoutePath(path)])
      )
    }))
  ];
  for (const collection of flatCollections) {
    const pathMapByLocale = await resolveFlatCollectionPathMap({
      base,
      key,
      locales: localeState.locales,
      source: collection,
      pageSize
    });
    sources.push({
      kind: "flatCollection",
      collection: collection.collection,
      pathMapByLocale,
      keyField: collection.keyField,
      slugField: collection.slugField,
      pageSize: collection.pageSize
    });
  }
  for (const collection of hierarchyCollections) {
    sources.push({
      kind: "hierarchyCollection",
      collection: collection.collection,
      baseSegment: collection.baseSegment,
      baseSegmentByLocale: collection.baseSegmentByLocale,
      maxDepth: collection.maxDepth,
      includeFolders: collection.includeFolders,
      contentSlugField: collection.contentSlugField,
      contentTitleField: collection.contentTitleField,
      contentOrderField: collection.contentOrderField,
      contentIdField: collection.contentIdField
    });
  }
  return {
    key,
    base,
    pageSize,
    defaultLocale: localeState.defaultLocale,
    locales: localeState.locales,
    localePrefixStrategy,
    sources
  };
}
function dedupeSitemapEntries(entries) {
  const byKey = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const key = `${entry._sitemap}:${entry.loc}`;
    if (!byKey.has(key)) {
      byKey.set(key, entry);
    }
  }
  return [...byKey.values()].sort((a, b) => {
    if (a.loc !== b.loc) {
      return a.loc.localeCompare(b.loc);
    }
    return a._sitemap.localeCompare(b._sitemap);
  });
}
function dedupeAndSortUrls(urls) {
  return [...new Set(urls)].sort((a, b) => a.localeCompare(b));
}
async function getGinkoSitemapRouteMap(options) {
  const key = asString(options.key);
  if (!key) {
    throw new Error("[ginko-cms] Missing key for sitemap generation");
  }
  const base = normalizeBase(options.base || "https://site.ginko-cms.com");
  const pageSize = Math.max(1, Math.min(options.pageSize || 100, 100));
  const localePrefixStrategy = options.localePrefixStrategy || "prefix_except_default";
  const localeState = await resolveNormalizedLocales({
    key,
    base,
    locales: options.locales,
    defaultLocale: options.defaultLocale
  });
  const grouped = /* @__PURE__ */ new Map();
  for (const source of options.sources) {
    if (source.kind === "static") {
      for (const locale of localeState.locales) {
        const path = asString(source.pathsByLocale[locale.code]);
        if (!path) {
          continue;
        }
        addGroupedRoute({
          grouped,
          routeKey: `static:${source.key}`,
          localeCode: locale.code,
          path: localizeRoutePath({
            path,
            localeCode: locale.code,
            defaultLocale: localeState.defaultLocale,
            localePrefixStrategy
          }),
          updatedAt: source.updatedAt
        });
      }
      continue;
    }
    if (source.kind === "flatCollection") {
      for (const locale of localeState.locales) {
        await collectFlatCollectionRoutes({
          base,
          key,
          locale,
          defaultLocale: localeState.defaultLocale,
          localePrefixStrategy,
          source,
          grouped,
          pageSize
        });
      }
      continue;
    }
    for (const locale of localeState.locales) {
      await collectHierarchyRoutes({
        base,
        key,
        locale,
        defaultLocale: localeState.defaultLocale,
        localePrefixStrategy,
        source,
        grouped
      });
    }
  }
  return [...grouped.values()].map((group) => {
    const lastmodByLocale = Object.fromEntries(
      Object.entries(group.updatedAtByLocale).map(([localeCode, updatedAt]) => [localeCode, toIsoDate(updatedAt)]).filter(([, value]) => Boolean(value))
    );
    return {
      key: group.key,
      paths: group.paths,
      ...Object.keys(lastmodByLocale).length > 0 ? { lastmodByLocale } : {}
    };
  });
}
function toNuxtSitemapEntries(args) {
  const normalized = normalizeLocales({
    locales: args.locales,
    defaultLocale: args.defaultLocale
  });
  const entries = [];
  for (const route of args.routes) {
    const available = normalized.locales.filter((locale) => Boolean(route.paths[locale.code]));
    if (!available.length) {
      continue;
    }
    const firstAvailable = available[0];
    if (!firstAvailable) {
      continue;
    }
    const alternatives = available.map((locale) => ({
      hreflang: locale.hreflang,
      href: route.paths[locale.code]
    }));
    const xDefaultLocale = available.find((locale) => locale.code === normalized.defaultLocale) || firstAvailable;
    alternatives.push({
      hreflang: "x-default",
      href: route.paths[xDefaultLocale.code]
    });
    for (const locale of available) {
      entries.push({
        loc: route.paths[locale.code],
        alternatives,
        _sitemap: locale.hreflang,
        lastmod: route.lastmodByLocale?.[locale.code]
      });
    }
  }
  entries.sort((a, b) => a.loc.localeCompare(b.loc));
  return entries;
}
async function getGinkoLocalizedSitemapEntries(options) {
  const routes = await getGinkoSitemapRouteMap(options);
  return toNuxtSitemapEntries({
    routes,
    locales: options.locales,
    defaultLocale: options.defaultLocale
  });
}
async function getGinkoSitemapPresetEntries(options) {
  const routeMapOptions = await normalizePresetToRouteMapOptions(options);
  const entries = await getGinkoLocalizedSitemapEntries(routeMapOptions);
  return dedupeSitemapEntries(entries);
}
async function getGinkoSitemapPresetUrls(options) {
  const entries = await getGinkoSitemapPresetEntries(options);
  return dedupeAndSortUrls(entries.map((entry) => entry.loc));
}
function toPresetOptionsFromSiteConfig(options) {
  const site = options.site;
  const locales = (site.locales || []).map((locale) => ({
    code: locale.code,
    hreflang: locale.hreflang,
    isDefault: locale.code === (site.defaultLocale || "")
  }));
  const defaultLocale = site.defaultLocale || locales.find((locale) => locale.isDefault)?.code || locales[0]?.code;
  if (!defaultLocale) {
    throw new Error("[ginko-cms] Missing default locale in ginkoCms.site for sitemap generation");
  }
  const flatCollections = [];
  const hierarchyCollections = [];
  for (const collection of Object.values(site.collections || {})) {
    if (collection.kind === "flat") {
      flatCollections.push({
        collection: collection.source,
        keyField: collection.keyField,
        slugField: collection.slugField,
        pageSize: collection.pageSize,
        prefix: collection.routing.prefix,
        prefixByLocale: collection.routing.prefixByLocale,
        pathMapByLocale: collection.routing.pathMapByLocale
      });
      continue;
    }
    const baseSegment = asString(collection.routing.baseSegment) || asString(Object.values(collection.routing.baseSegmentByLocale || {})[0]);
    if (!baseSegment) {
      throw new Error(`[ginko-cms] Missing hierarchy base segment for collection: ${collection.source}`);
    }
    hierarchyCollections.push({
      collection: collection.source,
      baseSegment,
      baseSegmentByLocale: collection.routing.baseSegmentByLocale,
      maxDepth: collection.maxDepth,
      includeFolders: collection.includeFolders,
      contentSlugField: collection.contentSlugField,
      contentTitleField: collection.contentTitleField,
      contentOrderField: collection.contentOrderField,
      contentIdField: collection.contentIdField
    });
  }
  const localePrefixStrategy = site.routing?.localePrefixStrategy || "prefix_except_default";
  return {
    key: options.key,
    base: options.base,
    defaultLocale,
    locales,
    localePrefixStrategy,
    staticUrls: [...site.staticRoutes || []],
    flatCollections,
    hierarchyCollections
  };
}
async function getGinkoSitemapFromSiteConfig(options) {
  const preset = toPresetOptionsFromSiteConfig(options);
  const routeMapOptions = await normalizePresetToRouteMapOptions(preset);
  return await getGinkoSitemapRouteMap(routeMapOptions);
}
async function getGinkoSitemapEntriesFromSiteConfig(options) {
  const entries = await getGinkoSitemapPresetEntries(toPresetOptionsFromSiteConfig(options));
  return dedupeSitemapEntries(entries);
}
async function getGinkoSitemapUrlsFromSiteConfig(options) {
  const entries = await getGinkoSitemapEntriesFromSiteConfig(options);
  return dedupeAndSortUrls(entries.map((entry) => entry.loc));
}

export { getGinkoLocalizedSitemapEntries, getGinkoSitemapEntriesFromSiteConfig, getGinkoSitemapFromSiteConfig, getGinkoSitemapPresetEntries, getGinkoSitemapPresetUrls, getGinkoSitemapRouteMap, getGinkoSitemapUrlsFromSiteConfig, toNuxtSitemapEntries };
