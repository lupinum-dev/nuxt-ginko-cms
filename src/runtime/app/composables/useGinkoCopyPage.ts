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

export interface UseGinkoCopyPageOptions {
  bodyField?: string
  resetDelay?: number
}

export interface UseGinkoCopyPageResult {
  markdown: ComputedRef<string>
  copy: () => Promise<void>
  copied: Ref<boolean>
}

export function useGinkoCopyPage(
  data: Ref<Record<string, unknown> | null | undefined>,
  options: UseGinkoCopyPageOptions = {},
): UseGinkoCopyPageResult {
  const { bodyField = 'body', resetDelay = 2000 } = options
  const copied = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | undefined

  const markdown = computed(() => {
    const item = data.value
    if (!item)
      return ''
    return serializePageMarkdown(item, bodyField)
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
