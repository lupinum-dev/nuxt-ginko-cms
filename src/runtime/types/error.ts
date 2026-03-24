/** Standardized error shape for all Ginko composables. */
export interface GinkoError {
  /** HTTP status code (0 for network errors). */
  status: number
  /** Human-readable error message. */
  message: string
  /** Programmatic error code for branching. */
  code: GinkoErrorCode
}

export type GinkoErrorCode =
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'SERVER'
  | 'UNKNOWN'

/** Map an HTTP status to a GinkoError. */
export function createGinkoError(status: number, message: string): GinkoError {
  let code: GinkoErrorCode
  if (status === 404) code = 'NOT_FOUND'
  else if (status === 403 || status === 401) code = 'FORBIDDEN'
  else if (status === 408 || status === 504) code = 'TIMEOUT'
  else if (status === 0) code = 'NETWORK'
  else if (status >= 500) code = 'SERVER'
  else code = 'UNKNOWN'

  return { status, message, code }
}

/** Map a caught error (from fetch/useAsyncData) to a GinkoError. */
export function toGinkoError(err: unknown): GinkoError {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    // Nuxt/H3 error shape
    if (typeof e.statusCode === 'number') {
      return createGinkoError(e.statusCode, String(e.statusMessage || e.message || 'Request failed'))
    }
    // Standard Error
    if (e instanceof Error) {
      if (e.name === 'AbortError' || e.message?.includes('timeout')) {
        return createGinkoError(408, e.message)
      }
      if (e.message?.includes('fetch') || e.message?.includes('network')) {
        return createGinkoError(0, e.message)
      }
      return createGinkoError(500, e.message)
    }
  }
  return createGinkoError(500, 'Unknown error')
}
