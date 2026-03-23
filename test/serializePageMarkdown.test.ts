import { describe, expect, it } from 'vitest'
import { serializePageMarkdown } from '../src/runtime/shared/serializePageMarkdown'

describe('serializePageMarkdown', () => {
  it('produces frontmatter + body', () => {
    const result = serializePageMarkdown({
      title: 'Hello World',
      slug: 'hello-world',
      body: '## Introduction\n\nSome content here.',
    })

    expect(result).toBe(
      `---\ntitle: Hello World\nslug: hello-world\n---\n\n## Introduction\n\nSome content here.`,
    )
  })

  it('omits underscore-prefixed fields', () => {
    const result = serializePageMarkdown({
      title: 'Test',
      _locale: 'en',
      _fallback: { title: false },
      body: 'Content',
    })

    expect(result).toBe('---\ntitle: Test\n---\n\nContent')
  })

  it('omits null and undefined values', () => {
    const result = serializePageMarkdown({
      title: 'Test',
      description: null,
      tags: undefined,
      body: 'Content',
    })

    expect(result).toBe('---\ntitle: Test\n---\n\nContent')
  })

  it('returns empty string for empty item', () => {
    expect(serializePageMarkdown({})).toBe('')
  })

  it('returns only frontmatter when no body', () => {
    const result = serializePageMarkdown({ title: 'No body' })
    expect(result).toBe('---\ntitle: No body\n---')
  })

  it('returns only body when no frontmatter fields', () => {
    const result = serializePageMarkdown({ body: '## Just content', _id: '123' })
    expect(result).toBe('## Just content')
  })

  it('uses custom body field', () => {
    const result = serializePageMarkdown(
      { title: 'Test', content: '## Custom body', body: 'ignored' },
      'content',
    )

    expect(result).toBe('---\ntitle: Test\nbody: ignored\n---\n\n## Custom body')
  })

  it('handles nested objects', () => {
    const result = serializePageMarkdown({
      title: 'Test',
      meta: { author: 'Alice', year: 2026 },
      body: 'Content',
    })

    expect(result).toContain('meta:')
    expect(result).toContain('  author: Alice')
    expect(result).toContain('  year: 2026')
  })

  it('handles arrays', () => {
    const result = serializePageMarkdown({
      title: 'Test',
      tags: ['vue', 'nuxt'],
      body: 'Content',
    })

    expect(result).toContain('tags:')
    expect(result).toContain('- vue')
    expect(result).toContain('- nuxt')
  })

  it('quotes strings with special characters', () => {
    const result = serializePageMarkdown({
      title: 'Hello: World',
      body: 'Content',
    })

    expect(result).toContain('title: "Hello: World"')
  })

  it('handles boolean and number values', () => {
    const result = serializePageMarkdown({
      draft: true,
      order: 42,
      body: 'Content',
    })

    expect(result).toContain('draft: true')
    expect(result).toContain('order: 42')
  })
})
