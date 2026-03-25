[**nuxt-ginko-cms**](../../../README.md)

***

[nuxt-ginko-cms](../../../README.md) / [runtime/types](../README.md) / GinkoCollections

# Interface: GinkoCollections

Defined in: [runtime/types/index.ts:15](https://github.com/lupinum-dev/nuxt-ginko-cms/blob/a8358dc7dc5703e1e3462f57c4ec98d4612d555a/src/runtime/types/index.ts#L15)

Augmentable interface mapping collection keys to their item types.

Extend this interface in your project to get type-safe composables:
```ts
declare module 'nuxt-ginko-cms/runtime/types' {
  interface GinkoCollections {
    blog: BlogPost
    wiki: WikiPage
  }
}
```
