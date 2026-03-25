[**nuxt-ginko-cms**](../../README.md)

***

[nuxt-ginko-cms](../../README.md) / [ginko](../README.md) / UseGinkoCopyPageResult

# Interface: UseGinkoCopyPageResult

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:23](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoCopyPage.ts#L23)

Return shape of [useGinkoCopyPage](../functions/useGinkoCopyPage.md).

## Properties

### copied

> **copied**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:29](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoCopyPage.ts#L29)

Whether the content was recently copied. Auto-resets after `resetDelay`.

***

### copy

> **copy**: () => `Promise`\<`void`\>

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:27](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoCopyPage.ts#L27)

Copies the markdown to the clipboard and sets `copied` to `true`.

#### Returns

`Promise`\<`void`\>

***

### markdown

> **markdown**: `ComputedRef`\<`string`\>

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:25](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoCopyPage.ts#L25)

Computed markdown string (frontmatter + MDC body) from the current page data.
