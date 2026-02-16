<script setup lang="ts">
const route = useRoute()
const { locale } = useCmsLocale()

const slug = computed(() => route.params.slug as string)

// Fetch the legal document
const { data: doc, pending, error } = await useCmsItem('legal', slug.value)

// SEO
useHead(() => ({
  title: doc.value?.title ? `${doc.value.title} - CMS Demo` : 'Legal - CMS Demo',
}))

const labels = computed(() => ({
  notFound: locale.value === 'de' ? 'Dokument nicht gefunden' : 'Document not found',
  lastUpdated: locale.value === 'de' ? 'Zuletzt aktualisiert' : 'Last updated',
}))

const formattedDate = computed(() => {
  if (!doc.value?.lastUpdated)
    return ''
  return new Date(doc.value.lastUpdated as number).toLocaleDateString(
    locale.value === 'de' ? 'de-DE' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )
})
</script>

<template>
  <div>
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
    <div v-else-if="!doc" class="text-center py-12">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {{ labels.notFound }}
      </h1>
    </div>

    <!-- Document Content -->
    <article v-else class="max-w-3xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ doc.title }}
        </h1>

        <p v-if="formattedDate" class="text-gray-600">
          {{ labels.lastUpdated }}: {{ formattedDate }}
        </p>
      </header>

      <!-- Fallback indicator -->
      <div
        v-if="doc._fallback && Object.keys(doc._fallback).length"
        class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800"
      >
        Some content on this page is using fallback translations.
      </div>

      <!-- Content -->
      <div
        class="prose prose-lg max-w-none"
        v-html="doc.content"
      />
    </article>
  </div>
</template>
