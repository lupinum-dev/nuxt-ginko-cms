import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it, vi } from 'vitest'

const fetchAllItemsMock = vi.fn()

vi.mock('../src/runtime/server/utils/cms-client', () => ({
  createCmsClient: () => ({
    fetchAllItems: fetchAllItemsMock,
  }),
}))

interface HookStore {
  [name: string]: Array<(payload: unknown) => Promise<void> | void>
}

describe('cms build smoke', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    vi.clearAllMocks()
    while (tempDirs.length) {
      const dir = tempDirs.pop()
      if (dir) {
        await rm(dir, { recursive: true, force: true })
      }
    }
  })

  it('writes collection cache index through prerender:init hook', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'ginko-cms-smoke-'))
    tempDirs.push(rootDir)

    const hooks: HookStore = {}
    const nitro = {
      options: { rootDir },
      hooks: {
        hook(name: string, handler: (payload: unknown) => Promise<void> | void) {
          if (!hooks[name]) {
            hooks[name] = []
          }
          hooks[name].push(handler)
        },
      },
    }

    fetchAllItemsMock.mockResolvedValue([
      {
        id: 'post-1',
        slug: 'hello-world',
        title: 'Hello World',
        content: 'Lorem ipsum',
      },
    ])

    const { registerCmsBuildHooks } = await import('../src/runtime/server/nitro/cms-build')

    registerCmsBuildHooks(
      nitro as never,
      {
        apiUrl: 'https://example.convex.site',
        teamSlug: 'my-team',
        locales: ['en'],
        defaultLocale: 'en',
        collections: [{ slug: 'blogs', routePattern: '/blog/[slug]' }],
        preview: false,
        accessLevel: 'public',
        assetDir: 'cms-assets',
        cacheDir: '.cms-cache',
        localePrefix: 'no_prefix',
        localizeAssets: false,
      },
      'public-key',
    )

    const prerenderInitHandlers = hooks['prerender:init']
    expect(prerenderInitHandlers).toHaveLength(1)

    await prerenderInitHandlers[0]({ options: { rootDir } })

    const indexPath = join(rootDir, 'public', '.cms-cache', 'en', 'blogs', 'index.json')
    const raw = await readFile(indexPath, 'utf-8')
    const parsed = JSON.parse(raw) as {
      items: Array<{ id: string, slug: string, title: string }>
      total: number
      locale: string
    }

    expect(fetchAllItemsMock).toHaveBeenCalledWith('blogs', 'en', undefined)
    expect(parsed.total).toBe(1)
    expect(parsed.locale).toBe('en')
    expect(parsed.items[0]).toMatchObject({
      id: 'post-1',
      slug: 'hello-world',
      title: 'Hello World',
    })
  })
})
