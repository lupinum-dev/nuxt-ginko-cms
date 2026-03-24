[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoQueryPayload

# Interface: GinkoQueryPayload

Defined in: [runtime/types/index.ts:215](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L215)

Request body for `POST /api/ginko/query`.

The `op` field selects the operation. Additional fields are consumed based on the operation.

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:219](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L219)

Target collection key. Required for most operations; omit for cross-collection search.

***

### includeBody?

> `optional` **includeBody?**: `boolean`

Defined in: [runtime/types/index.ts:238](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L238)

Include full body content in response.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/types/index.ts:232](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L232)

Maximum items to return. Clamped server-side to max 200 for find, 100 for search.

***

### locale?

> `optional` **locale?**: `string`

Defined in: [runtime/types/index.ts:236](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L236)

Locale for the request. Falls back to runtime config default.

***

### offset?

> `optional` **offset?**: `number`

Defined in: [runtime/types/index.ts:234](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L234)

Number of items to skip. Clamped server-side to `>= 0`.

***

### op

> **op**: `"find"` \| `"first"` \| `"navigation"` \| `"surround"` \| `"search"` \| `"pathBy"` \| `"page"`

Defined in: [runtime/types/index.ts:217](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L217)

The query operation to execute.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:221](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L221)

Content path for path-based operations (`page`, `find`, `first`, `surround`).

***

### pathBy?

> `optional` **pathBy?**: [`GinkoQueryOperationPathBy`](GinkoQueryOperationPathBy.md)

Defined in: [runtime/types/index.ts:249](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L249)

PathBy operation parameters. Required when `op: 'pathBy'`.

***

### populate?

> `optional` **populate?**: `string`[]

Defined in: [runtime/types/index.ts:240](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L240)

Fields to populate (relation expansion). Only supported for `find`, `first`, `page`.

***

### search?

> `optional` **search?**: [`GinkoQueryOperationSearch`](GinkoQueryOperationSearch.md)

Defined in: [runtime/types/index.ts:242](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L242)

Search operation parameters. Required when `op: 'search'`.

***

### sort?

> `optional` **sort?**: `object`

Defined in: [runtime/types/index.ts:225](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L225)

Sort configuration for `find`/`first` operations.

#### dir?

> `optional` **dir?**: `"asc"` \| `"desc"`

Sort direction.

##### Default Value

`'asc'`

#### field

> **field**: `string`

Field name to sort by.

***

### surround?

> `optional` **surround?**: `object`

Defined in: [runtime/types/index.ts:244](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L244)

Surround operation parameters. Used when `op: 'surround'`.

#### path?

> `optional` **path?**: `string`

The anchor path for surround lookup.

***

### where?

> `optional` **where?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:223](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L223)

Filter conditions for `find`/`first` operations.
