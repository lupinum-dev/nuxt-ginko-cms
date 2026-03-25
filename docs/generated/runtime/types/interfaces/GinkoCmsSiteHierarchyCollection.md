[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteHierarchyCollection

# Interface: GinkoCmsSiteHierarchyCollection

Defined in: [runtime/types/index.ts:96](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L96)

A hierarchy (tree-structured) collection with segment-based routing.

## Extends

- [`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md)

## Properties

### contentIdField?

> `optional` **contentIdField?**: `string`

Defined in: [runtime/types/index.ts:112](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L112)

Field name for the colocation folder ID in hierarchy items.

#### Default Value

`'colocationFolderId'`

***

### contentOrderField?

> `optional` **contentOrderField?**: `string`

Defined in: [runtime/types/index.ts:110](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L110)

Field name for sort ordering in hierarchy items.

#### Default Value

`'pageOrder'`

***

### contentSlugField?

> `optional` **contentSlugField?**: `string`

Defined in: [runtime/types/index.ts:106](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L106)

Field name for the content slug in hierarchy items.

#### Default Value

`'slug'`

***

### contentTitleField?

> `optional` **contentTitleField?**: `string`

Defined in: [runtime/types/index.ts:108](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L108)

Field name for the content title in hierarchy items.

#### Default Value

`'title'`

***

### getQuery?

> `optional` **getQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:60](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L60)

Reserved metadata for single-item queries (not currently applied by runtime).

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`getQuery`](GinkoCmsSiteCollectionCommon.md#getquery)

***

### includeFolders?

> `optional` **includeFolders?**: `boolean`

Defined in: [runtime/types/index.ts:104](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L104)

Whether to include folder nodes in navigation responses.

#### Default Value

`false`

***

### keyField?

> `optional` **keyField?**: `"id"` \| `"slug"`

Defined in: [runtime/types/index.ts:54](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L54)

Key field for sitemap generation helpers.

#### Default Value

`'id'`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`keyField`](GinkoCmsSiteCollectionCommon.md#keyfield)

***

### kind

> **kind**: `"hierarchy"`

Defined in: [runtime/types/index.ts:98](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L98)

Discriminator: this is a hierarchy collection.

***

### listQuery?

> `optional` **listQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:58](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L58)

Reserved metadata for list queries (not currently applied by runtime).

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`listQuery`](GinkoCmsSiteCollectionCommon.md#listquery)

***

### localized?

> `optional` **localized?**: `boolean`

Defined in: [runtime/types/index.ts:50](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L50)

Whether this collection supports localized content.

#### Default Value

`true`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`localized`](GinkoCmsSiteCollectionCommon.md#localized)

***

### maxDepth?

> `optional` **maxDepth?**: `number`

Defined in: [runtime/types/index.ts:102](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L102)

Maximum tree depth for navigation and surround queries.

#### Default Value

`5` (clamped 1–20)

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [runtime/types/index.ts:56](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L56)

Page size for sitemap generation helpers.

#### Default Value

`100`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`pageSize`](GinkoCmsSiteCollectionCommon.md#pagesize)

***

### routing

> **routing**: [`GinkoCmsSiteHierarchyRouting`](GinkoCmsSiteHierarchyRouting.md)

Defined in: [runtime/types/index.ts:100](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L100)

Routing configuration. One of `baseSegment` or `baseSegmentByLocale` is required.

***

### search?

> `optional` **search?**: [`GinkoCmsSiteCollectionSearch`](GinkoCmsSiteCollectionSearch.md)

Defined in: [runtime/types/index.ts:62](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L62)

Per-collection search configuration.

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`search`](GinkoCmsSiteCollectionCommon.md#search)

***

### slugField?

> `optional` **slugField?**: `string`

Defined in: [runtime/types/index.ts:52](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L52)

Field name used as the slug identifier for flat path resolution.

#### Default Value

`'slug'`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`slugField`](GinkoCmsSiteCollectionCommon.md#slugfield)

***

### source

> **source**: `string`

Defined in: [runtime/types/index.ts:48](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L48)

Upstream CMS collection slug. Required.

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`source`](GinkoCmsSiteCollectionCommon.md#source)
