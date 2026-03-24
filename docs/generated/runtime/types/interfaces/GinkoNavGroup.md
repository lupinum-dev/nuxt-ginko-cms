[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoNavGroup

# Interface: GinkoNavGroup

Defined in: [runtime/types/index.ts:187](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L187)

A navigation group (section heading / separator).

## Properties

### id

> **id**: `string`

Defined in: [runtime/types/index.ts:189](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L189)

Slugified group id.

***

### items

> **items**: [`GinkoNavItem`](GinkoNavItem.md)[]

Defined in: [runtime/types/index.ts:193](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L193)

Navigation items in this group.

***

### title?

> `optional` **title?**: `string`

Defined in: [runtime/types/index.ts:191](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L191)

Display title. `undefined` = ungrouped (no heading rendered).
