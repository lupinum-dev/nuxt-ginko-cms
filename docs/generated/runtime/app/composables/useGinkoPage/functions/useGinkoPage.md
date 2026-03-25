[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoPage](../README.md) / useGinkoPage

# Function: useGinkoPage()

> **useGinkoPage**\<`K`, `T`, `R`\>(`collectionKey?`, `options?`): `Promise`\<[`UseGinkoPageResult`](../interfaces/UseGinkoPageResult.md)\<`R`\>\>

Defined in: [runtime/app/composables/useGinkoPage.ts:61](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoPage.ts#L61)

Fetches a single CMS page by path with locale resolution.

Performs a single `op: 'page'` request that resolves the path to a collection,
checks canonical URL, and fetches the item in one round trip. Handles redirects
automatically and throws a 404 when the item is not found (configurable).

## Type Parameters

### K

`K` *extends* `string` & `object`

### T

`T` = `InferCollection`\<`K`\>

### R

`R` = `T`

## Parameters

### collectionKey?

`K`

The collection to resolve within, or omit for auto-detection.

### options?

[`UseGinkoPageOptions`](../interfaces/UseGinkoPageOptions.md)\<`T`, `R`\> = `{}`

Page fetch options.

## Returns

`Promise`\<[`UseGinkoPageResult`](../interfaces/UseGinkoPageResult.md)\<`R`\>\>

Reactive page data, pending state, error, and refresh function.

## Example

```ts
const { data: post } = await useGinkoPage('blog', {
  populate: ['author', 'tags'],
  transform: raw => mapBlogPost(raw),
})
```
