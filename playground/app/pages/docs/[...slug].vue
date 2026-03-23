<script setup lang="ts">
const { data: page, pending, error } = await useGinkoPage('docs', {
  includeBody: true,
})
const { data: navigation } = useGinkoNavigation('docs')
const { prev, next } = await useGinkoSurround('docs')

useHead(() => ({
  title: String(page.value?.title || 'Docs'),
}))
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[0.78fr_1.55fr]">
    <aside class="space-y-6">
      <DocsSearch />

      <section class="rounded-[2rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-5">
        <p class="text-xs uppercase tracking-[0.22em] text-[var(--ginko-muted)]">
          Navigation
        </p>
        <h2 class="mt-2 text-lg font-semibold">
          `useGinkoNavigation('docs')`
        </h2>

        <ul class="mt-4 space-y-3 text-sm">
          <li v-for="entry in navigation" :key="entry.path || entry.slug">
            <NuxtLink
              :to="entry.path || '/docs'"
              class="block rounded-2xl border border-[var(--ginko-line)] bg-white/75 px-4 py-3 transition hover:border-[var(--ginko-accent)] hover:bg-white"
            >
              {{ entry.title || entry.slug || "Untitled" }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </aside>

    <article class="space-y-6">
      <p v-if="pending" class="text-sm text-[var(--ginko-muted)]">
        Loading docs page...
      </p>
      <p v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ String(error) }}
      </p>

      <template v-else-if="page">
        <section class="rounded-[2.5rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-8">
          <p class="text-xs uppercase tracking-[0.22em] text-[var(--ginko-muted)]">
            Resolved with `useGinkoPage('docs')`
          </p>
          <h1 class="mt-3 text-4xl font-semibold leading-tight">
            {{ page.title || "Untitled" }}
          </h1>
          <p v-if="page.description" class="mt-4 text-base leading-8 text-[var(--ginko-muted)]">
            {{ page.description }}
          </p>
        </section>

        <section class="rounded-[2.5rem] border border-[var(--ginko-line)] bg-white/70 p-8">
          <pre class="overflow-x-auto whitespace-pre-wrap text-sm leading-8 text-[var(--ginko-ink)]">{{ page.content || "" }}</pre>
        </section>

        <section class="grid gap-4 md:grid-cols-2">
          <NuxtLink
            v-if="prev"
            :to="prev.path"
            class="rounded-[1.75rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-5 transition hover:border-[var(--ginko-accent)]"
          >
            <p class="text-xs uppercase tracking-[0.18em] text-[var(--ginko-muted)]">
              Previous
            </p>
            <p class="mt-2 text-lg font-medium">
              {{ prev.title || prev.path }}
            </p>
          </NuxtLink>
          <div v-else />

          <NuxtLink
            v-if="next"
            :to="next.path"
            class="rounded-[1.75rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-5 text-left transition hover:border-[var(--ginko-accent)]"
          >
            <p class="text-xs uppercase tracking-[0.18em] text-[var(--ginko-muted)]">
              Next
            </p>
            <p class="mt-2 text-lg font-medium">
              {{ next.title || next.path }}
            </p>
          </NuxtLink>
        </section>
      </template>
    </article>
  </div>
</template>
