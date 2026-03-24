[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoNavigation](../README.md) / NavigationItem

# Interface: NavigationItem

Defined in: [runtime/app/composables/useGinkoNavigation.ts:7](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L7)

A node in the hierarchy navigation tree.

## Properties

### badge?

> `optional` **badge?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:17](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L17)

Optional badge text for UI rendering.

***

### children

> **children**: `NavigationItem`[]

Defined in: [runtime/app/composables/useGinkoNavigation.ts:21](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L21)

Child navigation nodes. Always present (empty array for leaf nodes).

***

### icon?

> `optional` **icon?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:15](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L15)

Optional icon identifier for UI rendering.

***

### nodeKind?

> `optional` **nodeKind?**: `"page"` \| `"folder"` \| `"group"`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:13](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L13)

Kind of node: content page, folder container, or visual group.

***

### path?

> `optional` **path?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:19](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L19)

Resolved URL path for this node.

***

### slug?

> `optional` **slug?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:11](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L11)

URL slug segment for this node.

***

### title?

> `optional` **title?**: `string`

Defined in: [runtime/app/composables/useGinkoNavigation.ts:9](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L9)

Display title of the navigation node.
