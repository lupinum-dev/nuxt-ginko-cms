[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoQueryResponse

# Interface: GinkoQueryResponse\<T\>

Defined in: [runtime/types/index.ts:324](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L324)

Standard response envelope from the query endpoint.

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `T`

Defined in: [runtime/types/index.ts:326](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L326)

The response data. Shape varies by operation.

***

### meta?

> `optional` **meta?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:328](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L328)

Optional metadata (e.g., pagination info).
