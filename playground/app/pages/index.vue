<script setup lang="ts">
const { locale } = useCmsLocale()

// Fetch latest blog posts for homepage
const { data: blogs, pending } = await useCmsCollection('blogs', {
  limit: 3,
})

const labels = computed(() => ({
  title: locale.value === 'de' ? 'Willkommen' : 'Welcome',
  subtitle: locale.value === 'de'
    ? 'Eine Demo des CMS Consumer Moduls'
    : 'A demo of the CMS Consumer Module',
  latestPosts: locale.value === 'de' ? 'Neueste Beiträge' : 'Latest Posts',
  viewAll: locale.value === 'de' ? 'Alle anzeigen' : 'View all',
}))
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="text-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{ labels.title }}
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        {{ labels.subtitle }}
      </p>
    </section>

    <!-- Latest Blog Posts -->
    <section class="py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ labels.latestPosts }}
        </h2>
        <NuxtLink
          to="/blog"
          class="text-blue-600 hover:text-blue-700 font-medium"
        >
          {{ labels.viewAll }} →
        </NuxtLink>
      </div>

      <div v-if="pending" class="text-center py-8">
        <div class="animate-pulse text-gray-500">
          Loading...
        </div>
      </div>

      <div
        v-else-if="blogs?.items.length"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <BlogCard
          v-for="post in blogs.items"
          :key="post.id"
          :post="post"
        />
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        No blog posts found. Create some content in the CMS!
      </div>
    </section>
  </div>
</template>
