import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestMock = vi.fn()
const createMock = vi.fn(() => requestMock)

vi.mock('ofetch', () => ({
  ofetch: {
    create: createMock,
  },
}))

describe('CmsClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('configures ofetch with baseURL and auth headers', async () => {
    const { CmsClient } = await import('./cms-client')

    new CmsClient({
      apiUrl: 'https://example.convex.site',
      apiKey: 'secret-key',
      teamSlug: 'my-team',
    })

    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'https://example.convex.site/api/v1/cms/my-team',
      headers: {
        'Authorization': 'Bearer secret-key',
        'Content-Type': 'application/json',
      },
    })
  })

  it('builds listItems URL with query params', async () => {
    requestMock.mockResolvedValue({ data: [], meta: { total: 0, locale: 'en' } })
    const { CmsClient } = await import('./cms-client')
    const client = new CmsClient({
      apiUrl: 'https://example.convex.site',
      apiKey: 'secret-key',
      teamSlug: 'my-team',
    })

    await client.listItems('blogs', {
      locale: 'en',
      limit: 10,
      offset: 20,
      populate: ['author', 'category'],
    })

    expect(requestMock).toHaveBeenCalledWith('/blogs?locale=en&limit=10&offset=20&populate=author%2Ccategory')
  })

  it('builds getItem URL with query params', async () => {
    requestMock.mockResolvedValue({ data: { id: '1' } })
    const { CmsClient } = await import('./cms-client')
    const client = new CmsClient({
      apiUrl: 'https://example.convex.site',
      apiKey: 'secret-key',
      teamSlug: 'my-team',
    })

    await client.getItem('blogs', 'hello-world', {
      locale: 'en',
      populate: ['author'],
    })

    expect(requestMock).toHaveBeenCalledWith('/blogs/hello-world?locale=en&populate=author')
  })

  it('fetches all pages in fetchAllItems', async () => {
    requestMock
      .mockResolvedValueOnce({
        data: [{ id: '1', slug: 'first' }],
        meta: { total: 201, locale: 'en' },
      })
      .mockResolvedValueOnce({
        data: [{ id: '2', slug: 'second' }],
        meta: { total: 201, locale: 'en' },
      })
      .mockResolvedValueOnce({
        data: [{ id: '3', slug: 'third' }],
        meta: { total: 201, locale: 'en' },
      })

    const { CmsClient } = await import('./cms-client')
    const client = new CmsClient({
      apiUrl: 'https://example.convex.site',
      apiKey: 'secret-key',
      teamSlug: 'my-team',
    })

    const items = await client.fetchAllItems('blogs', 'en', ['author'])

    expect(requestMock).toHaveBeenNthCalledWith(1, '/blogs?locale=en&limit=100&populate=author')
    expect(requestMock).toHaveBeenNthCalledWith(2, '/blogs?locale=en&limit=100&offset=100&populate=author')
    expect(requestMock).toHaveBeenNthCalledWith(3, '/blogs?locale=en&limit=100&offset=200&populate=author')
    expect(items).toHaveLength(3)
    expect(items.map(item => item.slug)).toEqual(['first', 'second', 'third'])
  })

  it('builds storage URL from team slug', async () => {
    const { CmsClient } = await import('./cms-client')
    const client = new CmsClient({
      apiUrl: 'https://example.convex.site',
      apiKey: 'secret-key',
      teamSlug: 'my-team',
    })

    expect(client.getStorageUrl('abc-123')).toBe('https://my-team.convex.cloud/api/storage/abc-123')
  })
})
