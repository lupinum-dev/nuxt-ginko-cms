[**nuxt-ginko-cms**](../../../../../README.md)

***

[nuxt-ginko-cms](../../../../../README.md) / [runtime/app/composables/useGinkoList](../README.md) / useGinkoList

# Function: useGinkoList()

> **useGinkoList**\<`K`, `T`, `R`\>(`collectionKey`, `options?`): `Promise`\<[`UseGinkoListResult`](../interfaces/UseGinkoListResult.md)\<`R`\>\>

Defined in: [runtime/app/composables/useGinkoList.ts:75](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/app/composables/useGinkoList.ts#L75)

## Type Parameters

### K

`K` *extends* `string` & `object`

### T

`T` = `InferCollection`\<`K`\>

### R

`R` = `T`

## Parameters

### collectionKey

`K`

### options?

[`UseGinkoListOptions`](../interfaces/UseGinkoListOptions.md)\<`T`, `R`\> = `{}`

## Returns

`Promise`\<[`UseGinkoListResult`](../interfaces/UseGinkoListResult.md)\<`R`\>\>
