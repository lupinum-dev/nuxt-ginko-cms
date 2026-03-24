[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoSearchHit

# Interface: GinkoSearchHit

Defined in: [runtime/types/index.ts:261](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L261)

A single search result hit.

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:265](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L265)

The collection key this hit belongs to.

***

### collectionSource?

> `optional` **collectionSource?**: `string`

Defined in: [runtime/types/index.ts:267](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L267)

The upstream collection source slug.

***

### id?

> `optional` **id?**: `string`

Defined in: [runtime/types/index.ts:263](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L263)

Upstream item ID.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:275](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L275)

Resolved URL path for this item.

***

### raw

> **raw**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:279](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L279)

The full raw item data from the CMS.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:269](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L269)

The item slug.

***

### snippet?

> `optional` **snippet?**: `string`

Defined in: [runtime/types/index.ts:273](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L273)

Text snippet with search term context.

***

### title?

> `optional` **title?**: `string`

Defined in: [runtime/types/index.ts:271](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L271)

Display title of the item.

***

### updatedAt?

> `optional` **updatedAt?**: `number`

Defined in: [runtime/types/index.ts:277](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L277)

Last update timestamp (epoch ms).
