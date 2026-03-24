[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSurround](../README.md) / useGinkoSurround

# Function: useGinkoSurround()

> **useGinkoSurround**\<`K`\>(`collectionKey`, `options?`): `Promise`\<[`UseGinkoSurroundResult`](../interfaces/UseGinkoSurroundResult.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:54](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSurround.ts#L54)

Fetches the previous and next pages surrounding a path in a hierarchy collection.

Uses `op: 'surround'`. Converts the raw `[prev, next]` array response into named refs.
Only valid for hierarchy collections.

## Type Parameters

### K

`K` *extends* `string` & `object`

## Parameters

### collectionKey

`K`

The hierarchy collection to query.

### options?

[`UseGinkoSurroundOptions`](../interfaces/UseGinkoSurroundOptions.md) = `{}`

Surround options.

## Returns

`Promise`\<[`UseGinkoSurroundResult`](../interfaces/UseGinkoSurroundResult.md)\>

Reactive prev/next items, pending state, error, and refresh function.

## Example

```ts
const { prev, next } = await useGinkoSurround('wiki')
```
