import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildItemCachePath,
  buildItemProxyUrl,
  isNotFoundError,
  resolveCmsDataSource,
} from '../src/runtime/composables/internal/data-source'

const useAsyncDataMock = vi.fn(async (_key: string, handler: () => Promise<unknown>) => handler())
const useRuntimeConfigMock = vi.fn()
const useCmsLocaleMock = vi.fn(() => ({ locale: { value: 'en' } }))

vi.mock('#imports', () => ({
  useAsyncData: useAsyncDataMock,
  useRuntimeConfig: useRuntimeConfigMock,
}))

vi.mock('../src/runtime/composables/useCmsLocale', () => ({
  useCmsLocale: useCmsLocaleMock,
}))

describe('useCmsItem branching', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useRuntimeConfigMock.mockReturnValue({
      public: {
        cmsNuxt: {
          preview: true,
          cacheDir: '.cms-cache',
        },
      },
    })
    vi.stubGlobal('$fetch', vi.fn())
  })

  it('uses API proxy when preview mode is enabled', async () => {
    const fetchMock = vi.mocked($fetch).mockResolvedValue({
      data: { id: '1', slug: 'hello', _fallback: {} },
    })
    const { useCmsItem } = await import('../src/runtime/composables/useCmsItem')

    const result = await useCmsItem('blogs', 'hello', { populate: ['author'] }) as {
      id: string
      slug: string
      _fallback: Record<string, boolean>
    }

    expect(result).toEqual({ id: '1', slug: 'hello', _fallback: {} })
    expect(fetchMock).toHaveBeenCalledWith('/api/_cms/blogs/hello?locale=en&populate=author')
  })

  it('returns null when API returns 404', async () => {
    vi.mocked($fetch).mockRejectedValue({ status: 404 })
    const { useCmsItem } = await import('../src/runtime/composables/useCmsItem')

    const result = await useCmsItem('blogs', 'missing-post')

    expect(result).toBeNull()
  })

  it('uses static cache path when preview mode is disabled on client branch', async () => {
    useRuntimeConfigMock.mockReturnValue({
      public: {
        cmsNuxt: {
          preview: false,
          cacheDir: '.cms-cache',
        },
      },
    })
    const fetchMock = vi.mocked($fetch).mockResolvedValue({ id: '1', slug: 'hello', _fallback: {} })
    const { useCmsItem } = await import('../src/runtime/composables/useCmsItem')

    const result = await useCmsItem('blogs', 'hello') as { id: string, slug: string, _fallback: Record<string, boolean> }

    expect(result).toEqual({ id: '1', slug: 'hello', _fallback: {} })
    expect(fetchMock).toHaveBeenCalledWith('/.cms-cache/en/blogs/hello.json')
  })
})

describe('item source helper contracts', () => {
  it('covers all preview/server permutations', () => {
    expect(resolveCmsDataSource(true, true)).toBe('api')
    expect(resolveCmsDataSource(true, false)).toBe('api')
    expect(resolveCmsDataSource(false, true)).toBe('cache-server')
    expect(resolveCmsDataSource(false, false)).toBe('cache-client')
  })

  it('builds expected API and cache paths', () => {
    expect(buildItemProxyUrl('blogs', 'hello', 'en', { populate: ['author'] }))
      .toBe('/api/_cms/blogs/hello?locale=en&populate=author')
    expect(buildItemCachePath('.cms-cache', 'en', 'blogs', 'hello'))
      .toBe('/.cms-cache/en/blogs/hello.json')
  })

  it('recognizes 404 variants for null mapping', () => {
    expect(isNotFoundError({ status: 404 })).toBe(true)
    expect(isNotFoundError({ statusCode: 404 })).toBe(true)
    expect(isNotFoundError({ status: 500 })).toBe(false)
  })
})
