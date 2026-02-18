import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildCollectionCachePath,
  buildCollectionProxyUrl,
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

describe('useCmsCollection branching', () => {
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
      data: [{ id: '1', slug: 'hello' }],
      meta: { total: 1, locale: 'en' },
    })
    const { useCmsCollection } = await import('../src/runtime/composables/useCmsCollection')

    const result = await useCmsCollection('blogs', { populate: ['author'], limit: 10 }) as {
      items: Array<{ id: string, slug: string }>
      total: number
      locale: string
    }

    expect(result).toEqual({
      items: [{ id: '1', slug: 'hello' }],
      total: 1,
      locale: 'en',
    })
    expect(fetchMock).toHaveBeenCalledWith('/api/_cms/blogs?locale=en&limit=10&populate=author')
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
    const fetchMock = vi.mocked($fetch).mockResolvedValue({
      items: [{ id: '1', slug: 'hello' }],
      total: 1,
    })
    const { useCmsCollection } = await import('../src/runtime/composables/useCmsCollection')

    const result = await useCmsCollection('blogs') as {
      items: Array<{ id: string, slug: string }>
      total: number
      locale: string
    }

    expect(result).toEqual({
      items: [{ id: '1', slug: 'hello' }],
      total: 1,
      locale: 'en',
    })
    expect(fetchMock).toHaveBeenCalledWith('/.cms-cache/en/blogs/index.json')
  })
})

describe('collection source helper contracts', () => {
  it('covers all preview/server permutations', () => {
    expect(resolveCmsDataSource(true, true)).toBe('api')
    expect(resolveCmsDataSource(true, false)).toBe('api')
    expect(resolveCmsDataSource(false, true)).toBe('cache-server')
    expect(resolveCmsDataSource(false, false)).toBe('cache-client')
  })

  it('builds expected API and cache paths', () => {
    expect(buildCollectionProxyUrl('blogs', 'en', { limit: 5, offset: 2, populate: ['author'] }))
      .toBe('/api/_cms/blogs?locale=en&limit=5&offset=2&populate=author')
    expect(buildCollectionCachePath('.cms-cache', 'en', 'blogs'))
      .toBe('/.cms-cache/en/blogs/index.json')
  })
})
