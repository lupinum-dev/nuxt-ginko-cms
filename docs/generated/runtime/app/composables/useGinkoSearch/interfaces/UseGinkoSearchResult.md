[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSearch](../README.md) / UseGinkoSearchResult

# Interface: UseGinkoSearchResult

Defined in: [runtime/app/composables/useGinkoSearch.ts:24](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSearch.ts#L24)

Return shape of [useGinkoSearch](../functions/useGinkoSearch.md).

## Properties

### clear

> **clear**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:34](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSearch.ts#L34)

Reset query, results, and error.

#### Returns

`void`

***

### error

> **error**: `Ref`\<`GinkoError`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:32](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSearch.ts#L32)

Error from last search.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:30](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSearch.ts#L30)

Whether a request is in flight.

***

### query

> **query**: `Ref`\<`string`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:26](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSearch.ts#L26)

Bind to search input v-model.

***

### results

> **results**: `Ref`\<[`GinkoSearchResult`](../../../../types/interfaces/GinkoSearchResult.md)[]\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:28](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSearch.ts#L28)

Search results with resolved paths.
