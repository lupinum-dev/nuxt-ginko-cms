[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteConfig

# Interface: GinkoCmsSiteConfig

Defined in: [runtime/types/index.ts:152](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L152)

Top-level site configuration DSL.

Passed as `ginkoCms.site` in `nuxt.config.ts`. Defines locales, routing strategy,
collections, search behavior, and sitemap settings.

## Properties

### collections

> **collections**: `Record`\<`string`, [`GinkoCmsSiteCollection`](../type-aliases/GinkoCmsSiteCollection.md)\>

Defined in: [runtime/types/index.ts:162](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L162)

Collection definitions keyed by collection name.

***

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [runtime/types/index.ts:154](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L154)

Default locale code. Inferred from `isDefault` locale or first locale if not set.

***

### locales

> **locales**: readonly [`GinkoCmsSiteLocale`](GinkoCmsSiteLocale.md)[]

Defined in: [runtime/types/index.ts:156](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L156)

Available locales. Must include at least one valid locale.

***

### routing?

> `optional` **routing?**: [`GinkoCmsSiteRouting`](GinkoCmsSiteRouting.md)

Defined in: [runtime/types/index.ts:158](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L158)

Global routing strategy.

***

### search?

> `optional` **search?**: [`GinkoCmsSiteSearch`](GinkoCmsSiteSearch.md)

Defined in: [runtime/types/index.ts:164](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L164)

Global search configuration.

***

### sitemap?

> `optional` **sitemap?**: `boolean` \| [`GinkoCmsSiteSitemap`](GinkoCmsSiteSitemap.md)

Defined in: [runtime/types/index.ts:166](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L166)

Sitemap endpoint configuration. Pass `true` for defaults, `false` to disable.

***

### staticRoutes?

> `optional` **staticRoutes?**: readonly `string`[]

Defined in: [runtime/types/index.ts:160](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L160)

Non-CMS routes to include in sitemap generation (e.g., `['/', '/kontakt']`).
