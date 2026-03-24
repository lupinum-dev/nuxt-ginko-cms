[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteLocale

# Interface: GinkoCmsSiteLocale

Defined in: [runtime/types/index.ts:21](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L21)

Configuration for a single locale in the site.

## Properties

### code

> **code**: `string`

Defined in: [runtime/types/index.ts:23](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L23)

ISO locale code (e.g., `'de'`, `'en'`). Must be unique across locales.

***

### hreflang

> **hreflang**: `string`

Defined in: [runtime/types/index.ts:25](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L25)

BCP 47 hreflang tag (e.g., `'de-DE'`, `'en-US'`). Used in `<link rel="alternate">`.

***

### isDefault?

> `optional` **isDefault?**: `boolean`

Defined in: [runtime/types/index.ts:27](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L27)

Whether this is the default locale. Only one locale should be marked as default.
