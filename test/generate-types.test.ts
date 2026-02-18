import { describe, expect, it } from 'vitest'
import type { CollectionSchema, FieldSchema } from '../src/cli/generate-types-core'
import { generateTypesFile, mapFieldType } from '../src/cli/generate-types-core'

const collections: CollectionSchema[] = [
  {
    slug: 'authors',
    name: 'Authors',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true, localized: false },
    ],
  },
  {
    slug: 'blogs',
    name: 'Blogs',
    fields: [
      {
        key: 'author',
        label: 'Author',
        type: 'relation',
        required: true,
        localized: false,
        config: { collectionId: 'authors', multiple: false },
      },
    ],
  },
]

function field(overrides: Partial<FieldSchema>): FieldSchema {
  return {
    key: 'value',
    label: 'value',
    type: 'text',
    required: false,
    localized: false,
    ...overrides,
  }
}

describe('generate-types field mapping', () => {
  it('maps relation field to string | TargetType for single relation', () => {
    const relationField = field({
      type: 'relation',
      config: { collectionId: 'authors', multiple: false },
    })

    expect(mapFieldType(relationField, collections)).toBe('string | Authors')
  })

  it('maps relation field to array of string | TargetType for multi relation', () => {
    const relationField = field({
      type: 'relation',
      config: { collectionId: 'authors', multiple: true },
    })

    expect(mapFieldType(relationField, collections)).toBe('(string | Authors)[]')
  })

  it('maps unknown relation target to string fallback', () => {
    const singleUnknown = field({
      type: 'relation',
      config: { collectionId: 'missing-collection', multiple: false },
    })
    const multipleUnknown = field({
      type: 'relation',
      config: { collectionId: 'missing-collection', multiple: true },
    })

    expect(mapFieldType(singleUnknown, collections)).toBe('string')
    expect(mapFieldType(multipleUnknown, collections)).toBe('string[]')
  })

  it('maps richtext to string', () => {
    expect(mapFieldType(field({ type: 'richtext' }), collections)).toBe('string')
  })

  it('maps select and multiselect options to literal unions', () => {
    const selectField = field({
      type: 'select',
      config: { options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
    })
    const multiselectField = field({
      type: 'multiselect',
      config: { options: [{ value: 'news', label: 'News' }, { value: 'tech', label: 'Tech' }] },
    })

    expect(mapFieldType(selectField, collections)).toBe('\'draft\' | \'published\'')
    expect(mapFieldType(multiselectField, collections)).toBe('(\'news\' | \'tech\')[]')
  })
})

describe('generateTypesFile', () => {
  it('includes CmsCollectionTypes map with slug-to-type mapping', () => {
    const output = generateTypesFile(collections)

    expect(output).toContain('export interface CmsCollectionTypes {')
    expect(output).toContain('authors: Authors')
    expect(output).toContain('blogs: Blogs')
  })
})
