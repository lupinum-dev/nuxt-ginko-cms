<script setup lang="ts">
const route = useRoute()
const { locale } = useCmsLocale()

const slug = computed(() => route.params.slug as string)

// Fetch the blog post with author relation populated server-side
// No need to fetch authors collection separately!
const { data: post, pending, error } = await useCmsItem('blogs', slug.value, {
  populate: ['author'],
})

// Author is now populated by the server - just extract it
const author = computed(() => {
  if (!post.value?.author) {
    return null
  }
  // Server now returns the populated author object directly
  const authorValue = post.value.author
  if (typeof authorValue === 'object' && authorValue !== null) {
    return authorValue as Record<string, unknown>
  }
  // Fallback: if still an ID (shouldn't happen with populate), return null
  return null
})

// Resolve featured image URL
const featuredimageUrl = useCmsAssetUrl(post.value?.featuredimage as string | undefined)

// SEO
useHead(() => ({
  title: post.value?.title ? `${post.value.title} - CMS Demo` : 'Blog Post - CMS Demo',
}))

const labels = computed(() => ({
  backToList: locale.value === 'de' ? '← Zurück zur Liste' : '← Back to list',
  notFound: locale.value === 'de' ? 'Beitrag nicht gefunden' : 'Post not found',
  publishedAt: locale.value === 'de' ? 'Veröffentlicht am' : 'Published on',
}))

const formattedDate = computed(() => {
  if (!post.value?.publishedAt)
    return ''
  return new Date(post.value.publishedAt).toLocaleDateString(
    locale.value === 'de' ? 'de-DE' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )
})
</script>

<template>
  <div>
    <!-- Back Link -->
    <NuxtLink
      to="/blog"
      class="inline-block mb-6 text-blue-600 hover:text-blue-700"
    >
      {{ labels.backToList }}
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-pulse text-gray-500">
        Loading...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error.message }}
    </div>

    <!-- Not Found -->
    <div v-else-if="!post" class="text-center py-12">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {{ labels.notFound }}
      </h1>
    </div>

    <!-- Post Content -->
    <article v-else class="max-w-3xl mx-auto">
      <!-- Featured Image -->
      <img
        v-if="featuredimageUrl"
        :src="featuredimageUrl"
        :alt="post.title as string || ''"
        class="w-full h-64 object-cover rounded-lg mb-8"
      >

      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ post.title }}
        </h1>

        <div class="flex items-center gap-4 text-gray-600">
          <!-- Author -->
          <BlogAuthor
            v-if="author"
            :author="author"
          />

          <!-- Date -->
          <span v-if="formattedDate">
            {{ labels.publishedAt }} {{ formattedDate }}
          </span>
        </div>

        <!-- Excerpt -->
        <p v-if="post.excerpt" class="mt-4 text-xl text-gray-600">
          {{ post.excerpt }}
        </p>
      </header>

      <!-- Fallback indicator -->
      <div
        v-if="post._fallback && Object.keys(post._fallback).length"
        class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800"
      >
        Some content on this page is using fallback translations.
      </div>

      <!-- Content -->
      <div
        class="prose prose-lg max-w-none"
        v-html="post.content"
      />
    </article>
  </div>
</template>
