<script setup lang="ts">
const { locale } = useCmsLocale()

const labels = computed(() => ({
  title: locale.value === 'de' ? 'Suche' : 'Search',
  subtitle: locale.value === 'de'
    ? 'Finde Beiträge und Dokumente'
    : 'Find posts and documents',
}))

useHead({
  title: 'Search - CMS Demo',
})
</script>

<template>
  <div class="py-8">
    <!-- Header -->
    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">
        {{ labels.title }}
      </h1>
      <p class="text-lg text-gray-600">
        {{ labels.subtitle }}
      </p>
    </header>

    <!-- Search -->
    <SiteSearch />
  </div>
</template>
