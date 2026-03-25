[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoNavigation](../README.md) / GinkoNavigationItem

# Interface: GinkoNavigationItem

Defined in: [runtime/app/composables/useGinkoNavigation.ts:10](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L10)

A raw hierarchy node returned by the navigation endpoint.

## Properties

### badge?

> `optional` **badge?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:20](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L20)

Optional badge text.

***

### children

> **children**: `GinkoNavigationItem`[]

Defined in: [runtime/app/composables/useGinkoNavigation.ts:24](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L24)

Child nodes.

***

### icon?

> `optional` **icon?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:18](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L18)

Optional icon string.

***

### kind?

> `optional` **kind?**: `"page"` \| `"section"` \| `"folder"` \| `"group"`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:16](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L16)

Node kind as exposed by the public tree API.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:22](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L22)

Resolved site path when the node is routable.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:14](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L14)

Optional slug for routable nodes and sections.

***

### title

> **title**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:12](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoNavigation.ts#L12)

Display title of the navigation node.
