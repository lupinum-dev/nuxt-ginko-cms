import { describe, expect, it } from 'vitest'
import { serializePageMarkdown } from '../src/runtime/shared/serializePageMarkdown'

describe('serializePageMarkdown', () => {
  it('returns only body when no fields specified', () => {
    const result = serializePageMarkdown({
      title: 'Hello World',
      slug: 'hello-world',
      body: '## Introduction\n\nSome content here.',
    })

    expect(result).toBe('## Introduction\n\nSome content here.')
  })

  it('returns empty string for empty item', () => {
    expect(serializePageMarkdown({})).toBe('')
  })

  it('returns only body when fields is empty array', () => {
    const result = serializePageMarkdown(
      { title: 'Test', body: 'Content' },
      'body',
      [],
    )
    expect(result).toBe('Content')
  })

  it('returns only whitelisted fields as frontmatter', () => {
    const result = serializePageMarkdown(
      { title: 'Hello', slug: 'hello', tags: ['vue'], body: 'Content' },
      'body',
      ['title'],
    )

    expect(result).toBe('---\ntitle: Hello\n---\n\nContent')
  })

  it('includes multiple whitelisted fields', () => {
    const result = serializePageMarkdown(
      { title: 'Hello', slug: 'hello', draft: true, body: 'Content' },
      'body',
      ['title', 'slug'],
    )

    expect(result).toBe('---\ntitle: Hello\nslug: hello\n---\n\nContent')
  })

  it('skips whitelisted fields that are null or undefined', () => {
    const result = serializePageMarkdown(
      { title: 'Test', description: null, body: 'Content' },
      'body',
      ['title', 'description'],
    )

    expect(result).toBe('---\ntitle: Test\n---\n\nContent')
  })

  it('skips whitelisted fields that do not exist on item', () => {
    const result = serializePageMarkdown(
      { title: 'Test', body: 'Content' },
      'body',
      ['title', 'nonexistent'],
    )

    expect(result).toBe('---\ntitle: Test\n---\n\nContent')
  })

  it('returns only frontmatter when no body', () => {
    const result = serializePageMarkdown(
      { title: 'No body' },
      'body',
      ['title'],
    )
    expect(result).toBe('---\ntitle: No body\n---')
  })

  it('returns only body when no frontmatter fields match', () => {
    const result = serializePageMarkdown(
      { body: '## Just content', _id: '123' },
      'body',
      ['nonexistent'],
    )
    expect(result).toBe('## Just content')
  })

  it('uses custom body field', () => {
    const result = serializePageMarkdown(
      { title: 'Test', content: '## Custom body', body: 'ignored' },
      'content',
      ['title', 'body'],
    )

    expect(result).toBe('---\ntitle: Test\nbody: ignored\n---\n\n## Custom body')
  })

  it('handles nested objects in whitelisted fields', () => {
    const result = serializePageMarkdown(
      { title: 'Test', meta: { author: 'Alice', year: 2026 }, body: 'Content' },
      'body',
      ['title', 'meta'],
    )

    expect(result).toContain('meta:')
    expect(result).toContain('  author: Alice')
    expect(result).toContain('  year: 2026')
  })

  it('handles arrays in whitelisted fields', () => {
    const result = serializePageMarkdown(
      { title: 'Test', tags: ['vue', 'nuxt'], body: 'Content' },
      'body',
      ['title', 'tags'],
    )

    expect(result).toContain('tags:')
    expect(result).toContain('- vue')
    expect(result).toContain('- nuxt')
  })

  it('quotes strings with special characters', () => {
    const result = serializePageMarkdown(
      { title: 'Hello: World', body: 'Content' },
      'body',
      ['title'],
    )

    expect(result).toContain('title: "Hello: World"')
  })

  it('handles boolean and number values', () => {
    const result = serializePageMarkdown(
      { draft: true, order: 42, body: 'Content' },
      'body',
      ['draft', 'order'],
    )

    expect(result).toContain('draft: true')
    expect(result).toContain('order: 42')
  })
})
