[**@lupinum/ginko-nuxt**](../../README.md)

***

[@lupinum/ginko-nuxt](../../README.md) / [module](../README.md) / GinkoCmsNuxtModuleOptions

# Interface: GinkoCmsNuxtModuleOptions

Defined in: [module.ts:20](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/module.ts#L20)

Module options for `@lupinum/ginko-nuxt`.

Set in `nuxt.config.ts` under the `ginkoCms` key.

## Example

```ts
export default defineNuxtConfig({
  modules: ['@lupinum/ginko-nuxt'],
  ginkoCms: {
    routeBase: '/api/ginko',
    site: { ... },
  },
})
```

## Properties

### routeBase?

> `optional` **routeBase?**: `string`

Defined in: [module.ts:22](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/module.ts#L22)

Base path for the query, resolve, and sitemap server endpoints.

#### Default Value

`'/api/ginko'`

***

### site?

> `optional` **site?**: [`GinkoCmsSiteConfig`](../../runtime/types/interfaces/GinkoCmsSiteConfig.md)

Defined in: [module.ts:24](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/module.ts#L24)

Site configuration DSL defining locales, collections, routing, search, and sitemap.
