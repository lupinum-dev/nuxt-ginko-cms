[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoQueryOperationSearch

# Interface: GinkoQueryOperationSearch

Defined in: [runtime/types/index.ts:193](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L193)

Search operation payload nested within [GinkoQueryPayload](GinkoQueryPayload.md).

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/types/index.ts:197](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L197)

Maximum number of search results. Clamped server-side to max 100.

***

### q

> **q**: `string`

Defined in: [runtime/types/index.ts:195](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L195)

The search query string. Queries shorter than 2 characters return empty results.
