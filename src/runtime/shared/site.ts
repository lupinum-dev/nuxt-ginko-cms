import { asString } from '../../type-guards'

interface SiteLocale {
  code: string
  hreflang: string
  isDefault?: boolean
}

interface SiteLocaleState {
  locales: SiteLocale[]
  defaultLocale: string
  localePrefixStrategy: string
}

export function normalizeSitePath(path: string): string {
  const withoutHash = path.split('#')[0] || ''
  const withoutQuery = withoutHash.split('?')[0] || ''
  const collapsed = withoutQuery.replace(/\/{2,}/g, '/')
  if (!collapsed || collapsed === '/') {
    return '/'
  }
  const withoutTrailingSlash = collapsed.endsWith('/') ? collapsed.slice(0, -1) : collapsed
  return withoutTrailingSlash.startsWith('/') ? withoutTrailingSlash : `/${withoutTrailingSlash}`
}
export function resolveSiteLocales(site: Record<string, unknown>): SiteLocaleState {
  const locales: SiteLocale[] = []
  for (const locale of (site.locales as SiteLocale[]) || []) {
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
  const defaultLocale = asString(site.defaultLocale as string) || locales.find(locale => locale.isDefault)?.code || locales[0]?.code
  if (!defaultLocale) {
    throw new Error('[ginko-cms] Unable to resolve default site locale')
  }
  const routing = site.routing as Record<string, unknown> | undefined
  const localePrefixStrategy = (routing?.localePrefixStrategy as string) || 'prefix_except_default'
  return {
    locales: locales.map(locale => ({
      ...locale,
      isDefault: locale.code === defaultLocale,
    })),
    defaultLocale,
    localePrefixStrategy,
  }
}
export function normalizeSiteLocale(value: unknown, fallback: string): string {
  const normalizedFallback = asString(fallback) || fallback
  const normalized = asString(value)
  return normalized || normalizedFallback
}
export function localizeSitePath(args: { path: string, locale: unknown, defaultLocale: string, localePrefixStrategy: string }): string {
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
export function stripLocalePrefix(args: { path: string, locale: string, defaultLocale: string, localePrefixStrategy: string }): string {
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
export function resolveFlatPathBySlug(args: { collection: Record<string, unknown>, slug: string, locale: string }): string | undefined {
  const slugKey = args.slug.trim()
  if (!slugKey) {
    return void 0
  }
  const routing = args.collection.routing as Record<string, unknown> | undefined
  const pathMapByLocale = routing?.pathMapByLocale as Record<string, Record<string, string>> | undefined
  const pathFromMap = pathMapByLocale?.[args.locale]?.[slugKey]
  if (pathFromMap && typeof pathFromMap === 'string') {
    return normalizeSitePath(pathFromMap)
  }
  const prefixByLocale = routing?.prefixByLocale as Record<string, string> | undefined
  const prefix = prefixByLocale?.[args.locale] || (routing?.prefix as string | undefined)
  if (!prefix || typeof prefix !== 'string') {
    return void 0
  }
  return normalizeSitePath(`${prefix.replace(/\/+$/g, '')}/${slugKey}`)
}
export function resolveFlatSlugByPath(args: { collection: Record<string, unknown>, locale: string, path: string }): string | undefined {
  const normalizedPath = normalizeSitePath(args.path)
  const routing = args.collection.routing as Record<string, unknown> | undefined
  const pathMapByLocale = routing?.pathMapByLocale as Record<string, Record<string, string>> | undefined
  const pathMap = pathMapByLocale?.[args.locale] || {}
  for (const [slug, mappedPath] of Object.entries(pathMap)) {
    if (normalizeSitePath(String(mappedPath)) === normalizedPath) {
      return slug
    }
  }
  const prefixByLocale = routing?.prefixByLocale as Record<string, string> | undefined
  const prefix = prefixByLocale?.[args.locale] || (routing?.prefix as string | undefined)
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
export function isHierarchyCollection(collection: Record<string, unknown>): boolean {
  return collection.kind === 'hierarchy'
}
export function isFlatCollection(collection: Record<string, unknown>): boolean {
  return collection.kind === 'flat'
}
export function detectLocaleFromPath(args: { path: string, locales: string[], defaultLocale: string, localePrefixStrategy: string }): { locale: string, canonicalPath: string } {
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
