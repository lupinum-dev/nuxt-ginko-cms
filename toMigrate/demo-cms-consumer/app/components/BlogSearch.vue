<script setup lang="ts">
import Fuse from 'fuse.js'

const { locale } = useCmsLocale()

// Fetch all blog posts
const { data: blogs, pending, error } = await useCmsCollection('blogs')

// Fetch all authors for client-side population
const { data: authorsData } = await useCmsCollection('authors')

// Search state
const query = ref('')

// Initialize Fuse.js when items are loaded
const fuse = computed(() => {
  const items = blogs.value?.items
  if (!items?.length)
    return null

  return new Fuse(items, {
    keys: ['title', 'excerpt', 'slug'],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  })
})

// Computed search results
const results = computed(() => {
  const trimmedQuery = query.value.trim()

  // Return all items when no query
  if (!trimmedQuery) {
    return blogs.value?.items ?? []
  }

  if (!fuse.value)
    return []

  return fuse.value
    .search(trimmedQuery)
    .slice(0, 10)
    .map(result => result.item)
})

const hasResults = computed(() => results.value.length > 0)
const isSearching = computed(() => query.value.trim().length > 0)
const resultCount = computed(() => results.value.length)

// Create a map of author ID to author object
const authorsMap = computed(() => {
  const map = new Map<string, Record<string, unknown>>()
  if (authorsData.value?.items) {
    for (const author of authorsData.value.items) {
      map.set(author.id, author)
    }
  }
  return map
})

// Helper to resolve author from post
function resolveAuthor(post: Record<string, unknown>): Record<string, unknown> | null {
  if (!post.author)
    return null
  // If already populated (object), use it directly
  if (typeof post.author === 'object' && post.author !== null) {
    return post.author as Record<string, unknown>
  }
  // Otherwise find by ID
  return authorsMap.value.get(post.author as string) || null
}

const labels = computed(() => ({
  placeholder: locale.value === 'de' ? 'Beiträge suchen...' : 'Search posts...',
  noResults: locale.value === 'de'
    ? `Keine Beiträge gefunden für "${query.value}"`
    : `No posts found for "${query.value}"`,
  resultsCount: locale.value === 'de'
    ? `${resultCount.value} Ergebnisse`
    : `${resultCount.value} results`,
  loading: locale.value === 'de' ? 'Laden...' : 'Loading...',
}))

function clearSearch() {
  query.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="query"
        type="search"
        :placeholder="labels.placeholder"
        class="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
      <!-- Search Icon -->
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <!-- Clear Button -->
      <button
        v-if="query"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        @click="clearSearch"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div class="animate-pulse text-gray-500">
        {{ labels.loading }}
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      Failed to load posts: {{ error.message }}
    </div>

    <!-- No Results -->
    <div v-else-if="isSearching && !hasResults" class="text-center py-8 text-gray-500">
      {{ labels.noResults }}
    </div>

    <!-- Results -->
    <template v-else>
      <!-- Results Count (when searching) -->
      <p v-if="isSearching" class="text-sm text-gray-600">
        {{ labels.resultsCount }}
      </p>

      <!-- Posts Grid -->
      <div
        v-if="hasResults"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <BlogCard
          v-for="post in results"
          :key="post.id"
          :post="post"
          :author="resolveAuthor(post)"
        />
      </div>
    </template>
  </div>
</template>
