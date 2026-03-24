[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoQueryResponse

# Interface: GinkoQueryResponse\<T\>

Defined in: [runtime/types/index.ts:323](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L323)

Standard response envelope from the query endpoint.

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `T`

Defined in: [runtime/types/index.ts:325](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L325)

The response data. Shape varies by operation.

***

### meta?

> `optional` **meta?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:327](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L327)

Optional metadata (e.g., pagination info).
