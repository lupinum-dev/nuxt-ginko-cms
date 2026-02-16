import { describe, expect, it } from 'vitest'

describe('content Cache Path Construction', () => {
  function getCollectionIndexPath(
    rootDir: string,
    cacheDir: string,
    locale: string,
    collectionSlug: string,
  ): string {
    return `${rootDir}/public/${cacheDir}/${locale}/${collectionSlug}/index.json`
  }

  function getItemPath(
    rootDir: string,
    cacheDir: string,
    locale: string,
    collectionSlug: string,
    itemSlug: string,
  ): string {
    return `${rootDir}/public/${cacheDir}/${locale}/${collectionSlug}/${itemSlug}.json`
  }

  describe('collection index path', () => {
    it('should build correct path for collection index', () => {
      const path = getCollectionIndexPath('/app', '.cms-cache', 'en', 'blogs')
      expect(path).toBe('/app/public/.cms-cache/en/blogs/index.json')
    })

    it('should handle different locales', () => {
      expect(getCollectionIndexPath('/app', '.cms-cache', 'en', 'blogs')).toContain('/en/')
      expect(getCollectionIndexPath('/app', '.cms-cache', 'de', 'blogs')).toContain('/de/')
      expect(getCollectionIndexPath('/app', '.cms-cache', 'fr-CA', 'blogs')).toContain('/fr-CA/')
    })

    it('should handle different collection slugs', () => {
      expect(getCollectionIndexPath('/app', '.cms-cache', 'en', 'blogs')).toContain('/blogs/')
      expect(getCollectionIndexPath('/app', '.cms-cache', 'en', 'authors')).toContain('/authors/')
      expect(getCollectionIndexPath('/app', '.cms-cache', 'en', 'legal-pages')).toContain('/legal-pages/')
    })

    it('should handle different cache directories', () => {
      expect(getCollectionIndexPath('/app', 'cache', 'en', 'blogs')).toContain('/cache/')
      expect(getCollectionIndexPath('/app', '.content-cache', 'en', 'blogs')).toContain('/.content-cache/')
    })
  })

  describe('item path', () => {
    it('should build correct path for single item', () => {
      const path = getItemPath('/app', '.cms-cache', 'en', 'blogs', 'my-post')
      expect(path).toBe('/app/public/.cms-cache/en/blogs/my-post.json')
    })

    it('should handle different item slugs', () => {
      expect(getItemPath('/app', '.cms-cache', 'en', 'blogs', 'hello-world')).toContain('/hello-world.json')
      expect(getItemPath('/app', '.cms-cache', 'en', 'blogs', 'post-2024-01-01')).toContain('/post-2024-01-01.json')
    })

    it('should handle slugs with numbers', () => {
      const path = getItemPath('/app', '.cms-cache', 'en', 'blogs', 'top-10-tips')
      expect(path).toContain('/top-10-tips.json')
    })
  })
})

describe('cached Collection Index Structure', () => {
  interface CmsItem {
    id: string
    slug: string
    title?: string
    [key: string]: unknown
  }

  interface CachedCollectionIndex {
    items: CmsItem[]
    total: number
    locale: string
    fetchedAt: number
  }

  function createCollectionIndex(
    items: CmsItem[],
    locale: string,
  ): CachedCollectionIndex {
    return {
      items,
      total: items.length,
      locale,
      fetchedAt: Date.now(),
    }
  }

  it('should create index with correct structure', () => {
    const items: CmsItem[] = [
      { id: '1', slug: 'post-1', title: 'Post 1' },
      { id: '2', slug: 'post-2', title: 'Post 2' },
    ]

    const index = createCollectionIndex(items, 'en')

    expect(index).toHaveProperty('items')
    expect(index).toHaveProperty('total')
    expect(index).toHaveProperty('locale')
    expect(index).toHaveProperty('fetchedAt')
  })

  it('should calculate correct total', () => {
    const items: CmsItem[] = [
      { id: '1', slug: 'post-1' },
      { id: '2', slug: 'post-2' },
      { id: '3', slug: 'post-3' },
    ]

    const index = createCollectionIndex(items, 'en')

    expect(index.total).toBe(3)
    expect(index.items).toHaveLength(3)
  })

  it('should preserve locale', () => {
    const items: CmsItem[] = []

    expect(createCollectionIndex(items, 'en').locale).toBe('en')
    expect(createCollectionIndex(items, 'de').locale).toBe('de')
    expect(createCollectionIndex(items, 'fr-CA').locale).toBe('fr-CA')
  })

  it('should set fetchedAt timestamp', () => {
    const before = Date.now()
    const index = createCollectionIndex([], 'en')
    const after = Date.now()

    expect(index.fetchedAt).toBeGreaterThanOrEqual(before)
    expect(index.fetchedAt).toBeLessThanOrEqual(after)
  })

  it('should handle empty items array', () => {
    const index = createCollectionIndex([], 'en')

    expect(index.items).toEqual([])
    expect(index.total).toBe(0)
  })
})

