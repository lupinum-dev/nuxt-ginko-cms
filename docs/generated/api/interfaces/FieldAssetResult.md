[**nuxt-ginko-cms**](../../README.md)

***

[nuxt-ginko-cms](../../README.md) / [api](../README.md) / FieldAssetResult

# Interface: FieldAssetResult

Defined in: [runtime/types/api.ts:96](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L96)

Result of scanning a field for asset references.

## Properties

### assetIds

> **assetIds**: `string`[]

Defined in: [runtime/types/api.ts:100](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L100)

Array of referenced asset IDs.

***

### fieldName

> **fieldName**: `string`

Defined in: [runtime/types/api.ts:98](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L98)

The field name that contains asset references.

***

### usageType

> **usageType**: `"direct"` \| `"embedded"`

Defined in: [runtime/types/api.ts:102](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/api.ts#L102)

Whether the asset is directly referenced or embedded in rich text.
