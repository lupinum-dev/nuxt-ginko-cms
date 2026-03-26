import type { GinkoQueryOperation } from '../types/api'
import { asString } from '../../type-guards'

export function normalizePopulateFields(fields: unknown): string[] {
  if (!fields) {
    return []
  }
  const input = Array.isArray(fields) ? fields : [fields]
  return [...new Set(input.map(value => asString(value)).filter((value): value is string => Boolean(value)))]
}
export function isPopulateSupportedOperation(op: GinkoQueryOperation): boolean {
  return op === 'first' || op === 'find' || op === 'page'
}
