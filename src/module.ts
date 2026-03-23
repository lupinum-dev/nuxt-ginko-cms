import type { GinkoCmsSiteConfig } from './runtime/types/index'
import { addComponentsDir, addImportsDir, addServerHandler, addServerPlugin, createResolver, defineNuxtModule, installModule } from '@nuxt/kit'

export interface GinkoCmsNuxtModuleOptions {
  routeBase?: string
  site?: GinkoCmsSiteConfig
}

export type * from './runtime/types/api'

function asString(value: unknown) {
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeLocale(locale: Record<string, unknown>) {
  const code = asString(locale.code);
  const hreflang = asString(locale.hreflang);
  if (!code || !hreflang) {
    return void 0;
  }
  return {
    code,
    hreflang,
    isDefault: locale.isDefault === true
  };
}
function normalizeFlatCollection(key: string, collection: any) {
  const source = asString(collection.source);
  if (!source) {
    throw new Error(`[ginko-cms] Invalid source for flat collection "${key}"`);
  }
  const routing = collection.routing || {};
  const hasPathMap = routing.pathMapByLocale && Object.keys(routing.pathMapByLocale).length > 0;
  const hasPrefix = asString(routing.prefix);
  const hasPrefixByLocale = routing.prefixByLocale && Object.keys(routing.prefixByLocale).length > 0;
  if (!hasPathMap && !hasPrefix && !hasPrefixByLocale) {
    throw new Error(`[ginko-cms] Flat collection "${key}" must define routing.prefix, routing.prefixByLocale, or routing.pathMapByLocale`);
  }
  return {
    ...collection,
    kind: "flat",
    source,
    routing: {
      ...asString(routing.prefix) ? { prefix: asString(routing.prefix) } : {},
      ...routing.prefixByLocale ? { prefixByLocale: routing.prefixByLocale } : {},
      ...routing.pathMapByLocale ? { pathMapByLocale: routing.pathMapByLocale } : {}
    }
  };
}
function normalizeHierarchyCollection(key: string, collection: any) {
  const source = asString(collection.source);
  if (!source) {
    throw new Error(`[ginko-cms] Invalid source for hierarchy collection "${key}"`);
  }
  const routing = collection.routing || {};
  const baseSegment = asString(routing.baseSegment);
  const baseSegmentByLocale = routing.baseSegmentByLocale && Object.keys(routing.baseSegmentByLocale).length > 0 ? routing.baseSegmentByLocale : void 0;
  const rootSlug = asString(routing.rootSlug);
  const rootSlugByLocale = routing.rootSlugByLocale && Object.keys(routing.rootSlugByLocale).length > 0 ? routing.rootSlugByLocale : void 0;
  if (!baseSegment && !baseSegmentByLocale) {
    throw new Error(`[ginko-cms] Hierarchy collection "${key}" must define routing.baseSegment or routing.baseSegmentByLocale`);
  }
  return {
    ...collection,
    kind: "hierarchy",
    source,
    routing: {
      ...baseSegment ? { baseSegment } : {},
      ...baseSegmentByLocale ? { baseSegmentByLocale } : {},
      ...rootSlug ? { rootSlug } : {},
      ...rootSlugByLocale ? { rootSlugByLocale } : {}
    }
  };
}
function normalizeCollection(key: string, collection: any) {
  if (collection.kind === "hierarchy") {
    return normalizeHierarchyCollection(key, collection);
  }
  return normalizeFlatCollection(key, collection);
}
function normalizeSiteConfig(site?: GinkoCmsSiteConfig) {
  if (!site) {
    return void 0;
  }
  const locales = (site.locales || []).map(normalizeLocale).filter((locale) => Boolean(locale));
  if (!locales.length) {
    throw new Error("[ginko-cms] ginkoCms.site.locales must include at least one valid locale");
  }
  const localeCodes = /* @__PURE__ */ new Set();
  for (const locale of locales) {
    if (localeCodes.has(locale.code)) {
      throw new Error(`[ginko-cms] Duplicate locale code in ginkoCms.site.locales: ${locale.code}`);
    }
    localeCodes.add(locale.code);
  }
  const inferredDefaultLocale = asString(site.defaultLocale) || locales.find((locale) => locale.isDefault)?.code || locales[0]?.code;
  if (!inferredDefaultLocale) {
    throw new Error("[ginko-cms] Unable to resolve default locale for ginkoCms.site");
  }
  const collections = site.collections || {};
  const normalizedCollections = Object.fromEntries(
    Object.entries(collections).map(([key, collection]) => [
      key,
      normalizeCollection(key, collection)
    ])
  );
  return {
    defaultLocale: inferredDefaultLocale,
    locales: locales.map((locale) => ({
      ...locale,
      isDefault: locale.code === inferredDefaultLocale
    })),
    routing: {
      localePrefixStrategy: site.routing?.localePrefixStrategy || "prefix_except_default"
    },
    staticRoutes: (site.staticRoutes || []).filter((route) => typeof route === "string" && route.trim().length > 0),
    collections: normalizedCollections,
    search: {
      enabled: site.search?.enabled !== false,
      defaultLimit: Math.max(1, Math.min(site.search?.defaultLimit || 12, 100))
    },
    sitemap: (() => {
      const raw = site.sitemap;
      const enabled = typeof raw === "boolean" ? raw : raw?.enabled !== false;
      return {
        enabled,
        sourcePath: typeof raw === "object" && asString(raw?.sourcePath) || "/api/ginko/sitemap"
      };
    })()
  };
}
export type { GinkoCollections } from './runtime/types/index'

const module$1 = defineNuxtModule<GinkoCmsNuxtModuleOptions>({
  meta: {
    name: "@lupinum/ginko-nuxt",
    configKey: "ginkoCms",
    compatibility: {
      nuxt: ">=4.0.0"
    }
  },
  defaults: {
    routeBase: "/api/ginko"
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const routeBase = options.routeBase || "/api/ginko";
    const envKey = process.env.NUXT_GINKO_CMS_KEY || "";
    const envBase = process.env.NUXT_GINKO_CMS_BASE || "";
    const envLocale = process.env.NUXT_GINKO_CMS_LOCALE || "";
    const envTimeout = process.env.NUXT_GINKO_CMS_TIMEOUT_MS || "";
    const normalizedSite = normalizeSiteConfig(options.site);
    const existingPrivate = nuxt.options.runtimeConfig.ginkoCms || {};
    nuxt.options.runtimeConfig.ginkoCms = {
      key: String(envKey || existingPrivate.key || "").trim(),
      base: String(envBase || existingPrivate.base || "https://site.ginko-cms.com").trim(),
      locale: String(envLocale || existingPrivate.locale || normalizedSite?.defaultLocale || "").trim(),
      timeoutMs: Number(envTimeout || existingPrivate.timeoutMs || 8e3),
      contextTtlMs: Number(existingPrivate.contextTtlMs || 3e5)
    };
    const existingPublic = nuxt.options.runtimeConfig.public.ginkoCms || {};
    nuxt.options.runtimeConfig.public.ginkoCms = {
      routeBase,
      locale: String(envLocale || existingPublic.locale || normalizedSite?.defaultLocale || "").trim(),
      ...normalizedSite ? { site: normalizedSite } : {}
    };
    await installModule('@nuxtjs/mdc')
    addImportsDir(resolver.resolve("./runtime/app/composables"));
    addComponentsDir({
      path: resolver.resolve("./runtime/app/components"),
      pathPrefix: false
    });
    addServerHandler({
      route: `${routeBase}/query`,
      handler: resolver.resolve("./runtime/server/api/ginko/query")
    });
    addServerHandler({
      route: `${routeBase}/resolve`,
      handler: resolver.resolve("./runtime/server/api/ginko/resolve")
    });
    if (normalizedSite?.sitemap?.enabled !== false) {
      const sitemapSourcePath = normalizedSite?.sitemap?.sourcePath || "/api/ginko/sitemap";
      addServerHandler({
        route: sitemapSourcePath,
        handler: resolver.resolve("./runtime/server/api/ginko/sitemap")
      });
      const sitemapConfig = nuxt.options.sitemap || (nuxt.options.sitemap = {});
      const existingSources = Array.isArray(sitemapConfig.sources) ? sitemapConfig.sources : [];
      if (!existingSources.includes(sitemapSourcePath)) {
        sitemapConfig.sources = [...existingSources, sitemapSourcePath];
      }
    }
    addServerPlugin(resolver.resolve("./runtime/server/plugins/validate-ginko-cms"));
    nuxt.hook("prepare:types", ({ references }) => {
      references.push({ path: resolver.resolve("./runtime/types/nuxt.d.ts") });
    });
  }
});

export default module$1
