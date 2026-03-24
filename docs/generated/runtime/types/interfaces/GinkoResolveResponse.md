[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoResolveResponse

# Interface: GinkoResolveResponse

Defined in: [runtime/types/index.ts:169](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L169)

Response from the `GET /api/ginko/resolve` endpoint.

## Properties

### canonicalPath?

> `optional` **canonicalPath?**: `string`

Defined in: [runtime/types/index.ts:177](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L177)

The canonical path for this item (may differ from input path).

***

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:179](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L179)

The matched collection key.

***

### collectionSource?

> `optional` **collectionSource?**: `string`

Defined in: [runtime/types/index.ts:181](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L181)

The upstream collection source slug.

***

### contentId?

> `optional` **contentId?**: `string`

Defined in: [runtime/types/index.ts:189](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L189)

The resolved content/colocation ID (hierarchy only).

***

### itemId?

> `optional` **itemId?**: `string`

Defined in: [runtime/types/index.ts:187](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L187)

The resolved item ID (hierarchy only).

***

### kind?

> `optional` **kind?**: `"flat"` \| `"hierarchy"`

Defined in: [runtime/types/index.ts:183](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L183)

The kind of collection that matched.

***

### locale

> **locale**: `string`

Defined in: [runtime/types/index.ts:175](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L175)

The resolved locale.

***

### matched

> **matched**: `boolean`

Defined in: [runtime/types/index.ts:171](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L171)

Whether the path matched any collection route.

***

### path

> **path**: `string`

Defined in: [runtime/types/index.ts:173](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L173)

The input path.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:185](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L185)

The resolved item slug.
