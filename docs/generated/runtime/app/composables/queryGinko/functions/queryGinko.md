[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/queryGinko](../README.md) / queryGinko

# Function: queryGinko()

> **queryGinko**\<`T`\>(`collectionKey?`): [`GinkoQueryBuilder`](../interfaces/GinkoQueryBuilder.md)\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:101](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L101)

Low-level query builder for direct CMS API access.

Provides a chainable interface to construct and execute query payloads against the
Ginko CMS server endpoint. Use the high-level composables (`useGinkoPage`, `useGinkoList`, etc.)
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
