import { describe, expect, it } from 'vitest'
import { extractAssetsFromContent } from './extract-assets'

describe('extractAssetsFromContent', () => {
  describe('image fields (direct assets)', () => {
    it('should extract asset ID from image field', () => {
      const data = {
        featuredImage: 'abc123def456ghi789jkl012mno',
        title: 'Test Post',
      }
      const fields = [
        { key: 'featuredImage', type: 'image' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        fieldName: 'featuredImage',
        assetIds: ['abc123def456ghi789jkl012mno'],
        usageType: 'direct',
      })
    })

    it('should ignore empty image fields', () => {
      const data = {
        featuredImage: '',
        title: 'Test Post',
      }
      const fields = [
        { key: 'featuredImage', type: 'image' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should ignore null/undefined image fields', () => {
      const data = {
        featuredImage: null,
        avatar: undefined,
        title: 'Test Post',
      }
      const fields = [
        { key: 'featuredImage', type: 'image' },
        { key: 'avatar', type: 'image' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should ignore URLs in image fields (legacy content)', () => {
      const data = {
        featuredImage: 'https://example.com/image.jpg',
        title: 'Test Post',
      }
      const fields = [
        { key: 'featuredImage', type: 'image' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should ignore invalid asset ID formats', () => {
      const data = {
        featuredImage: 'too-short',
        avatar: 'UPPERCASE123456789012345',
        banner: 'contains-special-chars!@#$',
      }
      const fields = [
        { key: 'featuredImage', type: 'image' },
        { key: 'avatar', type: 'image' },
        { key: 'banner', type: 'image' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should extract multiple image fields', () => {
      const data = {
        featuredImage: 'abc123def456ghi789jkl012mno',
        thumbnail: 'xyz789abc456def123ghi012jkl',
        title: 'Test Post',
      }
      const fields = [
        { key: 'featuredImage', type: 'image' },
        { key: 'thumbnail', type: 'image' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(2)
      expect(result.map(r => r.fieldName)).toContain('featuredImage')
      expect(result.map(r => r.fieldName)).toContain('thumbnail')
    })
  })

  describe('richtext fields (embedded assets)', () => {
    it('should extract asset IDs from MDC shorthand syntax', () => {
      const data = {
        content: 'Hello world\n\n:image{#abc123def456ghi789jkl012mno alt="test"}\n\nMore text',
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        fieldName: 'content',
        assetIds: ['abc123def456ghi789jkl012mno'],
        usageType: 'embedded',
      })
    })

    it('should extract asset IDs from MDC long form syntax (double quotes)', () => {
      const data = {
        content: ':image{id="abc123def456ghi789jkl012mno" alt="test"}',
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(1)
      expect(result[0].assetIds).toContain('abc123def456ghi789jkl012mno')
    })

    it('should extract asset IDs from MDC long form syntax (single quotes)', () => {
      const data = {
        content: ':image{id=\'abc123def456ghi789jkl012mno\' alt=\'test\'}',
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(1)
      expect(result[0].assetIds).toContain('abc123def456ghi789jkl012mno')
    })

    it('should extract file component asset IDs', () => {
      const data = {
        content: ':file{#abc123def456ghi789jkl012mno name="document.pdf"}',
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(1)
      expect(result[0].assetIds).toContain('abc123def456ghi789jkl012mno')
    })

    it('should extract multiple assets from richtext', () => {
      const data = {
        content: `
# My Blog Post

:image{#abc123def456ghi789jkl012mno alt="First image"}

Some text here.

:image{#xyz789abc456def123ghi012jkl alt="Second image"}

:file{#doc111222333444555666777888 name="report.pdf"}
        `,
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(1)
      expect(result[0].assetIds).toHaveLength(3)
      expect(result[0].assetIds).toContain('abc123def456ghi789jkl012mno')
      expect(result[0].assetIds).toContain('xyz789abc456def123ghi012jkl')
      expect(result[0].assetIds).toContain('doc111222333444555666777888')
    })

    it('should deduplicate repeated asset IDs', () => {
      const data = {
        content: `
:image{#abc123def456ghi789jkl012mno alt="First"}
:image{#abc123def456ghi789jkl012mno alt="Same image again"}
        `,
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(1)
      expect(result[0].assetIds).toHaveLength(1)
    })

    it('should not extract IDs from non-asset components', () => {
      const data = {
        content: `
## Heading {#section-id}

:alert{#not-an-asset type="warning"}

:button{#also-not-an-asset}
        `,
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should handle empty richtext content', () => {
      const data = {
        content: '',
        title: 'Test Post',
      }
      const fields = [
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })
  })

  describe('field type handling', () => {
    it('should skip text fields', () => {
      const data = {
        title: 'abc123def456ghi789jkl012mno', // Looks like asset ID but is text
      }
      const fields = [{ key: 'title', type: 'text' }]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should skip relation fields', () => {
      const data = {
        author: 'abc123def456ghi789jkl012mno', // Item ID, not asset ID
      }
      const fields = [{ key: 'author', type: 'relation' }]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should skip unknown fields not in schema', () => {
      const data = {
        unknownField: 'abc123def456ghi789jkl012mno',
        title: 'Test',
      }
      const fields = [{ key: 'title', type: 'text' }]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })

    it('should skip number, boolean, date fields', () => {
      const data = {
        count: 123,
        isPublished: true,
        publishedAt: '2024-01-01',
      }
      const fields = [
        { key: 'count', type: 'number' },
        { key: 'isPublished', type: 'boolean' },
        { key: 'publishedAt', type: 'date' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(0)
    })
  })

  describe('combined scenarios', () => {
    it('should extract both direct and embedded assets', () => {
      const data = {
        featuredImage: 'abc123def456ghi789jkl012mno',
        content: ':image{#xyz789abc456def123ghi012jkl alt="Embedded"}',
        title: 'Test Post',
      }
      const fields = [
        { key: 'featuredImage', type: 'image' },
        { key: 'content', type: 'richtext' },
        { key: 'title', type: 'text' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(2)

      const directAsset = result.find(r => r.usageType === 'direct')
      const embeddedAsset = result.find(r => r.usageType === 'embedded')

      expect(directAsset?.fieldName).toBe('featuredImage')
      expect(directAsset?.assetIds).toContain('abc123def456ghi789jkl012mno')

      expect(embeddedAsset?.fieldName).toBe('content')
      expect(embeddedAsset?.assetIds).toContain('xyz789abc456def123ghi012jkl')
    })

    it('should handle realistic blog post data', () => {
      const data = {
        slug: 'my-blog-post',
        title: 'My Blog Post',
        excerpt: 'A short description',
        featuredImage: 'kh7c334y6gxw76ngrpexnncjxh800c3f',
        content: `
# Introduction

Welcome to my blog post!

:image{#abc123def456ghi789jkl012mno alt="Diagram" src="https://example.com/img.png"}

## Section 1

Some text here.

:file{#doc111222333444555666777888 name="slides.pdf"}

## Conclusion

Thanks for reading!
        `,
        author: 'k176h8f8emf2cc1jynk2m4e7018017ws',
        publishedAt: 1704067200000,
      }
      const fields = [
        { key: 'slug', type: 'slug' },
        { key: 'title', type: 'text' },
        { key: 'excerpt', type: 'text' },
        { key: 'featuredImage', type: 'image' },
        { key: 'content', type: 'richtext' },
        { key: 'author', type: 'relation' },
        { key: 'publishedAt', type: 'datetime' },
      ]

      const result = extractAssetsFromContent(data, { fields })

      expect(result).toHaveLength(2)

      const featuredImageResult = result.find(r => r.fieldName === 'featuredImage')
      expect(featuredImageResult?.assetIds).toEqual(['kh7c334y6gxw76ngrpexnncjxh800c3f'])
      expect(featuredImageResult?.usageType).toBe('direct')

      const contentResult = result.find(r => r.fieldName === 'content')
      expect(contentResult?.assetIds).toContain('abc123def456ghi789jkl012mno')
      expect(contentResult?.assetIds).toContain('doc111222333444555666777888')
      expect(contentResult?.usageType).toBe('embedded')
    })
  })
})
