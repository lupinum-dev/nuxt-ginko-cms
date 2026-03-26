import type { Ref } from 'vue'
import type { GinkoFormSubmitResult, UseGinkoFormOptions, UseGinkoFormResult } from '../../types/forms.js'
import { ref } from 'vue'

/**
 * Composable for submitting a CMS-managed form.
 *
 * Handles honeypot, timing gate, and session tracking automatically.
 * Proxies submissions through the Nitro `/api/ginko/forms/:formId` route,
 * which forwards to the CMS with your API key.
 *
 * @param formId The form slug registered in the CMS (e.g. `'contact'`).
 * @param options Optional callbacks and configuration.
 *
 * @example
 * ```ts
 * const form = useGinkoForm('contact')
 * onMounted(() => form.startTimer())
 *
 * async function handleSubmit() {
 *   await form.submit({ name, email, message })
 * }
 * ```
 */
export function useGinkoForm(formId: string, options: UseGinkoFormOptions = {}): UseGinkoFormResult {
  const isSubmitting: Ref<boolean> = ref(false)
  const isSubmitted: Ref<boolean> = ref(false)
  const errorMessage: Ref<string | null> = ref(null)

  let renderedAt: number | null = null

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

  function startTimer(): void {
    renderedAt = Date.now()
  }

  function reset(): void {
    isSubmitted.value = false
    errorMessage.value = null
  }

  async function submit(data: Record<string, unknown>): Promise<GinkoFormSubmitResult> {
    if (isSubmitting.value) {
      return { ok: false, error: 'invalid', message: 'Submission already in progress' }
    }

    isSubmitting.value = true
    errorMessage.value = null

    try {
      const submittedAt = Date.now()

      const payload: Record<string, unknown> = {
        ...data,
        __hp: '', // Honeypot — always empty; CMS rejects if filled by bots
        sessionId: getSessionId(), // used for per-session rate limiting
        submittedAt, // epoch ms; server computes elapsed for timing gate
      }

      const result = await $fetch<GinkoFormSubmitResult>(`/api/ginko/forms/${formId}`, {
        method: 'POST',
        body: payload,
      })

      if (result.ok) {
        isSubmitted.value = true
        options.onSuccess?.(result)
        return result
      }
      else {
        errorMessage.value = result.message ?? 'Submission failed. Please try again.'
        options.onError?.(result)
        return result
      }
    }
    catch (e: unknown) {
      // ofetch throws FetchError for non-2xx responses — extract body if available
      const fetchError = e as { data?: GinkoFormSubmitResult, message?: string }
      if (fetchError.data?.ok === false) {
        const result = fetchError.data
        errorMessage.value = result.message ?? 'Submission failed. Please try again.'
        options.onError?.(result)
        return result
      }
      const msg = fetchError.message ?? 'Submission failed. Please try again.'
      const result: GinkoFormSubmitResult = { ok: false, error: 'upstream_error', message: msg }
      errorMessage.value = msg
      options.onError?.(result)
      return result
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    submit,
    isSubmitting,
    isSubmitted,
    errorMessage,
    reset,
    startTimer,
  }
}
