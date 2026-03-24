[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoSearchResult

# Interface: GinkoSearchResult

Defined in: [runtime/types/index.ts:221](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L221)

A search result hit.

## Properties

### collection

> **collection**: `string`

Defined in: [runtime/types/index.ts:229](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L229)

Which collection this came from.

***

### path

> **path**: `string`

Defined in: [runtime/types/index.ts:227](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L227)

Resolved URL path.

***

### raw?

> `optional` **raw?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/types/index.ts:231](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L231)

Raw item data (only when `includeRaw: true`).

***

### snippet

> **snippet**: `string`

Defined in: [runtime/types/index.ts:225](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L225)

HTML snippet with `<mark>` tags.

***

### title

> **title**: `string`

Defined in: [runtime/types/index.ts:223](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L223)

Display title.
