[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteCollectionCommon

# Interface: GinkoCmsSiteCollectionCommon

Defined in: [runtime/types/index.ts:45](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L45)

Fields common to both flat and hierarchy collections.

## Extended by

- [`GinkoCmsSiteFlatCollection`](GinkoCmsSiteFlatCollection.md)
- [`GinkoCmsSiteHierarchyCollection`](GinkoCmsSiteHierarchyCollection.md)

## Properties

### getQuery?

> `optional` **getQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:59](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L59)

Reserved metadata for single-item queries (not currently applied by runtime).

***

### keyField?

> `optional` **keyField?**: `"id"` \| `"slug"`

Defined in: [runtime/types/index.ts:53](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L53)

Key field for sitemap generation helpers.

#### Default Value

`'id'`

***

### listQuery?

> `optional` **listQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:57](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L57)

Reserved metadata for list queries (not currently applied by runtime).

***

### localized?

> `optional` **localized?**: `boolean`

Defined in: [runtime/types/index.ts:49](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L49)

Whether this collection supports localized content.

#### Default Value

`true`

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [runtime/types/index.ts:55](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L55)

Page size for sitemap generation helpers.

#### Default Value

`100`

***

### search?

> `optional` **search?**: [`GinkoCmsSiteCollectionSearch`](GinkoCmsSiteCollectionSearch.md)

Defined in: [runtime/types/index.ts:61](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L61)

Per-collection search configuration.

***

### slugField?

> `optional` **slugField?**: `string`

Defined in: [runtime/types/index.ts:51](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L51)

Field name used as the slug identifier for flat path resolution.

#### Default Value

`'slug'`

***

### source

> **source**: `string`

Defined in: [runtime/types/index.ts:47](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L47)

Upstream CMS collection slug. Required.
