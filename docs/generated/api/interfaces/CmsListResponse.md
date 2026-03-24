[**@lupinum/ginko-nuxt**](../../README.md)

***

[@lupinum/ginko-nuxt](../../README.md) / [api](../README.md) / CmsListResponse

# Interface: CmsListResponse

Defined in: [runtime/types/api.ts:31](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/api.ts#L31)

Response from a collection list query.

## Properties

### data

> **data**: [`CmsItem`](CmsItem.md)[]

Defined in: [runtime/types/api.ts:33](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/api.ts#L33)

Array of items matching the query.

***

### meta

> **meta**: `object`

Defined in: [runtime/types/api.ts:35](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/api.ts#L35)

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
