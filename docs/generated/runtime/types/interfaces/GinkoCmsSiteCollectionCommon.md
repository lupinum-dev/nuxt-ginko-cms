[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteCollectionCommon

# Interface: GinkoCmsSiteCollectionCommon

Defined in: [runtime/types/index.ts:46](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L46)

Fields common to both flat and hierarchy collections.

## Extended by

- [`GinkoCmsSiteFlatCollection`](GinkoCmsSiteFlatCollection.md)
- [`GinkoCmsSiteHierarchyCollection`](GinkoCmsSiteHierarchyCollection.md)

## Properties

### getQuery?

> `optional` **getQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:60](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L60)

Reserved metadata for single-item queries (not currently applied by runtime).

***

### keyField?

> `optional` **keyField?**: `"id"` \| `"slug"`

Defined in: [runtime/types/index.ts:54](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L54)

Key field for sitemap generation helpers.

#### Default Value

`'id'`

***

### listQuery?

> `optional` **listQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:58](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L58)

Reserved metadata for list queries (not currently applied by runtime).

***

### localized?

> `optional` **localized?**: `boolean`

Defined in: [runtime/types/index.ts:50](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L50)

Whether this collection supports localized content.

#### Default Value

`true`

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [runtime/types/index.ts:56](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L56)

Page size for sitemap generation helpers.

#### Default Value

`100`

***

### search?

> `optional` **search?**: [`GinkoCmsSiteCollectionSearch`](GinkoCmsSiteCollectionSearch.md)

Defined in: [runtime/types/index.ts:62](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L62)

Per-collection search configuration.

***

### slugField?

> `optional` **slugField?**: `string`

Defined in: [runtime/types/index.ts:52](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L52)

Field name used as the slug identifier for flat path resolution.

#### Default Value

`'slug'`

***

### source

> **source**: `string`

Defined in: [runtime/types/index.ts:48](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L48)

Upstream CMS collection slug. Required.
