/** Result returned by the Nitro `/api/ginko/forms/:formId` route. */
export interface GinkoFormSubmitResult {
  ok: boolean
  error?: 'rate_limited' | 'invalid' | 'upstream_error'
  message?: string
}

/** Result returned by the Nitro `/api/ginko/feedback/:collectionSlug/:itemSlug` route. */
export interface GinkoFeedbackSubmitResult {
  ok: boolean
  error?: 'rate_limited' | 'invalid' | 'not_enabled' | 'upstream_error'
  message?: string
}

/** Options for {@link useGinkoForm}. */
export interface UseGinkoFormOptions {
  /**
   * Called when the form is successfully submitted.
   * @param result The server response.
   */
  onSuccess?: (result: GinkoFormSubmitResult) => void
  /**
   * Called when submission fails.
   * @param result The error result.
   */
  onError?: (result: GinkoFormSubmitResult) => void
}

/** Return type of {@link useGinkoForm}. */
export interface UseGinkoFormResult {
  /** Submit the form data. Appends honeypot and timing metadata automatically. */
  submit: (data: Record<string, unknown>) => Promise<GinkoFormSubmitResult>
  /** Whether a submission is in flight. */
  isSubmitting: Ref<boolean>
  /** Whether the last submission was successful. */
  isSubmitted: Ref<boolean>
  /** The human-readable error message from the last failed submission, if any. */
  errorMessage: Ref<string | null>
  /** Reset form state (isSubmitted, errorMessage). */
  reset: () => void
  /** Call on component mount to start the timing gate. */
  startTimer: () => void
}

/** Options for {@link useGinkoFeedback}. */
export interface UseGinkoFeedbackOptions {
  /** Called after successful submission. */
  onSuccess?: () => void
  /** Called on error. */
  onError?: (error: GinkoFeedbackSubmitResult) => void
}

/** Return type of {@link useGinkoFeedback}. */
export interface UseGinkoFeedbackResult {
  /** Submit a reaction (emoji). */
  submitReaction: (emoji: string) => Promise<GinkoFeedbackSubmitResult>
  /** Submit a comment text with optional author name. */
  submitComment: (text: string, author?: string) => Promise<GinkoFeedbackSubmitResult>
  /** Submit a numeric rating (1–5). */
  submitRating: (score: number) => Promise<GinkoFeedbackSubmitResult>
  /** Whether any submission is in flight. */
  isPending: Ref<boolean>
  /** Error from the last failed submission, if any. */
  error: Ref<GinkoFeedbackSubmitResult | null>
}
