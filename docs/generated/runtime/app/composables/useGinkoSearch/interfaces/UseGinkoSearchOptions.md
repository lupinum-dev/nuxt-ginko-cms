[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoSearch](../README.md) / UseGinkoSearchOptions

# Interface: UseGinkoSearchOptions

Defined in: [runtime/app/composables/useGinkoSearch.ts:10](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSearch.ts#L10)

Options for [useGinkoSearch](../functions/useGinkoSearch.md).

## Properties

### debounce?

> `optional` **debounce?**: `number`

Defined in: [runtime/app/composables/useGinkoSearch.ts:12](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSearch.ts#L12)

Debounce delay in ms.

#### Default

```ts
200
```

***

### includeRaw?

> `optional` **includeRaw?**: `boolean`

Defined in: [runtime/app/composables/useGinkoSearch.ts:18](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSearch.ts#L18)

Include raw item data in results.

#### Default

```ts
false
```

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/app/composables/useGinkoSearch.ts:16](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSearch.ts#L16)

Max results.

#### Default

```ts
12
```

***

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:20](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSearch.ts#L20)

Locale override.

***

### minLength?

> `optional` **minLength?**: `number`

Defined in: [runtime/app/composables/useGinkoSearch.ts:14](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSearch.ts#L14)

Minimum query length.

#### Default

```ts
2
```
