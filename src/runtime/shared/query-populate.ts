function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return void 0
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : void 0
}
export function normalizePopulateFields(fields: unknown): string[] {
  if (!fields) {
    return []
  }
  const input = Array.isArray(fields) ? fields : [fields]
  return [...new Set(input.map(value => asString(value)).filter((value): value is string => Boolean(value)))]
}
export function isPopulateSupportedOperation(op: string): boolean {
  return op === 'first' || op === 'find' || op === 'page'
}
