[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoNavSection

# Interface: GinkoNavSection

Defined in: [runtime/types/index.ts:171](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L171)

A navigation section (top-level sidebar partition).

## Properties

### groups

> **groups**: [`GinkoNavGroup`](GinkoNavGroup.md)[]

Defined in: [runtime/types/index.ts:183](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L183)

Groups within this section.

***

### icon?

> `optional` **icon?**: `string`

Defined in: [runtime/types/index.ts:181](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L181)

Optional icon string (e.g., `'lucide:rocket'`).

***

### id

> **id**: `string`

Defined in: [runtime/types/index.ts:173](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L173)

Slugified section id.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/types/index.ts:179](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L179)

First routable page within the section.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/types/index.ts:175](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L175)

Original section slug when the hierarchy uses explicit section nodes.

***

### title

> **title**: `string`

Defined in: [runtime/types/index.ts:177](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L177)

Display title.
