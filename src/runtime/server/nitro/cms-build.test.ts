import { describe, expect, it } from 'vitest'

// We need to test the internal functions, so let's extract them for testing
// These tests verify the URL extraction and transformation logic

describe('storage URL extraction', () => {
  // Regex pattern for Convex storage URLs (supports UUID, base62, and other ID formats)
  const storageUrlPattern = /https:\/\/[^/]+\.convex\.cloud\/api\/storage\/[\w-]+/g

  function extractStorageUrls(content: string): string[] {
    const matches = content.matchAll(storageUrlPattern)
    return [...new Set([...matches].map(m => m[0]))]
  }

  describe('direct field URLs', () => {
    it('should extract storage URL from direct field value', () => {
      const value = 'https://shiny-condor-497.convex.cloud/api/storage/d1557e65-04f8-4488-93ea-5c9d945add07'

      const result = extractStorageUrls(value)

      expect(result).toHaveLength(1)
      expect(result[0]).toBe(value)
    })

    it('should extract multiple storage URLs', () => {
      const content = `
        Image 1: https://example.convex.cloud/api/storage/abc123-def456-ghi789
        Image 2: https://example.convex.cloud/api/storage/xyz789-uvw456-rst123
      `

      const result = extractStorageUrls(content)

      expect(result).toHaveLength(2)
    })

    it('should deduplicate repeated URLs', () => {
      const content = `
        https://example.convex.cloud/api/storage/abc123-def456-ghi789
        https://example.convex.cloud/api/storage/abc123-def456-ghi789
      `

      const result = extractStorageUrls(content)

      expect(result).toHaveLength(1)
    })

    it('should handle different deployment names', () => {
      const urls = [
        'https://shiny-condor-497.convex.cloud/api/storage/abc-123',
        'https://my-app-production.convex.cloud/api/storage/def-456',
        'https://test.convex.cloud/api/storage/ghi-789',
      ]

      for (const url of urls) {
        const result = extractStorageUrls(url)
        expect(result).toHaveLength(1)
        expect(result[0]).toBe(url)
      }
    })
  })

  describe('mDC content URLs', () => {
    it('should extract URL from MDC image component', () => {
      const content = ':image{#abc123 alt="test" src="https://example.convex.cloud/api/storage/d1557e65-04f8-4488-93ea-5c9d945add07"}'

      const result = extractStorageUrls(content)

      expect(result).toHaveLength(1)
      expect(result[0]).toBe('https://example.convex.cloud/api/storage/d1557e65-04f8-4488-93ea-5c9d945add07')
    })

    it('should extract URLs from multiple MDC components', () => {
      const content = `
# My Blog Post

:image{#img1 src="https://example.convex.cloud/api/storage/img-1111-2222-3333"}

Some text.

:image{#img2 src="https://example.convex.cloud/api/storage/img-4444-5555-6666"}

:file{#doc1 src="https://example.convex.cloud/api/storage/doc-7777-8888-9999"}
      `

      const result = extractStorageUrls(content)

      expect(result).toHaveLength(3)
    })
  })

  describe('edge cases', () => {
    it('should not match non-convex URLs', () => {
      const content = `
        https://example.com/api/storage/abc123
        https://cdn.example.com/images/photo.jpg
        https://convex.dev/docs
      `

      const result = extractStorageUrls(content)

      expect(result).toHaveLength(0)
    })

    it('should not match incomplete storage URLs', () => {
      const content = `
        https://example.convex.cloud/api/
        https://example.convex.cloud/
      `

      const result = extractStorageUrls(content)

      expect(result).toHaveLength(0)
    })

    it('should handle empty content', () => {
      const result = extractStorageUrls('')

      expect(result).toHaveLength(0)
    })

    it('should handle content without any URLs', () => {
      const content = '# Just a heading\n\nSome text without any URLs.'

      const result = extractStorageUrls(content)

      expect(result).toHaveLength(0)
    })
  })
})

