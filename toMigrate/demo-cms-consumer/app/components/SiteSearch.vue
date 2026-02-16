<script setup lang="ts">
import type { CmsItem, SearchIndexEntry } from '@lupinum/cms-nuxt'
import Fuse from 'fuse.js'

interface SearchableItem extends SearchIndexEntry {
  _type: 'blog' | 'legal'
}

const config = useRuntimeConfig()
const isPreview = computed(() => config.public.cmsNuxt.preview)
const { locale } = useCmsLocale()

// Search state
const query = ref('')
const debouncedQuery = ref('')
const selectedIndex = ref(0)
const searchInputRef = ref<HTMLInputElement>()

// Lazy loading state
const searchableItems = ref<SearchableItem[]>([])
const hasFetched = ref(false)
const pending = ref(false)

// Manual debounce for query
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(query, (newQuery) => {
  if (debounceTimer)
    clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = newQuery
  }, 200)
})

// Strip markdown/HTML for excerpt generation
function stripMarkdown(content: string): string {
  return content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove emphasis
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

// Build search entries from CMS items
function buildSearchEntries(items: CmsItem[], collection: string): SearchableItem[] {
  const collectionType: 'blog' | 'legal' = collection === 'blogs' ? 'blog' : 'legal'
  const routePrefix = collection === 'blogs' ? '/blog' : '/legal'

  return items.map((item) => {
    const content = typeof item.content === 'string' ? item.content : ''
    const strippedContent = stripMarkdown(content)

    return {
      id: item._id,
      slug: item.slug,
      collection,
      route: `${routePrefix}/${item.slug}`,
      title: (item.title as string) || item.slug,
      excerpt: strippedContent.slice(0, 300),
      _type: collectionType,
      _route: `${routePrefix}/${item.slug}`,
    }
  })
}

// Lazy fetch search data on first search
watch(debouncedQuery, async (queryValue) => {
  if (hasFetched.value || !queryValue.trim())
    return

  pending.value = true
  try {
    if (isPreview.value) {
      // Dev mode: fetch collections dynamically
      const [blogsResult, legalResult] = await Promise.all([
        useCmsCollection<CmsItem>('blogs'),
        useCmsCollection<CmsItem>('legal'),
      ])

      const blogEntries = buildSearchEntries(blogsResult.data.value?.items || [], 'blogs')
      const legalEntries = buildSearchEntries(legalResult.data.value?.items || [], 'legal')

      searchableItems.value = [...blogEntries, ...legalEntries]
    }
    else {
      // Production mode: load pre-built search index
      const { data } = await useCmsSearchIndex()

      if (data.value?.entries) {
        searchableItems.value = data.value.entries.map((entry) => {
          const type: 'blog' | 'legal' = entry.collection === 'blogs' ? 'blog' : 'legal'
          return {
            ...entry,
            _type: type,
            _route: entry.route,
          }
        })
      }
    }
    hasFetched.value = true
  }
  finally {
    pending.value = false
  }
})

// Initialize Fuse.js - lower threshold for better precision
const fuse = computed(() => {
  if (!searchableItems.value.length)
    return null

  return new Fuse(searchableItems.value, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'excerpt', weight: 2 },
      { name: 'content', weight: 1 },
      { name: 'slug', weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
})

// Search results
const results = computed<SearchableItem[]>(() => {
  const trimmedQuery = debouncedQuery.value.trim()
  if (!trimmedQuery || !fuse.value)
    return []

  return fuse.value
    .search(trimmedQuery)
    .slice(0, 10)
    .map(result => result.item)
})

const hasResults = computed(() => results.value.length > 0)
const isSearching = computed(() => query.value.trim().length > 0)

// Reset selection when results change
watch(results, () => {
  selectedIndex.value = 0
})

// Keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (!isSearching.value)
    return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (results.value[selectedIndex.value]) {
        navigateTo(results.value[selectedIndex.value]._route)
      }
      break
    case 'Escape':
      event.preventDefault()
      query.value = ''
      searchInputRef.value?.blur()
      break
  }
}

/**
 * Create a snippet around the first query match with context
 * Search index entries have pre-computed excerpts (stripped of markdown/HTML)
 */
function getSnippet(item: SearchableItem): string {
  const searchTerms = debouncedQuery.value.trim().toLowerCase().split(/\s+/).filter(Boolean)

  // Use the pre-computed excerpt from the search index
  const textToSearch = item.excerpt || ''

  if (!searchTerms.length || !textToSearch) {
    return textToSearch.slice(0, 140) || ''
  }

  const lowerText = textToSearch.toLowerCase()

  // Find the first matching term's position
  let matchStart = -1
  for (const term of searchTerms) {
    const pos = lowerText.indexOf(term)
    if (pos !== -1 && (matchStart === -1 || pos < matchStart)) {
      matchStart = pos
    }
  }

  if (matchStart === -1) {
    // No match found, return beginning
    return textToSearch.length > 140 ? `${textToSearch.slice(0, 140)}...` : textToSearch
  }

  // Extract snippet around the match
  const contextBefore = 40
  const contextAfter = 100
  const start = Math.max(0, matchStart - contextBefore)
  const end = Math.min(textToSearch.length, matchStart + contextAfter)

  let snippet = textToSearch.slice(start, end)
  if (start > 0)
    snippet = `...${snippet}`
  if (end < textToSearch.length)
    snippet = `${snippet}...`

  return snippet
}

