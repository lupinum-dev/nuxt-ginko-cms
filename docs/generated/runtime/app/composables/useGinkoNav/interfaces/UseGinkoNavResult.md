[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoNav](../README.md) / UseGinkoNavResult

# Interface: UseGinkoNavResult

Defined in: [runtime/app/composables/useGinkoNav.ts:160](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L160)

Return shape of [useGinkoNav](../functions/useGinkoNav.md).

## Properties

### activeSection

> **activeSection**: `Ref`\<`string`\>

Defined in: [runtime/app/composables/useGinkoNav.ts:164](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L164)

Active section id. Writable — auto-tracks route, clears override on navigation.

***

### error

> **error**: `Ref`\<`GinkoError`\>

Defined in: [runtime/app/composables/useGinkoNav.ts:172](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L172)

Error from last fetch.

***

### flat

> **flat**: `ComputedRef`\<[`GinkoNavItem`](../../../../types/interfaces/GinkoNavItem.md)[]\>

Defined in: [runtime/app/composables/useGinkoNav.ts:168](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L168)

All items flattened (for search, breadcrumbs).

***

### groups

> **groups**: `ComputedRef`\<[`GinkoNavGroup`](../../../../types/interfaces/GinkoNavGroup.md)[]\>

Defined in: [runtime/app/composables/useGinkoNav.ts:166](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L166)

Groups for the currently active section.

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoNav.ts:170](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L170)

Whether a fetch is in progress.

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoNav.ts:174](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L174)

Manually refetch.

#### Returns

`Promise`\<`void`\>

***

### sections

> **sections**: `Ref`\<[`GinkoNavSection`](../../../../types/interfaces/GinkoNavSection.md)[]\>

Defined in: [runtime/app/composables/useGinkoNav.ts:162](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNav.ts#L162)

All navigation sections (pre-grouped from CMS tree).
