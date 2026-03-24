[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoQueryOperationSearch

# Interface: GinkoQueryOperationSearch

Defined in: [runtime/types/index.ts:261](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L261)

Search operation payload nested within [GinkoQueryPayload](GinkoQueryPayload.md).

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/types/index.ts:265](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L265)

Maximum number of search results. Clamped server-side to max 100.

***

### q

> **q**: `string`

Defined in: [runtime/types/index.ts:263](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L263)

The search query string. Queries shorter than 2 characters return empty results.
