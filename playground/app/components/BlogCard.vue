<script setup lang="ts">
defineProps<{
  post: {
    slug?: string
    path?: string
    title?: string
    description?: string
    date?: string
    readingTime?: string
    badge?: string
  }
}>()
</script>

<template>
  <article class="rounded-[2rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-6 shadow-[0_18px_50px_rgba(23,32,51,0.08)]">
    <div class="mb-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--ginko-muted)]">
      <span
        v-if="post.badge"
        class="rounded-full bg-[var(--ginko-accent-soft)] px-3 py-1 text-[var(--ginko-accent)]"
      >
        {{ post.badge }}
      </span>
      <span v-if="post.date">{{ post.date }}</span>
      <span v-if="post.readingTime">{{ post.readingTime }}</span>
    </div>

    <h2 class="text-2xl font-semibold leading-tight">
      <NuxtLink
        :to="post.path || `/blog/${post.slug}`"
        class="transition hover:text-[var(--ginko-accent)]"
      >
        {{ post.title || "Untitled" }}
      </NuxtLink>
    </h2>

    <p
      v-if="post.description"
      class="mt-3 text-sm leading-7 text-[var(--ginko-muted)]"
    >
      {{ post.description }}
    </p>
  </article>
</template>
