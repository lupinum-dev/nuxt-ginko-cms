import type { CmsModuleOptions } from '../runtime/types'
import process from 'node:process'

/**
 * Determine if preview mode should be enabled.
 */
export function resolvePreviewMode(options: CmsModuleOptions, isDev: boolean): boolean {
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
 * Determine access level and resolve the appropriate API key.
 */
export function resolveAccessLevel(
  options: CmsModuleOptions,
  isDev: boolean,
): { accessLevel: 'public' | 'preview', apiKey: string } {
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

  // Fallback: if selected key is empty but the other exists, downgrade/upgrade access level.
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
