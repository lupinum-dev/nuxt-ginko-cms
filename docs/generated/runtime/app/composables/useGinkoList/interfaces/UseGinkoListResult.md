[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoList](../README.md) / UseGinkoListResult

# Interface: UseGinkoListResult\<R\>

Defined in: [runtime/app/composables/useGinkoList.ts:46](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoList.ts#L46)

Return shape of [useGinkoList](../functions/useGinkoList.md).

## Type Parameters

### R

`R` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `Ref`\<`R`[]\>

Defined in: [runtime/app/composables/useGinkoList.ts:48](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoList.ts#L48)

The list of items.

***

### error

> **error**: `Ref`\<`GinkoError`\>

Defined in: [runtime/app/composables/useGinkoList.ts:54](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoList.ts#L54)

Error from last fetch, if any.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoList.ts:52](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoList.ts#L52)

Whether a fetch is in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoList.ts:56](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoList.ts#L56)

Manually refetch.

#### Returns

`Promise`\<`void`\>

***

### total

> **total**: `Ref`\<`number`\>

Defined in: [runtime/app/composables/useGinkoList.ts:50](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoList.ts#L50)

Total matching items (for pagination math).
