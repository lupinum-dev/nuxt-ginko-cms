[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoList](../README.md) / UseGinkoListOptions

# Interface: UseGinkoListOptions\<T, R\>

Defined in: [runtime/app/composables/useGinkoList.ts:24](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L24)

Options for [useGinkoList](../functions/useGinkoList.md).

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

### R

`R` = `T`

## Properties

### includeBody?

> `optional` **includeBody?**: `boolean`

Defined in: [runtime/app/composables/useGinkoList.ts:36](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L36)

Include full body content.

#### Default

```ts
false
```

***

### limit?

> `optional` **limit?**: `number`

Defined in: [runtime/app/composables/useGinkoList.ts:28](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L28)

Maximum items to return.

***

### locale?

> `optional` **locale?**: `string` \| `Ref`\<`string`, `string`\>

Defined in: [runtime/app/composables/useGinkoList.ts:40](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L40)

Locale override.

***

### offset?

> `optional` **offset?**: `number` \| `Ref`\<`number`, `number`\>

Defined in: [runtime/app/composables/useGinkoList.ts:30](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L30)

Items to skip. Accepts a reactive `Ref<number>` for pagination.

***

### populate?

> `optional` **populate?**: `string`[]

Defined in: [runtime/app/composables/useGinkoList.ts:34](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L34)

Fields to populate (relation expansion).

***

### sort?

> `optional` **sort?**: `string`

Defined in: [runtime/app/composables/useGinkoList.ts:26](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L26)

Sort string. Prefix with `-` for descending. E.g., `'-date'`, `'title'`.

***

### transform?

> `optional` **transform?**: (`items`) => `R`[]

Defined in: [runtime/app/composables/useGinkoList.ts:38](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L38)

Transform applied to item list.

#### Parameters

##### items

`T`[]

#### Returns

`R`[]

***

### watch?

> `optional` **watch?**: `boolean`

Defined in: [runtime/app/composables/useGinkoList.ts:42](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L42)

Watch reactive sources for refetching.

#### Default

```ts
true
```

***

### where?

> `optional` **where?**: `Record`\<`string`, `unknown`\>

Defined in: [runtime/app/composables/useGinkoList.ts:32](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/app/composables/useGinkoList.ts#L32)

Filter conditions.
