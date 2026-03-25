import type { Ref } from 'vue'
import { computed, isRef } from 'vue'

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return void 0
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : void 0
}
function unrefValue(value: unknown): unknown {
  if (!value || typeof value !== 'object') {
    return value
  }
  if (!('value' in value)) {
    return value
  }
  return (value as { value: unknown }).value
}
export function resolveGinkoLocale(
  explicit: Ref<string> | string | undefined,
  nuxtApp: Record<string, unknown>,
  route: { params?: Record<string, unknown> },
  runtimeConfig: { public: Record<string, unknown> },
): Ref<string> {
  return computed(() => {
    const explicitValue = explicit ? asString(String(isRef(explicit) ? explicit.value : explicit)) : void 0
    if (explicitValue) {
      return explicitValue
    }
    const i18n = nuxtApp.$i18n as Record<string, unknown> | undefined
    const i18nLocale = asString(String(unrefValue(i18n?.locale) ?? ''))
    if (i18nLocale) {
      return i18nLocale
    }
    const routeLocale = asString(String(route.params?.locale ?? ''))
    if (routeLocale) {
      return routeLocale
    }
    const ginkoCms = runtimeConfig.public.ginkoCms as Record<string, unknown> | undefined
    return asString(String(ginkoCms?.locale ?? '')) || ''
  })
}
