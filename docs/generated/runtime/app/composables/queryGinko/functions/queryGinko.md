[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/queryGinko](../README.md) / queryGinko

# Function: queryGinko()

> **queryGinko**\<`T`\>(`collectionKey?`): [`GinkoQueryBuilder`](../interfaces/GinkoQueryBuilder.md)\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:101](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/queryGinko.ts#L101)

Low-level query builder for direct CMS API access.

Provides a chainable interface to construct and execute query payloads against the
Ginko CMS server endpoint. Use the high-level composables (`useGinkoPage`, `useGinkoItems`, etc.)
for reactive data fetching — this builder is an escape hatch for advanced use cases.

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Parameters

### collectionKey?

`string`

The collection to query, or omit for cross-collection operations.

## Returns

[`GinkoQueryBuilder`](../interfaces/GinkoQueryBuilder.md)\<`T`\>

A chainable [GinkoQueryBuilder](../interfaces/GinkoQueryBuilder.md) instance.

## Example

```ts
// Find published posts sorted by date
const posts = await queryGinko('blog')
  .where({ status: 'published' })
  .sort('publishedAt', 'desc')
  .limit(10)
  .find()

// Cross-collection search
const hits = await queryGinko().search('auth', { limit: 8 })
```
