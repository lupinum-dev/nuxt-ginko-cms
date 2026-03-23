<script setup lang="ts">
const search = useGinkoSearch('docs', {
  minLength: 1,
  debounce: 120,
  limit: 6,
})
</script>

<template>
  <section class="rounded-[2rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-5">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.22em] text-[var(--ginko-muted)]">
          Docs Search
        </p>
        <h2 class="mt-1 text-lg font-semibold">
          Search with `useGinkoSearch`
        </h2>
      </div>
      <button
        v-if="search.query"
        class="text-xs uppercase tracking-[0.18em] text-[var(--ginko-muted)] transition hover:text-[var(--ginko-accent)]"
        @click="search.clear()"
      >
        Clear
      </button>
    </div>

    <input
      v-model="search.query"
      type="search"
      placeholder="Search docs content"
      class="mt-4 w-full rounded-full border border-[var(--ginko-line)] bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[var(--ginko-accent)]"
    >

    <p v-if="search.pending" class="mt-4 text-sm text-[var(--ginko-muted)]">
      Searching...
    </p>
    <p v-else-if="search.error" class="mt-4 text-sm text-red-700">
      {{ search.error }}
    </p>
    <ul v-else-if="search.results.length" class="mt-4 space-y-3">
      <li v-for="result in search.results" :key="`${result.path}:${result.title}`">
        <NuxtLink
          :to="result.path || '/docs'"
          class="block rounded-2xl border border-[var(--ginko-line)] bg-white/80 px-4 py-3 transition hover:border-[var(--ginko-accent)] hover:bg-white"
        >
          <p class="font-medium">
            {{ result.title || "Untitled" }}
          </p>
          <p v-if="result.snippet" class="mt-1 text-sm text-[var(--ginko-muted)]">
            {{ result.snippet }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
