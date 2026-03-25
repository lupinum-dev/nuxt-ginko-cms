[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoPageResponse

# Interface: GinkoPageResponse\<T\>

Defined in: [runtime/types/index.ts:127](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L127)

Response from `op: 'page'` — combines resolve, canonical check, and fetch in one call.

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:135](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L135)

The collection key that matched the path, if any.

***

### item

> **item**: `T`

Defined in: [runtime/types/index.ts:129](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L129)

The fetched item, or `null` if the path did not resolve.

***

### locale

> **locale**: `string`

Defined in: [runtime/types/index.ts:133](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L133)

The resolved locale for this request.

***

### redirect?

> `optional` **redirect?**: `string`

Defined in: [runtime/types/index.ts:131](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L131)

When set, the client should redirect to this canonical path (301).
