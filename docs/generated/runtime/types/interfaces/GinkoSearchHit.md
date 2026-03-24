[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoSearchHit

# Interface: GinkoSearchHit

Defined in: [runtime/types/index.ts:331](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L331)

A single search result hit.

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:335](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L335)

The collection key this hit belongs to.

***

### collectionSource?

> `optional` **collectionSource?**: `string`

Defined in: [runtime/types/index.ts:337](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L337)

The upstream collection source slug.

***

### id?

> `optional` **id?**: `string`

Defined in: [runtime/types/index.ts:333](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L333)

Upstream item ID.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:345](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L345)

Resolved URL path for this item.

***

### raw

> **raw**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:349](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L349)

The full raw item data from the CMS.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:339](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L339)

The item slug.

***

### snippet?

> `optional` **snippet?**: `string`

Defined in: [runtime/types/index.ts:343](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L343)

Text snippet with search term context.

***

### title?

> `optional` **title?**: `string`

Defined in: [runtime/types/index.ts:341](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L341)

Display title of the item.

***

### updatedAt?

> `optional` **updatedAt?**: `number`

Defined in: [runtime/types/index.ts:347](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L347)

Last update timestamp (epoch ms).
