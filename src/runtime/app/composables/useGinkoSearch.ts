import type { ComputedRef, Ref } from 'vue'
import type { GinkoSearchHit } from '../../types/index.js'
import { useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig, useState } from '#imports'
import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'
import { resolveGinkoLocale } from './_ginkoUtils.js'

/** Options for {@link useGinkoSearch} when called with a collection key. */
export interface UseGinkoSearchOptions {
  /** Debounce delay in milliseconds before executing search. @defaultValue 220 */
  debounce?: number
  /** Minimum query length required to trigger a search request. @defaultValue 2 */
  minLength?: number
  /** Maximum number of results to return. @defaultValue 12 */
  limit?: number
  /** Locale override. Falls back to the standard locale resolution chain. */
  locale?: Ref<string> | string
}

/** Modal-only return shape when {@link useGinkoSearch} is called without a collection key. */
export interface UseGinkoSearchModalResult {
  /** Whether the search modal is currently open. */
  isOpen: Ref<boolean>
  /** Whether a search modal host component is mounted and ready. */
  isSearchModalHostReady: ComputedRef<boolean>
  /** Opens the search modal. Queues a pending open if no host is mounted yet. */
  openSearch: () => void
  /** Closes the search modal and cancels any pending open request. */
  closeSearch: () => void
  /** Toggles the search modal open/closed state. */
  toggleSearch: () => void
  /** Registers a search modal host component. Returns an unregister function. */
  registerSearchModalHost: () => () => void
  /** Resets modal state: closes modal and clears pending open requests. */
  resetSearchModalState: () => void
}

/** Full return shape when {@link useGinkoSearch} is called with a collection key. */
export interface UseGinkoSearchResult extends UseGinkoSearchModalResult {
  /** The current search query string (two-way bindable). */
  query: Ref<string>
  /** Array of search result hits. */
  results: Ref<GinkoSearchHit[]>
  /** Whether a search request is currently in flight. */
  pending: Ref<boolean>
  /** Error message from the last failed search, or `null`. */
  error: Ref<string | null>
  /** Resets query, results, error, and pending state. Invalidates in-flight requests. */
  clear: () => void
}

function createModalState(): UseGinkoSearchModalResult {
  const isOpen = useState('ginko-search-open', () => false)
  const hostMountCount = useState('ginko-search-host-mount-count', () => 0)
  const pendingOpenRequest = useState('ginko-search-pending-open', () => false)
  const lastActionAt = useState('ginko-search-last-action-at', () => 0)

  const normalizeHostMountCount = () => {
    if (!Number.isFinite(hostMountCount.value) || hostMountCount.value < 0) {
      hostMountCount.value = 0
    }
  }

  const markAction = () => {
    lastActionAt.value = Date.now()
  }

  const isSearchModalHostReady = computed(() => hostMountCount.value > 0)

  const promotePendingOpenRequest = async () => {
    await nextTick()
    if (!pendingOpenRequest.value) {
      return
    }
    normalizeHostMountCount()
    if (hostMountCount.value <= 0) {
      return
    }
    pendingOpenRequest.value = false
    isOpen.value = true
    markAction()
  }

  const openSearch = () => {
    normalizeHostMountCount()
    if (hostMountCount.value > 0) {
      pendingOpenRequest.value = false
      isOpen.value = true
      markAction()
      return
    }
    pendingOpenRequest.value = true
    markAction()
  }

  const closeSearch = () => {
    pendingOpenRequest.value = false
    isOpen.value = false
    markAction()
  }

  const toggleSearch = () => {
    if (isOpen.value) {
      closeSearch()
      return
    }
    openSearch()
  }

  const resetSearchModalState = () => {
    normalizeHostMountCount()
    pendingOpenRequest.value = false
    isOpen.value = false
    markAction()
  }

  const registerSearchModalHost = () => {
    normalizeHostMountCount()
    hostMountCount.value += 1
    markAction()
    if (pendingOpenRequest.value) {
      void promotePendingOpenRequest()
    }
    let isRegistered = true
    return () => {
      if (!isRegistered) {
        return
      }
      isRegistered = false
      normalizeHostMountCount()
      hostMountCount.value = Math.max(0, hostMountCount.value - 1)
      if (hostMountCount.value === 0) {
        pendingOpenRequest.value = false
        isOpen.value = false
      }
      markAction()
    }
  }

  return {
    isOpen,
    isSearchModalHostReady,
    openSearch,
    closeSearch,
    toggleSearch,
    registerSearchModalHost,
    resetSearchModalState,
  }
}

/**
 * Full-text search composable with built-in modal state, debounce, and serial request handling.
 *
 * When called without a collection key, returns modal-only state for controlling the search UI.
 * When called with a collection key, also provides reactive query/results/pending/error state.
 *
 * @param collectionKey - Collection to search within, or omit for modal-only state.
 * @param options - Search behavior options (debounce, minLength, limit, locale).
 * @returns Modal-only result when no collection key; full search result otherwise.
 *
 * @example
 * ```ts
 * // Modal-only (e.g., in a layout)
 * const { isOpen, openSearch, closeSearch } = useGinkoSearch()
 *
 * // Full search
 * const { query, results, pending, clear } = useGinkoSearch('blog', {
 *   debounce: 220,
 *   minLength: 2,
 *   limit: 8,
 * })
 * ```
 */
export function useGinkoSearch(collectionKey?: string, options: UseGinkoSearchOptions = {}): UseGinkoSearchModalResult | UseGinkoSearchResult {
  const {
    debounce: debounceMs = 220,
    minLength = 2,
    limit = 12,
  } = options

  const modal = createModalState()

  if (!collectionKey) {
    return modal
  }

  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const requestFetch = useRequestFetch()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')

  const query = ref('')
  const results = ref<GinkoSearchHit[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined
  let requestSerial = 0

  const clear = () => {
    requestSerial += 1
    clearTimeout(debounceTimer)
    query.value = ''
    results.value = []
    error.value = null
    pending.value = false
  }

  const executeSearch = async (q: string) => {
    if (q.length < minLength) {
      results.value = []
      pending.value = false
      return
    }
    const serial = ++requestSerial
    pending.value = true
    error.value = null
    try {
      const payload = {
        op: 'search' as const,
        collectionKey: collectionKey ? String(collectionKey) : undefined,
        locale: resolvedLocale.value || undefined,
        search: { q, limit },
      }
      const response: any = await requestFetch(`${routeBase}/query`, {
        method: 'POST',
        body: payload,
      })
      if (serial !== requestSerial) {
        return
      }
      results.value = Array.isArray(response.data) ? response.data : []
    }
    catch (err) {
      if (serial !== requestSerial) {
        return
      }
      error.value = err instanceof Error ? err.message : String(err)
      results.value = []
    }
    finally {
      if (serial === requestSerial) {
        pending.value = false
      }
    }
  }

  watch(query, (q) => {
    clearTimeout(debounceTimer)
    if (q.length < minLength) {
      requestSerial += 1
      results.value = []
      error.value = null
      pending.value = false
      return
    }
    pending.value = true
    debounceTimer = setTimeout(() => executeSearch(q), debounceMs)
  })

  onScopeDispose(() => {
    requestSerial += 1
    clearTimeout(debounceTimer)
  })

  return {
    ...modal,
    query,
    results,
    pending,
    error,
    clear,
  }
}
