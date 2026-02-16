/**
 * CMS API Proxy
 *
 * Proxies requests to the Convex CMS API with authentication.
 * This ensures the API key is never exposed to the client.
 *
 * Routes:
 * - GET /api/_cms/:collection - List items
 * - GET /api/_cms/:collection/:slug - Get single item
 */

import { useRuntimeConfig } from '#imports'
import { createError, defineEventHandler, getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsNuxt
  const apiKey = config.cmsNuxtApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'CMS API key not configured',
    })
  }

  // Extract path from the request URL (everything after /api/_cms/)
  const requestUrl = getRequestURL(event)
  const fullPath = requestUrl.pathname.replace(/^\/api\/_cms\/?/, '')
  const queryString = requestUrl.search

  // Build the target URL
  const targetUrl = `${cmsConfig.apiUrl}/api/v1/cms/${cmsConfig.teamSlug}/${fullPath}${queryString}`

  try {
    const response = await $fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    return response
  }
  catch (error: unknown) {
    if (error && typeof error === 'object') {
      const err = error as { status?: number, statusCode?: number, data?: unknown, message?: string }
      const status = err.status || err.statusCode || 500
      console.error(`[CMS Proxy] ${status} error for ${fullPath}:`, err.data || err.message)
      throw createError({
        statusCode: status,
        message: status === 404 ? 'Not found' : 'CMS API error',
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch from CMS',
    })
  }
})
