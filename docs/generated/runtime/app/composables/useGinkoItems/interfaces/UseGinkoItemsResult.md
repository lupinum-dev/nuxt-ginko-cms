[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoItems](../README.md) / UseGinkoItemsResult

# Interface: UseGinkoItemsResult\<R\>

Defined in: [runtime/app/composables/useGinkoItems.ts:32](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L32)

Return shape of [useGinkoItems](../functions/useGinkoItems.md).

## Type Parameters

### R

`R` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `Ref`\<`R`[]\>

Defined in: [runtime/app/composables/useGinkoItems.ts:34](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L34)

The list of items. Defaults to `[]` on initial load.

***

### error

> **error**: `Ref`\<`unknown`\>

Defined in: [runtime/app/composables/useGinkoItems.ts:38](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L38)

Error from the last fetch attempt, if any.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoItems.ts:36](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L36)

Whether a fetch is currently in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoItems.ts:40](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L40)

Manually trigger a refetch.

#### Returns

`Promise`\<`void`\>
