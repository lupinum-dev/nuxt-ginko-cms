[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoNavGroup

# Interface: GinkoNavGroup

Defined in: [runtime/types/index.ts:188](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L188)

A navigation group (section heading / separator).

## Properties

### id

> **id**: `string`

Defined in: [runtime/types/index.ts:190](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L190)

Slugified group id.

***

### items

> **items**: [`GinkoNavItem`](GinkoNavItem.md)[]

Defined in: [runtime/types/index.ts:194](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L194)

Navigation items in this group.

***

### title?

> `optional` **title?**: `string`

Defined in: [runtime/types/index.ts:192](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L192)

Display title. `undefined` = ungrouped (no heading rendered).
