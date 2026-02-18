export interface FieldSchema {
  key: string
  label: string
  type: string
  required: boolean
  localized: boolean
  config?: {
    collectionId?: string
    options?: Array<{ value: string, label: string }>
    multiple?: boolean
    [key: string]: unknown
  }
}

export interface CollectionSchema {
  slug: string
  name: string
  fields: FieldSchema[]
}

/**
 * Convert collection slug to PascalCase type name.
 */
export function slugToTypeName(slug: string): string {
  return slug
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * Map CMS field type to TypeScript type.
 */
export function mapFieldType(field: FieldSchema, allCollections: CollectionSchema[]): string {
  const { type, config } = field

  switch (type) {
    case 'text':
    case 'richtext':
    case 'slug':
      return 'string'

    case 'number':
      return 'number'

    case 'boolean':
      return 'boolean'

    case 'date':
    case 'datetime':
      return 'number'

    case 'image':
      return 'string'

    case 'select': {
      if (config?.options && Array.isArray(config.options)) {
        const values = config.options.map(opt => `'${opt.value}'`).join(' | ')
        return values || 'string'
      }
      return 'string'
    }

    case 'multiselect': {
      if (config?.options && Array.isArray(config.options)) {
        const values = config.options.map(opt => `'${opt.value}'`).join(' | ')
        return `(${values || 'string'})[]`
      }
      return 'string[]'
    }

    case 'relation': {
      if (config?.collectionId) {
        const targetCollection = allCollections.find(c =>
          c.slug === config.collectionId || String(config.collectionId).includes(c.slug),
        )
        if (targetCollection) {
          const targetTypeName = slugToTypeName(targetCollection.slug)
          if (config?.multiple) {
            return `(string | ${targetTypeName})[]`
          }
          return `string | ${targetTypeName}`
        }
      }
      if (config?.multiple) {
        return 'string[]'
      }
      return 'string'
    }

    case 'json':
      return 'unknown'

    case 'array':
      return 'unknown[]'

    default:
      return 'unknown'
  }
}

/**
 * Generate TypeScript interface for a collection.
 */
export function generateCollectionInterface(
  collection: CollectionSchema,
  allCollections: CollectionSchema[],
): string {
  const typeName = slugToTypeName(collection.slug)
  const lines: string[] = []

  lines.push(`export interface ${typeName} extends CmsItem {`)

  for (const field of collection.fields) {
    if (['id', 'slug', 'status', 'publishedAt', 'createdAt', 'updatedAt', '_locale', '_fallback'].includes(field.key)) {
      continue
    }

    const tsType = mapFieldType(field, allCollections)
    const optional = !field.required ? '?' : ''

    if (field.label && field.label !== field.key) {
      lines.push(`  /** ${field.label} */`)
    }

    lines.push(`  ${field.key}${optional}: ${tsType}`)
  }

  lines.push('}')

  return lines.join('\n')
}

/**
 * Generate the full types file.
 */
export function generateTypesFile(schemas: CollectionSchema[]): string {
  const lines: string[] = []

  lines.push('// Auto-generated from CMS schema - DO NOT EDIT')
  lines.push(`// Generated at: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('import type { CmsItem } from \'ginko-nuxt\'')
  lines.push('')

  for (const collection of schemas) {
    lines.push(generateCollectionInterface(collection, schemas))
    lines.push('')
  }

  lines.push('/**')
  lines.push(' * Type map for collection slugs to their item types')
  lines.push(' * Use with generic composables: useCmsCollection<CmsCollectionTypes[\'blogs\']>()')
  lines.push(' */')
  lines.push('export interface CmsCollectionTypes {')
  for (const collection of schemas) {
    const typeName = slugToTypeName(collection.slug)
    lines.push(`  ${collection.slug}: ${typeName}`)
  }
  lines.push('}')
  lines.push('')

  return lines.join('\n')
}
