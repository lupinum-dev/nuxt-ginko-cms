[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoPage](../README.md) / UseGinkoPageOptions

# Interface: UseGinkoPageOptions\<T, R\>

Defined in: [runtime/app/composables/useGinkoPage.ts:11](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L11)

Options for [useGinkoPage](../functions/useGinkoPage.md).

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

### R

`R` = `T`

## Properties

### includeBody?

> `optional` **includeBody?**: `boolean`

Defined in: [runtime/app/composables/useGinkoPage.ts:17](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L17)

Whether to include the full body content in the response.

#### Default Value

`true`

***

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:15](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L15)

Locale override. Falls back to the standard locale resolution chain.

***

### path?

> `optional` **path?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoPage.ts:13](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L13)

Page path to resolve and fetch.

#### Default Value

`route.path`

***

### populate?

> `optional` **populate?**: `string`[]

Defined in: [runtime/app/composables/useGinkoPage.ts:19](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L19)

Fields to populate (relation expansion). Normalized and deduplicated.

***

### throw404?

> `optional` **throw404?**: `boolean`

Defined in: [runtime/app/composables/useGinkoPage.ts:25](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L25)

Alias for `throwIfNotFound`.

#### Default Value

`true`

***

### throwIfNotFound?

> `optional` **throwIfNotFound?**: `boolean`

Defined in: [runtime/app/composables/useGinkoPage.ts:23](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L23)

Throw a Nuxt 404 error when the resolved item is `null`.

#### Default Value

`true`

***

### transform?

> `optional` **transform?**: (`raw`) => `R`

Defined in: [runtime/app/composables/useGinkoPage.ts:21](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L21)

Transform function applied to the raw item before exposure. Only called when item is non-null.

#### Parameters

##### raw

`T`

#### Returns

`R`

***

### watch?

> `optional` **watch?**: `boolean`

Defined in: [runtime/app/composables/useGinkoPage.ts:27](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L27)

Watch `path` and `locale` for reactive refetching. Set `false` to disable watchers.

#### Default Value

`true`
