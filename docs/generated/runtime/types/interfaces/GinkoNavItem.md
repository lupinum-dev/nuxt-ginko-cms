[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoNavItem

# Interface: GinkoNavItem

Defined in: [runtime/types/index.ts:197](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L197)

A navigation item (page or folder).

## Properties

### badge?

> `optional` **badge?**: `string`

Defined in: [runtime/types/index.ts:205](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L205)

Optional badge text.

***

### children

> **children**: `GinkoNavItem`[]

Defined in: [runtime/types/index.ts:207](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L207)

Child items (empty for pages).

***

### icon?

> `optional` **icon?**: `string`

Defined in: [runtime/types/index.ts:203](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L203)

Optional icon string.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:201](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L201)

Resolved URL path. `undefined` = not routable.

***

### title

> **title**: `string`

Defined in: [runtime/types/index.ts:199](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L199)

Display title.
