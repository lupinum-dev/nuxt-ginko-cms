[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoSurround](../README.md) / UseGinkoSurroundResult

# Interface: UseGinkoSurroundResult

Defined in: [runtime/app/composables/useGinkoSurround.ts:30](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L30)

Return shape of [useGinkoSurround](../functions/useGinkoSurround.md).

## Properties

### error

> **error**: `Ref`\<`unknown`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:38](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L38)

Error from the last fetch attempt, if any.

***

### next

> **next**: `Ref`\<[`SurroundItem`](SurroundItem.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:34](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L34)

The next page in the hierarchy, or `null` at the end.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:36](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L36)

Whether a fetch is currently in progress.

***

### prev

> **prev**: `Ref`\<[`SurroundItem`](SurroundItem.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:32](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L32)

The previous page in the hierarchy, or `null` at the start.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:40](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L40)

Manually trigger a refetch.

#### Returns

`Promise`\<`void`\>
