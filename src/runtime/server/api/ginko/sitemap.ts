import { useRuntimeConfig } from '#imports'
import { defineEventHandler } from 'h3'
import { getGinkoSitemapEntriesFromSiteConfig } from '../../../../sitemap'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const key = String(runtimeConfig.ginkoCms?.key || '').trim()
  const base = String(runtimeConfig.ginkoCms?.base || 'https://site.ginko-cms.com')
  const site = runtimeConfig.public.ginkoCms?.site
  if (!key) {
    throw new Error('[ginko-cms] Missing runtime CMS key for sitemap generation')
  }
  if (!site) {
    return []
  }
  return await getGinkoSitemapEntriesFromSiteConfig({
    key,
    base,
    site,
  })
})
