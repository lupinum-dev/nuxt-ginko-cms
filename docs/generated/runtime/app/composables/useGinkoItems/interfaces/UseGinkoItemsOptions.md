[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoItems](../README.md) / UseGinkoItemsOptions

# Interface: UseGinkoItemsOptions\<T, R\>

Defined in: [runtime/app/composables/useGinkoItems.ts:10](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L10)

Options for [useGinkoItems](../functions/useGinkoItems.md).

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

### R

`R` = `T`

## Properties

### includeBody?

> `optional` **includeBody?**: `boolean`

Defined in: [runtime/app/composables/useGinkoItems.ts:22](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L22)

Include the full body content for each item.

#### Default Value

`false`

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/app/composables/useGinkoItems.ts:14](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L14)

Maximum number of items to return. Clamped server-side to max 200.

***

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoItems.ts:26](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L26)

Locale override. Falls back to the standard locale resolution chain.

***

### offset?

> `optional` **offset?**: `number`

Defined in: [runtime/app/composables/useGinkoItems.ts:16](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L16)

Number of items to skip. Clamped server-side to `>= 0`.

***

### populate?

> `optional` **populate?**: `string`[]

Defined in: [runtime/app/composables/useGinkoItems.ts:20](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L20)

Fields to populate (relation expansion). Normalized and deduplicated.

***

### sort?

> `optional` **sort?**: \[`string`, `"asc"` \| `"desc"`\]

Defined in: [runtime/app/composables/useGinkoItems.ts:12](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L12)

Sort field and direction as a tuple.

***

### transform?

> `optional` **transform?**: (`items`) => `R`[]

Defined in: [runtime/app/composables/useGinkoItems.ts:24](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L24)

Transform function applied to the item list before exposure.

#### Parameters

##### items

`T`[]

#### Returns

`R`[]

***

### watch?

> `optional` **watch?**: `boolean`

Defined in: [runtime/app/composables/useGinkoItems.ts:28](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L28)

Watch locale for reactive refetching.

#### Default Value

`true`

***

### where?

> `optional` **where?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/app/composables/useGinkoItems.ts:18](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L18)

Filter conditions merged as query parameters.
