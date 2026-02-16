/**
 * Type stubs for Nuxt auto-imports
 * These are used for TypeScript during module development
 * In actual usage, Nuxt provides these via #imports
 */

import type { AsyncData } from '#app'
import type { ComputedRef, Ref } from 'vue'

// Vue reactivity
export declare function computed<T>(getter: () => T): ComputedRef<T>

// Nuxt composables
export declare function useState<T>(key: string, init?: () => T): Ref<T>
export declare function useRuntimeConfig(): {
  public: {
    cmsNuxt: {
      apiUrl: string
      teamSlug: string
      locales: string[]
      defaultLocale: string
      collections: Array<{ slug: string, populate?: string[], routePattern?: string }>
      preview: boolean
      assetDir: string
      cacheDir: string
    }
  }
  cmsNuxtApiKey: string
}
export declare function useAsyncData<T>(
  key: string,
  handler: () => Promise<T>,
  options?: { watch?: unknown[] },
): AsyncData<T | null, Error | null>

// Global fetch
export declare const $fetch: typeof globalThis.$fetch
