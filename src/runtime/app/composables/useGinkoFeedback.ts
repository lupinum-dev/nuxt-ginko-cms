import type { Ref } from 'vue'
import type { GinkoFeedbackSubmitResult, UseGinkoFeedbackOptions, UseGinkoFeedbackResult } from '../../types/forms.js'
import { ref } from 'vue'

/**
 * Composable for submitting feedback (reactions, comments, ratings) on a CMS item.
 *
 * Proxies through the Nitro `/api/ginko/feedback/:collectionSlug/:itemSlug` route.
 * Requires the target item's collection to have a `feedback` field configured.
 *
 * @param collectionSlug The CMS collection slug (e.g. `'blog-posts'`).
 * @param itemSlug The CMS item slug (e.g. `'my-first-post'`).
 * @param fieldKey The `feedback` field key on the collection (e.g. `'feedback'`).
 * @param options Optional callbacks.
 *
 * @example
 * ```ts
 * const { submitReaction, submitComment, submitRating, isPending } = useGinkoFeedback(
 *   'blog-posts', 'my-first-post', 'feedback'
 * )
 * await submitReaction('👍')
 * await submitComment('Great article!', 'Alice')
 * await submitRating(5)
 * ```
 */
export function useGinkoFeedback(
  collectionSlug: string,
  itemSlug: string,
  fieldKey: string,
  options: UseGinkoFeedbackOptions = {},
): UseGinkoFeedbackResult {
  const isPending: Ref<boolean> = ref(false)
  const error: Ref<GinkoFeedbackSubmitResult | null> = ref(null)

  function getSessionId(): string {
    if (typeof sessionStorage === 'undefined')
      return ''
    const key = '__ginko_sid'
    let sid = sessionStorage.getItem(key)
    if (!sid) {
      sid = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      sessionStorage.setItem(key, sid)
    }
    return sid
  }

  async function send(body: Record<string, unknown>): Promise<GinkoFeedbackSubmitResult> {
    if (isPending.value) {
      return { ok: false, error: 'invalid', message: 'Submission already in progress' }
    }
    isPending.value = true
    error.value = null

    try {
      const result = await $fetch<GinkoFeedbackSubmitResult>(
        `/api/ginko/feedback/${collectionSlug}/${itemSlug}`,
        {
          method: 'POST',
          body: {
            ...body,
            fieldKey,
            sessionId: getSessionId(),
          },
        },
      )

      if (result.ok) {
        options.onSuccess?.()
        return result
      }
      else {
        error.value = result
        options.onError?.(result)
        return result
      }
    }
    catch (e: unknown) {
      const fetchError = e as { data?: GinkoFeedbackSubmitResult, message?: string }
      if (fetchError.data?.ok === false) {
        const result = fetchError.data
        error.value = result
        options.onError?.(result)
        return result
      }
      const msg = fetchError.message ?? 'Submission failed. Please try again.'
      const result: GinkoFeedbackSubmitResult = { ok: false, error: 'upstream_error', message: msg }
      error.value = result
      options.onError?.(result)
      return result
    }
    finally {
      isPending.value = false
    }
  }

  function submitReaction(emoji: string): Promise<GinkoFeedbackSubmitResult> {
    return send({ type: 'reaction', value: { emoji } })
  }

  function submitComment(text: string, author?: string): Promise<GinkoFeedbackSubmitResult> {
    return send({ type: 'comment', value: { text, author } })
  }

  function submitRating(score: number): Promise<GinkoFeedbackSubmitResult> {
    return send({ type: 'rating', value: { score } })
  }

  return {
    submitReaction,
    submitComment,
    submitRating,
    isPending,
    error,
  }
}
