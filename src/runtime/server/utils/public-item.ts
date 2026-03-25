function asString(value: unknown) {
  if (typeof value !== 'string') {
    return void 0
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : void 0
}

function toRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }
  return value as Record<string, unknown>
}

export function normalizePublicItem(raw: unknown) {
  const record = toRecord(raw)
  const nestedContent = toRecord(record.content)
  const normalized: Record<string, unknown> = {
    ...record,
  }

  for (const [key, value] of Object.entries(nestedContent)) {
    if (normalized[key] === null || normalized[key] === void 0 || normalized[key] === '') {
      normalized[key] = value
    }
  }

  const nestedBody = asString(nestedContent.content)
  if (nestedBody && !asString(normalized.content)) {
    normalized.content = nestedBody
  }

  return normalized
}

export function assertValidPublicItem(raw: unknown, options: {
  collectionSource: string
  op: 'find' | 'first' | 'page'
  includeBody?: boolean
}) {
  const item = normalizePublicItem(raw)
  if (!asString(item.title)) {
    throw new Error(
      `[ginko-cms] Invalid public item payload for ${options.collectionSource} ${options.op}(): missing top-level title. Check NUXT_GINKO_CMS_BASE and the public delivery deployment.`,
    )
  }

  if (options.includeBody === true && !asString(item.content)) {
    throw new Error(
      `[ginko-cms] Invalid public item payload for ${options.collectionSource} ${options.op}(): includeBody requested but top-level content is missing. Check NUXT_GINKO_CMS_BASE and the public delivery deployment.`,
    )
  }

  return item
}
