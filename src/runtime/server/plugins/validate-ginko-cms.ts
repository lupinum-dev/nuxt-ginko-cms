import { defineNitroPlugin } from 'nitropack/runtime'
import { useRuntimeConfig } from '#imports'

export default defineNitroPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const key = String(runtimeConfig.ginkoCms?.key || '').trim()
  if (!key) {
    throw new Error('[ginko-cms] Missing NUXT_GINKO_CMS_KEY or NUXT_GINKO_KEY (runtimeConfig.ginkoCms.key)')
  }
})
