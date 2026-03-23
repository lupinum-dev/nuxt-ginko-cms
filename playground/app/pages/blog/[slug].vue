<script setup lang="ts">
const { data: post, pending, error } = await useGinkoPage('blog', {
  includeBody: true,
})

useHead(() => ({
  title: String(post.value?.title || 'Blog post'),
}))
</script>

<template>
  <article class="space-y-8">
    <p v-if="pending" class="text-sm text-[var(--ginko-muted)]">
      Loading post...
    </p>
    <p v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ String(error) }}
    </p>

    <template v-else-if="post">
      <section class="rounded-[2.5rem] border border-[var(--ginko-line)] bg-[var(--ginko-panel)] p-8">
        <NuxtLink to="/blog" class="text-xs uppercase tracking-[0.18em] text-[var(--ginko-muted)] transition hover:text-[var(--ginko-accent)]">
          Back to blog
        </NuxtLink>
        <div class="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[var(--ginko-muted)]">
          <span v-if="post.badge" class="rounded-full bg-[var(--ginko-accent-soft)] px-3 py-1 text-[var(--ginko-accent)]">
            {{ post.badge }}
          </span>
          <span v-if="post.date">{{ post.date }}</span>
          <span v-if="post.readingTime">{{ post.readingTime }}</span>
        </div>
        <h1 class="mt-5 text-4xl font-semibold leading-tight">
          {{ post.title || "Untitled" }}
        </h1>
        <p v-if="post.description" class="mt-4 max-w-3xl text-base leading-8 text-[var(--ginko-muted)]">
          {{ post.description }}
        </p>
      </section>

      <section class="rounded-[2.5rem] border border-[var(--ginko-line)] bg-white/70 p-8">
        <pre class="overflow-x-auto whitespace-pre-wrap text-sm leading-8 text-[var(--ginko-ink)]">{{ post.content || "" }}</pre>
      </section>
    </template>
  </article>
</template>
