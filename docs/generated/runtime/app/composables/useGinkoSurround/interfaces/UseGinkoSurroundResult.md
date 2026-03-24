[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSurround](../README.md) / UseGinkoSurroundResult

# Interface: UseGinkoSurroundResult

Defined in: [runtime/app/composables/useGinkoSurround.ts:26](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L26)

Return shape of [useGinkoSurround](../functions/useGinkoSurround.md).

## Properties

### error

> **error**: `Ref`\<`unknown`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:34](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L34)

Error from the last fetch attempt, if any.

***

### next

> **next**: `Ref`\<[`SurroundItem`](SurroundItem.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:30](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L30)

The next page in the hierarchy, or `null` at the end.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:32](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L32)

Whether a fetch is currently in progress.

***

### prev

> **prev**: `Ref`\<[`SurroundItem`](SurroundItem.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:28](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L28)

The previous page in the hierarchy, or `null` at the start.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:36](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L36)

Manually trigger a refetch.

#### Returns

`Promise`\<`void`\>
