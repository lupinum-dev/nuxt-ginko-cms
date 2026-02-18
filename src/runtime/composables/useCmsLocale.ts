/**
 * Locale management composable
 */

import type { ComputedRef, Ref } from 'vue'
import { computed, useRuntimeConfig, useState } from '#imports'

export interface UseCmsLocaleReturn {
  /** Current locale */
  locale: Ref<string>
  /** All available locales */
  locales: ComputedRef<string[]>
  /** Default locale */
  defaultLocale: ComputedRef<string>
  /** Set the current locale */
  setLocale: (newLocale: string) => void
  /** Check if a locale is available */
  isValidLocale: (locale: string) => boolean
}

/**
 * Manage CMS locale state
 *
 * @example
 * ```ts
 * const { locale, locales, setLocale } = useCmsLocale()
 *
 * // Get current locale
 * console.log(locale.value) // 'en'
 *
 * // Change locale
 * setLocale('de')
 * ```
 */
export function useCmsLocale(): UseCmsLocaleReturn {
  const config = useRuntimeConfig()
  const cmsConfig = config.public.cmsGinko

  // Use Nuxt's useState for SSR-safe reactive state
  const locale = useState<string>('cms-locale', () => cmsConfig.defaultLocale)

  const locales = computed(() => cmsConfig.locales)
  const defaultLocale = computed(() => cmsConfig.defaultLocale)

  const isValidLocale = (testLocale: string): boolean => {
    return cmsConfig.locales.includes(testLocale)
  }

  const setLocale = (newLocale: string) => {
    if (isValidLocale(newLocale)) {
      locale.value = newLocale
    }
    else {
      console.warn(`Invalid locale: ${newLocale}. Available locales: ${cmsConfig.locales.join(', ')}`)
    }
  }

  return {
    locale,
    locales,
    defaultLocale,
    setLocale,
    isValidLocale,
  }
}
