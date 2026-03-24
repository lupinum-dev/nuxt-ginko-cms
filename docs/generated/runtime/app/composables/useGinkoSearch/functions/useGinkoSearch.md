[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSearch](../README.md) / useGinkoSearch

# Function: useGinkoSearch()

> **useGinkoSearch**(`collectionKey?`, `options?`): [`UseGinkoSearchModalResult`](../interfaces/UseGinkoSearchModalResult.md) \| [`UseGinkoSearchResult`](../interfaces/UseGinkoSearchResult.md)

Defined in: [runtime/app/composables/useGinkoSearch.ts:173](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L173)

Full-text search composable with built-in modal state, debounce, and serial request handling.

When called without a collection key, returns modal-only state for controlling the search UI.
When called with a collection key, also provides reactive query/results/pending/error state.

## Parameters

### collectionKey?

`string`

Collection to search within, or omit for modal-only state.

### options?

[`UseGinkoSearchOptions`](../interfaces/UseGinkoSearchOptions.md) = `{}`

Search behavior options (debounce, minLength, limit, locale).

## Returns

[`UseGinkoSearchModalResult`](../interfaces/UseGinkoSearchModalResult.md) \| [`UseGinkoSearchResult`](../interfaces/UseGinkoSearchResult.md)

Modal-only result when no collection key; full search result otherwise.

## Example

```ts
// Modal-only (e.g., in a layout)
const { isOpen, openSearch, closeSearch } = useGinkoSearch()

// Full search
const { query, results, pending, clear } = useGinkoSearch('blog', {
  debounce: 220,
  minLength: 2,
  limit: 8,
})
```
