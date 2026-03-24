[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoNavigation](../README.md) / useGinkoNavigation

# Function: useGinkoNavigation()

> **useGinkoNavigation**\<`K`\>(`collectionKey`, `options?`): [`UseGinkoNavigationResult`](../interfaces/UseGinkoNavigationResult.md)

Defined in: [runtime/app/composables/useGinkoNavigation.ts:61](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoNavigation.ts#L61)

Fetches the hierarchy navigation tree for a collection.

Uses `op: 'navigation'`. Only valid for hierarchy collections — calling on a flat
collection returns a server 400 error.

## Type Parameters

### K

`K` *extends* `string` & `object`

## Parameters

### collectionKey

`K`

The hierarchy collection to fetch navigation for.

### options?

[`UseGinkoNavigationOptions`](../interfaces/UseGinkoNavigationOptions.md) = `{}`

Navigation options.

## Returns

[`UseGinkoNavigationResult`](../interfaces/UseGinkoNavigationResult.md)

Reactive navigation tree, pending state, error, and refresh function.

## Example

```ts
const { data: navigation } = useGinkoNavigation('wiki')
```
