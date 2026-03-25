[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteFlatRouting

# Interface: GinkoCmsSiteFlatRouting

Defined in: [runtime/types/index.ts:66](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L66)

Routing configuration for flat (non-hierarchical) collections. Exactly one mode must be set.

## Properties

### pathMapByLocale?

> `optional` **pathMapByLocale?**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

Defined in: [runtime/types/index.ts:72](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L72)

Explicit path maps per locale for custom slug-to-path mapping. Highest priority.

***

### prefix?

> `optional` **prefix?**: `string`

Defined in: [runtime/types/index.ts:68](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L68)

Single URL prefix for all locales (e.g., `'/blog'`).

***

### prefixByLocale?

> `optional` **prefixByLocale?**: `Record`\<`string`, `string`\>

Defined in: [runtime/types/index.ts:70](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L70)

Locale-specific URL prefixes (e.g., `{ de: '/blog', en: '/articles' }`).
