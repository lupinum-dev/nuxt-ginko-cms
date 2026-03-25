[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoResolveResponse

# Interface: GinkoResolveResponse

Defined in: [runtime/types/index.ts:238](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L238)

Response from the `GET /api/ginko/resolve` endpoint.

## Properties

### canonicalPath?

> `optional` **canonicalPath?**: `string`

Defined in: [runtime/types/index.ts:246](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L246)

The canonical path for this item (may differ from input path).

***

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:248](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L248)

The matched collection key.

***

### collectionSource?

> `optional` **collectionSource?**: `string`

Defined in: [runtime/types/index.ts:250](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L250)

The upstream collection source slug.

***

### contentId?

> `optional` **contentId?**: `string`

Defined in: [runtime/types/index.ts:258](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L258)

The resolved content/colocation ID (hierarchy only).

***

### itemId?

> `optional` **itemId?**: `string`

Defined in: [runtime/types/index.ts:256](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L256)

The resolved item ID (hierarchy only).

***

### kind?

> `optional` **kind?**: `"flat"` \| `"hierarchy"`

Defined in: [runtime/types/index.ts:252](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L252)

The kind of collection that matched.

***

### locale

> **locale**: `string`

Defined in: [runtime/types/index.ts:244](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L244)

The resolved locale.

***

### matched

> **matched**: `boolean`

Defined in: [runtime/types/index.ts:240](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L240)

Whether the path matched any collection route.

***

### path

> **path**: `string`

Defined in: [runtime/types/index.ts:242](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L242)

The input path.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:254](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L254)

The resolved item slug.
