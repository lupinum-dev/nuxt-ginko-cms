import type { AssetInfo } from './mdc-transform'
import { describe, expect, it } from 'vitest'
import {
  transformDirectAssetField,
  transformItemAssets,
  transformMdcAssetUrls,
} from './mdc-transform'

describe('transformMdcAssetUrls', () => {
  const createAssetMap = (entries: Array<[string, Partial<AssetInfo>]>): Map<string, AssetInfo> => {
    return new Map(
      entries.map(([id, info]) => [
        id,
        {
          assetId: id,
          storageUrl: `https://example.convex.cloud/api/storage/${id}`,
          localPath: `/cms-assets/${id}.webp`,
          filename: `${id}.webp`,
          mimeType: 'image/webp',
          ...info,
        },
      ]),
    )
  }

  describe('mDC image component transformation', () => {
    it('should transform src URL in :image shorthand syntax', () => {
      const content = ':image{#abc123def456ghi789jkl012mno alt="test" src="https://old-url.com/image.jpg"}'
      const assetMap = createAssetMap([
        ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/abc123.webp' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toBe(':image{#abc123def456ghi789jkl012mno alt="test" src="/cms-assets/abc123.webp"}')
    })

    it('should transform src URL with double quotes', () => {
      const content = ':image{#abc123def456ghi789jkl012mno src="https://storage.convex.cloud/uuid"}'
      const assetMap = createAssetMap([
        ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/abc123.webp' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toContain('src="/cms-assets/abc123.webp"')
    })

    it('should transform src URL with single quotes', () => {
      const content = ':image{#abc123def456ghi789jkl012mno src=\'https://storage.convex.cloud/uuid\'}'
      const assetMap = createAssetMap([
        ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/abc123.webp' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toContain('src=\'/cms-assets/abc123.webp\'')
    })

    it('should preserve other attributes', () => {
      const content = ':image{#abc123def456ghi789jkl012mno alt="My Image" width="800" src="https://old.com/img.jpg" class="rounded"}'
      const assetMap = createAssetMap([
        ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/abc123.webp' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toContain('alt="My Image"')
      expect(result).toContain('width="800"')
      expect(result).toContain('class="rounded"')
      expect(result).toContain('src="/cms-assets/abc123.webp"')
    })

    it('should transform multiple images in content', () => {
      const content = `
# Blog Post

:image{#img1aaaaaaaaaaaaaaaaaaaaaa src="https://a.com/1.jpg" alt="First"}

Some text here.

:image{#img2bbbbbbbbbbbbbbbbbbbbbb src="https://b.com/2.jpg" alt="Second"}
      `
      const assetMap = createAssetMap([
        ['img1aaaaaaaaaaaaaaaaaaaaaa', { localPath: '/cms-assets/img1.webp' }],
        ['img2bbbbbbbbbbbbbbbbbbbbbb', { localPath: '/cms-assets/img2.webp' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toContain('src="/cms-assets/img1.webp"')
      expect(result).toContain('src="/cms-assets/img2.webp"')
    })
  })

  describe('mDC file component transformation', () => {
    it('should transform src URL in :file component', () => {
      const content = ':file{#doc123def456ghi789jkl012mno src="https://storage.com/file.pdf" name="document.pdf"}'
      const assetMap = createAssetMap([
        ['doc123def456ghi789jkl012mno', { localPath: '/cms-assets/doc123.pdf', mimeType: 'application/pdf' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toContain('src="/cms-assets/doc123.pdf"')
    })
  })

  describe('edge cases', () => {
    it('should not transform content without matching asset IDs', () => {
      const content = ':image{#nonexistent123456789012345 src="https://old.com/img.jpg"}'
      const assetMap = createAssetMap([
        ['differentid1234567890123456', { localPath: '/cms-assets/different.webp' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toBe(content)
    })

    it('should handle empty content', () => {
      const content = ''
      const assetMap = createAssetMap([])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toBe('')
    })

    it('should handle content without any MDC components', () => {
      const content = '# Just a heading\n\nSome regular text.'
      const assetMap = createAssetMap([
        ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/abc123.webp' }],
      ])

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toBe(content)
    })

    it('should handle empty asset map', () => {
      const content = ':image{#abc123def456ghi789jkl012mno src="https://old.com/img.jpg"}'
      const assetMap = new Map<string, AssetInfo>()

      const result = transformMdcAssetUrls(content, assetMap)

      expect(result).toBe(content)
    })
  })
})

describe('transformDirectAssetField', () => {
  const createAssetMap = (entries: Array<[string, Partial<AssetInfo>]>): Map<string, AssetInfo> => {
    return new Map(
      entries.map(([id, info]) => [
        id,
        {
          assetId: id,
          storageUrl: `https://example.convex.cloud/api/storage/${id}`,
          localPath: `/cms-assets/${id}.webp`,
          filename: `${id}.webp`,
          mimeType: 'image/webp',
          ...info,
        },
      ]),
    )
  }

  it('should transform asset ID to local path', () => {
    const assetMap = createAssetMap([
      ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/abc123.webp' }],
    ])

    const result = transformDirectAssetField('abc123def456ghi789jkl012mno', assetMap)

    expect(result).toBe('/cms-assets/abc123.webp')
  })

  it('should return original value if not in asset map', () => {
    const assetMap = createAssetMap([
      ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/abc123.webp' }],
    ])

    const result = transformDirectAssetField('notfound123456789012345678', assetMap)

    expect(result).toBe('notfound123456789012345678')
  })

  it('should handle null value', () => {
    const assetMap = createAssetMap([])

    const result = transformDirectAssetField(null, assetMap)

    expect(result).toBeNull()
  })

  it('should handle undefined value', () => {
    const assetMap = createAssetMap([])

    const result = transformDirectAssetField(undefined, assetMap)

    expect(result).toBeUndefined()
  })

  it('should handle empty string', () => {
    const assetMap = createAssetMap([])

    const result = transformDirectAssetField('', assetMap)

    expect(result).toBe('')
  })
})

describe('transformItemAssets', () => {
  const createAssetMap = (entries: Array<[string, Partial<AssetInfo>]>): Map<string, AssetInfo> => {
    return new Map(
      entries.map(([id, info]) => [
        id,
        {
          assetId: id,
          storageUrl: `https://example.convex.cloud/api/storage/${id}`,
          localPath: `/cms-assets/${id}.webp`,
          filename: `${id}.webp`,
          mimeType: 'image/webp',
          ...info,
        },
      ]),
    )
  }

  it('should transform image fields in item data', () => {
    const data = {
      title: 'Test Post',
      featuredImage: 'abc123def456ghi789jkl012mno',
      slug: 'test-post',
    }
    const fields = [
      { key: 'title', type: 'text' },
      { key: 'featuredImage', type: 'image' },
      { key: 'slug', type: 'slug' },
    ]
    const assetMap = createAssetMap([
      ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/featured.webp' }],
    ])

    const result = transformItemAssets(data, fields, assetMap)

    expect(result.title).toBe('Test Post')
    expect(result.featuredImage).toBe('/cms-assets/featured.webp')
    expect(result.slug).toBe('test-post')
  })

  it('should transform richtext fields in item data', () => {
    const data = {
      title: 'Test Post',
      content: ':image{#abc123def456ghi789jkl012mno src="https://old.com/img.jpg"}',
    }
    const fields = [
      { key: 'title', type: 'text' },
      { key: 'content', type: 'richtext' },
    ]
    const assetMap = createAssetMap([
      ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/content-img.webp' }],
    ])

    const result = transformItemAssets(data, fields, assetMap)

    expect(result.title).toBe('Test Post')
    expect(result.content).toContain('src="/cms-assets/content-img.webp"')
  })

  it('should transform both image and richtext fields', () => {
    const data = {
      title: 'Test Post',
      featuredImage: 'feat123456789012345678901234',
      content: ':image{#embd123456789012345678901234 src="https://old.com/img.jpg"}',
    }
    const fields = [
      { key: 'title', type: 'text' },
      { key: 'featuredImage', type: 'image' },
      { key: 'content', type: 'richtext' },
    ]
    const assetMap = createAssetMap([
      ['feat123456789012345678901234', { localPath: '/cms-assets/featured.webp' }],
      ['embd123456789012345678901234', { localPath: '/cms-assets/embedded.webp' }],
    ])

    const result = transformItemAssets(data, fields, assetMap)

    expect(result.featuredImage).toBe('/cms-assets/featured.webp')
    expect(result.content).toContain('src="/cms-assets/embedded.webp"')
  })

  it('should not modify original data object', () => {
    const data = {
      title: 'Test Post',
      featuredImage: 'abc123def456ghi789jkl012mno',
    }
    const fields = [
      { key: 'title', type: 'text' },
      { key: 'featuredImage', type: 'image' },
    ]
    const assetMap = createAssetMap([
      ['abc123def456ghi789jkl012mno', { localPath: '/cms-assets/featured.webp' }],
    ])

    transformItemAssets(data, fields, assetMap)

    expect(data.featuredImage).toBe('abc123def456ghi789jkl012mno')
  })

  it('should handle missing fields gracefully', () => {
    const data = {
      title: 'Test Post',
    }
    const fields = [
      { key: 'title', type: 'text' },
      { key: 'featuredImage', type: 'image' },
      { key: 'content', type: 'richtext' },
    ]
    const assetMap = createAssetMap([])

    const result = transformItemAssets(data, fields, assetMap)

    expect(result.title).toBe('Test Post')
    expect(result.featuredImage).toBeUndefined()
    expect(result.content).toBeUndefined()
  })
})
