[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoQueryPayload

# Interface: GinkoQueryPayload

Defined in: [runtime/types/index.ts:284](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L284)

Request body for `POST /api/ginko/query`.

The `op` field selects the operation. Additional fields are consumed based on the operation.

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:288](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L288)

Target collection key. Required for most operations; omit for cross-collection search.

***

### includeBody?

> `optional` **includeBody?**: `boolean`

Defined in: [runtime/types/index.ts:307](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L307)

Include full body content in response.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/types/index.ts:301](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L301)

Maximum items to return. Clamped server-side to max 200 for find, 100 for search.

***

### locale?

> `optional` **locale?**: `string`

Defined in: [runtime/types/index.ts:305](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L305)

Locale for the request. Falls back to runtime config default.

***

### offset?

> `optional` **offset?**: `number`

Defined in: [runtime/types/index.ts:303](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L303)

Number of items to skip. Clamped server-side to `>= 0`.

***

### op

> **op**: `"find"` \| `"first"` \| `"navigation"` \| `"surround"` \| `"search"` \| `"pathBy"` \| `"page"`

Defined in: [runtime/types/index.ts:286](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L286)

The query operation to execute.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:290](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L290)

Content path for path-based operations (`page`, `find`, `first`, `surround`).

***

### pathBy?

> `optional` **pathBy?**: [`GinkoQueryOperationPathBy`](GinkoQueryOperationPathBy.md)

Defined in: [runtime/types/index.ts:320](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L320)

PathBy operation parameters. Required when `op: 'pathBy'`.

***

### populate?

> `optional` **populate?**: `string`[]

Defined in: [runtime/types/index.ts:309](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L309)

Fields to populate (relation expansion). Only supported for `find`, `first`, `page`.

***

### search?

> `optional` **search?**: [`GinkoQueryOperationSearch`](GinkoQueryOperationSearch.md)

Defined in: [runtime/types/index.ts:311](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L311)

Search operation parameters. Required when `op: 'search'`.

***

### sort?

> `optional` **sort?**: `object`

Defined in: [runtime/types/index.ts:294](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L294)

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

Defined in: [runtime/types/index.ts:313](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L313)

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

Defined in: [runtime/types/index.ts:292](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L292)

Filter conditions for `find`/`first` operations.
