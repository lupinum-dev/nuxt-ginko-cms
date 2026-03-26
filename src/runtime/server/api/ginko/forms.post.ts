import type { GinkoFormSubmitResult } from '../../../types/forms.js'
import { createError, defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import { postGinkoCmsJson } from '../../utils/ginko-cms.js'

/**
 * POST /api/ginko/forms/:formId
 *
 * Proxies a form submission to the CMS `/api/v1/forms/:formId` endpoint.
 * The CMS handles spam detection, rate limiting, and storage.
 */
export default defineEventHandler(async (event): Promise<GinkoFormSubmitResult> => {
  const formId = getRouterParam(event, 'formId')
  if (!formId) {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Missing formId parameter' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Request body must be a JSON object' })
  }

  // Server-to-server: no Origin header forwarding needed (CMS allows null origin)
  const result = await postGinkoCmsJson(event, `/api/v1/forms/${formId}`, body)

  if (result.status === 429) {
    setResponseStatus(event, 429)
    return { ok: false, error: 'rate_limited', message: 'Too many submissions. Please try again later.' }
  }

  if (result.status === 400) {
    setResponseStatus(event, 400)
    const msg = typeof result.body.message === 'string' ? result.body.message : 'Invalid submission'
    return { ok: false, error: 'invalid', message: msg }
  }

  if (result.status !== 200 && result.status !== 201) {
    setResponseStatus(event, 502)
    return { ok: false, error: 'upstream_error', message: 'Submission failed. Please try again.' }
  }

  setResponseStatus(event, 200)
  return { ok: true }
})
