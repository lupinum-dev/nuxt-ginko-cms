[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoSurround](../README.md) / UseGinkoSurroundOptions

# Interface: UseGinkoSurroundOptions

Defined in: [runtime/app/composables/useGinkoSurround.ts:18](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L18)

Options for [useGinkoSurround](../functions/useGinkoSurround.md).

## Properties

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:22](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L22)

Locale override. Falls back to the standard locale resolution chain.

***

### path?

> `optional` **path?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:20](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L20)

Surround anchor path.

#### Default Value

`route.path`

***

### scope?

> `optional` **scope?**: [`SurroundScope`](../type-aliases/SurroundScope.md) \| `Ref`\<[`SurroundScope`](../type-aliases/SurroundScope.md), [`SurroundScope`](../type-aliases/SurroundScope.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:24](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L24)

Restrict prev/next to the active section when section nodes exist.

#### Default Value

`'collection'`

***

### watch?

> `optional` **watch?**: `boolean`

Defined in: [runtime/app/composables/useGinkoSurround.ts:26](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L26)

Watch `path` and `locale` for reactive refetching.

#### Default Value

`true`
