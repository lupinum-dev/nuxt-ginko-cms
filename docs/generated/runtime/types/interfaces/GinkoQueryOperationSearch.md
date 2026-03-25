[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoQueryOperationSearch

# Interface: GinkoQueryOperationSearch

Defined in: [runtime/types/index.ts:262](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L262)

Search operation payload nested within [GinkoQueryPayload](GinkoQueryPayload.md).

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/types/index.ts:266](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L266)

Maximum number of search results. Clamped server-side to max 100.

***

### q

> **q**: `string`

Defined in: [runtime/types/index.ts:264](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L264)

The search query string. Queries shorter than 2 characters return empty results.
