function asString(value) {
  if (typeof value !== 'string') {
    return void 0
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : void 0
}
export function normalizeSitePath(path) {
  const withoutHash = path.split('#')[0] || ''
  const withoutQuery = withoutHash.split('?')[0] || ''
  const collapsed = withoutQuery.replace(/\/{2,}/g, '/')
  if (!collapsed || collapsed === '/') {
    return '/'
  }
  const withoutTrailingSlash = collapsed.endsWith('/') ? collapsed.slice(0, -1) : collapsed
  return withoutTrailingSlash.startsWith('/') ? withoutTrailingSlash : `/${withoutTrailingSlash}`
}
export function resolveSiteLocales(site) {
  const locales = []
  for (const locale of site.locales || []) {
    const code = asString(locale.code)
    const hreflang = asString(locale.hreflang)
    if (!code || !hreflang) {
      continue
    }
    locales.push({
      code,
      hreflang,
      isDefault: locale.isDefault === true,
    })
  }
  if (!locales.length) {
    throw new Error('[ginko-cms] Missing ginkoCms.site.locales')
  }
  const defaultLocale = asString(site.defaultLocale) || locales.find(locale => locale.isDefault)?.code || locales[0]?.code
  if (!defaultLocale) {
    throw new Error('[ginko-cms] Unable to resolve default site locale')
  }
  const localePrefixStrategy = site.routing?.localePrefixStrategy || 'prefix_except_default'
  return {
    locales: locales.map(locale => ({
      ...locale,
      isDefault: locale.code === defaultLocale,
    })),
    defaultLocale,
    localePrefixStrategy,
  }
}
export function normalizeSiteLocale(value, fallback) {
  const normalizedFallback = asString(fallback) || fallback
  const normalized = asString(value)
  return normalized || normalizedFallback
}
export function localizeSitePath(args) {
  const normalizedPath = normalizeSitePath(args.path)
  const localeCode = normalizeSiteLocale(args.locale, args.defaultLocale)
  if (args.localePrefixStrategy === 'none') {
    return normalizedPath
  }
  const localePrefix = `/${localeCode}`
  if (normalizedPath === localePrefix || normalizedPath.startsWith(`${localePrefix}/`)) {
    return normalizedPath
  }
  if (args.localePrefixStrategy === 'prefix_except_default' && localeCode === args.defaultLocale) {
    return normalizedPath
  }
  return normalizeSitePath(`${localePrefix}${normalizedPath}`)
}
export function stripLocalePrefix(args) {
  const normalizedPath = normalizeSitePath(args.path)
  if (args.localePrefixStrategy === 'none') {
    return normalizedPath
  }
  const localePrefix = `/${args.locale}`
  if (normalizedPath === localePrefix) {
    return '/'
  }
  if (normalizedPath.startsWith(`${localePrefix}/`)) {
    return normalizeSitePath(normalizedPath.slice(localePrefix.length))
  }
  if (args.localePrefixStrategy === 'prefix_except_default' && args.locale === args.defaultLocale) {
    return normalizedPath
  }
  return normalizedPath
}
export function resolveFlatPathBySlug(args) {
  const slugKey = args.slug.trim()
  if (!slugKey) {
    return void 0
  }
  const pathFromMap = args.collection.routing.pathMapByLocale?.[args.locale]?.[slugKey]
  if (pathFromMap && typeof pathFromMap === 'string') {
    return normalizeSitePath(pathFromMap)
  }
  const prefix = args.collection.routing.prefixByLocale?.[args.locale] || args.collection.routing.prefix
  if (!prefix || typeof prefix !== 'string') {
    return void 0
  }
  return normalizeSitePath(`${prefix.replace(/\/+$/g, '')}/${slugKey}`)
}
export function resolveFlatSlugByPath(args) {
  const normalizedPath = normalizeSitePath(args.path)
  const pathMap = args.collection.routing.pathMapByLocale?.[args.locale] || {}
  for (const [slug, mappedPath] of Object.entries(pathMap)) {
    if (normalizeSitePath(String(mappedPath)) === normalizedPath) {
      return slug
    }
  }
  const prefix = args.collection.routing.prefixByLocale?.[args.locale] || args.collection.routing.prefix
  if (!prefix || typeof prefix !== 'string') {
    return void 0
  }
  const normalizedPrefix = normalizeSitePath(prefix)
  if (normalizedPrefix === '/') {
    const candidate = normalizedPath.slice(1)
    return candidate.length > 0 ? candidate : void 0
  }
  if (!normalizedPath.startsWith(`${normalizedPrefix}/`)) {
    return void 0
  }
  const candidate = normalizedPath.slice(normalizedPrefix.length + 1)
  return candidate.length > 0 ? candidate : void 0
}
export function isHierarchyCollection(collection) {
  return collection.kind === 'hierarchy'
}
export function isFlatCollection(collection) {
  return collection.kind === 'flat'
}
export function detectLocaleFromPath(args) {
  const normalizedPath = normalizeSitePath(args.path)
  if (args.localePrefixStrategy === 'none') {
    return {
      locale: args.defaultLocale,
      canonicalPath: normalizedPath,
    }
  }
  for (const localeCode of args.locales) {
    const prefix = `/${localeCode}`
    if (normalizedPath === prefix) {
      return {
        locale: localeCode,
        canonicalPath: '/',
      }
    }
    if (normalizedPath.startsWith(`${prefix}/`)) {
      return {
        locale: localeCode,
        canonicalPath: normalizeSitePath(normalizedPath.slice(prefix.length)),
      }
    }
  }
  return {
    locale: args.defaultLocale,
    canonicalPath: normalizedPath,
  }
}
