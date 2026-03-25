[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteCollectionSearch

# Interface: GinkoCmsSiteCollectionSearch

Defined in: [runtime/types/index.ts:38](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L38)

Per-collection search configuration override.

## Properties

### collections?

> `optional` **collections?**: readonly `string`[]

Defined in: [runtime/types/index.ts:40](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L40)

Override which upstream collection sources are searched.

#### Default Value

`[source]`

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/types/index.ts:42](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L42)

Reserved: per-collection search limit. The endpoint uses request/site defaults.
