import { describe, expect, it } from 'vitest'

// Test the URL construction logic without mocking HTTP
describe('cMS Client URL Construction', () => {
  describe('listItems URL building', () => {
    function buildListUrl(
      collectionSlug: string,
      options: {
        locale?: string
        limit?: number
        offset?: number
        populate?: string[]
      } = {},
    ): string {
      const params = new URLSearchParams()

      if (options.locale)
        params.set('locale', options.locale)
      if (options.limit)
        params.set('limit', String(options.limit))
      if (options.offset)
        params.set('offset', String(options.offset))
      if (options.populate?.length)
        params.set('populate', options.populate.join(','))

      const queryString = params.toString()
      return `/${collectionSlug}${queryString ? `?${queryString}` : ''}`
    }

    it('should build URL without parameters', () => {
      const url = buildListUrl('blogs')
      expect(url).toBe('/blogs')
    })

    it('should build URL with locale', () => {
      const url = buildListUrl('blogs', { locale: 'de' })
      expect(url).toBe('/blogs?locale=de')
    })

    it('should build URL with limit and offset', () => {
      const url = buildListUrl('blogs', { limit: 10, offset: 20 })
      expect(url).toContain('limit=10')
      expect(url).toContain('offset=20')
    })

    it('should build URL with populate', () => {
      const url = buildListUrl('blogs', { populate: ['author', 'category'] })
      expect(url).toContain('populate=author%2Ccategory')
    })

    it('should build URL with all parameters', () => {
      const url = buildListUrl('blogs', {
        locale: 'en',
        limit: 10,
        offset: 5,
        populate: ['author'],
      })
      expect(url).toContain('/blogs?')
      expect(url).toContain('locale=en')
      expect(url).toContain('limit=10')
      expect(url).toContain('offset=5')
      expect(url).toContain('populate=author')
    })

    it('should handle empty populate array', () => {
      const url = buildListUrl('blogs', { locale: 'en', populate: [] })
      expect(url).toBe('/blogs?locale=en')
      expect(url).not.toContain('populate')
    })
  })

  describe('getItem URL building', () => {
    function buildGetUrl(
      collectionSlug: string,
      itemSlug: string,
      options: {
        locale?: string
        populate?: string[]
      } = {},
    ): string {
      const params = new URLSearchParams()

      if (options.locale)
        params.set('locale', options.locale)
      if (options.populate?.length)
        params.set('populate', options.populate.join(','))

      const queryString = params.toString()
      return `/${collectionSlug}/${itemSlug}${queryString ? `?${queryString}` : ''}`
    }

    it('should build URL without parameters', () => {
      const url = buildGetUrl('blogs', 'my-post')
      expect(url).toBe('/blogs/my-post')
    })

    it('should build URL with locale', () => {
      const url = buildGetUrl('blogs', 'my-post', { locale: 'de' })
      expect(url).toBe('/blogs/my-post?locale=de')
    })

    it('should build URL with populate', () => {
      const url = buildGetUrl('blogs', 'my-post', { populate: ['author'] })
      expect(url).toBe('/blogs/my-post?populate=author')
    })

    it('should build URL with all parameters', () => {
      const url = buildGetUrl('blogs', 'my-post', { locale: 'en', populate: ['author', 'tags'] })
      expect(url).toContain('/blogs/my-post?')
      expect(url).toContain('locale=en')
      expect(url).toContain('populate=author')
    })

    it('should handle slugs with special characters', () => {
      const url = buildGetUrl('blogs', 'my-awesome-post-2024')
      expect(url).toBe('/blogs/my-awesome-post-2024')
    })
  })

  describe('storage URL construction', () => {
    function getStorageUrl(teamSlug: string, storageId: string): string {
      return `https://${teamSlug}.convex.cloud/api/storage/${storageId}`
    }

    it('should construct correct storage URL', () => {
      const url = getStorageUrl('my-team', 'abc123-def456')
      expect(url).toBe('https://my-team.convex.cloud/api/storage/abc123-def456')
    })

    it('should handle UUID format storage IDs', () => {
      const url = getStorageUrl('prod-app', 'd1557e65-04f8-4488-93ea-5c9d945add07')
      expect(url).toBe('https://prod-app.convex.cloud/api/storage/d1557e65-04f8-4488-93ea-5c9d945add07')
    })

    it('should handle different team slugs', () => {
      expect(getStorageUrl('shiny-condor-497', 'abc123')).toBe(
        'https://shiny-condor-497.convex.cloud/api/storage/abc123',
      )
      expect(getStorageUrl('my-app-production', 'abc123')).toBe(
        'https://my-app-production.convex.cloud/api/storage/abc123',
      )
    })
  })

  describe('base URL construction', () => {
    function buildBaseUrl(apiUrl: string, teamSlug: string): string {
      return `${apiUrl}/api/v1/cms/${teamSlug}`
    }

    it('should construct correct base URL', () => {
      const baseUrl = buildBaseUrl('https://example.convex.site', 'my-team')
      expect(baseUrl).toBe('https://example.convex.site/api/v1/cms/my-team')
    })

    it('should handle different API URLs', () => {
      expect(buildBaseUrl('https://shiny-condor-497.convex.site', 'demo-team')).toBe(
        'https://shiny-condor-497.convex.site/api/v1/cms/demo-team',
      )
    })
  })
})

describe('pagination logic', () => {
  function calculatePagination(
    total: number,
    limit: number,
  ): { pages: number, offsets: number[] } {
    const pages = Math.ceil(total / limit)
    const offsets = Array.from({ length: pages }, (_, i) => i * limit)
    return { pages, offsets }
  }

  it('should calculate pagination for small dataset', () => {
    const { pages, offsets } = calculatePagination(50, 100)
    expect(pages).toBe(1)
    expect(offsets).toEqual([0])
  })

  it('should calculate pagination for exact multiple', () => {
    const { pages, offsets } = calculatePagination(200, 100)
    expect(pages).toBe(2)
    expect(offsets).toEqual([0, 100])
  })

  it('should calculate pagination with remainder', () => {
    const { pages, offsets } = calculatePagination(250, 100)
    expect(pages).toBe(3)
    expect(offsets).toEqual([0, 100, 200])
  })

  it('should calculate pagination for large dataset', () => {
    const { pages, offsets } = calculatePagination(1000, 100)
    expect(pages).toBe(10)
    expect(offsets).toHaveLength(10)
    expect(offsets[0]).toBe(0)
    expect(offsets[9]).toBe(900)
  })

  it('should handle empty dataset', () => {
    const { pages, offsets } = calculatePagination(0, 100)
    expect(pages).toBe(0)
    expect(offsets).toEqual([])
  })
})
