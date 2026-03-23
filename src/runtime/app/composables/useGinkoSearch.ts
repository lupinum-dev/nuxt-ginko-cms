import { useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig, useState } from "#imports";
import { computed, nextTick, onScopeDispose, ref, watch } from "vue";
import { resolveGinkoLocale } from "./_ginkoUtils.js";
function createModalState() {
  const isOpen = useState("ginko-search-open", () => false);
  const hostMountCount = useState("ginko-search-host-mount-count", () => 0);
  const pendingOpenRequest = useState("ginko-search-pending-open", () => false);
  const lastActionAt = useState("ginko-search-last-action-at", () => 0);
  const normalizeHostMountCount = () => {
    if (!Number.isFinite(hostMountCount.value) || hostMountCount.value < 0) {
      hostMountCount.value = 0;
    }
  };
  const markAction = () => {
    lastActionAt.value = Date.now();
  };
  const isSearchModalHostReady = computed(() => hostMountCount.value > 0);
  const promotePendingOpenRequest = async () => {
    await nextTick();
    if (!pendingOpenRequest.value) {
      return;
    }
    normalizeHostMountCount();
    if (hostMountCount.value <= 0) {
      return;
    }
    pendingOpenRequest.value = false;
    isOpen.value = true;
    markAction();
  };
  const openSearch = () => {
    normalizeHostMountCount();
    if (hostMountCount.value > 0) {
      pendingOpenRequest.value = false;
      isOpen.value = true;
      markAction();
      return;
    }
    pendingOpenRequest.value = true;
    markAction();
  };
  const closeSearch = () => {
    pendingOpenRequest.value = false;
    isOpen.value = false;
    markAction();
  };
  const toggleSearch = () => {
    if (isOpen.value) {
      closeSearch();
      return;
    }
    openSearch();
  };
  const resetSearchModalState = () => {
    normalizeHostMountCount();
    pendingOpenRequest.value = false;
    isOpen.value = false;
    markAction();
  };
  const registerSearchModalHost = () => {
    normalizeHostMountCount();
    hostMountCount.value += 1;
    markAction();
    if (pendingOpenRequest.value) {
      void promotePendingOpenRequest();
    }
    let isRegistered = true;
    return () => {
      if (!isRegistered) {
        return;
      }
      isRegistered = false;
      normalizeHostMountCount();
      hostMountCount.value = Math.max(0, hostMountCount.value - 1);
      if (hostMountCount.value === 0) {
        pendingOpenRequest.value = false;
        isOpen.value = false;
      }
      markAction();
    };
  };
  return {
    isOpen,
    isSearchModalHostReady,
    openSearch,
    closeSearch,
    toggleSearch,
    registerSearchModalHost,
    resetSearchModalState
  };
}
export function useGinkoSearch(collectionKey, options = {}) {
  const {
    debounce: debounceMs = 220,
    minLength = 2,
    limit = 12
  } = options;
  const modal = createModalState();
  if (!collectionKey) {
    return modal;
  }
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const requestFetch = useRequestFetch();
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig);
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || "/api/ginko").replace(/\/$/, "");
  const query = ref("");
  const results = ref([]);
  const pending = ref(false);
  const error = ref(null);
  let debounceTimer;
  let requestSerial = 0;
  const clear = () => {
    requestSerial += 1;
    clearTimeout(debounceTimer);
    query.value = "";
    results.value = [];
    error.value = null;
    pending.value = false;
  };
  const executeSearch = async (q) => {
    if (q.length < minLength) {
      results.value = [];
      pending.value = false;
      return;
    }
    const serial = ++requestSerial;
    pending.value = true;
    error.value = null;
    try {
      const payload = {
        op: "search",
        collectionKey: collectionKey ? String(collectionKey) : void 0,
        locale: resolvedLocale.value || void 0,
        search: { q, limit }
      };
      const response = await requestFetch(`${routeBase}/query`, {
        method: "POST",
        body: payload
      });
      if (serial !== requestSerial) {
        return;
      }
      results.value = Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      if (serial !== requestSerial) {
        return;
      }
      error.value = err instanceof Error ? err.message : String(err);
      results.value = [];
    } finally {
      if (serial === requestSerial) {
        pending.value = false;
      }
    }
  };
  watch(query, (q) => {
    clearTimeout(debounceTimer);
    if (q.length < minLength) {
      requestSerial += 1;
      results.value = [];
      error.value = null;
      pending.value = false;
      return;
    }
    pending.value = true;
    debounceTimer = setTimeout(() => executeSearch(q), debounceMs);
  });
  onScopeDispose(() => {
    requestSerial += 1;
    clearTimeout(debounceTimer);
  });
  return {
    ...modal,
    query,
    results,
    pending,
    error,
    clear
  };
}
