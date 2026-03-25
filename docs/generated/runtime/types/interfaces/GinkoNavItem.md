[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoNavItem

# Interface: GinkoNavItem

Defined in: [runtime/types/index.ts:198](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L198)

A navigation item (page or folder).

## Properties

### badge?

> `optional` **badge?**: `string`

Defined in: [runtime/types/index.ts:206](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L206)

Optional badge text.

***

### children

> **children**: `GinkoNavItem`[]

Defined in: [runtime/types/index.ts:208](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L208)

Child items (empty for pages).

***

### icon?

> `optional` **icon?**: `string`

Defined in: [runtime/types/index.ts:204](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L204)

Optional icon string.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:202](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L202)

Resolved URL path. `undefined` = not routable.

***

### title

> **title**: `string`

Defined in: [runtime/types/index.ts:200](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L200)

Display title.
