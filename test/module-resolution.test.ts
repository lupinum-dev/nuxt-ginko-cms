import type { CmsModuleOptions } from '../src/runtime/types'
import { afterEach, describe, expect, it } from 'vitest'
import { resolveAccessLevel, resolvePreviewMode } from '../src/internal/module-resolution'

function createOptions(overrides: Partial<CmsModuleOptions> = {}): CmsModuleOptions {
  return {
    apiUrl: 'https://example.convex.site',
    teamSlug: 'team',
    locales: ['en'],
    defaultLocale: 'en',
    collections: [],
    ...overrides,
  }
}

afterEach(() => {
  delete process.env.NUXT_CMS_PREVIEW
  delete process.env.NUXT_CMS_ACCESS_LEVEL
  delete process.env.NUXT_CMS_API_KEY
  delete process.env.NUXT_CMS_API_KEY_PUBLIC
  delete process.env.NUXT_CMS_API_KEY_PREVIEW
})

describe('resolvePreviewMode', () => {
  it('prioritizes explicit preview option over environment and dev mode', () => {
    process.env.NUXT_CMS_PREVIEW = 'false'
    const options = createOptions({ preview: true })

    expect(resolvePreviewMode(options, false)).toBe(true)
  })

  it('uses environment variable when explicit preview option is not set', () => {
    process.env.NUXT_CMS_PREVIEW = 'true'

    expect(resolvePreviewMode(createOptions(), false)).toBe(true)
  })

  it('falls back to dev mode when option and environment are unset', () => {
    expect(resolvePreviewMode(createOptions(), true)).toBe(true)
    expect(resolvePreviewMode(createOptions(), false)).toBe(false)
  })
})

describe('resolveAccessLevel', () => {
  it('uses explicit accessLevel first and resolves matching api key', () => {
    const options = createOptions({
      accessLevel: 'public',
      apiKeyPublic: 'public-key',
      apiKeyPreview: 'preview-key',
    })

    expect(resolveAccessLevel(options, true)).toEqual({
      accessLevel: 'public',
      apiKey: 'public-key',
    })
  })

  it('uses environment access level when option is not set', () => {
    process.env.NUXT_CMS_ACCESS_LEVEL = 'preview'
    process.env.NUXT_CMS_API_KEY_PREVIEW = 'preview-env-key'

    expect(resolveAccessLevel(createOptions(), false)).toEqual({
      accessLevel: 'preview',
      apiKey: 'preview-env-key',
    })
  })

  it('falls back to legacy key when selected key is missing', () => {
    process.env.NUXT_CMS_API_KEY = 'legacy-key'
    const options = createOptions({
      accessLevel: 'public',
    })

    expect(resolveAccessLevel(options, false)).toEqual({
      accessLevel: 'public',
      apiKey: 'legacy-key',
    })
  })

  it('downgrades preview access to public when preview key is missing', () => {
    const options = createOptions({
      accessLevel: 'preview',
      apiKeyPublic: 'public-key',
    })

    expect(resolveAccessLevel(options, false)).toEqual({
      accessLevel: 'public',
      apiKey: 'public-key',
    })
  })

  it('upgrades public access to preview when public key is missing', () => {
    const options = createOptions({
      accessLevel: 'public',
      apiKeyPreview: 'preview-key',
    })

    expect(resolveAccessLevel(options, false)).toEqual({
      accessLevel: 'preview',
      apiKey: 'preview-key',
    })
  })

  it('returns deterministic empty key when no keys exist', () => {
    const result = resolveAccessLevel(createOptions({ accessLevel: 'public' }), false)

    expect(result.accessLevel).toBe('public')
    expect(result.apiKey).toBe('')
  })
})
