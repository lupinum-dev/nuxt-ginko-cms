import { asRecord as toRecord, asString } from '../../../type-guards'

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

  const topLevelBody = asString(normalized.body)
  if (topLevelBody && !asString(normalized.content)) {
    normalized.content = topLevelBody
  }

  const nestedBodyField = asString(nestedContent.body)
  if (nestedBodyField && !asString(normalized.content)) {
    normalized.content = nestedBodyField
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

  if (options.includeBody === true && options.op !== 'page' && !asString(item.content)) {
    throw new Error(
      `[ginko-cms] Invalid public item payload for ${options.collectionSource} ${options.op}(): includeBody requested but top-level content is missing. Check NUXT_GINKO_CMS_BASE and the public delivery deployment.`,
    )
  }

  return item
}
