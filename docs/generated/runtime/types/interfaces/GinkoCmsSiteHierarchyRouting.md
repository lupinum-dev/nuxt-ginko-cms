[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteHierarchyRouting

# Interface: GinkoCmsSiteHierarchyRouting

Defined in: [runtime/types/index.ts:76](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L76)

Routing configuration for hierarchy (tree-structured) collections. Exactly one base mode must be set.

## Properties

### baseSegment?

> `optional` **baseSegment?**: `string`

Defined in: [runtime/types/index.ts:78](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L78)

Base URL segment for all locales (e.g., `'wiki'`).

***

### baseSegmentByLocale?

> `optional` **baseSegmentByLocale?**: `Record`\<`string`, `string`\>

Defined in: [runtime/types/index.ts:80](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L80)

Locale-specific base URL segments (e.g., `{ de: 'wiki', en: 'docs' }`).

***

### rootSlug?

> `optional` **rootSlug?**: `string`

Defined in: [runtime/types/index.ts:82](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L82)

Slug of the root document to alias onto the collection base path.

***

### rootSlugByLocale?

> `optional` **rootSlugByLocale?**: `Record`\<`string`, `string`\>

Defined in: [runtime/types/index.ts:84](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L84)

Locale-specific root document slugs.
