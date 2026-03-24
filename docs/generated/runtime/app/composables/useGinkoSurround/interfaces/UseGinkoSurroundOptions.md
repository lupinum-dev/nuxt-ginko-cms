[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSurround](../README.md) / UseGinkoSurroundOptions

# Interface: UseGinkoSurroundOptions

Defined in: [runtime/app/composables/useGinkoSurround.ts:16](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L16)

Options for [useGinkoSurround](../functions/useGinkoSurround.md).

## Properties

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:20](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L20)

Locale override. Falls back to the standard locale resolution chain.

***

### path?

> `optional` **path?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:18](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L18)

Surround anchor path.

#### Default Value

`route.path`

***

### watch?

> `optional` **watch?**: `boolean`

Defined in: [runtime/app/composables/useGinkoSurround.ts:22](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L22)

Watch `path` and `locale` for reactive refetching.

#### Default Value

`true`
