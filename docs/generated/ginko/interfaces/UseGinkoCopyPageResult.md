[**@lupinum/ginko-nuxt**](../../README.md)

***

[@lupinum/ginko-nuxt](../../README.md) / [ginko](../README.md) / UseGinkoCopyPageResult

# Interface: UseGinkoCopyPageResult

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:23](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoCopyPage.ts#L23)

Return shape of [useGinkoCopyPage](../functions/useGinkoCopyPage.md).

## Properties

### copied

> **copied**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:29](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoCopyPage.ts#L29)

Whether the content was recently copied. Auto-resets after `resetDelay`.

***

### copy

> **copy**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:27](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoCopyPage.ts#L27)

Copies the markdown to the clipboard and sets `copied` to `true`.

#### Returns

`Promise`\<`void`\>

***

### markdown

> **markdown**: `ComputedRef`\<`string`\>

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:25](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoCopyPage.ts#L25)

Computed markdown string (frontmatter + MDC body) from the current page data.
