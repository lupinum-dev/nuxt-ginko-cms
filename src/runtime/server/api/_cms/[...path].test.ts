import { beforeEach, describe, expect, it, vi } from 'vitest'

const useRuntimeConfigMock = vi.fn()
const getRequestURLMock = vi.fn()

vi.mock('#imports', () => ({
  useRuntimeConfig: useRuntimeConfigMock,
}))

vi.mock('h3', () => ({
  defineEventHandler: (handler: (event: unknown) => unknown) => handler,
  getRequestURL: getRequestURLMock,
  createError: ({ statusCode, message }: { statusCode: number, message: string }) => {
    const error = new Error(message) as Error & { statusCode: number }
    error.statusCode = statusCode
    return error
  },
}))

describe('CMS proxy handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('$fetch', vi.fn())
    getRequestURLMock.mockReturnValue({
      pathname: '/api/_cms/blogs',
      search: '?locale=en',
    })
    useRuntimeConfigMock.mockReturnValue({
      public: {
        cmsGinko: {
          apiUrl: 'https://example.convex.site',
          teamSlug: 'my-team',
        },
      },
      cmsGinkoApiKey: 'secret-preview-key',
    })
  })

  it('throws 500 when api key is missing', async () => {
    useRuntimeConfigMock.mockReturnValue({
      public: { cmsGinko: { apiUrl: 'https://example.convex.site', teamSlug: 'my-team' } },
      cmsGinkoApiKey: '',
    })
    const handler = (await import('./[...path]')).default

    await expect(handler({})).rejects.toMatchObject({
      statusCode: 500,
      message: 'CMS API key not configured',
    })
  })

  it('forwards request to target URL with bearer header', async () => {
    getRequestURLMock.mockReturnValue({
      pathname: '/api/_cms/blogs/hello',
      search: '?locale=en&limit=1',
    })
    vi.mocked($fetch).mockResolvedValue({ data: [], meta: { total: 0, locale: 'en' } })
    const handler = (await import('./[...path]')).default

    await handler({})

    expect($fetch).toHaveBeenCalledWith(
      'https://example.convex.site/api/v1/cms/my-team/blogs/hello?locale=en&limit=1',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer secret-preview-key',
        },
      },
    )
  })

  it('maps upstream 404 to Not found', async () => {
    vi.mocked($fetch).mockRejectedValue({ status: 404, message: 'upstream 404' })
    const handler = (await import('./[...path]')).default

    await expect(handler({})).rejects.toMatchObject({
      statusCode: 404,
      message: 'Not found',
    })
  })

  it('maps upstream 500 to generic CMS API error and does not leak api key', async () => {
    vi.mocked($fetch).mockRejectedValue({ status: 500, message: 'upstream exploded: secret-preview-key' })
    const handler = (await import('./[...path]')).default

    await expect(handler({})).rejects.toMatchObject({
      statusCode: 500,
      message: 'CMS API error',
    })

    try {
      await handler({})
    }
    catch (error) {
      expect(String(error)).not.toContain('secret-preview-key')
    }
  })
})
