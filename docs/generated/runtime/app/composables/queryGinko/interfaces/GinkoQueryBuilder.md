[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/queryGinko](../README.md) / GinkoQueryBuilder

# Interface: GinkoQueryBuilder\<T\>

Defined in: [runtime/app/composables/queryGinko.ts:7](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L7)

Chainable query builder returned by [queryGinko](../functions/queryGinko.md).

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### find

> **find**: () => `Promise`\<`T`[]\>

Defined in: [runtime/app/composables/queryGinko.ts:25](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L25)

Execute a `find` query returning a list of items.

#### Returns

`Promise`\<`T`[]\>

***

### first

> **first**: () => `Promise`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:27](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L27)

Execute a `first` query returning a single item or `null`.

#### Returns

`Promise`\<`T`\>

***

### includeBody

> **includeBody**: (`enabled?`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:21](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L21)

Include the full body content in the response.

#### Parameters

##### enabled?

`boolean`

#### Returns

`GinkoQueryBuilder`\<`T`\>

#### Default Value

`true`

***

### limit

> **limit**: (`n`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:15](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L15)

Set maximum number of items to return. Clamped to `>= 1` client-side, max 200 server-side.

#### Parameters

##### n

`number`

#### Returns

`GinkoQueryBuilder`\<`T`\>

***

### locale

> **locale**: (`code`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:19](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L19)

Override the locale. Pass `null` to skip locale resolution.

#### Parameters

##### code

`string`

#### Returns

`GinkoQueryBuilder`\<`T`\>

***

### navigation

> **navigation**: () => `Promise`\<`Record`\<`string`, `unknown`\>[]\>

Defined in: [runtime/app/composables/queryGinko.ts:29](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L29)

Fetch the hierarchy navigation tree. Only valid for hierarchy collections.

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>[]\>

***

### offset

> **offset**: (`n`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:17](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L17)

Set result offset. Clamped to `>= 0` client-side.

#### Parameters

##### n

`number`

#### Returns

`GinkoQueryBuilder`\<`T`\>

***

### path

> **path**: (`path`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:9](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L9)

Set the content path to resolve.

#### Parameters

##### path

`string`

#### Returns

`GinkoQueryBuilder`\<`T`\>

***

### pathBy

> **pathBy**: (`input`) => `Promise`\<`string`\>

Defined in: [runtime/app/composables/queryGinko.ts:35](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L35)

Resolve a content path by item ID, content ID, or slug.

#### Parameters

##### input

###### contentId?

`string`

###### itemId?

`string`

###### slug?

`string`

#### Returns

`Promise`\<`string`\>

***

### populate

> **populate**: (`fields`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:23](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L23)

Add fields to populate (relation expansion). Normalized and deduplicated. Only supported for `find`, `first`, and `page` operations.

#### Parameters

##### fields

`string` \| `string`[]

#### Returns

`GinkoQueryBuilder`\<`T`\>

***

### search

> **search**: (`query`, `options?`) => `Promise`\<[`GinkoSearchHit`](../../../../types/interfaces/GinkoSearchHit.md)[]\>

Defined in: [runtime/app/composables/queryGinko.ts:33](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L33)

Execute a full-text search query.

#### Parameters

##### query

`string`

##### options?

###### limit?

`number`

#### Returns

`Promise`\<[`GinkoSearchHit`](../../../../types/interfaces/GinkoSearchHit.md)[]\>

***

### sort

> **sort**: (`field`, `dir?`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:13](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L13)

Set sort field and direction.

#### Parameters

##### field

`string`

##### dir?

`"asc"` \| `"desc"`

#### Returns

`GinkoQueryBuilder`\<`T`\>

#### Default Value

dir `'asc'`

***

### surround

> **surround**: (`path?`, `options?`) => `Promise`\<\[`Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\]\>

Defined in: [runtime/app/composables/queryGinko.ts:31](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L31)

Fetch the previous/next surround items for a hierarchy path. Pass `scope: 'section'` to stay within the active section.

#### Parameters

##### path?

`string`

##### options?

###### scope?

`"collection"` \| `"section"`

#### Returns

`Promise`\<\[`Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\]\>

***

### where

> **where**: (`filters`) => `GinkoQueryBuilder`\<`T`\>

Defined in: [runtime/app/composables/queryGinko.ts:11](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/queryGinko.ts#L11)

Merge filter conditions (additive across calls).

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`GinkoQueryBuilder`\<`T`\>