/**
 * Highlight search terms in text using the actual query words
 */
function highlightText(text: string): string {
  const searchTerms = debouncedQuery.value.trim().split(/\s+/).filter(t => t.length >= 2)
  if (!searchTerms.length)
    return escapeHtml(text)

  // Build a regex that matches any of the search terms (case-insensitive)
  const escaped = searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')

  // Split by matches and rebuild with highlights
  const parts = text.split(regex)
  return parts
    .map((part) => {
      if (searchTerms.some(term => part.toLowerCase() === term.toLowerCase())) {
        return `<mark class="bg-yellow-100 text-yellow-900 rounded px-0.5">${escapeHtml(part)}</mark>`
      }
      return escapeHtml(part)
    })
    .join('')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getTypeLabel(type: 'blog' | 'legal'): string {
  if (type === 'blog')
    return 'Blog'
  return locale.value === 'de' ? 'Rechtliches' : 'Legal'
}

function clearSearch() {
  query.value = ''
  searchInputRef.value?.focus()
}

const labels = computed(() => ({
  placeholder: locale.value === 'de' ? 'Suchen...' : 'Search...',
  noResults: locale.value === 'de' ? 'Keine Ergebnisse gefunden' : 'No results found',
  tryDifferent: locale.value === 'de' ? 'Versuche andere Suchbegriffe' : 'Try different keywords',
  loading: locale.value === 'de' ? 'Laden...' : 'Loading...',
  hint: locale.value === 'de' ? 'Durchsuche Blog-Beiträge und Dokumente' : 'Search blog posts and documents',
  navigation: locale.value === 'de' ? 'zum Navigieren' : 'to navigate',
  select: locale.value === 'de' ? 'zum Auswählen' : 'to select',
  close: locale.value === 'de' ? 'zum Schließen' : 'to close',
}))
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Search Input -->
    <div class="relative">
      <div class="relative">
        <input
          ref="searchInputRef"
          v-model="query"
          type="search"
          :placeholder="labels.placeholder"
          class="w-full h-12 px-4 pl-11 pr-10 text-base bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          @keydown="handleKeydown"
        >
        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          v-if="query"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          @click="clearSearch"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p v-if="!isSearching" class="mt-2 text-sm text-gray-500 text-center">
        {{ labels.hint }}
      </p>
    </div>

    <!-- Results Dropdown -->
    <div
      v-if="isSearching"
      class="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
    >
      <!-- Loading -->
      <div v-if="pending" class="p-8 text-center">
        <div class="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <p class="mt-2 text-sm text-gray-500">
          {{ labels.loading }}
        </p>
      </div>

      <!-- No Results -->
      <div v-else-if="!hasResults" class="p-8 text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="font-medium text-gray-900">
          {{ labels.noResults }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {{ labels.tryDifferent }}
        </p>
      </div>

      <!-- Results List -->
      <template v-else-if="hasResults">
        <div class="max-h-[70vh] overflow-y-auto">
          <NuxtLink
            v-for="(result, index) in results"
            :key="result.id"
            :to="result._route"
            class="block px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors"
            :class="index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'"
            @mouseenter="selectedIndex = index"
          >
            <div class="flex items-start gap-3">
              <!-- Type Icon -->
              <div
                class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                :class="result._type === 'blog' ? 'bg-blue-100' : 'bg-gray-100'"
              >
                <svg v-if="result._type === 'blog'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <svg v-else class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3
                  class="font-medium text-gray-900 truncate"
                  v-html="highlightText(result.title)"
                />
                <p
                  class="mt-1 text-sm text-gray-600 line-clamp-2"
                  v-html="highlightText(getSnippet(result))"
                />
                <div class="mt-1.5 flex items-center gap-2">
                  <span
                    class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="result._type === 'blog' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                  >
                    {{ getTypeLabel(result._type) }}
                  </span>
                  <span class="text-xs text-gray-400">/{{ result.slug }}</span>
                </div>
              </div>

              <!-- Arrow -->
              <div
                class="flex-shrink-0 w-5 h-5 text-gray-400 mt-1 transition-transform"
                :class="index === selectedIndex ? 'translate-x-0.5' : ''"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Footer -->
        <div class="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono shadow-sm">↑</kbd>
              <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono shadow-sm">↓</kbd>
              <span class="ml-1">{{ labels.navigation }}</span>
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono shadow-sm">↵</kbd>
              <span class="ml-1">{{ labels.select }}</span>
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono shadow-sm">esc</kbd>
              <span class="ml-1">{{ labels.close }}</span>
            </span>
          </div>
          <span class="text-gray-400">
            {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
