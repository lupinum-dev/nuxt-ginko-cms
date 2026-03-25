import type { Ref } from 'vue'
import type { GinkoTocItem } from '../../types/index.js'
import { computed } from 'vue'

interface MdcTocLink {
  id: string
  text: string
  depth: number
  children?: MdcTocLink[]
}

/** Recursively flatten nested TOC links into a flat list. */
function _flattenLinks(links: MdcTocLink[]): GinkoTocItem[] {
  const items: GinkoTocItem[] = []
  const walk = (entries: MdcTocLink[]) => {
    for (const entry of entries) {
      if (entry.id && entry.text) {
        items.push({ id: entry.id, text: entry.text, depth: entry.depth })
      }
      if (entry.children?.length) {
        walk(entry.children)
      }
    }
  }
  walk(links)
  return items
}

/** Simple heading extraction from markdown content as fallback. */
function extractHeadingsFromMarkdown(content: string): GinkoTocItem[] {
  const items: GinkoTocItem[] = []
  const headingRegex = /^(#{2,4})\s+(\S.*)$/gm
  let match: RegExpExecArray | null

  match = headingRegex.exec(content)
  while (match !== null) {
    const depth = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    items.push({ id, text, depth })
    match = headingRegex.exec(content)
  }

  return items
}

/**
 * Extract a flat table-of-contents from markdown content.
 *
 * Takes the content string directly (not the page object).
 * Returns a flat `TocItem[]` — consumer renders indentation based on `depth`.
 *
 * @module ginko
 * @scope toc
 * @state Local
 * @mutations None
 *
 * @example
 * ```ts
 * const toc = useGinkoToc(computed(() => page.value?.content))
 * // toc.value = [{ id: 'intro', text: 'Introduction', depth: 2 }, ...]
 *
 * // With depth filtering (h2 + h3 only)
 * const toc = useGinkoToc(computed(() => page.value?.content), { depth: 3 })
 * ```
 */
export function useGinkoToc(
  content: Ref<string | null | undefined>,
  options?: { depth?: number },
): Ref<GinkoTocItem[]> {
  const maxDepth = options?.depth ?? 4
  return computed<GinkoTocItem[]>(() => {
    const raw = content.value
    if (!raw) return []

    const items = extractHeadingsFromMarkdown(raw)
    return maxDepth < 4 ? items.filter(item => item.depth <= maxDepth) : items
  })
}
