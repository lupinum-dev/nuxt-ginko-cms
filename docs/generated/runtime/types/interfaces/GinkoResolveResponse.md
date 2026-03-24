[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoResolveResponse

# Interface: GinkoResolveResponse

Defined in: [runtime/types/index.ts:237](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L237)

Response from the `GET /api/ginko/resolve` endpoint.

## Properties

### canonicalPath?

> `optional` **canonicalPath?**: `string`

Defined in: [runtime/types/index.ts:245](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L245)

The canonical path for this item (may differ from input path).

***

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:247](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L247)

The matched collection key.

***

### collectionSource?

> `optional` **collectionSource?**: `string`

Defined in: [runtime/types/index.ts:249](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L249)

The upstream collection source slug.

***

### contentId?

> `optional` **contentId?**: `string`

Defined in: [runtime/types/index.ts:257](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L257)

The resolved content/colocation ID (hierarchy only).

***

### itemId?

> `optional` **itemId?**: `string`

Defined in: [runtime/types/index.ts:255](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L255)

The resolved item ID (hierarchy only).

***

### kind?

> `optional` **kind?**: `"flat"` \| `"hierarchy"`

Defined in: [runtime/types/index.ts:251](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L251)

The kind of collection that matched.

***

### locale

> **locale**: `string`

Defined in: [runtime/types/index.ts:243](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L243)

The resolved locale.

***

### matched

> **matched**: `boolean`

Defined in: [runtime/types/index.ts:239](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L239)

Whether the path matched any collection route.

***

### path

> **path**: `string`

Defined in: [runtime/types/index.ts:241](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L241)

The input path.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:253](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L253)

The resolved item slug.
