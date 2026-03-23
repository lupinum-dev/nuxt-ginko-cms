import { useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from "#imports";
import { isPopulateSupportedOperation, normalizePopulateFields } from "../../shared/query-populate.js";
function asString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : void 0;
}
function unrefValue(value) {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (!("value" in value)) {
    return value;
  }
  return value.value;
}
function assertPopulateSupported(op, state) {
  if (!state.populate?.length) {
    return;
  }
  if (isPopulateSupportedOperation(op)) {
    return;
  }
  throw new Error(`[ginko-cms] populate() is not supported for ${op}()`);
}
export function queryGinko(collectionKey) {
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();
  const nuxtApp = useNuxtApp();
  const requestFetch = useRequestFetch();
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || "/api/ginko").replace(/\/$/, "");
  const resolveLocale = (explicitLocale) => {
    if (explicitLocale === null) {
      return null;
    }
    if (typeof explicitLocale === "string" && explicitLocale.trim()) {
      return explicitLocale.trim();
    }
    const i18nLocale = asString(unrefValue(nuxtApp.$i18n?.locale));
    if (i18nLocale) {
      return i18nLocale;
    }
    const routeLocale = asString(route.params?.locale);
    if (routeLocale) {
      return routeLocale;
    }
    return asString(runtimeConfig.public.ginkoCms?.locale);
  };
  const request = async (payload) => {
    const response = await requestFetch(`${routeBase}/query`, {
      method: "POST",
      body: payload
    });
    return response.data;
  };
  const createBuilder = (state) => {
    const withState = (next) => createBuilder({
      ...state,
      ...next
    });
    const toPayload = (op) => {
      assertPopulateSupported(op, state);
      return {
        op,
        collectionKey: state.collectionKey,
        path: state.path,
        where: state.where,
        sort: state.sort,
        limit: state.limit,
        offset: state.offset,
        locale: resolveLocale(state.locale),
        includeBody: state.includeBody,
        populate: state.populate
      };
    };
    return {
      path: (path) => withState({ path }),
      where: (filters) => withState({ where: { ...state.where || {}, ...filters } }),
      sort: (field, dir = "asc") => withState({ sort: { field, dir } }),
      limit: (n) => withState({ limit: Math.max(1, Math.floor(n)) }),
      offset: (n) => withState({ offset: Math.max(0, Math.floor(n)) }),
      locale: (code) => withState({ locale: code }),
      includeBody: (enabled = true) => withState({ includeBody: enabled }),
      populate: (fields) => {
        const merged = [.../* @__PURE__ */ new Set([...state.populate || [], ...normalizePopulateFields(fields)])];
        return withState({ populate: merged });
      },
      find: async () => {
        return await request(toPayload("find"));
      },
      first: async () => {
        return await request(toPayload("first"));
      },
      navigation: async () => {
        return await request(toPayload("navigation"));
      },
      surround: async (path) => {
        return await request({
          ...toPayload("surround"),
          surround: {
            path
          }
        });
      },
      search: async (query, options = {}) => {
        return await request({
          ...toPayload("search"),
          search: {
            q: query,
            limit: options.limit
          }
        });
      },
      pathBy: async (input) => {
        return await request({
          ...toPayload("pathBy"),
          pathBy: input
        });
      }
    };
  };
  return createBuilder({
    collectionKey: collectionKey ? String(collectionKey) : void 0
  });
}
