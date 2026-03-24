[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoQueryPayload

# Interface: GinkoQueryPayload

Defined in: [runtime/types/index.ts:283](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L283)

Request body for `POST /api/ginko/query`.

The `op` field selects the operation. Additional fields are consumed based on the operation.

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:287](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L287)

Target collection key. Required for most operations; omit for cross-collection search.

***

### includeBody?

> `optional` **includeBody?**: `boolean`

Defined in: [runtime/types/index.ts:306](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L306)

Include full body content in response.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/types/index.ts:300](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L300)

Maximum items to return. Clamped server-side to max 200 for find, 100 for search.

***

### locale?

> `optional` **locale?**: `string`

Defined in: [runtime/types/index.ts:304](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L304)

Locale for the request. Falls back to runtime config default.

***

### offset?

> `optional` **offset?**: `number`

Defined in: [runtime/types/index.ts:302](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L302)

Number of items to skip. Clamped server-side to `>= 0`.

***

### op

> **op**: `"find"` \| `"first"` \| `"navigation"` \| `"surround"` \| `"search"` \| `"pathBy"` \| `"page"`

Defined in: [runtime/types/index.ts:285](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L285)

The query operation to execute.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:289](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L289)

Content path for path-based operations (`page`, `find`, `first`, `surround`).

***

### pathBy?

> `optional` **pathBy?**: [`GinkoQueryOperationPathBy`](GinkoQueryOperationPathBy.md)

Defined in: [runtime/types/index.ts:319](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L319)

PathBy operation parameters. Required when `op: 'pathBy'`.

***

### populate?

> `optional` **populate?**: `string`[]

Defined in: [runtime/types/index.ts:308](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L308)

Fields to populate (relation expansion). Only supported for `find`, `first`, `page`.

***

### search?

> `optional` **search?**: [`GinkoQueryOperationSearch`](GinkoQueryOperationSearch.md)

Defined in: [runtime/types/index.ts:310](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L310)

Search operation parameters. Required when `op: 'search'`.

***

### sort?

> `optional` **sort?**: `object`

Defined in: [runtime/types/index.ts:293](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L293)

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

Defined in: [runtime/types/index.ts:312](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L312)

Surround operation parameters. Used when `op: 'surround'`.

#### path?

> `optional` **path?**: `string`

The anchor path for surround lookup.

#### scope?

> `optional` **scope?**: `"collection"` \| `"section"`

Restrict surround links to the active section when section nodes exist.

##### Default Value

`'collection'`

***

### where?

> `optional` **where?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:291](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L291)

Filter conditions for `find`/`first` operations.
