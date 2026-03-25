/**
 * Config types for `nuxt-ginko-cms`.
 *
 * Config key: `ginko` (replaces `ginkoCms`).
 * Object form is primary syntax. Shorthand is a bonus for simple setups.
 */

/** Per-locale overrides. */
export interface GinkoLocaleConfig {
  /** Mark as default locale. */
  default?: boolean
  /** BCP 47 hreflang tag override (e.g., `'de-AT'`). Inferred from code if omitted. */
  hreflang?: string
}

/** Flat collection: items with slug-based URL prefixes. */
export interface GinkoFlatCollectionConfig {
  /** CMS collection slug. Defaults to the key name if omitted. */
  source?: string
  /** URL prefix for this flat collection (e.g., `'/blog'`). */
  prefix: string | Record<string, string>
  /** Per-collection search source override. */
  search?: { collections?: string[] }
}

/** Hierarchy collection: tree-structured items with base segment routing. */
export interface GinkoHierarchyCollectionConfig {
  /** CMS collection slug. Defaults to the key name if omitted. */
  source?: string
  /** Base URL segment for hierarchy routing (e.g., `'/docs'`). */
  base: string | Record<string, string>
  /** Root document slug to alias onto the base path. */
  root?: string | Record<string, string>
  /** Per-collection search source override. */
  search?: { collections?: string[] }
}

/** Union: either flat (has `prefix`) or hierarchy (has `base`). */
export type GinkoCollectionConfig = GinkoFlatCollectionConfig | GinkoHierarchyCollectionConfig

/** Shorthand: `'/docs'` is sugar for `{ source: key, base: '/docs' }` or `{ source: key, prefix: '/docs' }`. */
export type GinkoCollectionEntry = string | GinkoCollectionConfig

/** Search configuration. */
export interface GinkoSearchConfig {
  /** Default search result limit. @default 12 */
  limit?: number
  /** Whether search is enabled. @default true */
  enabled?: boolean
}

/** Sitemap configuration. */
export interface GinkoSitemapConfig {
  /** Static routes to include. */
  staticRoutes?: string[]
  /** Whether sitemap is enabled. @default true */
  enabled?: boolean
}

/** Preview configuration. */
export interface GinkoPreviewConfig {
  /** URL query parameter name for preview tokens. @default 'ginko_preview' */
  paramName?: string
}

/**
 * Top-level module config. Set under `ginko` key in `nuxt.config.ts`.
 *
 * @example
 * ```ts
 * export default defineNuxtConfig({
 *   ginko: {
 *     collections: {
 *       blog: { source: 'blog-posts', prefix: '/blog' },
 *       docs: { base: '/docs', root: 'quick-start' },
 *     },
 *   },
 * })
 * ```
 */
export interface GinkoModuleOptions {
  /** Collection definitions. Object form is the primary syntax. */
  collections: Record<string, GinkoCollectionEntry>

  /** Locales. Array of codes (first = default) or object with overrides. */
  locales?: string[] | Record<string, true | GinkoLocaleConfig>

  /** Locale prefix strategy. @default 'except_default' */
  localePrefix?: 'all' | 'except_default' | 'none'

  /** Search configuration. */
  search?: GinkoSearchConfig

  /** Sitemap configuration. Pass `true` for defaults. */
  sitemap?: boolean | GinkoSitemapConfig

  /** Preview configuration. */
  preview?: GinkoPreviewConfig

  /** CMS API base URL. @default from NUXT_GINKO_BASE or 'https://site.ginko-cms.com' */
  base?: string

  /** Server route base path. @default '/api/ginko' */
  routeBase?: string
}

// ─── Helpers for checking collection kind ───────────────────────────────────────

export function isHierarchyConfig(config: GinkoCollectionConfig): config is GinkoHierarchyCollectionConfig {
  return 'base' in config
}

export function isFlatConfig(config: GinkoCollectionConfig): config is GinkoFlatCollectionConfig {
  return 'prefix' in config
}