describe('storage URL transformation', () => {
  function transformStorageUrls(
    content: string,
    urlToLocalPath: Map<string, string>,
  ): string {
    let result = content
    for (const [storageUrl, localPath] of urlToLocalPath) {
      result = result.split(storageUrl).join(localPath)
    }
    return result
  }

  it('should replace storage URL with local path', () => {
    const content = 'https://example.convex.cloud/api/storage/abc-123'
    const urlMap = new Map([
      ['https://example.convex.cloud/api/storage/abc-123', '/cms-assets/abc-123.webp'],
    ])

    const result = transformStorageUrls(content, urlMap)

    expect(result).toBe('/cms-assets/abc-123.webp')
  })

  it('should replace multiple storage URLs', () => {
    const content = `
Image 1: https://example.convex.cloud/api/storage/img-111
Image 2: https://example.convex.cloud/api/storage/img-222
    `
    const urlMap = new Map([
      ['https://example.convex.cloud/api/storage/img-111', '/cms-assets/img-111.webp'],
      ['https://example.convex.cloud/api/storage/img-222', '/cms-assets/img-222.png'],
    ])

    const result = transformStorageUrls(content, urlMap)

    expect(result).toContain('/cms-assets/img-111.webp')
    expect(result).toContain('/cms-assets/img-222.png')
    expect(result).not.toContain('convex.cloud')
  })

  it('should replace repeated occurrences of same URL', () => {
    const content = `
:image{src="https://example.convex.cloud/api/storage/abc-123"}
:image{src="https://example.convex.cloud/api/storage/abc-123"}
    `
    const urlMap = new Map([
      ['https://example.convex.cloud/api/storage/abc-123', '/cms-assets/abc-123.webp'],
    ])

    const result = transformStorageUrls(content, urlMap)

    const matches = result.match(/\/cms-assets\/abc-123\.webp/g)
    expect(matches).toHaveLength(2)
  })

  it('should not modify content without matching URLs', () => {
    const content = 'Just some text without any storage URLs'
    const urlMap = new Map([
      ['https://example.convex.cloud/api/storage/abc-123', '/cms-assets/abc-123.webp'],
    ])

    const result = transformStorageUrls(content, urlMap)

    expect(result).toBe(content)
  })

  it('should handle empty URL map', () => {
    const content = 'https://example.convex.cloud/api/storage/abc-123'
    const urlMap = new Map<string, string>()

    const result = transformStorageUrls(content, urlMap)

    expect(result).toBe(content)
  })

  it('should handle MDC component transformation', () => {
    const content = ':image{#abc123 alt="test" src="https://example.convex.cloud/api/storage/d1557e65-04f8-4488-93ea-5c9d945add07"}'
    const urlMap = new Map([
      ['https://example.convex.cloud/api/storage/d1557e65-04f8-4488-93ea-5c9d945add07', '/cms-assets/d1557e65.webp'],
    ])

    const result = transformStorageUrls(content, urlMap)

    expect(result).toBe(':image{#abc123 alt="test" src="/cms-assets/d1557e65.webp"}')
  })
})