describe('item slug extraction', () => {
  interface CmsItem {
    id: string
    slug?: string
    [key: string]: unknown
  }

  function extractSlug(item: CmsItem): string | null {
    const slug = item.slug
    if (!slug) {
      console.warn(`Item ${item.id} has no slug`)
      return null
    }
    return slug
  }

  it('should extract slug from item', () => {
    const item: CmsItem = { id: '1', slug: 'my-post', title: 'My Post' }
    expect(extractSlug(item)).toBe('my-post')
  })

  it('should return null for item without slug', () => {
    const item: CmsItem = { id: '1', title: 'My Post' }
    expect(extractSlug(item)).toBeNull()
  })

  it('should return null for empty slug', () => {
    const item: CmsItem = { id: '1', slug: '', title: 'My Post' }
    expect(extractSlug(item)).toBeNull()
  })
})

describe('list cached item slugs', () => {
  function filterItemFiles(files: string[]): string[] {
    return files
      .filter(f => f.endsWith('.json') && f !== 'index.json')
      .map(f => f.replace('.json', ''))
  }

  it('should filter out index.json', () => {
    const files = ['index.json', 'post-1.json', 'post-2.json']
    const slugs = filterItemFiles(files)

    expect(slugs).not.toContain('index')
    expect(slugs).toContain('post-1')
    expect(slugs).toContain('post-2')
  })

  it('should filter out non-json files', () => {
    const files = ['post-1.json', 'readme.md', 'image.png', 'post-2.json']
    const slugs = filterItemFiles(files)

    expect(slugs).toEqual(['post-1', 'post-2'])
  })

  it('should remove .json extension', () => {
    const files = ['hello-world.json', 'my-awesome-post.json']
    const slugs = filterItemFiles(files)

    expect(slugs).toEqual(['hello-world', 'my-awesome-post'])
  })

  it('should handle empty directory', () => {
    const files: string[] = []
    const slugs = filterItemFiles(files)

    expect(slugs).toEqual([])
  })

  it('should handle directory with only index.json', () => {
    const files = ['index.json']
    const slugs = filterItemFiles(files)

    expect(slugs).toEqual([])
  })
})

describe('cache directory structure', () => {
  function getCacheStructure(
    cacheDir: string,
    locales: string[],
    collections: string[],
  ): string[] {
    const paths: string[] = []

    for (const locale of locales) {
      for (const collection of collections) {
        paths.push(`${cacheDir}/${locale}/${collection}`)
      }
    }

    return paths
  }

  it('should generate paths for all locale/collection combinations', () => {
    const paths = getCacheStructure('.cms-cache', ['en', 'de'], ['blogs', 'authors'])

    expect(paths).toHaveLength(4)
    expect(paths).toContain('.cms-cache/en/blogs')
    expect(paths).toContain('.cms-cache/en/authors')
    expect(paths).toContain('.cms-cache/de/blogs')
    expect(paths).toContain('.cms-cache/de/authors')
  })

  it('should handle single locale', () => {
    const paths = getCacheStructure('.cms-cache', ['en'], ['blogs', 'authors', 'legal'])

    expect(paths).toHaveLength(3)
  })

  it('should handle single collection', () => {
    const paths = getCacheStructure('.cms-cache', ['en', 'de', 'fr'], ['blogs'])

    expect(paths).toHaveLength(3)
  })

  it('should handle empty locales', () => {
    const paths = getCacheStructure('.cms-cache', [], ['blogs'])

    expect(paths).toHaveLength(0)
  })

  it('should handle empty collections', () => {
    const paths = getCacheStructure('.cms-cache', ['en', 'de'], [])

    expect(paths).toHaveLength(0)
  })
})
