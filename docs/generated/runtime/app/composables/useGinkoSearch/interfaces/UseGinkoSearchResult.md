[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSearch](../README.md) / UseGinkoSearchResult

# Interface: UseGinkoSearchResult

Defined in: [runtime/app/composables/useGinkoSearch.ts:38](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L38)

Full return shape when [useGinkoSearch](../functions/useGinkoSearch.md) is called with a collection key.

## Extends

- [`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md)

## Properties

### clear

> **clear**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:48](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L48)

Resets query, results, error, and pending state. Invalidates in-flight requests.

#### Returns

`void`

***

### closeSearch

> **closeSearch**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:28](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L28)

Closes the search modal and cancels any pending open request.

#### Returns

`void`

#### Inherited from

[`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md).[`closeSearch`](UseGinkoSearchModalResult.md#closesearch)

***

### error

> **error**: `Ref`\<`string`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:46](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L46)

Error message from the last failed search, or `null`.

***

### isOpen

> **isOpen**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:22](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L22)

Whether the search modal is currently open.

#### Inherited from

[`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md).[`isOpen`](UseGinkoSearchModalResult.md#isopen)

***

### isSearchModalHostReady

> **isSearchModalHostReady**: `ComputedRef`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:24](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L24)

Whether a search modal host component is mounted and ready.

#### Inherited from

[`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md).[`isSearchModalHostReady`](UseGinkoSearchModalResult.md#issearchmodalhostready)

***

### openSearch

> **openSearch**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:26](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L26)

Opens the search modal. Queues a pending open if no host is mounted yet.

#### Returns

`void`

#### Inherited from

[`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md).[`openSearch`](UseGinkoSearchModalResult.md#opensearch)

***

### pending

> **pending**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:44](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L44)

Whether a search request is currently in flight.

***

### query

> **query**: `Ref`\<`string`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:40](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L40)

The current search query string (two-way bindable).

***

### registerSearchModalHost

> **registerSearchModalHost**: () => () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:32](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L32)

Registers a search modal host component. Returns an unregister function.

#### Returns

() => `void`

#### Inherited from

[`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md).[`registerSearchModalHost`](UseGinkoSearchModalResult.md#registersearchmodalhost)

***

### resetSearchModalState

> **resetSearchModalState**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:34](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L34)

Resets modal state: closes modal and clears pending open requests.

#### Returns

`void`

#### Inherited from

[`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md).[`resetSearchModalState`](UseGinkoSearchModalResult.md#resetsearchmodalstate)

***

### results

> **results**: `Ref`\<[`GinkoSearchHit`](../../../../types/interfaces/GinkoSearchHit.md)[]\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:42](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L42)

Array of search result hits.

***

### toggleSearch

> **toggleSearch**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:30](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L30)

Toggles the search modal open/closed state.

#### Returns

`void`

#### Inherited from

[`UseGinkoSearchModalResult`](UseGinkoSearchModalResult.md).[`toggleSearch`](UseGinkoSearchModalResult.md#togglesearch)
