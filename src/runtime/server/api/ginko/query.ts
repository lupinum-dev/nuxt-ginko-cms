import { createError, defineEventHandler, getMethod, readBody } from 'h3'
import { executeGinkoQuery } from '../../utils/ginko-query.js'

export default defineEventHandler(async (event) => {
  const method = getMethod(event).toUpperCase()
  if (method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }
  const body = await readBody(event)
  const payload = body || {}
  if (!payload.op) {
    throw createError({ statusCode: 400, statusMessage: '[ginko-cms] Missing query operation' })
  }
  return await executeGinkoQuery(event, payload)
})
