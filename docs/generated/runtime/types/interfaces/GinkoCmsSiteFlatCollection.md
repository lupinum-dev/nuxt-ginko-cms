[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteFlatCollection

# Interface: GinkoCmsSiteFlatCollection

Defined in: [runtime/types/index.ts:87](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L87)

A flat (non-hierarchical) collection with prefix-based routing.

## Extends

- [`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md)

## Properties

### getQuery?

> `optional` **getQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:59](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L59)

Reserved metadata for single-item queries (not currently applied by runtime).

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`getQuery`](GinkoCmsSiteCollectionCommon.md#getquery)

***

### keyField?

> `optional` **keyField?**: `"id"` \| `"slug"`

Defined in: [runtime/types/index.ts:53](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L53)

Key field for sitemap generation helpers.

#### Default Value

`'id'`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`keyField`](GinkoCmsSiteCollectionCommon.md#keyfield)

***

### kind

> **kind**: `"flat"`

Defined in: [runtime/types/index.ts:89](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L89)

Discriminator: this is a flat collection.

***

### listQuery?

> `optional` **listQuery?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:57](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L57)

Reserved metadata for list queries (not currently applied by runtime).

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`listQuery`](GinkoCmsSiteCollectionCommon.md#listquery)

***

### localized?

> `optional` **localized?**: `boolean`

Defined in: [runtime/types/index.ts:49](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L49)

Whether this collection supports localized content.

#### Default Value

`true`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`localized`](GinkoCmsSiteCollectionCommon.md#localized)

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [runtime/types/index.ts:55](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L55)

Page size for sitemap generation helpers.

#### Default Value

`100`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`pageSize`](GinkoCmsSiteCollectionCommon.md#pagesize)

***

### routing

> **routing**: [`GinkoCmsSiteFlatRouting`](GinkoCmsSiteFlatRouting.md)

Defined in: [runtime/types/index.ts:91](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L91)

Routing configuration. One of `prefix`, `prefixByLocale`, or `pathMapByLocale` is required.

***

### search?

> `optional` **search?**: [`GinkoCmsSiteCollectionSearch`](GinkoCmsSiteCollectionSearch.md)

Defined in: [runtime/types/index.ts:61](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L61)

Per-collection search configuration.

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`search`](GinkoCmsSiteCollectionCommon.md#search)

***

### slugField?

> `optional` **slugField?**: `string`

Defined in: [runtime/types/index.ts:51](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L51)

Field name used as the slug identifier for flat path resolution.

#### Default Value

`'slug'`

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`slugField`](GinkoCmsSiteCollectionCommon.md#slugfield)

***

### source

> **source**: `string`

Defined in: [runtime/types/index.ts:47](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L47)

Upstream CMS collection slug. Required.

#### Inherited from

[`GinkoCmsSiteCollectionCommon`](GinkoCmsSiteCollectionCommon.md).[`source`](GinkoCmsSiteCollectionCommon.md#source)
