[**@lupinum/ginko-nuxt**](../../../README.md)

***

[@lupinum/ginko-nuxt](../../../README.md) / [runtime/types](../README.md) / GinkoCollections

# Interface: GinkoCollections

Defined in: [runtime/types/index.ts:14](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/types/index.ts#L14)

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
