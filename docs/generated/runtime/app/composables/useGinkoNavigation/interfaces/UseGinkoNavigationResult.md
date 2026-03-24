[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoNavigation](../README.md) / UseGinkoNavigationResult

# Interface: UseGinkoNavigationResult

Defined in: [runtime/app/composables/useGinkoNavigation.ts:35](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L35)

Return shape of [useGinkoNavigation](../functions/useGinkoNavigation.md).

## Properties

### data

> **data**: `Ref`\<[`NavigationItem`](NavigationItem.md)[]\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:37](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L37)

The navigation tree. Defaults to `[]` on initial load.

***

### error

> **error**: `Ref`\<`unknown`\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:41](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L41)

Error from the last fetch attempt, if any.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:39](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L39)

Whether a fetch is currently in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:43](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L43)

Manually trigger a refetch.

#### Returns

`Promise`\<`void`\>
