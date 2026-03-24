[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteHierarchyCollection

# Interface: GinkoCmsSiteHierarchyCollection

Defined in: [runtime/types/index.ts:95](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L95)

A hierarchy (tree-structured) collection with segment-based routing.

## Extends

- [`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md)

## Properties

### contentIdField?

> `optional` **contentIdField?**: `string`

Defined in: [runtime/types/index.ts:111](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L111)

Field name for the colocation folder ID in hierarchy items.

#### Default Value

`'colocationFolderId'`

***

### contentOrderField?

> `optional` **contentOrderField?**: `string`

Defined in: [runtime/types/index.ts:109](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L109)

Field name for sort ordering in hierarchy items.

#### Default Value

`'pageOrder'`

***

### contentSlugField?

> `optional` **contentSlugField?**: `string`

Defined in: [runtime/types/index.ts:105](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L105)

Field name for the content slug in hierarchy items.

#### Default Value

`'slug'`

***

### contentTitleField?

> `optional` **contentTitleField?**: `string`

Defined in: [runtime/types/index.ts:107](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L107)

Field name for the content title in hierarchy items.

#### Default Value

`'title'`

***

### getQuery?

> `optional` **getQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:59](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L59)

Reserved metadata for single-item queries (not currently applied by runtime).

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`getQuery`](GinkoCmsSiteCollectionCommon.md#getquery)

***

### includeFolders?

> `optional` **includeFolders?**: `boolean`

Defined in: [runtime/types/index.ts:103](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L103)

Whether to include folder nodes in navigation responses.

#### Default Value

`false`

***

### keyField?

> `optional` **keyField?**: `"id"` \| `"slug"`

Defined in: [runtime/types/index.ts:53](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L53)

Key field for sitemap generation helpers.

#### Default Value

`'id'`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`keyField`](GinkoCmsSiteCollectionCommon.md#keyfield)

***

### kind

> **kind**: `"hierarchy"`

Defined in: [runtime/types/index.ts:97](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L97)

Discriminator: this is a hierarchy collection.

***

### listQuery?

> `optional` **listQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:57](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L57)

Reserved metadata for list queries (not currently applied by runtime).

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`listQuery`](GinkoCmsSiteCollectionCommon.md#listquery)

***

### localized?

> `optional` **localized?**: `boolean`

Defined in: [runtime/types/index.ts:49](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L49)

Whether this collection supports localized content.

#### Default Value

`true`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`localized`](GinkoCmsSiteCollectionCommon.md#localized)

***

### maxDepth?

> `optional` **maxDepth?**: `number`

Defined in: [runtime/types/index.ts:101](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L101)

Maximum tree depth for navigation and surround queries.

#### Default Value

`5` (clamped 1–20)

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [runtime/types/index.ts:55](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L55)

Page size for sitemap generation helpers.

#### Default Value

`100`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`pageSize`](GinkoCmsSiteCollectionCommon.md#pagesize)

***

### routing

> **routing**: [`GinkoCmsSiteHierarchyRouting`](GinkoCmsSiteHierarchyRouting.md)

Defined in: [runtime/types/index.ts:99](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L99)

Routing configuration. One of `baseSegment` or `baseSegmentByLocale` is required.

***

### search?

> `optional` **search?**: [`GinkoCmsSiteCollectionSearch`](GinkoCmsSiteCollectionSearch.md)

Defined in: [runtime/types/index.ts:61](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L61)

Per-collection search configuration.

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`search`](GinkoCmsSiteCollectionCommon.md#search)

***

### slugField?

> `optional` **slugField?**: `string`

Defined in: [runtime/types/index.ts:51](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L51)

Field name used as the slug identifier for flat path resolution.

#### Default Value

`'slug'`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`slugField`](GinkoCmsSiteCollectionCommon.md#slugfield)

***

### source

> **source**: `string`

Defined in: [runtime/types/index.ts:47](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L47)

Upstream CMS collection slug. Required.

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`source`](GinkoCmsSiteCollectionCommon.md#source)
