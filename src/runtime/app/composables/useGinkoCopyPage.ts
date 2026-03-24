/**
 * Provides clipboard copy of a CMS page as frontmatter + MDC markdown.
 * @module ginko
 * @scope any page using useGinkoPage
 * @state Local
 * @mutations None
 */
import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { serializePageMarkdown } from '../../shared/serializePageMarkdown.js'

/** Options for {@link useGinkoCopyPage}. */
export interface UseGinkoCopyPageOptions {
  /** The field name containing the page body content. @defaultValue `'body'` */
  bodyField?: string
  /** Specific frontmatter fields to include. When omitted, all non-body fields are included. */
  frontmatterFields?: string[]
  /** Delay in milliseconds before resetting the `copied` flag. @defaultValue `2000` */
  resetDelay?: number
}

/** Return shape of {@link useGinkoCopyPage}. */
export interface UseGinkoCopyPageResult {
  /** Computed markdown string (frontmatter + MDC body) from the current page data. */
  markdown: ComputedRef<string>
  /** Copies the markdown to the clipboard and sets `copied` to `true`. */
  copy: () => Promise<void>
  /** Whether the content was recently copied. Auto-resets after `resetDelay`. */
  copied: Ref<boolean>
}

export function useGinkoCopyPage(
  data: Ref<Record<string, unknown> | null | undefined>,
  options: UseGinkoCopyPageOptions = {},
): UseGinkoCopyPageResult {
  const { bodyField = 'body', frontmatterFields, resetDelay = 2000 } = options
  const copied = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | undefined

  const markdown = computed(() => {
    const item = data.value
    if (!item)
      return ''
    return serializePageMarkdown(item, bodyField, frontmatterFields)
  })

  watch(copied, (val) => {
    if (val) {
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => { copied.value = false }, resetDelay)
    }
  })

  async function copy() {
    const text = markdown.value
    if (!text)
      return
    await navigator.clipboard.writeText(text)
    copied.value = true
  }

  return { markdown, copy, copied }
}
