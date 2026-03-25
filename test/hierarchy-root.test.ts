import { describe, expect, it } from 'vitest'
import {
  buildGinkoHierarchyState,
  canonicalizeGinkoHierarchyPath,
  getGinkoHierarchySurroundEntries,
  getGinkoHierarchyEntryPath,
  resolveGinkoHierarchyPath,
} from '../src/hierarchy'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSectionLandingPath(section: { children?: any[] }) {
  const stack = [...(section.children ?? [])]
  while (stack.length > 0) {
    const node = stack.shift()
    if (!node) continue
    if (node.path) return node.path
    stack.unshift(...(node.children ?? []))
  }
  return undefined
}

describe('hierarchy root documents', () => {
  const state = buildGinkoHierarchyState(
    [
      {
        id: 'quick-start',
        slug: 'quick-start',
        content: { title: 'Quick Start', slug: 'quick-start' },
      },
      {
        id: 'guides',
        kind: 'folder',
        slug: 'guides',
        content: { title: 'Guides', slug: 'guides' },
        children: [
          {
            id: 'authentication',
            slug: 'authentication',
            content: { title: 'Authentication', slug: 'authentication' },
          },
        ],
      },
    ],
    {
      locale: 'en',
      defaultLocale: 'en',
      baseSegment: 'docs',
      includeFolders: true,
      rootSlug: 'quick-start',
    },
  )

  it('aliases the configured root slug to the collection base path', () => {
    expect(state.root).toEqual({
      slug: 'quick-start',
      sourcePath: '/docs/quick-start',
      path: '/docs',
      itemId: 'quick-start',
      contentId: undefined,
    })
    expect(canonicalizeGinkoHierarchyPath(state, '/docs/quick-start')).toBe('/docs')
    expect(canonicalizeGinkoHierarchyPath(state, '/docs')).toBe('/docs')
  })

  it('resolves the base path back to the configured root entry', () => {
    const rootEntry = resolveGinkoHierarchyPath(state, '/docs')
    expect(rootEntry?.slug).toBe('quick-start')
    expect(getGinkoHierarchyEntryPath(state, rootEntry!)).toBe('/docs')
  })

  it('leaves non-root hierarchy pages unchanged', () => {
    const authEntry = resolveGinkoHierarchyPath(state, '/docs/guides/authentication')
    expect(authEntry?.slug).toBe('authentication')
    expect(getGinkoHierarchyEntryPath(state, authEntry!)).toBe('/docs/guides/authentication')
  })

  it('keeps group nodes in navigation while excluding them from route segments', () => {
    const groupedState = buildGinkoHierarchyState(
      [
        {
          id: 'group-intro',
          kind: 'group',
          content: { title: 'Introduction' },
          children: [
            {
              id: 'quick-start',
              slug: 'quick-start',
              content: { title: 'Quick Start', slug: 'quick-start' },
            },
          ],
        },
      ],
      {
        locale: 'en',
        defaultLocale: 'en',
        baseSegment: 'docs',
        includeFolders: true,
      },
    )

    const [group] = groupedState.tree
    const [page] = group?.children ?? []

    expect(group?.nodeKind).toBe('group')
    expect(group?.path).toBeUndefined()
    expect(page?.path).toBe('/docs/quick-start')
    expect(resolveGinkoHierarchyPath(groupedState, '/docs/quick-start')?.title).toBe('Quick Start')
  })

  it('does not infer folders from the legacy isFolder flag anymore', () => {
    const legacyState = buildGinkoHierarchyState(
      [
        {
          id: 'legacy-folder',
          isFolder: true,
          slug: 'legacy-folder',
          content: { title: 'Legacy Folder', slug: 'legacy-folder' },
        },
      ],
      {
        locale: 'en',
        defaultLocale: 'en',
        baseSegment: 'docs',
        includeFolders: true,
      },
    )

    expect(legacyState.tree[0]?.nodeKind).toBe('page')
    expect(legacyState.folders).toHaveLength(0)
    expect(legacyState.pages).toHaveLength(1)
  })

  it('restricts surround entries to the active section when requested', () => {
    const sectionedState = buildGinkoHierarchyState(
      [
        {
          id: 'section-docs',
          kind: 'section',
          slug: 'docs',
          content: { title: 'Docs', slug: 'docs' },
          children: [
            {
              id: 'quick-start',
              slug: 'quick-start',
              content: { title: 'Quick Start', slug: 'quick-start' },
            },
            {
              id: 'installation',
              kind: 'folder',
              slug: 'installation',
              content: { title: 'Installation', slug: 'installation' },
              children: [
                {
                  id: 'nuxt',
                  slug: 'nuxt',
                  content: { title: 'Nuxt', slug: 'nuxt' },
                },
              ],
            },
          ],
        },
        {
          id: 'section-deploy',
          kind: 'section',
          slug: 'deploy',
          content: { title: 'Deploy', slug: 'deploy' },
          children: [
            {
              id: 'deploy-overview',
              slug: 'deploy-overview',
              content: { title: 'Overview', slug: 'deploy-overview' },
            },
            {
              id: 'deploy-vercel',
              slug: 'deploy-vercel',
              content: { title: 'Vercel', slug: 'deploy-vercel' },
            },
          ],
        },
      ],
      {
        locale: 'en',
        defaultLocale: 'en',
        baseSegment: 'docs',
        includeFolders: true,
      },
    )

    expect(
      getGinkoHierarchySurroundEntries(sectionedState, '/docs/deploy-overview', {
        scope: 'section',
        includeFolders: true,
      }).map(entry => entry.slug),
    ).toEqual(['deploy-overview', 'deploy-vercel'])

    expect(
      getGinkoHierarchySurroundEntries(sectionedState, '/docs/deploy-overview', {
        scope: 'collection',
        includeFolders: true,
      }).map(entry => entry.slug),
    ).toEqual(['deploy-overview', 'deploy-vercel', 'installation', 'nuxt', 'quick-start'])

    const docsSection = sectionedState.tree.find(entry => entry.slug === 'docs')
    const deploySection = sectionedState.tree.find(entry => entry.slug === 'deploy')

    expect(docsSection?.slug).toBe('docs')
    expect(deploySection?.slug).toBe('deploy')
    expect(getSectionLandingPath(docsSection!)).toBe('/docs/installation')
    expect(getSectionLandingPath(deploySection!)).toBe('/docs/deploy-overview')
  })

  it('falls back to collection-wide surround when no sections exist', () => {
    expect(
      getGinkoHierarchySurroundEntries(state, '/docs/guides/authentication', {
        scope: 'section',
        includeFolders: true,
      }).map(entry => entry.slug),
    ).toEqual(['guides', 'authentication', 'quick-start'])
  })
})
