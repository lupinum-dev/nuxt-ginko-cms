[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoPage](../README.md) / UseGinkoPageResult

# Interface: UseGinkoPageResult\<R\>

Defined in: [runtime/app/composables/useGinkoPage.ts:31](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L31)

Return shape of [useGinkoPage](../functions/useGinkoPage.md).

## Type Parameters

### R

`R` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `Ref`\<`R`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:33](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L33)

The resolved page item, or `null` if not found.

***

### error

> **error**: `Ref`\<`unknown`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:37](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L37)

Error from the last fetch attempt, if any.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:35](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L35)

Whether a fetch is currently in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:39](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L39)

Manually trigger a refetch.

#### Returns

`Promise`\<`void`\>
