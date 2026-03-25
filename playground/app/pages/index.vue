<script setup lang="ts">
const featuredPosts = await queryGinko('blog')
  .sort('updatedAt', 'desc')
  .limit(3)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .find() as Array<Record<string, any>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const docsNavigation = await queryGinko('docs').navigation() as Array<Record<string, any>>
</script>

<template>
  <div class="space-y-10">
    <section class="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div class="rounded-[2.5rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-8 shadow-[0_24px_70px_rgba(23,32,51,0.08)]">
        <p class="text-xs uppercase tracking-[0.26em] text-[var(--ginko-muted)]">
          Current module surface
        </p>
        <h1 class="mt-4 max-w-3xl text-5xl font-semibold leading-tight">
          One Nuxt module, one `ginkoCms.site`, one set of `useGinko*` composables.
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-8 text-[var(--ginko-muted)]">
          This playground exercises the current query builder, page resolver, hierarchy navigation, surround links, and search flow without any legacy `cmsGinko` or `useCms*` code left behind.
        </p>

        <div class="mt-8 flex flex-wrap gap-3 text-sm">
          <NuxtLink
            to="/blog"
            class="rounded-full bg-[var(--ginko-accent)] px-5 py-3 text-white transition hover:opacity-90"
          >
            Browse blog
          </NuxtLink>
          <NuxtLink
            to="/docs"
            class="rounded-full border border-[var(--ginko-line)] px-5 py-3 transition hover:bg-white/80"
          >
            Open docs tree
          </NuxtLink>
        </div>
      </div>

      <div class="rounded-[2.5rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-8">
        <p class="text-xs uppercase tracking-[0.22em] text-[var(--ginko-muted)]">
          Query Builder
        </p>
        <h2 class="mt-3 text-2xl font-semibold">
          `queryGinko('docs').navigation()`
        </h2>
        <ul class="mt-6 space-y-3 text-sm text-[var(--ginko-muted)]">
          <li
            v-for="entry in docsNavigation.slice(0, 5)"
            :key="entry.path || entry.slug"
            class="rounded-2xl border border-[var(--ginko-line)] bg-white/70 px-4 py-3"
          >
            <NuxtLink
              :to="entry.path || '/docs'"
              class="font-medium text-[var(--ginko-ink)] transition hover:text-[var(--ginko-accent)]"
            >
              {{ entry.title || entry.slug || "Untitled" }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section>
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-[var(--ginko-muted)]">
            Latest posts
          </p>
          <h2 class="mt-2 text-3xl font-semibold">
            `queryGinko('blog').find()`
          </h2>
        </div>
        <NuxtLink
          to="/blog"
          class="text-sm uppercase tracking-[0.16em] text-[var(--ginko-muted)] transition hover:text-[var(--ginko-accent)]"
        >
          View all
        </NuxtLink>
      </div>

      <div class="grid gap-5 lg:grid-cols-3">
        <BlogCard
          v-for="post in featuredPosts"
          :key="post.id || post.slug"
          :post="post"
        />
      </div>
    </section>
  </div>
</template>
