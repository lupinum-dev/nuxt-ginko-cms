[**@lupinum/ginko-nuxt**](../../README.md)

***

[@lupinum/ginko-nuxt](../../README.md) / [api](../README.md) / FieldSchema

# Interface: FieldSchema

Defined in: [runtime/types/api.ts:64](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L64)

Schema definition for a single field in a collection.

## Properties

### key

> **key**: `string`

Defined in: [runtime/types/api.ts:66](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L66)

Machine-readable field key.

***

### localized?

> `optional` **localized?**: `boolean`

Defined in: [runtime/types/api.ts:70](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L70)

Whether this field supports localized values.

***

### type

> **type**: `string`

Defined in: [runtime/types/api.ts:68](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/api.ts#L68)

Field type identifier (e.g., `'text'`, `'richtext'`, `'relation'`).
