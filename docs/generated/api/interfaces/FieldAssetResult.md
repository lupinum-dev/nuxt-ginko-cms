[**@lupinum/ginko-nuxt**](../../README.md)

***

[@lupinum/ginko-nuxt](../../README.md) / [api](../README.md) / FieldAssetResult

# Interface: FieldAssetResult

Defined in: [runtime/types/api.ts:96](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L96)

Result of scanning a field for asset references.

## Properties

### assetIds

> **assetIds**: `string`[]

Defined in: [runtime/types/api.ts:100](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L100)

Array of referenced asset IDs.

***

### fieldName

> **fieldName**: `string`

Defined in: [runtime/types/api.ts:98](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L98)

The field name that contains asset references.

***

### usageType

> **usageType**: `"direct"` \| `"embedded"`

Defined in: [runtime/types/api.ts:102](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L102)

Whether the asset is directly referenced or embedded in rich text.
