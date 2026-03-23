import type { GinkoCmsSiteConfig } from './index'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    ginkoCms: {
      key: string
      base: string
      locale?: string
      timeoutMs: number
      contextTtlMs: number
    }
  }

  interface PublicRuntimeConfig {
    ginkoCms: {
      routeBase: string
      locale?: string
      site?: GinkoCmsSiteConfig
    }
  }
}

export {}
