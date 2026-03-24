[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoList](../README.md) / UseGinkoListResult

# Interface: UseGinkoListResult\<R\>

Defined in: [runtime/app/composables/useGinkoList.ts:46](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L46)

Return shape of [useGinkoList](../functions/useGinkoList.md).

## Type Parameters

### R

`R` = `Record`\<`string`, `unknown`\>

## Properties

### data

> **data**: `Ref`\<`R`[]\>

Defined in: [runtime/app/composables/useGinkoList.ts:48](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L48)

The list of items.

***

### error

> **error**: `Ref`\<`GinkoError`\>

Defined in: [runtime/app/composables/useGinkoList.ts:54](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L54)

Error from last fetch, if any.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoList.ts:52](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L52)

Whether a fetch is in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoList.ts:56](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L56)

Manually refetch.

#### Returns

`Promise`\<`void`\>

***

### total

> **total**: `Ref`\<`number`\>

Defined in: [runtime/app/composables/useGinkoList.ts:50](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L50)

Total matching items (for pagination math).
