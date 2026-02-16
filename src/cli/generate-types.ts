#!/usr/bin/env node
/**
 * CLI command to generate TypeScript types from CMS schema
 *
 * Usage:
 *   npx cms-nuxt generate-types
 *   npx cms-nuxt generate-types --output ./types/cms.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'

interface FieldSchema {
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

interface CollectionSchema {
  slug: string
  name: string
  fields: FieldSchema[]
}

interface GenerateTypesOptions {
  apiUrl: string
  apiKey: string
  teamSlug: string
  outputPath: string
}

/**
 * Convert collection slug to PascalCase type name
 */
function slugToTypeName(slug: string): string {
  return slug
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * Map CMS field type to TypeScript type
 */
function mapFieldType(field: FieldSchema, allCollections: CollectionSchema[]): string {
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
      return 'number' // Unix timestamp

    case 'image':
      return 'string' // Asset URL or ID

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
      // Find the target collection to get its type name
      if (config?.collectionId) {
        const targetCollection = allCollections.find(c =>
          // Match by _id (from API) - the config stores the collection ID
          c.slug === config.collectionId || String(config.collectionId).includes(c.slug),
        )
        if (targetCollection) {
          const targetTypeName = slugToTypeName(targetCollection.slug)
          // Relation can be ID (string) or populated object
          if (config?.multiple) {
            return `(string | ${targetTypeName})[]`
          }
          return `string | ${targetTypeName}`
        }
      }
      // Fallback: unknown relation target
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
 * Generate TypeScript interface for a collection
 */
function generateCollectionInterface(
  collection: CollectionSchema,
  allCollections: CollectionSchema[],
): string {
  const typeName = slugToTypeName(collection.slug)
  const lines: string[] = []

  lines.push(`export interface ${typeName} extends CmsItem {`)

  for (const field of collection.fields) {
    // Skip system fields that are already in CmsItem base
    if (['id', 'slug', 'status', 'publishedAt', 'createdAt', 'updatedAt', '_locale', '_fallback'].includes(field.key)) {
      continue
    }

    const tsType = mapFieldType(field, allCollections)
    const optional = !field.required ? '?' : ''

    // Add JSDoc comment
    if (field.label && field.label !== field.key) {
      lines.push(`  /** ${field.label} */`)
    }

    lines.push(`  ${field.key}${optional}: ${tsType}`)
  }

  lines.push('}')

  return lines.join('\n')
}

/**
 * Generate the full types file
 */
function generateTypesFile(schemas: CollectionSchema[]): string {
  const lines: string[] = []

  // Header
  lines.push('// Auto-generated from CMS schema - DO NOT EDIT')
  lines.push(`// Generated at: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('import type { CmsItem } from \'ginko-nuxt\'')
  lines.push('')

  // Generate interfaces for each collection
  for (const collection of schemas) {
    lines.push(generateCollectionInterface(collection, schemas))
    lines.push('')
  }

  // Generate type map for collection slugs
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

/**
 * Fetch schemas from CMS API
 */
async function fetchSchemas(options: GenerateTypesOptions): Promise<CollectionSchema[]> {
  const url = `${options.apiUrl}/api/v1/cms/${options.teamSlug}/schema`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}\n${text}`)
  }

  const json = await response.json() as { data: CollectionSchema[] }
  return json.data
}

/**
 * Load config from nuxt.config.ts or environment
 */
function loadConfig(): Partial<GenerateTypesOptions> {
  const cwd = process.cwd()

  // Try to load from environment variables
  const envConfig: Partial<GenerateTypesOptions> = {
    apiUrl: process.env.NUXT_CMS_API_URL,
    apiKey: process.env.NUXT_CMS_API_KEY_PREVIEW || process.env.NUXT_CMS_API_KEY,
    teamSlug: process.env.NUXT_CMS_TEAM_SLUG,
  }

  // Try to read nuxt.config.ts for additional config
  const nuxtConfigPath = join(cwd, 'nuxt.config.ts')
  if (existsSync(nuxtConfigPath)) {
    try {
      const content = readFileSync(nuxtConfigPath, 'utf-8')

      // Simple regex extraction (not perfect but works for common cases)
      const apiUrlMatch = content.match(/apiUrl:\s*['"]([^'"]+)['"]/)
      const teamSlugMatch = content.match(/teamSlug:\s*['"]([^'"]+)['"]/)

      if (apiUrlMatch && !envConfig.apiUrl) {
        envConfig.apiUrl = apiUrlMatch[1]
      }
      if (teamSlugMatch && !envConfig.teamSlug) {
        envConfig.teamSlug = teamSlugMatch[1]
      }
    }
    catch {
      // Ignore config parsing errors
    }
  }

  return envConfig
}

/**
 * Parse command line arguments
 */
function parseArgs(): { output?: string, help: boolean } {
  const args = process.argv.slice(2)
  let output: string | undefined
  let help = false

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--output' || arg === '-o') {
      output = args[++i]
    }
    else if (arg === '--help' || arg === '-h') {
      help = true
    }
  }

  return { output, help }
}

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  const { output, help } = parseArgs()

  if (help) {
    console.log(`
Usage: npx cms-nuxt generate-types [options]

Options:
  -o, --output <path>  Output file path (default: ./app/types/cms.generated.ts)
  -h, --help           Show this help message

Environment variables:
  NUXT_CMS_API_URL          CMS API URL (e.g., https://xxx.convex.site)
  NUXT_CMS_API_KEY_PREVIEW  CMS API key with preview access
  NUXT_CMS_API_KEY          CMS API key (fallback)
  NUXT_CMS_TEAM_SLUG        Team slug in the CMS

The command will also try to read configuration from nuxt.config.ts.
`)
    process.exit(0)
  }

  console.log('🔍 Loading configuration...')
  const config = loadConfig()

  if (!config.apiUrl) {
    console.error('❌ Missing API URL. Set NUXT_CMS_API_URL or configure apiUrl in nuxt.config.ts')
    process.exit(1)
  }
  if (!config.apiKey) {
    console.error('❌ Missing API key. Set NUXT_CMS_API_KEY_PREVIEW or NUXT_CMS_API_KEY')
    process.exit(1)
  }
  if (!config.teamSlug) {
    console.error('❌ Missing team slug. Set NUXT_CMS_TEAM_SLUG or configure teamSlug in nuxt.config.ts')
    process.exit(1)
  }

  const outputPath = output || './app/types/cms.generated.ts'

  console.log(`📡 Fetching schema from ${config.apiUrl}...`)

  try {
    const schemas = await fetchSchemas({
      apiUrl: config.apiUrl,
      apiKey: config.apiKey,
      teamSlug: config.teamSlug,
      outputPath,
    })

    console.log(`📦 Found ${schemas.length} collections:`)
    for (const schema of schemas) {
      console.log(`   - ${schema.slug} (${schema.fields.length} fields)`)
    }

    const typesContent = generateTypesFile(schemas)

    // Ensure output directory exists
    const outputDir = dirname(resolve(process.cwd(), outputPath))
    mkdirSync(outputDir, { recursive: true })

    // Write the file
    const fullPath = resolve(process.cwd(), outputPath)
    writeFileSync(fullPath, typesContent, 'utf-8')

    console.log(`✅ Generated types at: ${fullPath}`)
  }
  catch (error) {
    console.error('❌ Failed to generate types:', error)
    process.exit(1)
  }
}

// Run CLI
main()
