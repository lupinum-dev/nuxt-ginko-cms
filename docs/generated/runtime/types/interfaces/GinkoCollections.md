[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCollections

# Interface: GinkoCollections

Defined in: [runtime/types/index.ts:14](https://github.com/lupinum-dev/ginko-nuxt/blob/3cdd0641fb732f086fddeef0f401b78206eb4c70/src/runtime/types/index.ts#L14)

Augmentable interface mapping collection keys to their item types.

Extend this interface in your project to get type-safe composables:
```ts
declare module '@lupinum/ginko-nuxt/runtime/types' {
  interface GinkoCollections {
    blog: BlogPost
    wiki: WikiPage
  }
}
```
