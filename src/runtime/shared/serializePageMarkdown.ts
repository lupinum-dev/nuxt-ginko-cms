/**
 * Serializes a CMS page item into frontmatter + MDC body markdown string.
 *
 * @param item - The page data object (flat key-value fields)
 * @param bodyField - The field name containing MDC body content (default: 'body')
 * @returns Markdown string with YAML frontmatter and body
 */
export function serializePageMarkdown(
  item: Record<string, unknown>,
  bodyField = 'body',
  fields?: string[],
): string {
  const body = typeof item[bodyField] === 'string' ? (item[bodyField] as string) : ''
  const frontmatterFields: Record<string, unknown> = {}

  if (fields && fields.length > 0) {
    for (const key of fields) {
      const value = item[key]
      if (value === null || value === undefined)
        continue
      frontmatterFields[key] = value
    }
  }

  const yamlLines = serializeYamlLines(frontmatterFields)
  const frontmatter = yamlLines.length > 0 ? `---\n${yamlLines.join('\n')}\n---` : ''
  const trimmedBody = body.trim()

  if (!frontmatter && !trimmedBody)
    return ''
  if (!frontmatter)
    return trimmedBody
  if (!trimmedBody)
    return frontmatter

  return `${frontmatter}\n\n${trimmedBody}`
}

function serializeYamlLines(obj: Record<string, unknown>, indent = 0): string[] {
  const prefix = '  '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined)
      continue

    if (Array.isArray(value)) {
      if (value.length === 0)
        continue
      lines.push(`${prefix}${key}:`)
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          const nested = serializeYamlLines(item as Record<string, unknown>, indent + 2)
          if (nested.length > 0) {
            lines.push(`${prefix}- ${nested[0].trimStart()}`)
            for (const n of nested.slice(1))
              lines.push(`${prefix}  ${n.trimStart()}`)
          }
        }
        else {
          lines.push(`${prefix}- ${formatYamlValue(item)}`)
        }
      }
    }
    else if (typeof value === 'object') {
      const nested = serializeYamlLines(value as Record<string, unknown>, indent + 1)
      if (nested.length > 0) {
        lines.push(`${prefix}${key}:`)
        lines.push(...nested)
      }
    }
    else {
      lines.push(`${prefix}${key}: ${formatYamlValue(value)}`)
    }
  }

  return lines
}

function formatYamlValue(value: unknown): string {
  if (typeof value === 'string') {
    if (value === '' || /[:#{}[\],&*?|>!%@`]/.test(value) || value !== value.trim())
      return JSON.stringify(value)
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  return JSON.stringify(value)
}
