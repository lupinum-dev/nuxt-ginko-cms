[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteSearch

# Interface: GinkoCmsSiteSearch

Defined in: [runtime/types/index.ts:139](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L139)

Global search configuration for the site.

## Properties

### defaultLimit?

> `optional` **defaultLimit?**: `number`

Defined in: [runtime/types/index.ts:143](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L143)

Default search result limit when not specified in the request.

#### Default Value

`12` (clamped 1–100)

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [runtime/types/index.ts:141](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L141)

Whether search is enabled globally.

#### Default Value

`true`
