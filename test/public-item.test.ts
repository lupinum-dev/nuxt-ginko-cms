import { describe, expect, it } from 'vitest'
import { assertValidPublicItem, normalizePublicItem } from '../src/runtime/server/utils/public-item'

describe('public item normalization', () => {
  it('hoists nested content fields into a flat record', () => {
    expect(
      normalizePublicItem({
        id: 'item_1',
        slug: 'quick-start',
        status: 'published',
        content: {
          title: 'Quick Start',
          description: 'Overview',
          content: '## Hello',
        },
      }),
    ).toEqual({
      id: 'item_1',
      slug: 'quick-start',
      status: 'published',
      title: 'Quick Start',
      description: 'Overview',
      content: '## Hello',
    })
  })

  it('rejects metadata-only payloads', () => {
    expect(() =>
      assertValidPublicItem(
        {
          id: 'item_1',
          slug: 'quick-start',
          status: 'published',
        },
        {
          collectionSource: 'docs',
          op: 'page',
          includeBody: true,
        },
      ),
    ).toThrow(/missing top-level title/)
  })

  it('accepts flat public item payloads', () => {
    expect(
      assertValidPublicItem(
        {
          id: 'item_1',
          slug: 'quick-start',
          status: 'published',
          title: 'Quick Start',
          description: 'Overview',
          content: '## Hello',
        },
        {
          collectionSource: 'docs',
          op: 'page',
          includeBody: true,
        },
      ),
    ).toMatchObject({
      title: 'Quick Start',
      content: '## Hello',
    })
  })
})
