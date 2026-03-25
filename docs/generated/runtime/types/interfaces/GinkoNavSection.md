[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoNavSection

# Interface: GinkoNavSection

Defined in: [runtime/types/index.ts:172](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L172)

A navigation section (top-level sidebar partition).

## Properties

### groups

> **groups**: [`GinkoNavGroup`](GinkoNavGroup.md)[]

Defined in: [runtime/types/index.ts:184](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L184)

Groups within this section.

***

### icon?

> `optional` **icon?**: `string`

Defined in: [runtime/types/index.ts:182](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L182)

Optional icon string (e.g., `'lucide:rocket'`).

***

### id

> **id**: `string`

Defined in: [runtime/types/index.ts:174](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L174)

Slugified section id.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:180](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L180)

First routable page within the section.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:176](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L176)

Original section slug when the hierarchy uses explicit section nodes.

***

### title

> **title**: `string`

Defined in: [runtime/types/index.ts:178](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L178)

Display title.
