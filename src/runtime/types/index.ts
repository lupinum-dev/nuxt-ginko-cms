/**
 * CMS Nuxt Module Types
 */

export interface CollectionConfig {
  /** Collection slug in the CMS */
  slug: string
  /** Fields to populate (relation fields) */
  populate?: string[]
  /** Route pattern for prerendering (e.g., '/blog/[slug]') */
  routePattern?: string
}

export interface CmsModuleOptions {
  /** Convex site URL (e.g., 'https://xxx.convex.site') */
  apiUrl: string
  /** Team slug in the CMS */
  teamSlug: string

  /**
   * API key for authentication (fallback for backward compatibility)
   * Prefer using apiKeyPublic and apiKeyPreview for better access control
   */
  apiKey?: string

  /** API key with 'public' access level - only sees published content */
  apiKeyPublic?: string

  /** API key with 'preview' access level - sees preview + published content */
  apiKeyPreview?: string

  /**
   * Which access level to use: 'public' or 'preview'
   * - 'public': Uses apiKeyPublic, only fetches published content (for production)
   * - 'preview': Uses apiKeyPreview, fetches preview + published content (for staging)
   *
   * Default: 'preview' in dev mode, 'public' in production
   */
  accessLevel?: 'public' | 'preview'

  /** Available locales */
  locales: string[]
  /** Default locale */
  defaultLocale: string

  /** Collection configurations */
  collections: CollectionConfig[]

  /** Enable preview mode (real-time API calls vs static generation) */
  preview?: boolean
  /** Directory for downloaded assets (relative to public/) */
  assetDir?: string
  /** Directory for cached content */
  cacheDir?: string

  /**
   * Locale prefix strategy for route generation during prerendering
   * - 'no_prefix': No locale in routes (e.g., /blog/slug)
   * - 'prefix_except_default': Default locale has no prefix (e.g., /blog/slug + /de/blog/slug)
   * - 'prefix_all': All locales have prefix (e.g., /en/blog/slug + /de/blog/slug)
   *
   * Default: 'no_prefix'
   */
  localePrefix?: 'no_prefix' | 'prefix_except_default' | 'prefix_all'

  /**
   * Download assets and rewrite URLs to local paths during production build.
   * When false (default), assets remain at their remote Convex storage URLs.
   * When true, assets are downloaded to the assetDir and URLs are rewritten.
   *
   * Note: Only applies to production builds. Dev/preview always uses remote URLs.
   *
   * Default: false
   */
  localizeAssets?: boolean
}

export interface CmsRuntimeConfig {
  apiUrl: string
  teamSlug: string
  locales: string[]
  defaultLocale: string
  collections: CollectionConfig[]
  preview: boolean
  accessLevel: 'public' | 'preview'
  assetDir: string
  cacheDir: string
  localePrefix: 'no_prefix' | 'prefix_except_default' | 'prefix_all'
  localizeAssets: boolean
}

// Module augmentation for Nuxt
declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    cmsNuxt: CmsRuntimeConfig
  }
  interface RuntimeConfig {
    cmsNuxtApiKey: string
  }
}
