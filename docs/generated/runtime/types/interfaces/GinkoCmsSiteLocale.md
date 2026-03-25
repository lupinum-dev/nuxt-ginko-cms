[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteLocale

# Interface: GinkoCmsSiteLocale

Defined in: [runtime/types/index.ts:22](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L22)

Configuration for a single locale in the site.

## Properties

### code

> **code**: `string`

Defined in: [runtime/types/index.ts:24](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L24)

ISO locale code (e.g., `'de'`, `'en'`). Must be unique across locales.

***

### hreflang

> **hreflang**: `string`

Defined in: [runtime/types/index.ts:26](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L26)

BCP 47 hreflang tag (e.g., `'de-DE'`, `'en-US'`). Used in `<link rel="alternate">`.

***

### isDefault?

> `optional` **isDefault?**: `boolean`

Defined in: [runtime/types/index.ts:28](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L28)

Whether this is the default locale. Only one locale should be marked as default.
