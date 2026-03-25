[**nuxt-ginko-cms**](../../README.md)

***

[nuxt-ginko-cms](../../README.md) / [module](../README.md) / GinkoCmsNuxtModuleOptions

# Interface: GinkoCmsNuxtModuleOptions

Defined in: [module.ts:20](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/module.ts#L20)

Module options for `nuxt-ginko-cms`.

Set in `nuxt.config.ts` under the `ginkoCms` key.

## Example

```ts
export default defineNuxtConfig({
  modules: ['nuxt-ginko-cms'],
  ginkoCms: {
    routeBase: '/api/ginko',
    site: { ... },
  },
})
```

## Properties

### routeBase?

> `optional` **routeBase?**: `string`

Defined in: [module.ts:22](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/module.ts#L22)

Base path for the query, resolve, and sitemap server endpoints.

#### Default Value

`'/api/ginko'`

***

### site?

> `optional` **site?**: [`GinkoCmsSiteConfig`](../../runtime/types/interfaces/GinkoCmsSiteConfig.md)

Defined in: [module.ts:24](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/module.ts#L24)

Site configuration DSL defining locales, collections, routing, search, and sitemap.
