[**@lupinum/ginko-nuxt**](../../README.md)

***

[@lupinum/ginko-nuxt](../../README.md) / [ginko](../README.md) / UseGinkoCopyPageOptions

# Interface: UseGinkoCopyPageOptions

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:13](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoCopyPage.ts#L13)

Options for [useGinkoCopyPage](../functions/useGinkoCopyPage.md).

## Properties

### bodyField?

> `optional` **bodyField?**: `string`

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:15](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoCopyPage.ts#L15)

The field name containing the page body content.

#### Default Value

`'body'`

***

### frontmatterFields?

> `optional` **frontmatterFields?**: `string`[]

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:17](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoCopyPage.ts#L17)

Specific frontmatter fields to include. When omitted, all non-body fields are included.

***

### resetDelay?

> `optional` **resetDelay?**: `number`

Defined in: [runtime/app/composables/useGinkoCopyPage.ts:19](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoCopyPage.ts#L19)

Delay in milliseconds before resetting the `copied` flag.

#### Default Value

`2000`
