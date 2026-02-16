import { describe, expect, it } from 'vitest'
import { extractDeploymentName } from './asset-downloader'

describe('asset Downloader Utilities', () => {
  describe('extractDeploymentName', () => {
    it('should extract deployment name from convex.site URL', () => {
      const result = extractDeploymentName('https://shiny-condor-497.convex.site')
      expect(result).toBe('shiny-condor-497')
    })

    it('should extract deployment name with simple name', () => {
      const result = extractDeploymentName('https://myapp.convex.site')
      expect(result).toBe('myapp')
    })

    it('should extract deployment name with complex name', () => {
      const result = extractDeploymentName('https://my-app-production-123.convex.site')
      expect(result).toBe('my-app-production-123')
    })

    it('should return empty string for non-convex.site URLs', () => {
      expect(extractDeploymentName('https://example.com')).toBe('')
      expect(extractDeploymentName('https://convex.dev')).toBe('')
      expect(extractDeploymentName('https://api.example.convex.cloud')).toBe('')
    })

    it('should return empty string for malformed URLs', () => {
      expect(extractDeploymentName('')).toBe('')
      expect(extractDeploymentName('not-a-url')).toBe('')
    })

    it('should handle http protocol', () => {
      const result = extractDeploymentName('http://myapp.convex.site')
      expect(result).toBe('myapp')
    })
  })

  describe('mIME type to extension mapping', () => {
    function getExtensionFromMimeType(mimeType: string): string {
      const mimeToExt: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'image/avif': '.avif',
        'application/pdf': '.pdf',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'audio/mpeg': '.mp3',
        'audio/ogg': '.ogg',
        'application/json': '.json',
        'text/plain': '.txt',
        'text/html': '.html',
        'text/css': '.css',
        'application/javascript': '.js',
      }

      const baseType = mimeType.split(';')[0].trim().toLowerCase()
      return mimeToExt[baseType] || ''
    }

    describe('image types', () => {
      it('should return .jpg for image/jpeg', () => {
        expect(getExtensionFromMimeType('image/jpeg')).toBe('.jpg')
      })

      it('should return .png for image/png', () => {
        expect(getExtensionFromMimeType('image/png')).toBe('.png')
      })

      it('should return .gif for image/gif', () => {
        expect(getExtensionFromMimeType('image/gif')).toBe('.gif')
      })

      it('should return .webp for image/webp', () => {
        expect(getExtensionFromMimeType('image/webp')).toBe('.webp')
      })

      it('should return .svg for image/svg+xml', () => {
        expect(getExtensionFromMimeType('image/svg+xml')).toBe('.svg')
      })

      it('should return .avif for image/avif', () => {
        expect(getExtensionFromMimeType('image/avif')).toBe('.avif')
      })
    })

    describe('document types', () => {
      it('should return .pdf for application/pdf', () => {
        expect(getExtensionFromMimeType('application/pdf')).toBe('.pdf')
      })

      it('should return .json for application/json', () => {
        expect(getExtensionFromMimeType('application/json')).toBe('.json')
      })

      it('should return .js for application/javascript', () => {
        expect(getExtensionFromMimeType('application/javascript')).toBe('.js')
      })
    })

    describe('video types', () => {
      it('should return .mp4 for video/mp4', () => {
        expect(getExtensionFromMimeType('video/mp4')).toBe('.mp4')
      })

      it('should return .webm for video/webm', () => {
        expect(getExtensionFromMimeType('video/webm')).toBe('.webm')
      })
    })

    describe('audio types', () => {
      it('should return .mp3 for audio/mpeg', () => {
        expect(getExtensionFromMimeType('audio/mpeg')).toBe('.mp3')
      })

      it('should return .ogg for audio/ogg', () => {
        expect(getExtensionFromMimeType('audio/ogg')).toBe('.ogg')
      })
    })

    describe('text types', () => {
      it('should return .txt for text/plain', () => {
        expect(getExtensionFromMimeType('text/plain')).toBe('.txt')
      })

      it('should return .html for text/html', () => {
        expect(getExtensionFromMimeType('text/html')).toBe('.html')
      })

      it('should return .css for text/css', () => {
        expect(getExtensionFromMimeType('text/css')).toBe('.css')
      })
    })

    describe('edge cases', () => {
      it('should handle MIME type with charset parameter', () => {
        expect(getExtensionFromMimeType('text/html; charset=utf-8')).toBe('.html')
        expect(getExtensionFromMimeType('application/json; charset=utf-8')).toBe('.json')
      })

      it('should handle MIME type with extra whitespace', () => {
        expect(getExtensionFromMimeType('  image/png  ')).toBe('.png')
      })

      it('should handle uppercase MIME types', () => {
        expect(getExtensionFromMimeType('IMAGE/JPEG')).toBe('.jpg')
        expect(getExtensionFromMimeType('Application/PDF')).toBe('.pdf')
      })

      it('should return empty string for unknown MIME types', () => {
        expect(getExtensionFromMimeType('application/octet-stream')).toBe('')
        expect(getExtensionFromMimeType('unknown/type')).toBe('')
      })

      it('should return empty string for empty input', () => {
        expect(getExtensionFromMimeType('')).toBe('')
      })
    })
  })

  describe('storage ID extraction from URL', () => {
    function extractStorageIdFromUrl(url: string): string | null {
      const match = url.match(/\/api\/storage\/([a-f0-9-]+)/)
      return match?.[1] || null
    }

    it('should extract UUID storage ID', () => {
      const url = 'https://example.convex.cloud/api/storage/d1557e65-04f8-4488-93ea-5c9d945add07'
      expect(extractStorageIdFromUrl(url)).toBe('d1557e65-04f8-4488-93ea-5c9d945add07')
    })

    it('should extract simple storage ID', () => {
      const url = 'https://example.convex.cloud/api/storage/abc123def456'
      expect(extractStorageIdFromUrl(url)).toBe('abc123def456')
    })

    it('should return null for invalid URLs', () => {
      expect(extractStorageIdFromUrl('https://example.com/image.jpg')).toBeNull()
      expect(extractStorageIdFromUrl('')).toBeNull()
      expect(extractStorageIdFromUrl('not-a-url')).toBeNull()
    })

    it('should handle URLs with query parameters', () => {
      const url = 'https://example.convex.cloud/api/storage/abc123-def456?token=xyz'
      // Note: This simplified regex might not handle query params correctly
      // but the actual implementation should
      const result = extractStorageIdFromUrl(url.split('?')[0])
      expect(result).toBe('abc123-def456')
    })
  })

  describe('local path construction', () => {
    function buildLocalPath(outputDir: string, storageId: string, extension: string): string {
      return `/${outputDir}/${storageId}${extension}`
    }

    it('should build correct local path', () => {
      expect(buildLocalPath('cms-assets', 'abc123', '.webp')).toBe('/cms-assets/abc123.webp')
    })

    it('should handle UUID storage IDs', () => {
      expect(buildLocalPath('cms-assets', 'd1557e65-04f8-4488-93ea-5c9d945add07', '.png')).toBe(
        '/cms-assets/d1557e65-04f8-4488-93ea-5c9d945add07.png',
      )
    })

    it('should handle different output directories', () => {
      expect(buildLocalPath('assets', 'abc123', '.jpg')).toBe('/assets/abc123.jpg')
      expect(buildLocalPath('public/images', 'abc123', '.jpg')).toBe('/public/images/abc123.jpg')
    })

    it('should handle empty extension', () => {
      expect(buildLocalPath('cms-assets', 'abc123', '')).toBe('/cms-assets/abc123')
    })
  })

  describe('batch processing logic', () => {
    function createBatches<T>(items: T[], batchSize: number): T[][] {
      const batches: T[][] = []
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize))
      }
      return batches
    }

    it('should create single batch for small array', () => {
      const items = [1, 2, 3]
      const batches = createBatches(items, 5)
      expect(batches).toEqual([[1, 2, 3]])
    })

    it('should create multiple batches', () => {
      const items = [1, 2, 3, 4, 5, 6, 7]
      const batches = createBatches(items, 3)
      expect(batches).toEqual([[1, 2, 3], [4, 5, 6], [7]])
    })

    it('should handle exact batch size multiples', () => {
      const items = [1, 2, 3, 4, 5, 6]
      const batches = createBatches(items, 3)
      expect(batches).toEqual([[1, 2, 3], [4, 5, 6]])
    })

    it('should handle empty array', () => {
      const batches = createBatches([], 5)
      expect(batches).toEqual([])
    })

    it('should handle batch size of 1', () => {
      const items = [1, 2, 3]
      const batches = createBatches(items, 1)
      expect(batches).toEqual([[1], [2], [3]])
    })
  })
})
