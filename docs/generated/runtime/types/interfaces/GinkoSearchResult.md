[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoSearchResult

# Interface: GinkoSearchResult

Defined in: [runtime/types/index.ts:222](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L222)

A search result hit.

## Properties

### collection

> **collection**: `string`

Defined in: [runtime/types/index.ts:230](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L230)

Which collection this came from.

***

### path

> **path**: `string`

Defined in: [runtime/types/index.ts:228](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L228)

Resolved URL path.

***

### raw?

> `optional` **raw?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:232](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L232)

Raw item data (only when `includeRaw: true`).

***

### snippet

> **snippet**: `string`

Defined in: [runtime/types/index.ts:226](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L226)

HTML snippet with `<mark>` tags.

***

### title

> **title**: `string`

Defined in: [runtime/types/index.ts:224](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L224)

Display title.
