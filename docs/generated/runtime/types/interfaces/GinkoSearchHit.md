[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoSearchHit

# Interface: GinkoSearchHit

Defined in: [runtime/types/index.ts:332](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L332)

A single search result hit.

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:336](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L336)

The collection key this hit belongs to.

***

### collectionSource?

> `optional` **collectionSource?**: `string`

Defined in: [runtime/types/index.ts:338](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L338)

The upstream collection source slug.

***

### id?

> `optional` **id?**: `string`

Defined in: [runtime/types/index.ts:334](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L334)

Upstream item ID.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:346](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L346)

Resolved URL path for this item.

***

### raw

> **raw**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:350](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L350)

The full raw item data from the CMS.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:340](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L340)

The item slug.

***

### snippet?

> `optional` **snippet?**: `string`

Defined in: [runtime/types/index.ts:344](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L344)

Text snippet with search term context.

***

### title?

> `optional` **title?**: `string`

Defined in: [runtime/types/index.ts:342](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L342)

Display title of the item.

***

### updatedAt?

> `optional` **updatedAt?**: `number`

Defined in: [runtime/types/index.ts:348](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L348)

Last update timestamp (epoch ms).
