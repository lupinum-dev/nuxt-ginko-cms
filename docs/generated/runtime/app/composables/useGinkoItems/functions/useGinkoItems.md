[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoItems](../README.md) / useGinkoItems

# Function: useGinkoItems()

> **useGinkoItems**\<`K`, `T`, `R`\>(`collectionKey`, `options?`): `Promise`\<[`UseGinkoItemsResult`](../interfaces/UseGinkoItemsResult.md)\<`R`\>\>

Defined in: [runtime/app/composables/useGinkoItems.ts:63](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoItems.ts#L63)

Fetches a list of CMS items from a collection with filtering, sorting, and pagination.

Uses `op: 'find'` under the hood. The cache key includes collection, locale, limit, offset,
where, and sort — so different query configurations are cached independently.

## Type Parameters

### K

`K` *extends* `string` & `object`

### T

`T` = `InferCollection`\<`K`\>

### R

`R` = `T`

## Parameters

### collectionKey

`K`

The collection to query.

### options?

[`UseGinkoItemsOptions`](../interfaces/UseGinkoItemsOptions.md)\<`T`, `R`\> = `{}`

List query options.

## Returns

`Promise`\<[`UseGinkoItemsResult`](../interfaces/UseGinkoItemsResult.md)\<`R`\>\>

Reactive item list, pending state, error, and refresh function.

## Example

```ts
const { data: posts, pending } = await useGinkoItems('blog', {
  where: { status: 'published' },
  sort: ['publishedAt', 'desc'],
  limit: 12,
  transform: rows => rows.map(mapBlogCard),
})
```
