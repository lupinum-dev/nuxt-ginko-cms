[**nuxt-ginko-cms**](../../README.md)

***

[nuxt-ginko-cms](../../README.md) / [api](../README.md) / CmsItem

# Interface: CmsItem

Defined in: [runtime/types/api.ts:7](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L7)

A single content item from the CMS API.

## Indexable

> \[`key`: `string`\]: `unknown`

Additional dynamic fields defined by the collection schema.

## Properties

### \_fallback

> **\_fallback**: `Record`\<`string`, `boolean`\>

Defined in: [runtime/types/api.ts:25](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L25)

Map of field names to whether they fell back to a different locale.

***

### \_locale

> **\_locale**: `string`

Defined in: [runtime/types/api.ts:23](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L23)

The locale this item was fetched in.

***

### createdAt

> **createdAt**: `number`

Defined in: [runtime/types/api.ts:19](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L19)

Epoch timestamp when the item was created.

***

### id

> **id**: `string`

Defined in: [runtime/types/api.ts:9](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L9)

Unique item identifier.

***

### previewedAt?

> `optional` **previewedAt?**: `number`

Defined in: [runtime/types/api.ts:17](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L17)

Epoch timestamp when the item was last previewed.

***

### publishedAt?

> `optional` **publishedAt?**: `number`

Defined in: [runtime/types/api.ts:15](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L15)

Epoch timestamp when the item was published.

***

### slug

> **slug**: `string`

Defined in: [runtime/types/api.ts:11](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L11)

URL-safe slug for the item.

***

### status

> **status**: `"draft"` \| `"preview"` \| `"published"` \| `"archived"`

Defined in: [runtime/types/api.ts:13](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L13)

Publication status of the item.

***

### updatedAt

> **updatedAt**: `number`

Defined in: [runtime/types/api.ts:21](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L21)

Epoch timestamp when the item was last updated.
