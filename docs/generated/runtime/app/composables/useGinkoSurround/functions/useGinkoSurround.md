[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoSurround](../README.md) / useGinkoSurround

# Function: useGinkoSurround()

> **useGinkoSurround**\<`K`\>(`collectionKey`, `options?`): `Promise`\<[`UseGinkoSurroundResult`](../interfaces/UseGinkoSurroundResult.md)\>

Defined in: [runtime/app/composables/useGinkoSurround.ts:58](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoSurround.ts#L58)

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
const { prev, next } = await useGinkoSurround('wiki', { scope: 'section' })
```
