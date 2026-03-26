export function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return void 0
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : void 0
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : void 0
}

export function asBoolean(value: unknown): boolean {
  return value === true
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }
  return value as Record<string, unknown>
}

export function asChildren(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((entry: unknown) => !!entry && typeof entry === 'object') as Record<string, unknown>[]
}
