[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSurround](../README.md) / UseGinkoSurroundResult

# Interface: UseGinkoSurroundResult

Defined in: [runtime/app/composables/useGinkoSurround.ts:30](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSurround.ts#L30)

Return shape of [useGinkoSurround](../functions/useGinkoSurround.md).

## Properties

### error

> **error**: `Ref`\<`unknown`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:38](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSurround.ts#L38)

Error from the last fetch attempt, if any.

***

### next

> **next**: `Ref`\<[`SurroundItem`](SurroundItem.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:34](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSurround.ts#L34)

The next page in the hierarchy, or `null` at the end.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:36](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSurround.ts#L36)

Whether a fetch is currently in progress.

***

### prev

> **prev**: `Ref`\<[`SurroundItem`](SurroundItem.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:32](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSurround.ts#L32)

The previous page in the hierarchy, or `null` at the start.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:40](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoSurround.ts#L40)

Manually trigger a refetch.

#### Returns

`Promise`\<`void`\>
