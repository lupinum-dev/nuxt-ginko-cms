import { createError, defineEventHandler, getMethod, getQuery } from 'h3'
import { resolveSitePath } from '../../utils/ginko-query.js'

export default defineEventHandler(async (event) => {
  const method = getMethod(event).toUpperCase()
  if (method !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }
  const query = getQuery(event)
  const path = typeof query.path === 'string' ? query.path : ''
  if (!path.trim()) {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Missing path query param' })
  }
  const locale = typeof query.locale === 'string' ? query.locale : void 0
  return await resolveSitePath(event, {
    path,
    locale,
  })
})
