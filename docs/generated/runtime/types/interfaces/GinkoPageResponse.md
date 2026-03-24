[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoPageResponse

# Interface: GinkoPageResponse\<T\>

Defined in: [runtime/types/index.ts:126](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L126)

Response from `op: 'page'` — combines resolve, canonical check, and fetch in one call.

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### collectionKey?

> `optional` **collectionKey?**: `string`

Defined in: [runtime/types/index.ts:134](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L134)

The collection key that matched the path, if any.

***

### item

> **item**: `T`

Defined in: [runtime/types/index.ts:128](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L128)

The fetched item, or `null` if the path did not resolve.

***

### locale

> **locale**: `string`

Defined in: [runtime/types/index.ts:132](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L132)

The resolved locale for this request.

***

### redirect?

> `optional` **redirect?**: `string`

Defined in: [runtime/types/index.ts:130](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L130)

When set, the client should redirect to this canonical path (301).
