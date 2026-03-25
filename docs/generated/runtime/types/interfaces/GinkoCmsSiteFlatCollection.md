[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteFlatCollection

# Interface: GinkoCmsSiteFlatCollection

Defined in: [runtime/types/index.ts:88](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L88)

A flat (non-hierarchical) collection with prefix-based routing.

## Extends

- [`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md)

## Properties

### getQuery?

> `optional` **getQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:60](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L60)

Reserved metadata for single-item queries (not currently applied by runtime).

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`getQuery`](GinkoCmsSiteCollectionCommon.md#getquery)

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

> **kind**: `"flat"`

Defined in: [runtime/types/index.ts:90](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L90)

Discriminator: this is a flat collection.

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

> **routing**: [`GinkoCmsSiteFlatRouting`](GinkoCmsSiteFlatRouting.md)

Defined in: [runtime/types/index.ts:92](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L92)

Routing configuration. One of `prefix`, `prefixByLocale`, or `pathMapByLocale` is required.

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
