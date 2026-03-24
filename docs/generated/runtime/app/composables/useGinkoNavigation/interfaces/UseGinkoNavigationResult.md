[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoNavigation](../README.md) / UseGinkoNavigationResult

# Interface: UseGinkoNavigationResult

Defined in: [runtime/app/composables/useGinkoNavigation.ts:36](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNavigation.ts#L36)

Return shape of [useGinkoNavigation](../functions/useGinkoNavigation.md).

## Properties

### data

> **data**: `Ref`\<[`GinkoNavigationItem`](GinkoNavigationItem.md)[]\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:38](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNavigation.ts#L38)

The raw hierarchy navigation tree.

***

### error

> **error**: `Ref`\<`GinkoError`\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:42](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNavigation.ts#L42)

Error from the last fetch.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:40](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNavigation.ts#L40)

Whether a fetch is in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:44](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNavigation.ts#L44)

Manually refetch.

#### Returns

`Promise`\<`void`\>
