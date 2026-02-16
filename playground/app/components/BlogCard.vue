<script setup lang="ts">
const { author, post } = defineProps<{
  post: Record<string, unknown>
  /** Pre-resolved author object (for client-side population) */
  author?: Record<string, unknown> | null
}>()

// Resolve featured image URL
const featuredimageUrl = useCmsAssetUrl(post.featuredimage as string | undefined)

// Use passed author or try to extract from post (if already populated)
const resolvedAuthor = computed(() => {
  if (author)
    return author
  if (post.author && typeof post.author === 'object') {
    return post.author as Record<string, unknown>
  }
  return null
})

const formattedDate = computed(() => {
  if (!post.publishedAt)
    return ''
  return new Date(post.publishedAt as number).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>

<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
  >
    <!-- Featured Image -->
    <div class="aspect-video bg-gray-100">
      <img
        v-if="featuredimageUrl"
        :src="featuredimageUrl"
        :alt="post.title as string || ''"
        class="w-full h-full object-cover"
      >
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        No image
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ post.title }}
      </h3>

      <p
        v-if="post.excerpt"
        class="text-gray-600 text-sm mb-3 line-clamp-2"
      >
        {{ post.excerpt }}
      </p>

      <div class="flex items-center justify-between text-sm text-gray-500">
        <!-- Author -->
        <span v-if="resolvedAuthor?.name">
          {{ resolvedAuthor.name }}
        </span>

        <!-- Date -->
        <span v-if="formattedDate">
          {{ formattedDate }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
