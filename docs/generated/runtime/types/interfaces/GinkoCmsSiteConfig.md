[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteConfig

# Interface: GinkoCmsSiteConfig

Defined in: [runtime/types/index.ts:151](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L151)

Top-level site configuration DSL.

Passed as `ginkoCms.site` in `nuxt.config.ts`. Defines locales, routing strategy,
collections, search behavior, and sitemap settings.

## Properties

### collections

> **collections**: `Record`\<`string`, [`GinkoCmsSiteCollection`](../type-aliases/GinkoCmsSiteCollection.md)\>

Defined in: [runtime/types/index.ts:161](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L161)

Collection definitions keyed by collection name.

***

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [runtime/types/index.ts:153](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L153)

Default locale code. Inferred from `isDefault` locale or first locale if not set.

***

### locales

> **locales**: readonly [`GinkoCmsSiteLocale`](GinkoCmsSiteLocale.md)[]

Defined in: [runtime/types/index.ts:155](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L155)

Available locales. Must include at least one valid locale.

***

### routing?

> `optional` **routing?**: [`GinkoCmsSiteRouting`](GinkoCmsSiteRouting.md)

Defined in: [runtime/types/index.ts:157](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L157)

Global routing strategy.

***

### search?

> `optional` **search?**: [`GinkoCmsSiteSearch`](GinkoCmsSiteSearch.md)

Defined in: [runtime/types/index.ts:163](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L163)

Global search configuration.

***

### sitemap?

> `optional` **sitemap?**: `boolean` \| [`GinkoCmsSiteSitemap`](GinkoCmsSiteSitemap.md)

Defined in: [runtime/types/index.ts:165](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L165)

Sitemap endpoint configuration. Pass `true` for defaults, `false` to disable.

***

### staticRoutes?

> `optional` **staticRoutes?**: readonly `string`[]

Defined in: [runtime/types/index.ts:159](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L159)

Non-CMS routes to include in sitemap generation (e.g., `['/', '/kontakt']`).
