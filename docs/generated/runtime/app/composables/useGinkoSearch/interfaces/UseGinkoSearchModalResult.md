[**@lupinum/ginko-nuxt**](../../../../../README.md)

***

[@lupinum/ginko-nuxt](../../../../../README.md) / [runtime/app/composables/useGinkoSearch](../README.md) / UseGinkoSearchModalResult

# Interface: UseGinkoSearchModalResult

Defined in: [runtime/app/composables/useGinkoSearch.ts:20](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L20)

Modal-only return shape when [useGinkoSearch](../functions/useGinkoSearch.md) is called without a collection key.

## Extended by

- [`UseGinkoSearchResult`](UseGinkoSearchResult.md)

## Properties

### closeSearch

> **closeSearch**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:28](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L28)

Closes the search modal and cancels any pending open request.

#### Returns

`void`

***

### isOpen

> **isOpen**: `Ref`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:22](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L22)

Whether the search modal is currently open.

***

### isSearchModalHostReady

> **isSearchModalHostReady**: `ComputedRef`\<`boolean`\>

Defined in: [runtime/app/composables/useGinkoSearch.ts:24](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L24)

Whether a search modal host component is mounted and ready.

***

### openSearch

> **openSearch**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:26](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L26)

Opens the search modal. Queues a pending open if no host is mounted yet.

#### Returns

`void`

***

### registerSearchModalHost

> **registerSearchModalHost**: () => () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:32](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L32)

Registers a search modal host component. Returns an unregister function.

#### Returns

() => `void`

***

### resetSearchModalState

> **resetSearchModalState**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:34](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L34)

Resets modal state: closes modal and clears pending open requests.

#### Returns

`void`

***

### toggleSearch

> **toggleSearch**: () => `void`

Defined in: [runtime/app/composables/useGinkoSearch.ts:30](https://github.com/lupinum-dev/ginko-nuxt/blob/33054431620fb8be90106f41754b7b84d88636bf/src/runtime/app/composables/useGinkoSearch.ts#L30)

Toggles the search modal open/closed state.

#### Returns

`void`
