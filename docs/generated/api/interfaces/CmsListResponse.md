[**nuxt-ginko-cms**](../../README.md)

***

[nuxt-ginko-cms](../../README.md) / [api](../README.md) / CmsListResponse

# Interface: CmsListResponse

Defined in: [runtime/types/api.ts:31](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L31)

Response from a collection list query.

## Properties

### data

> **data**: [`CmsItem`](CmsItem.md)[]

Defined in: [runtime/types/api.ts:33](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L33)

Array of items matching the query.

***

### meta

> **meta**: `object`

Defined in: [runtime/types/api.ts:35](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L35)

Pagination and locale metadata.

#### limit

> **limit**: `number`

Maximum items per page.

#### locale

> **locale**: `string`

The locale used for this query.

#### offset

> **offset**: `number`

Number of items skipped.

#### total

> **total**: `number`

Total number of matching items across all pages.
