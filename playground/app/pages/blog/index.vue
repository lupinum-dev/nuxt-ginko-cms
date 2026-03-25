<script setup lang="ts">
useHead({
  title: 'Ginko Nuxt Blog',
})

const { data: posts, pending, error } = await useGinkoItems('blog', {
  sort: ['updatedAt', 'desc'],
  limit: 24,
})
</script>

<template>
  <div class="space-y-8">
    <section class="rounded-[2.5rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-8">
      <p class="text-xs uppercase tracking-[0.22em] text-[var(--ginko-muted)]">
        Collection list
      </p>
      <h1 class="mt-3 text-4xl font-semibold">
        `useGinkoItems('blog')`
      </h1>
      <p class="mt-4 max-w-2xl text-sm leading-7 text-[var(--ginko-muted)]">
        The flat collection route is driven by `ginkoCms.site.collections.blog`, while content is fetched through the module BFF instead of direct CMS client code.
      </p>
    </section>

    <p
      v-if="pending"
      class="text-sm text-[var(--ginko-muted)]"
    >
      Loading posts...
    </p>
    <p
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ String(error) }}
    </p>

    <div
      v-else
      class="grid gap-5 lg:grid-cols-2"
    >
      <BlogCard
        v-for="post in posts"
        :key="post.id || post.slug"
        :post="post"
      />
    </div>
  </div>
</template>
