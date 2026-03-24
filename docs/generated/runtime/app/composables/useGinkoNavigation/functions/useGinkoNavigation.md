[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoNavigation](../README.md) / useGinkoNavigation

# Function: useGinkoNavigation()

> **useGinkoNavigation**\<`K`\>(`collectionKey`, `options?`): `Promise`\<[`UseGinkoNavigationResult`](../interfaces/UseGinkoNavigationResult.md)\>

Defined in: [runtime/app/composables/useGinkoNavigation.ts:58](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoNavigation.ts#L58)

Fetch the raw hierarchy navigation tree for a collection.

Use this when you need the CMS tree shape directly. For docs sidebars and
section/group-aware UIs, prefer `useGinkoNav`.

## Type Parameters

### K

`K` *extends* `string` & `object`

## Parameters

### collectionKey

`K`

### options?

[`UseGinkoNavigationOptions`](../interfaces/UseGinkoNavigationOptions.md) = `{}`

## Returns

`Promise`\<[`UseGinkoNavigationResult`](../interfaces/UseGinkoNavigationResult.md)\>

## Example

```ts
const { data: navigation } = await useGinkoNavigation('docs')
```
