[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteFlatRouting

# Interface: GinkoCmsSiteFlatRouting

Defined in: [runtime/types/index.ts:65](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L65)

Routing configuration for flat (non-hierarchical) collections. Exactly one mode must be set.

## Properties

### pathMapByLocale?

> `optional` **pathMapByLocale?**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

Defined in: [runtime/types/index.ts:71](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L71)

Explicit path maps per locale for custom slug-to-path mapping. Highest priority.

***

### prefix?

> `optional` **prefix?**: `string`

Defined in: [runtime/types/index.ts:67](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L67)

Single URL prefix for all locales (e.g., `'/blog'`).

***

### prefixByLocale?

> `optional` **prefixByLocale?**: `Record`\<`string`, `string`\>

Defined in: [runtime/types/index.ts:69](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L69)

Locale-specific URL prefixes (e.g., `{ de: '/blog', en: '/articles' }`).
