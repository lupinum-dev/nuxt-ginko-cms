[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCmsSiteHierarchyRouting

# Interface: GinkoCmsSiteHierarchyRouting

Defined in: [runtime/types/index.ts:75](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L75)

Routing configuration for hierarchy (tree-structured) collections. Exactly one base mode must be set.

## Properties

### baseSegment?

> `optional` **baseSegment?**: `string`

Defined in: [runtime/types/index.ts:77](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L77)

Base URL segment for all locales (e.g., `'wiki'`).

***

### baseSegmentByLocale?

> `optional` **baseSegmentByLocale?**: `Record`\<`string`, `string`\>

Defined in: [runtime/types/index.ts:79](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L79)

Locale-specific base URL segments (e.g., `{ de: 'wiki', en: 'docs' }`).

***

### rootSlug?

> `optional` **rootSlug?**: `string`

Defined in: [runtime/types/index.ts:81](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L81)

Slug of the root document to alias onto the collection base path.

***

### rootSlugByLocale?

> `optional` **rootSlugByLocale?**: `Record`\<`string`, `string`\>

Defined in: [runtime/types/index.ts:83](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L83)

Locale-specific root document slugs.
