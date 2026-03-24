[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoNavigation](../README.md) / UseGinkoNavigationOptions

# Interface: UseGinkoNavigationOptions

Defined in: [runtime/app/composables/useGinkoNavigation.ts:25](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L25)

Options for [useGinkoNavigation](../functions/useGinkoNavigation.md).

## Properties

### key?

> `optional` **key?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:31](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L31)

Custom `useAsyncData` cache key.

#### Default Value

`ginko-nav:<collection>:<locale>`

***

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:27](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L27)

Locale override. Falls back to the standard locale resolution chain.

***

### watch?

> `optional` **watch?**: `boolean`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:29](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L29)

Watch locale for reactive refetching.

#### Default Value

`true`
