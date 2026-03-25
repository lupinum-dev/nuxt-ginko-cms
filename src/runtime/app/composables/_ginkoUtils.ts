import { computed, isRef } from 'vue'

function asString(value) {
  if (typeof value !== 'string') {
    return void 0
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : void 0
}
function unrefValue(value) {
  if (!value || typeof value !== 'object') {
    return value
  }
  if (!('value' in value)) {
    return value
  }
  return value.value
}
export function resolveGinkoLocale(explicit, nuxtApp, route, runtimeConfig) {
  return computed(() => {
    const explicitValue = explicit ? asString(String(isRef(explicit) ? explicit.value : explicit)) : void 0
    if (explicitValue) {
      return explicitValue
    }
    const i18nLocale = asString(String(unrefValue(nuxtApp.$i18n?.locale) ?? ''))
    if (i18nLocale) {
      return i18nLocale
    }
    const routeLocale = asString(String(route.params?.locale ?? ''))
    if (routeLocale) {
      return routeLocale
    }
    return asString(String(runtimeConfig.public.ginkoCms?.locale ?? '')) || ''
  })
}
