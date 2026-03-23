import { createError, getQuery } from "h3";
import { useRuntimeConfig } from "#imports";
function getGlobalStore() {
  const globalScope = globalThis;
  if (!globalScope.__ginkoCmsNuxtCache) {
    globalScope.__ginkoCmsNuxtCache = {
      contextCache: /* @__PURE__ */ new Map(),
      inflightContext: /* @__PURE__ */ new Map()
    };
  }
  return globalScope.__ginkoCmsNuxtCache;
}
function normalizeBaseUrl(value) {
  if (!value) {
    throw createError({ statusCode: 500, statusMessage: "[ginko-cms] Missing ginkoCms.base runtime config" });
  }
  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw createError({ statusCode: 500, statusMessage: "[ginko-cms] Invalid ginkoCms.base protocol" });
  }
  parsed.pathname = "/";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}
export function getGinkoCmsConfig(event) {
  const runtimeConfig = useRuntimeConfig(event);
  const key = String(runtimeConfig.ginkoCms?.key || "").trim();
  if (!key) {
    throw createError({
      statusCode: 500,
      statusMessage: "[ginko-cms] Missing NUXT_GINKO_CMS_KEY (runtimeConfig.ginkoCms.key)"
    });
  }
  return {
    key,
    base: normalizeBaseUrl(String(runtimeConfig.ginkoCms?.base || "https://site.ginko-cms.com")),
    locale: String(runtimeConfig.ginkoCms?.locale || "").trim() || void 0,
    timeoutMs: Number(runtimeConfig.ginkoCms?.timeoutMs || 8e3),
    contextTtlMs: Number(runtimeConfig.ginkoCms?.contextTtlMs || 3e5)
  };
}
function buildUpstreamUrl(base, path, query) {
  if (!path.startsWith("/api/")) {
    throw createError({ statusCode: 500, statusMessage: "[ginko-cms] Invalid upstream path" });
  }
  const target = new URL(path, base);
  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === null || rawValue === void 0 || rawValue === "") {
      continue;
    }
    if (Array.isArray(rawValue)) {
      target.searchParams.set(key, rawValue.join(","));
      continue;
    }
    target.searchParams.set(key, String(rawValue));
  }
  return target;
}
function shouldRetryStatus(status) {
  return status === 429 || status >= 500;
}
async function fetchWithRetry(url, init, timeoutMs) {
  const attempts = 2;
  let lastError = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!shouldRetryStatus(response.status) || attempt === attempts - 1) {
        return response;
      }
      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt === attempts - 1) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }
  const message = lastError instanceof Error ? lastError.message : String(lastError || "unknown");
  throw createError({
    statusCode: 502,
    statusMessage: `[ginko-cms] Upstream request failed: ${message}`
  });
}
export async function fetchGinkoCmsJson(event, path, query = {}) {
  const config = getGinkoCmsConfig(event);
  const url = buildUpstreamUrl(config.base, path, query);
  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.key}`,
      Accept: "application/json"
    }
  }, config.timeoutMs);
  const rawBody = await response.text();
  if (!rawBody.trim()) {
    throw createError({
      statusCode: 502,
      statusMessage: `[ginko-cms] Upstream returned empty response (${response.status}) for ${url.pathname}`
    });
  }
  let parsed;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    const snippet = rawBody.replace(/\s+/g, " ").trim().slice(0, 160);
    throw createError({
      statusCode: 502,
      statusMessage: `[ginko-cms] Upstream returned non-JSON (${response.status}) for ${url.pathname}. Check NUXT_GINKO_CMS_BASE and v2 deployment. Body: ${snippet || "<empty>"}`
    });
  }
  return {
    status: response.status,
    headers: response.headers,
    body: parsed
  };
}
export async function getCachedGinkoCmsContext(event) {
  const config = getGinkoCmsConfig(event);
  const cacheKey = `${config.base}::${config.key}`;
  const now = Date.now();
  const store = getGlobalStore();
  const cached = store.contextCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }
  const inflight = store.inflightContext.get(cacheKey);
  if (inflight) {
    return inflight;
  }
  const request = (async () => {
    const result = await fetchGinkoCmsJson(event, "/api/v2/cms/context");
    if (result.status !== 200) {
      throw createError({
        statusCode: result.status,
        statusMessage: `[ginko-cms] Failed to resolve context (${result.status})`
      });
    }
    const ttlSeconds = Number(result.body.meta?.cacheTtl || Math.max(Math.floor(config.contextTtlMs / 1e3), 60));
    store.contextCache.set(cacheKey, {
      expiresAt: Date.now() + ttlSeconds * 1e3,
      value: result.body
    });
    return result.body;
  })().finally(() => {
    store.inflightContext.delete(cacheKey);
  });
  store.inflightContext.set(cacheKey, request);
  return request;
}
export function resolveLocale(event, context) {
  const query = getQuery(event);
  if (typeof query.locale === "string" && query.locale.trim()) {
    return query.locale.trim();
  }
  const config = getGinkoCmsConfig(event);
  if (config.locale?.trim()) {
    return config.locale.trim();
  }
  return context.data.locale.default || "en";
}
