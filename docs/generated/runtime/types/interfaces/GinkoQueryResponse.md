[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoQueryResponse

# Interface: GinkoQueryResponse\<T\>

Defined in: [runtime/types/index.ts:253](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L253)

Standard response envelope from the query endpoint.

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `T`

Defined in: [runtime/types/index.ts:255](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L255)

The response data. Shape varies by operation.

***

### meta?

> `optional` **meta?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:257](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L257)

Optional metadata (e.g., pagination info).
