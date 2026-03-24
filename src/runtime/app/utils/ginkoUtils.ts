/**
 * Auto-imported utility functions for Ginko CMS consumers.
 */

import type { Component } from 'vue'

/**
 * Format a date string for display.
 *
 * @example
 * ```ts
 * formatGinkoDate('2025-03-19')           // "March 19, 2025"
 * formatGinkoDate('2025-03-19', 'de')     // "19. März 2025"
 * ```
 */
export function formatGinkoDate(value?: string | null, locale = 'en-US'): string | undefined {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Estimate reading time from markdown content.
 *
 * @example
 * ```ts
 * estimateReadingTime(page.content)  // "5 min read"
 * ```
 */
export function estimateReadingTime(content?: string | null, wordsPerMinute = 200): string | undefined {
  if (!content) return undefined

  // Strip markdown syntax for rough word count
  const text = content
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`[^`]+`/g, '') // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text
    .replace(/[#*_~>-]+/g, '') // markdown syntax
    .trim()

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  return `${minutes} min read`
}

/**
 * Resolve a CMS icon name to a Vue component from a provided icon registry.
 *
 * Strips `lucide:` prefix and converts to PascalCase for lookup.
 *
 * @example
 * ```ts
 * import * as LucideIcons from 'lucide-vue-next'
 * const icon = resolveGinkoIcon('lucide:book-open', LucideIcons)
 * // → LucideIcons.BookOpen component
 * ```
 */
export function resolveGinkoIcon(
  name: string | undefined | null,
  icons: Record<string, Component>,
): Component | undefined {
  if (!name) return undefined

  const raw = name.trim()
  if (!raw) return undefined

  const normalized = raw.replace(/^lucide:/, '').trim()
  const exportName = normalized
    .split(/[-_\s/]+/)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')

  return icons[exportName]
}