describe('item content extraction and transformation', () => {
  interface CmsItem {
    id: string
    slug: string
    [key: string]: unknown
  }

  const storageUrlPattern = /https:\/\/[^/]+\.convex\.cloud\/api\/storage\/[\w-]+/g

  function extractStorageUrlsFromItem(item: CmsItem): string[] {
    const urls: string[] = []

    for (const [key, value] of Object.entries(item)) {
      if (key.startsWith('_') || ['id', 'slug', 'status', 'createdAt', 'updatedAt', 'publishedAt'].includes(key)) {
        continue
      }

      if (typeof value === 'string') {
        if (value.includes('.convex.cloud/api/storage/')) {
          const matches = value.matchAll(storageUrlPattern)
          for (const match of matches) {
            urls.push(match[0])
          }
        }
      }
    }

    return [...new Set(urls)]
  }

  function transformItemStorageUrls(
    item: CmsItem,
    urlToLocalPath: Map<string, string>,
  ): CmsItem {
    const transformed = { ...item }

    for (const [key, value] of Object.entries(transformed)) {
      if (key.startsWith('_') || ['id', 'slug', 'status', 'createdAt', 'updatedAt', 'publishedAt'].includes(key)) {
        continue
      }

      if (typeof value === 'string') {
        let newValue = value
        for (const [storageUrl, localPath] of urlToLocalPath) {
          newValue = newValue.split(storageUrl).join(localPath)
        }
        transformed[key] = newValue
      }
    }

    return transformed
  }

  describe('extraction', () => {
    it('should extract URLs from item fields', () => {
      const item: CmsItem = {
        id: 'item123',
        slug: 'test-post',
        featuredimage: 'https://example.convex.cloud/api/storage/abc-123',
        title: 'Test Post',
        content: ':image{src="https://example.convex.cloud/api/storage/def-456"}',
      }

      const result = extractStorageUrlsFromItem(item)

      expect(result).toHaveLength(2)
      expect(result).toContain('https://example.convex.cloud/api/storage/abc-123')
      expect(result).toContain('https://example.convex.cloud/api/storage/def-456')
    })

    it('should skip metadata fields', () => {
      const item: CmsItem = {
        id: 'https://example.convex.cloud/api/storage/should-skip',
        slug: 'test',
        _locale: 'https://example.convex.cloud/api/storage/should-skip',
        _fallback: {},
        publishedAt: 1234567890,
        title: 'Test',
      }

      const result = extractStorageUrlsFromItem(item)

      expect(result).toHaveLength(0)
    })
  })

  describe('transformation', () => {
    it('should transform URLs in item fields', () => {
      const item: CmsItem = {
        id: 'item123',
        slug: 'test-post',
        featuredimage: 'https://example.convex.cloud/api/storage/abc-123',
        title: 'Test Post',
      }
      const urlMap = new Map([
        ['https://example.convex.cloud/api/storage/abc-123', '/cms-assets/abc-123.webp'],
      ])

      const result = transformItemStorageUrls(item, urlMap)

      expect(result.featuredimage).toBe('/cms-assets/abc-123.webp')
      expect(result.title).toBe('Test Post')
      expect(result.id).toBe('item123')
      expect(result.slug).toBe('test-post')
    })

    it('should not modify metadata fields', () => {
      const item: CmsItem = {
        id: 'item123',
        slug: 'test-post',
        _locale: 'en',
        publishedAt: 1234567890,
        featuredimage: 'https://example.convex.cloud/api/storage/abc-123',
      }
      const urlMap = new Map([
        ['https://example.convex.cloud/api/storage/abc-123', '/cms-assets/abc-123.webp'],
      ])

      const result = transformItemStorageUrls(item, urlMap)

      expect(result._locale).toBe('en')
      expect(result.publishedAt).toBe(1234567890)
      expect(result.id).toBe('item123')
    })

    it('should transform MDC content with embedded URLs', () => {
      const item: CmsItem = {
        id: 'item123',
        slug: 'test-post',
        content: `
# Blog Post

:image{#img1 src="https://example.convex.cloud/api/storage/img-111"}

Some text.

:image{#img2 src="https://example.convex.cloud/api/storage/img-222"}
        `,
      }
      const urlMap = new Map([
        ['https://example.convex.cloud/api/storage/img-111', '/cms-assets/img-111.webp'],
        ['https://example.convex.cloud/api/storage/img-222', '/cms-assets/img-222.webp'],
      ])

      const result = transformItemStorageUrls(item, urlMap)

      expect(result.content).toContain('/cms-assets/img-111.webp')
      expect(result.content).toContain('/cms-assets/img-222.webp')
      expect(result.content).not.toContain('convex.cloud')
    })
  })
})
