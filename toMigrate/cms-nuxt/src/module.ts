/**
 * @lupinum/cms-nuxt
 *
 * Nuxt module for consuming Convex CMS public API
 * Supports preview mode (real-time API) and production mode (static SSG)
 */

import type { CmsModuleOptions, CmsRuntimeConfig } from './runtime/types'
import process from 'node:process'
import {
  addImports,
  addServerScanDir,
  addTemplate,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit'
import { defu } from 'defu'

export type { CmsModuleOptions, CollectionConfig } from './runtime/types'
export type * from './runtime/types/api'

const logger = useLogger('cms-nuxt')

/**
 * Determine if preview mode should be enabled
 */
function resolvePreviewMode(options: CmsModuleOptions, isDev: boolean): boolean {
  // 1. Explicit option takes precedence
  if (typeof options.preview === 'boolean') {
    return options.preview
  }

  // 2. Environment variable
  if (process.env.NUXT_CMS_PREVIEW === 'true') {
    return true
  }

  // 3. Dev mode default
  return isDev
}

/**
 * Determine access level and resolve the appropriate API key
 */
function resolveAccessLevel(options: CmsModuleOptions, isDev: boolean): { accessLevel: 'public' | 'preview', apiKey: string } {
  // 1. Explicit accessLevel option
  let accessLevel: 'public' | 'preview' = options.accessLevel
    ?? (process.env.NUXT_CMS_ACCESS_LEVEL as 'public' | 'preview' | undefined)
    ?? (isDev ? 'preview' : 'public')

  // 2. Resolve API key based on access level
  const apiKeyPublic = options.apiKeyPublic ?? process.env.NUXT_CMS_API_KEY_PUBLIC ?? ''
  const apiKeyPreview = options.apiKeyPreview ?? process.env.NUXT_CMS_API_KEY_PREVIEW ?? ''
  const legacyApiKey = options.apiKey ?? process.env.NUXT_CMS_API_KEY ?? ''

  let apiKey: string
  if (accessLevel === 'public') {
    apiKey = apiKeyPublic || legacyApiKey
  }
  else {
    apiKey = apiKeyPreview || legacyApiKey
  }

  // Fallback: if the selected key is empty but the other exists, use that
  if (!apiKey) {
    if (accessLevel === 'public' && apiKeyPreview) {
      apiKey = apiKeyPreview
      accessLevel = 'preview'
    }
    else if (accessLevel === 'preview' && apiKeyPublic) {
      apiKey = apiKeyPublic
      accessLevel = 'public'
    }
  }

  return { accessLevel, apiKey }
}

export default defineNuxtModule<CmsModuleOptions>({
  meta: {
    name: '@lupinum/cms-nuxt',
    configKey: 'cmsNuxt',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    apiUrl: process.env.NUXT_CMS_API_URL || '',
    teamSlug: process.env.NUXT_CMS_TEAM_SLUG || '',
    apiKey: undefined, // Legacy - prefer apiKeyPublic/apiKeyPreview
    apiKeyPublic: undefined,
    apiKeyPreview: undefined,
    accessLevel: undefined,
    locales: ['en'],
    defaultLocale: 'en',
    collections: [],
    preview: undefined,
    assetDir: 'cms-assets',
    cacheDir: '.cms-cache',
    localePrefix: 'no_prefix',
    localizeAssets: false,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Validate required options
    if (!options.apiUrl) {
      logger.warn('CMS API URL is not configured. Set apiUrl or NUXT_CMS_API_URL environment variable.')
    }
    if (!options.teamSlug) {
      logger.warn('CMS team slug is not configured. Set teamSlug or NUXT_CMS_TEAM_SLUG environment variable.')
    }

    // Resolve preview mode (real-time API vs static generation)
    const isPreview = resolvePreviewMode(options, nuxt.options.dev)

    // Resolve access level and API key
    const { accessLevel, apiKey } = resolveAccessLevel(options, nuxt.options.dev)

    if (!apiKey) {
      logger.warn('CMS API key is not configured. Set NUXT_CMS_API_KEY_PUBLIC/NUXT_CMS_API_KEY_PREVIEW or apiKeyPublic/apiKeyPreview.')
    }

    logger.info(`CMS mode: ${isPreview ? 'preview (real-time API)' : 'production (static)'}, access level: ${accessLevel}`)

    // Build runtime config
    const runtimeConfig: CmsRuntimeConfig = {
      apiUrl: options.apiUrl,
      teamSlug: options.teamSlug,
      locales: options.locales,
      defaultLocale: options.defaultLocale,
      collections: options.collections,
      preview: isPreview,
      accessLevel,
      assetDir: options.assetDir || 'cms-assets',
      cacheDir: options.cacheDir || '.cms-cache',
      localePrefix: options.localePrefix || 'no_prefix',
      localizeAssets: options.localizeAssets ?? false,
    }

    // Merge into Nuxt runtime config
    // Public config (available on client) - apiKey is NOT included here
    const publicConfig = defu(
      nuxt.options.runtimeConfig.public.cmsNuxt as Partial<CmsRuntimeConfig> | undefined,
      {
        apiUrl: runtimeConfig.apiUrl,
        teamSlug: runtimeConfig.teamSlug,
        locales: runtimeConfig.locales,
        defaultLocale: runtimeConfig.defaultLocale,
        collections: runtimeConfig.collections,
        preview: runtimeConfig.preview,
        accessLevel: runtimeConfig.accessLevel,
        assetDir: runtimeConfig.assetDir,
        cacheDir: runtimeConfig.cacheDir,
        localePrefix: runtimeConfig.localePrefix,
        localizeAssets: runtimeConfig.localizeAssets,
      },
    )
    nuxt.options.runtimeConfig.public.cmsNuxt = publicConfig

    // Private config (server only) - include the resolved apiKey
    nuxt.options.runtimeConfig.cmsNuxtApiKey = apiKey

    // Auto-import composables
    addImports([
      {
        name: 'useCmsCollection',
        from: resolver.resolve('./runtime/composables/useCmsCollection'),
      },
      {
        name: 'useCmsItem',
        from: resolver.resolve('./runtime/composables/useCmsItem'),
      },
      {
        name: 'useCmsRelatedItem',
        from: resolver.resolve('./runtime/composables/useCmsRelatedItem'),
      },
      {
        name: 'useCmsLocale',
        from: resolver.resolve('./runtime/composables/useCmsLocale'),
      },
      {
        name: 'useCmsAssetUrl',
        from: resolver.resolve('./runtime/composables/useCmsAssetUrl'),
      },
      {
        name: 'useCmsSearchIndex',
        from: resolver.resolve('./runtime/composables/useCmsSearchIndex'),
      },
    ])

    // Register CMS API proxy route (keeps API key secure)
    // Use addServerScanDir to auto-discover server routes from the module
    const serverDir = resolver.resolve('./runtime/server')
    addServerScanDir(serverDir)
    logger.info(`Registered server routes from: ${serverDir}`)

    // Add type augmentation template
    addTemplate({
      filename: 'types/cms-nuxt.d.ts',
      getContents: () => `
interface CollectionConfig {
  slug: string
  populate?: string[]
  routePattern?: string
}

interface CmsRuntimeConfig {
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

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    cmsNuxt: CmsRuntimeConfig
  }
  interface RuntimeConfig {
    cmsNuxtApiKey: string
  }
}

declare module '#app' {
  interface NuxtApp {
    $cmsPreview: boolean
    $cmsAccessLevel: 'public' | 'preview'
  }
}

export {}
`,
    })

    // Add types to tsconfig references
    nuxt.hook('prepare:types', (opts) => {
      opts.references.push({
        path: resolver.resolve(nuxt.options.buildDir, 'types/cms-nuxt.d.ts'),
      })
    })

    // Register Nitro hooks for build-time processing
    if (!isPreview) {
      nuxt.hook('nitro:init', async (nitro) => {
        // Import and register build hooks
        const { registerCmsBuildHooks } = await import('./runtime/server/nitro/cms-build')
        registerCmsBuildHooks(nitro, runtimeConfig, apiKey)
      })
    }

    logger.success('CMS Nuxt module initialized')
  },
})
