[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSearch](../README.md) / UseGinkoSearchOptions

# Interface: UseGinkoSearchOptions

Defined in: [runtime/app/composables/useGinkoSearch.ts:8](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L8)

Options for [useGinkoSearch](../functions/useGinkoSearch.md) when called with a collection key.

## Properties

### debounce?

> `optional` **debounce?**: `number`

Defined in: [runtime/app/composables/useGinkoSearch.ts:10](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L10)

Debounce delay in milliseconds before executing search.

#### Default Value

```ts
220
```

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/app/composables/useGinkoSearch.ts:14](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L14)

Maximum number of results to return.

#### Default Value

```ts
12
```

***

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:16](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L16)

Locale override. Falls back to the standard locale resolution chain.

***

### minLength?

> `optional` **minLength?**: `number`

Defined in: [runtime/app/composables/useGinkoSearch.ts:12](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L12)

Minimum query length required to trigger a search request.

#### Default Value

```ts
2
```
