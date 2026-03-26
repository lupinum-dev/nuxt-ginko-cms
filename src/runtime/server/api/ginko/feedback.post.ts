import type { GinkoFeedbackSubmitResult } from '../../../types/forms.js'
import { createError, defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import { postGinkoCmsJson } from '../../utils/ginko-cms.js'

/**
 * POST /api/ginko/feedback/:collectionSlug/:itemSlug
 *
 * Proxies a feedback submission to the CMS `/api/v1/feedback/:collectionSlug/:itemSlug` endpoint.
 * The `field` query param (fieldKey) should be appended by the client via the composable.
 */
export default defineEventHandler(async (event): Promise<GinkoFeedbackSubmitResult> => {
  const collectionSlug = getRouterParam(event, 'collectionSlug')
  const itemSlug = getRouterParam(event, 'itemSlug')

  if (!collectionSlug || !itemSlug) {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Missing collectionSlug or itemSlug parameter' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Request body must be a JSON object' })
  }

  // The CMS reads fieldKey from the ?field= query param, not the body
  const fieldKey = typeof body.fieldKey === 'string' ? body.fieldKey : ''
  if (!fieldKey) {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Missing fieldKey in request body' })
  }

  const result = await postGinkoCmsJson(event, `/api/v1/feedback/${collectionSlug}/${itemSlug}?field=${encodeURIComponent(fieldKey)}`, body)

  if (result.status === 403) {
    setResponseStatus(event, 403)
    const msg = typeof result.body.message === 'string' ? result.body.message : 'Feedback type not enabled'
    return { ok: false, error: 'not_enabled', message: msg }
  }

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
