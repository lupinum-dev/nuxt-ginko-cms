[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoPage](../README.md) / UseGinkoPageResult

# Interface: UseGinkoPageResult\<R\>

Defined in: [runtime/app/composables/useGinkoPage.ts:29](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoPage.ts#L29)

Return shape of [useGinkoPage](../functions/useGinkoPage.md).

## Type Parameters

### R

`R` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `Ref`\<`R`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:31](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoPage.ts#L31)

The resolved page item, or `null` if not found.

***

### error

> **error**: `Ref`\<`unknown`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:35](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoPage.ts#L35)

Error from the last fetch attempt, if any.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:33](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoPage.ts#L33)

Whether a fetch is currently in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:37](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoPage.ts#L37)

Manually trigger a refetch.

#### Returns

`Promise`\<`void`\>
